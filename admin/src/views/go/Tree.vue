<template>
    <div>
      <span>树形结构</span>
      <div id="myDiagramDiv" style="width: 600px;height: 600px;"></div>
    </div>
</template>

<script>
import 'gojs'
export default {
  name: 'Tree',
  mounted() {
    const self = this
    const make = go.GraphObject.make
    self.myDiagram =
      make(go.Diagram, 'myDiagramDiv',
        {
          initialContentAlignment: go.Spot.Center
        }
      )

    self.myDiagram.nodeTemplate =
      make(go.Node, 'Auto',
        new go.Binding('location', 'loc', go.Point.parse),
        make(go.Shape, 'RoundedRectangle', { fill: 'white', width: 50, height: 50 }),
        make(go.TextBlock, new go.Binding('text', 'text')),
        make('TreeExpanderButton',
          { row: 4, columnSpan: 99, alignment: go.Spot.Top, alignmentFocus: go.Spot.Top }),
      )
    self.myDiagram.linkTemplate =
      make(go.Link, make(go.Shape),
        make(go.Shape, { toArrow: 'standard' })
      )
    var nodeDataArray = [
      { key: 1, text: 'lsy1', loc: '100 100' },
      { key: 2, text: 'lsy2', loc: '200 200' },
      { key: 3, text: 'lsy3', loc: '300 100' },
      { key: 4, text: 'lsy4', loc: '200 300' },
      { key: 5, text: 'lsy5', loc: '40 400' },
      { key: 6, text: 'lsy6', loc: '100 400' },
      { key: 7, text: 'lsy7', loc: '160 400' },
      { key: 8, text: 'lsy8', loc: '220 400' },
      { key: 9, text: 'lsy9', loc: '280 400' },
      { key: 10, text: 'lsy10', loc: '340 400' },
      { key: 11, text: 'lsy11', loc: '400 400' }
    ]
    var linkDataArray = [
      { from: 2, to: 1 },
      { from: 2, to: 3 },
      { from: 4, to: 2 },
      { from: 4, to: 5 },
      { from: 4, to: 6 },
      { from: 4, to: 7 },
      { from: 4, to: 8 },
      { from: 4, to: 9 },
      { from: 4, to: 10 },
      { from: 4, to: 11 }
    ]
    self.myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray)
  }
}
</script>

<style scoped>

</style>
