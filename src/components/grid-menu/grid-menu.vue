<template>
  <div class="grid-wrap" ref="gridUl">
    <ul class="grid-ul" >
      <li :key="getKey(item.id)" class="grid-empty-li"
       :class="{'grid-li':item.id!=999999}"
        v-for="item in datalist">
        <div v-if="item.id!=999999">
          <div class="icon-box">
            <i class="iconfont" :class="item.picUrl"></i>
          </div>
          <i class="iconfont flg" :class="item.flag" @click="clickFlg(item)">
          </i>
          <p class="text">{{item.name}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
import {gridListMixin} from 'common/js/mixin'
export default {
  mixins: [gridListMixin],
  props: {
    datalist: {
      type: Array
    }
  },
  methods: {
    // 可用于动态切换背景图片，暂时不用
    bgImage(url) {
      if (url) {
        return {
          'background-image': 'url(' + url + ')'
        }
      }
    }
  },
  mounted() {
    setTimeout(() => {
      this.$refs.gridUl.style.height = this.$refs.gridUl.offsetHeight
    }, 20)
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
          padding-top: 5px
          text-align: center
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
