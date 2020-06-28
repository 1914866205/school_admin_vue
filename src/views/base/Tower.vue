<template>
  <div style="width: 100%">
    <el-row
      type="flex"
      class="ml-20 mt-10"
    >
      <el-input
        v-model="blurSearch"
        prefix-icon="el-icon-search"
        placeholder="根据楼栋名搜索"
        class="blur-search"
        v-if="searchShow"
      ></el-input>
      <el-date-picker
        v-model="time"
        type="daterange"
        range-separator=":"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        class="date-input-search ml-10"
        value-format="yyyy-MM-dd"
        v-if="searchShow"
      >
      </el-date-picker>
      <el-button
        type="success"
        size="mini"
        @click="searchAppInfoByCreate()"
        class="ml-10"
        icon="el-icon-search"
        v-if="searchShow"
      >搜索</el-button>
    </el-row>
    <el-row class="df-jr-ac ml-20 mt-10">
      <el-col class="tl">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="openDialog"
          size="mini"
        >
          <span class="light-font-color">新增</span>
        </el-button>
        <el-button
          type="success"
          icon="el-icon-edit"
          disabled
          size="mini"
        >
          <span class="light-font-color">修改</span>
        </el-button>
        <el-button
          type="danger"
          icon="el-icon-delete"
          disabled
          size="mini"
        >
          <span class="light-font-color">删除</span>
        </el-button>
        <el-button
          type="warning"
          icon="el-icon-download"
          disabled
          size="mini"
        >
          <span class="light-font-color">导出</span>
        </el-button>
      </el-col>
      <el-col class="tr mr-20">
        <el-button
          size="mini"
          style="width: 45px"
          class="search-btn"
          @click="searchShow = !searchShow"
          @mouseover="searchOver()"
        >
          <i
            class="el-icon-search"
            style="color: white"
          ></i>
        </el-button>
        <el-button
          icon="el-icon-refresh"
          size="small"
          @click="flush()"
        ></el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-row>
      <el-col span="1"></el-col>
      <el-col
        span="23"
        class="ml-20 mt-10"
      >
        <el-row>
          <el-table
            ref="multipleTable"
            :data="towerList.slice(start, end)"
            tooltip-effect="dark"
            style="width: 100%;"
            class="light-small-font"
          >
            <el-table-column
              label="楼栋名称"
              min-width="15%"
            >
              <template slot-scope="scope">{{ scope.row.name }}</template>
            </el-table-column>
            <el-table-column
              prop="latitude"
              label="经度"
              min-width="15%"
            ></el-table-column>
            <el-table-column
              prop="longitude"
              label="纬度"
              show-overflow-tooltip
              min-width="20%"
            > </el-table-column>

            <el-table-column
              prop="gmtCreate"
              label="创建时间"
              show-overflow-tooltip
              min-width="20%"
            > </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              show-overflow-tooltip
              min-width="30%"
            >
              <template slot-scope="scope">
                <p class="tc">
                  <el-button
                    size="mini"
                    icon="el-icon-edit"
                    type="primary"
                    @click="handleEdit(scope.row)"
                  >
                    <span class="light-font-color">编辑</span>
                  </el-button>
                  <el-button
                    size="mini"
                    icon="el-icon-delete"
                    type="danger"
                    @click="handleDelete(scope.row)"
                  >
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
            :page-sizes="[8]"
            :page-size="100"
            layout="total, prev, pager, next, sizes"
            :total="towerList.length"
            @prev-click="prevPage()"
            @next-click="nextPage()"
          ></el-pagination>
        </el-row>
      </el-col>
    </el-row>
    <!-- 新增 -->
    <div
      class="dialog"
      v-if="dialogFormVisible"
    >
      <el-form
        class="mt-10 dialog-form dc-jc-ac"
        :model="towerInfo"
        style="padding: 0px 20px;"
      >
        <p
          style="width: 90%;"
          class="dark-large-font tl"
        >{{ msg }}楼栋</p>
        <el-form-item
          required
          label="楼栋名"
          class="mt-20"
          :label-width="formLabelWidth"
          style="width: 90%;"
        >
          <el-input
            v-model="towerInfo.name"
            autocomplete="off"
            placeholder="请输入楼栋名"
            style="width: 80%"
          ></el-input>
        </el-form-item>
        <p
          class="df-jb-ac"
          style="width: 90%;"
        >
          <el-form-item
            required
            label="经度"
            :label-width="formLabelWidth"
            style="width: 40%;"
          >
            <el-input
              v-model="lng"
              class="ml-10"
              placeholder="经度"
              autocomplete="off"
              style="width: 50%"
            ></el-input>
          </el-form-item>
          <el-form-item
            required
            label="纬度"
            :label-width="formLabelWidth"
            style="width: 40%;"
          >
            <el-input
              v-model="lat"
              class="ml-10"
              autocomplete="off"
              placeholder="纬度"
              style="width: 50%"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="mini"
              @click="mapVisible = true"
            >定位</el-button>
          </el-form-item>
        </p>

        <el-dialog
          :visible.sync="mapVisible"
          :modal="false"
          width="350px"
          class="dialog"
        >
          <!-- //地图 -->
          <div class="amap-page-container">
            <el-amap
              vid="amap"
              :plugin="plugin"
              class="amap-demo"
              :center="center"
              :zoom="zoom"
              :events="events"
            >
              <!-- 点击显示标记 -->
              <el-amap-marker
                v-for="(marker, index) in markers"
                :key="marker.index"
                :position="marker.position"
                :icon="marker.icon"
                :title="marker.title"
                :events="marker.events"
                :visible="marker.visible"
                :draggable="marker.draggable"
                :vid="index"
              ></el-amap-marker>
            </el-amap>
          </div>
        </el-dialog>
        <el-form-item
          required
          label="类型"
          :label-width="formLabelWidth"
          style="width: 90%;"
        >
          <el-select
            v-model="towerInfo.type"
            placeholder="选择楼栋类型"
            style="width: 80%"
          >
            <el-option
              v-for="(item, index) in towerType"
              :key="index"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <p
          class="mt-20 tr"
          style="width: 90%"
        >
          <el-button
            @click="dialogFormVisible = false"
            size="small"
          >取 消</el-button>
          <el-button
            type="primary"
            @click="addTowerInfo(tag)"
            size="small"
          >确定</el-button>
        </p>
      </el-form>
    </div>
  </div>
