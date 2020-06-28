<template>
  <div>
    <div class="container">
      <div class="header">
        <el-row type="flex" class="ml-20 mt-10">
          <el-input v-model="input" clearable placeholder="请输入内容" class="blur-search" size="mini" @input="filterSearch()"></el-input>
          <el-button type="success" size="mini" class="ml-10" icon="el-icon-search">搜索</el-button>
        </el-row>
      </div>
      <div class="table">
        <div class="tcontainer">
          <el-table
            ref="userId"
            :data="orderList1.slice(start, end)"
            style="width: 100%"
            :default-sort="{ prop: 'oderCreateTime', order: 'descending' }"
          >
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand form">
                  <el-form-item label="申请ID：">
                    <span>{{ props.row.id }}</span>
                  </el-form-item>
                  <el-form-item label="订单发起人工号">
                    <span>{{ props.row.requesterId }}</span>
                  </el-form-item>
                  <el-form-item label="名字">
                    <span>{{ props.row.requesterName }}</span>
                  </el-form-item>
                  <el-form-item label="手机号">
                    <span>{{ props.row.requesterPhonenumber }}</span>
                  </el-form-item>                  
                  <el-form-item label="状态">
                    <span>{{ props.row.status }}</span>
                  </el-form-item>
                  <el-form-item label="发起时间">
                    <span>{{ props.row.gmtCreate }}</span>
                  </el-form-item>

                  <el-form-item>
                    <div class="idcard">
                      <img :src="props.row.idCardFront" alt="" />
                    </div>
                  </el-form-item>
                  <el-form-item>
                    <div class="idcard">
                      <img :src="props.row.idCardBack" alt="" />
                    </div>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="申请ID" prop="id"> </el-table-column>
            <el-table-column label="订单发起人id" prop="requesterId"> </el-table-column>
            <el-table-column label="订单发起人" prop="requesterName"> </el-table-column>
            <el-table-column label="状态" prop="status"> </el-table-column>
            <el-table-column label="申请发起时间" prop="gmtCreate" sortable> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.$index, scope.row.requesterId, scope.row.requesterName)">审核</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="block">
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
    <div class="dialog" v-if="auditfrom === 1">
      <div class="dialog-form">
        <div class="fromc">
          <el-form ref="form" :model="form" label-width="100px" size="mini">
            <el-form-item label="审核人工号">
              {{ reviewer.sysUserPhoneNumber }}
            </el-form-item>
            <el-form-item label="审核人名字">
              <span>{{ reviewer.sysUserName }}</span>
            </el-form-item>
            <el-form-item label="申请人账号">
              {{ user.requestId }}
            </el-form-item>
            <el-form-item label="申请人名字">
              <span>{{ user.name }}</span>
            </el-form-item>
            <el-form-item label="是否通过">
              <el-radio-group v-model="form.delivery">
                <el-radio :label="1">通过</el-radio>
                <el-radio :label="2">不通过</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="原因">
              <el-input type="textarea" v-model="form.desc"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="audit()">确认</el-button>
              <el-button @click="auditfrom = 0">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
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
      input: '',
      size: 100,
      orderList: [], //装数据
      orderList1: [], //CANCAT数据
      commodity: [],
      currentPage4: 0,
      start: 0,
      end: 5,
      pageSize: 5,
      auditfrom: 0,
      form: {
        delivery: 1,
        desc: '',
        auditId: '',
        userId: ''
      },
      user: {
        requestId: '',
        name: ''
      },
      index: 0,
      reviewer: JSON.parse(localStorage.getItem('user'))
    }
  },
  created() {
    //开始显示发布的订单
    this.getFinshOrder(0)
  },

  methods: {
    async getFinshOrder(i) {
      this.orderList = []
      this.orderList1 = []
      if (this.currentPage4 - 1 < 0) {
        this.currentPage4 = 0
      } else {
        this.currentPage4--
      }

      let data = {
        num: this.currentPage4,
        size: this.size,
        status: i
      }
      let res = await API.init('errends/nopass/errends', data, 'post')
      this.orderList = res.data.order
      console.log(this.orderList)
      for (let i = 0; i < this.orderList.length; i++) {
        this.orderList[i].gmtCreate = this.formatDate(this.orderList[i].gmtCreate)
        console.log(this.orderList[i].status)
        this.orderList[i].status = '发布'
      }
      this.orderList1 = this.orderList1.concat(this.orderList)
    },
    /**
     * 审核
     */
    async audit() {
      let data = {
        remark: this.form.desc,
        founderId: this.user.requestId,
        reviewerId: this.reviewer.sysUserPhoneNumber,
        stauts: this.form.delivery
      }
      console.log(this.index)

      let res = await API.init('errends/Errends', data, 'post')
      this.orderList1.splice(this.index, 1)
      console.log(this.orderList1)
      console.log(res)
      this.auditfrom = 0
      this.$message.success("审核成功")
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
    handleEdit(index, reid, name) {
      this.index = index
      console.log(this.index)
      this.user.requestId = reid
      this.user.name = name
      console.log(this.reviewer)
      this.auditfrom = 1
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
/* 遮罩层 */
.dialog-form {
  border-radius: 5px;
  background-color: white;

  width: 40%;
  height: 50%;
}
.fromc {
  margin-top: 50px;
  margin-left: 50px;
  justify-content: center;
  width: 80%;
  height: 80%;
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
