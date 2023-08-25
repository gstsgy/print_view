<template>
  <el-dialog :title="title" v-model="editVisible" width="30%">
    <el-form label-width="70px">
      <el-form-item v-for="item in form" :label="item.label">
        <el-input v-model="data[item.vmodel]" v-if="item.type===FormType.input" :readonly="item.readonly"></el-input>
        <el-input-number v-model="data[item.vmodel]" v-if="item.type===FormType.inputNumber" :readonly="item.readonly"></el-input-number>
        <el-date-picker
            v-model="data[item.vmodel]"
            type="date"
            :placeholder="item.label"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            v-if="item.type===FormType.datePicker"
        />
        <el-radio-group v-model="data[item.vmodel]" v-if="item.type===FormType.radio">
          <el-radio :label="o.value" v-for="o in item.option">{{ o.label }}</el-radio>
        </el-radio-group>
        <el-select v-model="data[item.vmodel]" clearable filterable :placeholder="data[item.vmodel]"
                   v-if="item.type===FormType.select">
          <el-option
              v-for="o in item.option"
              :key="o.value"
              :label="o.label"
              :value="o.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
				<span class="dialog-footer">
					<el-button @click="editVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveEdit">确 定</el-button>
				</span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {toRefs, ref, PropType} from "vue";
import {FormType} from '../api/interface'
import type {FormField} from '../api/interface'
const data = ref({} as {[index:string]:any});
const props = defineProps({
  form : Array as PropType<FormField[]>
})
const {form} = toRefs(props)
const title = ref();

const editVisible = ref(false);
const emit = defineEmits(["saveForm"]);
const saveEdit = () => emit("saveForm", data)

defineExpose({
  title, data, editVisible
})
</script>

<style scoped>

</style>