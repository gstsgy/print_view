<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-select v-model="params.level" filterable clearable placeholder="模型" class="handle-select mr10"
                   @change="query">
          <el-option label="验收标签" value="1"/>
          <el-option label="托盘码" value="2"/>
        </el-select>
      </div>
      <el-table :data="data" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                @cell-dblclick="update">

        <el-table-column label="勾选" type="selection"></el-table-column>
        <el-table-column label="序号" type="index" :index="indexMethod" width="90px"></el-table-column>
        <el-table-column prop="id" label="id"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="level" label="菜单级别"></el-table-column>
        <el-table-column prop="parentId" label="父菜单id"></el-table-column>
        <el-table-column prop="ico" label="菜单图标" ></el-table-column>
        <el-table-column prop="path" label="菜单路由"></el-table-column>
        <el-table-column prop="posi" label="菜单位置"></el-table-column>
        <el-table-column prop="type" label="菜单类型"></el-table-column>
        <el-table-column prop="seq" label="菜单顺序"></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
            background
            layout="total, prev, pager, next"
            :current-page="params.pageNum"
            :page-size="params.pageSize"
            :total="pageTotal"
            @current-change="handlePageChange"
        ></el-pagination>
      </div>
      <el-button type="danger" icon="Delete" @click="del">删除</el-button>
      <el-button type="primary" icon="Plus" @click="add">新增</el-button>

    </div>

    <!-- 编辑弹出框 -->
    <edit-model ref="form" @saveForm="commit" :form="formModel"></edit-model>

  </div>
</template>

<script setup lang="ts" name="model">
import request from '../../utils/request';
import {ref, reactive} from 'vue';
import {ElMessage, ElMessageBox,ElTable} from 'element-plus';
import {FormField, FormType} from "../../api/interface";


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
const pageTotal = ref(0);
const editVisible = ref(false);
const form = ref()



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
    type: FormType.select,
    label: "菜单级别",
    vmodel: "level",
    option:  [
      {
        value: "1",
        label: "模块"
      }, {
        value: "2",
        label: "页面"
      },{
        value: "3",
        label: "功能"
      },

    ],
    readonly:false
  },
  {
    type: FormType.input,
    label: "父菜单id",
    vmodel: "parentId",
    option: null,
    readonly:false
  },
  {
    type: FormType.input,
    label: "菜单图标",
    vmodel: "ico",
    option:null,
    readonly:false
  },
  {
    type: FormType.input,
    label: "菜单路由",
    vmodel: "path",
    option: null,
    readonly:false
  },
  {
    type: FormType.input,
    label: "菜单位置",
    vmodel: "posi",
    option: null,
    readonly:false
  },
  {
    type: FormType.select,
    label: "菜单类型",
    vmodel: "type",
    option:  [
      {
        value: 1,
        label: "pc"
      }, {
        value: 2,
        label: "pda"
      }

    ],
    readonly:false
  },
  {
    type: FormType.inputNumber,
    label: "菜单顺序",
    vmodel: "seq",
    option: null,
    readonly:false
  },
]);
const multipleTable = ref<InstanceType<typeof ElTable>>()

// 定义函数
// 查询操作
const query = () => {
  params.pageNum = 1;
  request.get("/menu/menus", {
    params: params
  }).then(res => {
    data.value = res.data.records;
    pageTotal.value = res.data.total-0;
  })
};
const init = () => {
  query();
}

const indexMethod = (index: number) => {
  return (params.pageNum - 1) * params.pageSize + index + 1
}
// 分页导航
const handlePageChange = (val: number) => {
  console.log(val)
  params.pageNum = val;
  request.get("/menu/menus", {
    params: params
  }).then(res => {
    data.value = res.data.records
  })
};
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
  request.delete("menu/menus",{
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
    request.put("menu/menu",data.value).then(res=>{
      if(res.data){
        ElMessage.success("更新成功");
        form.value!.editVisible = false;
      }
    })
  }
  if(form.value!.title==='新增'){
    request.post("menu/menu",data.value).then(res=>{
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
