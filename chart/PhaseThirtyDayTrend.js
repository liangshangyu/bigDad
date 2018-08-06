import * as d3 from 'd3'
import BaseChart from './BaseChart'
import * as common from './commonChart'
import { transition } from 'd3-transition'
import { phaseGroupAnalysisData } from '../store/usr'

export default class PhaseTrend extends BaseChart {
  constructor (el, data) {
    super(el, data)
    this.op = {
      width: el.clientWidth,
      height: el.clientHeight,
      margin: {
        left: 60,
        right: 60,
        top: 60,
        bottom: 40
      },
      stacks: {
        width: 22,
        axisColor: '#abbdd2',
        selectBlockColor: '#cad5e3',
        selectColumnColor: 'rgba(104, 115, 127, 0.2)',
        almostSleepColor: '#75a9ed',
        activationSleepColor: '#afe1cc',
        percentColor: '#9eb0ff'
      },
      explain: {
        top: 0,
        right: 0,
        expArr: ['1', '2', '3'],
        colorArr: ['#f00', '#0f0', '#00f']
      },
      textStyle: {
        axisText: {
          color: '#929eaa'
        },
        selectText: {
          color: '#000'
        }
      }
    }
  }

  draw (option) {
    if (!this.data || this.data.length === 0) return
    // 数据格式为数组
    let op = this.op = Object.assign(this.op, option)
    let el = this.el,
      data = this.data
    let w = op.width,
      h = op.height || el.clientHeight,
      margin = op.margin,
      barW = op.stacks.width
    let activationSleepHeight = 30
    let almostSleepHeight = 140
    let percentHeight = 97

    let svg = d3.select(el).append('svg')
      .attr('width', w).attr('height', h)
    // 图例
    let expGroupWidth = common.genExpForPhaseTrend(svg, op)
    // 坐标轴
    let activationSleepList = data.map(val => +val.activationSleep)
    let activationSleepMax = d3.max(activationSleepList)
    let almostSleepList = data.map(val => +val.almostSleep)
    let almostSleepMax = d3.max(almostSleepList)
    let almostSleepMin = d3.min(almostSleepList)
    let almostSleepMaxIdx = almostSleepList.indexOf(almostSleepMax)
    let almostSleepMinIdx = almostSleepList.indexOf(almostSleepMin)
    if (almostSleepMaxIdx === almostSleepMinIdx) {
      almostSleepMinIdx = 0
      almostSleepMaxIdx = almostSleepList.length - 1
    }
    let percentList = data.map(val => +val.activationPercent.split('%')[0])
    let hundredPercentList = data.map(val => val.activationPercent)
    let percentMax = d3.max(percentList)
    let percentMin = d3.min(percentList)
    let dateList = data.map(val => val.date)
    let xScale = d3.scaleBand()
      .domain(data.map(val => val.date)).range([margin.left, w - margin.right])
      .paddingInner(1)
    let yScaleActivationSleep = d3.scaleLinear()
      .domain([0, activationSleepMax]).range([margin.top, margin.top + activationSleepHeight])
    let yScaleAlmostSleep = d3.scaleLinear()
      .domain([0, almostSleepMax]).range([h - margin.bottom, h - margin.bottom - almostSleepHeight])
    let yScalePercent = d3.scaleLinear()
      .domain([percentMin, percentMax]).range([h - margin.bottom - 20 - almostSleepHeight, margin.top + 20 + activationSleepHeight])
    let xAxis = d3.axisBottom(xScale)
      .tickValues(dateList.filter((val, idx) => idx % 5 === 0 || dateList.length - 1 === idx))
      .tickSize(6).tickPadding(10)
    let axisDom = svg.append('g').classed('x-axis', true).call(xAxis)
      .attr('transform', `translate(0, ${h - margin.bottom})`)
    axisDom.selectAll('line').attr('stroke', op.stacks.axisColor)
    axisDom.selectAll('path').attr('stroke', 'none')
    // 沉睡激活会员图
    let activationSleep = svg.append('g').classed('activation-sleep', true)
    activationSleep.selectAll('.stack').data(data).enter().append('rect')
      .classed('stack', true).attr('width', barW)
      .attr('height', d => yScaleActivationSleep(+d.activationSleep) - margin.top)
      .attr('x', d => xScale(d.date)).attr('y', margin.top)
      .attr('transform', `translate(${-barW / 2}, 0)`)
      .attr('fill', op.stacks.activationSleepColor)
    // 昨日即将沉睡会员图
    let almostSleep = svg.append('g').classed('almost-sleep', true)
    almostSleep.selectAll('.stack').data(data).enter().append('rect')
      .classed('stack', true).attr('width', barW)
      .attr('height', d => h - margin.bottom - yScaleAlmostSleep(+d.almostSleep))
      .attr('x', d => xScale(d.date)).attr('y', d => yScaleAlmostSleep(+d.almostSleep))
      .attr('transform', `translate(${-barW / 2}, 0)`)
      .attr('fill', op.stacks.almostSleepColor)
    // 渐变过渡器
    let defs = svg.append('defs')
    let linearGradient = defs.append('linearGradient')
      .attr('id', 'linearColor').attr('x1', '0%')
      .attr('y1', '0%').attr('x2', '0%').attr('y2', '100%')
    linearGradient.append('stop').attr('offset', '0%')
      .style('stop-color', op.stacks.percentColor)
    linearGradient.append('stop').attr('offset', '100%')
      .style('stop-color', '#fff')
    let area = d3.area().x((val, i) => xScale(dateList[i]))
      .y0(h - margin.bottom - 20 - almostSleepHeight)
      .y1((val, i) => yScalePercent(percentList[i]) + 1)
      .curve(d3.curveCardinal)
    let areaPath = svg.append('g').classed('bg', true).append('path')
      .classed('area-path', true)
      .attr('d', area(data))
      .attr('fill', `url(#${linearGradient.attr('id')})`)
      .attr('fill-opacity', '0.5')
    // 百分比曲线图
    let dotsList = data.map((val, i) => {
      return {
        x: xScale(dateList[i]),
        y: yScalePercent(percentList[i])
      }
    })
    let percentLine = d3.line().x(val => val.x).y(val => val.y)
      .curve(d3.curveCardinal)
    let percent = svg.append('path').classed('percent', true)
      .attr('d', percentLine(dotsList))
      .attr('fill', 'none')
      .attr('stroke', op.stacks.percentColor)
      .attr('stroke-width', 2)
    // 百分比曲线圆点
    this.drawDots = function (dotsList, radial, color) {
      this.selectAll('.dot').data(dotsList).enter().append('circle')
        .classed('dot', true).attr('cx', d => d.x)
        .attr('cy', d => d.y).attr('r', radial)
        .attr('stroke', color).attr('stroke-width', 2)
        .attr('fill', '#fff')
    }
    let percentDots = svg.append('g').classed('percent-dots', true)
    this.drawDots.call(percentDots.append('g'), dotsList, 5, '#fff')
    this.drawDots.call(percentDots.append('g'), dotsList, 4, op.stacks.percentColor)
    let innerDots = percentDots.selectAll('g').filter(':nth-of-type(2)')
      .selectAll('.dot')
    let outerDots = percentDots.selectAll('g').filter(':nth-of-type(1)')
    .selectAll('.dot')
    // tooltip
    let tooltip = d3.select(el).append('div')
      .classed('tooltip', true).style('opacity', 0)
    let tooltipCallback = i => {
      innerDots.attr('fill', '#fff')
        .filter(`:nth-of-type(${i + 1})`).attr('fill', op.stacks.percentColor)
      outerDots.attr('stroke', '#fff')
        .filter(`:nth-of-type(${i + 1})`).attr('stroke', op.stacks.percentColor)
      return `<span>${dateList[i]}</span><br>
        <span>${op.explain.expArr[0]}：${hundredPercentList[i]}</span><br>
        <span>${op.explain.expArr[1]}：${d3.format(',')(activationSleepList[i])}</span><br>
        <span>${op.explain.expArr[2]}：${d3.format(',')(almostSleepList[i])}</span><br>`
    }
    // cross Line
    let hoverLineGroup = common.crossLine(svg, el, op, tooltip, tooltipCallback, xScale, dateList, () => {
      innerDots.attr('fill', '#fff')
      outerDots.attr('stroke', '#fff')
    })
    svg.select('.line-x').style('opacity', 0)
    // 日期文本重合
    function dateCollapseCheck () {
      if (Math.abs(xScale(dateList[rulesBindData[0]]) - xScale(dateList[rulesBindData[1]])) < 70) {
        let texts1 = rules.selectAll('g').filter(':nth-of-type(1)').select('text')
        let texts2 = rules.selectAll('g').filter(':nth-of-type(2)').select('text')
        if (+texts1.attr('x') < +texts2.attr('x')) {
          texts1.attr('text-anchor', 'end').attr('dx', 10)
          texts2.attr('text-anchor', 'start').attr('dx', -10)
        } else {
          texts1.attr('text-anchor', 'start').attr('dx', -10)
          texts2.attr('text-anchor', 'end').attr('dx', 10)
        }
      } else {
        rules.selectAll('g').selectAll('text').attr('text-anchor', 'middle').attr('dx', 0)
      }
    }
    // 游标卡尺
    let getRuleBlockWidth = () => {
      let ruleBlockWidth = xScale(dateList[1]) - xScale(dateList[0]) - 2
      ruleBlockWidth = ruleBlockWidth > 35 ? 35 : ruleBlockWidth
      return ruleBlockWidth
    }
    let getIdx = posX => {
      let index = 0
      dateList.forEach((val, idx) => {
        if (Math.abs(xScale(val) - posX) <= (xScale(dateList[1]) - xScale(dateList[0])) / 2) {
          index = idx
        }
      })
      return index
    }
    let rules = svg.append('g').classed('rule', true)
    let rulesBindData = [almostSleepMinIdx, almostSleepMaxIdx]
    rules.selectAll('g').data(rulesBindData)
      .enter().append('g').each(function (d, i) {
        let thisSel = d3.select(this)
        let mouseDownPos = []
        thisSel.append('rect').attr('y', op.margin.top - 12)
          .attr('height', 10).attr('fill', op.stacks.selectBlockColor)
        thisSel.append('rect').attr('y', h - op.margin.bottom + 2)
          .attr('height', 10).attr('fill', op.stacks.selectBlockColor)
        thisSel.append('rect').attr('y', op.margin.top - 2)
          .attr('height', h - op.margin.top - op.margin.bottom + 4)
          .attr('fill', op.stacks.selectColumnColor)
          // .attr('fill', 'rgba(255, 0, 0, 0.5)')
        thisSel.append('text').text(dateList[d])
          .attr('x', xScale(dateList[d]))
          .attr('y', op.margin.top - 12 - 10)
          .attr('text-anchor', 'middle')
        svg.on('dragstart.drag', function () {
          d3.event.preventDefault()
          d3.event.stopImmediatePropagation()
        }, true)
        thisSel.selectAll('rect').attr('x', xScale(dateList[d]) - getRuleBlockWidth() / 2)
          .attr('width', getRuleBlockWidth())
          .on('mousedown', function () {
            mouseDownPos = d3.mouse(this)
            svg.on('mouseup.rule', null)
            svg.on('mouseleave.rule', null)
            svg.on('mousemove.rule', function () {
              if (mouseDownPos.length === 0) return
              let tempX = xScale(dateList[thisSel.datum()]) - getRuleBlockWidth() / 2 +
                d3.mouse(this)[0] - mouseDownPos[0]
              if (rulesBindData[i] > rulesBindData[1 - i]) {
                if (tempX > xScale(dateList[dateList.length - 1]) - getRuleBlockWidth() / 2) {
                  tempX = xScale(dateList[dateList.length - 1]) - getRuleBlockWidth() / 2
                } else if (tempX < xScale(dateList[rulesBindData[1 - i] + 1]) - getRuleBlockWidth() / 2) {
                  tempX = xScale(dateList[rulesBindData[1 - i] + 1]) - getRuleBlockWidth() / 2
                }
              } else {
                if (tempX < xScale(dateList[0]) - getRuleBlockWidth() / 2) {
                  tempX = xScale(dateList[0]) - getRuleBlockWidth() / 2
                } else if (tempX > xScale(dateList[rulesBindData[1 - i] - 1]) - getRuleBlockWidth() / 2) {
                  tempX = xScale(dateList[rulesBindData[1 - i] - 1]) - getRuleBlockWidth() / 2
                }
              }
              thisSel.selectAll('rect').attr('x', tempX)
              thisSel.select('text').attr('x', tempX + getRuleBlockWidth() / 2)
                .text(dateList[getIdx(tempX + getRuleBlockWidth() / 2)])
            }).on('mouseup.rule mouseleave.rule', () => {
              svg.on('mousemove.rule', null)
              mouseDownPos = []
              rulesBindData[i] = getIdx(+thisSel.select('rect').attr('x') + getRuleBlockWidth() / 2)
              thisSel.selectAll('rect')
                .attr('x', xScale(dateList[rulesBindData[i]]) - getRuleBlockWidth() / 2)
              thisSel.select('text')
                .attr('x', xScale(dateList[rulesBindData[i]]))
                .text(dateList[rulesBindData[i]])
              thisSel.datum(rulesBindData[i])
              dateCollapseCheck()
              let compareData = phaseGroupAnalysisData.phase.almostSleep.compareData
              let tempCompareData = [dateList[d3.min(rulesBindData)], dateList[d3.max(rulesBindData)]]
              if (compareData[0] !== tempCompareData[0] || compareData[1] !== tempCompareData[1]) {
                phaseGroupAnalysisData.phase.almostSleep.compareData = tempCompareData
              }
            })
          })
      })
    dateCollapseCheck()
    // 自适应
    this.resize = () => {
      w = el.clientWidth
      if (!w) return
      // svg自适应
      svg.attr('width', w)
      // 坐标轴、比例尺自适应
      xScale.range([margin.left, w - margin.right])
      xAxis.scale(xScale)
      axisDom.transition().call(xAxis)
      // 图形元素自适应
      svg.selectAll('.stack').transition()
        .attr('x', d => xScale(d.date))
      dotsList.forEach((val, i) => val.x = xScale(dateList[i]))
      percent.transition().attr('d', percentLine(dotsList))
      percentDots.selectAll('.dot').transition().attr('cx', d => d.x)
      area.x((val, i) => xScale(dateList[i]))
      areaPath.transition().attr('d', area(data))
      // 图例自适应
      svg.select('.explain').transition()
        .attr('transform', `translate(${w - expGroupWidth - op.explain.right},${op.explain.top})`)
      // crossLine 自适应
      hoverLineGroup.select('.line-x')
        .transition().attr('x2', w - op.margin.right + op.stacks.width / 2)
      // 游标卡尺自适应
      rules.selectAll('rect').attr('width', getRuleBlockWidth())
      rules.selectAll('g').each(function (d) {
        d3.select(this).selectAll('rect').transition()
          .attr('x', xScale(dateList[d]) - getRuleBlockWidth() / 2)
        d3.select(this).select('text').transition()
          .attr('x', xScale(dateList[d]))
      })
      // 日期重合验证
      dateCollapseCheck()
    }
  }
}
