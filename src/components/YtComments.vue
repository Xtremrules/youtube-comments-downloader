<template>
  <div class="ytd-item-section-renderer style-scope ytd-comments">
    <ul v-show="commentsCount && !loading" v-for="comment in comments" v-bind:key="comment.id">
      <li>{{ comment }}</li>
    </ul>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    computed: mapState([
      'comments',
      'commentsCount',
      'loading'
    ])
  }
</script>
