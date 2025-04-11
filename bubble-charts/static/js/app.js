// Initialize the page
function init() {
  buildCharts();
}

// Build the bubble chart
function buildCharts() {
  d3.json("https://juliocezarcarneiro.github.io/GDP-per-capita-project/bubble-charts/countries-data.json")
    .then((data) => {
      let countries = data.map(d => d["Country Name"]);
      let gdp = data.map(d => d.gdp_per_capita);
      let health = data.map(d => d.health_spending);

      let bubbleData = [{
        x: gdp,
        y: health,
        text: countries.map((c, i) => `${c}<br>GDP: $${gdp[i]}<br>Health: $${health[i]}`),
        mode: 'markers',
        marker: {
          size: health.map(h => Math.sqrt(h) / 2),
          sizemode: 'area',
          color: 'earth'
        },
      }];

      const bubbleLayout = {
        title: 'GDP per Capita vs Health Spending per Capita by Country',
        xaxis: {
          title: 'GDP per Capita (USD) - Log Scale',
          type: 'log',
          zeroline: false
        },
        yaxis: {
          title: 'Health Spending per Capita (USD) - Log Scale',
          type: 'log',
          zeroline: false
        },
        hovermode: 'closest',
        showlegend: false,
        margin: { t: 50, l: 80, r: 50, b: 80 },
        height: 600
      };

      Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    })
    .catch(error => {
      console.error("Error loading the data: ", error);
    });
}

// Call init when the page loads
window.onload = init;