<template>
  <div id="app">
    <router-view class="content" />
  </div>
</template>

<style lang="scss" scoped>
@import url('../src/assets/css/style.css');
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
#app {
  font-family: 2avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
}

.content {
  position: absolute;
}
</style>
