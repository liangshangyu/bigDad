import * as d3 from 'd3'
import BaseChart from './BaseChart'

export default class SingleStack extends BaseChart {
  constructor (el, data) {
    super(el, data)
    this.op = {
      color: '#67c79f',
      barHeight: 22,
      barWidth: 215,
      barPadding: 30,
      margin: {
        top: 30,
        left: 55,
        right: 30,
        bottom: 30,
        title: 60
      },
      titleH: 54
    }
  }

  draw (option) {
    if (!this.data || !this.data[0]) return
    let op = Object.assign(this.op, option)
    let data = this.data,
      total = data.map(i => Object.keys(i).reduce((p, n) => parseInt(i[p]) + parseInt(i[n]))),
      keys = Object.keys(data[0])

    let el = this.el,
      color = d3.rgb(op.color),
      w = op.width || el.clientWidth - 10,
      h = op.height || el.clientHeight - 10,
      barH = op.barHeight,
      barW = op.barWidth,
      barPadding = op.barPadding,
      margin = op.margin,
      title = op.title,
      titleH = op.titleH

    let xMax = barW
    let yMax = h - margin.top - margin.bottom
    let xAxisLeft = margin.top + barH / 2,
      yAxAxisTop = margin.top + yMax

    let stack = d3.stack().keys(keys)
    let xScale = d3.scaleLinear().domain([0, d3.max(total)]).rangeRound([xMax, 0])

    let yScale = d3
      .scalePoint()
      .domain(Object.keys(data))
      .rangeRound([0, yMax])
      .padding(barPadding)

    let svg = d3.select(this.el).append('svg')

    // bar
    svg
      .attr('width', w)
      .attr('height', h)
      .selectAll('.serie')
      .data(stack(data))
      .enter()
      .append('g')
      .attr('class', 'serie')
      .attr('fill', color)
      .attr('opacity', (d, i) => 1 - 0.4 * i)
      .attr('transform', `translate(${margin.left}, ${titleH})`)
      .selectAll('rect')
      .data(d => d)
      .enter()
      .append('rect')
      .attr('x', (d, i) => xScale(d[1]))
      .attr('y', (d, i) => yScale(i))
      .attr('height', barH)
      .attr('width', function (d, i) {
        let v = d[1] - d[0]
        if (v / total[i] > 0.04) return xScale(d[0]) - xScale(d[1])
        else return 30
      })
      .on('mouseenter', function () {
        d3.select(this).style('opacity', 0.8)
      })
      .on('mouseleave', function () {
        d3.select(this).style('opacity', 1)
      })

    // label
    svg
      .selectAll('.label')
      .data(stack(data))
      .enter()
      .append('text')
      .classed('label', true)
      .text(function (d, i) {
        return d.key + ' ' + ((d[0][1] - d[0][0]) / total[0] * 100).toFixed(2) + '%'
      })
      .attr('x', (d, idx) => {
        if (idx === 0) return xScale(d[0][0]) + margin.left
        else return xScale(d[0][1]) + margin.left
      })
      .attr('y', yScale(0) + titleH - 15)
      .style('opacity', 1)
      .style('text-anchor', (d, idx) => idx === 0 ? 'end' : 'start')

    // title
    svg.append('text').text(title.replace(/(\d+)/, d => {
      return d3.format(',')(d)
    })).attr('transform', () => `translate(${margin.left}, ${margin.top})`)
      .attr('xml:space', 'preserve')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .style('fill', '#495052')
  }
}
