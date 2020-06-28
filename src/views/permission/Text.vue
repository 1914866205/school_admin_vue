<template>
  <div>
    <div class="sub-title">激活即列出输入建议</div>
    <el-autocomplete
      class="inline-input"
      v-model="semster"
      :fetch-suggestions="querySearch"
      placeholder="请输入内容"
      @select="handleSelect"
    ></el-autocomplete>
  </div>

</template>

<script>
const API = require('../utils/api')
export default {
  data() {
    return {
      semsters: [],
      semster: ''
    }
  },
  methods: {
    async selectSemster() {
      this.url = '/semester/all'
      this.result = await API.init(this.url, null, 'post')
      for (let i = 0; i < this.result.data.length; i++) {
        this.semsters.push({ value: this.result.data[i].name })
      }
      console.log(this.semsters)
    },
    querySearch(queryString, cb) {
      var semsters = this.semsters
      var results = queryString ? semsters.filter(this.createFilter(queryString)) : semsters
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (semster) => {
        return semster.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    handleSelect(item) {
      console.log(item)
    }
  },
  mounted() {
    this.selectSemster()
  }
}
</script>