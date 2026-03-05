# Guía de Personalización Técnica - GuÍAFS

Este documento explica cómo realizar modificaciones manuales en la web para adaptar el contenido o la estética sin necesidad de reprogramar toda la arquitectura.

## 1. Modificar la Base de Conocimiento (Manuales)
Cada agente basa sus respuestas en un archivo de texto plano.
- **Ubicación:** Carpeta `manuales/`.
- **Cómo cambiarlo:** Abre el archivo `.txt` correspondiente (ej: `manual_hosting.txt`) y edita el texto.
- **Importante:** La IA leerá automáticamente el nuevo contenido en cuanto guardes el archivo y refresques la página. No necesitas tocar código para actualizar la información de un agente.

## 2. Cambiar la "Personalidad" o Instrucciones de la IA
Si quieres que un agente sea más formal, más corto en sus respuestas o que prioritize ciertos temas:
- **Archivo:** `js/agente-general.js`
- **Sección:** Busca el objeto `AGENTES_CONFIG`.
- **Modificación:** Edita el campo `prompt` del agente deseado. Ahí puedes darle instrucciones directas como: "Habla siempre en tercera persona" o "Usa emoticonos".

## 3. Ajustar Tamaño de Botones y Elementos Visuales
Para cambiar el tamaño del botón "Ver más" u otros elementos de estilo:
- **Archivo:** `css/premium.css`
- **Sección:** Busca la regla `#verMasBtn`.
- **Modificación:**
  - `padding: 12px 50px;` (Aumenta o disminuye estos números para cambiar el tamaño del botón).
  - `font-size: 15px;` (Cambia el tamaño del texto).
  - `border-radius: 50px;` (Hazlo más cuadrado o más redondo).

## 4. Cambiar el Orden o Cantidad de Agentes en la Grilla
La grilla principal usa una tecnología llamada CubePortfolio.
- **Archivo:** `index.html`
- **Sección:** Dentro de `<div id="grid-container">`.
- **Orden:** Simplemente mueve los bloques `<!-- Agente X -->` arriba o abajo.
- **Visibilidad Inicial:** Los agentes con la clase `main-item` son los que se ven antes de pulsar "Ver más". Si quieres ocultar uno, quítale esa clase. Si quieres mostrarlo siempre, añádela.

## 5. Ajustar el Tamaño de las Tarjetas (Cards)
El tamaño de las tarjetas se controla desde dos lugares:

### A. Ancho y Columnas (Estructura)
- **Archivo:** `js/main.js`
- **Sección:** Busca `mediaQueries` dentro de la configuración de CubePortfolio.
- **Modificación:** Cambia el valor de `cols` para cada resolución. 
  - Si aumentas `cols` (ej. de 5 a 6), las tarjetas se harán más pequeñas para que quepan más en una fila.
  - Para el espacio entre tarjetas, ajusta `gapVertical` y `gapHorizontal`.

### B. Altura y Proporción (Estética)
- **Archivo:** `css/premium.css`
- **Sección:** `.cbp-item .fig` (para todas) o `.cbp-item-tall .fig` (para las destacadas).

### C. Personalización Individual por Agente [NUEVO]
Ahora cada tarjeta tiene una clase única para que puedas cambiar una sola sin afectar al resto.
- **Archivo:** `css/premium.css`
- **Sección:** Busca al final "PERSONALIZACIÓN INDIVIDUAL DE AGENTES".
- **Clases disponibles:** 
  - `.agente-general`
  - `.agente-desarrollo`
  - `.agente-hosting`
  - `.agente-sending`
  - `.agente-comunidades`
  - `.agente-apoyo`
  - `.agente-orientaciones`
  - `.agente-relaciones`
  - `.agente-visibilidad`
  - `.agente-finanzas`
  - `.agente-presidentes`
- **Ejemplo:** Para que solo Hosting sea más baja: `.agente-hosting .fig { min-height: 180px; }`.

## 6. Configuración del Proxy (Seguridad)
La web usa un Proxy para ocultar la API Key de Google y evitar bloqueos.
- **Archivo:** `js/agente-general.js`
- **Variable:** `PROXY_URL`.
- **Nota:** Solo debe tocarse si se decide cambiar el servidor de procesamiento de la IA.

## 7. Subir Cambios a GitHub (Git)
Para que los cambios que hagas se vean reflejados en el sitio online, debes seguir este proceso en tu terminal:

1.  **Stage (Preparar)**: `git add .`  
    *(Esto le dice a Git: "Quiero guardar todos los archivos que modifiqué").*
