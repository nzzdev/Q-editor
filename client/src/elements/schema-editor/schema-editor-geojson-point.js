import { bindable, inject, Loader } from 'aurelia-framework';

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
    // if we already have a map, return here
    // this happens when array entry order is changed.
    if (this.map) {
      return;
    }

    if (!window.Leaflet) {
      window.Leaflet = window.L = await this.loader.loadModule('leaflet');
      this.loader.loadModule('npm:leaflet@1.0.3/dist/leaflet.css!');
    }

    if (!Leaflet.control.geocoder) {
      try {
        this.loader.loadModule('npm:leaflet-geocoder-mapzen@1.8.0/dist/leaflet-geocoder-mapzen.css!');
        await this.loader.loadModule('leaflet-geocoder-mapzen');
      } catch (e) {
        // leaflet-geocoder-mapzen is probably loaded, nevermind the error here
      }
    }

    this.markerPinIcon = Leaflet.divIcon({
      className: 'q-map-editor-pin',
      html: iconPinSvg,
      iconSize: [52, 52],
      iconAnchor: [26, 38]
    });

    this.map = Leaflet.map(this.mapContainer, {
      zoomControl: false, // we add this later after the search control
      touchZoom: 'center',
      scrollWheelZoom: 'center'
    }).setView([47.36521171867246, 8.547435700893404], 13);

    const mapzenApiKey = await qEnv.mapzenApiKey;
    this.geocoder = Leaflet.control.geocoder(mapzenApiKey, {
      attribution: null,
      fullWidth: true,
      markers: false,
      focus: false
    });

    this.zoomControl = Leaflet.control.zoom({
      position: 'topleft'
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

    // allows to add a pin by clicking the map only if there is no pin yet
    this.map.on('click', e => {
      if (!this.pin) {
        this.data.geometry.coordinates[1] = e.latlng.lat;
        this.data.geometry.coordinates[0] = e.latlng.lng;
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

      this.geocoder.addTo(this.map);
      this.geocoder.expand();
      if (this.geocoder._input) {
        this.geocoder._input.focus();
      }

      this.zoomControl.addTo(this.map);
      Leaflet.tileLayer(layerConfig.url, layerConfig.config).addTo(this.map);
    }
  }

  async updateMarker(setMapView = false) {
    if (isNaN(this.data.geometry.coordinates[0]) || isNaN(this.data.geometry.coordinates[1])) {
      if (this.pin) {
        this.map.removeLayer(this.pin);
        delete this.pin;
      }
      return;
    }

    if (this.pin) {
      if (this.pin && this.pin.setLatLng) {
        this.pin.setLatLng(this.data.geometry.coordinates.slice().reverse());
        if (setMapView) {
          this.map.panTo(this.pin.getLatLng());
        }
      }
    } else {
      this.pin = Leaflet.marker(this.data.geometry.coordinates.slice().reverse(), {
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
