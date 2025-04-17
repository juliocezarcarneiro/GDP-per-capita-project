# GDP-per-capita-project
Bootcamp Data Analytics Project 3.

# Global Wealth and Wellbeing: A deeper data dive into GDP, health, and income inequality in different countries 
Authors: Anqa Javed, Humaira Enayetullah, Julio Carneiro, Shahab Eshghifard. 

## Overview
* This project aims to analyze and visualize patterns of economic development, income inequality, and growth across different countries.

* Using datasets from the Our World in Data catalog— GDP per capita, health care spending, the GINI index (a measure of income inequality), and population density—this analysis will help us understand how national wealth, public investment in health, and income are distributed

* By highlighting regional disparities and global patterns, the visualizations will offer valuable insights into how economic resources and social outcomes are distributed, ultimately  helping understand global development dynamics.


## Tools
* Frontend: HTML, CSS, JavaScript
* Visualization Libraries: D3.js, Plotly, Leaflet.js (mapping) and Charts.js
* Data Handling: CSV/Excel file parsing and cleaning using Python
* Database: MongoDB
  ![tools used](https://github.com/user-attachments/assets/6786f8e2-7ae4-47c0-a1f8-5e1b4e27807e)


## Project Goals
* Clean and structure data
* Process GDP, healthcare, and income data for different countries. Store the cleaned data in a structured database (e.g., PostgreSQL) for efficient querying.
* Analyze economic patterns
    * Compare GDP per capita across countries and regions.
* Track growth trends over time.
Identify economic outliers and changes in development over the past decades.


## Visualizations
Make the data engaging and easy to interpret through modern visualization tools.
Allow users to interact with data using filters and selection tools:
* Bubble Chart (GDP vs Health Spending)
X-axis: GDP per capita
Y-axis: Health Spending
Bubble size: Population
Bubble color: Region or Gini Index
* Choropleth Map
World map color-coded by Gini Index
Tooltip shows GDP & health spending
* Correlation Heatmap
Correlation matrix between GDP, Health Spending, Gini Index
Add year slider to let users explore trends over time

## Research Questions
1. How has GDP per capita changed globally since 1960?
2. Which countries have shown the most consistent growth?
3. What is the correlation between GDP per capita, income and inequality index and the current health expenditure per capita?

## Data Sources
* World Bank Group, GDP per capita. Retrieved from: https://data.worldbank.org/indicator/NY.GDP.PCAP.CD
* World Bank Group, Gini index. Retrieved from: https://data.worldbank.org/indicator/SI.POV.GINI
* World Bank Group, Current health expenditure per capita (current US$). Retrieved from: https://data.worldbank.org/indicator/SH.XPD.CHEX.PC.CD
