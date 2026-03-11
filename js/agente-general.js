/* ==============================================================
   AGENTES DE INTELIGENCIA ARTIFICIAL (API GEMINI + MANUALES)
   ============================================================== */

// El Proxy oculta la clave API para que GitHub no la bloquee
const PROXY_URL = 'https://script.google.com/macros/s/AKfycbwelrFL4Zf3qobc9dyzsJr7o-ssi5MWre7Ba273MePG2Ei4_6SmPcFpZ5gUtDt-F964WQ/exec';

const AGENTES_CONFIG = {
    'general': {
        nombre: '',
        manual: 'manuales/manual_general.txt'
    },
    'hosting': {
        nombre: '',
        manual: 'manuales/manual_hosting.txt'
    },
    'sending': {
        nombre: '',
        manual: 'manuales/manual_sending.txt'
    },
    'comunidades': {
        nombre: '',
        manual: 'manuales/manual_comunidades.txt'
    },
    'visibilidad': {
        nombre: '',
        manual: 'manuales/manual_visibilidad.txt'
    },
    'orientaciones': {
        nombre: '',
        manual: 'manuales/manual_orientaciones.txt'
    },
    'presidentes': {
        nombre: '',
        manual: 'manuales/manual_presidentes.txt'
    },
    'finanzas': {
        nombre: '',
        manual: 'manuales/manual_finanzas.txt'
    },
    'relaciones': {
        nombre: '',
        manual: 'manuales/manual_relaciones.txt'
    },
    'desarrollo': {
        nombre: '',
        manual: 'manuales/manual_desarrollo.txt'
    },
    'apoyo': {
        nombre: '',
        manual: 'manuales/manual_apoyo.txt'
    }
};

// Historial de conversación independiente por agente
let historiales = {
    'general': [], 'hosting': [], 'sending': [], 'comunidades': [],
    'visibilidad': [], 'orientaciones': [], 'presidentes': [],
    'finanzas': [], 'relaciones': [], 'desarrollo': [], 'apoyo': []
};

// --- OPTIMIZACIÓN: CACHE DE MANUALES ---
let globalManualCache = {};
let currentAgenteId = null;

/**
 * Abre el modal dinámico configurando el agente seleccionado.
 * @param {string} agenteId ID del agente según AGENTES_CONFIG
 */
function abrirModalAgente(agenteId) {
    currentAgenteId = agenteId;
    const config = AGENTES_CONFIG[agenteId];
    if (!config) return;

    // --- ESCALADO DIFERENCIAL PARA AGENTE GENERAL ---
    const modalContenido = $('.mi-modal-contenido');
    if (agenteId === 'general') {
        modalContenido.css({
            'max-width': '1300px',
            'width': '96%',
            'margin': '2% auto'
        });
        $('#chat-historial-dinamico').parent().css('height', '78vh');
    } else {
        modalContenido.css({
            'max-width': '1100px',
            'width': '92%',
            'margin': '3% auto'
        });
        $('#chat-historial-dinamico').parent().css('height', '70vh');
    }

    // Actualizar título e ícono
    const nombreDisplay = config.nombre || (agenteId.charAt(0).toUpperCase() + agenteId.slice(1));
    $('#modal-titulo').html(`<i class="fas fa-robot" style="color:#007ac2;"></i> ${nombreDisplay}`);

    // Limpiar input
    $('#chat-input-dinamico').val('');

    // Configurar el contenedor de historial dinámico
    const historialContainer = $('#chat-historial-dinamico');
    historialContainer.html(''); // Limpiar vista actual

    // Si hay historial previo, lo cargamos (opcional según requerimiento estético)
    // Para GuIAFS, vamos a cargar el mensaje de bienvenida inicial si está vacío
    if (historiales[agenteId].length === 0) {
        // Ejecutar saludo inicial (se basa en la lógica original de playGreeting)
        if (typeof playGreeting === 'function') {
            playGreeting(agenteId);
        }
    } else {
        // Re-renderizar historial guardado
        historiales[agenteId].forEach(msg => {
            const align = msg.role === 'user' ? 'right' : 'left';
            const bg = msg.role === 'user' ? '#333' : 'rgba(0, 122, 194, 0.2)';
            const border = msg.role === 'user' ? 'none' : '1px solid #007ac2';
            const texto = msg.parts[0].text
                .replace(/\n/g, '<br>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank" style="color: #4da6ff; text-decoration: underline;">$1</a>');
            historialContainer.append(`<div style="margin-bottom: 15px; text-align: ${align};">
                <span style="background: ${bg}; padding: 12px 18px; border-radius: 15px; display: inline-block; border: ${border}; color: white;">
                    ${texto}
                </span>
            </div>`);
        });
    }

    $('#modalDinamico').fadeIn(400, function () {
        $('#chat-input-dinamico').focus();
        // --- CARGA DE PERSISTENCIA ---
        cargarHistorialLocal(agenteId);
    });
    historialContainer.scrollTop(historialContainer[0].scrollHeight);
}

