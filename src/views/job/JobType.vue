<template>
  <div>
    <el-row class="df-jr-ac ml-20 mt-10">
      <el-col class="tl">
        <el-button type="primary" icon="el-icon-plus" @click="addcenterDialogVisible = true" size="mini">
          <span class="light-font-color">新增</span>
        </el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-row>
      <el-col span="23" class="ml-20 mt-10">
        <el-table :data="items.slice(start, end)" style="width: 100%;">
          <el-table-column label="名称" show-overflow-tooltip min-width="13%">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="gmtCreate" label="创建时间" min-width="15%" show-overflow-tooltip> </el-table-column>
          <el-table-column label="操作" show-overflow-tooltip min-width="23%">
            <template slot-scope="scope">
              <el-button size="mini" type="success" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
              <!-- <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row class="df-jl-ac mt-20 ml-20">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[3, 5, 8]"
        :page-size="3"
        layout="total, sizes, prev, pager, next, jumper"
        :total="items.length"
        @next-click="nextPage()"
      >
      </el-pagination>
    </el-row>
    <!-- 增加弹出框 -->
    <el-dialog title="新增职位类型" :visible.sync="addcenterDialogVisible" width="50%" center>
      <el-form label-width="80px" :model="jobType">
        <el-form-item required label="名称" prop="name">
          <el-input v-model="jobType.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addcenterDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addType">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改弹出框 -->
    <el-dialog title="编辑类型" :visible.sync="updatecenterDialogVisible" width="50%" center>
      <el-form label-width="80px" :model="jobType1">
        <el-form-item required label="名称" prop="name">
          <el-input v-model="jobType1.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updatecenterDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="typeUpdate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
const API = require('../utils/api')
export default {
  name: 'JobType',
  data() {
    return {
      items: [],
      items1: [],
      currentPage: 1,
      currentPageSize: 3,
      pageSize: 100,
      start: 0,
      end: 3,
      addcenterDialogVisible: false,
      updatecenterDialogVisible: false,
      jobType: {
        name: '',
        gmtCreate: this.global.formatDate(new Date())
      },
      jobType1: {
        pkJobTypeId: '',
        name: '',
        gmtCreate: ''
      }
    }
  },
  components: {},
  created() {
    this.getJobType()
  },
  mounted() {},
  methods: {
    //职位类型
    async getJobType() {
      this.data = { currentPage: this.currentPage, pageSize: this.pageSize }
      this.url = '/jobType/list'
      this.result = await API.init(this.url, this.data, 'post')
      this.items = this.result.data
      this.items1 = this.result.data
      //   console.log(this.result.data)
      for (let i = 0, len = this.items.length; i < len; i++) {
        this.items[i].gmtCreate = this.global.formatDate(this.items[i].gmtCreate)
        this.items1[i].gmtCreate = this.global.formatDate(this.items1[i].gmtCreate)
      }
    },
    //下一页
    nextPage() {
      this.currentPage += 1
      this.start += this.pageSize1
      this.end += this.pageSize1
      let num = this.appList.length / this.currentPageSize - 1
      if (this.currentPage === num) {
        this.currentPage1 += 1
        // this.getAppAll()
      }
      /* alert(this.start)
      alert(this.end) */
    },
    //改变每页的数据条数
    handleSizeChange(val) {
      this.start = (this.currentPage - 1) * val
      this.end = this.currentPage * val
      this.currentPageSize = val
    },
    //选择页数
    handleCurrentChange(val) {
      this.currentPage = val
      this.start = (this.currentPage - 1) * this.currentPageSize
      this.end = this.currentPage * this.currentPageSize
    },
    //新增职位类型
    async addType() {
      this.data = {
        field: this.jobType.name
      }
      this.url = '/jobType/add'
      this.result = await API.init(this.url, this.data, 'post')
      //添加临时变量
      this.items.splice(0, 0, this.jobType)
      this.addcenterDialogVisible = false
    },
    //编辑
    handleUpdate(index, row) {
      this.jobType1 = row //每一条数据的记录
      this.updatecenterDialogVisible = true
    },
    //更新兼职数据
    async typeUpdate() {
      // console.log(JSON.parse(localStorage.getItem('user')))
      this.data = {
        id: this.jobType1.pkJobTypeId,
        field: this.jobType1.name
      }
      console.log(this.data)
      this.url = '/jobType/update'
      this.result = await API.init(this.url, this.data, 'post')
      this.updatecenterDialogVisible = false
    }
  },
  computed: {}
}
</script>

<style scoped lang="scss"></style>
