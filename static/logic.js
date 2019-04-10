// Store our API endpoint inside queryUrl
var queryUrl = "http://127.0.0.1:5000/api"
var zipcodeLink = "https://data.cityofchicago.org/resource/unjd-c2ca.geojson";


// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  // createFeatures(data.features);
  createLicencesLayers(data.features)
});

///////////////////////////////////////////////////////////
// Create Licences Layers
// 1. Special Event Beer & Wine
// 2. Retail Sales
// 3. Fitness Classes
///////////////////////////////////////////////////////////
function createLicensesLayers(licensesData) {

  // Create pop up with license information for each marker
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.name +
      "</h3><hr><ul><li>" + 
      "Business license issued in " + (feature.properties.year) + 
      "<li>" + (feature.properties.activity) + "</li>" + "</ul>");
  }
  
  // Filter for Special Event Beer & Wine markers
  var specialEventBeerWine = L.geoJson(licensesData, {
    onEachFeature: onEachFeature,
    filter: function(feature, layer) {
      return feature.properties.activity == "Special Event Beer & Wine";
    }
  })
  
  // filter for Retail Sales of Gen Merch markers
  var retailSales = L.geoJson(licensesData, {
    onEachFeature: onEachFeature,
    filter: function(feature, layer) {
      return feature.properties.activity == "Retail Sales of General Merchandise";
    }
  })

// Filter for Fitness Classes markers
  var fitnessClasses = L.geoJson(licensesData, {
    onEachFeature: onEachFeature,
    filter: function(feature, layer) {
      return feature.properties.activity == "Fitness Classes";
    }
  })

  // Send variables for three markers to createMap function
    createMap(specialEventBeerWine, retailSales, fitnessClasses);
  }


///////////////////////////////////////////////////////////
// Create Map
// base layer + overlay maps
///////////////////////////////////////////////////////////
function createMap(specialEventBeerWine, retailSales, fitnessClasses) {

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
    "Special Event Beer and Wine": specialEventBeerWine,
    "Retail Sales of General Merchandise": retailSales,
    "Fitness Classes": fitnessClasses
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [41.907317, -87.659957],
    zoom: 13,
    layers: [streetmap, specialEventBeerWine, retailSales, fitnessClasses]
  });

  // Send variable 'myMap' to createZipcodes and createMainBusinesses functions
  createZipcodes(myMap);
  createMainBusinesses(myMap);

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}

// Import data to create zipcode boundaries for all Chicago zipcodes
function createZipcodes(myMap) {
  var zipcodeLink = "https://data.cityofchicago.org/resource/unjd-c2ca.geojson";
  d3.json(zipcodeLink, function(data) {
    // Creating a GeoJSON layer with the retrieved data
    L.geoJson(data).addTo(myMap);
  });
}

// Create markers for the three headquarters of interest in Chicago
function createMainBusinesses(myMap) {

  // style for headquarter markers
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

  // Location and adding headquarter markers
  L.marker([41.897692, -87.643751], {icon: groupIcon}).addTo(myMap);
  L.marker([41.883486, -87.653842], {icon: mcdIcon}).addTo(myMap);
  L.marker([41.931738, -87.692132], {icon: coyIcon}).addTo(myMap);
}

