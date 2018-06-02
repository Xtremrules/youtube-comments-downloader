<template>
  <div class="mt-4">
    <template v-if="loading">
      <template v-if="video.commentCount > 10000">
        <h2>
          {{ video.commentCount }} comments is quite a lot...
        </h2>
        <p>
          Our team of highly trained monkeys are working hard processing this request.
        </p>
        <p>
          It will take about {{ Math.ceil(video.commentCount * 4 / 1000 / 60)  }} minutes
        </p>
      </template>

      <v-progress-linear
        :indeterminate="true"
        color="red"
      />
    </template>

    <template v-if="commentsCount && !loading">
      <v-divider></v-divider>
      <v-card
        class="mb-4 px-4 pt-2"
        raised
      >
        <v-text-field
          label="Search in comments"
          type="search"
          v-model="search"
          color="red"
          clearable
        />
        <p class="pb-4 grey--text">
          The search will return threads that contain given phrase
          <span
            class="grey--text text--lighten-1"
            style="float: right"
          >
            BETA FEATURE
          </span>
        </p>
      </v-card>
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
  import VTextField from 'vuetify/es5/components/VTextField'

  import YtComment from '@/components/YtComment'

  export default {
    components: {
      ...VCard,
      ...VGrid,
      VDivider,
      VProgressLinear,
      VTextField,
      YtComment
    },
    computed: {
      commentsCount () {
        return this.$store.state.comments && Object.keys(this.$store.state.comments).length
      },
      comments () {
        if (this.search) {
          return this.$store.getters.commentsWithText(this.search)
        }
        return this.$store.getters.comments
      },
      search: {
        get () {
          return this.$store.state.search
        },
        set (value) {
          this.$store.commit('search', value)
        }
      },
      ...mapState([
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

