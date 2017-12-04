<template>
    <div v-if="loading" class="branded-page-box yt-card loading-box">
      <span class="yt-spinner-img yt-sprite"></span>
      Loading... {{ commentsCount }} comments fetched
    </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    computed: mapState([
      'loading'
    ])
  }
</script>

<style>
  .loading-box {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
  }
</style>
