import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/authentication/LoginPage";
import Layout from "./components/dashboard/Layout";
import PolicyManagementTable from "./components/dashboard/policy-management/PolicyManagementTable";
import Illustration from "./components/dashboard/illustration-management/IllustrationTable";
import RegisterPage from "./components/authentication/RegisterPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<Layout />}>
        <Route path="/policy-management" element={<PolicyManagementTable />} />
        <Route
          path="/"
          element={<Navigate to="/policy-management" replace />}
        />

        <Route path="/illustration" element={<Illustration />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
