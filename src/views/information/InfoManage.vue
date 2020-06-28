<template>
  <div style="width:100%">
    <!-- 修改弹出框 -->
    <el-dialog
      title="编辑资讯内容"
      :visible.sync="updatecenterDialogVisible"
      width="98%"
      :modal="false"
      left
    >
      <template>
        <quill-editor
          v-model="content"
          ref="myQuillEditor"
          class="editer"
          @blur="onEditorBlur($event)"
          @focus="onEditorFocus($event)"
          @ready="onEditorReady($event)"
          @change="onEditorChange($event)"
        ></quill-editor>
      </template>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="updatecenterDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="confirmUpdate"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 增加弹出框 -->
    <el-dialog
      title="新增资讯信息"
      :visible.sync="addcenterDialogVisible"
      width="30%"
      :modal="false"
      center
    >
      <el-form
        label-width="80px"
        :model="ruleForm1"
      >
        <el-form-item
          required
          label="标题"
          prop="title"
        >
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="ruleForm1.title"
          ></el-input>
        </el-form-item>
        <el-form-item
          required
          label="内容"
          prop="text"
        >
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入内容"
            v-model="ruleForm1.text"
          ></el-input>
        </el-form-item>
        <el-form-item
          required
          label="封面"
          prop="cover"
        >
          <img
            :src="ruleForm1.cover"
            alt=""
            style="width:100px;height:100px"
            @click="getClick()"
          />
          <!-- 隐藏的文件输入框 -->
          <input
            type="file"
            ref="upload"
            accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
            style="display:none;"
            @change="handlderFile()"
          />
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
        placeholder="请输入标题、内容、创建时间"
        class="blur-search"
        @input="filterSearch()"
      ></el-input>

      <el-button
        type="success"
        size="mini"
        class="ml-10"
        @click="searchOption()"
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
          title="提示"
          :visible.sync="batchdelVisible"
          width="300px"
          center
          :modal="false"
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
          :data="infoList"
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
            label="资讯标题"
            show-overflow-tooltip
            min-width="15%"
          >
            <template slot-scope="scope">
              <span v-html="scope.row.title"></span>
            </template>
          </el-table-column>
          <el-table-column
            label="资讯封面"
            show-overflow-tooltip
            min-width="15%"
          >
            <template slot-scope="scope">
              <el-popover
                placement="right"
                trigger="hover"
              >
                <img
                  :src="scope.row.cover"
                  style="width: 300px; height: 400px"
                />
                <img
                  slot="reference"
                  :src="scope.row.cover"
                  style="max-height: 50px;max-width: 80px"
                />
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            label="内容"
            min-width="15%"
          >
            <template slot-scope="scope">
              <el-popover
                placement="top"
                trigger="hover"
              >
                <p
                  type="text"
                  v-html="scope.row.text"
                  style="min-width: 300px; max-width: 800px"
                ></p>
                <p
                  slot="reference"
                  class="text-ellipsis"
                  type="text"
                  @click="handleUpdate(scope.$index, scope.row)"
                  v-html="scope.row.text"
                ></p>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            label="是否置顶"
            show-overflow-tooltip
            min-width="10%"
            :filters="[
              { text: '已置顶', value: true },
              { text: '未置顶', value: false }
            ]"
            :filter-method="filterTag"
            filter-placement="bottom-end"
          >
            <template slot-scope="scope">
              <el-tag
                type="success"
                v-if="scope.row.isTop"
              >已置顶</el-tag>
              <el-tag
                type="info"
                v-else
              >未置顶</el-tag>
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
            min-width="20%"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="success"
                @click="handleUpdate(scope.$index, scope.row)"
              >
                <span class="light-font-color">编辑</span></el-button>
              <el-button
                size="mini"
                type="primary"
                @click="handleTop(scope.$index, scope.row)"
              >
                <span class="light-font-color">置顶</span></el-button>
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
      title="提示"
      :visible.sync="delVisible"
      width="300px"
      :modal="false"
      center
    >
      <div class="del-dialog-cnt">删除资讯类型号后不可恢复，是否确定删除？</div>
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
        :page-sizes="[8, 16, 24, 32, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="40"
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
      infoList: [],
      infoList1: [],
      content: '',
      currentPage: 0,
      pageSize: 8,
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
      dialogFormVisible: false,
      ruleForm1: {
        text: '',
        title: '',
        cover: 'https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png'
      },
      file: '',
      editFormVisible: false
    }
  },
  created() {
    this.getinfoAll()
  },
  filters: {
    ellipsis(value) {
      if (!value) return ''
      if (value.length > 10) {
        return value.slice(0, 6) + '...'
      }
      return value
    }
  },
  watch: {
    pageSize: function() {
      this.getinfoAll()
    },
    currentPage: function() {
      this.getinfoAll()
    },
    total: function() {}
  },
  methods: {
    filterTag(value, row) {
      return row.isTop === value
      // eslint-disable-next-line no-unreachable
      this.getinfoAll()
    },
    handleEdit: function(index, row) {
      this.editFormVisible = true
      this.editForm = Object.assign({}, row)
    },
    // 查询所有
    async getinfoAll() {
      this.data = { currentPage: this.currentPage, pageSize: this.pageSize }
      this.url = '/info/all'
      this.result = await API.init(this.url, this.data, 'post')
      this.infoList = this.result.data
      this.infoList1 = this.result.data
      for (let i = 0; i < this.infoList.length; i++) {
        this.infoList[i].gmtCreate = this.formatDate(this.infoList[i].gmtCreate)
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
        this.delarr.push(this.multipleSelection[i].pkInfoManageId)
      }
    },
    //操作多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    //单个删除
    async deleteRow() {
      this.data = { pkId: this.msg.pkInfoManageId }
      this.url = '/info/deletion/id'
      this.result = await API.init(this.url, this.data, 'post')
      this.getinfoAll()
      this.$message.success('删除成功')
      this.delVisible = false //关闭删除提示模态框
    },
    //批量删除
    async deleteBatch() {
      this.data = { ids: String(this.delarr) }
      this.url = '/info/deletionBath/ids'
      this.result = await API.init(this.url, this.data, 'post')
      this.getinfoAll()
      this.$message.success('批量删除成功')
      this.batchdelVisible = false //关闭删除提示模态框
    },
    //编辑
    handleUpdate(index, row) {
      this.idx = index
      this.msg = row //每一条数据的记录
      this.updatecenterDialogVisible = true
      this.content = this.msg.text
    },
    async handleTop(index, row) {
      this.idx = index
      this.msg = row //每一条数据的记录
      if (this.msg.isTop == 1) {
        this.data = {
          filed1: this.msg.pkInfoManageId,
          status: false
        }
        this.url = '/info/isTop'
        this.result = await API.init(this.url, this.data, 'post')
        this.getinfoAll()
        this.$message.success('取消置顶')
      } else {
        this.data = {
          filed1: this.msg.pkInfoManageId,
          status: true
        }
        this.url = '/info/isTop'
        this.result = await API.init(this.url, this.data, 'post')
        this.getinfoAll()
        this.$message.success('置顶成功')
      }
    },

    //修改资讯信息
    async confirmUpdate() {
      this.data = {
        pkInfoManageId: this.msg.pkInfoManageId,
        text: this.content
      }
      this.url = '/info/modification'
      this.result = await API.init(this.url, this.data, 'post')
      this.updatecenterDialogVisible = false
      this.getinfoAll()
      this.$message.success('内容修改成功')
    },
    //过滤搜索
    filterSearch() {
      // 获取输入框的值
      let search = this.input
      //数组元素按条件过滤
      this.infoList = this.infoList1.filter((v) => {
        if (JSON.stringify(v).includes(search)) {
          return v
        }
      })
    },
    getClick() {
      this.$refs.upload.click()
    },
    handlderFile() {
      this.getClient()
      this.file = this.$refs.upload.files[0]
      var _this = this
      async function put() {
        try {
          let result = await _this.client.put(_this.$refs.upload.files[0].name, _this.file)
          _this.ruleForm1.cover = result.url
          _this.update()
        } catch (e) {
          alert('文件上传成功')
          console.log(e)
        }
      }
      put()
    },
    getClient() {
      let OSS = require('ali-oss')
      this.client = new OSS({
        region: 'oss-cn-beijing',
        accessKeyId: 'LTAIaG9RkwvVwXq6',
        accessKeySecret: '5WPkPJ4JY0nWciRfDpMFxzScm3oJn2',
        bucket: 'zhent-img'
      })
    },
    //新增资讯
    async confirmAdd() {
      this.data = {
        text: this.ruleForm1.text,
        title: this.ruleForm1.title,
        cover: this.ruleForm1.cover
      }
      this.url = '/info/insert'
      this.result = await API.init(this.url, this.data, 'post')
      this.addcenterDialogVisible = false
      this.getinfoAll()
      this.$message.success('资讯添加成功')
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
.dialog-form {
  border-radius: 5px;
  background-color: white;
  width: 500px;
  height: 400px;
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
