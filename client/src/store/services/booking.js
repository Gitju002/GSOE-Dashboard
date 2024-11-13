import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

export const bookingApi = createApi({
  reducerPath: "bookingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/api/v1/booking`,
    credentials: "include",
  }),
  tagTypes: ["Booking"],
  endpoints: (builder) => ({
    createBooking: builder.mutation({
      query: (body) => ({
        url: "/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Booking"],
    }),
    addEmis: builder.mutation({
      query: (body) => ({
        url: "/add-emis",
        method: "POST",
        body: {
          bookingId: body.bookingId,
          emi: {
            amount: body.amount,
            date: body.date,
          },
        },
      }),
      invalidatesTags: ["Booking"],
    }),
    getBookingsDirect: builder.query({
      query: ({ page, search }) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page);
        if (search) params.append("search", search);

        return `/get/direct?${params.toString()}`;
      },
      providesTags: ["Booking"],
    }),
    getBookingsReferral: builder.query({
      query: ({ page, search }) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page);
        if (search) params.append("search", search);
        return `/get/referral?${params.toString()}`;
      },
      providesTags: ["Booking"],
    }),
    getSingleBookingById: builder.query({
      query: (id) => `/get/${id}`,
      invalidatesTags: ["Booking"],
    }),
    updateBooking: builder.mutation({
      query: ({ id, body }) => ({
        url: `/update/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Booking"],
    }),
    deleteBooking: builder.mutation({
      query: (bookingId) => ({
        url: `/delete/${bookingId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Booking"],
    }),
    deleteEmi: builder.mutation({
      query: (emiId) => ({
        url: `/delete-emi/${emiId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Booking"],
    }),
    updateEmi: builder.mutation({
      query: ({ bookingId, emi }) => ({
        url: `/update-emi/${bookingId}`,
        method: "PUT",
        body: emi,
      }),
      invalidatesTags: ["Booking"],
    }),
    changeBookingStatus: builder.mutation({
      query: ({ bookingId, status }) => ({
        url: `/change-status/${bookingId}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Booking"],
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useAddEmisMutation,
  useGetSingleBookingByIdQuery,
  useUpdateBookingMutation,
  useDeleteBookingMutation,
  useGetBookingsDirectQuery,
  useGetBookingsReferralQuery,
  useDeleteEmiMutation,
  useUpdateEmiMutation,
  useChangeBookingStatusMutation,
} = bookingApi;
