<template>
  <div>
    <el-tooltip effect="dark" content="疑问" placement="bottom">
      <el-button class=" btn-text can-hover" type="text" @click="dialogVisible = true">
        <icon name="question-circle"/>
      </el-button>
    </el-tooltip>
    <el-dialog title="帮助" width="700px" :visible.sync="dialogVisible" append-to-body>
      <div style="margin-top: -25px;">
        联系我们
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Icon from '@/components/icon'
export default {
  name: 'nx-help',
  components: {
    Icon
  },
  data() {
    return {
      dialogVisible: false
    }
  }
}
</script>

<style lang="scss" scoped>
img {
  &.qr {
    width: 100%;
  }
}
 .btn-text {
        color: #5a5e66;
        &.can-hover {
          &:hover {
            color: #FFEBA4;
            background-color:#5a5e66;
          }
        }
      }

</style>
