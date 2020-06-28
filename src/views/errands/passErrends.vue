<template>
  <div>
    <div class="container">
      <!-- 删除提示框 -->
      <el-dialog class="dialog" :modal="false" title="提示" :visible.sync="batchdelVisible" width="300px" center>
        <div class="del-dialog-cnt">批量删除账号信息后不可恢复，是否确定删除？</div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="batchdelVisible = false">取 消</el-button>
          <el-button type="primary" @click="deleteBatch()">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 删除提示框 -->
      <el-dialog class="dialog" title="提示" :visible.sync="delVisible" width="300px" center :modal="false">
        <div class="del-dialog-cnt">用户信息删除不可恢复，是否确定删除？</div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="delVisible = false">取 消</el-button>
          <el-button type="primary" @click="deleteRow">确 定</el-button>
        </span>
      </el-dialog>
      <div class="header">
        <el-row type="flex" class="ml-20 mt-10">
          <el-select size="mini" v-model="selectValue" placeholder="请选择" class="statu-search ml-10">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-row>
        <el-row class="df-jr-ac ml-20 mt-10">
          <el-button type="danger" icon="el-icon-delete" size="small" @click="delAll()">批量删除</el-button>
        </el-row>
      </div>
      <div class="table" v-show="selectValue === 1 || selectValue === '通过'">
        <div class="tcontainer">
          <el-table
            ref="userId"
            :data="orderList1.slice(start, end)"
            style="width: 100%"
            :default-sort="{ prop: 'oderCreateTime', countOrder: 'descending' }"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column label="工号" prop="jobNumber"> </el-table-column>
            <el-table-column label="姓名" prop="name"> </el-table-column>
            <el-table-column label="联系方式" prop="phoneNumber"> </el-table-column>
            <el-table-column label="订单量" sortable prop="countOrder"> </el-table-column>
                <el-table-column prop="status" label="状态" show-overflow-tooltip min-width="80%">
            <template slot-scope="scope">
              <el-switch @change="changeStatus(scope.row)" v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </template>
          </el-table-column>
            <el-table-column label="审核人" prop="reviewerName"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row.jobNumber)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="block" v-show="selectValue === 1 || selectValue === '通过'">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage4"
          :page-sizes="[5, 15, 30]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="orderList1.length"
        >
        </el-pagination>
      </div>

      <div class="table" v-show="selectValue === 2 || selectValue === '不通过'">
        <div class="tcontainer">
          <el-table
            ref="userId"
            :data="orderList1.slice(start, end)"
            style="width: 100%"
            :default-sort="{ prop: 'oderCreateTime', countOrder: 'descending' }"
          >
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand form">
                  <el-form-item label="订单发起人工号">
                    <span>{{ props.row.jobNumber }}</span>
                  </el-form-item>
                  <el-form-item label="名字">
                    <span>{{ props.row.name }}</span>
                  </el-form-item>
                  <el-form-item label="手机号">
                    <span>{{ props.row.phoneNumber }}</span>
                  </el-form-item>
                  <el-form-item label="状态">
                    <span>{{ props.row.status }}</span>
                  </el-form-item>
                  <el-form-item label="原因">
                    <span>{{ props.row.remark }}</span>
                  </el-form-item>
                  <el-form-item label="身份证"> </el-form-item>
                  <el-form-item> </el-form-item>
                  <el-form-item>
                    <div class="idcard">
                      <img :src="props.row.idCard" alt="" />
                    </div>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>

            <el-table-column label="工号" prop="jobNumber"> </el-table-column>
            <el-table-column label="姓名" prop="name"> </el-table-column>
            <el-table-column label="联系方式" prop="phoneNumber"> </el-table-column>
            <el-table-column label="状态" prop="status"> </el-table-column>
            <el-table-column label="审核人" prop="reviewerName"> </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="block" v-show="selectValue === 2 || selectValue === '不通过'">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage4"
          :page-sizes="[5, 15, 30]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="orderList1.length"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
