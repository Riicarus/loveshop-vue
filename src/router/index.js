import { createRouter, createWebHashHistory } from 'vue-router'
import LoginPage from '../views/LoginPage'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/mainPage',
    name: 'MainPage',
    children: [
      {
        path: '/addCommodity',
        name: 'addCommodity',
        component: () => import('../views/AddCommodity')
      },
      {
        path: '/book',
        name: 'book',
        component: () => import('../views/AllBook')
      },
      {
        path: '/culturalCreativity',
        name: 'culturalCreativity',
        component: () => import('../views/AllCulturalCreativity')
      },
      {
        path: '/dailyNecessity',
        name: 'dailyNecessity',
        component: () => import('../views/AllDailyNecessity')
      },
      {
        path: '/sportsGoods',
        name: 'sportsGoods',
        component: () => import('../views/AllSportsGoods')
      },
      {
        path: '/boardGame',
        name: 'boardGame',
        component: () => import('../views/AllBoardGame')
      },
      {
        path: '/addOrder',
        name: 'addOrder',
        component: () => import('../views/AddOrder')
      },
      {
        path: '/allOrder',
        name: 'allOrder',
        component: () => import('../views/OrderManage')
      },
      {
        path: '/bill',
        name: 'bill',
        component: () => import('../views/BillManage')
      },
      {
        path: '/activity',
        name: 'activity',
        component: () => import('../views/ActivityManage')
      },
      {
        path: '/notice',
        name: 'notice',
        component: () => import('../views/NoticeManage')
      },
      {
        path: '/manageAttendance',
        name: 'manageAttendance',
        component: () => import('../views/AttendanceManage')
      },
      {
        path: '/logAttendance',
        name: 'logAttendance',
        component: () => import('../views/AttendanceLog')
      },
      {
        path: '/account',
        name: 'account',
        component: () => import('../views/AccountManage')
      }
    ],
    component: () => import('../views/MainPage')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
