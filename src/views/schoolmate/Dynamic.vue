<template>
  <div style="width:100%">
    <!-- 新增页面 -->
    <div class="dialog" v-if="addcenterDialogVisible">
      <el-form class="mt-10 dialog-form dc-jc-ac" :model="dynamicInfo" ref="dynamicInfo" :rules="rules" style="padding: 0px 20px;">
        <p style="width: 90%;" class="dark-large-font tl">新增动态</p>

        <el-form-item label="用户id" class="mt-20" prop="userId" style="width: 90%;">
          <el-input v-model="dynamicInfo.userId" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="动态内容" prop="content" style="width: 90%;">
          <el-input v-model="dynamicInfo.content" style="width: 80%"></el-input>
        </el-form-item>
        <p style="width: 90%">
          <el-form-item label="类型" prop="type" style="width: 50%;">
            <el-select v-model="dynamicInfo.type">
              <el-option label="身边趣事" value="身边趣事"></el-option>
              <el-option label="吐槽爆料" value="吐槽爆料"></el-option>
              <el-option label="创作分享" value="创作分享"></el-option>
              <el-option label="情感交流" value="情感交流"></el-option>
              <el-option label="时事新闻" value="时事新闻"></el-option>
            </el-select>
          </el-form-item>
        </p>
        <p class="mt-20 tr" style="width: 90%">
          <el-button @click="addcenterDialogVisible = false" size="small">取 消</el-button>
          <el-button type="primary" @click="submitForm('dynamicInfo')" size="small">确定</el-button>
          <el-button @click="resetForm('dynamicInfo')">重置</el-button>
        </p>
      </el-form>
    </div>

    <el-row type="flex" class="ml-20 mt-10">
      <el-input size="mini" v-model="input" clearable placeholder="请输入内容" class="blur-search" @input="filterSearch()"></el-input>
      <el-button type="success" size="mini" class="ml-10" @click="searchAppInfoByCreate" v-if="searchShow">
        <i class="el-icon-search" style="color: rgb(247, 251, 255)"></i>
        <span class="light-font-color">搜索</span>
      </el-button>
    </el-row>
    <el-row class="df-jr-ac ml-20 mt-10">
      <el-col class="tl">
        <el-button type="primary" icon="el-icon-plus" @click="addcenterDialogVisible = true" size="mini">
          <span class="light-font-color">新增</span>
        </el-button>
        <el-button type="danger" icon="el-icon-delete" @click="delAll" size="mini">
          <span class="light-font-color">批量删除</span>
        </el-button>
        <el-button type="warning" icon="el-icon-download" disabled size="mini">
          <span class="light-font-color">导出</span>
        </el-button>
      </el-col>
    </el-row>
    <!-- 表格展示 -->
    <el-row>
      <el-col class="ml-20 mt-10">
        <el-table :data="dynamicList" style="width: 100%;">
          <el-table-column type="selection" min-width="10%" @selection-change="handleSelectionChange"> </el-table-column>
          <el-table-column label="昵称" show-overflow-tooltip min-width="13%">
            <template slot-scope="scope">
              <span style="margin-left:-5%">{{ scope.row.nickName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="姓名" show-overflow-tooltip min-width="13%">
            <template slot-scope="scope">
              <span style="margin-left:-5%">{{ scope.row.userName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="类型" show-overflow-tooltip min-width="12%">
            <template slot-scope="scope">
              <span>{{ scope.row.type }}</span>
            </template>
          </el-table-column>
          <el-table-column label="动态内容" show-overflow-tooltip min-width="12%">
            <template slot-scope="scope">
              <span>{{ scope.row.content }}</span>
            </template>
          </el-table-column>
          <el-table-column label="点赞数" show-overflow-tooltip min-width="8%">
            <template slot-scope="scope">
              <span>{{ scope.row.thumbs }}</span>
            </template>
          </el-table-column>
          <el-table-column label="评论数" show-overflow-tooltip min-width="8%">
            <template slot-scope="scope">
              <span>{{ scope.row.comments }}</span>
            </template>
          </el-table-column>

          <el-table-column label="创建时间" show-overflow-tooltip min-width="18%">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span>{{ scope.row.gmtCreate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="修改时间" show-overflow-tooltip min-width="18%">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span>{{ scope.row.gmtModified }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" show-overflow-tooltip min-width="23%">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!-- 删除提示框 -->
    <div class="dialog" v-if="delVisible">
      <div class="del-dialog-cnt">动态删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRow">确 定</el-button>
      </span>
    </div>
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
  </div>
</template>

<script>
const API = require('../utils/api')
export default {
  data() {
    return {
      dynamicList: [],
      dynamicList1: [],
      searchs: {
        statu: ''
      },
      selectValue: '',
      start: 0,
      blurSearch: '',
      currentPage: 0,
      total: 0,
      pageSize: 10,
      currentPageSize: 10,
      searchShow: true,
      updatecenterDialogVisible: false,
      addcenterDialogVisible: false,
      datailcenterDialogVisible: false,
      delVisible: false, //删除提示弹框的状态
      value1: '',
      input: '',
      gmtTime: '',
      end: 10,
      msg: '', //记录每一条的信息，便于取id
      dynamicInfos: [],
      dynamicInfo: {
        userId: '',
        content: '',
        type: ''
      },
      rules: {
        userId: [{ required: true, message: '请输入用户id', trigger: 'blur' }],
        content: [
          { required: true, message: '请输入内容', trigger: 'blur' },
          { min: 3, message: '长度在 3字符以上', trigger: 'blur' }
        ],
        type: [{ required: true, message: '请选类型', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getDynamicAll()
    this.getAllDynamicLength()
  },
  watch: {
    pageSize: function() {
      this.getDynamicAll()
    },
    currentPage: function() {
      this.getDynamicAll()
    },
    total: function() {}
  },
  methods: {
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
      // return y + '-' + MM + '-' + d
    },
    //删除信息
    async handleDelete(item) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // alert(item.pkDynamicId)
        this.axios({
          method: 'post',
          url: 'http://localhost:8081/dynamic/deletion',
          data: {
            id: item.pkDynamicId
          }
        }).then((res) => {
          if (res.data.code == 1) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            let index = this.dynamicList.indexOf(item)
            this.dynamicList.splice(index, 1)
            this.total -= 1
          }
        })
      })
      // })
    },
    // 分页查询所有
    async getDynamicAll() {
      this.data = { currentPage: this.currentPage, pageSize: this.pageSize }
      this.url = '/dynamic/all'
      this.result = await API.init(this.url, this.data, 'post')
      this.dynamicList = this.result.data
      for (let i = 0; i < this.dynamicList.length; i++) {
        console.log(this.dynamicList[i].gmtCreate)
        this.dynamicList[i].gmtCreate = this.formatDate(this.dynamicList[i].gmtCreate)
        this.dynamicList[i].gmtModified = this.formatDate(this.dynamicList[i].gmtModified)
      }

      this.getAllDynamicInfo()
    },
    async getAllDynamicLength() {
      this.data = {}
      this.url = '/dynamic/allDynamic'
      this.result = await API.init(this.url, this.data, 'post')
      this.total = this.result.data
    },
    async getAllDynamicInfo() {
      this.data = {}
      this.url = '/dynamic/allDynamicInfo'
      this.result = await API.init(this.url, this.data, 'post')
      this.dynamicList1 = this.result.data
      for (let i = 0; i < this.dynamicList1.length; i++) {
        this.dynamicList1[i].gmtCreate = this.formatDate(this.dynamicList1[i].gmtCreate)
        this.dynamicList1[i].gmtModified = this.formatDate(this.dynamicList1[i].gmtModified)
      }
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
        this.url = '/comment/deletionBath'
        this.axios({
          method: 'post',
          url: 'http://localhost:8081/comment/deletionBath',
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
    //批量删除
    handleDeleteMul() {
      this.delVisible = true
    },
    async deleteRow() {
      this.data = { field: this.msg.pkDynamicId }
      this.url = '/dynamic/deletionBath'
      this.result = await API.init(this.url, this.data, 'delete')
      if (this.data) {
        this.getDynamicAll()
        this.$message.success('删除成功')
      } else {
        this.$message.error('动态信息删除失败')
      }
      this.delVisible = false //关闭删除提示模态框
    },
    //编辑
    handleUpdate(index, row) {
      this.idx = index
      this.msg = row //每一条数据的记录
      this.updatecenterDialogVisible = true
    },

    //过滤搜索
    filterSearch() {
      // 获取输入框的值
      let search = this.input
      //数组元素按条件过滤
      if (search != '') {
        this.dynamicList = this.dynamicList1.filter((v) => {
          if (JSON.stringify(v).includes(search)) {
            return v
          }
        })
      } else {
        this.getDynamicAll()
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
    // 添加和表单验证
    submitForm(dynamicInfo) {
      this.$refs[dynamicInfo].validate((valid) => {
        if (valid) {
          this.data = {
            userId: this.dynamicInfo.userId,
            content: this.dynamicInfo.content,
            type: this.dynamicInfo.type
          }
          this.url = '/dynamic/insert'
          this.result = API.init(this.url, this.data, 'post')
          this.addcenterDialogVisible = false
          this.$message.success('动态添加成功')
          this.getDynamicAll()
          this.total += 1
          // console.log(this.result.data)
          // this.dynamicList.splice(0, 0, this.result.data)
          // this.axios({
          //   method: 'post',
          //   url: 'http://localhost:8081/dynamic/insert',
          //   data: {
          //     userId: this.dynamicInfo.userId,
          //     content: this.dynamicInfo.content,
          //     type: this.dynamicInfo.type
          //   }
          // }).then((res) => {
          //   if (res.data.code == 1) {
          //     this.$message({
          //       message: '删除成功',
          //       type: 'success'
          //     })
          //     this.addcenterDialogVisible = false
          //     console.log(res.data.data)
          //     this.dynamicList.splice(0, 0, res.data.data)
          //   }
          // })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(dynamicInfo) {
      this.$refs[dynamicInfo].resetFields()
    },
    //刷新数据
    flush() {
      this.getDynamicAll()
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
    }
  }
}
</script>

<style scoped lang="scss">
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

.left {
  float: left;
  width: 60px;
}

.right {
  float: right;
  width: 60px;
}

.bottom {
  clear: both;
  text-align: center;
}

.item {
  margin: 4px;
}

.left .el-tooltip__popper,
.right .el-tooltip__popper {
  padding: 8px 10px;
}
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

.el-icon-edit {
  color: #f7fbff;
}

.el-icon-plus {
  color: #f7fbff;
}

.el-icon-delete {
  color: #f7fbff;
}

.el-icon-download {
  color: #f7fbff;
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
</style>
