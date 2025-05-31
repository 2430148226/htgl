<template>
  <div class="user-manage">
    <!-- 搜索栏 -->
    <el-form :inline="true" :model="searchForm" class="search-bar">
      <el-form-item label="姓名">
        <el-input v-model="searchForm.name" placeholder="请输入姓名" clearable></el-input>
      </el-form-item>
      <el-form-item label="账号">
        <el-input v-model="searchForm.account" placeholder="请输入账号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 工具栏 -->
    <div style="margin: 12px 0;">
      <el-button type="primary" @click="openAddDialog">新增用户</el-button>
    </div>

    <!-- 用户表格 -->
    <el-table :data="userList" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="account" label="账号"></el-table-column>
      <el-table-column prop="org" label="所属机构"></el-table-column>
      <el-table-column prop="role" label="角色"></el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button size="small" @click="openEditDialog(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div style="text-align:right;margin-top:16px;">
      <el-pagination
        background
        layout="total, prev, pager, next"
        :total="total"
        :current-page="currentPage"
        :page-size="pageSize"
        @current-change="handlePageChange"
      />
    </div>

    <!-- 新增/编辑弹窗 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible">
      <el-form :model="dialogForm" :rules="dialogRules" ref="dialogFormRef" label-width="80px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="dialogForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-input v-model="dialogForm.account" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="dialogTitle === '新增用户'" label="密码" prop="password">
          <el-input v-model="dialogForm.password" autocomplete="off" type="password" placeholder="默认123456"></el-input>
        </el-form-item>
        <el-form-item label="所属机构" prop="org">
          <el-input v-model="dialogForm.org" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="dialogForm.role" placeholder="请选择角色">
            <el-option label="管理员" value="admin"></el-option>
            <el-option label="普通用户" value="user"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitDialog">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const searchForm = ref({
  name: '',
  account: ''
});

const userList = ref([
  { id: 1, name: '张三', account: 'zhangsan', org: '总部', role: 'admin' },
  { id: 2, name: '李四', account: 'lisi', org: '分部', role: 'user' },
  // ... 可自行添加数据或后期从后端获取
]);
const total = ref(2);
const currentPage = ref(1);
const pageSize = ref(10);

// 搜索和重置
function handleSearch() {
  // TODO: 搜索逻辑，真实开发要用接口
}
function resetSearch() {
  searchForm.value.name = '';
  searchForm.value.account = '';
  // TODO: 重新加载列表
}

// 分页
function handlePageChange(page) {
  currentPage.value = page;
  // TODO: 请求对应页的数据
}

// 新增/编辑弹窗
const dialogVisible = ref(false);
const dialogTitle = ref('');
const dialogForm = ref({ id: null, name: '', account: '', password: '123456', org: '', role: '' });
const dialogRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  org: [{ required: true, message: '请输入所属机构', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }]
};
const dialogFormRef = ref(null);

function openAddDialog() {
  dialogTitle.value = '新增用户';
  dialogForm.value = { id: null, name: '', account: '', password: '123456', org: '', role: '' };
  dialogVisible.value = true;
}

function openEditDialog(row) {
  dialogTitle.value = '编辑用户';
  dialogForm.value = { ...row };
  dialogVisible.value = true;
}

function submitDialog() {
  dialogFormRef.value.validate(valid => {
    if (!valid) return;
    if (dialogForm.value.id) {
      // 编辑
      const idx = userList.value.findIndex(u => u.id === dialogForm.value.id);
      if (idx > -1) userList.value[idx] = { ...dialogForm.value };
    } else {
      // 新增
      userList.value.push({
        ...dialogForm.value,
        id: userList.value.length + 1
      });
      total.value++;
    }
    dialogVisible.value = false;
  });
}

function handleDelete(row) {
  userList.value = userList.value.filter(u => u.id !== row.id);
  total.value--;
}
</script>

<style scoped>
.user-manage {
  background: #f7f8fa;
  padding: 20px 32px;
  min-height: 100vh;
}
.search-bar {
  margin-bottom: 16px;
}
</style>
