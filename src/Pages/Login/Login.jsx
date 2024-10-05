import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext"; // Import the useAuth hook to use Firebase auth

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Error handling state
  const [loading, setLoading] = useState(false); // To prevent multiple submissions
  const { login } = useAuth(); // Get login function from AuthContext
  const navigate = useNavigate(); // For redirecting after successful login

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      setLoading(true);
      await login(email, password); // Call Firebase login function
      navigate("/"); // Redirect to dashboard after successful login
    } catch (error) {
      setError("Failed to log in. Please check your email and password."); // Handle login errors
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-12 pb-36 bg-gradient-to-r from-blue-400 to-purple-600 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 text-black"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 text-black"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-3 rounded-lg font-semibold hover:bg-indigo-600 transition duration-300"
            disabled={loading} // Disable button while logging in
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link
              to={"/signup"}
              className="text-indigo-500 font-semibold hover:underline"
            >
              {" "}
              Sign up{" "}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
