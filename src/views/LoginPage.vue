<template>
  <div class="login" clearfix>
    <div class="login-wrap">
      <el-row type="flex" justify="center">
        <el-form ref="loginForm" :model="admin" status-icon lable-width="80px">
          <h2>管理员登录</h2>
          <hr>
          <el-form-item prop="studentId" lable="studentId">
            <el-input v-model="admin.studentId" placeholder="请输入学号" prefix-icon></el-input>
          </el-form-item>
          <el-form-item prop="password" lable="password">
            <el-input v-model="admin.password" show-password placeholder="请输入密码" prefix-icon></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-upload" @click="doLogin()">登录</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Qs from 'qs'

export default {
  name: "LoginPage",
  data() {
    return {
      admin: {
        studentId: "",
        password: ""
      }
    };
  },
  methods: {
    doLogin: function () {
      if (!this.admin.studentId) {
        this.$message.error("请输入学号!");
      } else if (!this.admin.password) {
        this.$message.error("请输入密码!");
      } else {
        axios.post(
            this.$store.state.host + "/admin/login",
            Qs.stringify({
              studentId: this.admin.studentId,
              password: this.admin.password
            }))
            .then(res => {
                  if (res.data.code === 600) {
                    const adminInfo = res.data.data;
                    this.$store.commit('setToken', res.data.data.token);
                    this.$store.commit('setAdmin', res.data.data)
                    console.log(adminInfo);
                    this.$router.push({path: '/mainPage'});
                  } else {
                    alert("学号或密码错误!")
                  }
                }
            );
      }
    }
  }
}
</script>

<style scoped>
.login {
  width: 100%;
  height: 700px;
  background: url("../assets/loginCover.jpg") no-repeat;
  background-size: cover;
  overflow: hidden;
}

.login-wrap {
  width: 400px;
  height: 300px;
  margin: 200px auto;
  overflow: hidden;
  padding-top: 10px;
  line-height: 40px;
  background-color: rgba(255, 255, 255 , 0.7);
  border-radius: 5px;
}

.el-form {
  width: 60%;
}

.el-button {
  width: 80%;
  margin: 0 auto;
}
</style>