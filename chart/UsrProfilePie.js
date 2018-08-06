import * as d3 from 'd3'
import BaseChart from './BaseChart'

export default class UsrProfilePie extends BaseChart {
  constructor (el, data) {
    super(el, data)
    this.op = {
      color: '#3b84e5',
      width: el.clientWidth,
      height: el.clientHeight
    }
  }

  draw (option) {
    if (!this.data) return
    let op = Object.assign(this.op, option)
    let data = this.data,
      w = op.width,
      h = op.height

    let PI = Math.PI
    let tooltip = d3.select(this.el).append('div').classed('tooltip', true).style('opacity', 0)
    let svg = d3.select(this.el).append('svg').attr('width', w).attr('height', h)
    // 使other arc 开始和结尾出现空白
    let g = svg.append('g').attr('transform', `translate(${w / 2}, ${h / 2})`)
    let pieData = d3.pie().sort(null)([data.mbrTotalNumPrim - data.mbrActNumPrim, data.mbrActNumPrim])

    let otherDataArc = d3.arc().innerRadius(90).outerRadius(90 + 25).padAngle(PI * 0.02)
    let mbrDataArc = d3.arc().innerRadius(75).outerRadius(75 + 55)

    let mbrPath = g.selectAll('.other-path').classed('other-path', true)
        .data([pieData[1]]).enter().append('path').attr('d', mbrDataArc).attr('fill', '#43aea8')
        .on('mouseenter', () => {
          tooltip.html(`会员活跃人数（${data.mbrActUnit}）：${data.mbrActNum}`)
        })
        .on('mousemove', () => {
          let x = d3.mouse(this.el)[0],
            y = d3.mouse(this.el)[1]
          tooltip.style('top', y + 20 + 'px')
            .style('left', x - tooltip.style('clientWidth') - 20 + 'px')
            .style('opacity', 1)
        })
        .on('mouseleave', () => { tooltip.style('opacity', 0) })
    let otherPath = g.selectAll('.mbr-path').classed('mbr-path', true)
        .data([pieData[0]]).enter().append('path').attr('d', otherDataArc).attr('fill', '#bac3d2')
        .on('mouseenter', () => {
          tooltip.html(`其他（${data.oterUnit}）：${data.oterNum}`)
        })
        .on('mousemove', () => {
          let x = d3.mouse(this.el)[0],
            y = d3.mouse(this.el)[1]
          tooltip.style('top', y + 20 + 'px')
            .style('left', x - tooltip.style('clientWidth') - 20 + 'px')
            .style('opacity', 1)
        })
        .on('mouseleave', () => { tooltip.style('opacity', 0) })

    // ratio
    g.append('text').text(`${data.mbrActRatio}%`).style('font-size', '26px').style('font-weight', 'bold').style('fill', '#43aea8').style('text-anchor', 'middle').attr('y', 10)
    svg.append('text').text('活跃会员占比').attr('y', '20').style('font-weight', 'bold')

    // resize
    this.resize = () => {
      w = this.el.clientWidth
      svg.transition().attr('width', w).attr('height', h)
      g.attr('transform', `translate(${w / 2}, ${h / 2})`)
    }
  }
}
