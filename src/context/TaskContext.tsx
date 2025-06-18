import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { Task, TaskStats, DailySummary, TaskFilters } from '../types/task';

interface TaskState {
  tasks: Task[];
  filteredTasks: Task[];
  stats: TaskStats | null;
  dailySummary: DailySummary | null;
  selectedTasks: string[];
  filters: TaskFilters;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  total: number;
}

type TaskAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_TASKS'; payload: { tasks: Task[]; meta?: any } }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_STATS'; payload: TaskStats }
  | { type: 'SET_DAILY_SUMMARY'; payload: DailySummary }
  | { type: 'SET_FILTERS'; payload: TaskFilters }
  | { type: 'TOGGLE_TASK_SELECTION'; payload: string }
  | { type: 'SELECT_ALL_TASKS' }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'BULK_UPDATE'; payload: Task[] };

const initialState: TaskState = {
  tasks: [],
  filteredTasks: [],
  stats: null,
  dailySummary: null,
  selectedTasks: [],
  filters: { page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'desc' },
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  total: 0,
};

function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_TASKS':
      const meta = action.payload.meta;
      return {
        ...state,
        tasks: action.payload.tasks,
        filteredTasks: action.payload.tasks,
        currentPage: meta?.page || 1,
        totalPages: meta?.total ? Math.ceil(meta.total / (meta.limit || 10)) : 1,
        total: meta?.total || action.payload.tasks.length,
        loading: false,
        error: null,
      };
    
    case 'ADD_TASK':
      const newTasks = [action.payload, ...state.tasks];
      return {
        ...state,
        tasks: newTasks,
        filteredTasks: newTasks,
        total: state.total + 1,
      };
    
    case 'UPDATE_TASK':
      const updatedTasks = state.tasks.map(task =>
        task.id === action.payload.id ? action.payload : task
      );
      return {
        ...state,
        tasks: updatedTasks,
        filteredTasks: updatedTasks,
      };
    
    case 'DELETE_TASK':
      const remainingTasks = state.tasks.filter(task => task.id !== action.payload);
      return {
        ...state,
        tasks: remainingTasks,
        filteredTasks: remainingTasks,
        selectedTasks: state.selectedTasks.filter(id => id !== action.payload),
        total: state.total - 1,
      };
    
    case 'SET_STATS':
      return { ...state, stats: action.payload };
    
    case 'SET_DAILY_SUMMARY':
      return { ...state, dailySummary: action.payload };
    
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    
    case 'TOGGLE_TASK_SELECTION':
      const isSelected = state.selectedTasks.includes(action.payload);
      return {
        ...state,
        selectedTasks: isSelected
          ? state.selectedTasks.filter(id => id !== action.payload)
          : [...state.selectedTasks, action.payload],
      };
    
    case 'SELECT_ALL_TASKS':
      return {
        ...state,
        selectedTasks: state.filteredTasks.map(task => task.id),
      };
    
    case 'CLEAR_SELECTION':
      return { ...state, selectedTasks: [] };
    
    case 'BULK_UPDATE':
      const bulkUpdatedTasks = state.tasks.map(task => {
        const updated = action.payload.find(t => t.id === task.id);
        return updated || task;
      });
      return {
        ...state,
        tasks: bulkUpdatedTasks,
        filteredTasks: bulkUpdatedTasks,
        selectedTasks: [],
      };
    
    default:
      return state;
  }
}

interface TaskContextType extends TaskState {
  dispatch: React.Dispatch<TaskAction>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setTasks: (tasks: Task[], meta?: any) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  setStats: (stats: TaskStats) => void;
  setDailySummary: (summary: DailySummary) => void;
  setFilters: (filters: Partial<TaskFilters>) => void;
  toggleTaskSelection: (id: string) => void;
  selectAllTasks: () => void;
  clearSelection: () => void;
  bulkUpdate: (tasks: Task[]) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  const contextValue: TaskContextType = {
    ...state,
    dispatch,
    setLoading: useCallback((loading: boolean) => 
      dispatch({ type: 'SET_LOADING', payload: loading }), []),
    setError: useCallback((error: string | null) => 
      dispatch({ type: 'SET_ERROR', payload: error }), []),
    setTasks: useCallback((tasks: Task[], meta?: any) => 
      dispatch({ type: 'SET_TASKS', payload: { tasks, meta } }), []),
    addTask: useCallback((task: Task) => 
      dispatch({ type: 'ADD_TASK', payload: task }), []),
    updateTask: useCallback((task: Task) => 
      dispatch({ type: 'UPDATE_TASK', payload: task }), []),
    deleteTask: useCallback((id: string) => 
      dispatch({ type: 'DELETE_TASK', payload: id }), []),
    setStats: useCallback((stats: TaskStats) => 
      dispatch({ type: 'SET_STATS', payload: stats }), []),
    setDailySummary: useCallback((summary: DailySummary) => 
      dispatch({ type: 'SET_DAILY_SUMMARY', payload: summary }), []),
    setFilters: useCallback((filters: Partial<TaskFilters>) => 
      dispatch({ type: 'SET_FILTERS', payload: filters }), []),
    toggleTaskSelection: useCallback((id: string) => 
      dispatch({ type: 'TOGGLE_TASK_SELECTION', payload: id }), []),
    selectAllTasks: useCallback(() => 
      dispatch({ type: 'SELECT_ALL_TASKS' }), []),
    clearSelection: useCallback(() => 
      dispatch({ type: 'CLEAR_SELECTION' }), []),
    bulkUpdate: useCallback((tasks: Task[]) => 
      dispatch({ type: 'BULK_UPDATE', payload: tasks }), []),
  };

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}