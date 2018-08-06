import * as d3 from 'd3'
import BaseChart from './BaseChart'

export default class Bar extends BaseChart {
  constructor (el, data) {
    super(el, data)
    this.op = {
      color: '#67c79f',
      width: el.clientWidth,
      height: el.clientHeight,
      barWid: 22,
      barPLeft: 120,
      barPTop: 80,
      barPadding: 0.2,
      margin: {
        top: 35,
        left: 40,
        right: 160,
        bottom: 35
      },
      labelPadding: 5,
      titleH: 54,
      ratioLeft: 70
    }
  }

  draw (option) {
    if (!this.data || !this.data.aggr) return
    let op = this.op = Object.assign(this.op, option)
    let el = this.el,
      data = this.data

    let w = op.width,
      h = op.height

    let barPLeft = op.barPLeft,
      barPTop = op.barPTop,
      barP = op.barPadding,
      margin = op.margin,
      barW = op.barWid,
      color = op.color,
      ratioLeft = op.ratioLeft,
      title = op.title

    let max = d3.max(data.aggr.map(i => parseInt(i.value)))

    let x = d3.scaleLinear().domain([0, max]).range([0, w - barPLeft - margin.right])
    let y = d3.scalePoint().domain(data.aggr.map(i => i.name)).range([0, h - barW - barPTop - margin.bottom]).padding(barP)

    let svg = d3.select(this.el).append('svg').attr('width', w).attr('height', h)
    let g = svg.append('g').attr('transform', 'translate(0,' + 0 + ')')

    let series = g.selectAll('.series').data(data.aggr).enter()
      .append('g').classed('series', true)
      .attr('fill', color).attr('opacity', (d, i) => 1 - i * 0.15)
      .append('rect')
      .attr('width', d => x(d.value) + 4)
      .attr('height', d => barW)
      .attr('y', d => y(d.name) + barPTop)
      .attr('x', barPLeft + margin.left)
      .on('mouseenter', function () {
        d3.select(this).attr('opacity', 0.9)
      })
      .on('mouseout', function () {
        d3.select(this).attr('opacity', 1)
      })

    let nameLabels = g.selectAll('.name').data(data.aggr).enter().append('text').classed('labels name', true)
      .attr('x', margin.left)
      .attr('y', d => y(d.name) + barW / 2 + 6 + barPTop)
      .append('tspan').text(d => d.name).each(wrap)

    let ratioLabels = g.selectAll('.ratio').data(data.aggr).enter().append('text').classed('labels ratio', true)
      .text(d => (d.ratio * 100).toFixed(1) + '%')
      .attr('y', d => y(d.name) + barW / 2 + 6 + barPTop)
      .attr('x', ratioLeft + margin.left)

    // title
    let _title = svg.append('text').text(title.replace(/(\d+)/, d => {
      return d3.format(',')(d)
    })).classed('title', true)
      .attr('transform', `translate(${margin.left}, ${margin.top + 16})`).attr('xml:space', 'preserve')

    var div = d3.select(this.el)
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)

    function wrap () {
      var self = d3.select(this),
        textLength = self.node().getComputedTextLength(),
        text = self.text()

      while (textLength > ratioLeft && text.length > 0) {
        text = text.slice(0, -1)
        self.text(text + '...')
          .call(bindTooltip)
        textLength = self.node().getComputedTextLength()
      }
    }

    function bindTooltip (el) {
      el
        .on('mouseenter', function (d, i) {
          div.transition().duration(200).style('opacity', 1)
          div
            .html(d.name)
            .style('top', y(d.name) + barW + 10 + barPTop + 'px')
            .style('left', margin.left - 5 + 'px')
        })
        .on('mouseout', function (d) {
          div.transition().duration(200).style('opacity', 0)
        })
    }
  }
}
