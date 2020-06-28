<template>
  <div>
    <el-dialog title="新增房间信息" :visible.sync="dialogFormVisible" width="600px" center="true">
      <el-form :model="room" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="房间号" prop="name">
          <el-input v-model="room.name"></el-input>
        </el-form-item>
        <el-form-item label="楼栋名" prop="longitude">
          <el-input v-model="room.towerName"></el-input>
        </el-form-item>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="createTower()">立即创建</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Bus from '@/js/bus'
export default {
  name: 'Form',
  data() {
    return {
      room: {
        name: ''
      }
    }
  },
  components: {},
  created() {},
  mounted() {
    var _this = this
    Bus.$on('updateTowerInfo', function(info) {
      _this.room.name = info.name
      _this.dialogFormVisible = true
    })
  },
  props: ['dialogFormVisible'],
  methods: {
    createTower() {
      alert(1)
      this.axios({
        method: 'post',
        url: 'http://localhost:8080/tower/increase',
        data: {
          name: this.tower.name,
          longitude: this.tower.longitude,
          latitude: this.tower.latitude,
          type: this.tower.type
        }
      }).then((res) => {
        if (res.data.code == 1) {
          this.$message({
            message: '楼栋信息新增成功',
            type: 'success'
          })
          this.dialogFormVisible = false
        }
      })
    }
  },
  computed: {}
}
</script>

<style scoped lang="scss"></style>
