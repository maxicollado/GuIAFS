/* ==============================================================
   CEREBRO DE IA: TODOS LOS AGENTES (GEMINI API + MANUALES)
   ============================================================== */

const GEMINI_API_KEY = 'AIzaSyCvhAU2mwNKTS_FvKLibmY5c789RylWteU';

const AGENTES_CONFIG = {
    'general': {
        nombre: 'Agente General',
        manual: 'manuales/manual_general.txt',
        prompt: `Eres el "Agente General y de Primeros Pasos" de GuÍAFS. Tu objetivo es acompañar y orientar a los nuevos voluntarios de AFS Programas Interculturales. Reglas: 1. Traduce siempre siglas. 2. No cites manuales a menos que se solicite. 3. Sé corto (max 300 char). 4. Si preguntan áreas específicas, deriva al Agente Especialista en GuÍAFS e introduce 1 renglón. 5. Sé pasivo.`
    },
    'hosting': {
        nombre: 'Agente Hosting',
        manual: 'manuales/manual_hosting.txt',
        prompt: `Eres el "Agente Especialista en Hosting (Familias Anfitrionas)" de GuÍAFS. Respondes dudas sobre buscar, seleccionar, entrevistar y apoyar a familias anfitrionas de intercambio AFS. Sé estructurado, directo y usa lenguaje de AFS.`
    },
    'sending': {
        nombre: 'Agente Sending',
        manual: 'manuales/manual_sending.txt',
        prompt: `Eres el "Agente Especialista en Sending (Programas de Envío)" de GuÍAFS. Orientas en el proceso, postulaciones y dudas sobre enviar estudiantes al exterior con AFS. Sé claro y profesional.`
    },
    'comunidades': {
        nombre: 'Agente Comunidades Educativas',
        manual: 'manuales/manual_comunidades.txt',
        prompt: `Eres el "Agente de Comunidades Educativas" de GuÍAFS. Trabajas guiando a voluntarios para conectar AFS con Colegios, realizar charlas, talleres ICL y relacionamiento con directivos. Sé pedagógico.`
    },
    'visibilidad': {
        nombre: 'Agente Visibilidad',
        manual: 'manuales/manual_visibilidad.txt',
        prompt: `Eres el "Agente Especialista en Visibilidad" de GuÍAFS. Ayudas a potenciar las redes sociales, lineamientos de marca (logo AFS) y comunicación institucional local. Eres creativo y moderno.`
    },
    'orientaciones': {
        nombre: 'Agente Orientaciones Locales',
        manual: 'manuales/manual_orientaciones.txt',
        prompt: `Eres el "Agente de Orientaciones" de GuÍAFS. Respondes sobre la logística, dinámicas ICL y normativas de los campamentos de orientación para estudiantes AFS. Sé ordenado y preciso.`
    },
    'presidentes': {
        nombre: 'Agente Presidentes',
        manual: 'manuales/manual_presidentes.txt',
        prompt: `Eres el "Agente Asesor para Presidentes Locales" de GuÍAFS. Brindas información sobre estructura organizacional en comités, gobierno voluntario y resolución de conflictos. Eres formal y muy estratégico.`
    },
    'finanzas': {
        nombre: 'Agente Finanzas',
        manual: 'manuales/manual_finanzas.txt',
        prompt: `Eres el "Agente Especialista en Finanzas" de GuÍAFS. Te enfocas en procesos administrativos, cómo rendir cuentas, viáticos, pagos de matrículas y políticas locales financieras. Sé estrictamente numérico y riguroso.`
    },
    'relaciones': {
        nombre: 'Agente Relaciones Institucionales',
        manual: 'manuales/manual_relaciones.txt',
        prompt: `Eres el "Agente Especialista en Relaciones de AFS" de GuÍAFS. Aconsejas sobre cómo forjar alianzas, pedir patrocinios a empresas o becas a gobiernos e intendencias. Hablas con tono puramente institucional o corporativo.`
    },
    'desarrollo': {
        nombre: 'Agente Desarrollo Voluntario',
        manual: 'manuales/manual_desarrollo.txt',
        prompt: `Eres el "Agente de Desarrollo y Capacitación Voluntaria" de GuÍAFS. Tu foco está en reclutamiento, motivación, cursos y rutas de aprendizaje interno para voluntarios activos y futuros. Eres inspirador.`
    }
};

