
let map = L.map('map').setView([20, 0], 2);

let baseMaps = {
    "OpenStreetMap": L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 5,
        attribution: '© OpenStreetMap'
    }),
    "CartoDB Light": L.tileLayer('https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
        maxZoom: 5,
        attribution: '© CartoDB'
    }),
    "Esri WorldStreetMap": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 5,
        attribution: '© Esri'
    })
};

baseMaps["OpenStreetMap"].addTo(map);
L.control.layers(baseMaps).addTo(map);

let data;
let currentLayer;

fetch('leaflet_gdp_data.json')
    .then(response => response.json())
    .then(json => {
        data = json;
        let selector = document.getElementById("yearSelector");

        Object.keys(data).forEach(year => {
            let option = document.createElement("option");
            option.value = year;
            option.text = year;
            selector.add(option);
        });

        selector.value = "2000";
        updateMap("2000");

        selector.addEventListener("change", () => {
            updateMap(selector.value);
        });
    });

function updateMap(year) {
    if (currentLayer) {
        map.removeLayer(currentLayer);
    }

    let yearData = data[year];
    currentLayer = L.layerGroup();

    yearData.forEach(d => {
        fetch(`https://restcountries.com/v3.1/alpha/${d.code}`)
            .then(res => res.json())
            .then(countryData => {
                if (countryData && countryData[0] && countryData[0].latlng) {
                    let coords = countryData[0].latlng;
                    let color = getColor(d.gdp);

                    let circle = L.circleMarker(coords, {
                        radius: 6,
                        fillColor: color,
                        color: "#000",
                        weight: 1,
                        fillOpacity: 0.8
                    }).bindPopup(`<b>${d.country}</b><br>GDP per Capita: ${parseFloat(d.gdp).toFixed(2)}`);

                    circle.addTo(currentLayer);
                }
            });
    });

    currentLayer.addTo(map);
}

function getColor(value) {
    return value > 40000 ? '#084081' :
           value > 20000 ? '#0868ac' :
           value > 10000 ? '#2b8cbe' :
           value > 5000  ? '#4eb3d3' :
           value > 1000  ? '#7bccc4' :
                          '#a8ddb5';
}
