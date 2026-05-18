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

export interface Semester {
  id: string
  name: string
  start_time: string
  end_time: string
  is_current: boolean
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
}

export interface Class {
  id: string
  name: string
  semester_id: string
  semester: Semester
  homeroom_teacher_id: string
  homeroom_teacher: User
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
}

export interface Course {
  id: string
  name: string
  code: string
  prerequisite: string | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
}
