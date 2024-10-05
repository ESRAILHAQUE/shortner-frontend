import React, { useEffect, useState } from "react";

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  // Fetch all users from the backend
  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/users`
      );
      const data = await response.json();

      if (response.ok) {
        setUsers(data);
      } else {
        setError("Failed to fetch user details.");
      }
    } catch (error) {
      setError("An error occurred while fetching user details.");
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAccept = async (userEmail) => {
    try {
      // Update userType to 'premium' in the backend by email
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/user/users/${userEmail}/premium`,
        {
          method: "PUT",
        }
      );

      if (response.ok) {
        // Update the local state to reflect the change
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.email === userEmail ? { ...user, userType: "premium" } : user
          )
        );
      } else {
        console.error("Failed to update user type");
      }
    } catch (error) {
      console.error("Error updating user type:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 h-screen flex flex-col w-full">
      <h1 className="text-2xl font-bold mb-4 text-black">Manage Users</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {users.length === 0 && !error ? (
        <p className="text-black">No users available.</p>
      ) : (
        <table className="table-auto bg-white rounded-lg shadow-lg w-full">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="p-3">Email</th>
              <th className="p-3">Skype</th>
              <th className="p-3">UserType</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b">
                <td className="p-3 text-center text-black">{user.email}</td>
                <td className="p-3 text-center text-black">{user.skype}</td>
                <td className="p-3 text-center text-black">{user.userType}</td>
                <td className="p-3 text-center text-black">
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleAccept(user.email)}
                    disabled={
                      user.userType === "premium" || user.role === "admin"
                    } // Disable if already premium or admin
                  >
                    {user.userType === "premium" ? "Premium" : "Make Premium"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageUser;
