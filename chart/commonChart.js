// public API for Analysis page by xj =======
import * as d3 from 'd3'

// generate xAxis
export function genxAxis (xDataset, xScale, init, svg) {
  let xAxis = d3.axisBottom(xScale).tickPadding(init.xAxis.padding)
  svg.append('g')
    .attr('transform', 'translate(' + init.xAxis.x + ',' + init.xAxis.y + ')')
    .classed('x-axis', true)
    .call(xAxis)
  return xAxis
}

// create hover elements and bind hover events to them
export function creaDotHover (container, posx, posy, init, svg, fromTop, count, index) {
  container.classed('dot-tip-info hide', true)
  let dirX = 1,
    dirY = -1
  if (posx + init.tips.width - 40 + init.xAxis.x + 20 >= init.svgInit.width) {
    dirX = -1
  }
  if (posy - init.tips.height + fromTop - 10 - init.circles.r - 2 <= 20) {
    dirY = 1
  }
  let points = [
    [posx, posy + (init.circles.r + 2) * dirY],
    [posx + 10, posy + (init.circles.r + 2 + 10) * dirY],
    [posx - 10, posy + (init.circles.r + 2 + 10) * dirY]
  ].map((arr) => {
    return arr.join(' ')
  }).join(',')
  container.append('polygon')
    .attr('points', points)
  let xRect = dirX === 1 ? posx - 40 : posx - (init.tips.width - 40),
    yRect = posy + (init.circles.r + 2 + 10 - 1) * dirY + (dirY === 1 ? 0 : -init.tips.height)
  container.append('rect')
    .attr('x', xRect).attr('y', yRect)
    .attr('width', init.tips.width).attr('height', init.tips.height)
    .attr('rx', 5).attr('ry', 5)

  // bind hover event to hoverElement
  // let maskWidth = init.xAxis.width / count - 30
  let maskWidth = 120
  let mask = svg.insert('rect', '.tip-group')
    .attr('transform', 'translate(' + init.xAxis.x + ')')
    .attr('width', maskWidth)
    .attr('height', (init.ySaleAxis ? (init.xAxis.y - init.ySaleAxis.y) : init.yScale.height) + 30)
    .attr('x', posx - maskWidth / 2)
    .attr('y', (init.ySaleAxis ? init.ySaleAxis.y : (init.xAxis.y - init.yScale.height)) - 30)
    .classed('mask', true)
  mask.on('mouseover', () => {
    container.classed('hide', false)
    mask.classed('hover', true)
    if (index !== undefined) {
      svg.selectAll('.single-dot').nodes()[index].classList.add('hover')
    }
  }).on('mouseout', () => {
    container.classed('hide', true)
    mask.classed('hover', false)
    if (index !== undefined) {
      svg.selectAll('.single-dot').nodes()[index].classList.remove('hover')
    }
  })
  container.on('mouseover', () => {
    mask.dispatch('mouseover')
  }).on('mouseout', () => {
    mask.dispatch('mouseout')
  })

  bindHover(index)
  function bindHover (index) {
    if (index !== undefined) {
      svg.selectAll('.single-dot').filter(`:nth-child(${index + 1})`).on('mouseover', () => {
        mask.dispatch('mouseover')
      }).on('mouseout', () => {
        mask.dispatch('mouseout')
      })
    }
  }

  return container.append('g')
    .attr('transform', 'translate(' + (xRect + 15) + ',' + (yRect + 20) + ')')
}

