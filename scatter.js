// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
  width = 800 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom,
  x_pad = 0.15,
  curr_tweet = "elonmusk";
  curr_stock = "GME_returns",



draw(curr_tweet, curr_stock)

function parseDate(date) {
  return date.toString().split(' ').slice(0, 5).join(' ')
}


d3.selectAll("input[name='Tweets']").on("change", function () {
  $("#d3").empty();
  $("#tweettxt").empty();
  console.log(this.id);
  draw(this.id, curr_stock);
  curr_tweet = this.id;
});

d3.selectAll("input[name='sentiment']").on("change", function () {
  $("#d3").empty();
  $("#tweettxt").empty();
  console.log(this.id);
  draw(curr_tweet, this.id);
  curr_stock = this.id;
});

function draw(tweet, stock){

  // append the svg object to the body of the page
  var svg = d3.select("#d3")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")")


  //Read the data
  d3.csv(`data/final_new_data/${tweet}.csv`, function (data) {
    console.log(tweet);
    console.log(stock);
    // Add Y axis
    var abs_min = d3.min(data, d => +d.sentiment)
    var abs_max = d3.max(data, d => +d.sentiment)
    // Add Y axis
    var x = d3.scaleLinear()
      .domain([abs_min - x_pad, abs_max + x_pad])
      .range([margin.left, width - margin.right])

    // Add X axis
    // var x = d3.scaleTime()
    //   .domain(d3.extent(data, d => d.timestamp))
    //   .range([margin.left, width - margin.right])

    // var xAxis = svg.append("g")
    //   .attr("transform", `translate(0,${height - margin.bottom})`)
    //   .attr("class", "x-axis")
    //   .attr("clip-path", "url(#clip)")
    //   .call(d3.axisBottom(x).tickSize(-height * 1.3).ticks(10))

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .attr("class", "x-axis")
      .call(d3.axisBottom(x).tickSize(-height * 1.3).ticks(10))
      .select(".domain").remove()

    // Add Y axis
    var abs_min = d3.min(data, d => +d[stock])
    var abs_max = d3.max(data, d => +d[stock])
    var pad = abs_max / 10
    // Add Y axis
    var y = d3.scaleLinear()
      .domain([abs_min - pad, abs_max + pad])
      .range([height - margin.bottom, margin.top])

    // var yAxis = svg.append("g")
    //   .attr("class", "y-axis")
    //   .attr("transform", `translate(${margin.left},0)`)
    //   .call(d3.axisLeft(y));

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .attr("class", "y-axis")
      .call(d3.axisLeft(y).tickSize(-width * 1.3).ticks(7))
      .select(".domain").remove()

    // Customization
    svg.selectAll(".tick line").attr("stroke", "white")

    // Add X axis label:
    svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width / 2 + margin.left - 5)
      .attr("y", height + margin.top + 20)
      .text("Sentiment");

    // Y axis label:
    svg.append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", 40 - (margin.left))
      .attr("x", 60 - (height / 2))
      .text("Price Returns")

    // // Color scale: give me a specie name, I return a color
    // var color = d3.scaleOrdinal()
    //   .domain(["setosa", "versicolor", "virginica"])
    //   .range(["#F8766D", "#00BA38", "#619CFF"])



    // .style("fill", function (d) { return color(d.Species) })
    var tooltip = d3.select("#tweettxt")
      .append("div")
      .style("opacity", 0)
      .attr("id", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("font-size", "14px")
      


    // A function that change this tooltip when the user hover a point.
    // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
    var mouseover = function (d) {
      console.log("hitt")
      tooltip
        .style("opacity", 1)
      
      var f = d3.select("#tweettxt").style("display", "block")

      var ref = d3.select("#link")
        .attr("href", d.link)
    }
    var mousemove = function (d) {
      console.log('hit');
      tooltip
        .html("@" + d.user+ " "+ d.txt)
        .style("left", (d3.mouse(this)[0] + 10) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
        .style("top", (d3.mouse(this)[1]) + "px")
      
    }

    // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    var mouseleave = function (d) {
      tooltip
        .transition()
        .duration(200)
        // .style("opacity", 0)
    }
    // Add dots
    svg.append('g')
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function (d) { return x(d.sentiment); })
      .attr("cy", function (d) { return y(d[stock]); })
      .attr("r", 4)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
    // // Add dots
    // svg.append('g')
    //   .selectAll("dot")
    //   .data(data.filter(function (d, i) { return i < 50 })) // the .filter part is just to keep a few dots on the chart, not all of them
    //   .enter()
    //   .append("circle")
    //   .attr("cx", function (d) { return x(d.GrLivArea); })
    //   .attr("cy", function (d) { return y(d.SalePrice); })
    //   .attr("r", 7)
    //   .style("fill", "#69b3a2")
    //   .style("opacity", 0.3)
    //   .style("stroke", "white")
    //   .on("mouseover", mouseover)
    //   .on("mousemove", mousemove)
    //   .on("mouseleave", mouseleave)


  })

}
