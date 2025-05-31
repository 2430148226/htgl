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
        <!-- 系统管理菜单放到首页下方 -->
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
        <!-- 新增一级菜单：产品管理 -->
        <el-menu-item index="/product">
          <el-icon><Box /></el-icon>
          产品管理
        </el-menu-item>
        <!-- 新增一级菜单：月度汇总 -->
        <el-menu-item index="/monthly">
          <el-icon><Calendar /></el-icon>
          月度汇总
        </el-menu-item>
        <!-- 新增一级菜单：计件标准 -->
        <el-menu-item index="/monthly/standard">
          <el-icon><Tickets /></el-icon>
          计件标准
        </el-menu-item>
        <!-- 新增一级菜单：记工单 -->
        <el-menu-item index="/monthly/workorder">
          <el-icon><UserFilled /></el-icon>
          记工单
        </el-menu-item>
        <!-- 新增一级菜单：员工工资 -->
        <el-menu-item index="/monthly/salary">
          <el-icon><Avatar /></el-icon>
          员工工资
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header style="background: #fff; box-shadow: 0 2px 8px #f0f1f2; display: flex; align-items: center; justify-content: space-between;">
        <div style="font-size: 18px; font-weight: bold;">后台管理系统</div>
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
</script>
