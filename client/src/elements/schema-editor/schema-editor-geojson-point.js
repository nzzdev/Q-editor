import { bindable, inject, Loader } from "aurelia-framework";
import QConfig from "resources/QConfig";
import { isRequired } from "./helpers.js";
import autocomplete from "autocomplete.js";

@inject(QConfig, Loader)
export class SchemaEditorGeojsonPoint {
  @bindable
  schema;
  @bindable
  data;
  @bindable
  change;
  @bindable
  showNotifications;

  constructor(qConfig, loader) {
    this.qConfig = qConfig;
    this.loader = loader;
    this.isRequired = isRequired;
  }

  async schemaChanged() {
    this.applyOptions();
  }

  applyOptions() {
    if (!this.schema) {
      return;
    }
    if (this.schema.hasOwnProperty("Q:options")) {
      this.options = Object.assign(this.options, this.schema["Q:options"]);
    }
  }

  async attached() {
    const schemaEditorConfig = await this.qConfig.get("schemaEditor");
    this.showLoadingError = false;

    // if we already have a map, return here
    // this happens when array entry order is changed.
    if (this.map) {
      return;
    }

    if (!window.mapboxgl) {
      this.loader.loadModule("npm:mapbox-gl@1.1.1/dist/mapbox-gl.css!");
      window.mapboxgl = await this.loader.loadModule("mapbox-gl");
    }
    mapboxgl.accessToken = schemaEditorConfig.geojson.layer.accessToken;
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: schemaEditorConfig.geojson.layer.style,
      center: [8.5474, 47.3652],
      zoom: 13
    });

    this.map.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      "top-left"
    );
    this.map.dragRotate.disable();
    this.map.touchZoomRotate.disableRotation();

    this.map.addControl(new AutocompleteControl(), "top-right");

    // Add marker if existing point is displayed
    if (
      this.data.geometry &&
      this.data.geometry.coordinates.length >= 2 &&
      !this.marker
    ) {
      const coordinates = this.data.geometry.coordinates;
      this.marker = this.getMarker([coordinates[0], coordinates[1]]);
      this.map.jumpTo({ center: this.data.geometry.coordinates });
    }

    // Add marker to the clicked area
    this.map.on("click", event => {
      this.data.geometry.coordinates = [event.lngLat.lng, event.lngLat.lat];
      this.data.properties.label = "";
      if (!this.marker) {
        this.marker = this.getMarker([event.lngLat.lng, event.lngLat.lat]);
        if (this.change) {
          this.change();
        }
      }
    });

    // Initialize autocomplete instance
    this.autocomplete = autocomplete(
      "#autocomplete-control--search-input",
      { hint: false, openOnFocus: true, clearOnSelected: true },
      [
        {
          source: async (query, callback) => {
            try {
              const response = await fetch(
                `https://api.opencagedata.com/geocode/v1/geojson?q=${query}&key=${
                  schemaEditorConfig.geojson.opencagedata.apiKey
                }&language=${
                  schemaEditorConfig.geojson.opencagedata.language
                }&abbrv=1`
              );
              if (response.ok) {
                const json = await response.json();
                // Only show five search suggestions at a time
                callback(json.features.slice(0, 5));
              } else {
                callback([]);
              }
            } catch (error) {
              callback([]);
            }
          },
          templates: {
            suggestion: suggestion => {
              return suggestion.properties.formatted;
            },
            empty: (query, isEmpty) => {
              return "Kein Resultate gefunden";
            }
          }
        }
      ]
    );

    // Update the marker position when the user selects a suggestion
    this.autocomplete.on(
      "autocomplete:selected",
      (event, suggestion, dataset, context) => {
        this.data.geometry = suggestion.geometry;
        this.data.properties.label = suggestion.properties.formatted;
        if (!this.marker) {
          this.marker = this.getMarker(suggestion.geometry.coordinates);
        } else {
          this.marker.setLngLat(suggestion.geometry.coordinates);
        }
        this.map.jumpTo({ center: suggestion.geometry.coordinates });
        if (this.change) {
          this.change();
        }
      }
    );
  }

  // Returns a new marker that is draggable
  getMarker(coordinates) {
    const marker = new mapboxgl.Marker({
      draggable: true
    })
      .setLngLat(coordinates)
      .addTo(this.map);

    marker.on("dragend", () => {
      this.data.geometry.coordinates = [
        this.marker.getLngLat().lng,
        this.marker.getLngLat().lat
      ];
      if (this.change) {
        this.change();
      }
    });

    return marker;
  }
}

export default class AutocompleteControl {
  onAdd(map) {
    this._map = map;
    this._container = document.createElement("div");
    this._input = document.createElement("input");
    this._input.id = "autocomplete-control--search-input";
    this._input.classList.add("autocomplete-control--search-input");
    this._input.type = "text";
    this._input.placeholder = "Suche";
    this._container.appendChild(this._input);
    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}
