
function reqListener () {
  schemeCategory20 = [
      "#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c",
      "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5",
      "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f",
      "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"
  ];
  var data = this.response;
  var species = d3.map(data, function(d){ return d.english_name; }).keys();

  var  colorRange = d3.scalePoint()
      .range([0, 1])
      // .domain(d3.map(data, function(d){ return d.english_name; }).keys())
      .domain(species);

  var color = d3.scaleOrdinal()
      .range(schemeCategory20)
      // .domain(d3.map(data, function(d){ return d.english_name; }).keys());
      .domain(species);

    d3.edge = {};
    d3.edge.reuselegend = function module() {
        function exports(_selection) {
            _selection.each(function (_data) {
                d3.select(this)
                    .selectAll(".legend").data(_data)
                    .enter().append('div')
                    .attr("class", "legend")
                    .html(function (d, i) {
                        // return d.toUpperCase()
                        return d
                    })
                    .style("color","#737373")
                    // .style("color", function (d, i) { return color(d) })
                    .html(function (d, i) {
                        // return d.toUpperCase()
                        return d
                    })
                    // .append("span")
                    .insert("span")
                    .attr("class", "key-dot")
                    .style("background-color", function (d, i) {
                        return color(d);
                    })
            })
        }
        return exports;
    };
  // var color = d3.scaleOrdinal()
  //     .range(d3.schemeSpectral)
  //     .domain(d3.map(data, function(d){ return colorRange(d.english_name); }).keys());

  var opacity = d3.scaleTime()
    .range([0.1, 1])
    // .domain(d3.extent(d3.map(data, function(d){return Date(d.date_time);}).values()))
    .domain(d3.extent(data, function(d){ return new Date(d.date_time); }));

  var ctn = d3.select(".map");

  var svg = ctn.append("svg")
      .attr("width", 800)
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
      .attr("fill", function (d, i) { return color(d.english_name) });
      // .attr("fill", function (d, i) { console.log(d.english_name); return d3.interpolateSpectral(colorRange(d.english_name)) })
      // .style("fill-opacity", function (d, i) { return opacity(new Date(d.date_time)); })

    var legend = d3.edge.reuselegend();

    d3.select(".legends").datum(species).call(legend);

    // var legend = g.append("g")
    //     .classed("legend", true);

    // legend.selectAll("rect")
    //     .data(species)
    //     .enter().append("rect")
    //     .attr('x', 550)
    //     .attr('y', function (d, i) { return i * 20 })
    //     .attr('width', 10)
    //     .attr('height', 10)
    //     .style('fill', function (d, i) { return color(d) });
    //
    // legend.selectAll("text")
    //     .data(species)
    //     .enter().append("text")
    //     .attr('x', 550)
    //     .attr('y', function (d, i) { return i * 20 + 8 })
    //     .attr("dx", "1.5em")
    //     .attr("font-size", "11px")
    //     .attr("fill", "#737373")
    //     .text(function (d) { return d });
}

var oReq = new XMLHttpRequest();
oReq.addEventListener("load", reqListener);
oReq.open("GET", "http://localhost:8000/mc1/api/all-birds");
oReq.responseType = "json";
oReq.send();