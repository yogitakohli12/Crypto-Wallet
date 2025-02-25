"use client";

import { useState } from "react";

export default function EtherConversion() {
  const [ethValue, setEthValue] = useState(""); // User's input for ETH
  const [convertedValues, setConvertedValues] = useState({}); // Calculated conversions
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  // Mapping for full names of cryptocurrencies and fiat currencies
  const currencyFullNames = {
    BTC: "Bitcoin",
    BNB: "Binance Coin",
    SOL: "Solana",
    XRP: "Ripple",
    ADA: "Cardano",
    MATIC: "Polygon",
    LINK: "Chainlink",
    ATOM: "Cosmos",
    USD: "United States Dollar",
    EUR: "Euro",
    GBP: "British Pound",
    INR: "Indian Rupee",
    CAD: "Canadian Dollar",
    AUD: "Australian Dollar",
    JPY: "Japanese Yen",
  };

  // List of cryptocurrencies and fiat currencies
  const cryptoCurrencies = ["BTC", "BNB", "SOL", "XRP", "ADA",   "MATIC",  "LINK",  "ATOM"];
  const fiatCurrencies = ["USD", "EUR", "GBP", "INR", "CAD", "AUD", "JPY"];

  // Function to fetch conversion rates
  const fetchConversionRates = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC,BNB,SOL,XRP,ADA,DOGE,DOT,LTC,AVAX,MATIC,UNI,LINK,TRX,ATOM,USD,EUR,GBP,INR,CAD,AUD,JPY"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch conversion rates.");
      }

      const data = await response.json();
      return data; // Conversion rates for ETH to other cryptocurrencies and fiat currencies
    } catch (error) {
      setError(error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle ETH input change and calculate conversions
  const handleInputChange = async (e) => {
    const value = e.target.value;
    setEthValue(value);

    if (value && !isNaN(value)) {
      const rates = await fetchConversionRates(); // Fetch real-time rates
      if (rates) {
        const results = {};
        Object.keys(rates).forEach((currency) => {
          results[currency] = (value * rates[currency]).toFixed(6); // Calculate conversion
        });
        setConvertedValues(results);
      }
    } else {
      setConvertedValues({});
    }
  };

  // Filter results into crypto and fiat categories
  const cryptoResults = Object.keys(convertedValues).filter((key) => cryptoCurrencies.includes(key));
  const fiatResults = Object.keys(convertedValues).filter((key) => fiatCurrencies.includes(key));

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>ETH to Crypto Converter</h1>
      <div className="cryptocontainer">
        <input
          type="number"
          value={ethValue}
          onChange={handleInputChange}
          placeholder="Enter ETH value"
          className="inputfield"
        />

        {/* Loading and Error Messages */}
        {isLoading && <p>Loading conversion rates...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Display conversion results */}
        <div className="tablecontainer">
          <div>
          <h3>Cryptocurrency Conversions:</h3>
          {cryptoResults.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th className="tabledata th">Cryptocurrency</th>
                  <th className="tabledata th">Symbol</th>
                  <th className="tabledata th">Value</th>
                </tr>
              </thead>
              <tbody>
                {cryptoResults.map((currency) => (
                  <tr key={currency}>
                    <td className="tabledata">{currencyFullNames[currency]}</td>
                    <td className="tabledata">{currency}</td>
                    <td className="tabledata">{convertedValues[currency]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p></p>
          )}
          </div>

         <div>
         <h3>Fiat Currency Conversions:</h3>
          {fiatResults.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th className="tabledata th">Fiat Currency</th>
                  <th className="tabledata th">Symbol</th>
                  <th className="tabledata th">Value</th>
                </tr>
              </thead>
              <tbody>
                {fiatResults.map((currency) => (
                  <tr key={currency}>
                    <td className="tabledata">{currencyFullNames[currency]}</td>
                    <td className="tabledata">{currency}</td>
                    <td className="tabledata">{convertedValues[currency]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p></p>
          )}
         </div>
        </div>
      </div>
    </div>
  );
}
