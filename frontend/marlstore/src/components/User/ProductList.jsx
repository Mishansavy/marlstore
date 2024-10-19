import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products/");
        setProducts(response.data);
        console.log(products);
      } catch (error) {
        console.error(error);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Helper function to format the price
  const formatPrice = (price) => {
    return price.toLocaleString("en-NP", {
      style: "currency",
      currency: "NPR",
    });
  };

  if (loading) {
    return <div className="text-center my-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 my-10">{error}</div>;
  }

  return (
    <>
      <div className="product-list max-w-wrapper mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-10">
        {products.map((product) => (
          <div
            className="product bg-white text-gray-700 rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105 p-6"
            key={product.id}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-56 object-cover rounded-t-lg"
            />
            <h2 className="text-lg font-semibold mt-4">{product.name}</h2>
            <p className="text-sm text-gray-500 my-2">
              {formatPrice(product.price)}
            </p>
            <Link
              to={`/products/${product.id}`}
              className="text-red-600 hover:underline"
              aria-label={`View details about ${product.name}`}
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}

export default ProductList;
