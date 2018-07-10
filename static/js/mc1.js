
function reqListener () {
  schemeCategory20 = [
      "#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c",
      "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5",
      "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f",
      "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"
  ];

  var formatDateIntoYear = d3.timeFormat("%Y");
  var formatDate = d3.timeFormat("%b %Y");
  var formatDateMonth = d3.timeFormat("%m/%Y");

  var formatSpecieName = function (str) {
      return str.split(' ').join('-');
  };

  var dataset = this.response;

  var species = d3.map(dataset, function(d){ return formatSpecieName(d.english_name); }).keys();

  var callTypes = d3.map(dataset, function(d){ return d.vocalization_type; }).keys();

  var symbols = d3.scalePoint()
      .range([0, 6])
      .domain(callTypes);

  var  colorRange = d3.scalePoint()
      .range([0, 1])
      // .domain(d3.map(data, function(d){ return d.english_name; }).keys())
      .domain(species);

  var color = d3.scaleOrdinal()
      .range(schemeCategory20)
      // .domain(d3.map(data, function(d){ return d.english_name; }).keys());
      .domain(species);

    d3.edge2 = {};
    d3.edge2.reuselegend = function module() {
        function exports(_selection) {
            _selection.each(function (_data) {
                d3.select(this)
                    .selectAll(".legend").data(_data)
                    .enter().append('div')
                    .attr("class", "legend")
                    .style("color","#737373")
                    .html(function (d, i) {
                        var input = `<input type="checkbox" id=${formatSpecieName(d)} class="speciesCheckbox" value=${formatSpecieName(d)} checked />`
                        var label = `<label for="${d}"><span class="key-dot" style="background-color:${color(d)}"></span>${d}</label>`;
                        return input + label;
                    });
            })
        }
        return exports;
    };

  d3.edge = {};
  d3.edge.reuselegend = function module() {
      function exports(_selection) {
          _selection.each(function (_data) {
              d3.select(this)
                  .selectAll(".legend").data(_data)
                  .enter().append('div')
                  .attr("class", "legend")
                  .style("color","#737373")
                  .html(function (d, i) {
                      var span = `<span class="key-dot" style="background-color:${color(d)}"></span>`;
                      return span + " " + d;
                  });
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
    .domain(d3.extent(dataset, function(d){ return new Date(d.date_time); }));

  var ctn = d3.select(".map");

  var svg = ctn.append("svg")
      .attr("width", 800)
      .attr("height", 600);

  var g = svg.append("g");

  g.append("image")
      .attr("href", "http://localhost:8001/static/img/mc1-lekagul-roadways-2018.bmp")
      .attr("width", 500)
      .attr("height", 500);

  var circlesPlot = g.append("g")
      .classed("dots-ctn", true);

  var kasios = circlesPlot.selectAll(".kasios")
      .data([{x:148, y:40}]);

  kasios.enter()
      .append("path")
      .classed("kasios", true)
      .attr('d', d3.symbol().type(d3.symbolStar))
      .attr("fill", "#05472a")
      .attr("transform", function(d) { return "translate(" + (d.x * 2.5) + "," + (d.y * 2.5) + ")"; })

  kasios.enter()
      .append("text")
      .attr("transform", function(d) { return "translate(" + (d.x * 2.5) + "," + (d.y * 2.5) + ")"; })
      .attr("dy", "-0.8em")
      .text("Kasios waste");

    var legend = d3.edge2.reuselegend();

    var margin = {right: 50, left: 50};
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height");

    var [startDate, endDate] = d3.extent(dataset, function(d){ return new Date(d.date_time); });

    var x = d3.scaleTime()
        .range([0, 400])
        .domain([startDate, endDate])
        .clamp(true);

    var slider = svg.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + margin.left + "," + (height-50) + ")");

    slider.append("line")
        .attr("class", "track")
        .attr("x1", x.range()[0])
        .attr("x2", x.range()[1])
      .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-inset")
      .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-overlay")
        .call(d3.drag()
            .on("start.interrupt", function() { slider.interrupt(); })
            .on("start drag", function() { update(x.invert(d3.event.x)); }));

    slider.insert("g", ".track-overlay")
        .attr("class", "ticks")
        .attr("transform", "translate(0," + 18 + ")")
      .selectAll("text")
      .data(x.ticks(10))
      .enter().append("text")
        .attr("x", x)
        .attr("text-anchor", "middle")
        .text(function(d) { return formatDateIntoYear(d); });

    var handle = slider.insert("circle", ".track-overlay")
        .attr("class", "handle")
        .attr("r", 9);

    var label = slider.append("text")
    .attr("class", "label")
    .attr("text-anchor", "middle")
    .text(formatDate(startDate))
    .attr("transform", "translate(0," + (-25) + ")");



    var legends = d3.select(".legends");
    var cc = d3.select("#cc");
    cc.on("click", function (o) {
        checkAll(this);
        updateCheckbox();
    });

    legends.datum(species).call(legend);

    d3.selectAll(".speciesCheckbox").on("change", updateCheckbox);

    drawData(dataset);
    updateCheckbox();


    var testReq = new XMLHttpRequest();
    testReq.addEventListener("load", function () {
        var testData = this.response;

        var testBirds = circlesPlot.selectAll(".testbirds")
            .data(testData, function(d) { return d ? d.id : this.id;});

        testBirds.enter()
            .append("path")
            .classed("testbirds", true)
            .attr('d', d3.symbol().type(d3.symbolCross).size(50))
            .attr("fill", function (d, i) { return color(formatSpecieName("rose-crested-blue-pipit"))})
            .attr("transform", function(d) { return "translate(" + (d.x * 2.5) + "," + (d.y * 2.5) + ")"; });
    });
    testReq.open("GET", "http://localhost:8001/mc1/api/test-birds");
    testReq.setRequestHeader('Access-Control-Allow-Origin','*');
    testReq.responseType = "json";
    testReq.send();

    function drawData(data) {
        var circles = circlesPlot.selectAll(".circles")
            .data(data, function(d) { return d ? d.file_id : this.id;});

        // circles.enter()
        //     .append("circle")
        //     .classed("circles", true)
        //     .attr('cx', function (d, i) { return d.x * 2.5 })
        //     .attr('cy', function (d, i) { return d.y * 2.5 })
        //     .attr("fill", function (d, i) { return color(formatSpecieName(d.english_name))})
        //     .attr("r", 2.5)
        //     .transition()
        //     .duration(400)
        //     .attr("r", 5)
        //     .transition()
        //     .attr("r", 2.5);

        circles.enter()
            .append("path")
            .classed("circles", true)
            .attr("d", function (d) {
                return d3.symbol().type(d3.symbols[symbols(d.vocalization_type)]).size(30)();
            })
            .attr("fill", function (d, i) { return color(formatSpecieName(d.english_name))})
            .attr("transform", function(d) { return "translate(" + (d.x * 2.5) + "," + (d.y * 2.5) + ")"; })
            .transition()
            .duration(400)
            .attr("d", function (d) {
                return d3.symbol().type(d3.symbols[symbols(d.vocalization_type)]).size(100)();
            })
            .transition()
            .attr("d", function (d) {
                return d3.symbol().type(d3.symbols[symbols(d.vocalization_type)]).size(30)();
            });

        circles.exit()
            .remove();
    }

    function update(h) {
        // update position and text of label according to slider scale
        handle.attr("cx", x(h));
        label
            .attr("x", x(h))
            .text(formatDate(h));
        var monthStart = new Date(h.getFullYear(), h.getMonth(), 1);
        var monthEnd = new Date(h.getFullYear(), h.getMonth()+1, 1);

        var yearStart = new Date(h.getFullYear(), 0, 1);
        var yearEnd = new Date(h.getFullYear()+1, 0, 1);

        var choices = [];
        d3.selectAll(".speciesCheckbox").each(function(d){
            cb = d3.select(this);
            if(cb.property("checked")){
                choices.push(cb.property("value"));
            }
        });
        // filter data set and redraw plot
        var newData = dataset.filter(function(d) {
            var dataDate = new Date(d.date_time);
            // return dataDate >= monthStart & dataDate < monthEnd;
            // return dataDate >= yearStart & dataDate < yearEnd;
            return dataDate >= yearStart & dataDate < yearEnd & choices.includes(formatSpecieName(d.english_name));
        });
        drawData(newData);
    }

    function updateCheckbox() {
        var choices = [];
        d3.selectAll(".speciesCheckbox").each(function(d){
            cb = d3.select(this);
            if(cb.property("checked")){
                choices.push(cb.property("value"));
            }
        });

        var h = x.invert(handle.attr("cx"));
        var monthStart = new Date(h.getFullYear(), h.getMonth(), 1);
        var monthEnd = new Date(h.getFullYear(), h.getMonth()+1, 1);

        var yearStart = new Date(h.getFullYear(), 0, 1);
        var yearEnd = new Date(h.getFullYear()+1, 0, 1);

        var newData = dataset.filter(function(d) {
            var dataDate = new Date(d.date_time);
            return dataDate >= yearStart & dataDate < yearEnd & choices.includes(formatSpecieName(d.english_name));
            // return choices.includes(formatSpecieName(d.english_name));
        });
        drawData(newData);
    }

}

var oReq = new XMLHttpRequest();
oReq.addEventListener("load", reqListener);
oReq.open("GET", "http://localhost:8001/mc1/api/all-birds");
oReq.setRequestHeader('Access-Control-Allow-Origin','*');
oReq.responseType = "json";
oReq.send();

function checkAll(o) {
  var boxes = document.getElementsByTagName("input");
  for (var x = 0; x < boxes.length; x++) {
    var obj = boxes[x];
    if (obj.type === "checkbox") {
      if (obj.name !== "check")
        obj.checked = o.checked;
    }
  }
}