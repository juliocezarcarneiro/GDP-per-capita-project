function init() {
  const yearSelect = document.getElementById("yearSelect");
  const year = +yearSelect.value;
  buildBubbleChart(year);
  buildMap(year);
  buildBarChart(year);

  yearSelect.addEventListener("change", () => {
    const newYear = +yearSelect.value;
    buildBubbleChart(newYear);
    buildMap(newYear);
    buildBarChart(newYear);
  });
}

function buildBubbleChart(year) {
  d3.json("final_merged.json").then(data => {
    const filtered = data.filter(d => d.Year === year && d.GDP_per_capita && d.Health_spending_per_capita);

    const regionMap = {
      "Algeria": "Africa", "Angola": "Africa", "Kenya": "Africa", "Nigeria": "Africa", "South Africa": "Africa", "Egypt, Arab Rep.": "Africa",
      "Argentina": "Americas", "Brazil": "Americas", "Canada": "Americas", "Chile": "Americas", "Colombia": "Americas", "Mexico": "Americas", "United States": "Americas",
      "China": "Asia", "India": "Asia", "Indonesia": "Asia", "Iran, Islamic Rep.": "Asia", "Japan": "Asia", "Pakistan": "Asia", "Vietnam": "Asia",
      "Austria": "Europe", "Belgium": "Europe", "France": "Europe", "Germany": "Europe", "Italy": "Europe", "Spain": "Europe", "United Kingdom": "Europe", "Ukraine": "Europe",
      "Australia": "Oceania", "New Zealand": "Oceania", "Norway": "Europe",
  "Sweden": "Europe",
  "Finland": "Europe",
  "Denmark": "Europe",
  "Poland": "Europe",
  "Netherlands": "Europe",
  "Portugal": "Europe",
  "Greece": "Europe",
  "Turkey": "Asia",
  "Saudi Arabia": "Asia",
  "UAE": "Asia",
  "Qatar": "Asia",
  "Malaysia": "Asia",
  "Thailand": "Asia",
  "Bangladesh": "Asia",
  "Nepal": "Asia",
  "Sri Lanka": "Asia",
  "Kazakhstan": "Asia",
  "Ukraine": "Europe",
  "South Korea": "Asia",
  "Vietnam": "Asia",
  "Philippines": "Asia",
  "New Zealand": "Oceania",
  "Morocco": "Africa",
  "Tunisia": "Africa",
  "Ghana": "Africa",
  "Ethiopia": "Africa",
  "Uganda": "Africa",
  "Tanzania": "Africa",
  "Zambia": "Africa",
  "Zimbabwe": "Africa",
  "Peru": "Americas",
  "Venezuela": "Americas",
  "Ecuador": "Americas",
  "Panama": "Americas"
    };

    const colorMap = {
      "Africa": "#1f77b4", "Americas": "#ff7f0e", "Asia": "#2ca02c", "Europe": "#d62728", "Oceania": "#9467bd", "Other": "#7f7f7f"
    };

    const x = filtered.map(d => d.GDP_per_capita);
    const y = filtered.map(d => d.Health_spending_per_capita);
    const countries = filtered.map(d => d["Country Name"]);
    const gini = filtered.map(d => d.GINI_index);
    const regions = filtered.map(d => regionMap[d["Country Name"]] || "Other");
    const colors = regions.map(r => colorMap[r] || "#7f7f7f");

    const hoverText = filtered.map((d, i) =>
      `<b>${countries[i]}</b><br>` +
      `GDP: $${x[i].toLocaleString()}<br>` +
      `Health Spending: $${y[i].toLocaleString()}<br>` +
      `GINI Index: ${gini[i]}`
    );

    const trace = {
      x: x,
      y: y,
      text: hoverText,
      mode: "markers",
      type: "scatter",
      hoverinfo: "text",
      marker: {
        size: y.map(v => Math.sqrt(v) * 2),
        sizemode: "area",
        sizeref: 0.1,
        color: colors,
        opacity: 0.7,
        line: { width: 1, color: "#333" }
      }
    };

    const layout = {
      title: `GDP vs Health Spending (${year})`,
      xaxis: { title: "GDP per Capita (USD)", type: "log", tickformat: "$,.0f" },
      yaxis: { title: "Health Spending per Capita (USD)", type: "log", tickformat: "$,.0f" },
      height: 650,
      hovermode: "closest"
    };

    Plotly.newPlot("bubble", [trace], layout);
  });
}

