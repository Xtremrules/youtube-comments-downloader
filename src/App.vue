<template>
  <v-app class="white">
    <v-content>
      <v-toolbar dark color="red">
        <v-toolbar-title class="white--text">
          Youtube comments downloader
        </v-toolbar-title>
      </v-toolbar>
      <v-container grid-list-xl>
        <v-layout>
          <v-flex xs12 md8 offset-md2>
            <Form></Form>
            <Comments></Comments>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  import Form from '@/components/YtForm'
  import Comments from '@/components/YtComments'

  export default {
    components: {
      Form,
      Comments
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
  html {
    text-rendering: auto !important;
    -webkit-font-smoothing: auto !important;
  }
</style>
