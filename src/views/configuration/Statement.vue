<template>
  <div style="width: 100%">
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
      >
      </el-date-picker>
      <el-button type="success" size="mini" class="ml-10" v-if="searchShow" @click="searchAppInfoByCreate">
        <i class="el-icon-search" style="color: rgb(247, 251, 255)"></i>
        <span class="light-font-color">搜索</span>
      </el-button>
    </el-row>
    <el-row class="df-jr-ac ml-20 mt-10">
      <el-col class="tl">
        <el-button type="primary" icon="el-icon-plus" @click="openDialog" size="mini">
          <span class="light-font-color">新增</span>
        </el-button>
        <el-button type="success" icon="el-icon-edit" size="mini" @click="handleEdit(selections[0])" :disabled="selections.length != 1">
          <span class="light-font-color">修改</span>
        </el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="batchDelete" :disabled="selections.length < 1">
          <span class="light-font-color">删除</span>
        </el-button>
        <el-button type="warning" icon="el-icon-download" disabled size="mini">
          <span class="light-font-color">导出</span>
        </el-button>
      </el-col>
      <el-col class="tr mr-20">
        <el-button size="mini" style="width: 45px" class="search-btn" @click="searchShow = !searchShow" @mouseover="searchOver()">
          <i class="el-icon-search" style="color: white"></i>
        </el-button>
        <el-button icon="el-icon-refresh" size="small"></el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-row>
      <el-col :span="one"></el-col>
      <el-col :span="tt" class="ml-20 mt-10">
        <el-table
          ref="multipleTable"
          :data="statementList.slice(start, end)"
          tooltip-effect="dark"
          class="light-small-font"
          style="width: 100%;"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" min-width="5%"> </el-table-column>
          <el-table-column label="声明标题" min-width="10%">
            <template slot-scope="scope">{{ scope.row.statementTitle }}</template>
          </el-table-column>
          <el-table-column prop="statementContent" label="声明内容" min-width="25%"></el-table-column>
          <el-table-column prop="statementType" label="声明分类" show-overflow-tooltip min-width="20%"> </el-table-column>
          <el-table-column prop="gmtCreate" label="创建时间" show-overflow-tooltip min-width="20%"> </el-table-column>
          <el-table-column label="操作" align="center" show-overflow-tooltip min-width="20%">
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
    <!-- 新增页面 -->
    <div class="dialog" v-if="dialogFormVisible">
      <el-form class="mt-10 dialog-form dc-jc-ac" :model="statementInfo" style="padding: 0px 20px;">
        <p style="width: 90%;" class="dark-large-font tl">{{ msg }}声明</p>
        <el-form-item required label="声明标题" class="mt-20" :label-width="formLabelWidth" style="width: 90%;">
          <el-input v-model="statementInfo.statementTitle" autocomplete="off" placeholder="请输入标题" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item required label="声明内容" :label-width="formLabelWidth" style="width: 90%;">
          <el-input v-model="statementInfo.statementContent" autocomplete="off" placeholder="请输入内容" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item required label="声明分类" :label-width="formLabelWidth" style="width: 90%;">
          <el-select v-model="statementInfo.statementType" class="ml-10" placeholder="分类" style="width: 20%; float: left">
            <el-option v-for="(item, index) in statementTypes" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <p class="mt-20 tr" style="width: 90%">
          <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
          <el-button type="primary" @click="addStatementInfo(tag)" size="small">确定</el-button>
        </p>
      </el-form>
      <!-- <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addRoomInfo(tag)">确定</el-button>
          </div> -->
    </div>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[8, 16]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="statementList.length"
        @prev-click="prevPage()"
        @next-click="nextPage()"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
const API = require('../utils/api')

