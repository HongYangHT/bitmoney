/*
 * @Author: sam.hongyang
 * @LastEditors: sam.hongyang
 * @Description: function description
 * @Date: 2020-05-20 11:02:08
 * @LastEditTime: 2020-07-16 20:42:16
 */
import * as types from './types'
import { localStore } from '@/common/utils/storage'
export default {
  [types.SET_TOKEN] (state, payload) {
    state.token = payload
    localStore.set('access_token', payload)
  },
  [types.SET_USER_INFO] (state, payload) {
    state.userInfo = payload
    localStore.set('user-info', payload)
  }
}
