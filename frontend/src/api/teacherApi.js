import axiosClient from './axiosClient';

export const teacherApi = {
  getAllMentors: async () => {
    const { data } = await axiosClient.get('/teachers');
    return data;
  },

  getMyProfile: async () => {
    const { data } = await axiosClient.get('/teachers/me');
    return data;
  },

  getByDisplayId: async (displayId) => {
    const { data } = await axiosClient.get(`/teachers/${displayId}`);
    return data;
  },

  saveProfile: async (payload) => {
    const { data } = await axiosClient.post('/teachers/profile', payload);
    return data; // Returns saved TeacherProfile including generated T_xxxxxxxx displayId
  },

  getAnnouncements: async (mentorDisplayId) => {
    const { data } = await axiosClient.get(`/teachers/${mentorDisplayId}/announcements`);
    return data;
  },

  publishAnnouncement: async (mentorDisplayId, content) => {
    const { data } = await axiosClient.post(`/teachers/${mentorDisplayId}/announcements`, { content });
    return data;
  },
};