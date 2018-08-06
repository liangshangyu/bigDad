import * as d3 from 'd3'
import BaseChart from './BaseChart'

export default class AnaComparisonStack extends BaseChart {
  constructor (el, data) {
    super(el, data)
    this.op = {
      width: el.clientWidth,
      height: el.clientHeight,
      margin: {
        left: 100,
        right: 60,
        top: 30,
        bottom: 30
      },
      xAxis: {
        tickTxtRotate: 0
      },
      stacks: {
        width: 22
      },
      colorArr: ['#d1eee2', '#ace0ca', '#67c79f', '#94d8bc', '#7ecfad', '#c2e9d9'],
      maskColor: '#bbb'
    }
  }

  draw (option) {
    if (!this.data || this.data.length === 0) return
    let op = this.op = Object.assign(this.op, option)
    let el = this.el,
      data = this.data

    let w = op.width,
      h = this.data.length * 40 < 100 ? 100 : this.data.length * 40,
      margin = op.margin,
      rotate = op.xAxis.tickTxtRotate,
      barW = op.stacks.width

    let svg = d3.select(el)
      .append('svg')
      .attr('width', w)
      .attr('height', h)
    let graph = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)

    let totalW = w - margin.left - margin.right
    let totalH = h - margin.top - margin.bottom
    let max = d3.max(data.map(i => i.value))
    let xScale = d3.scalePoint()
      .domain(data.map(i => i.key))
      .range([0, totalH])
    let yScale = d3.scaleLinear()
      .domain([0, max])
      .range([0, totalW])
      .nice()
    let colorAxis = d3.scaleOrdinal(op.colorArr)

    // axis
    let xAxis = d3.axisLeft(xScale).tickSizeInner(0).tickPadding(50)
    let axis = svg.append('g')
      .classed('axis xAxis', true)
      .call(xAxis)
      .attr('transform', `translate(${margin.left}, ${margin.top + barW / 2})`)
    let ticks = axis.selectAll('.tick')
    ticks.each(function (d, i) {
      wrap.call(d3.select(this).select('text').node())
      d3.select(this).append('text')
        .text(data[i].percentage + '  ')
        .attr('dy', 4)
        .attr('xml:space', 'preserve')
      d3.select(this).selectAll('text')
        .style('fill', '#929eaa')
        .style('font-size', '12px')
    })
    axis.select('path').attr('stroke', 'none')

    // tooltip
    let tooltip = d3.select(el).append('div').classed('tooltip arrow-box arrow-box-bottom', true).style('visibility', 'hidden')

    // labels
    // let labels = graph.selectAll('text.label')
    //   .data(data).enter().append('text')
    //   .classed('label', true)
    //   .text(d => d.value)
    //   .attr('x', d => yScale(d.value) + 20)
    //   .attr('y', d => xScale(d.key) + barW / 2)
    //   .attr('font-size', '12px').attr('dy', 6)
    //   .attr('visibility', d => d.value === max ? 'visible' : 'hidden')

    // bars
    graph.selectAll('g').data(data).enter().append('g')
      .classed('stack', true).each(function (d, i) {
        d3.select(this).append('rect')
          .attr('width', 0)
          .attr('height', barW)
          .attr('x', 0)
          .attr('y', xScale(d.key))
          .attr('fill', colorAxis(i))
          .transition().duration(200).delay(i * 50)
          .attr('width', yScale(d.value))
        d3.select(this).append('rect')
          .attr('width', totalW)
          .attr('height', barW + 10)
          .attr('x', 0)
          .attr('y', xScale(d.key) - 5)
          .attr('fill', op.maskColor)
          .attr('fill-opacity', 0)
          .on('mouseenter', function () {
            d3.select(this).attr('fill-opacity', 0.1)
            tooltip.html(`
                <div style="display:inline-block;vertical-align:top;">${d.key}：</div>
                <div style="display:inline-block;">${d3.format(',')(d.value)}人，<br />
                占比 ${d.percentage}</div>
            `)
          })
          .on('mousemove', function () {
            let x = d3.mouse(el)[0]
            let y = d3.mouse(el)[1]
            tooltip.style('left', x - 35 + 'px')
              .style('top', y - 55 + 'px')
              .style('visibility', 'visible')
          })
          .on('mouseout', function () {
            d3.select(this).attr('fill-opacity', 0)
            tooltip.style('visibility', 'hidden')
          })
        // label go with bar hover
        // d3.select(this).on('mouseenter', function () {
        //   labels.each(function (e, j) {
        //     if (i === j) d3.select(this).attr('visibility', 'visible')
        //     else d3.select(this).attr('visibility', 'hidden')
        //   })
        // })
      })
    function wrap () {
      var self = d3.select(this),
        textLength = self.node().getComputedTextLength(),
        text = self.text()
      while (text.length > 5) {
        text = text.slice(0, -1)
        self.text(text + '...')
      }
    }
    this.resize = function () {
      w = el.clientWidth
      if (!w) return
      totalW = w - margin.left - margin.right
      let t = d3.transition().duration(200).ease(d3.easeLinear)

      svg.attr('width', w)
      yScale.range([0, totalW])
      axis.transition(t).call(xAxis)
      graph.selectAll('.stack').each(function (d) {
        d3.select(this).select('rect').transition(t).attr('width', yScale(d.value))
        d3.select(this).selectAll('rect').filter(':last-of-type').transition(t).attr('width', totalW)
      })
      ticks.each(function (d, i) {
        setTimeout(() => {
          wrap.call(d3.select(this).select('text').node())
        }, 0)
      })
      // labels.transition(t).attr('x', d => yScale(d.value) + 20)
    }
  }
}
