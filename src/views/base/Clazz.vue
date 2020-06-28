<template>
  <div class="room-container" style="width: 100%">
    <el-row type="flex" style="width: 100%">
      <el-col span="1" class="tl"></el-col>
      <el-col span="23">
        <!-- 操作按钮 -->
        <el-row type="flex" class="ml-20 mt-10">
          <el-input
            v-model="keyWords"
            prefix-icon="el-icon-search"
            placeholder="请输入内容"
            class="blur-search"
            @input="filterSearch"
            v-if="searchShow"
          ></el-input>
          <el-button v-if="searchShow" type="success" size="mini" @click="search()" class="ml-10 bg-green" icon>
            <i class="el-icon-search" style="color: rgb(247, 251, 255)"></i>
            <span class="light-font-color">搜索</span>
          </el-button>
        </el-row>
        <el-row class="df-jr-ac ml-20 mt-10">
          <el-col class="tl">
            <el-button type="primary" icon="el-icon-plus" @click="addClazzInfo" size="mini">
              <span class="light-font-color">新增</span>
            </el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="batchDelete">
              <span class="light-font-color">批量删除</span>
            </el-button>
          </el-col>
          <el-col class="tr mr-20">
            <el-button size="small" class="search-btn" @click="searchShow = !searchShow" @mouseover="searchOver()">
              <i class="el-icon-search" style="color: white"></i>
            </el-button>
            <el-button icon="el-icon-refresh" size="small" @click="flush()"></el-button>
          </el-col>
        </el-row>
        <!-- 表格 -->
        <el-row>
          <el-table
            ref="multipleTable"
            :data="clazzList.slice(start, end)"
            tooltip-effect="dark"
            style="width: 100%"
            class="light-small-font"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" min-width="5%"></el-table-column>
            <el-table-column label="班级名" min-width="15%">
              <template slot-scope="scope">{{ scope.row.name }}</template>
            </el-table-column>
            <el-table-column label="班主任" min-width="15%">
              <template slot-scope="scope">{{ scope.row.clazzHeadmaster }}</template>
            </el-table-column>
            <el-table-column label="年级" min-width="15%">
              <template slot-scope="scope">{{ scope.row.grade }}</template>
            </el-table-column>
            <el-table-column label="创建时间" show-overflow-tooltip min-width="20%">
              <template slot-scope="scope">{{ scope.row.gmtCreate }}</template>
            </el-table-column>
            <el-table-column label="操作" align="center" min-width="30%">
              <template slot-scope="scope">
                <p style="text-align:center">
                  <el-button size="mini" icon="el-icon-edit" type="primary" @click="handleEdit(scope.row)">
                    <span class="light-font-color">编辑</span>
                  </el-button>
                  <el-button size="mini" icon="el-icon-edit" type="primary" @click="manageStudent(scope.row)">
                    <span class="light-font-color">学生管理</span>
                  </el-button>
                  <el-button size="mini" icon="el-icon-delete" type="danger" @click="handleDelete(scope.row)">
                    <span class="light-font-color">删除</span>
                  </el-button>
                </p>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row class="df-jl-ac mt-10">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20]"
            :page-size="100"
            layout="total, prev, pager, next, sizes"
            :total="clazzList.length"
            @prev-click="prevPage()"
            @next-click="nextPage()"
          ></el-pagination>
        </el-row>
        <!-- 新增页面 -->
        <div class="dialog" v-if="dialogFormVisible || studentManage">
          <el-form class="mt-10 dialog-form dc-jc-ac" :model="clazz" style="border-radius: 5px" v-if="dialogFormVisible">
            <p class="dark-large-font tl mt-10" style="width: 80%">
              <span>{{ msg }}班级</span>
            </p>
            <el-form-item required label="班级名" class="mt-10" style="width: 80%">
              <el-input v-model="clazz.name" autocomplete="off" placeholder="请输入班级名称" style="width: 70%"></el-input>
            </el-form-item>
            <el-form-item required label="班主任" style="width: 80%">
              <el-input v-model="clazz.clazzHeadmaster" autocomplete="off" placeholder="请输入教师工号" style="width: 70%"></el-input>
            </el-form-item>
            <el-form-item required label="年级" style="width: 80%">
              <el-input v-model="clazz.grade" class="ml-10" autocomplete="off" placeholder="请输入年级" style="width: 70%"></el-input>
            </el-form-item>
            <el-form-item class="tr" style="width: 80%">
              <el-button @click="cancle()" size="mini">取 消</el-button>
              <el-button type="primary" @click="addRoomInfo(tag)" size="mini">确定</el-button>
            </el-form-item>
          </el-form>
          <!-- 分配学生 -->
          <div class="mt-10 second-diago dc-jc-ac" :model="clazz" style="border-radius: 5px" v-if="studentManage">
            <p class="dark-large-font tl mt-10" style="width: 90%">
              <span>分配学生</span>
            </p>
            <el-row type="flex">
              <el-col style="padding: 0 10px; width: 550px" class="dc-jc-ac">
                <p style="width: 90%">
                  <el-input
                    v-model="keyWords"
                    prefix-icon="el-icon-search"
                    placeholder="搜索所有学生信息"
                    class="blur-search mt-20"
                    @input="filterSearch"
                    style="width: 100%"
                  ></el-input>
                </p>
                <p class="df-jb-ac mt-10 student-show">
                  <span
                    class="dc-jb-ac mr-10 dark-small-font"
                    v-for="(student, index) in students"
                    :key="index"
                    style="width: 20%;height: 35px; border: 1px solid #dcdfe6;"
                    @click="changeStudent(student)"
                  >
                    <span>{{ student.user_name }}</span>
                    <span class="mt-10">{{ student.job_number }}</span>
                  </span>
                </p>
              </el-col>
              <el-col style="padding: 0 10px; width: 250px">
                <p class="tl" style="width: 100%;">已分配</p>
                <p v-for="(item, index) in studentInfos" class="mt-20 tl df-jb-ac" :key="index">
                  <span>
                    <span class="mr-10">{{ item.job_number }}</span>
                    <span>{{ item.user_name }}</span>
                  </span>
                  <el-button size="mini" @click="deleteStudentInfo(item)">
                    删除
                  </el-button>
                </p>
              </el-col>
            </el-row>
            <p class="tr mt-10" style="width: 80%">
              <el-button @click="cancle()" size="mini">取 消</el-button>
              <el-button type="primary" @click="addRoomInfo(tag)" size="mini">确定</el-button>
            </p>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
