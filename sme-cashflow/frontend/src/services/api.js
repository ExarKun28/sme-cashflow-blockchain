import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Transaction APIs
export const initLedger = () => api.post('/init');
export const createTransaction = (data) => api.post('/transactions', data);
export const getAllTransactions = () => api.get('/transactions');
export const getTransaction = (id) => api.get(`/transactions/${id}`);
export const updateTransaction = (id, data) => api.put(`/transactions/${id}`, data);
export const deleteTransaction = (id) => api.delete(`/transactions/${id}`);
export const getTransactionsBySME = (smeId) => api.get(`/transactions/sme/${smeId}`);
export const getCashFlowSummary = (smeId) => api.get(`/summary/${smeId}`);

export default api;