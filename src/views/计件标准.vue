<template>
  <div class="container">
    <!-- 控制区 -->
    <div class="controls-section">
      <div class="search-area">
        <el-input
          v-model="search"
          placeholder="请输入类型查询关键字"
          style="width:250px"
          @keyup.enter="doSearch"
          clearable
          size="large"
        />
        <el-button type="primary" @click="doSearch" size="large">查询</el-button>
        <el-button @click="clearSearch" size="large">清除</el-button>
      </div>
      <el-button type="primary" @click="openAdd" size="large">添加</el-button>
    </div>
    <!-- 表格区 -->
    <div class="table-wrapper">
      <el-table
        :data="filteredData"
        border
        style="width: 100%"
        :span-method="mergeProcess"
        height="400"
        max-height="400"
        v-loading="loading"
        empty-text="暂无数据"
        :header-cell-style="headerCellStyle"
        header-row-class-name="fixed-header"
      >
        <el-table-column prop="process" label="工序" width="120" />
        <el-table-column prop="type" label="类型" min-width="200" />
        <el-table-column prop="unit_price" label="单价" width="120" />
        <el-table-column prop="remark1" label="备注1" min-width="120" />
        <el-table-column prop="remark2" label="备注2" min-width="120" />
        <el-table-column label="操作" width="140">
          <template #default="scope">
            <el-button size="small" @click="openEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="420px" class="custom-dialog">
      <el-form :model="form" label-width="70px" size="large">
        <el-form-item label="工序">
          <el-input v-model="form.process" />
        </el-form-item>
        <el-form-item label="类型">
          <el-input v-model="form.type" />
        </el-form-item>
        <el-form-item label="单价">
          <el-input v-model="form.unit_price" />
        </el-form-item>
        <el-form-item label="备注1">
          <el-input v-model="form.remark1" type="textarea" />
        </el-form-item>
        <el-form-item label="备注2">
          <el-input v-model="form.remark2" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible=false" size="large">取消</el-button>
        <el-button type="primary" @click="save" size="large">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const search = ref('')
const dialogVisible = ref(false)
const dialogTitle = ref('添加新项目')
const form = ref({ id: null, process: '', type: '', unit_price: '', remark1: '', remark2: '' })

const data = ref([
  { id: 1, process: '抹灰', type: '外墙抹灰', unit_price: '30', remark1: '标准工艺', remark2: '' },
  { id: 2, process: '抹灰', type: '内墙抹灰', unit_price: '25', remark1: '', remark2: '' },
  { id: 3, process: '贴砖', type: '卫生间地砖', unit_price: '40', remark1: '', remark2: '' },
  { id: 4, process: '贴砖', type: '厨房墙砖', unit_price: '38', remark1: '', remark2: '' }
])

const filteredData = computed(() => {
  if (!search.value) return data.value
  return data.value.filter(item => item.type.includes(search.value))
})

function doSearch() {
  // 这里只需触发 filteredData 计算属性即可
}
function clearSearch() {
  search.value = ''
}
function openAdd() {
  dialogTitle.value = '添加新项目'
  form.value = { id: null, process: '', type: '', unit_price: '', remark1: '', remark2: '' }
  dialogVisible.value = true
}
function openEdit(row) {
  dialogTitle.value = '编辑项目'
  form.value = { ...row }
  dialogVisible.value = true
}
function save() {
  if (!form.value.process || !form.value.type) {
    ElMessage.warning('工序和类型不能为空')
    return
  }
  if (form.value.id) {
    // 编辑
    const idx = data.value.findIndex(d => d.id === form.value.id)
    if (idx > -1) data.value[idx] = { ...form.value }
    ElMessage.success('修改成功')
  } else {
    // 新增
    form.value.id = Date.now()
    data.value.push({ ...form.value })
    ElMessage.success('添加成功')
  }
  dialogVisible.value = false
}
function del(row) {
  data.value = data.value.filter(d => d.id !== row.id)
  ElMessage.success('删除成功')
}

// 合并工序单元格
function mergeProcess({ row, column, rowIndex }) {
  if (column.property === 'process') {
    const process = row.process
    let count = 0
    for (let i = rowIndex; i < filteredData.value.length; i++) {
      if (filteredData.value[i].process === process) count++
      else break
    }
    // 只在第一个出现的地方合并
    if (rowIndex === 0 || filteredData.value[rowIndex - 1].process !== process) {
      return { rowspan: count, colspan: 1 }
    } else {
      return { rowspan: 0, colspan: 0 }
    }
  }
}

// 表头样式
const headerCellStyle = () => ({
  background: '#f5f7fa',
  color: '#333',
  fontWeight: 'bold',
  fontSize: '16px'
})
</script>

<style scoped>
.container {
  width: 100%;
  margin: 0 auto;
  padding: 30px 30px 16px 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  min-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
.controls-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
  flex-shrink: 0;
}
.search-area {
  display: flex;
  align-items: center;
  gap: 14px;
}
.table-wrapper {
  flex: 1 1 auto;
  overflow: auto;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  min-height: 320px;
  padding: 16px 8px 8px 8px;
  border: 1px solid #ebeef5;
  display: flex;
  flex-direction: column;
}
:deep(.el-table) {
  border-radius: 10px;
  font-size: 15px;
}
:deep(.el-table .el-table__header-wrapper th) {
  background: #f5f7fa !important;
  color: #333 !important;
  font-weight: bold;
  font-size: 16px;
}
:deep(.el-table .el-table__body-wrapper) {
  background: #fff;
}
:deep(.el-table .el-table__row) {
  transition: background 0.2s;
}
:deep(.el-table .el-table__row:hover) {
  background: #f0f6ff;
}
:deep(.el-table .el-button) {
  margin-right: 6px;
}
.custom-dialog :deep(.el-dialog__body) {
  padding-top: 18px;
  padding-bottom: 8px;
}
.custom-dialog :deep(.el-form-item) {
  margin-bottom: 18px;
}
.custom-dialog :deep(.el-input__inner) {
  font-size: 15px;
}
</style>
