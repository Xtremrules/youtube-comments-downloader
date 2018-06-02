<template>
  <v-form v-on:submit.prevent="onSubmit">
    <v-layout
      row
      wrap
    >
      <v-flex
        :class="{ 'md6': video }"
        d-flex
      >
        <v-card flat>
          <v-card-text>
            <v-text-field
              label="Youtube video URL or ID"
              type="text"
              id="video-id"
              v-model="input"
              @input="updateVideoId"
              color="red"
            ></v-text-field>

            <p class="grey--text">
              Copy and paste YouTube URL or video ID to fetch all comments.
            </p>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex
        v-if="video"
        md6
        d-flex
      >
        <v-card flat>
          <v-card-media
            :src="video.thumbnails.standard.url"
            height="150px"
          ></v-card-media>

          <v-card-title class="px-0 py-2">
            <h3 class="title mb-0">
              {{ video.title }}
            </h3>
          </v-card-title>

          <v-card-text class="pa-0">
            <div>
              {{ video.channelTitle }}
            </div>
            <div>
              {{ video.commentCount }} comments
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
              <span slot="loader">
                Loading...
              </span>
            </v-btn>
          </v-card-actions>

        </v-card>
      </v-flex>
    </v-layout>

    <div
      class="form__error"
      v-if="error"
    >
      <img src="https://media.giphy.com/media/13NRvWtOiMXawM/giphy.gif">

      <div
        v-for="(item, index) in error.errors"
        :key="index"
        :item="item"
      >
        <p>
          Domain:
          <strong>
            {{ item.domain }}
          </strong>
        </p>
        <p>
          Message:
          <strong v-html="item.message"></strong>
        </p>
        <p>
          Reason:
          <strong>
            {{ item.reason }}
          </strong>
        </p>
      </div>
    </div>
  </v-form>
</template>

<script>
  import { mapState } from 'vuex'

  import * as VGrid from 'vuetify/es5/components/VGrid'
  import * as VCard from 'vuetify/es5/components/VCard'

  import VBtn from 'vuetify/es5/components/VBtn'
  import VForm from 'vuetify/es5/components/VForm'
  import VProgressCircular from 'vuetify/es5/components/VProgressCircular'
  import VTextField from 'vuetify/es5/components/VTextField'

  export default {
    components: {
      ...VCard,
      ...VGrid,
      VBtn,
      VForm,
      VProgressCircular,
      VTextField
    },
    data () {
      return {
        input: '',
        urlString: window.location.href
      }
    },
    computed: mapState([
      'error',
      'loading',
      'video'
    ]),
    methods: {
      updateVideoId (event) {
        this.$store.dispatch('reset')

        const checkPattern = /(?:youtube(?:-nocookie)?\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)?([a-zA-Z0-9_-]{11})/
        const match = this.input.match(checkPattern)

        this.$store.commit(
          'videoId',
          match && match[1] ? match[1] : ''
        )

        if (match && match[1]) {
          window.history.pushState(
            {},
            '',
            `/?v=${match[1]}`
          )
        } else {
          window.history.pushState({}, '', '/')
        }

        this.$store.dispatch('getVideo')
      },
      onSubmit () {
        this.$store.dispatch('reset')
        this.$store.dispatch('getCommentThreads')
      }
    },
    mounted () {
      const url = new URL(this.urlString)

      if (url.searchParams.get('v')) {
        this.input = url.searchParams.get('v')
        this.updateVideoId()
      }
    }
  }
</script>
