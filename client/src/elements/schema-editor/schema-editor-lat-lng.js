import { bindable, inject, Loader } from 'aurelia-framework';

import qEnv from 'resources/qEnv';
import QConfig from 'resources/QConfig';

const iconPinSvg = '<svg viewBox="0 0 52 52"><path d="M31.5,35.5 M20.5,16.5 M20.5,35.5 M31.5,16.5 M30,18c0-2.2-1.8-4-4-4s-4,1.8-4,4c0,1.9,1.3,3.4,3,3.9V38h1h1V21.9C28.7,21.4,30,19.9,30,18z"/></svg>';

@inject(QConfig, Loader)
export class SchemaEditorLatLng {

  @bindable schema;
  @bindable data;
  @bindable change;
  @bindable required;

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

    this.map.on('click', e => {
      if (!this.pin) {
        this.data.lat = e.latlng.lat;
        this.data.lng = e.latlng.lng;
        this.updateMarker();
        if (this.change) {
          this.change();
        }
      }
    });

    const mapzenApiKey = await qEnv.mapzenApiKey;
    this.geocoder = Leaflet.control.geocoder(mapzenApiKey, {
      attribution: null,
      fullWidth: true,
      markers: false,
      focus: false
    });

    this.geocoder.addTo(this.map);
    this.geocoder.expand();
    if (this.geocoder._input) {
      this.geocoder._input.focus();
    }

    this.zoomControl = Leaflet.control.zoom({
      position: 'topleft'
    });

    this.geocoder.on('select', e => {
      this.geocoder.collapse();
      this.data.lat = e.feature.geometry.coordinates[1];
      this.data.lng = e.feature.geometry.coordinates[0];
      if (this.change) {
        this.change();
      }
      this.updateMarker();
    });

    const schemaEditorConfig = await this.qConfig.get('schemaEditor');
    const layerConfig = schemaEditorConfig.latLng.layer;
    Leaflet.tileLayer(layerConfig.url, layerConfig.config).addTo(this.map);

    if (this.map) {
      this.resolveMapInit();
      this.zoomControl.addTo(this.map);
    }
  }

  async updateMarker() {
    if (isNaN(this.data.lat) || isNaN(this.data.lng)) {
      if (this.pin) {
        this.map.removeLayer(this.pin);
        delete this.pin;
      }
      return;
    }

    if (this.pin) {
      if (this.pin && this.pin.setLatLng) {
        this.pin.setLatLng(this.data);
      }
    } else {
      this.pin = Leaflet.marker(this.data, {
        icon: this.markerPinIcon,
        clickable: false,
        keyboard: false,
        draggable: true
      });
      this.pin.on('drag', () => {
        this.data.lat = this.pin.getLatLng().lat;
        this.data.lng = this.pin.getLatLng().lng;
        if (this.change) {
          this.change();
        }
      });

      await this.mapInit;
      this.pin.addTo(this.map);
      this.map.panTo(this.data);
    }
  }
}

