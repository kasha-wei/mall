<template>
  <div class="cart">
    <nav-bar class="cart-nav">
      <div slot="center">购物车({{cartLength}})</div>
    </nav-bar>
    <cart-list></cart-list>
    <cart-bottom-bar></cart-bottom-bar>
  </div>
</template>
<script>
import NavBar from 'components/common/navbar/NavBar'
import CartList from './childrenComponents/CartList'
import CartBottomBar from './childrenComponents/CartBottomBar'
import { mapGetters } from 'vuex'
export default {
  name: 'Cart',
  components: {
    NavBar,
    CartList,
    CartBottomBar
  },
  computed: {
    ...mapGetters(['cartLength', 'cartList'])
  }
}
</script>
<style scoped>
  .cart {
    height: 100vh;
  }
  .cart-nav {
    background-color: var(--color-tint);
    color: #fff;
    font-weight: 600;
  }
</style>
