<template>
	<div class="main-container">
		<!-- 헤더 섹션 -->
		<div class="header-section">
			<div class="page-title">
				<el-icon><Monitor /></el-icon>
				Corrugator 실시간 모니터링
			</div>
		</div>
		
		<!-- 수주번호 섹션 -->
		<div class="info-section">
			<div class="section-header">
				<h3>
					<el-icon><Document /></el-icon>
					수주번호 정보
				</h3>
			</div>
			<div class="order-card">
				<el-card shadow="hover" class="order-number-card">
					<div class="order-label">수주번호</div>
					<div class="order-number">2025072400508</div>
				</el-card>
			</div>
		</div>
		
		<!-- 진행률 섹션 -->
		<div class="info-section">
			<div class="section-header">
				<h3>
					<el-icon><Trophy /></el-icon>
					작업 진행률
				</h3>
			</div>
			<div class="progress-container">
				<div class="progress-item">
					<div class="progress-label">전체 작업 진행률</div>
					<el-progress
						:percentage="progressPercentage"
						:stroke-width="20"
						:text-inside="true"
						:color="progressColor"
						class="main-progress"
					/>
					<div class="progress-details">
						<span class="current-value">{{ currentProgress }}</span>
						<span class="target-value">{{ targetProgress }}</span>
					</div>
				</div>
			
			</div>
		</div>
		
		
		<!-- 운전 정보 섹션 -->
		<div class="info-section">
			<div class="section-header">
				<h3>
					<el-icon><Setting /></el-icon>
					운전 정보
				</h3>
			</div>
			<el-descriptions
				direction="vertical"
				:column="5"
				size="default"
				border
				class="custom-descriptions"
			>
				<el-descriptions-item label="Set Quality Meter">
					<span class="metric-value">8,681 m</span>
				</el-descriptions-item>
				<el-descriptions-item label="Max speed">
					<span class="metric-value">400</span>
				</el-descriptions-item>
				<el-descriptions-item label="WPA Width">
					<span class="metric-value">1,400 mm</span>
				</el-descriptions-item>
				<el-descriptions-item label="Target Length">
					<span class="metric-value">1,240 mm</span>
				</el-descriptions-item>
				<el-descriptions-item label="Set count">
					<span class="metric-value">3,538 Cuts</span>
				</el-descriptions-item>
			</el-descriptions>
		</div>
		
		<!-- 에너지 정보 섹션 -->
		<div class="info-section">
			<div class="section-header">
				<h3>
					<el-icon><Lightning /></el-icon>
					에너지 사용량
				</h3>
			</div>
			<el-descriptions
				direction="vertical"
				:column="6"
				size="default"
				border
				class="custom-descriptions energy-section"
			>
				<el-descriptions-item label="TOTAL 전력량">
					<span class="energy-value total">66.233 kwh</span>
				</el-descriptions-item>
				<el-descriptions-item label="MF2 전력량">
					<span class="energy-value">7.406 kwh</span>
				</el-descriptions-item>
				<el-descriptions-item label="MF1 전력량">
					<span class="energy-value">9.750 kwh</span>
				</el-descriptions-item>
				<el-descriptions-item label="DF 전력량">
					<span class="energy-value">4.562 kwh</span>
				</el-descriptions-item>
				<el-descriptions-item label="DRY-END 전력량">
					<span class="energy-value">31.500 kwh</span>
				</el-descriptions-item>
				<el-descriptions-item label="CONTROL 전력량">
					<span class="energy-value">13.015 kwh</span>
				</el-descriptions-item>
				<el-descriptions-item label="CONTROL 에어량">
					<span class="air-value">325,632 L</span>
				</el-descriptions-item>
			</el-descriptions>
		</div>
		
		<!-- 가스 정보 섹션 -->
		<div class="info-section">
			<div class="section-header">
				<h3>
					<el-icon><Cpu /></el-icon>
					가스 및 센서 정보
				</h3>
			</div>
			<el-descriptions
				direction="vertical"
				:column="6"
				size="default"
				border
				class="custom-descriptions gas-section"
			>
				<el-descriptions-item label="TOTAL 가스량">
					<span class="gas-value">0 m³</span>
				</el-descriptions-item>
				<el-descriptions-item label="GAS1_CV">
					<span class="sensor-value">0 V</span>
				</el-descriptions-item>
				<el-descriptions-item label="GAS1_V">
					<span class="sensor-value">0 V</span>
				</el-descriptions-item>
				<el-descriptions-item label="GAS1_Pressure">
					<span class="sensor-value">0 V</span>
				</el-descriptions-item>
				<el-descriptions-item label="GAS1_T">
					<span class="sensor-value">0 V</span>
				</el-descriptions-item>
				<el-descriptions-item label="GAS1_V/S">
					<span class="sensor-value">0 V</span>
				</el-descriptions-item>
			</el-descriptions>
		</div>
		
		<!-- 차트 섹션 -->
		<div class="chart-section">
			<div class="section-header">
				<h3>
					<el-icon><TrendCharts /></el-icon>
					실시간 속도 차트
				</h3>
			</div>
			<div class="chart-wrapper">
				<Line :data="speedChartData" :options="chartOptions" />
			</div>
		</div>
		
		<!-- 상태 표시줄 -->
		<div class="status-bar">
			<div class="refresh-timer">
				<el-icon><Refresh /></el-icon>
				다음 새로고침까지: <span class="timer-value">{{ refreshTime }}초</span>
			</div>
			<div class="connection-status">
				<el-tag :type="isConnected ? 'success' : 'danger'" size="small">
					{{ isConnected ? '연결됨' : '연결 끊김' }}
				</el-tag>
			</div>
		</div>
	
	</div>
	
	
	
