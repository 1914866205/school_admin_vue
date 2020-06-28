<template>
  <div style="width: 100%">
    <!-- 删除提示框 -->
    <el-dialog :class="dialog" class="dialog" :modal="false" title="提示" :visible.sync="batchdelVisible" width="300px" center>
      <div class="del-dialog-cnt">批量删除账号信息后不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="batchdelVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteBatch()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改弹出框 -->

    <el-dialog class="dialog" title="编辑账号信息" :modal="false" :visible.sync="updatecenterDialogVisible" width="30%" left>
      <el-form :model="ruleForm" status-icon label-width="80px" :rules="rules">
        <el-form-item required label="昵称" prop="nickName">
          <el-input v-model="ruleForm.nickName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item required label="头像" prop="avatar">
          <img :src="ruleForm.avatar" alt="" style="width:100px;height:100px" @click="getClick()" />
          <!-- 隐藏的文件输入框 -->
          <input type="file" ref="upload" style="display:none;" @change="handlderFile()" />
        </el-form-item>

        <el-form-item required label="手机号" prop="phoneNumber">
          <el-input
            oninput="value=value.replace(/[^\d]/g,'')"
            v-model.number="ruleForm.phoneNumber"
            @input="phoneChange1"
            maxlength="11"
          ></el-input>
        </el-form-item>
        <el-form-item required label="地址" prop="address">
          <el-input v-model.number="ruleForm.address"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updatecenterDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmUpdate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 增加弹出框 -->

    <el-dialog class="dialog" :modal="false" title="添加账号" :visible.sync="addcenterDialogVisible" width="30%" center>
      <el-form label-width="80px" :model="ruleForm1" :rules="rules" ref="ruleForm1">
        <el-form-item required label="姓名" prop="userName">
          <el-input v-model="ruleForm1.userName"></el-input>
        </el-form-item>
        <el-form-item required label="学号" prop="jobNumber">
          <el-input maxlength="13" oninput="value=value.replace(/[^\d]/g,'')" v-model="ruleForm1.jobNumber"></el-input>
        </el-form-item>
        <el-form-item label="班级" prop="clazzId">
          <el-select size="mini" v-model="selectValue" placeholder="请选择" class="statu-search ml-10">
            <el-option v-for="(item, index) in clazzList" :key="index" :label="item.name" :value="item.pkClazzId"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="ruleForm1.address"></el-input>
        </el-form-item>

        <el-form-item required label="手机号" prop="phoneNumber">
          <el-input
            oninput="value=value.replace(/[^\d]/g,'')"
            v-model="ruleForm1.phoneNumber"
            @input="phoneChange"
            maxlength="11"
          ></el-input>
        </el-form-item>
        <el-form-item required label="性别" prop="gender">
          <template>
            <el-radio v-model="radio" label="男"></el-radio>
            <el-radio v-model="radio" label="女"></el-radio>
          </template>
        </el-form-item>
        <el-form-item required label="角色" prop="role">
          <template>
            <el-radio v-model="radio1" label="1">学生</el-radio>
            <el-radio v-model="radio1" label="2">教师</el-radio>
          </template>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addcenterDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAdd">确 定</el-button>
      </span>
    </el-dialog>
    <el-row type="flex" class="ml-20 mt-10">
      <el-input size="mini" v-model="input" placeholder="请输入内容" class="blur-search" @input="filterSearch()"></el-input>
      <el-button type="success" size="mini" class="ml-10" icon="el-icon-search">搜索</el-button>
    </el-row>
    <el-row class="df-jr-ac ml-20 mt-10">
      <el-col class="tl">
        <el-button type="primary" icon="el-icon-plus" size="small" @click="addcenterDialogVisible = true"><span>新增</span></el-button>
        <el-button type="danger" icon="el-icon-delete" size="small" @click="delAll()">批量删除</el-button>
        <el-button type="warning" icon="el-icon-download" size="small">导出</el-button>
      </el-col>
      <el-col class="tr mr-20">
        <el-button icon="el-icon-refresh" size="small"></el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-row>
      <el-col span="1"></el-col>
      <el-col span="23" class="ml-20 mt-10">
        <el-table
          ref="multipleTable"
          :data="userAccountList"
          tooltip-effect="dark"
          style="width: 100%;"
          stripe="true"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" min-width="5%"></el-table-column>
          <el-table-column label="账号" min-width="10%">
            <template slot-scope="scope">{{ scope.row.userAccount }}</template>
          </el-table-column>
          <el-table-column prop="nickname" label="昵称" min-width="15%"></el-table-column>
          <el-table-column prop="role" label="角色" min-width="15%" :formatter="roleChange"> </el-table-column>
          <el-table-column prop="phoneNumber" label="手机号" show-overflow-tooltip min-width="15%"> </el-table-column>
          <el-table-column prop="status" label="状态" show-overflow-tooltip min-width="15%">
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
          <el-table-column prop="gmtCreate" label="创建时间" show-overflow-tooltip min-width="15%"> </el-table-column>
          <el-table-column label="操作" align="center" show-overflow-tooltip min-width="20%">
            <template slot-scope="scope">
              <p class="tc">
                <el-button size="mini" icon="el-icon-edit" type="primary" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
                <el-button size="mini" icon="el-icon-delete" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </p>
            </template>
          </el-table-column>
        </el-table>
        <div class="block" style="margin-top:2%">
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
        <!-- 删除提示框 -->
        <el-dialog class="dialog" title="提示" :visible.sync="delVisible" width="300px" center :modal="false">
          <div class="del-dialog-cnt">账号信息删除不可恢复，是否确定删除？</div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="delVisible = false">取 消</el-button>
            <el-button type="primary" @click="deleteRow">确 定</el-button>
          </span>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
