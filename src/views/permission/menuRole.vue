<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-select v-model="roleId" filterable clearable class="handle-select mr10"
                   @change="query">
          <el-option
              v-for="item in roles"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </div>


      <el-tree
          ref="treeRef"
          :data="menus"
          show-checkbox
          node-key="id"
          highlight-current
          :default-checked-keys="menuRole"
          :props="defaultProps"
      />

      <el-button type="primary" style="margin-top: 50px" @click="commit">确认</el-button>
    </div>

  </div>
</template>

<script setup lang="ts" name="menuRole">
import request from '../../utils/request';
import {ref} from 'vue';
import {ElMessage, ElTree} from 'element-plus';

const roleId = ref()
const menuRole = ref()
// 定义变量
const roles = ref()
const menus = ref()
const treeRef = ref<InstanceType<typeof ElTree>>()
const defaultProps = {
  children: 'children',
  label: 'label',
}


const query = () => {
  request.get("/rolemenu/menus", {
    params: {
      roleId: roleId.value,
      type: 1
    }
  }).then(res => {
    treeRef.value?.setCheckedKeys([])
    menuRole.value = res.data.map((it: { id: any; }) => it.id)

  })
}
const init = () => {
  request.get("/role/roleenum").then(res => roles.value = res.data)
  request.get("/rolemenu/menutree",{
    params:{
      type:1
    }
  }).then(res => menus.value = res.data)
}
const commit = () => {
  if(!roleId.value){
    ElMessage.error("请选择角色")
    return
  }
  request.post("/rolemenu/rolemenu",treeRef.value?.getCheckedKeys(true),{
    params:{
      roleId:roleId.value
    }
  }).then(res=>{
    if(res.data){
      ElMessage.success("保存成功")
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
