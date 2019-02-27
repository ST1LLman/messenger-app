import { TOKEN_FIELD, MESSAGES_API_URL } from "./constants";

export function register(email, password, name, callback) {
  return fetch(MESSAGES_API_URL + "/register", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password, name })
  })
    .then(response => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    })
    .then(result => {
      callback(result);
    })
    .catch(function(error) {
      console.log(error);
    });
}

export function login(email, password, callback) {
  return fetch(MESSAGES_API_URL + "/login", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  })
    .then(response => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    })
    .then(result => {
      callback(result);
    })
    .catch(function(error) {
      console.log(error);
    });
}

export function saveToken(token) {
  if (localStorageAvailable()) {
    window.localStorage[TOKEN_FIELD] = token;
  }
}

export function getToken() {
  if (localStorageAvailable()) {
    return window.localStorage[TOKEN_FIELD];
  } else {
    return undefined;
  }
}

export function logout() {
  if (localStorageAvailable()) {
    return window.localStorage.removeItem(TOKEN_FIELD);
  } else {
    return undefined;
  }
}

export function isLoggedIn(token) {
  if (token) {
    if (typeof token !== "string" || token.split(".").length < 2) {
      saveToken(undefined);
      return false;
    }
    var payload = JSON.parse(window.atob(token.split(".")[1]));

    return payload.exp > Date.now() / 1000;
  } else {
    return false;
  }
}

export function currentUser(token) {
  if (isLoggedIn(token)) {
    var payload = JSON.parse(window.atob(token.split(".")[1]));

    return {
      name: payload.name,
      email: payload.email
    };
  }
}

function localStorageAvailable() {
  try {
    var storage = window.localStorage,
      x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return false;
  }
}