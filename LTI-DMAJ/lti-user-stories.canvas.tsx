import {
  Callout,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Grid,
  H1,
  H2,
  H3,
  Pill,
  Row,
  Spacer,
  Stack,
  Stat,
  Text,
  useCanvasState,
  useHostTheme,
} from "cursor/canvas";

type ModuleName =
  | "Gestión de Vacantes"
  | "Gestión de Candidatos"
  | "Colaboración y Evaluación"
  | "Comunicaciones y Automatización"
  | "Analítica e Inteligencia"
  | "IA y Asistencia Inteligente";

type PersonaName =
  | "Reclutador"
  | "HR Manager"
  | "Hiring Manager"
  | "Candidato"
  | "Equipo";

type ScenarioType = "happy_path" | "error" | "edge_case";

interface Scenario {
  type: ScenarioType;
  label: string;
  given: string;
  when: string;
  then: string;
}

interface Story {
  id: string;
  title: string;
  module: ModuleName;
  persona: PersonaName;
  statement: string;
  invest_notes: string;
  scenarios: Scenario[];
}

const MODULE_SHORTS: Record<ModuleName, string> = {
  "Gestión de Vacantes": "Vacantes",
  "Gestión de Candidatos": "Candidatos",
  "Colaboración y Evaluación": "Colaboración",
  "Comunicaciones y Automatización": "Comunicaciones",
  "Analítica e Inteligencia": "Analítica",
  "IA y Asistencia Inteligente": "IA",
};

