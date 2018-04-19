import Vue from 'vue'
import GridMenu from '@/components/grid-menu/grid-menu'

function getVm (Component, propsData) {
  const Constructor = Vue.extend(Component)
  var vm = new Constructor({ propsData: propsData }).$mount()
  return vm
}

describe('grid-menu.vue', () => {  
  it('has a mounted hook', () => {
    expect(typeof GridMenu.mounted).toBe('function')
  })
  
  var dataList = [{"id": 11,"name": "11"}, {"id": 22,"name": "22"}]
  const vm = getVm(GridMenu, {
        datalist: dataList
      })
  var gridLiDom = vm.$el.querySelectorAll('.grid-ul li')
  var liDom = vm.$el.querySelector('.grid-ul li').innerHTML
  it('renders correctly with init props', () => {
    expect(gridLiDom.length).toBe(dataList.length)
    expect(liDom).toContain('<p class="text">' + dataList[0].name + '</p>')
  })
})