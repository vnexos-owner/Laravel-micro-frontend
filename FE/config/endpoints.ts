const authEndpoints = {
  SIGN_UP: "/auth/signup",
  SIGN_IN: "/auth/signin",
  SIGN_OUT: "/auth/signout",
  REFRESH: "/auth/refresh",
  ME: "/auth/me",
};

const accountEndpoints = {
  USERS: "/users",
  USERS_ID: "/users/{id}",
  ROLES: "/users/{id}/roles",
  USERS_ROLES: "/users/roles/{role}",
  USERS_CLASSES: "/users/classes",
};

const courseEndpoints = {
  COURSES: "/courses",
  COURSES_ID: "/courses/{id}",
  COURSES_RESTORE: "/courses/{id}/restore",
};

const semesterEndpoints = {
  SEMESTERS: "/semesters",
  SEMESTERS_ID: "/semesters/{id}",
  SEMESTERS_SET_CURRENT: "/semesters/{id}/set-current",
  SEMESTERS_RESTORE: "/semesters/{id}/restore",
  SEMESTERS_CURRENT: "/semesters/current",
};

const classEndpoints = {
  CLASSES: "/classes",
  CLASSES_ID: "/classes/{id}",
  CLASSES_RESTORE: "/classes/{id}/restore",
  CLASSES_COURSES: "/classes/{id}/courses",
  CLASSES_STUDENTS: "/classes/{id}/students",
};

export {
  authEndpoints,
  accountEndpoints,
  courseEndpoints,
  semesterEndpoints,
  classEndpoints,
};
