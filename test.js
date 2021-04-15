const oldData = [
  { id: 1, name: '总裁办', pid: '' },
  { id: 2, name: '财务部', pid: '' },
  { id: 3, name: '税务管理部', pid: '2' },
  { id: 4, name: '税务管理部广州分部', pid: '3' }

]

// const newData = [
//   { id: 1, name: '总裁办', pid: '' },
//   { id: 2, name: '财务部', pid: '', children: [{ id: 3, name: '税务管理部', pid: '2' }] }
// ]

const res = listToTreeData(oldData, '')
console.log(res)

function listToTreeData(list, pid) {
  // 这里应该递归查找, 对于每个节点, 都用该节点的 id 作为下一次的 pid
  // 查找 children 一直找到没有为止
  // 可以拆分成两部分来思考,
  // 1. 如果在一个列表中查找属于同一个 pid 的子部门
  // 创建一个数组存放结果
  const res = []
  // 遍历串串的 list, 如果pid等于需要的值,就放入 res 当中,最终返回
  list.forEach(item => {
    if (item.pid === pid) {
      res.push(item)
    }
  })
  return res
  // 2. 如何递归
}
