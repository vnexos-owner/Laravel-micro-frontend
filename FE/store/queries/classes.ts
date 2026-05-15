import { baseApi } from "../base";

import { Class, PaginateParams } from "@/types";
import { classEndpoints } from "@/config/endpoints";

export type GetClassesParams = PaginateParams & {
  semester_id?: string;
  homeroom_teacher_id?: string;
};
export type ClassCreateBody = Omit<
  Class,
  "id" | "created_at" | "updated_at" | "deleted_at"
>;
export type ClassUpdateBody = {
  id: string;
  body: Partial<ClassCreateBody>;
};
export type ClassCourseManageBody = {
  id: string;
  course_id: string;
};
export type ClassStudentManageBody = {
  id: string;
  student_id: string;
};

export const classApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClasses: builder.query({
      query: (params: GetClassesParams) => ({
        url: classEndpoints.CLASSES,
        method: "GET",
        params,
      }),
    }),
    createClass: builder.mutation({
      query: (body: ClassCreateBody) => ({
        url: classEndpoints.CLASSES,
        method: "POST",
        body,
      }),
    }),
    updateClass: builder.mutation({
      query: ({ id, body }: ClassUpdateBody) => ({
        url: classEndpoints.CLASSES_ID.replaceAll("{id}", id),
        method: "PATCH",
        body,
      }),
    }),
    deleteClass: builder.mutation({
      query: (id: string) => ({
        url: classEndpoints.CLASSES_ID.replaceAll("{id}", id),
        method: "DELETE",
      }),
    }),
    restoreClass: builder.mutation({
      query: (id: string) => ({
        url: classEndpoints.CLASSES_RESTORE.replaceAll("{id}", id),
        method: "PATCH",
      }),
    }),
    // Manage courses in class
    getClassCourses: builder.query({
      query: (id: string) => ({
        url: classEndpoints.CLASSES_COURSES.replaceAll("{id}", id),
        method: "GET",
      }),
    }),
    createClassCourse: builder.mutation({
      query: ({ id, course_id }: ClassCourseManageBody) => ({
        url: classEndpoints.CLASSES_COURSES.replaceAll("{id}", id),
        method: "POST",
        body: { course_id },
      }),
    }),
    deleteClassCourse: builder.mutation({
      query: ({ id, course_id }: ClassCourseManageBody) => ({
        url: classEndpoints.CLASSES_COURSES.replaceAll("{id}", id),
        method: "DELETE",
        body: { course_id },
      }),
    }),
    // Manage students in class
    getClassStudents: builder.query({
      query: (id: string) => ({
        url: classEndpoints.CLASSES_STUDENTS.replaceAll("{id}", id),
        method: "GET",
      }),
    }),
    createClassStudent: builder.mutation({
      query: ({ id, student_id }: ClassStudentManageBody) => ({
        url: classEndpoints.CLASSES_STUDENTS.replaceAll("{id}", id),
        method: "POST",
        body: { student_id },
      }),
    }),
    deleteClassStudent: builder.mutation({
      query: ({ id, student_id }: ClassStudentManageBody) => ({
        url: classEndpoints.CLASSES_STUDENTS.replaceAll("{id}", id),
        method: "DELETE",
        body: { student_id },
      }),
    }),
  }),
});

export const {
  useGetClassesQuery,
  useCreateClassMutation,
  useUpdateClassMutation,
  useDeleteClassMutation,
  useRestoreClassMutation,
  // Manage courses in class
  useGetClassCoursesQuery,
  useCreateClassCourseMutation,
  useDeleteClassCourseMutation,
  // Manage students in class
  useGetClassStudentsQuery,
  useCreateClassStudentMutation,
  useDeleteClassStudentMutation,
} = classApi;
