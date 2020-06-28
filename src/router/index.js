import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/index.vue'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/text',
    name: 'Text',
    component: () => import('../views/permission/Text.vue')
  },
  {
    path: '/',
    name: 'Index',
    component: Index,
    children: [
      /**
       * 权限管理相关路由
       */
      {
        path: 'admin',
        name: 'Admin',
        component: () => import('../views/permission/Admin.vue')
      },
      {
        path: 'permission',
        name: 'Permission',
        component: () => import('../views/permission/Permission.vue')
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('../views/permission/Role.vue')
      },
      /**
       * 配置管理相关路由
       */
      {
        path: 'appVersion',
        name: 'AppVersion',
        component: () => import('../views/configuration/AppVersion.vue')
      },
      {
        path: 'statement',
        name: 'Statement',
        component: () => import('../views/configuration/Statement.vue')
      },
      {
        path: 'feedback',
        name: 'Feedback',
        component: () => import('../views/configuration/Feedback.vue')
      },
      /**
       * 基础管理相关路由
       */
      {
        path: 'tower',
        name: 'Tower',
        component: () => import('../views/base/Tower.vue')
      },
      {
        path: 'room',
        name: 'Room',
        component: () => import('../views/base/Room.vue')
      },
      {
        path: 'semester',
        name: 'Semester',
        component: () => import('../views/base/Semester.vue')
      },
      {
        path: 'clazz',
        name: 'Clazz',
        component: () => import('../views/base/Clazz.vue')
      },
      {
        path: 'course',
        name: 'Course',
        component: () => import('../views/base/Course.vue')
      },
      {
        path: 'student',
        name: 'Student',
        component: () => import('../views/base/Student.vue')
      },
      {
        path: 'teacher',
        name: 'Teacher',
        component: () => import('../views/base/Teacher.vue')
      },
      /**
       * 账号管理相关路由
       */
      {
        path: 'account',
        name: 'Account',
        component: () => import('../views/account/Account.vue')
      },
      /**
       * 图书管理相关路由
       */
      {
        path: 'book',
        name: 'Book',
        component: () => import('../views/book/Book.vue')
      },
      {
        path: 'borrow',
        name: 'Borrow',
        component: () => import('../views/book/Borrow.vue')
      },
      /**
       * 一卡通管理相关路由
       */
      {
        path: 'card',
        name: 'Card',
        component: () => import('../views/card/Card.vue')
      },
      {
        path: 'order',
        name: 'Order',
        component: () => import('../views/card/Order.vue')
      },
      {
        path: 'reportLoss',
        name: 'ReportLoss',
        component: () => import('../views/card/ReportLoss.vue')
      },
      /**
       * 资讯管理相关路由
       */
      {
        path: 'infoType',
        name: 'InfoType',
        component: () => import('../views/information/InfoType.vue')
      },
      {
        path: 'infoManage',
        name: 'InfoManage',
        component: () => import('../views/information/InfoManage.vue')
      },

      /**
       * 考务管理相关路由
       */
      {
        path: 'schedule',
        name: 'Schedule',
        component: () => import('../views/administration/TimmeTable.vue')
      },
      {
        path: 'examination',
        name: 'examination',
        component: () => import('../views/administration/Examination.vue')
      },

      /**
       *
       */
      {
        path: 'comment',
        name: 'Comment',
        component: () => import('../views/flea/Comment.vue')
      },
      {
        path: 'goods',
        name: 'Goods',
        component: () => import('../views/flea/Goods.vue')
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('../views/flea/User.vue')
      },
      {
        path: 'reword',
        name: 'Reword',
        component: () => import('../views/flea/Reword.vue')
      },
      {
        path: 'type',
        name: 'Type',
        component: () => import('../views/flea/Type.vue')
      },
      {
        path: 'fleaorder',
        name: 'Order',
        component: () => import('../views/flea/Order.vue')
      },

      /**
       * 校友圈相关路由
       */
      {
        path: 'dynamic',
        name: 'Dynamic',
        component: () => import('../views/schoolmate/Dynamic.vue')
      },
      {
        path: 'dynamicComment',
        name: 'DynamicComment',
        component: () => import('../views/schoolmate/DynamicComment.vue')
      },

      /**跑腿 */
      {
        path: 'pdelivery',
        name: 'pdelivery',
        component: () => import('../views/errands/DeliveryOrder.vue')
      },
      {
        path: 'puser',
        name: 'puser',
        component: () => import('../views/errands/Puer.vue')
      },
      {
        path: 'passErrends',
        name: 'passErrends',
        component: () => import('../views/errands/passErrends.vue')
      },
      /**校园聘管理*/
      {
        path: 'avocation',
        name: 'Avocation',
        component: () => import('../views/job/Avocation.vue')
      },
      {
        path: 'company',
        name: 'Company',
        component: () => import('../views/job/Company.vue')
      },
      {
        path: 'job',
        name: 'Job',
        component: () => import('../views/job/Job.vue')
      },
      {
        path: 'jobType',
        name: 'Type',
        component: () => import('../views/job/JobType.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }

  // 配置二级路由操作
  // {
  //   path: '/permission',
  //   name: 'Permission',
  //   redirect: '/permission/admin',
  //   children: [
  //     {
  //       path: 'permission/admin',
  //       name: 'Admin',
  //       component: Admin
  //     },
  //     {
  //       path: 'permission/role',
  //       name: 'Role',
  //       component: () => import('../views/permission/Role.vue')
  //     }
  //   ]
  // }
]

const router = new VueRouter({
  routes
})

export default router
