import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

export const transactionApi = createApi({
  reducerPath: "transactionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/api/v1/transaction`,
    credentials: "include",
  }),
  tagTypes: ["Transaction"],
  endpoints: (builder) => ({
    getTransactions: builder.query({
      query: ({ page, search }) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page);
        if (search) params.append("search", search);

        return `/get?${params.toString()}`;
      },
      providesTags: ["Transaction"],
    }),
    getEmiData: builder.query({
      query: (bookingId) => `/get-payments/${bookingId}`,
      providesTags: ["Transaction"],
    }),
    getPaymentVerificationData: builder.query({
      query: () => "/payment-verification-data",
    }),
    verifyTransaction: builder.mutation({
      query: (body) => ({
        url: "/verify-transaction",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Transaction"],
    }),
  }),
});

export const {
  useGetTransactionsQuery,
  useGetEmiDataQuery,
  useGetPaymentVerificationDataQuery,
  useVerifyTransactionMutation,
} = transactionApi;
