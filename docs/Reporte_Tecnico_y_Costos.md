# Reporte Técnico — GuIAFS
**Fecha:** Marzo 2026  
**Autor:** Maximiliano Collado  
**Versión del proyecto:** v1.4

---

## 1. Descripción General del Proyecto

**GuIAFS** es una plataforma web de asistentes de inteligencia artificial especializados para voluntarios de AFS Argentina. Permite a los miembros de la organización consultar información sobre sus roles (Hosting, Sending, Finanzas, Apoyo, etc.) a través de una interfaz de chat, aprovechando el modelo Gemini de Google como motor de IA.

La arquitectura fue diseñada con foco en:
- **Seguridad**: los prompts y la lógica de IA son invisibles para el usuario.
- **Privacidad**: la base de conocimiento reside en Google Drive privado.
- **Cero costo de infraestructura**: todo el stack es gratuito.

---

## 2. Stack Tecnológico

### 2.1 Frontend

| Tecnología | Uso en el proyecto | Complejidad |
|---|---|---|
| **HTML5** | Estructura de la SPA (Single Page Application) | ⭐ Baja |
| **CSS3 / Vanilla CSS** | Estilos personalizados, animaciones, responsive | ⭐⭐ Media |
| **JavaScript (ES6)** | Lógica de chat, modales, history, feedback, slideshow | ⭐⭐⭐ Alta |
| **jQuery 2.1.4** | Manipulación del DOM, eventos, AJAX | ⭐ Baja |
| **Bootstrap 3** | Sistema de grilla y layout base | ⭐ Baja |
| **CubePortfolio** | Grid masonry animado de tarjetas de agentes | ⭐⭐ Media |
| **Typed.js** | Animación de texto en la sección hero | ⭐ Baja |
| **jQuery hover3D** | Efecto de perspectiva 3D al pasar el cursor | ⭐ Baja |
| **Font Awesome 5** | Iconografía de toda la interfaz | ⭐ Baja |
| **Google Fonts (Montserrat)** | Tipografía principal del sitio | ⭐ Baja |
| **WebP / JPEG** | Imágenes optimizadas por agente (3 por tarjeta) | ⭐ Baja |
| **LocalStorage API** | Persistencia del historial de chat por navegador | ⭐⭐ Media |

### 2.2 Backend (Serverless)

| Tecnología | Uso en el proyecto | Complejidad |
|---|---|---|
| **Google Apps Script** | Proxy seguro entre la web y la API de Gemini | ⭐⭐⭐ Alta |
| **Gemini API (AI Studio)** | Motor de IA que procesa y responde las consultas | ⭐⭐⭐ Alta |
| **DocumentApp (GAS)** | Lectura de Google Docs privados para la base de conocimiento | ⭐⭐ Media |
| **MailApp (GAS)** | Envío de correos de feedback al administrador | ⭐ Baja |
| **ContentService (GAS)** | Exposición del proxy como API REST con CORS | ⭐⭐ Media |
| **System Instructions (Gemini)** | Inyección eficiente del prompt y manual sin consumir contexto visible | ⭐⭐⭐ Alta |

### 2.3 Infraestructura y Almacenamiento

| Tecnología | Uso en el proyecto | Complejidad |
|---|---|---|
| **GitHub Pages** | Hosting gratuito del sitio estático | ⭐ Baja |
| **GitHub (repositorio privado)** | Control de versiones y CI/CD básico | ⭐ Baja |
| **Google Drive** | Almacenamiento privado de los manuales por agente | ⭐ Baja |
| **Google Docs** | Interfaz de edición de manuales para administradores | ⭐ Baja |

### 2.4 Seguridad e IP Protection

| Técnica | Descripción | Complejidad |
|---|---|---|
| **Git Squash (historia limpia)** | Historial comprimido en un único commit para ocultar el proceso de desarrollo | ⭐⭐ Media |
| **Prompts server-side** | Las instrucciones de los agentes residen en GAS, nunca en el cliente | ⭐⭐ Media |
| **Proxy pattern** | La API key de Gemini nunca se expone al navegador | ⭐⭐ Media |
| **Google Docs privados** | La base de conocimiento no es accesible públicamente | ⭐ Baja |
| **Mapa global `_feedbackData`** | Los datos del feedback se almacenan en memoria JS, nunca en el HTML | ⭐⭐ Media |

---

## 3. Funcionalidades Implementadas y su Complejidad

