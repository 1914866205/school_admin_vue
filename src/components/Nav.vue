<template>
  <el-container>
    <el-header class="nav1" height="90px" style="box-shadow: 0px 3px 5px 0px #ddd;">
      <!-- <el-header class="nav" :class="{ nav1: !isCollapse }" height="90px" style="box-shadow: 0px 3px 5px 0px #ddd;"> -->
      <el-row>
        <div class="nav-header" @click="closeTag">
          <el-col class="nav-header-left">
            <i class="el-icon-s-fold side-bar-show" @click="changeSide"></i>
            <el-breadcrumb class="ml-10" separator="/">
              <el-breadcrumb-item :to="{ path: '/' }">{{ menu.name }}</el-breadcrumb-item>
              <el-breadcrumb-item v-if="menu.childName !== ''">{{ menu.childName }}</el-breadcrumb-item>
            </el-breadcrumb>
          </el-col>
          <el-col class="nav-header-right">
            <img src="@/assets/search.png" alt="" style="height: 28px; width:28px" />
            <el-tooltip class="item" effect="dark" content="全屏" placement="bottom">
              <img src="@/assets/full_screen.png" alt="" style="height: 28px; width:28px" />
            </el-tooltip>
            <el-dropdown>
              <el-avatar :size="45" src="https://empty">
                <img :src="user.sysUserAvatar" />
              </el-avatar>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item><span @click="logout()">退出</span></el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </div>
      </el-row>
      <!-- 头部标签 -->
      <el-row>
        <div class="nav-bottom" @contextmenu.prevent="">
          <el-tag
            v-for="(tag, index) in tags"
            @click="jumpTo(tag)"
            class="nav-bottom-tag ml-10 mt-5"
            :key="tag.name"
            :type="''"
            effect="dark"
            :class="{ tagBg: tag.name == currentTagName }"
          >
            <span @mousedown.right="handleTag(index)">{{ tag.name }}</span>
            <div
              style="height: 100px; width: 120px; background-color: white;display:flex;flex-direction:column"
              class="tabPanel"
              v-if="active && index == tagIndex"
            >
              <span @click="closeRightTag()">关闭右侧标签</span>
              <span @click="closeOtherTag()">关闭其他标签</span>
              <span @click="closeCurrentTag()">关闭当前标签</span>
            </div>
            <span
              class="ml-5 df-jc-ac"
              :class="{ changeIcon: index == currentIndex }"
              @click="deleteTag(tag)"
              @mouseenter="currentIndex = index"
              @mouseleave="currentIndex = -1"
            >
              <img src="@/assets/chahao.png" alt="" style="height: 14px; width:14px" v-if="currentIndex !== index" />
              <img src="@/assets/chahao_white.png" alt="" style="height: 14px; width:14px" v-if="currentIndex == index" />
            </span>
          </el-tag>
        </div>
      </el-row>
    </el-header>
  </el-container>
</template>

