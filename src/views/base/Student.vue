<template>
  <div style="width:100%">
    <el-row type="flex" class="ml-20 mt-10">
      <el-input
        prefix-icon="el-icon-search"
        @input="filterSearch"
        v-model="blurSearch"
        placeholder="请输入内容"
        v-if="searchShow"
        class="blur-search"
      ></el-input>
      <el-select v-model="search.status" placeholder="请选择" v-if="searchShow" class="statu-search ml-10">
        <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-button type="success" size="mini" class="ml-10" icon="el-icon-search" v-if="searchShow" @click="searchByStatus">搜索</el-button>
    </el-row>
    <el-row class="df-jr-ac ml-20 mt-10">
      <el-col class="tl">
        <el-button type="primary" icon="el-icon-plus" @click="openDialog" size="mini">
          <span class="light-font-color">新增</span>
        </el-button>
        <el-button type="warning" icon="el-icon-download" size="mini" @click="exportStudentInfo()">
          <span class="light-font-color">导出</span>
        </el-button>
      </el-col>
      <el-col class="tr mr-20">
        <el-button icon="el-icon-refresh" size="small"></el-button>
      </el-col>
    </el-row>
    <!-- 表格展示 -->
    <el-row>
      <el-col span="1"></el-col>
      <el-col span="23" class="ml-20 mt-10">
        <el-table :data="studentList.slice(start, end)" stripe="true" style="width: 100%;" class="light-small-font">
          <el-table-column type="selection" min-width="5%" @selection-change="handleSelectionChange"> </el-table-column>
          <el-table-column label="姓名" show-overflow-tooltip min-width="10%">
            <template slot-scope="scope">
              <span style="margin-left:-5%">{{ scope.row.userName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="学号" show-overflow-tooltip min-width="15%">
            <template slot-scope="scope">
              <span>{{ scope.row.jobNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="手机号" show-overflow-tooltip min-width="15%">
            <template slot-scope="scope">
              <span>{{ scope.row.phoneNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="班级" show-overflow-tooltip min-width="10%">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" show-overflow-tooltip min-width="10%">
            <template slot-scope="scope">
              <el-switch @change="changeStatus(scope.row)" v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="gmtCreate" label="创建时间" min-width="15%" show-overflow-tooltip align="center"> </el-table-column>

          <el-table-column label="操作" show-overflow-tooltip min-width="20%" align="center">
            <template slot-scope="scope">
              <el-button size="mini" icon="el-icon-edit" type="primary" @click="handleEdit(scope.row)">
                <span class="light-font-color">编辑</span>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row class="df-jl-ac mt-10">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[8, 16]"
        :page-size="pageSize"
        layout="total, prev, pager, next, sizes"
        :total="studentList.length"
        @prev-click="prevPage()"
        @next-click="nextPage()"
      ></el-pagination>
    </el-row>
    <!-- 新增页面 -->
    <div class="dialog" v-if="dialogFormVisible">
      <el-form class="mt-10 dialog-form dc-jc-ac" :model="adminInfo" style="padding: 0px 20px;">
        <p style="width: 90%;" class="dark-large-font tl">{{ msg }}用户</p>
        <el-form-item required label="姓名" class="mt-20" :label-width="formLabelWidth" style="width: 90%; height: 40px">
          <el-input v-model="userAccountVo.userName" autocomplete="off" placeholder="请输入用户名" style="width: 80%"></el-input>
          <p style="width: 90%; display:flex">
            <span style="display: block; width: 20%"></span>
            <span style="display: block; height: 20px; margin-top: -10px; width: 80%; color:red;" v-if="rules.nameErrorShow" class="tl"
              >{{ errorInfo.nameErrorInfo }}
            </span>
          </p>
        </el-form-item>
        <el-form-item required label="学号" :label-width="formLabelWidth" style="width: 90%; height: 40px">
          <el-input
            v-model="userAccountVo.jobNumber"
            oninput="value=value.replace(/[^\d]/g,'')"
            autocomplete="off"
            maxlength="10"
            placeholder="请输入10位数学号"
            style="width: 80%"
          ></el-input>
          <p style="width: 90%; display:flex">
            <span style="display: block; width: 20%"></span>
            <span style="display: block; height: 20px; margin-top: -10px; width: 80%; color:red;" v-if="rules.jobNumberErrorShow" class="tl"
              >{{ errorInfo.jobNumberErrorInfo }}
            </span>
          </p>
        </el-form-item>
        <el-form-item required label="电话" :label-width="formLabelWidth" style="width: 90%; height:40px">
          <el-input
            oninput="value=value.replace(/[^\d]/g,'')"
            @input="checkPhone(userAccountVo.phoneNumber)"
            v-model="userAccountVo.phoneNumber"
            autocomplete="off"
            placeholder="请输入手机号"
            maxlength="11"
            style="width: 80%"
          ></el-input>
          <p style="width: 90%; display:flex">
            <span style="display: block; width: 20%"></span>
            <span
              style="display: block; height: 20px; margin-top: -10px; width: 80%; color:red;"
              v-if="rules.phoneNumberErrorShow"
              class="tl"
              >{{ errorInfo.phoneNumberErrorInfo }}
            </span>
          </p>
        </el-form-item>
        <p style="width: 90%" class="df-jr-ac">
          <el-form-item required label="性别" :label-width="formLabelWidth" style="width: 50%;">
            <el-select v-model="userAccountVo.gender" placeholder="请选择角色" style="width: 60%;" class="ml-10">
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="mr-10 df-jc-ac" required label="状态">
            <el-radio v-model="userAccountVo.status" label="true">激活</el-radio>
            <el-radio v-model="userAccountVo.status" label="false">禁用</el-radio>
          </el-form-item>
        </p>
        <p class="mt-20 tr" style="width: 90%">
          <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
          <el-button type="primary" @click="addStudentInfo(tag)" size="small">确定</el-button>
        </p>
      </el-form>
    </div>
  </div>
</template>

<script>
const API = require('../utils/api')
export default {
  data() {
    return {
      studentList: [],
      studentList1: [],
      searchShow: true,
      detailList: [],
      currentPage: 1,
      currentPage1: 1,
      dialogFormVisible: false,
      total: 40,
      start: 0,
      end: 8,
      status: [
        { value: 'false', label: '禁用' },
        { value: 'true', label: '激活' }
      ],
      search: {
        status: ''
      },
      pageSize: 8,
      pageSize1: 100,
      updatecenterDialogVisible: false,
      addcenterDialogVisible: false,
      datailcenterDialogVisible: false,
      delVisible: false, //删除提示弹框的状态
      value1: '',
      blurSearch: '',
      gmtTime: '',
      errorInfo: {
        nameErrorInfo: '',
        jobNumberErrorInfo: '',
        phoneNumberErrorInfo: ''
      },
      rules: {
        nameErrorShow: false,
        jobNumberErrorShow: false,
        phoneNumberErrorShow: false
      },
      msg: '新增', //记录每一条的信息，便于取id
      userAccountVo: {
        pkUserAccountId: null,
        gender: '',
        jobNumber: '',
        phoneNumber: '',
        userName: '',
        role: '1',
        msg: '新增',
        status: '',
        cardNumber: '',
        gmtCreate: '',
        name: ''
      }
    }
  },
  created() {
    this.getStudentAll()
  },
  watch: {},
  methods: {
    // 分页查询所有
    async getStudentAll() {
      this.data = { currentPage: this.currentPage1, pageSize: this.pageSize1 }
      this.url = '/userAccount/student'
      this.result = await API.init(this.url, this.data, 'post')
      this.studentList = this.result.data
      for (let i = 0; i < this.studentList.length; i++) {
        this.studentList[i].gmtCreate = this.global.formatDate(this.studentList[i].gmtCreate)
      }
      this.studentList1 = this.result.data
    },
    exportStudentInfo() {
      this.axios({
        method: 'post',
        url: 'userAccount/export/student',
        responseType: 'blob'
      }).then((res) => {
        // 使用Blob创建一个指向性的URL（参数， 参数的类型）
        //const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
        //创建a标签节点
        const download = document.createElement('a')
        //创建url对象
        const href = window.URL.createObjectURL(res.data)
        //给超链接的href属性赋url值
        download.href = href
        //设置下载的文件名
        download.download = '学生信息数据表.xls'
        //将a标签放在body中
        document.body.appendChild(download)
        //给a标签生成一个点击事件
        download.click()
        //移除a标签，为了下次点击时创建
        document.body.removeChild(download)
        //移除url
        window.URL.revokeObjectURL(href)
      })
    },
    //新增学生信息
    openDialog() {
      this.rules.nameErrorShow = false
      this.rules.jobNumberErrorShow = false
      this.rules.phoneNumberErrorShow = false
      this.dialogFormVisible = true
      this.tag = 1
      this.userAccountVo.gender = ''
      this.userAccountVo.jobNumber = ''
      this.userAccountVo.phoneNumber = ''
      this.userAccountVo.userName = ''
    },
    /* 修改room信息 */
    handleEdit(row) {
      this.rules.nameErrorShow = false
      this.rules.jobNumberErrorShow = false
      this.rules.phoneNumberErrorShow = false
      this.msg = '修改'
      this.userAccountVo.pkUserAccountId = row.pkUserAccountId
      this.userAccountVo.gender = row.gender
      this.userAccountVo.jobNumber = row.jobNumber
      this.userAccountVo.phoneNumber = row.phoneNumber
      this.userAccountVo.userName = row.userName
      this.userAccountVo.cardNumber = row.jobNumber
      this.userAccountVo.gmtCreate = row.gmtCreate
      this.userAccountVo.name = row.name
      if (row.status == true) {
        this.userAccountVo.status = 'true'
      } else {
        this.userAccountVo.status = 'false'
      }
      this.dialogFormVisible = true
      this.tag = 2
    },
    checkPhone(val) {
      this.rules.phoneNumberErrorShow = this.check.checkPhone(val)
      if (this.rules.phoneNumberErrorShow) {
        this.errorInfo.phoneNumberErrorInfo = '手机号格式不正确'
      }
    },
    //新增管理员消息
    async addStudentInfo(tag) {
      if (this.checkAllInfo()) {
        //转换isEnabled状态
        if (this.userAccountVo.status == 'true') {
          this.userAccountVo.status = true
        } else {
          this.userAccountVo.status = false
        }
        //定义临时变量，用于新增或修改
        if (tag == 1) {
          let result = await API.init('/userAccount/insert', this.userAccountVo, 'post')
          if (result.code == 1) {
            this.$message({
              message: '新增成功',
              type: 'success'
            })
            this.dialogFormVisible = false
            this.getStudentAll()
          }
        } else {
          console.log(this.userAccountVo)
          let result = await API.init('/userAccount/modification', this.userAccountVo, 'post')
          if (result.code == 1) {
            let student = this.studentList1.filter((stu) => {
              if (stu.pkUserAccountId == this.userAccountVo.pkUserAccountId) {
                return stu
              }
            })
            this.dialogFormVisible = false
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            //修改用户信息
            let index = this.studentList1.indexOf(student[0])
            this.studentList.splice(index, 1, this.userAccountVo)
          }
        }
      }
    },
    //检查各种信息比对
    checkAllInfo() {
      console.log('用户名' + this.userAccountVo.userName)
      if (this.userAccountVo.userName === '') {
        this.rules.nameErrorShow = true
        this.errorInfo.nameErrorInfo = '用户名不允许为空'
      }
      if (this.check.containSpecial(this.userAccountVo.userName)) {
        this.rules.nameErrorShow = true
        this.errorInfo.nameErrorInfo = '用户名不允许存在特殊符号'
      }
      if (this.userAccountVo.jobNumber === '') {
        this.rules.jobNumberErrorShow = true
        this.errorInfo.jobNumberErrorInfo = '学号不允许为空'
      }
      if (this.userAccountVo.phoneNumber === '') {
        this.rules.phoneNumberErrorShow = true
        this.errorInfo.phoneNumberErrorInfo = '手机号不允许为空'
      }
      if ((this.rules.nameErrorShow == false && this.rules.jobNumberErrorShow == false, this.rules.phoneNumberErrorShow == false)) {
        return true
      }
      return false
    },
    //改变用户账号状态
    async changeStatus(item) {
      this.$confirm('此操作将修改该用户账号状态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          /* let data = {
          pkUserAccountId: item.pkUserAccountId,
          status: item.status
        } */
          //let res = API.init('/userAccount/status', data, 'post')
          this.axios({
            method: 'post',
            url: 'http://localhost:8081/userAccount/status',
            data: {
              filed1: item.pkUserAccountId,
              status: item.status
            }
          }).then((res) => {
            if (res.data.code == 1) {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
            }
          })
        })
        .catch(() => {
          item.status = !item.status
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      // })
    },
    //下一页
    nextPage() {
      this.currentPage += 1
      this.start += this.pageSize
      this.end += this.pageSize
    },
    //上一页
    prevPage() {
      this.currentPage -= 1
      this.start -= this.pageSize
      this.end -= this.pageSize
    },
    //改变页的数据条数
    handleSizeChange(val) {
      this.start = (this.currentPage - 1) * val
      this.end = this.currentPage * val
      this.pageSize = val
    },
    //选择分页
    handleCurrentChange(val) {
      this.currentPage = val
      this.start = (this.currentPage - 1) * this.pageSize
      this.end = this.currentPage * this.pageSize
    },
    //单行删除
    handleDelete(index, row) {
      this.idx = index
      this.msg = row //每一条数据的记录
      this.delVisible = true
    },
    //批量删除
    handleDeleteMul() {
      this.delVisible = true
    },
    async deleteRow() {
      this.data = { field: this.msg.pkAppVersionId }
      this.url = '/app/deletion'
      this.result = await API.init(this.url, this.data, 'post')
      if (this.data) {
        this.getStudentAll()
        this.$message.success('删除成功')
      } else {
        this.$message.error('App版本信息删除失败')
      }
      this.delVisible = false //关闭删除提示模态框
    },
    searchByStatus() {
      this.blurSearch = ''
      let keyWords
      if (this.search.status === 'true') {
        keyWords = true
      } else {
        keyWords = false
      }
      this.studentList = this.studentList1.filter((v) => {
        if (v.status == keyWords) {
          return v
        }
      })
    },
    //过滤搜索
    filterSearch() {
      // 获取输入框的值
      let search = this.blurSearch
      //数组元素按条件过滤
      this.studentList = this.studentList1.filter((v) => {
        if (JSON.stringify(v).includes(search)) {
          return v
        }
      })
      this.currentPage = 1
      this.start = 0
      this.end = 8
      console.log('学生列表>>>>>>>>>>>>>>>>..')
      console.log(this.studentList)
    }
  }
}
</script>

<style scoped>
.blur-search {
  width: 200px;
}

.date-input-search {
  width: 260px;
}

.statu-search {
  width: 100px;
}

.el-input__icon {
  color: #ddd;
  margin-bottom: 10px;
}

.el-button--success {
  background-color: #13ce66;
}

.search-btn {
  background-color: #f4f4f5;
}

.search-btn:hover {
  background-color: #909399;
}

.el-input__inner {
  height: 30px;
}

.el-icon-edit {
  color: #f7fbff;
}

.el-icon-plus {
  color: #f7fbff;
}

.el-icon-delete {
  color: #f7fbff;
}

.el-icon-download {
  color: #f7fbff;
}

.el-range-separator {
  margin-bottom: 10px;
}
.el-input__prefix {
  display: flex;
  align-items: center;
}

>>> .el-input__icon {
  color: #ddd;
  margin-bottom: 10px;
}

.el-button--success {
  background-color: #13ce66;
}

.search-btn {
  background-color: #f4f4f5;
}

.search-btn:hover {
  background-color: #909399;
}

>>> .el-input__inner {
  height: 30px;
}

>>> .el-icon-edit {
  color: #f7fbff;
}

>>> .el-icon-plus {
  color: #f7fbff;
}

>>> .el-icon-delete {
  color: #f7fbff;
}

>>> .el-icon-download {
  color: #f7fbff;
}

>>> .el-range-separator {
  margin-bottom: 10px;
}

/* >>> .el-icon-search {
  color: #f7fbff;
} */

>>> .el-input__prefix {
  display: flex;
  align-items: center;
}

.el-select__caret {
  margin-top: 5px;
}

/* 遮罩层 */
.dialog-form {
  border-radius: 5px;
  background-color: white;
  width: 500px;
  height: 400px;
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
