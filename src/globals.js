export const __BROWSER__ = false
export const __DEBUG__ = process.env.DEBUG === 'true'

export const __ENV__ = process.env.NODE_ENV || 'development'

export const __DEV__ = __ENV__ === 'development'
export const __PROD__ = __ENV__ === 'production'
