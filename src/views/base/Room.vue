<template>
  <div class="room-container" style="width: 100%">
    <el-row type="flex" style="width: 100%">
      <el-col span="4" class="tl">
        <el-input prefix-icon="el-icon-search" v-model="towerSearch" placeholder="请输入内容" class="blur-search mt-10"></el-input>
        <el-tree :data="towers" :props="defaultProps" @node-click="handleNodeClick" class="mt-20"></el-tree>
      </el-col>
      <el-col span="20">
        <!-- 操作按钮 -->
        <el-row type="flex" class="ml-20 mt-10">
          <el-input v-model="input" prefix-icon="el-icon-search" placeholder="请输入内容" class="blur-search" v-if="searchShow"></el-input>
          <el-button v-if="searchShow" type="success" size="mini" @click="search()" class="ml-10 bg-green" icon="">
            <i class="el-icon-search" style="color: rgb(247, 251, 255)"></i>
            <span class="light-font-color">搜索</span>
          </el-button>
        </el-row>
        <el-row class="df-jr-ac ml-20 mt-10">
          <el-col class="tl">
            <el-button type="primary" icon="el-icon-plus" @click="dialogFormVisible = true" size="mini">
              <span class="light-font-color">新增</span>
            </el-button>
            <el-button type="success" icon="el-icon-edit" size="mini">
              <span class="light-font-color">修改</span>
            </el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">
              <span class="light-font-color">删除</span>
            </el-button>
            <el-button type="warning" icon="el-icon-download" size="mini">
              <span class="light-font-color">导出</span>
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
            :data="roomsList.slice(start, end)"
            tooltip-effect="dark"
            style="width: 100%"
            class="light-small-font"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" min-width="5%"></el-table-column>
            <el-table-column label="楼栋" min-width="10%">
              <template slot-scope="scope">{{ scope.row.towerName }}</template>
            </el-table-column>
            <el-table-column label="单元" min-width="15%">
              <template slot-scope="scope">{{ scope.row.unitName }}</template>
            </el-table-column>
            <el-table-column label="房间号" min-width="15%">
              <template slot-scope="scope">{{ scope.row.roomName }}</template>
            </el-table-column>
            <el-table-column label="电费余额" min-width="20%">
              <template slot-scope="scope">{{ scope.row.electricityBalance }}</template>
            </el-table-column>
            <el-table-column label="创建时间" show-overflow-tooltip min-width="10%">
              <template slot-scope="scope">{{ scope.row.gmtGreate }}</template>
            </el-table-column>
            <el-table-column label="操作" align="center" min-width="25%">
              <template slot-scope="scope">
                <p style="text-align:center">
                  <el-button size="mini" icon="el-icon-edit" type="primary" @click="updateRoomInfo(scope.row)">
                    <span class="light-font-color">编辑</span>
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
            :total="roomsList.length"
            @prev-click="prevPage()"
            @next-click="nextPage()"
          ></el-pagination>
        </el-row>
        <!-- 新增页面 -->
        <div class="dialog" v-if="dialogFormVisible">
          <h2>新增房间信息</h2>
          <el-form class="mt-10 dialog-form dc-jc-ac" :model="room" style="border-radius: 5px">
            <el-form-item label="楼栋" required style="width: 80%">
              <el-select v-model="room.towerName" placeholder="请选择楼栋" @change="getTowerUnits" style="width: 80%">
                <el-option
                  v-for="(item, index) in units"
                  :key="index"
                  :label="item.name"
                  :value="item.pk_tower_id"
                  @click="getTowerUnits(item)"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item required label="单元" style="width: 80%">
              <el-select v-model="room.towerUnit" placeholder="请选择活动区域" style="width: 55%">
                <el-option v-for="(item, index) in towerUnits" :key="index" :label="item.name" :value="item.unit_id"></el-option>
              </el-select>
              <span style="color: red; width: 45%" class="ml-10">* 仅限宿舍</span>
            </el-form-item>
            <el-form-item required label="房间" style="width: 80%">
              <el-input v-model="room.name" autocomplete="off" placeholder="请输入房间号" style="width: 80%"></el-input>
            </el-form-item>
            <el-form-item class="tr" style="width: 80%">
              <el-button @click="dialogFormVisible = false" size="mini">取 消</el-button>
              <el-button type="primary" @click="addRoomInfo(tag)" size="mini">确定</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- <p class="df-jl-ac">
          <span class="mr-10">房间 </span>
          <el-input v-model="room.name" autocomplete="off" placeholder="请输入房间号" style="width: 40%"></el-input>
          </p> -->
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
      towerSearch: '',
      iconColor: '#fefcf8',
      pageSize: 10,
      currentPageSize: 10,
      defaultProps: {
        children: 'childTowers',
        label: 'name'
      },
      units: [],
      towerUnits: [],
      dialogFormVisible: false,
      multipleSelection: [],
      rooms: [],
      roomsList: [],
      roomsList1: [],
      room: {
        name: '',
        towerName: null,
        towerUnit: null,
        gmtGreate: '',
        pkRoomId: null,
      },
      input: '',
      towerName: -1,
      tag: 1,
      currentPage: 1
    }
  },
  created() {
    this.getRoom()
    this.getTowers()
    this.getAllTowersUnits()
  },
  mounted() {},
  methods: {
    async getRoom() {
      let res = await API.init('/room/list', null, 'post')
      this.rooms = res.data
      for (let i = 0, len = this.rooms.length; i < len; i++) {
        this.rooms[i].gmtGreate = this.global.formatDate(this.rooms[i].gmtGreate)
      }
      this.roomsList = this.rooms
      this.roomsList1 = this.rooms
      // })
    },
    //获取所有楼栋信息
    async getTowers() {
      let result = (await API.init('/tower/list/type', null, 'post')).data
      this.towers = result
    },
    /* 新增room */
    addRoom() {
      this.tag = 1
      this.dialogFormVisible = true
      this.getAllTowersUnits()
    },
    //查询所有楼栋及楼栋的所有单元信息
    async getAllTowersUnits() {
      this.units = (await API.init('/tower/units/list', null, 'post')).data
    },
    updateRoomInfo(row) {
      console.log(row)
      this.room.name = row.roomName
      this.room.towerName = row.towerId
      this.room.towerUnit = row.unitId
      this.flag = 2
      this.dialogFormVisible = true
      this.room.pkRoomId = row.pkRoomId
    },
    //新增房间消息
    async addRoomInfo(tag) {
      let time = new Date().valueOf()
      this.room.gmtGreate = this.global.formatDate(time)
      let roomInfo = {
        name: this.room.name,
        towerId: this.room.towerName,
        unitId: this.room.towerUnit
      }
      if (tag == 1) {
        let result = await API.init('/room', roomInfo, 'post')
        if (result.code == 1) {
          this.$message({
            type: 'success',
            message: '新增成功!'
          })
          this.dialogFormVisible = false
          this.getRoom()
        }
      } else {
        let result = await API.init('/modification/id', roomInfo, 'post')
        if (result.code == 1) {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          this.dialogFormVisible = false
          this.getRoom()
          /* let index = this.roomsList1.indexOf(this.room.pkRoomId)
          this.roomsList.splice(index, 1) */
        }
      }
    },
    //点击获取所有楼栋的单元
    getTowerUnits(val) {
      let towerUnits = this.units.filter((unit) => {
        if (unit.pk_tower_id == val) {
          return unit
        }
      })
      this.towerUnits = towerUnits[0].childUnit
      /* this.room.towerUnit = this.towerUnits[0].name */
    },
    //点击节点
    handleNodeClick(val) {
      if (val.name == '教学楼') {
        return
      }
      if (val.name == '宿舍楼') {
        return
      }
      this.filterSearch(val.name)
    },
    //修改房间信息
    async updateRoom() {
      let data = {
        name: this.room.name,
        towerId: 1
      }
      let res = await API.init('/room/id', data, 'post')
      // this.axios({
      //   method: 'put',
      //   url: 'http://localhost:8080/room/id',
      //   data: {
      //     name: this.room.name,
      //     towerId: 1
      //   }
      // }).then((res) => {
      if (res.data.code == 1) {
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        this.dialogFormVisible = false
      }
      // })
    },
    //刷新数据
    flush() {
      this.getRoom()
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
          url: 'http://localhost:8081/room/id/',
          data: {
            id: row.roomId
          }
        }).then((res) => {
          if (res.data.code == 1) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            let index = this.roomsList1.indexOf(row)
            this.roomsList.splice(index, 1)
            this.roomsList1 = this.roomsList1.filter((room) => {
              if (room.roomId !== row.roomId) {
                return room
              }
            })
            console.log('房间信息>>>>>>>>>>>>>>>>>>>>')
            console.log(this.roomsList1)
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
      this.iconColor = '#f1f1df'
    },
    //模糊搜索
    search() {
      this.start = 0
      this.end = 10
      this.currentPage = 1
      //数组元素按条件过滤
      this.roomsList = this.roomsList1.filter((v) => {
        if (JSON.stringify(v).indexOf(this.input) != -1) {
          return v
        }
      })
    },
    handleSelectionChange() {},
    //过滤搜索
    filterSearch(name) {
      //数组元素按条件过滤
      this.roomsList = this.roomsList1.filter((v) => {
        if (v.towerName === name) {
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
</style>
