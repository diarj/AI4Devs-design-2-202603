import {
  Stack, Grid, Row, H1, H2, H3, Text, Divider, Stat, Table,
  Card, CardHeader, CardBody, Pill, Callout, useHostTheme, useCanvasState,
} from 'cursor/canvas';

// ─── Types ───────────────────────────────────────────────────────────────────

type MoSCoW = 'Must Have' | 'Should Have' | 'Could Have';
type Scenario = { scenario: string; given: string; when: string; then: string };
type Story = {
  id: string; epicId: string; epicName: string; title: string;
  userStory: string; persona: string; moscow: MoSCoW;
  points: number; sprint: number;
  criteria: Scenario[]; notes: string; ambiguity: string | null;
};
type Epic = { id: string; name: string; description: string; storyIds: string[] };
type Risk = { id: string; risk: string; impact: string; mitigation: string; relatedHU: string };
type Tab = 'resumen' | 'epicas' | 'backlog' | 'historias' | 'riesgos';

// ─── Data ────────────────────────────────────────────────────────────────────

const EPICS: Epic[] = [
  { id: 'EP-01', name: 'Gestión de Vacantes',
    description: 'Creación, configuración, aprobación y publicación multicanal de vacantes con asistencia de IA para reducir el tiempo operativo.',
    storyIds: ['HU-01', 'HU-02', 'HU-03', 'HU-04'] },
  { id: 'EP-02', name: 'Gestión de Candidatos',
    description: 'Parsing automático de CVs, ranking por IA, pipeline Kanban visual con drag & drop y búsqueda semántica en el talent pool.',
    storyIds: ['HU-05', 'HU-06', 'HU-07', 'HU-08'] },
  { id: 'EP-03', name: 'Colaboración y Evaluación',
    description: 'Comentarios en tiempo real, formularios de evaluación por rol, sistema de votación colaborativa y alertas de inactividad de hiring managers.',
    storyIds: ['HU-09', 'HU-10', 'HU-11', 'HU-12'] },
  { id: 'EP-04', name: 'Comunicaciones y Automatización',
    description: 'Notificaciones automáticas, workflow builder no-code, coordinación de entrevistas con IA y comunicaciones de estado al candidato.',
    storyIds: ['HU-13', 'HU-14', 'HU-15', 'HU-16'] },
  { id: 'EP-05', name: 'Analítica e Inteligencia',
    description: 'Dashboard en tiempo real, análisis de ROI por fuente de candidatos, reportes exportables y alertas proactivas de abandono.',
    storyIds: ['HU-17', 'HU-18', 'HU-19', 'HU-20'] },
  { id: 'EP-06', name: 'IA y Asistencia Inteligente',
    description: 'Resumen de entrevistas por IA, sugerencias de preguntas, detector de sesgo en JDs y chat conversacional con datos del pipeline.',
    storyIds: ['HU-21', 'HU-22', 'HU-23', 'HU-24'] },
];

