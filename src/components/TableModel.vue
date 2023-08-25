<template>
  <el-table :data="data" border class="table" ref="tableRef" header-cell-class-name="table-header"
            @cell-dblclick="update">
    <el-table-column label="勾选" type="selection"></el-table-column>
    <el-table-column label="序号" type="index" :index="indexMethod" width="90px"></el-table-column>
    <template v-for="item in columns">
      <el-table-column :prop="item.prop" :label="item.label" v-if="item.isshow&&item.type===undefined" :formatter="item.formatter"></el-table-column>
      <el-table-column label="操作" v-if="item.isshow&&item.type===TableColumnType.btn" >
        <template #default="scope">
          <el-button type="primary" @click="()=>item.btnfn!(scope.row)"
          >{{ item.label }}</el-button>

        </template>
      </el-table-column>
    </template>
  </el-table>
  <div class="pagination">
    <el-pagination
        background
        layout="total, prev, pager, next"
        :current-page="params!.pageNum"
        :page-size="params!.pageSize"
        :total="pageTotal"
        @current-change="handlePageChange"
    ></el-pagination>
  </div>
</template>

<script setup lang="ts">
import {toRefs, ref,PropType} from "vue";
import {ElTable} from "element-plus";
import {TableColumn, QueryParam,TableColumnType} from "../api/interface";

const props = defineProps({
  data : Array as PropType<any[]>,
  params: Object as ()=>QueryParam,
  columns: Array<TableColumn>
})
const {data,columns,params} = toRefs(props)
const pageTotal = ref(0);
const tableRef = ref<InstanceType<typeof ElTable>>()
const emit = defineEmits(["query","update"]);
const handlePageChange = (val: number) => emit("query", val)
const update=(row:any, column:any)=>emit("update",row,column)
const indexMethod=(index: number)=>(params!.value!.pageNum - 1) * params!.value!.pageSize + index + 1
defineExpose({
  tableRef,pageTotal
})
</script>

<style scoped>

</style>