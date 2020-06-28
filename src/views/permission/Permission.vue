<template>
  <div style="width: 100%">
    <el-row type="flex" class="ml-20 mt-10">
      <el-input v-model="input" placeholder="请输入内容" class="blur-search"></el-input>
      <el-date-picker
        v-model="time"
        type="daterange"
        range-separator=":"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        class="date-input-search ml-10"
        value-format="yyyy-MM-dd"
      >
      </el-date-picker>
      <el-select v-model="selectValue" placeholder="请选择" class="statu-search ml-10">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
      </el-select>
      <el-button type="success" size="mini" @click="search()" class="ml-10" icon="el-icon-search">搜索</el-button>
    </el-row>
    <el-row class="df-jr-ac ml-20 mt-10">
      <el-col class="tl">
        <el-button type="primary" icon="el-icon-plus" size="small"><span>新增</span></el-button>
        <el-button type="success" icon="el-icon-edit" size="small">修改</el-button>
        <el-button type="danger" icon="el-icon-delete" size="small">删除</el-button>
        <el-button type="warning" icon="el-icon-download" size="small">导出</el-button>
      </el-col>
      <el-col class="tr mr-20">
        <el-button icon="el-icon-refresh" size="small"></el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-row>
      <el-col span="1"></el-col>
      <el-col span="23" class="ml-20 mt-10">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%;"
          stripe="true"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" min-width="5%"></el-table-column>
          <el-table-column label="用户名" min-width="10%">
            <template slot-scope="scope">{{ scope.row.name }}</template>
          </el-table-column>
          <el-table-column prop="role" label="角色" min-width="15%"></el-table-column>
          <el-table-column prop="phoneNumber" label="手机号" show-overflow-tooltip min-width="15%"> </el-table-column>
          <el-table-column prop="status" label="状态" show-overflow-tooltip min-width="15%">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.statu" active-value="1" inactive-value="0" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip min-width="15%"> </el-table-column>
          <el-table-column label="操作" align="center" show-overflow-tooltip min-width="20%">
            <template slot-scope="scope">
              <p class="tc">
                <el-button size="mini" icon="el-icon-edit" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button size="mini" icon="el-icon-delete" type="danger" @click="handleDelete(scope.row)">删除</el-button>
              </p>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Permmission',
  data() {
    return {
      time: '',
      value: true,
      tableData: [
        {
          name: '王小虎',
          role: '系统管理员',
          phoneNumber: '14752191369',
          status: 1,
          createTime: '2018-10-01'
        },
        {
          name: '李小璐',
          role: '作业员',
          phoneNumber: '14752191369',
          status: 0,
          createTime: '2018-10-01'
        },
        {
          name: '赵二龙',
          role: '编辑管理员',
          phoneNumber: '14752191369',
          status: 1,
          createTime: '2018-10-01'
        },
        {
          name: '王小虎',
          role: '普通管理员',
          phoneNumber: '14752191369',
          status: 0,
          createTime: '2018-10-01'
        }
      ],
      options: [
        {
          value: '0',
          label: '禁用'
        },
        {
          value: '1',
          label: '正常'
        }
      ],
      selectValue: '',
      multipleSelection: []
    }
  },
  components: {},
  created() {},
  mounted() {},
  methods: {
    // 编辑
    handleEdit(row) {
      console.log(row)
    },
    //删除方法
    handleDelete(row) {
      console.log(row)
    },
    //搜索
    search() {
      alert(this.selectValue)
    }
  },
  computed: {}
}
</script>

<style scoped>
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
</style>
