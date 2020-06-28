<template>
  <div>
    <div class="container">
      <div class="header">
        <el-row type="flex" class="ml-20 mt-10">
          <el-input v-model="input" clearable placeholder="请输入内容" class="blur-search" size="mini"></el-input>
          <el-select size="mini" v-model="selectValue" placeholder="请选择" class="statu-search ml-10">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
          <el-button type="success" size="mini" class="ml-10" icon="el-icon-search" @click="searchOrder">搜索</el-button>
        </el-row>
      </div>
      <div class="table" v-show="search === 1">
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
                  <el-form-item label="订单ID">
                    <span>{{ props.row.id }}</span>
                  </el-form-item>
                  <el-form-item label="订单发起人工号">
                    <span>{{ props.row.founderId }}</span>
                  </el-form-item>
                  <el-form-item label="送件人名字">
                    <span>{{ props.row.founderName }}</span>
                  </el-form-item>
                  <el-form-item label="送件人手机号">
                    <span>{{ props.row.founderPhonenumber }}</span>
                  </el-form-item>
                  <el-form-item label="收件人名字">
                    <span>{{ props.row.receiverName }}</span>
                  </el-form-item>
                  <el-form-item label="收件人手机号">
                    <span>{{ props.row.receiverPhoneNumber }}</span>
                  </el-form-item>
                  <el-form-item label="商品分类">
                    <span>{{ props.row.type }}</span>
                  </el-form-item>
                  <el-form-item label="商品价格范围">
                    <span>{{ props.row.priceRange }}</span>
                  </el-form-item>
                  <el-form-item label="出发地">
                    <span>{{ props.row.originAddress }}</span>
                  </el-form-item>
                  <el-form-item label="目的地">
                    <span>{{ props.row.destination }}</span>
                  </el-form-item>
                  <el-form-item label="订单创建时间">
                    <span>{{ props.row.oderCreateTime }}</span>
                  </el-form-item>
                  <el-form-item label="订单送出时间">
                    <span>{{ props.row.deliveryTime }}</span>
                  </el-form-item>
                  <el-form-item label="订单金额">
                    <span>{{ props.row.amount }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="订单ID" prop="id"> </el-table-column>
            <el-table-column label="订单发起人" prop="founderName"> </el-table-column>
            <el-table-column label="联系方式" prop="founderPhonenumber"> </el-table-column>
            <el-table-column label="金额" sortable prop="amount"> </el-table-column>
            <el-table-column label="订单创建时间" prop="oderCreateTime" sortable> </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="block" v-show="search === 1">
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

      <div class="table" v-show="search === 2">
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
                  <el-form-item label="订单ID">
                    <span>{{ props.row.id }}</span>
                  </el-form-item>
                  <el-form-item label="订单发起人工号">
                    <span>{{ props.row.founderId }}</span>
                  </el-form-item>
                  <el-form-item label="送件人名字">
                    <span>{{ props.row.founderName }}</span>
                  </el-form-item>
                  <el-form-item label="送件人手机号">
                    <span>{{ props.row.founderPhonenumber }}</span>
                  </el-form-item>
                  <el-form-item label="收件人名字">
                    <span>{{ props.row.receiverName }}</span>
                  </el-form-item>
                  <el-form-item label="收件人手机号">
                    <span>{{ props.row.receiverPhoneNumber }}</span>
                  </el-form-item>
                  <el-form-item label="商品分类">
                    <span>{{ props.row.type }}</span>
                  </el-form-item>
                  <el-form-item label="商品价格范围">
                    <span>{{ props.row.priceRange }}</span>
                  </el-form-item>
                  <el-form-item label="出发地">
                    <span>{{ props.row.originAddress }}</span>
                  </el-form-item>
                  <el-form-item label="目的地">
                    <span>{{ props.row.destination }}</span>
                  </el-form-item>
                  <el-form-item label="订单创建时间">
                    <span>{{ props.row.oderCreateTime }}</span>
                  </el-form-item>
                  <el-form-item label="订单送出时间">
                    <span>{{ props.row.deliveryTime }}</span>
                  </el-form-item>
                  <el-form-item label="订单金额">
                    <span>{{ props.row.amount }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="订单ID" prop="id"> </el-table-column>
            <el-table-column label="订单发起人" prop="founderName"> </el-table-column>
            <el-table-column label="联系方式" prop="founderPhonenumber"> </el-table-column>
            <el-table-column label="金额" sortable prop="amount"> </el-table-column>
            <el-table-column label="订单创建时间" prop="oderCreateTime" sortable> </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="block" v-show="search === 2">
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
      input: '',
      size: 100,

      options: [
        {
          value: 0,
          label: '发布'
        },
        {
          value: 3,
          label: '完成  '
        },
        {
          value: 2,
          label: '进行'
        },
        {
          value: 1,
          label: '取消'
        }
      ],
      orderList: [], //装数据
      orderList1: [], //CANCAT数据
      commodity: [],
      selectValue: '发布',

      currentPage4: 0,
      start: 0,
      end: 5,
      pageSize: 5,
      search: 1
    }
  },
  created() {
    //开始显示发布的订单
    this.getFinshOrder(0)
  },

  methods: {
    async getFinshOrder(i) {
      if (this.currentPage4 - 1 < 0) {
        this.currentPage4 = 0
      } else {
        this.currentPage4--
      }
      if (this.selectValue === '发布') {
        i = 0
      }
      let data = {
        num: this.currentPage4,
        size: this.size,
        status: i
      }
      let res = await API.init('errends/serach/differentOrder', data, 'post')
      this.orderList = res.data.order
      for (let i = 0; i < this.orderList.length; i++) {
        this.orderList[i].oderCreateTime = this.formatDate(this.orderList[i].oderCreateTime)
        this.orderList[i].deliveryTime = this.formatDate(this.orderList[i].deliveryTime)
      }
      this.orderList1 = this.orderList1.concat(this.orderList)
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
    async searchOrder() {
      this.search = 2
      if (this.input === '') {
        console.log(null)
      } else {
        let data = {
          currentPage: 0,
          size: this.size,
          founderId: this.input
        }
        let res = await API.init('errends/search/getOrder', data, 'post')
        this.orderList1 = []
        this.orderList = res.data
        for (let i = 0; i < this.orderList.length; i++) {
          this.orderList[i].oderCreateTime = this.formatDate(this.orderList[i].oderCreateTime)
          this.orderList[i].deliveryTime = this.formatDate(this.orderList[i].deliveryTime)
        }
        this.orderList1 = this.orderList1.concat(this.orderList)
      }
    }
  },
  watch: {
    selectValue: function() {
      console.log(this.selectValue)
      this.search = 1
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
</style>
