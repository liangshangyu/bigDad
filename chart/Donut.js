import * as d3 from 'd3'
import BaseChart from './BaseChart'

export default class Dount extends BaseChart {
  constructor (el, data) {
    super(el, data)
    this.op = {
      color: '#3b84e5',
      width: el.clientWidth,   // 减10防止出现滚动条
      height: el.clientHeight,
      innerRadius: 39,
      outerRadius: 70,
      legend: {
        left: 14,
        bottom: 14,
        height: 12,
        radius: 5,
        circlePadding: 5
      },
      titleH: 54,
      margin: {
        left: 55
      }
    }
  }

  draw (option) {
    if (!this.data || !this.data.aggr) return

    let op = Object.assign(this.op, option)
    let data = this.data
    let color = d3.rgb(op.color)
    let w = op.width,
      h = op.height
    let outerRadius = op.outerRadius,
      innerRadius = op.innerRadius
    let legendOp = op.legend
    let margin = op.margin
    let title = op.title
    let titleH = op.titleH
    let pi = Math.PI

    let pieData = d3.pie().sort(null)(data.aggr.map(i => i.value))
    let arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius)
    let svg = d3
      .select(this.el)
      .append('svg')

    let g = svg
      .attr('width', w)
      .attr('height', h)
      .append('g')
      .attr('transform', 'translate(' + (margin.left + outerRadius) + ',' + (h + titleH) / 2 + ')')

    let paths = g
      .selectAll('path')
      .classed('arc', true)
      .data(pieData)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => color)
      .attr('opacity', (d, i) => 1 - i * 0.15)
      .attr('stroke', '#cfe1f9')
      .on('mousemove', function (d, i) {
        d3.select(this).attr('fill', color.brighter(i * 0.2 + 0.1))
      })
      .on('mouseout', function (d, i) {
        d3.select(this).attr('fill', color.brighter(i * 0.2))
      })
      .transition()
      .duration(450)
      .attrTween('d', function (d) {
        var interpolate = d3.interpolate(
          { startAngle: pi * -0.5, endAngle: pi * -0.5 },
          { startAngle: d.startAngle, endAngle: d.endAngle }
        )

        return function (t) {
          return arc(interpolate(t))
        }
      })

    let legends = svg.append('g').classed('legends', true).attr('transform', function (d, i) {
      let x = margin.left + outerRadius + outerRadius + legendOp.left
      let y = (h + titleH) / 2
      return 'translate(' + x + ',' + y + ')'
    })
    let legend = legends.selectAll('.legend').data(data.aggr).enter().append('g').classed('legend', true)
      .attr('transform', function (d, i) {
        let y = i * (legendOp.bottom + legendOp.height) - legendOp.bottom * data.aggr.length / 2 - legendOp.height / 2
        return 'translate(0,' + y + ')'
      })
    legend
      .append('text').text(d => d.name + '   ' + (d.ratio * 100).toFixed(0) + '%')
      .attr('font-size', '12px')
      .attr('xml:space', 'preserve')
      .attr('transform', () => `translate(${legendOp.radius + legendOp.circlePadding}, 0)`)

    legend.append('circle').attr('r', legendOp.radius).attr('cy', -4).attr('fill', color).attr('opacity', (d, i) => 1 - i * 0.15)

    svg.append('text').text(title.replace(/(\d+)/, d => {
      return d3.format(',')(d)
    }))
      .attr('transform', () => `translate(${margin.left + outerRadius - outerRadius}, ${(h + titleH) / 2 - 45 - outerRadius})`)
      .attr('xml:space', 'preserve')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .style('fill', '#495052')
      // .attr('text-anchor', 'middle')
  }
}
