<template>
  <div class="room-container" style="width: 100%">
    <el-row type="flex" style="width: 100%">
      <!-- <el-col span="4" class="tl">
        <el-input prefix-icon="el-icon-search" v-model="input" placeholder="请输入内容" class="blur-search mt-10"></el-input>
        <el-tree :data="towers" :props="defaultProps" @node-click="handleNodeClick" class="mt-20"></el-tree>
      </el-col> -->
      <el-col span="15" class="mr-20">
        <!-- 操作按钮 -->
        <el-row type="flex" class="ml-20 mt-10">
          <el-input
            v-model="blurSearch"
            prefix-icon="el-icon-search"
            placeholder="根据角色名称查询"
            class="blur-search"
            v-if="searchShow"
            @input="filterSearch"
          ></el-input>
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
            <el-button size="small" class="search-btn" style="width: 40px" @click="searchShow = !searchShow" @mouseover="searchOver()">
              <i class="el-icon-search" style="color: white"></i>
            </el-button>
            <el-button icon="el-icon-refresh" size="small" @click="flush()"></el-button>
          </el-col>
        </el-row>
        <!-- 表格 -->
        <el-row style="border: 1px solid #e6ebf5" class="mt-20  ml-20">
          <p class="tl fw mt-10 " style="border-bottom: 1px solid #e6ebf5; padding-bottom: 10px">
            <span class="ml-10">角色列表 </span>
          </p>
          <el-table
            ref="multipleTable"
            :data="roleInfos.slice(start, end)"
            tooltip-effect="dark"
            style="width: 100%; "
            @selection-change="handleSelectionChange"
            :header-cell-style="getRowClass"
            class="light-small-font p-a-20"
            @row-click="getRoleMenus"
          >
            <el-table-column type="selection" min-width="5%"></el-table-column>
            <el-table-column label="角色名" min-width="15%">
              <template slot-scope="scope">{{ scope.row.roleName }}</template>
            </el-table-column>
            <el-table-column label="角色描述" min-width="15%">
              <template slot-scope="scope">{{ scope.row.roleDescription }}</template>
            </el-table-column>
            <el-table-column label="创建时间" show-overflow-tooltip min-width="10%">
              <template slot-scope="scope">{{ scope.row.gmtCreate }}</template>
            </el-table-column>
            <el-table-column label="操作" align="center" min-width="20%">
              <template slot-scope="scope">
                <p style="text-align:center">
                  <el-button size="mini" icon="el-icon-edit" type="primary" @click="updaeRoleInfo(scope.row)"> </el-button>
                  <el-button size="mini" icon="el-icon-delete" type="danger" @click="handleDelete(scope.row)"> </el-button>
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
            :page-sizes="[5, 10]"
            :page-size="100"
            layout="total, prev, pager, next, sizes"
            :total="roleInfos.length"
            @prev-click="prevPage()"
            @next-click="nextPage()"
          ></el-pagination>
        </el-row>
        <!-- 新增页面 -->
        <div class="dialog" v-if="dialogFormVisible">
          <el-form class="mt-10 dialog-form dc-jc-ac" :model="roleInfo" style="padding: 0px 20px;">
            <p style="width: 90%;" class="dark-large-font tl">{{ msg }}角色</p>
            <el-form-item required label="角色名" class="mt-20" :label-width="formLabelWidth" style="width: 90%; height: 70px">
              <el-input v-model="roleInfo.roleName" autocomplete="off" placeholder="请输入角色名" style="width: 80%"></el-input>
              <p style="width: 90%; display:flex">
                <span style="display: block; width: 20%"></span>
                <span style="display: block; height: 20px; margin-top: 0; width: 80%; color:red;" v-if="rules.roleErrorShow" class="tl"
                  >{{ roleErrorInfo }}
                </span>
              </p>
            </el-form-item>
            <el-form-item label="角色描述" style="width:90%">
              <el-input
                type="textarea"
                placeholder="请输入内容"
                style="width: 80%;"
                v-model="roleInfo.roleDescription"
                maxlength="60"
                show-word-limit
              >
              </el-input>
            </el-form-item>
            <p class="mt-20 tr" style="width: 90%">
              <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
              <el-button type="primary" @click="addRoleInfo(tag)" size="small">确定</el-button>
            </p>
          </el-form>
          <!-- <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addRoomInfo(tag)">确定</el-button>
          </div> -->
        </div>
      </el-col>
      <!-- 菜单分配 -->
      <el-col span="7" style="border: 1px solid #e6ebf5">
        <p class="dark-large-font fw tl df-jb-ac" style="border-bottom: 1px solid #e6ebf5; height: 50px">
          <span class="ml-10">分配权限</span>
          <el-button @click="getCheckedNode" type="primary" size="mini" class="mr-20">
            <span class="" style="color:#eee">保存</span>
          </el-button>
        </p>
        <el-tree
          :data="menus"
          ref="tree"
          class="mt-20"
          show-checkbox
          node-key="pk_menu_id"
          :default-checked-keys="roleMenus"
          :props="defaultProps1"
        >
        </el-tree>
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
      selectValue: '',
      checkedNode: '',
      start: 0,
      radio: true,
      blurSearch: '',
      time: '',
      end: 5,
      searchShow: true,
      iconColor: '#fefcf8',
      pageSize: 5,
      currentPageSize: 5,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      roleMenus: [],
      dialogFormVisible: false,
      multipleSelection: [],
      roleInfos: [],
      roleInfo: {
        roleName: '',
        roleDescription: '',
        pkRoleId: -1
      },
      tag: 1,
      currentPage: 1,
      msg: '新增',
      roleName: '',
      textarea: '',
      menus: [],
      defaultProps1: {
        children: 'subMenus',
        label: 'name'
      },
      rules: {
        roleErrorShow: false
      },
      roleErrorInfo: '',
      roleId: -1
    }
  },
  components: {},
  created() {
    this.getRoles()
    this.getAllMenus()
  },
  mounted() {},
  methods: {
    //获取所有角色信息
    async getRoles() {
      this.roles = (await API.init('/role/all', null, 'post')).data
      for (let i = 0, len = this.roles.length; i < len; i++) {
        this.roles[i].gmtCreate = this.global.formatDate(this.roles[i].gmtCreate)
      }
      this.roleInfos = this.roles
      console.log(this.roleInfos)
    },
    /* 打开遮罩层 */
    openDialog() {
      this.dialogFormVisible = true
      this.tag = 1
      this.rules.roleErrorShow = false
      this.roleErrorInfo = ''
      this.msg = ' 新增 '
      this.roleInfo.roleName = ''
      this.roleInfo.roleDescription = ''
    },

    //改变用户状态
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
      this.roleInfos = this.roles.filter((role) => {
        if (role.roleName.indexOf(this.blurSearch) != -1 || role.roleDescription.indexOf(this.blurSearch) != -1) {
          return role
        }
      })
    },
    async getCheckedNode() {
      let keys = this.$refs.tree.getCheckedKeys()
      let add = keys.filter((key) => {
        if (this.roleMenus.indexOf(key) == -1) {
          return key
        }
      })
      let roleMenus = this.roleMenus
      let subtraction = roleMenus.filter((roleMenu) => {
        if (keys.indexOf(roleMenu) == -1) {
          return roleMenu
        }
      })
      console.log(add.length)
      console.log(subtraction)
      if (add.length > 1) {
        let doubleFieldDto = {
          firstField: JSON.stringify(add),
          secondField: this.roleId
        }
        let result = await API.init('/role/assign/menus', doubleFieldDto, 'post')
        if (result.code == 1) {
          this.$message({
            message: '新增成功',
            type: 'success'
          })
        }
      }
      if (subtraction.length > 1) {
        let queryDto = {
          firstField: JSON.stringify(subtraction),
          secondField: this.roleId
        }
        let result = await API.init('/role/delection/batch', queryDto, 'post')
        if (result.code == 1) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
        }
      }
    },
    //获取指定角色的所有权限
    async getRoleMenus(row) {
      this.getAllMenus()
      this.roleMenus = []
      let roleMenus = []
      let dto = {
        field: row.pkRoleId
      }
      this.roleId = row.pkRoleId
      let menus = (await API.init('/role/menus', dto, 'post')).data
      for (let i = 0, len = menus.length; i < len; i++) {
        let parentMenu = menus[i]
        roleMenus.push(parentMenu.pkMenuId)
        if (parentMenu.subMenus == null) {
          console.log(parentMenu)
        } else {
          for (let j = 0, len1 = parentMenu.subMenus.length; j < len1; j++) {
            let subMenus = parentMenu.subMenus[j]
            roleMenus.push(subMenus.pkMenuId)
          }
        }
        this.roleMenus = roleMenus
      }
      console.log("权限>>>>>>>>>>>>>>>>>>>")
      console.log(this.roleMenus)
    },
    async getAllMenus() {
      this.menus = (await API.init('/menu/list', null, 'post')).data
    },
    //新增角色消息
    async addRoleInfo(tag) {
      if (this.roleInfo.roleName !== '') {
        if (this.check.containSpecial(this.roleInfo.roleName)) {
          this.roleErrorInfo = '不允许存在特殊符号'
        } else {
          if (tag == 1) {
            let result = await API.init('/role/increase', this.roleInfo, 'post')
            if (result.code == 1) {
              this.$message({
                message: '新增成功',
                type: 'success'
              })
              this.getRoles()
              this.dialogFormVisible = false
              this.roles.splice(0, 0, this.roleInfo)
            }
          } else {
            let result = await API.init('/role/modification', this.roleInfo, 'post')
            if (result.code == 1) {
              let roleInfo = this.roles.filter((role) => {
                if (role.pkRoleId == this.roleInfo.pkRoleId) {
                  return role
                }
              })
              this.dialogFormVisible = false
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              //修改用户信息
              let index = this.roles.indexOf(roleInfo[0])
              this.roles.splice(index, 1, this.roleInfo)
            }
          }
        }
      } else {
        this.rules.roleErrorShow = true
        this.roleErrorInfo = '角色名不允许为空'
      }
    },
    /* 修改role信息 */
    updaeRoleInfo(row) {
      this.msg = '修改'
      this.roleInfo.roleName = row.roleName
      this.roleInfo.roleDescription = row.roleDescription
      this.roleInfo.pkRoleId = row.pkRoleId
      this.dialogFormVisible = true
      this.tag = 2
    },
    //删除房间信息
    async handleDelete(item) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios({
          method: 'post',
          url: 'http://localhost:8081/role/deletion/id',
          data: {
            field: item.pkRoleId
          }
        }).then((res) => {
          if (res.data.code == 1) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            let index = this.roles.indexOf(item)
            this.roleInfos.splice(index, 1)
            //删除原数组中的数据
            this.roles.splice(index, 1)
            /* this.roles = this.adminInfoList.filter((admin) => {
              if (admin.sys_user_id !== item.sys_user_id) {
                return admin
              }
            }) */
          }
        })
      })
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
      this.roleInfos = this.roles.filter((role) => {
        if (role.roleName.indexOf(this.blurSearch) !== -1) {
          return role
        }
      })
    }
  },
  computed: {}
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

>>> .el-form-item__label {
  color: #606266;
  font-weight: 600;
}

>>> .el-textarea__inner {
  height: 80px;
}

.search-btn {
  height: 30px;
  width: 80px;
}

.el-input__inner {
  height: 30px;
}
</style>
