import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const chartApi = createApi({
  reducerPath: "chartApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/api/v1/charts`,
  }),
  endpoints: (builder) => ({
    getRevenueWithProfit: builder.query({
      query: ({ startDate, endDate }) => ({
        url: `revenue?startDate=${startDate}&endDate=${endDate}`,
      }),
    }),
    getAllTravllers: builder.query({
      query: ({ startDate, endDate }) => ({
        url: `travellers?startDate=${startDate}&endDate=${endDate}`,
      }),
    }),
    getBookings: builder.query({
      query: ({ startDate, endDate }) => ({
        url: `bookings?startDate=${startDate}&endDate=${endDate}`,
      }),
    }),
    getProfitPercentage: builder.query({
      query: ({ startDate, endDate }) => ({
        url: `profit?startDate=${startDate}&endDate=${endDate}`,
      }),
    }),
  }),
});

export const {
  useGetRevenueWithProfitQuery,
  useGetAllTravllersQuery,
  useGetBookingsQuery,
  useGetProfitPercentageQuery,
} = chartApi;
