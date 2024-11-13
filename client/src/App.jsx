import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Sidebar from "@/components/side-bar/sidebar";
import Loader from "@/components/loader/loader";
import { Toaster } from "@/components/ui/toaster";
import { useGetAuthenticatedUserQuery } from "./store/services/users";
import ResetPassword from "./pages/auth/reset-password";

const Agents = lazy(() => import("./pages/dashboard/agents/agents"));
const MainDashboard = lazy(() => import("./pages/dashboard/dashboard"));
const Details = lazy(() => import("./pages/dashboard/details/details"));
const Travelers = lazy(() => import("./pages/dashboard/travelers/travelers"));
const Profile = lazy(() =>
  import("./pages/dashboard/user-profile/user-profile")
);
const ThankYouPage = lazy(() =>
  import("./pages/dashboard/transaction/thank-you-page")
);
const Referrals = lazy(() => import("./pages/dashboard/referrals/referrals"));
const Emi = lazy(() => import("./pages/dashboard/emi/emi"));
const Auth = lazy(() => import("./pages/auth/auth"));
const Transaction = lazy(() =>
  import("./pages/dashboard/transaction/transaction")
);
const ForgotPassword = lazy(() => import("./pages/auth/forgot-password"));

const AuthProtectedRoute = ({ children, allowedRoles, redirectPath }) => {
  const { data, isLoading } = useGetAuthenticatedUserQuery();

  if (isLoading) return <Loader />;

  if (data && data.success && allowedRoles.includes(data?.data?.role)) {
    return children;
  }

  return <Navigate to={redirectPath || "/"} />;
};

const App = () => {
  const { data, isLoading } = useGetAuthenticatedUserQuery();

  if (isLoading) return <Loader />;

  const getRedirectPath = (role) => {
    switch (role) {
      case "ACCOUNTS":
        return "/dashboard/transactions";
      case "OPERATOR":
        return "/dashboard/details";
      default:
        return "/dashboard";
    }
  };

  const isAuthenticated = data && data.success && data.data && data.data.role;

  return (
    <BrowserRouter>
      <div className="mb-4">
        {data && data.success && <Sidebar data={data} />}
      </div>
      <Toaster />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to={getRedirectPath(data.data.role)} />
              ) : (
                <Auth />
              )
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/dashboard"
            element={
              <AuthProtectedRoute allowedRoles={["ADMIN"]}>
                <MainDashboard />
              </AuthProtectedRoute>
            }
          />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route
            path="/dashboard/details"
            element={
              <AuthProtectedRoute allowedRoles={["ADMIN", "OPERATOR"]}>
                <Details />
              </AuthProtectedRoute>
            }
          />
          <Route
            path="/dashboard/agents"
            element={
              <AuthProtectedRoute allowedRoles={["ADMIN", "OPERATOR"]}>
                <Agents />
              </AuthProtectedRoute>
            }
          />
          <Route
            path="/dashboard/travelers"
            element={
              <AuthProtectedRoute allowedRoles={["ADMIN", "OPERATOR"]}>
                <Travelers />
              </AuthProtectedRoute>
            }
          />
          <Route
            path="/dashboard/create-tour"
            element={
              <AuthProtectedRoute allowedRoles={["ADMIN", "OPERATOR"]}>
                <Referrals />
              </AuthProtectedRoute>
            }
          />
          <Route
            path="/dashboard/user-profile"
            element={
              <AuthProtectedRoute
                allowedRoles={["ADMIN", "ACCOUNTS", "OPERATOR"]}
              >
                <Profile />
              </AuthProtectedRoute>
            }
          />
          <Route
            path="/dashboard/emi"
            element={
              <AuthProtectedRoute allowedRoles={["ADMIN", "OPERATOR"]}>
                <Emi />
              </AuthProtectedRoute>
            }
          />
          <Route
            path="/dashboard/transactions"
            element={
              <AuthProtectedRoute
                allowedRoles={["ADMIN", "ACCOUNTS", "OPERATOR"]}
              >
                <Transaction />
              </AuthProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              isAuthenticated ? (
                <Navigate to={getRedirectPath(data.data.role)} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route path="/thank-you" element={<ThankYouPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
