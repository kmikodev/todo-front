import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, ArrowUpDown } from 'lucide-react';
import { TaskFilters } from '../types/task';
import { Button } from './ui/Button';

interface FilterBarProps {
  filters: TaskFilters;
  onFiltersChange: (filters: Partial<TaskFilters>) => void;
  onSearch: (term: string) => void;
  totalTasks: number;
}

export function FilterBar({ filters, onFiltersChange, onSearch, totalTasks }: FilterBarProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  // Sync search term with filters
  useEffect(() => {
    setSearchTerm(filters.search || '');
  }, [filters.search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      if (term.length >= 2 || term.length === 0) {
        onSearch(term);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.length >= 2 || searchTerm.length === 0) {
      onSearch(searchTerm);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    onFiltersChange({
      completed: undefined,
      priority: undefined,
      search: undefined,
      dueDateFrom: undefined,
      dueDateTo: undefined,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      page: 1,
    });
  };

  const hasActiveFilters = filters.completed !== undefined || 
    filters.priority !== undefined || 
    filters.search !== undefined ||
    filters.dueDateFrom !== undefined ||
    filters.dueDateTo !== undefined;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar tareas..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </form>

        {/* Status Filter */}
        <div className="flex space-x-2">
          <Button
            variant={filters.completed === undefined ? "primary" : "secondary"}
            size="sm"
            onClick={() => onFiltersChange({ completed: undefined, page: 1 })}
          >
            Todas ({totalTasks})
          </Button>
          <Button
            variant={filters.completed === false ? "primary" : "secondary"}
            size="sm"
            onClick={() => onFiltersChange({ completed: false, page: 1 })}
          >
            Pendientes
          </Button>
          <Button
            variant={filters.completed === true ? "primary" : "secondary"}
            size="sm"
            onClick={() => onFiltersChange({ completed: true, page: 1 })}
          >
            Completadas
          </Button>
        </div>

        {/* Priority Filter */}
        <select
          value={filters.priority || ''}
          onChange={(e) => onFiltersChange({ 
            priority: e.target.value as TaskFilters['priority'] || undefined,
            page: 1 
          })}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Todas las prioridades</option>
          <option value="high">🔴 Alta</option>
          <option value="medium">🟡 Media</option>
          <option value="low">🟢 Baja</option>
        </select>

        {/* Sort */}
        <select
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split('-');
            onFiltersChange({ 
              sortBy: sortBy as TaskFilters['sortBy'],
              sortOrder: sortOrder as TaskFilters['sortOrder'],
              page: 1
            });
          }}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="createdAt-desc">Más recientes</option>
          <option value="createdAt-asc">Más antiguos</option>
          <option value="title-asc">A-Z</option>
          <option value="title-desc">Z-A</option>
          <option value="priority-desc">Prioridad: Alta a Baja</option>
          <option value="priority-asc">Prioridad: Baja a Alta</option>
          <option value="dueDate-asc">Vencimiento: Próximo</option>
          <option value="dueDate-desc">Vencimiento: Lejano</option>
        </select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            icon={Filter}
          >
            Limpiar filtros
          </Button>
        )}
      </div>

      {/* Date Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">Filtrar por fecha:</span>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <input
            type="date"
            value={filters.dueDateFrom || ''}
            onChange={(e) => onFiltersChange({ dueDateFrom: e.target.value || undefined, page: 1 })}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Desde"
          />
          <span className="text-sm text-gray-400 self-center">hasta</span>
          <input
            type="date"
            value={filters.dueDateTo || ''}
            onChange={(e) => onFiltersChange({ dueDateTo: e.target.value || undefined, page: 1 })}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Hasta"
          />
        </div>
      </div>

      {/* Search Results Info */}
      {filters.search && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Resultados para: <span className="font-medium text-gray-900">"{filters.search}"</span>
            </div>
            <div className="text-sm text-gray-500">
              {totalTasks} resultado{totalTasks !== 1 ? 's' : ''} encontrado{totalTasks !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}