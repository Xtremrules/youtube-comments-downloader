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
      ...mapState([
        'comments',
        'commentsCount',
        'loading',
        'video'
      ])
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

