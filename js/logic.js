let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(queryUrl).then(function (data) {
 createFeatures(data.features);
});

function createFeatures(earthquakeData) {
 function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`+ "<br><h2> Magnitude: "+ feature.properties.mag+ "</h2>");
  }
  
function chooseColor(mag) {
    switch(true) {
        case (1.0 <= mag && mag <= 2.0):
          return "#0071BC";
        case (2.1 <= mag && mag <= 4.0):
          return "#35BC00";
        case (4.1 <= mag && mag <= 6.0):
          return "#BCBC00";
        case (6.1 <= mag && mag <= 8.5):
          return "#BC3500";
        case (8.6 <= mag && mag <= 20.0):
          return "#BC0000";
        default:
          return "#E2FFAE";
    }
  }
   function createCircleMarker(feature,latlng){
    let options = {
        radius:feature.properties.mag*5,
        fillColor: chooseColor(feature.properties.depth),
        color: chooseColor(feature.properties.mag),
        weight: 1,
        opacity: .6,
        fillOpacity: 0.40
    }
    return L.circleMarker(latlng, options);
}
  
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: createCircleMarker
  });
  

  createMap(earthquakes);
}


let legend = L.control({position:"bottomright"});

legend.onAdd = function (map) {
    let div = L.DomUtil.create('div', 'legend'),
        grades = [1.0, 2.1, 4.1, 6.1, 8.6],
        title = "<h2>Depth in km</h2>",
        labels = [];

   
    for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + chooseColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
};


function createMap(earthquakes) {
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });


  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };


  let overlayMaps = {
    Earthquakes: earthquakes
  };

  
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
 legend.addTo(myMap);

}