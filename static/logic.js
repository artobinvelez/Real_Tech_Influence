// Creating our initial map object
// We set the longitude, latitude, and the starting zoom level
// This gets inserted into the div with an id of 'map'
// Creating map object
var map = L.map("map", {
  center: [41.907317, -87.659957],
  zoom: 13
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 20,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(map);


var link = "https://data.cityofchicago.org/resource/unjd-c2ca.geojson";

var api_link = "http://localhost:5000/api"


// Grabbing our GeoJSON data..
d3.json(link, function(data) {
  console.log(data)
  // Creating a GeoJSON layer with the retrieved data
  L.geoJson(data).addTo(map);
});

d3.json(api_link, function(data) {
  L.geoJSON(data).addTo(map);
})

// headquarter markers
var mcdIcon = L.icon({
  iconUrl: 'static/Mcdonalds_logo.png',

  iconSize:     [70, 70], // size of the icon
});

L.marker([41.883486, -87.653842], {icon: mcdIcon}).addTo(map);

var groupIcon = L.icon({
  iconUrl: 'static/groupon.png',

  iconSize:     [50, 50], // size of the icon
});

L.marker([41.897692, -87.643751], {icon: groupIcon}).addTo(map);

var coyIcon = L.icon({
  iconUrl: 'static/Coyote.png',

  iconSize:     [50, 50], // size of the icon
});


L.marker([41.931738, -87.692132], {icon: coyIcon}).addTo(map);

var mcdIcon = L.icon({
  iconUrl: 'static/Mcdonalds_logo.png',

  iconSize:     [70, 70], // size of the icon
});

L.marker([41.883486, -87.653842], {icon: mcdIcon}).addTo(map);

var groupIcon = L.icon({
  iconUrl: 'static/groupon.png',

  iconSize:     [50, 50], // size of the icon
});

L.marker([41.897692, -87.643751], {icon: groupIcon}).addTo(map);

var coyIcon = L.icon({
  iconUrl: 'static/Coyote.png',

  iconSize:     [50, 50], // size of the icon
});

L.marker([41.931738, -87.692132], {icon: coyIcon}).addTo(map);

// // console.log()

