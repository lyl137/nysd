<template>
  <div class="login_container">
    <div class="login_form">
      <p class="login_title">农云时代管理系统</p>
      <el-form :model="loginForm" :rules="rules" status-icon label-width="100px" class="demo-ruleForm" ref="loginForm" auto-complete="on">
        
        <el-form-item label="账号" prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入账号" name="username" ref="username"
          type="text"
          tabindex="1"
          auto-complete="on"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <!-- <el-input type="password" v-model="loginForm.password" placeholder="请输入密码"></el-input> -->
          <el-input placeholder="请输入密码" v-model="loginForm.password" show-password
          ref="password"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button class="loginbut" type="primary" size="medium" @click.native.prevent="handleLogin" :loading="loading" >登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import { setToken } from '@/utils/auth'
export default {
  name: "Login",
  data() {

    //密码校验规则
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码长度至少为6位'))
      } else {
        callback()
      }
    }

    return {
      loginForm: {
        username: '',
        password: '',
      },
      rules: {
        username: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur",validator:validatePassword }],
      },
      loading: false,
    };
  }, 
  
  methods: {
    // 提交登录表单的数据
    handleLogin() {
    console.log("执行登录操作");
    console.log(this.loginForm);
      // this.$router.push("/")
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true

          //调用登录后端接口
          axios.post("/login", this.loginForm).then((result) => {
            console.log(result)
            if (result.data.code == 1) {
              setToken(result.data.data);
              console.log('login success');
              sessionStorage.setItem('username',result.data.username);
              this.$router.push('/');
            } else {
              this.$message.error(result.data.msg);
              this.loading = false
            }
          });
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
};
</script>
<style lang="less" scoped>
.login_container {
  width: 100%;
  height: 100vh;
  background-color: rgba(242, 242, 242, 1);
  background-image: url(../../assets/firstPageBg.jpg);
  background-position: center bottom;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: 0 0;
  border: none;
  border-radius: 0px;
  display: flex;
  justify-content: center;
  align-items: center;

  .login_form {
    width: 510px;
    margin: 0px auto;
    padding: 0 55px 15px 35px;
    background-color: rgba(255, 255, 255, 0.8);
    //border: none;
    border-radius: 15px;
    // 添加阴影效果
    //box-shadow: 0 0 25px #cac6c6;
    box-shadow: inset -1px 1px 10px rgba(0, 0, 0, 0.5);

    .login_title {
      font-family: "微软雅黑 Bold", "微软雅黑";
      font-weight: 700;
      text-decoration: none;
      color: rgb(0, 121, 254);
      font-size: 32px;
      margin-top: 50px;
      margin-bottom: 30px;
      margin-left: 35px;
      text-align: center;
    }

    .loginbut {
      margin-left: 120px;
      width: 100px;
    }
  }
}
</style>