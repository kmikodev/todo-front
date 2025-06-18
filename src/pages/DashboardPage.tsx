import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { TaskProvider } from '../context/TaskContext';
import { useTasks } from '../hooks/useTasks';
import { DashboardStats } from '../components/DashboardStats';
import { FilterBar } from '../components/FilterBar';
import { BulkActions } from '../components/BulkActions';
import { TaskList } from '../components/TaskList';
import { TaskForm } from '../components/TaskForm';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Task } from '../types/task';
import { showToast, toastMessages } from '../utils/toast';

function DashboardContent() {
  const {
    tasks,
    selectedTasks,
    filters,
    loading,
    error,
    currentPage,
    totalPages,
    total,
    fetchTasks,
    createTask,
    editTask,
    removeTask,
    toggleComplete,
    changePriority,
    duplicateTask,
    searchTasks,
    bulkCompleteSelected,
    bulkDeleteSelected,
    deleteAllCompleted,
    toggleTaskSelection,
    selectAllTasks,
    clearSelection,
    setFilters,
  } = useTasks();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Mostrar errores globales como toast
  useEffect(() => {
    if (error) {
      showToast.error(error);
    }
  }, [error]);

  const handleSearch = (term: string) => {
    if (term.trim()) {
      // Reset to page 1 for new searches
      searchTasks(term, { page: 1 });
    } else {
      // Clear search and fetch all tasks
      const newFilters = { ...filters, search: undefined, page: 1 };
      setFilters(newFilters);
      fetchTasks(newFilters);
    }
  };

  const handleFiltersChange = (newFilters: Partial<typeof filters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    
    // If there's an active search, use searchTasks to maintain search context
    if (updatedFilters.search) {
      searchTasks(updatedFilters.search, updatedFilters);
    } else {
      fetchTasks(updatedFilters);
    }
  };

  const handlePageChange = (page: number) => {
    const updatedFilters = { ...filters, page };
    setFilters(updatedFilters);
    
    // If there's an active search, use searchTasks to maintain search context
    if (filters.search) {
      searchTasks(filters.search, updatedFilters);
    } else {
      fetchTasks(updatedFilters);
    }
  };

  const handleCreateTask = async (taskData: Partial<Task>) => {
    try {
      await createTask(taskData);
      setIsCreateModalOpen(false);
      showToast.success(toastMessages.task.created);
      // Refresh tasks to show the new task
      await fetchTasks();
    } catch (error) {
      console.error('Failed to create task:', error);
      // Error ya manejado por el hook useTasks
    }
  };

  const handleEditTask = async (taskData: Partial<Task>) => {
    if (!editingTask) return;
    
    try {
      await editTask(editingTask.id, taskData);
      setEditingTask(null);
      showToast.success(toastMessages.task.updated);
      // Refresh tasks to show updated data
      await fetchTasks();
    } catch (error) {
      console.error('Failed to edit task:', error);
      // Error ya manejado por el hook useTasks
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      try {
        await removeTask(id);
        showToast.success(toastMessages.task.deleted);
        // Refresh tasks after deletion
        await fetchTasks();
      } catch (error) {
        console.error('Failed to delete task:', error);
        // Error ya manejado por el hook useTasks
      }
    }
  };

  const handleDuplicateTask = async (id: string) => {
    try {
      await duplicateTask(id);
      showToast.success(toastMessages.task.duplicated);
      // Refresh tasks to show the duplicated task
      await fetchTasks();
    } catch (error) {
      console.error('Failed to duplicate task:', error);
      // Error ya manejado por el hook useTasks
    }
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      await toggleComplete(id, completed);
      showToast.success(completed ? toastMessages.task.completed : toastMessages.task.incompleted);
      // Refresh tasks and stats
      await fetchTasks();
    } catch (error) {
      console.error('Failed to toggle task completion:', error);
      // Error ya manejado por el hook useTasks
    }
  };

  const handleChangePriority = async (id: string, priority: Task['priority']) => {
    try {
      await changePriority(id, priority);
      showToast.success(toastMessages.task.priorityChanged);
      // Refresh tasks
      await fetchTasks();
    } catch (error) {
      console.error('Failed to change priority:', error);
      // Error ya manejado por el hook useTasks
    }
  };

  const handleBulkComplete = async () => {
    if (window.confirm(`¿Marcar como completadas ${selectedTasks.length} tarea(s)?`)) {
      try {
        await bulkCompleteSelected();
        showToast.success(toastMessages.bulk.completed(selectedTasks.length));
        // Refresh tasks and stats
        await fetchTasks();
      } catch (error) {
        console.error('Failed to bulk complete tasks:', error);
        // Error ya manejado por el hook useTasks
      }
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`¿Eliminar ${selectedTasks.length} tarea(s) seleccionada(s)?`)) {
      try {
        const count = selectedTasks.length;
        await bulkDeleteSelected();
        showToast.success(toastMessages.bulk.deleted(count));
        // Refresh tasks and stats
        await fetchTasks();
      } catch (error) {
        console.error('Failed to bulk delete tasks:', error);
        // Error ya manejado por el hook useTasks
      }
    }
  };

  const handleDeleteAllCompleted = async () => {
    if (window.confirm('¿Eliminar todas las tareas completadas?')) {
      try {
        await deleteAllCompleted();
        showToast.success(toastMessages.bulk.allCompletedDeleted);
      } catch (error) {
        console.error('Failed to delete completed tasks:', error);
        // Error ya manejado por el hook useTasks
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Gestiona tus tareas de manera eficiente y productiva
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {selectedTasks.length > 0 && (
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {selectedTasks.length} seleccionada{selectedTasks.length > 1 ? 's' : ''}
            </div>
          )}
          
          <Button
            icon={Plus}
            onClick={() => setIsCreateModalOpen(true)}
            className="shadow-sm"
          >
            Nueva Tarea
          </Button>
        </div>
      </div>

      <DashboardStats />

      <FilterBar
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onSearch={handleSearch}
        totalTasks={total}
      />

      <BulkActions
        selectedCount={selectedTasks.length}
        onBulkComplete={handleBulkComplete}
        onBulkDelete={handleBulkDelete}
        onDeleteAllCompleted={handleDeleteAllCompleted}
        onClearSelection={clearSelection}
        loading={loading}
      />

      <TaskList
        tasks={tasks}
        selectedTasks={selectedTasks}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        total={total}
        onToggleSelection={toggleTaskSelection}
        onSelectAll={selectAllTasks}
        onClearSelection={clearSelection}
        onToggleComplete={handleToggleComplete}
        onEdit={setEditingTask}
        onDelete={handleDeleteTask}
        onDuplicate={handleDuplicateTask}
        onChangePriority={handleChangePriority}
        onPageChange={handlePageChange}
      />

      {/* Create Task Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Crear Nueva Tarea"
        size="lg"
      >
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setIsCreateModalOpen(false)}
          loading={loading}
        />
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        title="Editar Tarea"
        size="lg"
      >
        <TaskForm
          task={editingTask}
          onSubmit={handleEditTask}
          onCancel={() => setEditingTask(null)}
          loading={loading}
        />
      </Modal>
    </div>
  );
}

export function DashboardPage() {
  return (
    <TaskProvider>
      <DashboardContent />
    </TaskProvider>
  );
}