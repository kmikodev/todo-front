import React from 'react';
import { CheckCircle2, Trash2, X } from 'lucide-react';
import { Button } from './ui/Button';

interface BulkActionsProps {
  selectedCount: number;
  onBulkComplete: () => void;
  onBulkDelete: () => void;
  onDeleteAllCompleted: () => void;
  onClearSelection: () => void;
  loading?: boolean;
}

export function BulkActions({
  selectedCount,
  onBulkComplete,
  onBulkDelete,
  onDeleteAllCompleted,
  onClearSelection,
  loading = false,
}: BulkActionsProps) {
  if (selectedCount === 0) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-blue-900">Operaciones masivas</h3>
            <p className="text-sm text-blue-700 mt-1">
              Selecciona tareas para realizar acciones en lote
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={onDeleteAllCompleted}
            loading={loading}
            icon={Trash2}
          >
            Eliminar completadas
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-600 text-white rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h3 className="font-medium">
              {selectedCount} tarea{selectedCount > 1 ? 's' : ''} seleccionada{selectedCount > 1 ? 's' : ''}
            </h3>
            <p className="text-blue-100 text-sm">
              Elige una acción para aplicar a todas las tareas seleccionadas
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="success"
            size="sm"
            icon={CheckCircle2}
            onClick={onBulkComplete}
            loading={loading}
          >
            Marcar completadas
          </Button>
          
          <Button
            variant="danger"
            size="sm"
            icon={Trash2}
            onClick={onBulkDelete}
            loading={loading}
          >
            Eliminar
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            icon={X}
            onClick={onClearSelection}
            className="text-blue-100 hover:text-white hover:bg-blue-700"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}