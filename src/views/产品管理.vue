<template>
  <div class="container">
    <el-tabs v-model="activeTab" type="card">
      <el-tab-pane label="保温系统" name="insulation">
        <div class="search-sticky">
          <el-input v-model="search.insulation" placeholder="请输入关键词" clearable style="width: 300px;" />
        </div>
        <el-table
          :data="filteredInsulation"
          border
          height="500"
          style="width: 100%; margin-top: 0;"
          :header-cell-style="{ background: '#f5f7fa', color: '#303133', fontWeight: 'bold' }"
          :scrollbar-always-on="true"
        >
          <el-table-column prop="id" label="序号" width="80" align="center" />
          <el-table-column prop="name" label="系统名称" min-width="300" />
          <el-table-column label="检验报告（附件）" width="250" align="center">
            <template #default="scope">
              <template v-if="Array.isArray(scope.row.report)">
                <div v-for="(item, idx) in scope.row.report" :key="idx">
                  <a :href="item.url" target="_blank">{{ item.label }}</a>
                </div>
              </template>
              <template v-else>
                <a v-if="scope.row.report" :href="scope.row.report.url" target="_blank">{{ scope.row.report.label }}</a>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" width="200" align="center" />
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="涂料" name="coating">
        <div class="search-sticky">
          <el-input v-model="search.coating" placeholder="请输入关键词" clearable style="width: 300px;" />
        </div>
        <el-table
          :data="filteredCoating"
          border
          height="500"
          style="width: 100%; margin-top: 0;"
          :header-cell-style="{ background: '#f5f7fa', color: '#303133', fontWeight: 'bold' }"
          :scrollbar-always-on="true"
        >
          <el-table-column prop="id" label="序号" width="80" align="center" />
          <el-table-column prop="name" label="涂料名称" min-width="300" />
          <el-table-column prop="remark" label="备注" width="200" align="center" />
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="防水材料" name="waterproof">
        <div class="search-sticky">
          <el-input v-model="search.waterproof" placeholder="请输入关键词" clearable style="width: 300px;" />
        </div>
        <el-table
          :data="filteredWaterproof"
          border
          height="500"
          style="width: 100%; margin-top: 0;"
          :header-cell-style="{ background: '#f5f7fa', color: '#303133', fontWeight: 'bold' }"
          :scrollbar-always-on="true"
        >
          <el-table-column prop="id" label="序号" width="80" align="center" />
          <el-table-column prop="name" label="涂料名称" min-width="300" />
          <el-table-column prop="remark" label="备注" width="200" align="center" />
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="特种砂浆" name="mortar">
        <div class="search-sticky">
          <el-input v-model="search.mortar" placeholder="请输入关键词" clearable style="width: 300px;" />
        </div>
        <el-table
          :data="filteredMortar"
          border
          height="500"
          style="width: 100%; margin-top: 0;"
          :header-cell-style="{ background: '#f5f7fa', color: '#303133', fontWeight: 'bold' }"
          :scrollbar-always-on="true"
        >
          <el-table-column prop="id" label="序号" width="80" align="center" />
          <el-table-column prop="name" label="砂浆名称" min-width="300" />
          <el-table-column prop="remark" label="备注" width="200" align="center" />
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('insulation')
const search = ref({
  insulation: '',
  coating: '',
  waterproof: '',
  mortar: ''
})

