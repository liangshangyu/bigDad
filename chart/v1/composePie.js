import * as d3 from 'd3'
import BaseChart from './BaseChart'

export default class composePie extends BaseChart {
  constructor (el, data) {
    super(el, data)
    this.op = {
      innerColor: ['#97f0d7', '#2bcebc'],
      outerColor: ['#5c7ba4', '#1585ac', '#00d1d1'],
      outerRadius: 118,
      innerRadius: 90,
      circleRadius: 67,
      width: el.clientWidth - 10,   // 减10防止出现滚动条
      height: el.clientHeight - 10
    }
  }

  draw (option) {
    let op = this.op = Object.assign(this.op, option)

    let donutD = (this.data && this.data.outer && this.data.outer.aggr) ? this.data.outer : {aggr: []},
      pieD = (this.data && this.data.inner && this.data.inner.aggr) ? this.data.inner : {aggr: []}

    let innerColor = op.innerColor,
      outerColor = op.outerColor

    let w = op.width,
      h = op.height

    let outerRadius = op.outerRadius,
      innerRadius = op.innerRadius,
      circleRadius = op.circleRadius

    let pi = Math.PI

    let pie = d3.pie()
    let outerPieD = pie(donutD.aggr.map(i => i.value))
    let innerPieD = pie(pieD.aggr.map(i => i.value))

    let svg = d3.select(this.el).append('svg').attr('width', w).attr('height', h)
    let div = d3.select(this.el)
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)

    // draw donut
    let donutArc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius)

    let donutG = svg
      .append('g')
      .attr('transform', 'translate(' + w / 2 + ',' + h / 2 + ')')
    donutG
      .selectAll('path')
      .classed('arc', true)
      .data(outerPieD)
      .enter()
      .append('path')
      .call(outerBindTooltip)
      .attr('d', donutArc)
      .attr('fill', (d, i) => {
        return outerColor[i]
      })
      .transition()
      .duration(450)
      .attrTween('d', function (d) {
        var interpolate = d3.interpolate(
          { startAngle: pi * -0.5, endAngle: pi * -0.5 },
          { startAngle: d.startAngle, endAngle: d.endAngle }
        )

        return t => donutArc(interpolate(t))
      })

    donutG
      .selectAll('text')
      .data(outerPieD)
      .enter()
      .append('text')
      .attr('text-anchor', d => {
        if (d.startAngle >= pi / 2) return 'end'
        else return 'start'
      })
      .attr('x', function (d) {
        var a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2
        d.cx = Math.cos(a) * outerRadius
        return (d.x = Math.cos(a) * (outerRadius + 30))
      })
      .attr('y', function (d) {
        var a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2
        d.cy = Math.sin(a) * outerRadius
        return (d.y = Math.sin(a) * (outerRadius + 30))
      })
      .text(function (d, i) {
        let row = donutD.aggr[i]
        return `${(row.ratio * 100).toFixed(2)}%`
      })
      .each(function (d) {
        var bbox = this.getBBox()
        d.sx = d.x - bbox.width / 2 - 2
        d.ox = d.x + 2
        d.sy = d.oy = d.y + 5
      })

    donutG
      .selectAll('path.pointer')
      .data(outerPieD)
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

    // draw pie
    let pieArc = d3.arc().innerRadius(0).outerRadius(circleRadius)

    let pieArcG = svg
      .append('g')
      .attr('transform', 'translate(' + w / 2 + ',' + h / 2 + ')')
      .selectAll('g')
      .data(innerPieD)
      .enter()
      .append('g')
      .classed('arc', true)
    pieArcG
      .append('path')
      .attr('d', pieArc)
      .attr('fill', (d, i) => innerColor[i])
      .call(innerBindTooltip)
      .on('mouseenter', function (d) {
        d3.select(this).style('opacity', 0.8)
      })
      .on('mouseleave', function () {
        d3.select(this).style('opacity', 1)
      })
      .transition()
      .duration(450)
      .attrTween('d', function (d) {
        var interpolate = d3.interpolate(
          { startAngle: pi * -0.5, endAngle: pi * -0.5 },
          { startAngle: d.startAngle, endAngle: d.endAngle }
        )

        return function (t) {
          return pieArc(interpolate(t))
        }
      })
    pieArcG
      .append('text')
      .attr('transform', function (d) {
        return 'translate(' + pieArc.centroid(d) + ')'
      })
      .attr('dy', '.35em')
      .style('text-anchor', 'middle')
      .style('fill', '#fff')
      .text((d, i) => (parseFloat(pieD.aggr[i].ratio) * 100).toFixed(0) + '%')

    function outerBindTooltip (el) {
      el
        .on('mousemove', function (d, i) {
          div.transition().duration(200).style('opacity', 0.9)
          div
            .html(
              `${donutD.aggr[i].name} <br/> 占比：${d.value} <br/> 总数：${donutD.aggr[i]
                .ratio * 100}%`
            )
            .style('left', d3.event.layerX + 25 + 'px')
            .style('top', d3.event.layerY + 25 + 'px')

          d3.select(this).transition().attr('d', function (d) {
            donutArc.outerRadius(outerRadius + 10)
            return donutArc(d)
          })
        })
        .on('mouseout', function (d) {
          div.transition().duration(200).style('opacity', 0)

          d3.select(this).transition().attr('d', function (d) {
            donutArc.outerRadius(outerRadius)
            return donutArc(d)
          })
        })
    }

    function innerBindTooltip (el) {
      el
        .on('mousemove', function (d, i) {
          div.transition().duration(200).style('opacity', 0.9)
          div
            .html(
              `${pieD.aggr[i].name} <br/> 占比：${d.value} <br/> 总数：${pieD.aggr[i]
                .ratio * 100}%`
            )
            .style('left', d3.event.layerX + 25 + 'px')
            .style('top', d3.event.layerY + 25 + 'px')
        })
        .on('mouseout', function (d) {
          div.transition().duration(200).style('opacity', 0)
        })
    }
  }
}
