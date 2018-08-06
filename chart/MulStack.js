import * as d3 from 'd3'
import BaseChart from './BaseChart'

export default class Bar extends BaseChart {
  constructor (el, data) {
    super(el, data)
    this.op = {
      color: '#67c79f',
      width: el.clientWidth,   // 减10防止出现滚动条
      height: el.clientHeight,
      barWid: 22,
      margin: {
        top: 75,
        left: 350,
        right: 200,
        bottom: 55,
        legend: 35,
        title: 35
      },
      padding: 0.3,
      labelLeft: 10,
      axisLabelPadding: 10,
      textAnchor: 'end',
      minRatio: 0.1,
      minStackWid: 0
    }
  }

  draw (option) {
    if (!this.data || !this.data.aggr || this.data.aggr.length === 0) return
    let op = Object.assign(this.op, option)
    let el = this.el,
      data = this.data

    let w = op.width,
      h = op.height

    let svg = d3.select(el).append('svg').attr('width', w).attr('height', h)
    let legendTop = op.margin.legend,
      titleTop = op.margin.title,
      labelLeft = op.labelLeft,
      margin = op.margin,
      color = op.color,
      barW = op.barWid,
      padding = op.padding,
      axisLabelPadding = op.axisLabelPadding,
      legend = op.legend,
      title = op.title,
      textAnchor = op.textAnchor,
      minRatio = op.minRatio,
      minStackWid = op.minStackWid

    let x = d3.scaleLinear().domain([0, d3.max(data.aggr.map(i => i.total))]).range([0, w - margin.left - margin.right - 2 * minStackWid])
    let y = d3.scalePoint().domain(data.aggr.map(i => i.name)).range([0, h - margin.top - margin.bottom]).padding(padding)

    let series = svg.append('g').attr('fill', color).classed('series', true)
    let noSeries = series.append('g').classed('no', true)
    noSeries.selectAll('rect').data(data.aggr).enter().append('rect').classed('no', true)
      .attr('width', function (d, i) {
        // let w = genBarWidth(data.aggr[i].value[0], data.aggr[i].total)
        // return x(w)
        return genBarWidth(data.aggr[i].value[0], data.aggr[i].total)
      }).attr('height', d => barW)
      .attr('x', margin.left)
      .attr('y', d => y(d.name) + margin.top)
      .attr('opacity', 1)

    let yesSeries = series.append('g').classed('yes', true)
    yesSeries.selectAll('rect').data(data.aggr).enter().append('rect').classed('yes', true)
      .attr('width', function (d, i) {
        return genBarWidth(data.aggr[i].value[1], data.aggr[i].total)
      })
      .attr('height', d => barW)
      .attr('x', function (d, i) {
        // return x(genBarWidth(data.aggr[i].value[0], data.aggr[i].total)) + margin.left
        return genBarWidth(data.aggr[i].value[0], data.aggr[i].total) + margin.left
      })
      .attr('y', d => y(d.name) + margin.top)
      .attr('opacity', 0.6)

    noSeries.selectAll('text').data(data.aggr).enter().append('text').text((d, i) => d.value[0] === 0 ? '' : d.value[0])
      .attr('x', (d, i) => {
        // return x(genBarWidth(data.aggr[i].value[0], data.aggr[i].total)) - labelLeft + margin.left
        return genBarWidth(data.aggr[i].value[0], data.aggr[i].total) - labelLeft + margin.left
      })
      .attr('y', d => y(d.name) + margin.top + barW / 2 + 5)
      .attr('text-anchor', 'end')
      .classed('inner', true)
    yesSeries.selectAll('text').data(data.aggr).enter().append('text').text((d, i) => d.value[1] === 0 ? '' : d.value[1])
      .attr('y', d => y(d.name) + margin.top + barW / 2 + 5)
      .attr('x', function (d, i) {
        return genBarWidth(+data.aggr[i].total, data.aggr[i].total) - labelLeft + margin.left
      })
      .attr('text-anchor', 'end')
      .classed('inner', true)

// xAxisText
    series.selectAll('.label').data(data.aggr).enter().append('text')
      .text(d => d.name)
      .attr('x', margin.left - axisLabelPadding)
      .attr('y', d => y(d.name) + margin.top + barW / 2 + 5)
      .style('text-anchor', textAnchor)

// title
    svg.append('text').classed('title', true).text(title)
      .attr('x', margin.left).attr('y', titleTop + 12).attr('text-anchor', textAnchor)

// legend
    let legends = svg.selectAll('.legend').data(['是', '否']).enter().append('g').classed('legend', true)
      .attr('width', 70).attr('transform', (d, i) => `translate(${w - margin.right - (2 - i) * 40}, ${legendTop})`)
    legends.append('text').text(d => d)
      .attr('x', 17).attr('y', 10)

    legends.append('rect').classed('legend-rect', true)
      .attr('width', 12).attr('height', 12).attr('fill', '#67c79f')
      .attr('opacity', (d, i) => 1 - 0.4 * i)

    function genBarWidth (val, total) {
      // if (val === 0 || val === total) return val
      // else debugger
      // 至少有0.2 * width的长度，同时加上val * 100来增加区分度
      // if (val / total < 0.2) return total * 0.2 + val * 50
      // else if (val / total > 0.8) return total * 0.8 - (total - val) * 50

      // if (val / total < minRatio) return total * minRatio
      // else if (val / total > 1 - minRatio) return total * (1 - minRatio)

      // if (val < minRatio) return minRatio
      // else if (val > (total - minRatio)) return (total - minRatio)

      if (val === 0) return x(0)
      else if (val === +total) return x(+total) + 2 * minStackWid
      else return x(val) + minStackWid

      // else return val
      // return val
    }
  }
}
