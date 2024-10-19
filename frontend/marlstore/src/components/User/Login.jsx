// src/components/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setErrorMessage("Please enter both username and password.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await api.post("/api/auth/login/", {
        username,
        password,
      });

      // Store the tokens in localStorage
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      localStorage.setItem("username", username);

      // Redirect to homepage or another route after login
      navigate("/");
    } catch (error) {
      setErrorMessage("Login failed: Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login container mx-auto my-10 p-6 max-w-sm">
      <h1 className="text-3xl font-bold text-center mb-6">Login</h1>

      {errorMessage && (
        <div className="text-red-600 mb-4 text-center">{errorMessage}</div>
      )}

      <div className="mb-4">
        <label
          htmlFor="username"
          className="block text-gray-700 text-sm font-semibold mb-2"
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
          className="block text-gray-700 text-sm font-semibold mb-2"
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
        onClick={handleLogin}
        disabled={loading}
        className={`w-full px-4 py-2 text-white rounded-md ${
          loading
            ? "bg-indigo-300 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700"
        } transition duration-300`}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <div className="mt-4 text-center">
        <p className="text-gray-600">
          Don't have an account?{" "}
          <a href="/signup" className="text-indigo-600 hover:underline">
            Sign up here.
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
