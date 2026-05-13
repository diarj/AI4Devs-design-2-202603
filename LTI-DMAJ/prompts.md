# Prompts — LTI ATS Design

Registro de prompts utilizados durante el proceso de diseño del sistema LTI ATS, junto con un resumen de las respuestas obtenidas.

---

## Prompt 1 — Generación de Historias de Usuario

**Prompt:**

> A partir del PRD del proyecto que se encuentra en `LTI_ATS_PRD_v1.0.md` genera las historias de usuario de LTI, siguiendo el formato *Como [tipo de usuario], quiero [acción/funcionalidad] para [beneficio/valor]*. Para cada historia genera los criterios de aceptación en formato *Dado [la precondición o estado inicial] Cuando [la acción que el usuario realiza] Entonces [el resultado esperado]*. Incluye al menos un escenario del happy path, un escenario de error, y un edge case que un QA experimentado consideraría. Valida que todas las historias cumplan con los criterios INVEST.

**Respuesta — Resumen:**

Se generaron dos artefactos:

- **Canvas interactivo** (`lti-user-stories.canvas.tsx`): filtra por módulo (6 módulos) y persona (5 tipos de usuario), muestra estadísticas generales (24 historias, 6 módulos, 72 criterios de aceptación, 100% INVEST) y cada historia como tarjeta colapsable con los 3 escenarios expandibles.
- **Documento** (`LTI_UserStories_v1.0.md`): 24 historias completas con tabla de resumen.

| Módulo | HUs | INVEST | Observación clave |
|---|---|---|---|
| Gestión de Vacantes | HU-01 a HU-04 | ✅ 6/6 | HU-03 requiere integraciones previas configuradas (dependencia externa, no interna) |
| Gestión de Candidatos | HU-05 a HU-08 | ✅ 6/6 | HU-05 y HU-06 se pueden entregar secuencialmente (parser primero, scoring después) |
| Colaboración y Evaluación | HU-09 a HU-12 | ✅ 6/6 | HU-12 tiene edge case crítico: SLA en fin de semana, detectado por QA |
| Comunicaciones y Automatización | HU-13 a HU-16 | ✅ 6/6 | HU-14 es la más grande (8–13 días); candidata a subdividirse por tipo de trigger |
| Analítica e Inteligencia | HU-17 a HU-20 | ✅ 6/6 | HU-17 tiene edge case de estado vacío (sin datos) — trampa clásica de QA |
| IA y Asistencia Inteligente | HU-21 a HU-24 | ✅ 6/6 | HU-24 tiene edge case de seguridad RBAC — no revelar existencia del candidato |

Cada historia incluye exactamente: 1 happy path · 1 escenario de error · 1 edge case que un QA experimentado consideraría (estados vacíos, concurrencia, expiración de sesión, caracteres unicode, SLAs en fines de semana, desbordamiento de límites, etc.).

---

## Prompt 2 — Diseño del Prompt para Backlog

**Prompt:**

> Como experto en prompt engineering, redacta un prompt para definir el backlog de un sistema nuevo a partir de las historias de usuario del proyecto.

**Respuesta:**

