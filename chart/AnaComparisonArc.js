import * as d3 from 'd3'
import BaseChart from './BaseChart'
import * as common from './commonChart'

export default class AnaComparisonArc extends BaseChart {
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
      colorArr: ['#d1eee2', '#ace0ca', '#67c79f', '#94d8bc', '#7ecfad', '#c2e9d9'],
      explain: {
        left: 0,
        bottom: 0,
        expArr: ['1', '2', '3', '4', '5']
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
      colorArr = op.colorArr

    let or = (w - margin.left - margin.right) / 2,
      ir = or - 30
    let posY = (h + or) / 2
    let total = data.map(i => +i.value).reduce((p, n) => p + n)
    let max = d3.max(data.map(i => +i.value))
    let maxIdx = 0, curIdx = 0
    data.forEach((val, idx) => {
      if (+val.value === max) curIdx = maxIdx = idx
    })
    let arc = d3.arc().innerRadius(ir).outerRadius(or).padAngle(Math.PI / 180)
    var pie = d3.pie().sort(null)
      .startAngle(Math.PI * -0.5)
      .endAngle(Math.PI * 0.5)
    let svg = d3.select(el).append('svg')
      .attr('width', w)
      .attr('height', h)
    let graph = svg.append('g')
      .attr('transform', `translate(${w / 2}, ${posY})`)
    graph.selectAll('path')
      .data(pie(data.map(d => d.value)))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d, idx) => colorArr[idx])
      .on('mouseenter', function (d, idx) {
        graph.selectAll('path').each(function (dom, index) {
          if (index === idx) return
          d3.select(this).transition().attr('d', d => {
            arc.outerRadius(or)
            return arc(d)
          })
        })
        d3.select(this).transition().attr('d', function (d) {
          arc.outerRadius(or + 10)
          return arc(d)
        })
        titleEle.text(data[idx].key + '  ' + d3.format(',')(d.value) + '人')
        // addSmallTitle()
        ratioEle.text(formatRatio(d.value)).style('fill', colorArr[idx])
        curIdx = idx
      })
      // transition when loading
      .transition().duration(450).attrTween('d', function (d) {
        var interpolate = d3.interpolate(
          { startAngle: Math.PI * -0.5, endAngle: Math.PI * -0.5 },
          { startAngle: d.startAngle, endAngle: d.endAngle }
        )

        return function (t) {
          return arc(interpolate(t))
        }
      }).filter(':last-of-type').on('end', () => {
        graph.selectAll('path').filter(`:nth-of-type(${maxIdx + 1})`)
          .transition().attr('d', function (d) {
            arc.outerRadius(or + 10)
            return arc(d)
          })
      })

    op.explain.expArr = data.map(val => val.key)
    let expGroupWidth = common.genExpForComparison(svg, op)
    let expTransY = parseInt(svg.select('.explain').attr('transform').split(',')[1])
    svg.select('.explain')
      .attr('transform', `translate(${(w - expGroupWidth) / 2}, ${expTransY})`)
    svg.select('.explain').selectAll('.cursor-pointer').each(function (dom, idx) {
      d3.select(this).on('click', function () {
        graph.selectAll('path').each(function (d, index) {
          if (index === idx) {
            titleEle.text(data[index].key + '  ' + d3.format(',')(d.value) + '人')
            // addSmallTitle()
            ratioEle.text(formatRatio(d.value)).style('fill', colorArr[idx])
            d3.select(this).transition().attr('d', function (d) {
              arc.outerRadius(or + 10)
              return arc(d)
            })
            return
          }
          d3.select(this).transition().attr('d', d => {
            arc.outerRadius(or)
            return arc(d)
          })
        })
        curIdx = idx
      })
    })
    let g = svg.append('g').attr('transform', `translate(${w / 2}, ${expTransY - 70})`)
    // ratio
    let ratioEle = g.append('text')
      .text(formatRatio(data[maxIdx].value))
      .attr('x', 0)
      .attr('y', 0)
      .attr('text-anchor', 'middle')
      .attr('font-size', '22px')
      .attr('font-weight', 'bold')
      .style('fill', colorArr[maxIdx])
    // title
    let titleEle = g.append('text')
      .text(data[maxIdx].key + '  ' + d3.format(',')(data[maxIdx].value) + '人')
      .attr('x', 0)
      .attr('y', 40)
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .style('fill', '#929eaa')
      .attr('xml:space', 'preserve')
    // addSmallTitle()

    function formatRatio (v) {
      if (total === 0) return 0 + '%'
      return d3.format('.1%')((+v) / total)
    }

    // function addSmallTitle () {
    //   titleEle.append('tspan')
    //     .text('人')
    //     .attr('font-size', '14px')
    //     .style('fill', '#929eaa')
    // }

    this.resize = function () {
      w = el.clientWidth
      if (!w) return
      let t = d3.transition().duration(200).ease(d3.easeLinear)
      or = (w - margin.left - margin.right) / 2
      ir = or - 30
      arc.innerRadius(ir).outerRadius(or)

      graph.selectAll('path')
        .transition(t)
        .attr('d', function (d, idx) {
          if (idx === curIdx) {
            arc.outerRadius(or + 10)
            return arc(d)
          }
          arc.outerRadius(or)
          return arc(d)
        })
      svg.attr('width', w)
      graph.transition(t).attr('transform', `translate(${w / 2}, ${posY})`)
      svg.select('.explain').transition(t)
        .attr('transform', `translate(${(w - expGroupWidth) / 2}, ${expTransY})`)
      g.transition(t).attr('transform', `translate(${w / 2}, ${expTransY - 70})`)
    }
  }
}
