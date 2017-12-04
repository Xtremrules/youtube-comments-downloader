<template>
  <form v-on:submit.prevent="onSubmit" class="form branded-page-box yt-card">
    <h1 class="form__heading">
      Youtube comments downloader
    </h1>
    <div class="form__field">
      <label class="form__label" for="video-id">
        Youtube video ID
      </label>
      <input class="form__input"
              type="text"
              id="video-id"
              :value="videoId"
              @input="updateVideoId"
              required
      >
    </div>

    <button :disabled="loading"
            type="submit"
            class="
                form__button
                yt-uix-button
                yt-uix-button-size-default
                yt-uix-button-subscribe-branded
                yt-uix-button-has-icon
                no-icon-markup
                yt-uix-subscription-button
                yt-can-buffer
                yt-uix-servicelink
            "
    >
      Give me the comments!
    </button>

    <div v-if="error" class="form__error">
      <img src="https://media.giphy.com/media/13NRvWtOiMXawM/giphy.gif">
      <div v-for="(item, index) in error.errors" v-bind:key="index" v-bind:item="item">
        <p>Domain: <strong>{{ item.domain }}</strong></p>
        <p>Message: <strong v-html="item.message"></strong></p>
        <p>Reason: <strong>{{ item.reason }}</strong></p>
      </div>
    </div>
  </form>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    computed: mapState([
      'loading',
      'videoId',
      'error'
    ]),
    methods: {
      updateVideoId (event) {
        this.$store.commit('videoId', event.target.value)
      },
      onSubmit () {
        this.$store.dispatch('getComments')
      }
    }
  }
</script>

<style>
  .form {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 30px;
  }

  .form__heading {
    margin-bottom: 30px;
  }

  .form__field {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80%;
    margin: 10px 0;
  }

  .form__label {
    flex: 0 0 25%;
  }

  .form__input {
    flex: 1;
    padding: 10px;
  }

  .form__button {
    margin-top: 10px;
    padding: 20px 40px !important;
    height: auto !important;
    font-size: 14px !important;
  }

  .form__error {
    max-width: 80%;
    margin-top: 30px;
    padding: 10px 20px;
    background: rgba(255, 0, 0, 0.1);
    border: 1px solid red;
    font-size: 14px;
    line-height: 2;
  }
</style>
