var data;

d3.json("../data/data.json", function(error, json) {
  data = json;
  if (error) {
    console.log("error");
  } else {
    console.log(data);
    generateDiv(data);
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
