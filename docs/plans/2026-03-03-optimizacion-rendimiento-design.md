# Diseño de Optimización - GuIAFS

## 1. Arquitectura de Modales Dinámicos
Se reemplazará la repetición de 11 estructuras de modales en `index.html` por un único modal genérico. 

### Cambios en HTML:
- Eliminar los bloques `div.mi-modal-afs` de cada agente.
- Crear un único `div#modalDinamico` con placeholders para el título e ID del historial de chat.
- Actualizar los botones de la grilla para que pasen el `agenteId` a una función de apertura unificada.

### Cambios en JS:
- Crear una función `abrirModalAgente(agenteId)` que:
    1. Actualice el título del modal según el agente.
    2. Limpie o restaure el historial de chat correspondiente.
    3. Muestre el modal.

## 2. Optimización de Memoria y Red (Caching)
Actualmente, cada mensaje dispara un `fetch` al manual `.txt`.

### Cambios en `agente-general.js`:
- Introducir un objeto `globalManualCache = {}`.
- Modificar `enviarMensajeIA` para que primero busque en el cache antes de realizar el `fetch`.

## 3. Limpieza de Rendimiento
Eliminación de archivos que cargan peso innecesario al repositorio o que confunden la estructura del proyecto.

### Archivos a eliminar:
- `components/`: Restos de una instalación de React no utilizada.
- `cubeportfolio/img/*.psd`: Archivos fuente pesados.
- `css/colors/`: Todos excepto `red.css` (a menos que el usuario los quiera conservar para personalización futura, pero el requerimiento es rendimiento máximo). *Nota: Por seguridad, solo eliminaré los que no estén referenciados.*

## 4. Estética Premium
- Asegurar que la transición entre modales sea fluida.
- Refinar el CSS de los mensajes para que se sientan más "vivos" con micro-animaciones (si aplica).

---
**Próximo paso:** Crear el plan de ejecución detallado e implementar los cambios de forma incremental.
