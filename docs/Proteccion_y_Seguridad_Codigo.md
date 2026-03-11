# Guía de Protección y Blindaje de Propiedad Intelectual para GuÍAFS

Este documento detalla las estrategias recomendadas para evitar que el desarrollo sea copiado fácilmente, ocultar el proceso de construcción y proteger la estructura interna frente a inspecciones curiosas.

---

## 1. Protección del Repositorio (GitHub)

### El "Squash" de Historial (Limpieza de rastro)
Actualmente, GitHub guarda cada pequeño cambio, error y corrección que hemos hecho. Si alguien accede al historial, puede ver paso a paso cómo se construyó.
**Recomendación:** Cuando el proyecto esté en su versión final o un hito importante, se puede realizar un "Squash". Esto consiste en colapsar los cientos de commits en uno solo llamado *"Initial Release"*.
*   **Efecto:** Desaparece el rastro de la evolución, las dudas, los errores corregidos y las versiones descartadas.

### Repositorio Privado
Si el objetivo es que nadie lo clone sin permiso, el repositorio en GitHub debe ser **Privado**. Solo personas con permiso explícito podrán ver el código.
*   **Nota:** Seguirás pudiendo usar GitHub Pages para mostrar la web públicamente, pero el "detrás de escena" (el código) quedará bajo llave.

---

## 2. Ofuscación de Código (Blindaje del Navegador)

Aunque la web sea pública, podemos hacer que el código que "vuela" hacia el navegador del usuario sea ininteligible.

### Minificación y Ofuscación
Existen herramientas (como JSObfuscator) que transforman el código Javascript claro en una sopa de letras.
*   **Código Original:** `function enviarMensaje() { ... }`
*   **Código Ofuscado:** `function _0x3a2b(_0x12af, _0x55bc) { ... }` (con miles de líneas de relleno).
**Efecto:** El navegador lo ejecuta perfectamente, pero un ser humano que intente copiarlo o entender la lógica tardará semanas en descifrar qué hace cada parte.

---

## 3. Seguridad de Lógica Crítica (Mover el Cerebro al Servidor)

El activo más valioso de GuÍAFS no es el diseño (que se puede copiar con una captura de pantalla), sino los **Prompts** (las instrucciones de comportamiento de cada agente).

### Migración al Proxy (Google Apps Script)
Actualmente, los Prompts están escritos en el archivo `agente-general.js`. Cualquier persona con "Clic derecho -> Ver código fuente" puede leerlos.
**Efecto Recomendado:** Mover el listado de Prompts y la lógica de "qué manual leer" dentro del script secreto de Google Apps Script.
*   **Cómo funcionaría:** El JS de la web solo enviaría un código (ej. "APOYO"). El Proxy recibiría "APOYO", buscaría en su base de datos privada el prompt correspondiente, y haría la consulta.
*   **Resultado:** El "alma" del proyecto (el conocimiento y las reglas) nunca sale del servidor de Google. La web queda como una cáscara vacía imposible de replicar con la misma inteligencia.

---

## 4. Prevención de Indexación (Robots.txt)

Para evitar que herramientas automáticas de clonación o motores de búsqueda (como el buscador de código de GitHub) encuentren y analicen el sitio:
1.  Añadir un archivo `robots.txt` con la instrucción `Disallow: /`.
2.  Añadir meta-etiquetas `noindex` en el HTML.
**Efecto:** Le indicamos a los robots legales que "aquí no hay nada que ver", reduciendo la visibilidad para buscadores de vulnerabilidades.

---

## 5. Auditoría de Manuales

Asegurarse de que los archivos `.txt` de la carpeta `manuales/` no contengan información extremadamente sensible (como contraseñas, teléfonos personales directos o rutas de carpetas internas del servidor). La IA debe conocer la política, pero no datos que puedan ser usados para ingeniería social externa.

---

**Conclusión:** La combinación de **Repositorio Privado + Limpieza de Historial (Squash) + Ofuscación de JS + Migración de Prompts al Servidor** convierte a GuÍAFS en una "Caja Negra" virtualmente imposible de piratear o copiar con efectividad.
