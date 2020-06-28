# intelligence-campus

智慧校园后台管理系统前端

## 1. 如何使用封装的 axios 方法

- 导入文件
  ![“导入文件”的图片](http://ww1.sinaimg.cn/large/005Q1gFaly1gfdn1vuhvrj30i505iq2z.jpg)

- 调用 init 方法
  ![“调用 init方法”的图片](http://ww1.sinaimg.cn/large/005Q1gFaly1gfdn2qpxi4j30nh0ix40y.jpg)

- init 方法的返回值即为接口的返回值，直接使用即可

- axios 的默认统一前缀为 “`http://localhost:8080`”（在 utils/httpAxios.js 中被设置）
