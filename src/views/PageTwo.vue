<template>
  <div class="svg-container">
    <div class="toolbar">
      <button class="add-btn" @click="addBox">➕ 사각형 추가</button>
      <button class="save-btn" @click="saveToServer">📁 저장</button>
      <button class="delete-btn" @click="deleteSelectedBox" :disabled="!selectedBoxId">🗑 삭제</button>
    </div>

    <svg
      ref="svgRef"
      :viewBox="`0 0 ${imgWidth} ${imgHeight}`"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      @mousemove="onMouseMove"
      @mouseup="onMouseUp"
    >
      <image
        :href="require('@/assets/bhs흰색라벨베이스.jpg')"
        :width="imgWidth"
        :height="imgHeight"
      />

      <template v-for="box in boxes" :key="box.id">
        <rect
          :x="box.x"
          :y="box.y"
          :width="box.width"
          :height="box.height"
          rx="10"
          ry="10"
          :fill="message[box.selectedKey] === 1 ? 'green' : 'gray'"
          :stroke="selectedBoxId === box.id ? 'yellow' : 'black'"
          :stroke-width="selectedBoxId === box.id ? 4 : 2"
          @mousedown="startDrag($event, 'move', box.id)"
        />

        <rect
          :x="box.x + box.width - 10"
          :y="box.y + box.height - 10"
          width="10"
          height="10"
          fill="blue"
          cursor="se-resize"
          @mousedown="startDrag($event, 'resize', box.id)"
        />

        <text
          :x="box.x + box.width / 2"
          :y="box.y + box.height / 2"
          text-anchor="middle"
          alignment-baseline="middle"
          :font-size="box.height * 0.4"
          font-weight="bold"
          fill="white"
        >
          {{ box.selectedKey }}: {{ message[box.selectedKey] }}
        </text>
      </template>
    </svg>

    <div
      v-if="selectedBox"
      class="dropdown-container"
      :style="{ top: dropdownPosition.top, left: dropdownPosition.left }"
    >
      <label>표시할 키 선택: </label>
      <select v-model="selectedBox.selectedKey">
        <option disabled value="">-- 키를 선택하세요 --</option>
        <option v-for="key in Object.keys(message)" :key="key" :value="key">
          {{ key }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useWebSocket } from '@/composables/useWebSocket'
import axios from 'axios'

let nextBoxId = 1

export default {
  name: 'PageTwo',
  setup() {
    const svgRef = ref(null)
    const { message } = useWebSocket('ws://192.168.0.115:1880/ws/data')
    const imgWidth = 1920
    const imgHeight = 1080

    const boxes = ref([])
    const selectedBoxId = ref(null)
    const dropdownPosition = ref({ top: '0px', left: '0px' })

    const selectedBox = computed(() => boxes.value.find(b => b.id === selectedBoxId.value))

    const addBox = () => {
      boxes.value.push({
        id: nextBoxId++,
        x: 200,
        y: 200,
        width: 200,
        height: 100,
        selectedKey: 'bit0'
      })
    }

    const deleteSelectedBox = () => {
      if (!selectedBox.value) return
      boxes.value = boxes.value.filter(b => b.id !== selectedBoxId.value)
      selectedBoxId.value = null
      saveToServer()
    }

    const saveToServer = async () => {
      try {
        await axios.post('http://localhost:3001/save-boxes', boxes.value)
        console.log('저장 완료')
      } catch (e) {
        console.error('저장 실패', e)
      }
    }

    const loadFromServer = async () => {
      try {
        const res = await axios.get('http://localhost:3001/load-boxes')
        boxes.value = res.data
        if (boxes.value.length > 0) {
          nextBoxId = Math.max(...boxes.value.map(b => b.id)) + 1
        }
      } catch (e) {
        console.warn('불러오기 실패:', e)
      }
    }

    const updateDropdownPosition = () => {
      const svg = svgRef.value
      const box = selectedBox.value
      if (!svg || !box) return
      const pt = svg.createSVGPoint()
      pt.x = box.x + box.width + 10
      pt.y = box.y - 10
      const screenCTM = svg.getScreenCTM()
      const globalPoint = pt.matrixTransform(screenCTM)
      dropdownPosition.value.top = `${globalPoint.y}px`
      dropdownPosition.value.left = `${globalPoint.x}px`
    }

    const dragState = ref({ mode: null, startX: 0, startY: 0, startBox: null, boxId: null })

    const getSvgCoords = (event) => {
      const pt = svgRef.value.createSVGPoint()
      pt.x = event.clientX
      pt.y = event.clientY
      return pt.matrixTransform(svgRef.value.getScreenCTM().inverse())
    }

    const startDrag = (event, mode, boxId) => {
      const box = boxes.value.find(b => b.id === boxId)
      const coords = getSvgCoords(event)
      dragState.value = {
        mode,
        startX: coords.x,
        startY: coords.y,
        startBox: { ...box },
        boxId
      }
      selectedBoxId.value = boxId
      updateDropdownPosition()
    }

    const onMouseMove = (event) => {
      const drag = dragState.value
      if (!drag.mode) return
      const coords = getSvgCoords(event)
      const box = boxes.value.find(b => b.id === drag.boxId)
      const dx = coords.x - drag.startX
      const dy = coords.y - drag.startY

      if (drag.mode === 'move') {
        box.x = drag.startBox.x + dx
        box.y = drag.startBox.y + dy
      } else if (drag.mode === 'resize') {
        box.width = Math.max(50, drag.startBox.width + dx)
        box.height = Math.max(30, drag.startBox.height + dy)
      }
      updateDropdownPosition()
    }

    const onMouseUp = () => {
      dragState.value.mode = null
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Delete' && selectedBox.value) {
        deleteSelectedBox()
      }
    }

    const handleClickOutside = (e) => {
      const isToolbarButton = e.target.closest('.toolbar')
      const isSelect = e.target.closest('select')
      if (!isToolbarButton && !isSelect && e.target.tagName !== 'rect') {
        selectedBoxId.value = null
      }
    }

    onMounted(() => {
      loadFromServer()
      document.addEventListener('keydown', handleKeyDown)
      document.addEventListener('mousedown', handleClickOutside)
    })

    onBeforeUnmount(() => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
    })

    return {
      svgRef,
      message,
      imgWidth,
      imgHeight,
      boxes,
      selectedBoxId,
      selectedBox,
      dropdownPosition,
      addBox,
      deleteSelectedBox,
      saveToServer,
      startDrag,
      onMouseMove,
      onMouseUp
    }
  }
}
</script>

<style scoped>
.svg-container {
  width: 100vw;
  height: 100vh;
  position: relative;
  user-select: none;
}

.toolbar {
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  gap: 12px;
  z-index: 1000;
  flex-wrap: wrap;
}

.toolbar button {
  padding: 8px 16px;
  font-size: 16px;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  min-width: 100px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.add-btn {
  background-color: #4caf50;
}

.save-btn {
  background-color: #2196f3;
}

.delete-btn {
  background-color: #f44336;
}

.dropdown-container {
  position: fixed;
  z-index: 9999;
  background: white;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}
</style>
