<template>
  <div class="recommends">
    <div v-for="(item, i) in recommends" :key="i" class="recommend-item">
      <a :href="item.link">
        <img :src="item.image" alt="">
        <div>{{item.title}}</div>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecommendView',
  props: {
    recommends: {
      type: Array,
      default () {
        return[]
      }
    }
  }
}
</script>

<style>
  .recommends {
    width: 100%;
    display: flex;
    text-align: center;
    font-size: 14px;
    padding: 15px 0 20px;
    border-bottom: 5px solid #eee;
  }
  .recommend-item {
    flex: 1;
  }
  .recommend-item img {
    width: 90%;
  }
</style>