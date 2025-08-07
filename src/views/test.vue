<template>
	<div class="charts-container">
		<div class="chart-wrapper">
			<h2>통합 모니터링</h2>
			<Line :data="combinedChartData" :options="chartOptions" />
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

const maxDataPoints = 200;
let ws_energy = null
let ws_speed = null

const combinedChartData = ref({
	labels: [],
	datasets: [
		{
			label: 'Speed',
			data: [],
			borderColor: 'rgb(255, 99, 132)',
			backgroundColor: 'rgba(255, 99, 132, 0.2)',
			fill: true,
			tension: 0.4
		},
		{
			label: 'Power',
			data: [],
			borderColor: 'rgb(54, 162, 235)',
			backgroundColor: 'rgba(54, 162, 235, 0.2)',
			fill: true,
			tension: 0.4
		},
		{
			label: 'Air',
			data: [],
			borderColor: 'rgb(75, 192, 192)',
			backgroundColor: 'rgba(75, 192, 192, 0.2)',
			fill: true,
			tension: 0.4
		},
		{
			label: 'Gas',
			data: [],
			borderColor: 'rgb(153, 102, 255)',
			backgroundColor: 'rgba(153, 102, 255, 0.2)',
			fill: true,
			tension: 0.4
		}
	]
});

const updateCombinedChartData = (datasetIndex, value, timestamp) => {
	const newData = {
		labels: [...combinedChartData.value.labels],
		datasets: combinedChartData.value.datasets.map((dataset, index) => ({
			...dataset,
			data: [...dataset.data]
		}))
	};

	// 타임스탬프가 없는 경우에만 추가
	if (!newData.labels.includes(timestamp)) {
		newData.labels.push(timestamp);
		// 최대 데이터 포인트 제한
		if (newData.labels.length > maxDataPoints) {
			newData.labels.shift();
			// 모든 데이터셋의 첫 번째 데이터 포인트 제거
			newData.datasets.forEach(dataset => {
				dataset.data.shift();
			});
		}
	}

	// 해당 데이터셋에 새로운 값 추가
	newData.datasets[datasetIndex].data.push(value);

	// 한 번에 상태 업데이트
	combinedChartData.value = newData;
};

const connectEnergyWebSocket = () => {
	ws_energy = new WebSocket('ws://localhost:1880/ws/energygroup');

	ws_energy.onopen = () => console.log('에너지 WebSocket 연결됨');

	ws_energy.onmessage = (event) => {
		try {
			const data = JSON.parse(event.data);
			const timestamp = data.timestamp;

			// 에너지, 공기, 가스 데이터 업데이트
			updateCombinedChartData(1, data.graphs.energy.value, timestamp);
			updateCombinedChartData(2, data.graphs.air.value, timestamp);
			updateCombinedChartData(3, data.graphs.gas.value, timestamp);
		} catch (e) {
			console.error('에너지 데이터 처리 오류:', e);
		}
	};

	ws_energy.onerror = (error) => {
		console.error('에너지 WebSocket 오류:', error);
		ws_energy = null;
	};

	ws_energy.onclose = () => {
		console.log('에너지 WebSocket 연결 끊김');
		setTimeout(connectEnergyWebSocket, 3000);
	};
};

const connectSpeedWebSocket = () => {
	ws_speed = new WebSocket('ws://localhost:1880/ws/speed');

	ws_speed.onopen = () => console.log('속도 WebSocket 연결됨');

	ws_speed.onmessage = (event) => {
		try {
			const data = JSON.parse(event.data);
			// console.log('data : ', data)
			const timestamp = data.timestamp || new Date().toLocaleTimeString();
			updateCombinedChartData(0, data.graphs.speed.value, timestamp);
		} catch (e) {
			console.error('속도 데이터 처리 오류:', e);
		}
	};

	ws_speed.onerror = (error) => {
		console.error('속도 WebSocket 오류:', error);
		ws_speed = null;
	};

	ws_speed.onclose = () => {
		console.log('속도 WebSocket 연결 끊김');
		setTimeout(connectSpeedWebSocket, 3000);
	};
};

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
			display: true // 범례 표시
		}
	}
}


// 컴포넌트 마운트/언마운트 처리
onMounted(() => {
	connectEnergyWebSocket();
	connectSpeedWebSocket();
});

onBeforeUnmount(() => {
	if (ws_energy) ws_energy.close();
	if (ws_speed) ws_speed.close();
});

</script>



<style scoped>
.chart-wrapper {
	background: white;
	border-radius: 8px;
	padding: 20px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	height: 600px; /* 높이를 더 크게 조정 */
}

.charts-container {
	display: flex;
	flex-direction: column;
	gap: 20px;
	padding: 20px;

}

h2 {
	margin: 0 0 15px 0;
	font-size: 18px;
	color: #333;
	font-family: 'Noto Sans KR', sans-serif;
}
</style>