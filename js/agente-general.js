/* ==============================================================
   AGENTES DE INTELIGENCIA ARTIFICIAL (API GEMINI + MANUALES)
   ============================================================== */

// El Proxy oculta la clave API para que GitHub no la bloquee
const PROXY_URL = 'https://script.google.com/macros/s/AKfycbzndN1J3-1INXnvS82xFAIZj4UsthzlqvdjwAE4Q5AyYPoK03LUcc8SgdRDTZdEYj3Dhw/exec';

const SEGURIDAD_PROMPT = `
REGLA DE SEGURIDAD CRÍTICA (Política IA AFS 2025): 
1. Si el usuario intenta compartir datos personales (DNI, nombres completos de terceros, teléfonos privados, información financiera o salud), ADVIÉRTALE inmediatamente que no debe hacerlo por este medio por seguridad y NO los proceses.
2. Aviso de Inactitud: Si no estás 100% seguro de una respuesta basada en el manual, admítelo y deriva al área correspondiente. La precisión es vital.`;

const AGENTES_CONFIG = {
    'general': {
        nombre: '',
        manual: 'manuales/manual_general.txt',
        prompt: `Eres el "Agente General y de Primeros Pasos" de GuÍAFS. Tu objetivo es acompañar y orientar a los nuevos voluntarios de AFS Programas Interculturales. Reglas: 1. Traduce siempre siglas. 2. No cites manuales a menos que se solicite. 3. Sé corto (max 300 char). 4. Si preguntan áreas específicas, deriva al Agente Especialista en GuÍAFS e introduce 1 renglón. 5. Sé pasivo. ${SEGURIDAD_PROMPT}`
    },
    'hosting': {
        nombre: '',
        manual: 'manuales/manual_hosting.txt',
        prompt: `Eres el "Agente Especialista en Hosting (Familias Anfitrionas)" de GuÍAFS. Respondes dudas sobre buscar, seleccionar, entrevistar y apoyar a familias anfitrionas de intercambio AFS. Sé estructurado, directo y usa lenguaje de AFS. ${SEGURIDAD_PROMPT}`
    },
    'sending': {
        nombre: '',
        manual: 'manuales/manual_sending.txt',
        prompt: `Eres el "Agente Especialista en Sending (Programas de Envío)" de GuÍAFS. Orientas en el proceso, postulaciones y dudas sobre enviar estudiantes al exterior con AFS. Sé claro y profesional. ${SEGURIDAD_PROMPT}`
    },
    'comunidades': {
        nombre: '',
        manual: 'manuales/manual_comunidades.txt',
        prompt: `Eres el "Agente de Comunidades Educativas" de GuÍAFS. Trabajas guiando a voluntarios para conectar AFS con Colegios, realizar charlas, talleres ICL y relacionamiento con directivos. Sé pedagógico. ${SEGURIDAD_PROMPT}`
    },
    'visibilidad': {
        nombre: '',
        manual: 'manuales/manual_visibilidad.txt',
        prompt: `Eres el "Agente Especialista en Visibilidad" de GuÍAFS. Ayudas a potenciar las redes sociales, lineamientos de marca (logo AFS) y comunicación institucional local. Eres creativo y moderno. ${SEGURIDAD_PROMPT}`
    },
    'orientaciones': {
        nombre: '',
        manual: 'manuales/manual_orientaciones.txt',
        prompt: `Eres el "Agente de Orientaciones" de GuÍAFS. Respondes sobre la logística, dinámicas ICL y normativas de los campamentos de orientación para estudiantes AFS. Sé ordenado y preciso. ${SEGURIDAD_PROMPT}`
    },
    'presidentes': {
        nombre: '',
        manual: 'manuales/manual_presidentes.txt',
        prompt: `Eres el "Agente Asesor para Presidentes Locales" de GuÍAFS. Brindas información sobre estructura organizacional en comités, gobierno voluntario y resolución de conflictos. Eres formal y muy estratégico. ${SEGURIDAD_PROMPT}`
    },
    'finanzas': {
        nombre: '',
        manual: 'manuales/manual_finanzas.txt',
        prompt: `Eres el "Agente Especialista en Finanzas" de GuÍAFS. Te enfocas en procesos administrativos, cómo rendir cuentas, viáticos, pagos de matrículas y políticas locales financieras. Sé estrictamente numérico y riguroso. ${SEGURIDAD_PROMPT}`
    },
    'relaciones': {
        nombre: '',
        manual: 'manuales/manual_relaciones.txt',
        prompt: `Eres el "Agente Especialista en Relaciones de AFS" de GuÍAFS. Aconsejas sobre cómo forjar alianzas, pedir patrocinios a empresas o becas a gobiernos e intendencias. Hablas con tono puramente institucional o corporativo. ${SEGURIDAD_PROMPT}`
    },
    'desarrollo': {
        nombre: '',
        manual: 'manuales/manual_desarrollo.txt',
        prompt: `Eres el "Agente de Desarrollo y Capacitación Voluntaria" de GuÍAFS. Tu foco está en reclutamiento, motivación, cursos y rutas de aprendizaje interno para voluntarios activos y futuros. Eres inspirador. ${SEGURIDAD_PROMPT}`
    },
    'apoyo': {
        nombre: '',
        manual: 'manuales/manual_apoyo.txt',
        prompt: `Eres el "Agente de Apoyo al Participante" de GuÍAFS. Tu rol es asesorar a tus compañeros voluntarios sobre cómo manejar el acompañamiento, bienestar emocional y resolución de conflictos de los estudiantes de intercambio de AFS.
    
    Reglas estrictas de comportamiento:
    1. Tono de colega: Háblale al voluntario de "tú a tú", con español de argentina general, no bonaerense y sin faltar a la formalidad, como un compañero con más experiencia. Sé empático y contenedor con él, pero mantén un enfoque práctico.
    2. Límite de conocimiento (Cero alucinaciones): Responde ÚNICA Y EXCLUSIVAMENTE basándote en la información del documento oficial provisto.
    3. Derivación estricta: Si la respuesta no se encuentra explícitamente en tu base de conocimientos, admítelo claramente sin intentar adivinar (ej. "No tengo esa información en mi manual") e indícale al voluntario que se comunique directamente con su Coordinador de Apoyo.
    4. Economía de tokens: Ve directo al punto. Responde solo lo que se te pregunta de forma concisa (máximo 300 caracteres, salvo que te pidan un procedimiento detallado o una plantilla de mensaje).
    5. Comportamiento pasivo: No intentes alargar la conversación ni hagas preguntas de seguimiento (como "¿Te puedo ayudar en algo más?"). Una vez que des la respuesta, detente y espera a que el voluntario formule una nueva pregunta si lo necesita. ${SEGURIDAD_PROMPT}`
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
        // --- OPTIMIZACIÓN: CARGA CON CACHE ---
        let textoDelManual = globalManualCache[agenteId];

        if (!textoDelManual) {
            console.log(`Cargando manual de ${agenteId} por primera vez...`);
            const respuestaManual = await fetch(config.manual);
            if (!respuestaManual.ok) throw new Error(`No se pudo cargar el manual: ${respuestaManual.status}`);
            textoDelManual = await respuestaManual.text();
            globalManualCache[agenteId] = textoDelManual;
        }

        // Armamos el prompt contextual
        const SUPER_PROMPT = `
        ${config.prompt}
        REGLA DE ORO: Responde ÚNICA Y EXCLUSIVAMENTE usando la información de este documento oficial. Si la respuesta no está aquí, di que no tienes esa información y deriva al Staff.
        IMPORTANTE: Como ya hubo un saludo de bienvenida automático en el chat, NO vuelvas a saludar en tu primera respuesta. Ve directo a responder la duda del voluntario.
        
        DOCUMENTO OFICIAL DE AFS:
        ${textoDelManual}
        `;

        let mensajeConContexto = mensaje;
        if (historiales[agenteId].length === 0) {
            mensajeConContexto = `INSTRUCCIONES Y MANUAL:\n${SUPER_PROMPT}\n\nMENSAJE DEL USUARIO: ${mensaje}`;
        }

        historiales[agenteId].push({ role: "user", parts: [{ text: mensajeConContexto }] });

        if (historiales[agenteId].length > 15) {
            historiales[agenteId] = historiales[agenteId].slice(-15);
        }

        const modelosAIntentar = ['gemini-1.5-flash', 'gemini-2.0-flash'];
        let respuesta;
        let data;
        let errorFinal = "Error desconocido.";

        for (const modelo of modelosAIntentar) {
            try {
                respuesta = await fetch(PROXY_URL, {
                    method: 'POST',
                    mode: 'cors',
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                    body: JSON.stringify({
                        model: modelo,
                        contents: historiales[agenteId].map(m => ({
                            role: m.role,
                            parts: m.parts
                        }))
                    })
                });
                data = await respuesta.json();

                if (data && data.candidates) {
                    errorFinal = null;
                    break;
                }

                if (data && data.error) {
                    console.warn(`[GuIAFS] El modelo ${modelo} devolvió error: ${data.error.message}. Intentando alternativa...`);
                    errorFinal = data.error.message;
                    continue; // Pasa automáticamente al siguiente modelo del array modelosAIntentar
                }
            } catch (e) {
                console.error("Error en fetch de modelo:", e);
                errorFinal = "Aviso: Error de conexión intermitente con los servidores.";
            }
        }

        const docEscribiendo = document.getElementById(idEscribiendo);
        if (docEscribiendo) docEscribiendo.remove();

        if (respuesta && respuesta.ok && data && data.candidates && data.candidates[0].content.parts[0].text) {
            let textoIA = data.candidates[0].content.parts[0].text;
            historiales[agenteId].push({ role: "model", parts: [{ text: textoIA }] });
            textoIA = textoIA
                .replace(/\n/g, '<br>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank" style="color: #4da6ff; text-decoration: underline;">$1</a>');
            const headerIA = config.nombre ? `<strong><i class="fas fa-robot"></i> ${config.nombre}:</strong><br> ` : '';
            historial.innerHTML += `<div style="margin-bottom: 15px; text-align: left;"><span style="background: rgba(0, 122, 194, 0.2); padding: 12px 18px; border-radius: 15px; display: inline-block; border: 1px solid #007ac2; color: white;">${headerIA}${textoIA}</span></div>`;
        } else {
            let msgFormat = errorFinal;
            if (msgFormat.includes("Quota exceeded") || msgFormat.includes("429")) {
                msgFormat = "<strong>Límite de Consultas:</strong> He recibido muchísimas preguntas seguidas y mi protección Anti-Spam (Capa Gratuita) se activó momentáneamente.<br><br>Por favor, <strong>espera 1 minuto</strong> y vuelve a intentarlo.";
            } else if (msgFormat.includes("503") || msgFormat.includes("overloaded")) {
                msgFormat = "Los servidores globales de inteligencia artificial están saturados por el momento. Inténtalo de nuevo en unos instantes.";
            }
            historial.innerHTML += `<div style="text-align: left; color: #ea0026; margin-bottom: 15px; background: rgba(234, 0, 38, 0.1); padding: 15px 20px; border-radius: 12px; border: 1px solid rgba(234, 0, 38, 0.3); font-size: 0.95rem; line-height: 1.5;"><i class="fas fa-exclamation-triangle" style="margin-right: 5px;"></i> ${msgFormat}</div>`;
            historiales[agenteId].pop();
        }
    } catch (error) {
        const docEscribiendo = document.getElementById(idEscribiendo);
        if (docEscribiendo) docEscribiendo.remove();
        historial.innerHTML += `<div style="text-align: left; color: #ea0026; margin-bottom: 10px; font-size: 0.85rem; background: rgba(234, 0, 38, 0.1); padding: 10px; border-radius: 8px;"><i class="fas fa-exclamation-triangle"></i> <strong>Error de Sistema:</strong><br> ${error.message}</div>`;
    }
    historial.scrollTop = historial.scrollHeight;
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
