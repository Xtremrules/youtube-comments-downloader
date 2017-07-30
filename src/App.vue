<template>
  <main id="app">
    <form v-on:submit.prevent="onSubmit" class="form branded-page-box yt-card">
      <h1 class="form__heading">Youtube comments downloader</h1>
      <div class="form__hint">
        This app need a browser API key to get data from YouTube Data API.
      </div>
      <a href="https://developers.google.com/youtube/registering_an_application" target="_blank">
          Click to read how to create a API key for browser app
      </a>
      <br>
      <div class="form__field">
        <label class="form__label" for="api-key">
          API Key
        </label>
        <input class="form__input" type="text" id="api-key" v-model="apiKey" required>
      </div>

      <div class="form__field">
        <label class="form__label" for="video-id">
          Youtube video ID
        </label>
        <input class="form__input" type="text" id="video-id" v-model="videoId" required>
      </div>

      <button :disabled="loading" class="form__button yt-uix-button yt-uix-button-size-default yt-uix-button-subscribe-branded yt-uix-button-has-icon no-icon-markup yt-uix-subscription-button yt-can-buffer yt-uix-servicelink" type="submit">
        Give me the comments!
      </button>
    </form>

    <div v-if="commentsCount" class="branded-page-box yt-card loading-box">
      <span v-show="loading" class="yt-spinner-img yt-sprite"></span>
      <h1 v-if="loading">
        Loading... {{ commentsCount }} comments fetched.
      </h1>
      <h1 v-else>
        {{ commentsCount }} comments loaded in {{ getDuration }} seconds
      </h1>
    </div>

    <div v-if="commentsCount && !loading" id="watch-discussion" class="branded-page-box yt-card scrolldetect">
      <div id="comment-section-renderer" class="comment-section-renderer">
        <div class="comments-header-renderer">
          <h2 class="comment-section-header-renderer">
            <b>Comments</b> • {{ commentsCount }}
          </h2>
        </div>

        <section v-for="(comment, index) in comments" v-bind:key="index" v-bind:comment="comment" class="comment-thread-renderer">
          <div class="comment-renderer">
            <a v-bind:href="comment.channel" class="g-hovercard yt-uix-sessionlink spf-link">
              <span class="video-thumb comment-author-thumbnail yt-thumb yt-thumb-48">
                <span class="yt-thumb-square">
                  <span class="yt-thumb-clip">
                    <img v-bind:src="comment.avatar" width="48" height="48">
                    <span class="vertical-align"></span>
                  </span>
                </span>
              </span>
            </a>
            <div class="comment-renderer-content">
              <div class="comment-renderer-header">
                <a v-bind:href="comment.channel" class="comment-author-text g-hovercard yt-uix-sessionlink spf-link">
                  {{ comment.name }}
                </a>
                <span class="comment-renderer-time">
                  <a href="#" class="yt-uix-sessionlink spf-link">
                    <timeago :since="comment.date"></timeago>
                  </a>
                </span>
              </div>
              <div class="comment-renderer-text">
                <div v-html="comment.text" class="comment-renderer-text-content"></div>
              </div>
              <div class="comment-renderer-footer">
                <div class="comment-action-buttons-toolbar">
                  <button class="yt-uix-button yt-uix-button-size-small yt-uix-button-link comment-renderer-reply comment-simplebox-trigger"
                          type="button">
                    <span class="yt-uix-button-content">
                      Reply
                    </span>
                  </button>
                  <span v-if="comment.likes > 0" class="comment-renderer-like-count off">
                    {{ comment.likes }}
                  </span>
                  <span role="radiogroup">
                    <button class="yt-uix-button yt-uix-button-size-default yt-uix-button-default yt-uix-button-empty yt-uix-button-has-icon no-icon-markup comment-action-buttons-renderer-thumb yt-uix-sessionlink sprite-comment-actions sprite-like i-a-v-sprite-like"
                            type="button"
                    ></button>
                    <button class="yt-uix-button yt-uix-button-size-default yt-uix-button-default yt-uix-button-empty yt-uix-button-has-icon no-icon-markup comment-action-buttons-renderer-thumb yt-uix-sessionlink sprite-comment-actions sprite-dislike i-a-v-sprite-dislike"
                            type="button"
                    ></button>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="comment.replies" class="comment-replies-renderer">
            <div v-for="(reply, index) in comment.replies" v-bind:key="index" v-bind:reply="reply" class="comment-renderer">
              <a v-bind:href="reply.channel" class="g-hovercard yt-uix-sessionlink spf-link">
                <span class="video-thumb comment-author-thumbnail yt-thumb yt-thumb-48">
                  <span class="yt-thumb-square">
                    <span class="yt-thumb-clip">
                      <img v-bind:src="reply.avatar" width="48" height="48">
                      <span class="vertical-align"></span>
                    </span>
                  </span>
                </span>
              </a>
              <div class="comment-renderer-content">
                <div class="comment-renderer-header">
                  <a v-bind:href="reply.channel" class="comment-author-text g-hovercard yt-uix-sessionlink spf-link">
                    {{ reply.name }}
                  </a>
                  <span class="comment-renderer-time">
                    <a href="#" class="yt-uix-sessionlink spf-link">
                      <timeago :since="reply.date"></timeago>
                    </a>
                  </span>
                </div>
                <div class="comment-renderer-text">
                  <div v-html="reply.text" class="comment-renderer-text-content"></div>
                </div>
                <div class="comment-renderer-footer">
                  <div class="comment-action-buttons-toolbar">
                    <button class="yt-uix-button yt-uix-button-size-small yt-uix-button-link comment-renderer-reply comment-simplebox-trigger"
                            type="button"
                    >
                      <span class="yt-uix-button-content">
                        Reply
                      </span>
                    </button>
                    <span v-if="reply.likes > 0" class="comment-renderer-like-count off">
                      {{ reply.likes }}
                    </span>
                    <span role="radiogroup">
                      <button class="yt-uix-button yt-uix-button-size-default yt-uix-button-default yt-uix-button-empty yt-uix-button-has-icon no-icon-markup comment-action-buttons-renderer-thumb yt-uix-sessionlink sprite-comment-actions sprite-like i-a-v-sprite-like"
                              type="button"
                      ></button>
                      <button class="yt-uix-button yt-uix-button-size-default yt-uix-button-default yt-uix-button-empty yt-uix-button-has-icon no-icon-markup comment-action-buttons-renderer-thumb yt-uix-sessionlink sprite-comment-actions sprite-dislike i-a-v-sprite-dislike"
                              type="button"
                      ></button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<script>
  export default {
    data () {
      return {
        apiKey: window.localStorage.apiKey,
        videoId: window.localStorage.videoId,
        loading: false,
        time: {
          start: '',
          end: ''
        },
        comments: [],
        commentsCount: 0
      }
    },
    computed: {
      getDuration: function () {
        return (this.time.end - this.time.start) / 1000
      }
    },
    methods: {
      saveConfig: function () {
        window.localStorage.apiKey = this.apiKey
        window.localStorage.videoId = this.videoId
      },
      onSubmit: function () {
        this.loading = true
        this.time.start = Date.now()
        this.saveConfig()
        this.getComments()
      },
      getComments: function (pageToken) {
        const url = new URL('https://www.googleapis.com/youtube/v3/commentThreads')
        const params = {
          key: this.apiKey,
          videoId: this.videoId,
          part: 'snippet,replies',
          maxResults: 100
        }

        if (pageToken) {
          params.pageToken = pageToken
        }

        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

        fetch(url)
          .then(response => response.json())
          .then(response => {
            response.items.forEach(comment => {
              this.commentsCount++

              const object = {
                name: comment.snippet.topLevelComment.snippet.authorDisplayName,
                avatar: comment.snippet.topLevelComment.snippet.authorProfileImageUrl,
                channel: comment.snippet.topLevelComment.snippet.authorChannelUrl,
                date: comment.snippet.topLevelComment.snippet.publishedAt,
                likes: comment.snippet.topLevelComment.snippet.likeCount,
                text: comment.snippet.topLevelComment.snippet.textDisplay
              }

              if (comment.replies) {
                object.replies = []

                comment.replies.comments.forEach(reply => {
                  this.commentsCount++

                  object.replies.push({
                    name: reply.snippet.authorDisplayName,
                    avatar: reply.snippet.authorProfileImageUrl,
                    channel: reply.snippet.authorChannelUrl,
                    date: reply.snippet.publishedAt,
                    likes: reply.snippet.likeCount,
                    text: reply.snippet.textDisplay
                  })
                })
              }

              this.comments.push(object)
            })

            if (response.nextPageToken) {
              this.getComments(response.nextPageToken)
            } else {
              this.loading = false
              this.time.end = Date.now()
              this.comments = this.comments.sort((a, b) => {
                return b.likes - a.likes
              })
            }
          })
      }
    }
  }
</script>

<style>
  #app {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 90%;
    max-width: 800px;
    min-height: 100vh;
    margin: auto;
    padding: 30px 0;
  }

  #app > * {
    width: 100%;
  }

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

  .form__hint {
    margin-bottom: 5px;
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
    margin-top: 20px;
    padding: 20px 40px !important;
    height: auto !important;
    font-size: 14px;
  }

  .loading-box {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
  }
</style>
