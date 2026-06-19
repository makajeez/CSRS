import { Routes, Route } from "react-router-dom";
import  Home  from '../features/home/Home';
import Report from '../features/report/Report'
import  Dashboard  from "../features/dashboard/Dashboard";

function NotFound() {
  return <h1>404 - Page Not Found</h1>;
}

function AppRoutes() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<Report />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
  );
}

export default AppRoutes;