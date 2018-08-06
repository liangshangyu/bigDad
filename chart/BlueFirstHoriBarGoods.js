import * as d3 from 'd3'
import BaseChart from './BaseChart'

export default class Bar extends BaseChart {
  constructor (el, data) {
    super(el, data)
    this.op = {
      colors: [
        '#51A5DE', '#67C79F', '#68C7A0', '#6DC9A3', '#74CCA8', '#7FD0AE', '#8DD5B7', '#9EDBC2', '#B1E2CE', '#C9EBDD',
        '#BBEAD7', '#BDE4D4', '#AED7C6', '#9AC9B6', '#8DBBA8', '#82B19E', '#7F9F92', '#90A19A', '#95AEA4', '#A8BCB4'
      ],
      firstColor: '#51a5de',
      width: el.clientWidth,   // 减10防止出现滚动条
      height: el.clientHeight,
      barWid: 22,
      barPLeft: 120,
      // 第一个柱状图离svg顶部的距离
      barPTop: 60,
      barMarginTop: 40,
      barPadding: 0.2,
      margin: {
        top: 15,
        left: 40,
        right: 40,
        bottom: 35
      },
      labelPadding: 5,
      titleH: 10,
      ratioLeft: 70
    }
  }

  draw (option) {
    if (!this.data || !this.data.orginlist) return
    if (option.width === 0 || option.width === '0') delete option.width
    let op = this.op = Object.assign(this.op, option)
    let el = this.el,
      data = this.data
    let w = op.width,
      h = op.height * 40 + 80
      // h = this.data.orginlist.length * 100
    let barPLeft = op.barPLeft,
      barPTop = op.barPTop,
      barP = op.barPadding,
      barMarginTop = op.barMarginTop,
      margin = op.margin,
      barW = op.barWid,
      colors = op.colors,
      firstColor = op.firstColor,
      ratioLeft = op.ratioLeft,
      titleName = op.title
    let max = d3.max(data.orginlist.map(i => parseInt(i.value)))
    let x = d3.scaleLinear().domain([0, max]).range([0, w - barPLeft - margin.left - margin.right])
    // let y = d3.scalePoint().domain(data.orginlist.map(i => i.code)).range([0, h - 30 - barPTop]).padding(0.2)
    // tooltip
    if (el.parentNode.querySelector('.tooltip')) {
      el.parentNode.removeChild(el.parentNode.querySelector('.tooltip'))
    }
    // el.parentNode.removeChild(el.parentNode.querySelector('.tooltip'))
    let tooltip = d3.select(el.parentNode).append('div').classed('tooltip arrow-box arrow-box-bottom', true).style('visibility', 'hidden')
    // graph
    let svg = d3.select(el).append('svg').attr('width', w).attr('height', h)
    let g = svg.append('g').attr('transform', 'translate(0,' + 0 + ')')

    let series = g.selectAll('.series').data(data.orginlist).enter()
        .append('g').classed('series', true)
        .attr('opacity', (d, i) => {
          if (i === 0) return 1
          let reciprocal = data.orginlist.length - i
          if (reciprocal <= 4) return 1 - (4 - reciprocal) * 0.2
          else return 1
        })
        .attr('fill', (d, i) => i === 0 ? firstColor : colors[i])

    let rects = series.append('rect')
        .attr('width', d => x(+d.value) + 4)
        .attr('height', d => barW)
        .attr('y', (d, i) => i * barMarginTop + barPTop)
        .attr('x', barPLeft + margin.left)
        .on('mouseenter', function (d) {
          d3.select(this).attr('opacity', 0.9)
          tooltip.html(`
            <div style='display: flex'>
              <span>${d.name} (人)：</span>
              <div>
                <span style='display: flex;flex-direction: column'>${d3.format(',')(d.value + (d.unit ? d.unit : ''))}，</span>
                <span>占比 ${d3.format('.1%')(+d.ratio)}</span>
              </div>
            </div>
          `)
        })
        .on('mousemove', function () {
          tooltip.style('left', d3.event.layerX - 30 + 'px')
            .style('top', d3.event.layerY - 60 + 'px')
            .style('visibility', 'visible')
        })
        .on('mouseout', function () {
          d3.select(this).attr('opacity', 1)
          tooltip.style('visibility', 'hidden')
        })

    let nameLabels = g.selectAll('.name').data(data.orginlist).enter().append('text').classed('labels name', true)
        .attr('x', margin.left)
        .attr('y', (d, i) => i * barMarginTop + margin.top + barPTop)
        .append('tspan').text(function (d) { return d.name }).each(wrap)
    let ratioLabels = g.selectAll('.ratio').data(data.orginlist).enter().append('text').classed('labels ratio', true)
        .text(d => ((+d.ratio) * 100).toFixed(1) + '%')
        .attr('y', (d, i) => i * barMarginTop + margin.top + barPTop)
        .attr('x', 70 + margin.left)
    let title = d3.select(el).append('div').text(titleName).classed('title', true)
      .style('position', 'absolute').style('left', margin.left + barPLeft + 'px').style('top', margin.top + 'px')

    function wrap () {
      var self = d3.select(this),
        textLength = self.node().getComputedTextLength(),
        text = self.text()
      while (text.length > 5) {
        text = text.slice(0, -1)
        self.text(text + '...')
      }
    }
    this.resize = () => {
      let w = el.clientWidth
      if (!w) return
      svg.attr('width', w)
      x.range([0, w - barPLeft - margin.left - margin.right])
      rects.transition().attr('width', d => x(d.value) + 4)
    }
  }
}
