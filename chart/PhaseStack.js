import * as d3 from 'd3'
import BaseChart from './BaseChart'
import * as common from './commonChart'

export default class AnaComparisonStack extends BaseChart {
  constructor (el, data) {
    super(el, data)
    this.op = {
      width: el.clientWidth,
      height: el.clientHeight,
      margin: {
        left: 60,
        right: 60,
        top: 50,
        bottom: 50
      },
      xAxis: {
        tickTxtRotate: 0
      },
      stacks: {
        width: 22
      },
      colorArr: ['#d1eee2', '#ace0ca', '#67c79f', '#94d8bc', '#7ecfad', '#c2e9d9']
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
      rotate = op.xAxis.tickTxtRotate,
      barW = op.stacks.width

    let svg = d3.select(el)
      .append('svg')
      .attr('width', w)
      .attr('height', h)
    let graph = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)

    let totalW = w - margin.left - margin.right - barW
    let totalH = h - margin.top - margin.bottom
    let max = d3.max(data.map(i => i.value))
    let maxIdx = data.map(i => i.value).indexOf(max)
    let orderArr = data.map(i => i.value).sort((a, b) => b - a)
    let xScale = d3.scalePoint()
      .domain(data.map(i => i.key))
      .range([0, totalW])
    let yScale = d3.scaleLinear()
      .domain([0, max])
      .range([0, totalH])
      .nice()
    // axis
    let xAxis = d3.axisBottom(xScale).tickSizeInner(0).tickPadding(6)
    let axis = svg.append('g')
      .classed('axis xAxis', true).call(xAxis)
      .attr('transform', `translate(${margin.left + barW / 2}, ${h - margin.bottom})`)
    let axisTxts = axis.selectAll('text')
    if (rotate) {
      axisTxts.attr('dx', '0em')
        .style('text-anchor', 'end')
        .attr('dy', '.8em')
        .attr('transform', `rotate(${rotate})`)
    }
    axisTxts.style('fill', '#929eaa').style('font-size', '12px')
    axis.select('path').attr('stroke', 'none')

    // labels
    let labels = graph.selectAll('text.label')
      .data(data).enter().append('text')
      .classed('label', true)
      .text(d => d3.format(',')(d.value))
      .attr('x', d => xScale(d.key) + barW / 2)
      .attr('y', d => totalH - yScale(d.value) - 10)
      .attr('font-size', '12px').attr('text-anchor', 'middle')
      .attr('visibility', (d, i) => i === maxIdx ? 'visible' : 'hidden')
    // tooltip
    let tooltip = d3.select(el).append('div')
      .classed('tooltip arrow-box arrow-box-bottom', true)
      .style('visibility', 'hidden')

    // bars
    graph.selectAll('g').data(data).enter().append('g')
      .classed('stack', true).each(function (d, i) {
        d3.select(this).append('rect')
          .attr('width', barW).attr('height', 0)
          .attr('x', xScale(d.key)).attr('y', totalH)
          .attr('fill', (d, index) => {
            for (let j = 0; j < orderArr.length; j++) {
              if (d.value === orderArr[j]) {
                orderArr[j] = -1
                return op.colorArr[j]
              }
            }
          }).transition().duration(200).delay(i * 50)
          .attr('height', yScale(d.value))
          .attr('y', totalH - yScale(d.value))
        d3.select(this).append('rect')
          .attr('width', barW + 10).attr('height', totalH + 30)
          .attr('x', xScale(d.key) - 5).attr('y', -30)
          .attr('fill', '#bbb')
          .attr('fill-opacity', 0)
          .on('mouseenter', function () {
            d3.select(this).attr('fill-opacity', 0.1)
            labels.each(function (e, j) {
              if (i === j) d3.select(this).attr('visibility', 'visible')
              else d3.select(this).attr('visibility', 'hidden')
            })
            tooltip.html(`
              <div style="display:inline-block;vertical-align:top;">${d.key}：</div>
              <div style="display:inline-block;">${d3.format(',')(d.value)}人，<br />
              占比 ${d.percentage}</div>
            `)
          }).on('mousemove', function () {
            let x = d3.mouse(el)[0]
            let y = d3.mouse(el)[1]
            tooltip.style('left', x - 35 + 'px')
              .style('top', y - 55 + 'px')
              .style('visibility', 'visible')
          }).on('mouseleave', function () {
            d3.select(this).attr('fill-opacity', 0)
            tooltip.style('visibility', 'hidden')
          })
      })

    this.resize = function () {
      w = el.clientWidth
      if (!w) return
      totalW = w - margin.left - margin.right - barW
      let t = d3.transition().duration(200).ease(d3.easeLinear)

      svg.transition(t).attr('width', w)
      xScale.range([0, totalW])
      axis.transition(t).call(xAxis)
      labels.transition(t).attr('x', d => xScale(d.key) + barW / 2)
      graph.selectAll('.stack').each(function (d) {
        d3.select(this).select('rect').transition(t).attr('x', xScale(d.key))
        d3.select(this).selectAll('rect').filter(':last-of-type').attr('x', xScale(d.key) - 5)
      })
    }
  }
}
