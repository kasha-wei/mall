<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav">
    </detail-nav-bar>
    <scroll class="content" ref="scroll"
    @scroll="contentScroll" :probe-type="3">
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info
        :detail-info="detailInfo"
        @imageLoad="imageLoad">
      </detail-goods-info>
      <detail-params-info :param-info="itemParams" ref="params">
      </detail-params-info>
      <detail-comment-info :comment-info="commentInfo" ref="comment">
      </detail-comment-info>
      <goods-list :goods="recommends" ref="recommend">
      </goods-list>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
    <detail-bottom-bar @addCart="addToCart"></detail-bottom-bar>
    <toast :message="message" :show="show"/>
  </div>
</template>

<script>
import DetailNavBar from './childComponents/DetailNavBar'
import DetailSwiper from './childComponents/DetailSwiper'
import DetailBaseInfo from './childComponents/DetailBaseInfo'
import DetailShopInfo from './childComponents/DetailShopInfo'
import DetailGoodsInfo from './childComponents/DetailGoodsInfo'
import DetailParamsInfo from './childComponents/DetailParamsInfo'
import DetailCommentInfo from './childComponents/DetailCommentInfo'
import DetailBottomBar from './childComponents/DetailBottomBar'

import Scroll from 'components/common/scroll/Scroll'
import GoodsList from 'components/content/goods/GoodsList'
import Toast from 'components/common/toast/Toast'

import { getDetail, Goods, Shop, getRecommend } from 'network/detail'
import { debounce } from 'common/utils'
import { itemListenrMixin, backTopMixin } from 'common/mixin'
export default {
  name: 'Detail',
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamsInfo,
    DetailCommentInfo,
    DetailBottomBar,
    Scroll,
    GoodsList,
    Toast
  },
  mixins: [ itemListenrMixin, backTopMixin ],
  data () {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      itemParams: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      getThemeTopy: null,
      currentIndex: 0,
      message: '',
      show: false
    }
  },
  created () {
    // 1.保存传入的id
    this.iid = this.$route.params.iid

    // 2.根据id请求数据
    getDetail(this.iid).then(res => {
      const data = res.result
      this.topImages = data.itemInfo.topImages

      // 2.获取商品信息
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
      // 创建店铺信息的对象
      this.shop = new Shop(data.shopInfo)
      // 保存商品的详细数据
      this.detailInfo = data.detailInfo
      // 取出参数的信息
      this.itemParams = data.itemParams
      // 取出评论信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0]
      }
    })

    // 3.获取推荐数据
    getRecommend().then(res => {
      console.log(res)
      this.recommends = res.data.list
    })

    // 4.给getThemeTopy赋值
    this.getThemeTopy = debounce(() => {
      this.themeTopYs = []
      this.themeTopYs.push(0)
      this.themeTopYs.push(this.$refs.params.$el.offsetTop - 44)
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop - 44)
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop - 44)
      this.themeTopYs.push(Number.MAX_VALUE)
      console.log(this.themeTopYs)
    }, 100)
  },
  mounted () {
  },
  methods: {
    imageLoad () {
      this.newRefresh ()
      this.getThemeTopy ()
    },
    titleClick (index) {
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200)
    },
    contentScroll (position) {
      // console.log(position)
      // 1.获取Y值
      const positionY = -position.y
      let length = this.themeTopYs.length
      for (let i = 0;i < length - 1;i++) {
        if (this.currentIndex !== i && (positionY > this.themeTopYs[i] && positionY < this.themeTopYs[i+1])) {
          this.currentIndex = i
          this.$refs.nav.currentIndex = this.currentIndex
        }
      }
      // backTop的显示与隐藏
      this.isShowBackTop = (-position.y) > 1000
    },
    addToCart () {
      // 1.获取购物车需要展示的信息
      const product = {}
      product.image = this.topImages[0]
      product.title = this.goods.title
      product.desc = this.goods.desc
      product.price = this.goods.realPrice
      product.iid = this.iid

      // 2.将商品添加至购物车
      this.$store.dispatch('addCart', product).then(res => {
        this.message = res
        this.show = true
        setTimeout(() => {
          this.show = false
        }, 1500)
        // this.$toast.show(res, 1500)
      })
    }
  }
}
</script>
<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }
  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
  .content {
    height: calc(100% - 44px)
  }
</style>