<template>
	<Line :data="chartData" :options="chartOptions" />
</template>

<script setup>
import {
	Chart as ChartJS,
	Title,
	Tooltip,
	Legend,
	LineElement,
	CategoryScale,
	LinearScale,
	PointElement,
} from 'chart.js';
import { Line } from 'vue-chartjs';

ChartJS.register(
	Title,
	Tooltip,
	Legend,
	LineElement,
	CategoryScale,
	LinearScale,
	PointElement
);

const chartData = {
	labels: ['1월', '2월', '3월', '4월'],
	datasets: [
		{
			label: '매출',
			data: [100, 200, 300, 250],
			borderColor: 'blue',
			backgroundColor: 'lightblue',
		},
	],
};

const chartOptions = {
	responsive: true,
	maintainAspectRatio: false,
};
</script>
<style scoped>

</style>