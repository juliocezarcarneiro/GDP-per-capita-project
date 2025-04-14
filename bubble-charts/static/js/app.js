// Initialize the page
function init() {
  buildCharts();
}

// Build the bubble chart without regions
function buildCharts() {
  // Show loading state
  d3.select("#bubble").html('<div class="text-center mt-5"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div><p>Loading data...</p></div>');

  d3.json("https://juliocezarcarneiro.github.io/GDP-per-capita-project/bubble-charts/countries-data.json")
    .then((data) => {
      // Data processing
      let countries = data.map(d => d["Country Name"]);
      let gdp = data.map(d => d.gdp_per_capita);
      let health = data.map(d => d.health_spending);

      // Simplified bubble chart data without regions
      let bubbleData = [{
        x: gdp,
        y: health,
        text: countries.map((c, i) => 
          `<b>${c}</b><br>` +
          `GDP per capita: $${gdp[i].toLocaleString()}<br>` +
          `Health spending: $${health[i].toLocaleString()}`
        ),
        mode: 'markers',
        marker: {
          size: health.map(h => Math.sqrt(h) * 3),
          sizemode: 'area',
          sizeref: 0.1,
          color: '#1f77b4', // Single color for all bubbles
          opacity: 0.7,
          line: {
            width: 1,
            color: '#333'
          }
        },
        type: 'scatter',
        hoverinfo: 'text',
        hoverlabel: {
          bgcolor: 'white',
          font: {
            family: 'Arial',
            size: 12,
            color: 'black'
          }
        }
      }];

      // Simplified layout without region legend
      const bubbleLayout = {
        title: {
          text: 'GDP per Capita vs Health Spending per Capita by Country',
          font: {
            size: 18,
            family: 'Arial'
          }
        },
        xaxis: {
          title: {
            text: 'GDP per Capita (USD) - Log Scale',
            font: {
              size: 14
            }
          },
          type: 'log',
          gridcolor: '#eee',
          zeroline: false,
          tickformat: '$,.0f'
        },
        yaxis: {
          title: {
            text: 'Health Spending per Capita (USD) - Log Scale',
            font: {
              size: 14
            }
          },
          type: 'log',
          gridcolor: '#eee',
          zeroline: false,
          tickformat: '$,.0f'
        },
        hovermode: 'closest',
        showlegend: false, // No legend needed now
        margin: { t: 80, l: 80, r: 50, b: 80 },
        height: 650,
        plot_bgcolor: 'rgba(240,240,240,0.8)',
        paper_bgcolor: 'rgba(240,240,240,0.3)'
      };

      // Render the chart
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    })
    .catch(error => {
      console.error("Error loading the data: ", error);
      d3.select("#bubble").html(`
        <div class="alert alert-danger mt-4">
          <h4>Error Loading Data</h4>
          <p>${error.message}</p>
          <p>Please try refreshing the page or check your internet connection.</p>
        </div>
      `);
    });
}

// Call init when the page loads
window.onload = init;