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
						    v-model="inputData"
						    placeholder="수주번호 검색"
						    class="search-input"
						    :prefix-icon="Search"
						    clearable
						  />
						<el-button type="primary" :icon="Search" class="search-button" @click="searchData">
						  조회
						</el-button>
					</div>
				</div>

				<el-table
				  :data="resultData"
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
				<el-table-column prop="address" label="평균속도(m/s)" width="120">
					<template #default="scope">
						<span class="numeric-value">{{ scope.row.address }}</span>
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
					:data="recentData"
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
					<el-table-column prop="width" label="자폭(mm)">
						<template #default="scope">
							<span class="numeric-value">{{ scope.row.width }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="length" label="장(m)">
						<template #default="scope">
							<span class="numeric-value">{{ scope.row.length }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="square" label="넓이(㎡)">
						<template #default="scope">
							<span class="numeric-value">{{ scope.row.square }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="energy" label="사용전력량(kwh)">
						<template #default="scope">
							<span class="numeric-value">{{ scope.row.energy }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="air" label="사용에어량(L)">
						<template #default="scope">
							<span class="numeric-value">{{ scope.row.air }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="gas" label="사용가스량(m³)">
						<template #default="scope">
							<span class="numeric-value">{{ scope.row.gas }}</span>
						</template>
					</el-table-column>
				</el-table>

			</div>
		</div>
	</div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import { Search, Histogram, List, Download, Refresh } from '@element-plus/icons-vue'
import {ElMessage} from "element-plus";

const inputData = ref('')
const isLoading = ref(false)

const format = (percentage) => {
  return `${(percentage / 100 * 1000).toFixed(1)} kWh`
}

const searchData = async () => {
	isLoading.value = true

	// Node-RED로 데이터 요청
	const ws_search = new WebSocket('ws://localhost:1880/ws/suzunum')
	ws_search.onopen = () => {
		ws_search.send(inputData.value)
	}

	ws_search.onmessage = (event) => {
		try {
			// 들어오는 데이터 로깅
			// console.log('수신된 원본 데이터:', event.data)
			// 데이터가 이미 객체인지 확인
			const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
			// 파싱된 데이터 로깅
			// console.log('파싱된 데이터:', data)
			resultData.value = data.map(item => ({
				date: item.daytime,        // 시작시간
				name: item.suze,           // 수주번호
				width: item.width1,        // 자폭(mm)
				length: item.targetlength, // 장(m)
				square: item.square,       // 넓이(㎡)
				address: item.AVG_SPEED,   // 평균속도
				energy: item.TOTAL_ENERGY_SUM,      // 사용전력량(kwh)
				air: item.TOTAL_corr_air_liter,     // 사용에어량(L)
				gas: 0                     // 사용가스량(m³)
			}))
			
			
			isLoading.value = false
			
			ws.close()

		} catch (error) {
			console.error('데이터 파싱 오류:', error)
			ElMessage.error('데이터 처리 중 오류가 발생했습니다.')
			isLoading.value = false
		}
	}
}
const tableRowClassName = ({ row, rowIndex }) => {
	// recentData 테이블의 첫 번째 행만 빨간색으로 표시
	if (rowIndex === 0 && row === recentData.value[0]) {
		return 'first-row'
	}
	return ''
}


const resultData = ref([])
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
const recentData = ref([])

// const recentData = [
// 	{
// 		date: '2016-05-03 23:11:44',
// 		name: 'Tom',
// 		address: 'No. 189, Grove St, Los Angeles',
// 	},
// 	{
// 		date: '2016-05-02 23:11:44',
// 		name: 'Tom',
// 		address: 'No. 189, Grove St, Los Angeles',
// 	},
// 	{
// 		date: '2016-05-04 23:11:44',
// 		name: 'Tom',
// 		address: 'No. 189, Grove St, Los Angeles',
// 	},
// 	{
// 		date: '2016-05-01 23:11:44',
// 		name: 'Tom',
// 		address: 'No. 189, Grove St, Los Angeles',
// 	},
// ];

let ws = null

onMounted(() => {
	ws = new WebSocket('ws://localhost:1880/ws/corrugatorusage')

	ws.onopen = () => {
		console.log('WebSocket 연결 성공')
	}

	ws.onmessage = (event) => {
		try {
			// 들어오는 데이터 로깅
			// console.log('수신된 원본 데이터:', event.data)

			// 데이터가 이미 객체인지 확인
			const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data

			// 파싱된 데이터 로깅
			// console.log('파싱된 데이터:', data)
			// 받은 데이터를 직접 recentData에 할당 (덮어쓰기)
			recentData.value = data.map(item => ({
				date: item.daytime,        // 시작시간
				name: item.suze,           // 수주번호
				width: item.width1,        // 자폭(mm)
				length: item.targetlength, // 장(m)
				square: item.square,       // 넓이(㎡)
				address: item.AVG_SPEED,   // 평균속도
				energy: item.TOTAL_ENERGY_SUM,      // 사용전력량(kwh)
				air: item.TOTAL_corr_air_liter,     // 사용에어량(L)
				gas: 0                     // 사용가스량(m³)
			}))


		} catch (e) {
			console.error('데이터 처리 중 오류 발생:', e)
			console.error('문제가 된 데이터:', event.data)
		}
	}

	ws.onerror = (err) => {
		console.error('WebSocket 오류:', err)
	}

	ws.onclose = () => {
		console.log('WebSocket 연결 종료')
		// 재연결 로직 추가
		setTimeout(() => {
			console.log('WebSocket 재연결 시도...')
			onMounted()
		}, 5000)
	}
})

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
:deep(.first-row) {
	background-color: #fef0f0 !important;
}

:deep(.first-row td) {
	background-color: #fef0f0 !important;
	color: #f56c6c;
}
/* stripe 속성이 있는 경우를 위한 추가 스타일 */
:deep(.el-table--striped .first-row td) {
	background-color: #fef0f0 !important;
}



:deep(.el-progress-bar__outer) {
  border-radius: 4px;
}

:deep(.el-tag) {
  font-weight: 500;
}
</style>
