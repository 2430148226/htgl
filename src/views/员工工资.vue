<template>
  <div class="salary-container">
    <!-- 顶部操作区域 -->
    <div class="top-actions-container">
      <!-- 左侧月份选择器 -->
      <div class="month-selector">
        <el-button class="month-selector-btn" @click="prevMonth">
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <div class="month-display" @click="showMonthPicker = !showMonthPicker">
          {{ currentYear }}年{{ currentMonth }}月
        </div>
        <el-button class="month-selector-btn" @click="nextMonth">
          <el-icon><ArrowRight /></el-icon>
        </el-button>
        <!-- 月份选择下拉菜单 -->
        <div class="month-dropdown" :class="{ show: showMonthPicker }">
          <div
            v-for="m in 12"
            :key="m"
            class="month-option"
            :class="{ active: m === currentMonth }"
            @click="selectMonth(m)"
          >
            {{ m }}月
          </div>
        </div>
      </div>
      
      <!-- 中间的标签页 -->
      <div class="department-tabs-container tabs-fixed">
        <div class="department-tabs-wrapper">
          <div 
            v-for="dept in departments" 
            :key="dept.id"
            class="department-tab"
            :class="{ active: activeTab === dept.id }"
            @click="activeTab = dept.id"
          >
            {{ dept.name }}
          </div>
        </div>
      </div>

      <!-- 右侧操作按钮 -->
      <div class="action-buttons">
        <el-button type="success" @click="exportSalary">
          <el-icon><Download /></el-icon> 导出工资表
        </el-button>
        <el-button type="primary" @click="printSalary">
          <el-icon><Printer /></el-icon> 打印工资表
        </el-button>
        <el-button type="primary" @click="openAddEntryModal">
          <el-icon><Plus /></el-icon> 添加
        </el-button>
      </div>
    </div>

    <!-- 表格内容区域 -->
    <div class="table-content-wrapper">
      <!-- 加载中遮罩 -->
      <div v-if="loading" class="loading-overlay">
        <div class="spinner-border" role="status"></div>
        <p>数据加载中，请稍候...</p>
      </div>
      
      <!-- 砂浆车间表格 -->
      <div v-if="activeTab === 'sj'" class="department-table-container table-sticky-header">
        <table class="data-table">
          <thead>
            <tr>
              <th style="position: sticky; top: 0; z-index: 2;">序号</th>
              <th style="position: sticky; top: 0; z-index: 2;">姓名</th>
              <th style="position: sticky; top: 0; z-index: 2;">类别</th>
              <th v-for="day in daysInMonth" :key="day" style="position: sticky; top: 0; z-index: 2;">{{ day }}</th>
              <th style="position: sticky; top: 0; z-index: 2;">合计</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(person, personIndex) in sjData" :key="person.id">
              <template v-for="(category, categoryIndex) in displayCategories" :key="`${person.id}-${category}`">
                <tr :data-person="person.name" :data-category="category" :class="{ 'subtotal-row': category === '小计' }">
                  <td v-if="categoryIndex === 0" :rowspan="displayCategories.length">{{ personIndex + 1 }}</td>
                  <td v-if="categoryIndex === 0" :rowspan="displayCategories.length">{{ person.name }}</td>
                  <td>{{ category }}</td>
                  <td v-for="day in daysInMonth" :key="day" class="data-cell" :data-day="day">
                    {{ getDayValue(person, category, day) }}
                  </td>
                  <td class="row-total">{{ getRowTotal(person, category) }}</td>
                </tr>
              </template>
            </template>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3">总合计</td>
              <td v-for="day in daysInMonth" :key="day" class="grand-total-day">
                {{ getDayGrandTotal(day) }}
              </td>
              <td class="grand-total-overall">{{ getOverallGrandTotal() }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      <!-- 膏料车间表格 -->
      <div v-else-if="activeTab === 'gy'" class="department-table-container table-sticky-header">
        <table class="data-table">
          <thead>
            <tr>
              <th style="position: sticky; top: 0; z-index: 2;">序号</th>
              <th style="position: sticky; top: 0; z-index: 2;">姓名</th>
              <th style="position: sticky; top: 0; z-index: 2;">类别</th>
              <th v-for="day in daysInMonth" :key="day" style="position: sticky; top: 0; z-index: 2;">{{ day }}</th>
              <th style="position: sticky; top: 0; z-index: 2;">合计</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(person, personIndex) in gyData" :key="person.id">
              <template v-for="(category, categoryIndex) in gyCategories" :key="`${person.id}-${category}`">
                <tr :data-person="person.name" :data-category="category" :class="{ 'subtotal-row': category === '小计' }">
                  <td v-if="categoryIndex === 0" :rowspan="gyCategories.length">{{ personIndex + 1 }}</td>
                  <td v-if="categoryIndex === 0" :rowspan="gyCategories.length">{{ person.name }}</td>
                  <td>{{ category }}</td>
                  <td v-for="day in daysInMonth" :key="day" class="data-cell" :data-day="day">
                    {{ getGyDayValue(person, category, day) }}
                  </td>
                  <td class="row-total">{{ getGyRowTotal(person, category) }}</td>
                </tr>
              </template>
            </template>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3">总合计</td>
              <td v-for="day in daysInMonth" :key="day" class="grand-total-day">
                {{ getGyDayGrandTotal(day) }}
              </td>
              <td class="grand-total-overall">{{ getGyOverallGrandTotal() }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      <!-- 真金板车间表格 -->
      <div v-else-if="activeTab === 'zjb'" class="department-table-container table-sticky-header">
        <table class="data-table">
          <thead>
            <tr>
              <th style="position: sticky; top: 0; z-index: 2;">序号</th>
              <th style="position: sticky; top: 0; z-index: 2;">姓名</th>
              <th style="position: sticky; top: 0; z-index: 2;">类别</th>
              <th v-for="day in daysInMonth" :key="day" style="position: sticky; top: 0; z-index: 2;">{{ day }}</th>
              <th style="position: sticky; top: 0; z-index: 2;">合计</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(person, personIndex) in zjbData" :key="person.id">
              <template v-for="(category, categoryIndex) in zjbCategories" :key="`${person.id}-${category}`">
                <tr :data-person="person.name" :data-category="category" :class="{ 'subtotal-row': category === '小计' }">
                  <td v-if="categoryIndex === 0" :rowspan="zjbCategories.length">{{ personIndex + 1 }}</td>
                  <td v-if="categoryIndex === 0" :rowspan="zjbCategories.length">{{ person.name }}</td>
                  <td>{{ category }}</td>
                  <td v-for="day in daysInMonth" :key="day" class="data-cell" :data-day="day">
                    {{ getZjbDayValue(person, category, day) }}
                  </td>
                  <td class="row-total">{{ getZjbRowTotal(person, category) }}</td>
                </tr>
              </template>
            </template>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3">总合计</td>
              <td v-for="day in daysInMonth" :key="day" class="grand-total-day">
                {{ getZjbDayGrandTotal(day) }}
              </td>
              <td class="grand-total-overall">{{ getZjbOverallGrandTotal() }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      <!-- 石墨车间表格 -->
      <div v-else-if="activeTab === 'sm'" class="department-table-container table-sticky-header">
        <table class="data-table">
          <thead>
            <tr>
              <th style="position: sticky; top: 0; z-index: 2;">序号</th>
              <th style="position: sticky; top: 0; z-index: 2;">姓名</th>
              <th style="position: sticky; top: 0; z-index: 2;">类别</th>
              <th v-for="day in daysInMonth" :key="day" style="position: sticky; top: 0; z-index: 2;">{{ day }}</th>
              <th style="position: sticky; top: 0; z-index: 2;">合计</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(person, personIndex) in smData" :key="person.id">
              <template v-for="(category, categoryIndex) in smCategories" :key="`${person.id}-${category}`">
                <tr :data-person="person.name" :data-category="category" :class="{ 'subtotal-row': category === '小计' }">
                  <td v-if="categoryIndex === 0" :rowspan="smCategories.length">{{ personIndex + 1 }}</td>
                  <td v-if="categoryIndex === 0" :rowspan="smCategories.length">{{ person.name }}</td>
                  <td>{{ category }}</td>
                  <td v-for="day in daysInMonth" :key="day" class="data-cell" :data-day="day">
                    {{ getSmDayValue(person, category, day) }}
                  </td>
                  <td class="row-total">{{ getSmRowTotal(person, category) }}</td>
                </tr>
              </template>
            </template>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3">总合计</td>
              <td v-for="day in daysInMonth" :key="day" class="grand-total-day">
                {{ getSmDayGrandTotal(day) }}
              </td>
              <td class="grand-total-overall">{{ getSmOverallGrandTotal() }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      <!-- 切割车间表格 -->
      <div v-else-if="activeTab === 'qg'" class="department-table-container table-sticky-header">
        <table class="data-table">
          <thead>
            <tr>
              <th style="position: sticky; top: 0; z-index: 2;">序号</th>
              <th style="position: sticky; top: 0; z-index: 2;">姓名</th>
              <th style="position: sticky; top: 0; z-index: 2;">类别</th>
              <th v-for="day in daysInMonth" :key="day" style="position: sticky; top: 0; z-index: 2;">{{ day }}</th>
              <th style="position: sticky; top: 0; z-index: 2;">合计</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(person, personIndex) in qgData" :key="person.id">
              <template v-for="(category, categoryIndex) in qgCategories" :key="`${person.id}-${category}`">
                <tr :data-person="person.name" :data-category="category" :class="{ 'subtotal-row': category === '小计' }">
                  <td v-if="categoryIndex === 0" :rowspan="qgCategories.length">{{ personIndex + 1 }}</td>
                  <td v-if="categoryIndex === 0" :rowspan="qgCategories.length">{{ person.name }}</td>
                  <td>{{ category }}</td>
                  <td v-for="day in daysInMonth" :key="day" class="data-cell" :data-day="day">
                    {{ getQgDayValue(person, category, day) }}
                  </td>
                  <td class="row-total">{{ getQgRowTotal(person, category) }}</td>
                </tr>
              </template>
            </template>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3">总合计</td>
              <td v-for="day in daysInMonth" :key="day" class="grand-total-day">
                {{ getQgDayGrandTotal(day) }}
              </td>
              <td class="grand-total-overall">{{ getQgOverallGrandTotal() }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      <!-- 免拆模板表格 -->
      <div v-else-if="activeTab === 'mcmb'" class="department-table-container table-sticky-header">
        <table class="data-table">
          <thead>
            <tr>
              <th style="position: sticky; top: 0; z-index: 2;">序号</th>
              <th style="position: sticky; top: 0; z-index: 2;">姓名</th>
              <th style="position: sticky; top: 0; z-index: 2;">类别</th>
              <th v-for="day in daysInMonth" :key="day" style="position: sticky; top: 0; z-index: 2;">{{ day }}</th>
              <th style="position: sticky; top: 0; z-index: 2;">合计</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(person, personIndex) in mcmbData" :key="person.id">
              <template v-for="(category, categoryIndex) in mcmbCategories" :key="`${person.id}-${category}`">
                <tr :data-person="person.name" :data-category="category" :class="{ 'subtotal-row': category === '小计' }">
                  <td v-if="categoryIndex === 0" :rowspan="mcmbCategories.length">{{ personIndex + 1 }}</td>
                  <td v-if="categoryIndex === 0" :rowspan="mcmbCategories.length">{{ person.name }}</td>
                  <td>{{ category }}</td>
                  <td v-for="day in daysInMonth" :key="day" class="data-cell" :data-day="day">
                    {{ getMcmbDayValue(person, category, day) }}
                  </td>
                  <td class="row-total">{{ getMcmbRowTotal(person, category) }}</td>
                </tr>
              </template>
            </template>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3">总合计</td>
              <td v-for="day in daysInMonth" :key="day" class="grand-total-day">
                {{ getMcmbDayGrandTotal(day) }}
              </td>
              <td class="grand-total-overall">{{ getMcmbOverallGrandTotal() }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      <!-- 化验室表格 -->
      <div v-else-if="activeTab === 'hys'" class="department-table-container table-sticky-header">
        <table class="data-table">
          <thead>
            <tr>
              <th style="position: sticky; top: 0; z-index: 2;">序号</th>
              <th style="position: sticky; top: 0; z-index: 2;">姓名</th>
              <th style="position: sticky; top: 0; z-index: 2;">类别</th>
              <th v-for="day in daysInMonth" :key="day" style="position: sticky; top: 0; z-index: 2;">{{ day }}</th>
              <th style="position: sticky; top: 0; z-index: 2;">合计</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(person, personIndex) in hysData" :key="person.id">
              <template v-for="(category, categoryIndex) in hysCategories" :key="`${person.id}-${category}`">
                <tr :data-person="person.name" :data-category="category" :class="{ 'subtotal-row': category === '小计' }">
                  <td v-if="categoryIndex === 0" :rowspan="hysCategories.length">{{ personIndex + 1 }}</td>
                  <td v-if="categoryIndex === 0" :rowspan="hysCategories.length">{{ person.name }}</td>
                  <td>{{ category }}</td>
                  <td v-for="day in daysInMonth" :key="day" class="data-cell" :data-day="day">
                    {{ getHysDayValue(person, category, day) }}
                  </td>
                  <td class="row-total">{{ getHysRowTotal(person, category) }}</td>
                </tr>
              </template>
            </template>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3">总合计</td>
              <td v-for="day in daysInMonth" :key="day" class="grand-total-day">
                {{ getHysDayGrandTotal(day) }}
              </td>
              <td class="grand-total-overall">{{ getHysOverallGrandTotal() }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      <!-- 其他车间表格 -->
      <div v-else class="department-table-container">
        <el-table
          :data="salaryData"
          border
          :span-method="mergeRows"
          :header-cell-style="headerStyle"
          cell-class-name="table-cell-center"
          height="600"
          :scrollbar-always-on="true"
          :fixed="true"
        >
          <el-table-column label="序号" width="60" align="center" fixed="left">
            <template #default="scope">{{ scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="100" align="center" fixed="left" />
          <el-table-column prop="position" label="岗位" width="120" align="center" />
          <el-table-column prop="baseSalary" label="基本工资" width="90" align="center" />
          <el-table-column prop="performance" label="绩效工资" width="90" align="center" />
          <el-table-column prop="overtime" label="加班费" width="90" align="center" />
          <el-table-column prop="bonus" label="奖金" width="90" align="center" />
          <el-table-column prop="attendance" label="全勤奖" width="90" align="center" />
          <el-table-column prop="subsidy" label="补贴" width="90" align="center" />
          <el-table-column prop="subtotal" label="小计" width="90" align="center" />
          <el-table-column prop="totalWorkdays" label="出勤天数" width="90" align="center" />
          <el-table-column prop="socialInsurance" label="社保" width="90" align="center" />
          <el-table-column prop="housingFund" label="公积金" width="90" align="center" />
          <el-table-column prop="tax" label="个税" width="90" align="center" />
          <el-table-column prop="actualPay" label="实发工资" width="120" align="center" />
          <el-table-column prop="remark" label="备注" min-width="120" align="center" />
        </el-table>
      </div>
      
      <!-- 没有数据时显示的提示 -->
      <div
        v-if="(activeTab === 'sj' ? sjData.length === 0 : (activeTab === 'gy' ? gyData.length === 0 : (activeTab === 'zjb' ? zjbData.length === 0 : (activeTab === 'sm' ? smData.length === 0 : qgData.length === 0)))) && !loading"
        class="no-data-tip"
      >
        <el-empty description="暂无工资数据" />
      </div>
    </div>

    <!-- 添加工资记录对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="添加记录"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="form" label-width="100px">
        <el-form-item label="选择日期">
          <el-date-picker
            v-model="form.entryDate"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="选择人员">
          <div class="person-selection-container">
            <div class="select-all-option">
              <el-checkbox v-model="selectAll" @change="handleSelectAll">
                全选/全不选
              </el-checkbox>
              <span class="selected-count">已选 {{ selectedPersonCount }} 人</span>
            </div>
            <el-divider />
            <div class="person-checkboxes">
              <el-checkbox
                v-for="person in persons"
                :key="person.id"
                v-model="person.selected"
                @change="updateSelectAllState"
              >
                {{ person.name }}
              </el-checkbox>
            </div>
          </div>
        </el-form-item>
        
        <el-form-item label="选择类别">
          <el-select v-model="form.category" style="width: 100%">
            <el-option
              v-for="category in categories"
              :key="category.value"
              :label="category.label"
              :value="category.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="操作方式">
          <el-radio-group v-model="form.mode">
            <el-radio label="accumulate">累加</el-radio>
            <el-radio label="overwrite">覆盖</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="输入金额">
          <el-input 
            v-model="form.amount" 
            placeholder="例如: 100 (留空表示清除/无)"
            type="text"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveEntry" :loading="saving">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { ArrowLeft, ArrowRight, Download, Printer, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 当前选中的部门和月份
const activeTab = ref('sj')
const currentYear = ref(new Date().getFullYear())
const currentMonth = ref(new Date().getMonth() + 1)
const showMonthPicker = ref(false)
const loading = ref(false)
const dialogVisible = ref(false)
const saving = ref(false)

// 部门数据
const departments = [
  { id: 'sj', name: '砂浆车间' },
  { id: 'gy', name: '膏料车间' },
  { id: 'zjb', name: '真金板车间' },
  { id: 'sm', name: '石墨车间' },
  { id: 'qg', name: '切割车间' },
  { id: 'mcmb', name: '免拆模板' },
  { id: 'hys', name: '化验室' },
  { id: 'xz', name: '行政部门' }
]

// 砂浆车间特定数据和显示类别
const sjData = ref([])
const displayCategories = ['生产', '上料', '下料', '杂工', '补贴', '小计']

// 膏料车间特定数据和显示类别
const gyData = ref([])
const gyCategories = ['计时', '计件', '装车', '补贴', '小计']

// 真金板车间特定数据和显示类别
const zjbData = ref([])
const zjbCategories = ['正', '加', '计件','补贴', '小计']

// 石墨车间特定数据和显示类别
const smData = ref([])
const smCategories = ['计件', '计时', '补贴', '小计']

// 切割车间特定数据和显示类别
const qgData = ref([])
const qgCategories = ['计件', '装车', '杂工', '补贴', '小计']

// 免拆模板特定数据和显示类别
const mcmbData = ref([])
const mcmbCategories = ['正', '加', '计件', '补贴']

// 化验室特定数据和显示类别
const hysData = ref([])
const hysCategories = ['正', '加', '补贴', '小计']

function getZjbDayValue(person, category, day) {
  if (!person.dayValues || !person.dayValues[category]) return ''
  return person.dayValues[category][day] || ''
}
function getZjbRowTotal(person, category) {
  if (category === '小计') {
    let total = 0
    for (const cat of zjbCategories.filter(c => c !== '小计')) {
      total += getZjbRowTotal(person, cat)
    }
    return total || ''
  }
  if (!person.dayValues || !person.dayValues[category]) return ''
  let total = 0
  for (let day = 1; day <= daysInMonth.value; day++) {
    total += parseInt(person.dayValues[category][day] || 0)
  }
  return total || ''
}
function getZjbDayGrandTotal(day) {
  let total = 0
  for (const person of zjbData.value) {
    if (person.dayValues && person.dayValues['小计'] && person.dayValues['小计'][day]) {
      total += parseInt(person.dayValues['小计'][day])
    }
  }
  return total || ''
}
function getZjbOverallGrandTotal() {
  let total = 0
  for (const person of zjbData.value) {
    total += parseInt(getZjbRowTotal(person, '小计') || 0)
  }
  return total || ''
}



function getSmDayValue(person, category, day) {
  if (!person.dayValues || !person.dayValues[category]) return ''
  return person.dayValues[category][day] || ''
}
function getSmRowTotal(person, category) {
  if (category === '小计') {
    let total = 0
    for (const cat of smCategories.filter(c => c !== '小计')) {
      total += getSmRowTotal(person, cat)
    }
    return total || ''
  }
  if (!person.dayValues || !person.dayValues[category]) return ''
  let total = 0
  for (let day = 1; day <= daysInMonth.value; day++) {
    total += parseInt(person.dayValues[category][day] || 0)
  }
  return total || ''
}
function getSmDayGrandTotal(day) {
  let total = 0
  for (const person of smData.value) {
    if (person.dayValues && person.dayValues['小计'] && person.dayValues['小计'][day]) {
      total += parseInt(person.dayValues['小计'][day])
    }
  }
  return total || ''
}
function getSmOverallGrandTotal() {
  let total = 0
  for (const person of smData.value) {
    total += parseInt(getSmRowTotal(person, '小计') || 0)
  }
  return total || ''
}

// 获取当月天数
const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 0).getDate()
})

// 其他车间通用薪资数据
const salaryData = ref([])

// 表单数据
const form = ref({
  entryDate: new Date(),
  category: 'baseSalary',
  mode: 'accumulate',
  amount: ''
})

// 人员选择相关
const persons = ref([])
const selectAll = ref(false)

// 计算已选人数
const selectedPersonCount = computed(() => {
  return persons.value.filter(p => p.selected).length
})

// 表头样式
const headerStyle = () => {
  return {
    background: '#f5f7fa',
    color: '#333',
    fontWeight: 'bold',
    fontSize: '14px',
    textAlign: 'center'
  }
}

// 获取砂浆车间表格单元格的值
function getDayValue(person, category, day) {
  if (!person.dayValues || !person.dayValues[category]) return ''
  return person.dayValues[category][day] || ''
}

// 获取砂浆车间表格行合计
function getRowTotal(person, category) {
  if (category === '小计') {
    let total = 0
    for (const cat of displayCategories.filter(c => c !== '小计')) {
      total += getRowTotal(person, cat)
    }
    return total || ''
  }
  
  if (!person.dayValues || !person.dayValues[category]) return ''
  
  let total = 0
  for (let day = 1; day <= daysInMonth.value; day++) {
    total += parseInt(person.dayValues[category][day] || 0)
  }
  return total || ''
}

// 获取砂浆车间每天的总计
function getDayGrandTotal(day) {
  let total = 0
  for (const person of sjData.value) {
    if (person.dayValues && person.dayValues['小计'] && person.dayValues['小计'][day]) {
      total += parseInt(person.dayValues['小计'][day])
    }
  }
  return total || ''
}

// 获取砂浆车间整体总计
function getOverallGrandTotal() {
  let total = 0
  for (const person of sjData.value) {
    total += parseInt(getRowTotal(person, '小计') || 0)
  }
  return total || ''
}

// 获取膏料车间表格单元格的值
function getGyDayValue(person, category, day) {
  if (!person.dayValues || !person.dayValues[category]) return ''
  return person.dayValues[category][day] || ''
}

// 获取膏料车间表格行合计
function getGyRowTotal(person, category) {
  if (category === '小计') {
    let total = 0
    for (const cat of gyCategories.filter(c => c !== '小计')) {
      total += getGyRowTotal(person, cat)
    }
    return total || ''
  }
  
  if (!person.dayValues || !person.dayValues[category]) return ''
  
  let total = 0
  for (let day = 1; day <= daysInMonth.value; day++) {
    total += parseInt(person.dayValues[category][day] || 0)
  }
  return total || ''
}

// 获取膏料车间每天的总计
function getGyDayGrandTotal(day) {
  let total = 0
  for (const person of gyData.value) {
    if (person.dayValues && person.dayValues['小计'] && person.dayValues['小计'][day]) {
      total += parseInt(person.dayValues['小计'][day])
    }
  }
  return total || ''
}

// 获取膏料车间整体总计
function getGyOverallGrandTotal() {
  let total = 0
  for (const person of gyData.value) {
    total += parseInt(getGyRowTotal(person, '小计') || 0)
  }
  return total || ''
}

// 获取切割车间表格单元格的值
function getQgDayValue(person, category, day) {
  if (!person.dayValues || !person.dayValues[category]) return ''
  return person.dayValues[category][day] || ''
}

// 获取切割车间表格行合计
function getQgRowTotal(person, category) {
  if (category === '小计') {
    let total = 0
    for (const cat of qgCategories.filter(c => c !== '小计')) {
      total += getQgRowTotal(person, cat)
    }
    return total || ''
  }
  if (!person.dayValues || !person.dayValues[category]) return ''
  let total = 0
  for (let day = 1; day <= daysInMonth.value; day++) {
    total += parseInt(person.dayValues[category][day] || 0)
  }
  return total || ''
}
function getQgDayGrandTotal(day) {
  let total = 0
  for (const person of qgData.value) {
    if (person.dayValues && person.dayValues['小计'] && person.dayValues['小计'][day]) {
      total += parseInt(person.dayValues['小计'][day])
    }
  }
  return total || ''
}
function getQgOverallGrandTotal() {
  let total = 0
  for (const person of qgData.value) {
    total += parseInt(getQgRowTotal(person, '小计') || 0)
  }
  return total || ''
}

// 获取免拆模板表格单元格的值
function getMcmbDayValue(person, category, day) {
  if (!person.dayValues || !person.dayValues[category]) return ''
  return person.dayValues[category][day] || ''
}

// 获取免拆模板表格行合计
function getMcmbRowTotal(person, category) {
  if (category === '小计') {
    let total = 0
    for (const cat of mcmbCategories.filter(c => c !== '小计')) {
      total += getMcmbRowTotal(person, cat)
    }
    return total || ''
  }
  if (!person.dayValues || !person.dayValues[category]) return ''
  let total = 0
  for (let day = 1; day <= daysInMonth.value; day++) {
    total += parseInt(person.dayValues[category][day] || 0)
  }
  return total || ''
}
function getMcmbDayGrandTotal(day) {
  let total = 0
  for (const person of mcmbData.value) {
    if (person.dayValues && person.dayValues['小计'] && person.dayValues['小计'][day]) {
      total += parseInt(person.dayValues['小计'][day])
    }
  }
  return total || ''
}
function getMcmbOverallGrandTotal() {
  let total = 0
  for (const person of mcmbData.value) {
    total += parseInt(getMcmbRowTotal(person, '小计') || 0)
  }
  return total || ''
}

// 获取化验室表格单元格的值
function getHysDayValue(person, category, day) {
  if (!person.dayValues || !person.dayValues[category]) return ''
  return person.dayValues[category][day] || ''
}

// 获取化验室表格行合计
function getHysRowTotal(person, category) {
  if (category === '小计') {
    let total = 0
    for (const cat of hysCategories.filter(c => c !== '小计')) {
      total += getHysRowTotal(person, cat)
    }
    return total || ''
  }
  if (!person.dayValues || !person.dayValues[category]) return ''
  let total = 0
  for (let day = 1; day <= daysInMonth.value; day++) {
    total += parseInt(person.dayValues[category][day] || 0)
  }
  return total || ''
}
function getHysDayGrandTotal(day) {
  let total = 0
  for (const person of hysData.value) {
    if (person.dayValues && person.dayValues['小计'] && person.dayValues['小计'][day]) {
      total += parseInt(person.dayValues['小计'][day])
    }
  }
  return total || ''
}
function getHysOverallGrandTotal() {
  let total = 0
  for (const person of hysData.value) {
    total += parseInt(getHysRowTotal(person, '小计') || 0)
  }
  return total || ''
}

// 合并特定行的单元格 (小计行)
const mergeRows = ({ row, column, rowIndex }) => {
  if (row.id === 'subtotal' && column.property === 'name') {
    return { colspan: 2, rowspan: 1 }
  }
  if (row.id === 'subtotal' && column.property === 'position') {
    return { colspan: 0, rowspan: 0 }
  }
}

// 月份选择相关函数
function prevMonth() {
  if (currentMonth.value === 1) {
    currentMonth.value = 12
    currentYear.value--
  } else {
    currentMonth.value--
  }
  showMonthPicker.value = false
  loadSalaryData()
}

function nextMonth() {
  if (currentMonth.value === 12) {
    currentMonth.value = 1
    currentYear.value++
  } else {
    currentMonth.value++
  }
  showMonthPicker.value = false
  loadSalaryData()
}

function selectMonth(month) {
  currentMonth.value = month
  showMonthPicker.value = false
  loadSalaryData()
}

// 打开添加对话框
function openAddEntryModal() {
  // 设置默认日期为当月1号
  form.value.entryDate = new Date(currentYear.value, currentMonth.value - 1, 1)
  
  // 根据不同部门设置不同的类别选项
  if (activeTab.value === 'sj') {
    form.value.category = '生产'
  } else {
    form.value.category = 'baseSalary'
  }
  
  form.value.mode = 'accumulate'
  form.value.amount = ''
  
  // 加载人员数据
  loadPersonnelData()
  
  dialogVisible.value = true
}

// 加载人员数据
function loadPersonnelData() {
  // 这里应该从API获取人员数据
  // 模拟数据
  persons.value = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `员工${i + 1}`,
    selected: false
  }))
  selectAll.value = false
}

// 全选/全不选
function handleSelectAll(val) {
  persons.value.forEach(person => {
    person.selected = val
  })
}

// 更新全选框状态
function updateSelectAllState() {
  const selectedCount = persons.value.filter(p => p.selected).length
  if (selectedCount === 0) {
    selectAll.value = false
  } else if (selectedCount === persons.value.length) {
    selectAll.value = true
  } else {
    // 部分选中状态需要通过DOM操作设置indeterminate属性
    selectAll.value = false
  }
}

// 保存记录
function saveEntry() {
  const selectedPersons = persons.value.filter(p => p.selected)
  if (selectedPersons.length === 0) {
    ElMessage.warning('请至少选择一名员工')
    return
  }
  
  if (!form.value.entryDate) {
    ElMessage.warning('请选择日期')
    return
  }
  
  if (form.value.amount && !/^\d*$/.test(form.value.amount.trim())) {
    ElMessage.warning('请输入有效的金额（正整数或留空）')
    return
  }
  
  // 检查日期是否在当前月份
  const entryDate = new Date(form.value.entryDate)
  if (entryDate.getFullYear() !== currentYear.value || 
      entryDate.getMonth() + 1 !== currentMonth.value) {
    ElMessage.warning(`选择的日期不在当前月份 (${currentYear.value}年${currentMonth.value}月)`)
    return
  }
  
  saving.value = true
  
  // 模拟API调用
  setTimeout(() => {
    // 在实际项目中应该调用API保存数据
    ElMessage.success('数据保存成功')
    saving.value = false
    dialogVisible.value = false
    
    // 重新加载数据
    loadSalaryData()
  }, 1000)
}

// 导出工资表
function exportSalary() {
  ElMessage.success('导出功能需要集成Excel.js等库实现')
  // 实际项目中需要实现导出Excel的逻辑
}

// 打印工资表
function printSalary() {
  window.print()
}

// 生成砂浆车间模拟数据
function generateSjData() {
  // 生成砂浆车间的日期数据格式
  const result = []
  
  for (let i = 1; i <= 8; i++) {
    const person = {
      id: i,
      name: `员工${i}`,
      dayValues: {}
    }
    
    // 为每个类别生成数据
    for (const category of displayCategories) {
      if (category !== '小计') {
        person.dayValues[category] = {}
        
        // 随机生成一些日期的数据
        for (let day = 1; day <= daysInMonth.value; day++) {
          if (Math.random() > 0.7) { // 30% 概率有数据
            person.dayValues[category][day] = Math.floor(Math.random() * 100) + 50
          }
        }
      } else {
        // 小计类别会在前端计算
        person.dayValues[category] = {}
        
        // 计算每天的小计
        for (let day = 1; day <= daysInMonth.value; day++) {
          let dayTotal = 0
          for (const cat of displayCategories.filter(c => c !== '小计')) {
            if (person.dayValues[cat] && person.dayValues[cat][day]) {
              dayTotal += parseInt(person.dayValues[cat][day])
            }
          }
          if (dayTotal > 0) {
            person.dayValues[category][day] = dayTotal
          }
        }
      }
    }
    
    result.push(person)
  }
  
  return result
}

// 生成膏料车间模拟数据
function generateGyData() {
  // 生成膏料车间的日期数据格式
  const result = []
  
  for (let i = 1; i <= 8; i++) {
    const person = {
      id: i,
      name: `员工${i}`,
      dayValues: {}
    }
    
    // 为每个类别生成数据
    for (const category of gyCategories) {
      if (category !== '小计') {
        person.dayValues[category] = {}
        
        // 随机生成一些日期的数据
        for (let day = 1; day <= daysInMonth.value; day++) {
          if (Math.random() > 0.7) { // 30% 概率有数据
            person.dayValues[category][day] = Math.floor(Math.random() * 100) + 50
          }
        }
      } else {
        // 小计类别会在前端计算
        person.dayValues[category] = {}
        
        // 计算每天的小计
        for (let day = 1; day <= daysInMonth.value; day++) {
          let dayTotal = 0
          for (const cat of gyCategories.filter(c => c !== '小计')) {
            if (person.dayValues[cat] && person.dayValues[cat][day]) {
              dayTotal += parseInt(person.dayValues[cat][day])
            }
          }
          if (dayTotal > 0) {
            person.dayValues[category][day] = dayTotal
          }
        }
      }
    }
    
    result.push(person)
  }
  
  return result
}

// 生成真金板车间模拟数据
function generateZjbData() {
  const result = []
  for (let i = 1; i <= 8; i++) {
    const person = {
      id: i,
      name: `员工${i}`,
      dayValues: {}
    }
    for (const category of zjbCategories) {
      if (category !== '小计') {
        person.dayValues[category] = {}
        for (let day = 1; day <= daysInMonth.value; day++) {
          if (Math.random() > 0.7) {
            person.dayValues[category][day] = Math.floor(Math.random() * 100) + 50
          }
        }
      } else {
        person.dayValues[category] = {}
        for (let day = 1; day <= daysInMonth.value; day++) {
          let dayTotal = 0
          for (const cat of zjbCategories.filter(c => c !== '小计')) {
            if (person.dayValues[cat] && person.dayValues[cat][day]) {
              dayTotal += parseInt(person.dayValues[cat][day])
            }
          }
          if (dayTotal > 0) {
            person.dayValues[category][day] = dayTotal
          }
        }
      }
    }
    result.push(person)
  }
  return result
}

// 生成石墨车间模拟数据
function generateSmData() {
  const result = []
  for (let i = 1; i <= 8; i++) {
    const person = {
      id: i,
      name: `员工${i}`,
      dayValues: {}
    }
    for (const category of smCategories) {
      if (category !== '小计') {
        person.dayValues[category] = {}
        for (let day = 1; day <= daysInMonth.value; day++) {
          if (Math.random() > 0.7) {
            person.dayValues[category][day] = Math.floor(Math.random() * 100) + 50
          }
        }
      } else {
        person.dayValues[category] = {}
        for (let day = 1; day <= daysInMonth.value; day++) {
          let dayTotal = 0
          for (const cat of smCategories.filter(c => c !== '小计')) {
            if (person.dayValues[cat] && person.dayValues[cat][day]) {
              dayTotal += parseInt(person.dayValues[cat][day])
            }
          }
          if (dayTotal > 0) {
            person.dayValues[category][day] = dayTotal
          }
        }
      }
    }
    result.push(person)
  }
  return result
}

// 生成切割车间模拟数据
function generateQgData() {
  const result = []
  for (let i = 1; i <= 8; i++) {
    const person = {
      id: i,
      name: `员工${i}`,
      dayValues: {}
    }
    for (const category of qgCategories) {
      if (category !== '小计') {
        person.dayValues[category] = {}
        for (let day = 1; day <= daysInMonth.value; day++) {
          if (Math.random() > 0.7) {
            person.dayValues[category][day] = Math.floor(Math.random() * 100) + 50
          }
        }
      } else {
        person.dayValues[category] = {}
        for (let day = 1; day <= daysInMonth.value; day++) {
          let dayTotal = 0
          for (const cat of qgCategories.filter(c => c !== '小计')) {
            if (person.dayValues[cat] && person.dayValues[cat][day]) {
              dayTotal += parseInt(person.dayValues[cat][day])
            }
          }
          if (dayTotal > 0) {
            person.dayValues[category][day] = dayTotal
          }
        }
      }
    }
    result.push(person)
  }
  return result
}

// 生成免拆模板模拟数据
function generateMcmbData() {
  const result = []
  for (let i = 1; i <= 8; i++) {
    const person = {
      id: i,
      name: `员工${i}`,
      dayValues: {}
    }
    for (const category of mcmbCategories) {
      if (category !== '小计') {
        person.dayValues[category] = {}
        for (let day = 1; day <= daysInMonth.value; day++) {
          if (Math.random() > 0.7) {
            person.dayValues[category][day] = Math.floor(Math.random() * 100) + 50
          }
        }
      } else {
        person.dayValues[category] = {}
        for (let day = 1; day <= daysInMonth.value; day++) {
          let dayTotal = 0
          for (const cat of mcmbCategories.filter(c => c !== '小计')) {
            if (person.dayValues[cat] && person.dayValues[cat][day]) {
              dayTotal += parseInt(person.dayValues[cat][day])
            }
          }
          if (dayTotal > 0) {
            person.dayValues[category][day] = dayTotal
          }
        }
      }
    }
    result.push(person)
  }
  return result
}

// 生成化验室模拟数据
function generateHysData() {
  const result = []
  for (let i = 1; i <= 8; i++) {
    const person = {
      id: i,
      name: `员工${i}`,
      dayValues: {}
    }
    for (const category of hysCategories) {
      if (category !== '小计') {
        person.dayValues[category] = {}
        for (let day = 1; day <= daysInMonth.value; day++) {
          if (Math.random() > 0.7) {
            person.dayValues[category][day] = Math.floor(Math.random() * 100) + 50
          }
        }
      } else {
        person.dayValues[category] = {}
        for (let day = 1; day <= daysInMonth.value; day++) {
          let dayTotal = 0
          for (const cat of hysCategories.filter(c => c !== '小计')) {
            if (person.dayValues[cat] && person.dayValues[cat][day]) {
              dayTotal += parseInt(person.dayValues[cat][day])
            }
          }
          if (dayTotal > 0) {
            person.dayValues[category][day] = dayTotal
          }
        }
      }
    }
    result.push(person)
  }
  return result
}

// 加载薪资数据
function loadSalaryData() {
  loading.value = true

  setTimeout(() => {
    if (activeTab.value === 'sj') {
      sjData.value = generateSjData()
    } else if (activeTab.value === 'gy') {
      gyData.value = generateGyData()
    } else if (activeTab.value === 'zjb') {
      zjbData.value = generateZjbData()
    } else if (activeTab.value === 'sm') {
      smData.value = generateSmData()
    } else if (activeTab.value === 'qg') {
      qgData.value = generateQgData()
    } else if (activeTab.value === 'mcmb') {
      mcmbData.value = generateMcmbData()
    } else if (activeTab.value === 'hys') {
      hysData.value = generateHysData()
    } else {
      salaryData.value = generateOtherData(activeTab.value)
    }

    loading.value = false
  }, 800)
}

// 点击文档其他地方关闭月份选择器
function closeMonthPicker(e) {
  if (showMonthPicker.value && !e.target.closest('.month-selector')) {
    showMonthPicker.value = false
  }
}

// 监听标签页变化，加载对应数据
watch(activeTab, (newVal) => {
  loadSalaryData()
})

// 页面挂载时加载数据
onMounted(() => {
  loadSalaryData()
  document.addEventListener('click', closeMonthPicker)
  
  // 尝试从localStorage恢复状态
  const savedYear = localStorage.getItem('salaryYear')
  const savedMonth = localStorage.getItem('salaryMonth')
  const savedTab = localStorage.getItem('salaryTab')
  
  if (savedYear) currentYear.value = parseInt(savedYear)
  if (savedMonth) currentMonth.value = parseInt(savedMonth)
  if (savedTab && departments.some(d => d.id === savedTab)) activeTab.value = savedTab
})

// 页面卸载时移除事件监听
onUnmounted(() => {
  document.removeEventListener('click', closeMonthPicker)
})

// 保存状态到localStorage
watch([currentYear, currentMonth, activeTab], () => {
  localStorage.setItem('salaryYear', currentYear.value.toString())
  localStorage.setItem('salaryMonth', currentMonth.value.toString())
  localStorage.setItem('salaryTab', activeTab.value)
})
</script>

<style scoped>
.salary-container {
  width: 100%;
  margin: 0 auto;
  padding: 30px 30px 16px 30px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  min-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.top-actions-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
}

.month-selector {
  display: flex;
  align-items: center;
  background: #e5f0fd;
  border-radius: 14px;
  padding: 0 6px;
  height: 42px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  border: 1px solid rgba(208, 227, 247, 0.6);
  min-width: 160px;
  position: relative;
  flex-shrink: 0;
}

.month-selector-btn {
  background: none;
  border: none;
  color: #2874c6;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.month-selector-btn:hover {
  background: rgba(255, 255, 255, 0.7);
  color: #3d7acb;
}

.month-display {
  flex: 1;
  text-align: center;
  font-weight: 600;
  color: #2874c6;
  font-size: 1.1rem;
  user-select: none;
  position: relative;
  cursor: pointer;
  padding: 0 8px;
}

.month-display:hover {
  color: #3d7acb;
}

.month-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 1000;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease, padding 0.3s ease, margin 0.3s ease;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 0;
  margin-top: 0;
  opacity: 0;
}

