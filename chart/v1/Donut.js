import * as d3 from 'd3'
import BaseChart from './BaseChart'

export default class Dount extends BaseChart {
  constructor (el, data) {
    super(el, data)
    this.op = {
      colorTable: ['#5c7ba4', '#1585ac', '#67c79f', '#00d1d1', '#2bcebc', '#61dfde'],
      width: el.clientWidth - 10,   // 减10防止出现滚动条
      height: el.clientHeight - 10,
      innerRadius: 74,
      outerRadius: 100
    }
  }
  draw (op) {
    Object.assign(this.op, op)

    let data = (this.data && this.data.aggr) ? this.data : { aggr: [] },
      innerRadius = this.op.innerRadius,
      outerRadius = this.op.outerRadius,
      colorTable = this.op.colorTable,
      w = this.op.width - 10,
      h = this.op.height - 10

    let pi = Math.PI

    let pie = d3.pie()
    let piedata = pie(data.aggr.map(i => i.value))

    let arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius)

    let svg = this.svg = d3
      .select(this.el)
      .append('svg')
      .attr('width', w)
      .attr('height', h)
      .append('g')
      .attr('transform', 'translate(' + w / 2 + ',' + h / 2 + ')')

    let div = d3
      .select(this.el)
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
    svg
      .selectAll('path')
      .classed('arc', true)
      .data(piedata)
      .enter()
      .append('path')
      .call(bindTooltip)
      .attr('d', arc)
      .attr('fill', (d, i) => {
        return colorTable[i]
      })
      .transition()
      .duration(450)
      .attrTween('d', function (d) {
        let interpolate = d3.interpolate(
          { startAngle: pi * -0.5, endAngle: pi * -0.5 },
          { startAngle: d.startAngle, endAngle: d.endAngle }
        )

        return t => arc(interpolate(t))
      })

    svg
      .selectAll('text')
      .data(piedata)
      .enter()
      .append('text')
      .attr('text-anchor', d => {
        if (d.startAngle >= pi / 2) return 'end'
        else return 'start'
      })
      .attr('x', function (d) {
        let a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2
        d.cx = Math.cos(a) * outerRadius
        return (d.x = Math.cos(a) * (outerRadius + 30))
      })
      .attr('y', function (d) {
        let a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2
        d.cy = Math.sin(a) * outerRadius
        return (d.y = Math.sin(a) * (outerRadius + 30))
      })
      .text(function (d, i) {
        let row = data.aggr[i]
        return `${(row.ratio * 100).toFixed(2)}%`
      })
      .each(function (d) {
        let bbox = this.getBBox()
        d.sx = d.x - bbox.width / 2 - 2
        d.ox = d.x + 2
        d.sy = d.oy = d.y + 5
      })

// svg.append('defs').append('marker')
//     .attr('id', 'circ')
//     .attr('markerWidth', 6)
//     .attr('markerHeight', 6)
//     .attr('refX', 3)
//     .attr('refY', 3)
//     .append('circle')
//     .attr('cx', 3)
//     .attr('cy', 3)
//     .attr('r', 3)

    svg
      .selectAll('path.pointer')
      .data(piedata)
      .enter()
      .append('path')
      .attr('class', 'pointer')
      .style('fill', 'none')
      .style('stroke', '#929eaa')
      .attr('marker-end', 'url(#circ)')
      .attr('d', function (d) {
        if (d.cx > d.ox) {
          return (
            'M' +
            d.sx +
            ',' +
            d.sy +
            'L' +
            d.ox +
            ',' +
            d.oy +
            ' ' +
            d.cx +
            ',' +
            d.cy
          )
        } else {
          return (
            'M' +
            d.ox +
            ',' +
            d.oy +
            'L' +
            d.sx +
            ',' +
            d.sy +
            ' ' +
            d.cx +
            ',' +
            d.cy
          )
        }
      })

    function bindTooltip (el) {
      el
        .on('mousemove', function (d, i) {
          div.transition().duration(200).style('opacity', 0.9)
          div
            .html(`${data.aggr[i].name} <br/> 占比：${(data.aggr[i].ratio * 100).toFixed(2)}% <br/> 总数：${d.value}`)
            .style('left', d3.event.layerX + 20 + 'px')
            .style('top', d3.event.layerY + 15 + 'px')

          d3.select(this).transition().attr('d', function (d) {
            arc.outerRadius(outerRadius + 10)
            return arc(d)
          })
        })
        .on('mouseout', function (d) {
          div.transition().duration(20).style('opacity', 0)

          d3.select(this).transition().attr('d', function (d) {
            arc.outerRadius(outerRadius)
            return arc(d)
          })
        })
    }
  }
}