</template>

<script setup>
import { Line } from 'vue-chartjs'
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
} from 'chart.js'
import {onBeforeUnmount, onMounted, ref} from "vue";
import {
	Monitor,
	Document,
	Setting,
	Lightning,
	Cpu,
	TrendCharts,
	Refresh
} from '@element-plus/icons-vue'

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
)

// 반응형 데이터
const refreshTime = ref(3580)
const isConnected = ref(false)
const currentProgress = ref(2450)
const targetProgress = ref(3538)


let timer = null
let ws = null

const createChartData = () => ({
	labels: [],
	datasets: [{
		data: [],
		borderColor: '#409EFF',
		backgroundColor: 'rgba(64, 158, 255, 0.1)',
		borderWidth: 2,
		fill: true,
		tension: 0.4,
		pointBackgroundColor: '#409EFF',
		pointBorderColor: '#fff',
		pointBorderWidth: 2,
		pointRadius: 4
	}]
})

const speedChartData = ref(createChartData())
const maxDataPoints = 20 // 최대 데이터 포인트 수

// 타이머 함수
const startRefreshTimer = () => {
	timer = setInterval(() => {
		if (refreshTime.value > 0) {
			refreshTime.value--
		} else {
			refreshTime.value = 3580
		}
	}, 1000)
}


onMounted(() => {
	// WebSocket 연결
	ws = new WebSocket('ws://localhost:1880/ws/selectCorrugatorMain');
	
	ws.onopen = () => {
		console.log('WebSocket selectCorrugatorMain 연결 성공')
		isConnected.value = true
		
	}
	
	ws.onmessage = (event) => {
		try {
			const data = JSON.parse(event.data)
			// 데이터 처리 로직
		} catch (e) {
			console.error('데이터 처리 오류:', e)
		}
	};
	
	ws.onclose = () => {
		isConnected.value = false
	}
	
	ws.onerror = () => {
		isConnected.value = false
	}
	
	startRefreshTimer()
});

onBeforeUnmount(() => {
	if (ws) ws.close()
	if (timer) clearInterval(timer)
})

const chartOptions = {
	responsive: true,
	maintainAspectRatio: false,
	animation: {
		duration: 300
	},
	plugins: {
		legend: {
			display: false
		},
		tooltip: {
			backgroundColor: 'rgba(0, 0, 0, 0.8)',
			titleColor: '#fff',
			bodyColor: '#fff',
			borderColor: '#409EFF',
			borderWidth: 1
		}
	},
	scales: {
		x: {
			display: true,
			grid: {
				color: 'rgba(0, 0, 0, 0.05)'
			},
			ticks: {
				color: '#606266'
			}
		},
		y: {
			beginAtZero: true,
			grid: {
				color: 'rgba(0, 0, 0, 0.05)'
			},
			ticks: {
				color: '#606266'
			}
		}
	}
}
</script>

<style scoped>
.main-container {
	background-color: #f5f7fa;
	min-height: 100vh;
	padding: 24px;
}

