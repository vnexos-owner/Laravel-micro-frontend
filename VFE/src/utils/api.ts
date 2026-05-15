import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/config'
import webLocalStorage from './webLocalStorage'
import webStorageClient from './webStorageClient'

interface RefreshTokenResponse {
  access_token: string
  expires_in: number
}

interface FetchOptions extends RequestInit {
  skipAuth?: boolean
}

let accessToken: string | null = null

export function setAccessToken(token: string) {
  accessToken = token
}

export function clearAccessToken() {
  accessToken = null
}

let isRefreshing = false
let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  if (isRefreshing) return refreshPromise

  const refreshToken = webLocalStorage.get(REFRESH_TOKEN)

  if (!refreshToken) return null

  isRefreshing = true

  refreshPromise = fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  })
    .then(async (res) => {
      if (!res.ok) return null
      const data: RefreshTokenResponse = await res.json()
      setAccessToken(data.access_token)
      webStorageClient.set(ACCESS_TOKEN, data.access_token, {
        expires: new Date(Date.now() + data.expires_in * 1000),
      })
      return data.access_token
    })
    .catch(() => null)
    .finally(() => {
      isRefreshing = false
      refreshPromise = null
    })

  return refreshPromise
}

let onSignout: (() => void) | null = null

export function registerSignoutHandler(handler: () => void) {
  onSignout = handler
}

const BASE_URL = `${import.meta.env.VITE_API_URL}`

async function apiFetch<T = unknown>(endpoint: string, options: FetchOptions): Promise<T> {
  const { skipAuth, headers: extraHeaders, ...rest } = options

  function buildHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      Accept: 'application/json',
      ...(extraHeaders as Record<string, string>),
    }

    if (rest.body && typeof rest.body === 'string' && !headers['Content-Type'])
      headers['Content-Type'] = 'application/json'

    if (!skipAuth && accessToken) headers['Authorization'] = `Bearer ${accessToken}`

    return headers
  }

  while (endpoint.startsWith('/')) endpoint = endpoint.substring(1)
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}/${endpoint}`

  let response = await fetch(url, { ...rest, headers: buildHeaders() })

  if (response.status === 401 && !skipAuth) {
    const newToken = await refreshAccessToken()

    if (!newToken) {
      onSignout?.()
      throw new ApiError(401, 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!')
    }

    response = await fetch(url, { ...rest, headers: buildHeaders() })
  }

  if (!response.ok) {
    let message = response.statusText

    try {
      const err = await response.json()
      message = JSON.stringify(err) ?? message
    } catch {
      // Use status text instead
    }
    throw new ApiError(response.status, message)
  }

  const contentType = response.headers.get('Content-Type') ?? ''
  if (contentType.includes('application/json')) {
    return response.json() as Promise<T>
  }

  return response.text() as unknown as Promise<T>
}

type QueryParams = Record<
  string,
  string | number | boolean | null | undefined | (string | number | boolean)[]
>

function buildQueryString(params: QueryParams): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) continue
    if (Array.isArray(value)) {
      value.forEach((v) => search.append(key, String(v)))
    } else {
      search.set(key, String(value))
    }
  }
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

export const api = {
  get<T = unknown>(endpoint: string, params?: QueryParams, options?: FetchOptions) {
    const qs = params ? buildQueryString(params) : ''
    return apiFetch<T>(`${endpoint}${qs}`, { ...options, method: 'GET' })
  },

  post<T = unknown>(endpoint: string, body: unknown, options?: FetchOptions) {
    return apiFetch<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    })
  },

  put<T = unknown>(endpoint: string, body: unknown, options?: FetchOptions) {
    return apiFetch<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    })
  },

  patch<T = unknown>(endpoint: string, body: unknown, options?: FetchOptions) {
    return apiFetch<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    })
  },

  delete<T = unknown>(endpoint: string, options?: FetchOptions) {
    return apiFetch<T>(endpoint, { ...options, method: 'DELETE' })
  },
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
  }

  getBody(): Record<string, unknown> {
    return JSON.parse(this.message)
  }
}
