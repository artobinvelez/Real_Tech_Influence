// Creating our initial map object
// We set the longitude, latitude, and the starting zoom level
// This gets inserted into the div with an id of 'map'
// Creating map object
var map = L.map("map", {
  center: [41.8781, -87.6298],
  zoom: 10
});

L.marker([-41.908, 87.634]).addTo(map);


// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(map);

var link = "https://data.cityofchicago.org/resource/unjd-c2ca.geojson";

var api_link = "http://127.0.0.1:5000/api"


// Grabbing our GeoJSON data..
d3.json(link, function(data) {
  // Creating a GeoJSON layer with the retrieved data
  L.geoJson(data).addTo(map);
});

d3.json(api_link, function(response) {

  // console.log(response);

  for (var i = 0; i < response.length; i++) {
    var location = response[i].geometry;
    // console.log(location)
    if (location) {
      L.marker([location.coordinates[0], location.coordinates[1]]).addTo(map);
      console.log(location.coordinates)
    }
  }

});

// L.marker([41.903905986, -87.634626237]).addTo(map);

// console.log()