<template>
  <div>

  </div>
</template>

<script>
import axios from 'axios'
import * as firebase from 'firebase'

export default {
  data() {
    return {
      videoId: 'lqIDULLoZn4'
    }
  },
  methods: {
    get() {
      axios.get(`https://us-central1-comments-downloader.cloudfunctions.net/fetchComments/${this.videoId}`)
      firebase.database().ref(`/video/${videoId}/`).on()
    }
  },
  mounted() {
    get()
  }
}
</script>

<style>

</style>
