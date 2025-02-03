import React, { useState, useEffect } from "react";
import { Plus, Trash2, ListTodo } from "lucide-react";
import axios from "axios";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [dashboard, setDashboard] = useState([]); // State for dashboard data
  const [newUser, setNewUser] = useState({ name: "", email: "", number: "" });
  const [error, setError] = useState(null);

  const API_URL = "http://localhost:5000/api"; // Your backend API URL

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users.");
    }
  };

  // Fetch dashboard users from backend
  const fetchDashboard = async () => {
    try {
      const response = await axios.get(`${API_URL}/dashboard-user`); // API request
      setDashboard(response.data); // Set dashboard data
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      setError("Failed to fetch dashboard users.");
    }
  };
  
  const deleteUser = async (id) => {
    try {
      // Send DELETE request to the backend
      await axios.delete(`${API_URL}/user/${id}`);
  
      // Re-fetch the updated user list after deletion
      fetchUsers(); 
      console.log("User deleted with ID:", id);
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Failed to delete user.");
    }
  };


  // Add User
  const addUser = async () => {
    if (
      !newUser.name.trim() ||
      !newUser.email.trim() ||
      !newUser.number.trim()
    ) {
      setError("All fields are required!");
      return;
    }

    const userData = {
      name: newUser.name,
      email: newUser.email,
      phone: newUser.number, // Backend expects "phone", not "number"
    };

    try {
      const response = await axios.post(`${API_URL}/user`, userData, {
        headers: { "Content-Type": "application/json" },
      }); // API request
      console.log("User added:", response.data); // Backend response
      setNewUser({ name: "", email: "", number: "" });
      setError(null);

      // Fetch updated user list
      fetchUsers();
    } catch (error) {
      console.error("Error adding user:", error);
      setError("Failed to add user.");
    }
  };

  

  // Fetch users and dashboard when component mounts
  useEffect(() => {
    fetchUsers();
    fetchDashboard(); // Fetch dashboard data when the component mounts
  }, []);

  return (
    <div className="flex flex-col lg:flex-row h-auto bg-gradient-to-r from-blue-500 via-teal-500 to-purple-600 text-white">
      {/* Sidebar */}
      <aside className="w-full lg:w-80 shadow-xl p-6 lg:h-screen">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <ListTodo size={32} />
          <span className="text-2xl font-semibold">User Management</span>
        </h2>
        <p className="mt-4 text-lg">Manage your users with ease</p>
        <div className="bg-white bg-opacity-10 rounded-xl p-6 shadow-2xl backdrop-blur-md mt-4">
          <h3 className="text-2xl text-white font-semibold mb-6">
            Create-Users
          </h3>
          <ul className="space-y-6">
            {dashboard.map((user) => (
              <li
                key={user.id}
                className="flex items-center justify-between bg-gray-800 p-5 rounded-lg shadow-md hover:shadow-xl transition duration-300"
              >
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-lg text-white font-semibold">
                    {user.name}
                  </span>
                  <span className="text-sm text-gray-400">({user.email})</span>
                  <span className="text-sm text-gray-400">ID: {user._id}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8">
        <h2 className="text-4xl font-semibold text-white mb-8">Manage Users</h2>

        {/* Add User Form */}
        <div className="space-y-6 mb-12 bg-white bg-opacity-20 rounded-xl p-6 shadow-2xl backdrop-blur-md">
          <h3 className="text-2xl text-white font-semibold mb-6">
            Create a New User
          </h3>
          <input
            type="text"
            className="w-full p-4 bg-gray-800 rounded-md shadow-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <input
            type="email"
            className="w-full p-4 bg-gray-800 rounded-md shadow-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <input
            type="text"
            className="w-full p-4 bg-gray-800 rounded-md shadow-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Phone Number"
            value={newUser.number}
            onChange={(e) => setNewUser({ ...newUser, number: e.target.value })}
          />
          <button
            onClick={addUser}
            className="w-full p-4 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition duration-300 text-lg font-semibold items-center flex justify-center gap-2"
          >
            <Plus size={20} className="mr-2" />
            Add User
          </button>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-lg mb-4">{error}</p>}

        {/* Users List */}
        <div className="bg-white bg-opacity-10 rounded-xl p-6 shadow-2xl backdrop-blur-md">
          <h3 className="text-2xl text-white font-semibold mb-6">Login Users</h3>
          <ul className="space-y-6">
            {users.map((user) => (
              <li
                key={user.id}
                className="flex items-center justify-between bg-gray-800 p-5 rounded-lg shadow-md hover:shadow-xl transition duration-300"
              >
               <div className="flex flex-wrap items-center gap-4">
  <span className="text-lg text-white font-semibold w-full sm:w-auto">
    {user.name}
  </span>
  <span className="text-sm text-gray-400 w-full sm:w-auto">
    ({user.email})
  </span>
  <span className="text-sm text-gray-400 w-full sm:w-auto">
    +{user.number}
  </span>
  <span className="text-sm text-gray-400 w-full sm:w-auto">
    ID: {user?._id}
  </span>
</div>

                <button
                  onClick={() => deleteUser(user?._id)}
                  className="text-red-500 hover:text-red-700 transition duration-300"
                >
                  <Trash2 size={20} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
