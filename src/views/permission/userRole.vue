<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-select v-model="userId" filterable clearable  class="handle-select mr10"
                   @change="query">
          <el-option
              v-for="item in users"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </div>


      <el-checkbox-group v-model="userRole">
        <el-checkbox v-for="role in roles" :key="role.id" :label="role.id">{{
            role.name
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

const userId = ref()
const userRole = ref()
// 定义变量
const users = ref()
const roles = ref()
const query = ()=>{
  request.get("/userrole/roles",{
    params: {
      userId:userId.value
    }
  }).then(res=>{
    userRole.value = res.data.map((it: { roleId: any; })=>it.roleId)
  })
}
const init = ()=>{
  request.get("userrole/allusers").then(res=>users.value = res.data.map((it: { id: any; nickName: any; })=>({
   value: it.id,
    label:it.nickName
  })))
  request.get("userrole/allroles").then(res=>roles.value = res.data)
}
const  commit=()=>{
  request.post("/userrole/roleuser",userRole.value.map((it: any)=>({id:it})),{
    params:{
      userId:userId.value
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