<script>
import Bus from '../js/bus'
export default {
  name: 'Nav',
  data() {
    return {
      isCollapse: true,
      menu: {
        name: '主页',
        childName: ''
      },
      iconShow: true,
      currentIndex: -1,
      active: false,
      tags: [],
      tag: {
        name: '',
        path: ''
      },
      tagIndex: '',
      user: JSON.parse(localStorage.getItem('user')),
      currentTagName: ''
    }
  },
  components: {},
  created() {
    console.log(this.user)
  },
  mounted() {
    var _this = this
    Bus.$on('menuName', function(menuName) {
      if (menuName.path != '') {
        let tag = { name: menuName.name, path: menuName.path }
        _this.currentTagName = tag.name
        if (
          !_this.tags.some((item) => {
            if (item.name == tag.name) {
              return true
            }
          })
        ) {
          _this.tags.push(tag)
          _this.$router.push(tag.path)
        }
      }
      _this.menu.childName = ''
      _this.menu.name = menuName.name
      console.log(menuName)
    }),
      Bus.$on('childMenuName', function(childMenuName, parentName) {
        if (_this.tags.length < 10) {
          let tag = { name: childMenuName.name, path: childMenuName.path }
          if (
            !_this.tags.some((item) => {
              if (item.name == tag.name) {
                _this.currentTagName = tag.name
                return true
              }
            })
          ) {
            _this.currentTagName = _this.tag.name
            _this.tags.push(tag)
          }
          if (parentName == _this.menu.name) {
            _this.currentTagName = tag.name
            _this.menu.childName = childMenuName.name
          }
        } else {
          _this.$message({
            message: '标签页不允许超过10个标签',
            type: 'warning'
          })
        }
      }),
      Bus.$on('active', function(active) {
        _this.active = active
      })
  },
  methods: {
    errorHandler() {
      alert('头像加载失败')
    },
    //右击处理头部标签
    handleTag(index) {
      this.tagIndex = index
      this.active = true
    },
    //关闭右侧标签
    closeRightTag() {
      this.tags.splice(this.tagIndex + 1, this.tags.length - (this.tagIndex + 1))
      this.active = false
    },
    closeTag() {
      this.active = false
    },
    //关闭其他页
    closeOtherTag() {
      if (this.tagIndex == 0) {
        this.tags.splice(this.tagIndex + 1, this.tags.length - (this.tagIndex + 1))
        this.active = false
      }
      if (this.tagIndex == this.tags.length - 1) {
        this.tags.splice(0, this.tags.length - 1)
        this.active = false
      }
      if (this.tagIndex > 0 && this.tagIndex < this.tags.length - 1) {
        this.tags.splice(0, this.index)
        this.tags.splice(this.tagIndex + 1, this.tags.length - this.tagIndex - 1)
        this.active = false
      }
    },
    //关闭当前页
    closeCurrentTag() {
      this.tags.splice(this.tagIndex, 1)
      this.active = false
    },
    changeSide() {
      this.isCollapse = !this.isCollapse
      Bus.$emit('isCollapse', this.isCollapse)
    },
    logout() {
      localStorage.removeItem('user')
      localStorage.removeItem('menuList')
      localStorage.removeItem('token')
      this.$router.push('/login')
    },
    showTag(index) {
      this.currentIndex = index
    },
    deleteTag(tag) {
      let index = this.tags.indexOf(tag)
      this.tags.splice(index, 1)
    },
    jumpTo(tag) {
      this.$router.push(tag.path)
      this.currentTagName = tag.name
    }
  },
  watch: {
    //当标签删除完之后跳转到首页
    tags: function() {
      if (this.tags.length == 0) {
        this.$router.push('/')
      }
    }
  },
  computed: {}
}
</script>

<style scoped lang="scss">
.nav1 {
  position: fixed;
  top: 0;
  right: 0;
  padding: 0%;
  left: 202px;
  z-index: 100;
  background-color: white;
  transition: left 0.35s;
}

.nav {
  left: 200px;
}

.el-header {
  padding: 0;
}

.side-bar-show {
  font-size: 22px;
}

.nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  padding: 0 10px;
  border-bottom: 2px solid #f4f4f5;
  &-left {
    text-align: left;
    display: flex;
    align-items: center;
    i {
      margin-right: 15px;
    }
  }
  &-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-right: 20px;
    img {
      margin-right: 15px;
    }
  }
}

.nav-bottom {
  height: 36px;
  display: flex;
  align-items: center;
  &-tag {
    display: flex;
    align-items: center;
    height: 30px;
    border: 1px solid #ddd;
    margin-right: 5px;
    color: black;
    background-color: white;
    .changeIcon {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background-color: #b4bccc;
      /* img {
        width: 14px;
        height: 14px;
      } */
    }
  }
  //@debugmargin-bottom: 20px;
}

.nav-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-icon {
  font-size: 30px;
  color: white;
}

.tagBg {
  background-color: #42b983;
}

.tabPanel {
  position: absolute;
  margin-top: 20px;
  margin-left: 20px;
  box-shadow: 0 1px 1px 1px #ddd;
}
</style>
