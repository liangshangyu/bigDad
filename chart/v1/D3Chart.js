import * as d3 from 'd3'

export default class D3Chart {
  constructor (el, data) {
    this.el = el
    this.svg = d3.select(el).append('svg')
    this.data = data
  }

  drawBottomAxis (scale, {scale, tickSizeInner = 0, tickPadding = 0}) {
    this.xAxis = d3.axisBottom(scale).tickSizeInner(tickSizeInner).tickPadding(tickPadding)
    svg
      .append('g')
      .classed('axis xAxis', true)
      .call(xAxis)
      .attr('transform', `translate(${axisLeft}, ${xAxisTop})`)
  }
  drawLeftAxis (scale, {scale, ticks = 5, tickSizeInner = 0}) {
    this.yAxis = d3.axisLeft(scale).ticks(ticks).tickSizeInner(tickSizeInner)
    svg
      .append('g')
      .classed('axis yAxis', true)
      .call(yAxis)
      .attr('transform', `translate(${axisLeft}, ${margin[0]})`)
  }
  drawLabel (data) {
    this.svg
      .selectAll('g.bar')
      .data(data.aggr)
      .append('text')
      .classed('label hide', true)
      .text(d => d.value)
      .attr(
        'transform',
        d =>
          `translate(${xScale(d.name) + barWid / 2}, ${yScale(d.value) -
          op.labelPadding})`
      )
      .style('text-anchor', 'middle')
  }
  drawBar (option, data) {
    let defaultOp = {
      color: '#83afea',
      width: el.clientWidth - 10,   // 减10防止出现滚动条
      height: el.clientHeight - 10,
      barWid: 36,
      barPadding: 30,    // 这个属性没有作用，但是在没有指定barWidth的情况下可能有用
      margin: [50, 10, 50, 50],
      labelPadding: 5,
      tickPadding: 7,
      unit: '（人数）',
      unitPadding: 20
    }
    let op = Object.assign(defaultOp, option)

    let margin = op.margin,
      width = op.width,
      height = op.height,
      color = op.color,
      barWid = op.barWid,
      el = this.el
      svg = this.svg

    let yMax = height - margin[0] - margin[2],
      yMin = 1,
      xMax = width - margin[3] - margin[1]
    let axisLeft = margin[3] + barWid / 2,
      xAxisTop = margin[0] + yMax

    data = (data && data.aggr) ? data : { aggr: [] }

    if (!this.yScale) {
      let yScale = this.yScale = d3
          .scaleLinear()
          .domain([0, d3.max(data.aggr.map(i => Number(i.value)))])
          .range([yMax, yMin])

      this.drawLeftAxis(yScale, {tickPadding: op.tickPadding})
    }
    if (!this.xScale) {
      let xScale = this.xScale = d3
        .scalePoint()
        .domain(data.aggr.map(i => i.name))
        .range([0, xMax])
        .padding(op.barPadding)

      this.drawBottomAxis(xScale, {})
    }

    svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin[3]}, ${margin[0]})`)
      .selectAll('rect')
      .data(data.aggr)
      .enter()
      .append('g')
      .classed('bar', true)
      .append('rect')
      .attr('x', d => xScale(d.name))
      .attr('y', d => yScale(d.value))
      // 最小为0
      .attr('height', d => yMax - yScale(d.value) + 1)
      .attr('width', barWid)
      .attr('fill', color)
      .on('mouseenter', function () {
        this.nextSibling.classList.remove('hide')
        d3.select(this).attr('fill', d3.rgb(color).brighter(0.3))
      })
      .on('mouseleave', function () {
        this.nextSibling.classList.add('hide')
        d3.select(this).attr('fill', color)
      })


    svg
      .append('text')
      .text(op.unit)
      .attr('transform', `translate(${axisLeft}, ${margin[0] - op.unitPadding})`)
      .style('text-anchor', 'end')




    this.resize = function () {
      width = el.clientWidth - 10
      height = el.clientHeight - 10
      let xMax = width - margin[3] - margin[1]
      let yMax = height - margin[0] - margin[2]
      let xAxisTop = margin[0] + yMax

      svg.attr('width', width).attr('height', height)
      xScale.range([0, xMax])
      yScale.range([yMax, yMin])

      svg
        .selectAll('.bar rect').transition()
        .attr('x', d => xScale(d.name))
        .attr('y', d => yScale(d.value))
        .attr('height', d => yMax - yScale(d.value) + 1)
      svg
        .selectAll('.bar text').transition()
        .attr(
          'transform',
          d =>
            `translate(${xScale(d.name) + barWid / 2}, ${yScale(d.value) -
            op.labelPadding})`
        )
      svg.select('.xAxis').transition().call(xAxis).attr('transform', `translate(${axisLeft}, ${xAxisTop})`)
      svg.select('.yAxis').transition().call(yAxis).attr('transform', `translate(${axisLeft}, ${margin[0]})`)
    }
  }

  resetData (data) {
    this.el.innerHTML = ''
    this.data = data
    this.draw(this.op)
  }
}
