import axiosClient from './axiosClient.js';

export const transactionApi = {
  getTransactions: (params = {}) => axiosClient.get('/transactions', { params }),
  createTransaction: (data) => axiosClient.post('/transactions', data),
  getTransactionById: (id) => axiosClient.get(`/transactions/${id}`),
  updateTransaction: (id, data) => axiosClient.patch(`/transactions/${id}`, data),
  deleteTransaction: (id) => axiosClient.delete(`/transactions/${id}`),
  getExportUrl: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    return `${baseUrl}/transactions/export?${query}`;
  },
};

export default transactionApi;
