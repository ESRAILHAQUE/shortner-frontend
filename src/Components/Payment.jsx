import React, { useState } from "react";
import { useAuth } from "../hooks/AuthContext"; // Assuming you have a useAuth hook

const Payment = () => {
  const { currentUser } = useAuth(); // Get the current authenticated user
  const [mobileNumber, setMobileNumber] = useState("");
  const [trxnId, setTrxnId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if currentUser and email are available
    if (!currentUser?.email) {
      setError("No authenticated user. Please log in.");
      return;
    }

    // Validate the mobile number (for example: length and number format)
    if (!/^\d{11}$/.test(mobileNumber)) {
      setError("Please enter a valid 11-digit mobile number");
      return;
    }

    // Validate the transaction ID (custom validation)
    if (!trxnId) {
      setError("Please enter a valid transaction ID");
      return;
    }

    try {
      // If validations pass, clear the error
      setError("");
      setSuccess(""); // Reset success message before new request

      // Send the form data to the backend
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/payment/submitPayment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: currentUser.email,
            mobileNumber,
            trxnId,
          }), // Email taken from current authenticated user
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess("Payment details submitted successfully!");
      } else {
        setError(data.message || "Failed to submit payment details");
      }
    } catch (error) {
      setError("An error occurred while submitting payment details");
      console.error("Error:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Payment</h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="mobileNumber" className="block text-gray-700">
              Mobile Number
            </label>
            <input
              type="text"
              id="mobileNumber"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-black"
              placeholder="Enter your mobile number"
              required
            />
          </div>

          <div>
            <label htmlFor="trxnId" className="block text-gray-700">
              Transaction ID (TrxnId)
            </label>
            <input
              type="text"
              id="trxnId"
              value={trxnId}
              onChange={(e) => setTrxnId(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-black"
              placeholder="Enter your transaction ID"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
          >
            Submit Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;
