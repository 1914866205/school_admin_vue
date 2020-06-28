<template>
  <div style="width:100%">
    <el-row type="flex" class="ml-20 mt-10">
      <el-input
        size="mini"
        v-model="input"
        prefix-icon="el-icon-search"
        clearable
        placeholder="请输入内容"
        class="blur-search"
        @input="filterSearch()"
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
      ></el-date-picker>
      <el-button type="success" size="mini" class="ml-10" @click="searchAppInfoByCreate" v-if="searchShow">
        <i class="el-icon-search" style="color: rgb(247, 251, 255)"></i>
        <span class="light-font-color">搜索</span>
      </el-button>
    </el-row>
    <el-row class="df-jr-ac ml-20 mt-10">
      <el-col class="tl">
        <el-button type="primary" icon="el-icon-plus" size="small" @click="openDialog">
          <span class="light-font-color">新增</span>
        </el-button>
        <el-button type="danger" icon="el-icon-delete" size="small" @click="delAll()">
          <span class="light-font-color">批量删除</span>
        </el-button>
        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="batchdelVisible" width="300px" center>
          <div class="del-dialog-cnt">批量删除App版本后不可恢复，是否确定删除？</div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="batchdelVisible = false">取 消</el-button>
            <el-button type="primary" @click="deleteBatch()">确 定</el-button>
          </span>
        </el-dialog>
      </el-col>
      <el-col class="tr mr-20">
        <el-button size="mini" style="width: 45px" class="search-btn" @click="searchShow = !searchShow" @mouseover="searchOver()">
          <i class="el-icon-search" style="color: white"></i>
        </el-button>
        <el-button icon="el-icon-refresh" size="small"></el-button>
      </el-col>
    </el-row>
    <!-- 表格展示 -->
    <el-row>
      <el-col span="1"></el-col>
      <el-col span="23" class="ml-20 mt-10">
        <el-table :data="appList.slice(start, end)" style="width: 100%;" class="light-small-font" @selection-change="handleSelectionChange">
          <el-table-column type="selection" min-width="10%"> </el-table-column>
          <el-table-column label="客户端类型" show-overflow-tooltip min-width="13%">
            <template slot-scope="scope">
              <span style="margin-left:-5%">{{ scope.row.appType }}</span>
            </template>
          </el-table-column>
          <el-table-column label="当前版本号" show-overflow-tooltip min-width="12%">
            <template slot-scope="scope">
              <span>{{ scope.row.currentVersion }}</span>
            </template>
          </el-table-column>
          <el-table-column label="最低版本号" show-overflow-tooltip min-width="12%">
            <template slot-scope="scope">
              <span>{{ scope.row.minVersion }}</span>
            </template>
          </el-table-column>
          <el-table-column label="最高版本号" show-overflow-tooltip min-width="12%">
            <template slot-scope="scope">
              <span>{{ scope.row.maxVersion }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="versionDescription" label="版本描述" min-width="15%" show-overflow-tooltip> </el-table-column>
          <el-table-column label="下载地址" show-overflow-tooltip min-width="18%">
            <template slot-scope="scope">
              <span>{{ scope.row.downloadLink }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" show-overflow-tooltip min-width="23%" align="center">
            <template slot-scope="scope">
              <p style="text-align:center">
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
    <el-row class="df-jl-ac mt-10  ml-20">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20]"
        :page-size="currentPageSize"
        layout="total, prev, pager, next, sizes"
        :total="appList.length"
        @prev-click="prevPage()"
        @next-click="nextPage()"
      ></el-pagination>
    </el-row>
    <!-- 新增页面 -->
    <div class="dialog" v-if="dialogFormVisible">
      <el-form class="mt-10 dialog-form dc-jc-ac" :model="appVersionInfo" style="padding: 0px 20px;">
        <p style="width: 100%;" class="dark-large-font tl ml-10">{{ msg }}版本信息</p>
        <p class="df-jb-ac mt-20" style="width: 100%;">
          <el-form-item required label="客户端类型" class="ml-10" :label-width="formLabelWidth" style="width: 50%;">
            <el-input v-model="appVersionInfo.appType" autocomplete="off" placeholder="请输入用户名" style="width: 60%"></el-input>
          </el-form-item>
          <el-form-item required label="当前版本号" class="ml-10" :label-width="formLabelWidth" style="width: 50%;">
            <el-input v-model="appVersionInfo.currentVersion" autocomplete="off" placeholder="请输入手机号" style="width: 60%"></el-input>
          </el-form-item>
        </p>
        <p style="width: 100%" class="df-jb-ac">
          <el-form-item class="ml-10 mr-20" :label-width="formLabelWidth" style="width: 50%;" required label="最高版本">
            <el-input
              v-model="appVersionInfo.maxVersion"
              class="ml-20"
              autocomplete="off"
              placeholder="输入最高版本号"
              style="width: 60%"
            ></el-input>
          </el-form-item>
          <el-form-item class="mr-10" :label-width="formLabelWidth" style="width: 50%;" required label="下载地址">
            <el-input
              v-model="appVersionInfo.downloadLink"
              class="ml-20"
              autocomplete="off"
              placeholder="输入下载地址"
              style="width: 60%"
            ></el-input>
          </el-form-item>
        </p>
        <el-form-item label="版本描述" class="ml-20" style="width:100%">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            style="width: 80%;"
            v-model="appVersionInfo.versionDescription"
            maxlength="60"
            show-word-limit
            class="ml-20"
          >
          </el-input>
        </el-form-item>
        <p class="mt-20 tr" style="width: 90%">
          <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
          <el-button type="primary" @click="addAppVersionInfo(tag)" size="small">确定</el-button>
        </p>
      </el-form>
      <!-- <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addRoomInfo(tag)">确定</el-button>
          </div> -->
    </div>
  </div>
</template>

<script>
const API = require('../utils/api')
export default {
  data() {
    return {
      appList: [],
      appList1: [],
      detailList: [],
      currentPage: 1,
      currentPage1: 0,
      total: 0,
      pageSize: 100,
      searchShow: true, //搜索框显示
      pageSize1: 10,
      updatecenterDialogVisible: false,
      addcenterDialogVisible: false,
      datailcenterDialogVisible: false,
      delVisible: false, //删除提示弹框的状态
      batchdelVisible: false, //批量删除提示弹框的状态
      value1: '',
      input: '',
      start: 0,
      end: 10,
      currentPageSize: 10,
      time: '',
      msg: '',
      textarea: '',
      delarr: [], //存放删除的数据
      multipleSelection: [],
      units: [], //所有单元数据
      dialogFormVisible: false,
      appVersionInfo: {
        appType: '',
        currentVersion: '',
        maxVersion: '',
        versionDescription: '',
        downloadLink: '',
        pkAppVersionId: ''
      }
    }
  },
  created() {
    this.getAppAll()
  },
  watch: {
    pageSize: function() {
      this.getAppAll()
    },
    currentPage: function() {
      this.getAppAll()
    },
    total: function() {}
  },
  methods: {
    // 分页查询所有
    async getAppAll() {
      this.data = { currentPage: this.currentPage1, pageSize: this.pageSize }
      this.url = '/app/all'
      this.result = (await API.init(this.url, this.data, 'post')).data
      for (let i = 0, len = this.result.length; i < len; i++) {
        this.result[i].gmtCreate = this.global.formatDate(this.result[i].gmtCreate)
      }
      this.appList = this.result
      this.appList1 = this.result
      this.appList.concat(this.appList)
      this.appList1.concat(this.appList1)
    },
    //新增管理员消息
    async addAppVersionInfo(tag) {
      //定义临时变量，用于新增或修改
      /* let appVersionInfo = {
        pkAppVersionId: this.appVersionInfo.pkAppVersionId,
        appType: this.appVersionInfo.appType,
        currentVersion: this.appVersionInfo.currentVersion,
        maxVersion: this.appVersionInfo.maxVersion,
        versionDescription: this.appVersionInfo.versionDescription,
        downloadLink: this.appVersionInfo.downloadLink
      } */
      if (tag == 1) {
        let result = await API.init('/app/increase', this.appVersionInfo, 'post')
        if (result.code == 1) {
          this.$message({
            message: '新增成功',
            type: 'success'
          })
          this.dialogFormVisible = false
          /* this.appList.splice(0, 0, appVersionInfo) */
          this.getAppAll()
        }
      } else {
        let result = await API.init('/app/modification', this.appVersionInfo, 'post')
        if (result.code == 1) {
          /* let appVersionInfos = this.appList1.filter((appVersion) => {
            if (appVersion.pkAppVersionId == this.appVersionInfo.pkAppVersionId) {
              return appVersion
            }
          }) */
          this.dialogFormVisible = false
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          //修改用户信息
          /* let index = this.appList.indexOf(appVersionInfos[0])
          this.appList.splice(index, 1, appVersionInfo) */
          this.getAppAll()
        }
      }
    },
    //根据时间查询
    searchAppInfoByCreate() {
      this.appList = this.appList1.filter((appInfo) => {
        console.log(appInfo)
        if (this.time[0] <= appInfo.gmtCreate && appInfo.gmtCreate <= this.time[1]) {
          //console.log(status)
          return appInfo
        }
      })
    },
    /* 修改app信息 */
    handleEdit(row) {
      this.msg = '修改'
      this.appVersionInfo.appType = row.appType
      this.appVersionInfo.currentVersion = row.currentVersion
      this.appVersionInfo.maxVersion = row.maxVersion
      this.appVersionInfo.versionDescription = row.versionDescription
      this.appVersionInfo.downloadLink = row.downloadLink
      this.dialogFormVisible = true
      this.appVersionInfo.pkAppVersionId = row.pkAppVersionId
      this.tag = 2
    },
    //单行删除
    async handleDelete(item) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios({
          method: 'post',
          url: 'http://localhost:8081/app/deletion',
          data: {
            pkId: item.pkAppVersionId
          }
        }).then((res) => {
          if (res.data.code == 1) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            let index = this.appList.indexOf(item)
            this.appList.splice(index, 1)
          }
        })
      })
    },
    //批量删除
    async delAll() {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const length = this.multipleSelection.length
        for (let i = 0; i < length; i++) {
          this.delarr.push(this.multipleSelection[i].pkAppVersionId)
        }

        let data = { ids: JSON.stringify(this.delarr) }
        alert(JSON.stringify(this.delarr))
        this.url = '/app/deletionBath'
        this.axios({
          method: 'post',
          url: 'http://localhost:8081/app/deletion',
          data: {
            ids: data
          }
        }).then((res) => {
          if (res.data.code == 1) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            /*  let index = this.appList.indexOf(item)
            this.appList.splice(index, 1) */
          }
        })
        /* this.result = await API.init(this.url, data, 'post')
      if(this.result.code == 1){
        this.$message.success('批量删除成功')
      } */
      })
    },
    /* 打开遮罩层 */
    openDialog() {
      this.dialogFormVisible = true
      this.tag = 1
      this.msg = ' 新增 '
      this.appVersionInfo.appType = ''
      this.appVersionInfo.currentVersion = ''
      this.appVersionInfo.maxVersion = ''
      this.appVersionInfo.versionDescription = ''
      this.appVersionInfo.downloadLink = ''
    },
    //操作多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    //批量删除
    async batchDeleteAppInfo() {
      let data = { ids: JSON.stringify(this.delarr) }
      alert(JSON.stringify(this.delarr))
      this.url = '/app/deletionBath'
      this.result = await API.init(this.url, data, 'post')
      if (this.result.code == 1) {
        this.$message.success('批量删除成功')
      }
    },
    //编辑
    handleUpdate(index, row) {
      this.idx = index
      this.msg = row //每一条数据的记录
      this.updatecenterDialogVisible = true
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
    //上一页
    prevPage() {
      this.currentPage -= 1
      this.start -= this.pageSize1
      this.end -= this.pageSize1
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
    //过滤搜索
    filterSearch() {
      // 获取输入框的值
      let search = this.input
      //数组元素按条件过滤
      this.appList = this.appList1.filter((v) => {
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
.el-input__inner {
  line-height: 30px;
  height: 30px;
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
.el-range-separator {
  margin-bottom: 10px;
}

/* >>> .el-icon-search {
  color: #f7fbff;
} */

.el-input__prefix {
  display: flex;
  align-items: center;
}
/* 遮罩层 */
.dialog-form {
  border-radius: 5px;
  background-color: white;
  width: 600px;
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

.el-range-separator {
  margin-bottom: 10px;
}
</style>
