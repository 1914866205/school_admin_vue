<template>
  <div style="width:100%">
    <el-row type="flex" class="ml-20 mt-10">
      <el-input size="mini" v-model="input" clearable placeholder="请输入内容" class="blur-search" @input="filterSearch()"></el-input>
      <el-select size="mini" v-model="selectValue" placeholder="请选择" class="statu-search ml-10">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
      </el-select>
      <el-button type="success" size="mini" class="ml-10" icon="el-icon-search">搜索</el-button>
    </el-row>
    <el-row class="df-jr-ac ml-20 mt-10">
      <el-col class="tl">
        <el-button type="danger" icon="el-icon-delete" @click="handleDeleteMul" size="mini">
          <span class="light-font-color" @click="delAll()">批量删除</span>
        </el-button>
        <el-button type="warning" icon="el-icon-download" disabled size="mini">
          <span class="light-font-color">导出</span>
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col class="ml-20 mt-10">
        <el-table
          :data="comments"
          style="width: 100%;margin-bottom: 20px;"
          row-key="commentId"
          border
          default-expand-all
          :tree-props="{ children: 'replyCommentList', hasChildren: 'hasChildren' }"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" min-width="10%"> </el-table-column>
          <el-table-column prop="commentId" label="评论id" min-width="12%"> </el-table-column>
          <el-table-column prop="userId" label="用户id" min-width="12%"> </el-table-column>
          <el-table-column prop="content" label="评论" min-width="12%"> </el-table-column>
          <el-table-column prop="gmtCreate" label="创建时间" min-width="12%"> </el-table-column>
          <el-table-column label="操作" show-overflow-tooltip min-width="8%">
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
        :page-sizes="[10, 20]"
        :page-size="currentPageSize"
        layout="total, prev, pager, next, sizes"
        :total="allComments.length"
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
  name: 'Collection',
  data() {
    return {
      searchs: {
        statu: ''
      },
      selectValue: '',
      start: 0,
      blurSearch: '',
      currentPage: 0,
      total: 0,
      pageSize: 10,
      searchShow: true,
      updatecenterDialogVisible: false,
      addcenterDialogVisible: false,
      datailcenterDialogVisible: false,
      delVisible: false, //删除提示弹框的状态
      batchdelVisible: false, //批量删除提示弹框的状态
      multipleSelection: [],
      delarr: [], //存放删除的数据
      input: '',
      gmtTime: '',
      end: 10,
      msg: '', //记录每一条的信息，便于取id
      allComments: [],
      comments: [],
      replyCommentList: []
    }
  },
  components: {},
  created() {
    this.getCommentAll()
  },
  watch: {
    pageSize: function() {
      this.getCommentAll()
    },
    currentPage: function() {
      this.getCommentAll()
    },
    total: function() {}
  },
  mounted() {},
  methods: {
    // 分页查询所有
    async getCommentAll() {
      this.data = { currentPage: this.currentPage, pageSize: this.pageSize }
      this.url = '/comment/all'
      this.result = await API.init(this.url, this.data, 'post')
      this.comments = this.result.data
      for (let i = 0; i < this.comments.length; i++) {
        console.log(this.comments[i].gmtCreate)
        this.comments[i].gmtCreate = this.formatDate(this.comments[i].gmtCreate)
        for (let j = 0; j < this.comments[i].replyCommentList.length; j++) {
          this.comments[i].replyCommentList[j].gmtCreate = this.formatDate(this.comments[i].replyCommentList[j].gmtCreate)
        }
      }
      this.getAll()
    },
    async getAll() {
      this.data = {}
      this.url = '/comment/allComments'
      this.result = await API.init(this.url, this.data, 'post')
      this.allComments = this.result.data
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
      // return y + '-' + MM + '-' + d
    },
    //删除信息
    // eslint-disable-next-line no-unused-vars
    async handleDelete(item) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios({
          method: 'post',
          url: 'http://localhost:8081/comment/deletion',
          data: {
            id: item.commentId
          }
        }).then((res) => {
          if (res.data.code == 1) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            let index = this.comments.indexOf(item)
            this.comments.splice(index, 1)
          }
        })
      })
      // })
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
    }, //改变页的数据条数
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
  },
  computed: {}
}
</script>

<style scoped lang="scss">
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
