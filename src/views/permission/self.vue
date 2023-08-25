<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="clearfix">
              <span>账户编辑</span>
            </div>
          </template>
          <el-form label-width="90px">
            <el-form-item label="用户名："> {{ mySelf.code }}</el-form-item>
            <el-form-item label="昵称：">
              <el-input v-model="mySelf.nickName"></el-input>
            </el-form-item>
            <el-form-item label="邮箱：">
              <el-input v-model="mySelf.email"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="onSubmit">保存</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="clearfix">
              <span>密码修改</span>
            </div>
          </template>
          <el-form label-width="90px">

            <el-form-item label="旧密码：">
              <el-input type="password" show-password v-model="oldPwd"></el-input>
            </el-form-item>
            <el-form-item label="新密码：">
              <el-input type="password" show-password v-model="newPwd"></el-input>
            </el-form-item>
            <el-form-item label="再次输入：">
              <el-input type="password" show-password v-model="newPwd1"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="updatePW">保存</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="user">
import {ref} from 'vue';
import request from "../../utils/request";
import {ElMessage} from "element-plus";

const mySelf = ref({
  nickName: '',
  avatarImg: '',
  passwd: '',
  email: '',
  code: '',
});
const init = () => {
  request.get("/user/self").then(res => mySelf.value = res.data)
}
init()
const oldPwd = ref()
const newPwd = ref()
const newPwd1 = ref()
const onSubmit = () => {
  request.put("/user/user", mySelf.value).then(res => {
    if(res.data){
      ElMessage.success("保存成功")
    }
  })
}
const updatePW = () => {
  if (newPwd.value !== newPwd1.value) {
    ElMessage.error("两次密码输入不一致")
    return
  }
  mySelf.value.passwd = newPwd.value
  request.put("/user/userpw", mySelf.value, {
    headers: {
      "oldPwd": oldPwd.value
    }
  }).then(res => {
    if (res.data) {
      ElMessage.success("修改成功")
    }
  })
}


</script>

<style scoped>
.info {
  text-align: center;
  padding: 35px 0;
}

.info-image {
  position: relative;
  margin: auto;
  width: 100px;
  height: 100px;
  background: #f8f8f8;
  border: 1px solid #eee;
  border-radius: 50px;
  overflow: hidden;
}

.info-edit {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.info-edit i {
  color: #eee;
  font-size: 25px;
}

.info-image:hover .info-edit {
  opacity: 1;
}

.info-name {
  margin: 15px 0 10px;
  font-size: 24px;
  font-weight: 500;
  color: #262626;
}

.crop-demo-btn {
  position: relative;
}

.crop-input {
  position: absolute;
  width: 100px;
  height: 40px;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
}
</style>
