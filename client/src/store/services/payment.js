// src/services/paymentApi.js

import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/api/v1/payment`,
    credentials: "include",
  }),
  tagTypes: ["Payment"],
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (body) => ({
        url: "/create-order",
        method: "POST",
        body,
      }),
    }),
    verifyPayment: builder.query({
      query: (data) => ({
        url: "/verify",
        method: "POST",
        body: data,
      }),
    }),
    refundPayment: builder.mutation({
      query: (body) => ({
        url: "/refund",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useVerifyPaymentQuery,
  useRefundPaymentMutation,
} = paymentApi;