// 保温系统数据
const insulationList = [
  {
    id: 1,
    name: '有机保温板（EPS 板）外墙内保温系统',
    report: { url: 'docs/2022.6月EPS板薄抹灰外墙内保温系统.pdf', label: '检验报告.pdf' },
    remark: '内墙'
  },
  {
    id: 2,
    name: '有机保温板（XPS 板）外墙内保温系统',
    report: { url: 'docs/2022年6月XPS板薄抹灰外墙内保温系统-副本.pdf', label: '检验报告.pdf' },
    remark: '内墙'
  },
  {
    id: 3,
    name: '复合板（无石棉纤维水泥平板复合EPS板）外墙内保温系统',
    report: { url: 'docs/水泥平板复合EPS.pdf', label: '检验报告.pdf' },
    remark: '内墙'
  },
  {
    id: 4,
    name: '复合板（无石棉纤维水泥平板复合XPS板）外墙内保温系统',
    report: { url: 'docs/水泥平板复合XPS(1).pdf', label: '检验报告.pdf' },
    remark: '内墙'
  },
  {
    id: 5,
    name: '复合板（纸面石膏板复合EPS板）外墙内保温系统',
    report: { url: 'docs/2022年纸面石膏复合EPS板.pdf', label: '检验报告.pdf' },
    remark: '内墙'
  },
  {
    id: 6,
    name: '复合板（纸面石膏板复合XPS板）外墙内保温系统',
    report: { url: 'docs/2022年纸面石膏复合XPS 板.pdf', label: '检验报告.pdf' },
    remark: '内墙'
  },
  {
    id: 7,
    name: '保温装饰复合板（无石棉纤维增强硅酸钙板复合热固复合聚苯乙烯泡沫保温板）外墙外保温系统',
    report: { url: 'docs/保温装饰板系统、硅酮胶报告.pdf', label: '检验报告.pdf' },
    remark: '外墙'
  },
  {
    id: 8,
    name: '保温装饰复合板（铝板复合热固复合聚苯乙烯泡沫保温板）外墙外保温系统',
    report: { url: 'docs/systemB-check.pdf', label: '检验报告.pdf' },
    remark: '外墙'
  },
  {
    id: 9,
    name: '泡沫玻璃板外墙内保温系统',
    report: { url: 'docs/2024年泡沫玻璃板检测报告.pdf', label: '检验报告.pdf' },
    remark: '内墙'
  },
  {
    id: 10,
    name: '无机轻集料保温板外墙保温系统（珍珠岩板）',
    report: { url: 'docs/systemB-check.pdf', label: '检验报告.pdf' },
    remark: '外墙'
  },
  {
    id: 11,
    name: '水泥基无机保温砂浆外墙内保温系统',
    report: { url: 'docs/2024水泥基检测报告.pdf', label: '检验报告.pdf' },
    remark: '内墙'
  },
  {
    id: 12,
    name: '石膏基无机保温砂浆外墙内保温系统',
    report: { url: 'docs/systemB-check.pdf', label: '检验报告.pdf' },
    remark: '内墙'
  },
  {
    id: 13,
    name: '无机轻集料保温砂浆外墙保温系统（浙江地标）',
    report: { url: 'docs/systemB-check.pdf', label: '检验报告.pdf' },
    remark: '外墙'
  },
  {
    id: 14,
    name: '外墙保温一体化系统和配套材料（现浇混凝土保温外墙）',
    report: { url: 'docs/免拆模板B-副本.pdf', label: '检验报告.pdf' },
    remark: '外墙'
  },
  {
    id: 15,
    name: '外墙保温一体化系统和配套材料（预制混凝土反打保温外墙）',
    report: { url: 'docs/免拆模板反打 A.pdf', label: '检验报告.pdf' },
    remark: '外墙'
  },
  {
    id: 16,
    name: '岩棉板（带）薄抹灰外墙外保温系统',
    report: [
      { url: 'docs/岩棉板系统报告_1.pdf', label: '检验报告1.pdf' },
      { url: 'docs/2024.岩棉带系统 (2).pdf', label: '检验报告2.pdf' }
    ],
    remark: '外墙'
  },
  {
    id: 17,
    name: '岩棉组合板薄抹灰外墙外保温系统',
    report: { url: 'docs/2024组合板系统.pdf', label: '检验报告.pdf' },
    remark: '外墙'
  },
  {
    id: 18,
    name: '无机改性不燃保温板外墙内保温系统',
    report: { url: 'docs/2023年无机改性不燃保温板内保温系统.pdf', label: '检验报告.pdf' },
    remark: '内墙'
  },
  {
    id: 19,
    name: 'BE气凝胶无机保温膏料外墙内保温系统',
    report: { url: 'docs/BE气凝胶无机保温膏料外墙内保温系统.pdf', label: '检验报告.pdf' },
    remark: '内墙'
  },
  {
    id: 20,
    name: '无机保温膏料外墙内保温系统',
    report: { url: 'docs/无机保温膏料外墙内保温系统.pdf', label: '检验报告.pdf' },
    remark: '内墙'
  },
  {
    id: 21,
    name: '真空绝热板（STP）外墙内保温系统',
    report: { url: 'docs/真空板内保温系统报告.pdf', label: '检验报告.pdf' },
    remark: '内墙'
  },
  {
    id: 22,
    name: 'FC楼板隔声保温系统',
    report: { url: 'docs/systemB-check.pdf', label: '检验报告.pdf' },
    remark: '楼地面'
  }
]

