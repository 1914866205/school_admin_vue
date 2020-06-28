<template>
  <el-container>
    <!-- 课表上方的 学期、班级、周次信息 -->
    <el-header class="header">
      <el-form :inline="true" ref="form" :model="form" size="mini" style="margin-top: 10px">
        <el-form-item>
          <el-select v-model="form.semester" placeholder="学期" @change="changeWeekCount()">
            <el-option v-for="(item, index) in semesterList" :key="index" :value="item.pkSemesterId" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="form.clazz" placeholder="班级" @change="changeClazz()">
            <el-option v-for="(item, index) in clazzList" :key="index" :value="item.pkClazzId" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="form.week" placeholder="周次" @change="showSchedule()">
            <el-option v-for="(item, index) in weekList" :key="index" :value="item"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <!-- 课表主界面 -->
      <table align="center" border="1" cellspacing="0">
        <thead>
          <tr>
            <th colspan="2"></th>
            <th v-for="item in weekDuration1.slice(0, 6)" :key="item + 1">周{{ item }}</th>
            <th>周日</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td rowspan="2">上午</td>
            <td>1-2</td>
            <td
              v-for="(item, index) in courseList1"
              :key="index"
              @click="openDialog(firstLine[index])"
              :style="{ backgroundColor: item.backgroundColor }"
            >
              <!-- <div class="info" v-show="item.isShow">
                <span>{{ item.subjectName }}</span>
                <span>{{ item.teacherName }}</span>
                <span>{{ item.towerName }}{{ item.roomName }}</span>
              </div> -->
              <p style="width: 100%; height: 50%;">
                <span>{{ firstLine[index].course }}</span>
              </p>
              <p style="width: 100%; height: 50%">
                <span>{{ firstLine[index].towerName }}</span
                ><span>{{ firstLine[index].roomName }}</span>
              </p>
            </td>
          </tr>
          <tr>
            <td>3-4</td>
            <td
              v-for="(item, index) in courseList2"
              :key="index"
              @click="openDialog(secondLine[index])"
              :style="{ backgroundColor: item.backgroundColor }"
            >
              <div class="info" v-show="item.isShow">
                <!-- <span>{{ item.subjectName }}</span>
                <span>{{ item.teacherName }}</span>
                <span>{{ item.towerName }}{{ item.roomName }}</span> -->
                <!-- <input type="text" class="course" v-model="secondLine[index].course" /> -->
                <p style="width: 100%; height: 50%;">
                  <span>{{ secondLine[index].course }}</span>
                </p>
                <p style="width: 100%; height: 50%">
                  <span>{{ secondLine[index].towerName }}</span
                  ><span>{{ secondLine[index].roomName }}</span>
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="9"></td>
          </tr>
          <tr>
            <td rowspan="2">下午</td>
            <td>5-6</td>
            <td
              v-for="(item, index) in courseList3"
              @click="openDialog(thirdLine[index])"
              :key="index"
              :style="{ backgroundColor: item.backgroundColor }"
            >
              <div class="info" v-show="item.isShow">
                <!-- <span>{{ item.subjectName }}</span>
                <span>{{ item.teacherName }}</span>
                <span>{{ item.towerName }}{{ item.roomName }}</span> -->
                <!-- <input type="text" class="course" v-model="thirdLine[index].course" /> -->
                <p style="width: 100%; height: 50%;">
                  <span>{{ thirdLine[index].course }}</span>
                </p>
                <p style="width: 100%; height: 50%">
                  <span>{{ thirdLine[index].towerName }}</span
                  ><span>{{ thirdLine[index].roomName }}</span>
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td>7-8</td>
            <td
              v-for="(item, index) in courseList4"
              :key="index"
              @click="openDialog(forthLine[index])"
              :style="{ backgroundColor: item.backgroundColor }"
            >
              <div class="info" v-show="item.isShow">
                <!-- <span>{{ item.subjectName }}</span>
                <span>{{ item.teacherName }}</span>
                <span>{{ item.towerName }}{{ item.roomName }}</span> -->
                <!-- <input type="text" class="course" v-model="forthLine[index].course" /> -->
                <p style="width: 100%; height: 50%;">
                  <span>{{ forthLine[index].course }}</span>
                </p>
                <p style="width: 100%; height: 50%">
                  <span>{{ forthLine[index].towerName }}</span
                  ><span>{{ forthLine[index].roomName }}</span>
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="9"></td>
          </tr>
          <tr>
            <td>晚间</td>
            <td>9-10</td>
            <td
              v-for="(item, index) in courseList5"
              :key="index"
              @click="openDialog(fifthLine[index])"
              :style="{ backgroundColor: item.backgroundColor }"
            >
              <div class="info" v-show="item.isShow">
                <p style="width: 100%; height: 50%;">
                  <span>{{ fifthLine[index].course }}</span>
                </p>
                <p style="width: 100%; height: 50%">
                  <span>{{ fifthLine[index].towerName }}</span>
                  <span>{{ fifthLine[index].roomName }}</span>
                </p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <button @click="print">点击我</button>
      <!-- 课表下方的周次表 -->
      <table style="margin-top: 100px" align="center" border="1" cellspacing="50">
        <caption>
          以上配置应用周次
        </caption>
        <tbody>
          <tr>
            <td
              class="item"
              v-for="(item1, index) in weekDuration1"
              :key="item1"
              @click="choice1(index)"
              :class="isChoice1[index] ? 'choice' : ''"
            >
              第{{ item1 }}周
            </td>
          </tr>
          <tr>
            <td
              class="item"
              v-for="(item2, index) in weekDuration2"
              :key="item2"
              @click="choice2(index)"
              :class="isChoice2[index] ? 'choice' : ''"
            >
              第{{ item2 }}周
            </td>
          </tr>
        </tbody>
      </table>
    </el-main>
    <div class="dialog" v-if="dialogFormVisible">
      <el-form class="mt-10 dialog-form dc-jc-ac" :model="adminInfo" style="padding: 0px 20px;">
        <p style="width: 90%;" class="dark-large-font tl">{{ msg }}用户</p>
        <el-form-item required label="教工号" class="mt-20" :label-width="formLabelWidth" style="width: 90%;">
          <el-input
            v-model="scheduleInfo.jobNumber"
            autocomplete="off"
            @input="filterTeacher"
            placeholder="请输入教工号"
            style="width: 80%"
          ></el-input>
          <div class="sub ml-10" v-if="teachers.length > 0">
            <p v-for="(item, index) in teachers" :key="index" @click="fillTeacherInfo(item)">
              {{ item.userName }}
            </p>
          </div>
        </el-form-item>
        <p class="df-jb-ac" style="width: 90%">
          <el-form-item min-width="50%" required label="楼栋">
            <el-select v-model="scheduleInfo.tower" placeholder="请选择楼栋" class="ml-10" @change="getTowerRooms" style="width: 60%">
              <el-option v-for="(item, index) in towersRooms" :key="index" :label="item.name" :value="item.pk_tower_id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item min-width="50%" label="房间" required class="ml-10">
            <el-select v-model="scheduleInfo.room" placeholder="选择教室" @change="getRoomId" style="width: 60%">
              <el-option v-for="(item, index) in rooms" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </p>
        <el-form-item required label="课程" :label-width="formLabelWidth" style="width: 90%;">
          <el-input v-model="scheduleInfo.subject" @input="getKeySubjects" placeholder="请输入教工号" style="width: 80%"></el-input>
          <div class="sub" v-if="keySubjects.length > 0">
            <p v-for="(item, index) in keySubjects" :key="index" @click="fillInput(item)">
              {{ item.name }}
            </p>
          </div>
        </el-form-item>
        <p class="mt-20 tr" style="width: 90%">
          <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
          <el-button type="primary" @click="addSubjectInfo(tag)" size="small">确定</el-button>
        </p>
      </el-form>
    </div>
  </el-container>
