export function getRateLimit () {
  return {
    type: 'API:GET_RATE_LIMIT',
    payload: {
      url: '/github/rate_limit',
    },
  }
}
