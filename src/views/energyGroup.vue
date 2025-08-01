
<template>
	<div class="charts-container">
		<div class="chart-wrapper">
			<h2>Speed</h2>
			<Line :data="speedChartData" :options="chartOptions" />
		</div>
		<div class="chart-wrapper">
			<h2>power 사용량</h2>
			<Line :data="energyChartData" :options="chartOptions" />
		</div>
		<div class="chart-wrapper">
			<h2>air 사용량</h2>
			<Line :data="airChartData" :options="chartOptions" />
		</div>
		<div class="chart-wrapper">
			<h2>gas</h2>
			<Line :data="gasChartData" :options="chartOptions" />
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
	Filler  // Filler 플러그인 추가
} from 'chart.js'
import {onBeforeUnmount, onMounted, ref, watch} from "vue";

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

// 각 그래프별 데이터 저장소
const createChartData = () => ({
	labels: [],
	datasets: [{
		data: [],
		borderColor: 'rgb(75, 192, 192)',
		backgroundColor: 'rgba(75, 192, 192, 0.2)',
		fill: true,
		tension: 0.4
	}]
})

// 로컬 스토리지에서 데이터를 불러오는 함수
const loadStoredData = (key, defaultValue) => {
	const storedData = localStorage.getItem(key);
	return storedData ? JSON.parse(storedData) : defaultValue;
};


// const speedChartData = ref(createChartData())
// const energyChartData = ref(createChartData())
// const airChartData = ref(createChartData())
// const gasChartData = ref(createChartData())

// 각 그래프별 데이터 저장소 초기화 (로컬 스토리지에서 불러오기)
const speedChartData = ref(loadStoredData('speedChartData', createChartData()));
const energyChartData = ref(loadStoredData('energyChartData', createChartData()));
const airChartData = ref(loadStoredData('airChartData', createChartData()));
const gasChartData = ref(loadStoredData('gasChartData', createChartData()));


const maxDataPoints = 200 // 최대 데이터 포인트 수

// watch를 사용하여 데이터 변경 시 로컬 스토리지에 저장
watch(speedChartData, (newValue) => {
	localStorage.setItem('speedChartData', JSON.stringify(newValue));
}, { deep: true });

watch(energyChartData, (newValue) => {
	localStorage.setItem('energyChartData', JSON.stringify(newValue));
}, { deep: true });

watch(airChartData, (newValue) => {
	localStorage.setItem('airChartData', JSON.stringify(newValue));
}, { deep: true });

watch(gasChartData, (newValue) => {
	localStorage.setItem('gasChartData', JSON.stringify(newValue));
}, { deep: true });



// 각 그래프별 데이터 업데이트 함수
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



const chartData1 = {
	labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월'],
	datasets: [{
		label: '데이터 1',
		backgroundColor: 'rgba(255, 99, 132, 0.2)',
		borderColor: 'rgb(255, 99, 132)',
		data: [40, 39, 10, 40, 39, 80, 40],
		fill: true,
		tension: 0.4
	}]
}

const chartData2 = {
	labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월'],
	datasets: [{
		label: '데이터 2',
		backgroundColor: 'rgba(54, 162, 235, 0.2)',
		borderColor: 'rgb(54, 162, 235)',
		data: [60, 55, 32, 70, 45, 65, 55],
		fill: true,
		tension: 0.4
	}]
}

const chartData3 = {
	labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월'],
	datasets: [{
		label: '데이터 3',
		backgroundColor: 'rgba(75, 192, 192, 0.2)',
		borderColor: 'rgb(75, 192, 192)',
		data: [20, 45, 65, 35, 50, 45, 60],
		fill: true,
		tension: 0.4
	}]
}

let ws_energy = null
let ws_speed = null  // 새로운 WebSocket 변수

const connectEnergyWebSocket = () => {
	ws_energy = new WebSocket('ws://localhost:1880/ws/energygroup')

	ws_energy.onopen = () => {
		console.log('WebSocket energygroup 연결 성공')
	}

	ws_energy.onmessage = (event) => {
		try {
			const data = JSON.parse(event.data)
			// console.log('=--==data : ', data)
			const timestamp = data.timestamp

			// 각 그래프 데이터 업데이트
			updateChartData(energyChartData, data.graphs.energy.value, timestamp)
			updateChartData(airChartData, data.graphs.air.value, timestamp)
			updateChartData(gasChartData, data.graphs.gas.value, timestamp)
		} catch (e) {
			console.error('데이터 처리 오류:', e)
		}
	}

	ws_energy.onerror = (error) => {
		console.error('WebSocket energygroup 오류:', error)
		ws_energy.close()
	}

	ws_energy.onclose = (event) => {
		console.warn('WebSocket energygroup 연결 끊김. 재연결 시도...', event.code, event.reason)
		setTimeout(connectEnergyWebSocket, 3000) // 3초 후 재연결 시도
	}
}

// Speed WebSocket 연결 함수
const connectSpeedWebSocket = () => {
	ws_speed = new WebSocket('ws://localhost:1880/ws/speed')

	ws_speed.onopen = () => {
		console.log('WebSocket speed 연결 성공')
	}

	ws_speed.onmessage = (event) => {
		try {
			const data = JSON.parse(event.data)
			// console.log('=--==data : ', data)
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
	connectEnergyWebSocket()
	connectSpeedWebSocket()

})

onBeforeUnmount(() => {
	if (ws_energy) ws_energy.close()
	if (ws_speed) ws_speed.close()
})

const chartOptions = {
	responsive: true,
	maintainAspectRatio: false,
	animation: {
		duration: 300
	},
	scales: {
		y: {
			beginAtZero: true
		}
	},
	plugins: {
		legend: {
			display: false
		}
	}

}
</script>

<style scoped>
.charts-container {
	display: flex;
	flex-direction: column;
	gap: 20px;
	padding: 20px;

}

.chart-wrapper {
	background: white;
	border-radius: 8px;
	padding: 20px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	height: 300px;
}

h2 {
	margin: 0 0 15px 0;
	font-size: 18px;
	color: #333;
	font-family: 'Noto Sans KR', sans-serif;
}
</style>
