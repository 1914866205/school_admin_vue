<template>
  <div style="width:100%">
    <!-- 增加弹出框 -->
    <el-dialog
      :modal="false"
      title="新增资讯类型信息"
      :visible.sync="addcenterDialogVisible"
      width="30%"
      center
    >
      <el-form
        :model="ruleForm"
        status-icon
        label-width="80px"
      >
        <el-form-item
          label="分类名"
          prop="name"
        >
          <el-input
            type="text"
            v-model="ruleForm.name"
            autocomplete="off"
            placeholder="请输入新增的分类名"
          ></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addcenterDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="confirmAdd"
        >确 定</el-button>
      </span>
    </el-dialog>

    <el-row
      type="flex"
      class="ml-20 mt-10"
    >
      <el-input
        v-model="input"
        clearable
        size="mini"
        placeholder="请输入内容"
        class="blur-search"
        @input="filterSearch()"
      ></el-input>
      <el-button
        type="success"
        size="mini"
        class="ml-10"
      >
        <i
          class="el-icon-search"
          style="color: rgb(247, 251, 255)"
        ></i>
        <span class="light-font-color">搜索</span>
      </el-button>
    </el-row>
    <el-row class="df-jr-ac ml-20 mt-10">
      <el-col class="tl">
        <el-button
          disabled
          type="primary"
          icon="el-icon-plus"
          size="small"
          @click="addcenterDialogVisible = true"
        ><span class="light-font-color">新增</span></el-button>
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="small"
          @click="delAll()"
        ><span class="light-font-color">批量删除</span></el-button>
        <!-- 删除提示框 -->
        <el-dialog
          :modal="false"
          title="提示"
          :visible.sync="batchdelVisible"
          width="300px"
          center
        >
          <div class="del-dialog-cnt">批量删除资讯类型后不可恢复，是否确定删除？</div>
          <span
            slot="footer"
            class="dialog-footer"
          >
            <el-button @click="batchdelVisible = false">取 消</el-button>
            <el-button
              type="primary"
              @click="deleteBatch()"
            >确 定</el-button>
          </span>
        </el-dialog>
      </el-col>
      <el-col class="tr mr-20">
        <el-button
          icon="el-icon-refresh"
          size="small"
        ></el-button>
      </el-col>
    </el-row>
    <!-- 表格展示 -->
    <el-row>
      <el-col span="1"></el-col>
      <el-col
        span="23"
        class="ml-20 mt-10"
      >
        <el-table
          :data="infoTypeList"
          stripe="true"
          style="width: 100%;"
          class="light-small-font p-a-20"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            min-width="10%"
          > </el-table-column>
          <el-table-column
            label="分类名"
            show-overflow-tooltip
            min-width="15%"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="排序"
            show-overflow-tooltip
            min-width="15%"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.sort }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="创建时间"
            show-overflow-tooltip
            min-width="15%"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.gmtCreate }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            show-overflow-tooltip
            min-width="10%"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
              >
                <span class="light-font-color">删除</span></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!-- 删除提示框 -->
    <el-dialog
      :modal="false"
      title="提示"
      :visible.sync="delVisible"
      width="300px"
      center
    >
      <div class="del-dialog-cnt">删除资讯类型后不可恢复，是否确定删除？</div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="deleteRow"
        >确 定</el-button>
      </span>
    </el-dialog>

    <div
      class="block"
      style="margin-top:2%"
    >
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[6]"
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
      infoTypeList: [],
      infoTypeList1: [],
      detailList: [],
      updatecenterDialogVisible: false,
      addcenterDialogVisible: false,
      datailcenterDialogVisible: false,
      delVisible: false, //删除提示弹框的状态
      batchdelVisible: false, //批量删除提示弹框的状态
      value1: '',
      input: '',
      gmtTime: '',
      msg: '',
      delarr: [], //存放删除的数据
      multipleSelection: [],
      ruleForm: {
        name: ''
      },
      currentPage: 0,
      total: 6,
      pageSize: 6
    }
  },
  created() {
    this.getinfoType()
  },
  watch: {
    pageSize: function() {
      this.getCardAll()
    },
    currentPage: function() {
      this.getCardAll()
    },
    total: function() {}
  },
  methods: {
    // 查询所有
    async getinfoType() {
      this.data = { currentPage: this.currentPage, pageSize: this.pageSize }
      this.url = '/infoType/all'
      this.result = await API.init(this.url, this.data, 'post')
      this.infoTypeList = this.result.data
      this.infoTypeList1 = this.result.data
      for (let i = 0; i < this.infoTypeList.length; i++) {
        this.infoTypeList[i].gmtCreate = this.formatDate(this.infoTypeList[i].gmtCreate)
      }
    },
    // 当前页展示数据
    handleSizeChange: function(pageSize) {
      this.pageSize = pageSize
    },
    // 当前页
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage
    },
    //单行删除
    handleDelete(index, row) {
      this.idx = index
      this.msg = row //每一条数据的记录
      this.delVisible = true
    },
    //批量删除
    delAll() {
      this.batchdelVisible = true //显示删除弹框
      const length = this.multipleSelection.length
      for (let i = 0; i < length; i++) {
        this.delarr.push(this.multipleSelection[i].pkInfoTypeId)
      }
    },
    //操作多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    //单个删除
    async deleteRow() {
      this.data = { pkId: this.msg.pkInfoTypeId }
      this.url = '/infoType/deletion/id'
      this.result = await API.init(this.url, this.data, 'post')
      this.$message.success('删除成功')
      this.getinfoType()
      this.delVisible = false //关闭删除提示模态框
    },
    //批量删除
    async deleteBatch() {
      this.data = { ids: String(this.delarr) }
      this.url = '/infoType/deletionBath/ids'
      this.result = await API.init(this.url, this.data, 'post')
      if (this.data) {
        this.getinfoType()
        this.$message.success('批量删除成功')
      } else {
        this.$message.error('资讯类型信息批量删除失败')
      }
      this.batchdelVisible = false //关闭删除提示模态框
    },
    //新增一卡通
    async confirmAdd() {
      this.data = {
        name: this.ruleForm.name
      }
      this.url = '/infoType/insert'
      this.result = await API.init(this.url, this.data, 'post')
      this.addcenterDialogVisible = false
      this.getinfoType()
      this.$message.success('添加成功')
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
      this.infoTypeList = this.infoTypeList1.filter((v) => {
        if (JSON.stringify(v).includes(search)) {
          return v
        }
      })
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
    }
  }
}
</script>

<style scoped>
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
</style>
