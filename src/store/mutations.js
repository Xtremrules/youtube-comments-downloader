export default {
  videoId (state, id) {
    state.videoId = id
  },
  video (state, video) {
    state.video = video
  },
  comment (state, comment) {
    state.commentsCount++

    state.comments.push({
      id: comment.snippet.topLevelComment.id,
      name: comment.snippet.topLevelComment.snippet.authorDisplayName,
      avatar: comment.snippet.topLevelComment.snippet.authorProfileImageUrl,
      channel: comment.snippet.topLevelComment.snippet.authorChannelUrl,
      date: comment.snippet.topLevelComment.snippet.publishedAt,
      likes: comment.snippet.topLevelComment.snippet.likeCount,
      text: comment.snippet.topLevelComment.snippet.textDisplay,
      totalReplyCount: comment.snippet.totalReplyCount,
      replies: []
    })
  },
  commentReply (state, payload) {
    state.commentsCount++

    const index = state.comments.findIndex(element => {
      return element.id === payload.commentId
    })

    state.comments[index].replies.push({
      id: payload.reply.id,
      name: payload.reply.snippet.authorDisplayName,
      avatar: payload.reply.snippet.authorProfileImageUrl,
      channel: payload.reply.snippet.authorChannelUrl,
      date: payload.reply.snippet.publishedAt,
      likes: payload.reply.snippet.likeCount,
      text: payload.reply.snippet.textDisplay
    })
  },
  sortComments (state) {
    state.comments = state.comments.sort((a, b) => {
      return b.likes - a.likes
    })
  }
}