```
# ROL Y CONTEXTO
Actúa como un Product Owner senior con experiencia en metodologías ágiles (Scrum/SAFe). Tu tarea es analizar las historias de usuario proporcionadas y estructurar un backlog de producto completo, priorizado y listo para ser trabajado por un equipo de desarrollo.

# CONTEXTO DEL PROYECTO
Nombre del sistema: [NOMBRE DEL SISTEMA]
Tipo de aplicación: [WEB / MÓVIL / API / OTRO]
Objetivo principal: [DESCRIBIR EL PROPÓSITO DEL SISTEMA EN 1-2 ORACIONES]
Usuarios principales: [ROLES DE USUARIO: admin, cliente, operador, etc.]
Stack tecnológico (si aplica): [TECNOLOGÍAS RELEVANTES]

# HISTORIAS DE USUARIO
A continuación se presentan las historias de usuario levantadas durante el proceso de discovery:

[PEGAR AQUÍ LAS HISTORIAS DE USUARIO]

# INSTRUCCIONES DE ANÁLISIS
Con base en las historias de usuario anteriores, ejecuta los siguientes pasos en orden:

PASO 1 — IDENTIFICACIÓN DE ÉPICAS
Agrupa las historias en épicas funcionales coherentes. Para cada épica indica:
- Nombre de la épica
- Descripción breve (1 oración)
- Historias de usuario que la componen

PASO 2 — REFINAMIENTO DE HISTORIAS
Para cada historia de usuario, genera o completa:
- Título (formato: "Como [rol], quiero [acción], para [beneficio]")
- Criterios de aceptación (mínimo 3, formato Gherkin: Given / When / Then)
- Notas técnicas o dependencias relevantes (si las hay)

PASO 3 — ESTIMACIÓN DE COMPLEJIDAD
Asigna story points usando la escala de Fibonacci (1, 2, 3, 5, 8, 13, 21) con esta referencia:
- 1-2: tarea simple, sin dependencias
- 3-5: complejidad media, alguna lógica de negocio
- 8-13: alta complejidad o múltiples integraciones
- 21: candidato a dividirse en sub-historias

PASO 4 — PRIORIZACIÓN (MoSCoW)
Clasifica cada historia como:
- Must have: crítico para el MVP
- Should have: importante pero no bloqueante
- Could have: deseable si hay capacidad
- Won't have: fuera de alcance en esta versión

PASO 5 — BACKLOG ESTRUCTURADO
Genera el backlog final como una tabla ordenada por prioridad con las columnas:
| ID | Épica | Historia de usuario | Story Points | MoSCoW | Sprint sugerido |

# RESTRICCIONES DE SALIDA
- Usa lenguaje claro y orientado al negocio, evita jerga técnica innecesaria
- Si detectas ambigüedades en alguna historia, señálalas explícitamente
- Si falta información crítica para alguna historia, indícalo como "⚠ Pendiente de clarificación"
- No inventes funcionalidades que no estén implícitas en las historias originales
- El backlog debe ser accionable: un desarrollador debe poder tomar cualquier historia y comenzar a trabajar

# FORMATO FINAL
Estructura tu respuesta con las siguientes secciones claramente separadas:
1. Resumen ejecutivo (máx. 5 líneas)
2. Mapa de épicas
3. Historias refinadas con criterios de aceptación
4. Tabla del backlog priorizado
5. Riesgos o dependencias identificadas
```

---

## Prompt 3 — Generación del Backlog del Proyecto

**Prompt:**

