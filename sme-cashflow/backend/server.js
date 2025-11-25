const express = require('express');
const cors = require('cors');
const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to connect to Fabric network
async function connectToNetwork() {
    try {
        // Load connection profile
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create wallet
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Check if admin identity exists
        const identity = await wallet.get('appUser');
        if (!identity) {
            console.log('Identity not found in wallet. Please enroll user first.');
            return null;
        }

        // Connect to gateway
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: 'appUser',
            discovery: { enabled: true, asLocalhost: true }
        });

        // Get network and contract
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('sme-cashflow');

        return { gateway, contract };
    } catch (error) {
        console.error(`Failed to connect to network: ${error}`);
        return null;
    }
}

// ============ API Routes ============

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'Backend API is running', timestamp: new Date().toISOString() });
});

// Initialize ledger
app.post('/api/blockchain/init', async (req, res) => {
    try {
        const connection = await connectToNetwork();
        if (!connection) {
            return res.status(500).json({ error: 'Failed to connect to blockchain network' });
        }

        const { contract, gateway } = connection;
        await contract.submitTransaction('InitLedger');
        await gateway.disconnect();

        res.json({ message: 'Ledger initialized successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create transaction
app.post('/api/blockchain/transaction', async (req, res) => {
    try {
        const { transactionID, smeID, type, amount, category, description, date, createdBy } = req.body;

        const connection = await connectToNetwork();
        if (!connection) {
            return res.status(500).json({ error: 'Failed to connect to blockchain network' });
        }

        const { contract, gateway } = connection;
        const result = await contract.submitTransaction(
            'CreateTransaction',
            transactionID,
            smeID,
            type,
            amount.toString(),
            category,
            description,
            date,
            createdBy
        );
        await gateway.disconnect();

        res.json({ 
            message: 'Transaction created successfully',
            transaction: JSON.parse(result.toString())
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all transactions
app.get('/api/blockchain/transactions', async (req, res) => {
    try {
        const connection = await connectToNetwork();
        if (!connection) {
            return res.status(500).json({ error: 'Failed to connect to blockchain network' });
        }

        const { contract, gateway } = connection;
        const result = await contract.evaluateTransaction('GetAllTransactions');
        await gateway.disconnect();

        res.json(JSON.parse(result.toString()));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get transaction by ID
app.get('/api/blockchain/transaction/:id', async (req, res) => {
    try {
        const connection = await connectToNetwork();
        if (!connection) {
            return res.status(500).json({ error: 'Failed to connect to blockchain network' });
        }

        const { contract, gateway } = connection;
        const result = await contract.evaluateTransaction('GetTransaction', req.params.id);
        await gateway.disconnect();

        res.json(JSON.parse(result.toString()));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get transactions by SME ID
app.get('/api/blockchain/transactions/sme/:smeId', async (req, res) => {
    try {
        const connection = await connectToNetwork();
        if (!connection) {
            return res.status(500).json({ error: 'Failed to connect to blockchain network' });
        }

        const { contract, gateway } = connection;
        const result = await contract.evaluateTransaction('GetTransactionsBySME', req.params.smeId);
        await gateway.disconnect();

        res.json(JSON.parse(result.toString()));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get cash flow summary
app.get('/api/blockchain/summary/:smeId', async (req, res) => {
    try {
        const connection = await connectToNetwork();
        if (!connection) {
            return res.status(500).json({ error: 'Failed to connect to blockchain network' });
        }

        const { contract, gateway } = connection;
        const result = await contract.evaluateTransaction('GetCashFlowSummary', req.params.smeId);
        await gateway.disconnect();

        res.json(JSON.parse(result.toString()));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update transaction
app.put('/api/blockchain/transaction/:id', async (req, res) => {
    try {
        const { type, amount, category, description, date } = req.body;

        const connection = await connectToNetwork();
        if (!connection) {
            return res.status(500).json({ error: 'Failed to connect to blockchain network' });
        }

        const { contract, gateway } = connection;
        const result = await contract.submitTransaction(
            'UpdateTransaction',
            req.params.id,
            type,
            amount.toString(),
            category,
            description,
            date
        );
        await gateway.disconnect();

        res.json({ 
            message: 'Transaction updated successfully',
            transaction: JSON.parse(result.toString())
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete transaction
app.delete('/api/blockchain/transaction/:id', async (req, res) => {
    try {
        const connection = await connectToNetwork();
        if (!connection) {
            return res.status(500).json({ error: 'Failed to connect to blockchain network' });
        }

        const { contract, gateway } = connection;
        await contract.submitTransaction('DeleteTransaction', req.params.id);
        await gateway.disconnect();

        res.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`SME Cashflow Backend API running on http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
});
