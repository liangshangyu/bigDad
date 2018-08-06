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
      lineStyle: {
        color: '#000',
        curveType: 'curveCardinal',
        curveLineHeight: 200
      }
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
      lineStyle = op.lineStyle

    let svg = d3.select(el)
      .append('svg')
      .attr('width', w)
      .attr('height', h)

    let dateList = data.map(val => new Date(val.key))
    let dateStrList = data.map(val => val.key)
    let yDatesetList = data.map(val => +val.value)
    let yMax = d3.max(yDatesetList)
    let yMaxIdx = yDatesetList.indexOf(yMax)
    let percentList = data.map(val => val.percentage)
    let xScale = d3.scaleTime()
      .domain([dateList[0], dateList[dateList.length - 1]])
      .range([margin.left, w - margin.right])
    let yScale = d3.scaleLinear()
      .domain([0, yMax])
      .range([h - margin.bottom, h - margin.bottom - lineStyle.curveLineHeight])
    // axis
    let tickValues = [dateList[0], dateList[dateList.length - 1]]
    // if (yMaxIdx > 0 && yMaxIdx < dateList.length - 1) {
    //   tickValues.splice(1, 0, dateList[yMaxIdx])
    // }
    let xAxis = d3.axisBottom(xScale)
      .tickValues(tickValues)
      .tickSize(6).tickPadding(30)
      .tickFormat(d3.timeFormat('%Y-%m-%d'))
    let axisDom = svg.append('g').classed('x-axis', true).call(xAxis)
      .attr('transform', `translate(0, ${h - margin.bottom})`)
    axisDom.selectAll('line').attr('stroke', 'none')
    axisDom.selectAll('path').attr('stroke', 'none')
    // 渐变过渡器
    let defs = svg.append('defs')
    let linearGradient = defs.append('linearGradient')
      .attr('id', 'linearColor').attr('x1', '0%')
      .attr('y1', '0%').attr('x2', '0%').attr('y2', '100%')
    linearGradient.append('stop').attr('offset', '0%')
      .style('stop-color', lineStyle.color)
    linearGradient.append('stop').attr('offset', '100%')
      .style('stop-color', '#fff')
    // area shadow
    let area = d3.area().x((val, i) => xScale(dateList[i]))
      .y0(h - margin.bottom).y1((val, i) => yScale(yDatesetList[i]) + 1)
      .curve(d3[lineStyle.curveType])
    let areaPath = svg.append('g').classed('bg', true)
      .append('path').classed('area-path', true)
      .attr('d', area(data))
      .attr('fill', `url(#${linearGradient.attr('id')})`)
      .attr('fill-opacity', '0.5')
    // curve line
    let line = d3.line().x((val, i) => xScale(dateList[i]))
      .y((val, i) => yScale(yDatesetList[i]))
      .curve(d3[lineStyle.curveType])
    let curvePath = svg.append('path').classed('curve-path', true)
      .attr('d', line(data))
      .attr('stroke', lineStyle.color)
      .attr('fill', 'none')
      .attr('stroke-width', 2)
    // tooltip
    let tooltip = d3.select(el).append('div')
      .classed('tooltip', true)
    let tooltipCallback = i => {
      this.showDots(i)
      return `
        <span>${dateStrList[i]}~${d3.timeFormat('%Y-%m-%d')(new Date(dateList[i].getTime() + 4 * 24 * 60 * 60 * 1000))}：</span><br />
        <span>共${d3.format(',')(yDatesetList[i])}人，占比 ${percentList[i]}</span>
      `
    }
    // 曲线圆点
    let hoverLineGroup = svg.append('g').classed('hover-line', true)
    let dotsList = data.map((val, i) => {
      return {
        x: xScale(dateList[i]),
        y: yScale(yDatesetList[i])
      }
    })
    this.drawDots = function (dotsList, radial, color) {
      this.selectAll('.dot').data(dotsList).enter().append('circle')
        .classed('dot', true).attr('cx', d => d.x)
        .attr('cy', d => d.y).attr('r', radial)
        .attr('stroke', color).attr('stroke-width', 2)
        .attr('fill', '#fff')
    }
    let lineDots = svg.append('g').classed('line-dots', true)
    this.showDots = function (i) {
      lineDots.selectAll('g').remove()
      this.drawDots.call(lineDots.append('g'), [dotsList[i]], 5, '#fff')
      this.drawDots.call(lineDots.append('g'), [dotsList[i]], 4, lineStyle.color)
      lineDots.append('g').append('text').datum(dateList[i])
        .text(d3.format(',')(yDatesetList[i]))
        .attr('x', xScale(dateList[i]))
        .attr('y', op.margin.top - 15)
        .attr('text-anchor', 'middle')
        .style('fill', '#73808f')
    }
    this.showDots(yMaxIdx)
    // cross Line
    common.hoverYLine(svg, el, op, tooltip, tooltipCallback, xScale, dateList, () => {
      lineDots.selectAll('g').remove()
    }, yMaxIdx)
    // year sperate line
    this.getYear = function (date) {
      return date.split('-')[0]
    }
    let yearSperateLine = svg.append('g').classed('year-sperate-line', true)
    if (this.getYear(dateStrList[0]) !== this.getYear(dateStrList[dateStrList.length - 1])) {
      let posX = xScale(new Date(this.getYear(dateStrList[dateStrList.length - 1]) + '-01-01'))
      yearSperateLine.append('line')
        .attr('x1', posX)
        .attr('x2', posX)
        .attr('y1', margin.top)
        .attr('y2', h - margin.bottom)
        .attr('stroke-dasharray', '4, 4')
        .attr('stroke', '#999')
      yearSperateLine.append('text')
        .text(this.getYear(dateStrList[dateStrList.length - 1]) + '年')
        .attr('x', posX)
        .attr('y', h - margin.bottom)
        .attr('dy', 20)
        .attr('text-anchor', 'middle')
        .style('fill', '#73808f')
    }
    // 自适应
    this.resize = function () {
      w = el.clientWidth
      if (!w) return
      svg.attr('width', w)
      // 比例尺、坐标轴自适应
      xScale.range([margin.left, w - margin.right])
      xAxis.scale(xScale)
      axisDom.transition().call(xAxis)
      // 背景色、curveLine元素自适应
      area.x((val, i) => xScale(dateList[i]))
      areaPath.transition().attr('d', area(data))
      line.x((val, i) => xScale(dateList[i]))
      curvePath.transition().attr('d', line(data))
      // 数据点自适应
      dotsList.forEach((val, i) => val.x = xScale(dateList[i]))
      lineDots.selectAll('.dot').transition().attr('cx', d => d.x)
      lineDots.selectAll('text').transition().attr('x', d => xScale(d))
      // 年度分割线自适应
      if (this.getYear(dateStrList[0]) !== this.getYear(dateStrList[dateStrList.length - 1])) {
        let posX = xScale(new Date(this.getYear(dateStrList[dateStrList.length - 1]) + '-01-01'))
        yearSperateLine.select('line').transition()
          .attr('x1', posX)
          .attr('x2', posX)
        yearSperateLine.select('text').transition()
          .attr('x', posX)
      }
      // hoverLine自适应
      hoverLineGroup.select('.line-y')
        .transition().attr('x1', d => xScale(dateList[d]))
        .attr('x2', d => xScale(dateList[d]))
      // tooltip自适应
      let tooltipX = xScale(dateList[tooltip.datum()])
      if (tooltipX + 20 + tooltip.node().clientWidth > w) {
        tooltip.transition().style('left', tooltipX - tooltip.node().clientWidth - 20 + 'px')
      } else {
        tooltip.transition().style('left', tooltipX + 20 + 'px')
      }
    }
  }
}
