import React, { useEffect, useState } from "react";
import { api } from "../services/api";

export const Order = () => {
  const [orderitem, setOrderItem] = useState([]);
  const [message, setMessage] = useState("");
  // Fetch order items from the backend
  useEffect(() => {
    const fetchOrderItems = async () => {
      try {
        const response = await api.get("/orders/"); // Fetch order items
        setOrderItem(response);
        console.log(orderitem);
        setMessage("");
      } catch (error) {
        console.error("Error fetching order items:", error);
        setMessage("Failed to load order items.");
      }
    };

    fetchOrderItems();
  }, []);

  return (
    <>
      <div className="cart container mx-auto my-10 p-6 bg-gray-50 shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold mb-6 text-black">Your Orders</h1>
        {message && <p className="text-red-500">{message}</p>}
        <ul className="space-y-6">
          {orderitem.length > 0 ? (
            orderitem.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md"
              >
                <p className="text-red-600 text-lg">
                  Price:{" "}
                  <span className="text-base">NRP {item.total_price}</span>
                </p>
              </li>
            ))
          ) : (
            <p className="text-gray-600">No orders found.</p>
          )}
        </ul>
      </div>
    </>
  );
};
