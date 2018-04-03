import { bindable, inject, Loader, LogManager } from "aurelia-framework";
import { checkAvailability } from "resources/schemaEditorDecorators.js";
import QConfig from "resources/QConfig";
import { isRequired } from "./helpers.js";

const log = LogManager.getLogger("Q");
const iconPinSvg =
  '<svg viewBox="0 0 52 52"><path d="M31.5,35.5 M20.5,16.5 M20.5,35.5 M31.5,16.5 M30,18c0-2.2-1.8-4-4-4s-4,1.8-4,4c0,1.9,1.3,3.4,3,3.9V38h1h1V21.9C28.7,21.4,30,19.9,30,18z"/></svg>';

@checkAvailability()
@inject(QConfig, Loader)
export class SchemaEditorGeojsonPoint {
  @bindable schema;
  @bindable data;
  @bindable change;

  options = {
    bbox: false
  };

  constructor(qConfig, loader) {
    this.qConfig = qConfig;
    this.loader = loader;
    this.isRequired = isRequired;
    this.mapInit = new Promise((resolve, reject) => {
      this.resolveMapInit = resolve;
    });
  }

  async dataChanged() {
    await this.mapInit;
    this.updateMarker();
    await this.updateBbox();
  }

  async schemaChanged() {
    this.applyOptions();
    await this.handleOptions();
    await this.updateBbox();
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

    // if window.Leaflet is not defined, we load it async here using the aurelia loader
    // as we need Leaflet later, we need to await the loading
    if (!window.Leaflet) {
      try {
        window.Leaflet = window.L = await this.loader.loadModule("leaflet");
        this.loader.loadModule("npm:leaflet@1.3.1/dist/leaflet.css!");
      } catch (e) {
        log.error(e);
      }
    }
    if (!window.Leaflet) {
      log.error("window.Leaflet is not defined after loading leaflet");
      this.showLoadingError = true;
      return;
    }

    // if we do not have a Leaflet.Control.Search yet, we load the module async using the aurelia loader
    if (!window.Leaflet.Control.Search) {
      window.Leaflet.Control.Search = await this.loader.loadModule(
        "leaflet-search"
      );
    }

    if (!window.Leaflet.Control.Search) {
      log.error(
        "window.Leaflet.Control.Search is not defined after loading leaflet-search"
      );
      this.showLoadingError = true;
      return;
    }

    // define our own marker icon for the pin
    this.markerPinIcon = window.Leaflet.divIcon({
      className: "q-map-editor-pin",
      html: iconPinSvg,
      iconSize: [52, 52],
      iconAnchor: [26, 38]
    });

    // initialise the map and set the view to NZZ building
    this.map = window.Leaflet.map(this.mapContainer, {
      zoomControl: false, // we add this later after the search control
      touchZoom: "center",
      scrollWheelZoom: "center"
    }).setView([47.36521171867246, 8.547435700893404], 13);

    // we need to keep the current search results to use the label after selection
    let currentSearchResults = [];

    if (!schemaEditorConfig.geojson.opencagedata.apiKey) {
      log.info(
        "no opencageApiKey given, will not load geocoder for geojson-point editor"
      );
    } else {
      this.geocoder = new window.Leaflet.Control.Search({
        sourceData: async (text, next) => {
          const data = await geocode(
            text,
            schemaEditorConfig.geojson.opencagedata.apiKey,
            schemaEditorConfig.geojson.opencagedata.language
          );
          next(data);
        },
        formatData: data => {
          // reset
          currentSearchResults = [];

          return data.features
            .filter(result => {
              return result.geometry.type === "Point";
            })
            .map(result => {
              currentSearchResults.push(result);
              return {
                label: result.properties.formatted,
                location: [
                  result.geometry.coordinates[1],
                  result.geometry.coordinates[0]
                ]
              };
            })
            .reduce((allResults, result) => {
              allResults[result.label] = result.location;
              return allResults;
            }, {});
        },
        filterData: (value, records) => {
          return records; // do not filter the results
        },
        minLength: 3,
        autoCollapse: true,
        marker: false,
        textPlaceholder: ""
      });

      this.geocoder.on("search:locationfound", selectedSearchResult => {
        this.data.geometry = {
          type: "Point",
          coordinates: [
            selectedSearchResult.latlng[1],
            selectedSearchResult.latlng[0]
          ]
        };

        // try to find the selected result by latlng
        let selected = currentSearchResults.filter(result => {
          return (
            result.geometry.coordinates[0] === selectedSearchResult.latlng[1] && // yes it needs to be 1st vs. 2nd
            result.geometry.coordinates[1] === selectedSearchResult.latlng[0]
          ); // lat lng / lng lat mixup is a major fuckup
        })[0];

        if (selected && selected.properties) {
          try {
            if (
              selected.properties.components[
                selected.properties.components._type
              ]
            ) {
              this.data.properties.label =
                selected.properties.components[
                  selected.properties.components._type
                ];
            } else {
              throw new Error("property not available");
            }
          } catch (e) {
            this.data.properties.label = selected.properties.formatted;
          }
        }
        if (this.change) {
          this.change();
        }
        this.updateMarker();
      });
    }

    this.zoomControl = window.Leaflet.control.zoom({
      position: "topleft"
    });

    // allows to add a pin by clicking the map only if there is no pin yet
    this.map.on("click", e => {
      if (!this.pin) {
        this.data.geometry.coordinates = [e.latlng.lng, e.latlng.lat];
        this.updateMarker();
        if (this.change) {
          this.change();
        }
      }
    });

    const layerConfig = schemaEditorConfig.geojson.layer;

    if (this.map) {
      this.resolveMapInit();

      // only add the geocoder if we have one
      if (this.geocoder) {
        this.geocoder.addTo(this.map);
        this.geocoder.expand();
        if (this.geocoder._input) {
          this.geocoder._input.focus();
        }
      }

      this.zoomControl.addTo(this.map);
      window.Leaflet.tileLayer(layerConfig.url, layerConfig.config).addTo(
        this.map
      );
    }
  }

