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
    <!-- 表格 -->
    <el-row>
      <!-- <el-col span="1"></el-col> -->
      <el-col span="23" class="ml-20 mt-10">
        <el-table :data="items.slice(start, end)" style="width: 100%;">
          <!-- <el-table-column type="selection" min-width="10%" @selection-change="handleSelectionChange"> </el-table-column> -->
          <el-table-column label="公司名称" show-overflow-tooltip min-width="13%">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="公司logo" show-overflow-tooltip min-width="12%">
            <template slot-scope="scope">
              <el-popover placement="right" trigger="hover">
                <img :src="scope.row.logo" />
                <img slot="reference" :src="scope.row.logo" style="max-height: 50px;max-width: 50px" />
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="类型" show-overflow-tooltip min-width="12%">
            <template slot-scope="scope">
              <span>{{ scope.row.type }}</span>
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
    <div class="dialog" v-if="addcenterDialogVisible">
      <el-form label-width="80px" :model="company" class="dialog-form" style="background-color: white">
        <el-form-item required label="名称" prop="name">
          <el-input v-model="company.name"></el-input>
        </el-form-item>
        <el-form-item required label="是否上市" prop="tag">
          <el-input v-model="company.tag"></el-input>
        </el-form-item>
        <el-form-item required label="公司logo">
          <el-button size="small" type="primary" @click="selectavatar">点击上传</el-button>
          <!-- 隐藏的文件输入框 -->
          <input type="file" ref="upload" style="display:none;" @change="handlderFile()" />
          <img :src="company.logo" alt="" style="width: 50px; height: 50px; border-radius: 5px;" />
        </el-form-item>
        <el-form-item required label="公司人数" prop="workers">
          <el-input v-model="company.workers"></el-input>
        </el-form-item>
        <el-form-item required label="公司类型" prop="type">
          <el-input v-model="company.type"></el-input>
        </el-form-item>
        <el-form-item required label="公司描述" prop="description">
          <el-input v-model="company.description"></el-input>
        </el-form-item>
        <el-form-item required label="工作时间" prop="workingTime">
          <el-input v-model="company.workingTime"></el-input>
        </el-form-item>
        <el-form-item required label="是否加班" prop="workingStatus">
          <el-input v-model="company.workingStatus"></el-input>
        </el-form-item>
        <el-form-item required label="假期" prop="vacation">
          <el-input v-model="company.vacation"></el-input>
        </el-form-item>
        <el-form-item required label="公司地址" prop="address">
          <el-input v-model="company.address"></el-input>
        </el-form-item>
        <el-form-item class="tr">
          <el-button @click="addcenterDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCompany">确 定</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 详情弹出框 -->
    <div class="dialog" v-if="upcenterDialogVisible1">
      <el-form label-width="80px" :model="company1" class="dialog-form" style="background-color: white">
        <el-form-item required label="名称" prop="name">
          <el-input v-model="company1.name"></el-input>
        </el-form-item>
        <el-form-item required label="是否上市" prop="tag">
          <el-input v-model="company1.tag"></el-input>
        </el-form-item>
        <el-form-item required label="公司logo">
          <el-button size="small" type="primary" @click="selectavatar">点击更换</el-button>
          <!-- 隐藏的文件输入框 -->
          <input type="file" ref="upload" style="display:none;" @change="handlderFile()" />
          <img :src="company1.logo" alt="" style="width: 50px; height: 50px; border-radius: 5px;" />
        </el-form-item>
        <el-form-item required label="公司人数" prop="workers">
          <el-input v-model="company1.workers"></el-input>
        </el-form-item>
        <el-form-item required label="公司类型" prop="type">
          <el-input v-model="company1.type"></el-input>
        </el-form-item>
        <el-form-item required label="公司描述" prop="description">
          <el-input v-model="company1.description"></el-input>
        </el-form-item>
        <el-form-item required label="工作时间" prop="workingTime">
          <el-input v-model="company1.workingTime"></el-input>
        </el-form-item>
        <el-form-item required label="是否加班" prop="workingStatus">
          <el-input v-model="company1.workingStatus"></el-input>
        </el-form-item>
        <el-form-item required label="假期" prop="vacation">
          <el-input v-model="company1.vacation"></el-input>
        </el-form-item>
        <el-form-item required label="公司地址" prop="address">
          <el-input v-model="company1.address"></el-input>
        </el-form-item>
        <el-form-item class="tr">
          <el-button @click="upcenterDialogVisible1 = false">取 消</el-button>
          <el-button type="primary" @click="companyUpdate">确 定</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">公司信息删除不可恢复，是否确定删除？</div>
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
  name: 'Company',
  data() {
    return {
      items: [],
      items1: [],
      currentPage: 1,
      currentPageSize: 3,
      pageSize: 20,
      start: 0,
      end: 3,
      addcenterDialogVisible: false,
      upcenterDialogVisible1: false,
      delVisible: false,
      removeId: '',
      company: {
        name: '',
        tag: '',
        logo: '',
        workers: '',
        type: '',
        description: '',
        workingTime: '上午9:00-下午6:00',
        workingStatus: '弹性工作',
        jobNumbers: '',
        vacation: '双休',
        address: '南京',
        longitude: '',
        latitude: '',
        gmtCreate: this.global.formatDate(new Date())
      },
      company1: {
        pkCompanyId: '',
        name: '',
        tag: '',
        logo: '',
        workers: '',
        type: '',
        description: '',
        workingTime: '',
        workingStatus: '',
        jobNumbers: '',
        vacation: '',
        address: '',
        longitude: '',
        latitude: '',
        gmtCreate: ''
      }
    }
  },
  components: {},
  created() {
    this.getCompany()
  },
  mounted() {},
  methods: {
    //分页查询
    async getCompany() {
      this.data = { currentPage: this.currentPage, pageSize: this.pageSize }
      this.url = '/company/list'
      this.result = await API.init(this.url, this.data, 'post')
      this.items = this.result.data
      // console.log(this.items.length)
      for (let i = 0, len = this.items.length; i < len; i++) {
        this.items[i].gmtCreate = this.global.formatDate(this.items[i].gmtCreate)
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
    //新增公司
    async addCompany() {
      // console.log(JSON.parse(localStorage.getItem('user')))
      this.data = {
        name: this.company.name,
        tag: this.company.tag,
        logo: this.company.logo,
        workers: this.company.workers,
        type: this.company.type,
        description: this.company.description,
        workingTime: this.company.workingTime,
        workingStatus: this.company.workingStatus,
        jobNumbers: this.company.jobNumbers,
        vacation: this.company.vacation,
        address: this.company.address,
        longitude: this.company.longitude,
        latitude: this.company.latitude,
        gmtCreate: this.company.gmtCreate
      }
      this.url = '/company/add'
      this.result = await API.init(this.url, this.data, 'post')
      //添加临时变量
      // this.data.gmtCreate = new Date()
      // console.log(this.data.gmtCreate)
      this.items.splice(0, 0, this.data)
      this.addcenterDialogVisible = false
    },

    //编辑
    handleUpdate(index, row) {
      this.company1.logo = ''
      this.company1 = row //每一条数据的记录
      this.upcenterDialogVisible1 = true
    },
    //更新公司数据
    async companyUpdate() {
      // console.log(JSON.parse(localStorage.getItem('user')))
      this.data = {
        id: this.company1.pkCompanyId,
        name: this.company1.name,
        tag: this.company1.tag,
        logo: this.company1.logo,
        workers: this.company1.workers,
        type: this.company1.type,
        description: this.company1.description,
        workingTime: this.company1.workingTime,
        workingStatus: this.company1.workingStatus,
        jobNumbers: this.company1.jobNumbers,
        vacation: this.company1.vacation,
        address: this.company1.address,
        longitude: this.company1.longitude,
        latitude: this.company1.latitude,
        gmtCreate: this.company1.gmtCreate
      }
      console.log(this.data)
      this.url = '/company/update'
      this.result = await API.init(this.url, this.data, 'post')
      this.upcenterDialogVisible1 = false
    },
    //删除
    handleDelete(index, row) {
      this.removeId = this.items1.indexOf(row)
      // alert(this.removeId)
      this.delVisible = true
      this.company1 = row //每一条数据的记录
    },
    async deleteRow() {
      // alert(this.removeId)
      this.data = {
        id: this.company1.pkCompanyId
      }
      console.log(this.data)
      this.url = '/company/remove'
      this.result = await API.init(this.url, this.data, 'post')
      this.items.splice(this.removeId, 1)
      this.delVisible = false
    },
    //上传logo
    selectavatar() {
      this.$refs.upload.click()
    },
    handlderFile() {
      this.getClient()
      this.file = this.$refs.upload.files[0]
      // console.log(this.file)
      var _this = this
      async function put() {
        // alert(11)
        try {
          let result = await _this.client.put(_this.$refs.upload.files[0].name, _this.file)
          _this.company.logo = result.url
          _this.company1.logo = result.url
        } catch (e) {
          alert('文件上传成功')
          // console.log(e)
        }
      }
      put()
    },
    getClient() {
      let OSS = require('ali-oss')
      this.client = new OSS({
        region: 'oss-cn-beijing',
        accessKeyId: 'LTAIaG9RkwvVwXq6',
        accessKeySecret: '5WPkPJ4JY0nWciRfDpMFxzScm3oJn2',
        bucket: 'zhent-img'
      })
    }
  },
  computed: {}
}
</script>

<style scoped>
.dialog-form {
  border-radius: 5px;
  background-color: white;
  width: 700px;
  height: 800px;
  padding: 20px;
}

.dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10000;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
}
</style>
