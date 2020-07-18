/*
 * @Author: sam.hongyang
 * @LastEditors: sam.hongyang
 * @Description: http 请求配置文件
 * @Date: 2019-06-27 15:22:55
 * @LastEditTime: 2020-07-16 20:09:25
 */

export default {
  baseUrl: {
    development: '/api',
    production: '/api', // 正式服务器环境
  },
  // NOTE: 不设置请求过期时间，一直等待接口返回
  // timeout: 60000,
}
