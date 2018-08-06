import * as d3 from 'd3'
import BaseChart from './BaseChart'

export default class SingleStack extends BaseChart {
  constructor (el, data) {
    super(el, data)
    this.op = {
      color: ['#83afea', '#5c7ba4'],
      barWidth: 36,
      barPadding: 30,
      margin: [30, 30, 30, 30]
    }
  }

  draw (option) {
    if (!this.data || !this.data.length || this.data.length === 0) return
    let op = Object.assign(this.op, option)
    let data = this.data,
      total = data.map(i => Object.keys(i).reduce((p, n) => parseInt(i[p]) + parseInt(i[n]))),
      keys = Object.keys(data[0])

    let el = this.el,
      color = op.color,
      w = op.width || el.clientWidth - 10,
      h = op.height || el.clientHeight - 10,
      barW = op.barWidth,
      barPadding = op.barPadding,
      margin = op.margin

    let xMax = w - margin[1] - margin[3],
      xMin = 1
    let yMax = h - margin[0] - margin[2],
      yMin = 1
    let xAxisLeft = margin[0] + barW / 2,
      yAxAxisTop = margin[0] + yMax

    let fill = d3.scaleOrdinal().domain(keys).range(color)

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
      .attr('fill', d => fill(d.key))
      .attr('transform', `translate(${margin[3]}, 0)`)
      .selectAll('rect')
      .data(d => d)
      .enter()
      .append('rect')
      .attr('x', (d, i) => xScale(d[1]))
      .attr('y', (d, i) => yScale(i))
      .attr('height', barW)
      .attr('width', function (d, i) {
        let v = d[1] - d[0]
        if (v / total[i] > 0.04) return xScale(d[0]) - xScale(d[1])
        else return 30
      })
      .on('mouseenter', function () {
        d3.select(this).style('opacity', 0.9)
      })
      .on('mouseleave', function () {
        d3.select(this).style('opacity', 1)
      })

    // label
    svg
      .selectAll('.serie')
      .selectAll('text')
      .data(d => d)
      .enter()
      .append('text')
      .text((d, i) => ((d[1] - d[0]) / total[i] * 100).toFixed(2) + '%')
      .attr('transform', (d, i) => {
        let v = d[1] - d[0]
        // 与bar相同，最小有4%的宽度
        if (v / total[i] > 0.04) {
          return `translate(${xScale(d[1]) +
          (xScale(d[0]) - xScale(d[1])) / 2}, ${yScale(i) +
          barW / 2 +
          5})`
        } else {
          return `translate(${xScale(d[1]) + xScale(total[i] * 0.96) / 2}, ${yScale(i) + barW / 2 + 5})`
        }
      })
      .style('fill', '#fff')
      .style('text-anchor', 'middle')

    this.resize = function () {
      w = el.clientWidth
      h = el.clientHeight
      xMax = w - margin[1] - margin[3]
      yMax = h - margin[2] - margin[4]
      yAxAxisTop = margin[0] + yMax

      svg.attr('width', w).attr('height', h)
      xScale.rangeRound([xMax, 0])
      yScale.rangeRound([0, yMax])

      svg
        .selectAll('.serie')
        .transition()
        .attr('transform', `translate(${margin[3]}, 0)`)
        .selectAll('rect')
        .attr('x', (d, i) => xScale(d[1]))
        .attr('y', (d, i) => yScale(i))
        .attr('height', barW)
        .attr('width', function (d, i) {
          let v = d[1] - d[0]
          if (v / total[i] > 0.04) return xScale(d[0]) - xScale(d[1])
          else return 30
        })

      svg
        .selectAll('.serie')
        .selectAll('text')
        .transition()
        .attr('transform', (d, i) => {
          let v = d[1] - d[0]
          if (v / total[i] > 0.04) {
            return `translate(${xScale(d[1]) +
            (xScale(d[0]) - xScale(d[1])) / 2}, ${yScale(i) +
            barW / 2 +
            5})`
          } else {
            return `translate(${xScale(d[1]) +
            xScale(total[i] * 0.96) / 2}, ${yScale(i) + barW / 2})`
          }
        })
    }
  }
}
