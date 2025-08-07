<template>
	<div class="app-container">
		<nav class="navigation">
			<router-link
				v-for="route in routes"
				:key="route.path"
				:to="route.path"
				class="nav-button"
				:class="{ active: currentRoute === route.path }"
			>
				{{ route.name }}
			</router-link>
		</nav>
		<main class="main-content">
			<router-view></router-view>
		</main>
	</div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const currentRoute = computed(() => route.path)

const routes = [
	{ path: '/page1', name: '설정1' },
	{ path: '/page2', name: '설정2' },
	{ path: '/page3', name: '설정3' },
	{ path: '/page4', name: '설정4' },
	{ path: '/page5', name: '설정5' },
	{ path: '/page6', name: '설정6' },
	{ path: '/test', name: 'test' }
]
</script>

<style scoped>
.app-container {
	min-height: 100vh;
	background-color: #f5f7fa;
	display: flex;
	flex-direction: column;
}

.navigation {
	background-color: white;
	padding: 1rem 2rem;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	display: flex;
	gap: 1rem;
	position: sticky;
	top: 0;
	z-index: 1000;
}

.nav-button {
	padding: 0.75rem 1.5rem;
	border-radius: 8px;
	text-decoration: none;
	color: #606266;
	font-weight: 500;
	font-size: 1rem;
	transition: all 0.3s ease;
}

.nav-button:hover {
	background-color: #f0f2f5;
	color: #409EFF;
}

.nav-button.active {
	background-color: #409EFF;
	color: white;
}

.main-content {
	flex: 1;
	padding: 1rem 2rem;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
	.navigation {
		padding: 1rem;
		flex-wrap: wrap;
		justify-content: center;
	}

	.nav-button {
		padding: 0.5rem 1rem;
		font-size: 0.9rem;
	}
}
</style>