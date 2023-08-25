<template>
  <div>
    <div class="container">
      <div class="handle-box">


        <el-input v-model="params.name" placeholder="名称" class="handle-input mr10" @blur="query"></el-input>
      </div>
      <TableModel ref="table" :data ="data" :columns = "columns" :params="params" @update="update" @query="query"></TableModel>
      <el-button type="danger" icon="Delete" @click="del">删除</el-button>
      <el-button type="primary" icon="Plus" @click="add">新增</el-button>

    </div>

    <!-- 编辑弹出框 -->
    <EditModel ref="form" @saveForm="commit" :form="formModel"></EditModel>

  </div>
</template>

<script setup lang="ts" name="role">
import request from '../../utils/request';
import {ref, reactive} from 'vue';
import {ElMessage,ElTable} from 'element-plus';
import EditModel from '../../components/EditModel.vue'
import TableModel from '../../components/TableModel.vue'
import {FormField, FormType,TableColumn} from "../../api/interface";
// 定义变量
const data = ref([])
const params = reactive({
  type: '',
  level: '',
  parentId: '',
  name: '',
  pageNum: 1,
  pageSize: 15
});
const editVisible = ref(false);
const form = ref<InstanceType<typeof EditModel>>()

const table = ref<InstanceType<typeof TableModel>>()

const formModel=reactive<Array<FormField>>([
  {
    type: FormType.input,
    label: "id",
    vmodel: "id",
    option: null,
    readonly: true
  },
  {
    type: FormType.input,
    label: "名称",
    vmodel: "name",
    option: null,
    readonly: false
  },
  {
    type: FormType.input,
    label: "描述",
    vmodel: "desc",
    option: null,
    readonly:false
  },
]);
const multipleTable = ref<InstanceType<typeof ElTable>>()
const columns = reactive<Array<TableColumn>>([
  {
    prop:'id',
    label:'id',
    isshow:true
  },
  {
    prop:'name',
    label:'名称',
    isshow:true
  },
  {
    prop:'desc',
    label:'描述',
    isshow:true
  }
])
// 定义函数
// 查询操作
const query = (val?) => {
  if(val==undefined){
    params.pageNum = 1;
  }else {
    params.pageNum = val;
  }

  request.get("/role/roles", {
    params: params
  }).then(res => {
    data.value = res.data.records;
    table.value!.pageTotal = res.data.total-0;
  })
};
const init = () => {
  query();
  //table.value!.params = params
}

const update = (row:any, column:any) => {
  form.value!.editVisible = true
  form.value!.title = "更新"
  form.value!.data = row
}
const add = () => {
  form.value!.editVisible = true
  form.value!.title = "新增"
  form.value!.data = {}
}
init();

const del=()=>{
  if(multipleTable.value!.getSelectionRows().length===0){
    ElMessage.warning("请勾选要删除的数据");
    return
  }
  request.delete("role/roles",{
    data:multipleTable.value!.getSelectionRows()
  }).then(res=>{
    if(res.data){
      ElMessage.success("删除成功");
      query();
    }
  })
}
const commit = (data:any)=>{
  if(form.value!.title==='更新'){
    request.put("role/role",data.value).then(res=>{
      if(res.data){
        ElMessage.success("更新成功");
        form.value!.editVisible = false;
      }
    })
  }
  if(form.value!.title==='新增'){
    request.post("role/role",data.value).then(res=>{
      if(res.data){
        ElMessage.success("新增成功");
        form.value!.editVisible = false;
        query();
      }
    })
  }
}
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
