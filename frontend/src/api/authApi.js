import axiosClient from './axiosClient';

export const authApi = {
  register: async ({ email, password, role }) => {
    const { data } = await axiosClient.post('/auth/register', { email, password, role });
    return data; // { token, userId, email, role, displayId, profileCompleted }
  },

  login: async ({ email, password }) => {
    const { data } = await axiosClient.post('/auth/login', { email, password });
    return data; // { token, userId, email, role, displayId, profileCompleted }
  },
};