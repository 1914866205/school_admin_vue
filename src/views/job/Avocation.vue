<template>
  <div>
    <!-- 操作按钮 -->
    <el-row class="df-jr-ac ml-20 mt-10">
      <el-col class="tl">
        <el-button type="primary" icon="el-icon-plus" @click="addcenterDialogVisible = true" size="mini">
          <span class="light-font-color">新增</span>
        </el-button>
      </el-col>
      <!-- <el-col class="tr mr-20">
        <el-button size="mini" style="width: 45px" class="search-btn" @click="searchShow = !searchShow" @mouseover="searchOver()">
          <i class="el-icon-search" style="color: white"></i>
        </el-button>
        <el-button icon="el-icon-refresh" size="small" @click="flush()"></el-button>
      </el-col> -->
    </el-row>
    <!-- 增加弹出框 -->
    <el-dialog title="新增兼职" :visible.sync="addcenterDialogVisible" width="50%" center>
      <el-form label-width="80px" :model="avocation">
        <el-form-item required label="名称" prop="name">
          <el-input v-model="avocation.name"></el-input>
        </el-form-item>
        <el-form-item required label="描述" prop="description">
          <el-input v-model="avocation.description"></el-input>
        </el-form-item>
        <el-form-item required label="工作地点" prop="workplace">
          <el-input v-model="avocation.workplace"></el-input>
        </el-form-item>
        <el-form-item required label="工作日期" prop="workingDate">
          <el-input v-model="avocation.workingDate"></el-input>
        </el-form-item>
        <el-form-item required label="工作时间" prop="workingTime">
          <el-input v-model="avocation.workingTime"></el-input>
        </el-form-item>
        <el-form-item required label="薪资" prop="pay">
          <el-input v-model="avocation.pay"></el-input>
        </el-form-item>
        <el-form-item required label="结算类型" prop="payType">
          <el-input v-model="avocation.payType"></el-input>
        </el-form-item>
        <el-form-item required label="兼职类型" prop="jobType">
          <el-input v-model="avocation.jobType"></el-input>
        </el-form-item>
        <el-form-item required label="招收总数" prop="number">
          <el-input v-model="avocation.number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addcenterDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="avocationAdd">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改弹出框 -->
    <el-dialog title="编辑兼职" :visible.sync="updatecenterDialogVisible" width="50%" center>
      <el-form label-width="80px" :model="avocation1">
        <el-form-item required label="名称" prop="name">
          <el-input v-model="avocation1.name"></el-input>
        </el-form-item>
        <el-form-item required label="描述" prop="description">
          <el-input v-model="avocation1.description"></el-input>
        </el-form-item>
        <el-form-item required label="工作地点" prop="workplace">
          <el-input v-model="avocation1.workplace"></el-input>
        </el-form-item>
        <el-form-item required label="工作日期" prop="workingDate">
          <el-input v-model="avocation1.workingDate"></el-input>
        </el-form-item>
        <el-form-item required label="工作时间" prop="workingTime">
          <el-input v-model="avocation1.workingTime"></el-input>
        </el-form-item>
        <el-form-item required label="薪资" prop="pay">
          <el-input v-model="avocation1.pay"></el-input>
        </el-form-item>
        <el-form-item required label="结算类型" prop="payType">
          <el-input v-model="avocation1.payType"></el-input>
        </el-form-item>
        <el-form-item required label="兼职类型" prop="jobType">
          <el-input v-model="avocation1.jobType"></el-input>
        </el-form-item>
        <el-form-item required label="招收总数" prop="number">
          <el-input v-model="avocation1.number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updatecenterDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="avocationUpdate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 表格 -->
    <el-row>
      <!-- <el-col span="1"></el-col> -->
      <el-col span="23" class="ml-20 mt-10">
        <el-table :data="items.slice(start, end)" style="width: 100%;">
          <!-- <el-table-column type="selection" min-width="10%"> </el-table-column> -->
          <el-table-column label="名称" show-overflow-tooltip min-width="13%">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="负责人" show-overflow-tooltip min-width="12%">
            <template slot-scope="scope">
              <span>{{ scope.row.bossName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="类型" show-overflow-tooltip min-width="12%">
            <template slot-scope="scope">
              <span>{{ scope.row.jobType }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="gmtCreate" label="创建时间" min-width="15%" show-overflow-tooltip> </el-table-column>

          <el-table-column label="操作" show-overflow-tooltip min-width="23%">
            <template slot-scope="scope">
              <el-button size="mini" type="success" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
        @prev-click="prevPage()"
        @next-click="nextPage()"
      >
      </el-pagination>
    </el-row>
    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">职位信息删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRow">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
const API = require('../utils/api')
export default {
  name: 'Avocation',
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
      delVisible: false,
      removeId: '',
      avocation: {
        name: '',
        description: '',
        bossId: '',
        bossName: '',
        bossPhone: '',
        bossAvatar: '',
        workplace: '不限工作地点',
        workingDate: '不限工作日期',
        workingTime: '不限工作时间',
        jobType: '',
        number: '',
        pay: '',
        payType: '日结',
        gmtCreate: this.global.formatDate(new Date())
      },
      avocation1: {
        pkPartJobId: '',
        name: '',
        description: '',
        workplace: '',
        workingDate: '',
        workingTime: '',
        jobType: '',
        number: '',
        pay: '',
        payType: '',
        gmtCreate: ''
      }
    }
  },
  components: {},
  created() {
    this.getAvocation()
  },
  mounted() {},
  methods: {
    //分页查询
    async getAvocation() {
      this.data = { currentPage: this.currentPage, pageSize: this.pageSize }
      this.url = '/partJob/list'
      this.result = await API.init(this.url, this.data, 'post')
      this.items = this.result.data
      this.items1 = this.result.data
      // console.log(this.result.data)
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
        this.getAppAll()
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
    //新增兼职
    async avocationAdd() {
      // console.log(JSON.parse(localStorage.getItem('user')))
      this.data = {
        name: this.avocation.name,
        description: this.avocation.description,
        bossId: JSON.parse(localStorage.getItem('user')).pkUserId,
        bossName: JSON.parse(localStorage.getItem('user')).sysUserName,
        bossPhone: JSON.parse(localStorage.getItem('user')).sysUserPhoneNumber,
        bossAvatar: JSON.parse(localStorage.getItem('user')).sysUserAvatar,
        workplace: this.avocation.workplace,
        workingDate: this.avocation.workingDate,
        workingTime: this.avocation.workingTime,
        jobType: this.avocation.jobType,
        number: this.avocation.number,
        pay: this.avocation.pay,
        payType: this.avocation.payType,
        gmtCreate: this.avocation.gmtCreate
      }
      this.url = '/partJob/add'
      this.result = await API.init(this.url, this.data, 'post')
      //添加临时变量
      // this.items.splice(0, 0, this.data).gmtCreate = this.avocation.gmtCreate
      this.items.splice(0, 0, this.data)
      this.addcenterDialogVisible = false
    },
    //更新兼职数据
    async avocationUpdate() {
      // console.log(JSON.parse(localStorage.getItem('user')))
      this.data = {
        id: this.avocation1.pkPartJobId,
        name: this.avocation1.name,
        description: this.avocation1.description,
        workplace: this.avocation1.workplace,
        workingDate: this.avocation1.workingDate,
        workingTime: this.avocation1.workingTime,
        jobType: this.avocation1.jobType,
        number: this.avocation1.number,
        pay: this.avocation1.pay,
        payType: this.avocation1.payType
      }
      console.log(this.data)
      this.url = '/partJob/update'
      this.result = await API.init(this.url, this.data, 'post')
      this.updatecenterDialogVisible = false
    },
    //编辑
    handleUpdate(index, row) {
      // this.avocation.id = index
      // console.log('sdhfkjshk' + row.pkPartJobId)
      this.avocation1.id = row.pkPartJobId
      this.avocation1 = row //每一条数据的记录
      this.updatecenterDialogVisible = true
    },
    //删除
    handleDelete(index, row) {
      //定位要删除的数据
      this.removeId = this.items1.indexOf(row)
      this.delVisible = true
      this.avocation1 = row //每一条数据的记录
    },
    async deleteRow() {
      alert(this.removeId)
      this.data = {
        id: this.avocation1.pkPartJobId
      }
      console.log(this.data)
      this.url = '/partJob/remove'
      this.result = await API.init(this.url, this.data, 'post')
      this.delVisible = false
      this.items.splice(this.removeId, 1)
    }
  },
  computed: {}
}
</script>

<style scoped lang="scss"></style>