</template>

<script>
const API = require('../utils/api.js')
export default {
  name: 'Tower',
  data() {
    // eslint-disable-next-line no-unused-vars
    let self = this
    return {
      towerList: [],
      towerList1: [],
      formShow: false,
      dialogFormVisible: false,
      blurSearch: '',
      searchShow: true,
      start: 0,
      end: 8,
      pageSize: 8,
      tag: -1,
      input: '',
      time: [],
      currentPageSize: 8,
      currentPage: 1,
      towerInfo: {
        pkTowerId: -1,
        name: '',
        type: -1
      },
      address: '', //获取的位置
      zoom: 14, // 地图缩放
      center: [118.937761, 32.121619], // .121619初始中心
      lng: '', //经纬度
      lat: '',
      loaded: false,
      mapVisible: false,
      // 点击显示的标记默认的定位
      markers: [
        // {
        //   position: [118.937761, 32.121619]
        // }
      ],
      towerType: [
        { name: '教学楼', value: 2 },
        { name: '宿舍楼', value: 1 }
      ],
      //  自动定位到当前位置
      plugin: [
        {
          timeout: 100, //超过10秒后停止定位，默认：无穷大
          panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
          zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：f
          pName: 'Geolocation',
          events: {
            // eslint-disable-next-line no-unused-vars
            click(e) {
              let { lng, lat } = e.lnglat
              self.lng = lng
              self.lat = lat
            },
            init(o) {
              // o 是高德地图定位插件实例
              o.getCurrentPosition((status, result) => {
                if (result && result.position) {
                  self.address = result.formattedAddress
                  self.lng = result.position.lng
                  self.lat = result.position.lat
                  self.center = [self.lng, self.lat]
                  self.loaded = true
                  self.$nextTick()
                }
              })
            }
          }
        }
      ],
      // 点击地图获取当前位置并显示标记
      events: {
        click(e) {
          let { lng, lat } = e.lnglat
          self.lng = lng
          self.lat = lat
          console.log(lng)
          console.log(lat)
          self.markers = [
            {
              position: [self.lng, self.lat],
              icon: '',
              title: '',
              events: {
                // eslint-disable-next-line no-unused-vars
                click(o) {
                  alert(self.lng)
                  alert(self.lat)
                }
              }
            }
          ]
          // 这里通过高德 SDK 完成。
          // eslint-disable-next-line no-undef
          var geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: 'all'
          })
          geocoder.getAddress([lng, lat], function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
              if (result && result.regeocode) {
                self.address = result.regeocode.formattedAddress //获取到位置
                self.$nextTick()
              }
            }
          })
        }
      }
    }
  },
  components: {},
  created() {
    this.getTowerList()
  },
  mounted() {},
  methods: {
    async getTowerList() {
      let result = (await API.init('/tower/list', null, 'post')).data
      for (let i = 0, len = result.length; i < len; i++) {
        result[i].gmtCreate = this.global.formatDate(result[i].gmtCreate)
      }
      this.towerList = result
      this.towerList1 = result
    },
    //新增楼栋消息
    async addTowerInfo(tag) {
      console.log(String(this.lng))
      let time = new Date().getMilliseconds
      //定义临时变量，用于新增或修改
      let tower = {
        pkTowerId: this.towerInfo.pkTowerId,
        name: this.towerInfo.name,
        longitude: String(this.lng),
        latitude: String(this.lat),
        type: this.towerInfo.type,
        gmtCreate: this.global.formatDate(time)
      }
      this.towerInfo.longitude = String(this.lng)
      this.towerInfo.latitude = String(this.lat)

      if (tag == 1) {
        let result = await API.init('/tower/increase', this.towerInfo, 'post')
        if (result.code == 1) {
          this.$message({
            message: '新增成功',
            type: 'success'
          })
          this.dialogFormVisible = false
          this.towerList.splice(0, 0, tower)
        }
      } else {
        let result = await API.init('/tower/single', this.towerInfo, 'post')
        if (result.code == 1) {
          let towerInfo = this.towerList1.filter((tower) => {
            if (tower.pkTowerId == this.towerInfo.pkTowerId) {
              return tower
            }
          })
          this.dialogFormVisible = false
          this.getTowerList()
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          //修改用户信息
          let index = this.towerList1.indexOf(towerInfo[0])
          this.towerList.splice(index, 1, tower)
        }
      }
    },
    handleEdit(item) {
      ;(this.towerInfo.pkTowerId = item.pkTowerId),
        (this.towerInfo.name = item.name),
        (this.towerInfo.longitude = item.longitude),
        (this.towerInfo.latitude = item.latitude)
      this.towerInfo.type = item.type
      this.dialogFormVisible = true
      this.tag = 2
    },
    //下一页
    nextPage() {
      this.currentPage += 1
      this.start += this.pageSize
      this.end += this.pageSize
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        /* let dto = {
          id: row.pkTowerId
        } */
        //let res = API.init('/tower/id', dto, 'post')

        this.axios({
          method: 'post',
          url: 'http://localhost:8081/tower/id',
          data: {
            id: row.pkTowerId
          }
        }).then((res) => {
          if (res.data.code == 1) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            let index = this.towerList1.indexOf(row)
            this.towerList1.splice(index, 1)
            this.towerList.splice(index, 1)
          }
        })
      })
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
    //根据时间查询
    searchAppInfoByCreate() {
      this.start = 0
      this.end = 8
      this.currentPage = 1
      if (this.blurSearch != '') {
        this.towerList = this.towerList1.filter((v) => {
          if (v.name.indexOf(this.blurSearch) != -1) {
            return v
          }
        })
        this.blurSearch = ''
      } else if (this.time.length >= 1) {
        this.towerList = this.towerList1.filter((tower) => {
          if (this.time[0] <= tower.gmtCreate && tower.gmtCreate <= this.time[1]) {
            return tower
          }
        })
        this.time = null
      }
    },
    /* 打开遮罩层 */
    openDialog() {
      this.dialogFormVisible = true
      this.tag = 1
      this.msg = ' 新增 '
      ;(this.towerInfo.name = ''), (this.towerInfo.longitude = null), (this.towerInfo.latitude = null), (this.towerInfo.type = null)
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

.search-btn {
  height: 30px;
  width: 80px;
}

>>> .el-input__inner {
  height: 30px;
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

>>> .el-select__caret {
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
/* 要是不显示给地图加上宽高 */
.amap-demo {
  width: 300px;
  height: 250px;
}
</style>
