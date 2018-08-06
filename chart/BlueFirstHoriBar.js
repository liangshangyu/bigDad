import * as d3 from 'd3'
import BaseChart from './BaseChart'

export default class Bar extends BaseChart {
  constructor (el, data) {
    super(el, data)
    this.op = {
      color: '#67c79f',
      firstColor: '#51a5de',
      width: el.clientWidth,   // 减10防止出现滚动条
      height: el.clientHeight,
      barWid: 22,
      barPLeft: 120,
      // 第一个柱状图离svg顶部的距离
      barPTop: 40,
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
    if (!this.data || !this.data.aggr) return
    // if (option.width === 0 || option.width === '0') delete option.width
    let op = this.op = Object.assign(this.op, option)
    let el = this.el,
      data = this.data
    let w = el.clientWidth,
      h = 400
    let barPLeft = op.barPLeft,
      barPTop = op.barPTop,
      barP = op.barPadding,
      margin = op.margin,
      barW = op.barWid,
      color = op.color,
      firstColor = op.firstColor,
      ratioLeft = op.ratioLeft,
      titleName = op.title
    let max = d3.max(data.aggr.map(i => parseInt(i.value)))
    let x = d3.scaleLinear().domain([0, max]).range([0, w - barPLeft - margin.left - margin.right])
    let y = d3.scalePoint().domain(data.aggr.map(i => i.name)).range([0, h - 30 - barPTop]).padding(0.2)

    // tooltip
    let tooltip = d3.select(el).append('div').classed('tooltip arrow-box-bottom', true).style('visibility', 'hidden')

    // graph
    let svg = d3.select(el).append('svg').attr('width', w).attr('height', h)
    let g = svg.append('g').attr('transform', 'translate(0,' + 0 + ')')

    let series = g.selectAll('.series').data(data.aggr).enter()
        .append('g').classed('series', true)
        .attr('fill', (d, i) => i === 0 ? firstColor : color)
        .attr('opacity', (d, i) => {
          if (i === 0) return 1
          let reciprocal = data.aggr.length - i
          if (reciprocal <= 4) return 1 - (4 - reciprocal) * 0.2
          else return 1
        })

    let rects = series.append('rect')
        .attr('width', d => x(+d.value) + 4)
        .attr('height', d => barW)
        .attr('y', d => y(d.name) + barPTop)
        .attr('x', barPLeft + margin.left)
        .on('mouseenter', function (d) {
          d3.select(this).attr('opacity', 0.9)
          tooltip.html(`
            <div style='display: flex'>
              <span>${d.name}：</span>
              <div>
                <span style='display: flex;flex-direction: column'>${d3.format(',')(d.value + (d.unit ? d.unit : ''))}，</span>
                <span>占比 ${d3.format('.1%')(+d.ratio)}</span>
              </div>
            </div>
          `)
        })
        .on('mousemove', function (d) {
          if (window.innerWidth - d3.event.clientX < tooltip.node().clientWidth + 30) {
            tooltip.style('right', el.clientWidth - d3.event.layerX - 35 + 'px')
                  .style('left', 'auto')
                  .classed('tooltip-place-right-arrow', true)
                  .style('top', d3.event.layerY - 60 + 'px')
                  .classed('arrow-box', false)
                  .style('visibility', 'visible')
          } else {
            tooltip.style('left', d3.event.layerX - 30 + 'px')
                    .style('right', 'auto')
                    .style('top', d3.event.layerY - 60 + 'px')
                    .classed('arrow-box', true)
                    .classed('tooltip-place-right-arrow', false)
                    .style('visibility', 'visible')
          }
        })
        .on('mouseout', function () {
          d3.select(this).attr('opacity', 1)
          tooltip.style('visibility', 'hidden')
        })

    let nameLabels = g.selectAll('.name').data(data.aggr).enter().append('text').classed('labels name', true)
        .attr('x', margin.left)
        .attr('y', d => y(d.name) + margin.top + barPTop)
        .append('tspan').text(function (d) { return d.name }).each(wrap)

    let ratioLabels = g.selectAll('.ratio').data(data.aggr).enter().append('text').classed('labels ratio', true)
        .text(d => ((+d.ratio) * 100).toFixed(1) + '%')
        .attr('y', d => y(d.name) + margin.top + barPTop)
        .attr('x', 70 + margin.left)
    let title = d3.select(el).append('div').text(d3.format(',')(data.count)).classed('title', true)
      .style('position', 'absolute').style('left', margin.left + barPLeft + 'px').style('top', margin.top + 'px')
      .style('font-size', '16px').append('span').text('人').style('font-size', '12px').style('margin-left', '3px')

    // div show loooooog y axias labels
    var div = d3.select(el)
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)

    function wrap () {
      var self = d3.select(this),
        textLength = self.node().getComputedTextLength(),
        text = self.text()

      while (textLength > 70 && text.length > 0) {
        text = text.slice(0, -1)
        self.text(text + '...')
          .call(bindTooltip)
        textLength = self.node().getComputedTextLength()
      }
    }

    function bindTooltip (el) {
      el
        .on('mouseenter', function (d, i) {
          div.transition().duration(200).style('opacity', 1)
          div
            .html(d.name)
            .style('top', y(d.name) + margin.top + 10 + barPTop + 'px')
            .style('left', margin.left - 5 + 'px')
        })
        .on('mouseout', function (d) {
          div.transition().duration(200).style('opacity', 0)
        })
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
