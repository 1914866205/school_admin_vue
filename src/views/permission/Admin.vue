<template>
  <div class="room-container" style="width: 100%">
    <el-row type="flex" style="width: 100%">
      <!-- <el-col span="4" class="tl">
        <el-input prefix-icon="el-icon-search" v-model="input" placeholder="请输入内容" class="blur-search mt-10"></el-input>
        <el-tree :data="towers" :props="defaultProps" @node-click="handleNodeClick" class="mt-20"></el-tree>
      </el-col> -->
      <el-col span="23">
        <!-- 操作按钮 -->
        <el-row type="flex" class="ml-20 mt-10">
          <el-input
            v-model="blurSearch"
            prefix-icon="el-icon-search"
            placeholder="输入用户名或角色查询"
            class="blur-search"
            @input="filterSearch"
            v-if="searchShow"
          ></el-input>
          <el-select v-model="searchs.statu" placeholder="状态" v-if="searchShow" class="statu-search ml-10">
            <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-button v-if="searchShow" type="success" size="mini" @click="search()" class="ml-10 bg-green" icon="">
            <i class="el-icon-search" style="color: rgb(247, 251, 255)"></i>
            <span class="light-font-color">搜索</span>
          </el-button>
        </el-row>
        <el-row class="df-jr-ac ml-20 mt-10">
          <el-col class="tl">
            <el-button type="primary" icon="el-icon-plus" @click="openDialog" size="mini">
              <span class="light-font-color">新增</span>
            </el-button>
            <el-button type="success" icon="el-icon-edit" size="mini">
              <span class="light-font-color">修改</span>
            </el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">
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
            <el-button icon="el-icon-refresh" size="small" @click="flush()"></el-button>
          </el-col>
        </el-row>
        <!-- 表格 -->
        <el-row style="border: 1px solid #e6ebf5" class="mt-20  ml-20">
          <el-table
            ref="multipleTable"
            :data="admins.slice(start, end)"
            tooltip-effect="dark"
            style="width: 100%; "
            @selection-change="handleSelectionChange"
            :header-cell-style="getRowClass"
            class="light-small-font"
          >
            <el-table-column type="selection" min-width="5%"></el-table-column>
            <el-table-column label="用户名" min-width="15%">
              <template slot-scope="scope">{{ scope.row.sys_user_name }}</template>
            </el-table-column>
            <el-table-column label="角色" min-width="15%">
              <template slot-scope="scope">{{ scope.row.role_name }}</template>
            </el-table-column>
            <el-table-column label="手机号" min-width="15%">
              <template slot-scope="scope">{{ scope.row.sys_user_phone_number }}</template>
            </el-table-column>
            <el-table-column prop="status" label="状态" show-overflow-tooltip min-width="15%">
              <template slot-scope="scope">
                <el-switch
                  @change="changeEnabled(scope.row)"
                  v-model="scope.row.is_enabled"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                >
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" show-overflow-tooltip min-width="10%">
              <template slot-scope="scope">{{ scope.row.gmt_create }}</template>
            </el-table-column>
            <el-table-column label="操作" align="center" min-width="20%">
              <template slot-scope="scope">
                <p style="text-align:center">
                  <el-button size="mini" icon="el-icon-edit" type="primary" @click="updaeAdminInfo(scope.row)">
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
        <el-row class="df-jl-ac mt-10  ml-20">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20]"
            :page-size="100"
            layout="total, prev, pager, next, sizes"
            :total="admins.length"
            @prev-click="prevPage()"
            @next-click="nextPage()"
          ></el-pagination>
        </el-row>
        <!-- 新增页面 -->
        <div class="dialog" v-if="dialogFormVisible">
          <el-form class="mt-10 dialog-form dc-jc-ac" :rules="rules" :model="adminInfo" style="padding: 0px 20px;">
            <p style="width: 90%;" class="dark-large-font tl">{{ msg }}用户</p>
            <el-form-item required label="用户名" class="mt-20" :label-width="formLabelWidth" style="width: 90%; height: 60px">
              <el-input
                v-model="adminInfo.name"
                autocomplete="off"
                @blur="checkSpecial(adminInfo.name)"
                placeholder="请输入用户名"
                style="width: 80%"
              ></el-input>
              <p style="width: 90%; display:flex">
                <span style="display: block; width: 20%"></span>
                <span style="display: block; height: 20px; margin-top: 0; width: 80%; color:red;" v-if="rules.userErrorShow" class="tl"
                  >{{ userErrorInfo }}
                </span>
              </p>
            </el-form-item>
            <el-form-item required label="手机号" :label-width="formLabelWidth" style="width: 90%; height: 60px;">
              <el-input
                v-model="adminInfo.phoneNumber"
                maxlength="11"
                type="text"
                autocomplete="off"
                placeholder="请输入手机号"
                style="width: 80%; max-height: 30px"
                oninput="value=value.replace(/[^\d]/g,'')"
                @input="checkPhone(adminInfo.phoneNumber)"
              ></el-input>
              <p style="width: 90%; display:flex">
                <span style="display: block; width: 20%"></span>
                <span style="display: block; height: 20px; margin-top: 0; width: 80%; color:red;" v-if="rules.phoneErrorShow" class="tl"
                  >{{ phoneErrorInfo }}
                </span>
              </p>
            </el-form-item>
            <p style="width: 90%" class="df-jr-ac">
              <el-form-item required label="角色" :label-width="formLabelWidth" style="width: 50%;">
                <el-select v-model="adminInfo.role" placeholder="请选择角色" style="width: 60%;" class="ml-10">
                  <el-option v-for="(role, index) in roles" :key="index" :label="role.roleName" :value="role.pkRoleId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="mr-10 df-jc-ac" required label="状态">
                <el-radio v-model="adminInfo.isEnabled" label="true">激活</el-radio>
                <el-radio v-model="adminInfo.isEnabled" label="false">禁用</el-radio>
              </el-form-item>
            </p>
            <p class="mt-20 tr" style="width: 90%">
              <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
              <el-button type="primary" @click="addAdminInfo(tag)" size="small">确定</el-button>
            </p>
          </el-form>
          <!-- <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addRoomInfo(tag)">确定</el-button>
          </div> -->
        </div>
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
      status: [
        { value: 'false', label: '禁用' },
        { value: 'true', label: '激活' }
      ],
      searchs: {
        statu: ''
      },
      roles: [],
      adminInfos: [],
      selectValue: '',
      rooms: [],
      start: 0,
      radio: true,
      blurSearch: '',
      time: '',
      end: 10,
      searchShow: true,
      iconColor: '#fefcf8',
      pageSize: 10,
      currentPageSize: 10,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      dialogFormVisible: false,
      multipleSelection: [],
      admins: [],
      adminInfoList: [],
      adminInfo: {
        userId: '',
        name: '',
        role: '',
        phoneNumber: '',
        isEnabled: -1
      },
      rules: {
        phoneErrorShow: false,
        userErrorShow: false
      },
      userErrorInfo: '',
      phoneErrorInfo: '',
      tag: 1,
      currentPage: 1,
      msg: '新增',
      roleName: '',
      deleteIndex: 0
    }
  },
  components: {},
  created() {
    this.getAdmins()
    this.getRoles()
  },
  mounted() {},
  methods: {
    //获取所有用户
    async getAdmins() {
      let admin = (await API.init('/admin/all', null, 'post')).data
      for (let i = 0, len = admin.length; i < len; i++) {
        admin[i].gmt_create = this.global.formatDate(admin[i].gmt_create)
      }
      this.admins = admin
      this.adminInfos = admin
      this.adminInfoList = this.admins
    },
    //获取所有角色信息
    async getRoles() {
      this.roles = (await API.init('/role/all', null, 'post')).data
    },
    /* 打开遮罩层 */
    openDialog() {
      this.rules.phoneErrorShow = false
      this.rules.userErrorShow = false
      this.dialogFormVisible = true
      this.tag = 1
      this.msg = ' 新增 '
      this.adminInfo.name = ''
      this.adminInfo.role = ''
      this.adminInfo.phoneNumber = ''
      this.adminInfo.isEnabled = ''
    },
    //改变用户账号状态
    async changeEnabled(item) {
      this.$confirm('此操作将修改该用户账号状态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {
          field: item.sys_user_id,
          status: item.is_enabled
        }
        let res = API.init('/sysUser/single/id', data, 'post')
        // this.axios({
        //   method: 'post',
        //   url: 'http://localhost:8080/sysUser/single/id',
        //   data: {
        //     field: item.sys_user_id,
        //     status: item.is_enabled
        //   }
        // }).then((res) => {
        if (res.data.code == 1) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
        }
      })
      // })
    },
    //搜索
    search() {
      if (this.searchs.statu != '') {
        let status = ''
        if (this.searchs.statu == 'false') {
          status = false
        } else {
          status = true
        }
        this.adminInfos = this.admins.filter((admin) => {
          if (admin.is_enabled == status) {
            //console.log(status)
            return admin
          }
        })
      } else {
        this.adminInfos = this.admins.filter((admin) => {
          if (admin.sys_user_name.indexOf(this.blurSearch) != -1 || admin.role_name.indexOf(this.blurSearch) != -1) {
            return admin
          }
        })
      }
    },
    //新增管理员消息
    async addAdminInfo(tag) {
      if (this.adminInfo.name == '') {
        this.userErrorInfo = '用户名不能为空'
        this.rules.userErrorShow = true
      }
      if (this.adminInfo.phoneNumber == '') {
        this.phoneErrorInfo = '手机号不能为空'
        this.rules.phoneErrorShow = true
      }
      if (this.adminInfo.phoneNumber.length < 11) {
        this.phoneErrorInfo = '请输入11位手机号'
        this.rules.phoneErrorShow = true
      }
      if (this.rules.phoneErrorShow == false && this.rules.userErrorShow == false) {
        let time = new Date().getMilliseconds
        this.roles.filter((role) => {
          if (role.pkRoleId == this.adminInfo.role) {
            this.roleName = role.roleName
          }
        })
        //转换isEnabled状态
        if (this.adminInfo.isEnabled == 'true') {
          this.adminInfo.isEnabled = true
        } else {
          this.adminInfo.isEnabled = false
        }
        //定义临时变量，用于新增或修改
        let admin = {
          sys_user_id: this.adminInfo.userId,
          sys_user_name: this.adminInfo.name,
          role_name: this.roleName,
          sys_user_phone_number: this.adminInfo.phoneNumber,
          is_enabled: this.adminInfo.isEnabled,
          gmt_create: time
        }
        if (tag == 1) {
          let result = await API.init('/admin/increase', this.adminInfo, 'post')
          if (result.code == 1) {
            this.$message({
              message: '新增成功',
              type: 'success'
            })
            this.dialogFormVisible = false
            this.admins.splice(0, 0, admin)
          }
        } else {
          let result = await API.init('/admin/modification', this.adminInfo, 'post')
          if (result.code == 1) {
            let adminInfo = this.admins.filter((admin) => {
              if (admin.sys_user_id == this.adminInfo.userId) {
                return admin
              }
            })
            this.dialogFormVisible = false
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            //修改用户信息
            let index = this.admins.indexOf(adminInfo[0])
            this.admins.splice(index, 1, admin)
          }
        }
      }
    },
    /* 修改admin信息 */
    updaeAdminInfo(row) {
      this.rules.phoneErrorShow = false
      this.rules.userErrorShow = false
      this.msg = '修改'
      this.adminInfo.name = row.sys_user_name
      this.roles.filter((role) => {
        if (role.roleName == row.role_name) {
          this.adminInfo.role = role.pkRoleId
        }
      })
      this.adminInfo.phoneNumber = row.sys_user_phone_number
      this.adminInfo.userId = row.sys_user_id
      if (row.is_enabled == true) {
        this.adminInfo.isEnabled = 'true'
      } else {
        this.adminInfo.isEnabled = 'false'
      }
      this.dialogFormVisible = true
      this.tag = 2
    },
    //删除管理员信息
    async handleDelete(item) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        /* let data = {
          field: item.sys_user_phone_number
        } */
        /* let res = API.init('/sysUser/deletion/phoneNumber', data, 'post') */
        this.axios({
          url: 'http://localhost:8081/sysUser/deletion/phoneNumber',
          method: 'post',
          data: {
            field: item.sys_user_phone_number
          }
        }).then((res) => {
          if (res.data.code == 1) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            let index = this.adminInfoList.indexOf(item)
            /* for (let i = 0, len = this.adminInfoList.length; i < len; i++) {
              if (this.adminInfoList[i].sys_user_id === item.sys_user_id) console.log('索引i的值' + i)
              index = i
            } */
            this.admins.splice(index, 1)
            this.deleteIndex = index
            this.adminInfoList = this.adminInfoList.filter((admin) => {
              if (admin.sys_user_id !== item.sys_user_id) {
                return admin
              }
            })
            /* this.adminInfoList.splice(index, 1) */
          }
        })
      })
      // })
    },
    //校验手机号
    checkPhone(val) {
      this.rules.phoneErrorShow = this.check.checkPhone(val)
      if (this.rules.phoneErrorShow) {
        this.phoneErrorInfo = '手机号格式不正确'
      }
    },
    //校验特殊字符
    checkSpecial(val) {
      if (!this.check.containSpecial(val)) {
        if (val.length > 10) {
          this.userErrorInfo = '用户名不得超过10个字符'
          this.rules.userErrorShow = true
        } else if (val == '') {
          this.userErrorInfo = '用户名不得为空'
          this.rules.userErrorShow = true
        } else {
          this.rules.userErrorShow = false
        }
      } else {
        this.userErrorInfo = '不能包含特殊字符'
        this.rules.userErrorShow = true
      }
    },
    //刷新数据
    flush() {
      this.getRoom()
    },
    //el-table行内样式回调函数
    getRowClass({ rowIndex }) {
      if (rowIndex === 0) {
        return 'color: #ddd;font-size: 12px; font-weight: 500'
      } else {
        return ''
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
    searchOver() {
      this.iconColor = '#f1f1df'
    },
    //过滤搜搜
    filterSearch() {
      this.adminInfos = this.admins.filter((admin) => {
        console.log(admin)

        if (admin.sys_user_name.indexOf(this.blurSearch) !== -1 || admin.role_name.indexOf(this.blurSearch) !== -1) {
          return admin
        }
      })
    }
  },
  computed: {}
}
</script>

<style scoped>
.room-container {
  padding: 20px 0px;
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

.el-input__icon {
  color: #ddd;
  margin-top: -5px;
}

.el-button--success {
  background-color: #13ce66;
}

.search-btn {
  background-color: #f4f4f5;
}

.el-input__prefix {
  display: flex;
  height: 30px;
  line-height: 30px;
}

.el-icon-date {
  margin-bottom: 10px;
}

.search-btn:hover {
  background-color: #909399;
}

.el-input__inner {
  height: 30px;
  line-height: 30px;
}

/* >>> .el-icon-search {
  color: #f7fbff;
} */

/* >>> .el-select__caret {
  margin-top: 5px;
} */

/* >>> .el-input__suffix-inner {
  display: flex;
} */

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

.el-form-item__label {
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

.search-btn {
  height: 30px;
  width: 80px;
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
