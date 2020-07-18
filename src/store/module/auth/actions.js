/*
 * @Author: sam.hongyang
 * @LastEditors: sam.hongyang
 * @Description: function description
 * @Date: 2020-05-20 11:02:03
 * @LastEditTime: 2020-07-17 22:03:40
 */
import { authService } from '@/common/http'
import * as types from './types'

export function login ({ commit }, params) {
  return new Promise((resolve, reject) => {
    authService.login('/Login/pcLogin', params).then(result => {
      if (result && result.data && result.data.code === 200) {
        commit(types.SET_TOKEN, result.data.data && result.data.data.token)
        commit(types.SET_USER_INFO, result.data && result.data.data)
        resolve(result.data && result.data.data)
      } else {
        reject(result.data && result.data.data)
      }
    })
  })
}

export function createOrder ({ commit }, params) {
  return new Promise((resolve, reject) => {
    authService.createOrder('/contract/createOrder', params).then(result => {
      resolve()
    })
  })
}

export function closeOrder ({ commit }, params) {
  return new Promise((resolve, reject) => {
    authService.createOrder('/contract/closeOrder', params).then(result => {
      resolve()
    })
  })
}

export function signin({ commit }, params) {
  return new Promise((resolve, reject) => {
    authService.signin('/signin', params).then(result => {
      if (result && result.data && result.data.status === 200) {
        resolve(result.data.data)
      } else {
        reject(result.data)
      }
    })
  })
}

export function fetchGithubUser ({ commit }, params) {
  return new Promise((resolve, reject) => {
    authService.fetchGithubUser('/login/github', params).then(result => {
      if (result && result.data && result.data.status === 200) {
        commit(types.SET_TOKEN, result.data.data)
        commit(types.SET_USER_INFO, result.data.data)
        resolve(result.data.data)
      } else {
        reject(result.data)
      }
    })
  })
}