const STORIES: Story[] = [
  // ── MÓDULO 1: Gestión de Vacantes ──────────────────────────────────────────
  {
    id: "HU-01",
    title: "Crear vacante desde plantilla",
    module: "Gestión de Vacantes",
    persona: "Reclutador",
    statement:
      "Como Reclutador, quiero crear una vacante a partir de una plantilla existente para reducir el tiempo de configuración inicial.",
    invest_notes:
      "Independiente del generador IA. Negociable en número de campos. Valor cuantificable en tiempo. Estimable en 1–3 días. Pequeña. Testeable por pre-relleno correcto de campos.",
    scenarios: [
      {
        type: "happy_path",
        label: "Happy Path",
        given:
          "el reclutador tiene al menos una plantilla guardada y está autenticado",
        when: 'selecciona "Nueva vacante desde plantilla" y elige una de la lista',
        then:
          "el formulario se pre-rellena con todos los campos de la plantilla; el reclutador puede editarlos y guardar la vacante en estado Borrador",
      },
      {
        type: "error",
        label: "Error",
        given: "el reclutador inicia la creación desde plantilla",
        when:
          "la única plantilla disponible fue eliminada por otro usuario durante la misma sesión",
        then:
          'el sistema muestra "Plantilla no disponible" con la opción "Crear desde cero" sin errores no controlados',
      },
      {
        type: "edge_case",
        label: "Edge Case",
        given: "el reclutador selecciona una plantilla con más de 12 meses de antigüedad",
        when: "acepta importar el contenido",
        then:
          'el sistema muestra "Esta plantilla tiene más de 12 meses; te recomendamos revisarla con el asistente IA" y ofrece acceso directo al generador de JD',
      },
    ],
  },
  {
    id: "HU-02",
    title: "Generación de JD con IA",
    module: "Gestión de Vacantes",
    persona: "Reclutador",
    statement:
      "Como Reclutador, quiero que la IA genere una job description optimizada a partir de un brief básico para ahorrar tiempo de redacción y obtener una JD de mayor calidad.",
    invest_notes:
      "Independiente de plantillas. Negociable en nº de variantes. Valor medible en minutos ahorrados. Estimable en 3–5 días. Pequeña. Testeable por completitud de secciones y tiempo de generación < 30 s.",
    scenarios: [
      {
        type: "happy_path",
        label: "Happy Path",
        given:
          "el reclutador tiene un brief con título, área y al menos 3 requisitos",
        when: 'hace clic en "Generar JD con IA" y confirma',
        then:
          "en menos de 30 segundos el sistema genera una JD con secciones estándar (responsabilidades, requisitos, beneficios) lista para editar",
      },
      {
        type: "error",
        label: "Error",
        given: "el reclutador solicita la generación de JD",
        when: "el servicio de IA está temporalmente no disponible (timeout > 30 s)",
        then:
          'el sistema muestra "Servicio de IA no disponible. Inténtalo de nuevo" con botón Reintentar, conservando el brief sin pérdida de datos',
      },
      {
        type: "edge_case",
        label: "Edge Case",
        given: "el brief está escrito en inglés pero la cuenta está configurada en español",
        when: "se solicita la generación",
        then:
          'el sistema genera la JD en español e incluye la nota "Brief detectado en inglés; JD generada en español según configuración de cuenta"',
      },
    ],
  },
  {
    id: "HU-03",
    title: "Publicación multicanal",
    module: "Gestión de Vacantes",
    persona: "HR Manager",
    statement:
      "Como HR Manager, quiero publicar una vacante simultáneamente en LinkedIn, Indeed y mi web corporativa desde un único panel para centralizar la gestión y reducir el trabajo duplicado.",
    invest_notes:
      "Independiente en su lógica de publicación (depende de integraciones configuradas). Negociable en nº de canales del MVP. Estimable en 5–8 días. Testeable por confirmaciones de estado por canal.",
    scenarios: [
      {
        type: "happy_path",
        label: "Happy Path",
        given:
          "la vacante está en estado Aprobada y las credenciales de LinkedIn e Indeed están activas",
        when: "el HR Manager selecciona los canales y hace clic en Publicar",
        then:
          "la vacante se publica en todos los canales seleccionados en menos de 60 s; el panel muestra estado (Publicado/Pendiente/Error) con fecha y hora por canal",
      },
      {
        type: "error",
        label: "Error",
        given: "el HR Manager intenta publicar en LinkedIn",
        when: "el token de integración ha expirado",
        then:
          'el sistema muestra "Credenciales de LinkedIn expiradas" con botón Reconectar, continúa la publicación en los demás canales válidos y registra el incidente en el log de auditoría',
      },
      {
        type: "edge_case",
        label: "Edge Case",
        given: "se publican 5 canales y 3 confirman inmediatamente",
        when: "2 canales permanecen en Pendiente más de 5 minutos",
        then:
          "el sistema reintenta automáticamente (máx. 3 intentos) y notifica al HR Manager si tras los 3 intentos la publicación aún no se completó",
      },
    ],
  },
  {
    id: "HU-04",
    title: "Aprobación de vacantes sin email",
    module: "Gestión de Vacantes",
    persona: "Hiring Manager",
    statement:
      "Como Hiring Manager, quiero aprobar o rechazar vacantes propuestas desde mi panel sin necesidad de email para agilizar el proceso y mantener trazabilidad de decisiones.",
    invest_notes:
      "Independiente del flujo de creación. Negociable en niveles de aprobación. Valor directo en agilidad. Estimable en 2–3 días. Pequeña. Testeable por cambio de estado, notificación y log de auditoría.",
    scenarios: [
      {
        type: "happy_path",
        label: "Happy Path",
        given:
          "el Hiring Manager tiene vacantes pendientes de aprobación en su panel",
        when: "hace clic en Aprobar y añade comentario opcional",
        then:
          "la vacante cambia a estado Aprobada, el reclutador recibe notificación in-app y la acción queda en el log con timestamp y comentario",
      },
      {
        type: "error",
        label: "Error",
        given: "el Hiring Manager intenta aprobar una vacante",
        when: "su sesión ha expirado durante la navegación",
        then:
          "el sistema solicita reautenticación y tras el login redirige al panel de aprobaciones con la vacante pendiente visible, sin pérdida de contexto",
      },
      {
        type: "edge_case",
        label: "Edge Case",
        given:
          "dos Hiring Managers con permisos sobre la misma vacante están activos simultáneamente",
        when: "ambos intentan aprobarla en el mismo instante",
        then:
          'el sistema procesa la primera aprobación (FIFO) y notifica al segundo "Esta vacante ya fue aprobada por [nombre] a las [hora]"',
      },
    ],
  },
  // ── MÓDULO 2: Gestión de Candidatos ──────────────────────────────────────────
  {
    id: "HU-05",
    title: "Parser de CV automático",
    module: "Gestión de Candidatos",
    persona: "Reclutador",
    statement:
      "Como Reclutador, quiero que el sistema extraiga automáticamente los datos del CV al recibir una aplicación para eliminar la carga manual de introducción de datos.",
    invest_notes:
      "Independiente del scoring. Negociable en formatos soportados (PDF, DOCX, LinkedIn). Valor cuantificable en tiempo ahorrado. Estimable en 5–7 días. Testeable por precisión ≥ 90% en campos clave.",
    scenarios: [
      {
        type: "happy_path",
        label: "Happy Path",
        given: "un candidato envía su aplicación con CV en PDF estándar",
        when: "el sistema recibe la aplicación",
        then:
          "en menos de 5 segundos el perfil queda pre-rellenado con nombre, email, teléfono, experiencia, educación y habilidades con precisión ≥ 90%",
      },
      {
        type: "error",
        label: "Error",
        given: "llega una aplicación con un archivo adjunto corrupto o en formato no soportado",
        when: "el parser intenta procesarlo",
        then:
          "el sistema crea el perfil con el email del remitente, marca el CV como Requiere revisión manual y notifica al reclutador con enlace directo al perfil",
      },
      {
        type: "edge_case",
        label: "Edge Case",
        given: "el CV tiene un diseño de dos columnas paralelas en PDF",
        when: "el parser procesa el documento",
        then:
          "el sistema extrae la información manteniendo el orden lógico (sin mezclar columnas) y marca con baja confianza los campos donde detecta ambigüedad",
      },
    ],
  },
  {
    id: "HU-06",
    title: "Ranking automático de candidatos",
    module: "Gestión de Candidatos",
    persona: "Reclutador",
    statement:
      "Como Reclutador, quiero ver un ranking automático de candidatos por ajuste al perfil para priorizar mis revisiones y enfocarme en los más prometedores primero.",
    invest_notes:
      "Independiente del parser (se alimenta de sus datos). Negociable en pesos del modelo. Valor medible en tiempo de revisión. Estimable en 5–8 días. Testeable con ground-truth y datos de prueba controlados.",
    scenarios: [
      {
        type: "happy_path",
        label: "Happy Path",
        given: "una vacante tiene ≥ 20 candidatos con CVs procesados",
        when: "el reclutador accede a la vista del pipeline",
        then:
          "los candidatos aparecen ordenados por score (0–100) con los 3 factores principales que explican la puntuación de cada uno, disponible en < 2 s",
      },
      {
        type: "error",
        label: "Error",
        given:
          "el modelo de scoring no tiene datos de entrenamiento suficientes para un rol muy nicho",
        when: "se calcula el score de un candidato",
        then:
          'el sistema muestra el score con la etiqueta "Confianza baja" e ícono informativo "Datos insuficientes para este rol; revisar manualmente"',
      },
      {
        type: "edge_case",
        label: "Edge Case",
        given:
          "un candidato aplica con un perfil significativamente superior a todos los requisitos del puesto",
        when: "el sistema calcula su score",
        then:
          'el sistema muestra la alerta "Perfil muy por encima del rango (posible sobrequalificación)" en lugar de un score alto que induzca a error',
      },
    ],
  },
  {
    id: "HU-07",
    title: "Pipeline Kanban con drag & drop",
    module: "Gestión de Candidatos",
    persona: "Reclutador",
    statement:
      "Como Reclutador, quiero mover candidatos entre etapas del pipeline con drag & drop para gestionar el proceso de forma visual e intuitiva reduciendo clics.",
    invest_notes:
      "Independiente del scoring. Negociable en comportamientos al soltar (notificaciones, validaciones). Valor inmediato en usabilidad. Estimable en 3–5 días. Testeable por interacción UI, activación de workflows y sincronización en tiempo real.",
    scenarios: [
      {
        type: "happy_path",
        label: "Happy Path",
        given: "el reclutador está en la vista Kanban con candidatos en Screening",
        when: "arrastra la tarjeta de un candidato a la columna Entrevista Técnica",
        then:
          "el candidato se actualiza a la nueva etapa inmediatamente, los workflows asociados se disparan y el cambio es visible en tiempo real para todos los colaboradores activos",
      },
      {
        type: "error",
        label: "Error",
        given: "el reclutador intenta arrastrar un candidato a la etapa Oferta",
        when: "el formulario de evaluación obligatorio no está completado",
        then:
          "el sistema bloquea el movimiento, el candidato vuelve a su posición y aparece un tooltip Completa el formulario de evaluación antes de avanzar a Oferta",
      },
      {
        type: "edge_case",
        label: "Edge Case",
        given:
          "dos reclutadores ven el mismo pipeline y ambos arrastran el mismo candidato a etapas distintas simultáneamente",
        when: "las dos acciones llegan al servidor",
        then:
          "el sistema aplica el primer movimiento (FIFO), actualiza la vista de ambos y el segundo recibe un aviso El estado de este candidato fue actualizado por [nombre]",
      },
    ],
  },
  {
    id: "HU-08",
    title: "Búsqueda semántica en talent pool",
    module: "Gestión de Candidatos",
    persona: "Reclutador",
    statement:
      "Como Reclutador, quiero buscar candidatos en mi talent pool histórico mediante búsqueda semántica para reutilizar talento previo y reducir el coste de sourcing.",
    invest_notes:
      "Independiente del pipeline activo. Negociable en alcance del pool (empresa vs. compartido). Valor directo en reducción de coste de atracción. Estimable en 5–8 días. Testeable con queries semánticas y datos controlados.",
    scenarios: [
      {
        type: "happy_path",
        label: "Happy Path",
        given: "el talent pool tiene ≥ 50 candidatos históricos con CVs procesados",
        when:
          'el reclutador escribe "senior backend engineer con experiencia en microservicios y Kubernetes"',
        then:
          'en < 3 segundos el sistema devuelve candidatos ordenados por relevancia semántica, incluso si sus CVs usan términos distintos (ej. "arquitecto de servicios distribuidos")',
      },
      {
        type: "error",
        label: "Error",
        given: "el reclutador realiza una búsqueda semántica",
        when: "la consulta contiene solo stop words o caracteres especiales sin significado",
        then:
          'el sistema muestra "Introduce términos más específicos para obtener resultados" con ejemplos de consultas efectivas y no ejecuta la query',
      },
      {
        type: "edge_case",
        label: "Edge Case",
        given: "la búsqueda devuelve menos de 3 candidatos",
        when: "el reclutador ve los escasos resultados",
        then:
          'el sistema muestra los resultados disponibles y ofrece "Ampliar búsqueda incluyendo candidatos de otras vacantes" para aumentar el universo',
      },
    ],
  },
  // ── MÓDULO 3: Colaboración y Evaluación ──────────────────────────────────────
  {
    id: "HU-09",
    title: "Comentarios en tiempo real sobre candidatos",
    module: "Colaboración y Evaluación",
    persona: "Hiring Manager",
    statement:
      "Como Hiring Manager, quiero dejar comentarios estructurados sobre un candidato en tiempo real para que el reclutador los vea inmediatamente y se agilice la toma de decisiones.",
    invest_notes:
      "Independiente del sistema de votación. Negociable en estructura del comentario (libre vs. categorizado). Valor en velocidad de decisión. Estimable en 2–4 días. Testeable por latencia de propagación < 1 s.",
    scenarios: [
      {
        type: "happy_path",
        label: "Happy Path",
        given: "el Hiring Manager está revisando el perfil de un candidato con acceso a la vacante",
        when: "escribe un comentario y hace clic en Enviar",
        then:
          "el comentario aparece en el perfil del candidato en < 1 segundo para todos los usuarios activos, con marca de tiempo e identificación del autor",
      },
      {
        type: "error",
        label: "Error",
        given: "el Hiring Manager escribe un comentario extenso",
        when: "pierde la conexión a internet e intenta enviarlo",
        then:
          "el sistema detecta la desconexión, guarda el borrador localmente con aviso Sin conexión: comentario guardado como borrador, y lo reenvía automáticamente al restaurarse la conexión",
      },
      {
        type: "edge_case",
        label: "Edge Case",
        given:
          "dos Hiring Managers envían comentarios sobre el mismo candidato en el mismo milisegundo",
        when: "los dos mensajes llegan al servidor",
        then:
          "ambos comentarios se guardan sin conflicto en orden cronológico; ambos autores los ven sin necesidad de refrescar la página",
      },
    ],
  },
  {
    id: "HU-10",
    title: "Formularios de evaluación personalizados",
    module: "Colaboración y Evaluación",
    persona: "Reclutador",
    statement:
      "Como Reclutador, quiero crear formularios de evaluación de entrevistas personalizados por rol para estandarizar el feedback y facilitar la comparación objetiva entre candidatos.",
    invest_notes:
      "Independiente del sistema de votación. Negociable en tipos de campo (escala, texto, múltiple opción). Valor en calidad del feedback. Estimable en 3–5 días. Testeable por creación, asignación y completado del formulario.",
    scenarios: [
      {
        type: "happy_path",
        label: "Happy Path",
        given:
          'el reclutador está configurando la vacante "Desarrollador Backend"',
        when:
          "crea un formulario con 5 preguntas (escala 1–5 y texto libre) y lo vincula al rol",
        then:
          "el formulario queda activo para la vacante y cuando se programa una entrevista el entrevistador lo ve pre-cargado listo para completar",
      },
      {
        type: "error",
        label: "Error",
        given: "el reclutador intenta guardar un formulario de evaluación",
        when: "no ha añadido ninguna pregunta",
        then:
          'el sistema muestra la validación "El formulario debe contener al menos una pregunta" junto al campo vacío y no permite guardar',
      },
      {
        type: "edge_case",
        label: "Edge Case",
        given: "el reclutador modifica un formulario que ya tiene 5 evaluaciones completadas",
        when: "intenta eliminar una pregunta existente",
        then:
          'el sistema muestra "Esta acción afectará la comparabilidad de 5 evaluaciones existentes" y requiere confirmación explícita; la versión anterior queda archivada',
      },
    ],
  },
  {
    id: "HU-11",
    title: "Votación y consenso del equipo",
    module: "Colaboración y Evaluación",
    persona: "Equipo",
    statement:
      "Como equipo de selección, quiero votar sobre un candidato (avanzar/rechazar) con un sistema de consenso visible para todos para tomar decisiones colaborativas y documentadas.",
    invest_notes:
      "Independiente de comentarios. Negociable en reglas de consenso (mayoría, unanimidad, configurable). Valor en transparencia de decisiones. Estimable en 3–5 días. Testeable por registro de votos, notificaciones y resolución de empates.",
    scenarios: [
      {
        type: "happy_path",
        label: "Happy Path",
        given:
          "todos los evaluadores asignados han completado su entrevista y tienen acceso a votar",
        when: "cada evaluador emite su voto (Avanzar / Rechazar / Pendiente)",
        then:
          "el sistema muestra el resultado agregado en tiempo real y notifica al reclutador cuando se alcanza el criterio de consenso configurado, registrando cada voto con timestamp",
      },
      {
        type: "error",
        label: "Error",
        given: "un usuario intenta votar sobre un candidato",
        when: "no tiene el rol Evaluador asignado para esa vacante",
        then:
          'el sistema muestra "No tienes permisos para votar en esta vacante. Contacta al reclutador responsable" y no registra ningún voto',
      },
      {
        type: "edge_case",
        label: "Edge Case",
        given:
          "la votación tiene 3 votos (2 Avanzar, 1 Rechazar) y el criterio configurado requiere unanimidad",
        when: "el sistema detecta el desacuerdo",
        then:
          'se crea automáticamente una tarea "Resolver desacuerdo de votación para [candidato]" asignada al reclutador y se notifica a todo el equipo de la necesidad de calibración',
      },
    ],
  },
  {
    id: "HU-12",
    title: "Alertas de inactividad de hiring managers",
    module: "Colaboración y Evaluación",
    persona: "Reclutador",
    statement:
      "Como Reclutador, quiero recibir alertas cuando un hiring manager no ha dado feedback en más de 48 horas para actuar proactivamente y evitar la pérdida de candidatos por inacción.",
    invest_notes:
      "Independiente del sistema de comentarios. Negociable en el SLA (48 h configurable por cuenta). Valor en retención de candidatos. Estimable en 2–3 días. Testeable por tiempo de disparo de la alerta y correcta identificación del responsable.",
    scenarios: [
      {
        type: "happy_path",
        label: "Happy Path",
        given:
          "un candidato lleva exactamente 48 horas esperando feedback de un Hiring Manager asignado y el SLA está configurado a 48 h",
        when: "el sistema ejecuta la verificación periódica de SLAs",
        then:
          "el reclutador recibe notificación in-app y email con nombre del candidato, vacante, Hiring Manager pendiente y enlace directo al perfil",
      },
      {
        type: "error",
        label: "Error",
        given: "el sistema intenta enviar la alerta de inactividad",
        when: "la dirección de email del reclutador está rebotando (hard bounce)",
        then:
          "el sistema registra el fallo, escala la notificación al HR Manager supervisor por canal in-app y marca el canal email del reclutador como Requiere atención",
      },
      {
        type: "edge_case",
        label: "Edge Case",
        given:
          "el SLA de 48 h está activo y las 48 horas caen completamente dentro de un fin de semana (viernes 18 h a lunes 9 h)",
        when: "el sistema calcula el cumplimiento del SLA",
        then:
          "el conteo se pausa durante el fin de semana según el horario laboral configurado (L–V, 9–18 h) y se reanuda el lunes a las 9 h, sin disparar falsas alertas durante el weekend",
      },
    ],
  },
  // ── MÓDULO 4: Comunicaciones y Automatización ─────────────────────────────────
  {
    id: "HU-13",
    title: "Email de confirmación automático al candidato",
    module: "Comunicaciones y Automatización",
    persona: "Reclutador",
    statement:
      "Como Reclutador, quiero que el sistema envíe automáticamente un email de confirmación a cada candidato al aplicar para mejorar su experiencia y dar transparencia al proceso desde el inicio.",
    invest_notes:
      "Independiente de workflows complejos. Negociable en contenido del template. Valor directo en NPS candidato. Estimable en 1–2 días. Pequeña. Testeable por entrega en < 2 min y correcta personalización del contenido.",
    scenarios: [
      {
        type: "happy_path",
        label: "Happy Path",
        given: "un candidato completa y envía su aplicación para una vacante activa",
        when: "el sistema recibe la aplicación",
        then:
          "en menos de 2 minutos el candidato recibe un email de confirmación con nombre del puesto, empresa, número de referencia y próximos pasos del proceso",
      },
      {
        type: "error",
        label: "Error",
        given: "el sistema intenta enviar el email de confirmación",
        when: 'el candidato proporcionó un email con typo (ej. "@gmai.com") que no existe',
        then:
          "el sistema registra el fallo de entrega, marca la aplicación con Email no entregado – verificar contacto y muestra alerta al reclutador para contactar por otro medio",
      },
      {
        type: "edge_case",
        label: "Edge Case",
        given: "un candidato aplica el mismo día a dos vacantes distintas de la misma empresa",
        when: "ambas aplicaciones son procesadas",
        then:
          "el candidato recibe dos emails diferenciados claramente por el nombre del puesto, sin fusiones ni duplicados confusos",
      },
    ],
  },
  {
    id: "HU-14",
    title: "Workflow builder no-code",
    module: "Comunicaciones y Automatización",
    persona: "Reclutador",
    statement:
      "Como Reclutador, quiero configurar flujos automáticos (trigger → condición → acción) sin escribir código para automatizar tareas repetitivas sin depender del equipo técnico.",
    invest_notes:
      "Independiente de plantillas (aunque las usa). Negociable en nº de acciones por trigger. Valor en reducción de tiempo operativo. Estimable en 8–13 días (1 sprint). Testeable por ejecución correcta del workflow y detección de bucles.",
    scenarios: [
      {
        type: "happy_path",
        label: "Happy Path",
        given:
          "el reclutador accede al workflow builder y tiene plantillas de email configuradas",
        when:
          'configura el trigger "Candidato avanza a Entrevista Técnica" → acción "Enviar email plantilla X" y activa el workflow',
        then:
          "el workflow queda activo y la próxima vez que un candidato avance a esa etapa, el email se envía automáticamente en < 1 minuto sin intervención manual",
      },
      {
        type: "error",
        label: "Error",
        given:
          "el reclutador diseña un workflow con un bucle circular (acción A dispara trigger B que dispara acción A)",
        when: "intenta guardar y activar el workflow",
        then:
          'el sistema detecta el bucle antes de guardar, muestra "Se ha detectado un bucle: Acción A → Trigger B → Acción A" y no permite activar el workflow hasta corregirlo',
      },
      {
        type: "edge_case",
        label: "Edge Case",
        given: "existe un workflow activo que referencia una plantilla de email",
        when: "otro usuario modifica esa plantilla",
        then:
          'el sistema notifica al propietario del workflow "La plantilla \'[nombre]\' usada en tu workflow ha sido modificada" con enlace para previsualizar el impacto',
      },
    ],
  },
  {
    id: "HU-15",
    title: "Coordinación de entrevistas con IA",
    module: "Comunicaciones y Automatización",
    persona: "Reclutador",
    statement:
      "Como Reclutador, quiero que la IA sugiera la disponibilidad óptima para entrevistas cruzando los calendarios del equipo para reducir el tiempo de coordinación de agenda.",
    invest_notes:
      "Independiente del workflow builder. Negociable en ventana de búsqueda (5 días default). Valor cuantificable en horas de coordinación ahorradas. Estimable en 5–8 días incluyendo integración de calendarios. Testeable por calidad y viabilidad de las propuestas.",
    scenarios: [
      {
        type: "happy_path",
        label: "Happy Path",
        given:
          "los calendarios de Google/Outlook del reclutador y 2 entrevistadores están integrados y actualizados",
        when: "el reclutador solicita sugerencias de horario para una entrevista de 60 minutos",
        then:
          "el sistema propone 3 franjas horarias disponibles para todos los participantes en los próximos 5 días laborables con los nombres de quienes estarían disponibles en cada franja",
      },
      {
        type: "error",
        label: "Error",
        given: "el reclutador solicita sugerencias de horario",
        when: "uno de los entrevistadores no ha conectado su calendario",
        then:
          "el sistema muestra opciones para los calendarios conectados, indica qué entrevistador falta y permite al reclutador proceder con las opciones disponibles o solicitar la conexión del calendario",
      },
      {
        type: "edge_case",
        label: "Edge Case",
        given: "todos los participantes tienen los calendarios completamente llenos los próximos 5 días",
        when: "el sistema busca disponibilidad",
        then:
          "el sistema amplía automáticamente la búsqueda a 10 días, informa al reclutador del motivo y ofrece enviar al candidato un enlace de self-scheduling",
      },
    ],
  },
  {
    id: "HU-16",
    title: "Actualizaciones de estado para el candidato",
    module: "Comunicaciones y Automatización",
    persona: "Candidato",
    statement:
      "Como Candidato, quiero recibir actualizaciones del estado de mi candidatura por email o SMS para sentir que el proceso es transparente y no tener que perseguir al reclutador.",
    invest_notes:
      "Independiente de las automatizaciones internas. Negociable en canales (email/SMS/WhatsApp). Valor directo en NPS candidato. Estimable en 3–5 días. Testeable por entrega en < 5 min y correcta personalización por canal.",
    scenarios: [
      {
        type: "happy_path",
        label: "Happy Path",
        given: "el candidato tiene una aplicación activa y eligió notificaciones por email",
        when: "el reclutador mueve la candidatura a la siguiente etapa",
        then:
          "en < 5 minutos el candidato recibe un email con el nombre de la nueva etapa, el puesto y los próximos pasos si están configurados",
      },
      {
        type: "error",
        label: "Error",
        given: "el candidato eligió recibir notificaciones por SMS",
        when: "el número de teléfono es de un país sin cobertura del proveedor SMS",
        then:
          "el sistema detecta el fallo, realiza fallback automático a email (si está disponible), notifica al reclutador del incidente y registra el intento fallido",
      },
      {
        type: "edge_case",
        label: "Edge Case",
        given: "el candidato recibe una notificación de rechazo con enlace a su portal",
        when: "intenta acceder al portal 45 días después del rechazo",
        then:
          'el enlace ha expirado (30 días por GDPR) y el sistema muestra "Este enlace ha expirado. Para solicitar tus datos contacta con [email GDPR de la empresa]" en lugar de un error 404',
      },
    ],
  },
  // ── MÓDULO 5: Analítica e Inteligencia ─────────────────────────────────────────
  {
    id: "HU-17",
    title: "Dashboard de métricas en tiempo real",
    module: "Analítica e Inteligencia",
    persona: "HR Manager",
    statement:
      "Como HR Manager, quiero un dashboard con métricas clave (time-to-hire, conversion rates, source quality) en tiempo real para monitorizar el rendimiento y detectar cuellos de botella.",
    invest_notes:
      "Independiente de reportes exportables. Negociable en KPIs del MVP (3–5 métricas clave). Valor estratégico directo. Estimable en 8–13 días. Puede dividirse en vista básica y avanzada. Testeable por precisión de datos y cumplimiento de SLA de carga < 2 s.",
    scenarios: [
      {
        type: "happy_path",
        label: "Happy Path",
        given: "el HR Manager accede al módulo de analítica con ≥ 30 días de actividad",
        when: "la página del dashboard carga",
        then:
          "en < 2 segundos se muestran time-to-hire promedio, tasa de conversión por etapa y top 3 fuentes, actualizados con datos de las últimas 24 horas",
      },
      {
        type: "error",
        label: "Error",
        given:
          "el dashboard intenta cargar datos en tiempo real",
        when: "el servicio de analítica tiene un backlog y los datos tienen más de 1 hora de retraso",
        then:
          'el dashboard muestra los últimos datos disponibles con el indicador "Última actualización: hace X horas" y un banner visible "Datos en procesamiento"',
      },
      {
        type: "edge_case",
        label: "Edge Case",
        given: "el HR Manager accede al dashboard el primer día tras activar la cuenta (sin datos)",
        when: "la página carga",
        then:
          'el sistema muestra el dashboard con indicadores vacíos y el mensaje "Publica tu primera vacante para ver métricas aquí", sin valores NaN, errores ni divisiones por cero',
      },
    ],
  },
  {
    id: "HU-18",
    title: "Análisis de fuentes con ROI estimado",
    module: "Analítica e Inteligencia",
    persona: "Reclutador",
    statement:
      "Como Reclutador, quiero ver qué fuentes de candidatos generan más contrataciones exitosas con su ROI estimado para optimizar el presupuesto de atracción.",
    invest_notes:
      "Independiente del dashboard general. Negociable en métricas por fuente. Valor directo en optimización de presupuesto. Estimable en 3–5 días. Testeable con datos conocidos comparando tasa de conversión por fuente.",
    scenarios: [
      {
        type: "happy_path",
        label: "Happy Path",
        given:
          "el reclutador tiene ≥ 3 meses de datos con candidatos de múltiples fuentes",
        when: "accede al módulo de análisis de fuentes",
        then:
          "ve un ranking de fuentes ordenado por tasa de conversión a contratación con el coste estimado por hire por fuente, con filtros por periodo y vacante",
      },
      {
        type: "error",
        label: "Error",
        given: "el reclutador accede al análisis de fuentes",
        when: "más del 30% de las candidaturas no tienen fuente registrada",
        then:
          'el sistema muestra los datos disponibles con el aviso "El 30% de candidaturas no tienen fuente registrada; el análisis puede estar sesgado" y enlace a la guía de configuración de UTMs',
      },
      {
        type: "edge_case",
        label: "Edge Case",
        given: "el reclutador compara dos fuentes y una tiene solo 2 candidaturas en el periodo",
        when: "se calcula el ROI de esa fuente",
        then:
          'el sistema muestra el dato con la advertencia "Muestra estadísticamente insuficiente (n=2): resultado no representativo" y sugiere ampliar el rango de fechas',
      },
    ],
  },
  {
    id: "HU-19",
    title: "Reportes exportables PDF/Excel",
    module: "Analítica e Inteligencia",
    persona: "HR Manager",
    statement:
      "Como HR Manager, quiero generar reportes exportables en PDF y Excel con los datos del proceso para presentar resultados a dirección sin trabajo manual adicional.",
    invest_notes:
      "Independiente del dashboard. Negociable en formatos (PDF/Excel/CSV). Valor directo para comunicación interna. Estimable en 3–5 días. Testeable por generación correcta, formato y fidelidad de contenido.",
    scenarios: [
      {
        type: "happy_path",
        label: "Happy Path",
        given: "el HR Manager está en el módulo de reporting con filtros de fecha y vacante configurados",
        when: "selecciona Exportar → PDF y confirma",
        then:
          "en < 30 segundos el archivo LTI_Report_[YYYY-MM-DD].pdf se descarga con portada, métricas filtradas y formato adecuado para presentación ejecutiva",
      },
      {
        type: "error",
        label: "Error",
        given: "el HR Manager solicita un reporte con rango de 24 meses",
        when: "el volumen de datos supera el límite de procesamiento síncrono",
        then:
          'el sistema muestra "El reporte es muy extenso. Te lo enviaremos por email cuando esté listo (estimado: 5–10 min)" y ofrece reducir el rango para generación inmediata',
      },
      {
        type: "edge_case",
        label: "Edge Case",
        given:
          "se genera un reporte Excel con nombres de candidatos que contienen caracteres en árabe, chino o cirílico",
        when: "el archivo es descargado y abierto en Excel",
        then:
          "el archivo preserva correctamente la codificación unicode de todos los caracteres sin corrupción ni caracteres ilegibles",
      },
    ],
  },
  {
    id: "HU-20",
    title: "Alertas de candidato en riesgo de abandono",
    module: "Analítica e Inteligencia",
    persona: "HR Manager",
    statement:
      "Como HR Manager, quiero recibir alertas proactivas cuando hay riesgo de pérdida de un candidato top por tiempo de respuesta elevado para actuar antes de que acepte otra oferta.",
    invest_notes:
      "Independiente del módulo de analítica general. Negociable en umbrales de score y tiempo. Valor crítico en retención de candidatos de alto impacto. Estimable en 3–5 días. Testeable por disparo correcto de alertas y ausencia de ruido por falsos positivos.",
    scenarios: [
      {
        type: "happy_path",
        label: "Happy Path",
        given: "un candidato con score ≥ 80 lleva más de 72 horas sin movimiento en el pipeline",
        when: "el sistema ejecuta el análisis periódico de riesgo de abandono",
        then:
          "el HR Manager recibe notificación in-app con nombre, vacante, días sin movimiento y reclutador responsable, con enlace directo al perfil",
      },
      {
        type: "error",
        label: "Error",
        given: "el sistema calcula el riesgo de un candidato de alto score",
        when: "el perfil del candidato no tiene datos de contacto completos",
        then:
          'la alerta se genera igualmente con la nota adicional "Perfil de contacto incompleto: verifica teléfono y email antes de actuar"',
      },
      {
        type: "edge_case",
        label: "Edge Case",
        given: "el mismo candidato activa el criterio de riesgo en 3 vacantes distintas simultáneamente",
        when: "el sistema genera las alertas",
        then:
          'el sistema agrupa las 3 en una sola notificación "Candidato [nombre] en riesgo en 3 vacantes" en lugar de 3 notificaciones separadas, evitando ruido',
      },
    ],
  },
  // ── MÓDULO 6: IA y Asistencia Inteligente ────────────────────────────────────
  {
    id: "HU-21",
    title: "Resumen de entrevista generado por IA",
    module: "IA y Asistencia Inteligente",
    persona: "Reclutador",
    statement:
      "Como Reclutador, quiero que la IA resuma las notas de una entrevista en un párrafo ejecutivo para ahorrar tiempo de documentación y tener un resumen consistente para compartir.",
    invest_notes:
      "Independiente del generador de JDs. Negociable en longitud/formato del resumen. Valor medible en minutos de documentación ahorrados. Estimable en 2–4 días. Testeable por calidad, completitud y tiempo de generación < 15 s.",
    scenarios: [
      {
        type: "happy_path",
        label: "Happy Path",
        given: "el reclutador tiene notas de entrevista de ≥ 100 palabras en el campo de notas",
        when: 'hace clic en "Generar resumen con IA"',
        then:
          "en < 15 segundos la IA genera un párrafo ejecutivo de 3–5 oraciones con puntos fuertes, áreas de mejora y recomendación del entrevistador, listo para editar",
      },
      {
        type: "error",
        label: "Error",
        given: "el reclutador intenta generar el resumen",
        when: "las notas están en un idioma que el modelo no procesa con fiabilidad",
        then:
          'el sistema muestra "Idioma no reconocido con suficiente confianza. El resumen se generará en inglés" e incluye la limitación detectada en el output',
      },
      {
        type: "edge_case",
        label: "Edge Case",
        given: "la IA genera un resumen y el entrevistador lo edita manualmente",
        when: "guarda la versión modificada",
        then:
          'el sistema guarda la versión editada con el tag "Editado por [nombre]" y conserva la versión original de la IA accesible mediante "Ver versión original"',
      },
    ],
  },
  {
    id: "HU-22",
    title: "Sugerencias de preguntas de entrevista",
    module: "IA y Asistencia Inteligente",
    persona: "Reclutador",
    statement:
      "Como Reclutador, quiero recibir sugerencias de preguntas de entrevista basadas en las brechas del perfil del candidato para mejorar la calidad y relevancia de la entrevista.",
    invest_notes:
      "Independiente del resumen de entrevista. Negociable en nº y tipo de preguntas. Valor en calidad de entrevista y reducción de sesgo. Estimable en 3–5 días. Testeable por relevancia de las preguntas respecto a las brechas detectadas.",
    scenarios: [
      {
        type: "happy_path",
        label: "Happy Path",
        given:
          "el reclutador prepara la entrevista de un candidato con perfil y requisitos de la vacante disponibles",
        when: 'solicita "Sugerencias de preguntas IA"',
        then:
          "la IA genera 5–8 preguntas focalizadas en las brechas detectadas (ej. falta de experiencia en cloud), clasificadas por tipo (técnica/comportamental/situacional) y listas para usar o editar",
      },
      {
        type: "error",
        label: "Error",
        given: "el reclutador solicita sugerencias de preguntas",
        when: "el perfil del candidato está incompleto (solo nombre, sin CV ni experiencia)",
        then:
          'el sistema muestra "Perfil insuficiente para preguntas personalizadas" y ofrece 5 preguntas genéricas del rol como alternativa',
      },
      {
        type: "edge_case",
        label: "Edge Case",
        given: "el candidato tiene un perfil que cubre todos los requisitos sin brechas detectables",
        when: "el reclutador solicita sugerencias",
        then:
          'la IA genera preguntas de profundización y fit cultural con la nota "Perfil completo: preguntas orientadas a evaluar excelencia y alineación cultural"',
      },
    ],
  },
  {
    id: "HU-23",
    title: "Detector de sesgo en job descriptions",
    module: "IA y Asistencia Inteligente",
    persona: "Reclutador",
    statement:
      "Como Reclutador, quiero que la IA detecte posibles sesgos en el lenguaje de una job description y sugiera alternativas inclusivas para atraer mayor diversidad de candidatos.",
    invest_notes:
      "Independiente del generador de JDs (usable sobre JDs existentes). Negociable en tipos de sesgo detectados (género, edad, cultura). Valor en diversidad y reducción de riesgo legal. Estimable en 3–5 días. Testeable con corpus documentado de términos sesgados.",
    scenarios: [
      {
        type: "happy_path",
        label: "Happy Path",
        given:
          'el reclutador tiene una JD con términos como "rockstar", "joven dinámico" y "nativo digital"',
        when: "ejecuta el análisis de sesgo",
        then:
          "el sistema resalta los términos problemáticos, explica el tipo de sesgo de cada uno (edad, género) y ofrece alternativas inclusivas editables inline sin abandonar la vista de edición",
      },
      {
        type: "error",
        label: "Error",
        given: "el reclutador ejecuta el análisis sobre una JD",
        when: "la descripción tiene menos de 50 palabras",
        then:
          'el sistema muestra "Añade más contenido para un análisis preciso (mínimo recomendado: 50 palabras)" sin emitir falsos positivos sobre texto insuficiente',
      },
      {
        type: "edge_case",
        label: "Edge Case",
        given: "el reclutador acepta todas las sugerencias y la JD queda modificada",
        when: "re-ejecuta el análisis sobre la versión corregida",
        then:
          'el sistema confirma "Sin sesgos detectados" y ofrece una vista diff para comparar el antes y después antes de publicar',
      },
    ],
  },
  {
    id: "HU-24",
    title: "Chat conversacional con datos del pipeline",
    module: "IA y Asistencia Inteligente",
    persona: "HR Manager",
    statement:
      "Como HR Manager, quiero un asistente conversacional para consultar datos del pipeline en lenguaje natural sin necesidad de generar reportes manualmente.",
    invest_notes:
      "Independiente del dashboard (canal alternativo de acceso a datos). Negociable en profundidad de consultas soportadas. Valor en accesibilidad de insights para perfiles no técnicos. Estimable en 8–13 días. Testeable por variedad de intenciones de consulta y respeto a RBAC.",
    scenarios: [
      {
        type: "happy_path",
        label: "Happy Path",
        given: "el HR Manager accede al chat conversacional con datos de pipeline disponibles",
        when:
          'pregunta "¿Cuántos candidatos tenemos en etapa final para las vacantes de ingeniería este mes?"',
        then:
          "el asistente responde con el número exacto, las vacantes afectadas y ofrece desgloses por reclutador o semana, todo en lenguaje natural en < 5 segundos",
      },
      {
        type: "error",
        label: "Error",
        given: "el HR Manager consulta al asistente",
        when: 'pregunta por datos fuera del sistema ("¿Cuál es la tasa de rotación de empleados?")',
        then:
          'el asistente responde "Esa información no está en LTI ATS. Puedo ayudarte con datos de reclutamiento y pipeline" y sugiere 3 preguntas relacionadas que sí puede responder',
      },
      {
        type: "edge_case",
        label: "Edge Case",
        given:
          "el HR Manager consulta datos personales de un candidato específico",
        when: "su rol no tiene acceso a esa vacante por restricciones RBAC",
        then:
          'el asistente responde "No tienes permisos para ver los detalles de ese candidato" sin exponer ningún dato ni confirmar si el candidato existe en el sistema',
      },
    ],
  },
];