const STORIES: Story[] = [
  // ── Sprint 1 ──
  {
    id: 'HU-05', epicId: 'EP-02', epicName: 'Gestión de Candidatos',
    title: 'Parser de CV automático',
    userStory: 'Como Reclutador, quiero que el sistema extraiga automáticamente los datos del CV al recibir una aplicación, para eliminar la carga manual de introducción de datos y agilizar el proceso.',
    persona: 'Reclutador', moscow: 'Must Have', points: 8, sprint: 1,
    criteria: [
      { scenario: 'Happy Path',
        given: 'un candidato envía su aplicación con CV en formato PDF estándar',
        when: 'el sistema recibe la aplicación',
        then: 'en < 5 s el perfil queda pre-rellenado con nombre, email, teléfono, experiencia, educación y habilidades con precisión ≥ 90%' },
      { scenario: 'Error',
        given: 'llega una aplicación con archivo corrupto o formato no soportado',
        when: 'el parser intenta procesarlo',
        then: 'se crea el perfil con el email, se marca el CV como "Requiere revisión manual" y se notifica al reclutador con enlace al perfil' },
      { scenario: 'Edge Case',
        given: 'el CV tiene diseño de dos columnas paralelas en PDF',
        when: 'el parser procesa el documento',
        then: 'extrae la información en orden lógico sin mezclar columnas y marca con baja confianza los campos donde detecta ambigüedad' },
    ],
    notes: 'Componente crítico del MVP. Requiere motor de parsing (ej. Textract, Affinda o modelo propio). Precisión objetivo ≥ 90% (PRD §7.3). Formatos: PDF, DOCX, LinkedIn.',
    ambiguity: null,
  },
  {
    id: 'HU-07', epicId: 'EP-02', epicName: 'Gestión de Candidatos',
    title: 'Pipeline Kanban con drag & drop',
    userStory: 'Como Reclutador, quiero mover candidatos entre etapas del pipeline con drag & drop, para gestionar el proceso de forma visual e intuitiva reduciendo clics.',
    persona: 'Reclutador', moscow: 'Must Have', points: 5, sprint: 1,
    criteria: [
      { scenario: 'Happy Path',
        given: 'el reclutador está en la vista Kanban con candidatos en "Screening"',
        when: 'arrastra la tarjeta de un candidato a la columna "Entrevista Técnica"',
        then: 'el candidato se actualiza a la nueva etapa inmediatamente, los workflows asociados se disparan y el cambio es visible en tiempo real para todos los colaboradores activos' },
      { scenario: 'Error',
        given: 'el reclutador intenta arrastrar un candidato a la etapa "Oferta"',
        when: 'el formulario de evaluación obligatorio no está completado',
        then: 'el sistema bloquea el movimiento, el candidato vuelve a su posición original y aparece el tooltip "Completa el formulario de evaluación antes de avanzar a Oferta"' },
      { scenario: 'Edge Case',
        given: 'dos reclutadores ven el mismo pipeline y arrastran el mismo candidato a etapas distintas simultáneamente',
        when: 'las dos acciones llegan al servidor',
        then: 'se aplica la primera acción (FIFO), se actualiza la vista de ambos y el segundo recibe el aviso "El estado fue actualizado por [nombre]"' },
    ],
    notes: 'Requiere WebSocket para sincronización en tiempo real. Las etapas del pipeline deben ser configurables por cuenta. Infraestructura WS compartible con HU-09.',
    ambiguity: null,
  },
  {
    id: 'HU-01', epicId: 'EP-01', epicName: 'Gestión de Vacantes',
    title: 'Crear vacante desde plantilla',
    userStory: 'Como Reclutador, quiero crear una vacante a partir de una plantilla existente, para reducir el tiempo de configuración inicial.',
    persona: 'Reclutador', moscow: 'Must Have', points: 3, sprint: 1,
    criteria: [
      { scenario: 'Happy Path',
        given: 'el reclutador tiene al menos una plantilla guardada y está autenticado',
        when: 'selecciona "Nueva vacante desde plantilla" y elige una de la lista',
        then: 'el formulario se pre-rellena con todos los campos de la plantilla (título, descripción, requisitos); puede editarlos y guardar en estado Borrador' },
      { scenario: 'Error',
        given: 'el reclutador inicia la creación desde plantilla',
        when: 'la única plantilla disponible fue eliminada por otro usuario durante la misma sesión',
        then: 'el sistema muestra "Plantilla no disponible" con opción "Crear desde cero" sin errores no controlados' },
      { scenario: 'Edge Case',
        given: 'el reclutador selecciona una plantilla con más de 12 meses de antigüedad',
        when: 'acepta importar el contenido',
        then: 'el sistema muestra el aviso "Plantilla antigua (> 12 meses): te recomendamos revisarla con el asistente IA" y ofrece acceso directo al generador de JD' },
    ],
    notes: 'Requiere módulo de gestión de plantillas. Sin dependencias de IA ni integraciones externas. Buen candidato para comenzar el Sprint 1.',
    ambiguity: null,
  },
  {
    id: 'HU-13', epicId: 'EP-04', epicName: 'Comunicaciones y Automatización',
    title: 'Email de confirmación automático al candidato',
    userStory: 'Como Reclutador, quiero que el sistema envíe automáticamente un email de confirmación a cada candidato al aplicar, para mejorar su experiencia y dar transparencia al proceso desde el inicio.',
    persona: 'Reclutador', moscow: 'Must Have', points: 2, sprint: 1,
    criteria: [
      { scenario: 'Happy Path',
        given: 'un candidato completa y envía su aplicación para una vacante activa',
        when: 'el sistema recibe la aplicación',
        then: 'en < 2 min el candidato recibe email con nombre del puesto, empresa, número de referencia y próximos pasos del proceso' },
      { scenario: 'Error',
        given: 'el sistema intenta enviar el email de confirmación',
        when: 'el candidato proporcionó un email con typo que no existe',
        then: 'se registra el fallo de entrega, se marca la aplicación con "Email no entregado – verificar contacto" y se alerta al reclutador' },
      { scenario: 'Edge Case',
        given: 'un candidato aplica el mismo día a dos vacantes distintas de la misma empresa',
        when: 'ambas aplicaciones son procesadas',
        then: 'el candidato recibe dos emails claramente diferenciados por nombre de puesto, sin fusiones ni duplicados confusos' },
    ],
    notes: 'Historia de bajo riesgo y alta visibilidad. Primera pieza del módulo de comunicaciones. Requiere proveedor de email (SendGrid, SES) y plantillas configurables.',
    ambiguity: null,
  },

  // ── Sprint 2 ──
  {
    id: 'HU-06', epicId: 'EP-02', epicName: 'Gestión de Candidatos',
    title: 'Ranking automático de candidatos',
    userStory: 'Como Reclutador, quiero ver un ranking automático de candidatos por ajuste al perfil, para priorizar mis revisiones y enfocarme en los más prometedores.',
    persona: 'Reclutador', moscow: 'Must Have', points: 8, sprint: 2,
    criteria: [
      { scenario: 'Happy Path',
        given: 'una vacante tiene ≥ 20 candidatos con CVs procesados',
        when: 'el reclutador accede a la vista del pipeline',
        then: 'los candidatos aparecen ordenados por score (0–100) con los 3 factores principales explicativos, disponible en < 2 s' },
      { scenario: 'Error',
        given: 'el modelo de scoring no tiene datos suficientes para un rol muy nicho',
        when: 'se calcula el score de un candidato',
        then: 'se muestra el score con etiqueta "Confianza baja" e ícono informativo "Datos insuficientes; revisar manualmente"' },
      { scenario: 'Edge Case',
        given: 'un candidato tiene un perfil significativamente superior a todos los requisitos',
        when: 'el sistema calcula su score',
        then: 'se muestra la alerta "Perfil por encima del rango (posible sobrequalificación)" en lugar de un score alto engañoso' },
    ],
    notes: 'Depende de HU-05 (datos estructurados del CV). Modelo inicial basado en matching de keywords; versión ML mejorable iterativamente. Requiere pipeline de features.',
    ambiguity: null,
  },
  {
    id: 'HU-02', epicId: 'EP-01', epicName: 'Gestión de Vacantes',
    title: 'Generación de JD con IA',
    userStory: 'Como Reclutador, quiero que la IA genere una job description optimizada a partir de un brief básico, para ahorrar tiempo de redacción y obtener mayor calidad.',
    persona: 'Reclutador', moscow: 'Must Have', points: 5, sprint: 2,
    criteria: [
      { scenario: 'Happy Path',
        given: 'el reclutador tiene un brief con título, área y al menos 3 requisitos',
        when: 'hace clic en "Generar JD con IA" y confirma',
        then: 'en < 30 s se genera una JD con secciones estándar (rol, responsabilidades, requisitos, beneficios) lista para editar' },
      { scenario: 'Error',
        given: 'el reclutador solicita la generación de JD',
        when: 'el servicio de IA supera timeout de 30 s',
        then: 'se muestra "Servicio no disponible. Reintentar" conservando el brief sin pérdida de datos' },
      { scenario: 'Edge Case',
        given: 'el brief está en inglés y la cuenta está configurada en español',
        when: 'se solicita la generación de JD',
        then: 'la JD se genera en español con la nota "Brief en inglés detectado; JD generada según configuración de cuenta"' },
    ],
    notes: 'Requiere integración con LLM (OpenAI / Azure OpenAI). Puede ejecutarse en paralelo con HU-01. La infraestructura LLM es compartida con HU-21, HU-22 y HU-23.',
    ambiguity: null,
  },

  // ── Sprint 3 ──
  {
    id: 'HU-03', epicId: 'EP-01', epicName: 'Gestión de Vacantes',
    title: 'Publicación multicanal de vacantes',
    userStory: 'Como HR Manager, quiero publicar una vacante simultáneamente en LinkedIn, Indeed y mi web corporativa desde un único panel, para centralizar la gestión y reducir trabajo duplicado.',
    persona: 'HR Manager', moscow: 'Must Have', points: 8, sprint: 3,
    criteria: [
      { scenario: 'Happy Path',
        given: 'la vacante está en estado "Aprobada" y las credenciales de LinkedIn e Indeed están activas',
        when: 'el HR Manager selecciona los canales y hace clic en "Publicar"',
        then: 'la vacante se publica en todos los canales en < 60 s; el panel muestra estado (Publicado/Pendiente/Error) con fecha y hora por canal' },
      { scenario: 'Error',
        given: 'el HR Manager intenta publicar en LinkedIn',
        when: 'el token de integración ha expirado',
        then: 'se muestra "Credenciales expiradas" con botón "Reconectar"; la publicación continúa en canales válidos y se registra en el log de auditoría' },
      { scenario: 'Edge Case',
        given: '5 canales publicando y 2 permanecen en "Pendiente" más de 5 minutos',
        when: 'el sistema detecta la demora',
        then: 'reintenta automáticamente (máx. 3 intentos) y notifica al HR Manager si el fallo persiste tras los reintentos' },
    ],
    notes: 'Alta complejidad por integraciones OAuth de terceros (LinkedIn API, Indeed API). Para MVP se puede limitar a 2 canales + web propia. Requiere gestión de tokens OAuth segura.',
    ambiguity: '⚠ Pendiente de clarificación: ¿La integración con la web corporativa es API propia, XML feed o widget embebido? Impacta directamente la estimación.',
  },
  {
    id: 'HU-09', epicId: 'EP-03', epicName: 'Colaboración y Evaluación',
    title: 'Comentarios en tiempo real sobre candidatos',
    userStory: 'Como Hiring Manager, quiero dejar comentarios estructurados sobre un candidato en tiempo real, para que el reclutador los vea inmediatamente y se agilice la toma de decisiones conjunta.',
    persona: 'Hiring Manager', moscow: 'Must Have', points: 5, sprint: 3,
    criteria: [
      { scenario: 'Happy Path',
        given: 'el Hiring Manager está revisando el perfil de un candidato con acceso a la vacante',
        when: 'escribe un comentario y hace clic en "Enviar"',
        then: 'el comentario aparece en el perfil en < 1 s para todos los usuarios activos, con marca de tiempo e identificación del autor' },
      { scenario: 'Error',
        given: 'el Hiring Manager escribe un comentario extenso',
        when: 'pierde la conexión a internet antes de enviarlo',
        then: 'el sistema guarda el borrador localmente con aviso "Sin conexión: comentario guardado" y lo reenvía automáticamente al restaurarse la conexión' },
      { scenario: 'Edge Case',
        given: 'dos Hiring Managers envían comentarios sobre el mismo candidato en el mismo milisegundo',
        when: 'ambos mensajes llegan al servidor',
        then: 'los dos comentarios se guardan en orden cronológico sin conflicto; ambos autores los ven sin necesidad de refrescar la página' },
    ],
    notes: 'Reutiliza la infraestructura WebSocket de HU-07. Posible optimización de coste compartiendo el canal WS entre ambas historias.',
    ambiguity: null,
  },
  {
    id: 'HU-10', epicId: 'EP-03', epicName: 'Colaboración y Evaluación',
    title: 'Formularios de evaluación personalizados',
    userStory: 'Como Reclutador, quiero crear formularios de evaluación de entrevistas personalizados por rol, para estandarizar el feedback y facilitar la comparación objetiva entre candidatos.',
    persona: 'Reclutador', moscow: 'Must Have', points: 5, sprint: 3,
    criteria: [
      { scenario: 'Happy Path',
        given: 'el reclutador está configurando la vacante "Desarrollador Backend"',
        when: 'crea un formulario con 5 preguntas (escala 1–5 y texto libre) y lo vincula al rol',
        then: 'el formulario queda activo para la vacante y se pre-carga en cada entrevista programada listo para completar' },
      { scenario: 'Error',
        given: 'el reclutador intenta guardar un formulario de evaluación',
        when: 'no ha añadido ninguna pregunta',
        then: 'se muestra validación "El formulario debe contener al menos una pregunta" y no permite guardar' },
      { scenario: 'Edge Case',
        given: 'el reclutador modifica un formulario con 5 evaluaciones completadas de candidatos anteriores',
        when: 'intenta eliminar una pregunta existente',
        then: 'se advierte sobre el impacto en comparabilidad, se requiere confirmación explícita y la versión anterior queda archivada' },
    ],
    notes: 'Los tipos de campo del MVP (escala, texto libre, opción múltiple) deben acordarse con diseño antes del sprint. La versión archivada es necesaria para auditoría.',
    ambiguity: '⚠ Pendiente de clarificación: ¿Qué tipos de campo son necesarios en el MVP? ¿Solo escala + texto libre, o también opción múltiple y rating?',
  },

  // ── Sprint 4 ──
  {
    id: 'HU-14', epicId: 'EP-04', epicName: 'Comunicaciones y Automatización',
    title: 'Workflow builder no-code',
    userStory: 'Como Reclutador, quiero configurar flujos automáticos (trigger → condición → acción) sin escribir código, para automatizar tareas repetitivas sin depender del equipo técnico.',
    persona: 'Reclutador', moscow: 'Must Have', points: 13, sprint: 4,
    criteria: [
      { scenario: 'Happy Path',
        given: 'el reclutador accede al workflow builder con plantillas de email configuradas',
        when: 'configura trigger "Candidato avanza a Entrevista Técnica" → acción "Enviar email plantilla X" y lo activa',
        then: 'el workflow queda activo y la próxima vez que un candidato avance, el email se envía automáticamente en < 1 min sin intervención manual' },
      { scenario: 'Error',
        given: 'el reclutador diseña un workflow con un bucle circular (Acción A → Trigger B → Acción A)',
        when: 'intenta guardar y activar el workflow',
        then: 'el sistema detecta el bucle antes de guardar, lo describe explícitamente y no permite activar hasta corregirlo' },
      { scenario: 'Edge Case',
        given: 'existe un workflow activo que referencia una plantilla de email',
        when: 'otro usuario modifica esa plantilla',
        then: 'el propietario del workflow recibe notificación "Plantilla modificada en tu workflow" con enlace para previsualizar el impacto' },
    ],
    notes: 'Historia de mayor complejidad del módulo (13 pts). Candidata a dividirse en: motor de ejecución backend + UI del builder frontend. Depende de HU-13 para acciones de email.',
    ambiguity: '⚠ Pendiente de clarificación: ¿Cuántos triggers y acciones distintos debe soportar el MVP? Definir alcance antes del sprint para evitar scope creep.',
  },
  {
    id: 'HU-11', epicId: 'EP-03', epicName: 'Colaboración y Evaluación',
    title: 'Votación y consenso del equipo',
    userStory: 'Como equipo de selección, quiero votar sobre un candidato (avanzar/rechazar) con un sistema de consenso visible para todos, para tomar decisiones colaborativas y documentadas.',
    persona: 'Equipo', moscow: 'Must Have', points: 5, sprint: 4,
    criteria: [
      { scenario: 'Happy Path',
        given: 'todos los evaluadores asignados han completado su entrevista y tienen acceso a votar',
        when: 'cada evaluador emite su voto (Avanzar / Rechazar / Pendiente)',
        then: 'el sistema muestra el resultado agregado en tiempo real y notifica al reclutador al alcanzar el criterio de consenso configurado, registrando cada voto con timestamp' },
      { scenario: 'Error',
        given: 'un usuario intenta votar sobre un candidato',
        when: 'no tiene el rol "Evaluador" asignado para esa vacante',
        then: 'se muestra "No tienes permisos para votar en esta vacante" y no se registra ningún voto' },
      { scenario: 'Edge Case',
        given: 'la votación tiene 2 Avanzar y 1 Rechazar con criterio de unanimidad configurado',
        when: 'el sistema detecta el desacuerdo',
        then: 'se crea automáticamente una tarea "Resolver desacuerdo de votación" asignada al reclutador con notificación al equipo de calibración requerida' },
    ],
    notes: 'Las reglas de consenso (mayoría, unanimidad, configurable) deben estar acordadas antes del sprint. Requiere RBAC para roles de evaluador.',
    ambiguity: '⚠ Pendiente de clarificación: ¿La configuración de reglas de consenso es por vacante o por cuenta? Impacta el diseño de la BD.',
  },

  // ── Sprint 5 ──
  {
    id: 'HU-15', epicId: 'EP-04', epicName: 'Comunicaciones y Automatización',
    title: 'Coordinación de entrevistas con IA',
    userStory: 'Como Reclutador, quiero que la IA sugiera disponibilidad óptima para entrevistas cruzando los calendarios del equipo, para reducir el tiempo de coordinación de agenda.',
    persona: 'Reclutador', moscow: 'Must Have', points: 8, sprint: 5,
    criteria: [
      { scenario: 'Happy Path',
        given: 'los calendarios de Google/Outlook del reclutador y 2 entrevistadores están integrados y actualizados',
        when: 'el reclutador solicita sugerencias para una entrevista de 60 min',
        then: 'el sistema propone 3 franjas disponibles para todos en los próximos 5 días laborables con los nombres de los disponibles por franja' },
      { scenario: 'Error',
        given: 'el reclutador solicita sugerencias de horario',
        when: 'uno de los entrevistadores no ha conectado su calendario',
        then: 'el sistema muestra opciones para los calendarios conectados, indica quién falta y permite proceder o solicitar la conexión pendiente' },
      { scenario: 'Edge Case',
        given: 'todos los participantes tienen calendarios completamente llenos los próximos 5 días',
        when: 'el sistema busca disponibilidad',
        then: 'amplía automáticamente la búsqueda a 10 días, informa el motivo y ofrece enviar al candidato un enlace de self-scheduling' },
    ],
    notes: 'Requiere integración OAuth con Google Calendar y Microsoft Outlook. Compleja coordinación de tokens y scopes de permisos. Self-scheduling puede diferirse a Sprint 6.',
    ambiguity: null,
  },
  {
    id: 'HU-17', epicId: 'EP-05', epicName: 'Analítica e Inteligencia',
    title: 'Dashboard de métricas en tiempo real',
    userStory: 'Como HR Manager, quiero un dashboard con métricas clave (time-to-hire, conversion rates, source quality) en tiempo real, para monitorizar el rendimiento y detectar cuellos de botella.',
    persona: 'HR Manager', moscow: 'Must Have', points: 8, sprint: 5,
    criteria: [
      { scenario: 'Happy Path',
        given: 'el HR Manager accede al módulo de analítica con ≥ 30 días de actividad',
        when: 'la página del dashboard carga',
        then: 'en < 2 s se muestran time-to-hire promedio, tasa de conversión por etapa y top 3 fuentes, actualizados con datos de las últimas 24 h' },
      { scenario: 'Error',
        given: 'el dashboard intenta cargar datos en tiempo real',
        when: 'el servicio de analítica tiene más de 1 hora de retraso',
        then: 'se muestran los últimos datos disponibles con el indicador "Última actualización: hace X horas" y un banner "Datos en procesamiento"' },
      { scenario: 'Edge Case',
        given: 'el HR Manager accede el primer día tras activar la cuenta sin datos históricos',
        when: 'la página carga',
        then: 'se muestran indicadores vacíos con mensaje guía "Publica tu primera vacante para ver métricas", sin valores NaN ni errores' },
    ],
    notes: 'Requiere capa de analítica o agregaciones en BD principal. KPIs exactos del MVP deben definirse antes del sprint. Carga target < 2 s (PRD §6.1).',
    ambiguity: null,
  },
  {
    id: 'HU-04', epicId: 'EP-01', epicName: 'Gestión de Vacantes',
    title: 'Aprobación de vacantes sin email',
    userStory: 'Como Hiring Manager, quiero aprobar o rechazar vacantes propuestas desde mi panel sin necesidad de email, para agilizar el proceso y mantener trazabilidad de decisiones.',
    persona: 'Hiring Manager', moscow: 'Should Have', points: 3, sprint: 5,
    criteria: [
      { scenario: 'Happy Path',
        given: 'el Hiring Manager tiene vacantes pendientes de aprobación en su panel',
        when: 'hace clic en "Aprobar" con comentario opcional',
        then: 'la vacante cambia a "Aprobada", el reclutador recibe notificación in-app y la acción queda registrada con timestamp y comentario' },
      { scenario: 'Error',
        given: 'el Hiring Manager intenta aprobar una vacante',
        when: 'su sesión ha expirado durante la navegación',
        then: 'el sistema solicita reautenticación y redirige al panel de aprobaciones con la vacante pendiente visible, sin pérdida de contexto' },
      { scenario: 'Edge Case',
        given: 'dos Hiring Managers con permisos intentan aprobar la misma vacante simultáneamente',
        when: 'ambas acciones llegan al servidor',
        then: 'se procesa la primera (FIFO) y el segundo recibe "Esta vacante ya fue aprobada por [nombre] a las [hora]"' },
    ],
    notes: 'Depende del sistema de notificaciones in-app (HU-13 base). Requiere RBAC para permisos de aprobación configurables por cuenta.',
    ambiguity: '⚠ Pendiente de clarificación: ¿Se necesita flujo de aprobación multinivel (ej. HM → Director) en el MVP, o es suficiente un solo nivel?',
  },

  // ── Sprint 6 ──
  {
    id: 'HU-08', epicId: 'EP-02', epicName: 'Gestión de Candidatos',
    title: 'Búsqueda semántica en talent pool',
    userStory: 'Como Reclutador, quiero buscar candidatos en mi talent pool histórico mediante búsqueda semántica, para reutilizar talento previo y reducir el coste de sourcing.',
    persona: 'Reclutador', moscow: 'Must Have', points: 8, sprint: 6,
    criteria: [
      { scenario: 'Happy Path',
        given: 'el talent pool tiene ≥ 50 candidatos históricos con CVs procesados',
        when: 'el reclutador escribe "senior backend engineer con experiencia en microservicios y Kubernetes"',
        then: 'en < 3 s devuelve candidatos ordenados por relevancia semántica, incluso si usan terminología distinta (ej. "arquitecto de servicios distribuidos")' },
      { scenario: 'Error',
        given: 'el reclutador realiza una búsqueda semántica',
        when: 'la consulta contiene solo stop words o caracteres especiales sin significado',
        then: 'se muestra "Introduce términos más específicos" con ejemplos de consultas efectivas y no se ejecuta la query' },
      { scenario: 'Edge Case',
        given: 'la búsqueda devuelve menos de 3 candidatos',
        when: 'el reclutador ve los escasos resultados',
        then: 'el sistema muestra los resultados disponibles y ofrece "Ampliar búsqueda incluyendo candidatos de otras vacantes"' },
    ],
    notes: 'Requiere embeddings vectoriales (ej. OpenAI Embeddings, Cohere) y base de datos vectorial (ej. pgvector, Pinecone). Alta complejidad técnica. Depende de HU-05.',
    ambiguity: null,
  },
  {
    id: 'HU-18', epicId: 'EP-05', epicName: 'Analítica e Inteligencia',
    title: 'Análisis de fuentes con ROI estimado',
    userStory: 'Como Reclutador, quiero ver qué fuentes de candidatos generan más contrataciones exitosas con su ROI estimado, para optimizar el presupuesto de atracción.',
    persona: 'Reclutador', moscow: 'Must Have', points: 5, sprint: 6,
    criteria: [
      { scenario: 'Happy Path',
        given: 'el reclutador tiene ≥ 3 meses de datos con candidatos de múltiples fuentes',
        when: 'accede al módulo de análisis de fuentes',
        then: 've ranking de fuentes por tasa de conversión a contratación con coste estimado por hire y filtros por periodo y vacante' },
      { scenario: 'Error',
        given: 'el reclutador accede al análisis',
        when: 'más del 30% de candidaturas no tienen fuente registrada',
        then: 'se muestran los datos disponibles con aviso "30% sin fuente registrada: análisis puede estar sesgado" y enlace a la guía de configuración de UTMs' },
      { scenario: 'Edge Case',
        given: 'el reclutador compara dos fuentes y una tiene solo 2 candidaturas en el periodo',
        when: 'se calcula el ROI',
        then: 'se muestra el dato con la advertencia "Muestra estadísticamente insuficiente (n=2): resultado no representativo" y sugerencia de ampliar el rango' },
    ],
    notes: 'Depende del tracking de fuentes en HU-03 (publicación multicanal). La definición de "coste por hire" debe acordarse antes del sprint.',
    ambiguity: '⚠ Pendiente de clarificación: ¿El coste por fuente se introduce manualmente por el reclutador o se calcula automáticamente desde integraciones publicitarias (LinkedIn Ads, etc.)?',
  },
  {
    id: 'HU-19', epicId: 'EP-05', epicName: 'Analítica e Inteligencia',
    title: 'Reportes exportables PDF/Excel',
    userStory: 'Como HR Manager, quiero generar reportes exportables en PDF y Excel con los datos del proceso, para presentar resultados a dirección sin trabajo manual adicional.',
    persona: 'HR Manager', moscow: 'Must Have', points: 5, sprint: 6,
    criteria: [
      { scenario: 'Happy Path',
        given: 'el HR Manager está en el módulo de reporting con filtros configurados',
        when: 'selecciona "Exportar → PDF" y confirma',
        then: 'en < 30 s se descarga el archivo LTI_Report_[YYYY-MM-DD].pdf con portada, métricas filtradas y formato ejecutivo' },
      { scenario: 'Error',
        given: 'el HR Manager solicita un reporte con rango de 24 meses',
        when: 'el volumen supera el límite de procesamiento síncrono',
        then: 'se informa "El reporte es muy extenso; te lo enviaremos por email en 5–10 min" y se ofrece reducir el rango para generación inmediata' },
      { scenario: 'Edge Case',
        given: 'se genera un reporte Excel con nombres de candidatos en árabe, chino o cirílico',
        when: 'el archivo es descargado y abierto en Excel',
        then: 'el archivo preserva correctamente la codificación unicode de todos los caracteres sin corrupción' },
    ],
    notes: 'Requiere librería de generación PDF (ej. Puppeteer, WeasyPrint) y Excel (ej. xlsx). Reportes grandes deben procesarse de forma asíncrona con notificación por email.',
    ambiguity: null,
  },

  // ── Sprint 7 ──
  {
    id: 'HU-12', epicId: 'EP-03', epicName: 'Colaboración y Evaluación',
    title: 'Alertas de inactividad de hiring managers',
    userStory: 'Como Reclutador, quiero recibir alertas cuando un hiring manager no ha dado feedback en más de 48 horas, para actuar proactivamente y evitar la pérdida de candidatos por inacción.',
    persona: 'Reclutador', moscow: 'Should Have', points: 3, sprint: 7,
    criteria: [
      { scenario: 'Happy Path',
        given: 'un candidato lleva exactamente 48 h esperando feedback de un HM y el SLA está configurado a 48 h',
        when: 'el sistema ejecuta la verificación periódica de SLAs',
        then: 'el reclutador recibe notificación in-app y email con nombre del candidato, vacante, HM pendiente y enlace directo al perfil' },
      { scenario: 'Error',
        given: 'el sistema intenta enviar la alerta de inactividad',
        when: 'el email del reclutador está rebotando (hard bounce)',
        then: 'se escala la notificación al HR Manager supervisor por canal in-app y se marca el canal email del reclutador como "Requiere atención"' },
      { scenario: 'Edge Case',
        given: 'el SLA de 48 h cae completamente dentro de un fin de semana (viernes 18h a lunes 9h)',
        when: 'el sistema calcula el cumplimiento del SLA',
        then: 'el conteo se pausa fuera del horario laboral configurado (L–V 9–18 h) y se reanuda el lunes, sin disparar falsas alertas en fin de semana' },
    ],
    notes: 'El SLA (48 h) debe ser configurable por cuenta. Requiere calendario laboral configurable. Depende de la infraestructura de notificaciones de HU-13.',
    ambiguity: null,
  },
  {
    id: 'HU-16', epicId: 'EP-04', epicName: 'Comunicaciones y Automatización',
    title: 'Actualizaciones de estado al candidato',
    userStory: 'Como Candidato, quiero recibir actualizaciones del estado de mi candidatura por email o SMS, para sentir que el proceso es transparente y no tener que perseguir al reclutador.',
    persona: 'Candidato', moscow: 'Should Have', points: 5, sprint: 7,
    criteria: [
      { scenario: 'Happy Path',
        given: 'el candidato tiene una aplicación activa y eligió notificaciones por email al aplicar',
        when: 'el reclutador mueve la candidatura a la siguiente etapa',
        then: 'en < 5 min el candidato recibe email con nombre de la nueva etapa, puesto y próximos pasos si están configurados' },
      { scenario: 'Error',
        given: 'el candidato eligió notificaciones por SMS',
        when: 'el número es de un país sin cobertura del proveedor SMS',
        then: 'el sistema hace fallback automático a email, notifica al reclutador del incidente y registra el intento fallido' },
      { scenario: 'Edge Case',
        given: 'el candidato recibe notificación de rechazo con enlace a su portal',
        when: 'intenta acceder 45 días después del rechazo',
        then: 'el enlace ha expirado (30 días por GDPR) y se muestra mensaje de expiración con contacto GDPR de la empresa, no un error 404' },
    ],
    notes: 'Depende de HU-13 (infraestructura de email). SMS requiere proveedor adicional (Twilio/Vonage). Los enlaces de portal deben respetar el periodo de retención GDPR.',
    ambiguity: null,
  },
  {
    id: 'HU-20', epicId: 'EP-05', epicName: 'Analítica e Inteligencia',
    title: 'Alertas de candidato en riesgo de abandono',
    userStory: 'Como HR Manager, quiero recibir alertas proactivas cuando hay riesgo de pérdida de un candidato top por tiempo de respuesta elevado, para actuar antes de que acepte otra oferta.',
    persona: 'HR Manager', moscow: 'Should Have', points: 5, sprint: 7,
    criteria: [
      { scenario: 'Happy Path',
        given: 'un candidato con score ≥ 80 lleva más de 72 h sin movimiento en el pipeline',
        when: 'el sistema ejecuta el análisis periódico de riesgo de abandono',
        then: 'el HR Manager recibe notificación in-app con nombre, vacante, días sin movimiento, reclutador responsable y enlace directo al perfil' },
      { scenario: 'Error',
        given: 'el sistema calcula el riesgo de un candidato de alto score',
        when: 'el perfil no tiene datos de contacto completos',
        then: 'la alerta se genera igualmente con nota adicional "Perfil de contacto incompleto: verifica teléfono y email antes de actuar"' },
      { scenario: 'Edge Case',
        given: 'el mismo candidato activa el criterio de riesgo en 3 vacantes simultáneamente',
        when: 'el sistema genera las alertas',
        then: 'se agrupa en una sola notificación "Candidato en riesgo en 3 vacantes" en lugar de 3 notificaciones separadas, evitando ruido' },
    ],
    notes: 'Depende de HU-06 (scoring). Los umbrales (score ≥ 80, tiempo ≥ 72 h) deben ser configurables por cuenta. La agrupación de notificaciones es crítica para evitar alert fatigue.',
    ambiguity: null,
  },
  {
    id: 'HU-21', epicId: 'EP-06', epicName: 'IA y Asistencia Inteligente',
    title: 'Resumen de entrevista por IA',
    userStory: 'Como Reclutador, quiero que la IA resuma las notas de una entrevista en un párrafo ejecutivo, para ahorrar tiempo de documentación y compartir resúmenes consistentes con el equipo.',
    persona: 'Reclutador', moscow: 'Should Have', points: 3, sprint: 7,
    criteria: [
      { scenario: 'Happy Path',
        given: 'el reclutador tiene notas de entrevista de ≥ 100 palabras en el campo de notas del candidato',
        when: 'hace clic en "Generar resumen con IA"',
        then: 'en < 15 s la IA genera un párrafo ejecutivo de 3–5 oraciones con puntos fuertes, áreas de mejora y recomendación del entrevistador, listo para editar y compartir' },
      { scenario: 'Error',
        given: 'el reclutador intenta generar el resumen',
        when: 'las notas están en un idioma que el modelo no procesa con fiabilidad',
        then: 'el sistema muestra "Generando en inglés" e incluye la limitación detectada en el output' },
      { scenario: 'Edge Case',
        given: 'la IA genera un resumen que el entrevistador edita manualmente',
        when: 'guarda la versión modificada',
        then: 'el sistema guarda la versión editada con tag "Editado por [nombre]" y mantiene la versión original de la IA accesible' },
    ],
    notes: 'Baja complejidad incremental si la integración LLM de HU-02 ya está implementada. Reutiliza la misma infraestructura.',
    ambiguity: null,
  },
  {
    id: 'HU-23', epicId: 'EP-06', epicName: 'IA y Asistencia Inteligente',
    title: 'Detector de sesgo en job descriptions',
    userStory: 'Como Reclutador, quiero que la IA detecte posibles sesgos en el lenguaje de una job description y sugiera alternativas inclusivas, para atraer mayor diversidad de candidatos.',
    persona: 'Reclutador', moscow: 'Should Have', points: 5, sprint: 7,
    criteria: [
      { scenario: 'Happy Path',
        given: 'el reclutador tiene una JD con términos como "rockstar", "joven dinámico" y "nativo digital"',
        when: 'ejecuta el análisis de sesgo',
        then: 'el sistema resalta los términos problemáticos, explica el tipo de sesgo de cada uno (edad/género) y ofrece alternativas inclusivas editables inline sin salir de la vista' },
      { scenario: 'Error',
        given: 'el reclutador ejecuta el análisis sobre una JD',
        when: 'la descripción tiene menos de 50 palabras',
        then: 'se muestra "Añade más contenido para un análisis preciso (mínimo 50 palabras)" sin emitir falsos positivos sobre texto insuficiente' },
      { scenario: 'Edge Case',
        given: 'el reclutador acepta todas las sugerencias y la JD queda modificada',
        when: 're-ejecuta el análisis',
        then: 'el sistema confirma "Sin sesgos detectados" y ofrece vista diff para comparar el antes y el después antes de publicar' },
    ],
    notes: 'Usable sobre JDs existentes, independiente de HU-02. Requiere corpus documentado de términos sesgados (base de datos propia o lista curada). Puede integrarse en el flujo de revisión de HU-02.',
    ambiguity: null,
  },

  // ── Sprint 8 ──
  {
    id: 'HU-22', epicId: 'EP-06', epicName: 'IA y Asistencia Inteligente',
    title: 'Sugerencias de preguntas de entrevista',
    userStory: 'Como Reclutador, quiero recibir sugerencias de preguntas de entrevista basadas en las brechas del perfil del candidato, para mejorar la calidad y relevancia de la entrevista.',
    persona: 'Reclutador', moscow: 'Could Have', points: 5, sprint: 8,
    criteria: [
      { scenario: 'Happy Path',
        given: 'el reclutador prepara la entrevista con perfil del candidato y requisitos de vacante disponibles',
        when: 'solicita "Sugerencias de preguntas IA"',
        then: 'la IA genera 5–8 preguntas focalizadas en las brechas detectadas, clasificadas por tipo (técnica/comportamental/situacional) y listas para usar o editar' },
      { scenario: 'Error',
        given: 'el reclutador solicita sugerencias de preguntas',
        when: 'el perfil del candidato está incompleto (solo nombre, sin CV ni experiencia)',
        then: 'el sistema muestra "Perfil insuficiente para preguntas personalizadas" y ofrece 5 preguntas genéricas del rol como alternativa' },
      { scenario: 'Edge Case',
        given: 'el candidato tiene un perfil que cubre todos los requisitos sin brechas detectables',
        when: 'el reclutador solicita sugerencias',
        then: 'la IA genera preguntas de profundización y fit cultural con la nota "Perfil completo: preguntas orientadas a evaluar excelencia y alineación cultural"' },
    ],
    notes: 'Depende de HU-05 (datos del CV) y HU-06 (análisis de brechas). Reutiliza integración LLM de HU-02 y HU-21. Baja complejidad incremental si las dependencias ya están en producción.',
    ambiguity: null,
  },
  {
    id: 'HU-24', epicId: 'EP-06', epicName: 'IA y Asistencia Inteligente',
    title: 'Chat conversacional con datos del pipeline',
    userStory: 'Como HR Manager, quiero un asistente conversacional para consultar datos del pipeline en lenguaje natural, para obtener insights del proceso sin necesidad de generar reportes manualmente.',
    persona: 'HR Manager', moscow: 'Could Have', points: 13, sprint: 8,
    criteria: [
      { scenario: 'Happy Path',
        given: 'el HR Manager accede al chat conversacional con datos de pipeline disponibles',
        when: 'pregunta "¿Cuántos candidatos tenemos en etapa final para las vacantes de ingeniería este mes?"',
        then: 'el asistente responde con el número exacto, las vacantes afectadas y ofrece desgloses por reclutador o semana, en lenguaje natural en < 5 s' },
      { scenario: 'Error',
        given: 'el HR Manager consulta al asistente',
        when: 'pregunta por datos fuera del sistema ("¿Cuál es la tasa de rotación de empleados?")',
        then: 'el asistente responde "Esa información no está en LTI ATS" y sugiere 3 preguntas relacionadas que sí puede responder' },
      { scenario: 'Edge Case',
        given: 'el HR Manager consulta datos personales de un candidato específico',
        when: 'su rol no tiene acceso a esa vacante por restricciones RBAC',
        then: 'el asistente responde "No tienes permisos para ver los detalles de ese candidato" sin exponer ningún dato ni confirmar si el candidato existe' },
    ],
    notes: 'Alta complejidad (13 pts). Requiere NLU (LLM con RAG sobre datos del pipeline), respeto estricto de RBAC multi-tenant y aislamiento de datos. Candidata a dividirse antes del sprint.',
    ambiguity: '⚠ Pendiente de clarificación: ¿Qué datos del pipeline puede consultar el chat y qué consultas SQL/API respaldan cada intención reconocida? Requiere definición exhaustiva antes del desarrollo.',
  },
];

