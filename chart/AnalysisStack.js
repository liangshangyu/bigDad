import * as d3 from 'd3'
import BaseChart from './BaseChart'
import * as common from './commonChart'

export default class AnalysisStack extends BaseChart {
  constructor (el, data) {
    super(el, data)
    this.op = {
      svgInit: {
        width: 1100,
        height: 450
      },
      xAxis: {
        x: 50,
        y: 400,
        width: 1000,
        padding: 5
      },
      yScale: {
        height: 170
      },
      ySaleAxis: {
        x: 40,
        y: 100,
        height: 100
      },
      stacks: {
        width: 50,
        colorArr: ['#67c79f', '#94d8bc', '#c2e9d9']
      },
      circles: {
        r: 5
      },
      explain: {
        right: 20,
        top: 20,
        expArr: ['销售额', '成交老客', '成交新客', '未成交访客']
      },
      tips: {
        width: 200,
        height: 120
      }
    }
  }

  draw (option) {
    if (!this.data || this.data.length === 0) return
    let op = this.op = Object.assign(this.op, option)
    let el = this.el,
      data = this.data
    if (!op.svgInit.width) op.svgInit.width = 991
    op.xAxis.x = (op.svgInit.width - op.xAxis.width) / 2

    let svg = d3.select(el).append('svg')
      .attr('width', op.svgInit.width)
      .attr('height', op.svgInit.height)

    // achieve yDataset and saleDataset
    let yDataset = data[0],
      saleDataset = data[1],
      xDataset = data[2],
      saleFlag = data[3].saleFlag
    let xScale = d3.scaleBand().domain(xDataset).range([0, op.xAxis.width])
    let xAxis = common.genxAxis(xDataset, xScale, op, svg)

    // generate yScale
    let yScale = d3.scaleLinear()
      .domain([0, d3.max(yDataset.map((val) => {
        return d3.sum(d3.values(val))
      }))])
      .range([0, op.yScale.height])

    // generate ySaleScale
    let ySaleScale = d3.scaleLinear()
      .domain([
        d3.min(saleDataset.map((val) => {
          return val.saleAmount
        })),
        d3.max(saleDataset.map((val) => {
          return val.saleAmount
        }))
      ])
      .range([op.ySaleAxis.height, 0]).nice()

    // generate ySaleAxis
    let ySaleAxis = d3.axisLeft(ySaleScale)
    svg.append('g').call(ySaleAxis)
      .classed('y-sale-axis', true)
      .attr('transform', 'translate(' + op.ySaleAxis.x + ',' + op.ySaleAxis.y + ')')

    // draw stacks
    common.drawStacks(svg, xDataset, xScale, yDataset, yScale, op)

    // explaination in right-top corner
    let expGroupWidth = common.genExplain(svg, op)
    common.clickExplain([yDataset], yScale, op)

    // path-group
    let path = d3.path()
    saleDataset.forEach((val, i) => {
      let x = xScale(xDataset[i]) + op.xAxis.width / xDataset.length / 2,
        y = ySaleScale(val.saleAmount)
      path[i === 0 ? 'moveTo' : 'lineTo'](x, y)
    })
    svg.append('path')
      .attr('transform', 'translate(' + op.xAxis.x + ',' + op.ySaleAxis.y + ')')
      .classed('path-group', true)
      .attr('d', path)

    // tooltip
    let tooltip = d3.select(el).append('div')
      .classed('tooltip arrow-box arrow-box-bottom', true)
      .style('opacity', 0)
      .style('line-height', '20px')
    let tooltipCallback = i => {
      let x = xScale(xDataset[i]) + op.xAxis.width / xDataset.length / 2
      if (x + tooltip.node().clientWidth + op.xAxis.x - 36 < el.clientWidth) {
        tooltip.classed('tooltip-place-right-arrow', false)
          .classed('arrow-box-bottom arrow-box', true)
          .style('left', (x + op.xAxis.x - 36) + 'px')
      } else {
        tooltip.classed('tooltip-place-right-arrow', true)
          .classed('arrow-box-bottom arrow-box', false)
          .style('left', (x + op.xAxis.x - tooltip.node().clientWidth + 36) + 'px')
      }
      return `<span>${xDataset[i]}</span><br>
        <span>${op.explain.expArr[0]}(元)：${saleFlag ? d3.format(',')(saleDataset[i].saleAmount) : '**'}</span><br>
        <span>${op.explain.expArr[3]}(人)：${d3.format(',')(yDataset[i].unDellCus)}</span><br>
        <span>${op.explain.expArr[2]}(人)：${d3.format(',')(yDataset[i].dellNewCus)}</span><br>
        <span>${op.explain.expArr[1]}(人)：${d3.format(',')(yDataset[i].dellOldCus)}</span><br>`
    }

    // tip-group
    let tipGroup = svg.append('g')
      .attr('transform', 'translate(' + op.xAxis.x + ',' + op.ySaleAxis.y + ')')
      .classed('tip-group', true)
    let tipGroups = tipGroup.selectAll('g')
      .data(saleDataset).enter().append('g')
      .classed('single-dot', true)
    let that = this
    tipGroups.each(function (d, i) {
      let x = xScale(xDataset[i]) + op.xAxis.width / xDataset.length / 2,
        y = ySaleScale(d.saleAmount)
      let thisSel = d3.select(this)

      thisSel.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', op.circles.r)
        .classed('dot-circle', true)

      thisSel.append('text')
        .text((saleFlag ? d3.format(',')(d.saleAmount) : ''))
        .attr('x', x)
        .attr('y', y - 20)
        .classed('dot-text', true)

      // bind hover event to hoverElement
      // let maskWidth = op.xAxis.width / count - 30
      let maskWidth = 120
      let mask = svg.append('rect')
        .attr('transform', 'translate(' + op.xAxis.x + ')')
        .attr('width', maskWidth)
        .attr('height', (op.ySaleAxis ? (op.xAxis.y - op.ySaleAxis.y) : op.yScale.height) + 30)
        .attr('x', x - maskWidth / 2)
        .attr('y', (op.ySaleAxis ? op.ySaleAxis.y : (op.xAxis.y - op.yScale.height)) - 30)
        .classed('mask', true)
      mask.on('mouseover', () => {
        mask.classed('hover', true)
        tooltip.html(tooltipCallback(i))
          .style('top', (y + op.ySaleAxis.y - tooltip.node().clientHeight - 13) + 'px')
          .style('opacity', 1)
        svg.selectAll('.single-dot').filter(`:nth-of-type(${i + 1})`).classed('hover', true)
      }).on('mouseout', () => {
        tooltip.style('opacity', 0)
        mask.classed('hover', false)
        svg.selectAll('.single-dot').classed('hover', false)
      })

      // // tooltip
      // d3.timeout(() => {
      //   let txtGroup = common.creaDotHover(tipGroup.append('g'),
      //     x, y, op, svg, op.ySaleAxis.y, xDataset.length, i)
      //   let startY = 0
      //   txtGroup.append('text').text(xDataset[i])
      //   txtGroup.append('text').text(op.explain.expArr[0] + '(元)：' + (saleFlag ? d3.format(',')(saleDataset[i].saleAmount) : '**'))
      //     .attr('transform', 'translate(0,' + (startY += 22) + ')')
      //   txtGroup.append('text').text(op.explain.expArr[3] + '(人)：' + d3.format(',')(yDataset[i].unDellCus))
      //     .attr('transform', 'translate(0,' + (startY += 22) + ')')
      //   txtGroup.append('text').text(op.explain.expArr[2] + '(人)：' + d3.format(',')(yDataset[i].dellNewCus))
      //     .attr('transform', 'translate(0,' + (startY += 22) + ')')
      //   txtGroup.append('text').text(op.explain.expArr[1] + '(人)：' + d3.format(',')(yDataset[i].dellOldCus))
      //     .attr('transform', 'translate(0,' + (startY += 22) + ')')
      // }, 0)
    })

    let oriPosxArr = []
    xDataset.forEach((val, i) => oriPosxArr.push(xScale(xDataset[i]) + op.xAxis.width / xDataset.length / 2))
    // 自适应
    this.resize = (val) => {
      if (!val) val = 991
      svg.transition().attr('width', val)
      // 坐标轴
      op.xAxis.width = val - op.xAxis.x * 2
      xScale.range([0, op.xAxis.width])
      svg.select('.x-axis').transition().call(xAxis)
      // 柱状图
      svg.select('.stack-group').selectAll('.stacks')
        .each(function (d, i) {
          d3.select(this).selectAll('rect').transition()
            .attr('x', xScale(xDataset[i]) + (op.xAxis.width / xDataset.length - op.stacks.width) / 2)
          d3.select(this).selectAll('text').transition()
            .attr('x', xScale(xDataset[i]) + op.xAxis.width / xDataset.length / 2)
        })
      // 说明文本
      svg.select('.explain').transition()
        .attr('transform', `translate(${val - expGroupWidth - op.explain.right},${op.explain.top})`)
      // 折线图
      let path = d3.path()
      saleDataset.forEach((val, i) => {
        let x = xScale(xDataset[i]) + op.xAxis.width / xDataset.length / 2,
          y = ySaleScale(val.saleAmount)
        path[i === 0 ? 'moveTo' : 'lineTo'](x, y)
      })
      svg.select('svg>.path-group').transition()
        .attr('d', path)
      // 提示框
      let maskWidth = 120
      tipGroups.each(function (d, i) {
        let thisSel = d3.select(this)
        let x = xScale(xDataset[i]) + op.xAxis.width / xDataset.length / 2
        svg.selectAll('.mask').filter(`:nth-of-type(${i + 1})`).transition()
          .attr('x', x - maskWidth / 2)
        thisSel.selectAll('circle').transition().attr('cx', x)
        thisSel.selectAll('text').transition().attr('x', x)
      })
    }
  }
}
