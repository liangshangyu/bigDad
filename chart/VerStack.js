/**
 * @author hilshire
 */
import * as d3 from 'd3'
import BaseChart from './BaseChart'

export default class VerStack extends BaseChart {
  constructor (el, data) {
    super(el, data)
    this.op = {
      width: el.clientWidth,
      height: el.clientHeight,

      margin: {
        top: 100,
        left: 60,
        right: 60,
        bottom: 100,
        title: 45
      },
      color: '#67c79f',
      barWidth: 80
    }
  }

  draw (option) {
    if (!this.data || !this.data.aggr || this.data.aggr.length === 0) return
    let op = this.op = Object.assign(this.op, option)
    let el = this.el,
      data = this.data
    let margin = op.margin,
      w = op.width,
      h = op.height,
      color = op.color,
      title = op.title,
      bW = op.barWidth,
      keys = op.keys
    let gW = w - margin.left - margin.right - bW,
      gH = h - margin.top - margin.bottom

    let svg = d3.select(el).append('svg').attr('width', w).attr('height', h)
    let g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)

    let series = d3.stack().keys(keys)(data.aggr),
      x = d3.scalePoint().rangeRound([0, gW]).domain(data.aggr.map(i => i.name)).padding(0.2),
      y = d3.scaleLinear().rangeRound([gH, 0]).domain([0, d3.max(data.aggr, d => d.total)]).nice()
    let seriesG = g.selectAll('g').data(series).enter().append('g')
      .attr('fill', color).attr('opacity', (d, i) => 1 - i * 0.2)
      .on('mouseenter', function (d, i) {
        d3.select(this).attr('fill', d3.color(color).brighter('0.1'))
      })
      .on('mouseout', function (d, i) {
        d3.select(this).attr('fill', d3.color(color))
      })
    // rects
    seriesG.selectAll('rect').data(d => d).enter().append('rect')
      .attr('x', function (d) { return x(d.data.name) - bW / 2 })
      .attr('y', function (d) { return y(d[1]) })
      .attr('height', function (d) { return y(d[0]) - y(d[1]) + 1 })
      .attr('width', bW)

    // labels
    let labels = seriesG.selectAll('text').data((d, i) => {
      d.forEach(j => j.key = d.key)
      return d
    }).enter().append('text').text((d, i) => d.data[d.key + 'Label'])
      .attr('x', d => x(d.data.name) + bW / 2 + 5)
      // y + h / 2 + font-size / 2
      .attr('y', d => y(d[1]) + (y(d[0]) - y(d[1])) / 2 + 6)
      .attr('fill', '#333').attr('opacity', 1)
    // relax
    let spacing = 12, again = false
    labels.each(function (d, i) {
      let a = this,
        da = d3.select(a),
        ya = da.attr('y'),
        xa = da.attr('x')
      labels.each(function (d, j) {
        let b = this,
          db = d3.select(b),
          yb = db.attr('y'),
          xb = db.attr('x')
        if (a === b || xa !== xb) return

        let deltaY = ya - yb
        if (Math.abs(deltaY) > spacing) return
        again = true
        let sign = deltaY > 0 ? 1 : -1
        da.attr('y', +ya + 8)
        db.attr('y', +yb - 8)
      })
    })

    // xLabels
    let xLabels = svg.selectAll('g.labels').data(data.aggr).enter().append('g').classed('labels', true)
    xLabels.append('text').text(d => d.name)
      .attr('x', d => x(d.name) + margin.left).attr('text-anchor', 'middle')
      .attr('y', h - margin.bottom + 25)
    xLabels.append('text').text(d => `${d3.format(',')(+d.value)}，   ${d.ratio}`)
      .attr('x', d => x(d.name) + margin.left).attr('text-anchor', 'middle')
      .attr('y', h - margin.bottom + 50)

    // title
    svg.append('text').text(title).attr('x', margin.left)
       .attr('y', margin.top - margin.title).classed('title', true)
  }
}
