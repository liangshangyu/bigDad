/**
 * @author hilshire
 * @description 有垂直的g的堆叠图
 */
import * as d3 from 'd3'
import BaseChart from './BaseChart'

export default class VerSeriesStack extends BaseChart {
  constructor (el, data) {
    super(el, data)
    this.op = {
      width: el.clientWidth,
      height: el.clientHeight,

      margin: {
        top: 45,
        left: 70,
        right: 70,
        bottom: 40
      },
      color: '#3b84e5',
      barWidth: 50,
      // required, stack keys
      keys: [],
      legendWidth: 110,
      legendRectPadding: 90
    }
  }

  draw (option) {
    if (!this.data || this.data.length === 0) return
    let op = this.op = Object.assign(this.op, option)
    let el = this.el,
      data = this.data
    let w = op.width,
      h = op.height,
      bw = op.barWidth,
      margin = op.margin,
      color = op.color,
      legendWidth = op.legendWidth,
      legendRectPadding = op.legendRectPadding
    let keys = op.keys,
      gW = w - margin.left - margin.right,
      gH = h - margin.top - margin.bottom,
      max = d3.max(data, d => d.total)
    // record removed series for animition
    let removedSeries = []

    let svg = d3.select(el).append('svg').attr('height', h).attr('width', w)
    let x = d3.scalePoint().rangeRound([0, gW]).domain(data.map(i => i.date))
    let y = d3.scaleLinear().rangeRound([0, gH]).domain([0, d3.max(data, d => +d.total)]).nice()

    // tooltip
    let tooltip = d3.select(el).append('div').classed('tooltip', true).style('visibility', 'hidden')
    // graph
    let graph = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)

    let bars = graph.selectAll('g').data(data).enter().append('g').classed('bar', true)
      .each(function (d, i) {
        // bars
        keys.forEach((i, idx) => {
          d3.select(this).append('rect')
            .attr('x', x(d.date) - bw / 2)
            .attr('y', gH -
                  // Array.apply(null, {length: N}).map(Number.call, Number)为range的hack；idx + 1保证reduce结果正确（1对应[1]， 2对应[1,2]）
                  Array.apply(null, {length: idx + 1}).map(Number.call, Number)
                       .reduce((p, n, j) => p + y(d[keys[j]]), 0)
            )
            .attr('height', y(d[keys[idx]]))
            .attr('width', bw)
            .attr('fill', color)
            .attr('opacity', 1 - idx * 0.3)
        })

        // grey background
        d3.select(this).append('rect')
          .on('mouseenter', function (d) {
            let _data = data[i]
            d3.select(this).classed('hover', true)
            tooltip.html(`
              <p>${_data.date}</p>
              <p>${keys[0]}: ${d3.format(',')(_data[keys[0]])}</p>
              <p>${keys[1]}: ${d3.format(',')(_data[keys[1]])}</p>
              <p>${keys[2]}: ${d3.format(',')(_data[keys[2]])}</p>
            `)
          })
          .on('mousemove', function () {
            tooltip.style('top', d3.event.layerY - tooltip.property('clientHeight') - 10 + 'px')
            if (window.innerWidth - d3.event.clientX < tooltip.node().clientWidth + 30) {
              tooltip.style('right', el.clientWidth - d3.event.layerX - 32 + 'px')
                      .style('left', 'auto')
                      .classed('arrow-box arrow-box-bottom', false)
                      .classed('tooltip-place-right-arrow', true)
            } else {
              tooltip.style('left', d3.event.layerX - 34 + 'px')
                      .style('right', 'auto')
                      .classed('arrow-box arrow-box-bottom', true)
                      .classed('tooltip-place-right-arrow', false)
            }
            tooltip.style('visibility', 'visible')
          })
          .on('mouseout', function () {
            d3.select(this).classed('hover', false)
            tooltip.style('visibility', 'hidden')
          })
          .attr('x', x(d.date) - bw / 2 - 20).attr('y', 0)
          .attr('fill', '#fff')
          .attr('opacity', 0.1)
          .attr('width', bw + 40)
          .attr('height', gH)
          .classed('d3-stack-grey-bg', true)

        // labels
        d3.select(this).append('text').text(d3.format(',')(d.total)).classed('label', true).attr('fill', '#748179')
          .attr('x', x(d.date)).attr('y', gH - y(d.total) - 10).attr('text-anchor', 'middle').attr('font-size', '12px')
      })

    // axis
    let xAxis = svg
      .append('g')
      .classed('axis xAxis', true)
      .call(d3.axisBottom(x).tickSizeInner(0).tickPadding(6))
      .attr('transform', `translate(${margin.left}, ${h - margin.bottom + 5})`)

    // legends
    keys.forEach((i, idx) => {
      let legendG = svg.append('g').classed('legend cursor-pointer', true)
      // 改变legends顺序
      idx = keys.length - 1 - idx
      legendG.append('text').text(i).attr('x', w - legendWidth * idx).attr('y', 15).attr('text-anchor', 'end').attr('font-size', 12)
      legendG.append('rect').attr('width', 10).attr('height', 10).attr('x', w - legendWidth * idx - legendRectPadding).attr('y', 15 - 10)
        .attr('fill', color).attr('opacity', 1 - (keys.length - 1 - idx) * 0.3).classed('legend-rect', true)
      // click event
      legendG.call(removeSeries, i, idx)
    })

    // animation
    function removeSeries (ele, name, i) {
      ele.on('click', function () {
        let legend = d3.select(this)

        // sync remvoedSeries and change color
        if (removedSeries.indexOf(name) === -1) {
          removedSeries.push(name)
          legend.select('rect').attr('fill', '#b8bec4')
          legend.select('text').style('fill', '#b8bec4')
        } else {
          removedSeries.splice(removedSeries.indexOf(name), 1)
          legend.select('rect').attr('fill', color)
          legend.select('text').style('fill', '#4b5254')
        }

        // gen a copy of data
        let newData = data.map(i => Object.assign({}, i))
        // modify data
        removedSeries.forEach(i => {
          newData.forEach(j => {
            j.total -= j[i]
            j[i] = 0
          })
        })

        bars.data(newData)

        bars.each(function (d, j) {
          keys.forEach((key, idx) => {
            d3.select(d3.select(this).selectAll('rect')._groups[0][idx])
              .transition()
              .delay(j * 100)
              .attr('y', gH -
                    Array.apply(null, {length: idx + 1}).map(Number.call, Number)
                         .reduce((p, n, j) => p + y(d[keys[j]]), 0)
              )
              .attr('height', y(d[keys[idx]]))
          })

          d3.select(d3.selectAll('.label')._groups[0][j]).text(d3.format(',')(d.total)).transition().delay(j * 100).attr('y', gH - y(d.total) - 10)
        })
      })
    }

    this.resize = () => {
      let w = el.clientWidth,
        gW = w - margin.left - margin.right

      x.rangeRound([0, gW])
      svg.attr('width', w)
      bars.selectAll('rect').attr('x', d => x(d.date) - bw / 2)
      bars.selectAll('rect.d3-stack-grey-bg').attr('x', d => x(d.date) - bw / 2 - 20)
      bars.selectAll('text').attr('x', d => x(d.date))
      xAxis.call(d3.axisBottom(x).tickSizeInner(0).tickPadding(6))
      svg.selectAll('.legend text').attr('x', (v, i) => w - legendWidth * i)
      svg.selectAll('.legend rect').attr('x', (v, i) => w - legendWidth * i - legendRectPadding)
    }
  }
}

