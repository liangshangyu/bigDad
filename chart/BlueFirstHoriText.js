import * as d3 from 'd3'
import BaseChart from './BaseChart'

export default class Bar extends BaseChart {
  constructor (el, data) {
    super(el, data)
    this.op = {
      color: '#2ccab9',
      firstColor: '#8cc4e9',
      circlesColor: '#cfdae5',
      width: el.clientWidth,   // 减10防止出现滚动条
      height: el.clientHeight,
      barPLeft: 120,
      circleRight: 40,
      // 第一个text离svg顶部的距离
      barPTop: 60,
      barMarginTop: 40, // bar上下间距
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
      h = op.height * 40 + 80 || el.clientHeight,
      staticW = op.width
    let barPLeft = op.barPLeft,
      barPTop = op.barPTop,
      circleRight = op.circleRight,
      barP = op.barPadding,
      barMarginTop = op.barMarginTop,
      margin = op.margin,
      color = op.color,
      firstColor = op.firstColor,
      circlesColor = op.circlesColor,
      ratioLeft = op.ratioLeft,
      titleName = op.title,
      arrowLeft = w - 180,
      toolRight = w - 360
    let max = d3.max(data.orginlist.map(i => parseInt(i.value)))
    let x = d3.scaleLinear().domain([0, max]).range([0, w - barPLeft - margin.left - margin.right])
    // let y = d3.scalePoint().domain(data.orginlist.map(i => i.code)).range([0, h - 30 - barPTop]).padding(0.2)
    let circleText = d3.range(1, 21).map((i) => numAddZero(i))
    // graph
    if (el.parentNode.querySelector('.tooltip')) {
      el.parentNode.removeChild(el.parentNode.querySelector('.tooltip'))
    }
    let tooltip = d3.select(el.parentNode).append('div').style('visibility', 'hidden').classed('tooltip tooltip-place-right-arrow', true)
    let svg = d3.select(el).append('svg').attr('width', w).attr('height', h)
    let g = svg.append('g').attr('transform', 'translate(0,' + 0 + ')')
    let series = g.selectAll('.series').data(data.orginlist).enter()
        .append('g').classed('series', true).attr('width', 400)
    let circles = series.append('circle')
        .attr('r', 10)
        .attr('cx', margin.left)
        .attr('cy', (d, i) => i * barMarginTop + 10 + barPTop)
        .attr('fill', (d, i) => i === 0 ? firstColor : circlesColor)
        // .attr('cy', d => y(d.name) + barPTop + 10)
        // .attr('cx', barPLeft + margin.left)
    let circlesText = series.append('text')
        .attr('x', margin.left)
        .attr('y', (d, i) => i * barMarginTop + 14 + barPTop)
        .text((d, i) => circleText[i])
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .classed('circleText', true)
    let circle1, circle2, line1, line2, arrowLine
    let wrapTextLenth = w - 170
    let clickFlag = []
    let nameLabels = series.append('text').classed('labels name', true)
        // .attr('x', margin.left)
        // .attr('y', d => y(d.name) + margin.top + barPTop)
        .attr('y', (d, i) => i * barMarginTop + barPTop + 14)
        .attr('x', barPLeft + margin.left - 40)
        .append('tspan').text(function (d) { return d.name }).each(function (d, i) {
          wrap.call(this, d.name)
        })
        .attr('title', function (d) { return d.name })
        .style('cursor', 'pointer')
        .attr('fill', (d, i) => i === 0 ? firstColor : color)
        .each(function (d, i) {
          let g1 = d3.select(this.parentNode.parentNode).append('g')
            .classed('right-arrow', true).style('opacity', 0)
          let arc = d3.arc().innerRadius(8).outerRadius(10).startAngle(0).endAngle(2 * Math.PI)
          g1.append('path').classed('arrow-circle', true).attr('d', arc()).attr('transform',
            `translate(${barPLeft + margin.left + arrowLeft},${i * barMarginTop + barPTop + 10})`)
            .attr('fill', firstColor)
          arrowLine = d3.line().x(d => d.x).y(d => d.y)
          g1.append('path').classed('arrow-line', true).attr('d', arrowLine(getArrowPoints(i))).attr('stroke', firstColor)
            .attr('stroke-width', '2px').attr('fill', 'transparent')
        })
    let ratioLabels = series.append('text').classed('labels ratio', true)
        .text(d => ((+d.ratio) * 100).toFixed(1) + '%')
        .attr('y', (d, i) => i * barMarginTop + 14 + barPTop)
        .attr('x', 20 + margin.left)
    let title = d3.select(el).append('div').text(titleName).classed('title', true)
        .style('position', 'absolute').style('left', barPLeft + 'px').style('top', margin.top + 'px')
    let rects = series.append('rect').attr('width', 400).attr('height', 20).attr('opacity', 0)
        .attr('y', (d, i) => i * barMarginTop + barPTop)
        .attr('x', barPLeft + margin.left - 40)
        .on('mouseenter', function (d, i) {
          tooltip.html(`
            <div style='display: flex'>
              <span>${d.name} (人)：</span>
              <div>
                <span style='display: flex;flex-direction: column'>${d3.format(',')(d.value + (d.unit ? d.unit : ''))}，</span>
                <span>占比 ${d3.format('.1%')(+d.ratio)}</span>
              </div>
            </div>
          `)
          d3.select(this).style('cursor', 'pointer')
          d3.select(this.parentNode).select('.right-arrow').style('opacity', 1)
          d3.select(this.parentNode.parentNode).selectAll('tspan')
              .attr('fill', () => color)
          d3.select(this.parentNode).select('tspan').attr('fill', firstColor)
        })
        .on('mouseout', function () {
          d3.select(this.parentNode).select('.right-arrow').style('opacity', 0)
          tooltip.style('visibility', 'hidden')
          d3.select(this.parentNode).select('tspan').attr('fill', color)
        })
        .on('click', function (d, i) {
          setTimeout(() => {
            d3.select(this.parentNode).select('tspan')
              .attr('fill', firstColor)
          }, 0)
          window.open(`https://product.suning.com/${d.code}.html`)
          clickFlag[i] = true
        })
        .on('mousemove', function () {
          tooltip.style('right', el.clientWidth - d3.event.layerX - 35 + 'px')
                  .style('top', d3.event.layerY - 60 + 'px')
                  .style('visibility', 'visible')
        })
    function numAddZero (num) {
      return num < 10 ? '0' + num : num
    }
    function wrap (txt) {
      var self = d3.select(this)
      self.text(txt)
      var textLength = self.node().getComputedTextLength(),
        text = txt
      while (textLength > wrapTextLenth && text.length > 0) {
        text = text.slice(0, -1)
        self.text(text + '...')
        textLength = self.node().getComputedTextLength()
      }
    }
    function getArrowPoints (i) {
      return [{
        x: barPLeft + margin.left + arrowLeft - 3,
        y: i * barMarginTop + barPTop + 6
      }, {
        x: barPLeft + margin.left + arrowLeft + 3,
        y: i * barMarginTop + barPTop + 10
      }, {
        x: barPLeft + margin.left + arrowLeft - 3,
        y: i * barMarginTop + barPTop + 14
      }]
    }
    this.resize = () => {
      let w = el.clientWidth
      svg.attr('width', w)
      arrowLeft = w - 180
      wrapTextLenth = w - 170
      series.select('.right-arrow').each(function (d, i) {
        let _this = d3.select(this)
        _this.select('.arrow-circle').attr('transform',
          `translate(${barPLeft + margin.left + arrowLeft},${i * barMarginTop + barPTop + 10})`)
        _this.select('.arrow-line').attr('d', arrowLine(getArrowPoints(i)))
      })
      series.each(function (d, i) {
        wrap.call(d3.select(this).select('tspan').node(), d.name)
      })
    }
  }
}
