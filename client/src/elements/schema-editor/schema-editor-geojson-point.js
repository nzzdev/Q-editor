import { bindable, inject, Loader, LogManager } from 'aurelia-framework';

const log = LogManager.getLogger('Q');

import qEnv from 'resources/qEnv';
import QConfig from 'resources/QConfig';

const iconPinSvg = '<svg viewBox="0 0 52 52"><path d="M31.5,35.5 M20.5,16.5 M20.5,35.5 M31.5,16.5 M30,18c0-2.2-1.8-4-4-4s-4,1.8-4,4c0,1.9,1.3,3.4,3,3.9V38h1h1V21.9C28.7,21.4,30,19.9,30,18z"/></svg>';

@inject(QConfig, Loader)
export class SchemaEditorGeojsonPoint {

  @bindable schema;
  @bindable data;
  @bindable change;

  constructor(qConfig, loader) {
    this.qConfig = qConfig;
    this.loader = loader;
    this.mapInit = new Promise((resolve, reject) => {
      this.resolveMapInit = resolve;
    });
  }

  async dataChanged() {
    await this.mapInit;
    this.updateMarker();
  }

  async attached() {
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
        window.Leaflet = window.L = await this.loader.loadModule('leaflet');
        this.loader.loadModule('npm:leaflet@1.0.3/dist/leaflet.css!');
      } catch (e) {
        log.error(e);
      }
    }
    if (!window.Leaflet) {
      log.error('window.Leaflet is not defined after loading leaflet');
      this.showLoadingError = true;
      return;
    }

    // if we do not have a Leaflet.control.geocoder yet, we load the module async using the aurelia loader
    // this failed in some tests because of weird module format. But it worked always, so we ignore any loading error here...
    if (!window.Leaflet.control.geocoder) {
      try {
        this.loader.loadModule('npm:leaflet-geocoder-mapzen@1.8.0/dist/leaflet-geocoder-mapzen.css!');
        await this.loader.loadModule('leaflet-geocoder-mapzen');
      } catch (e) {
        // leaflet-geocoder-mapzen is probably loaded, nevermind the error here
      }
    }
    // ... test again if it's here
    if (!window.Leaflet.control.geocoder) {
      log.error('window.Leaflet.control.geocoder is not defined after loading leaflet-geocoder-mapzen');
      this.showLoadingError = true;
      return;
    }

    // define our own marker icon for the pin
    this.markerPinIcon = window.Leaflet.divIcon({
      className: 'q-map-editor-pin',
      html: iconPinSvg,
      iconSize: [52, 52],
      iconAnchor: [26, 38]
    });

    // initialise the map and set the view to NZZ building
    this.map = window.Leaflet.map(this.mapContainer, {
      zoomControl: false, // we add this later after the search control
      touchZoom: 'center',
      scrollWheelZoom: 'center'
    }).setView([47.36521171867246, 8.547435700893404], 13);

    // we need a mapzen key for the geocoder, this has to be defined in ENV
    // if it's not here, we do not add a geocoder
    const mapzenApiKey = await qEnv.mapzenApiKey;
    if (mapzenApiKey === undefined) {
      log.info('no mapzenApiKey defined, will not load geocoder for geojson-point editor');
    } else {
      this.geocoder = window.Leaflet.control.geocoder(mapzenApiKey, {
        attribution: null,
        fullWidth: true,
        markers: false,
        focus: false
      });

      this.geocoder.on('select', e => {
        this.geocoder.collapse();
        this.data.geometry = e.feature.geometry;
        this.data.properties.label = e.feature.properties.name;
        if (this.change) {
          this.change();
        }
        this.updateMarker();
      });
    }

    this.zoomControl = window.Leaflet.control.zoom({
      position: 'topleft'
    });

    // allows to add a pin by clicking the map only if there is no pin yet
    this.map.on('click', e => {
      if (!this.pin) {
        this.data.geometry.coordinates = [e.latlng.lng, e.latlng.lat];
        this.updateMarker();
        if (this.change) {
          this.change();
        }
      }
    });

    const schemaEditorConfig = await this.qConfig.get('schemaEditor');
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
      window.Leaflet.tileLayer(layerConfig.url, layerConfig.config).addTo(this.map);
    }
  }

  // set the pin to the map if we already have Point data
  async updateMarker(setMapView = false) {
    if (isNaN(this.data.geometry.coordinates[0]) || isNaN(this.data.geometry.coordinates[1])) {
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
        if (setMapView) {
          this.map.panTo(this.pin.getLatLng());
        }
      }
    } else {
      this.pin = window.Leaflet.marker(this.data.geometry.coordinates.slice().reverse(), {
        icon: this.markerPinIcon,
        clickable: false,
        keyboard: false,
        draggable: true
      });
      this.pin.on('drag', () => {
        this.data.geometry.coordinates = [
          this.pin.getLatLng().lng,
          this.pin.getLatLng().lat
        ];
      });

      this.pin.on('dragend', () => {
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
      this.map.panTo(this.pin.getLatLng());
    }
  }
}
