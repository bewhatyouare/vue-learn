<template>
  <div id="app">
    <div class="top-wrap" ref="topWrap" style="opacity: 1">
      <div class="my-title">
        <h1>我的应用</h1>
      </div>
      <div class="myapp-wrap" ref="topList" :style="getTopStyle">
        <drag-list @select="clickItem" ref="dragDom"
          :datalist="myDataList"></drag-list>
      </div>
    </div>
    <div class="second-wrap" ref="secondWrap"
      :style="getSecondStype">
      <div class="mid-wrap" ref="laterWrap"
         @touchstart.prevent="onTouchStart"
      @touchmove.prevent="onTouchMove"
      @touchend="onTouchEnd">
        <div class="my-title blue">
          <h1>最近使用</h1>
        </div>
        <div>
          <grid-menu
          :datalist="controlLen(latestData, 7)">
        </grid-menu>
        </div>
      </div>
      <div ref="thirdWrap">
        <div>
           <div class="all-title-wrap" ref="titleWrap">
            <ul class="all-ul" ref="titleUl">
              <li :key="item.name" ref="titleLi"
                :class="{active:index === currentIndex}"
                v-for="(item, index) in allData"
                @click="selectTitle(index)">
                {{item.name}}
              </li>
            </ul>
          </div>
          <div ref="allListScroll" class="bottom-wrap" :style="getAllListStyle">
            <ul ref="allListUl">
              <li :key="item.pid" v-for="item in allData" ref="listGroup">
                <grid-menu @select="clickItem"
                :datalist="dealCutOrAddFlg(item.childList, myDataList)">
                </grid-menu>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GridMenu from 'components/grid-menu/grid-menu'
import DragList from 'components/drag-list/drag-list'
import axios from 'axios'
import {loadFromLocal} from 'common/js/store.js'
import BScroll from 'better-scroll'
import {mapMutations, mapGetters} from 'vuex'

