<template>
  <div class="container">
    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <span>{{ loadingText }}</span>
    </div>

    <!-- 顶部操作栏 -->
    <div class="page-header-actions">
      <div class="import-actions">
        <!-- 必须在 el-upload 里用 template #trigger 或直接用 el-button，否则按钮不显示 -->
        <el-upload
          :show-file-list="false"
          accept=".xlsx,.xls"
          :before-upload="file => handleImport(file, 'production')"
        >
          <template #trigger>
            <el-button type="primary">导入入库单</el-button>
          </template>
        </el-upload>
        <el-upload
          :show-file-list="false"
          accept=".xlsx,.xls"
          :before-upload="file => handleImport(file, 'shipment')"
        >
          <template #trigger>
            <el-button type="primary" style="margin-left: 10px;">导入发货单</el-button>
          </template>
        </el-upload>
      </div>
      <el-button @click="showRulePanel = !showRulePanel" type="info">
        <el-icon><Setting /></el-icon>
        {{ showRulePanel ? '隐藏规则配置' : '规则管理' }}
      </el-button>
    </div>

    <!-- 规则管理面板（占位） -->
    <el-card v-if="showRulePanel" class="rule-panel">
      <div style="font-weight:bold;">规则配置（演示占位）</div>
      <div style="color:#888;font-size:13px;margin:10px 0;">此处可集成规则管理表单和表格，建议用后端API或Supabase实现。</div>
      <el-alert title="规则管理功能请参考原始HTML实现，或根据实际需求集成后端。" type="info" show-icon />
    </el-card>

    <!-- 数据表格 -->
    <el-table
      :data="tableData"
      border
      style="width: 100%; margin-top: 20px;"
      :span-method="mergeWorkshop"
      header-cell-class-name="table-header-center"
      cell-class-name="table-cell-center"
    >
      <el-table-column prop="workshop" label="车间" />
      <el-table-column prop="product" label="产品名称" />
      <el-table-column prop="unit" label="单位" />
      <el-table-column prop="production" label="生产量" />
      <el-table-column prop="shipment" label="发货量" />
    </el-table>

    <!-- 未匹配数据区域 -->
    <el-card class="unmatched-card" style="margin-top: 30px;">
      <template #header>
        <span style="font-weight:bold;">未匹配的数据</span>
      </template>
      <div v-if="unmatchedProduction.length === 0 && unmatchedShipment.length === 0" style="color: #555;">
        请先导入入库单和/或发货单 Excel 文件。
      </div>
      <div v-else>
        <div v-if="unmatchedProduction.length">
          <div style="font-weight:bold;margin-bottom:6px;">未匹配的入库数据</div>
          <el-table
            :data="unmatchedProduction"
            border
            size="small"
            header-cell-class-name="table-header-center"
            cell-class-name="table-cell-center"
          >
            <el-table-column v-for="col in unmatchedColumns" :key="col" :prop="col" :label="col" />
          </el-table>
        </div>
        <div v-if="unmatchedShipment.length" style="margin-top:18px;">
          <div style="font-weight:bold;margin-bottom:6px;">未匹配的发货数据</div>
          <el-table
            :data="unmatchedShipment"
            border
            size="small"
            header-cell-class-name="table-header-center"
            cell-class-name="table-cell-center"
          >
            <el-table-column v-for="col in unmatchedColumns" :key="col" :prop="col" :label="col" />
          </el-table>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Setting } from '@element-plus/icons-vue'

const loading = ref(false)
const loadingText = ref('处理中，请稍候...')
const showRulePanel = ref(false)

