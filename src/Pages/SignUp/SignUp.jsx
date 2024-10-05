import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext"; // Import Firebase authentication context
import { sendEmailVerification } from "firebase/auth"; // Import sendEmailVerification from Firebase

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [skype, setSkype] = useState(""); // Declare Skype state
  const [error, setError] = useState(""); // To handle errors
  const [loading, setLoading] = useState(false); // To prevent multiple submissions
  const [message, setMessage] = useState(""); // To show success messages
  const { signup } = useAuth(); // Get the signup function from AuthContext
  const navigate = useNavigate(); // For redirecting after signup

  const handleSignup = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    // Check if passwords match
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);
      const userCredential = await signup(email, password); // Call Firebase signup function

      // Send verification email
      await sendEmailVerification(userCredential.user);

      // Send user info to the backend
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          role: "user", // Assuming default role is user
          userType: "free", // Default status
          skype: skype, // Include Skype in the request
        }),
      });

      setMessage("Verification email sent! Please check your inbox.");
      setTimeout(() => navigate("/login"), 5000); // Redirect to login after a few seconds
    } catch (error) {
      setError("Failed to create an account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4  bg-gradient-to-r from-green-400 to-blue-600 flex items-center justify-center ">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-6">
            {message}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="skype" className="block text-gray-700">
              Skype
            </label>
            <input
              type="text"
              id="skype"
              value={skype}
              onChange={(e) => setSkype(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-black"
              placeholder="Enter your Skype ID or link"
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
              className="w-full p-3 mt-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              placeholder="Enter your password"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-black"
              placeholder="Confirm your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition duration-300"
            disabled={loading} // Disable button while loading
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              to={"/login"}
              className="text-green-500 font-semibold hover:underline"
            >
              {" "}
              Log in{" "}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
