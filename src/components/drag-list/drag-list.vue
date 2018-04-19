<template>
  <div class="grid-wrap" ref="dragDiv" :style="calculateHeight">
    <draggable v-model="list"
       :options="dragOptions"
        @start="onStart"
        :move="onMove"
        @end="onEnd">
      <transition-group class="grid-ul" tag="ul">
        <li :key="getKey(item.id)" class="grid-empty-li"
         :class="{'grid-li':item.id!=999999}"
          v-for="item in list">
          <div v-if="item.id!=999999">
            <div class="icon-box">
              <i class="iconfont" :class="item.picUrl"></i>
            </div>
            <i class="iconfont flg" :class="item.flag"
              @click="clickFlg(item)">
            </i>
            <p class="text">{{item.name}}</p>
          </div>
        </li>
      </transition-group>
    </draggable>
  </div>
</template>

<script type="text/ecmascript-6">
import draggable from 'vuedraggable'
import {mapMutations, mapGetters} from 'vuex'
import {gridListMixin} from 'common/js/mixin'

export default {
  mixins: [gridListMixin],
  props: {
    datalist: {
      type: Array
    }
  },
  data() {
    return {
      list: [],
      isDragging: false,
      delayedDragging: false
    }
  },
  methods: {
    onStart(evt) {
      this.isDragging = true
    },
    onMove(evt) {
      var item = evt.draggedContext.element
      return !item.fixed
    },
    onEnd(evt) {
      this.isDragging = false
      // 最后一个为空框，不允许拖到空框后面
      if (evt.newIndex > this.datalist.length - 1) {
        return false
      }
      this.sortDataList(evt)
    },
    ...mapMutations([
      'sortDataList'
    ])
  },
  computed: {
    dragOptions () {
      return {
        animation: 4,
        scroll: false,
        group: 'description',
        ghostClass: 'ghost'
      }
    },
    calculateHeight() {
      return {
        'height': this.dragHeight + 'px'
      }
    },
    ...mapGetters([
      'dragHeight'
    ])
  },
  created() {
    let fsize = parseFloat(document.documentElement.style.fontSize)
    this.liHeight = (2.4 + 0.25) * fsize
  },
  watch: {
    isDragging (newValue) {
      if (newValue) {
        this.delayedDragging = true
        return
      }
      this.$nextTick(() => {
        this.delayedDragging = false
      })
    },
    datalist(newList, oldList) {
      this.list = this.datalist.map((item, index) => {
        return item
      })
    }
  },
  mounted() {
  },
  components: {
    draggable
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .grid-wrap
    width: 100%
    padding: 0 0.2rem
    background: #fff
    font-size: 12px
    box-sizing: border-box
    .ghost
      opacity: .5
      background: #C8EBFB
    .grid-ul
      display: flex
      flex-wrap: wrap
      width:9.6rem
      .grid-empty-li
        width: 2.21rem
        height: 2.4rem
        border: 2px #ccc dashed
        list-style: none
        box-sizing: border-box
      .grid-li
        position: relative
        border: 0
        padding: 5px
        margin-right: 0.25rem
        background-color: #f3f2f2
        margin-bottom: .25rem
        .icon-box
          width: 100%
          height: 80%
          text-align: center
          padding-top: 5px
        .flg
          position: absolute
          right: 3px
          top: 3px
          width: 16px
          height: 16px
          font-size: 18px
        .text
          text-align: center
          color: #666
          margin-top: 0.3rem
      li:nth-child(4n)
        margin-right: 0
</style>
