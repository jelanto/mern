import axiosClient from './axiosClient.js';

export const settingsApi = {
  getSettings: () => axiosClient.get('/settings'),
  updateSettings: (data) => axiosClient.patch('/settings', data),
};

export default settingsApi;
