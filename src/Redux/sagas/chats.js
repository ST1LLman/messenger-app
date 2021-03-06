import {
  all, call, put, select, takeEvery,
} from 'redux-saga/effects';

import {
  createChat as createChatAPI,
  getChats as getChatsAPI,
  modifyChat as modifyChatAPI,
} from 'Common/messengerAPI';
import {
  addChats,
  getChats as getChatsAction,
  loadMessages as loadMessagesAction,
  setActiveChat,
} from 'Redux/actions';
import ActionNames from 'Constants/actionNames';
import { getFailureAction, getRequestAction, getSuccessAction } from 'Redux/shared';
import { activeChatIdSelector, tokenSelector } from 'Selectors/session';

function* createChat(action) {
  try {
    const token = yield select(tokenSelector);
    const { title, avatar, selectedUserIds } = action.payload;
    const chat = yield call(
      createChatAPI,
      token,
      title,
      avatar,
      selectedUserIds,
    );
    yield put(getSuccessAction(ActionNames.CREATE_CHAT)({ chat }));
    yield put(addChats(chat));
    yield put(getChatsAction());
    yield put(loadMessagesAction());
  } catch (error) {
    yield put(getFailureAction(ActionNames.CREATE_CHAT)({ error }));
  }
}

function* modifyChat(action) {
  try {
    const token = yield select(tokenSelector);
    const { chatId, options } = action.payload;
    const chat = yield call(modifyChatAPI, token, chatId, options);
    yield put(getSuccessAction(ActionNames.MODIFY_CHAT)({ chat }));
    yield put(addChats(chat));
    yield put(getChatsAction());
  } catch (error) {
    yield put(getFailureAction(ActionNames.MODIFY_CHAT)({ error }));
  }
}

function* initActiveChat(activeChat) {
  yield put(setActiveChat(activeChat));
  yield put(loadMessagesAction());
}

function* getChats() {
  try {
    const token = yield select(tokenSelector);
    const activeChat = yield select(activeChatIdSelector);
    const chats = yield call(getChatsAPI, token);
    yield put(getSuccessAction(ActionNames.GET_CHATS)({ chats }));
    yield put(addChats(chats));
    if (!activeChat && chats.length) {
      yield call(initActiveChat, chats[0]._id);
    }
  } catch (error) {
    yield put(getFailureAction(ActionNames.GET_CHATS)({ error }));
  }
}

function* changeActiveChat(action) {
  const { activeChat } = action.payload;
  yield call(initActiveChat, activeChat);
}

export default function* chatsSaga() {
  yield all([
    yield takeEvery(getRequestAction(ActionNames.CREATE_CHAT).type, createChat),
    yield takeEvery(getRequestAction(ActionNames.MODIFY_CHAT).type, modifyChat),
    yield takeEvery(getRequestAction(ActionNames.GET_CHATS).type, getChats),
    yield takeEvery(ActionNames.CHANGE_ACTIVE_CHAT, changeActiveChat),
  ]);
}

