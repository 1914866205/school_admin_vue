<template>
  <div style="width:100%">
    <!-- 修改弹出框 -->
    <el-dialog
      title="编辑一卡通"
      :modal="false"
      :visible.sync="updatecenterDialogVisible"
      width="30%"
      left
    >
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        label-width="80px"
      >
        <el-form-item
          required
          label="密码"
          prop="pass"
        >
          <el-input
            type="password"
            v-model="ruleForm.pass"
            autocomplete="off"
            placeholder="请输入要修改的密码"
          ></el-input>
        </el-form-item>
        <el-form-item
          required
          label="确认密码"
          prop="checkPass"
        >
          <el-input
            type="password"
            v-model="ruleForm.checkPass"
            autocomplete="off"
            placeholder="请再次输入要修改的密码"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="绑定号码"
          prop="job_number"
        >
          <el-input
            oninput="value=value.replace(/[^\d]/g,'')"
            v-model.number="ruleForm.jobnumber"
            placeholder="请输入要修改的账号"
            maxlength="13"
          ></el-input>
        </el-form-item>
        <el-form-item
          required
          label="余额"
          prop="balance"
        >
          <el-input
            oninput="value=value.replace(/[^\d]/g,'')"
            v-model.number="ruleForm.balance"
            placeholder="请输入要修改的余额"
            max="5"
          ></el-input>
        </el-form-item>
      </el-form>
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

    <!-- 增加弹出框 -->
    <el-dialog
      title="新增一卡通"
      :visible.sync="addcenterDialogVisible"
      width="30%"
      :modal="false"
      center
    >
      <el-form
        label-width="80px"
        :model="ruleForm1"
      >
        <el-form-item
          required
          label="卡号"
          prop="cardNumber"
        >
          <el-input
            maxlength="13"
            oninput="value=value.replace(/[^\d]/g,'')"
            v-model="ruleForm1.cardNumber"
          ></el-input>
        </el-form-item>
        <el-form-item
          required
          label="绑定卡号"
          prop="jobNumber"
        >
          <el-input
            oninput="value=value.replace(/[^\d]/g,'')"
            maxlength="13"
            v-model="ruleForm1.jobNumber"
          ></el-input>
        </el-form-item>
        <el-form-item
          required
          label="卡号密码"
          prop="cardPassword"
        >
          <el-input
            type="password"
            v-model="ruleForm1.cardPassword"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          required
          label="余额"
          prop="cardbalance1"
        >
          <el-input
            oninput="value=value.replace(/[^\d]/g,'')"
            v-model="ruleForm1.cardbalance1"
            maxlength="5"
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

    <!-- 流水明细 -->
    <el-dialog
      title="流水查询"
      :visible.sync="datailcenterDialogVisible"
      width="30%"
      left
      :modal="false"
    >
      <el-form
        status-icon
        label-width="80px"
        style="height:400px;overflow:auto"
      >
        <el-collapse accordion>
          <div
            v-for="(item, index) in detailList"
            :key="index"
          >
            <el-collapse-item>
              <template slot="title">
                {{ item.gmtCreate }}<i
                  class="el-icon-s-shop"
                  style="margin-left:15%"
                ></i>{{ item.description }} -{{ item.orderMoney }}
              </template>
              <div><i class="el-icon-s-shop"></i>{{ item.description }}</div>
              <div>
                <h4>-{{ item.orderMoney }}</h4>
              </div>
              <div>交易成功</div>
              <div>
                <span style="margin-left:-10%">付款方式</span> <span style="margin-left:25%">{{ item.payMethod }}</span>
              </div>
              <div>
                <span style="margin-left:-10%">交易流水号</span><span style="margin-left:25%">{{ item.orderNumber }}</span>
              </div>
              <div>
                <span style="margin-left:-5%"> 创建时间</span><span style="margin-left:18%">{{ item.gmtCreate }}</span>
              </div>
            </el-collapse-item>
          </div>
        </el-collapse>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="datailcenterDialogVisible = false">取 消</el-button>
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
      <el-select
        size="mini"
        v-model="selectValue"
        placeholder="请选择"
        class="statu-search ml-10"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        > </el-option>
      </el-select>
      <el-button
        type="success"
        size="mini"
        class="ml-10"
      >
        <i
          class="el-icon-search"
          style="color: rgb(247, 251, 255)"
        ></i>
        <span class="light-font-color">搜索</span>
      </el-button>
    </el-row>
    <el-row class="df-jr-ac ml-20 mt-10">
      <el-col class="tl">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="small"
          @click="addcenterDialogVisible = true"
        >
          <span class="light-font-color">新增</span></el-button>
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="small"
          @click="delAll()"
        >
          <span class="light-font-color">批量删除</span></el-button>
        <!-- 删除提示框 -->
        <el-dialog
          title="提示"
          :visible.sync="batchdelVisible"
          width="300px"
          center
        >
          <div class="del-dialog-cnt">批量删除一卡通信息后不可恢复，是否确定删除？</div>
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
          :data="cardList"
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
            label="卡号"
            show-overflow-tooltip
            min-width="13%"
          >
            <template slot-scope="scope">
              <span style="margin-left:-5%">{{ scope.row.cardNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="卡密"
            show-overflow-tooltip
            min-width="13%"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.cardPassword }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="绑定账号"
            show-overflow-tooltip
            min-width="15%"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.jobNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="余额"
            show-overflow-tooltip
            min-width="13%"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.cardBalance }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="状态"
            show-overflow-tooltip
            min-width="15%"
          >
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-color="#13ce66"
                :disabled="scope.row.status == 1"
                inactive-color="#ff4949"
                @change="changeSwitchA($event, scope.row, scope.$index)"
              >
                >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            label="创建时间"
            show-overflow-tooltip
            min-width="18%"
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
              >
                <span class="light-font-color">编辑</span></el-button>
              <el-button
                size="mini"
                type="primary"
                @click="handleDetail(scope.$index, scope.row)"
              ><span class="light-font-color">流水账单</span></el-button>
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
      title="提示"
      :visible.sync="delVisible"
      width="300px"
      center
      :modal="false"
    >
      <div class="del-dialog-cnt">一卡通信息删除不可恢复，是否确定删除？</div>
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
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      cardList: [],
      cardList1: [],
      detailList: [],
      currentPage: 0,
      total: 46,
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
      gmtTime: '',
      msg: '', //记录每一条的信息，便于取id
      ruleForm: {
        pass: '',
        checkPass: '',
        balance: '',
        jobnumber: ''
      },
      ruleForm1: {
        jobNumber: '',
        cardNumber: '',
        cardPassword: '',
        cardbalance1: ''
      },
      rules: {
        pass: [{ validator: validatePass, trigger: 'blur' }],
        checkPass: [{ validator: validatePass2, trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getCardAll()
  },
  watch: {
    pageSize: function() {
      this.getCardAll()
    },
    currentPage: function() {
      this.getCardAll()
    },
    total: function() {}
  },
  methods: {
    // 分页查询所有
    async getCardAll() {
      this.data = { currentPage: this.currentPage, pageSize: this.pageSize }
      this.url = '/card/list'
      this.result = await API.init(this.url, this.data, 'post')
      this.cardList = this.result.data
      this.cardList1 = this.result.data
      for (let i = 0; i < this.cardList.length; i++) {
        this.cardList[i].gmtCreate = this.formatDate(this.cardList[i].gmtCreate)
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
      this.data = { field: this.msg.pkCardId }
      this.url = '/card/id'
      this.result = await API.init(this.url, this.data, 'post')
      if (this.data) {
        this.getCardAll()
        this.$message.success('删除成功')
      } else {
        this.$message.error('一卡通信息删除失败')
      }
      this.delVisible = false //关闭删除提示模态框
    },
    //批量删除
    delAll() {
      this.batchdelVisible = true //显示删除弹框
      const length = this.multipleSelection.length
      for (let i = 0; i < length; i++) {
        this.delarr.push(this.multipleSelection[i].pkCardId)
      }
    },
    //操作多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    //批量删除
    async deleteBatch() {
      this.data = { ids: String(this.delarr) }
      this.url = '/card/deletionBath'
      this.result = await API.init(this.url, this.data, 'post')
      if (this.data) {
        this.getCardAll()
        this.$message.success('批量删除成功')
      } else {
        this.$message.error('App版本信息批量删除失败')
      }
      this.batchdelVisible = false //关闭删除提示模态框
    },
    async changeSwitchA(index, row) {
      this.idx = index
      this.msg = row //每一条数据的记录
      console.log(this.msg.pkCardId)
      this.data = { field: this.msg.pkCardId, status: true }
      this.url = '/card/statuschange'
      this.result = await API.init(this.url, this.data, 'post')
      this.$message.success('激活成功')
      this.getCardAll()
    },
    //编辑
    handleUpdate(index, row) {
      this.idx = index
      this.msg = row //每一条数据的记录
      this.updatecenterDialogVisible = true
    },
    //修改一卡通信息
    async confirmUpdate() {
      if (this.ruleForm.pass == this.ruleForm.checkPass) {
        this.data = {
          pkCardId: this.msg.pkCardId,
          status: this.msg.status,
          cardPassword: this.ruleForm.checkPass,
          jobNumber: this.ruleForm.jobnumber,
          cardBalance: this.ruleForm.balance
        }
        this.url = '/card/modification'
        this.result = await API.init(this.url, this.data, 'post')
        this.updatecenterDialogVisible = false
        this.getCardAll()
        if (this.result.data == null) {
          this.$message.success('该一卡通未激活，信息修改失败')
        } else {
          this.$message.success('信息修改成功')
        }
      } else {
        this.$message.error('两次输入的密码不一致，修改失败')
      }
    },
    //新增一卡通
    async confirmAdd() {
      this.data = {
        cardNumber: this.ruleForm1.cardNumber,
        cardPassword: this.ruleForm1.cardPassword,
        jobNumber: this.ruleForm1.jobNumber,
        cardBalance: this.ruleForm1.cardbalance1
      }
      this.url = '/card/increase'
      this.result = await API.init(this.url, this.data, 'post')
      this.addcenterDialogVisible = false
      this.getCardAll()
      if (this.result.data == null) {
        this.$message.success('该一卡通账号已存在，请勿重复新增')
      } else {
        this.$message.success('一卡通添加成功')
      }
    },

    //明细
    handleDetail(index, row) {
      this.idx = index
      this.msg = row //每一条数据的记录
      this.datailcenterDialogVisible = true
      this.getDetail()
    },
    //清单明细
    async getDetail() {
      this.data = {
        field: this.msg.jobNumber
      }
      this.url = '/card/consume'
      this.result = await API.init(this.url, this.data, 'post')
      this.detailList = this.result.data
      for (let i = 0; i < this.detailList.length; i++) {
        this.detailList[i].gmtCreate = this.formatDate(this.detailList[i].gmtCreate)
      }
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
    //过滤搜索
    filterSearch() {
      // 获取输入框的值
      let search = this.input
      //数组元素按条件过滤
      this.cardList = this.cardList1.filter((v) => {
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
