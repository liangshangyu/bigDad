import * as d3 from 'd3'
import BaseChart from './BaseChart'

export default class AnaComparisonMulHoriStack extends BaseChart {
  constructor (el, data) {
    super(el, data)
    this.op = {
      width: el.clientWidth,
      height: el.clientHeight,
      margin: {
        left: 60,
        right: 60,
        top: 80,
        bottom: 20
      },
      stacks: {
        width: 22
      },
      colorArr: ['#67c79f', '#b3e3cf']
    }
  }

  draw (option) {
    if (!this.data || this.data.length === 0) return
    let op = this.op = Object.assign(this.op, option)
    let el = this.el,
      data = this.data

    let w = op.width,
      h = op.height,
      margin = op.margin,
      barW = op.stacks.width,
      colorArr = op.colorArr

    let svg = d3.select(el)
      .append('svg')
      .attr('width', w)
      .attr('height', h)
    let graph = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)

    let total = d3.sum(data.map(val => +val.value)) || 1
    let totalW = w - margin.left - margin.right
    let transX = 0
    graph.selectAll('g')
      .data(data).enter().append('g')
      .classed('group', true).each(function (d, idx) {
        let radio = d.value / total
        let width = totalW * radio
        let thisSel = d3.select(this)
          .attr('transform', `translate(${transX},0)`)
        thisSel.append('rect')
          .attr('x', 0).attr('y', 0)
          .attr('width', width)
          .attr('height', barW)
          .attr('fill', colorArr[idx])
        transX += width
        let txtG = thisSel.append('g')
        if (idx > 0) {
          let preW = data[idx - 1].value / total * totalW
          preW < 60 && txtG.attr('transform', `translate(${60 - preW},0)`)
        }
        txtG.append('text')
          .text(d.key).attr('y', 40)
        txtG.append('text')
          .text(d3.format('.1%')(radio))
          .attr('x', 20).attr('y', 40)
        txtG.append('text')
          .text(d3.format(',')(d.value) + '人')
          .attr('x', 20).attr('y', 60)
        txtG.selectAll('text').style('fill', '#929eaa').style('font-size', '12px')
      })

    this.resize = function () {
      let t = d3.transition().duration(200).ease(d3.easeLinear)
      w = el.clientWidth
      if (!w) return
      svg.attr('width', w)
      transX = 0
      totalW = w - margin.left - margin.right
      graph.selectAll('.group').each(function (d, idx) {
        let radio = d.value / total
        let width = totalW * radio
        let thisSel = d3.select(this)
        thisSel.transition(t).attr('transform', `translate(${transX},0)`)
        thisSel.select('rect').transition(t).attr('width', width)
        transX += width
        let txtG = thisSel.select('g')
        if (idx > 0) {
          let preW = data[idx - 1].value / total * totalW
          preW < 60 && txtG.transition().attr('transform', `translate(${60 - preW},0)`)
        }
      })
    }

    // labels
    // let labels = graph.selectAll('text.label')
    //   .data(data).enter().append('text')
    //   .classed('label', true)
    //   .text(d => d.value)
    //   .attr('x', d => yScale(d.value) + 20)
    //   .attr('y', d => xScale(d.key) + barW / 2)
    //   .attr('font-size', '12px').attr('dy', 6)
    //   .attr('visibility', d => d.value === max ? 'visible' : 'hidden')
    // label go with bar hover
    // d3.select(this).on('mouseenter', function () {
    //   labels.each(function (e, j) {
    //     if (i === j) d3.select(this).attr('visibility', 'visible')
    //     else d3.select(this).attr('visibility', 'hidden')
    //   })
    // })
  }
}
