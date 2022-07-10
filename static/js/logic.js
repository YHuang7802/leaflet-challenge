// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//creating map object
var map = L.map('map', {
    center: [37.0902, -95.7129],
    zoom: 5
});

//adding tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

//earthquake layer
var earthquake = new L.LayerGroup()

//create circle marker 
var circleMarkerOptions= {
    radius: 8,
    fillColor:"#39DDB5",
    color: "#AF83EA",
    weight: 1,
    opacity: 1,
    fillOpacity: 1
}; 

//creat function that chooses color
function chooseColor(depth){
    if( depth < 1) return "#24D2BA";
    else if( depth < 10) return "#24D270";
    else if( depth < 20) return "#78D224";
    else if( depth < 30) return "#B2D224";
    else if( depth < 40) return "#C2D224";
    else if( depth < 50) return "#FEF311";
    else if( depth < 60) return "#E9CC2B";
    else if( depth < 70) return "#FEC811";
    else if( depth < 80) return "#FE8411";
    else if( depth < 90) return "#FE4711";
    else if( depth < 100) return "#FE1111";
    else return "#FB0101";
}

//create function to edit circle markers
function markerStyle(feature){
    return {
        radius: 4 * feature.properties.mag,
        fillColor: chooseColor(feature.geometry.coordinates[2]),
        color: "#AF83EA",
        weight: 1,
        opacity: 1,
        fillOpacity: 1
    } 
    
    }
    
// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {

    L.geoJSON(data, {

        onEachFeature:onEachFeature,

        pointToLayer: function (feature, latlng) {
           

            return L.circleMarker(latlng,circleMarkerOptions);
        },
        //apply marker style
        style : markerStyle
        
        
    }).addTo(earthquake);

    earthquake.addTo(map);
})

  // Give each feature a popup describing the place, mag, and depth of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h2>" + feature.properties.place +"</h2><hr>" 
        + "</h3><p>Magnitude: " + feature.properties.mag + "</p>"
      + "</h3><p>Depth: " + feature.geometry.coordinates[2] + "</p>");
  }
    

// Create a legend 
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
    depths = [-10,10,20,30,40,50,60,70,80,90],
    labels = [];

    div.innerHTML+='Depth<br><hr>'
    //for loop through the depths list to apply the color 
    for (var i = 0; i < depths.length; i++) {
        div.innerHTML +=
            '<i style="background:' + chooseColor(depths[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
}

return div;
};

legend.addTo(map);

