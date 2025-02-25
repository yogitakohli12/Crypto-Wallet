"use client";
import { useState } from "react";
import { connectWallet, getBalance, getTransactionHistory,sendtransaction } from "../utils/wallet";
import Etherconversion from './Components/Etherconversion'
export default function Home() {
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState("0");
  const [transactions, setTransactions] = useState([]);
  const [Eth, setEth] = useState("");
  const [reciveraddress, setreciveraddress] = useState("");

 
  const handleConnect = async () => {
    const account = await connectWallet();
    if (account) {
      setWallet(account);
      const userBalance = await getBalance(account);
      setBalance(userBalance);
      // ✅ Fetch transaction history
      const historyY = await getTransactionHistory(account);
      setTransactions(historyY);
    }
  };

  // ✅ Disconnect Wallet Function
  const disconnectWallet = async () => {
    setWallet(null);
    setBalance("0");
    setTransactions([]); // Clear transaction history on disconnect
  };

  const sendethers = async()=>{
    const account = await connectWallet();
    const privatekey = prompt("enter your key");
    await sendtransaction(account,Eth,reciveraddress,privatekey);
    setEth("")
    setreciveraddress("")
    const userBalance = await getBalance(account);
    setBalance(userBalance);
    const historyY = await getTransactionHistory(account);
    setTransactions(historyY);
  }


  return (
    <>
    <div
      style={{
        textAlign: "center",
        padding: "40px",
        border: "2px solid white",
        width: "50%",
        margin: "50px auto",
        display:"grid",
        
      }}
      className="container"
    >
      <h1>Crypto Wallet</h1>
      {wallet ? (
        <div className="container" >
          <p><strong>Wallet Address:</strong> {wallet}</p>
          <p><strong>Balance:</strong> {balance} ETH</p>
          <button
            onClick={disconnectWallet}
            className="walletbtn"
          >
            Disconnect Wallet
          </button>
         <div className="sendingcontainer">
         <input type="text"  className="inputfield" placeholder="Reciever Address" value={reciveraddress}  onChange={(e)=>setreciveraddress(e.target.value)} />
         <input type="text"  className="inputfield" placeholder="Ether" value={Eth}  onChange={(e)=>setEth(e.target.value)}/>
         </div>
         <button onClick={sendethers} className="walletbtn">
          Send Ethers
        </button>
          <h2>Transaction History</h2>
          {transactions.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th className="th">Tx Hash</th>
                  <th className="th">From</th>
                  <th className="th">To</th>
                  <th className="th">Value</th>
                  <th className="th">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, index) => (
                  <tr key={index}>
                    <td className="tabledata">
                      {tx.hash.slice(0, 10)}...
                    </td>
                    <td className="tabledata">{tx.from.slice(0, 10)}...</td>
                    <td className="tabledata">{tx.to ? tx.to.slice(0, 10) : "N/A"}...</td>
                    <td className="tabledata">{tx.value} ETH</td>
                    <td className="tabledata">{tx.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No transactions found</p>
          )}
        </div>
      ) : (
        <button
          onClick={handleConnect}
           className="walletbtn"
        >
          Connect Wallet
        </button>
      )}
     
    </div>

<Etherconversion />
</>
  );
}
