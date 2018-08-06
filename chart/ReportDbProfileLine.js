import * as d3 from 'd3'
import BaseChart from './BaseChart'
import {
  BASE_PROFILE_LINE_1,
  BASE_PROFILE_LINE_2,
  BASE_PROFILE_AREA_1,
  BASE_PROFILE_AREA_2
} from '../store/report/base'

export default class ReportDbProfileLine extends BaseChart {
  constructor (el, data) {
    super(el, data)
    this.op = {
      width: el.clientWidth,
      height: el.clientHeight,
      colorArr: [BASE_PROFILE_LINE_1, BASE_PROFILE_LINE_2, BASE_PROFILE_AREA_1, BASE_PROFILE_AREA_2]
    }
  }

  draw (option) {
    if (!this.data || !this.data.dataset || this.data.dataset.length === 0) return
    let op = this.op = Object.assign(this.op, option)
    let el = this.el,
      data = this.data
    let margin = op.margin,
      w = op.width,
      h = op.height,
      colorArr = op.colorArr,
      explain = op.explain
    let profileLine1Height = 250
    let profileLine2Height = 120
    let radial = [8, 5, 4]
    let yDataset1 = data.dataset.map(val => +val.value1)
    let yDataset2 = data.dataset.map(val => +val.value2)
    let xDataset = data.dataset.map(val => val.key)
    let yDataset1Max = d3.max(yDataset1)
    let yDataset2Max = d3.max(yDataset2)

    // 坐标轴和比例尺
    let svg = d3.select(el).append('svg').attr('width', w).attr('height', h)
    let xScale = d3.scaleBand().domain(xDataset)
      .range([margin.left, w - margin.right])
      .paddingInner(1)
    let yScale1 = d3.scaleLinear().domain([0, yDataset1Max])
      .range([h - margin.bottom, h - margin.bottom - profileLine1Height])
    let yScale2 = d3.scaleLinear().domain([0, yDataset2Max])
      .range([h - margin.bottom, h - margin.bottom - profileLine2Height])
    let xAxis = d3.axisBottom().scale(xScale)
    let xAxisDom = svg.append('g').classed('x-axis', true)
      .attr('transform', `translate(0, ${h - margin.bottom})`).call(xAxis)
    xAxisDom.selectAll('text').attr('opacity', 0)
    xAxisDom.selectAll('line').attr('opacity', 0)

    // 折线图
    this.drawProfileLine = (yDataset, yScale, colorArr) => {
      let line = d3.line().x((val, idx) => xScale(xDataset[idx]))
        .y((val, idx) => yScale(yDataset[idx]))
      svg.append('path').classed('db-profile-line', true).attr('d', line(xDataset))
        .attr('fill', 'none').attr('stroke', colorArr[0])
        .attr('stroke-width', 3)
      this.drawArea(yDataset, yScale, colorArr[1])
      this.drawDot(yDataset, yScale, colorArr, svg.append('g').classed('db-profile-line-dots', true))
    }
    // 点
    this.drawDot = (yDataset, yScale, colorArr, wrapper) => {
      this.drawSingleDot(yDataset, yScale, radial[0], {'opacity': 0.2, 'fill': colorArr[0]}, wrapper)
      this.drawSingleDot(yDataset, yScale, radial[1], {'fill': '#fff'}, wrapper)
      this.drawSingleDot(yDataset, yScale, radial[2], {'fill': colorArr[0]}, wrapper)
    }
    this.drawSingleDot = (yDataset, yScale, r, attr, wrapper) => {
      yDataset.forEach((val, idx) => {
        let dot = wrapper.append('circle').attr('cx', xScale(xDataset[idx]))
          .attr('cy', yScale(yDataset[idx])).attr('r', r)
        for (let k in attr) {
          dot.attr(`${k}`, attr[k])
        }
      })
    }
    // 面积图
    this.drawArea = (yDataset, yScale, color) => {
      let area = d3.area().x0((val, idx) => xScale(xDataset[idx]))
        .y0(() => h - margin.bottom).y1((val, idx) => yScale(yDataset[idx]))
      svg.append('path').classed('db-profile-line-area', true)
        .attr('d', area(yDataset)).attr('fill', color)
    }
    this.drawProfileLine(yDataset1, yScale1, [colorArr[0], colorArr[2]])
    this.drawProfileLine(yDataset2, yScale2, [colorArr[1], colorArr[3]])
    // 图例
    this.genExplain = () => {
      let expStartX = 0, expStartY = 0
      let expGroup = svg.append('g').classed('explain', true)
      let _this = this
      expGroup.selectAll('g').data(explain.expArr)
        .enter().append('g')
        .classed('cursor-pointer', true)
        .each(function (d, i) {
          let startX = 0
          let thisSel = d3.select(this)
          thisSel.append('line')
            .attr('x1', startX)
            .attr('y1', expStartY)
            .attr('x2', startX += 70)
            .attr('y2', expStartY)
            .attr('stroke', colorArr[i])
            .attr('stroke-width', 2)
          startX += 15
          thisSel.append('text')
            .text(explain.expArr[i])
            .attr('transform', `translate(${startX}, ${expStartY})`)
            .attr('dy', 6)
          _this.drawDot([yDataset1[0]], yScale1, [colorArr[i === 0 ? 0 : 1]], thisSel)
          thisSel.selectAll('circle').attr('cx', 35).attr('cy', expStartY)
          expStartY += 30
          startX += explain.expArr[i].length * 12 + 2
          if (startX > expStartX) expStartX = startX
        })
      // 饼图start
      let tempArr = [data.conversion && data.conversion.split('%')[0] / 100 || 0]
      tempArr[1] = 1 - tempArr[0]
      let pieColor = ['#F5A623', colorArr[2]]
      let pie = d3.pie().startAngle(0).endAngle(2 * Math.PI)
      let arc = d3.arc().innerRadius(0).outerRadius(10)
      let areaG = expGroup.append('g').classed('cursor-pointer', true)
        .attr('transform', `translate(${expStartX}, ${expStartY})`)
      let temp = areaG.append('text')
        .text(`本${data.period.indexOf('月') === -1 ? '周（' : '月（'}${data.period}）转化率${data.conversion}`)
        .attr('text-anchor', 'end')
        .attr('x', 0).attr('y', 0).attr('dy', 6)
      areaG.selectAll('path').data(pie(tempArr))
        .enter().append('path').attr('d', d => arc(d))
        .attr('fill', (d, idx) => pieColor[idx])
        .attr('transform', `translate(${-temp.text().length * 12 + 15}, 0)`)
      // 饼图end
      let transX = explain.left !== undefined ? explain.left
        : w - expStartX - explain.right
      let transY = explain.top !== undefined ? explain.top
        : h - explain.bottom - expStartY
      expGroup.attr('transform', `translate(${transX},${transY})`)
    }
    this.genExplain()

    // 其它文本
    svg.append('text').text(data.period.indexOf('月') !== -1 ? '近6月走势' : '近8周走势')
      .attr('transform', `translate(${margin.left}, ${h - margin.bottom - profileLine1Height - 30})`)
    let len = xDataset.length - 1
    svg.append('text').text(`${data.period}`)
      .attr('text-anchor', 'end')
      .attr('x', xScale(xDataset[len]))
      .attr('y', yScale1(yDataset1[len]) - 20)
    svg.selectAll('text').style('fill', '#333')
  }
}
