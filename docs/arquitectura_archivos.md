# Arquitectura Técnica de GuIAFS

Este documento detalla la estructura, funcionalidad y métodos de modificación de los **tres archivos pilares** que hacen funcionar el asistente de inteligencia artificial y su interfaz gráfica. Resulta fundamental para la venta técnica o el mantenimiento por parte de otros desarrolladores.

---

## 1. `index.html` (Estructura Base y Modales)

Es el esqueleto del proyecto web. Se encarga de cargar los recursos visuales, definir la presentación de los agentes en una grilla interactiva y alojar el **Modal Dinámico** (la ventana de chat unificada).

### Construcción y Código Clave

El archivo está construido en HTML5 semántico y recurre a librerías externas (como Bootstrap y CubePortfolio) para la grilla iterativa. 

Una de las piezas más importantes es la definición del modal, que a diferencia de otros sistemas que tienen 10 modales (uno por agente), aquí iteramos sobre un **único modal** que cambia dinámicamente su contenido gracias al Javascript.

```html
<!-- Modal Dinámico Único -->
<div id="modalDinamico" class="mi-modal-afs">
    <div class="mi-modal-contenido">
        <!-- Ícono dinámico y título -->
        <h3 id="modal-titulo">...</h3>
        
        <div class="chat-container">
            <!-- Banner Legal -->
            <div class="privacy-banner">
                <i class="fas fa-user-shield"></i> No ingreses datos personales...
            </div>
            
            <!-- Aquí Javascript inyectará los mensajes -->
            <div id="chat-historial-dinamico"></div>
            
            <!-- Input de envío -->
            <input type="text" id="chat-input-dinamico" placeholder="Escribe tu consulta...">
            <button onclick="enviarMensajeIA()"><i class="fas fa-paper-plane"></i></button>
        </div>
    </div>
</div>
```

### Funcionalidad

1.  **Carga de dependencias:** Llama a los archivos CSS (incluyendo `premium.css`) y JS (`agente-general.js`).
2.  **Renderizado del Menú:** Muestra la grilla de cartas de "Agentes" (Comunidades, Hosting, Sending, etc.).
3.  **Llamada a Modales:** Al hacer clic en un agente (por ejemplo, `onclick="abrirModalAgente('hosting')"`), no se abre una nueva página, sino que se invoca al Modal Dinámico y se le pasa el parámetro del agente correspondiente.

### Modificaciones Posibles

*   **Agregar un nuevo agente a la grilla:** Simplemente se copia un bloque `<div class="cbp-item">` en la sección de grid, y se cambia la imagen y la función `onclick="abrirModalAgente('nuevo_agente')"` asignándole su ID respectivo.
*   **Modificar Textos Estáticos:** Los textos de bienvenida o las advertencias del `<header>` se modifican directamente aquí.
*   **Añadir Scripts Analíticos:** Para fines de rastreo (como Google Analytics), se pueden añadir las etiquetas en la sección `<head>`.

---

## 2. `css/premium.css` (Diseño y Estilización Avanzada)

Este archivo actúa como una "Capa Superior" de diseño que sobreescribe (hace override) sobre la plantilla original. De esta forma, GuIAFS obtiene un aspecto estético 100% pulido y profesional ("Premium Dark Mode").

### Construcción y Código Clave

Utiliza la especificidad de CSS y, en ocasiones, el flag `!important` para asegurar que las reglas antiguas de la plantilla sean anuladas. Gestiona el diseño de las sombras, las animaciones, y capas (Z-Index).

```css
/* Modales con Alta Elevación (Profundidad Visual) */
.mi-modal-contenido {
    background-color: #111111;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    box-shadow: 0 30px 70px rgba(0, 0, 0, 0.95) !important;
    z-index: 999999 !important; /* Capa superior absoluta */
    color: #ffffff;
}

/* Indicador de Escritura (Typing Animation) */
.typing-indicator span {
    width: 7px;
    height: 7px;
    background: #a0a0a0;
    border-radius: 50%;
    animation: typingDot 1.2s infinite ease-in-out;
}
@keyframes typingDot {
    30% { transform: translateY(-6px); opacity: 1; }
}
```

### Funcionalidad

