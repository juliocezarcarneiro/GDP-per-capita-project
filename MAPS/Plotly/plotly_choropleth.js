
async function drawChoropleth() {
    const response = await fetch('plotly_gdp_gini_data.json');
    const data = await response.json();
    
    const years = Object.keys(data).sort();
    let frames = [];
    let initialData = data[years[0]];
    
    const trace = {
        type: 'choropleth',
        locations: initialData.map(d => d.code),
        z: initialData.map(d => d.gdp),
        text: initialData.map(d => 
            `${d.country}<br>GDP per Capita: $${parseFloat(d.gdp).toFixed(2)}<br>GINI Coefficient: ${d.gini}`),
        hoverinfo: 'text',
        colorscale: 'Viridis',
        colorbar: { title: 'GDP per Capita (USD)' },
        zauto: true
    };

    years.forEach(year => {
        let frame = {
            name: year,
            data: [{
                locations: data[year].map(d => d.code),
                z: data[year].map(d => d.gdp),
                text: data[year].map(d =>
                    `${d.country}<br>GDP per Capita: $${parseFloat(d.gdp).toFixed(2)}<br>GINI Coefficient: ${d.gini}`),
                hoverinfo: 'text'
            }]
        };
        frames.push(frame);
    });

    const layout = {
        title: 'GDP per Capita by Country (GINI shown on hover)',
        geo: {
            showframe: false,
            showcoastlines: false,
            projection: { type: 'equirectangular' }
        },
        updatemenus: [{
            buttons: years.map(year => ({
                method: 'animate',
                args: [[year], {
                    mode: 'immediate',
                    transition: { duration: 300 },
                    frame: { duration: 300, redraw: true }
                }],
                label: year
            })),
            direction: 'down',
            showactive: true,
            x: 0.1,
            y: 1.15,
            xanchor: "left",
            yanchor: "top"
        }]
    };

    Plotly.newPlot('plotly-map', [trace], layout).then(() => {
        Plotly.addFrames('plotly-map', frames);
    });
}

drawChoropleth();
