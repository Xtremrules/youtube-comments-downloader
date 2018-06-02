'use strict';

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _values = require('babel-runtime/core-js/object/values');

var _values2 = _interopRequireDefault(_values);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

let getCommentThreads = (() => {
  var _ref = (0, _asyncToGenerator3.default)(function* (videoId, pageToken) {
    const params = {
      videoId: videoId,
      part: 'snippet,replies',
      maxResults: 100
    };

    if (pageToken) {
      params.pageToken = pageToken;
    }

    yield youtube.commentThreads.list(params).then(function (response) {
      const promises = [];

      if (response.data.nextPageToken) {
        promises.push(getCommentThreads(videoId, response.data.nextPageToken));
      }

      response.data.items.forEach(function (comment) {
        const commentId = comment.snippet.topLevelComment.id;

        promises.push(saveComment(videoId, comment));

        if (comment.snippet.totalReplyCount > 0) {
          promises.push(getComments(videoId, commentId));
        }
      });

      return _promise2.default.all(promises);
    });
  });

  return function getCommentThreads(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

let getComments = (() => {
  var _ref2 = (0, _asyncToGenerator3.default)(function* (videoId, commentId, pageToken) {
    const params = {
      parentId: commentId,
      part: 'snippet',
      maxResults: 100
    };

    if (pageToken) {
      params.pageToken = pageToken;
    }

    yield youtube.comments.list(params).then(function (response) {
      const promises = [];

      if (response.data.nextPageToken) {
        promises.push(getComments(commentId, response.data.nextPageToken));
      }

      response.data.items.forEach(function (reply) {
        const replyId = reply.id.replace(commentId + '.', '');
        promises.push(saveReply(videoId, commentId, reply));
      });

      return _promise2.default.all(promises);
    });
  });

  return function getComments(_x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  };
})();

let saveComment = (() => {
  var _ref3 = (0, _asyncToGenerator3.default)(function* (videoId, comment) {
    const commentId = comment.snippet.topLevelComment.id;
    const topLevelComment = comment.snippet.topLevelComment.snippet;

    yield admin.database().ref(`/video/${videoId}/comments/${commentId}`).set({
      name: topLevelComment.authorDisplayName,
      avatar: topLevelComment.authorProfileImageUrl,
      channel: topLevelComment.authorChannelUrl,
      date: topLevelComment.publishedAt,
      likes: topLevelComment.likeCount,
      text: topLevelComment.textDisplay,
      searchText: removeAccents(striptags(topLevelComment.textDisplay)),
      totalReplyCount: comment.snippet.totalReplyCount
    });
  });

  return function saveComment(_x6, _x7) {
    return _ref3.apply(this, arguments);
  };
})();

let saveReply = (() => {
  var _ref4 = (0, _asyncToGenerator3.default)(function* (videoId, commentId, reply) {
    const replyId = reply.id.replace(commentId + '.', '');
    reply = reply.snippet;

    yield admin.database().ref(`/video/${videoId}/comments/${commentId}/replies/${replyId}`).set({
      parent: reply.parentId,
      name: reply.authorDisplayName,
      avatar: reply.authorProfileImageUrl,
      channel: reply.authorChannelUrl,
      date: reply.publishedAt,
      likes: reply.likeCount,
      text: reply.textDisplay,
      searchText: removeAccents(striptags(reply.textDisplay))
    });
  });

  return function saveReply(_x8, _x9, _x10) {
    return _ref4.apply(this, arguments);
  };
})();

let getVideo = (() => {
  var _ref5 = (0, _asyncToGenerator3.default)(function* (videoId) {
    const response = yield youtube.videos.list({
      id: videoId,
      part: 'snippet,statistics'
    });

    const details = (0, _extends3.default)({}, response.data.items[0].snippet, response.data.items[0].statistics);

    yield admin.database().ref(`/video/${videoId}/details`).update(details);

    return details;
  });

  return function getVideo(_x11) {
    return _ref5.apply(this, arguments);
  };
})();

let getCurrentCommentsCount = (() => {
  var _ref6 = (0, _asyncToGenerator3.default)(function* (videoId) {
    const comments = yield admin.database().ref(`/video/${videoId}/comments`).once('value').then(function (comments) {
      return comments.val() || false;
    });

    if (comments) {
      yield admin.database().ref(`/video/${videoId}/details`).update({
        currentCommentsCount: (0, _values2.default)(comments).reduce(function (count, item) {
          return item.replies ? count += (0, _keys2.default)(item.replies).length + 1 : count += 1;
        }, 0)
      });
    }
  });

  return function getCurrentCommentsCount(_x12) {
    return _ref6.apply(this, arguments);
  };
})();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { google } = require('googleapis');
const striptags = require('striptags');
const removeAccents = require('remove-accents');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: true }));

const youtube = google.youtube({
  version: 'v3',
  auth: functions.config().youtube.key
});

admin.initializeApp();

app.get('/:id', (() => {
  var _ref7 = (0, _asyncToGenerator3.default)(function* (req, res) {
    res.send((yield getVideo(req.params.id)));
  });

  return function (_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
})());

exports.getVideo = functions.https.onRequest(app);

exports.checkIfIsCurrent = functions.database.ref('/video/{videoId}/details/commentCount').onWrite((() => {
  var _ref8 = (0, _asyncToGenerator3.default)(function* (change, context) {
    const videoId = context.params.videoId;
    const commentCount = change.after.val() || false;

    if (commentCount) {
      const currentCommentsCount = yield admin.database().ref(`/video/${videoId}/details/currentCommentsCount`).once('value').then(function (response) {
        return response.val() || 0;
      });

      yield admin.database().ref(`/video/${videoId}/details`).update({
        isCurrent: parseInt(commentCount) <= parseInt(currentCommentsCount)
      });
    }
  });

  return function (_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
})());

exports.getComments = functions.database.ref('/video/{videoId}/details/isCurrent').onWrite((() => {
  var _ref9 = (0, _asyncToGenerator3.default)(function* (change, context) {
    const videoId = context.params.videoId;
    const isCurrent = change.after.val();

    if (isCurrent === false) {
      yield admin.database().ref(`/video/${videoId}/comments`).remove();
      yield getCommentThreads(videoId);
      yield getCurrentCommentsCount(videoId);
      yield admin.database().ref(`/video/${videoId}/details`).update({ isCurrent: true });
    }
  });

  return function (_x17, _x18) {
    return _ref9.apply(this, arguments);
  };
})());