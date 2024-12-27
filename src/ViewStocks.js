import { useState, useEffect } from "react";

const Portfolio = () => {
  const [stocks, setStocks] = useState([]); // To store the fetched stock data
  const [loading, setLoading] = useState(true); // To show loading state
  const [error, setError] = useState(null); // To store any errors

  useEffect(() => {
    // Function to fetch stock data
    const fetchStocks = async () => {
      try {
        const fetchResponse = await fetch("http://localhost:5000/getStocks", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // If you need to pass userId or token in the headers, you can include it here.
            // "Authorization": `Bearer ${userId}`, // Uncomment and add userId if needed
          },
        });

        const data = await fetchResponse.json(); // Parse JSON response
        console.log("Fetched Data (Raw):", data); // Print the raw response data to the console

        // Check if the data is an array or contains the correct structure
        if (Array.isArray(data)) {
          setStocks(data); // Set the stocks data in state
        } else {
          // If the data is not an array, try to access the stock list
          if (data.stocks && Array.isArray(data.stocks)) {
            setStocks(data.stocks); // Set the stocks from the 'stocks' key
          } else {
            throw new Error(
              "Fetched data does not contain an array of stocks."
            );
          }
        }
      } catch (error) {
        setError(error.message); // Handle error
      } finally {
        setLoading(false); // Set loading to false when request is complete
      }
    };

    fetchStocks(); // Call the fetch function when component mounts
  }, []); // Empty dependency array means this effect runs only once when the component mounts

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Your Portfolio</h1>
      {stocks.length > 0 ? (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Stock Name</th>
              <th style={styles.tableHeader}>Quantity</th>
              <th style={styles.tableHeader}>Buy Price</th>
              <th style={styles.tableHeader}>Current Price</th>
              <th style={styles.tableHeader}>Total Value</th>
              <th style={styles.tableHeader}>Percentage Gain</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock, index) => (
              <tr
                key={index}
                style={
                  index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
                }
              >
                <td style={styles.tableCell}>{stock.name}</td>
                <td style={styles.tableCell}>{stock.quantity}</td>
                <td style={styles.tableCell}>{stock.buy_price}</td>
                <td style={styles.tableCell}>{stock.current_price}</td>
                <td style={styles.tableCell}>{stock.total_value}</td>
                <td style={styles.tableCell}>{stock.percentage_gain}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={styles.noStocks}>No stocks available</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    margin: "20px",
    padding: "10px",
    fontFamily: "'Arial', sans-serif",
  },
  heading: {
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    margin: "20px 0",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  },
  tableHeader: {
    padding: "12px 15px",
    textAlign: "left",
    borderBottom: "1px solid #ddd",
    backgroundColor: "#2c3e50",
    color: "white",
    fontWeight: "bold",
  },
  tableRowEven: {
    backgroundColor: "#f2f2f2",
  },
  tableRowOdd: {
    backgroundColor: "#ffffff",
  },
  tableCell: {
    padding: "12px 15px",
    textAlign: "center",
    borderBottom: "1px solid #ddd",
  },
  noStocks: {
    textAlign: "center",
    fontSize: "16px",
    color: "#7f8c8d",
  },
};

export default Portfolio;
