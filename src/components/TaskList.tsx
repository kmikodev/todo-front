import React from 'react';
import { Task } from '../types/task';
import { TaskCard } from './TaskCard';
import { Button } from './ui/Button';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  selectedTasks: string[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  total: number;
  onToggleSelection: (id: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onToggleComplete: (id: string, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onChangePriority: (id: string, priority: Task['priority']) => void;
  onPageChange: (page: number) => void;
}

export function TaskList({
  tasks,
  selectedTasks,
  loading,
  currentPage,
  totalPages,
  total,
  onToggleSelection,
  onSelectAll,
  onClearSelection,
  onToggleComplete,
  onEdit,
  onDelete,
  onDuplicate,
  onChangePriority,
  onPageChange,
}: TaskListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Cargando tareas...</span>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📝</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay tareas</h3>
        <p className="text-gray-600">¡Crea tu primera tarea para comenzar!</p>
      </div>
    );
  }

  const allTasksSelected = tasks.length > 0 && tasks.every(task => selectedTasks.includes(task.id));
  const someTasksSelected = selectedTasks.length > 0 && !allTasksSelected;

  return (
    <div className="space-y-4">
      {/* Selection Controls */}
      {tasks.length > 0 && (
        <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={allTasksSelected}
                ref={(input) => {
                  if (input) input.indeterminate = someTasksSelected;
                }}
                onChange={allTasksSelected ? onClearSelection : onSelectAll}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">
                {selectedTasks.length > 0 
                  ? `${selectedTasks.length} tarea${selectedTasks.length > 1 ? 's' : ''} seleccionada${selectedTasks.length > 1 ? 's' : ''}`
                  : 'Seleccionar todas'
                }
              </span>
            </label>
          </div>
          
          {selectedTasks.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
            >
              Limpiar selección
            </Button>
          )}
        </div>
      )}

      {/* Task Cards */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            isSelected={selectedTasks.includes(task.id)}
            onToggleSelection={onToggleSelection}
            onToggleComplete={onToggleComplete}
            onEdit={onEdit}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
            onChangePriority={onChangePriority}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between py-4">
          <div className="text-sm text-gray-700">
            Mostrando {Math.min((currentPage - 1) * 10 + 1, total)} - {Math.min(currentPage * 10, total)} de {total} tareas
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              size="sm"
              icon={ChevronLeft}
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Anterior
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                return (
                  <Button
                    key={page}
                    variant={page === currentPage ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => onPageChange(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="secondary"
              size="sm"
              icon={ChevronRight}
              iconPosition="right"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}