export function creaDotHover1 (container, posx, posy, init, svg, fromTop, count, index) {
  posy = 0
  container.classed('dot-tip-info hide', true)
  let dirX = 1,
    dirY = -1
  if (posx + init.tips.width - 40 + init.xAxis.x + 20 >= init.svgInit.width) {
    dirX = -1
  }
  // if (posy - init.tips.height + fromTop - 10 - init.circles.r - 2 <= 20) {
  //   dirY = 1
  // }
  let points = [
    [posx, posy + (init.circles.r + 2) * dirY],
    [posx + 10, posy + (init.circles.r + 2 + 10) * dirY],
    [posx - 10, posy + (init.circles.r + 2 + 10) * dirY]
  ].map((arr) => {
    return arr.join(' ')
  }).join(',')
  container.append('polygon')
    .attr('points', points)
  let xRect = dirX === 1 ? posx - 40 : posx - (init.tips.width - 40),
    yRect = posy + (init.circles.r + 2 + 10 - 1) * dirY - init.tips.height
  container.append('rect')
    .attr('x', xRect).attr('y', yRect)
    .attr('width', init.tips.width).attr('height', init.tips.height)
    .attr('rx', 5).attr('ry', 5)

  // bind hover event to hoverElement
  // let maskWidth = init.xAxis.width / count - 30
  let maskWidth = 120
  let mask = svg.insert('rect', '.tip-group')
    .attr('transform', 'translate(' + init.xAxis.x + ')')
    .attr('width', maskWidth)
    .attr('height', (init.ySaleAxis ? (init.xAxis.y - init.ySaleAxis.y) : init.yScale.height))
    .attr('x', posx - maskWidth / 2)
    .attr('y', (init.ySaleAxis ? init.ySaleAxis.y : (init.xAxis.y - init.yScale.height)))
    .classed('mask', true)
  mask.on('mouseover', () => {
    container.classed('hide', false)
    mask.classed('hover', true)
    if (index !== undefined) {
      svg.selectAll('.single-dot').nodes()[index].classList.add('hover')
    }
  }).on('mouseout', () => {
    container.classed('hide', true)
    mask.classed('hover', false)
    if (index !== undefined) {
      svg.selectAll('.single-dot').nodes()[index].classList.remove('hover')
    }
  }).on('mousemove', function () {
    let x = d3.mouse(this)[0]
    let y = d3.mouse(this)[1]
    container.attr('transform', 'translate(' + (x - posx + 5) + ',' + (y - (init.xAxis.y - init.yScale.height + 5)) + ')')
  })

  return container.append('g')
    .attr('transform', 'translate(' + (xRect + 15) + ',' + (yRect + 20) + ')')
}
// stacks fit for xScale(linear,band) and yScale(linear)
// init is a object ,following params are must needed:
// let init = {
//   xAxis:{
//     x:50,
//     y:480,
//     width:700,
//     padding:5
//   }
//   stacks: {
//     width:50,
//     colorArr:['#67c79f','#94d8bc','#c2e9d9']
//   }
// }
export function drawStacks (container, xDataset, xScale, yDataset, yScale, init, txt) {
  let stacks = container.append('g').classed('stack-group', true)
    .selectAll('.stacks').data(yDataset)
    .enter().append('g').classed('stacks', true)
    .attr('transform', 'translate(' + init.xAxis.x + ',0)')
  stacks.each(function (d, i) {
    let g = d3.select(this)
    let yStart = init.xAxis.y
    let colorIndex = 0
    let total = 0
    for (let k in d) {
      g.append('rect')
        .attr('x', xScale(xDataset[i]) + (init.xAxis.width / xDataset.length - init.stacks.width) / 2)
        .attr('y', yStart -= yScale(d[k]))
        .attr('width', init.stacks.width)
        .attr('height', yScale(d[k]))
        .attr('fill', init.stacks.colorArr[colorIndex++])
      total += d[k]
    }
    g.append('text').text(txt === undefined ? d3.format(',')(total) : txt)
      .attr('x', xScale(xDataset[i]) + init.xAxis.width / xDataset.length / 2)
      .attr('y', yStart - 10)
      .classed('stack-text', true)
  })
  return stacks
}

// explaination in right-top corner
export function genExplain (svg, init, yDatasetArr) {
  let expStartX = 0
  let expGroup = svg.append('g')
    .classed('explain', true)
  expGroup.selectAll('g').data(init.explain.expArr).enter().append('g')
    .classed('cursor-pointer', true).each(function (d, i) {
      let thisSel = d3.select(this)
      if (i === 0 && init.explain.expArr.length === 4) {
        let path = d3.path()
        path.moveTo(0, 0)
        path.lineTo(expStartX += 30, 0)
        thisSel.append('path')
          .attr('d', path).classed('path-group', true)
        thisSel.append('circle')
          .attr('cx', 15)
          .attr('cy', 0)
          .attr('r', init.circles.r)
          .classed('dot-circle', true)
      } else {
        thisSel.append('rect')
          .attr('x', expStartX += 20)
          .attr('y', -5)
          .attr('width', 10)
          .attr('height', 10)
          .attr('fill', init.stacks.colorArr[init.explain.expArr.length === 4 ? (i - 1) : i])
        expStartX += 10
      }
      let text = thisSel.append('text')
        .text(init.explain.expArr[i])
        .attr('transform', 'translate(' + (expStartX += 10) + ',0)')
        .attr('dy', 5)
      expStartX += init.explain.expArr[i].length * 12 + 2
    })
  expGroup.attr('transform', `translate(${init.svgInit.width - expStartX - init.explain.right},${init.explain.top})`)
  return expStartX
}

