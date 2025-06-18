import { Task, TaskStats, DailySummary, TaskFilters, ApiResponse } from '../types/task';
import { apiRequest } from '../utils/api';

class TaskService {
  // CRUD Operations
  async getTasks(filters?: TaskFilters): Promise<ApiResponse<Task[]>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const queryString = params.toString();
    return apiRequest(`/tasks${queryString ? `?${queryString}` : ''}`);
  }

  async getTask(id: string): Promise<ApiResponse<Task>> {
    return apiRequest(`/tasks/${id}`);
  }

  async createTask(task: Partial<Task>): Promise<ApiResponse<Task>> {
    return apiRequest('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  async updateTask(id: string, task: Partial<Task>): Promise<ApiResponse<Task>> {
    return apiRequest(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(task),
    });
  }

  async patchTask(id: string, updates: Partial<Task>): Promise<ApiResponse<Task>> {
    return apiRequest(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteTask(id: string): Promise<ApiResponse<void>> {
    return apiRequest(`/tasks/${id}`, { method: 'DELETE' });
  }

  // Quick Actions
  async completeTask(id: string): Promise<ApiResponse<Task>> {
    return apiRequest(`/tasks/${id}/complete`, { method: 'PATCH' });
  }

  async incompleteTask(id: string): Promise<ApiResponse<Task>> {
    return apiRequest(`/tasks/${id}/incomplete`, { method: 'PATCH' });
  }

  async updatePriority(id: string, priority: Task['priority']): Promise<ApiResponse<Task>> {
    return apiRequest(`/tasks/${id}/priority`, {
      method: 'PATCH',
      body: JSON.stringify({ priority }),
    });
  }

  async updateDueDate(id: string, dueDate: string | null): Promise<ApiResponse<Task>> {
    return apiRequest(`/tasks/${id}/due-date`, {
      method: 'PATCH',
      body: JSON.stringify({ dueDate }),
    });
  }

  async duplicateTask(id: string, title?: string): Promise<ApiResponse<Task>> {
    return apiRequest(`/tasks/${id}/duplicate`, {
      method: 'POST',
      body: JSON.stringify(title ? { title } : {}),
    });
  }

  // Date-based Queries
  async getTasksDueThisWeek(): Promise<ApiResponse<Task[]>> {
    return apiRequest('/tasks/due-this-week');
  }

  async getTasksDueNextWeek(): Promise<ApiResponse<Task[]>> {
    return apiRequest('/tasks/due-next-week');
  }

  async getTasksDueThisMonth(): Promise<ApiResponse<Task[]>> {
    return apiRequest('/tasks/due-this-month');
  }

  async getTasksDueToday(): Promise<ApiResponse<Task[]>> {
    return apiRequest('/tasks/due-today');
  }

  async getOverdueTasks(priority?: Task['priority']): Promise<ApiResponse<Task[]>> {
    const params = priority ? `?priority=${priority}` : '';
    return apiRequest(`/tasks/overdue${params}`);
  }

  async getTasksInDateRange(startDate: string, endDate: string, filters?: TaskFilters): Promise<ApiResponse<Task[]>> {
    const params = new URLSearchParams({ startDate, endDate });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    return apiRequest(`/tasks/date-range?${params.toString()}`);
  }

  // Statistics
  async getStats(): Promise<ApiResponse<TaskStats>> {
    return apiRequest('/tasks/stats');
  }

  async getDailySummary(): Promise<ApiResponse<DailySummary>> {
    return apiRequest('/tasks/daily-summary');
  }

  // Bulk Operations
  async bulkComplete(ids: string[]): Promise<ApiResponse<Task[]>> {
    return apiRequest('/tasks/bulk/complete', {
      method: 'POST',
      body: JSON.stringify({ ids }),
    });
  }

  async bulkDelete(ids: string[]): Promise<ApiResponse<void>> {
    return apiRequest('/tasks/bulk/delete', {
      method: 'POST',
      body: JSON.stringify({ ids }),
    });
  }

  async deleteAllCompleted(): Promise<ApiResponse<void>> {
    return apiRequest('/tasks/bulk/completed', { method: 'DELETE' });
  }

  // Search with filters support
  async searchTasks(term: string, filters?: TaskFilters): Promise<ApiResponse<Task[]>> {
    const params = new URLSearchParams();
    params.append('search', term);
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && key !== 'search') {
          params.append(key, value.toString());
        }
      });
    }
    
    return apiRequest(`/tasks?${params.toString()}`);
  }
}

export const taskService = new TaskService();