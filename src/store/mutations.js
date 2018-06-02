export default {
  loading (state, loading) {
    state.loading = loading
  },
  reset (state) {
    state.comments = {}
  },
  search (state, value) {
    state.search = value
  },
  videoId (state, id) {
    state.videoId = id
  },
  video (state, video) {
    state.video = video
  },
  comments (state, comments) {
    state.comments = comments
  }
}
