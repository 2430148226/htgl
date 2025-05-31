<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="login-title">后台管理系统登录</h2>
      <el-form :model="loginForm" :rules="rules" ref="loginFormRef" label-width="80px">
        <el-form-item label="账号" prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const loginForm = ref({
  username: '',
  password: ''
});
const rules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
};
const loginFormRef = ref(null);

function handleLogin() {
  loginFormRef.value.validate(valid => {
    if (valid) {
      // 登录逻辑
      alert('登录成功（这里写实际登录逻辑）');
    }
  });
}
</script>

<style scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #e0e7ef 0%, #f6f7fb 100%);
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-card {
  width: 350px;
  padding: 40px 30px 30px 30px;
  box-shadow: 0 2px 24px 0 rgba(0,0,0,0.07);
  border-radius: 18px;
}
.login-title {
  text-align: center;
  margin-bottom: 25px;
  color: #333;
  font-size: 22px;
  font-weight: bold;
  letter-spacing: 1px;
}
</style>
