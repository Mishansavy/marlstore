import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/User/Header";
import ProductList from "./components/User/ProductList";
import ProductDetail from "./components/User/ProductDetail";
import Cart from "./components/User/Cart";
import Checkout from "./components/User/Checkout";
import Login from "./components/User/Login";
import Signup from "./components/User/Signup";
import { HeroSection } from "./components/User/HeroSection/HeroSection";
import { Order } from "./components/Order";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<HeroSection />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/orders" element={<Order />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
