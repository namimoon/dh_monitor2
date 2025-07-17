<template>
  <div class="page-three">
    <h2>📊 데이터 테이블</h2>

    <!-- 검색 입력창 -->
    <el-input
      v-model="search"
      placeholder="이름 또는 값 검색"
      clearable
      style="width: 300px; margin-bottom: 20px"
    />

    <!-- 테이블 구성 -->
    <el-table
      :data="filteredData"
      stripe
      border
      style="width: 100%"
    >
      <el-table-column prop="id" label="ID" width="80" sortable />
      <el-table-column prop="name" label="이름" width="180" />
      <el-table-column prop="value" label="값" sortable>
        <template #default="scope">
          <el-tag :type="scope.row.value > 50 ? 'success' : 'danger'">
            {{ scope.row.value }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'PageThree',
  setup() {
    const search = ref('')
    const tableData = ref([
      { id: 1, name: '센서 A', value: 82 },
      { id: 2, name: '센서 B', value: 47 },
      { id: 3, name: '센서 C', value: 65 },
      { id: 4, name: '센서 D', value: 25 }
    ])

    const filteredData = computed(() =>
      tableData.value.filter(item =>
        item.name.includes(search.value) ||
        item.value.toString().includes(search.value)
      )
    )

    return {
      search,
      tableData,
      filteredData
    }
  }
}
</script>

<style scoped>
.page-three {
  padding: 30px;
  max-width: 1000px;
  margin: auto;
}
</style>