.month-dropdown.show {
  max-height: 240px;
  padding: 12px;
  margin-top: 8px;
  opacity: 1;
}

.month-option {
  padding: 8px 5px;
  text-align: center;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  color: #555;
}

.month-option:hover {
  background: #e5f0fd;
  color: #2874c6;
}

.month-option.active {
  background: #2874c6;
  color: white;
}

.department-tabs-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  overflow-x: auto;
  padding: 0 10px;
}

.department-tabs-container.tabs-fixed {
  position: sticky;
  top: 0;
  z-index: 20;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.department-tabs-wrapper {
  display: flex;
  gap: 8px;
  padding: 4px;
  background: #f5f7fa;
  border-radius: 16px;
  border: 1px solid #e4e7ed;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.department-tab {
  padding: 8px 20px;
  font-size: 14px;
  color: #606266;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
  font-weight: 500;
  background-color: transparent;
}

.department-tab:hover {
  color: #409EFF;
  background-color: rgba(64, 158, 255, 0.08);
}

.department-tab.active {
  color: #409EFF;
  background-color: #ecf5ff;
  font-weight: 600;
  box-shadow: 0 2px 6px rgba(0, 100, 250, 0.12);
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.table-content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  position: relative;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.75);
  z-index: 10;
}

.no-data-tip {
  margin-top: 60px;
  text-align: center;
}

