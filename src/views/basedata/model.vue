<template>
  <div>
    <div class="container">
<!--      <div class="handle-box">-->
<!--        <el-input v-model="params.id" placeholder="id" class="handle-input mr10" @blur="query"></el-input>-->
<!--        <el-input v-model="params.name" placeholder="名称" class="handle-input mr10" @blur="query"></el-input>-->
<!--      </div>-->
      <el-table :data="models" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                @cell-dblclick="update">
        <el-table-column label="勾选" type="selection"></el-table-column>
        <el-table-column label="序号" type="index" :index="indexMethod" width="90px"></el-table-column>
        <el-table-column prop="id" label="编号"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="width" label="宽度"></el-table-column>
        <el-table-column prop="height" label="高度"></el-table-column>
        <el-table-column prop="printerName" label="打印机"></el-table-column>

      </el-table>
<!--      <div class="pagination">-->
<!--        <el-pagination-->
<!--            background-->
<!--            layout="total, prev, pager, next"-->
<!--            :current-page="params.pageNum"-->
<!--            :page-size="params.pageSize"-->
<!--            :total="pageTotal"-->
<!--            @current-change="handlePageChange"-->
<!--        ></el-pagination>-->
<!--      </div>-->
<!--      <el-button type="danger" icon="Delete" @click="del">删除</el-button>-->
      <el-button type="primary" icon="Plus" @click="add">新增</el-button>

    </div>

    <!-- 编辑弹出框 -->
    <EditModel ref="form" @saveForm="commit" :form="formModel"></EditModel>

  </div>
</template>

<script setup lang="ts" name="model">
import request from '../../utils/request';
import {ref, reactive} from 'vue';
import {ElMessage,ElTable} from 'element-plus';
import EditModel from '../../components/EditModel.vue'
import {FormField, FormType} from "../../api/interface";


// 定义变量
const models = ref([])
const editVisible = ref(false);
const form = ref<InstanceType<typeof EditModel>>()
const formModel=reactive<Array<FormField>>([
  {
    type: FormType.input,
    label: "编号",
    vmodel: "id" ,
    option: null,
    readonly:false
  },
  {
    type: FormType.input,
    label: "名称",
    vmodel: "name" ,
    option: null,
    readonly:false
  },
  {
    type: FormType.inputNumber,
    label: "宽度",
    vmodel: "width" ,
    option: null,
    readonly:false
  },
  {
    type: FormType.inputNumber,
    label: "高度",
    vmodel: "height" ,
    option: null,
    readonly:false
  },
  {
    type: FormType.input,
    label: "打印机",
    vmodel: "printerName",
    option: null,
    readonly:false
  }
]);
const multipleTable = ref<InstanceType<typeof ElTable>>()

// 定义函数
// 查询操作
const query = () => {
  request.get("/model/models").then(res => {
    models.value = res.data;
  })
};
const init = () => {
  query();
}

const indexMethod = (index: number) => {
  return index + 1
}
// 分页导航
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
  request.delete("ware/wareinfo",{
    data:multipleTable.value!.getSelectionRows()
  }).then(res=>{
    if(res.data){
      ElMessage.success("删除成功");
      query();
    }
  })
}
const commit = (data: { value: any; })=>{
  if(form.value!.title==='更新'){
    request.put("model/model",data.value).then(res=>{
      if(res.data){
        ElMessage.success("更新成功");
        form.value!.editVisible = false;
        query();
      }
    })
  }
  if(form.value!.title==='新增'){
    request.post("model/model",data.value).then(res=>{
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
