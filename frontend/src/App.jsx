import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import {
  lazy,
  Suspense
} from "react";
import ProtectedRoute from "./components/protectedRoute";
import Login from "./pages/login";
const AIInsights = lazy(() => import("./pages/AIInsights"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Documents = lazy(() => import("./pages/Documents"));
const HSN = lazy(() => import("./pages/HSN"));
const Duty = lazy(() => import("./pages/Duty"));
const Risk = lazy(() => import("./pages/Risk"));
const Shipments = lazy(() => import("./pages/Shipments"));
const Notifications = lazy(() => import("./pages/Notifications"));
const CountryAnalytics = lazy(() => import("./pages/CountryAnalytics"));
const ManagerDashboard = lazy(() => import("./pages/ManagerDashboard"));
const ShipmentApprovals = lazy(() => import("./pages/ShipmentApprovals"));
const RiskEscalations = lazy(() => import("./pages/RiskEscalations"));
const DutyHistory = lazy(() => import("./pages/DutyHistory"));
const ComplianceApprovals = lazy(() => import("./pages/ComplianceApprovals"));
function App() {
  return (
    <BrowserRouter>
        <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div></div>}>
    <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/ai-insights" element={<ProtectedRoute><AIInsights /></ProtectedRoute>}/>
        <Route path="/dashboard"element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
        <Route path="/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
        <Route path="/hsn" element={<ProtectedRoute><HSN /></ProtectedRoute>} />
        <Route path="/duty" element={<ProtectedRoute><Duty /></ProtectedRoute>} />
        <Route path="/risk" element={<ProtectedRoute><Risk /></ProtectedRoute>} />
        <Route path="/shipments" element={<ProtectedRoute><Shipments /></ProtectedRoute>} />
        <Route path="/country-analytics" element={<ProtectedRoute><CountryAnalytics /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/manager" element={<ProtectedRoute><ManagerDashboard /></ProtectedRoute>} />
        <Route path="/shipment-approvals"element={<ProtectedRoute><ShipmentApprovals /></ProtectedRoute>}/>
        <Route path="/risk-escalations"element={<ProtectedRoute><RiskEscalations /></ProtectedRoute>}/>
        <Route path="/duty-history"element={<ProtectedRoute><DutyHistory /></ProtectedRoute>}/>
        <Route path="/compliance-approvals"element={<ProtectedRoute><ComplianceApprovals /></ProtectedRoute>}/>
      </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
export default App;