<template>
	<div class="main-container">
		<!-- 헤더 섹션 -->
		<div class="header-section">
			<div class="page-title">
				<el-icon><Monitor /></el-icon>
				Corrugator 실시간 모니터링
			</div>
		</div>

		<!-- 수주번호와 진행률 섹션을 감싸는 컨테이너 -->
		<div class="info-container">
			<!-- 수주번호 섹션 -->
			<div class="info-section order-section">
				<div class="section-header">
					<h3>
						<el-icon><Document /></el-icon>
						수주번호 정보
					</h3>
				</div>
				<div class="order-card">
					<el-card shadow="hover" class="order-number-card">
						<div class="order-label">수주번호</div>
						<div class="order-number">{{ orderNumber }}</div>
					</el-card>
				</div>
			</div>

			<!-- 진행률 섹션 -->
			<div class="info-section progress-section">
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
							<span class="target-value">{{ actCount }}</span> /
							<span class="current-value">{{ setCount }}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		
		<!-- 운전 정보 섹션 -->
		<div class="info-section">
			<div class="section-header">
				<h3>
					<el-icon><Setting /></el-icon>
					진행 정보
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
					<span class="metric-value">{{ setQulitymeter }} m</span>
				</el-descriptions-item>
				<el-descriptions-item label="Max speed">
					<span class="metric-value">{{ maxSpeed }}</span>
				</el-descriptions-item>
				<el-descriptions-item label="WPA Width">
					<span class="metric-value">{{ wpaWidth }} mm</span>
				</el-descriptions-item>
				<el-descriptions-item label="Target Length">
					<span class="metric-value">{{ targetLength }} mm</span>
				</el-descriptions-item>
				<el-descriptions-item label="Set count">
					<span class="metric-value">{{ setCount }} Cuts</span>
				</el-descriptions-item>

				<el-descriptions-item label="Act Qulity Meter">
					<span class="metric-value">{{ actQulityMeter }} m</span>
				</el-descriptions-item>
				<el-descriptions-item label="Speed">
					<span class="metric-value">{{ speed }}</span>
				</el-descriptions-item>
				<el-descriptions-item label="Width">
					<span class="metric-value">{{ width }} mm</span>
				</el-descriptions-item>
				<el-descriptions-item label="Act Cut Length">
					<span class="metric-value">{{ actCutLength }} mm</span>
				</el-descriptions-item>
				<el-descriptions-item label="Act count">
					<span class="metric-value">{{ actCount }} Cuts</span>
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
					<span class="energy-value total">{{ totalPower }} kwh</span>
				</el-descriptions-item>
				<el-descriptions-item label="MF2 전력량">
					<span class="energy-value">{{ mf2Power }} kwh</span>
				</el-descriptions-item>
				<el-descriptions-item label="MF1 전력량">
					<span class="energy-value">{{ mf1Power }} kwh</span>
				</el-descriptions-item>
				<el-descriptions-item label="DF 전력량">
					<span class="energy-value">{{ dfPower }} kwh</span>
				</el-descriptions-item>
				<el-descriptions-item label="DRY-END 전력량">
					<span class="energy-value">{{ dryEndPower }} kwh</span>
				</el-descriptions-item>
				<el-descriptions-item label="CONTROL 전력량">
					<span class="energy-value">{{ controlPower }} kwh</span>
				</el-descriptions-item>
				<el-descriptions-item label="CONTROL 에어량">
					<span class="air-value">{{ totalAir }} L</span>
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
	Legend,
	Filler
} from 'chart.js'
import {computed, onBeforeUnmount, onMounted, ref, watch} from "vue";
import {
	Monitor,
	Document,
	Setting,
	Lightning,
	Cpu,
	TrendCharts,
	Trophy
} from '@element-plus/icons-vue'

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	Filler
)


let ws = null
let ws_power = null;
let ws_speed = null

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

// 로컬 스토리지에서 데이터를 불러오는 함수
const loadStoredData = (key, defaultValue) => {
	const storedData = localStorage.getItem(key);
	return storedData ? JSON.parse(storedData) : defaultValue;
};

// const speedChartData = ref(createChartData())
const speedChartData = ref(loadStoredData('speedChartData', createChartData()));
const maxDataPoints = 200 // 최대 데이터 포인트 수


const orderNumber = ref('');
const setQulitymeter = ref('');
const maxSpeed = ref('');
const wpaWidth = ref('');
const targetLength = ref('');
const setCount = ref('');

const actQulityMeter = ref('');
const speed = ref('');
const width = ref('');
const actCutLength = ref('');
const actCount = ref('');

const totalPower = ref('');
const mf2Power = ref('');
const mf1Power = ref('');
const dfPower = ref('');
const dryEndPower = ref('');
const controlPower = ref('');

const totalAir = ref('');

const totalGas = ref('');
const gas1CV = ref('');
const gas1V = ref('');
const gas1Pressure = ref('');
const gas1T = ref('');
const gas1VS = ref('');

