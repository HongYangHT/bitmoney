/*
 * @Author: sam.hongyang
 * @LastEditors: sam.hongyang
 * @Description: 用于分层设计，将路由提取出来, 便于做权限相关设置
 * @Date: 2020-04-09 22:43:04
 * @LastEditTime: 2020-07-16 20:48:42
 */
import login from './module/login'
import dashboard from './module/index'
// import article from './module/article'
// import aboutMe from './module/about-me'
export default [
  ...login,
  ...dashboard,
  // ...article,
  // ...aboutMe,
]
