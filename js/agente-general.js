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

async function enviarMensajeIA(agenteId) {
    const input = document.getElementById(`chat-input-${agenteId}`);
    if (!input) return;
    const mensaje = input.value.trim();
    if (!mensaje) return;

    const historial = document.getElementById(`chat-historial-${agenteId}`);
    const config = AGENTES_CONFIG[agenteId];

    // 1. Mostrar el mensaje escrito por el usuario
    historial.innerHTML += `<div style="margin-bottom: 15px; text-align: right;"><span style="background: #333; padding: 12px 18px; border-radius: 15px; display: inline-block; color: white;">${mensaje}</span></div>`;
    input.value = '';

    // 2. Animación de escritura (puntitos mientras el agente procesa)
    const idEscribiendo = "escribiendo-" + agenteId + "-" + Date.now();
    historial.innerHTML += `<div id="${idEscribiendo}" style="margin-bottom: 10px; text-align: left;"><div class="typing-indicator"><span></span><span></span><span></span></div></div>`;
    historial.scrollTop = historial.scrollHeight;

    try {
        // --- CARGA SILENCIOSA DEL MANUAL OFICIAL ---
        let textoDelManual = "";
        try {
            const respuestaManual = await fetch(config.manual);
            if (!respuestaManual.ok) throw new Error(`No se pudo cargar el manual: ${respuestaManual.status}`);
            textoDelManual = await respuestaManual.text();
            if (!textoDelManual || textoDelManual.trim().length < 10) throw new Error("El manual está vacío o tiene muy poco contenido.");
        } catch (errManual) {
            console.error("Error al cargar el manual:", errManual);
            throw new Error("No fue posible leer el manual oficial de AFS en este momento.");
        }

        // Armamos el prompt contextual
        const SUPER_PROMPT = `
        ${config.prompt}
        REGLA DE ORO: Responde ÚNICA Y EXCLUSIVAMENTE usando la información de este documento oficial. Si la respuesta no está aquí, di que no tienes esa información y deriva al Staff.
        IMPORTANTE: Como ya hubo un saludo de bienvenida automático en el chat, NO vuelvas a saludar en tu primera respuesta. Ve directo a responder la duda del voluntario.
        
        DOCUMENTO OFICIAL DE AFS:
        ${textoDelManual}
        `;

        // En el primer mensaje se inyecta el super-prompt con el manual para dar contexto inicial
        let mensajeConContexto = mensaje;
        if (historiales[agenteId].length === 0) {
            mensajeConContexto = `INSTRUCCIONES Y MANUAL:\n${SUPER_PROMPT}\n\nMENSAJE DEL USUARIO: ${mensaje}`;
        }

        historiales[agenteId].push({ role: "user", parts: [{ text: mensajeConContexto }] });

        // --- VENTANA DESLIZANTE (MEMORIA DINÁMICA) ---
        // Se conservan solo los últimos 15 mensajes para evitar errores de contexto y lentitud
        if (historiales[agenteId].length > 15) {
            historiales[agenteId] = historiales[agenteId].slice(-15);
        }

        // 3. Conexión con la API de Gemini (con fallback de modelos si el principal no responde)
        const modelosAIntentar = [
            'gemini-flash-latest',
            'gemini-2.0-flash',
            'gemini-2.0-flash-lite',
            'gemini-pro-latest'
        ];

        let respuesta;
        let data;

        for (const modelo of modelosAIntentar) {
            try {
                respuesta = await fetch(PROXY_URL, {
                    method: 'POST',
                    mode: 'cors', // Aseguramos que siga siendo CORS pero sin preflight si es posible
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                    body: JSON.stringify({
                        model: modelo,
                        contents: historiales[agenteId]
                    })
                });
                data = await respuesta.json();

                // Si el modelo no existe (error 404), se prueba el siguiente de la lista
                if (respuesta.status === 404) {
                    console.warn(`Modelo ${modelo} no encontrado, intentando el siguiente...`);
                    continue;
                }

                // Si hay respuesta exitosa o error de cuota (429), salimos del bucle
                if (data && data.candidates) {
                    break;
                } else if (data && data.error) {
                    // Error explícito de la API de Gemini, no tiene sentido reintentar
                    break;
                }
            } catch (e) {
                console.error("Error en fetch de modelo:", e);
            }
        }

        console.log("Respuesta Gemini API:", data);

        const docEscribiendo = document.getElementById(idEscribiendo);
        if (docEscribiendo) docEscribiendo.remove();

        if (respuesta && respuesta.ok && data.candidates && data.candidates[0].content.parts[0].text) {
            let textoIA = data.candidates[0].content.parts[0].text;
            historiales[agenteId].push({ role: "model", parts: [{ text: textoIA }] });
            textoIA = textoIA.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

            const headerIA = config.nombre ? `<strong><i class="fas fa-robot"></i> ${config.nombre}:</strong><br> ` : '';
            historial.innerHTML += `<div style="margin-bottom: 15px; text-align: left;"><span style="background: rgba(0, 122, 194, 0.2); padding: 12px 18px; border-radius: 15px; display: inline-block; border: 1px solid #007ac2; color: white;">${headerIA}${textoIA}</span></div>`;
        } else {
            let msgError = "Error desconocido.";
            let consejo = "Intenta de nuevo en unos segundos.";

            if (data && data.error) {
                msgError = data.error.message;
                if (data.error.status === "RESOURCE_EXHAUSTED") {
                    msgError = "Cuota de API Agotada (Límite Gratuito).";
                    consejo = "Google bloqueó tu cuenta temporalmente por exceso de uso. <strong>Debes activar el Plan de Pago (Billing) en Google AI Studio o esperar 24hs.</strong>";
                }
            }

            historial.innerHTML += `<div style="text-align: left; color: #ea0026; margin-bottom: 10px; font-size: 0.85rem; background: rgba(234, 0, 38, 0.1); padding: 10px; border-radius: 8px;">
                <i class="fas fa-exclamation-triangle"></i> <strong>Aviso del Servidor:</strong><br> ${msgError}<br><br>
                <small>${consejo}</small>
            </div>`;

            // En caso de error se elimina el últmo mensaje para no corromper el historial
            historiales[agenteId].pop();
        }
    } catch (error) {
        const docEscribiendo = document.getElementById(idEscribiendo);
        if (docEscribiendo) docEscribiendo.remove();

        historial.innerHTML += `<div style="text-align: left; color: #ea0026; margin-bottom: 10px; font-size: 0.85rem; background: rgba(234, 0, 38, 0.1); padding: 10px; border-radius: 8px;">
            <i class="fas fa-exclamation-triangle"></i> <strong>Error de Sistema:</strong><br> ${error.message}<br><br>
            <small>Por favor, intenta refrescar la página (F5).</small>
        </div>`;
    }
    historial.scrollTop = historial.scrollHeight;
}

// 4. Vincular la tecla Enter para enviar mensajes en cada chat
$(document).ready(function () {
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
