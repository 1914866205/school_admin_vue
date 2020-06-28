<template>
  <el-container class="container">
    <Side
      :menuList="menuList"
      style="position: relative; top: 0;height: 100%"
    ></Side>
    <div class="body1">
      <!-- <div class="body1" :class="{ body1: !isCollapse }"> -->
      <Nav></Nav>
      <div
        style="height: 20px;line-height: 20px;margin-top: 100px;background-color: #f8f8f8; padding-left: 10px"
        class="tl "
      >
        <!-- <span>推荐歌曲</span> -->
      </div>
      <div @click="closeTag">
        <router-view :style="{ width: screenWidth - 220 + `px` }" />
      </div>
    </div>
  </el-container>
</template>
<script>
import Side from '../components/Side'
import Nav from '../components/Nav'
import Bus from '../js/bus'
export default {
  name: 'Index',
  data() {
    return {
      menuList: [],
      isCollapse: true,
      screenWidth: document.documentElement.clientWidth
    }
  },
  components: {
    Side,
    Nav
  },
  created() {
    this.getMenuList()
    console.log(this.screenWidth)
  },
  mounted() {
    var _this = this
    Bus.$on('isCollapse', function(isCollapse) {
      _this.isCollapse = isCollapse
    })
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
    //关闭所哟菜单
    closeTag() {
      Bus.$emit('active', false)
    },
    //获取所有菜单
    getMenuList() {
      localStorage.setItem('token', 'lksdjfklsdjfiosiofja;ljdfsdjfkljs')
      let phoneNumber = JSON.parse(localStorage.getItem('user')).sysUserPhoneNumber
      this.axios({
        method: 'get',
        url: 'http://localhost:8081/sysUser/menus',
        // url: 'http://120.26.177.51:8081/sysUser/menus',
        params: {
          phoneNumber: phoneNumber
        },
        // 设置请求头Content-Type
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).then((res) => {
        this.menuList = res.data.data
        this.$store.commit('setMenuList', res.data.data)
        localStorage.setItem('menuList', JSON.stringify(res.data.data))
      })
    }
  },
  computed: {}
}
</script>

<style scoped lang="scss">
.container {
  display: flex;
  max-width: 100%;
  height: 100%;
  width: 100%;
  padding: 0;
}

.body {
  margin-left: 65px;
  z-index: 100;
}

.body1 {
  z-index: 100;
  margin-left: 202px;
  transition: margin-left 0.3s;
}

.area {
  background-color: red;
}
.text {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}
</style>
