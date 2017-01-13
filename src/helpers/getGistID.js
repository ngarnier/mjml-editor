const REGEXP_ID = /https:\/\/gist\.github\.com\/([^\/]*\/)?([^\.git]{32})/
const REGEXP_ID_LENGTH = /.{32}/

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
