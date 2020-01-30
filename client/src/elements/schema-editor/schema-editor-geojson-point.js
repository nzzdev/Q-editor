import {
  BindingEngine,
  bindable,
  inject,
  Loader,
  LogManager
} from "aurelia-framework";
import QConfig from "resources/QConfig";
import { isRequired } from "./helpers.js";

const log = LogManager.getLogger("Q");
@inject(BindingEngine, QConfig, Loader)
export class SchemaEditorGeojsonPoint {
  @bindable
  schema;
  @bindable
  data;
  @bindable
  change;
  @bindable
  showNotifications;

  options = {
    bbox: false
  };

  constructor(bindingEngine, qConfig, loader) {
    this.bindingEngine = bindingEngine;
    this.qConfig = qConfig;
    this.loader = loader;
    this.isRequired = isRequired;
  }

  // Observe required properties coordinates[0] and coordinates[1] and trigger dataChanged event when their value changes
  // Binding behaviour can only handle changes of primitive values (strings, numbers ect.) not properties of objects
  // therefore this special handling is needed. More infos: https://aurelia.io/docs/binding/binding-engine#observing-an-expression-on-an-object
  bind() {
    this.coordinatesZeroSub = this.bindingEngine
      .expressionObserver(this, "data.geometry.coordinates[0]")
      .subscribe((newValue, oldValue) => {
        this.triggerDataChanged();
      });
    this.coordinatesOneSub = this.bindingEngine
      .expressionObserver(this, "data.geometry.coordinates[1]")
      .subscribe((newValue, oldValue) => {
        this.triggerDataChanged();
      });
  }

  triggerDataChanged() {
    this.data = JSON.parse(JSON.stringify(this.data));
  }

  detached() {
    this.coordinatesZeroSub.dispose();
    this.coordinatesOneSub.dispose();
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
        this.loader.loadModule("npm:mapbox-gl@1.3.1/dist/mapbox-gl.css!");
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

    // Add marker if existing point is displayed
    if (
      this.data.geometry &&
      this.data.geometry.coordinates &&
      this.data.geometry.coordinates.length >= 2 &&
      !this.marker
    ) {
      this.updateMarker();
    }

    if (
      this.options.bbox === "manual" &&
      this.data.bbox &&
      this.data.bbox.length === 4
    ) {
      this.map.fitBounds(this.data.bbox, { duration: 0 });
    }

    if (this.options.bbox === "manual") {
      this.map.on("mouseout", event => {
        this.updateBBox();
      });
    }

    // Add marker to the clicked area
    this.map.on("click", event => {
      if (!this.marker) {
        this.data.geometry.coordinates = [event.lngLat.lng, event.lngLat.lat];
        this.updateMarker();
        if (this.options.bbox === "manual") {
          this.updateBBox();
        }
      }
    });

    if (!schemaEditorConfig.shared.geocoder.key) {
      log.error(
        "no geocoder key given, will not load geocoder for geojson-point editor"
      );
    } else {
      // if window.autocompleter is not defined, we load it async here using the aurelia loader
      if (!window.autocompleter) {
        try {
          window.autocompleter = await this.loader.loadModule("autocompleter");
        } catch (e) {
          log.error(e);
        }
      }
      if (!window.autocompleter) {
        log.error("window.autocompleter is not defined");
        this.showLoadingError = true;
        return;
      }

      this.autoCompleteInputId = `autoComplete_input_${Math.floor(
        Math.random() * 100000
      )}`;
      this.map.addControl(
        new AutocompleteControl({ id: this.autoCompleteInputId }),
        "top-right"
      );

      this.autoCompleteInput = document.querySelector(
        `#${this.autoCompleteInputId}`
      );
      this.autoCompleteInput.focus();

      this.autocomplete = window.autocompleter({
        input: this.autoCompleteInput,
        emptyMsg: "Keine Resultate gefunden",
        minLength: 2,
        debounceWaitMs: 500,
        className: "autoComplete_results",
        fetch: (text, update) => {
          this.autoCompleteInput.classList.add("working");
          this.geocode(text, schemaEditorConfig.shared.geocoder.key)
            .then(results => {
              this.autoCompleteInput.classList.remove("working");
              update(results.features.slice(0, 5));
            })
            .catch(e => {
              console.error("Geocoding error:", e);
              this.autoCompleteInput.classList.remove("working");
            });
        },
        onSelect: item => {
          this.autoCompleteInput.value = "";
          this.data.geometry.coordinates = item.center;
          this.data.properties.label = item.text;
          this.updateMarker();
          if (this.options.bbox === "manual") {
            this.updateBBox();
          }
        },
        render: (item, currentValue) => {
          let name = item.text || item.place_name;
          let context = item.context
            ? item.context.map(c => c.text).join(", ")
            : "";

          let nameElement = document.createElement("span");
          nameElement.className = "item-name";
          nameElement.textContent = name;

          let contextElement = document.createElement("span");
          contextElement.className = "item-context";
          contextElement.textContent = context;

          let typeElement = document.createElement("span");
          typeElement.className = "item-type";
          typeElement.textContent = item.place_type;

          const itemElement = document.createElement("div");
          itemElement.append(nameElement, typeElement, contextElement);

          return itemElement;
        }
      });
    }
  }

  geocode(query, key) {
    return fetch(
      `https://api.maptiler.com/geocoding/${query}.json?key=${key}`
    ).then(response => response.json());
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
      if (this.options.bbox === "manual") {
        this.updateBBox();
      }
      if (this.change) {
        this.change();
      }
    });

    return marker;
  }

  updateMarker() {
    this.triggerDataChanged();
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

  updateBBox() {
    const bounds = this.map.getBounds().toArray();
    this.data.bbox = [bounds[0][0], bounds[0][1], bounds[1][0], bounds[1][1]];
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
    this._input.addEventListener("keydown", event => {
      if (event.keyCode === 13) {
        // Prevent the event from bubbling up if the enter key is pressed
        event.preventDefault();
      }
    });
    this._input.autocomplete = "off";
    this._input.placeholder = "Suche";
    this._container.appendChild(this._input);
    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}
