<!-- Flowchart.vue -->
<script setup>
/* these are necessary styles for vue flow */
import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';
import {createWorklflow, getInitWorkflow, getWorkflow, updateWorklflow} from "/@/api/workflow";
import WorkflowNode from "/@/views/workflow/components/WorkflowNode.vue"
import WorkflowNodeEdit from  '/@/views/workflow/components/WorklfowNodeEdit.vue'
import yaml from "js-yaml";
import { ref } from 'vue'
import { Position ,VueFlow , useVueFlow } from '@vue-flow/core'
import useDragAndDrop from './useDnD'
import {getWorkflowSaveData, transformToGraphFormat} from "/@/utils/workflow";

const { onDragOver, onDrop, onDragLeave, isDragOver } = useDragAndDrop()
const { onConnect, addEdges } = useVueFlow()
const { _nodes, addNodes, dimensions, toObject, fromObject } = useVueFlow()
const route  = useRoute()

const isEditNodeDrawerVisible = ref(false)
const isShowRawYamlDrawerVisible = ref(false)
const workflowRawYaml = ref('')

onConnect(addEdges)

const nodes = ref([])
const edges = ref([])
const workflowData = ref({})

onBeforeMount(async () => {
  let getWorkflowResp = null
  if (route.query.name) {
     getWorkflowResp = await getWorkflow(route.query.name)
  }else {
     getWorkflowResp = await getInitWorkflow()
  }

  const graphData = transformToGraphFormat(getWorkflowResp.data)
  workflowData.value = getWorkflowResp.data
  nodes.value = graphData.nodes
  setTimeout(() =>{
    // 添加node节点后 需要等一会在更新连接关系
    edges.value = graphData.edges
  } , 100)
})

async function onSave() {
  const obj = toObject()
  const newWorkflow = getWorkflowSaveData(workflowData.value, obj.nodes, obj.edges)
  if (workflowData.value.id > 0) {
    await updateWorklflow(newWorkflow.name, newWorkflow)
    $baseMessage('保存成功', 'success', 'hey')
  } else {
    const resp = await createWorklflow(newWorkflow.name, newWorkflow)
    console.log(resp, 'resp')
    $baseMessage('创建成功', 'success', 'hey')
  }
}

function showRawYaml() {
  const obj = toObject()
  const showContent = {
    nodes: obj.nodes,
    edges: obj.edges
  }
  const showYaml = yaml.dump(showContent)
  workflowRawYaml.value = showYaml
  isShowRawYamlDrawerVisible.value = true
}

function openAddNodeDrawer() {
  isEditNodeDrawerVisible.value = true
}

</script>

<template>
  <div style="width: 100%;height: 700px" @drop="onDrop">
    <el-button type="primary" @click="onSave">保存</el-button>
    <el-button type="primary" @click="showRawYaml">原始YAML</el-button>
    <el-button type="primary" @click="openAddNodeDrawer">添加节点</el-button>
    <vue-flow v-model:edges="edges" v-model:nodes="nodes" @dragleave="onDragLeave" @dragover="onDragOver">
      <template #node-node="props">
        <workflow-node :id="props.id" :data="props.data"/>
      </template>
      <p v-if="isDragOver">Drop here</p>
    </vue-flow>

    <el-drawer v-model="isEditNodeDrawerVisible" append-to-body size="40%" title="编辑节点">
      <workflow-node-edit />
    </el-drawer>

    <el-drawer v-model="isShowRawYamlDrawerVisible" append-to-body size="40%" title="编辑节点">
     <pre>{{workflowRawYaml}}</pre>
    </el-drawer>

  </div>
</template>

<style >

.vue-flow__node-toolbar button {
  background: #4a5568;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
}

.vue-flow__node-toolbar button.selected {
  background: #2563eb;
}

.vue-flow__node-toolbar button:hover {
  background: #2563eb;
}

.vue-flow__node-menu {
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.vue-flow__node-menu.selected {
  box-shadow: 0 0 0 2px #2563eb;
}

.vue-flow__node-node {
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.vue-flow__node-node.selected {
  box-shadow: 0 0 0 2px #2563eb;
}

</style>
