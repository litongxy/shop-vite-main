<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="24">
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item label="密钥类型：">
            <el-input v-model="queryForm.name" clearable placeholder="请输入名称" />
          </el-form-item>
          <el-form-item label="密钥类型：">
            <el-input v-model="queryForm.type" clearable placeholder="请输入名称" />
          </el-form-item>
        </el-form>
        <el-button :icon="Plus" type="primary" @click="handleAdd('add')">添加</el-button>
      </vab-query-form-left-panel>
    </vab-query-form>
    <el-table ref="tableRef" v-loading="listLoading" border :data="list" @selection-change="setSelectRows">
      <el-table-column type="selection" width="38" />
      <el-table-column align="center" label="序号" width="55">
        <template #default="{ $index }">
          {{ $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="密钥名称" min-width="200" prop="name" />

      <el-table-column align="center" label="密钥类型" min-width="200" prop="type" />

      <el-table-column align="center" label="操作" :width="215">
        <template #default="{ row }">
          <div>
            <el-button text type="primary" @click="handleAdd('edit', row)">编辑</el-button>
            <el-button text type="danger" @click="handleDelete(row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <default-detail ref="editRef" @fetch-data="fetchData" />
  </div>
</template>

<script lang="ts" setup>
import { Plus } from '@element-plus/icons-vue'
import { ref } from 'vue'

import defaultDetail from './detail.vue'
import { ListSecrets, deleteSecrets, getSecretsDetail } from '/@/api/secretkey'

const listLoading = ref<boolean>(true)
const list = ref<any>([])
const total = ref<number>(0)
const editRef = ref<any>(null)

const queryForm = reactive<any>({
  pageNo: 1,
  pageSize: 20,
})
defineOptions({
  name: 'DefaultTable',
})
onBeforeMount(() => {
  fetchData()
})
const handleAdd = async (isedit: string, row?: any) => {
  editRef.value.showEdit()
  if (isedit == 'add') {
    editRef.value.showEdit(isedit)
  } else {
    const data = await getSecretsDetail(row.id)
    console.log(data.data, 'data')
    editRef.value.showEdit(isedit, data.data)
  }
}
const fetchData = async () => {
  listLoading.value = true
  const { data } = await ListSecrets(queryForm)
  console.log(data, 'data')
  list.value = data
  total.value = data.length
  listLoading.value = false
}
const handleDelete = (row: { id: any }) => {
  $baseConfirm('确定删除吗？', null, async () => {
    try {
      await deleteSecrets(row.id)
      $baseMessage('删除成功', 'success', 'hey')
      await fetchData()
    } catch (error) {
      $baseMessage(error, 'error', 'hey')
    }
  })
}
</script>

<style lang="scss" scoped></style>
