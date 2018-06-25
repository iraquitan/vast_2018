function reqListener () {
  var data = this.response;

  var color = d3.scaleOrdinal()
      .range(d3.schemeCategory10)
      .domain(d3.map(data, function(d){ return d.english_name; }).keys());

  var opacity = d3.scaleTime()
    .range([0.1, 1])
    // .domain(d3.extent(d3.map(data, function(d){return Date(d.date_time);}).values()))
    .domain(d3.extent(data, function(d){ return new Date(d.date_time); }));

  var ctn = d3.select(".container");

  var svg = ctn.append("svg")
      .attr("width", 500)
      .attr("height", 500);

  var g = svg.append("g");

  g.append("image")
      .attr("href", "http://localhost:8000/static/img/mc1-lekagul-roadways-2018.bmp")
      .attr("width", 500)
      .attr("height", 500);

  var circles = g.append("g")
      .classed("dots-ctn", true);


  circles.selectAll("circles")
      .classed("circles", true)
      .data(data)
      .enter().append("circle")
      .attr('r', 2.5)
      .attr('cx', function (d, i) { return d.x * 2.5 })
      .attr('cy', function (d, i) { return d.y * 2.5 })
      .attr("fill", function (d, i) { return color(d.english_name) })
      .style("fill-opacity", function (d, i) { return opacity(new Date(d.date_time)); })
}

var oReq = new XMLHttpRequest();
oReq.addEventListener("load", reqListener);
oReq.open("GET", "http://localhost:8000/mc1/api/all-birds");
oReq.responseType = "json";
oReq.send();