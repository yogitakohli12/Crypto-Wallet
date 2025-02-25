import Web3 from "web3";
const web3 = new Web3(window.ethereum); // Fallback to Ganache if MetaMask is unavailable
// ✅ Connect Wallet
export const connectWallet = async () => {
  try {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return null;
    }
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    return accounts[0]; // User's wallet address
  } catch (error) {
    console.error("Wallet connection failed:", error);
    return null;
  }
};
// ✅ Get Balance
export const getBalance = async (address) => {
  try {
    const balance = await web3.eth.getBalance(address);
    return web3.utils.fromWei(balance.toString(), "ether"); // Convert BigInt to string before conversion
  } catch (error) {
    console.error("Failed to get balance:", error);
    return "0";
  }
};

// ✅ Get Transaction History (Fixed BigInt Issues)
export const getTransactionHistory = async (address) => {
  try {
    const latestBlock = Number(await web3.eth.getBlockNumber()); // Convert BigInt to Number
    const transactions = [];

    // Scan last 1000 blocks (Modify if needed)
    for (let i = latestBlock; i >= 0 && i > latestBlock - 5; i--) {
      const block = await web3.eth.getBlock(i, true);
      if (block && block.transactions) {
        block.transactions.forEach((tx) => {
          if (tx.from.toLowerCase() === address.toLowerCase() || 
              tx.to?.toLowerCase() === address.toLowerCase()) {
            transactions.push({
              hash: tx.hash,
              from: tx.from,
              to: tx.to,
              value: web3.utils.fromWei(tx.value.toString(), "ether"), // Convert BigInt to string before conversion
              gasUsed: tx.gas.toString(), // Convert BigInt to string
              blockNumber: tx.blockNumber,
              timestamp: new Date(Number(block.timestamp) * 1000).toLocaleString(), // ✅ Convert BigInt to Number
            });
          }
        });
      }
    }

    return transactions;
  } catch (error) {
    console.error("Failed to fetch transaction history:", error);
    return [];
  }
};
// const senderPrivateKey ='0xbada6a0c773dd9d32c7e1fd155e55508c39f466100a5948186c0b1444ef71bc7'
export const sendtransaction = async (senderAddress,eth,receiverAddress,senderPrivateKey) => {
  const fullkey = `0x${senderPrivateKey}`
  try {
    const tx = {
      from: senderAddress,
      to: receiverAddress,
      value: web3.utils.toWei(eth, 'ether'),
      gas: 21000,
      gasPrice: 20000000000, // Set the gas price
    };
    const signedTx = await web3.eth.accounts.signTransaction(tx, fullkey);
    await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    alert('✅ sent successfully!');
    await web3.eth.getBlock('latest');
  } catch (error) {
    console.error('Error in sending', error.message);
  }
};

// sendtransaction();
