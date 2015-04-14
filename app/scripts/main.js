// http://examples.oreilly.com/0636920026938/

var data;

var dataset = [
[ 5, 20 ],
[ 480, 90 ],
[ 250, 50 ],
[ 100, 33 ],
[ 330, 95 ],
[ 410, 12 ],
[ 475, 44 ],
[ 25, 67 ],
[ 85, 21 ],
[ 220, 88 ],
[ 600, 150]
];
scatterPlot(dataset);

d3.json("../data/data.json", function(error, json) {
  data = json;
  if (error) {
    console.log("error");
  } else {
    console.log(data);
    generateDiv(data);
    generateSvg(data);
    generateSvgBarChart(data);
  }
});

function generateDiv(data) {
  d3.select("#graph").selectAll("div")
  .data(data.games)
  .enter()
  .append("div")
  .style("width", function(d) {
    var barWidth = d.hours * 2;
    return barWidth + "px";
  });
  console.log("called");
}

function generateSvg(data) {
  var w = 500;
  var h = 50;
  var svg = d3.select("body")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

  var circles = svg.selectAll("circle")
                .data(data.games)
                .enter()
                .append("circle");
  circles.attr("cx", function(d, i) {
            return (i * 50) + 25;
          })
          .attr("cy", h/2)
          .attr("r", function(d) {
            return d.joy;
          })
          .attr("fill", "red");
}

function generateSvgBarChart(data) {
  var w = 600;
  var h = 300;
  var barPadding = 1;

  // SVG
  var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

  // Bars
  svg.selectAll("rect")
      .data(data.games)
      .enter()
      .append("rect")
      .attr("x", function(d, i) {
        return i * (w / data.games.length);
      })
      .attr("y", function(d) {
        return h - (d.joy * 4); // height - data value * 4 to scale
      })
      .attr("width", w / data.games.length - barPadding)
      .attr("height", function(d) {
        return d.joy * 4;
      })
      .attr("fill", function(d) {
        return "rgb(0, 0, " + (d.joy*10) + ")"
      });

  // Labels
  svg.selectAll("text")
      .data(data.games)
      .enter()
      .append("text")
      .text(function(d) {
        return d.joy;
      })
      .attr("x", function(d, i) {
        return i * (w / data.games.length) + (w / data.games.length - barPadding) / 2;
      })
      .attr("y", function(d) {
        return h - (d.joy * 4) + 20;
      })
      .attr("fill", "#fff")
      .attr("font-size", "18px")
      .attr("text-anchor", "middle");
}

function scatterPlot(dataset) {

  var w = 600;
  var h = 300;
  var padding = 30;
  var formatAsPercentage = d3.format(".1%");

  var svg = d3.select("body")
              .append("svg")
              .attr("width", w)
              .attr("height", h);

  var xScale = d3.scale.linear()
                        .domain([0, d3.max(dataset, function(d) {return d[0]; })])
                        .range([padding, w - padding*2]);

  var yScale = d3.scale.linear()
                        .domain([0, d3.max(dataset, function(d) {return d[1]; })])
                        .range([h - padding, padding]);

  var rScale = d3.scale.linear()
                        .domain([0, d3.max(dataset, function(d) {return d[1]})])
                        .range([2, 5]);

  var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .ticks(5) // Set number of ticks
                    .tickFormat(formatAsPercentage);

  var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left")
                    .ticks(5);

  svg.selectAll("circle")
      .data(dataset)
      .enter()
      .append("circle")
      .attr("cx", function(d) {
        // When each single datum (d) is itself an array of values, you need to use bracket notation to access its values.
        return xScale(d[0]);
      })
      .attr("cy", function(d) {
        return yScale(d[1]);
      })
      .attr("r", function(d) {
        return rScale(d[1]);
      });

  // svg.selectAll("text")
  //     .data(dataset)
  //     .enter()
  //     .append("text")
  //     .text(function(d) {
  //       return d[0] + "," + d[1];
  //     })
  //     .attr("x", function(d) {
  //       return xScale(d[0]);
  //     })
  //     .attr("y", function(d) {
  //       return yScale(d[1]);
  //     })
  //     .attr("font-family", "sans-serif")
  //     .attr("font-size", "10px")
  //     .attr("fill", "red");

  svg.append("g")
      .attr("class", "axis") // Assign axis class
      .attr("transform", "translate(0," + (h - padding) + ")") // Move axis to bottom
      .call(xAxis);

  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + padding + ", 0)")
      .call(yAxis);
}