```
# ROL Y CONTEXTO
Actúa como un Product Owner senior con experiencia en metodologías ágiles (Scrum/SAFe). Tu tarea es analizar las historias de usuario proporcionadas y estructurar un backlog de producto completo, priorizado y listo para ser trabajado por un equipo de desarrollo.

# CONTEXTO DEL PROYECTO
@LTI_ATS_PRD_v1.0.md

# HISTORIAS DE USUARIO
Las historias de usuario se encuentran en el documento @LTI_UserStories_v1.0.md

# INSTRUCCIONES DE ANÁLISIS
Con base en las historias de usuario anteriores, ejecuta los siguientes pasos en orden:

PASO 1 — IDENTIFICACIÓN DE ÉPICAS
Agrupa las historias en épicas funcionales coherentes. Para cada épica indica:
- Nombre de la épica
- Descripción breve (1 oración)
- Historias de usuario que la componen

PASO 2 — REFINAMIENTO DE HISTORIAS
Para cada historia de usuario, genera o completa:
- Título (formato: "Como [rol], quiero [acción], para [beneficio]")
- Criterios de aceptación (mínimo 3, formato Gherkin: Given / When / Then)
- Notas técnicas o dependencias relevantes (si las hay)

PASO 3 — ESTIMACIÓN DE COMPLEJIDAD
Asigna story points usando la escala de Fibonacci (1, 2, 3, 5, 8, 13, 21) con esta referencia:
- 1-2: tarea simple, sin dependencias
- 3-5: complejidad media, alguna lógica de negocio
- 8-13: alta complejidad o múltiples integraciones
- 21: candidato a dividirse en sub-historias

PASO 4 — PRIORIZACIÓN (MoSCoW)
Clasifica cada historia como:
- Must have: crítico para el MVP
- Should have: importante pero no bloqueante
- Could have: deseable si hay capacidad
- Won't have: fuera de alcance en esta versión

PASO 5 — BACKLOG ESTRUCTURADO
Genera el backlog final como una tabla ordenada por prioridad con las columnas:
| ID | Épica | Historia de usuario | Story Points | MoSCoW | Sprint sugerido |

# RESTRICCIONES DE SALIDA
- Usa lenguaje claro y orientado al negocio, evita jerga técnica innecesaria
- Si detectas ambigüedades en alguna historia, señálalas explícitamente
- Si falta información crítica para alguna historia, indícalo como "⚠ Pendiente de clarificación"
- No inventes funcionalidades que no estén implícitas en las historias originales
- El backlog debe ser accionable: un desarrollador debe poder tomar cualquier historia y comenzar a trabajar

# FORMATO FINAL
Estructura tu respuesta con las siguientes secciones claramente separadas:
1. Resumen ejecutivo (máx. 5 líneas)
2. Mapa de épicas
3. Historias refinadas con criterios de aceptación
4. Tabla del backlog priorizado
5. Riesgos o dependencias identificadas
```

**Respuesta — Resumen:**

Se generó un canvas interactivo y el análisis completo con las 5 secciones solicitadas.

### 1. Resumen ejecutivo

LTI ATS cuenta con 24 historias de usuario en 6 épicas funcionales, totalizando 139 story points distribuidos en 8 sprints. El MVP (sprints 1–6) cubre los 16 Must Have (97 pts) con todos los módulos core: vacantes, candidatos, pipeline, colaboración en tiempo real, comunicaciones y analítica. Los 6 Should Have (sprints 5–7) consolidan alertas inteligentes, experiencia del candidato e IA secundaria. Los 2 Could Have (sprint 8) aportan diferenciación premium. Se identifican 7 ambigüedades pendientes de clarificación y 7 riesgos bajo seguimiento, dos de ellos críticos (GDPR y seguridad multi-tenant del chat).

### 2. Mapa de épicas

| ID | Épica | Historias | Pts totales | Must Have |
|---|---|---|---|---|
| EP-01 | Gestión de Vacantes | HU-01, HU-02, HU-03, HU-04 | 19 | 3 de 4 |
| EP-02 | Gestión de Candidatos | HU-05, HU-06, HU-07, HU-08 | 29 | 4 de 4 |
| EP-03 | Colaboración y Evaluación | HU-09, HU-10, HU-11, HU-12 | 18 | 3 de 4 |
| EP-04 | Comunicaciones y Automatización | HU-13, HU-14, HU-15, HU-16 | 28 | 3 de 4 |
| EP-05 | Analítica e Inteligencia | HU-17, HU-18, HU-19, HU-20 | 23 | 3 de 4 |
| EP-06 | IA y Asistencia Inteligente | HU-21, HU-22, HU-23, HU-24 | 26 | 0 de 4 |

### 3. Ambigüedades identificadas