.header-section {
	margin-bottom: 24px;
}

.page-title {
	font-size: 28px;
	font-weight: 600;
	color: #303133;
	display: flex;
	align-items: center;
	gap: 12px;
}

.page-title .el-icon {
	font-size: 32px;
	color: #409EFF;
}

.info-section {
	background: white;
	border-radius: 12px;
	margin-bottom: 24px;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
	overflow: hidden;
}

.section-header {
	padding: 20px 24px;
	background: linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%);
	border-bottom: 1px solid #ebeef5;
}

.section-header h3 {
	margin: 0;
	font-size: 18px;
	font-weight: 600;
	color: #303133;
	display: flex;
	align-items: center;
	gap: 8px;
}

.section-header .el-icon {
	font-size: 20px;
	color: #409EFF;
}

.order-card {
	padding: 24px;
}

.order-number-card {
	background: linear-gradient(135deg, #409EFF 0%, #66b3ff 100%);
	border: none;
}

:deep(.order-number-card .el-card__body) {
	padding: 24px;
	text-align: center;
}

.order-label {
	font-size: 14px;
	color: rgba(255, 255, 255, 0.8);
	margin-bottom: 8px;
}

.order-number {
	font-size: 28px;
	font-weight: 700;
	color: white;
	font-family: 'Monaco', 'Menlo', monospace;
}

.custom-descriptions {
	margin: 24px;
	border-radius: 8px;
	overflow: hidden;
}

:deep(.custom-descriptions .el-descriptions__header) {
	display: none;
}

:deep(.custom-descriptions .el-descriptions__label) {
	font-weight: 600;
	color: #606266;
	background-color: #fafbfc;
}

:deep(.custom-descriptions .el-descriptions__content) {
	font-weight: 500;
}

.metric-value {
	font-family: 'Monaco', 'Menlo', monospace;
	color: #409EFF;
	font-weight: 600;
	font-size: 16px;
}

.energy-value {
	font-family: 'Monaco', 'Menlo', monospace;
	color: #67C23A;
	font-weight: 600;
	font-size: 16px;
}

.energy-value.total {
	color: #E6A23C;
	font-size: 18px;
	font-weight: 700;
}

.air-value {
	font-family: 'Monaco', 'Menlo', monospace;
	color: #909399;
	font-weight: 600;
	font-size: 16px;
}

.gas-value {
	font-family: 'Monaco', 'Menlo', monospace;
	color: #F56C6C;
	font-weight: 600;
	font-size: 16px;
}

.sensor-value {
	font-family: 'Monaco', 'Menlo', monospace;
	color: #909399;
	font-weight: 500;
	font-size: 14px;
}

.status-active {
	color: #67C23A !important;
}

.chart-section {
	background: white;
	border-radius: 12px;
	margin-bottom: 24px;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
	overflow: hidden;
}

.chart-wrapper {
	padding: 24px;
	height: 400px;
}

.status-bar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: white;
	padding: 16px 24px;
	border-radius: 12px;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.refresh-timer {
	display: flex;
	align-items: center;
	gap: 8px;
	color: #606266;
	font-size: 14px;
}

.refresh-timer .el-icon {
	animation: rotate 2s linear infinite;
}

.timer-value {
	font-family: 'Monaco', 'Menlo', monospace;
	font-weight: 600;
	color: #409EFF;
}

.connection-status {
	display: flex;
	align-items: center;
	gap: 8px;
}

@keyframes rotate {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}

/* 반응형 디자인 */
@media (max-width: 768px) {
	.main-container {
		padding: 16px;
	}
	
	.page-title {
		font-size: 24px;
	}
	
	:deep(.custom-descriptions) {
		margin: 16px;
	}
	
	.status-bar {
		flex-direction: column;
		gap: 12px;
		text-align: center;
	}
}

/* Element Plus 커스터마이징 */
:deep(.el-descriptions__body .el-descriptions__table) {
	border-collapse: separate;
	border-spacing: 0;
}

:deep(.el-descriptions__body .el-descriptions__table .el-descriptions__cell) {
	border: 1px solid #ebeef5;
}

:deep(.energy-section .el-descriptions__label) {
	background-color: #f0f9ff;
}

:deep(.gas-section .el-descriptions__label) {
	background-color: #fef7f0;
}
</style>
