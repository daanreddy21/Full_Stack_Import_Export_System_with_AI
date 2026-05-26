import { FaHome, FaFileAlt, FaBox, FaMoneyBill, FaExclamationTriangle, FaShip, FaBell,FaGlobe,FaClipboardCheck, FaExclamationCircle,FaBrain, FaSignOutAlt } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
export default function ManagerSidebar(){
const navigate = useNavigate();
  const notifications =
      JSON.parse(
          localStorage.getItem(
              "notifications"
          )
      ) || [];
  const notificationCount =notifications.length;
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };
  const menuClass ="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition";
  const activeClass ="bg-yellow-500 text-black";
  return (
    <div className="w-64 min-h-screen bg-black text-white p-5">
      <h1 className="text-2xl font-bold mb-10">
        Import Export AI
      </h1>
      <div className="space-y-2">
<NavLink to="/manager"
      className={({ isActive }) =>`${menuClass} ${isActive ? activeClass : ""}`}>
        <FaHome />Dashboard
    </NavLink>
    <NavLink
    to="/ai-insights"
    className={({ isActive }) =>
        `${menuClass} ${isActive ? activeClass : ""}`
    }
>
    <FaBrain />
    AI Insights
</NavLink>
<NavLink
    to="/shipment-approvals"
    className={({ isActive }) =>
        `${menuClass} ${isActive ? activeClass : ""}`}>
    <FaClipboardCheck />Shipment Approvals
</NavLink>
<NavLink
    to="/compliance-approvals"
    className={({ isActive }) =>
        `${menuClass} ${isActive ? activeClass : ""}`}>
    <FaClipboardCheck />Compliance Approvals
</NavLink>

  <NavLink
      to="/documents"className={({ isActive }) =>`${menuClass} ${isActive ? activeClass : ""}`}>
    <FaFileAlt />Documents-ORC
  </NavLink>
  <NavLink
    to="/hsn" className={({ isActive }) =>`${menuClass} ${isActive ? activeClass : ""}`}>
    <FaBox />HSN Classification
  </NavLink>
    <NavLink
      to="/duty"className={({ isActive }) =>`${menuClass} ${isActive ? activeClass : ""}`}>
        <FaMoneyBill />Duty Engine
      </NavLink>
            <NavLink 
      to="/duty-history" className={({ isActive }) =>`${menuClass} ${isActive ? activeClass : ""}`}>
        <FaMoneyBill />Duty History
      </NavLink>
    <NavLink
      to="/risk"className={({ isActive }) =>`${menuClass} ${isActive ? activeClass : ""}`}>
  <FaExclamationTriangle />Risk Analysis
    </NavLink>
<NavLink
    to="/risk-escalations"
    className={({ isActive }) =>
        `${menuClass} ${isActive ? activeClass : ""}`}>
    <FaExclamationCircle />Risk Escalations
</NavLink>
    <NavLink
    to="/shipments"
    className={({ isActive }) =>`${menuClass} ${isActive ? activeClass : ""}`}>
  <FaShip />Shipments
    </NavLink>
    <NavLink to="/country-analytics"
      className={({ isActive }) =>`${menuClass} ${isActive ? activeClass : ""}`}>
      <FaGlobe />Country Analytics
    </NavLink>
<NavLink
    to="/notifications"
    className={({ isActive }) =>
        `${menuClass} ${isActive ? activeClass : ""}`}>
    <div className="flex items-center gap-3 w-full justify-between">
        <div className="flex items-center gap-3">
            <FaBell />
            Notifications
        </div>
        {notificationCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">{notificationCount}</span>
)       }
    </div>
</NavLink>
      <button onClick={handleLogout}className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-500 w-full mt-10">
        <FaSignOutAlt />
      Logout
    </button>
      </div>
    </div>
  );
}