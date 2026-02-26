/* ==============================================================
   CEREBRO DE IA: AGENTE GENERAL (GEMINI API)
   ============================================================== */

// AQUI PONDREMOS TU CLAVE (La sacaremos en el paso 3)
const GEMINI_API_KEY = 'AIzaSyCvhAU2mwNKTS_FvKLibmY5c789RylWteU';

// Este es el Prompt que redactamos, inyectado directamente a la IA
const PROMPT_GENERAL = `Eres el "Agente General y de Primeros Pasos" de GuÍAFS. Tu objetivo es acompañar y orientar a los nuevos voluntarios de AFS Programas Interculturales.
Reglas estrictas:
1. Traduce siempre las siglas (CD, PO, Sending, Hosting, ICL, etc.) desglosando su significado inmediatamente.
2. NUNCA cites fuentes ni manuales a menos que te pregunten directamente "¿de dónde sacaste la información?".
3. Sé muy breve (máximo 300 caracteres). Solo puedes excederte si piden detalles profundos, un paso a paso o redactar un correo.
4. Si preguntan por áreas específicas (familias, viajes, finanzas), da una mínima introducción de 1 renglón y diles que cierren esta ventana y consulten al Agente Especialista de esa área en GuÍAFS.
5. Cierra de forma amable pero pasiva. No hagas preguntas de seguimiento para conversar a menos que sea estrictamente necesario.`;

// Esta variable guarda la memoria de la conversación para que el bot recuerde lo que hablaron
let historialConversacionGeneral = [];

async function enviarMensajeGeneral() {
    const input = document.getElementById('chat-input-general');
    const mensaje = input.value.trim();
    if (!mensaje) return;

    const historial = document.getElementById('chat-historial-general');

    // 1. Mostrar lo que escribió el voluntario
    historial.innerHTML += `
        <div style="margin-bottom: 15px; text-align: right;">
            <span style="background: #333; padding: 12px 18px; border-radius: 15px; display: inline-block; color: white;">
                ${mensaje}
            </span>
        </div>`;
    input.value = '';

    // Guardar en la memoria
    historialConversacionGeneral.push({ role: "user", parts: [{ text: mensaje }] });

    // 2. Mostrar animacion de "Pensando..."
    const idEscribiendo = "escribiendo-" + Date.now();
    historial.innerHTML += `
        <div id="${idEscribiendo}" style="margin-bottom: 15px; text-align: left;">
            <span style="background: rgba(0, 122, 194, 0.1); padding: 12px 18px; border-radius: 15px; display: inline-block; color: #888;">
                <i class="fas fa-circle-notch fa-spin"></i> Procesando manuales de AFS...
            </span>
        </div>`;
    historial.scrollTop = historial.scrollHeight;

    // 3. Conectarse con Google Gemini
    try {
        const respuesta = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: PROMPT_GENERAL }] },
                contents: historialConversacionGeneral,
                generationConfig: { temperature: 0.2 } // Temperatura muy baja para que no invente cosas
            })
        });

        const data = await respuesta.json();
        document.getElementById(idEscribiendo).remove(); // Quitar el "Pensando..."

        if (data.candidates && data.candidates[0].content.parts[0].text) {
            let textoIA = data.candidates[0].content.parts[0].text;

            // Guardar respuesta en la memoria
            historialConversacionGeneral.push({ role: "model", parts: [{ text: textoIA }] });

            // Reemplazar saltos de linea para que se vea bien en HTML y negritas
            textoIA = textoIA.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

            historial.innerHTML += `
                <div style="margin-bottom: 15px; text-align: left;">
                    <span style="background: rgba(0, 122, 194, 0.2); padding: 12px 18px; border-radius: 15px; display: inline-block; border: 1px solid #007ac2; color: white;">
                        <strong><i class="fas fa-robot"></i> Agente General:</strong><br> ${textoIA}
                    </span>
                </div>`;
        } else {
            historial.innerHTML += `<div style="text-align: left; color: #ea0026;">Error al procesar la respuesta. Revisa tu clave API.</div>`;
        }
    } catch (error) {
        document.getElementById(idEscribiendo).remove();
        historial.innerHTML += `<div style="text-align: left; color: #ea0026;">Error de conexión a internet o clave incorrecta.</div>`;
    }
    historial.scrollTop = historial.scrollHeight; // Bajar el scroll automáticamente
}

// 4. Permitir que el mensaje se envíe presionando la tecla Enter
$(document).ready(function () {
    $('#chat-input-general').keypress(function (e) {
        if (e.which == 13) {
            enviarMensajeGeneral();
            return false;
        }
    });
});
