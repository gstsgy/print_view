<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-select v-model="roleId" filterable clearable  class="handle-select mr10"
                   @change="query">
          <el-option
              v-for="item in roles"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </div>


      <el-checkbox-group v-model="userRole">
        <el-checkbox v-for="user in users" :key="user.id" :label="user.id">{{
            user.nickName
          }}</el-checkbox>
      </el-checkbox-group>

      <el-button type="primary"  style="margin-top: 50px" @click="commit">确认</el-button>
    </div>

  </div>
</template>

<script setup lang="ts" name="userrole">
import request from '../../utils/request';
import {ref} from 'vue';
import {ElMessage} from 'element-plus';

const roleId = ref()
const userRole = ref()
// 定义变量
const users = ref()
const roles = ref()
const query = ()=>{
  request.get("/userrole/users",{
    params: {
      roleId:roleId.value
    }
  }).then(res=>{
    userRole.value = res.data.map((it: { userId: any; })=>it.userId)
  })
}
const init = ()=>{
  request.get("userrole/allusers").then(res=>users.value = res.data)
  request.get("userrole/allroles").then(res=>roles.value = res.data.map((it: { id: any; name: any; })=>({
    value:it.id,
    label:it.name
  })))
}
const  commit=()=>{
  request.post("/userrole/userrole",userRole.value.map((it: any)=>({id:it})),{
    params:{
      roleId:roleId.value
    }
  }).then(res=>{
    if(res.data){
      ElMessage.success("添加成功")
    }
  })
}
init();
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
}

.table {
  width: 100%;
  font-size: 14px;
}

.red {
  color: #F56C6C;
}

.mr10 {
  margin-right: 10px;
}

.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>