// 涂料数据
const coatingList = [
  { id: 1, name: '砂璧状建筑涂料（真石漆）', remark: '' },
  { id: 2, name: '仿石真石漆', remark: '' },
  { id: 3, name: '内外墙乳胶漆', remark: '' },
  { id: 4, name: '内墙防霉涂料', remark: '' },
  { id: 5, name: '水包砂多彩涂料', remark: '' },
  { id: 6, name: '水包水多彩涂料', remark: '' },
  { id: 7, name: '弹性平涂', remark: '' },
  { id: 8, name: '金属漆', remark: '' },
  { id: 9, name: '氟碳漆', remark: '' },
  { id: 10, name: '反射隔热涂料', remark: '' },
  { id: 11, name: '无机液态防火涂料', remark: '' },
  { id: 12, name: '抗碱渗透底漆', remark: '' },
  { id: 13, name: '罩面漆', remark: '' },
  { id: 14, name: '中空玻璃玻珠保温隔热材料', remark: '' },
  { id: 15, name: '拉毛涂料', remark: '' },
  { id: 16, name: '硅藻泥', remark: '' }
]

// 防水材料数据
const waterproofList = [
  { id: 1, name: '水泥基渗透结晶型防水涂料', remark: '' },
  { id: 2, name: '聚合物水泥 JS 防水涂料', remark: '' },
  { id: 3, name: 'K11防水涂料', remark: '' },
  { id: 4, name: '瓷砖背胶（单组份）', remark: '' }
]

// 特种砂浆数据
const mortarList = [
  { id: 1, name: '外墙柔性腻子', remark: '' },
  { id: 2, name: '面砖粘结剂', remark: '' },
  { id: 3, name: '面砖勾缝剂', remark: '' },
  { id: 4, name: '界面砂浆', remark: '' },
  { id: 5, name: '抗裂砂浆', remark: '' },
  { id: 6, name: '胶黏剂', remark: '' },
  { id: 7, name: '抹面胶浆', remark: '' }
]

// 搜索过滤
const filteredInsulation = computed(() =>
  insulationList.filter(item =>
    item.name.includes(search.value.insulation.trim())
  )
)
const filteredCoating = computed(() =>
  coatingList.filter(item =>
    item.name.includes(search.value.coating.trim())
  )
)
const filteredWaterproof = computed(() =>
  waterproofList.filter(item =>
    item.name.includes(search.value.waterproof.trim())
  )
)
const filteredMortar = computed(() =>
  mortarList.filter(item =>
    item.name.includes(search.value.mortar.trim())
  )
)
</script>

<style scoped>
.container {
  width: 100%;
  margin: 0 auto;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}
.search-sticky {
  position: sticky;
  top: 0;
  z-index: 2;
  background: #fff;
  padding: 16px 0 8px 0;
}
</style>
