// === Choropleth Map Script with Final GINI Styling ===

// Step 1: Create map centered globally
let map = L.map("map").setView([20, 0], 2); // [Latitude, Longitude], Zoom level

// Step 2: Add the background map tiles (from OpenStreetMap)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

// Step 3: Load the cleaned JSON data
fetch("choropleth_map_clean.json")
  .then(response => response.json())
  .then(data => {
    const slider = document.getElementById("yearSlider");
    const selectedYear = document.getElementById("selectedYear");

    let geojsonLayer; // This will hold our map layer

    // === Step 4: Color Function Based on GINI Value ===
    function getColor(gini) {
      if (gini === null || gini === "No data") return "#d9d9d9"; // gray for missing
      gini = parseFloat(gini);
      if (gini >= 40) return "#2171b5";        // High inequality (dark blue)
      if (gini >= 30) return "#6baed6";        // Moderate inequality
      if (gini < 30)  return "#c6dbef";        // Low inequality (light blue)
      return "#f7fbff";                        // fallback (very pale blue)
    }

    // === Step 5: Function to Draw or Update the Map Layer ===
    function updateMap(year) {
      // Remove old layer before adding a new one
      if (geojsonLayer) geojsonLayer.remove();

      geojsonLayer = L.geoJSON(data, {
        filter: f => f.properties.Year === year, // Only show countries for selected year
        style: f => ({
          fillColor: getColor(f.properties.GINI_Coefficient),
          weight: 0.5,
          color: "#ccc",
          fillOpacity: 0.8
        }),
        onEachFeature: (feature, layer) => {
          const p = feature.properties;
          // === Popup on click ===
          layer.bindPopup(`
            <strong>${p.Country}</strong><br>
            Year: ${p.Year}<br>
            GINI Index: ${p.GINI_Coefficient}<br>
            GDP per Capita: $${p.GDP}<br>
            Health Spending: $${p.Health}<br>
            Population: ${p.Population} million
          `);
        }
      }).addTo(map);
    }

    // === Step 6: Load initial map for year 2000 ===
    updateMap(2000);

    // === Step 7: Listen for year slider changes ===
    slider.addEventListener("input", () => {
      const year = parseInt(slider.value);
      selectedYear.textContent = year;
      updateMap(year); // Refresh map with new year's data
    });

    // === Step 8: Add GINI Legend on Bottom Left ===
    const legend = L.control({ position: "bottomleft" });

    legend.onAdd = function () {
      const div = L.DomUtil.create("div", "legend");
      div.innerHTML = `
        <strong>GINI Index Scale</strong><br>
        <i style="background:#c6dbef"></i> Low Inequality (under 30)<br>
        <i style="background:#6baed6"></i> Moderate Inequality (30–39)<br>
        <i style="background:#2171b5"></i> High Inequality (40+)<br>
        <i style="background:#d9d9d9"></i> No Data
      `;
      return div;
    };

    legend.addTo(map);
  });
