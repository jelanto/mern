import axiosClient from './axiosClient.js';

export const goalApi = {
  getGoals: () => axiosClient.get('/goals'),
  createGoal: (data) => axiosClient.post('/goals', data),
  updateGoal: (id, data) => axiosClient.patch(`/goals/${id}`, data),
  addContribution: (id, data) => axiosClient.post(`/goals/${id}/contributions`, data),
  deleteGoal: (id) => axiosClient.delete(`/goals/${id}`),
};

export default goalApi;
