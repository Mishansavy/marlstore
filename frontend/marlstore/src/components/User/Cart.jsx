import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [message, setMessage] = useState("");
  const [removeitem, setRemoveItem] = useState("");
  const navigate = useNavigate();

  // Fetch cart items from the backend
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await api.get("/cart/"); // Fetch cart items
        setCartItems(response.data.items);
        calculateTotalPrice(response.data.items); // Calculate total based on fetched items
        setMessage("");
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setMessage("Failed to load cart items.");
      }
    };

    fetchCartItems();
  }, []);

  const calculateTotalPrice = (items) => {
    const total = items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
    setTotalPrice(total);
  };

  const removeFromCart = async (itemId) => {
    const confirmRemoval = window.confirm(
      "Are you sure you want to remove this item?"
    );
    if (confirmRemoval) {
      try {
        const response = await api.delete(`/cart/remove/${itemId}/`); // Remove item from backend
        setCartItems(cartItems.filter((item) => item.id !== itemId)); // Update state
        setRemoveItem(response.data.message);
      } catch (error) {
        console.error("Error removing item:", error);
        setMessage("Failed to remove item from cart.");
      }
    }
  };

  const proceedToCheckout = () => {
    if (cartItems.length > 0) {
      navigate("/checkout"); // Redirect to checkout page
    } else {
      setMessage("Your cart is empty!");
    }
  };

  return (
    <div className="cart container mx-auto my-10 p-6 bg-gray-50 shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold mb-6">Your Cart</h1>

      {/* Display message  */}
      {message && (
        <div className="text-center mb-4 text-red-600">{message}</div>
      )}

      {cartItems.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-600 text-lg">Your cart is empty.</p>
          <Link
            to="/products"
            className="text-blue-600 hover:underline mt-4 inline-block text-lg"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <ul className="space-y-6">
            {cartItems.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md"
              >
                <img
                  src={item.image}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-md"
                />

                <div className="flex-1 ml-4">
                  <h2 className="font-semibold text-black text-base mb-3 ">
                    {item.product}
                  </h2>
                  <p className="text-red-600 text-lg">
                    Price:{" "}
                    <span className="text-base">
                      NRP {item.price} x {item.quantity}
                    </span>
                  </p>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-8 text-right">
            <h3 className="text-3xl font-bold mb-4">
              Total: NRP {totalPrice.toFixed(2)}
            </h3>

            {/* Display message  */}
            {removeitem && (
              <div className="text-center mb-4 text-red-600">{removeitem}</div>
            )}

            <button
              onClick={proceedToCheckout}
              className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Proceed to Checkout
            </button>
          </div>

          <div className="mt-4 text-right">
            <Link
              to="/products"
              className="text-blue-600 hover:underline text-lg"
            >
              Continue Shopping
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
