import { toast, ToastOptions } from 'react-toastify';

// Configuración por defecto para los toasts
const defaultOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: 'light',
};

// Configuraciones específicas por tipo
const successOptions: ToastOptions = {
  ...defaultOptions,
  autoClose: 3000,
};

const errorOptions: ToastOptions = {
  ...defaultOptions,
  autoClose: 6000,
};

const warningOptions: ToastOptions = {
  ...defaultOptions,
  autoClose: 5000,
};

const infoOptions: ToastOptions = {
  ...defaultOptions,
  autoClose: 4000,
};

// Funciones de utilidad para mostrar diferentes tipos de notificaciones
export const showToast = {
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, { ...successOptions, ...options });
  },

  error: (message: string, options?: ToastOptions) => {
    toast.error(message, { ...errorOptions, ...options });
  },

  warning: (message: string, options?: ToastOptions) => {
    toast.warning(message, { ...warningOptions, ...options });
  },

  info: (message: string, options?: ToastOptions) => {
    toast.info(message, { ...infoOptions, ...options });
  },

  // Para errores de API con más contexto
  apiError: (error: any, defaultMessage: string = 'Ha ocurrido un error') => {
    const message = error?.message || error?.data?.message || defaultMessage;
    toast.error(message, errorOptions);
  },

  // Para operaciones de carga
  loading: (message: string) => {
    return toast.loading(message, {
      position: 'top-right',
      theme: 'light',
    });
  },

  // Para actualizar un toast de carga
  updateLoading: (toastId: any, type: 'success' | 'error', message: string) => {
    const options = type === 'success' ? successOptions : errorOptions;
    toast.update(toastId, {
      render: message,
      type,
      isLoading: false,
      ...options,
    });
  },

  // Para operaciones bulk con progreso
  promise: <T>(
    promise: Promise<T>,
    messages: {
      pending: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(promise, messages, {
      position: 'top-right',
      theme: 'light',
    });
  },
};

// Mensajes predefinidos para operaciones comunes
export const toastMessages = {
  task: {
    created: '✅ Tarea creada exitosamente',
    updated: '✅ Tarea actualizada correctamente',
    deleted: '🗑️ Tarea eliminada',
    completed: '✅ Tarea marcada como completada',
    incompleted: '↩️ Tarea marcada como pendiente',
    duplicated: '📋 Tarea duplicada exitosamente',
    priorityChanged: '🎯 Prioridad actualizada',
    dueDateChanged: '📅 Fecha de vencimiento actualizada',
  },
  bulk: {
    completed: (count: number) => `✅ ${count} tarea${count > 1 ? 's' : ''} completada${count > 1 ? 's' : ''}`,
    deleted: (count: number) => `🗑️ ${count} tarea${count > 1 ? 's' : ''} eliminada${count > 1 ? 's' : ''}`,
    allCompletedDeleted: '🧹 Todas las tareas completadas han sido eliminadas',
  },
  api: {
    networkError: '🌐 Error de conexión. Verifica tu conexión a internet',
    serverError: '⚠️ Error del servidor. Inténtalo de nuevo más tarde',
    notFound: '❌ Recurso no encontrado',
    unauthorized: '🔒 No tienes permisos para realizar esta acción',
    validationError: '⚠️ Los datos proporcionados no son válidos',
    timeout: '⏱️ La operación ha tardado demasiado tiempo',
  },
  general: {
    loading: '⏳ Cargando...',
    saving: '💾 Guardando...',
    deleting: '🗑️ Eliminando...',
    updating: '🔄 Actualizando...',
    success: '✅ Operación completada exitosamente',
    error: '❌ Ha ocurrido un error inesperado',
    cancelled: '❌ Operación cancelada',
    noChanges: 'ℹ️ No hay cambios para guardar',
  },
};

// Función para manejar errores de API de manera consistente
export const handleApiError = (error: any, context?: string) => {
  console.error('API Error:', error);

  let message = toastMessages.general.error;

  if (error?.status) {
    switch (error.status) {
      case 400:
        message = error.message || toastMessages.api.validationError;
        break;
      case 401:
        message = toastMessages.api.unauthorized;
        break;
      case 404:
        message = toastMessages.api.notFound;
        break;
      case 500:
        message = toastMessages.api.serverError;
        break;
      case 0:
        message = toastMessages.api.networkError;
        break;
      default:
        message = error.message || toastMessages.api.serverError;
    }
  } else if (error?.message) {
    message = error.message;
  }

  if (context) {
    message = `${context}: ${message}`;
  }

  showToast.error(message);
};