export default {
  name: 'Permmission',
  data() {
    return {
      one: 1,
      tt: 23,
      statementList: [],
      statementList1: [],
      dialogFormVisible: false, //新增框
      time: '',
      currentPage: 1,
      currentPage1: 0,
      total: 0,
      pageSize: 8,
      pageSize1: 100,
      searchShow: true,
      start: 0,
      end: 8,
      value: true,
      selections: [],
      statementTypes: ['通知', '公告'],
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
      input: '',
      statementInfo: {
        pkStatementId: -1,
        statementType: '',
        statementTitle: '',
        statementContent: '',
        gmtCreate: ''
      }
    }
  },
  components: {},
  created() {
    this.getStatementAll()
  },
  watch: {
   
  },
  mounted() {},
  methods: {
    // 分页查询所有
    async getStatementAll() {
      this.data = { currentPage: this.currentPage1, pageSize: this.pageSize1 }
      this.url = '/statement/all'
      this.result = await API.init(this.url, this.data, 'post')
      for (let i = 0; i < this.result.data.length; i++) {
        this.result.data[i].gmtCreate = this.global.formatDate(this.result.data[i].gmtCreate)
      }
      this.statementList = this.result.data
      this.statementList1 = this.result.data
    },
    //单行删除
    handleDelete(item) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios({
          method: 'post',
          url: 'http://localhost:8081/statement/deletion',
          data: {
            pkId: item.pkStatementId
          }
        }).then((res) => {
          if (res.data.code == 1) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            let index = this.statementList.indexOf(item)
            this.statementList.splice(index, 1)
          }
        })
      })
    },
    //获取选中的数据
    handleSelectionChange(val) {
      this.selections = val
    },
    //批量删除
    batchDelete() {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = []
        for (let i = 0, len = this.selections.length; i < len; i++) {
          ids.push(this.selections[i].pkStatementId)
        }
        this.axios({
          method: 'post',
          url: 'http://localhost:8081/statement/deletionBath',
          data: {
            ids: JSON.stringify(ids)
          }
        }).then((res) => {
          if (res.data.code == 1) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            for (let i = 0, len = this.selections.length; i < len; i++) {
              let index = this.statementList.indexOf(this.selections[i])
              this.statementList.splice(index, 1)
            }
            /* let index = this.statementList.indexOf()
            this.statementList.splice(index, 1) */
          }
        })
      })
    },
    /* 打开遮罩层 */
    openDialog() {
      this.dialogFormVisible = true
      this.tag = 1
      this.msg = ' 新增 '
      this.statementInfo.statementType.name = ''
      this.statementInfo.statementTitle = ''
      this.statementInfo.statementContent = ''
    },
    async addStatementInfo(tag) {
      let time = (new Date()).valueOf()
      this.statementInfo.gmtCreate = this.global.formatDate(time)
      if (tag == 1) {
        let result = await API.init('/statement/increase', this.statementInfo, 'post')
        if (result.code == 1) {
          this.$message({
            message: '新增成功',
            type: 'success'
          })
          this.dialogFormVisible = false
          this.statementList.splice(0, 0, this.statementInfo)
        }
      } else {
        let result = await API.init('/statement/modification', this.statementInfo, 'post')
        if (result.code == 1) {
          let statementInfo = this.statementList1.filter((statement) => {
            if (statement.pkStatementId == this.statementInfo.pkStatementId) {
              return statement
            }
          })
          this.dialogFormVisible = false
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          //修改用户信息
          let index = this.statementList.indexOf(statementInfo[0])
          this.statementList.splice(index, 1, this.statementInfo)
        }
      }
    },
    //单个删除
    async deleteRow() {
      this.data = { field: this.msg.pkStatementId }
      this.url = '/statement/deletion'
      this.result = await API.init(this.url, this.data, 'post')
      if (this.data) {
        this.getStatementAll()
        this.$message.success('删除成功')
      } else {
        this.$message.error('声明信息删除失败')
      }
      this.delVisible = false //关闭删除提示模态框
    },
    /* 修改app信息 */
    handleEdit(row) {
      this.msg = '修改'
      this.statementInfo.pkStatementId = row.pkStatementId
      this.statementInfo.statementType = row.statementType
      this.statementInfo.statementTitle = row.statementTitle
      this.statementInfo.statementContent = row.statementContent
      this.dialogFormVisible = true
      this.tag = 2
    },
    //根据时间查询
    searchAppInfoByCreate() {
      this.statementList = this.statementList1.filter((statement) => {
        console.log(statement)
        if (this.time[0] <= statement.gmtCreate && statement.gmtCreate <= this.time[1]) {
          //console.log(status)
          return statement
        }
      })
    },
    //下一页
    nextPage() {
      this.currentPage += 1
      this.start += 8
      this.end += 8
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
      this.start = (this.currentPage - 1) * this.pageSize
      this.end = this.currentPage * this.pageSize
    },
    //过滤搜索
    filterSearch() {
      // 获取输入框的值
      let search = this.input
      //数组元素按条件过滤
      this.statementList = this.statementList1.filter((v) => {
        if (JSON.stringify(v).includes(search)) {
          return v
        }
      })
    }
  },
  computed: {}
}
</script>

<style scoped>
.date-input-search {
  width: 260px;
}

.statu-search {
  width: 100px;
}

.search-btn {
  height: 30px;
  width: 80px;
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

/* >>> .el-icon-search {
  color: #f7fbff;
} */

>>> .el-input__prefix {
  display: block;
  align-items: center;
}

>>> .el-select__caret {
  margin-top: 5px;
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
</style>
