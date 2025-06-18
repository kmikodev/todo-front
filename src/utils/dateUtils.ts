export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function isToday(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();
  
  // Normalizar ambas fechas a medianoche para comparar solo el día
  date.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  return date.getTime() === today.getTime();
}

export function isTomorrow(dateString: string): boolean {
  const date = new Date(dateString);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // Normalizar ambas fechas a medianoche
  date.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);
  
  return date.getTime() === tomorrow.getTime();
}

export function isYesterday(dateString: string): boolean {
  const date = new Date(dateString);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Normalizar ambas fechas a medianoche
  date.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);
  
  return date.getTime() === yesterday.getTime();
}

export function isOverdue(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();
  
  // Normalizar ambas fechas a medianoche para comparar solo el día
  date.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  return date.getTime() < today.getTime();
}

export function getRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  
  // Normalizar ambas fechas a medianoche para cálculos precisos
  const normalizedDate = new Date(date);
  const normalizedToday = new Date(today);
  normalizedDate.setHours(0, 0, 0, 0);
  normalizedToday.setHours(0, 0, 0, 0);
  
  const diffTime = normalizedDate.getTime() - normalizedToday.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  // Casos específicos
  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Mañana';
  if (diffDays === -1) return 'Ayer';
  
  // Próximos días (2-7 días)
  if (diffDays > 1 && diffDays <= 7) {
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return dayNames[date.getDay()];
  }
  
  // Días pasados (2-7 días atrás)
  if (diffDays < -1 && diffDays >= -7) {
    return `Hace ${Math.abs(diffDays)} días`;
  }
  
  // Más de una semana en el futuro
  if (diffDays > 7) {
    return formatDate(dateString);
  }
  
  // Más de una semana en el pasado (vencido)
  if (diffDays < -7) {
    return `${formatDate(dateString)} (vencido)`;
  }
  
  return formatDate(dateString);
}

export function getDaysUntilDue(dateString: string): number {
  const date = new Date(dateString);
  const today = new Date();
  
  // Normalizar ambas fechas a medianoche
  date.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  const diffTime = date.getTime() - today.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

export function getPriorityColor(priority: 'low' | 'medium' | 'high'): string {
  switch (priority) {
    case 'high': return 'text-red-600 bg-red-100';
    case 'medium': return 'text-yellow-600 bg-yellow-100';
    case 'low': return 'text-green-600 bg-green-100';
    default: return 'text-gray-600 bg-gray-100';
  }
}

export function getPriorityIcon(priority: 'low' | 'medium' | 'high'): string {
  switch (priority) {
    case 'high': return '🔥';
    case 'medium': return '⚠️';
    case 'low': return '📋';
    default: return '📋';
  }
}

export function getPriorityLabel(priority: 'low' | 'medium' | 'high'): string {
  switch (priority) {
    case 'high': return 'Alta';
    case 'medium': return 'Media';
    case 'low': return 'Baja';
    default: return 'Sin prioridad';
  }
}

// Función para obtener el estado de una fecha
export function getDateStatus(dateString: string): 'overdue' | 'today' | 'tomorrow' | 'upcoming' | 'future' {
  if (isOverdue(dateString)) return 'overdue';
  if (isToday(dateString)) return 'today';
  if (isTomorrow(dateString)) return 'tomorrow';
  
  const daysUntil = getDaysUntilDue(dateString);
  if (daysUntil <= 7) return 'upcoming';
  
  return 'future';
}

// Función para obtener el color del badge según el estado de la fecha
export function getDateBadgeVariant(dateString: string): 'error' | 'warning' | 'info' | 'default' {
  const status = getDateStatus(dateString);
  
  switch (status) {
    case 'overdue': return 'error';
    case 'today': return 'warning';
    case 'tomorrow': return 'info';
    case 'upcoming': return 'info';
    default: return 'default';
  }
}