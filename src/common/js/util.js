export function insertArray(arr, val, compare, maxlen) {
  const index = arr.findIndex(compare)
  // 如果新增的元素在原来列表的第一个，则不做处理
  if (index === 0) {
    return
  }
  // 如果新增的元素在原来列表里，并且不是第一个，则删除
  if (index > 0) {
    arr.splice(index, 1)
  }
  // 添加到第一个
  arr.unshift(val)
  if (maxlen && arr.length > maxlen) {
    arr.pop()
  }
}

export function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}
