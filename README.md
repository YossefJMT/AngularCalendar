# Calendario de Eventos para Gestión Laboral

El proyecto de calendario desarrollado con Angular tiene como objetivo proporcionar una herramienta para la gestión de eventos y programación de actividades tanto para trabajadores como para establecer un calendario escolar. El propósito principal es permitir a los usuarios establecer y visualizar eventos relevantes, asignar tareas y coordinar horarios de manera eficiente.

## Objetivos del Proyecto

- **Gestión de Eventos Laborales**: Permitir a los usuarios programar eventos, asignar tareas y coordinar horarios para los trabajadores de la empresa.

- **Calendario Escolar**: Ofrecer la posibilidad de establecer un calendario escolar para coordinar actividades educativas y vacaciones escolares.

- **Integración con API**: El siguiente paso es integrar el calendario con una API para permitir la gestión de eventos y datos desde una fuente externa.

## Componentes Principales

### `AppComponent`

El componente principal del proyecto, responsable de inicializar el calendario, gestionar la selección de fechas y la lógica de visualización.

#### Propiedades

- `calendar: Calendar`: Instancia del calendario de FullCalendar.
- `showingCalendariEscolar: boolean`: Indica si se está mostrando el calendario escolar.
- `showingInicioAñoEscolar: boolean`: Indica si se está mostrando el inicio del año escolar.
- `selectedIntervals: Intervalo[]`: Array que almacena los intervalos de fechas seleccionados.

#### Métodos Principales

- `initializeCalendar()`: Inicializa el calendario al cargar el componente.
- `toggleCalendariEscolar()`: Alterna la visualización del calendario escolar.
- `showFinalAñoEscolar()`: Muestra el final del año escolar en el calendario.
- `showInicioAñoEscolar()`: Muestra el inicio del año escolar en el calendario.
- `onSelect(arg: DateSelectArg)`: Maneja la selección de fechas en el calendario.

#### Integración con FullCalendar

El componente `AppComponent` utiliza FullCalendar para mostrar el calendario y gestionar eventos. Se configuran diferentes plugins de FullCalendar, como `dayGridPlugin` y `interactionPlugin`, para habilitar funcionalidades como la visualización de días y la selección de fechas.

## Dependencias Externas

- `@fullcalendar/core`: Librería principal de FullCalendar.
- `@fullcalendar/angular`: Integración de FullCalendar con Angular.
- Otras dependencias para estilos y componentes específicos de Angular.

El proyecto ha sido desarrollado con el objetivo de aprender las bases de Angular y proporcionar una funcionalidad útil para la empresa, con la intención de evolucionar hacia una solución más completa e integrada con una API para una gestión más dinámica de eventos y horarios.

Si necesitas más información o detalles específicos, no dudes en preguntar.