export default {
  data () {
    return {
      allData: [],
      latestData: [],
      listHeight: [],
      topHeight: 100,
      scrollY: 0
    }
  },
  created () {
    this.touch = {}
    this.topTitlePosFlg = 0
    this.laterHeight = 0
    this.startY = 0
    axios.get('/api/getData')
      .then((res) => {
        if (res.status === 200) {
          let list = loadFromLocal(res.data.list)
          this.initMyDataList(list)
          this.latestData = this.dealCutOrAddFlg(list, this.myDataList)
          this.allData = res.data.list
        }
      })
      .catch((error) => {
        console.log(error)
      })
  },
  methods: {
    clickItem(item) {
      if (item.flag === 'icon-addition_fill' && this.myDataList.length > 11) {
        alert('最多添加11个首页应用')
        return
      }
      this.allListScroll.refresh()
      this.addOrRemoveItem(item)
    },
    onTouchStart(e) {
      this.touch.initiated = true
      this.touch.startY = e.touches[0].pageY
      this.touch.lastTrasY = 0
    },
    onTouchMove(e) {
      if (!this.touch.initiated) {
        return
      }
      const deltaY = e.touches[0].pageY - this.touch.startY
      // 上拉
      if (deltaY < 0) {
        let y = Math.max(deltaY, -this.laterHeight)
        if (Math.abs(deltaY) > 80) {
          this.scrollSecondWrap(-this.laterHeight, 'top')
        } else {
          y = y + this.touch.lastTrasY
          this.scrollSecondWrap(y, 'top')
          this.touch.lastTransY = y
        }
      } else {
        // 下拉
        let y = Math.max(deltaY, 0)
        if (Math.abs(deltaY) > 80) {
          this.scrollSecondWrap(0, 'bottom')
        } else {
          y = y + this.touch.lastTrasY
          this.scrollSecondWrap(y, 'bottom')
          this.touch.lastTransY = y
        }
      }
    },
    onTouchEnd(e) {
      this.touch.initiated = false
    },
    // 给数据添加'add'、'cut'标记，
    // 用于显示图标右上方的小[+]或者小[—]
    dealCutOrAddFlg(list, cutList) {
      let retList = []
      if (!list) {
        return
      }
      list.forEach((item) => {
        let newItem = Object.assign({'flag': 'icon-addition_fill'}, item)
        cutList.forEach((subitem) => {
          if (subitem.id === item.id) {
            newItem.flag = 'icon-offline_fill'
          }
        })
        if (newItem.id !== '999999') {
          retList.push(newItem)
        }
      })
      return retList
    },
    // 控制数量
    controlLen(list, len) {
      if (!list) {
        return
      }
      let size = list.length
      if (size > len) {
        for (var i = size - len; i > 0; i--) {
          list.shift()
        }
      }
      return list
    },
    // 所有应用的滚动标题的click事件
    selectTitle(index) {
      this._followScroll(index)
      let y = this.laterHeight
      if (this.topTitlePosFlg === 0) {
        this.scrollSecondWrap(-y, 'top')
        this.topTitlePosFlg = 1
      }
    },
    // 【我的应用】以下部分滚动事件
    scrollSecondWrap(y, flg) {
      // if (this.topTitlePosFlg === 0 &&  )
      let el = this.$refs.thirdWrap
      el.style.webkitTransform = `translate3d(0,${y}px,0)`
      el.style.transform = `translate3d(0,${y}px,0)`
      let laterEl = this.$refs.laterWrap
      laterEl.style.webkitTransform = `translate3d(0,${y}px,0)`
      laterEl.style.transform = `translate3d(0,${y}px,0)`
    },
    _initScroll () {
      // 横向的标题滚动
      this.titleScroll = new BScroll(this.$refs.titleWrap, {
        scrollX: true,
        scrollY: false,
        click: true
      })
      // 底部所有应用数据的滚动
      this.allListScroll = new BScroll(this.$refs.allListScroll, {
        probeType: 3,
        click: true
      })
      this.allListScroll.on('scroll', (pos) => {
        // 判断滑动方向，上拉的情况
        if (pos.y <= 0) {
          this.scrollY = Math.abs(Math.round(pos.y))
          if (this.topTitlePosFlg === 0 && this.scrollY > this.listHeight[0]) {
            this.scrollSecondWrap(-this.laterHeight, 'top')
            this.topTitlePosFlg = 1
          }
        }
        // 下拉
        if (!this.initiateScroll) {
          this.startY = pos.y
          this.initiateScroll = true
        }
      })
      this.allListScroll.on('scrollEnd', (pos) => {
        if (pos.y === 0 && this.startY > 1.6) {
          if (this.topTitlePosFlg === 1) {
            this.scrollSecondWrap(0, 'bottom')
            this.topTitlePosFlg = 0
          }
        }
        this.initiateScroll = false
      })
    },
    _followScroll(index) {
      let alllist = this.$refs.listGroup
      let el = alllist[index]
      this.allListScroll.scrollToElement(el, 300)
    },
    _calculateHeight() {
      const list = this.$refs.listGroup
      if (!list) {
        setTimeout(this._calculateHeight, 20)
        return
      }
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },
    ...mapMutations([
      'initMyDataList',
      'addOrRemoveItem'
    ])
  },
  computed: {
    getTopStyle() {
      return {
        'height': this.dragHeight + 'px'
      }
    },
    getSecondStype() {
      return {
        'margin-top': (this.dragHeight + 40) + 'px'
      }
    },
    getAllListStyle() {
      let h = document.documentElement.clientHeight - this.dragHeight - 50
      return {
        'height': h + 'px'
      }
    },
    currentIndex() {
      const list = this.listHeight
      const titleLi = this.$refs.titleLi
      for (let i = 0; i < list.length; i++) {
        let height1 = this.listHeight[i]
        let height2 = this.listHeight[i + 1]
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          let el = titleLi[i]
          this.titleScroll.scrollToElement(el, 300, true)
          return i
        }
      }
      return 0
    },
    ...mapGetters([
      'myDataList',
      'dragHeight'
    ])
  },
  mounted() {
    setTimeout(() => {
      this.laterHeight = this.$refs.laterWrap.clientHeight
      this._initScroll()
      this._calculateHeight()
    }, 20)
  },
  components: {
    GridMenu,
    DragList
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
#app
  background: #fff
  width: 100%
  height: 100%
  overflow: hidden
  .my-title
    height: 40px
    padding-left: 15px
    position: relative
    background-color: #fff
    &.blue:after
      content: ''
      position: absolute
      left: 10px
      height: 20px
      top: 10px
      width: 5px
      background: #5697e6
    h1
      font-size: 14px
    &.blue h1
      margin-left: 10px
  h1
    font-size: 15px
    font-weight: 700
    line-height: 40px
    color: #000
  .top-wrap
    position: fixed
    left: 0
    right: 0
    top: 0
    z-index: 99
  .hr-split
    margin: 5px 0
  .second-wrap
    background-color: #fff
  .all-title-wrap
    color: #000
    font-size: 14px
    position: relative
    background-color: #fff
    height: 50px
    z-index: 99
    .all-ul
      width: 200%
      display: flex
      flex-direction: row
      flex-wrap: nowrap
      li
        white-space: nowrap
        height: 50px
        line-height: 50px
        padding: 0 8px
        position: relative
      .active:after
        position: absolute
        content: ''
        left: 0
        bottom: 5px
        height: 3px
        right: 0
        color: #5697e6
        font-weight: 700
        border-bottom: 3px solid #5697e6
</style>