// explaination in right-top corner for CustAnaComparison.vue
export function genExpForComparison (svg, init) {
  let expStartX = 0
  let expGroup = svg.append('g')
    .classed('explain', true)
  expGroup.selectAll('g').data(init.explain.expArr).enter().append('g')
    .classed('cursor-pointer', true).each(function (d, i) {
      let thisSel = d3.select(this)
      thisSel.append('rect')
          .attr('x', expStartX += 10)
          .attr('y', -5)
          .attr('width', 10)
          .attr('height', 10)
          .attr('fill', init.colorArr[i])
      expStartX += 5
      let text = thisSel.append('text')
        .text(init.explain.expArr[i])
        .style('fill', '#929eaa')
        .attr('transform', 'translate(' + (expStartX += 10) + ',0)')
        .attr('dy', 5)
      expStartX += init.explain.expArr[i].length * 12 + 2
    })
  let transX = init.explain.left === undefined ? (init.width - expStartX - init.explain.right) : init.explain.left
  let transY = init.explain.top === undefined ? (init.height - init.explain.bottom) : init.explain.top
  expGroup.attr('transform', `translate(${transX},${transY})`)
  return expStartX
}

// explaination in right-top corner for PhaseTrend.vue
export function genExpForPhaseTrend (svg, init) {
  let expStartX = 0
  let expGroup = svg.append('g')
    .classed('explain', true)
  expGroup.selectAll('g').data(init.explain.expArr).enter().append('g')
    .classed('cursor-pointer', true).each(function (d, i) {
      let thisSel = d3.select(this)
      if (i > 0) {
        thisSel.append('rect')
          .attr('x', expStartX += 10)
          .attr('y', -5)
          .attr('width', 10)
          .attr('height', 10)
          .attr('fill', init.explain.colorArr[i])
      } else {
        thisSel.append('line').attr('x1', expStartX).attr('x2', expStartX += 30)
          .attr('y1', 0).attr('y2', 0)
          .attr('stroke-width', 2)
          .attr('stroke', init.explain.colorArr[i])
        thisSel.append('circle').attr('cx', 15).attr('cy', 0)
          .attr('r', 8).attr('fill', '#fff')
        thisSel.append('circle').attr('cx', 15).attr('cy', 0)
          .attr('r', 4).attr('fill', '#fff')
          .attr('stroke-width', 2)
          .attr('stroke', init.explain.colorArr[i])
      }
      expStartX += 5
      let text = thisSel.append('text')
        .text(init.explain.expArr[i])
        .style('fill', '#929eaa')
        .attr('transform', 'translate(' + (expStartX += 10) + ',0)')
        .attr('dy', 5)
      expStartX += init.explain.expArr[i].length * 12 + 2
    })
  let transX = init.explain.left === undefined ? (init.width - expStartX - init.explain.right) : init.explain.left
  let transY = init.explain.top === undefined ? (init.height - init.explain.bottom) : init.explain.top
  expGroup.attr('transform', `translate(${transX},${transY})`)
  return expStartX
}

