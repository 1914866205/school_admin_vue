<template>
  <div class="container">
    <div class="tab-header">
      <el-row class="header-row">
        <el-input class="input" placeholder="请输入内容" v-model="input" clearable @input="filterSearch"></el-input>
        <el-button size="medium" type="success" @click="findUserByContent">查询</el-button>
      </el-row>
    </div>
    <div class="table">
      <el-table ref="userId" :data="userShow" @selection-change="handleSelectionChange">
        <el-table-column prop="nickname" label="昵称 " width="190%"> </el-table-column>
        <el-table-column prop="username" label="用户名 " width="190%"> </el-table-column>
        <el-table-column prop="phoneNumber" label="手机号 " width="250%"> </el-table-column>
        <el-table-column prop="sex" label="性别" width="190%"> </el-table-column>
        <el-table-column prop="jobNumber" label="学号" width="240%"> </el-table-column>
        <el-table-column prop="isDeleted" label="删除标志 " width="170%"> </el-table-column>
      </el-table>
    </div>
    <div style="margin-top:2%">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 15, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
const API = require('../utils/api.js')
export default {
  name: 'User',
  data() {
    return {
      currentPage: 1, //此处为1，后台处理
      total: 40, //总记录数
      pageSize: 5,
      userShow: [],
      userAll: [],
      userId: [],
      input: ''
    }
  },
  components: {},
  created() {
    this.getAllUser()
  },
  mounted() {},
  methods: {
    async getAllUser() {
      // if (this.currentPage - 1 < 0) {
      //   this.currentPage = 0
      // } else {
      //   this.currentPage--
      // }

      let data = {
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      console.log(data)
      let res = await API.init('/flea/user/all', data, 'post')
      console.log(res)
      this.userAll = []
      this.userAll = res.data.content
      this.total = res.data.total
      console.log(this.userAll)
      //需要清除一下原显示
      this.userShow = []
      this.userShow = this.userShow.concat(JSON.parse(JSON.stringify(this.userAll))) //拷贝数组
      for (let i = 0; i < this.userShow.length; i++) {
        if (!this.userShow[i].isDeleted) {
          this.userShow[i].isDeleted = '启用'
        } else {
          this.userShow[i].isDeleted = '禁用'
        }
      }
    },
    async findUserByContent() {
      if (this.currentPage - 1 < 0) {
        this.currentPage = 0
      } else {
        this.currentPage--
      }

      let data = {
        content: this.input,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      console.log(data)
      let res = await API.init('/flea/user/find', data, 'post')
      this.userAll = res.data.content
      console.log(this.userAll)
      //需要清除一下原显示
      this.userShow = []
      this.userShow = this.userShow.concat(JSON.parse(JSON.stringify(this.userAll))) //拷贝数组
      let len = this.userShow.length
      this.total = len
      console.log('len' + len)
      console.log('total' + this.total)
      for (let i = 0; i < this.userShow.length; i++) {
        if (!this.userShow[i].isDeleted) {
          this.userShow[i].isDeleted = '启用'
        } else {
          this.userShow[i].isDeleted = '禁用'
        }
      }
    },
    //过滤搜索
    filterSearch() {
      // 获取输入框的值
      let search = this.input
      //数组元素按条件过滤
      console.log('输入的关键字的为：' + search)
      this.userShow = this.userAll.filter((v) => {
        // console.log(JSON.stringify(v))
        if (JSON.stringify(v).includes(search)) {
          return v
        }
      })
      for (let i = 0; i < this.userShow.length; i++) {
        if (!this.userShow[i].isDeleted) {
          this.userShow[i].isDeleted = '启用'
        } else {
          this.userShow[i].isDeleted = '禁用'
        }
      }
    },
    handleSelectionChange(val) {
      let ids = []
      for (let i = 0; i < val.length; i++) {
        ids.push(val[i].pkUserId)
      }
      this.userId = ids
    },
    //当前页展示数据
    handleSizeChange: function(pageSize) {
      this.pageSize = pageSize
    },
    //当前页
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage
    }
  },
  computed: {},
  watch: {
    pageSize: function() {
      console.log('pageSize改变' + this.pageSize)
      this.getAllUser()
    },
    currentPage: function() {
      console.log('currentPage改变' + this.currentPage)
      this.getAllUser()
    },
    total: function() {
      console.log('total改变' + this.total)
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
    margin-right: 20px;
    margin-left: -60%;
  }
}
.table {
  padding-left: 2%;
}
</style>
