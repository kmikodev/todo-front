import { useCallback } from 'react';
import { taskService } from '../services/task.service';
import { ApiError } from '../utils/api';
import { useTaskContext } from '../context/TaskContext';
import { Task, TaskFilters } from '../types/task';
import { handleApiError } from '../utils/toast';

export function useTasks() {
  const {
    tasks,
    filteredTasks,
    stats,
    dailySummary,
    selectedTasks,
    filters,
    loading,
    error,
    currentPage,
    totalPages,
    total,
    setLoading,
    setError,
    setTasks,
    addTask,
    updateTask,
    deleteTask,
    setStats,
    setDailySummary,
    setFilters,
    toggleTaskSelection,
    selectAllTasks,
    clearSelection,
    bulkUpdate,
  } = useTaskContext();

  const fetchTasks = useCallback(async (newFilters?: TaskFilters) => {
    setLoading(true);
    setError(null);
    try {
      const filtersToUse = newFilters || filters;
      const response = await taskService.getTasks(filtersToUse);
      setTasks(response.data, response.meta);
      if (newFilters) {
        setFilters(newFilters);
      }
    } catch (error) {
      handleApiError(error, 'Error al cargar las tareas');
      const message = error instanceof ApiError ? error.message : 'Failed to fetch tasks';
      setError(message);
    }
  }, [filters, setLoading, setError, setTasks, setFilters]);

  const createTask = useCallback(async (taskData: Partial<Task>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await taskService.createTask(taskData);
      addTask(response.data);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Error al crear la tarea');
      const message = error instanceof ApiError ? error.message : 'Failed to create task';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, addTask]);

  const editTask = useCallback(async (id: string, taskData: Partial<Task>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await taskService.updateTask(id, taskData);
      updateTask(response.data);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Error al actualizar la tarea');
      const message = error instanceof ApiError ? error.message : 'Failed to update task';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, updateTask]);

  const removeTask = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await taskService.deleteTask(id);
      deleteTask(id);
    } catch (error) {
      handleApiError(error, 'Error al eliminar la tarea');
      const message = error instanceof ApiError ? error.message : 'Failed to delete task';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, deleteTask]);

  const toggleComplete = useCallback(async (id: string, completed: boolean) => {
    try {
      const response = completed 
        ? await taskService.completeTask(id)
        : await taskService.incompleteTask(id);
      updateTask(response.data);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Error al cambiar el estado de la tarea');
      const message = error instanceof ApiError ? error.message : 'Failed to toggle task completion';
      setError(message);
      throw error;
    }
  }, [updateTask, setError]);

  const changePriority = useCallback(async (id: string, priority: Task['priority']) => {
    try {
      const response = await taskService.updatePriority(id, priority);
      updateTask(response.data);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Error al cambiar la prioridad');
      const message = error instanceof ApiError ? error.message : 'Failed to update priority';
      setError(message);
      throw error;
    }
  }, [updateTask, setError]);

  const changeDueDate = useCallback(async (id: string, dueDate: string | null) => {
    try {
      const response = await taskService.updateDueDate(id, dueDate);
      updateTask(response.data);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Error al cambiar la fecha de vencimiento');
      const message = error instanceof ApiError ? error.message : 'Failed to update due date';
      setError(message);
      throw error;
    }
  }, [updateTask, setError]);

  const duplicateTask = useCallback(async (id: string, title?: string) => {
    setLoading(true);
    try {
      const response = await taskService.duplicateTask(id, title);
      addTask(response.data);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Error al duplicar la tarea');
      const message = error instanceof ApiError ? error.message : 'Failed to duplicate task';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, addTask]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await taskService.getStats();
      setStats(response.data);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Error al cargar las estadísticas');
      const message = error instanceof ApiError ? error.message : 'Failed to fetch stats';
      setError(message);
      throw error;
    }
  }, [setStats, setError]);

  const fetchDailySummary = useCallback(async () => {
    try {
      const response = await taskService.getDailySummary();
      setDailySummary(response.data);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Error al cargar el resumen diario');
      const message = error instanceof ApiError ? error.message : 'Failed to fetch daily summary';
      setError(message);
      throw error;
    }
  }, [setDailySummary, setError]);

  const bulkCompleteSelected = useCallback(async () => {
    if (selectedTasks.length === 0) return;
    
    setLoading(true);
    try {
      const response = await taskService.bulkComplete(selectedTasks);
      bulkUpdate(response.data);
      clearSelection();
    } catch (error) {
      handleApiError(error, 'Error al completar las tareas seleccionadas');
      const message = error instanceof ApiError ? error.message : 'Failed to complete selected tasks';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [selectedTasks, setLoading, setError, bulkUpdate, clearSelection]);

  const bulkDeleteSelected = useCallback(async () => {
    if (selectedTasks.length === 0) return;
    
    setLoading(true);
    try {
      await taskService.bulkDelete(selectedTasks);
      selectedTasks.forEach(id => deleteTask(id));
      clearSelection();
    } catch (error) {
      handleApiError(error, 'Error al eliminar las tareas seleccionadas');
      const message = error instanceof ApiError ? error.message : 'Failed to delete selected tasks';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [selectedTasks, setLoading, setError, deleteTask, clearSelection]);

  const deleteAllCompleted = useCallback(async () => {
    setLoading(true);
    try {
      await taskService.deleteAllCompleted();
      // Refresh tasks after deletion
      await fetchTasks();
    } catch (error) {
      handleApiError(error, 'Error al eliminar las tareas completadas');
      const message = error instanceof ApiError ? error.message : 'Failed to delete completed tasks';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, fetchTasks]);

  const searchTasks = useCallback(async (term: string, searchFilters?: Partial<TaskFilters>) => {
    setLoading(true);
    try {
      // Combinar filtros de búsqueda con filtros actuales
      const combinedFilters = {
        ...filters,
        ...searchFilters,
        search: term,
        page: searchFilters?.page || 1, // Reset to page 1 for new searches unless specified
      };
      
      const response = await taskService.searchTasks(term, combinedFilters);
      setTasks(response.data, response.meta);
      setFilters(combinedFilters);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Error al buscar tareas');
      const message = error instanceof ApiError ? error.message : 'Failed to search tasks';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [filters, setLoading, setError, setTasks, setFilters]);

  return {
    // State
    tasks,
    filteredTasks,
    stats,
    dailySummary,
    selectedTasks,
    filters,
    loading,
    error,
    currentPage,
    totalPages,
    total,
    
    // Actions
    fetchTasks,
    createTask,
    editTask,
    removeTask,
    toggleComplete,
    changePriority,
    changeDueDate,
    duplicateTask,
    fetchStats,
    fetchDailySummary,
    bulkCompleteSelected,
    bulkDeleteSelected,
    deleteAllCompleted,
    searchTasks,
    
    // Selection
    toggleTaskSelection,
    selectAllTasks,
    clearSelection,
    
    // Filters
    setFilters,
  };
}