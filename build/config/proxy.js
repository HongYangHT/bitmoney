/*
 * @Author: sam.hongyang
 * @LastEditors: sam.hongyang
 * @Description: 用于设置代理
 * @Date: 2020-04-01 18:20:21
 * @LastEditTime: 2020-07-16 20:08:09
 */
// 设置代理
module.exports = {
  proxy: {
    '/api/': {
      // target: 'https://www.hcy.cool',
      target: 'http://mnacx.io.babll.com',
      // pathRewrite: {
      //   '^/api/': ''
      // },
      changeOrigin: true,
      secure: false
    }
  }
}
