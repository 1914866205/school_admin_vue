/* eslint-disable prettier/prettier */
<template>
  <div style="width:100%">
    <!-- 修改弹出框 -->

    <el-dialog :modal="false" title="编辑一卡通" :visible.sync="updatecenterDialogVisible" width="30%" left>
      <el-form :model="ruleForm" status-icon label-width="80px">
        <el-form-item label="余额" prop="balance">
          <el-input max="5" oninput="value=value.replace(/[^\d]/g,'')" v-model.number="ruleForm.balance"></el-input>
        </el-form-item>
        <el-form-item label="缴费描述" prop="description">
          <el-input v-model.number="ruleForm.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updatecenterDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmUpdate">确 定</el-button>
      </span>
    </el-dialog>

    <el-row type="flex" class="ml-20 mt-10">
      <el-input size="mini" v-model="input" type="text" @input="filterSearch()" placeholder="请输入内容" class="blur-search"></el-input>
      <el-button type="success" size="mini" class="ml-10" @click="filterSearch()">
        <i class="el-icon-search" style="color: rgb(247, 251, 255)"></i>
        <span class="light-font-color">搜索</span>
      </el-button>
    </el-row>
    <el-row class="df-jr-ac ml-20 mt-10">
      <el-col class="tl">
        <el-button type="success" icon="el-icon-edit" size="small" @click="delAll()"><span class="light-font-color">批量删除</span></el-button>
        <el-button type="warning" icon="el-icon-download" size="small"><span class="light-font-color">导出</span></el-button>
      </el-col>
      <el-col class="tr mr-20">
        <el-button icon="el-icon-refresh" size="small"></el-button>
      </el-col>
    </el-row>
    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="batchdelVisible" width="300px" center :modal="false">
      <div class="del-dialog-cnt">批量删除订单信息后不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="batchdelVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteBatch()">确 定</el-button>
      </span>
    </el-dialog>

    <el-row>
      <el-col span="1"></el-col>
      <el-col span="23" class="ml-20 mt-10">
        <el-table :data="tableData.slice(start, end)" class="light-small-font" border style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" min-width="5%"></el-table-column>
          <el-table-column prop="gmtCreate" fixed label="日期" min-width="17%"> </el-table-column>
          <el-table-column prop="orderNumber" label="订单号" min-width="10%"> </el-table-column>
          <el-table-column prop="orderType" label="类型" min-width="15%">
            <template slot-scope="{ row, $index }">
              <input class="edit-cell" v-if="showEdit[$index]" v-model="row.orderType" />
              <span v-if="!showEdit[$index]">{{ row.orderType }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="orderMoney" label="金额" min-width="10%"> </el-table-column>
          <el-table-column prop="jobNumber" label="卡号" min-width="10%"> </el-table-column>
          <el-table-column prop="description" label="缴费描述" min-width="10%"> </el-table-column>
          <el-table-column prop="payMethod" label="支付方式" min-width="13%"> </el-table-column>
          <el-table-column prop="status" label="状态" min-width="7%" :formatter="statusChange"> </el-table-column>
          <el-table-column fixed="right" align="center" label="操作" min-width="15%">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="handleUpdate(scope.$index, scope.row)">
                <span class="light-font-color">编辑</span>
              </el-button>
              <el-button slot="reference" type="primary" size="mini" @click="handleDelete(scope.$index, scope.row)">
                <span class="light-font-color">删除</span>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <div class="block" style="margin-top:2%">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPageA"
        :page-sizes="[6, 12, 18]"
        :page-size="pageSize"
        layout="total, prev, pager, next, sizes,jumper"
        :total="tableData.length"
        @prev-click="prevPage()"
        @next-click="nextPage()"
      >
      </el-pagination>
    </div>
    <!-- 删除提示框 -->
    <el-dialog :modal="false" title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">订单信息删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRow">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
const API = require('../utils/api')
export default {
  name: 'Order',
  data() {
    return {
      tableData: [],
      tableData1: [],
      start: 0,
      end: 6,
      pageSize: 6,
      currentPageSize: 100,
      currentPage: 1,
      currentPageSizeA: 6,
      currentPageA: 1,
      visible: false,
      delVisible: false,
      updatecenterDialogVisible: false,
      ruleForm: {
        balance: '',
        description: ''
      },
      showEdit: [], //显示编辑框
      showBtn: [],
      showBtnOrdinary: true,
      batchdelVisible: false,
      input: '',
      delarr: [] //存放删除的数据
    }
  },
  components: {},
  created() {
    this.getOrderAll()
  },
  mounted() {},
  methods: {
    //下一页
    nextPage() {
      this.currentPageA += 1
      this.start += this.pageSize
      this.end += this.pageSize
    },
    //上一页
    prevPage() {
      this.currentPageA -= 1
      this.start -= this.pageSize
      this.end -= this.pageSize
    },
    //改变页的数据条数
    handleSizeChange(val) {
      this.start = (this.currentPageA - 1) * val
      this.end = this.currentPageA * val
      this.pageSize = val
    },
    //选择分页
    handleCurrentChange(val) {
      this.currentPageA = val
      this.start = (this.currentPageA - 1) * this.pageSize
      this.end = this.currentPageA * this.pageSize
    },
    // eslint-disable-next-line no-unused-vars
    handleEdit(index, row) {
      this.$set(this.showEdit, index, true)
      this.$set(this.showBtn, index, true)
    },
    //取消编辑
    // eslint-disable-next-line no-unused-vars
    handelCancel(index, row) {
      this.$set(this.showEdit, index, false)
      this.$set(this.showBtn, index, false)
    },
    //单行删除
    handleDelete(index, row) {
      this.idx = index
      this.msg = row //每一条数据的记录
      this.delVisible = true
    },
    // 确定删除
    async deleteRow() {
      this.data = { fleaRewardId: this.msg.pkOrderId }
      this.url = '/order/id'
      this.result = await API.init(this.url, this.data, 'post')
      this.getOrderAll()
      this.$message.success('信息删除成功')
      this.delVisible = false //关闭删除提示模态框
    },
    //批量删除
    delAll() {
      this.batchdelVisible = true //显示删除弹框
      const length = this.multipleSelection.length
      for (let i = 0; i < length; i++) {
        this.delarr.push(this.multipleSelection[i].pkOrderId)
      }
    },
    //操作多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    //批量删除
    async deleteBatch() {
      console.log(this.delarr)
      this.data = { ids: String(this.delarr) }
      this.url = '/order/deletionBath'
      this.result = await API.init(this.url, this.data, 'post')
      this.$message.success('批量删除成功')
      this.batchdelVisible = false //关闭删除提示模态框
      this.getOrderAll()
    },
    // eslint-disable-next-line no-unused-vars
    statusChange: function(row, column) {
      return row.status == 1 ? '已支付' : row.status == 0 ? '未支付' : ''
    },
    // 分页查询所有
    async getOrderAll() {
      this.data = { currentPage: this.currentPage, pageSize: this.currentPageSize }
      this.url = '/order/all'
      this.result = await API.init(this.url, this.data, 'post')
      this.tableData = this.result.data
      this.tableData1 = this.result.data
      for (let i = 0; i < this.tableData.length; i++) {
        this.tableData[i].gmtCreate = this.formatDate(this.tableData[i].gmtCreate)
      }
    },
    //编辑
    handleUpdate(index, row) {
      this.idx = index
      this.msg = row //每一条数据的记录
      this.updatecenterDialogVisible = true
    },
    //修改订单信息
    async confirmUpdate() {
      this.data = {
        pkOrderId: this.msg.pkOrderId,
        description: this.ruleForm.description,
        orderMoney: this.ruleForm.balance
      }
      this.url = '/order/modification'
      this.result = await API.init(this.url, this.data, 'post')
      this.updatecenterDialogVisible = false
      this.getOrderAll()
      this.$message.success('信息修改成功')
    },
    //过滤搜索
    filterSearch() {
      // 获取输入框的值
      let search = this.input
      //数组元素按条件过滤
      this.tableData = this.tableData1.filter((v) => {
        if (JSON.stringify(v).includes(search)) {
          return v
        }
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
      return y + '年' + MM + '月' + d + '日 ' + h + ':' + m + ':' + s
    }
  },
  computed: {}
}
</script>

<style scoped>
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

>>> .el-input__icon {
  color: #eee;
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
</style>
