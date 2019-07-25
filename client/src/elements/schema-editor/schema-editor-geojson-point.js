import { bindable, inject, Loader } from "aurelia-framework";
import QConfig from "resources/QConfig";
import { isRequired } from "./helpers.js";
import autocomplete from "@tarekraafat/autocomplete.js";

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

    this.autoCompleteInputId = `autoComplete_input_${Math.floor(
      Math.random() * 100000
    )}`;
    this.autoCompleteResultsListId = `autoComplete_results_list_${Math.floor(
      Math.random() * 100000
    )}`;
    this.map.addControl(
      new AutocompleteControl({ id: this.autoCompleteInputId }),
      "top-right"
    );

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

    this.autocomplete = new autocomplete({
      data: {
        src: async () => {
          const query = document.querySelector(`#${this.autoCompleteInputId}`)
            .value;
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/geojson?q=${query}&key=${
              schemaEditorConfig.geojson.opencagedata.apiKey
            }&language=${
              schemaEditorConfig.geojson.opencagedata.language
            }&abbrv=1`
          );
          if (response.ok) {
            const json = await response.json();
            return json.features.map(feature => {
              return {
                label: feature.properties.formatted,
                geometry: feature.geometry,
                properties: feature.properties
              };
            });
          } else {
            return [];
          }
        },
        key: ["label"],
        cache: false
      },
      placeHolder: "Suche",
      selector: `#${this.autoCompleteInputId}`,
      threshold: 3,
      debounce: 300,
      searchEngine: "strict",
      resultsList: {
        render: true,
        container: source => {
          source.classList.add("autoComplete_results_list");
          source.id = this.autoCompleteResultsListId;
          return source;
        },
        destination: document.querySelector(`#${this.autoCompleteInputId}`),
        position: "afterend",
        element: "ul"
      },
      maxResults: 5,
      resultItem: {
        content: (data, source) => {
          source.innerHTML = data.match;
        },
        element: "li"
      },
      noResults: () => {
        const result = document.createElement("li");
        result.setAttribute("class", "autoComplete_no-result");
        result.setAttribute("tabindex", "1");
        result.innerHTML = "Keine Resultate gefunden";
        document
          .querySelector(`#${this.autoCompleteResultsListId}`)
          .appendChild(result);
      },
      onSelection: event => {
        const selection = event.selection.value;
        this.data.geometry = selection.geometry;
        this.data.properties.label = selection.label;
        const coordinates = selection.geometry.coordinates;
        if (!this.marker) {
          this.marker = this.getMarker(coordinates);
        } else {
          this.marker.setLngLat(coordinates);
        }
        this.map.jumpTo({ center: coordinates });
        if (this.change) {
          this.change();
        }
        document.querySelector(`#${this.autoCompleteInputId}`).value = "";
      }
    });
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
  constructor(options) {
    this._id = options.id;
  }

  onAdd(map) {
    this._map = map;
    this._container = document.createElement("div");
    this._container.classList.add("autoComplete_container");
    this._input = document.createElement("input");
    this._input.id = this._id;
    this._input.classList.add("autoComplete_input");
    this._input.type = "text";
    this._container.appendChild(this._input);
    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}