const API = require('../utils/api.js')
export default {
  name: 'Room',
  data() {
    return {
      towers: [],
      start: 0,
      end: 10,
      searchShow: true,
      iconColor: '#fefcf8',
      pageSize: 100,
      pageSize1: 10,
      currenPage: 0,
      currenPage1: 1,
      defaultProps: {
        children: 'childTowers',
        label: 'name'
      },
      studentInfos: [],
      msg: '新增',
      dialogFormVisible: false,
      multipleSelection: [],
      rooms: [],
      clazzList: [],
      clazzList1: [],
      clazz: {
        name: '',
        grade: '',
        clazzHeadmaster: '',
        clazzId: null,
        collegeId: 1,
        gmtCreate: null
      },
      studentManage: false,
      input: '',
      towerName: -1,
      tag: 1,
      ids: [],
      keyWords: '',
      students: [],
      newStudentInfos: [],
      addStudents: [],
      subTractStudentInfo: []
    }
  },
  created() {
    this.getClazz()
    this.getAllStudents()
  },
  mounted() {},
  methods: {
    async getClazz() {
      let pageDto = {
        currenPage: this.currentPage,
        pageSize: this.pageSize
      }
    /* load() {
      this.clazzList.length += 2
    },
    // 分页查询所有
    async getClazzAll() {
      this.data = {}
      this.url = '/clazz/all'
      this.result = await API.init(this.url, this.data, 'post')
      this.clazzList = this.result.data
      console.log(this.clazzList.length)
      this.clazzList1 = this.result.data
      for (let i = 0; i < this.clazzList.length; i++) {
        this.clazzList[i].gmtCreate = this.formatDate(this.clazzList[i].gmtCreate)
      } */
      let res = await API.init('/clazz/all', pageDto, 'post')
      this.clazzList = res.data
      for (let i = 0, len = this.clazzList.length; i < len; i++) {
        this.clazzList[i].gmtCreate = this.global.formatDate(this.clazzList[i].gmtCreate)
      }
      this.clazzList1 = this.clazzList
      // })
    },
    //查询所有楼栋及楼栋的所有单元信息
    async getAllTowersUnits() {
      this.units = (await API.init('/tower/units/list', null, 'post')).data
    },
    manageStudent(item) {
      this.studentManage = true
      this.tag = 3
      this.clazz.pkClazzId = item.pkClazzId
      this.getStudentByClazzId(item)
    },
    //新增房间消息
    async addRoomInfo(tag) {
      let time = Date.parse(new Date())
      if (tag == 1) {
        let result = await API.init('/clazz/increase/clazz', this.clazz, 'post')
        if (result.code == 1) {
          this.$message({
            type: 'success',
            message: '新增成功!'
          })
          this.clazz.gmtCreate = this.global.formatDate(time)
          this.dialogFormVisible = false
        }
        this.clazzList.push(this.clazz)
      } else if (this.tag == 2) {
        let result = await API.init('/clazz/modification', this.clazz, 'post')
        if (result.code == 1) {
          let clazz = this.clazzList1.filter((clazz) => {
            if (clazz.pkClazzId === this.clazz.clazzId) {
              return clazz
            }
          })
          let index = this.clazzList1.indexOf(clazz[0])
          this.clazzList1.splice(index, 1, this.clazz)
          this.dialogFormVisible = false
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
        }
      } else {
        let code = 0
        if (this.subTractStudentInfo.length > 0) {
          let subIds = []
          for (let i = 0, len = this.subTractStudentInfo.length; i < len; i++) {
            subIds.push(this.subTractStudentInfo[i].pk_user_account_id)
          }
          let dto = {
            firstField: JSON.stringify(subIds),
            secondField: 0
          }
          let result = await API.init('/userAccount/modification/id', dto, 'post')
          if (result.code == 1) {
            code = 1
          }
        }
        if (this.addStudents.length > 0) {
          let subIds = []
          for (let i = 0, len = this.addStudents.length; i < len; i++) {
            subIds.push(this.addStudents[i].pk_user_account_id)
          }
          let dto = {
            firstField: JSON.stringify(subIds),
            secondField: this.clazz.pkClazzId
          }
          let result = await API.init('/userAccount/modification/id', dto, 'post')
          if (result.code == 1) {
            code = 1
          }
        }
        if (code === 1) {
          this.$message({
            type: 'success',
            message: '分配成功'
          })
          this.dialogFormVisible = false
          this.studentManage = false  
        }
      }
    },
    //根据班课id获取所有学生信息
    async getStudentByClazzId(row) {
      let dto = {
        field: row.pkClazzId
      }
      this.studentInfos = (await API.init('/userAccount/list/clazzId', dto, 'post')).data
      this.newStudentInfos = this.studentInfos
      console.log(this.studentInfos)
    },
    //批量删除
    async batchDelete() {
      let ids = []
      for (let i = 0; i < this.ids.length; i++) {
        ids.push(this.ids[i].pkClazzId)
      }
      console.log(ids)
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios({
          method: 'post',
          url: 'http://localhost:8081/clazz/deletionBath',
          data: {
            ids: JSON.stringify(ids)
          }
        }).then((res) => {
          if (res.data.code == 1) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            for (let i = 0, len = this.ids.length; i < len; i++) {
              let index = this.clazzList1.indexOf(this.ids[i])
              this.clazzList.splice(index, 1)
            }
          }
        })
      })
    },
    //分配学生
    changeStudent(student) {
      this.newStudentInfos.push(student)
      let index = this.students.indexOf(student)
      this.students.splice(index, 1)
      this.addStudents.push(student)
      for (let i = 0, len = this.subTractStudentInfo.length; i < len; i++) {
        if (this.subTractStudentInfo.indexOf(student) != -1) {
          let index = this.subTractStudentInfo.indexOf(student)
          this.subTractStudentInfo.splice(index, 1)
        }
      }
    },
    //删除已分配的学生
    deleteStudentInfo(item) {
      let index = this.newStudentInfos.indexOf(item)
      this.newStudentInfos.splice(index, 1)
      this.students.push(item)
      this.subTractStudentInfo.push(item)
      for (let i = 0, len = this.addStudents.length; i < len; i++) {
        if (this.addStudents.indexOf(item) != -1) {
          let index = this.addStudents.indexOf(item)
          this.addStudents.splice(index, 1)
        }
   /*  async deleteRow() {
      this.data = { field: this.msg.pkAppVersionId }
      this.url = '/app/deletion'
      this.result = await API.init(this.url, this.data, 'post')
      if (this.data) {
        this.getClazzAll()
        this.$message.success('删除成功')
      } else {
        this.$message.error('App版本信息删除失败') */
      }
    },
    //取消
    cancle() {
      this.dialogFormVisible = false
      this.studentManage = false
    },
    //修改房间信息
    async handleEdit(row) {
      this.msg = '修改'
      this.clazz.name = row.name
      this.clazz.grade = row.grade
      this.clazz.clazzHeadmaster = row.clazzHeadmaster
      this.clazz.clazzId = row.pkClazzId
      this.clazz.gmtCreate = row.gmtCreate
      this.dialogFormVisible = true
      this.studentManage = false
      this.tag = 2
      // })
    },
    async getAllStudents() {
      this.students = (await API.init('/userAccount/student/list', null, 'post')).data
    },
    //刷新数据
    flush() {
      this.getRoom()
    },
    addClazzInfo() {
      this.clazz.name = ''
      this.clazz.grade = ''
      this.clazz.clazzHeadmaster = ''
      this.dialogFormVisible = true
      this.studentManage = false
    },
    //删除房间信息
    handleDelete(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios({
          method: 'post',
          url: 'http://localhost:8081/clazz/deletion/id',
          data: {
            clazzId: row.pkClazzId
          }
        }).then((res) => {
          if (res.data.code == 1) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            let index = this.clazzList1.indexOf(row)
            this.clazzList.splice(index, 1)
          }
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
      this.currentPageSize = val
    },
    //选择分页
    handleCurrentChange(val) {
      this.currentPage = val
      this.start = (this.currentPage - 1) * this.currentPageSize
      this.end = this.currentPage * this.currentPageSize
    },
    searchOver() {
      alert(1)
      this.iconColor = '#f1f1df'
    },
    //模糊搜索
    search() {
      //数组元素按条件过滤
      this.roomsList = this.roomsList1.filter((v) => {
        if (JSON.stringify(v).indexOf(this.input) != -1) {
          return v
        }
      })
    },
    handleSelectionChange(val) {
      this.ids = val
    },
    //过滤搜索
    filterSearch() {
      //数组元素按条件过滤
      this.clazzList = this.clazzList1.filter((v) => {
        if (v.name.indexOf(this.keyWords) != -1 || v.clazzHeadmaster.indexOf(this.keyWords) != -1 || v.grade.indexOf(this.keyWords) != -1) {
          console.log(v)
          return v
        }
      })
    }
  },
  computed: {}
}
</script>

<style scoped>
.room-container {
  padding: 20px 20px;
}

.demo-ruleForm {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.blur-search {
  width: 200px;
}

.date-input-search {
  width: 260px;
}

.statu-search {
  width: 100px;
}

.student-show {
  width: 90%;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  min-height: 300px;
  border: 1px solid rgb(220, 223, 230);
  border-radius: 5px;
  padding: 10px 10px;
}

el-input {
  height: 30px;
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
  width: 400px;
  height: 300px;
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

.second-diago {
  width: 800px;
  height: 500px;
  border-radius: 5px;
  background-color: white;
}
</style>
