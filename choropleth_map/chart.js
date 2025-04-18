// === chart.js ===
// This file handles:
// 1. Top 10 Countries by Average GINI (Bar Chart)
// 2. GINI Trend by Country (Line Chart)

// Global variables to store charts and data
let giniChart;
let lineChart;
let allFeatures = [];

// === Step 1: Load the JSON data file ===
fetch("choropleth_map_clean.json")
  .then((res) => res.json())
  .then((data) => {
    allFeatures = data.features;

    // Draw both charts when data is loaded
    drawAverageGiniBarChart();
    populateCountryDropdown(); // Fill the dropdown once
    drawLineChart("Canada"); // Default line chart for Canada
  });

// === Step 2: Bar Chart - Top 10 Countries by Average GINI ===
function drawAverageGiniBarChart() {
  const giniMap = {}; // Stores country → list of GINI values

  // Group GINI values per country
  allFeatures.forEach((f) => {
    const country = f.properties.Country;
    const gini = f.properties.GINI_Coefficient;

    // Only keep valid numeric values
    if (country && gini !== null && gini !== "No data") {
      if (!giniMap[country]) giniMap[country] = [];
      giniMap[country].push(parseFloat(gini));
    }
  });

  // Calculate averages
  const avgGINIs = [];
  for (const country in giniMap) {
    const values = giniMap[country];
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    avgGINIs.push({ country, avg });
  }

  // Get top 10 countries by average GINI
  const top10 = avgGINIs.sort((a, b) => b.avg - a.avg).slice(0, 10);
  const labels = top10.map((d) => d.country);
  const values = top10.map((d) => d.avg.toFixed(3));

  // Create or update chart
  const ctx = document.getElementById("giniChart").getContext("2d");
  if (giniChart) giniChart.destroy(); // Remove old chart if it exists

  giniChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Average GINI (2000–2022)",
          data: values,
          backgroundColor: "#6baed6",
          borderColor: "#2171b5",
          borderWidth: 1,
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: "Top 10 Countries by Average GINI (2000–2022)",
        },
        legend: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Average GINI Index",
          },
        },
      },
    },
  });
}

// === Step 3: Fill Dropdown with Country Names ===
function populateCountryDropdown() {
  const dropdown = document.getElementById("countrySelect");

  // If already filled, skip
  if (dropdown.options.length > 0) return;

  const countrySet = new Set();
  allFeatures.forEach((f) => {
    if (f.properties.Country) {
      countrySet.add(f.properties.Country);
    }
  });

  const sortedCountries = Array.from(countrySet).sort();

  sortedCountries.forEach((country) => {
    const option = document.createElement("option");
    option.value = country;
    option.textContent = country;
    dropdown.appendChild(option);
  });

  dropdown.value = "Canada"; // Set default

  // When user selects a different country
  dropdown.addEventListener("change", () => {
    drawLineChart(dropdown.value);
  });
}

// === Step 4: Line Chart - GINI Trend for Selected Country ===
function drawLineChart(countryName) {
  // Filter data for selected country and remove nulls
  const filtered = allFeatures
    .filter(
      (f) =>
        f.properties.Country === countryName &&
        f.properties.GINI_Coefficient !== null &&
        f.properties.GINI_Coefficient !== "No data"
    )
    .sort((a, b) => a.properties.Year - b.properties.Year);

  // Get the chart container area
  const container = document.getElementById("giniLineChart").parentElement;

  // If no data is found, show error message
  if (filtered.length === 0) {
    container.innerHTML = `
      <h2>GINI Index Over Time</h2>
      <label for="countrySelect">Select Country:</label>
      <select id="countrySelect"></select>
      <p style="color:#b22222; font-weight:bold; margin-top:20px;">
        Sorry, no GINI Index data is available for <u>${countryName}</u>.
      </p>
    `;
    populateCountryDropdown(); // refill dropdown
    document.getElementById("countrySelect").value = countryName;
    return;
  }

  // If valid data exists, recreate canvas + dropdown
  container.innerHTML = `
    <h2>GINI Index Over Time</h2>
    <label for="countrySelect">Select Country:</label>
    <select id="countrySelect"></select>
    <canvas id="giniLineChart"></canvas>
  `;

  populateCountryDropdown();
  document.getElementById("countrySelect").value = countryName;

  const years = filtered.map((f) => f.properties.Year);
  const values = filtered.map((f) => parseFloat(f.properties.GINI_Coefficient));

  const ctx = document.getElementById("giniLineChart").getContext("2d");

  if (lineChart) lineChart.destroy();

  lineChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: years,
      datasets: [
        {
          label: `GINI Index - ${countryName}`,
          data: values,
          borderColor: "#2171b5",
          backgroundColor: "#6baed6",
          fill: false,
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: `GINI Index Trend for ${countryName}`,
        },
      },
      scales: {
        y: {
          title: { display: true, text: "GINI Index" },
        },
        x: {
          title: { display: true, text: "Year" },
        },
      },
    },
  });
}
