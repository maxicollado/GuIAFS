# Optimización Integral de Rendimiento - GuIAFS

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reducir la redundancia de código en un 50%, optimizar la velocidad del chat mediante caching y limpiar archivos obsoletos.

**Architecture:** Mover de 11 modales estáticos a 1 modal dinámico controlado por JS, e implementar un sistema de cache en memoria para los manuales de los agentes.

**Tech Stack:** HTML5, CSS3, JavaScript (jQuery), Gemini API.

---

### Task 1: Limpieza de Archivos Obsoletos
**Goal:** Eliminar archivos que no se utilizan en el despliegue final para reducir peso y desorden.

**Files:**
- Delete: `components/` (directorio completo)
- Delete: `cubeportfolio/img/cbp-sprite.psd`
- Delete: `css/colors/green.css`, `css/colors/orange.css`, `css/colors/pink.css`, `css/colors/purple.css`, `css/colors/turquoise.css`, `css/colors/yellow.css` (Excepto `red.css`)

**Step 1: Eliminar componentes TSX no utilizados**
Run: `rm -rf "c:\Users\maximiliano.collado.CORP\OneDrive - Slots Machines\Documentos\Programación\GuIAFS - Maximiliano Collado\components"`

**Step 2: Eliminar archivo Photoshop pesado**
Run: `rm "c:\Users\maximiliano.collado.CORP\OneDrive - Slots Machines\Documentos\Programación\GuIAFS - Maximiliano Collado\cubeportfolio\img\cbp-sprite.psd"`

**Step 3: Eliminar temas de colores no utilizados**
Run: `rm "c:\Users\maximiliano.collado.CORP\OneDrive - Slots Machines\Documentos\Programación\GuIAFS - Maximiliano Collado\css\colors\*.css" -Exclude red.css`

**Step 4: Commit**
```bash
git add .
git commit -m "chore: limpieza de archivos obsoletos y componentes TSX no utilizados"
```

---

### Task 2: Refactorización de Lógica (JS) y Caching
**Goal:** Implementar caching de manuales y funciones para el modal dinámico.

**Files:**
- Modify: `c:\Users\maximiliano.collado.CORP\OneDrive - Slots Machines\Documentos\Programación\GuIAFS - Maximiliano Collado\js\agente-general.js`

**Step 1: Implementar cache global y funciones de modal**
Añadir `globalManualCache` y la función `abrirModalAgente`.

```javascript
let globalManualCache = {};
let currentAgenteId = null;

function abrirModalAgente(agenteId) {
    currentAgenteId = agenteId;
    const config = AGENTES_CONFIG[agenteId];
    const nombreDisplay = config.nombre || agenteId.charAt(0).toUpperCase() + agenteId.slice(1);
    
    $('#modal-titulo').html(`<i class="fas fa-robot" style="color:#007ac2;"></i> ${nombreDisplay}`);
    $('#chat-input-dinamico').val('');
    
    // Restaurar historial o mostrar saludo inicial
    const historialDiv = $('#chat-historial-dinamico');
    historialDiv.html('');
    
    if (historiales[agenteId].length === 0) {
        // Si no hay historial, podrías disparar el saludo automático aquí si lo prefieres
        // Por ahora, mostrar el mensaje de bienvenida base definido en index.html originalmente
    } else {
        // Re-renderizar historial si existe (opcional)
    }
    
    $('#modalDinamico').fadeIn();
}
```

**Step 2: Optimizar `enviarMensajeIA` con Caching**
Modificar la función para usar `globalManualCache`.

```javascript
async function enviarMensajeIA(agenteId) {
    // Si no se pasa agenteId, usar el actual
    agenteId = agenteId || currentAgenteId;
    const input = document.getElementById(`chat-input-dinamico`) || document.getElementById(`chat-input-${agenteId}`);
    // ... lógica de obtención de mensaje ...
    
    let textoDelManual = globalManualCache[agenteId];
    if (!textoDelManual) {
        const respuestaManual = await fetch(config.manual);
        textoDelManual = await respuestaManual.text();
        globalManualCache[agenteId] = textoDelManual;
    }
    // ... resto de la lógica ...
}
```

**Step 3: Commit**
```bash
git add js/agente-general.js
git commit -m "perf: implementar caching de manuales y base para modal dinámico"
```

---

### Task 3: Refactorización de UI (HTML)
**Goal:** Centralizar modales y actualizar llamadas.

**Files:**
- Modify: `c:\Users\maximiliano.collado.CORP\OneDrive - Slots Machines\Documentos\Programación\GuIAFS - Maximiliano Collado\index.html`

**Step 1: Reemplazar modales estáticos por uno dinámico**
Eliminar los modales del ID 432 al 750 aprox y poner el nuevo.

**Step 2: Actualizar links de la grilla**
Cambiar `onclick` de los items del portafolio.
Ej: `onclick="abrirModalAgente('hosting'); return false;"`

**Step 3: Commit**
```bash
git add index.html
git commit -m "refactor: centralizar sistema de modales y limpiar HTML"
```
