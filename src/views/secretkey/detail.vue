<template>
  <vab-dialog v-model="dialogFormVisible" append-to-body :title="title" width="500px" @close="close">
    <el-form ref="formRef" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="密钥名称" prop="name">
        <el-input v-model="form.name" clearable />
      </el-form-item>
      <el-form-item label="密钥类型" prop="type">
        <el-select v-model="form.type">
          <el-option v-for="item in pageTransitionList" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="密钥内容" prop="value">
        <el-input v-model="form.value" clearable :rows="10" type="textarea" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="save">保存</el-button>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import yaml from 'js-yaml'
import { reactive, ref } from 'vue'
import { saveSecrets, secret_tpls, updataSecrets } from '/@/api/secretkey'
defineOptions({
  name: 'DefaultTableEdit',
})
const pageTransitionList = ref([])
const emit = defineEmits(['fetch-data'])

const formRef = ref<FormInstance>()
const title = ref<string>('')
const dialogFormVisible = ref<boolean>(false)
const nodeTemplates = reactive({})
const isedits = ref('add')
const form = reactive<any>({
  name: '',
  value: '',
  type: '',
})
const rules = reactive<any>({
  name: [{ required: true, trigger: 'blur', message: '请输入密钥内容' }],
  type: [{ required: true, trigger: 'change', message: '请选择密钥类型' }],
  value: [{ required: true, trigger: 'blur', message: '请输入密钥内容' }],
})

const showEdit = (isedit: string, row: any) => {
  dialogFormVisible.value = true
  isedits.value = isedit
  nextTick(() => {
    if (row) {
      title.value = '编辑'
      row.value = yaml.dump(row.value)
      Object.assign(form, row)
      console.log(form)
    } else {
      title.value = '添加'
    }
  })
}

defineExpose({
  showEdit,
})
fetchNodeTemplates()
async function fetchNodeTemplates() {
  try {
    const response = await secret_tpls()

    pageTransitionList.value = response.map((node) => node.type)

    response.forEach((node) => {
      nodeTemplates[node.type] = node.value
    })

    // 默认选中第一个类型
    if (pageTransitionList.value.length > 0) {
      form.type = pageTransitionList.value[0]

      form.value = yaml.dump(nodeTemplates[form.type])
    }
  } catch (error) {
    console.error('获取节点模版信息失败，使用默认模版', error)
    // 设置默认节点类型和模板
    // pageTransitionList.value = ['webhook']
    // nodeTemplates['webhook'] = defaultYamlText
    // selectedNodeType.value = 'webhook'
    // yamlContent.value = defaultYamlText
  }
}
// 监听节点类型切换

watch(
  () => form.type,
  (newType) => {
    // console.log(person.name, '出演电影', oldValue, newValue)
    if (newType && nodeTemplates[newType]) {
      form.value = yaml.dump(nodeTemplates[newType])
    }
  }
)

const close = () => {
  formRef.value?.clearValidate()
  formRef.value?.resetFields()
  emit('fetch-data')
}

const save = () => {
  formRef.value?.validate(async (valid: any) => {
    if (valid) {
      try {
        if (isedits.value == 'add') {
          form.value = yaml.load(form.value)
          const { msg }: any = await saveSecrets(form)
          dialogFormVisible.value = false
        } else {
          form.value = yaml.load(form.value)
          const { msg }: any = await updataSecrets(form.id, form)
          dialogFormVisible.value = false
        }
      } catch (error) {
        console.error('添加节点失败 YAML 格式错误', error)
      }
    }
  })
}
</script>
