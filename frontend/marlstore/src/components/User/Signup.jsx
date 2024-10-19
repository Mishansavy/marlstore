// src/components/Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!username || !password) {
      setErrorMessage("Both username and password are required.");
      return false;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!validateForm()) return;

    setLoading(true);

    try {
      await api.post("/api/auth/signup/", { username, password }); // Assuming you have this endpoint
      setSuccessMessage("Signup successful! Please login.");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setErrorMessage("Signup failed. Try a different username.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup container mx-auto my-10 p-6 max-w-md">
      <h1 className="text-3xl font-bold text-center mb-6">Signup</h1>

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-center">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 text-center">
          {successMessage}
        </div>
      )}

      <div className="mb-4">
        <label
          htmlFor="username"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Username
        </label>
        <input
          id="username"
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={loading}
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="password"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={loading}
        />
      </div>

      <button
        onClick={handleSignup}
        disabled={loading}
        className={`w-full px-4 py-2 text-white rounded-md ${
          loading
            ? "bg-indigo-300 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700"
        } transition duration-300`}
      >
        {loading ? "Signing up..." : "Signup"}
      </button>

      <div className="mt-4 text-center">
        <p className="text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-600 hover:underline">
            Log in here.
          </a>
        </p>
      </div>
    </div>
  );
}

export default Signup;
