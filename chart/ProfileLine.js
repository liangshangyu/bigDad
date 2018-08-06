import * as d3 from 'd3'
import BaseChart from './BaseChart'

export default class ProfileLine extends BaseChart {
  constructor (el, data) {
    super(el, data)
    this.op = {
      width: el.clientWidth,
      height: el.clientHeight,
      point: {
        r: 4
      },
      margin: {
        top: 70,
        left: 20,
        right: 20,
        bottom: 40
      },
      color: ['#77c6e2', '#ac9ed5', '#d1ecf3']
    }
  }

  draw (option) {
    if (!this.data || this.data.length === 0) return
    let op = this.op = Object.assign(this.op, option)
    let el = this.el,
      data = this.data
    let margin = op.margin,
      w = op.width,
      h = op.height,
      point = op.point,
      color = op.color,
      legends = op.legends,
      keys = op.keys,
      units = op.units,
      xKey = op.x
    let totalKey = keys[0],
      coverKey = keys[1],
      totalUnit = units[0],
      coverUnit = units[1],
      totalLegend = legends[0],
      coverLegend = legends[1]

    let x = d3.scalePoint().domain(data.map(i => i[xKey])).range([0, w - margin.left - margin.right]).padding(0.2)
    let coversY = d3.scaleLinear().domain([0, d3.max(data.map(i => +i[coverKey]))]).range([h - margin.top - margin.bottom, 0])
    let totalsY = d3.scaleLinear().domain([0, d3.max(data.map(i => +i[totalKey]))]).range([h - margin.top - margin.bottom, 0])
    let xAxis = d3.axisBottom(x).tickSizeInner(0).tickPadding(6)
    let coversYAxis = d3.axisRight(coversY).ticks(5).tickSizeInner(0)
    let totalsYAxis = d3.axisLeft(totalsY).ticks(5).tickSizeInner(0)
    let svg = d3.select(el).append('svg').attr('width', w).attr('height', h)
    let g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)
    let tooltip = d3.select(el).append('div').classed('tooltip', true).style('opacity', 0)

// lines
    let coverLine = d3.line().x(d => x(d[xKey])).y(d => coversY(d[coverKey]))
    let totalLine = d3.line().x(d => x(d[xKey])).y(d => totalsY(d[totalKey]))
    var totalArea = d3.area().x(d => x(d[xKey]))
      .y0(h - margin.top - margin.bottom).y1(d => totalsY(d[totalKey]))

    let areaPath = g.append('path')
      .datum(data)
      .attr('fill', color[2])
      .attr('d', totalArea)
    let totalPath = g.append('path')
      .attr('d', totalLine(data))
      .attr('fill', 'none')
      .attr('stroke', color[0])
      .attr('stroke-width', 2)
    let coverPath = g.append('path')
      .attr('d', coverLine(data))
      .attr('fill', 'none')
      .attr('stroke', color[1])
      .attr('stroke-width', 2)

// points
    let totalsbgs = g.selectAll('.total-bg').data(data).enter().append('circle')
      .classed('total-bg', true)
      .attr('cy', d => totalsY(d[totalKey]))
      .attr('cx', d => x(d[xKey]))
      .attr('r', point.r + 4)
      .attr('fill', '#fff')
    let totals = g.selectAll('total').data(data).enter().append('circle')
      .classed('total', true)
      .attr('cy', d => totalsY(d[totalKey]))
      .attr('cx', d => x(d[xKey]))
      .attr('r', point.r)
      .attr('stroke', color[0]).attr('stroke-width', '2')
      .attr('fill', '#fff')
    let coverbgs = g.selectAll('.cover-bg').data(data).enter().append('circle')
      .classed('cover-bg', true)
      .attr('cy', d => coversY(d[coverKey]))
      .attr('cx', d => x(d[xKey]))
      .attr('r', point.r + 4)
      .attr('fill', '#fff')
    let covers = g.selectAll('.cover').data(data).enter().append('circle')
      .classed('cover', true)
      .attr('cy', d => coversY(d[coverKey]))
      .attr('cx', d => x(d[xKey]))
      .attr('r', point.r)
      .attr('stroke', color[1]).attr('stroke-width', '2')
      .attr('fill', '#fff')

