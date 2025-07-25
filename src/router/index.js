import { createRouter, createWebHistory } from 'vue-router'
import PageOne from '../views/PageOne.vue'
import PageTwo from '../views/PageTwo.vue'
import PageThree from '../views/PageThree.vue' // ✅ 페이지3 import 추가
import CorrugatorUsage from '../views/corrugatorUsage.vue'
import EnergyGroup from '../views/energyGroup.vue';
import CorrugatorMain from '../views/corrugatorMain.vue'

const routes = [
  // { path: '/page1', component: PageOne },
  // { path: '/page2', component: PageTwo },
  // { path: '/page3', component: PageThree },     // ✅ 페이지3 라우트 추가
  { path: '/page4', component: CorrugatorUsage},
  { path: '/page5', component: EnergyGroup},
  { path: '/page6', component: CorrugatorMain},
  { path: '/', redirect: '/page1' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
