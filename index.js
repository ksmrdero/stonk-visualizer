/**
 * Main entry point -- this file has been added to index.html in a <script> tag. Add whatever code you want below.
 */
"use strict";

const weatherData = [ // Temperatures are in F; sorry metric system users.
    { // Arrays of length 12, one element for each month, starting with January.
        city: "Urbana, USA",
        averageHighByMonth: [32.9, 37.7, 49.9, 62.8, 73.4, 82.5, 85.0, 83.7, 78.2, 65.2, 50.6, 36.7]
    },
    {
        city: "London, UK",
        averageHighByMonth: [46.6, 47.1, 52.3, 57.6, 64.2, 70.2, 74.3, 73.8, 68.0, 59.9, 52.0, 46.9]
    },
    {
        city: "Cape Town, SA",
        averageHighByMonth: [79.0, 79.7, 77.7, 73.4, 68.5, 64.6, 63.5, 64.0, 66.6, 70.3, 74.3, 76.8]
    }
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


var svg = d3.select("svg"),
    margin = 50,
    width = svg.attr("width") - margin,
    height = svg.attr("height") - margin;

const xScale = d3.scaleBand()
    .domain(MONTHS)
    .range([margin, width]) // TODO
    .padding(0.5); // TODO experiment and choose a number between 0 and 1

const allTemps = weatherData.map(city => city.averageHighByMonth).flat();
// domain([d3.min(weatherData, d => d3.min(d.averageHighByMonth))-20, d3.max(weatherData, d => d3.min(d.averageHighByMonth))]) // TODO
const yScale = d3.scaleLinear()
    .domain([d3.min(allTemps)-20, d3.max(allTemps)])
    .range([height, 0]); // svg.attr("width") is one way to get it

const xAxis = svg.append("g")
    .call(d3.axisBottom(xScale)) // d3 creates a bunch of elements inside the <g>
    .attr("transform", `translate(0, ${height})`) // TODO yTranslation
    .attr("font-size", 8);

const yAxis = svg.append("g")
    .call(d3.axisLeft(yScale))
    .attr("transform", `translate(${margin}, 0)`); // TODO xTranslation

svg.append("text")
    .attr("font-size", 12) // This code duplication signals that these properties
    .attr("font-weight", "bold") // should be moved to CSS. For now, the code is this
    .attr("font-family", "sans-serif") // way to simplify our directions to you.
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "auto")
    .attr("transform", `translate(${margin - 30} ${(height + margin) / 2}) rotate(-90)`)
    .text("Temperature (F)");

// const allTemps = weatherData.map(city => city.averageHighByMonth).flat();
/*
 * Why this line? Because if this script runs before the svg exists, then nothing will happen, and d3 won't even
 * complain.  This delays drawing until the entire DOM has loaded.
 */
window.addEventListener("load", drawGraph);
window.addEventListener("load", populateDropdown);
// window.addEventListener("load", changeTooltip);

function drawGraph() {
    // d3 has been added to the html in a <script> tag so referencing it here should work.

    const svg = d3.select("svg");
    svg.selectAll("rect")
        .data(weatherData[0].averageHighByMonth) // (Hardcoded) only Urbana’s data
        .join("rect")
        .attr("x", (dataPoint, i) => xScale(MONTHS[i])) // i is dataPoint’s index in the data array
        .attr("y", (dataPoint, i) => yScale(dataPoint))
        .attr("width", (dataPoint, i) => xScale.bandwidth())
        .attr("height", (dataPoint, i) => height-yScale(dataPoint))
        .attr("fill", "steelblue");
}

function drawCityData(i) {
    // d3 has been added to the html in a <script> tag so referencing it here should work.

    const svg = d3.select("svg");
    svg.selectAll("rect")
        .data(weatherData[i].averageHighByMonth) // (Hardcoded) only Urbana’s data
        .join("rect")
        .attr("x", (dataPoint, i) => xScale(MONTHS[i])) // i is dataPoint’s index in the data array
        .attr("y", (dataPoint, i) => yScale(dataPoint))
        .attr("width", (dataPoint, i) => xScale.bandwidth())
        .attr("height", (dataPoint, i) => height - yScale(dataPoint))
        .attr("fill", "steelblue");
}

function populateDropdown() {
    const select = d3.select("select");
    // TODO create <option>s as children of the <select>, one for each city

    select.append("option")
        .text("Urbana, USA")

    select.append("option")
        .text("London, UK")

    select.append("option")
        .text("Cape Town, SA")
        

    select.on("change", changeEvent => {
        // Runs when the dropdown is changed
        console.log(changeEvent.target.selectedIndex); // The newly selected index
        drawCityData(changeEvent.target.selectedIndex)
    });
}

function changeTooltip() {
    // var a = d3.select("#tool");
    d3.select("#tool").attr("style", "opacity:1");
    console.log("hit");
}

// rectSelection
//     .on("mouseover", (mouseEvent, d) => {
//         // Runs when the mouse enters a rect.  d is the corresponding data point.
//         // Show the tooltip and adjust its text to say the temperature.

//     })
//     .on("mousemove", (mouseEvent, d) => {/* Runs when mouse moves inside a rect */ })
//     .on("mouseout", (mouseEvent, d) => {/* Runs when mouse exits a rect */ });
svg.selectAll("rect")
    .data(weatherData[0].averageHighByMonth) // (Hardcoded) only Urbana’s data
    .join("rect")
    .attr("x", (dataPoint, i) => xScale(MONTHS[i])) // i is dataPoint’s index in the data array
    .attr("y", (dataPoint, i) => yScale(dataPoint))
    .attr("width", (dataPoint, i) => xScale.bandwidth())
    .attr("height", (dataPoint, i) => height - yScale(dataPoint))
    .attr("fill", "steelblue")
    .on("mouseover", (mouseEvent, d) => {
    // Runs when the mouse enters a rect.  d is the corresponding data point.
    // Show the tooltip and adjust its text to say the temperature.
        d3.select("#tool")
            .attr("style", "opacity:1")
            .text(d);
    })
    .on("mousemove", (mouseEvent, d) => {
        var x = d3.pointer(mouseEvent)[0]+5;
        var y = d3.pointer(mouseEvent)[1];

        d3.select("#tool")
            .attr("style", `left: ${x}px; top: ${y}px; opacity:1`);
    })
    .on("mouseout", (mouseEvent, d) => {
        d3.select("#tool")
        .attr("style", "opacity:0")});
    ;