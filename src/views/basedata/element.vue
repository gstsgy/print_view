<template>
  <div>
    <div class="container">
      <div class="handle-box">


        <el-select v-model="modelId" filterable clearable class="handle-select mr10"
                   @change="query">
          <el-option
              v-for="item in models"
              :key="item.id"
              :label="item.name"
              :value="item.id"
          />
        </el-select>
      </div>
      <el-table :data="elements" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                @cell-dblclick="update">
        <el-table-column label="勾选" type="selection"></el-table-column>
        <el-table-column label="序号" type="index" :index="indexMethod" width="90px"></el-table-column>
        <el-table-column prop="id" label="编号"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="modelId" label="模型编号"></el-table-column>
        <el-table-column prop="startX" label="起始x"></el-table-column>
        <el-table-column prop="startY" label="起始y"></el-table-column>
        <el-table-column prop="endX" label="结束x"></el-table-column>
        <el-table-column prop="endY" label="结束y"></el-table-column>
        <el-table-column prop="value" label="值"></el-table-column>
        <el-table-column prop="fontName" label="字体"></el-table-column>
        <el-table-column prop="fontStyle" label="字体风格"></el-table-column>
        <el-table-column prop="size" label="字体大小"></el-table-column>
        <el-table-column prop="path" label="img路径"></el-table-column>
        <el-table-column prop="width" label="宽度"></el-table-column>
        <el-table-column prop="height" label="高度"></el-table-column>
        <el-table-column prop="type" :formatter="showType" label="类型"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
      </el-table>
      <el-button type="danger" icon="Delete" @click="del">删除</el-button>
      <el-button type="primary" icon="Plus" @click="add">新增</el-button>

    </div>

    <!-- 编辑弹出框 -->
    <EditModel ref="lineForm" @saveForm="commit" :form="lineFormModel"></EditModel>
    <EditModel ref="textForm" @saveForm="commit" :form="textFormModel"></EditModel>
    <EditModel ref="imgForm" @saveForm="commit" :form="imgFormModel"></EditModel>

<!--    新增-->
    <el-dialog v-model="centerDialogVisible" title="请选择元素类型" width="30%" center>
      <el-select v-model="addType" filterable clearable class="handle-select mr10">
        <el-option
            v-for="item in types"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
      </el-select>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addShowForm">
          确认
        </el-button>
      </span>
      </template>
    </el-dialog>
  </div>





</template>

<script setup lang="ts" name="warehouse">
import request from '../../utils/request';
import {ref, reactive} from 'vue';
import {ElMessage, ElTable} from 'element-plus';
import EditModel from '../../components/EditModel.vue'
import {FormField, FormType} from "../../api/interface";


// 定义变量
const models = ref([] as any[])
const modelId = ref()
const elements = ref([] as any[]);

const editVisible = ref(false);
const lineForm = ref<InstanceType<typeof EditModel>>()
const textForm = ref<InstanceType<typeof EditModel>>()
const imgForm = ref<InstanceType<typeof EditModel>>()
const baseModel = [
  {
    type: FormType.input,
    label: "编号",
    vmodel: "id",
    option: null,
    readonly: false
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
    label: "模型id",
    vmodel: "modelId",
    option: null,
    readonly: true
  },
  {
    type: FormType.inputNumber,
    label: "起始x",
    vmodel: "startX",
    option: null,
    readonly: false
  },
  {
    type: FormType.inputNumber,
    label: "起始y",
    vmodel: "startY",
    option: null,
    readonly: false
  },
  {
    type: FormType.select,
    label: "类型",
    vmodel: "type",
    option: [
      {
        value: 1,
        label: "线段"
      }, {
        value: 2,
        label: "文本"
      }, {
        value: 3,
        label: "图片"
      }, {
        value: 4,
        label: "条码"
      }
    ],
    readonly: true
  },
]
const lineFormModel = reactive<Array<FormField>>([
  ...baseModel,
  {
    type: FormType.inputNumber,
    label: "结束x",
    vmodel: "endX",
    option: null,
    readonly: false
  },
  {
    type: FormType.inputNumber,
    label: "结束y",
    vmodel: "endY",
    option: null,
    readonly: false
  }
]);
const textFormModel = reactive<Array<FormField>>([
  ...baseModel,
  {
    type: FormType.input,
    label: "值",
    vmodel: "value",
    option: null,
    readonly: false
  },
  {
    type: FormType.input,
    label: "字体",
    vmodel: "fontName",
    option: null,
    readonly: false
  },
  {
    type: FormType.inputNumber,
    label: "字体格式",
    vmodel: "fontStyle",
    option: null,
    readonly: false
  },
  {
    type: FormType.inputNumber,
    label: "字体大小",
    vmodel: "size",
    option: null,
    readonly: false
  }
]);
const imgFormModel = reactive<Array<FormField>>([
  ...baseModel,
  {
    type: FormType.input,
    label: "路径",
    vmodel: "path",
    option: null,
    readonly: false
  },
  {
    type: FormType.input,
    label: "value",
    vmodel: "value",
    option: null,
    readonly: false
  },
  {
    type: FormType.inputNumber,
    label: "宽度",
    vmodel: "width",
    option: null,
    readonly: false
  },
  {
    type: FormType.inputNumber,
    label: "高度",
    vmodel: "height",
    option: null,
    readonly: false
  }
]);
const multipleTable = ref<InstanceType<typeof ElTable>>()

