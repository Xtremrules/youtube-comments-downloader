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
            <YtForm></YtForm>
            <YtComments></YtComments>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  import YtForm from '@/components/YtForm'
  import YtComments from '@/components/YtComments'

  export default {
    components: {
      YtForm,
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
  html {
    text-rendering: auto !important;
    -webkit-font-smoothing: auto !important;
  }
</style>
