// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
  width = 800 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom,
  pad = 10;


// append the svg object to the body of the page
var svg = d3.select("#d3")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("data/GME.csv",
  function(d){
  return {date : d3.timeParse("%Y-%m-%d")(d.date), value : d.value }
  },

  function(data) {

    // Add X axis --> it is a date format
    var x = d3.scaleTime()
      .domain(d3.extent(data, d => d.date))
      .range([ 0, width ]);

    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("class", "axis")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([d3.min(data, d => +d.value) - pad, d3.max(data, d => +d.value) + pad])
      .range([ height, 0 ]);

    svg.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y));

    var bisect = d3.bisector(function(d) { return d.date; }).left;

    // Create the circle
    var focus = svg
      .append('g')
      .append('circle')
        .style("fill", "white")
        .attr("stroke", "white")
        .attr('r', 5.5)
        .style("opacity", 0)
  
    // Create the text
    var focusText = svg
      .append('g')
      .append('text')
        .style("opacity", 0)
        .attr("text-anchor", "left")
        .attr("fill", "white")
        .attr("alignment-baseline", "middle")
  
    // Add the line
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", .5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d.value) })
        )
  
    // Rectangle covering graph to trigger mouse events
    svg.append('rect')
      .style("fill", "none")
      .style("pointer-events", "all")
      .attr('width', width)
      .attr('height', height)
      .on('mouseover', mouseover)
      .on('mousemove', mousemove)
      .on('mouseout', mouseout);

      function mouseover() {
        focus.style("opacity", 1)
        focusText.style("opacity",1)
      }

      function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]);
        var i = bisect(data, x0, 1);
        selectedData = data[i]
        focus
          .attr("cx", x(selectedData.date))
          .attr("cy", y(selectedData.value))
        focusText
          .html("Date:" + selectedData.date + "  -  " + "Value:" + selectedData.value)
          .attr("x", x(selectedData.date)+20)
          .attr("y", y(selectedData.value)+20)
      }

      function mouseout() {
        focus.style("opacity", 1)
        focusText.style("opacity",1)
      }
  })