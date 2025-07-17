import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  department: string;
  job_title: string;
  start_date: string;
  end_date?: string;
  is_active: boolean;
}

export interface KPIData {
  totalEmployees: number;
  newHires: number;
  departures: number;
}

export interface DepartmentBreakdown {
  department: string;
  count: number;
  percentage: number;
}

export interface NewHireData {
  month: string;
  count: number;
}

// API calls
export const dashboardAPI = {
  getKPIs: () => api.get<KPIData>('/api/dashboard/kpis'),
  getDepartmentBreakdown: () => api.get<DepartmentBreakdown[]>('/api/dashboard/department-breakdown'),
};

export const employeeAPI = {
  getEmployees: (params?: { search?: string; page?: number; limit?: number }) => 
    api.get<Employee[]>('/api/employees', { params }),
  createEmployee: (data: Omit<Employee, 'id'>) => 
    api.post<Employee>('/api/employees', data),
  updateEmployee: (id: number, data: Partial<Employee>) => 
    api.put<Employee>(`/api/employees/${id}`, data),
  deactivateEmployee: (id: number) => 
    api.put<Employee>(`/api/employees/${id}/deactivate`),
};

export default api;