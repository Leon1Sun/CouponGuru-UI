import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Chart from '@/components/Chart'
import Slider from '../components/slider/slider.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },{
    path:'/chart',
      name:'chart',
      component:Chart
    },{
      path:'/slider',
      name:'slider',
      component:Slider
    }


  ]
})
