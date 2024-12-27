import React, { useState, useEffect } from "react";
import axios from "axios";

const PortfolioManager = () => {
  const [stockId, setStockId] = useState("");
  const [stocks, setStocks] = useState([]);
  const [stockName, setStockName] = useState("");
  const [selectedTicker, setSelectedTicker] = useState("");
  const [quantity, setQuantity] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [message, setMessage] = useState("");
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [topStock, setTopStock] = useState(null);
  const [editIndex, setEditIndex] = useState(null); // Index for the stock to be edited
  const [newStockName, setNewStockName] = useState(""); // New stock name to edit
  const [newTicker, setNewTicker] = useState(""); // New ticker to edit
  const [newQuantity, setNewQuantity] = useState(""); // New quantity to edit
  const [newBuyPrice, setNewBuyPrice] = useState(""); // New buy price to edit

  const handleStockNameChange = (e) => setStockName(e.target.value);
  const handleTickerChange = (e) => setSelectedTicker(e.target.value);
  const handleQuantityChange = (e) => setQuantity(e.target.value);
  const handleBuyPriceChange = (e) => setBuyPrice(e.target.value);

  const handleSearch = async () => {
    if (
      stockName === "" ||
      selectedTicker === "" ||
      quantity === "" ||
      buyPrice === ""
    ) {
      setMessage("Please fill in all fields.");
      return;
    }

    const API_KEY = "ctl8fp1r01qn6d7kfungctl8fp1r01qn6d7kfuo0";
    const URL = `https://finnhub.io/api/v1/quote?symbol=${selectedTicker.toUpperCase()}&token=${API_KEY}`;

    try {
      const response = await axios.get(URL);
      if (response.data) {
        const stockData = response.data;
        const totalValue = quantity * stockData.c;
        const percentageGain = ((stockData.c - buyPrice) / buyPrice) * 100;
        const dataToSend = {
          name: stockName,
          ticker: selectedTicker,
          quantity: quantity,
          buy_price: buyPrice,
          current_price: stockData.c,
          total_value: totalValue,
          percentage_gain: percentageGain.toFixed(2),
        };

        // Use await here for the fetch request
        const fetchResponse = await fetch("http://localhost:5000/addStock", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        });

        const responseText = await fetchResponse.text();
        console.log("Success:", responseText);

        const newStock = {
          name: stockName,
          ticker: selectedTicker,
          quantity: quantity,
          buyPrice: buyPrice,
          currentPrice: stockData.c,
          totalValue: totalValue,
          percentageGain: percentageGain.toFixed(2),
        };

        const updatedStocks = [...stocks, newStock];
        setStocks(updatedStocks);

        const newPortfolioValue = updatedStocks.reduce(
          (sum, stock) => sum + stock.totalValue,
          0
        );
        setPortfolioValue(newPortfolioValue);

        const topPerformingStock = updatedStocks.reduce((max, stock) =>
          stock.percentageGain > max.percentageGain ? stock : max
        );
        setTopStock(topPerformingStock);

        setMessage("");
      } else {
        setMessage("No stock price data found.");
      }
    } catch (error) {
      setMessage("Error fetching stock price.");
      console.error("Error fetching stock price:", error);
    }
  };

  const handleEditStock = (index) => {
    const stockToEdit = stocks[index];
    setEditIndex(index);
    setNewStockName(stockToEdit.name);
    setNewTicker(stockToEdit.ticker);
    setNewQuantity(stockToEdit.quantity);
    setNewBuyPrice(stockToEdit.buyPrice);
    setStockId(stockToEdit.id);
  };

  const handleSaveEdit = async () => {
    if (newQuantity === "" || newQuantity <= 0 || newBuyPrice === "") {
      setMessage("Please enter valid values.");
      return;
    }

    const updatedStocks = [...stocks];
    const stockToEdit = updatedStocks[editIndex];

    stockToEdit.name = newStockName;
    stockToEdit.ticker = newTicker;
    stockToEdit.quantity = newQuantity;
    stockToEdit.buyPrice = newBuyPrice;
    stockToEdit.totalValue = newQuantity * stockToEdit.currentPrice; // Calculate total value
    stockToEdit.percentageGain =
      ((stockToEdit.currentPrice - stockToEdit.buyPrice) /
        stockToEdit.buyPrice) *
      100; // Calculate percentage gain

    updatedStocks[editIndex] = stockToEdit;
    setStocks(updatedStocks);

    const newPortfolioValue = updatedStocks.reduce(
      (sum, stock) => sum + stock.totalValue,
      0
    );
    setPortfolioValue(newPortfolioValue);

    const topPerformingStock = updatedStocks.reduce((max, stock) =>
      stock.percentageGain > max.percentageGain ? stock : max
    );
    setTopStock(topPerformingStock);

    // Prepare the data to send to the backend
    const updatedStockData = {
      name: newStockName,
      ticker: newTicker,
      quantity: newQuantity,
      buy_price: newBuyPrice,
      total_value: stockToEdit.totalValue,
      percentage_gain: stockToEdit.percentageGain.toFixed(2), // Send percentage gain as a fixed decimal
    };
    console.log(updatedStockData);

    try {
      const response = await fetch("http://localhost:5000/updateStock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedStockData),
      });

      const responseText = await response.text();
      console.log("Update Success:", responseText);
      setMessage("Stock updated successfully.");
    } catch (error) {
      console.error("Error updating stock:", error);
      setMessage("Error updating stock.");
    }

    // Reset form fields
    setEditIndex(null);
    setNewStockName(""); // Reset the new stock name field
    setNewTicker(""); // Reset the new ticker field
    setNewQuantity(""); // Reset the new quantity field
    setNewBuyPrice(""); // Reset the new buy price field
    setMessage(""); // Clear the message
  };

  return (
    <div
      style={{
        backgroundColor: "black",
        padding: "20px",
        maxWidth: "800px",
        margin: "0 auto",
        color: "white",
      }}
    >
      <h2>Manage Portfolio</h2>

      {/* Stock entry form */}
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="stock-name" style={{ color: "white" }}>
          Stock Name:{" "}
        </label>
        <input
          id="stock-name"
          type="text"
          value={stockName}
          onChange={handleStockNameChange}
          placeholder="Enter stock name (e.g., Tesla)"
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            color: "black",
          }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="stock-ticker" style={{ color: "white" }}>
          Ticker:{" "}
        </label>
        <input
          id="stock-ticker"
          type="text"
          value={selectedTicker}
          onChange={handleTickerChange}
          placeholder="Enter ticker (e.g., TSLA)"
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            color: "black",
          }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="quantity" style={{ color: "white" }}>
          Quantity:{" "}
        </label>
        <input
          id="quantity"
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          placeholder="Enter quantity"
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            color: "black",
          }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="buy-price" style={{ color: "white" }}>
          Buy Price:{" "}
        </label>
        <input
          id="buy-price"
          type="number"
          value={buyPrice}
          onChange={handleBuyPriceChange}
          placeholder="Enter buy price"
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            color: "black",
          }}
        />
      </div>

      <button
        onClick={handleSearch}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Add Stock to Portfolio
      </button>

      {message && <p style={{ color: "red", marginTop: "10px" }}>{message}</p>}

      {/* Portfolio Table */}
      <div style={{ marginTop: "20px" }}>
        <h3>Your Portfolio</h3>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "20px",
          }}
        >
          <thead>
            <tr>
              <th>Stock Name</th>
              <th>Ticker</th>
              <th>Quantity</th>
              <th>Buy Price</th>
              <th>Current Price</th>
              <th>Total Value</th>
              <th>Percentage Gain</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock, index) => (
              <tr key={index}>
                <td>{stock.name}</td>
                <td>{stock.ticker}</td>
                <td>{stock.quantity}</td>
                <td>{stock.buyPrice}</td>
                <td>{stock.currentPrice}</td>
                <td>{stock.totalValue}</td>
                <td>{stock.percentageGain}%</td>
                <td>
                  <button
                    onClick={() => handleEditStock(index)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#FFA500",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <p>Total Portfolio Value: {portfolioValue}</p>
          {topStock && (
            <p>
              Top Performing Stock: {topStock.name} ({topStock.percentageGain}%)
            </p>
          )}
        </div>
      </div>

      {/* Edit Form (if editing) */}
      {editIndex !== null && (
        <div
          style={{
            marginTop: "20px",
            border: "1px solid #ccc",
            padding: "20px",
          }}
        >
          <h4>Edit Stock</h4>
          <div>
            <label>Stock Name: </label>
            <input
              type="text"
              value={newStockName}
              onChange={(e) => setNewStockName(e.target.value)}
            />
          </div>
          <div>
            <label>Ticker: </label>
            <input
              type="text"
              value={newTicker}
              onChange={(e) => setNewTicker(e.target.value)}
            />
          </div>
          <div>
            <label>Quantity: </label>
            <input
              type="number"
              value={newQuantity}
              onChange={(e) => setNewQuantity(e.target.value)}
            />
          </div>
          <div>
            <label>Buy Price: </label>
            <input
              type="number"
              value={newBuyPrice}
              onChange={(e) => setNewBuyPrice(e.target.value)}
            />
          </div>
          <button
            onClick={handleSaveEdit}
            style={{
              padding: "10px 20px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default PortfolioManager;
