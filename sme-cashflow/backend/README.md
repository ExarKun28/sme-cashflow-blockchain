# SME Cash Flow Backend API

Backend API for the SME Cash Flow Monitoring System using Hyperledger Fabric.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Ensure Hyperledger Fabric network is running
3. Enroll admin and register user (see enrollment section)

## Running the Server
```bash
node server.js
```

Server runs on: `http://localhost:3001`

## API Endpoints

### Health Check
- **GET** `/api/health`
- Returns server status

### Blockchain Operations

#### Initialize Ledger
- **POST** `/api/blockchain/init`
- Initializes the blockchain ledger with sample data

#### Create Transaction
- **POST** `/api/blockchain/transaction`
- Body:
```json
{
  "transactionID": "TX001",
  "smeID": "SME001",
  "type": "inflow",
  "amount": 50000,
  "category": "sales",
  "description": "Payment from client",
  "date": "2025-11-25",
  "createdBy": "user@sme.com"
}
```

#### Get All Transactions
- **GET** `/api/blockchain/transactions`
- Returns all transactions

#### Get Transaction by ID
- **GET** `/api/blockchain/transaction/:id`
- Returns specific transaction

#### Get Transactions by SME
- **GET** `/api/blockchain/transactions/sme/:smeId`
- Returns all transactions for specific SME

#### Get Cash Flow Summary
- **GET** `/api/blockchain/summary/:smeId`
- Returns totals: inflow, outflow, net balance

#### Update Transaction
- **PUT** `/api/blockchain/transaction/:id`
- Body: same as create (without transactionID, smeID, createdBy)

#### Delete Transaction
- **DELETE** `/api/blockchain/transaction/:id`

## Project Structure
```
sme-cashflow/
├── chaincode/          # Smart contracts
│   ├── smeCashflow.js
│   ├── index.js
│   └── package.json
└── backend/           # API server
    ├── server.js
    └── package.json
```

## Notes

- This backend connects to Hyperledger Fabric network
- When network is not available, API will return connection errors
- For AWS deployment, update connection profile paths
```

Save with **Ctrl + O**, **Enter**, **Ctrl + X**.

---

## **🎉 Part 2 Complete! Summary**

### **What We Built:**

✅ **Chaincode (Smart Contracts):**
- 8 functions for managing SME cash flow transactions
- Handles inflow/outflow, categories, summaries
- Ready to deploy to Fabric network

✅ **Backend API:**
- Express server with 9 REST endpoints
- Connects to Hyperledger Fabric
- CORS enabled for frontend integration
- Runs on port 3001

---

### **Your Project Structure:**
```
~/fabric-samples/sme-cashflow/
├── chaincode/
│   ├── smeCashflow.js (5.8KB - your smart contract)
│   ├── index.js (178B - exports)
│   └── package.json
└── backend/
    ├── server.js (your API)
    ├── README.md (documentation)
    └── package.json
