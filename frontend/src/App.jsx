import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import HSN from "./pages/HSN";
import Duty from "./pages/Duty";
import Risk from "./pages/Risk";
import Shipments from "./pages/Shipments";  
import ProtectedRoute from "./components/protectedRoute";
import Notifications from "./pages/Notifications";
import CountryAnalytics from "./pages/CountryAnalytics";
import ManagerDashboard from "./pages/ManagerDashboard";
import ShipmentApprovals from "./pages/ShipmentApprovals";
import RiskEscalations from "./pages/RiskEscalations";
import DutyHistory from "./pages/DutyHistory";
import ComplianceApprovals from "./pages/ComplianceApprovals";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard"element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
        <Route path="/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
        <Route path="/hsn" element={<ProtectedRoute><HSN /></ProtectedRoute>} />
        <Route path="/duty" element={<ProtectedRoute><Duty /></ProtectedRoute>} />
        <Route path="/risk" element={<ProtectedRoute><Risk /></ProtectedRoute>} />
        <Route path="/shipments" element={<ProtectedRoute><Shipments /></ProtectedRoute>} />
        <Route path="/country-analytics" element={<ProtectedRoute><CountryAnalytics /></ProtectedRoute>} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/manager" element={<ProtectedRoute><ManagerDashboard /></ProtectedRoute>} />
        <Route path="/shipment-approvals"element={<ProtectedRoute><ShipmentApprovals /></ProtectedRoute>}/>
        <Route path="/risk-escalations"element={<ProtectedRoute><RiskEscalations /></ProtectedRoute>}/>
        <Route path="/duty-history"element={<ProtectedRoute><DutyHistory /></ProtectedRoute>}/>
        <Route path="/compliance-approvals"element={<ProtectedRoute><ComplianceApprovals /></ProtectedRoute>}/>
      </Routes>
    </BrowserRouter>
  );
}
export default App;