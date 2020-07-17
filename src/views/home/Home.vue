<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control :titles="['流行', '新款', '精选']              "@tabClick="tabClick" ref="topTabControl"
      class="tab-control" v-show="isTabFixed"></tab-control>
    <scroll class="content" ref="scroll" :probe-type="3" :pull-up-load="true"
    @scroll="scrollControl" @pullingUp="loadmore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad">
      </home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control :titles="['流行', '新款', '精选']              "@tabClick="tabClick" ref="tabControl"></tab-control>
      <goods-list :goods="showGoods"></goods-list>
    </scroll>

    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>
<script>

import HomeSwiper from './childComponents/HomeSwiper'
import RecommendView from './childComponents/RecommendView'
import FeatureView from './childComponents/FeatureView'

import NavBar from 'components/common/navbar/NavBar'
import Scroll from 'components/common/scroll/Scroll'
import TabControl from 'components/content/tabControl/TabControl'
import GoodsList from 'components/content/goods/GoodsList'


import { getHomeMultidata, getHomeGoods } from 'network/home'
import { debounce } from 'common/utils'
import { backTopMixin } from 'common/mixin'

export default {
  name: 'Home',
  components: {
    NavBar,
    HomeSwiper,
    RecommendView,
    FeatureView,
    TabControl,
    GoodsList,
    Scroll
  },
  data () {
    return {
      banners: [],
      recommends: [],
      goods: {
        'pop': { page: 0, list: [] },
        'new': { page: 0, list: [] },
        'sell': { page: 0, list: [] },
      },
      currentType: 'pop',
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0
    }
  },
  mixins: [ backTopMixin ],
  computed: {
    showGoods () {
      return this.goods[this.currentType].list
    }
  },
  created () {
    this.getHomeMultidata()
    // 请求商品数据
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')

  },
  mounted () {
    const refresh = debounce(this.$refs.scroll.refresh, 50)
    // 监听item中图片加载完成
    this.$bus.$on('itemImgLoad', () => {
      refresh()
    })
  },
  activated () {
    this.$refs.scroll.refresh()
    this.$refs.scroll.scrollTo(0, this.saveY, 0)
  },
  deactivated () {
    this.saveY = this.$refs.scroll.scroll.y
  },
  methods: {
    swiperImageLoad () {
      this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop
    },
    tabClick (index) {
      switch (index) {
        case 0:
          this.currentType = 'pop';
          break
        case 1:
          this.currentType = 'new';
          break
        case 2:
          this.currentType = 'sell'
          break
      }

      // 让两个tabControl的currentIndex保持一致
      this.$refs.topTabControl.currentIndex = index
      this.$refs.tabControl.currentIndex = index
    },
    scrollControl (position) {
      // backTop的显示与隐藏
      this.isShowBackTop = (-position.y) > 1000

      // tabControl 是否吸顶
      this.isTabFixed = (-position.y) > this.tabOffsetTop
    },
    loadmore () {
     this.getHomeGoods(this.currentType)
    },
    // 获取数据
    getHomeMultidata () {
      getHomeMultidata().then(res => {
        this.banners = res.data.banner.list
        this.recommends = res.data.recommend.list
      })
    },
    getHomeGoods (type) {
      const page = this.goods[type].page + 1
      getHomeGoods(type, page).then(res => {
        this.goods[type].list.push(...res.data.list)
        this.goods[type].page += 1
        this.$refs.scroll.finishPullup()
      })
    }
  }
}
</script>
<style scoped>
  .home-nav {
    background-color: var(--color-tint);
    color: #fff;
    /* position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9; */
  }
  #home {
    /* padding-top: 44px; */
    height: 100vh;
    position: relative;
  }
  .tab-control {
    position: relative;
    z-index: 9;
  }
  .content {
    position: absolute;
    left: 0;
    right: 0;
    top: 44px;
    bottom: 49px;
    overflow: hidden;
  }
</style>
