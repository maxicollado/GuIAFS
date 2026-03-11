# Nueva Metodología de Trabajo: GuIAFS v1.0 (Modo Protegido)

Con la implementación del blindaje técnico, la forma en que modificamos el proyecto ha cambiado para ser más segura y profesional. Aquí tienes el nuevo mapa de ruta:

---

## 1. ¿Cómo editar el "Diseño" (Lo Visual)?
Esto sigue siendo igual de sencillo que antes. 
*   **Colores, Botones, Animaciones:** Editas el archivo `css/style.css`.
*   **Contenidos, Textos de la Web, Agentes:** Editas el archivo `index.html`.
*   **Resultado:** Al subir los cambios a GitHub, la web se actualiza como siempre.

---

## 2. ¿Cómo editar el "Cerebro" (Lógica e Instrucciones)?
**¡Aquí está el gran cambio!** Las instrucciones (Prompts) ya no están en los archivos que subes a GitHub. Ahora viven en tu **Google Apps Script**.
*   **Para cambiar un Prompt:** Debes entrar a tu consola de Google Apps Script y editar la variable correspondiente al agente.
*   **Ventaja:** Nadie que entre a tu GitHub podrá saber qué "personalidad" o reglas le diste a cada agente.

---

## 3. ¿Cómo editar el "Conocimiento" (Manuales)?
Esto se mantiene fácil pero más seguro:
*   Para actualizar la información que conoce un agente, reemplazas o editas el archivo `.txt` en la carpeta `manuales/`.
*   **Ojo:** El servidor ahora leerá estos archivos directamente. Asegúrate de no borrar archivos que el servidor espera encontrar.

---

## 4. Gestión del Repositorio (GitHub)
*   **Historial Limpio:** A partir de ahora, cada vez que hagamos un cambio importante, podemos elegir si queremos mantener el historial o volver a hacer un "Squash" para que el público solo vea el producto final y no "la cocina" del desarrollo.
*   **Protección de API:** Recuerda que la URL de tu Proxy (`AKfy...`) es lo único que conecta tu web con el cerebro. No la compartas.

---

## Resumen de Archivos Clave:
1.  `index.html`: Estructura y textos públicos.
2.  `css/style.css`: Toda la estética unificada.
3.  `js/agente-general.js`: El mensajero (le indica al servidor quién habla, pero no qué decir).
4.  **Google Apps Script (Externo)**: El centro de inteligencia donde residen los Prompts protegidos.

---
**Nota:** Te entregaré a continuación el código que debes pegar en tu Google Apps Script para que esta nueva estructura empiece a funcionar.