.person-selection-container {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 10px;
}

.select-all-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 8px;
}

.selected-count {
  font-size: 13px;
  color: #909399;
  background: #f2f6fc;
  padding: 2px 8px;
  border-radius: 10px;
}

.person-checkboxes {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
}

/* 打印样式 */
@media print {
  .top-actions-container {
    display: none !important;
  }
  
  .salary-container {
    box-shadow: none;
    padding: 0;
  }
  
  .data-table th {
    position: static !important;
    background-color: #f0f0f0 !important;
    color: #000 !important;
  }
  
  .data-table thead {
    display: table-header-group !important;
  }
  
  .data-table tbody {
    display: table-row-group !important;
  }
  
  .data-table tfoot {
    display: table-footer-group !important;
  }
  
  .data-table tr {
    page-break-inside: avoid !important;
  }
  
  .data-table th,
  .data-table td {
    border: 1px solid #333 !important;
    padding: 2px 4px !important;
    vertical-align: middle !important;
    text-align: center !important;
    word-wrap: break-word;
    page-break-inside: avoid !important;
    background-color: #fff !important;
    color: #000 !important;
  }
  
  .data-table tr.subtotal-row td {
    font-weight: bold !important;
    color: red !important;
    background-color: #fff !important;
  }
  
  .data-table tfoot tr {
    font-weight: bold !important;
    background-color: #f0f0f0 !important;
    color: #000 !important;
  }
}

