# GSOE Dashboard

## Introduction

The GSOE Dashboard is a robust management platform built for tour and travel agencies, offering streamlined solutions for handling travelers, agents, tours, and transactions. This application features a secure role-based access system for admins, operators, and accountants, along with seamless payment and refund processing via Razorpay. With data-driven insights through charts and graphs powered by SHADCN components, the platform enables agencies to manage operations effectively.

## Features

- **Traveler and Agent Management**:
  - Add, edit, or remove travelers and agents.
  - Track travel histories and manage profiles.

- **Payment and Transactions**:
  - Set up flexible EMI payment options.
  - Integrate Razorpay for secure transactions.
  - Process refunds and verify transactions for accurate records.

- **Role-Based Access**:
  - **Admin**: Complete access to all features, including user, tour, and transaction management.
  - **Operator**: Access to daily operations and customer interactions.
  - **Accountant**: Access to transaction verification, payment processing, and refund management.

- **Tour and Travel Management**:
  - Organize, update, and view detailed tour information, schedules, and booking statuses.

- **Analytics Dashboard**:
  - Visualize key metrics with charts and graphs from SHADCN components, providing insights into bookings, payments, and customer demographics.

## Installation

To set up the GSOE Dashboard locally, follow these steps:

### Prerequisites
- **Node.js** and **npm** installed
- **MongoDB** database (local or cloud-based)
- Razorpay account for payment integration

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/GSOE-Dashboard.git
   cd GSOE-Dashboard
   
2. Install Dependencies: Run the following command to install all the dependencies required for the project.
   ```bash
   npm install
   
3. Set Up Environment Variables: Create a .env file in the root directory with the following variables:
   **for client directory**
   ```bash
   VITE_API_URL=http://localhost:5000
   VITE_CLOUDINARY_CLOUD_NAME=
   VITE_CLOUDINARY_UPLOAD_PRESET=
   ```
   **for server directory**
   ```bash
   PORT=5000
   NODE_ENV=DEVLOPMENT
   # database
   MONGO_URI=
  DB_NAME=
  # mail
  MAIL_PASSWORD=
  MAIL_ID=
  EMAIL_PORT=
  EMAIL_HOST=
  EMAIL_SERVICE=
  EMAIL_SECURE=
  # razorpay
  RAZORPAY_KEY_SECRET=
  RAZORPAY_KEY_ID=
  # auth
  SESSION_SECRET=
  PASSWORD_SALT=
  JWT_COOKIE_EXPIRE=
  JWT_SECRET=
  JWT_EXPIRE_IN=
  # URLS
  FRONTEND_URL=http://localhost:5173
  WHITE_LISTED_DOMAINS=["http://localhost:5173/", "http://localhost:5173"]
  BACKEND_URL=http://localhost:5000
  # Not needed
  OTP_EXPIRE_IN_SEC=300
  AGENT_COMMISSION=0.02
   ```
   
4. Run the Application: Use the following command to start the application locally.
   ```bash
   npm start
   
5. Access the Application:
   Open your browser and go to http://localhost:3000 to view the application locally.

