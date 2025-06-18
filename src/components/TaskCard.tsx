import React, { useState } from 'react';
import { Calendar, Edit2, Trash2, Copy, Clock, CheckCircle2, Circle } from 'lucide-react';
import { Task } from '../types/task';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { formatDate, formatDateTime, isToday, isOverdue, getRelativeDate, getPriorityColor, getPriorityIcon } from '../utils/dateUtils';

interface TaskCardProps {
  task: Task;
  isSelected?: boolean;
  onToggleSelection?: (id: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onChangePriority: (id: string, priority: Task['priority']) => void;
}

export function TaskCard({
  task,
  isSelected = false,
  onToggleSelection,
  onToggleComplete,
  onEdit,
  onDelete,
  onDuplicate,
  onChangePriority,
}: TaskCardProps) {
  const [showActions, setShowActions] = useState(false);

  const priorityColors = getPriorityColor(task.priority);
  const priorityIcon = getPriorityIcon(task.priority);
  const isDueToday = task.dueDate ? isToday(task.dueDate) : false;
  const isDueOverdue = task.dueDate ? isOverdue(task.dueDate) : false;
  const relativeDate = task.dueDate ? getRelativeDate(task.dueDate) : null;

  const handlePriorityChange = (priority: Task['priority']) => {
    onChangePriority(task.id, priority);
  };

  return (
    <div
      className={`bg-white rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 ${
        isSelected ? 'ring-2 ring-blue-500 border-blue-300' : 'border-gray-200'
      } ${task.completed ? 'opacity-75' : ''}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1 min-w-0">
            {onToggleSelection && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleSelection(task.id)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            )}
            
            <button
              onClick={() => onToggleComplete(task.id, !task.completed)}
              className="mt-1 text-gray-400 hover:text-blue-600 transition-colors"
            >
              {task.completed ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <Circle className="h-5 w-5" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className={`text-sm font-medium truncate ${
                  task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                }`}>
                  {task.title}
                </h3>
                <span className="text-lg">{priorityIcon}</span>
              </div>
              
              {task.description && (
                <p className={`text-sm truncate ${
                  task.completed ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {task.description}
                </p>
              )}

              <div className="flex items-center space-x-2 mt-2">
                <Badge variant={task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'info'}>
                  {task.priority.toUpperCase()}
                </Badge>

                {task.dueDate && (
                  <Badge 
                    variant={isDueOverdue ? 'error' : isDueToday ? 'warning' : 'default'}
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    {relativeDate}
                  </Badge>
                )}

                {task.completed && (
                  <Badge variant="success">
                    ✓ Completada
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {showActions && (
            <div className="flex items-center space-x-1 ml-2">
              <Button
                variant="ghost"
                size="sm"
                icon={Edit2}
                onClick={() => onEdit(task)}
                className="p-1.5"
                title="Editar tarea"
              />
              <Button
                variant="ghost"
                size="sm"
                icon={Copy}
                onClick={() => onDuplicate(task.id)}
                className="p-1.5"
                title="Duplicar tarea"
              />
              <Button
                variant="ghost"
                size="sm"
                icon={Trash2}
                onClick={() => onDelete(task.id)}
                className="p-1.5 text-red-600 hover:text-red-700"
                title="Eliminar tarea"
              />
            </div>
          )}
        </div>

        {/* Priority Quick Change */}
        {showActions && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Prioridad:</span>
              <div className="flex space-x-1">
                {['low', 'medium', 'high'].map((priority) => (
                  <button
                    key={priority}
                    onClick={() => handlePriorityChange(priority as Task['priority'])}
                    className={`px-2 py-1 text-xs rounded-md transition-colors ${
                      task.priority === priority
                        ? getPriorityColor(priority as Task['priority'])
                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {priority.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}