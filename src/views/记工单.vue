<template>
  <div class="tab-container">
    <el-tabs v-model="activeTab" type="card">
      <el-tab-pane label="工作任务日报" name="daily">
        <div class="header">
          <div class="header-title">工作任务日报表</div>
          <div class="controls-container">
            <el-date-picker
              v-model="selectedDate"
              type="date"
              placeholder="选择日期"
              style="width: 160px"
              :disabled="editMode"
            />
            <el-button @click="editMode = true" :disabled="editMode" type="primary">编辑</el-button>
            <el-button @click="saveDaily" :disabled="!editMode" type="success">保存数据</el-button>
          </div>
        </div>
        <div class="table-wrapper">
          <el-table
            :data="dailyRows"
            border
            style="width: 100%"
            :span-method="mergeWorkshop"
            height="500"
          >
            <el-table-column label="序号" width="60">
              <template #default="scope">{{ scope.$index + 1 }}</template>
            </el-table-column>
            <el-table-column prop="workshop" label="车间" width="120" />
            <el-table-column prop="task" label="工作任务" min-width="180">
              <template #default="scope">
                <el-input
                  v-if="editMode"
                  v-model="scope.row.task"
                  type="textarea"
                  autosize
                  placeholder="请输入工作任务"
                />
                <span v-else>{{ scope.row.task }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="num_people" label="人数" width="80">
              <template #default="scope">
                <el-input
                  v-if="editMode"
                  v-model="scope.row.num_people"
                  type="number"
                  placeholder="人数"
                />
                <span v-else>{{ scope.row.num_people }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="labor_cost" label="人工工资" width="100">
              <template #default="scope">
                <el-input
                  v-if="editMode"
                  v-model="scope.row.labor_cost"
                  type="number"
                  placeholder="工资"
                />
                <span v-else>{{ scope.row.labor_cost }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="time_spent" label="时间" width="90">
              <template #default="scope">
                <el-input
                  v-if="editMode"
                  v-model="scope.row.time_spent"
                  placeholder="HH:MM"
                />
                <span v-else>{{ scope.row.time_spent }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="remarks" label="备注" min-width="160">
              <template #default="scope">
                <el-input
                  v-if="editMode"
                  v-model="scope.row.remarks"
                  type="textarea"
                  autosize
                  placeholder="备注"
                />
                <span v-else style="white-space: pre-line;">{{ scope.row.remarks }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="workshop_cost" label="成本(人·h)" width="120">
              <template #default="scope">
                <el-input
                  v-if="editMode && isFirstRow(scope.$index)"
                  v-model="scope.row.workshop_cost"
                  type="number"
                  placeholder="车间总成本"
                />
                <span v-else-if="isFirstRow(scope.$index)">{{ scope.row.workshop_cost }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template #default="scope">
                <el-button
                  v-if="editMode && isFirstRow(scope.$index)"
                  size="small"
                  @click="addRow(scope.row.workshop)"
                  >添加</el-button>
                <el-button
                  v-if="editMode && !isFirstRow(scope.$index)"
                  size="small"
                  type="danger"
                  @click="removeRow(scope.$index)"
                  >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="月度汇总分析" name="monthly">
        <div style="padding: 40px 0; text-align: center; color: #888;">
          <el-icon style="font-size:40px;"><i class="el-icon-data-analysis"></i></el-icon>
          <div style="margin-top: 16px;">月度汇总分析功能开发中...</div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('daily')
const editMode = ref(false)
const selectedDate = ref(new Date().toISOString().slice(0, 10))
const workshops = [
  '砂浆车间', '膏料车间', '真金板车间', '石墨车间', '切割车间',
  '一体板', '免拆模板', '免拆板切割', '化验室', '线条', '机修'
]

// 初始化每个车间一行
const dailyRows = ref(
  workshops.map(w => ({
    workshop: w,
    task: '',
    num_people: '',
    labor_cost: '',
    time_spent: '',
    remarks: '',
    workshop_cost: ''
  }))
)

function isFirstRow(index) {
  if (index === 0) return true
  const ws = dailyRows.value[index].workshop
  for (let i = 0; i < index; i++) {
    if (dailyRows.value[i].workshop === ws) return false
  }
  return true
}

function mergeWorkshop({ row, column, rowIndex }) {
  if (column.property === 'workshop' || column.property === 'workshop_cost') {
    const ws = row.workshop
    let count = 0
    for (let i = rowIndex; i < dailyRows.value.length; i++) {
      if (dailyRows.value[i].workshop === ws) count++
      else break
    }
    if (isFirstRow(rowIndex)) {
      return { rowspan: count, colspan: 1 }
    } else {
      return { rowspan: 0, colspan: 0 }
    }
  }
}

function addRow(workshop) {
  // 在该车间最后一行后插入
  let lastIdx = -1
  for (let i = dailyRows.value.length - 1; i >= 0; i--) {
    if (dailyRows.value[i].workshop === workshop) {
      lastIdx = i
      break
    }
  }
  if (lastIdx !== -1) {
    dailyRows.value.splice(lastIdx + 1, 0, {
      workshop,
      task: '',
      num_people: '',
      labor_cost: '',
      time_spent: '',
      remarks: '',
      workshop_cost: ''
    })
  }
}

function removeRow(idx) {
  dailyRows.value.splice(idx, 1)
}

function saveDaily() {
  editMode.value = false
  // TODO: 保存到后端
}
</script>

<style scoped>
.tab-container {
  background: #f5f7fa;
  min-height: 100vh;
  padding: 0 0 40px 0;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: white;
  border-bottom: 1px solid #e0e0e0;
}
.header-title {
  font-size: 20px;
  font-weight: 600;
  color: #2980b9;
}
.controls-container {
  display: flex;
  align-items: center;
  gap: 15px;
}
.table-wrapper {
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  margin: 0 0 24px 0;
}
</style>
