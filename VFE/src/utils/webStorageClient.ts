import _ from 'lodash'
import Cookies, { type CookieSetOptions } from 'universal-cookie'

const cookies = new Cookies()

const webStorageClient = {
  set(key: string, rawValue: unknown, option?: CookieSetOptions) {
    const value = _.isString(rawValue) ? rawValue : JSON?.stringify(rawValue)

    cookies.set(key, value, option)
  },

  get(key: string) {
    const value = cookies.get(key)

    if (!value) return ''

    try {
      return JSON?.parse(value)
    } catch {
      return value
    }
  },

  remove(key: string, options?: CookieSetOptions) {
    cookies.remove(key, { path: '/', ...options })
  },

  removeAll() {
    Object.keys(cookies.getAll()).forEach((cookieName) => {
      cookies.set(cookieName, undefined)
    })
  },
}

export default webStorageClient
