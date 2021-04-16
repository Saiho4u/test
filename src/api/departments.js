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

// 新增部门接口
export function addDepartments(data) {
  return request({
    url: '/company/department/',
    method: 'post',
    data
  })
}

// 根据 id 获取部门详情
export function getDeptDetailById(id) {
  return request({
    url: '/company/department/' + id
  })
}
