# GuÍAFS: Arquitectura y Funcionamiento del Proyecto

Este documento es una radiografía completa de cómo funciona **GuÍAFS** "por debajo del capó". Está diseñado para ser comprendido tanto por **personas sin conocimientos de programación** (para entender la lógica general del proyecto), como por **desarrolladores o ingenieros** que en el futuro requieran dar mantenimiento o escalar esta herramienta.

---

## 🎯 Filosofía de Diseño: ¿Por qué se construyó así?

El sistema fue diseñado bajo tres premisas fundamentales:
1. **Ligereza extrema:** Debía cargar rápido en celulares con redes móviles lentas, sin pesados *frameworks* de desarrollo (como React o Angular que requieren compilación). Se usó Javascript, HTML y CSS "Vanilla" (puro).
2. **Modularidad Ilusoria:** Aunque el usuario siente que hay "10 agentes distintos" con cerebros distintos, a nivel técnico **hay un solo cerebro** que cambia de "disfraz" y de "reglas de comportamiento" en milisegundos dependiendo de qué tarjeta se haga clic. Esto ahorra muchísimo código y evita fallos.
3. **Seguridad Total:** Las claves maestras (API Keys) de la Inteligencia Artificial de Google Gemini **no existen en este código**. Si alguien inspecciona la página web, jamás podrá robar la credencial de AFS. Toda la inteligencia recae en un túnel seguro (Proxy) alojado en los servidores de Google Apps Script.

---

## 🏗️ 1. El Esqueleto Visual: `index.html`

### 🗣️ Para perfiles no técnicos
Piensa en el archivo `index.html` como los planos estructurales de una casa. Es el encargado de definir dónde van las paredes (las tarjetas cuadradas de cada agente), dónde van las ventanas y dónde se ubica el techo (el logotipo de AFS). 
Aquí también vive un elemento "mágico": **La Ventana de Chat**. En lugar de construir 10 ventanas de chat distintas (una para cada agente, lo que sería como construir 10 baños iguales en una casa pequeña), construimos **una sola ventana oculta**. Cuando tú haces clic en el "Agente de Hosting", esa ventana única aparece volando, cambia su título automáticamente a "Hosting" y limpia sus mensajes para simular que entraste a una sala privada.