// watch를 사용하여 데이터 변경 시 로컬 스토리지에 저장
watch(speedChartData, (newValue) => {
	localStorage.setItem('speedChartData', JSON.stringify(newValue));
}, { deep: true });

// power WebSocket 연결 함수 추가
const connectPowerWebSocket = () => {
	ws_power = new WebSocket('ws://localhost:1880/ws/selectCorrugatorPower')

	ws_power.onopen = () => {
		console.log('WebSocket power 연결 성공')
	}

	ws_power.onmessage = (event) => {
		try {
			const data = JSON.parse(event.data)
			// 전력량 데이터 업데이트
			totalPower.value = (data.TOTAL || '0').toLocaleString()
			mf2Power.value = (data.TOTAL_E11_KWh || '0').toLocaleString()
			mf1Power.value = (data.TOTAL_E12_KWh || '0').toLocaleString()
			dfPower.value = (data.TOTAL_E13_KWh || '0').toLocaleString()
			dryEndPower.value = (data.TOTAL_E14_KWh || '0').toLocaleString()
			controlPower.value = (data.TOTAL_E15_KWh || '0').toLocaleString()

			// 에어량 데이터 업데이트
			totalAir.value = (data.TOTAL_corr_air_liter || '0').toLocaleString()


			totalGas.value = '0'
			gas1CV.value = data.gas_cv
			gas1V.value = data.gas_v
			gas1Pressure.value = data.gas_pressure
			gas1T.value = data.gas_t
			gas1VS.value = data.gas_speed
		} catch (e) {
			console.error('Power 데이터 처리 오류:', e)
		}
	}

	ws_power.onerror = (error) => {
		console.error('WebSocket power 오류:', error)
		ws_power.close()
	}

	ws_power.onclose = (event) => {
		console.warn('WebSocket power 연결 끊김. 재연결 시도...', event.code, event.reason)
		setTimeout(connectPowerWebSocket, 3000) // 3초 후 재연결 시도
	}
}

const progressPercentage = computed(() => {
	// setCount와 actCount가 있는 경우에만 계산
	if (setCount.value && actCount.value) {
		// 백분율 계산 (소수점 1자리까지)
		const percentage = (actCount.value / setCount.value) * 100
		return Math.min(Math.round(percentage * 10) / 10, 100) // 100%를 넘지 않도록 제한
	}
	return 0 // 기본값
})

// 진행률 컴포넌트에 표시될 현재값과 목표값도 computed로 설정
const currentProgress = computed(() => actCount.value || 0)
const targetProgress = computed(() => setCount.value || 0)

// 진행률에 따른 색상 설정
const progressColor = computed(() => {
	const percentage = progressPercentage.value
	if (percentage < 30) return '#f56c6c' // 빨간색 (30% 미만)
	if (percentage < 70) return '#e6a23c' // 주황색 (30% ~ 70%)
	return '#67c23a' // 초록색 (70% 이상)
})

const updateChartData = (chartData, newValue, timestamp) => {


	// 새로운 배열을 만들어서 할당
	const newLabels = [...chartData.value.labels, timestamp];
	const newData = [...chartData.value.datasets[0].data, newValue];

	// 데이터 포인트 수 제한
	if (newLabels.length > maxDataPoints) {
		newLabels.shift()
		newData.shift()
	}

	// 새로운 객체로 한 번에 할당
	chartData.value = {
		labels: newLabels,
		datasets: [{
			data: newData,
			borderColor: 'rgb(75, 192, 192)',
			backgroundColor: 'rgba(75, 192, 192, 0.2)',
			fill: true,
			tension: 0.4
		}]
	}
}
const connectSpeedWebSocket = () => {
	ws_speed = new WebSocket('ws://localhost:1880/ws/speed')

	ws_speed.onopen = () => {
		console.log('WebSocket speed 연결 성공')
	}

	ws_speed.onmessage = (event) => {
		try {
			const data = JSON.parse(event.data)
			const timestamp = data.timestamp || new Date().toLocaleTimeString()
			updateChartData(speedChartData, data.graphs.speed.value, timestamp)
		} catch (e) {
			console.error('Speed 데이터 처리 오류:', e)
		}
	}

	ws_speed.onerror = (error) => {
		console.error('WebSocket speed 오류:', error)
		ws_speed.close()
	}

	ws_speed.onclose = (event) => {
		console.warn('WebSocket speed 연결 끊김. 재연결 시도...', event.code, event.reason)
		setTimeout(connectSpeedWebSocket, 3000) // 3초 후 재연결 시도
	}
}
onMounted(() => {
	// WebSocket 연결
	ws = new WebSocket('ws://localhost:1880/ws/selectCorrugatorProgress');
	
	ws.onopen = () => {
		console.log('WebSocket selectCorrugatorMain 연결 성공')

	}
	
	ws.onmessage = (event) => {
		try {
			// 들어오는 데이터 로깅
			// console.log('수신된 원본 데이터:', event.data)

			// 데이터가 이미 객체인지 확인
			const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
			orderNumber.value = data.suze  // 수주번호 업데이트

			setQulitymeter.value = (data.setqulitymeter || '0').toLocaleString()
			maxSpeed.value = (data.maxspeed || '0').toLocaleString()
			wpaWidth.value = (data.width1 || '0').toLocaleString()
			targetLength.value = (data.targetlength || '0').toLocaleString()
			setCount.value = data.setcount

			actQulityMeter.value = (data.actqulitymeter || '0').toLocaleString()
			speed.value = (data.speed || '0').toLocaleString()
			width.value = (data.width || '0').toLocaleString()
			actCutLength.value = (data.actcutlength || '0').toLocaleString()
			actCount.value = data.actcount

		} catch (e) {
			console.error('데이터 처리 오류:', e)
		}
	};

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

	// power WebSocket 연결 추가
	connectPowerWebSocket()
	connectSpeedWebSocket()

});

