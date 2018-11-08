import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  // 没有token会跳转到login
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
