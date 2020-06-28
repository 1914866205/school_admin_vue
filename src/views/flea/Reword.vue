<template>
  <div style="width:100%">
    <el-row type="flex" class="ml-20 mt-10">
      <el-input size="mini" v-model="input" placeholder="请输入内容" class="blur-search" @input="filterSearch()"></el-input>
      <el-button type="success" size="mini" class="ml-10" icon="el-icon-search">搜索</el-button>
      <el-button type="danger" icon="el-icon-delete" size="small" @click="delAll()">批量删除</el-button>
    </el-row>
    <el-row>
      <el-col span="1"></el-col>
      <el-col span="23" class="ml-20 mt-10">
        <el-table
          ref="fleaReward"
          :data="rewardShow"
          tooltip-effect="dark"
          style="width: 100%;"
          stripe="true"
          @selection-change="handleSelectionChange"
        >
          <el-table-column prop="pkFleaRewardId" type="selection" min-width="5%"></el-table-column>
          <el-table-column label="标题" min-width="10%" show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.title }}</template>
          </el-table-column>
          <el-table-column prop="description" label="悬赏描述" show-overflow-tooltip min-width="15%">
            <template slot-scope="scope">
              {{ scope.row.description }}
            </template>
          </el-table-column>
          <el-table-column prop="nickname" label="发布人昵称" show-overflow-tooltip min-width="15%"> </el-table-column>
          <el-table-column prop="sex" label="性别" min-width="15%"> </el-table-column>
          <el-table-column prop="username" label="发布人姓名" min-width="15%"> </el-table-column>
          <el-table-column prop="createTime" label="发布时间" show-overflow-tooltip min-width="15%">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span>{{ rewardShow[scope.$index].createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" show-overflow-tooltip min-width="10%">
            <template slot-scope="scope">
              <p v-if="rewardShow[scope.$index].isDeleted == 0" style="color: blue">已发布</p>
              <p v-if="rewardShow[scope.$index].isDeleted == 1" style="color: red">已撤销</p>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" show-overflow-tooltip min-width="10%">
            <template slot-scope="scope">
              <el-button
                v-if="rewardShow[scope.$index].isDeleted == 0"
                icon="el-icon-delete"
                @click="handleDelete(scope.$index, scope.row)"
                type="danger"
                size="small"
              >
                删除
              </el-button>
              <el-button
                v-if="rewardShow[scope.$index].isDeleted == 1"
                icon="el-icon-delete"
                @click="handleDelete(scope.$index, scope.row)"
                type="danger"
                size="small"
                disabled
              >
                删除
              </el-button>
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
          >
          </el-pagination>
        </div>
        <!-- 删除提示框 -->
        <el-dialog class="dialog" title="提示" :visible.sync="delVisible" width="300px" center :modal="false">
          <div class="del-dialog-cnt">建议您仅删除违规订单，您确定删除吗？</div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="delVisible = false">取 消</el-button>
            <el-button type="primary" @click="deleteOne">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="batchDelVisible" width="300px" center>
          <div class="del-dialog-cnt">建议您仅删除违规订单，您确定批量删除吗</div>
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
  name: 'Reword',
  data() {
    return {
      currentPage: 1,
      total: 0, //总记录数
      pageSize: 10,
      delVisible: false, //删除提示弹框的状态
      multipleSelection: [], //多选的数据
      batchDelVisible: false,
      rewardShow: [],
      rewardAll: [],
      rewardId: [],
      input: '',
      index: '',
      msg: ''
    }
  },
  components: {},
  created() {
    this.getRewardAll()
  },
  mounted() {},
  methods: {
    async getRewardAll() {
      let data = {
        //此处需要减一
        currentPage: this.currentPage - 1,
        pageSize: this.pageSize
      }
      console.log(data)
      let res = await apiPost('/flea/reward/all', data)
      this.rewardAll = res.data.content
      this.total = res.data.totalElements
      console.log(this.rewardAll)
      //需要清除一下原显示
      this.rewardShow = []
      this.rewardShow = this.rewardShow.concat(JSON.parse(JSON.stringify(this.rewardAll))) //拷贝数组
      // let len = this.userShow.length
      // this.total = len
      // console.log('len' + len)
      console.log('total' + this.total)
      for (let i = 0; i < this.rewardShow.length; i++) {
        this.rewardShow[i].createTime = this.formatDate(this.rewardShow[i].createTime)
      }
    },
    //过滤搜索
    filterSearch() {
      // 获取输入框的值
      let search = this.input
      //数组元素按条件过滤
      console.log('输入的关键字的为：' + search)
      this.rewardShow = this.rewardAll.filter((v) => {
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
      // this.rewardId.push(row.pkFleaRewardId) //把单行删除的每条数据的id添加进放删除数据的数组
      this.delVisible = true
    },
    //批量删除
    delAll() {
      this.batchDelVisible = true //显示删除弹框
    },
    //多选信息
    handleSelectionChange(val) {
      let ids = []
      for (let i = 0; i < val.length; i++) {
        ids.push(val[i].pkFleaRewardId)
      }
      this.rewardId = ids
    },
    //确定单行删除
    async deleteOne() {
      let data = {
        fleaRewardId: this.msg.pkFleaRewardId
      }
      console.log(data)
      // console.log(data.fleaRewardId.get[0])
      // let data1 = {
      //   fleaRewardId: data.fleaRewardId[0]
      // }
      // alert('要下架的悬赏id：' + data)
      await apiPost('flea/reward/deleteOne', data)
      this.getRewardAll()
      this.delVisible = false
    },
    //确定批量删除
    async batchDelete() {
      let data = {
        id: this.rewardId
      }
      console.log(data)
      await apiPost('flea/reward/batchDelete', data)
      this.getRewardAll()
      this.batchDelVisible = false
    }
  },
  computed: {},
  watch: {
    pageSize: function() {
      this.getRewardAll()
    },
    currentPage: function() {
      this.getRewardAll()
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
  color: white;
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
