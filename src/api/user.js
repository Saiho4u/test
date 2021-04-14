import request from '@/utils/request'

export function login(data) {
  return request({
    // url: 'http://ihrm-java.itheima.net/api/sys/login',
    url: '/sys/login',
    method: 'post',
    data
  })
}

export function getUserInfo() {
  return request({
    method: 'post',
    url: '/sys/profile'
  })
}

export function getUserDetailById(id) {
  return request({
    url: '/sys/user/' + id
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
