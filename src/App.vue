<template>
  <div>
    <div style="text-align: center; padding: 10px; background-color: #eee;">
<!--	    <button @click="$router.push('/page1')">1페이지</button>-->
<!--	    <button @click="$router.push('/page2')">2페이지</button>-->
<!--	    <button @click="$router.push('/page3')">3페이지</button>-->
	    <button @click="$router.push('/page4')">4페이지</button>
	    <button @click="$router.push('/page5')">5페이지</button>
		<button @click="$router.push('/page6')">6페이지</button>
    </div>

    <!-- 각 페이지에서 컨텐츠만 보여짐 -->
    <router-view />
  </div>
</template>
<script setup lang="ts">
</script>