// 示例表格数据
const tableData = ref([
  { workshop: '砂浆车间', product: '无机类', unit: '吨', production: 123.456, shipment: 120.123 },
  { workshop: '', product: 'FTC', unit: '吨', production: 88.5, shipment: 80.2 },
  { workshop: '', product: '胶粉聚苯颗粒', unit: '吨', production: 66, shipment: 60 },
  { workshop: '', product: '石膏类', unit: '吨', production: '', shipment: '' },
  { workshop: '', product: '砂浆类', unit: '吨', production: '', shipment: '' },
  { workshop: '', product: '膏料（干）', unit: '吨', production: '', shipment: '' },
  { workshop: '', product: '腻子类', unit: '吨', production: '', shipment: '' },
  { workshop: '', product: '膏料', unit: '膏料', production: '', shipment: '' },
  { workshop: '涂料', product: '其他涂料', unit: '吨', production: '', shipment: '' },
  { workshop: '', product: '抗碱底漆', unit: '吨', production: '', shipment: '' },
  { workshop: '', product: '乳胶漆', unit: '吨', production: '', shipment: '' },
  { workshop: '', product: '多彩涂料', unit: '吨', production: '', shipment: '' },
  { workshop: '', product: '真石漆', unit: '吨', production: '', shipment: '' },
  { workshop: '', product: '质感', unit: '吨', production: '', shipment: '' },
  { workshop: '', product: '弹性平涂', unit: '吨', production: '', shipment: '' },
  { workshop: '复合板', product: '挤塑板+石膏板', unit: '平方', production: '', shipment: '' },
  { workshop: '', product: 'EPS板+石膏板', unit: '平方', production: '', shipment: '' },
  { workshop: '', product: '挤塑板+水泥板', unit: '平方', production: '', shipment: '' },
  { workshop: '', product: 'EPS板+水泥板', unit: '平方', production: '', shipment: '' },
  { workshop: '', product: '岩棉板+石膏板', unit: '平方', production: '', shipment: '' },
  { workshop: '', product: '热固板+硅酸钙板', unit: '平方', production: '', shipment: '' },
  { workshop: '石墨不燃板', product: '白颗粒', unit: '立方', production: '', shipment: '' },
  { workshop: '', product: '黑颗粒', unit: '立方', production: '', shipment: '' },
  { workshop: '', product: '白颗粒(半成品)', unit: '块', production: '', shipment: '' },
  { workshop: '', product: '黑颗粒(半成品)', unit: '块', production: '', shipment: '' },
  { workshop: '真金板', product: '真金板', unit: '立方', production: '', shipment: '' },
  { workshop: '', product: '033级', unit: '立方', production: '', shipment: '' },
  { workshop: '', product: '039级', unit: '立方', production: '', shipment: '' },
  { workshop: '一体板', product: '真石漆饰面', unit: '平方', production: '', shipment: '' },
  { workshop: '', product: '弹性平涂（平方）', unit: '平方', production: '', shipment: '' },
  { workshop: '', product: '金属漆', unit: '平方', production: '', shipment: '' },
  { workshop: '', product: '水包水饰面', unit: '平方', production: '', shipment: '' },
  { workshop: '', product: '水包砂饰面', unit: '平方', production: '', shipment: '' },
  { workshop: '', product: '乳胶漆饰面', unit: '平方', production: '', shipment: '' },
  { workshop: '', product: '无饰面', unit: '平方', production: '', shipment: '' },
  { workshop: '免拆模板', product: '10cm', unit: '立方', production: '', shipment: '' },
  { workshop: '', product: '5cm', unit: '立方', production: '', shipment: '' },
  { workshop: '', product: '4cm', unit: '立方', production: '', shipment: '' },
  { workshop: '挤塑板', product: '挤塑板', unit: '立方', production: '', shipment: '' },
  { workshop: '无机轻集料', product: '无机轻集料', unit: '立方', production: '', shipment: '' },
  { workshop: '线条', product: 'EPS线条 (米)', unit: '米', production: '', shipment: '' },
  { workshop: '', product: 'EPS裸线条', unit: '米', production: '', shipment: '' },
  { workshop: '', product: 'A级线条', unit: '米', production: '', shipment: '' },
  { workshop: '', product: '石墨EPS线条', unit: '米', production: '', shipment: '' },
  { workshop: '', product: 'EPS线条 (根)', unit: '根', production: '', shipment: '' }
])

// 未匹配数据（示例）
const unmatchedProduction = ref([])
const unmatchedShipment = ref([])
const unmatchedColumns = ['商品名称', '规格型号', '基本单位', '基本入库数量', '销售数量', '备注']

function handleImport(file, type) {
  loading.value = true
  loadingText.value = `正在处理${type === 'production' ? '入库单' : '发货单'}...`
  // TODO: 这里集成 SheetJS 解析和规则匹配逻辑，处理后填充 tableData、unmatchedProduction/unmatchedShipment
  setTimeout(() => {
    loading.value = false
    ElMessage.success(`${type === 'production' ? '入库单' : '发货单'}导入成功（演示）`)
  }, 1200)
  return false // 阻止 el-upload 自动上传
}

// 合并车间单元格
function mergeWorkshop({ row, column, rowIndex }) {
  if (column.property === 'workshop') {
    // 只对有值的workshop进行合并
    if (!row.workshop) {
      return { rowspan: 0, colspan: 0 }
    }
    // 统计当前workshop连续出现的行数
    let count = 1
    for (let i = rowIndex + 1; i < tableData.value.length; i++) {
      if (tableData.value[i].workshop === '') {
        count++
      } else {
        break
      }
    }
    return { rowspan: count, colspan: 1 }
  }
}
</script>

<style scoped>
.container {
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
.page-header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.import-actions {
  display: flex;
  align-items: center;
}
.loading-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(255,255,255,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  font-size: 1.2em;
  color: #333;
}
.rule-panel {
  margin-bottom: 30px;
  border: 1px solid #ccc;
  background: #f9fafc;
}
.unmatched-card {
  background: #fff9f9;
  border: 1px solid #e0e6ed;
}
.table-header-center,
:deep(.el-table th) {
  text-align: center !important;
  font-weight: bold !important;
  color: #222 !important;
}
.table-cell-center,
:deep(.el-table td) {
  text-align: center !important;
  vertical-align: middle !important;
}
</style>
