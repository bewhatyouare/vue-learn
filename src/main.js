import Vue from 'vue'
import App from './App'
import router from './router'
import 'common/stylus/index.styl'
import Vuex from 'vuex'
import {updToLocal} from 'common/js/store'
// import {insertArray, deleteFromArray} from 'common/js/util'

Vue.config.productionTip = false
Vue.use(Vuex)
const fsize = (window.screen.width || window.screen.availWidth) / 10
document.documentElement.style.fontSize = fsize + 'px'

function getUlHeight(list) {
  const liHeight = (2.4 + 0.25) * fsize
  let len = list.length
  let h = liHeight
  if (len > 4) {
    h = liHeight * Math.ceil(len / 4)
  }
  console.info(h, len, liHeight)
  return h
}

const store = new Vuex.Store({
  state: {
    myDataList: [],
    dragHeight: 0
  },
  mutations: {
    initMyDataList(state, list) {
      state.myDataList = list
      state.dragHeight = getUlHeight(list)
    },
    sortDataList(state, evt) {
      let oldIndex = evt.oldIndex
      let newIndex = evt.newIndex
      if (oldIndex === newIndex) {
        return
      }
      let list = state.myDataList.slice()
      // 获取拖动的元素
      let item = list[oldIndex]
      // 并将其从数组中删除
      list.splice(oldIndex, 1)
      // 将拖动的元素插入到新的位置
      list.splice(newIndex, 0, item)
      updToLocal(list)
      state.myDataList = list
    },
    addOrRemoveItem(state, item) {
      let list = state.myDataList
      let eidx = list.findIndex((item) => {
        return item.id === '999999'
      })
      // 删除
      if (item.flag === 'icon-offline_fill') {
        item.flag = 'icon-addition_fill'
        let idx = list.findIndex((info) => {
          return item.id === info.id
        })
        list.splice(idx, 1)
        if (eidx === -1 && list.length < 11) {
          list.push({'id': '999999', 'name': '', 'fixed': true})
        }
      } else if (item.flag === 'icon-addition_fill') {
        // 添加
        item.flag = 'icon-offline_fill'
        list.unshift(item)
        if (list.length === 12) {
          list.splice(-1, 1)
        }
      }
      // 更新到localstorage
      updToLocal(list)
      state.myDataList = list
      state.dragHeight = getUlHeight(list)
    }
  },
  getters: {
    myDataList: state => {
      return state.myDataList
    },
    dragHeight: state => {
      return state.dragHeight
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
