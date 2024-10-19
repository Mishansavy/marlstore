// import React, { useState, useEffect, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { api } from "../../services/api";
// import { refreshAccessToken } from "../../services/auth";

// function ProductDetail() {
//   const { id } = useParams();
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [zoomPosition, setZoomPosition] = useState({
//     backgroundPosition: "0% 0%",
//   });
//   const [isZoomVisible, setIsZoomVisible] = useState(false);
//   const imageRef = useRef();
//   const navigate = useNavigate();
//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         await refreshAccessToken(); // Refresh token if needed
//         const response = await api.get(`/products/${id}/`); // Fetch product details
//         setProduct(response.data);
//       } catch (error) {
//         console.error(error);
//         setError("Failed to load product. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProduct();
//   }, [id]);

//   const formatPrice = (price) => {
//     return price.toLocaleString("en-NP", {
//       style: "currency",
//       currency: "NPR",
//     });
//   };

//   const handleMouseMove = (e) => {
//     const { offsetWidth, offsetHeight } = imageRef.current;
//     const { offsetX, offsetY } = e.nativeEvent;

//     const xPos = (offsetX / offsetWidth) * 100;
//     const yPos = (offsetY / offsetHeight) * 100;

//     setZoomPosition({
//       backgroundPosition: `${xPos}% ${yPos}%`,
//     });
//   };

//   const handleMouseEnter = () => setIsZoomVisible(true);
//   const handleMouseLeave = () => setIsZoomVisible(false);

//   const addToCart = async () => {
//     try {
//       await refreshAccessToken(); // Refresh token if needed
//       // API call to add product to cart
//       await api.post("/cart/add/", { product_id: product.id });
//       alert("Product added to cart!");
//     } catch (error) {
//       console.error(error);
//       alert("Failed to add product to cart.");
//     }
//   };

//   const buyNow = async () => {
//     try {
//       await refreshAccessToken(); // Refresh token if needed
//       // API call to buy the product directly
//       await api.post(`/order/buy_now/${product.id}/`);
//       alert("Order placed successfully!");
//       navigate("/orders"); // Navigate to orders or another page
//     } catch (error) {
//       console.error(error);
//       alert("Failed to place order.");
//     }
//   };

//   if (loading) return <div className="text-center my-10">Loading...</div>;
//   if (error)
//     return <div className="text-center text-red-500 my-10">{error}</div>;

//   return (
//     <div className="product-detail container mx-auto my-10 p-6 flex flex-col md:flex-row gap-8">
//       <div
//         className="product-image flex-1 relative"
//         onMouseMove={handleMouseMove}
//         onMouseEnter={handleMouseEnter}
//         onMouseLeave={handleMouseLeave}
//       >
//         <img
//           ref={imageRef}
//           src={product.image}
//           alt={product.name}
//           className="w-full h-auto object-cover rounded-lg shadow-md"
//         />

//         {isZoomVisible && (
//           <div className="magnified-image absolute top-0 left-full ml-4 w-64 h-64 rounded-lg shadow-lg bg-no-repeat bg-cover border border-gray-200">
//             <div
//               style={{
//                 backgroundImage: `url(${product.image})`,
//                 backgroundPosition: zoomPosition.backgroundPosition,
//                 transform: "scale(1.5)",
//                 backgroundSize: "200%",
//               }}
//               className="w-full h-full"
//             />
//           </div>
//         )}
//       </div>

//       <div className="product-info flex-1">
//         <h2 className="text-3xl font-bold text-gray-800 mb-4">
//           {product.name}
//         </h2>
//         <p className="text-gray-600 text-lg mb-6">{product.description}</p>
//         <p className="text-2xl text-red-600 font-semibold mb-6">
//           {formatPrice(product.price)}
//         </p>

//         <button
//           onClick={addToCart}
//           className="bg-blue-600 text-white px-6 py-3 mr-8 rounded-md hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
//         >
//           Add to Cart
//         </button>
//         <button
//           onClick={buyNow}
//           className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
//         >
//           Buy Now
//         </button>
//       </div>
//     </div>
//   );
// }

// export default ProductDetail;
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { refreshAccessToken } from "../../services/auth";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoomPosition, setZoomPosition] = useState({
    backgroundPosition: "0% 0%",
  });
  const [isZoomVisible, setIsZoomVisible] = useState(false);
  const imageRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      // Check if the access token exists in local storage
      const accessToken = localStorage.getItem("access_token");
      console.log(accessToken);

      try {
        // If token exists, try to refresh it
        if (accessToken) {
          await refreshAccessToken(navigate);
        }

        // Fetch the product details regardless of token presence
        const response = await api.get(`/products/${id}/`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to load product. Please try again.");
        // Optionally handle token removal here if necessary
        // localStorage.removeItem("access_token");
        // localStorage.removeItem("refresh_token");
        // navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const formatPrice = (price) => {
    return price.toLocaleString("en-NP", {
      style: "currency",
      currency: "NPR",
    });
  };

  const handleMouseMove = (e) => {
    const { offsetWidth, offsetHeight } = imageRef.current;
    const { offsetX, offsetY } = e.nativeEvent;

    const xPos = (offsetX / offsetWidth) * 100;
    const yPos = (offsetY / offsetHeight) * 100;

    setZoomPosition({
      backgroundPosition: `${xPos}% ${yPos}%`,
    });
  };

  const handleMouseEnter = () => setIsZoomVisible(true);
  const handleMouseLeave = () => setIsZoomVisible(false);

  const addToCart = async () => {
    try {
      const newAccessToken = await refreshAccessToken(navigate);
      if (newAccessToken) {
        api.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
        // await api.post("/cart/add/", { product_id: product.id });
        await api.post(`/cart/add/${product.id}/`);
        // alert("Product added to cart!");
        navigate("/cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add product to cart.");
    }
  };

  const buyNow = async () => {
    try {
      const newAccessToken = await refreshAccessToken(navigate);
      if (newAccessToken) {
        api.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
        await api.post(`/order/buy_now/${product.id}/`);
        alert("Order placed successfully!");
        navigate("/orders");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order.");
    }
  };

  if (loading) return <div className="text-center my-10">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500 my-10">{error}</div>;

  return (
    <div className="product-detail container mx-auto my-10 p-6 flex flex-col md:flex-row gap-8">
      <div
        className="product-image flex-1 relative"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          ref={imageRef}
          src={product.image}
          alt={product.name}
          className="w-full h-auto object-cover rounded-lg shadow-md"
        />

        {isZoomVisible && (
          <div className="magnified-image absolute top-0 left-full ml-4 w-64 h-64 rounded-lg shadow-lg bg-no-repeat bg-cover border border-gray-200">
            <div
              style={{
                backgroundImage: `url(${product.image})`,
                backgroundPosition: zoomPosition.backgroundPosition,
                transform: "scale(1.5)",
                backgroundSize: "200%",
              }}
              className="w-full h-full"
            />
          </div>
        )}
      </div>

      <div className="product-info flex-1">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          {product.name}
        </h2>
        <p className="text-gray-600 text-lg mb-6">{product.description}</p>
        <p className="text-2xl text-red-600 font-semibold mb-6">
          {formatPrice(product.price)}
        </p>

        <button
          onClick={addToCart}
          className="bg-blue-600 text-white px-6 py-3 mr-8 rounded-md hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Add to Cart
        </button>
        <button
          onClick={buyNow}
          className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;
