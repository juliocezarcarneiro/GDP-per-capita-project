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
  "Norway": "Europe",
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
  "Panama": "Americas",
  "Albania": "Other",
  "Algeria": "Other",
  "Angola": "Other",
  "Argentina": "Americas",
  "Armenia": "Other",
  "Australia": "Oceania",
  "Austria": "Other",
  "Azerbaijan": "Other",
  "Belarus": "Other",
  "Belgium": "Other",
  "Benin": "Other",
  "Bhutan": "Other",
  "Bolivia": "Other",
  "Bosnia and Herzegovina": "Other",
  "Botswana": "Other",
  "Brazil": "Americas",
  "Bulgaria": "Other",
  "Burkina Faso": "Other",
  "Burundi": "Other",
  "Cabo Verde": "Other",
  "Cameroon": "Other",
  "Canada": "Americas",
  "Central African Republic": "Africa",
  "Chad": "Other",
  "Chile": "Americas",
  "China": "Asia",
  "Colombia": "Americas",
  "Comoros": "Other",
  "Congo, Dem. Rep.": "Other",
  "Congo, Rep.": "Other",
  "Costa Rica": "Other",
  "Cote d'Ivoire": "Other",
  "Croatia": "Other",
  "Cyprus": "Other",
  "Czechia": "Other",
  "Djibouti": "Other",
  "Dominican Republic": "Other",
  "Egypt, Arab Rep.": "Africa",
  "El Salvador": "Other",
  "Estonia": "Other",
  "Eswatini": "Other",
  "Fiji": "Oceania",
  "France": "Europe",
  "Gabon": "Other",
  "Gambia, The": "Other",
  "Georgia": "Other",
  "Germany": "Europe",
  "Grenada": "Other",
  "Guatemala": "Other",
  "Guinea": "Other",
  "Guinea-Bissau": "Other",
  "Haiti": "Other",
  "Honduras": "Other",
  "Hungary": "Other",
  "Iceland": "Other",
  "India": "Asia",
  "Indonesia": "Asia",
  "Iran, Islamic Rep.": "Asia",
  "Iraq": "Asia",
  "Ireland": "Other",
  "Israel": "Asia",
  "Italy": "Europe",
  "Jamaica": "Other",
  "Japan": "Asia",
  "Jordan": "Other",
  "Kenya": "Africa",
  "Kiribati": "Other",
  "Korea, Rep.": "Asia",
  "Kyrgyz Republic": "Other",
  "Lao PDR": "Other",
  "Latvia": "Other",
  "Lebanon": "Other",
  "Lesotho": "Other",
  "Liberia": "Other",
  "Lithuania": "Other",
  "Luxembourg": "Other",
  "Madagascar": "Other",
  "Malawi": "Other",
  "Maldives": "Other",
  "Mali": "Other",
  "Malta": "Other",
  "Marshall Islands": "Other",
  "Mauritania": "Other",
  "Mauritius": "Other",
  "Mexico": "Americas",
  "Micronesia, Fed. Sts.": "Other",
  "Moldova": "Other",
  "Mongolia": "Other",
  "Montenegro": "Other",
  "Mozambique": "Other",
  "Myanmar": "Other",
  "Namibia": "Other",
  "Nauru": "Other",
  "Nicaragua": "Other",
  "Niger": "Other",
  "Nigeria": "Africa",
  "North Macedonia": "Other",
  "Pakistan": "Other",
  "Papua New Guinea": "Other",
  "Paraguay": "Other",
  "Romania": "Other",
  "Russian Federation": "Other",
  "Rwanda": "Other",
  "Samoa": "Oceania",
  "Sao Tome and Principe": "Other",
  "Senegal": "Other",
  "Serbia": "Other",
  "Seychelles": "Other",
  "Sierra Leone": "Other",
  "Slovak Republic": "Other",
  "Slovenia": "Other",
  "Solomon Islands": "Other",
  "South Africa": "Africa",
  "Spain": "Europe",
  "St. Lucia": "Other",
  "Sudan": "Other",
  "Switzerland": "Other",
  "Syrian Arab Republic": "Other",
  "Tajikistan": "Other",
  "Timor-Leste": "Other",
  "Togo": "Other",
  "Tonga": "Other",
  "Turkiye": "Other",
  "Tuvalu": "Other",
  "United Arab Emirates": "Other",
  "United Kingdom": "Europe",
  "United States": "Americas",
  "Uruguay": "Other",
  "Uzbekistan": "Other",
  "Vanuatu": "Other",
  "Viet Nam": "Other",
  "Yemen, Rep.": "Other"
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
  "NOR": [60.472, 8.4689],
  "SWE": [60.1282, 18.6435],
  "FIN": [61.9241, 25.7482],
  "DNK": [56.2639, 9.5018],
  "POL": [51.9194, 19.1451],
  "NLD": [52.1326, 5.2913],
  "PRT": [39.3999, -8.2245],
  "GRC": [39.0742, 21.8243],
  "TUR": [38.9637, 35.2433],
  "SAU": [23.8859, 45.0792],
  "ARE": [23.4241, 53.8478],
  "QAT": [25.3548, 51.1839],
  "MYS": [4.2105, 101.9758],
  "THA": [15.87, 100.9925],
  "BGD": [23.685, 90.3563],
  "NPL": [28.3949, 84.124],
  "LKA": [7.8731, 80.7718],
  "KAZ": [48.0196, 66.9237],
  "UKR": [48.3794, 31.1656],
  "KOR": [35.9078, 127.7669],
  "VNM": [14.0583, 108.2772],
  "PHL": [12.8797, 121.774],
  "NZL": [-40.9006, 174.886],
  "MAR": [31.7917, -7.0926],
  "TUN": [33.8869, 9.5375],
  "GHA": [7.9465, -1.0232],
  "ETH": [9.145, 40.4897],
  "UGA": [1.3733, 32.2903],
  "TZA": [-6.369, 34.8888],
  "ZMB": [-13.1339, 27.8493],
  "ZWE": [-19.0154, 29.1549],
  "PER": [-9.1899, -75.0152],
  "VEN": [6.4238, -66.5897],
  "ECU": [-1.8312, -78.1834],
  "PAN": [8.538, -80.7821],
  "AGO": [32.8855, -38.6573],
  "ALB": [-20.8711, -72.2513],
  "ARG": [-20.5567, 111.9736],
  "ARM": [52.1369, 89.2017],
  "AUS": [-33.0197, 35.7951],
  "AUT": [51.4189, -89.3439],
  "AZE": [-20.9528, 0.4728],
  "BDI": [11.9172, -38.8861],
  "BEL": [-0.9974, -41.0456],
  "BEN": [25.0202, 134.0677],
  "BFA": [-35.4368, -92.9732],
  "BGR": [-39.257, 86.539],
  "BIH": [-32.526, 55.6284],
  "BLR": [-26.3375, -96.4679],
  "BOL": [21.1475, 136.3474],
  "BRA": [-46.9603, -44.6888],
  "BTN": [54.2076, 65.9764],
  "BWA": [-45.8637, -58.042],
  "CAF": [-44.5968, -119.2114],
  "CAN": [41.6683, -10.5778],
  "CHE": [-48.8913, 42.4249],
  "CHL": [28.8047, -36.4427],
  "CHN": [39.0836, -41.776],
  "CIV": [57.8555, 94.0772],
  "CMR": [-42.913, -78.521],
  "COD": [31.5173, 25.2122],
  "COG": [-36.5531, -84.0337],
  "COL": [54.9331, -59.5347],
  "COM": [43.1425, -125.0203],
  "CPV": [-9.105, 34.2114],
  "CRI": [47.4542, -88.4328],
  "CYP": [46.9972, -52.0942],
  "CZE": [-33.6473, 90.8578],
  "DEU": [-8.7182, 126.4292],
  "DJI": [15.034, 46.5847],
  "DOM": [34.3289, -11.5019],
  "DZA": [-22.188, 99.3437],
  "EGY": [40.1805, -15.009],
  "ESP": [-43.2458, 58.2726],
  "EST": [-1.959, -38.1033],
  "FJI": [-40.2772, 122.4281],
  "FRA": [-31.2807, 73.7677],
  "FSM": [-46.067, 55.5131],
  "GAB": [-11.7175, -104.989],
  "GBR": [-31.5645, -47.3024],
  "GEO": [53.3948, 140.4135],
  "GIN": [36.5909, -72.0932],
  "GMB": [1.6066, -34.4556],
  "GNB": [19.1576, 111.2302],
  "GRD": [-32.6518, -113.3247],
  "GTM": [2.6254, 96.1346],
  "HND": [-37.6709, 131.2179],
  "HRV": [-35.1544, 53.2012],
  "HTI": [34.1618, -41.8716],
  "HUN": [23.0838, -54.8971],
  "IDN": [9.0373, -128.532],
  "IND": [56.9481, -82.4063],
  "IRL": [4.9482, 55.8067],
  "IRN": [-1.4385, 79.8206],
  "IRQ": [1.7957, 58.5568],
  "ISL": [35.8222, -51.054],
  "ISR": [46.8885, -1.4769],
  "ITA": [33.0303, -5.0146],
  "JAM": [28.5863, -80.0116],
  "JOR": [-18.138, -114.4462],
  "JPN": [-9.2901, 15.4201],
  "KEN": [7.6456, 81.3576],
  "KGZ": [-8.8077, -25.5583],
  "KIR": [52.6501, -38.5027],
  "LAO": [8.9252, 29.0381],
  "LBN": [-49.6358, 149.455],
  "LBR": [9.3989, -58.0693],
  "LCA": [-42.1377, -60.8737],
  "LSO": [-6.7584, 64.0506],
  "LTU": [7.6741, -65.9223],
  "LUX": [41.1884, 143.7937],
  "LVA": [3.0565, 84.274],
  "MDA": [-28.4713, 138.7895],
  "MDG": [-22.9281, 22.5384],
  "MDV": [-47.4849, -29.8897],
  "MEX": [-24.1022, -5.6397],
  "MHL": [-9.9951, -35.5055],
  "MKD": [48.8666, -89.884],
  "MLI": [7.0528, 95.1946],
  "MLT": [-4.3138, 49.7128],
  "MMR": [10.3408, 80.5017],
  "MNE": [5.9143, 79.3939],
  "MNG": [-28.8737, -125.5795],
  "MOZ": [50.6859, 43.0673],
  "MRT": [-29.1924, 75.2405],
  "MUS": [-25.4981, 14.9288],
  "MWI": [24.5752, -75.1536],
  "NAM": [27.9406, 136.3409],
  "NER": [-7.9142, -33.6613],
  "NGA": [5.4147, -21.5692],
  "NIC": [-27.6387, 98.5842],
  "NRU": [-47.2916, 104.8849],
  "PAK": [-31.9334, 125.597],
  "PNG": [-47.8492, 134.9407],
  "PRY": [21.2011, 56.9048],
  "ROU": [22.3501, 117.9233],
  "RUS": [13.5153, 146.3868],
  "RWA": [8.141, 96.8737],
  "SDN": [5.8057, 47.7889],
  "SEN": [-15.597, 11.021],
  "SLB": [30.1611, -36.8864],
  "SLE": [3.9953, 14.6128],
  "SLV": [-18.8087, -11.6522],
  "SRB": [23.0141, 70.4885],
  "STP": [13.525, -47.6227],
  "SVK": [4.1207, -104.8396],
  "SVN": [57.7784, -2.8973],
  "SWZ": [20.9528, 35.9293],
  "SYC": [-27.114, 80.6974],
  "SYR": [-12.5097, -103.1931],
  "TCD": [-29.3807, 26.2396],
  "TGO": [33.6216, -107.7985],
  "TJK": [-13.0171, -65.8473],
  "TLS": [-31.7579, -128.2817],
  "TON": [29.4155, 5.5299],
  "TUV": [56.0522, 37.2157],
  "URY": [12.2865, 46.3619],
  "USA": [3.4609, 133.7623],
  "UZB": [-1.3384, 113.0213],
  "VUT": [-44.0565, -101.6992],
  "WSM": [44.3041, -99.8733],
  "YEM": [-44.0203, 128.2096],
  "ZAF": [37.6608, 7.5775]
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