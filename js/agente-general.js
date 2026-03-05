/* ==============================================================
   AGENTES DE INTELIGENCIA ARTIFICIAL (API GEMINI + MANUALES)
   ============================================================== */

// El Proxy oculta la clave API para que GitHub no la bloquee
const PROXY_URL = 'https://script.google.com/macros/s/AKfycbzndN1J3-1INXnvS82xFAIZj4UsthzlqvdjwAE4Q5AyYPoK03LUcc8SgdRDTZdEYj3Dhw/exec';

const AGENTES_CONFIG = {
    'general': {
        nombre: '',
        manual: 'manuales/manual_general.txt',
        prompt: `Eres el "Agente General y de Primeros Pasos" de GuÍAFS. Tu objetivo es acompañar y orientar a los nuevos voluntarios de AFS Programas Interculturales. Reglas: 1. Traduce siempre siglas. 2. No cites manuales a menos que se solicite. 3. Sé corto (max 300 char). 4. Si preguntan áreas específicas, deriva al Agente Especialista en GuÍAFS e introduce 1 renglón. 5. Sé pasivo.`
    },
    'hosting': {
        nombre: '',
        manual: 'manuales/manual_hosting.txt',
        prompt: `Eres el "Agente Especialista en Hosting (Familias Anfitrionas)" de GuÍAFS. Respondes dudas sobre buscar, seleccionar, entrevistar y apoyar a familias anfitrionas de intercambio AFS. Sé estructurado, directo y usa lenguaje de AFS.`
    },
    'sending': {
        nombre: '',
        manual: 'manuales/manual_sending.txt',
        prompt: `Eres el "Agente Especialista en Sending (Programas de Envío)" de GuÍAFS. Orientas en el proceso, postulaciones y dudas sobre enviar estudiantes al exterior con AFS. Sé claro y profesional.`
    },
    'comunidades': {
        nombre: '',
        manual: 'manuales/manual_comunidades.txt',
        prompt: `Eres el "Agente de Comunidades Educativas" de GuÍAFS. Trabajas guiando a voluntarios para conectar AFS con Colegios, realizar charlas, talleres ICL y relacionamiento con directivos. Sé pedagógico.`
    },
    'visibilidad': {
        nombre: '',
        manual: 'manuales/manual_visibilidad.txt',
        prompt: `Eres el "Agente Especialista en Visibilidad" de GuÍAFS. Ayudas a potenciar las redes sociales, lineamientos de marca (logo AFS) y comunicación institucional local. Eres creativo y moderno.`
    },
    'orientaciones': {
        nombre: '',
        manual: 'manuales/manual_orientaciones.txt',
        prompt: `Eres el "Agente de Orientaciones" de GuÍAFS. Respondes sobre la logística, dinámicas ICL y normativas de los campamentos de orientación para estudiantes AFS. Sé ordenado y preciso.`
    },
    'presidentes': {
        nombre: '',
        manual: 'manuales/manual_presidentes.txt',
        prompt: `Eres el "Agente Asesor para Presidentes Locales" de GuÍAFS. Brindas información sobre estructura organizacional en comités, gobierno voluntario y resolución de conflictos. Eres formal y muy estratégico.`
    },
    'finanzas': {
        nombre: '',
        manual: 'manuales/manual_finanzas.txt',
        prompt: `Eres el "Agente Especialista en Finanzas" de GuÍAFS. Te enfocas en procesos administrativos, cómo rendir cuentas, viáticos, pagos de matrículas y políticas locales financieras. Sé estrictamente numérico y riguroso.`
    },
    'relaciones': {
        nombre: '',
        manual: 'manuales/manual_relaciones.txt',
        prompt: `Eres el "Agente Especialista en Relaciones de AFS" de GuÍAFS. Aconsejas sobre cómo forjar alianzas, pedir patrocinios a empresas o becas a gobiernos e intendencias. Hablas con tono puramente institucional o corporativo.`
    },
    'desarrollo': {
        nombre: '',
        manual: 'manuales/manual_desarrollo.txt',
        prompt: `Eres el "Agente de Desarrollo y Capacitación Voluntaria" de GuÍAFS. Tu foco está en reclutamiento, motivación, cursos y rutas de aprendizaje interno para voluntarios activos y futuros. Eres inspirador.`
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
5. Comportamiento pasivo: No intentes alargar la conversación ni hagas preguntas de seguimiento (como "¿Te puedo ayudar en algo más?"). Una vez que des la respuesta, detente y espera a que el voluntario formule una nueva pregunta si lo necesita.`
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
            const texto = msg.parts[0].text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

            historialContainer.append(`<div style="margin-bottom: 15px; text-align: ${align};">
                <span style="background: ${bg}; padding: 12px 18px; border-radius: 15px; display: inline-block; border: ${border}; color: white;">
                    ${texto}
                </span>
            </div>`);
        });
    }

    $('#modalDinamico').fadeIn();
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
            textoIA = textoIA.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

            const headerIA = config.nombre ? `<strong><i class="fas fa-robot"></i> ${config.nombre}:</strong><br> ` : '';
            historial.innerHTML += `<div style="margin-bottom: 15px; text-align: left;"><span style="background: rgba(0, 122, 194, 0.2); padding: 12px 18px; border-radius: 15px; display: inline-block; border: 1px solid #007ac2; color: white;">${headerIA}${textoIA}</span></div>`;
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

// Vinculación unificada
$(document).ready(function () {
    // Input dinámico
    $(document).on('keypress', '#chat-input-dinamico', function (e) {
        if (e.which == 13) {
            enviarMensajeIA();
            return false;
        }
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
