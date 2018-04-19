const INIT_MENU_LEN = 11

/*
 * 存数据到localStorage
 * */
export function svaeToLocal(id, value) {
  let menus = window.localStorage.__menus__
  if (!menus) {
    menus = []
  } else {
    menus = JSON.parse(menus)
    if (menus.findIndex((item) => id === item.id) > -1) {
      return
    } else {
      menus.push(value)
    }
  }
  window.localStorage.__menus__ = JSON.stringify(menus)
}
// 更新localstroage
export function updToLocal(list) {
  window.localStorage.__menus__ = JSON.stringify(list)
}
/*
 * 从localStorage里取数
 * */
export function loadFromLocal(initList) {
  let menus = window.localStorage.__menus__
  if (!menus) {
    menus = randomList(initList, INIT_MENU_LEN)
    let newList = []
    menus.forEach((item) => {
      let newItem = Object.assign({'flag': 'icon-offline_fill', 'fixed': false}, item)
      newList.push(newItem)
    })
    // 我的应用添加一个空的格子
    newList.push({'id': '999999', 'name': '', 'fixed': true})
    window.localStorage.__menus__ = JSON.stringify(newList)
    return newList
  } else {
    menus = JSON.parse(menus)
  }
  return menus
}

/*
 * 随机取list内的数据
 * */
function randomList(list, len) {
  if (!list || list.lenght === 0) {
    return
  }
  let retList = []
  let subLen = 1
  list.forEach((item, index) => {
    let subList = item.childList
    if (len > 0) {
      subLen = randomNum(1, Math.min(len, subList.length))
      for (let i = 0; i < subLen; i++) {
        retList.push(subList[i])
      }
      len = len - subLen
    }
  })
  return retList
}

function randomNum(min, max) {
  var range = max - min
  var rand = Math.random()
  var num = min + Math.round(rand * range)
  return num
}
