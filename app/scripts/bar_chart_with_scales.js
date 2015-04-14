var w = 600;
var h = 250;

var dataset = [ 5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
							11, 12, 15, 20, 18, 17, 16, 18, 23, 25 ];
              

                                                    // https://github.com/mbostock/d3/wiki/Ordinal-Scales
var xScale = d3.scale.ordinal()                     // Create ordinal scale
                .domain(d3.range(dataset.length))   // Set the input domain for the ordinal scale (== to the number of items in our dataset)
                .rangeRoundBands([0, w], 0.05);     // Create bands starting at 0 and ending at w(idth), add space between the bands
                                                    // rangeRoundBands rounds the output values to the nearest whole pixel value

var yScale = d3.scale.linear()
                .domain([0, d3.max(dataset)])
                .range([0, h]);

// Create svg element
var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

// Create bars
svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", function(d, i) {     // d is the current datum and i is its index value,
      return xScale(i);             // i coresponds to the ordinal value i
    })
    .attr("y", function(d) {
      return h - yScale(d);
    })
    .attr("width", xScale.rangeBand())
    .attr("height", function(d) {
      return yScale(d);
    })
    .attr("fill", function(d) {
      return "rgb(0, 0, " + (d * 10) + ")";
    });

// Create labels
svg.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .text(function(d) {
      return d;
    })
    .attr("text-anchor", "middle")
    .attr("x", function(d, i) {
      return xScale(i) + xScale.rangeBand() / 2;
    })
    .attr("y", function(d, i) {
      return h - yScale(d) + 14;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "11px")
    .attr("fill", "white");

// Add event listener
d3.select("p")
  .on("click", function() {

    // New values for dataset
    // Count original length of dataset
    var numValues = dataset.length;
    var maxValue = 100;
    // Initialize empty array
    dataset = [];

    for (var i=0; i < numValues; i++) {
      var newNumber = Math.floor(Math.random() * maxValue);
      dataset.push(newNumber);
    }

    // Update scale domain
    // Recalibrate the scale domain, given the new max value in the dataset
    yScale.domain([0, d3.max(dataset)]);

    // Update all rects
    svg.selectAll("rect")
        .data(dataset)
        .transition()
        .delay(function(d, i) {
          return i * 100;
        })
        .duration(1200)
        .attr("y", function(d) {
          return h - yScale(d);
        })
        .attr("height", function(d) {
          return yScale(d);
        })
        .attr("fill", function(d) {
          return "rgb(" + (d * 10) +", 0, 0)";
        });

    // Update labels
    svg.selectAll("text")
        .data(dataset)
        .transition()
        .delay(function(d, i) {
          return i * 100;
        })
        .duration(1000)
        .text(function(d) {
          return d;
        })
        .attr("x", function(d, i) {
          return xScale(i) + xScale.rangeBand() / 2;
        })
        .attr("y", function(d) {
          return h - yScale(d) + 14;
        });
  });
