import { baseApi } from "../base";

import { SignUpBody } from "./auth";

import { PaginateParams } from "@/types";
import { accountEndpoints } from "@/config/endpoints";

export type GetUserBody = PaginateParams;

export interface ChangeRoleData {
  userId: string;
  roleName: string;
}

export type UserCreateInfo = SignUpBody;

export const accountApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (params: GetUserBody) => ({
        url: accountEndpoints.USERS,
        method: "GET",
        params,
      }),
    }),
    createUser: builder.mutation({
      query: (body: UserCreateInfo) => ({
        url: accountEndpoints.USERS,
        method: "POST",
        body,
      }),
    }),
    deleteUser: builder.mutation({
      query: (id: string) => ({
        url: accountEndpoints.USERS_ID.replaceAll("{id}", id),
        method: "DELETE",
      }),
    }),
    restoreUser: builder.mutation({
      query: (id) => ({
        url: accountEndpoints.USERS_ID.replaceAll("{id}", id),
        method: "PATCH",
      }),
    }),
    addRole: builder.mutation({
      query: (data: ChangeRoleData) => ({
        url: accountEndpoints.ROLES.replaceAll("{id}", data.userId),
        method: "POST",
        body: { role: data.roleName },
      }),
    }),
    deleteRole: builder.mutation({
      query: (data: ChangeRoleData) => ({
        url: accountEndpoints.ROLES.replaceAll("{id}", data.userId),
        method: "DELETE",
        body: { role: data.roleName },
      }),
    }),
    getUsersInRole: builder.query({
      query: (role: string) => ({
        url: accountEndpoints.USERS_ROLES.replaceAll("{role}", role),
        method: "GET",
      }),
    }),
    getStatistic: builder.query({
      query: () => ({
        url: "/statistic",
        method: "GET",
      }),
    }),
    getUserClasses: builder.query({
      query: () => ({
        url: accountEndpoints.USERS_CLASSES,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useAddRoleMutation,
  useDeleteRoleMutation,
  useCreateUserMutation,
  useDeleteUserMutation,
  useRestoreUserMutation,
  useGetUsersInRoleQuery,
  useGetStatisticQuery,
  useLazyGetUserClassesQuery,
} = accountApi;
