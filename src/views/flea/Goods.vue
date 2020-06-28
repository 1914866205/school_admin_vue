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
          :data="goodsShow"
          tooltip-effect="dark"
          style="width: 100%;"
          :stripe="true"
          @selection-change="handleSelectionChange"
        >
          <el-table-column prop="pkFleaGoodsId" type="selection" min-width="5%"></el-table-column>
          <el-table-column label="商品名" min-width="10%" show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.goodsName }}</template>
          </el-table-column>
          <el-table-column prop="goodsMark" label="商品标签" min-width="15%"></el-table-column>
          <el-table-column prop="goodsPrice" label="商品价格" min-width="15%"></el-table-column>
          <el-table-column prop="typeName" label="所属分类" min-width="15%"></el-table-column>
          <el-table-column prop="username" label="卖家昵称" min-width="15%"></el-table-column>
          <el-table-column prop="goodsDescription" label="商品信息" show-overflow-tooltip min-width="15%">
            <template slot-scope="scope">{{ scope.row.goodsDescription }}</template>
          </el-table-column>
          <el-table-column prop="orderCreateTime" label="创建时间" show-overflow-tooltip min-width="15%">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span>{{ goodsShow[scope.$index].goodsCreateTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" show-overflow-tooltip min-width="10%">
            <template slot-scope="scope">
              <p v-if="goodsShow[scope.$index].isDeleted == 0" style="color: blue">已下单</p>
              <p v-if="goodsShow[scope.$index].isDeleted == 1" style="color: red">已删除</p>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" show-overflow-tooltip min-width="10%">
            <template slot-scope="scope">
              <el-button
                v-if="goodsShow[scope.$index].isDeleted == 0"
                icon="el-icon-delete"
                @click="handleDelete(scope.$index, scope.row)"
                type="danger"
                size="small"
                >删除</el-button
              >
              <el-button
                v-if="goodsShow[scope.$index].isDeleted == 1"
                icon="el-icon-delete"
                @click="handleDelete(scope.$index, scope.row)"
                type="danger"
                size="small"
                disabled
                >删除</el-button
              >
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
          <div class="del-dialog-cnt">您只可以下架商品，您确定下架吗？</div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="delVisible = false">取 消</el-button>
            <el-button type="primary" @click="deleteOne">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="batchDelVisible" width="300px" center>
          <div class="del-dialog-cnt">您只可以下架商品，您确定批量下架吗</div>
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
  name: 'Goods',
  data() {
    return {
      currentPage: 1,
      total: 0, //总记录数
      pageSize: 10,
      goodsShow: [],
      goodsAll: [],
      goodsId: [],
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
    this.getGoodsAll()
  },
  mounted() {},
  methods: {
    async getGoodsAll() {
      let data = {
        //此处需要减一
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      let res = await apiPost('/flea/goods/all', data)
      this.goodsAll = res.data.content
      this.total = res.data.totalElements
      //需要清除一下原显示
      this.goodsShow = []
      this.goodsShow = this.goodsShow.concat(JSON.parse(JSON.stringify(this.goodsAll))) //拷贝数组
      for (let i = 0; i < this.goodsShow.length; i++) {
        this.goodsShow[i].goodsCreateTime = this.formatDate(this.goodsShow[i].goodsCreateTime)
        console.log(this.goodsShow[i].goodsCreateTime)
      }
    },
    //过滤搜索
    filterSearch() {
      // 获取输入框的值
      let search = this.input
      //数组元素按条件过滤
      console.log('输入的关键字的为：' + search)
      this.goodsShow = this.goodsAll.filter((v) => {
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
        pkFleaGoodsId: this.msg.pkFleaGoodsId
      }
      console.log(data)
      // console.log(data.fleaRewardId.get[0])
      // let data1 = {
      //   pkFleaOrderId: data.pkFleaOrderId[0]
      // }
      // alert('要删除的订单id：' + data.pkFleaOrderId)
      await apiPost('flea/goods/logicalDel', data)
      this.getGoodsAll()
      this.delVisible = false
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.goodsId.toggleRowSelection(row)
        })
      } else {
        this.$refs.goodsId.clearSelection()
      }
    },
    //多选信息
    handleSelectionChange(val) {
      console.log(val)
      let ids = []
      for (let i = 0; i < val.length; i++) {
        ids.push(val[i].pkFleaGoodsId)
      }
      this.goodsId = ids
    },
    //确定批量删除
    async batchDelete() {
      let data1 = {
        id: this.goodsId
      }
      console.log(data1)
      await apiPost('flea/goods/batchLogical', data1)
      this.getGoodsAll()
      this.batchDelVisible = false
      this.goodsId = []
    }
  },
  computed: {},
  watch: {
    pageSize: function() {
      this.getGoodsAll()
    },
    currentPage: function() {
      this.getGoodsAll()
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
