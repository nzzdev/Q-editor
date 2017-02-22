import qEnv from 'resources/qEnv';
import { bindable } from 'aurelia-framework';
import Leaflet from 'leaflet';
import 'npm:leaflet@1.0.3/dist/leaflet.css!';
import 'npm:leaflet-geocoder-mapzen@1.7.1';
import 'npm:leaflet-geocoder-mapzen@1.7.1/dist/leaflet-geocoder-mapzen.css!';

const iconPinSvg = '<svg viewBox="0 0 52 52"><path d="M31.5,35.5 M20.5,16.5 M20.5,35.5 M31.5,16.5 M30,18c0-2.2-1.8-4-4-4s-4,1.8-4,4c0,1.9,1.3,3.4,3,3.9V38h1h1V21.9C28.7,21.4,30,19.9,30,18z"/></svg>';
const markerPinIcon = Leaflet.divIcon({
  className: 'q-map-editor-pin',
  html: iconPinSvg,
  iconSize: [52,52],
  iconAnchor: [26,38]
})

const streetsUrl = 'https://api.mapbox.com/styles/v1/neuezuercherzeitung/cii8pg52u00kdbpm0wxfr9802/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibmV1ZXp1ZXJjaGVyemVpdHVuZyIsImEiOiJjaXV5NmZ4NTgwMDF4MnlyM2dvbWIxcHdzIn0.XNDydQCjdVfoHWRGgIQHRw';

const layerConfig = {
  url: streetsUrl,
  minimapLayerUrl: streetsUrl,
  config: {
    attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &amp; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  },
  containerClass: 'with-base-layer-streets',
  maxZoom: 18,
};

export class SchemaEditorLatLng {

  @bindable schema;
  @bindable data;
  @bindable change;
  
  constructor() {
    this.mapInit = new Promise((resolve, reject) => {
      this.resolveMapInit = resolve;
    })
  }

  dataChanged() {
    this.mapInit
      .then(() => {
        this.updateMarker();
      })
  }

  attached() {
    this.map = Leaflet.map(this.mapContainer, {
      zoomControl: false, // we add this later after the search control
      touchZoom: 'center',
      scrollWheelZoom: 'center',
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
    })

    qEnv.mapzenApiKey
      .then(mapzenApiKey => {
        this.geocoder = L.control.geocoder(this.QEnv.MAPZEN_API_KEY, {
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
          this.updateMarker();
          if (this.change) {
            this.change();
          }
        });
      })

    Leaflet.tileLayer(layerConfig.url, layerConfig.config).addTo(this.map);

    if (this.map) {
      this.resolveMapInit();
      this.zoomControl.addTo(this.map);
    }
  }

  updateMarker() {
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
      console.log('add pin')
      this.pin = Leaflet.marker(this.data, {
        icon: markerPinIcon,
        clickable: false,
        keyboard: false,
        draggable: true
      });
      console.log(this.pin, this.data)
      this.mapInit
        .then(() => {
          this.pin.addTo(this.map);
          this.map.panTo(this.data);
        });
    }

  }
}

