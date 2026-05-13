# LTI ATS — Historias de Usuario
**Versión:** 1.1 | **Fecha:** Mayo 2026 | **Estado:** Refinado — Listo para desarrollo

> Documento generado a partir del [PRD v1.0](./LTI_ATS_PRD_v1.0.md).  
> **v1.1:** Incorpora estimación de story points (escala Fibonacci), clasificación MoSCoW, sprint sugerido, notas técnicas/dependencias y alertas de ambigüedad a partir del análisis de backlog.  
> Todas las historias cumplen los criterios **INVEST** (Independiente, Negociable, Valioso, Estimable, Small, Testeable).  
> Cada historia incluye: formato `Como / Quiero / Para`, validación INVEST, 3 criterios de aceptación en formato `Dado / Cuando / Entonces` (happy path · error · edge case), estimación y notas técnicas.

---

## Índice de Módulos

| # | Módulo | Historias |
|---|--------|-----------|
| 1 | [Gestión de Vacantes](#módulo-1-gestión-de-vacantes) | HU-01 a HU-04 |
| 2 | [Gestión de Candidatos](#módulo-2-gestión-de-candidatos) | HU-05 a HU-08 |
| 3 | [Colaboración y Evaluación](#módulo-3-colaboración-y-evaluación) | HU-09 a HU-12 |
| 4 | [Comunicaciones y Automatización](#módulo-4-comunicaciones-y-automatización) | HU-13 a HU-16 |
| 5 | [Analítica e Inteligencia](#módulo-5-analítica-e-inteligencia) | HU-17 a HU-20 |
| 6 | [IA y Asistencia Inteligente](#módulo-6-ia-y-asistencia-inteligente) | HU-21 a HU-24 |

---

## Módulo 1: Gestión de Vacantes

---

### HU-01 — Crear vacante desde plantilla

**Historia de usuario**
> Como **Reclutador**, quiero **crear una vacante a partir de una plantilla existente** para **reducir el tiempo de configuración inicial**.

**Estimación:** 3 SP &nbsp;|&nbsp; **MoSCoW:** Must Have &nbsp;|&nbsp; **Sprint sugerido:** S1

**Validación INVEST**

| Criterio | Estado | Notas |
|----------|--------|-------|
| I — Independiente | ✅ | Independiente del generador IA y de otros módulos |
| N — Negociable | ✅ | Negociable en número de campos pre-rellenados y tipos de plantilla |
| V — Valioso | ✅ | Valor cuantificable en tiempo ahorrado por reclutador |
| E — Estimable | ✅ | Estimable en 1–3 días de desarrollo |
| S — Small | ✅ | Entregable en un sprint; no depende de otros tickets |
| T — Testeable | ✅ | Testeable por correcta carga y edición de campos de plantilla |

**Criterios de aceptación**

**Escenario 1 — Happy Path**
- **Dado** que el reclutador tiene al menos una plantilla guardada y está autenticado en el sistema
- **Cuando** selecciona "Nueva vacante desde plantilla" y elige una de la lista
- **Entonces** el formulario se pre-rellena con todos los campos de la plantilla (título, descripción, requisitos), el reclutador puede editarlos y guardar la vacante en estado **Borrador**

**Escenario 2 — Error**
- **Dado** que el reclutador inicia la creación desde plantilla
- **Cuando** la única plantilla disponible fue eliminada por otro usuario durante la misma sesión
- **Entonces** el sistema muestra el mensaje "Plantilla no disponible" con la opción "Crear desde cero" sin errores no controlados

**Escenario 3 — Edge Case (QA)**
- **Dado** que el reclutador selecciona una plantilla con más de 12 meses de antigüedad
- **Cuando** acepta importar el contenido
- **Entonces** el sistema muestra el aviso "Esta plantilla tiene más de 12 meses; te recomendamos revisarla con el asistente IA" y ofrece acceso directo al generador de JD

**Notas técnicas y dependencias**
> Requiere módulo de gestión de plantillas (CRUD básico). Sin dependencias de IA ni integraciones externas. Buen candidato para iniciar Sprint 1 por su baja complejidad y alto valor visible.

---

### HU-02 — Generación de JD con IA

**Historia de usuario**
> Como **Reclutador**, quiero **que la IA genere una job description optimizada a partir de un brief básico** para **ahorrar tiempo de redacción y obtener una JD de mayor calidad**.

**Estimación:** 5 SP &nbsp;|&nbsp; **MoSCoW:** Must Have &nbsp;|&nbsp; **Sprint sugerido:** S2

**Validación INVEST**

| Criterio | Estado | Notas |
|----------|--------|-------|
| I — Independiente | ✅ | Independiente de plantillas (puede usarse en vacante nueva o sobre plantilla) |
| N — Negociable | ✅ | Negociable en número de variantes generadas y secciones incluidas |
| V — Valioso | ✅ | Valor medible en minutos ahorrados por JD generada |
| E — Estimable | ✅ | Estimable en 3–5 días incluyendo integración con LLM |
| S — Small | ✅ | Entregable sin bloqueos de otros módulos |
| T — Testeable | ✅ | Testeable por completitud de secciones y tiempo de generación < 30 s |

**Criterios de aceptación**

**Escenario 1 — Happy Path**
- **Dado** que el reclutador tiene un brief con título del puesto, área y al menos 3 requisitos
- **Cuando** hace clic en "Generar JD con IA" y confirma la acción
- **Entonces** en menos de 30 segundos el sistema genera una JD con secciones estándar (descripción del rol, responsabilidades, requisitos, beneficios) lista para editar

**Escenario 2 — Error**
- **Dado** que el reclutador solicita la generación de JD
- **Cuando** el servicio de IA está temporalmente no disponible (timeout > 30 s)
- **Entonces** el sistema muestra "Servicio de IA no disponible. Inténtalo de nuevo" con botón Reintentar, conservando el brief sin pérdida de datos

**Escenario 3 — Edge Case (QA)**
- **Dado** que el brief está escrito en inglés pero la cuenta está configurada en español
- **Cuando** se solicita la generación de JD
- **Entonces** el sistema genera la JD en español e incluye la nota "Brief detectado en inglés; JD generada en español según configuración de cuenta"

**Notas técnicas y dependencias**
> Requiere integración con LLM (OpenAI / Azure OpenAI). Puede desarrollarse en paralelo con HU-01. La infraestructura LLM es compartida con HU-21 (resumen entrevista), HU-22 (preguntas) y HU-23 (detector de sesgo): coordinar la capa de abstracción desde este sprint para evitar duplicación de coste e integración.

---

### HU-03 — Publicación multicanal

**Historia de usuario**
> Como **HR Manager**, quiero **publicar una vacante simultáneamente en LinkedIn, Indeed y mi web corporativa desde un único panel** para **centralizar la gestión y reducir el trabajo duplicado**.

**Estimación:** 8 SP &nbsp;|&nbsp; **MoSCoW:** Must Have &nbsp;|&nbsp; **Sprint sugerido:** S3

**Validación INVEST**

| Criterio | Estado | Notas |
|----------|--------|-------|
| I — Independiente | ✅ | Independiente en su lógica de publicación (requiere integraciones configuradas) |
| N — Negociable | ✅ | Negociable en número de canales incluidos en el MVP |
| V — Valioso | ✅ | Elimina duplicación de trabajo y centraliza la gestión |
| E — Estimable | ✅ | Estimable en 5–8 días incluyendo integraciones |
| S — Small | ✅ | Entregable por fases (primero 2 canales, luego más) |
| T — Testeable | ✅ | Testeable por confirmaciones de estado por canal |

**Criterios de aceptación**

**Escenario 1 — Happy Path**
- **Dado** que la vacante está en estado "Aprobada" y las credenciales de LinkedIn e Indeed están activas
- **Cuando** el HR Manager selecciona los canales y hace clic en "Publicar"
- **Entonces** la vacante se publica en todos los canales seleccionados en < 60 s; el panel muestra estado (Publicado/Pendiente/Error) con fecha y hora por canal

**Escenario 2 — Error**
- **Dado** que el HR Manager intenta publicar en LinkedIn
- **Cuando** el token de integración ha expirado
- **Entonces** el sistema muestra "Credenciales de LinkedIn expiradas" con botón "Reconectar", continúa la publicación en los demás canales válidos y registra el incidente en el log de auditoría

**Escenario 3 — Edge Case (QA)**
- **Dado** que se publican 5 canales y 3 confirman inmediatamente
- **Cuando** 2 canales permanecen en estado "Pendiente" más de 5 minutos
- **Entonces** el sistema reintenta automáticamente (máx. 3 intentos) y notifica al HR Manager si tras los 3 intentos la publicación aún no se completó

**Notas técnicas y dependencias**
> Alta complejidad por integraciones OAuth de terceros (LinkedIn API, Indeed API). Para el MVP se puede limitar a 2 canales externos. Requiere gestión segura de tokens OAuth con refresco automático. El tracking de fuente por candidatura generado aquí es prerequisito de HU-18 (análisis ROI).

> ⚠ **Pendiente de clarificación:** ¿La integración con la web corporativa es mediante API propia, XML feed o widget embebido? El tipo de integración impacta directamente la estimación (puede subir a 13 SP si requiere API custom).

---

### HU-04 — Aprobación de vacantes sin email

**Historia de usuario**
> Como **Hiring Manager**, quiero **aprobar o rechazar vacantes propuestas desde mi panel sin necesidad de email** para **agilizar el proceso y mantener trazabilidad de decisiones**.

**Estimación:** 3 SP &nbsp;|&nbsp; **MoSCoW:** Should Have &nbsp;|&nbsp; **Sprint sugerido:** S5

**Validación INVEST**

| Criterio | Estado | Notas |
|----------|--------|-------|
| I — Independiente | ✅ | Independiente del flujo de creación de vacante |
| N — Negociable | ✅ | Negociable en número de niveles de aprobación |
| V — Valioso | ✅ | Reduce tiempo de ciclo en el flujo de aprobación |
| E — Estimable | ✅ | Estimable en 2–3 días |
| S — Small | ✅ | Historia pequeña, entregable en < 1 sprint |
| T — Testeable | ✅ | Testeable por cambio de estado, notificación y log de auditoría |

**Criterios de aceptación**

**Escenario 1 — Happy Path**
- **Dado** que el Hiring Manager tiene vacantes pendientes de aprobación en su panel
- **Cuando** hace clic en "Aprobar" y añade un comentario opcional
- **Entonces** la vacante cambia a estado "Aprobada", el reclutador recibe notificación in-app y la acción queda en el log con timestamp y comentario

**Escenario 2 — Error**
- **Dado** que el Hiring Manager intenta aprobar una vacante
- **Cuando** su sesión ha expirado durante la navegación
- **Entonces** el sistema solicita reautenticación y tras el login redirige al panel de aprobaciones con la vacante pendiente visible, sin pérdida de contexto

**Escenario 3 — Edge Case (QA)**
- **Dado** que dos Hiring Managers con permisos sobre la misma vacante están activos simultáneamente
- **Cuando** ambos intentan aprobarla en el mismo instante
- **Entonces** el sistema procesa la primera aprobación (FIFO) y notifica al segundo "Esta vacante ya fue aprobada por [nombre] a las [hora]"

**Notas técnicas y dependencias**
> Depende de la infraestructura de notificaciones in-app establecida en HU-13. Requiere RBAC para permisos de aprobación configurables por cuenta. Diferida a S5 (Should Have) porque el flujo de MVP puede funcionar sin aprobación formal.

> ⚠ **Pendiente de clarificación:** ¿Se requiere flujo de aprobación multinivel (HM → Director) en el MVP, o es suficiente un solo nivel? El flujo multinivel elevaría la estimación a 5–8 SP.

---

## Módulo 2: Gestión de Candidatos

---

### HU-05 — Parser de CV automático

**Historia de usuario**
> Como **Reclutador**, quiero **que el sistema extraiga automáticamente los datos del CV al recibir una aplicación** para **eliminar la carga manual de introducción de datos y agilizar el proceso**.

**Estimación:** 8 SP &nbsp;|&nbsp; **MoSCoW:** Must Have &nbsp;|&nbsp; **Sprint sugerido:** S1

**Validación INVEST**

| Criterio | Estado | Notas |
|----------|--------|-------|
| I — Independiente | ✅ | Independiente del módulo de scoring |
| N — Negociable | ✅ | Negociable en formatos soportados (PDF, DOCX, LinkedIn) |
| V — Valioso | ✅ | Valor cuantificable en tiempo ahorrado por aplicación |
| E — Estimable | ✅ | Estimable en 5–7 días |
| S — Small | ✅ | Puede dividirse por formato de CV |
| T — Testeable | ✅ | Testeable por precisión ≥ 90% en campos clave |

**Criterios de aceptación**

**Escenario 1 — Happy Path**
- **Dado** que un candidato envía su aplicación con CV en formato PDF estándar
- **Cuando** el sistema recibe la aplicación
- **Entonces** en menos de 5 segundos el perfil queda pre-rellenado con nombre, email, teléfono, experiencia, educación y habilidades con precisión ≥ 90%

**Escenario 2 — Error**
- **Dado** que llega una aplicación con un archivo adjunto corrupto o en formato no soportado
- **Cuando** el parser intenta procesarlo
- **Entonces** el sistema crea el perfil con el email del remitente, marca el CV como "Requiere revisión manual" y notifica al reclutador con enlace directo al perfil

**Escenario 3 — Edge Case (QA)**
- **Dado** que el CV tiene un diseño de dos columnas paralelas en PDF
- **Cuando** el parser procesa el documento
- **Entonces** el sistema extrae la información manteniendo el orden lógico (sin mezclar columnas) y marca con baja confianza los campos donde detecta ambigüedad

**Notas técnicas y dependencias**
> Componente crítico del MVP (criterio de lanzamiento: precisión ≥ 90%, PRD §7.3). Evaluar motores disponibles: AWS Textract, Affinda, o modelo propio. Los datos estructurados generados aquí son prerequisito directo de HU-06 (scoring) y HU-08 (búsqueda semántica). Formatos obligatorios para MVP: PDF, DOCX. LinkedIn import puede diferirse.

---

### HU-06 — Ranking automático de candidatos

**Historia de usuario**
> Como **Reclutador**, quiero **ver un ranking automático de candidatos por ajuste al perfil** para **priorizar mis revisiones y enfocarme en los más prometedores primero**.

**Estimación:** 8 SP &nbsp;|&nbsp; **MoSCoW:** Must Have &nbsp;|&nbsp; **Sprint sugerido:** S2

**Validación INVEST**

| Criterio | Estado | Notas |
|----------|--------|-------|
| I — Independiente | ✅ | Independiente del parser (se alimenta de sus datos) |
| N — Negociable | ✅ | Negociable en pesos del modelo de scoring |
| V — Valioso | ✅ | Reduce tiempo de revisión y mejora la priorización |
| E — Estimable | ✅ | Estimable en 5–8 días |
| S — Small | ✅ | Entregable con un modelo base, mejorable iterativamente |
| T — Testeable | ✅ | Testeable con ground-truth y datos de prueba controlados |

**Criterios de aceptación**

**Escenario 1 — Happy Path**
- **Dado** que una vacante tiene ≥ 20 candidatos con CVs procesados
- **Cuando** el reclutador accede a la vista del pipeline
- **Entonces** los candidatos aparecen ordenados por score (0–100) con los 3 factores principales que explican la puntuación, disponible en < 2 s

**Escenario 2 — Error**
- **Dado** que el modelo de scoring no tiene datos de entrenamiento suficientes para un rol muy nicho
- **Cuando** se calcula el score de un candidato
- **Entonces** el sistema muestra el score con etiqueta "Confianza baja" e ícono informativo "Datos insuficientes para este rol; revisar manualmente"

**Escenario 3 — Edge Case (QA)**
- **Dado** que un candidato aplica con un perfil significativamente superior a todos los requisitos del puesto
- **Cuando** el sistema calcula su score
- **Entonces** el sistema muestra la alerta "Perfil muy por encima del rango (posible sobrequalificación)" en lugar de un score alto que induzca a error

**Notas técnicas y dependencias**
> Depende de HU-05 (datos estructurados del CV). El modelo inicial puede basarse en matching de keywords y reglas ponderadas; la versión ML mejorable iterativamente en sprints posteriores. Los scores generados aquí son prerequisito de HU-20 (alertas de abandono, umbral score ≥ 80).

---

### HU-07 — Pipeline Kanban con drag & drop

**Historia de usuario**
> Como **Reclutador**, quiero **mover candidatos entre etapas del pipeline con drag & drop** para **gestionar el proceso de forma visual e intuitiva reduciendo clics**.

**Estimación:** 5 SP &nbsp;|&nbsp; **MoSCoW:** Must Have &nbsp;|&nbsp; **Sprint sugerido:** S1

**Validación INVEST**

| Criterio | Estado | Notas |
|----------|--------|-------|
| I — Independiente | ✅ | Independiente del scoring |
| N — Negociable | ✅ | Negociable en comportamientos al soltar (notificaciones, validaciones) |
| V — Valioso | ✅ | Valor inmediato en usabilidad y reducción de fricción |
| E — Estimable | ✅ | Estimable en 3–5 días |
| S — Small | ✅ | Historia pequeña, entregable en un sprint |
| T — Testeable | ✅ | Testeable por interacción UI, activación de workflows y sincronización en tiempo real |

**Criterios de aceptación**

**Escenario 1 — Happy Path**
- **Dado** que el reclutador está en la vista Kanban del pipeline con candidatos en "Screening"
- **Cuando** arrastra la tarjeta de un candidato a la columna "Entrevista Técnica"
- **Entonces** el candidato se actualiza a la nueva etapa inmediatamente, los workflows asociados se disparan y el cambio es visible en tiempo real para todos los colaboradores activos

**Escenario 2 — Error**
- **Dado** que el reclutador intenta arrastrar un candidato a la etapa "Oferta"
- **Cuando** el formulario de evaluación obligatorio no está completado
- **Entonces** el sistema bloquea el movimiento, el candidato vuelve a su posición original y aparece el tooltip "Completa el formulario de evaluación antes de avanzar a Oferta"

**Escenario 3 — Edge Case (QA)**
- **Dado** que dos reclutadores ven el mismo pipeline y ambos arrastran el mismo candidato a etapas distintas simultáneamente
- **Cuando** las dos acciones llegan al servidor
- **Entonces** el sistema aplica el primer movimiento (FIFO), actualiza la vista de ambos y el segundo recibe el aviso "El estado de este candidato fue actualizado por [nombre]"

**Notas técnicas y dependencias**
> Requiere WebSocket para sincronización en tiempo real. Las etapas del pipeline deben ser configurables por cuenta. La infraestructura WebSocket implementada aquí es reutilizable por HU-09 (comentarios en tiempo real) y HU-11 (votación): coordinar la arquitectura del canal compartido en este sprint para reducir costes de desarrollo posteriores.

---

### HU-08 — Búsqueda semántica en talent pool

**Historia de usuario**
> Como **Reclutador**, quiero **buscar candidatos en mi talent pool histórico mediante búsqueda semántica** para **reutilizar talento previo y reducir el coste de sourcing**.

**Estimación:** 8 SP &nbsp;|&nbsp; **MoSCoW:** Must Have &nbsp;|&nbsp; **Sprint sugerido:** S6

**Validación INVEST**

| Criterio | Estado | Notas |
|----------|--------|-------|
| I — Independiente | ✅ | Independiente del pipeline activo |
| N — Negociable | ✅ | Negociable en alcance del pool (empresa vs. compartido) |
| V — Valioso | ✅ | Valor directo en reducción de coste de atracción |
| E — Estimable | ✅ | Estimable en 5–8 días |
| S — Small | ✅ | Entregable como feature de búsqueda independiente |
| T — Testeable | ✅ | Testeable con queries semánticas y datasets controlados |

**Criterios de aceptación**

**Escenario 1 — Happy Path**
- **Dado** que el talent pool tiene ≥ 50 candidatos históricos con CVs procesados
- **Cuando** el reclutador escribe "senior backend engineer con experiencia en microservicios y Kubernetes"
- **Entonces** en < 3 segundos el sistema devuelve candidatos ordenados por relevancia semántica, incluso si sus CVs usan términos distintos (ej. "arquitecto de servicios distribuidos")

**Escenario 2 — Error**
- **Dado** que el reclutador realiza una búsqueda semántica
- **Cuando** la consulta contiene solo stop words o caracteres especiales sin significado
- **Entonces** el sistema muestra "Introduce términos más específicos para obtener resultados" con ejemplos de consultas efectivas y no ejecuta la query

**Escenario 3 — Edge Case (QA)**
- **Dado** que la búsqueda devuelve menos de 3 candidatos
- **Cuando** el reclutador ve los escasos resultados
- **Entonces** el sistema muestra los resultados disponibles y ofrece "Ampliar búsqueda incluyendo candidatos de otras vacantes" para aumentar el universo

**Notas técnicas y dependencias**
> Alta complejidad técnica. Requiere embeddings vectoriales (ej. OpenAI Embeddings, Cohere) y base de datos vectorial (ej. pgvector, Pinecone). Depende de HU-05 para los datos estructurados del CV que se vectorizarán. Diferida a S6 para que el pool tenga datos suficientes de sprints anteriores.

---

## Módulo 3: Colaboración y Evaluación

---

### HU-09 — Comentarios en tiempo real sobre candidatos

**Historia de usuario**
> Como **Hiring Manager**, quiero **dejar comentarios estructurados sobre un candidato en tiempo real** para **que el reclutador los vea inmediatamente y se agilice la toma de decisiones conjunta**.

**Estimación:** 5 SP &nbsp;|&nbsp; **MoSCoW:** Must Have &nbsp;|&nbsp; **Sprint sugerido:** S3

**Validación INVEST**

| Criterio | Estado | Notas |
|----------|--------|-------|
| I — Independiente | ✅ | Independiente del sistema de votación |
| N — Negociable | ✅ | Negociable en estructura del comentario (libre vs. categorizado) |
| V — Valioso | ✅ | Reduce ciclos de feedback y acelera decisiones |
| E — Estimable | ✅ | Estimable en 2–4 días |
| S — Small | ✅ | Historia pequeña y focalizada |
| T — Testeable | ✅ | Testeable por latencia de propagación < 1 s |

**Criterios de aceptación**

**Escenario 1 — Happy Path**
- **Dado** que el Hiring Manager está revisando el perfil de un candidato con acceso a la vacante
- **Cuando** escribe un comentario y hace clic en "Enviar"
- **Entonces** el comentario aparece en el perfil del candidato en < 1 segundo para todos los usuarios activos, con marca de tiempo e identificación del autor

**Escenario 2 — Error**
- **Dado** que el Hiring Manager escribe un comentario extenso
- **Cuando** pierde la conexión a internet e intenta enviarlo
- **Entonces** el sistema detecta la desconexión, guarda el borrador localmente con aviso "Sin conexión: comentario guardado como borrador" y lo reenvía automáticamente al restaurarse la conexión

**Escenario 3 — Edge Case (QA)**
- **Dado** que dos Hiring Managers envían comentarios sobre el mismo candidato en el mismo milisegundo
- **Cuando** los dos mensajes llegan al servidor
- **Entonces** ambos comentarios se guardan sin conflicto en orden cronológico; ambos autores los ven sin necesidad de refrescar la página

**Notas técnicas y dependencias**
> Reutiliza la infraestructura WebSocket implementada en HU-07. Coordinar en S1 la arquitectura del canal WS compartido para evitar duplicación de implementación. El borrador local offline puede implementarse con localStorage.

---

### HU-10 — Formularios de evaluación personalizados

**Historia de usuario**
> Como **Reclutador**, quiero **crear formularios de evaluación de entrevistas personalizados por rol** para **estandarizar el feedback y facilitar la comparación objetiva entre candidatos**.

**Estimación:** 5 SP &nbsp;|&nbsp; **MoSCoW:** Must Have &nbsp;|&nbsp; **Sprint sugerido:** S3

**Validación INVEST**

| Criterio | Estado | Notas |
|----------|--------|-------|
| I — Independiente | ✅ | Independiente del sistema de votación |
| N — Negociable | ✅ | Negociable en tipos de campo (escala, texto, múltiple opción) |
| V — Valioso | ✅ | Mejora calidad y consistencia del feedback |
| E — Estimable | ✅ | Estimable en 3–5 días |
| S — Small | ✅ | Entregable en un sprint |
| T — Testeable | ✅ | Testeable por creación, asignación y completado del formulario |

**Criterios de aceptación**

**Escenario 1 — Happy Path**
- **Dado** que el reclutador está configurando la vacante "Desarrollador Backend"
- **Cuando** crea un formulario con 5 preguntas (escala 1–5 y texto libre) y lo vincula al rol
- **Entonces** el formulario queda activo para la vacante y cuando se programa una entrevista el entrevistador lo ve pre-cargado listo para completar

**Escenario 2 — Error**
- **Dado** que el reclutador intenta guardar un formulario de evaluación
- **Cuando** no ha añadido ninguna pregunta
- **Entonces** el sistema muestra la validación "El formulario debe contener al menos una pregunta" junto al campo vacío y no permite guardar

**Escenario 3 — Edge Case (QA)**
- **Dado** que el reclutador modifica un formulario que ya tiene 5 evaluaciones completadas de candidatos anteriores
- **Cuando** intenta eliminar una pregunta existente
- **Entonces** el sistema muestra "Esta acción afectará la comparabilidad de 5 evaluaciones existentes" y requiere confirmación explícita; la versión anterior queda archivada

**Notas técnicas y dependencias**
> Constructor de formularios básico. Los tipos de campo del MVP deben acordarse con el equipo de diseño antes del sprint. La versión archivada de formularios modificados es necesaria para auditoría y comparabilidad histórica.

> ⚠ **Pendiente de clarificación:** ¿Qué tipos de campo son necesarios en el MVP — solo escala numérica + texto libre, o también opción múltiple y checklist? Impacta el diseño del componente de renderizado.

---

### HU-11 — Votación y consenso del equipo

**Historia de usuario**
> Como **equipo de selección**, quiero **votar sobre un candidato (avanzar/rechazar) con un sistema de consenso visible para todos** para **tomar decisiones colaborativas y documentadas**.

**Estimación:** 5 SP &nbsp;|&nbsp; **MoSCoW:** Must Have &nbsp;|&nbsp; **Sprint sugerido:** S4

**Validación INVEST**

| Criterio | Estado | Notas |
|----------|--------|-------|
| I — Independiente | ✅ | Independiente del sistema de comentarios |
| N — Negociable | ✅ | Negociable en reglas de consenso (mayoría, unanimidad, configurable) |
| V — Valioso | ✅ | Transparencia en decisiones y trazabilidad |
| E — Estimable | ✅ | Estimable en 3–5 días |
| S — Small | ✅ | Historia acotada al mecanismo de voto |
| T — Testeable | ✅ | Testeable por registro de votos, notificaciones y resolución de empates |

**Criterios de aceptación**

**Escenario 1 — Happy Path**
- **Dado** que todos los evaluadores asignados han completado su entrevista y tienen acceso a votar
- **Cuando** cada evaluador emite su voto (Avanzar / Rechazar / Pendiente)
- **Entonces** el sistema muestra el resultado agregado en tiempo real y notifica al reclutador cuando se alcanza el criterio de consenso configurado, registrando cada voto con timestamp

**Escenario 2 — Error**
- **Dado** que un usuario intenta votar sobre un candidato
- **Cuando** no tiene el rol "Evaluador" asignado para esa vacante
- **Entonces** el sistema muestra "No tienes permisos para votar en esta vacante. Contacta al reclutador responsable" y no registra ningún voto

**Escenario 3 — Edge Case (QA)**
- **Dado** que la votación tiene 3 votos (2 Avanzar, 1 Rechazar) y el criterio configurado requiere unanimidad
- **Cuando** el sistema detecta el desacuerdo
- **Entonces** se crea automáticamente una tarea "Resolver desacuerdo de votación para [candidato]" asignada al reclutador y se notifica a todo el equipo de la necesidad de calibración

**Notas técnicas y dependencias**
> Las reglas de consenso (mayoría simple, unanimidad, umbral configurable) deben estar acordadas antes del sprint. Requiere RBAC para el rol "Evaluador". Reutiliza el canal WebSocket de HU-07/HU-09 para la actualización en tiempo real del resultado agregado.

> ⚠ **Pendiente de clarificación:** ¿La configuración de reglas de consenso es por vacante o por cuenta? La respuesta impacta el diseño del esquema de base de datos y la UI de configuración.

---

### HU-12 — Alertas de inactividad de hiring managers

**Historia de usuario**
> Como **Reclutador**, quiero **recibir alertas cuando un hiring manager no ha dado feedback en más de 48 horas** para **actuar proactivamente y evitar la pérdida de candidatos por inacción**.

**Estimación:** 3 SP &nbsp;|&nbsp; **MoSCoW:** Should Have &nbsp;|&nbsp; **Sprint sugerido:** S7

**Validación INVEST**

| Criterio | Estado | Notas |
|----------|--------|-------|
| I — Independiente | ✅ | Independiente del sistema de comentarios |
| N — Negociable | ✅ | Negociable en el SLA (48 h configurable por cuenta) |
| V — Valioso | ✅ | Previene pérdida de candidatos top |
| E — Estimable | ✅ | Estimable en 2–3 días |
| S — Small | ✅ | Historia pequeña y focalizada |
| T — Testeable | ✅ | Testeable por tiempo de disparo y correcta identificación del responsable |

**Criterios de aceptación**

**Escenario 1 — Happy Path**
- **Dado** que un candidato lleva exactamente 48 horas esperando feedback de un Hiring Manager asignado y el SLA está configurado a 48 h
- **Cuando** el sistema ejecuta la verificación periódica de SLAs
- **Entonces** el reclutador recibe notificación in-app y email con nombre del candidato, vacante, Hiring Manager pendiente y enlace directo al perfil

**Escenario 2 — Error**
- **Dado** que el sistema intenta enviar la alerta de inactividad
- **Cuando** la dirección de email del reclutador está rebotando (hard bounce)
- **Entonces** el sistema registra el fallo, escala la notificación al HR Manager supervisor por canal in-app y marca el canal email del reclutador como "Requiere atención"

**Escenario 3 — Edge Case (QA)**
- **Dado** que el SLA de 48 h está activo y las 48 horas caen completamente dentro de un fin de semana (viernes 18 h a lunes 9 h)
- **Cuando** el sistema calcula el cumplimiento del SLA
- **Entonces** el conteo se pausa durante el fin de semana según el horario laboral configurado (L–V, 9–18 h) y se reanuda el lunes a las 9 h, sin disparar falsas alertas durante el weekend

**Notas técnicas y dependencias**
> El SLA de 48 h debe ser configurable por cuenta (parámetro de configuración). Depende de la infraestructura de notificaciones in-app y email establecida en HU-13. Requiere calendario laboral configurable (festivos, horario laboral) para el cálculo correcto del SLA y evitar falsos positivos.

---

## Módulo 4: Comunicaciones y Automatización

---

### HU-13 — Email de confirmación automático al candidato

**Historia de usuario**
> Como **Reclutador**, quiero **que el sistema envíe automáticamente un email de confirmación a cada candidato al aplicar** para **mejorar su experiencia y dar transparencia al proceso desde el inicio**.

**Estimación:** 2 SP &nbsp;|&nbsp; **MoSCoW:** Must Have &nbsp;|&nbsp; **Sprint sugerido:** S1

**Validación INVEST**

| Criterio | Estado | Notas |
|----------|--------|-------|
| I — Independiente | ✅ | Independiente de workflows complejos |
| N — Negociable | ✅ | Negociable en contenido del template |
| V — Valioso | ✅ | Impacto directo en NPS de candidato |
| E — Estimable | ✅ | Estimable en 1–2 días |
| S — Small | ✅ | Historia muy pequeña, entregable en horas |
| T — Testeable | ✅ | Testeable por entrega en < 2 min y correcta personalización |

**Criterios de aceptación**

**Escenario 1 — Happy Path**
- **Dado** que un candidato completa y envía su aplicación para una vacante activa
- **Cuando** el sistema recibe la aplicación
- **Entonces** en menos de 2 minutos el candidato recibe un email con nombre del puesto, empresa, número de referencia y próximos pasos del proceso

**Escenario 2 — Error**
- **Dado** que el sistema intenta enviar el email de confirmación
- **Cuando** el candidato proporcionó un email con typo (ej. "@gmai.com") que no existe
- **Entonces** el sistema registra el fallo de entrega, marca la aplicación con "Email no entregado – verificar contacto" y muestra alerta al reclutador para contactar por otro medio

**Escenario 3 — Edge Case (QA)**
- **Dado** que un candidato aplica el mismo día a dos vacantes distintas de la misma empresa
- **Cuando** ambas aplicaciones son procesadas
- **Entonces** el candidato recibe dos emails claramente diferenciados por el nombre del puesto, sin fusiones ni duplicados confusos

**Notas técnicas y dependencias**
> Historia de bajo riesgo y alta visibilidad. Primera pieza del módulo de comunicaciones: establece el proveedor de email (SendGrid, AWS SES) y la arquitectura de plantillas con variables dinámicas que reutilizarán HU-14, HU-16. Requiere gestión de bounces y unsubscribes desde el primer día.

---

### HU-14 — Workflow builder no-code

**Historia de usuario**
> Como **Reclutador**, quiero **configurar flujos automáticos (ej: si candidato supera screening, enviar invitación a entrevista) sin escribir código** para **automatizar tareas repetitivas sin depender del equipo técnico**.

**Estimación:** 13 SP &nbsp;|&nbsp; **MoSCoW:** Must Have &nbsp;|&nbsp; **Sprint sugerido:** S4

**Validación INVEST**

| Criterio | Estado | Notas |
|----------|--------|-------|
| I — Independiente | ✅ | Independiente de plantillas (aunque las usa) |
| N — Negociable | ✅ | Negociable en nº de acciones por trigger en el MVP |
| V — Valioso | ✅ | Reduce significativamente el tiempo operativo del reclutador |
| E — Estimable | ✅ | Estimable en 8–13 días (1 sprint) |
| S — Small | ✅ | Entregable con un subconjunto de triggers/acciones para MVP |
| T — Testeable | ✅ | Testeable por ejecución correcta del workflow y detección de bucles |

**Criterios de aceptación**

**Escenario 1 — Happy Path**
- **Dado** que el reclutador accede al workflow builder y tiene plantillas de email configuradas
- **Cuando** configura el trigger "Candidato avanza a Entrevista Técnica" → acción "Enviar email plantilla X" y activa el workflow
- **Entonces** el workflow queda activo y la próxima vez que un candidato avance a esa etapa, el email se envía automáticamente en < 1 minuto sin intervención manual

**Escenario 2 — Error**
- **Dado** que el reclutador diseña un workflow con un bucle circular (acción A dispara trigger B que dispara acción A)
- **Cuando** intenta guardar y activar el workflow
- **Entonces** el sistema detecta el bucle antes de guardar, muestra "Se ha detectado un bucle: Acción A → Trigger B → Acción A" y no permite activar el workflow hasta corregirlo

**Escenario 3 — Edge Case (QA)**
- **Dado** que existe un workflow activo que referencia una plantilla de email
- **Cuando** otro usuario modifica esa plantilla
- **Entonces** el sistema notifica al propietario del workflow "La plantilla '[nombre]' usada en tu workflow ha sido modificada" con enlace para previsualizar el impacto

**Notas técnicas y dependencias**
> Historia de mayor complejidad del módulo (13 SP). **Candidata a dividirse en dos sub-historias antes del sprint:** (1) motor de ejecución backend (trigger-condition-action engine) y (2) UI del builder visual. Depende de HU-13 para las acciones de email.

> ⚠ **Pendiente de clarificación:** ¿Cuántos triggers y acciones distintos debe soportar el MVP? (ej. solo cambio de etapa + envío de email, o también creación de tarea + notificación in-app). Definir el catálogo mínimo antes del sprint para evitar scope creep. Sin esta clarificación la historia podría llegar a 21 SP.

---

### HU-15 — Coordinación de entrevistas con IA

**Historia de usuario**
> Como **Reclutador**, quiero **que la IA sugiera la disponibilidad óptima para entrevistas cruzando los calendarios del equipo** para **reducir el tiempo de coordinación de agenda**.

**Estimación:** 8 SP &nbsp;|&nbsp; **MoSCoW:** Must Have &nbsp;|&nbsp; **Sprint sugerido:** S5

**Validación INVEST**

| Criterio | Estado | Notas |
|----------|--------|-------|
| I — Independiente | ✅ | Independiente del workflow builder |
| N — Negociable | ✅ | Negociable en ventana de búsqueda (5 días por defecto) |
| V — Valioso | ✅ | Ahorro cuantificable en horas de coordinación |
| E — Estimable | ✅ | Estimable en 5–8 días incluyendo integración de calendarios |
| S — Small | ✅ | Entregable con soporte Google Calendar primero, luego Outlook |
| T — Testeable | ✅ | Testeable por calidad y viabilidad de las franjas propuestas |

**Criterios de aceptación**

**Escenario 1 — Happy Path**
- **Dado** que los calendarios de Google/Outlook del reclutador y 2 entrevistadores están integrados y actualizados
- **Cuando** el reclutador solicita sugerencias de horario para una entrevista de 60 minutos
- **Entonces** el sistema propone 3 franjas disponibles para todos en los próximos 5 días laborables, mostrando los nombres de quienes estarían disponibles en cada franja

**Escenario 2 — Error**
- **Dado** que el reclutador solicita sugerencias de horario
- **Cuando** uno de los entrevistadores no ha conectado su calendario
- **Entonces** el sistema muestra opciones para los calendarios conectados, indica qué entrevistador falta y permite al reclutador proceder o solicitar la conexión del calendario pendiente

**Escenario 3 — Edge Case (QA)**
- **Dado** que todos los participantes tienen los calendarios completamente llenos los próximos 5 días
- **Cuando** el sistema busca disponibilidad
- **Entonces** el sistema amplía automáticamente la búsqueda a 10 días, informa al reclutador del motivo y ofrece enviar al candidato un enlace de self-scheduling

**Notas técnicas y dependencias**
> Requiere integración OAuth con Google Calendar y Microsoft Outlook. Alta complejidad en la coordinación de tokens OAuth y scopes de permisos de calendario. El self-scheduling (enlace al candidato) puede diferirse al Sprint 6 si no cabe en S5. Riesgo: cambios en las APIs de calendario pueden bloquear el sprint (ver R-05).

---

### HU-16 — Actualizaciones de estado para el candidato

**Historia de usuario**
> Como **Candidato**, quiero **recibir actualizaciones del estado de mi candidatura por email o SMS** para **sentir que el proceso es transparente y no tener que perseguir al reclutador**.

**Estimación:** 5 SP &nbsp;|&nbsp; **MoSCoW:** Should Have &nbsp;|&nbsp; **Sprint sugerido:** S7

**Validación INVEST**

| Criterio | Estado | Notas |
|----------|--------|-------|
| I — Independiente | ✅ | Independiente de las automatizaciones internas |
| N — Negociable | ✅ | Negociable en canales soportados (email/SMS/WhatsApp) |
| V — Valioso | ✅ | Impacto directo en NPS de candidato |
| E — Estimable | ✅ | Estimable en 3–5 días |
| S — Small | ✅ | Entregable empezando solo con email |
| T — Testeable | ✅ | Testeable por entrega en < 5 min y personalización correcta por canal |

**Criterios de aceptación**

**Escenario 1 — Happy Path**
- **Dado** que el candidato tiene una aplicación activa y eligió notificaciones por email al aplicar
- **Cuando** el reclutador mueve la candidatura a la siguiente etapa
- **Entonces** en < 5 minutos el candidato recibe un email con el nombre de la nueva etapa, el puesto y los próximos pasos si están configurados

**Escenario 2 — Error**
- **Dado** que el candidato eligió recibir notificaciones por SMS
- **Cuando** el número de teléfono es de un país sin cobertura del proveedor SMS
- **Entonces** el sistema detecta el fallo, realiza fallback automático a email (si está disponible), notifica al reclutador del incidente y registra el intento fallido

**Escenario 3 — Edge Case (QA)**
- **Dado** que el candidato recibe una notificación de rechazo con enlace a su portal para ver el motivo
- **Cuando** intenta acceder al portal 45 días después del rechazo
- **Entonces** el enlace ha expirado (30 días por GDPR) y el sistema muestra "Este enlace ha expirado. Para solicitar tus datos contacta con [email GDPR de la empresa]" en lugar de un error 404

**Notas técnicas y dependencias**
> Depende de HU-13 (infraestructura de email y plantillas). SMS requiere proveedor adicional (Twilio, Vonage). La expiración de enlaces de portal a 30 días es un requisito GDPR no negociable. Los enlaces expirados deben retornar una página informativa, nunca un error 4XX.

---

## Módulo 5: Analítica e Inteligencia

---

### HU-17 — Dashboard de métricas en tiempo real

**Historia de usuario**
> Como **HR Manager**, quiero **un dashboard con métricas clave (time-to-hire, conversion rates, source quality) en tiempo real** para **monitorizar el rendimiento del proceso y detectar cuellos de botella**.

**Estimación:** 8 SP &nbsp;|&nbsp; **MoSCoW:** Must Have &nbsp;|&nbsp; **Sprint sugerido:** S5

**Validación INVEST**

| Criterio | Estado | Notas |
|----------|--------|-------|
| I — Independiente | ✅ | Independiente de reportes exportables |
| N — Negociable | ✅ | Negociable en KPIs del MVP (3–5 métricas clave) |
| V — Valioso | ✅ | Valor estratégico directo para HR Manager |
| E — Estimable | ✅ | Estimable en 8–13 días |
| S — Small | ✅ | Puede dividirse en vista básica y avanzada |
| T — Testeable | ✅ | Testeable por precisión de datos y SLA de carga < 2 s |

**Criterios de aceptación**

**Escenario 1 — Happy Path**
- **Dado** que el HR Manager accede al módulo de analítica con ≥ 30 días de actividad
- **Cuando** la página del dashboard carga
- **Entonces** en < 2 segundos se muestran time-to-hire promedio, tasa de conversión por etapa y top 3 fuentes, actualizados con datos de las últimas 24 horas

**Escenario 2 — Error**
- **Dado** que el dashboard intenta cargar datos en tiempo real
- **Cuando** el servicio de analítica tiene un backlog y los datos tienen más de 1 hora de retraso
- **Entonces** el dashboard muestra los últimos datos disponibles con el indicador "Última actualización: hace X horas" y un banner "Datos en procesamiento"

**Escenario 3 — Edge Case (QA)**
- **Dado** que el HR Manager accede al dashboard el primer día tras activar la cuenta (sin datos históricos)
- **Cuando** la página carga
- **Entonces** el sistema muestra el dashboard con indicadores vacíos y el mensaje "Publica tu primera vacante para ver métricas aquí", sin valores NaN, errores ni divisiones por cero

**Notas técnicas y dependencias**
> Requiere capa de analítica (BigQuery, Redshift o agregaciones en BD principal). Los KPIs exactos del MVP deben definirse antes del sprint. Carga target < 2 s (PRD §6.1). Esta historia establece la capa de datos que HU-24 (chat conversacional) necesitará.

---

### HU-18 — Análisis de fuentes con ROI estimado

**Historia de usuario**
> Como **Reclutador**, quiero **ver qué fuentes de candidatos generan más contrataciones exitosas para optimizar el presupuesto de atracción**.

**Estimación:** 5 SP &nbsp;|&nbsp; **MoSCoW:** Must Have &nbsp;|&nbsp; **Sprint sugerido:** S6

**Validación INVEST**

| Criterio | Estado | Notas |
|----------|--------|-------|
| I — Independiente | ✅ | Independiente del dashboard general |
| N — Negociable | ✅ | Negociable en métricas por fuente incluidas en el MVP |
| V — Valioso | ✅ | Impacto directo en optimización de presupuesto |
| E — Estimable | ✅ | Estimable en 3–5 días |
| S — Small | ✅ | Vista focalizada en análisis de fuentes |
| T — Testeable | ✅ | Testeable con datos conocidos comparando tasa de conversión |

**Criterios de aceptación**

**Escenario 1 — Happy Path**
- **Dado** que el reclutador tiene ≥ 3 meses de datos con candidatos de múltiples fuentes
- **Cuando** accede al módulo de análisis de fuentes
- **Entonces** ve un ranking de fuentes ordenado por tasa de conversión a contratación con coste estimado por hire, con filtros por periodo y vacante

**Escenario 2 — Error**
- **Dado** que el reclutador accede al análisis de fuentes
- **Cuando** más del 30% de las candidaturas no tienen fuente registrada
- **Entonces** el sistema muestra los datos disponibles con el aviso "El 30% de candidaturas no tienen fuente registrada; el análisis puede estar sesgado" y un enlace a la guía de configuración de UTMs

**Escenario 3 — Edge Case (QA)**
- **Dado** que el reclutador compara dos fuentes y una tiene solo 2 candidaturas en el periodo
- **Cuando** se calcula el ROI de esa fuente
- **Entonces** el sistema muestra el dato con la advertencia "Muestra estadísticamente insuficiente (n=2): resultado no representativo" y sugiere ampliar el rango de fechas

**Notas técnicas y dependencias**
> Depende del tracking de fuente por candidatura generado en HU-03 (publicación multicanal). Sin el atributo "fuente" correctamente registrado, este análisis no tiene datos. El cálculo del coste por hire debe acordarse antes del sprint.

> ⚠ **Pendiente de clarificación:** ¿El coste por fuente se introduce manualmente por el reclutador (campo libre en la configuración del canal) o se calcula automáticamente a partir de integraciones publicitarias (LinkedIn Ads API, etc.)? La integración automática elevaría la estimación a 8 SP.

---

### HU-19 — Reportes exportables PDF/Excel

**Historia de usuario**
> Como **HR Manager**, quiero **reportes exportables en PDF/Excel para presentar resultados a dirección**.

**Estimación:** 5 SP &nbsp;|&nbsp; **MoSCoW:** Must Have &nbsp;|&nbsp; **Sprint sugerido:** S6

**Validación INVEST**

| Criterio | Estado | Notas |
|----------|--------|-------|
| I — Independiente | ✅ | Independiente del dashboard |
| N — Negociable | ✅ | Negociable en formatos (PDF/Excel/CSV) |
| V — Valioso | ✅ | Valor directo para comunicación con dirección |
| E — Estimable | ✅ | Estimable en 3–5 días |
| S — Small | ✅ | Entregable con un formato inicial (PDF) |
| T — Testeable | ✅ | Testeable por generación correcta, formato y fidelidad de contenido |

**Criterios de aceptación**

**Escenario 1 — Happy Path**
- **Dado** que el HR Manager está en el módulo de reporting con filtros configurados
- **Cuando** selecciona "Exportar" → PDF y confirma
- **Entonces** en < 30 segundos el archivo `LTI_Report_[YYYY-MM-DD].pdf` se descarga con portada, métricas filtradas y formato adecuado para presentación ejecutiva

**Escenario 2 — Error**
- **Dado** que el HR Manager solicita un reporte con rango de 24 meses
- **Cuando** el volumen de datos supera el límite de procesamiento síncrono
- **Entonces** el sistema muestra "El reporte es muy extenso. Te lo enviaremos por email cuando esté listo (estimado: 5–10 min)" y ofrece reducir el rango para generación inmediata

**Escenario 3 — Edge Case (QA)**
- **Dado** que se genera un reporte Excel con nombres de candidatos que contienen caracteres en árabe, chino o cirílico
- **Cuando** el archivo es descargado y abierto en Excel
- **Entonces** el archivo preserva correctamente la codificación unicode de todos los caracteres sin corrupción ni caracteres ilegibles

**Notas técnicas y dependencias**
> Requiere librería de generación PDF (ej. Puppeteer, WeasyPrint) y Excel (ej. xlsx, ExcelJS). Los reportes de más de 6 meses deben procesarse de forma asíncrona con notificación por email al finalizar. El encoding UTF-8/unicode debe validarse explícitamente en los tests de aceptación.

---

### HU-20 — Alertas de candidato en riesgo de abandono

**Historia de usuario**
> Como **HR Manager**, quiero **que el sistema me alerte si hay riesgo de pérdida de un candidato top (tiempo de respuesta alto) para actuar proactivamente**.

**Estimación:** 5 SP &nbsp;|&nbsp; **MoSCoW:** Should Have &nbsp;|&nbsp; **Sprint sugerido:** S7

**Validación INVEST**

| Criterio | Estado | Notas |
|----------|--------|-------|
| I — Independiente | ✅ | Independiente del módulo de analítica general |
| N — Negociable | ✅ | Negociable en umbrales de score (≥80) y tiempo (72 h) |
| V — Valioso | ✅ | Valor crítico en retención de candidatos de alto impacto |
| E — Estimable | ✅ | Estimable en 3–5 días |
| S — Small | ✅ | Historia acotada al mecanismo de alerta |
| T — Testeable | ✅ | Testeable por disparo correcto con umbrales controlados y ausencia de ruido |

**Criterios de aceptación**

**Escenario 1 — Happy Path**
- **Dado** que un candidato con score ≥ 80 lleva más de 72 horas sin movimiento en el pipeline
- **Cuando** el sistema ejecuta el análisis periódico de riesgo de abandono
- **Entonces** el HR Manager recibe notificación in-app con nombre, vacante, días sin movimiento y reclutador responsable, con enlace directo al perfil

**Escenario 2 — Error**
- **Dado** que el sistema calcula el riesgo de un candidato de alto score
- **Cuando** el perfil no tiene datos de contacto completos
- **Entonces** la alerta se genera igualmente con la nota adicional "Perfil de contacto incompleto: verifica teléfono y email antes de actuar"

**Escenario 3 — Edge Case (QA)**
- **Dado** que el mismo candidato activa el criterio de riesgo en 3 vacantes distintas simultáneamente
- **Cuando** el sistema genera las alertas
- **Entonces** el sistema agrupa las 3 en una sola notificación "Candidato [nombre] en riesgo en 3 vacantes" en lugar de 3 notificaciones separadas, evitando ruido

**Notas técnicas y dependencias**
> Depende de HU-06 (scoring de candidatos — umbral score ≥ 80). Los umbrales (score y tiempo sin movimiento) deben ser configurables por cuenta para evitar alert fatigue. La agrupación de alertas por candidato es crítica: implementar deduplicación en el servicio de notificaciones.

---

## Módulo 6: IA y Asistencia Inteligente

---

### HU-21 — Resumen de entrevista generado por IA

**Historia de usuario**
> Como **Reclutador**, quiero **que la IA resuma las notas de una entrevista en un párrafo ejecutivo** para **ahorrar tiempo de documentación y tener un resumen consistente para compartir con el equipo**.

**Estimación:** 3 SP &nbsp;|&nbsp; **MoSCoW:** Should Have &nbsp;|&nbsp; **Sprint sugerido:** S7

**Validación INVEST**

| Criterio | Estado | Notas |
|----------|--------|-------|
| I — Independiente | ✅ | Independiente del generador de JDs |
| N — Negociable | ✅ | Negociable en longitud y estructura del resumen |
| V — Valioso | ✅ | Ahorro medible en minutos de documentación |
| E — Estimable | ✅ | Estimable en 2–4 días |
| S — Small | ✅ | Historia pequeña y focalizada |
| T — Testeable | ✅ | Testeable por calidad, completitud y tiempo de generación < 15 s |

**Criterios de aceptación**

**Escenario 1 — Happy Path**
- **Dado** que el reclutador tiene notas de entrevista de ≥ 100 palabras en el campo de notas del candidato
- **Cuando** hace clic en "Generar resumen con IA"
- **Entonces** en < 15 segundos la IA genera un párrafo ejecutivo de 3–5 oraciones con puntos fuertes, áreas de mejora y recomendación del entrevistador, listo para editar y compartir

**Escenario 2 — Error**
- **Dado** que el reclutador intenta generar el resumen
- **Cuando** las notas están en un idioma que el modelo no procesa con fiabilidad
- **Entonces** el sistema muestra "Idioma no reconocido con suficiente confianza. El resumen se generará en inglés" e incluye la limitación detectada en el output

**Escenario 3 — Edge Case (QA)**
- **Dado** que la IA genera un resumen automático y el entrevistador lo edita manualmente
- **Cuando** guarda la versión modificada
- **Entonces** el sistema guarda la versión editada con el tag "Editado por [nombre]" y conserva la versión original de la IA accesible mediante "Ver versión original"

**Notas técnicas y dependencias**
> Baja complejidad incremental (3 SP) si la integración LLM de HU-02 ya está implementada: reutiliza la misma capa de abstracción. Coordinar la arquitectura LLM compartida con HU-02, HU-22 y HU-23 para evitar duplicación. La versión original de la IA debe conservarse en base de datos (inmutable) para auditoría.

---

### HU-22 — Sugerencias de preguntas de entrevista

**Historia de usuario**
> Como **Reclutador**, quiero **recibir sugerencias de preguntas de entrevista basadas en las brechas del perfil del candidato** para **mejorar la calidad y relevancia de la entrevista**.

**Estimación:** 5 SP &nbsp;|&nbsp; **MoSCoW:** Could Have &nbsp;|&nbsp; **Sprint sugerido:** S8

**Validación INVEST**

| Criterio | Estado | Notas |
|----------|--------|-------|
| I — Independiente | ✅ | Independiente del resumen de entrevista |
| N — Negociable | ✅ | Negociable en número (5–8) y tipo de preguntas generadas |
| V — Valioso | ✅ | Mejora calidad de entrevistas y reduce sesgo de evaluación |
| E — Estimable | ✅ | Estimable en 3–5 días |
| S — Small | ✅ | Historia acotada a la generación de preguntas |
| T — Testeable | ✅ | Testeable por relevancia de preguntas respecto a brechas detectadas |

**Criterios de aceptación**

**Escenario 1 — Happy Path**
- **Dado** que el reclutador prepara la entrevista de un candidato con perfil y requisitos de vacante disponibles
- **Cuando** solicita "Sugerencias de preguntas IA"
- **Entonces** la IA genera 5–8 preguntas focalizadas en las brechas detectadas (ej. falta de experiencia en cloud), clasificadas por tipo (técnica/comportamental/situacional) y listas para usar o editar

**Escenario 2 — Error**
- **Dado** que el reclutador solicita sugerencias de preguntas
- **Cuando** el perfil del candidato está incompleto (solo nombre, sin CV ni experiencia)
- **Entonces** el sistema muestra "Perfil insuficiente para preguntas personalizadas" y ofrece 5 preguntas genéricas del rol como alternativa

**Escenario 3 — Edge Case (QA)**
- **Dado** que el candidato tiene un perfil que cubre todos los requisitos del puesto sin brechas detectables
- **Cuando** el reclutador solicita sugerencias
- **Entonces** la IA genera preguntas de profundización y fit cultural con la nota "Perfil completo: preguntas orientadas a evaluar excelencia y alineación cultural"

**Notas técnicas y dependencias**
> Depende de HU-05 (datos estructurados del CV) y HU-06 (análisis de brechas entre perfil y requisitos). Reutiliza la integración LLM de HU-02 y HU-21. Baja complejidad incremental si las dependencias están en producción cuando llegue a S8.

---

### HU-23 — Detector de sesgo en job descriptions

**Historia de usuario**
> Como **Reclutador**, quiero **que la IA detecte posibles sesgos en el lenguaje de una job description y sugiera alternativas más inclusivas**.

**Estimación:** 5 SP &nbsp;|&nbsp; **MoSCoW:** Should Have &nbsp;|&nbsp; **Sprint sugerido:** S7

**Validación INVEST**

| Criterio | Estado | Notas |
|----------|--------|-------|
| I — Independiente | ✅ | Independiente del generador de JDs (usable sobre JDs existentes) |
| N — Negociable | ✅ | Negociable en tipos de sesgo detectados (género, edad, cultura) |
| V — Valioso | ✅ | Mejora diversidad y reduce riesgo legal |
| E — Estimable | ✅ | Estimable en 3–5 días |
| S — Small | ✅ | Entregable con un subconjunto de tipos de sesgo para el MVP |
| T — Testeable | ✅ | Testeable con corpus documentado de términos sesgados |

**Criterios de aceptación**

**Escenario 1 — Happy Path**
- **Dado** que el reclutador tiene una JD con términos como "rockstar", "joven dinámico" y "nativo digital"
- **Cuando** ejecuta el análisis de sesgo
- **Entonces** el sistema resalta los términos problemáticos, explica el tipo de sesgo de cada uno (edad, género) y ofrece alternativas inclusivas editables inline sin abandonar la vista de edición

**Escenario 2 — Error**
- **Dado** que el reclutador ejecuta el análisis sobre una JD
- **Cuando** la descripción tiene menos de 50 palabras
- **Entonces** el sistema muestra "Añade más contenido para un análisis preciso (mínimo recomendado: 50 palabras)" sin emitir falsos positivos sobre texto insuficiente

**Escenario 3 — Edge Case (QA)**
- **Dado** que el reclutador acepta todas las sugerencias y la JD queda modificada
- **Cuando** re-ejecuta el análisis sobre la versión corregida
- **Entonces** el sistema confirma "Sin sesgos detectados" y ofrece una vista diff para comparar el antes y después antes de publicar

**Notas técnicas y dependencias**
> Usable sobre JDs existentes, independiente de HU-02. Requiere corpus documentado de términos sesgados (lista curada propia o dataset de referencia como Textio). Puede integrarse en el flujo de revisión de HU-02 para aplicarse automáticamente en cada JD generada. Reutiliza la capa LLM.

---

### HU-24 — Chat conversacional con datos del pipeline

**Historia de usuario**
> Como **HR Manager**, quiero **un asistente conversacional (chat) para consultar datos del pipeline en lenguaje natural sin necesidad de generar reportes manualmente**.

**Estimación:** 13 SP &nbsp;|&nbsp; **MoSCoW:** Could Have &nbsp;|&nbsp; **Sprint sugerido:** S8

**Validación INVEST**

| Criterio | Estado | Notas |
|----------|--------|-------|
| I — Independiente | ✅ | Independiente del dashboard (canal alternativo de acceso a datos) |
| N — Negociable | ✅ | Negociable en profundidad de consultas soportadas en el MVP |
| V — Valioso | ✅ | Democratiza el acceso a insights para perfiles no técnicos |
| E — Estimable | ✅ | Estimable en 8–13 días |
| S — Small | ✅ | Entregable con un subconjunto de intenciones de consulta |
| T — Testeable | ✅ | Testeable por variedad de intenciones de consulta y respeto a RBAC |

**Criterios de aceptación**

**Escenario 1 — Happy Path**
- **Dado** que el HR Manager accede al chat conversacional con datos de pipeline disponibles
- **Cuando** pregunta "¿Cuántos candidatos tenemos en etapa final para las vacantes de ingeniería este mes?"
- **Entonces** el asistente responde con el número exacto, las vacantes afectadas y ofrece desgloses por reclutador o semana, en lenguaje natural en < 5 segundos

**Escenario 2 — Error**
- **Dado** que el HR Manager consulta al asistente
- **Cuando** pregunta por datos fuera del sistema ("¿Cuál es la tasa de rotación de empleados?")
- **Entonces** el asistente responde "Esa información no está en LTI ATS. Puedo ayudarte con datos de reclutamiento y pipeline" y sugiere 3 preguntas relacionadas que sí puede responder

**Escenario 3 — Edge Case (QA)**
- **Dado** que el HR Manager consulta datos personales de un candidato específico
- **Cuando** su rol no tiene acceso a esa vacante por restricciones RBAC
- **Entonces** el asistente responde "No tienes permisos para ver los detalles de ese candidato" sin exponer ningún dato ni confirmar si el candidato existe en el sistema

**Notas técnicas y dependencias**
> Alta complejidad (13 SP). Requiere NLU (LLM con RAG sobre datos del pipeline), respeto estricto de RBAC multi-tenant y aislamiento de datos entre tenants. Candidata a dividirse antes del Sprint 8. Depende de HU-17 (capa de datos del pipeline). El aislamiento multi-tenant en el contexto del chat es un riesgo crítico de seguridad (ver R-07).

> ⚠ **Pendiente de clarificación:** ¿Qué datos del pipeline puede consultar el chat y qué consultas SQL/API respaldan cada intención reconocida? Requiere definición exhaustiva (catálogo de intenciones + mappings) antes de iniciar el desarrollo. Sin esta definición la historia no está lista para sprint (Definition of Ready no cumplida).

---

## Resumen de Historias

| ID | Título | Módulo | Persona | SP | MoSCoW | Sprint |
|----|--------|--------|---------|:--:|--------|:------:|
| HU-01 | Crear vacante desde plantilla | Gestión de Vacantes | Reclutador | 3 | Must Have | S1 |
| HU-02 | Generación de JD con IA | Gestión de Vacantes | Reclutador | 5 | Must Have | S2 |
| HU-03 | Publicación multicanal | Gestión de Vacantes | HR Manager | 8 | Must Have | S3 |
| HU-04 | Aprobación de vacantes sin email | Gestión de Vacantes | Hiring Manager | 3 | Should Have | S5 |
| HU-05 | Parser de CV automático | Gestión de Candidatos | Reclutador | 8 | Must Have | S1 |
| HU-06 | Ranking automático de candidatos | Gestión de Candidatos | Reclutador | 8 | Must Have | S2 |
| HU-07 | Pipeline Kanban con drag & drop | Gestión de Candidatos | Reclutador | 5 | Must Have | S1 |
| HU-08 | Búsqueda semántica en talent pool | Gestión de Candidatos | Reclutador | 8 | Must Have | S6 |
| HU-09 | Comentarios en tiempo real | Colaboración y Evaluación | Hiring Manager | 5 | Must Have | S3 |
| HU-10 | Formularios de evaluación personalizados | Colaboración y Evaluación | Reclutador | 5 | Must Have | S3 |
| HU-11 | Votación y consenso del equipo | Colaboración y Evaluación | Equipo | 5 | Must Have | S4 |
| HU-12 | Alertas de inactividad de HMs | Colaboración y Evaluación | Reclutador | 3 | Should Have | S7 |
| HU-13 | Email de confirmación automático | Comunicaciones y Automatización | Reclutador | 2 | Must Have | S1 |
| HU-14 | Workflow builder no-code | Comunicaciones y Automatización | Reclutador | 13 | Must Have | S4 |
| HU-15 | Coordinación de entrevistas con IA | Comunicaciones y Automatización | Reclutador | 8 | Must Have | S5 |
| HU-16 | Actualizaciones de estado al candidato | Comunicaciones y Automatización | Candidato | 5 | Should Have | S7 |
| HU-17 | Dashboard de métricas en tiempo real | Analítica e Inteligencia | HR Manager | 8 | Must Have | S5 |
| HU-18 | Análisis de fuentes con ROI | Analítica e Inteligencia | Reclutador | 5 | Must Have | S6 |
| HU-19 | Reportes exportables PDF/Excel | Analítica e Inteligencia | HR Manager | 5 | Must Have | S6 |
| HU-20 | Alertas de candidato en riesgo | Analítica e Inteligencia | HR Manager | 5 | Should Have | S7 |
| HU-21 | Resumen de entrevista por IA | IA y Asistencia Inteligente | Reclutador | 3 | Should Have | S7 |
| HU-22 | Sugerencias de preguntas de entrevista | IA y Asistencia Inteligente | Reclutador | 5 | Could Have | S8 |
| HU-23 | Detector de sesgo en JDs | IA y Asistencia Inteligente | Reclutador | 5 | Should Have | S7 |
| HU-24 | Chat conversacional con datos del pipeline | IA y Asistencia Inteligente | HR Manager | 13 | Could Have | S8 |

---

## Backlog Priorizado

> Ordenado por prioridad MoSCoW → sprint → story points descendente.  
> **Total: 24 historias · 139 story points · 8 sprints**

| ID | Épica | Historia | SP | MoSCoW | Sprint |
|----|-------|----------|----|--------|--------|
| HU-05 | Gestión de Candidatos | Parser de CV automático | 8 | Must Have | S1 |
| HU-07 | Gestión de Candidatos | Pipeline Kanban con drag & drop | 5 | Must Have | S1 |
| HU-01 | Gestión de Vacantes | Crear vacante desde plantilla | 3 | Must Have | S1 |
| HU-13 | Comunicaciones y Automatización | Email de confirmación automático | 2 | Must Have | S1 |
| HU-06 | Gestión de Candidatos | Ranking automático de candidatos | 8 | Must Have | S2 |
| HU-02 | Gestión de Vacantes | Generación de JD con IA | 5 | Must Have | S2 |
| HU-03 | Gestión de Vacantes | Publicación multicanal | 8 | Must Have | S3 |
| HU-09 | Colaboración y Evaluación | Comentarios en tiempo real | 5 | Must Have | S3 |
| HU-10 | Colaboración y Evaluación | Formularios de evaluación personalizados | 5 | Must Have | S3 |
| HU-14 | Comunicaciones y Automatización | Workflow builder no-code | 13 | Must Have | S4 |
| HU-11 | Colaboración y Evaluación | Votación y consenso del equipo | 5 | Must Have | S4 |
| HU-15 | Comunicaciones y Automatización | Coordinación de entrevistas con IA | 8 | Must Have | S5 |
| HU-17 | Analítica e Inteligencia | Dashboard de métricas en tiempo real | 8 | Must Have | S5 |
| HU-08 | Gestión de Candidatos | Búsqueda semántica en talent pool | 8 | Must Have | S6 |
| HU-18 | Analítica e Inteligencia | Análisis de fuentes con ROI | 5 | Must Have | S6 |
| HU-19 | Analítica e Inteligencia | Reportes exportables PDF/Excel | 5 | Must Have | S6 |
| HU-04 | Gestión de Vacantes | Aprobación de vacantes sin email | 3 | Should Have | S5 |
| HU-16 | Comunicaciones y Automatización | Actualizaciones de estado al candidato | 5 | Should Have | S7 |
| HU-20 | Analítica e Inteligencia | Alertas de candidato en riesgo | 5 | Should Have | S7 |
| HU-23 | IA y Asistencia Inteligente | Detector de sesgo en JDs | 5 | Should Have | S7 |
| HU-12 | Colaboración y Evaluación | Alertas de inactividad de HMs | 3 | Should Have | S7 |
| HU-21 | IA y Asistencia Inteligente | Resumen de entrevista por IA | 3 | Should Have | S7 |
| HU-22 | IA y Asistencia Inteligente | Sugerencias de preguntas de entrevista | 5 | Could Have | S8 |
| HU-24 | IA y Asistencia Inteligente | Chat conversacional con datos del pipeline | 13 | Could Have | S8 |

### Distribución por sprint

| Sprint | Story Points | Historias | Fase del Roadmap |
|--------|:------------:|-----------|------------------|
| S1 | 18 | HU-05, HU-07, HU-01, HU-13 | Fase 1 — MVP |
| S2 | 13 | HU-06, HU-02 | Fase 1 — MVP |
| S3 | 18 | HU-03, HU-09, HU-10 | Fase 1 — MVP |
| S4 | 18 | HU-14, HU-11 | Fase 1 — MVP |
| S5 | 19 | HU-15, HU-17, HU-04 | Fase 2 — Growth |
| S6 | 18 | HU-08, HU-18, HU-19 | Fase 2 — Growth |
| S7 | 21 | HU-16, HU-20, HU-23, HU-12, HU-21 | Fase 2 — Growth |
| S8 | 18 | HU-22, HU-24 | Fase 3 — Scale |
| **Total** | **145** | **24 historias** | |

> ⚠ **Historias pendientes de clarificación antes del sprint asignado:** HU-03 (tipo de integración web), HU-04 (niveles de aprobación), HU-10 (tipos de campo), HU-11 (configuración de consenso), HU-14 (catálogo de triggers/acciones), HU-18 (cálculo de coste por fuente), HU-24 (catálogo de intenciones del chat).

---

*— Fin del Documento —*

LTI ATS · User Stories v1.1 · Confidencial

---

# LTI ATS — Tickets de Trabajo
**Versión:** 1.0 | **Fecha:** Mayo 2026 | **Estado:** Listo para Sprint Planning

> Documento generado a partir de las historias de usuario del backlog priorizado (sección anterior).  
> Contiene los tickets de trabajo de las **5 primeras historias priorizadas** del backlog (MoSCoW → Sprint → Story Points).  
> Cada ticket incluye: título, descripción, criterios de aceptación, prioridad, estimación, asignación/estado, etiquetas, comentarios, referencias e historial de cambios.

---

## Índice de Tickets

| # | Ticket | Historia | Épica | SP | Sprint | Estado |
|---|--------|----------|-------|----|--------|--------|
| 1 | [TICKET-001](#ticket-001--parser-de-cv-automático) | HU-05 — Parser de CV automático | Gestión de Candidatos | 8 | S1 | Pendiente |
| 2 | [TICKET-002](#ticket-002--pipeline-kanban-con-drag--drop) | HU-07 — Pipeline Kanban con drag & drop | Gestión de Candidatos | 5 | S1 | Pendiente |
| 3 | [TICKET-003](#ticket-003--crear-vacante-desde-plantilla) | HU-01 — Crear vacante desde plantilla | Gestión de Vacantes | 3 | S1 | Pendiente |
| 4 | [TICKET-004](#ticket-004--email-de-confirmación-automático-al-candidato) | HU-13 — Email de confirmación automático | Comunicaciones y Automatización | 2 | S1 | Pendiente |
| 5 | [TICKET-005](#ticket-005--ranking-automático-de-candidatos) | HU-06 — Ranking automático de candidatos | Gestión de Candidatos | 8 | S2 | Bloqueado |

**Total Sprint 1:** 18 SP · 4 tickets listos para desarrollo  
**Total Sprint 2 (ticket 5):** 8 SP · inicio condicionado a TICKET-001

---

## TICKET-001 — Parser de CV automático

| Campo | Valor |
|---|---|
| **ID** | TICKET-001 |
| **Historia de usuario** | HU-05 |
| **Épica** | Gestión de Candidatos |
| **Sprint** | S1 |
| **Estado** | Pendiente |

### 1. Título
Parser de CV automático — extracción de datos al recibir aplicación

### 2. Descripción
Como **Reclutador**, quiero que el sistema extraiga automáticamente los datos del CV al recibir una aplicación para **eliminar la carga manual de introducción de datos y agilizar el proceso**.

El sistema debe procesar CVs en formatos PDF y DOCX, extraer los campos clave (nombre, email, teléfono, experiencia laboral, educación y habilidades) con una precisión mínima del 90%, y crear el perfil del candidato de forma automática en menos de 5 segundos desde la recepción de la aplicación. Los CVs con diseños complejos (dos columnas, tablas) deben ser manejados manteniendo el orden lógico del contenido; los campos de baja confianza deben marcarse explícitamente para revisión manual.

### 3. Criterios de Aceptación

**Escenario 1 — Happy Path**
- **Dado** que un candidato envía su aplicación con CV en formato PDF estándar
- **Cuando** el sistema recibe la aplicación
- **Entonces** en menos de 5 segundos el perfil queda pre-rellenado con nombre, email, teléfono, experiencia, educación y habilidades con precisión ≥ 90%

**Escenario 2 — Error**
- **Dado** que llega una aplicación con un archivo adjunto corrupto o en formato no soportado
- **Cuando** el parser intenta procesarlo
- **Entonces** el sistema crea el perfil con el email del remitente, marca el CV como "Requiere revisión manual" y notifica al reclutador con enlace directo al perfil

**Escenario 3 — Edge Case (QA)**
- **Dado** que el CV tiene un diseño de dos columnas paralelas en PDF
- **Cuando** el parser procesa el documento
- **Entonces** el sistema extrae la información manteniendo el orden lógico (sin mezclar columnas) y marca con baja confianza los campos donde detecta ambigüedad

### 4. Prioridad
**Must Have** — Crítica para el MVP. Criterio de lanzamiento: precisión ≥ 90% (PRD §7.3).

### 5. Estimación
**8 Story Points** | Esfuerzo estimado: 5–7 días de desarrollo

### 6. Asignado a / Estado

| Campo | Valor |
|---|---|
| **Asignado a** | Por asignar (Equipo Backend) |
| **Revisor** | Tech Lead |
| **Estado** | Pendiente |
| **Sprint** | S1 |

### 7. Etiquetas / Tags
`backend` · `parser` · `CV` · `IA/ML` · `MVP` · `must-have` · `S1` · `candidatos` · `integración` · `alta-prioridad`

### 8. Comentarios y Notas

> **Nota técnica (Arquitecto):** Evaluar motores disponibles antes de iniciar el desarrollo: AWS Textract, Affinda, o modelo propio fine-tuned. La decisión impacta directamente el coste operativo a escala. Proponer ADR (Architecture Decision Record) en la primera reunión del sprint.

> **Nota de QA:** Los datasets de prueba deben incluir: PDF estándar, PDF de dos columnas, DOCX con tablas, archivo corrupto y formato no soportado (.odt). Preparar ground-truth de extracción para validar el umbral del 90%.

> **Nota de Producto:** LinkedIn import puede diferirse a Sprint 3 si hay presión de tiempo. El MVP requiere solo PDF y DOCX.

> **Alerta de dependencia:** Los datos estructurados generados por este componente son prerequisito directo de TICKET-005 (HU-06 Ranking) y HU-08 (Búsqueda semántica). Cualquier retraso aquí genera bloqueo en cascada.

### 9. Enlaces y Referencias

| Tipo | Descripción | Enlace |
|---|---|---|
| Historia de usuario | HU-05 — Parser de CV automático | [Ver HU-05](#hu-05--parser-de-cv-automático) |
| PRD | Criterio de calidad §7.3 (precisión ≥ 90%) | [LTI_ATS_PRD_v1.0.md](./LTI_ATS_PRD_v1.0.md) |
| Ticket relacionado | TICKET-005 — Ranking automático (dependiente) | [Ver TICKET-005](#ticket-005--ranking-automático-de-candidatos) |
| Documentación externa | AWS Textract | https://aws.amazon.com/textract/ |
| Documentación externa | Affinda CV Parser API | https://affinda.com |

### 10. Historial de Cambios

| Fecha | Autor | Cambio |
|---|---|---|
| 2026-05-12 | Product Owner | Ticket creado a partir de HU-05. Estado inicial: Pendiente. Prioridad: Must Have. Sprint asignado: S1. |

---

## TICKET-002 — Pipeline Kanban con drag & drop

| Campo | Valor |
|---|---|
| **ID** | TICKET-002 |
| **Historia de usuario** | HU-07 |
| **Épica** | Gestión de Candidatos |
| **Sprint** | S1 |
| **Estado** | Pendiente |

### 1. Título
Pipeline Kanban con drag & drop — gestión visual de candidatos por etapas

### 2. Descripción
Como **Reclutador**, quiero mover candidatos entre etapas del pipeline con drag & drop para **gestionar el proceso de forma visual e intuitiva reduciendo clics**.

El tablero Kanban debe mostrar las etapas configurables del proceso de selección como columnas. Las tarjetas de candidatos deben poder arrastrarse entre columnas y el cambio de etapa debe reflejarse en tiempo real para todos los colaboradores activos mediante WebSocket. Al mover un candidato, deben dispararse los workflows asociados a la nueva etapa. Ciertos movimientos deben estar bloqueados por validaciones (ej. formulario de evaluación incompleto). En caso de edición concurrente, aplicar política FIFO y notificar al segundo usuario.

### 3. Criterios de Aceptación

**Escenario 1 — Happy Path**
- **Dado** que el reclutador está en la vista Kanban con candidatos en "Screening"
- **Cuando** arrastra la tarjeta de un candidato a la columna "Entrevista Técnica"
- **Entonces** el candidato se actualiza a la nueva etapa inmediatamente, los workflows asociados se disparan y el cambio es visible en tiempo real para todos los colaboradores activos

**Escenario 2 — Error**
- **Dado** que el reclutador intenta arrastrar un candidato a la etapa "Oferta"
- **Cuando** el formulario de evaluación obligatorio no está completado
- **Entonces** el sistema bloquea el movimiento, el candidato vuelve a su posición original y aparece el tooltip "Completa el formulario de evaluación antes de avanzar a Oferta"

**Escenario 3 — Edge Case (QA)**
- **Dado** que dos reclutadores ven el mismo pipeline y ambos arrastran el mismo candidato a etapas distintas simultáneamente
- **Cuando** las dos acciones llegan al servidor
- **Entonces** el sistema aplica el primer movimiento (FIFO), actualiza la vista de ambos y el segundo recibe el aviso "El estado de este candidato fue actualizado por [nombre]"

### 4. Prioridad
**Must Have** — Alta visibilidad y valor inmediato en usabilidad para el MVP.

### 5. Estimación
**5 Story Points** | Esfuerzo estimado: 3–5 días de desarrollo

### 6. Asignado a / Estado

| Campo | Valor |
|---|---|
| **Asignado a** | Por asignar (Equipo Frontend) |
| **Revisor** | Tech Lead + UX Designer |
| **Estado** | Pendiente |
| **Sprint** | S1 |

### 7. Etiquetas / Tags
`frontend` · `UI` · `kanban` · `drag-and-drop` · `websocket` · `tiempo-real` · `pipeline` · `MVP` · `must-have` · `S1` · `UX`

### 8. Comentarios y Notas

> **Nota técnica (Arquitecto):** La infraestructura WebSocket implementada aquí es reutilizable por HU-09 (comentarios en tiempo real) y HU-11 (votación). **Coordinar la arquitectura del canal compartido en este sprint** para reducir costes de desarrollo posteriores. Proponer diseño del canal WS en kick-off del Sprint 1.

> **Nota de UX:** Las etapas del pipeline deben ser configurables por cuenta (no hardcodeadas). Incluir en el diseño el estado visual del bloqueo (tarjeta que "vuelve" a su origen con animación y tooltip).

> **Nota de QA:** Validar el escenario de concurrencia con tests de carga simulando 2 usuarios editando simultáneamente. Verificar que el mensaje de conflicto FIFO aparece correctamente y no se pierde ningún cambio.

> **Dependencia crítica de arquitectura:** La decisión de librería drag & drop (ej. `react-beautiful-dnd`, `dnd-kit`) debe tomarse en la primera sesión del sprint para no bloquear el desarrollo frontend.

### 9. Enlaces y Referencias

| Tipo | Descripción | Enlace |
|---|---|---|
| Historia de usuario | HU-07 — Pipeline Kanban | [Ver HU-07](#hu-07--pipeline-kanban-con-drag--drop) |
| PRD | Módulo de Pipeline | [LTI_ATS_PRD_v1.0.md](./LTI_ATS_PRD_v1.0.md) |
| Ticket relacionado | HU-09 — Comentarios tiempo real (reutiliza WS) | [Ver HU-09](#hu-09--comentarios-en-tiempo-real-sobre-candidatos) |
| Ticket relacionado | HU-11 — Votación (reutiliza WS) | [Ver HU-11](#hu-11--votación-y-consenso-del-equipo) |
| Documentación externa | dnd-kit (drag & drop library) | https://dndkit.com |

### 10. Historial de Cambios

| Fecha | Autor | Cambio |
|---|---|---|
| 2026-05-12 | Product Owner | Ticket creado a partir de HU-07. Estado inicial: Pendiente. Sprint asignado: S1. |

---

## TICKET-003 — Crear vacante desde plantilla

| Campo | Valor |
|---|---|
| **ID** | TICKET-003 |
| **Historia de usuario** | HU-01 |
| **Épica** | Gestión de Vacantes |
| **Sprint** | S1 |
| **Estado** | Pendiente |

### 1. Título
Crear vacante desde plantilla — configuración inicial acelerada de nuevas vacantes

### 2. Descripción
Como **Reclutador**, quiero crear una vacante a partir de una plantilla existente para **reducir el tiempo de configuración inicial**.

El sistema debe permitir al reclutador seleccionar una plantilla de la lista disponible, pre-rellenar el formulario de creación de vacante con todos sus campos (título, descripción, requisitos y beneficios) y permitir su edición antes de guardar en estado "Borrador". Cuando la plantilla seleccionada no esté disponible (eliminada concurrentemente), el sistema debe mostrar mensaje de error controlado. Si la plantilla tiene más de 12 meses de antigüedad, advertir al usuario y sugerir revisarla con el asistente IA.

### 3. Criterios de Aceptación

**Escenario 1 — Happy Path**
- **Dado** que el reclutador tiene al menos una plantilla guardada y está autenticado
- **Cuando** selecciona "Nueva vacante desde plantilla" y elige una de la lista
- **Entonces** el formulario se pre-rellena con todos los campos de la plantilla (título, descripción, requisitos), el reclutador puede editarlos y guardar la vacante en estado **Borrador**

**Escenario 2 — Error**
- **Dado** que el reclutador inicia la creación desde plantilla
- **Cuando** la única plantilla disponible fue eliminada por otro usuario durante la misma sesión
- **Entonces** el sistema muestra "Plantilla no disponible" con la opción "Crear desde cero" sin errores no controlados

**Escenario 3 — Edge Case (QA)**
- **Dado** que el reclutador selecciona una plantilla con más de 12 meses de antigüedad
- **Cuando** acepta importar el contenido
- **Entonces** el sistema muestra el aviso "Esta plantilla tiene más de 12 meses; te recomendamos revisarla con el asistente IA" y ofrece acceso directo al generador de JD (HU-02)

### 4. Prioridad
**Must Have** — Buen candidato para iniciar Sprint 1 por su baja complejidad y alto valor visible.

### 5. Estimación
**3 Story Points** | Esfuerzo estimado: 1–3 días de desarrollo

### 6. Asignado a / Estado

| Campo | Valor |
|---|---|
| **Asignado a** | Por asignar (Fullstack Junior / Mid) |
| **Revisor** | Tech Lead |
| **Estado** | Pendiente |
| **Sprint** | S1 |

### 7. Etiquetas / Tags
`frontend` · `backend` · `vacantes` · `plantillas` · `CRUD` · `MVP` · `must-have` · `S1` · `baja-complejidad` · `quick-win`

### 8. Comentarios y Notas

> **Nota técnica:** Requiere módulo de gestión de plantillas con CRUD básico. Sin dependencias de IA ni integraciones externas. Ideal para asignar a un perfil junior/mid como ticket de arranque del sprint.

> **Nota de Producto:** El flujo de creación desde plantilla debe ser el punto de entrada principal para nuevas vacantes en el MVP. El flujo "Crear desde cero" debe existir como alternativa secundaria.

> **Nota de UX:** El aviso de plantilla con más de 12 meses (Escenario 3) debe ser un banner no bloqueante dentro del mismo formulario. No redirigir automáticamente al usuario; es su decisión continuar o ir al generador de JD.

> **Dependencia futura:** HU-02 (Generación de JD con IA) es el destino del enlace en el aviso de plantilla antigua. Asegurar que la URL de destino sea conocida antes de implementar el aviso.

### 9. Enlaces y Referencias

| Tipo | Descripción | Enlace |
|---|---|---|
| Historia de usuario | HU-01 — Crear vacante desde plantilla | [Ver HU-01](#hu-01--crear-vacante-desde-plantilla) |
| Ticket relacionado | HU-02 — Generación de JD con IA | [Ver HU-02](#hu-02--generación-de-jd-con-ia) |
| PRD | Módulo de Gestión de Vacantes | [LTI_ATS_PRD_v1.0.md](./LTI_ATS_PRD_v1.0.md) |

### 10. Historial de Cambios

| Fecha | Autor | Cambio |
|---|---|---|
| 2026-05-12 | Product Owner | Ticket creado a partir de HU-01. Estado inicial: Pendiente. Sprint asignado: S1. |

---

## TICKET-004 — Email de confirmación automático al candidato

| Campo | Valor |
|---|---|
| **ID** | TICKET-004 |
| **Historia de usuario** | HU-13 |
| **Épica** | Comunicaciones y Automatización |
| **Sprint** | S1 |
| **Estado** | Pendiente |

### 1. Título
Email de confirmación automático — acuse de recibo de candidatura en menos de 2 minutos

### 2. Descripción
Como **Reclutador**, quiero que el sistema envíe automáticamente un email de confirmación a cada candidato al aplicar para **mejorar su experiencia y dar transparencia al proceso desde el inicio**.

El email debe enviarse en menos de 2 minutos desde la recepción de la aplicación e incluir: nombre del puesto, nombre de la empresa, número de referencia de candidatura y próximos pasos del proceso. El sistema debe gestionar los fallos de entrega (bounces, emails inválidos) notificando al reclutador. Cuando un candidato aplique a dos vacantes el mismo día, debe recibir dos emails claramente diferenciados sin fusiones ni duplicados.

Esta historia es la primera pieza del módulo de comunicaciones: establece el proveedor de email y la arquitectura de plantillas que reutilizarán HU-14 y HU-16.

### 3. Criterios de Aceptación

**Escenario 1 — Happy Path**
- **Dado** que un candidato completa y envía su aplicación para una vacante activa
- **Cuando** el sistema recibe la aplicación
- **Entonces** en menos de 2 minutos el candidato recibe un email con nombre del puesto, empresa, número de referencia y próximos pasos del proceso

**Escenario 2 — Error**
- **Dado** que el sistema intenta enviar el email de confirmación
- **Cuando** el candidato proporcionó un email con typo (ej. "@gmai.com") que no existe
- **Entonces** el sistema registra el fallo de entrega, marca la aplicación con "Email no entregado – verificar contacto" y muestra alerta al reclutador para contactar por otro medio

**Escenario 3 — Edge Case (QA)**
- **Dado** que un candidato aplica el mismo día a dos vacantes distintas de la misma empresa
- **Cuando** ambas aplicaciones son procesadas
- **Entonces** el candidato recibe dos emails claramente diferenciados por el nombre del puesto, sin fusiones ni duplicados confusos

### 4. Prioridad
**Must Have** — Historia de bajo riesgo y alta visibilidad. Impacto directo en NPS del candidato.

### 5. Estimación
**2 Story Points** | Esfuerzo estimado: 1–2 días de desarrollo

### 6. Asignado a / Estado

| Campo | Valor |
|---|---|
| **Asignado a** | Por asignar (Backend) |
| **Revisor** | Tech Lead |
| **Estado** | Pendiente |
| **Sprint** | S1 |

### 7. Etiquetas / Tags
`backend` · `email` · `comunicaciones` · `candidato` · `automatización` · `MVP` · `must-have` · `S1` · `SendGrid` · `plantillas` · `NPS` · `quick-win`

### 8. Comentarios y Notas

> **Decisión arquitectónica pendiente:** Seleccionar proveedor de email antes de iniciar desarrollo. Candidatos: SendGrid (recomendado por facilidad de integración y dashboard de entregabilidad) o AWS SES (más económico a escala). La decisión impacta HU-14 y HU-16, que reutilizarán la misma infraestructura.

> **Nota de cumplimiento:** Implementar gestión de bounces (hard y soft) y unsubscribes desde el primer día. Requisito obligatorio CAN-SPAM / GDPR.

> **Nota de Producto:** El template inicial puede ser sencillo (texto plano + variables dinámicas), pero la arquitectura de plantillas debe ser extensible para los templates más ricos que vendrán en HU-14 y HU-16.

> **Nota de QA:** El SLA de entrega < 2 minutos debe validarse con un test end-to-end automatizado. Usar un buzón de pruebas (ej. Mailtrap, Mailpit) en el entorno de testing.

### 9. Enlaces y Referencias

| Tipo | Descripción | Enlace |
|---|---|---|
| Historia de usuario | HU-13 — Email de confirmación automático | [Ver HU-13](#hu-13--email-de-confirmación-automático-al-candidato) |
| Ticket relacionado | HU-14 — Workflow builder (reutiliza arquitectura de email) | [Ver HU-14](#hu-14--workflow-builder-no-code) |
| Ticket relacionado | HU-16 — Actualizaciones de estado al candidato | [Ver HU-16](#hu-16--actualizaciones-de-estado-para-el-candidato) |
| PRD | Módulo de Comunicaciones | [LTI_ATS_PRD_v1.0.md](./LTI_ATS_PRD_v1.0.md) |
| Documentación externa | SendGrid API Docs | https://docs.sendgrid.com |
| Documentación externa | AWS SES Developer Guide | https://docs.aws.amazon.com/ses/ |

### 10. Historial de Cambios

| Fecha | Autor | Cambio |
|---|---|---|
| 2026-05-12 | Product Owner | Ticket creado a partir de HU-13. Estado inicial: Pendiente. Sprint asignado: S1. Nota: primera pieza del módulo de comunicaciones; decisión de proveedor de email requerida antes del desarrollo. |

---

## TICKET-005 — Ranking automático de candidatos

| Campo | Valor |
|---|---|
| **ID** | TICKET-005 |
| **Historia de usuario** | HU-06 |
| **Épica** | Gestión de Candidatos |
| **Sprint** | S2 |
| **Estado** | Bloqueado (pendiente TICKET-001) |

### 1. Título
Ranking automático de candidatos — score y priorización por ajuste al perfil de la vacante

### 2. Descripción
Como **Reclutador**, quiero ver un ranking automático de candidatos por ajuste al perfil para **priorizar mis revisiones y enfocarme en los más prometedores primero**.

El sistema debe calcular un score de 0 a 100 para cada candidato respecto a una vacante, mostrando los 3 factores principales que explican la puntuación. El ranking debe estar disponible en menos de 2 segundos al acceder a la vista del pipeline. El modelo inicial puede basarse en matching de keywords y reglas ponderadas, siendo mejorable iterativamente con ML en sprints posteriores. Casos especiales a manejar: confianza baja por datos insuficientes y detección de sobrequalificación.

**Dependencia bloqueante:** Requiere que TICKET-001 (Parser de CV) esté completado y en producción, ya que el scoring se alimenta de los datos estructurados extraídos del CV.

### 3. Criterios de Aceptación

**Escenario 1 — Happy Path**
- **Dado** que una vacante tiene ≥ 20 candidatos con CVs procesados
- **Cuando** el reclutador accede a la vista del pipeline
- **Entonces** los candidatos aparecen ordenados por score (0–100) con los 3 factores principales que explican la puntuación, disponible en < 2 s

**Escenario 2 — Error**
- **Dado** que el modelo de scoring no tiene datos de entrenamiento suficientes para un rol muy nicho
- **Cuando** se calcula el score de un candidato
- **Entonces** el sistema muestra el score con etiqueta "Confianza baja" e ícono informativo "Datos insuficientes para este rol; revisar manualmente"

**Escenario 3 — Edge Case (QA)**
- **Dado** que un candidato aplica con un perfil significativamente superior a todos los requisitos del puesto
- **Cuando** el sistema calcula su score
- **Entonces** el sistema muestra la alerta "Perfil muy por encima del rango (posible sobrequalificación)" en lugar de un score alto que induzca a error

### 4. Prioridad
**Must Have** — Reduce tiempo de revisión y mejora la priorización. Componente central del valor diferencial del ATS.

### 5. Estimación
**8 Story Points** | Esfuerzo estimado: 5–8 días de desarrollo

### 6. Asignado a / Estado

| Campo | Valor |
|---|---|
| **Asignado a** | Por asignar (Equipo Backend / Data) |
| **Revisor** | Tech Lead + Data Scientist |
| **Estado** | **Bloqueado** — depende de TICKET-001 (HU-05) |
| **Sprint** | S2 |

### 7. Etiquetas / Tags
`backend` · `IA/ML` · `scoring` · `ranking` · `candidatos` · `algoritmo` · `MVP` · `must-have` · `S2` · `data` · `bloqueado`

### 8. Comentarios y Notas

> **Bloqueante confirmado:** Este ticket no puede iniciarse hasta que TICKET-001 (Parser de CV) esté en producción con datos estructurados disponibles. El equipo de Backend/Data puede preparar el diseño del modelo y los datos de prueba sintéticos durante el Sprint 1 para estar listo para arrancar en S2 sin fricción.

> **Nota técnica (Data):** El modelo v1 puede implementarse como un sistema de reglas ponderadas sobre keywords extraídos del CV vs. requisitos de la vacante. Los pesos iniciales deben definirse con Producto antes del sprint (ej. experiencia en años: 30%, habilidades técnicas: 40%, educación: 20%, otros: 10%).

> **Nota de Producto:** Los 3 factores explicativos del score son fundamentales para la confianza del reclutador en el sistema. Sin explicabilidad, el ranking será ignorado. Priorizar la UI de explicación junto al score numérico.

> **Deuda técnica planificada:** La versión ML (modelo de lenguaje o embeddings para matching semántico) se planificará para sprints posteriores. En S2 se entrega el modelo base funcional basado en reglas.

> **Alerta de dependencia futura:** Los scores generados aquí son prerequisito de HU-20 (alertas de candidato en riesgo de abandono, umbral score ≥ 80). Asegurar que el score sea un campo persistido y consultable.

### 9. Enlaces y Referencias

| Tipo | Descripción | Enlace |
|---|---|---|
| Historia de usuario | HU-06 — Ranking automático de candidatos | [Ver HU-06](#hu-06--ranking-automático-de-candidatos) |
| Ticket bloqueante | TICKET-001 — Parser de CV (prerequisito) | [Ver TICKET-001](#ticket-001--parser-de-cv-automático) |
| Ticket dependiente | HU-20 — Alertas de candidato en riesgo (consume score) | [Ver HU-20](#hu-20--alertas-de-candidato-en-riesgo-de-abandono) |
| PRD | Módulo de Scoring | [LTI_ATS_PRD_v1.0.md](./LTI_ATS_PRD_v1.0.md) |

### 10. Historial de Cambios

| Fecha | Autor | Cambio |
|---|---|---|
| 2026-05-12 | Product Owner | Ticket creado a partir de HU-06. Estado inicial: Bloqueado (pendiente TICKET-001). Sprint asignado: S2. Nota: equipo de Data puede iniciar diseño del modelo en S1 con datos sintéticos. |

---

## Resumen Ejecutivo de Tickets

| # | Ticket | Historia | Épica | SP | Sprint | MoSCoW | Estado |
|---|--------|----------|-------|----|--------|--------|--------|
| 1 | TICKET-001 | HU-05 — Parser de CV | Gestión de Candidatos | 8 | S1 | Must Have | Pendiente |
| 2 | TICKET-002 | HU-07 — Pipeline Kanban | Gestión de Candidatos | 5 | S1 | Must Have | Pendiente |
| 3 | TICKET-003 | HU-01 — Vacante desde plantilla | Gestión de Vacantes | 3 | S1 | Must Have | Pendiente |
| 4 | TICKET-004 | HU-13 — Email de confirmación | Comunicaciones | 2 | S1 | Must Have | Pendiente |
| 5 | TICKET-005 | HU-06 — Ranking de candidatos | Gestión de Candidatos | 8 | S2 | Must Have | Bloqueado |
| | | | **Total** | **26 SP** | | | |

### Dependencias entre tickets

```
TICKET-001 (Parser de CV)
    └── bloquea → TICKET-005 (Ranking de candidatos)
                      └── alimenta → HU-20 (Alertas de riesgo, fuera de scope)

TICKET-002 (Pipeline Kanban - WebSocket)
    └── arquitectura reutilizada por → HU-09 (Comentarios tiempo real)
    └── arquitectura reutilizada por → HU-11 (Votación)

TICKET-004 (Email de confirmación - infraestructura)
    └── arquitectura reutilizada por → HU-14 (Workflow builder)
    └── arquitectura reutilizada por → HU-16 (Actualizaciones de estado)
```

### Decisiones pendientes antes del Sprint 1

| # | Decisión | Responsable | Impacto |
|---|---|---|---|
| 1 | Selección de motor de parsing de CV (AWS Textract / Affinda / propio) | Tech Lead + Arquitecto | TICKET-001 |
| 2 | Selección de librería drag & drop (dnd-kit / react-beautiful-dnd) | Tech Lead Frontend | TICKET-002 |
| 3 | Diseño del canal WebSocket compartido (Pipeline + Comentarios + Votación) | Arquitecto | TICKET-002, HU-09, HU-11 |
| 4 | Selección de proveedor de email (SendGrid / AWS SES) | Tech Lead + Producto | TICKET-004 |
| 5 | Pesos del modelo de scoring v1 | Product Owner + Data | TICKET-005 |

---

*— Fin del Documento —*

LTI ATS · User Stories v1.1 + Work Tickets v1.0 · Confidencial