</template>

<script>
const API = require('../utils/api.js')
export default {
  name: 'TimeTable',
  data() {
    return {
      form: {
        semester: '',
        clazz: '',
        week: ''
      },
      course1: '',
      state2: '',
      // 界面底部的周次数组
      weekDuration1: ['一', '二', '三', '四', '五', '六', '七', '八', '九'],
      isChoice1: [],
      weekDuration2: ['十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八'],
      isChoice2: [],
      firstLine: [
        {
          time: 1,
          course: '',
          courseId: null,
          teacherId: null,
          towerId: null,
          roomId: null,
          towerName: '',
          roomName: '',
          teacher: '',
          weekDay: 1
        },
        {
          time: 1,
          course: '',
          courseId: null,
          teacherId: null,
          towerId: null,
          roomId: null,
          towerName: '',
          roomName: '',
          teacher: '',
          weekDay: 2
        },
        {
          time: 1,
          course: '',
          courseId: null,
          teacherId: null,
          towerId: null,
          roomId: null,
          towerName: '',
          roomName: '',
          teacher: '',
          weekDay: 3
        },
        {
          time: 1,
          course: '',
          courseId: null,
          teacherId: null,
          towerId: null,
          roomId: null,
          towerName: '',
          roomName: '',
          teacher: '',
          weekDay: 4
        },
        {
          time: 1,
          course: '',
          courseId: null,
          teacherId: null,
          towerId: null,
          roomId: null,
          towerName: '',
          roomName: '',
          teacher: '',
          weekDay: 5
        },
        {
          time: 1,
          course: '',
          courseId: null,
          teacherId: null,
          towerId: null,
          roomId: null,
          towerName: '',
          roomName: '',
          teacher: '',
          weekDay: 6
        },
        {
          time: 1,
          course: '',
          courseId: null,
          teacherId: null,
          towerId: null,
          roomId: null,
          towerName: '',
          roomName: '',
          teacher: '',
          weekDay: 7
        }
      ],
      secondLine: [
        {
          time: 2,
          course: '',
          courseId: null,
          teacherId: null,
          towerId: null,
          roomId: null,
          towerName: '',
          roomName: '',
          teacher: '',
          weekDay: 1
        },
        {
          time: 2,
          course: '',
          courseId: null,
          teacherId: null,
          towerId: null,
          roomId: null,
          towerName: '',
          roomName: '',
          teacher: '',
          weekDay: 2
        },
        {
          time: 2,
          course: '',
          courseId: null,
          teacherId: null,
          towerId: null,
          roomId: null,
          towerName: '',
          roomName: '',
          teacher: '',
          weekDay: 3
        },
        {
          time: 2,
          course: '',
          courseId: null,
          teacherId: null,
          towerId: null,
          roomId: null,
          towerName: '',
          roomName: '',
          teacher: '',
          weekDay: 4
        },
        {
          time: 2,
          course: '',
          courseId: null,
          teacherId: null,
          towerId: null,
          roomId: null,
          towerName: '',
          roomName: '',
          teacher: '',
          weekDay: 5
        },
        {
          time: 2,
          course: '',
          courseId: null,
          teacherId: null,
          towerId: null,
          roomId: null,
          towerName: '',
          roomName: '',
          teacher: '',
          weekDay: 6
        },
        {
          time: 2,
          course: '',
          courseId: null,
          teacherId: null,
          towerId: null,
          roomId: null,
          towerName: '',
          roomName: '',
          teacher: '',
          weekDay: 7
        }
      ],
      thirdLine: [
        {
          time: 3,
          course: '',
          courseId: null,
          teacherId: null,
          towerId: null,
          roomId: null,
          towerName: '',
          roomName: '',
          teacher: '',
          weekDay: 1
        },
        {
          time: 3,
          course: '',
          courseId: null,
          teacherId: null,
          towerId: null,
          roomId: null,
          towerName: '',
          roomName: '',
          teacher: '',
          weekDay: 2
        },
        {
          time: 3,
          course: '',
          courseId: null,
          teacherId: null,
          towerId: null,
          roomId: null,
          towerName: '',
          roomName: '',
          teacher: '',
          weekDay: 3
        },
        {
          time: 3,
          course: '',
          courseId: null,
          teacherId: null,
          towerId: null,
          roomId: null,
          towerName: '',
          roomName: '',
          teacher: '',
          weekDay: 4
        },
        {
          time: 3,
          course: '',
          courseId: null,
          teacherId: null,
          towerId: null,
          roomId: null,
          towerName: '',
          roomName: '',
          teacher: '',
          weekDay: 5
        },
        {
          time: 3,
          course: '',
          courseId: null,
          teacherId: null,
          towerId: null,
          roomId: null,
          towerName: '',
          roomName: '',
          teacher: '',
          weekDay: 6
        },
        {
          time: 3,
          course: '',
          courseId: null,
          teacherId: null,
          towerId: null,
          roomId: null,
          towerName: '',
          roomName: '',
          teacher: '',
          weekDay: 7
        }
      ],
      forthLine: [
        {
          time: 4,
          course: '',
          courseId: null,
          teacherId: null,
          towerId: null,
          roomId: null,
          towerName: '',
          roomName: '',
          teacher: '',
          weekDay: 1
        },
        {
          time: 4,
          course: '',
          courseId: null,
          teacherId: null,
          towerId: null,
          roomId: null,
          towerName: '',
          roomName: '',
          teacher: '',
          weekDay: 2
        },
        {
          time: 4,
          course: '',
          courseId: null,
          teacherId: null,
          towerId: null,
          roomId: null,
          towerName: '',
          roomName: '',
          teacher: '',
          weekDay: 3
        },
        {
          time: 4,
          course: '',
          courseId: null,
          teacherId: null,
          towerId: null,
          roomId: null,
          towerName: '',
          roomName: '',
          teacher: '',
          weekDay: 4
        },
        {
          time: 4,
          course: '',
          courseId: null,
          teacherId: null,
          towerId: null,
          roomId: null,
          towerName: '',
          roomName: '',
          teacher: '',
          weekDay: 5
        },
        {
          time: 4,
          course: '',
          courseId: null,
          teacherId: null,
          towerId: null,
          roomId: null,
          towerName: '',
          roomName: '',
          teacher: '',
          weekDay: 6
        },
        {
          time: 4,
          course: '',
          courseId: null,
          teacherId: null,
          towerId: null,
          roomId: null,
          towerName: '',
          roomName: '',
          teacher: '',
          weekDay: 7
        }
      ],
      fifthLine: [
        {
          time: 5,
          course: '',
          courseId: null,
          teacherId: null,
          towerId: null,
          roomId: null,
          towerName: '',
          roomName: '',
          teacher: '',
          weekDay: 1
        },
        {
          time: 5,
          course: '',
          courseId: null,
          teacherId: null,
          towerId: null,
          roomId: null,
          towerName: '',
          roomName: '',
          teacher: '',
          weekDay: 2
        },
        {
          time: 5,
          course: '',
          courseId: null,
          teacherId: null,
          towerId: null,
          roomId: null,
          towerName: '',
          roomName: '',
          teacher: '',
          weekDay: 3
        },
        {
          time: 5,
          course: '',
          courseId: null,
          teacherId: null,
          towerId: null,
          roomId: null,
          towerName: '',
          roomName: '',
          teacher: '',
          weekDay: 4
        },
        {
          time: 5,
          course: '',
          courseId: null,
          teacherId: null,
          towerId: null,
          roomId: null,
          towerName: '',
          roomName: '',
          teacher: '',
          weekDay: 5
        },
        {
          time: 5,
          course: '',
          courseId: null,
          teacherId: null,
          towerId: null,
          roomId: null,
          towerName: '',
          roomName: '',
          teacher: '',
          weekDay: 6
        },
        {
          time: 5,
          course: '',
          courseId: null,
          teacherId: null,
          towerId: null,
          roomId: null,
          towerName: '',
          roomName: '',
          teacher: '',
          weekDay: 7
        }
      ],
      towersRooms: [], //楼栋
      rooms: [], //房间
      scheduleInfo: {
        jobNumber: '',
        tower: null,
        room: null,
        courseName: '',
        subject: ''
      },
      // 存放学期和班级、周次的数组
      clazzList: [],
      semesterList: [],
      weekList: [],
      // scheduleDto 对象
      scheduleDto: {
        semesterId: null,
        clazzId: null,
        week: null
      },
      // 存放课程信息的数组:
      // 1-2 节课的课程数据
      courseList1: [],
      // 1-2 节课的课程数据
      courseList2: [],
      // 1-2 节课的课程数据
      courseList3: [],
      // 1-2 节课的课程数据
      courseList4: [],
      // 1-2 节课的课程数据
      courseList5: [],
      weeks: [],
      subjects: [],
      dialogFormVisible: false,
      keySubjects: '',
      showSubject: {},
      currentPage1: 1,
      pageSize1: 100,
      studentList: [],
      studentList1: [],
      teachers: []
    }
  },
  components: {},
  created() {
    this.getAllInfo()
    this.getTeachTowers()
    this.getAllSubject()
    this.getTeacherAll()
    // 初始化周次的状态
    for (let i = 0; i < this.weekDuration1.length; i++) {
      this.isChoice1.splice(i, 0, false)
      this.isChoice2.splice(i, 0, false)
    }
    this.courseList1 = this.initArr()
    this.courseList2 = this.initArr()
    this.courseList3 = this.initArr()
    this.courseList4 = this.initArr()
    this.courseList5 = this.initArr()
  },
  mounted() {},
  methods: {
    async print() {
      let choice = this.isChoice1.concat(this.isChoice2)
      for (let i = 0, len = choice.length; i < len; i++) {
        if (choice[i] == true) {
          this.weeks.push(i + 1)
        }
      }
      let courses = this.handleCourse()
      let scheduleDto = {
        semesterId: this.form.semester,
        clazzId: this.form.clazz,
        courses: JSON.stringify(courses),
        weeks: JSON.stringify(this.weeks)
      }
      let result = await API.init('/timetable/increase', scheduleDto, 'post')
      console.log(result)
    },
    handleCourse() {
      let arr1 = []
      arr1 = this.firstLine.filter((fl) => {
        if (fl.course != '') {
          return fl
        }
      })
      let arr2 = []
      arr2 = this.secondLine.filter((fl) => {
        if (fl.course != '') {
          return fl
        }
      })
      let arr3 = []
      arr3 = this.thirdLine.filter((fl) => {
        if (fl.course != '') {
          return fl
        }
      })
      let arr4 = []
      arr4 = this.forthLine.filter((fl) => {
        if (fl.course != '') {
          return fl
        }
      })
      let arr5 = []
      arr5 = this.fifthLine.filter((fl) => {
        if (fl.course != '') {
          return fl
        }
      })
      let finallyArr = []
      finallyArr = arr1
        .concat(arr2)
        .concat(arr3)
        .concat(arr4)
        .concat(arr5)
      return finallyArr
    },
    openDialog(item) {
      this.dialogFormVisible = true
      /* this.showSubject = {} */
      this.scheduleInfo.jobNumber = item.teacherId
      this.scheduleInfo.tower = item.towerId
      this.scheduleInfo.room = item.roomId
      this.scheduleInfo.subject = item.courseId

      this.showSubject = item
    },
    //查询所有教师
    async getTeacherAll() {
      this.data = { currentPage: this.currentPage1, pageSize: this.pageSize1 }
      this.url = '/userAccount/teacher'
      this.result = await API.init(this.url, this.data, 'post')
      this.teacherList = this.result.data
      for (let i = 0; i < this.studentList.length; i++) {
        this.teacherList[i].gmtCreate = this.global.formatDate(this.teacherList[i].gmtCreate)
      }
      this.teacherList1 = this.result.data
    },
    filterTeacher(val) {
      this.teachers = this.teacherList1.filter((teacher) => {
        if (teacher.jobNumber.indexOf(val) !== -1 || teacher.userName.indexOf(val) !== -1) {
          return teacher
        }
      })
    },
    //分配课程
    addSubjectInfo() {
      this.showSubject.course = this.scheduleInfo.subject
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>')
      console.log(this.showSubject)
      this.dialogFormVisible = false
    },
    //获取所有教学楼信息
    async getTeachTowers() {
      this.towersRooms = (await API.init('/tower/list/teach', null, 'post')).data
    },
    //获取所有课
    async getAllSubject() {
      this.subjects = (await API.init('/subject/list', null, 'post')).data
    },
    //推荐出想要的内容
    getKeySubjects() {
      if (this.scheduleInfo.subject == '') {
        this.keySubjects = []
      } else {
        let subjects = this.subjects
        this.keySubjects = subjects.filter((subject) => {
          if (subject.name.indexOf(this.scheduleInfo.subject) !== -1) {
            return subject
          }
        })
      }
    },
    //填充input
    fillInput(val) {
      this.scheduleInfo.subject = val.name
      this.showSubject.courseId = val.pkSubjectId
      console.log(this.showSubject)
      this.keySubjects = []
    },
    //填充教师信息
    fillTeacherInfo(val){
      this.scheduleInfo.jobNumber = val.userName
      this.showSubject.teacherId = val.jobNumber
      this.teachers = [] 
    },
    //获取楼栋的所有房间
    getTowerRooms(val) {
      this.showSubject.towerId = val
      let towerRooms = this.towersRooms
      let towerRoom = towerRooms.filter((x) => {
        if (x.pk_tower_id == val) {
          this.showSubject.towerName = x.name
          return x
        }
      })
      this.rooms = towerRoom[0].rooms
    },
    //获取房间信息
    getRoomId(val) {
      this.showSubject.roomId = val
      let rooms = this.rooms
      rooms.filter((x) => {
        if (x.id == val) {
          this.showSubject.roomName = x.name
        }
      })
    },
    /**
     * 获取所有班级和学期数据
     */
    async getAllInfo() {
      let pageDto = {
        pageSize: 100,
        currentPage: 0
      }
      let clazzRes = (await API.init('/clazz/all', pageDto, 'post')).data
      console.log('..................')
      console.log(clazzRes)
      let semesterRes = (await API.init('/semester/all', null, 'post')).data
      console.log(semesterRes)
      this.clazzList = clazzRes
      this.semesterList = semesterRes
      /* for (let i = 0; i < clazzRes.data.length; i++) {
      let clazzRes = await API.init('/clazz/all', null, 'post')
      let semesterRes = await API.init('/semester/all', null, 'post')
      for (let i = 0; i < clazzRes.data.length; i++) {
        this.clazzList.push({
          name: clazzRes.data[i].name,
          id: clazzRes.data[i].pkClazzId
        })
      }
      for (let i = 0; i < semesterRes.data.length; i++) {
        this.semesterList.push({
          name: semesterRes.data[i].name,
          weekCount: semesterRes.data[i].weekCount,
          id: semesterRes.data[i].pkSemesterId
        })
      } */
    },

    /**
     * 选择 1-9 周的 td 方法
     */
    choice1(i) {
      let status = this.isChoice1[i]
      this.isChoice1.splice(i, 1, !status)
    },

    /**
     * 选择 10-18 周的 td 方法
     */
    choice2(i) {
      let status = this.isChoice2[i]
      this.isChoice2.splice(i, 1, !status)
      console.log(this.isChoice2)
    },

    /**
     * 根据所选学期寻找出对应的周次
     */
    changeWeekCount() {
      // 遍历学期数组，查找出操作者选中的那一个选项值
      for (let i = 0; i < this.semesterList.length; i++) {
        if (this.form.semester == this.semesterList[i].name) {
          // 查找出当前选中学期对应的周次数（本学期内应有多少周的课程）
          this.weekList = this.semesterList[i].weekCount
          // 查找出当前选中学期对应的学期id，为下面查找课程做铺垫
          this.scheduleDto.semesterId = this.semesterList[i].id
          return
        }
      }
    },

    /**
     * 当选中的班级发生改变时，进行数据判断操作
     */
    changeClazz() {
      for (let i = 0; i < this.clazzList.length; i++) {
        if (this.form.clazz == this.clazzList[i].name) {
          // 查找出当前选中班级对应的班级id，为下面查找课程做铺垫
          this.scheduleDto.clazzId = this.clazzList[i].id
          return
        }
      }
    },

    /**
     * 根据 学期id、班级id、周次 查询出当周的课程信息
     */
    async showSchedule() {
      this.scheduleDto.week = this.form.week
      let scheduleRes = await API.init('/timetable/info', this.scheduleDto, 'post')
      // 本周内所有课程的数组
      let courseList = scheduleRes.data
      // 以上课时间将课程分组
      // 每天上午第一节课
      let cou1 = []
      // 每天上午第二节课
      let cou2 = []
      // 每天上午第三节课
      let cou3 = []
      // 每天上午第四节课
      let cou4 = []
      // 每天上午第五节课
      let cou5 = []
      for (let i = 0; i < courseList.length; i++) {
        let item = courseList[i]
        let time = item.time
        switch (time) {
          case 1:
            cou1.push(item)
            break
          case 2:
            cou2.push(item)
            break
          case 3:
            cou3.push(item)
            break
          case 4:
            cou4.push(item)
            break
          case 5:
            cou5.push(item)
            break
        }
      }
      // 依次遍历数组，拟造出一个完整的 td数组
      this.courseList1 = this.createTd(cou1)
      this.courseList2 = this.createTd(cou2)
      this.courseList3 = this.createTd(cou3)
      this.courseList4 = this.createTd(cou4)
      this.courseList5 = this.createTd(cou5)
    },

    /**
     * 传入一个数组对象，遍历并填充数组，拟造出一个完整的 td 数组（七天）
     */
    createTd(arr) {
      let array = []
      // 初始化 array 数组，默认 isShow = false, data = null
      for (let i = 0; i < 7; i++) {
        array[i] = {
          isShow: false
        }
      }
      // 根据 arr 数组内的数据，重新给 array数组赋值
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i]
        item['isShow'] = true
        array[item.weekDay - 1] = item
      }
      return array
    },

    /**
     * 初始化 td数组的方法
     */
    initArr() {
      let array = []
      // 初始化 array 数组，默认 isShow = false, data = null
      for (let i = 0; i < 7; i++) {
        array[i] = {
          isShow: true
        }
      }
      return array
    }
  },
  computed: {}
}
</script>

<style scoped lang="scss">
.header {
  display: flex;
  align-items: center;
}

table {
  text-align: center;

  .choice {
    background-color: rgb(106, 163, 251);
  }

  .item {
    cursor: pointer;
  }

  tr,
  th,
  td {
    width: 150px;
    height: 70px;
    border: 1px solid blank;
  }
}
.info {
  display: flex;
  flex-direction: column;
}

.course {
  height: 100%;
  border: none;
  text-align: center;
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

.sub {
  position: absolute;
  margin-top: 5px;
  background-color: white;
  box-shadow: 0px 1px 1px 1px #ddd;
  border-radius: 5px;
  z-index: 100;
  min-width: 30%;
  margin-left: 15%;
  max-height: 100px;
  overflow: auto;
}
</style>
