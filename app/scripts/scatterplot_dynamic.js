// Width & height
var w = 500;
var h = 300;
var padding = 30;

// Dynamic random dataset
var dataset = [];
var numDataPoints = 50;
var maxRange = Math.random() * 1000;
for (var i=0; i<numDataPoints; i++) {
  var newNumber1 = Math.floor(Math.random() * maxRange);
  var newNumber2 = Math.floor(Math.random() * maxRange);
  dataset.push([newNumber1, newNumber2]);
}

// Create scale functions
var xScale = d3.scale.linear()
                      .domain([0, d3.max(dataset, function(d) { return d[0]; })])
                      .range([padding, w - padding * 2]);

var yScale = d3.scale.linear()
                      .domain([0, d3.max(dataset, function(d) { return d[1]; })])
                      .range([h - padding, padding]);

// Define X axis
var xAxis = d3.svg.axis()
                  .scale(xScale)
                  .orient("bottom")
                  .ticks(5);

// Define Y axis
var yAxis = d3.svg.axis()
                  .scale(yScale)
                  .orient("left")
                  .ticks(5);

// Create svg element
var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

// Define clipping path
svg.append("clipPath")
    .attr("id", "chart-area")
    .append("rect")
    .attr("x", padding)
    .attr("y", padding)
    .attr("width", w - padding * 3)
    .attr("height", h - padding * 2);

// Create circles
svg.append("g")
    .attr("id", "circles")
    .attr("clip-path", "url(#chart-area)")
    .selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", function(d) { return xScale(d[0]) })
    .attr("cy", function(d) { return yScale(d[1]) })
    .attr("r", 2);

// Create X axis
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(xAxis);

// Create Y axis
svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + padding + ", 0)")
    .call(yAxis);

// On click, update with new data
d3.select("p")
  .on("click", function() {

    // New values for dataset
    var numValues = dataset.length;
    var maxRange = Math.random() * 1000;
    dataset = [];
    for (var i=0; i<numValues; i++) {
      var newNumber1 = Math.floor(Math.random() * maxRange);
      var newNumber2 = Math.floor(Math.random() * maxRange);
      dataset.push([newNumber1, newNumber2]);
    }

    // Update scale domains
    xScale.domain([0, d3.max(dataset, function(d) { return d[0]; })]);
    yScale.domain([0, d3.max(dataset, function(d) { return d[1]; })]);

    // Update all circles
    svg.selectAll("circle")
        .data(dataset)
        .transition()
        .duration(1000)
        .each("start", function() {
          d3.select(this)
            .attr("fill", "magenta")
            .attr("r", 3);
        })
        .attr("cx", function(d) { return xScale(d[0]) })
        .attr("cy", function(d) { return yScale(d[1]) })
        .transition()
        .duration(1000)
        .attr("fill", "black")
        .attr("r", 2);

    // Update x-axis
    svg.select(".x.axis")
        .transition()
        .duration(1000)
        .call(xAxis);

    // Update y-axis
    svg.select(".y.axis")
        .transition()
        .duration(1000)
        .call(yAxis);
  });
