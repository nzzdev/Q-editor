import { bindable, inject, Loader } from "aurelia-framework";
import QConfig from "resources/QConfig";
import { isRequired } from "./helpers.js";
import bbox from "@turf/bbox";
import bboxPolygon from "@turf/bbox-polygon";
import { featureCollection } from "@turf/helpers";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";

@inject(QConfig, Loader)
export class SchemaEditorBbox {
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
    this.loader.loadModule("npm:mapbox-gl@1.1.1/dist/mapbox-gl.css!");
    this.loader.loadModule(
      "npm:@mapbox/mapbox-gl-draw@1.1.2/dist/mapbox-gl-draw.css!"
    );
  }

  options = {};

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

  dataChanged() {
    if (this.change) {
      this.change();
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

    mapboxgl.accessToken = schemaEditorConfig.geojson.layer.accessToken;
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: schemaEditorConfig.geojson.layer.style
    });

    this.map.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      "top-left"
    );
    this.map.dragRotate.disable();
    this.map.touchZoomRotate.disableRotation();

    this.MapboxDraw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        trash: true
      }
    });
    this.map.addControl(this.MapboxDraw);
    this.map.on("mousedown", this.mouseDown.bind(this));
    this.map.on("draw.update", event => {
      this.data = bbox(event.features[0]);
      this.map.fitBounds(
        [[this.data[0], this.data[1]], [this.data[2], this.data[3]]],
        { padding: 60, duration: 0 }
      );
    });
    this.map.on("draw.delete", event => {
      this.data = [];
    });

    if (this.data && this.data.length >= 4) {
      this.setBBox(this.data);
    }
  }

  mouseDown(event) {
    // Continue the rest of the function if the shiftkey is pressed.
    if (!(event.originalEvent.shiftKey && event.originalEvent.button === 0)) {
      return;
    }
    this.map.on("mouseup", this.mouseUp.bind(this));
    this.start = event.lngLat;
  }

  mouseUp(event) {
    // Continue the rest of the function if the shiftkey is pressed.
    if (!(event.originalEvent.shiftKey && event.originalEvent.button === 0)) {
      return;
    }
    this.setBBox([
      this.start.lng,
      this.start.lat,
      event.lngLat.lng,
      event.lngLat.lat
    ]);
  }

  setBBox(bboxItem) {
    const bboxFeatureCollection = featureCollection([bboxPolygon(bboxItem)]);
    if (!(this.data === bboxItem)) {
      this.data = bbox(bboxFeatureCollection);
    }
    this.MapboxDraw.set(bboxFeatureCollection);
    this.map.fitBounds(
      [[this.data[0], this.data[1]], [this.data[2], this.data[3]]],
      { padding: 60, duration: 0 }
    );
  }
}
