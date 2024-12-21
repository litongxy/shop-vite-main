<template>
  <div>
    <!-- Node Content -->
    <div @click="editNode">
      {{ data.name }}
    </div>

    <handle type="target" :position="Position.Left" />
    <handle type="source" :position="Position.Right" />

    <!-- Sidebar for YAML Editor -->
    <el-drawer title="编辑节点" v-model="isDrawerVisible" append-to-body size="40%">
      <el-form label-position="top" label-width="100px" >
        <el-form-item label="节点配置" >
          <el-input
            type="textarea"
            v-model="yamlContent"
            :rows="30"
            autosize
            placeholder="编辑节点信息 (YAML 格式)"
            style="width: 100%; font-family: monospace;"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveYamlContent">保存</el-button>
          <el-button @click="isDrawerVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import yaml from 'js-yaml';
import { Handle, Position, useVueFlow } from '@vue-flow/core';

const props = defineProps(['id', 'data']);
const { updateNodeData, removeNode } = useVueFlow();

const isDrawerVisible = ref(false);
const yamlContent = ref('');

function runNode() {
  console.log(`运行节点: ${props.id}`);
}

function editNode() {
  console.log(`编辑节点: ${props.id}`);
  yamlContent.value = yaml.dump(props.data);
  isDrawerVisible.value = true;
}

function queryRunData() {
  console.log(`查询运行数据: ${props.id}`);
}

function deleteNode() {
  console.log(`删除节点: ${props.id}`);
  removeNode(props.id);
}

function saveYamlContent() {
  try {
    const updatedData = yaml.load(yamlContent.value);
    updateNodeData(props.id, updatedData);
    console.log('节点更新成功', updatedData);
    isDrawerVisible.value = false;
  } catch (error) {
    console.error('YAML 格式错误', error);
  }
}
</script>

<style scoped>

</style>
