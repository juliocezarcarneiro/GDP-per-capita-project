// Step 1: Set up the base map and center it on the world
let myMap = L.map('map').setView([20, 0], 2);

// Step 2: Add the background map layer (tiles from OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 6,
  attribution: '© OpenStreetMap'
}).addTo(myMap);

// Step 3: Fix some country names so they match in both datasets
const nameFixes = {
  "United States of America": "United States",
  "Russian Federation": "Russia",
  "Korea, Republic of": "South Korea",
  "Iran, Islamic Republic of": "Iran",
  "Egypt, Arab Republic": "Egypt",
  "Venezuela, RB": "Venezuela",
  "Vietnam": "Viet Nam",
  "Bahamas, The": "Bahamas",
  "Gambia, The": "Gambia",
  "Yemen, Rep.": "Yemen",
  "Czechia": "Czech Republic",
  "Slovak Republic": "Slovakia",
  "Syrian Arab Republic": "Syria",
  "Brunei Darussalam": "Brunei",
  "Lao PDR": "Laos",
  "Hong Kong SAR, China": "Hong Kong",
  "Macedonia, FYR": "North Macedonia",
  "Bolivia (Plurinational State of)": "Bolivia",
  "Tanzania, United Republic of": "Tanzania",
  "Taiwan, Province of China": "Taiwan"
};

// Step 4: Create variables to store the data and map layer
let mergedData = [];
let geoLayer = null;

// Step 5: Load both our dataset (JSON) and the world map (GeoJSON)
Promise.all([
  fetch("merged_data_2002_2022_final.json").then(res => res.json()),
  fetch("https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json").then(res => res.json())
]).then(([jsonData, geoData]) => {
  mergedData = jsonData;

  // Step 6: Fill the year dropdown with options
  const years = [...new Set(mergedData.map(row => row.Year))].sort();
  const dropdown = document.getElementById("yearSelect");

  years.forEach(year => {
    const option = document.createElement("option");
    option.value = year;
    option.text = year;
    dropdown.appendChild(option);
  });

  // Set the default year to 2022
  dropdown.value = 2022;

  // Show the first version of the map
  renderMap(geoData, 2022);

  // When dropdown changes, update the map
  dropdown.addEventListener("change", () => {
    const selectedYear = parseInt(dropdown.value);
    renderMap(geoData, selectedYear);
  });
});

// Step 7: Function that draws the map based on year
function renderMap(geoData, selectedYear) {
  // Remove old map layer (if any)
  if (geoLayer) {
    myMap.removeLayer(geoLayer);
  }

  // Create a new map layer with country shapes and color them by GINI
  geoLayer = L.geoJSON(geoData, {
    style: function (feature) {
      let geoName = feature.properties.name;
      let fixedName = nameFixes[geoName] || geoName;

      // Find the data for the selected year and country
      let match = mergedData.find(row => row["Country Name"] === fixedName && row.Year === selectedYear);
      let gini = match ? match.GINI_index : null;

      // Pick color based on GINI value
      let fillColor;
      if (gini === null) {
        fillColor = "#ccc"; // Gray for no data
      } else if (gini < 30) {
        fillColor = "#d4eeff"; // Light blue for low inequality
      } else if (gini < 40) {
        fillColor = "#74a9cf"; // Medium blue for moderate inequality
      } else {
        fillColor = "#0570b0"; // Dark blue for high inequality
      }

      return {
        fillColor: fillColor,
        color: "#999",
        weight: 1,
        fillOpacity: 0.8
      };
    },

    // Step 8: Add popup to each country
    onEachFeature: function (feature, layer) {
      let geoName = feature.properties.name;
      let fixedName = nameFixes[geoName] || geoName;
      let match = mergedData.find(row => row["Country Name"] === fixedName && row.Year === selectedYear);

      let gini = match && match.GINI_index !== null ? match.GINI_index : "No data";
      let gdp = match && match.GDP_per_capita !== null ? `$${match.GDP_per_capita.toLocaleString()}` : "No data";
      let pop = match && match.Population !== null ? match.Population.toLocaleString() : "No data";

      layer.bindPopup(`
        <strong>${fixedName}</strong><br>
        Year: ${selectedYear}<br>
        GINI Index: ${gini}<br>
        GDP per Capita: ${gdp}<br>
        Population: ${pop}
      `);
    }

  }).addTo(myMap);
}

// Step 9: Hide the loading spinner after everything loads
document.getElementById("loader").style.display = "none";