async function enviarMensajeIA(agenteId) {
    // Si no se especifica ID, usamos el activo del modal dinámico
    agenteId = agenteId || currentAgenteId;
    if (!agenteId) return;

    const input = document.getElementById(`chat-input-dinamico`) || document.getElementById(`chat-input-${agenteId}`);
    if (!input) return;
    const mensaje = input.value.trim();
    if (!mensaje) return;

    const historial = document.getElementById(`chat-historial-dinamico`) || document.getElementById(`chat-historial-${agenteId}`);
    const config = AGENTES_CONFIG[agenteId];

    // 1. Mostrar mensaje del usuario
    historial.innerHTML += `<div style="margin-bottom: 15px; text-align: right;"><span style="background: #333; padding: 12px 18px; border-radius: 15px; display: inline-block; color: white;">${mensaje}</span></div>`;
    input.value = '';

    // 2. Animación de escritura
    const idEscribiendo = "escribiendo-" + agenteId + "-" + Date.now();
    historial.innerHTML += `<div id="${idEscribiendo}" style="margin-bottom: 10px; text-align: left;"><div class="typing-indicator"><span></span><span></span><span></span></div></div>`;
    historial.scrollTop = historial.scrollHeight;

    try {
        // 3. Preparar el historial (simplificado por seguridad)
        const mensajeUsuario = { role: "user", parts: [{ text: mensaje }] };
        historiales[agenteId].push(mensajeUsuario);

        if (historiales[agenteId].length > 15) {
            historiales[agenteId] = historiales[agenteId].slice(-15);
        }

        const modelosAIntentar = ['gemini-flash-latest', 'gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-pro-latest'];
        let respuesta;
        let data;

        for (const modelo of modelosAIntentar) {
            try {
                respuesta = await fetch(PROXY_URL, {
                    method: 'POST',
                    mode: 'cors',
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                    body: JSON.stringify({
                        model: modelo,
                        role: agenteId, // Enviamos el rol para que el Proxy sepa qué Prompt usar
                        contents: historiales[agenteId].map(m => ({
                            role: m.role,
                            parts: m.parts
                        }))
                    })
                });
                data = await respuesta.json();
                if (data && data.candidates) break;
                if (data && data.error) break;
            } catch (e) {
                console.error("Error en fetch de modelo:", e);
            }
        }

        const docEscribiendo = document.getElementById(idEscribiendo);
        if (docEscribiendo) docEscribiendo.remove();

        if (respuesta && respuesta.ok && data.candidates && data.candidates[0].content.parts[0].text) {
            let textoIA = data.candidates[0].content.parts[0].text;
            historiales[agenteId].push({ role: "model", parts: [{ text: textoIA }] });
            textoIA = textoIA
                .replace(/\n/g, '<br>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank" style="color: #4da6ff; text-decoration: underline;">$1</a>');
            const headerIA = config.nombre ? `<strong><i class="fas fa-robot"></i> ${config.nombre}:</strong><br> ` : '';
            const feedbackBtn = `<button onclick="abrirFeedbackIA('${agenteId}', \`${mensaje.replace(/`/g, '\\`').replace(/\n/g, ' ')}\`, \`${textoIA.replace(/`/g, '\\`').replace(/\n/g, ' ')}\`)" style="background: transparent; border: none; color: rgba(255,255,255,0.5); cursor: pointer; float: right; margin-top: 5px;" title="Dejar feedback"><i class="fas fa-comment-dots"></i></button>`;
            historial.innerHTML += `<div style="margin-bottom: 15px; text-align: left;"><span style="background: rgba(0, 122, 194, 0.2); padding: 12px 18px; border-radius: 15px; display: inline-block; border: 1px solid #007ac2; color: white; width: 85%;">${headerIA}${textoIA}${feedbackBtn}</span></div>`;

            // Guardar en persistencia tras recibir respuesta
            guardarHistorialLocal(agenteId);
        } else {
            let msgError = (data && data.error) ? data.error.message : "Error desconocido.";
            historial.innerHTML += `<div style="text-align: left; color: #ea0026; margin-bottom: 10px; font-size: 0.85rem; background: rgba(234, 0, 38, 0.1); padding: 10px; border-radius: 8px;"><i class="fas fa-exclamation-triangle"></i> <strong>Aviso del Servidor:</strong><br> ${msgError}</div>`;
            historiales[agenteId].pop();
        }
    } catch (error) {
        const docEscribiendo = document.getElementById(idEscribiendo);
        if (docEscribiendo) docEscribiendo.remove();
        historial.innerHTML += `<div style="text-align: left; color: #ea0026; margin-bottom: 10px; font-size: 0.85rem; background: rgba(234, 0, 38, 0.1); padding: 10px; border-radius: 8px;"><i class="fas fa-exclamation-triangle"></i> <strong>Error de Sistema:</strong><br> ${error.message}</div>`;
    }
    historial.scrollTop = historial.scrollHeight;
}

