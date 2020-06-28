<template>
  <div style="width: 100%">
    <el-row type="flex" class="ml-20 mt-10">
      <el-input
        prefix-icon="el-icon-search"
        v-model="blurSearch"
        @input="filterSearch"
        placeholder="请输入内容"
        class="blur-search"
      ></el-input>
      <el-button type="success" size="mini" @click="searchByName()" class="ml-10" icon="el-icon-search">
        <span style="color:white">搜索</span>
      </el-button>
    </el-row>
    <el-row class="df-jr-ac ml-20 mt-10">
      <el-col class="tl">
        <el-button type="primary" icon="el-icon-plus" disabled @click="openDialog" size="mini">
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
      <el-col span="23" class="ml-20 mt-10">
        <el-table
          border
          ref="multipleTable"
          :data="subjectlist.slice(start, end)"
          tooltip-effect="dark"
          style="width: 100%;"
          class="light-small-font"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" min-width="5%"></el-table-column>
          <el-table-column label="课程名" min-width="10%">
            <template slot-scope="scope">{{ scope.row.subjectName }}</template>
          </el-table-column>
          <el-table-column prop="semesterName" label="学期" min-width="15%"></el-table-column>
          <el-table-column prop="user_name" align="center" label="授课教师" show-overflow-tooltip min-width="10%"> </el-table-column>
          <el-table-column align="center" label="上课地点" show-overflow-tooltip min-width="10%">
            <template slot-scope="scope">{{ scope.row.towerName }}{{ scope.row.roomName }}</template>
          </el-table-column>
          <el-table-column prop="time" align="center" label="上课时间" show-overflow-tooltip min-width="10%">
            <template slot-scope="scope">
              <span>周{{ scope.row.week_day }}第{{ scope.row.time }}节</span>
            </template>
          </el-table-column>
          <el-table-column prop="clazz" align="center" label="上课班级" show-overflow-tooltip min-width="10%"> </el-table-column>
          <el-table-column prop="week_duration" align="center" label="上课周次" show-overflow-tooltip min-width="10%"> </el-table-column>
          <el-table-column label="操作" align="center" show-overflow-tooltip min-width="20%">
            <template slot-scope="scope">
              <p class="tc">
                <el-button size="mini" icon="el-icon-edit" type="primary" @click="handleEdit(scope.row)">
                  <span class="light-font-color">编辑</span>
                </el-button>
                <!-- <el-button size="mini" type="primary" @click="handleEdit(scope.row)">
                  <span class="light-font-color">学生管理</span>
                </el-button> -->
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
        :total="subjectlist.length"
        @prev-click="prevPage()"
        @next-click="nextPage()"
      ></el-pagination>
    </el-row>
    <!-- 新增页面 -->
    <div class="dialog" v-if="dialogFormVisible">
      <h2>新增房间信息</h2>
      <el-form class="mt-10 dialog-form dc-jc-ac" :model="course" style="border-radius: 5px;">
        <p class="df-jb-ac" style="width: 80%">
          <el-form-item required label="课程名" style="width: 50%">
            <el-input v-model="course.name" autocomplete="off" placeholder="请输入学期名" style="width: 60%"></el-input>
          </el-form-item>
          <el-form-item required label="周次" style="width: 50%">
            <el-input v-model="course.weeks" autocomplete="off" placeholder="请输入周次" style="width: 60%"></el-input>
          </el-form-item>
        </p>
        <el-form-item required label="学期" style="width: 80%">
          <el-select v-model="course.semesterName" class="ml-10" placeholder="请选择学期" @change="getSemester" style="width: 80%">
            <el-option v-for="(item, index) in semesterList" :key="index" :label="item.name" :value="item.pkSemesterId"></el-option>
          </el-select>
        </el-form-item>
        <p class="df-jb-ac" style="width: 80%">
          <el-form-item required label="教工号" style="width: 50%">
            <el-input v-model="course.jobNumber" placeholder="输入教师工号" style="width: 60%"></el-input>
          </el-form-item>
          <el-form-item required label="班级" style="width: 50%">
            <el-select v-model="course.clazz" placeholder="选择班级" @change="getRoomId" style="width: 60%">
              <el-option v-for="(item, index) in clazzes" :key="index" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </p>
        <p class="df-jb-ac" style="width: 80%">
          <el-form-item min-width="50%" required label="楼栋">
            <el-select v-model="course.towerId" placeholder="请选择楼栋" class="ml-10" @change="getTowerRooms" style="width: 60%">
              <el-option v-for="(item, index) in towersRooms" :key="index" :label="item.name" :value="item.pk_tower_id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item min-width="50%" label="房间" required class="ml-10">
            <el-select v-model="course.roomId" placeholder="选择教室" @change="getRoomId" style="width: 60%">
              <el-option v-for="(item, index) in rooms" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </p>
        <p class="df-jb-ac" style="width: 80%">
          <el-form-item min-width="50%" required label="周几">
            <el-select v-model="course.weekDay" placeholder="选择周几" class="ml-10" @change="getTowerRooms" style="width: 60%">
              <el-option v-for="(item, index) in weekDays" :key="index" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item min-width="50%" label="节次" required class="ml-10">
            <el-select v-model="course.time" placeholder="选择节次" @change="getRoomId" style="width: 60%">
              <el-option v-for="(item, index) in times" :key="index" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </p>
        <el-form-item class="tr" style="width: 80%">
          <el-button @click="dialogFormVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="updateCourseInfo()" size="mini">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
