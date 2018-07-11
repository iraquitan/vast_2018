import * as d3 from 'd3';
import './starter-template.css';
import './mc1.css';

function reqListener () {
  var schemeCategory20 = [
    '#d62728', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c',
    '#98df8a', '#1f77b4', '#ff9896', '#9467bd', '#c5b0d5',
    '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f',
    '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'
  ]

  var formatDateIntoYear = d3.timeFormat('%Y')
  var formatDate = d3.timeFormat('%b %Y')
  var formatDateMonth = d3.timeFormat('%m/%Y')

  var mapSize = 500;

  var formatSpecieName = function (str) {
    return str.split(' ').join('-')
  }

  var fmtVocalType = function (vt) {
    return formatSpecieName(String(vt)).split(',').join('')
  }

  var dataset = this.response

  var species = d3.map(dataset, function (d) {
    return formatSpecieName(d.english_name)
  }).keys()

  var callTypes = d3.map(dataset, function (d) {
    return fmtVocalType(d.vocalization_type)
  }).keys()

  var symbols = d3.scalePoint()
    .range([0, 6])
    .domain(callTypes)

  var color = d3.scaleOrdinal()
    .range(schemeCategory20)
    .domain(species)

  var scaleX = d3.scaleLinear()
    .range([0, mapSize])
    .domain([0, 199])

  var scaleY = d3.scaleLinear()
    .range([mapSize, 0])
    .domain([0, 199])

  function template (strings, ...keys) {
    return (function (...values) {
      var dict = values[values.length - 1] || {}
      var result = [strings[0]]
      keys.forEach(function (key, i) {
        var value = Number.isInteger(key) ? values[key] : dict[key]
        result.push(value, strings[i + 1])
      })
      return result.join('')
    })
  }

  var htmlTemplate = template`<input type="checkbox" id=${'d1'} class="species-cb" value=${'d1'} checked />
<label for="${'d2'}"><span class="key-dot" style="background-color:${'d3'}"></span>${'d2'}</label>`

  var htmlTemplate2 = template`<input type="checkbox" id=${'d1'} class="call-cb" value=${'d1'} checked />
<label for="${'d2'}"><span class="key-dot">${'d3'}</span>${'d2'}</label>`

  function reusableLegend (_selection, _class, _html, _htmlKeys) {
    _selection.each(function (_data) {
      d3.select(this)
        .selectAll(`.${_class}`).data(_data)
        .enter().append('div')
        .classed(_class, true)
        .classed('legend', true)
        .html(function (d) {
          return _html(_htmlKeys(d))
        })
    })
  }

  var opacity = d3.scaleTime()
    .range([0.1, 1])
    .domain(d3.extent(dataset, function (d) {
      return new Date(d.date_time)
    }))

  var ctn = d3.select('.map')

  var svg = ctn.append('svg')
    .attr('width', mapSize)
    .attr('height', mapSize + 100)

  var g = svg.append('g')

  g.append('image')
    .attr('href', 'http://localhost:8001/static/img/mc1-lekagul-roadways-2018.bmp')
    .attr('width', mapSize)
    .attr('height', mapSize)

  var circlesPlot = g.append('g')
    .classed('dots-ctn', true)

  var kasios = circlesPlot.selectAll('.kasios')
    .data([
      {x: 148, y: 159, label: 'Kasios waste'},
      {x: 90, y: 21, label: 'Kasios'}
    ])

  kasios.enter()
    .append('path')
    .classed('kasios', true)
    .attr('d', d3.symbol().type(d3.symbolStar))
    .attr('fill', '#05472a')
    .attr('transform', function (d) {
      return 'translate(' + scaleX(d.x) + ',' + scaleY(d.y) + ')'
    })

  kasios.enter()
    .append('text')
    .attr('transform', function (d) {
      return 'translate(' + scaleX(d.x) + ',' + scaleY(d.y) + ')'
    })
    .attr('dy', '-0.8em')
    .text(function (d) {
      return d.label
    })

  var margin = {right: 50, left: 50}
  var width = +svg.attr('width') - margin.left - margin.right
  var height = +svg.attr('height')

  var [startDate, endDate] = d3.extent(dataset, function (d) {
    return new Date(d.date_time)
  })

  var x = d3.scaleTime()
    .range([0, mapSize - 100])
    .domain([startDate, endDate])
    .clamp(true)

  var slider = svg.append('g')
    .attr('class', 'slider')
    .attr('transform', 'translate(' + margin.left + ',' + (height - 50) + ')')

  slider.append('line')
    .attr('class', 'track')
    .attr('x1', x.range()[0])
    .attr('x2', x.range()[1])
    .select(function () {
      return this.parentNode.appendChild(this.cloneNode(true))
    })
    .attr('class', 'track-inset')
    .select(function () {
      return this.parentNode.appendChild(this.cloneNode(true))
    })
    .attr('class', 'track-overlay')
    .call(d3.drag()
      .on('start.interrupt', function () {
        slider.interrupt()
      })
      .on('start drag', function () {
        update(x.invert(d3.event.x))
      }))

  slider.insert('g', '.track-overlay')
    .attr('class', 'ticks')
    .attr('transform', 'translate(0,' + 18 + ')')
    .selectAll('text')
    .data(x.ticks(10))
    .enter().append('text')
    .attr('x', x)
    .attr('text-anchor', 'middle')
    .text(function (d) {
      return formatDateIntoYear(d)
    })

  var handle = slider.insert('circle', '.track-overlay')
    .attr('class', 'handle')
    .attr('r', 9)

  var label = slider.append('text')
    .attr('class', 'label')
    .attr('text-anchor', 'middle')
    .text(formatDate(startDate))
    .attr('transform', 'translate(0,' + (-25) + ')')

  /////////////
  // Legends //
  /////////////
  var legendSpecies = d3.select('#legend-species')
  var cc = d3.select('#cc')
  cc.on('click', function (o) {
    checkAll(this, 'species-cb')
    updateCheckbox()
  })

  legendSpecies.datum(species).call(reusableLegend, 'legend-spc', htmlTemplate, function (d) {
    return {d1: formatSpecieName(d), d2: d, d3: color(d)}
  })

  var legendVt = d3.select('#legend-vt')
  var vtcc = d3.select('#vt-cc')
  vtcc.on('click', function (o) {
    checkAll(this, 'call-cb')
    updateCheckbox()
  })
  legendVt.datum(callTypes).call(reusableLegend, 'legend-vt', htmlTemplate2, function (d) {
    return {
      d1: formatSpecieName(d), d2: d, d3: function () {
        var tt = d3.create('div')
        var symbolLg = tt.append('svg').attr('width', '10px').attr('height', '10px')
        symbolLg.append('path')
          .attr('d', d3.symbol().type(d3.symbols[symbols(d)]).size(30))
          .attr('fill', '#737373')
          .attr('transform', 'translate(5, 5)')
        return tt.html()
      }()
    }
  })

  d3.selectAll('.species-cb').on('change', updateCheckbox)
  d3.selectAll('.call-cb').on('change', updateCheckbox)

  drawData(dataset)
  updateCheckbox()

  var testReq = new XMLHttpRequest()
  testReq.addEventListener('load', function () {
    var testData = this.response

    var testBirds = circlesPlot.selectAll('.testbirds')
      .data(testData, function (d) {
        return d ? d.id : this.id
      })

    testBirds.enter()
      .append('text')
      .attr('x', function (d) {
        return scaleX(d.x)
      })
      .attr('y', function (d) {
        return scaleY(d.y)
      })
      .attr('fill', color(formatSpecieName('rose-crested-blue-pipit')))
      .style('font-weight', 'bold')
      .text('K')
    // .append("path")
    // .classed("testbirds", true)
    // .attr('d', d3.symbol().type(d3.symbolWye).size(50))
    // .attr("fill", function (d, i) { return color(formatSpecieName("rose-crested-blue-pipit"))})
    // .attr("transform", function(d) { return "translate(" + scaleX(d.x) + "," + scaleY(d.y) + ")"; });
  })
  testReq.open('GET', 'http://localhost:8001/mc1/api/test-birds')
  testReq.setRequestHeader('Access-Control-Allow-Origin', '*')
  testReq.responseType = 'json'
  testReq.send()

  function drawData (data) {
    var circles = circlesPlot.selectAll('.circles')
      .data(data, function (d) {
        return d ? d.file_id : this.id
      })

    circles.enter()
      .append('path')
      .classed('circles', true)
      .attr('d', function (d) {
        return d3.symbol().type(d3.symbols[symbols(fmtVocalType(d.vocalization_type))]).size(50)()
      })
      .attr('fill', function (d, i) {
        return color(formatSpecieName(d.english_name))
      })
      .attr('transform', function (d) {
        return 'translate(' + scaleX(d.x) + ',' + scaleY(d.y) + ')'
      })
      .transition()
      .duration(400)
      .attr('d', function (d) {
        return d3.symbol().type(d3.symbols[symbols(fmtVocalType(d.vocalization_type))]).size(100)()
      })
      .transition()
      .attr('d', function (d) {
        return d3.symbol().type(d3.symbols[symbols(fmtVocalType(d.vocalization_type))]).size(50)()
      })

    circles.exit()
      .remove()
  }

  function update (h) {
    // update position and text of label according to slider scale
    handle.attr('cx', x(h))
    label
      .attr('x', x(h))
      .text(formatDate(h))
    var monthStart = new Date(h.getFullYear(), h.getMonth(), 1)
    var monthEnd = new Date(h.getFullYear(), h.getMonth() + 1, 1)

    var yearStart = new Date(h.getFullYear(), 0, 1)
    var yearEnd = new Date(h.getFullYear() + 1, 0, 1)

    var sliderTuneOpts = {
      'rb-month': {
        'start': monthStart,
        'end': monthEnd
      },
      'rb-year': {
        'start': yearStart,
        'end': yearEnd
      }
    }

    var sliderTune
    //
    d3.selectAll('.slider-rb-opt').each(function (o) {
      var rb = d3.select(this)
      if (rb.property('checked')) {
        sliderTune = sliderTuneOpts[rb.attr('id')]
      }
    })

    var choicesA = []
    d3.selectAll('.species-cb').each(function (d) {
      var cb = d3.select(this)
      if (cb.property('checked')) {
        choicesA.push(cb.property('value'))
      }
    })

    var choicesB = []
    d3.selectAll('.call-cb').each(function (d) {
      var cb = d3.select(this)
      if (cb.property('checked')) {
        choicesB.push(cb.property('value'))
      }
    })
    // filter data set and redraw plot
    var newData = dataset.filter(function (d) {
      var dataDate = new Date(d.date_time)
      // return dataDate >= monthStart & dataDate < monthEnd;
      // return dataDate >= yearStart & dataDate < yearEnd;
      // return dataDate >= yearStart & dataDate < yearEnd & choices.includes(formatSpecieName(d.english_name)) & choicesB.includes(fmtVocalType(d.vocalization_type))
      return dataDate >= sliderTune['start'] & dataDate < sliderTune['end'] & choicesA.includes(formatSpecieName(d.english_name)) & choicesB.includes(fmtVocalType(d.vocalization_type))
    })
    drawData(newData)
  }

  function updateCheckbox () {
    var choicesA = []
    d3.selectAll('.species-cb').each(function (d) {
      var cb = d3.select(this)
      if (cb.property('checked')) {
        choicesA.push(cb.property('value'))
      }
    })

    var choicesB = []
    d3.selectAll('.call-cb').each(function (d) {
      var cb = d3.select(this)
      if (cb.property('checked')) {
        choicesB.push(cb.property('value'))
      }
    })

    var h = x.invert(handle.attr('cx'))
    var monthStart = new Date(h.getFullYear(), h.getMonth(), 1)
    var monthEnd = new Date(h.getFullYear(), h.getMonth() + 1, 1)

    var yearStart = new Date(h.getFullYear(), 0, 1)
    var yearEnd = new Date(h.getFullYear() + 1, 0, 1)

    var sliderTuneOpts = {
      'rb-month': {
        'start': monthStart,
        'end': monthEnd
      },
      'rb-year': {
        'start': yearStart,
        'end': yearEnd
      }
    }

    var sliderTune
    //
    d3.selectAll('.slider-rb-opt').each(function (o) {
      var rb = d3.select(this)
      if (rb.property('checked')) {
        sliderTune = sliderTuneOpts[rb.attr('id')]
      }
    })

    var newData = dataset.filter(function (d) {
      var dataDate = new Date(d.date_time)
      // return dataDate >= yearStart & dataDate < yearEnd & choicesA.includes(formatSpecieName(d.english_name)) & choicesB.includes(fmtVocalType(d.vocalization_type))
      return dataDate >= sliderTune.start & dataDate < sliderTune.end & choicesA.includes(formatSpecieName(d.english_name)) & choicesB.includes(fmtVocalType(d.vocalization_type))
    })
    drawData(newData)
  }

}

var oReq = new XMLHttpRequest()
oReq.addEventListener('load', reqListener)
oReq.open('GET', 'http://localhost:8001/mc1/api/all-birds')
oReq.setRequestHeader('Access-Control-Allow-Origin', '*')
oReq.responseType = 'json'
oReq.send()

function checkAll (o, _class) {
  // var boxes = document.getElementsByTagName("input");
  var boxes = document.getElementsByClassName(_class)
  for (var x = 0; x < boxes.length; x++) {
    var obj = boxes[x]
    if (obj.type === 'checkbox') {
      if (obj.name !== 'check')
        obj.checked = o.checked
    }
  }
}
