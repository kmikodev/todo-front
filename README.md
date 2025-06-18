# 📋 TodoApp Pro

Una aplicación moderna de gestión de tareas construida con React, TypeScript y Tailwind CSS. Diseñada para ser intuitiva, eficiente y completamente funcional para uso en producción.

![TodoApp Pro](https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop)

## ✨ Características Principales

### 🎯 **Gestión de Tareas Completa**
- ✅ Crear, editar y eliminar tareas
- 🎨 Prioridades visuales (Alta, Media, Baja)
- 📅 Fechas de vencimiento con recordatorios
- 📝 Descripciones detalladas
- 🔄 Estados de completado/pendiente
- 📋 Duplicación rápida de tareas

### 📊 **Dashboard Inteligente**
- 📈 Estadísticas en tiempo real
- 🎯 Métricas de productividad
- 📅 Resumen diario personalizado
- 🔥 Alertas de tareas urgentes
- 💡 Recomendaciones inteligentes

### 🔍 **Búsqueda y Filtros Avanzados**
- 🔎 Búsqueda en tiempo real
- 🏷️ Filtros por estado y prioridad
- 📅 Filtros por rango de fechas
- 🔄 Ordenamiento múltiple
- 📄 Paginación eficiente

### ⚡ **Operaciones Masivas**
- ✅ Completar múltiples tareas
- 🗑️ Eliminación en lote
- 🧹 Limpieza de tareas completadas
- 📊 Selección inteligente

### 🔐 **Autenticación Segura**
- 👤 Sistema de usuarios completo
- 🔒 Login/Registro seguro
- 👥 Usuarios demo para pruebas
- 🎭 Roles de usuario (Admin/Usuario)

### 📱 **Diseño Responsivo**
- 📱 Optimizado para móviles
- 💻 Experiencia desktop completa
- 🎨 Interfaz moderna y elegante
- ⚡ Animaciones fluidas

## 🚀 Tecnologías Utilizadas

### **Frontend**
- ⚛️ **React 18** - Biblioteca de UI moderna
- 📘 **TypeScript** - Tipado estático
- 🎨 **Tailwind CSS** - Framework de estilos
- 🧭 **React Router** - Navegación SPA
- 🎯 **Context API** - Gestión de estado
- 🔧 **Custom Hooks** - Lógica reutilizable

### **Herramientas de Desarrollo**
- ⚡ **Vite** - Build tool ultrarrápido
- 📦 **ESLint** - Linting de código
- 🎨 **PostCSS** - Procesamiento CSS
- 🔍 **TypeScript Compiler** - Verificación de tipos

### **Iconografía y UI**
- 🎨 **Lucide React** - Iconos modernos
- 🍞 **React Toastify** - Notificaciones elegantes
- 🎭 **Tailwind Components** - Componentes personalizados

## 📦 Instalación y Configuración

### **Prerrequisitos**
- Node.js 18+ 
- npm o yarn
- Git

### **Instalación**

```bash
# Clonar el repositorio
git clone https://github.com/kmikodev/todo-front.git
cd todo-front

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### **Variables de Entorno**

Crea un archivo `.env` en la raíz del proyecto:

```env
# API Configuration
VITE_API_URL=https://todolistdb-api.cap.c2developers.com/api
VITE_USE_MOCK_AUTH=true

# App Configuration
VITE_APP_NAME=TodoApp Pro
VITE_APP_VERSION=1.0.0
```

## 🎮 Uso de la Aplicación

### **🔐 Autenticación**

La aplicación incluye usuarios demo para pruebas:

| Usuario | Email | Contraseña | Rol |
|---------|-------|------------|-----|
| Administrador | admin@todoapp.com | admin123 | Admin |
| Usuario Demo | user@todoapp.com | user123 | Usuario |
| María García | maria@todoapp.com | maria123 | Usuario |

### **📋 Gestión de Tareas**

1. **Crear Tarea**: Haz clic en "Nueva Tarea"
2. **Editar**: Hover sobre la tarea y clic en el icono de edición
3. **Completar**: Clic en el círculo junto al título
4. **Eliminar**: Hover y clic en el icono de papelera
5. **Duplicar**: Hover y clic en el icono de copia

### **🔍 Búsqueda y Filtros**

- **Búsqueda**: Escribe en la barra de búsqueda (mínimo 2 caracteres)
- **Filtros de Estado**: Todas, Pendientes, Completadas
- **Filtros de Prioridad**: Alta, Media, Baja
- **Filtros de Fecha**: Selecciona rango de fechas
- **Ordenamiento**: Por fecha, título, prioridad

### **⚡ Operaciones Masivas**

1. Selecciona tareas usando los checkboxes
2. Usa los botones de acción masiva:
   - ✅ **Completar seleccionadas**
   - 🗑️ **Eliminar seleccionadas**
   - 🧹 **Eliminar todas las completadas**

## 🏗️ Arquitectura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── auth/            # Componentes de autenticación
│   ├── layout/          # Componentes de layout
│   └── ui/              # Componentes base de UI
├── context/             # Context providers
├── hooks/               # Custom hooks
├── pages/               # Páginas principales
├── services/            # Servicios de API
├── types/               # Definiciones de TypeScript
└── utils/               # Utilidades y helpers
```