const MODULES: ModuleName[] = [
  "Gestión de Vacantes",
  "Gestión de Candidatos",
  "Colaboración y Evaluación",
  "Comunicaciones y Automatización",
  "Analítica e Inteligencia",
  "IA y Asistencia Inteligente",
];

const PERSONAS: PersonaName[] = [
  "Reclutador",
  "HR Manager",
  "Hiring Manager",
  "Candidato",
  "Equipo",
];

const INVEST_LABELS = [
  { key: "I", full: "Independiente" },
  { key: "N", full: "Negociable" },
  { key: "V", full: "Valuable" },
  { key: "E", full: "Estimable" },
  { key: "S", full: "Small" },
  { key: "T", full: "Testeable" },
];

const SCENARIO_META: Record<
  ScenarioType,
  { tone: "success" | "warning" | "info"; label: string }
> = {
  happy_path: { tone: "success", label: "Happy Path" },
  error: { tone: "warning", label: "Escenario de Error" },
  edge_case: { tone: "info", label: "Edge Case" },
};

function ScenarioBlock({ scenario }: { scenario: Scenario }) {
  const meta = SCENARIO_META[scenario.type];
  return (
    <Callout tone={meta.tone} title={`${meta.label} — ${scenario.label}`}>
      <Stack gap={4}>
        <Text size="small">
          <Text weight="semibold" as="span">
            Dado{" "}
          </Text>
          <Text as="span">que {scenario.given}</Text>
        </Text>
        <Text size="small">
          <Text weight="semibold" as="span">
            Cuando{" "}
          </Text>
          <Text as="span">{scenario.when}</Text>
        </Text>
        <Text size="small">
          <Text weight="semibold" as="span">
            Entonces{" "}
          </Text>
          <Text as="span">{scenario.then}</Text>
        </Text>
      </Stack>
    </Callout>
  );
}

