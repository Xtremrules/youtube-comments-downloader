<template>
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
</template>

<script>
  export default {
    props: ['comment']
  }
</script>