// 定义函数
// 查询操作
const query = () => {
  request.get("/model/elements", {
    params: {
      "modelId": modelId.value
    }
  }).then(res => {
    elements.value = res.data;
  })
};
const init = () => {
  request.get("/model/models",).then(res => {
    models.value = res.data
  })
}

const indexMethod = (index: number) => {
  return index + 1
}
const showType = (row, column, cellValue, index) => {
  if (cellValue === 1) {
    return "线段";
  } else if (cellValue === 2) {
    return "文本";
  } else if (cellValue === 3) {
    return "图片";
  } else if (cellValue === 4) {
    return "条码";
  }
}
// 分页导航
const update = (row: any, column: any) => {
  if (row.type === 1) {
    lineForm.value!.editVisible = true
    lineForm.value!.title = "更新"
    lineForm.value!.data = row
  } else if (row.type === 2) {
    textForm.value!.editVisible = true
    textForm.value!.title = "更新"
    textForm.value!.data = row
  } else if (row.type === 3 || row.type===4) {
    imgForm.value!.editVisible = true
    imgForm.value!.title = "更新"
    imgForm.value!.data = row
  }

}
init();

const del = () => {
  if (multipleTable.value!.getSelectionRows().length === 0) {
    ElMessage.warning("请勾选要删除的数据");
    return
  }
  request.delete("model/elements", {
    data: multipleTable.value!.getSelectionRows()
  }).then(res => {
    if (res.data) {
      ElMessage.success("删除成功");
      query();
    }
  })
}
const commit = (data: { value: any; }) => {
  let url = "barcode";
  let form = lineForm;
  if (data.value.type === 1) {
    url = "line";
    form = lineForm
  } else if (data.value.type === 2) {
    url = "text";
    form = textForm
  } else if (data.value.type === 3) {
    url = "img";
    form = imgForm
  } else if (data.value.type === 4) {
    form = imgForm
  }
  if (form.value!.title === '更新') {
    request.put(`model/${url}`, data.value).then(res => {
      if (res.data) {
        ElMessage.success("更新成功");
        form.value!.editVisible = false;
        query();
      }
    })
  }
  if (form.value!.title === '新增') {
    request.post(`model/${url}`, data.value).then(res => {
      if (res.data) {
        ElMessage.success("新增成功");
        form.value!.editVisible = false;
        query();
      }
    })
  }
}
// 新增相关
const addType = ref()
const types = [
  {
    value: '1',
    label: '线段',
  },
  {
    value: '2',
    label: '文本',
  },
  {
    value: '3',
    label: '图片',
  },
  {
    value: '4',
    label: '条码',
  }
]
const centerDialogVisible = ref()
const add=()=>{
  centerDialogVisible.value = true
}
const addShowForm = ()=>{
  if(!addType.value){
    ElMessage.error("请选择类型");
    return
  }
  centerDialogVisible.value = false
  console.log(addType.value)
  if (addType.value == 1) {
    lineForm.value!.editVisible = true
    lineForm.value!.title = "新增"
    lineForm.value!.data = {}
  } else if (addType.value == 2) {
    textForm.value!.editVisible = true
    textForm.value!.title = "新增"
    textForm.value!.data = {}
  } else if (addType.value == 3 || addType.value==4) {
    imgForm.value!.editVisible = true
    imgForm.value!.title = "新增"
    imgForm.value!.data = {}
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
