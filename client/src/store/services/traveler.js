import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

export const travelerApi = createApi({
  reducerPath: "travelerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/api/v1/traveller`,
    credentials: "include",
  }),
  tagTypes: ["Traveler", "Travelers"],
  endpoints: (builder) => ({
    getAllTravelersWithFilter: builder.query({
      query: ({ search = "" }) => {
        const searchString = search !== null ? `?search=${search}` : "";
        return {
          url: `/get${searchString}`,
          method: "GET",
        };
      },
      providesTags: ["Travelers"],
    }),
    registerTraveler: builder.mutation({
      query: (body) => ({
        url: "/register",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Traveler"],
    }),
    getTravelerById: builder.query({
      query: (id) => ({
        url: `/get/${id}`,
        method: "GET",
      }),
      providesTags: ["Traveler"],
    }),
    updateTraveler: builder.mutation({
      query: ({ id, body }) => ({
        url: `/update/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Traveler"],
    }),
    deleteTraveler: builder.mutation({
      query: (id) => ({
        url: `/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Travelers"],
    }),
  }),
});

export const {
  useGetAllTravelersWithFilterQuery,
  useRegisterTravelerMutation,
  useGetTravelerByIdQuery,
  useUpdateTravelerMutation,
  useDeleteTravelerMutation,
} = travelerApi;