const API = require('../utils/api.js')
export default {
  data() {
    return {
      multipleSelection: [],
      batchdelVisible: false,
      delVisible: false,
      input: null,
      size: 100,
      options: [
        {
          value: 2,
          label: '不通过'
        },
        {
          value: 1,
          label: '通过'
        }
      ],
      orderList: [], //装数据
      orderList1: [], //CANCAT数据

      selectValue: '通过',

      currentPage4: 0,
      start: 0,
      end: 5,
      pageSize: 5,
      jobnumber: '', //删除工号
      delarr: [] //批量删除数组
    }
  },
  created() {
    //开始显示发布的订单
    this.getFinshOrder(1)
  },

  methods: {
    changeStatus(){
        this.$message.success("修改成功")
    },
    async getFinshOrder(i) {
      if (this.currentPage4 - 1 < 0) {
        this.currentPage4 = 0
      } else {
        this.currentPage4--
      }
      if (this.selectValue === '通过') {
        i = 1
      }
      let data = {
        num: this.currentPage4,
        size: this.size,
        status: i
      }

      let res = await API.init('errends/all/errends', data, 'post')
      if (res.data != null) {
        this.orderList = res.data.order
        for (let i = 0; i < this.orderList.length; i++) {
          if (this.orderList[i].status === 1) {
            this.orderList[i].status = '已通过'
          } else {
            this.orderList[i].status = '未通过'
          }
        }

        this.orderList1 = this.orderList1.concat(this.orderList)
        console.log(this.orderList1)
      } else {
        this.orderList1 = []
      }
    },
    formatDate(value) {
      let date = new Date(value)
      let y = date.getFullYear()
      let MM = date.getMonth() + 1
      MM = MM < 10 ? '0' + MM : MM
      let d = date.getDate()
      d = d < 10 ? '0' + d : d
      return y + '年' + MM + '月' + d + '日'
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    async deleteBatch() {
      this.data = { reqId: this.multipleSelection }
      this.url = '/errends/delete/errends'
      this.result = await API.init(this.url, this.data, 'post')
      if (this.result.data === null) {
        this.orderList1.splice(this.orderList1.indexOf(this.jobnumber), 1)
        this.$message.success('批量删除成功')
      } else {
        this.$message.error('批量删除失败')
      }

      this.batchdelVisible = false //关闭删除提示模态框},
    },
    delAll() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择要删除用户')
      } else {
        this.batchdelVisible = true //显示删除弹框

        const length = this.multipleSelection.length
        for (let i = 0; i < length; i++) {
          this.delarr.push(this.multipleSelection[i].pkUserAccountId)
        }
      }
    },
    handleSizeChange(val) {
      this.size = val
      this.end = this.size
    },
    handleCurrentChange(val) {
      this.currentPage4 = val
      if (this.orderList.length === this.size) {
        if (this.currentPage4 >= parseInt(this.orderList1.length / this.pageSize) + 1) {
          this.end = this.pageSize * this.currentPage4
          this.start = this.end - this.pageSize
          this.currentPage4 = parseInt(this.orderList1.length / this.size) + 1
          this.getFinshOrder(this.selectValue)
          this.currentPage4 = val
        }
        this.end = this.pageSize * this.currentPage4
        this.start = this.end - this.pageSize
      } else {
        this.end = this.pageSize * this.currentPage4
        this.start = this.end - this.pageSize
      }
    },
    /**编辑 */
    handleEdit(index, row) {
      console.log(index, row)
    },

    /**删除 */
    handleDelete(index, job) {
      this.delVisible = true
      console.log(this.batchdelVisible)
      console.log(index, job)
      this.multipleSelection = []
      this.multipleSelection.push(job)
      console.log(this.multipleSelection)
      this.jobnumber = job
    },
    async deleteRow() {
      this.data = { reqId: this.multipleSelection }
      this.url = '/errends/delete/errends'
      this.result = await API.init(this.url, this.data, 'post')
      if (this.result.data === null) {
        this.orderList1.splice(this.orderList1.indexOf(this.jobnumber), 1)
        this.$message.success('删除成功')
      } else {
        this.$message.error('删除失败')
      }

      this.delVisible = false //关闭删除提示模态框
    }
  },
  watch: {
    selectValue: function() {
      console.log(this.selectValue)
      this.orderList1 = []
      this.getFinshOrder(this.selectValue)
    }
  }
}
</script>

<style scoped lang="scss">
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.container {
  width: 100%;
}
.header {
  display: flex;
}

.table {
  display: flex;

  align-items: center;
  justify-content: center;
}
.tcontainer {
  width: 100%;
}
.form {
  margin-left: 10%;
}
.idcard {
  width: 300px;
  height: 200px;
  border: black solid 1px;
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
