export function loadGist (gistID) {
  return {
    type: 'API:LOAD_GIST',
    payload: {
      url: `/github/gists/${gistID}`,
    },
  }
}
