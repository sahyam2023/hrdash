import { Socket } from 'socket.io-client';
import toast from 'react-hot-toast';
import { Employee } from '../services/api';

export const initializeSocketListeners = (socket: Socket) => {
  socket.on('employee_added', (employee: Employee) => {
    toast.success(`New employee added: ${employee.first_name} ${employee.last_name}`);
  });

  socket.on('employee_updated', (employee: Employee) => {
    toast.success(`Employee updated: ${employee.first_name} ${employee.last_name}`);
  });

  socket.on('employee_deactivated', (data: { id: number }) => {
    toast.error(`Employee with ID ${data.id} has been deactivated.`);
  });

  socket.on('department_added', (department: { id: number, name: string }) => {
    toast.success(`New department added: ${department.name}`);
  });

  socket.on('department_deleted', (data: { id: number }) => {
    toast.error(`Department with ID ${data.id} has been deleted.`);
  });

  socket.on('job_title_added', (jobTitle: { id: number, name: string }) => {
    toast.success(`New job title added: ${jobTitle.name}`);
  });

    socket.on('job_title_deleted', (data: { id: number }) => {
    toast.error(`Job title with ID ${data.id} has been deleted.`);
    });
};
