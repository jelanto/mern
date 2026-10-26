import axiosClient from './axiosClient.js';

export const budgetApi = {
  getBudgets: () => axiosClient.get('/budgets'),
  createBudget: (data) => axiosClient.post('/budgets', data),
  updateBudget: (id, data) => axiosClient.patch(`/budgets/${id}`, data),
  deleteBudget: (id) => axiosClient.delete(`/budgets/${id}`),
};

export default budgetApi;
