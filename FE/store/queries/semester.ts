import { baseApi } from "../base";

import { PaginateParams, Semester } from "@/types";
import { semesterEndpoints } from "@/config/endpoints";

export type GetSemesterParams = PaginateParams;
export type SemesterCreateBody = Omit<
  Semester,
  "id" | "is_current" | "created_at" | "updated_at" | "deleted_at"
>;
export type SemesterUpdateBody = {
  id: string;
  body: Partial<SemesterCreateBody>;
};

export const courseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSemester: builder.mutation({
      query: (body: SemesterCreateBody) => ({
        url: semesterEndpoints.SEMESTERS,
        method: "POST",
        body,
      }),
    }),
    updateSemester: builder.mutation({
      query: ({ id, body }: SemesterUpdateBody) => ({
        url: semesterEndpoints.SEMESTERS_ID.replaceAll("{id}", id),
        method: "PATCH",
        body,
      }),
    }),
    setCurrentSemester: builder.mutation({
      query: (id: string) => ({
        url: semesterEndpoints.SEMESTERS_SET_CURRENT.replaceAll("{id}", id),
        method: "PATCH",
      }),
    }),
    deleteSemester: builder.mutation({
      query: (id: string) => ({
        url: semesterEndpoints.SEMESTERS_ID.replaceAll("{id}", id),
        method: "DELETE",
      }),
    }),
    restoreSemester: builder.mutation({
      query: (id: string) => ({
        url: semesterEndpoints.SEMESTERS_RESTORE.replaceAll("{id}", id),
        method: "PATCH",
      }),
    }),
    getSemesters: builder.query({
      query: (params: GetSemesterParams) => ({
        url: semesterEndpoints.SEMESTERS,
        method: "GET",
        params,
      }),
    }),
    getCurrentSemester: builder.query({
      query: () => ({
        url: semesterEndpoints.SEMESTERS_CURRENT,
        method: "GET",
      }),
    }),
    getSemesterById: builder.query({
      query: (id: string) => ({
        url: semesterEndpoints.SEMESTERS_ID.replaceAll("{id}", id),
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetSemestersQuery,
  useCreateSemesterMutation,
  useUpdateSemesterMutation,
  useSetCurrentSemesterMutation,
  useRestoreSemesterMutation,
  useDeleteSemesterMutation,
  useGetCurrentSemesterQuery,
  useGetSemesterByIdQuery,
} = courseApi;
