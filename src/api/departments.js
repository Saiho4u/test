import request from '@/utils/request'

// 获取部门列表
export function getDepartments() {
  return request({
    url: '/company/department'
  })
}

// 删除部门(根据 id)
export function delDepartments(id) {
  return request({
    url: '/company/department/' + id,
    method: 'delete'
  })
}
