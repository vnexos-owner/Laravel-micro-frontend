const authEndpoints = {
  SIGN_UP: '/auth/signup',
  SIGN_IN: '/auth/signin',
  SIGN_OUT: '/auth/signout',
  REFRESH: '/auth/refresh',
  ME: '/auth/me',
}

const semesterEndpoints = {
  SEMESTERS_CURRENT: '/semesters/current',
}

const accountEndpoints = {
  USERS: '/users',
  USERS_CLASSES: '/users/classes',
}

const courseEndpoints = {
  COURSES: '/courses',
}

const classEndpoints = {
  CLASSES: '/classes',
  CLASSES_ID: '/classes/{id}',
  CLASSES_RESTORE: '/classes/{id}/restore',
  CLASSES_COURSES: '/classes/{id}/courses',
  CLASSES_STUDENTS: '/classes/{id}/students',
}

export { authEndpoints, accountEndpoints, semesterEndpoints, classEndpoints, courseEndpoints }
