export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  completionRate: number;
  byPriority: {
    high: number;
    medium: number;
    low: number;
  };
}

export interface DailySummary {
  dueToday: number;
  overdue: number;
  completed: number;
  highPriority: number;
  recommendations: string[];
  productivity: {
    completedToday: number;
    completedThisWeek: number;
    completionRate: number;
  };
  urgentActions: {
    overdueHighPriority: number;
    dueTodayHighPriority: number;
  };
}

export interface TaskFilters {
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  search?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  sortBy?: 'title' | 'priority' | 'dueDate' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    timestamp?: string;
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}