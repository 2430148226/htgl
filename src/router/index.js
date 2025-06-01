import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

import 用户管理 from '../views/用户管理.vue'
import 角色管理 from '../views/角色管理.vue'
import 权限管理 from '../views/权限管理.vue'
import 员工管理 from '../views/员工管理.vue'
import 机构管理 from '../views/机构管理.vue'
import 产品管理 from '../views/产品管理.vue'
import 月度汇总 from '../views/月度汇总.vue'
import 计件标准 from '../views/计件标准.vue'
import 记工单 from '../views/记工单.vue'
import 员工工资 from '../views/员工工资.vue'

const routes = [
  {
    path: '/',
    name: '首页',
    component: Home,
    meta: { title: '首页' }
  },
  {
    path: '/system',
    name: '系统管理',
    component: { template: '<router-view />' },
    meta: { title: '系统管理' },
    children: [
      {
        path: 'users',
        name: '用户管理',
        component: 用户管理,
        meta: { title: '用户管理' }
      },
      {
        path: 'roles',
        name: '角色管理',
        component: 角色管理,
        meta: { title: '角色管理' }
      },
      {
        path: 'permissions',
        name: '权限管理',
        component: 权限管理,
        meta: { title: '权限管理' }
      },
      {
        path: 'employees',
        name: '员工管理',
        component: 员工管理,
        meta: { title: '员工管理' }
      },
      {
        path: 'orgs',
        name: '机构管理',
        component: 机构管理,
        meta: { title: '机构管理' }
      }
    ]
  },
  {
    path: '/product',
    name: '产品管理',
    component: 产品管理,
    meta: { title: '产品管理' }
  },
  {
    path: '/monthly',
    name: '月度汇总',
    component: 月度汇总,
    meta: { title: '月度汇总' }
  },
  {
    path: '/monthly/standard',
    name: '计件标准',
    component: 计件标准,
    meta: { title: '计件标准' }
  },
  {
    path: '/monthly/workorder',
    name: '记工单',
    component: 记工单,
    meta: { title: '记工单' }
  },
  {
    path: '/monthly/salary',
    name: '员工工资',
    component: 员工工资,
    meta: { title: '员工工资' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