function StoryCard({ story }: { story: Story }) {
  const theme = useHostTheme();
  return (
    <Card collapsible defaultOpen={false}>
      <CardHeader
        trailing={
          <Pill size="sm" tone="neutral">
            {story.persona}
          </Pill>
        }
      >
        {story.id} · {story.title}
      </CardHeader>
      <CardBody>
        <Stack gap={12}>
          <Row gap={6} wrap>
            <Pill size="sm" active tone="info">
              {MODULE_SHORTS[story.module]}
            </Pill>
            {INVEST_LABELS.map((inv) => (
              <Pill key={inv.key} size="sm" active tone="success" title={inv.full}>
                {inv.key}
              </Pill>
            ))}
          </Row>
          <Stack gap={4}>
            <Text weight="semibold">{story.statement}</Text>
            <Text size="small" tone="secondary" italic>
              {story.invest_notes}
            </Text>
          </Stack>
          <Divider />
          <H3>Criterios de Aceptación</H3>
          <Stack gap={8}>
            {story.scenarios.map((sc) => (
              <ScenarioBlock key={sc.type} scenario={sc} />
            ))}
          </Stack>
        </Stack>
      </CardBody>
    </Card>
  );
}

export default function LTIUserStories() {
  const [selectedModule, setSelectedModule] = useCanvasState<string>(
    "module",
    "all"
  );
  const [selectedPersona, setSelectedPersona] = useCanvasState<string>(
    "persona",
    "all"
  );

  const filtered = STORIES.filter((s) => {
    const moduleMatch =
      selectedModule === "all" || s.module === selectedModule;
    const personaMatch =
      selectedPersona === "all" || s.persona === selectedPersona;
    return moduleMatch && personaMatch;
  });

  return (
    <Stack gap={20}>
      {/* Header */}
      <Stack gap={4}>
        <H1>Historias de Usuario — LTI ATS</H1>
        <Text tone="secondary">
          24 historias · 6 módulos · 72 criterios de aceptación (happy path,
          error, edge case) · INVEST validado
        </Text>
      </Stack>

      {/* Summary stats */}
      <Grid columns={4} gap={12}>
        <Stat value="24" label="Historias de usuario" />
        <Stat value="6" label="Módulos del producto" />
        <Stat value="72" label="Criterios de aceptación" />
        <Stat value="100%" label="INVEST compliant" tone="success" />
      </Grid>

      <Divider />

      {/* Filters */}
      <Stack gap={10}>
        <Stack gap={6}>
          <Text size="small" tone="secondary" weight="semibold">
            FILTRAR POR MÓDULO
          </Text>
          <Row gap={6} wrap>
            <Pill
              active={selectedModule === "all"}
              onClick={() => setSelectedModule("all")}
            >
              Todos
            </Pill>
            {MODULES.map((m) => (
              <Pill
                key={m}
                active={selectedModule === m}
                onClick={() => setSelectedModule(m)}
              >
                {MODULE_SHORTS[m]}
              </Pill>
            ))}
          </Row>
        </Stack>
        <Stack gap={6}>
          <Text size="small" tone="secondary" weight="semibold">
            FILTRAR POR PERSONA
          </Text>
          <Row gap={6} wrap>
            <Pill
              active={selectedPersona === "all"}
              onClick={() => setSelectedPersona("all")}
            >
              Todas
            </Pill>
            {PERSONAS.map((p) => (
              <Pill
                key={p}
                active={selectedPersona === p}
                onClick={() => setSelectedPersona(p)}
              >
                {p}
              </Pill>
            ))}
          </Row>
        </Stack>
      </Stack>

      <Divider />

      {/* INVEST legend */}
      <Stack gap={6}>
        <Text size="small" tone="secondary" weight="semibold">
          CRITERIOS INVEST — todas las historias cumplen los 6 criterios
        </Text>
        <Row gap={8} wrap>
          {INVEST_LABELS.map((inv) => (
            <Row key={inv.key} gap={4} align="center">
              <Pill size="sm" active tone="success">
                {inv.key}
              </Pill>
              <Text size="small" tone="secondary">
                {inv.full}
              </Text>
            </Row>
          ))}
        </Row>
        <Text size="small" tone="tertiary">
          Cada historia incluye: notas de validación INVEST · 1 happy path · 1
          escenario de error · 1 edge case de QA
        </Text>
      </Stack>

      <Divider />

      {/* Stories count */}
      <Row align="center">
        <Text weight="semibold">
          {filtered.length}{" "}
          {filtered.length === 1 ? "historia" : "historias"} mostradas
        </Text>
        <Spacer />
        <Text size="small" tone="secondary">
          Haz clic en una historia para ver sus criterios de aceptación
        </Text>
      </Row>

      {/* Story cards */}
      {filtered.length === 0 ? (
        <Callout tone="neutral" title="Sin resultados">
          No hay historias que coincidan con los filtros seleccionados.
        </Callout>
      ) : (
        <Stack gap={6}>
          {filtered.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </Stack>
      )}
    </Stack>
  );
}
