import React, { useState } from "react";

const Signup = ({ onSignup }) => {
  const [name, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    if (name && email && phone_number && password) {
      // Send the data to the backend (don't send the secret word here)
      const userData = { name, email, phone_number, password };
      fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
        .then((response) => response.json())
        .then((data) => {
          onSignup();
          console.log(data.message); // Handle response from server
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      alert("Please fill in all fields");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "black",
        color: "white",
        padding: "20px",
        maxWidth: "400px",
        margin: "0 auto",
      }}
    >
      <h2>Signup</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        style={{
          marginBottom: "10px",
          width: "100%",
          padding: "8px",
          color: "black",
        }}
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        style={{
          marginBottom: "10px",
          width: "100%",
          padding: "8px",
          color: "black",
        }}
      />
      <input
        type="tel"
        value={phone_number}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="Phone Number"
        style={{
          marginBottom: "10px",
          width: "100%",
          padding: "8px",
          color: "black",
        }}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        style={{
          marginBottom: "10px",
          width: "100%",
          padding: "8px",
          color: "black",
        }}
      />
      <button
        onClick={handleSignup}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Signup
      </button>
    </div>
  );
};

export default Signup;
