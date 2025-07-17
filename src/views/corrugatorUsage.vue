<template>
	<div class="main-container">

		<!-- 첫 번째 섹션 -->
		<div class="section">
			<div class="section-header">
				<h2>
					<el-icon><Histogram /></el-icon>
					Corrugator 사용량 조회
				</h2>
			</div>

			<div class="page-container">
				<div class="header-section">
					<div class="search-section">
						<el-input
						    v-model="input"
						    placeholder="수주번호 검색"
						    class="search-input"
						    :prefix-icon="Search"
						    clearable
						  />
						<el-button type="primary" :icon="Search" class="search-button">
						  조회
						</el-button>
					</div>
				</div>

				<el-table
				  :data="tableData"
				  style="width: 100%"
				  :row-class-name="tableRowClassName"
				  stripe
				  height="calc(100vh - 280px)"
				>
				<el-table-column prop="date" label="시작시간" width="180" sortable>
					<template #default="scope">
						<el-tag size="small" type="info">
						  {{ scope.row.date }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="name" label="수주번호" width="180" sortable />
				<el-table-column prop="address" label="평균속도" width="120">
					<template #default="scope">
						<span class="numeric-value">{{ scope.row.address }} m/s</span>
					</template>
				</el-table-column>
				<el-table-column prop="address" label="자폭(mm)" />
				<el-table-column prop="address" label="장(m)" />
				<el-table-column prop="address" label="넓이(㎡)" />
				<el-table-column prop="address" label="사용전력량(kwh)" />
				<el-table-column prop="address" label="사용에어량(L)" />
				<el-table-column prop="address" label="사용가스량(m³)" />

				</el-table>
			</div>
		</div>

		<!-- 두 번째 섹션 -->
		<div class="section">
			<div class="section-header">
				<h2>
					<el-icon><List /></el-icon>
					최근 수주번호 내역
				</h2>
			</div>
			<div class="page-container">
				<!-- 여기에 두 번째 섹션의 내용을 추가 -->
				<el-table
					:data="tableData2"
					style="width: 100%"
					:row-class-name="tableRowClassName"
					stripe
					height="calc(100vh - 280px)"
				>
					<el-table-column prop="date" label="시작시간" width="180" sortable>
						<template #default="scope">
							<el-tag size="small" type="info">
								{{ scope.row.date }}
							</el-tag>
						</template>
					</el-table-column>
					<el-table-column prop="name" label="수주번호" width="180" sortable />
					<el-table-column prop="address" label="평균속도" width="120">
						<template #default="scope">
							<span class="numeric-value">{{ scope.row.address }} m/s</span>
						</template>
					</el-table-column>
					<el-table-column prop="address" label="자폭(mm)" />
					<el-table-column prop="address" label="장(m)" />
					<el-table-column prop="address" label="넓이(㎡)" />
					<el-table-column prop="address" label="사용전력량(kwh)" />
					<el-table-column prop="address" label="사용에어량(L)" />
					<el-table-column prop="address" label="사용가스량(m³)" />
				</el-table>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue'
import { Search, Histogram, List, Download, Refresh } from '@element-plus/icons-vue'

const input = ref('')

const format = (percentage) => {
  return `${(percentage / 100 * 1000).toFixed(1)} kWh`
}

const tableRowClassName = ({ rowIndex }) => {
  if (rowIndex === 1) {
    return 'warning-row'
  } else if (rowIndex === 3) {
    return 'success-row'
  }
  return ''
}

const tableData = [
  {
    date: '2016-05-03 23:11:44',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02 23:11:44',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04 23:11:44',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01 23:11:44',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]

const tableData2 = [
	{
		date: '2016-05-03 23:11:44',
		name: 'Tom',
		address: 'No. 189, Grove St, Los Angeles',
	},
	{
		date: '2016-05-02 23:11:44',
		name: 'Tom',
		address: 'No. 189, Grove St, Los Angeles',
	},
	{
		date: '2016-05-04 23:11:44',
		name: 'Tom',
		address: 'No. 189, Grove St, Los Angeles',
	},
	{
		date: '2016-05-01 23:11:44',
		name: 'Tom',
		address: 'No. 189, Grove St, Los Angeles',
	},
];
</script>

<style scoped>
.main-container {
	display: flex;
	flex-direction: column;
	gap: 24px;
	padding: 24px;
	background-color: #f5f7fa;
	min-height: 100vh;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}
.section {
	background-color: white;
	border-radius: 8px;

}
.section-header {
	padding: 16px 24px;
	border-bottom: 1px solid #ebeef5;
}

.section-header h2 {
	margin: 0;
	font-size: 20px;
	color: #303133;
	display: flex;
	align-items: center;
	gap: 8px;
}
.section-header .el-icon {
	font-size: 24px;
	color: #409EFF;
}

.page-container {
  padding: 24px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.header-section {
  margin-bottom: 24px;
}

.header-section h1 {
  font-size: 28px;
  color: #303133;
  margin: 0 0 20px 0;
  font-weight: 600;
}

.search-section {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-input {
  width: 300px;
}

.search-button {
  height: 40px;
}

.numeric-value {
  font-family: 'Monaco', monospace;
  color: #409EFF;
  font-weight: 500;
}

:deep(.el-table) {
  --el-table-header-bg-color: #f5f7fa;
}

:deep(.el-table th) {
  background-color: #f5f7fa;
  font-weight: 600;
  color: #606266;
}

:deep(.el-table--striped .el-table__row--striped td) {
  background: #fafafa;
}

.warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}

.success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}

:deep(.el-progress-bar__outer) {
  border-radius: 4px;
}

:deep(.el-tag) {
  font-weight: 500;
}
</style>