| Historia | Ambigüedad | Acción requerida |
|---|---|---|
| HU-03 | ¿Integración web corporativa vía API, XML feed o widget? | Decisión de Producto + Arquitectura |
| HU-04 | ¿Flujo de aprobación de un nivel o multinivel en MVP? | Decisión de Producto |
| HU-10 | ¿Tipos de campo del formulario en MVP (escala, texto, opción múltiple)? | Decisión de Diseño |
| HU-11 | ¿Reglas de consenso configurables por vacante o solo por cuenta? | Decisión de Producto |
| HU-14 | ¿Catálogo de triggers y acciones del workflow builder en MVP? | Decisión de Producto (bloqueo de Sprint 4) |
| HU-18 | ¿Coste por fuente manual o calculado desde integraciones publicitarias? | Decisión de Negocio |
| HU-24 | ¿Alcance de consultas del chat y queries SQL que las respaldan? | Decisión de Arquitectura (bloqueo de Sprint 8) |

### 4. Tabla del backlog priorizado

| ID | Épica | Historia de usuario | SP | MoSCoW | Sprint |
|---|---|---|---|---|---|
| HU-05 | EP-02 | Parser de CV automático | 8 | Must Have | S1 |
| HU-07 | EP-02 | Pipeline Kanban con drag & drop | 5 | Must Have | S1 |
| HU-01 | EP-01 | Crear vacante desde plantilla | 3 | Must Have | S1 |
| HU-13 | EP-04 | Email de confirmación automático | 2 | Must Have | S1 |
| HU-06 | EP-02 | Ranking automático de candidatos | 8 | Must Have | S2 |
| HU-02 | EP-01 | Generación de JD con IA | 5 | Must Have | S2 |
| HU-03 | EP-01 | Publicación multicanal de vacantes | 8 | Must Have | S3 |
| HU-09 | EP-03 | Comentarios en tiempo real | 5 | Must Have | S3 |
| HU-10 | EP-03 | Formularios de evaluación personalizados | 5 | Must Have | S3 |
| HU-14 | EP-04 | Workflow builder no-code | 13 | Must Have | S4 |
| HU-11 | EP-03 | Votación y consenso del equipo | 5 | Must Have | S4 |
| HU-15 | EP-04 | Coordinación de entrevistas con IA | 8 | Must Have | S5 |
| HU-17 | EP-05 | Dashboard de métricas en tiempo real | 8 | Must Have | S5 |
| HU-04 | EP-01 | Aprobación de vacantes sin email | 3 | Should Have | S5 |
| HU-08 | EP-02 | Búsqueda semántica en talent pool | 8 | Must Have | S6 |
| HU-18 | EP-05 | Análisis de fuentes con ROI estimado | 5 | Must Have | S6 |
| HU-19 | EP-05 | Reportes exportables PDF/Excel | 5 | Must Have | S6 |
| HU-12 | EP-03 | Alertas de inactividad de hiring managers | 3 | Should Have | S7 |
| HU-16 | EP-04 | Actualizaciones de estado al candidato | 5 | Should Have | S7 |
| HU-20 | EP-05 | Alertas de candidato en riesgo de abandono | 5 | Should Have | S7 |
| HU-21 | EP-06 | Resumen de entrevista por IA | 3 | Should Have | S7 |
| HU-23 | EP-06 | Detector de sesgo en job descriptions | 5 | Should Have | S7 |
| HU-22 | EP-06 | Sugerencias de preguntas de entrevista | 5 | Could Have | S8 |
| HU-24 | EP-06 | Chat conversacional con datos del pipeline | 13 | Could Have | S8 |

*Velocidad de sprint estimada: 13–21 pts (promedio 17,4 pts/sprint)*

### 5. Riesgos y dependencias identificadas

