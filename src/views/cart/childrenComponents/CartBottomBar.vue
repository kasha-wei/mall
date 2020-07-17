<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button
        :is-checked="isSelectAll"
        class="check-button"
        @click.native="checkClick"/>
      <span>全选</span>
    </div>
    <div class="price">
      {{totalPrice}}
    </div>
    <div class="calculate">
      去计算({{checkLength}})
    </div>
  </div>
</template>

<script>
import CheckButton from './CheckButton'
import { mapGetters } from 'vuex'
export default {
  name: 'CartBottomBar',
  components: {
    CheckButton
  },
  computed: {
    ...mapGetters(['cartList']),
    totalPrice () {
      return '￥' + this.cartList.filter(item => {
          return item.checked
      }).reduce((preValue, item) => {
        return preValue + item.price * item.count
      }, 0).toFixed(2)
    },
    checkLength () {
      return this.cartList.filter(item => item.checked).length
    },
    isSelectAll () {
      if (this.cartList.length === 0) {
        return false
      }
      return !this.cartList.find(item => !item.checked)
    }
  },
  methods: {
    checkClick () {
      if (this.isSelectAll) {
        this.cartList.forEach(item => item.checked = false)
      } else {
        this.cartList.forEach(item => item.checked = true)
      }
    }
  }
}
</script>

<style scoped>
  .bottom-bar {
    position: relative;
    display: flex;
    background-color: #eee;
    line-height: 40px;
    height: 40px;
    font-size: 16px;
  }
  .check-content {
    margin-left: 8px;
    display: flex;
    align-items: center;
    width: 60px;
  }
  .check-button {
    width: 20px;
    height: 22px;
    line-height: 18px;
    margin-right: 5px;
  }
  .price {
    margin-left: 20px;
    flex: 1;
  }
  .calculate {
    width: 90px;
    background-color: var(--color-tint);
    text-align: center;
  }
</style>