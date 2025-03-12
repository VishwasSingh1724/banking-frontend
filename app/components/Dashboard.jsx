"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./Navbar";

export default function DashboardPage() {
  const router = useRouter();
  const [balance, setBalance] = useState(null); // ✅ Prevents "toFixed" error on initial load
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);

  // ✅ Check authentication before rendering
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
      fetchBalance();
    }

    setLoading(false);
  }, []);

  // ✅ Fetch user balance from API
  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem("token");
      const user_data = JSON.parse(localStorage.getItem("user"));

      if (!token || !user_data?.id) {
        throw new Error("User not authenticated");
      }

      const response = await fetch(`https://banking-backend-s2cq.onrender.com/api/transactions/${user_data.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch balance");

      const data = await response.json();
      setBalance(data.balance);
      setTransactions(data.transactions || []); // ✅ Set fetched balance
    } catch (error) {
      console.error("Balance fetch error:", error);
      setError("Failed to load balance");
    }
  };

  // ✅ Handle Deposit & Withdraw API Call
  const handleTransaction = async (type) => {
    setError("");
    const transactionAmount = Number.parseFloat(amount);

    if (!amount || isNaN(transactionAmount) || transactionAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (type === "withdraw" && transactionAmount > balance) {
      setError("Insufficient funds");
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const user_data = JSON.parse(localStorage.getItem("user"));

      const response = await fetch(`https://banking-backend-s2cq.onrender.com/api/transactions/${type}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: transactionAmount, userId: user_data.id }),
      });

      if (!response.ok) throw new Error("Transaction failed");

      // ✅ Fetch updated balance after transaction
      await fetchBalance();

      setAmount("");
    } catch (error) {
      console.error("Transaction error:", error);
      setError("Transaction failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Prevent flashing of login screen
  if (loading) return null;
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 p-8 max-w-4xl mx-auto w-full">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-8">
          <div className="text-sm text-gray-500 mb-1">Current Balance</div>
          <div className="text-3xl font-semibold">
            {balance !== null ? balance.toFixed(2) : "Loading..."} {/* ✅ Fix initial undefined error */}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-6">Make a Transaction</h2>

          <div className="space-y-4">
            <div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                min="0"
                step="0.01"
              />
              {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleTransaction("deposit")}
                disabled={isLoading}
                className="py-3 bg-[#0f172a] text-white rounded-md text-sm font-medium transition-colors hover:bg-[#1e293b] disabled:bg-gray-400"
              >
                {isLoading ? "Processing..." : "Deposit"}
              </button>
              <button
                onClick={() => handleTransaction("withdraw")}
                disabled={isLoading}
                className="py-3 bg-white border border-gray-300 text-gray-900 rounded-md text-sm font-medium transition-colors hover:bg-gray-50 disabled:bg-gray-100"
              >
                {isLoading ? "Processing..." : "Withdraw"}
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Type
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.length > 0 ? (
                  transactions.map((transaction, index) => (
                    <tr key={transaction.id || index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {new Date(transaction.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            transaction.transaction_type === "deposit"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {transaction.transaction_type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-medium">
                        <span className={transaction.transaction_type === "deposit" ? "text-green-600" : "text-red-600"}>
                          ₹{transaction.amount}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-4 py-6 text-sm text-gray-500 text-center">
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
      </main>
    </div>
  );
}
