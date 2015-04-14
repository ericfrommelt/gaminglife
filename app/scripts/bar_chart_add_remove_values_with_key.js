var w = 600;
var h = 250;

var dataset = [ { key: 0, value: 5 }, { key: 1, value: 10 }, { key: 2, value: 13 }, { key: 3, value: 19 }, { key: 4, value: 21 }, { key: 5, value: 25 }, { key: 6, value: 22 }, { key: 7, value: 18 }, { key: 8, value: 15 }, { key: 9, value: 13 }, { key: 10, value: 11 }, { key: 11, value: 12 }, { key: 12, value: 15 }, { key: 13, value: 20 }, { key: 14, value: 18 }, { key: 15, value: 17 }, { key: 16, value: 16 }, { key: 17, value: 18 }, { key: 18, value: 23 }, { key: 19, value: 25 } ];

var key = function(d) {
  return d.key;
};

                                                    // https://github.com/mbostock/d3/wiki/Ordinal-Scales
var xScale = d3.scale.ordinal()                     // Create ordinal scale
                .domain(d3.range(dataset.length))   // Set the input domain for the ordinal scale (== to the number of items in our dataset)
                .rangeRoundBands([0, w], 0.05);     // Create bands starting at 0 and ending at w(idth), add space between the bands
                                                    // rangeRoundBands rounds the output values to the nearest whole pixel value

var yScale = d3.scale.linear()
                .domain([0, d3.max(dataset, function(d) {
                  return d.value;
                })])
                .range([0, h]);

// Create svg element
var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

// Create bars
svg.selectAll("rect")
    .data(dataset, key)
    .enter()
    .append("rect")
    .attr("x", function(d, i) {     // d is the current datum and i is its index value,
      return xScale(i);             // i coresponds to the ordinal value i
    })
    .attr("y", function(d) {
      return h - yScale(d.value);
    })
    .attr("width", xScale.rangeBand())
    .attr("height", function(d) {
      return yScale(d.value);
    })
    .attr("fill", function(d) {
      return "rgb(0, 0, " + (d.value * 10) + ")";
    });

// Create labels
svg.selectAll("text")
    .data(dataset, key)
    .enter()
    .append("text")
    .text(function(d) {
      return d.value;
    })
    .attr("text-anchor", "middle")
    .attr("x", function(d, i) {
      return xScale(i) + xScale.rangeBand() / 2;
    })
    .attr("y", function(d, i) {
      return h - yScale(d.value) + 14;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "11px")
    .attr("fill", "white");

// On click, update with new data
d3.select(".add")
  .on("click", function() {

    // Add one new value to the dataset
    var maxValue = 25;
    var newNumber = Math.floor(Math.random() * maxValue);
    var lastKeyValue = dataset[dataset.length - 1].key;
    dataset.push({
      key: lastKeyValue + 1,
      value: newNumber
    })

    // Update scale domains
    xScale.domain(d3.range(dataset.length));  // Recalibrate the x scale domain, given the new length of dataset
    yScale.domain([0, d3.max(dataset, function(d) { return d.value })]);      // Recalibrate the y scale domain, given the new max value in dataset

    // Select...
    var bars = svg.selectAll("rect")          // Select all bars
                  .data(dataset, key);             // Re-bind data to existing bars, return the 'update' selection
                                              // 'bars' is now the update selection

    // Enter...
    bars.enter()                              // References the enter selection (a subset of the 'update' selection)
        .append("rect")                       // Creates a new rect
        .attr("x", w)                         // Sets the initial x position of the rect beyond the right edge of the svg
        .attr("y", function(d) {              // Sets the y value based on the updated y scale
          return h - yScale(d.value);
        })
        .attr("width", xScale.rangeBand())    // Sets the width value based on the updated xScale
        .attr("height", function(d) {         // Sets the height value based on the updated yScale
          return yScale(d.value);
        })
        .attr("fill", function(d) {           // Sets the fill value
          return "rgb(0, 0, " + (d.value * 10) + ")";
        });

    // Update...
    bars.transition()                         // Initiate a transition on all elements in the update selection (all rects)
        .duration(500)
        .attr("x", function(d, i) {           // Set new X position, based on updated xScale
          return xScale(i);
        })
        .attr("y", function(d) {              // Set new Y position, based on the updated yScale
          return h - yScale(d.value);
        })
        .attr("width", xScale.rangeBand())    // Set new width value, based on the updated xScale
        .attr("height", function(d) {
          return yScale(d.value)
        });

    // Select all labels
    var labels = svg.selectAll("text")
                    .data(dataset, key);

    // Enter...
        labels.enter()
        .append("text")
        .text(function(d) {
          return d.value;
        })
        .attr("text-anchor", "middle")
        .attr("x", w)
        .attr("y", function(d) {
          return h - yScale(d.value) + 14;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "white")

    // Update labels...
        labels.transition()
        .duration(500)
        .attr("x", function(d, i) {
          return xScale(i) + xScale.rangeBand() / 2;
        })
        .attr("y", function(d) {
          return h - yScale(d.value) + 14;
        });
  })

// On click, remove an item
d3.select(".remove")
  .on("click", function() {
    // Remove one value from dataset
    dataset.shift();

    // Update scale domains
    xScale.domain(d3.range(dataset.length));  // Recalibrate the x scale domain, given the new length of dataset
    yScale.domain([0, d3.max(dataset, function(d) { return d.value })]);      // Recalibrate the y scale domain, given the new max value in dataset

    // Select...
    var bars = svg.selectAll("rect")          // Select all bars
                  .data(dataset, key);             // Re-bind data to existing bars, return the 'update' selection
                                              // 'bars' is now the update selection

    // Enter...
    bars.enter()                              // References the enter selection (a subset of the 'update' selection)
        .append("rect")                       // Creates a new rect
        .attr("x", w)                         // Sets the initial x position of the rect beyond the right edge of the svg
        .attr("y", function(d) {              // Sets the y value based on the updated y scale
          return h - yScale(d.value);
        })
        .attr("width", xScale.rangeBand())    // Sets the width value based on the updated xScale
        .attr("height", function(d) {         // Sets the height value based on the updated yScale
          return yScale(d.value);
        })
        .attr("fill", function(d) {           // Sets the fill value
          return "rgb(0, 0, " + (d.value * 10) + ")";
        });

    // Update...
    bars.transition()                         // Initiate a transition on all elements in the update selection (all rects)
        .duration(500)
        .attr("x", function(d, i) {           // Set new X position, based on updated xScale
          return xScale(i);
        })
        .attr("y", function(d) {              // Set new Y position, based on the updated yScale
          return h - yScale(d.value);
        })
        .attr("width", xScale.rangeBand())    // Set new width value, based on the updated xScale
        .attr("height", function(d) {
          return yScale(d.value)
        });

    // Exit
    bars.exit()
        .transition()
        .duration(500)
        .attr("x", -xScale.rangeBand())
        .remove();

    // Select all labels
    var labels = svg.selectAll("text")
                    .data(dataset, key);

    // Enter...
        labels.enter()
        .append("text")
        .text(function(d) {
          return d.value;
        })
        .attr("text-anchor", "middle")
        .attr("x", w)
        .attr("y", function(d) {
          return h - yScale(d.value) + 14;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "white")

    // Update labels...
        labels.transition()
        .duration(500)
        .attr("x", function(d, i) {
          return xScale(i) + xScale.rangeBand() / 2;
        })
        .attr("y", function(d) {
          return h - yScale(d.value) + 14;
        });

    labels.exit()
          .transition()
          .duration(500)
          .attr("x", -xScale.rangeBand())
          .remove();
  })
