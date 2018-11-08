<template>
    <!--<div style="margin-left: 43%;margin-top: 16%">血缘关系图</div>-->
  <div id="sample" style="margin-top: 20px">
    <el-form style="margin-left: 10px" :inline="true" ref="formInline" :rules="rules" :model="formInline" class="demo-form-inline">
        <el-form-item label="查询类型" prop="searchType">
          <el-select v-model="formInline.searchType"  style="width: 267px;" placeholder="请选择" @change="selectChange">
            <el-option
              v-for="item in typeListF"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目标" prop="searchTarget" >
          <el-select v-model="formInline.searchTarget" style="width: 450px" filterable
                     placeholder="请选择"
                     mutiple
                     remote
                     reserve-keyword
                     :remote-method="remoteMethod"
          >
            <el-option
              v-for="item in targetListFinal"
              :key=item.index
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      <el-form-item label="层级">
        <el-input-number v-model="num1" @change="handleChange" :min="1" :max="10" label="描述文字"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('formInline')">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="dataShow">
      <div>
        <span>上游表层级：</span>
        <span>{{this.srcData.upperLevel}}</span>
      </div>
      <div>
        <span>下游表层级：</span>
        <span>{{this.srcData.downLevel}}</span>
      </div>
      <div>
        <span>全部上游表数量：</span>
        <span>{{this.srcData.allupLevel}}</span>
      </div>
      <div>
        <span>全部下游表数量：</span>
        <span>{{this.srcData.alldownLevel}}</span>
      </div>
      <div>
        <span>直接上游表数量：</span>
        <span>{{this.srcData.direcuptLevel}}</span>
      </div>
      <div>
        <span>直接下游表数量：</span>
        <span>{{this.srcData.directdownLevel}}</span>
      </div>
    </div>
    <div id="detail" style="position: relative">
            <div id="myDiagramDiv" style="background-color: white; border: solid 1px black; height: 600px;margin-left: 10px;"></div>
            <div id="myOverviewDiv"></div>
     </div>
    <div style=" margin-left: 10px;">
      <div id="propertiesPanel" style="display: none; background-color: aliceblue; border: solid 1px black">
        <b>Properties</b><br />
        Name: <input type="text" id="name" value=""  readonly style="width: 25%" v-model="showInfo.name"/><br />
        Title: <input type="text" id="title" value=""  readonly style="width: 25%" v-model="showInfo.title"/><br />
        Comments: <input type="text" id="comments" value=""  readonly/><br />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      typeListF: [],
      valueOfType: '',
      targetListFinal: [],
      valueOfTarget: '',
      formInline: {
        searchType: '',
        searchTarget: ''
      },
      rules: {
        searchType: [
          { required: true, message: '请选择查询类型', trigger: 'change' }
        ],
        searchTarget: [
          { required: true, message: '请选择目标', trigger: 'change' }
        ]
      },
      num1: 1,
      list: [],
      srcData: {},
      loading: false,
      diagram: '',
      first: true,
      showInfo: {
        name: '',
        title: ''
      }
    }
  },
  name: 'index',
  computed: {
    ...mapGetters(['typeList', 'targetList', 'result', 'resultInfo'])
  },
  mounted() {
    this.draw([])
    this.$store.dispatch('getListOfType').then(res => {
      this.typeList.forEach((item, index) => {
        var row = {
          label: item.queryType,
          value: item.queryType
        }
        this.typeListF.push(row)
      })
    })
  },
  methods: {
    onSelectionChanged(e) {
      var node = e.diagram.selection.first()
      if (node instanceof go.Node) {
        this.updateProperties(node.Yd)
      } else {
        this.updateProperties(null)
      }
    },
    updateProperties(data) {
      if (data === null) {
        this.showInfo = {
          name: '',
          title: ''
        }
      } else {
        document.getElementById('propertiesPanel').style.display = 'block'
        this.showInfo = {
          name: data.key,
          title: data.parent
        }
      }
    },
    onTextEdited(e) {
      var tb = e.subject
      if (tb === null || !tb.name) return
      var node = tb.part
      if (node instanceof go.Node) {
        // updateData(tb.text, tb.name)
        console.log(node.data)
        this.updateProperties(node.data)
      }
    },
    remoteMethod(query) {
      if (query.length >= 3) {
        this.loading = true
        let param = {
          queryType: this.formInline.searchType,
          condition: query
        }
        this.$store.dispatch('searchTarget', param).then(res => {
          this.targetList.forEach((item, index) => {
            const row = {
              value: item,
              label: item,
              index: index
            }
            this.targetListFinal.push(row)
          })
        })
      } else {
        this.targetListFinal = []
      }
    },
    selectChange(value) {
      this.formInline.searchTarget = ''
      this.formInline.searchType = value
      const param = {
        queryType: value
      }
      /* this.$store.dispatch('getListOfTarget', param).then(res => {
        this.targetListFinal = []
        this.targetList.forEach((item, index) => {
          const row = {
            value: item,
            label: item
          }
          this.targetListFinal.push(row)
        })
      })*/
    },
    selectChangeTarget(value) {
      this.valueOfTarget = value
    },
    handleChange(value) {
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit')
          $('#myDiagramDiv').remove()
          $('#myOverviewDiv').remove()
          this.showInfo = {
            name: '',
            title: ''
          }
          this.srcData = {}
          var param = {
            pageSize: 1000,
            currentPage: 1,
            key: this.formInline.searchTarget,
            maxLoops: this.num1,
            queryType: this.formInline.searchType
          }
          console.log(param)
          this.$store.dispatch('doSearchInfo', param).then(res => {
            firTable(this.resultInfo)
          })
          var self = this
          function firTable(data) {
            // this.srcData = {}
            var row = {
              upperLevel: data.upstreamLayer > 100 ? '有环' : data.upstreamLayer,
              downLevel: data.downstreamLayer > 100 ? '有环' : data.downstreamLayer,
              allupLevel: data.allUpstreamNums,
              alldownLevel: data.allDownstreamNums,
              direcuptLevel: data.directUpstreamNums,
              directdownLevel: data.directDownstreamNums
            }
            self.srcData = row
          }
          this.$store.dispatch('doSearch', param).then(res => {
            var tempData = this.result.relationShips
            var linkDataArray = [{ key: this.formInline.searchTarget, color: 'yellow' }]
            tempData.forEach(function(item) {
              if (item.relationship === '下游') {
                for (var i = 1; i < item.path[0].length; i++) {
                  if (item.loops === 1) {
                    var row = {
                      'key': item.path[0][i],
                      'parent': item.path[0][i - 1],
                      'dir': 'left'
                    }
                  } else {
                    var row = {
                      'key': item.path[0][i],
                      'parent': item.path[0][i - 1]
                    }
                  }
                  handleData(row)
                }
              } else {
                for (var k = 0; k < item.path[0].length - 1; k++) {
                  if (item.loops == 1) {
                    var row2 = {
                      'key': item.path[0][k + 1],
                      'parent': item.path[0][k],
                      'dir': 'right'
                    }
                  } else {
                    var row2 = {
                      'key': item.path[0][k + 1],
                      'parent': item.path[0][k]
                    }
                  }
                  handleData(row2)
                }
              }
            })
            function handleData(value) {
              var flag = true
              if (linkDataArray.length !== 0) {
                for (var m = 0; m < linkDataArray.length; m++) {
                  if (linkDataArray[m].key === value.key) {
                    if (linkDataArray[m].parent && value.parent) {
                      if (linkDataArray[m].parent === value.parent) {
                        flag = false
                        break
                      } else {
                        flag = false
                        linkDataArray.push(value)
                        break
                      }
                    } else if (value.parent) {
                      linkDataArray[m] = value
                      flag = false
                      break
                    } else if (linkDataArray[m].parent) {
                      flag = false
                      break
                    } else {
                      flag = false
                      break
                    }
                  }
                }
                if (flag) {
                  linkDataArray.push(value)
                }
              } else {
                linkDataArray.push(value)
              }
            }
            var temp = []
            for (var h = 0; h < linkDataArray.length; h++) {
              if (h == 0) {
                temp.push(linkDataArray[0])
              } else {
                var tempFlag = true
                for (var n = 0; n < temp.length; n++) {
                  if (n != 0 && temp[n].key == linkDataArray[h].key && temp[n].parent == linkDataArray[h].parent) {
                    tempFlag = false
                    break
                  }
                }
                if (tempFlag) {
                  temp.push(linkDataArray[h])
                }
              }
            }
            var s = '<div id="myDiagramDiv" style="background-color: white; border: solid 1px black; height: 600px;margin-left: 10px;"></div>'
            var ss = '<div id="myOverviewDiv" style="width:200px ;height:100px;position: absolute;top:0 ;left:10px ;border: solid 1px blue;background-color: white;z-index: 300;"></div>'
            $('#detail').append(s)
            $('#detail').append(ss)
            this.draw(temp)
          })
        } else {
          console.log('error submit!')
          return false
        }
      })
    },
    draw(dataArray) {
      this.first = false
      var self = this
      var $ = go.GraphObject.make
      self.myDiagram =
      $(go.Diagram, 'myDiagramDiv', // must be the ID or reference to div
        { initialContentAlignment: go.Spot.Center,
          'toolManager.mouseWheelBehavior': go.ToolManager.WheelZoom, // 鼠标滚轮事件禁止
          'ChangedSelection': self.onSelectionChanged
        })

      // define all of the gradient brushes
      var graygrad = $(go.Brush, 'Linear', { 0: '#F5F5F5', 1: '#F1F1F1' })

      // define the Node template for non-terminal nodes
      self.myDiagram.nodeTemplate =
      $(go.Node, 'Auto',
        { isShadowed: true },
        // define the node's outer shape
        $(go.Shape, 'RoundedRectangle',
          { fill: graygrad, stroke: '#D8D8D8' },
          new go.Binding('fill', 'color')),
        // define the node's text
        $(go.TextBlock,
          { margin: 5, font: 'bold 11px Helvetica, bold Arial, sans-serif' },
          new go.Binding('text', 'key'))
      )
      self.myDiagram.linkTemplate =
      $(go.Link, // the whole link panel
        { selectable: false },
        $(go.Shape),
        $(go.Shape, { toArrow: 'Opentriangle', fill: null })
      ) // the link shape
      // self.myDiagram.model = new go.TreeModel(dataArray)
      self.myDiagram.model = $(go.TreeModel, { makeUniqueKeyFunction: self.keyGenerator, nodeDataArray: dataArray })
      // self.myDiagram.model.makeUniqueKeyFunction = self.keyGenerator
      new go.Overview('myOverviewDiv').observed = self.myDiagram
      doubleTreeLayout(self.myDiagram)
      function doubleTreeLayout(diagram) {
        var $ = go.GraphObject.make // for conciseness in defining templates
        diagram.startTransaction('Double Tree Layout')
        var leftParts = new go.Set(go.Part)
        var rightParts = new go.Set(go.Part)
        separatePartsByLayout(diagram, leftParts, rightParts)
        var layout1 =
      $(go.TreeLayout,
        { angle: 0,
          arrangement: go.TreeLayout.ArrangementFixedRoots,
          setsPortSpot: false })

        var layout2 =
      $(go.TreeLayout,
        { angle: 180,
          arrangement: go.TreeLayout.ArrangementFixedRoots,
          setsPortSpot: false })

        layout1.doLayout(leftParts)
        layout2.doLayout(rightParts)

        diagram.commitTransaction('Double Tree Layout')
      }
      function separatePartsByLayout(diagram, leftParts, rightParts) {
        var root = self.formInline.searchTarget
        if (self.formInline.searchTarget == '') {
          var root = 'Root'
        }
        var root = diagram.findNodeForKey(root)
        if (root === null) return
        // the ROOT node is shared by both subtrees!
        leftParts.add(root)
        rightParts.add(root)
        // look at all of the immediate children of the ROOT node
        root.findTreeChildrenNodes().each(function(child) {
        // in what direction is this child growing?
          var dir = child.data.dir
          var coll = (dir === 'left') ? leftParts : rightParts
          // add the whole subtree starting with this child node
          coll.addAll(child.findTreeParts())
          // and also add the link from the ROOT node to this child node
          coll.add(child.findTreeParentLink())
        })
      }
    },
    keyGenerator(model, data) {
      var i = data.key
      while (model.findNodeDataForKey(i) !== null) i += '$'
      data.key = i.key
      return i
    }
  }
}
</script>

<style scoped>
#myOverviewDiv{
  position: absolute;
  width:200px;
  height:100px;
  top: 0px;
  left: 10px;
  background-color: white;
  z-index: 300; /* make sure its in front */
  border: solid 1px blue;
}
  .dataShow{
    overflow: hidden;
    margin-left: 10px;
    margin-bottom: 10px;
    border: 1px solid #cccccc;
    height:50px;
    line-height: 50px;
  }
  .dataShow div{
    float: left;
    margin-left: 5%;
    display: inline-block;
  }
</style>
