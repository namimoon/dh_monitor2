import { ref, onUnmounted } from 'vue'

export function useWebSocket(url) {
  const message = ref({})
  let socket = null

  function connect() {
    socket = new WebSocket(url)

    socket.onopen = () => {
      console.log('✅ WebSocket 연결됨')
    }

    socket.onmessage = (event) => {
      try {
        // 문자열 → 객체로 변환
        const parsed = JSON.parse(event.data)
        message.value = parsed
      } catch (e) {
        console.error('❌ JSON 파싱 실패:', event.data)
        message.value = {}  // 파싱 실패 시 안전값
      }
    }

    socket.onerror = (error) => {
      console.error('❌ WebSocket 오류:', error)
      socket.close()
    }

    socket.onclose = () => {
      console.warn('🔁 WebSocket 재연결 시도...')
      setTimeout(connect, 3000)
    }
  }

  connect()

  onUnmounted(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.close()
    }
  })

  return { message }
}
