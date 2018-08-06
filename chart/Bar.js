import * as d3 from 'd3'
import BaseChart from './BaseChart'

export default class Bar extends BaseChart {
  constructor (el, data) {
    super(el, data)
    this.op = {
      color: '#67c79f',
      width: el.clientWidth,   // 减10防止出现滚动条
      height: el.clientHeight,
      barWid: 22,
      barPadding: 19,
      margin: {
        top: 30,
        left: 30,
        right: 30,
        bottom: 30,
        title: 54
      },
      labelPadding: 5,
      wrapStep: 3
    }
  }

  draw (option) {
    if (!this.data || !this.data.aggr) return

    let op = this.op = Object.assign(this.op, option)
    let el = this.el,
      data = this.data
    let margin = op.margin,
      w = op.width,
      h = op.height,
      color = op.color,
      barWid = op.barWid,
      barPadding = op.barPadding,
      labelPadding = op.labelPadding,
      title = op.title,
      titleH = op.margin.title,
      wrapStep = op.wrapStep

    let yMax = h - margin.top - margin.bottom - titleH,
      yMin = 1
    let xMax = (data.aggr.length + 1) * (barWid + barPadding)

    let AxisLeftMargin = margin.left + barWid / 2,
      xAxisTopMargin = margin.top + yMax + titleH

    let maxIdx = getMaxIdx(data.aggr)
    let svg = d3
      .select(el)
      .append('svg')
    let yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data.aggr.map(i => parseInt(i.value)))])
      .range([yMax, yMin])
    let xScale = d3
      .scalePoint()
      .domain(data.aggr.map(i => i.name))
      .range([0, xMax])
      .padding(barPadding)
    let xAxis = d3.axisBottom(xScale).tickSizeInner(0).tickPadding(6)

    let barGs = svg
      .attr('width', w)
      .attr('height', h)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${titleH + margin.top})`)
      .selectAll('rect')
      .data(data.aggr)
      .enter()
      .append('g')
      .classed('bar', true)
      .classed('chosen-bar', (d, i) => i === maxIdx)
      .on('mouseenter', function () {
        d3.select(this).classed('chosen-bar', true)
        let enter = this
        barGs.each(function (d, idx) {
          if (enter === this) return
          d3.select(this).classed('chosen-bar', false)
        })
      })

    barGs
      .append('rect')
      .attr('x', d => xScale(d.name))
      .attr('y', d => yScale(d.value))
      // 最小为1
      .attr('height', d => yMax - yScale(d.value) + 1)
      .attr('width', barWid)
      .attr('fill', color)

    let labels = svg
      .selectAll('g.bar')
      .data(data.aggr)
      .append('text')
      .classed('label', true)
      .text(d => d3.format(',')(d.value))
      .attr('x', d => xScale(d.name) + barWid / 2)
      .attr('y', d => yScale(d.value) - labelPadding)
      // .attr(
      //   'transform',
      //   d =>
      //     `translate(${xScale(d.name) + barWid / 2}, ${yScale(d.value) -
      //     labelPadding})`
      // )
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('visibility', 'hidden')

    // xaixs
    svg
      .append('g')
      .classed('axis xAxis', true)
      .call(xAxis)
      .attr('transform', `translate(${AxisLeftMargin}, ${xAxisTopMargin})`)
      .selectAll('.tick text')
      .call(wrap, xScale.step())

    // title
    svg.append('text').text(title.replace(/(\d+)/, d => {
      return d3.format(',')(d)
    })).attr('transform', () => `translate(${AxisLeftMargin + barPadding}, ${margin.top})`)
      .attr('xml:space', 'preserve')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .style('fill', '#495052')
    // .attr('text-anchor', 'middle')
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
          lineHeight = 1.1, // ems
          y = text.attr('y'),
          dy = parseFloat(text.attr('dy')),
          tspan = text.text(null).append('tspan').attr('x', 0).attr('y', y).attr('dy', dy + 'em')

        while ((word = words.pop())) {
          line.push(word)
          tspan.text(line.join(''))
          if (tspan.node().getComputedTextLength() > width) {
            line.pop()
            tspan.text(line.join(''))
            line = [word]
            tspan = text.append('tspan').attr('x', 0).attr('y', y).attr('dy', ++lineNumber * lineHeight + dy + 'em').text(word)
          }
        }
      })
    }

    function relax () {
      var alpha = 15,
        spacing = 15
      let again = -1
      labels.each(function (d, idx) {
        let a = this, da = d3.select(a), daXRight = +da.attr('x') + a.getComputedTextLength()
        labels.each(function (d, idx) {
          let b = this, db = d3.select(b), dbXLeft = +db.attr('x'), dby = +db.attr('y'), deltaX
          if (a === b) return
          deltaX = dbXLeft - daXRight

          if (deltaX < 0) {
            return
          }

          again *= -1
          db.attr('y', dby - alpha * again)
        })
      })
    }

    function getMaxIdx (data) {
      let idx = 0
      for (let i = 0; i < data.length; i++) {
        if (+data[i].value > +data[idx].value) idx = i
      }
      return idx
    }

    // relax()
  }
}