2.  **Commit (Confirmar)**: `git commit -m "Descripción de lo que hiciste"`  
    *(Esto crea un "punto de guardado" con un mensaje explicativo).*
3.  **Push (Subir)**: `git push origin master`  
    *(Esto sube tus cambios locales al servidor de GitHub).*

> [!IMPORTANT]
> Si no haces el **Push**, los cambios solo vivirán en tu computadora y no los verás en la web.

## 8. Escalado Futuro (Grandes Volúmenes de Datos)
Si el proyecto crece hasta tener cientos de manuales o millones de palabras, el sistema está diseñado para evolucionar:

### A. Context Caching (Recomendado)
Cuando los archivos `.txt` superen las 50-100 páginas, se debe habilitar el "Caché de Contexto" de Gemini en el Proxy. Esto permite que la IA "recuerde" el manual sin tener que leerlo desde cero en cada mensaje, reduciendo los costos de tokens hasta en un 90%.

### B. RAG (Retrieval-Augmented Generation)
Para un volumen masivo de información (miles de manuales), el sistema puede integrarse con una base de datos de vectores. Esto permite que la IA busque solo los fragmentos relevantes antes de responder, manteniendo la velocidad y el bajo costo sin importar el tamaño de la base de conocimientos.

---

## 9. Estrategia de Contenido con NotebookLM
Para nutrir los 11 agentes de forma rápida y profesional a partir de tus 500 manuales, sigue este flujo de trabajo en [NotebookLM](https://notebooklm.google.com/):

### Paso a paso eficiente:
1.  **Crea un Notebook por Agente**: No mezcles todo. Crea uno llamado "Agente Hosting", otro "Agente Apoyo", etc.
2.  **Carga las Fuentes**: Sube todos los PDF, Word o enlaces relacionados con esa área específica a su Notebook correspondiente.
3.  **Usa el "Guía del Notebook"**: Antes de pedir el texto, pídele un "Resumen de Temas Clave" para verificar que NotebookLM ha entendido todas las dinámicas de AFS.
4.  **Genera el .txt**: Usa el prompt que te dejo abajo. Una vez generado, copia el resultado en un archivo `.txt` y guárdalo en la carpeta `manuales/` de tu proyecto.

### Prompt Maestro para NotebookLM:
Copia y pega este prompt en el chat de tu Notebook para obtener el contenido perfecto para GuIAFS:

> "Actúa como un Documentalista Experto de AFS. Basándote en todas las fuentes cargadas, genera un manual condensado para un asistente de IA.
> 
> **Objetivo:** Extraer toda la información operativa, reglas, procesos y dinámicas específicas (dinámicas ICL, protocolos de emergencia, pasos de selección, etc.).
> 
> **Requisitos de Formato:**
> 1. Usa títulos claros (ej: # Proceso de Selección de Familias).
> 2. Usa listas de puntos para los pasos.
> 3. Incluye 'Tips de Experiencia' que no suenen técnicos, sino como un consejo de un voluntario veterano a uno nuevo.
> 4. **No resumas**: Si hay un protocolo de 5 pasos, inclúyelos todos. Necesito precisión, no brevedad extrema (el chat se encargará de ser breve, tú dame el conocimiento completo).
> 5. **Tono**: Profesional pero dinámico. Evita el lenguaje puramente administrativo; usa la terminología de AFS (Consejo de Envío, Familia Anfitriona, etc.) de forma natural.
> 
> Genera el contenido estructurado de forma que sea fácil de escanear por una IA."

---

## 10. Cumplimiento de Política de IA AFS (Feb 2025)
Para cumplir con la normativa oficial de AFS, el sistema incorpora medidas de seguridad que debes mantener:

### A. Protección de Datos Sensibles
**ESTRICTAMENTE PROHIBIDO**: No incluyas datos personales (DNI, teléfonos, correos privados, datos médicos) en los archivos `.txt` de los manuales.
- El sistema está diseñado para que la IA responda procesos, no datos individuales de personas reales.

### B. Advertencia de Privacidad
El chat incluye un banner automático que recuerda al usuario no compartir información confidencial. No elimines este aviso de `index.html`.

### C. Veracidad de la Información
El sistema incluye un descargo de responsabilidad (Disclaimer) obligatorio en la página de inicio y en los modales. Según la política de AFS, el usuario debe saber que la IA puede cometer errores y que la fuente oficial siempre es la Oficina Nacional.

### D. Seguridad en los Prompts
Los agentes están programados para detectar y rechazar el procesamiento de datos sensibles. Esta configuración reside en el objeto `SEGURIDAD_PROMPT` dentro de `js/agente-general.js`.

---
*(Fin de la guía)*