// Memorias independientes para cada bot
let historiales = {
    'general': [], 'hosting': [], 'sending': [], 'comunidades': [],
    'visibilidad': [], 'orientaciones': [], 'presidentes': [],
    'finanzas': [], 'relaciones': [], 'desarrollo': []
};

async function enviarMensajeIA(agenteId) {
    const input = document.getElementById(`chat-input-${agenteId}`);
    if (!input) return;
    const mensaje = input.value.trim();
    if (!mensaje) return;

    const historial = document.getElementById(`chat-historial-${agenteId}`);
    const config = AGENTES_CONFIG[agenteId];

    // 1. Mostrar lo que escribió el voluntario
    historial.innerHTML += `<div style="margin-bottom: 15px; text-align: right;"><span style="background: #333; padding: 12px 18px; border-radius: 15px; display: inline-block; color: white;">${mensaje}</span></div>`;
    input.value = '';
    historiales[agenteId].push({ role: "user", parts: [{ text: mensaje }] });

    // 2. Animación de "Pensando..."
    const idEscribiendo = "escribiendo-" + agenteId + "-" + Date.now();
    historial.innerHTML += `<div id="${idEscribiendo}" style="margin-bottom: 15px; text-align: left;"><span style="background: rgba(0, 122, 194, 0.1); padding: 12px 18px; border-radius: 15px; display: inline-block; color: #888;"><i class="fas fa-circle-notch fa-spin"></i> Leyendo manual oficial de AFS...</span></div>`;
    historial.scrollTop = historial.scrollHeight;

    try {
        // --- LA MAGIA: LEER EL MANUAL EN SILENCIO ---
        const respuestaManual = await fetch(config.manual);
        const textoDelManual = await respuestaManual.text();

        // Armamos un "Super Prompt" que incluye tus reglas + el manual
        const SUPER_PROMPT = `
        ${config.prompt}
        
        REGLA DE ORO: Responde ÚNICA Y EXCLUSIVAMENTE usando la información de este documento oficial. Si la respuesta no está aquí, di que no tienes esa información y deriva al Staff.
        
        DOCUMENTO OFICIAL DE AFS:
        ${textoDelManual}
        `;
        // ---------------------------------------------

        // 3. Conectarse con Google Gemini usando el Super Prompt
        const respuesta = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: SUPER_PROMPT }] },
                contents: historiales[agenteId],
                generationConfig: {
                    temperature: 0.0 // Temperatura en CERO: robótico y estricto, elimina alucinaciones
                }
            })
        });

        const data = await respuesta.json();
        const docEscribiendo = document.getElementById(idEscribiendo);
        if (docEscribiendo) docEscribiendo.remove();

        if (data.candidates && data.candidates[0].content.parts[0].text) {
            let textoIA = data.candidates[0].content.parts[0].text;
            historiales[agenteId].push({ role: "model", parts: [{ text: textoIA }] });
            textoIA = textoIA.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

            historial.innerHTML += `<div style="margin-bottom: 15px; text-align: left;"><span style="background: rgba(0, 122, 194, 0.2); padding: 12px 18px; border-radius: 15px; display: inline-block; border: 1px solid #007ac2; color: white;"><strong><i class="fas fa-robot"></i> ${config.nombre}:</strong><br> ${textoIA}</span></div>`;
        } else {
            historial.innerHTML += `<div style="text-align: left; color: #ea0026; margin-bottom: 10px;"><i>Error al procesar la respuesta. Revisa tu clave API o intenta luego.</i></div>`;
        }
    } catch (error) {
        const docEscribiendo = document.getElementById(idEscribiendo);
        if (docEscribiendo) docEscribiendo.remove();
        historial.innerHTML += `<div style="text-align: left; color: #ea0026; margin-bottom: 10px;"><i>Error al consultar el manual.</i></div>`;
    }
    historial.scrollTop = historial.scrollHeight;
}

// 4. Vincular tecla Enter en todos los inputs de chats
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
