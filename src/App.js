// import React, { useState } from "react";
// import Login from "./Login";
// import Signup from "./Signup";
// import PortfolioManager from "./Data";
// import StockTable from "./ViewStocks";

// const App = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [isSignup, setIsSignup] = useState(false); // Track if the user is on the signup page

//   const handleLogin = () => {
//     setIsLoggedIn(true);
//   };

//   const handleSignup = () => {
//     console.log("Signup successful! Redirecting to login..."); // Debug log
//     setIsSignup(false); // Redirect to Login page
//   };

//   const handleTogglePage = () => {
//     setIsSignup(!isSignup); // Toggle between Signup and Login
//   };

//   return (
//     <div>
//       {!isLoggedIn ? (
//         <div>
//           {isSignup ? (
//             <Signup onSignup={handleSignup} />
//           ) : (
//             <Login onLogin={handleLogin} />
//           )}
//           <button
//             onClick={handleTogglePage}
//             style={{
//               marginTop: "10px",
//               padding: "10px 20px",
//               backgroundColor: "#007BFF",
//               color: "white",
//               border: "none",
//               borderRadius: "4px",
//               cursor: "pointer",
//             }}
//           >
//             {isSignup
//               ? "Already have an account? Login"
//               : "Need an account? Signup"}
//           </button>
//         </div>
//       ) : (
//         <PortfolioManager />
//       )}
//     </div>
//   );
// };

// export default App;
import { useState, useEffect } from "react";
import axios from "axios";
import Portfolio from "./New";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [authForm, setAuthForm] = useState({ email: "", password: "" });
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get("http://localhost:5000/auth/status", {
        withCredentials: true,
      });
      setIsAuthenticated(response.data.isAuthenticated);
    } catch (err) {
      setIsAuthenticated(false);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? "/login" : "/signup";
      await axios.post(`http://localhost:5000${endpoint}`, authForm, {
        withCredentials: true,
      });
      setIsAuthenticated(true);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Authentication failed");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/logout",
        {},
        { withCredentials: true }
      );
      setIsAuthenticated(false);
    } catch (err) {
      setError("Logout failed");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6">
            {isLogin ? "Login" : "Sign Up"}
          </h2>

          {error && (
            <div className="bg-red-100 text-red-900 p-4 rounded-lg mb-4">
              <div className="text-sm">{error}</div>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={authForm.email}
                onChange={(e) =>
                  setAuthForm({ ...authForm, email: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={authForm.password}
                onChange={(e) =>
                  setAuthForm({ ...authForm, password: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>

          <button
            onClick={() => setIsLogin(!isLogin)}
            className="w-full mt-4 text-blue-500 hover:text-blue-600"
          >
            {isLogin ? "Need an account? Sign up" : "Have an account? Login"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Portfolio Tracker</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4">
        <Portfolio />
      </main>
    </div>
  );
};

export default App;
