import React, { useEffect } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Calendar,
  Target,
  TrendingUp,
  Archive,
  Flame,
  Lightbulb,
  Zap
} from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import { StatsCard } from './StatsCard';

export function DashboardStats() {
  const { stats, dailySummary, fetchStats, fetchDailySummary, loading } = useTasks();

  useEffect(() => {
    fetchStats();
    fetchDailySummary();
  }, [fetchStats, fetchDailySummary]);

  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-100 rounded-lg p-6 animate-pulse">
            <div className="h-12 bg-gray-200 rounded mb-4"></div>
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const completionRate = stats.completionRate || 0;

  // Calculate productivity based on completion rate
  const getProductivityLevel = (rate: number) => {
    if (rate >= 80) return { level: 'Alta', color: 'bg-green-100 text-green-800' };
    if (rate >= 50) return { level: 'Media', color: 'bg-yellow-100 text-yellow-800' };
    return { level: 'Baja', color: 'bg-red-100 text-red-800' };
  };

  const productivity = getProductivityLevel(completionRate);

  // Use real data from dailySummary when available, otherwise use estimates
  const dueToday = dailySummary?.dueToday ?? Math.floor(stats.pending * 0.1);
  const dueThisWeek = Math.floor(stats.pending * 0.3); // Estimate 30% due this week

  return (
    <div className="space-y-6 mb-8">
      {/* Primary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total de Tareas"
          value={stats.total}
          icon={Archive}
          color="gray"
          description={`${stats.pending} pendientes, ${stats.completed} completadas`}
        />
        
        <StatsCard
          title="Completadas"
          value={stats.completed}
          icon={CheckCircle2}
          color="green"
          description={`${Math.round(completionRate)}% tasa de finalización`}
        />
        
        <StatsCard
          title="Pendientes"
          value={stats.pending}
          icon={Clock}
          color="blue"
          description="Tareas por completar"
        />
        
        <StatsCard
          title="Vencidas"
          value={stats.overdue}
          icon={AlertTriangle}
          color="red"
          description="Requieren atención inmediata"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Vencen Hoy"
          value={dueToday}
          icon={Calendar}
          color="yellow"
          description="Tareas para completar hoy"
        />
        
        <StatsCard
          title="Esta Semana"
          value={dueThisWeek}
          icon={Target}
          color="purple"
          description="Próximas a vencer"
        />
        
        <StatsCard
          title="Alta Prioridad"
          value={stats.byPriority.high}
          icon={Flame}
          color="red"
          description="Tareas críticas"
        />
      </div>

      {/* Daily Summary with Real Data */}
      {dailySummary && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
              Resumen Diario
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Productividad:</span>
              <span className={`font-medium px-2 py-1 rounded-md text-sm ${productivity.color}`}>
                {productivity.level}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-green-600">
                {dailySummary.productivity.completedToday}
              </div>
              <div className="text-sm text-gray-600">Completadas hoy</div>
              <div className="text-xs text-gray-500 mt-1">
                {dailySummary.productivity.completedThisWeek} esta semana
              </div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-yellow-600">
                {dailySummary.dueToday}
              </div>
              <div className="text-sm text-gray-600">Vencen hoy</div>
              <div className="text-xs text-gray-500 mt-1">
                {dailySummary.urgentActions.dueTodayHighPriority} alta prioridad
              </div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-red-600">
                {dailySummary.overdue}
              </div>
              <div className="text-sm text-gray-600">Vencidas</div>
              <div className="text-xs text-gray-500 mt-1">
                {dailySummary.urgentActions.overdueHighPriority} alta prioridad
              </div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-purple-600">
                {dailySummary.highPriority}
              </div>
              <div className="text-sm text-gray-600">Alta prioridad</div>
              <div className="text-xs text-gray-500 mt-1">
                pendientes
              </div>
            </div>
          </div>

          {/* Recommendations Section */}
          {dailySummary.recommendations && dailySummary.recommendations.length > 0 && (
            <div className="bg-white rounded-lg p-4 border border-blue-200 mb-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
                Recomendaciones del día
              </h4>
              <div className="space-y-2">
                {dailySummary.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                    <p className="text-sm text-gray-700">{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Urgent Actions Alert */}
          {(dailySummary.urgentActions.overdueHighPriority > 0 || dailySummary.urgentActions.dueTodayHighPriority > 0) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-semibold text-red-900 mb-2 flex items-center">
                <Zap className="h-4 w-4 mr-2 text-red-500" />
                Acciones urgentes requeridas
              </h4>
              <div className="space-y-1">
                {dailySummary.urgentActions.overdueHighPriority > 0 && (
                  <p className="text-sm text-red-700">
                    • {dailySummary.urgentActions.overdueHighPriority} tarea{dailySummary.urgentActions.overdueHighPriority > 1 ? 's' : ''} de alta prioridad vencida{dailySummary.urgentActions.overdueHighPriority > 1 ? 's' : ''}
                  </p>
                )}
                {dailySummary.urgentActions.dueTodayHighPriority > 0 && (
                  <p className="text-sm text-red-700">
                    • {dailySummary.urgentActions.dueTodayHighPriority} tarea{dailySummary.urgentActions.dueTodayHighPriority > 1 ? 's' : ''} de alta prioridad vence{dailySummary.urgentActions.dueTodayHighPriority > 1 ? 'n' : ''} hoy
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Productivity Metrics */}
          <div className="pt-4 border-t border-blue-200">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">
                  Tasa de finalización: <span className="font-medium text-blue-600">{Math.round(dailySummary.productivity.completionRate)}%</span>
                </span>
                <span className="text-gray-600">
                  Prioridades: <span className="font-medium text-red-600">{stats.byPriority.high} Alta</span>, 
                  <span className="font-medium text-yellow-600 ml-1">{stats.byPriority.medium} Media</span>, 
                  <span className="font-medium text-green-600 ml-1">{stats.byPriority.low} Baja</span>
                </span>
              </div>
              <div className="text-xs text-gray-500">
                Actualizado hace unos momentos
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fallback Summary if no daily summary */}
      {!dailySummary && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
              Resumen del Dashboard
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Productividad:</span>
              <span className={`font-medium px-2 py-1 rounded-md text-sm ${productivity.color}`}>
                {productivity.level}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-blue-600">
                {stats.completed}
              </div>
              <div className="text-sm text-gray-600">Completadas</div>
              <div className="text-xs text-gray-500 mt-1">
                de {stats.total} totales
              </div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-red-600">
                {stats.overdue}
              </div>
              <div className="text-sm text-gray-600">Tareas vencidas</div>
              <div className="text-xs text-gray-500 mt-1">
                {stats.byPriority.high} de alta prioridad
              </div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-purple-600">
                {dueThisWeek}
              </div>
              <div className="text-sm text-gray-600">Próximas esta semana</div>
              <div className="text-xs text-gray-500 mt-1">
                estimadas del total pendiente
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-blue-200">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">
                  Tasa de finalización: <span className="font-medium text-blue-600">{Math.round(completionRate)}%</span>
                </span>
                <span className="text-gray-600">
                  Prioridades: <span className="font-medium text-red-600">{stats.byPriority.high} Alta</span>, 
                  <span className="font-medium text-yellow-600 ml-1">{stats.byPriority.medium} Media</span>, 
                  <span className="font-medium text-green-600 ml-1">{stats.byPriority.low} Baja</span>
                </span>
              </div>
              <div className="text-xs text-gray-500">
                Actualizado hace unos momentos
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}