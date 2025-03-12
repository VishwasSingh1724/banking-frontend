
const page = async({params}) => {
      
  

        const id =  await params.id
           const response = await fetch(`https://banking-backend-s2cq.onrender.com/api/transactions/${id}`)
           const data = await response.json()
           const mapData = data.transactions
           console.log(data.transactions);
            
  return (
    <div>
        {
  
                    <div className="overflow-x-auto p-12">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Date
                  </th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    transaction id
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
                {mapData.length > 0 ? (
                  mapData.map((transaction, index) => (
                    <tr key={transaction.id || index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {new Date(transaction.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {transaction.id}
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
        }
    </div>
  )
}

export default page
