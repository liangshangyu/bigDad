<template>
  <div class="app-container">
   <!--<nx-github-corner></nx-github-corner>-->
     <!-- <a target="_blank" href="https://github.com/mgbq/vue-permission"><img
        style="position: absolute; top: 48px; right: 0; border: 0;"
        src="../../../static/img/report/forkme.png"
        alt="Fork me on GitHub"></a> -->
    <!--<div class="item">
      <h4>数据展示</h4>
      <data-display :option="option"></data-display>
    </div>
    <div class="item">
      <h4>选项卡展示</h4>
      <data-tabs :option="easyDataOption"></data-tabs>
    </div>
    <div class="item">
      <h4>卡片的展示</h4>
      <data-card :option="easyDataOption0"></data-card>
    </div>
    <div class="item">
      <h4>带数字的展示</h4>
      <data-icons :option="easyDataOption1"></data-icons>
    </div>
    <div class="item">
      <h4>简易展示</h4>
      <data-icons :option="easyDataOption2"></data-icons>
    </div>-->
    这是首页
    <el-button @click="click">点击</el-button>
    <el-input
      placeholder="请输入内容"
      prefix-icon="el-icon-search"
      v-model="input"
      @change="change"
    >
    </el-input>
    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
    <div style="margin: 15px 0;"></div>
    <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
      <el-checkbox v-for="city in cities" :label="city.cityCode" :key="city.cityCode">{{city.cityName}}</el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
const cityOptions = [{ cityName: '北京', cityCode: '4444' }, { cityName: '上海', cityCode: '55' },
  { cityName: '南京', cityCode: '66' }, { cityName: '深圳', cityCode: '77' }, { cityName: '安徽', cityCode: '88' },
  { cityName: '东方闪电', cityCode: '99' }, { cityName: '安徽的', cityCode: '210023' }]
import DataDisplay from '@/components/data-display/data-display'
import DataCard from '@/components/data-card/data-card'
import DataTabs from '@/components/data-tabs/data-tabs'
import DataIcons from '@/components/data-icons/data-icons'
// import GithubCorner from '@/components/github-corner'
export default {
  name: 'report',
  components: {
    DataDisplay,
    DataCard,
    DataTabs,
    DataIcons
  },
  data() {
    return {
      option: {
        span: 8,
        color: '#15A0FF',
        data: [
          {
            count: 1000,
            title: '日活跃数'
          },
          {
            count: 3000,
            title: '月活跃数'
          },
          {
            count: 20000,
            title: '年活跃数'
          }
        ]
      },
      easyDataOption: {
        span: 6,
        data: [
          {
            title: '分类统计',
            subtitle: '实时',
            count: 7993,
            allcount: 10222,
            text: '当前分类总记录数',
            color: 'rgb(49, 180, 141)',
            key: '类'
          },
          {
            title: '附件统计',
            subtitle: '实时',
            count: 3112,
            allcount: 10222,
            text: '当前上传的附件数',
            color: 'rgb(56, 161, 242)',
            key: '附'
          },
          {
            title: '文章统计',
            subtitle: '实时',
            count: 908,
            allcount: 10222,
            text: '评论次数',
            color: 'rgb(117, 56, 199)',
            key: '评'
          },
          {
            title: '新闻统计',
            subtitle: '实时',
            count: 908,
            allcount: 10222,
            text: '评论次数',
            color: 'rgb(59, 103, 164)',
            key: '新'
          }
        ]
      },
      easyDataOption0: {
        span: 6,
        borderColor: '#fff',
        data: [
          {
            name: '姓名1',
            src: 'static/img/mock/card/card-1.jpg',
            text: '介绍1'
          },
          {
            name: '姓名2',
            src: 'static/img/mock/card/card-2.jpg',
            text: '介绍2'
          },
          {
            name: '姓名3',
            src: 'static/img/mock/card/card-3.jpg',
            text: '介绍3'
          },
          {
            name: '姓名4',
            src: 'static/img/mock/card/card-4.jpg',
            text: '介绍4'
          }
        ]
      },
      easyDataOption1: {
        color: 'rgb(63, 161, 255)',
        span: 4,
        data: [
          {
            title: '今日注册',
            count: 12678,
            icon: 'icon-cuowu'
          },
          {
            title: '今日登录',
            count: 22139,
            icon: 'icon-shujuzhanshi2'
          },
          {
            title: '今日订阅',
            count: 35623,
            icon: 'icon-jiaoseguanli'
          },
          {
            title: '今日评论',
            count: 16826,
            icon: 'icon-caidanguanli'
          },
          {
            title: '今日评论',
            count: 16826,
            icon: 'icon-caidanguanli'
          },
          {
            title: '今日评论',
            count: 16826,
            icon: 'icon-caidanguanli'
          }
        ]
      },
      easyDataOption2: {
        color: 'rgb(63, 161, 255)',
        span: 4,
        discount: true,
        data: [
          {
            title: '错误日志',
            count: 12678,
            icon: 'icon-cuowu'
          },
          {
            title: '数据展示',
            count: 12678,
            icon: 'icon-shujuzhanshi2'
          },
          {
            title: '权限管理',
            count: 12678,
            icon: 'icon-jiaoseguanli'
          },
          {
            title: '菜单管理',
            count: 12678,
            icon: 'icon-caidanguanli'
          },
          {
            title: '权限测试',
            count: 12678,
            icon: 'icon-caidanguanli'
          },
          {
            title: '错误页面',
            count: 12678,
            icon: 'icon-caidanguanli'
          }
        ]
      },
      checkAll: false,
      checkedCities: ['上海', '北京'],
      cities: cityOptions,
      isIndeterminate: true,
      input: ''
    }
  },
  created() {},
  watch: {},
  mounted() {},
  computed: {},
  methods: {
    click() {
      this.cities = [{ cityName: '北京', cityCode: '4444' }, { cityName: '上海', cityCode: '55' },
        { cityName: '南京', cityCode: '66' }, { cityName: '深圳', cityCode: '77' }, { cityName: '安徽', cityCode: '88' },
        { cityName: '东方闪电', cityCode: '99' }]
    },
    change(val) {
      console.log(val)
      if (val === '') {
        this.cities = cityOptions
      }
      var arr = [], obj = {}
      for (var i = 0; i < this.cities.length; i++) {
        if (this.cities[i].cityName.indexOf(val) > -1) {
          obj = this.cities[i]
          arr.push(obj)
        }
      }
      this.cities = arr
    },
    handleCheckAllChange(val) {
      this.checkedCities = val ? cityOptions : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.cities.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length
    }
  }
}
</script>

<style scoped>
.item {
  margin-bottom: 16px;
}
</style>
<style lang ="scss">
    @import '../../styles/data-card.scss';
    @import '../../styles/data-display.scss';
    @import '../../styles/data-icons.scss';
    @import '../../styles/data-tabs.scss';
</style>
