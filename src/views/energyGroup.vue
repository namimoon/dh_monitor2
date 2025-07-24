
<template>
	<div class="charts-container">
		<div class="chart-wrapper">
			<h2>power 사용량</h2>
			<Line :data="energyChartData" :options="chartOptions" />
		</div>
		<div class="chart-wrapper">
			<h2>air 사용량</h2>
			<Line :data="airChartData" :options="chartOptions" />
		</div>
		<div class="chart-wrapper">
			<h2>gas 3</h2>
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
	Legend
} from 'chart.js'
import {onBeforeUnmount, onMounted, ref} from "vue";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
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

// const speedChartData = ref(createChartData())
const energyChartData = ref(createChartData())
const airChartData = ref(createChartData())
const gasChartData = ref(createChartData())

const maxDataPoints = 20 // 최대 데이터 포인트 수

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

let ws = null

onMounted(() => {
	// WebSocket 연결
	ws = new WebSocket('ws://localhost:1880/ws/energygroup')

	ws.onopen = () => {
		console.log('WebSocket energygroup 연결 성공')
	}

	ws.onmessage = (event) => {
		try {
			const data = JSON.parse(event.data)
			// console.log('data : ', data);
			const timestamp = data.timestamp

			// 각 그래프 데이터 업데이트
			updateChartData(energyChartData, data.graphs.energy.value, timestamp)
			updateChartData(airChartData, data.graphs.air.value, timestamp)
			updateChartData(gasChartData, data.graphs.gas.value, timestamp)
			// updateChartData(speedChartData, data.graphs.speed.value, timestamp)
		} catch (e) {
			console.error('데이터 처리 오류:', e)
		}
	}
})

onBeforeUnmount(() => {
	if (ws) ws.close()
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