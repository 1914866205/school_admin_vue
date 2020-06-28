<template>
  <el-row class="row">
    <el-row>
      <el-col :span="1"> </el-col>
      <el-col :span="23">
        <el-table ref="multipleTable" :data="towerList.slice(start, end)" tooltip-effect="dark" style="width: 100%">
          <el-table-column label="楼栋名">
            <template slot-scope="scope">{{ scope.row.name }}</template>
          </el-table-column>
          <el-table-column label="经度">
            <template slot-scope="scope">{{ scope.row.longitude }}</template>
          </el-table-column>
          <el-table-column label="纬度">
            <template slot-scope="scope">{{ scope.row.latitude }}</template>
          </el-table-column>
          <el-table-column label="创建时间">
            <template slot-scope="scope">{{ scope.row.gmtCreate }}</template>
          </el-table-column>
          <el-table-column align="right">
            <template slot="header" slot-scope>
              <input type="text" v-model="search" @input="filterSearch()" style="height: 30px; width: 200px" placeholder="输入关键字搜索" />
            </template>
            <template slot-scope="scope">
              <p style="text-align:center">
                <el-button size="mini" icon="el-icon-edit" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button size="mini" icon="el-icon-delete" type="danger" @click="handleDelete(scope.row)">删除</el-button>
              </p>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!-- 分页 -->
    <el-row>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        @prev-click="upPage()"
        @next-click="nextPage()"
        :page-size="size"
        layout="prev, pager, next, jumper"
        :total="towerList.length"
      ></el-pagination>
    </el-row>
  </el-row>
</template>

<script>
import Bus from '../js/bus'
export default {
  name: 'Table',
  data() {
    return {
      start: 0,
      end: 10,
      search: '',
      size: 10,
      currentPage: 1
    }
  },
  components: {},
  created() {
    console.log(this.towerList)
  },
  mounted() {},
  props: ['towerList'],
  methods: {
    handleEdit(row) {
      Bus.$emit('updateTowerInfo', row)
    },
    //删除
    handleDelete(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios({
          method: 'delete',
          url: 'http://localhost:8080/tower/id/' + row.pkTowerId
        }).then((res) => {
          if (res.data.code == 1) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
          let index = this.towerList.indexOf(row)
          this.towerList.splice(index, 1)
        })
      })
    },
    //上一页
    upPage() {
      this.start -= 10
      this.end -= 10
      this.currentPage -= 1
    },
    //下一页
    nextPage() {
      this.start += 10
      this.end += 10
      this.currentPage += 1
    },
    //输出页面跳转
    handleCurrentChange() {
      this.start = this.currentPage * 10 - 10
      this.end = this.currentPage * 10
    },
    //过滤方法
    //过滤搜索
    filterSearch() {
      //数组元素按条件过滤
      this.towerList = this.towerList.filter((v) => {
        // console.log(JSON.stringify(v))
        if (JSON.stringify(v).includes(this.search)) {
          return v
        }
      })
    },
  },
  computed: {}
}
</script>

<style scoped lang="scss"></style>
