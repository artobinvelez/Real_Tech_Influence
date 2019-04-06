// Store our API endpoint inside queryUrl
var queryUrl = "http://127.0.0.1:5000/api"
var zipcodeLink = "https://data.cityofchicago.org/resource/unjd-c2ca.geojson";


// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
  // createStarbucks(data.features);
});

function createStarbucks(licensesData) {
  var starbucks = L.geoJson(licensesData, {
    filter: function(feature, layer) {
      return layer(feature.properties.name == "STARBUCKS");
    }
  })
  createMap(starbucks);
}

function createFeatures(licensesData) {

  // Define a function we want to run once for each 
  // feature in the features array
  // Give each feature a popup describing the place 
  // and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.name +
      "</h3><hr><p>" + "Business license issued in " + (feature.properties.year) + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var licenses = L.geoJSON(licensesData, {
    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  createMap(licenses);
}

function createMap(licenses) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Businesses: licenses
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [41.907317, -87.659957],
    zoom: 13,
    layers: [streetmap, licenses]
  });

  createZipcodes(myMap);
  createMainBusinesses(myMap);

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}

function createZipcodes(myMap) {
  var zipcodeLink = "https://data.cityofchicago.org/resource/unjd-c2ca.geojson";
  d3.json(zipcodeLink, function(data) {
    // Creating a GeoJSON layer with the retrieved data
    L.geoJson(data).addTo(myMap);
  });
}

function createMainBusinesses(myMap) {
// headquarter markers
var mcdIcon = L.icon({
  iconUrl: 'static/Mcdonalds_logo.png',
  iconSize:     [70, 70], // size of the icon
});

var groupIcon = L.icon({
  iconUrl: 'static/groupon.png',
  iconSize:     [50, 50], // size of the icon
});

var coyIcon = L.icon({
  iconUrl: 'static/Coyote.png',
  iconSize:     [50, 50], // size of the icon
});

L.marker([41.897692, -87.643751], {icon: groupIcon}).addTo(myMap);
L.marker([41.883486, -87.653842], {icon: mcdIcon}).addTo(myMap);
L.marker([41.931738, -87.692132], {icon: coyIcon}).addTo(myMap);
}



