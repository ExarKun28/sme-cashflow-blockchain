const express = require('express');
const cors = require('cors');
const { mockTransactions } = require('./mockData');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// In-memory storage (simulating blockchain)
let transactions = [...mockTransactions];
let transactionCounter = transactions.length + 1;

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Mock Blockchain API is running' });
});

// Initialize ledger (reset to original mock data)
app.post('/api/init', (req, res) => {
  transactions = [...mockTransactions];
  transactionCounter = transactions.length + 1;
  res.json({ message: 'Ledger initialized with mock data', count: transactions.length });
});

// Get all transactions
app.get('/api/transactions', (req, res) => {
  res.json(transactions);
});

// Get single transaction
app.get('/api/transactions/:id', (req, res) => {
  const transaction = transactions.find(tx => tx.transactionID === req.params.id);
  if (transaction) {
    res.json(transaction);
  } else {
    res.status(404).json({ error: 'Transaction not found' });
  }
});

// Create new transaction
app.post('/api/transactions', (req, res) => {
  const { smeID, type, amount, category, description, date, createdBy } = req.body;
  
  const newTransaction = {
    transactionID: `TX${String(transactionCounter).padStart(3, '0')}`,
    smeID,
    type,
    amount: parseFloat(amount),
    category,
    description,
    date,
    timestamp: new Date().toISOString(),
    createdBy: createdBy || 'admin'
  };
  
  transactions.push(newTransaction);
  transactionCounter++;
  
  res.status(201).json(newTransaction);
});

// Update transaction
app.put('/api/transactions/:id', (req, res) => {
  const index = transactions.findIndex(tx => tx.transactionID === req.params.id);
  
  if (index !== -1) {
    transactions[index] = {
      ...transactions[index],
      ...req.body,
      timestamp: new Date().toISOString()
    };
    res.json(transactions[index]);
  } else {
    res.status(404).json({ error: 'Transaction not found' });
  }
});

// Delete transaction
app.delete('/api/transactions/:id', (req, res) => {
  const index = transactions.findIndex(tx => tx.transactionID === req.params.id);
  
  if (index !== -1) {
    const deleted = transactions.splice(index, 1);
    res.json({ message: 'Transaction deleted', transaction: deleted[0] });
  } else {
    res.status(404).json({ error: 'Transaction not found' });
  }
});

// Get transactions by SME
app.get('/api/transactions/sme/:smeId', (req, res) => {
  const smeTransactions = transactions.filter(tx => tx.smeID === req.params.smeId);
  res.json(smeTransactions);
});

// Get cash flow summary
app.get('/api/summary/:smeId', (req, res) => {
  const smeTransactions = transactions.filter(tx => tx.smeID === req.params.smeId);
  
  const totalInflow = smeTransactions
    .filter(tx => tx.type === 'inflow')
    .reduce((sum, tx) => sum + tx.amount, 0);
  
  const totalOutflow = smeTransactions
    .filter(tx => tx.type === 'outflow')
    .reduce((sum, tx) => sum + tx.amount, 0);
  
  const balance = totalInflow - totalOutflow;
  
  res.json({
    smeID: req.params.smeId,
    totalInflow,
    totalOutflow,
    balance,
    transactionCount: smeTransactions.length
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Mock Blockchain API running on http://localhost:${PORT}`);
  console.log(`📊 Loaded ${transactions.length} mock transactions`);
});