  // set the pin to the map if we already have Point data
  async updateMarker(setMapView = false) {
    if (
      !Array.isArray(this.data.geometry.coordinates) ||
      isNaN(this.data.geometry.coordinates[0]) ||
      isNaN(this.data.geometry.coordinates[1])
    ) {
      if (this.pin) {
        this.map.removeLayer(this.pin);
        delete this.pin;
      }
      return;
    }

    // if there already is a pin, update it's location
    if (this.pin) {
      if (this.pin && this.pin.setLatLng) {
        this.pin.setLatLng(this.data.geometry.coordinates.slice().reverse());
        if (setMapView && this.options.bbox !== "manual") {
          this.map.panTo(this.pin.getLatLng());
        }
      }
    } else {
      this.pin = window.Leaflet.marker(
        this.data.geometry.coordinates.slice().reverse(),
        {
          icon: this.markerPinIcon,
          clickable: false,
          keyboard: false,
          draggable: true
        }
      );
      this.pin.on("drag", () => {
        this.data.geometry.coordinates = [
          this.pin.getLatLng().lng,
          this.pin.getLatLng().lat
        ];
      });

      this.pin.on("dragend", () => {
        this.data.geometry.coordinates = [
          this.pin.getLatLng().lng,
          this.pin.getLatLng().lat
        ];
        if (this.change) {
          this.change();
        }
      });

      await this.mapInit;
      this.pin.addTo(this.map);

      // if we have manual bounding box option
      // we do not pan to the center of the point to not mess with the bounding box select position
      if (this.options.bbox !== "manual") {
        this.map.panTo(this.pin.getLatLng());
      }
    }
  }

  async handleOptions() {
    if (this.options.bbox === "manual") {
      await this.mapInit;
      // if we do not have a Leaflet.areaSelect yet, we load the module async using the aurelia loader
      // this failed in some tests because of weird module format. But it worked always, so we ignore any loading error here...
      if (!window.L) {
        // areaSelect expects window.L to be defined as Leaflet;
        window.L = window.Leaflet;
      }
      if (!window.Leaflet.areaSelect) {
        try {
          await this.loader.loadModule(
            "github:heyman/leaflet-areaselect@master/src/leaflet-areaselect.js"
          );
        } catch (e) {
          // leaflet-areaselect is probably loaded, nevermind the error here
        }
      }
      // ... test again if it's here
      if (!window.Leaflet.areaSelect || !L.AreaSelect) {
        log.error(
          "window.Leaflet.areaSelect is not defined after loading leaflet-areaselect"
        );
        this.showLoadingError = true;
        return;
      }

      if (this.areaSelect) {
        return;
      }

      this.areaSelect = window.Leaflet.areaSelect({
        width: this.map.getSize().x * 0.8,
        height: this.map.getSize().y * 0.8,
        keepAspectRatio: true
      });

      this.areaSelect.addTo(this.map);
      this.areaSelect.on("change", () => {
        this.data.bbox = [
          this.areaSelect.getBounds().getWest(),
          this.areaSelect.getBounds().getSouth(),
          this.areaSelect.getBounds().getEast(),
          this.areaSelect.getBounds().getNorth()
        ];
        if (this.change) {
          this.change();
        }
      });
    }
  }

  async updateBbox() {
    if (this.options.bbox !== "manual") {
      return;
    }
    if (!this.areaSelect) {
      return;
    }
    if (this.data.bbox) {
      await this.mapInit;
      const sw = Leaflet.latLng(this.data.bbox[1], this.data.bbox[0]);
      const ne = Leaflet.latLng(this.data.bbox[3], this.data.bbox[2]);
      const bounds = new L.LatLngBounds([sw, ne]);
      this.map.setView(bounds.getCenter());
      this.map.fitBounds(bounds);
      const mapSize = this.map.getSize();
      const containerPointSW = this.map.latLngToContainerPoint(sw);
      const width = mapSize.x - containerPointSW.x * 2;
      this.areaSelect.setDimensions({ width: width, height: width / 16 * 9 });
    }
  }
}

function geocode(searchTerm, apiKey, language) {
  const api = `https://api.opencagedata.com/geocode/v1/geojson?q=${searchTerm}&key=${apiKey}&language=${language}`;
  return fetch(api)
    .then(res => {
      if (!res.ok) {
        throw new Error(res);
      }
      return res.json();
    })
    .then(data => {
      return data;
    })
    .catch(e => {
      // fail silent
    });
}