const API = require('../utils/api')
export default {
  name: 'course',
  data() {
    return {
      subjectlist: [],
      subjectlist1: [],
      detailList: [],
      pageSize: 10,
      pageSize1: 100,
      currentPage: 1,
      currentPage1: 1,
      dialogFormVisible: false,
      start: 0,
      end: 10,
      tag: 1,
      blurSearch: '', //查询
      updatecenterDialogVisible: false,
      addcenterDialogVisible: false,
      datailcenterDialogVisible: false,
      delVisible: false, //删除提示弹框的状态
      gmtTime: '',
      msg: '', //记录每一条的信息，便于取id
      weekDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      times: [1, 2, 3, 4, 5],
      clazzes: [
        { name: '软件1813', value: 1 },
        { name: '软件1851', value: 2 },
        { name: '软件1821', value: 3 }
      ],
      course: {
        name: '',
        semesterName: '',
        jobNumber: '',
        towerId: '',
        weekDay: null,
        time: null,
        clazz: '',
        roomId: '',
        weeks: '',
        pkId: null,
        oldRoomId: null,
        oldScheduleId: null,
        oldSubjectId: null
      }, //课程信息
      semestersList: [],
      towersRooms: [],
      childRooms: [],
      course1: {},
      oldCourse: {}
    }
  },
  created() {
    this.getSubjectAll()
    this.getTeachTowers()
    this.getSemesterAll()
  },
  watch: {},
  methods: {
    //获取所有学期信息
    async getSemesterAll() {
      this.semesterList = (await API.init('/semester/all', null, 'post')).data
      for (let i = 0, len = this.semesterList.length; i < len; i++) {
        let time = this.semesterList[i].gmtCreate
        this.semesterList[i].gmtCreate = this.global.formatDate(time)
      }
    },
    //获取所有教学楼信息
    async getTeachTowers() {
      this.towersRooms = (await API.init('/tower/list/teach', null, 'post')).data
    },
    //获取房间id
    getRoomId(val) {
      this.course.roomId = val
    },
    //修改信息
    async updateCourseInfo() {
      //判断默认的下拉选项是否为之前默认的
      if (this.course1.clazz === this.course.clazz) {
        this.course.clazz = this.course1.clazz_id
      }
      if (this.course1.semesterName === this.course.semesterName) {
        this.course.semesterName = this.course1.semester_id
      }
      if (this.course1.user_name === this.course.name) {
        this.course.name = this.user_job_number
      }
      if (this.course1.roomName === this.course.roomId) {
        this.course.roomId = this.course1.room_id
      }
      if (this.course1.towerName === this.course.towerId) {
        this.course.towerId = this.course1.tower_id
      }
      //给定义的修改的对象重新赋值
      this.oldCourse.clazz_id = this.course.clazz
      this.oldCourse.semester_id = this.course.semesterName
      this.oldCourse.user_job_number = this.course.name
      this.oldCourse.room_id = this.course.roomId
      this.oldCourse.tower_id = this.course.towerId
      this.oldCourse.week_duration = this.course.weeks
      this.oldCourse.week_day = this.course.weekDay
      this.oldCourse.time = this.course.time
      console.log(this.oldCourse)
      let result = await API.init('/course/modification', this.course, 'post')
      if (result.code == 1) {
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        let index = this.subjectlist1.filter((subject) => {
          if (subject.pk_course_id == this.oldCourse.pk_course_id) {
            return subject
          }
        })
        this.subjectlist.splice(index, 1, this.oldCourse)
        this.dialogFormVisible = false
      }
    },
    // 分页查询所有
    async getSubjectAll() {
      this.data = { currentPage: this.currentPage1, pageSize: this.pageSize1 }
      this.url = '/course/list'
      this.result = await API.init(this.url, this.data, 'post')
      this.subjectlist = this.result.data
      for (let i = 0; i < this.subjectlist.length; i++) {
        this.subjectlist[i].gmt_create = this.global.formatDate(this.subjectlist[i].gmt_create)
      }
      this.subjectlist1 = this.subjectlist
    },
    //单行删除
    handleDelete(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //let res = API.init('/course/delection' , dto, 'post')
        this.axios({
          method: 'post',
          url: 'http://localhost:8081/course/delection',
          data: {
            field: row.pk_course_id
          }
        }).then((res) => {
          if (res.data.code == 1) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            let index = this.subjectlist1.indexOf(row)
            this.subjectlist.splice(index, 1)
          }
        })
      })
    },
    handleEdit(row) {
      this.course.name = row.subjectName
      this.course.semesterName = row.semesterName
      this.course.towerId = row.towerName
      this.course.roomId = row.roomName
      this.course.jobNumber = row.user_job_number
      this.course.weekDay = row.week_day
      this.course.time = row.time
      this.course.clazz = row.clazz
      this.course.pkId = row.pk_course_id
      this.course.weeks = row.week_duration
      this.course.oldRoomId = row.room_id
      this.course.oldScheduleId = row.schedule_id
      this.course.oldSubjectId = row.subject_id
      this.oldCourse = row
      this.course1 = row
      this.dialogFormVisible = true
    },
    //新增课程信息
    addCourseInfo() {
      console.log(this.course)
    },
    //批量删除
    handleDeleteMul() {
      this.delVisible = true
    },
    //获取楼栋的所有房间
    getTowerRooms(val) {
      this.course.towerId = val
      let towerRooms = this.towersRooms
      let towerRoom = towerRooms.filter((x) => {
        if (x.pk_tower_id == val) {
          return x
        }
      })
      this.rooms = towerRoom[0].rooms
    },
    getSemester(val) {
      this.course.semesterName = val
    },
    async deleteRow() {
      this.data = { field: this.msg.pkAppVersionId }
      this.url = '/app/deletion'
      this.result = await API.init(this.url, this.data, 'post')
      if (this.data) {
        this.getSubjectAll()
        this.$message.success('删除成功')
      } else {
        this.$message.error('信息删除失败')
      }
      this.delVisible = false //关闭删除提示模态框
    },
    //打开新增面板
    openDialog() {
      this.dialogFormVisible = true
      this.course.name = ''
      this.course.semesterName = ''
      this.course.jobNumber = ''
      this.course.towerId = null
      this.course.roomId = null
    },
    //下一页
    nextPage() {
      this.currentPage += 1
      this.start += this.pageSize
      this.end += this.pageSize
      /* alert(this.start)
      alert(this.end) */
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
    //过滤搜索
    filterSearch() {
      // 获取输入框的值
      let search = this.blurSearch
      //数组元素按条件过滤
      this.subjectlist = this.subjectlist1.filter((v) => {
        if (JSON.stringify(v).includes(search)) {
          return v
        }
      })
    }
  }
}
</script>

<style scoped>
.top-input {
  width: 200px;
  height: 30px;
  margin-left: 50px;
}
.blur-search {
  width: 200px;
}
.statu-search {
  width: 100px;
}

el-input {
  height: 30px;
}

.search-btn {
  height: 30px;
  width: 80px;
}
>>> .el-input__inner {
  line-height: 30px;
  height: 30px;
}

>>> .el-input__icon {
  color: #ddd;
}

.el-button--success {
  background-color: #13ce66;
}

.search-btn {
  background-color: #f4f4f5;
}

>>> .el-icon-search {
  color: #f4f4f5;
}

.search-btn:hover {
  background-color: #909399;
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

.date-input-search {
  width: 260px;
}

>>> .el-range-separator {
  margin-bottom: 10px;
}
</style>
