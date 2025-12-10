import React, { useState, useEffect } from 'react';
import { getAllTransactions } from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Activity, Lock } from 'lucide-react';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ totalInflow: 0, totalOutflow: 0, balance: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching transactions from API...');
      const txResponse = await getAllTransactions();
      console.log('✅ API Response:', txResponse);
      console.log('📊 Data:', txResponse.data);
      
      if (!txResponse || !txResponse.data) {
        console.error('❌ No data in response!');
        setTransactions([]);
        return;
      }
      
      setTransactions(txResponse.data);
      
      // Calculate summary
      const inflow = txResponse.data
        .filter(tx => tx.type === 'inflow')
        .reduce((sum, tx) => sum + tx.amount, 0);
      const outflow = txResponse.data
        .filter(tx => tx.type === 'outflow')
        .reduce((sum, tx) => sum + tx.amount, 0);
      
      setSummary({
        totalInflow: inflow,
        totalOutflow: outflow,
        balance: inflow - outflow
      });
      
      console.log('✅ Summary calculated:', { inflow, outflow });
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      console.error('Error details:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0ea5e9', '#ef4444'];

  const pieData = [
    { name: 'Inflow', value: summary.totalInflow },
    { name: 'Outflow', value: summary.totalOutflow }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Cash Flow Dashboard</h1>
          <div className="flex items-center gap-2 text-blue-100">
            <Lock size={16} className="text-green-400" />
            <p className="text-sm">All transactions are secured on the blockchain for transparency and immutability</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <TrendingUp className="text-green-400" size={24} />
              </div>
              <span className="text-green-400 text-sm font-semibold">INFLOW</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">
              ₱{summary.totalInflow.toLocaleString()}
            </h3>
            <p className="text-blue-100 text-sm">Total Income</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-500/20 rounded-xl">
                <TrendingDown className="text-red-400" size={24} />
              </div>
              <span className="text-red-400 text-sm font-semibold">OUTFLOW</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">
              ₱{summary.totalOutflow.toLocaleString()}
            </h3>
            <p className="text-blue-100 text-sm">Total Expenses</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <DollarSign className="text-blue-400" size={24} />
              </div>
              <span className="text-blue-400 text-sm font-semibold">BALANCE</span>
            </div>
            <h3 className={`text-3xl font-bold mb-1 ${summary.balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ₱{summary.balance.toLocaleString()}
            </h3>
            <p className="text-blue-100 text-sm">Net Cash Flow</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Pie Chart */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-4">Cash Flow Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ₱${value.toLocaleString()}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Activity size={24} />
              Recent Transactions
            </h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {transactions.slice(0, 5).map((tx) => (
                <div key={tx.transactionID} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{tx.category}</p>
                    <p className="text-blue-100 text-sm">{tx.description}</p>
                  </div>
                  <span className={`font-bold ${tx.type === 'inflow' ? 'text-green-400' : 'text-red-400'}`}>
                    {tx.type === 'inflow' ? '+' : '-'}₱{tx.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">All Transactions</h3>
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <Lock size={14} />
              <span>Blockchain Verified</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="pb-3 text-blue-100 font-semibold">ID</th>
                  <th className="pb-3 text-blue-100 font-semibold">Type</th>
                  <th className="pb-3 text-blue-100 font-semibold">Category</th>
                  <th className="pb-3 text-blue-100 font-semibold">Description</th>
                  <th className="pb-3 text-blue-100 font-semibold">Amount</th>
                  <th className="pb-3 text-blue-100 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.transactionID} className="border-b border-white/10 hover:bg-white/5 transition">
                    <td className="py-3 text-white">{tx.transactionID}</td>
                    <td className="py-3">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        tx.type === 'inflow' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3 text-white">{tx.category}</td>
                    <td className="py-3 text-blue-100">{tx.description}</td>
                    <td className={`py-3 font-bold ${tx.type === 'inflow' ? 'text-green-400' : 'text-red-400'}`}>
                      ₱{tx.amount.toLocaleString()}
                    </td>
                    <td className="py-3 text-blue-100">{new Date(tx.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;