| Funcionalidad | Descripción | Complejidad |
|---|---|---|
| Grid de agentes con hover-slideshow | 11 tarjetas con ciclo de imágenes en hover (loop) | ⭐⭐ Media |
| Modal de chat dinámico único | Un único modal reutilizable para los 11 agentes | ⭐⭐⭐ Alta |
| Saludo animado tipo "bubble chat" | Indicadores de escritura + burbujas secuenciales | ⭐⭐ Media |
| Historial de conversación multi-turno | Contexto persistente dentro de la sesión | ⭐⭐ Media |
| Persistencia de historial (LocalStorage) | El chat se recuerda al reabrir el agente | ⭐⭐ Media |
| Lógica "no saludar si hay historial" | Detecta si ya se inició sesión y salta el saludo | ⭐⭐ Media |
| Selección de agente por rol | Cada agente recibe su prompt y manual correctos | ⭐⭐⭐ Alta |
| Modo fallback sin manual | Responde con conocimiento general + derivación al staff | ⭐⭐ Media |
| Panel de feedback inline | Ícono discreto → panel expandible → envío por correo | ⭐⭐⭐ Alta |
| Confirmación silenciosa de feedback | El ícono cambia a ✅ sin interrumpir al usuario | ⭐ Baja |
| Política de IA bilingüe (modal) | Toggle ES/EN dentro del modal | ⭐ Baja |
| Carga de manual desde Google Docs | Lectura privada en tiempo real por cada consulta | ⭐⭐⭐ Alta |
| System Instructions (Nivel 3) | Prompt separado del historial para máx eficiencia de tokens | ⭐⭐⭐ Alta |
| Diseño responsive (mobile-first) | Bottom-sheet en mobile, grid adaptativo | ⭐⭐ Media |
| Animaciones CSS (preloader, bubbles) | Preloader con logo, entrada de burbujas, hover 3D | ⭐⭐ Media |

---

## 4. Arquitectura del Sistema

```
[Usuario]
   ↓ Pregunta
[Navegador - GitHub Pages]
   ↓ fetch() POST con mensajes + role
[Google Apps Script - Proxy Privado]
   ↓ Lee manualDocumentApp.openById()
[Google Drive - Docs Privados]
   ↓ Construye System Instruction
[Gemini API - AI Studio]
   ↓ Respuesta JSON
[Navegador]
   ↓ Renderiza en el chat
[Usuario]
   ↓ (opcional) Deja feedback
[Google Apps Script - MailApp]
   ↓ Envía correo
[Administrador - Gmail]
```

---

## 5. Estimación de Costos de Desarrollo

### 5.1 Desglose de Horas de Trabajo

| Área | Tareas | Horas estimadas |
|---|---|---|
| **Diseño y UX** | Estructura visual, paleta, tipografía, responsive | 15 h |
| **HTML/CSS base** | Layout, animaciones, modal, footer, header | 20 h |
| **Grid y tarjetas** | CubePortfolio, hover3D, slideshow de imágenes | 12 h |
| **Sistema de chat** | Modal dinámico, historial, burbujas, input | 20 h |
| **Agentes IA (JS)** | Lógica multi-agente, historial, LocalStorage | 25 h |
| **Google Apps Script** | Proxy, Gemini API, prompts, Google Docs, fallback | 20 h |
| **Sistema de feedback** | UI inline, MailApp, mapa global seguro | 12 h |
| **Seguridad e IP** | Squash de Git, protección de prompts, manuales privados | 8 h |
| **Testing y bugs** | Debugging de CORS, permisos GAS, caché, UI | 20 h |
| **Documentación** | Manuales, metodología, arquitectura | 8 h |
| **TOTAL** | | **~160 horas** |

### 5.2 Estimación de Honorarios por Perfil

| Perfil | Tarifa/hora | Costo total estimado |
|---|---|---|
| Desarrollador freelance Jr/SSr (Argentina) | USD 20 – 35/h | **USD 3.200 – 5.600** |
| Desarrollador freelance SSr/Sr (LATAM) | USD 40 – 60/h | **USD 6.400 – 9.600** |
| Desarrollador freelance Sr (internacional) | USD 70 – 100/h | **USD 11.200 – 16.000** |
| Agencia de desarrollo web | USD 80 – 150/h | **USD 12.800 – 24.000** |

### 5.3 Costos de Infraestructura Mensuales

| Servicio | Costo actual | Límite gratuito |
|---|---|---|
| GitHub Pages (hosting) | **$0** | Repositorio público ilimitado |
| Google Apps Script | **$0** | 6 min/ejecución, 100 MB/día |
| Gemini API (AI Studio) | **$0** | 15 req/min, 1M tokens/min (Flash) |
| Google Drive (Docs) | **$0** | 15 GB incluidos |
| **TOTAL MENSUAL** | **$0** | — |

> ⚠️ *El costo de infraestructura es **$0 mensual** mientras el uso no supere los límites gratuitos de Google. Para un uso organizacional interno de AFS Argentina, estos límites son más que suficientes.*

### 5.4 Valor de Mercado Estimado del Producto

Considerando las funcionalidades implementadas, la arquitectura de seguridad y el nivel de personalización:

> **Valor de mercado estimado: USD 8.000 – 15.000**  
> *(Producto terminado, a precio de mercado latinoamericano para una agencia o freelance Sr.)*

---

## 6. Conclusión

GuIAFS es un producto técnicamente sofisticado que combina frontend moderno, backend serverless, integración de IA generativa y una arquitectura de seguridad diseñada para proteger la propiedad intelectual. Todo esto sobre un stack de **costo operativo cero**, lo que representa una ventaja significativa para una organización sin fines de lucro como AFS.
