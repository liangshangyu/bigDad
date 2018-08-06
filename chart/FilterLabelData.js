import * as d3 from 'd3'
import BaseChart from './BaseChart'

export default class FilterLabelData extends BaseChart {
  constructor (el, data) {
    super(el, data)
    this.op = {
      color: '#67c79f',
      width: el.clientWidth,
      height: el.clientHeight,
      margin: {
        top: 60,
        left: 70,
        right: 85,
        bottom: 60
      },
      barW: 25,
      wrapStep: 8,
      textColor: '#929EAA'
    }
  }

  draw (option) {
    if (!this.data || this.data.length === 0) return

    let op = this.op = Object.assign(this.op, option)
    let { el, data } = this
    el.innerHTML = ''

    const w = op.width,
      h = op.height
    const { margin, barW, color, sortArr, wrapStep, textColor } = op
    const max = data.reduce((p, n) => {
      return +p.value > +n.value ? p : n
    }).value
    sortArr && (data = sortArr.map(i => data.filter(j => j.name === i)[0]).filter(i => i))
    let x = d3.scalePoint().domain(data.map(i => i.name)).range([0, w - margin.right - margin.left])
    let y = d3.scaleLinear().domain([0, max]).range([0, h - margin.bottom - margin.top])
    let svg = d3.select(this.el).append('svg').attr('width', w).attr('height', h)
    let g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)

    // rect
    let series = g.selectAll('.series').data(data).enter()
      .append('g').classed('series', true)
      .append('rect').attr('fill', color)
      .attr('width', d => barW)
      .attr('height', d => y(d.value))
      .attr('x', d => x(d.name) - barW / 2)
      .attr('y', d => h - margin.top - margin.bottom - y(d.value))
      .on('mouseenter', function () {
        d3.select(this).attr('opacity', 0.9)
      })
      .on('mouseout', function () {
        d3.select(this).attr('opacity', 1)
      })

    // axis
    svg
    .append('g').classed('axis xAxis', true).call(d3.axisBottom(x).tickSizeInner(0).tickPadding(15))
    .attr('transform', `translate(${margin.left}, ${h - margin.bottom})`)
    .selectAll('.tick text').call(wrap, x.step())

    // labels
    let ValueLabels = svg
      .selectAll('g.series')
      .data(data)
      .append('text')
      .classed('label', true)
      .text(d => Number.isNaN(d.value) ? '' : d3.format(',')(d.value))
      .attr('fill', textColor)
      .attr('x', d => x(d.name))
      .attr('y', d => h - y(d.value) - 30 - margin.top - margin.bottom)

    let RatioLabels = svg
      .selectAll('g.series')
      .data(data)
      .append('text')
      .classed('label', true)
      .text(d => d.ratio)
      .attr('x', d => x(d.name))
      .attr('y', d => h - y(d.value) - 10 - margin.top - margin.bottom)
    function wrap (text, width) {
      text.each(function () {
        let idx = 0
        let step = wrapStep
        let text = d3.select(this)
        let arr = text.text().split('')
        let words = []
        while (idx < arr.length) {
          words.push(arr.slice(idx, idx += step))
        }
        words = words.map(i => i.join(''))
        words.reverse().join('')

        var
          // words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.3, // ems
          y = text.attr('y'),
          dy = parseFloat(text.attr('dy')),
          tspan = text.text(null).append('tspan').attr('x', 0).attr('y', y).attr('dy', dy + 'em').attr('font-size', '12px')
                  .attr('fill', textColor)

        while ((word = words.pop())) {
          line.push(word)
          tspan.text(line.join(''))
          if (tspan.node().getComputedTextLength() > width) {
            line.pop()
            tspan.text(line.join(''))
            line = [word]
            tspan = text.append('tspan').attr('x', 0).attr('y', y).attr('dy', ++lineNumber * lineHeight + dy + 'em')
                    .text(word).attr('font-size', '12px').attr('fill', textColor)
          }
        }
      })
    }
  }
}
