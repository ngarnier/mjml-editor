export function logout () {
  return {
    type: 'LOGOUT',
  }
}

export function setProfile (profile) {
  return {
    type: 'SET_PROFILE',
    payload: profile,
  }
}

export function setAccessToken (accessToken) {
  return {
    type: 'SET_ACCESS_TOKEN',
    payload: accessToken,
  }
}
