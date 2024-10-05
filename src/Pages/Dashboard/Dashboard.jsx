import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext"; // Import useAuth to access currentUser
import { useEffect, useState } from "react";

const Dashboard = () => {
  const { currentUser, logout } = useAuth(); // Destructure currentUser and logout
  const [role, setRole] = useState(""); // State to store user role
  const [userType, SetuserType] = useState("");
  console.log(currentUser);

  const handleLogout = async () => {
    try {
      await logout();
      // You can navigate the user back to login after logout if needed
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  // Fetch user role here
  useEffect(() => {
    const fetchUserRoleAndStatus = async () => {
      if (currentUser?.email) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/user/user/role-status/${
              currentUser.email
            }`
          );
          const data = await response.json();

          if (response.ok) {
            setRole(data.role);
            SetuserType(data.userType);
          } else {
            console.error(data.message);
          }
        } catch (error) {
          console.error("Error fetching user role and status:", error);
        }
      }
    };

    fetchUserRoleAndStatus();
  }, [currentUser]);

  return (
    <div className="h-screen flex bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-56  bg-gray-800 fixed h-full">
        <div className="p-4 text-xl font-bold">Foxstocks</div>
        <nav className="mt-40">
          <ul>
          

            <Link to="/shorter">
              <li className="p-3 hover:bg-gray-700">Shorter</li>
            </Link>
            {role === "admin" && (
              <>
                <Link to="/manageuser">
                  <li className="p-3 hover:bg-gray-700">Manage User</li>
                </Link>
              </>
            )}
            

            



            
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 ml-64">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl">
            Hello {currentUser ? currentUser.displayName : "Guest"},
          </h1>
          {currentUser ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Log Out
            </button>
          ) : (
            <Link to="/login">
              <button className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition">
                Login
              </button>
            </Link>
          )}
        </header>

        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