    // hoverLine
    let hoverLineGroup = g.append('g').attr('class', 'hover-line')
    let hoverLineY = hoverLineGroup.append('svg:line')
      .attr('x1', 10).attr('x2', 10) // vertical line so same value on each
      .attr('y1', 0).attr('y2', h - margin.top - margin.bottom).attr('stroke', '#999').classed('hidden', true) // top to bottom
    let hoverLineX = hoverLineGroup.append('svg:line')
      .attr('x1', 0).attr('y1', 10)
      .attr('x2', w - margin.left - margin.right).attr('y2', 10).attr('stroke', '#999').classed('hidden', true)
      .attr('stroke-dasharray', '4, 4')
    svg.on('mousemove', () => {
      let _x = d3.mouse(this.el)[0],
        _y = d3.mouse(this.el)[1]
      // 判断是否超出边界
      if (_x < margin.left + 30 ||
         _x > w - margin.right - 30 ||
         _y < margin.top ||
         _y > h - margin.bottom) {
        hoverLineY.classed('hidden', true)
        hoverLineX.classed('hidden', true)
        tooltip.style('opacity', 0)
      } else {
        hoverLineY.classed('hidden', false)
        hoverLineX.classed('hidden', false)
        tooltip.style('opacity', 1)
      }

      // hoverLineY
      let done = false
      covers.each(function (d, i) {
        let cx = this.getBBox().x
        if (cx < _x - margin.left - x.step() / 2 || done) return
        hoverLineY.attr('x1', cx + 4).attr('x2', cx + 4)
        // tooltip
        tooltip.html(`
          <span>${d[xKey]}</span>
          <span class='tooltip-legend'>${colorSpan(color[0])}<span class='tooltip-text'>${legends[0]}：${d[keys[0]]}（${data[0][units[0]]}）</span></span>
          <span class='tooltip-legend'>${colorSpan(color[1])}<span class='tooltip-text'>${legends[1]}：${d[keys[1]]}（${data[0][units[1]]}）</span></span>
        `)
        // 最后两个偏左
        if (i >= data.length - 2) {
          tooltip.style('top', _y + 20 + 'px')
            .style('left', _x - tooltip.clientWidth - 20 + 'px')
        } else {
          tooltip.style('top', _y + 20 + 'px').style('left', _x + 20 + 'px')
        }

        done = true
      })
      // hoverLineX
      hoverLineX.attr('y1', _y - margin.top).attr('y2', _y - margin.top)
    })
    svg.on('mouseleave', function () {
      hoverLineY.classed('hidden', true)
      hoverLineX.classed('hidden', true)
      tooltip.style('opacity', 0)
    })

// axis
    svg
      .append('g')
      .classed('axis xAxis', true)
      .call(xAxis)
      .attr('transform', `translate(${margin.left}, ${h - margin.bottom + 10})`)
    svg
      .append('g')
      .classed('axis yAxis cover', true)
      .call(coversYAxis)
      .attr('transform', `translate(${w - margin.right - 13}, ${margin.top})`)
    svg
      .append('g')
      .classed('axis yAxis total', true)
      .call(totalsYAxis)
      .attr('transform', `translate(${margin.left + 10}, ${margin.top})`)
    svg
      .append('text').text(`(${data[0][totalUnit]})`)
      .attr('transform', `translate(${margin.left + 13}, ${margin.top - 10})`)
      .attr('text-anchor', 'end').attr('font-size', '12px')
      .classed('unit total', true)
    svg
      .append('text').text(`(${data[0][coverUnit]})`)
      .attr('transform', `translate(${w - margin.right - 13}, ${margin.top - 10})`)
      .attr('text-anchor', 'start').attr('font-size', '12px')
      .classed('unit cover', true)

    // legend
    let _legends = svg.selectAll('.legend').data(legends).enter().append('g').classed('legend', true)
    _legends.append('text').text(d => d).attr('font-size', '12px')
      .attr('y', margin.top - 46).attr('x', (d, i) => margin.left + i * 100 + 32)
    _legends.append('line')
      .attr('x1', (d, i) => margin.left + i * 100).attr('y1', margin.top - 46 - 3)
      .attr('x2', (d, i) => margin.left + i * 100 + 20).attr('y2', margin.top - 46 - 3)
      .attr('stroke', (d, i) => color[i])

    this.resize = () => {
      w = el.clientWidth
      // h = el.clientWidth
      x.range([0, w - margin.left - margin.right])
      // coversY.range([h - margin.top - margin.bottom, 0])
      // totalsY.range([h - margin.top - margin.bottom, 0])
      svg.transition().attr('width', w).attr('height', h)
      coverbgs.transition().attr('cy', d => coversY(d[coverKey]))
        .attr('cx', d => x(d[xKey]))
      covers.transition().attr('cy', d => coversY(d[coverKey]))
        .attr('cx', d => x(d[xKey]))
      totalsbgs.transition().attr('cy', d => totalsY(d[totalKey]))
        .attr('cx', d => x(d[xKey]))
      totals.transition().attr('cy', d => totalsY(d[totalKey]))
        .attr('cx', d => x(d[xKey]))

      coverLine.x(d => x(d[xKey])).y(d => coversY(d[coverKey]))
      totalLine.x(d => x(d[xKey])).y(d => totalsY(d[coverKey]))
      totalArea.x(d => x(d[xKey]))
        .y0(h - margin.top - margin.bottom).y1(d => totalsY(d[totalKey]))

      coverPath.transition().attr('d', coverLine(data))
      totalPath.transition().attr('d', totalLine(data))
      areaPath.transition().attr('d', totalArea)

      svg.select('.axis.xAxis').transition().call(xAxis).attr('transform', `translate(${margin.left}, ${h - margin.bottom + 10})`)
      // w - margin.right - 12: 如果不减去12px和右面的图会有重叠
      svg.select('.axis.cover').transition().call(coversYAxis).attr('transform', `translate(${w - margin.right - 12}, ${margin.top})`)
      svg.select('.unit.cover').transition()
        .attr('transform', `translate(${w - margin.right - 12}, ${margin.top - 10})`)
        .attr('text-anchor', 'start').attr('font-size', '12px')
    }
  }
}

function colorSpan (color) {
  return '<span class="dot" style="position: absolute;display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + color + '"></span>'
}