### **🔧 Componentes Principales**

- **`DashboardPage`**: Página principal con todas las funcionalidades
- **`TaskCard`**: Tarjeta individual de tarea
- **`TaskForm`**: Formulario de creación/edición
- **`FilterBar`**: Barra de búsqueda y filtros
- **`DashboardStats`**: Estadísticas y métricas
- **`BulkActions`**: Operaciones masivas

### **🎯 Hooks Personalizados**

- **`useTasks`**: Gestión completa de tareas
- **`useAuth`**: Autenticación y usuarios

### **🔄 Gestión de Estado**

- **AuthContext**: Estado de autenticación
- **TaskContext**: Estado de tareas y filtros
- **Local State**: Estados específicos de componentes

## 🎨 Guía de Estilos

### **🎨 Paleta de Colores**

```css
/* Colores Principales */
--blue-600: #2563eb;      /* Primario */
--green-600: #16a34a;     /* Éxito */
--yellow-600: #ca8a04;    /* Advertencia */
--red-600: #dc2626;       /* Error */
--gray-600: #4b5563;      /* Neutro */
```

### **📏 Sistema de Espaciado**

- Base: 8px (0.5rem)
- Espacios: 4px, 8px, 12px, 16px, 24px, 32px, 48px

### **🔤 Tipografía**

- **Headings**: font-bold, line-height: 1.2
- **Body**: font-normal, line-height: 1.5
- **Small**: text-sm, line-height: 1.4

## 📱 Responsive Design

### **Breakpoints**

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### **Adaptaciones Móviles**

- Navegación colapsible
- Tarjetas apiladas
- Botones táctiles optimizados
- Menús contextuales adaptados

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo

# Construcción
npm run build        # Build de producción
npm run preview      # Preview del build

# Calidad de Código
npm run lint         # Ejecutar ESLint
npm run type-check   # Verificar tipos TypeScript
```

## 🚀 Despliegue

### **Build de Producción**

```bash
npm run build
```


## 🧪 Testing

### **Estrategia de Testing**

- **Unit Tests**: Funciones utilitarias
- **Integration Tests**: Hooks y servicios
- **E2E Tests**: Flujos principales de usuario

### **Herramientas Sugeridas**

- **Vitest**: Testing framework
- **Testing Library**: Testing de componentes
- **Cypress**: Testing E2E

## 🔒 Seguridad

### **Medidas Implementadas**

- ✅ Validación de entrada en formularios
- ✅ Sanitización de datos
- ✅ Gestión segura de tokens
- ✅ Protección de rutas
- ✅ Headers de seguridad

### **Buenas Prácticas**

- Nunca exponer claves API en el frontend
- Validar datos tanto en cliente como servidor
- Usar HTTPS en producción
- Implementar rate limiting

## 🤝 Contribución

### **Proceso de Contribución**

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

### **Estándares de Código**

- Usar TypeScript para todo el código
- Seguir las reglas de ESLint
- Componentes funcionales con hooks
- Nombres descriptivos en inglés
- Comentarios en español para documentación

## 📈 Roadmap

### **v1.1 - Próximas Funcionalidades**
- 🏷️ Sistema de etiquetas
- 📎 Adjuntos en tareas
- 🔔 Notificaciones push
- 📊 Reportes avanzados

### **v1.2 - Mejoras Planificadas**
- 👥 Colaboración en equipo
- 🎨 Temas personalizables
- 📱 App móvil nativa
- 🔄 Sincronización offline


### **Contacto**
- 📧 Email: jcardonavillegas@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/kmikodev/todo-front/issues)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

<div align="center">

**🚀 ¡Hecho con ❤️ para mejorar tu productividad!**

[⭐ Star en GitHub](https://github.com/kmikodev/todo-front) • [🐛 Reportar Bug](https://github.com/kmikodev/todo-front/issues) • [💡 Solicitar Feature](https://github.com/kmikodev/todo-front/issues)

</div>