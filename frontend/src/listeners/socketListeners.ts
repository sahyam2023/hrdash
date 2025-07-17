import { Socket } from 'socket.io-client';
import toast from 'react-hot-toast';
import { Employee } from '../services/api';

// --- Define Handler Functions ---
const onEmployeeAdded = (employee: Employee) => {
  toast.success(`New employee added: ${employee.first_name} ${employee.last_name}`);
};

const onEmployeeUpdated = (employee: Employee) => {
  toast.success(`Employee updated: ${employee.first_name} ${employee.last_name}`);
};

const onEmployeeDeactivated = (employee: Employee) => {
  toast.error(`Employee deactivated: ${employee.first_name} ${employee.last_name}`);
};

const onDepartmentAdded = (department: { id: number, name: string }) => {
  toast.success(`New department added: ${department.name}`);
};

const onDepartmentDeleted = (data: { id: number }) => {
  toast.error(`Department with ID ${data.id} has been deleted.`);
};

const onJobTitleAdded = (jobTitle: { id: number, name: string }) => {
  toast.success(`New job title added: ${jobTitle.name}`);
};

const onJobTitleDeleted = (data: { id: number }) => {
  toast.error(`Job title with ID ${data.id} has been deleted.`);
};


/**
 * Initializes all socket event listeners and returns a cleanup function.
 * The cleanup function is essential to remove listeners when a component unmounts,
 * preventing duplicate event registrations and notification spam.
 *
 * @param socket The socket.io-client instance.
 * @returns A function that removes all registered listeners.
 */
export const initializeSocketListeners = (socket: Socket) => {
  // --- Register all event listeners ---
  socket.on('employee_added', onEmployeeAdded);
  socket.on('employee_updated', onEmployeeUpdated);
  socket.on('employee_deactivated', onEmployeeDeactivated);
  socket.on('department_added', onDepartmentAdded);
  socket.on('department_deleted', onDepartmentDeleted);
  socket.on('job_title_added', onJobTitleAdded);
  socket.on('job_title_deleted', onJobTitleDeleted);

  // --- Return the cleanup function ---
  // React will call this function when the useEffect hook cleans up.
  return () => {
    // --- Unregister all event listeners ---
    socket.off('employee_added', onEmployeeAdded);
    socket.off('employee_updated', onEmployeeUpdated);
    socket.off('employee_deactivated', onEmployeeDeactivated);
    socket.off('department_added', onDepartmentAdded);
    socket.off('department_deleted', onDepartmentDeleted);
    socket.off('job_title_added', onJobTitleAdded);
    socket.off('job_title_deleted', onJobTitleDeleted);
  };
};