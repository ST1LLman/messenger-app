import {
  all, call, put, takeEvery,
} from 'redux-saga/effects';

import {
  login as loginAPI,
  register as registerAPI,
} from 'Common/messengerAPI';
import {
  getTokenFromStorage,
  getUserInfo,
  isLoggedIn,
  removeTokenFromStorage,
  saveTokenToStorage,
} from 'Common/authentication';
import {
  clearStore,
  setSessionInfo,
} from 'Redux/actions';
import ActionNames from 'Constants/actionNames';
import { getFailureAction, getRequestAction, getSuccessAction } from 'Redux/shared';

function* initAfterLogin(token) {
  if (!token) {
    return;
  }
  if (yield call(isLoggedIn, token)) {
    const user = yield call(getUserInfo, token);
    yield put(setSessionInfo({ token, isLoggedIn: true, user }));
    yield put(getRequestAction(ActionNames.GET_CHATS)());
  }
}

function* signIn(action) {
  try {
    const { email, password, remember } = action.payload;
    const result = yield call(loginAPI, email, password);
    yield put(getSuccessAction(ActionNames.LOGIN)({ result }));
    yield call(initAfterLogin, result.token);
    if (remember) {
      saveTokenToStorage(result.token);
    }
  } catch (error) {
    yield put(getFailureAction(ActionNames.LOGIN)({ error }));
  }
}

function* register(action) {
  try {
    const {
      email, password, name, avatar, remember,
    } = action.payload;
    const result = yield call(registerAPI, email, password, name, avatar);
    yield put(getSuccessAction(ActionNames.REGISTER)({ result }));
    yield call(initAfterLogin, result.token);
    if (remember) {
      saveTokenToStorage(result.token);
    }
  } catch (error) {
    yield put(getFailureAction(ActionNames.REGISTER)({ error }));
  }
}

function* loginFromStore() {
  const token = yield call(getTokenFromStorage);
  if (token) {
    yield put(getSuccessAction(ActionNames.LOGIN_FROM_STORE)({ token }));
    yield call(initAfterLogin, token);
  } else {
    yield put(getFailureAction(ActionNames.LOGIN_FROM_STORE)());
  }
}

function* logOut() {
  yield put(clearStore());
  yield call(removeTokenFromStorage);
}

export default function* rootSaga() {
  yield all([
    yield takeEvery(getRequestAction(ActionNames.LOGIN).type, signIn),
    yield takeEvery(getRequestAction(ActionNames.REGISTER).type, register),
    yield takeEvery(
      getRequestAction(ActionNames.LOGIN_FROM_STORE).type,
      loginFromStore,
    ),
    yield takeEvery(ActionNames.LOGOUT, logOut),
  ]);
}

