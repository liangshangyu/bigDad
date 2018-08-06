/**
 * Created by hilshire on 2017/7/10.
 */
import * as d3 from 'd3'
import BaseChart from './BaseChart'

export default class ProfileLine extends BaseChart {
  constructor (el, data) {
    super(el, data)
    this.op = {
      width: el.clientWidth,   // 减10防止出现滚动条
      height: el.clientHeight,
      margin: {
        top: 20,
        left: 70,
        right: 70,
        bottom: 5
      },
      barW: 20,
      color: ['#9ea7e3', '#8cafe5', '#8fdee3']
    }
  }

  draw (option) {
    if (!this.data || this.data.length === 0) return
    let op = this.op = Object.assign(this.op, option)
    let data = this.data,
      el = this.el,
      titles = this.op.title,
      keys = op.keys,
      units = op.units,
      xKey = op.x

    let barW = op.barW
    let color = op.color
    let w = op.width,
      h = op.height,
      margin = op.margin

    let svg = d3.select(el).append('svg').attr('width', w).attr('height', h)
    let g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)

    let x1 = d3.scaleLinear().domain([0, d3.max(data.map(i => i[keys[0]])) * 1.2]).range([0, w - margin.left - margin.right])
    let x2 = d3.scaleLinear().domain([0, d3.max(data.map(i => i[keys[1]])) * 1.2]).range([0, w - margin.left - margin.right])
    let y = d3.scalePoint().domain(data.map(i => i[xKey])).range([0, (h - margin.top - margin.bottom) / 2]).padding(1)

// Bars
    let chart1 = g.append('g').attr('transform', `translate(0, 10)`)
    chart1
      .selectAll('.bar').data(data).enter().call(appendBars, keys[0], x1)
    chart1
      .selectAll('.bg').data(data).enter().call(appendBgs, keys[0], x1)

    let chart2 = g.append('g').attr('transform', `translate(0, ${(h - margin.top - margin.bottom) / 2 + 20})`)
    chart2
      .selectAll('.bar').data(data).enter().call(appendBars, keys[1], x2)
    chart2
      .selectAll('.bg').data(data).enter().call(appendBgs, keys[1], x2)

    function appendBars (el, key, xAxis) {
      el.append('rect').classed('bar', true)
        .attr('width', d => xAxis(d[key])).attr('height', barW).attr('fill', (d, i) => color[i])
        .attr('y', d => y(d[xKey]) - barW / 2)
    }
    function appendBgs (el, key, xAxis) {
      el.append('rect').classed('bg', true)
        .attr('width', d => w - margin.left - margin.right - xAxis(d[key])).attr('height', barW)
        .attr('x', d => xAxis(d[key])).attr('y', d => y(d[xKey]) - barW / 2)
        .attr('fill', '#e5eaf0')
    }

// yAxis
    let yAxis = d3.axisLeft(y).ticks(3).tickSizeInner(0).tickPadding(10)
    svg
      .append('g')
      .classed('axis yAxis', true)
      .call(yAxis)
      .attr('transform', `translate(${margin.left}, ${margin.top + 10})`)
    svg
      .append('g')
      .classed('axis yAxis2', true)
      .call(yAxis)
      .attr('transform', `translate(${margin.left}, ${margin.top + (h - margin.top - margin.bottom) / 2 + 20})`)

// labels
    chart1
      .selectAll('.label').data(data).enter().append('text').classed('label', true)
      .text(d => d[keys[0]]).attr('x', w - margin.left - margin.right + 20)
      .attr('y', d => y(d[xKey]) + barW / 2 - 5).style('fill', (d, i) => color[i])
      .style('font-weight', 'bold').style('font-size', '14px')
    chart2
      .selectAll('.label').data(data).enter().append('text').classed('label', true)
      .text(d => d[keys[1]]).attr('x', w - margin.left - margin.right + 20)
      .attr('y', d => y(d[xKey]) + barW / 2 - 5).style('fill', (d, i) => color[i])
      .style('font-weight', 'bold').style('font-size', '14px')

// titles
    chart1.append('text').text(titles[0]).classed('title', true).attr('transform', `translate(-48, 10)`)
      .attr('font-weight', 'bold')
    chart2.append('text').text(titles[1]).classed('title', true).attr('transform', `translate(-48, 10)`)
      .attr('font-weight', 'bold')

// units
    chart1.append('text').text('单位：' + data[0][units[0]]).classed('unit', true)
      .attr('transform', `translate(${w - margin.left - margin.right + 63}, 10)`)
      .attr('text-anchor', 'end').attr('font-size', '12px').style('fill', '#495052')
    chart2.append('text').text('单位：' + data[0][units[1]]).classed('unit', true)
      .attr('transform', `translate(${w - margin.left - margin.right + 63}, 10)`)
      .attr('text-anchor', 'end').attr('font-size', '12px').style('fill', '#495052')

// dividing line
    svg
      .append('line')
      .attr('x1', margin.left - 58).attr('y1', h / 2 + 10)
      .attr('x2', w).attr('y2', h / 2 + 10)
      .attr('stroke', '#e6ebf1')

    this.resize = () => {
      w = el.clientWidth

      x1.range([0, w - margin.left - margin.right])
      x2.range([0, w - margin.left - margin.right])
      y.range([0, (h - margin.top - margin.bottom) / 2]).padding(1)

      chart1
        .selectAll('.bar').transition().attr('width', d => x1(d[keys[0]]))
        .attr('y', d => y(d[xKey]) - barW / 2)
      chart1
        .selectAll('.bg').transition()
        .attr('width', d => w - margin.left - margin.right - x1(d[keys[0]]))
        .attr('x', d => x1(d[keys[0]]))
        .attr('y', d => y(d[xKey]) - barW / 2)
      chart2
        .selectAll('.bar').transition().attr('width', d => x2(d[keys[1]]))
        .attr('y', d => y(d[xKey]) - barW / 2)
      chart2
        .selectAll('.bg').transition()
        .attr('width', d => w - margin.left - margin.right - x2(d[keys[1]]))
        .attr('x', d => x2(d[keys[1]]))
        .attr('y', d => y(d[xKey]) - barW / 2)

      // labels
      chart1
        .selectAll('.label').transition()
        .attr('x', w - margin.left - margin.right + 20)
      chart2
        .selectAll('.label').transition()
        .attr('x', w - margin.left - margin.right + 20)

      // units
      chart1.selectAll('.unit').transition().attr('transform', `translate(${w - margin.left - margin.right + 63}, 10)`)
      chart2.selectAll('.unit').transition().attr('transform', `translate(${w - margin.left - margin.right + 63}, 10)`)
    }
  }
}
