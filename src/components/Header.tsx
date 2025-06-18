import React from 'react';
import { Plus, BarChart3, Calendar, CheckSquare } from 'lucide-react';
import { Button } from './ui/Button';

interface HeaderProps {
  onCreateTask: () => void;
  selectedTasksCount: number;
}

export function Header({ onCreateTask, selectedTasksCount }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <CheckSquare className="h-8 w-8 mr-3 text-blue-600" />
            TodoApp Pro
          </h1>
          <p className="text-gray-600 mt-1">
            Gestiona tus tareas de manera eficiente y productiva
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {selectedTasksCount > 0 && (
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {selectedTasksCount} seleccionada{selectedTasksCount > 1 ? 's' : ''}
            </div>
          )}
          
          <Button
            icon={Plus}
            onClick={onCreateTask}
            className="shadow-sm"
          >
            Nueva Tarea
          </Button>
        </div>
      </div>
    </header>
  );
}