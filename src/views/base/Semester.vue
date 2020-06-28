<template>
  <div style="width: 100%">
    <el-row type="flex" class="ml-20 mt-10">
      <el-input prefix-icon="el-icon-search" v-model="blurSearch" placeholder="请输入内容" class="blur-search"></el-input>
      <el-date-picker
        v-model="time"
        type="daterange"
        range-separator=":"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        class="date-input-search ml-10"
        value-format="yyyy-MM-dd"
      >
      </el-date-picker>
      <el-button type="success" size="mini" @click="searchByName()" class="ml-10" icon="el-icon-search">搜索</el-button>
    </el-row>
    <el-row class="df-jr-ac ml-20 mt-10">
      <el-col class="tl">
        <el-button type="primary" icon="el-icon-plus" @click="openDialog" size="mini">
          <span class="light-font-color">新增</span>
        </el-button>
        <el-button type="warning" disabled icon="el-icon-download" size="mini">
          <span class="light-font-color">导出</span>
        </el-button>
      </el-col>
      <el-col class="tr mr-20">
        <el-button icon="el-icon-refresh" size="small"></el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-row>
      <el-col span="1"></el-col>
      <el-col span="23" class="ml-20 mt-10">
        <el-table
          ref="multipleTable"
          :data="semesterList.slice(start, end)"
          tooltip-effect="dark"
          style="width: 100%;"
          @selection-change="handleSelectionChange"
          class="light-small-font"
        >
          <el-table-column type="selection" min-width="5%"></el-table-column>
          <el-table-column label="学期名" min-width="20%">
            <template slot-scope="scope">{{ scope.row.name }}</template>
          </el-table-column>
          <el-table-column prop="weekCount" label="周次" min-width="10%"></el-table-column>
          <el-table-column prop="openSchoolTime" align="center" label="开学时间" show-overflow-tooltip min-width="15%"> </el-table-column>
          <el-table-column prop="gmtCreate" align="center" label="创建时间" show-overflow-tooltip min-width="20%"> </el-table-column>
          <el-table-column label="操作" align="center" show-overflow-tooltip min-width="30%">
            <template slot-scope="scope">
              <p class="tc">
                <el-button size="mini" icon="el-icon-edit" type="primary" @click="handleEdit(scope.row)">
                  <span class="light-font-color">编辑</span>
                </el-button>
                <el-button size="mini" icon="el-icon-delete" type="danger" @click="handleDelete(scope.row)">
                  <span class="light-font-color">删除</span>
                </el-button>
              </p>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!-- 分页 -->
    <el-row class="df-jl-ac mt-10">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20]"
        :page-size="pageSize"
        layout="total, prev, pager, next, sizes"
        :total="semesterList.length"
        @prev-click="prevPage()"
        @next-click="nextPage()"
      ></el-pagination>
    </el-row>
    <!-- 新增页面 -->
    <div class="dialog" v-if="dialogFormVisible">
      <h2>新增房间信息</h2>
      <el-form class="mt-10 dialog-form dc-jc-ac" :model="semesterInfo" style="border-radius: 5px;">
        <el-form-item required label="学期名" style="width: 80%">
          <el-input v-model="semesterInfo.name" autocomplete="off" placeholder="请输入学期名" style="width: 70%"></el-input>
        </el-form-item>
        <el-form-item required label="周次" style="width: 80%">
          <el-input
            v-model="semesterInfo.weekCount"
            autocomplete="off"
            placeholder="周次"
            style="width: 30%; float: left; margin-left: 30px"
          ></el-input>
        </el-form-item>
        <el-form-item required label="开学时间" style="width: 80%">
          <el-date-picker v-model="semesterInfo.openSchoolTime" type="date" placeholder="选择日期"> </el-date-picker>
        </el-form-item>
        <el-form-item class="tr" style="width: 80%">
          <el-button @click="dialogFormVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="addSemesterInfo(tag)" size="mini">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
