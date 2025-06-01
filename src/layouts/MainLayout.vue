<template>
  <el-container style="height: 100vh; width: 100vw;">
    <el-aside width="200px" style="background: #2d3a4b; color: #fff;">
      <div style="height: 60px; line-height: 60px; text-align: center; font-weight: bold; font-size: 20px;">
        LOGO
      </div>
      <el-menu :default-active="$route.path" router background-color="#2d3a4b" text-color="#fff" active-text-color="#409EFF">
        <el-menu-item index="/">
          <el-icon><HomeFilled /></el-icon>
          首页
        </el-menu-item>
        <el-sub-menu index="/system">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>系统管理</span>
          </template>
          <el-menu-item index="/system/users">
            <el-icon><User /></el-icon>
            用户管理
          </el-menu-item>
          <el-menu-item index="/system/roles">
            <el-icon><Avatar /></el-icon>
            角色管理
          </el-menu-item>
          <el-menu-item index="/system/permissions">
            <el-icon><Tickets /></el-icon>
            权限管理
          </el-menu-item>
          <el-menu-item index="/system/employees">
            <el-icon><UserFilled /></el-icon>
            员工管理
          </el-menu-item>
          <el-menu-item index="/system/orgs">
            <el-icon><OfficeBuilding /></el-icon>
            机构管理
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item index="/product">
          <el-icon><Box /></el-icon>
          产品管理
        </el-menu-item>
        <el-menu-item index="/monthly">
          <el-icon><Calendar /></el-icon>
          月度汇总
        </el-menu-item>
        <el-menu-item index="/monthly/standard">
          <el-icon><Tickets /></el-icon>
          计件标准
        </el-menu-item>
        <el-menu-item index="/monthly/workorder">
          <el-icon><UserFilled /></el-icon>
          记工单
        </el-menu-item>
        <el-menu-item index="/monthly/salary">
          <el-icon><Avatar /></el-icon>
          员工工资
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header style="background: #fff; box-shadow: 0 2px 8px #f0f1f2; display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 24px;">
            <!-- <div style="font-size: 18px; font-weight: bold;">后台管理系统</div> -->
          <!-- 动态面包屑 -->
          <el-breadcrumb
            separator="/"
            class="custom-breadcrumb"
          >
            <el-breadcrumb-item
              v-for="(item, idx) in breadcrumbs"
              :key="item.path || idx"
              :to="idx < breadcrumbs.length - 1 ? item.path : undefined"
            >
              {{ item.meta.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div>你好，管理员</div>
      </el-header>
      <el-main style="background: #f5f7fa;">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { HomeFilled, Setting, User, Avatar, Tickets, UserFilled, OfficeBuilding, Box, Calendar } from '@element-plus/icons-vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const breadcrumbs = computed(() => {
  // 只显示有 meta.title 的路由
  return route.matched.filter(r => r.meta && r.meta.title)
})
</script>

<style scoped>
.custom-breadcrumb {
  font-size: 16px;
  font-weight: 500;
  color: #222;
  padding: 0;
  margin: 0 0 8px 0;
  background: none;
  box-shadow: none;
}
.custom-breadcrumb .el-breadcrumb__item {
  transition: color 0.2s;
}
.custom-breadcrumb .el-breadcrumb__inner {
  color: #666;
  font-weight: 500;
  letter-spacing: 0.5px;
  font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", Arial, sans-serif;
}
.custom-breadcrumb .el-breadcrumb__item:not(:last-child) .el-breadcrumb__inner {
  cursor: pointer;
  color: #222;
  font-weight: 600;
}
.custom-breadcrumb .el-breadcrumb__item:not(:last-child) .el-breadcrumb__inner:hover {
  color: #409EFF;
  text-decoration: underline;
}
.custom-breadcrumb .el-breadcrumb__item:last-child .el-breadcrumb__inner {
  color: #409EFF;
  font-weight: bold;
  cursor: default;
}
.custom-breadcrumb .el-breadcrumb__separator {
  color: #bbb;
  font-weight: normal;
  margin: 0 6px;
}
</style>