1.  **Diseño del Chat:** Formatea los contenedores de los mensajes, el input de escritura y el botón azul AFS para enviar.
2.  **Dark Mode:** Convierte la paleta a tonos de grises y oscuros reales (`#111111`, `#0a0a0a`) para generar una interfaz no cansadora a la vista.
3.  **Animaciones Fluidas:** Otorga vida a los elementos, por ejemplo, mediante `@keyframes` hace rebotar los 3 puntitos de "...escribiendo" o agrega efectos hover a los botones.

### Modificaciones Posibles

*   **Cambio de Paleta Oficial:** Si la marca cambia sus colores, se puede hacer un _Find & Replace_ en este archivo del color `#007ac2` (Azul AFS).
*   **Alturas Dinámicas:** La clase `.agente-general .fig` tiene un alto distinto a las demás. Aquí se pueden configurar tamaños específicos por cada tarjeta.
*   **Comportamiento Móvil:** Utiliza `@media (max-width: 600px)` para modificar cómo se ven los chats en celulares (ocupando toda la pantalla).

---

## 3. `js/agente-general.js` (Lógica e Inteligencia Artificial)

Es el **Cerebro Inteligente** del sistema. Escrito en Javascript, maneja la interacción con la API de IA (vía Google Apps Script Proxy) y el funcionamiento general de los mensajes de la interfaz de usuario.

### Construcción y Código Clave

Este archivo requiere varios diccionarios (objetos JSON) internos para cargar comportamientos diferentes según qué agente es clickeado.

```javascript
// 1. URL Protectora (Proxy a Gemini)
const PROXY_URL = 'https://script.google.com/macros/s/EL_PROXY_APP_SCRIPT_URL/exec';

// 2. Base de Configuración y Prompting
const configAgentes = {
    'hosting': {
        nombre: 'Agente Hosting',
        // Inserción del manual de rol como Prompt
        contextoPrompt: "Eres un experto en procesos de Hosting para familias anfitrionas. Usa las reglas del manual oficial..." 
    },
    'visibilidad': {
        nombre: 'Agente Visibilidad',
        contextoPrompt: "Asistes a voluntarios sobre comunicación y prensa. Asegura adherencia a la marca AFS..."
    }
    // ... más agentes
};

// 3. Método de Petición (Envío y Recepción AI)
async function enviarMensajeIA() {
    // a. Renderiza mensaje del usuario en el HTML
    // ...
    
    // b. Fetch a la red con Timeout y Try/Catch
    try {
        const payload = {
            pregunta: preguntaUsuario,
            contexto: configAgentes[agenteActual].contextoPrompt,
            role: agenteActual 
        };

        const response = await fetch(PROXY_URL, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        
        // c. Renderiza la respuesta al usuario
    } catch (error) {
        // Manejo de Error Seguro
    }
}
```

### Funcionalidad

1.  **Abre Modales:** Escucha qué agente abriste, inserta su título (`configAgentes[ID].nombre`), limpia el historial viejo si lo hubiera y reproduce el mensaje de "saludo" del agente.
2.  **Seguridad y Conexión:** Utiliza una URL proxy para comunicarse. Esto se hace previendo que subir la clave (API Key) cruda a Github supone un fallo de seguridad grave.
3.  **Markdown Rendering:** La IA de Gemini retorna Markdown (Ej. `**Negrita**`). Este archivo incluye un un parser (Regex) simplificado para transformar todo ese Markdown a HTML nativo y que se visualice correctamente (como negritas, listas o guiones) dentro de la interfaz del chat.

### Modificaciones Posibles

*   **Añadir un Agente Nuevo:** Agregar el nuevo ID dentro de `configAgentes`, definir su "nombre" y crear un fuerte "Prompt" que incluya las guías y directrices que ese rol necesita respetar.
*   **Modificar Saludos:** Existe una variable `greetingMessages` en otros scripts; pero si se quiere alterar su comportamiento logístico se edita aquí.
*   **Ajustar Parser:** Si la IA empieza a retornar estructuras de Markdown muy complejas (como Tablas completas tipo Github `|---|`), se deben añadir funciones Regex para transformar tablas o usar librerías externas de Markdown-to-HTML.