/* 砂浆车间表格样式 */
.department-table-container {
  width: 100%;
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  font-size: 14px;
}

.data-table th,
.data-table td {
  border: 1px solid #dcdfe6;
  padding: 10px;
  text-align: center;
  vertical-align: middle;
}

.data-table th {
  background-color: #f5f7fa;
  color: #303133;
  font-weight: bold;
}

.data-table .day-col {
  min-width: 35px;
  max-width: 45px;
}

.data-table .data-cell:empty::before {
  content: "";
}

.data-table tr.subtotal-row td {
  font-weight: bold;
  color: #ff4500;
  background-color: #f9f9f9;
}

.data-table tfoot tr {
  font-weight: bold;
  background-color: #dee2e6;
}

/* 加载中动画 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.75);
  z-index: 10;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #409EFF;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 响应式样式 */
@media (max-width: 1200px) {
  .top-actions-container {
    flex-wrap: wrap;
  }
  
  .month-selector {
    order: 1;
    margin-right: auto;
  }
  
  .department-tabs-container {
    order: 3;
    width: 100%;
    justify-content: flex-start;
    margin-top: 10px;
  }
  
  .action-buttons {
    order: 2;
  }
}

@media (max-width: 768px) {
  .top-actions-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .month-selector {
    width: 100%;
    margin-right: 0;
  }
  
  .action-buttons {
    width: 100%;
    justify-content: flex-end;
    margin-top: 10px;
  }
  
  .department-tabs-container {
    margin-top: 10px;
  }
}
</style>
