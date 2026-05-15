import { baseApi } from "../base";

import { courseEndpoints } from "@/config/endpoints";
import { Course, PaginateParams } from "@/types";

export type GetCourseParams = PaginateParams;
export type CourseCreateInfo = Omit<
  Course,
  "id" | "created_at" | "updated_at" | "deleted_at" | "prerequisite"
> & {
  prerequisite?: string | null;
};
export type CourseUpdateInfo = {
  id: string;
  body: Partial<CourseCreateInfo>;
};

export const courseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query({
      query: (params: GetCourseParams) => ({
        url: courseEndpoints.COURSES,
        method: "GET",
        params,
      }),
    }),
    createCourse: builder.mutation({
      query: (body: CourseCreateInfo) => ({
        url: courseEndpoints.COURSES,
        method: "POST",
        body,
      }),
    }),
    updateCourse: builder.mutation({
      query: ({ body, id }: CourseUpdateInfo) => ({
        url: courseEndpoints.COURSES_ID.replaceAll("{id}", id),
        method: "PATCH",
        body,
      }),
    }),
    deleteCourse: builder.mutation({
      query: (id: string) => ({
        url: courseEndpoints.COURSES_ID.replaceAll("{id}", id),
        method: "DELETE",
      }),
    }),
    restoreCourse: builder.mutation({
      query: (id: string) => ({
        url: courseEndpoints.COURSES_RESTORE.replaceAll("{id}", id),
        method: "PATCH",
      }),
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useRestoreCourseMutation,
} = courseApi;
