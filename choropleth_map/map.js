// === Choropleth Map Script ===
// No zoom on click. Adds glow on slider. Shows year like "2000 ⏳" (year first, emoji after).

// Step 1: Create a global map using Leaflet
let map = L.map("map").setView([20, 0], 2); // Centered on the world

// Step 2: Add background tiles from OpenStreetMap
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

// Step 3: Load our choropleth data (with GINI, GDP, Health, Population)
fetch("choropleth_map_clean.json")
  .then((response) => response.json())
  .then((data) => {
    // Step 4: Get the slider and year label elements from HTML
    const slider = document.getElementById("yearSlider");
    const selectedYear = document.getElementById("selectedYear");
    let geojsonLayer; // This will store our map layer so we can update it

    // Step 5: Function to pick color based on GINI value
    function getColor(gini) {
      if (gini === null || gini === "No data") return "#d9d9d9"; // Gray if no data
      gini = parseFloat(gini); // Convert to number
      if (gini >= 50) return "#08519c"; // Very High
      if (gini >= 40) return "#3182bd"; // High
      if (gini >= 30) return "#6baed6"; // Moderate
      return "#c6e2ff"; // Low
    }

    // Step 6: Main function to draw the map for a given year
    function updateMap(year) {
      // Remove old layer if it's already on map
      if (geojsonLayer) geojsonLayer.remove();

      // Filter only the data for the selected year and create a new layer
      geojsonLayer = L.geoJSON(data, {
        filter: (f) => f.properties.Year === year,
        style: (f) => ({
          fillColor: getColor(f.properties.GINI_Coefficient),
          weight: 1,
          color: "#444",
          fillOpacity: 0.85,
        }),
        onEachFeature: (feature, layer) => {
          const p = feature.properties;
          // Popup content when user clicks a country
          layer.bindPopup(`
            <strong>${p.Country}</strong><br>
            Year: ${p.Year}<br>
            GINI Index: ${p.GINI_Coefficient}<br>
            GDP per Capita: $${p.GDP}<br>
            Health Spending: $${p.Health}<br>
            Population: ${p.Population} million
          `);
        },
      }).addTo(map);
    }

    // Step 7: Initial load - show map for year 2000
    updateMap(2000);

    // Step 8: When user slides to another year, update everything
    slider.addEventListener("input", () => {
      const year = parseInt(slider.value); // Get current slider year

      // ✅ Update label with format like "2005 ⏳"
      selectedYear.textContent = `${year} ⏳`; // <<—— this puts hourglass AFTER year

      // ✨ Add glowing animation
      slider.classList.add("glow");
      setTimeout(() => slider.classList.remove("glow"), 800);

      // Update the map with new year data
      updateMap(year);
    });

    // Step 9: Add a nice GINI Index legend in the bottom left
    const legend = L.control({ position: "bottomleft" });
    legend.onAdd = function () {
      const div = L.DomUtil.create("div", "legend");
      div.innerHTML = `
        <strong>GINI Index Scale</strong><br>
        <i style="background:#c6e2ff"></i> Low Inequality (under 30)<br>
        <i style="background:#6baed6"></i> Moderate Inequality (30–39)<br>
        <i style="background:#3182bd"></i> High Inequality (40–49)<br>
        <i style="background:#08519c"></i> Very High Inequality (50+)<br>
        <i style="background:#d9d9d9"></i> No Data
      `;
      return div;
    };
    legend.addTo(map);
  });