function buildMap(year) {
  d3.json("final_merged.json").then(data => {
    const filtered = data.filter(d => d.Year === year && d.GDP_per_capita && d.GINI_index);

    const coordsMap = {
      "USA": [37.0902, -95.7129], "CAN": [56.1304, -106.3468], "ARG": [-38.4161, -63.6167],
      "FRA": [46.2276, 2.2137], "DEU": [51.1657, 10.4515], "CHN": [35.8617, 104.1954],
      "JPN": [36.2048, 138.2529], "IND": [20.5937, 78.9629], "BRA": [-14.2350, -51.9253],
      "AUS": [-25.2744, 133.7751], "GBR": [55.3781, -3.4360], "ITA": [41.8719, 12.5674],
      "ESP": [40.4637, -3.7492], "ZAF": [-30.5595, 22.9375], "RUS": [61.5240, 105.3188],
      "KOR": [35.9078, 127.7669], "SAU": [23.8859, 45.0792], "MEX": [23.6345, -102.5528], "NOR": [60.472, 8.4689],
      "SWE": [60.1282, 18.6435],"FIN": [61.9241, 25.7482],"DNK": [56.2639, 9.5018],"POL": [51.9194, 19.1451],
      "NLD": [52.1326, 5.2913],"PRT": [39.3999, -8.2245],"GRC": [39.0742, 21.8243],"TUR": [38.9637, 35.2433],
      "SAU": [23.8859, 45.0792],"ARE": [23.4241, 53.8478],"QAT": [25.3548, 51.1839],"MYS": [4.2105, 101.9758],
      "THA": [15.87, 100.9925],"BGD": [23.685, 90.3563],"NPL": [28.3949, 84.124], "LKA": [7.8731, 80.7718],
      "KAZ": [48.0196, 66.9237],"UKR": [48.3794, 31.1656],"KOR": [35.9078, 127.7669],"VNM": [14.0583, 108.2772],
      "PHL": [12.8797, 121.774],"NZL": [-40.9006, 174.886],"MAR": [31.7917, -7.0926],"TUN": [33.8869, 9.5375],"GHA": [7.9465, -1.0232],
     "ETH": [9.145, 40.4897], "UGA": [1.3733, 32.2903],"TZA": [-6.369, 34.8888],"ZMB": [-13.1339, 27.8493],
     "ZWE": [-19.0154, 29.1549],"PER": [-9.1899, -75.0152],"VEN": [6.4238, -66.5897],"ECU": [-1.8312, -78.1834],
     "PAN": [8.538, -80.7821]
    };

    if (window.myMap) {
      window.myMap.remove();
    }

    window.myMap = L.map("map").setView([20, 0], 2);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "Map data © <a href='https://openstreetmap.org'>OpenStreetMap</a> contributors"
    }).addTo(window.myMap);

    filtered.forEach(country => {
      const coords = coordsMap[country["Country Code"]];
      if (!coords) return;

      const radius = Math.sqrt(country.GDP_per_capita) * 0.2;
      const color = country.GINI_index > 50 ? "red" :
                    country.GINI_index > 40 ? "orange" :
                    country.GINI_index > 30 ? "yellow" : "green";

      L.circleMarker(coords, {
        radius,
        fillColor: color,
        color: "#000",
        weight: 0.5,
        opacity: 1,
        fillOpacity: 0.7
      })
      .bindPopup(`
        <b>${country["Country Name"]}</b><br>
        GDP: $${Math.round(country.GDP_per_capita).toLocaleString()}<br>
        Health Spending: $${Math.round(country.Health_spending_per_capita).toLocaleString()}<br>
        GINI: ${country.GINI_index}
      `)
      .addTo(window.myMap);
    });
  });
}

window.onload = init;


function buildBarChart(year) {
  d3.json("final_merged.json").then(data => {
    const filtered = data
      .filter(d => d.Year === year && d.Health_spending_per_capita)
      .sort((a, b) => b.Health_spending_per_capita - a.Health_spending_per_capita)
      .slice(0, 10);

    const x = filtered.map(d => d["Country Name"]);
    const y = filtered.map(d => d.Health_spending_per_capita);

    const trace = {
      x: x,
      y: y,
      type: "bar",
      marker: {
        color: "teal"
      },
      text: y.map(v => `$${Math.round(v).toLocaleString()}`),
      textposition: "auto"
    };

    const layout = {
      title: `Top 10 Countries by Health Spending (${year})`,
      xaxis: { title: "Country" },
      yaxis: { title: "Health Spending per Capita (USD)", tickformat: "$,.0f" },
      height: 500
    };

    Plotly.newPlot("bar", [trace], layout);
  });
}