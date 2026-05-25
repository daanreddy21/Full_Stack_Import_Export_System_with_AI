import Sidebar from "../components/Sidebar";
import ManagerSidebar from "../components/ManagerSidebar";
import Navbar from "../components/Navbar";
import FloatingChatbot from "../components/FloatingChatbot";
export default function DashboardLayout({ children }) {
  const user =
    JSON.parse(
      localStorage.getItem("user")
    );
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <div className="fixed left-0 top-0 h-screen w-64 z-50">
        {
          user?.role === "manager"
          ? <ManagerSidebar />
          : <Sidebar />
        }
      </div>
      <div className="flex-1 ml-64 flex flex-col min-w-0">
        <div className="fixed top-0 left-64 right-0 z-40">
          <Navbar />
        </div>
        <main className="mt-20 flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
      <FloatingChatbot />
    </div>
  );
}