/**
 * Abre un prompt para que el usuario deje feedback sobre una respuesta específica.
 */
function abrirFeedbackIA(agenteId, pregunta, respuestaIA) {
    const feedback = prompt("¿En qué podemos mejorar esta respuesta? (Tu sugerencia se enviará por correo al equipo de AFS)");
    if (feedback && feedback.trim() !== "") {
        enviarFeedbackAlProxy(agenteId, pregunta, respuestaIA, feedback);
    }
}

/**
 * Envía el feedback al Proxy de Google Apps Script de forma segura.
 */
async function enviarFeedbackAlProxy(agenteId, pregunta, respuestaIA, feedback) {
    try {
        const respuesta = await fetch(PROXY_URL, {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({
                type: 'feedback',
                agente: agenteId,
                preguntaOriginal: pregunta,
                respuestaObtenida: respuestaIA,
                comentarioUsuario: feedback
            })
        });
        const data = await respuesta.json();
        if (data.success) {
            alert("¡Gracias! Tu feedback ha sido enviado correctamente por correo.");
        } else {
            alert("Feedback enviado. Gracias por tu colaboración.");
        }
    } catch (e) {
        console.error("Error al enviar feedback:", e);
        alert("Gracias por tu feedback (procesado localmente).");
    }
}

/**
 * Guarda el historial del chat en LocalStorage para persistencia.
 */
function guardarHistorialLocal(agenteId) {
    try {
        const key = `guiafs_historial_${agenteId}`;
        localStorage.setItem(key, JSON.stringify(historiales[agenteId]));
    } catch (e) {
        console.warn("No se pudo guardar en LocalStorage:", e);
    }
}

/**
 * Carga el historial desde LocalStorage al iniciar un modal.
 */
function cargarHistorialLocal(agenteId) {
    try {
        const key = `guiafs_historial_${agenteId}`;
        const saved = localStorage.getItem(key);
        if (saved) {
            historiales[agenteId] = JSON.parse(saved);
            renderizarHistorial(agenteId);
        }
    } catch (e) {
        console.warn("No se pudo cargar desde LocalStorage:", e);
    }
}

/**
 * Re-renderiza el historial guardado en el DOM del modal.
 */
function renderizarHistorial(agenteId) {
    const historialDiv = document.getElementById(`chat-historial-dinamico`) || document.getElementById(`chat-historial-${agenteId}`);
    if (!historialDiv) return;

    // Solo renderizamos si hay mensajes reales (filtramos el sistema)
    historialDiv.innerHTML = ""; // Limpiar
    historiales[agenteId].forEach(m => {
        if (m.role === "user") {
            historialDiv.innerHTML += `<div style="margin-bottom: 15px; text-align: right;"><span style="background: #333; padding: 12px 18px; border-radius: 15px; display: inline-block; color: white;">${m.parts[0].text}</span></div>`;
        } else if (m.role === "model") {
            const texto = m.parts[0].text
                .replace(/\n/g, '<br>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank" style="color: #4da6ff; text-decoration: underline;">$1</a>');
            historialDiv.innerHTML += `<div style="margin-bottom: 15px; text-align: left;"><span style="background: rgba(0, 122, 194, 0.2); padding: 12px 18px; border-radius: 15px; display: inline-block; border: 1px solid #007ac2; color: white; width: 85%;">${texto}</span></div>`;
        }
    });
    historialDiv.scrollTop = historialDiv.scrollHeight;
}