### 💻 Para Desarrolladores 
El archivo sigue la convención estándar de HTML5 semántico.
*   **Grilla y Rendimiento:** Se utilizan librerías base como *Bootstrap* y *CubePortfolio* para gestionar la grilla o mosaico de agentes. 
*   **Single-Modal Architecture (DRY):** En lugar de tener un DOM gigantesco iterando modales `<div id="modal-X">`, existe un único modal (`#modalDinamico`). Al disparar la función `abrirModalAgente('id')`, el Javascript reinyecta el HTML interno del modal, inyecta su historial pertinente y lo muestra mediante un `.fadeIn()`. Esto respeta el principio DRY (Don't Repeat Yourself) y mantiene el peso del archivo HTML mínimo.
*   **Stacking Context (Z-Index):** El diseño prioriza que las ventanas floten sobre cualquier elemento. Para evitar conflictos ("Stacking Context"), el Modal y su contenedor oscuro fueron desplazados al final del archivo, fuera de la capa base (Clase `wrapper`), asegurando dominio total en la cascada visual (Z-Index `99999`).

### ⚙️ Cómo Modificarlo
*   **Agregar un Agente:** Se debe copiar un elemento `<div class="cbp-item">`, pegarlo a continuación, cambiar la imagen de portada y editar el evento `onclick="abrirModalAgente('nuevo_id')"` apuntando al ID del nuevo agente.
*   **Modificar Textos Estáticos:** Los textos del pie de página o la advertencia amarilla de arriba se buscan y editan directamente como texto plano aquí.

---

## 🎨 2. El Maquillaje y Estilo: `css/premium.css` y `css/style.css`

### 🗣️ Para perfiles no técnicos
Si el HTML era el esqueleto, los archivos CSS son la pintura, las luces y la decoración. El archivo `style.css` es la pintura base que traía el diseño original, pero el archivo **`premium.css`** es un maquillaje de lujo que añadimos exclusivamente para AFS. 
Este "maquillaje premium" es el responsable de que GuIAFS tenga ese **Modo Oscuro** moderno, colores negros profundos (para no cansar la vista de los voluntarios), que el logotipo de AFS sea de un azul perfecto brillante, y controla detalles hermosos como la animación de los *tres puntitos rebotando* cuando la Inteligencia Artificial está pensando la respuesta.

### 💻 Para Desarrolladores
*   **Override de Estilos (Cascada):** El archivo `premium.css` se carga *después* del archivo de estilos genéricos. Usa alta especificidad y variables de CSS modernas para anular (sobreescribir) colores claros y bordes toscos de la biblioteca original, forzando la paleta de AFS.
*   **Responsividad (Media Queries):** Aquí habitan las sentencias `@media (max-width: 600px)` que le avisan al navegador: *"Si estás siendo visto desde la pantalla pequeña de un iPhone o Android, haz que los textos midan el doble, que el botón de enviar flote perfectamente a la derecha y no haya barras de desplazamiento grises"*.
*   **Animaciones Keyframes:** Aloja animaciones CSS inyectadas por hardware (mucho más fluidas que animaciones JS), como `typingDot` para simular asincronía y humanidad en la respuesta, y transiciones `ease-in-out`.

### ⚙️ Cómo Modificarlo
*   Para hacer ajustes profundos de color (si AFS dictamina un nuevo Hexadecimal de marca corporativa), simplemente se hace un "Buscar y Reemplazar" del código de color oscuro o azul en `premium.css`.

---

## 🧠 3. El Cerebro Inteligente: `js/agente-general.js`

### 🗣️ Para perfiles no técnicos
Este es el "Director de Orquesta" de toda la web. Este archivo invisible toma todas las decisiones lógicas y rápidas que tú no ves:
1.  **Sabe quién es quién:** Tiene un directorio interno diciendo: *"Si hacen clic en Desarrollo, entonces debo comportarme como un agente motivador"*. *"Si hacen clic en Finanzas, debo ser estricto y numérico"*.
2.  **El Mensajero Secreto:** Cuando tú tipeaste tu consulta y apretaste *Enviar*, este archivo empaqueta tu duda, le suma todos los mensajes anteriores para "no perder el hilo de la charla", le pega las reglas del agente y se lo manda por un túnel secreto a Google.
3.  **El Traductor:** Cuando Google devuelve la inteligencia (la respuesta textual), a veces devuelve "caracteres informáticos" o símbolos extraños (ej. `**hola**`). El traductor automático lee eso y te lo transforma en texto bonito, espaciado y en **letras negritas redonditas** para que sea placentero de leer. También transforma enlaces en clics azules automáticos.

### 💻 Para Desarrolladores
Toda la lógica de negocio y arquitectura de Controladores reside aquí:
*   **El Diccionario de Roles (JSON):** `configAgentes` es un objeto que contiene los *Meta-Prompts* y lineamientos duros (Role-playing) que se inyectarán en la cabecera de la constulta.
*   **Multi-Historial:** Maneja la array bidimensional `historiales[agenteId]`. Gracias a esto, si un usuario está chateando con el agente de Visibilidad, lo cierra y se abre el agente de Finanzas, ambos tienen su propia lista de mensajes de ida y vuelta guardados en memoria volátil de la sesión.
*   **Protección de API y Seguridad (Proxy Fetching):** El código hace llamadas asíncronas (`async/await`) usando la API `fetch` hacia un túnel seguro **(Google Apps Script - PROXY_URL)**. La arquitectura prohíbe conexiones directas desde el Front-End (Cliente) hacia Gemini para evadir el robo de la llave de facturación privada de AFS. 
*   **Markdown Parsing:** Gemini retorna lenguaje Markdown por defecto. En JS se incluyeron expresiones regulares (Regex) de alta eficiencia como `/\*\*(.*?)\*\*/g` que re-formatean asteriscos a etiquetas nativas `<strong>` y procesan los enlaces para encapsularlos en `<a>` tags con target explícito al aire.
*   **Tolerancia a fallos:** Previendo errores recurrentes en planes gratuitos de servidores IA (error 429), el script incluye "failovers" y control de decepción suave: notifica amigablemente al voluntario si el servidor de Google explotó para que espere un ratito.

### ⚙️ Cómo Modificarlo
*   **Para calibrar a un Agente:** Si un agente está respondiendo muy seco o muy informal, el desarrollador (o el usuario) debe ir a este archivo y modificar su bloque `prompt:` sumando reglas claras de personalidad a la cadena de texto (Ej. *"A partir de ahora responde siempre listando pros y contras"*).
*   **Nuevos Agentes:** Se añade una nueva ID dentro de la variable `configAgentes` siguiendo la nomenclatura y agregándole su bloque de reglas. Todo lo demás se auto-enlaza.

---
*Nota: Este diseño modular y en "Capa Estática Frontal" asegura un Costo $0 de hosting para la organización, ya que al carecer de un servidor pesado (Server-Side), todo puede ser alojado libremente en Github Pages para cientos de voluntarios.*
