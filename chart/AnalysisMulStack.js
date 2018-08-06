import * as d3 from 'd3'
import BaseChart from './BaseChart'
import * as common from './commonChart'

export default class AnalysisMulStack extends BaseChart {
  constructor (el, data) {
    super(el, data)
    this.op = {
      svgInit: {
        width: 1100,
        height: 300
      },
      xAxis: {
        x: 50,
        y: 330,
        width: 1000,
        padding: 5
      },
      yScale: {
        height: 170
      },
      stacks: {
        width: 22,
        colorArr: ['#67c79f', '#94d8bc', '#c2e9d9']
      },
      explain: {
        right: 20,
        top: 20,
        expArr: ['成交老客', '成交新客', '未成交访客']
      },
      circles: {
        r: 5
      },
      tips: {
        width: 310,
        height: 135
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

    // generate xAxis
    let xDataset = data[3]
    let xScale = d3.scaleBand()
      .domain(xDataset)
      .range([0, op.xAxis.width])
    let xAxis = common.genxAxis(xDataset, xScale, op, svg)

    // achieve yDataset
    let yDataset1 = data[0],
      yDataset2 = data[1],
      yDataset3 = data[2]

    // generate yScale
    let max = d3.max([yDataset1, yDataset2, yDataset3].map((arr) => {
      return d3.max(arr.map((val) => {
        return d3.sum(d3.values(val))
      }))
    }))
    let yScale = d3.scaleLinear()
      .domain([0, max])
      .range([0, op.yScale.height])
      .nice()

    // drawStacks
    let stack1 = common.drawStacks(svg, xDataset, xScale,
    	yDataset1, yScale, op, 'APP')
    stack1.attr('transform', 'translate(' + (stack1.attr('transform').split(',')[0].split('(')[1] - 30) + ',0)')

    let stack2 = common.drawStacks(svg, xDataset, xScale,
    	yDataset2, yScale, op, 'PC')
    let stack3 = common.drawStacks(svg, xDataset, xScale,
    	yDataset3, yScale, op, 'WAP')
    stack3.attr('transform', 'translate(' + (stack3.attr('transform').split(',')[0].split('(')[1] - 0 + 30) + ',0)')

    // explaination in right-top corner
    let expGroupWidth = common.genExplain(svg, op)
    common.clickExplain([yDataset1, yDataset2, yDataset3], yScale, op)

    // tooltip
    let tempArr = ['dellOldCus', 'dellNewCus', 'unDellCus']
    let tooltip = d3.select(el).append('div')
      .classed('tooltip arrow-box-bottom', true)
      .style('opacity', 0)
    let tooltipCallback = i => {
      return `<ul>
        <li class="float-left tooltip-li">
          <span>${xDataset[i]}</span><br><span>${op.explain.expArr[2]}(人)</span><br>
          <span>${op.explain.expArr[1]}(人)</span><br><span>${op.explain.expArr[0]}(人)</span><br>
        </li>
        <li class="float-left tooltip-li">
          <span>App</span><br><span>${d3.format(',')(data[0][i][tempArr[2]])}</span><br>
          <span>${d3.format(',')(data[0][i][tempArr[1]])}</span><br>
          <span>${d3.format(',')(data[0][i][tempArr[0]])}</span><br>
        </li>
        <li class="float-left tooltip-li">
          <span>PC</span><br><span>${d3.format(',')(data[1][i][tempArr[2]])}</span><br>
          <span>${d3.format(',')(data[1][i][tempArr[1]])}</span><br>
          <span>${d3.format(',')(data[1][i][tempArr[0]])}</span><br>
        </li>
        <li class="float-left tooltip-li">
          <span>WAP</span><br><span>${d3.format(',')(data[2][i][tempArr[2]])}</span><br>
          <span>${d3.format(',')(data[2][i][tempArr[1]])}</span><br>
          <span>${d3.format(',')(data[2][i][tempArr[0]])}</span><br>
        </li>
      </ul>`
    }
    // tips for datas
    let tipGroups = svg.append('g')
		    .classed('tip-group txt-middle', true)
		    .attr('transform', 'translate(' + op.xAxis.x + ',' + (op.xAxis.y - op.yScale.height) + ')')
    yDataset1.forEach(function (val, i) {
      let total = d3.max(data.map((v, m) => {
        if (m <= 2) {
          return d3.sum(d3.values(data[m][i]))
        }
      }))
      let x = xScale(xDataset[i]) + op.xAxis.width / xDataset.length / 2,
        y = op.yScale.height - yScale(total)

      // bind hover event to hoverElement
      // let maskWidth = op.xAxis.width / count - 30
      let maskWidth = 120
      let mask = svg.append('rect')
        .attr('transform', 'translate(' + op.xAxis.x + ')')
        .attr('width', maskWidth)
        .attr('height', (op.ySaleAxis ? (op.xAxis.y - op.ySaleAxis.y) : op.yScale.height))
        .attr('x', x - maskWidth / 2)
        .attr('y', (op.ySaleAxis ? op.ySaleAxis.y : (op.xAxis.y - op.yScale.height)))
        .classed('mask', true)
      mask.on('mouseover', () => {
        mask.classed('hover', true)
        tooltip.html(tooltipCallback(i))
        svg.selectAll('.single-dot').filter(`:nth-of-type(${i + 1})`).classed('hover', true)
      }).on('mouseout', () => {
        tooltip.style('opacity', 0)
        mask.classed('hover', false)
        svg.selectAll('.single-dot').classed('hover', false)
      }).on('mousemove', function () {
        tooltip.style('top', d3.event.layerY - tooltip.node().clientHeight - 10 + 'px')
          .style('opacity', 1)
        if (window.innerWidth - d3.event.clientX < tooltip.node().clientWidth + 36) {
          tooltip.style('right', el.clientWidth - d3.event.layerX - 36 + 'px')
            .style('left', 'auto')
            .classed('tooltip-place-right-arrow', true)
            .classed('arrow-box', false)
        } else {
          tooltip.style('left', d3.event.layerX - 36 + 'px')
            .style('right', 'auto')
            .classed('arrow-box', true)
            .classed('tooltip-place-right-arrow', false)
        }
      })

      // tooltip
      // d3.timeout(() => {
      //   let txtGroup = common.creaDotHover1(tipGroups.append('g'), x, y, op, svg, op.xAxis.y - op.yScale.height, xDataset.length)
      //   let startY = 0, startX = 0
      //   let txt = txtGroup.append('g').attr('transform', 'translate(40,' + (startY += 5) + ')')
      //   txt.append('text')
      //     .text(xDataset[i])
      //   txt.append('text')
      //     .text('App')
      //     .attr('transform', 'translate(' + (startX += 90) + ',0)')
      //   txt.append('text')
      //     .text('PC')
      //     .attr('transform', 'translate(' + (startX += 60) + ',0)')
      //   txt.append('text')
      //     .text('WAP')
      //     .attr('transform', 'translate(' + (startX += 60) + ',0)')
      //   for (let k = tempArr.length - 1; k >= 0; k--) {
      //     startX = 0
      //     let tip = txtGroup.append('g').attr('transform', 'translate(40,' + (startY += 32) + ')')
      //     tip.append('text')
      //       .text(op.explain.expArr[k] + '(人)')
      //     tip.append('text')
      //       .text(d3.format(',')(data[0][i][tempArr[k]]))
      //       .attr('transform', 'translate(' + (startX += 90) + ',0)')
      //     tip.append('text')
      //       .text(d3.format(',')(data[1][i][tempArr[k]]))
      //       .attr('transform', 'translate(' + (startX += 60) + ',0)')
      //     tip.append('text')
      //       .text(d3.format(',')(data[2][i][tempArr[k]]))
      //       .attr('transform', 'translate(' + (startX += 60) + ',0)')
      //     for (let i = 0; i < 3; i++) {
      //       txtGroup.append('line').attr('x1', 100 + 60 * i).attr('y1', -5).attr('x2', 100 + 60 * i).attr('y2', op.tips.height - 30)
      //     }
      //   }
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
      svg.selectAll('.stack-group').each(function () {
        d3.select(this).selectAll('.stacks')
        .each(function (d, i) {
          d3.select(this).selectAll('rect').transition()
            .attr('x', xScale(xDataset[i]) + (op.xAxis.width / xDataset.length - op.stacks.width) / 2)
          d3.select(this).selectAll('text').transition()
            .attr('x', xScale(xDataset[i]) + op.xAxis.width / xDataset.length / 2)
        })
      })
      // 说明文本
      svg.select('.explain').transition()
        .attr('transform', `translate(${val - expGroupWidth - op.explain.right},${op.explain.top})`)
      // 提示框
      let maskWidth = 120
      yDataset1.forEach(function (val, i) {
        let x = xScale(xDataset[i]) + op.xAxis.width / xDataset.length / 2
        svg.selectAll('.mask').filter(`:nth-of-type(${i + 1})`).transition()
          .attr('x', x - maskWidth / 2)
      })
    }
  }
}
