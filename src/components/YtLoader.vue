<template>
  <div v-if="loading" class="branded-page-box yt-card loading-box">
    <span class="yt-spinner-img yt-sprite"></span>
    Loading... {{ commentsCount }} comments fetched
  </div>

  <!-- <paper-spinner-lite class="style-scope ytd-comments" aria-hidden="true">
    <div id="spinnerContainer" class="  style-scope paper-spinner-lite">
      <div class="spinner-layer style-scope paper-spinner-lite">
        <div class="circle-clipper left style-scope paper-spinner-lite"></div>
        <div class="circle-clipper right style-scope paper-spinner-lite"></div>
      </div>
    </div>
  </paper-spinner-lite> -->
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
