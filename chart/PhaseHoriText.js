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
      barPLeft: 80,
      barMarginTop: 40, // bar上下间距
      margin: {
        top: 15,
        left: 40,
        right: 40,
        bottom: 35
      }
    }
  }

  draw (option) {
    if (!this.data || this.data.length === 0) return
    if (option.width === 0 || option.width === '0') delete option.width
    let op = this.op = Object.assign(this.op, option)
    let el = this.el,
      data = this.data
    let w = op.width,
      h = this.data.length * 40 < 100 ? 100 : this.data.length * 40,
      margin = op.margin
    let wrapTextLenth = w - margin.left - margin.right - op.barPLeft - 60
    // data数据本地化
    let percentList = data.map(val => val.percentage)
    let dataset = data.map(val => +val.value)
    let descriptionList = data.map(val => val.key)
    let codeList = data.map(val => val.code)
    // tooltip
    let tooltip = d3.select(el).append('div')
      .style('visibility', 'hidden')
      .classed('tooltip arrow-box-bottom', true)
    function tooltipCallback (i) {
      tooltip.html(`
        <div style='display: flex'>
          <span>${descriptionList[i]}：</span>
          <div>
            <span style='display: flex;flex-direction: column'>
              ${d3.format(',')(dataset[i])}人，
            </span>
            <span>占比 ${percentList[i]}</span>
          </div>
        </div>
      `)
    }
    // svg元素
    let svg = d3.select(el).append('svg')
      .attr('width', w).attr('height', h)
    // data series
    let series = svg.selectAll('.series').data(data).enter()
      .append('g').classed('series', true)
      .each(function (d, i) {
        let thisSel = d3.select(this)
        // 序号
        let posY = i * op.barMarginTop + 10 + margin.top
        let posX = w - margin.right - 10
        let order = thisSel.append('g').classed('order', true)
        order.append('circle')
          .attr('r', 10).attr('cx', margin.left)
          .attr('cy', posY)
          .attr('fill', i === 0 ? op.firstColor : op.circlesColor)
        order.append('text')
          .attr('x', margin.left)
          .attr('y', posY)
          .attr('dy', 4)
          .text(numAddZero(i + 1))
          .attr('text-anchor', 'middle')
          .style('fill', '#fff')
          .classed('circleText', true)
        // 百分比
        thisSel.append('text').classed('radio-label', true).text(percentList[i])
          .attr('y', posY)
          .attr('dy', 4)
          .attr('x', 20 + margin.left)
        // 跳转链接标题
        let link = thisSel.append('text').classed('description-link', true)
          .attr('y', posY)
          .attr('dy', 4)
          .attr('x', margin.left + op.barPLeft)
          .text(descriptionList[i])
          .style('cursor', 'pointer')
          .style('fill', i === 0 ? op.firstColor : op.color)
        wrap.call(link, descriptionList[i])
        // 跳转箭头
        let arrow = thisSel.append('g')
          .classed('link-arrow', true).style('opacity', 0)
        let arc = d3.arc().innerRadius(8).outerRadius(10)
          .startAngle(0).endAngle(2 * Math.PI)
        let points = [
          [posX - 3, posY - 4], [posX + 3, posY], [posX - 3, posY + 4]
        ].map(val => val.join(' ')).join(',')
        arrow.append('path').classed('arrow-circle', true)
          .attr('d', arc()).attr('fill', op.firstColor)
          .attr('transform', `translate(${posX}, ${posY})`)
        arrow.append('polyline').classed('arrow-line', true)
          .attr('points', points)
          .attr('stroke', op.firstColor)
          .attr('stroke-width', '2px')
          .attr('fill', 'none')
        thisSel.append('rect').classed('mask-rect', true)
          .attr('width', w - margin.left - margin.right - op.barPLeft)
          .attr('height', 20).attr('opacity', 0)
          .attr('y', i * op.barMarginTop + margin.top)
          .attr('x', margin.left + op.barPLeft)
          .style('cursor', 'pointer')
          .on('mouseenter', function () {
            tooltipCallback(i)
            series.selectAll('.description-link').style('fill', op.color)
            link.style('fill', op.firstColor)
            arrow.style('opacity', 1)
          })
          .on('mouseout', function () {
            tooltip.style('visibility', 'hidden')
            link.style('fill', op.color)
            arrow.style('opacity', 0)
          })
          .on('click', function () {
            setTimeout(() => {
              link.style('fill', op.firstColor)
            }, 0)
            window.open(`https://product.suning.com/${codeList[i]}.html`)
          })
          .on('mousemove', function () {
            tooltip.style('visibility', 'visible')
              .style('top', d3.event.layerY - 60 + 'px')
            if (window.innerWidth - d3.event.clientX < tooltip.node().clientWidth + 35) {
              tooltip.style('right', el.clientWidth - d3.event.layerX - 35 + 'px')
                .style('left', 'auto')
                .classed('tooltip-place-right-arrow', true)
                .classed('arrow-box', false)
            } else {
              tooltip.style('left', d3.event.layerX - 35 + 'px')
                .style('right', 'auto')
                .classed('arrow-box', true)
                .classed('tooltip-place-right-arrow', false)
            }
          })
      })
    function numAddZero (num) {
      return num < 10 ? '0' + num : num
    }
    // 单行文本超出省略
    function wrap (txt) {
      var self = this
      self.text(txt)
      var textLength = self.node().getComputedTextLength(),
        text = txt
      while (textLength > wrapTextLenth && text.length > 0) {
        text = text.slice(0, -1)
        self.text(text + '...')
        textLength = self.node().getComputedTextLength()
      }
    }
    this.resize = () => {
      let w = el.clientWidth
      if (!w) return
      svg.attr('width', w)
      wrapTextLenth = w - margin.left - margin.right - op.barPLeft - 60
      series.each(function (d, i) {
        wrap.call(d3.select(this).select('.description-link'), descriptionList[i])
        d3.select(this).select('.mask-rect').transition()
          .attr('width', w - margin.left - margin.right - op.barPLeft)
        let posY = i * op.barMarginTop + 10 + margin.top
        let posX = w - margin.right - 10
        let points = [
          [posX - 3, posY - 4], [posX + 3, posY], [posX - 3, posY + 4]
        ].map(val => val.join(' ')).join(',')
        d3.select(this).select('.arrow-circle')
          .attr('transform', `translate(${posX}, ${posY})`)
        d3.select(this).select('.arrow-line')
          .attr('points', points)
      })
    }
  }
}
