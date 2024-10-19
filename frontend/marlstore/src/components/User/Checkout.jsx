import React, { useState } from "react";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const [address, setAddress] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || []; // Safeguard against null
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ); // Adjust to include item quantity

    if (!address) {
      setError("Address is required");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      const response = await api.post(
        "/order/checkout/",
        {
          address,
          total_price: totalPrice,
          items: cartItems.map((item) => ({
            product_id: item.product.id,
            quantity: item.quantity, // Include quantity for each item
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        localStorage.removeItem("cart"); // Clear the cart upon successful order placement
        alert("Order placed successfully!");
        navigate("/"); // Redirect to home or order confirmation page
      }
    } catch (error) {
      console.error("Order placement failed:", error);
      setError("Failed to place the order. Please try again.");
    }
  };

  return (
    <div className="checkout container mx-auto my-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold mb-6">Checkout</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <label className="block text-lg font-medium text-gray-700 mb-2">
        Shipping Address:
      </label>
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        placeholder="Enter your shipping address"
      />

      <button
        onClick={handleCheckout}
        className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Place Order
      </button>
    </div>
  );
}

export default Checkout;
