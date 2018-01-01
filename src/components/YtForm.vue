<template>
  <v-form v-on:submit.prevent="onSubmit">
    <v-layout row wrap>
      <v-flex d-flex :class="{ 'md6': video }">
        <v-card flat>
          <v-card-text>
            <v-text-field
              label="Youtube video ID"
              type="text"
              id="video-id"
              v-model="id"
              @input="updateVideoId"
              color="red"
            ></v-text-field>
            <p class="grey--text">
              Copy and paste YouTube video ID from URL to fetch all comments.
            </p>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex v-if="video" md6 d-flex>
        <v-card flat>
          <v-card-media
            :src="video.snippet.thumbnails.standard.url"
            height="150px"
          ></v-card-media>
          <v-card-title class="px-0 py-2">
            <h3 class="title mb-0">
              {{ video.snippet.title }}
            </h3>
          </v-card-title>
          <v-card-text class="pa-0">
            <div>
              {{ video.snippet.channelTitle }}
            </div>
            <div>
              {{ video.statistics.commentCount }} comments
            </div>
          </v-card-text>
          <v-card-actions class="px-0">
            <v-btn
              type="submit"
              color="red white--text mx-0"
              block
              :loading="loading"
              :disabled="loading"
            >
              Fetch comments
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>

    <div v-if="error" class="form__error">
      <img src="https://media.giphy.com/media/13NRvWtOiMXawM/giphy.gif">
      <div v-for="(item, index) in error.errors" v-bind:key="index" v-bind:item="item">
        <p>Domain: <strong>{{ item.domain }}</strong></p>
        <p>Message: <strong v-html="item.message"></strong></p>
        <p>Reason: <strong>{{ item.reason }}</strong></p>
      </div>
    </div>
  </v-form>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    data () {
      return {
        id: this.videoId
      }
    },
    computed: mapState([
      'error',
      'loading',
      'video',
      'videoId'
    ]),
    methods: {
      updateVideoId (event) {
        this.$store.dispatch('reset')
        this.$store.commit('videoId', this.id)
        this.$store.dispatch('getVideo')
      },
      onSubmit () {
        this.$store.dispatch('reset')
        this.$store.dispatch('getCommentThreads')
      }
    }
  }
</script>