const API = require('../utils/api.js')
export default {
  name: 'Semester',
  data() {
    return {
      time: '',
      value: true,
      pageSize: 10,
      pageSize1: 10,
      currentPage: 1,
      currentPage1: 0,
      dialogFormVisible: false,
      start: 0,
      end: 10,
      tag: 1,
      blurSearch: '', //查询
      semesterInfo: {
        pkSemesterId: -1,
        name: '',
        weekCount: 0,
        openSchoolTime: ''
      },
      options: [
        {
          value: '0',
          label: '禁用'
        },
        {
          value: '1',
          label: '正常'
        }
      ],
      selectValue: '',
      multipleSelection: [],
      semesterList: [],
      semesterList1: []
    }
  },
  components: {},
  created() {
    this.getSemesterAll()
  },
  mounted() {},
  methods: {
    //新增管理员消息
    async addSemesterInfo(tag) {
      //定义临时变量，用于新增或修改
      if (tag == 1) {
        let result = await API.init('/semester/single', this.semesterInfo, 'post')
        if (result.code == 1) {
          this.$message({
            message: '新增成功',
            type: 'success'
          })
          this.dialogFormVisible = false
          this.getSemesterAll()
        }
      } else {
        let result = await API.init('/semester/id', this.semesterInfo, 'post')
        if (result.code == 1) {
          let semesterInfo = this.semesterList1.filter((semester) => {
            if (semester.pkSemesterId == this.semester.pkSemesterId) {
              return semester
            }
          })
          this.dialogFormVisible = false
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          //修改用户信息
          let index = this.semesterList1.indexOf(semesterInfo[0])
          this.semesterList.splice(index, 1, this.semesterInfo)
        }
      }
    },

    //删除方法
    async handleDelete(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios({
          method: 'post',
          url: 'http://localhost:8081/semester/delection/id',
          data: {
            pkSemesterId: row.pkSemesterId
          }
        }).then((res) => {
        if (res.data.code == 1) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          let index = this.semesterList1.indexOf(row)
          this.semesterList.splice(index, 1)
        }
        })
      })
    },
    openDialog() {
      this.dialogFormVisible = true
      this.tag = 1
    },
    //修改学期信息
    handleEdit(row) {
      this.semesterInfo.pkSemesterId = row.pkSemesterId
      this.semesterInfo.name = row.name
      this.semesterInfo.weekCount = row.weekCount
      this.semesterInfo.openSchoolTime = row.openSchoolTime
      this.dialogFormVisible = true
      this.flag = 2
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
      this.start = (this.pageSize - 1) * val
      this.end = this.pageSize * val
      this.pageSize = val
    },
    //选择分页
    handleCurrentChange(val) {
      this.currentPage = val
      this.start = (this.currentPage - 1) * this.pageSize
      this.end = this.currentPage * this.pageSize
    },
    //获取所有学期信息
    async getSemesterAll() {
      this.semesterList = (await API.init('/semester/all', null, 'post')).data
      for (let i = 0, len = this.semesterList.length; i < len; i++) {
        let time = this.semesterList[i].gmtCreate
        let openSchoolTime = this.semesterList[i].openSchoolTime
        this.semesterList[i].gmtCreate = this.global.formatDate(time)
        this.semesterList[i].openSchoolTime = this.global.formatDate(openSchoolTime)
      }
      this.semesterList1 = this.semesterList
    },
    //搜索
    searchByName() {
      console.log(this.blurSearch)

      if (this.blurSearch != '') {
        this.semesterList = this.semesterList1.filter((semester) => {
          if (semester.name.indexOf(this.blurSearch) != -1) {
            return semester
          }
        })
        this.blurSearch = ''
      } else if (this.time.length >= 1) {
        this.semesterList = this.semesterList1.filter((semester) => {
          if (this.time[0] <= semester.gmtCreate && semester.gmtCreate <= this.time[1]) {
            //console.log(status)
            return semester
          }
        })
        this.time = null
      }
    }
  },

  computed: {}
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
</style>
