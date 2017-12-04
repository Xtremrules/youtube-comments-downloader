<template>
  <main id="app">
    <ytForm></ytForm>
    <YtLoader></YtLoader>
    <YtComments></YtComments>
  </main>
</template>

<script>
  import YtForm from '@/components/YtForm'
  import YtLoader from '@/components/YtLoader'
  import YtComments from '@/components/YtComments'

  export default {
    components: {
      YtForm,
      YtLoader,
      YtComments
    },
    computed: {
      sortedComments: function () {
        return this.comments.sort((a, b) => {
          return b.likes - a.likes
        })
      }
    }
  }
</script>

<style>
  body {
    min-width: 320px;
  }

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
    box-sizing: border-box;
  }

  #app > * {
    width: 100%;
  }

  /* YT styles override */

  #watch-discussion {
    display: block !important;
  }

  .comment-renderer-text-content {
    max-height: none !important;
  }
</style>
