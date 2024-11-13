import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "./services/users";
import { agentApi } from "./services/agents";
import { travelerApi } from "./services/traveler";
import { bookingApi } from "./services/booking";
import { transactionApi } from "./services/transaction";
import { paymentApi } from "./services/payment";
import { chartApi } from "./services/chart";
export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [agentApi.reducerPath]: agentApi.reducer,
    [travelerApi.reducerPath]: travelerApi.reducer,
    [bookingApi.reducerPath]: bookingApi.reducer,
    [transactionApi.reducerPath]: transactionApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
    [chartApi.reducerPath]: chartApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userApi.middleware)
      .concat(agentApi.middleware)
      .concat(travelerApi.middleware)
      .concat(bookingApi.middleware)
      .concat(transactionApi.middleware)
      .concat(paymentApi.middleware)
      .concat(chartApi.middleware),
});
