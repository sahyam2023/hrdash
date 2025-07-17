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
  name: string;
  email: string;
  department: string;
  position: string;
  salary: number;
  hire_date: string;
  is_active: boolean;
}

export interface KPIData {
  total_employees: number;
  active_employees: number;
  departments: number;
  avg_salary: number;
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

// Mock data for development
export const mockKPIData: KPIData = {
  total_employees: 1247,
  active_employees: 1198,
  departments: 8,
  avg_salary: 75000,
};

export const mockDepartmentData: DepartmentBreakdown[] = [
  { department: 'Engineering', count: 485, percentage: 38.9 },
  { department: 'Sales', count: 278, percentage: 22.3 },
  { department: 'Marketing', count: 156, percentage: 12.5 },
  { department: 'HR', count: 89, percentage: 7.1 },
  { department: 'Finance', count: 67, percentage: 5.4 },
  { department: 'Operations', count: 172, percentage: 13.8 },
];

export const mockNewHireData: NewHireData[] = [
  { month: 'Jan', count: 45 },
  { month: 'Feb', count: 52 },
  { month: 'Mar', count: 48 },
  { month: 'Apr', count: 61 },
  { month: 'May', count: 55 },
  { month: 'Jun', count: 67 },
  { month: 'Jul', count: 58 },
  { month: 'Aug', count: 62 },
  { month: 'Sep', count: 59 },
  { month: 'Oct', count: 64 },
  { month: 'Nov', count: 71 },
  { month: 'Dec', count: 43 },
];

export const mockEmployees: Employee[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@company.com',
    department: 'Engineering',
    position: 'Senior Developer',
    salary: 85000,
    hire_date: '2022-01-15',
    is_active: true,
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    department: 'Marketing',
    position: 'Marketing Manager',
    salary: 70000,
    hire_date: '2021-03-10',
    is_active: true,
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike.johnson@company.com',
    department: 'Sales',
    position: 'Sales Representative',
    salary: 55000,
    hire_date: '2023-06-20',
    is_active: true,
  },
  {
    id: 4,
    name: 'Sarah Wilson',
    email: 'sarah.wilson@company.com',
    department: 'HR',
    position: 'HR Specialist',
    salary: 60000,
    hire_date: '2022-09-05',
    is_active: false,
  },
  {
    id: 5,
    name: 'David Brown',
    email: 'david.brown@company.com',
    department: 'Finance',
    position: 'Financial Analyst',
    salary: 65000,
    hire_date: '2021-11-12',
    is_active: true,
  },
];

export default api;