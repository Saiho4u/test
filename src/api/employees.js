import request from '@/utils/request'

// 获取员工简单列表
export function getEmployeeSimple() {
  return request({
    url: '/sys/user/simple'
  })
}

// 获取员工详细列表
export function getEmployeeList(params) {
  return request({
    url: '/sys/user',
    params
  })
}

// 批量导入员工
export function importEmployees(data) {
  return request({
    method: 'post',
    url: '/sys/user/batch',
    data
  })
}
