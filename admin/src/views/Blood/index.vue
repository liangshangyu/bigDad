<template>
    <!--<div style="margin-left: 43%;margin-top: 16%">血缘关系图</div>-->
  <div id="sample" style="margin-top: 20px">
    <el-form style="margin-left: 10px" :inline="true" ref="formInline" :rules="rules" :model="formInline" class="demo-form-inline">
      <el-form-item label="查询目标类型" prop="searchType">
        <el-select v-model="formInline.searchTargetType"  style="width: 267px;" placeholder="请选择" @change="selectChange">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
        <el-form-item label="查询类型" prop="searchType">
          <el-select v-model="formInline.searchType"  style="width: 267px;" placeholder="请选择" @change="selectChange2">
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
                     @focus="enter"
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
        <b>监控数据</b><br />
        <p>关系： {{this.proDetail.relationship}}<p>
        <p>层级： {{this.proDetail.loops}}<p>
        <p>责任人： {{this.proDetail.principal}}<p>
        <p>路径： {{this.proDetail.easyPath}}<p>
        <p v-for="(item, key) in this.proDetail.detail">{{key}}： {{item}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      options: [
        {
          value: 'Report',
          label: 'Report'
        },
        {
          value: 'Hive',
          label: 'Hive'
        }
      ],
      typeListF: [],
      valueOfType: '',
      targetListFinal: [],
      valueOfTarget: '',
      formInline: {
        searchTargetType: '',
        searchType: '',
        searchTarget: ''
      },
      rules: {
        searchTargetType: [
          { required: true, message: '请选择查询目标类型', trigger: 'change' }
        ],
        searchType: [
          { required: true, message: '请选择查询类型', trigger: 'change' }
        ]
      },
      num1: 1,
      proDetail: {},
      list: [],
      srcData: {},
      tempMonitor: [],
      loading: false,
      diagram: '',
      first: true
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
      this.proDetail = {}
      var param = {}
      var node = e.diagram.selection.first()
      if (node instanceof go.Node) {
        this.result.relationShips.forEach((item, index) => {
          if (item.key.split(',')[item.key.split(',').length - 1] == node.Yd.key) {
            param.key = item.key
            param.queryType = this.formInline.searchType
          }
        })
        if (this.formInline.searchTarget.split(',')[this.formInline.searchTarget.split(',').length - 1] == node.Yd.key) {
          param.key = this.formInline.searchTarget
          param.queryType = this.formInline.searchType
        }
        this.$store.dispatch('queryDataSheet', param).then(res => {
          document.getElementById('propertiesPanel').style.display = 'block'
        })
      } else {
        document.getElementById('propertiesPanel').style.display = 'none'
      }
    },
    onTextEdited(e) {
      var tb = e.subject
      if (tb === null || !tb.name) return
      var node = tb.part
      if (node instanceof go.Node) {
        // updateData(tb.text, tb.name)
        this.updateProperties(node.data)
      }
    },
    enter(e) {
      var that = this
      var target = e.target
      e.target.addEventListener('keydown', function(e) {
        if (e.keyCode === 13) {
          var query = target.value
          that.$refs['formInline'].validate((valid) => {
            if (valid) {
              that.targetListFinal = []
              if (query.length >= 3) {
                that.loading = true
                const param = {
                  queryType: that.formInline.searchType,
                  condition: query
                }
                that.$store.dispatch('searchTarget', param).then(res => {
                  that.targetListFinal = []
                  if (that.targetList.length === 0) {
                    that.loading = true
                    setTimeout(() => {
                      that.loading = false
                    }, 1500)
                  } else {
                    that.loading = false
                  }
                  that.targetList.forEach((item, index) => {
                    const row = {
                      value: item,
                      label: item,
                      index: index
                    }
                    that.targetListFinal.push(row)
                  })
                })
              } else {
                that.targetListFinal = []
              }
            } else {
              that.targetListFinal = []
              return
            }
          })
        }
      })
    },
    selectChange(value) {
      console.log(value)
      if (value == 'Report') {
        this.typeListF = [
          {
            value: 'Report_MySQL_Hive',
            label: 'Report_MySQL_Hive'
          }
        ]
      }
      if (value === 'Hive') {
        this.typeListF = [
          {
            value: 'Hive_Hive',
            label: 'Hive_Hive'
          }
        ]
      }
      this.formInline.searchTarget = ''
      this.formInline.searchType = ''
      this.targetListFinal = []
    },
    selectChange2() {},
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
          this.proDetail = {}
          document.getElementById('propertiesPanel').style.display = 'none'
          this.srcData = {}
          var param = {
            pageSize: 1000,
            currentPage: 1,
            key: this.formInline.searchTarget,
            maxLoops: this.num1,
            queryType: this.formInline.searchType,
            vType: 'graph'
          }
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
            var temp = []
            if (tempData.relationship === '上游') {
              if (tempData.loops === 1) {
                var row = {
                  key: tempData.path[0][1],
                  parent: tempData.path[0][0],
                  dir:
                }
              }
            }
            tempData.push({ key: this.formInline.searchTarget, shortKey: this.formInline.searchTarget.split(',')[this.formInline.searchTarget.split(',').length - 1] })
            var s = '<div id="myDiagramDiv" style="background-color: white; border: solid 1px black; height: 600px;margin-left: 10px;"></div>'
            var ss = '<div id="myOverviewDiv" style="width:200px ;height:100px;position: absolute;top:0 ;left:10px ;border: solid 1px blue;background-color: white;z-index: 300;"></div>'
            $('#detail').append(s)
            $('#detail').append(ss)
            console.log(tempData)
            this.draw(tempData)
          })
        } else {
          console.log('error submit!')
          return false
        }
      })
    },
    draw(nodeDataArray) {
      var self = this
      var $ = go.GraphObject.make // for conciseness in defining templates in this function
      self.myDiagram =
        $(go.Diagram, 'myDiagramDiv', // must be the ID or reference to div
          { initialContentAlignment: go.Spot.Center })

      // define all of the gradient brushes
      var graygrad = $(go.Brush, 'Linear', { 0: '#F5F5F5', 1: '#F1F1F1' })
      var bluegrad = $(go.Brush, 'Linear', { 0: '#CDDAF0', 1: '#91ADDD' })
      var yellowgrad = $(go.Brush, 'Linear', { 0: '#FEC901', 1: '#FEA200' })
      var lavgrad = $(go.Brush, 'Linear', { 0: '#EF9EFA', 1: '#A570AD' })
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

      // define the Link template
      self.myDiagram.linkTemplate =
        $(go.Link, // the whole link panel
          { selectable: false },
          $(go.Shape)) // the link shape

      // create the model for the double tree
      self.myDiagram.model = new go.TreeModel(nodeDataArray)
      function doubleTreeLayout(diagram) {
        // Within this function override the definition of '$' from jQuery:
        var $ = go.GraphObject.make // for conciseness in defining templates
        diagram.startTransaction('Double Tree Layout')

        // split the nodes and links into two Sets, depending on direction
        var leftParts = new go.Set(go.Part)
        var rightParts = new go.Set(go.Part)
        function separatePartsByLayout(diagram, leftParts, rightParts) {
          var root = diagram.findNodeForKey('Root')
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
        separatePartsByLayout(diagram, leftParts, rightParts)
        // but the ROOT node will be in both collections
        // create and perform two TreeLayouts, one in each direction,
        // without moving the ROOT node, on the different subsets of nodes and links
        var layout1 =
          $(go.TreeLayout,
            { angle: 180,
              arrangement: go.TreeLayout.ArrangementFixedRoots,
              setsPortSpot: false })

        var layout2 =
          $(go.TreeLayout,
            { angle: 0,
              arrangement: go.TreeLayout.ArrangementFixedRoots,
              setsPortSpot: false })

        layout1.doLayout(leftParts)
        layout2.doLayout(rightParts)

        diagram.commitTransaction('Double Tree Layout')
      }
      doubleTreeLayout(self.myDiagram)
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
