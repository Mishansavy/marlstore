// src/components/Header.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Get the username from localStorage
  const username = localStorage.getItem("username"); // Store username in localStorage after login

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    // Clear tokens and user data
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    navigate("/login"); // Redirect to login page
  };

  return (
    <header>
      <nav className="navbar flex items-center bg-violet-200 p-4 shadow-lg">
        <div className="max-w-7xl w-full flex justify-between items-center mx-auto">
          <h1 className="font-medium text-xl text-zinc-800">
            <Link to="/">Marl Store</Link>
          </h1>

          {/* Mobile Hamburger Button */}
          <button
            className="md:hidden text-2xl"
            onClick={toggleMobileMenu}
            aria-label="Toggle Menu"
          >
            &#9776; {/* Hamburger Icon */}
          </button>

          {/* Links */}
          <ul
            className={`md:flex gap-10 items-center md:static absolute w-full z-10 pb-10 px-2 md:w-auto bg-violet-200 md:bg-transparent left-0 top-14 transition-transform ${
              isMobileMenuOpen ? "block" : "hidden md:block"
            }`}
          >
            <li className="text-lg font-normal text-zinc-600 p-4 md:p-0">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li className="text-lg font-normal text-zinc-600 p-4 md:p-0">
              <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)}>
                Cart
              </Link>
            </li>

            {/* Conditional Rendering based on Authentication */}
            {username ? (
              <>
                <li className="text-lg font-normal text-black p-4 md:p-0">
                  <span className="font-bold capitalize"> {username}</span>
                </li>
                <li className="text-lg font-normal">
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-3 py-2 ml-4 rounded-md hover:bg-red-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="text-lg font-normal text-zinc-600 p-4 md:p-0">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    Login
                  </Link>
                </li>
                <li className="text-lg font-normal text-zinc-600 p-4 md:p-0">
                  <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    Signup
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Header;