| ID | Riesgo | Impacto | HU |
|---|---|---|---|
| R-01 | Parser de CV con precisión < 90% | Alto | HU-05 |
| R-02 | Adopción baja del módulo de IA | Alto | HU-02, HU-06, HU-21, HU-23 |
| R-03 | Incumplimiento GDPR en gestión de datos de candidatos | **Crítico** | HU-05, HU-16, HU-24 |
| R-04 | HU-14 (workflow builder) puede ser 21+ pts, no 13 | Alto | HU-14 |
| R-05 | Cambios en APIs externas (LinkedIn, Google Calendar) | Medio | HU-03, HU-15 |
| R-06 | Escalabilidad del sistema de tiempo real (> 500 usuarios) | Medio | HU-07, HU-09, HU-11 |
| R-07 | HU-24 puede filtrar datos entre tenants sin RBAC estricto | **Crítico** | HU-24 |

**Dependencias técnicas clave:** HU-06 → HU-05 · HU-08 → HU-05 · HU-09 comparte WebSocket con HU-07 · HU-14 → HU-13 · HU-18 → HU-03 · HU-20 → HU-06 · HU-21/22/23 comparten infraestructura LLM con HU-02.

---

## Prompt 4 — Definición de Tickets de Trabajo

**Prompt:**

> Qué es un ticket de trabajo?

**Respuesta — Resumen:**

Un ticket de trabajo (también llamado *work ticket* o *issue*) es una unidad de trabajo documentada y rastreable dentro de un proyecto de software. Sus componentes típicos son:

| Campo | Descripción |
|---|---|
| ID | Identificador único (ej. LTI-101) |
| Título | Descripción corta del trabajo |
| Descripción | Detalle de qué se necesita y por qué |
| Criterios de aceptación | Condiciones que deben cumplirse para considerarlo "hecho" |
| Prioridad | Alta, media, baja |
| Estimación | Esfuerzo estimado (puntos de historia, horas, etc.) |
| Asignado a | Persona responsable |
| Estado | Pendiente, En progreso, En revisión, Completado |
| Dependencias | Otros tickets relacionados o bloqueantes |

**Tipos comunes:** Historia de usuario · Tarea técnica · Bug · Epic · Spike.

---

## Prompt 5 — Generación de Tickets de Trabajo

**Prompt:**

> Genera los tickets de trabajo para las primeras 5 historias priorizadas en el backlog que se encuentra en `LTI_UserStories_v1.0.md`. Además de los componentes típicos de un ticket adiciona los siguientes:
>
> **7. Etiquetas o Tags** — Categorización por tipo, característica del producto o sprint/versión.
>
> **8. Comentarios y Notas** — Espacio de colaboración para agregar información relevante, preguntas o actualizaciones de progreso.
>
> **9. Enlaces o Referencias** — Documentos, diseños, especificaciones o tickets relacionados que proporcionen contexto adicional.
>
> **10. Historial de Cambios** — Registro de todas las modificaciones realizadas en el ticket.

**Respuesta — Resumen:**

Se generaron los 5 tickets correspondientes a las primeras historias priorizadas del backlog (Sprint 1 y Sprint 2), documentados en `LTI_WorkTickets_v1.0.md`.

| # | Ticket | Historia | SP | Sprint | Estado | Bloqueantes |
|---|---|---|---|---|---|---|
| 1 | TICKET-001 | HU-05 Parser de CV | 8 | S1 | Pendiente | — |
| 2 | TICKET-002 | HU-07 Pipeline Kanban | 5 | S1 | Pendiente | — |
| 3 | TICKET-003 | HU-01 Vacante desde plantilla | 3 | S1 | Pendiente | — |
| 4 | TICKET-004 | HU-13 Email de confirmación | 2 | S1 | Pendiente | — |
| 5 | TICKET-005 | HU-06 Ranking de candidatos | 8 | S2 | Bloqueado | TICKET-001 |

**Total Sprint 1:** 18 SP · 4 tickets listos para desarrollo  
**Total Sprint 2 (ticket 5):** 8 SP · inicio condicionado a TICKET-001

Cada ticket incluye los 10 campos completos: título, descripción, criterios de aceptación (happy path + error + edge case), prioridad, estimación, asignación/estado, etiquetas, comentarios/notas, enlaces y historial de cambios.
