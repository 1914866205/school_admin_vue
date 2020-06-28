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
          <el-table-column label="负责人" show-overflow-tooltip min-width="12%">
            <template slot-scope="scope">
              <span>{{ scope.row.boss }}</span>
            </template>
          </el-table-column>
          <el-table-column label="类型" show-overflow-tooltip min-width="12%">
            <template slot-scope="scope">
              <span>{{ scope.row.jobType.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="所属公司" show-overflow-tooltip min-width="12%">
            <template slot-scope="scope">
              <span>{{ scope.row.company.name }}</span>
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
    <!-- 增加弹出框 -->
    <el-dialog title="新增职位" :visible.sync="addcenterDialogVisible" width="50%" center>
      <el-form label-width="80px" :model="job">
        <el-form-item required label="名称" prop="name">
          <el-input v-model="job.name"></el-input>
        </el-form-item>
        <el-form-item required label="描述" prop="description">
          <el-input v-model="job.description"></el-input>
        </el-form-item>
        <el-form-item required label="公司">
          <el-select v-model="job.companyId" placeholder="请选择" @change="changeCompany">
            <el-option v-for="item in companys" :key="item.pkCompanyId" :label="item.name" :value="item.pkCompanyId"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item required label="工作地点" prop="workplace">
          <el-input v-model="job.workplace"></el-input>
        </el-form-item>
        <el-form-item required label="工作时间" prop="workingTime">
          <el-input v-model="job.workingTime"></el-input>
        </el-form-item>
        <el-form-item required label="最低薪资(单位K)" prop="min">
          <el-input v-model="job.min"></el-input>
        </el-form-item>
        <el-form-item required label="最高薪资(单位K)" prop="max">
          <el-input v-model="job.max"></el-input>
        </el-form-item>
        <el-form-item required label="经验" prop="experience">
          <el-input v-model="job.experience"></el-input>
        </el-form-item>
        <el-form-item required label="学历" prop="diploma">
          <el-input v-model="job.diploma"></el-input>
        </el-form-item>
        <el-form-item required label="类型" prop="type">
          <el-select v-model="job.jobTypeId" placeholder="请选择" @change="changeType">
            <el-option v-for="item in types" :key="item.pkJobTypeId" :label="item.name" :value="item.pkJobTypeId"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item required label="需要人数" prop="number">
          <el-input v-model="job.number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addcenterDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addJob">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑弹出框 -->
    <el-dialog title="编辑职位" :visible.sync="updatecenterDialogVisible" width="50%" center>
      <el-form label-width="80px" :model="job">
        <el-form-item required label="名称" prop="name">
          <el-input v-model="job1.name"></el-input>
        </el-form-item>
        <el-form-item required label="描述" prop="description">
          <el-input v-model="job1.description"></el-input>
        </el-form-item>
        <el-form-item required label="公司">
          <el-select v-model="job1.company.name" placeholder="请选择" @change="changeCompany">
            <el-option v-for="item in companys" :key="item.pkCompanyId" :label="item.name" :value="item.pkCompanyId"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item required label="工作地点" prop="workplace">
          <el-input v-model="job1.workplace"></el-input>
        </el-form-item>
        <el-form-item required label="工作时间" prop="workingTime">
          <el-input v-model="job1.workingTime"></el-input>
        </el-form-item>
        <el-form-item required label="最低薪资(单位K)" prop="min">
          <el-input v-model="job1.min"></el-input>
        </el-form-item>
        <el-form-item required label="最高薪资(单位K)" prop="max">
          <el-input v-model="job1.max"></el-input>
        </el-form-item>
        <el-form-item required label="经验" prop="experience">
          <el-input v-model="job1.experience"></el-input>
        </el-form-item>
        <el-form-item required label="学历" prop="diploma">
          <el-input v-model="job1.diploma"></el-input>
        </el-form-item>
        <el-form-item required label="类型">
          <el-select v-model="job1.jobType.pkJobTypeId" placeholder="请选择" @change="changeType">
            <el-option v-for="item in types" :key="item.pkJobTypeId" :label="item.name" :value="item.pkJobTypeId"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item required label="需要人数" prop="number">
          <el-input v-model="job1.number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updatecenterDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateJob">确 定</el-button>
      </span>
    </el-dialog>
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
  name: 'Job',
  data() {
    return {
      items: [],
      items1: [],
      type: '',
      types: [],
      company: '',
      companys: [],
      currentPage: 1,
      currentPageSize: 3,
      pageSize: 200,
      start: 0,
      end: 3,
      addcenterDialogVisible: false,
      updatecenterDialogVisible: false,
      delVisible: false,
      removeId: '',
      job: {
        name: '',
        companyId: '',
        description: '',
        workplace: '',
        workingTime: '上午9:00-下午6:00',
        min: '',
        max: '',
        experience: '经验不限',
        diploma: '大专',
        jobTypeId: '',
        number: ''
      },
      jobAdd: {
        name: '',
        boss: '',
        company: {
          name: ''
        },
        gmtCreate: this.global.formatDate(new Date()),
        jobType: {
          name: ''
        }
      },
      job1: {
        pkJobId: '',
        name: '',
        description: '',
        boss: '',
        bossPhone: '',
        company: {
          pkCompanyId: '',
          name: ''
        },
        workplace: '',
        workingTime: '',
        min: '',
        max: '',
        experience: '',
        diploma: '',
        jobType: {
          pkJobTypeId: '',
          name: ''
        },
        number: ''
      }
    }
  },
  components: {},
  created() {
    this.getJob()
    this.getJobType()
    this.getCompany()
  },
  mounted() {},
  methods: {
    //分页查询
    async getJob() {
      this.data = {
        field: 'gmt_create',
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      this.url = '/job/list'
      this.result = await API.init(this.url, this.data, 'post')
      this.items = this.result.data
      this.items1 = this.result.data
      console.log(this.result.data)
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
    //职位类型
    async getJobType() {
      this.data = { currentPage: this.currentPage, pageSize: this.pageSize }
      this.url = '/jobType/list'
      this.result = await API.init(this.url, this.data, 'post')
      this.types = this.result.data
      //   console.log(this.result.data)
    },
    //公司查询
    async getCompany() {
      this.data = {
        currentPage: 1,
        pageSize: 20
      }
      this.url = '/company/list'
      this.result = await API.init(this.url, this.data, 'post')
      this.companys = this.result.data
    },
    //获取公司名称
    changeCompany(item) {
      console.log(item)
      //公司过滤器
      this.companys.filter((v) => {
        if (v.pkCompanyId === item) {
          this.company = v.name
        }
      })
      this.job1.company.pkCompanyId = item
      // console.log(this.)
    },
    //获取类型名称
    changeType(item) {
      console.log(item)
      //类型过滤器
      this.types.filter((v) => {
        if (v.pkJobTypeId === item) {
          this.type = v.name
        }
      })
      this.job1.jobType.pkJobTypeId
      console.log(this.type)
    },
    async addJob() {
      // alert(this.job.companyId)
      // console.log(this.company)
      this.data = {
        name: this.job.name,
        description: this.job.description,
        boss: JSON.parse(localStorage.getItem('user')).sysUserName,
        bossPhone: JSON.parse(localStorage.getItem('user')).sysUserPhoneNumber,
        bossAvatar: JSON.parse(localStorage.getItem('user')).sysUserAvatar,
        companyId: this.job.companyId,
        workplace: this.job.workplace,
        workingTime: this.job.workingTime,
        min: this.job.min,
        max: this.job.max,
        experience: this.job.experience,
        diploma: this.job.diploma,
        jobTypeId: this.job.jobTypeId,
        number: this.job.number
      }
      console.log(this.data)
      this.url = '/job/add'
      this.result = await API.init(this.url, this.data, 'post')
      //添加临时变量
      this.jobAdd.name = this.data.name
      this.jobAdd.boss = this.data.boss
      this.jobAdd.company.name = this.company
      this.jobAdd.jobType.name = this.type
      this.items.splice(0, 0, this.jobAdd)
      this.addcenterDialogVisible = false
    },
    //编辑
    handleUpdate(index, row) {
      this.job1 = row //每一条数据的记录
      this.updatecenterDialogVisible = true
    },
    async updateJob() {
      // alert(this.job.companyId)
      // console.log(this.company)
      this.data = {
        id: this.job1.pkJobId,
        name: this.job1.name,
        description: this.job1.description,
        companyId: this.job1.company.pkCompanyId,
        workplace: this.job1.workplace,
        workingTime: this.job1.workingTime,
        min: this.job1.min,
        max: this.job1.max,
        experience: this.job1.experience,
        diploma: this.job1.diploma,
        jobTypeId: this.job1.jobType.pkJobTypeId,
        number: this.job1.number
      }
      console.log(this.data)
      this.url = '/job/update'
      this.result = await API.init(this.url, this.data, 'post')
      this.updatecenterDialogVisible = false
    },
    //删除
    handleDelete(index, row) {
      this.removeId = this.items1.indexOf(row)
      // alert(this.removeId)
      this.delVisible = true
      this.job1 = row //每一条数据的记录
    },
    async deleteRow() {
      // alert(this.removeId)
      this.data = {
        id: this.job1.pkJobId
      }
      console.log(this.data)
      this.url = '/job/remove'
      this.result = await API.init(this.url, this.data, 'post')
      this.items.splice(this.removeId, 1)
      this.delVisible = false
    }
  },
  computed: {}
}
</script>

<style scoped lang="scss"></style>