// bind click event to explain in the right corner
export function clickExplain (yDatasetArr, yScale, init) {
  let gExp = d3.select('.explain').selectAll('g')
  let store = yDatasetArr.map(val => {
    return val.map(obj => {
      return [yScale(obj.dellOldCus), yScale(obj.dellNewCus), yScale(obj.unDellCus)]
    })
  })
  gExp = gExp.nodes().reverse().splice(0, 3).reverse()
  let stackGroup = d3.selectAll('.stack-group')
  let throttle = true
  gExp.forEach((val, i) => {
    gExp[i].clickFlag = false
    val.onclick = function () {
      if (!throttle) {
        return
      }
      this.classList[gExp[i].clickFlag ? 'remove' : 'add']('focus')
      throttle = false
      gExp[i].clickFlag = !gExp[i].clickFlag
      stackGroup.each(function (d, j) {
        let stacks = d3.select(this).selectAll('.stacks')
        stacks.each(function (d1, k) {
          let txt = d3.select(this).select('text')
          let rects = d3.select(this).selectAll('rect')
          if (yDatasetArr.length === 1) {
            let current = +txt.text().split(',').join('')
            let change = Math.round(yScale.invert(store[j][k][i]) * (gExp[i].clickFlag ? -1 : 1))
            txt.text(d3.format(',')(current + change))
          }
          rects.each(function (d2, idx) {
            let max = d3.max(store.map(val => d3.max(val.map(val => d3.sum(val.map((val, order) => {
              if (gExp[order].clickFlag) {
                return 0
              } else {
                return val
              }
            }))))))
            let maxAll = d3.max(store.map(val => d3.max(val.map(val => d3.sum(val)))))
            let scale = max === 0 ? 0 : maxAll / max
            let thisSel = d3.select(this)
            let total = d3.sum(store[j][k].map((val, order) => {
              if (gExp[order].clickFlag || order > idx) {
                return 0
              } else {
                return val
              }
            }))
            if (idx === rects.size() - 1) {
              txt.transition(trans(k))
                .attr('y', init.xAxis.y - total * scale - 10)
            }
            thisSel.transition(trans(k))
              .attr('y', init.xAxis.y - total * scale)
              .attr('height', gExp[idx].clickFlag ? 0 : store[j][k][idx] * scale)
              .on('end', () => {
                if (k === stacks.size() - 1) {
                  throttle = true
                }
              })
            // if (idx === i) {
            //   txt.transition(trans(k))
            //     .attr('y', +txt.attr('y') + extraY)
            //   thisSel.transition(trans(k))
            //     .attr('y', +thisSel.attr('y') + extraY)
            //     .attr('height', gExp[i].clickFlag ? 0 : -extraY)
            //     .on('end', () => {
            //       if (k === stacks.size() - 1) {
            //         throttle = true
            //       }
            //     })
            // } else if (idx > i) {
            //   txt.transition(trans(k))
            //     .attr('y', +txt.attr('y') + extraY)
            //   thisSel.transition(trans(k))
            //     .attr('y', +thisSel.attr('y') + extraY)
            // }
          })
        })
      })
    }
  })
}

export function trans (i) {
  return d3.transition().duration(500).delay(i * 100).ease(d3.easeLinear)
}

export function crossLine (svg, el, op, tooltip, tooltipCallback, xScale, data, mouseleaveCallback) {
  let w = el.clientWidth
  let h = el.clientHeight
  let hoverLineGroup = svg.append('g').classed('hover-line', true)
  let hoverLineX = hoverLineGroup.append('line')
    .classed('line-x', true)
    .attr('x1', op.margin.left - op.stacks.width / 2).attr('y1', op.margin.top)
    .attr('x2', w - op.margin.right + op.stacks.width / 2)
    .attr('y2', op.margin.top).attr('stroke', '#999')
    .classed('hidden', true)
    .attr('stroke-dasharray', '4, 4')
  let hoverLineY = hoverLineGroup.append('line')
    .classed('line-y', true)
    .attr('x1', op.margin.left).attr('x2', op.margin.left) // vertical line so same value on each
    .attr('y1', op.margin.top).attr('y2', h - op.margin.bottom)
    .attr('stroke', '#999')
    .classed('hidden', true) // top to bottom
  svg.on('mousemove', () => {
    let _x = d3.mouse(el)[0],
      _y = d3.mouse(el)[1]
    // 判断是否超出边界
    if (_x < op.margin.left - op.stacks.width / 2 ||
      _x > el.clientWidth - op.margin.right + op.stacks.width / 2 ||
      _y < op.margin.top ||
      _y > h - op.margin.bottom) {
      hoverLineY.classed('hidden', true)
      hoverLineX.classed('hidden', true)
      tooltip.style('opacity', 0)
      mouseleaveCallback()
    } else {
      hoverLineY.classed('hidden', false)
      hoverLineX.classed('hidden', false)
      tooltip.style('opacity', 1)
      hoverLineX.attr('y1', _y).attr('y2', _y)
      data.reduce((prev, now, idx) => {
        let prevX = xScale(prev), nowX = xScale(now)
        if (prevX - op.stacks.width / 2 < _x && nowX + op.stacks.width / 2 > _x) {
          if (_x > (prevX + nowX) / 2) {
            hoverLineY.attr('x1', nowX).attr('x2', nowX)
            tooltip.html(tooltipCallback(idx))
          } else {
            hoverLineY.attr('x1', prevX).attr('x2', prevX)
            tooltip.html(tooltipCallback(idx - 1))
          }
          // 最后两个tooltip偏左
          if (d3.mouse(el)[0] + 20 + tooltip.node().clientWidth > el.clientWidth) {
            tooltip.style('top', _y + 20 + 'px')
              .style('left', d3.mouse(el)[0] - tooltip.node().clientWidth - 20 + 'px')
          } else {
            tooltip.style('top', _y + 20 + 'px').style('left', d3.mouse(el)[0] + 20 + 'px')
          }
        }
        return now
      })
    }
  })
  svg.on('mouseleave', () => {
    hoverLineX.classed('hidden', true)
    hoverLineY.classed('hidden', true)
    tooltip.style('opacity', 0)
  })
  return hoverLineGroup
}