const API = require('../utils/api')

export default {
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        console.log(reg.test(value))
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
    return {
      time: '',
      value: true,
      userAccountList: [],
      userAccountList1: [],
      selectValue: '',
      multipleSelection: [],
      currentPage: 0,
      currentPageA: 0,
      total: 32,
      pageSize: 8,
      pageSizeA: 15,
      clazzList: [],
      delVisible: false,
      input: '',
      ruleForm1: {
        userName: '',
        jobNumber: '',
        role: '',
        gender: '',
        address: '',
        clazzId: '',
        phoneNumber: ''
      },
      ruleForm: {
        nickName: '',
        avatar: 'https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png',
        phoneNumber: '',
        address: ''
      },
      addcenterDialogVisible: false,
      radio: '',
      radio1: '',
      updatecenterDialogVisible: false,
      file: '',
      delarr: [], //存放删除的数据
      batchdelVisible: false,
      rules: {
        phoneNumber: [{ validator: checkPhone, trigger: 'blur' }],
        userName: [{ required: true, message: '请选择活动区域', trigger: 'change' }],
        jobNumber: [{ type: 'date', required: true, message: '请选择日期', trigger: 'change' }],
        role: [{ type: 'date', required: true, message: '请选择时间', trigger: 'change' }],
        gender: [{ type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }],
        address: [{ required: true, message: '请填写活动形式', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getuserAccount()
  },
  watch: {
    pageSize: function() {
      this.getuserAccount()
    },
    currentPage: function() {
      this.getuserAccount()
    },
    total: function() {}
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    roleChange: function(row, column) {
      return row.role == 1 ? '学生' : row.role == 2 ? '教师' : ''
    },
    phoneChange() {
      this.ruleForm1.phoneNumber = this.ruleForm1.phoneNumber.replace(/[^\d]/g, '')
      if (this.ruleForm1.phoneNumber.length > 11) {
        this.ruleForm1.phoneNumber = this.ruleForm1.phoneNumber.substr(0, 11)
      }
      //如果依赖element的表单校验，就到这里就OK了，如果单单用了el-input不用element的表单校验，那继续往下
      var reg = /^1[3456789]\d{9}$/
      if (this.ruleForm1.phoneNumber.length >= 11 && !reg.test(this.ruleForm1.phoneNumber)) {
        alert('请输入正确的手机号码格式')
      }
    },
    phoneChange1() {
      this.ruleForm.phoneNumber = this.ruleForm.phoneNumber.replace(/[^\d]/g, '')
      if (this.ruleForm.phoneNumber.length > 11) {
        this.ruleForm.phoneNumber = this.ruleForm.phoneNumber.substr(0, 11)
      }
      //如果依赖element的表单校验，就到这里就OK了，如果单单用了el-input不用element的表单校验，那继续往下
      var reg = /^1[3456789]\d{9}$/
      if (this.ruleForm.phoneNumber.length >= 11 && !reg.test(this.ruleForm.phoneNumber)) {
        alert('请输入正确的手机号码格式')
      }
    },
    // 编辑
    handleEdit(row) {
      console.log(row)
    },
    async getuserAccount() {
      this.data = { currentPage: this.currentPage, pageSize: this.pageSize }
      this.dataA = { currentPage: this.currentPageA, pageSize: this.pageSizeA }
      this.url = '/userAccount/all'
      this.url1 = '/clazz/all'
      this.result = await API.init(this.url, this.data, 'post')
      this.result1 = await API.init(this.url1, this.dataA, 'post')
      this.userAccountList = this.result.data
      this.clazzList = this.result1.data
      this.userAccountList1 = this.result.data
      for (let i = 0; i < this.userAccountList.length; i++) {
        this.userAccountList[i].gmtCreate = this.formatDate(this.userAccountList[i].gmtCreate)
      }
    },
    //单行删除
    handleDelete(index, row) {
      this.idx = index
      this.msg = row //每一条数据的记录
      this.delVisible = true
    },
    async deleteRow() {
      console.log(this.msg.pkUserAccountId)
      this.data = { filed1: this.msg.pkUserAccountId }
      this.url = '/userAccount/deletion'
      this.result = await API.init(this.url, this.data, 'post')
      this.getuserAccount()
      this.$message.success('删除成功')
      this.delVisible = false //关闭删除提示模态框
    },
    //操作多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    //批量删除
    delAll() {
      this.batchdelVisible = true //显示删除弹框
      const length = this.multipleSelection.length
      for (let i = 0; i < length; i++) {
        this.delarr.push(this.multipleSelection[i].pkUserAccountId)
      }
    },
    //批量删除
    async deleteBatch() {
      console.log(this.delarr)
      this.data = { ids: String(this.delarr) }
      this.url = '/userAccount/deletionBath'
      this.result = await API.init(this.url, this.data, 'post')
      this.$message.success('批量删除成功')
      this.batchdelVisible = false //关闭删除提示模态框
      this.getuserAccount()
    },
    // 当前页展示数据
    handleSizeChange: function(pageSize) {
      this.pageSize = pageSize
    },
    // 当前页
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage
    },
    //新增账号
    async confirmAdd() {
      if (
        this.ruleForm1.jobNumber != '' &&
        this.ruleForm1.userName != '' &&
        this.ruleForm1.phoneNumber != '' &&
        this.ruleForm1.address != ''
      ) {
        this.data = {
          userName: this.ruleForm1.userName,
          jobNumber: this.ruleForm1.jobNumber,
          role: this.radio1,
          gender: this.radio,
          address: this.ruleForm1.address,
          clazzId: this.selectValue,
          phoneNumber: this.ruleForm1.phoneNumber,
          status: false
        }
        // this.rules.acctMonth.push({ required: true }) //添加校验规则
        this.url = '/userAccount/insert'
        this.result = await API.init(this.url, this.data, 'post')
        console.log(this.result)
        this.addcenterDialogVisible = false
        this.getuserAccount()
        if (this.result.code == 50003) {
          this.$message.success('账号已存在')
        } else {
          this.$message.success('账号添加成功')
        }
      } else {
        this.$message.success('数据填充不完整，请重新输入')
      }
    },
    async changeSwitchA(index, row) {
      this.idx = index
      this.msg = row //每一条数据的记录
      console.log(this.msg.pkUserAccountId)
      this.data = { filed1: this.msg.pkUserAccountId, status: true }
      this.url = '/userAccount/status'
      this.result = await API.init(this.url, this.data, 'post')
      this.$message.success('激活成功')
      this.getuserAccount()
    },
    //编辑
    handleUpdate(index, row) {
      this.idx = index
      this.msg = row //每一条数据的记录
      this.updatecenterDialogVisible = true
    },
    //修改账号信息
    async confirmUpdate() {
      this.data = {
        pkUserAccountId: this.msg.pkUserAccountId,
        nickname: this.ruleForm.nickName,
        avatar: this.ruleForm.avatar,
        phoneNumber: this.ruleForm.phoneNumber,
        address: this.ruleForm.address
      }
      this.url = '/userAccount/modification'
      this.result = await API.init(this.url, this.data, 'post')
      this.updatecenterDialogVisible = false
      this.getuserAccount()
      if (this.result.data == null) {
        this.$message.success('该账号未激活，信息修改失败')
      } else {
        this.$message.success('信息修改成功')
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
    getClick() {
      this.$refs.upload.click()
    },
    handlderFile() {
      this.getClient()
      this.file = this.$refs.upload.files[0]
      var _this = this
      async function put() {
        try {
          let result = await _this.client.put(_this.$refs.upload.files[0].name, _this.file)
          _this.ruleForm.avatar = result.url
          _this.update()
        } catch (e) {
          console.log(e)
        }
      }
      put()
    },
    getClient() {
      let OSS = require('ali-oss')
      this.client = new OSS({
        region: 'oss-cn-beijing',
        accessKeyId: 'LTAIaG9RkwvVwXq6',
        accessKeySecret: '5WPkPJ4JY0nWciRfDpMFxzScm3oJn2',
        bucket: 'zhent-img'
      })
    },
    //过滤搜索
    filterSearch() {
      // 获取输入框的值
      let search = this.input
      //数组元素按条件过滤
      this.userAccountList = this.userAccountList1.filter((v) => {
        if (JSON.stringify(v).includes(search)) {
          return v
        }
      })
    }
  }
}
</script>

<style scoped>
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
