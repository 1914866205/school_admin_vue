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
        type="datetimerange"
        range-separator=":"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        class="date-input-search ml-10"
        value-format="yyyy-MM-dd HH:mm:ss"
        v-if="searchShow"
      ></el-date-picker>
      <el-button type="success" size="mini" class="ml-10" @click="searchAppInfoByCreate" v-if="searchShow">
        <i class="el-icon-search" style="color: rgb(247, 251, 255)"></i>
        <span class="light-font-color">搜索</span>
      </el-button>
    </el-row>
    <el-row class="df-jr-ac ml-20 mt-10">
      <el-col class="tl">
        <el-button type="primary" icon="el-icon-plus" size="small" disabled @click="addcenterDialogVisible = true">
          <span class="light-font-color">新增</span>
        </el-button>
        <el-button type="danger" icon="el-icon-delete" size="small" disabled @click="handleDeleteMul">
          <span class="light-font-color">批量删除</span>
        </el-button>
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
      <el-col span="23" class="ml-20 mt-20">
        <el-table :data="feedbackList.slice(start, end)" border stripe="true" style="width: 100%;">
          <el-table-column type="selection" min-width="5%" @selection-change="handleSelectionChange"> </el-table-column>
          <el-table-column label="反馈标题" show-overflow-tooltip min-width="15%">
            <template slot-scope="scope">
              <span>{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column label="反馈内容" show-overflow-tooltip min-width="25%">
            <template slot-scope="scope">
              <span>{{ scope.row.content }}</span>
            </template>
          </el-table-column>
          <el-table-column label="联系方式" show-overflow-tooltip min-width="15%">
            <template slot-scope="scope">
              <span>{{ scope.row.contactWay }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" show-overflow-tooltip min-width="10%">
            <template slot-scope="scope">
              <span v-if="scope.row.isHandled == false">{{ notHandle }}</span>
              <span v-else>{{ handled }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="gmtCreate" label="创建时间" show-overflow-tooltip min-width="15%"> </el-table-column>
          <el-table-column label="操作" min-width="15%" align="center">
            <template slot-scope="scope">
              <p style="text-align:center">
                <el-button
                  size="mini"
                  icon="el-icon-edit"
                  type="primary"
                  :disabled="scope.row.isHandled == true"
                  @click="handleUpdate(scope.row)"
                >
                  <span class="light-font-color">处理</span>
                </el-button>
              </p>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!-- 分页 -->
    <el-row class="df-jl-ac mt-10  ml-20">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10]"
        :page-size="currentPageSize"
        layout="total, prev, pager, next, sizes"
        :total="feedbackList.length"
        @prev-click="prevPage()"
        @next-click="nextPage()"
      ></el-pagination>
    </el-row>
  </div>
</template>

<script>
const API = require('../utils/api')
export default {
  data() {
    return {
      time: [],
      feedbackList: [],
      feedbackList1: [],
      detailList: [],
      currentPage: 1,
      currentPage1: 0,
      searchShow: true,
      notHandle: '未处理',
      handled: '已处理',
      total: 0,
      pageSize: 10,
      pageSize1: 100,
      currentPageSize: 10,
      updatecenterDialogVisible: false,
      addcenterDialogVisible: false,
      datailcenterDialogVisible: false,
      delVisible: false, //删除提示弹框的状态
      input: '',
      start: 0,
      end: 10,
      gmtTime: '',
      msg: '', //记录每一条的信息，便于取id
      feedBackInfo: {
        pkFeedbackId: -1,
        title: '',
        content: '',
        contactWay: '',
        isHandled: true,
        picInfo: ''
      }
    }
  },
  created() {
    this.getFeedbackAll()
  },
  watch: {
    pageSize: function() {
      this.getFeedbackAll()
    },
    currentPage: function() {
      this.getFeedbackAll()
    },
    total: function() {}
  },
  methods: {
    // 分页查询所有
    async getFeedbackAll() {
      this.data = { currentPage: this.currentPage1, pageSize: this.pageSize1 }
      this.url = '/feedback/all'
      this.result = await API.init(this.url, this.data, 'post')
      this.feedbackList = this.result.data
      this.feedbackList1 = this.result.data
      console.log(this.feedbackList[0])
      for (let i = 0; i < this.feedbackList.length; i++) {
        this.feedbackList[i].gmtCreate = this.global.formatDate(this.feedbackList[i].gmtCreate)
      }
    },
    //下一页
    nextPage() {
      this.currentPage += 1
      this.start += this.pageSize
      this.end += this.pageSize
    },
    //选取单选框
    handleSelectionChange() {},
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
    //编辑
    async handleUpdate(row) {
      let feedbackInfo = {
        pkFeedbackId: row.pkFeedbackId,
        isHandled: !row.isHandled
      }
      let result = await API.init('/feedback/modification', feedbackInfo, 'post')
      if (result.code == 1) {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        row.isHandled = !row.isHandled
      }
    },
    //根据时间查询
    async searchAppInfoByCreate() {
      let quertDto = {
        time: JSON.stringify(this.time),
        currentPage: this.currentPage1 + 1,
        pageSize: 10
      }
      let result = (await API.init('/feedback/page', quertDto, 'post')).data
      this.feedbackList = result
      this.time = null
    },
    //过滤搜索
    filterSearch() {
      // 获取输入框的值
      let search = this.input
      //数组元素按条件过滤
      this.feedbackList = this.feedbackList1.filter((v) => {
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

.el-input__inner {
  height: 30px;
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
/* >>> .el-input__suffix-inner {
  display: flex;
} */

>>> .el-input__prefix {
  display: block;
  align-items: center;
}

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

>>> .el-form-item__label {
  color: #606266;
  font-weight: 600;
}
.top-input {
  width: 200px;
  height: 30px;
  margin-left: 50px;
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
.el-input__inner {
  height: 30px;
}
</style>
