import React, { useEffect, useState } from "react";

const ManageUser = () => {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");

  // Fetch all payment information from the backend
   const fetchPayments = async () => {
     try {
       const response = await fetch(
         `${import.meta.env.VITE_BACKEND_URL}/api/payment/payments`
       );
       const data = await response.json();

       if (response.ok) {
         setPayments(data);
       } else {
         setError("Failed to fetch payment details frontent");
       }
     } catch (error) {
       setError("An error occurred while fetching payment details");
       console.error("Error:", error);
     }
   };
  useEffect(() => {
   

    fetchPayments();
  }, []);

  const handleAccept = async (userEmail) => {
    try {
      // Update userType to 'premium' in the backend by email
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/${userEmail}/premium`,
        {
          method: "PUT",
        }
      );

      if (response.ok) {
        // Update the local state to reflect the change
        setPayments((prevPayments) =>
          prevPayments.map((payment) =>
            payment.email === userEmail ? { ...payment, userType: "premium" } : payment
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
      <h1 className="text-2xl font-bold mb-4 text-black">Manage User Payments</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {payments.length === 0 && !error ? (
        <p className="text-black">No payment records available.</p>
      ) : (
        <table className="table-auto bg-white rounded-lg shadow-lg w-full ">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="p-3">Email</th>
              <th className="p-3">Mobile Number</th>
              <th className="p-3">Transaction ID</th>
              <th className="p-3">Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id} className="border-b">
                <td className="p-3 text-center text-black">{payment.email}</td>
                <td className="p-3 text-center text-black">{payment.mobileNumber}</td>
                <td className="p-3 text-center text-black">{payment.trxnId}</td>
                <td className="p-3 text-center text-black">
                  {new Date(payment.createdAt).toLocaleDateString()}
                </td>
                <td>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleAccept(payment.email)}
                    disabled={payment.userType === "premium"} // Disable button if userType is already premium
                  >
                    {payment.userType === "premium" ? "Accepted" : "Accept"}
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
