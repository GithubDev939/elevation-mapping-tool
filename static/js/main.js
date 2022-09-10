const apiKey = "AAPK34133c70202e4ca3bb784447346c0444RotY00yytnrmBicqACdr8_NXIy16nntFEkx1AQl8YaJwJra0iwsmHNoIe2Ifl9Vl";

const basemapEnum = "ArcGIS:Navigation";

const map = L.map("map", {
  minZoom: 2

}).setView([-33.8688, 151.2093], 14); // Sydney

L.esri.Vector.vectorBasemapLayer(basemapEnum, {
  apiKey: apiKey
}).addTo(map);
const searchControl = L.esri.Geocoding.geosearch({
  position: "topright",
  placeholder: "Enter an address or place e.g. 1 York St",
  useMapBounds: false,
  providers: [
    L.esri.Geocoding.arcgisOnlineProvider({
      apikey: apiKey,
      nearby: {
        lat: -33.8688,
        lng: 151.2093
      }
    })
  ]
}).addTo(map);

const results = L.layerGroup().addTo(map);

searchControl.on("results", (data) => {
  results.clearLayers();
  for (let i = data.results.length - 1; i >= 0; i--) {
    const marker = L.marker(data.results[i].latlng);
    results.addLayer(marker);
    marker.openPopup();
  }
});

var drawnItems = new L.FeatureGroup();

map.addLayer(drawnItems);
var drawControl = new L.Control.Draw({
  draw: {
    marker: false,
    rectangle: false,
    line: false,
    point: false,
    circle: false,
    circlemarker: false,
    polyline: false,
    polgyon: {
      allowIntersection: false
    }
  },
  edit: {
      featureGroup: drawnItems
  }
});
map.addControl(drawControl);

map.on('draw:created', function (e) {
  editing = false;
  var type = e.layerType,
      layer = e.layer;
  drawnItems.addLayer(layer);
});

$(function() {
  $('a#analyze').bind('click', function() {
    var data = []
    $.each(drawnItems._layers, function(key, value) {
        data.push(value.editing.latlngs[0]);
    });
    $.ajax({
      type: 'POST',
      url: 'process',
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function(response) {
        if (response.redirect){
          window.location.href = response.redirect;
        }
      }
    })
  });
});