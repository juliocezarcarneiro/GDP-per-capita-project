// === chart.js ===
// This file handles two charts:
// 1. A bar chart showing Top 10 countries by average GINI index (2000–2022)
// 2. A line chart showing GINI index trend for a specific country (default is Canada)

// Global chart variables
let giniChart;      // Bar chart for top 10
let lineChart;      // Line chart for country trend
let allFeatures = []; // Store all data from the JSON file

// Load the cleaned GeoJSON data
fetch("choropleth_map_clean.json")
  .then(res => res.json())
  .then(data => {
    allFeatures = data.features;

    // Draw both charts once the data is loaded
    drawAverageGiniBarChart();  // Draw bar chart
    drawLineChart("Canada");    // Draw line chart for Canada
  });

// === Function 1: Top 10 Countries by AVERAGE GINI (2000–2022) ===
function drawAverageGiniBarChart() {
  const giniMap = {};  // Object to store GINI values per country

  // Step 1: Group all GINI values by country
  allFeatures.forEach(f => {
    const country = f.properties.Country;
    const gini = f.properties.GINI_Coefficient;

    // Make sure data is valid
    if (country && gini && gini !== "No data") {
      if (!giniMap[country]) {
        giniMap[country] = []; // Start a list if not already there
      }
      giniMap[country].push(parseFloat(gini));
    }
  });

  // Step 2: Calculate the average GINI for each country
  const avgGINIs = [];

  for (const country in giniMap) {
    const values = giniMap[country];
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    avgGINIs.push({ country, avg });
  }

  // Step 3: Sort the averages from highest to lowest and take top 10
  const top10 = avgGINIs.sort((a, b) => b.avg - a.avg).slice(0, 10);
  const labels = top10.map(item => item.country);
  const values = top10.map(item => item.avg.toFixed(3)); // Round to 3 decimal places

  // Step 4: Draw the bar chart
  const ctx = document.getElementById("giniChart").getContext("2d");

  giniChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Average GINI (2000–2022)",
        data: values,
        backgroundColor: "#6baed6",   // Light blue bars
        borderColor: "#2171b5",       // Darker blue outline
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Top 10 Countries by Average GINI (2000–2022)"
        },
        legend: {
          display: false // No legend needed for a single dataset
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Average GINI Index"
          }
        }
      }
    }
  });
}

// === Function 2: GINI Trend Line Chart for a Country (Default: Canada) ===
function drawLineChart(countryName) {
  // Step 1: Filter only the data for the selected country
  const filtered = allFeatures
    .filter(f =>
      f.properties.Country === countryName &&
      f.properties.GINI_Coefficient &&
      f.properties.GINI_Coefficient !== "No data"
    )
    .sort((a, b) => a.properties.Year - b.properties.Year); // Sort by year

  // Step 2: Extract years and GINI values
  const years = filtered.map(f => f.properties.Year);
  const values = filtered.map(f => parseFloat(f.properties.GINI_Coefficient));

  // Step 3: Draw the line chart
  const ctx = document.getElementById("giniLineChart").getContext("2d");

  // Destroy previous chart if exists
  if (lineChart) {
    lineChart.destroy();
  }

  lineChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: years,
      datasets: [{
        label: `GINI Index - ${countryName}`,
        data: values,
        borderColor: "#2171b5",     // Line color
        backgroundColor: "#6baed6", // Dot color
        fill: false,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: `GINI Index Over Time for ${countryName}`
        }
      },
      scales: {
        y: {
          title: {
            display: true,
            text: "GINI Index"
          }
        },
        x: {
          title: {
            display: true,
            text: "Year"
          }
        }
      }
    }
  });
}
