<template>
  <div style="width: 100%">
    <el-row type="flex" class="ml-20 mt-10">
      <el-input size="mini" v-model="input" placeholder="请输入内容" class="blur-search" @input="filterSearch()"></el-input>
      <el-button type="success" size="mini" class="ml-10" icon="el-icon-search">搜索</el-button>
      <el-button type="danger" icon="el-icon-delete" size="small" @click="delAll()">批量删除</el-button>
    </el-row>
    <el-row>
      <el-col span="1"></el-col>
      <el-col span="23" class="ml-20 mt-10">
        <el-table
          ref="fleaOrder"
          :data="commentShow"
          tooltip-effect="dark"
          style="width: 100%;"
          :stripe="true"
          @selection-change="handleSelectionChange"
        >
          <el-table-column prop="commentId" type="selection" min-width="5%"></el-table-column>
          <el-table-column label="评论人" min-width="10%" show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.commentByName }}</template>
          </el-table-column>
          <el-table-column prop="reviwerName" label="回复人" min-width="15%"></el-table-column>
          <el-table-column prop="title" label="评论帖标题" min-width="15%"></el-table-column>
          <el-table-column prop="comment" label="评论内容" show-overflow-tooltip min-width="15%">
            <template slot-scope="scope">{{ scope.row.comment }}</template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip min-width="15%">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span>{{ commentShow[scope.$index].createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" show-overflow-tooltip min-width="10%">
            <template slot-scope="scope">
              <el-button icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)" type="danger" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block" style="margin-top:2%">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 15, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
        <!-- 删除提示框 -->
        <el-dialog class="dialog" title="提示" :visible.sync="delVisible" width="300px" center :modal="false">
          <div class="del-dialog-cnt">建议您仅删除违规评论，您确定删除吗？</div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="delVisible = false">取 消</el-button>
            <el-button type="primary" @click="deleteOne">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="batchDelVisible" width="300px" center>
          <div class="del-dialog-cnt">建议您仅删除违规评论，您确定批量删除吗</div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="delVisible = false">取 消</el-button>
            <el-button type="primary" @click="batchDelete()">确 定</el-button>
          </span>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { apiPost } from '../utils/api'
export default {
  name: 'Comment',
  data() {
    return {
      currentPage: 1,
      total: 0, //总记录数
      pageSize: 10,
      commentShow: [],
      commentAll: [],
      commentsId: [],
      delVisible: false, //删除提示弹框的状态
      multipleSelection: [], //多选的数据
      input: '',
      batchDelVisible: false,
      index: '',
      msg: ''
    }
  },
  components: {},
  created() {
    this.getCommentAll()
  },
  mounted() {},
  methods: {
    async getCommentAll() {
      let data = {
        //此处需要减一
        currentPage: this.currentPage - 1,
        pageSize: this.pageSize
      }
      let res = await apiPost('/flea/comment/all', data)
      this.commentAll = res.data.content
      this.total = res.data.totalElements
      //需要清除一下原显示
      this.commentShow = []
      this.commentShow = this.commentShow.concat(JSON.parse(JSON.stringify(this.commentAll))) //拷贝数组
      for (let i = 0; i < this.commentShow.length; i++) {
        this.commentShow[i].createTime = this.formatDate(this.commentShow[i].createTime)
        console.log(this.commentShow[i].createTime)
      }
    },
    //过滤搜索
    filterSearch() {
      // 获取输入框的值
      let search = this.input
      //数组元素按条件过滤
      console.log('输入的关键字的为：' + search)
      this.commentShow = this.commentAll.filter((v) => {
        // console.log(JSON.stringify(v))
        if (JSON.stringify(v).includes(search)) {
          return v
        }
      })
    },
    //格式化时间
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
    //当前页展示数据
    handleSizeChange: function(pageSize) {
      this.pageSize = pageSize
    },
    //当前页
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage
    },
    //单行删除
    handleDelete(index, row) {
      this.index = index
      this.msg = row //每一条数据的记录
      // this.orderId.push(row.pkFleaOrderId) //把单行删除的每条数据的id添加进放删除数据的数组
      this.delVisible = true
    },
    //批量删除
    delAll() {
      this.batchDelVisible = true //显示删除弹框
    },
    //确定单行删除
    async deleteOne() {
      let data = {
        commentId: this.msg.commentId
      }
      console.log(data)
      // console.log(data.fleaRewardId.get[0])
      // let data1 = {
      //   pkFleaOrderId: data.pkFleaOrderId[0]
      // }
      // alert('要删除的订单id：' + data.pkFleaOrderId)
      await apiPost('flea/comment/del', data)
      this.getCommentAll()
      this.delVisible = false
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.commentsId.toggleRowSelection(row)
        })
      } else {
        this.$refs.commentsId.clearSelection()
      }
    },
    //多选信息
    handleSelectionChange(val) {
      console.log(val)
      let ids = []
      for (let i = 0; i < val.length; i++) {
        ids.push(val[i].commentId)
      }
      this.commentsId = ids
    },
    //确定批量删除
    async batchDelete() {
      let data1 = {
        id: this.commentsId
      }
      console.log(data1)
      await apiPost('flea/comment/batchDel', data1)
      this.getCommentAll()
      this.batchDelVisible = false
      this.commentsId = []
    }
  },
  computed: {},
  watch: {
    pageSize: function() {
      this.getCommentAll()
    },
    currentPage: function() {
      this.getCommentAll()
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  padding-left: 20px;
  display: flex;
  flex-direction: column;
}
.tab-header {
  margin: 20px;
  .input {
    width: 400px;
    margin-right: 69%;
  }
}
.header-row {
  margin: 20px;
  .input {
    width: 400px;
    margin-right: 20px;
    margin-left: -53%;
  }
}
.table {
  padding-left: 10px;
}
.del {
  background-color: red;
  color: aliceblue;
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
