import axios from 'axios';

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// 设计相关API
export const designApi = {
  // 保存设计
  saveDesign: (designData) => api.post('/designs', designData),
  
  // 获取设计
  getDesign: (id) => api.get(`/designs/${id}`),
  
  // 更新设计
  updateDesign: (id, designData) => api.put(`/designs/${id}`, designData),
  
  // 删除设计
  deleteDesign: (id) => api.delete(`/designs/${id}`),
  
  // 获取所有设计
  getAllDesigns: () => api.get('/designs'),
  
  // 上传图片
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

export default api;