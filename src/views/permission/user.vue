<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="params.code" placeholder="用户名" class="handle-input mr10" @blur="query"></el-input>
        <el-input v-model="params.position" placeholder="职位" class="handle-input mr10" @blur="query"></el-input>
      </div>
      <table-model ref="table" :data ="users" :columns = "columns" :params="params" @update="update" @query="query"></table-model>
      <el-button type="danger" icon="Delete" @click="del">删除</el-button>
      <el-button type="primary" icon="Plus" @click="add">新增</el-button>

    </div>

    <!-- 编辑弹出框 -->
    <edit-model ref="form" @saveForm="commit" :form="formModel"></edit-model>

  </div>
</template>

<script setup lang="ts" name="user">
import request from '../../utils/request';
import {reactive, ref} from 'vue';
import {ElMessage} from 'element-plus';
import {FormField, FormType, TableColumn, TableColumnType} from "../../api/interface";


// 定义变量
const users = ref([])
const params = reactive({
  code: '',
  position: '',
  pageNum: 1,
  pageSize: 15
});
const editVisible = ref(false);
const form = ref()
const table = ref()
const formModel=reactive<Array<FormField>>([
  {
    type: FormType.input,
    label: "用户名",
    vmodel: "code",
    option: null,
    readonly:false
  },
  {
    type: FormType.input,
    label: "昵称",
    vmodel: "nickName",
    option: null,
    readonly:false
  },
  {
    type: FormType.input,
    label: "邮箱",
    vmodel: "email",
    option: null,
    readonly:false
  },
  {
    type: FormType.datePicker,
    label: "生日",
    vmodel: "birthday",
    option: null,
    readonly:false
  },
  {
    type: FormType.radio,
    label: "性别",
    vmodel: "gender",
    option:
        [
          {
            value: 1,
            label: "男"
          }, {
          value: 2,
          label: "女"
        },

        ],
    readonly:false
  },
  {
    type: FormType.input,
    label: "职位",
    vmodel: "position",
    option: null,
    readonly:false
  },
  {
    type: FormType.input,
    label: "备注",
    vmodel: "remark",
    option: null,
    readonly:false
  },
]);
const columns = reactive<Array<TableColumn>>([
  {
    prop:'code',
    label:'用户名',
    isshow:true
  },
  {
    prop:'nickName',
    label:'昵称',
    isshow:true
  },
  {
    prop:'email',
    label:'邮箱',
    isshow:true
  },
  {
    prop:'birthday',
    label:'生日',
    isshow:true
  },
  {
    prop:'gender',
    label:'性别',
    isshow:true,
    formatter:(row:any, column:any, cellValue:any, index:any) => {
      if (cellValue === 1) {
        return "男";
      }
      return "女";
    }
  },
  {
    prop:'position',
    label:'职位',
    isshow:true
  },
  {
    prop:'remark',
    label:'备注',
    isshow:true
  },
  {
    prop:'1111',
    label:'重置密码',
    isshow:true,
    type:TableColumnType.btn,
    btnfn:(row)=>{
      request.post("/user/restpassword",row).then(res=>{
        if(res.data){
          ElMessage.success("重置成功")
        }
      })
    }
  },
])
// 定义函数
// 查询操作
const query = (val?) => {
  params.pageNum = val===undefined?1:val;
  request.get("/user/users", {
    params: params
  }).then(res => {
    users.value = res.data.records;
    table.value!.pageTotal = res.data.total-0;
  })
};
const init = () => {
  //request.get("/dept/deptenum").then(res => depts.value = res.data);
  query();
}

const update = (row:any, column:any) => {
  //console.log("更新")
  form.value!.editVisible = true
  form.value!.title = "更新用户"
  form.value!.data = row
}
const add = () => {
  form.value!.editVisible = true
  form.value!.title = "新增用户"
  form.value!.data = {}
}
init();

const del=()=>{
  const tmpdata = table.value!.tableRef!.getSelectionRows();
  if(tmpdata.length===0){
    ElMessage.warning("请勾选要删除的数据");
    return
  }
  request.delete("user/users",{
    data:tmpdata
  }).then(res=>{
    if(res.data){
      ElMessage.success("删除成功");
      query();
    }
  })
}
const commit = (data: { value: any; })=>{
  if(form.value!.title==='更新用户'){
    request.put("user/user",data.value).then(res=>{
      if(res.data){
        ElMessage.success("更新成功");
        form.value!.editVisible = false;
        query();
      }
    })
  }
  if(form.value!.title==='新增用户'){
    request.post("user/user",data.value).then(res=>{
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
