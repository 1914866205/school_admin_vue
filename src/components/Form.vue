<template>
  <div>
    <el-dialog title="新增楼栋信息" :visible.sync="dialogFormVisible" width="600px" center="true">
      <el-form :model="tower" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="楼栋名" prop="name">
          <el-input v-model="tower.name"></el-input>
        </el-form-item>
        <el-form-item label="经度" prop="longitude">
          <el-input v-model="tower.longitude"></el-input>
        </el-form-item>
        <el-form-item label="纬度" prop="latitude">
          <el-input v-model="tower.latitude"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <!-- <el-input v-model="tower.type"></el-input> -->
          <el-select v-model="towerType" placeholder="请选择">
            <el-option v-for="item in towerTypes" :key="item" :label="item" :value="item"> </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="createTower()">立即创建</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Bus from '../js/bus'
export default {
  name: 'Form',
  data() {
    return {
      tower: {
        name: '',
        longitude: '',
        latitude: '',
        type: '',
        id: 0
      },
      towerType: '',
      towerTypes: ['教学楼', '宿舍楼'],
      type: 0,
      flag: 0,
    }
  },
  components: {},
  created() {},
  mounted() {
    var _this = this
    Bus.$on('updateTowerInfo', function(info) {
      _this.tower.name = info.name
      _this.tower.longitude = info.longitude
      _this.tower.latitude = info.latitude
      _this.tower.id = info.pkTowerId
      if(info.type == 1){
        _this.towerType = '教学楼'
      }else {
        _this.towerType = '宿舍楼'
      }
      _this.dialogFormVisible = true
      _this.flag = 1
    })
  },
  props: ['dialogFormVisible'],
  methods: {
    createTower() {
      if(this.flag == 0){
        this.addTowerInfo()
    }else {
        this.updateTowerInfo()
    }
    },
    addTowerInfo(){
      if(this.towerType == '教学楼'){
        this.type = 1
      }else {
        this.type = 2
      }
      this.axios({
        method: 'post',
        url: 'http://localhost:8080/tower/increase',
        data: {
          name: this.tower.name,
          longitude: this.tower.longitude,
          latitude: this.tower.latitude,
          type: this.type
        }
      }).then((res) => {
        if (res.data.code == 1) {
          this.$message({
            message: '楼栋信息新增成功',
            type: 'success'
          })
          this.dialogFormVisible = false
          this.$parent.getTowerList()
        }
      })
    },
    updateTowerInfo(){
      this.axios({
        method: 'put',
        url: 'http://localhost:8080/tower/single',
        data: {
          pkTowerId: this.tower.id, 
          name: this.tower.name,
          longitude: this.tower.longitude,
          latitude: this.tower.latitude,
          type: this.type
        }
      }).then((res) => {
        if (res.data.code == 1) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.dialogFormVisible = false
          this.$parent.getTowerList()
        }
      })
    }
  },
  computed: {}
}
</script>

<style scoped lang="scss"></style>
