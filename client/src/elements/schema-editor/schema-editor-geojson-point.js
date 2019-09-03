import { bindable, inject, Loader, LogManager } from "aurelia-framework";
import QConfig from "resources/QConfig";
import { isRequired } from "./helpers.js";

const log = LogManager.getLogger("Q");
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

    // if we already have a map, return here (happens when array entry order is changed)
    if (this.map) {
      return;
    }

    // if window.mapboxgl is not defined, we load it async here using the aurelia loader
    if (!window.mapboxgl) {
      try {
        window.mapboxgl = await this.loader.loadModule("mapbox-gl");
        this.loader.loadModule("npm:mapbox-gl@1.1.1/dist/mapbox-gl.css!");
      } catch (e) {
        log.error(e);
      }
    }
    if (!window.mapboxgl) {
      log.error("window.mapboxgl is not defined after loading mapbox-gl");
      this.showLoadingError = true;
      return;
    }

    if (schemaEditorConfig.shared.map.accessToken) {
      mapboxgl.accessToken = schemaEditorConfig.shared.map.accessToken;
    }
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: schemaEditorConfig.shared.map.style,
      center: schemaEditorConfig.shared.map.center,
      zoom: schemaEditorConfig.shared.map.zoom,
      maxZoom: schemaEditorConfig.shared.map.maxZoom
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
      this.updateMarker();
    }

    // Add marker to the clicked area
    this.map.on("click", event => {
      if (!this.marker) {
        this.data.geometry.coordinates = [event.lngLat.lng, event.lngLat.lat];
        this.updateMarker();
      }
    });

    // if window.Autocomplete is not defined, we load it async here using the aurelia loader
    if (!window.Autocomplete) {
      try {
        window.Autocomplete = await this.loader.loadModule(
          "@tarekraafat/autocomplete.js"
        );
      } catch (e) {
        log.error(e);
      }
    }
    if (!window.Autocomplete) {
      log.error(
        "window.Autocomplete is not defined after loading @tarekraafat/autocomplete.js"
      );
      this.showLoadingError = true;
      return;
    }

    this.autocomplete = new Autocomplete({
      data: {
        src: async () => {
          const query = document.querySelector(`#${this.autoCompleteInputId}`)
            .value;
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/geojson?q=${query}&key=${schemaEditorConfig.geojson.opencagedata.apiKey}&language=${schemaEditorConfig.geojson.opencagedata.language}&abbrv=1`
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
          }
          return [];
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
        this.updateMarker();
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

  updateMarker() {
    const coordinates = this.data.geometry.coordinates;
    if (!this.marker) {
      this.marker = this.getMarker(coordinates);
    } else {
      this.marker.setLngLat(coordinates);
    }
    this.map.jumpTo({ center: coordinates });
    if (this.change) {
      this.change();
    }
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
