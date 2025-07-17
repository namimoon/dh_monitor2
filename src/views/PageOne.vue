<template>
  <div class="container">
    <h2>🛰 WebSocket 실시간 데이터 보기</h2>

    <!-- 전체 수신 객체 표시 -->
    <pre>{{ message }}</pre>

    <!-- 사용자가 키를 입력할 수 있는 입력 필드 -->
    <label>
      조회할 키 입력 (예: bit3)
      <input v-model="selectedKey" placeholder="예: bit3" />
    </label>

    <!-- 해당 키 값 출력 -->
    <p>
      <strong>{{ selectedKey }}:</strong>
      {{ selectedValue !== undefined ? selectedValue : '❌ 존재하지 않는 키입니다.' }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useWebSocket } from '@/composables/useWebSocket'

// WebSocket으로부터 전체 메시지 받아옴
const { message } = useWebSocket('ws://192.168.0.115:1880/ws/data') // 이 IP는 Node-RED 주소에 맞게 조정하세요

// 사용자가 입력한 키
const selectedKey = ref('bit0')

// 해당 키에 대한 값
const selectedValue = computed(() => message.value[selectedKey.value])
</script>

<style scoped>
.container {
  padding: 20px;
  font-family: Arial, sans-serif;
}

input {
  margin-top: 10px;
  padding: 4px 8px;
  font-size: 16px;
}
</style>
