/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 131:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var mapbox_gl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(132);
/* harmony import */ var mapbox_gl__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mapbox_gl__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var gmaps__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(133);
/* harmony import */ var gmaps__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(gmaps__WEBPACK_IMPORTED_MODULE_1__);
/* provided dependency */ var $ = __webpack_require__(1);
// Maps



$(document).ready(() => {
  //MapBox-GL

  if (document.getElementById("map")) {
    (mapbox_gl__WEBPACK_IMPORTED_MODULE_0___default().accessToken) = "pk.eyJ1IjoiZGFzaGJvYXJlZHBhY2siLCJhIjoiY2s5bWlhZHRqMDAxazNsbnlpbXhhdDcwMSJ9.YU6cxTiRujREOAIVO6iLmA";
    var map = new (mapbox_gl__WEBPACK_IMPORTED_MODULE_0___default().Map)({
      container: "map",
      zoom: 9,
      center: [137.9150899566626, 36.25956997955441],
      style: "mapbox://styles/mapbox/satellite-v9"
    });
  }

  // gMaps

  if (document.getElementById('gmap-example')) {
    var map = new (gmaps__WEBPACK_IMPORTED_MODULE_1___default())({
      el: '#gmap-example',
      lat: -12.043333,
      lng: -77.028333,
      width: '100%',
      height: '300px'
    });
  }
});

/***/ }),

/***/ 133:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
/* provided dependency */ var $ = __webpack_require__(1);

(function(root, factory) {
  if(true) {
    module.exports = factory();
  }
  else {}


}(this, function() {

/*!
 * GMaps.js v0.4.25
 * http://hpneo.github.com/gmaps/
 *
 * Copyright 2017, Gustavo Leon
 * Released under the MIT License.
 */

var extend_object = function(obj, new_obj) {
  var name;

  if (obj === new_obj) {
    return obj;
  }

  for (name in new_obj) {
    if (new_obj[name] !== undefined) {
      obj[name] = new_obj[name];
    }
  }

  return obj;
};

var replace_object = function(obj, replace) {
  var name;

  if (obj === replace) {
    return obj;
  }

  for (name in replace) {
    if (obj[name] != undefined) {
      obj[name] = replace[name];
    }
  }

  return obj;
};

var array_map = function(array, callback) {
  var original_callback_params = Array.prototype.slice.call(arguments, 2),
      array_return = [],
      array_length = array.length,
      i;

  if (Array.prototype.map && array.map === Array.prototype.map) {
    array_return = Array.prototype.map.call(array, function(item) {
      var callback_params = original_callback_params.slice(0);
      callback_params.splice(0, 0, item);

      return callback.apply(this, callback_params);
    });
  }
  else {
    for (i = 0; i < array_length; i++) {
      callback_params = original_callback_params;
      callback_params.splice(0, 0, array[i]);
      array_return.push(callback.apply(this, callback_params));
    }
  }

  return array_return;
};

var array_flat = function(array) {
  var new_array = [],
      i;

  for (i = 0; i < array.length; i++) {
    new_array = new_array.concat(array[i]);
  }

  return new_array;
};

var coordsToLatLngs = function(coords, useGeoJSON) {
  var first_coord = coords[0],
      second_coord = coords[1];

  if (useGeoJSON) {
    first_coord = coords[1];
    second_coord = coords[0];
  }

  return new google.maps.LatLng(first_coord, second_coord);
};

var arrayToLatLng = function(coords, useGeoJSON) {
  var i;

  for (i = 0; i < coords.length; i++) {
    if (!(coords[i] instanceof google.maps.LatLng)) {
      if (coords[i].length > 0 && typeof(coords[i][0]) === "object") {
        coords[i] = arrayToLatLng(coords[i], useGeoJSON);
      }
      else {
        coords[i] = coordsToLatLngs(coords[i], useGeoJSON);
      }
    }
  }

  return coords;
};

var getElementsByClassName = function (class_name, context) {
    var element,
        _class = class_name.replace('.', '');

    if ('jQuery' in this && context) {
        element = $("." + _class, context)[0];
    } else {
        element = document.getElementsByClassName(_class)[0];
    }
    return element;

};

var getElementById = function(id, context) {
  var element,
  id = id.replace('#', '');

  if ('jQuery' in window && context) {
    element = $('#' + id, context)[0];
  } else {
    element = document.getElementById(id);
  };

  return element;
};

var findAbsolutePosition = function(obj)  {
  var curleft = 0,
      curtop = 0;

  if (obj.getBoundingClientRect) {
      var rect = obj.getBoundingClientRect();
      var sx = -(window.scrollX ? window.scrollX : window.pageXOffset);
      var sy = -(window.scrollY ? window.scrollY : window.pageYOffset);

      return [(rect.left - sx), (rect.top - sy)];
  }

  if (obj.offsetParent) {
    do {
      curleft += obj.offsetLeft;
      curtop += obj.offsetTop;
    } while (obj = obj.offsetParent);
  }

  return [curleft, curtop];
};

var GMaps = (function(global) {
  "use strict";

  var doc = document;
  /**
   * Creates a new GMaps instance, including a Google Maps map.
   * @class GMaps
   * @constructs
   * @param {object} options - `options` accepts all the [MapOptions](https://developers.google.com/maps/documentation/javascript/reference#MapOptions) and [events](https://developers.google.com/maps/documentation/javascript/reference#Map) listed in the Google Maps API. Also accepts:
   * * `lat` (number): Latitude of the map's center
   * * `lng` (number): Longitude of the map's center
   * * `el` (string or HTMLElement): container where the map will be rendered
   * * `markerClusterer` (function): A function to create a marker cluster. You can use MarkerClusterer or MarkerClustererPlus.
   */
  var GMaps = function(options) {

    if (!(typeof window.google === 'object' && window.google.maps)) {
      if (typeof window.console === 'object' && window.console.error) {
        console.error('Google Maps API is required. Please register the following JavaScript library https://maps.googleapis.com/maps/api/js.');
      }

      return function() {};
    }

    if (!this) return new GMaps(options);

    options.zoom = options.zoom || 15;
    options.mapType = options.mapType || 'roadmap';

    var valueOrDefault = function(value, defaultValue) {
      return value === undefined ? defaultValue : value;
    };

    var self = this,
        i,
        events_that_hide_context_menu = [
          'bounds_changed', 'center_changed', 'click', 'dblclick', 'drag',
          'dragend', 'dragstart', 'idle', 'maptypeid_changed', 'projection_changed',
          'resize', 'tilesloaded', 'zoom_changed'
        ],
        events_that_doesnt_hide_context_menu = ['mousemove', 'mouseout', 'mouseover'],
        options_to_be_deleted = ['el', 'lat', 'lng', 'mapType', 'width', 'height', 'markerClusterer', 'enableNewStyle'],
        identifier = options.el || options.div,
        markerClustererFunction = options.markerClusterer,
        mapType = google.maps.MapTypeId[options.mapType.toUpperCase()],
        map_center = new google.maps.LatLng(options.lat, options.lng),
        zoomControl = valueOrDefault(options.zoomControl, true),
        zoomControlOpt = options.zoomControlOpt || {
          style: 'DEFAULT',
          position: 'TOP_LEFT'
        },
        zoomControlStyle = zoomControlOpt.style || 'DEFAULT',
        zoomControlPosition = zoomControlOpt.position || 'TOP_LEFT',
        panControl = valueOrDefault(options.panControl, true),
        mapTypeControl = valueOrDefault(options.mapTypeControl, true),
        scaleControl = valueOrDefault(options.scaleControl, true),
        streetViewControl = valueOrDefault(options.streetViewControl, true),
        overviewMapControl = valueOrDefault(overviewMapControl, true),
        map_options = {},
        map_base_options = {
          zoom: this.zoom,
          center: map_center,
          mapTypeId: mapType
        },
        map_controls_options = {
          panControl: panControl,
          zoomControl: zoomControl,
          zoomControlOptions: {
            style: google.maps.ZoomControlStyle[zoomControlStyle],
            position: google.maps.ControlPosition[zoomControlPosition]
          },
          mapTypeControl: mapTypeControl,
          scaleControl: scaleControl,
          streetViewControl: streetViewControl,
          overviewMapControl: overviewMapControl
        };

      if (typeof(options.el) === 'string' || typeof(options.div) === 'string') {
        if (identifier.indexOf("#") > -1) {
            /**
             * Container element
             *
             * @type {HTMLElement}
             */
            this.el = getElementById(identifier, options.context);
        } else {
            this.el = getElementsByClassName.apply(this, [identifier, options.context]);
        }
      } else {
          this.el = identifier;
      }

    if (typeof(this.el) === 'undefined' || this.el === null) {
      throw 'No element defined.';
    }

    window.context_menu = window.context_menu || {};
    window.context_menu[self.el.id] = {};

    /**
     * Collection of custom controls in the map UI
     *
     * @type {array}
     */
    this.controls = [];
    /**
     * Collection of map's overlays
     *
     * @type {array}
     */
    this.overlays = [];
    /**
     * Collection of KML/GeoRSS and FusionTable layers
     *
     * @type {array}
     */
    this.layers = [];
    /**
     * Collection of data layers (See {@link GMaps#addLayer})
     *
     * @type {object}
     */
    this.singleLayers = {};
    /**
     * Collection of map's markers
     *
     * @type {array}
     */
    this.markers = [];
    /**
     * Collection of map's lines
     *
     * @type {array}
     */
    this.polylines = [];
    /**
     * Collection of map's routes requested by {@link GMaps#getRoutes}, {@link GMaps#renderRoute}, {@link GMaps#drawRoute}, {@link GMaps#travelRoute} or {@link GMaps#drawSteppedRoute}
     *
     * @type {array}
     */
    this.routes = [];
    /**
     * Collection of map's polygons
     *
     * @type {array}
     */
    this.polygons = [];
    this.infoWindow = null;
    this.overlay_el = null;
    /**
     * Current map's zoom
     *
     * @type {number}
     */
    this.zoom = options.zoom;
    this.registered_events = {};

    this.el.style.width = options.width || this.el.scrollWidth || this.el.offsetWidth;
    this.el.style.height = options.height || this.el.scrollHeight || this.el.offsetHeight;

    google.maps.visualRefresh = options.enableNewStyle;

    for (i = 0; i < options_to_be_deleted.length; i++) {
      delete options[options_to_be_deleted[i]];
    }

    if(options.disableDefaultUI != true) {
      map_base_options = extend_object(map_base_options, map_controls_options);
    }

    map_options = extend_object(map_base_options, options);

    for (i = 0; i < events_that_hide_context_menu.length; i++) {
      delete map_options[events_that_hide_context_menu[i]];
    }

    for (i = 0; i < events_that_doesnt_hide_context_menu.length; i++) {
      delete map_options[events_that_doesnt_hide_context_menu[i]];
    }

    /**
     * Google Maps map instance
     *
     * @type {google.maps.Map}
     */
    this.map = new google.maps.Map(this.el, map_options);

    if (markerClustererFunction) {
      /**
       * Marker Clusterer instance
       *
       * @type {object}
       */
      this.markerClusterer = markerClustererFunction.apply(this, [this.map]);
    }

    var buildContextMenuHTML = function(control, e) {
      var html = '',
          options = window.context_menu[self.el.id][control];

      for (var i in options){
        if (options.hasOwnProperty(i)) {
          var option = options[i];

          html += '<li><a id="' + control + '_' + i + '" href="#">' + option.title + '</a></li>';
        }
      }

      if (!getElementById('gmaps_context_menu')) return;

      var context_menu_element = getElementById('gmaps_context_menu');

      context_menu_element.innerHTML = html;

      var context_menu_items = context_menu_element.getElementsByTagName('a'),
          context_menu_items_count = context_menu_items.length,
          i;

      for (i = 0; i < context_menu_items_count; i++) {
        var context_menu_item = context_menu_items[i];

        var assign_menu_item_action = function(ev){
          ev.preventDefault();

          options[this.id.replace(control + '_', '')].action.apply(self, [e]);
          self.hideContextMenu();
        };

        google.maps.event.clearListeners(context_menu_item, 'click');
        google.maps.event.addDomListenerOnce(context_menu_item, 'click', assign_menu_item_action, false);
      }

      var position = findAbsolutePosition.apply(this, [self.el]),
          left = position[0] + e.pixel.x - 15,
          top = position[1] + e.pixel.y- 15;

      context_menu_element.style.left = left + "px";
      context_menu_element.style.top = top + "px";

      // context_menu_element.style.display = 'block';
    };

    this.buildContextMenu = function(control, e) {
      if (control === 'marker') {
        e.pixel = {};

        var overlay = new google.maps.OverlayView();
        overlay.setMap(self.map);

        overlay.draw = function() {
          var projection = overlay.getProjection(),
              position = e.marker.getPosition();

          e.pixel = projection.fromLatLngToContainerPixel(position);

          buildContextMenuHTML(control, e);
        };
      }
      else {
        buildContextMenuHTML(control, e);
      }

      var context_menu_element = getElementById('gmaps_context_menu');

      setTimeout(function() {
        context_menu_element.style.display = 'block';
      }, 0);
    };

    /**
     * Add a context menu for a map or a marker.
     *
     * @param {object} options - The `options` object should contain:
     * * `control` (string): Kind of control the context menu will be attached. Can be "map" or "marker".
     * * `options` (array): A collection of context menu items:
     *   * `title` (string): Item's title shown in the context menu.
     *   * `name` (string): Item's identifier.
     *   * `action` (function): Function triggered after selecting the context menu item.
     */
    this.setContextMenu = function(options) {
      window.context_menu[self.el.id][options.control] = {};

      var i,
          ul = doc.createElement('ul');

      for (i in options.options) {
        if (options.options.hasOwnProperty(i)) {
          var option = options.options[i];

          window.context_menu[self.el.id][options.control][option.name] = {
            title: option.title,
            action: option.action
          };
        }
      }

      ul.id = 'gmaps_context_menu';
      ul.style.display = 'none';
      ul.style.position = 'absolute';
      ul.style.minWidth = '100px';
      ul.style.background = 'white';
      ul.style.listStyle = 'none';
      ul.style.padding = '8px';
      ul.style.boxShadow = '2px 2px 6px #ccc';

      if (!getElementById('gmaps_context_menu')) {
        doc.body.appendChild(ul);
      }

      var context_menu_element = getElementById('gmaps_context_menu');

      google.maps.event.addDomListener(context_menu_element, 'mouseout', function(ev) {
        if (!ev.relatedTarget || !this.contains(ev.relatedTarget)) {
          window.setTimeout(function(){
            context_menu_element.style.display = 'none';
          }, 400);
        }
      }, false);
    };

    /**
     * Hide the current context menu
     */
    this.hideContextMenu = function() {
      var context_menu_element = getElementById('gmaps_context_menu');

      if (context_menu_element) {
        context_menu_element.style.display = 'none';
      }
    };

    var setupListener = function(object, name) {
      google.maps.event.addListener(object, name, function(e){
        if (e == undefined) {
          e = this;
        }

        options[name].apply(this, [e]);

        self.hideContextMenu();
      });
    };

    //google.maps.event.addListener(this.map, 'idle', this.hideContextMenu);
    google.maps.event.addListener(this.map, 'zoom_changed', this.hideContextMenu);

    for (var ev = 0; ev < events_that_hide_context_menu.length; ev++) {
      var name = events_that_hide_context_menu[ev];

      if (name in options) {
        setupListener(this.map, name);
      }
    }

    for (var ev = 0; ev < events_that_doesnt_hide_context_menu.length; ev++) {
      var name = events_that_doesnt_hide_context_menu[ev];

      if (name in options) {
        setupListener(this.map, name);
      }
    }

    google.maps.event.addListener(this.map, 'rightclick', function(e) {
      if (options.rightclick) {
        options.rightclick.apply(this, [e]);
      }

      if(window.context_menu[self.el.id]['map'] != undefined) {
        self.buildContextMenu('map', e);
      }
    });

    /**
     * Trigger a `resize` event, useful if you need to repaint the current map (for changes in the viewport or display / hide actions).
     */
    this.refresh = function() {
      google.maps.event.trigger(this.map, 'resize');
    };

    /**
     * Adjust the map zoom to include all the markers added in the map.
     */
    this.fitZoom = function() {
      var latLngs = [],
          markers_length = this.markers.length,
          i;

      for (i = 0; i < markers_length; i++) {
        if(typeof(this.markers[i].visible) === 'boolean' && this.markers[i].visible) {
          latLngs.push(this.markers[i].getPosition());
        }
      }

      this.fitLatLngBounds(latLngs);
    };

    /**
     * Adjust the map zoom to include all the coordinates in the `latLngs` array.
     *
     * @param {array} latLngs - Collection of `google.maps.LatLng` objects.
     */
    this.fitLatLngBounds = function(latLngs) {
      var total = latLngs.length,
          bounds = new google.maps.LatLngBounds(),
          i;

      for(i = 0; i < total; i++) {
        bounds.extend(latLngs[i]);
      }

      this.map.fitBounds(bounds);
    };

    /**
     * Center the map using the `lat` and `lng` coordinates.
     *
     * @param {number} lat - Latitude of the coordinate.
     * @param {number} lng - Longitude of the coordinate.
     * @param {function} [callback] - Callback that will be executed after the map is centered.
     */
    this.setCenter = function(lat, lng, callback) {
      this.map.panTo(new google.maps.LatLng(lat, lng));

      if (callback) {
        callback();
      }
    };

    /**
     * Return the HTML element container of the map.
     *
     * @returns {HTMLElement} the element container.
     */
    this.getElement = function() {
      return this.el;
    };

    /**
     * Increase the map's zoom.
     *
     * @param {number} [magnitude] - The number of times the map will be zoomed in.
     */
    this.zoomIn = function(value) {
      value = value || 1;

      this.zoom = this.map.getZoom() + value;
      this.map.setZoom(this.zoom);
    };

    /**
     * Decrease the map's zoom.
     *
     * @param {number} [magnitude] - The number of times the map will be zoomed out.
     */
    this.zoomOut = function(value) {
      value = value || 1;

      this.zoom = this.map.getZoom() - value;
      this.map.setZoom(this.zoom);
    };

    var native_methods = [],
        method;

    for (method in this.map) {
      if (typeof(this.map[method]) == 'function' && !this[method]) {
        native_methods.push(method);
      }
    }

    for (i = 0; i < native_methods.length; i++) {
      (function(gmaps, scope, method_name) {
        gmaps[method_name] = function(){
          return scope[method_name].apply(scope, arguments);
        };
      })(this, this.map, native_methods[i]);
    }
  };

  return GMaps;
})(this);

GMaps.prototype.createControl = function(options) {
  var control = document.createElement('div');

  control.style.cursor = 'pointer';

  if (options.disableDefaultStyles !== true) {
    control.style.fontFamily = 'Roboto, Arial, sans-serif';
    control.style.fontSize = '11px';
    control.style.boxShadow = 'rgba(0, 0, 0, 0.298039) 0px 1px 4px -1px';
  }

  for (var option in options.style) {
    control.style[option] = options.style[option];
  }

  if (options.id) {
    control.id = options.id;
  }

  if (options.title) {
    control.title = options.title;
  }

  if (options.classes) {
    control.className = options.classes;
  }

  if (options.content) {
    if (typeof options.content === 'string') {
      control.innerHTML = options.content;
    }
    else if (options.content instanceof HTMLElement) {
      control.appendChild(options.content);
    }
  }

  if (options.position) {
    control.position = google.maps.ControlPosition[options.position.toUpperCase()];
  }

  for (var ev in options.events) {
    (function(object, name) {
      google.maps.event.addDomListener(object, name, function(){
        options.events[name].apply(this, [this]);
      });
    })(control, ev);
  }

  control.index = 1;

  return control;
};

/**
 * Add a custom control to the map UI.
 *
 * @param {object} options - The `options` object should contain:
 * * `style` (object): The keys and values of this object should be valid CSS properties and values.
 * * `id` (string): The HTML id for the custom control.
 * * `classes` (string): A string containing all the HTML classes for the custom control.
 * * `content` (string or HTML element): The content of the custom control.
 * * `position` (string): Any valid [`google.maps.ControlPosition`](https://developers.google.com/maps/documentation/javascript/controls#ControlPositioning) value, in lower or upper case.
 * * `events` (object): The keys of this object should be valid DOM events. The values should be functions.
 * * `disableDefaultStyles` (boolean): If false, removes the default styles for the controls like font (family and size), and box shadow.
 * @returns {HTMLElement}
 */
GMaps.prototype.addControl = function(options) {
  var control = this.createControl(options);

  this.controls.push(control);
  this.map.controls[control.position].push(control);

  return control;
};

/**
 * Remove a control from the map. `control` should be a control returned by `addControl()`.
 *
 * @param {HTMLElement} control - One of the controls returned by `addControl()`.
 * @returns {HTMLElement} the removed control.
 */
GMaps.prototype.removeControl = function(control) {
  var position = null,
      i;

  for (i = 0; i < this.controls.length; i++) {
    if (this.controls[i] == control) {
      position = this.controls[i].position;
      this.controls.splice(i, 1);
    }
  }

  if (position) {
    for (i = 0; i < this.map.controls.length; i++) {
      var controlsForPosition = this.map.controls[control.position];

      if (controlsForPosition.getAt(i) == control) {
        controlsForPosition.removeAt(i);

        break;
      }
    }
  }

  return control;
};

GMaps.prototype.createMarker = function(options) {
  if (options.lat == undefined && options.lng == undefined && options.position == undefined) {
    throw 'No latitude or longitude defined.';
  }

  var self = this,
      details = options.details,
      fences = options.fences,
      outside = options.outside,
      base_options = {
        position: new google.maps.LatLng(options.lat, options.lng),
        map: null
      },
      marker_options = extend_object(base_options, options);

  delete marker_options.lat;
  delete marker_options.lng;
  delete marker_options.fences;
  delete marker_options.outside;

  var marker = new google.maps.Marker(marker_options);

  marker.fences = fences;

  if (options.infoWindow) {
    marker.infoWindow = new google.maps.InfoWindow(options.infoWindow);

    var info_window_events = ['closeclick', 'content_changed', 'domready', 'position_changed', 'zindex_changed'];

    for (var ev = 0; ev < info_window_events.length; ev++) {
      (function(object, name) {
        if (options.infoWindow[name]) {
          google.maps.event.addListener(object, name, function(e){
            options.infoWindow[name].apply(this, [e]);
          });
        }
      })(marker.infoWindow, info_window_events[ev]);
    }
  }

  var marker_events = ['animation_changed', 'clickable_changed', 'cursor_changed', 'draggable_changed', 'flat_changed', 'icon_changed', 'position_changed', 'shadow_changed', 'shape_changed', 'title_changed', 'visible_changed', 'zindex_changed'];

  var marker_events_with_mouse = ['dblclick', 'drag', 'dragend', 'dragstart', 'mousedown', 'mouseout', 'mouseover', 'mouseup'];

  for (var ev = 0; ev < marker_events.length; ev++) {
    (function(object, name) {
      if (options[name]) {
        google.maps.event.addListener(object, name, function(){
          options[name].apply(this, [this]);
        });
      }
    })(marker, marker_events[ev]);
  }

  for (var ev = 0; ev < marker_events_with_mouse.length; ev++) {
    (function(map, object, name) {
      if (options[name]) {
        google.maps.event.addListener(object, name, function(me){
          if(!me.pixel){
            me.pixel = map.getProjection().fromLatLngToPoint(me.latLng)
          }

          options[name].apply(this, [me]);
        });
      }
    })(this.map, marker, marker_events_with_mouse[ev]);
  }

  google.maps.event.addListener(marker, 'click', function() {
    this.details = details;

    if (options.click) {
      options.click.apply(this, [this]);
    }

    if (marker.infoWindow) {
      self.hideInfoWindows();
      marker.infoWindow.open(self.map, marker);
    }
  });

  google.maps.event.addListener(marker, 'rightclick', function(e) {
    e.marker = this;

    if (options.rightclick) {
      options.rightclick.apply(this, [e]);
    }

    if (window.context_menu[self.el.id]['marker'] != undefined) {
      self.buildContextMenu('marker', e);
    }
  });

  if (marker.fences) {
    google.maps.event.addListener(marker, 'dragend', function() {
      self.checkMarkerGeofence(marker, function(m, f) {
        outside(m, f);
      });
    });
  }

  return marker;
};

GMaps.prototype.addMarker = function(options) {
  var marker;
  if(options.hasOwnProperty('gm_accessors_')) {
    // Native google.maps.Marker object
    marker = options;
  }
  else {
    if ((options.hasOwnProperty('lat') && options.hasOwnProperty('lng')) || options.position) {
      marker = this.createMarker(options);
    }
    else {
      throw 'No latitude or longitude defined.';
    }
  }

  marker.setMap(this.map);

  if(this.markerClusterer) {
    this.markerClusterer.addMarker(marker);
  }

  this.markers.push(marker);

  GMaps.fire('marker_added', marker, this);

  return marker;
};

GMaps.prototype.addMarkers = function(array) {
  for (var i = 0, marker; marker=array[i]; i++) {
    this.addMarker(marker);
  }

  return this.markers;
};

GMaps.prototype.hideInfoWindows = function() {
  for (var i = 0, marker; marker = this.markers[i]; i++){
    if (marker.infoWindow) {
      marker.infoWindow.close();
    }
  }
};

GMaps.prototype.removeMarker = function(marker) {
  for (var i = 0; i < this.markers.length; i++) {
    if (this.markers[i] === marker) {
      this.markers[i].setMap(null);
      this.markers.splice(i, 1);

      if(this.markerClusterer) {
        this.markerClusterer.removeMarker(marker);
      }

      GMaps.fire('marker_removed', marker, this);

      break;
    }
  }

  return marker;
};

GMaps.prototype.removeMarkers = function (collection) {
  var new_markers = [];

  if (typeof collection == 'undefined') {
    for (var i = 0; i < this.markers.length; i++) {
      var marker = this.markers[i];
      marker.setMap(null);

      GMaps.fire('marker_removed', marker, this);
    }

    if(this.markerClusterer && this.markerClusterer.clearMarkers) {
      this.markerClusterer.clearMarkers();
    }

    this.markers = new_markers;
  }
  else {
    for (var i = 0; i < collection.length; i++) {
      var index = this.markers.indexOf(collection[i]);

      if (index > -1) {
        var marker = this.markers[index];
        marker.setMap(null);

        if(this.markerClusterer) {
          this.markerClusterer.removeMarker(marker);
        }

        GMaps.fire('marker_removed', marker, this);
      }
    }

    for (var i = 0; i < this.markers.length; i++) {
      var marker = this.markers[i];
      if (marker.getMap() != null) {
        new_markers.push(marker);
      }
    }

    this.markers = new_markers;
  }
};

GMaps.prototype.drawOverlay = function(options) {
  var overlay = new google.maps.OverlayView(),
      auto_show = true;

  overlay.setMap(this.map);

  if (options.auto_show != null) {
    auto_show = options.auto_show;
  }

  overlay.onAdd = function() {
    var el = document.createElement('div');

    el.style.borderStyle = "none";
    el.style.borderWidth = "0px";
    el.style.position = "absolute";
    el.style.zIndex = 100;
    el.innerHTML = options.content;

    overlay.el = el;

    if (!options.layer) {
      options.layer = 'overlayLayer';
    }
    
    var panes = this.getPanes(),
        overlayLayer = panes[options.layer],
        stop_overlay_events = ['contextmenu', 'DOMMouseScroll', 'dblclick', 'mousedown'];

    overlayLayer.appendChild(el);

    for (var ev = 0; ev < stop_overlay_events.length; ev++) {
      (function(object, name) {
        google.maps.event.addDomListener(object, name, function(e){
          if (navigator.userAgent.toLowerCase().indexOf('msie') != -1 && document.all) {
            e.cancelBubble = true;
            e.returnValue = false;
          }
          else {
            e.stopPropagation();
          }
        });
      })(el, stop_overlay_events[ev]);
    }

    if (options.click) {
      panes.overlayMouseTarget.appendChild(overlay.el);
      google.maps.event.addDomListener(overlay.el, 'click', function() {
        options.click.apply(overlay, [overlay]);
      });
    }

    google.maps.event.trigger(this, 'ready');
  };

  overlay.draw = function() {
    var projection = this.getProjection(),
        pixel = projection.fromLatLngToDivPixel(new google.maps.LatLng(options.lat, options.lng));

    options.horizontalOffset = options.horizontalOffset || 0;
    options.verticalOffset = options.verticalOffset || 0;

    var el = overlay.el,
        content = el.children[0],
        content_height = content.clientHeight,
        content_width = content.clientWidth;

    switch (options.verticalAlign) {
      case 'top':
        el.style.top = (pixel.y - content_height + options.verticalOffset) + 'px';
        break;
      default:
      case 'middle':
        el.style.top = (pixel.y - (content_height / 2) + options.verticalOffset) + 'px';
        break;
      case 'bottom':
        el.style.top = (pixel.y + options.verticalOffset) + 'px';
        break;
    }

    switch (options.horizontalAlign) {
      case 'left':
        el.style.left = (pixel.x - content_width + options.horizontalOffset) + 'px';
        break;
      default:
      case 'center':
        el.style.left = (pixel.x - (content_width / 2) + options.horizontalOffset) + 'px';
        break;
      case 'right':
        el.style.left = (pixel.x + options.horizontalOffset) + 'px';
        break;
    }

    el.style.display = auto_show ? 'block' : 'none';

    if (!auto_show) {
      options.show.apply(this, [el]);
    }
  };

  overlay.onRemove = function() {
    var el = overlay.el;

    if (options.remove) {
      options.remove.apply(this, [el]);
    }
    else {
      overlay.el.parentNode.removeChild(overlay.el);
      overlay.el = null;
    }
  };

  this.overlays.push(overlay);
  return overlay;
};

GMaps.prototype.removeOverlay = function(overlay) {
  for (var i = 0; i < this.overlays.length; i++) {
    if (this.overlays[i] === overlay) {
      this.overlays[i].setMap(null);
      this.overlays.splice(i, 1);

      break;
    }
  }
};

GMaps.prototype.removeOverlays = function() {
  for (var i = 0, item; item = this.overlays[i]; i++) {
    item.setMap(null);
  }

  this.overlays = [];
};

GMaps.prototype.drawPolyline = function(options) {
  var path = [],
      points = options.path;

  if (points.length) {
    if (points[0][0] === undefined) {
      path = points;
    }
    else {
      for (var i = 0, latlng; latlng = points[i]; i++) {
        path.push(new google.maps.LatLng(latlng[0], latlng[1]));
      }
    }
  }

  var polyline_options = {
    map: this.map,
    path: path,
    strokeColor: options.strokeColor,
    strokeOpacity: options.strokeOpacity,
    strokeWeight: options.strokeWeight,
    geodesic: options.geodesic,
    clickable: true,
    editable: false,
    visible: true
  };

  if (options.hasOwnProperty("clickable")) {
    polyline_options.clickable = options.clickable;
  }

  if (options.hasOwnProperty("editable")) {
    polyline_options.editable = options.editable;
  }

  if (options.hasOwnProperty("icons")) {
    polyline_options.icons = options.icons;
  }

  if (options.hasOwnProperty("zIndex")) {
    polyline_options.zIndex = options.zIndex;
  }

  var polyline = new google.maps.Polyline(polyline_options);

  var polyline_events = ['click', 'dblclick', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'rightclick'];

  for (var ev = 0; ev < polyline_events.length; ev++) {
    (function(object, name) {
      if (options[name]) {
        google.maps.event.addListener(object, name, function(e){
          options[name].apply(this, [e]);
        });
      }
    })(polyline, polyline_events[ev]);
  }

  this.polylines.push(polyline);

  GMaps.fire('polyline_added', polyline, this);

  return polyline;
};

GMaps.prototype.removePolyline = function(polyline) {
  for (var i = 0; i < this.polylines.length; i++) {
    if (this.polylines[i] === polyline) {
      this.polylines[i].setMap(null);
      this.polylines.splice(i, 1);

      GMaps.fire('polyline_removed', polyline, this);

      break;
    }
  }
};

GMaps.prototype.removePolylines = function() {
  for (var i = 0, item; item = this.polylines[i]; i++) {
    item.setMap(null);
  }

  this.polylines = [];
};

GMaps.prototype.drawCircle = function(options) {
  options =  extend_object({
    map: this.map,
    center: new google.maps.LatLng(options.lat, options.lng)
  }, options);

  delete options.lat;
  delete options.lng;

  var polygon = new google.maps.Circle(options),
      polygon_events = ['click', 'dblclick', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'rightclick'];

  for (var ev = 0; ev < polygon_events.length; ev++) {
    (function(object, name) {
      if (options[name]) {
        google.maps.event.addListener(object, name, function(e){
          options[name].apply(this, [e]);
        });
      }
    })(polygon, polygon_events[ev]);
  }

  this.polygons.push(polygon);

  return polygon;
};

GMaps.prototype.drawRectangle = function(options) {
  options = extend_object({
    map: this.map
  }, options);

  var latLngBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(options.bounds[0][0], options.bounds[0][1]),
    new google.maps.LatLng(options.bounds[1][0], options.bounds[1][1])
  );

  options.bounds = latLngBounds;

  var polygon = new google.maps.Rectangle(options),
      polygon_events = ['click', 'dblclick', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'rightclick'];

  for (var ev = 0; ev < polygon_events.length; ev++) {
    (function(object, name) {
      if (options[name]) {
        google.maps.event.addListener(object, name, function(e){
          options[name].apply(this, [e]);
        });
      }
    })(polygon, polygon_events[ev]);
  }

  this.polygons.push(polygon);

  return polygon;
};

GMaps.prototype.drawPolygon = function(options) {
  var useGeoJSON = false;

  if(options.hasOwnProperty("useGeoJSON")) {
    useGeoJSON = options.useGeoJSON;
  }

  delete options.useGeoJSON;

  options = extend_object({
    map: this.map
  }, options);

  if (useGeoJSON == false) {
    options.paths = [options.paths.slice(0)];
  }

  if (options.paths.length > 0) {
    if (options.paths[0].length > 0) {
      options.paths = array_flat(array_map(options.paths, arrayToLatLng, useGeoJSON));
    }
  }

  var polygon = new google.maps.Polygon(options),
      polygon_events = ['click', 'dblclick', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'rightclick'];

  for (var ev = 0; ev < polygon_events.length; ev++) {
    (function(object, name) {
      if (options[name]) {
        google.maps.event.addListener(object, name, function(e){
          options[name].apply(this, [e]);
        });
      }
    })(polygon, polygon_events[ev]);
  }

  this.polygons.push(polygon);

  GMaps.fire('polygon_added', polygon, this);

  return polygon;
};

GMaps.prototype.removePolygon = function(polygon) {
  for (var i = 0; i < this.polygons.length; i++) {
    if (this.polygons[i] === polygon) {
      this.polygons[i].setMap(null);
      this.polygons.splice(i, 1);

      GMaps.fire('polygon_removed', polygon, this);

      break;
    }
  }
};

GMaps.prototype.removePolygons = function() {
  for (var i = 0, item; item = this.polygons[i]; i++) {
    item.setMap(null);
  }

  this.polygons = [];
};

GMaps.prototype.getFromFusionTables = function(options) {
  var events = options.events;

  delete options.events;

  var fusion_tables_options = options,
      layer = new google.maps.FusionTablesLayer(fusion_tables_options);

  for (var ev in events) {
    (function(object, name) {
      google.maps.event.addListener(object, name, function(e) {
        events[name].apply(this, [e]);
      });
    })(layer, ev);
  }

  this.layers.push(layer);

  return layer;
};

GMaps.prototype.loadFromFusionTables = function(options) {
  var layer = this.getFromFusionTables(options);
  layer.setMap(this.map);

  return layer;
};

GMaps.prototype.getFromKML = function(options) {
  var url = options.url,
      events = options.events;

  delete options.url;
  delete options.events;

  var kml_options = options,
      layer = new google.maps.KmlLayer(url, kml_options);

  for (var ev in events) {
    (function(object, name) {
      google.maps.event.addListener(object, name, function(e) {
        events[name].apply(this, [e]);
      });
    })(layer, ev);
  }

  this.layers.push(layer);

  return layer;
};

GMaps.prototype.loadFromKML = function(options) {
  var layer = this.getFromKML(options);
  layer.setMap(this.map);

  return layer;
};

GMaps.prototype.addLayer = function(layerName, options) {
  //var default_layers = ['weather', 'clouds', 'traffic', 'transit', 'bicycling', 'panoramio', 'places'];
  options = options || {};
  var layer;

  switch(layerName) {
    case 'weather': this.singleLayers.weather = layer = new google.maps.weather.WeatherLayer();
      break;
    case 'clouds': this.singleLayers.clouds = layer = new google.maps.weather.CloudLayer();
      break;
    case 'traffic': this.singleLayers.traffic = layer = new google.maps.TrafficLayer();
      break;
    case 'transit': this.singleLayers.transit = layer = new google.maps.TransitLayer();
      break;
    case 'bicycling': this.singleLayers.bicycling = layer = new google.maps.BicyclingLayer();
      break;
    case 'panoramio':
        this.singleLayers.panoramio = layer = new google.maps.panoramio.PanoramioLayer();
        layer.setTag(options.filter);
        delete options.filter;

        //click event
        if (options.click) {
          google.maps.event.addListener(layer, 'click', function(event) {
            options.click(event);
            delete options.click;
          });
        }
      break;
      case 'places':
        this.singleLayers.places = layer = new google.maps.places.PlacesService(this.map);

        //search, nearbySearch, radarSearch callback, Both are the same
        if (options.search || options.nearbySearch || options.radarSearch) {
          var placeSearchRequest  = {
            bounds : options.bounds || null,
            keyword : options.keyword || null,
            location : options.location || null,
            name : options.name || null,
            radius : options.radius || null,
            rankBy : options.rankBy || null,
            types : options.types || null
          };

          if (options.radarSearch) {
            layer.radarSearch(placeSearchRequest, options.radarSearch);
          }

          if (options.search) {
            layer.search(placeSearchRequest, options.search);
          }

          if (options.nearbySearch) {
            layer.nearbySearch(placeSearchRequest, options.nearbySearch);
          }
        }

        //textSearch callback
        if (options.textSearch) {
          var textSearchRequest  = {
            bounds : options.bounds || null,
            location : options.location || null,
            query : options.query || null,
            radius : options.radius || null
          };

          layer.textSearch(textSearchRequest, options.textSearch);
        }
      break;
  }

  if (layer !== undefined) {
    if (typeof layer.setOptions == 'function') {
      layer.setOptions(options);
    }
    if (typeof layer.setMap == 'function') {
      layer.setMap(this.map);
    }

    return layer;
  }
};

GMaps.prototype.removeLayer = function(layer) {
  if (typeof(layer) == "string" && this.singleLayers[layer] !== undefined) {
     this.singleLayers[layer].setMap(null);

     delete this.singleLayers[layer];
  }
  else {
    for (var i = 0; i < this.layers.length; i++) {
      if (this.layers[i] === layer) {
        this.layers[i].setMap(null);
        this.layers.splice(i, 1);

        break;
      }
    }
  }
};

var travelMode, unitSystem;

GMaps.prototype.getRoutes = function(options) {
  switch (options.travelMode) {
    case 'bicycling':
      travelMode = google.maps.TravelMode.BICYCLING;
      break;
    case 'transit':
      travelMode = google.maps.TravelMode.TRANSIT;
      break;
    case 'driving':
      travelMode = google.maps.TravelMode.DRIVING;
      break;
    default:
      travelMode = google.maps.TravelMode.WALKING;
      break;
  }

  if (options.unitSystem === 'imperial') {
    unitSystem = google.maps.UnitSystem.IMPERIAL;
  }
  else {
    unitSystem = google.maps.UnitSystem.METRIC;
  }

  var base_options = {
        avoidHighways: false,
        avoidTolls: false,
        optimizeWaypoints: false,
        waypoints: []
      },
      request_options =  extend_object(base_options, options);

  request_options.origin = /string/.test(typeof options.origin) ? options.origin : new google.maps.LatLng(options.origin[0], options.origin[1]);
  request_options.destination = /string/.test(typeof options.destination) ? options.destination : new google.maps.LatLng(options.destination[0], options.destination[1]);
  request_options.travelMode = travelMode;
  request_options.unitSystem = unitSystem;

  delete request_options.callback;
  delete request_options.error;

  var self = this,
      routes = [],
      service = new google.maps.DirectionsService();

  service.route(request_options, function(result, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      for (var r in result.routes) {
        if (result.routes.hasOwnProperty(r)) {
          routes.push(result.routes[r]);
        }
      }

      if (options.callback) {
        options.callback(routes, result, status);
      }
    }
    else {
      if (options.error) {
        options.error(result, status);
      }
    }
  });
};

GMaps.prototype.removeRoutes = function() {
  this.routes.length = 0;
};

GMaps.prototype.getElevations = function(options) {
  options = extend_object({
    locations: [],
    path : false,
    samples : 256
  }, options);

  if (options.locations.length > 0) {
    if (options.locations[0].length > 0) {
      options.locations = array_flat(array_map([options.locations], arrayToLatLng,  false));
    }
  }

  var callback = options.callback;
  delete options.callback;

  var service = new google.maps.ElevationService();

  //location request
  if (!options.path) {
    delete options.path;
    delete options.samples;

    service.getElevationForLocations(options, function(result, status) {
      if (callback && typeof(callback) === "function") {
        callback(result, status);
      }
    });
  //path request
  } else {
    var pathRequest = {
      path : options.locations,
      samples : options.samples
    };

    service.getElevationAlongPath(pathRequest, function(result, status) {
     if (callback && typeof(callback) === "function") {
        callback(result, status);
      }
    });
  }
};

GMaps.prototype.cleanRoute = GMaps.prototype.removePolylines;

GMaps.prototype.renderRoute = function(options, renderOptions) {
  var self = this,
      panel = ((typeof renderOptions.panel === 'string') ? document.getElementById(renderOptions.panel.replace('#', '')) : renderOptions.panel),
      display;

  renderOptions.panel = panel;
  renderOptions = extend_object({
    map: this.map
  }, renderOptions);
  display = new google.maps.DirectionsRenderer(renderOptions);

  this.getRoutes({
    origin: options.origin,
    destination: options.destination,
    travelMode: options.travelMode,
    waypoints: options.waypoints,
    unitSystem: options.unitSystem,
    error: options.error,
    avoidHighways: options.avoidHighways,
    avoidTolls: options.avoidTolls,
    optimizeWaypoints: options.optimizeWaypoints,
    callback: function(routes, response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        display.setDirections(response);
      }
    }
  });
};

GMaps.prototype.drawRoute = function(options) {
  var self = this;

  this.getRoutes({
    origin: options.origin,
    destination: options.destination,
    travelMode: options.travelMode,
    waypoints: options.waypoints,
    unitSystem: options.unitSystem,
    error: options.error,
    avoidHighways: options.avoidHighways,
    avoidTolls: options.avoidTolls,
    optimizeWaypoints: options.optimizeWaypoints,
    callback: function(routes) {
      if (routes.length > 0) {
        var polyline_options = {
          path: routes[routes.length - 1].overview_path,
          strokeColor: options.strokeColor,
          strokeOpacity: options.strokeOpacity,
          strokeWeight: options.strokeWeight
        };

        if (options.hasOwnProperty("icons")) {
          polyline_options.icons = options.icons;
        }

        self.drawPolyline(polyline_options);

        if (options.callback) {
          options.callback(routes[routes.length - 1]);
        }
      }
    }
  });
};

GMaps.prototype.travelRoute = function(options) {
  if (options.origin && options.destination) {
    this.getRoutes({
      origin: options.origin,
      destination: options.destination,
      travelMode: options.travelMode,
      waypoints : options.waypoints,
      unitSystem: options.unitSystem,
      error: options.error,
      callback: function(e) {
        //start callback
        if (e.length > 0 && options.start) {
          options.start(e[e.length - 1]);
        }

        //step callback
        if (e.length > 0 && options.step) {
          var route = e[e.length - 1];
          if (route.legs.length > 0) {
            var steps = route.legs[0].steps;
            for (var i = 0, step; step = steps[i]; i++) {
              step.step_number = i;
              options.step(step, (route.legs[0].steps.length - 1));
            }
          }
        }

        //end callback
        if (e.length > 0 && options.end) {
           options.end(e[e.length - 1]);
        }
      }
    });
  }
  else if (options.route) {
    if (options.route.legs.length > 0) {
      var steps = options.route.legs[0].steps;
      for (var i = 0, step; step = steps[i]; i++) {
        step.step_number = i;
        options.step(step);
      }
    }
  }
};

GMaps.prototype.drawSteppedRoute = function(options) {
  var self = this;

  if (options.origin && options.destination) {
    this.getRoutes({
      origin: options.origin,
      destination: options.destination,
      travelMode: options.travelMode,
      waypoints : options.waypoints,
      error: options.error,
      callback: function(e) {
        //start callback
        if (e.length > 0 && options.start) {
          options.start(e[e.length - 1]);
        }

        //step callback
        if (e.length > 0 && options.step) {
          var route = e[e.length - 1];
          if (route.legs.length > 0) {
            var steps = route.legs[0].steps;
            for (var i = 0, step; step = steps[i]; i++) {
              step.step_number = i;
              var polyline_options = {
                path: step.path,
                strokeColor: options.strokeColor,
                strokeOpacity: options.strokeOpacity,
                strokeWeight: options.strokeWeight
              };

              if (options.hasOwnProperty("icons")) {
                polyline_options.icons = options.icons;
              }

              self.drawPolyline(polyline_options);
              options.step(step, (route.legs[0].steps.length - 1));
            }
          }
        }

        //end callback
        if (e.length > 0 && options.end) {
           options.end(e[e.length - 1]);
        }
      }
    });
  }
  else if (options.route) {
    if (options.route.legs.length > 0) {
      var steps = options.route.legs[0].steps;
      for (var i = 0, step; step = steps[i]; i++) {
        step.step_number = i;
        var polyline_options = {
          path: step.path,
          strokeColor: options.strokeColor,
          strokeOpacity: options.strokeOpacity,
          strokeWeight: options.strokeWeight
        };

        if (options.hasOwnProperty("icons")) {
          polyline_options.icons = options.icons;
        }

        self.drawPolyline(polyline_options);
        options.step(step);
      }
    }
  }
};

GMaps.Route = function(options) {
  this.origin = options.origin;
  this.destination = options.destination;
  this.waypoints = options.waypoints;

  this.map = options.map;
  this.route = options.route;
  this.step_count = 0;
  this.steps = this.route.legs[0].steps;
  this.steps_length = this.steps.length;

  var polyline_options = {
    path: new google.maps.MVCArray(),
    strokeColor: options.strokeColor,
    strokeOpacity: options.strokeOpacity,
    strokeWeight: options.strokeWeight
  };

  if (options.hasOwnProperty("icons")) {
    polyline_options.icons = options.icons;
  }

  this.polyline = this.map.drawPolyline(polyline_options).getPath();
};

GMaps.Route.prototype.getRoute = function(options) {
  var self = this;

  this.map.getRoutes({
    origin : this.origin,
    destination : this.destination,
    travelMode : options.travelMode,
    waypoints : this.waypoints || [],
    error: options.error,
    callback : function() {
      self.route = e[0];

      if (options.callback) {
        options.callback.call(self);
      }
    }
  });
};

GMaps.Route.prototype.back = function() {
  if (this.step_count > 0) {
    this.step_count--;
    var path = this.route.legs[0].steps[this.step_count].path;

    for (var p in path){
      if (path.hasOwnProperty(p)){
        this.polyline.pop();
      }
    }
  }
};

GMaps.Route.prototype.forward = function() {
  if (this.step_count < this.steps_length) {
    var path = this.route.legs[0].steps[this.step_count].path;

    for (var p in path){
      if (path.hasOwnProperty(p)){
        this.polyline.push(path[p]);
      }
    }
    this.step_count++;
  }
};

GMaps.prototype.checkGeofence = function(lat, lng, fence) {
  return fence.containsLatLng(new google.maps.LatLng(lat, lng));
};

GMaps.prototype.checkMarkerGeofence = function(marker, outside_callback) {
  if (marker.fences) {
    for (var i = 0, fence; fence = marker.fences[i]; i++) {
      var pos = marker.getPosition();
      if (!this.checkGeofence(pos.lat(), pos.lng(), fence)) {
        outside_callback(marker, fence);
      }
    }
  }
};

GMaps.prototype.toImage = function(options) {
  var options = options || {},
      static_map_options = {};

  static_map_options['size'] = options['size'] || [this.el.clientWidth, this.el.clientHeight];
  static_map_options['lat'] = this.getCenter().lat();
  static_map_options['lng'] = this.getCenter().lng();

  if (this.markers.length > 0) {
    static_map_options['markers'] = [];
    
    for (var i = 0; i < this.markers.length; i++) {
      static_map_options['markers'].push({
        lat: this.markers[i].getPosition().lat(),
        lng: this.markers[i].getPosition().lng()
      });
    }
  }

  if (this.polylines.length > 0) {
    var polyline = this.polylines[0];
    
    static_map_options['polyline'] = {};
    static_map_options['polyline']['path'] = google.maps.geometry.encoding.encodePath(polyline.getPath());
    static_map_options['polyline']['strokeColor'] = polyline.strokeColor
    static_map_options['polyline']['strokeOpacity'] = polyline.strokeOpacity
    static_map_options['polyline']['strokeWeight'] = polyline.strokeWeight
  }

  return GMaps.staticMapURL(static_map_options);
};

GMaps.staticMapURL = function(options){
  var parameters = [],
      data,
      static_root = (location.protocol === 'file:' ? 'http:' : location.protocol ) + '//maps.googleapis.com/maps/api/staticmap';

  if (options.url) {
    static_root = options.url;
    delete options.url;
  }

  static_root += '?';

  var markers = options.markers;
  
  delete options.markers;

  if (!markers && options.marker) {
    markers = [options.marker];
    delete options.marker;
  }

  var styles = options.styles;

  delete options.styles;

  var polyline = options.polyline;
  delete options.polyline;

  /** Map options **/
  if (options.center) {
    parameters.push('center=' + options.center);
    delete options.center;
  }
  else if (options.address) {
    parameters.push('center=' + options.address);
    delete options.address;
  }
  else if (options.lat) {
    parameters.push(['center=', options.lat, ',', options.lng].join(''));
    delete options.lat;
    delete options.lng;
  }
  else if (options.visible) {
    var visible = encodeURI(options.visible.join('|'));
    parameters.push('visible=' + visible);
  }

  var size = options.size;
  if (size) {
    if (size.join) {
      size = size.join('x');
    }
    delete options.size;
  }
  else {
    size = '630x300';
  }
  parameters.push('size=' + size);

  if (!options.zoom && options.zoom !== false) {
    options.zoom = 15;
  }

  var sensor = options.hasOwnProperty('sensor') ? !!options.sensor : true;
  delete options.sensor;
  parameters.push('sensor=' + sensor);

  for (var param in options) {
    if (options.hasOwnProperty(param)) {
      parameters.push(param + '=' + options[param]);
    }
  }

  /** Markers **/
  if (markers) {
    var marker, loc;

    for (var i = 0; data = markers[i]; i++) {
      marker = [];

      if (data.size && data.size !== 'normal') {
        marker.push('size:' + data.size);
        delete data.size;
      }
      else if (data.icon) {
        marker.push('icon:' + encodeURI(data.icon));
        delete data.icon;
      }

      if (data.color) {
        marker.push('color:' + data.color.replace('#', '0x'));
        delete data.color;
      }

      if (data.label) {
        marker.push('label:' + data.label[0].toUpperCase());
        delete data.label;
      }

      loc = (data.address ? data.address : data.lat + ',' + data.lng);
      delete data.address;
      delete data.lat;
      delete data.lng;

      for(var param in data){
        if (data.hasOwnProperty(param)) {
          marker.push(param + ':' + data[param]);
        }
      }

      if (marker.length || i === 0) {
        marker.push(loc);
        marker = marker.join('|');
        parameters.push('markers=' + encodeURI(marker));
      }
      // New marker without styles
      else {
        marker = parameters.pop() + encodeURI('|' + loc);
        parameters.push(marker);
      }
    }
  }

  /** Map Styles **/
  if (styles) {
    for (var i = 0; i < styles.length; i++) {
      var styleRule = [];
      if (styles[i].featureType){
        styleRule.push('feature:' + styles[i].featureType.toLowerCase());
      }

      if (styles[i].elementType) {
        styleRule.push('element:' + styles[i].elementType.toLowerCase());
      }

      for (var j = 0; j < styles[i].stylers.length; j++) {
        for (var p in styles[i].stylers[j]) {
          var ruleArg = styles[i].stylers[j][p];
          if (p == 'hue' || p == 'color') {
            ruleArg = '0x' + ruleArg.substring(1);
          }
          styleRule.push(p + ':' + ruleArg);
        }
      }

      var rule = styleRule.join('|');
      if (rule != '') {
        parameters.push('style=' + rule);
      }
    }
  }

  /** Polylines **/
  function parseColor(color, opacity) {
    if (color[0] === '#'){
      color = color.replace('#', '0x');

      if (opacity) {
        opacity = parseFloat(opacity);
        opacity = Math.min(1, Math.max(opacity, 0));
        if (opacity === 0) {
          return '0x00000000';
        }
        opacity = (opacity * 255).toString(16);
        if (opacity.length === 1) {
          opacity += opacity;
        }

        color = color.slice(0,8) + opacity;
      }
    }
    return color;
  }

  if (polyline) {
    data = polyline;
    polyline = [];

    if (data.strokeWeight) {
      polyline.push('weight:' + parseInt(data.strokeWeight, 10));
    }

    if (data.strokeColor) {
      var color = parseColor(data.strokeColor, data.strokeOpacity);
      polyline.push('color:' + color);
    }

    if (data.fillColor) {
      var fillcolor = parseColor(data.fillColor, data.fillOpacity);
      polyline.push('fillcolor:' + fillcolor);
    }

    var path = data.path;
    if (path.join) {
      for (var j=0, pos; pos=path[j]; j++) {
        polyline.push(pos.join(','));
      }
    }
    else {
      polyline.push('enc:' + path);
    }

    polyline = polyline.join('|');
    parameters.push('path=' + encodeURI(polyline));
  }

  /** Retina support **/
  var dpi = window.devicePixelRatio || 1;
  parameters.push('scale=' + dpi);

  parameters = parameters.join('&');
  return static_root + parameters;
};

GMaps.prototype.addMapType = function(mapTypeId, options) {
  if (options.hasOwnProperty("getTileUrl") && typeof(options["getTileUrl"]) == "function") {
    options.tileSize = options.tileSize || new google.maps.Size(256, 256);

    var mapType = new google.maps.ImageMapType(options);

    this.map.mapTypes.set(mapTypeId, mapType);
  }
  else {
    throw "'getTileUrl' function required.";
  }
};

GMaps.prototype.addOverlayMapType = function(options) {
  if (options.hasOwnProperty("getTile") && typeof(options["getTile"]) == "function") {
    var overlayMapTypeIndex = options.index;

    delete options.index;

    this.map.overlayMapTypes.insertAt(overlayMapTypeIndex, options);
  }
  else {
    throw "'getTile' function required.";
  }
};

GMaps.prototype.removeOverlayMapType = function(overlayMapTypeIndex) {
  this.map.overlayMapTypes.removeAt(overlayMapTypeIndex);
};

GMaps.prototype.addStyle = function(options) {
  var styledMapType = new google.maps.StyledMapType(options.styles, { name: options.styledMapName });

  this.map.mapTypes.set(options.mapTypeId, styledMapType);
};

GMaps.prototype.setStyle = function(mapTypeId) {
  this.map.setMapTypeId(mapTypeId);
};

GMaps.prototype.createPanorama = function(streetview_options) {
  if (!streetview_options.hasOwnProperty('lat') || !streetview_options.hasOwnProperty('lng')) {
    streetview_options.lat = this.getCenter().lat();
    streetview_options.lng = this.getCenter().lng();
  }

  this.panorama = GMaps.createPanorama(streetview_options);

  this.map.setStreetView(this.panorama);

  return this.panorama;
};

GMaps.createPanorama = function(options) {
  var el = getElementById(options.el, options.context);

  options.position = new google.maps.LatLng(options.lat, options.lng);

  delete options.el;
  delete options.context;
  delete options.lat;
  delete options.lng;

  var streetview_events = ['closeclick', 'links_changed', 'pano_changed', 'position_changed', 'pov_changed', 'resize', 'visible_changed'],
      streetview_options = extend_object({visible : true}, options);

  for (var i = 0; i < streetview_events.length; i++) {
    delete streetview_options[streetview_events[i]];
  }

  var panorama = new google.maps.StreetViewPanorama(el, streetview_options);

  for (var i = 0; i < streetview_events.length; i++) {
    (function(object, name) {
      if (options[name]) {
        google.maps.event.addListener(object, name, function(){
          options[name].apply(this);
        });
      }
    })(panorama, streetview_events[i]);
  }

  return panorama;
};

GMaps.prototype.on = function(event_name, handler) {
  return GMaps.on(event_name, this, handler);
};

GMaps.prototype.off = function(event_name) {
  GMaps.off(event_name, this);
};

GMaps.prototype.once = function(event_name, handler) {
  return GMaps.once(event_name, this, handler);
};

GMaps.custom_events = ['marker_added', 'marker_removed', 'polyline_added', 'polyline_removed', 'polygon_added', 'polygon_removed', 'geolocated', 'geolocation_failed'];

GMaps.on = function(event_name, object, handler) {
  if (GMaps.custom_events.indexOf(event_name) == -1) {
    if(object instanceof GMaps) object = object.map; 
    return google.maps.event.addListener(object, event_name, handler);
  }
  else {
    var registered_event = {
      handler : handler,
      eventName : event_name
    };

    object.registered_events[event_name] = object.registered_events[event_name] || [];
    object.registered_events[event_name].push(registered_event);

    return registered_event;
  }
};

GMaps.off = function(event_name, object) {
  if (GMaps.custom_events.indexOf(event_name) == -1) {
    if(object instanceof GMaps) object = object.map; 
    google.maps.event.clearListeners(object, event_name);
  }
  else {
    object.registered_events[event_name] = [];
  }
};

GMaps.once = function(event_name, object, handler) {
  if (GMaps.custom_events.indexOf(event_name) == -1) {
    if(object instanceof GMaps) object = object.map;
    return google.maps.event.addListenerOnce(object, event_name, handler);
  }
};

GMaps.fire = function(event_name, object, scope) {
  if (GMaps.custom_events.indexOf(event_name) == -1) {
    google.maps.event.trigger(object, event_name, Array.prototype.slice.apply(arguments).slice(2));
  }
  else {
    if(event_name in scope.registered_events) {
      var firing_events = scope.registered_events[event_name];

      for(var i = 0; i < firing_events.length; i++) {
        (function(handler, scope, object) {
          handler.apply(scope, [object]);
        })(firing_events[i]['handler'], scope, object);
      }
    }
  }
};

GMaps.geolocate = function(options) {
  var complete_callback = options.always || options.complete;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      options.success(position);

      if (complete_callback) {
        complete_callback();
      }
    }, function(error) {
      options.error(error);

      if (complete_callback) {
        complete_callback();
      }
    }, options.options);
  }
  else {
    options.not_supported();

    if (complete_callback) {
      complete_callback();
    }
  }
};

GMaps.geocode = function(options) {
  this.geocoder = new google.maps.Geocoder();
  var callback = options.callback;
  if (options.hasOwnProperty('lat') && options.hasOwnProperty('lng')) {
    options.latLng = new google.maps.LatLng(options.lat, options.lng);
  }

  delete options.lat;
  delete options.lng;
  delete options.callback;
  
  this.geocoder.geocode(options, function(results, status) {
    callback(results, status);
  });
};

if (typeof window.google === 'object' && window.google.maps) {
  //==========================
  // Polygon containsLatLng
  // https://github.com/tparkin/Google-Maps-Point-in-Polygon
  // Poygon getBounds extension - google-maps-extensions
  // http://code.google.com/p/google-maps-extensions/source/browse/google.maps.Polygon.getBounds.js
  if (!google.maps.Polygon.prototype.getBounds) {
    google.maps.Polygon.prototype.getBounds = function(latLng) {
      var bounds = new google.maps.LatLngBounds();
      var paths = this.getPaths();
      var path;

      for (var p = 0; p < paths.getLength(); p++) {
        path = paths.getAt(p);
        for (var i = 0; i < path.getLength(); i++) {
          bounds.extend(path.getAt(i));
        }
      }

      return bounds;
    };
  }

  if (!google.maps.Polygon.prototype.containsLatLng) {
    // Polygon containsLatLng - method to determine if a latLng is within a polygon
    google.maps.Polygon.prototype.containsLatLng = function(latLng) {
      // Exclude points outside of bounds as there is no way they are in the poly
      var bounds = this.getBounds();

      if (bounds !== null && !bounds.contains(latLng)) {
        return false;
      }

      // Raycast point in polygon method
      var inPoly = false;

      var numPaths = this.getPaths().getLength();
      for (var p = 0; p < numPaths; p++) {
        var path = this.getPaths().getAt(p);
        var numPoints = path.getLength();
        var j = numPoints - 1;

        for (var i = 0; i < numPoints; i++) {
          var vertex1 = path.getAt(i);
          var vertex2 = path.getAt(j);

          if (vertex1.lng() < latLng.lng() && vertex2.lng() >= latLng.lng() || vertex2.lng() < latLng.lng() && vertex1.lng() >= latLng.lng()) {
            if (vertex1.lat() + (latLng.lng() - vertex1.lng()) / (vertex2.lng() - vertex1.lng()) * (vertex2.lat() - vertex1.lat()) < latLng.lat()) {
              inPoly = !inPoly;
            }
          }

          j = i;
        }
      }

      return inPoly;
    };
  }

  if (!google.maps.Circle.prototype.containsLatLng) {
    google.maps.Circle.prototype.containsLatLng = function(latLng) {
      if (google.maps.geometry) {
        return google.maps.geometry.spherical.computeDistanceBetween(this.getCenter(), latLng) <= this.getRadius();
      }
      else {
        return true;
      }
    };
  }

  google.maps.Rectangle.prototype.containsLatLng = function(latLng) {
    return this.getBounds().contains(latLng);
  };

  google.maps.LatLngBounds.prototype.containsLatLng = function(latLng) {
    return this.contains(latLng);
  };

  google.maps.Marker.prototype.setFences = function(fences) {
    this.fences = fences;
  };

  google.maps.Marker.prototype.addFence = function(fence) {
    this.fences.push(fence);
  };

  google.maps.Marker.prototype.getId = function() {
    return this['__gm_id'];
  };
}

//==========================
// Array indexOf
// https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/indexOf
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
      "use strict";
      if (this == null) {
          throw new TypeError();
      }
      var t = Object(this);
      var len = t.length >>> 0;
      if (len === 0) {
          return -1;
      }
      var n = 0;
      if (arguments.length > 1) {
          n = Number(arguments[1]);
          if (n != n) { // shortcut for verifying if it's NaN
              n = 0;
          } else if (n != 0 && n != Infinity && n != -Infinity) {
              n = (n > 0 || -1) * Math.floor(Math.abs(n));
          }
      }
      if (n >= len) {
          return -1;
      }
      var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
      for (; k < len; k++) {
          if (k in t && t[k] === searchElement) {
              return k;
          }
      }
      return -1;
  }
}

return GMaps;
}));


/***/ }),

/***/ 1:
/***/ (function(module, exports) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * jQuery JavaScript Library v3.7.1
 * https://jquery.com/
 *
 * Copyright OpenJS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2023-08-28T13:37Z
 */
( function( global, factory ) {

	"use strict";

	if (  true && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket trac-14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";

var arr = [];

var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var flat = arr.flat ? function( array ) {
	return arr.flat.call( array );
} : function( array ) {
	return arr.concat.apply( [], array );
};


var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call( Object );

var support = {};

var isFunction = function isFunction( obj ) {

		// Support: Chrome <=57, Firefox <=52
		// In some browsers, typeof returns "function" for HTML <object> elements
		// (i.e., `typeof document.createElement( "object" ) === "function"`).
		// We don't want to classify *any* DOM node as a function.
		// Support: QtWeb <=3.8.5, WebKit <=534.34, wkhtmltopdf tool <=0.12.5
		// Plus for old WebKit, typeof returns "function" for HTML collections
		// (e.g., `typeof document.getElementsByTagName("div") === "function"`). (gh-4756)
		return typeof obj === "function" && typeof obj.nodeType !== "number" &&
			typeof obj.item !== "function";
	};


var isWindow = function isWindow( obj ) {
		return obj != null && obj === obj.window;
	};


var document = window.document;



	var preservedScriptAttributes = {
		type: true,
		src: true,
		nonce: true,
		noModule: true
	};

	function DOMEval( code, node, doc ) {
		doc = doc || document;

		var i, val,
			script = doc.createElement( "script" );

		script.text = code;
		if ( node ) {
			for ( i in preservedScriptAttributes ) {

				// Support: Firefox 64+, Edge 18+
				// Some browsers don't support the "nonce" property on scripts.
				// On the other hand, just using `getAttribute` is not enough as
				// the `nonce` attribute is reset to an empty string whenever it
				// becomes browsing-context connected.
				// See https://github.com/whatwg/html/issues/2369
				// See https://html.spec.whatwg.org/#nonce-attributes
				// The `node.getAttribute` check was added for the sake of
				// `jQuery.globalEval` so that it can fake a nonce-containing node
				// via an object.
				val = node[ i ] || node.getAttribute && node.getAttribute( i );
				if ( val ) {
					script.setAttribute( i, val );
				}
			}
		}
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}


function toType( obj ) {
	if ( obj == null ) {
		return obj + "";
	}

	// Support: Android <=2.3 only (functionish RegExp)
	return typeof obj === "object" || typeof obj === "function" ?
		class2type[ toString.call( obj ) ] || "object" :
		typeof obj;
}
/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module



var version = "3.7.1",

	rhtmlSuffix = /HTML$/i,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	even: function() {
		return this.pushStack( jQuery.grep( this, function( _elem, i ) {
			return ( i + 1 ) % 2;
		} ) );
	},

	odd: function() {
		return this.pushStack( jQuery.grep( this, function( _elem, i ) {
			return i % 2;
		} ) );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				copy = options[ name ];

				// Prevent Object.prototype pollution
				// Prevent never-ending loop
				if ( name === "__proto__" || target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {
					src = target[ name ];

					// Ensure proper type for the source value
					if ( copyIsArray && !Array.isArray( src ) ) {
						clone = [];
					} else if ( !copyIsArray && !jQuery.isPlainObject( src ) ) {
						clone = {};
					} else {
						clone = src;
					}
					copyIsArray = false;

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isPlainObject: function( obj ) {
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		proto = getProto( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	isEmptyObject: function( obj ) {
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	// Evaluates a script in a provided context; falls back to the global one
	// if not specified.
	globalEval: function( code, options, doc ) {
		DOMEval( code, { nonce: options && options.nonce }, doc );
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},


	// Retrieve the text value of an array of DOM nodes
	text: function( elem ) {
		var node,
			ret = "",
			i = 0,
			nodeType = elem.nodeType;

		if ( !nodeType ) {

			// If no nodeType, this is expected to be an array
			while ( ( node = elem[ i++ ] ) ) {

				// Do not traverse comment nodes
				ret += jQuery.text( node );
			}
		}
		if ( nodeType === 1 || nodeType === 11 ) {
			return elem.textContent;
		}
		if ( nodeType === 9 ) {
			return elem.documentElement.textContent;
		}
		if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}

		// Do not include comment or processing instruction nodes

		return ret;
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
						[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	isXMLDoc: function( elem ) {
		var namespace = elem && elem.namespaceURI,
			docElem = elem && ( elem.ownerDocument || elem ).documentElement;

		// Assume HTML when documentElement doesn't yet exist, such as inside
		// document fragments.
		return !rhtmlSuffix.test( namespace || docElem && docElem.nodeName || "HTML" );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return flat( ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
	function( _i, name ) {
		class2type[ "[object " + name + "]" ] = name.toLowerCase();
	} );

function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = toType( obj );

	if ( isFunction( obj ) || isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}


function nodeName( elem, name ) {

	return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

}
var pop = arr.pop;


var sort = arr.sort;


var splice = arr.splice;


var whitespace = "[\\x20\\t\\r\\n\\f]";


var rtrimCSS = new RegExp(
	"^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$",
	"g"
);




// Note: an element does not contain itself
jQuery.contains = function( a, b ) {
	var bup = b && b.parentNode;

	return a === bup || !!( bup && bup.nodeType === 1 && (

		// Support: IE 9 - 11+
		// IE doesn't have `contains` on SVG.
		a.contains ?
			a.contains( bup ) :
			a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
	) );
};




// CSS string/identifier serialization
// https://drafts.csswg.org/cssom/#common-serializing-idioms
var rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g;

function fcssescape( ch, asCodePoint ) {
	if ( asCodePoint ) {

		// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
		if ( ch === "\0" ) {
			return "\uFFFD";
		}

		// Control characters and (dependent upon position) numbers get escaped as code points
		return ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
	}

	// Other potentially-special ASCII characters get backslash-escaped
	return "\\" + ch;
}

jQuery.escapeSelector = function( sel ) {
	return ( sel + "" ).replace( rcssescape, fcssescape );
};




var preferredDoc = document,
	pushNative = push;

( function() {

var i,
	Expr,
	outermostContext,
	sortInput,
	hasDuplicate,
	push = pushNative,

	// Local document vars
	document,
	documentElement,
	documentIsHTML,
	rbuggyQSA,
	matches,

	// Instance-specific data
	expando = jQuery.expando,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	nonnativeSelectorCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|" +
		"loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// https://www.w3.org/TR/css-syntax-3/#ident-token-diagram
	identifier = "(?:\\\\[\\da-fA-F]{1,6}" + whitespace +
		"?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",

	// Attribute selectors: https://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +

		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +

		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" +
		whitespace + "*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +

		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +

		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +

		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rleadingCombinator = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" +
		whitespace + "*" ),
	rdescend = new RegExp( whitespace + "|>" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		ID: new RegExp( "^#(" + identifier + ")" ),
		CLASS: new RegExp( "^\\.(" + identifier + ")" ),
		TAG: new RegExp( "^(" + identifier + "|[*])" ),
		ATTR: new RegExp( "^" + attributes ),
		PSEUDO: new RegExp( "^" + pseudos ),
		CHILD: new RegExp(
			"^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
				whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" +
				whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		bool: new RegExp( "^(?:" + booleans + ")$", "i" ),

		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		needsContext: new RegExp( "^" + whitespace +
			"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace +
			"*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	// CSS escapes
	// https://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\[\\da-fA-F]{1,6}" + whitespace +
		"?|\\\\([^\\r\\n\\f])", "g" ),
	funescape = function( escape, nonHex ) {
		var high = "0x" + escape.slice( 1 ) - 0x10000;

		if ( nonHex ) {

			// Strip the backslash prefix from a non-hex escape sequence
			return nonHex;
		}

		// Replace a hexadecimal escape sequence with the encoded Unicode code point
		// Support: IE <=11+
		// For values outside the Basic Multilingual Plane (BMP), manually construct a
		// surrogate pair
		return high < 0 ?
			String.fromCharCode( high + 0x10000 ) :
			String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// Used for iframes; see `setDocument`.
	// Support: IE 9 - 11+, Edge 12 - 18+
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE/Edge.
	unloadHandler = function() {
		setDocument();
	},

	inDisabledFieldset = addCombinator(
		function( elem ) {
			return elem.disabled === true && nodeName( elem, "fieldset" );
		},
		{ dir: "parentNode", next: "legend" }
	);

// Support: IE <=9 only
// Accessing document.activeElement can throw unexpectedly
// https://bugs.jquery.com/ticket/13393
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		( arr = slice.call( preferredDoc.childNodes ) ),
		preferredDoc.childNodes
	);

	// Support: Android <=4.0
	// Detect silently failing push.apply
	// eslint-disable-next-line no-unused-expressions
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = {
		apply: function( target, els ) {
			pushNative.apply( target, slice.call( els ) );
		},
		call: function( target ) {
			pushNative.apply( target, slice.call( arguments, 1 ) );
		}
	};
}

function find( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {
		setDocument( context );
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && ( match = rquickExpr.exec( selector ) ) ) {

				// ID selector
				if ( ( m = match[ 1 ] ) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( ( elem = context.getElementById( m ) ) ) {

							// Support: IE 9 only
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								push.call( results, elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE 9 only
						// getElementById can match elements by name instead of ID
						if ( newContext && ( elem = newContext.getElementById( m ) ) &&
							find.contains( context, elem ) &&
							elem.id === m ) {

							push.call( results, elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[ 2 ] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( ( m = match[ 3 ] ) && context.getElementsByClassName ) {
					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( !nonnativeSelectorCache[ selector + " " ] &&
				( !rbuggyQSA || !rbuggyQSA.test( selector ) ) ) {

				newSelector = selector;
				newContext = context;

				// qSA considers elements outside a scoping root when evaluating child or
				// descendant combinators, which is not what we want.
				// In such cases, we work around the behavior by prefixing every selector in the
				// list with an ID selector referencing the scope context.
				// The technique has to be used as well when a leading combinator is used
				// as such selectors are not recognized by querySelectorAll.
				// Thanks to Andrew Dupont for this technique.
				if ( nodeType === 1 &&
					( rdescend.test( selector ) || rleadingCombinator.test( selector ) ) ) {

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;

					// We can use :scope instead of the ID hack if the browser
					// supports it & if we're not changing the context.
					// Support: IE 11+, Edge 17 - 18+
					// IE/Edge sometimes throw a "Permission denied" error when
					// strict-comparing two documents; shallow comparisons work.
					// eslint-disable-next-line eqeqeq
					if ( newContext != context || !support.scope ) {

						// Capture the context ID, setting it first if necessary
						if ( ( nid = context.getAttribute( "id" ) ) ) {
							nid = jQuery.escapeSelector( nid );
						} else {
							context.setAttribute( "id", ( nid = expando ) );
						}
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[ i ] = ( nid ? "#" + nid : ":scope" ) + " " +
							toSelector( groups[ i ] );
					}
					newSelector = groups.join( "," );
				}

				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch ( qsaError ) {
					nonnativeSelectorCache( selector, true );
				} finally {
					if ( nid === expando ) {
						context.removeAttribute( "id" );
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrimCSS, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {

		// Use (key + " ") to avoid collision with native prototype properties
		// (see https://github.com/jquery/sizzle/issues/157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {

			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return ( cache[ key + " " ] = value );
	}
	return cache;
}

/**
 * Mark a function for special use by jQuery selector module
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createElement( "fieldset" );

	try {
		return !!fn( el );
	} catch ( e ) {
		return false;
	} finally {

		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}

		// release memory in IE
		el = null;
	}
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		return nodeName( elem, "input" ) && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		return ( nodeName( elem, "input" ) || nodeName( elem, "button" ) ) &&
			elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) {

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

			// Check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// All such elements have a "form" property.
			if ( elem.parentNode && elem.disabled === false ) {

				// Option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11+
				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
				return elem.isDisabled === disabled ||

					// Where there is no isDisabled, check manually
					elem.isDisabled !== !disabled &&
						inDisabledFieldset( elem ) === disabled;
			}

			return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// Remaining elements are neither :enabled nor :disabled
		return false;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction( function( argument ) {
		argument = +argument;
		return markFunction( function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ ( j = matchIndexes[ i ] ) ] ) {
					seed[ j ] = !( matches[ j ] = seed[ j ] );
				}
			}
		} );
	} );
}

/**
 * Checks a node for validity as a jQuery selector context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [node] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
function setDocument( node ) {
	var subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( doc == document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	documentElement = document.documentElement;
	documentIsHTML = !jQuery.isXMLDoc( document );

	// Support: iOS 7 only, IE 9 - 11+
	// Older browsers didn't support unprefixed `matches`.
	matches = documentElement.matches ||
		documentElement.webkitMatchesSelector ||
		documentElement.msMatchesSelector;

	// Support: IE 9 - 11+, Edge 12 - 18+
	// Accessing iframe documents after unload throws "permission denied" errors
	// (see trac-13936).
	// Limit the fix to IE & Edge Legacy; despite Edge 15+ implementing `matches`,
	// all IE 9+ and Edge Legacy versions implement `msMatchesSelector` as well.
	if ( documentElement.msMatchesSelector &&

		// Support: IE 11+, Edge 17 - 18+
		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
		// two documents; shallow comparisons work.
		// eslint-disable-next-line eqeqeq
		preferredDoc != document &&
		( subWindow = document.defaultView ) && subWindow.top !== subWindow ) {

		// Support: IE 9 - 11+, Edge 12 - 18+
		subWindow.addEventListener( "unload", unloadHandler );
	}

	// Support: IE <10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert( function( el ) {
		documentElement.appendChild( el ).id = jQuery.expando;
		return !document.getElementsByName ||
			!document.getElementsByName( jQuery.expando ).length;
	} );

	// Support: IE 9 only
	// Check to see if it's possible to do matchesSelector
	// on a disconnected node.
	support.disconnectedMatch = assert( function( el ) {
		return matches.call( el, "*" );
	} );

	// Support: IE 9 - 11+, Edge 12 - 18+
	// IE/Edge don't support the :scope pseudo-class.
	support.scope = assert( function() {
		return document.querySelectorAll( ":scope" );
	} );

	// Support: Chrome 105 - 111 only, Safari 15.4 - 16.3 only
	// Make sure the `:has()` argument is parsed unforgivingly.
	// We include `*` in the test to detect buggy implementations that are
	// _selectively_ forgiving (specifically when the list includes at least
	// one valid selector).
	// Note that we treat complete lack of support for `:has()` as if it were
	// spec-compliant support, which is fine because use of `:has()` in such
	// environments will fail in the qSA path and fall back to jQuery traversal
	// anyway.
	support.cssHas = assert( function() {
		try {
			document.querySelector( ":has(*,:jqfake)" );
			return false;
		} catch ( e ) {
			return true;
		}
	} );

	// ID filter and find
	if ( support.getById ) {
		Expr.filter.ID = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute( "id" ) === attrId;
			};
		};
		Expr.find.ID = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		Expr.filter.ID =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode( "id" );
				return node && node.value === attrId;
			};
		};

		// Support: IE 6 - 7 only
		// getElementById is not reliable as a find shortcut
		Expr.find.ID = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					// Verify the id attribute
					node = elem.getAttributeNode( "id" );
					if ( node && node.value === id ) {
						return [ elem ];
					}

					// Fall back on getElementsByName
					elems = context.getElementsByName( id );
					i = 0;
					while ( ( elem = elems[ i++ ] ) ) {
						node = elem.getAttributeNode( "id" );
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// Tag
	Expr.find.TAG = function( tag, context ) {
		if ( typeof context.getElementsByTagName !== "undefined" ) {
			return context.getElementsByTagName( tag );

		// DocumentFragment nodes don't have gEBTN
		} else {
			return context.querySelectorAll( tag );
		}
	};

	// Class
	Expr.find.CLASS = function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	rbuggyQSA = [];

	// Build QSA regex
	// Regex strategy adopted from Diego Perini
	assert( function( el ) {

		var input;

		documentElement.appendChild( el ).innerHTML =
			"<a id='" + expando + "' href='' disabled='disabled'></a>" +
			"<select id='" + expando + "-\r\\' disabled='disabled'>" +
			"<option selected=''></option></select>";

		// Support: iOS <=7 - 8 only
		// Boolean attributes and "value" are not treated correctly in some XML documents
		if ( !el.querySelectorAll( "[selected]" ).length ) {
			rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
		}

		// Support: iOS <=7 - 8 only
		if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
			rbuggyQSA.push( "~=" );
		}

		// Support: iOS 8 only
		// https://bugs.webkit.org/show_bug.cgi?id=136851
		// In-page `selector#id sibling-combinator selector` fails
		if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
			rbuggyQSA.push( ".#.+[+~]" );
		}

		// Support: Chrome <=105+, Firefox <=104+, Safari <=15.4+
		// In some of the document kinds, these selectors wouldn't work natively.
		// This is probably OK but for backwards compatibility we want to maintain
		// handling them through jQuery traversal in jQuery 3.x.
		if ( !el.querySelectorAll( ":checked" ).length ) {
			rbuggyQSA.push( ":checked" );
		}

		// Support: Windows 8 Native Apps
		// The type and name attributes are restricted during .innerHTML assignment
		input = document.createElement( "input" );
		input.setAttribute( "type", "hidden" );
		el.appendChild( input ).setAttribute( "name", "D" );

		// Support: IE 9 - 11+
		// IE's :disabled selector does not pick up the children of disabled fieldsets
		// Support: Chrome <=105+, Firefox <=104+, Safari <=15.4+
		// In some of the document kinds, these selectors wouldn't work natively.
		// This is probably OK but for backwards compatibility we want to maintain
		// handling them through jQuery traversal in jQuery 3.x.
		documentElement.appendChild( el ).disabled = true;
		if ( el.querySelectorAll( ":disabled" ).length !== 2 ) {
			rbuggyQSA.push( ":enabled", ":disabled" );
		}

		// Support: IE 11+, Edge 15 - 18+
		// IE 11/Edge don't find elements on a `[name='']` query in some cases.
		// Adding a temporary attribute to the document before the selection works
		// around the issue.
		// Interestingly, IE 10 & older don't seem to have the issue.
		input = document.createElement( "input" );
		input.setAttribute( "name", "" );
		el.appendChild( input );
		if ( !el.querySelectorAll( "[name='']" ).length ) {
			rbuggyQSA.push( "\\[" + whitespace + "*name" + whitespace + "*=" +
				whitespace + "*(?:''|\"\")" );
		}
	} );

	if ( !support.cssHas ) {

		// Support: Chrome 105 - 110+, Safari 15.4 - 16.3+
		// Our regular `try-catch` mechanism fails to detect natively-unsupported
		// pseudo-classes inside `:has()` (such as `:has(:contains("Foo"))`)
		// in browsers that parse the `:has()` argument as a forgiving selector list.
		// https://drafts.csswg.org/selectors/#relational now requires the argument
		// to be parsed unforgivingly, but browsers have not yet fully adjusted.
		rbuggyQSA.push( ":has" );
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join( "|" ) );

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		// Support: IE 11+, Edge 17 - 18+
		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
		// two documents; shallow comparisons work.
		// eslint-disable-next-line eqeqeq
		compare = ( a.ownerDocument || a ) == ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			( !support.sortDetached && b.compareDocumentPosition( a ) === compare ) ) {

			// Choose the first element that is related to our preferred document
			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			if ( a === document || a.ownerDocument == preferredDoc &&
				find.contains( preferredDoc, a ) ) {
				return -1;
			}

			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			if ( b === document || b.ownerDocument == preferredDoc &&
				find.contains( preferredDoc, b ) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	};

	return document;
}

find.matches = function( expr, elements ) {
	return find( expr, null, null, elements );
};

find.matchesSelector = function( elem, expr ) {
	setDocument( elem );

	if ( documentIsHTML &&
		!nonnativeSelectorCache[ expr + " " ] &&
		( !rbuggyQSA || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||

					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch ( e ) {
			nonnativeSelectorCache( expr, true );
		}
	}

	return find( expr, document, null, [ elem ] ).length > 0;
};

find.contains = function( context, elem ) {

	// Set document vars if needed
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( ( context.ownerDocument || context ) != document ) {
		setDocument( context );
	}
	return jQuery.contains( context, elem );
};


find.attr = function( elem, name ) {

	// Set document vars if needed
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( ( elem.ownerDocument || elem ) != document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],

		// Don't get fooled by Object.prototype properties (see trac-13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	if ( val !== undefined ) {
		return val;
	}

	return elem.getAttribute( name );
};

find.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
jQuery.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	//
	// Support: Android <=4.0+
	// Testing for detecting duplicates is unpredictable so instead assume we can't
	// depend on duplicate detection in all browsers without a stable sort.
	hasDuplicate = !support.sortStable;
	sortInput = !support.sortStable && slice.call( results, 0 );
	sort.call( results, sortOrder );

	if ( hasDuplicate ) {
		while ( ( elem = results[ i++ ] ) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			splice.call( results, duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

jQuery.fn.uniqueSort = function() {
	return this.pushStack( jQuery.uniqueSort( slice.apply( this ) ) );
};

Expr = jQuery.expr = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		ATTR: function( match ) {
			match[ 1 ] = match[ 1 ].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[ 3 ] = ( match[ 3 ] || match[ 4 ] || match[ 5 ] || "" )
				.replace( runescape, funescape );

			if ( match[ 2 ] === "~=" ) {
				match[ 3 ] = " " + match[ 3 ] + " ";
			}

			return match.slice( 0, 4 );
		},

		CHILD: function( match ) {

			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[ 1 ] = match[ 1 ].toLowerCase();

			if ( match[ 1 ].slice( 0, 3 ) === "nth" ) {

				// nth-* requires argument
				if ( !match[ 3 ] ) {
					find.error( match[ 0 ] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[ 4 ] = +( match[ 4 ] ?
					match[ 5 ] + ( match[ 6 ] || 1 ) :
					2 * ( match[ 3 ] === "even" || match[ 3 ] === "odd" )
				);
				match[ 5 ] = +( ( match[ 7 ] + match[ 8 ] ) || match[ 3 ] === "odd" );

			// other types prohibit arguments
			} else if ( match[ 3 ] ) {
				find.error( match[ 0 ] );
			}

			return match;
		},

		PSEUDO: function( match ) {
			var excess,
				unquoted = !match[ 6 ] && match[ 2 ];

			if ( matchExpr.CHILD.test( match[ 0 ] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[ 3 ] ) {
				match[ 2 ] = match[ 4 ] || match[ 5 ] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&

				// Get excess from tokenize (recursively)
				( excess = tokenize( unquoted, true ) ) &&

				// advance to the next closing parenthesis
				( excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length ) ) {

				// excess is a negative index
				match[ 0 ] = match[ 0 ].slice( 0, excess );
				match[ 2 ] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		TAG: function( nodeNameSelector ) {
			var expectedNodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() {
					return true;
				} :
				function( elem ) {
					return nodeName( elem, expectedNodeName );
				};
		},

		CLASS: function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				( pattern = new RegExp( "(^|" + whitespace + ")" + className +
					"(" + whitespace + "|$)" ) ) &&
				classCache( className, function( elem ) {
					return pattern.test(
						typeof elem.className === "string" && elem.className ||
							typeof elem.getAttribute !== "undefined" &&
								elem.getAttribute( "class" ) ||
							""
					);
				} );
		},

		ATTR: function( name, operator, check ) {
			return function( elem ) {
				var result = find.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				if ( operator === "=" ) {
					return result === check;
				}
				if ( operator === "!=" ) {
					return result !== check;
				}
				if ( operator === "^=" ) {
					return check && result.indexOf( check ) === 0;
				}
				if ( operator === "*=" ) {
					return check && result.indexOf( check ) > -1;
				}
				if ( operator === "$=" ) {
					return check && result.slice( -check.length ) === check;
				}
				if ( operator === "~=" ) {
					return ( " " + result.replace( rwhitespace, " " ) + " " )
						.indexOf( check ) > -1;
				}
				if ( operator === "|=" ) {
					return result === check || result.slice( 0, check.length + 1 ) === check + "-";
				}

				return false;
			};
		},

		CHILD: function( type, what, _argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, _context, xml ) {
					var cache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( ( node = node[ dir ] ) ) {
									if ( ofType ?
										nodeName( node, name ) :
										node.nodeType === 1 ) {

										return false;
									}
								}

								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || ( parent[ expando ] = {} );
							cache = outerCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( ( node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								( diff = nodeIndex = 0 ) || start.pop() ) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {

							// Use previously-cached element index if available
							if ( useCache ) {
								outerCache = elem[ expando ] || ( elem[ expando ] = {} );
								cache = outerCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {

								// Use the same loop as above to seek `elem` from the start
								while ( ( node = ++nodeIndex && node && node[ dir ] ||
									( diff = nodeIndex = 0 ) || start.pop() ) ) {

									if ( ( ofType ?
										nodeName( node, name ) :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] ||
												( node[ expando ] = {} );
											outerCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		PSEUDO: function( pseudo, argument ) {

			// pseudo-class names are case-insensitive
			// https://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					find.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as jQuery does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction( function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[ i ] );
							seed[ idx ] = !( matches[ idx ] = matched[ i ] );
						}
					} ) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {

		// Potentially complex pseudos
		not: markFunction( function( selector ) {

			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrimCSS, "$1" ) );

			return matcher[ expando ] ?
				markFunction( function( seed, matches, _context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( ( elem = unmatched[ i ] ) ) {
							seed[ i ] = !( matches[ i ] = elem );
						}
					}
				} ) :
				function( elem, _context, xml ) {
					input[ 0 ] = elem;
					matcher( input, null, xml, results );

					// Don't keep the element
					// (see https://github.com/jquery/sizzle/issues/299)
					input[ 0 ] = null;
					return !results.pop();
				};
		} ),

		has: markFunction( function( selector ) {
			return function( elem ) {
				return find( selector, elem ).length > 0;
			};
		} ),

		contains: markFunction( function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || jQuery.text( elem ) ).indexOf( text ) > -1;
			};
		} ),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// https://www.w3.org/TR/selectors/#lang-pseudo
		lang: markFunction( function( lang ) {

			// lang value must be a valid identifier
			if ( !ridentifier.test( lang || "" ) ) {
				find.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( ( elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute( "xml:lang" ) || elem.getAttribute( "lang" ) ) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( ( elem = elem.parentNode ) && elem.nodeType === 1 );
				return false;
			};
		} ),

		// Miscellaneous
		target: function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		root: function( elem ) {
			return elem === documentElement;
		},

		focus: function( elem ) {
			return elem === safeActiveElement() &&
				document.hasFocus() &&
				!!( elem.type || elem.href || ~elem.tabIndex );
		},

		// Boolean properties
		enabled: createDisabledPseudo( false ),
		disabled: createDisabledPseudo( true ),

		checked: function( elem ) {

			// In CSS3, :checked should return both checked and selected elements
			// https://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			return ( nodeName( elem, "input" ) && !!elem.checked ) ||
				( nodeName( elem, "option" ) && !!elem.selected );
		},

		selected: function( elem ) {

			// Support: IE <=11+
			// Accessing the selectedIndex property
			// forces the browser to treat the default option as
			// selected when in an optgroup.
			if ( elem.parentNode ) {
				// eslint-disable-next-line no-unused-expressions
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		empty: function( elem ) {

			// https://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		parent: function( elem ) {
			return !Expr.pseudos.empty( elem );
		},

		// Element/input types
		header: function( elem ) {
			return rheader.test( elem.nodeName );
		},

		input: function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		button: function( elem ) {
			return nodeName( elem, "input" ) && elem.type === "button" ||
				nodeName( elem, "button" );
		},

		text: function( elem ) {
			var attr;
			return nodeName( elem, "input" ) && elem.type === "text" &&

				// Support: IE <10 only
				// New HTML5 attribute values (e.g., "search") appear
				// with elem.type === "text"
				( ( attr = elem.getAttribute( "type" ) ) == null ||
					attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		first: createPositionalPseudo( function() {
			return [ 0 ];
		} ),

		last: createPositionalPseudo( function( _matchIndexes, length ) {
			return [ length - 1 ];
		} ),

		eq: createPositionalPseudo( function( _matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		} ),

		even: createPositionalPseudo( function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		odd: createPositionalPseudo( function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		lt: createPositionalPseudo( function( matchIndexes, length, argument ) {
			var i;

			if ( argument < 0 ) {
				i = argument + length;
			} else if ( argument > length ) {
				i = length;
			} else {
				i = argument;
			}

			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		gt: createPositionalPseudo( function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} )
	}
};

Expr.pseudos.nth = Expr.pseudos.eq;

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || ( match = rcomma.exec( soFar ) ) ) {
			if ( match ) {

				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[ 0 ].length ) || soFar;
			}
			groups.push( ( tokens = [] ) );
		}

		matched = false;

		// Combinators
		if ( ( match = rleadingCombinator.exec( soFar ) ) ) {
			matched = match.shift();
			tokens.push( {
				value: matched,

				// Cast descendant combinators to space
				type: match[ 0 ].replace( rtrimCSS, " " )
			} );
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( ( match = matchExpr[ type ].exec( soFar ) ) && ( !preFilters[ type ] ||
				( match = preFilters[ type ]( match ) ) ) ) {
				matched = match.shift();
				tokens.push( {
					value: matched,
					type: type,
					matches: match
				} );
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	if ( parseOnly ) {
		return soFar.length;
	}

	return soFar ?
		find.error( selector ) :

		// Cache the tokens
		tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[ i ].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ?

		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( ( elem = elem[ dir ] ) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( ( elem = elem[ dir ] ) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( ( elem = elem[ dir ] ) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || ( elem[ expando ] = {} );

						if ( skip && nodeName( elem, skip ) ) {
							elem = elem[ dir ] || elem;
						} else if ( ( oldCache = outerCache[ key ] ) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return ( newCache[ 2 ] = oldCache[ 2 ] );
						} else {

							// Reuse newcache so results back-propagate to previous elements
							outerCache[ key ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( ( newCache[ 2 ] = matcher( elem, context, xml ) ) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[ i ]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[ 0 ];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		find( selector, contexts[ i ], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( ( elem = unmatched[ i ] ) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction( function( seed, results, context, xml ) {
		var temp, i, elem, matcherOut,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed ||
				multipleContexts( selector || "*",
					context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems;

		if ( matcher ) {

			// If we have a postFinder, or filtered seed, or non-seed postFilter
			// or preexisting results,
			matcherOut = postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

				// ...intermediate processing is necessary
				[] :

				// ...otherwise use results directly
				results;

			// Find primary matches
			matcher( matcherIn, matcherOut, context, xml );
		} else {
			matcherOut = matcherIn;
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( ( elem = temp[ i ] ) ) {
					matcherOut[ postMap[ i ] ] = !( matcherIn[ postMap[ i ] ] = elem );
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {

					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( ( elem = matcherOut[ i ] ) ) {

							// Restore matcherIn since elem is not yet a final match
							temp.push( ( matcherIn[ i ] = elem ) );
						}
					}
					postFinder( null, ( matcherOut = [] ), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( ( elem = matcherOut[ i ] ) &&
						( temp = postFinder ? indexOf.call( seed, elem ) : preMap[ i ] ) > -1 ) {

						seed[ temp ] = !( results[ temp ] = elem );
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	} );
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[ 0 ].type ],
		implicitRelative = leadingRelative || Expr.relative[ " " ],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {

			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			var ret = ( !leadingRelative && ( xml || context != outermostContext ) ) || (
				( checkContext = context ).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );

			// Avoid hanging onto element
			// (see https://github.com/jquery/sizzle/issues/299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( ( matcher = Expr.relative[ tokens[ i ].type ] ) ) {
			matchers = [ addCombinator( elementMatcher( matchers ), matcher ) ];
		} else {
			matcher = Expr.filter[ tokens[ i ].type ].apply( null, tokens[ i ].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {

				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[ j ].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(

						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 )
							.concat( { value: tokens[ i - 2 ].type === " " ? "*" : "" } )
					).replace( rtrimCSS, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( ( tokens = tokens.slice( j ) ) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,

				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find.TAG( "*", outermost ),

				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = ( dirruns += contextBackup == null ? 1 : Math.random() || 0.1 ),
				len = elems.length;

			if ( outermost ) {

				// Support: IE 11+, Edge 17 - 18+
				// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
				// two documents; shallow comparisons work.
				// eslint-disable-next-line eqeqeq
				outermostContext = context == document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: iOS <=7 - 9 only
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching
			// elements by id. (see trac-14142)
			for ( ; i !== len && ( elem = elems[ i ] ) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;

					// Support: IE 11+, Edge 17 - 18+
					// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
					// two documents; shallow comparisons work.
					// eslint-disable-next-line eqeqeq
					if ( !context && elem.ownerDocument != document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( ( matcher = elementMatchers[ j++ ] ) ) {
						if ( matcher( elem, context || document, xml ) ) {
							push.call( results, elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {

					// They will have gone through all possible matchers
					if ( ( elem = !matcher && elem ) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( ( matcher = setMatchers[ j++ ] ) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {

					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !( unmatched[ i ] || setMatched[ i ] ) ) {
								setMatched[ i ] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					jQuery.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

function compile( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {

		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[ i ] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector,
			matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
}

/**
 * A low-level selection function that works with jQuery's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with jQuery selector compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( ( selector = compiled.selector || selector ) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[ 0 ] = match[ 0 ].slice( 0 );
		if ( tokens.length > 2 && ( token = tokens[ 0 ] ).type === "ID" &&
				context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[ 1 ].type ] ) {

			context = ( Expr.find.ID(
				token.matches[ 0 ].replace( runescape, funescape ),
				context
			) || [] )[ 0 ];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr.needsContext.test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[ i ];

			// Abort if we hit a combinator
			if ( Expr.relative[ ( type = token.type ) ] ) {
				break;
			}
			if ( ( find = Expr.find[ type ] ) ) {

				// Search, expanding context for leading sibling combinators
				if ( ( seed = find(
					token.matches[ 0 ].replace( runescape, funescape ),
					rsibling.test( tokens[ 0 ].type ) &&
						testContext( context.parentNode ) || context
				) ) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
}

// One-time assignments

// Support: Android <=4.0 - 4.1+
// Sort stability
support.sortStable = expando.split( "" ).sort( sortOrder ).join( "" ) === expando;

// Initialize against the default document
setDocument();

// Support: Android <=4.0 - 4.1+
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert( function( el ) {

	// Should return 1, but returns 4 (following)
	return el.compareDocumentPosition( document.createElement( "fieldset" ) ) & 1;
} );

jQuery.find = find;

// Deprecated
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.unique = jQuery.uniqueSort;

// These have always been private, but they used to be documented as part of
// Sizzle so let's maintain them for now for backwards compatibility purposes.
find.compile = compile;
find.select = select;
find.setDocument = setDocument;
find.tokenize = tokenize;

find.escape = jQuery.escapeSelector;
find.getText = jQuery.text;
find.isXML = jQuery.isXMLDoc;
find.selectors = jQuery.expr;
find.support = jQuery.support;
find.uniqueSort = jQuery.uniqueSort;

	/* eslint-enable */

} )();


var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;

var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}

	// Single element
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );
	}

	// Arraylike of elements (jQuery, arguments, Array)
	if ( typeof qualifier !== "string" ) {
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	// Filtered directly for both simple and complex selectors
	return jQuery.filter( qualifier, elements, not );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	if ( elems.length === 1 && elem.nodeType === 1 ) {
		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
	}

	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
		return elem.nodeType === 1;
	} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i, ret,
			len = this.length,
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		ret = this.pushStack( [] );

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (trac-9521)
	// Strict HTML recognition (trac-11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jQuery( selectors );

		// Positional selectors never match, since there's no _selection_ context
		if ( !rneedsContext.test( selectors ) ) {
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					if ( cur.nodeType < 11 && ( targets ?
						targets.index( cur ) > -1 :

						// Don't pass non-elements to jQuery#find
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, _i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, _i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, _i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
		if ( elem.contentDocument != null &&

			// Support: IE 11+
			// <object> elements with no `data` attribute has an object
			// `contentDocument` with a `null` prototype.
			getProto( elem.contentDocument ) ) {

			return elem.contentDocument;
		}

		// Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
		// Treat the template element as a regular one in browsers that
		// don't support it.
		if ( nodeName( elem, "template" ) ) {
			elem = elem.content || elem;
		}

		return jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = locked || options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && toType( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}

function adoptValue( value, resolve, reject, noValue ) {
	var method;

	try {

		// Check for promise aspect first to privilege synchronous behavior
		if ( value && isFunction( ( method = value.promise ) ) ) {
			method.call( value ).done( resolve ).fail( reject );

		// Other thenables
		} else if ( value && isFunction( ( method = value.then ) ) ) {
			method.call( value, resolve, reject );

		// Other non-thenables
		} else {

			// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
			// * false: [ value ].slice( 0 ) => resolve( value )
			// * true: [ value ].slice( 1 ) => resolve()
			resolve.apply( undefined, [ value ].slice( noValue ) );
		}

	// For Promises/A+, convert exceptions into rejections
	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
	// Deferred#then to conditionally suppress rejection.
	} catch ( value ) {

		// Support: Android 4.0 only
		// Strict mode functions invoked without .call/.apply get global-object context
		reject.apply( undefined, [ value ] );
	}
}

jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				[ "notify", "progress", jQuery.Callbacks( "memory" ),
					jQuery.Callbacks( "memory" ), 2 ],
				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				"catch": function( fn ) {
					return promise.then( null, fn );
				},

				// Keep pipe for back-compat
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;

					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( _i, tuple ) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this,
								args = arguments,
								mightThrow = function() {
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									if ( depth < maxDepth ) {
										return;
									}

									returned = handler.apply( that, args );

									// Support: Promises/A+ section 2.3.1
									// https://promisesaplus.com/#point-48
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}

									// Support: Promises/A+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// Retrieve `then` only once
									then = returned &&

										// Support: Promises/A+ section 2.3.4
										// https://promisesaplus.com/#point-64
										// Only check objects and functions for thenability
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// Handle a returned thenable
									if ( isFunction( then ) ) {

										// Special processors (notify) just wait for resolution
										if ( special ) {
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);

										// Normal processors (resolve) also hook into progress
										} else {

											// ...and disregard older resolution values
											maxDepth++;

											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notifyWith )
											);
										}

									// Handle all other returned values
									} else {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if ( handler !== Identity ) {
											that = undefined;
											args = [ returned ];
										}

										// Process the value(s)
										// Default process is resolve
										( special || deferred.resolveWith )( that, args );
									}
								},

								// Only normal processors (resolve) catch and reject exceptions
								process = special ?
									mightThrow :
									function() {
										try {
											mightThrow();
										} catch ( e ) {

											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.error );
											}

											// Support: Promises/A+ section 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// Ignore post-resolution exceptions
											if ( depth + 1 >= maxDepth ) {

												// Only substitute handlers pass on context
												// and multiple values (non-spec behavior)
												if ( handler !== Thrower ) {
													that = undefined;
													args = [ e ];
												}

												deferred.rejectWith( that, args );
											}
										}
									};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if ( depth ) {
								process();
							} else {

								// Call an optional hook to record the error, in case of exception
								// since it's otherwise lost when execution goes async
								if ( jQuery.Deferred.getErrorHook ) {
									process.error = jQuery.Deferred.getErrorHook();

								// The deprecated alias of the above. While the name suggests
								// returning the stack, not an error instance, jQuery just passes
								// it directly to `console.warn` so both will work; an instance
								// just better cooperates with source maps.
								} else if ( jQuery.Deferred.getStackHook ) {
									process.error = jQuery.Deferred.getStackHook();
								}
								window.setTimeout( process );
							}
						};
					}

					return jQuery.Deferred( function( newDefer ) {

						// progress_handlers.add( ... )
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onProgress ) ?
									onProgress :
									Identity,
								newDefer.notifyWith
							)
						);

						// fulfilled_handlers.add( ... )
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onFulfilled ) ?
									onFulfilled :
									Identity
							)
						);

						// rejected_handlers.add( ... )
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onRejected ) ?
									onRejected :
									Thrower
							)
						);
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(
					function() {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ 3 - i ][ 2 ].disable,

					// rejected_handlers.disable
					// fulfilled_handlers.disable
					tuples[ 3 - i ][ 3 ].disable,

					// progress_callbacks.lock
					tuples[ 0 ][ 2 ].lock,

					// progress_handlers.lock
					tuples[ 0 ][ 3 ].lock
				);
			}

			// progress_handlers.fire
			// fulfilled_handlers.fire
			// rejected_handlers.fire
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifyWith(...) }
			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
				return this;
			};

			// deferred.notifyWith = list.fireWith
			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( singleValue ) {
		var

			// count of uncompleted subordinates
			remaining = arguments.length,

			// count of unprocessed arguments
			i = remaining,

			// subordinate fulfillment data
			resolveContexts = Array( i ),
			resolveValues = slice.call( arguments ),

			// the primary Deferred
			primary = jQuery.Deferred(),

			// subordinate callback factory
			updateFunc = function( i ) {
				return function( value ) {
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						primary.resolveWith( resolveContexts, resolveValues );
					}
				};
			};

		// Single- and empty arguments are adopted like Promise.resolve
		if ( remaining <= 1 ) {
			adoptValue( singleValue, primary.done( updateFunc( i ) ).resolve, primary.reject,
				!remaining );

			// Use .then() to unwrap secondary thenables (cf. gh-3000)
			if ( primary.state() === "pending" ||
				isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

				return primary.then();
			}
		}

		// Multiple arguments are aggregated like Promise.all array elements
		while ( i-- ) {
			adoptValue( resolveValues[ i ], updateFunc( i ), primary.reject );
		}

		return primary.promise();
	}
} );


// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

// If `jQuery.Deferred.getErrorHook` is defined, `asyncError` is an error
// captured before the async barrier to get the original error cause
// which may otherwise be hidden.
jQuery.Deferred.exceptionHook = function( error, asyncError ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message,
			error.stack, asyncError );
	}
};




jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};




// The deferred used on DOM ready
var readyList = jQuery.Deferred();

jQuery.fn.ready = function( fn ) {

	readyList
		.then( fn )

		// Wrap jQuery.readyException in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		.catch( function( error ) {
			jQuery.readyException( error );
		} );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See trac-6781
	readyWait: 1,

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );
	}
} );

jQuery.ready.then = readyList.then;

// The ready event handler and self cleanup method
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
if ( document.readyState === "complete" ||
	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

	// Handle it asynchronously to allow scripts the opportunity to delay ready
	window.setTimeout( jQuery.ready );

} else {

	// Use the handy event callback
	document.addEventListener( "DOMContentLoaded", completed );

	// A fallback to window.onload, that will always work
	window.addEventListener( "load", completed );
}




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( toType( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, _key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
						value :
						value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	if ( chainable ) {
		return elems;
	}

	// Gets
	if ( bulk ) {
		return fn.call( elems );
	}

	return len ? fn( elems[ 0 ], key ) : emptyGet;
};


// Matches dashed string for camelizing
var rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g;

// Used by camelCase as callback to replace()
function fcamelCase( _all, letter ) {
	return letter.toUpperCase();
}

// Convert dashed to camelCase; used by the css and data modules
// Support: IE <=9 - 11, Edge 12 - 15
// Microsoft forgot to hump their vendor prefix (trac-9572)
function camelCase( string ) {
	return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
}
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	cache: function( owner ) {

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see trac-8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		// Always use camelCase key (gh-2257)
		if ( typeof data === "string" ) {
			cache[ camelCase( data ) ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ camelCase( prop ) ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :

			// Always use camelCase key (gh-2257)
			owner[ this.expando ] && owner[ this.expando ][ camelCase( key ) ];
	},
	access: function( owner, key, value ) {

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			return this.get( owner, key );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key !== undefined ) {

			// Support array or space separated string of keys
			if ( Array.isArray( key ) ) {

				// If key is an array of keys...
				// We always set camelCase keys, so remove that.
				key = key.map( camelCase );
			} else {
				key = camelCase( key );

				// If a key with the spaces exists, use it.
				// Otherwise, create an array by matching non-whitespace
				key = key in cache ?
					[ key ] :
					( key.match( rnothtmlwhite ) || [] );
			}

			i = key.length;

			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <=35 - 45
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function getData( data ) {
	if ( data === "true" ) {
		return true;
	}

	if ( data === "false" ) {
		return false;
	}

	if ( data === "null" ) {
		return null;
	}

	// Only convert to a number if it doesn't change the string
	if ( data === +data + "" ) {
		return +data;
	}

	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}

	return data;
}

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = getData( data );
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE 11 only
						// The attrs elements can be null (trac-14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// The key will always be camelCased in Data
				data = dataUser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each( function() {

				// We always store the camelCased key
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || Array.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var documentElement = document.documentElement;



	var isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem );
		},
		composed = { composed: true };

	// Support: IE 9 - 11+, Edge 12 - 18+, iOS 10.0 - 10.2 only
	// Check attachment across shadow DOM boundaries when possible (gh-3504)
	// Support: iOS 10.0-10.2 only
	// Early iOS 10 versions support `attachShadow` but not `getRootNode`,
	// leading to errors. We need to check for `getRootNode`.
	if ( documentElement.getRootNode ) {
		isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem ) ||
				elem.getRootNode( composed ) === elem.ownerDocument;
		};
	}
var isHiddenWithinTree = function( elem, el ) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// Inline style trumps all
		return elem.style.display === "none" ||
			elem.style.display === "" &&

			// Otherwise, check computed style
			// Support: Firefox <=43 - 45
			// Disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			isAttached( elem ) &&

			jQuery.css( elem, "display" ) === "none";
	};



function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted, scale,
		maxIterations = 20,
		currentValue = tween ?
			function() {
				return tween.cur();
			} :
			function() {
				return jQuery.css( elem, prop, "" );
			},
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = elem.nodeType &&
			( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Support: Firefox <=54
		// Halve the iteration target value to prevent interference from CSS upper bounds (gh-2144)
		initial = initial / 2;

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		while ( maxIterations-- ) {

			// Evaluate and update our best guess (doubling guesses that zero out).
			// Finish if the scale equals or crosses 1 (making the old*new product non-positive).
			jQuery.style( elem, prop, initialInUnit + unit );
			if ( ( 1 - scale ) * ( 1 - ( scale = currentValue() / initial || 0.5 ) ) <= 0 ) {
				maxIterations = 0;
			}
			initialInUnit = initialInUnit / scale;

		}

		initialInUnit = initialInUnit * 2;
		jQuery.style( elem, prop, initialInUnit + unit );

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


var defaultDisplayMap = {};

function getDefaultDisplay( elem ) {
	var temp,
		doc = elem.ownerDocument,
		nodeName = elem.nodeName,
		display = defaultDisplayMap[ nodeName ];

	if ( display ) {
		return display;
	}

	temp = doc.body.appendChild( doc.createElement( nodeName ) );
	display = jQuery.css( temp, "display" );

	temp.parentNode.removeChild( temp );

	if ( display === "none" ) {
		display = "block";
	}
	defaultDisplayMap[ nodeName ] = display;

	return display;
}

function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// Determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		display = elem.style.display;
		if ( show ) {

			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
			// check is required in this first loop unless we have a nonempty display value (either
			// inline or about-to-be-restored)
			if ( display === "none" ) {
				values[ index ] = dataPriv.get( elem, "display" ) || null;
				if ( !values[ index ] ) {
					elem.style.display = "";
				}
			}
			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
				values[ index ] = getDefaultDisplay( elem );
			}
		} else {
			if ( display !== "none" ) {
				values[ index ] = "none";

				// Remember what we're overwriting
				dataPriv.set( elem, "display", display );
			}
		}
	}

	// Set the display of the elements in a second loop to avoid constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		}
	}

	return elements;
}

jQuery.fn.extend( {
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHiddenWithinTree( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]*)/i );

var rscriptType = ( /^$|^module$|\/(?:java|ecma)script/i );



( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0 - 4.3 only
	// Check state lost if the name is set (trac-11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (trac-14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Android <=4.1 only
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE <=11 only
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;

	// Support: IE <=9 only
	// IE <=9 replaces <option> tags with their contents when inserted outside of
	// the select element.
	div.innerHTML = "<option></option>";
	support.option = !!div.lastChild;
} )();


// We have to close these tags to support XHTML (trac-13200)
var wrapMap = {

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// Support: IE <=9 only
if ( !support.option ) {
	wrapMap.optgroup = wrapMap.option = [ 1, "<select multiple='multiple'>", "</select>" ];
}


function getAll( context, tag ) {

	// Support: IE <=9 - 11 only
	// Use typeof to avoid zero-argument method invocation on host objects (trac-15151)
	var ret;

	if ( typeof context.getElementsByTagName !== "undefined" ) {
		ret = context.getElementsByTagName( tag || "*" );

	} else if ( typeof context.querySelectorAll !== "undefined" ) {
		ret = context.querySelectorAll( tag || "*" );

	} else {
		ret = [];
	}

	if ( tag === undefined || tag && nodeName( context, tag ) ) {
		return jQuery.merge( [ context ], ret );
	}

	return ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, attached, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( toType( elem ) === "object" ) {

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (trac-12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		attached = isAttached( elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( attached ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


var rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Only attach events to objects that accept data
		if ( !acceptData( elem ) ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Ensure that invalid selectors throw exceptions at attach time
		// Evaluate against documentElement in case elem is a non-element node (e.g., document)
		if ( selector ) {
			jQuery.find.matchesSelector( documentElement, selector );
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = Object.create( null );
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( nativeEvent ) {

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),

			// Make a writable jQuery.Event from the native event object
			event = jQuery.event.fix( nativeEvent ),

			handlers = (
				dataPriv.get( this, "events" ) || Object.create( null )
			)[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;

		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}

		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// If the event is namespaced, then each handler is only invoked if it is
				// specially universal or its namespaces are a superset of the event's.
				if ( !event.rnamespace || handleObj.namespace === false ||
					event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		if ( delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			!( event.type === "click" && event.button >= 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (trac-13208)
				// Don't process clicks on disabled elements (trac-6911, trac-8165, trac-11382, trac-11764)
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedHandlers = [];
					matchedSelectors = {};
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (trac-13203)
						sel = handleObj.selector + " ";

						if ( matchedSelectors[ sel ] === undefined ) {
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matchedSelectors[ sel ] ) {
							matchedHandlers.push( handleObj );
						}
					}
					if ( matchedHandlers.length ) {
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		cur = this;
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	addProp: function( name, hook ) {
		Object.defineProperty( jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: isFunction( hook ) ?
				function() {
					if ( this.originalEvent ) {
						return hook( this.originalEvent );
					}
				} :
				function() {
					if ( this.originalEvent ) {
						return this.originalEvent[ name ];
					}
				},

			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},

	fix: function( originalEvent ) {
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		click: {

			// Utilize native event to ensure correct state for checkable inputs
			setup: function( data ) {

				// For mutual compressibility with _default, replace `this` access with a local var.
				// `|| data` is dead code meant only to preserve the variable through minification.
				var el = this || data;

				// Claim the first handler
				if ( rcheckableType.test( el.type ) &&
					el.click && nodeName( el, "input" ) ) {

					// dataPriv.set( el, "click", ... )
					leverageNative( el, "click", true );
				}

				// Return false to allow normal processing in the caller
				return false;
			},
			trigger: function( data ) {

				// For mutual compressibility with _default, replace `this` access with a local var.
				// `|| data` is dead code meant only to preserve the variable through minification.
				var el = this || data;

				// Force setup before triggering a click
				if ( rcheckableType.test( el.type ) &&
					el.click && nodeName( el, "input" ) ) {

					leverageNative( el, "click" );
				}

				// Return non-false to allow normal event-path propagation
				return true;
			},

			// For cross-browser consistency, suppress native .click() on links
			// Also prevent it if we're currently inside a leveraged native-event stack
			_default: function( event ) {
				var target = event.target;
				return rcheckableType.test( target.type ) &&
					target.click && nodeName( target, "input" ) &&
					dataPriv.get( target, "click" ) ||
					nodeName( target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

// Ensure the presence of an event listener that handles manually-triggered
// synthetic events by interrupting progress until reinvoked in response to
// *native* events that it fires directly, ensuring that state changes have
// already occurred before other listeners are invoked.
function leverageNative( el, type, isSetup ) {

	// Missing `isSetup` indicates a trigger call, which must force setup through jQuery.event.add
	if ( !isSetup ) {
		if ( dataPriv.get( el, type ) === undefined ) {
			jQuery.event.add( el, type, returnTrue );
		}
		return;
	}

	// Register the controller as a special universal handler for all event namespaces
	dataPriv.set( el, type, false );
	jQuery.event.add( el, type, {
		namespace: false,
		handler: function( event ) {
			var result,
				saved = dataPriv.get( this, type );

			if ( ( event.isTrigger & 1 ) && this[ type ] ) {

				// Interrupt processing of the outer synthetic .trigger()ed event
				if ( !saved ) {

					// Store arguments for use when handling the inner native event
					// There will always be at least one argument (an event object), so this array
					// will not be confused with a leftover capture object.
					saved = slice.call( arguments );
					dataPriv.set( this, type, saved );

					// Trigger the native event and capture its result
					this[ type ]();
					result = dataPriv.get( this, type );
					dataPriv.set( this, type, false );

					if ( saved !== result ) {

						// Cancel the outer synthetic event
						event.stopImmediatePropagation();
						event.preventDefault();

						return result;
					}

				// If this is an inner synthetic event for an event with a bubbling surrogate
				// (focus or blur), assume that the surrogate already propagated from triggering
				// the native event and prevent that from happening again here.
				// This technically gets the ordering wrong w.r.t. to `.trigger()` (in which the
				// bubbling surrogate propagates *after* the non-bubbling base), but that seems
				// less bad than duplication.
				} else if ( ( jQuery.event.special[ type ] || {} ).delegateType ) {
					event.stopPropagation();
				}

			// If this is a native event triggered above, everything is now in order
			// Fire an inner synthetic event with the original arguments
			} else if ( saved ) {

				// ...and capture the result
				dataPriv.set( this, type, jQuery.event.trigger(
					saved[ 0 ],
					saved.slice( 1 ),
					this
				) );

				// Abort handling of the native event by all jQuery handlers while allowing
				// native handlers on the same element to run. On target, this is achieved
				// by stopping immediate propagation just on the jQuery event. However,
				// the native event is re-wrapped by a jQuery one on each level of the
				// propagation so the only way to stop it for jQuery is to stop it for
				// everyone via native `stopPropagation()`. This is not a problem for
				// focus/blur which don't bubble, but it does also stop click on checkboxes
				// and radios. We accept this limitation.
				event.stopPropagation();
				event.isImmediatePropagationStopped = returnTrue;
			}
		}
	} );
}

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ?
			returnTrue :
			returnFalse;

		// Create target properties
		// Support: Safari <=6 - 7 only
		// Target should not be a text node (trac-504, trac-13143)
		this.target = ( src.target && src.target.nodeType === 3 ) ?
			src.target.parentNode :
			src.target;

		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || Date.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Includes all common event props including KeyEvent and MouseEvent specific props
jQuery.each( {
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,
	"char": true,
	code: true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,
	which: true
}, jQuery.event.addProp );

jQuery.each( { focus: "focusin", blur: "focusout" }, function( type, delegateType ) {

	function focusMappedHandler( nativeEvent ) {
		if ( document.documentMode ) {

			// Support: IE 11+
			// Attach a single focusin/focusout handler on the document while someone wants
			// focus/blur. This is because the former are synchronous in IE while the latter
			// are async. In other browsers, all those handlers are invoked synchronously.

			// `handle` from private data would already wrap the event, but we need
			// to change the `type` here.
			var handle = dataPriv.get( this, "handle" ),
				event = jQuery.event.fix( nativeEvent );
			event.type = nativeEvent.type === "focusin" ? "focus" : "blur";
			event.isSimulated = true;

			// First, handle focusin/focusout
			handle( nativeEvent );

			// ...then, handle focus/blur
			//
			// focus/blur don't bubble while focusin/focusout do; simulate the former by only
			// invoking the handler at the lower level.
			if ( event.target === event.currentTarget ) {

				// The setup part calls `leverageNative`, which, in turn, calls
				// `jQuery.event.add`, so event handle will already have been set
				// by this point.
				handle( event );
			}
		} else {

			// For non-IE browsers, attach a single capturing handler on the document
			// while someone wants focusin/focusout.
			jQuery.event.simulate( delegateType, nativeEvent.target,
				jQuery.event.fix( nativeEvent ) );
		}
	}

	jQuery.event.special[ type ] = {

		// Utilize native event if possible so blur/focus sequence is correct
		setup: function() {

			var attaches;

			// Claim the first handler
			// dataPriv.set( this, "focus", ... )
			// dataPriv.set( this, "blur", ... )
			leverageNative( this, type, true );

			if ( document.documentMode ) {

				// Support: IE 9 - 11+
				// We use the same native handler for focusin & focus (and focusout & blur)
				// so we need to coordinate setup & teardown parts between those events.
				// Use `delegateType` as the key as `type` is already used by `leverageNative`.
				attaches = dataPriv.get( this, delegateType );
				if ( !attaches ) {
					this.addEventListener( delegateType, focusMappedHandler );
				}
				dataPriv.set( this, delegateType, ( attaches || 0 ) + 1 );
			} else {

				// Return false to allow normal processing in the caller
				return false;
			}
		},
		trigger: function() {

			// Force setup before trigger
			leverageNative( this, type );

			// Return non-false to allow normal event-path propagation
			return true;
		},

		teardown: function() {
			var attaches;

			if ( document.documentMode ) {
				attaches = dataPriv.get( this, delegateType ) - 1;
				if ( !attaches ) {
					this.removeEventListener( delegateType, focusMappedHandler );
					dataPriv.remove( this, delegateType );
				} else {
					dataPriv.set( this, delegateType, attaches );
				}
			} else {

				// Return false to indicate standard teardown should be applied
				return false;
			}
		},

		// Suppress native focus or blur if we're currently inside
		// a leveraged native-event stack
		_default: function( event ) {
			return dataPriv.get( event.target, type );
		},

		delegateType: delegateType
	};

	// Support: Firefox <=44
	// Firefox doesn't have focus(in | out) events
	// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
	//
	// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
	// focus(in | out) events fire after focus & blur events,
	// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
	// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
	//
	// Support: IE 9 - 11+
	// To preserve relative focusin/focus & focusout/blur event order guaranteed on the 3.x branch,
	// attach a single handler for both events in IE.
	jQuery.event.special[ delegateType ] = {
		setup: function() {

			// Handle: regular nodes (via `this.ownerDocument`), window
			// (via `this.document`) & document (via `this`).
			var doc = this.ownerDocument || this.document || this,
				dataHolder = document.documentMode ? this : doc,
				attaches = dataPriv.get( dataHolder, delegateType );

			// Support: IE 9 - 11+
			// We use the same native handler for focusin & focus (and focusout & blur)
			// so we need to coordinate setup & teardown parts between those events.
			// Use `delegateType` as the key as `type` is already used by `leverageNative`.
			if ( !attaches ) {
				if ( document.documentMode ) {
					this.addEventListener( delegateType, focusMappedHandler );
				} else {
					doc.addEventListener( type, focusMappedHandler, true );
				}
			}
			dataPriv.set( dataHolder, delegateType, ( attaches || 0 ) + 1 );
		},
		teardown: function() {
			var doc = this.ownerDocument || this.document || this,
				dataHolder = document.documentMode ? this : doc,
				attaches = dataPriv.get( dataHolder, delegateType ) - 1;

			if ( !attaches ) {
				if ( document.documentMode ) {
					this.removeEventListener( delegateType, focusMappedHandler );
				} else {
					doc.removeEventListener( type, focusMappedHandler, true );
				}
				dataPriv.remove( dataHolder, delegateType );
			} else {
				dataPriv.set( dataHolder, delegateType, attaches );
			}
		}
	};
} );

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var

	// Support: IE <=10 - 11, Edge 12 - 13 only
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,

	rcleanScript = /^\s*<!\[CDATA\[|\]\]>\s*$/g;

// Prefer a tbody over its parent table for containing new rows
function manipulationTarget( elem, content ) {
	if ( nodeName( elem, "table" ) &&
		nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

		return jQuery( elem ).children( "tbody" )[ 0 ] || elem;
	}

	return elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	if ( ( elem.type || "" ).slice( 0, 5 ) === "true/" ) {
		elem.type = elem.type.slice( 5 );
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.get( src );
		events = pdataOld.events;

		if ( events ) {
			dataPriv.remove( dest, "handle events" );

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = flat( args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		valueIsFunction = isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( valueIsFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( valueIsFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (trac-8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android <=4.0 only, PhantomJS 1 only
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Re-enable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src && ( node.type || "" ).toLowerCase()  !== "module" ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl && !node.noModule ) {
								jQuery._evalUrl( node.src, {
									nonce: node.nonce || node.getAttribute( "nonce" )
								}, doc );
							}
						} else {

							// Unwrap a CDATA section containing script contents. This shouldn't be
							// needed as in XML documents they're already not visible when
							// inspecting element contents and in HTML documents they have no
							// meaning but we're preserving that logic for backwards compatibility.
							// This will be removed completely in 4.0. See gh-4904.
							DOMEval( node.textContent.replace( rcleanScript, "" ), node, doc );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && isAttached( node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html;
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = isAttached( elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew jQuery#find here for performance reasons:
			// https://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {
	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: Android <=4.0 only, PhantomJS 1 only
			// .get() because push.apply(_, arraylike) throws on ancient WebKit
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );
var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var rcustomProp = /^--/;


var getStyles = function( elem ) {

		// Support: IE <=11 only, Firefox <=30 (trac-15098, trac-14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};

var swap = function( elem, options, callback ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.call( elem );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var rboxStyle = new RegExp( cssExpand.join( "|" ), "i" );



( function() {

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {

		// This is a singleton, we need to execute it only once
		if ( !div ) {
			return;
		}

		container.style.cssText = "position:absolute;left:-11111px;width:60px;" +
			"margin-top:1px;padding:0;border:0";
		div.style.cssText =
			"position:relative;display:block;box-sizing:border-box;overflow:scroll;" +
			"margin:auto;border:1px;padding:1px;" +
			"width:60%;top:1%";
		documentElement.appendChild( container ).appendChild( div );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";

		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
		reliableMarginLeftVal = roundPixelMeasures( divStyle.marginLeft ) === 12;

		// Support: Android 4.0 - 4.3 only, Safari <=9.1 - 10.1, iOS <=7.0 - 9.3
		// Some styles come back with percentage values, even though they shouldn't
		div.style.right = "60%";
		pixelBoxStylesVal = roundPixelMeasures( divStyle.right ) === 36;

		// Support: IE 9 - 11 only
		// Detect misreporting of content dimensions for box-sizing:border-box elements
		boxSizingReliableVal = roundPixelMeasures( divStyle.width ) === 36;

		// Support: IE 9 only
		// Detect overflow:scroll screwiness (gh-3699)
		// Support: Chrome <=64
		// Don't get tricked when zoom affects offsetWidth (gh-4029)
		div.style.position = "absolute";
		scrollboxSizeVal = roundPixelMeasures( div.offsetWidth / 3 ) === 12;

		documentElement.removeChild( container );

		// Nullify the div so it wouldn't be stored in the memory and
		// it will also be a sign that checks already performed
		div = null;
	}

	function roundPixelMeasures( measure ) {
		return Math.round( parseFloat( measure ) );
	}

	var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal,
		reliableTrDimensionsVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE <=9 - 11 only
	// Style of cloned element affects source element cloned (trac-8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	jQuery.extend( support, {
		boxSizingReliable: function() {
			computeStyleTests();
			return boxSizingReliableVal;
		},
		pixelBoxStyles: function() {
			computeStyleTests();
			return pixelBoxStylesVal;
		},
		pixelPosition: function() {
			computeStyleTests();
			return pixelPositionVal;
		},
		reliableMarginLeft: function() {
			computeStyleTests();
			return reliableMarginLeftVal;
		},
		scrollboxSize: function() {
			computeStyleTests();
			return scrollboxSizeVal;
		},

		// Support: IE 9 - 11+, Edge 15 - 18+
		// IE/Edge misreport `getComputedStyle` of table rows with width/height
		// set in CSS while `offset*` properties report correct values.
		// Behavior in IE 9 is more subtle than in newer versions & it passes
		// some versions of this test; make sure not to make it pass there!
		//
		// Support: Firefox 70+
		// Only Firefox includes border widths
		// in computed dimensions. (gh-4529)
		reliableTrDimensions: function() {
			var table, tr, trChild, trStyle;
			if ( reliableTrDimensionsVal == null ) {
				table = document.createElement( "table" );
				tr = document.createElement( "tr" );
				trChild = document.createElement( "div" );

				table.style.cssText = "position:absolute;left:-11111px;border-collapse:separate";
				tr.style.cssText = "box-sizing:content-box;border:1px solid";

				// Support: Chrome 86+
				// Height set through cssText does not get applied.
				// Computed height then comes back as 0.
				tr.style.height = "1px";
				trChild.style.height = "9px";

				// Support: Android 8 Chrome 86+
				// In our bodyBackground.html iframe,
				// display for all div elements is set to "inline",
				// which causes a problem only in Android 8 Chrome 86.
				// Ensuring the div is `display: block`
				// gets around this issue.
				trChild.style.display = "block";

				documentElement
					.appendChild( table )
					.appendChild( tr )
					.appendChild( trChild );

				trStyle = window.getComputedStyle( tr );
				reliableTrDimensionsVal = ( parseInt( trStyle.height, 10 ) +
					parseInt( trStyle.borderTopWidth, 10 ) +
					parseInt( trStyle.borderBottomWidth, 10 ) ) === tr.offsetHeight;

				documentElement.removeChild( table );
			}
			return reliableTrDimensionsVal;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,
		isCustomProp = rcustomProp.test( name ),

		// Support: Firefox 51+
		// Retrieving style before computed somehow
		// fixes an issue with getting wrong values
		// on detached elements
		style = elem.style;

	computed = computed || getStyles( elem );

	// getPropertyValue is needed for:
	//   .css('filter') (IE 9 only, trac-12537)
	//   .css('--customProperty) (gh-3144)
	if ( computed ) {

		// Support: IE <=9 - 11+
		// IE only supports `"float"` in `getPropertyValue`; in computed styles
		// it's only available as `"cssFloat"`. We no longer modify properties
		// sent to `.css()` apart from camelCasing, so we need to check both.
		// Normally, this would create difference in behavior: if
		// `getPropertyValue` returns an empty string, the value returned
		// by `.css()` would be `undefined`. This is usually the case for
		// disconnected elements. However, in IE even disconnected elements
		// with no styles return `"none"` for `getPropertyValue( "float" )`
		ret = computed.getPropertyValue( name ) || computed[ name ];

		if ( isCustomProp && ret ) {

			// Support: Firefox 105+, Chrome <=105+
			// Spec requires trimming whitespace for custom properties (gh-4926).
			// Firefox only trims leading whitespace. Chrome just collapses
			// both leading & trailing whitespace to a single space.
			//
			// Fall back to `undefined` if empty string returned.
			// This collapses a missing definition with property defined
			// and set to an empty string but there's no standard API
			// allowing us to differentiate them without a performance penalty
			// and returning `undefined` aligns with older jQuery.
			//
			// rtrimCSS treats U+000D CARRIAGE RETURN and U+000C FORM FEED
			// as whitespace while CSS does not, but this is not a problem
			// because CSS preprocessing replaces them with U+000A LINE FEED
			// (which *is* CSS whitespace)
			// https://www.w3.org/TR/css-syntax-3/#input-preprocessing
			ret = ret.replace( rtrimCSS, "$1" ) || undefined;
		}

		if ( ret === "" && !isAttached( elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// https://drafts.csswg.org/cssom/#resolved-values
		if ( !support.pixelBoxStyles() && rnumnonpx.test( ret ) && rboxStyle.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var cssPrefixes = [ "Webkit", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style,
	vendorProps = {};

// Return a vendor-prefixed property or undefined
function vendorPropName( name ) {

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

// Return a potentially-mapped jQuery.cssProps or vendor prefixed property
function finalPropName( name ) {
	var final = jQuery.cssProps[ name ] || vendorProps[ name ];

	if ( final ) {
		return final;
	}
	if ( name in emptyStyle ) {
		return name;
	}
	return vendorProps[ name ] = vendorPropName( name ) || name;
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	};

function setPositiveNumber( _elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function boxModelAdjustment( elem, dimension, box, isBorderBox, styles, computedVal ) {
	var i = dimension === "width" ? 1 : 0,
		extra = 0,
		delta = 0,
		marginDelta = 0;

	// Adjustment may not be necessary
	if ( box === ( isBorderBox ? "border" : "content" ) ) {
		return 0;
	}

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin
		// Count margin delta separately to only add it after scroll gutter adjustment.
		// This is needed to make negative margins work with `outerHeight( true )` (gh-3982).
		if ( box === "margin" ) {
			marginDelta += jQuery.css( elem, box + cssExpand[ i ], true, styles );
		}

		// If we get here with a content-box, we're seeking "padding" or "border" or "margin"
		if ( !isBorderBox ) {

			// Add padding
			delta += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// For "border" or "margin", add border
			if ( box !== "padding" ) {
				delta += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );

			// But still keep track of it otherwise
			} else {
				extra += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}

		// If we get here with a border-box (content + padding + border), we're seeking "content" or
		// "padding" or "margin"
		} else {

			// For "content", subtract padding
			if ( box === "content" ) {
				delta -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// For "content" or "padding", subtract border
			if ( box !== "margin" ) {
				delta -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	// Account for positive content-box scroll gutter when requested by providing computedVal
	if ( !isBorderBox && computedVal >= 0 ) {

		// offsetWidth/offsetHeight is a rounded sum of content, padding, scroll gutter, and border
		// Assuming integer scroll gutter, subtract the rest and round down
		delta += Math.max( 0, Math.ceil(
			elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
			computedVal -
			delta -
			extra -
			0.5

		// If offsetWidth/offsetHeight is unknown, then we can't determine content-box scroll gutter
		// Use an explicit zero to avoid NaN (gh-3964)
		) ) || 0;
	}

	return delta + marginDelta;
}

function getWidthOrHeight( elem, dimension, extra ) {

	// Start with computed style
	var styles = getStyles( elem ),

		// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-4322).
		// Fake content-box until we know it's needed to know the true value.
		boxSizingNeeded = !support.boxSizingReliable() || extra,
		isBorderBox = boxSizingNeeded &&
			jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
		valueIsBorderBox = isBorderBox,

		val = curCSS( elem, dimension, styles ),
		offsetProp = "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 );

	// Support: Firefox <=54
	// Return a confounding non-pixel value or feign ignorance, as appropriate.
	if ( rnumnonpx.test( val ) ) {
		if ( !extra ) {
			return val;
		}
		val = "auto";
	}


	// Support: IE 9 - 11 only
	// Use offsetWidth/offsetHeight for when box sizing is unreliable.
	// In those cases, the computed value can be trusted to be border-box.
	if ( ( !support.boxSizingReliable() && isBorderBox ||

		// Support: IE 10 - 11+, Edge 15 - 18+
		// IE/Edge misreport `getComputedStyle` of table rows with width/height
		// set in CSS while `offset*` properties report correct values.
		// Interestingly, in some cases IE 9 doesn't suffer from this issue.
		!support.reliableTrDimensions() && nodeName( elem, "tr" ) ||

		// Fall back to offsetWidth/offsetHeight when value is "auto"
		// This happens for inline elements with no explicit setting (gh-3571)
		val === "auto" ||

		// Support: Android <=4.1 - 4.3 only
		// Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
		!parseFloat( val ) && jQuery.css( elem, "display", false, styles ) === "inline" ) &&

		// Make sure the element is visible & connected
		elem.getClientRects().length ) {

		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

		// Where available, offsetWidth/offsetHeight approximate border box dimensions.
		// Where not available (e.g., SVG), assume unreliable box-sizing and interpret the
		// retrieved value as a content box dimension.
		valueIsBorderBox = offsetProp in elem;
		if ( valueIsBorderBox ) {
			val = elem[ offsetProp ];
		}
	}

	// Normalize "" and auto
	val = parseFloat( val ) || 0;

	// Adjust for the element's box model
	return ( val +
		boxModelAdjustment(
			elem,
			dimension,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles,

			// Provide the current computed size to request scroll gutter calculation (gh-3589)
			val
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		animationIterationCount: true,
		aspectRatio: true,
		borderImageSlice: true,
		columnCount: true,
		flexGrow: true,
		flexShrink: true,
		fontWeight: true,
		gridArea: true,
		gridColumn: true,
		gridColumnEnd: true,
		gridColumnStart: true,
		gridRow: true,
		gridRowEnd: true,
		gridRowStart: true,
		lineHeight: true,
		opacity: true,
		order: true,
		orphans: true,
		scale: true,
		widows: true,
		zIndex: true,
		zoom: true,

		// SVG-related
		fillOpacity: true,
		floodOpacity: true,
		stopOpacity: true,
		strokeMiterlimit: true,
		strokeOpacity: true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name ),
			style = elem.style;

		// Make sure that we're working with the right name. We don't
		// want to query the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (trac-7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug trac-9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (trac-7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			// The isCustomProp check can be removed in jQuery 4.0 when we only auto-append
			// "px" to a few hardcoded values.
			if ( type === "number" && !isCustomProp ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				if ( isCustomProp ) {
					style.setProperty( name, value );
				} else {
					style[ name ] = value;
				}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name );

		// Make sure that we're working with the right name. We don't
		// want to modify the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}

		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( _i, dimension ) {
	jQuery.cssHooks[ dimension ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Support: IE <=11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
					swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, dimension, extra );
					} ) :
					getWidthOrHeight( elem, dimension, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = getStyles( elem ),

				// Only read styles.position if the test has a chance to fail
				// to avoid forcing a reflow.
				scrollboxSizeBuggy = !support.scrollboxSize() &&
					styles.position === "absolute",

				// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-3991)
				boxSizingNeeded = scrollboxSizeBuggy || extra,
				isBorderBox = boxSizingNeeded &&
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
				subtract = extra ?
					boxModelAdjustment(
						elem,
						dimension,
						extra,
						isBorderBox,
						styles
					) :
					0;

			// Account for unreliable border-box dimensions by comparing offset* to computed and
			// faking a content-box to get border and padding (gh-3699)
			if ( isBorderBox && scrollboxSizeBuggy ) {
				subtract -= Math.ceil(
					elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
					parseFloat( styles[ dimension ] ) -
					boxModelAdjustment( elem, dimension, "border", false, styles ) -
					0.5
				);
			}

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ dimension ] = value;
				value = jQuery.css( elem, dimension );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
			) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( prefix !== "margin" ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( Array.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 && (
				jQuery.cssHooks[ tween.prop ] ||
					tween.elem.style[ finalPropName( tween.prop ) ] != null ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9 only
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, inProgress,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

function schedule() {
	if ( inProgress ) {
		if ( document.hidden === false && window.requestAnimationFrame ) {
			window.requestAnimationFrame( schedule );
		} else {
			window.setTimeout( schedule, jQuery.fx.interval );
		}

		jQuery.fx.tick();
	}
}

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = Date.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
		isBox = "width" in props || "height" in props,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHiddenWithinTree( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Queue-skipping animations hijack the fx hooks
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Detect show/hide animations
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.test( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// Pretend to be hidden if this is a "show" and
				// there is still data from a stopped show/hide
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;

				// Ignore all other no-op show/hide data
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	// Bail out if this is a no-op like .hide().hide()
	propTween = !jQuery.isEmptyObject( props );
	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
		return;
	}

	// Restrict "overflow" and "display" styles during box animations
	if ( isBox && elem.nodeType === 1 ) {

		// Support: IE <=9 - 11, Edge 12 - 15
		// Record all 3 overflow attributes because IE does not infer the shorthand
		// from identically-valued overflowX and overflowY and Edge just mirrors
		// the overflowX value there.
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Identify a display type, preferring old show/hide data over the CSS cascade
		restoreDisplay = dataShow && dataShow.display;
		if ( restoreDisplay == null ) {
			restoreDisplay = dataPriv.get( elem, "display" );
		}
		display = jQuery.css( elem, "display" );
		if ( display === "none" ) {
			if ( restoreDisplay ) {
				display = restoreDisplay;
			} else {

				// Get nonempty value(s) by temporarily forcing visibility
				showHide( [ elem ], true );
				restoreDisplay = elem.style.display || restoreDisplay;
				display = jQuery.css( elem, "display" );
				showHide( [ elem ] );
			}
		}

		// Animate inline elements as inline-block
		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
			if ( jQuery.css( elem, "float" ) === "none" ) {

				// Restore the original display value at the end of pure show/hide animations
				if ( !propTween ) {
					anim.done( function() {
						style.display = restoreDisplay;
					} );
					if ( restoreDisplay == null ) {
						display = style.display;
						restoreDisplay = display === "none" ? "" : display;
					}
				}
				style.display = "inline-block";
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// Implement show/hide animations
	propTween = false;
	for ( prop in orig ) {

		// General show/hide setup for this element animation
		if ( !propTween ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
			}

			// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}

			// Show elements before animating them
			if ( hidden ) {
				showHide( [ elem ], true );
			}

			/* eslint-disable no-loop-func */

			anim.done( function() {

				/* eslint-enable no-loop-func */

				// The final step of a "hide" animation is actually hiding the element
				if ( !hidden ) {
					showHide( [ elem ] );
				}
				dataPriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
		}

		// Per-property setup
		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
		if ( !( prop in dataShow ) ) {
			dataShow[ prop ] = propTween.start;
			if ( hidden ) {
				propTween.end = propTween.start;
				propTween.start = 0;
			}
		}
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( Array.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3 only
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (trac-12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			// If there's more to do, yield
			if ( percent < 1 && length ) {
				return remaining;
			}

			// If this was an empty animation, synthesize a final progress notification
			if ( !length ) {
				deferred.notifyWith( elem, [ animation, 1, 0 ] );
			}

			// Resolve the animation and report its conclusion
			deferred.resolveWith( elem, [ animation ] );
			return false;
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
					animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					result.stop.bind( result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	// Attach callbacks from options
	animation
		.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	return animation;
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnothtmlwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !isFunction( easing ) && easing
	};

	// Go to the end state if fx are off
	if ( jQuery.fx.off ) {
		opt.duration = 0;

	} else {
		if ( typeof opt.duration !== "number" ) {
			if ( opt.duration in jQuery.fx.speeds ) {
				opt.duration = jQuery.fx.speeds[ opt.duration ];

			} else {
				opt.duration = jQuery.fx.speeds._default;
			}
		}
	}

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};

		doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( _i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = Date.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Run the timer and safely remove it when done (allowing for external removal)
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	jQuery.fx.start();
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( inProgress ) {
		return;
	}

	inProgress = true;
	schedule();
};

jQuery.fx.stop = function() {
	inProgress = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: Android <=4.3 only
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE <=11 only
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: IE <=11 only
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// Attribute hooks are determined by the lowercase version
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name,
			i = 0,

			// Attribute names can contain non-HTML whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match( rnothtmlwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( _i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle,
			lowercaseName = name.toLowerCase();

		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ lowercaseName ];
			attrHandle[ lowercaseName ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				lowercaseName :
				null;
			attrHandle[ lowercaseName ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// Support: IE <=9 - 11 only
				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// Use proper attribute retrieval (trac-12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				if ( tabindex ) {
					return parseInt( tabindex, 10 );
				}

				if (
					rfocusable.test( elem.nodeName ) ||
					rclickable.test( elem.nodeName ) &&
					elem.href
				) {
					return 0;
				}

				return -1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




	// Strip and collapse whitespace according to HTML spec
	// https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
	function stripAndCollapse( value ) {
		var tokens = value.match( rnothtmlwhite ) || [];
		return tokens.join( " " );
	}


function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

function classesToArray( value ) {
	if ( Array.isArray( value ) ) {
		return value;
	}
	if ( typeof value === "string" ) {
		return value.match( rnothtmlwhite ) || [];
	}
	return [];
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classNames, cur, curValue, className, i, finalValue;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		classNames = classesToArray( value );

		if ( classNames.length ) {
			return this.each( function() {
				curValue = getClass( this );
				cur = this.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					for ( i = 0; i < classNames.length; i++ ) {
						className = classNames[ i ];
						if ( cur.indexOf( " " + className + " " ) < 0 ) {
							cur += className + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						this.setAttribute( "class", finalValue );
					}
				}
			} );
		}

		return this;
	},

	removeClass: function( value ) {
		var classNames, cur, curValue, className, i, finalValue;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		classNames = classesToArray( value );

		if ( classNames.length ) {
			return this.each( function() {
				curValue = getClass( this );

				// This expression is here for better compressibility (see addClass)
				cur = this.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					for ( i = 0; i < classNames.length; i++ ) {
						className = classNames[ i ];

						// Remove *all* instances
						while ( cur.indexOf( " " + className + " " ) > -1 ) {
							cur = cur.replace( " " + className + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						this.setAttribute( "class", finalValue );
					}
				}
			} );
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var classNames, className, i, self,
			type = typeof value,
			isValidValue = type === "string" || Array.isArray( value );

		if ( isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		if ( typeof stateVal === "boolean" && isValidValue ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		classNames = classesToArray( value );

		return this.each( function() {
			if ( isValidValue ) {

				// Toggle individual class names
				self = jQuery( this );

				for ( i = 0; i < classNames.length; i++ ) {
					className = classNames[ i ];

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
							"" :
							dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, valueIsFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				// Handle most common string cases
				if ( typeof ret === "string" ) {
					return ret.replace( rreturn, "" );
				}

				// Handle cases where value is null/undef or number
				return ret == null ? "" : ret;
			}

			return;
		}

		valueIsFunction = isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( valueIsFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( Array.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE <=10 - 11 only
					// option.text throws exceptions (trac-14686, trac-14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option, i,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one",
					values = one ? null : [],
					max = one ? index + 1 : options.length;

				if ( index < 0 ) {
					i = max;

				} else {
					i = one ? index : 0;
				}

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Support: IE <=9 only
					// IE8-9 doesn't update selected after form reset (trac-2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							!option.disabled &&
							( !option.parentNode.disabled ||
								!nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					/* eslint-disable no-cond-assign */

					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}

					/* eslint-enable no-cond-assign */
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( Array.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion
var location = window.location;

var nonce = { guid: Date.now() };

var rquery = ( /\?/ );



// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml, parserErrorElem;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE 9 - 11 only
	// IE throws on parseFromString with invalid input.
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {}

	parserErrorElem = xml && xml.getElementsByTagName( "parsererror" )[ 0 ];
	if ( !xml || parserErrorElem ) {
		jQuery.error( "Invalid XML: " + (
			parserErrorElem ?
				jQuery.map( parserErrorElem.childNodes, function( el ) {
					return el.textContent;
				} ).join( "\n" ) :
				data
		) );
	}
	return xml;
};


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	stopPropagationCallback = function( e ) {
		e.stopPropagation();
	};

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special, lastElement,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = lastElement = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (trac-9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (trac-9724)
		if ( !onlyHandlers && !special.noBubble && !isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {
			lastElement = cur;
			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( dataPriv.get( cur, "events" ) || Object.create( null ) )[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name as the event.
				// Don't do default actions on window, that's where global variables be (trac-6170)
				if ( ontype && isFunction( elem[ type ] ) && !isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;

					if ( event.isPropagationStopped() ) {
						lastElement.addEventListener( type, stopPropagationCallback );
					}

					elem[ type ]();

					if ( event.isPropagationStopped() ) {
						lastElement.removeEventListener( type, stopPropagationCallback );
					}

					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


var
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( Array.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && toType( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, valueOrFunction ) {

			// If value is a function, invoke it and use its return value
			var value = isFunction( valueOrFunction ) ?
				valueOrFunction() :
				valueOrFunction;

			s[ s.length ] = encodeURIComponent( key ) + "=" +
				encodeURIComponent( value == null ? "" : value );
		};

	if ( a == null ) {
		return "";
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} ).filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} ).map( function( _i, elem ) {
			var val = jQuery( this ).val();

			if ( val == null ) {
				return null;
			}

			if ( Array.isArray( val ) ) {
				return jQuery.map( val, function( val ) {
					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
				} );
			}

			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


var
	r20 = /%20/g,
	rhash = /#.*$/,
	rantiCache = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// trac-7653, trac-8125, trac-8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (trac-10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = document.createElement( "a" );

originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

		if ( isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes trac-9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": JSON.parse,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// Request state (becomes false upon send and true upon completion)
			completed,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// uncached part of the url
			uncached,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( completed ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() + " " ] =
									( responseHeaders[ match[ 1 ].toLowerCase() + " " ] || [] )
										.concat( match[ 2 ] );
							}
						}
						match = responseHeaders[ key.toLowerCase() + " " ];
					}
					return match == null ? null : match.join( ", " );
				},

				// Raw string
				getAllResponseHeaders: function() {
					return completed ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( completed == null ) {
						name = requestHeadersNames[ name.toLowerCase() ] =
							requestHeadersNames[ name.toLowerCase() ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( completed == null ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( completed ) {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						} else {

							// Lazy-add the new callbacks in a way that preserves old ones
							for ( code in map ) {
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR );

		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (trac-10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket trac-12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE <=8 - 11, Edge 12 - 15
			// IE throws exception on accessing the href property if url is malformed,
			// e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE <=8 - 11 only
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( completed ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (trac-15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		// Remove hash to simplify url manipulation
		cacheURL = s.url.replace( rhash, "" );

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// Remember the hash so we can put it back
			uncached = s.url.slice( cacheURL.length );

			// If data is available and should be processed, append data to url
			if ( s.data && ( s.processData || typeof s.data === "string" ) ) {
				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

				// trac-9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add or update anti-cache param if needed
			if ( s.cache === false ) {
				cacheURL = cacheURL.replace( rantiCache, "$1" );
				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce.guid++ ) +
					uncached;
			}

			// Put hash and anti-cache on the URL that will be requested (gh-1732)
			s.url = cacheURL + uncached;

		// Change '%20' to '+' if this is encoded form body content (gh-2658)
		} else if ( s.data && s.processData &&
			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
			s.data = s.data.replace( r20, "+" );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		completeDeferred.add( s.complete );
		jqXHR.done( s.success );
		jqXHR.fail( s.error );

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( completed ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				completed = false;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Rethrow post-completion exceptions
				if ( completed ) {
					throw e;
				}

				// Propagate others as results
				done( -1, e );
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Ignore repeat invocations
			if ( completed ) {
				return;
			}

			completed = true;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Use a noop converter for missing script but not if jsonp
			if ( !isSuccess &&
				jQuery.inArray( "script", s.dataTypes ) > -1 &&
				jQuery.inArray( "json", s.dataTypes ) < 0 ) {
				s.converters[ "text script" ] = function() {};
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( _i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );

jQuery.ajaxPrefilter( function( s ) {
	var i;
	for ( i in s.headers ) {
		if ( i.toLowerCase() === "content-type" ) {
			s.contentType = s.headers[ i ] || "";
		}
	}
} );


jQuery._evalUrl = function( url, options, doc ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (trac-11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,

		// Only evaluate the response if it is successful (gh-4126)
		// dataFilter is not invoked for failure responses, so using it instead
		// of the default converter is kludgy but it works.
		converters: {
			"text script": function() {}
		},
		dataFilter: function( response ) {
			jQuery.globalEval( response, options, doc );
		}
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( this[ 0 ] ) {
			if ( isFunction( html ) ) {
				html = html.call( this[ 0 ] );
			}

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var htmlIsFunction = isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( htmlIsFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function( selector ) {
		this.parent( selector ).not( "body" ).each( function() {
			jQuery( this ).replaceWith( this.childNodes );
		} );
		return this;
	}
} );


jQuery.expr.pseudos.hidden = function( elem ) {
	return !jQuery.expr.pseudos.visible( elem );
};
jQuery.expr.pseudos.visible = function( elem ) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};




jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE <=9 only
		// trac-1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.ontimeout =
									xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE <=9 only
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File: protocol always yields status 0; see trac-8605, trac-14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE <=9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				errorCallback = xhr.onerror = xhr.ontimeout = callback( "error" );

				// Support: IE 9 only
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// trac-14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
jQuery.ajaxPrefilter( function( s ) {
	if ( s.crossDomain ) {
		s.contents.script = false;
	}
} );

// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain or forced-by-attrs requests
	if ( s.crossDomain || s.scriptAttrs ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" )
					.attr( s.scriptAttrs || {} )
					.prop( { charset: s.scriptCharset, src: s.url } )
					.on( "load error", callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					} );

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce.guid++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument = ( function() {
	var body = document.implementation.createHTMLDocument( "" ).body;
	body.innerHTML = "<form></form><form></form>";
	return body.childNodes.length === 2;
} )();


// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	var base, parsed, scripts;

	if ( !context ) {

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		if ( support.createHTMLDocument ) {
			context = document.implementation.createHTMLDocument( "" );

			// Set the base href for the created document
			// so any parsed elements with URLs
			// are based on the document's URL (gh-2965)
			base = context.createElement( "base" );
			base.href = document.location.href;
			context.head.appendChild( base );
		} else {
			context = document;
		}
	}

	parsed = rsingleTag.exec( data );
	scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = stripAndCollapse( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




jQuery.expr.pseudos.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {

	// offset() relates an element's border box to the document origin
	offset: function( options ) {

		// Preserve chaining for setter
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var rect, win,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
		// Support: IE <=11 only
		// Running getBoundingClientRect on a
		// disconnected node in IE throws an error
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}

		// Get document-relative position by adding viewport scroll to viewport-relative gBCR
		rect = elem.getBoundingClientRect();
		win = elem.ownerDocument.defaultView;
		return {
			top: rect.top + win.pageYOffset,
			left: rect.left + win.pageXOffset
		};
	},

	// position() relates an element's margin box to its offset parent's padding box
	// This corresponds to the behavior of CSS absolute positioning
	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset, doc,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// position:fixed elements are offset from the viewport, which itself always has zero offset
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume position:fixed implies availability of getBoundingClientRect
			offset = elem.getBoundingClientRect();

		} else {
			offset = this.offset();

			// Account for the *real* offset parent, which can be the document or its root element
			// when a statically positioned element is identified
			doc = elem.ownerDocument;
			offsetParent = elem.offsetParent || doc.documentElement;
			while ( offsetParent &&
				( offsetParent === doc.body || offsetParent === doc.documentElement ) &&
				jQuery.css( offsetParent, "position" ) === "static" ) {

				offsetParent = offsetParent.parentNode;
			}
			if ( offsetParent && offsetParent !== elem && offsetParent.nodeType === 1 ) {

				// Incorporate borders into its offset, since they are outside its content origin
				parentOffset = jQuery( offsetParent ).offset();
				parentOffset.top += jQuery.css( offsetParent, "borderTopWidth", true );
				parentOffset.left += jQuery.css( offsetParent, "borderLeftWidth", true );
			}
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {

			// Coalesce documents and windows
			var win;
			if ( isWindow( elem ) ) {
				win = elem;
			} else if ( elem.nodeType === 9 ) {
				win = elem.defaultView;
			}

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( _i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( {
		padding: "inner" + name,
		content: type,
		"": "outer" + name
	}, function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( isWindow( elem ) ) {

					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );


jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( _i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	},

	hover: function( fnOver, fnOut ) {
		return this
			.on( "mouseenter", fnOver )
			.on( "mouseleave", fnOut || fnOver );
	}
} );

jQuery.each(
	( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( _i, name ) {

		// Handle event binding
		jQuery.fn[ name ] = function( data, fn ) {
			return arguments.length > 0 ?
				this.on( name, null, data, fn ) :
				this.trigger( name );
		};
	}
);




// Support: Android <=4.0 only
// Make sure we trim BOM and NBSP
// Require that the "whitespace run" starts from a non-whitespace
// to avoid O(N^2) behavior when the engine would try matching "\s+$" at each space position.
var rtrim = /^[\s\uFEFF\xA0]+|([^\s\uFEFF\xA0])[\s\uFEFF\xA0]+$/g;

// Bind a function to a context, optionally partially applying any
// arguments.
// jQuery.proxy is deprecated to promote standards (specifically Function#bind)
// However, it is not slated for removal any time soon
jQuery.proxy = function( fn, context ) {
	var tmp, args, proxy;

	if ( typeof context === "string" ) {
		tmp = fn[ context ];
		context = fn;
		fn = tmp;
	}

	// Quick check to determine if target is callable, in the spec
	// this throws a TypeError, but we will just return undefined.
	if ( !isFunction( fn ) ) {
		return undefined;
	}

	// Simulated bind
	args = slice.call( arguments, 2 );
	proxy = function() {
		return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
	};

	// Set the guid of unique handler to the same of original handler, so it can be removed
	proxy.guid = fn.guid = fn.guid || jQuery.guid++;

	return proxy;
};

jQuery.holdReady = function( hold ) {
	if ( hold ) {
		jQuery.readyWait++;
	} else {
		jQuery.ready( true );
	}
};
jQuery.isArray = Array.isArray;
jQuery.parseJSON = JSON.parse;
jQuery.nodeName = nodeName;
jQuery.isFunction = isFunction;
jQuery.isWindow = isWindow;
jQuery.camelCase = camelCase;
jQuery.type = toType;

jQuery.now = Date.now;

jQuery.isNumeric = function( obj ) {

	// As of jQuery 3.0, isNumeric is limited to
	// strings and numbers (primitives or objects)
	// that can be coerced to finite numbers (gh-2662)
	var type = jQuery.type( obj );
	return ( type === "number" || type === "string" ) &&

		// parseFloat NaNs numeric-cast false positives ("")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		!isNaN( obj - parseFloat( obj ) );
};

jQuery.trim = function( text ) {
	return text == null ?
		"" :
		( text + "" ).replace( rtrim, "$1" );
};



// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( true ) {
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function() {
		return jQuery;
	}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}




var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (trac-7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (trac-13566)
if ( typeof noGlobal === "undefined" ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;
} );


/***/ }),

/***/ 132:
/***/ (function(module) {

/* Mapbox GL JS is Copyright © 2020 Mapbox and subject to the Mapbox Terms of Service ((https://www.mapbox.com/legal/tos/). */
(function (global, factory) {
 true ? module.exports = factory() :
0;
})(this, (function () { 'use strict';

/* eslint-disable */

var shared, worker, mapboxgl;
// define gets called three times: one for each chunk. we rely on the order
// they're imported to know which is which
function define(_, chunk) {
if (!shared) {
    shared = chunk;
} else if (!worker) {
    worker = chunk;
} else {
    var workerBundleString = "self.onerror = function() { console.error('An error occurred while parsing the WebWorker bundle. This is most likely due to improper transpilation by Babel; please see https://docs.mapbox.com/mapbox-gl-js/guides/install/#transpiling'); }; var sharedChunk = {}; (" + shared + ")(sharedChunk); (" + worker + ")(sharedChunk); self.onerror = null;"

    var sharedChunk = {};
    shared(sharedChunk);
    mapboxgl = chunk(sharedChunk);
    if (typeof window !== 'undefined' && window && window.URL && window.URL.createObjectURL) {
        mapboxgl.workerUrl = window.URL.createObjectURL(new Blob([workerBundleString], { type: 'text/javascript' }));
    }
}
}


define(["exports"],(function(t){"use strict";var e="undefined"!=typeof self?self:{},r="2.15.0";let n;const i={API_URL:"https://api.mapbox.com",get API_URL_REGEX(){if(null==n){const t=/^((https?:)?\/\/)?([^\/]+\.)?mapbox\.c(n|om)(\/|\?|$)/i;try{n=null!=({"NODE_ENV":"development"}).API_URL_REGEX?new RegExp(({"NODE_ENV":"development"}).API_URL_REGEX):t;}catch(e){n=t;}}return n},get API_TILEJSON_REGEX(){return /^((https?:)?\/\/)?([^\/]+\.)?mapbox\.c(n|om)(\/v[0-9]*\/.*\.json.*$)/i},get API_SPRITE_REGEX(){return /^((https?:)?\/\/)?([^\/]+\.)?mapbox\.c(n|om)(\/styles\/v[0-9]*\/)(.*\/sprite.*\..*$)/i},get API_FONTS_REGEX(){return /^((https?:)?\/\/)?([^\/]+\.)?mapbox\.c(n|om)(\/fonts\/v[0-9]*\/)(.*\.pbf.*$)/i},get API_STYLE_REGEX(){return /^((https?:)?\/\/)?([^\/]+\.)?mapbox\.c(n|om)(\/styles\/v[0-9]*\/)(.*$)/i},get API_CDN_URL_REGEX(){return /^((https?:)?\/\/)?api\.mapbox\.c(n|om)(\/mapbox-gl-js\/)(.*$)/i},get EVENTS_URL(){if(!i.API_URL)return null;try{const t=new URL(i.API_URL);return "api.mapbox.cn"===t.hostname?"https://events.mapbox.cn/events/v2":"api.mapbox.com"===t.hostname?"https://events.mapbox.com/events/v2":null}catch(t){return null}},SESSION_PATH:"/map-sessions/v1",FEEDBACK_URL:"https://apps.mapbox.com/feedback",TILE_URL_VERSION:"v4",RASTER_URL_PREFIX:"raster/v1",REQUIRE_ACCESS_TOKEN:!0,ACCESS_TOKEN:null,MAX_PARALLEL_IMAGE_REQUESTS:16},s={supported:!1,testSupport:function(t){!l&&o&&(u?c(t):a=t);}};let a,o,l=!1,u=!1;function c(t){const e=t.createTexture();t.bindTexture(t.TEXTURE_2D,e);try{if(t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,o),t.isContextLost())return;s.supported=!0;}catch(t){}t.deleteTexture(e),l=!0;}e.document&&(o=e.document.createElement("img"),o.onload=function(){a&&c(a),a=null,u=!0;},o.onerror=function(){l=!0,a=null;},o.src="data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAQAAAAfQ//73v/+BiOh/AAA=");const h="01";function p(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var d=f;function f(t,e,r,n){this.cx=3*t,this.bx=3*(r-t)-this.cx,this.ax=1-this.cx-this.bx,this.cy=3*e,this.by=3*(n-e)-this.cy,this.ay=1-this.cy-this.by,this.p1x=t,this.p1y=e,this.p2x=r,this.p2y=n;}f.prototype={sampleCurveX:function(t){return ((this.ax*t+this.bx)*t+this.cx)*t},sampleCurveY:function(t){return ((this.ay*t+this.by)*t+this.cy)*t},sampleCurveDerivativeX:function(t){return (3*this.ax*t+2*this.bx)*t+this.cx},solveCurveX:function(t,e){if(void 0===e&&(e=1e-6),t<0)return 0;if(t>1)return 1;for(var r=t,n=0;n<8;n++){var i=this.sampleCurveX(r)-t;if(Math.abs(i)<e)return r;var s=this.sampleCurveDerivativeX(r);if(Math.abs(s)<1e-6)break;r-=i/s;}var a=0,o=1;for(r=t,n=0;n<20&&(i=this.sampleCurveX(r),!(Math.abs(i-t)<e));n++)t>i?a=r:o=r,r=.5*(o-a)+a;return r},solve:function(t,e){return this.sampleCurveY(this.solveCurveX(t,e))}};var y=p(d),m=g;function g(t,e){this.x=t,this.y=e;}g.prototype={clone:function(){return new g(this.x,this.y)},add:function(t){return this.clone()._add(t)},sub:function(t){return this.clone()._sub(t)},multByPoint:function(t){return this.clone()._multByPoint(t)},divByPoint:function(t){return this.clone()._divByPoint(t)},mult:function(t){return this.clone()._mult(t)},div:function(t){return this.clone()._div(t)},rotate:function(t){return this.clone()._rotate(t)},rotateAround:function(t,e){return this.clone()._rotateAround(t,e)},matMult:function(t){return this.clone()._matMult(t)},unit:function(){return this.clone()._unit()},perp:function(){return this.clone()._perp()},round:function(){return this.clone()._round()},mag:function(){return Math.sqrt(this.x*this.x+this.y*this.y)},equals:function(t){return this.x===t.x&&this.y===t.y},dist:function(t){return Math.sqrt(this.distSqr(t))},distSqr:function(t){var e=t.x-this.x,r=t.y-this.y;return e*e+r*r},angle:function(){return Math.atan2(this.y,this.x)},angleTo:function(t){return Math.atan2(this.y-t.y,this.x-t.x)},angleWith:function(t){return this.angleWithSep(t.x,t.y)},angleWithSep:function(t,e){return Math.atan2(this.x*e-this.y*t,this.x*t+this.y*e)},_matMult:function(t){var e=t[2]*this.x+t[3]*this.y;return this.x=t[0]*this.x+t[1]*this.y,this.y=e,this},_add:function(t){return this.x+=t.x,this.y+=t.y,this},_sub:function(t){return this.x-=t.x,this.y-=t.y,this},_mult:function(t){return this.x*=t,this.y*=t,this},_div:function(t){return this.x/=t,this.y/=t,this},_multByPoint:function(t){return this.x*=t.x,this.y*=t.y,this},_divByPoint:function(t){return this.x/=t.x,this.y/=t.y,this},_unit:function(){return this._div(this.mag()),this},_perp:function(){var t=this.y;return this.y=this.x,this.x=-t,this},_rotate:function(t){var e=Math.cos(t),r=Math.sin(t),n=r*this.x+e*this.y;return this.x=e*this.x-r*this.y,this.y=n,this},_rotateAround:function(t,e){var r=Math.cos(t),n=Math.sin(t),i=e.y+n*(this.x-e.x)+r*(this.y-e.y);return this.x=e.x+r*(this.x-e.x)-n*(this.y-e.y),this.y=i,this},_round:function(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}},g.convert=function(t){return t instanceof g?t:Array.isArray(t)?new g(t[0],t[1]):t};var x=p(m);const v=Math.PI/180,b=180/Math.PI;function w(t){return t*v}function _(t){return t*b}const A=[[0,0],[1,0],[1,1],[0,1]];function S(t){if(t<=0)return 0;if(t>=1)return 1;const e=t*t,r=e*t;return 4*(t<.5?r:3*(t-e)+r-.75)}function k(t,e,r,n){const i=new y(t,e,r,n);return function(t){return i.solve(t)}}const I=k(.25,.1,.25,1);function M(t,e,r){return Math.min(r,Math.max(e,t))}function T(t,e,r){return (r=M((r-t)/(e-t),0,1))*r*(3-2*r)}function z(t,e,r){const n=r-e,i=((t-e)%n+n)%n+e;return i===e?r:i}function B(t,e,r){if(!t.length)return r(null,[]);let n=t.length;const i=new Array(t.length);let s=null;t.forEach(((t,a)=>{e(t,((t,e)=>{t&&(s=t),i[a]=e,0==--n&&r(s,i);}));}));}function E(t){const e=[];for(const r in t)e.push(t[r]);return e}function C(t,...e){for(const r of e)for(const e in r)t[e]=r[e];return t}let P=1;function D(){return P++}function V(){return function t(e){return e?(e^Math.random()*(16>>e/4)).toString(16):([1e7]+-[1e3]+-4e3+-8e3+-1e11).replace(/[018]/g,t)}()}function L(t){return t<=1?1:Math.pow(2,Math.ceil(Math.log(t)/Math.LN2))}function F(t){return !!t&&/^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(t)}function R(t,e){t.forEach((t=>{e[t]&&(e[t]=e[t].bind(e));}));}function U(t,e){return -1!==t.indexOf(e,t.length-e.length)}function $(t,e,r){const n={};for(const i in t)n[i]=e.call(r||this,t[i],i,t);return n}function j(t,e,r){const n={};for(const i in t)e.call(r||this,t[i],i,t)&&(n[i]=t[i]);return n}function O(t){return Array.isArray(t)?t.map(O):"object"==typeof t&&t?$(t,O):t}const q={};function N(t){q[t]||("undefined"!=typeof console&&console.warn(t),q[t]=!0);}function G(t,e,r){return (r.y-t.y)*(e.x-t.x)>(e.y-t.y)*(r.x-t.x)}function Z(t){let e=0;for(let r,n,i=0,s=t.length,a=s-1;i<s;a=i++)r=t[i],n=t[a],e+=(n.x-r.x)*(r.y+n.y);return e}function K(){return "undefined"!=typeof WorkerGlobalScope&&"undefined"!=typeof self&&self instanceof WorkerGlobalScope}function X(t){const e={};if(t.replace(/(?:^|(?:\s*\,\s*))([^\x00-\x20\(\)<>@\,;\:\\"\/\[\]\?\=\{\}\x7F]+)(?:\=(?:([^\x00-\x20\(\)<>@\,;\:\\"\/\[\]\?\=\{\}\x7F]+)|(?:\"((?:[^"\\]|\\.)*)\")))?/g,((t,r,n,i)=>{const s=n||i;return e[r]=!s||s.toLowerCase(),""})),e["max-age"]){const t=parseInt(e["max-age"],10);isNaN(t)?delete e["max-age"]:e["max-age"]=t;}return e}let J=null;function H(t){if(null==J){const e=t.navigator?t.navigator.userAgent:null;J=!!t.safari||!(!e||!(/\b(iPad|iPhone|iPod)\b/.test(e)||e.match("Safari")&&!e.match("Chrome")));}return J}function Y(t){try{const r=e[t];return r.setItem("_mapbox_test_",1),r.removeItem("_mapbox_test_"),!0}catch(t){return !1}}function W(t,e){return [t[4*e],t[4*e+1],t[4*e+2],t[4*e+3]]}const Q="mapbox-tiles";let tt=500,et=50;let rt,nt;function it(){try{return e.caches}catch(t){}}function st(){it()&&!rt&&(rt=e.caches.open(Q));}function at(t){const e=t.indexOf("?");if(e<0)return t;const r=function(t){const e=t.indexOf("?");return e>0?t.slice(e+1).split("&"):[]}(t),n=r.filter((t=>{const e=t.split("=");return "language"===e[0]||"worldview"===e[0]}));return n.length?`${t.slice(0,e)}?${n.join("&")}`:t.slice(0,e)}let ot=1/0;const lt={Unknown:"Unknown",Style:"Style",Source:"Source",Tile:"Tile",Glyphs:"Glyphs",SpriteImage:"SpriteImage",SpriteJSON:"SpriteJSON",Image:"Image"};"function"==typeof Object.freeze&&Object.freeze(lt);class ut extends Error{constructor(t,e,r){401===e&&bt(r)&&(t+=": you may have provided an invalid Mapbox access token. See https://docs.mapbox.com/api/overview/#access-tokens-and-token-scopes"),super(t),this.status=e,this.url=r;}toString(){return `${this.name}: ${this.message} (${this.status}): ${this.url}`}}const ct=K()?()=>self.worker&&self.worker.referrer:()=>("blob:"===e.location.protocol?e.parent:e).location.href;const ht=function(t,r){if(!(/^file:/.test(n=t.url)||/^file:/.test(ct())&&!/^\w+:/.test(n))){if(e.fetch&&e.Request&&e.AbortController&&e.Request.prototype.hasOwnProperty("signal"))return function(t,r){const n=new e.AbortController,i=new e.Request(t.url,{method:t.method||"GET",body:t.body,credentials:t.credentials,headers:t.headers,referrer:ct(),referrerPolicy:t.referrerPolicy,signal:n.signal});let s=!1,a=!1;const o=(l=i.url).indexOf("sku=")>0&&bt(l);var l;"json"===t.type&&i.headers.set("Accept","application/json");const u=(n,s,l)=>{if(a)return;if(n&&"SecurityError"!==n.message&&N(n.toString()),s&&l)return c(s);const u=Date.now();e.fetch(i).then((e=>{if(e.ok){const t=o?e.clone():null;return c(e,t,u)}return r(new ut(e.statusText,e.status,t.url))})).catch((e=>{"AbortError"!==e.name&&r(new Error(`${e.message} ${t.url}`));}));},c=(n,o,l)=>{("arrayBuffer"===t.type?n.arrayBuffer():"json"===t.type?n.json():n.text()).then((t=>{a||(o&&l&&function(t,r,n){if(st(),!rt)return;const i={status:r.status,statusText:r.statusText,headers:new e.Headers};r.headers.forEach(((t,e)=>i.headers.set(e,t)));const s=X(r.headers.get("Cache-Control")||"");if(s["no-store"])return;s["max-age"]&&i.headers.set("Expires",new Date(n+1e3*s["max-age"]).toUTCString());const a=i.headers.get("Expires");a&&(new Date(a).getTime()-n<42e4||function(t,e){if(void 0===nt)try{new Response(new ReadableStream),nt=!0;}catch(t){nt=!1;}nt?e(t.body):t.blob().then(e);}(r,(r=>{const n=new e.Response(r,i);st(),rt&&rt.then((e=>e.put(at(t.url),n))).catch((t=>N(t.message)));})));}(i,o,l),s=!0,r(null,t,n.headers.get("Cache-Control"),n.headers.get("Expires")));})).catch((t=>{a||r(new Error(t.message));}));};return o?function(t,e){if(st(),!rt)return e(null);const r=at(t.url);rt.then((t=>{t.match(r).then((n=>{const i=function(t){if(!t)return !1;const e=new Date(t.headers.get("Expires")||0),r=X(t.headers.get("Cache-Control")||"");return e>Date.now()&&!r["no-cache"]}(n);t.delete(r),i&&t.put(r,n.clone()),e(null,n,i);})).catch(e);})).catch(e);}(i,u):u(null,null),{cancel:()=>{a=!0,s||n.abort();}}}(t,r);if(K()&&self.worker&&self.worker.actor)return self.worker.actor.send("getResource",t,r,void 0,!0)}var n;return function(t,r){const n=new e.XMLHttpRequest;n.open(t.method||"GET",t.url,!0),"arrayBuffer"===t.type&&(n.responseType="arraybuffer");for(const e in t.headers)n.setRequestHeader(e,t.headers[e]);return "json"===t.type&&(n.responseType="text",n.setRequestHeader("Accept","application/json")),n.withCredentials="include"===t.credentials,n.onerror=()=>{r(new Error(n.statusText));},n.onload=()=>{if((n.status>=200&&n.status<300||0===n.status)&&null!==n.response){let e=n.response;if("json"===t.type)try{e=JSON.parse(n.response);}catch(t){return r(t)}r(null,e,n.getResponseHeader("Cache-Control"),n.getResponseHeader("Expires"));}else r(new ut(n.statusText,n.status,t.url));},n.send(t.body),{cancel:()=>n.abort()}}(t,r)},pt=function(t,e){return ht(C(t,{type:"arrayBuffer"}),e)};function dt(t){const r=e.document.createElement("a");return r.href=t,r.protocol===e.document.location.protocol&&r.host===e.document.location.host}const ft="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQYV2NgAAIAAAUAAarVyFEAAAAASUVORK5CYII=";let yt,mt;yt=[],mt=0;const gt=function(t,r){if(s.supported&&(t.headers||(t.headers={}),t.headers.accept="image/webp,*/*"),mt>=i.MAX_PARALLEL_IMAGE_REQUESTS){const e={requestParameters:t,callback:r,cancelled:!1,cancel(){this.cancelled=!0;}};return yt.push(e),e}mt++;let n=!1;const a=()=>{if(!n)for(n=!0,mt--;yt.length&&mt<i.MAX_PARALLEL_IMAGE_REQUESTS;){const t=yt.shift(),{requestParameters:e,callback:r,cancelled:n}=t;n||(t.cancel=gt(e,r).cancel);}},o=pt(t,((t,n,i,s)=>{a(),t?r(t):n&&(e.createImageBitmap?function(t,r){const n=new e.Blob([new Uint8Array(t)],{type:"image/png"});e.createImageBitmap(n).then((t=>{r(null,t);})).catch((t=>{r(new Error(`Could not load image because of ${t.message}. Please make sure to use a supported image type such as PNG or JPEG. Note that SVGs are not supported.`));}));}(n,((t,e)=>r(t,e,i,s))):function(t,r){const n=new e.Image,i=e.URL;n.onload=()=>{r(null,n),i.revokeObjectURL(n.src),n.onload=null,e.requestAnimationFrame((()=>{n.src=ft;}));},n.onerror=()=>r(new Error("Could not load image. Please make sure to use a supported image type such as PNG or JPEG. Note that SVGs are not supported."));const s=new e.Blob([new Uint8Array(t)],{type:"image/png"});n.src=t.byteLength?i.createObjectURL(s):ft;}(n,((t,e)=>r(t,e,i,s))));}));return {cancel:()=>{o.cancel(),a();}}},xt="NO_ACCESS_TOKEN";function vt(t){return 0===t.indexOf("mapbox:")}function bt(t){return i.API_URL_REGEX.test(t)}function wt(t){return i.API_CDN_URL_REGEX.test(t)}function _t(t){return i.API_STYLE_REGEX.test(t)&&!At(t)}function At(t){return i.API_SPRITE_REGEX.test(t)}const St=/^(\w+):\/\/([^/?]*)(\/[^?]+)?\??(.+)?/;function kt(t){const e=t.match(St);if(!e)throw new Error("Unable to parse URL object");return {protocol:e[1],authority:e[2],path:e[3]||"/",params:e[4]?e[4].split("&"):[]}}function It(t){const e=t.params.length?`?${t.params.join("&")}`:"";return `${t.protocol}://${t.authority}${t.path}${e}`}const Mt="mapbox.eventData";function Tt(t){if(!t)return null;const r=t.split(".");if(!r||3!==r.length)return null;try{return JSON.parse(decodeURIComponent(e.atob(r[1]).split("").map((t=>"%"+("00"+t.charCodeAt(0).toString(16)).slice(-2))).join("")))}catch(t){return null}}class zt{constructor(t){this.type=t,this.anonId=null,this.eventData={},this.queue=[],this.pendingRequest=null;}getStorageKey(t){const r=Tt(i.ACCESS_TOKEN);let n="";return n=r&&r.u?e.btoa(encodeURIComponent(r.u).replace(/%([0-9A-F]{2})/g,((t,e)=>String.fromCharCode(Number("0x"+e))))):i.ACCESS_TOKEN||"",t?`${Mt}.${t}:${n}`:`${Mt}:${n}`}fetchEventData(){const t=Y("localStorage"),r=this.getStorageKey(),n=this.getStorageKey("uuid");if(t)try{const t=e.localStorage.getItem(r);t&&(this.eventData=JSON.parse(t));const i=e.localStorage.getItem(n);i&&(this.anonId=i);}catch(t){N("Unable to read from LocalStorage");}}saveEventData(){const t=Y("localStorage"),r=this.getStorageKey(),n=this.getStorageKey("uuid");if(t)try{e.localStorage.setItem(n,this.anonId),Object.keys(this.eventData).length>=1&&e.localStorage.setItem(r,JSON.stringify(this.eventData));}catch(t){N("Unable to write to LocalStorage");}}processRequests(t){}postEvent(t,e,r,n){if(!i.EVENTS_URL)return;const s=kt(i.EVENTS_URL);s.params.push(`access_token=${n||i.ACCESS_TOKEN||""}`);const a={event:this.type,created:new Date(t).toISOString()},o=e?C(a,e):a,l={url:It(s),headers:{"Content-Type":"text/plain"},body:JSON.stringify([o])};this.pendingRequest=function(t,e){return ht(C(t,{method:"POST"}),e)}(l,(t=>{this.pendingRequest=null,r(t),this.saveEventData(),this.processRequests(n);}));}queueRequest(t,e){this.queue.push(t),this.processRequests(e);}}const Bt=new class extends zt{constructor(t){super("appUserTurnstile"),this._customAccessToken=t;}postTurnstileEvent(t,e){i.EVENTS_URL&&i.ACCESS_TOKEN&&Array.isArray(t)&&t.some((t=>vt(t)||bt(t)))&&this.queueRequest(Date.now(),e);}processRequests(t){if(this.pendingRequest||0===this.queue.length)return;this.anonId&&this.eventData.lastSuccess&&this.eventData.tokenU||this.fetchEventData();const e=Tt(i.ACCESS_TOKEN),n=e?e.u:i.ACCESS_TOKEN;let s=n!==this.eventData.tokenU;F(this.anonId)||(this.anonId=V(),s=!0);const a=this.queue.shift();if(this.eventData.lastSuccess){const t=new Date(this.eventData.lastSuccess),e=new Date(a),r=(a-this.eventData.lastSuccess)/864e5;s=s||r>=1||r<-1||t.getDate()!==e.getDate();}else s=!0;s?this.postEvent(a,{sdkIdentifier:"mapbox-gl-js",sdkVersion:r,skuId:h,"enabled.telemetry":!1,userId:this.anonId},(t=>{t||(this.eventData.lastSuccess=a,this.eventData.tokenU=n);}),t):this.processRequests();}},Et=Bt.postTurnstileEvent.bind(Bt),Ct=new class extends zt{constructor(){super("map.load"),this.success={},this.skuToken="";}postMapLoadEvent(t,e,r,n){this.skuToken=e,this.errorCb=n,i.EVENTS_URL&&(r||i.ACCESS_TOKEN?this.queueRequest({id:t,timestamp:Date.now()},r):this.errorCb(new Error(xt)));}processRequests(t){if(this.pendingRequest||0===this.queue.length)return;const{id:e,timestamp:n}=this.queue.shift();e&&this.success[e]||(this.anonId||this.fetchEventData(),F(this.anonId)||(this.anonId=V()),this.postEvent(n,{sdkIdentifier:"mapbox-gl-js",sdkVersion:r,skuId:h,skuToken:this.skuToken,userId:this.anonId},(t=>{t?this.errorCb(t):e&&(this.success[e]=!0);}),t));}},Pt=Ct.postMapLoadEvent.bind(Ct),Dt=new class extends zt{constructor(){super("gljs.performance");}postPerformanceEvent(t,e){i.EVENTS_URL&&(t||i.ACCESS_TOKEN)&&this.queueRequest({timestamp:Date.now(),performanceData:e},t);}processRequests(t){if(this.pendingRequest||0===this.queue.length)return;const{timestamp:n,performanceData:i}=this.queue.shift(),s=function(t){const n=e.performance.getEntriesByType("resource"),i=e.performance.getEntriesByType("mark"),s=function(t){const e={};if(t)for(const r in t)if("other"!==r)for(const n of t[r]){const t=`${r}ResolveRangeMin`,i=`${r}ResolveRangeMax`,s=`${r}RequestCount`,a=`${r}RequestCachedCount`;e[t]=Math.min(e[t]||1/0,n.startTime),e[i]=Math.max(e[i]||-1/0,n.responseEnd);const o=t=>{void 0===e[t]&&(e[t]=0),++e[t];};void 0!==n.transferSize&&0===n.transferSize&&o(a),o(s);}return e}(function(t,e){const r={};if(t)for(const n of t){const t=e(n);void 0===r[t]&&(r[t]=[]),r[t].push(n);}return r}(n,jt)),a=e.devicePixelRatio,o=e.navigator.connection||e.navigator.mozConnection||e.navigator.webkitConnection,l={counters:[],metadata:[],attributes:[]},u=(t,e,r)=>{null!=r&&t.push({name:e,value:r.toString()});};for(const t in s)u(l.counters,t,s[t]);if(t.interactionRange[0]!==1/0&&t.interactionRange[1]!==-1/0&&(u(l.counters,"interactionRangeMin",t.interactionRange[0]),u(l.counters,"interactionRangeMax",t.interactionRange[1])),i)for(const t of Object.keys(Ut)){const e=Ut[t],r=i.find((t=>t.name===e));r&&u(l.counters,e,r.startTime);}return u(l.counters,"visibilityHidden",t.visibilityHidden),u(l.attributes,"style",function(t){if(t)for(const e of t){const t=e.name.split("?")[0];if(_t(t)){const e=t.split("/").slice(-2);if(2===e.length)return `mapbox://styles/${e[0]}/${e[1]}`}}}(n)),u(l.attributes,"terrainEnabled",t.terrainEnabled?"true":"false"),u(l.attributes,"fogEnabled",t.fogEnabled?"true":"false"),u(l.attributes,"projection",t.projection),u(l.attributes,"zoom",t.zoom),u(l.metadata,"devicePixelRatio",a),u(l.metadata,"connectionEffectiveType",o?o.effectiveType:void 0),u(l.metadata,"navigatorUserAgent",e.navigator.userAgent),u(l.metadata,"screenWidth",e.screen.width),u(l.metadata,"screenHeight",e.screen.height),u(l.metadata,"windowWidth",e.innerWidth),u(l.metadata,"windowHeight",e.innerHeight),u(l.metadata,"mapWidth",t.width/a),u(l.metadata,"mapHeight",t.height/a),u(l.metadata,"webglRenderer",t.renderer),u(l.metadata,"webglVendor",t.vendor),u(l.metadata,"sdkVersion",r),u(l.metadata,"sdkIdentifier","mapbox-gl-js"),l}(i);for(const t of s.metadata);for(const t of s.counters);for(const t of s.attributes);this.postEvent(n,s,(()=>{}),t);}},Vt=Dt.postPerformanceEvent.bind(Dt),Lt=new class extends zt{constructor(){super("map.auth"),this.success={},this.skuToken="";}getSession(t,e,r,n){if(!i.API_URL||!i.SESSION_PATH)return;const s=kt(i.API_URL+i.SESSION_PATH);s.params.push(`sku=${e||""}`),s.params.push(`access_token=${n||i.ACCESS_TOKEN||""}`);const a={url:It(s),headers:{"Content-Type":"text/plain"}};this.pendingRequest=function(t,e){return ht(C(t,{method:"GET"}),e)}(a,(t=>{this.pendingRequest=null,r(t),this.saveEventData(),this.processRequests(n);}));}getSessionAPI(t,e,r,n){this.skuToken=e,this.errorCb=n,i.SESSION_PATH&&i.API_URL&&(r||i.ACCESS_TOKEN?this.queueRequest({id:t,timestamp:Date.now()},r):this.errorCb(new Error(xt)));}processRequests(t){if(this.pendingRequest||0===this.queue.length)return;const{id:e,timestamp:r}=this.queue.shift();e&&this.success[e]||this.getSession(r,this.skuToken,(t=>{t?this.errorCb(t):e&&(this.success[e]=!0);}),t);}},Ft=Lt.getSessionAPI.bind(Lt),Rt=new Set,Ut={create:"create",load:"load",fullLoad:"fullLoad"},$t={mark(t){e.performance.mark(t);},measure(t,r,n){e.performance.measure(t,r,n);}};function jt(t){const e=t.name.split("?")[0];return wt(e)&&e.includes("mapbox-gl.js")?"javascript":wt(e)&&e.includes("mapbox-gl.css")?"css":function(t){return i.API_FONTS_REGEX.test(t)}(e)?"fontRange":At(e)?"sprite":_t(e)?"style":function(t){return i.API_TILEJSON_REGEX.test(t)}(e)?"tilejson":"other"}const Ot=e.performance;function qt(t){const e=t?t.url.toString():void 0;return Ot.getEntriesByName(e)}let Nt,Gt,Zt,Kt;const Xt={now:()=>void 0!==Zt?Zt:e.performance.now(),setNow(t){Zt=t;},restoreNow(){Zt=void 0;},frame(t){const r=e.requestAnimationFrame(t);return {cancel:()=>e.cancelAnimationFrame(r)}},getImageData(t,r=0){const{width:n,height:i}=t;Kt||(Kt=e.document.createElement("canvas"));const s=Kt.getContext("2d",{willReadFrequently:!0});if(!s)throw new Error("failed to create canvas 2d context");return (n>Kt.width||i>Kt.height)&&(Kt.width=n,Kt.height=i),s.clearRect(-r,-r,n+2*r,i+2*r),s.drawImage(t,0,0,n,i),s.getImageData(-r,-r,n+2*r,i+2*r)},resolveURL:t=>(Nt||(Nt=e.document.createElement("a")),Nt.href=t,Nt.href),get devicePixelRatio(){return e.devicePixelRatio},get prefersReducedMotion(){return !!e.matchMedia&&(null==Gt&&(Gt=e.matchMedia("(prefers-reduced-motion: reduce)")),Gt.matches)}};function Jt(t,e,r){r[t]&&-1!==r[t].indexOf(e)||(r[t]=r[t]||[],r[t].push(e));}function Ht(t,e,r){if(r&&r[t]){const n=r[t].indexOf(e);-1!==n&&r[t].splice(n,1);}}class Yt{constructor(t,e={}){C(this,e),this.type=t;}}class Wt extends Yt{constructor(t,e={}){super("error",C({error:t},e));}}class Qt{on(t,e){return this._listeners=this._listeners||{},Jt(t,e,this._listeners),this}off(t,e){return Ht(t,e,this._listeners),Ht(t,e,this._oneTimeListeners),this}once(t,e){return e?(this._oneTimeListeners=this._oneTimeListeners||{},Jt(t,e,this._oneTimeListeners),this):new Promise((e=>this.once(t,e)))}fire(t,e){"string"==typeof t&&(t=new Yt(t,e||{}));const r=t.type;if(this.listens(r)){t.target=this;const e=this._listeners&&this._listeners[r]?this._listeners[r].slice():[];for(const r of e)r.call(this,t);const n=this._oneTimeListeners&&this._oneTimeListeners[r]?this._oneTimeListeners[r].slice():[];for(const e of n)Ht(r,e,this._oneTimeListeners),e.call(this,t);const i=this._eventedParent;i&&(C(t,"function"==typeof this._eventedParentData?this._eventedParentData():this._eventedParentData),i.fire(t));}else t instanceof Wt&&console.error(t.error);return this}listens(t){return !!(this._listeners&&this._listeners[t]&&this._listeners[t].length>0||this._oneTimeListeners&&this._oneTimeListeners[t]&&this._oneTimeListeners[t].length>0||this._eventedParent&&this._eventedParent.listens(t))}setEventedParent(t,e){return this._eventedParent=t,this._eventedParentData=e,this}}var te=JSON.parse('{"$version":8,"$root":{"version":{"required":true,"type":"enum","values":[8]},"name":{"type":"string"},"metadata":{"type":"*"},"center":{"type":"array","value":"number"},"zoom":{"type":"number"},"bearing":{"type":"number","default":0,"period":360,"units":"degrees"},"pitch":{"type":"number","default":0,"units":"degrees"},"light":{"type":"light"},"terrain":{"type":"terrain"},"fog":{"type":"fog"},"sources":{"required":true,"type":"sources"},"sprite":{"type":"string"},"glyphs":{"type":"string"},"transition":{"type":"transition"},"projection":{"type":"projection"},"layers":{"required":true,"type":"array","value":"layer"}},"sources":{"*":{"type":"source"}},"source":["source_vector","source_raster","source_raster_dem","source_geojson","source_video","source_image"],"source_vector":{"type":{"required":true,"type":"enum","values":{"vector":{}}},"url":{"type":"string"},"tiles":{"type":"array","value":"string"},"bounds":{"type":"array","value":"number","length":4,"default":[-180,-85.051129,180,85.051129]},"scheme":{"type":"enum","values":{"xyz":{},"tms":{}},"default":"xyz"},"minzoom":{"type":"number","default":0},"maxzoom":{"type":"number","default":22},"attribution":{"type":"string"},"promoteId":{"type":"promoteId"},"volatile":{"type":"boolean","default":false},"*":{"type":"*"}},"source_raster":{"type":{"required":true,"type":"enum","values":{"raster":{}}},"url":{"type":"string"},"tiles":{"type":"array","value":"string"},"bounds":{"type":"array","value":"number","length":4,"default":[-180,-85.051129,180,85.051129]},"minzoom":{"type":"number","default":0},"maxzoom":{"type":"number","default":22},"tileSize":{"type":"number","default":512,"units":"pixels"},"scheme":{"type":"enum","values":{"xyz":{},"tms":{}},"default":"xyz"},"attribution":{"type":"string"},"volatile":{"type":"boolean","default":false},"*":{"type":"*"}},"source_raster_dem":{"type":{"required":true,"type":"enum","values":{"raster-dem":{}}},"url":{"type":"string"},"tiles":{"type":"array","value":"string"},"bounds":{"type":"array","value":"number","length":4,"default":[-180,-85.051129,180,85.051129]},"minzoom":{"type":"number","default":0},"maxzoom":{"type":"number","default":22},"tileSize":{"type":"number","default":512,"units":"pixels"},"attribution":{"type":"string"},"encoding":{"type":"enum","values":{"terrarium":{},"mapbox":{}},"default":"mapbox"},"volatile":{"type":"boolean","default":false},"*":{"type":"*"}},"source_geojson":{"type":{"required":true,"type":"enum","values":{"geojson":{}}},"data":{"type":"*"},"maxzoom":{"type":"number","default":18},"attribution":{"type":"string"},"buffer":{"type":"number","default":128,"maximum":512,"minimum":0},"filter":{"type":"*"},"tolerance":{"type":"number","default":0.375},"cluster":{"type":"boolean","default":false},"clusterRadius":{"type":"number","default":50,"minimum":0},"clusterMaxZoom":{"type":"number"},"clusterMinPoints":{"type":"number"},"clusterProperties":{"type":"*"},"lineMetrics":{"type":"boolean","default":false},"generateId":{"type":"boolean","default":false},"promoteId":{"type":"promoteId"}},"source_video":{"type":{"required":true,"type":"enum","values":{"video":{}}},"urls":{"required":true,"type":"array","value":"string"},"coordinates":{"required":true,"type":"array","length":4,"value":{"type":"array","length":2,"value":"number"}}},"source_image":{"type":{"required":true,"type":"enum","values":{"image":{}}},"url":{"required":true,"type":"string"},"coordinates":{"required":true,"type":"array","length":4,"value":{"type":"array","length":2,"value":"number"}}},"layer":{"id":{"type":"string","required":true},"type":{"type":"enum","values":{"fill":{},"line":{},"symbol":{},"circle":{},"heatmap":{},"fill-extrusion":{},"raster":{},"hillshade":{},"background":{},"sky":{}},"required":true},"metadata":{"type":"*"},"source":{"type":"string"},"source-layer":{"type":"string"},"minzoom":{"type":"number","minimum":0,"maximum":24},"maxzoom":{"type":"number","minimum":0,"maximum":24},"filter":{"type":"filter"},"layout":{"type":"layout"},"paint":{"type":"paint"}},"layout":["layout_fill","layout_line","layout_circle","layout_heatmap","layout_fill-extrusion","layout_symbol","layout_raster","layout_hillshade","layout_background","layout_sky"],"layout_background":{"visibility":{"type":"enum","values":{"visible":{},"none":{}},"default":"visible","property-type":"constant"}},"layout_sky":{"visibility":{"type":"enum","values":{"visible":{},"none":{}},"default":"visible","property-type":"constant"}},"layout_fill":{"fill-sort-key":{"type":"number","expression":{"interpolated":false,"parameters":["zoom","feature"]},"property-type":"data-driven"},"visibility":{"type":"enum","values":{"visible":{},"none":{}},"default":"visible","property-type":"constant"}},"layout_circle":{"circle-sort-key":{"type":"number","expression":{"interpolated":false,"parameters":["zoom","feature"]},"property-type":"data-driven"},"visibility":{"type":"enum","values":{"visible":{},"none":{}},"default":"visible","property-type":"constant"}},"layout_heatmap":{"visibility":{"type":"enum","values":{"visible":{},"none":{}},"default":"visible","property-type":"constant"}},"layout_fill-extrusion":{"visibility":{"type":"enum","values":{"visible":{},"none":{}},"default":"visible","property-type":"constant"},"fill-extrusion-edge-radius":{"type":"number","private":true,"default":0,"minimum":0,"maximum":1,"property-type":"constant"}},"layout_line":{"line-cap":{"type":"enum","values":{"butt":{},"round":{},"square":{}},"default":"butt","expression":{"interpolated":false,"parameters":["zoom","feature"]},"property-type":"data-driven"},"line-join":{"type":"enum","values":{"bevel":{},"round":{},"miter":{}},"default":"miter","expression":{"interpolated":false,"parameters":["zoom","feature"]},"property-type":"data-driven"},"line-miter-limit":{"type":"number","default":2,"requires":[{"line-join":"miter"}],"expression":{"interpolated":true,"parameters":["zoom"]},"property-type":"data-constant"},"line-round-limit":{"type":"number","default":1.05,"requires":[{"line-join":"round"}],"expression":{"interpolated":true,"parameters":["zoom"]},"property-type":"data-constant"},"line-sort-key":{"type":"number","expression":{"interpolated":false,"parameters":["zoom","feature"]},"property-type":"data-driven"},"visibility":{"type":"enum","values":{"visible":{},"none":{}},"default":"visible","property-type":"constant"}},"layout_symbol":{"symbol-placement":{"type":"enum","values":{"point":{},"line":{},"line-center":{}},"default":"point","expression":{"interpolated":false,"parameters":["zoom"]},"property-type":"data-constant"},"symbol-spacing":{"type":"number","default":250,"minimum":1,"units":"pixels","requires":[{"symbol-placement":"line"}],"expression":{"interpolated":true,"parameters":["zoom"]},"property-type":"data-constant"},"symbol-avoid-edges":{"type":"boolean","default":false,"expression":{"interpolated":false,"parameters":["zoom"]},"property-type":"data-constant"},"symbol-sort-key":{"type":"number","expression":{"interpolated":false,"parameters":["zoom","feature"]},"property-type":"data-driven"},"symbol-z-order":{"type":"enum","values":{"auto":{},"viewport-y":{},"source":{}},"default":"auto","expression":{"interpolated":false,"parameters":["zoom"]},"property-type":"data-constant"},"icon-allow-overlap":{"type":"boolean","default":false,"requires":["icon-image"],"expression":{"interpolated":false,"parameters":["zoom"]},"property-type":"data-constant"},"icon-ignore-placement":{"type":"boolean","default":false,"requires":["icon-image"],"expression":{"interpolated":false,"parameters":["zoom"]},"property-type":"data-constant"},"icon-optional":{"type":"boolean","default":false,"requires":["icon-image","text-field"],"expression":{"interpolated":false,"parameters":["zoom"]},"property-type":"data-constant"},"icon-rotation-alignment":{"type":"enum","values":{"map":{},"viewport":{},"auto":{}},"default":"auto","requires":["icon-image"],"expression":{"interpolated":false,"parameters":["zoom"]},"property-type":"data-constant"},"icon-size":{"type":"number","default":1,"minimum":0,"units":"factor of the original icon size","requires":["icon-image"],"expression":{"interpolated":true,"parameters":["zoom","feature"]},"property-type":"data-driven"},"icon-text-fit":{"type":"enum","values":{"none":{},"width":{},"height":{},"both":{}},"default":"none","requires":["icon-image","text-field"],"expression":{"interpolated":false,"parameters":["zoom"]},"property-type":"data-constant"},"icon-text-fit-padding":{"type":"array","value":"number","length":4,"default":[0,0,0,0],"units":"pixels","requires":["icon-image","text-field",{"icon-text-fit":["both","width","height"]}],"expression":{"interpolated":true,"parameters":["zoom"]},"property-type":"data-constant"},"icon-image":{"type":"resolvedImage","tokens":true,"expression":{"interpolated":false,"parameters":["zoom","feature"]},"property-type":"data-driven"},"icon-rotate":{"type":"number","default":0,"period":360,"units":"degrees","requires":["icon-image"],"expression":{"interpolated":true,"parameters":["zoom","feature"]},"property-type":"data-driven"},"icon-padding":{"type":"number","default":2,"minimum":0,"units":"pixels","requires":["icon-image"],"expression":{"interpolated":true,"parameters":["zoom"]},"property-type":"data-constant"},"icon-keep-upright":{"type":"boolean","default":false,"requires":["icon-image",{"icon-rotation-alignment":"map"},{"symbol-placement":["line","line-center"]}],"expression":{"interpolated":false,"parameters":["zoom"]},"property-type":"data-constant"},"icon-offset":{"type":"array","value":"number","length":2,"default":[0,0],"requires":["icon-image"],"expression":{"interpolated":true,"parameters":["zoom","feature"]},"property-type":"data-driven"},"icon-anchor":{"type":"enum","values":{"center":{},"left":{},"right":{},"top":{},"bottom":{},"top-left":{},"top-right":{},"bottom-left":{},"bottom-right":{}},"default":"center","requires":["icon-image"],"expression":{"interpolated":false,"parameters":["zoom","feature"]},"property-type":"data-driven"},"icon-pitch-alignment":{"type":"enum","values":{"map":{},"viewport":{},"auto":{}},"default":"auto","requires":["icon-image"],"expression":{"interpolated":false,"parameters":["zoom"]},"property-type":"data-constant"},"text-pitch-alignment":{"type":"enum","values":{"map":{},"viewport":{},"auto":{}},"default":"auto","requires":["text-field"],"expression":{"interpolated":false,"parameters":["zoom"]},"property-type":"data-constant"},"text-rotation-alignment":{"type":"enum","values":{"map":{},"viewport":{},"auto":{}},"default":"auto","requires":["text-field"],"expression":{"interpolated":false,"parameters":["zoom"]},"property-type":"data-constant"},"text-field":{"type":"formatted","default":"","tokens":true,"expression":{"interpolated":false,"parameters":["zoom","feature"]},"property-type":"data-driven"},"text-font":{"type":"array","value":"string","default":["Open Sans Regular","Arial Unicode MS Regular"],"requires":["text-field"],"expression":{"interpolated":false,"parameters":["zoom","feature"]},"property-type":"data-driven"},"text-size":{"type":"number","default":16,"minimum":0,"units":"pixels","requires":["text-field"],"expression":{"interpolated":true,"parameters":["zoom","feature"]},"property-type":"data-driven"},"text-max-width":{"type":"number","default":10,"minimum":0,"units":"ems","requires":["text-field",{"symbol-placement":["point"]}],"expression":{"interpolated":true,"parameters":["zoom","feature"]},"property-type":"data-driven"},"text-line-height":{"type":"number","default":1.2,"units":"ems","requires":["text-field"],"expression":{"interpolated":true,"parameters":["zoom","feature"]},"property-type":"data-driven"},"text-letter-spacing":{"type":"number","default":0,"units":"ems","requires":["text-field"],"expression":{"interpolated":true,"parameters":["zoom","feature"]},"property-type":"data-driven"},"text-justify":{"type":"enum","values":{"auto":{},"left":{},"center":{},"right":{}},"default":"center","requires":["text-field"],"expression":{"interpolated":false,"parameters":["zoom","feature"]},"property-type":"data-driven"},"text-radial-offset":{"type":"number","units":"ems","default":0,"requires":["text-field"],"property-type":"data-driven","expression":{"interpolated":true,"parameters":["zoom","feature"]}},"text-variable-anchor":{"type":"array","value":"enum","values":{"center":{},"left":{},"right":{},"top":{},"bottom":{},"top-left":{},"top-right":{},"bottom-left":{},"bottom-right":{}},"requires":["text-field",{"symbol-placement":["point"]}],"expression":{"interpolated":false,"parameters":["zoom"]},"property-type":"data-constant"},"text-anchor":{"type":"enum","values":{"center":{},"left":{},"right":{},"top":{},"bottom":{},"top-left":{},"top-right":{},"bottom-left":{},"bottom-right":{}},"default":"center","requires":["text-field",{"!":"text-variable-anchor"}],"expression":{"interpolated":false,"parameters":["zoom","feature"]},"property-type":"data-driven"},"text-max-angle":{"type":"number","default":45,"units":"degrees","requires":["text-field",{"symbol-placement":["line","line-center"]}],"expression":{"interpolated":true,"parameters":["zoom"]},"property-type":"data-constant"},"text-writing-mode":{"type":"array","value":"enum","values":{"horizontal":{},"vertical":{}},"requires":["text-field"],"expression":{"interpolated":false,"parameters":["zoom"]},"property-type":"data-constant"},"text-rotate":{"type":"number","default":0,"period":360,"units":"degrees","requires":["text-field"],"expression":{"interpolated":true,"parameters":["zoom","feature"]},"property-type":"data-driven"},"text-padding":{"type":"number","default":2,"minimum":0,"units":"pixels","requires":["text-field"],"expression":{"interpolated":true,"parameters":["zoom"]},"property-type":"data-constant"},"text-keep-upright":{"type":"boolean","default":true,"requires":["text-field",{"text-rotation-alignment":"map"},{"symbol-placement":["line","line-center"]}],"expression":{"interpolated":false,"parameters":["zoom"]},"property-type":"data-constant"},"text-transform":{"type":"enum","values":{"none":{},"uppercase":{},"lowercase":{}},"default":"none","requires":["text-field"],"expression":{"interpolated":false,"parameters":["zoom","feature"]},"property-type":"data-driven"},"text-offset":{"type":"array","value":"number","units":"ems","length":2,"default":[0,0],"requires":["text-field",{"!":"text-radial-offset"}],"expression":{"interpolated":true,"parameters":["zoom","feature"]},"property-type":"data-driven"},"text-allow-overlap":{"type":"boolean","default":false,"requires":["text-field"],"expression":{"interpolated":false,"parameters":["zoom"]},"property-type":"data-constant"},"text-ignore-placement":{"type":"boolean","default":false,"requires":["text-field"],"expression":{"interpolated":false,"parameters":["zoom"]},"property-type":"data-constant"},"text-optional":{"type":"boolean","default":false,"requires":["text-field","icon-image"],"expression":{"interpolated":false,"parameters":["zoom"]},"property-type":"data-constant"},"visibility":{"type":"enum","values":{"visible":{},"none":{}},"default":"visible","property-type":"constant"}},"layout_raster":{"visibility":{"type":"enum","values":{"visible":{},"none":{}},"default":"visible","property-type":"constant"}},"layout_hillshade":{"visibility":{"type":"enum","values":{"visible":{},"none":{}},"default":"visible","property-type":"constant"}},"filter":{"type":"array","value":"*"},"filter_symbol":{"type":"boolean","default":false,"transition":false,"property-type":"data-driven","expression":{"interpolated":false,"parameters":["zoom","feature","pitch","distance-from-center"]}},"filter_fill":{"type":"boolean","default":false,"transition":false,"property-type":"data-driven","expression":{"interpolated":false,"parameters":["zoom","feature"]}},"filter_line":{"type":"boolean","default":false,"transition":false,"property-type":"data-driven","expression":{"interpolated":false,"parameters":["zoom","feature"]}},"filter_circle":{"type":"boolean","default":false,"transition":false,"property-type":"data-driven","expression":{"interpolated":false,"parameters":["zoom","feature"]}},"filter_fill-extrusion":{"type":"boolean","default":false,"transition":false,"property-type":"data-driven","expression":{"interpolated":false,"parameters":["zoom","feature"]}},"filter_heatmap":{"type":"boolean","default":false,"transition":false,"property-type":"data-driven","expression":{"interpolated":false,"parameters":["zoom","feature"]}},"filter_operator":{"type":"enum","values":{"==":{},"!=":{},">":{},">=":{},"<":{},"<=":{},"in":{},"!in":{},"all":{},"any":{},"none":{},"has":{},"!has":{},"within":{}}},"geometry_type":{"type":"enum","values":{"Point":{},"LineString":{},"Polygon":{}}},"function":{"expression":{"type":"expression"},"stops":{"type":"array","value":"function_stop"},"base":{"type":"number","default":1,"minimum":0},"property":{"type":"string","default":"$zoom"},"type":{"type":"enum","values":{"identity":{},"exponential":{},"interval":{},"categorical":{}},"default":"exponential"},"colorSpace":{"type":"enum","values":{"rgb":{},"lab":{},"hcl":{}},"default":"rgb"},"default":{"type":"*","required":false}},"function_stop":{"type":"array","minimum":0,"maximum":24,"value":["number","color"],"length":2},"expression":{"type":"array","value":"*","minimum":1},"fog":{"range":{"type":"array","default":[0.5,10],"minimum":-20,"maximum":20,"length":2,"value":"number","property-type":"data-constant","transition":true,"expression":{"interpolated":true,"parameters":["zoom"]}},"color":{"type":"color","property-type":"data-constant","default":"#ffffff","expression":{"interpolated":true,"parameters":["zoom"]},"transition":true},"high-color":{"type":"color","property-type":"data-constant","default":"#245cdf","expression":{"interpolated":true,"parameters":["zoom"]},"transition":true},"space-color":{"type":"color","property-type":"data-constant","default":["interpolate",["linear"],["zoom"],4,"#010b19",7,"#367ab9"],"expression":{"interpolated":true,"parameters":["zoom"]},"transition":true},"horizon-blend":{"type":"number","property-type":"data-constant","default":["interpolate",["linear"],["zoom"],4,0.2,7,0.1],"minimum":0,"maximum":1,"expression":{"interpolated":true,"parameters":["zoom"]},"transition":true},"star-intensity":{"type":"number","property-type":"data-constant","default":["interpolate",["linear"],["zoom"],5,0.35,6,0],"minimum":0,"maximum":1,"expression":{"interpolated":true,"parameters":["zoom"]},"transition":true}},"light":{"anchor":{"type":"enum","default":"viewport","values":{"map":{},"viewport":{}},"property-type":"data-constant","transition":false,"expression":{"interpolated":false,"parameters":["zoom"]}},"position":{"type":"array","default":[1.15,210,30],"length":3,"value":"number","property-type":"data-constant","transition":true,"expression":{"interpolated":true,"parameters":["zoom"]}},"color":{"type":"color","property-type":"data-constant","default":"#ffffff","expression":{"interpolated":true,"parameters":["zoom"]},"transition":true},"intensity":{"type":"number","property-type":"data-constant","default":0.5,"minimum":0,"maximum":1,"expression":{"interpolated":true,"parameters":["zoom"]},"transition":true}},"projection":{"name":{"type":"enum","values":{"albers":{},"equalEarth":{},"equirectangular":{},"lambertConformalConic":{},"mercator":{},"naturalEarth":{},"winkelTripel":{},"globe":{}},"default":"mercator","required":true},"center":{"type":"array","length":2,"value":"number","property-type":"data-constant","minimum":[-180,-90],"maximum":[180,90],"transition":false,"requires":[{"name":["albers","lambertConformalConic"]}]},"parallels":{"type":"array","length":2,"value":"number","property-type":"data-constant","minimum":[-90,-90],"maximum":[90,90],"transition":false,"requires":[{"name":["albers","lambertConformalConic"]}]}},"terrain":{"source":{"type":"string","required":true},"exaggeration":{"type":"number","property-type":"data-constant","default":1,"minimum":0,"maximum":1000,"expression":{"interpolated":true,"parameters":["zoom"]},"transition":true,"requires":["source"]}},"paint":["paint_fill","paint_line","paint_circle","paint_heatmap","paint_fill-extrusion","paint_symbol","paint_raster","paint_hillshade","paint_background","paint_sky"],"paint_fill":{"fill-antialias":{"type":"boolean","default":true,"expression":{"interpolated":false,"parameters":["zoom"]},"property-type":"data-constant"},"fill-opacity":{"type":"number","default":1,"minimum":0,"maximum":1,"transition":true,"expression":{"interpolated":true,"parameters":["zoom","feature","feature-state"]},"property-type":"data-driven"},"fill-color":{"type":"color","default":"#000000","transition":true,"requires":[{"!":"fill-pattern"}],"expression":{"interpolated":true,"parameters":["zoom","feature","feature-state"]},"property-type":"data-driven"},"fill-outline-color":{"type":"color","transition":true,"requires":[{"!":"fill-pattern"},{"fill-antialias":true}],"expression":{"interpolated":true,"parameters":["zoom","feature","feature-state"]},"property-type":"data-driven"},"fill-translate":{"type":"array","value":"number","length":2,"default":[0,0],"transition":true,"units":"pixels","expression":{"interpolated":true,"parameters":["zoom"]},"property-type":"data-constant"},"fill-translate-anchor":{"type":"enum","values":{"map":{},"viewport":{}},"default":"map","requires":["fill-translate"],"expression":{"interpolated":false,"parameters":["zoom"]},"property-type":"data-constant"},"fill-pattern":{"type":"resolvedImage","transition":false,"expression":{"interpolated":false,"parameters":["zoom","feature"]},"property-type":"data-driven"}},"paint_fill-extrusion":{"fill-extrusion-opacity":{"type":"number","default":1,"minimum":0,"maximum":1,"transition":true,"expression":{"interpolated":true,"parameters":["zoom"]},"property-type":"data-constant"},"fill-extrusion-color":{"type":"color","default":"#000000","transition":true,"requires":[{"!":"fill-extrusion-pattern"}],"expression":{"interpolated":true,"parameters":["zoom","feature","feature-state"]},"property-type":"data-driven"},"fill-extrusion-translate":{"type":"array","value":"number","length":2,"default":[0,0],"transition":true,"units":"pixels","expression":{"interpolated":true,"parameters":["zoom"]},"property-type":"data-constant"},"fill-extrusion-translate-anchor":{"type":"enum","values":{"map":{},"viewport":{}},"default":"map","requires":["fill-extrusion-translate"],"expression":{"interpolated":false,"parameters":["zoom"]},"property-type":"data-constant"},"fill-extrusion-pattern":{"type":"resolvedImage","transition":false,"expression":{"interpolated":false,"parameters":["zoom","feature"]},"property-type":"data-driven"},"fill-extrusion-height":{"type":"number","default":0,"minimum":0,"units":"meters","transition":true,"expression":{"interpolated":true,"parameters":["zoom","feature","feature-state"]},"property-type":"data-driven"},"fill-extrusion-base":{"type":"number","default":0,"minimum":0,"units":"meters","transition":true,"requires":["fill-extrusion-height"],"expression":{"interpolated":true,"parameters":["zoom","feature","feature-state"]},"property-type":"data-driven"},"fill-extrusion-vertical-gradient":{"type":"boolean","default":true,"transition":false,"expression":{"interpolated":false,"parameters":["zoom"]},"property-type":"data-constant"},"fill-extrusion-ambient-occlusion-intensity":{"property-type":"data-constant","type":"number","private":true,"default":0,"minimum":0,"maximum":1,"expression":{"interpolated":true,"parameters":["zoom"]},"transition":true},"fill-extrusion-ambient-occlusion-radius":{"property-type":"data-constant","type":"number","private":true,"default":3,"minimum":0,"expression":{"interpolated":true,"parameters":["zoom"]},"transition":true,"requires":["fill-extrusion-edge-radius"]},"fill-extrusion-rounded-roof":{"type":"boolean","default":true,"requires":["fill-extrusion-edge-radius"],"transition":false,"expression":{"interpolated":false,"parameters":["zoom"]},"property-type":"data-constant"}},"paint_line":{"line-opacity":{"type":"number","default":1,"minimum":0,"maximum":1,"transition":true,"expression":{"interpolated":true,"parameters":["zoom","feature","feature-state"]},"property-type":"data-driven"},"line-color":{"type":"color","default":"#000000","transition":true,"requires":[{"!":"line-pattern"}],"expression":{"interpolated":true,"parameters":["zoom","feature","feature-state"]},"property-type":"data-driven"},"line-translate":{"type":"array","value":"number","length":2,"default":[0,0],"transition":true,"units":"pixels","expression":{"interpolated":true,"parameters":["zoom"]},"property-type":"data-constant"},"line-translate-anchor":{"type":"enum","values":{"map":{},"viewport":{}},"default":"map","requires":["line-translate"],"expression":{"interpolated":false,"parameters":["zoom"]},"property-type":"data-constant"},"line-width":{"type":"number","default":1,"minimum":0,"transition":true,"units":"pixels","expression":{"interpolated":true,"parameters":["zoom","feature","feature-state"]},"property-type":"data-driven"},"line-gap-width":{"type":"number","default":0,"minimum":0,"transition":true,"units":"pixels","expression":{"interpolated":true,"parameters":["zoom","feature","feature-state"]},"property-type":"data-driven"},"line-offset":{"type":"number","default":0,"transition":true,"units":"pixels","expression":{"interpolated":true,"parameters":["zoom","feature","feature-state"]},"property-type":"data-driven"},"line-blur":{"type":"number","default":0,"minimum":0,"transition":true,"units":"pixels","expression":{"interpolated":true,"parameters":["zoom","feature","feature-state"]},"property-type":"data-driven"},"line-dasharray":{"type":"array","value":"number","minimum":0,"transition":false,"units":"line widths","requires":[{"!":"line-pattern"}],"expression":{"interpolated":false,"parameters":["zoom","feature"]},"property-type":"data-driven"},"line-pattern":{"type":"resolvedImage","transition":false,"expression":{"interpolated":false,"parameters":["zoom","feature"]},"property-type":"data-driven"},"line-gradient":{"type":"color","transition":false,"requires":[{"!":"line-pattern"},{"source":"geojson","has":{"lineMetrics":true}}],"expression":{"interpolated":true,"parameters":["line-progress"]},"property-type":"color-ramp"},"line-trim-offset":{"type":"array","value":"number","length":2,"default":[0,0],"minimum":[0,0],"maximum":[1,1],"transition":false,"requires":[{"source":"geojson","has":{"lineMetrics":true}}],"property-type":"constant"}},"paint_circle":{"circle-radius":{"type":"number","default":5,"minimum":0,"transition":true,"units":"pixels","expression":{"interpolated":true,"parameters":["zoom","feature","feature-state"]},"property-type":"data-driven"},"circle-color":{"type":"color","default":"#000000","transition":true,"expression":{"interpolated":true,"parameters":["zoom","feature","feature-state"]},"property-type":"data-driven"},"circle-blur":{"type":"number","default":0,"transition":true,"expression":{"interpolated":true,"parameters":["zoom","feature","feature-state"]},"property-type":"data-driven"},"circle-opacity":{"type":"number","default":1,"minimum":0,"maximum":1,"transition":true,"expression":{"interpolated":true,"parameters":["zoom","feature","feature-state"]},"property-type":"data-driven"},"circle-translate":{"type":"array","value":"number","length":2,"default":[0,0],"transition":true,"units":"pixels","expression":{"interpolated":true,"parameters":["zoom"]},"property-type":"data-constant"},"circle-translate-anchor":{"type":"enum","values":{"map":{},"viewport":{}},"default":"map","requires":["circle-translate"],"expression":{"interpolated":false,"parameters":["zoom"]},"property-type":"data-constant"},"circle-pitch-scale":{"type":"enum","values":{"map":{},"viewport":{}},"default":"map","expression":{"interpolated":false,"parameters":["zoom"]},"property-type":"data-constant"},"circle-pitch-alignment":{"type":"enum","values":{"map":{},"viewport":{}},"default":"viewport","expression":{"interpolated":false,"parameters":["zoom"]},"property-type":"data-constant"},"circle-stroke-width":{"type":"number","default":0,"minimum":0,"transition":true,"units":"pixels","expression":{"interpolated":true,"parameters":["zoom","feature","feature-state"]},"property-type":"data-driven"},"circle-stroke-color":{"type":"color","default":"#000000","transition":true,"expression":{"interpolated":true,"parameters":["zoom","feature","feature-state"]},"property-type":"data-driven"},"circle-stroke-opacity":{"type":"number","default":1,"minimum":0,"maximum":1,"transition":true,"expression":{"interpolated":true,"parameters":["zoom","feature","feature-state"]},"property-type":"data-driven"}},"paint_heatmap":{"heatmap-radius":{"type":"number","default":30,"minimum":1,"transition":true,"units":"pixels","expression":{"interpolated":true,"parameters":["zoom","feature","feature-state"]},"property-type":"data-driven"},"heatmap-weight":{"type":"number","default":1,"minimum":0,"transition":false,"expression":{"interpolated":true,"parameters":["zoom","feature","feature-state"]},"property-type":"data-driven"},"heatmap-intensity":{"type":"number","default":1,"minimum":0,"transition":true,"expression":{"interpolated":true,"parameters":["zoom"]},"property-type":"data-constant"},"heatmap-color":{"type":"color","default":["interpolate",["linear"],["heatmap-density"],0,"rgba(0, 0, 255, 0)",0.1,"royalblue",0.3,"cyan",0.5,"lime",0.7,"yellow",1,"red"],"transition":false,"expression":{"interpolated":true,"parameters":["heatmap-density"]},"property-type":"color-ramp"},"heatmap-opacity":{"type":"number","default":1,"minimum":0,"maximum":1,"transition":true,"expression":{"interpolated":true,"parameters":["zoom"]},"property-type":"data-constant"}},"paint_symbol":{"icon-opacity":{"type":"number","default":1,"minimum":0,"maximum":1,"transition":true,"requires":["icon-image"],"expression":{"interpolated":true,"parameters":["zoom","feature","feature-state"]},"property-type":"data-driven"},"icon-color":{"type":"color","default":"#000000","transition":true,"requires":["icon-image"],"expression":{"interpolated":true,"parameters":["zoom","feature","feature-state"]},"property-type":"data-driven"},"icon-halo-color":{"type":"color","default":"rgba(0, 0, 0, 0)","transition":true,"requires":["icon-image"],"expression":{"interpolated":true,"parameters":["zoom","feature","feature-state"]},"property-type":"data-driven"},"icon-halo-width":{"type":"number","default":0,"minimum":0,"transition":true,"units":"pixels","requires":["icon-image"],"expression":{"interpolated":true,"parameters":["zoom","feature","feature-state"]},"property-type":"data-driven"},"icon-halo-blur":{"type":"number","default":0,"minimum":0,"transition":true,"units":"pixels","requires":["icon-image"],"expression":{"interpolated":true,"parameters":["zoom","feature","feature-state"]},"property-type":"data-driven"},"icon-translate":{"type":"array","value":"number","length":2,"default":[0,0],"transition":true,"units":"pixels","requires":["icon-image"],"expression":{"interpolated":true,"parameters":["zoom"]},"property-type":"data-constant"},"icon-translate-anchor":{"type":"enum","values":{"map":{},"viewport":{}},"default":"map","requires":["icon-image","icon-translate"],"expression":{"interpolated":false,"parameters":["zoom"]},"property-type":"data-constant"},"text-opacity":{"type":"number","default":1,"minimum":0,"maximum":1,"transition":true,"requires":["text-field"],"expression":{"interpolated":true,"parameters":["zoom","feature","feature-state"]},"property-type":"data-driven"},"text-color":{"type":"color","default":"#000000","transition":true,"overridable":true,"requires":["text-field"],"expression":{"interpolated":true,"parameters":["zoom","feature","feature-state"]},"property-type":"data-driven"},"text-halo-color":{"type":"color","default":"rgba(0, 0, 0, 0)","transition":true,"requires":["text-field"],"expression":{"interpolated":true,"parameters":["zoom","feature","feature-state"]},"property-type":"data-driven"},"text-halo-width":{"type":"number","default":0,"minimum":0,"transition":true,"units":"pixels","requires":["text-field"],"expression":{"interpolated":true,"parameters":["zoom","feature","feature-state"]},"property-type":"data-driven"},"text-halo-blur":{"type":"number","default":0,"minimum":0,"transition":true,"units":"pixels","requires":["text-field"],"expression":{"interpolated":true,"parameters":["zoom","feature","feature-state"]},"property-type":"data-driven"},"text-translate":{"type":"array","value":"number","length":2,"default":[0,0],"transition":true,"units":"pixels","requires":["text-field"],"expression":{"interpolated":true,"parameters":["zoom"]},"property-type":"data-constant"},"text-translate-anchor":{"type":"enum","values":{"map":{},"viewport":{}},"default":"map","requires":["text-field","text-translate"],"expression":{"interpolated":false,"parameters":["zoom"]},"property-type":"data-constant"}},"paint_raster":{"raster-opacity":{"type":"number","default":1,"minimum":0,"maximum":1,"transition":true,"expression":{"interpolated":true,"parameters":["zoom"]},"property-type":"data-constant"},"raster-hue-rotate":{"type":"number","default":0,"period":360,"transition":true,"units":"degrees","expression":{"interpolated":true,"parameters":["zoom"]},"property-type":"data-constant"},"raster-brightness-min":{"type":"number","default":0,"minimum":0,"maximum":1,"transition":true,"expression":{"interpolated":true,"parameters":["zoom"]},"property-type":"data-constant"},"raster-brightness-max":{"type":"number","default":1,"minimum":0,"maximum":1,"transition":true,"expression":{"interpolated":true,"parameters":["zoom"]},"property-type":"data-constant"},"raster-saturation":{"type":"number","default":0,"minimum":-1,"maximum":1,"transition":true,"expression":{"interpolated":true,"parameters":["zoom"]},"property-type":"data-constant"},"raster-contrast":{"type":"number","default":0,"minimum":-1,"maximum":1,"transition":true,"expression":{"interpolated":true,"parameters":["zoom"]},"property-type":"data-constant"},"raster-resampling":{"type":"enum","values":{"linear":{},"nearest":{}},"default":"linear","expression":{"interpolated":false,"parameters":["zoom"]},"property-type":"data-constant"},"raster-fade-duration":{"type":"number","default":300,"minimum":0,"transition":false,"units":"milliseconds","expression":{"interpolated":true,"parameters":["zoom"]},"property-type":"data-constant"}},"paint_hillshade":{"hillshade-illumination-direction":{"type":"number","default":335,"minimum":0,"maximum":359,"transition":false,"expression":{"interpolated":true,"parameters":["zoom"]},"property-type":"data-constant"},"hillshade-illumination-anchor":{"type":"enum","values":{"map":{},"viewport":{}},"default":"viewport","expression":{"interpolated":false,"parameters":["zoom"]},"property-type":"data-constant"},"hillshade-exaggeration":{"type":"number","default":0.5,"minimum":0,"maximum":1,"transition":true,"expression":{"interpolated":true,"parameters":["zoom"]},"property-type":"data-constant"},"hillshade-shadow-color":{"type":"color","default":"#000000","transition":true,"expression":{"interpolated":true,"parameters":["zoom"]},"property-type":"data-constant"},"hillshade-highlight-color":{"type":"color","default":"#FFFFFF","transition":true,"expression":{"interpolated":true,"parameters":["zoom"]},"property-type":"data-constant"},"hillshade-accent-color":{"type":"color","default":"#000000","transition":true,"expression":{"interpolated":true,"parameters":["zoom"]},"property-type":"data-constant"}},"paint_background":{"background-color":{"type":"color","default":"#000000","transition":true,"requires":[{"!":"background-pattern"}],"expression":{"interpolated":true,"parameters":["zoom"]},"property-type":"data-constant"},"background-pattern":{"type":"resolvedImage","transition":false,"expression":{"interpolated":false,"parameters":["zoom"]},"property-type":"data-constant"},"background-opacity":{"type":"number","default":1,"minimum":0,"maximum":1,"transition":true,"expression":{"interpolated":true,"parameters":["zoom"]},"property-type":"data-constant"}},"paint_sky":{"sky-type":{"type":"enum","values":{"gradient":{},"atmosphere":{}},"default":"atmosphere","expression":{"interpolated":false,"parameters":["zoom"]},"property-type":"data-constant"},"sky-atmosphere-sun":{"type":"array","value":"number","length":2,"units":"degrees","minimum":[0,0],"maximum":[360,180],"transition":false,"requires":[{"sky-type":"atmosphere"}],"expression":{"interpolated":false,"parameters":["zoom"]},"property-type":"data-constant"},"sky-atmosphere-sun-intensity":{"type":"number","requires":[{"sky-type":"atmosphere"}],"default":10,"minimum":0,"maximum":100,"transition":false,"property-type":"data-constant"},"sky-gradient-center":{"type":"array","requires":[{"sky-type":"gradient"}],"value":"number","default":[0,0],"length":2,"units":"degrees","minimum":[0,0],"maximum":[360,180],"transition":false,"expression":{"interpolated":false,"parameters":["zoom"]},"property-type":"data-constant"},"sky-gradient-radius":{"type":"number","requires":[{"sky-type":"gradient"}],"default":90,"minimum":0,"maximum":180,"transition":false,"expression":{"interpolated":false,"parameters":["zoom"]},"property-type":"data-constant"},"sky-gradient":{"type":"color","default":["interpolate",["linear"],["sky-radial-progress"],0.8,"#87ceeb",1,"white"],"transition":false,"requires":[{"sky-type":"gradient"}],"expression":{"interpolated":true,"parameters":["sky-radial-progress"]},"property-type":"color-ramp"},"sky-atmosphere-halo-color":{"type":"color","default":"white","transition":false,"requires":[{"sky-type":"atmosphere"}],"property-type":"data-constant"},"sky-atmosphere-color":{"type":"color","default":"white","transition":false,"requires":[{"sky-type":"atmosphere"}],"property-type":"data-constant"},"sky-opacity":{"type":"number","default":1,"minimum":0,"maximum":1,"transition":true,"expression":{"interpolated":true,"parameters":["zoom"]},"property-type":"data-constant"}},"transition":{"duration":{"type":"number","default":300,"minimum":0,"units":"milliseconds"},"delay":{"type":"number","default":0,"minimum":0,"units":"milliseconds"}},"property-type":{"data-driven":{"type":"property-type"},"color-ramp":{"type":"property-type"},"data-constant":{"type":"property-type"},"constant":{"type":"property-type"}},"promoteId":{"*":{"type":"string"}}}');function ee(t,...e){for(const r of e)for(const e in r)t[e]=r[e];return t}function re(t){return t instanceof Number||t instanceof String||t instanceof Boolean?t.valueOf():t}function ne(t){if(Array.isArray(t))return t.map(ne);if(t instanceof Object&&!(t instanceof Number||t instanceof String||t instanceof Boolean)){const e={};for(const r in t)e[r]=ne(t[r]);return e}return re(t)}class ie extends Error{constructor(t,e){super(e),this.message=e,this.key=t;}}var se=ie;class ae{constructor(t,e=[]){this.parent=t,this.bindings={};for(const[t,r]of e)this.bindings[t]=r;}concat(t){return new ae(this,t)}get(t){if(this.bindings[t])return this.bindings[t];if(this.parent)return this.parent.get(t);throw new Error(`${t} not found in scope.`)}has(t){return !!this.bindings[t]||!!this.parent&&this.parent.has(t)}}var oe=ae;const le={kind:"null"},ue={kind:"number"},ce={kind:"string"},he={kind:"boolean"},pe={kind:"color"},de={kind:"object"},fe={kind:"value"},ye={kind:"collator"},me={kind:"formatted"},ge={kind:"resolvedImage"};function xe(t,e){return {kind:"array",itemType:t,N:e}}function ve(t){if("array"===t.kind){const e=ve(t.itemType);return "number"==typeof t.N?`array<${e}, ${t.N}>`:"value"===t.itemType.kind?"array":`array<${e}>`}return t.kind}const be=[le,ue,ce,he,pe,me,de,xe(fe),ge];function we(t,e){if("error"===e.kind)return null;if("array"===t.kind){if("array"===e.kind&&(0===e.N&&"value"===e.itemType.kind||!we(t.itemType,e.itemType))&&("number"!=typeof t.N||t.N===e.N))return null}else {if(t.kind===e.kind)return null;if("value"===t.kind)for(const t of be)if(!we(t,e))return null}return `Expected ${ve(t)} but found ${ve(e)} instead.`}function _e(t,e){return e.some((e=>e.kind===t.kind))}function Ae(t,e){return e.some((e=>"null"===e?null===t:"array"===e?Array.isArray(t):"object"===e?t&&!Array.isArray(t)&&"object"==typeof t:e===typeof t))}var Se,ke={transparent:[0,0,0,0],aliceblue:[240,248,255,1],antiquewhite:[250,235,215,1],aqua:[0,255,255,1],aquamarine:[127,255,212,1],azure:[240,255,255,1],beige:[245,245,220,1],bisque:[255,228,196,1],black:[0,0,0,1],blanchedalmond:[255,235,205,1],blue:[0,0,255,1],blueviolet:[138,43,226,1],brown:[165,42,42,1],burlywood:[222,184,135,1],cadetblue:[95,158,160,1],chartreuse:[127,255,0,1],chocolate:[210,105,30,1],coral:[255,127,80,1],cornflowerblue:[100,149,237,1],cornsilk:[255,248,220,1],crimson:[220,20,60,1],cyan:[0,255,255,1],darkblue:[0,0,139,1],darkcyan:[0,139,139,1],darkgoldenrod:[184,134,11,1],darkgray:[169,169,169,1],darkgreen:[0,100,0,1],darkgrey:[169,169,169,1],darkkhaki:[189,183,107,1],darkmagenta:[139,0,139,1],darkolivegreen:[85,107,47,1],darkorange:[255,140,0,1],darkorchid:[153,50,204,1],darkred:[139,0,0,1],darksalmon:[233,150,122,1],darkseagreen:[143,188,143,1],darkslateblue:[72,61,139,1],darkslategray:[47,79,79,1],darkslategrey:[47,79,79,1],darkturquoise:[0,206,209,1],darkviolet:[148,0,211,1],deeppink:[255,20,147,1],deepskyblue:[0,191,255,1],dimgray:[105,105,105,1],dimgrey:[105,105,105,1],dodgerblue:[30,144,255,1],firebrick:[178,34,34,1],floralwhite:[255,250,240,1],forestgreen:[34,139,34,1],fuchsia:[255,0,255,1],gainsboro:[220,220,220,1],ghostwhite:[248,248,255,1],gold:[255,215,0,1],goldenrod:[218,165,32,1],gray:[128,128,128,1],green:[0,128,0,1],greenyellow:[173,255,47,1],grey:[128,128,128,1],honeydew:[240,255,240,1],hotpink:[255,105,180,1],indianred:[205,92,92,1],indigo:[75,0,130,1],ivory:[255,255,240,1],khaki:[240,230,140,1],lavender:[230,230,250,1],lavenderblush:[255,240,245,1],lawngreen:[124,252,0,1],lemonchiffon:[255,250,205,1],lightblue:[173,216,230,1],lightcoral:[240,128,128,1],lightcyan:[224,255,255,1],lightgoldenrodyellow:[250,250,210,1],lightgray:[211,211,211,1],lightgreen:[144,238,144,1],lightgrey:[211,211,211,1],lightpink:[255,182,193,1],lightsalmon:[255,160,122,1],lightseagreen:[32,178,170,1],lightskyblue:[135,206,250,1],lightslategray:[119,136,153,1],lightslategrey:[119,136,153,1],lightsteelblue:[176,196,222,1],lightyellow:[255,255,224,1],lime:[0,255,0,1],limegreen:[50,205,50,1],linen:[250,240,230,1],magenta:[255,0,255,1],maroon:[128,0,0,1],mediumaquamarine:[102,205,170,1],mediumblue:[0,0,205,1],mediumorchid:[186,85,211,1],mediumpurple:[147,112,219,1],mediumseagreen:[60,179,113,1],mediumslateblue:[123,104,238,1],mediumspringgreen:[0,250,154,1],mediumturquoise:[72,209,204,1],mediumvioletred:[199,21,133,1],midnightblue:[25,25,112,1],mintcream:[245,255,250,1],mistyrose:[255,228,225,1],moccasin:[255,228,181,1],navajowhite:[255,222,173,1],navy:[0,0,128,1],oldlace:[253,245,230,1],olive:[128,128,0,1],olivedrab:[107,142,35,1],orange:[255,165,0,1],orangered:[255,69,0,1],orchid:[218,112,214,1],palegoldenrod:[238,232,170,1],palegreen:[152,251,152,1],paleturquoise:[175,238,238,1],palevioletred:[219,112,147,1],papayawhip:[255,239,213,1],peachpuff:[255,218,185,1],peru:[205,133,63,1],pink:[255,192,203,1],plum:[221,160,221,1],powderblue:[176,224,230,1],purple:[128,0,128,1],rebeccapurple:[102,51,153,1],red:[255,0,0,1],rosybrown:[188,143,143,1],royalblue:[65,105,225,1],saddlebrown:[139,69,19,1],salmon:[250,128,114,1],sandybrown:[244,164,96,1],seagreen:[46,139,87,1],seashell:[255,245,238,1],sienna:[160,82,45,1],silver:[192,192,192,1],skyblue:[135,206,235,1],slateblue:[106,90,205,1],slategray:[112,128,144,1],slategrey:[112,128,144,1],snow:[255,250,250,1],springgreen:[0,255,127,1],steelblue:[70,130,180,1],tan:[210,180,140,1],teal:[0,128,128,1],thistle:[216,191,216,1],tomato:[255,99,71,1],turquoise:[64,224,208,1],violet:[238,130,238,1],wheat:[245,222,179,1],white:[255,255,255,1],whitesmoke:[245,245,245,1],yellow:[255,255,0,1],yellowgreen:[154,205,50,1]};function Ie(t){return (t=Math.round(t))<0?0:t>255?255:t}function Me(t){return Ie("%"===t[t.length-1]?parseFloat(t)/100*255:parseInt(t))}function Te(t){return (e="%"===t[t.length-1]?parseFloat(t)/100:parseFloat(t))<0?0:e>1?1:e;var e;}function ze(t,e,r){return r<0?r+=1:r>1&&(r-=1),6*r<1?t+(e-t)*r*6:2*r<1?e:3*r<2?t+(e-t)*(2/3-r)*6:t}try{Se={}.parseCSSColor=function(t){var e,r=t.replace(/ /g,"").toLowerCase();if(r in ke)return ke[r].slice();if("#"===r[0])return 4===r.length?(e=parseInt(r.substr(1),16))>=0&&e<=4095?[(3840&e)>>4|(3840&e)>>8,240&e|(240&e)>>4,15&e|(15&e)<<4,1]:null:7===r.length&&(e=parseInt(r.substr(1),16))>=0&&e<=16777215?[(16711680&e)>>16,(65280&e)>>8,255&e,1]:null;var n=r.indexOf("("),i=r.indexOf(")");if(-1!==n&&i+1===r.length){var s=r.substr(0,n),a=r.substr(n+1,i-(n+1)).split(","),o=1;switch(s){case"rgba":if(4!==a.length)return null;o=Te(a.pop());case"rgb":return 3!==a.length?null:[Me(a[0]),Me(a[1]),Me(a[2]),o];case"hsla":if(4!==a.length)return null;o=Te(a.pop());case"hsl":if(3!==a.length)return null;var l=(parseFloat(a[0])%360+360)%360/360,u=Te(a[1]),c=Te(a[2]),h=c<=.5?c*(u+1):c+u-c*u,p=2*c-h;return [Ie(255*ze(p,h,l+1/3)),Ie(255*ze(p,h,l)),Ie(255*ze(p,h,l-1/3)),o];default:return null}}return null};}catch(t){}class Be{constructor(t,e,r,n=1){this.r=t,this.g=e,this.b=r,this.a=n;}static parse(t){if(!t)return;if(t instanceof Be)return t;if("string"!=typeof t)return;const e=Se(t);return e?new Be(e[0]/255*e[3],e[1]/255*e[3],e[2]/255*e[3],e[3]):void 0}toString(){const[t,e,r,n]=this.toArray();return `rgba(${Math.round(t)},${Math.round(e)},${Math.round(r)},${n})`}toArray(){const{r:t,g:e,b:r,a:n}=this;return 0===n?[0,0,0,0]:[255*t/n,255*e/n,255*r/n,n]}toArray01(){const{r:t,g:e,b:r,a:n}=this;return 0===n?[0,0,0,0]:[t/n,e/n,r/n,n]}toArray01PremultipliedAlpha(){const{r:t,g:e,b:r,a:n}=this;return [t,e,r,n]}}Be.black=new Be(0,0,0,1),Be.white=new Be(1,1,1,1),Be.transparent=new Be(0,0,0,0),Be.red=new Be(1,0,0,1),Be.blue=new Be(0,0,1,1);var Ee=Be;class Ce{constructor(t,e,r){this.sensitivity=t?e?"variant":"case":e?"accent":"base",this.locale=r,this.collator=new Intl.Collator(this.locale?this.locale:[],{sensitivity:this.sensitivity,usage:"search"});}compare(t,e){return this.collator.compare(t,e)}resolvedLocale(){return new Intl.Collator(this.locale?this.locale:[]).resolvedOptions().locale}}class Pe{constructor(t,e,r,n,i){this.text=t.normalize?t.normalize():t,this.image=e,this.scale=r,this.fontStack=n,this.textColor=i;}}class De{constructor(t){this.sections=t;}static fromString(t){return new De([new Pe(t,null,null,null,null)])}isEmpty(){return 0===this.sections.length||!this.sections.some((t=>0!==t.text.length||t.image&&0!==t.image.name.length))}static factory(t){return t instanceof De?t:De.fromString(t)}toString(){return 0===this.sections.length?"":this.sections.map((t=>t.text)).join("")}serialize(){const t=["format"];for(const e of this.sections){if(e.image){t.push(["image",e.image.name]);continue}t.push(e.text);const r={};e.fontStack&&(r["text-font"]=["literal",e.fontStack.split(",")]),e.scale&&(r["font-scale"]=e.scale),e.textColor&&(r["text-color"]=["rgba"].concat(e.textColor.toArray())),t.push(r);}return t}}class Ve{constructor(t){this.name=t.name,this.available=t.available;}toString(){return this.name}static fromString(t){return t?new Ve({name:t,available:!1}):null}serialize(){return ["image",this.name]}}function Le(t,e,r,n){return "number"==typeof t&&t>=0&&t<=255&&"number"==typeof e&&e>=0&&e<=255&&"number"==typeof r&&r>=0&&r<=255?void 0===n||"number"==typeof n&&n>=0&&n<=1?null:`Invalid rgba value [${[t,e,r,n].join(", ")}]: 'a' must be between 0 and 1.`:`Invalid rgba value [${("number"==typeof n?[t,e,r,n]:[t,e,r]).join(", ")}]: 'r', 'g', and 'b' must be between 0 and 255.`}function Fe(t){if(null===t)return !0;if("string"==typeof t)return !0;if("boolean"==typeof t)return !0;if("number"==typeof t)return !0;if(t instanceof Ee)return !0;if(t instanceof Ce)return !0;if(t instanceof De)return !0;if(t instanceof Ve)return !0;if(Array.isArray(t)){for(const e of t)if(!Fe(e))return !1;return !0}if("object"==typeof t){for(const e in t)if(!Fe(t[e]))return !1;return !0}return !1}function Re(t){if(null===t)return le;if("string"==typeof t)return ce;if("boolean"==typeof t)return he;if("number"==typeof t)return ue;if(t instanceof Ee)return pe;if(t instanceof Ce)return ye;if(t instanceof De)return me;if(t instanceof Ve)return ge;if(Array.isArray(t)){const e=t.length;let r;for(const e of t){const t=Re(e);if(r){if(r===t)continue;r=fe;break}r=t;}return xe(r||fe,e)}return de}function Ue(t){const e=typeof t;return null===t?"":"string"===e||"number"===e||"boolean"===e?String(t):t instanceof Ee||t instanceof De||t instanceof Ve?t.toString():JSON.stringify(t)}class $e{constructor(t,e){this.type=t,this.value=e;}static parse(t,e){if(2!==t.length)return e.error(`'literal' expression requires exactly one argument, but found ${t.length-1} instead.`);if(!Fe(t[1]))return e.error("invalid value");const r=t[1];let n=Re(r);const i=e.expectedType;return "array"!==n.kind||0!==n.N||!i||"array"!==i.kind||"number"==typeof i.N&&0!==i.N||(n=i),new $e(n,r)}evaluate(){return this.value}eachChild(){}outputDefined(){return !0}serialize(){return "array"===this.type.kind||"object"===this.type.kind?["literal",this.value]:this.value instanceof Ee?["rgba"].concat(this.value.toArray()):this.value instanceof De?this.value.serialize():this.value}}var je=$e,Oe=class{constructor(t){this.name="ExpressionEvaluationError",this.message=t;}toJSON(){return this.message}};const qe={string:ce,number:ue,boolean:he,object:de};class Ne{constructor(t,e){this.type=t,this.args=e;}static parse(t,e){if(t.length<2)return e.error("Expected at least one argument.");let r,n=1;const i=t[0];if("array"===i){let i,s;if(t.length>2){const r=t[1];if("string"!=typeof r||!(r in qe)||"object"===r)return e.error('The item type argument of "array" must be one of string, number, boolean',1);i=qe[r],n++;}else i=fe;if(t.length>3){if(null!==t[2]&&("number"!=typeof t[2]||t[2]<0||t[2]!==Math.floor(t[2])))return e.error('The length argument to "array" must be a positive integer literal',2);s=t[2],n++;}r=xe(i,s);}else r=qe[i];const s=[];for(;n<t.length;n++){const r=e.parse(t[n],n,fe);if(!r)return null;s.push(r);}return new Ne(r,s)}evaluate(t){for(let e=0;e<this.args.length;e++){const r=this.args[e].evaluate(t);if(!we(this.type,Re(r)))return r;if(e===this.args.length-1)throw new Oe(`Expected value to be of type ${ve(this.type)}, but found ${ve(Re(r))} instead.`)}return null}eachChild(t){this.args.forEach(t);}outputDefined(){return this.args.every((t=>t.outputDefined()))}serialize(){const t=this.type,e=[t.kind];if("array"===t.kind){const r=t.itemType;if("string"===r.kind||"number"===r.kind||"boolean"===r.kind){e.push(r.kind);const n=t.N;("number"==typeof n||this.args.length>1)&&e.push(n);}}return e.concat(this.args.map((t=>t.serialize())))}}var Ge=Ne;class Ze{constructor(t){this.type=me,this.sections=t;}static parse(t,e){if(t.length<2)return e.error("Expected at least one argument.");const r=t[1];if(!Array.isArray(r)&&"object"==typeof r)return e.error("First argument must be an image or text section.");const n=[];let i=!1;for(let r=1;r<=t.length-1;++r){const s=t[r];if(i&&"object"==typeof s&&!Array.isArray(s)){i=!1;let t=null;if(s["font-scale"]&&(t=e.parse(s["font-scale"],1,ue),!t))return null;let r=null;if(s["text-font"]&&(r=e.parse(s["text-font"],1,xe(ce)),!r))return null;let a=null;if(s["text-color"]&&(a=e.parse(s["text-color"],1,pe),!a))return null;const o=n[n.length-1];o.scale=t,o.font=r,o.textColor=a;}else {const s=e.parse(t[r],1,fe);if(!s)return null;const a=s.type.kind;if("string"!==a&&"value"!==a&&"null"!==a&&"resolvedImage"!==a)return e.error("Formatted text type must be 'string', 'value', 'image' or 'null'.");i=!0,n.push({content:s,scale:null,font:null,textColor:null});}}return new Ze(n)}evaluate(t){return new De(this.sections.map((e=>{const r=e.content.evaluate(t);return Re(r)===ge?new Pe("",r,null,null,null):new Pe(Ue(r),null,e.scale?e.scale.evaluate(t):null,e.font?e.font.evaluate(t).join(","):null,e.textColor?e.textColor.evaluate(t):null)})))}eachChild(t){for(const e of this.sections)t(e.content),e.scale&&t(e.scale),e.font&&t(e.font),e.textColor&&t(e.textColor);}outputDefined(){return !1}serialize(){const t=["format"];for(const e of this.sections){t.push(e.content.serialize());const r={};e.scale&&(r["font-scale"]=e.scale.serialize()),e.font&&(r["text-font"]=e.font.serialize()),e.textColor&&(r["text-color"]=e.textColor.serialize()),t.push(r);}return t}}class Ke{constructor(t){this.type=ge,this.input=t;}static parse(t,e){if(2!==t.length)return e.error("Expected two arguments.");const r=e.parse(t[1],1,ce);return r?new Ke(r):e.error("No image name provided.")}evaluate(t){const e=this.input.evaluate(t),r=Ve.fromString(e);return r&&t.availableImages&&(r.available=t.availableImages.indexOf(e)>-1),r}eachChild(t){t(this.input);}outputDefined(){return !1}serialize(){return ["image",this.input.serialize()]}}const Xe={"to-boolean":he,"to-color":pe,"to-number":ue,"to-string":ce};class Je{constructor(t,e){this.type=t,this.args=e;}static parse(t,e){if(t.length<2)return e.error("Expected at least one argument.");const r=t[0];if(("to-boolean"===r||"to-string"===r)&&2!==t.length)return e.error("Expected one argument.");const n=Xe[r],i=[];for(let r=1;r<t.length;r++){const n=e.parse(t[r],r,fe);if(!n)return null;i.push(n);}return new Je(n,i)}evaluate(t){if("boolean"===this.type.kind)return Boolean(this.args[0].evaluate(t));if("color"===this.type.kind){let e,r;for(const n of this.args){if(e=n.evaluate(t),r=null,e instanceof Ee)return e;if("string"==typeof e){const r=t.parseColor(e);if(r)return r}else if(Array.isArray(e)&&(r=e.length<3||e.length>4?`Invalid rbga value ${JSON.stringify(e)}: expected an array containing either three or four numeric values.`:Le(e[0],e[1],e[2],e[3]),!r))return new Ee(e[0]/255,e[1]/255,e[2]/255,e[3])}throw new Oe(r||`Could not parse color from value '${"string"==typeof e?e:String(JSON.stringify(e))}'`)}if("number"===this.type.kind){let e=null;for(const r of this.args){if(e=r.evaluate(t),null===e)return 0;const n=Number(e);if(!isNaN(n))return n}throw new Oe(`Could not convert ${JSON.stringify(e)} to number.`)}return "formatted"===this.type.kind?De.fromString(Ue(this.args[0].evaluate(t))):"resolvedImage"===this.type.kind?Ve.fromString(Ue(this.args[0].evaluate(t))):Ue(this.args[0].evaluate(t))}eachChild(t){this.args.forEach(t);}outputDefined(){return this.args.every((t=>t.outputDefined()))}serialize(){if("formatted"===this.type.kind)return new Ze([{content:this.args[0],scale:null,font:null,textColor:null}]).serialize();if("resolvedImage"===this.type.kind)return new Ke(this.args[0]).serialize();const t=[`to-${this.type.kind}`];return this.eachChild((e=>{t.push(e.serialize());})),t}}var He=Je;const Ye=["Unknown","Point","LineString","Polygon"];var We=class{constructor(){this.globals=null,this.feature=null,this.featureState=null,this.formattedSection=null,this._parseColorCache={},this.availableImages=null,this.canonical=null,this.featureTileCoord=null,this.featureDistanceData=null;}id(){return this.feature&&void 0!==this.feature.id?this.feature.id:null}geometryType(){return this.feature?"number"==typeof this.feature.type?Ye[this.feature.type]:this.feature.type:null}geometry(){return this.feature&&"geometry"in this.feature?this.feature.geometry:null}canonicalID(){return this.canonical}properties(){return this.feature&&this.feature.properties||{}}distanceFromCenter(){if(this.featureTileCoord&&this.featureDistanceData){const t=this.featureDistanceData.center,e=this.featureDistanceData.scale,{x:r,y:n}=this.featureTileCoord;return this.featureDistanceData.bearing[0]*(r*e-t[0])+this.featureDistanceData.bearing[1]*(n*e-t[1])}return 0}parseColor(t){let e=this._parseColorCache[t];return e||(e=this._parseColorCache[t]=Ee.parse(t)),e}};class Qe{constructor(t,e,r,n){this.name=t,this.type=e,this._evaluate=r,this.args=n;}evaluate(t){return this._evaluate(t,this.args)}eachChild(t){this.args.forEach(t);}outputDefined(){return !1}serialize(){return [this.name].concat(this.args.map((t=>t.serialize())))}static parse(t,e){const r=t[0],n=Qe.definitions[r];if(!n)return e.error(`Unknown expression "${r}". If you wanted a literal array, use ["literal", [...]].`,0);const i=Array.isArray(n)?n[0]:n.type,s=Array.isArray(n)?[[n[1],n[2]]]:n.overloads,a=s.filter((([e])=>!Array.isArray(e)||e.length===t.length-1));let o=null;for(const[n,s]of a){o=new Ir(e.registry,e.path,null,e.scope);const a=[];let l=!1;for(let e=1;e<t.length;e++){const r=t[e],i=Array.isArray(n)?n[e-1]:n.type,s=o.parse(r,1+a.length,i);if(!s){l=!0;break}a.push(s);}if(!l)if(Array.isArray(n)&&n.length!==a.length)o.error(`Expected ${n.length} arguments, but found ${a.length} instead.`);else {for(let t=0;t<a.length;t++){const e=Array.isArray(n)?n[t]:n.type,r=a[t];o.concat(t+1).checkSubtype(e,r.type);}if(0===o.errors.length)return new Qe(r,i,s,a)}}if(1===a.length)e.errors.push(...o.errors);else {const r=(a.length?a:s).map((([t])=>{return e=t,Array.isArray(e)?`(${e.map(ve).join(", ")})`:`(${ve(e.type)}...)`;var e;})).join(" | "),n=[];for(let r=1;r<t.length;r++){const i=e.parse(t[r],1+n.length);if(!i)return null;n.push(ve(i.type));}e.error(`Expected arguments of type ${r}, but found (${n.join(", ")}) instead.`);}return null}static register(t,e){Qe.definitions=e;for(const r in e)t[r]=Qe;}}var tr=Qe;class er{constructor(t,e,r){this.type=ye,this.locale=r,this.caseSensitive=t,this.diacriticSensitive=e;}static parse(t,e){if(2!==t.length)return e.error("Expected one argument.");const r=t[1];if("object"!=typeof r||Array.isArray(r))return e.error("Collator options argument must be an object.");const n=e.parse(void 0!==r["case-sensitive"]&&r["case-sensitive"],1,he);if(!n)return null;const i=e.parse(void 0!==r["diacritic-sensitive"]&&r["diacritic-sensitive"],1,he);if(!i)return null;let s=null;return r.locale&&(s=e.parse(r.locale,1,ce),!s)?null:new er(n,i,s)}evaluate(t){return new Ce(this.caseSensitive.evaluate(t),this.diacriticSensitive.evaluate(t),this.locale?this.locale.evaluate(t):null)}eachChild(t){t(this.caseSensitive),t(this.diacriticSensitive),this.locale&&t(this.locale);}outputDefined(){return !1}serialize(){const t={};return t["case-sensitive"]=this.caseSensitive.serialize(),t["diacritic-sensitive"]=this.diacriticSensitive.serialize(),this.locale&&(t.locale=this.locale.serialize()),["collator",t]}}const rr=8192;function nr(t,e){t[0]=Math.min(t[0],e[0]),t[1]=Math.min(t[1],e[1]),t[2]=Math.max(t[2],e[0]),t[3]=Math.max(t[3],e[1]);}function ir(t,e){return !(t[0]<=e[0]||t[2]>=e[2]||t[1]<=e[1]||t[3]>=e[3])}function sr(t,e){const r=(180+t[0])/360,n=(180-180/Math.PI*Math.log(Math.tan(Math.PI/4+t[1]*Math.PI/360)))/360,i=Math.pow(2,e.z);return [Math.round(r*i*rr),Math.round(n*i*rr)]}function ar(t,e,r){const n=t[0]-e[0],i=t[1]-e[1],s=t[0]-r[0],a=t[1]-r[1];return n*a-s*i==0&&n*s<=0&&i*a<=0}function or(t,e){let r=!1;for(let a=0,o=e.length;a<o;a++){const o=e[a];for(let e=0,a=o.length;e<a-1;e++){if(ar(t,o[e],o[e+1]))return !1;(i=o[e])[1]>(n=t)[1]!=(s=o[e+1])[1]>n[1]&&n[0]<(s[0]-i[0])*(n[1]-i[1])/(s[1]-i[1])+i[0]&&(r=!r);}}var n,i,s;return r}function lr(t,e){for(let r=0;r<e.length;r++)if(or(t,e[r]))return !0;return !1}function ur(t,e,r,n){const i=n[0]-r[0],s=n[1]-r[1],a=(t[0]-r[0])*s-i*(t[1]-r[1]),o=(e[0]-r[0])*s-i*(e[1]-r[1]);return a>0&&o<0||a<0&&o>0}function cr(t,e,r){for(const u of r)for(let r=0;r<u.length-1;++r)if(0!=(o=[(a=u[r+1])[0]-(s=u[r])[0],a[1]-s[1]])[0]*(l=[(i=e)[0]-(n=t)[0],i[1]-n[1]])[1]-o[1]*l[0]&&ur(n,i,s,a)&&ur(s,a,n,i))return !0;var n,i,s,a,o,l;return !1}function hr(t,e){for(let r=0;r<t.length;++r)if(!or(t[r],e))return !1;for(let r=0;r<t.length-1;++r)if(cr(t[r],t[r+1],e))return !1;return !0}function pr(t,e){for(let r=0;r<e.length;r++)if(hr(t,e[r]))return !0;return !1}function dr(t,e,r){const n=[];for(let i=0;i<t.length;i++){const s=[];for(let n=0;n<t[i].length;n++){const a=sr(t[i][n],r);nr(e,a),s.push(a);}n.push(s);}return n}function fr(t,e,r){const n=[];for(let i=0;i<t.length;i++){const s=dr(t[i],e,r);n.push(s);}return n}function yr(t,e,r,n){if(t[0]<r[0]||t[0]>r[2]){const e=.5*n;let i=t[0]-r[0]>e?-n:r[0]-t[0]>e?n:0;0===i&&(i=t[0]-r[2]>e?-n:r[2]-t[0]>e?n:0),t[0]+=i;}nr(e,t);}function mr(t,e,r,n){const i=Math.pow(2,n.z)*rr,s=[n.x*rr,n.y*rr],a=[];if(!t)return a;for(const n of t)for(const t of n){const n=[t.x+s[0],t.y+s[1]];yr(n,e,r,i),a.push(n);}return a}function gr(t,e,r,n){const i=Math.pow(2,n.z)*rr,s=[n.x*rr,n.y*rr],a=[];if(!t)return a;for(const r of t){const t=[];for(const n of r){const r=[n.x+s[0],n.y+s[1]];nr(e,r),t.push(r);}a.push(t);}if(e[2]-e[0]<=i/2){(o=e)[0]=o[1]=1/0,o[2]=o[3]=-1/0;for(const t of a)for(const n of t)yr(n,e,r,i);}var o;return a}class xr{constructor(t,e){this.type=he,this.geojson=t,this.geometries=e;}static parse(t,e){if(2!==t.length)return e.error(`'within' expression requires exactly one argument, but found ${t.length-1} instead.`);if(Fe(t[1])){const e=t[1];if("FeatureCollection"===e.type)for(let t=0;t<e.features.length;++t){const r=e.features[t].geometry.type;if("Polygon"===r||"MultiPolygon"===r)return new xr(e,e.features[t].geometry)}else if("Feature"===e.type){const t=e.geometry.type;if("Polygon"===t||"MultiPolygon"===t)return new xr(e,e.geometry)}else if("Polygon"===e.type||"MultiPolygon"===e.type)return new xr(e,e)}return e.error("'within' expression requires valid geojson object that contains polygon geometry type.")}evaluate(t){if(null!=t.geometry()&&null!=t.canonicalID()){if("Point"===t.geometryType())return function(t,e){const r=[1/0,1/0,-1/0,-1/0],n=[1/0,1/0,-1/0,-1/0],i=t.canonicalID();if(!i)return !1;if("Polygon"===e.type){const s=dr(e.coordinates,n,i),a=mr(t.geometry(),r,n,i);if(!ir(r,n))return !1;for(const t of a)if(!or(t,s))return !1}if("MultiPolygon"===e.type){const s=fr(e.coordinates,n,i),a=mr(t.geometry(),r,n,i);if(!ir(r,n))return !1;for(const t of a)if(!lr(t,s))return !1}return !0}(t,this.geometries);if("LineString"===t.geometryType())return function(t,e){const r=[1/0,1/0,-1/0,-1/0],n=[1/0,1/0,-1/0,-1/0],i=t.canonicalID();if(!i)return !1;if("Polygon"===e.type){const s=dr(e.coordinates,n,i),a=gr(t.geometry(),r,n,i);if(!ir(r,n))return !1;for(const t of a)if(!hr(t,s))return !1}if("MultiPolygon"===e.type){const s=fr(e.coordinates,n,i),a=gr(t.geometry(),r,n,i);if(!ir(r,n))return !1;for(const t of a)if(!pr(t,s))return !1}return !0}(t,this.geometries)}return !1}eachChild(){}outputDefined(){return !0}serialize(){return ["within",this.geojson]}}var vr=xr;function br(t){if(t instanceof tr){if("get"===t.name&&1===t.args.length)return !1;if("feature-state"===t.name)return !1;if("has"===t.name&&1===t.args.length)return !1;if("properties"===t.name||"geometry-type"===t.name||"id"===t.name)return !1;if(/^filter-/.test(t.name))return !1}if(t instanceof vr)return !1;let e=!0;return t.eachChild((t=>{e&&!br(t)&&(e=!1);})),e}function wr(t){if(t instanceof tr&&"feature-state"===t.name)return !1;let e=!0;return t.eachChild((t=>{e&&!wr(t)&&(e=!1);})),e}function _r(t,e){if(t instanceof tr&&e.indexOf(t.name)>=0)return !1;let r=!0;return t.eachChild((t=>{r&&!_r(t,e)&&(r=!1);})),r}class Ar{constructor(t,e){this.type=e.type,this.name=t,this.boundExpression=e;}static parse(t,e){if(2!==t.length||"string"!=typeof t[1])return e.error("'var' expression requires exactly one string literal argument.");const r=t[1];return e.scope.has(r)?new Ar(r,e.scope.get(r)):e.error(`Unknown variable "${r}". Make sure "${r}" has been bound in an enclosing "let" expression before using it.`,1)}evaluate(t){return this.boundExpression.evaluate(t)}eachChild(){}outputDefined(){return !1}serialize(){return ["var",this.name]}}var Sr=Ar;class kr{constructor(t,e=[],r,n=new oe,i=[]){this.registry=t,this.path=e,this.key=e.map((t=>`[${t}]`)).join(""),this.scope=n,this.errors=i,this.expectedType=r;}parse(t,e,r,n,i={}){return e?this.concat(e,r,n)._parse(t,i):this._parse(t,i)}_parse(t,e){function r(t,e,r){return "assert"===r?new Ge(e,[t]):"coerce"===r?new He(e,[t]):t}if(null!==t&&"string"!=typeof t&&"boolean"!=typeof t&&"number"!=typeof t||(t=["literal",t]),Array.isArray(t)){if(0===t.length)return this.error('Expected an array with at least one element. If you wanted a literal array, use ["literal", []].');const n=t[0];if("string"!=typeof n)return this.error(`Expression name must be a string, but found ${typeof n} instead. If you wanted a literal array, use ["literal", [...]].`,0),null;const i=this.registry[n];if(i){let n=i.parse(t,this);if(!n)return null;if(this.expectedType){const t=this.expectedType,i=n.type;if("string"!==t.kind&&"number"!==t.kind&&"boolean"!==t.kind&&"object"!==t.kind&&"array"!==t.kind||"value"!==i.kind)if("color"!==t.kind&&"formatted"!==t.kind&&"resolvedImage"!==t.kind||"value"!==i.kind&&"string"!==i.kind){if(this.checkSubtype(t,i))return null}else n=r(n,t,e.typeAnnotation||"coerce");else n=r(n,t,e.typeAnnotation||"assert");}if(!(n instanceof je)&&"resolvedImage"!==n.type.kind&&Mr(n)){const t=new We;try{n=new je(n.type,n.evaluate(t));}catch(t){return this.error(t.message),null}}return n}return this.error(`Unknown expression "${n}". If you wanted a literal array, use ["literal", [...]].`,0)}return this.error(void 0===t?"'undefined' value invalid. Use null instead.":"object"==typeof t?'Bare objects invalid. Use ["literal", {...}] instead.':`Expected an array, but found ${typeof t} instead.`)}concat(t,e,r){const n="number"==typeof t?this.path.concat(t):this.path,i=r?this.scope.concat(r):this.scope;return new kr(this.registry,n,e||null,i,this.errors)}error(t,...e){const r=`${this.key}${e.map((t=>`[${t}]`)).join("")}`;this.errors.push(new se(r,t));}checkSubtype(t,e){const r=we(t,e);return r&&this.error(r),r}}var Ir=kr;function Mr(t){if(t instanceof Sr)return Mr(t.boundExpression);if(t instanceof tr&&"error"===t.name)return !1;if(t instanceof er)return !1;if(t instanceof vr)return !1;const e=t instanceof He||t instanceof Ge;let r=!0;return t.eachChild((t=>{r=e?r&&Mr(t):r&&t instanceof je;})),!!r&&br(t)&&_r(t,["zoom","heatmap-density","line-progress","sky-radial-progress","accumulated","is-supported-script","pitch","distance-from-center"])}function Tr(t,e){const r=t.length-1;let n,i,s=0,a=r,o=0;for(;s<=a;)if(o=Math.floor((s+a)/2),n=t[o],i=t[o+1],n<=e){if(o===r||e<i)return o;s=o+1;}else {if(!(n>e))throw new Oe("Input is not a number.");a=o-1;}return 0}class zr{constructor(t,e,r){this.type=t,this.input=e,this.labels=[],this.outputs=[];for(const[t,e]of r)this.labels.push(t),this.outputs.push(e);}static parse(t,e){if(t.length-1<4)return e.error(`Expected at least 4 arguments, but found only ${t.length-1}.`);if((t.length-1)%2!=0)return e.error("Expected an even number of arguments.");const r=e.parse(t[1],1,ue);if(!r)return null;const n=[];let i=null;e.expectedType&&"value"!==e.expectedType.kind&&(i=e.expectedType);for(let r=1;r<t.length;r+=2){const s=1===r?-1/0:t[r],a=t[r+1],o=r,l=r+1;if("number"!=typeof s)return e.error('Input/output pairs for "step" expressions must be defined using literal numeric values (not computed expressions) for the input values.',o);if(n.length&&n[n.length-1][0]>=s)return e.error('Input/output pairs for "step" expressions must be arranged with input values in strictly ascending order.',o);const u=e.parse(a,l,i);if(!u)return null;i=i||u.type,n.push([s,u]);}return new zr(i,r,n)}evaluate(t){const e=this.labels,r=this.outputs;if(1===e.length)return r[0].evaluate(t);const n=this.input.evaluate(t);if(n<=e[0])return r[0].evaluate(t);const i=e.length;return n>=e[i-1]?r[i-1].evaluate(t):r[Tr(e,n)].evaluate(t)}eachChild(t){t(this.input);for(const e of this.outputs)t(e);}outputDefined(){return this.outputs.every((t=>t.outputDefined()))}serialize(){const t=["step",this.input.serialize()];for(let e=0;e<this.labels.length;e++)e>0&&t.push(this.labels[e]),t.push(this.outputs[e].serialize());return t}}var Br=zr;function Er(t,e,r){return t*(1-r)+e*r}var Cr=Object.freeze({__proto__:null,array:function(t,e,r){return t.map(((t,n)=>Er(t,e[n],r)))},color:function(t,e,r){return new Ee(Er(t.r,e.r,r),Er(t.g,e.g,r),Er(t.b,e.b,r),Er(t.a,e.a,r))},number:Er});const Pr=.95047,Dr=1.08883,Vr=4/29,Lr=6/29,Fr=3*Lr*Lr,Rr=Lr*Lr*Lr,Ur=Math.PI/180,$r=180/Math.PI;function jr(t){return t>Rr?Math.pow(t,1/3):t/Fr+Vr}function Or(t){return t>Lr?t*t*t:Fr*(t-Vr)}function qr(t){return 255*(t<=.0031308?12.92*t:1.055*Math.pow(t,1/2.4)-.055)}function Nr(t){return (t/=255)<=.04045?t/12.92:Math.pow((t+.055)/1.055,2.4)}function Gr(t){const e=Nr(t.r),r=Nr(t.g),n=Nr(t.b),i=jr((.4124564*e+.3575761*r+.1804375*n)/Pr),s=jr((.2126729*e+.7151522*r+.072175*n)/1);return {l:116*s-16,a:500*(i-s),b:200*(s-jr((.0193339*e+.119192*r+.9503041*n)/Dr)),alpha:t.a}}function Zr(t){let e=(t.l+16)/116,r=isNaN(t.a)?e:e+t.a/500,n=isNaN(t.b)?e:e-t.b/200;return e=1*Or(e),r=Pr*Or(r),n=Dr*Or(n),new Ee(qr(3.2404542*r-1.5371385*e-.4985314*n),qr(-.969266*r+1.8760108*e+.041556*n),qr(.0556434*r-.2040259*e+1.0572252*n),t.alpha)}function Kr(t,e,r){const n=e-t;return t+r*(n>180||n<-180?n-360*Math.round(n/360):n)}const Xr={forward:Gr,reverse:Zr,interpolate:function(t,e,r){return {l:Er(t.l,e.l,r),a:Er(t.a,e.a,r),b:Er(t.b,e.b,r),alpha:Er(t.alpha,e.alpha,r)}}},Jr={forward:function(t){const{l:e,a:r,b:n}=Gr(t),i=Math.atan2(n,r)*$r;return {h:i<0?i+360:i,c:Math.sqrt(r*r+n*n),l:e,alpha:t.a}},reverse:function(t){const e=t.h*Ur,r=t.c;return Zr({l:t.l,a:Math.cos(e)*r,b:Math.sin(e)*r,alpha:t.alpha})},interpolate:function(t,e,r){return {h:Kr(t.h,e.h,r),c:Er(t.c,e.c,r),l:Er(t.l,e.l,r),alpha:Er(t.alpha,e.alpha,r)}}};var Hr=Object.freeze({__proto__:null,hcl:Jr,lab:Xr});class Yr{constructor(t,e,r,n,i){this.type=t,this.operator=e,this.interpolation=r,this.input=n,this.labels=[],this.outputs=[];for(const[t,e]of i)this.labels.push(t),this.outputs.push(e);}static interpolationFactor(t,e,r,n){let i=0;if("exponential"===t.name)i=Wr(e,t.base,r,n);else if("linear"===t.name)i=Wr(e,1,r,n);else if("cubic-bezier"===t.name){const s=t.controlPoints;i=new y(s[0],s[1],s[2],s[3]).solve(Wr(e,1,r,n));}return i}static parse(t,e){let[r,n,i,...s]=t;if(!Array.isArray(n)||0===n.length)return e.error("Expected an interpolation type expression.",1);if("linear"===n[0])n={name:"linear"};else if("exponential"===n[0]){const t=n[1];if("number"!=typeof t)return e.error("Exponential interpolation requires a numeric base.",1,1);n={name:"exponential",base:t};}else {if("cubic-bezier"!==n[0])return e.error(`Unknown interpolation type ${String(n[0])}`,1,0);{const t=n.slice(1);if(4!==t.length||t.some((t=>"number"!=typeof t||t<0||t>1)))return e.error("Cubic bezier interpolation requires four numeric arguments with values between 0 and 1.",1);n={name:"cubic-bezier",controlPoints:t};}}if(t.length-1<4)return e.error(`Expected at least 4 arguments, but found only ${t.length-1}.`);if((t.length-1)%2!=0)return e.error("Expected an even number of arguments.");if(i=e.parse(i,2,ue),!i)return null;const a=[];let o=null;"interpolate-hcl"===r||"interpolate-lab"===r?o=pe:e.expectedType&&"value"!==e.expectedType.kind&&(o=e.expectedType);for(let t=0;t<s.length;t+=2){const r=s[t],n=s[t+1],i=t+3,l=t+4;if("number"!=typeof r)return e.error('Input/output pairs for "interpolate" expressions must be defined using literal numeric values (not computed expressions) for the input values.',i);if(a.length&&a[a.length-1][0]>=r)return e.error('Input/output pairs for "interpolate" expressions must be arranged with input values in strictly ascending order.',i);const u=e.parse(n,l,o);if(!u)return null;o=o||u.type,a.push([r,u]);}return "number"===o.kind||"color"===o.kind||"array"===o.kind&&"number"===o.itemType.kind&&"number"==typeof o.N?new Yr(o,r,n,i,a):e.error(`Type ${ve(o)} is not interpolatable.`)}evaluate(t){const e=this.labels,r=this.outputs;if(1===e.length)return r[0].evaluate(t);const n=this.input.evaluate(t);if(n<=e[0])return r[0].evaluate(t);const i=e.length;if(n>=e[i-1])return r[i-1].evaluate(t);const s=Tr(e,n),a=Yr.interpolationFactor(this.interpolation,n,e[s],e[s+1]),o=r[s].evaluate(t),l=r[s+1].evaluate(t);return "interpolate"===this.operator?Cr[this.type.kind.toLowerCase()](o,l,a):"interpolate-hcl"===this.operator?Jr.reverse(Jr.interpolate(Jr.forward(o),Jr.forward(l),a)):Xr.reverse(Xr.interpolate(Xr.forward(o),Xr.forward(l),a))}eachChild(t){t(this.input);for(const e of this.outputs)t(e);}outputDefined(){return this.outputs.every((t=>t.outputDefined()))}serialize(){let t;t="linear"===this.interpolation.name?["linear"]:"exponential"===this.interpolation.name?1===this.interpolation.base?["linear"]:["exponential",this.interpolation.base]:["cubic-bezier"].concat(this.interpolation.controlPoints);const e=[this.operator,t,this.input.serialize()];for(let t=0;t<this.labels.length;t++)e.push(this.labels[t],this.outputs[t].serialize());return e}}function Wr(t,e,r,n){const i=n-r,s=t-r;return 0===i?0:1===e?s/i:(Math.pow(e,s)-1)/(Math.pow(e,i)-1)}var Qr=Yr;class tn{constructor(t,e){this.type=t,this.args=e;}static parse(t,e){if(t.length<2)return e.error("Expectected at least one argument.");let r=null;const n=e.expectedType;n&&"value"!==n.kind&&(r=n);const i=[];for(const n of t.slice(1)){const t=e.parse(n,1+i.length,r,void 0,{typeAnnotation:"omit"});if(!t)return null;r=r||t.type,i.push(t);}const s=n&&i.some((t=>we(n,t.type)));return new tn(s?fe:r,i)}evaluate(t){let e,r=null,n=0;for(const i of this.args){if(n++,r=i.evaluate(t),r&&r instanceof Ve&&!r.available&&(e||(e=r),r=null,n===this.args.length))return e;if(null!==r)break}return r}eachChild(t){this.args.forEach(t);}outputDefined(){return this.args.every((t=>t.outputDefined()))}serialize(){const t=["coalesce"];return this.eachChild((e=>{t.push(e.serialize());})),t}}var en=tn;class rn{constructor(t,e){this.type=e.type,this.bindings=[].concat(t),this.result=e;}evaluate(t){return this.result.evaluate(t)}eachChild(t){for(const e of this.bindings)t(e[1]);t(this.result);}static parse(t,e){if(t.length<4)return e.error(`Expected at least 3 arguments, but found ${t.length-1} instead.`);const r=[];for(let n=1;n<t.length-1;n+=2){const i=t[n];if("string"!=typeof i)return e.error(`Expected string, but found ${typeof i} instead.`,n);if(/[^a-zA-Z0-9_]/.test(i))return e.error("Variable names must contain only alphanumeric characters or '_'.",n);const s=e.parse(t[n+1],n+1);if(!s)return null;r.push([i,s]);}const n=e.parse(t[t.length-1],t.length-1,e.expectedType,r);return n?new rn(r,n):null}outputDefined(){return this.result.outputDefined()}serialize(){const t=["let"];for(const[e,r]of this.bindings)t.push(e,r.serialize());return t.push(this.result.serialize()),t}}var nn=rn;class sn{constructor(t,e,r){this.type=t,this.index=e,this.input=r;}static parse(t,e){if(3!==t.length)return e.error(`Expected 2 arguments, but found ${t.length-1} instead.`);const r=e.parse(t[1],1,ue),n=e.parse(t[2],2,xe(e.expectedType||fe));return r&&n?new sn(n.type.itemType,r,n):null}evaluate(t){const e=this.index.evaluate(t),r=this.input.evaluate(t);if(e<0)throw new Oe(`Array index out of bounds: ${e} < 0.`);if(e>=r.length)throw new Oe(`Array index out of bounds: ${e} > ${r.length-1}.`);if(e!==Math.floor(e))throw new Oe(`Array index must be an integer, but found ${e} instead.`);return r[e]}eachChild(t){t(this.index),t(this.input);}outputDefined(){return !1}serialize(){return ["at",this.index.serialize(),this.input.serialize()]}}var an=sn;class on{constructor(t,e){this.type=he,this.needle=t,this.haystack=e;}static parse(t,e){if(3!==t.length)return e.error(`Expected 2 arguments, but found ${t.length-1} instead.`);const r=e.parse(t[1],1,fe),n=e.parse(t[2],2,fe);return r&&n?_e(r.type,[he,ce,ue,le,fe])?new on(r,n):e.error(`Expected first argument to be of type boolean, string, number or null, but found ${ve(r.type)} instead`):null}evaluate(t){const e=this.needle.evaluate(t),r=this.haystack.evaluate(t);if(null==r)return !1;if(!Ae(e,["boolean","string","number","null"]))throw new Oe(`Expected first argument to be of type boolean, string, number or null, but found ${ve(Re(e))} instead.`);if(!Ae(r,["string","array"]))throw new Oe(`Expected second argument to be of type array or string, but found ${ve(Re(r))} instead.`);return r.indexOf(e)>=0}eachChild(t){t(this.needle),t(this.haystack);}outputDefined(){return !0}serialize(){return ["in",this.needle.serialize(),this.haystack.serialize()]}}var ln=on;class un{constructor(t,e,r){this.type=ue,this.needle=t,this.haystack=e,this.fromIndex=r;}static parse(t,e){if(t.length<=2||t.length>=5)return e.error(`Expected 3 or 4 arguments, but found ${t.length-1} instead.`);const r=e.parse(t[1],1,fe),n=e.parse(t[2],2,fe);if(!r||!n)return null;if(!_e(r.type,[he,ce,ue,le,fe]))return e.error(`Expected first argument to be of type boolean, string, number or null, but found ${ve(r.type)} instead`);if(4===t.length){const i=e.parse(t[3],3,ue);return i?new un(r,n,i):null}return new un(r,n)}evaluate(t){const e=this.needle.evaluate(t),r=this.haystack.evaluate(t);if(!Ae(e,["boolean","string","number","null"]))throw new Oe(`Expected first argument to be of type boolean, string, number or null, but found ${ve(Re(e))} instead.`);if(!Ae(r,["string","array"]))throw new Oe(`Expected second argument to be of type array or string, but found ${ve(Re(r))} instead.`);if(this.fromIndex){const n=this.fromIndex.evaluate(t);return r.indexOf(e,n)}return r.indexOf(e)}eachChild(t){t(this.needle),t(this.haystack),this.fromIndex&&t(this.fromIndex);}outputDefined(){return !1}serialize(){if(null!=this.fromIndex&&void 0!==this.fromIndex){const t=this.fromIndex.serialize();return ["index-of",this.needle.serialize(),this.haystack.serialize(),t]}return ["index-of",this.needle.serialize(),this.haystack.serialize()]}}var cn=un;class hn{constructor(t,e,r,n,i,s){this.inputType=t,this.type=e,this.input=r,this.cases=n,this.outputs=i,this.otherwise=s;}static parse(t,e){if(t.length<5)return e.error(`Expected at least 4 arguments, but found only ${t.length-1}.`);if(t.length%2!=1)return e.error("Expected an even number of arguments.");let r,n;e.expectedType&&"value"!==e.expectedType.kind&&(n=e.expectedType);const i={},s=[];for(let a=2;a<t.length-1;a+=2){let o=t[a];const l=t[a+1];Array.isArray(o)||(o=[o]);const u=e.concat(a);if(0===o.length)return u.error("Expected at least one branch label.");for(const t of o){if("number"!=typeof t&&"string"!=typeof t)return u.error("Branch labels must be numbers or strings.");if("number"==typeof t&&Math.abs(t)>Number.MAX_SAFE_INTEGER)return u.error(`Branch labels must be integers no larger than ${Number.MAX_SAFE_INTEGER}.`);if("number"==typeof t&&Math.floor(t)!==t)return u.error("Numeric branch labels must be integer values.");if(r){if(u.checkSubtype(r,Re(t)))return null}else r=Re(t);if(void 0!==i[String(t)])return u.error("Branch labels must be unique.");i[String(t)]=s.length;}const c=e.parse(l,a,n);if(!c)return null;n=n||c.type,s.push(c);}const a=e.parse(t[1],1,fe);if(!a)return null;const o=e.parse(t[t.length-1],t.length-1,n);return o?"value"!==a.type.kind&&e.concat(1).checkSubtype(r,a.type)?null:new hn(r,n,a,i,s,o):null}evaluate(t){const e=this.input.evaluate(t);return (Re(e)===this.inputType&&this.outputs[this.cases[e]]||this.otherwise).evaluate(t)}eachChild(t){t(this.input),this.outputs.forEach(t),t(this.otherwise);}outputDefined(){return this.outputs.every((t=>t.outputDefined()))&&this.otherwise.outputDefined()}serialize(){const t=["match",this.input.serialize()],e=Object.keys(this.cases).sort(),r=[],n={};for(const t of e){const e=n[this.cases[t]];void 0===e?(n[this.cases[t]]=r.length,r.push([this.cases[t],[t]])):r[e][1].push(t);}const i=t=>"number"===this.inputType.kind?Number(t):t;for(const[e,n]of r)t.push(1===n.length?i(n[0]):n.map(i)),t.push(this.outputs[e].serialize());return t.push(this.otherwise.serialize()),t}}var pn=hn;class dn{constructor(t,e,r){this.type=t,this.branches=e,this.otherwise=r;}static parse(t,e){if(t.length<4)return e.error(`Expected at least 3 arguments, but found only ${t.length-1}.`);if(t.length%2!=0)return e.error("Expected an odd number of arguments.");let r;e.expectedType&&"value"!==e.expectedType.kind&&(r=e.expectedType);const n=[];for(let i=1;i<t.length-1;i+=2){const s=e.parse(t[i],i,he);if(!s)return null;const a=e.parse(t[i+1],i+1,r);if(!a)return null;n.push([s,a]),r=r||a.type;}const i=e.parse(t[t.length-1],t.length-1,r);return i?new dn(r,n,i):null}evaluate(t){for(const[e,r]of this.branches)if(e.evaluate(t))return r.evaluate(t);return this.otherwise.evaluate(t)}eachChild(t){for(const[e,r]of this.branches)t(e),t(r);t(this.otherwise);}outputDefined(){return this.branches.every((([t,e])=>e.outputDefined()))&&this.otherwise.outputDefined()}serialize(){const t=["case"];return this.eachChild((e=>{t.push(e.serialize());})),t}}var fn=dn;class yn{constructor(t,e,r,n){this.type=t,this.input=e,this.beginIndex=r,this.endIndex=n;}static parse(t,e){if(t.length<=2||t.length>=5)return e.error(`Expected 3 or 4 arguments, but found ${t.length-1} instead.`);const r=e.parse(t[1],1,fe),n=e.parse(t[2],2,ue);if(!r||!n)return null;if(!_e(r.type,[xe(fe),ce,fe]))return e.error(`Expected first argument to be of type array or string, but found ${ve(r.type)} instead`);if(4===t.length){const i=e.parse(t[3],3,ue);return i?new yn(r.type,r,n,i):null}return new yn(r.type,r,n)}evaluate(t){const e=this.input.evaluate(t),r=this.beginIndex.evaluate(t);if(!Ae(e,["string","array"]))throw new Oe(`Expected first argument to be of type array or string, but found ${ve(Re(e))} instead.`);if(this.endIndex){const n=this.endIndex.evaluate(t);return e.slice(r,n)}return e.slice(r)}eachChild(t){t(this.input),t(this.beginIndex),this.endIndex&&t(this.endIndex);}outputDefined(){return !1}serialize(){if(null!=this.endIndex&&void 0!==this.endIndex){const t=this.endIndex.serialize();return ["slice",this.input.serialize(),this.beginIndex.serialize(),t]}return ["slice",this.input.serialize(),this.beginIndex.serialize()]}}var mn=yn;function gn(t,e){return "=="===t||"!="===t?"boolean"===e.kind||"string"===e.kind||"number"===e.kind||"null"===e.kind||"value"===e.kind:"string"===e.kind||"number"===e.kind||"value"===e.kind}function xn(t,e,r,n){return 0===n.compare(e,r)}function vn(t,e,r){const n="=="!==t&&"!="!==t;return class i{constructor(t,e,r){this.type=he,this.lhs=t,this.rhs=e,this.collator=r,this.hasUntypedArgument="value"===t.type.kind||"value"===e.type.kind;}static parse(t,e){if(3!==t.length&&4!==t.length)return e.error("Expected two or three arguments.");const r=t[0];let s=e.parse(t[1],1,fe);if(!s)return null;if(!gn(r,s.type))return e.concat(1).error(`"${r}" comparisons are not supported for type '${ve(s.type)}'.`);let a=e.parse(t[2],2,fe);if(!a)return null;if(!gn(r,a.type))return e.concat(2).error(`"${r}" comparisons are not supported for type '${ve(a.type)}'.`);if(s.type.kind!==a.type.kind&&"value"!==s.type.kind&&"value"!==a.type.kind)return e.error(`Cannot compare types '${ve(s.type)}' and '${ve(a.type)}'.`);n&&("value"===s.type.kind&&"value"!==a.type.kind?s=new Ge(a.type,[s]):"value"!==s.type.kind&&"value"===a.type.kind&&(a=new Ge(s.type,[a])));let o=null;if(4===t.length){if("string"!==s.type.kind&&"string"!==a.type.kind&&"value"!==s.type.kind&&"value"!==a.type.kind)return e.error("Cannot use collator to compare non-string types.");if(o=e.parse(t[3],3,ye),!o)return null}return new i(s,a,o)}evaluate(i){const s=this.lhs.evaluate(i),a=this.rhs.evaluate(i);if(n&&this.hasUntypedArgument){const e=Re(s),r=Re(a);if(e.kind!==r.kind||"string"!==e.kind&&"number"!==e.kind)throw new Oe(`Expected arguments for "${t}" to be (string, string) or (number, number), but found (${e.kind}, ${r.kind}) instead.`)}if(this.collator&&!n&&this.hasUntypedArgument){const t=Re(s),r=Re(a);if("string"!==t.kind||"string"!==r.kind)return e(i,s,a)}return this.collator?r(i,s,a,this.collator.evaluate(i)):e(i,s,a)}eachChild(t){t(this.lhs),t(this.rhs),this.collator&&t(this.collator);}outputDefined(){return !0}serialize(){const e=[t];return this.eachChild((t=>{e.push(t.serialize());})),e}}}const bn=vn("==",(function(t,e,r){return e===r}),xn),wn=vn("!=",(function(t,e,r){return e!==r}),(function(t,e,r,n){return !xn(0,e,r,n)})),_n=vn("<",(function(t,e,r){return e<r}),(function(t,e,r,n){return n.compare(e,r)<0})),An=vn(">",(function(t,e,r){return e>r}),(function(t,e,r,n){return n.compare(e,r)>0})),Sn=vn("<=",(function(t,e,r){return e<=r}),(function(t,e,r,n){return n.compare(e,r)<=0})),kn=vn(">=",(function(t,e,r){return e>=r}),(function(t,e,r,n){return n.compare(e,r)>=0}));class In{constructor(t,e,r,n,i,s){this.type=ce,this.number=t,this.locale=e,this.currency=r,this.unit=n,this.minFractionDigits=i,this.maxFractionDigits=s;}static parse(t,e){if(3!==t.length)return e.error("Expected two arguments.");const r=e.parse(t[1],1,ue);if(!r)return null;const n=t[2];if("object"!=typeof n||Array.isArray(n))return e.error("NumberFormat options argument must be an object.");let i=null;if(n.locale&&(i=e.parse(n.locale,1,ce),!i))return null;let s=null;if(n.currency&&(s=e.parse(n.currency,1,ce),!s))return null;let a=null;if(n.unit&&(a=e.parse(n.unit,1,ce),!a))return null;let o=null;if(n["min-fraction-digits"]&&(o=e.parse(n["min-fraction-digits"],1,ue),!o))return null;let l=null;return n["max-fraction-digits"]&&(l=e.parse(n["max-fraction-digits"],1,ue),!l)?null:new In(r,i,s,a,o,l)}evaluate(t){return new Intl.NumberFormat(this.locale?this.locale.evaluate(t):[],{style:(this.currency?"currency":this.unit&&"unit")||"decimal",currency:this.currency?this.currency.evaluate(t):void 0,unit:this.unit?this.unit.evaluate(t):void 0,minimumFractionDigits:this.minFractionDigits?this.minFractionDigits.evaluate(t):void 0,maximumFractionDigits:this.maxFractionDigits?this.maxFractionDigits.evaluate(t):void 0}).format(this.number.evaluate(t))}eachChild(t){t(this.number),this.locale&&t(this.locale),this.currency&&t(this.currency),this.unit&&t(this.unit),this.minFractionDigits&&t(this.minFractionDigits),this.maxFractionDigits&&t(this.maxFractionDigits);}outputDefined(){return !1}serialize(){const t={};return this.locale&&(t.locale=this.locale.serialize()),this.currency&&(t.currency=this.currency.serialize()),this.unit&&(t.unit=this.unit.serialize()),this.minFractionDigits&&(t["min-fraction-digits"]=this.minFractionDigits.serialize()),this.maxFractionDigits&&(t["max-fraction-digits"]=this.maxFractionDigits.serialize()),["number-format",this.number.serialize(),t]}}class Mn{constructor(t){this.type=ue,this.input=t;}static parse(t,e){if(2!==t.length)return e.error(`Expected 1 argument, but found ${t.length-1} instead.`);const r=e.parse(t[1],1);return r?"array"!==r.type.kind&&"string"!==r.type.kind&&"value"!==r.type.kind?e.error(`Expected argument of type string or array, but found ${ve(r.type)} instead.`):new Mn(r):null}evaluate(t){const e=this.input.evaluate(t);if("string"==typeof e)return e.length;if(Array.isArray(e))return e.length;throw new Oe(`Expected value to be of type string or array, but found ${ve(Re(e))} instead.`)}eachChild(t){t(this.input);}outputDefined(){return !1}serialize(){const t=["length"];return this.eachChild((e=>{t.push(e.serialize());})),t}}const Tn={"==":bn,"!=":wn,">":An,"<":_n,">=":kn,"<=":Sn,array:Ge,at:an,boolean:Ge,case:fn,coalesce:en,collator:er,format:Ze,image:Ke,in:ln,"index-of":cn,interpolate:Qr,"interpolate-hcl":Qr,"interpolate-lab":Qr,length:Mn,let:nn,literal:je,match:pn,number:Ge,"number-format":In,object:Ge,slice:mn,step:Br,string:Ge,"to-boolean":He,"to-color":He,"to-number":He,"to-string":He,var:Sr,within:vr};function zn(t,[e,r,n,i]){e=e.evaluate(t),r=r.evaluate(t),n=n.evaluate(t);const s=i?i.evaluate(t):1,a=Le(e,r,n,s);if(a)throw new Oe(a);return new Ee(e/255*s,r/255*s,n/255*s,s)}function Bn(t,e){return t in e}function En(t,e){const r=e[t];return void 0===r?null:r}function Cn(t){return {type:t}}tr.register(Tn,{error:[{kind:"error"},[ce],(t,[e])=>{throw new Oe(e.evaluate(t))}],typeof:[ce,[fe],(t,[e])=>ve(Re(e.evaluate(t)))],"to-rgba":[xe(ue,4),[pe],(t,[e])=>e.evaluate(t).toArray()],rgb:[pe,[ue,ue,ue],zn],rgba:[pe,[ue,ue,ue,ue],zn],has:{type:he,overloads:[[[ce],(t,[e])=>Bn(e.evaluate(t),t.properties())],[[ce,de],(t,[e,r])=>Bn(e.evaluate(t),r.evaluate(t))]]},get:{type:fe,overloads:[[[ce],(t,[e])=>En(e.evaluate(t),t.properties())],[[ce,de],(t,[e,r])=>En(e.evaluate(t),r.evaluate(t))]]},"feature-state":[fe,[ce],(t,[e])=>En(e.evaluate(t),t.featureState||{})],properties:[de,[],t=>t.properties()],"geometry-type":[ce,[],t=>t.geometryType()],id:[fe,[],t=>t.id()],zoom:[ue,[],t=>t.globals.zoom],pitch:[ue,[],t=>t.globals.pitch||0],"distance-from-center":[ue,[],t=>t.distanceFromCenter()],"heatmap-density":[ue,[],t=>t.globals.heatmapDensity||0],"line-progress":[ue,[],t=>t.globals.lineProgress||0],"sky-radial-progress":[ue,[],t=>t.globals.skyRadialProgress||0],accumulated:[fe,[],t=>void 0===t.globals.accumulated?null:t.globals.accumulated],"+":[ue,Cn(ue),(t,e)=>{let r=0;for(const n of e)r+=n.evaluate(t);return r}],"*":[ue,Cn(ue),(t,e)=>{let r=1;for(const n of e)r*=n.evaluate(t);return r}],"-":{type:ue,overloads:[[[ue,ue],(t,[e,r])=>e.evaluate(t)-r.evaluate(t)],[[ue],(t,[e])=>-e.evaluate(t)]]},"/":[ue,[ue,ue],(t,[e,r])=>e.evaluate(t)/r.evaluate(t)],"%":[ue,[ue,ue],(t,[e,r])=>e.evaluate(t)%r.evaluate(t)],ln2:[ue,[],()=>Math.LN2],pi:[ue,[],()=>Math.PI],e:[ue,[],()=>Math.E],"^":[ue,[ue,ue],(t,[e,r])=>Math.pow(e.evaluate(t),r.evaluate(t))],sqrt:[ue,[ue],(t,[e])=>Math.sqrt(e.evaluate(t))],log10:[ue,[ue],(t,[e])=>Math.log(e.evaluate(t))/Math.LN10],ln:[ue,[ue],(t,[e])=>Math.log(e.evaluate(t))],log2:[ue,[ue],(t,[e])=>Math.log(e.evaluate(t))/Math.LN2],sin:[ue,[ue],(t,[e])=>Math.sin(e.evaluate(t))],cos:[ue,[ue],(t,[e])=>Math.cos(e.evaluate(t))],tan:[ue,[ue],(t,[e])=>Math.tan(e.evaluate(t))],asin:[ue,[ue],(t,[e])=>Math.asin(e.evaluate(t))],acos:[ue,[ue],(t,[e])=>Math.acos(e.evaluate(t))],atan:[ue,[ue],(t,[e])=>Math.atan(e.evaluate(t))],min:[ue,Cn(ue),(t,e)=>Math.min(...e.map((e=>e.evaluate(t))))],max:[ue,Cn(ue),(t,e)=>Math.max(...e.map((e=>e.evaluate(t))))],abs:[ue,[ue],(t,[e])=>Math.abs(e.evaluate(t))],round:[ue,[ue],(t,[e])=>{const r=e.evaluate(t);return r<0?-Math.round(-r):Math.round(r)}],floor:[ue,[ue],(t,[e])=>Math.floor(e.evaluate(t))],ceil:[ue,[ue],(t,[e])=>Math.ceil(e.evaluate(t))],"filter-==":[he,[ce,fe],(t,[e,r])=>t.properties()[e.value]===r.value],"filter-id-==":[he,[fe],(t,[e])=>t.id()===e.value],"filter-type-==":[he,[ce],(t,[e])=>t.geometryType()===e.value],"filter-<":[he,[ce,fe],(t,[e,r])=>{const n=t.properties()[e.value],i=r.value;return typeof n==typeof i&&n<i}],"filter-id-<":[he,[fe],(t,[e])=>{const r=t.id(),n=e.value;return typeof r==typeof n&&r<n}],"filter->":[he,[ce,fe],(t,[e,r])=>{const n=t.properties()[e.value],i=r.value;return typeof n==typeof i&&n>i}],"filter-id->":[he,[fe],(t,[e])=>{const r=t.id(),n=e.value;return typeof r==typeof n&&r>n}],"filter-<=":[he,[ce,fe],(t,[e,r])=>{const n=t.properties()[e.value],i=r.value;return typeof n==typeof i&&n<=i}],"filter-id-<=":[he,[fe],(t,[e])=>{const r=t.id(),n=e.value;return typeof r==typeof n&&r<=n}],"filter->=":[he,[ce,fe],(t,[e,r])=>{const n=t.properties()[e.value],i=r.value;return typeof n==typeof i&&n>=i}],"filter-id->=":[he,[fe],(t,[e])=>{const r=t.id(),n=e.value;return typeof r==typeof n&&r>=n}],"filter-has":[he,[fe],(t,[e])=>e.value in t.properties()],"filter-has-id":[he,[],t=>null!==t.id()&&void 0!==t.id()],"filter-type-in":[he,[xe(ce)],(t,[e])=>e.value.indexOf(t.geometryType())>=0],"filter-id-in":[he,[xe(fe)],(t,[e])=>e.value.indexOf(t.id())>=0],"filter-in-small":[he,[ce,xe(fe)],(t,[e,r])=>r.value.indexOf(t.properties()[e.value])>=0],"filter-in-large":[he,[ce,xe(fe)],(t,[e,r])=>function(t,e,r,n){for(;r<=n;){const i=r+n>>1;if(e[i]===t)return !0;e[i]>t?n=i-1:r=i+1;}return !1}(t.properties()[e.value],r.value,0,r.value.length-1)],all:{type:he,overloads:[[[he,he],(t,[e,r])=>e.evaluate(t)&&r.evaluate(t)],[Cn(he),(t,e)=>{for(const r of e)if(!r.evaluate(t))return !1;return !0}]]},any:{type:he,overloads:[[[he,he],(t,[e,r])=>e.evaluate(t)||r.evaluate(t)],[Cn(he),(t,e)=>{for(const r of e)if(r.evaluate(t))return !0;return !1}]]},"!":[he,[he],(t,[e])=>!e.evaluate(t)],"is-supported-script":[he,[ce],(t,[e])=>{const r=t.globals&&t.globals.isSupportedScript;return !r||r(e.evaluate(t))}],upcase:[ce,[ce],(t,[e])=>e.evaluate(t).toUpperCase()],downcase:[ce,[ce],(t,[e])=>e.evaluate(t).toLowerCase()],concat:[ce,Cn(fe),(t,e)=>e.map((e=>Ue(e.evaluate(t)))).join("")],"resolved-locale":[ce,[ye],(t,[e])=>e.evaluate(t).resolvedLocale()]});var Pn=Tn;function Dn(t){return {result:"success",value:t}}function Vn(t){return {result:"error",value:t}}function Ln(t){return "data-driven"===t["property-type"]}function Fn(t){return !!t.expression&&t.expression.parameters.indexOf("zoom")>-1}function Rn(t){return !!t.expression&&t.expression.interpolated}function Un(t){return t instanceof Number?"number":t instanceof String?"string":t instanceof Boolean?"boolean":Array.isArray(t)?"array":null===t?"null":typeof t}function $n(t){return "object"==typeof t&&null!==t&&!Array.isArray(t)}function jn(t){return t}function On(t,e){const r="color"===e.type,n=t.stops&&"object"==typeof t.stops[0][0],i=n||!(n||void 0!==t.property),s=t.type||(Rn(e)?"exponential":"interval");if(r&&((t=ee({},t)).stops&&(t.stops=t.stops.map((t=>[t[0],Ee.parse(t[1])]))),t.default=Ee.parse(t.default?t.default:e.default)),t.colorSpace&&"rgb"!==t.colorSpace&&!Hr[t.colorSpace])throw new Error(`Unknown color space: ${t.colorSpace}`);let a,o,l;if("exponential"===s)a=Zn;else if("interval"===s)a=Gn;else if("categorical"===s){a=Nn,o=Object.create(null);for(const e of t.stops)o[e[0]]=e[1];l=typeof t.stops[0][0];}else {if("identity"!==s)throw new Error(`Unknown function type "${s}"`);a=Kn;}if(n){const r={},n=[];for(let e=0;e<t.stops.length;e++){const i=t.stops[e],s=i[0].zoom;void 0===r[s]&&(r[s]={zoom:s,type:t.type,property:t.property,default:t.default,stops:[]},n.push(s)),r[s].stops.push([i[0].value,i[1]]);}const i=[];for(const t of n)i.push([r[t].zoom,On(r[t],e)]);const s={name:"linear"};return {kind:"composite",interpolationType:s,interpolationFactor:Qr.interpolationFactor.bind(void 0,s),zoomStops:i.map((t=>t[0])),evaluate:({zoom:r},n)=>Zn({stops:i,base:t.base},e,r).evaluate(r,n)}}if(i){const r="exponential"===s?{name:"exponential",base:void 0!==t.base?t.base:1}:null;return {kind:"camera",interpolationType:r,interpolationFactor:Qr.interpolationFactor.bind(void 0,r),zoomStops:t.stops.map((t=>t[0])),evaluate:({zoom:r})=>a(t,e,r,o,l)}}return {kind:"source",evaluate(r,n){const i=n&&n.properties?n.properties[t.property]:void 0;return void 0===i?qn(t.default,e.default):a(t,e,i,o,l)}}}function qn(t,e,r){return void 0!==t?t:void 0!==e?e:void 0!==r?r:void 0}function Nn(t,e,r,n,i){return qn(typeof r===i?n[r]:void 0,t.default,e.default)}function Gn(t,e,r){if("number"!==Un(r))return qn(t.default,e.default);const n=t.stops.length;if(1===n)return t.stops[0][1];if(r<=t.stops[0][0])return t.stops[0][1];if(r>=t.stops[n-1][0])return t.stops[n-1][1];const i=Tr(t.stops.map((t=>t[0])),r);return t.stops[i][1]}function Zn(t,e,r){const n=void 0!==t.base?t.base:1;if("number"!==Un(r))return qn(t.default,e.default);const i=t.stops.length;if(1===i)return t.stops[0][1];if(r<=t.stops[0][0])return t.stops[0][1];if(r>=t.stops[i-1][0])return t.stops[i-1][1];const s=Tr(t.stops.map((t=>t[0])),r),a=function(t,e,r,n){const i=n-r,s=t-r;return 0===i?0:1===e?s/i:(Math.pow(e,s)-1)/(Math.pow(e,i)-1)}(r,n,t.stops[s][0],t.stops[s+1][0]),o=t.stops[s][1],l=t.stops[s+1][1];let u=Cr[e.type]||jn;if(t.colorSpace&&"rgb"!==t.colorSpace){const e=Hr[t.colorSpace];u=(t,r)=>e.reverse(e.interpolate(e.forward(t),e.forward(r),a));}return "function"==typeof o.evaluate?{evaluate(...t){const e=o.evaluate.apply(void 0,t),r=l.evaluate.apply(void 0,t);if(void 0!==e&&void 0!==r)return u(e,r,a)}}:u(o,l,a)}function Kn(t,e,r){return "color"===e.type?r=Ee.parse(r):"formatted"===e.type?r=De.fromString(r.toString()):"resolvedImage"===e.type?r=Ve.fromString(r.toString()):Un(r)===e.type||"enum"===e.type&&e.values[r]||(r=void 0),qn(r,t.default,e.default)}class Xn{constructor(t,e){this.expression=t,this._warningHistory={},this._evaluator=new We,this._defaultValue=e?function(t){return "color"===t.type&&($n(t.default)||Array.isArray(t.default))?new Ee(0,0,0,0):"color"===t.type?Ee.parse(t.default)||null:void 0===t.default?null:t.default}(e):null,this._enumValues=e&&"enum"===e.type?e.values:null;}evaluateWithoutErrorHandling(t,e,r,n,i,s,a,o){return this._evaluator.globals=t,this._evaluator.feature=e,this._evaluator.featureState=r,this._evaluator.canonical=n||null,this._evaluator.availableImages=i||null,this._evaluator.formattedSection=s,this._evaluator.featureTileCoord=a||null,this._evaluator.featureDistanceData=o||null,this.expression.evaluate(this._evaluator)}evaluate(t,e,r,n,i,s,a,o){this._evaluator.globals=t,this._evaluator.feature=e||null,this._evaluator.featureState=r||null,this._evaluator.canonical=n||null,this._evaluator.availableImages=i||null,this._evaluator.formattedSection=s||null,this._evaluator.featureTileCoord=a||null,this._evaluator.featureDistanceData=o||null;try{const t=this.expression.evaluate(this._evaluator);if(null==t||"number"==typeof t&&t!=t)return this._defaultValue;if(this._enumValues&&!(t in this._enumValues))throw new Oe(`Expected value to be one of ${Object.keys(this._enumValues).map((t=>JSON.stringify(t))).join(", ")}, but found ${JSON.stringify(t)} instead.`);return t}catch(t){return this._warningHistory[t.message]||(this._warningHistory[t.message]=!0,"undefined"!=typeof console&&console.warn(t.message)),this._defaultValue}}}function Jn(t){return Array.isArray(t)&&t.length>0&&"string"==typeof t[0]&&t[0]in Pn}function Hn(t,e){const r=new Ir(Pn,[],e?function(t){const e={color:pe,string:ce,number:ue,enum:ce,boolean:he,formatted:me,resolvedImage:ge};return "array"===t.type?xe(e[t.value]||fe,t.length):e[t.type]}(e):void 0),n=r.parse(t,void 0,void 0,void 0,e&&"string"===e.type?{typeAnnotation:"coerce"}:void 0);return n?Dn(new Xn(n,e)):Vn(r.errors)}class Yn{constructor(t,e){this.kind=t,this._styleExpression=e,this.isStateDependent="constant"!==t&&!wr(e.expression);}evaluateWithoutErrorHandling(t,e,r,n,i,s){return this._styleExpression.evaluateWithoutErrorHandling(t,e,r,n,i,s)}evaluate(t,e,r,n,i,s){return this._styleExpression.evaluate(t,e,r,n,i,s)}}class Wn{constructor(t,e,r,n){this.kind=t,this.zoomStops=r,this._styleExpression=e,this.isStateDependent="camera"!==t&&!wr(e.expression),this.interpolationType=n;}evaluateWithoutErrorHandling(t,e,r,n,i,s){return this._styleExpression.evaluateWithoutErrorHandling(t,e,r,n,i,s)}evaluate(t,e,r,n,i,s){return this._styleExpression.evaluate(t,e,r,n,i,s)}interpolationFactor(t,e,r){return this.interpolationType?Qr.interpolationFactor(this.interpolationType,t,e,r):0}}function Qn(t,e){if("error"===(t=Hn(t,e)).result)return t;const r=t.value.expression,n=br(r);if(!n&&!Ln(e))return Vn([new se("","data expressions not supported")]);const i=_r(r,["zoom","pitch","distance-from-center"]);if(!i&&!Fn(e))return Vn([new se("","zoom expressions not supported")]);const s=ei(r);return s||i?s instanceof se?Vn([s]):s instanceof Qr&&!Rn(e)?Vn([new se("",'"interpolate" expressions cannot be used with this property')]):Dn(s?new Wn(n?"camera":"composite",t.value,s.labels,s instanceof Qr?s.interpolation:void 0):new Yn(n?"constant":"source",t.value)):Vn([new se("",'"zoom" expression may only be used as input to a top-level "step" or "interpolate" expression.')])}class ti{constructor(t,e){this._parameters=t,this._specification=e,ee(this,On(this._parameters,this._specification));}static deserialize(t){return new ti(t._parameters,t._specification)}static serialize(t){return {_parameters:t._parameters,_specification:t._specification}}}function ei(t){let e=null;if(t instanceof nn)e=ei(t.result);else if(t instanceof en){for(const r of t.args)if(e=ei(r),e)break}else (t instanceof Br||t instanceof Qr)&&t.input instanceof tr&&"zoom"===t.input.name&&(e=t);return e instanceof se||t.eachChild((t=>{const r=ei(t);r instanceof se?e=r:!e&&r?e=new se("",'"zoom" expression may only be used as input to a top-level "step" or "interpolate" expression.'):e&&r&&e!==r&&(e=new se("",'Only one zoom-based "step" or "interpolate" subexpression may be used in an expression.'));})),e}class ri{constructor(t,e,r,n){this.message=(t?`${t}: `:"")+r,n&&(this.identifier=n),null!=e&&e.__line__&&(this.line=e.__line__);}}function ni(t){const e=t.key,r=t.value,n=t.valueSpec||{},i=t.objectElementValidators||{},s=t.style,a=t.styleSpec;let o=[];const l=Un(r);if("object"!==l)return [new ri(e,r,`object expected, ${l} found`)];for(const t in r){const l=t.split(".")[0];let u;i[l]?u=i[l]:n[l]?u=Fi:i["*"]?u=i["*"]:n["*"]&&(u=Fi),u?o=o.concat(u({key:(e?`${e}.`:e)+t,value:r[t],valueSpec:n[l]||n["*"],style:s,styleSpec:a,object:r,objectKey:t},r)):o.push(new ri(e,r[t],`unknown property "${t}"`));}for(const t in n)i[t]||n[t].required&&void 0===n[t].default&&void 0===r[t]&&o.push(new ri(e,r,`missing required property "${t}"`));return o}function ii(t){const e=t.value,r=t.valueSpec,n=t.style,i=t.styleSpec,s=t.key,a=t.arrayElementValidator||Fi;if("array"!==Un(e))return [new ri(s,e,`array expected, ${Un(e)} found`)];if(r.length&&e.length!==r.length)return [new ri(s,e,`array length ${r.length} expected, length ${e.length} found`)];if(r["min-length"]&&e.length<r["min-length"])return [new ri(s,e,`array length at least ${r["min-length"]} expected, length ${e.length} found`)];let o={type:r.value,values:r.values,minimum:r.minimum,maximum:r.maximum,function:void 0};i.$version<7&&(o.function=r.function),"object"===Un(r.value)&&(o=r.value);let l=[];for(let t=0;t<e.length;t++)l=l.concat(a({array:e,arrayIndex:t,value:e[t],valueSpec:o,style:n,styleSpec:i,key:`${s}[${t}]`}));return l}function si(t){const e=t.key,r=t.value,n=t.valueSpec;let i=Un(r);if("number"===i&&r!=r&&(i="NaN"),"number"!==i)return [new ri(e,r,`number expected, ${i} found`)];if("minimum"in n){let i=n.minimum;if("array"===Un(n.minimum)&&(i=n.minimum[t.arrayIndex]),r<i)return [new ri(e,r,`${r} is less than the minimum value ${i}`)]}if("maximum"in n){let i=n.maximum;if("array"===Un(n.maximum)&&(i=n.maximum[t.arrayIndex]),r>i)return [new ri(e,r,`${r} is greater than the maximum value ${i}`)]}return []}function ai(t){const e=t.valueSpec,r=re(t.value.type);let n,i,s,a={};const o="categorical"!==r&&void 0===t.value.property,l=!o,u="array"===Un(t.value.stops)&&"array"===Un(t.value.stops[0])&&"object"===Un(t.value.stops[0][0]),c=ni({key:t.key,value:t.value,valueSpec:t.styleSpec.function,style:t.style,styleSpec:t.styleSpec,objectElementValidators:{stops:function(t){if("identity"===r)return [new ri(t.key,t.value,'identity function may not have a "stops" property')];let e=[];const n=t.value;return e=e.concat(ii({key:t.key,value:n,valueSpec:t.valueSpec,style:t.style,styleSpec:t.styleSpec,arrayElementValidator:h})),"array"===Un(n)&&0===n.length&&e.push(new ri(t.key,n,"array must have at least one stop")),e},default:function(t){return Fi({key:t.key,value:t.value,valueSpec:e,style:t.style,styleSpec:t.styleSpec})}}});return "identity"===r&&o&&c.push(new ri(t.key,t.value,'missing required property "property"')),"identity"===r||t.value.stops||c.push(new ri(t.key,t.value,'missing required property "stops"')),"exponential"===r&&t.valueSpec.expression&&!Rn(t.valueSpec)&&c.push(new ri(t.key,t.value,"exponential functions not supported")),t.styleSpec.$version>=8&&(l&&!Ln(t.valueSpec)?c.push(new ri(t.key,t.value,"property functions not supported")):o&&!Fn(t.valueSpec)&&c.push(new ri(t.key,t.value,"zoom functions not supported"))),"categorical"!==r&&!u||void 0!==t.value.property||c.push(new ri(t.key,t.value,'"property" property is required')),c;function h(t){let r=[];const n=t.value,o=t.key;if("array"!==Un(n))return [new ri(o,n,`array expected, ${Un(n)} found`)];if(2!==n.length)return [new ri(o,n,`array length 2 expected, length ${n.length} found`)];if(u){if("object"!==Un(n[0]))return [new ri(o,n,`object expected, ${Un(n[0])} found`)];if(void 0===n[0].zoom)return [new ri(o,n,"object stop key must have zoom")];if(void 0===n[0].value)return [new ri(o,n,"object stop key must have value")];const e=re(n[0].zoom);if("number"!=typeof e)return [new ri(o,n[0].zoom,"stop zoom values must be numbers")];if(s&&s>e)return [new ri(o,n[0].zoom,"stop zoom values must appear in ascending order")];e!==s&&(s=e,i=void 0,a={}),r=r.concat(ni({key:`${o}[0]`,value:n[0],valueSpec:{zoom:{}},style:t.style,styleSpec:t.styleSpec,objectElementValidators:{zoom:si,value:p}}));}else r=r.concat(p({key:`${o}[0]`,value:n[0],valueSpec:{},style:t.style,styleSpec:t.styleSpec},n));return Jn(ne(n[1]))?r.concat([new ri(`${o}[1]`,n[1],"expressions are not allowed in function stops.")]):r.concat(Fi({key:`${o}[1]`,value:n[1],valueSpec:e,style:t.style,styleSpec:t.styleSpec}))}function p(t,s){const o=Un(t.value),l=re(t.value),u=null!==t.value?t.value:s;if(n){if(o!==n)return [new ri(t.key,u,`${o} stop domain type must match previous stop domain type ${n}`)]}else n=o;if("number"!==o&&"string"!==o&&"boolean"!==o&&"number"!=typeof l&&"string"!=typeof l&&"boolean"!=typeof l)return [new ri(t.key,u,"stop domain value must be a number, string, or boolean")];if("number"!==o&&"categorical"!==r){let n=`number expected, ${o} found`;return Ln(e)&&void 0===r&&(n+='\nIf you intended to use a categorical function, specify `"type": "categorical"`.'),[new ri(t.key,u,n)]}return "categorical"!==r||"number"!==o||"number"==typeof l&&isFinite(l)&&Math.floor(l)===l?"categorical"!==r&&"number"===o&&"number"==typeof l&&"number"==typeof i&&void 0!==i&&l<i?[new ri(t.key,u,"stop domain values must appear in ascending order")]:(i=l,"categorical"===r&&l in a?[new ri(t.key,u,"stop domain values must be unique")]:(a[l]=!0,[])):[new ri(t.key,u,`integer expected, found ${String(l)}`)]}}function oi(t){const e=("property"===t.expressionContext?Qn:Hn)(ne(t.value),t.valueSpec);if("error"===e.result)return e.value.map((e=>new ri(`${t.key}${e.key}`,t.value,e.message)));const r=e.value.expression||e.value._styleExpression.expression;if("property"===t.expressionContext&&"text-font"===t.propertyKey&&!r.outputDefined())return [new ri(t.key,t.value,`Invalid data expression for "${t.propertyKey}". Output values must be contained as literals within the expression.`)];if("property"===t.expressionContext&&"layout"===t.propertyType&&!wr(r))return [new ri(t.key,t.value,'"feature-state" data expressions are not supported with layout properties.')];if("filter"===t.expressionContext)return li(r,t);if(t.expressionContext&&0===t.expressionContext.indexOf("cluster")){if(!_r(r,["zoom","feature-state"]))return [new ri(t.key,t.value,'"zoom" and "feature-state" expressions are not supported with cluster properties.')];if("cluster-initial"===t.expressionContext&&!br(r))return [new ri(t.key,t.value,"Feature data expressions are not supported with initial expression part of cluster properties.")]}return []}function li(t,e){const r=new Set(["zoom","feature-state","pitch","distance-from-center"]);if(e.valueSpec&&e.valueSpec.expression)for(const t of e.valueSpec.expression.parameters)r.delete(t);if(0===r.size)return [];const n=[];return t instanceof tr&&r.has(t.name)?[new ri(e.key,e.value,`["${t.name}"] expression is not supported in a filter for a ${e.object.type} layer with id: ${e.object.id}`)]:(t.eachChild((t=>{n.push(...li(t,e));})),n)}function ui(t){const e=t.key,r=t.value,n=t.valueSpec,i=[];return Array.isArray(n.values)?-1===n.values.indexOf(re(r))&&i.push(new ri(e,r,`expected one of [${n.values.join(", ")}], ${JSON.stringify(r)} found`)):-1===Object.keys(n.values).indexOf(re(r))&&i.push(new ri(e,r,`expected one of [${Object.keys(n.values).join(", ")}], ${JSON.stringify(r)} found`)),i}function ci(t){if(!0===t||!1===t)return !0;if(!Array.isArray(t)||0===t.length)return !1;switch(t[0]){case"has":return t.length>=2&&"$id"!==t[1]&&"$type"!==t[1];case"in":return t.length>=3&&("string"!=typeof t[1]||Array.isArray(t[2]));case"!in":case"!has":case"none":return !1;case"==":case"!=":case">":case">=":case"<":case"<=":return 3!==t.length||Array.isArray(t[1])||Array.isArray(t[2]);case"any":case"all":for(const e of t.slice(1))if(!ci(e)&&"boolean"!=typeof e)return !1;return !0;default:return !0}}function hi(t,e="fill"){if(null==t)return {filter:()=>!0,needGeometry:!1,needFeature:!1};ci(t)||(t=xi(t));const r=t;let n=!0;try{n=function(t){if(!fi(t))return t;let e=ne(t);return di(e),e=pi(e),e}(r);}catch(t){console.warn(`Failed to extract static filter. Filter will continue working, but at higher memory usage and slower framerate.\nThis is most likely a bug, please report this via https://github.com/mapbox/mapbox-gl-js/issues/new?assignees=&labels=&template=Bug_report.md\nand paste the contents of this message in the report.\nThank you!\nFilter Expression:\n${JSON.stringify(r,null,2)}\n        `);}const i=te[`filter_${e}`],s=Hn(n,i);let a=null;if("error"===s.result)throw new Error(s.value.map((t=>`${t.key}: ${t.message}`)).join(", "));a=(t,e,r)=>s.value.evaluate(t,e,{},r);let o=null,l=null;if(n!==r){const t=Hn(r,i);if("error"===t.result)throw new Error(t.value.map((t=>`${t.key}: ${t.message}`)).join(", "));o=(e,r,n,i,s)=>t.value.evaluate(e,r,{},n,void 0,void 0,i,s),l=!br(t.value.expression);}return {filter:a,dynamicFilter:o||void 0,needGeometry:gi(n),needFeature:!!l}}function pi(t){if(!Array.isArray(t))return t;const e=function(t){if(yi.has(t[0]))for(let e=1;e<t.length;e++)if(fi(t[e]))return !0;return t}(t);return !0===e?e:e.map((t=>pi(t)))}function di(t){let e=!1;const r=[];if("case"===t[0]){for(let n=1;n<t.length-1;n+=2)e=e||fi(t[n]),r.push(t[n+1]);r.push(t[t.length-1]);}else if("match"===t[0]){e=e||fi(t[1]);for(let e=2;e<t.length-1;e+=2)r.push(t[e+1]);r.push(t[t.length-1]);}else if("step"===t[0]){e=e||fi(t[1]);for(let e=1;e<t.length-1;e+=2)r.push(t[e+1]);}e&&(t.length=0,t.push("any",...r));for(let e=1;e<t.length;e++)di(t[e]);}function fi(t){if(!Array.isArray(t))return !1;if("pitch"===(e=t[0])||"distance-from-center"===e)return !0;var e;for(let e=1;e<t.length;e++)if(fi(t[e]))return !0;return !1}const yi=new Set(["in","==","!=",">",">=","<","<=","to-boolean"]);function mi(t,e){return t<e?-1:t>e?1:0}function gi(t){if(!Array.isArray(t))return !1;if("within"===t[0])return !0;for(let e=1;e<t.length;e++)if(gi(t[e]))return !0;return !1}function xi(t){if(!t)return !0;const e=t[0];return t.length<=1?"any"!==e:"=="===e?vi(t[1],t[2],"=="):"!="===e?_i(vi(t[1],t[2],"==")):"<"===e||">"===e||"<="===e||">="===e?vi(t[1],t[2],e):"any"===e?(r=t.slice(1),["any"].concat(r.map(xi))):"all"===e?["all"].concat(t.slice(1).map(xi)):"none"===e?["all"].concat(t.slice(1).map(xi).map(_i)):"in"===e?bi(t[1],t.slice(2)):"!in"===e?_i(bi(t[1],t.slice(2))):"has"===e?wi(t[1]):"!has"===e?_i(wi(t[1])):"within"!==e||t;var r;}function vi(t,e,r){switch(t){case"$type":return [`filter-type-${r}`,e];case"$id":return [`filter-id-${r}`,e];default:return [`filter-${r}`,t,e]}}function bi(t,e){if(0===e.length)return !1;switch(t){case"$type":return ["filter-type-in",["literal",e]];case"$id":return ["filter-id-in",["literal",e]];default:return e.length>200&&!e.some((t=>typeof t!=typeof e[0]))?["filter-in-large",t,["literal",e.sort(mi)]]:["filter-in-small",t,["literal",e]]}}function wi(t){switch(t){case"$type":return !0;case"$id":return ["filter-has-id"];default:return ["filter-has",t]}}function _i(t){return ["!",t]}function Ai(t){return ci(ne(t.value))?oi(ee({},t,{expressionContext:"filter",valueSpec:t.styleSpec[`filter_${t.layerType||"fill"}`]})):Si(t)}function Si(t){const e=t.value,r=t.key;if("array"!==Un(e))return [new ri(r,e,`array expected, ${Un(e)} found`)];const n=t.styleSpec;let i,s=[];if(e.length<1)return [new ri(r,e,"filter array must have at least 1 element")];switch(s=s.concat(ui({key:`${r}[0]`,value:e[0],valueSpec:n.filter_operator,style:t.style,styleSpec:t.styleSpec})),re(e[0])){case"<":case"<=":case">":case">=":e.length>=2&&"$type"===re(e[1])&&s.push(new ri(r,e,`"$type" cannot be use with operator "${e[0]}"`));case"==":case"!=":3!==e.length&&s.push(new ri(r,e,`filter array for operator "${e[0]}" must have 3 elements`));case"in":case"!in":e.length>=2&&(i=Un(e[1]),"string"!==i&&s.push(new ri(`${r}[1]`,e[1],`string expected, ${i} found`)));for(let a=2;a<e.length;a++)i=Un(e[a]),"$type"===re(e[1])?s=s.concat(ui({key:`${r}[${a}]`,value:e[a],valueSpec:n.geometry_type,style:t.style,styleSpec:t.styleSpec})):"string"!==i&&"number"!==i&&"boolean"!==i&&s.push(new ri(`${r}[${a}]`,e[a],`string, number, or boolean expected, ${i} found`));break;case"any":case"all":case"none":for(let n=1;n<e.length;n++)s=s.concat(Si({key:`${r}[${n}]`,value:e[n],style:t.style,styleSpec:t.styleSpec}));break;case"has":case"!has":i=Un(e[1]),2!==e.length?s.push(new ri(r,e,`filter array for "${e[0]}" operator must have 2 elements`)):"string"!==i&&s.push(new ri(`${r}[1]`,e[1],`string expected, ${i} found`));break;case"within":i=Un(e[1]),2!==e.length?s.push(new ri(r,e,`filter array for "${e[0]}" operator must have 2 elements`)):"object"!==i&&s.push(new ri(`${r}[1]`,e[1],`object expected, ${i} found`));}return s}function ki(t,e){const r=t.key,n=t.style,i=t.styleSpec,s=t.value,a=t.objectKey,o=i[`${e}_${t.layerType}`];if(!o)return [];const l=a.match(/^(.*)-transition$/);if("paint"===e&&l&&o[l[1]]&&o[l[1]].transition)return Fi({key:r,value:s,valueSpec:i.transition,style:n,styleSpec:i});const u=t.valueSpec||o[a];if(!u)return [new ri(r,s,`unknown property "${a}"`)];let c;if("string"===Un(s)&&Ln(u)&&!u.tokens&&(c=/^{([^}]+)}$/.exec(s))){const t=`\`{ "type": "identity", "property": ${c?JSON.stringify(c[1]):'"_"'} }\``;return [new ri(r,s,`"${a}" does not support interpolation syntax\nUse an identity property function instead: ${t}.`)]}const h=[];return "symbol"===t.layerType&&("text-field"===a&&n&&!n.glyphs&&h.push(new ri(r,s,'use of "text-field" requires a style "glyphs" property')),"text-font"===a&&$n(ne(s))&&"identity"===re(s.type)&&h.push(new ri(r,s,'"text-font" does not support identity functions'))),h.concat(Fi({key:t.key,value:s,valueSpec:u,style:n,styleSpec:i,expressionContext:"property",propertyType:e,propertyKey:a}))}function Ii(t){return ki(t,"paint")}function Mi(t){return ki(t,"layout")}function Ti(t){let e=[];const r=t.value,n=t.key,i=t.style,s=t.styleSpec;r.type||r.ref||e.push(new ri(n,r,'either "type" or "ref" is required'));let a=re(r.type);const o=re(r.ref);if(r.id){const s=re(r.id);for(let a=0;a<t.arrayIndex;a++){const t=i.layers[a];re(t.id)===s&&e.push(new ri(n,r.id,`duplicate layer id "${r.id}", previously used at line ${t.id.__line__}`));}}if("ref"in r){let t;["type","source","source-layer","filter","layout"].forEach((t=>{t in r&&e.push(new ri(n,r[t],`"${t}" is prohibited for ref layers`));})),i.layers.forEach((e=>{re(e.id)===o&&(t=e);})),t?t.ref?e.push(new ri(n,r.ref,"ref cannot reference another ref layer")):a=re(t.type):"string"==typeof o&&e.push(new ri(n,r.ref,`ref layer "${o}" not found`));}else if("background"!==a&&"sky"!==a)if(r.source){const t=i.sources&&i.sources[r.source],s=t&&re(t.type);t?"vector"===s&&"raster"===a?e.push(new ri(n,r.source,`layer "${r.id}" requires a raster source`)):"raster"===s&&"raster"!==a?e.push(new ri(n,r.source,`layer "${r.id}" requires a vector source`)):"vector"!==s||r["source-layer"]?"raster-dem"===s&&"hillshade"!==a?e.push(new ri(n,r.source,"raster-dem source can only be used with layer type 'hillshade'.")):"line"!==a||!r.paint||!r.paint["line-gradient"]&&!r.paint["line-trim-offset"]||"geojson"===s&&t.lineMetrics||e.push(new ri(n,r,`layer "${r.id}" specifies a line-gradient, which requires a GeoJSON source with \`lineMetrics\` enabled.`)):e.push(new ri(n,r,`layer "${r.id}" must specify a "source-layer"`)):e.push(new ri(n,r.source,`source "${r.source}" not found`));}else e.push(new ri(n,r,'missing required property "source"'));return e=e.concat(ni({key:n,value:r,valueSpec:s.layer,style:t.style,styleSpec:t.styleSpec,objectElementValidators:{"*":()=>[],type:()=>Fi({key:`${n}.type`,value:r.type,valueSpec:s.layer.type,style:t.style,styleSpec:t.styleSpec,object:r,objectKey:"type"}),filter:t=>Ai(ee({layerType:a},t)),layout:t=>ni({layer:r,key:t.key,value:t.value,valueSpec:{},style:t.style,styleSpec:t.styleSpec,objectElementValidators:{"*":t=>Mi(ee({layerType:a},t))}}),paint:t=>ni({layer:r,key:t.key,value:t.value,valueSpec:{},style:t.style,styleSpec:t.styleSpec,objectElementValidators:{"*":t=>Ii(ee({layerType:a},t))}})}})),e}function zi(t){const e=t.value,r=t.key,n=Un(e);return "string"!==n?[new ri(r,e,`string expected, ${n} found`)]:[]}const Bi={promoteId:function({key:t,value:e}){if("string"===Un(e))return zi({key:t,value:e});{const r=[];for(const n in e)r.push(...zi({key:`${t}.${n}`,value:e[n]}));return r}}};function Ei(t){const e=t.value,r=t.key,n=t.styleSpec,i=t.style;if(!e.type)return [new ri(r,e,'"type" is required')];const s=re(e.type);let a;switch(s){case"vector":case"raster":case"raster-dem":return a=ni({key:r,value:e,valueSpec:n[`source_${s.replace("-","_")}`],style:t.style,styleSpec:n,objectElementValidators:Bi}),a;case"geojson":if(a=ni({key:r,value:e,valueSpec:n.source_geojson,style:i,styleSpec:n,objectElementValidators:Bi}),e.cluster)for(const t in e.clusterProperties){const[n,i]=e.clusterProperties[t],s="string"==typeof n?[n,["accumulated"],["get",t]]:n;a.push(...oi({key:`${r}.${t}.map`,value:i,expressionContext:"cluster-map"})),a.push(...oi({key:`${r}.${t}.reduce`,value:s,expressionContext:"cluster-reduce"}));}return a;case"video":return ni({key:r,value:e,valueSpec:n.source_video,style:i,styleSpec:n});case"image":return ni({key:r,value:e,valueSpec:n.source_image,style:i,styleSpec:n});case"canvas":return [new ri(r,null,"Please use runtime APIs to add canvas sources, rather than including them in stylesheets.","source.canvas")];default:return ui({key:`${r}.type`,value:e.type,valueSpec:{values:Ci(n)},style:i,styleSpec:n})}}function Ci(t){return t.source.reduce(((e,r)=>{const n=t[r];return "enum"===n.type.type&&(e=e.concat(Object.keys(n.type.values))),e}),[])}function Pi(t){const e=t.value,r=t.styleSpec,n=r.light,i=t.style;let s=[];const a=Un(e);if(void 0===e)return s;if("object"!==a)return s=s.concat([new ri("light",e,`object expected, ${a} found`)]),s;for(const t in e){const a=t.match(/^(.*)-transition$/);s=s.concat(a&&n[a[1]]&&n[a[1]].transition?Fi({key:t,value:e[t],valueSpec:r.transition,style:i,styleSpec:r}):n[t]?Fi({key:t,value:e[t],valueSpec:n[t],style:i,styleSpec:r}):[new ri(t,e[t],`unknown property "${t}"`)]);}return s}function Di(t){const e=t.value,r=t.key,n=t.style,i=t.styleSpec,s=i.terrain;let a=[];const o=Un(e);if(void 0===e)return a;if("object"!==o)return a=a.concat([new ri("terrain",e,`object expected, ${o} found`)]),a;for(const t in e){const r=t.match(/^(.*)-transition$/);a=a.concat(r&&s[r[1]]&&s[r[1]].transition?Fi({key:t,value:e[t],valueSpec:i.transition,style:n,styleSpec:i}):s[t]?Fi({key:t,value:e[t],valueSpec:s[t],style:n,styleSpec:i}):[new ri(t,e[t],`unknown property "${t}"`)]);}if(e.source){const t=n.sources&&n.sources[e.source],i=t&&re(t.type);t?"raster-dem"!==i&&a.push(new ri(r,e.source,`terrain cannot be used with a source of type ${String(i)}, it only be used with a "raster-dem" source type`)):a.push(new ri(r,e.source,`source "${e.source}" not found`));}else a.push(new ri(r,e,'terrain is missing required property "source"'));return a}function Vi(t){const e=t.value,r=t.style,n=t.styleSpec,i=n.fog;let s=[];const a=Un(e);if(void 0===e)return s;if("object"!==a)return s=s.concat([new ri("fog",e,`object expected, ${a} found`)]),s;for(const t in e){const a=t.match(/^(.*)-transition$/);s=s.concat(a&&i[a[1]]&&i[a[1]].transition?Fi({key:t,value:e[t],valueSpec:n.transition,style:r,styleSpec:n}):i[t]?Fi({key:t,value:e[t],valueSpec:i[t],style:r,styleSpec:n}):[new ri(t,e[t],`unknown property "${t}"`)]);}return s}const Li={"*":()=>[],array:ii,boolean:function(t){const e=t.value,r=t.key,n=Un(e);return "boolean"!==n?[new ri(r,e,`boolean expected, ${n} found`)]:[]},number:si,color:function(t){const e=t.key,r=t.value,n=Un(r);return "string"!==n?[new ri(e,r,`color expected, ${n} found`)]:null===Se(r)?[new ri(e,r,`color expected, "${r}" found`)]:[]},enum:ui,filter:Ai,function:ai,layer:Ti,object:ni,source:Ei,light:Pi,terrain:Di,fog:Vi,string:zi,formatted:function(t){return 0===zi(t).length?[]:oi(t)},resolvedImage:function(t){return 0===zi(t).length?[]:oi(t)},projection:function(t){const e=t.value,r=t.styleSpec,n=r.projection,i=t.style;let s=[];const a=Un(e);if("object"===a)for(const t in e)s=s.concat(Fi({key:t,value:e[t],valueSpec:n[t],style:i,styleSpec:r}));else "string"!==a&&(s=s.concat([new ri("projection",e,`object or string expected, ${a} found`)]));return s}};function Fi(t){const e=t.value,r=t.valueSpec,n=t.styleSpec;return r.expression&&$n(re(e))?ai(t):r.expression&&Jn(ne(e))?oi(t):r.type&&Li[r.type]?Li[r.type](t):ni(ee({},t,{valueSpec:r.type?n[r.type]:r}))}function Ri(t){const e=t.value,r=t.key,n=zi(t);return n.length||(-1===e.indexOf("{fontstack}")&&n.push(new ri(r,e,'"glyphs" url must include a "{fontstack}" token')),-1===e.indexOf("{range}")&&n.push(new ri(r,e,'"glyphs" url must include a "{range}" token'))),n}function Ui(t,e=te){return Oi(Fi({key:"",value:t,valueSpec:e.$root,styleSpec:e,style:t,objectElementValidators:{glyphs:Ri,"*":()=>[]}}))}const $i=t=>Oi(Ii(t)),ji=t=>Oi(Mi(t));function Oi(t){return t.slice().sort(((t,e)=>t.line&&e.line?t.line-e.line:0))}function qi(t,e){let r=!1;if(e&&e.length)for(const n of e)t.fire(new Wt(new Error(n.message))),r=!0;return r}var Ni=Zi,Gi=3;function Zi(t,e,r){var n=this.cells=[];if(t instanceof ArrayBuffer){this.arrayBuffer=t;var i=new Int32Array(this.arrayBuffer);t=i[0],this.d=(e=i[1])+2*(r=i[2]);for(var s=0;s<this.d*this.d;s++){var a=i[Gi+s],o=i[Gi+s+1];n.push(a===o?null:i.subarray(a,o));}var l=i[Gi+n.length+1];this.keys=i.subarray(i[Gi+n.length],l),this.bboxes=i.subarray(l),this.insert=this._insertReadonly;}else {this.d=e+2*r;for(var u=0;u<this.d*this.d;u++)n.push([]);this.keys=[],this.bboxes=[];}this.n=e,this.extent=t,this.padding=r,this.scale=e/t,this.uid=0;var c=r/e*t;this.min=-c,this.max=t+c;}Zi.prototype.insert=function(t,e,r,n,i){this._forEachCell(e,r,n,i,this._insertCell,this.uid++),this.keys.push(t),this.bboxes.push(e),this.bboxes.push(r),this.bboxes.push(n),this.bboxes.push(i);},Zi.prototype._insertReadonly=function(){throw "Cannot insert into a GridIndex created from an ArrayBuffer."},Zi.prototype._insertCell=function(t,e,r,n,i,s){this.cells[i].push(s);},Zi.prototype.query=function(t,e,r,n,i){var s=this.min,a=this.max;if(t<=s&&e<=s&&a<=r&&a<=n&&!i)return Array.prototype.slice.call(this.keys);var o=[];return this._forEachCell(t,e,r,n,this._queryCell,o,{},i),o},Zi.prototype._queryCell=function(t,e,r,n,i,s,a,o){var l=this.cells[i];if(null!==l)for(var u=this.keys,c=this.bboxes,h=0;h<l.length;h++){var p=l[h];if(void 0===a[p]){var d=4*p;(o?o(c[d+0],c[d+1],c[d+2],c[d+3]):t<=c[d+2]&&e<=c[d+3]&&r>=c[d+0]&&n>=c[d+1])?(a[p]=!0,s.push(u[p])):a[p]=!1;}}},Zi.prototype._forEachCell=function(t,e,r,n,i,s,a,o){for(var l=this._convertToCellCoord(t),u=this._convertToCellCoord(e),c=this._convertToCellCoord(r),h=this._convertToCellCoord(n),p=l;p<=c;p++)for(var d=u;d<=h;d++){var f=this.d*d+p;if((!o||o(this._convertFromCellCoord(p),this._convertFromCellCoord(d),this._convertFromCellCoord(p+1),this._convertFromCellCoord(d+1)))&&i.call(this,t,e,r,n,f,s,a,o))return}},Zi.prototype._convertFromCellCoord=function(t){return (t-this.padding)/this.scale},Zi.prototype._convertToCellCoord=function(t){return Math.max(0,Math.min(this.d-1,Math.floor(t*this.scale)+this.padding))},Zi.prototype.toArrayBuffer=function(){if(this.arrayBuffer)return this.arrayBuffer;for(var t=this.cells,e=Gi+this.cells.length+1+1,r=0,n=0;n<this.cells.length;n++)r+=this.cells[n].length;var i=new Int32Array(e+r+this.keys.length+this.bboxes.length);i[0]=this.extent,i[1]=this.n,i[2]=this.padding;for(var s=e,a=0;a<t.length;a++){var o=t[a];i[Gi+a]=s,i.set(o,s),s+=o.length;}return i[Gi+t.length]=s,i.set(this.keys,s),i[Gi+t.length+1]=s+=this.keys.length,i.set(this.bboxes,s),s+=this.bboxes.length,i.buffer};var Ki=p(Ni);const Xi={};function Ji(t,e,r={}){Object.defineProperty(t,"_classRegistryKey",{value:e,writeable:!1}),Xi[e]={klass:t,omit:r.omit||[]};}Ji(Object,"Object"),Ki.serialize=function(t,e){const r=t.toArrayBuffer();return e&&e.push(r),{buffer:r}},Ki.deserialize=function(t){return new Ki(t.buffer)},Object.defineProperty(Ki,"name",{value:"Grid"}),Ji(Ki,"Grid"),Ji(Ee,"Color"),Ji(Error,"Error"),Ji(ut,"AJAXError"),Ji(Ve,"ResolvedImage"),Ji(ti,"StylePropertyFunction"),Ji(Xn,"StyleExpression",{omit:["_evaluator"]}),Ji(Wn,"ZoomDependentExpression"),Ji(Yn,"ZoomConstantExpression"),Ji(tr,"CompoundExpression",{omit:["_evaluate"]});for(const t in Pn)Xi[Pn[t]._classRegistryKey]||Ji(Pn[t],`Expression${t}`);function Hi(t){return t&&"undefined"!=typeof ArrayBuffer&&(t instanceof ArrayBuffer||t.constructor&&"ArrayBuffer"===t.constructor.name)}function Yi(t){return e.ImageBitmap&&t instanceof e.ImageBitmap}function Wi(t,r){if(null==t||"boolean"==typeof t||"number"==typeof t||"string"==typeof t||t instanceof Boolean||t instanceof Number||t instanceof String||t instanceof Date||t instanceof RegExp)return t;if(Hi(t)||Yi(t))return r&&r.push(t),t;if(ArrayBuffer.isView(t)){const e=t;return r&&r.push(e.buffer),e}if(t instanceof e.ImageData)return r&&r.push(t.data.buffer),t;if(Array.isArray(t)){const e=[];for(const n of t)e.push(Wi(n,r));return e}if("object"==typeof t){const e=t.constructor,n=e._classRegistryKey;if(!n)throw new Error(`can't serialize object of unregistered class ${n}`);const i=e.serialize?e.serialize(t,r):{};if(!e.serialize){for(const e in t)t.hasOwnProperty(e)&&(Xi[n].omit.indexOf(e)>=0||(i[e]=Wi(t[e],r)));t instanceof Error&&(i.message=t.message);}if(i.$name)throw new Error("$name property is reserved for worker serialization logic.");return "Object"!==n&&(i.$name=n),i}throw new Error("can't serialize object of type "+typeof t)}function Qi(t){if(null==t||"boolean"==typeof t||"number"==typeof t||"string"==typeof t||t instanceof Boolean||t instanceof Number||t instanceof String||t instanceof Date||t instanceof RegExp||Hi(t)||Yi(t)||ArrayBuffer.isView(t)||t instanceof e.ImageData)return t;if(Array.isArray(t))return t.map(Qi);if("object"==typeof t){const e=t.$name||"Object",{klass:r}=Xi[e];if(!r)throw new Error(`can't deserialize unregistered class ${e}`);if(r.deserialize)return r.deserialize(t);const n=Object.create(r.prototype);for(const e of Object.keys(t))"$name"!==e&&(n[e]=Qi(t[e]));return n}throw new Error("can't deserialize object of type "+typeof t)}const ts={"Latin-1 Supplement":t=>t>=128&&t<=255,Arabic:t=>t>=1536&&t<=1791,"Arabic Supplement":t=>t>=1872&&t<=1919,"Arabic Extended-A":t=>t>=2208&&t<=2303,"Hangul Jamo":t=>t>=4352&&t<=4607,"Unified Canadian Aboriginal Syllabics":t=>t>=5120&&t<=5759,Khmer:t=>t>=6016&&t<=6143,"Unified Canadian Aboriginal Syllabics Extended":t=>t>=6320&&t<=6399,"General Punctuation":t=>t>=8192&&t<=8303,"Letterlike Symbols":t=>t>=8448&&t<=8527,"Number Forms":t=>t>=8528&&t<=8591,"Miscellaneous Technical":t=>t>=8960&&t<=9215,"Control Pictures":t=>t>=9216&&t<=9279,"Optical Character Recognition":t=>t>=9280&&t<=9311,"Enclosed Alphanumerics":t=>t>=9312&&t<=9471,"Geometric Shapes":t=>t>=9632&&t<=9727,"Miscellaneous Symbols":t=>t>=9728&&t<=9983,"Miscellaneous Symbols and Arrows":t=>t>=11008&&t<=11263,"CJK Radicals Supplement":t=>t>=11904&&t<=12031,"Kangxi Radicals":t=>t>=12032&&t<=12255,"Ideographic Description Characters":t=>t>=12272&&t<=12287,"CJK Symbols and Punctuation":t=>t>=12288&&t<=12351,Hiragana:t=>t>=12352&&t<=12447,Katakana:t=>t>=12448&&t<=12543,Bopomofo:t=>t>=12544&&t<=12591,"Hangul Compatibility Jamo":t=>t>=12592&&t<=12687,Kanbun:t=>t>=12688&&t<=12703,"Bopomofo Extended":t=>t>=12704&&t<=12735,"CJK Strokes":t=>t>=12736&&t<=12783,"Katakana Phonetic Extensions":t=>t>=12784&&t<=12799,"Enclosed CJK Letters and Months":t=>t>=12800&&t<=13055,"CJK Compatibility":t=>t>=13056&&t<=13311,"CJK Unified Ideographs Extension A":t=>t>=13312&&t<=19903,"Yijing Hexagram Symbols":t=>t>=19904&&t<=19967,"CJK Unified Ideographs":t=>t>=19968&&t<=40959,"Yi Syllables":t=>t>=40960&&t<=42127,"Yi Radicals":t=>t>=42128&&t<=42191,"Hangul Jamo Extended-A":t=>t>=43360&&t<=43391,"Hangul Syllables":t=>t>=44032&&t<=55215,"Hangul Jamo Extended-B":t=>t>=55216&&t<=55295,"Private Use Area":t=>t>=57344&&t<=63743,"CJK Compatibility Ideographs":t=>t>=63744&&t<=64255,"Arabic Presentation Forms-A":t=>t>=64336&&t<=65023,"Vertical Forms":t=>t>=65040&&t<=65055,"CJK Compatibility Forms":t=>t>=65072&&t<=65103,"Small Form Variants":t=>t>=65104&&t<=65135,"Arabic Presentation Forms-B":t=>t>=65136&&t<=65279,"Halfwidth and Fullwidth Forms":t=>t>=65280&&t<=65519};function es(t){for(const e of t)if(is(e.charCodeAt(0)))return !0;return !1}function rs(t){for(const e of t)if(!ns(e.charCodeAt(0)))return !1;return !0}function ns(t){return !(ts.Arabic(t)||ts["Arabic Supplement"](t)||ts["Arabic Extended-A"](t)||ts["Arabic Presentation Forms-A"](t)||ts["Arabic Presentation Forms-B"](t))}function is(t){return !(746!==t&&747!==t&&(t<4352||!(ts["Bopomofo Extended"](t)||ts.Bopomofo(t)||ts["CJK Compatibility Forms"](t)&&!(t>=65097&&t<=65103)||ts["CJK Compatibility Ideographs"](t)||ts["CJK Compatibility"](t)||ts["CJK Radicals Supplement"](t)||ts["CJK Strokes"](t)||!(!ts["CJK Symbols and Punctuation"](t)||t>=12296&&t<=12305||t>=12308&&t<=12319||12336===t)||ts["CJK Unified Ideographs Extension A"](t)||ts["CJK Unified Ideographs"](t)||ts["Enclosed CJK Letters and Months"](t)||ts["Hangul Compatibility Jamo"](t)||ts["Hangul Jamo Extended-A"](t)||ts["Hangul Jamo Extended-B"](t)||ts["Hangul Jamo"](t)||ts["Hangul Syllables"](t)||ts.Hiragana(t)||ts["Ideographic Description Characters"](t)||ts.Kanbun(t)||ts["Kangxi Radicals"](t)||ts["Katakana Phonetic Extensions"](t)||ts.Katakana(t)&&12540!==t||!(!ts["Halfwidth and Fullwidth Forms"](t)||65288===t||65289===t||65293===t||t>=65306&&t<=65310||65339===t||65341===t||65343===t||t>=65371&&t<=65503||65507===t||t>=65512&&t<=65519)||!(!ts["Small Form Variants"](t)||t>=65112&&t<=65118||t>=65123&&t<=65126)||ts["Unified Canadian Aboriginal Syllabics"](t)||ts["Unified Canadian Aboriginal Syllabics Extended"](t)||ts["Vertical Forms"](t)||ts["Yijing Hexagram Symbols"](t)||ts["Yi Syllables"](t)||ts["Yi Radicals"](t))))}function ss(t){return !(is(t)||function(t){return !!(ts["Latin-1 Supplement"](t)&&(167===t||169===t||174===t||177===t||188===t||189===t||190===t||215===t||247===t)||ts["General Punctuation"](t)&&(8214===t||8224===t||8225===t||8240===t||8241===t||8251===t||8252===t||8258===t||8263===t||8264===t||8265===t||8273===t)||ts["Letterlike Symbols"](t)||ts["Number Forms"](t)||ts["Miscellaneous Technical"](t)&&(t>=8960&&t<=8967||t>=8972&&t<=8991||t>=8996&&t<=9e3||9003===t||t>=9085&&t<=9114||t>=9150&&t<=9165||9167===t||t>=9169&&t<=9179||t>=9186&&t<=9215)||ts["Control Pictures"](t)&&9251!==t||ts["Optical Character Recognition"](t)||ts["Enclosed Alphanumerics"](t)||ts["Geometric Shapes"](t)||ts["Miscellaneous Symbols"](t)&&!(t>=9754&&t<=9759)||ts["Miscellaneous Symbols and Arrows"](t)&&(t>=11026&&t<=11055||t>=11088&&t<=11097||t>=11192&&t<=11243)||ts["CJK Symbols and Punctuation"](t)||ts.Katakana(t)||ts["Private Use Area"](t)||ts["CJK Compatibility Forms"](t)||ts["Small Form Variants"](t)||ts["Halfwidth and Fullwidth Forms"](t)||8734===t||8756===t||8757===t||t>=9984&&t<=10087||t>=10102&&t<=10131||65532===t||65533===t)}(t))}function as(t){return t>=1424&&t<=2303||ts["Arabic Presentation Forms-A"](t)||ts["Arabic Presentation Forms-B"](t)}function os(t,e){return !(!e&&as(t)||t>=2304&&t<=3583||t>=3840&&t<=4255||ts.Khmer(t))}function ls(t){for(const e of t)if(as(e.charCodeAt(0)))return !0;return !1}const us="deferred",cs="loading",hs="loaded";let ps=null,ds="unavailable",fs=null;const ys=function(t){t&&"string"==typeof t&&t.indexOf("NetworkError")>-1&&(ds="error"),ps&&ps(t);};function ms(){gs.fire(new Yt("pluginStateChange",{pluginStatus:ds,pluginURL:fs}));}const gs=new Qt,xs=function(){return ds},vs=function(){if(ds!==us||!fs)throw new Error("rtl-text-plugin cannot be downloaded unless a pluginURL is specified");ds=cs,ms(),fs&&pt({url:fs},(t=>{t?ys(t):(ds=hs,ms());}));},bs={applyArabicShaping:null,processBidirectionalText:null,processStyledBidirectionalText:null,isLoaded:()=>ds===hs||null!=bs.applyArabicShaping,isLoading:()=>ds===cs,setState(t){ds=t.pluginStatus,fs=t.pluginURL;},isParsed:()=>null!=bs.applyArabicShaping&&null!=bs.processBidirectionalText&&null!=bs.processStyledBidirectionalText,getPluginURL:()=>fs};class ws{constructor(t,e){this.zoom=t,e?(this.now=e.now,this.fadeDuration=e.fadeDuration,this.transition=e.transition,this.pitch=e.pitch):(this.now=0,this.fadeDuration=0,this.transition={},this.pitch=0);}isSupportedScript(t){return function(t,e){for(const r of t)if(!os(r.charCodeAt(0),e))return !1;return !0}(t,bs.isLoaded())}}class _s{constructor(t,e){this.property=t,this.value=e,this.expression=function(t,e){if($n(t))return new ti(t,e);if(Jn(t)){const r=Qn(t,e);if("error"===r.result)throw new Error(r.value.map((t=>`${t.key}: ${t.message}`)).join(", "));return r.value}{let r=t;return "string"==typeof t&&"color"===e.type&&(r=Ee.parse(t)),{kind:"constant",evaluate:()=>r}}}(void 0===e?t.specification.default:e,t.specification);}isDataDriven(){return "source"===this.expression.kind||"composite"===this.expression.kind}possiblyEvaluate(t,e,r){return this.property.possiblyEvaluate(this,t,e,r)}}class As{constructor(t){this.property=t,this.value=new _s(t,void 0);}transitioned(t,e){return new ks(this.property,this.value,e,C({},t.transition,this.transition),t.now)}untransitioned(){return new ks(this.property,this.value,null,{},0)}}class Ss{constructor(t){this._properties=t,this._values=Object.create(t.defaultTransitionablePropertyValues);}getValue(t){return O(this._values[t].value.value)}setValue(t,e){this._values.hasOwnProperty(t)||(this._values[t]=new As(this._values[t].property)),this._values[t].value=new _s(this._values[t].property,null===e?void 0:O(e));}getTransition(t){return O(this._values[t].transition)}setTransition(t,e){this._values.hasOwnProperty(t)||(this._values[t]=new As(this._values[t].property)),this._values[t].transition=O(e)||void 0;}serialize(){const t={};for(const e of Object.keys(this._values)){const r=this.getValue(e);void 0!==r&&(t[e]=r);const n=this.getTransition(e);void 0!==n&&(t[`${e}-transition`]=n);}return t}transitioned(t,e){const r=new Is(this._properties);for(const n of Object.keys(this._values))r._values[n]=this._values[n].transitioned(t,e._values[n]);return r}untransitioned(){const t=new Is(this._properties);for(const e of Object.keys(this._values))t._values[e]=this._values[e].untransitioned();return t}}class ks{constructor(t,e,r,n,i){const s=n.delay||0,a=n.duration||0;i=i||0,this.property=t,this.value=e,this.begin=i+s,this.end=this.begin+a,t.specification.transition&&(n.delay||n.duration)&&(this.prior=r);}possiblyEvaluate(t,e,r){const n=t.now||0,i=this.value.possiblyEvaluate(t,e,r),s=this.prior;if(s){if(n>this.end)return this.prior=null,i;if(this.value.isDataDriven())return this.prior=null,i;if(n<this.begin)return s.possiblyEvaluate(t,e,r);{const a=(n-this.begin)/(this.end-this.begin);return this.property.interpolate(s.possiblyEvaluate(t,e,r),i,S(a))}}return i}}class Is{constructor(t){this._properties=t,this._values=Object.create(t.defaultTransitioningPropertyValues);}possiblyEvaluate(t,e,r){const n=new zs(this._properties);for(const i of Object.keys(this._values))n._values[i]=this._values[i].possiblyEvaluate(t,e,r);return n}hasTransition(){for(const t of Object.keys(this._values))if(this._values[t].prior)return !0;return !1}}class Ms{constructor(t){this._properties=t,this._values=Object.create(t.defaultPropertyValues);}getValue(t){return O(this._values[t].value)}setValue(t,e){this._values[t]=new _s(this._values[t].property,null===e?void 0:O(e));}serialize(){const t={};for(const e of Object.keys(this._values)){const r=this.getValue(e);void 0!==r&&(t[e]=r);}return t}possiblyEvaluate(t,e,r){const n=new zs(this._properties);for(const i of Object.keys(this._values))n._values[i]=this._values[i].possiblyEvaluate(t,e,r);return n}}class Ts{constructor(t,e,r){this.property=t,this.value=e,this.parameters=r;}isConstant(){return "constant"===this.value.kind}constantOr(t){return "constant"===this.value.kind?this.value.value:t}evaluate(t,e,r,n){return this.property.evaluate(this.value,this.parameters,t,e,r,n)}}class zs{constructor(t){this._properties=t,this._values=Object.create(t.defaultPossiblyEvaluatedValues);}get(t){return this._values[t]}}class Bs{constructor(t){this.specification=t;}possiblyEvaluate(t,e){return t.expression.evaluate(e)}interpolate(t,e,r){const n=Cr[this.specification.type];return n?n(t,e,r):t}}class Es{constructor(t,e){this.specification=t,this.overrides=e;}possiblyEvaluate(t,e,r,n){return new Ts(this,"constant"===t.expression.kind||"camera"===t.expression.kind?{kind:"constant",value:t.expression.evaluate(e,null,{},r,n)}:t.expression,e)}interpolate(t,e,r){if("constant"!==t.value.kind||"constant"!==e.value.kind)return t;if(void 0===t.value.value||void 0===e.value.value)return new Ts(this,{kind:"constant",value:void 0},t.parameters);const n=Cr[this.specification.type];return n?new Ts(this,{kind:"constant",value:n(t.value.value,e.value.value,r)},t.parameters):t}evaluate(t,e,r,n,i,s){return "constant"===t.kind?t.value:t.evaluate(e,r,n,i,s)}}class Cs{constructor(t){this.specification=t;}possiblyEvaluate(t,e,r,n){return !!t.expression.evaluate(e,null,{},r,n)}interpolate(){return !1}}class Ps{constructor(t){this.properties=t,this.defaultPropertyValues={},this.defaultTransitionablePropertyValues={},this.defaultTransitioningPropertyValues={},this.defaultPossiblyEvaluatedValues={},this.overridableProperties=[];const e=new ws(0,{});for(const r in t){const n=t[r];n.specification.overridable&&this.overridableProperties.push(r);const i=this.defaultPropertyValues[r]=new _s(n,void 0),s=this.defaultTransitionablePropertyValues[r]=new As(n);this.defaultTransitioningPropertyValues[r]=s.untransitioned(),this.defaultPossiblyEvaluatedValues[r]=i.possiblyEvaluate(e);}}}function Ds(t,e){return 256*(t=M(Math.floor(t),0,255))+M(Math.floor(e),0,255)}Ji(Es,"DataDrivenProperty"),Ji(Bs,"DataConstantProperty"),Ji(Cs,"ColorRampProperty");const Vs={Int8:Int8Array,Uint8:Uint8Array,Int16:Int16Array,Uint16:Uint16Array,Int32:Int32Array,Uint32:Uint32Array,Float32:Float32Array};class Ls{constructor(t,e){this._structArray=t,this._pos1=e*this.size,this._pos2=this._pos1/2,this._pos4=this._pos1/4,this._pos8=this._pos1/8;}}class Fs{constructor(){this.isTransferred=!1,this.capacity=-1,this.resize(0);}static serialize(t,e){return t._trim(),e&&(t.isTransferred=!0,e.push(t.arrayBuffer)),{length:t.length,arrayBuffer:t.arrayBuffer}}static deserialize(t){const e=Object.create(this.prototype);return e.arrayBuffer=t.arrayBuffer,e.length=t.length,e.capacity=t.arrayBuffer.byteLength/e.bytesPerElement,e._refreshViews(),e}_trim(){this.length!==this.capacity&&(this.capacity=this.length,this.arrayBuffer=this.arrayBuffer.slice(0,this.length*this.bytesPerElement),this._refreshViews());}clear(){this.length=0;}resize(t){this.reserve(t),this.length=t;}reserve(t){if(t>this.capacity){this.capacity=Math.max(t,Math.floor(5*this.capacity),128),this.arrayBuffer=new ArrayBuffer(this.capacity*this.bytesPerElement);const e=this.uint8;this._refreshViews(),e&&this.uint8.set(e);}}_refreshViews(){throw new Error("_refreshViews() must be implemented by each concrete StructArray layout")}destroy(){this.int8=this.uint8=this.int16=this.uint16=this.int32=this.uint32=this.float32=null,this.arrayBuffer=null;}}function Rs(t,e=1){let r=0,n=0;return {members:t.map((t=>{const i=Vs[t.type].BYTES_PER_ELEMENT,s=r=Us(r,Math.max(e,i)),a=t.components||1;return n=Math.max(n,i),r+=i*a,{name:t.name,type:t.type,components:a,offset:s}})),size:Us(r,Math.max(n,e)),alignment:e}}function Us(t,e){return Math.ceil(t/e)*e}class $s extends Fs{_refreshViews(){this.uint8=new Uint8Array(this.arrayBuffer),this.int16=new Int16Array(this.arrayBuffer);}emplaceBack(t,e){const r=this.length;return this.resize(r+1),this.emplace(r,t,e)}emplace(t,e,r){const n=2*t;return this.int16[n+0]=e,this.int16[n+1]=r,t}}$s.prototype.bytesPerElement=4,Ji($s,"StructArrayLayout2i4");class js extends Fs{_refreshViews(){this.uint8=new Uint8Array(this.arrayBuffer),this.int16=new Int16Array(this.arrayBuffer);}emplaceBack(t,e,r){const n=this.length;return this.resize(n+1),this.emplace(n,t,e,r)}emplace(t,e,r,n){const i=3*t;return this.int16[i+0]=e,this.int16[i+1]=r,this.int16[i+2]=n,t}}js.prototype.bytesPerElement=6,Ji(js,"StructArrayLayout3i6");class Os extends Fs{_refreshViews(){this.uint8=new Uint8Array(this.arrayBuffer),this.int16=new Int16Array(this.arrayBuffer);}emplaceBack(t,e,r,n){const i=this.length;return this.resize(i+1),this.emplace(i,t,e,r,n)}emplace(t,e,r,n,i){const s=4*t;return this.int16[s+0]=e,this.int16[s+1]=r,this.int16[s+2]=n,this.int16[s+3]=i,t}}Os.prototype.bytesPerElement=8,Ji(Os,"StructArrayLayout4i8");class qs extends Fs{_refreshViews(){this.uint8=new Uint8Array(this.arrayBuffer),this.int16=new Int16Array(this.arrayBuffer),this.float32=new Float32Array(this.arrayBuffer);}emplaceBack(t,e,r,n,i,s,a){const o=this.length;return this.resize(o+1),this.emplace(o,t,e,r,n,i,s,a)}emplace(t,e,r,n,i,s,a,o){const l=6*t,u=12*t,c=3*t;return this.int16[l+0]=e,this.int16[l+1]=r,this.uint8[u+4]=n,this.uint8[u+5]=i,this.uint8[u+6]=s,this.uint8[u+7]=a,this.float32[c+2]=o,t}}qs.prototype.bytesPerElement=12,Ji(qs,"StructArrayLayout2i4ub1f12");class Ns extends Fs{_refreshViews(){this.uint8=new Uint8Array(this.arrayBuffer),this.float32=new Float32Array(this.arrayBuffer);}emplaceBack(t,e,r,n){const i=this.length;return this.resize(i+1),this.emplace(i,t,e,r,n)}emplace(t,e,r,n,i){const s=4*t;return this.float32[s+0]=e,this.float32[s+1]=r,this.float32[s+2]=n,this.float32[s+3]=i,t}}Ns.prototype.bytesPerElement=16,Ji(Ns,"StructArrayLayout4f16");class Gs extends Fs{_refreshViews(){this.uint8=new Uint8Array(this.arrayBuffer),this.uint16=new Uint16Array(this.arrayBuffer),this.float32=new Float32Array(this.arrayBuffer);}emplaceBack(t,e,r,n,i){const s=this.length;return this.resize(s+1),this.emplace(s,t,e,r,n,i)}emplace(t,e,r,n,i,s){const a=6*t,o=3*t;return this.uint16[a+0]=e,this.uint16[a+1]=r,this.uint16[a+2]=n,this.uint16[a+3]=i,this.float32[o+2]=s,t}}Gs.prototype.bytesPerElement=12,Ji(Gs,"StructArrayLayout4ui1f12");class Zs extends Fs{_refreshViews(){this.uint8=new Uint8Array(this.arrayBuffer),this.uint16=new Uint16Array(this.arrayBuffer);}emplaceBack(t,e,r,n){const i=this.length;return this.resize(i+1),this.emplace(i,t,e,r,n)}emplace(t,e,r,n,i){const s=4*t;return this.uint16[s+0]=e,this.uint16[s+1]=r,this.uint16[s+2]=n,this.uint16[s+3]=i,t}}Zs.prototype.bytesPerElement=8,Ji(Zs,"StructArrayLayout4ui8");class Ks extends Fs{_refreshViews(){this.uint8=new Uint8Array(this.arrayBuffer),this.int16=new Int16Array(this.arrayBuffer);}emplaceBack(t,e,r,n,i,s){const a=this.length;return this.resize(a+1),this.emplace(a,t,e,r,n,i,s)}emplace(t,e,r,n,i,s,a){const o=6*t;return this.int16[o+0]=e,this.int16[o+1]=r,this.int16[o+2]=n,this.int16[o+3]=i,this.int16[o+4]=s,this.int16[o+5]=a,t}}Ks.prototype.bytesPerElement=12,Ji(Ks,"StructArrayLayout6i12");class Xs extends Fs{_refreshViews(){this.uint8=new Uint8Array(this.arrayBuffer),this.int16=new Int16Array(this.arrayBuffer),this.uint16=new Uint16Array(this.arrayBuffer);}emplaceBack(t,e,r,n,i,s,a,o,l,u,c,h){const p=this.length;return this.resize(p+1),this.emplace(p,t,e,r,n,i,s,a,o,l,u,c,h)}emplace(t,e,r,n,i,s,a,o,l,u,c,h,p){const d=12*t;return this.int16[d+0]=e,this.int16[d+1]=r,this.int16[d+2]=n,this.int16[d+3]=i,this.uint16[d+4]=s,this.uint16[d+5]=a,this.uint16[d+6]=o,this.uint16[d+7]=l,this.int16[d+8]=u,this.int16[d+9]=c,this.int16[d+10]=h,this.int16[d+11]=p,t}}Xs.prototype.bytesPerElement=24,Ji(Xs,"StructArrayLayout4i4ui4i24");class Js extends Fs{_refreshViews(){this.uint8=new Uint8Array(this.arrayBuffer),this.int16=new Int16Array(this.arrayBuffer),this.float32=new Float32Array(this.arrayBuffer);}emplaceBack(t,e,r,n,i,s){const a=this.length;return this.resize(a+1),this.emplace(a,t,e,r,n,i,s)}emplace(t,e,r,n,i,s,a){const o=10*t,l=5*t;return this.int16[o+0]=e,this.int16[o+1]=r,this.int16[o+2]=n,this.float32[l+2]=i,this.float32[l+3]=s,this.float32[l+4]=a,t}}Js.prototype.bytesPerElement=20,Ji(Js,"StructArrayLayout3i3f20");class Hs extends Fs{_refreshViews(){this.uint8=new Uint8Array(this.arrayBuffer),this.uint32=new Uint32Array(this.arrayBuffer);}emplaceBack(t){const e=this.length;return this.resize(e+1),this.emplace(e,t)}emplace(t,e){return this.uint32[1*t+0]=e,t}}Hs.prototype.bytesPerElement=4,Ji(Hs,"StructArrayLayout1ul4");class Ys extends Fs{_refreshViews(){this.uint8=new Uint8Array(this.arrayBuffer),this.int16=new Int16Array(this.arrayBuffer),this.float32=new Float32Array(this.arrayBuffer),this.uint32=new Uint32Array(this.arrayBuffer),this.uint16=new Uint16Array(this.arrayBuffer);}emplaceBack(t,e,r,n,i,s,a,o,l,u,c,h,p){const d=this.length;return this.resize(d+1),this.emplace(d,t,e,r,n,i,s,a,o,l,u,c,h,p)}emplace(t,e,r,n,i,s,a,o,l,u,c,h,p,d){const f=20*t,y=10*t;return this.int16[f+0]=e,this.int16[f+1]=r,this.int16[f+2]=n,this.int16[f+3]=i,this.int16[f+4]=s,this.float32[y+3]=a,this.float32[y+4]=o,this.float32[y+5]=l,this.float32[y+6]=u,this.int16[f+14]=c,this.uint32[y+8]=h,this.uint16[f+18]=p,this.uint16[f+19]=d,t}}Ys.prototype.bytesPerElement=40,Ji(Ys,"StructArrayLayout5i4f1i1ul2ui40");class Ws extends Fs{_refreshViews(){this.uint8=new Uint8Array(this.arrayBuffer),this.int16=new Int16Array(this.arrayBuffer);}emplaceBack(t,e,r,n,i,s,a){const o=this.length;return this.resize(o+1),this.emplace(o,t,e,r,n,i,s,a)}emplace(t,e,r,n,i,s,a,o){const l=8*t;return this.int16[l+0]=e,this.int16[l+1]=r,this.int16[l+2]=n,this.int16[l+4]=i,this.int16[l+5]=s,this.int16[l+6]=a,this.int16[l+7]=o,t}}Ws.prototype.bytesPerElement=16,Ji(Ws,"StructArrayLayout3i2i2i16");class Qs extends Fs{_refreshViews(){this.uint8=new Uint8Array(this.arrayBuffer),this.float32=new Float32Array(this.arrayBuffer),this.int16=new Int16Array(this.arrayBuffer);}emplaceBack(t,e,r,n,i){const s=this.length;return this.resize(s+1),this.emplace(s,t,e,r,n,i)}emplace(t,e,r,n,i,s){const a=4*t,o=8*t;return this.float32[a+0]=e,this.float32[a+1]=r,this.float32[a+2]=n,this.int16[o+6]=i,this.int16[o+7]=s,t}}Qs.prototype.bytesPerElement=16,Ji(Qs,"StructArrayLayout2f1f2i16");class ta extends Fs{_refreshViews(){this.uint8=new Uint8Array(this.arrayBuffer),this.float32=new Float32Array(this.arrayBuffer);}emplaceBack(t,e,r,n){const i=this.length;return this.resize(i+1),this.emplace(i,t,e,r,n)}emplace(t,e,r,n,i){const s=12*t,a=3*t;return this.uint8[s+0]=e,this.uint8[s+1]=r,this.float32[a+1]=n,this.float32[a+2]=i,t}}ta.prototype.bytesPerElement=12,Ji(ta,"StructArrayLayout2ub2f12");class ea extends Fs{_refreshViews(){this.uint8=new Uint8Array(this.arrayBuffer),this.float32=new Float32Array(this.arrayBuffer);}emplaceBack(t,e,r){const n=this.length;return this.resize(n+1),this.emplace(n,t,e,r)}emplace(t,e,r,n){const i=3*t;return this.float32[i+0]=e,this.float32[i+1]=r,this.float32[i+2]=n,t}}ea.prototype.bytesPerElement=12,Ji(ea,"StructArrayLayout3f12");class ra extends Fs{_refreshViews(){this.uint8=new Uint8Array(this.arrayBuffer),this.uint16=new Uint16Array(this.arrayBuffer);}emplaceBack(t,e,r){const n=this.length;return this.resize(n+1),this.emplace(n,t,e,r)}emplace(t,e,r,n){const i=3*t;return this.uint16[i+0]=e,this.uint16[i+1]=r,this.uint16[i+2]=n,t}}ra.prototype.bytesPerElement=6,Ji(ra,"StructArrayLayout3ui6");class na extends Fs{_refreshViews(){this.uint8=new Uint8Array(this.arrayBuffer),this.int16=new Int16Array(this.arrayBuffer),this.float32=new Float32Array(this.arrayBuffer),this.uint16=new Uint16Array(this.arrayBuffer),this.uint32=new Uint32Array(this.arrayBuffer);}emplaceBack(t,e,r,n,i,s,a,o,l,u,c,h,p,d,f,y,m,g,x,v,b){const w=this.length;return this.resize(w+1),this.emplace(w,t,e,r,n,i,s,a,o,l,u,c,h,p,d,f,y,m,g,x,v,b)}emplace(t,e,r,n,i,s,a,o,l,u,c,h,p,d,f,y,m,g,x,v,b,w){const _=30*t,A=15*t,S=60*t;return this.int16[_+0]=e,this.int16[_+1]=r,this.int16[_+2]=n,this.float32[A+2]=i,this.float32[A+3]=s,this.uint16[_+8]=a,this.uint16[_+9]=o,this.uint32[A+5]=l,this.uint32[A+6]=u,this.uint32[A+7]=c,this.uint16[_+16]=h,this.uint16[_+17]=p,this.uint16[_+18]=d,this.float32[A+10]=f,this.float32[A+11]=y,this.uint8[S+48]=m,this.uint8[S+49]=g,this.uint8[S+50]=x,this.uint32[A+13]=v,this.int16[_+28]=b,this.uint8[S+58]=w,t}}na.prototype.bytesPerElement=60,Ji(na,"StructArrayLayout3i2f2ui3ul3ui2f3ub1ul1i1ub60");class ia extends Fs{_refreshViews(){this.uint8=new Uint8Array(this.arrayBuffer),this.int16=new Int16Array(this.arrayBuffer),this.float32=new Float32Array(this.arrayBuffer),this.uint16=new Uint16Array(this.arrayBuffer),this.uint32=new Uint32Array(this.arrayBuffer);}emplaceBack(t,e,r,n,i,s,a,o,l,u,c,h,p,d,f,y,m,g,x,v,b,w,_,A,S,k,I,M,T,z){const B=this.length;return this.resize(B+1),this.emplace(B,t,e,r,n,i,s,a,o,l,u,c,h,p,d,f,y,m,g,x,v,b,w,_,A,S,k,I,M,T,z)}emplace(t,e,r,n,i,s,a,o,l,u,c,h,p,d,f,y,m,g,x,v,b,w,_,A,S,k,I,M,T,z,B){const E=38*t,C=19*t;return this.int16[E+0]=e,this.int16[E+1]=r,this.int16[E+2]=n,this.float32[C+2]=i,this.float32[C+3]=s,this.int16[E+8]=a,this.int16[E+9]=o,this.int16[E+10]=l,this.int16[E+11]=u,this.int16[E+12]=c,this.int16[E+13]=h,this.uint16[E+14]=p,this.uint16[E+15]=d,this.uint16[E+16]=f,this.uint16[E+17]=y,this.uint16[E+18]=m,this.uint16[E+19]=g,this.uint16[E+20]=x,this.uint16[E+21]=v,this.uint16[E+22]=b,this.uint16[E+23]=w,this.uint16[E+24]=_,this.uint16[E+25]=A,this.uint16[E+26]=S,this.uint16[E+27]=k,this.uint16[E+28]=I,this.uint32[C+15]=M,this.float32[C+16]=T,this.float32[C+17]=z,this.float32[C+18]=B,t}}ia.prototype.bytesPerElement=76,Ji(ia,"StructArrayLayout3i2f6i15ui1ul3f76");class sa extends Fs{_refreshViews(){this.uint8=new Uint8Array(this.arrayBuffer),this.float32=new Float32Array(this.arrayBuffer);}emplaceBack(t){const e=this.length;return this.resize(e+1),this.emplace(e,t)}emplace(t,e){return this.float32[1*t+0]=e,t}}sa.prototype.bytesPerElement=4,Ji(sa,"StructArrayLayout1f4");class aa extends Fs{_refreshViews(){this.uint8=new Uint8Array(this.arrayBuffer),this.float32=new Float32Array(this.arrayBuffer);}emplaceBack(t,e,r,n,i){const s=this.length;return this.resize(s+1),this.emplace(s,t,e,r,n,i)}emplace(t,e,r,n,i,s){const a=5*t;return this.float32[a+0]=e,this.float32[a+1]=r,this.float32[a+2]=n,this.float32[a+3]=i,this.float32[a+4]=s,t}}aa.prototype.bytesPerElement=20,Ji(aa,"StructArrayLayout5f20");class oa extends Fs{_refreshViews(){this.uint8=new Uint8Array(this.arrayBuffer),this.uint32=new Uint32Array(this.arrayBuffer),this.uint16=new Uint16Array(this.arrayBuffer);}emplaceBack(t,e,r,n){const i=this.length;return this.resize(i+1),this.emplace(i,t,e,r,n)}emplace(t,e,r,n,i){const s=6*t;return this.uint32[3*t+0]=e,this.uint16[s+2]=r,this.uint16[s+3]=n,this.uint16[s+4]=i,t}}oa.prototype.bytesPerElement=12,Ji(oa,"StructArrayLayout1ul3ui12");class la extends Fs{_refreshViews(){this.uint8=new Uint8Array(this.arrayBuffer),this.uint16=new Uint16Array(this.arrayBuffer);}emplaceBack(t,e){const r=this.length;return this.resize(r+1),this.emplace(r,t,e)}emplace(t,e,r){const n=2*t;return this.uint16[n+0]=e,this.uint16[n+1]=r,t}}la.prototype.bytesPerElement=4,Ji(la,"StructArrayLayout2ui4");class ua extends Fs{_refreshViews(){this.uint8=new Uint8Array(this.arrayBuffer),this.uint16=new Uint16Array(this.arrayBuffer);}emplaceBack(t){const e=this.length;return this.resize(e+1),this.emplace(e,t)}emplace(t,e){return this.uint16[1*t+0]=e,t}}ua.prototype.bytesPerElement=2,Ji(ua,"StructArrayLayout1ui2");class ca extends Fs{_refreshViews(){this.uint8=new Uint8Array(this.arrayBuffer),this.float32=new Float32Array(this.arrayBuffer);}emplaceBack(t,e){const r=this.length;return this.resize(r+1),this.emplace(r,t,e)}emplace(t,e,r){const n=2*t;return this.float32[n+0]=e,this.float32[n+1]=r,t}}ca.prototype.bytesPerElement=8,Ji(ca,"StructArrayLayout2f8");class ha extends Ls{get projectedAnchorX(){return this._structArray.int16[this._pos2+0]}get projectedAnchorY(){return this._structArray.int16[this._pos2+1]}get projectedAnchorZ(){return this._structArray.int16[this._pos2+2]}get tileAnchorX(){return this._structArray.int16[this._pos2+3]}get tileAnchorY(){return this._structArray.int16[this._pos2+4]}get x1(){return this._structArray.float32[this._pos4+3]}get y1(){return this._structArray.float32[this._pos4+4]}get x2(){return this._structArray.float32[this._pos4+5]}get y2(){return this._structArray.float32[this._pos4+6]}get padding(){return this._structArray.int16[this._pos2+14]}get featureIndex(){return this._structArray.uint32[this._pos4+8]}get sourceLayerIndex(){return this._structArray.uint16[this._pos2+18]}get bucketIndex(){return this._structArray.uint16[this._pos2+19]}}ha.prototype.size=40;class pa extends Ys{get(t){return new ha(this,t)}}Ji(pa,"CollisionBoxArray");class da extends Ls{get projectedAnchorX(){return this._structArray.int16[this._pos2+0]}get projectedAnchorY(){return this._structArray.int16[this._pos2+1]}get projectedAnchorZ(){return this._structArray.int16[this._pos2+2]}get tileAnchorX(){return this._structArray.float32[this._pos4+2]}get tileAnchorY(){return this._structArray.float32[this._pos4+3]}get glyphStartIndex(){return this._structArray.uint16[this._pos2+8]}get numGlyphs(){return this._structArray.uint16[this._pos2+9]}get vertexStartIndex(){return this._structArray.uint32[this._pos4+5]}get lineStartIndex(){return this._structArray.uint32[this._pos4+6]}get lineLength(){return this._structArray.uint32[this._pos4+7]}get segment(){return this._structArray.uint16[this._pos2+16]}get lowerSize(){return this._structArray.uint16[this._pos2+17]}get upperSize(){return this._structArray.uint16[this._pos2+18]}get lineOffsetX(){return this._structArray.float32[this._pos4+10]}get lineOffsetY(){return this._structArray.float32[this._pos4+11]}get writingMode(){return this._structArray.uint8[this._pos1+48]}get placedOrientation(){return this._structArray.uint8[this._pos1+49]}set placedOrientation(t){this._structArray.uint8[this._pos1+49]=t;}get hidden(){return this._structArray.uint8[this._pos1+50]}set hidden(t){this._structArray.uint8[this._pos1+50]=t;}get crossTileID(){return this._structArray.uint32[this._pos4+13]}set crossTileID(t){this._structArray.uint32[this._pos4+13]=t;}get associatedIconIndex(){return this._structArray.int16[this._pos2+28]}get flipState(){return this._structArray.uint8[this._pos1+58]}set flipState(t){this._structArray.uint8[this._pos1+58]=t;}}da.prototype.size=60;class fa extends na{get(t){return new da(this,t)}}Ji(fa,"PlacedSymbolArray");class ya extends Ls{get projectedAnchorX(){return this._structArray.int16[this._pos2+0]}get projectedAnchorY(){return this._structArray.int16[this._pos2+1]}get projectedAnchorZ(){return this._structArray.int16[this._pos2+2]}get tileAnchorX(){return this._structArray.float32[this._pos4+2]}get tileAnchorY(){return this._structArray.float32[this._pos4+3]}get rightJustifiedTextSymbolIndex(){return this._structArray.int16[this._pos2+8]}get centerJustifiedTextSymbolIndex(){return this._structArray.int16[this._pos2+9]}get leftJustifiedTextSymbolIndex(){return this._structArray.int16[this._pos2+10]}get verticalPlacedTextSymbolIndex(){return this._structArray.int16[this._pos2+11]}get placedIconSymbolIndex(){return this._structArray.int16[this._pos2+12]}get verticalPlacedIconSymbolIndex(){return this._structArray.int16[this._pos2+13]}get key(){return this._structArray.uint16[this._pos2+14]}get textBoxStartIndex(){return this._structArray.uint16[this._pos2+15]}get textBoxEndIndex(){return this._structArray.uint16[this._pos2+16]}get verticalTextBoxStartIndex(){return this._structArray.uint16[this._pos2+17]}get verticalTextBoxEndIndex(){return this._structArray.uint16[this._pos2+18]}get iconBoxStartIndex(){return this._structArray.uint16[this._pos2+19]}get iconBoxEndIndex(){return this._structArray.uint16[this._pos2+20]}get verticalIconBoxStartIndex(){return this._structArray.uint16[this._pos2+21]}get verticalIconBoxEndIndex(){return this._structArray.uint16[this._pos2+22]}get featureIndex(){return this._structArray.uint16[this._pos2+23]}get numHorizontalGlyphVertices(){return this._structArray.uint16[this._pos2+24]}get numVerticalGlyphVertices(){return this._structArray.uint16[this._pos2+25]}get numIconVertices(){return this._structArray.uint16[this._pos2+26]}get numVerticalIconVertices(){return this._structArray.uint16[this._pos2+27]}get useRuntimeCollisionCircles(){return this._structArray.uint16[this._pos2+28]}get crossTileID(){return this._structArray.uint32[this._pos4+15]}set crossTileID(t){this._structArray.uint32[this._pos4+15]=t;}get textOffset0(){return this._structArray.float32[this._pos4+16]}get textOffset1(){return this._structArray.float32[this._pos4+17]}get collisionCircleDiameter(){return this._structArray.float32[this._pos4+18]}}ya.prototype.size=76;class ma extends ia{get(t){return new ya(this,t)}}Ji(ma,"SymbolInstanceArray");class ga extends sa{getoffsetX(t){return this.float32[1*t+0]}}Ji(ga,"GlyphOffsetArray");class xa extends $s{getx(t){return this.int16[2*t+0]}gety(t){return this.int16[2*t+1]}}Ji(xa,"SymbolLineVertexArray");class va extends Ls{get featureIndex(){return this._structArray.uint32[this._pos4+0]}get sourceLayerIndex(){return this._structArray.uint16[this._pos2+2]}get bucketIndex(){return this._structArray.uint16[this._pos2+3]}get layoutVertexArrayOffset(){return this._structArray.uint16[this._pos2+4]}}va.prototype.size=12;class ba extends oa{get(t){return new va(this,t)}}Ji(ba,"FeatureIndexArray");class wa extends la{geta_centroid_pos0(t){return this.uint16[2*t+0]}geta_centroid_pos1(t){return this.uint16[2*t+1]}}Ji(wa,"FillExtrusionCentroidArray");const _a=Rs([{name:"a_pattern",components:4,type:"Uint16"},{name:"a_pixel_ratio",components:1,type:"Float32"}]),Aa=Rs([{name:"a_dash",components:4,type:"Uint16"}]);var Sa={exports:{}},ka={exports:{}};ka.exports=function(t,e){var r,n,i,s,a,o,l,u;for(n=t.length-(r=3&t.length),i=e,a=3432918353,o=461845907,u=0;u<n;)l=255&t.charCodeAt(u)|(255&t.charCodeAt(++u))<<8|(255&t.charCodeAt(++u))<<16|(255&t.charCodeAt(++u))<<24,++u,i=27492+(65535&(s=5*(65535&(i=(i^=l=(65535&(l=(l=(65535&l)*a+(((l>>>16)*a&65535)<<16)&4294967295)<<15|l>>>17))*o+(((l>>>16)*o&65535)<<16)&4294967295)<<13|i>>>19))+((5*(i>>>16)&65535)<<16)&4294967295))+((58964+(s>>>16)&65535)<<16);switch(l=0,r){case 3:l^=(255&t.charCodeAt(u+2))<<16;case 2:l^=(255&t.charCodeAt(u+1))<<8;case 1:i^=l=(65535&(l=(l=(65535&(l^=255&t.charCodeAt(u)))*a+(((l>>>16)*a&65535)<<16)&4294967295)<<15|l>>>17))*o+(((l>>>16)*o&65535)<<16)&4294967295;}return i^=t.length,i=2246822507*(65535&(i^=i>>>16))+((2246822507*(i>>>16)&65535)<<16)&4294967295,i=3266489909*(65535&(i^=i>>>13))+((3266489909*(i>>>16)&65535)<<16)&4294967295,(i^=i>>>16)>>>0};var Ia=ka.exports,Ma={exports:{}};Ma.exports=function(t,e){for(var r,n=t.length,i=e^n,s=0;n>=4;)r=1540483477*(65535&(r=255&t.charCodeAt(s)|(255&t.charCodeAt(++s))<<8|(255&t.charCodeAt(++s))<<16|(255&t.charCodeAt(++s))<<24))+((1540483477*(r>>>16)&65535)<<16),i=1540483477*(65535&i)+((1540483477*(i>>>16)&65535)<<16)^(r=1540483477*(65535&(r^=r>>>24))+((1540483477*(r>>>16)&65535)<<16)),n-=4,++s;switch(n){case 3:i^=(255&t.charCodeAt(s+2))<<16;case 2:i^=(255&t.charCodeAt(s+1))<<8;case 1:i=1540483477*(65535&(i^=255&t.charCodeAt(s)))+((1540483477*(i>>>16)&65535)<<16);}return i=1540483477*(65535&(i^=i>>>13))+((1540483477*(i>>>16)&65535)<<16),(i^=i>>>15)>>>0};var Ta=Ia,za=Ma.exports;Sa.exports=Ta,Sa.exports.murmur3=Ta,Sa.exports.murmur2=za;var Ba=p(Sa.exports);class Ea{constructor(){this.ids=[],this.positions=[],this.indexed=!1;}add(t,e,r,n){this.ids.push(Ca(t)),this.positions.push(e,r,n);}getPositions(t){const e=Ca(t);let r=0,n=this.ids.length-1;for(;r<n;){const t=r+n>>1;this.ids[t]>=e?n=t:r=t+1;}const i=[];for(;this.ids[r]===e;)i.push({index:this.positions[3*r],start:this.positions[3*r+1],end:this.positions[3*r+2]}),r++;return i}static serialize(t,e){const r=new Float64Array(t.ids),n=new Uint32Array(t.positions);return Pa(r,n,0,r.length-1),e&&e.push(r.buffer,n.buffer),{ids:r,positions:n}}static deserialize(t){const e=new Ea;return e.ids=t.ids,e.positions=t.positions,e.indexed=!0,e}}function Ca(t){const e=+t;return !isNaN(e)&&Number.MIN_SAFE_INTEGER<=e&&e<=Number.MAX_SAFE_INTEGER?e:Ba(String(t))}function Pa(t,e,r,n){for(;r<n;){const i=t[r+n>>1];let s=r-1,a=n+1;for(;;){do{s++;}while(t[s]<i);do{a--;}while(t[a]>i);if(s>=a)break;Da(t,s,a),Da(e,3*s,3*a),Da(e,3*s+1,3*a+1),Da(e,3*s+2,3*a+2);}a-r<n-a?(Pa(t,e,r,a),r=a+1):(Pa(t,e,a+1,n),n=a);}}function Da(t,e,r){const n=t[e];t[e]=t[r],t[r]=n;}Ji(Ea,"FeaturePositionMap");class Va{constructor(t){this.gl=t.gl,this.initialized=!1;}fetchUniformLocation(t,e){return this.location||this.initialized||(this.location=this.gl.getUniformLocation(t,e),this.initialized=!0),!!this.location}}class La extends Va{constructor(t){super(t),this.current=0;}set(t,e,r){this.fetchUniformLocation(t,e)&&this.current!==r&&(this.current=r,this.gl.uniform1f(this.location,r));}}class Fa extends Va{constructor(t){super(t),this.current=[0,0,0,0];}set(t,e,r){this.fetchUniformLocation(t,e)&&(r[0]===this.current[0]&&r[1]===this.current[1]&&r[2]===this.current[2]&&r[3]===this.current[3]||(this.current=r,this.gl.uniform4f(this.location,r[0],r[1],r[2],r[3])));}}class Ra extends Va{constructor(t){super(t),this.current=Ee.transparent;}set(t,e,r){this.fetchUniformLocation(t,e)&&(r.r===this.current.r&&r.g===this.current.g&&r.b===this.current.b&&r.a===this.current.a||(this.current=r,this.gl.uniform4f(this.location,r.r,r.g,r.b,r.a)));}}const Ua=new Float32Array(16),$a=new Float32Array(9),ja=new Float32Array(4);function Oa(t){return [Ds(255*t.r,255*t.g),Ds(255*t.b,255*t.a)]}class qa{constructor(t,e,r){this.value=t,this.uniformNames=e.map((t=>`u_${t}`)),this.type=r;}setUniform(t,e,r,n,i){e.set(t,i,n.constantOr(this.value));}getBinding(t,e){return "color"===this.type?new Ra(t):new La(t)}}class Na{constructor(t,e){this.uniformNames=e.map((t=>`u_${t}`)),this.pattern=null,this.pixelRatio=1;}setConstantPatternPositions(t){this.pixelRatio=t.pixelRatio||1,this.pattern=t.tl.concat(t.br);}setUniform(t,e,r,n,i){const s="u_pattern"===i||"u_dash"===i?this.pattern:"u_pixel_ratio"===i?this.pixelRatio:null;s&&e.set(t,i,s);}getBinding(t,e){return "u_pattern"===e||"u_dash"===e?new Fa(t):new La(t)}}class Ga{constructor(t,e,r,n){this.expression=t,this.type=r,this.maxValue=0,this.paintVertexAttributes=e.map((t=>({name:`a_${t}`,type:"Float32",components:"color"===r?2:1,offset:0}))),this.paintVertexArray=new n;}populatePaintArray(t,e,r,n,i,s){const a=this.paintVertexArray.length,o=this.expression.evaluate(new ws(0),e,{},i,n,s);this.paintVertexArray.resize(t),this._setPaintValue(a,t,o);}updatePaintArray(t,e,r,n,i){const s=this.expression.evaluate({zoom:0},r,n,void 0,i);this._setPaintValue(t,e,s);}_setPaintValue(t,e,r){if("color"===this.type){const n=Oa(r);for(let r=t;r<e;r++)this.paintVertexArray.emplace(r,n[0],n[1]);}else {for(let n=t;n<e;n++)this.paintVertexArray.emplace(n,r);this.maxValue=Math.max(this.maxValue,Math.abs(r));}}upload(t){this.paintVertexArray&&this.paintVertexArray.arrayBuffer&&(this.paintVertexBuffer&&this.paintVertexBuffer.buffer?this.paintVertexBuffer.updateData(this.paintVertexArray):this.paintVertexBuffer=t.createVertexBuffer(this.paintVertexArray,this.paintVertexAttributes,this.expression.isStateDependent));}destroy(){this.paintVertexBuffer&&this.paintVertexBuffer.destroy();}}class Za{constructor(t,e,r,n,i,s){this.expression=t,this.uniformNames=e.map((t=>`u_${t}_t`)),this.type=r,this.useIntegerZoom=n,this.zoom=i,this.maxValue=0,this.paintVertexAttributes=e.map((t=>({name:`a_${t}`,type:"Float32",components:"color"===r?4:2,offset:0}))),this.paintVertexArray=new s;}populatePaintArray(t,e,r,n,i,s){const a=this.expression.evaluate(new ws(this.zoom),e,{},i,n,s),o=this.expression.evaluate(new ws(this.zoom+1),e,{},i,n,s),l=this.paintVertexArray.length;this.paintVertexArray.resize(t),this._setPaintValue(l,t,a,o);}updatePaintArray(t,e,r,n,i){const s=this.expression.evaluate({zoom:this.zoom},r,n,void 0,i),a=this.expression.evaluate({zoom:this.zoom+1},r,n,void 0,i);this._setPaintValue(t,e,s,a);}_setPaintValue(t,e,r,n){if("color"===this.type){const i=Oa(r),s=Oa(n);for(let r=t;r<e;r++)this.paintVertexArray.emplace(r,i[0],i[1],s[0],s[1]);}else {for(let i=t;i<e;i++)this.paintVertexArray.emplace(i,r,n);this.maxValue=Math.max(this.maxValue,Math.abs(r),Math.abs(n));}}upload(t){this.paintVertexArray&&this.paintVertexArray.arrayBuffer&&(this.paintVertexBuffer&&this.paintVertexBuffer.buffer?this.paintVertexBuffer.updateData(this.paintVertexArray):this.paintVertexBuffer=t.createVertexBuffer(this.paintVertexArray,this.paintVertexAttributes,this.expression.isStateDependent));}destroy(){this.paintVertexBuffer&&this.paintVertexBuffer.destroy();}setUniform(t,e,r,n,i){const s=this.useIntegerZoom?Math.floor(r.zoom):r.zoom,a=M(this.expression.interpolationFactor(s,this.zoom,this.zoom+1),0,1);e.set(t,i,a);}getBinding(t,e){return new La(t)}}class Ka{constructor(t,e,r,n,i){this.expression=t,this.layerId=i,this.paintVertexAttributes=("array"===r?Aa:_a).members;for(let t=0;t<e.length;++t);this.paintVertexArray=new n;}populatePaintArray(t,e,r){const n=this.paintVertexArray.length;this.paintVertexArray.resize(t),this._setPaintValues(n,t,e.patterns&&e.patterns[this.layerId],r);}updatePaintArray(t,e,r,n,i,s){this._setPaintValues(t,e,r.patterns&&r.patterns[this.layerId],s);}_setPaintValues(t,e,r,n){if(!n||!r)return;const i=n[r];if(!i)return;const{tl:s,br:a,pixelRatio:o}=i;for(let r=t;r<e;r++)this.paintVertexArray.emplace(r,s[0],s[1],a[0],a[1],o);}upload(t){this.paintVertexArray&&this.paintVertexArray.arrayBuffer&&(this.paintVertexBuffer=t.createVertexBuffer(this.paintVertexArray,this.paintVertexAttributes,this.expression.isStateDependent));}destroy(){this.paintVertexBuffer&&this.paintVertexBuffer.destroy();}}class Xa{constructor(t,e,r=(()=>!0)){this.binders={},this._buffers=[];const n=[];for(const i in t.paint._values){if(!r(i))continue;const s=t.paint.get(i);if(!(s instanceof Ts&&Ln(s.property.specification)))continue;const a=Ya(i,t.type),o=s.value,l=s.property.specification.type,u=!!s.property.useIntegerZoom,c="line-dasharray"===i||i.endsWith("pattern"),h="line-dasharray"===i&&"constant"!==t.layout.get("line-cap").value.kind;if("constant"!==o.kind||h)if("source"===o.kind||h||c){const e=to(i,l,"source");this.binders[i]=c?new Ka(o,a,l,e,t.id):new Ga(o,a,l,e),n.push(`/a_${i}`);}else {const t=to(i,l,"composite");this.binders[i]=new Za(o,a,l,u,e,t),n.push(`/z_${i}`);}else this.binders[i]=c?new Na(o.value,a):new qa(o.value,a,l),n.push(`/u_${i}`);}this.cacheKey=n.sort().join("");}getMaxValue(t){const e=this.binders[t];return e instanceof Ga||e instanceof Za?e.maxValue:0}populatePaintArrays(t,e,r,n,i,s){for(const a in this.binders){const o=this.binders[a];(o instanceof Ga||o instanceof Za||o instanceof Ka)&&o.populatePaintArray(t,e,r,n,i,s);}}setConstantPatternPositions(t){for(const e in this.binders){const r=this.binders[e];r instanceof Na&&r.setConstantPatternPositions(t);}}updatePaintArrays(t,e,r,n,i,s){let a=!1;for(const o in t){const l=e.getPositions(o);for(const e of l){const l=r.feature(e.index);for(const r in this.binders){const u=this.binders[r];if((u instanceof Ga||u instanceof Za||u instanceof Ka)&&!0===u.expression.isStateDependent){const c=n.paint.get(r);u.expression=c.value,u.updatePaintArray(e.start,e.end,l,t[o],i,s),a=!0;}}}}return a}defines(){const t=[];for(const e in this.binders){const r=this.binders[e];(r instanceof qa||r instanceof Na)&&t.push(...r.uniformNames.map((t=>`#define HAS_UNIFORM_${t}`)));}return t}getBinderAttributes(){const t=[];for(const e in this.binders){const r=this.binders[e];if(r instanceof Ga||r instanceof Za||r instanceof Ka)for(let e=0;e<r.paintVertexAttributes.length;e++)t.push(r.paintVertexAttributes[e].name);}return t}getBinderUniforms(){const t=[];for(const e in this.binders){const r=this.binders[e];if(r instanceof qa||r instanceof Na||r instanceof Za)for(const e of r.uniformNames)t.push(e);}return t}getPaintVertexBuffers(){return this._buffers}getUniforms(t){const e=[];for(const r in this.binders){const n=this.binders[r];if(n instanceof qa||n instanceof Na||n instanceof Za)for(const i of n.uniformNames)e.push({name:i,property:r,binding:n.getBinding(t,i)});}return e}setUniforms(t,e,r,n,i){for(const{name:e,property:s,binding:a}of r)this.binders[s].setUniform(t,a,i,n.get(s),e);}updatePaintBuffers(){this._buffers=[];for(const t in this.binders){const e=this.binders[t];(e instanceof Ga||e instanceof Za||e instanceof Ka)&&e.paintVertexBuffer&&this._buffers.push(e.paintVertexBuffer);}}upload(t){for(const e in this.binders){const r=this.binders[e];(r instanceof Ga||r instanceof Za||r instanceof Ka)&&r.upload(t);}this.updatePaintBuffers();}destroy(){for(const t in this.binders){const e=this.binders[t];(e instanceof Ga||e instanceof Za||e instanceof Ka)&&e.destroy();}}}class Ja{constructor(t,e,r=(()=>!0)){this.programConfigurations={};for(const n of t)this.programConfigurations[n.id]=new Xa(n,e,r);this.needsUpload=!1,this._featureMap=new Ea,this._bufferOffset=0;}populatePaintArrays(t,e,r,n,i,s,a){for(const r in this.programConfigurations)this.programConfigurations[r].populatePaintArrays(t,e,n,i,s,a);void 0!==e.id&&this._featureMap.add(e.id,r,this._bufferOffset,t),this._bufferOffset=t,this.needsUpload=!0;}updatePaintArrays(t,e,r,n,i){for(const s of r)this.needsUpload=this.programConfigurations[s.id].updatePaintArrays(t,this._featureMap,e,s,n,i)||this.needsUpload;}get(t){return this.programConfigurations[t]}upload(t){if(this.needsUpload){for(const e in this.programConfigurations)this.programConfigurations[e].upload(t);this.needsUpload=!1;}}destroy(){for(const t in this.programConfigurations)this.programConfigurations[t].destroy();}}const Ha={"text-opacity":["opacity"],"icon-opacity":["opacity"],"text-color":["fill_color"],"icon-color":["fill_color"],"text-halo-color":["halo_color"],"icon-halo-color":["halo_color"],"text-halo-blur":["halo_blur"],"icon-halo-blur":["halo_blur"],"text-halo-width":["halo_width"],"icon-halo-width":["halo_width"],"line-gap-width":["gapwidth"],"line-pattern":["pattern","pixel_ratio"],"fill-pattern":["pattern","pixel_ratio"],"fill-extrusion-pattern":["pattern","pixel_ratio"],"line-dasharray":["dash"]};function Ya(t,e){return Ha[t]||[t.replace(`${e}-`,"").replace(/-/g,"_")]}const Wa={"line-pattern":{source:Gs,composite:Gs},"fill-pattern":{source:Gs,composite:Gs},"fill-extrusion-pattern":{source:Gs,composite:Gs},"line-dasharray":{source:Zs,composite:Zs}},Qa={color:{source:ca,composite:Ns},number:{source:sa,composite:ca}};function to(t,e,r){const n=Wa[t];return n&&n[r]||Qa[e][r]}Ji(qa,"ConstantBinder"),Ji(Na,"PatternConstantBinder"),Ji(Ga,"SourceExpressionBinder"),Ji(Ka,"PatternCompositeBinder"),Ji(Za,"CompositeExpressionBinder"),Ji(Xa,"ProgramConfiguration",{omit:["_buffers"]}),Ji(Ja,"ProgramConfigurationSet");const eo="-transition";class ro extends Qt{constructor(t,e){if(super(),this.id=t.id,this.type=t.type,this._featureFilter={filter:()=>!0,needGeometry:!1,needFeature:!1},this._filterCompiled=!1,"custom"!==t.type&&(this.metadata=t.metadata,this.minzoom=t.minzoom,this.maxzoom=t.maxzoom,"background"!==t.type&&"sky"!==t.type&&(this.source=t.source,this.sourceLayer=t["source-layer"],this.filter=t.filter),e.layout&&(this._unevaluatedLayout=new Ms(e.layout)),e.paint)){this._transitionablePaint=new Ss(e.paint);for(const e in t.paint)this.setPaintProperty(e,t.paint[e],{validate:!1});for(const e in t.layout)this.setLayoutProperty(e,t.layout[e],{validate:!1});this._transitioningPaint=this._transitionablePaint.untransitioned(),this.paint=new zs(e.paint);}}getLayoutProperty(t){return "visibility"===t?this.visibility:this._unevaluatedLayout.getValue(t)}setLayoutProperty(t,e,r={}){null!=e&&this._validate(ji,`layers.${this.id}.layout.${t}`,t,e,r)||("visibility"!==t?this._unevaluatedLayout.setValue(t,e):this.visibility=e);}getPaintProperty(t){return U(t,eo)?this._transitionablePaint.getTransition(t.slice(0,-11)):this._transitionablePaint.getValue(t)}setPaintProperty(t,e,r={}){if(null!=e&&this._validate($i,`layers.${this.id}.paint.${t}`,t,e,r))return !1;if(U(t,eo))return this._transitionablePaint.setTransition(t.slice(0,-11),e||void 0),!1;{const r=this._transitionablePaint._values[t],n=r.value.isDataDriven(),i=r.value;this._transitionablePaint.setValue(t,e),this._handleSpecialPaintPropertyUpdate(t);const s=this._transitionablePaint._values[t].value,a=s.isDataDriven(),o=U(t,"pattern")||"line-dasharray"===t;return a||n||o||this._handleOverridablePaintPropertyUpdate(t,i,s)}}_handleSpecialPaintPropertyUpdate(t){}getProgramIds(){return null}getProgramConfiguration(t){return null}_handleOverridablePaintPropertyUpdate(t,e,r){return !1}isHidden(t){return !!(this.minzoom&&t<this.minzoom)||!!(this.maxzoom&&t>=this.maxzoom)||"none"===this.visibility}updateTransitions(t){this._transitioningPaint=this._transitionablePaint.transitioned(t,this._transitioningPaint);}hasTransition(){return this._transitioningPaint.hasTransition()}recalculate(t,e){this._unevaluatedLayout&&(this.layout=this._unevaluatedLayout.possiblyEvaluate(t,void 0,e)),this.paint=this._transitioningPaint.possiblyEvaluate(t,void 0,e);}serialize(){const t={id:this.id,type:this.type,source:this.source,"source-layer":this.sourceLayer,metadata:this.metadata,minzoom:this.minzoom,maxzoom:this.maxzoom,filter:this.filter,layout:this._unevaluatedLayout&&this._unevaluatedLayout.serialize(),paint:this._transitionablePaint&&this._transitionablePaint.serialize()};return this.visibility&&(t.layout=t.layout||{},t.layout.visibility=this.visibility),j(t,((t,e)=>!(void 0===t||"layout"===e&&!Object.keys(t).length||"paint"===e&&!Object.keys(t).length)))}_validate(t,e,r,n,i={}){return (!i||!1!==i.validate)&&qi(this,t.call(Ui,{key:e,layerType:this.type,objectKey:r,value:n,styleSpec:te,style:{glyphs:!0,sprite:!0}}))}is3D(){return !1}isSky(){return !1}isTileClipped(){return !1}hasOffscreenPass(){return !1}resize(){}isStateDependent(){for(const t in this.paint._values){const e=this.paint.get(t);if(e instanceof Ts&&Ln(e.property.specification)&&("source"===e.value.kind||"composite"===e.value.kind)&&e.value.isStateDependent)return !0}return !1}compileFilter(){this._filterCompiled||(this._featureFilter=hi(this.filter),this._filterCompiled=!0);}invalidateCompiledFilter(){this._filterCompiled=!1;}dynamicFilter(){return this._featureFilter.dynamicFilter}dynamicFilterNeedsFeature(){return this._featureFilter.needFeature}}const no=Rs([{name:"a_pos",components:2,type:"Int16"}],4),io=Rs([{name:"a_pos_3",components:3,type:"Int16"},{name:"a_pos_normal_3",components:3,type:"Int16"}]);class so{constructor(t=[]){this.segments=t;}prepareSegment(t,e,r,n){let i=this.segments[this.segments.length-1];return t>so.MAX_VERTEX_ARRAY_LENGTH&&N(`Max vertices per segment is ${so.MAX_VERTEX_ARRAY_LENGTH}: bucket requested ${t}`),(!i||i.vertexLength+t>so.MAX_VERTEX_ARRAY_LENGTH||i.sortKey!==n)&&(i={vertexOffset:e.length,primitiveOffset:r.length,vertexLength:0,primitiveLength:0},void 0!==n&&(i.sortKey=n),this.segments.push(i)),i}get(){return this.segments}destroy(){for(const t of this.segments)for(const e in t.vaos)t.vaos[e].destroy();}static simpleSegment(t,e,r,n){return new so([{vertexOffset:t,primitiveOffset:e,vertexLength:r,primitiveLength:n,vaos:{},sortKey:0}])}}so.MAX_VERTEX_ARRAY_LENGTH=Math.pow(2,16)-1,Ji(so,"SegmentVector");var ao=8192;class oo{constructor(t,e){t&&(e?this.setSouthWest(t).setNorthEast(e):4===t.length?this.setSouthWest([t[0],t[1]]).setNorthEast([t[2],t[3]]):this.setSouthWest(t[0]).setNorthEast(t[1]));}setNorthEast(t){return this._ne=t instanceof Ol?new Ol(t.lng,t.lat):Ol.convert(t),this}setSouthWest(t){return this._sw=t instanceof Ol?new Ol(t.lng,t.lat):Ol.convert(t),this}extend(t){const e=this._sw,r=this._ne;let n,i;if(t instanceof Ol)n=t,i=t;else {if(!(t instanceof oo))return Array.isArray(t)?4===t.length||t.every(Array.isArray)?this.extend(oo.convert(t)):this.extend(Ol.convert(t)):"object"==typeof t&&null!==t&&t.hasOwnProperty("lat")&&(t.hasOwnProperty("lon")||t.hasOwnProperty("lng"))?this.extend(Ol.convert(t)):this;if(n=t._sw,i=t._ne,!n||!i)return this}return e||r?(e.lng=Math.min(n.lng,e.lng),e.lat=Math.min(n.lat,e.lat),r.lng=Math.max(i.lng,r.lng),r.lat=Math.max(i.lat,r.lat)):(this._sw=new Ol(n.lng,n.lat),this._ne=new Ol(i.lng,i.lat)),this}getCenter(){return new Ol((this._sw.lng+this._ne.lng)/2,(this._sw.lat+this._ne.lat)/2)}getSouthWest(){return this._sw}getNorthEast(){return this._ne}getNorthWest(){return new Ol(this.getWest(),this.getNorth())}getSouthEast(){return new Ol(this.getEast(),this.getSouth())}getWest(){return this._sw.lng}getSouth(){return this._sw.lat}getEast(){return this._ne.lng}getNorth(){return this._ne.lat}toArray(){return [this._sw.toArray(),this._ne.toArray()]}toString(){return `LngLatBounds(${this._sw.toString()}, ${this._ne.toString()})`}isEmpty(){return !(this._sw&&this._ne)}contains(t){const{lng:e,lat:r}=Ol.convert(t);let n=this._sw.lng<=e&&e<=this._ne.lng;return this._sw.lng>this._ne.lng&&(n=this._sw.lng>=e&&e>=this._ne.lng),this._sw.lat<=r&&r<=this._ne.lat&&n}static convert(t){return !t||t instanceof oo?t:new oo(t)}}var lo=1e-6,uo="undefined"!=typeof Float32Array?Float32Array:Array;function co(){var t=new uo(9);return uo!=Float32Array&&(t[1]=0,t[2]=0,t[3]=0,t[5]=0,t[6]=0,t[7]=0),t[0]=1,t[4]=1,t[8]=1,t}function ho(t,e,r){var n=e[0],i=e[1],s=e[2],a=e[3],o=e[4],l=e[5],u=e[6],c=e[7],h=e[8],p=r[0],d=r[1],f=r[2],y=r[3],m=r[4],g=r[5],x=r[6],v=r[7],b=r[8];return t[0]=p*n+d*a+f*u,t[1]=p*i+d*o+f*c,t[2]=p*s+d*l+f*h,t[3]=y*n+m*a+g*u,t[4]=y*i+m*o+g*c,t[5]=y*s+m*l+g*h,t[6]=x*n+v*a+b*u,t[7]=x*i+v*o+b*c,t[8]=x*s+v*l+b*h,t}function po(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function fo(t,e){var r=e[0],n=e[1],i=e[2],s=e[3],a=e[4],o=e[5],l=e[6],u=e[7],c=e[8],h=e[9],p=e[10],d=e[11],f=e[12],y=e[13],m=e[14],g=e[15],x=r*o-n*a,v=r*l-i*a,b=r*u-s*a,w=n*l-i*o,_=n*u-s*o,A=i*u-s*l,S=c*y-h*f,k=c*m-p*f,I=c*g-d*f,M=h*m-p*y,T=h*g-d*y,z=p*g-d*m,B=x*z-v*T+b*M+w*I-_*k+A*S;return B?(t[0]=(o*z-l*T+u*M)*(B=1/B),t[1]=(i*T-n*z-s*M)*B,t[2]=(y*A-m*_+g*w)*B,t[3]=(p*_-h*A-d*w)*B,t[4]=(l*I-a*z-u*k)*B,t[5]=(r*z-i*I+s*k)*B,t[6]=(m*b-f*A-g*v)*B,t[7]=(c*A-p*b+d*v)*B,t[8]=(a*T-o*I+u*S)*B,t[9]=(n*I-r*T-s*S)*B,t[10]=(f*_-y*b+g*x)*B,t[11]=(h*b-c*_-d*x)*B,t[12]=(o*k-a*M-l*S)*B,t[13]=(r*M-n*k+i*S)*B,t[14]=(y*v-f*w-m*x)*B,t[15]=(c*w-h*v+p*x)*B,t):null}function yo(t,e,r){var n=e[0],i=e[1],s=e[2],a=e[3],o=e[4],l=e[5],u=e[6],c=e[7],h=e[8],p=e[9],d=e[10],f=e[11],y=e[12],m=e[13],g=e[14],x=e[15],v=r[0],b=r[1],w=r[2],_=r[3];return t[0]=v*n+b*o+w*h+_*y,t[1]=v*i+b*l+w*p+_*m,t[2]=v*s+b*u+w*d+_*g,t[3]=v*a+b*c+w*f+_*x,t[4]=(v=r[4])*n+(b=r[5])*o+(w=r[6])*h+(_=r[7])*y,t[5]=v*i+b*l+w*p+_*m,t[6]=v*s+b*u+w*d+_*g,t[7]=v*a+b*c+w*f+_*x,t[8]=(v=r[8])*n+(b=r[9])*o+(w=r[10])*h+(_=r[11])*y,t[9]=v*i+b*l+w*p+_*m,t[10]=v*s+b*u+w*d+_*g,t[11]=v*a+b*c+w*f+_*x,t[12]=(v=r[12])*n+(b=r[13])*o+(w=r[14])*h+(_=r[15])*y,t[13]=v*i+b*l+w*p+_*m,t[14]=v*s+b*u+w*d+_*g,t[15]=v*a+b*c+w*f+_*x,t}function mo(t,e,r){var n,i,s,a,o,l,u,c,h,p,d,f,y=r[0],m=r[1],g=r[2];return e===t?(t[12]=e[0]*y+e[4]*m+e[8]*g+e[12],t[13]=e[1]*y+e[5]*m+e[9]*g+e[13],t[14]=e[2]*y+e[6]*m+e[10]*g+e[14],t[15]=e[3]*y+e[7]*m+e[11]*g+e[15]):(i=e[1],s=e[2],a=e[3],o=e[4],l=e[5],u=e[6],c=e[7],h=e[8],p=e[9],d=e[10],f=e[11],t[0]=n=e[0],t[1]=i,t[2]=s,t[3]=a,t[4]=o,t[5]=l,t[6]=u,t[7]=c,t[8]=h,t[9]=p,t[10]=d,t[11]=f,t[12]=n*y+o*m+h*g+e[12],t[13]=i*y+l*m+p*g+e[13],t[14]=s*y+u*m+d*g+e[14],t[15]=a*y+c*m+f*g+e[15]),t}function go(t,e,r){var n=r[0],i=r[1],s=r[2];return t[0]=e[0]*n,t[1]=e[1]*n,t[2]=e[2]*n,t[3]=e[3]*n,t[4]=e[4]*i,t[5]=e[5]*i,t[6]=e[6]*i,t[7]=e[7]*i,t[8]=e[8]*s,t[9]=e[9]*s,t[10]=e[10]*s,t[11]=e[11]*s,t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15],t}function xo(t,e,r){var n=Math.sin(r),i=Math.cos(r),s=e[4],a=e[5],o=e[6],l=e[7],u=e[8],c=e[9],h=e[10],p=e[11];return e!==t&&(t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t[4]=s*i+u*n,t[5]=a*i+c*n,t[6]=o*i+h*n,t[7]=l*i+p*n,t[8]=u*i-s*n,t[9]=c*i-a*n,t[10]=h*i-o*n,t[11]=p*i-l*n,t}function vo(t,e,r){var n=Math.sin(r),i=Math.cos(r),s=e[0],a=e[1],o=e[2],l=e[3],u=e[8],c=e[9],h=e[10],p=e[11];return e!==t&&(t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t[0]=s*i-u*n,t[1]=a*i-c*n,t[2]=o*i-h*n,t[3]=l*i-p*n,t[8]=s*n+u*i,t[9]=a*n+c*i,t[10]=o*n+h*i,t[11]=l*n+p*i,t}function bo(t,e){return t[0]=e[0],t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=e[1],t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=e[2],t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function wo(t,e,r){var n,i,s,a=r[0],o=r[1],l=r[2],u=Math.hypot(a,o,l);return u<lo?null:(a*=u=1/u,o*=u,l*=u,n=Math.sin(e),i=Math.cos(e),t[0]=a*a*(s=1-i)+i,t[1]=o*a*s+l*n,t[2]=l*a*s-o*n,t[3]=0,t[4]=a*o*s-l*n,t[5]=o*o*s+i,t[6]=l*o*s+a*n,t[7]=0,t[8]=a*l*s+o*n,t[9]=o*l*s-a*n,t[10]=l*l*s+i,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t)}Math.hypot||(Math.hypot=function(){for(var t=0,e=arguments.length;e--;)t+=arguments[e]*arguments[e];return Math.sqrt(t)});var _o=yo;function Ao(){var t=new uo(3);return uo!=Float32Array&&(t[0]=0,t[1]=0,t[2]=0),t}function So(t){var e=new uo(3);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e}function ko(t){return Math.hypot(t[0],t[1],t[2])}function Io(t,e,r){var n=new uo(3);return n[0]=t,n[1]=e,n[2]=r,n}function Mo(t,e,r){return t[0]=e[0]+r[0],t[1]=e[1]+r[1],t[2]=e[2]+r[2],t}function To(t,e,r){return t[0]=e[0]-r[0],t[1]=e[1]-r[1],t[2]=e[2]-r[2],t}function zo(t,e,r){return t[0]=e[0]*r[0],t[1]=e[1]*r[1],t[2]=e[2]*r[2],t}function Bo(t,e,r){return t[0]=Math.min(e[0],r[0]),t[1]=Math.min(e[1],r[1]),t[2]=Math.min(e[2],r[2]),t}function Eo(t,e,r){return t[0]=Math.max(e[0],r[0]),t[1]=Math.max(e[1],r[1]),t[2]=Math.max(e[2],r[2]),t}function Co(t,e,r){return t[0]=e[0]*r,t[1]=e[1]*r,t[2]=e[2]*r,t}function Po(t,e,r,n){return t[0]=e[0]+r[0]*n,t[1]=e[1]+r[1]*n,t[2]=e[2]+r[2]*n,t}function Do(t,e){var r=e[0],n=e[1],i=e[2],s=r*r+n*n+i*i;return s>0&&(s=1/Math.sqrt(s)),t[0]=e[0]*s,t[1]=e[1]*s,t[2]=e[2]*s,t}function Vo(t,e){return t[0]*e[0]+t[1]*e[1]+t[2]*e[2]}function Lo(t,e,r){var n=e[0],i=e[1],s=e[2],a=r[0],o=r[1],l=r[2];return t[0]=i*l-s*o,t[1]=s*a-n*l,t[2]=n*o-i*a,t}function Fo(t,e,r){var n=e[0],i=e[1],s=e[2],a=r[3]*n+r[7]*i+r[11]*s+r[15];return t[0]=(r[0]*n+r[4]*i+r[8]*s+r[12])/(a=a||1),t[1]=(r[1]*n+r[5]*i+r[9]*s+r[13])/a,t[2]=(r[2]*n+r[6]*i+r[10]*s+r[14])/a,t}function Ro(t,e,r){var n=r[0],i=r[1],s=r[2],a=e[0],o=e[1],l=e[2],u=i*l-s*o,c=s*a-n*l,h=n*o-i*a,p=i*h-s*c,d=s*u-n*h,f=n*c-i*u,y=2*r[3];return c*=y,h*=y,d*=2,f*=2,t[0]=a+(u*=y)+(p*=2),t[1]=o+c+d,t[2]=l+h+f,t}var Uo,$o=To,jo=zo,Oo=ko;function qo(t,e,r){return t[0]=e[0]*r,t[1]=e[1]*r,t[2]=e[2]*r,t[3]=e[3]*r,t}function No(t,e){var r=e[0],n=e[1],i=e[2],s=e[3],a=r*r+n*n+i*i+s*s;return a>0&&(a=1/Math.sqrt(a)),t[0]=r*a,t[1]=n*a,t[2]=i*a,t[3]=s*a,t}function Go(t,e,r){var n=e[0],i=e[1],s=e[2],a=e[3];return t[0]=r[0]*n+r[4]*i+r[8]*s+r[12]*a,t[1]=r[1]*n+r[5]*i+r[9]*s+r[13]*a,t[2]=r[2]*n+r[6]*i+r[10]*s+r[14]*a,t[3]=r[3]*n+r[7]*i+r[11]*s+r[15]*a,t}function Zo(){var t=new uo(4);return uo!=Float32Array&&(t[0]=0,t[1]=0,t[2]=0),t[3]=1,t}function Ko(t){return t[0]=0,t[1]=0,t[2]=0,t[3]=1,t}function Xo(t,e,r){r*=.5;var n=e[0],i=e[1],s=e[2],a=e[3],o=Math.sin(r),l=Math.cos(r);return t[0]=n*l+a*o,t[1]=i*l+s*o,t[2]=s*l-i*o,t[3]=a*l-n*o,t}function Jo(t,e,r){r*=.5;var n=e[0],i=e[1],s=e[2],a=e[3],o=Math.sin(r),l=Math.cos(r);return t[0]=n*l-s*o,t[1]=i*l+a*o,t[2]=s*l+n*o,t[3]=a*l-i*o,t}Ao(),Uo=new uo(4),uo!=Float32Array&&(Uo[0]=0,Uo[1]=0,Uo[2]=0,Uo[3]=0);var Ho=No;Ao(),Io(1,0,0),Io(0,1,0),Zo(),Zo(),co();const Yo=Rs([{type:"Float32",name:"a_globe_pos",components:3},{type:"Float32",name:"a_uv",components:2}]),{members:Wo}=Yo,Qo=Rs([{name:"a_pos_3",components:3,type:"Int16"}]);var tl=Rs([{name:"a_pos",type:"Int16",components:2}]);class el{constructor(t,e){this.pos=t,this.dir=e;}intersectsPlane(t,e,r){const n=Vo(e,this.dir);if(Math.abs(n)<1e-6)return !1;const i=((t[0]-this.pos[0])*e[0]+(t[1]-this.pos[1])*e[1]+(t[2]-this.pos[2])*e[2])/n;return r[0]=this.pos[0]+this.dir[0]*i,r[1]=this.pos[1]+this.dir[1]*i,r[2]=this.pos[2]+this.dir[2]*i,!0}closestPointOnSphere(t,e,r){if(function(t,e){var r=t[0],n=t[1],i=t[2],s=e[0],a=e[1],o=e[2];return Math.abs(r-s)<=lo*Math.max(1,Math.abs(r),Math.abs(s))&&Math.abs(n-a)<=lo*Math.max(1,Math.abs(n),Math.abs(a))&&Math.abs(i-o)<=lo*Math.max(1,Math.abs(i),Math.abs(o))}(this.pos,t)||0===e)return r[0]=r[1]=r[2]=0,!1;const[n,i,s]=this.dir,a=this.pos[0]-t[0],o=this.pos[1]-t[1],l=this.pos[2]-t[2],u=n*n+i*i+s*s,c=2*(a*n+o*i+l*s),h=c*c-4*u*(a*a+o*o+l*l-e*e);if(h<0){const t=Math.max(-c/2,0),u=a+n*t,h=o+i*t,p=l+s*t,d=Math.hypot(u,h,p);return r[0]=u*e/d,r[1]=h*e/d,r[2]=p*e/d,!1}{const t=(-c-Math.sqrt(h))/(2*u);if(t<0){const t=Math.hypot(a,o,l);return r[0]=a*e/t,r[1]=o*e/t,r[2]=l*e/t,!1}return r[0]=a+n*t,r[1]=o+i*t,r[2]=l+s*t,!0}}}class rl{constructor(t,e,r,n,i){this.TL=t,this.TR=e,this.BR=r,this.BL=n,this.horizon=i;}static fromInvProjectionMatrix(t,e,r){const n=[-1,1,1],i=[1,1,1],s=[1,-1,1],a=[-1,-1,1],o=Fo(n,n,t),l=Fo(i,i,t),u=Fo(s,s,t),c=Fo(a,a,t);return new rl(o,l,u,c,e/r)}}class nl{constructor(t,e){this.points=t,this.planes=e;}static fromInvProjectionMatrix(t,e,r,n){const i=Math.pow(2,r),s=[[-1,1,-1,1],[1,1,-1,1],[1,-1,-1,1],[-1,-1,-1,1],[-1,1,1,1],[1,1,1,1],[1,-1,1,1],[-1,-1,1,1]].map((r=>{const s=Go([],r,t),a=1/s[3]/e*i;return function(t,e,r){return t[0]=e[0]*r[0],t[1]=e[1]*r[1],t[2]=e[2]*r[2],t[3]=e[3]*r[3],t}(s,s,[a,a,n?1/s[3]:a,a])})),a=[[0,1,2],[6,5,4],[0,3,7],[2,1,5],[3,2,6],[0,4,5]].map((t=>{const e=Do([],Lo([],$o([],s[t[0]],s[t[1]]),$o([],s[t[2]],s[t[1]]))),r=-Vo(e,s[t[1]]);return e.concat(r)}));return new nl(s,a)}}class il{static fromPoints(t){const e=[1/0,1/0,1/0],r=[-1/0,-1/0,-1/0];for(const n of t)Bo(e,e,n),Eo(r,r,n);return new il(e,r)}static applyTransform(t,e){const r=t.getCorners();for(let t=0;t<r.length;++t)Fo(r[t],r[t],e);return il.fromPoints(r)}constructor(t,e){this.min=t,this.max=e,this.center=Co([],Mo([],this.min,this.max),.5);}quadrant(t){const e=[t%2==0,t<2],r=So(this.min),n=So(this.max);for(let t=0;t<e.length;t++)r[t]=e[t]?this.min[t]:this.center[t],n[t]=e[t]?this.center[t]:this.max[t];return n[2]=this.max[2],new il(r,n)}distanceX(t){return Math.max(Math.min(this.max[0],t[0]),this.min[0])-t[0]}distanceY(t){return Math.max(Math.min(this.max[1],t[1]),this.min[1])-t[1]}distanceZ(t){return Math.max(Math.min(this.max[2],t[2]),this.min[2])-t[2]}getCorners(){const t=this.min,e=this.max;return [[t[0],t[1],t[2]],[e[0],t[1],t[2]],[e[0],e[1],t[2]],[t[0],e[1],t[2]],[t[0],t[1],e[2]],[e[0],t[1],e[2]],[e[0],e[1],e[2]],[t[0],e[1],e[2]]]}intersects(t){const e=this.getCorners();let r=!0;for(let n=0;n<t.planes.length;n++){const i=t.planes[n];let s=0;for(let t=0;t<e.length;t++)s+=Vo(i,e[t])+i[3]>=0;if(0===s)return 0;s!==e.length&&(r=!1);}if(r)return 2;for(let e=0;e<3;e++){let r=Number.MAX_VALUE,n=-Number.MAX_VALUE;for(let i=0;i<t.points.length;i++){const s=t.points[i][e]-this.min[e];r=Math.min(r,s),n=Math.max(n,s);}if(n<0||r>this.max[e]-this.min[e])return 0}return 1}}const sl=5,al=6,ol=ao/Math.PI/2,ll=16383,ul=64,cl=[ul,32,16],hl=-ol,pl=ol,dl=[new il([hl,hl,hl],[pl,pl,pl]),new il([hl,hl,hl],[0,0,pl]),new il([0,hl,hl],[pl,0,pl]),new il([hl,0,hl],[0,pl,pl]),new il([0,0,hl],[pl,pl,pl])];function fl(t){return t*ol/Ul}function yl(t,e,r,n=!0){const i=Co([],t._camera.position,t.worldSize),s=[e,r,1,1];Go(s,s,t.pixelMatrixInverse),qo(s,s,1/s[3]);const a=Do([],$o([],s,i)),o=t.globeMatrix,l=[o[12],o[13],o[14]],u=$o([],l,i),c=ko(u),h=Do([],u),p=t.worldSize/(2*Math.PI),d=Vo(h,a),f=Math.asin(p/c);if(f<Math.acos(d)){if(!n)return null;const t=[],e=[];Co(t,a,c/d),Do(e,$o(e,t,u)),Do(a,Mo(a,u,Co(a,e,Math.tan(f)*c)));}const y=[];new el(i,a).closestPointOnSphere(l,p,y);const m=Do([],W(o,0)),g=Do([],W(o,1)),x=Do([],W(o,2)),v=Vo(m,y),b=Vo(g,y),w=Vo(x,y),A=_(Math.asin(-b/p));let S=_(Math.atan2(v,w));S=t.center.lng+function(t,e){const r=(e-t+180)%360-180;return r<-180?r+360:r}(t.center.lng,S);const k=Nl(S),I=M(Gl(A),0,1);return new Wl(k,I)}class ml{constructor(t,e,r){this.a=$o([],t,r),this.b=$o([],e,r),this.center=r;const n=Do([],this.a),i=Do([],this.b);this.angle=Math.acos(Vo(n,i));}}function gl(t,e){if(0===t.angle)return null;let r;return r=0===t.a[e]?1/t.angle*.5*Math.PI:1/t.angle*Math.atan(t.b[e]/t.a[e]/Math.sin(t.angle)-1/Math.tan(t.angle)),r<0||r>1?null:function(t,e,r,n){const i=Math.sin(r);return t*(Math.sin((1-n)*r)/i)+e*(Math.sin(n*r)/i)}(t.a[e],t.b[e],t.angle,M(r,0,1))+t.center[e]}function xl(t){if(t.z<=1)return dl[t.z+2*t.y+t.x];const e=Sl(Al(t));return il.fromPoints(e)}function vl(t,e,r){return Co(t,t,1-r),Po(t,t,e,r)}function bl(t,e){const r=Pl(e.zoom);if(0===r)return xl(t);const n=Al(t),i=Sl(n),s=Nl(n.getWest())*e.worldSize,a=Nl(n.getEast())*e.worldSize,o=Gl(n.getNorth())*e.worldSize,l=Gl(n.getSouth())*e.worldSize,u=[s,o,0],c=[a,o,0],h=[s,l,0],p=[a,l,0],d=fo([],e.globeMatrix);return Fo(u,u,d),Fo(c,c,d),Fo(h,h,d),Fo(p,p,d),i[0]=vl(i[0],h,r),i[1]=vl(i[1],p,r),i[2]=vl(i[2],c,r),i[3]=vl(i[3],u,r),il.fromPoints(i)}function wl(t,e,r){for(const n of t)Fo(n,n,e),Co(n,n,r);}function _l(t,e,r){const n=e/t.worldSize,i=t.globeMatrix;if(r.z<=1){const t=xl(r).getCorners();return wl(t,i,n),il.fromPoints(t)}const s=Al(r),a=Sl(s);wl(a,i,n);const o=Number.MAX_VALUE,l=[-o,-o,-o],u=[o,o,o];if(s.contains(t.center)){for(const t of a)Bo(u,u,t),Eo(l,l,t);l[2]=0;const e=t.point,r=[e.x*n,e.y*n,0];return Bo(u,u,r),Eo(l,l,r),new il(u,l)}const c=[i[12]*n,i[13]*n,i[14]*n],h=s.getCenter(),p=M(t.center.lat,-Hl,Hl),d=M(h.lat,-Hl,Hl),f=Nl(t.center.lng),y=Gl(p);let m=f-Nl(h.lng);const g=y-Gl(d);m>.5?m-=1:m<-.5&&(m+=1);let x=0;Math.abs(m)>Math.abs(g)?x=m>=0?1:3:(x=g>=0?0:2,Po(c,c,[i[4]*n,i[5]*n,i[6]*n],-Math.sin(w(g>=0?s.getSouth():s.getNorth()))*ol));const v=a[x],b=a[(x+1)%4],_=new ml(v,b,c),A=[gl(_,0)||v[0],gl(_,1)||v[1],gl(_,2)||v[2]],S=Pl(t.zoom);if(S>0){const n=function({x:t,y:e,z:r},n,i,s,a){const o=1/(1<<r);let l=t*o,u=l+o,c=e*o,h=c+o,p=0;const d=(l+u)/2-s;return d>.5?p=-1:d<-.5&&(p=1),l=((l+p)*n-(s*=n))*i+s,u=((u+p)*n-s)*i+s,c=(c*n-(a*=n))*i+a,h=(h*n-a)*i+a,[[l,h,0],[u,h,0],[u,c,0],[l,c,0]]}(r,e,t._pixelsPerMercatorPixel,f,y);for(let t=0;t<a.length;t++)vl(a[t],n[t],S);const i=Mo([],n[x],n[(x+1)%4]);Co(i,i,.5),vl(A,i,S);}for(const t of a)Bo(u,u,t),Eo(l,l,t);return u[2]=Math.min(v[2],b[2]),Bo(u,u,A),Eo(l,l,A),new il(u,l)}function Al({x:t,y:e,z:r}){const n=1/(1<<r),i=new Ol(Kl(t*n),Xl((e+1)*n)),s=new Ol(Kl((t+1)*n),Xl(e*n));return new oo(i,s)}function Sl(t){const e=w(t.getNorth()),r=w(t.getSouth()),n=Math.cos(e),i=Math.cos(r),s=Math.sin(e),a=Math.sin(r),o=t.getWest(),l=t.getEast();return [kl(i,a,o),kl(i,a,l),kl(n,s,l),kl(n,s,o)]}function kl(t,e,r,n=ol){return r=w(r),[t*Math.sin(r)*n,-e*n,t*Math.cos(r)*n]}function Il(t,e,r){return kl(Math.cos(w(t)),Math.sin(w(t)),e,r)}function Ml(t,e,r,n){const i=1<<r.z,s=(t/ao+r.x)/i;return Il(Xl((e/ao+r.y)/i),Kl(s),n)}function Tl({min:t,max:e}){return ll/Math.max(e[0]-t[0],e[1]-t[1],e[2]-t[2])}const zl=new Float64Array(16);function Bl(t){const e=Tl(t),r=bo(zl,[e,e,e]);return mo(r,r,((n=[])[0]=-(i=t.min)[0],n[1]=-i[1],n[2]=-i[2],n));var n,i;}function El(t){const e=(n=t.min,(r=zl)[0]=1,r[1]=0,r[2]=0,r[3]=0,r[4]=0,r[5]=1,r[6]=0,r[7]=0,r[8]=0,r[9]=0,r[10]=1,r[11]=0,r[12]=n[0],r[13]=n[1],r[14]=n[2],r[15]=1,r);var r,n;const i=1/Tl(t);return go(e,e,[i,i,i])}function Cl(t,e,r,n,i){const s=function(t){const e=ao/(2*Math.PI);return t/(2*Math.PI)/e}(r),a=[t,e,-r/(2*Math.PI)],o=po(new Float64Array(16));return mo(o,o,a),go(o,o,[s,s,s]),xo(o,o,w(-i)),vo(o,o,w(-n)),o}function Pl(t){return T(sl,al,t)}function Dl(t,e){const r=Il(e.lat,e.lng),n=function(t){const e=Il(t._center.lat,t._center.lng);let r=Lo([],Io(0,1,0),e);const n=wo([],-t.angle,e);r=Fo(r,r,n),wo(n,-t._pitch,r);const i=Do([],e);return Co(i,i,fl(t.cameraToCenterDistance/t.pixelsPerMeter)),Fo(i,i,n),Mo([],e,i)}(t);return a=(i=To([],n,r))[0],o=i[1],l=i[2],u=(s=r)[0],c=s[1],h=s[2],d=(p=Math.sqrt(a*a+o*o+l*l)*Math.sqrt(u*u+c*c+h*h))&&Vo(i,s)/p,Math.acos(Math.min(Math.max(d,-1),1));var i,s,a,o,l,u,c,h,p,d;}function Vl(t,e){return Dl(t,e)>Math.PI/2*1.01}const Ll=w(85),Fl=Math.cos(Ll),Rl=Math.sin(Ll),Ul=6371008.8,$l=2*Math.PI*Ul;class jl{constructor(t,e){if(isNaN(t)||isNaN(e))throw new Error(`Invalid LngLat object: (${t}, ${e})`);if(this.lng=+t,this.lat=+e,this.lat>90||this.lat<-90)throw new Error("Invalid LngLat latitude value: must be between -90 and 90")}wrap(){return new jl(z(this.lng,-180,180),this.lat)}toArray(){return [this.lng,this.lat]}toString(){return `LngLat(${this.lng}, ${this.lat})`}distanceTo(t){const e=Math.PI/180,r=this.lat*e,n=t.lat*e,i=Math.sin(r)*Math.sin(n)+Math.cos(r)*Math.cos(n)*Math.cos((t.lng-this.lng)*e);return Ul*Math.acos(Math.min(i,1))}toBounds(t=0){const e=360*t/40075017,r=e/Math.cos(Math.PI/180*this.lat);return new oo(new jl(this.lng-r,this.lat-e),new jl(this.lng+r,this.lat+e))}toEcef(t){const e=fl(t);return Il(this.lat,this.lng,ol+e)}static convert(t){if(t instanceof jl)return t;if(Array.isArray(t)&&(2===t.length||3===t.length))return new jl(Number(t[0]),Number(t[1]));if(!Array.isArray(t)&&"object"==typeof t&&null!==t)return new jl(Number("lng"in t?t.lng:t.lon),Number(t.lat));throw new Error("`LngLatLike` argument must be specified as a LngLat instance, an object {lng: <lng>, lat: <lat>}, an object {lon: <lng>, lat: <lat>}, or an array of [<lng>, <lat>]")}}var Ol=jl;function ql(t){return $l*Math.cos(t*Math.PI/180)}function Nl(t){return (180+t)/360}function Gl(t){return (180-180/Math.PI*Math.log(Math.tan(Math.PI/4+t*Math.PI/360)))/360}function Zl(t,e){return t/ql(e)}function Kl(t){return 360*t-180}function Xl(t){return 360/Math.PI*Math.atan(Math.exp((180-360*t)*Math.PI/180))-90}function Jl(t,e){return t*ql(Xl(e))}const Hl=85.051129;function Yl(t){return 1/Math.cos(t*Math.PI/180)}class Wl{constructor(t,e,r=0){this.x=+t,this.y=+e,this.z=+r;}static fromLngLat(t,e=0){const r=Ol.convert(t);return new Wl(Nl(r.lng),Gl(r.lat),Zl(e,r.lat))}toLngLat(){return new Ol(Kl(this.x),Xl(this.y))}toAltitude(){return Jl(this.z,this.y)}meterInMercatorCoordinateUnits(){return 1/$l*Yl(Xl(this.y))}}function Ql(t,e,r,n,i,s,a,o,l){const u=(e+n)/2,c=(r+i)/2,h=new x(u,c);o(h),function(t,e,r,n,i,s){const a=r-i,o=n-s;return Math.abs((n-e)*a-(r-t)*o)/Math.hypot(a,o)}(h.x,h.y,s.x,s.y,a.x,a.y)>=l?(Ql(t,e,r,u,c,s,h,o,l),Ql(t,u,c,n,i,h,a,o,l)):t.push(a);}function tu(t,e,r){let n=t[0],i=n.x,s=n.y;e(n);const a=[n];for(let o=1;o<t.length;o++){const l=t[o],{x:u,y:c}=l;e(l),Ql(a,i,s,u,c,n,l,e,r),i=u,s=c,n=l;}return a}function eu(t,e,r,n){if(n(e,r)){const i=e.add(r)._mult(.5);eu(t,e,i,n),eu(t,i,r,n);}else t.push(r);}function ru(t,e){let r=t[0];const n=[r];for(let i=1;i<t.length;i++){const s=t[i];eu(n,r,s,e),r=s;}return n}const nu=Math.pow(2,14)-1,iu=-nu-1;function su(t,e){const r=Math.round(t.x*e),n=Math.round(t.y*e);return t.x=M(r,iu,nu),t.y=M(n,iu,nu),(r<t.x||r>t.x+1||n<t.y||n>t.y+1)&&N("Geometry exceeds allowed extent, reduce your vector tile buffer size"),t}function au(t,e,r){const n=t.loadGeometry(),i=t.extent,s=ao/i;if(e&&r&&r.projection.isReprojectedInTileSpace){const s=1<<e.z,{scale:a,x:o,y:l,projection:u}=r,c=t=>{const r=Kl((e.x+t.x/i)/s),n=Xl((e.y+t.y/i)/s),c=u.project(r,n);t.x=(c.x*a-o)*i,t.y=(c.y*a-l)*i;};for(let e=0;e<n.length;e++)if(1!==t.type)n[e]=tu(n[e],c,1);else {const t=[];for(const r of n[e])r.x<0||r.x>=i||r.y<0||r.y>=i||(c(r),t.push(r));n[e]=t;}}for(const t of n)for(const e of t)su(e,s);return n}function ou(t,e){return {type:t.type,id:t.id,properties:t.properties,geometry:e?au(t):[]}}function lu(t,e,r,n,i){t.emplaceBack(2*e+(n+1)/2,2*r+(i+1)/2);}function uu(t,e,r){const n=16384;t.emplaceBack(e.x,e.y,e.z,r[0]*n,r[1]*n,r[2]*n);}class cu{constructor(t){this.zoom=t.zoom,this.overscaling=t.overscaling,this.layers=t.layers,this.layerIds=this.layers.map((t=>t.id)),this.index=t.index,this.hasPattern=!1,this.projection=t.projection,this.layoutVertexArray=new $s,this.indexArray=new ra,this.segments=new so,this.programConfigurations=new Ja(t.layers,t.zoom),this.stateDependentLayerIds=this.layers.filter((t=>t.isStateDependent())).map((t=>t.id));}populate(t,e,r,n){const i=this.layers[0],s=[];let a=null;"circle"===i.type&&(a=i.layout.get("circle-sort-key"));for(const{feature:e,id:i,index:o,sourceLayerIndex:l}of t){const t=this.layers[0]._featureFilter.needGeometry,u=ou(e,t);if(!this.layers[0]._featureFilter.filter(new ws(this.zoom),u,r))continue;const c=a?a.evaluate(u,{},r):void 0,h={id:i,properties:e.properties,type:e.type,sourceLayerIndex:l,index:o,geometry:t?u.geometry:au(e,r,n),patterns:{},sortKey:c};s.push(h);}a&&s.sort(((t,e)=>t.sortKey-e.sortKey));let o=null;"globe"===n.projection.name&&(this.globeExtVertexArray=new Ks,o=n.projection);for(const n of s){const{geometry:i,index:s,sourceLayerIndex:a}=n,l=t[s].feature;this.addFeature(n,i,s,e.availableImages,r,o),e.featureIndex.insert(l,i,s,a,this.index);}}update(t,e,r,n){this.stateDependentLayers.length&&this.programConfigurations.updatePaintArrays(t,e,this.stateDependentLayers,r,n);}isEmpty(){return 0===this.layoutVertexArray.length}uploadPending(){return !this.uploaded||this.programConfigurations.needsUpload}upload(t){this.uploaded||(this.layoutVertexBuffer=t.createVertexBuffer(this.layoutVertexArray,no.members),this.indexBuffer=t.createIndexBuffer(this.indexArray),this.globeExtVertexArray&&(this.globeExtVertexBuffer=t.createVertexBuffer(this.globeExtVertexArray,io.members))),this.programConfigurations.upload(t),this.uploaded=!0;}destroy(){this.layoutVertexBuffer&&(this.layoutVertexBuffer.destroy(),this.indexBuffer.destroy(),this.programConfigurations.destroy(),this.segments.destroy(),this.globeExtVertexBuffer&&this.globeExtVertexBuffer.destroy());}addFeature(t,e,r,n,i,s){for(const r of e)for(const e of r){const r=e.x,n=e.y;if(r<0||r>=ao||n<0||n>=ao)continue;if(s){const t=s.projectTilePoint(r,n,i),e=s.upVector(i,r,n),a=this.globeExtVertexArray;uu(a,t,e),uu(a,t,e),uu(a,t,e),uu(a,t,e);}const a=this.segments.prepareSegment(4,this.layoutVertexArray,this.indexArray,t.sortKey),o=a.vertexLength;lu(this.layoutVertexArray,r,n,-1,-1),lu(this.layoutVertexArray,r,n,1,-1),lu(this.layoutVertexArray,r,n,1,1),lu(this.layoutVertexArray,r,n,-1,1),this.indexArray.emplaceBack(o,o+1,o+2),this.indexArray.emplaceBack(o,o+2,o+3),a.vertexLength+=4,a.primitiveLength+=2;}this.programConfigurations.populatePaintArrays(this.layoutVertexArray.length,t,r,{},n,i);}}function hu(t,e){for(let r=0;r<t.length;r++)if(bu(e,t[r]))return !0;for(let r=0;r<e.length;r++)if(bu(t,e[r]))return !0;return !!yu(t,e)}function pu(t,e,r){return !!bu(t,e)||!!gu(e,t,r)}function du(t,e){if(1===t.length)return vu(e,t[0]);for(let r=0;r<e.length;r++){const n=e[r];for(let e=0;e<n.length;e++)if(bu(t,n[e]))return !0}for(let r=0;r<t.length;r++)if(vu(e,t[r]))return !0;for(let r=0;r<e.length;r++)if(yu(t,e[r]))return !0;return !1}function fu(t,e,r){if(t.length>1){if(yu(t,e))return !0;for(let n=0;n<e.length;n++)if(gu(e[n],t,r))return !0}for(let n=0;n<t.length;n++)if(gu(t[n],e,r))return !0;return !1}function yu(t,e){if(0===t.length||0===e.length)return !1;for(let r=0;r<t.length-1;r++){const n=t[r],i=t[r+1];for(let t=0;t<e.length-1;t++)if(mu(n,i,e[t],e[t+1]))return !0}return !1}function mu(t,e,r,n){return G(t,r,n)!==G(e,r,n)&&G(t,e,r)!==G(t,e,n)}function gu(t,e,r){const n=r*r;if(1===e.length)return t.distSqr(e[0])<n;for(let r=1;r<e.length;r++)if(xu(t,e[r-1],e[r])<n)return !0;return !1}function xu(t,e,r){const n=e.distSqr(r);if(0===n)return t.distSqr(e);const i=((t.x-e.x)*(r.x-e.x)+(t.y-e.y)*(r.y-e.y))/n;return t.distSqr(i<0?e:i>1?r:r.sub(e)._mult(i)._add(e))}function vu(t,e){let r,n,i,s=!1;for(let a=0;a<t.length;a++){r=t[a];for(let t=0,a=r.length-1;t<r.length;a=t++)n=r[t],i=r[a],n.y>e.y!=i.y>e.y&&e.x<(i.x-n.x)*(e.y-n.y)/(i.y-n.y)+n.x&&(s=!s);}return s}function bu(t,e){let r=!1;for(let n=0,i=t.length-1;n<t.length;i=n++){const s=t[n],a=t[i];s.y>e.y!=a.y>e.y&&e.x<(a.x-s.x)*(e.y-s.y)/(a.y-s.y)+s.x&&(r=!r);}return r}function wu(t,e,r,n,i){for(const s of t)if(e<=s.x&&r<=s.y&&n>=s.x&&i>=s.y)return !0;const s=[new x(e,r),new x(e,i),new x(n,i),new x(n,r)];if(t.length>2)for(const e of s)if(bu(t,e))return !0;for(let e=0;e<t.length-1;e++)if(_u(t[e],t[e+1],s))return !0;return !1}function _u(t,e,r){const n=r[0],i=r[2];if(t.x<n.x&&e.x<n.x||t.x>i.x&&e.x>i.x||t.y<n.y&&e.y<n.y||t.y>i.y&&e.y>i.y)return !1;const s=G(t,e,r[0]);return s!==G(t,e,r[1])||s!==G(t,e,r[2])||s!==G(t,e,r[3])}function Au(t,e,r){const n=e.paint.get(t).value;return "constant"===n.kind?n.value:r.programConfigurations.get(e.id).getMaxValue(t)}function Su(t){return Math.sqrt(t[0]*t[0]+t[1]*t[1])}function ku(t,e,r,n,i){if(!e[0]&&!e[1])return t;const s=x.convert(e)._mult(i);"viewport"===r&&s._rotate(-n);const a=[];for(let e=0;e<t.length;e++)a.push(t[e].sub(s));return a}function Iu(t,e,r,n){const i=x.convert(t)._mult(n);return "viewport"===e&&i._rotate(-r),i}Ji(cu,"CircleBucket",{omit:["layers"]});const Mu=new Ps({"circle-sort-key":new Es(te.layout_circle["circle-sort-key"])});var Tu={paint:new Ps({"circle-radius":new Es(te.paint_circle["circle-radius"]),"circle-color":new Es(te.paint_circle["circle-color"]),"circle-blur":new Es(te.paint_circle["circle-blur"]),"circle-opacity":new Es(te.paint_circle["circle-opacity"]),"circle-translate":new Bs(te.paint_circle["circle-translate"]),"circle-translate-anchor":new Bs(te.paint_circle["circle-translate-anchor"]),"circle-pitch-scale":new Bs(te.paint_circle["circle-pitch-scale"]),"circle-pitch-alignment":new Bs(te.paint_circle["circle-pitch-alignment"]),"circle-stroke-width":new Es(te.paint_circle["circle-stroke-width"]),"circle-stroke-color":new Es(te.paint_circle["circle-stroke-color"]),"circle-stroke-opacity":new Es(te.paint_circle["circle-stroke-opacity"])}),layout:Mu};function zu(t,e,r,n,i,s,a,o,l){if(s&&t.queryGeometry.isAboveHorizon)return !1;s&&(l*=t.pixelToTileUnitsFactor);const u=t.tileID.canonical,c=r.projection.upVectorScale(u,r.center.lat,r.worldSize).metersToTile;for(const h of e)for(const e of h){const h=e.add(o),p=i&&r.elevation?r.elevation.exaggeration()*i.getElevationAt(h.x,h.y,!0):0,d=r.projection.projectTilePoint(h.x,h.y,u);if(p>0){const t=r.projection.upVector(u,h.x,h.y);d.x+=t[0]*c*p,d.y+=t[1]*c*p,d.z+=t[2]*c*p;}const f=s?h:Bu(d.x,d.y,d.z,n),y=s?t.tilespaceRays.map((t=>Pu(t,p))):t.queryGeometry.screenGeometry,m=Go([],[d.x,d.y,d.z,1],n);if(!a&&s?l*=m[3]/r.cameraToCenterDistance:a&&!s&&(l*=r.cameraToCenterDistance/m[3]),s){const t=Xl((e.y/ao+u.y)/(1<<u.z));l/=r.projection.pixelsPerMeter(t,1)/Zl(1,t);}if(pu(y,f,l))return !0}return !1}function Bu(t,e,r,n){const i=Go([],[t,e,r,1],n);return new x(i[0]/i[3],i[1]/i[3])}const Eu=Io(0,0,0),Cu=Io(0,0,1);function Pu(t,e){const r=Ao();return Eu[2]=e,t.intersectsPlane(Eu,Cu,r),new x(r[0],r[1])}class Du extends cu{}function Vu(t,{width:e,height:r},n,i){if(i){if(i instanceof Uint8ClampedArray)i=new Uint8Array(i.buffer);else if(i.length!==e*r*n)throw new RangeError("mismatched image size")}else i=new Uint8Array(e*r*n);return t.width=e,t.height=r,t.data=i,t}function Lu(t,e,r){const{width:n,height:i}=e;n===t.width&&i===t.height||(Fu(t,e,{x:0,y:0},{x:0,y:0},{width:Math.min(t.width,n),height:Math.min(t.height,i)},r),t.width=n,t.height=i,t.data=e.data);}function Fu(t,e,r,n,i,s){if(0===i.width||0===i.height)return e;if(i.width>t.width||i.height>t.height||r.x>t.width-i.width||r.y>t.height-i.height)throw new RangeError("out of range source coordinates for image copy");if(i.width>e.width||i.height>e.height||n.x>e.width-i.width||n.y>e.height-i.height)throw new RangeError("out of range destination coordinates for image copy");const a=t.data,o=e.data;for(let l=0;l<i.height;l++){const u=((r.y+l)*t.width+r.x)*s,c=((n.y+l)*e.width+n.x)*s;for(let t=0;t<i.width*s;t++)o[c+t]=a[u+t];}return e}Ji(Du,"HeatmapBucket",{omit:["layers"]});class Ru{constructor(t,e){Vu(this,t,1,e);}resize(t){Lu(this,new Ru(t),1);}clone(){return new Ru({width:this.width,height:this.height},new Uint8Array(this.data))}static copy(t,e,r,n,i){Fu(t,e,r,n,i,1);}}class Uu{constructor(t,e){Vu(this,t,4,e);}resize(t){Lu(this,new Uu(t),4);}replace(t,e){e?this.data.set(t):this.data=t instanceof Uint8ClampedArray?new Uint8Array(t.buffer):t;}clone(){return new Uu({width:this.width,height:this.height},new Uint8Array(this.data))}static copy(t,e,r,n,i){Fu(t,e,r,n,i,4);}}Ji(Ru,"AlphaImage"),Ji(Uu,"RGBAImage");var $u={paint:new Ps({"heatmap-radius":new Es(te.paint_heatmap["heatmap-radius"]),"heatmap-weight":new Es(te.paint_heatmap["heatmap-weight"]),"heatmap-intensity":new Bs(te.paint_heatmap["heatmap-intensity"]),"heatmap-color":new Cs(te.paint_heatmap["heatmap-color"]),"heatmap-opacity":new Bs(te.paint_heatmap["heatmap-opacity"])})};function ju(t){const e={},r=t.resolution||256,n=t.clips?t.clips.length:1,i=t.image||new Uu({width:r,height:n}),s=(r,n,s)=>{e[t.evaluationKey]=s;const a=t.expression.evaluate(e);i.data[r+n+0]=Math.floor(255*a.r/a.a),i.data[r+n+1]=Math.floor(255*a.g/a.a),i.data[r+n+2]=Math.floor(255*a.b/a.a),i.data[r+n+3]=Math.floor(255*a.a);};if(t.clips)for(let e=0,i=0;e<n;++e,i+=4*r)for(let n=0,a=0;n<r;n++,a+=4){const o=n/(r-1),{start:l,end:u}=t.clips[e];s(i,a,l*(1-o)+u*o);}else for(let t=0,e=0;t<r;t++,e+=4)s(0,e,t/(r-1));return i}var Ou={paint:new Ps({"hillshade-illumination-direction":new Bs(te.paint_hillshade["hillshade-illumination-direction"]),"hillshade-illumination-anchor":new Bs(te.paint_hillshade["hillshade-illumination-anchor"]),"hillshade-exaggeration":new Bs(te.paint_hillshade["hillshade-exaggeration"]),"hillshade-shadow-color":new Bs(te.paint_hillshade["hillshade-shadow-color"]),"hillshade-highlight-color":new Bs(te.paint_hillshade["hillshade-highlight-color"]),"hillshade-accent-color":new Bs(te.paint_hillshade["hillshade-accent-color"])})};const qu=Rs([{name:"a_pos",components:2,type:"Int16"}],4),{members:Nu}=qu;var Gu={exports:{}};function Zu(t,e,r){r=r||2;var n,i,s,a,o,l,u,c=e&&e.length,h=c?e[0]*r:t.length,p=Ku(t,0,h,r,!0),d=[];if(!p||p.next===p.prev)return d;if(c&&(p=function(t,e,r,n){var i,s,a,o=[];for(i=0,s=e.length;i<s;i++)(a=Ku(t,e[i]*n,i<s-1?e[i+1]*n:t.length,n,!1))===a.next&&(a.steiner=!0),o.push(ic(a));for(o.sort(tc),i=0;i<o.length;i++)r=ec(o[i],r);return r}(t,e,p,r)),t.length>80*r){n=s=t[0],i=a=t[1];for(var f=r;f<h;f+=r)(o=t[f])<n&&(n=o),(l=t[f+1])<i&&(i=l),o>s&&(s=o),l>a&&(a=l);u=0!==(u=Math.max(s-n,a-i))?32767/u:0;}return Ju(p,d,r,n,i,u,0),d}function Ku(t,e,r,n,i){var s,a;if(i===gc(t,e,r,n)>0)for(s=e;s<r;s+=n)a=fc(s,t[s],t[s+1],a);else for(s=r-n;s>=e;s-=n)a=fc(s,t[s],t[s+1],a);return a&&lc(a,a.next)&&(yc(a),a=a.next),a}function Xu(t,e){if(!t)return t;e||(e=t);var r,n=t;do{if(r=!1,n.steiner||!lc(n,n.next)&&0!==oc(n.prev,n,n.next))n=n.next;else {if(yc(n),(n=e=n.prev)===n.next)break;r=!0;}}while(r||n!==e);return e}function Ju(t,e,r,n,i,s,a){if(t){!a&&s&&function(t,e,r,n){var i=t;do{0===i.z&&(i.z=nc(i.x,i.y,e,r,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;}while(i!==t);i.prevZ.nextZ=null,i.prevZ=null,function(t){var e,r,n,i,s,a,o,l,u=1;do{for(r=t,t=null,s=null,a=0;r;){for(a++,n=r,o=0,e=0;e<u&&(o++,n=n.nextZ);e++);for(l=u;o>0||l>0&&n;)0!==o&&(0===l||!n||r.z<=n.z)?(i=r,r=r.nextZ,o--):(i=n,n=n.nextZ,l--),s?s.nextZ=i:t=i,i.prevZ=s,s=i;r=n;}s.nextZ=null,u*=2;}while(a>1)}(i);}(t,n,i,s);for(var o,l,u=t;t.prev!==t.next;)if(o=t.prev,l=t.next,s?Yu(t,n,i,s):Hu(t))e.push(o.i/r|0),e.push(t.i/r|0),e.push(l.i/r|0),yc(t),t=l.next,u=l.next;else if((t=l)===u){a?1===a?Ju(t=Wu(Xu(t),e,r),e,r,n,i,s,2):2===a&&Qu(t,e,r,n,i,s):Ju(Xu(t),e,r,n,i,s,1);break}}}function Hu(t){var e=t.prev,r=t,n=t.next;if(oc(e,r,n)>=0)return !1;for(var i=e.x,s=r.x,a=n.x,o=e.y,l=r.y,u=n.y,c=i<s?i<a?i:a:s<a?s:a,h=o<l?o<u?o:u:l<u?l:u,p=i>s?i>a?i:a:s>a?s:a,d=o>l?o>u?o:u:l>u?l:u,f=n.next;f!==e;){if(f.x>=c&&f.x<=p&&f.y>=h&&f.y<=d&&sc(i,o,s,l,a,u,f.x,f.y)&&oc(f.prev,f,f.next)>=0)return !1;f=f.next;}return !0}function Yu(t,e,r,n){var i=t.prev,s=t,a=t.next;if(oc(i,s,a)>=0)return !1;for(var o=i.x,l=s.x,u=a.x,c=i.y,h=s.y,p=a.y,d=o<l?o<u?o:u:l<u?l:u,f=c<h?c<p?c:p:h<p?h:p,y=o>l?o>u?o:u:l>u?l:u,m=c>h?c>p?c:p:h>p?h:p,g=nc(d,f,e,r,n),x=nc(y,m,e,r,n),v=t.prevZ,b=t.nextZ;v&&v.z>=g&&b&&b.z<=x;){if(v.x>=d&&v.x<=y&&v.y>=f&&v.y<=m&&v!==i&&v!==a&&sc(o,c,l,h,u,p,v.x,v.y)&&oc(v.prev,v,v.next)>=0)return !1;if(v=v.prevZ,b.x>=d&&b.x<=y&&b.y>=f&&b.y<=m&&b!==i&&b!==a&&sc(o,c,l,h,u,p,b.x,b.y)&&oc(b.prev,b,b.next)>=0)return !1;b=b.nextZ;}for(;v&&v.z>=g;){if(v.x>=d&&v.x<=y&&v.y>=f&&v.y<=m&&v!==i&&v!==a&&sc(o,c,l,h,u,p,v.x,v.y)&&oc(v.prev,v,v.next)>=0)return !1;v=v.prevZ;}for(;b&&b.z<=x;){if(b.x>=d&&b.x<=y&&b.y>=f&&b.y<=m&&b!==i&&b!==a&&sc(o,c,l,h,u,p,b.x,b.y)&&oc(b.prev,b,b.next)>=0)return !1;b=b.nextZ;}return !0}function Wu(t,e,r){var n=t;do{var i=n.prev,s=n.next.next;!lc(i,s)&&uc(i,n,n.next,s)&&pc(i,s)&&pc(s,i)&&(e.push(i.i/r|0),e.push(n.i/r|0),e.push(s.i/r|0),yc(n),yc(n.next),n=t=s),n=n.next;}while(n!==t);return Xu(n)}function Qu(t,e,r,n,i,s){var a=t;do{for(var o=a.next.next;o!==a.prev;){if(a.i!==o.i&&ac(a,o)){var l=dc(a,o);return a=Xu(a,a.next),l=Xu(l,l.next),Ju(a,e,r,n,i,s,0),void Ju(l,e,r,n,i,s,0)}o=o.next;}a=a.next;}while(a!==t)}function tc(t,e){return t.x-e.x}function ec(t,e){var r=function(t,e){var r,n=e,i=t.x,s=t.y,a=-1/0;do{if(s<=n.y&&s>=n.next.y&&n.next.y!==n.y){var o=n.x+(s-n.y)*(n.next.x-n.x)/(n.next.y-n.y);if(o<=i&&o>a&&(a=o,r=n.x<n.next.x?n:n.next,o===i))return r}n=n.next;}while(n!==e);if(!r)return null;var l,u=r,c=r.x,h=r.y,p=1/0;n=r;do{i>=n.x&&n.x>=c&&i!==n.x&&sc(s<h?i:a,s,c,h,s<h?a:i,s,n.x,n.y)&&(l=Math.abs(s-n.y)/(i-n.x),pc(n,t)&&(l<p||l===p&&(n.x>r.x||n.x===r.x&&rc(r,n)))&&(r=n,p=l)),n=n.next;}while(n!==u);return r}(t,e);if(!r)return e;var n=dc(r,t);return Xu(n,n.next),Xu(r,r.next)}function rc(t,e){return oc(t.prev,t,e.prev)<0&&oc(e.next,t,t.next)<0}function nc(t,e,r,n,i){return (t=1431655765&((t=858993459&((t=252645135&((t=16711935&((t=(t-r)*i|0)|t<<8))|t<<4))|t<<2))|t<<1))|(e=1431655765&((e=858993459&((e=252645135&((e=16711935&((e=(e-n)*i|0)|e<<8))|e<<4))|e<<2))|e<<1))<<1}function ic(t){var e=t,r=t;do{(e.x<r.x||e.x===r.x&&e.y<r.y)&&(r=e),e=e.next;}while(e!==t);return r}function sc(t,e,r,n,i,s,a,o){return (i-a)*(e-o)>=(t-a)*(s-o)&&(t-a)*(n-o)>=(r-a)*(e-o)&&(r-a)*(s-o)>=(i-a)*(n-o)}function ac(t,e){return t.next.i!==e.i&&t.prev.i!==e.i&&!function(t,e){var r=t;do{if(r.i!==t.i&&r.next.i!==t.i&&r.i!==e.i&&r.next.i!==e.i&&uc(r,r.next,t,e))return !0;r=r.next;}while(r!==t);return !1}(t,e)&&(pc(t,e)&&pc(e,t)&&function(t,e){var r=t,n=!1,i=(t.x+e.x)/2,s=(t.y+e.y)/2;do{r.y>s!=r.next.y>s&&r.next.y!==r.y&&i<(r.next.x-r.x)*(s-r.y)/(r.next.y-r.y)+r.x&&(n=!n),r=r.next;}while(r!==t);return n}(t,e)&&(oc(t.prev,t,e.prev)||oc(t,e.prev,e))||lc(t,e)&&oc(t.prev,t,t.next)>0&&oc(e.prev,e,e.next)>0)}function oc(t,e,r){return (e.y-t.y)*(r.x-e.x)-(e.x-t.x)*(r.y-e.y)}function lc(t,e){return t.x===e.x&&t.y===e.y}function uc(t,e,r,n){var i=hc(oc(t,e,r)),s=hc(oc(t,e,n)),a=hc(oc(r,n,t)),o=hc(oc(r,n,e));return i!==s&&a!==o||!(0!==i||!cc(t,r,e))||!(0!==s||!cc(t,n,e))||!(0!==a||!cc(r,t,n))||!(0!==o||!cc(r,e,n))}function cc(t,e,r){return e.x<=Math.max(t.x,r.x)&&e.x>=Math.min(t.x,r.x)&&e.y<=Math.max(t.y,r.y)&&e.y>=Math.min(t.y,r.y)}function hc(t){return t>0?1:t<0?-1:0}function pc(t,e){return oc(t.prev,t,t.next)<0?oc(t,e,t.next)>=0&&oc(t,t.prev,e)>=0:oc(t,e,t.prev)<0||oc(t,t.next,e)<0}function dc(t,e){var r=new mc(t.i,t.x,t.y),n=new mc(e.i,e.x,e.y),i=t.next,s=e.prev;return t.next=e,e.prev=t,r.next=i,i.prev=r,n.next=r,r.prev=n,s.next=n,n.prev=s,n}function fc(t,e,r,n){var i=new mc(t,e,r);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function yc(t){t.next.prev=t.prev,t.prev.next=t.next,t.prevZ&&(t.prevZ.nextZ=t.nextZ),t.nextZ&&(t.nextZ.prevZ=t.prevZ);}function mc(t,e,r){this.i=t,this.x=e,this.y=r,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1;}function gc(t,e,r,n){for(var i=0,s=e,a=r-n;s<r;s+=n)i+=(t[a]-t[s])*(t[s+1]+t[a+1]),a=s;return i}Gu.exports=Zu,Gu.exports.default=Zu,Zu.deviation=function(t,e,r,n){var i=e&&e.length,s=Math.abs(gc(t,0,i?e[0]*r:t.length,r));if(i)for(var a=0,o=e.length;a<o;a++)s-=Math.abs(gc(t,e[a]*r,a<o-1?e[a+1]*r:t.length,r));var l=0;for(a=0;a<n.length;a+=3){var u=n[a]*r,c=n[a+1]*r,h=n[a+2]*r;l+=Math.abs((t[u]-t[h])*(t[c+1]-t[u+1])-(t[u]-t[c])*(t[h+1]-t[u+1]));}return 0===s&&0===l?0:Math.abs((l-s)/s)},Zu.flatten=function(t){for(var e=t[0][0].length,r={vertices:[],holes:[],dimensions:e},n=0,i=0;i<t.length;i++){for(var s=0;s<t[i].length;s++)for(var a=0;a<e;a++)r.vertices.push(t[i][s][a]);i>0&&r.holes.push(n+=t[i-1].length);}return r};var xc=p(Gu.exports);function vc(t,e,r,n,i){bc(t,e,r||0,n||t.length-1,i||_c);}function bc(t,e,r,n,i){for(;n>r;){if(n-r>600){var s=n-r+1,a=e-r+1,o=Math.log(s),l=.5*Math.exp(2*o/3),u=.5*Math.sqrt(o*l*(s-l)/s)*(a-s/2<0?-1:1);bc(t,e,Math.max(r,Math.floor(e-a*l/s+u)),Math.min(n,Math.floor(e+(s-a)*l/s+u)),i);}var c=t[e],h=r,p=n;for(wc(t,r,e),i(t[n],c)>0&&wc(t,r,n);h<p;){for(wc(t,h,p),h++,p--;i(t[h],c)<0;)h++;for(;i(t[p],c)>0;)p--;}0===i(t[r],c)?wc(t,r,p):wc(t,++p,n),p<=e&&(r=p+1),e<=p&&(n=p-1);}}function wc(t,e,r){var n=t[e];t[e]=t[r],t[r]=n;}function _c(t,e){return t<e?-1:t>e?1:0}function Ac(t,e){const r=t.length;if(r<=1)return [t];const n=[];let i,s;for(let e=0;e<r;e++){const r=Z(t[e]);0!==r&&(t[e].area=Math.abs(r),void 0===s&&(s=r<0),s===r<0?(i&&n.push(i),i=[t[e]]):i.push(t[e]));}if(i&&n.push(i),e>1)for(let t=0;t<n.length;t++)n[t].length<=e||(vc(n[t],e,1,n[t].length-1,Sc),n[t]=n[t].slice(0,e));return n}function Sc(t,e){return e.area-t.area}function kc(t,e,r){const n=r.patternDependencies;let i=!1;for(const r of e){const e=r.paint.get(`${t}-pattern`);e.isConstant()||(i=!0);const s=e.constantOr(null);s&&(i=!0,n[s]=!0);}return i}function Ic(t,e,r,n,i){const s=i.patternDependencies;for(const a of e){const e=a.paint.get(`${t}-pattern`).value;if("constant"!==e.kind){let t=e.evaluate({zoom:n},r,{},i.availableImages);t=t&&t.name?t.name:t,s[t]=!0,r.patterns[a.id]=t;}}return r}class Mc{constructor(t){this.zoom=t.zoom,this.overscaling=t.overscaling,this.layers=t.layers,this.layerIds=this.layers.map((t=>t.id)),this.index=t.index,this.hasPattern=!1,this.patternFeatures=[],this.layoutVertexArray=new $s,this.indexArray=new ra,this.indexArray2=new la,this.programConfigurations=new Ja(t.layers,t.zoom),this.segments=new so,this.segments2=new so,this.stateDependentLayerIds=this.layers.filter((t=>t.isStateDependent())).map((t=>t.id)),this.projection=t.projection;}populate(t,e,r,n){this.hasPattern=kc("fill",this.layers,e);const i=this.layers[0].layout.get("fill-sort-key"),s=[];for(const{feature:a,id:o,index:l,sourceLayerIndex:u}of t){const t=this.layers[0]._featureFilter.needGeometry,c=ou(a,t);if(!this.layers[0]._featureFilter.filter(new ws(this.zoom),c,r))continue;const h=i?i.evaluate(c,{},r,e.availableImages):void 0,p={id:o,properties:a.properties,type:a.type,sourceLayerIndex:u,index:l,geometry:t?c.geometry:au(a,r,n),patterns:{},sortKey:h};s.push(p);}i&&s.sort(((t,e)=>t.sortKey-e.sortKey));for(const n of s){const{geometry:i,index:s,sourceLayerIndex:a}=n;if(this.hasPattern){const t=Ic("fill",this.layers,n,this.zoom,e);this.patternFeatures.push(t);}else this.addFeature(n,i,s,r,{},e.availableImages);e.featureIndex.insert(t[s].feature,i,s,a,this.index);}}update(t,e,r,n){this.stateDependentLayers.length&&this.programConfigurations.updatePaintArrays(t,e,this.stateDependentLayers,r,n);}addFeatures(t,e,r,n,i){for(const t of this.patternFeatures)this.addFeature(t,t.geometry,t.index,e,r,n);}isEmpty(){return 0===this.layoutVertexArray.length}uploadPending(){return !this.uploaded||this.programConfigurations.needsUpload}upload(t){this.uploaded||(this.layoutVertexBuffer=t.createVertexBuffer(this.layoutVertexArray,Nu),this.indexBuffer=t.createIndexBuffer(this.indexArray),this.indexBuffer2=t.createIndexBuffer(this.indexArray2)),this.programConfigurations.upload(t),this.uploaded=!0;}destroy(){this.layoutVertexBuffer&&(this.layoutVertexBuffer.destroy(),this.indexBuffer.destroy(),this.indexBuffer2.destroy(),this.programConfigurations.destroy(),this.segments.destroy(),this.segments2.destroy());}addFeature(t,e,r,n,i,s=[]){for(const t of Ac(e,500)){let e=0;for(const r of t)e+=r.length;const r=this.segments.prepareSegment(e,this.layoutVertexArray,this.indexArray),n=r.vertexLength,i=[],s=[];for(const e of t){if(0===e.length)continue;e!==t[0]&&s.push(i.length/2);const r=this.segments2.prepareSegment(e.length,this.layoutVertexArray,this.indexArray2),n=r.vertexLength;this.layoutVertexArray.emplaceBack(e[0].x,e[0].y),this.indexArray2.emplaceBack(n+e.length-1,n),i.push(e[0].x),i.push(e[0].y);for(let t=1;t<e.length;t++)this.layoutVertexArray.emplaceBack(e[t].x,e[t].y),this.indexArray2.emplaceBack(n+t-1,n+t),i.push(e[t].x),i.push(e[t].y);r.vertexLength+=e.length,r.primitiveLength+=e.length;}const a=xc(i,s);for(let t=0;t<a.length;t+=3)this.indexArray.emplaceBack(n+a[t],n+a[t+1],n+a[t+2]);r.vertexLength+=e,r.primitiveLength+=a.length/3;}this.programConfigurations.populatePaintArrays(this.layoutVertexArray.length,t,r,i,s,n);}}Ji(Mc,"FillBucket",{omit:["layers","patternFeatures"]});const Tc=new Ps({"fill-sort-key":new Es(te.layout_fill["fill-sort-key"])});var zc={paint:new Ps({"fill-antialias":new Bs(te.paint_fill["fill-antialias"]),"fill-opacity":new Es(te.paint_fill["fill-opacity"]),"fill-color":new Es(te.paint_fill["fill-color"]),"fill-outline-color":new Es(te.paint_fill["fill-outline-color"]),"fill-translate":new Bs(te.paint_fill["fill-translate"]),"fill-translate-anchor":new Bs(te.paint_fill["fill-translate-anchor"]),"fill-pattern":new Es(te.paint_fill["fill-pattern"])}),layout:Tc};const Bc=Rs([{name:"a_pos_normal_ed",components:4,type:"Int16"}]),Ec=Rs([{name:"a_centroid_pos",components:2,type:"Uint16"}]),Cc=Rs([{name:"a_pos_3",components:3,type:"Int16"},{name:"a_pos_normal_3",components:3,type:"Int16"}]),{members:Pc}=Bc;var Dc={},Vc=m,Lc=Fc;function Fc(t,e,r,n,i){this.properties={},this.extent=r,this.type=0,this._pbf=t,this._geometry=-1,this._keys=n,this._values=i,t.readFields(Rc,this,e);}function Rc(t,e,r){1==t?e.id=r.readVarint():2==t?function(t,e){for(var r=t.readVarint()+t.pos;t.pos<r;){var n=e._keys[t.readVarint()],i=e._values[t.readVarint()];e.properties[n]=i;}}(r,e):3==t?e.type=r.readVarint():4==t&&(e._geometry=r.pos);}function Uc(t){for(var e,r,n=0,i=0,s=t.length,a=s-1;i<s;a=i++)n+=((r=t[a]).x-(e=t[i]).x)*(e.y+r.y);return n}Fc.types=["Unknown","Point","LineString","Polygon"],Fc.prototype.loadGeometry=function(){var t=this._pbf;t.pos=this._geometry;for(var e,r=t.readVarint()+t.pos,n=1,i=0,s=0,a=0,o=[];t.pos<r;){if(i<=0){var l=t.readVarint();n=7&l,i=l>>3;}if(i--,1===n||2===n)s+=t.readSVarint(),a+=t.readSVarint(),1===n&&(e&&o.push(e),e=[]),e.push(new Vc(s,a));else {if(7!==n)throw new Error("unknown command "+n);e&&e.push(e[0].clone());}}return e&&o.push(e),o},Fc.prototype.bbox=function(){var t=this._pbf;t.pos=this._geometry;for(var e=t.readVarint()+t.pos,r=1,n=0,i=0,s=0,a=1/0,o=-1/0,l=1/0,u=-1/0;t.pos<e;){if(n<=0){var c=t.readVarint();r=7&c,n=c>>3;}if(n--,1===r||2===r)(i+=t.readSVarint())<a&&(a=i),i>o&&(o=i),(s+=t.readSVarint())<l&&(l=s),s>u&&(u=s);else if(7!==r)throw new Error("unknown command "+r)}return [a,l,o,u]},Fc.prototype.toGeoJSON=function(t,e,r){var n,i,s=this.extent*Math.pow(2,r),a=this.extent*t,o=this.extent*e,l=this.loadGeometry(),u=Fc.types[this.type];function c(t){for(var e=0;e<t.length;e++){var r=t[e];t[e]=[360*(r.x+a)/s-180,360/Math.PI*Math.atan(Math.exp((180-360*(r.y+o)/s)*Math.PI/180))-90];}}switch(this.type){case 1:var h=[];for(n=0;n<l.length;n++)h[n]=l[n][0];c(l=h);break;case 2:for(n=0;n<l.length;n++)c(l[n]);break;case 3:for(l=function(t){var e=t.length;if(e<=1)return [t];for(var r,n,i=[],s=0;s<e;s++){var a=Uc(t[s]);0!==a&&(void 0===n&&(n=a<0),n===a<0?(r&&i.push(r),r=[t[s]]):r.push(t[s]));}return r&&i.push(r),i}(l),n=0;n<l.length;n++)for(i=0;i<l[n].length;i++)c(l[n][i]);}1===l.length?l=l[0]:u="Multi"+u;var p={type:"Feature",geometry:{type:u,coordinates:l},properties:this.properties};return "id"in this&&(p.id=this.id),p};var $c=Lc,jc=Oc;function Oc(t,e){this.version=1,this.name=null,this.extent=4096,this.length=0,this._pbf=t,this._keys=[],this._values=[],this._features=[],t.readFields(qc,this,e),this.length=this._features.length;}function qc(t,e,r){15===t?e.version=r.readVarint():1===t?e.name=r.readString():5===t?e.extent=r.readVarint():2===t?e._features.push(r.pos):3===t?e._keys.push(r.readString()):4===t&&e._values.push(function(t){for(var e=null,r=t.readVarint()+t.pos;t.pos<r;){var n=t.readVarint()>>3;e=1===n?t.readString():2===n?t.readFloat():3===n?t.readDouble():4===n?t.readVarint64():5===n?t.readVarint():6===n?t.readSVarint():7===n?t.readBoolean():null;}return e}(r));}Oc.prototype.feature=function(t){if(t<0||t>=this._features.length)throw new Error("feature index out of bounds");this._pbf.pos=this._features[t];var e=this._pbf.readVarint()+this._pbf.pos;return new $c(this._pbf,e,this.extent,this._keys,this._values)};var Nc=jc;function Gc(t,e,r){if(3===t){var n=new Nc(r,r.readVarint()+r.pos);n.length&&(e[n.name]=n);}}var Zc=Dc.VectorTile=function(t,e){this.layers=t.readFields(Gc,{},e);},Kc=Dc.VectorTileFeature=Lc;function Xc(t,e,r,n){const i=[],s=0===n?(t,e,r,n,i,s)=>{t.push(new x(s,r+(s-e)/(n-e)*(i-r)));}:(t,e,r,n,i,s)=>{t.push(new x(e+(s-r)/(i-r)*(n-e),s));};for(const a of t){const t=[];for(const i of a){if(i.length<=2)continue;const a=[];for(let t=0;t<i.length-1;t++){const o=i[t].x,l=i[t].y,u=i[t+1].x,c=i[t+1].y,h=0===n?o:l,p=0===n?u:c;h<e?p>e&&s(a,o,l,u,c,e):h>r?p<r&&s(a,o,l,u,c,r):a.push(i[t]),p<e&&h>=e&&s(a,o,l,u,c,e),p>r&&h<=r&&s(a,o,l,u,c,r);}let o=i[i.length-1];const l=0===n?o.x:o.y;l>=e&&l<=r&&a.push(o),a.length&&(o=a[a.length-1],a[0].x===o.x&&a[0].y===o.y||a.push(a[0]),t.push(a));}t.length&&i.push(t);}return i}Dc.VectorTileLayer=jc;const Jc=Kc.types,Hc=Math.pow(2,13);function Yc(t,e,r,n,i,s,a,o){t.emplaceBack((e<<1)+a,(r<<1)+s,(Math.floor(n*Hc)<<1)+i,Math.round(o));}function Wc(t,e,r){const n=16384;t.emplaceBack(e.x,e.y,e.z,r[0]*n,r[1]*n,r[2]*n);}class Qc{constructor(){this.acc=new x(0,0),this.polyCount=[];}startRing(t){this.currentPolyCount={edges:0,top:0},this.polyCount.push(this.currentPolyCount),this.min||(this.min=new x(t.x,t.y),this.max=new x(t.x,t.y));}append(t,e){this.currentPolyCount.edges++,this.acc._add(t);const r=this.min,n=this.max;t.x<r.x?r.x=t.x:t.x>n.x&&(n.x=t.x),t.y<r.y?r.y=t.y:t.y>n.y&&(n.y=t.y),((0===t.x||t.x===ao)&&t.x===e.x)!=((0===t.y||t.y===ao)&&t.y===e.y)&&this.processBorderOverlap(t,e),e.x<0!=t.x<0&&this.addBorderIntersection(0,Er(e.y,t.y,(0-e.x)/(t.x-e.x))),e.x>ao!=t.x>ao&&this.addBorderIntersection(1,Er(e.y,t.y,(ao-e.x)/(t.x-e.x))),e.y<0!=t.y<0&&this.addBorderIntersection(2,Er(e.x,t.x,(0-e.y)/(t.y-e.y))),e.y>ao!=t.y>ao&&this.addBorderIntersection(3,Er(e.x,t.x,(ao-e.y)/(t.y-e.y)));}addBorderIntersection(t,e){this.borders||(this.borders=[[Number.MAX_VALUE,-Number.MAX_VALUE],[Number.MAX_VALUE,-Number.MAX_VALUE],[Number.MAX_VALUE,-Number.MAX_VALUE],[Number.MAX_VALUE,-Number.MAX_VALUE]]);const r=this.borders[t];e<r[0]&&(r[0]=e),e>r[1]&&(r[1]=e);}processBorderOverlap(t,e){if(t.x===e.x){if(t.y===e.y)return;const r=0===t.x?0:1;this.addBorderIntersection(r,e.y),this.addBorderIntersection(r,t.y);}else {const r=0===t.y?2:3;this.addBorderIntersection(r,e.x),this.addBorderIntersection(r,t.x);}}centroid(){const t=this.polyCount.reduce(((t,e)=>t+e.edges),0);return 0!==t?this.acc.div(t)._round():new x(0,0)}span(){return new x(this.max.x-this.min.x,this.max.y-this.min.y)}intersectsCount(){return this.borders.reduce(((t,e)=>t+ +(e[0]!==Number.MAX_VALUE)),0)}}class th{constructor(t){this.zoom=t.zoom,this.canonical=t.canonical,this.overscaling=t.overscaling,this.layers=t.layers,this.layerIds=this.layers.map((t=>t.id)),this.index=t.index,this.hasPattern=!1,this.edgeRadius=0,this.projection=t.projection,this.layoutVertexArray=new Os,this.centroidVertexArray=new wa,this.indexArray=new ra,this.programConfigurations=new Ja(t.layers,t.zoom),this.segments=new so,this.stateDependentLayerIds=this.layers.filter((t=>t.isStateDependent())).map((t=>t.id)),this.enableTerrain=t.enableTerrain;}populate(t,e,r,n){this.features=[],this.hasPattern=kc("fill-extrusion",this.layers,e),this.featuresOnBorder=[],this.borders=[[],[],[],[]],this.borderDoneWithNeighborZ=[-1,-1,-1,-1],this.tileToMeter=function(t){const e=Math.exp(Math.PI*(1-t.y/(1<<t.z)*2));return 80150034*e/(e*e+1)/ao/(1<<t.z)}(r),this.edgeRadius=this.layers[0].layout.get("fill-extrusion-edge-radius")/this.tileToMeter;for(const{feature:i,id:s,index:a,sourceLayerIndex:o}of t){const t=this.layers[0]._featureFilter.needGeometry,l=ou(i,t);if(!this.layers[0]._featureFilter.filter(new ws(this.zoom),l,r))continue;const u={id:s,sourceLayerIndex:o,index:a,geometry:t?l.geometry:au(i,r,n),properties:i.properties,type:i.type,patterns:{}},c=this.layoutVertexArray.length;this.hasPattern?this.features.push(Ic("fill-extrusion",this.layers,u,this.zoom,e)):this.addFeature(u,u.geometry,a,r,{},e.availableImages,n),e.featureIndex.insert(i,u.geometry,a,o,this.index,c);}this.sortBorders();}addFeatures(t,e,r,n,i){for(const t of this.features){const{geometry:s}=t;this.addFeature(t,s,t.index,e,r,n,i);}this.sortBorders();}update(t,e,r,n){this.stateDependentLayers.length&&this.programConfigurations.updatePaintArrays(t,e,this.stateDependentLayers,r,n);}isEmpty(){return 0===this.layoutVertexArray.length}uploadPending(){return !this.uploaded||this.programConfigurations.needsUpload}upload(t){this.uploaded||(this.layoutVertexBuffer=t.createVertexBuffer(this.layoutVertexArray,Pc),this.indexBuffer=t.createIndexBuffer(this.indexArray),this.layoutVertexExtArray&&(this.layoutVertexExtBuffer=t.createVertexBuffer(this.layoutVertexExtArray,Cc.members,!0))),this.programConfigurations.upload(t),this.uploaded=!0;}uploadCentroid(t){0!==this.centroidVertexArray.length&&(this.centroidVertexBuffer?this.needsCentroidUpdate&&this.centroidVertexBuffer.updateData(this.centroidVertexArray):this.centroidVertexBuffer=t.createVertexBuffer(this.centroidVertexArray,Ec.members,!0),this.needsCentroidUpdate=!1);}destroy(){this.layoutVertexBuffer&&(this.layoutVertexBuffer.destroy(),this.centroidVertexBuffer&&this.centroidVertexBuffer.destroy(),this.layoutVertexExtBuffer&&this.layoutVertexExtBuffer.destroy(),this.indexBuffer.destroy(),this.programConfigurations.destroy(),this.segments.destroy());}addFeature(t,e,r,n,i,s,a){const o=[new x(0,0),new x(ao,ao)],l=a.projection,u="globe"===l.name,c=this.enableTerrain&&!u?new Qc:null,h="Polygon"===Jc[t.type];u&&!this.layoutVertexExtArray&&(this.layoutVertexExtArray=new Ks);const p=Ac(e,500);for(let t=p.length-1;t>=0;t--){const e=p[t];(0===e.length||(d=e[0]).every((t=>t.x<=0))||d.every((t=>t.x>=ao))||d.every((t=>t.y<=0))||d.every((t=>t.y>=ao)))&&p.splice(t,1);}var d;let f;if(u)f=lh(p,o,n);else {f=[];for(const t of p)f.push({polygon:t,bounds:o});}const y=h?this.edgeRadius:0;for(const{polygon:t,bounds:e}of f){let r=0,i=0;for(const e of t)h&&!e[0].equals(e[e.length-1])&&e.push(e[0]),i+=h?e.length-1:e.length;const s=this.segments.prepareSegment((h?5:4)*i,this.layoutVertexArray,this.indexArray);if(h){const e=[],i=[];r=s.vertexLength;for(const r of t){let a,o;r.length&&r!==t[0]&&i.push(e.length/2),a=r[1].sub(r[0])._perp()._unit();for(let t=1;t<r.length;t++){const i=r[t],c=r[t===r.length-1?1:t+1];let{x:h,y:p}=i;if(y){o=c.sub(i)._perp()._unit();const t=a.add(o)._unit(),e=y*Math.min(4,1/(a.x*t.x+a.y*t.y));h+=e*t.x,p+=e*t.y,a=o;}Yc(this.layoutVertexArray,h,p,0,0,1,1,0),s.vertexLength++,e.push(i.x,i.y),u&&Wc(this.layoutVertexExtArray,l.projectTilePoint(h,p,n),l.upVector(n,h,p));}}const a=xc(e,i);for(let t=0;t<a.length;t+=3)this.indexArray.emplaceBack(r+a[t],r+a[t+2],r+a[t+1]),s.primitiveLength++;}for(const i of t){c&&i.length&&c.startRing(i[0]);let t,a,o,p=i.length>4&&sh(i[i.length-2],i[0],i[1]),d=y?rh(i[i.length-2],i[0],i[1],y):0;a=i[1].sub(i[0])._perp()._unit();let f=!0;for(let m=1,g=0;m<i.length;m++){let x=i[m-1],v=i[m];const b=i[m===i.length-1?1:m+1];if(c&&h&&c.currentPolyCount.top++,ih(v,x,e)){y&&(a=b.sub(v)._perp()._unit(),f=!f);continue}c&&c.append(v,x);const w=v.sub(x)._perp(),_=w.x/(Math.abs(w.x)+Math.abs(w.y)),A=w.y>0?1:0,S=x.dist(v);if(g+S>32768&&(g=0),y){o=b.sub(v)._perp()._unit();let t=nh(x,v,b,eh(a,o),y);isNaN(t)&&(t=0);const e=v.sub(x)._unit();x=x.add(e.mult(d))._round(),v=v.add(e.mult(-t))._round(),d=t,a=o;}const k=s.vertexLength,I=i.length>4&&sh(x,v,b);let M=ah(g,p,f);if(Yc(this.layoutVertexArray,x.x,x.y,_,A,0,0,M),Yc(this.layoutVertexArray,x.x,x.y,_,A,0,1,M),g+=S,M=ah(g,I,!f),p=I,Yc(this.layoutVertexArray,v.x,v.y,_,A,0,0,M),Yc(this.layoutVertexArray,v.x,v.y,_,A,0,1,M),s.vertexLength+=4,this.indexArray.emplaceBack(k+0,k+1,k+2),this.indexArray.emplaceBack(k+1,k+3,k+2),s.primitiveLength+=2,y){const n=r+(1===m?i.length-2:m-2),a=1===m?r:n+1;if(this.indexArray.emplaceBack(k+1,n,k+3),this.indexArray.emplaceBack(n,a,k+3),s.primitiveLength+=2,void 0===t&&(t=k),!ih(b,i[m],e)){const e=m===i.length-1?t:s.vertexLength;this.indexArray.emplaceBack(k+2,k+3,e),this.indexArray.emplaceBack(k+3,e+1,e),this.indexArray.emplaceBack(k+3,a,e+1),s.primitiveLength+=3;}f=!f;}if(u){const t=this.layoutVertexExtArray,e=l.projectTilePoint(x.x,x.y,n),r=l.projectTilePoint(v.x,v.y,n),i=l.upVector(n,x.x,x.y),s=l.upVector(n,v.x,v.y);Wc(t,e,i),Wc(t,e,i),Wc(t,r,s),Wc(t,r,s);}}h&&(r+=i.length-1);}}if(c&&c.polyCount.length>0){if(c.borders){c.vertexArrayOffset=this.centroidVertexArray.length;const t=c.borders,e=this.featuresOnBorder.push(c)-1;for(let r=0;r<4;r++)t[r][0]!==Number.MAX_VALUE&&this.borders[r].push(e);}this.encodeCentroid(c.borders?void 0:c.centroid(),c);}this.programConfigurations.populatePaintArrays(this.layoutVertexArray.length,t,r,i,s,n);}sortBorders(){for(let t=0;t<4;t++)this.borders[t].sort(((e,r)=>this.featuresOnBorder[e].borders[t][0]-this.featuresOnBorder[r].borders[t][0]));}encodeCentroid(t,e,r=!0){let n,i;if(t)if(0!==t.y){const r=e.span()._mult(this.tileToMeter);n=(Math.max(t.x,1)<<3)+Math.min(7,Math.round(r.x/10)),i=(Math.max(t.y,1)<<3)+Math.min(7,Math.round(r.y/10));}else n=Math.ceil(7*(t.x+450)),i=0;else n=0,i=+r;let s=r?this.centroidVertexArray.length:e.vertexArrayOffset;for(const t of e.polyCount){r&&this.centroidVertexArray.resize(this.centroidVertexArray.length+4*t.edges+t.top);for(let e=0;e<t.top;e++)this.centroidVertexArray.emplace(s++,n,i);for(let e=0;e<2*t.edges;e++)this.centroidVertexArray.emplace(s++,0,i),this.centroidVertexArray.emplace(s++,n,i);}}}function eh(t,e){const r=t.add(e)._unit();return t.x*r.x+t.y*r.y}function rh(t,e,r,n){const i=e.sub(t)._perp()._unit(),s=r.sub(e)._perp()._unit();return nh(t,e,r,eh(i,s),n)}function nh(t,e,r,n,i){const s=Math.sqrt(1-n*n);return Math.min(t.dist(e)/3,e.dist(r)/3,i*s/n)}function ih(t,e,r){return t.x<r[0].x&&e.x<r[0].x||t.x>r[1].x&&e.x>r[1].x||t.y<r[0].y&&e.y<r[0].y||t.y>r[1].y&&e.y>r[1].y}function sh(t,e,r){if(t.x<0||t.x>=ao||e.x<0||e.x>=ao||r.x<0||r.x>=ao)return !1;const n=r.sub(e),i=n.perp(),s=t.sub(e);return (n.x*s.x+n.y*s.y)/Math.sqrt((n.x*n.x+n.y*n.y)*(s.x*s.x+s.y*s.y))>-.866&&i.x*s.x+i.y*s.y<0}function ah(t,e,r){const n=e?2|t:-3&t;return r?1|n:-2&n}function oh(){const t=Math.PI/32,e=Math.tan(t),r=Ul;return r*Math.sqrt(1+2*e*e)-r}function lh(t,e,r){const n=1<<r.z,i=Kl(r.x/n),s=Kl((r.x+1)/n),a=Xl(r.y/n),o=Xl((r.y+1)/n);return function(t,e,r,n,i=0,s){const a=[];if(!t.length||!r||!n)return a;const o=(t,e)=>{for(const r of t)a.push({polygon:r,bounds:e});},l=Math.ceil(Math.log2(r)),u=Math.ceil(Math.log2(n)),c=l-u,h=[];for(let t=0;t<Math.abs(c);t++)h.push(c>0?0:1);for(let t=0;t<Math.min(l,u);t++)h.push(0),h.push(1);let p=t;if(p=Xc(p,e[0].y-i,e[1].y+i,1),p=Xc(p,e[0].x-i,e[1].x+i,0),!p.length)return a;const d=[];for(h.length?d.push({polygons:p,bounds:e,depth:0}):o(p,e);d.length;){const t=d.pop(),e=t.depth,r=h[e],n=t.bounds[0],a=t.bounds[1],l=0===r?n.x:n.y,u=0===r?a.x:a.y,c=s?s(r,l,u):.5*(l+u),p=Xc(t.polygons,l-i,c+i,r),f=Xc(t.polygons,c-i,u+i,r);if(p.length){const t=[n,new x(0===r?c:a.x,1===r?c:a.y)];h.length>e+1?d.push({polygons:p,bounds:t,depth:e+1}):o(p,t);}if(f.length){const t=[new x(0===r?c:n.x,1===r?c:n.y),a];h.length>e+1?d.push({polygons:f,bounds:t,depth:e+1}):o(f,t);}}return a}(t,e,Math.ceil((s-i)/11.25),Math.ceil((a-o)/11.25),1,((t,e,i)=>{if(0===t)return .5*(e+i);{const t=Xl((r.y+e/ao)/n);return (Gl(.5*(Xl((r.y+i/ao)/n)+t))*n-r.y)*ao}}))}Ji(th,"FillExtrusionBucket",{omit:["layers","features"]}),Ji(Qc,"PartMetadata");const uh=new Ps({"fill-extrusion-edge-radius":new Bs(te["layout_fill-extrusion"]["fill-extrusion-edge-radius"])});var ch={paint:new Ps({"fill-extrusion-opacity":new Bs(te["paint_fill-extrusion"]["fill-extrusion-opacity"]),"fill-extrusion-color":new Es(te["paint_fill-extrusion"]["fill-extrusion-color"]),"fill-extrusion-translate":new Bs(te["paint_fill-extrusion"]["fill-extrusion-translate"]),"fill-extrusion-translate-anchor":new Bs(te["paint_fill-extrusion"]["fill-extrusion-translate-anchor"]),"fill-extrusion-pattern":new Es(te["paint_fill-extrusion"]["fill-extrusion-pattern"]),"fill-extrusion-height":new Es(te["paint_fill-extrusion"]["fill-extrusion-height"]),"fill-extrusion-base":new Es(te["paint_fill-extrusion"]["fill-extrusion-base"]),"fill-extrusion-vertical-gradient":new Bs(te["paint_fill-extrusion"]["fill-extrusion-vertical-gradient"]),"fill-extrusion-ambient-occlusion-intensity":new Bs(te["paint_fill-extrusion"]["fill-extrusion-ambient-occlusion-intensity"]),"fill-extrusion-ambient-occlusion-radius":new Bs(te["paint_fill-extrusion"]["fill-extrusion-ambient-occlusion-radius"]),"fill-extrusion-rounded-roof":new Bs(te["paint_fill-extrusion"]["fill-extrusion-rounded-roof"])}),layout:uh};function hh(t,e,r){var n=2*Math.PI*6378137/256/Math.pow(2,r);return [t*n-2*Math.PI*6378137/2,e*n-2*Math.PI*6378137/2]}class ph{constructor(t,e,r){this.z=t,this.x=e,this.y=r,this.key=yh(0,t,t,e,r);}equals(t){return this.z===t.z&&this.x===t.x&&this.y===t.y}url(t,e){const r=function(t,e,r){var n=hh(256*t,256*(e=Math.pow(2,r)-e-1),r),i=hh(256*(t+1),256*(e+1),r);return n[0]+","+n[1]+","+i[0]+","+i[1]}(this.x,this.y,this.z),n=function(t,e,r){let n,i="";for(let s=t;s>0;s--)n=1<<s-1,i+=(e&n?1:0)+(r&n?2:0);return i}(this.z,this.x,this.y);return t[(this.x+this.y)%t.length].replace("{prefix}",(this.x%16).toString(16)+(this.y%16).toString(16)).replace(/{z}/g,String(this.z)).replace(/{x}/g,String(this.x)).replace(/{y}/g,String("tms"===e?Math.pow(2,this.z)-this.y-1:this.y)).replace("{quadkey}",n).replace("{bbox-epsg-3857}",r)}toString(){return `${this.z}/${this.x}/${this.y}`}}class dh{constructor(t,e){this.wrap=t,this.canonical=e,this.key=yh(t,e.z,e.z,e.x,e.y);}}class fh{constructor(t,e,r,n,i){this.overscaledZ=t,this.wrap=e,this.canonical=new ph(r,+n,+i),this.key=0===e&&t===r?this.canonical.key:yh(e,t,r,n,i);}equals(t){return this.overscaledZ===t.overscaledZ&&this.wrap===t.wrap&&this.canonical.equals(t.canonical)}scaledTo(t){const e=this.canonical.z-t;return t>this.canonical.z?new fh(t,this.wrap,this.canonical.z,this.canonical.x,this.canonical.y):new fh(t,this.wrap,t,this.canonical.x>>e,this.canonical.y>>e)}calculateScaledKey(t,e=!0){if(this.overscaledZ===t&&e)return this.key;if(t>this.canonical.z)return yh(this.wrap*+e,t,this.canonical.z,this.canonical.x,this.canonical.y);{const r=this.canonical.z-t;return yh(this.wrap*+e,t,t,this.canonical.x>>r,this.canonical.y>>r)}}isChildOf(t){if(t.wrap!==this.wrap)return !1;const e=this.canonical.z-t.canonical.z;return 0===t.overscaledZ||t.overscaledZ<this.overscaledZ&&t.canonical.x===this.canonical.x>>e&&t.canonical.y===this.canonical.y>>e}children(t){if(this.overscaledZ>=t)return [new fh(this.overscaledZ+1,this.wrap,this.canonical.z,this.canonical.x,this.canonical.y)];const e=this.canonical.z+1,r=2*this.canonical.x,n=2*this.canonical.y;return [new fh(e,this.wrap,e,r,n),new fh(e,this.wrap,e,r+1,n),new fh(e,this.wrap,e,r,n+1),new fh(e,this.wrap,e,r+1,n+1)]}isLessThan(t){return this.wrap<t.wrap||!(this.wrap>t.wrap)&&(this.overscaledZ<t.overscaledZ||!(this.overscaledZ>t.overscaledZ)&&(this.canonical.x<t.canonical.x||!(this.canonical.x>t.canonical.x)&&this.canonical.y<t.canonical.y))}wrapped(){return new fh(this.overscaledZ,0,this.canonical.z,this.canonical.x,this.canonical.y)}unwrapTo(t){return new fh(this.overscaledZ,t,this.canonical.z,this.canonical.x,this.canonical.y)}overscaleFactor(){return Math.pow(2,this.overscaledZ-this.canonical.z)}toUnwrapped(){return new dh(this.wrap,this.canonical)}toString(){return `${this.overscaledZ}/${this.canonical.x}/${this.canonical.y}`}}function yh(t,e,r,n,i){const s=1<<Math.min(r,22);let a=s*(i%s)+n%s;return t&&r<22&&(a+=s*s*((t<0?-2*t-1:2*t)%(1<<2*(22-r)))),16*(32*a+r)+(e-r)}Ji(ph,"CanonicalTileID"),Ji(fh,"OverscaledTileID",{omit:["projMatrix"]});class mh extends x{constructor(t,e,r){super(t,e),this.z=r;}}function gh(t,e){return t.x*e.x+t.y*e.y}function xh(t,e){if(1===t.length){let r=0;const n=e[r++];let i;for(;!i||n.equals(i);)if(i=e[r++],!i)return 1/0;for(;r<e.length;r++){const s=e[r],a=t[0],o=i.sub(n),l=s.sub(n),u=a.sub(n),c=gh(o,o),h=gh(o,l),p=gh(l,l),d=gh(u,o),f=gh(u,l),y=c*p-h*h,m=(p*d-h*f)/y,g=(c*f-h*d)/y,x=n.z*(1-m-g)+i.z*m+s.z*g;if(isFinite(x))return x}return 1/0}{let t=1/0;for(const r of e)t=Math.min(t,r.z);return t}}function vh(t,e,r,n,i,s,a,o){const l=a*i.getElevationAt(t,e,!0,!0),u=0!==s[0],c=u?0===s[1]?a*(s[0]/7-450):a*function(t,e,r){const n=Math.floor(e[0]/8),i=Math.floor(e[1]/8),s=10*(e[0]-8*n),a=10*(e[1]-8*i),o=t.getElevationAt(n,i,!0,!0),l=t.getMeterToDEM(r),u=Math.floor(.5*(s*l-1)),c=Math.floor(.5*(a*l-1)),h=t.tileCoordToPixel(n,i),p=2*u+1,d=2*c+1,f=function(t,e,r,n,i){return [t.getElevationAtPixel(e,r,!0),t.getElevationAtPixel(e+i,r,!0),t.getElevationAtPixel(e,r+i,!0),t.getElevationAtPixel(e+n,r+i,!0)]}(t,h.x-u,h.y-c,p,d),y=Math.abs(f[0]-f[1]),m=Math.abs(f[2]-f[3]),g=Math.abs(f[0]-f[2])+Math.abs(f[1]-f[3]),x=Math.min(.25,.5*l*(y+m)/p),v=Math.min(.25,.5*l*g/d);return o+Math.max(x*s,v*a)}(i,s,o):l;return {base:l+(0===r)?-1:r,top:u?Math.max(c+n,l+r+2):l+n}}const bh=Rs([{name:"a_pos_normal",components:2,type:"Int16"},{name:"a_data",components:4,type:"Uint8"},{name:"a_linesofar",components:1,type:"Float32"}],4),{members:wh}=bh,_h=Rs([{name:"a_packed",components:4,type:"Float32"}]),{members:Ah}=_h,Sh=Kc.types,kh=Math.cos(Math.PI/180*37.5);class Ih{constructor(t){this.zoom=t.zoom,this.overscaling=t.overscaling,this.layers=t.layers,this.layerIds=this.layers.map((t=>t.id)),this.index=t.index,this.projection=t.projection,this.hasPattern=!1,this.patternFeatures=[],this.lineClipsArray=[],this.gradients={},this.layers.forEach((t=>{this.gradients[t.id]={};})),this.layoutVertexArray=new qs,this.layoutVertexArray2=new Ns,this.indexArray=new ra,this.programConfigurations=new Ja(t.layers,t.zoom),this.segments=new so,this.maxLineLength=0,this.stateDependentLayerIds=this.layers.filter((t=>t.isStateDependent())).map((t=>t.id));}populate(t,e,r,n){this.hasPattern=kc("line",this.layers,e);const i=this.layers[0].layout.get("line-sort-key"),s=[];for(const{feature:e,id:a,index:o,sourceLayerIndex:l}of t){const t=this.layers[0]._featureFilter.needGeometry,u=ou(e,t);if(!this.layers[0]._featureFilter.filter(new ws(this.zoom),u,r))continue;const c=i?i.evaluate(u,{},r):void 0,h={id:a,properties:e.properties,type:e.type,sourceLayerIndex:l,index:o,geometry:t?u.geometry:au(e,r,n),patterns:{},sortKey:c};s.push(h);}i&&s.sort(((t,e)=>t.sortKey-e.sortKey));const{lineAtlas:a,featureIndex:o}=e,l=this.addConstantDashes(a);for(const n of s){const{geometry:i,index:s,sourceLayerIndex:u}=n;if(l&&this.addFeatureDashes(n,a),this.hasPattern){const t=Ic("line",this.layers,n,this.zoom,e);this.patternFeatures.push(t);}else this.addFeature(n,i,s,r,a.positions,e.availableImages);o.insert(t[s].feature,i,s,u,this.index);}}addConstantDashes(t){let e=!1;for(const r of this.layers){const n=r.paint.get("line-dasharray").value,i=r.layout.get("line-cap").value;if("constant"!==n.kind||"constant"!==i.kind)e=!0;else {const e=i.value,r=n.value;if(!r)continue;t.addDash(r,e);}}return e}addFeatureDashes(t,e){const r=this.zoom;for(const n of this.layers){const i=n.paint.get("line-dasharray").value,s=n.layout.get("line-cap").value;if("constant"===i.kind&&"constant"===s.kind)continue;let a,o;if("constant"===i.kind){if(a=i.value,!a)continue}else a=i.evaluate({zoom:r},t);o="constant"===s.kind?s.value:s.evaluate({zoom:r},t),e.addDash(a,o),t.patterns[n.id]=e.getKey(a,o);}}update(t,e,r,n){this.stateDependentLayers.length&&this.programConfigurations.updatePaintArrays(t,e,this.stateDependentLayers,r,n);}addFeatures(t,e,r,n,i){for(const t of this.patternFeatures)this.addFeature(t,t.geometry,t.index,e,r,n);}isEmpty(){return 0===this.layoutVertexArray.length}uploadPending(){return !this.uploaded||this.programConfigurations.needsUpload}upload(t){this.uploaded||(0!==this.layoutVertexArray2.length&&(this.layoutVertexBuffer2=t.createVertexBuffer(this.layoutVertexArray2,Ah)),this.layoutVertexBuffer=t.createVertexBuffer(this.layoutVertexArray,wh),this.indexBuffer=t.createIndexBuffer(this.indexArray)),this.programConfigurations.upload(t),this.uploaded=!0;}destroy(){this.layoutVertexBuffer&&(this.layoutVertexBuffer.destroy(),this.indexBuffer.destroy(),this.programConfigurations.destroy(),this.segments.destroy());}lineFeatureClips(t){if(t.properties&&t.properties.hasOwnProperty("mapbox_clip_start")&&t.properties.hasOwnProperty("mapbox_clip_end"))return {start:+t.properties.mapbox_clip_start,end:+t.properties.mapbox_clip_end}}addFeature(t,e,r,n,i,s){const a=this.layers[0].layout,o=a.get("line-join").evaluate(t,{}),l=a.get("line-cap").evaluate(t,{}),u=a.get("line-miter-limit"),c=a.get("line-round-limit");this.lineClips=this.lineFeatureClips(t);for(const r of e)this.addLine(r,t,o,l,u,c);this.programConfigurations.populatePaintArrays(this.layoutVertexArray.length,t,r,i,s,n);}addLine(t,e,r,n,i,s){if(this.distance=0,this.scaledDistance=0,this.totalDistance=0,this.lineSoFar=0,this.lineClips){this.lineClipsArray.push(this.lineClips);for(let e=0;e<t.length-1;e++)this.totalDistance+=t[e].dist(t[e+1]);this.updateScaledDistance(),this.maxLineLength=Math.max(this.maxLineLength,this.totalDistance);}const a="Polygon"===Sh[e.type];let o=t.length;for(;o>=2&&t[o-1].equals(t[o-2]);)o--;let l=0;for(;l<o-1&&t[l].equals(t[l+1]);)l++;if(o<(a?3:2))return;"bevel"===r&&(i=1.05);const u=this.overscaling<=16?15*ao/(512*this.overscaling):0,c=this.segments.prepareSegment(10*o,this.layoutVertexArray,this.indexArray);let h,p,d,f,y;this.e1=this.e2=-1,a&&(h=t[o-2],y=t[l].sub(h)._unit()._perp());for(let e=l;e<o;e++){if(d=e===o-1?a?t[l+1]:void 0:t[e+1],d&&t[e].equals(d))continue;y&&(f=y),h&&(p=h),h=t[e],y=d?d.sub(h)._unit()._perp():f,f=f||y;let m=f.add(y);0===m.x&&0===m.y||m._unit();const g=f.x*y.x+f.y*y.y,x=m.x*y.x+m.y*y.y,v=0!==x?1/x:1/0,b=2*Math.sqrt(2-2*x),w=x<kh&&p&&d,_=f.x*y.y-f.y*y.x>0;if(w&&e>l){const t=h.dist(p);if(t>2*u){const e=h.sub(h.sub(p)._mult(u/t)._round());this.updateDistance(p,e),this.addCurrentVertex(e,f,0,0,c),p=e;}}const A=p&&d;let S=A?r:a?"butt":n;if(A&&"round"===S&&(v<s?S="miter":v<=2&&(S="fakeround")),"miter"===S&&v>i&&(S="bevel"),"bevel"===S&&(v>2&&(S="flipbevel"),v<i&&(S="miter")),p&&this.updateDistance(p,h),"miter"===S)m._mult(v),this.addCurrentVertex(h,m,0,0,c);else if("flipbevel"===S){if(v>100)m=y.mult(-1);else {const t=v*f.add(y).mag()/f.sub(y).mag();m._perp()._mult(t*(_?-1:1));}this.addCurrentVertex(h,m,0,0,c),this.addCurrentVertex(h,m.mult(-1),0,0,c);}else if("bevel"===S||"fakeround"===S){const t=-Math.sqrt(v*v-1),e=_?t:0,r=_?0:t;if(p&&this.addCurrentVertex(h,f,e,r,c),"fakeround"===S){const t=Math.round(180*b/Math.PI/20);for(let e=1;e<t;e++){let r=e/t;if(.5!==r){const t=r-.5;r+=r*t*(r-1)*((1.0904+g*(g*(3.55645-1.43519*g)-3.2452))*t*t+(.848013+g*(.215638*g-1.06021)));}const n=y.sub(f)._mult(r)._add(f)._unit()._mult(_?-1:1);this.addHalfVertex(h,n.x,n.y,!1,_,0,c);}}d&&this.addCurrentVertex(h,y,-e,-r,c);}else if("butt"===S)this.addCurrentVertex(h,m,0,0,c);else if("square"===S){const t=p?1:-1;p||this.addCurrentVertex(h,m,t,t,c),this.addCurrentVertex(h,m,0,0,c),p&&this.addCurrentVertex(h,m,t,t,c);}else "round"===S&&(p&&(this.addCurrentVertex(h,f,0,0,c),this.addCurrentVertex(h,f,1,1,c,!0)),d&&(this.addCurrentVertex(h,y,-1,-1,c,!0),this.addCurrentVertex(h,y,0,0,c)));if(w&&e<o-1){const t=h.dist(d);if(t>2*u){const e=h.add(d.sub(h)._mult(u/t)._round());this.updateDistance(h,e),this.addCurrentVertex(e,y,0,0,c),h=e;}}}}addCurrentVertex(t,e,r,n,i,s=!1){const a=e.y*n-e.x,o=-e.y-e.x*n;this.addHalfVertex(t,e.x+e.y*r,e.y-e.x*r,s,!1,r,i),this.addHalfVertex(t,a,o,s,!0,-n,i);}addHalfVertex({x:t,y:e},r,n,i,s,a,o){this.layoutVertexArray.emplaceBack((t<<1)+(i?1:0),(e<<1)+(s?1:0),Math.round(63*r)+128,Math.round(63*n)+128,1+(0===a?0:a<0?-1:1),0,this.lineSoFar),this.lineClips&&this.layoutVertexArray2.emplaceBack(this.scaledDistance,this.lineClipsArray.length,this.lineClips.start,this.lineClips.end);const l=o.vertexLength++;this.e1>=0&&this.e2>=0&&(this.indexArray.emplaceBack(this.e1,this.e2,l),o.primitiveLength++),s?this.e2=l:this.e1=l;}updateScaledDistance(){if(this.lineClips){const t=this.totalDistance/(this.lineClips.end-this.lineClips.start);this.scaledDistance=this.distance/this.totalDistance,this.lineSoFar=t*this.lineClips.start+this.distance;}else this.lineSoFar=this.distance;}updateDistance(t,e){this.distance+=t.dist(e),this.updateScaledDistance();}}Ji(Ih,"LineBucket",{omit:["layers","patternFeatures"]});const Mh=new Ps({"line-cap":new Es(te.layout_line["line-cap"]),"line-join":new Es(te.layout_line["line-join"]),"line-miter-limit":new Bs(te.layout_line["line-miter-limit"]),"line-round-limit":new Bs(te.layout_line["line-round-limit"]),"line-sort-key":new Es(te.layout_line["line-sort-key"])});var Th={paint:new Ps({"line-opacity":new Es(te.paint_line["line-opacity"]),"line-color":new Es(te.paint_line["line-color"]),"line-translate":new Bs(te.paint_line["line-translate"]),"line-translate-anchor":new Bs(te.paint_line["line-translate-anchor"]),"line-width":new Es(te.paint_line["line-width"]),"line-gap-width":new Es(te.paint_line["line-gap-width"]),"line-offset":new Es(te.paint_line["line-offset"]),"line-blur":new Es(te.paint_line["line-blur"]),"line-dasharray":new Es(te.paint_line["line-dasharray"]),"line-pattern":new Es(te.paint_line["line-pattern"]),"line-gradient":new Cs(te.paint_line["line-gradient"]),"line-trim-offset":new Bs(te.paint_line["line-trim-offset"])}),layout:Mh};const zh=new class extends Es{possiblyEvaluate(t,e){return e=new ws(Math.floor(e.zoom),{now:e.now,fadeDuration:e.fadeDuration,transition:e.transition}),super.possiblyEvaluate(t,e)}evaluate(t,e,r,n){return e=C({},e,{zoom:Math.floor(e.zoom)}),super.evaluate(t,e,r,n)}}(Th.paint.properties["line-width"].specification);function Bh(t,e){return e>0?e+2*t:t}zh.useIntegerZoom=!0;const Eh=Rs([{name:"a_pos_offset",components:4,type:"Int16"},{name:"a_tex_size",components:4,type:"Uint16"},{name:"a_pixeloffset",components:4,type:"Int16"}],4),Ch=Rs([{name:"a_globe_anchor",components:3,type:"Int16"},{name:"a_globe_normal",components:3,type:"Float32"}],4),Ph=Rs([{name:"a_projected_pos",components:4,type:"Float32"}],4);Rs([{name:"a_fade_opacity",components:1,type:"Uint32"}],4);const Dh=Rs([{name:"a_placed",components:2,type:"Uint8"},{name:"a_shift",components:2,type:"Float32"}]),Vh=Rs([{name:"a_size_scale",components:1,type:"Float32"},{name:"a_padding",components:2,type:"Float32"}]);Rs([{type:"Int16",name:"projectedAnchorX"},{type:"Int16",name:"projectedAnchorY"},{type:"Int16",name:"projectedAnchorZ"},{type:"Int16",name:"tileAnchorX"},{type:"Int16",name:"tileAnchorY"},{type:"Float32",name:"x1"},{type:"Float32",name:"y1"},{type:"Float32",name:"x2"},{type:"Float32",name:"y2"},{type:"Int16",name:"padding"},{type:"Uint32",name:"featureIndex"},{type:"Uint16",name:"sourceLayerIndex"},{type:"Uint16",name:"bucketIndex"}]);const Lh=Rs([{name:"a_pos",components:3,type:"Int16"},{name:"a_anchor_pos",components:2,type:"Int16"},{name:"a_extrude",components:2,type:"Int16"}],4),Fh=Rs([{name:"a_pos_2f",components:2,type:"Float32"},{name:"a_radius",components:1,type:"Float32"},{name:"a_flags",components:2,type:"Int16"}],4);Rs([{name:"triangle",components:3,type:"Uint16"}]),Rs([{type:"Int16",name:"projectedAnchorX"},{type:"Int16",name:"projectedAnchorY"},{type:"Int16",name:"projectedAnchorZ"},{type:"Float32",name:"tileAnchorX"},{type:"Float32",name:"tileAnchorY"},{type:"Uint16",name:"glyphStartIndex"},{type:"Uint16",name:"numGlyphs"},{type:"Uint32",name:"vertexStartIndex"},{type:"Uint32",name:"lineStartIndex"},{type:"Uint32",name:"lineLength"},{type:"Uint16",name:"segment"},{type:"Uint16",name:"lowerSize"},{type:"Uint16",name:"upperSize"},{type:"Float32",name:"lineOffsetX"},{type:"Float32",name:"lineOffsetY"},{type:"Uint8",name:"writingMode"},{type:"Uint8",name:"placedOrientation"},{type:"Uint8",name:"hidden"},{type:"Uint32",name:"crossTileID"},{type:"Int16",name:"associatedIconIndex"},{type:"Uint8",name:"flipState"}]),Rs([{type:"Int16",name:"projectedAnchorX"},{type:"Int16",name:"projectedAnchorY"},{type:"Int16",name:"projectedAnchorZ"},{type:"Float32",name:"tileAnchorX"},{type:"Float32",name:"tileAnchorY"},{type:"Int16",name:"rightJustifiedTextSymbolIndex"},{type:"Int16",name:"centerJustifiedTextSymbolIndex"},{type:"Int16",name:"leftJustifiedTextSymbolIndex"},{type:"Int16",name:"verticalPlacedTextSymbolIndex"},{type:"Int16",name:"placedIconSymbolIndex"},{type:"Int16",name:"verticalPlacedIconSymbolIndex"},{type:"Uint16",name:"key"},{type:"Uint16",name:"textBoxStartIndex"},{type:"Uint16",name:"textBoxEndIndex"},{type:"Uint16",name:"verticalTextBoxStartIndex"},{type:"Uint16",name:"verticalTextBoxEndIndex"},{type:"Uint16",name:"iconBoxStartIndex"},{type:"Uint16",name:"iconBoxEndIndex"},{type:"Uint16",name:"verticalIconBoxStartIndex"},{type:"Uint16",name:"verticalIconBoxEndIndex"},{type:"Uint16",name:"featureIndex"},{type:"Uint16",name:"numHorizontalGlyphVertices"},{type:"Uint16",name:"numVerticalGlyphVertices"},{type:"Uint16",name:"numIconVertices"},{type:"Uint16",name:"numVerticalIconVertices"},{type:"Uint16",name:"useRuntimeCollisionCircles"},{type:"Uint32",name:"crossTileID"},{type:"Float32",components:2,name:"textOffset"},{type:"Float32",name:"collisionCircleDiameter"}]),Rs([{type:"Float32",name:"offsetX"}]),Rs([{type:"Int16",name:"x"},{type:"Int16",name:"y"}]);var Rh=24;const Uh=128;function $h(t,e){const{expression:r}=e;if("constant"===r.kind)return {kind:"constant",layoutSize:r.evaluate(new ws(t+1))};if("source"===r.kind)return {kind:"source"};{const{zoomStops:e,interpolationType:n}=r;let i=0;for(;i<e.length&&e[i]<=t;)i++;i=Math.max(0,i-1);let s=i;for(;s<e.length&&e[s]<t+1;)s++;s=Math.min(e.length-1,s);const a=e[i],o=e[s];return "composite"===r.kind?{kind:"composite",minZoom:a,maxZoom:o,interpolationType:n}:{kind:"camera",minZoom:a,maxZoom:o,minSize:r.evaluate(new ws(a)),maxSize:r.evaluate(new ws(o)),interpolationType:n}}}function jh(t,{uSize:e,uSizeT:r},{lowerSize:n,upperSize:i}){return "source"===t.kind?n/Uh:"composite"===t.kind?Er(n/Uh,i/Uh,r):e}function Oh(t,e){let r=0,n=0;if("constant"===t.kind)n=t.layoutSize;else if("source"!==t.kind){const{interpolationType:i,minZoom:s,maxZoom:a}=t,o=i?M(Qr.interpolationFactor(i,e,s,a),0,1):0;"camera"===t.kind?n=Er(t.minSize,t.maxSize,o):r=o;}return {uSizeT:r,uSize:n}}var qh=Object.freeze({__proto__:null,SIZE_PACK_FACTOR:Uh,evaluateSizeForFeature:jh,evaluateSizeForZoom:Oh,getSizeData:$h});function Nh(t,e,r){return t.sections.forEach((t=>{t.text=function(t,e,r){const n=e.layout.get("text-transform").evaluate(r,{});return "uppercase"===n?t=t.toLocaleUpperCase():"lowercase"===n&&(t=t.toLocaleLowerCase()),bs.applyArabicShaping&&(t=bs.applyArabicShaping(t)),t}(t.text,e,r);})),t}const Gh={"!":"︕","#":"＃",$:"＄","%":"％","&":"＆","(":"︵",")":"︶","*":"＊","+":"＋",",":"︐","-":"︲",".":"・","/":"／",":":"︓",";":"︔","<":"︿","=":"＝",">":"﹀","?":"︖","@":"＠","[":"﹇","\\":"＼","]":"﹈","^":"＾",_:"︳","`":"｀","{":"︷","|":"―","}":"︸","~":"～","¢":"￠","£":"￡","¥":"￥","¦":"￤","¬":"￢","¯":"￣","–":"︲","—":"︱","‘":"﹃","’":"﹄","“":"﹁","”":"﹂","…":"︙","‧":"・","₩":"￦","、":"︑","。":"︒","〈":"︿","〉":"﹀","《":"︽","》":"︾","「":"﹁","」":"﹂","『":"﹃","』":"﹄","【":"︻","】":"︼","〔":"︹","〕":"︺","〖":"︗","〗":"︘","！":"︕","（":"︵","）":"︶","，":"︐","－":"︲","．":"・","：":"︓","；":"︔","＜":"︿","＞":"﹀","？":"︖","［":"﹇","］":"﹈","＿":"︳","｛":"︷","｜":"―","｝":"︸","｟":"︵","｠":"︶","｡":"︒","｢":"﹁","｣":"﹂","←":"↑","→":"↓"};function Zh(t){return "︶"===t||"﹈"===t||"︸"===t||"﹄"===t||"﹂"===t||"︾"===t||"︼"===t||"︺"===t||"︘"===t||"﹀"===t||"︐"===t||"︓"===t||"︔"===t||"｀"===t||"￣"===t||"︑"===t||"︒"===t}function Kh(t){return "︵"===t||"﹇"===t||"︷"===t||"﹃"===t||"﹁"===t||"︽"===t||"︻"===t||"︹"===t||"︗"===t||"︿"===t}var Xh=Yh,Jh=function(t,e,r,n,i){var s,a,o=8*i-n-1,l=(1<<o)-1,u=l>>1,c=-7,h=r?i-1:0,p=r?-1:1,d=t[e+h];for(h+=p,s=d&(1<<-c)-1,d>>=-c,c+=o;c>0;s=256*s+t[e+h],h+=p,c-=8);for(a=s&(1<<-c)-1,s>>=-c,c+=n;c>0;a=256*a+t[e+h],h+=p,c-=8);if(0===s)s=1-u;else {if(s===l)return a?NaN:1/0*(d?-1:1);a+=Math.pow(2,n),s-=u;}return (d?-1:1)*a*Math.pow(2,s-n)},Hh=function(t,e,r,n,i,s){var a,o,l,u=8*s-i-1,c=(1<<u)-1,h=c>>1,p=23===i?Math.pow(2,-24)-Math.pow(2,-77):0,d=n?0:s-1,f=n?1:-1,y=e<0||0===e&&1/e<0?1:0;for(e=Math.abs(e),isNaN(e)||e===1/0?(o=isNaN(e)?1:0,a=c):(a=Math.floor(Math.log(e)/Math.LN2),e*(l=Math.pow(2,-a))<1&&(a--,l*=2),(e+=a+h>=1?p/l:p*Math.pow(2,1-h))*l>=2&&(a++,l/=2),a+h>=c?(o=0,a=c):a+h>=1?(o=(e*l-1)*Math.pow(2,i),a+=h):(o=e*Math.pow(2,h-1)*Math.pow(2,i),a=0));i>=8;t[r+d]=255&o,d+=f,o/=256,i-=8);for(a=a<<i|o,u+=i;u>0;t[r+d]=255&a,d+=f,a/=256,u-=8);t[r+d-f]|=128*y;};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */function Yh(t){this.buf=ArrayBuffer.isView&&ArrayBuffer.isView(t)?t:new Uint8Array(t||0),this.pos=0,this.type=0,this.length=this.buf.length;}Yh.Varint=0,Yh.Fixed64=1,Yh.Bytes=2,Yh.Fixed32=5;var Wh=4294967296,Qh=1/Wh,tp="undefined"==typeof TextDecoder?null:new TextDecoder("utf8");function ep(t){return t.type===Yh.Bytes?t.readVarint()+t.pos:t.pos+1}function rp(t,e,r){return r?4294967296*e+(t>>>0):4294967296*(e>>>0)+(t>>>0)}function np(t,e,r){var n=e<=16383?1:e<=2097151?2:e<=268435455?3:Math.floor(Math.log(e)/(7*Math.LN2));r.realloc(n);for(var i=r.pos-1;i>=t;i--)r.buf[i+n]=r.buf[i];}function ip(t,e){for(var r=0;r<t.length;r++)e.writeVarint(t[r]);}function sp(t,e){for(var r=0;r<t.length;r++)e.writeSVarint(t[r]);}function ap(t,e){for(var r=0;r<t.length;r++)e.writeFloat(t[r]);}function op(t,e){for(var r=0;r<t.length;r++)e.writeDouble(t[r]);}function lp(t,e){for(var r=0;r<t.length;r++)e.writeBoolean(t[r]);}function up(t,e){for(var r=0;r<t.length;r++)e.writeFixed32(t[r]);}function cp(t,e){for(var r=0;r<t.length;r++)e.writeSFixed32(t[r]);}function hp(t,e){for(var r=0;r<t.length;r++)e.writeFixed64(t[r]);}function pp(t,e){for(var r=0;r<t.length;r++)e.writeSFixed64(t[r]);}function dp(t,e){return (t[e]|t[e+1]<<8|t[e+2]<<16)+16777216*t[e+3]}function fp(t,e,r){t[r]=e,t[r+1]=e>>>8,t[r+2]=e>>>16,t[r+3]=e>>>24;}function yp(t,e){return (t[e]|t[e+1]<<8|t[e+2]<<16)+(t[e+3]<<24)}Yh.prototype={destroy:function(){this.buf=null;},readFields:function(t,e,r){for(r=r||this.length;this.pos<r;){var n=this.readVarint(),i=n>>3,s=this.pos;this.type=7&n,t(i,e,this),this.pos===s&&this.skip(n);}return e},readMessage:function(t,e){return this.readFields(t,e,this.readVarint()+this.pos)},readFixed32:function(){var t=dp(this.buf,this.pos);return this.pos+=4,t},readSFixed32:function(){var t=yp(this.buf,this.pos);return this.pos+=4,t},readFixed64:function(){var t=dp(this.buf,this.pos)+dp(this.buf,this.pos+4)*Wh;return this.pos+=8,t},readSFixed64:function(){var t=dp(this.buf,this.pos)+yp(this.buf,this.pos+4)*Wh;return this.pos+=8,t},readFloat:function(){var t=Jh(this.buf,this.pos,!0,23,4);return this.pos+=4,t},readDouble:function(){var t=Jh(this.buf,this.pos,!0,52,8);return this.pos+=8,t},readVarint:function(t){var e,r,n=this.buf;return e=127&(r=n[this.pos++]),r<128?e:(e|=(127&(r=n[this.pos++]))<<7,r<128?e:(e|=(127&(r=n[this.pos++]))<<14,r<128?e:(e|=(127&(r=n[this.pos++]))<<21,r<128?e:function(t,e,r){var n,i,s=r.buf;if(n=(112&(i=s[r.pos++]))>>4,i<128)return rp(t,n,e);if(n|=(127&(i=s[r.pos++]))<<3,i<128)return rp(t,n,e);if(n|=(127&(i=s[r.pos++]))<<10,i<128)return rp(t,n,e);if(n|=(127&(i=s[r.pos++]))<<17,i<128)return rp(t,n,e);if(n|=(127&(i=s[r.pos++]))<<24,i<128)return rp(t,n,e);if(n|=(1&(i=s[r.pos++]))<<31,i<128)return rp(t,n,e);throw new Error("Expected varint not more than 10 bytes")}(e|=(15&(r=n[this.pos]))<<28,t,this))))},readVarint64:function(){return this.readVarint(!0)},readSVarint:function(){var t=this.readVarint();return t%2==1?(t+1)/-2:t/2},readBoolean:function(){return Boolean(this.readVarint())},readString:function(){var t=this.readVarint()+this.pos,e=this.pos;return this.pos=t,t-e>=12&&tp?function(t,e,r){return tp.decode(t.subarray(e,r))}(this.buf,e,t):function(t,e,r){for(var n="",i=e;i<r;){var s,a,o,l=t[i],u=null,c=l>239?4:l>223?3:l>191?2:1;if(i+c>r)break;1===c?l<128&&(u=l):2===c?128==(192&(s=t[i+1]))&&(u=(31&l)<<6|63&s)<=127&&(u=null):3===c?(a=t[i+2],128==(192&(s=t[i+1]))&&128==(192&a)&&((u=(15&l)<<12|(63&s)<<6|63&a)<=2047||u>=55296&&u<=57343)&&(u=null)):4===c&&(a=t[i+2],o=t[i+3],128==(192&(s=t[i+1]))&&128==(192&a)&&128==(192&o)&&((u=(15&l)<<18|(63&s)<<12|(63&a)<<6|63&o)<=65535||u>=1114112)&&(u=null)),null===u?(u=65533,c=1):u>65535&&(u-=65536,n+=String.fromCharCode(u>>>10&1023|55296),u=56320|1023&u),n+=String.fromCharCode(u),i+=c;}return n}(this.buf,e,t)},readBytes:function(){var t=this.readVarint()+this.pos,e=this.buf.subarray(this.pos,t);return this.pos=t,e},readPackedVarint:function(t,e){if(this.type!==Yh.Bytes)return t.push(this.readVarint(e));var r=ep(this);for(t=t||[];this.pos<r;)t.push(this.readVarint(e));return t},readPackedSVarint:function(t){if(this.type!==Yh.Bytes)return t.push(this.readSVarint());var e=ep(this);for(t=t||[];this.pos<e;)t.push(this.readSVarint());return t},readPackedBoolean:function(t){if(this.type!==Yh.Bytes)return t.push(this.readBoolean());var e=ep(this);for(t=t||[];this.pos<e;)t.push(this.readBoolean());return t},readPackedFloat:function(t){if(this.type!==Yh.Bytes)return t.push(this.readFloat());var e=ep(this);for(t=t||[];this.pos<e;)t.push(this.readFloat());return t},readPackedDouble:function(t){if(this.type!==Yh.Bytes)return t.push(this.readDouble());var e=ep(this);for(t=t||[];this.pos<e;)t.push(this.readDouble());return t},readPackedFixed32:function(t){if(this.type!==Yh.Bytes)return t.push(this.readFixed32());var e=ep(this);for(t=t||[];this.pos<e;)t.push(this.readFixed32());return t},readPackedSFixed32:function(t){if(this.type!==Yh.Bytes)return t.push(this.readSFixed32());var e=ep(this);for(t=t||[];this.pos<e;)t.push(this.readSFixed32());return t},readPackedFixed64:function(t){if(this.type!==Yh.Bytes)return t.push(this.readFixed64());var e=ep(this);for(t=t||[];this.pos<e;)t.push(this.readFixed64());return t},readPackedSFixed64:function(t){if(this.type!==Yh.Bytes)return t.push(this.readSFixed64());var e=ep(this);for(t=t||[];this.pos<e;)t.push(this.readSFixed64());return t},skip:function(t){var e=7&t;if(e===Yh.Varint)for(;this.buf[this.pos++]>127;);else if(e===Yh.Bytes)this.pos=this.readVarint()+this.pos;else if(e===Yh.Fixed32)this.pos+=4;else {if(e!==Yh.Fixed64)throw new Error("Unimplemented type: "+e);this.pos+=8;}},writeTag:function(t,e){this.writeVarint(t<<3|e);},realloc:function(t){for(var e=this.length||16;e<this.pos+t;)e*=2;if(e!==this.length){var r=new Uint8Array(e);r.set(this.buf),this.buf=r,this.length=e;}},finish:function(){return this.length=this.pos,this.pos=0,this.buf.subarray(0,this.length)},writeFixed32:function(t){this.realloc(4),fp(this.buf,t,this.pos),this.pos+=4;},writeSFixed32:function(t){this.realloc(4),fp(this.buf,t,this.pos),this.pos+=4;},writeFixed64:function(t){this.realloc(8),fp(this.buf,-1&t,this.pos),fp(this.buf,Math.floor(t*Qh),this.pos+4),this.pos+=8;},writeSFixed64:function(t){this.realloc(8),fp(this.buf,-1&t,this.pos),fp(this.buf,Math.floor(t*Qh),this.pos+4),this.pos+=8;},writeVarint:function(t){(t=+t||0)>268435455||t<0?function(t,e){var r,n;if(t>=0?(r=t%4294967296|0,n=t/4294967296|0):(n=~(-t/4294967296),4294967295^(r=~(-t%4294967296))?r=r+1|0:(r=0,n=n+1|0)),t>=0x10000000000000000||t<-0x10000000000000000)throw new Error("Given varint doesn't fit into 10 bytes");e.realloc(10),function(t,e,r){r.buf[r.pos++]=127&t|128,t>>>=7,r.buf[r.pos++]=127&t|128,t>>>=7,r.buf[r.pos++]=127&t|128,t>>>=7,r.buf[r.pos++]=127&t|128,r.buf[r.pos]=127&(t>>>=7);}(r,0,e),function(t,e){var r=(7&t)<<4;e.buf[e.pos++]|=r|((t>>>=3)?128:0),t&&(e.buf[e.pos++]=127&t|((t>>>=7)?128:0),t&&(e.buf[e.pos++]=127&t|((t>>>=7)?128:0),t&&(e.buf[e.pos++]=127&t|((t>>>=7)?128:0),t&&(e.buf[e.pos++]=127&t|((t>>>=7)?128:0),t&&(e.buf[e.pos++]=127&t)))));}(n,e);}(t,this):(this.realloc(4),this.buf[this.pos++]=127&t|(t>127?128:0),t<=127||(this.buf[this.pos++]=127&(t>>>=7)|(t>127?128:0),t<=127||(this.buf[this.pos++]=127&(t>>>=7)|(t>127?128:0),t<=127||(this.buf[this.pos++]=t>>>7&127))));},writeSVarint:function(t){this.writeVarint(t<0?2*-t-1:2*t);},writeBoolean:function(t){this.writeVarint(Boolean(t));},writeString:function(t){t=String(t),this.realloc(4*t.length),this.pos++;var e=this.pos;this.pos=function(t,e,r){for(var n,i,s=0;s<e.length;s++){if((n=e.charCodeAt(s))>55295&&n<57344){if(!i){n>56319||s+1===e.length?(t[r++]=239,t[r++]=191,t[r++]=189):i=n;continue}if(n<56320){t[r++]=239,t[r++]=191,t[r++]=189,i=n;continue}n=i-55296<<10|n-56320|65536,i=null;}else i&&(t[r++]=239,t[r++]=191,t[r++]=189,i=null);n<128?t[r++]=n:(n<2048?t[r++]=n>>6|192:(n<65536?t[r++]=n>>12|224:(t[r++]=n>>18|240,t[r++]=n>>12&63|128),t[r++]=n>>6&63|128),t[r++]=63&n|128);}return r}(this.buf,t,this.pos);var r=this.pos-e;r>=128&&np(e,r,this),this.pos=e-1,this.writeVarint(r),this.pos+=r;},writeFloat:function(t){this.realloc(4),Hh(this.buf,t,this.pos,!0,23,4),this.pos+=4;},writeDouble:function(t){this.realloc(8),Hh(this.buf,t,this.pos,!0,52,8),this.pos+=8;},writeBytes:function(t){var e=t.length;this.writeVarint(e),this.realloc(e);for(var r=0;r<e;r++)this.buf[this.pos++]=t[r];},writeRawMessage:function(t,e){this.pos++;var r=this.pos;t(e,this);var n=this.pos-r;n>=128&&np(r,n,this),this.pos=r-1,this.writeVarint(n),this.pos+=n;},writeMessage:function(t,e,r){this.writeTag(t,Yh.Bytes),this.writeRawMessage(e,r);},writePackedVarint:function(t,e){e.length&&this.writeMessage(t,ip,e);},writePackedSVarint:function(t,e){e.length&&this.writeMessage(t,sp,e);},writePackedBoolean:function(t,e){e.length&&this.writeMessage(t,lp,e);},writePackedFloat:function(t,e){e.length&&this.writeMessage(t,ap,e);},writePackedDouble:function(t,e){e.length&&this.writeMessage(t,op,e);},writePackedFixed32:function(t,e){e.length&&this.writeMessage(t,up,e);},writePackedSFixed32:function(t,e){e.length&&this.writeMessage(t,cp,e);},writePackedFixed64:function(t,e){e.length&&this.writeMessage(t,hp,e);},writePackedSFixed64:function(t,e){e.length&&this.writeMessage(t,pp,e);},writeBytesField:function(t,e){this.writeTag(t,Yh.Bytes),this.writeBytes(e);},writeFixed32Field:function(t,e){this.writeTag(t,Yh.Fixed32),this.writeFixed32(e);},writeSFixed32Field:function(t,e){this.writeTag(t,Yh.Fixed32),this.writeSFixed32(e);},writeFixed64Field:function(t,e){this.writeTag(t,Yh.Fixed64),this.writeFixed64(e);},writeSFixed64Field:function(t,e){this.writeTag(t,Yh.Fixed64),this.writeSFixed64(e);},writeVarintField:function(t,e){this.writeTag(t,Yh.Varint),this.writeVarint(e);},writeSVarintField:function(t,e){this.writeTag(t,Yh.Varint),this.writeSVarint(e);},writeStringField:function(t,e){this.writeTag(t,Yh.Bytes),this.writeString(e);},writeFloatField:function(t,e){this.writeTag(t,Yh.Fixed32),this.writeFloat(e);},writeDoubleField:function(t,e){this.writeTag(t,Yh.Fixed64),this.writeDouble(e);},writeBooleanField:function(t,e){this.writeVarintField(t,Boolean(e));}};var mp=p(Xh);const gp=3;function xp(t,e,r){e.glyphs=[],1===t&&r.readMessage(vp,e);}function vp(t,e,r){if(3===t){const{id:t,bitmap:n,width:i,height:s,left:a,top:o,advance:l}=r.readMessage(bp,{});e.glyphs.push({id:t,bitmap:new Ru({width:i+2*gp,height:s+2*gp},n),metrics:{width:i,height:s,left:a,top:o,advance:l}});}else 4===t?e.ascender=r.readSVarint():5===t&&(e.descender=r.readSVarint());}function bp(t,e,r){1===t?e.id=r.readVarint():2===t?e.bitmap=r.readBytes():3===t?e.width=r.readVarint():4===t?e.height=r.readVarint():5===t?e.left=r.readSVarint():6===t?e.top=r.readSVarint():7===t&&(e.advance=r.readVarint());}const wp=gp;function _p(t){let e=0,r=0;for(const n of t)e+=n.w*n.h,r=Math.max(r,n.w);t.sort(((t,e)=>e.h-t.h));const n=[{x:0,y:0,w:Math.max(Math.ceil(Math.sqrt(e/.95)),r),h:1/0}];let i=0,s=0;for(const e of t)for(let t=n.length-1;t>=0;t--){const r=n[t];if(!(e.w>r.w||e.h>r.h)){if(e.x=r.x,e.y=r.y,s=Math.max(s,e.y+e.h),i=Math.max(i,e.x+e.w),e.w===r.w&&e.h===r.h){const e=n.pop();t<n.length&&(n[t]=e);}else e.h===r.h?(r.x+=e.w,r.w-=e.w):e.w===r.w?(r.y+=e.h,r.h-=e.h):(n.push({x:r.x+e.w,y:r.y,w:r.w-e.w,h:e.h}),r.y+=e.h,r.h-=e.h);break}}return {w:i,h:s,fill:e/(i*s)||0}}const Ap=1;class Sp{constructor(t,{pixelRatio:e,version:r,stretchX:n,stretchY:i,content:s}){this.paddedRect=t,this.pixelRatio=e,this.stretchX=n,this.stretchY=i,this.content=s,this.version=r;}get tl(){return [this.paddedRect.x+Ap,this.paddedRect.y+Ap]}get br(){return [this.paddedRect.x+this.paddedRect.w-Ap,this.paddedRect.y+this.paddedRect.h-Ap]}get displaySize(){return [(this.paddedRect.w-2*Ap)/this.pixelRatio,(this.paddedRect.h-2*Ap)/this.pixelRatio]}}class kp{constructor(t,e){const r={},n={};this.haveRenderCallbacks=[];const i=[];this.addImages(t,r,i),this.addImages(e,n,i);const{w:s,h:a}=_p(i),o=new Uu({width:s||1,height:a||1});for(const e in t){const n=t[e],i=r[e].paddedRect;Uu.copy(n.data,o,{x:0,y:0},{x:i.x+Ap,y:i.y+Ap},n.data);}for(const t in e){const r=e[t],i=n[t].paddedRect,s=i.x+Ap,a=i.y+Ap,l=r.data.width,u=r.data.height;Uu.copy(r.data,o,{x:0,y:0},{x:s,y:a},r.data),Uu.copy(r.data,o,{x:0,y:u-1},{x:s,y:a-1},{width:l,height:1}),Uu.copy(r.data,o,{x:0,y:0},{x:s,y:a+u},{width:l,height:1}),Uu.copy(r.data,o,{x:l-1,y:0},{x:s-1,y:a},{width:1,height:u}),Uu.copy(r.data,o,{x:0,y:0},{x:s+l,y:a},{width:1,height:u});}this.image=o,this.iconPositions=r,this.patternPositions=n;}addImages(t,e,r){for(const n in t){const i=t[n],s={x:0,y:0,w:i.data.width+2*Ap,h:i.data.height+2*Ap};r.push(s),e[n]=new Sp(s,i),i.hasRenderCallback&&this.haveRenderCallbacks.push(n);}}patchUpdatedImages(t,e){this.haveRenderCallbacks=this.haveRenderCallbacks.filter((e=>t.hasImage(e))),t.dispatchRenderCallbacks(this.haveRenderCallbacks);for(const r in t.updatedImages)this.patchUpdatedImage(this.iconPositions[r],t.getImage(r),e),this.patchUpdatedImage(this.patternPositions[r],t.getImage(r),e);}patchUpdatedImage(t,e,r){if(!t||!e)return;if(t.version===e.version)return;t.version=e.version;const[n,i]=t.tl;r.update(e.data,void 0,{x:n,y:i});}}Ji(Sp,"ImagePosition"),Ji(kp,"ImageAtlas");const Ip={horizontal:1,vertical:2,horizontalOnly:3},Mp=-17;class Tp{constructor(){this.scale=1,this.fontStack="",this.imageName=null;}static forText(t,e){const r=new Tp;return r.scale=t||1,r.fontStack=e,r}static forImage(t){const e=new Tp;return e.imageName=t,e}}class zp{constructor(){this.text="",this.sectionIndex=[],this.sections=[],this.imageSectionID=null;}static fromFeature(t,e){const r=new zp;for(let n=0;n<t.sections.length;n++){const i=t.sections[n];i.image?r.addImageSection(i):r.addTextSection(i,e);}return r}length(){return this.text.length}getSection(t){return this.sections[this.sectionIndex[t]]}getSections(){return this.sections}getSectionIndex(t){return this.sectionIndex[t]}getCharCode(t){return this.text.charCodeAt(t)}verticalizePunctuation(t){this.text=function(t,e){let r="";for(let n=0;n<t.length;n++){const i=t.charCodeAt(n+1)||null,s=t.charCodeAt(n-1)||null;r+=!e&&(i&&ss(i)&&!Gh[t[n+1]]||s&&ss(s)&&!Gh[t[n-1]])||!Gh[t[n]]?t[n]:Gh[t[n]];}return r}(this.text,t);}trim(){let t=0;for(let e=0;e<this.text.length&&Ep[this.text.charCodeAt(e)];e++)t++;let e=this.text.length;for(let r=this.text.length-1;r>=0&&r>=t&&Ep[this.text.charCodeAt(r)];r--)e--;this.text=this.text.substring(t,e),this.sectionIndex=this.sectionIndex.slice(t,e);}substring(t,e){const r=new zp;return r.text=this.text.substring(t,e),r.sectionIndex=this.sectionIndex.slice(t,e),r.sections=this.sections,r}toString(){return this.text}getMaxScale(){return this.sectionIndex.reduce(((t,e)=>Math.max(t,this.sections[e].scale)),0)}addTextSection(t,e){this.text+=t.text,this.sections.push(Tp.forText(t.scale,t.fontStack||e));const r=this.sections.length-1;for(let e=0;e<t.text.length;++e)this.sectionIndex.push(r);}addImageSection(t){const e=t.image?t.image.name:"";if(0===e.length)return void N("Can't add FormattedSection with an empty image.");const r=this.getNextImageSectionCharCode();r?(this.text+=String.fromCharCode(r),this.sections.push(Tp.forImage(e)),this.sectionIndex.push(this.sections.length-1)):N("Reached maximum number of images 6401");}getNextImageSectionCharCode(){return this.imageSectionID?this.imageSectionID>=63743?null:++this.imageSectionID:(this.imageSectionID=57344,this.imageSectionID)}}function Bp(t,e,r,n,i,s,a,o,l,u,c,h,p,d,f){const y=zp.fromFeature(t,i);h===Ip.vertical&&y.verticalizePunctuation(p);let m=[];const g=function(t,e,r,n,i,s){if(!t)return [];const a=[],o=function(t,e,r,n,i,s){let a=0;for(let r=0;r<t.length();r++){const o=t.getSection(r);a+=Pp(t.getCharCode(r),o,n,i,e,s);}return a/Math.max(1,Math.ceil(a/r))}(t,e,r,n,i,s),l=t.text.indexOf("​")>=0;let u=0;for(let r=0;r<t.length();r++){const h=t.getSection(r),p=t.getCharCode(r);if(Ep[p]||(u+=Pp(p,h,n,i,e,s)),r<t.length()-1){const e=!((c=p)<11904||!(ts["Bopomofo Extended"](c)||ts.Bopomofo(c)||ts["CJK Compatibility Forms"](c)||ts["CJK Compatibility Ideographs"](c)||ts["CJK Compatibility"](c)||ts["CJK Radicals Supplement"](c)||ts["CJK Strokes"](c)||ts["CJK Symbols and Punctuation"](c)||ts["CJK Unified Ideographs Extension A"](c)||ts["CJK Unified Ideographs"](c)||ts["Enclosed CJK Letters and Months"](c)||ts["Halfwidth and Fullwidth Forms"](c)||ts.Hiragana(c)||ts["Ideographic Description Characters"](c)||ts["Kangxi Radicals"](c)||ts["Katakana Phonetic Extensions"](c)||ts.Katakana(c)||ts["Vertical Forms"](c)||ts["Yi Radicals"](c)||ts["Yi Syllables"](c)));(Cp[p]||e||h.imageName)&&a.push(Lp(r+1,u,o,a,Vp(p,t.getCharCode(r+1),e&&l),!1));}}var c;return Fp(Lp(t.length(),u,o,a,0,!0))}(y,u,s,e,n,d),{processBidirectionalText:x,processStyledBidirectionalText:v}=bs;if(x&&1===y.sections.length){const t=x(y.toString(),g);for(const e of t){const t=new zp;t.text=e,t.sections=y.sections;for(let r=0;r<e.length;r++)t.sectionIndex.push(0);m.push(t);}}else if(v){const t=v(y.text,y.sectionIndex,g);for(const e of t){const t=new zp;t.text=e[0],t.sectionIndex=e[1],t.sections=y.sections,m.push(t);}}else m=function(t,e){const r=[],n=t.text;let i=0;for(const n of e)r.push(t.substring(i,n)),i=n;return i<n.length&&r.push(t.substring(i,n.length)),r}(y,g);const b=[],w={positionedLines:b,text:y.toString(),top:c[1],bottom:c[1],left:c[0],right:c[0],writingMode:h,iconsInText:!1,verticalizable:!1,hasBaseline:!1};return function(t,e,r,n,i,s,a,o,l,u,c,h){let p=0,d=0,f=0;const y="right"===o?1:"left"===o?0:.5;let m=!1;for(const t of i){const r=t.getSections();for(const t of r){if(t.imageName)continue;const r=e[t.fontStack];if(r&&(m=void 0!==r.ascender&&void 0!==r.descender,!m))break}if(!m)break}let g=0;for(const a of i){a.trim();const i=a.getMaxScale(),o=(i-1)*Rh,v={positionedGlyphs:[],lineOffset:0};t.positionedLines[g]=v;const b=v.positionedGlyphs;let w=0;if(!a.length()){d+=s,++g;continue}let _=0,A=0;for(let s=0;s<a.length();s++){const o=a.getSection(s),f=a.getSectionIndex(s),y=a.getCharCode(s);let g=o.scale,v=null,S=null,k=null,I=Rh,M=0;const T=!(l===Ip.horizontal||!c&&!is(y)||c&&(Ep[y]||(x=y,ts.Arabic(x)||ts["Arabic Supplement"](x)||ts["Arabic Extended-A"](x)||ts["Arabic Presentation Forms-A"](x)||ts["Arabic Presentation Forms-B"](x))));if(o.imageName){const e=n[o.imageName];if(!e)continue;k=o.imageName,t.iconsInText=t.iconsInText||!0,S=e.paddedRect;const r=e.displaySize;g=g*Rh/h,v={width:r[0],height:r[1],left:Ap,top:-wp,advance:T?r[1]:r[0],localGlyph:!1},M=m?-v.height*g:Mp+i*Rh-r[1]*g,I=v.advance;const s=(T?r[0]:r[1])*g-Rh*i;s>0&&s>w&&(w=s);}else {const t=r[o.fontStack];if(!t)continue;t[y]&&(S=t[y]);const n=e[o.fontStack];if(!n)continue;const s=n.glyphs[y];if(!s)continue;if(v=s.metrics,I=8203!==y?Rh:0,m){const t=void 0!==n.ascender?Math.abs(n.ascender):0,e=void 0!==n.descender?Math.abs(n.descender):0,r=(t+e)*g;_<r&&(_=r,A=(t-e)/2*g),M=-t*g;}else M=Mp+(i-g)*Rh;}T?(t.verticalizable=!0,b.push({glyph:y,imageName:k,x:p,y:d+M,vertical:T,scale:g,localGlyph:v.localGlyph,fontStack:o.fontStack,sectionIndex:f,metrics:v,rect:S}),p+=I*g+u):(b.push({glyph:y,imageName:k,x:p,y:d+M,vertical:T,scale:g,localGlyph:v.localGlyph,fontStack:o.fontStack,sectionIndex:f,metrics:v,rect:S}),p+=v.advance*g+u);}0!==b.length&&(f=Math.max(p-u,f),m?Up(b,y,w,A,s*i/2):Up(b,y,w,0,s/2)),p=0;const S=s*i+w;v.lineOffset=Math.max(w,o),d+=S,++g;}var x;const v=d,{horizontalAlign:b,verticalAlign:w}=Rp(a);((function(t,e,r,n,i,s){const a=(e-r)*i,o=-s*n;for(const e of t)for(const t of e.positionedGlyphs)t.x+=a,t.y+=o;}))(t.positionedLines,y,b,w,f,v),t.top+=-w*v,t.bottom=t.top+v,t.left+=-b*f,t.right=t.left+f,t.hasBaseline=m;}(w,e,r,n,m,a,o,l,h,u,p,f),!function(t){for(const e of t)if(0!==e.positionedGlyphs.length)return !1;return !0}(b)&&w}const Ep={9:!0,10:!0,11:!0,12:!0,13:!0,32:!0},Cp={10:!0,32:!0,38:!0,40:!0,41:!0,43:!0,45:!0,47:!0,173:!0,183:!0,8203:!0,8208:!0,8211:!0,8231:!0};function Pp(t,e,r,n,i,s){if(e.imageName){const t=n[e.imageName];return t?t.displaySize[0]*e.scale*Rh/s+i:0}{const n=r[e.fontStack],s=n&&n.glyphs[t];return s?s.metrics.advance*e.scale+i:0}}function Dp(t,e,r,n){const i=Math.pow(t-e,2);return n?t<e?i/2:2*i:i+Math.abs(r)*r}function Vp(t,e,r){let n=0;return 10===t&&(n-=1e4),r&&(n+=150),40!==t&&65288!==t||(n+=50),41!==e&&65289!==e||(n+=50),n}function Lp(t,e,r,n,i,s){let a=null,o=Dp(e,r,i,s);for(const t of n){const n=Dp(e-t.x,r,i,s)+t.badness;n<=o&&(a=t,o=n);}return {index:t,x:e,priorBreak:a,badness:o}}function Fp(t){return t?Fp(t.priorBreak).concat(t.index):[]}function Rp(t){let e=.5,r=.5;switch(t){case"right":case"top-right":case"bottom-right":e=1;break;case"left":case"top-left":case"bottom-left":e=0;}switch(t){case"bottom":case"bottom-right":case"bottom-left":r=1;break;case"top":case"top-right":case"top-left":r=0;}return {horizontalAlign:e,verticalAlign:r}}function Up(t,e,r,n,i){if(!(e||r||n||i))return;const s=t.length-1,a=t[s],o=(a.x+a.metrics.advance*a.scale)*e;for(let e=0;e<=s;e++)t[e].x-=o,t[e].y+=r+n+i;}function $p(t,e,r){const{horizontalAlign:n,verticalAlign:i}=Rp(r),s=e[0]-t.displaySize[0]*n,a=e[1]-t.displaySize[1]*i;return {image:t,top:a,bottom:a+t.displaySize[1],left:s,right:s+t.displaySize[0]}}function jp(t,e,r,n,i,s){const a=t.image;let o;if(a.content){const t=a.content,e=a.pixelRatio||1;o=[t[0]/e,t[1]/e,a.displaySize[0]-t[2]/e,a.displaySize[1]-t[3]/e];}const l=e.left*s,u=e.right*s;let c,h,p,d;"width"===r||"both"===r?(d=i[0]+l-n[3],h=i[0]+u+n[1]):(d=i[0]+(l+u-a.displaySize[0])/2,h=d+a.displaySize[0]);const f=e.top*s,y=e.bottom*s;return "height"===r||"both"===r?(c=i[1]+f-n[0],p=i[1]+y+n[2]):(c=i[1]+(f+y-a.displaySize[1])/2,p=c+a.displaySize[1]),{image:a,top:c,right:h,bottom:p,left:d,collisionPadding:o}}class Op extends x{constructor(t,e,r,n,i){super(t,e),this.angle=n,this.z=r,void 0!==i&&(this.segment=i);}clone(){return new Op(this.x,this.y,this.z,this.angle,this.segment)}}function qp(t,e,r,n,i){if(void 0===e.segment)return !0;let s=e,a=e.segment+1,o=0;for(;o>-r/2;){if(a--,a<0)return !1;o-=t[a].dist(s),s=t[a];}o+=t[a].dist(t[a+1]),a++;const l=[];let u=0;for(;o<r/2;){const e=t[a],r=t[a+1];if(!r)return !1;let s=t[a-1].angleTo(e)-e.angleTo(r);for(s=Math.abs((s+3*Math.PI)%(2*Math.PI)-Math.PI),l.push({distance:o,angleDelta:s}),u+=s;o-l[0].distance>n;)u-=l.shift().angleDelta;if(u>i)return !1;a++,o+=e.dist(r);}return !0}function Np(t){let e=0;for(let r=0;r<t.length-1;r++)e+=t[r].dist(t[r+1]);return e}function Gp(t,e,r){return t?.6*e*r:0}function Zp(t,e){return Math.max(t?t.right-t.left:0,e?e.right-e.left:0)}function Kp(t,e,r,n,i,s){const a=Gp(r,i,s),o=Zp(r,n)*s;let l=0;const u=Np(t)/2;for(let r=0;r<t.length-1;r++){const n=t[r],i=t[r+1],s=n.dist(i);if(l+s>u){const c=(u-l)/s,h=Er(n.x,i.x,c),p=Er(n.y,i.y,c),d=new Op(h,p,0,i.angleTo(n),r);return !a||qp(t,d,o,a,e)?d:void 0}l+=s;}}function Xp(t,e,r,n,i,s,a,o,l){const u=Gp(n,s,a),c=Zp(n,i),h=c*a,p=0===t[0].x||t[0].x===l||0===t[0].y||t[0].y===l;return e-h<e/4&&(e=h+e/4),Jp(t,p?e/2*o%e:(c/2+2*s)*a*o%e,e,u,r,h,p,!1,l)}function Jp(t,e,r,n,i,s,a,o,l){const u=s/2,c=Np(t);let h=0,p=e-r,d=[];for(let e=0;e<t.length-1;e++){const a=t[e],o=t[e+1],f=a.dist(o),y=o.angleTo(a);for(;p+r<h+f;){p+=r;const m=(p-h)/f,g=Er(a.x,o.x,m),x=Er(a.y,o.y,m);if(g>=0&&g<l&&x>=0&&x<l&&p-u>=0&&p+u<=c){const r=new Op(g,x,0,y,e);r._round(),n&&!qp(t,r,s,n,i)||d.push(r);}}h+=f;}return o||d.length||a||(d=Jp(t,h/2,r,n,i,s,a,!0,l)),d}function Hp(t,e,r,n,i){const s=[];for(let a=0;a<t.length;a++){const o=t[a];let l;for(let t=0;t<o.length-1;t++){let a=o[t],u=o[t+1];a.x<e&&u.x<e||(a.x<e?a=new x(e,a.y+(e-a.x)/(u.x-a.x)*(u.y-a.y))._round():u.x<e&&(u=new x(e,a.y+(e-a.x)/(u.x-a.x)*(u.y-a.y))._round()),a.y<r&&u.y<r||(a.y<r?a=new x(a.x+(r-a.y)/(u.y-a.y)*(u.x-a.x),r)._round():u.y<r&&(u=new x(a.x+(r-a.y)/(u.y-a.y)*(u.x-a.x),r)._round()),a.x>=n&&u.x>=n||(a.x>=n?a=new x(n,a.y+(n-a.x)/(u.x-a.x)*(u.y-a.y))._round():u.x>=n&&(u=new x(n,a.y+(n-a.x)/(u.x-a.x)*(u.y-a.y))._round()),a.y>=i&&u.y>=i||(a.y>=i?a=new x(a.x+(i-a.y)/(u.y-a.y)*(u.x-a.x),i)._round():u.y>=i&&(u=new x(a.x+(i-a.y)/(u.y-a.y)*(u.x-a.x),i)._round()),l&&a.equals(l[l.length-1])||(l=[a],s.push(l)),l.push(u)))));}}return s}Ji(Op,"Anchor");const Yp=1e20;function Wp(t,e,r,n,i,s,a,o,l){for(let u=e;u<e+n;u++)Qp(t,r*s+u,s,i,a,o,l);for(let u=r;u<r+i;u++)Qp(t,u*s+e,1,n,a,o,l);}function Qp(t,e,r,n,i,s,a){s[0]=0,a[0]=-Yp,a[1]=Yp,i[0]=t[e];for(let o=1,l=0,u=0;o<n;o++){i[o]=t[e+o*r];const n=o*o;do{const t=s[l];u=(i[o]-i[t]+n-t*t)/(o-t)/2;}while(u<=a[l]&&--l>-1);l++,s[l]=o,a[l]=u,a[l+1]=Yp;}for(let o=0,l=0;o<n;o++){for(;a[l+1]<o;)l++;const n=s[l],u=o-n;t[e+o*r]=i[n]+u*u;}}const td=2,ed={none:0,ideographs:1,all:2};class rd{constructor(t,e,r){this.requestManager=t,this.localGlyphMode=e,this.localFontFamily=r,this.entries={},this.localGlyphs={200:{},400:{},500:{},900:{}};}setURL(t){this.url=t;}getGlyphs(t,e){const r=[];for(const e in t)for(const n of t[e])r.push({stack:e,id:n});B(r,(({stack:t,id:e},r)=>{let n=this.entries[t];n||(n=this.entries[t]={glyphs:{},requests:{},ranges:{},ascender:void 0,descender:void 0});let i=n.glyphs[e];if(void 0!==i)return void r(null,{stack:t,id:e,glyph:i});if(i=this._tinySDF(n,t,e),i)return n.glyphs[e]=i,void r(null,{stack:t,id:e,glyph:i});const s=Math.floor(e/256);if(256*s>65535)return void r(new Error("glyphs > 65535 not supported"));if(n.ranges[s])return void r(null,{stack:t,id:e,glyph:i});let a=n.requests[s];a||(a=n.requests[s]=[],rd.loadGlyphRange(t,s,this.url,this.requestManager,((t,e)=>{if(e){n.ascender=e.ascender,n.descender=e.descender;for(const t in e.glyphs)this._doesCharSupportLocalGlyph(+t)||(n.glyphs[+t]=e.glyphs[+t]);n.ranges[s]=!0;}for(const r of a)r(t,e);delete n.requests[s];}))),a.push(((n,i)=>{n?r(n):i&&r(null,{stack:t,id:e,glyph:i.glyphs[e]||null});}));}),((t,r)=>{if(t)e(t);else if(r){const t={};for(const{stack:e,id:n,glyph:i}of r)void 0===t[e]&&(t[e]={}),void 0===t[e].glyphs&&(t[e].glyphs={}),t[e].glyphs[n]=i&&{id:i.id,bitmap:i.bitmap.clone(),metrics:i.metrics},t[e].ascender=this.entries[e].ascender,t[e].descender=this.entries[e].descender;e(null,t);}}));}_doesCharSupportLocalGlyph(t){return this.localGlyphMode!==ed.none&&(this.localGlyphMode===ed.all?!!this.localFontFamily:!!this.localFontFamily&&(ts["CJK Unified Ideographs"](t)||ts["Hangul Syllables"](t)||ts.Hiragana(t)||ts.Katakana(t)||ts["CJK Symbols and Punctuation"](t)))}_tinySDF(t,e,r){const n=this.localFontFamily;if(!n||!this._doesCharSupportLocalGlyph(r))return;let i=t.tinySDF;if(!i){let r="400";/bold/i.test(e)?r="900":/medium/i.test(e)?r="500":/light/i.test(e)&&(r="200"),i=t.tinySDF=new rd.TinySDF({fontFamily:n,fontWeight:r,fontSize:24*td,buffer:3*td,radius:8*td}),i.fontWeight=r;}if(this.localGlyphs[i.fontWeight][r])return this.localGlyphs[i.fontWeight][r];const s=String.fromCharCode(r),{data:a,width:o,height:l,glyphWidth:u,glyphHeight:c,glyphLeft:h,glyphTop:p,glyphAdvance:d}=i.draw(s);return this.localGlyphs[i.fontWeight][r]={id:r,bitmap:new Ru({width:o,height:l},a),metrics:{width:u/td,height:c/td,left:h/td,top:p/td-27,advance:d/td,localGlyph:!0}}}}rd.loadGlyphRange=function(t,e,r,n,i){const s=256*e,a=s+255,o=n.transformRequest(n.normalizeGlyphsURL(r).replace("{fontstack}",t).replace("{range}",`${s}-${a}`),lt.Glyphs);pt(o,((t,e)=>{if(t)i(t);else if(e){const t={},r=function(t){return new mp(t).readFields(xp,{})}(e);for(const e of r.glyphs)t[e.id]=e;i(null,{glyphs:t,ascender:r.ascender,descender:r.descender});}}));},rd.TinySDF=class{constructor({fontSize:t=24,buffer:e=3,radius:r=8,cutoff:n=.25,fontFamily:i="sans-serif",fontWeight:s="normal",fontStyle:a="normal"}={}){this.buffer=e,this.cutoff=n,this.radius=r;const o=this.size=t+4*e,l=this._createCanvas(o),u=this.ctx=l.getContext("2d",{willReadFrequently:!0});u.font=`${a} ${s} ${t}px ${i}`,u.textBaseline="alphabetic",u.textAlign="left",u.fillStyle="black",this.gridOuter=new Float64Array(o*o),this.gridInner=new Float64Array(o*o),this.f=new Float64Array(o),this.z=new Float64Array(o+1),this.v=new Uint16Array(o);}_createCanvas(t){const e=document.createElement("canvas");return e.width=e.height=t,e}draw(t){const{width:e,actualBoundingBoxAscent:r,actualBoundingBoxDescent:n,actualBoundingBoxLeft:i,actualBoundingBoxRight:s}=this.ctx.measureText(t),a=Math.ceil(r),o=Math.max(0,Math.min(this.size-this.buffer,Math.ceil(s-i))),l=Math.min(this.size-this.buffer,a+Math.ceil(n)),u=o+2*this.buffer,c=l+2*this.buffer,h=Math.max(u*c,0),p=new Uint8ClampedArray(h),d={data:p,width:u,height:c,glyphWidth:o,glyphHeight:l,glyphTop:a,glyphLeft:0,glyphAdvance:e};if(0===o||0===l)return d;const{ctx:f,buffer:y,gridInner:m,gridOuter:g}=this;f.clearRect(y,y,o,l),f.fillText(t,y,y+a);const x=f.getImageData(y,y,o,l);g.fill(Yp,0,h),m.fill(0,0,h);for(let t=0;t<l;t++)for(let e=0;e<o;e++){const r=x.data[4*(t*o+e)+3]/255;if(0===r)continue;const n=(t+y)*u+e+y;if(1===r)g[n]=0,m[n]=Yp;else {const t=.5-r;g[n]=t>0?t*t:0,m[n]=t<0?t*t:0;}}Wp(g,0,0,u,c,u,this.f,this.v,this.z),Wp(m,y,y,o,l,u,this.f,this.v,this.z);for(let t=0;t<h;t++){const e=Math.sqrt(g[t])-Math.sqrt(m[t]);p[t]=Math.round(255-255*(e/this.radius+this.cutoff));}return d}};const nd=Ap;function id(t,e,r,n){const i=[],s=t.image,a=s.pixelRatio,o=s.paddedRect.w-2*nd,l=s.paddedRect.h-2*nd,u=t.right-t.left,c=t.bottom-t.top,h=s.stretchX||[[0,o]],p=s.stretchY||[[0,l]],d=(t,e)=>t+e[1]-e[0],f=h.reduce(d,0),y=p.reduce(d,0),m=o-f,g=l-y;let v=0,b=f,w=0,_=y,A=0,S=m,k=0,I=g;if(s.content&&n){const t=s.content;v=sd(h,0,t[0]),w=sd(p,0,t[1]),b=sd(h,t[0],t[2]),_=sd(p,t[1],t[3]),A=t[0]-v,k=t[1]-w,S=t[2]-t[0]-b,I=t[3]-t[1]-_;}const M=(n,i,o,l)=>{const h=od(n.stretch-v,b,u,t.left),p=ld(n.fixed-A,S,n.stretch,f),d=od(i.stretch-w,_,c,t.top),m=ld(i.fixed-k,I,i.stretch,y),g=od(o.stretch-v,b,u,t.left),M=ld(o.fixed-A,S,o.stretch,f),T=od(l.stretch-w,_,c,t.top),z=ld(l.fixed-k,I,l.stretch,y),B=new x(h,d),E=new x(g,d),C=new x(g,T),P=new x(h,T),D=new x(p/a,m/a),V=new x(M/a,z/a),L=e*Math.PI/180;if(L){const t=Math.sin(L),e=Math.cos(L),r=[e,-t,t,e];B._matMult(r),E._matMult(r),P._matMult(r),C._matMult(r);}const F=n.stretch+n.fixed,R=i.stretch+i.fixed;return {tl:B,tr:E,bl:P,br:C,tex:{x:s.paddedRect.x+nd+F,y:s.paddedRect.y+nd+R,w:o.stretch+o.fixed-F,h:l.stretch+l.fixed-R},writingMode:void 0,glyphOffset:[0,0],sectionIndex:0,pixelOffsetTL:D,pixelOffsetBR:V,minFontScaleX:S/a/u,minFontScaleY:I/a/c,isSDF:r}};if(n&&(s.stretchX||s.stretchY)){const t=ad(h,m,f),e=ad(p,g,y);for(let r=0;r<t.length-1;r++){const n=t[r],s=t[r+1];for(let t=0;t<e.length-1;t++)i.push(M(n,e[t],s,e[t+1]));}}else i.push(M({fixed:0,stretch:-1},{fixed:0,stretch:-1},{fixed:0,stretch:o+1},{fixed:0,stretch:l+1}));return i}function sd(t,e,r){let n=0;for(const i of t)n+=Math.max(e,Math.min(r,i[1]))-Math.max(e,Math.min(r,i[0]));return n}function ad(t,e,r){const n=[{fixed:-nd,stretch:0}];for(const[e,r]of t){const t=n[n.length-1];n.push({fixed:e-t.stretch,stretch:t.stretch}),n.push({fixed:e-t.stretch,stretch:t.stretch+(r-e)});}return n.push({fixed:e+nd,stretch:r}),n}function od(t,e,r,n){return t/e*r+n}function ld(t,e,r,n){return t-e*r/n}function ud(t,e,r,n){const i=e+t.positionedLines[n].lineOffset;return 0===n?r+i/2:r+(i+(e+t.positionedLines[n-1].lineOffset))/2}class cd{constructor(t=[],e=hd){if(this.data=t,this.length=this.data.length,this.compare=e,this.length>0)for(let t=(this.length>>1)-1;t>=0;t--)this._down(t);}push(t){this.data.push(t),this.length++,this._up(this.length-1);}pop(){if(0===this.length)return;const t=this.data[0],e=this.data.pop();return this.length--,this.length>0&&(this.data[0]=e,this._down(0)),t}peek(){return this.data[0]}_up(t){const{data:e,compare:r}=this,n=e[t];for(;t>0;){const i=t-1>>1,s=e[i];if(r(n,s)>=0)break;e[t]=s,t=i;}e[t]=n;}_down(t){const{data:e,compare:r}=this,n=this.length>>1,i=e[t];for(;t<n;){let n=1+(t<<1),s=e[n];const a=n+1;if(a<this.length&&r(e[a],s)<0&&(n=a,s=e[a]),r(s,i)>=0)break;e[t]=s,t=n;}e[t]=i;}}function hd(t,e){return t<e?-1:t>e?1:0}function pd(t,e=1,r=!1){let n=1/0,i=1/0,s=-1/0,a=-1/0;const o=t[0];for(let t=0;t<o.length;t++){const e=o[t];(!t||e.x<n)&&(n=e.x),(!t||e.y<i)&&(i=e.y),(!t||e.x>s)&&(s=e.x),(!t||e.y>a)&&(a=e.y);}const l=Math.min(s-n,a-i);let u=l/2;const c=new cd([],dd);if(0===l)return new x(n,i);for(let e=n;e<s;e+=l)for(let r=i;r<a;r+=l)c.push(new fd(e+u,r+u,u,t));let h=function(t){let e=0,r=0,n=0;const i=t[0];for(let t=0,s=i.length,a=s-1;t<s;a=t++){const s=i[t],o=i[a],l=s.x*o.y-o.x*s.y;r+=(s.x+o.x)*l,n+=(s.y+o.y)*l,e+=3*l;}return new fd(r/e,n/e,0,t)}(t),p=c.length;for(;c.length;){const n=c.pop();(n.d>h.d||!h.d)&&(h=n,r&&console.log("found best %d after %d probes",Math.round(1e4*n.d)/1e4,p)),n.max-h.d<=e||(u=n.h/2,c.push(new fd(n.p.x-u,n.p.y-u,u,t)),c.push(new fd(n.p.x+u,n.p.y-u,u,t)),c.push(new fd(n.p.x-u,n.p.y+u,u,t)),c.push(new fd(n.p.x+u,n.p.y+u,u,t)),p+=4);}return r&&(console.log(`num probes: ${p}`),console.log(`best distance: ${h.d}`)),h.p}function dd(t,e){return e.max-t.max}class fd{constructor(t,e,r,n){this.p=new x(t,e),this.h=r,this.d=function(t,e){let r=!1,n=1/0;for(let i=0;i<e.length;i++){const s=e[i];for(let e=0,i=s.length,a=i-1;e<i;a=e++){const i=s[e],o=s[a];i.y>t.y!=o.y>t.y&&t.x<(o.x-i.x)*(t.y-i.y)/(o.y-i.y)+i.x&&(r=!r),n=Math.min(n,xu(t,i,o));}}return (r?1:-1)*Math.sqrt(n)}(this.p,n),this.max=this.d+this.h*Math.SQRT2;}}const yd=7,md=Number.POSITIVE_INFINITY,gd=Math.sqrt(2);function xd(t,[e,r]){let n=0,i=0;if(r===md){e<0&&(e=0);const r=e/gd;switch(t){case"top-right":case"top-left":i=r-yd;break;case"bottom-right":case"bottom-left":i=-r+yd;break;case"bottom":i=-e+yd;break;case"top":i=e-yd;}switch(t){case"top-right":case"bottom-right":n=-r;break;case"top-left":case"bottom-left":n=r;break;case"left":n=e;break;case"right":n=-e;}}else {switch(e=Math.abs(e),r=Math.abs(r),t){case"top-right":case"top-left":case"top":i=r-yd;break;case"bottom-right":case"bottom-left":case"bottom":i=-r+yd;}switch(t){case"top-right":case"bottom-right":case"right":n=-e;break;case"top-left":case"bottom-left":case"left":n=e;}}return [n,i]}function vd(t,e,r,n,i,s,a,o,l,u){t.createArrays(),t.tilePixelRatio=ao/(512*t.overscaling),t.compareText={},t.iconsNeedLinear=!1;const c=t.layers[0].layout,h=t.layers[0]._unevaluatedLayout._values,p={};if("composite"===t.textSizeData.kind){const{minZoom:e,maxZoom:r}=t.textSizeData;p.compositeTextSizes=[h["text-size"].possiblyEvaluate(new ws(e),o),h["text-size"].possiblyEvaluate(new ws(r),o)];}if("composite"===t.iconSizeData.kind){const{minZoom:e,maxZoom:r}=t.iconSizeData;p.compositeIconSizes=[h["icon-size"].possiblyEvaluate(new ws(e),o),h["icon-size"].possiblyEvaluate(new ws(r),o)];}p.layoutTextSize=h["text-size"].possiblyEvaluate(new ws(l+1),o),p.layoutIconSize=h["icon-size"].possiblyEvaluate(new ws(l+1),o),p.textMaxSize=h["text-size"].possiblyEvaluate(new ws(18),o);const d="map"===c.get("text-rotation-alignment")&&"point"!==c.get("symbol-placement"),f=c.get("text-size");for(const s of t.features){const l=c.get("text-font").evaluate(s,{},o).join(","),h=f.evaluate(s,{},o),y=p.layoutTextSize.evaluate(s,{},o),m=(p.layoutIconSize.evaluate(s,{},o),{horizontal:{},vertical:void 0}),g=s.text;let x,v=[0,0];if(g){const n=g.toString(),a=c.get("text-letter-spacing").evaluate(s,{},o)*Rh,u=c.get("text-line-height").evaluate(s,{},o)*Rh,p=rs(n)?a:0,f=c.get("text-anchor").evaluate(s,{},o),x=c.get("text-variable-anchor");if(!x){const t=c.get("text-radial-offset").evaluate(s,{},o);v=t?xd(f,[t*Rh,md]):c.get("text-offset").evaluate(s,{},o).map((t=>t*Rh));}let b=d?"center":c.get("text-justify").evaluate(s,{},o);const w="point"===c.get("symbol-placement"),_=w?c.get("text-max-width").evaluate(s,{},o)*Rh:1/0,A=s=>{t.allowVerticalPlacement&&es(n)&&(m.vertical=Bp(g,e,r,i,l,_,u,f,s,p,v,Ip.vertical,!0,y,h));};if(!d&&x){const t="auto"===b?x.map((t=>bd(t))):[b];let n=!1;for(let s=0;s<t.length;s++){const a=t[s];if(!m.horizontal[a])if(n)m.horizontal[a]=m.horizontal[0];else {const t=Bp(g,e,r,i,l,_,u,"center",a,p,v,Ip.horizontal,!1,y,h);t&&(m.horizontal[a]=t,n=1===t.positionedLines.length);}}A("left");}else {if("auto"===b&&(b=bd(f)),w||c.get("text-writing-mode").indexOf("horizontal")>=0||!es(n)){const t=Bp(g,e,r,i,l,_,u,f,b,p,v,Ip.horizontal,!1,y,h);t&&(m.horizontal[b]=t);}A(w?"left":b);}}let b=!1;if(s.icon&&s.icon.name){const e=n[s.icon.name];e&&(x=$p(i[s.icon.name],c.get("icon-offset").evaluate(s,{},o),c.get("icon-anchor").evaluate(s,{},o)),b=e.sdf,void 0===t.sdfIcons?t.sdfIcons=e.sdf:t.sdfIcons!==e.sdf&&N("Style sheet warning: Cannot mix SDF and non-SDF icons in one buffer"),(e.pixelRatio!==t.pixelRatio||0!==c.get("icon-rotate").constantOr(1))&&(t.iconsNeedLinear=!0));}const w=kd(m.horizontal)||m.vertical;t.iconsInText||(t.iconsInText=!!w&&w.iconsInText),(w||x)&&wd(t,s,m,x,n,p,y,0,v,b,a,o,u);}s&&t.generateCollisionDebugBuffers(l,t.collisionBoxArray);}function bd(t){switch(t){case"right":case"top-right":case"bottom-right":return "right";case"left":case"top-left":case"bottom-left":return "left"}return "center"}function wd(t,e,r,n,i,s,a,o,l,u,c,h,p){let d=s.textMaxSize.evaluate(e,{},h);void 0===d&&(d=a);const f=t.layers[0].layout,y=f.get("icon-offset").evaluate(e,{},h),m=kd(r.horizontal)||r.vertical,g="globe"===p.name,x=Rh,v=a/x,b=t.tilePixelRatio*d/x,_=(B=t.overscaling,t.zoom>18&&B>2&&(B>>=1),Math.max(ao/(512*B),1)*f.get("symbol-spacing")),A=f.get("text-padding")*t.tilePixelRatio,S=f.get("icon-padding")*t.tilePixelRatio,k=w(f.get("text-max-angle")),I="map"===f.get("text-rotation-alignment")&&"point"!==f.get("symbol-placement"),M="map"===f.get("icon-rotation-alignment")&&"point"!==f.get("symbol-placement"),T=f.get("symbol-placement"),z=_/2;var B;const E=f.get("icon-text-fit");let C;n&&"none"!==E&&(t.allowVerticalPlacement&&r.vertical&&(C=jp(n,r.vertical,E,f.get("icon-text-fit-padding"),y,v)),m&&(n=jp(n,m,E,f.get("icon-text-fit-padding"),y,v)));const P=(a,o,d)=>{if(o.x<0||o.x>=ao||o.y<0||o.y>=ao)return;let f=null;if(g){const{x:t,y:e,z:r}=p.projectTilePoint(o.x,o.y,d);f={anchor:new Op(t,e,r,0,void 0),up:p.upVector(d,o.x,o.y)};}!function(t,e,r,n,i,s,a,o,l,u,c,h,p,d,f,y,m,g,x,v,b,w,_,A,S){const k=t.addToLineVertexArray(e,n);let I,M,T,z,B,E,C,P=0,D=0,V=0,L=0,F=-1,R=-1;const U={};let $=Ba("");const j=r?r.anchor:e;let O=0,q=0;if(void 0===l._unevaluatedLayout.getValue("text-radial-offset")?[O,q]=l.layout.get("text-offset").evaluate(b,{},S).map((t=>t*Rh)):(O=l.layout.get("text-radial-offset").evaluate(b,{},S)*Rh,q=md),t.allowVerticalPlacement&&i.vertical){const t=i.vertical;if(f)E=Md(t),o&&(C=Md(o));else {const r=l.layout.get("text-rotate").evaluate(b,{},S)+90;T=Id(u,j,e,c,h,p,t,d,r,y),o&&(z=Id(u,j,e,c,h,p,o,g,r));}}if(s){const n=l.layout.get("icon-rotate").evaluate(b,{},S),i="none"!==l.layout.get("icon-text-fit"),a=id(s,n,_,i),d=o?id(o,n,_,i):void 0;M=Id(u,j,e,c,h,p,s,g,n),P=4*a.length;const f=t.iconSizeData;let y=null;"source"===f.kind?(y=[Uh*l.layout.get("icon-size").evaluate(b,{},S)],y[0]>Ad&&N(`${t.layerIds[0]}: Value for "icon-size" is >= ${_d}. Reduce your "icon-size".`)):"composite"===f.kind&&(y=[Uh*w.compositeIconSizes[0].evaluate(b,{},S),Uh*w.compositeIconSizes[1].evaluate(b,{},S)],(y[0]>Ad||y[1]>Ad)&&N(`${t.layerIds[0]}: Value for "icon-size" is >= ${_d}. Reduce your "icon-size".`)),t.addSymbols(t.icon,a,y,v,x,b,!1,r,e,k.lineStartIndex,k.lineLength,-1,A,S),F=t.icon.placedSymbolArray.length-1,d&&(D=4*d.length,t.addSymbols(t.icon,d,y,v,x,b,Ip.vertical,r,e,k.lineStartIndex,k.lineLength,-1,A,S),R=t.icon.placedSymbolArray.length-1);}for(const n in i.horizontal){const s=i.horizontal[n];I||($=Ba(s.text),f?B=Md(s):I=Id(u,j,e,c,h,p,s,d,l.layout.get("text-rotate").evaluate(b,{},S),y));const o=1===s.positionedLines.length;if(V+=Sd(t,r,e,s,a,l,f,b,y,k,i.vertical?Ip.horizontal:Ip.horizontalOnly,o?Object.keys(i.horizontal):[n],U,F,w,A,S),o)break}i.vertical&&(L+=Sd(t,r,e,i.vertical,a,l,f,b,y,k,Ip.vertical,["vertical"],U,R,w,A,S));let G=-1;const Z=(t,e)=>t?Math.max(t,e):e;G=Z(B,G),G=Z(E,G),G=Z(C,G);const K=G>-1?1:0;t.glyphOffsetArray.length>=of.MAX_GLYPHS&&N("Too many glyphs being rendered in a tile. See https://github.com/mapbox/mapbox-gl-js/issues/2907"),void 0!==b.sortKey&&t.addToSortKeyRanges(t.symbolInstances.length,b.sortKey),t.symbolInstances.emplaceBack(j.x,j.y,j.z,e.x,e.y,U.right>=0?U.right:-1,U.center>=0?U.center:-1,U.left>=0?U.left:-1,U.vertical>=0?U.vertical:-1,F,R,$,void 0!==I?I:t.collisionBoxArray.length,void 0!==I?I+1:t.collisionBoxArray.length,void 0!==T?T:t.collisionBoxArray.length,void 0!==T?T+1:t.collisionBoxArray.length,void 0!==M?M:t.collisionBoxArray.length,void 0!==M?M+1:t.collisionBoxArray.length,z||t.collisionBoxArray.length,z?z+1:t.collisionBoxArray.length,c,V,L,P,D,K,0,O,q,G);}(t,o,f,a,r,n,i,C,t.layers[0],t.collisionBoxArray,e.index,e.sourceLayerIndex,t.index,A,I,l,0,S,M,y,e,s,u,c,h);};if("line"===T)for(const i of Hp(e.geometry,0,0,ao,ao)){const e=Xp(i,_,k,r.vertical||m,n,x,b,t.overscaling,ao);for(const r of e)m&&Td(t,m.text,z,r)||P(i,r,h);}else if("line-center"===T){for(const t of e.geometry)if(t.length>1){const e=Kp(t,k,r.vertical||m,n,x,b);e&&P(t,e,h);}}else if("Polygon"===e.type)for(const t of Ac(e.geometry,0)){const e=pd(t,16);P(t[0],new Op(e.x,e.y,0,0,void 0),h);}else if("LineString"===e.type)for(const t of e.geometry)P(t,new Op(t[0].x,t[0].y,0,0,void 0),h);else if("Point"===e.type)for(const t of e.geometry)for(const e of t)P([e],new Op(e.x,e.y,0,0,void 0),h);}const _d=255,Ad=_d*Uh;function Sd(t,e,r,n,i,s,a,o,l,u,c,h,p,d,f,y,m){const g=function(t,e,r,n,i,s,a,o){const l=[];if(0===e.positionedLines.length)return l;const u=n.layout.get("text-rotate").evaluate(s,{})*Math.PI/180,c=function(t){const e=t[0],r=t[1],n=e*r;return n>0?[e,-r]:n<0?[-e,r]:0===e?[r,e]:[r,-e]}(r);let h=Math.abs(e.top-e.bottom);for(const t of e.positionedLines)h-=t.lineOffset;const p=e.positionedLines.length,d=h/p;let f=e.top-r[1];for(let t=0;t<p;++t){const n=e.positionedLines[t];f=ud(e,d,f,t);for(const t of n.positionedGlyphs){if(!t.rect)continue;const n=t.rect||{};let s=wp+1,h=!0,p=1,d=0;if(t.imageName){const e=a[t.imageName];if(!e)continue;if(e.sdf){N("SDF images are not supported in formatted text and will be ignored.");continue}h=!1,p=e.pixelRatio,s=Ap/p;}const y=(i||o)&&t.vertical,m=t.metrics.advance*t.scale/2,g=t.metrics,v=t.rect;if(null===v)continue;o&&e.verticalizable&&(d=t.imageName?m-t.metrics.width*t.scale/2:0);const b=i?[t.x+m,t.y]:[0,0];let w=[0,0],_=[0,0],A=!1;i||(y?(_=[t.x+m+c[0],t.y+c[1]-d],A=!0):w=[t.x+m+r[0],t.y+r[1]-d]);const S=v.w*t.scale/(p*(t.localGlyph?td:1)),k=v.h*t.scale/(p*(t.localGlyph?td:1));let I,M,T,z;if(y){const e=t.y-f,r=new x(-m,m-e),n=-Math.PI/2,i=new x(..._);I=new x(-m+w[0],w[1]),I._rotateAround(n,r)._add(i),I.x+=-e+m,I.y-=(g.left-s)*t.scale;const a=t.imageName?g.advance*t.scale:Rh*t.scale,o=String.fromCharCode(t.glyph);Zh(o)?I.x+=(1-s)*t.scale:Kh(o)?I.x+=a-g.height*t.scale+(-s-1)*t.scale:I.x+=t.imageName||g.width+2*s===v.w&&g.height+2*s===v.h?(a-k)/2:(a-(g.height+2*s)*t.scale)/2,M=new x(I.x,I.y-S),T=new x(I.x+k,I.y),z=new x(I.x+k,I.y-S);}else {const e=(g.left-s)*t.scale-m+w[0],r=(-g.top-s)*t.scale+w[1],n=e+S,i=r+k;I=new x(e,r),M=new x(n,r),T=new x(e,i),z=new x(n,i);}if(u){let t;t=i?new x(0,0):A?new x(c[0],c[1]):new x(r[0],r[1]),I._rotateAround(u,t),M._rotateAround(u,t),T._rotateAround(u,t),z._rotateAround(u,t);}const B=new x(0,0),E=new x(0,0);l.push({tl:I,tr:M,bl:T,br:z,tex:n,writingMode:e.writingMode,glyphOffset:b,sectionIndex:t.sectionIndex,isSDF:h,pixelOffsetTL:B,pixelOffsetBR:E,minFontScaleX:0,minFontScaleY:0});}}return l}(0,n,l,s,a,o,i,t.allowVerticalPlacement),v=t.textSizeData;let b=null;"source"===v.kind?(b=[Uh*s.layout.get("text-size").evaluate(o,{},m)],b[0]>Ad&&N(`${t.layerIds[0]}: Value for "text-size" is >= ${_d}. Reduce your "text-size".`)):"composite"===v.kind&&(b=[Uh*f.compositeTextSizes[0].evaluate(o,{},m),Uh*f.compositeTextSizes[1].evaluate(o,{},m)],(b[0]>Ad||b[1]>Ad)&&N(`${t.layerIds[0]}: Value for "text-size" is >= ${_d}. Reduce your "text-size".`)),t.addSymbols(t.text,g,b,l,a,o,c,e,r,u.lineStartIndex,u.lineLength,d,y,m);for(const e of h)p[e]=t.text.placedSymbolArray.length-1;return 4*g.length}function kd(t){for(const e in t)return t[e];return null}function Id(t,e,r,n,i,s,a,o,l,u){let c=a.top,h=a.bottom,p=a.left,d=a.right;const f=a.collisionPadding;if(f&&(p-=f[0],c-=f[1],d+=f[2],h+=f[3]),l){const t=new x(p,c),e=new x(d,c),r=new x(p,h),n=new x(d,h),i=w(l);let s=new x(0,0);u&&(s=new x(u[0],u[1])),t._rotateAround(i,s),e._rotateAround(i,s),r._rotateAround(i,s),n._rotateAround(i,s),p=Math.min(t.x,e.x,r.x,n.x),d=Math.max(t.x,e.x,r.x,n.x),c=Math.min(t.y,e.y,r.y,n.y),h=Math.max(t.y,e.y,r.y,n.y);}return t.emplaceBack(e.x,e.y,e.z,r.x,r.y,p,c,d,h,o,n,i,s),t.length-1}function Md(t){t.collisionPadding&&(t.top-=t.collisionPadding[1],t.bottom+=t.collisionPadding[3]);const e=t.bottom-t.top;return e>0?Math.max(10,e):null}function Td(t,e,r,n){const i=t.compareText;if(e in i){const t=i[e];for(let e=t.length-1;e>=0;e--)if(n.dist(t[e])<r)return !0}else i[e]=[];return i[e].push(n),!1}function zd(t,e){const r=t.fovAboveCenter,n=t.elevation?t.elevation.getMinElevationBelowMSL()*e:0,i=(t._camera.position[2]*t.worldSize-n)/Math.cos(t._pitch),s=Math.sin(r)*i/Math.sin(Math.max(Math.PI/2-t._pitch-r,.01)),a=Math.sin(t._pitch)*s+i;return Math.min(1.01*a,i*(1/t._horizonShift))}function Bd(t,e){if(!e.isReprojectedInTileSpace)return {scale:1<<t.z,x:t.x,y:t.y,x2:t.x+1,y2:t.y+1,projection:e};const r=Math.pow(2,-t.z),n=t.x*r,i=(t.x+1)*r,s=t.y*r,a=(t.y+1)*r,o=Kl(n),l=Kl(i),u=Xl(s),c=Xl(a),h=e.project(o,u),p=e.project(l,u),d=e.project(l,c),f=e.project(o,c);let y=Math.min(h.x,p.x,d.x,f.x),m=Math.min(h.y,p.y,d.y,f.y),g=Math.max(h.x,p.x,d.x,f.x),x=Math.max(h.y,p.y,d.y,f.y);const v=r/16;function b(t,r,n,i,s,a){const o=(n+s)/2,l=(i+a)/2,u=e.project(Kl(o),Xl(l)),c=Math.max(0,y-u.x,m-u.y,u.x-g,u.y-x);y=Math.min(y,u.x),g=Math.max(g,u.x),m=Math.min(m,u.y),x=Math.max(x,u.y),c>v&&(b(t,u,n,i,o,l),b(u,r,o,l,s,a));}b(h,p,n,s,i,s),b(p,d,i,s,i,a),b(d,f,i,a,n,a),b(f,h,n,a,n,s),y-=v,m-=v,g+=v,x+=v;const w=1/Math.max(g-y,x-m);return {scale:w,x:y*w,y:m*w,x2:g*w,y2:x*w,projection:e}}const Ed=po(new Float32Array(16));class Cd{constructor(t){this.spec=t,this.name=t.name,this.wrap=!1,this.requiresDraping=!1,this.supportsWorldCopies=!1,this.supportsTerrain=!1,this.supportsFog=!1,this.supportsFreeCamera=!1,this.zAxisUnit="meters",this.isReprojectedInTileSpace=!0,this.unsupportedLayers=["custom"],this.center=[0,0],this.range=[3.5,7];}project(t,e){return {x:0,y:0,z:0}}unproject(t,e){return new Ol(0,0)}projectTilePoint(t,e,r){return {x:t,y:e,z:0}}locationPoint(t,e,r=!0){return t._coordinatePoint(t.locationCoordinate(e),r)}pixelsPerMeter(t,e){return Zl(1,t)*e}pixelSpaceConversion(t,e,r){return 1}farthestPixelDistance(t){return zd(t,t.pixelsPerMeter)}pointCoordinate(t,e,r,n){const i=t.horizonLineFromTop(!1),s=new x(e,Math.max(i,r));return t.rayIntersectionCoordinate(t.pointRayIntersection(s,n))}pointCoordinate3D(t,e,r){const n=new x(e,r);if(t.elevation)return t.elevation.pointCoordinate(n);{const e=this.pointCoordinate(t,n.x,n.y,0);return [e.x,e.y,e.z]}}isPointAboveHorizon(t,e){if(t.elevation)return !this.pointCoordinate3D(t,e.x,e.y);const r=t.horizonLineFromTop();return e.y<r}createInversionMatrix(t,e){return Ed}createTileMatrix(t,e,r){let n,i,s;const a=r.canonical,o=po(new Float64Array(16));if(this.isReprojectedInTileSpace){const l=Bd(a,this);n=1,i=l.x+r.wrap*l.scale,s=l.y,go(o,o,[n/l.scale,n/l.scale,t.pixelsPerMeter/e]);}else n=e/t.zoomScale(a.z),i=(a.x+Math.pow(2,a.z)*r.wrap)*n,s=a.y*n;return mo(o,o,[i,s,0]),go(o,o,[n/ao,n/ao,1]),o}upVector(t,e,r){return [0,0,1]}upVectorScale(t,e,r){return {metersToTile:1}}}class Pd extends Cd{constructor(t){super(t),this.range=[4,7],this.center=t.center||[-96,37.5];const[e,r]=this.parallels=t.parallels||[29.5,45.5],n=Math.sin(w(e));this.n=(n+Math.sin(w(r)))/2,this.c=1+n*(2*this.n-n),this.r0=Math.sqrt(this.c)/this.n;}project(t,e){const{n:r,c:n,r0:i}=this,s=w(t-this.center[0]),a=w(e),o=Math.sqrt(n-2*r*Math.sin(a))/r;return {x:o*Math.sin(s*r),y:o*Math.cos(s*r)-i,z:0}}unproject(t,e){const{n:r,c:n,r0:i}=this,s=i+e;let a=Math.atan2(t,Math.abs(s))*Math.sign(s);s*r<0&&(a-=Math.PI*Math.sign(t)*Math.sign(s));const o=w(this.center[0])*r;a=z(a,-Math.PI-o,Math.PI-o);const l=M(_(a/r)+this.center[0],-180,180),u=Math.asin(M((n-(t*t+s*s)*r*r)/(2*r),-1,1)),c=M(_(u),-Hl,Hl);return new Ol(l,c)}}const Dd=1.340264,Vd=-.081106,Ld=893e-6,Fd=.003796,Rd=Math.sqrt(3)/2;class Ud extends Cd{project(t,e){e=e/180*Math.PI,t=t/180*Math.PI;const r=Math.asin(Rd*Math.sin(e)),n=r*r,i=n*n*n;return {x:.5*(t*Math.cos(r)/(Rd*(Dd+3*Vd*n+i*(7*Ld+9*Fd*n)))/Math.PI+.5),y:1-.5*(r*(Dd+Vd*n+i*(Ld+Fd*n))/Math.PI+1),z:0}}unproject(t,e){t=(2*t-.5)*Math.PI;let r=e=(2*(1-e)-1)*Math.PI,n=r*r,i=n*n*n;for(let t,s,a,o=0;o<12&&(s=r*(Dd+Vd*n+i*(Ld+Fd*n))-e,a=Dd+3*Vd*n+i*(7*Ld+9*Fd*n),t=s/a,r=M(r-t,-Math.PI/3,Math.PI/3),n=r*r,i=n*n*n,!(Math.abs(t)<1e-12));++o);const s=Rd*t*(Dd+3*Vd*n+i*(7*Ld+9*Fd*n))/Math.cos(r),a=Math.asin(Math.sin(r)/Rd),o=M(180*s/Math.PI,-180,180),l=M(180*a/Math.PI,-Hl,Hl);return new Ol(o,l)}}class $d extends Cd{constructor(t){super(t),this.wrap=!0,this.supportsWorldCopies=!0;}project(t,e){return {x:.5+t/360,y:.5-e/360,z:0}}unproject(t,e){const r=360*(t-.5),n=M(360*(.5-e),-Hl,Hl);return new Ol(r,n)}}const jd=Math.PI/2;function Od(t){return Math.tan((jd+t)/2)}class qd extends Cd{constructor(t){super(t),this.center=t.center||[0,30];const[e,r]=this.parallels=t.parallels||[30,30];let n=w(e),i=w(r);this.southernCenter=n+i<0,this.southernCenter&&(n=-n,i=-i);const s=Math.cos(n),a=Od(n);this.n=n===i?Math.sin(n):Math.log(s/Math.cos(i))/Math.log(Od(i)/a),this.f=s*Math.pow(Od(n),this.n)/this.n;}project(t,e){e=w(e),this.southernCenter&&(e=-e),t=w(t-this.center[0]);const r=1e-6,{n:n,f:i}=this;i>0?e<-jd+r&&(e=-jd+r):e>jd-r&&(e=jd-r);const s=i/Math.pow(Od(e),n);let a=s*Math.sin(n*t),o=i-s*Math.cos(n*t);return a=.5*(a/Math.PI+.5),o=.5*(o/Math.PI+.5),{x:a,y:this.southernCenter?o:1-o,z:0}}unproject(t,e){t=(2*t-.5)*Math.PI,this.southernCenter&&(e=1-e),e=(2*(1-e)-.5)*Math.PI;const{n:r,f:n}=this,i=n-e,s=Math.sign(i),a=Math.sign(r)*Math.sqrt(t*t+i*i);let o=Math.atan2(t,Math.abs(i))*s;i*r<0&&(o-=Math.PI*Math.sign(t)*s);const l=M(_(o/r)+this.center[0],-180,180),u=M(_(2*Math.atan(Math.pow(n/a,1/r))-jd),-Hl,Hl);return new Ol(l,this.southernCenter?-u:u)}}class Nd extends Cd{constructor(t){super(t),this.wrap=!0,this.supportsWorldCopies=!0,this.supportsTerrain=!0,this.supportsFog=!0,this.supportsFreeCamera=!0,this.isReprojectedInTileSpace=!1,this.unsupportedLayers=[],this.range=null;}project(t,e){return {x:Nl(t),y:Gl(e),z:0}}unproject(t,e){const r=Kl(t),n=Xl(e);return new Ol(r,n)}}const Gd=w(Hl);class Zd extends Cd{project(t,e){const r=(e=w(e))*e,n=r*r;return {x:.5*((t=w(t))*(.8707-.131979*r+n*(n*(.003971*r-.001529*n)-.013791))/Math.PI+.5),y:1-.5*(e*(1.007226+r*(.015085+n*(.028874*r-.044475-.005916*n)))/Math.PI+1),z:0}}unproject(t,e){t=(2*t-.5)*Math.PI;let r=e=(2*(1-e)-1)*Math.PI,n=25,i=0,s=r*r;do{s=r*r;const t=s*s;i=(r*(1.007226+s*(.015085+t*(.028874*s-.044475-.005916*t)))-e)/(1.007226+s*(.045255+t*(.259866*s-.311325-.005916*11*t))),r=M(r-i,-Gd,Gd);}while(Math.abs(i)>1e-6&&--n>0);s=r*r;const a=M(_(t/(.8707+s*(s*(s*s*s*(.003971-.001529*s)-.013791)-.131979))),-180,180),o=_(r);return new Ol(a,o)}}const Kd=w(Hl);class Xd extends Cd{project(t,e){e=w(e),t=w(t);const r=Math.cos(e),n=2/Math.PI,i=Math.acos(r*Math.cos(t/2)),s=Math.sin(i)/i,a=.5*(t*n+2*r*Math.sin(t/2)/s)||0,o=.5*(e+Math.sin(e)/s)||0;return {x:.5*(a/Math.PI+.5),y:1-.5*(o/Math.PI+1),z:0}}unproject(t,e){let r=t=(2*t-.5)*Math.PI,n=e=(2*(1-e)-1)*Math.PI,i=25;const s=1e-6;let a=0,o=0;do{const i=Math.cos(n),s=Math.sin(n),l=2*s*i,u=s*s,c=i*i,h=Math.cos(r/2),p=Math.sin(r/2),d=2*h*p,f=p*p,y=1-c*h*h,m=y?1/y:0,g=y?Math.acos(i*h)*Math.sqrt(1/y):0,x=.5*(2*g*i*p+2*r/Math.PI)-t,v=.5*(g*s+n)-e,b=.5*m*(c*f+g*i*h*u)+1/Math.PI,w=m*(d*l/4-g*s*p),_=.125*m*(l*p-g*s*c*d),A=.5*m*(u*h+g*f*i)+.5,S=w*_-A*b;a=(v*w-x*A)/S,o=(x*_-v*b)/S,r=M(r-a,-Math.PI,Math.PI),n=M(n-o,-Kd,Kd);}while((Math.abs(a)>s||Math.abs(o)>s)&&--i>0);return new Ol(_(r),_(n))}}class Jd extends Cd{constructor(t){super(t),this.center=t.center||[0,0],this.parallels=t.parallels||[0,0],this.cosPhi=Math.max(.01,Math.cos(w(this.parallels[0]))),this.scale=1/(2*Math.max(Math.PI*this.cosPhi,1/this.cosPhi)),this.wrap=!0,this.supportsWorldCopies=!0;}project(t,e){const{scale:r,cosPhi:n}=this;return {x:w(t)*n*r+.5,y:-Math.sin(w(e))/n*r+.5,z:0}}unproject(t,e){const{scale:r,cosPhi:n}=this,i=-(e-.5)/r,s=M(_((t-.5)/r)/n,-180,180),a=Math.asin(M(i*n,-1,1)),o=M(_(a),-Hl,Hl);return new Ol(s,o)}}class Hd extends Nd{constructor(t){super(t),this.requiresDraping=!0,this.supportsWorldCopies=!1,this.supportsFog=!0,this.zAxisUnit="pixels",this.unsupportedLayers=["debug"],this.range=[3,5];}projectTilePoint(t,e,r){const n=Ml(t,e,r);return Fo(n,n,Bl(xl(r))),{x:n[0],y:n[1],z:n[2]}}locationPoint(t,e){const r=Il(e.lat,e.lng),n=Do([],r),i=t.elevation?t.elevation.getAtPointOrZero(t.locationCoordinate(e),t._centerAltitude):t._centerAltitude;Po(r,r,n,Zl(1,0)*ao*i);const s=po(new Float64Array(16));return yo(s,t.pixelMatrix,t.globeMatrix),Fo(r,r,s),new x(r[0],r[1])}pixelsPerMeter(t,e){return Zl(1,0)*e}pixelSpaceConversion(t,e,r){const n=Zl(1,t)*e,i=Er(Zl(1,45)*e,n,r);return this.pixelsPerMeter(t,e)/i}createTileMatrix(t,e,r){const n=El(xl(r.canonical));return yo(new Float64Array(16),t.globeMatrix,n)}createInversionMatrix(t,e){const{center:r}=t,n=Bl(xl(e));return vo(n,n,w(r.lng)),xo(n,n,w(r.lat)),go(n,n,[t._pixelsPerMercatorPixel,t._pixelsPerMercatorPixel,1]),Float32Array.from(n)}pointCoordinate(t,e,r,n){return yl(t,e,r,!0)||new Wl(0,0)}pointCoordinate3D(t,e,r){const n=this.pointCoordinate(t,e,r,0);return [n.x,n.y,n.z]}isPointAboveHorizon(t,e){return !yl(t,e.x,e.y,!1)}farthestPixelDistance(t){const e=function(t,e){const r=t.cameraToCenterDistance,n=t._centerAltitude*e,i=t._camera,s=t._camera.forward(),a=Mo([],Co([],s,-r),[0,0,n]),o=t.worldSize/(2*Math.PI),l=[0,0,-o],u=t.width/t.height,c=Math.tan(t.fovAboveCenter),h=Co([],i.up(),c),p=Co([],i.right(),c*u),d=Do([],Mo([],Mo([],s,h),p)),f=[];let y;if(new el(a,d).closestPointOnSphere(l,o,f)){const e=Mo([],f,l),r=$o([],e,a);y=Math.cos(t.fovAboveCenter)*ko(r);}else {const t=$o([],a,l),e=$o([],l,a);Do(e,e);const r=ko(t)-o;y=Math.sqrt(r*(r+2*o));const n=Math.acos(y/(o+r))-Math.acos(Vo(s,e));y*=Math.cos(n);}return 1.01*y}(t,this.pixelsPerMeter(t.center.lat,t.worldSize)),r=Pl(t.zoom);if(r>0){const n=zd(t,Zl(1,t.center.lat)*t.worldSize),i=t.worldSize/(2*Math.PI),s=Math.max(t.width,t.height)/t.worldSize*Math.PI;return Er(e,n+i*(1-Math.cos(s)),Math.pow(r,10))}return e}upVector(t,e,r){return Ml(e,r,t,1)}upVectorScale(t){return {metersToTile:fl(Tl(xl(t)))}}}function Yd(t){const e=t.parallels,r=!!e&&Math.abs(e[0]+e[1])<.01;switch(t.name){case"mercator":return new Nd(t);case"equirectangular":return new $d(t);case"naturalEarth":return new Zd(t);case"equalEarth":return new Ud(t);case"winkelTripel":return new Xd(t);case"albers":return r?new Jd(t):new Pd(t);case"lambertConformalConic":return r?new Jd(t):new qd(t);case"globe":return new Hd(t)}throw new Error(`Invalid projection name: ${t.name}`)}const Wd=Kc.types,Qd=[{name:"a_fade_opacity",components:1,type:"Uint8",offset:0}];function tf(t,e,r,n,i,s,a,o,l,u,c,h,p){const d=o?Math.min(Ad,Math.round(o[0])):0,f=o?Math.min(Ad,Math.round(o[1])):0;t.emplaceBack(e,r,Math.round(32*n),Math.round(32*i),s,a,(d<<1)+(l?1:0),f,16*u,16*c,256*h,256*p);}function ef(t,e,r,n,i,s,a){t.emplaceBack(e,r,n,i,s,a);}function rf(t,e,r,n,i){t.emplaceBack(e,r,n,i),t.emplaceBack(e,r,n,i),t.emplaceBack(e,r,n,i),t.emplaceBack(e,r,n,i);}function nf(t){for(const e of t.sections)if(ls(e.text))return !0;return !1}class sf{constructor(t){this.layoutVertexArray=new Xs,this.indexArray=new ra,this.programConfigurations=t,this.segments=new so,this.dynamicLayoutVertexArray=new Ns,this.opacityVertexArray=new Hs,this.placedSymbolArray=new fa,this.globeExtVertexArray=new Js;}isEmpty(){return 0===this.layoutVertexArray.length&&0===this.indexArray.length&&0===this.dynamicLayoutVertexArray.length&&0===this.opacityVertexArray.length}upload(t,e,r,n){this.isEmpty()||(r&&(this.layoutVertexBuffer=t.createVertexBuffer(this.layoutVertexArray,Eh.members),this.indexBuffer=t.createIndexBuffer(this.indexArray,e),this.dynamicLayoutVertexBuffer=t.createVertexBuffer(this.dynamicLayoutVertexArray,Ph.members,!0),this.opacityVertexBuffer=t.createVertexBuffer(this.opacityVertexArray,Qd,!0),this.globeExtVertexArray.length>0&&(this.globeExtVertexBuffer=t.createVertexBuffer(this.globeExtVertexArray,Ch.members,!0)),this.opacityVertexBuffer.itemSize=1),(r||n)&&this.programConfigurations.upload(t));}destroy(){this.layoutVertexBuffer&&(this.layoutVertexBuffer.destroy(),this.indexBuffer.destroy(),this.programConfigurations.destroy(),this.segments.destroy(),this.dynamicLayoutVertexBuffer.destroy(),this.opacityVertexBuffer.destroy(),this.globeExtVertexBuffer&&this.globeExtVertexBuffer.destroy());}}Ji(sf,"SymbolBuffers");class af{constructor(t,e,r){this.layoutVertexArray=new t,this.layoutAttributes=e,this.indexArray=new r,this.segments=new so,this.collisionVertexArray=new ta,this.collisionVertexArrayExt=new ea;}upload(t){this.layoutVertexBuffer=t.createVertexBuffer(this.layoutVertexArray,this.layoutAttributes),this.indexBuffer=t.createIndexBuffer(this.indexArray),this.collisionVertexBuffer=t.createVertexBuffer(this.collisionVertexArray,Dh.members,!0),this.collisionVertexBufferExt=t.createVertexBuffer(this.collisionVertexArrayExt,Vh.members,!0);}destroy(){this.layoutVertexBuffer&&(this.layoutVertexBuffer.destroy(),this.indexBuffer.destroy(),this.segments.destroy(),this.collisionVertexBuffer.destroy(),this.collisionVertexBufferExt.destroy());}}Ji(af,"CollisionBuffers");class of{constructor(t){this.collisionBoxArray=t.collisionBoxArray,this.zoom=t.zoom,this.overscaling=t.overscaling,this.layers=t.layers,this.layerIds=this.layers.map((t=>t.id)),this.index=t.index,this.pixelRatio=t.pixelRatio,this.sourceLayerIndex=t.sourceLayerIndex,this.hasPattern=!1,this.hasRTLText=!1,this.fullyClipped=!1,this.sortKeyRanges=[],this.collisionCircleArray=[],this.placementInvProjMatrix=po([]),this.placementViewportMatrix=po([]);const e=this.layers[0]._unevaluatedLayout._values;this.textSizeData=$h(this.zoom,e["text-size"]),this.iconSizeData=$h(this.zoom,e["icon-size"]);const r=this.layers[0].layout,n=r.get("symbol-sort-key"),i=r.get("symbol-z-order");this.canOverlap=r.get("text-allow-overlap")||r.get("icon-allow-overlap")||r.get("text-ignore-placement")||r.get("icon-ignore-placement"),this.sortFeaturesByKey="viewport-y"!==i&&void 0!==n.constantOr(1),this.sortFeaturesByY=("viewport-y"===i||"auto"===i&&!this.sortFeaturesByKey)&&this.canOverlap,this.writingModes=r.get("text-writing-mode").map((t=>Ip[t])),this.stateDependentLayerIds=this.layers.filter((t=>t.isStateDependent())).map((t=>t.id)),this.sourceID=t.sourceID,this.projection=t.projection;}createArrays(){this.text=new sf(new Ja(this.layers,this.zoom,(t=>/^text/.test(t)))),this.icon=new sf(new Ja(this.layers,this.zoom,(t=>/^icon/.test(t)))),this.glyphOffsetArray=new ga,this.lineVertexArray=new xa,this.symbolInstances=new ma;}calculateGlyphDependencies(t,e,r,n,i){for(let r=0;r<t.length;r++)if(e[t.charCodeAt(r)]=!0,n&&i){const n=Gh[t.charAt(r)];n&&(e[n.charCodeAt(0)]=!0);}}populate(t,e,r,n){const i=this.layers[0],s=i.layout,a="globe"===this.projection.name,o=s.get("text-font"),l=s.get("text-field"),u=s.get("icon-image"),c=("constant"!==l.value.kind||l.value.value instanceof De&&!l.value.value.isEmpty()||l.value.value.toString().length>0)&&("constant"!==o.value.kind||o.value.value.length>0),h="constant"!==u.value.kind||!!u.value.value||Object.keys(u.parameters).length>0,p=s.get("symbol-sort-key");if(this.features=[],!c&&!h)return;const d=e.iconDependencies,f=e.glyphDependencies,y=e.availableImages,m=new ws(this.zoom);for(const{feature:e,id:l,index:u,sourceLayerIndex:g}of t){const t=i._featureFilter.needGeometry,x=ou(e,t);if(!i._featureFilter.filter(m,x,r))continue;if(t||(x.geometry=au(e,r,n)),a&&1!==e.type&&r.z<=5){const t=x.geometry,e=.98078528056,n=(t,n)=>Vo(Ml(t.x,t.y,r,1),Ml(n.x,n.y,r,1))<e;for(let e=0;e<t.length;e++)t[e]=ru(t[e],n);}let v,b;if(c){const t=i.getValueAndResolveTokens("text-field",x,r,y),e=De.factory(t);nf(e)&&(this.hasRTLText=!0),(!this.hasRTLText||"unavailable"===xs()||this.hasRTLText&&bs.isParsed())&&(v=Nh(e,i,x));}if(h){const t=i.getValueAndResolveTokens("icon-image",x,r,y);b=t instanceof Ve?t:Ve.fromString(t);}if(!v&&!b)continue;const w=this.sortFeaturesByKey?p.evaluate(x,{},r):void 0;if(this.features.push({id:l,text:v,icon:b,index:u,sourceLayerIndex:g,geometry:x.geometry,properties:e.properties,type:Wd[e.type],sortKey:w}),b&&(d[b.name]=!0),v){const t=o.evaluate(x,{},r).join(","),e="map"===s.get("text-rotation-alignment")&&"point"!==s.get("symbol-placement");this.allowVerticalPlacement=this.writingModes&&this.writingModes.indexOf(Ip.vertical)>=0;for(const r of v.sections)if(r.image)d[r.image.name]=!0;else {const n=es(v.toString()),i=r.fontStack||t,s=f[i]=f[i]||{};this.calculateGlyphDependencies(r.text,s,e,this.allowVerticalPlacement,n);}}}"line"===s.get("symbol-placement")&&(this.features=function(t){const e={},r={},n=[];let i=0;function s(e){n.push(t[e]),i++;}function a(t,e,i){const s=r[t];return delete r[t],r[e]=s,n[s].geometry[0].pop(),n[s].geometry[0]=n[s].geometry[0].concat(i[0]),s}function o(t,r,i){const s=e[r];return delete e[r],e[t]=s,n[s].geometry[0].shift(),n[s].geometry[0]=i[0].concat(n[s].geometry[0]),s}function l(t,e,r){const n=r?e[0][e[0].length-1]:e[0][0];return `${t}:${n.x}:${n.y}`}for(let u=0;u<t.length;u++){const c=t[u],h=c.geometry,p=c.text?c.text.toString():null;if(!p){s(u);continue}const d=l(p,h),f=l(p,h,!0);if(d in r&&f in e&&r[d]!==e[f]){const t=o(d,f,h),i=a(d,f,n[t].geometry);delete e[d],delete r[f],r[l(p,n[i].geometry,!0)]=i,n[t].geometry=null;}else d in r?a(d,f,h):f in e?o(d,f,h):(s(u),e[d]=i-1,r[f]=i-1);}return n.filter((t=>t.geometry))}(this.features)),this.sortFeaturesByKey&&this.features.sort(((t,e)=>t.sortKey-e.sortKey));}update(t,e,r,n){this.stateDependentLayers.length&&(this.text.programConfigurations.updatePaintArrays(t,e,this.layers,r,n),this.icon.programConfigurations.updatePaintArrays(t,e,this.layers,r,n));}isEmpty(){return 0===this.symbolInstances.length&&!this.hasRTLText}uploadPending(){return !this.uploaded||this.text.programConfigurations.needsUpload||this.icon.programConfigurations.needsUpload}upload(t){!this.uploaded&&this.hasDebugData()&&(this.textCollisionBox.upload(t),this.iconCollisionBox.upload(t)),this.text.upload(t,this.sortFeaturesByY,!this.uploaded,this.text.programConfigurations.needsUpload),this.icon.upload(t,this.sortFeaturesByY,!this.uploaded,this.icon.programConfigurations.needsUpload),this.uploaded=!0;}destroyDebugData(){this.textCollisionBox.destroy(),this.iconCollisionBox.destroy();}getProjection(){return this.projectionInstance||(this.projectionInstance=Yd(this.projection)),this.projectionInstance}destroy(){this.text.destroy(),this.icon.destroy(),this.hasDebugData()&&this.destroyDebugData();}addToLineVertexArray(t,e){const r=this.lineVertexArray.length;if(void 0!==t.segment)for(const{x:t,y:r}of e)this.lineVertexArray.emplaceBack(t,r);return {lineStartIndex:r,lineLength:this.lineVertexArray.length-r}}addSymbols(t,e,r,n,i,s,a,o,l,u,c,h,p,d){const f=t.indexArray,y=t.layoutVertexArray,m=t.globeExtVertexArray,g=t.segments.prepareSegment(4*e.length,y,f,this.canOverlap?s.sortKey:void 0),x=this.glyphOffsetArray.length,v=g.vertexLength,b=this.allowVerticalPlacement&&a===Ip.vertical?Math.PI/2:0,w=s.text&&s.text.sections;for(let n=0;n<e.length;n++){const{tl:i,tr:a,bl:u,br:c,tex:h,pixelOffsetTL:x,pixelOffsetBR:v,minFontScaleX:_,minFontScaleY:A,glyphOffset:S,isSDF:k,sectionIndex:I}=e[n],M=g.vertexLength,T=S[1];if(tf(y,l.x,l.y,i.x,T+i.y,h.x,h.y,r,k,x.x,x.y,_,A),tf(y,l.x,l.y,a.x,T+a.y,h.x+h.w,h.y,r,k,v.x,x.y,_,A),tf(y,l.x,l.y,u.x,T+u.y,h.x,h.y+h.h,r,k,x.x,v.y,_,A),tf(y,l.x,l.y,c.x,T+c.y,h.x+h.w,h.y+h.h,r,k,v.x,v.y,_,A),o){const{x:e,y:r,z:n}=o.anchor,[i,s,a]=o.up;ef(m,e,r,n,i,s,a),ef(m,e,r,n,i,s,a),ef(m,e,r,n,i,s,a),ef(m,e,r,n,i,s,a),rf(t.dynamicLayoutVertexArray,e,r,n,b);}else rf(t.dynamicLayoutVertexArray,l.x,l.y,l.z,b);f.emplaceBack(M,M+1,M+2),f.emplaceBack(M+1,M+2,M+3),g.vertexLength+=4,g.primitiveLength+=2,this.glyphOffsetArray.emplaceBack(S[0]),n!==e.length-1&&I===e[n+1].sectionIndex||t.programConfigurations.populatePaintArrays(y.length,s,s.index,{},p,d,w&&w[I]);}const _=o?o.anchor:l;t.placedSymbolArray.emplaceBack(_.x,_.y,_.z,l.x,l.y,x,this.glyphOffsetArray.length-x,v,u,c,l.segment,r?r[0]:0,r?r[1]:0,n[0],n[1],a,0,!1,0,h,0);}_commitLayoutVertex(t,e,r,n,i,s,a){t.emplaceBack(e,r,n,i,s,Math.round(a.x),Math.round(a.y));}_addCollisionDebugVertices(t,e,r,n,i,s,a){const o=r.segments.prepareSegment(4,r.layoutVertexArray,r.indexArray),l=o.vertexLength,u=a.tileAnchorX,c=a.tileAnchorY;for(let t=0;t<4;t++)r.collisionVertexArray.emplaceBack(0,0,0,0);r.collisionVertexArrayExt.emplaceBack(e,-t.padding,-t.padding),r.collisionVertexArrayExt.emplaceBack(e,t.padding,-t.padding),r.collisionVertexArrayExt.emplaceBack(e,t.padding,t.padding),r.collisionVertexArrayExt.emplaceBack(e,-t.padding,t.padding),this._commitLayoutVertex(r.layoutVertexArray,n,i,s,u,c,new x(t.x1,t.y1)),this._commitLayoutVertex(r.layoutVertexArray,n,i,s,u,c,new x(t.x2,t.y1)),this._commitLayoutVertex(r.layoutVertexArray,n,i,s,u,c,new x(t.x2,t.y2)),this._commitLayoutVertex(r.layoutVertexArray,n,i,s,u,c,new x(t.x1,t.y2)),o.vertexLength+=4;const h=r.indexArray;h.emplaceBack(l,l+1),h.emplaceBack(l+1,l+2),h.emplaceBack(l+2,l+3),h.emplaceBack(l+3,l),o.primitiveLength+=4;}_addTextDebugCollisionBoxes(t,e,r,n,i,s){for(let a=n;a<i;a++){const n=r.get(a),i=this.getSymbolInstanceTextSize(t,s,e,a);this._addCollisionDebugVertices(n,i,this.textCollisionBox,n.projectedAnchorX,n.projectedAnchorY,n.projectedAnchorZ,s);}}_addIconDebugCollisionBoxes(t,e,r,n,i,s){for(let a=n;a<i;a++){const n=r.get(a),i=this.getSymbolInstanceIconSize(t,e,s.placedIconSymbolIndex);this._addCollisionDebugVertices(n,i,this.iconCollisionBox,n.projectedAnchorX,n.projectedAnchorY,n.projectedAnchorZ,s);}}generateCollisionDebugBuffers(t,e){this.hasDebugData()&&this.destroyDebugData(),this.textCollisionBox=new af(Ws,Lh.members,la),this.iconCollisionBox=new af(Ws,Lh.members,la);const r=Oh(this.iconSizeData,t),n=Oh(this.textSizeData,t);for(let i=0;i<this.symbolInstances.length;i++){const s=this.symbolInstances.get(i);this._addTextDebugCollisionBoxes(n,t,e,s.textBoxStartIndex,s.textBoxEndIndex,s),this._addTextDebugCollisionBoxes(n,t,e,s.verticalTextBoxStartIndex,s.verticalTextBoxEndIndex,s),this._addIconDebugCollisionBoxes(r,t,e,s.iconBoxStartIndex,s.iconBoxEndIndex,s),this._addIconDebugCollisionBoxes(r,t,e,s.verticalIconBoxStartIndex,s.verticalIconBoxEndIndex,s);}}getSymbolInstanceTextSize(t,e,r,n){const i=this.text.placedSymbolArray.get(e.rightJustifiedTextSymbolIndex>=0?e.rightJustifiedTextSymbolIndex:e.centerJustifiedTextSymbolIndex>=0?e.centerJustifiedTextSymbolIndex:e.leftJustifiedTextSymbolIndex>=0?e.leftJustifiedTextSymbolIndex:e.verticalPlacedTextSymbolIndex>=0?e.verticalPlacedTextSymbolIndex:n),s=jh(this.textSizeData,t,i)/Rh;return this.tilePixelRatio*s}getSymbolInstanceIconSize(t,e,r){const n=this.icon.placedSymbolArray.get(r),i=jh(this.iconSizeData,t,n);return this.tilePixelRatio*i}_commitDebugCollisionVertexUpdate(t,e,r){t.emplaceBack(e,-r,-r),t.emplaceBack(e,r,-r),t.emplaceBack(e,r,r),t.emplaceBack(e,-r,r);}_updateTextDebugCollisionBoxes(t,e,r,n,i,s){for(let a=n;a<i;a++){const n=r.get(a),i=this.getSymbolInstanceTextSize(t,s,e,a);this._commitDebugCollisionVertexUpdate(this.textCollisionBox.collisionVertexArrayExt,i,n.padding);}}_updateIconDebugCollisionBoxes(t,e,r,n,i,s){for(let a=n;a<i;a++){const n=r.get(a),i=this.getSymbolInstanceIconSize(t,e,s);this._commitDebugCollisionVertexUpdate(this.iconCollisionBox.collisionVertexArrayExt,i,n.padding);}}updateCollisionDebugBuffers(t,e){if(!this.hasDebugData())return;this.hasTextCollisionBoxData()&&this.textCollisionBox.collisionVertexArrayExt.clear(),this.hasIconCollisionBoxData()&&this.iconCollisionBox.collisionVertexArrayExt.clear();const r=Oh(this.iconSizeData,t),n=Oh(this.textSizeData,t);for(let i=0;i<this.symbolInstances.length;i++){const s=this.symbolInstances.get(i);this._updateTextDebugCollisionBoxes(n,t,e,s.textBoxStartIndex,s.textBoxEndIndex,s),this._updateTextDebugCollisionBoxes(n,t,e,s.verticalTextBoxStartIndex,s.verticalTextBoxEndIndex,s),this._updateIconDebugCollisionBoxes(r,t,e,s.iconBoxStartIndex,s.iconBoxEndIndex,s.placedIconSymbolIndex),this._updateIconDebugCollisionBoxes(r,t,e,s.verticalIconBoxStartIndex,s.verticalIconBoxEndIndex,s.placedIconSymbolIndex);}this.hasTextCollisionBoxData()&&this.textCollisionBox.collisionVertexBufferExt&&this.textCollisionBox.collisionVertexBufferExt.updateData(this.textCollisionBox.collisionVertexArrayExt),this.hasIconCollisionBoxData()&&this.iconCollisionBox.collisionVertexBufferExt&&this.iconCollisionBox.collisionVertexBufferExt.updateData(this.iconCollisionBox.collisionVertexArrayExt);}_deserializeCollisionBoxesForSymbol(t,e,r,n,i,s,a,o,l){const u={};if(e<r){const{x1:r,y1:n,x2:i,y2:s,padding:a,projectedAnchorX:o,projectedAnchorY:l,projectedAnchorZ:c,tileAnchorX:h,tileAnchorY:p,featureIndex:d}=t.get(e);u.textBox={x1:r,y1:n,x2:i,y2:s,padding:a,projectedAnchorX:o,projectedAnchorY:l,projectedAnchorZ:c,tileAnchorX:h,tileAnchorY:p},u.textFeatureIndex=d;}if(n<i){const{x1:e,y1:r,x2:i,y2:s,padding:a,projectedAnchorX:o,projectedAnchorY:l,projectedAnchorZ:c,tileAnchorX:h,tileAnchorY:p,featureIndex:d}=t.get(n);u.verticalTextBox={x1:e,y1:r,x2:i,y2:s,padding:a,projectedAnchorX:o,projectedAnchorY:l,projectedAnchorZ:c,tileAnchorX:h,tileAnchorY:p},u.verticalTextFeatureIndex=d;}if(s<a){const{x1:e,y1:r,x2:n,y2:i,padding:a,projectedAnchorX:o,projectedAnchorY:l,projectedAnchorZ:c,tileAnchorX:h,tileAnchorY:p,featureIndex:d}=t.get(s);u.iconBox={x1:e,y1:r,x2:n,y2:i,padding:a,projectedAnchorX:o,projectedAnchorY:l,projectedAnchorZ:c,tileAnchorX:h,tileAnchorY:p},u.iconFeatureIndex=d;}if(o<l){const{x1:e,y1:r,x2:n,y2:i,padding:s,projectedAnchorX:a,projectedAnchorY:l,projectedAnchorZ:c,tileAnchorX:h,tileAnchorY:p,featureIndex:d}=t.get(o);u.verticalIconBox={x1:e,y1:r,x2:n,y2:i,padding:s,projectedAnchorX:a,projectedAnchorY:l,projectedAnchorZ:c,tileAnchorX:h,tileAnchorY:p},u.verticalIconFeatureIndex=d;}return u}deserializeCollisionBoxes(t){this.collisionArrays=[];for(let e=0;e<this.symbolInstances.length;e++){const r=this.symbolInstances.get(e);this.collisionArrays.push(this._deserializeCollisionBoxesForSymbol(t,r.textBoxStartIndex,r.textBoxEndIndex,r.verticalTextBoxStartIndex,r.verticalTextBoxEndIndex,r.iconBoxStartIndex,r.iconBoxEndIndex,r.verticalIconBoxStartIndex,r.verticalIconBoxEndIndex));}}hasTextData(){return this.text.segments.get().length>0}hasIconData(){return this.icon.segments.get().length>0}hasDebugData(){return this.textCollisionBox&&this.iconCollisionBox}hasTextCollisionBoxData(){return this.hasDebugData()&&this.textCollisionBox.segments.get().length>0}hasIconCollisionBoxData(){return this.hasDebugData()&&this.iconCollisionBox.segments.get().length>0}addIndicesForPlacedSymbol(t,e){const r=t.placedSymbolArray.get(e),n=r.vertexStartIndex+4*r.numGlyphs;for(let e=r.vertexStartIndex;e<n;e+=4)t.indexArray.emplaceBack(e,e+1,e+2),t.indexArray.emplaceBack(e+1,e+2,e+3);}getSortedSymbolIndexes(t){if(this.sortedAngle===t&&void 0!==this.symbolInstanceIndexes)return this.symbolInstanceIndexes;const e=Math.sin(t),r=Math.cos(t),n=[],i=[],s=[];for(let t=0;t<this.symbolInstances.length;++t){s.push(t);const a=this.symbolInstances.get(t);n.push(0|Math.round(e*a.tileAnchorX+r*a.tileAnchorY)),i.push(a.featureIndex);}return s.sort(((t,e)=>n[t]-n[e]||i[e]-i[t])),s}addToSortKeyRanges(t,e){const r=this.sortKeyRanges[this.sortKeyRanges.length-1];r&&r.sortKey===e?r.symbolInstanceEnd=t+1:this.sortKeyRanges.push({sortKey:e,symbolInstanceStart:t,symbolInstanceEnd:t+1});}sortFeatures(t){if(this.sortFeaturesByY&&this.sortedAngle!==t&&!(this.text.segments.get().length>1||this.icon.segments.get().length>1)){this.symbolInstanceIndexes=this.getSortedSymbolIndexes(t),this.sortedAngle=t,this.text.indexArray.clear(),this.icon.indexArray.clear(),this.featureSortOrder=[];for(const t of this.symbolInstanceIndexes){const e=this.symbolInstances.get(t);this.featureSortOrder.push(e.featureIndex);const{rightJustifiedTextSymbolIndex:r,centerJustifiedTextSymbolIndex:n,leftJustifiedTextSymbolIndex:i,verticalPlacedTextSymbolIndex:s,placedIconSymbolIndex:a,verticalPlacedIconSymbolIndex:o}=e;r>=0&&this.addIndicesForPlacedSymbol(this.text,r),n>=0&&n!==r&&this.addIndicesForPlacedSymbol(this.text,n),i>=0&&i!==n&&i!==r&&this.addIndicesForPlacedSymbol(this.text,i),s>=0&&this.addIndicesForPlacedSymbol(this.text,s),a>=0&&this.addIndicesForPlacedSymbol(this.icon,a),o>=0&&this.addIndicesForPlacedSymbol(this.icon,o);}this.text.indexBuffer&&this.text.indexBuffer.updateData(this.text.indexArray),this.icon.indexBuffer&&this.icon.indexBuffer.updateData(this.icon.indexArray);}}}Ji(of,"SymbolBucket",{omit:["layers","collisionBoxArray","features","compareText"]}),of.MAX_GLYPHS=65535,of.addDynamicAttributes=rf;const lf=new Ps({"symbol-placement":new Bs(te.layout_symbol["symbol-placement"]),"symbol-spacing":new Bs(te.layout_symbol["symbol-spacing"]),"symbol-avoid-edges":new Bs(te.layout_symbol["symbol-avoid-edges"]),"symbol-sort-key":new Es(te.layout_symbol["symbol-sort-key"]),"symbol-z-order":new Bs(te.layout_symbol["symbol-z-order"]),"icon-allow-overlap":new Bs(te.layout_symbol["icon-allow-overlap"]),"icon-ignore-placement":new Bs(te.layout_symbol["icon-ignore-placement"]),"icon-optional":new Bs(te.layout_symbol["icon-optional"]),"icon-rotation-alignment":new Bs(te.layout_symbol["icon-rotation-alignment"]),"icon-size":new Es(te.layout_symbol["icon-size"]),"icon-text-fit":new Bs(te.layout_symbol["icon-text-fit"]),"icon-text-fit-padding":new Bs(te.layout_symbol["icon-text-fit-padding"]),"icon-image":new Es(te.layout_symbol["icon-image"]),"icon-rotate":new Es(te.layout_symbol["icon-rotate"]),"icon-padding":new Bs(te.layout_symbol["icon-padding"]),"icon-keep-upright":new Bs(te.layout_symbol["icon-keep-upright"]),"icon-offset":new Es(te.layout_symbol["icon-offset"]),"icon-anchor":new Es(te.layout_symbol["icon-anchor"]),"icon-pitch-alignment":new Bs(te.layout_symbol["icon-pitch-alignment"]),"text-pitch-alignment":new Bs(te.layout_symbol["text-pitch-alignment"]),"text-rotation-alignment":new Bs(te.layout_symbol["text-rotation-alignment"]),"text-field":new Es(te.layout_symbol["text-field"]),"text-font":new Es(te.layout_symbol["text-font"]),"text-size":new Es(te.layout_symbol["text-size"]),"text-max-width":new Es(te.layout_symbol["text-max-width"]),"text-line-height":new Es(te.layout_symbol["text-line-height"]),"text-letter-spacing":new Es(te.layout_symbol["text-letter-spacing"]),"text-justify":new Es(te.layout_symbol["text-justify"]),"text-radial-offset":new Es(te.layout_symbol["text-radial-offset"]),"text-variable-anchor":new Bs(te.layout_symbol["text-variable-anchor"]),"text-anchor":new Es(te.layout_symbol["text-anchor"]),"text-max-angle":new Bs(te.layout_symbol["text-max-angle"]),"text-writing-mode":new Bs(te.layout_symbol["text-writing-mode"]),"text-rotate":new Es(te.layout_symbol["text-rotate"]),"text-padding":new Bs(te.layout_symbol["text-padding"]),"text-keep-upright":new Bs(te.layout_symbol["text-keep-upright"]),"text-transform":new Es(te.layout_symbol["text-transform"]),"text-offset":new Es(te.layout_symbol["text-offset"]),"text-allow-overlap":new Bs(te.layout_symbol["text-allow-overlap"]),"text-ignore-placement":new Bs(te.layout_symbol["text-ignore-placement"]),"text-optional":new Bs(te.layout_symbol["text-optional"])});var uf={paint:new Ps({"icon-opacity":new Es(te.paint_symbol["icon-opacity"]),"icon-color":new Es(te.paint_symbol["icon-color"]),"icon-halo-color":new Es(te.paint_symbol["icon-halo-color"]),"icon-halo-width":new Es(te.paint_symbol["icon-halo-width"]),"icon-halo-blur":new Es(te.paint_symbol["icon-halo-blur"]),"icon-translate":new Bs(te.paint_symbol["icon-translate"]),"icon-translate-anchor":new Bs(te.paint_symbol["icon-translate-anchor"]),"text-opacity":new Es(te.paint_symbol["text-opacity"]),"text-color":new Es(te.paint_symbol["text-color"],{runtimeType:pe,getOverride:t=>t.textColor,hasOverride:t=>!!t.textColor}),"text-halo-color":new Es(te.paint_symbol["text-halo-color"]),"text-halo-width":new Es(te.paint_symbol["text-halo-width"]),"text-halo-blur":new Es(te.paint_symbol["text-halo-blur"]),"text-translate":new Bs(te.paint_symbol["text-translate"]),"text-translate-anchor":new Bs(te.paint_symbol["text-translate-anchor"])}),layout:lf};class cf{constructor(t){this.type=t.property.overrides?t.property.overrides.runtimeType:le,this.defaultValue=t;}evaluate(t){if(t.formattedSection){const e=this.defaultValue.property.overrides;if(e&&e.hasOverride(t.formattedSection))return e.getOverride(t.formattedSection)}return t.feature&&t.featureState?this.defaultValue.evaluate(t.feature,t.featureState):this.defaultValue.property.specification.default}eachChild(t){this.defaultValue.isConstant()||t(this.defaultValue.value._styleExpression.expression);}outputDefined(){return !1}serialize(){return null}}Ji(cf,"FormatSectionOverride",{omit:["defaultValue"]});class hf extends ro{constructor(t){super(t,uf);}recalculate(t,e){super.recalculate(t,e),"auto"===this.layout.get("icon-rotation-alignment")&&(this.layout._values["icon-rotation-alignment"]="point"!==this.layout.get("symbol-placement")?"map":"viewport"),"auto"===this.layout.get("text-rotation-alignment")&&(this.layout._values["text-rotation-alignment"]="point"!==this.layout.get("symbol-placement")?"map":"viewport"),"auto"===this.layout.get("text-pitch-alignment")&&(this.layout._values["text-pitch-alignment"]=this.layout.get("text-rotation-alignment")),"auto"===this.layout.get("icon-pitch-alignment")&&(this.layout._values["icon-pitch-alignment"]=this.layout.get("icon-rotation-alignment"));const r=this.layout.get("text-writing-mode");if(r){const t=[];for(const e of r)t.indexOf(e)<0&&t.push(e);this.layout._values["text-writing-mode"]=t;}else this.layout._values["text-writing-mode"]="point"===this.layout.get("symbol-placement")?["horizontal"]:["horizontal","vertical"];this._setPaintOverrides();}getValueAndResolveTokens(t,e,r,n){const i=this.layout.get(t).evaluate(e,{},r,n),s=this._unevaluatedLayout._values[t];return s.isDataDriven()||Jn(s.value)||!i?i:function(t,e){return e.replace(/{([^{}]+)}/g,((e,r)=>r in t?String(t[r]):""))}(e.properties,i)}createBucket(t){return new of(t)}queryRadius(){return 0}queryIntersectsFeature(){return !1}_setPaintOverrides(){for(const t of uf.paint.overridableProperties){if(!hf.hasPaintOverride(this.layout,t))continue;const e=this.paint.get(t),r=new cf(e),n=new Xn(r,e.property.specification);let i=null;i="constant"===e.value.kind||"source"===e.value.kind?new Yn("source",n):new Wn("composite",n,e.value.zoomStops,e.value._interpolationType),this.paint._values[t]=new Ts(e.property,i,e.parameters);}}_handleOverridablePaintPropertyUpdate(t,e,r){return !(!this.layout||e.isDataDriven()||r.isDataDriven())&&hf.hasPaintOverride(this.layout,t)}static hasPaintOverride(t,e){const r=t.get("text-field"),n=uf.paint.properties[e];let i=!1;const s=t=>{for(const e of t)if(n.overrides&&n.overrides.hasOverride(e))return void(i=!0)};if("constant"===r.value.kind&&r.value.value instanceof De)s(r.value.value.sections);else if("source"===r.value.kind){const t=e=>{i||(e instanceof je&&Re(e.value)===me?s(e.value.sections):e instanceof Ze?s(e.sections):e.eachChild(t));},e=r.value;e._styleExpression&&t(e._styleExpression.expression);}return i}getProgramConfiguration(t){return new Xa(this,t)}}var pf={paint:new Ps({"background-color":new Bs(te.paint_background["background-color"]),"background-pattern":new Bs(te.paint_background["background-pattern"]),"background-opacity":new Bs(te.paint_background["background-opacity"])})},df={paint:new Ps({"raster-opacity":new Bs(te.paint_raster["raster-opacity"]),"raster-hue-rotate":new Bs(te.paint_raster["raster-hue-rotate"]),"raster-brightness-min":new Bs(te.paint_raster["raster-brightness-min"]),"raster-brightness-max":new Bs(te.paint_raster["raster-brightness-max"]),"raster-saturation":new Bs(te.paint_raster["raster-saturation"]),"raster-contrast":new Bs(te.paint_raster["raster-contrast"]),"raster-resampling":new Bs(te.paint_raster["raster-resampling"]),"raster-fade-duration":new Bs(te.paint_raster["raster-fade-duration"])})};class ff extends ro{constructor(t){super(t,{}),this.implementation=t;}is3D(){return "3d"===this.implementation.renderingMode}hasOffscreenPass(){return void 0!==this.implementation.prerender}isLayerDraped(){return void 0!==this.implementation.renderToTile}shouldRedrape(){return !!this.implementation.shouldRerenderTiles&&this.implementation.shouldRerenderTiles()}recalculate(){}updateTransitions(){}hasTransition(){return !1}serialize(){}onAdd(t){this.implementation.onAdd&&this.implementation.onAdd(t,t.painter.context.gl);}onRemove(t){this.implementation.onRemove&&this.implementation.onRemove(t,t.painter.context.gl);}}var yf={paint:new Ps({"sky-type":new Bs(te.paint_sky["sky-type"]),"sky-atmosphere-sun":new Bs(te.paint_sky["sky-atmosphere-sun"]),"sky-atmosphere-sun-intensity":new Bs(te.paint_sky["sky-atmosphere-sun-intensity"]),"sky-gradient-center":new Bs(te.paint_sky["sky-gradient-center"]),"sky-gradient-radius":new Bs(te.paint_sky["sky-gradient-radius"]),"sky-gradient":new Cs(te.paint_sky["sky-gradient"]),"sky-atmosphere-halo-color":new Bs(te.paint_sky["sky-atmosphere-halo-color"]),"sky-atmosphere-color":new Bs(te.paint_sky["sky-atmosphere-color"]),"sky-opacity":new Bs(te.paint_sky["sky-opacity"])})};function mf(t,e,r){const n=[0,0,1],i=Ko([]);return Jo(i,i,r?-w(t)+Math.PI:w(t)),Xo(i,i,-w(e)),Ro(n,n,i),Do(n,n)}const gf={circle:class extends ro{constructor(t){super(t,Tu);}createBucket(t){return new cu(t)}queryRadius(t){const e=t;return Au("circle-radius",this,e)+Au("circle-stroke-width",this,e)+Su(this.paint.get("circle-translate"))}queryIntersectsFeature(t,e,r,n,i,s,a,o){const l=Iu(this.paint.get("circle-translate"),this.paint.get("circle-translate-anchor"),s.angle,t.pixelToTileUnitsFactor),u=this.paint.get("circle-radius").evaluate(e,r)+this.paint.get("circle-stroke-width").evaluate(e,r);return zu(t,n,s,a,o,"map"===this.paint.get("circle-pitch-alignment"),"map"===this.paint.get("circle-pitch-scale"),l,u)}getProgramIds(){return ["circle"]}getProgramConfiguration(t){return new Xa(this,t)}},heatmap:class extends ro{createBucket(t){return new Du(t)}constructor(t){super(t,$u),this._updateColorRamp();}_handleSpecialPaintPropertyUpdate(t){"heatmap-color"===t&&this._updateColorRamp();}_updateColorRamp(){this.colorRamp=ju({expression:this._transitionablePaint._values["heatmap-color"].value.expression,evaluationKey:"heatmapDensity",image:this.colorRamp}),this.colorRampTexture=null;}resize(){this.heatmapFbo&&(this.heatmapFbo.destroy(),this.heatmapFbo=null);}queryRadius(t){return Au("heatmap-radius",this,t)}queryIntersectsFeature(t,e,r,n,i,s,a,o){const l=this.paint.get("heatmap-radius").evaluate(e,r);return zu(t,n,s,a,o,!0,!0,new x(0,0),l)}hasOffscreenPass(){return 0!==this.paint.get("heatmap-opacity")&&"none"!==this.visibility}getProgramIds(){return ["heatmap","heatmapTexture"]}getProgramConfiguration(t){return new Xa(this,t)}},hillshade:class extends ro{constructor(t){super(t,Ou);}hasOffscreenPass(){return 0!==this.paint.get("hillshade-exaggeration")&&"none"!==this.visibility}getProgramIds(){return ["hillshade","hillshadePrepare"]}},fill:class extends ro{constructor(t){super(t,zc);}getProgramIds(){const t=this.paint.get("fill-pattern"),e=t&&t.constantOr(1),r=[e?"fillPattern":"fill"];return this.paint.get("fill-antialias")&&r.push(e&&!this.getPaintProperty("fill-outline-color")?"fillOutlinePattern":"fillOutline"),r}getProgramConfiguration(t){return new Xa(this,t)}recalculate(t,e){super.recalculate(t,e);const r=this.paint._values["fill-outline-color"];"constant"===r.value.kind&&void 0===r.value.value&&(this.paint._values["fill-outline-color"]=this.paint._values["fill-color"]);}createBucket(t){return new Mc(t)}queryRadius(){return Su(this.paint.get("fill-translate"))}queryIntersectsFeature(t,e,r,n,i,s){return !t.queryGeometry.isAboveHorizon&&du(ku(t.tilespaceGeometry,this.paint.get("fill-translate"),this.paint.get("fill-translate-anchor"),s.angle,t.pixelToTileUnitsFactor),n)}isTileClipped(){return !0}},"fill-extrusion":class extends ro{constructor(t){super(t,ch);}createBucket(t){return new th(t)}queryRadius(){return Su(this.paint.get("fill-extrusion-translate"))}is3D(){return !0}getProgramIds(){return [this.paint.get("fill-extrusion-pattern").constantOr(1)?"fillExtrusionPattern":"fillExtrusion"]}getProgramConfiguration(t){return new Xa(this,t)}queryIntersectsFeature(t,e,r,n,i,s,a,o,l){const u=Iu(this.paint.get("fill-extrusion-translate"),this.paint.get("fill-extrusion-translate-anchor"),s.angle,t.pixelToTileUnitsFactor),c=this.paint.get("fill-extrusion-height").evaluate(e,r),h=this.paint.get("fill-extrusion-base").evaluate(e,r),p=[0,0],d=o&&s.elevation,f=s.elevation?s.elevation.exaggeration():1,y=t.tile.getBucket(this);if(d&&y instanceof th){const t=y.centroidVertexArray,e=l+1;e<t.length&&(p[0]=t.geta_centroid_pos0(e),p[1]=t.geta_centroid_pos1(e));}if(0===p[0]&&1===p[1])return !1;"globe"===s.projection.name&&(n=lh([n],[new x(0,0),new x(ao,ao)],t.tileID.canonical).map((t=>t.polygon)).flat());const m=d?o:null,[g,v]=function(t,e,r,n,i,s,a,o,l,u,c){return "globe"===t.projection.name?function(t,e,r,n,i,s,a,o,l,u,c){const h=[],p=[],d=t.projection.upVectorScale(c,t.center.lat,t.worldSize).metersToTile,f=[0,0,0,1],y=[0,0,0,1],m=(t,e,r,n)=>{t[0]=e,t[1]=r,t[2]=n,t[3]=1;},g=oh();r>0&&(r+=g),n+=g;for(const g of e){const e=[],x=[];for(const h of g){const p=h.x+i.x,g=h.y+i.y,v=t.projection.projectTilePoint(p,g,c),b=t.projection.upVector(c,h.x,h.y);let w=r,_=n;if(a){const t=vh(p,g,r,n,a,o,l,u);w+=t.base,_+=t.top;}0!==r?m(f,v.x+b[0]*d*w,v.y+b[1]*d*w,v.z+b[2]*d*w):m(f,v.x,v.y,v.z),m(y,v.x+b[0]*d*_,v.y+b[1]*d*_,v.z+b[2]*d*_),Fo(f,f,s),Fo(y,y,s),e.push(new mh(f[0],f[1],f[2])),x.push(new mh(y[0],y[1],y[2]));}h.push(e),p.push(x);}return [h,p]}(t,e,r,n,i,s,a,o,l,u,c):a?function(t,e,r,n,i,s,a,o,l){const u=[],c=[],h=[0,0,0,1];for(const p of t){const t=[],d=[];for(const u of p){const c=u.x+n.x,p=u.y+n.y,f=vh(c,p,e,r,s,a,o,l);h[0]=c,h[1]=p,h[2]=f.base,h[3]=1,Go(h,h,i),h[3]=Math.max(h[3],1e-5);const y=new mh(h[0]/h[3],h[1]/h[3],h[2]/h[3]);h[0]=c,h[1]=p,h[2]=f.top,h[3]=1,Go(h,h,i),h[3]=Math.max(h[3],1e-5);const m=new mh(h[0]/h[3],h[1]/h[3],h[2]/h[3]);t.push(y),d.push(m);}u.push(t),c.push(d);}return [u,c]}(e,r,n,i,s,a,o,l,u):function(t,e,r,n,i){const s=[],a=[],o=i[8]*e,l=i[9]*e,u=i[10]*e,c=i[11]*e,h=i[8]*r,p=i[9]*r,d=i[10]*r,f=i[11]*r;for(const e of t){const t=[],r=[];for(const s of e){const e=s.x+n.x,a=s.y+n.y,y=i[0]*e+i[4]*a+i[12],m=i[1]*e+i[5]*a+i[13],g=i[2]*e+i[6]*a+i[14],x=i[3]*e+i[7]*a+i[15],v=y+o,b=m+l,w=g+u,_=Math.max(x+c,1e-5),A=y+h,S=m+p,k=g+d,I=Math.max(x+f,1e-5);t.push(new mh(v/_,b/_,w/_)),r.push(new mh(A/I,S/I,k/I));}s.push(t),a.push(r);}return [s,a]}(e,r,n,i,s)}(s,n,h,c,u,a,m,p,f,s.center.lat,t.tileID.canonical),b=t.queryGeometry;return function(t,e,r){let n=1/0;du(r,e)&&(n=xh(r,e[0]));for(let i=0;i<e.length;i++){const s=e[i],a=t[i];for(let t=0;t<s.length-1;t++){const e=s[t],i=[e,s[t+1],a[t+1],a[t],e];hu(r,i)&&(n=Math.min(n,xh(r,i)));}}return n!==1/0&&n}(g,v,b.isPointQuery()?b.screenBounds:b.screenGeometry)}},line:class extends ro{constructor(t){super(t,Th),this.gradientVersion=0;}_handleSpecialPaintPropertyUpdate(t){if("line-gradient"===t){const t=this._transitionablePaint._values["line-gradient"].value.expression;this.stepInterpolant=t._styleExpression&&t._styleExpression.expression instanceof Br,this.gradientVersion=(this.gradientVersion+1)%Number.MAX_SAFE_INTEGER;}}gradientExpression(){return this._transitionablePaint._values["line-gradient"].value.expression}widthExpression(){return this._transitionablePaint._values["line-width"].value.expression}recalculate(t,e){super.recalculate(t,e),this.paint._values["line-floorwidth"]=zh.possiblyEvaluate(this._transitioningPaint._values["line-width"].value,t);}createBucket(t){return new Ih(t)}getProgramIds(){return [this.paint.get("line-pattern").constantOr(1)?"linePattern":"line"]}getProgramConfiguration(t){return new Xa(this,t)}queryRadius(t){const e=t,r=Bh(Au("line-width",this,e),Au("line-gap-width",this,e)),n=Au("line-offset",this,e);return r/2+Math.abs(n)+Su(this.paint.get("line-translate"))}queryIntersectsFeature(t,e,r,n,i,s){if(t.queryGeometry.isAboveHorizon)return !1;const a=ku(t.tilespaceGeometry,this.paint.get("line-translate"),this.paint.get("line-translate-anchor"),s.angle,t.pixelToTileUnitsFactor),o=t.pixelToTileUnitsFactor/2*Bh(this.paint.get("line-width").evaluate(e,r),this.paint.get("line-gap-width").evaluate(e,r)),l=this.paint.get("line-offset").evaluate(e,r);return l&&(n=function(t,e){const r=[],n=new x(0,0);for(let i=0;i<t.length;i++){const s=t[i],a=[];for(let t=0;t<s.length;t++){const r=s[t],i=s[t+1],o=0===t?n:r.sub(s[t-1])._unit()._perp(),l=t===s.length-1?n:i.sub(r)._unit()._perp(),u=o._add(l)._unit();u._mult(1/(u.x*l.x+u.y*l.y)),a.push(u._mult(e)._add(r));}r.push(a);}return r}(n,l*t.pixelToTileUnitsFactor)),function(t,e,r){for(let n=0;n<e.length;n++){const i=e[n];if(t.length>=3)for(let e=0;e<i.length;e++)if(bu(t,i[e]))return !0;if(fu(t,i,r))return !0}return !1}(a,n,o)}isTileClipped(){return !0}},symbol:hf,background:class extends ro{constructor(t){super(t,pf);}getProgramIds(){return [this.paint.get("background-pattern")?"backgroundPattern":"background"]}},raster:class extends ro{constructor(t){super(t,df);}getProgramIds(){return ["raster"]}},sky:class extends ro{constructor(t){super(t,yf),this._updateColorRamp();}_handleSpecialPaintPropertyUpdate(t){"sky-gradient"===t?this._updateColorRamp():"sky-atmosphere-sun"!==t&&"sky-atmosphere-halo-color"!==t&&"sky-atmosphere-color"!==t&&"sky-atmosphere-sun-intensity"!==t||(this._skyboxInvalidated=!0);}_updateColorRamp(){this.colorRamp=ju({expression:this._transitionablePaint._values["sky-gradient"].value.expression,evaluationKey:"skyRadialProgress"}),this.colorRampTexture&&(this.colorRampTexture.destroy(),this.colorRampTexture=null);}needsSkyboxCapture(t){if(this._skyboxInvalidated||!this.skyboxTexture||!this.skyboxGeometry)return !0;if(!this.paint.get("sky-atmosphere-sun")){const e=t.style.light.properties.get("position");return this._lightPosition.azimuthal!==e.azimuthal||this._lightPosition.polar!==e.polar}return !1}getCenter(t,e){if("atmosphere"===this.paint.get("sky-type")){const r=this.paint.get("sky-atmosphere-sun"),n=!r,i=t.style.light,s=i.properties.get("position");return n&&"viewport"===i.properties.get("anchor")&&N("The sun direction is attached to a light with viewport anchor, lighting may behave unexpectedly."),n?mf(s.azimuthal,90-s.polar,e):mf(r[0],90-r[1],e)}const r=this.paint.get("sky-gradient-center");return mf(r[0],90-r[1],e)}is3D(){return !1}isSky(){return !0}markSkyboxValid(t){this._skyboxInvalidated=!1,this._lightPosition=t.style.light.properties.get("position");}hasOffscreenPass(){return !0}getProgramIds(){const t=this.paint.get("sky-type");return "atmosphere"===t?["skyboxCapture","skybox"]:"gradient"===t?["skyboxGradient"]:null}}};class xf{constructor(t,e,r,n){this.context=t,this.format=r,this.texture=t.gl.createTexture(),this.update(e,n);}update(t,r,n){const{width:i,height:s}=t,{context:a}=this,{gl:o}=a,{HTMLImageElement:l,HTMLCanvasElement:u,HTMLVideoElement:c,ImageData:h,ImageBitmap:p}=e;if(o.bindTexture(o.TEXTURE_2D,this.texture),a.pixelStoreUnpackFlipY.set(!1),a.pixelStoreUnpack.set(1),a.pixelStoreUnpackPremultiplyAlpha.set(this.format===o.RGBA&&(!r||!1!==r.premultiply)),n||this.size&&this.size[0]===i&&this.size[1]===s){const{x:e,y:r}=n||{x:0,y:0};t instanceof l||t instanceof u||t instanceof c||t instanceof h||p&&t instanceof p?o.texSubImage2D(o.TEXTURE_2D,0,e,r,o.RGBA,o.UNSIGNED_BYTE,t):o.texSubImage2D(o.TEXTURE_2D,0,e,r,i,s,o.RGBA,o.UNSIGNED_BYTE,t.data);}else this.size=[i,s],t instanceof l||t instanceof u||t instanceof c||t instanceof h||p&&t instanceof p?o.texImage2D(o.TEXTURE_2D,0,this.format,this.format,o.UNSIGNED_BYTE,t):o.texImage2D(o.TEXTURE_2D,0,this.format,i,s,0,this.format,o.UNSIGNED_BYTE,t.data);this.useMipmap=Boolean(r&&r.useMipmap&&this.isSizePowerOfTwo()),this.useMipmap&&o.generateMipmap(o.TEXTURE_2D);}bind(t,e){const{context:r}=this,{gl:n}=r;n.bindTexture(n.TEXTURE_2D,this.texture),t!==this.filter&&(n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,t),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,this.useMipmap?t===n.NEAREST?n.NEAREST_MIPMAP_NEAREST:n.LINEAR_MIPMAP_NEAREST:t),this.filter=t),e!==this.wrap&&(n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,e),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,e),this.wrap=e);}isSizePowerOfTwo(){return this.size[0]===this.size[1]&&Math.log(this.size[0])/Math.LN2%1==0}destroy(){const{gl:t}=this.context;t.deleteTexture(this.texture),this.texture=null;}}class vf{constructor(t){this._callback=t,this._triggered=!1,"undefined"!=typeof MessageChannel&&(this._channel=new MessageChannel,this._channel.port2.onmessage=()=>{this._triggered=!1,this._callback();});}trigger(){this._triggered||(this._triggered=!0,this._channel?this._channel.port1.postMessage(!0):setTimeout((()=>{this._triggered=!1,this._callback();}),0));}remove(){this._channel=void 0,this._callback=()=>{};}}class bf{constructor(){this.tasks={},this.taskQueue=[],R(["process"],this),this.invoker=new vf(this.process),this.nextId=0;}add(t,e){const r=this.nextId++,n=function({type:t,isSymbolTile:e,zoom:r}){return r=r||0,"message"===t?0:"maybePrepare"!==t||e?"parseTile"!==t||e?"parseTile"===t&&e?300-r:"maybePrepare"===t&&e?400-r:500:200-r:100-r}(e);if(0===n){K();try{t();}finally{}return {cancel:()=>{}}}return this.tasks[r]={fn:t,metadata:e,priority:n,id:r},this.taskQueue.push(r),this.invoker.trigger(),{cancel:()=>{delete this.tasks[r];}}}process(){K();try{if(this.taskQueue=this.taskQueue.filter((t=>!!this.tasks[t])),!this.taskQueue.length)return;const t=this.pick();if(null===t)return;const e=this.tasks[t];if(delete this.tasks[t],this.taskQueue.length&&this.invoker.trigger(),!e)return;e.fn();}finally{}}pick(){let t=null,e=1/0;for(let r=0;r<this.taskQueue.length;r++){const n=this.tasks[this.taskQueue[r]];n.priority<e&&(e=n.priority,t=r);}if(null===t)return null;const r=this.taskQueue[t];return this.taskQueue.splice(t,1),r}remove(){this.invoker.remove();}}class wf{constructor(t){this._stringToNumber={},this._numberToString=[];for(let e=0;e<t.length;e++){const r=t[e];this._stringToNumber[r]=e,this._numberToString[e]=r;}}encode(t){return this._stringToNumber[t]}decode(t){return this._numberToString[t]}}const _f=["tile","layer","source","sourceLayer","state"];class Af{constructor(t,e,r,n,i){this.type="Feature",this._vectorTileFeature=t,this._z=e,this._x=r,this._y=n,this.properties=t.properties,this.id=i;}get geometry(){return void 0===this._geometry&&(this._geometry=this._vectorTileFeature.toGeoJSON(this._x,this._y,this._z).geometry),this._geometry}set geometry(t){this._geometry=t;}toJSON(){const t={type:"Feature",state:void 0,geometry:this.geometry,properties:this.properties};void 0!==this.id&&(t.id=this.id);for(const e of _f)void 0!==this[e]&&(t[e]=this[e]);return t}}const Sf=32,kf=33,If=new Uint16Array(8184);for(let t=0;t<2046;t++){let e=t+2,r=0,n=0,i=0,s=0,a=0,o=0;for(1&e?i=s=a=Sf:r=n=o=Sf;(e>>=1)>1;){const t=r+i>>1,l=n+s>>1;1&e?(i=r,s=n,r=a,n=o):(r=i,n=s,i=a,s=o),a=t,o=l;}const l=4*t;If[l+0]=r,If[l+1]=n,If[l+2]=i,If[l+3]=s;}const Mf=new Uint16Array(2178),Tf=new Uint8Array(1089),zf=new Uint16Array(1089);function Bf(t){return 0===t?-.03125:32===t?.03125:0}var Ef=Rs([{name:"a_pos",type:"Int16",components:2},{name:"a_texture_pos",type:"Int16",components:2}]);const Cf={type:2,extent:ao,loadGeometry:()=>[[new x(0,0),new x(ao+1,0),new x(ao+1,ao+1),new x(0,ao+1),new x(0,0)]]};class Pf{constructor(t,e,r,n,i){this.tileID=t,this.uid=D(),this.uses=0,this.tileSize=e,this.tileZoom=r,this.buckets={},this.expirationTime=null,this.queryPadding=0,this.hasSymbolBuckets=!1,this.hasRTLText=!1,this.dependencies={},this.isRaster=i,this.expiredRequestCount=0,this.state="loading",n&&n.transform&&(this.projection=n.transform.projection);}registerFadeDuration(t){const e=t+this.timeAdded;e<Xt.now()||this.fadeEndTime&&e<this.fadeEndTime||(this.fadeEndTime=e);}wasRequested(){return "errored"===this.state||"loaded"===this.state||"reloading"===this.state}get tileTransform(){return this._tileTransform||(this._tileTransform=Bd(this.tileID.canonical,this.projection)),this._tileTransform}loadVectorData(t,e,r){if(this.unloadVectorData(),this.state="loaded",t){t.featureIndex&&(this.latestFeatureIndex=t.featureIndex,t.rawTileData?(this.latestRawTileData=t.rawTileData,this.latestFeatureIndex.rawTileData=t.rawTileData):this.latestRawTileData&&(this.latestFeatureIndex.rawTileData=this.latestRawTileData)),this.collisionBoxArray=t.collisionBoxArray,this.buckets=function(t,e){const r={};if(!e)return r;for(const n of t){const t=n.layerIds.map((t=>e.getLayer(t))).filter(Boolean);if(0!==t.length){n.layers=t,n.stateDependentLayerIds&&(n.stateDependentLayers=n.stateDependentLayerIds.map((e=>t.filter((t=>t.id===e))[0])));for(const e of t)r[e.id]=n;}}return r}(t.buckets,e.style),this.hasSymbolBuckets=!1;for(const t in this.buckets){const e=this.buckets[t];if(e instanceof of){if(this.hasSymbolBuckets=!0,!r)break;e.justReloaded=!0;}}if(this.hasRTLText=!1,this.hasSymbolBuckets)for(const t in this.buckets){const e=this.buckets[t];if(e instanceof of&&e.hasRTLText){this.hasRTLText=!0,bs.isLoading()||bs.isLoaded()||"deferred"!==xs()||vs();break}}this.queryPadding=0;for(const t in this.buckets){const r=this.buckets[t];this.queryPadding=Math.max(this.queryPadding,e.style.getLayer(t).queryRadius(r));}t.imageAtlas&&(this.imageAtlas=t.imageAtlas),t.glyphAtlasImage&&(this.glyphAtlasImage=t.glyphAtlasImage),t.lineAtlas&&(this.lineAtlas=t.lineAtlas);}else this.collisionBoxArray=new pa;}unloadVectorData(){if(this.hasData()){for(const t in this.buckets)this.buckets[t].destroy();this.buckets={},this.imageAtlas&&(this.imageAtlas=null),this.lineAtlas&&(this.lineAtlas=null),this.imageAtlasTexture&&this.imageAtlasTexture.destroy(),this.glyphAtlasTexture&&this.glyphAtlasTexture.destroy(),this.lineAtlasTexture&&this.lineAtlasTexture.destroy(),this._tileBoundsBuffer&&(this._tileBoundsBuffer.destroy(),this._tileBoundsIndexBuffer.destroy(),this._tileBoundsSegments.destroy(),this._tileBoundsBuffer=null),this._tileDebugBuffer&&(this._tileDebugBuffer.destroy(),this._tileDebugSegments.destroy(),this._tileDebugBuffer=null),this._tileDebugIndexBuffer&&(this._tileDebugIndexBuffer.destroy(),this._tileDebugIndexBuffer=null),this._globeTileDebugBorderBuffer&&(this._globeTileDebugBorderBuffer.destroy(),this._globeTileDebugBorderBuffer=null),this._tileDebugTextBuffer&&(this._tileDebugTextBuffer.destroy(),this._tileDebugTextSegments.destroy(),this._tileDebugTextIndexBuffer.destroy(),this._tileDebugTextBuffer=null),this._globeTileDebugTextBuffer&&(this._globeTileDebugTextBuffer.destroy(),this._globeTileDebugTextBuffer=null),this.latestFeatureIndex=null,this.state="unloaded";}}getBucket(t){return this.buckets[t.id]}upload(t){for(const e in this.buckets){const r=this.buckets[e];r.uploadPending()&&r.upload(t);}const e=t.gl;this.imageAtlas&&!this.imageAtlas.uploaded&&(this.imageAtlasTexture=new xf(t,this.imageAtlas.image,e.RGBA),this.imageAtlas.uploaded=!0),this.glyphAtlasImage&&(this.glyphAtlasTexture=new xf(t,this.glyphAtlasImage,e.ALPHA),this.glyphAtlasImage=null),this.lineAtlas&&!this.lineAtlas.uploaded&&(this.lineAtlasTexture=new xf(t,this.lineAtlas.image,e.ALPHA),this.lineAtlas.uploaded=!0);}prepare(t){this.imageAtlas&&this.imageAtlas.patchUpdatedImages(t,this.imageAtlasTexture);}queryRenderedFeatures(t,e,r,n,i,s,a,o){return this.latestFeatureIndex&&this.latestFeatureIndex.rawTileData?this.latestFeatureIndex.query({tileResult:n,pixelPosMatrix:a,transform:s,params:i,tileTransform:this.tileTransform},t,e,r):{}}querySourceFeatures(t,e){const r=this.latestFeatureIndex;if(!r||!r.rawTileData)return;const n=r.loadVTLayers(),i=e?e.sourceLayer:"",s=n._geojsonTileLayer||n[i];if(!s)return;const a=hi(e&&e.filter),{z:o,x:l,y:u}=this.tileID.canonical,c={z:o,x:l,y:u};for(let e=0;e<s.length;e++){const n=s.feature(e);if(a.needGeometry){const t=ou(n,!0);if(!a.filter(new ws(this.tileID.overscaledZ),t,this.tileID.canonical))continue}else if(!a.filter(new ws(this.tileID.overscaledZ),n))continue;const h=r.getId(n,i),p=new Af(n,o,l,u,h);p.tile=c,t.push(p);}}hasData(){return "loaded"===this.state||"reloading"===this.state||"expired"===this.state}patternsLoaded(){return !!this.imageAtlas&&!!Object.keys(this.imageAtlas.patternPositions).length}setExpiryData(t){const e=this.expirationTime;if(t.cacheControl){const e=X(t.cacheControl);e["max-age"]&&(this.expirationTime=Date.now()+1e3*e["max-age"]);}else t.expires&&(this.expirationTime=new Date(t.expires).getTime());if(this.expirationTime){const t=Date.now();let r=!1;if(this.expirationTime>t)r=!1;else if(e)if(this.expirationTime<e)r=!0;else {const n=this.expirationTime-e;n?this.expirationTime=t+Math.max(n,3e4):r=!0;}else r=!0;r?(this.expiredRequestCount++,this.state="expired"):this.expiredRequestCount=0;}}getExpiryTimeout(){if(this.expirationTime)return this.expiredRequestCount?1e3*(1<<Math.min(this.expiredRequestCount-1,31)):Math.min(this.expirationTime-(new Date).getTime(),Math.pow(2,31)-1)}setFeatureState(t,e){if(!this.latestFeatureIndex||!this.latestFeatureIndex.rawTileData||0===Object.keys(t).length||!e)return;const r=this.latestFeatureIndex.loadVTLayers(),n=e.style.listImages();for(const i in this.buckets){if(!e.style.hasLayer(i))continue;const s=this.buckets[i],a=s.layers[0].sourceLayer||"_geojsonTileLayer",o=r[a],l=t[a];if(!o||!l||0===Object.keys(l).length)continue;if(s.update(l,o,n,this.imageAtlas&&this.imageAtlas.patternPositions||{}),s instanceof Ih||s instanceof Mc){const t=e.style._getSourceCache(s.layers[0].source);e._terrain&&e._terrain.enabled&&t&&s.programConfigurations.needsUpload&&e._terrain._clearRenderCacheForTile(t.id,this.tileID);}const u=e&&e.style&&e.style.getLayer(i);u&&(this.queryPadding=Math.max(this.queryPadding,u.queryRadius(s)));}}holdingForFade(){return void 0!==this.symbolFadeHoldUntil}symbolFadeFinished(){return !this.symbolFadeHoldUntil||this.symbolFadeHoldUntil<Xt.now()}clearFadeHold(){this.symbolFadeHoldUntil=void 0;}setHoldDuration(t){this.symbolFadeHoldUntil=Xt.now()+t;}setTexture(t,e){const r=e.context,n=r.gl;this.texture=this.texture||e.getTileTexture(t.width),this.texture?this.texture.update(t,{useMipmap:!0}):(this.texture=new xf(r,t,n.RGBA,{useMipmap:!0}),this.texture.bind(n.LINEAR,n.CLAMP_TO_EDGE));}setDependencies(t,e){const r={};for(const t of e)r[t]=!0;this.dependencies[t]=r;}hasDependency(t,e){for(const r of t){const t=this.dependencies[r];if(t)for(const r of e)if(t[r])return !0}return !1}clearQueryDebugViz(){}_makeDebugTileBoundsBuffers(t,e){if(!e||"mercator"===e.name||this._tileDebugBuffer)return;const r=au(Cf,this.tileID.canonical,this.tileTransform)[0],n=new $s,i=new ua;for(let t=0;t<r.length;t++){const{x:e,y:s}=r[t];n.emplaceBack(e,s),i.emplaceBack(t);}i.emplaceBack(0),this._tileDebugIndexBuffer=t.createIndexBuffer(i),this._tileDebugBuffer=t.createVertexBuffer(n,tl.members),this._tileDebugSegments=so.simpleSegment(0,0,n.length,i.length);}_makeTileBoundsBuffers(t,e){if(this._tileBoundsBuffer||!e||"mercator"===e.name)return;const r=au(Cf,this.tileID.canonical,this.tileTransform)[0];let n,i;if(this.isRaster){const t=function(t,e){const r=Bd(t,e),n=Math.pow(2,t.z);for(let i=0;i<kf;i++)for(let s=0;s<kf;s++){const a=Kl((t.x+(s+Bf(s))/Sf)/n),o=Xl((t.y+(i+Bf(i))/Sf)/n),l=e.project(a,o),u=i*kf+s;Mf[2*u+0]=Math.round((l.x*r.scale-r.x)*ao),Mf[2*u+1]=Math.round((l.y*r.scale-r.y)*ao);}Tf.fill(0),zf.fill(0);for(let t=2045;t>=0;t--){const e=4*t,r=If[e+0],n=If[e+1],i=If[e+2],s=If[e+3],a=r+i>>1,o=n+s>>1,l=a+o-n,u=o+r-a,c=n*kf+r,h=s*kf+i,p=o*kf+a,d=Math.hypot((Mf[2*c+0]+Mf[2*h+0])/2-Mf[2*p+0],(Mf[2*c+1]+Mf[2*h+1])/2-Mf[2*p+1])>=16;Tf[p]=Tf[p]||(d?1:0),t<1022&&(Tf[p]=Tf[p]||Tf[(n+u>>1)*kf+(r+l>>1)]||Tf[(s+u>>1)*kf+(i+l>>1)]);}const i=new Os,s=new ra;let a=0;function o(t,e){const r=e*kf+t;return 0===zf[r]&&(i.emplaceBack(Mf[2*r+0],Mf[2*r+1],t*ao/Sf,e*ao/Sf),zf[r]=++a),zf[r]-1}function l(t,e,r,n,i,a){const u=t+r>>1,c=e+n>>1;if(Math.abs(t-i)+Math.abs(e-a)>1&&Tf[c*kf+u])l(i,a,t,e,u,c),l(r,n,i,a,u,c);else {const l=o(t,e),u=o(r,n),c=o(i,a);s.emplaceBack(l,u,c);}}return l(0,0,Sf,Sf,Sf,0),l(Sf,Sf,0,0,0,Sf),{vertices:i,indices:s}}(this.tileID.canonical,e);n=t.vertices,i=t.indices;}else {n=new Os,i=new ra;for(const{x:t,y:e}of r)n.emplaceBack(t,e,0,0);const t=xc(n.int16,void 0,4);for(let e=0;e<t.length;e+=3)i.emplaceBack(t[e],t[e+1],t[e+2]);}this._tileBoundsBuffer=t.createVertexBuffer(n,Ef.members),this._tileBoundsIndexBuffer=t.createIndexBuffer(i),this._tileBoundsSegments=so.simpleSegment(0,0,n.length,i.length);}_makeGlobeTileDebugBuffers(t,e){const r=e.projection;if(!r||"globe"!==r.name||e.freezeTileCoverage)return;const n=this.tileID.canonical,i=Bl(bl(n,e)),s=Pl(e.zoom);let a;s>0&&(a=fo(new Float64Array(16),e.globeMatrix)),this._makeGlobeTileDebugBorderBuffer(t,n,e,i,a,s),this._makeGlobeTileDebugTextBuffer(t,n,e,i,a,s);}_globePoint(t,e,r,n,i,s,a){let o=Ml(t,e,r);if(s){const i=1<<r.z,l=Nl(n.center.lng),u=Gl(n.center.lat),c=(r.x+.5)/i-l;let h=0;c>.5?h=-1:c<-.5&&(h=1);let p=(t/ao+r.x)/i+h,d=(e/ao+r.y)/i;p=(p-l)*n._pixelsPerMercatorPixel+l,d=(d-u)*n._pixelsPerMercatorPixel+u;const f=[p*n.worldSize,d*n.worldSize,0];Fo(f,f,s),o=vl(o,f,a);}return Fo(o,o,i)}_makeGlobeTileDebugBorderBuffer(t,e,r,n,i,s){const a=new $s,o=new ua,l=new js,u=(t,u,c,h,p)=>{const d=(c-t)/(p-1),f=(h-u)/(p-1),y=a.length;for(let c=0;c<p;c++){const h=t+c*d,p=u+c*f;a.emplaceBack(h,p);const m=this._globePoint(h,p,e,r,n,i,s);l.emplaceBack(m[0],m[1],m[2]),o.emplaceBack(y+c);}},c=ao;u(0,0,c,0,16),u(c,0,c,c,16),u(c,c,0,c,16),u(0,c,0,0,16),this._tileDebugIndexBuffer=t.createIndexBuffer(o),this._tileDebugBuffer=t.createVertexBuffer(a,tl.members),this._globeTileDebugBorderBuffer=t.createVertexBuffer(l,Qo.members),this._tileDebugSegments=so.simpleSegment(0,0,a.length,o.length);}_makeGlobeTileDebugTextBuffer(t,e,r,n,i,s){const a=ao/4,o=new $s,l=new ra,u=new js,c=25;l.reserve(32),o.reserve(c),u.reserve(c);const h=(t,e)=>c*t+e;for(let t=0;t<c;t++){const l=t*a;for(let t=0;t<c;t++){const c=t*a;o.emplaceBack(c,l);const h=this._globePoint(c,l,e,r,n,i,s);u.emplaceBack(h[0],h[1],h[2]);}}for(let t=0;t<4;t++)for(let e=0;e<4;e++){const r=h(t,e),n=h(t,e+1),i=h(t+1,e),s=h(t+1,e+1);l.emplaceBack(r,n,i),l.emplaceBack(i,n,s);}this._tileDebugTextIndexBuffer=t.createIndexBuffer(l),this._tileDebugTextBuffer=t.createVertexBuffer(o,tl.members),this._globeTileDebugTextBuffer=t.createVertexBuffer(u,Qo.members),this._tileDebugTextSegments=so.simpleSegment(0,0,c,32);}}class Df{constructor(){this.state={},this.stateChanges={},this.deletedStates={};}updateState(t,e,r){const n=String(e);if(this.stateChanges[t]=this.stateChanges[t]||{},this.stateChanges[t][n]=this.stateChanges[t][n]||{},C(this.stateChanges[t][n],r),null===this.deletedStates[t]){this.deletedStates[t]={};for(const e in this.state[t])e!==n&&(this.deletedStates[t][e]=null);}else if(this.deletedStates[t]&&null===this.deletedStates[t][n]){this.deletedStates[t][n]={};for(const e in this.state[t][n])r[e]||(this.deletedStates[t][n][e]=null);}else for(const e in r)this.deletedStates[t]&&this.deletedStates[t][n]&&null===this.deletedStates[t][n][e]&&delete this.deletedStates[t][n][e];}removeFeatureState(t,e,r){if(null===this.deletedStates[t])return;const n=String(e);if(this.deletedStates[t]=this.deletedStates[t]||{},r&&void 0!==e)null!==this.deletedStates[t][n]&&(this.deletedStates[t][n]=this.deletedStates[t][n]||{},this.deletedStates[t][n][r]=null);else if(void 0!==e)if(this.stateChanges[t]&&this.stateChanges[t][n])for(r in this.deletedStates[t][n]={},this.stateChanges[t][n])this.deletedStates[t][n][r]=null;else this.deletedStates[t][n]=null;else this.deletedStates[t]=null;}getState(t,e){const r=String(e),n=C({},(this.state[t]||{})[r],(this.stateChanges[t]||{})[r]);if(null===this.deletedStates[t])return {};if(this.deletedStates[t]){const r=this.deletedStates[t][e];if(null===r)return {};for(const t in r)delete n[t];}return n}initializeTileState(t,e){t.setFeatureState(this.state,e);}coalesceChanges(t,e){const r={};for(const t in this.stateChanges){this.state[t]=this.state[t]||{};const e={};for(const r in this.stateChanges[t])this.state[t][r]||(this.state[t][r]={}),C(this.state[t][r],this.stateChanges[t][r]),e[r]=this.state[t][r];r[t]=e;}for(const t in this.deletedStates){this.state[t]=this.state[t]||{};const e={};if(null===this.deletedStates[t])for(const r in this.state[t])e[r]={},this.state[t][r]={};else for(const r in this.deletedStates[t]){if(null===this.deletedStates[t][r])this.state[t][r]={};else if(this.state[t][r])for(const e of Object.keys(this.deletedStates[t][r]))delete this.state[t][r][e];e[r]=this.state[t][r];}r[t]=r[t]||{},C(r[t],e);}if(this.stateChanges={},this.deletedStates={},0!==Object.keys(r).length)for(const n in t)t[n].setFeatureState(r,e);}}class Vf{constructor(t){this.size=t,this.minimums=[],this.maximums=[],this.leaves=[];}getElevation(t,e){const r=this.toIdx(t,e);return {min:this.minimums[r],max:this.maximums[r]}}isLeaf(t,e){return this.leaves[this.toIdx(t,e)]}toIdx(t,e){return e*this.size+t}}function Lf(t,e,r,n){let i=0,s=Number.MAX_VALUE;for(let a=0;a<3;a++)if(Math.abs(n[a])<1e-15){if(r[a]<t[a]||r[a]>e[a])return null}else {const o=1/n[a];let l=(t[a]-r[a])*o,u=(e[a]-r[a])*o;if(l>u){const t=l;l=u,u=t;}if(l>i&&(i=l),u<s&&(s=u),i>s)return null}return i}function Ff(t,e,r,n,i,s,a,o,l,u,c){const h=n-t,p=i-e,d=s-r,f=a-t,y=o-e,m=l-r,g=c[1]*m-c[2]*y,x=c[2]*f-c[0]*m,v=c[0]*y-c[1]*f,b=h*g+p*x+d*v;if(Math.abs(b)<1e-15)return null;const w=1/b,_=u[0]-t,A=u[1]-e,S=u[2]-r,k=(_*g+A*x+S*v)*w;if(k<0||k>1)return null;const I=A*d-S*p,M=S*h-_*d,T=_*p-A*h,z=(c[0]*I+c[1]*M+c[2]*T)*w;return z<0||k+z>1?null:(f*I+y*M+m*T)*w}function Rf(t,e,r){return (t-e)/(r-e)}function Uf(t,e,r,n,i,s,a,o,l){const u=1<<r,c=s-n,h=a-i,p=(t+1)/u*c+n,d=(e+0)/u*h+i,f=(e+1)/u*h+i;o[0]=(t+0)/u*c+n,o[1]=d,l[0]=p,l[1]=f;}class $f{constructor(t){if(this.maximums=[],this.minimums=[],this.leaves=[],this.childOffsets=[],this.nodeCount=0,this.dem=t,this._siblingOffset=[[0,0],[1,0],[0,1],[1,1]],!this.dem)return;const e=function(t){const e=Math.ceil(Math.log2(t.dim/8)),r=[];let n=Math.ceil(Math.pow(2,e));const i=1/n,s=(t,e,r,n,i)=>{const s=n?1:0,a=(t+1)*r-s,o=e*r,l=(e+1)*r-s;i[0]=t*r,i[1]=o,i[2]=a,i[3]=l;};let a=new Vf(n);const o=[];for(let e=0;e<n*n;e++){s(e%n,Math.floor(e/n),i,!1,o);const r=Of(o[0],o[1],t),l=Of(o[2],o[1],t),u=Of(o[2],o[3],t),c=Of(o[0],o[3],t);a.minimums.push(Math.min(r,l,u,c)),a.maximums.push(Math.max(r,l,u,c)),a.leaves.push(1);}for(r.push(a),n/=2;n>=1;n/=2){const t=r[r.length-1];a=new Vf(n);for(let e=0;e<n*n;e++){s(e%n,Math.floor(e/n),2,!0,o);const r=t.getElevation(o[0],o[1]),i=t.getElevation(o[2],o[1]),l=t.getElevation(o[2],o[3]),u=t.getElevation(o[0],o[3]),c=t.isLeaf(o[0],o[1]),h=t.isLeaf(o[2],o[1]),p=t.isLeaf(o[2],o[3]),d=t.isLeaf(o[0],o[3]),f=Math.min(r.min,i.min,l.min,u.min),y=Math.max(r.max,i.max,l.max,u.max),m=c&&h&&p&&d;a.maximums.push(y),a.minimums.push(f),a.leaves.push(y-f<=5&&m?1:0);}r.push(a);}return r}(this.dem),r=e.length-1,n=e[r];this._addNode(n.minimums[0],n.maximums[0],n.leaves[0]),this._construct(e,0,0,r,0);}raycastRoot(t,e,r,n,i,s,a=1){return Lf([t,e,-100],[r,n,this.maximums[0]*a],i,s)}raycast(t,e,r,n,i,s,a=1){if(!this.nodeCount)return null;const o=this.raycastRoot(t,e,r,n,i,s,a);if(null==o)return null;const l=[],u=[],c=[],h=[],p=[{idx:0,t:o,nodex:0,nodey:0,depth:0}];for(;p.length>0;){const{idx:o,t:d,nodex:f,nodey:y,depth:m}=p.pop();if(this.leaves[o]){Uf(f,y,m,t,e,r,n,c,h);const o=1<<m,l=(f+0)/o,u=(f+1)/o,p=(y+0)/o,g=(y+1)/o,x=Of(l,p,this.dem)*a,v=Of(u,p,this.dem)*a,b=Of(u,g,this.dem)*a,w=Of(l,g,this.dem)*a,_=Ff(c[0],c[1],x,h[0],c[1],v,h[0],h[1],b,i,s),A=Ff(h[0],h[1],b,c[0],h[1],w,c[0],c[1],x,i,s),S=Math.min(null!==_?_:Number.MAX_VALUE,null!==A?A:Number.MAX_VALUE);if(S!==Number.MAX_VALUE)return S;{const t=Po([],i,s,d);if(jf(x,v,w,b,Rf(t[0],c[0],h[0]),Rf(t[1],c[1],h[1]))>=t[2])return d}continue}let g=0;for(let p=0;p<this._siblingOffset.length;p++){Uf((f<<1)+this._siblingOffset[p][0],(y<<1)+this._siblingOffset[p][1],m+1,t,e,r,n,c,h),c[2]=-100,h[2]=this.maximums[this.childOffsets[o]+p]*a;const d=Lf(c,h,i,s);if(null!=d){const t=d;l[p]=t;let e=!1;for(let r=0;r<g&&!e;r++)t>=l[u[r]]&&(u.splice(r,0,p),e=!0);e||(u[g]=p),g++;}}for(let t=0;t<g;t++){const e=u[t];p.push({idx:this.childOffsets[o]+e,t:l[e],nodex:(f<<1)+this._siblingOffset[e][0],nodey:(y<<1)+this._siblingOffset[e][1],depth:m+1});}}return null}_addNode(t,e,r){return this.minimums.push(t),this.maximums.push(e),this.leaves.push(r),this.childOffsets.push(0),this.nodeCount++}_construct(t,e,r,n,i){if(1===t[n].isLeaf(e,r))return;this.childOffsets[i]||(this.childOffsets[i]=this.nodeCount);const s=n-1,a=t[s];let o=0,l=0;for(let t=0;t<this._siblingOffset.length;t++){const n=2*e+this._siblingOffset[t][0],i=2*r+this._siblingOffset[t][1],s=a.getElevation(n,i),u=a.isLeaf(n,i),c=this._addNode(s.min,s.max,u);u&&(o|=1<<t),l||(l=c);}for(let n=0;n<this._siblingOffset.length;n++)o&1<<n||this._construct(t,2*e+this._siblingOffset[n][0],2*r+this._siblingOffset[n][1],s,l+n);}}function jf(t,e,r,n,i,s){return Er(Er(t,r,s),Er(e,n,s),i)}function Of(t,e,r){const n=r.dim,i=M(t*n-.5,0,n-1),s=M(e*n-.5,0,n-1),a=Math.floor(i),o=Math.floor(s),l=Math.min(a+1,n-1),u=Math.min(o+1,n-1);return jf(r.get(a,o),r.get(l,o),r.get(a,u),r.get(l,u),i-a,s-o)}const qf={mapbox:[6553.6,25.6,.1,1e4],terrarium:[256,1,1/256,32768]};function Nf(t,e,r){return (256*t*256+256*e+r)/10-1e4}function Gf(t,e,r){return 256*t+e+r/256-32768}class Zf{get tree(){return this._tree||this._buildQuadTree(),this._tree}constructor(t,e,r,n=!1,i=!1){if(this.uid=t,e.height!==e.width)throw new RangeError("DEM tiles must be square");if(r&&"mapbox"!==r&&"terrarium"!==r)return N(`"${r}" is not a valid encoding type. Valid types include "mapbox" and "terrarium".`);this.stride=e.height;const s=this.dim=e.height-2,a=new Uint32Array(e.data.buffer);if(this.pixels=new Uint8Array(e.data.buffer),this.encoding=r||"mapbox",this.borderReady=n,!n){for(let t=0;t<s;t++)a[this._idx(-1,t)]=a[this._idx(0,t)],a[this._idx(s,t)]=a[this._idx(s-1,t)],a[this._idx(t,-1)]=a[this._idx(t,0)],a[this._idx(t,s)]=a[this._idx(t,s-1)];a[this._idx(-1,-1)]=a[this._idx(0,0)],a[this._idx(s,-1)]=a[this._idx(s-1,0)],a[this._idx(-1,s)]=a[this._idx(0,s-1)],a[this._idx(s,s)]=a[this._idx(s-1,s-1)],i&&this._buildQuadTree();}}_buildQuadTree(){this._tree=new $f(this);}get(t,e,r=!1){r&&(t=M(t,-1,this.dim),e=M(e,-1,this.dim));const n=4*this._idx(t,e);return ("terrarium"===this.encoding?Gf:Nf)(this.pixels[n],this.pixels[n+1],this.pixels[n+2])}static getUnpackVector(t){return qf[t]}get unpackVector(){return qf[this.encoding]}_idx(t,e){if(t<-1||t>=this.dim+1||e<-1||e>=this.dim+1)throw new RangeError("out of range source coordinates for DEM data");return (e+1)*this.stride+(t+1)}static pack(t,e){const r=[0,0,0,0],n=Zf.getUnpackVector(e);let i=Math.floor((t+n[3])/n[2]);return r[2]=i%256,i=Math.floor(i/256),r[1]=i%256,i=Math.floor(i/256),r[0]=i,r}getPixels(){return new Uu({width:this.stride,height:this.stride},this.pixels)}backfillBorder(t,e,r){if(this.dim!==t.dim)throw new Error("dem dimension mismatch");let n=e*this.dim,i=e*this.dim+this.dim,s=r*this.dim,a=r*this.dim+this.dim;switch(e){case-1:n=i-1;break;case 1:i=n+1;}switch(r){case-1:s=a-1;break;case 1:a=s+1;}const o=-e*this.dim,l=-r*this.dim;for(let e=s;e<a;e++)for(let r=n;r<i;r++){const n=4*this._idx(r,e),i=4*this._idx(r+o,e+l);this.pixels[n+0]=t.pixels[i+0],this.pixels[n+1]=t.pixels[i+1],this.pixels[n+2]=t.pixels[i+2],this.pixels[n+3]=t.pixels[i+3];}}onDeserialize(){this._tree&&(this._tree.dem=this);}}Ji(Zf,"DEMData"),Ji($f,"DemMinMaxQuadTree",{omit:["dem"]});class Kf{constructor(t,e){this.max=t,this.onRemove=e,this.reset();}reset(){for(const t in this.data)for(const e of this.data[t])e.timeout&&clearTimeout(e.timeout),this.onRemove(e.value);return this.data={},this.order=[],this}add(t,e,r){const n=t.wrapped().key;void 0===this.data[n]&&(this.data[n]=[]);const i={value:e,timeout:void 0};if(void 0!==r&&(i.timeout=setTimeout((()=>{this.remove(t,i);}),r)),this.data[n].push(i),this.order.push(n),this.order.length>this.max){const t=this._getAndRemoveByKey(this.order[0]);t&&this.onRemove(t);}return this}has(t){return t.wrapped().key in this.data}getAndRemove(t){return this.has(t)?this._getAndRemoveByKey(t.wrapped().key):null}_getAndRemoveByKey(t){const e=this.data[t].shift();return e.timeout&&clearTimeout(e.timeout),0===this.data[t].length&&delete this.data[t],this.order.splice(this.order.indexOf(t),1),e.value}getByKey(t){const e=this.data[t];return e?e[0].value:null}get(t){return this.has(t)?this.data[t.wrapped().key][0].value:null}remove(t,e){if(!this.has(t))return this;const r=t.wrapped().key,n=void 0===e?0:this.data[r].indexOf(e),i=this.data[r][n];return this.data[r].splice(n,1),i.timeout&&clearTimeout(i.timeout),0===this.data[r].length&&delete this.data[r],this.onRemove(i.value),this.order.splice(this.order.indexOf(r),1),this}setMaxSize(t){for(this.max=t;this.order.length>this.max;){const t=this._getAndRemoveByKey(this.order[0]);t&&this.onRemove(t);}return this}filter(t){const e=[];for(const r in this.data)for(const n of this.data[r])t(n.value)||e.push(n);for(const t of e)this.remove(t.value.tileID,t);}}class Xf{constructor(t,e,r){this.func=t,this.mask=e,this.range=r;}}Xf.ReadOnly=!1,Xf.ReadWrite=!0,Xf.disabled=new Xf(519,Xf.ReadOnly,[0,1]);const Jf=7680;class Hf{constructor(t,e,r,n,i,s){this.test=t,this.ref=e,this.mask=r,this.fail=n,this.depthFail=i,this.pass=s;}}Hf.disabled=new Hf({func:519,mask:0},0,0,Jf,Jf,Jf);class Yf{constructor(t,e,r){this.blendFunction=t,this.blendColor=e,this.mask=r;}}Yf.Replace=[1,0],Yf.disabled=new Yf(Yf.Replace,Ee.transparent,[!1,!1,!1,!1]),Yf.unblended=new Yf(Yf.Replace,Ee.transparent,[!0,!0,!0,!0]),Yf.alphaBlended=new Yf([1,771],Ee.transparent,[!0,!0,!0,!0]);const Wf=1029,Qf=2305;class ty{constructor(t,e,r){this.enable=t,this.mode=e,this.frontFace=r;}}ty.disabled=new ty(!1,Wf,Qf),ty.backCCW=new ty(!0,Wf,Qf),ty.backCW=new ty(!0,Wf,2304),ty.frontCW=new ty(!0,1028,2304),ty.frontCCW=new ty(!0,1028,Qf);class ey extends Qt{constructor(t,e,r){super(),this.id=t,this._onlySymbols=r,e.on("data",(t=>{"source"===t.dataType&&"metadata"===t.sourceDataType&&(this._sourceLoaded=!0),this._sourceLoaded&&!this._paused&&"source"===t.dataType&&"content"===t.sourceDataType&&(this.reload(),this.transform&&this.update(this.transform));})),e.on("error",(()=>{this._sourceErrored=!0;})),this._source=e,this._tiles={},this._cache=new Kf(0,this._unloadTile.bind(this)),this._timers={},this._cacheTimers={},this._minTileCacheSize=e.minTileCacheSize,this._maxTileCacheSize=e.maxTileCacheSize,this._loadedParentTiles={},this._coveredTiles={},this._state=new Df,this._isRaster="raster"===this._source.type||"raster-dem"===this._source.type||"custom"===this._source.type&&"raster"===this._source._dataType;}onAdd(t){this.map=t,this._minTileCacheSize=void 0===this._minTileCacheSize&&t?t._minTileCacheSize:this._minTileCacheSize,this._maxTileCacheSize=void 0===this._maxTileCacheSize&&t?t._maxTileCacheSize:this._maxTileCacheSize;}loaded(){if(this._sourceErrored)return !0;if(!this._sourceLoaded)return !1;if(!this._source.loaded())return !1;for(const t in this._tiles){const e=this._tiles[t];if("loaded"!==e.state&&"errored"!==e.state)return !1}return !0}getSource(){return this._source}pause(){this._paused=!0;}resume(){if(!this._paused)return;const t=this._shouldReloadOnResume;this._paused=!1,this._shouldReloadOnResume=!1,t&&this.reload(),this.transform&&this.update(this.transform);}_loadTile(t,e){return t.isSymbolTile=this._onlySymbols,this._source.loadTile(t,e)}_unloadTile(t){if(this._source.unloadTile)return this._source.unloadTile(t,(()=>{}))}_abortTile(t){if(this._source.abortTile)return this._source.abortTile(t,(()=>{}))}serialize(){return this._source.serialize()}prepare(t){this._source.prepare&&this._source.prepare(),this._state.coalesceChanges(this._tiles,this.map?this.map.painter:null);for(const e in this._tiles){const r=this._tiles[e];r.upload(t),r.prepare(this.map.style.imageManager);}}getIds(){return E(this._tiles).map((t=>t.tileID)).sort(ry).map((t=>t.key))}getRenderableIds(t){const e=[];for(const r in this._tiles)this._isIdRenderable(+r,t)&&e.push(this._tiles[r]);return t?e.sort(((t,e)=>{const r=t.tileID,n=e.tileID,i=new x(r.canonical.x,r.canonical.y)._rotate(this.transform.angle),s=new x(n.canonical.x,n.canonical.y)._rotate(this.transform.angle);return r.overscaledZ-n.overscaledZ||s.y-i.y||s.x-i.x})).map((t=>t.tileID.key)):e.map((t=>t.tileID)).sort(ry).map((t=>t.key))}hasRenderableParent(t){const e=this.findLoadedParent(t,0);return !!e&&this._isIdRenderable(e.tileID.key)}_isIdRenderable(t,e){return this._tiles[t]&&this._tiles[t].hasData()&&!this._coveredTiles[t]&&(e||!this._tiles[t].holdingForFade())}reload(){if(this._paused)this._shouldReloadOnResume=!0;else {this._cache.reset();for(const t in this._tiles)"errored"!==this._tiles[t].state&&this._reloadTile(+t,"reloading");}}_reloadTile(t,e){const r=this._tiles[t];r&&("loading"!==r.state&&(r.state=e),this._loadTile(r,this._tileLoaded.bind(this,r,t,e)));}_tileLoaded(t,e,r,n){if(n)if(t.state="errored",404!==n.status)this._source.fire(new Wt(n,{tile:t}));else if("raster-dem"===this._source.type&&this.usedForTerrain&&this.map.painter.terrain){const t=this.map.painter.terrain;this.update(this.transform,t.getScaledDemTileSize(),!0),t.resetTileLookupCache(this.id);}else this.update(this.transform);else t.timeAdded=Xt.now(),"expired"===r&&(t.refreshedUponExpiration=!0),this._setTileReloadTimer(e,t),"raster-dem"===this._source.type&&t.dem&&this._backfillDEM(t),this._state.initializeTileState(t,this.map?this.map.painter:null),this._source.fire(new Yt("data",{dataType:"source",tile:t,coord:t.tileID,sourceCacheId:this.id}));}_backfillDEM(t){const e=this.getRenderableIds();for(let n=0;n<e.length;n++){const i=e[n];if(t.neighboringTiles&&t.neighboringTiles[i]){const e=this.getTileByID(i);r(t,e),r(e,t);}}function r(t,e){if(!t.dem||t.dem.borderReady)return;t.needsHillshadePrepare=!0,t.needsDEMTextureUpload=!0;let r=e.tileID.canonical.x-t.tileID.canonical.x;const n=e.tileID.canonical.y-t.tileID.canonical.y,i=Math.pow(2,t.tileID.canonical.z),s=e.tileID.key;0===r&&0===n||Math.abs(n)>1||(Math.abs(r)>1&&(1===Math.abs(r+i)?r+=i:1===Math.abs(r-i)&&(r-=i)),e.dem&&t.dem&&(t.dem.backfillBorder(e.dem,r,n),t.neighboringTiles&&t.neighboringTiles[s]&&(t.neighboringTiles[s].backfilled=!0)));}}getTile(t){return this.getTileByID(t.key)}getTileByID(t){return this._tiles[t]}_retainLoadedChildren(t,e,r,n){for(const i in this._tiles){let s=this._tiles[i];if(n[i]||!s.hasData()||s.tileID.overscaledZ<=e||s.tileID.overscaledZ>r)continue;let a=s.tileID;for(;s&&s.tileID.overscaledZ>e+1;){const t=s.tileID.scaledTo(s.tileID.overscaledZ-1);s=this._tiles[t.key],s&&s.hasData()&&(a=t);}let o=a;for(;o.overscaledZ>e;)if(o=o.scaledTo(o.overscaledZ-1),t[o.key]){n[a.key]=a;break}}}findLoadedParent(t,e){if(t.key in this._loadedParentTiles){const r=this._loadedParentTiles[t.key];return r&&r.tileID.overscaledZ>=e?r:null}for(let r=t.overscaledZ-1;r>=e;r--){const e=t.scaledTo(r),n=this._getLoadedTile(e);if(n)return n}}_getLoadedTile(t){const e=this._tiles[t.key];return e&&e.hasData()?e:this._cache.getByKey(this._source.reparseOverscaled?t.wrapped().key:t.canonical.key)}updateCacheSize(t,e){e=e||this._source.tileSize;const r=Math.ceil(t.width/e)+1,n=Math.ceil(t.height/e)+1,i=Math.floor(r*n*5),s="number"==typeof this._minTileCacheSize?Math.max(this._minTileCacheSize,i):i,a="number"==typeof this._maxTileCacheSize?Math.min(this._maxTileCacheSize,s):s;this._cache.setMaxSize(a);}handleWrapJump(t){const e=Math.round((t-(void 0===this._prevLng?t:this._prevLng))/360);if(this._prevLng=t,e){const t={};for(const r in this._tiles){const n=this._tiles[r];n.tileID=n.tileID.unwrapTo(n.tileID.wrap+e),t[n.tileID.key]=n;}this._tiles=t;for(const t in this._timers)clearTimeout(this._timers[t]),delete this._timers[t];for(const t in this._tiles)this._setTileReloadTimer(+t,this._tiles[t]);}}update(t,e,r){if(this.transform=t,!this._sourceLoaded||this._paused||this.transform.freezeTileCoverage)return;if(this.usedForTerrain&&!r)return;let n;this.updateCacheSize(t,e),"globe"!==this.transform.projection.name&&this.handleWrapJump(this.transform.center.lng),this._coveredTiles={},this.used||this.usedForTerrain?this._source.tileID?n=t.getVisibleUnwrappedCoordinates(this._source.tileID).map((t=>new fh(t.canonical.z,t.wrap,t.canonical.z,t.canonical.x,t.canonical.y))):(n=t.coveringTiles({tileSize:e||this._source.tileSize,minzoom:this._source.minzoom,maxzoom:this._source.maxzoom,roundZoom:this._source.roundZoom&&!r,reparseOverscaled:this._source.reparseOverscaled,isTerrainDEM:this.usedForTerrain}),this._source.hasTile&&(n=n.filter((t=>this._source.hasTile(t))))):n=[];const i=this._updateRetainedTiles(n);if(ny(this._source.type)&&0!==n.length){const t={},e={},r=Object.keys(i);for(const n of r){const r=i[n],s=this._tiles[n];if(!s||s.fadeEndTime&&s.fadeEndTime<=Xt.now())continue;const a=this.findLoadedParent(r,Math.max(r.overscaledZ-ey.maxOverzooming,this._source.minzoom));a&&(this._addTile(a.tileID),t[a.tileID.key]=a.tileID),e[n]=r;}const s=n[n.length-1].overscaledZ;for(const t in this._tiles){const r=this._tiles[t];if(i[t]||!r.hasData())continue;let n=r.tileID;for(;n.overscaledZ>s;){n=n.scaledTo(n.overscaledZ-1);const s=this._tiles[n.key];if(s&&s.hasData()&&e[n.key]){i[t]=r.tileID;break}}}for(const e in t)i[e]||(this._coveredTiles[e]=!0,i[e]=t[e]);}for(const t in i)this._tiles[t].clearFadeHold();const s=function(t,e){const r=[];for(const n in t)n in e||r.push(n);return r}(this._tiles,i);for(const t of s){const e=this._tiles[t];e.hasSymbolBuckets&&!e.holdingForFade()?e.setHoldDuration(this.map._fadeDuration):e.hasSymbolBuckets&&!e.symbolFadeFinished()||this._removeTile(+t);}this._updateLoadedParentTileCache(),this._onlySymbols&&this._source.afterUpdate&&this._source.afterUpdate();}releaseSymbolFadeTiles(){for(const t in this._tiles)this._tiles[t].holdingForFade()&&this._removeTile(+t);}_updateRetainedTiles(t){const e={};if(0===t.length)return e;const r={},n=t.reduce(((t,e)=>Math.min(t,e.overscaledZ)),1/0),i=t[0].overscaledZ,s=Math.max(i-ey.maxOverzooming,this._source.minzoom),a=Math.max(i+ey.maxUnderzooming,this._source.minzoom),o={};for(const r of t){const t=this._addTile(r);e[r.key]=r,t.hasData()||n<this._source.maxzoom&&(o[r.key]=r);}this._retainLoadedChildren(o,n,a,e);for(const n of t){let t=this._tiles[n.key];if(t.hasData())continue;if(n.canonical.z>=this._source.maxzoom){const t=n.children(this._source.maxzoom)[0],r=this.getTile(t);if(r&&r.hasData()){e[t.key]=t;continue}}else {const t=n.children(this._source.maxzoom);if(e[t[0].key]&&e[t[1].key]&&e[t[2].key]&&e[t[3].key])continue}let i=t.wasRequested();for(let a=n.overscaledZ-1;a>=s;--a){const s=n.scaledTo(a);if(r[s.key])break;if(r[s.key]=!0,t=this.getTile(s),!t&&i&&(t=this._addTile(s)),t&&(e[s.key]=s,i=t.wasRequested(),t.hasData()))break}}return e}_updateLoadedParentTileCache(){this._loadedParentTiles={};for(const t in this._tiles){const e=[];let r,n=this._tiles[t].tileID;for(;n.overscaledZ>0;){if(n.key in this._loadedParentTiles){r=this._loadedParentTiles[n.key];break}e.push(n.key);const t=n.scaledTo(n.overscaledZ-1);if(r=this._getLoadedTile(t),r)break;n=t;}for(const t of e)this._loadedParentTiles[t]=r;}}_addTile(t){let e=this._tiles[t.key];if(e)return e;e=this._cache.getAndRemove(t),e&&(this._setTileReloadTimer(t.key,e),e.tileID=t,this._state.initializeTileState(e,this.map?this.map.painter:null),this._cacheTimers[t.key]&&(clearTimeout(this._cacheTimers[t.key]),delete this._cacheTimers[t.key],this._setTileReloadTimer(t.key,e)));const r=Boolean(e);if(!r){const r=this.map?this.map.painter:null;e=new Pf(t,this._source.tileSize*t.overscaleFactor(),this.transform.tileZoom,r,this._isRaster),this._loadTile(e,this._tileLoaded.bind(this,e,t.key,e.state));}return e?(e.uses++,this._tiles[t.key]=e,r||this._source.fire(new Yt("dataloading",{tile:e,coord:e.tileID,dataType:"source"})),e):null}_setTileReloadTimer(t,e){t in this._timers&&(clearTimeout(this._timers[t]),delete this._timers[t]);const r=e.getExpiryTimeout();r&&(this._timers[t]=setTimeout((()=>{this._reloadTile(t,"expired"),delete this._timers[t];}),r));}_removeTile(t){const e=this._tiles[t];e&&(e.uses--,delete this._tiles[t],this._timers[t]&&(clearTimeout(this._timers[t]),delete this._timers[t]),e.uses>0||(e.hasData()&&"reloading"!==e.state?this._cache.add(e.tileID,e,e.getExpiryTimeout()):(e.aborted=!0,this._abortTile(e),this._unloadTile(e))));}clearTiles(){this._shouldReloadOnResume=!1,this._paused=!1;for(const t in this._tiles)this._removeTile(+t);this._source._clear&&this._source._clear(),this._cache.reset(),this.map&&this.usedForTerrain&&this.map.painter.terrain&&this.map.painter.terrain.resetTileLookupCache(this.id);}tilesIn(t,e,r){const n=[],i=this.transform;if(!i)return n;const s="globe"===i.projection.name,a=Nl(i.center.lng);for(const o in this._tiles){const l=this._tiles[o];if(r&&l.clearQueryDebugViz(),l.holdingForFade())continue;let u;if(s){const t=l.tileID.canonical;if(0===t.z){const e=[Math.abs(M(a,...iy(t,-1))-a),Math.abs(M(a,...iy(t,1))-a)];u=[0,2*e.indexOf(Math.min(...e))-1];}else {const e=[Math.abs(M(a,...iy(t,-1))-a),Math.abs(M(a,...iy(t,0))-a),Math.abs(M(a,...iy(t,1))-a)];u=[e.indexOf(Math.min(...e))-1];}}else u=[0];for(const r of u){const s=t.containsTile(l,i,e,r);s&&n.push(s);}}return n}getVisibleCoordinates(t){const e=this.getRenderableIds(t).map((t=>this._tiles[t].tileID));for(const t of e)t.projMatrix=this.transform.calculateProjMatrix(t.toUnwrapped());return e}hasTransition(){if(this._source.hasTransition())return !0;if(ny(this._source.type))for(const t in this._tiles){const e=this._tiles[t];if(void 0!==e.fadeEndTime&&e.fadeEndTime>=Xt.now())return !0}return !1}setFeatureState(t,e,r){this._state.updateState(t=t||"_geojsonTileLayer",e,r);}removeFeatureState(t,e,r){this._state.removeFeatureState(t=t||"_geojsonTileLayer",e,r);}getFeatureState(t,e){return this._state.getState(t=t||"_geojsonTileLayer",e)}setDependencies(t,e,r){const n=this._tiles[t];n&&n.setDependencies(e,r);}reloadTilesForDependencies(t,e){for(const r in this._tiles)this._tiles[r].hasDependency(t,e)&&this._reloadTile(+r,"reloading");this._cache.filter((r=>!r.hasDependency(t,e)));}_preloadTiles(t,e){if(!this._sourceLoaded){const r=()=>{this._sourceLoaded&&(this._source.off("data",r),this._preloadTiles(t,e));};return void this._source.on("data",r)}const r=new Map,n=Array.isArray(t)?t:[t],i=this.map.painter.terrain,s=this.usedForTerrain&&i?i.getScaledDemTileSize():this._source.tileSize;for(const t of n){const e=t.coveringTiles({tileSize:s,minzoom:this._source.minzoom,maxzoom:this._source.maxzoom,roundZoom:this._source.roundZoom&&!this.usedForTerrain,reparseOverscaled:this._source.reparseOverscaled,isTerrainDEM:this.usedForTerrain});for(const t of e)r.set(t.key,t);this.usedForTerrain&&t.updateElevation(!1);}B(Array.from(r.values()),((t,e)=>{const r=new Pf(t,this._source.tileSize*t.overscaleFactor(),this.transform.tileZoom,this.map.painter,this._isRaster);this._loadTile(r,(t=>{"raster-dem"===this._source.type&&r.dem&&this._backfillDEM(r),e(t,r);}));}),e);}}function ry(t,e){const r=Math.abs(2*t.wrap)-+(t.wrap<0),n=Math.abs(2*e.wrap)-+(e.wrap<0);return t.overscaledZ-e.overscaledZ||n-r||e.canonical.y-t.canonical.y||e.canonical.x-t.canonical.x}function ny(t){return "raster"===t||"image"===t||"video"===t||"custom"===t}function iy(t,e){const r=1<<t.z;return [t.x/r+e,(t.x+1)/r+e]}ey.maxOverzooming=10,ey.maxUnderzooming=3;class sy{constructor(t,e,r){this._demTile=t,this._dem=this._demTile.dem,this._scale=e,this._offset=r;}static create(t,e,r){const n=r||t.findDEMTileFor(e);if(!n||!n.dem)return;const i=n.dem,s=n.tileID,a=1<<e.canonical.z-s.canonical.z;return new sy(n,n.tileSize/ao/a,[(e.canonical.x/a-s.canonical.x)*i.dim,(e.canonical.y/a-s.canonical.y)*i.dim])}tileCoordToPixel(t,e){const r=e*this._scale+this._offset[1],n=Math.floor(t*this._scale+this._offset[0]),i=Math.floor(r);return new x(n,i)}getElevationAt(t,e,r,n){const i=t*this._scale+this._offset[0],s=e*this._scale+this._offset[1],a=Math.floor(i),o=Math.floor(s),l=this._dem;return n=!!n,r?Er(Er(l.get(a,o,n),l.get(a,o+1,n),s-o),Er(l.get(a+1,o,n),l.get(a+1,o+1,n),s-o),i-a):l.get(a,o,n)}getElevationAtPixel(t,e,r){return this._dem.get(t,e,!!r)}getMeterToDEM(t){return (1<<this._demTile.tileID.canonical.z)*Zl(1,t)*this._dem.stride}}class ay{constructor(t,e){this.tileID=t,this.x=t.canonical.x,this.y=t.canonical.y,this.z=t.canonical.z,this.grid=new Ki(ao,16,0),this.featureIndexArray=new ba,this.promoteId=e;}insert(t,e,r,n,i,s=0){const a=this.featureIndexArray.length;this.featureIndexArray.emplaceBack(r,n,i,s);const o=this.grid;for(let t=0;t<e.length;t++){const r=e[t],n=[1/0,1/0,-1/0,-1/0];for(let t=0;t<r.length;t++){const e=r[t];n[0]=Math.min(n[0],e.x),n[1]=Math.min(n[1],e.y),n[2]=Math.max(n[2],e.x),n[3]=Math.max(n[3],e.y);}n[0]<ao&&n[1]<ao&&n[2]>=0&&n[3]>=0&&o.insert(a,n[0],n[1],n[2],n[3]);}}loadVTLayers(){if(!this.vtLayers){this.vtLayers=new Zc(new mp(this.rawTileData)).layers,this.sourceLayerCoder=new wf(this.vtLayers?Object.keys(this.vtLayers).sort():["_geojsonTileLayer"]),this.vtFeatures={};for(const t in this.vtLayers)this.vtFeatures[t]=[];}return this.vtLayers}query(t,e,r,n){this.loadVTLayers();const i=t.params||{},s=hi(i.filter),a=t.tileResult,o=t.transform,l=a.bufferedTilespaceBounds,u=this.grid.query(l.min.x,l.min.y,l.max.x,l.max.y,((t,e,r,n)=>wu(a.bufferedTilespaceGeometry,t,e,r,n)));u.sort(ly);let c=null;o.elevation&&u.length>0&&(c=sy.create(o.elevation,this.tileID));const h={};let p;for(let o=0;o<u.length;o++){const l=u[o];if(l===p)continue;p=l;const d=this.featureIndexArray.get(l);let f=null;this.loadMatchingFeature(h,d,s,i.layers,i.availableImages,e,r,n,((e,r,n,i=0)=>(f||(f=au(e,this.tileID.canonical,t.tileTransform)),r.queryIntersectsFeature(a,e,n,f,this.z,t.transform,t.pixelPosMatrix,c,i))));}return h}loadMatchingFeature(t,e,r,n,i,s,a,o,l){const{featureIndex:u,bucketIndex:c,sourceLayerIndex:h,layoutVertexArrayOffset:p}=e,d=this.bucketLayerIDs[c];if(n&&!function(t,e){for(let r=0;r<t.length;r++)if(e.indexOf(t[r])>=0)return !0;return !1}(n,d))return;const f=this.sourceLayerCoder.decode(h),y=this.vtLayers[f].feature(u);if(r.needGeometry){const t=ou(y,!0);if(!r.filter(new ws(this.tileID.overscaledZ),t,this.tileID.canonical))return}else if(!r.filter(new ws(this.tileID.overscaledZ),y))return;const m=this.getId(y,f);for(let e=0;e<d.length;e++){const r=d[e];if(n&&n.indexOf(r)<0)continue;const c=s[r];if(!c)continue;let h={};void 0!==m&&o&&(h=o.getState(c.sourceLayer||"_geojsonTileLayer",m));const f=C({},a[r]);f.paint=oy(f.paint,c.paint,y,h,i),f.layout=oy(f.layout,c.layout,y,h,i);const g=!l||l(y,c,h,p);if(!g)continue;const x=new Af(y,this.z,this.x,this.y,m);x.layer=f;let v=t[r];void 0===v&&(v=t[r]=[]),v.push({featureIndex:u,feature:x,intersectionZ:g});}}lookupSymbolFeatures(t,e,r,n,i,s,a,o){const l={};this.loadVTLayers();const u=hi(i);for(const i of t)this.loadMatchingFeature(l,{bucketIndex:r,sourceLayerIndex:n,featureIndex:i,layoutVertexArrayOffset:0},u,s,a,o,e);return l}loadFeature(t){const{featureIndex:e,sourceLayerIndex:r}=t;this.loadVTLayers();const n=this.sourceLayerCoder.decode(r),i=this.vtFeatures[n];if(i[e])return i[e];const s=this.vtLayers[n].feature(e);return i[e]=s,s}hasLayer(t){for(const e of this.bucketLayerIDs)for(const r of e)if(t===r)return !0;return !1}getId(t,e){let r=t.id;if(this.promoteId){const n="string"==typeof this.promoteId?this.promoteId:this.promoteId[e];null!=n&&(r=t.properties[n]),"boolean"==typeof r&&(r=Number(r));}return r}}function oy(t,e,r,n,i){return $(t,((t,s)=>{const a=e instanceof zs?e.get(s):null;return a&&a.evaluate?a.evaluate(r,n,i):a}))}function ly(t,e){return e-t}Ji(ay,"FeatureIndex",{omit:["rawTileData","sourceLayerCoder"]});class uy{constructor(t,e){this.width=t,this.height=e,this.nextRow=0,this.image=new Ru({width:t,height:e}),this.positions={},this.uploaded=!1;}getDash(t,e){const r=this.getKey(t,e);return this.positions[r]}trim(){const t=this.width,e=this.height=L(this.nextRow);this.image.resize({width:t,height:e});}getKey(t,e){return t.join(",")+e}getDashRanges(t,e,r){const n=[];let i=t.length%2==1?-t[t.length-1]*r:0,s=t[0]*r,a=!0;n.push({left:i,right:s,isDash:a,zeroLength:0===t[0]});let o=t[0];for(let e=1;e<t.length;e++){a=!a;const l=t[e];i=o*r,o+=l,s=o*r,n.push({left:i,right:s,isDash:a,zeroLength:0===l});}return n}addRoundDash(t,e,r){const n=e/2;for(let e=-r;e<=r;e++){const i=this.width*(this.nextRow+r+e);let s=0,a=t[s];for(let o=0;o<this.width;o++){o/a.right>1&&(a=t[++s]);const l=Math.abs(o-a.left),u=Math.abs(o-a.right),c=Math.min(l,u);let h;const p=e/r*(n+1);if(a.isDash){const t=n-Math.abs(p);h=Math.sqrt(c*c+t*t);}else h=n-Math.sqrt(c*c+p*p);this.image.data[i+o]=Math.max(0,Math.min(255,h+128));}}}addRegularDash(t,e){for(let e=t.length-1;e>=0;--e){const r=t[e],n=t[e+1];r.zeroLength?t.splice(e,1):n&&n.isDash===r.isDash&&(n.left=r.left,t.splice(e,1));}const r=t[0],n=t[t.length-1];r.isDash===n.isDash&&(r.left=n.left-this.width,n.right=r.right+this.width);const i=this.width*this.nextRow;let s=0,a=t[s];for(let r=0;r<this.width;r++){r/a.right>1&&(a=t[++s]);const n=Math.abs(r-a.left),o=Math.abs(r-a.right),l=Math.min(n,o);this.image.data[i+r]=Math.max(0,Math.min(255,(a.isDash?l:-l)+e+128));}}addDash(t,e){const r=this.getKey(t,e);if(this.positions[r])return this.positions[r];const n="round"===e,i=n?7:0,s=2*i+1;if(this.nextRow+s>this.height)return N("LineAtlas out of space"),null;0===t.length&&t.push(1);let a=0;for(let e=0;e<t.length;e++)t[e]<0&&(N("Negative value is found in line dasharray, replacing values with 0"),t[e]=0),a+=t[e];if(0!==a){const r=this.width/a,s=this.getDashRanges(t,this.width,r);n?this.addRoundDash(s,r,i):this.addRegularDash(s,"square"===e?.5*r:0);}const o=this.nextRow+i;this.nextRow+=s;const l={tl:[o,i],br:[a,0]};return this.positions[r]=l,l}}Ji(uy,"LineAtlas");const cy=1*td;class hy{constructor(t){const e={},r=[];for(const n in t){const i=t[n],s=e[n]={};for(const t in i.glyphs){const e=i.glyphs[+t];if(!e||0===e.bitmap.width||0===e.bitmap.height)continue;const n=e.metrics.localGlyph?cy:1,a={x:0,y:0,w:e.bitmap.width+2*n,h:e.bitmap.height+2*n};r.push(a),s[t]=a;}}const{w:n,h:i}=_p(r),s=new Ru({width:n||1,height:i||1});for(const r in t){const n=t[r];for(const t in n.glyphs){const i=n.glyphs[+t];if(!i||0===i.bitmap.width||0===i.bitmap.height)continue;const a=e[r][t],o=i.metrics.localGlyph?cy:1;Ru.copy(i.bitmap,s,{x:0,y:0},{x:a.x+o,y:a.y+o},i.bitmap);}}this.image=s,this.positions=e;}}Ji(hy,"GlyphAtlas");class py{constructor(t){this.tileID=new fh(t.tileID.overscaledZ,t.tileID.wrap,t.tileID.canonical.z,t.tileID.canonical.x,t.tileID.canonical.y),this.tileZoom=t.tileZoom,this.uid=t.uid,this.zoom=t.zoom,this.canonical=t.tileID.canonical,this.pixelRatio=t.pixelRatio,this.tileSize=t.tileSize,this.source=t.source,this.overscaling=this.tileID.overscaleFactor(),this.showCollisionBoxes=t.showCollisionBoxes,this.collectResourceTiming=!!t.collectResourceTiming,this.returnDependencies=!!t.returnDependencies,this.promoteId=t.promoteId,this.enableTerrain=!!t.enableTerrain,this.isSymbolTile=t.isSymbolTile,this.tileTransform=Bd(t.tileID.canonical,t.projection),this.projection=t.projection;}parse(t,e,r,n,i){this.status="parsing",this.data=t,this.collisionBoxArray=new pa;const s=new wf(Object.keys(t.layers).sort()),a=new ay(this.tileID,this.promoteId);a.bucketLayerIDs=[];const o={},l=new uy(256,256),u={featureIndex:a,iconDependencies:{},patternDependencies:{},glyphDependencies:{},lineAtlas:l,availableImages:r},c=e.familiesBySource[this.source];for(const e in c){const n=t.layers[e];if(!n)continue;let i=!1,l=!1;for(const t of c[e])"symbol"===t[0].type?i=!0:l=!0;if(!0===this.isSymbolTile&&!i)continue;if(!1===this.isSymbolTile&&!l)continue;1===n.version&&N(`Vector tile source "${this.source}" layer "${e}" does not use vector tile spec v2 and therefore may have some rendering errors.`);const h=s.encode(e),p=[];for(let t=0;t<n.length;t++){const r=n.feature(t),i=a.getId(r,e);p.push({feature:r,id:i,index:t,sourceLayerIndex:h});}for(const t of c[e]){const e=t[0];void 0!==this.isSymbolTile&&"symbol"===e.type!==this.isSymbolTile||e.minzoom&&this.zoom<Math.floor(e.minzoom)||e.maxzoom&&this.zoom>=e.maxzoom||"none"!==e.visibility&&(dy(t,this.zoom,r),(o[e.id]=e.createBucket({index:a.bucketLayerIDs.length,layers:t,zoom:this.zoom,canonical:this.canonical,pixelRatio:this.pixelRatio,overscaling:this.overscaling,collisionBoxArray:this.collisionBoxArray,sourceLayerIndex:h,sourceID:this.source,enableTerrain:this.enableTerrain,projection:this.projection.spec,availableImages:r})).populate(p,u,this.tileID.canonical,this.tileTransform),a.bucketLayerIDs.push(t.map((t=>t.id))));}}let h,p,d,f;l.trim();const y={type:"maybePrepare",isSymbolTile:this.isSymbolTile,zoom:this.zoom},m=()=>{if(h)return i(h);if(p&&d&&f){const t=new hy(p),e=new kp(d,f);for(const n in o){const i=o[n];i instanceof of?(dy(i.layers,this.zoom,r),vd(i,p,t.positions,d,e.iconPositions,this.showCollisionBoxes,r,this.tileID.canonical,this.tileZoom,this.projection)):i.hasPattern&&(i instanceof Ih||i instanceof Mc||i instanceof th)&&(dy(i.layers,this.zoom,r),i.addFeatures(u,this.tileID.canonical,e.patternPositions,r,this.tileTransform));}this.status="done",i(null,{buckets:E(o).filter((t=>!t.isEmpty())),featureIndex:a,collisionBoxArray:this.collisionBoxArray,glyphAtlasImage:t.image,lineAtlas:l,imageAtlas:e,glyphMap:this.returnDependencies?p:null,iconMap:this.returnDependencies?d:null,glyphPositions:this.returnDependencies?t.positions:null});}},g=$(u.glyphDependencies,(t=>Object.keys(t).map(Number)));Object.keys(g).length?n.send("getGlyphs",{uid:this.uid,stacks:g},((t,e)=>{h||(h=t,p=e,m());}),void 0,!1,y):p={};const x=Object.keys(u.iconDependencies);x.length?n.send("getImages",{icons:x,source:this.source,tileID:this.tileID,type:"icons"},((t,e)=>{h||(h=t,d=e,m());}),void 0,!1,y):d={};const v=Object.keys(u.patternDependencies);v.length?n.send("getImages",{icons:v,source:this.source,tileID:this.tileID,type:"patterns"},((t,e)=>{h||(h=t,f=e,m());}),void 0,!1,y):f={},m();}}function dy(t,e,r){const n=new ws(e);for(const e of t)e.recalculate(n,r);}class fy{constructor(t){this.entries={},this.scheduler=t;}request(t,e,r,n){const i=this.entries[t]=this.entries[t]||{callbacks:[]};if(i.result){const[t,r]=i.result;return this.scheduler?this.scheduler.add((()=>{n(t,r);}),e):n(t,r),()=>{}}return i.callbacks.push(n),i.cancel||(i.cancel=r(((r,n)=>{i.result=[r,n];for(const t of i.callbacks)this.scheduler?this.scheduler.add((()=>{t(r,n);}),e):t(r,n);setTimeout((()=>delete this.entries[t]),3e3);}))),()=>{i.result||(i.callbacks=i.callbacks.filter((t=>t!==n)),i.callbacks.length||(i.cancel(),delete this.entries[t]));}}}function yy(t,e,r){const n=JSON.stringify(t.request);return t.data&&(this.deduped.entries[n]={result:[null,t.data]}),this.deduped.request(n,{type:"parseTile",isSymbolTile:t.isSymbolTile,zoom:t.tileZoom},(e=>{const n=pt(t.request,((t,n,i,s)=>{t?e(t):n&&e(null,{vectorTile:r?void 0:new Zc(new mp(n)),rawData:n,cacheControl:i,expires:s});}));return ()=>{n.cancel(),e();}}),e)}const my=[Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array];class gy{static from(t){if(!(t instanceof ArrayBuffer))throw new Error("Data must be an instance of ArrayBuffer.");const[e,r]=new Uint8Array(t,0,2);if(219!==e)throw new Error("Data does not appear to be in a KDBush format.");const n=r>>4;if(1!==n)throw new Error(`Got v${n} data when expected v1.`);const i=my[15&r];if(!i)throw new Error("Unrecognized array type.");const[s]=new Uint16Array(t,2,1),[a]=new Uint32Array(t,4,1);return new gy(a,s,i,t)}constructor(t,e=64,r=Float64Array,n){if(isNaN(t)||t<0)throw new Error(`Unpexpected numItems value: ${t}.`);this.numItems=+t,this.nodeSize=Math.min(Math.max(+e,2),65535),this.ArrayType=r,this.IndexArrayType=t<65536?Uint16Array:Uint32Array;const i=my.indexOf(this.ArrayType),s=2*t*this.ArrayType.BYTES_PER_ELEMENT,a=t*this.IndexArrayType.BYTES_PER_ELEMENT,o=(8-a%8)%8;if(i<0)throw new Error(`Unexpected typed array class: ${r}.`);n&&n instanceof ArrayBuffer?(this.data=n,this.ids=new this.IndexArrayType(this.data,8,t),this.coords=new this.ArrayType(this.data,8+a+o,2*t),this._pos=2*t,this._finished=!0):(this.data=new ArrayBuffer(8+s+a+o),this.ids=new this.IndexArrayType(this.data,8,t),this.coords=new this.ArrayType(this.data,8+a+o,2*t),this._pos=0,this._finished=!1,new Uint8Array(this.data,0,2).set([219,16+i]),new Uint16Array(this.data,2,1)[0]=e,new Uint32Array(this.data,4,1)[0]=t);}add(t,e){const r=this._pos>>1;return this.ids[r]=r,this.coords[this._pos++]=t,this.coords[this._pos++]=e,r}finish(){const t=this._pos>>1;if(t!==this.numItems)throw new Error(`Added ${t} items when expected ${this.numItems}.`);return xy(this.ids,this.coords,this.nodeSize,0,this.numItems-1,0),this._finished=!0,this}range(t,e,r,n){if(!this._finished)throw new Error("Data not yet indexed - call index.finish().");const{ids:i,coords:s,nodeSize:a}=this,o=[0,i.length-1,0],l=[];for(;o.length;){const u=o.pop()||0,c=o.pop()||0,h=o.pop()||0;if(c-h<=a){for(let a=h;a<=c;a++){const o=s[2*a],u=s[2*a+1];o>=t&&o<=r&&u>=e&&u<=n&&l.push(i[a]);}continue}const p=h+c>>1,d=s[2*p],f=s[2*p+1];d>=t&&d<=r&&f>=e&&f<=n&&l.push(i[p]),(0===u?t<=d:e<=f)&&(o.push(h),o.push(p-1),o.push(1-u)),(0===u?r>=d:n>=f)&&(o.push(p+1),o.push(c),o.push(1-u));}return l}within(t,e,r){if(!this._finished)throw new Error("Data not yet indexed - call index.finish().");const{ids:n,coords:i,nodeSize:s}=this,a=[0,n.length-1,0],o=[],l=r*r;for(;a.length;){const u=a.pop()||0,c=a.pop()||0,h=a.pop()||0;if(c-h<=s){for(let r=h;r<=c;r++)_y(i[2*r],i[2*r+1],t,e)<=l&&o.push(n[r]);continue}const p=h+c>>1,d=i[2*p],f=i[2*p+1];_y(d,f,t,e)<=l&&o.push(n[p]),(0===u?t-r<=d:e-r<=f)&&(a.push(h),a.push(p-1),a.push(1-u)),(0===u?t+r>=d:e+r>=f)&&(a.push(p+1),a.push(c),a.push(1-u));}return o}}function xy(t,e,r,n,i,s){if(i-n<=r)return;const a=n+i>>1;vy(t,e,a,n,i,s),xy(t,e,r,n,a-1,1-s),xy(t,e,r,a+1,i,1-s);}function vy(t,e,r,n,i,s){for(;i>n;){if(i-n>600){const a=i-n+1,o=r-n+1,l=Math.log(a),u=.5*Math.exp(2*l/3),c=.5*Math.sqrt(l*u*(a-u)/a)*(o-a/2<0?-1:1);vy(t,e,r,Math.max(n,Math.floor(r-o*u/a+c)),Math.min(i,Math.floor(r+(a-o)*u/a+c)),s);}const a=e[2*r+s];let o=n,l=i;for(by(t,e,n,r),e[2*i+s]>a&&by(t,e,n,i);o<l;){for(by(t,e,o,l),o++,l--;e[2*o+s]<a;)o++;for(;e[2*l+s]>a;)l--;}e[2*n+s]===a?by(t,e,n,l):(l++,by(t,e,l,i)),l<=r&&(n=l+1),r<=l&&(i=l-1);}}function by(t,e,r,n){wy(t,r,n),wy(e,2*r,2*n),wy(e,2*r+1,2*n+1);}function wy(t,e,r){const n=t[e];t[e]=t[r],t[r]=n;}function _y(t,e,r,n){const i=t-r,s=e-n;return i*i+s*s}t.ARRAY_TYPE=uo,t.AUTH_ERR_MSG=xt,t.Aabb=il,t.Actor=class{constructor(t,r,n){this.target=t,this.parent=r,this.mapId=n,this.callbacks={},this.cancelCallbacks={},R(["receive"],this),this.target.addEventListener("message",this.receive,!1),this.globalScope=K()?t:e,this.scheduler=new bf;}send(t,e,r,n,i=!1,s){const a=Math.round(1e18*Math.random()).toString(36).substring(0,10);r&&(r.metadata=s,this.callbacks[a]=r);const o=H(this.globalScope)?void 0:[];return this.target.postMessage({id:a,type:t,hasCallback:!!r,targetMapId:n,mustQueue:i,sourceMapId:this.mapId,data:Wi(e,o)},o),{cancel:()=>{r&&delete this.callbacks[a],this.target.postMessage({id:a,type:"<cancel>",targetMapId:n,sourceMapId:this.mapId});}}}receive(t){const e=t.data,r=e.id;if(r&&(!e.targetMapId||this.mapId===e.targetMapId))if("<cancel>"===e.type){const t=this.cancelCallbacks[r];delete this.cancelCallbacks[r],t&&t.cancel();}else if(e.mustQueue||K()){const t=this.callbacks[r];this.cancelCallbacks[r]=this.scheduler.add((()=>this.processTask(r,e)),t&&t.metadata||{type:"message"});}else this.processTask(r,e);}processTask(t,e){if("<response>"===e.type){const r=this.callbacks[t];delete this.callbacks[t],r&&(e.error?r(Qi(e.error)):r(null,Qi(e.data)));}else {const r=H(this.globalScope)?void 0:[],n=e.hasCallback?(e,n)=>{delete this.cancelCallbacks[t],this.target.postMessage({id:t,type:"<response>",sourceMapId:this.mapId,error:e?Wi(e):null,data:Wi(n,r)},r);}:t=>{},i=Qi(e.data);if(this.parent[e.type])this.parent[e.type](e.sourceMapId,i,n);else if(this.parent.getWorkerSource){const t=e.type.split(".");this.parent.getWorkerSource(e.sourceMapId,t[0],i.source)[t[1]](i,n);}else n(new Error(`Could not find function ${e.type}`));}}remove(){this.scheduler.remove(),this.target.removeEventListener("message",this.receive,!1);}},t.CanonicalTileID=ph,t.Color=Ee,t.ColorMode=Yf,t.CullFaceMode=ty,t.DEMData=Zf,t.DataConstantProperty=Bs,t.DedupedRequest=fy,t.DepthMode=Xf,t.EXTENT=ao,t.Elevation=class{isDataAvailableAtPoint(t){const e=this._source();if(this.isUsingMockSource()||!e||t.y<0||t.y>1)return !1;const r=e.getSource().maxzoom,n=1<<r,i=Math.floor(t.x),s=Math.floor((t.x-i)*n),a=Math.floor(t.y*n),o=this.findDEMTileFor(new fh(r,i,r,s,a));return !(!o||!o.dem)}getAtPointOrZero(t,e=0){return this.getAtPoint(t,e)||0}getAtPoint(t,e,r=!0){if(this.isUsingMockSource())return null;null==e&&(e=null);const n=this._source();if(!n)return e;if(t.y<0||t.y>1)return e;const i=n.getSource().maxzoom,s=1<<i,a=Math.floor(t.x),o=t.x-a,l=new fh(i,a,i,Math.floor(o*s),Math.floor(t.y*s)),u=this.findDEMTileFor(l);if(!u||!u.dem)return e;const c=u.dem,h=1<<u.tileID.canonical.z,p=(o*h-u.tileID.canonical.x)*c.dim,d=(t.y*h-u.tileID.canonical.y)*c.dim,f=Math.floor(p),y=Math.floor(d);return (r?this.exaggeration():1)*Er(Er(c.get(f,y),c.get(f,y+1),d-y),Er(c.get(f+1,y),c.get(f+1,y+1),d-y),p-f)}getAtTileOffset(t,e,r){const n=1<<t.canonical.z;return this.getAtPointOrZero(new Wl(t.wrap+(t.canonical.x+e/ao)/n,(t.canonical.y+r/ao)/n))}getAtTileOffsetFunc(t,e,r,n){return i=>{const s=this.getAtTileOffset(t,i.x,i.y),a=n.upVector(t.canonical,i.x,i.y);return Co(a,a,s*n.upVectorScale(t.canonical,e,r).metersToTile),a}}getForTilePoints(t,e,r,n){if(this.isUsingMockSource())return !1;const i=sy.create(this,t,n);return !!i&&(e.forEach((t=>{t[2]=this.exaggeration()*i.getElevationAt(t[0],t[1],r);})),!0)}getMinMaxForTile(t){if(this.isUsingMockSource())return null;const e=this.findDEMTileFor(t);if(!e||!e.dem)return null;const r=e.dem.tree,n=e.tileID,i=1<<t.canonical.z-n.canonical.z;let s=t.canonical.x/i-n.canonical.x,a=t.canonical.y/i-n.canonical.y,o=0;for(let e=0;e<t.canonical.z-n.canonical.z&&!r.leaves[o];e++){s*=2,a*=2;const t=2*Math.floor(a)+Math.floor(s);o=r.childOffsets[o]+t,s%=1,a%=1;}return {min:this.exaggeration()*r.minimums[o],max:this.exaggeration()*r.maximums[o]}}getMinElevationBelowMSL(){throw new Error("Pure virtual method called.")}raycast(t,e,r){throw new Error("Pure virtual method called.")}pointCoordinate(t){throw new Error("Pure virtual method called.")}_source(){throw new Error("Pure virtual method called.")}isUsingMockSource(){throw new Error("Pure virtual method called.")}exaggeration(){throw new Error("Pure virtual method called.")}findDEMTileFor(t){throw new Error("Pure virtual method called.")}get visibleDemTiles(){throw new Error("Getter must be implemented in subclass.")}},t.ErrorEvent=Wt,t.EvaluationParameters=ws,t.Event=Yt,t.Evented=Qt,t.FillExtrusionBucket=th,t.Frustum=nl,t.FrustumCorners=rl,t.GLOBE_RADIUS=ol,t.GLOBE_SCALE_MATCH_LATITUDE=45,t.GLOBE_ZOOM_THRESHOLD_MAX=al,t.GLOBE_ZOOM_THRESHOLD_MIN=sl,t.GlobeSharedBuffers=class{constructor(t){this._createGrid(t),this._createPoles(t);}destroy(){this._poleIndexBuffer.destroy(),this._gridBuffer.destroy(),this._gridIndexBuffer.destroy(),this._poleNorthVertexBuffer.destroy(),this._poleSouthVertexBuffer.destroy();for(const t of this._poleSegments)t.destroy();for(const t of this._gridSegments)t.withSkirts.destroy(),t.withoutSkirts.destroy();if(this._wireframeIndexBuffer){this._wireframeIndexBuffer.destroy();for(const t of this._wireframeSegments)t.destroy();}}_fillGridMeshWithLods(t,e){const r=new $s,n=new ra,i=[],s=t+1+2,a=e[0]+1,o=e[0]+1+(1+e.length),l=(t,e,r)=>{let n=t===s-1?t-2:0===t?t:t-1;return n+=r?24575:0,[n,e]};for(let t=0;t<s;++t)r.emplaceBack(...l(t,0,!0));for(let t=0;t<a;++t)for(let e=0;e<s;++e)r.emplaceBack(...l(e,t,(0===e||e===s-1)&&!0));for(let t=0;t<e.length;++t){const n=e[t];for(let t=0;t<s;++t)r.emplaceBack(...l(t,n,!0));}for(let t=0;t<e.length;++t){const a=n.length,l=e[t]+1+2,u=new ra;for(let r=0;r<l-1;r++){const i=r===l-2,a=i?s*(o-e.length+t-r):s;for(let t=0;t<s-1;t++){const e=r*s+t;0===r||i||0===t||t===s-2?(u.emplaceBack(e+1,e,e+a),u.emplaceBack(e+a,e+a+1,e+1)):(n.emplaceBack(e+1,e,e+a),n.emplaceBack(e+a,e+a+1,e+1));}}const c=so.simpleSegment(0,a,r.length,n.length-a);for(let t=0;t<u.uint16.length;t+=3)n.emplaceBack(u.uint16[t],u.uint16[t+1],u.uint16[t+2]);const h=so.simpleSegment(0,a,r.length,n.length-a);i.push({withoutSkirts:c,withSkirts:h});}return {vertices:r,indices:n,segments:i}}_createGrid(t){const e=this._fillGridMeshWithLods(ul,cl);this._gridSegments=e.segments,this._gridBuffer=t.createVertexBuffer(e.vertices,tl.members),this._gridIndexBuffer=t.createIndexBuffer(e.indices,!0);}_createPoles(t){const e=new ra;for(let t=0;t<=ul;t++)e.emplaceBack(0,t+1,t+2);this._poleIndexBuffer=t.createIndexBuffer(e,!0);const r=new aa,n=new aa;this._poleSegments=[];for(let t=0,e=0;t<sl;t++){const i=360/(1<<t);r.emplaceBack(0,-ol,0,.5,0),n.emplaceBack(0,-ol,0,.5,1);for(let t=0;t<=ul;t++){const e=t/ul,s=Er(0,i,e),[a,o,l]=kl(Fl,Rl,s,ol);r.emplaceBack(a,o,l,e,0),n.emplaceBack(a,o,l,e,1);}this._poleSegments.push(so.simpleSegment(e,0,66,64)),e+=66;}this._poleNorthVertexBuffer=t.createVertexBuffer(r,Wo,!1),this._poleSouthVertexBuffer=t.createVertexBuffer(n,Wo,!1);}getGridBuffers(t,e){return [this._gridBuffer,this._gridIndexBuffer,e?this._gridSegments[t].withSkirts:this._gridSegments[t].withoutSkirts]}getPoleBuffers(t){return [this._poleNorthVertexBuffer,this._poleSouthVertexBuffer,this._poleIndexBuffer,this._poleSegments[t]]}getWirefameBuffers(t,e){if(!this._wireframeSegments){const e=new la,r=ul,n=r+1+2,i=1;this._wireframeSegments=[];for(let t=0,s=0;t<cl.length;t++){const a=cl[t];for(let t=i;t<a+i;t++)for(let s=i;s<r+i;s++){const r=t*n+s;e.emplaceBack(r,r+1),e.emplaceBack(r,r+n),e.emplaceBack(r,r+n+1);}const o=a*r*3;this._wireframeSegments.push(so.simpleSegment(0,s,(a+1)*n,o)),s+=o;}this._wireframeIndexBuffer=t.createIndexBuffer(e);}return [this._gridBuffer,this._wireframeIndexBuffer,this._wireframeSegments[e]]}},t.GlyphManager=rd,t.ImagePosition=Sp,t.KDBush=gy,t.LivePerformanceUtils=$t,t.LngLat=Ol,t.LngLatBounds=oo,t.LocalGlyphMode=ed,t.MAX_MERCATOR_LATITUDE=Hl,t.MercatorCoordinate=Wl,t.ONE_EM=Rh,t.OverscaledTileID=fh,t.PerformanceMarkers=Ut,t.Point=x,t.Properties=Ps,t.RGBAImage=Uu,t.Ray=el,t.RequestManager=class{constructor(t,e,r){this._transformRequestFn=t,this._customAccessToken=e,this._silenceAuthErrors=!!r,this._createSkuToken();}_createSkuToken(){const t=function(){let t="";for(let e=0;e<10;e++)t+="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(62*Math.random())];return {token:["1",h,t].join(""),tokenExpiresAt:Date.now()+432e5}}();this._skuToken=t.token,this._skuTokenExpiresAt=t.tokenExpiresAt;}_isSkuTokenExpired(){return Date.now()>this._skuTokenExpiresAt}transformRequest(t,e){return this._transformRequestFn&&this._transformRequestFn(t,e)||{url:t}}normalizeStyleURL(t,e){if(!vt(t))return t;const r=kt(t);return r.path=`/styles/v1${r.path}`,this._makeAPIURL(r,this._customAccessToken||e)}normalizeGlyphsURL(t,e){if(!vt(t))return t;const r=kt(t);return r.path=`/fonts/v1${r.path}`,this._makeAPIURL(r,this._customAccessToken||e)}normalizeSourceURL(t,e,r,n){if(!vt(t))return t;const i=kt(t);return i.path=`/v4/${i.authority}.json`,i.params.push("secure"),r&&i.params.push(`language=${r}`),n&&i.params.push(`worldview=${n}`),this._makeAPIURL(i,this._customAccessToken||e)}normalizeSpriteURL(t,e,r,n){const i=kt(t);return vt(t)?(i.path=`/styles/v1${i.path}/sprite${e}${r}`,this._makeAPIURL(i,this._customAccessToken||n)):(i.path+=`${e}${r}`,It(i))}normalizeTileURL(t,e,r){if(this._isSkuTokenExpired()&&this._createSkuToken(),t&&!vt(t))return t;const n=kt(t);n.path=n.path.replace(/(\.(png|jpg)\d*)(?=$)/,`${e||r&&"raster"!==n.authority&&512===r?"@2x":""}${s.supported?".webp":"$1"}`),"raster"===n.authority?n.path=`/${i.RASTER_URL_PREFIX}${n.path}`:(n.path=n.path.replace(/^.+\/v4\//,"/"),n.path=`/${i.TILE_URL_VERSION}${n.path}`);const a=this._customAccessToken||function(t){for(const e of t){const t=e.match(/^access_token=(.*)$/);if(t)return t[1]}return null}(n.params)||i.ACCESS_TOKEN;return i.REQUIRE_ACCESS_TOKEN&&a&&this._skuToken&&n.params.push(`sku=${this._skuToken}`),this._makeAPIURL(n,a)}canonicalizeTileURL(t,e){const r=kt(t);if(!r.path.match(/^(\/v4\/|\/raster\/v1\/)/)||!r.path.match(/\.[\w]+$/))return t;let n="mapbox://";r.path.match(/^\/raster\/v1\//)?n+=`raster/${r.path.replace(`/${i.RASTER_URL_PREFIX}/`,"")}`:n+=`tiles/${r.path.replace(`/${i.TILE_URL_VERSION}/`,"")}`;let s=r.params;return e&&(s=s.filter((t=>!t.match(/^access_token=/)))),s.length&&(n+=`?${s.join("&")}`),n}canonicalizeTileset(t,e){const r=!!e&&vt(e),n=[];for(const e of t.tiles||[])bt(e)?n.push(this.canonicalizeTileURL(e,r)):n.push(e);return n}_makeAPIURL(t,e){const r="See https://docs.mapbox.com/api/overview/#access-tokens-and-token-scopes",n=kt(i.API_URL);if(t.protocol=n.protocol,t.authority=n.authority,"http"===t.protocol){const e=t.params.indexOf("secure");e>=0&&t.params.splice(e,1);}if("/"!==n.path&&(t.path=`${n.path}${t.path}`),!i.REQUIRE_ACCESS_TOKEN)return It(t);if(e=e||i.ACCESS_TOKEN,!this._silenceAuthErrors){if(!e)throw new Error(`An API access token is required to use Mapbox GL. ${r}`);if("s"===e[0])throw new Error(`Use a public access token (pk.*) with Mapbox GL, not a secret access token (sk.*). ${r}`)}return t.params=t.params.filter((t=>-1===t.indexOf("access_token"))),t.params.push(`access_token=${e||""}`),It(t)}},t.ResourceType=lt,t.SegmentVector=so,t.SourceCache=ey,t.StencilMode=Hf,t.StructArrayLayout1ui2=ua,t.StructArrayLayout2f1f2i16=Qs,t.StructArrayLayout2i4=$s,t.StructArrayLayout2ui4=la,t.StructArrayLayout3f12=ea,t.StructArrayLayout3ui6=ra,t.StructArrayLayout4i8=Os,t.StructArrayLayout5f20=aa,t.Texture=xf,t.Tile=Pf,t.Transitionable=Ss,t.Uniform1f=La,t.Uniform1i=class extends Va{constructor(t){super(t),this.current=0;}set(t,e,r){this.fetchUniformLocation(t,e)&&this.current!==r&&(this.current=r,this.gl.uniform1i(this.location,r));}},t.Uniform2f=class extends Va{constructor(t){super(t),this.current=[0,0];}set(t,e,r){this.fetchUniformLocation(t,e)&&(r[0]===this.current[0]&&r[1]===this.current[1]||(this.current=r,this.gl.uniform2f(this.location,r[0],r[1])));}},t.Uniform3f=class extends Va{constructor(t){super(t),this.current=[0,0,0];}set(t,e,r){this.fetchUniformLocation(t,e)&&(r[0]===this.current[0]&&r[1]===this.current[1]&&r[2]===this.current[2]||(this.current=r,this.gl.uniform3f(this.location,r[0],r[1],r[2])));}},t.Uniform4f=Fa,t.UniformColor=Ra,t.UniformMatrix2f=class extends Va{constructor(t){super(t),this.current=ja;}set(t,e,r){if(this.fetchUniformLocation(t,e))for(let t=0;t<4;t++)if(r[t]!==this.current[t]){this.current=r,this.gl.uniformMatrix2fv(this.location,!1,r);break}}},t.UniformMatrix3f=class extends Va{constructor(t){super(t),this.current=$a;}set(t,e,r){if(this.fetchUniformLocation(t,e))for(let t=0;t<9;t++)if(r[t]!==this.current[t]){this.current=r,this.gl.uniformMatrix3fv(this.location,!1,r);break}}},t.UniformMatrix4f=class extends Va{constructor(t){super(t),this.current=Ua;}set(t,e,r){if(this.fetchUniformLocation(t,e)){if(r[12]!==this.current[12]||r[0]!==this.current[0])return this.current=r,void this.gl.uniformMatrix4fv(this.location,!1,r);for(let t=1;t<16;t++)if(r[t]!==this.current[t]){this.current=r,this.gl.uniformMatrix4fv(this.location,!1,r);break}}}},t.UnwrappedTileID=dh,t.ValidationError=ri,t.VectorTileFeature=Kc,t.VectorTileWorkerSource=class extends Qt{constructor(t,e,r,n,i){super(),this.actor=t,this.layerIndex=e,this.availableImages=r,this.loadVectorData=i||yy,this.loading={},this.loaded={},this.deduped=new fy(t.scheduler),this.isSpriteLoaded=n,this.scheduler=t.scheduler;}loadTile(t,e){const r=t.uid,n=t&&t.request,i=n&&n.collectResourceTiming,s=this.loading[r]=new py(t);s.abort=this.loadVectorData(t,((a,o)=>{const l=!this.loading[r];if(delete this.loading[r],l||a||!o)return s.status="done",l||(this.loaded[r]=s),e(a);const u=o.rawData,c={};o.expires&&(c.expires=o.expires),o.cacheControl&&(c.cacheControl=o.cacheControl),s.vectorTile=o.vectorTile||new Zc(new mp(u));const h=()=>{s.parse(s.vectorTile,this.layerIndex,this.availableImages,this.actor,((t,r)=>{if(t||!r)return e(t);const s={};if(i){const t=qt(n);t.length>0&&(s.resourceTiming=JSON.parse(JSON.stringify(t)));}e(null,C({rawTileData:u.slice(0)},r,c,s));}));};this.isSpriteLoaded?h():this.once("isSpriteLoaded",(()=>{this.scheduler?this.scheduler.add(h,{type:"parseTile",isSymbolTile:t.isSymbolTile,zoom:t.tileZoom}):h();})),this.loaded=this.loaded||{},this.loaded[r]=s;}));}reloadTile(t,e){const r=this.loaded,n=t.uid,i=this;if(r&&r[n]){const s=r[n];s.showCollisionBoxes=t.showCollisionBoxes,s.enableTerrain=!!t.enableTerrain,s.projection=t.projection,s.tileTransform=Bd(t.tileID.canonical,t.projection);const a=(t,r)=>{const n=s.reloadCallback;n&&(delete s.reloadCallback,s.parse(s.vectorTile,i.layerIndex,this.availableImages,i.actor,n)),e(t,r);};"parsing"===s.status?s.reloadCallback=a:"done"===s.status&&(s.vectorTile?s.parse(s.vectorTile,this.layerIndex,this.availableImages,this.actor,a):a());}}abortTile(t,e){const r=t.uid,n=this.loading[r];n&&(n.abort&&n.abort(),delete this.loading[r]),e();}removeTile(t,e){const r=this.loaded,n=t.uid;r&&r[n]&&delete r[n],e();}},t.WritingMode=Ip,t.ZoomDependentExpression=Wn,t.add=Mo,t.addDynamicAttributes=rf,t.adjoint=function(t,e){var r=e[0],n=e[1],i=e[2],s=e[3],a=e[4],o=e[5],l=e[6],u=e[7],c=e[8];return t[0]=a*c-o*u,t[1]=i*u-n*c,t[2]=n*o-i*a,t[3]=o*l-s*c,t[4]=r*c-i*l,t[5]=i*s-r*o,t[6]=s*u-a*l,t[7]=n*l-r*u,t[8]=r*a-n*s,t},t.asyncAll=B,t.bezier=k,t.bindAll=R,t.boundsAttributes=Ef,t.bufferConvexPolygon=function(t,e){const r=[];for(let n=0;n<t.length;n++){const i=z(n-1,-1,t.length-1),s=z(n+1,-1,t.length-1),a=t[n],o=t[s],l=t[i].sub(a).unit(),u=o.sub(a).unit(),c=u.angleWithSep(l.x,l.y),h=l.add(u).unit().mult(-1*e/Math.sin(c/2));r.push(a.add(h));}return r},t.cacheEntryPossiblyAdded=function(t){ot++,ot>et&&(t.getActor().send("enforceCacheSizeLimit",tt),ot=0);},t.calculateGlobeLabelMatrix=function(t,e){const{x:r,y:n}=t.point,i=Cl(r,n,t.worldSize/t._pixelsPerMercatorPixel,0,0);return yo(i,i,El(xl(e)))},t.calculateGlobeMatrix=function(t){const{x:e,y:r}=t.point,{lng:n,lat:i}=t._center;return Cl(e,r,t.worldSize,n,i)},t.calculateGlobeMercatorMatrix=function(t){const e=t.pixelsPerMeter,r=e/Zl(1,t.center.lat),n=po(new Float64Array(16));return mo(n,n,[t.point.x,t.point.y,0]),go(n,n,[r,r,e]),Float32Array.from(n)},t.circumferenceAtLatitude=ql,t.clamp=M,t.clearTileCache=function(t){if(!it())return;const r=e.caches.delete(Q);t&&r.catch(t).then((()=>t()));},t.clipLine=Hp,t.clone=function(t){var e=new uo(16);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[8]=t[8],e[9]=t[9],e[10]=t[10],e[11]=t[11],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15],e},t.clone$1=O,t.collisionCircleLayout=Fh,t.config=i,t.conjugate=function(t,e){return t[0]=-e[0],t[1]=-e[1],t[2]=-e[2],t[3]=e[3],t},t.create=function(){var t=new uo(16);return uo!=Float32Array&&(t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0),t[0]=1,t[5]=1,t[10]=1,t[15]=1,t},t.create$1=co,t.createExpression=Hn,t.createLayout=Rs,t.createStyleLayer=function(t){return "custom"===t.type?new ff(t):new gf[t.type](t)},t.cross=Lo,t.degToRad=w,t.distance=function(t,e){return Math.hypot(e[0]-t[0],e[1]-t[1],e[2]-t[2])},t.div=function(t,e,r){return t[0]=e[0]/r[0],t[1]=e[1]/r[1],t[2]=e[2]/r[2],t},t.dot=Vo,t.earthRadius=Ul,t.ease=I,t.easeCubicInOut=S,t.ecefToLatLng=function([t,e,r]){const n=Math.hypot(t,e,r),i=Math.atan2(t,r),s=.5*Math.PI-Math.acos(-e/n);return new Ol(_(i),_(s))},t.emitValidationErrors=qi,t.endsWith=U,t.enforceCacheSizeLimit=function(t){st(),rt&&rt.then((e=>{e.keys().then((r=>{for(let n=0;n<r.length-t;n++)e.delete(r[n]);}));}));},t.evaluateSizeForFeature=jh,t.evaluateSizeForZoom=Oh,t.evaluateVariableOffset=xd,t.evented=gs,t.exactEquals=function(t,e){return t[0]===e[0]&&t[1]===e[1]&&t[2]===e[2]&&t[3]===e[3]},t.exactEquals$1=function(t,e){return t[0]===e[0]&&t[1]===e[1]&&t[2]===e[2]},t.exported=Xt,t.exported$1=s,t.extend=C,t.extend$1=ee,t.fillExtrusionHeightLift=oh,t.filterObject=j,t.fromMat4=function(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[4],t[4]=e[5],t[5]=e[6],t[6]=e[8],t[7]=e[9],t[8]=e[10],t},t.fromQuat=function(t,e){var r=e[0],n=e[1],i=e[2],s=e[3],a=r+r,o=n+n,l=i+i,u=r*a,c=n*a,h=n*o,p=i*a,d=i*o,f=i*l,y=s*a,m=s*o,g=s*l;return t[0]=1-h-f,t[1]=c+g,t[2]=p-m,t[3]=0,t[4]=c-g,t[5]=1-u-f,t[6]=d+y,t[7]=0,t[8]=p+m,t[9]=d-y,t[10]=1-u-h,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},t.fromRotation=function(t,e){var r=Math.sin(e),n=Math.cos(e);return t[0]=n,t[1]=r,t[2]=0,t[3]=-r,t[4]=n,t[5]=0,t[6]=0,t[7]=0,t[8]=1,t},t.fromScaling=bo,t.furthestTileCorner=function(t){const e=Math.round((t+45+360)%360/90)%4;return A[e]},t.getAABBPointSquareDist=function(t,e,r){let n=0;for(let i=0;i<2;++i){const s=r?r[i]:0;t[i]>s&&(n+=(t[i]-s)*(t[i]-s)),e[i]<s&&(n+=(s-e[i])*(s-e[i]));}return n},t.getAnchorAlignment=Rp,t.getAnchorJustification=bd,t.getBounds=function(t){let e=1/0,r=1/0,n=-1/0,i=-1/0;for(const s of t)e=Math.min(e,s.x),r=Math.min(r,s.y),n=Math.max(n,s.x),i=Math.max(i,s.y);return {min:new x(e,r),max:new x(n,i)}},t.getColumn=W,t.getDefaultExportFromCjs=p,t.getGridMatrix=function(t,e,r,n){const i=e.getNorth(),s=e.getSouth(),a=e.getWest(),o=e.getEast(),l=1<<t.z,u=o-a,c=i-s,h=u/ul,p=-c/cl[r],d=[0,h,0,p,0,0,i,a,0];if(t.z>0){const t=180/n;ho(d,d,[t/u+1,0,0,0,t/c+1,0,-.5*t/h,.5*t/p,1]);}return d[2]=l,d[5]=t.x,d[8]=t.y,d},t.getImage=gt,t.getJSON=function(t,e){return ht(C(t,{type:"json"}),e)},t.getLatitudinalLod=function(t){const e=Hl-5;t=M(t,-e,e)/e*90;const r=Math.pow(Math.abs(Math.sin(w(t))),3);return Math.round(r*(cl.length-1))},t.getMapSessionAPI=Ft,t.getPerformanceMeasurement=qt,t.getProjection=Yd,t.getRTLTextPluginStatus=xs,t.getReferrer=ct,t.getTilePoint=function(t,{x:e,y:r},n=0){return new x(((e-n)*t.scale-t.x)*ao,(r*t.scale-t.y)*ao)},t.getTileVec3=function(t,e,r=0){return Io(((e.x-r)*t.scale-t.x)*ao,(e.y*t.scale-t.y)*ao,Jl(e.z,e.y))},t.getVideo=function(t,r){const n=e.document.createElement("video");n.muted=!0,n.onloadstart=function(){r(null,n);};for(let r=0;r<t.length;r++){const i=e.document.createElement("source");dt(t[r])||(n.crossOrigin="Anonymous"),i.src=t[r],n.appendChild(i);}return {cancel:()=>{}}},t.globeCenterToScreenPoint=function(t){const e=[0,0,0],r=po(new Float64Array(16));return yo(r,t.pixelMatrix,t.globeMatrix),Fo(e,e,r),new x(e[0],e[1])},t.globeDenormalizeECEF=El,t.globeECEFOrigin=function(t,e){const r=[0,0,0];return Fo(r,r,Bl(xl(e.canonical))),Fo(r,r,t),r},t.globeMetersToEcef=fl,t.globeNormalizeECEF=Bl,t.globePixelsToTileUnits=function(t,e){return ao/(512*Math.pow(2,t))*Tl(xl(e))},t.globePoleMatrixForTile=function(t,e,r){const n=po(new Float64Array(16)),i=(e/(1<<t)-.5)*Math.PI*2;return vo(n,r.globeMatrix,i),Float32Array.from(n)},t.globeTileBounds=xl,t.globeTiltAtLngLat=Dl,t.globeToMercatorTransition=Pl,t.globeUseCustomAntiAliasing=function(t,e,r){const n=Pl(r.zoom),i=t.style.map._antialias,s=!!e.extStandardDerivatives,a=e.extStandardDerivativesForceOff||t.terrain&&t.terrain.exaggeration()>0;return 0===n&&!i&&!a&&s},t.identity=po,t.identity$1=Ko,t.invert=fo,t.isFullscreen=function(){return !!e.document.fullscreenElement||!!e.document.webkitFullscreenElement},t.isLngLatBehindGlobe=Vl,t.isMapAuthenticated=function(t){return Rt.has(t)},t.isMapboxURL=vt,t.isSafariWithAntialiasingBug=function(t){const e=t.navigator?t.navigator.userAgent:null;return !!H(t)&&e&&(e.match("Version/15.4")||e.match("Version/15.5")||e.match(/CPU (OS|iPhone OS) (15_4|15_5) like Mac OS X/))},t.latFromMercatorY=Xl,t.latLngToECEF=Il,t.len=Oo,t.length=ko,t.length$1=function(t){return Math.hypot(t[0],t[1],t[2],t[3])},t.lngFromMercatorX=Kl,t.loadVectorTile=yy,t.makeRequest=ht,t.mapValue=function(t,e,r,n,i){return M((t-e)/(r-e)*(i-n)+n,n,i)},t.mercatorScale=Yl,t.mercatorXfromLng=Nl,t.mercatorYfromLat=Gl,t.mercatorZfromAltitude=Zl,t.mul=_o,t.mul$1=jo,t.multiply=yo,t.multiply$1=ho,t.multiply$2=zo,t.nextPowerOfTwo=L,t.normalize=Do,t.normalize$1=Ho,t.normalize$2=No,t.number=Er,t.ortho=function(t,e,r,n,i,s,a){var o=1/(e-r),l=1/(n-i),u=1/(s-a);return t[0]=-2*o,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=-2*l,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=2*u,t[11]=0,t[12]=(e+r)*o,t[13]=(i+n)*l,t[14]=(a+s)*u,t[15]=1,t},t.pbf=Xh,t.perspective=function(t,e,r,n,i){var s,a=1/Math.tan(e/2);return t[0]=a/r,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=a,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[11]=-1,t[12]=0,t[13]=0,t[15]=0,null!=i&&i!==1/0?(t[10]=(i+n)*(s=1/(n-i)),t[14]=2*i*n*s):(t[10]=-1,t[14]=-2*n),t},t.pick=function(t,e){const r={};for(let n=0;n<e.length;n++){const i=e[n];i in t&&(r[i]=t[i]);}return r},t.plugin=bs,t.pointGeometry=m,t.polesInViewport=function(t){const e=po(new Float64Array(16));yo(e,t.pixelMatrix,t.globeMatrix);const r=[0,hl,0],n=[0,pl,0];return Fo(r,r,e),Fo(n,n,e),[r[0]>0&&r[0]<=t.width&&r[1]>0&&r[1]<=t.height&&!Vl(t,new Ol(t.center.lat,90)),n[0]>0&&n[0]<=t.width&&n[1]>0&&n[1]<=t.height&&!Vl(t,new Ol(t.center.lat,-90))]},t.polygonContainsPoint=bu,t.polygonIntersectsBox=wu,t.polygonIntersectsPolygon=hu,t.polygonizeBounds=function(t,e,r=0,n=!0){const i=new x(r,r),s=t.sub(i),a=e.add(i),o=[s,new x(a.x,s.y),a,new x(s.x,a.y)];return n&&o.push(s.clone()),o},t.posAttributes=tl,t.postMapLoadEvent=Pt,t.postPerformanceEvent=Vt,t.postTurnstileEvent=Et,t.potpack=_p,t.prevPowerOfTwo=function(t){return t<=1?1:Math.pow(2,Math.floor(Math.log(t)/Math.LN2))},t.radToDeg=_,t.refProperties=["type","source","source-layer","minzoom","maxzoom","filter","layout"],t.registerForPluginStateChange=function(t){return t({pluginStatus:ds,pluginURL:fs}),gs.on("pluginStateChange",t),t},t.removeAuthState=function(t){Rt.delete(t);},t.renderColorRamp=ju,t.resample=tu,t.rotateX=xo,t.rotateX$1=Xo,t.rotateY=vo,t.rotateY$1=Jo,t.rotateZ=function(t,e,r){var n=Math.sin(r),i=Math.cos(r),s=e[0],a=e[1],o=e[2],l=e[3],u=e[4],c=e[5],h=e[6],p=e[7];return e!==t&&(t[8]=e[8],t[9]=e[9],t[10]=e[10],t[11]=e[11],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t[0]=s*i+u*n,t[1]=a*i+c*n,t[2]=o*i+h*n,t[3]=l*i+p*n,t[4]=u*i-s*n,t[5]=c*i-a*n,t[6]=h*i-o*n,t[7]=p*i-l*n,t},t.rotateZ$1=function(t,e,r){r*=.5;var n=e[0],i=e[1],s=e[2],a=e[3],o=Math.sin(r),l=Math.cos(r);return t[0]=n*l+i*o,t[1]=i*l-n*o,t[2]=s*l+a*o,t[3]=a*l-s*o,t},t.scale=go,t.scale$1=qo,t.scale$2=Co,t.scaleAndAdd=Po,t.set=function(t,e,r,n){return t[0]=e,t[1]=r,t[2]=n,t},t.setCacheLimits=function(t,e){tt=t,et=e;},t.setColumn=function(t,e,r){t[4*e+0]=r[0],t[4*e+1]=r[1],t[4*e+2]=r[2],t[4*e+3]=r[3];},t.setRTLTextPlugin=function(t,e,r=!1){if(ds===us||ds===cs||ds===hs)throw new Error("setRTLTextPlugin cannot be called multiple times.");fs=Xt.resolveURL(t),ds=us,ps=e,ms(),r||vs();},t.smoothstep=T,t.spec=te,t.squaredLength=function(t){var e=t[0],r=t[1],n=t[2];return e*e+r*r+n*n},t.storeAuthState=function(t,e){e?Rt.add(t):Rt.delete(t);},t.sub=$o,t.subtract=To,t.symbolSize=qh,t.tileAABB=function(t,e,r,n,i,s,a,o,l){if("globe"===l.name)return _l(t,e,new ph(r,n,i));const u=Bd({z:r,x:n,y:i},l);return new il([(s+u.x/u.scale)*e,e*(u.y/u.scale),a],[(s+u.x2/u.scale)*e,e*(u.y2/u.scale),o])},t.tileCornersToBounds=Al,t.tileTransform=Bd,t.transformMat3=function(t,e,r){var n=e[0],i=e[1],s=e[2];return t[0]=n*r[0]+i*r[3]+s*r[6],t[1]=n*r[1]+i*r[4]+s*r[7],t[2]=n*r[2]+i*r[5]+s*r[8],t},t.transformMat4=Fo,t.transformMat4$1=Go,t.transformQuat=Ro,t.transitionTileAABBinECEF=bl,t.translate=mo,t.transpose=function(t,e){if(t===e){var r=e[1],n=e[2],i=e[5];t[1]=e[3],t[2]=e[6],t[3]=r,t[5]=e[7],t[6]=n,t[7]=i;}else t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8];return t},t.triggerPluginCompletionEvent=ys,t.uniqueId=D,t.updateGlobeVertexNormal=function(t,e,r,n,i){const s=5*e+2;t.float32[s+0]=r,t.float32[s+1]=n,t.float32[s+2]=i;},t.validateCustomStyleLayer=function(t){const e=[],r=t.id;return void 0===r&&e.push({message:`layers.${r}: missing required property "id"`}),void 0===t.render&&e.push({message:`layers.${r}: missing required method "render"`}),t.renderingMode&&"2d"!==t.renderingMode&&"3d"!==t.renderingMode&&e.push({message:`layers.${r}: property "renderingMode" must be either "2d" or "3d"`}),e},t.validateFilter=t=>Oi(Ai(t)),t.validateFog=t=>Oi(Vi(t)),t.validateLayer=t=>Oi(Ti(t)),t.validateLight=t=>Oi(Pi(t)),t.validateSource=t=>Oi(Ei(t)),t.validateStyle=Ui,t.validateTerrain=t=>Oi(Di(t)),t.values=E,t.vectorTile=Dc,t.version=r,t.warnOnce=N,t.window=e,t.wrap=z;}));

define(["./shared"],(function(e){"use strict";function t(e){if("number"==typeof e||"boolean"==typeof e||"string"==typeof e||null==e)return JSON.stringify(e);if(Array.isArray(e)){let r="[";for(const o of e)r+=`${t(o)},`;return `${r}]`}let r="{";for(const o of Object.keys(e).sort())r+=`${o}:${t(e[o])},`;return `${r}}`}function r(r){let o="";for(const i of e.refProperties)o+=`/${t(r[i])}`;return o}class o{constructor(e){this.keyCache={},e&&this.replace(e);}replace(e){this._layerConfigs={},this._layers={},this.update(e,[]);}update(t,o){for(const r of t)this._layerConfigs[r.id]=r,(this._layers[r.id]=e.createStyleLayer(r)).compileFilter(),this.keyCache[r.id]&&delete this.keyCache[r.id];for(const e of o)delete this.keyCache[e],delete this._layerConfigs[e],delete this._layers[e];this.familiesBySource={};const i=function(e,t){const o={};for(let i=0;i<e.length;i++){const n=t&&t[e[i].id]||r(e[i]);t&&(t[e[i].id]=n);let s=o[n];s||(s=o[n]=[]),s.push(e[i]);}const i=[];for(const e in o)i.push(o[e]);return i}(e.values(this._layerConfigs),this.keyCache);for(const e of i){const t=e.map((e=>this._layers[e.id])),r=t[0];if("none"===r.visibility)continue;const o=r.source||"";let i=this.familiesBySource[o];i||(i=this.familiesBySource[o]={});const n=r.sourceLayer||"_geojsonTileLayer";let s=i[n];s||(s=i[n]=[]),s.push(t);}}}class i{loadTile(t,r){const{uid:o,encoding:i,rawImageData:n,padding:s,buildQuadTree:a}=t,l=e.window.ImageBitmap&&n instanceof e.window.ImageBitmap?this.getImageData(n,s):n;r(null,new e.DEMData(o,l,i,s<1,a));}getImageData(e,t){this.offscreenCanvas&&this.offscreenCanvasContext||(this.offscreenCanvas=new OffscreenCanvas(e.width,e.height),this.offscreenCanvasContext=this.offscreenCanvas.getContext("2d",{willReadFrequently:!0})),this.offscreenCanvas.width=e.width,this.offscreenCanvas.height=e.height,this.offscreenCanvasContext.drawImage(e,0,0,e.width,e.height);const r=this.offscreenCanvasContext.getImageData(-t,-t,e.width+2*t,e.height+2*t);return this.offscreenCanvasContext.clearRect(0,0,this.offscreenCanvas.width,this.offscreenCanvas.height),r}}function n(e,t){if(0!==e.length){s(e[0],t);for(var r=1;r<e.length;r++)s(e[r],!t);}}function s(e,t){for(var r=0,o=0,i=0,n=e.length,s=n-1;i<n;s=i++){var a=(e[i][0]-e[s][0])*(e[s][1]+e[i][1]),l=r+a;o+=Math.abs(r)>=Math.abs(a)?r-l+a:a-l+r,r=l;}r+o>=0!=!!t&&e.reverse();}var a=e.getDefaultExportFromCjs((function e(t,r){var o,i=t&&t.type;if("FeatureCollection"===i)for(o=0;o<t.features.length;o++)e(t.features[o],r);else if("GeometryCollection"===i)for(o=0;o<t.geometries.length;o++)e(t.geometries[o],r);else if("Feature"===i)e(t.geometry,r);else if("Polygon"===i)n(t.coordinates,r);else if("MultiPolygon"===i)for(o=0;o<t.coordinates.length;o++)n(t.coordinates[o],r);return t}));const l=e.VectorTileFeature.prototype.toGeoJSON;var u={exports:{}},h=e.pointGeometry,c=e.vectorTile.VectorTileFeature,f=p;function p(e,t){this.options=t||{},this.features=e,this.length=e.length;}function g(e,t){this.id="number"==typeof e.id?e.id:void 0,this.type=e.type,this.rawGeometry=1===e.type?[e.geometry]:e.geometry,this.properties=e.tags,this.extent=t||4096;}p.prototype.feature=function(e){return new g(this.features[e],this.options.extent)},g.prototype.loadGeometry=function(){var e=this.rawGeometry;this.geometry=[];for(var t=0;t<e.length;t++){for(var r=e[t],o=[],i=0;i<r.length;i++)o.push(new h(r[i][0],r[i][1]));this.geometry.push(o);}return this.geometry},g.prototype.bbox=function(){this.geometry||this.loadGeometry();for(var e=this.geometry,t=1/0,r=-1/0,o=1/0,i=-1/0,n=0;n<e.length;n++)for(var s=e[n],a=0;a<s.length;a++){var l=s[a];t=Math.min(t,l.x),r=Math.max(r,l.x),o=Math.min(o,l.y),i=Math.max(i,l.y);}return [t,o,r,i]},g.prototype.toGeoJSON=c.prototype.toGeoJSON;var d=e.pbf,m=f;function y(e){var t=new d;return function(e,t){for(var r in e.layers)t.writeMessage(3,v,e.layers[r]);}(e,t),t.finish()}function v(e,t){var r;t.writeVarintField(15,e.version||1),t.writeStringField(1,e.name||""),t.writeVarintField(5,e.extent||4096);var o={keys:[],values:[],keycache:{},valuecache:{}};for(r=0;r<e.length;r++)o.feature=e.feature(r),t.writeMessage(2,x,o);var i=o.keys;for(r=0;r<i.length;r++)t.writeStringField(3,i[r]);var n=o.values;for(r=0;r<n.length;r++)t.writeMessage(4,b,n[r]);}function x(e,t){var r=e.feature;void 0!==r.id&&t.writeVarintField(1,r.id),t.writeMessage(2,w,e),t.writeVarintField(3,r.type),t.writeMessage(4,P,r);}function w(e,t){var r=e.feature,o=e.keys,i=e.values,n=e.keycache,s=e.valuecache;for(var a in r.properties){var l=r.properties[a],u=n[a];if(null!==l){void 0===u&&(o.push(a),n[a]=u=o.length-1),t.writeVarint(u);var h=typeof l;"string"!==h&&"boolean"!==h&&"number"!==h&&(l=JSON.stringify(l));var c=h+":"+l,f=s[c];void 0===f&&(i.push(l),s[c]=f=i.length-1),t.writeVarint(f);}}}function S(e,t){return (t<<3)+(7&e)}function M(e){return e<<1^e>>31}function P(e,t){for(var r=e.loadGeometry(),o=e.type,i=0,n=0,s=r.length,a=0;a<s;a++){var l=r[a],u=1;1===o&&(u=l.length),t.writeVarint(S(1,u));for(var h=3===o?l.length-1:l.length,c=0;c<h;c++){1===c&&1!==o&&t.writeVarint(S(2,h-1));var f=l[c].x-i,p=l[c].y-n;t.writeVarint(M(f)),t.writeVarint(M(p)),i+=f,n+=p;}3===o&&t.writeVarint(S(7,1));}}function b(e,t){var r=typeof e;"string"===r?t.writeStringField(1,e):"boolean"===r?t.writeBooleanField(7,e):"number"===r&&(e%1!=0?t.writeDoubleField(3,e):e<0?t.writeSVarintField(6,e):t.writeVarintField(5,e));}u.exports=y,u.exports.fromVectorTileJs=y,u.exports.fromGeojsonVt=function(e,t){t=t||{};var r={};for(var o in e)r[o]=new m(e[o].features,t),r[o].name=o,r[o].version=t.version,r[o].extent=t.extent;return y({layers:r})},u.exports.GeoJSONWrapper=m;var T=e.getDefaultExportFromCjs(u.exports);const k={minZoom:0,maxZoom:16,minPoints:2,radius:40,extent:512,nodeSize:64,log:!1,generateId:!1,reduce:null,map:e=>e},I=Math.fround||(_=new Float32Array(1),e=>(_[0]=+e,_[0]));var _;const C=3,L=5,O=6;class E{constructor(e){this.options=Object.assign(Object.create(k),e),this.trees=new Array(this.options.maxZoom+1),this.stride=this.options.reduce?7:6,this.clusterProps=[];}load(e){const{log:t,minZoom:r,maxZoom:o}=this.options;t&&console.time("total time");const i=`prepare ${e.length} points`;t&&console.time(i),this.points=e;const n=[];for(let t=0;t<e.length;t++){const r=e[t];if(!r.geometry)continue;const[o,i]=r.geometry.coordinates,s=I(N(o)),a=I(Z(i));n.push(s,a,1/0,t,-1,1),this.options.reduce&&n.push(0);}let s=this.trees[o+1]=this._createTree(n);t&&console.timeEnd(i);for(let e=o;e>=r;e--){const r=+Date.now();s=this.trees[e]=this._createTree(this._cluster(s,e)),t&&console.log("z%d: %d clusters in %dms",e,s.numItems,+Date.now()-r);}return t&&console.timeEnd("total time"),this}getClusters(e,t){let r=((e[0]+180)%360+360)%360-180;const o=Math.max(-90,Math.min(90,e[1]));let i=180===e[2]?180:((e[2]+180)%360+360)%360-180;const n=Math.max(-90,Math.min(90,e[3]));if(e[2]-e[0]>=360)r=-180,i=180;else if(r>i){const e=this.getClusters([r,o,180,n],t),s=this.getClusters([-180,o,i,n],t);return e.concat(s)}const s=this.trees[this._limitZoom(t)],a=s.range(N(r),Z(n),N(i),Z(o)),l=s.data,u=[];for(const e of a){const t=this.stride*e;u.push(l[t+L]>1?j(l,t,this.clusterProps):this.points[l[t+C]]);}return u}getChildren(e){const t=this._getOriginId(e),r=this._getOriginZoom(e),o="No cluster with the specified id.",i=this.trees[r];if(!i)throw new Error(o);const n=i.data;if(t*this.stride>=n.length)throw new Error(o);const s=this.options.radius/(this.options.extent*Math.pow(2,r-1)),a=i.within(n[t*this.stride],n[t*this.stride+1],s),l=[];for(const t of a){const r=t*this.stride;n[r+4]===e&&l.push(n[r+L]>1?j(n,r,this.clusterProps):this.points[n[r+C]]);}if(0===l.length)throw new Error(o);return l}getLeaves(e,t,r){const o=[];return this._appendLeaves(o,e,t=t||10,r=r||0,0),o}getTile(e,t,r){const o=this.trees[this._limitZoom(e)],i=Math.pow(2,e),{extent:n,radius:s}=this.options,a=s/n,l=(r-a)/i,u=(r+1+a)/i,h={features:[]};return this._addTileFeatures(o.range((t-a)/i,l,(t+1+a)/i,u),o.data,t,r,i,h),0===t&&this._addTileFeatures(o.range(1-a/i,l,1,u),o.data,i,r,i,h),t===i-1&&this._addTileFeatures(o.range(0,l,a/i,u),o.data,-1,r,i,h),h.features.length?h:null}getClusterExpansionZoom(e){let t=this._getOriginZoom(e)-1;for(;t<=this.options.maxZoom;){const r=this.getChildren(e);if(t++,1!==r.length)break;e=r[0].properties.cluster_id;}return t}_appendLeaves(e,t,r,o,i){const n=this.getChildren(t);for(const t of n){const n=t.properties;if(n&&n.cluster?i+n.point_count<=o?i+=n.point_count:i=this._appendLeaves(e,n.cluster_id,r,o,i):i<o?i++:e.push(t),e.length===r)break}return i}_createTree(t){const r=new e.KDBush(t.length/this.stride|0,this.options.nodeSize,Float32Array);for(let e=0;e<t.length;e+=this.stride)r.add(t[e],t[e+1]);return r.finish(),r.data=t,r}_addTileFeatures(e,t,r,o,i,n){for(const s of e){const e=s*this.stride,a=t[e+L]>1;let l,u,h;if(a)l=F(t,e,this.clusterProps),u=t[e],h=t[e+1];else {const r=this.points[t[e+C]];l=r.properties;const[o,i]=r.geometry.coordinates;u=N(o),h=Z(i);}const c={type:1,geometry:[[Math.round(this.options.extent*(u*i-r)),Math.round(this.options.extent*(h*i-o))]],tags:l};let f;f=a||this.options.generateId?t[e+C]:this.points[t[e+C]].id,void 0!==f&&(c.id=f),n.features.push(c);}}_limitZoom(e){return Math.max(this.options.minZoom,Math.min(Math.floor(+e),this.options.maxZoom+1))}_cluster(e,t){const{radius:r,extent:o,reduce:i,minPoints:n}=this.options,s=r/(o*Math.pow(2,t)),a=e.data,l=[],u=this.stride;for(let r=0;r<a.length;r+=u){if(a[r+2]<=t)continue;a[r+2]=t;const o=a[r],h=a[r+1],c=e.within(a[r],a[r+1],s),f=a[r+L];let p=f;for(const e of c){const r=e*u;a[r+2]>t&&(p+=a[r+L]);}if(p>f&&p>=n){let e,n=o*f,s=h*f,g=-1;const d=((r/u|0)<<5)+(t+1)+this.points.length;for(const o of c){const l=o*u;if(a[l+2]<=t)continue;a[l+2]=t;const h=a[l+L];n+=a[l]*h,s+=a[l+1]*h,a[l+4]=d,i&&(e||(e=this._map(a,r,!0),g=this.clusterProps.length,this.clusterProps.push(e)),i(e,this._map(a,l)));}a[r+4]=d,l.push(n/p,s/p,1/0,d,-1,p),i&&l.push(g);}else {for(let e=0;e<u;e++)l.push(a[r+e]);if(p>1)for(const e of c){const r=e*u;if(!(a[r+2]<=t)){a[r+2]=t;for(let e=0;e<u;e++)l.push(a[r+e]);}}}}return l}_getOriginId(e){return e-this.points.length>>5}_getOriginZoom(e){return (e-this.points.length)%32}_map(e,t,r){if(e[t+L]>1){const o=this.clusterProps[e[t+O]];return r?Object.assign({},o):o}const o=this.points[e[t+C]].properties,i=this.options.map(o);return r&&i===o?Object.assign({},i):i}}function j(e,t,r){return {type:"Feature",id:e[t+C],properties:F(e,t,r),geometry:{type:"Point",coordinates:[(o=e[t],360*(o-.5)),J(e[t+1])]}};var o;}function F(e,t,r){const o=e[t+L],i=o>=1e4?`${Math.round(o/1e3)}k`:o>=1e3?Math.round(o/100)/10+"k":o,n=e[t+O],s=-1===n?{}:Object.assign({},r[n]);return Object.assign(s,{cluster:!0,cluster_id:e[t+C],point_count:o,point_count_abbreviated:i})}function N(e){return e/360+.5}function Z(e){const t=Math.sin(e*Math.PI/180),r=.5-.25*Math.log((1+t)/(1-t))/Math.PI;return r<0?0:r>1?1:r}function J(e){const t=(180-360*e)*Math.PI/180;return 360*Math.atan(Math.exp(t))/Math.PI-90}function z(e,t,r,o){for(var i,n=o,s=r-t>>1,a=r-t,l=e[t],u=e[t+1],h=e[r],c=e[r+1],f=t+3;f<r;f+=3){var p=G(e[f],e[f+1],l,u,h,c);if(p>n)i=f,n=p;else if(p===n){var g=Math.abs(f-s);g<a&&(i=f,a=g);}}n>o&&(i-t>3&&z(e,t,i,o),e[i+2]=n,r-i>3&&z(e,i,r,o));}function G(e,t,r,o,i,n){var s=i-r,a=n-o;if(0!==s||0!==a){var l=((e-r)*s+(t-o)*a)/(s*s+a*a);l>1?(r=i,o=n):l>0&&(r+=s*l,o+=a*l);}return (s=e-r)*s+(a=t-o)*a}function W(e,t,r,o){var i={id:void 0===e?null:e,type:t,geometry:r,tags:o,minX:1/0,minY:1/0,maxX:-1/0,maxY:-1/0};return function(e){var t=e.geometry,r=e.type;if("Point"===r||"MultiPoint"===r||"LineString"===r)Y(e,t);else if("Polygon"===r||"MultiLineString"===r)for(var o=0;o<t.length;o++)Y(e,t[o]);else if("MultiPolygon"===r)for(o=0;o<t.length;o++)for(var i=0;i<t[o].length;i++)Y(e,t[o][i]);}(i),i}function Y(e,t){for(var r=0;r<t.length;r+=3)e.minX=Math.min(e.minX,t[r]),e.minY=Math.min(e.minY,t[r+1]),e.maxX=Math.max(e.maxX,t[r]),e.maxY=Math.max(e.maxY,t[r+1]);}function X(e,t,r,o){if(t.geometry){var i=t.geometry.coordinates,n=t.geometry.type,s=Math.pow(r.tolerance/((1<<r.maxZoom)*r.extent),2),a=[],l=t.id;if(r.promoteId?l=t.properties[r.promoteId]:r.generateId&&(l=o||0),"Point"===n)V(i,a);else if("MultiPoint"===n)for(var u=0;u<i.length;u++)V(i[u],a);else if("LineString"===n)D(i,a,s,!1);else if("MultiLineString"===n){if(r.lineMetrics){for(u=0;u<i.length;u++)D(i[u],a=[],s,!1),e.push(W(l,"LineString",a,t.properties));return}$(i,a,s,!1);}else if("Polygon"===n)$(i,a,s,!0);else {if("MultiPolygon"!==n){if("GeometryCollection"===n){for(u=0;u<t.geometry.geometries.length;u++)X(e,{id:l,geometry:t.geometry.geometries[u],properties:t.properties},r,o);return}throw new Error("Input data is not a valid GeoJSON object.")}for(u=0;u<i.length;u++){var h=[];$(i[u],h,s,!0),a.push(h);}}e.push(W(l,n,a,t.properties));}}function V(e,t){t.push(A(e[0])),t.push(B(e[1])),t.push(0);}function D(e,t,r,o){for(var i,n,s=0,a=0;a<e.length;a++){var l=A(e[a][0]),u=B(e[a][1]);t.push(l),t.push(u),t.push(0),a>0&&(s+=o?(i*u-l*n)/2:Math.sqrt(Math.pow(l-i,2)+Math.pow(u-n,2))),i=l,n=u;}var h=t.length-3;t[2]=1,z(t,0,h,r),t[h+2]=1,t.size=Math.abs(s),t.start=0,t.end=t.size;}function $(e,t,r,o){for(var i=0;i<e.length;i++){var n=[];D(e[i],n,r,o),t.push(n);}}function A(e){return e/360+.5}function B(e){var t=Math.sin(e*Math.PI/180),r=.5-.25*Math.log((1+t)/(1-t))/Math.PI;return r<0?0:r>1?1:r}function R(e,t,r,o,i,n,s,a){if(o/=t,n>=(r/=t)&&s<o)return e;if(s<r||n>=o)return null;for(var l=[],u=0;u<e.length;u++){var h=e[u],c=h.geometry,f=h.type,p=0===i?h.minX:h.minY,g=0===i?h.maxX:h.maxY;if(p>=r&&g<o)l.push(h);else if(!(g<r||p>=o)){var d=[];if("Point"===f||"MultiPoint"===f)q(c,d,r,o,i);else if("LineString"===f)Q(c,d,r,o,i,!1,a.lineMetrics);else if("MultiLineString"===f)K(c,d,r,o,i,!1);else if("Polygon"===f)K(c,d,r,o,i,!0);else if("MultiPolygon"===f)for(var m=0;m<c.length;m++){var y=[];K(c[m],y,r,o,i,!0),y.length&&d.push(y);}if(d.length){if(a.lineMetrics&&"LineString"===f){for(m=0;m<d.length;m++)l.push(W(h.id,f,d[m],h.tags));continue}"LineString"!==f&&"MultiLineString"!==f||(1===d.length?(f="LineString",d=d[0]):f="MultiLineString"),"Point"!==f&&"MultiPoint"!==f||(f=3===d.length?"Point":"MultiPoint"),l.push(W(h.id,f,d,h.tags));}}}return l.length?l:null}function q(e,t,r,o,i){for(var n=0;n<e.length;n+=3){var s=e[n+i];s>=r&&s<=o&&(t.push(e[n]),t.push(e[n+1]),t.push(e[n+2]));}}function Q(e,t,r,o,i,n,s){for(var a,l,u=U(e),h=0===i?ee:te,c=e.start,f=0;f<e.length-3;f+=3){var p=e[f],g=e[f+1],d=e[f+2],m=e[f+3],y=e[f+4],v=0===i?p:g,x=0===i?m:y,w=!1;s&&(a=Math.sqrt(Math.pow(p-m,2)+Math.pow(g-y,2))),v<r?x>r&&(l=h(u,p,g,m,y,r),s&&(u.start=c+a*l)):v>o?x<o&&(l=h(u,p,g,m,y,o),s&&(u.start=c+a*l)):H(u,p,g,d),x<r&&v>=r&&(l=h(u,p,g,m,y,r),w=!0),x>o&&v<=o&&(l=h(u,p,g,m,y,o),w=!0),!n&&w&&(s&&(u.end=c+a*l),t.push(u),u=U(e)),s&&(c+=a);}var S=e.length-3;p=e[S],g=e[S+1],d=e[S+2],(v=0===i?p:g)>=r&&v<=o&&H(u,p,g,d),S=u.length-3,n&&S>=3&&(u[S]!==u[0]||u[S+1]!==u[1])&&H(u,u[0],u[1],u[2]),u.length&&t.push(u);}function U(e){var t=[];return t.size=e.size,t.start=e.start,t.end=e.end,t}function K(e,t,r,o,i,n){for(var s=0;s<e.length;s++)Q(e[s],t,r,o,i,n,!1);}function H(e,t,r,o){e.push(t),e.push(r),e.push(o);}function ee(e,t,r,o,i,n){var s=(n-t)/(o-t);return e.push(n),e.push(r+(i-r)*s),e.push(1),s}function te(e,t,r,o,i,n){var s=(n-r)/(i-r);return e.push(t+(o-t)*s),e.push(n),e.push(1),s}function re(e,t){for(var r=[],o=0;o<e.length;o++){var i,n=e[o],s=n.type;if("Point"===s||"MultiPoint"===s||"LineString"===s)i=oe(n.geometry,t);else if("MultiLineString"===s||"Polygon"===s){i=[];for(var a=0;a<n.geometry.length;a++)i.push(oe(n.geometry[a],t));}else if("MultiPolygon"===s)for(i=[],a=0;a<n.geometry.length;a++){for(var l=[],u=0;u<n.geometry[a].length;u++)l.push(oe(n.geometry[a][u],t));i.push(l);}r.push(W(n.id,s,i,n.tags));}return r}function oe(e,t){var r=[];r.size=e.size,void 0!==e.start&&(r.start=e.start,r.end=e.end);for(var o=0;o<e.length;o+=3)r.push(e[o]+t,e[o+1],e[o+2]);return r}function ie(e,t){if(e.transformed)return e;var r,o,i,n=1<<e.z,s=e.x,a=e.y;for(r=0;r<e.features.length;r++){var l=e.features[r],u=l.geometry,h=l.type;if(l.geometry=[],1===h)for(o=0;o<u.length;o+=2)l.geometry.push(ne(u[o],u[o+1],t,n,s,a));else for(o=0;o<u.length;o++){var c=[];for(i=0;i<u[o].length;i+=2)c.push(ne(u[o][i],u[o][i+1],t,n,s,a));l.geometry.push(c);}}return e.transformed=!0,e}function ne(e,t,r,o,i,n){return [Math.round(r*(e*o-i)),Math.round(r*(t*o-n))]}function se(e,t,r,o,i){for(var n=t===i.maxZoom?0:i.tolerance/((1<<t)*i.extent),s={features:[],numPoints:0,numSimplified:0,numFeatures:0,source:null,x:r,y:o,z:t,transformed:!1,minX:2,minY:1,maxX:-1,maxY:0},a=0;a<e.length;a++){s.numFeatures++,ae(s,e[a],n,i);var l=e[a].minX,u=e[a].minY,h=e[a].maxX,c=e[a].maxY;l<s.minX&&(s.minX=l),u<s.minY&&(s.minY=u),h>s.maxX&&(s.maxX=h),c>s.maxY&&(s.maxY=c);}return s}function ae(e,t,r,o){var i=t.geometry,n=t.type,s=[];if("Point"===n||"MultiPoint"===n)for(var a=0;a<i.length;a+=3)s.push(i[a]),s.push(i[a+1]),e.numPoints++,e.numSimplified++;else if("LineString"===n)le(s,i,e,r,!1,!1);else if("MultiLineString"===n||"Polygon"===n)for(a=0;a<i.length;a++)le(s,i[a],e,r,"Polygon"===n,0===a);else if("MultiPolygon"===n)for(var l=0;l<i.length;l++){var u=i[l];for(a=0;a<u.length;a++)le(s,u[a],e,r,!0,0===a);}if(s.length){var h=t.tags||null;if("LineString"===n&&o.lineMetrics){for(var c in h={},t.tags)h[c]=t.tags[c];h.mapbox_clip_start=i.start/i.size,h.mapbox_clip_end=i.end/i.size;}var f={geometry:s,type:"Polygon"===n||"MultiPolygon"===n?3:"LineString"===n||"MultiLineString"===n?2:1,tags:h};null!==t.id&&(f.id=t.id),e.features.push(f);}}function le(e,t,r,o,i,n){var s=o*o;if(o>0&&t.size<(i?s:o))r.numPoints+=t.length/3;else {for(var a=[],l=0;l<t.length;l+=3)(0===o||t[l+2]>s)&&(r.numSimplified++,a.push(t[l]),a.push(t[l+1])),r.numPoints++;i&&function(e,t){for(var r=0,o=0,i=e.length,n=i-2;o<i;n=o,o+=2)r+=(e[o]-e[n])*(e[o+1]+e[n+1]);if(r>0===t)for(o=0,i=e.length;o<i/2;o+=2){var s=e[o],a=e[o+1];e[o]=e[i-2-o],e[o+1]=e[i-1-o],e[i-2-o]=s,e[i-1-o]=a;}}(a,n),e.push(a);}}function ue(e,t){var r=(t=this.options=function(e,t){for(var r in t)e[r]=t[r];return e}(Object.create(this.options),t)).debug;if(r&&console.time("preprocess data"),t.maxZoom<0||t.maxZoom>24)throw new Error("maxZoom should be in the 0-24 range");if(t.promoteId&&t.generateId)throw new Error("promoteId and generateId cannot be used together.");var o=function(e,t){var r=[];if("FeatureCollection"===e.type)for(var o=0;o<e.features.length;o++)X(r,e.features[o],t,o);else X(r,"Feature"===e.type?e:{geometry:e},t);return r}(e,t);this.tiles={},this.tileCoords=[],r&&(console.timeEnd("preprocess data"),console.log("index: maxZoom: %d, maxPoints: %d",t.indexMaxZoom,t.indexMaxPoints),console.time("generate tiles"),this.stats={},this.total=0),o=function(e,t){var r=t.buffer/t.extent,o=e,i=R(e,1,-1-r,r,0,-1,2,t),n=R(e,1,1-r,2+r,0,-1,2,t);return (i||n)&&(o=R(e,1,-r,1+r,0,-1,2,t)||[],i&&(o=re(i,1).concat(o)),n&&(o=o.concat(re(n,-1)))),o}(o,t),o.length&&this.splitTile(o,0,0,0),r&&(o.length&&console.log("features: %d, points: %d",this.tiles[0].numFeatures,this.tiles[0].numPoints),console.timeEnd("generate tiles"),console.log("tiles generated:",this.total,JSON.stringify(this.stats)));}function he(e,t,r){return 32*((1<<e)*r+t)+e}function ce(t,r){const o=t.tileID.canonical;if(!this._geoJSONIndex)return r(null,null);const i=this._geoJSONIndex.getTile(o.z,o.x,o.y);if(!i)return r(null,null);const n=new class{constructor(t){this.layers={_geojsonTileLayer:this},this.name="_geojsonTileLayer",this.extent=e.EXTENT,this.length=t.length,this._features=t;}feature(t){return new class{constructor(t){this._feature=t,this.extent=e.EXTENT,this.type=t.type,this.properties=t.tags,"id"in t&&!isNaN(t.id)&&(this.id=parseInt(t.id,10));}loadGeometry(){if(1===this._feature.type){const t=[];for(const r of this._feature.geometry)t.push([new e.Point(r[0],r[1])]);return t}{const t=[];for(const r of this._feature.geometry){const o=[];for(const t of r)o.push(new e.Point(t[0],t[1]));t.push(o);}return t}}toGeoJSON(e,t,r){return l.call(this,e,t,r)}}(this._features[t])}}(i.features);let s=T(n);0===s.byteOffset&&s.byteLength===s.buffer.byteLength||(s=new Uint8Array(s)),r(null,{vectorTile:n,rawData:s.buffer});}ue.prototype.options={maxZoom:14,indexMaxZoom:5,indexMaxPoints:1e5,tolerance:3,extent:4096,buffer:64,lineMetrics:!1,promoteId:null,generateId:!1,debug:0},ue.prototype.splitTile=function(e,t,r,o,i,n,s){for(var a=[e,t,r,o],l=this.options,u=l.debug;a.length;){o=a.pop(),r=a.pop(),t=a.pop(),e=a.pop();var h=1<<t,c=he(t,r,o),f=this.tiles[c];if(!f&&(u>1&&console.time("creation"),f=this.tiles[c]=se(e,t,r,o,l),this.tileCoords.push({z:t,x:r,y:o}),u)){u>1&&(console.log("tile z%d-%d-%d (features: %d, points: %d, simplified: %d)",t,r,o,f.numFeatures,f.numPoints,f.numSimplified),console.timeEnd("creation"));var p="z"+t;this.stats[p]=(this.stats[p]||0)+1,this.total++;}if(f.source=e,i){if(t===l.maxZoom||t===i)continue;var g=1<<i-t;if(r!==Math.floor(n/g)||o!==Math.floor(s/g))continue}else if(t===l.indexMaxZoom||f.numPoints<=l.indexMaxPoints)continue;if(f.source=null,0!==e.length){u>1&&console.time("clipping");var d,m,y,v,x,w,S=.5*l.buffer/l.extent,M=.5-S,P=.5+S,b=1+S;d=m=y=v=null,x=R(e,h,r-S,r+P,0,f.minX,f.maxX,l),w=R(e,h,r+M,r+b,0,f.minX,f.maxX,l),e=null,x&&(d=R(x,h,o-S,o+P,1,f.minY,f.maxY,l),m=R(x,h,o+M,o+b,1,f.minY,f.maxY,l),x=null),w&&(y=R(w,h,o-S,o+P,1,f.minY,f.maxY,l),v=R(w,h,o+M,o+b,1,f.minY,f.maxY,l),w=null),u>1&&console.timeEnd("clipping"),a.push(d||[],t+1,2*r,2*o),a.push(m||[],t+1,2*r,2*o+1),a.push(y||[],t+1,2*r+1,2*o),a.push(v||[],t+1,2*r+1,2*o+1);}}},ue.prototype.getTile=function(e,t,r){var o=this.options,i=o.extent,n=o.debug;if(e<0||e>24)return null;var s=1<<e,a=he(e,t=(t%s+s)%s,r);if(this.tiles[a])return ie(this.tiles[a],i);n>1&&console.log("drilling down to z%d-%d-%d",e,t,r);for(var l,u=e,h=t,c=r;!l&&u>0;)u--,h=Math.floor(h/2),c=Math.floor(c/2),l=this.tiles[he(u,h,c)];return l&&l.source?(n>1&&console.log("found parent tile z%d-%d-%d",u,h,c),n>1&&console.time("drilling down"),this.splitTile(l.source,u,h,c,e,t,r),n>1&&console.timeEnd("drilling down"),this.tiles[a]?ie(this.tiles[a],i):null):null};class fe extends e.VectorTileWorkerSource{constructor(e,t,r,o,i){super(e,t,r,o,ce),i&&(this.loadGeoJSON=i);}loadData(t,r){const o=t&&t.request,i=o&&o.collectResourceTiming;this.loadGeoJSON(t,((n,s)=>{if(n||!s)return r(n);if("object"!=typeof s)return r(new Error(`Input data given to '${t.source}' is not a valid GeoJSON object.`));{a(s,!0);try{if(t.filter){const r=e.createExpression(t.filter,{type:"boolean","property-type":"data-driven",overridable:!1,transition:!1});if("error"===r.result)throw new Error(r.value.map((e=>`${e.key}: ${e.message}`)).join(", "));const o=s.features.filter((e=>r.value.evaluate({zoom:0},e)));s={type:"FeatureCollection",features:o};}this._geoJSONIndex=t.cluster?new E(function({superclusterOptions:t,clusterProperties:r}){if(!r||!t)return t;const o={},i={},n={accumulated:null,zoom:0},s={properties:null},a=Object.keys(r);for(const t of a){const[n,s]=r[t],a=e.createExpression(s),l=e.createExpression("string"==typeof n?[n,["accumulated"],["get",t]]:n);o[t]=a.value,i[t]=l.value;}return t.map=e=>{s.properties=e;const t={};for(const e of a)t[e]=o[e].evaluate(n,s);return t},t.reduce=(e,t)=>{s.properties=t;for(const t of a)n.accumulated=e[t],e[t]=i[t].evaluate(n,s);},t}(t)).load(s.features):function(e,t){return new ue(e,t)}(s,t.geojsonVtOptions);}catch(n){return r(n)}this.loaded={};const l={};if(i){const r=e.getPerformanceMeasurement(o);r&&(l.resourceTiming={},l.resourceTiming[t.source]=JSON.parse(JSON.stringify(r)));}r(null,l);}}));}reloadTile(e,t){const r=this.loaded;return r&&r[e.uid]?super.reloadTile(e,t):this.loadTile(e,t)}loadGeoJSON(t,r){if(t.request)e.getJSON(t.request,r);else {if("string"!=typeof t.data)return r(new Error(`Input data given to '${t.source}' is not a valid GeoJSON object.`));try{return r(null,JSON.parse(t.data))}catch(e){return r(new Error(`Input data given to '${t.source}' is not a valid GeoJSON object.`))}}}getClusterExpansionZoom(e,t){try{t(null,this._geoJSONIndex.getClusterExpansionZoom(e.clusterId));}catch(e){t(e);}}getClusterChildren(e,t){try{t(null,this._geoJSONIndex.getChildren(e.clusterId));}catch(e){t(e);}}getClusterLeaves(e,t){try{t(null,this._geoJSONIndex.getLeaves(e.clusterId,e.limit,e.offset));}catch(e){t(e);}}}class pe{constructor(t){this.self=t,this.actor=new e.Actor(t,this),this.layerIndexes={},this.availableImages={},this.isSpriteLoaded={},this.projections={},this.defaultProjection=e.getProjection({name:"mercator"}),this.workerSourceTypes={vector:e.VectorTileWorkerSource,geojson:fe},this.workerSources={},this.demWorkerSources={},this.self.registerWorkerSource=(e,t)=>{if(this.workerSourceTypes[e])throw new Error(`Worker source with name "${e}" already registered.`);this.workerSourceTypes[e]=t;},this.self.registerRTLTextPlugin=t=>{if(e.plugin.isParsed())throw new Error("RTL text plugin already registered.");e.plugin.applyArabicShaping=t.applyArabicShaping,e.plugin.processBidirectionalText=t.processBidirectionalText,e.plugin.processStyledBidirectionalText=t.processStyledBidirectionalText;};}clearCaches(e,t,r){delete this.layerIndexes[e],delete this.availableImages[e],delete this.workerSources[e],delete this.demWorkerSources[e],r();}checkIfReady(e,t,r){r();}setReferrer(e,t){this.referrer=t;}spriteLoaded(t,r){this.isSpriteLoaded[t]=r;for(const o in this.workerSources[t]){const i=this.workerSources[t][o];for(const t in i)i[t]instanceof e.VectorTileWorkerSource&&(i[t].isSpriteLoaded=r,i[t].fire(new e.Event("isSpriteLoaded")));}}setImages(e,t,r){this.availableImages[e]=t;for(const r in this.workerSources[e]){const o=this.workerSources[e][r];for(const e in o)o[e].availableImages=t;}r();}enableTerrain(e,t,r){this.terrain=t,r();}setProjection(t,r){this.projections[t]=e.getProjection(r);}setLayers(e,t,r){this.getLayerIndex(e).replace(t),r();}updateLayers(e,t,r){this.getLayerIndex(e).update(t.layers,t.removedIds),r();}loadTile(t,r,o){const i=this.enableTerrain?e.extend({enableTerrain:this.terrain},r):r;i.projection=this.projections[t]||this.defaultProjection,this.getWorkerSource(t,r.type,r.source).loadTile(i,o);}loadDEMTile(t,r,o){const i=this.enableTerrain?e.extend({buildQuadTree:this.terrain},r):r;this.getDEMWorkerSource(t,r.source).loadTile(i,o);}reloadTile(t,r,o){const i=this.enableTerrain?e.extend({enableTerrain:this.terrain},r):r;i.projection=this.projections[t]||this.defaultProjection,this.getWorkerSource(t,r.type,r.source).reloadTile(i,o);}abortTile(e,t,r){this.getWorkerSource(e,t.type,t.source).abortTile(t,r);}removeTile(e,t,r){this.getWorkerSource(e,t.type,t.source).removeTile(t,r);}removeSource(e,t,r){if(!this.workerSources[e]||!this.workerSources[e][t.type]||!this.workerSources[e][t.type][t.source])return;const o=this.workerSources[e][t.type][t.source];delete this.workerSources[e][t.type][t.source],void 0!==o.removeSource?o.removeSource(t,r):r();}loadWorkerSource(e,t,r){try{this.self.importScripts(t.url),r();}catch(e){r(e.toString());}}syncRTLPluginState(t,r,o){try{e.plugin.setState(r);const t=e.plugin.getPluginURL();if(e.plugin.isLoaded()&&!e.plugin.isParsed()&&null!=t){this.self.importScripts(t);const r=e.plugin.isParsed();o(r?void 0:new Error(`RTL Text Plugin failed to import scripts from ${t}`),r);}}catch(e){o(e.toString());}}getAvailableImages(e){let t=this.availableImages[e];return t||(t=[]),t}getLayerIndex(e){let t=this.layerIndexes[e];return t||(t=this.layerIndexes[e]=new o),t}getWorkerSource(e,t,r){if(this.workerSources[e]||(this.workerSources[e]={}),this.workerSources[e][t]||(this.workerSources[e][t]={}),!this.workerSources[e][t][r]){const o={send:(t,r,o,i,n,s)=>{this.actor.send(t,r,o,e,n,s);},scheduler:this.actor.scheduler};this.workerSources[e][t][r]=new this.workerSourceTypes[t](o,this.getLayerIndex(e),this.getAvailableImages(e),this.isSpriteLoaded[e]);}return this.workerSources[e][t][r]}getDEMWorkerSource(e,t){return this.demWorkerSources[e]||(this.demWorkerSources[e]={}),this.demWorkerSources[e][t]||(this.demWorkerSources[e][t]=new i),this.demWorkerSources[e][t]}enforceCacheSizeLimit(t,r){e.enforceCacheSizeLimit(r);}getWorkerPerformanceMetrics(e,t,r){r(void 0,void 0);}}return "undefined"!=typeof WorkerGlobalScope&&"undefined"!=typeof self&&self instanceof WorkerGlobalScope&&(self.worker=new pe(self)),pe}));


//
// Our custom intro provides a specialized "define()" function, called by the
// AMD modules below, that sets up the worker blob URL and then executes the
// main module, storing its exported value as 'mapboxgl'


var mapboxgl$1 = mapboxgl;

return mapboxgl$1;

}));
//# sourceMappingURL=mapbox-gl.js.map


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			if (cachedModule.error !== undefined) throw cachedModule.error;
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		try {
/******/ 			var execOptions = { id: moduleId, module: module, factory: __webpack_modules__[moduleId], require: __webpack_require__ };
/******/ 			__webpack_require__.i.forEach(function(handler) { handler(execOptions); });
/******/ 			module = execOptions.module;
/******/ 			execOptions.factory.call(module.exports, module, module.exports, execOptions.require);
/******/ 		} catch(e) {
/******/ 			module.error = e;
/******/ 			throw e;
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = __webpack_module_cache__;
/******/ 	
/******/ 	// expose the module execution interceptor
/******/ 	__webpack_require__.i = [];
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript update chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.hu = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + "." + __webpack_require__.h() + ".hot-update.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get update manifest filename */
/******/ 	(() => {
/******/ 		__webpack_require__.hmrF = () => ("maps." + __webpack_require__.h() + ".hot-update.json");
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/getFullHash */
/******/ 	(() => {
/******/ 		__webpack_require__.h = () => ("897b6bcda8a726be40f8")
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "architectui-html-free:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 		
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hot module replacement */
/******/ 	(() => {
/******/ 		var currentModuleData = {};
/******/ 		var installedModules = __webpack_require__.c;
/******/ 		
/******/ 		// module and require creation
/******/ 		var currentChildModule;
/******/ 		var currentParents = [];
/******/ 		
/******/ 		// status
/******/ 		var registeredStatusHandlers = [];
/******/ 		var currentStatus = "idle";
/******/ 		
/******/ 		// while downloading
/******/ 		var blockingPromises = 0;
/******/ 		var blockingPromisesWaiting = [];
/******/ 		
/******/ 		// The update info
/******/ 		var currentUpdateApplyHandlers;
/******/ 		var queuedInvalidatedModules;
/******/ 		
/******/ 		// eslint-disable-next-line no-unused-vars
/******/ 		__webpack_require__.hmrD = currentModuleData;
/******/ 		
/******/ 		__webpack_require__.i.push(function (options) {
/******/ 			var module = options.module;
/******/ 			var require = createRequire(options.require, options.id);
/******/ 			module.hot = createModuleHotObject(options.id, module);
/******/ 			module.parents = currentParents;
/******/ 			module.children = [];
/******/ 			currentParents = [];
/******/ 			options.require = require;
/******/ 		});
/******/ 		
/******/ 		__webpack_require__.hmrC = {};
/******/ 		__webpack_require__.hmrI = {};
/******/ 		
/******/ 		function createRequire(require, moduleId) {
/******/ 			var me = installedModules[moduleId];
/******/ 			if (!me) return require;
/******/ 			var fn = function (request) {
/******/ 				if (me.hot.active) {
/******/ 					if (installedModules[request]) {
/******/ 						var parents = installedModules[request].parents;
/******/ 						if (parents.indexOf(moduleId) === -1) {
/******/ 							parents.push(moduleId);
/******/ 						}
/******/ 					} else {
/******/ 						currentParents = [moduleId];
/******/ 						currentChildModule = request;
/******/ 					}
/******/ 					if (me.children.indexOf(request) === -1) {
/******/ 						me.children.push(request);
/******/ 					}
/******/ 				} else {
/******/ 					console.warn(
/******/ 						"[HMR] unexpected require(" +
/******/ 							request +
/******/ 							") from disposed module " +
/******/ 							moduleId
/******/ 					);
/******/ 					currentParents = [];
/******/ 				}
/******/ 				return require(request);
/******/ 			};
/******/ 			var createPropertyDescriptor = function (name) {
/******/ 				return {
/******/ 					configurable: true,
/******/ 					enumerable: true,
/******/ 					get: function () {
/******/ 						return require[name];
/******/ 					},
/******/ 					set: function (value) {
/******/ 						require[name] = value;
/******/ 					}
/******/ 				};
/******/ 			};
/******/ 			for (var name in require) {
/******/ 				if (Object.prototype.hasOwnProperty.call(require, name) && name !== "e") {
/******/ 					Object.defineProperty(fn, name, createPropertyDescriptor(name));
/******/ 				}
/******/ 			}
/******/ 			fn.e = function (chunkId) {
/******/ 				return trackBlockingPromise(require.e(chunkId));
/******/ 			};
/******/ 			return fn;
/******/ 		}
/******/ 		
/******/ 		function createModuleHotObject(moduleId, me) {
/******/ 			var _main = currentChildModule !== moduleId;
/******/ 			var hot = {
/******/ 				// private stuff
/******/ 				_acceptedDependencies: {},
/******/ 				_acceptedErrorHandlers: {},
/******/ 				_declinedDependencies: {},
/******/ 				_selfAccepted: false,
/******/ 				_selfDeclined: false,
/******/ 				_selfInvalidated: false,
/******/ 				_disposeHandlers: [],
/******/ 				_main: _main,
/******/ 				_requireSelf: function () {
/******/ 					currentParents = me.parents.slice();
/******/ 					currentChildModule = _main ? undefined : moduleId;
/******/ 					__webpack_require__(moduleId);
/******/ 				},
/******/ 		
/******/ 				// Module API
/******/ 				active: true,
/******/ 				accept: function (dep, callback, errorHandler) {
/******/ 					if (dep === undefined) hot._selfAccepted = true;
/******/ 					else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 					else if (typeof dep === "object" && dep !== null) {
/******/ 						for (var i = 0; i < dep.length; i++) {
/******/ 							hot._acceptedDependencies[dep[i]] = callback || function () {};
/******/ 							hot._acceptedErrorHandlers[dep[i]] = errorHandler;
/******/ 						}
/******/ 					} else {
/******/ 						hot._acceptedDependencies[dep] = callback || function () {};
/******/ 						hot._acceptedErrorHandlers[dep] = errorHandler;
/******/ 					}
/******/ 				},
/******/ 				decline: function (dep) {
/******/ 					if (dep === undefined) hot._selfDeclined = true;
/******/ 					else if (typeof dep === "object" && dep !== null)
/******/ 						for (var i = 0; i < dep.length; i++)
/******/ 							hot._declinedDependencies[dep[i]] = true;
/******/ 					else hot._declinedDependencies[dep] = true;
/******/ 				},
/******/ 				dispose: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				addDisposeHandler: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				removeDisposeHandler: function (callback) {
/******/ 					var idx = hot._disposeHandlers.indexOf(callback);
/******/ 					if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 				},
/******/ 				invalidate: function () {
/******/ 					this._selfInvalidated = true;
/******/ 					switch (currentStatus) {
/******/ 						case "idle":
/******/ 							currentUpdateApplyHandlers = [];
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							setStatus("ready");
/******/ 							break;
/******/ 						case "ready":
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							break;
/******/ 						case "prepare":
/******/ 						case "check":
/******/ 						case "dispose":
/******/ 						case "apply":
/******/ 							(queuedInvalidatedModules = queuedInvalidatedModules || []).push(
/******/ 								moduleId
/******/ 							);
/******/ 							break;
/******/ 						default:
/******/ 							// ignore requests in error states
/******/ 							break;
/******/ 					}
/******/ 				},
/******/ 		
/******/ 				// Management API
/******/ 				check: hotCheck,
/******/ 				apply: hotApply,
/******/ 				status: function (l) {
/******/ 					if (!l) return currentStatus;
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				addStatusHandler: function (l) {
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				removeStatusHandler: function (l) {
/******/ 					var idx = registeredStatusHandlers.indexOf(l);
/******/ 					if (idx >= 0) registeredStatusHandlers.splice(idx, 1);
/******/ 				},
/******/ 		
/******/ 				//inherit from previous dispose call
/******/ 				data: currentModuleData[moduleId]
/******/ 			};
/******/ 			currentChildModule = undefined;
/******/ 			return hot;
/******/ 		}
/******/ 		
/******/ 		function setStatus(newStatus) {
/******/ 			currentStatus = newStatus;
/******/ 			var results = [];
/******/ 		
/******/ 			for (var i = 0; i < registeredStatusHandlers.length; i++)
/******/ 				results[i] = registeredStatusHandlers[i].call(null, newStatus);
/******/ 		
/******/ 			return Promise.all(results);
/******/ 		}
/******/ 		
/******/ 		function unblock() {
/******/ 			if (--blockingPromises === 0) {
/******/ 				setStatus("ready").then(function () {
/******/ 					if (blockingPromises === 0) {
/******/ 						var list = blockingPromisesWaiting;
/******/ 						blockingPromisesWaiting = [];
/******/ 						for (var i = 0; i < list.length; i++) {
/******/ 							list[i]();
/******/ 						}
/******/ 					}
/******/ 				});
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function trackBlockingPromise(promise) {
/******/ 			switch (currentStatus) {
/******/ 				case "ready":
/******/ 					setStatus("prepare");
/******/ 				/* fallthrough */
/******/ 				case "prepare":
/******/ 					blockingPromises++;
/******/ 					promise.then(unblock, unblock);
/******/ 					return promise;
/******/ 				default:
/******/ 					return promise;
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function waitForBlockingPromises(fn) {
/******/ 			if (blockingPromises === 0) return fn();
/******/ 			return new Promise(function (resolve) {
/******/ 				blockingPromisesWaiting.push(function () {
/******/ 					resolve(fn());
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function hotCheck(applyOnUpdate) {
/******/ 			if (currentStatus !== "idle") {
/******/ 				throw new Error("check() is only allowed in idle status");
/******/ 			}
/******/ 			return setStatus("check")
/******/ 				.then(__webpack_require__.hmrM)
/******/ 				.then(function (update) {
/******/ 					if (!update) {
/******/ 						return setStatus(applyInvalidatedModules() ? "ready" : "idle").then(
/******/ 							function () {
/******/ 								return null;
/******/ 							}
/******/ 						);
/******/ 					}
/******/ 		
/******/ 					return setStatus("prepare").then(function () {
/******/ 						var updatedModules = [];
/******/ 						currentUpdateApplyHandlers = [];
/******/ 		
/******/ 						return Promise.all(
/******/ 							Object.keys(__webpack_require__.hmrC).reduce(function (
/******/ 								promises,
/******/ 								key
/******/ 							) {
/******/ 								__webpack_require__.hmrC[key](
/******/ 									update.c,
/******/ 									update.r,
/******/ 									update.m,
/******/ 									promises,
/******/ 									currentUpdateApplyHandlers,
/******/ 									updatedModules
/******/ 								);
/******/ 								return promises;
/******/ 							},
/******/ 							[])
/******/ 						).then(function () {
/******/ 							return waitForBlockingPromises(function () {
/******/ 								if (applyOnUpdate) {
/******/ 									return internalApply(applyOnUpdate);
/******/ 								} else {
/******/ 									return setStatus("ready").then(function () {
/******/ 										return updatedModules;
/******/ 									});
/******/ 								}
/******/ 							});
/******/ 						});
/******/ 					});
/******/ 				});
/******/ 		}
/******/ 		
/******/ 		function hotApply(options) {
/******/ 			if (currentStatus !== "ready") {
/******/ 				return Promise.resolve().then(function () {
/******/ 					throw new Error(
/******/ 						"apply() is only allowed in ready status (state: " +
/******/ 							currentStatus +
/******/ 							")"
/******/ 					);
/******/ 				});
/******/ 			}
/******/ 			return internalApply(options);
/******/ 		}
/******/ 		
/******/ 		function internalApply(options) {
/******/ 			options = options || {};
/******/ 		
/******/ 			applyInvalidatedModules();
/******/ 		
/******/ 			var results = currentUpdateApplyHandlers.map(function (handler) {
/******/ 				return handler(options);
/******/ 			});
/******/ 			currentUpdateApplyHandlers = undefined;
/******/ 		
/******/ 			var errors = results
/******/ 				.map(function (r) {
/******/ 					return r.error;
/******/ 				})
/******/ 				.filter(Boolean);
/******/ 		
/******/ 			if (errors.length > 0) {
/******/ 				return setStatus("abort").then(function () {
/******/ 					throw errors[0];
/******/ 				});
/******/ 			}
/******/ 		
/******/ 			// Now in "dispose" phase
/******/ 			var disposePromise = setStatus("dispose");
/******/ 		
/******/ 			results.forEach(function (result) {
/******/ 				if (result.dispose) result.dispose();
/******/ 			});
/******/ 		
/******/ 			// Now in "apply" phase
/******/ 			var applyPromise = setStatus("apply");
/******/ 		
/******/ 			var error;
/******/ 			var reportError = function (err) {
/******/ 				if (!error) error = err;
/******/ 			};
/******/ 		
/******/ 			var outdatedModules = [];
/******/ 			results.forEach(function (result) {
/******/ 				if (result.apply) {
/******/ 					var modules = result.apply(reportError);
/******/ 					if (modules) {
/******/ 						for (var i = 0; i < modules.length; i++) {
/******/ 							outdatedModules.push(modules[i]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		
/******/ 			return Promise.all([disposePromise, applyPromise]).then(function () {
/******/ 				// handle errors in accept handlers and self accepted module load
/******/ 				if (error) {
/******/ 					return setStatus("fail").then(function () {
/******/ 						throw error;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				if (queuedInvalidatedModules) {
/******/ 					return internalApply(options).then(function (list) {
/******/ 						outdatedModules.forEach(function (moduleId) {
/******/ 							if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 						});
/******/ 						return list;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				return setStatus("idle").then(function () {
/******/ 					return outdatedModules;
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function applyInvalidatedModules() {
/******/ 			if (queuedInvalidatedModules) {
/******/ 				if (!currentUpdateApplyHandlers) currentUpdateApplyHandlers = [];
/******/ 				Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 					queuedInvalidatedModules.forEach(function (moduleId) {
/******/ 						__webpack_require__.hmrI[key](
/******/ 							moduleId,
/******/ 							currentUpdateApplyHandlers
/******/ 						);
/******/ 					});
/******/ 				});
/******/ 				queuedInvalidatedModules = undefined;
/******/ 				return true;
/******/ 			}
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && !scriptUrl) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl + "../../";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = __webpack_require__.hmrS_jsonp = __webpack_require__.hmrS_jsonp || {
/******/ 			4: 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		var currentUpdatedModulesList;
/******/ 		var waitingUpdateResolves = {};
/******/ 		function loadUpdateChunk(chunkId, updatedModulesList) {
/******/ 			currentUpdatedModulesList = updatedModulesList;
/******/ 			return new Promise((resolve, reject) => {
/******/ 				waitingUpdateResolves[chunkId] = resolve;
/******/ 				// start update chunk loading
/******/ 				var url = __webpack_require__.p + __webpack_require__.hu(chunkId);
/******/ 				// create error before stack unwound to get useful stacktrace later
/******/ 				var error = new Error();
/******/ 				var loadingEnded = (event) => {
/******/ 					if(waitingUpdateResolves[chunkId]) {
/******/ 						waitingUpdateResolves[chunkId] = undefined
/******/ 						var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 						var realSrc = event && event.target && event.target.src;
/******/ 						error.message = 'Loading hot update chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 						error.name = 'ChunkLoadError';
/******/ 						error.type = errorType;
/******/ 						error.request = realSrc;
/******/ 						reject(error);
/******/ 					}
/******/ 				};
/******/ 				__webpack_require__.l(url, loadingEnded);
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		self["webpackHotUpdatearchitectui_html_free"] = (chunkId, moreModules, runtime) => {
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					currentUpdate[moduleId] = moreModules[moduleId];
/******/ 					if(currentUpdatedModulesList) currentUpdatedModulesList.push(moduleId);
/******/ 				}
/******/ 			}
/******/ 			if(runtime) currentUpdateRuntime.push(runtime);
/******/ 			if(waitingUpdateResolves[chunkId]) {
/******/ 				waitingUpdateResolves[chunkId]();
/******/ 				waitingUpdateResolves[chunkId] = undefined;
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		var currentUpdateChunks;
/******/ 		var currentUpdate;
/******/ 		var currentUpdateRemovedChunks;
/******/ 		var currentUpdateRuntime;
/******/ 		function applyHandler(options) {
/******/ 			if (__webpack_require__.f) delete __webpack_require__.f.jsonpHmr;
/******/ 			currentUpdateChunks = undefined;
/******/ 			function getAffectedModuleEffects(updateModuleId) {
/******/ 				var outdatedModules = [updateModuleId];
/******/ 				var outdatedDependencies = {};
/******/ 		
/******/ 				var queue = outdatedModules.map(function (id) {
/******/ 					return {
/******/ 						chain: [id],
/******/ 						id: id
/******/ 					};
/******/ 				});
/******/ 				while (queue.length > 0) {
/******/ 					var queueItem = queue.pop();
/******/ 					var moduleId = queueItem.id;
/******/ 					var chain = queueItem.chain;
/******/ 					var module = __webpack_require__.c[moduleId];
/******/ 					if (
/******/ 						!module ||
/******/ 						(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 					)
/******/ 						continue;
/******/ 					if (module.hot._selfDeclined) {
/******/ 						return {
/******/ 							type: "self-declined",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					if (module.hot._main) {
/******/ 						return {
/******/ 							type: "unaccepted",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					for (var i = 0; i < module.parents.length; i++) {
/******/ 						var parentId = module.parents[i];
/******/ 						var parent = __webpack_require__.c[parentId];
/******/ 						if (!parent) continue;
/******/ 						if (parent.hot._declinedDependencies[moduleId]) {
/******/ 							return {
/******/ 								type: "declined",
/******/ 								chain: chain.concat([parentId]),
/******/ 								moduleId: moduleId,
/******/ 								parentId: parentId
/******/ 							};
/******/ 						}
/******/ 						if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 						if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 							if (!outdatedDependencies[parentId])
/******/ 								outdatedDependencies[parentId] = [];
/******/ 							addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 							continue;
/******/ 						}
/******/ 						delete outdatedDependencies[parentId];
/******/ 						outdatedModules.push(parentId);
/******/ 						queue.push({
/******/ 							chain: chain.concat([parentId]),
/******/ 							id: parentId
/******/ 						});
/******/ 					}
/******/ 				}
/******/ 		
/******/ 				return {
/******/ 					type: "accepted",
/******/ 					moduleId: updateModuleId,
/******/ 					outdatedModules: outdatedModules,
/******/ 					outdatedDependencies: outdatedDependencies
/******/ 				};
/******/ 			}
/******/ 		
/******/ 			function addAllToSet(a, b) {
/******/ 				for (var i = 0; i < b.length; i++) {
/******/ 					var item = b[i];
/******/ 					if (a.indexOf(item) === -1) a.push(item);
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			// at begin all updates modules are outdated
/******/ 			// the "outdated" status can propagate to parents if they don't accept the children
/******/ 			var outdatedDependencies = {};
/******/ 			var outdatedModules = [];
/******/ 			var appliedUpdate = {};
/******/ 		
/******/ 			var warnUnexpectedRequire = function warnUnexpectedRequire(module) {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" + module.id + ") to disposed module"
/******/ 				);
/******/ 			};
/******/ 		
/******/ 			for (var moduleId in currentUpdate) {
/******/ 				if (__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 					var newModuleFactory = currentUpdate[moduleId];
/******/ 					/** @type {TODO} */
/******/ 					var result;
/******/ 					if (newModuleFactory) {
/******/ 						result = getAffectedModuleEffects(moduleId);
/******/ 					} else {
/******/ 						result = {
/******/ 							type: "disposed",
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					/** @type {Error|false} */
/******/ 					var abortError = false;
/******/ 					var doApply = false;
/******/ 					var doDispose = false;
/******/ 					var chainInfo = "";
/******/ 					if (result.chain) {
/******/ 						chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 					}
/******/ 					switch (result.type) {
/******/ 						case "self-declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of self decline: " +
/******/ 										result.moduleId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of declined dependency: " +
/******/ 										result.moduleId +
/******/ 										" in " +
/******/ 										result.parentId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "unaccepted":
/******/ 							if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 							if (!options.ignoreUnaccepted)
/******/ 								abortError = new Error(
/******/ 									"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "accepted":
/******/ 							if (options.onAccepted) options.onAccepted(result);
/******/ 							doApply = true;
/******/ 							break;
/******/ 						case "disposed":
/******/ 							if (options.onDisposed) options.onDisposed(result);
/******/ 							doDispose = true;
/******/ 							break;
/******/ 						default:
/******/ 							throw new Error("Unexception type " + result.type);
/******/ 					}
/******/ 					if (abortError) {
/******/ 						return {
/******/ 							error: abortError
/******/ 						};
/******/ 					}
/******/ 					if (doApply) {
/******/ 						appliedUpdate[moduleId] = newModuleFactory;
/******/ 						addAllToSet(outdatedModules, result.outdatedModules);
/******/ 						for (moduleId in result.outdatedDependencies) {
/******/ 							if (__webpack_require__.o(result.outdatedDependencies, moduleId)) {
/******/ 								if (!outdatedDependencies[moduleId])
/******/ 									outdatedDependencies[moduleId] = [];
/******/ 								addAllToSet(
/******/ 									outdatedDependencies[moduleId],
/******/ 									result.outdatedDependencies[moduleId]
/******/ 								);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 					if (doDispose) {
/******/ 						addAllToSet(outdatedModules, [result.moduleId]);
/******/ 						appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 			currentUpdate = undefined;
/******/ 		
/******/ 			// Store self accepted outdated modules to require them later by the module system
/******/ 			var outdatedSelfAcceptedModules = [];
/******/ 			for (var j = 0; j < outdatedModules.length; j++) {
/******/ 				var outdatedModuleId = outdatedModules[j];
/******/ 				var module = __webpack_require__.c[outdatedModuleId];
/******/ 				if (
/******/ 					module &&
/******/ 					(module.hot._selfAccepted || module.hot._main) &&
/******/ 					// removed self-accepted modules should not be required
/******/ 					appliedUpdate[outdatedModuleId] !== warnUnexpectedRequire &&
/******/ 					// when called invalidate self-accepting is not possible
/******/ 					!module.hot._selfInvalidated
/******/ 				) {
/******/ 					outdatedSelfAcceptedModules.push({
/******/ 						module: outdatedModuleId,
/******/ 						require: module.hot._requireSelf,
/******/ 						errorHandler: module.hot._selfAccepted
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			var moduleOutdatedDependencies;
/******/ 		
/******/ 			return {
/******/ 				dispose: function () {
/******/ 					currentUpdateRemovedChunks.forEach(function (chunkId) {
/******/ 						delete installedChunks[chunkId];
/******/ 					});
/******/ 					currentUpdateRemovedChunks = undefined;
/******/ 		
/******/ 					var idx;
/******/ 					var queue = outdatedModules.slice();
/******/ 					while (queue.length > 0) {
/******/ 						var moduleId = queue.pop();
/******/ 						var module = __webpack_require__.c[moduleId];
/******/ 						if (!module) continue;
/******/ 		
/******/ 						var data = {};
/******/ 		
/******/ 						// Call dispose handlers
/******/ 						var disposeHandlers = module.hot._disposeHandlers;
/******/ 						for (j = 0; j < disposeHandlers.length; j++) {
/******/ 							disposeHandlers[j].call(null, data);
/******/ 						}
/******/ 						__webpack_require__.hmrD[moduleId] = data;
/******/ 		
/******/ 						// disable module (this disables requires from this module)
/******/ 						module.hot.active = false;
/******/ 		
/******/ 						// remove module from cache
/******/ 						delete __webpack_require__.c[moduleId];
/******/ 		
/******/ 						// when disposing there is no need to call dispose handler
/******/ 						delete outdatedDependencies[moduleId];
/******/ 		
/******/ 						// remove "parents" references from all children
/******/ 						for (j = 0; j < module.children.length; j++) {
/******/ 							var child = __webpack_require__.c[module.children[j]];
/******/ 							if (!child) continue;
/******/ 							idx = child.parents.indexOf(moduleId);
/******/ 							if (idx >= 0) {
/******/ 								child.parents.splice(idx, 1);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// remove outdated dependency from module children
/******/ 					var dependency;
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									dependency = moduleOutdatedDependencies[j];
/******/ 									idx = module.children.indexOf(dependency);
/******/ 									if (idx >= 0) module.children.splice(idx, 1);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				},
/******/ 				apply: function (reportError) {
/******/ 					// insert new code
/******/ 					for (var updateModuleId in appliedUpdate) {
/******/ 						if (__webpack_require__.o(appliedUpdate, updateModuleId)) {
/******/ 							__webpack_require__.m[updateModuleId] = appliedUpdate[updateModuleId];
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// run new runtime modules
/******/ 					for (var i = 0; i < currentUpdateRuntime.length; i++) {
/******/ 						currentUpdateRuntime[i](__webpack_require__);
/******/ 					}
/******/ 		
/******/ 					// call accept handlers
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							var module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								var callbacks = [];
/******/ 								var errorHandlers = [];
/******/ 								var dependenciesForCallbacks = [];
/******/ 								for (var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									var dependency = moduleOutdatedDependencies[j];
/******/ 									var acceptCallback =
/******/ 										module.hot._acceptedDependencies[dependency];
/******/ 									var errorHandler =
/******/ 										module.hot._acceptedErrorHandlers[dependency];
/******/ 									if (acceptCallback) {
/******/ 										if (callbacks.indexOf(acceptCallback) !== -1) continue;
/******/ 										callbacks.push(acceptCallback);
/******/ 										errorHandlers.push(errorHandler);
/******/ 										dependenciesForCallbacks.push(dependency);
/******/ 									}
/******/ 								}
/******/ 								for (var k = 0; k < callbacks.length; k++) {
/******/ 									try {
/******/ 										callbacks[k].call(null, moduleOutdatedDependencies);
/******/ 									} catch (err) {
/******/ 										if (typeof errorHandlers[k] === "function") {
/******/ 											try {
/******/ 												errorHandlers[k](err, {
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k]
/******/ 												});
/******/ 											} catch (err2) {
/******/ 												if (options.onErrored) {
/******/ 													options.onErrored({
/******/ 														type: "accept-error-handler-errored",
/******/ 														moduleId: outdatedModuleId,
/******/ 														dependencyId: dependenciesForCallbacks[k],
/******/ 														error: err2,
/******/ 														originalError: err
/******/ 													});
/******/ 												}
/******/ 												if (!options.ignoreErrored) {
/******/ 													reportError(err2);
/******/ 													reportError(err);
/******/ 												}
/******/ 											}
/******/ 										} else {
/******/ 											if (options.onErrored) {
/******/ 												options.onErrored({
/******/ 													type: "accept-errored",
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k],
/******/ 													error: err
/******/ 												});
/******/ 											}
/******/ 											if (!options.ignoreErrored) {
/******/ 												reportError(err);
/******/ 											}
/******/ 										}
/******/ 									}
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// Load self accepted modules
/******/ 					for (var o = 0; o < outdatedSelfAcceptedModules.length; o++) {
/******/ 						var item = outdatedSelfAcceptedModules[o];
/******/ 						var moduleId = item.module;
/******/ 						try {
/******/ 							item.require(moduleId);
/******/ 						} catch (err) {
/******/ 							if (typeof item.errorHandler === "function") {
/******/ 								try {
/******/ 									item.errorHandler(err, {
/******/ 										moduleId: moduleId,
/******/ 										module: __webpack_require__.c[moduleId]
/******/ 									});
/******/ 								} catch (err2) {
/******/ 									if (options.onErrored) {
/******/ 										options.onErrored({
/******/ 											type: "self-accept-error-handler-errored",
/******/ 											moduleId: moduleId,
/******/ 											error: err2,
/******/ 											originalError: err
/******/ 										});
/******/ 									}
/******/ 									if (!options.ignoreErrored) {
/******/ 										reportError(err2);
/******/ 										reportError(err);
/******/ 									}
/******/ 								}
/******/ 							} else {
/******/ 								if (options.onErrored) {
/******/ 									options.onErrored({
/******/ 										type: "self-accept-errored",
/******/ 										moduleId: moduleId,
/******/ 										error: err
/******/ 									});
/******/ 								}
/******/ 								if (!options.ignoreErrored) {
/******/ 									reportError(err);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					return outdatedModules;
/******/ 				}
/******/ 			};
/******/ 		}
/******/ 		__webpack_require__.hmrI.jsonp = function (moduleId, applyHandlers) {
/******/ 			if (!currentUpdate) {
/******/ 				currentUpdate = {};
/******/ 				currentUpdateRuntime = [];
/******/ 				currentUpdateRemovedChunks = [];
/******/ 				applyHandlers.push(applyHandler);
/******/ 			}
/******/ 			if (!__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 				currentUpdate[moduleId] = __webpack_require__.m[moduleId];
/******/ 			}
/******/ 		};
/******/ 		__webpack_require__.hmrC.jsonp = function (
/******/ 			chunkIds,
/******/ 			removedChunks,
/******/ 			removedModules,
/******/ 			promises,
/******/ 			applyHandlers,
/******/ 			updatedModulesList
/******/ 		) {
/******/ 			applyHandlers.push(applyHandler);
/******/ 			currentUpdateChunks = {};
/******/ 			currentUpdateRemovedChunks = removedChunks;
/******/ 			currentUpdate = removedModules.reduce(function (obj, key) {
/******/ 				obj[key] = false;
/******/ 				return obj;
/******/ 			}, {});
/******/ 			currentUpdateRuntime = [];
/******/ 			chunkIds.forEach(function (chunkId) {
/******/ 				if (
/******/ 					__webpack_require__.o(installedChunks, chunkId) &&
/******/ 					installedChunks[chunkId] !== undefined
/******/ 				) {
/******/ 					promises.push(loadUpdateChunk(chunkId, updatedModulesList));
/******/ 					currentUpdateChunks[chunkId] = true;
/******/ 				} else {
/******/ 					currentUpdateChunks[chunkId] = false;
/******/ 				}
/******/ 			});
/******/ 			if (__webpack_require__.f) {
/******/ 				__webpack_require__.f.jsonpHmr = function (chunkId, promises) {
/******/ 					if (
/******/ 						currentUpdateChunks &&
/******/ 						__webpack_require__.o(currentUpdateChunks, chunkId) &&
/******/ 						!currentUpdateChunks[chunkId]
/******/ 					) {
/******/ 						promises.push(loadUpdateChunk(chunkId));
/******/ 						currentUpdateChunks[chunkId] = true;
/******/ 					}
/******/ 				};
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.hmrM = () => {
/******/ 			if (typeof fetch === "undefined") throw new Error("No browser support: need fetch API");
/******/ 			return fetch(__webpack_require__.p + __webpack_require__.hmrF()).then((response) => {
/******/ 				if(response.status === 404) return; // no update available
/******/ 				if(!response.ok) throw new Error("Failed to fetch update manifest " + response.statusText);
/******/ 				return response.json();
/******/ 			});
/******/ 		};
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	var __webpack_exports__ = __webpack_require__(131);
/******/ 	
/******/ })()
;