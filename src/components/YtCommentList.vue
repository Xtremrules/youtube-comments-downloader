<template>
  <div class="mt-4">
    <template v-if="loading">
      <div class="text-xs-center">
        {{ commentsCount }} / {{ video.statistics.commentCount }}
      </div>

      <v-progress-linear
        v-model="progress"
        color="red"
      ></v-progress-linear>
    </template>

    <template v-if="commentsCount && !loading">
      <v-divider></v-divider>
      <v-card flat>
        <ul class="comment-list pa-4">
          <yt-comment
            :comment="comment"
            v-for="comment in comments"
            v-bind:key="comment.id"
          ></yt-comment>
        </ul>
      </v-card>
    </template>

  </div>
</template>

<script>
  import { mapState } from 'vuex'

  import * as VCard from 'vuetify/es5/components/VCard'
  import * as VGrid from 'vuetify/es5/components/VGrid'

  import VDivider from 'vuetify/es5/components/VDivider'
  import VProgressLinear from 'vuetify/es5/components/VProgressLinear'

  import YtComment from '@/components/YtComment'

  export default {
    components: {
      ...VCard,
      ...VGrid,
      VDivider,
      VProgressLinear,
      YtComment
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
  .comment-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
</style>

