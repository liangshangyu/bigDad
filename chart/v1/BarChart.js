import * as d3 from 'd3'
import BaseChart from './BaseChart'

export default class Bar extends BaseChart {
  constructor (el, data) {
    super(el, data)
    this.op = {
      color: '#83afea',
      width: el.clientWidth - 10,   // 减10防止出现滚动条
      height: el.clientHeight - 10,
      barWid: 36,
      barPadding: 30,    // 这个属性没有作用，但是在没有指定barWidth的情况下可能有用
      margin: [50, 10, 50, 50],
      labelPadding: 5,
      tickPadding: 7,
      unit: '（人数）',
      unitPadding: 20
    }
  }

  draw (option) {
    let op = this.op = Object.assign(this.op, option)

    let margin = op.margin,
      width = op.width,
      height = op.height,
      color = op.color,
      barWid = op.barWid,
      el = this.el

    let yMax = op.height - margin[0] - margin[2],
      yMin = 1,
      xMax = op.width - margin[3] - margin[1]
    let axisLeft = margin[3] + barWid / 2,
      xAxisTop = margin[0] + yMax

    let data = (this.data && this.data.aggr) ? this.data : { aggr: [] }

    let yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data.aggr.map(i => Number(i.value)))])
      .range([yMax, yMin])
    let xScale = d3
      .scalePoint()
      .domain(data.aggr.map(i => i.name))
      .range([0, xMax])
      .padding(op.barPadding)

    let xAxis = d3.axisBottom(xScale).tickSizeInner(0).tickPadding(op.tickPadding)
    let yAxis = d3.axisLeft(yScale).ticks(5).tickSizeInner(0)

    let svg = d3.select(el).append('svg')
    this.svg = svg
    svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin[3]}, ${margin[0]})`)
      .selectAll('rect')
      .data(data.aggr)
      .enter()
      .append('g')
      .classed('bar', true)
      .append('rect')
      .attr('x', d => xScale(d.name))
      .attr('y', d => yScale(d.value))
      // 最小为0
      .attr('height', d => yMax - yScale(d.value) + 1)
      .attr('width', barWid)
      .attr('fill', color)
      .on('mouseenter', function () {
        this.nextSibling.classList.remove('hide')
        d3.select(this).attr('fill', d3.rgb(color).brighter(0.3))
      })
      .on('mouseleave', function () {
        this.nextSibling.classList.add('hide')
        d3.select(this).attr('fill', color)
      })

    svg
      .selectAll('g.bar')
      .data(data.aggr)
      .append('text')
      .classed('label hide', true)
      .text(d => d.value)
      .attr(
        'transform',
        d =>
          `translate(${xScale(d.name) + barWid / 2}, ${yScale(d.value) -
          op.labelPadding})`
      )
      .style('text-anchor', 'middle')

    svg
      .append('text')
      .text(op.unit)
      .attr('transform', `translate(${axisLeft}, ${margin[0] - op.unitPadding})`)
      .style('text-anchor', 'end')

    svg
      .append('g')
      .classed('axis xAxis', true)
      .call(xAxis)
      .attr('transform', `translate(${axisLeft}, ${xAxisTop})`)
    svg
      .append('g')
      .classed('axis yAxis', true)
      .call(yAxis)
      .attr('transform', `translate(${axisLeft}, ${margin[0]})`)

    this.resize = function () {
      width = el.clientWidth - 10
      height = el.clientHeight - 10
      let xMax = width - margin[3] - margin[1]
      let yMax = height - margin[0] - margin[2]
      let xAxisTop = margin[0] + yMax

      svg.attr('width', width).attr('height', height)
      xScale.range([0, xMax])
      yScale.range([yMax, yMin])

      svg
        .selectAll('.bar rect').transition()
        .attr('x', d => xScale(d.name))
        .attr('y', d => yScale(d.value))
        .attr('height', d => yMax - yScale(d.value) + 1)
      svg
        .selectAll('.bar text').transition()
        .attr(
          'transform',
          d =>
            `translate(${xScale(d.name) + barWid / 2}, ${yScale(d.value) -
            op.labelPadding})`
        )
      svg.select('.xAxis').transition().call(xAxis).attr('transform', `translate(${axisLeft}, ${xAxisTop})`)
      svg.select('.yAxis').transition().call(yAxis).attr('transform', `translate(${axisLeft}, ${margin[0]})`)
    }
  }
}