onBeforeUnmount(() => {
	if (ws) ws.close()
	if (ws_power) ws_power.close()
	if (ws_speed) ws_speed.close()
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
/* 기본 컨테이너 스타일 */
.main-container {
	background-color: #f5f7fa;
	min-height: 100vh;
	padding: 24px;
	max-width: 1600px;
	margin: 0 auto;
}

/* 헤더 섹션 */
.header-section {
	margin-bottom: 24px;
	background: #1a237e;
	padding: 20px;
	border-radius: 12px;
}

.page-title {
	font-size: 28px;
	font-weight: 600;
	color: white;
	display: flex;
	align-items: center;
	gap: 12px;
}

/* 수주번호와 진행률을 포함하는 컨테이너 */
.info-container {
	display: flex;
	gap: 24px;
	margin-bottom: 24px;
}

/* 수주번호 섹션 */
.order-section {
	flex: 0 0 300px;
	background: white;
	border-radius: 12px;
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.order-card {
	padding: 20px;
	height: calc(100% - 60px);
	display: flex;
	align-items: center;
}

.order-number-card {
	width: 100%;
	background: linear-gradient(135deg, #1a237e 0%, #3949ab 100%);
	padding: 24px;
	border-radius: 8px;
	text-align: center;
}

.order-label {
	font-size: 16px;
	color: rgba(255, 255, 255, 0.9);
	margin-bottom: 12px;
}

.order-number {
	font-size: 28px;
	font-weight: 700;
	color: white;
	text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* 진행률 섹션 */
.progress-section {
	flex: 1;
	background: white;
	border-radius: 12px;
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.progress-container {
	padding: 24px;
	display: flex;
	align-items: center;
	height: calc(100% - 60px);
}

.progress-item {
	width: 100%;
}

.progress-label {
	font-size: 18px;
	font-weight: 600;
	color: #333;
	margin-bottom: 12px;
}

.main-progress {
	margin: 16px 0;
	height: 32px !important;
}

.progress-details {
	display: flex;
	justify-content: flex-end;
	gap: 12px;
	font-size: 20px;
	font-weight: 600;
}

.target-value, .current-value {
	padding: 8px 16px;
	border-radius: 6px;
	background: #e3f2fd;
	color: #1976d2;
}

/* 섹션 헤더 공통 스타일 */
.section-header {
	padding: 16px 24px;
	background: #1a237e;
	border-top-left-radius: 12px;
	border-top-right-radius: 12px;
}

.section-header h3 {
	margin: 0;
	font-size: 18px;
	font-weight: 600;
	color: white;
	display: flex;
	align-items: center;
	gap: 8px;
}

/* 데이터 표시 섹션 */
.info-section {
	background: white;
	border-radius: 12px;
	margin-bottom: 24px;
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.custom-descriptions {
	padding: 20px;
}

/* 데이터 값 스타일 */
.metric-value, .energy-value, .air-value, .gas-value, .sensor-value {
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24px;
	font-weight: 600;
	padding: 12px;
	border-radius: 8px;
	margin-top: 8px;
	font-family: 'Roboto Mono', monospace;
}

.metric-value {
	background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
	color: #1976d2;
}

.energy-value {
	background: linear-gradient(135deg, #f1f8e9 0%, #dcedc8 100%);
	color: #558b2f;
}

.energy-value.total {
	background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
	color: #f57c00;
	font-size: 28px;
}

.air-value {
	background: linear-gradient(135deg, #eceff1 0%, #cfd8dc 100%);
	color: #455a64;
}

.gas-value {
	background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
	color: #c62828;
}

/* 차트 섹션 */
.chart-section {
	background: white;
	border-radius: 12px;
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
	overflow: hidden;
}

.chart-wrapper {
	padding: 24px;
	height: 400px;
}

/* 반응형 디자인 */
@media (max-width: 1024px) {
	.info-container {
		flex-direction: column;
	}

	.order-section {
		flex: none;
		width: 100%;
	}

	.progress-section {
		width: 100%;
	}
}

@media (max-width: 768px) {
	.main-container {
		padding: 16px;
	}

	.metric-value, .energy-value, .air-value, .gas-value {
		font-size: 20px;
	}

	.energy-value.total {
		font-size: 24px;
	}

	.page-title {
		font-size: 24px;
	}
}
</style>
