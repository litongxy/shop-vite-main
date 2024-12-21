<script setup>
import { useVueFlow } from '@vue-flow/core'
import { ElButton, ElForm, ElFormItem, ElInput, ElOption, ElSelect } from 'element-plus'
import yaml from 'js-yaml'
import { reactive, ref, watch } from 'vue'
import { ListSecrets } from '/@/api/secretkey'
import { getWorkflowNodes } from '/@/api/workflow'

const { nodes, addNodes, dimensions } = useVueFlow()

// 定义支持的节点类型和节点模版
const availableNodeTypes = ref([]) // 动态获取节点类型
const nodeTemplates = reactive({})
const secretKeyTypeData = ref([])

// 当前选择的节点类型
const selectedNodeType = ref('')
const secretKeyType = ref({})

// YAML 编辑框内容
const yamlContent = ref('')

// 原始 YAML 字符串
const defaultYamlText = `name: Webhook
type: webhook
credentials:
  frp:
    serverAddr: 'frp.lo.mytool.zone'
    serverPort: 2023
    token: ''
    customDomains:
      - 'xxx.lo.mytool.zone'
    localIP: "127.0.0.1"
    proxyName: 'xxx'
parameters:
  sync_response: true
  httpMethod: GET
  path: xxx
  port: 8081
  exportQuery:
    username: username
global:
  username: "={{ $last.username }}"
`
const getsecretKey = async () => {
  const { data } = await ListSecrets()
  console.log(data)
  secretKeyTypeData.value = data
}
// 从服务端获取节点类型和模版
async function fetchNodeTemplates() {
  try {
    const response = await getWorkflowNodes()
    availableNodeTypes.value = response.data.map((node) => node.type)
    response.data.forEach((node) => {
      nodeTemplates[node.type] = node.template
    })

    // 默认选中第一个类型
    if (availableNodeTypes.value.length > 0) {
      selectedNodeType.value = availableNodeTypes.value[0]
      yamlContent.value = nodeTemplates[selectedNodeType.value]
    }
  } catch (error) {
    console.error('获取节点模版信息失败，使用默认模版', error)
    // 设置默认节点类型和模板
    availableNodeTypes.value = ['webhook']
    nodeTemplates['webhook'] = defaultYamlText
    selectedNodeType.value = 'webhook'
    yamlContent.value = defaultYamlText
  }
}

// 监听节点类型切换
watch(selectedNodeType, (newType) => {
  if (newType && nodeTemplates[newType]) {
    yamlContent.value = nodeTemplates[newType]
  }
})

// 保存 YAML 内容并添加节点
function saveYamlContent() {
  try {
    const nodeData = yaml.load(yamlContent.value)
    nodeData.name = `new_node-${nodes.value.length + 1}`

    const newNode = {
      id: nodeData.name,
      type: 'node',
      position: {
        x: 0.5 * dimensions.value.width,
        y: 0.5 * dimensions.value.height,
      },
      data: nodeData,
      secret: {
        secret_type: secretKeyType.value.type,
        secret_name: secretKeyType.value.name,
        secret_id: secretKeyType.value.id,
      },
    }

    addNodes([newNode])
    console.log('添加节点成功', newNode)
  } catch (error) {
    console.error('添加节点失败 YAML 格式错误', error)
  }
}

// 初始化加载节点模版
fetchNodeTemplates()
getsecretKey()
</script>

<template>
  <el-form label-position="top" label-width="100px">
    <el-form-item label="选择节点类型">
      <el-select v-model="selectedNodeType" placeholder="请选择节点类型">
        <el-option v-for="type in availableNodeTypes" :key="type" :label="type" :value="type" />
      </el-select>
    </el-form-item>
    <el-form-item label="选择密钥">
      <el-select v-model="secretKeyType" placeholder="请选择密钥">
        <el-option v-for="type in secretKeyTypeData" :key="type.id" :label="type.name" :value="type" />
      </el-select>
    </el-form-item>

    <el-form-item label="节点配置">
      <el-input
        v-model="yamlContent"
        autosize
        placeholder="编辑节点信息 (YAML 格式)"
        :rows="30"
        style="width: 100%; font-family: monospace"
        type="textarea"
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="saveYamlContent">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<style>
.el-table {
  width: 100%;
}
</style>
