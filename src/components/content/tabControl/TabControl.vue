<template>
  <div class="tab-control">
    <div v-for="(item, index) in titles"
    :key="index" class="item-control" @click="itemClick(index)"
    :class="{active: index === currentIndex }">
      <span>{{item}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TabControl',
  props: {
    titles: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      currentIndex: 0
    }
  },
  methods: {
    itemClick (index) {
      this.currentIndex = index
      this.$emit('tabClick', index)
    }
  }
}
</script>

<style scoped>
  .tab-control {
    display: flex;
    text-align: center;
    background-color: #fff;
  }
  .item-control {
    flex: 1;
    height: 40px;
    line-height: 40px;
  }
  .item-control span {
    padding: 5px;
  }
  .active {
    color: var(--color-high-text);
  }
  .active span {
    border-bottom: 3px solid var(--color-tint);
  }
</style>