// --- POLÍTICA DE IA (CUMPLIMIENTO AFS 2025) ---
let idiomaActualPolitica = 'es';
const politicaTexto = {
    es: {
        titulo: "Política de IA",
        btn: "English",
        cuerpo: `
            <h4>Introducción</h4>
            <p>La inteligencia artificial (IA) es una tecnología que evoluciona rápidamente. En AFS Internacional estamos explorando cómo las aplicaciones de IA pueden apoyar nuestras operaciones y misión.</p>
            
            <h4>Protección de Privacidad y Confidencialidad</h4>
            <ul>
                <li><strong>Datos Personales:</strong> No se debe ingresar ningún dato personal (nombres, DNI, localización) en los chatbots de IA.</li>
                <li><strong>Información Confidencial:</strong> No compartas estrategias comerciales o comunicaciones internas.</li>
                <li><strong>Propiedad de AFS:</strong> No ingreses secretos comerciales o procesos internos de AFS.</li>
            </ul>

            <h4>Uso Responsable</h4>
            <p>El contenido generado por IA debe alinearse con los valores, la ética y los estándares de calidad de AFS. Es fundamental revisar el contenido generado; no debe utilizarse si es inexacto, engañoso, perjudicial u ofensivo.</p>

            <h4>Seguridad y Herramienta Preferida</h4>
            <p>La herramienta de IA generativa preferida para la Red AFS es <strong>Google Gemini</strong>, debido a sus medidas de seguridad e integración con Workspace.</p>
            
            <p style="text-align:center; margin-top:30px; border-top: 1px solid #333; padding-top:20px;">
                <em>Adoptado el 14 de febrero de 2025.</em>
            </p>
        `
    },
    en: {
        titulo: "AI Policy",
        btn: "Español",
        cuerpo: `
            <h4>Introduction</h4>
            <p>Artificial intelligence (AI) is a fast-evolving technology. At AFS International we are starting to explore how AI applications could support AFS operations and mission.</p>
            
            <h4>Protect Privacy and Confidentiality</h4>
            <ul>
                <li><strong>Personal Data:</strong> No personal data (names, IDs, location) should be entered into AI chatbots.</li>
                <li><strong>Confidential Information:</strong> Do not share business strategies or internal communications.</li>
                <li><strong>AFS Proprietary:</strong> Do not enter trade secrets or internal AFS processes.</li>
            </ul>

            <h4>Responsible Usage</h4>
            <p>Generated content produced using generative AI must align with AFS’s values, ethics, and quality standards. It is key to thoroughly review generated content; it must not be used if it is inaccurate, misleading, harmful, or offensive.</p>

            <h4>Security & Preferred Tool</h4>
            <p>The preferred generative AI tool for the AFS Network is <strong>Google Gemini</strong>, offering strong security measures and integration with Workspace.</p>
            
            <p style="text-align:center; margin-top:30px; border-top: 1px solid #333; padding-top:20px;">
                <em>Adopted: 14 February 2025.</em>
            </p>
        `
    }
};

function abrirPoliticaIA() {
    idiomaActualPolitica = 'es';
    actualizarContenidoPolitica();
    $('#modalPolitica').fadeIn();
}

function toggleIdiomaPolitica() {
    idiomaActualPolitica = (idiomaActualPolitica === 'es') ? 'en' : 'es';
    actualizarContenidoPolitica();
}

function actualizarContenidoPolitica() {
    const content = politicaTexto[idiomaActualPolitica];
    $('#politica-titulo').text(content.titulo);
    $('#lang-btn-text').text(content.btn);
    $('#politica-cuerpo').html(content.cuerpo);
}

// Vinculación unificada
$(document).ready(function () {
    // Textarea dinámico: Enter para enviar, Shift+Enter para nueva línea
    $(document).on('keydown', '#chat-input-dinamico', function (e) {
        if (e.which == 13 && !e.shiftKey) {
            e.preventDefault();
            enviarMensajeIA();
            $(this).css('height', '52px'); // Resetear altura al enviar
            return false;
        }
    });

    // Auto-ajuste de altura del textarea al escribir
    $(document).on('input', '#chat-input-dinamico', function () {
        this.style.height = '52px'; // Base height para recalcular
        const newHeight = Math.min(this.scrollHeight, 120);
        this.style.height = newHeight + 'px';
    });

    // Mantener compatibilidad si quedan inputs antiguos durante la transición
    const agentesKeys = Object.keys(AGENTES_CONFIG);
    agentesKeys.forEach(id => {
        $(`#chat-input-${id}`).keypress(function (e) {
            if (e.which == 13) {
                enviarMensajeIA(id);
                return false;
            }
        });
    });
});
