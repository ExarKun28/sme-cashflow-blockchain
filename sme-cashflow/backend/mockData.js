// Mock data simulating Hyperledger Fabric blockchain responses
const mockTransactions = [
  {
    transactionID: 'TX001',
    smeID: 'SME001',
    type: 'inflow',
    amount: 150000,
    category: 'Sales Revenue',
    description: 'Product sales - January batch',
    date: '2024-01-15',
    timestamp: new Date('2024-01-15').toISOString(),
    createdBy: 'admin'
  },
  {
    transactionID: 'TX002',
    smeID: 'SME001',
    type: 'outflow',
    amount: 45000,
    category: 'Operating Expenses',
    description: 'Employee salaries',
    date: '2024-01-20',
    timestamp: new Date('2024-01-20').toISOString(),
    createdBy: 'admin'
  },
  {
    transactionID: 'TX003',
    smeID: 'SME001',
    type: 'inflow',
    amount: 85000,
    category: 'Sales Revenue',
    description: 'Service income - consulting',
    date: '2024-01-25',
    timestamp: new Date('2024-01-25').toISOString(),
    createdBy: 'admin'
  },
  {
    transactionID: 'TX004',
    smeID: 'SME001',
    type: 'outflow',
    amount: 12000,
    category: 'Utilities',
    description: 'Electricity and water bills',
    date: '2024-02-01',
    timestamp: new Date('2024-02-01').toISOString(),
    createdBy: 'admin'
  },
  {
    transactionID: 'TX005',
    smeID: 'SME001',
    type: 'inflow',
    amount: 200000,
    category: 'Sales Revenue',
    description: 'Wholesale order - bulk purchase',
    date: '2024-02-10',
    timestamp: new Date('2024-02-10').toISOString(),
    createdBy: 'admin'
  },
  {
    transactionID: 'TX006',
    smeID: 'SME001',
    type: 'outflow',
    amount: 35000,
    category: 'Inventory',
    description: 'Raw materials purchase',
    date: '2024-02-12',
    timestamp: new Date('2024-02-12').toISOString(),
    createdBy: 'admin'
  },
  {
    transactionID: 'TX007',
    smeID: 'SME001',
    type: 'outflow',
    amount: 8000,
    category: 'Marketing',
    description: 'Social media advertising',
    date: '2024-02-15',
    timestamp: new Date('2024-02-15').toISOString(),
    createdBy: 'admin'
  },
  {
    transactionID: 'TX008',
    smeID: 'SME001',
    type: 'inflow',
    amount: 120000,
    category: 'Sales Revenue',
    description: 'Retail sales - February',
    date: '2024-02-28',
    timestamp: new Date('2024-02-28').toISOString(),
    createdBy: 'admin'
  }
];

module.exports = { mockTransactions };