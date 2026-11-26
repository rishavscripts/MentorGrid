import axiosClient from './axiosClient';

export const studentApi = {
  getMyProfile: async () => {
    const { data } = await axiosClient.get('/students/me');
    return data;
  },

  saveMyProfile: async (payload) => {
    const { data } = await axiosClient.post('/students/profile', payload);
    return data; // Returns saved StudentProfile including generated S_xxxxxxxx displayId
  },

  getStudentsByMentor: async (mentorDisplayId, search = '') => {
    const params = search ? { search } : {};
    const { data } = await axiosClient.get(`/students/mentor/${mentorDisplayId}`, { params });
    return data;
  },

  createStudentByTeacher: async (payload) => {
    const { data } = await axiosClient.post('/students', payload);
    return data;
  },

  updateStudentByTeacher: async (displayId, payload) => {
    const { data } = await axiosClient.put(`/students/${displayId}`, payload);
    return data;
  },

  deleteStudentByTeacher: async (displayId) => {
    await axiosClient.delete(`/students/${displayId}`);
  },
};