/*
 * @Author: sam.hongyang
 * @LastEditors: sam.hongyang
 * @Description: function description
 * @Date: 2020-07-16 20:47:58
 * @LastEditTime: 2020-07-16 20:48:31
 */
export default [{
  path: '/dashboard',
  name: 'dashboard',
  component: () => import(/* webpackChunkName: "dashboard" */ '@/modules/index/index.vue'),
  meta: {
    title: '首页'
  }
}]
