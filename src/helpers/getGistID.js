const REGEXP_ID = /^https:\/\/gist\.github\.com\/([^\/]*\/)?(.{32})(\.git)?$/
const REGEXP_ID_LENGTH = /[\d\w]{32}/

export default function getGistID (gistValue) {
  const matches = gistValue.match(REGEXP_ID)

  if (matches) {
    const [ , , gistID ] = matches

    if (gistID) {
      return gistID
    }
  }

  if (REGEXP_ID_LENGTH.test(gistValue)) {
    return gistValue
  }

  return null
}
