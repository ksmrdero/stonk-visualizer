// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
  width = 800 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom,
  pad = 1,
  curr_stock = "GME",
  curr_sub = "wallstreetbets";

$("#instructions").show().delay(5000).fadeOut();
// draw gme and wsb first
draw(curr_stock, curr_sub)

function parseDate(date) {
  return date.toString().split(' ').slice(0, 5).join(' ')
}

d3.selectAll("input[name='stock']").on("change", function () {
  $("#d3").empty();
  console.log(this.id);
  draw(this.id, curr_sub);
  curr_stock = this.id;
});

d3.selectAll("input[name='sentiment']").on("change", function () {
  $("#d3").empty();
  console.log(this.id);
  draw(curr_stock, this.id);
  curr_sub = this.id;
});


function draw(stock, sub) {
  var svg = d3.select("#d3")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  //Read the data
  d3.csv(`data/new/${stock}_${sub}.csv`, //`data/merged/${name}.csv`,
    function (d) {
      return { date: d3.timeParse("%s")(d.timestamp), value: d.price_change, score:d.score_change, raw_score: d.raw_score, price: d.close}
    },

    function (data) {

      // Add X axis
      var x = d3.scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([margin.left, width - margin.right])

      var xAxis = svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .attr("class", "x-axis")
        .attr("clip-path", "url(#clip)")
        .call(d3.axisBottom(x)
          .tickSizeOuter(0));

      var abs_min = d3.min([d3.min(data, d => +d.value), d3.min(data, d => +d.score)])
      var abs_max = d3.max([d3.max(data, d => +d.value), d3.max(data, d => +d.score)])
      
      // Add Y axis
      var y = d3.scaleLinear()
        .domain([abs_min - pad, abs_max + pad])
        .range([height - margin.bottom, margin.top])

      var yAxis = svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

      svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 40 - (margin.left))
        .attr("x", 10 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("fill", "white")
        .text("% Change");


      // Plot Lines
      var line = d3.line()
        .defined(d => !isNaN(d.value))
        .x(d => x(d.date))
        .y(d => y(d.value))

      var line2 = d3.line()
        .defined(d => !isNaN(d.score))
        .x(d => x(d.date))
        .y(d => y(d.score))

      var bisect = d3.bisector(function (d) { return d.date; }).left;

      // Create the circle
      var focus = svg
        .append('g')
        .append('circle')
        .style("fill", "#40B0A6")
        .attr("stroke", "#40B0A6")
        .attr('r', 5.5)
        .style("opacity", 0)

      // Create the text for tooltip
      var tooltipText = svg
        .append('g')
        .append('text')
        .style("opacity", 0)
        .attr("text-anchor", "left")
        .attr("fill", "#40B0A6")
        .attr("alignment-baseline", "middle")

      var focus2 = svg
        .append('g')
        .append('circle')
        .style("fill", "#E1BE6A")
        .attr("stroke", "#E1BE6A")
        .attr('r', 5.5)
        .style("opacity", 0)

      // Create the text
      var tooltipText2 = svg
        .append('g')
        .append('text')
        .style("opacity", 0)
        .attr("text-anchor", "left")
        .attr("fill", "#E1BE6A")
        .attr("alignment-baseline", "middle")

      var focusDate = svg
          .append('g')
          .append('text')
          .style("opacity", 0)
          .attr("text-anchor", "left")
          .attr("fill", "white")
          .attr("alignment-baseline", "middle")

      // Add the line
      var path = svg.append("path")
        .datum(data)
        .attr("class", "path")
        .attr("id", "line1")
        .attr("fill", "none")
        .attr("clip-path", "url(#clip)")
        .attr("stroke", "#40B0A6")
        .attr("stroke-width", .8)
        .attr("d", line);

      // Sentiment Plot Line 
      var sentiment_line = svg.append("path")
        .datum(data)
        .attr("class", "path")
        .attr("id", "line2")
        .attr("fill", "none")
        .attr("clip-path", "url(#clip)")
        .attr("stroke", "#E1BE6A")
        .attr("stroke-width", .8)
        .attr("d", line2);

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
        tooltipText.style("opacity", 1)
        focus2.style("opacity", 1)
        tooltipText2.style("opacity", 1)
        focusDate.style("opacity", 1)
      }

      function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]);
        var i = bisect(data, x0, 1);
        selectedData = data[i];


      
        focus
          .attr("cx", x(selectedData.date))
          .attr("cy", y(selectedData.value))
        tooltipText
          .html("Price Change: " + selectedData.value + "% ($" + selectedData.price + ")")
          .attr("x", width-220)
          .attr("y", 0)
          .attr("font-size", "10px")

         
        focus2
          .attr("cx", x(selectedData.date))
          .attr("cy", y(selectedData.score))
        tooltipText2
          .html("Sentiment Change: " + selectedData.score + "% (" + selectedData.raw_score + ")")
          .attr("x", width - 220)
          .attr("y", 20)
          .attr("font-size", "10px")

        focusDate
          .html("Date: " + parseDate(selectedData.date))
          .attr("x",width-450)
          .attr("y", height+20)
          .attr("font-size", "14px")
        
      }

      // Text disappears when mouse is out of frame
      function mouseout() {
        focus.style("opacity", 0)
        tooltipText.style("opacity", 0)
        focus2.style("opacity", 0)
        tooltipText2.style("opacity", 0)
        focusDate.style("opacity", 0)
      }


      //Zooming Functionality
      svg.call(zoom);
      function zoom(svg) {

        var extent = [
          [margin.left, margin.top],
          [width - margin.right, height - margin.top]
        ];

        var zooming = d3.zoom()
          .scaleExtent([1, 5])
          .translateExtent(extent)
          .extent(extent)
          .on("zoom", zoomed);

        svg.call(zooming);

        function zoomed() {

          x.range([margin.left, width - margin.right]
            .map(d => d3.event.transform.applyX(d)));

          svg.select("#line1")
            .attr("d", line);
          
          svg.select("#line2")
            .attr("d", line2);

          svg.select(".x-axis")
            .call(d3.axisBottom(x)
              .tickSizeOuter(0));
        }
      }
    })
}