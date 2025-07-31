import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/authentication/LoginPage";
import Layout from "./components/dashboard/Layout";
import PolicyManagementTable from "./components/dashboard/policy-management/PolicyManagementTable";
import Illustration from "./components/dashboard/illustration-management/IllustrationTable";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
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
