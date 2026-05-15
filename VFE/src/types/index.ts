export interface SignUpBody {
  name: string
  email: string
  username: string
  password: string
  password_confirmation: string
  gender: string
  dob: string
}

export interface SignInBody {
  account: string
  password: string
}

export interface AuthResponse {
  refresh_token: string
  access_token: string
  expires_in: number
}

export interface User {
  id: string
  name: string
  username: string
  email: string
  email_verified_at: string
  avatar: string | null
  banner: string | null
  gender: string
  dob: string
  roles: string[]
  deleted_at: string | null
}
