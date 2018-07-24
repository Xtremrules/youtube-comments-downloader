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
    data () {
      return {
        comments: []
      }
    },
    computed: {
      commentsCount () {
        return Object.keys(this.$store.state.comments).length
      },
      progress () {
        if (this.video) {
          return this.commentsCount / this.video.statistics.commentCount * 100
        }
        return 0
      },
      fetchedComments () {
        if (this.search) {
          return this.$store.getters.commentsWithText(this.search)
        }
        return this.$store.getters.comments()
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
    },
    methods: {
      renderComments () {
        let comments = this.fetchedComments
        let count = comments.length

        while (count > 0) {
          const qty = count >= 100 ? 100 : count
          count -= qty
          this.comments.push(...comments.splice(0, qty))
        }
      }
    },
    watch: {
      loading (loading) {
        if (!loading) {
          this.renderComments()
        }
      },
      video () {
        this.comments = []
      }
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