const RISKS: Risk[] = [
  { id: 'R-01', risk: 'Parser de CV con precisión < 90% en campos clave', impact: 'Alto',
    mitigation: 'Revisión humana como fallback. Mejora continua con datos etiquetados. Umbral de confianza visible en la UI. Load testing con corpus diverso antes del MVP.',
    relatedHU: 'HU-05' },
  { id: 'R-02', risk: 'Adopción baja del módulo de IA por parte de reclutadores', impact: 'Alto',
    mitigation: 'Onboarding guiado con casos de uso demostrados. Gamificación de la adopción. Métricas de uso en dashboard para detectar historias con bajo engagement.',
    relatedHU: 'HU-02, HU-06, HU-21, HU-23' },
  { id: 'R-03', risk: 'Incumplimiento GDPR por gestión inadecuada de datos de candidatos', impact: 'Crítico',
    mitigation: 'Auditoría legal previa al lanzamiento. DPO externo. Expiración de enlaces de portal (HU-16, 30 días). Retención y borrado automático de datos. Revisión de HU-24 (chat) especialmente crítica.',
    relatedHU: 'HU-05, HU-16, HU-24' },
  { id: 'R-04', risk: 'HU-14 (workflow builder) subestimada: 13 pts puede requerir 21+', impact: 'Alto',
    mitigation: 'Dividir en sub-historias: (1) motor de ejecución backend + (2) UI del builder frontend. Acordar el catálogo de triggers y acciones del MVP antes del Sprint 4 para evitar scope creep.',
    relatedHU: 'HU-14' },
  { id: 'R-05', risk: 'Cambios en APIs de terceros (LinkedIn, Google Calendar) durante el desarrollo', impact: 'Medio',
    mitigation: 'Capa de abstracción (adapter pattern) para cada integración. Versionado de contratos. Plan de contingencia documentado. Monitorización de changelogs de APIs externas.',
    relatedHU: 'HU-03, HU-15' },
  { id: 'R-06', risk: 'Escalabilidad del sistema de tiempo real con muchos usuarios concurrentes (> 500)', impact: 'Medio',
    mitigation: 'Arquitectura WebSocket escalable con Redis Pub/Sub. Load testing desde Sprint 1. Auto-scaling configurado en cloud. Objetivo: 500+ usuarios concurrentes (PRD §6.1).',
    relatedHU: 'HU-07, HU-09, HU-11' },
  { id: 'R-07', risk: 'HU-24 (chat) puede filtrar datos entre tenants sin RBAC estricto', impact: 'Crítico',
    mitigation: 'Revisión de arquitectura de seguridad antes del desarrollo. Pruebas de penetración específicas de aislamiento multi-tenant. Considerar diferir si el riesgo no se mitiga completamente antes del Sprint 8.',
    relatedHU: 'HU-24' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function moscowTone(m: MoSCoW): 'success' | 'info' | 'warning' {
  if (m === 'Must Have') return 'success';
  if (m === 'Should Have') return 'info';
  return 'warning';
}

function rowTone(m: MoSCoW): 'success' | 'info' | 'warning' | undefined {
  if (m === 'Must Have') return undefined;
  if (m === 'Should Have') return 'info';
  return 'warning';
}

function impactTone(impact: string): 'danger' | 'warning' | 'neutral' {
  if (impact === 'Crítico') return 'danger';
  if (impact === 'Alto') return 'warning';
  return 'neutral';
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MoSCoWBadge({ moscow }: { moscow: MoSCoW }) {
  return <Pill tone={moscowTone(moscow)} active size="sm">{moscow}</Pill>;
}

function ScenarioBlock({ c }: { c: Scenario }) {
  const theme = useHostTheme();
  return (
    <Stack gap={4} style={{ borderLeft: `2px solid ${theme.stroke.secondary}`, paddingLeft: 10 }}>
      <Text size="small" weight="semibold">{c.scenario}</Text>
      <Text size="small" tone="secondary">
        <Text as="span" size="small" weight="medium">Dado </Text>{c.given}
      </Text>
      <Text size="small" tone="secondary">
        <Text as="span" size="small" weight="medium">Cuando </Text>{c.when}
      </Text>
      <Text size="small" tone="secondary">
        <Text as="span" size="small" weight="medium">Entonces </Text>{c.then}
      </Text>
    </Stack>
  );
}

function StoryDetail({ story }: { story: Story }) {
  return (
    <Card collapsible defaultOpen={false}>
      <CardHeader trailing={
        <Row gap={4}>
          <MoSCoWBadge moscow={story.moscow} />
          <Pill size="sm">{story.points} pts</Pill>
          <Pill size="sm" tone="neutral">S{story.sprint}</Pill>
        </Row>
      }>
        {story.id} · {story.title}
      </CardHeader>
      <CardBody>
        <Stack gap={14}>
          <Text tone="secondary" size="small" style={{ fontStyle: 'italic' }}>{story.userStory}</Text>
          <Row gap={6} wrap>
            <Pill size="sm">{story.epicName}</Pill>
            <Pill size="sm">{story.persona}</Pill>
          </Row>
          <Divider />
          <H3>Criterios de aceptación</H3>
          <Stack gap={12}>
            {story.criteria.map(c => <ScenarioBlock key={c.scenario} c={c} />)}
          </Stack>
          <Divider />
          <Stack gap={6}>
            <Text size="small" weight="semibold">Notas técnicas y dependencias</Text>
            <Text size="small" tone="secondary">{story.notes}</Text>
          </Stack>
          {story.ambiguity && (
            <Callout tone="warning" title="Ambiguedad detectada">
              {story.ambiguity}
            </Callout>
          )}
        </Stack>
      </CardBody>
    </Card>
  );
}

// ─── Tabs ────────────────────────────────────────────────────────────────────

function ResumenTab() {
  const theme = useHostTheme();
  const totalPoints = STORIES.reduce((s, x) => s + x.points, 0);
  const mustHave = STORIES.filter(s => s.moscow === 'Must Have');
  const shouldHave = STORIES.filter(s => s.moscow === 'Should Have');
  const couldHave = STORIES.filter(s => s.moscow === 'Could Have');
  const ambiguous = STORIES.filter(s => s.ambiguity !== null);

  return (
    <Stack gap={20}>
      <Grid columns={4} gap={12}>
        <Stat value={String(STORIES.length)} label="Historias totales" />
        <Stat value={String(totalPoints)} label="Story points" />
        <Stat value="8" label="Sprints planificados" />
        <Stat value={String(ambiguous.length)} label="Pendientes de aclarar" tone="warning" />
      </Grid>

      <Grid columns={3} gap={12}>
        <Stat value={`${mustHave.length} HU`} label={`Must Have · ${mustHave.reduce((s,x)=>s+x.points,0)} pts`} tone="success" />
        <Stat value={`${shouldHave.length} HU`} label={`Should Have · ${shouldHave.reduce((s,x)=>s+x.points,0)} pts`} />
        <Stat value={`${couldHave.length} HU`} label={`Could Have · ${couldHave.reduce((s,x)=>s+x.points,0)} pts`} />
      </Grid>

      <Divider />

      <H2>Resumen ejecutivo</H2>
      <Text>
        LTI ATS cuenta con <Text as="span" weight="semibold">24 historias de usuario</Text> distribuidas en <Text as="span" weight="semibold">6 épicas funcionales</Text>, con un total de <Text as="span" weight="semibold">139 story points</Text> planificados en <Text as="span" weight="semibold">8 sprints</Text>. El MVP (sprints 1–6) cubre los <Text as="span" weight="semibold">16 Must Have</Text> con 97 puntos, incluyendo los módulos de vacantes, candidatos, pipeline Kanban, colaboración en tiempo real, comunicaciones y analítica básica. Los <Text as="span" weight="semibold">6 Should Have</Text> (sprints 5–7) consolidan la experiencia del usuario y capacidades IA secundarias como alertas proactivas y detector de sesgo. Los <Text as="span" weight="semibold">2 Could Have</Text> (sprint 8) aportan diferenciación competitiva de alto valor para la Fase 3 del roadmap.
      </Text>
      <Text>
        Se identifican <Text as="span" weight="semibold">{ambiguous.length} historias con ambigüedades</Text> pendientes de clarificación (HU-03, HU-04, HU-10, HU-11, HU-14, HU-18, HU-24) y <Text as="span" weight="semibold">7 riesgos</Text> que requieren seguimiento activo, siendo los más críticos el cumplimiento GDPR y el aislamiento multi-tenant del chat conversacional.
      </Text>

      <Divider />

      <H2>Distribución por sprint</H2>
      <Table
        headers={['Sprint', 'Historias', 'Story Points', 'Fase del Roadmap', 'Enfoque']}
        striped
        rows={[
          ['Sprint 1', 'HU-05, HU-07, HU-01, HU-13', '18 pts', 'Fase 1 — MVP', 'Core: parser CV, pipeline, plantillas, email'],
          ['Sprint 2', 'HU-06, HU-02', '13 pts', 'Fase 1 — MVP', 'IA base: scoring y generación de JD'],
          ['Sprint 3', 'HU-03, HU-09, HU-10', '18 pts', 'Fase 1 — MVP', 'Publicación y colaboración en tiempo real'],
          ['Sprint 4', 'HU-14, HU-11', '18 pts', 'Fase 1 — MVP', 'Automatización y votación colaborativa'],
          ['Sprint 5', 'HU-15, HU-17, HU-04', '19 pts', 'Fase 2 — Growth', 'Calendario IA, dashboard, aprobaciones'],
          ['Sprint 6', 'HU-08, HU-18, HU-19', '18 pts', 'Fase 2 — Growth', 'Búsqueda semántica, ROI fuentes, reportes'],
          ['Sprint 7', 'HU-12, HU-16, HU-20, HU-21, HU-23', '21 pts', 'Fase 2 — Growth', 'Should Haves: alertas, comunicaciones, IA avanzada'],
          ['Sprint 8', 'HU-22, HU-24', '18 pts', 'Fase 3 — Scale', 'Could Haves: preguntas IA y chat conversacional'],
        ]}
        columnAlign={['left', 'left', 'right', 'left', 'left']}
      />
    </Stack>
  );
}

function EpicasTab() {
  const theme = useHostTheme();
  return (
    <Stack gap={20}>
      <H2>Mapa de épicas</H2>
      <Text tone="secondary">6 épicas funcionales cubren el scope completo del producto. Cada épica agrupa historias de valor cohesivo y entregable.</Text>
      <Grid columns={2} gap={14}>
        {EPICS.map(epic => {
          const stories = STORIES.filter(s => s.epicId === epic.id);
          const totalPts = stories.reduce((s, x) => s + x.points, 0);
          const mustCount = stories.filter(s => s.moscow === 'Must Have').length;
          return (
            <Card key={epic.id}>
              <CardHeader trailing={<Pill size="sm">{totalPts} pts</Pill>}>
                {epic.id} · {epic.name}
              </CardHeader>
              <CardBody>
                <Stack gap={10}>
                  <Text size="small" tone="secondary">{epic.description}</Text>
                  <Row gap={6} wrap>
                    {stories.map(s => (
                      <Pill key={s.id} size="sm" tone={moscowTone(s.moscow)}>{s.id}</Pill>
                    ))}
                  </Row>
                  <Row gap={8}>
                    <Text size="small" tone="secondary">{stories.length} historias</Text>
                    <Text size="small" tone="secondary">·</Text>
                    <Text size="small" tone="secondary">{mustCount} Must Have</Text>
                    <Text size="small" tone="secondary">·</Text>
                    <Text size="small" tone="secondary">{stories.length - mustCount} Should/Could</Text>
                  </Row>
                </Stack>
              </CardBody>
            </Card>
          );
        })}
      </Grid>

      <Divider />
      <H2>Leyenda MoSCoW</H2>
      <Row gap={8}>
        <Pill tone="success" active size="sm">Must Have</Pill>
        <Text size="small" tone="secondary">Crítico para el MVP — bloqueante si no está</Text>
      </Row>
      <Row gap={8}>
        <Pill tone="info" active size="sm">Should Have</Pill>
        <Text size="small" tone="secondary">Importante pero no bloqueante — Fase Growth</Text>
      </Row>
      <Row gap={8}>
        <Pill tone="warning" active size="sm">Could Have</Pill>
        <Text size="small" tone="secondary">Deseable si hay capacidad — Fase Scale</Text>
      </Row>
    </Stack>
  );
}

function BacklogTab() {
  const [filterMoscow, setFilterMoscow] = useCanvasState<string>('filterMoscow', 'Todos');
  const [filterEpic, setFilterEpic] = useCanvasState<string>('filterEpic', 'Todas');

  const moscowOptions = ['Todos', 'Must Have', 'Should Have', 'Could Have'];
  const epicOptions = ['Todas', ...EPICS.map(e => e.name)];

  const filtered = STORIES.filter(s => {
    const mMatch = filterMoscow === 'Todos' || s.moscow === filterMoscow;
    const eMatch = filterEpic === 'Todas' || s.epicName === filterEpic;
    return mMatch && eMatch;
  });

  const tones = filtered.map(s => rowTone(s.moscow));

  return (
    <Stack gap={16}>
      <H2>Backlog priorizado</H2>
      <Stack gap={8}>
        <Row gap={8} wrap>
          <Text size="small" tone="secondary" weight="medium">MoSCoW:</Text>
          {moscowOptions.map(opt => (
            <Pill key={opt} size="sm" active={filterMoscow === opt} onClick={() => setFilterMoscow(opt)}>
              {opt}
            </Pill>
          ))}
        </Row>
        <Row gap={8} wrap>
          <Text size="small" tone="secondary" weight="medium">Épica:</Text>
          {epicOptions.map(opt => (
            <Pill key={opt} size="sm" active={filterEpic === opt} onClick={() => setFilterEpic(opt)}>
              {opt === 'Todas' ? 'Todas' : opt.replace('Gestión de ', '').replace(' e Inteligente', '').replace(' y Automatización', '')}
            </Pill>
          ))}
        </Row>
      </Stack>
      <Text size="small" tone="secondary">{filtered.length} historias · {filtered.reduce((s,x)=>s+x.points,0)} story points</Text>
      <Table
        headers={['ID', 'Épica', 'Historia de usuario', 'Pts', 'MoSCoW', 'Sprint']}
        striped
        stickyHeader
        rowTone={tones}
        columnAlign={['left', 'left', 'left', 'right', 'left', 'center']}
        rows={filtered.map(s => [
          s.id,
          s.epicId,
          s.userStory.replace(/^Como .+?, quiero /, '').replace(/, para .+$/, ''),
          String(s.points),
          s.moscow,
          `S${s.sprint}`,
        ])}
        emptyMessage="No hay historias con los filtros seleccionados."
      />
    </Stack>
  );
}

function HistoriasTab() {
  const [filterEpic, setFilterEpic] = useCanvasState<string>('historiasFilterEpic', 'Todas');
  const epicOptions = ['Todas', ...EPICS.map(e => e.id)];
  const filtered = filterEpic === 'Todas' ? STORIES : STORIES.filter(s => s.epicId === filterEpic);

  return (
    <Stack gap={16}>
      <H2>Historias refinadas con criterios de aceptación</H2>
      <Text tone="secondary">Haz clic en una historia para expandir sus criterios de aceptación en formato Gherkin (Given/When/Then), notas técnicas y ambigüedades.</Text>
      <Row gap={8} wrap>
        {epicOptions.map(opt => (
          <Pill key={opt} size="sm" active={filterEpic === opt} onClick={() => setFilterEpic(opt)}>
            {opt}
          </Pill>
        ))}
      </Row>
      <Stack gap={8}>
        {filtered.map(s => <StoryDetail key={s.id} story={s} />)}
      </Stack>
    </Stack>
  );
}

function RiesgosTab() {
  return (
    <Stack gap={16}>
      <H2>Riesgos y dependencias identificadas</H2>
      <Text tone="secondary">7 riesgos identificados. Los de impacto Crítico deben tener plan de mitigación activo antes de iniciar el sprint relacionado.</Text>

      <Grid columns={2} gap={12}>
        <Stat value="2" label="Riesgos críticos" tone="danger" />
        <Stat value="3" label="Riesgos altos" tone="warning" />
      </Grid>

      <Divider />

      <Table
        headers={['ID', 'Riesgo', 'Impacto', 'HU relacionada']}
        striped
        rowTone={RISKS.map(r => impactTone(r.impact) === 'danger' ? 'danger' : impactTone(r.impact) === 'warning' ? 'warning' : undefined)}
        columnAlign={['left', 'left', 'center', 'left']}
        rows={RISKS.map(r => [r.id, r.risk, r.impact, r.relatedHU])}
      />

      <Divider />
      <H2>Plan de mitigación detallado</H2>

      {RISKS.map(r => (
        <Callout
          key={r.id}
          tone={impactTone(r.impact) === 'danger' ? 'danger' : impactTone(r.impact) === 'warning' ? 'warning' : 'neutral'}
          title={`${r.id} · ${r.risk} — Impacto: ${r.impact} · HU: ${r.relatedHU}`}
        >
          {r.mitigation}
        </Callout>
      ))}

      <Divider />
      <H2>Dependencias críticas entre historias</H2>
      <Table
        headers={['Historia', 'Depende de', 'Tipo de dependencia', 'Riesgo si no se respeta']}
        striped
        rows={[
          ['HU-06 Ranking IA', 'HU-05 Parser CV', 'Datos — necesita CVs parseados', 'Score sin datos = resultados inválidos'],
          ['HU-08 Búsqueda semántica', 'HU-05 Parser CV', 'Datos — embeddings de CVs', 'Pool vacío o sin vectorizar'],
          ['HU-09 Comentarios RT', 'HU-07 Pipeline Kanban', 'Infraestructura WebSocket compartida', 'Doble implementación si no se coordina'],
          ['HU-14 Workflow builder', 'HU-13 Email confirmación', 'Acciones de email en workflows', 'Workflows sin canal de notificación'],
          ['HU-15 Calendario IA', 'Google/Outlook OAuth', 'Integración externa', 'Bloqueo si APIs externas no están listas'],
          ['HU-18 ROI fuentes', 'HU-03 Publicación multicanal', 'Datos de fuente por candidatura', 'Sin tracking = análisis sin datos'],
          ['HU-20 Alertas abandono', 'HU-06 Scoring candidatos', 'Score para filtrar candidatos top', 'Alertas sin priorización inteligente'],
          ['HU-21/22/23 IA avanzada', 'HU-02 JD con IA', 'Infraestructura LLM compartida', 'Coste duplicado de integración LLM'],
          ['HU-24 Chat conversacional', 'HU-17 Dashboard analítica', 'Capa de datos del pipeline', 'Chat sin datos accesibles'],
        ]}
      />
    </Stack>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function ProductBacklog() {
  const [activeTab, setActiveTab] = useCanvasState<Tab>('activeTab', 'resumen');

  const tabs: Array<{ id: Tab; label: string }> = [
    { id: 'resumen', label: 'Resumen ejecutivo' },
    { id: 'epicas', label: 'Mapa de épicas' },
    { id: 'backlog', label: 'Backlog priorizado' },
    { id: 'historias', label: 'Historias refinadas' },
    { id: 'riesgos', label: 'Riesgos y dependencias' },
  ];

  return (
    <Stack gap={20} style={{ padding: '24px 32px', maxWidth: 1100 }}>
      <Stack gap={4}>
        <H1>LTI ATS — Product Backlog v1.0</H1>
        <Text tone="secondary">Backlog priorizado · 24 historias · 139 story points · 8 sprints · Generado sobre PRD v1.0 y User Stories v1.0</Text>
      </Stack>

      <Row gap={8} wrap>
        {tabs.map(tab => (
          <Pill key={tab.id} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </Pill>
        ))}
      </Row>

      <Divider />

      {activeTab === 'resumen' && <ResumenTab />}
      {activeTab === 'epicas' && <EpicasTab />}
      {activeTab === 'backlog' && <BacklogTab />}
      {activeTab === 'historias' && <HistoriasTab />}
      {activeTab === 'riesgos' && <RiesgosTab />}
    </Stack>
  );
}