export function hoverYLine (svg, el, op, tooltip, tooltipCallback, xScale, data, mouseleaveCallback, yMaxIdx) {
  let w = el.clientWidth
  let h = el.clientHeight
  let hoverLineGroup = svg.select('.hover-line')
  let hoverLineY = hoverLineGroup.append('line')
    .datum(yMaxIdx !== undefined ? yMaxIdx : 0)
    .classed('line-y', true)
    .attr('x1', yMaxIdx !== undefined ? xScale(data[yMaxIdx]) : op.margin.left)
    .attr('x2', yMaxIdx !== undefined ? xScale(data[yMaxIdx]) : op.margin.left) // vertical line so same value on each
    .attr('y1', op.margin.top).attr('y2', h - op.margin.bottom)
    .attr('stroke', '#999')
  // tooltip 初始位置为最大值处
  if (yMaxIdx !== undefined) {
    tooltip.html(tooltipCallback(yMaxIdx)).datum(yMaxIdx)
    let initPos = [xScale(data[yMaxIdx]), h - op.margin.bottom - op.lineStyle.curveLineHeight]
    if (initPos[0] + 20 + tooltip.node().clientWidth > el.clientWidth) {
      tooltip.style('top', initPos[1] + 20 + 'px')
        .style('left', initPos[0] - tooltip.node().clientWidth - 20 + 'px')
    } else {
      tooltip.style('top', initPos[1] + 20 + 'px').style('left', initPos[0] + 20 + 'px')
    }
  }
  svg.on('mousemove', () => {
    let _x = d3.mouse(el)[0],
      _y = d3.mouse(el)[1]
    // 判断是否超出边界
    if (_x < op.margin.left ||
      _x > el.clientWidth - op.margin.right ||
      _y < op.margin.top ||
      _y > h - op.margin.bottom) {
      hoverLineY.classed('hidden', true)
      tooltip.style('opacity', 0)
      mouseleaveCallback && mouseleaveCallback()
    } else {
      hoverLineY.classed('hidden', false)
      tooltip.style('opacity', 1)
      data.reduce((prev, now, idx) => {
        let prevX = xScale(prev), nowX = xScale(now)
        if (prevX < _x && nowX > _x) {
          if (_x > (prevX + nowX) / 2) {
            hoverLineY.datum(idx).attr('x1', nowX).attr('x2', nowX)
            tooltip.html(tooltipCallback(idx)).datum(idx)
          } else {
            hoverLineY.datum(idx - 1).attr('x1', prevX).attr('x2', prevX)
            tooltip.html(tooltipCallback(idx - 1)).datum(idx - 1)
          }
          // 最后两个tooltip偏左
          if (d3.mouse(el)[0] + 20 + tooltip.node().clientWidth > el.clientWidth) {
            tooltip.style('top', _y + 20 + 'px')
              .style('left', d3.mouse(el)[0] - tooltip.node().clientWidth - 20 + 'px')
          } else {
            tooltip.style('top', _y + 20 + 'px').style('left', d3.mouse(el)[0] + 20 + 'px')
          }
        }
        return now
      })
    }
  })
  svg.on('mouseleave', () => {
    hoverLineY.classed('hidden', true)
    tooltip.style('opacity', 0)
    svg.select('.line-dots').selectAll('g').remove()
  })
}
