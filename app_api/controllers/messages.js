const mongoose = require('mongoose');

const MessageModel = mongoose.model('Message');
const ChatModel = mongoose.model('Chat');
const { sendJsResponse, parseToken } = require('./common');

module.exports.getMessages = (req, res) => {
  if (!req.params || !req.params.chatId) {
    sendJsResponse(res, 400, { message: 'No chatId in request' });
    return;
  }

  const chat = mongoose.Types.ObjectId(req.params.chatId);

  const messageGetQuery = MessageModel.aggregate([
    {
      $match: {
        chat,
      },
    },
    {
      $project: {
        _id: 1,
        dateTime: 1,
        text: 1,
        author: 1,
        chat: 1,
      },
    },
    { $sort: { dateTime: 1 } },
  ]).exec();

  const usersGetQuery = MessageModel.aggregate([
    {
      $match: {
        chat,
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'author',
        foreignField: '_id',
        as: 'authors',
      },
    },
    { $unwind: '$authors' },
    {
      $group: {
        _id: '$authors._id',
        name: { $max: '$authors.name' },
        avatar: { $max: '$authors.avatar' },
      },
    },
  ]).exec();

  Promise.all([messageGetQuery, usersGetQuery])
    .then(([messages, users]) => {
      sendJsResponse(res, 200, { messages, users });
    })
    .catch((err) => {
      sendJsResponse(res, 400, err);
    });
};

module.exports.postMessage = (req, res) => {
  if (!req.params || !req.params.chatId) {
    sendJsResponse(res, 400, { message: 'No chatId in request' });
    return;
  }

  const author = parseToken(req.headers.authorization)._id;
  const { chatId } = req.params;

  ChatModel.findOne({ users: author, _id: chatId })
    .exec()
    .then((chat) => {
      if (!chat) {
        sendJsResponse(res, 404, { message: "'chatId' not found" });
        return undefined;
      }

      const { text } = req.body;

      return new MessageModel({
        chat: chatId,
        text,
        author,
      }).save();
    })
    .then((message) => {
      sendJsResponse(res, 200, {
        _id: message._id,
        text: message.text,
        author: message.author,
        dateTime: message.dateTime,
        chat: message.chat,
      });
    })
    .catch((err) => {
      sendJsResponse(res, 400, err);
    });
};
