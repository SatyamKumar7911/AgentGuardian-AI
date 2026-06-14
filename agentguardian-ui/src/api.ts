import axios from 'axios';
import type { Investigation, InvestigationReport } from './types';

export const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

// Add a request interceptor to include the JWT token
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  error => Promise.reject(error)
);

export const uploadEvidence = async (file: File): Promise<Investigation> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(`${API_URL}/investigations/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getInvestigations = async (): Promise<Investigation[]> => {
  const response = await axios.get(`${API_URL}/investigations`);
  return response.data;
};

export const getInvestigationReport = async (id: string): Promise<InvestigationReport> => {
  const response = await axios.get(`${API_URL}/investigations/${id}`);
  return response.data;
};
