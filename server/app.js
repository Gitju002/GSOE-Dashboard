import "colors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { connectDB } from "./config/databaseConfig.js";
import { errorHandler, ErrorResponse } from "./middleware/error.js";
import adminRoutes from "./routes/user.js";
import agentRoutes from "./routes/agent.js";
import travellerRoutes from "./routes/traveller.js";
import bookingsRoutes from "./routes/bookings.js";
import transactionRoutes from "./routes/transaction.js";
import chartRoutes from "./routes/chart.js";
import paymentRouts from "./routes/payment.js";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";

dotenv.config({ path: "./.env" });

connectDB();

const app = express();

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (process.env.WHITE_LISTED_DOMAINS.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new ErrorResponse("Not allowed by CORS", 403));
      }
    },
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Access-Control-Allow-Origin",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.set("trust proxy", true);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    cookie: {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
    },

    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      dbName: process.env.DB_NAME,
    }),
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "DEVLOPMENT") {
  app.use(morgan("dev"));
}

app.use("/api/v1/user", adminRoutes);
app.use("/api/v1/traveller", travellerRoutes);
app.use("/api/v1/agent", agentRoutes);
app.use("/api/v1/booking", bookingsRoutes);
app.use("/api/v1/transaction", transactionRoutes);
app.use("/api/v1/payment", paymentRouts);
app.use("/api/v1/charts", chartRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(`Server running on port ${PORT}`.yellow.bold)
);

app.get("/", (req, res) => {
  res.send("Hello from the server");
});

// NOTE: setting up favicon.ico route
app.get("/favicon.ico", (req, res) => res.status(204));

// NOTE: Handling the unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Shutting the server down: ${err.message}`.red);
  // NOTE: Closing the server and exiting the process
  server.close(() => process.exit(1));
});

// NOTE: Handling the unhandled exceptions
process.on("uncaughtException", (err, promise) => {
  console.log(`Shutting the server down: ${err.message}`.red);
  // NOTE: Closing the server and exiting the process
  server.close(() => process.exit(1));
});

// NOTE: Route not found middleware
app.use((req, res, next) => {
  return next(new ErrorResponse(`Route not found - ${req.originalUrl}`, 404));
});
