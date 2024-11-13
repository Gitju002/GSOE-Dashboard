import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const agentApi = createApi({
  reducerPath: "agentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/api/v1/agent`,
  }),
  tagTypes: ["Agent", "Agents"],
  endpoints: (builder) => ({
    registerAgent: builder.mutation({
      query: (body) => ({
        url: "/register",
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Agent"],
    }),
    getAgentById: builder.query({
      query: (id) => {
        const queryString = id !== null ? `${id}` : "";
        return {
          url: `/get/${queryString}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["Agent"],
    }),
    getAgents: builder.query({
      query: ({ search = "" }) => {
        const searchString = search !== null ? `?search=${search}` : "";
        return {
          url: `/get${searchString}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["Agents"],
    }),
    updateAgent: builder.mutation({
      query: ({ id, body }) => ({
        url: `/update/${id}`,
        method: "PUT",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Agent"],
    }),
    deleteAgent: builder.mutation({
      query: (id) => ({
        url: `/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Agents"],
    }),
  }),
});

export const {
  useRegisterAgentMutation,
  useGetAgentByIdQuery,
  useGetAgentsQuery,
  useUpdateAgentMutation,
  useDeleteAgentMutation,
} = agentApi;
