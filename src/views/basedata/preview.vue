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
      <canvas id="canvas" class="canvas"></canvas>
      <el-form label-width="120px">
        <el-form-item label="参数">
          <el-input v-model="params" placeholder="" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" icon="Delete" @click="print">打印</el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>

<script setup lang="ts" name="preview">
import request from '../../utils/request';
import {ref, onMounted} from 'vue';
import {ElMessage} from 'element-plus';
import {CanvasImpl} from '../../canvas/canvas';
import {getData, saveData} from "../../utils/storageUtils";

const params = ref()

// 定义变量
const models = ref([] as any[])
const modelId = ref()
const elements = ref([] as any[]);
const canvas = ref<CanvasImpl>()

// 定义函数
// 查询操作
const query = () => {
  params.value = getData(`model=${modelId.value}`)
  request.get("/model/elements", {
    params: {
      "modelId": modelId.value
    }
  }).then(res => {
    elements.value = res.data;
    const model = models.value.find(it => it.id === modelId.value)

    canvas.value?.showModel(model, elements.value)
  })
};

const init = () => {
  request.get("/model/models",).then(res => {
    models.value = res.data
  })
  canvas.value = new CanvasImpl(1);
};

const print = () => {
  if (modelId.value === null) {
    ElMessage.error("请选择模版")
    return
  }
  saveData(`model=${modelId.value}`, params.value)
  request.post("/print/model", JSON.parse(params.value), {
    params: {
      "modelId": modelId.value
    }
  }).then(res => {
    if (res.data) {
      ElMessage.success("打印成功")
    }
  })
};

onMounted(() => {
  init()
})
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.mr10 {
  margin-right: 10px;
}
</style>
