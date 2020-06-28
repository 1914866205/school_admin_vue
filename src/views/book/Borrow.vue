<template>
  <div style="width:100%">
    <!-- 增加弹出框 -->
    <el-dialog
      :modal="false"
      title="新增借阅"
      :visible.sync="addcenterDialogVisible"
      width="50%"
      center
    >
      <el-form
        label-width="80px"
        :model="ruleForm1"
      >
        <el-form-item
          required
          label="书名"
          prop="bookName"
        >
          <el-input v-model="ruleForm1.bookName"></el-input>
        </el-form-item>
        <el-form-item
          required
          label="借阅人"
          prop="borrowUserName"
        >
          <el-input v-model="ruleForm1.borrowUserName"></el-input>
        </el-form-item>
        <el-form-item
          required
          label="联系方式"
          prop="borrowUserPhone"
        >
          <el-input v-model="ruleForm1.borrowUserPhone"></el-input>
        </el-form-item>
        <el-form-item
          required
          label="学号"
          prop="borrowUserNumber"
        >
          <el-input
            v-model="ruleForm1.borrowUserNumber"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          required
          label="编号"
          prop="borrowBookId"
        >
          <el-input
            v-model="ruleForm1.borrowBookId"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
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
    <el-row
      type="flex"
      class="ml-20 mt-10"
    >
      <el-input
        v-model="input"
        clearable
        placeholder="请输入内容"
        class="blur-search"
        size="mini"
        @input="filterSearch()"
      ></el-input>
      <el-date-picker
        v-model="value2"
        class="ml-10"
        type="datetimerange"
        range-separator=":"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      >
      </el-date-picker>
      <el-button
        type="success"
        size="mini"
        class="ml-10"
        @click="selectByTime"
      >
        <i
          class="el-icon-search"
          style="color: rgb(247, 251, 255)"
        ></i>
        <span class="light-font-color">搜索</span></el-button>
    </el-row>
    <el-row class="df-jr-ac ml-20 mt-10">
      <el-col class="tl">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="small"
          @click="addcenterDialogVisible = true"
        ><span class="light-font-color">新增</span></el-button>
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="small"
          @click="delAll()"
        >
          <span class="light-font-color">批量删除 </span>
        </el-button>
        <!-- 删除提示框 -->
        <el-dialog
          :modal="false"
          title="提示"
          :visible.sync="batchdelVisible"
          width="300px"
          center
        >
          <div class="del-dialog-cnt">批量删除借阅信息后不可恢复，是否确定删除？</div>
          <span
            slot="footer"
            class="dialog-footer"
          >
            <el-button @click="batchdelVisible = false">取 消</el-button>
            <el-button
              type="primary"
              @click="deleteBatch()"
            >确 定</el-button>
          </span>
        </el-dialog>
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
          :data="bookBorrowList"
          stripe="true"
          class="light-small-font"
          style="width: 100%;"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            min-width="10%"
          > </el-table-column>
          <el-table-column
            label="书名"
            show-overflow-tooltip
            min-width="13%"
          >
            <template slot-scope="scope">
              <span style="margin-left:-5%">{{ scope.row.borrowBookName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="借阅人"
            show-overflow-tooltip
            min-width="13%"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.borrowUserName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="学号/工号"
            show-overflow-tooltip
            min-width="13%"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.borrowUserNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="联系方式"
            show-overflow-tooltip
            min-width="13%"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.borrowUserPhone }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="是否归还"
            show-overflow-tooltip
            min-width="13%"
            :filters="[
              { text: '已归还', value: true },
              { text: '未归还', value: false }
            ]"
            :filter-method="filterTag"
            filter-placement="bottom-end"
          >
            <template slot-scope="scope">
              <el-tag
                type="success"
                v-if="scope.row.isReturned"
              >已归还</el-tag>
              <el-tag
                type="info"
                v-else
              >未归还</el-tag>
            </template>
          </el-table-column>

          <el-table-column
            label="借阅时间"
            show-overflow-tooltip
            min-width="18%"
          >
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span>{{ scope.row.gmtCreate }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="归还时间"
            show-overflow-tooltip
            min-width="18%"
            :formatter="timeChange"
          > </el-table-column>
          <el-table-column
            label="操作"
            show-overflow-tooltip
            min-width="23%"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                :disabled="scope.row.isReturned == 1"
                size="mini"
                type="success"
                @click="handleUpdate(scope.$index, scope.row)"
              >
                <span class="light-font-color">归还处理</span></el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
              ><span class="light-font-color">删除</span></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!-- 删除提示框 -->
    <el-dialog
      :modal="false"
      title="提示"
      :visible.sync="delVisible"
      width="300px"
      center
    >
      <div class="del-dialog-cnt">借阅信息删除不可恢复，是否确定删除？</div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="deleteRow"
        >确 定</el-button>
      </span>
    </el-dialog>
    <div
      class="block"
      style="margin-top:2%"
    >
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[8, 16, 24, 32, 40]"
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
      bookBorrowList: [],
      bookBorrowList1: [],
      bookBorrowList3: [],
      currentPage: 0,
      total: 40,
      pageSize: 8,
      updatecenterDialogVisible: false,
      addcenterDialogVisible: false,
      datailcenterDialogVisible: false,
      delVisible: false, //删除提示弹框的状态
      batchdelVisible: false,
      delarr: [], //存放删除的数据
      multipleSelection: [],
      value1: '',
      input: '',
      msg: '', //记录每一条的信息，便于取id
      ruleForm1: {
        borrowUserName: '',
        borrowUserNumber: '',
        borrowUserPhone: '',
        borrowBookName: '',
        borrowBookId: ''
      },
      file: '',
      value2: [],
      startTime: '',
      endTime: ''
    }
  },
  created() {
    this.getbookBorrowAll()
  },
  watch: {
    pageSize: function() {
      this.getbookBorrowAll()
    },
    currentPage: function() {
      this.getbookBorrowAll()
    },
    total: function() {}
  },
  methods: {
    filterTag(value, row) {
      return row.isReturned === value
      // eslint-disable-next-line no-unreachable
      this.getbookBorrowAll()
    },
    // eslint-disable-next-line no-unused-vars
    timeChange: function(row, column) {
      if (row.isReturned == 1) {
        return row.gmtReturn
      }
      return '未归还'
    },
    // 分页查询所有
    async getbookBorrowAll() {
      this.data = { currentPage: this.currentPage, pageSize: this.pageSize }
      this.url = '/borrow/all'
      this.result = await API.init(this.url, this.data, 'post')
      this.bookBorrowList = this.result.data
      console.log(this.result.data)
      this.bookBorrowList1 = this.result.data
      for (let i = 0; i < this.bookBorrowList.length; i++) {
        this.bookBorrowList[i].gmtCreate = this.formatDate(this.bookBorrowList[i].gmtCreate)
        this.bookBorrowList[i].gmtReturn = this.formatDate(this.bookBorrowList[i].gmtReturn)
      }
    },
    //根据时间查询借阅图书
    async selectByTime() {
      if (this.value2 == '') {
        this.$message({
          message: '警告，请选择时间',
          type: 'warning'
        })
        return
      } else {
        // --时间处理
        this.startTime = this.dateFormat(this.value2[0])
        this.endTime = this.dateFormat(this.value2[1])
        this.data = { currentPage: this.currentPage, pageSize: this.pageSize, startTime: this.startTime, endTime: this.endTime }
        this.url = '/borrow/time'
        this.result = await API.init(this.url, this.data, 'post')
        this.bookBorrowList = this.result.data
        for (let i = 0; i < this.bookBorrowList.length; i++) {
          this.bookBorrowList[i].gmtCreate = this.formatDate(this.bookBorrowList[i].gmtCreate)
          this.bookBorrowList[i].gmtReturn = this.formatDate(this.bookBorrowList[i].gmtReturn)
        }
      }
    },
    // 当前页展示数据
    handleSizeChange: function(pageSize) {
      this.pageSize = pageSize
    },
    // 当前页
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage
    },
    //单行删除
    handleDelete(index, row) {
      this.idx = index
      this.msg = row //每一条数据的记录
      this.delVisible = true
    },
    async deleteRow() {
      this.data = { pkId: this.msg.pkBorrowId }
      this.url = '/borrow/deletion'
      this.result = await API.init(this.url, this.data, 'post')
      this.getbookBorrowAll()
      this.$message.success('删除成功')
      this.delVisible = false //关闭删除提示模态框
    },
    //批量删除
    delAll() {
      this.batchdelVisible = true //显示删除弹框
      const length = this.multipleSelection.length
      for (let i = 0; i < length; i++) {
        this.delarr.push(this.multipleSelection[i].pkBorrowId)
      }
    },
    //操作多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    //批量删除
    async deleteBatch() {
      this.data = { ids: String(this.delarr) }
      this.url = '/borrow/deletionBath'
      this.result = await API.init(this.url, this.data, 'post')
      this.getbookBorrowAll()
      this.$message.success('批量删除成功')
      this.batchdelVisible = false //关闭删除提示模态框
    },
    async handleUpdate(index, row) {
      this.data = { pkId: this.msg.pkBorrowId }
      this.idx = index
      this.msg = row
      this.data = {
        pkId: this.msg.pkBorrowId
      }
      this.url = '/borrow/modification/return'
      this.result = await API.init(this.url, this.data, 'post')
      this.$message.success('归还成功')
      this.getbookBorrowAll()
    },
    //新增借阅
    async confirmAdd() {
      this.data = {
        borrowUserName: this.ruleForm1.borrowUserName,
        borrowUserNumber: this.ruleForm1.borrowUserNumber,
        borrowUserPhone: this.ruleForm1.borrowUserPhone,
        borrowBookName: this.ruleForm1.borrowBookName,
        borrowBookId: this.ruleForm1.borrowBookId
      }
      this.url = '/borrow/increase'
      this.result = await API.init(this.url, this.data, 'post')
      this.addcenterDialogVisible = false
      this.getbookBorrowAll()
      this.$message.success('借阅添加成功')
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
      return y + '年' + MM + '月' + d + '日' + h + ':' + m + ':' + s
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
      this.bookBorrowList = this.bookBorrowList1.filter((v) => {
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
</style>
