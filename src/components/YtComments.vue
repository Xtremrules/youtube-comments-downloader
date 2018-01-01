<template>
  <div class="mt-4">
    <template v-if="loading">
      <div class="text-xs-center">
        {{ commentsCount }} / {{ video.statistics.commentCount }}
      </div>
      <v-progress-linear v-model="progress" color="red"></v-progress-linear>
    </template>

    <template v-if="commentsCount && !loading">
      <v-divider></v-divider>
      <v-card flat>
        <ul class="comments pa-4">
          <Comment
            :comment="comment"
            v-for="comment in comments"
            v-bind:key="comment.id"
          ></Comment>
        </ul>
      </v-card>
    </template>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import Comment from '@/components/YtComment'

  export default {
    components: {
      Comment
    },
    computed: {
      progress () {
        if (this.video) {
          return this.commentsCount / this.video.statistics.commentCount * 100
        }
        return 0
      },
      comments () {
        return this.$store.getters.comments
      },
      ...mapState([
        'video',
        'commentsCount',
        'loading',
        'visibleCounter'
      ])
    },
    methods: {
      debounce (func, wait, immediate) {
        let timeout
        return function () {
          const context = this
          const args = arguments
          const later = function () {
            timeout = null
            if (!immediate) func.apply(context, args)
          }
          const callNow = immediate && !timeout
          clearTimeout(timeout)
          timeout = setTimeout(later, wait)
          if (callNow) func.apply(context, args)
        }
      },
      infiniteScroll (event) {
        if (this.commentsCount > this.visibleCounter) {
          if ((document.body.offsetHeight - 3 * window.innerHeight) < window.pageYOffset) {
            this.debounce(this.$store.commit('incrementVisibleCounter'), 200)
          }
        }
      }
    },
    created () {
      window.addEventListener('scroll', this.infiniteScroll)
    },
    destroyed () {
      window.removeEventListener('scroll', this.infiniteScroll)
    }
  }
</script>

<style scoped>
  .comments {
    list-style: none;
    padding: 0;
    margin: 0;
  }
</style>

