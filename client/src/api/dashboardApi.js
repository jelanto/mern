import axiosClient from './axiosClient.js';

export const dashboardApi = {
  getSummary: () => axiosClient.get('/dashboard/summary'),
  getCashFlow: (months = 6) => axiosClient.get(`/dashboard/cash-flow?months=${months}`),
  getExpenseBreakdown: (period = 'this_month') => axiosClient.get(`/dashboard/expense-breakdown?period=${period}`),
  getRecentTransactions: (limit = 6) => axiosClient.get(`/dashboard/recent-transactions?limit=${limit}`),
};

export default dashboardApi;
