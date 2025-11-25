'use strict';

const { Contract } = require('fabric-contract-api');

class SMECashflowContract extends Contract {

    // Initialize the ledger with sample data
    async InitLedger(ctx) {
        const transactions = [
            {
                transactionID: 'TX001',
                smeID: 'SME001',
                type: 'inflow',
                amount: 150000,
                category: 'sales',
                description: 'Payment from Client A',
                date: '2025-11-01',
                timestamp: new Date('2025-11-01T09:00:00Z').toISOString(),
                createdBy: 'admin@sme001.com'
            },
            {
                transactionID: 'TX002',
                smeID: 'SME001',
                type: 'outflow',
                amount: 50000,
                category: 'expenses',
                description: 'Office rent payment',
                date: '2025-11-05',
                timestamp: new Date('2025-11-05T10:00:00Z').toISOString(),
                createdBy: 'admin@sme001.com'
            }
        ];

        for (const transaction of transactions) {
            await ctx.stub.putState(transaction.transactionID, Buffer.from(JSON.stringify(transaction)));
            console.log(`Transaction ${transaction.transactionID} initialized`);
        }

        return 'Ledger initialized successfully';
    }

    // Create a new transaction
    async CreateTransaction(ctx, transactionID, smeID, type, amount, category, description, date, createdBy) {
        const exists = await this.TransactionExists(ctx, transactionID);
        if (exists) {
            throw new Error(`Transaction ${transactionID} already exists`);
        }

        const transaction = {
            transactionID,
            smeID,
            type,
            amount: parseFloat(amount),
            category,
            description,
            date,
            timestamp: new Date().toISOString(),
            createdBy
        };

        await ctx.stub.putState(transactionID, Buffer.from(JSON.stringify(transaction)));
        return JSON.stringify(transaction);
    }

    // Get a specific transaction
    async GetTransaction(ctx, transactionID) {
        const transactionJSON = await ctx.stub.getState(transactionID);
        if (!transactionJSON || transactionJSON.length === 0) {
            throw new Error(`Transaction ${transactionID} does not exist`);
        }
        return transactionJSON.toString();
    }

    // Update a transaction
    async UpdateTransaction(ctx, transactionID, type, amount, category, description, date) {
        const exists = await this.TransactionExists(ctx, transactionID);
        if (!exists) {
            throw new Error(`Transaction ${transactionID} does not exist`);
        }

        const transactionString = await this.GetTransaction(ctx, transactionID);
        const transaction = JSON.parse(transactionString);

        transaction.type = type;
        transaction.amount = parseFloat(amount);
        transaction.category = category;
        transaction.description = description;
        transaction.date = date;
        transaction.lastModified = new Date().toISOString();

        await ctx.stub.putState(transactionID, Buffer.from(JSON.stringify(transaction)));
        return JSON.stringify(transaction);
    }

    // Delete a transaction (soft delete)
    async DeleteTransaction(ctx, transactionID) {
        const exists = await this.TransactionExists(ctx, transactionID);
        if (!exists) {
            throw new Error(`Transaction ${transactionID} does not exist`);
        }

        await ctx.stub.deleteState(transactionID);
        return `Transaction ${transactionID} deleted successfully`;
    }

    // Get all transactions
    async GetAllTransactions(ctx) {
        const allResults = [];
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push(record);
            result = await iterator.next();
        }
        
        return JSON.stringify(allResults);
    }

    // Get transactions by SME ID
    async GetTransactionsBySME(ctx, smeID) {
        const allTransactions = await this.GetAllTransactions(ctx);
        const transactions = JSON.parse(allTransactions);
        const filtered = transactions.filter(tx => tx.smeID === smeID);
        return JSON.stringify(filtered);
    }

    // Get cash flow summary
    async GetCashFlowSummary(ctx, smeID) {
        const allTransactions = await this.GetAllTransactions(ctx);
        const transactions = JSON.parse(allTransactions);
        const smeTransactions = transactions.filter(tx => tx.smeID === smeID);

        let totalInflow = 0;
        let totalOutflow = 0;

        smeTransactions.forEach(tx => {
            if (tx.type === 'inflow') {
                totalInflow += tx.amount;
            } else if (tx.type === 'outflow') {
                totalOutflow += tx.amount;
            }
        });

        const netBalance = totalInflow - totalOutflow;

        return JSON.stringify({
            smeID,
            totalInflow,
            totalOutflow,
            netBalance,
            transactionCount: smeTransactions.length
        });
    }

    // Check if transaction exists
    async TransactionExists(ctx, transactionID) {
        const transactionJSON = await ctx.stub.getState(transactionID);
        return transactionJSON && transactionJSON.length > 0;
    }
}

module.exports = SMECashflowContract;


