<template>
  <div style="width:100%">
    <!-- 考务下的学生数据-->
    <el-dialog
      title="学生信息"
      :visible.sync="selectcenterDialogVisible"
      width="30%"
      :modal="false"
      center
    >
      <div
        v-for="(item, index) in students"
        :key="index"
      >
        <div class="students-style">
          <div class="stu-left">
            {{ item.userName }}
          </div>
          <div class="stu-right">
            {{ item.jobNumber }}
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 增加弹出框 -->
    <el-dialog
      title="新增考务"
      :visible.sync="addcenterDialogVisible"
      width="30%"
      :modal="false"
      center
    >
      <div class="block">
        <span class="demonstration ">考试时间</span>
        <el-date-picker
          v-model="value2"
          type="datetimerange"
          range-separator=":"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="time-style"
        >
        </el-date-picker>
      </div>
      <div class="between-style">
        <div class="sub-title">输入学期</div>
        <el-autocomplete
          class="inline-input"
          v-model="semster"
          :fetch-suggestions="querySearch"
          placeholder="输入学期"
          @select="handleSelect"
        ></el-autocomplete>
      </div>
      <div class="between-style">
        <div class="sub-title">输入学科</div>
        <el-autocomplete
          class="inline-input"
          v-model="subject"
          :fetch-suggestions="querySearch1"
          placeholder="输入学科"
          @select="handleSelect1"
        ></el-autocomplete>
      </div>
      <div class="between-style">
        <div class="sub-title">输入班级</div>
        <el-autocomplete
          class="inline-input"
          v-model="clazz"
          :fetch-suggestions="querySearch2"
          placeholder="输入班级"
          @select="handleSelect2"
        ></el-autocomplete>
      </div>
      <div class="between-style">
        <div class="sub-title">选择教室</div>
        <el-autocomplete
          class="inline-input"
          v-model="room"
          :fetch-suggestions="querySearch3"
          placeholder="选择教室"
          @select="handleSelect3"
        ></el-autocomplete>
      </div>
      <div class="between-style">
        <div class="sub-title">监考老师</div>
        <el-autocomplete
          class="inline-input"
          v-model="teacher"
          :fetch-suggestions="querySearch4"
          placeholder="监考老师"
          @select="handleSelect4"
        ></el-autocomplete>
      </div>
      <div class="between-style">
        <div class="sub-title">输入类型</div>
        <el-input
          v-model="type"
          placeholder="请输入类型"
          type="text"
          class="inline-input"
        ></el-input>
      </div>
      <div class="between-style">
        <div class="sub-title">输入总分</div>
        <el-input
          v-model="sum"
          placeholder="请输入总分"
          maxlength="3"
          oninput="value=value.replace(/[^\d]/g,'')"
          class="inline-input"
        ></el-input>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addcenterDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="confirmAdd"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改弹出框 -->
    <el-dialog
      title="修改考务数据"
      :visible.sync="updatecenterDialogVisible"
      width="30%"
      :modal="false"
      center
    >
      <div class="block between-style">
        <span class="demonstration">考试时间</span>
        <el-date-picker
          v-model="value2"
          type="datetimerange"
          range-separator=":"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="time1-style"
        >
        </el-date-picker>
      </div>
      <div class="between-style">
        <div class="sub-title">输入学期</div>
        <el-autocomplete
          class="inline-input"
          v-model="semster"
          :fetch-suggestions="querySearch"
          placeholder="输入学期"
          @select="handleSelect"
        ></el-autocomplete>
      </div>
      <div class="between-style">
        <div class="sub-title">输入学科</div>
        <el-autocomplete
          class="inline-input"
          v-model="subject"
          :fetch-suggestions="querySearch1"
          placeholder="输入学科"
          @select="handleSelect1"
        ></el-autocomplete>
      </div>
      <div class="between-style">
        <div class="sub-title">输入班级</div>
        <el-autocomplete
          class="inline-input"
          v-model="clazz"
          :fetch-suggestions="querySearch2"
          placeholder="输入班级"
          @select="handleSelect2"
        ></el-autocomplete>
      </div>
      <div class="between-style">
        <div class="sub-title">选择教室</div>
        <el-autocomplete
          class="inline-input"
          v-model="room"
          :fetch-suggestions="querySearch3"
          placeholder="选择教室"
          @select="handleSelect3"
        ></el-autocomplete>
      </div>
      <div class="between-style">
        <div class="sub-title">监考老师</div>
        <el-autocomplete
          class="inline-input"
          v-model="teacher"
          :fetch-suggestions="querySearch4"
          placeholder="监考老师"
          @select="handleSelect4"
        ></el-autocomplete>
      </div>
      <div class="between-style">
        <div class="sub-title">输入类型</div>
        <el-input
          v-model="type"
          placeholder="请输入类型"
          class="inline-input"
        ></el-input>
      </div>
      <div class="between-style">
        <p>总分</p>
        <p class="sum-style">{{ sum }}</p>
      </div>

      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="updatecenterDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="confirmUpdate"
        >确 定</el-button>
      </span>
    </el-dialog>

    <el-row
      type="flex"
      class="ml-20 mt-10"
    >
      <el-input
        type="text"
        v-model="input"
        clearable
        placeholder="请输入任意内容"
        class="blur-search"
        size="mini"
        @input="filterSearch()"
      ></el-input>

      <el-button
        type="success"
        size="mini"
        class="ml-10"
        icon="el-icon-search"
      >搜索</el-button>
    </el-row>
    <el-row class="df-jr-ac ml-20 mt-10">
      <el-col class="tl">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="small"
          @click="addcenterDialogVisible = true"
        ><span>添加考试</span></el-button>
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="small"
          @click="delAll()"
          disabled=""
        >批量删除</el-button>
        <!-- 删除提示框
        <el-dialog title="提示" :visible.sync="batchdelVisible" width="300px" center>
          <div class="del-dialog-cnt">批量删除一卡通信息后不可恢复，是否确定删除？</div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="batchdelVisible = false">取 消</el-button>
            <el-button type="primary" @click="deleteBatch()">确 定</el-button>
          </span>
        </el-dialog> -->
      </el-col>
      <el-col class="tr mr-20">
        <el-button
          icon="el-icon-refresh"
          size="small"
        ></el-button>
      </el-col>
    </el-row>
    <!-- 表格展示 -->
    <el-row>
      <el-col span="1"></el-col>
      <el-col
        span="23"
        class="ml-20 mt-10"
      >
        <el-table
          :data="examinationList"
          stripe="true"
          style="width: 100%;"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            min-width="10%"
          > </el-table-column>
          <el-table-column
            label="学期"
            show-overflow-tooltip
            min-width="13%"
          >
            <template slot-scope="scope">
              <span style="margin-left:-5%">{{ scope.row.semester }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="课程"
            show-overflow-tooltip
            min-width="8%"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="类型"
            show-overflow-tooltip
            min-width="10%"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.type }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="监考老师"
            show-overflow-tooltip
            min-width="8%"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.teacherName }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="开始时间"
            show-overflow-tooltip
            min-width="14%"
          >
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span>{{ scope.row.startTime }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="结束时间"
            show-overflow-tooltip
            min-width="14%"
          >
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span>{{ scope.row.finishTime }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="地点"
            show-overflow-tooltip
            min-width="10%"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.area }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="创建时间"
            show-overflow-tooltip
            min-width="14%"
          >
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span>{{ scope.row.gmtCreate }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            show-overflow-tooltip
            min-width="26%"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="success"
                @click="handleUpdate(scope.$index, scope.row)"
              >编辑</el-button>
              <el-button
                size="mini"
                type="primary"
                @click="handleDetail(scope.$index, scope.row)"
              >考生管理</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <div
      class="block"
      style="margin-top:2%"
    >
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
const API = require('../utils/api')
export default {
  data() {
    return {
      textData: [],
      selectValue: '',
      examinationList: [],
      examinationList1: [],
      detailList: [],
      currentPage: 1,
      total: 0,
      pageSize: 10,
      updatecenterDialogVisible: false,
      addcenterDialogVisible: false,
      selectcenterDialogVisible: false,
      datailcenterDialogVisible: false,
      delVisible: false, //删除提示弹框的状态
      batchdelVisible: false,
      delarr: [], //存放删除的数据
      multipleSelection: [],
      value1: '',
      input: '',
      gmtTime: '',
      msg: '', //记录每一条的信息，便于取id
      students: [],
      value2: [new Date(2020, 0, 11, 10, 10, 10), new Date(2020, 10, 11, 10, 10, 10)],
      semsters: [],
      semster: '',
      subjects: [],
      subject: '',
      subjectId: 0,
      classes: [],
      clazz: '',
      clazzId: 0,
      rooms: [],
      room: '',
      teachers: [],
      teacher: '',
      teacherId: 0,
      type: '',
      sum: '',
      startTime: '',
      endTime: '',
      old: ''
    }
  },
  created() {
    this.getCardAll()
    this.fenYe()
  },
  watch: {
    pageSize: function() {
      this.fenYe()
      // this.getCardAll()
    },
    currentPage: function() {
      this.fenYe()
      //this.getCardAll()
    },
    total: function() {}
  },
  methods: {
    async confirmUpdate() {
      this.startTime = this.dateFormat(this.value2[0])
      this.endTime = this.dateFormat(this.value2[1])
      for (let i = 0; i < this.subjects.length; i++) {
        if (this.subject == this.subjects[i].value) {
          this.subjectId = this.subjects[i].id
        }
      }
      for (let i = 0; i < this.classes.length; i++) {
        if (this.clazz == this.classes[i].value) {
          this.clazzId = this.classes[i].id
        }
      }
      for (let i = 0; i < this.teachers.length; i++) {
        if (this.teacher == this.teachers[i].value) {
          this.teacherId = this.teachers[i].id
        }
      }
      this.url = '/examination/modification'
      this.data = {
        area: this.room,
        clazzId: this.clazzId,
        finishTime: this.endTime,
        oldSubjectId: this.old,
        semester: this.semster,
        startTime: this.startTime,
        subjectId: this.subjectId,
        teacherId: this.teacherId,
        teacherName: this.teacher,
        type: this.type
      }
      this.result = await API.init(this.url, this.data, 'post')
      // this.$message.error('错了哦，这是一条错误消息');
      // this.$message('这是一条消息提示');
      console.log(this.result)
      if (this.result.code == 1) {
        this.$message('修改成功')
        this.getCardAll()
        this.updatecenterDialogVisible = false
      } else {
        this.$message.error('修改失败')
      }
    },
    async confirmAdd() {
      this.startTime = this.dateFormat(this.value2[0])
      this.endTime = this.dateFormat(this.value2[1])
      for (let i = 0; i < this.subjects.length; i++) {
        if (this.subject == this.subjects[i].value) {
          this.subjectId = this.subjects[i].id
        }
      }
      for (let i = 0; i < this.classes.length; i++) {
        if (this.clazz == this.classes[i].value) {
          this.clazzId = this.classes[i].id
        }
      }
      for (let i = 0; i < this.teachers.length; i++) {
        if (this.teacher == this.teachers[i].value) {
          this.teacherId = this.teachers[i].id
        }
      }
      this.url = '/examination/increase'
      this.data = {
        area: this.room,
        clazzId: this.clazzId,
        finishTime: this.endTime,
        score: this.sum,
        semester: this.semster,
        startTime: this.startTime,
        subjectId: this.subjectId,
        teacherId: this.teacherId,
        teacherName: this.teacher,
        type: this.type
      }
      this.result = await API.init(this.url, this.data, 'post')
      // this.$message.error('错了哦，这是一条错误消息');
      // this.$message('这是一条消息提示');
      console.log(this.result)
      if (this.result.code == 1) {
        this.$message('新增成功')
        this.getCardAll()
        this.addcenterDialogVisible = false
      }
      if (this.result.code == 30005) {
        this.$message.error(this.result.msg)
      }
      if (this.result.code == 30006) {
        this.$message.error(this.result.msg)
      }
      if (this.result.code == 30007) {
        this.$message.error(this.result.msg)
      }
    },
    fenYe() {
      console.log(this.pageSize)
      this.examinationList = []
      this.examinationList1 = []
      for (let i = 0; i < this.pageSize && (this.currentPage - 1) * this.pageSize + i < this.textData.length; i++) {
        this.examinationList.push(this.textData[(this.currentPage - 1) * this.pageSize + i])
        this.examinationList1.push(this.textData[(this.currentPage - 1) * this.pageSize + i])
        this.examinationList[i].gmtCreate = this.formatDate(this.examinationList[i].gmtCreate)
        this.examinationList[i].startTime = this.formatDate(this.examinationList[i].startTime)
        this.examinationList[i].finishTime = this.formatDate(this.examinationList[i].finishTime)
      }
      console.log(this.examinationList)
    },
    // 分页查询所有
    async getCardAll() {
      this.url = '/examination/all'
      this.result = await API.init(this.url, null, 'post')
      this.textData = this.result.data
      this.total = this.textData.length
      this.fenYe()
    },
    // 当前页展示数据
    handleSizeChange: function(pageSize) {
      this.pageSize = pageSize
    },
    // 当前页
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage
    },
    async handleDetail(index, row) {
      console.log(index, row)
      this.url = '/examination/student'
      this.data = {
        clazzId: row.clazzId,
        semester: row.semester,
        subjectId: row.subjectId
      }
      this.result = await API.init(this.url, this.data, 'post')
      console.log(this.result)
      this.students = this.result.data
      this.selectcenterDialogVisible = true
    },
    handleUpdate(index, row) {
      console.log(index, row)
      for (let i = 0; i < this.subjects.length; i++) {
        if (row.subjectId == this.subjects[i].id) {
          this.subject = this.subjects[i].value
        }
      }
      for (let i = 0; i < this.classes.length; i++) {
        if (row.clazzId == this.classes[i].id) {
          this.clazz = this.classes[i].value
        }
      }
      for (let i = 0; i < this.teachers.length; i++) {
        if (row.teacherId == this.teachers[i].id) {
          this.teacher = this.teachers[i].value
        }
      }
      this.semster = row.semester
      this.room = row.area
      this.type = row.type
      this.sum = row.score
      this.old = row.subjectId
      this.value2[0] = row.startTime
      this.value2[1] = row.finishTime
      this.updatecenterDialogVisible = true
    },
    //单行删除
    async handleDelete(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // console.log(index, row)
        this.url = '/examination/deletion'
        this.data = {
          clazzId: row.clazzId,
          semester: row.semester,
          subjectId: row.subjectId
        }
        this.result = API.init(this.url, this.data, 'post')
        let index = this.examinationList.indexOf(row)
        this.examinationList.splice(index, 1)
        // this.getCardAll()
      })
    },
    formatDate(value) {
      let date = new Date(value)
      let y = date.getFullYear()
      let MM = date.getMonth() + 1
      MM = MM < 10 ? '0' + MM : MM
      let d = date.getDate()
      d = d < 10 ? '0' + d : d
      let h = date.getHours()
      h = h < 10 ? '0' + h : h
      let m = date.getMinutes()
      m = m < 10 ? '0' + m : m
      let s = date.getSeconds()
      s = s < 10 ? '0' + s : s
      return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
    },
    dateFormat(time) {
      var date = new Date(time)
      var year = date.getFullYear()
      /* 在日期格式中，月份是从0开始的，因此要加0
       * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
       * */
      var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
      var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      var seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      // 拼接
      return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
    },
    //过滤搜索
    filterSearch() {
      // 获取输入框的值
      let search = this.input
      //数组元素按条件过滤
      this.examinationList = this.textData.filter((v) => {
        if (JSON.stringify(v).includes(search)) {
          return v
        }
      })
    },
    // 学期
    async selectSemster() {
      this.url = '/semester/all'
      this.result = await API.init(this.url, null, 'post')
      for (let i = 0; i < this.result.data.length; i++) {
        this.semsters.push({ value: this.result.data[i].name })
      }
    },
    querySearch(queryString, cb) {
      var semsters = this.semsters
      var results = queryString ? semsters.filter(this.createFilter(queryString)) : semsters
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (semster) => {
        return semster.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    handleSelect(item) {
      console.log(item)
    },
    //学科
    async selectSubject() {
      this.url = '/subject/exam/all'
      this.result = await API.init(this.url, null, 'post')
      for (let i = 0; i < this.result.data.length; i++) {
        this.subjects.push({ value: this.result.data[i].name, id: this.result.data[i].pkSubjectId })
      }
    },
    querySearch1(queryString, cb) {
      var subjects = this.subjects
      var results = queryString ? subjects.filter(this.createFilter1(queryString)) : subjects
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter1(queryString) {
      return (subject) => {
        return subject.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    handleSelect1(item) {
      console.log(item)
    },
    // 班级
    async selectClass() {
      this.url = '/clazz/exam/all'
      this.result = await API.init(this.url, null, 'post')
      for (let i = 0; i < this.result.data.length; i++) {
        this.classes.push({ value: this.result.data[i].name, id: this.result.data[i].pkClazzId })
      }
    },
    querySearch2(queryString, cb) {
      var classes = this.classes
      var results = queryString ? classes.filter(this.createFilter2(queryString)) : classes
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter2(queryString) {
      return (clazz) => {
        return clazz.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    handleSelect2(item) {
      console.log(item)
    },
    //教室
    async selectRoom() {
      this.url = '/tower/list/teach'
      this.result = await API.init(this.url, null, 'post')
      console.log(this.result.data)
      for (let i = 0; i < this.result.data.length; i++) {
        for (let j = 0; j < this.result.data[i].rooms.length; j++) {
          this.rooms.push({ value: this.result.data[i].name + this.result.data[i].rooms[j].name })
        }
      }
      console.log(this.rooms)
    },
    querySearch3(queryString, cb) {
      var rooms = this.rooms
      var results = queryString ? rooms.filter(this.createFilter3(queryString)) : rooms
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter3(queryString) {
      return (room) => {
        return room.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    handleSelect3(item) {
      console.log(item)
    },
    // 教师
    async selectTeacher() {
      this.url = '/userAccount/headmaster'
      this.result = await API.init(this.url, null, 'post')
      for (let i = 0; i < this.result.data.length; i++) {
        this.teachers.push({ value: this.result.data[i].userName, id: this.result.data[i].pkUserAccountId })
      }
    },
    querySearch4(queryString, cb) {
      var teachers = this.teachers
      var results = queryString ? teachers.filter(this.createFilter4(queryString)) : teachers
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter4(queryString) {
      return (teacher) => {
        return teacher.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    handleSelect4(item) {
      console.log(item)
    }
  },
  mounted() {
    this.selectSemster()
    this.selectSubject()
    this.selectClass()
    this.selectRoom()
    this.selectTeacher()
  }
}
</script>

<style scoped lang="scss">
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
.el-input__inner {
  height: 30px;
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
.between-style {
  margin-top: 10px;
  display: flex;
}
.students-style {
  margin-left: 18%;
  display: flex;
}
.stu-left {
  flex: 0 0 60%;
}
.stu-right {
  flex: 0 0 40%;
}
.sub-title {
  margin-right: 30px;
  margin-top: 10px;
}
.time-style {
  margin-top: 15px;
  margin-bottom: 10px;
  margin-left: 30px;
  width: 300px;
}
.inline-input {
  width: 300px;
}
.time1-style {
  width: 300px;
  margin-left: 30px;
}
.sum-style {
  margin-left: 60px;
}
</style>
