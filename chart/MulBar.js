/**
 * Created by hilshire on 2017/7/14.
 */
import * as d3 from 'd3'
import BaseChart from './BaseChart'

export default class MulBar extends BaseChart {
  constructor (el, data) {
    super(el, data)
    this.op = {
      color: '#67c79f',
      width: el.clientWidth,
      height: el.clientHeight,
      barWidth: 22,
      barPadding: 6,
      margin: {
        top: 135,
        left: 90,
        right: 160,
        bottom: 60,
        title: 90,
        legend: 50
      },
      labelPadding: 5,
      keys: [],
      title: ''
    }
  }

  draw (option) {
    if (!this.data || !this.data[0]) return

    let op = this.op = Object.assign(this.op, option)
    let el = this.el,
      data = this.data
    let margin = op.margin,
      w = op.width,
      h = op.height,
      color = op.color,
      labelPadding = op.labelPadding,
      keys = op.keys,
      title = op.title,
      barW = op.barWidth,
      barP = op.barPadding

    let mainH = h - margin.top - margin.bottom,
      mainW = w - margin.left - margin.right
    let maxIdx = getMaxIdx(data)
    let yMax = d3.max(data.map(i => d3.max(keys.map(j => +i[j]))))
    let y = d3.scaleLinear().domain([0, yMax]).range([mainH, 0])
    let x0 = d3.scaleBand().domain(data.map(i => i.name)).rangeRound([0, mainW])
    let x1 = d3.scalePoint().domain(Object.keys(data[0]).filter(i => i !== 'name')).rangeRound([0, x0.bandwidth()])

    let svg = d3
      .select(this.el)
      .append('svg').attr('width', w).attr('height', h)

    let g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    let series = g.selectAll('.series').data(data).enter().append('g').classed('series', true)
      .attr('transform', d => `translate(${x0(d.name)}, 0)`)

    let bars = series.selectAll('g')
      .data(d => keys.map(i => ({key: i, value: d[i]}))).enter().append('g')
      .classed('bar', true)
      .on('mouseenter', function () {
        d3.select(this).select('rect').attr('fill', d3.rgb(color).brighter(0.3))
        bars.classed('chosen-bar', false)
        d3.select(this).classed('chosen-bar', true)
      })
      .on('mouseleave', function () {
        d3.select(this).select('rect').attr('fill', color)
      })

    bars.append('rect')
      .attr('x', (d, i) => {
        let brandW = x0.bandwidth()
        if (i === 0) return brandW / 2 - barW - barP / 2
        else if (i === 1) return brandW / 2 + barP / 2
      })
      .attr('y', d => y(d.value))
      .attr('width', barW).attr('height', d => mainH - y(d.value) + 1)
      .attr('fill', color).attr('opacity', (d, i) => 1 - 0.5 * i)

// x axis
    g
      .append('g')
      .classed('axis xAxis', true)
      .call(d3.axisBottom(x0).tickSizeInner(0).tickPadding(6))
      .attr('transform', `translate(${0}, ${mainH})`)
// labels
    bars
      .append('text').classed('label toggle', true).text(d => d3.format(',')(+d.value))
      .attr('x', (d, i) => {
        let brandW = x0.bandwidth()
        return brandW / 2 + (2 * i - 1) * (barP / 2 + barW / 2)
      })
      .attr('y', d => y(d.value) - labelPadding)
// title
    svg.append('text').text(title).classed('title', true)
      // .attr('transform', `translate(${margin.left + x0.bandwidth() / 2 - 1.5 * barW}, ${margin.top - margin.title})`)
      .attr('transform', `translate(${margin.left}, ${margin.top - margin.title})`)
// legends
    let legends = svg.selectAll('.legend').data(keys).enter().append('g').classed('legend', true)
      // .attr('transform', (d, i) => `translate(${i * 200 + margin.left + x0.bandwidth() / 2 - 1.5 * barW}, ${margin.top - margin.legend})`)
      .attr('transform', (d, i) => `translate(${i * 200 + margin.left}, ${margin.top - margin.legend})`)
    legends.append('text').text(d => d).attr('x', 17).attr('y', 10)
    legends.append('rect').attr('width', 12).attr('height', 12).attr('fill', color)
      .attr('opacity', (d, i) => 1 - 0.5 * i).classed('legend-rect', true)

    g.selectAll('.bar').classed('chosen-bar', (d, i) => i === maxIdx)

    function getMaxIdx (data) {
      let max = 0,
        idx = 0
      data.forEach((i, dataIdx) => {
        keys.forEach((j, keyIdx) => {
          if (+i[j] > +max) {
            max = i[j]
            idx = dataIdx * 2 + keyIdx
          }
        })
      })
      return idx
    }
  }
}
