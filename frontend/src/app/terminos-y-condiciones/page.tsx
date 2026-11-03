'use client'

import { useState } from 'react'
import Link from 'next/link'

interface SubSection {
  id: string
  title: string
  paragraphs: string[]
  list?: { label?: string; text: string }[]
  afterListParagraphs?: string[]
  hasDefectFlowchart?: boolean
}

interface Chapter {
  id: string
  anchor?: string
  number: string
  title: string
  icon: string
  subsections: SubSection[]
}

const CHAPTERS: Chapter[] = [
  {
    id: 'capitulo-1',
    number: '1',
    title: 'Disposiciones generales',
    icon: 'gavel',
    subsections: [
      {
        id: '1.1',
        title: '1.1. Identificación de la empresa',
        paragraphs: [
          'Los presentes Términos y Condiciones regulan el acceso, navegación y uso del sitio web, así como las condiciones aplicables a la contratación de los servicios y adquisición de los productos ofrecidos a través de los canales digitales de DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C., en adelante, “LA EMPRESA” o “LA CLÍNICA”.',
          'DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. es una empresa constituida conforme a las leyes de la República del Perú, identificada con RUC N.° 20553756074, con domicilio legal en Av. José Gálvez Barrenechea Nro. 127 Int. 604, San Isidro, Lima, Perú.',
          'A través de sus canales de atención, LA CLÍNICA brinda servicios relacionados con dermatología, consultas médicas, procedimientos dermatológicos y tratamientos especializados, incluyendo aquellos realizados por la Dra. Marcela Leyva, médico principal de la clínica, así como la comercialización de productos dermatológicos.',
          'La utilización del sitio web y la contratación de cualquiera de los servicios o productos ofrecidos por LA CLÍNICA se encuentran sujetos a los presentes Términos y Condiciones, así como a las disposiciones legales y reglamentarias aplicables en la República del Perú.',
        ],
      },
      {
        id: '1.2',
        title: '1.2. Datos de contacto',
        paragraphs: [
          'Para efectos de consultas, coordinación de servicios, reservas, solicitudes relacionadas con productos y demás comunicaciones vinculadas con los servicios ofrecidos por LA CLÍNICA, los usuarios podrán utilizar los canales oficiales de atención puestos a disposición por la empresa.',
          'El número principal de atención de LA CLÍNICA es: Teléfono / WhatsApp: +51 996 235 890.',
          'Asimismo, LA CLÍNICA podrá poner a disposición de los usuarios otros canales oficiales de comunicación, incluyendo correo electrónico (dclaserconsultorio@gmail.com), redes sociales, formularios de contacto u otros medios digitales que sean publicados directamente en el sitio web.',
          'Los usuarios deberán verificar que las comunicaciones relacionadas con pagos, reservas, productos o servicios provengan de los canales oficiales de LA CLÍNICA.',
        ],
      },
      {
        id: '1.3',
        title: '1.3. Titularidad y administración del sitio web',
        paragraphs: [
          'El sitio web https://www.draleyva.com, así como su contenido, estructura, diseño, elementos gráficos, logotipos, signos distintivos, fotografías, textos, material audiovisual, funcionalidades y demás elementos que lo integran, son de titularidad de LA CLÍNICA o son utilizados legítimamente por esta.',
          'LA CLÍNICA es responsable de la administración y gestión del sitio web y podrá realizar modificaciones, actualizaciones, mejoras, mantenimientos o cambios en sus contenidos y funcionalidades, de acuerdo con sus necesidades operativas, comerciales, tecnológicas o legales.',
          'El acceso al sitio web no implica, en ningún caso, la transferencia, cesión o licencia de los derechos de propiedad intelectual de LA CLÍNICA a favor del usuario, salvo autorización expresa y por escrito de la empresa.',
          'El usuario se compromete a utilizar el sitio web exclusivamente para fines lícitos y de acuerdo con los presentes Términos y Condiciones y la legislación peruana aplicable.',
        ],
      },
      {
        id: '1.4',
        title: '1.4. Definiciones',
        paragraphs: [
          'Para efectos de los presentes Términos y Condiciones, las siguientes expresiones tendrán el significado que se indica a continuación:',
        ],
        list: [
          { label: 'a) LA CLÍNICA o LA EMPRESA:', text: 'Se refiere a DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C., titular y/o administradora del sitio web y responsable de los servicios y productos ofrecidos a través de sus canales oficiales.' },
          { label: 'b) SITIO WEB:', text: 'Se refiere al sitio web oficial de LA CLÍNICA, incluyendo sus páginas, secciones, funcionalidades y contenidos disponibles en https://www.draleyva.com.' },
          { label: 'c) USUARIO:', text: 'Persona natural o jurídica que accede, navega, utiliza el sitio web, solicita información, realiza una reserva, contrata un servicio o adquiere un producto ofrecido por LA CLÍNICA.' },
          { label: 'd) PACIENTE:', text: 'Persona natural que recibe o contrata un servicio de atención médica, consulta dermatológica, procedimiento o tratamiento ofrecido por LA CLÍNICA.' },
          { label: 'e) SERVICIOS:', text: 'Comprende las consultas médicas, procedimientos dermatológicos, tratamientos, procedimientos láser y demás servicios de atención ofrecidos por LA CLÍNICA.' },
          { label: 'f) PRODUCTOS:', text: 'Comprende los productos dermatológicos y demás bienes ofrecidos para su adquisición a través de los canales oficiales de LA CLÍNICA.' },
          { label: 'g) RESERVA:', text: 'Solicitud realizada por el usuario para separar un horario disponible para una consulta, procedimiento u otro servicio ofrecido por LA CLÍNICA.' },
          { label: 'h) TÉRMINOS Y CONDICIONES:', text: 'El presente documento, incluyendo sus modificaciones, actualizaciones, anexos o documentos que expresamente formen parte del mismo.' },
          { label: 'i) CANALES OFICIALES:', text: 'Los medios de comunicación y atención habilitados y publicados directamente por LA CLÍNICA para la atención de sus usuarios.' },
        ],
      },
      {
        id: '1.5',
        title: '1.5. Ámbito de aplicación de los Términos y Condiciones',
        paragraphs: [
          'Los presentes Términos y Condiciones son aplicables a todas las personas que accedan o utilicen el sitio web de LA CLÍNICA, así como a quienes soliciten información, realicen reservas, contraten servicios médicos o adquieran productos a través de los canales oficiales de la empresa.',
          'Las disposiciones contenidas en este documento regulan, según corresponda, la navegación y utilización del sitio web, la contratación de servicios, la adquisición de productos, los medios de pago, las reservas, cancelaciones, reprogramaciones, cambios, delivery, atención de reclamos y demás relaciones que se establezcan entre LA CLÍNICA y sus usuarios.',
          'Determinados servicios, procedimientos o productos podrán estar sujetos a condiciones específicas adicionales. Cuando corresponda, dichas condiciones serán comunicadas al usuario antes de la contratación o adquisición y formarán parte de las condiciones aplicables a la operación correspondiente.',
          'En caso de existir disposiciones legales de carácter obligatorio que resulten aplicables a una determinada relación con el usuario, estas prevalecerán sobre cualquier disposición de los presentes Términos y Condiciones que resulte incompatible con ellas.',
        ],
      },
      {
        id: '1.6',
        title: '1.6. Aceptación de los Términos y Condiciones',
        paragraphs: [
          'El acceso y uso del sitio web, así como la contratación de servicios o adquisición de productos a través de los canales oficiales de LA CLÍNICA, implican que el usuario declara haber leído y comprendido los presentes Términos y Condiciones y, cuando corresponda, acepta quedar sujeto a sus disposiciones.',
          'Cuando la contratación o adquisición requiera una aceptación expresa, esta podrá realizarse mediante mecanismos digitales habilitados por LA CLÍNICA, incluyendo casillas de aceptación, botones, formularios, confirmaciones electrónicas u otros mecanismos que permitan acreditar la manifestación de voluntad del usuario.',
          'La aceptación de estos Términos y Condiciones no limita ni elimina los derechos que correspondan al usuario en virtud de las normas imperativas de protección al consumidor, legislación sanitaria, protección de datos personales u otras disposiciones aplicables.',
          'En caso de que el usuario no esté de acuerdo con alguna de las disposiciones de estos Términos y Condiciones, deberá abstenerse de utilizar aquellos servicios o funcionalidades para los cuales dicha aceptación sea necesaria.',
        ],
      },
      {
        id: '1.7',
        title: '1.7. Capacidad legal del usuario',
        paragraphs: [
          'El usuario declara que cuenta con capacidad legal suficiente para utilizar el sitio web y, cuando corresponda, contratar los servicios o adquirir los productos ofrecidos por LA CLÍNICA.',
          'Cuando una persona actúe en representación de otra persona natural o jurídica, declara contar con las facultades necesarias para realizar dicha actuación y asumir las obligaciones correspondientes.',
          'En el caso de servicios médicos, la atención y los procedimientos estarán sujetos, además, a las condiciones y requisitos propios de la prestación de servicios de salud, incluyendo, cuando corresponda, la evaluación médica previa y la obtención del consentimiento informado.',
          'Cuando el usuario proporcione información a LA CLÍNICA, se compromete a proporcionar información verdadera, completa y actualizada, en la medida en que ello sea necesario para la correcta prestación del servicio o atención solicitada.',
          'La utilización del sitio web por parte de menores de edad estará sujeta a las condiciones y autorizaciones que correspondan conforme a la legislación peruana y a la naturaleza del servicio solicitado.',
        ],
      },
    ],
  },
  {
    id: 'capitulo-2',
    number: '2',
    title: 'Finalidad y alcance del sitio web',
    icon: 'language',
    subsections: [
      {
        id: '2.1',
        title: '2.1. Información general de la clínica',
        paragraphs: [
          'El sitio web www.draleyva.com, en adelante, el “Sitio Web”, tiene como finalidad brindar a los usuarios información sobre DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C., sus servicios médicos, procedimientos dermatológicos, tratamientos, productos y demás actividades ofrecidas por la empresa.',
          'A través del Sitio Web, los usuarios podrán acceder a información relacionada con los servicios de dermatología clínica y quirúrgica, tratamientos y procedimientos con tecnología láser, servicios de estética y rejuvenecimiento, así como a los productos dermocosméticos que se encuentren disponibles para su adquisición.',
          'Asimismo, el Sitio Web podrá permitir al usuario realizar solicitudes de información, comunicarse con DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C., solicitar o gestionar una cita, consultar información sobre los servicios disponibles y, cuando corresponda, adquirir productos ofrecidos a través de los canales habilitados por la empresa.',
        ],
      },
      {
        id: '2.2',
        title: '2.2. Información sobre servicios dermatológicos',
        paragraphs: [
          'La información publicada en el Sitio Web tiene como finalidad proporcionar al usuario una descripción general de los servicios y procedimientos ofrecidos por DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C.',
          'La información relacionada con tratamientos, procedimientos, tecnologías, productos, indicaciones, beneficios, características o resultados debe entenderse como información general y orientativa, y no constituye por sí misma un diagnóstico médico, una prescripción médica ni una garantía de obtención de un resultado determinado.',
          'La indicación de un tratamiento o procedimiento dependerá de la evaluación y criterio del profesional médico correspondiente, considerando las características, antecedentes, necesidades y condiciones particulares de cada paciente.',
          'En consecuencia, la información disponible en el Sitio Web no sustituye una evaluación médica ni debe ser utilizada por el usuario para iniciar, modificar o suspender un tratamiento médico por cuenta propia.',
        ],
      },
      {
        id: '2.3',
        title: '2.3. Consultas y atención médica',
        paragraphs: [
          'Los usuarios podrán solicitar información o reservar consultas médicas ofrecidas por DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C., de acuerdo con la disponibilidad de horarios y las condiciones establecidas por la empresa.',
          'Las consultas y atenciones médicas se encuentran relacionadas con la atención profesional de la Dra. Marcela Leyva, médico principal de DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C., de acuerdo con la disponibilidad y programación comunicada al usuario.',
          'La solicitud o reserva de una cita no implica necesariamente la indicación de un procedimiento o tratamiento determinado. La decisión sobre la pertinencia de un tratamiento, procedimiento o intervención corresponderá al profesional médico, de acuerdo con la evaluación realizada y las condiciones particulares del paciente.',
          'Cuando la naturaleza del servicio lo requiera, el paciente deberá proporcionar información relevante para su adecuada evaluación y seguir las indicaciones médicas que le sean comunicadas.',
        ],
      },
      {
        id: '2.4',
        title: '2.4. Procedimientos y tratamientos dermatológicos',
        paragraphs: [
          'DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. podrá ofrecer diferentes procedimientos y tratamientos relacionados con dermatología clínica, dermatología quirúrgica, tecnología láser, estética y rejuvenecimiento, de acuerdo con los servicios que se encuentren disponibles y publicados en el Sitio Web.',
          'La disponibilidad, indicación y realización de cada procedimiento estará sujeta a la evaluación médica correspondiente y a las condiciones particulares de cada paciente.',
          'La información publicada sobre los procedimientos, incluyendo sus características, beneficios, fotografías, resultados referenciales o cualquier otra información relacionada, no deberá interpretarse como una promesa, garantía o compromiso de obtener un resultado específico.',
          'Los resultados de un tratamiento o procedimiento pueden variar entre pacientes debido, entre otros factores, a sus características individuales, condición de salud, respuesta al tratamiento, cumplimiento de las indicaciones médicas, cuidados posteriores y demás circunstancias que puedan influir en su evolución.',
          'Cuando corresponda, antes de la realización de determinados procedimientos se podrá requerir la evaluación médica previa y la suscripción del consentimiento informado correspondiente.',
        ],
      },
      {
        id: '2.5',
        title: '2.5. Productos dermatológicos y dermocosméticos',
        paragraphs: [
          'El Sitio Web podrá presentar información y/o permitir la adquisición de productos dermatológicos y dermocosméticos ofrecidos por DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C.',
          'Los productos se encontrarán sujetos a disponibilidad de stock, condiciones de comercialización, presentación, contenido y demás características que sean informadas al usuario al momento de la compra.',
          'La información publicada sobre cada producto tiene carácter informativo y deberá ser complementada, cuando corresponda, con las indicaciones, advertencias, instrucciones de uso y demás información proporcionada por el titular correspondiente.',
          'Cuando un producto sea recomendado en el contexto de una atención médica, el usuario deberá seguir las indicaciones proporcionadas por el profesional de salud y consultar previamente cualquier duda relacionada con su utilización.',
          'Las condiciones específicas relacionadas con precios, pagos, cambios, garantías, y delivery se encuentran reguladas en los capítulos correspondientes de los presentes Términos y Condiciones.',
        ],
      },
      {
        id: '2.6',
        title: '2.6. Información médica de carácter referencial',
        paragraphs: [
          'El contenido médico, dermatológico, científico o educativo publicado en el Sitio Web tiene carácter general e informativo y está destinado a facilitar al usuario el conocimiento de determinados temas relacionados con dermatología y cuidado de la piel.',
          'Dicha información no constituye una relación médico-paciente por el solo hecho de ser consultada, ni reemplaza una evaluación médica individual.',
          'El usuario no deberá utilizar la información publicada en el Sitio Web como único fundamento para realizar un diagnóstico, automedicarse, iniciar un tratamiento o modificar las indicaciones recibidas de un profesional de la salud.',
          'Ante la existencia de síntomas, dudas o condiciones particulares de salud, el usuario deberá solicitar una evaluación profesional.',
        ],
      },
      {
        id: '2.7',
        title: '2.7. Reservas y solicitudes de atención',
        paragraphs: [
          'El Sitio Web podrá habilitar mecanismos para solicitar o gestionar reservas de consultas y procedimientos, de acuerdo con la disponibilidad de horarios establecida por DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C.',
          'La solicitud de una cita estará sujeta a la disponibilidad correspondiente y, cuando resulte aplicable, a la confirmación del pago y demás requisitos establecidos por la empresa.',
          'La información mostrada en el Sitio Web respecto de horarios, servicios, precios, disponibilidad u otras condiciones podrá ser actualizada por DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. conforme a sus necesidades operativas.',
          'Las condiciones específicas aplicables a las reservas, reprogramaciones, cancelaciones e inasistencias serán desarrolladas en el capítulo correspondiente de estos Términos y Condiciones.',
        ],
      },
      {
        id: '2.8',
        title: '2.8. Comunicaciones mediante WhatsApp, Facebook y otros canales oficiales',
        paragraphs: [
          'DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. podrá utilizar diferentes canales digitales para facilitar la comunicación con sus usuarios, incluyendo WhatsApp, Facebook y otros medios que sean publicados oficialmente en el Sitio Web.',
          'Estos canales podrán utilizarse, según corresponda, para brindar información, atender consultas, coordinar citas, confirmar reservas, proporcionar información sobre productos, coordinar entregas y realizar otras comunicaciones relacionadas con los servicios de la empresa.',
          'La utilización de plataformas de terceros, como WhatsApp o Facebook, se encuentra adicionalmente sujeta a los términos, condiciones y políticas de privacidad establecidos por los respectivos proveedores de dichas plataformas.',
          'El usuario deberá verificar que las comunicaciones, promociones, solicitudes de pago o demás mensajes que reciba correspondan a los canales oficiales de DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C.',
          'La empresa no será responsable por comunicaciones realizadas por terceros que se hagan pasar por representantes de la empresa, cuando estas hayan sido realizadas mediante cuentas, números, perfiles o canales que no hayan sido publicados oficialmente por DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C., sin perjuicio de las medidas que correspondan cuando la empresa tenga conocimiento de dichas situaciones.',
        ],
      },
      {
        id: '2.9',
        title: '2.9. Disponibilidad y funcionamiento del Sitio Web',
        paragraphs: [
          'DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. realizará esfuerzos razonables para mantener el funcionamiento y disponibilidad del Sitio Web. Sin embargo, el usuario reconoce que pueden presentarse circunstancias que ocasionen interrupciones, errores, restricciones o indisponibilidad temporal de determinadas funcionalidades.',
          'Estas situaciones pueden incluir, entre otras, labores de mantenimiento, actualizaciones, fallas técnicas, problemas de conectividad, interrupciones de servicios de terceros, eventos de fuerza mayor, incidentes de seguridad informática u otras circunstancias que se encuentren fuera del control razonable de la empresa.',
          'La empresa podrá realizar modificaciones, actualizaciones, mejoras, suspensiones temporales o cambios en las funcionalidades del Sitio Web cuando resulte necesario para su mantenimiento, seguridad, funcionamiento, actualización tecnológica o cumplimiento de obligaciones legales.',
          'Lo anterior se entiende sin perjuicio de los derechos que correspondan a los usuarios conforme a la legislación peruana aplicable.',
        ],
      },
    ],
  },
  {
    id: 'capitulo-3',
    number: '3',
    title: 'Citas, Reservas, Cancelaciones y Reprogramaciones',
    icon: 'calendar_month',
    subsections: [
      {
        id: '3.1',
        title: '3.1. Reserva de citas',
        paragraphs: [
          'Las citas médicas ofrecidas por DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. podrán ser solicitadas y reservadas por los canales oficiales de atención habilitados por la empresa, principalmente mediante WhatsApp, Sitio Web y llamada telefónica.',
          'La reserva estará sujeta a la disponibilidad de horarios de la Dra. Marcela Leyva y a la información proporcionada por el paciente al momento de solicitar la cita.',
          'La reserva de una cita no requiere el pago anticipado del servicio. El paciente podrá realizar el pago correspondiente directamente en el establecimiento, de acuerdo con las condiciones y medios de pago disponibles al momento de su atención.',
          'La reserva de una cita representa la asignación de un horario para la atención solicitada, pero no implica la indicación, aprobación o realización automática de un procedimiento médico determinado.',
        ],
      },
      {
        id: '3.2',
        title: '3.2. Confirmación de las citas',
        paragraphs: [
          'DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. podrá comunicarse con el paciente antes de la fecha programada para confirmar su asistencia a la cita.',
          'La confirmación podrá realizarse mediante los canales de contacto proporcionados por el paciente, incluyendo WhatsApp o llamada telefónica.',
          'El paciente deberá proporcionar información de contacto válida y mantenerla actualizada para facilitar las comunicaciones relacionadas con su cita.',
          'La confirmación realizada por la clínica tiene como finalidad verificar la asistencia del paciente y facilitar la organización de la agenda médica.',
        ],
      },
      {
        id: '3.3',
        title: '3.3. Reprogramación de citas',
        paragraphs: [
          'El paciente podrá solicitar la reprogramación de su cita sin costo adicional, siempre que exista disponibilidad de horarios.',
          'La solicitud de reprogramación podrá realizarse mediante los canales oficiales de atención de DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C., incluyendo WhatsApp o llamada telefónica.',
          'La reprogramación podrá solicitarse incluso con algunas horas de anticipación respecto del horario originalmente reservado, recomendándose al paciente comunicarlo a la clínica tan pronto como tenga conocimiento de que no podrá asistir.',
          'La nueva fecha y hora estarán sujetas a la disponibilidad de los médicos que trabajan en la clínica.',
        ],
      },
      {
        id: '3.4',
        title: '3.4. Cancelación de citas',
        paragraphs: [
          'El paciente podrá cancelar una cita previamente reservada comunicándose con DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. mediante sus canales oficiales.',
          'Debido a que las citas no requieren pago anticipado, la cancelación de una cita no generará, por regla general, un procedimiento de devolución de dinero.',
          'Cuando el paciente cancele su cita, podrá solicitar una nueva fecha de atención, sujeta a la disponibilidad de horarios de la clínica.',
          'Se recomienda que las cancelaciones sean comunicadas con la mayor anticipación posible, a fin de permitir que el horario pueda ser asignado a otro paciente.',
        ],
      },
      {
        id: '3.5',
        title: '3.5. Inasistencia a la cita',
        paragraphs: [
          'En caso de que el paciente no se presente a la cita previamente reservada y no haya comunicado su cancelación o reprogramación, podrá solicitar posteriormente una nueva cita.',
          'La nueva reserva estará sujeta a la disponibilidad de horarios de la Dra. Marcela Leyva.',
          'La inasistencia no genera por sí misma un cargo económico, penalidad o devolución, considerando que las citas no requieren pago anticipado.',
          'DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. podrá adoptar medidas razonables de organización de su agenda cuando se presenten reiteradas inasistencias o reservas que afecten injustificadamente la disponibilidad de horarios para otros pacientes.',
        ],
      },
      {
        id: '3.6',
        title: '3.6. Tolerancia y puntualidad',
        paragraphs: [
          'Se establece un tiempo máximo de tolerancia de diez (10) minutos respecto de la hora programada para la cita.',
          'El paciente deberá procurar presentarse con la anticipación suficiente para cumplir con los procedimientos administrativos o de admisión que correspondan.',
          'Transcurrido el periodo de tolerancia de diez (10) minutos, la atención podrá verse afectada, reprogramarse o, dependiendo de la disponibilidad de la agenda médica, no llegar a realizarse.',
          'La aplicación de esta regla deberá considerar las circunstancias particulares de cada caso y no impedirá que la clínica adopte las medidas que correspondan cuando existan situaciones justificadas o circunstancias excepcionales.',
        ],
      },
      {
        id: '3.7',
        title: '3.7. Cancelación o reprogramación por parte de la clínica',
        paragraphs: [
          'DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. podrá cancelar o reprogramar una cita cuando existan circunstancias que impidan o dificulten razonablemente la atención en el horario previamente establecido.',
          'En estos casos, la clínica comunicará al paciente la situación a través de los canales de contacto disponibles y procurará ofrecer una nueva fecha y horario de atención.',
          'La reprogramación se realizará sin costo adicional para el paciente.',
          'Cuando corresponda y exista un pago previamente efectuado por un servicio que no pueda ser prestado, se aplicarán las condiciones de cambio y/o reemplazo que resulten legalmente aplicables y las condiciones específicas comunicadas al paciente.',
        ],
      },
      {
        id: '3.8',
        title: '3.8. Evaluación médica previa a procedimientos',
        paragraphs: [
          'La reserva o solicitud de un procedimiento dermatológico, estético, quirúrgico o realizado mediante tecnología láser no implica que dicho procedimiento será necesariamente realizado.',
          'Todo procedimiento deberá estar precedido por una evaluación médica que permita determinar la condición del paciente, sus necesidades particulares, la pertinencia del procedimiento solicitado y la alternativa de tratamiento que corresponda.',
          'La Dra. Marcela Leyva, de acuerdo con su evaluación y criterio médico, determinará si el procedimiento solicitado resulta adecuado para el paciente y podrá recomendar una alternativa diferente cuando las condiciones clínicas así lo requieran.',
          'Por ello, el paciente no deberá interpretar la información publicada en el Sitio Web, una consulta realizada por medios digitales o una reserva como una indicación médica definitiva para la realización de un procedimiento.',
        ],
      },
      {
        id: '3.9',
        title: '3.9. Exámenes y requisitos médicos',
        paragraphs: [
          'Dependiendo de las características del paciente, del diagnóstico y del procedimiento que se considere realizar, la Dra. Marcela Leyva podrá solicitar exámenes médicos, evaluaciones complementarias u otros requisitos previos.',
          'Cuando se requieran dichos exámenes o evaluaciones, el procedimiento podrá quedar sujeto a la presentación y revisión de los resultados correspondientes, así como a la determinación médica sobre la pertinencia y seguridad de su realización.',
          'El paciente deberá proporcionar información veraz, completa y relevante sobre sus antecedentes y condiciones de salud que puedan resultar pertinentes para su evaluación médica.',
          'La solicitud de exámenes adicionales no implica necesariamente que el procedimiento será realizado, dado que la decisión final dependerá de la evaluación médica correspondiente.',
        ],
      },
      {
        id: '3.10',
        title: '3.10. Consentimiento informado',
        paragraphs: [
          'Antes de la realización de los procedimientos médicos que correspondan, el paciente deberá recibir la información necesaria sobre el procedimiento y, cuando resulte aplicable, deberá otorgar el consentimiento informado correspondiente.',
          'El consentimiento informado deberá ser otorgado de conformidad con la legislación peruana aplicable y con las condiciones propias del procedimiento.',
          'La suscripción del consentimiento informado tiene como finalidad dejar constancia de que el paciente recibió la información correspondiente y manifestó su voluntad respecto de la realización del procedimiento, sin que ello implique una garantía de obtención de un resultado médico o estético determinado.',
        ],
      },
      {
        id: '3.11',
        title: '3.11. No atención de emergencias',
        paragraphs: [
          'DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. no brinda servicios de atención de emergencias médicas.',
          'Las consultas y procedimientos ofrecidos por la clínica corresponden a servicios de atención dermatológica previamente programados y sujetos a evaluación médica.',
          'Cuando una persona presente una situación que razonablemente pueda constituir una emergencia médica, deberá acudir inmediatamente al establecimiento de salud o servicio de emergencia que corresponda, de acuerdo con la naturaleza y gravedad de la situación.',
          'La información proporcionada a través del Sitio Web, WhatsApp, llamadas telefónicas u otros canales digitales de la clínica no sustituye la atención médica de emergencia.',
        ],
      },
      {
        id: '3.12',
        title: '3.12. Condiciones especiales de determinados procedimientos',
        paragraphs: [
          'Algunos procedimientos podrán estar sujetos a condiciones, preparaciones, evaluaciones, exámenes, indicaciones previas o posteriores y demás requisitos específicos determinados por la profesional médica responsable.',
          'Estas condiciones podrán ser comunicadas al paciente durante la consulta, antes de la realización del procedimiento o mediante los canales oficiales de comunicación de DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C.',
          'El paciente se compromete a seguir las indicaciones médicas que le sean proporcionadas y a informar oportunamente cualquier circunstancia que pueda resultar relevante para la realización segura del procedimiento.',
          'Las condiciones específicas de cada procedimiento podrán variar según las características y necesidades particulares de cada paciente.',
        ],
      },
    ],
  },
  {
    id: 'capitulo-4',
    number: '4',
    title: 'Productos, Precios y Medios de Pago',
    icon: 'shopping_bag',
    subsections: [
      {
        id: '4.1',
        title: '4.1. Productos ofrecidos',
        paragraphs: [
          'DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. podrá ofrecer a través de su Sitio Web, sus canales digitales y/o directamente en su establecimiento productos dermatológicos y dermocosméticos disponibles para adquisición por parte de los usuarios.',
          'La información publicada respecto de los productos podrá incluir, según corresponda, su denominación, características, presentación, contenido, precio, y demás información relevante para su adquisición.',
          'La comercialización de los productos estará sujeta a su disponibilidad y stock al momento de la solicitud realizada por el usuario.',
        ],
      },
      {
        id: '4.2',
        title: '4.2. Solicitud y confirmación de disponibilidad',
        paragraphs: [
          'La visualización de un producto en el Sitio Web no constituye por sí misma una confirmación de disponibilidad ni perfecciona una compraventa.',
          'El usuario podrá solicitar la adquisición de un producto a través de los canales habilitados por DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. Una vez recibida la solicitud, la clínica verificará la disponibilidad del producto.',
          'La compra podrá ser concretada una vez que DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. haya confirmado al usuario la disponibilidad del producto y las condiciones correspondientes para efectuar el pago.',
          'En caso de que un producto se encuentre agotado o temporalmente no disponible, la empresa informará dicha circunstancia al usuario a través de los canales correspondientes y, cuando resulte aplicable, actualizará la información publicada en el Sitio Web.',
        ],
      },
      {
        id: '4.3',
        title: '4.3. Precios e impuestos',
        paragraphs: [
          'Los precios de los productos publicados por DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. en el Sitio Web incluyen el Impuesto General a las Ventas (IGV) y corresponden a los precios vigentes informados por la empresa.',
          'Los precios publicados en el Sitio Web serán los mismos que los establecidos para la venta de los productos en el establecimiento de DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C., salvo que se comunique expresamente una promoción, descuento o condición comercial particular.',
          'Antes de realizar el pago, el usuario podrá conocer el importe correspondiente al producto solicitado y las condiciones aplicables a la operación.',
        ],
      },
      {
        id: '4.4',
        title: '4.4. Promociones, descuentos y condiciones comerciales',
        paragraphs: [
          'DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. podrá establecer promociones, descuentos u otras condiciones comerciales especiales para determinados productos o periodos.',
          'Las promociones estarán sujetas a las condiciones, vigencia, disponibilidad y demás restricciones que sean informadas al usuario.',
          'La finalización o modificación de una promoción no afectará las compras que hayan sido previamente confirmadas y pagadas durante su periodo de vigencia, salvo que una disposición legal establezca lo contrario.',
        ],
      },
      {
        id: '4.5',
        title: '4.5. Disponibilidad y stock',
        paragraphs: [
          'La disponibilidad de los productos estará sujeta al stock existente al momento de la solicitud. DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. procurará mantener actualizada la información sobre disponibilidad de sus productos en el Sitio Web. Sin embargo, debido a la naturaleza de las operaciones comerciales y a la posibilidad de ventas simultáneas, un producto podría agotarse antes de que la información sea actualizada.',
          'Cuando un producto solicitado no se encuentre disponible, la clínica comunicará dicha circunstancia al usuario antes de efectuar el pago correspondiente.',
          'La falta de disponibilidad de un producto no genera obligación de sustitución por otro producto diferente, salvo acuerdo expreso con el usuario o cuando corresponda conforme a la legislación aplicable.',
        ],
      },
      {
        id: '4.6',
        title: '4.6. Condiciones de compra',
        paragraphs: [
          'La adquisición de un producto seguirá, en términos generales, el siguiente procedimiento:',
        ],
        list: [
          { label: 'a)', text: 'El usuario identifica y solicita el producto a través del Sitio Web, WhatsApp, llamada telefónica, directamente en el establecimiento u otro canal oficial habilitado.' },
          { label: 'b)', text: 'DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. verifica la disponibilidad del producto solicitado.' },
          { label: 'c)', text: 'La clínica comunica al usuario la disponibilidad y el importe correspondiente.' },
          { label: 'd)', text: 'El usuario realiza el pago por alguno de los medios habilitados.' },
          { label: 'e)', text: 'DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. confirma la operación y procede, según corresponda, con la entrega o puesta a disposición del producto adquirido.' },
        ],
        afterListParagraphs: [
          'La compra se considerará concretada una vez que la disponibilidad haya sido confirmada y el pago correspondiente haya sido efectuado y validado por la empresa.',
        ],
      },
      {
        id: '4.7',
        title: '4.7. Medios de pago',
        paragraphs: [
          'DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. podrá aceptar los siguientes medios de pago:',
        ],
        list: [
          { label: 'a)', text: 'Tarjetas de crédito y débito.' },
          { label: 'b)', text: 'Yape (QR).' },
          { label: 'c)', text: 'Plin (QR).' },
          { label: 'd)', text: 'Transferencia bancaria.' },
          { label: 'e)', text: 'Efectivo.' },
          { label: 'f)', text: 'Pago mediante POS disponible en el establecimiento.' },
        ],
        afterListParagraphs: [
          'La disponibilidad de determinados medios de pago podrá depender del canal utilizado para realizar la compra.',
          'El usuario deberá proporcionar la información necesaria para procesar correctamente la operación y será responsable de verificar que los datos proporcionados sean correctos.',
        ],
      },
      {
        id: '4.8',
        title: '4.8. Pagos únicos y pago íntegro',
        paragraphs: [
          'Los productos ofrecidos por DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. deberán ser pagados por el importe total correspondiente a la compra.',
          'Las operaciones de compra de productos no constituyen suscripciones, membresías ni contratos de pago periódico o mensual.',
          'DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. no realizará cargos periódicos o automáticos asociados a la adquisición de un producto, salvo que en el futuro se establezca expresamente una modalidad diferente y esta sea informada y aceptada por el usuario conforme a la legislación aplicable.',
        ],
      },
      {
        id: '4.9',
        title: '4.9. Pagos rechazados o no procesados',
        paragraphs: [
          'Cuando una operación de pago realizada a través de un medio electrónico no pueda ser procesada, sea rechazada o presente algún inconveniente técnico, la compra no se considerará pagada hasta que el importe correspondiente haya sido efectivamente recibido y validado por DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C.',
          'En estos casos, el usuario podrá comunicarse con la clínica a través del canal oficial de WhatsApp para recibir información sobre medios de pago alternativos disponibles y, de ser posible, completar la adquisición del producto.',
          'La empresa no será responsable por el rechazo de una operación cuando este sea atribuible a la entidad financiera, proveedor del medio de pago, plataforma tecnológica o circunstancias ajenas al control razonable de DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C.',
        ],
      },
      {
        id: '4.10',
        title: '4.10. Comprobantes de pago',
        paragraphs: [
          'Por las operaciones realizadas, DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. emitirá el comprobante de pago que corresponda conforme a la normativa tributaria peruana.',
          'Dependiendo de la naturaleza de la operación y de la información proporcionada por el usuario, la empresa podrá emitir boleta de venta o factura, de acuerdo con las disposiciones tributarias aplicables.',
          'El usuario deberá proporcionar información correcta y completa para la emisión del comprobante de pago correspondiente.',
        ],
      },
      {
        id: '4.11',
        title: '4.11. Modificación de precios',
        paragraphs: [
          'DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. podrá modificar los precios de sus productos cuando lo considere necesario, incluyendo por razones comerciales, cambios en costos, condiciones del mercado, promociones, disponibilidad u otras circunstancias.',
          'Las modificaciones de precios serán aplicables desde la fecha en que sean publicadas o comunicadas por la empresa y no afectarán las compras que hayan sido previamente confirmadas y pagadas.',
          'En consecuencia, cuando el usuario haya concretado una compra y efectuado el pago correspondiente, una modificación posterior del precio no dará lugar a un cobro adicional ni afectará el precio efectivamente pagado por dicha operación.',
        ],
      },
      {
        id: '4.12',
        title: '4.12. Errores en la información publicada',
        paragraphs: [
          'DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. procurará que la información publicada en el Sitio Web sea clara, precisa y actualizada.',
          'En caso de detectarse errores manifiestos en la información de un producto, incluyendo errores evidentes en el precio, descripción o características, la empresa podrá realizar las correcciones correspondientes y comunicarlas al usuario cuando estas resulten relevantes para una operación en curso.',
          'Las medidas que correspondan ante un error en la información publicada se aplicarán respetando los derechos reconocidos al consumidor por la legislación peruana.',
        ],
      },
      {
        id: '4.13',
        title: '4.13. Entrega y condiciones posteriores a la compra',
        paragraphs: [
          'Una vez confirmada y pagada la compra, el usuario podrá optar por recoger el producto directamente en el establecimiento de DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. o solicitar el servicio de delivery, de acuerdo con las modalidades disponibles.',
          'Cuando el delivery sea gestionado por DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C., este estará sujeto a disponibilidad y tendrá un costo adicional al precio del producto, el cual será determinado de acuerdo con el lugar de destino y comunicado al usuario antes de efectuar el pago correspondiente.',
          'La prestación del servicio de delivery estará sujeta a la disponibilidad de la agenda y horarios de la persona encargada de realizar dicho servicio. Por tal motivo, el usuario deberá coordinar previamente con la empresa la fecha y horario estimados para la entrega.',
          'En caso de que el usuario opte por contratar directamente, por su propia cuenta y responsabilidad, un servicio de delivery o transporte independiente para recoger y trasladar el producto adquirido, dicho servicio será ajeno a DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C.',
          'En estos casos, el usuario será el único responsable de la contratación, coordinación y condiciones del servicio de transporte elegido, así como de los costos que este genere. DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. no asumirá responsabilidad por retrasos, pérdidas, daños, deterioros, extravíos, inconvenientes o cualquier otra incidencia que se produzca durante el transporte cuando esta sea atribuible al servicio de delivery o transporte contratado directamente por el usuario.',
          'Lo anterior se entiende sin perjuicio de las responsabilidades que pudieran corresponder legalmente a DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. respecto del producto antes de su entrega al transportista contratado por el usuario.',
        ],
      },
    ],
  },
  {
    id: 'capitulo-5',
    number: '5',
    title: 'Cambios, Garantías y Devoluciones de Productos',
    icon: 'published_with_changes',
    subsections: [
      {
        id: '5.1',
        title: '5.1. Alcance de la política',
        paragraphs: [
          'La presente política establece las condiciones aplicables a las solicitudes de reemplazo y cambio de los productos dermatológicos y dermocosméticos adquiridos a través de los canales oficiales de DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C.',
          'Las condiciones de devolución voluntaria establecidas en este capítulo se aplican a aquellos casos en los que el usuario solicite devolver un producto por decisión propia, siempre que se cumplan las condiciones establecidas en los presentes Términos y Condiciones.',
          'Las disposiciones relativas a productos defectuosos se regirán por el procedimiento de verificación y cambio establecido en este capítulo, sin perjuicio de los derechos que correspondan al consumidor conforme a la legislación peruana aplicable.',
        ],
      },
      {
        id: '5.2',
        title: '5.2. Devolución voluntaria de productos',
        paragraphs: [
          'El usuario podrá solicitar la devolución de un producto adquirido a DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. dentro de un plazo máximo de dos (2) días hábiles contados desde la fecha de compra, siempre que el producto cumpla íntegramente con las condiciones establecidas en este capítulo.',
          'La devolución voluntaria estará sujeta a la verificación física del producto por parte de la clínica.',
          'El plazo de dos (2) días hábiles constituye el plazo establecido por DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. para aceptar devoluciones voluntarias de productos que se encuentren en las condiciones requeridas para su devolución.',
        ],
      },
      {
        id: '5.3',
        title: '5.3. Condiciones para aceptar una devolución',
        paragraphs: [
          'Para que una devolución voluntaria sea aceptada, el producto deberá cumplir con todas las siguientes condiciones:',
        ],
        list: [
          { label: 'a)', text: 'Encontrarse dentro del plazo máximo de dos (2) días hábiles desde la fecha de compra.' },
          { label: 'b)', text: 'Encontrarse completamente intacto y sin uso.' },
          { label: 'c)', text: 'Conservar su sello de seguridad original, cuando corresponda.' },
          { label: 'd)', text: 'El sello de seguridad no deberá encontrarse abierto, roto, manipulado, alterado o removido.' },
          { label: 'e)', text: 'El producto deberá conservar su presentación y condiciones originales.' },
          { label: 'f)', text: 'No presentar señales de uso, manipulación indebida, deterioro o alteración atribuible al usuario.' },
          { label: 'g)', text: 'Ser presentado físicamente en el establecimiento de DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. para su correspondiente revisión.' },
        ],
        afterListParagraphs: [
          'La aceptación de una solicitud de devolución estará condicionada a la verificación física del producto por parte de la clínica.',
        ],
      },
      {
        id: '5.4',
        title: '5.4. Solicitud y procedimiento de cambio y/o reemplazo del producto o servicio',
        paragraphs: [
          'El usuario podrá solicitar el cambio y/o reemplazo del producto o servicio adquirido cuando corresponda conforme a las condiciones establecidas en los presentes Términos y Condiciones, siempre que se cumplan los requisitos aplicables a cada caso.',
          'La solicitud deberá realizarse a través de los canales oficiales de DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C., pudiendo efectuarse:',
        ],
        list: [
          { label: 'a)', text: 'Comunicándose con DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. mediante su WhatsApp oficial; o' },
          { label: 'b)', text: 'Acudiendo personalmente al establecimiento de la clínica.' },
        ],
        afterListParagraphs: [
          'Para iniciar el procedimiento, el usuario deberá proporcionar la información necesaria para identificar la compra y, cuando se trate de un producto, presentarlo físicamente en el establecimiento de DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. para su correspondiente revisión.',
          'La clínica verificará las condiciones del producto, servicio o solicitud y determinará si corresponde efectuar un cambio o reemplazo, de acuerdo con las condiciones establecidas en los presentes Términos y Condiciones.',
          'Cuando corresponda el cambio o reemplazo, este podrá efectuarse por un producto o servicio de igual valor al originalmente adquirido. Asimismo, el usuario podrá optar por un producto o servicio de mayor valor, en cuyo caso deberá asumir y pagar previamente la diferencia de precio correspondiente.',
          'La realización del cambio o reemplazo estará sujeta a la disponibilidad del producto o servicio solicitado y a las condiciones particulares aplicables a cada caso.',
          'Salvo que una disposición legal de carácter obligatorio establezca lo contrario, las solicitudes de cambio o reemplazo no darán lugar a la devolución del dinero, reembolso o entrega del importe pagado en efectivo o mediante transferencia bancaria, sino que se atenderán mediante el cambio o reemplazo del producto o servicio conforme a las condiciones establecidas en los presentes Términos y Condiciones.',
        ],
      },
      {
        id: '5.5',
        title: '5.5. Productos usados y sello de seguridad alterado',
        paragraphs: [
          'No se aceptarán devoluciones voluntarias de productos que hayan sido utilizados, abiertos o manipulados, o cuyo sello de seguridad haya sido alterado, abierto, roto, removido o deteriorado.',
          'Esta condición responde a la necesidad de garantizar la integridad, seguridad y condiciones de conservación de los productos dermatológicos y dermocosméticos comercializados por DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C.',
          'Lo dispuesto en este apartado se entiende sin perjuicio de los derechos que pudieran corresponder al consumidor cuando se determine la existencia de un defecto, falta de idoneidad u otra circunstancia legalmente relevante atribuible al producto o al proveedor.',
        ],
      },
      {
        id: '5.6',
        title: '5.6. Conservación y manipulación de los productos',
        paragraphs: [
          'El usuario deberá conservar los productos adquiridos de acuerdo con las condiciones de almacenamiento, conservación y utilización indicadas por el fabricante y/o comunicadas por DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C.',
          'No procederá una devolución voluntaria cuando el deterioro o alteración del producto sea consecuencia de una conservación o manipulación inadecuada por parte del usuario, incluyendo, entre otros supuestos:',
        ],
        list: [
          { label: 'a)', text: 'Exposición indebida al calor o a temperaturas incompatibles con las condiciones de conservación del producto.' },
          { label: 'b)', text: 'Exposición excesiva a humedad.' },
          { label: 'c)', text: 'Almacenamiento en condiciones distintas de las indicadas por el fabricante.' },
          { label: 'd)', text: 'Manipulación inadecuada del producto o su envase.' },
          { label: 'e)', text: 'Contaminación del producto ocasionada por una manipulación incorrecta.' },
          { label: 'f)', text: 'Alteración del envase, sello o presentación original.' },
          { label: 'g)', text: 'Cualquier otro deterioro atribuible a un manejo, almacenamiento o conservación inadecuados por parte del usuario.' },
        ],
        afterListParagraphs: [
          'La determinación de estas circunstancias estará sujeta a la revisión física del producto por parte de DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C.',
        ],
      },
      {
        id: '5.7',
        title: '5.7. Productos adquiridos mediante promociones o descuentos',
        paragraphs: [
          'Los productos adquiridos mediante promociones, descuentos, ofertas especiales o condiciones comerciales especiales no estarán sujetos a devolución voluntaria por decisión del usuario.',
          'Esta disposición no limita los derechos que correspondan al consumidor en aquellos casos en los que exista un defecto, falta de idoneidad, incumplimiento de las condiciones ofrecidas u otra circunstancia que genere una obligación legal de garantía o atención por parte del proveedor.',
          'Las condiciones específicas de cada promoción podrán establecer requisitos adicionales, los cuales serán comunicados al usuario antes de concretar la compra.',
        ],
      },
      {
        id: '5.8',
        title: '5.8. Productos defectuosos',
        paragraphs: [
          'Cuando el usuario considere que un producto presenta un defecto, deberá comunicarlo a DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. a través de los canales oficiales disponibles, incluyendo WhatsApp, y presentar físicamente el producto en el establecimiento para su revisión.',
          'El procedimiento aplicable será el siguiente:',
        ],
        hasDefectFlowchart: true,
        afterListParagraphs: [
          'La revisión física permitirá verificar las condiciones del producto y determinar si el defecto informado corresponde efectivamente a una condición atribuible al producto y/o si procede aplicar la garantía o solución correspondiente.',
          'La existencia de un defecto no se determinará únicamente a partir de fotografías, mensajes o descripciones realizadas por el usuario, es necesaria la revisión física del producto.',
        ],
      },
      {
        id: '5.9',
        title: '5.9. Cambio por producto defectuoso',
        paragraphs: [
          'Cuando, luego de la revisión correspondiente, DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. determine que corresponde realizar un cambio por un producto defectuoso, el reemplazo se realizará por otro producto de la misma presentación y cantidad que el producto adquirido originalmente, siempre que se encuentre disponible.',
          'La cantidad deberá corresponder a la presentación original del producto, expresada en la unidad correspondiente, como mililitros (ml), gramos (g) u otra unidad aplicable.',
          'El producto de reemplazo deberá corresponder al mismo producto adquirido originalmente, salvo que una solución diferente sea acordada con el usuario o resulte aplicable conforme a la legislación vigente.',
        ],
      },
      {
        id: '5.10',
        title: '5.10. Falta de disponibilidad del producto de reemplazo',
        paragraphs: [
          'En caso de que DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. determine que corresponde realizar un cambio por producto defectuoso, pero no cuente temporalmente con el mismo producto, la clínica informará al usuario dicha circunstancia.',
          'En este supuesto, el usuario será informado mediante WhatsApp cuando el producto vuelva a encontrarse disponible, a fin de coordinar el reemplazo correspondiente.',
          'La empresa podrá establecer mecanismos razonables de comunicación para informar al usuario sobre la disponibilidad del producto de reemplazo.',
          'Lo anterior se entiende sin perjuicio de los derechos que pudieran corresponder al consumidor conforme a la legislación peruana aplicable.',
        ],
      },
      {
        id: '5.11',
        title: '5.11. Exclusiones de la devolución voluntaria',
        paragraphs: [
          'No procederá la devolución voluntaria cuando se presente cualquiera de las siguientes circunstancias:',
        ],
        list: [
          { label: 'a)', text: 'La solicitud haya sido realizada después de transcurridos los dos (2) días hábiles establecidos para la devolución voluntaria.' },
          { label: 'b)', text: 'El producto haya sido utilizado o abierto.' },
          { label: 'c)', text: 'El sello de seguridad haya sido alterado, abierto, roto, removido o deteriorado.' },
          { label: 'd)', text: 'El producto presente signos de manipulación indebida.' },
          { label: 'e)', text: 'El producto haya sido almacenado incorrectamente.' },
          { label: 'f)', text: 'El producto haya sido expuesto a calor, humedad u otras condiciones incompatibles con las instrucciones de conservación.' },
          { label: 'g)', text: 'El producto presente deterioro atribuible a una manipulación, almacenamiento o conservación inadecuados por parte del usuario.' },
          { label: 'h)', text: 'El producto haya sido adquirido mediante una promoción, descuento u oferta especial, cuando se trate de una devolución voluntaria por decisión del usuario.' },
          { label: 'i)', text: 'El producto no sea presentado físicamente para su correspondiente revisión.' },
          { label: 'j)', text: 'El producto presente alteraciones que impidan verificar razonablemente su estado original.' },
        ],
        afterListParagraphs: [
          'Las exclusiones previstas en esta sección corresponden a devoluciones voluntarias por decisión del usuario y no afectan los derechos que legalmente pudieran corresponder al consumidor en materia de garantía, idoneidad, seguridad, productos defectuosos u otros supuestos reconocidos por la legislación peruana.',
        ],
      },
      {
        id: '5.12',
        title: '5.12. Derechos del consumidor',
        paragraphs: [
          'Las condiciones establecidas en este capítulo se aplicarán sin perjuicio de los derechos reconocidos a los consumidores por la legislación peruana vigente.',
          'En particular, ninguna disposición de estos Términos y Condiciones deberá interpretarse como una renuncia, limitación o exclusión de derechos que tengan carácter irrenunciable o que resulten aplicables en virtud de normas imperativas de protección al consumidor.',
          'Cuando exista una discrepancia entre una condición establecida en estos Términos y Condiciones y una disposición legal de carácter obligatorio aplicable al caso concreto, prevalecerá la disposición legal correspondiente.',
        ],
      },
    ],
  },
  {
    id: 'capitulo-6',
    number: '6',
    title: 'Delivery y Entrega de Productos',
    icon: 'local_shipping',
    subsections: [
      {
        id: '6.1',
        title: '6.1. Ámbito de cobertura del servicio de delivery',
        paragraphs: [
          'El servicio de delivery ofrecido por DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. estará disponible únicamente para determinados distritos comprendidos dentro de Lima Metropolitana, de acuerdo con la cobertura y disponibilidad del servicio al momento de la solicitud.',
          'La disponibilidad del servicio estará sujeta a la ubicación indicada por el usuario y a las condiciones operativas existentes al momento de solicitar la entrega.',
        ],
      },
      {
        id: '6.2',
        title: '6.2. Coordinación y programación de la entrega',
        paragraphs: [
          'La solicitud y coordinación del servicio de delivery se realizará mediante el WhatsApp oficial de DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C.',
          'El servicio de delivery será coordinado únicamente después de que el producto haya sido confirmado como disponible y el usuario haya efectuado y validado el pago íntegro correspondiente.',
          'La fecha y el horario de entrega estarán sujetos a la disponibilidad del servicio y a la coordinación previa realizada con el usuario.',
          'DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. comunicará al usuario, mediante WhatsApp, la información disponible respecto de la programación estimada de la entrega.',
        ],
      },
      {
        id: '6.3',
        title: '6.3. Costo del servicio de delivery',
        paragraphs: [
          'El servicio de delivery tendrá un costo adicional al precio del producto adquirido.',
          'El importe correspondiente será determinado de acuerdo con el distrito de destino y será comunicado al usuario antes de concretar la operación y coordinar la entrega.',
          'El costo del delivery no se encontrará incluido en el precio publicado del producto, salvo que DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. comunique expresamente una promoción o condición comercial que indique lo contrario.',
        ],
      },
      {
        id: '6.4',
        title: '6.4. Información proporcionada por el usuario',
        paragraphs: [
          'Para facilitar la correcta entrega del producto, el usuario deberá proporcionar información exacta, completa y actualizada, incluyendo como mínimo:',
        ],
        list: [
          { label: 'a)', text: 'Nombre completo del destinatario.' },
          { label: 'b)', text: 'Dirección exacta del lugar de entrega.' },
          { label: 'c)', text: 'Distrito correspondiente.' },
          { label: 'd)', text: 'Número de teléfono de contacto.' },
          { label: 'e)', text: 'Cualquier referencia adicional que resulte necesaria para facilitar la ubicación del domicilio.' },
        ],
        afterListParagraphs: [
          'El usuario será responsable de verificar que la información proporcionada sea correcta y suficiente para realizar la entrega.',
          'Los errores, omisiones o datos incorrectos proporcionados por el usuario que ocasionen retrasos, imposibiliten la entrega o requieran una nueva coordinación podrán generar la necesidad de reprogramar el servicio, de acuerdo con la disponibilidad existente.',
        ],
      },
      {
        id: '6.5',
        title: '6.5. Recepción del producto',
        paragraphs: [
          'El usuario deberá procurar encontrarse disponible en la dirección proporcionada durante el horario previamente coordinado para recibir el producto.',
          'En caso de que el usuario no pueda encontrarse presente en el lugar de entrega, podrá autorizar a otra persona para recibir el producto.',
          'Para ello, deberá proporcionar previamente a DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. el nombre completo y número de teléfono de la persona autorizada para recibir el producto.',
          'La persona que reciba el producto por cuenta del usuario será considerada autorizada para efectos de la entrega, siempre que sus datos hayan sido previamente comunicados a la clínica.',
        ],
      },
      {
        id: '6.6',
        title: '6.6. Incidencias durante el delivery gestionado por la clínica',
        paragraphs: [
          'Cuando el servicio de delivery sea gestionado directamente por DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C., la empresa asumirá la responsabilidad correspondiente respecto de los daños que pudiera sufrir el producto durante el traslado, cuando estos sean atribuibles al servicio de entrega gestionado por la empresa.',
          'En caso de que el usuario advierta algún daño o deterioro del producto al momento de recibirlo, deberá comunicarlo a DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. a través de sus canales oficiales para que la situación pueda ser evaluada y se adopten las medidas que correspondan.',
          'Las responsabilidades aplicables a los servicios de delivery contratados directamente por el usuario se encuentran reguladas en el numeral 4.13. Entrega y condiciones posteriores a la compra de los presentes Términos y Condiciones.',
        ],
      },
      {
        id: '6.7',
        title: '6.7. Plazo y disponibilidad de entrega',
        paragraphs: [
          'El servicio de delivery no cuenta con un plazo de entrega fijo o garantizado, debido a que su programación dependerá de la disponibilidad del servicio y de la coordinación previa con el usuario.',
          'La fecha y horario estimados serán comunicados al usuario de acuerdo con la disponibilidad existente al momento de solicitar el servicio.',
          'La coordinación de una fecha estimada de entrega no deberá interpretarse como una garantía de un horario exacto cuando existan circunstancias operativas que puedan afectar razonablemente el servicio.',
        ],
      },
      {
        id: '6.8',
        title: '6.8. Condición previa para la entrega',
        paragraphs: [
          'El servicio de delivery únicamente podrá ser coordinado cuando:',
        ],
        list: [
          { label: 'a)', text: 'El producto haya sido confirmado como disponible.' },
          { label: 'b)', text: 'El usuario haya efectuado el pago íntegro del producto.' },
          { label: 'c)', text: 'El pago haya sido validado por DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C.' },
          { label: 'd)', text: 'El usuario haya proporcionado la información necesaria para realizar la entrega.' },
          { label: 'e)', text: 'Se haya coordinado previamente la fecha y horario estimados del delivery.' },
        ],
        afterListParagraphs: [
          'La entrega no será programada mientras el pago correspondiente no haya sido efectuado y validado por la empresa.',
        ],
      },
    ],
  },
  {
    id: 'capitulo-7',
    anchor: 'privacidad',
    number: '7',
    title: 'Protección de Datos Personales, Privacidad y Derechos del Usuario',
    icon: 'shield_lock',
    subsections: [
      {
        id: '7.1',
        title: '7.1. Responsable del tratamiento de los datos personales',
        paragraphs: [
          'DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C., en adelante la “Empresa”, será responsable del tratamiento de los datos personales que sean recopilados, registrados, almacenados y utilizados en el marco de la prestación de sus servicios, atención de pacientes, gestión de citas, comercialización de productos y demás actividades relacionadas con la empresa.',
          'El tratamiento de los datos personales se realizará de conformidad con la legislación peruana aplicable en materia de protección de datos personales, incluyendo la Ley N.° 29733, Ley de Protección de Datos Personales, y su Reglamento vigente.',
        ],
      },
      {
        id: '7.2',
        title: '7.2. Datos personales recopilados',
        paragraphs: [
          'En función de la relación que el usuario o paciente mantenga con DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C., la Empresa podrá recopilar los datos que resulten necesarios para brindar sus servicios y desarrollar sus actividades. Entre estos datos podrán encontrarse:',
        ],
        list: [
          { label: 'a)', text: 'Nombres y apellidos.' },
          { label: 'b)', text: 'Documento de identidad.' },
          { label: 'c)', text: 'Número de teléfono.' },
          { label: 'd)', text: 'Correo electrónico.' },
          { label: 'e)', text: 'Dirección de domicilio.' },
          { label: 'f)', text: 'Información necesaria para la emisión de comprobantes de pago.' },
          { label: 'g)', text: 'Información relacionada con las citas y atenciones médicas.' },
          { label: 'h)', text: 'Antecedentes médicos proporcionados por el paciente.' },
          { label: 'i)', text: 'Información sobre enfermedades, afecciones, operaciones, tratamientos o procedimientos médicos anteriores.' },
          { label: 'j)', text: 'Información relacionada con el estado de salud del paciente que resulte necesaria para su evaluación y atención médica.' },
          { label: 'k)', text: 'Fotografías e imágenes del paciente, cuando estas hayan sido autorizadas conforme a las condiciones establecidas por la Empresa.' },
        ],
        afterListParagraphs: [
          'La información recopilada será utilizada únicamente para las finalidades correspondientes a la relación existente entre el usuario o paciente y DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C.',
        ],
      },
      {
        id: '7.3',
        title: '7.3. Datos personales relacionados con la salud',
        paragraphs: [
          'Debido a la naturaleza de los servicios prestados por DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C., la Empresa podrá tratar información relacionada con la salud de sus pacientes, incluyendo antecedentes de enfermedades, afecciones, operaciones anteriores, tratamientos recibidos y demás información relevante para la evaluación y atención médica.',
          'Los datos personales relacionados con la salud constituyen una categoría especialmente protegida dentro del marco peruano de protección de datos personales.',
          'En consecuencia, dicha información será tratada con especial confidencialidad y únicamente para las finalidades relacionadas con la atención médica, gestión de la historia clínica, seguimiento del paciente, cumplimiento de obligaciones legales y demás finalidades legítimas vinculadas con la prestación de los servicios de salud.',
          'La Empresa adoptará las medidas de seguridad y confidencialidad que resulten aplicables de acuerdo con la normativa vigente y la naturaleza de la información tratada.',
        ],
      },
      {
        id: '7.4',
        title: '7.4. Finalidades del tratamiento',
        paragraphs: [
          'Los datos personales podrán ser utilizados por DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. para las siguientes finalidades:',
        ],
        list: [
          { label: 'a)', text: 'Gestionar y coordinar citas médicas.' },
          { label: 'b)', text: 'Realizar la evaluación y atención médica del paciente.' },
          { label: 'c)', text: 'Elaborar, mantener y gestionar la historia clínica correspondiente.' },
          { label: 'd)', text: 'Realizar seguimiento de tratamientos y procedimientos.' },
          { label: 'e)', text: 'Solicitar o registrar información médica necesaria para la atención del paciente.' },
          { label: 'f)', text: 'Gestionar procedimientos dermatológicos, quirúrgicos, láser, estéticos y demás servicios ofrecidos por la Empresa.' },
          { label: 'g)', text: 'Gestionar la venta y entrega de productos dermatológicos y dermocosméticos.' },
          { label: 'h)', text: 'Coordinar servicios de delivery cuando corresponda.' },
          { label: 'i)', text: 'Emitir boletas, facturas y demás comprobantes de pago.' },
          { label: 'j)', text: 'Gestionar pagos y operaciones comerciales.' },
          { label: 'k)', text: 'Atender consultas, solicitudes y comunicaciones realizadas por los usuarios.' },
          { label: 'l)', text: 'Cumplir obligaciones legales, tributarias, administrativas y regulatorias aplicables a la Empresa.' },
          { label: 'm)', text: 'Mantener registros internos necesarios para la adecuada gestión de las actividades de DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C.' },
        ],
        afterListParagraphs: [
          'La Empresa no utilizará los datos personales obtenidos durante la atención médica para realizar campañas de publicidad personalizada o comunicaciones comerciales no relacionadas con la prestación de sus servicios, salvo que corresponda obtener previamente la autorización o cumplir con las condiciones legales aplicables.',
        ],
      },
      {
        id: '7.5',
        title: '7.5. Historia clínica y conservación de la información',
        paragraphs: [
          'DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. podrá conservar la información relacionada con la atención médica de sus pacientes tanto mediante sistemas informáticos como mediante documentación física almacenada en el establecimiento.',
          'La información contenida en las historias clínicas será utilizada para las finalidades propias de la atención y seguimiento médico del paciente y será tratada bajo criterios de confidencialidad y seguridad.',
          'La conservación de la información se realizará durante el periodo que resulte necesario para cumplir con las finalidades para las cuales fue recopilada y con las obligaciones legales aplicables a la Empresa.',
        ],
      },
      {
        id: '7.6',
        title: '7.6. Uso de WhatsApp y otros canales de comunicación',
        paragraphs: [
          'DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. podrá utilizar WhatsApp, llamadas telefónicas y otros canales oficiales de comunicación para gestionar citas, confirmar asistencias, coordinar procedimientos, atender consultas, coordinar la adquisición de productos y realizar otras comunicaciones relacionadas con los servicios ofrecidos.',
          'El usuario deberá procurar proporcionar información correcta y actualizada a través de estos canales.',
          'Cuando el usuario utilice plataformas de terceros, como WhatsApp, deberá considerar que dichas plataformas cuentan con sus propias condiciones de uso y políticas de privacidad, independientes de las establecidas por DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C.',
          'La Empresa limitará la información compartida a través de estos canales a aquella que resulte necesaria para la finalidad correspondiente.',
        ],
      },
      {
        id: '7.7',
        title: '7.7. Comunicación de información a terceros',
        paragraphs: [
          'DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. no comercializa ni comparte libremente los datos personales de sus usuarios o pacientes con terceros.',
          'Sin perjuicio de ello, podrá comunicar determinados datos cuando resulte necesario para la prestación de un servicio solicitado por el usuario o para el cumplimiento de obligaciones legales.',
          'En particular, cuando el usuario solicite un servicio de delivery gestionado por la Empresa, podrán comunicarse al encargado de realizar la entrega los datos estrictamente necesarios para efectuarla, incluyendo:',
        ],
        list: [
          { label: 'a)', text: 'Nombre del destinatario.' },
          { label: 'b)', text: 'Dirección de entrega.' },
          { label: 'c)', text: 'Número de teléfono de contacto.' },
        ],
        afterListParagraphs: [
          'La información proporcionada al encargado del delivery deberá limitarse a aquella necesaria para realizar correctamente la entrega del producto.',
          'Asimismo, DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. podrá proporcionar información a sus contadores o asesores contables cuando resulte necesario para el cumplimiento de obligaciones tributarias, contables o legales de la Empresa.',
          'Cualquier otro supuesto de comunicación, transferencia o acceso a datos personales se realizará de acuerdo con la legislación peruana aplicable.',
        ],
      },
      {
        id: '7.8',
        title: '7.8. Fotografías e imágenes de pacientes',
        paragraphs: [
          'DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. podrá utilizar fotografías o imágenes de pacientes únicamente cuando exista una autorización previa del paciente para su utilización.',
          'La autorización deberá permitir identificar la finalidad para la cual se utilizarán las imágenes, especialmente cuando estas sean destinadas a publicaciones en redes sociales, material informativo, contenido institucional o difusión de resultados de procedimientos.',
          'La Empresa procurará que el uso de dichas imágenes se realice conforme a la autorización otorgada por el paciente y respetando su privacidad y dignidad.',
          'La utilización de fotografías de pacientes para fines distintos de aquellos autorizados deberá contar con la autorización que corresponda.',
        ],
      },
      {
        id: '7.9',
        title: '7.9. Redes sociales y publicaciones',
        paragraphs: [
          'DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. podrá utilizar sus canales oficiales en redes sociales para comunicar información institucional, novedades, nuevos productos, lanzamientos, servicios y demás contenidos relacionados con las actividades de la Empresa.',
          'La utilización de datos personales o fotografías identificables de pacientes en dichas publicaciones estará sujeta a las autorizaciones y condiciones aplicables.',
          'La Empresa no utilizará la información obtenida de las historias clínicas o de la atención médica de los pacientes como mecanismo para realizar publicidad personalizada sin contar con la base legal o autorización que corresponda.',
        ],
      },
      {
        id: '7.10',
        title: '7.10. Medidas de seguridad y confidencialidad',
        paragraphs: [
          'DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. adoptará las medidas técnicas, organizativas y de seguridad que resulten razonables y necesarias para proteger los datos personales bajo su responsabilidad frente a accesos no autorizados, pérdida, alteración, divulgación indebida u otras formas de tratamiento no autorizado.',
          'Estas medidas serán aplicables tanto a la información almacenada mediante sistemas informáticos como a la documentación física conservada en el establecimiento.',
          'El personal y las personas que, por razón de sus funciones, tengan acceso a información personal o médica deberán mantener la confidencialidad de dicha información y utilizarla únicamente para las finalidades correspondientes.',
        ],
      },
      {
        id: '7.11',
        title: '7.11. Actualización de la información proporcionada',
        paragraphs: [
          'El usuario o paciente deberá proporcionar información verdadera, completa y actualizada cuando esta sea necesaria para la prestación de los servicios de DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C.',
          'Cuando existan cambios relevantes en la información proporcionada, el usuario podrá comunicarlos a la Empresa mediante sus canales oficiales.',
          'La información médica deberá ser proporcionada de manera veraz y completa, especialmente aquella relacionada con enfermedades, afecciones, operaciones, tratamientos anteriores, alergias u otras circunstancias que puedan resultar relevantes para la evaluación y atención médica.',
        ],
      },
      {
        id: '7.12',
        title: '7.12. Futura implementación de formularios digitales',
        paragraphs: [
          'En caso de que DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. implemente en el futuro formularios, sistemas de registro, plataformas de reserva, funcionalidades de compra u otros mecanismos digitales que impliquen la recopilación de datos personales a través del Sitio Web, la Empresa adoptará las medidas y mecanismos de información y consentimiento que resulten exigibles conforme a la normativa peruana aplicable.',
          'La implementación de nuevas funcionalidades que impliquen un tratamiento adicional de datos personales podrá requerir la actualización de la información proporcionada al usuario y de las políticas de privacidad correspondientes.',
        ],
      },
      {
        id: '7.13',
        title: '7.13. Política de Privacidad',
        paragraphs: [
          'DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. podrá establecer y publicar una Política de Privacidad y Protección de Datos Personales independiente de los presentes Términos y Condiciones, en la cual se desarrollarán de manera detallada las condiciones aplicables al tratamiento de datos personales, las finalidades específicas, las medidas de seguridad, los mecanismos de atención y demás aspectos exigidos por la legislación peruana.',
          'En caso de existir una Política de Privacidad publicada por la Empresa, esta formará parte de las condiciones aplicables al tratamiento de los datos personales de los usuarios y pacientes, en lo que corresponda.',
          'La presente sección se interpretará de conformidad con la Ley N.° 29733, Ley de Protección de Datos Personales, su Reglamento vigente y las demás normas peruanas que resulten aplicables.',
        ],
      },
      {
        id: '7.14',
        title: '7.14. Derechos del usuario respecto de sus datos personales',
        paragraphs: [
          'Los usuarios y pacientes de DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. podrán ejercer los derechos reconocidos por la legislación peruana en materia de protección de datos personales, de acuerdo con las condiciones, requisitos y limitaciones establecidos por la normativa aplicable. Entre dichos derechos se encuentran, según corresponda:',
        ],
        list: [
          { label: 'a)', text: 'El derecho de acceso a sus datos personales.' },
          { label: 'b)', text: 'El derecho de rectificación de datos personales que sean inexactos, incompletos o desactualizados.' },
          { label: 'c)', text: 'El derecho de cancelación de sus datos personales cuando corresponda legalmente.' },
          { label: 'd)', text: 'El derecho de oposición al tratamiento de sus datos personales cuando resulte aplicable.' },
        ],
        afterListParagraphs: [
          'El ejercicio de estos derechos se realizará conforme al procedimiento establecido por DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. y dentro de los límites establecidos por la legislación aplicable.',
        ],
      },
      {
        id: '7.15',
        title: '7.15. Canales para el ejercicio de derechos',
        paragraphs: [
          'El usuario o paciente podrá presentar sus solicitudes relacionadas con el tratamiento de sus datos personales a través de cualquiera de los siguientes canales:',
        ],
        list: [
          { label: 'a)', text: 'WhatsApp oficial de DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. por el siguiente número: +51 996 235 890.' },
          { label: 'b)', text: 'Correo electrónico: dclaserconsultorio@gmail.com.' },
          { label: 'c)', text: 'Atención presencial en el establecimiento de DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C.' },
        ],
        afterListParagraphs: [
          'Las solicitudes recibidas serán atendidas por el personal encargado del área de recepción, quien realizará la recepción y derivación correspondiente conforme a los procedimientos internos de la Empresa.',
          'Cuando la naturaleza de la solicitud lo requiera, el personal de recepción podrá derivarla al área o persona responsable correspondiente para su evaluación.',
        ],
      },
      {
        id: '7.16',
        title: '7.16. Verificación de identidad del solicitante',
        paragraphs: [
          'Para proteger la información personal y, especialmente, aquella relacionada con la salud, DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. podrá solicitar al usuario la acreditación de su identidad antes de atender una solicitud relacionada con sus datos personales. Para dicho efecto, podrá requerirse la presentación del Documento Nacional de Identidad (DNI).',
          'La verificación de identidad tendrá como finalidad evitar el acceso, modificación, entrega o divulgación de información personal por personas que no se encuentren legitimadas para solicitarla.',
          'La Empresa podrá solicitar información o documentación adicional cuando resulte razonablemente necesaria para verificar la identidad del solicitante o determinar su legitimidad para ejercer el derecho solicitado.',
        ],
      },
      {
        id: '7.17',
        title: '7.17. Solicitudes realizadas mediante representantes o terceros',
        paragraphs: [
          'Los derechos sobre los datos personales podrán ser ejercidos directamente por el titular de la información o por una persona que se encuentre debidamente facultada para actuar en su representación.',
          'Cuando un familiar, cónyuge, representante u otra persona distinta del paciente solicite acceder a información personal o médica del titular, deberá acreditar la autorización correspondiente.',
          'Para el acceso a información de carácter personal o contenida en la historia clínica, DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. podrá requerir una carta poder u otro documento válido que acredite la representación o autorización expresa del paciente, además de la documentación necesaria para verificar la identidad del solicitante.',
          'La sola condición de familiar, cónyuge, conviviente, amigo o persona cercana al paciente no otorga por sí misma derecho de acceso a la información personal o historia clínica.',
        ],
      },
      {
        id: '7.18',
        title: '7.18. Protección y acceso a la historia clínica',
        paragraphs: [
          'La historia clínica constituye información de carácter confidencial y contiene información médica y datos relacionados con la salud del paciente.',
          'DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. mantendrá la historia clínica bajo medidas de custodia y conservación, tanto en formato físico como mediante los sistemas informáticos utilizados por la Empresa.',
          'El acceso a la historia clínica estará limitado al personal autorizado y, especialmente, al médico tratante, de acuerdo con las funciones que correspondan y la normativa aplicable.',
          'La información contenida en la historia clínica no podrá ser libremente modificada, eliminada o alterada por el paciente, personal de recepción u otros terceros.',
          'Cuando resulte necesario realizar una modificación, corrección, incorporación o actualización de información médica, esta deberá ser realizada por el profesional autorizado y conforme a los procedimientos aplicables a la gestión de la historia clínica.',
          'La conservación, custodia, acceso y gestión de las historias clínicas se realizará de acuerdo con la normativa sanitaria y de protección de datos personales que resulte aplicable. El Ministerio de Salud cuenta con una norma técnica específica para la gestión, conservación y manejo de historias clínicas en las instituciones prestadoras de servicios de salud.',
        ],
      },
      {
        id: '7.19',
        title: '7.19. Atención de las solicitudes',
        paragraphs: [
          'Las solicitudes relacionadas con los datos personales serán recibidas y gestionadas por el personal designado por DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C.',
          'La Empresa procurará atender las solicitudes dentro de los plazos establecidos por la legislación peruana aplicable.',
          'Cuando una solicitud no contenga información suficiente para identificar al solicitante, determinar la información requerida o evaluar adecuadamente el pedido, la Empresa podrá solicitar información o documentación adicional antes de proceder con su atención.',
          'Los plazos y condiciones de respuesta se sujetarán a los establecidos por la normativa vigente en materia de protección de datos personales. En consecuencia, la indicación de un plazo interno de hasta treinta (30) días no podrá interpretarse como una ampliación de los plazos máximos legalmente establecidos.',
        ],
      },
      {
        id: '7.20',
        title: '7.20. Reserva y limitaciones al acceso a la información',
        paragraphs: [
          'DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. podrá limitar, denegar o reservar determinada información cuando su entrega, modificación, cancelación u oposición no resulte legalmente procedente o cuando exista una causa legítima que impida atender total o parcialmente la solicitud. Entre otros supuestos, la Empresa podrá restringir el acceso cuando:',
        ],
        list: [
          { label: 'a)', text: 'No se haya acreditado adecuadamente la identidad del solicitante.' },
          { label: 'b)', text: 'La persona que solicita la información no se encuentre debidamente legitimada para acceder a ella.' },
          { label: 'c)', text: 'La solicitud corresponda a información protegida por deberes de confidencialidad o secreto profesional.' },
          { label: 'd)', text: 'La entrega de la información pueda afectar derechos de terceros.' },
          { label: 'e)', text: 'Exista una obligación legal o disposición de autoridad competente que impida o limite la entrega de la información.' },
          { label: 'f)', text: 'La solicitud recaiga sobre información cuya conservación sea necesaria para el cumplimiento de obligaciones legales, médicas, administrativas o regulatorias.' },
        ],
        afterListParagraphs: [
          'Cuando corresponda legalmente, DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. comunicará al solicitante las razones que sustenten la limitación o denegatoria de su solicitud.',
        ],
      },
      {
        id: '7.21',
        title: '7.21. Tratamiento de datos de menores de edad',
        paragraphs: [
          'DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. atiende a pacientes menores de dieciocho (18) años.',
          'Por razones de seguridad y protección del menor, los pacientes menores de edad deberán acudir al establecimiento acompañados por sus padres, tutores o representantes legales, según corresponda.',
          'La información personal y médica de los menores será tratada con especial cuidado y de acuerdo con las disposiciones legales aplicables.',
          'Cuando corresponda ejercer derechos relacionados con los datos personales de un menor, la Empresa podrá requerir la acreditación de la representación legal correspondiente.',
        ],
      },
      {
        id: '7.22',
        title: '7.22. Información proporcionada por el usuario',
        paragraphs: [
          'El usuario y/o paciente será responsable de proporcionar información verdadera, exacta, completa y actualizada cuando esta sea necesaria para su identificación, atención médica, gestión de citas, adquisición de productos, emisión de comprobantes u otras actividades relacionadas con los servicios ofrecidos por DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C.',
          'En el caso de información médica, el paciente deberá proporcionar información veraz respecto de sus antecedentes, enfermedades, afecciones, operaciones, tratamientos, alergias y demás circunstancias relevantes para su atención.',
          'La Empresa no será responsable por las consecuencias derivadas de información falsa, incompleta, desactualizada o incorrecta proporcionada por el usuario o paciente, sin perjuicio de las responsabilidades que legalmente correspondan a la Empresa.',
        ],
      },
      {
        id: '7.23',
        title: '7.23. Comunicaciones relacionadas con la atención',
        paragraphs: [
          'DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. podrá utilizar los datos de contacto proporcionados por el usuario para realizar comunicaciones necesarias relacionadas con:',
        ],
        list: [
          { label: 'a)', text: 'Confirmación de citas.' },
          { label: 'b)', text: 'Reprogramación de citas.' },
          { label: 'c)', text: 'Información relacionada con procedimientos.' },
          { label: 'd)', text: 'Seguimiento de la atención.' },
          { label: 'e)', text: 'Coordinación de compras y productos.' },
          { label: 'f)', text: 'Coordinación de delivery.' },
          { label: 'g)', text: 'Información administrativa relacionada con los servicios contratados.' },
        ],
        afterListParagraphs: [
          'Estas comunicaciones se diferencian de las comunicaciones comerciales o publicitarias y podrán realizarse cuando resulten necesarias para gestionar la relación existente entre el usuario y la Empresa.',
        ],
      },
      {
        id: '7.24',
        title: '7.24. Reclamos, quejas y disconformidades',
        paragraphs: [
          'Cuando un usuario se encuentre disconforme con un servicio prestado o producto adquirido a DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C., podrá presentar su reclamo o queja de manera presencial en el establecimiento.',
          'Para tal efecto, la Empresa contará con un Libro de Reclamaciones físico y/o virtual, en el cual el usuario podrá registrar la situación que considere correspondiente.',
          'Los reclamos relacionados específicamente con el tratamiento de datos personales podrán ser canalizados a través de los medios indicados en el presente capítulo, sin perjuicio de las competencias de las autoridades administrativas correspondientes.',
        ],
      },
      {
        id: '7.25',
        title: '7.25. Cumplimiento de la normativa aplicable',
        paragraphs: [
          'DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. tratará los datos personales de sus usuarios y pacientes de conformidad con la Ley N.° 29733, Ley de Protección de Datos Personales, su Reglamento aprobado mediante Decreto Supremo N.° 016-2024-JUS, y las demás disposiciones peruanas que resulten aplicables.',
        ],
      },
    ],
  },
  {
    id: 'capitulo-8',
    number: '8',
    title: 'Responsabilidades, Limitaciones, Modificaciones, Legislación Aplicable y Solución de Controversias',
    icon: 'balance',
    subsections: [
      {
        id: '8.1',
        title: '8.1. Responsabilidad de DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C.',
        paragraphs: [
          'DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. será responsable de brindar los servicios médicos, procedimientos dermatológicos y productos ofrecidos a los usuarios de conformidad con las condiciones informadas, la normativa aplicable y los estándares que correspondan a la naturaleza de cada servicio o producto.',
          'La Empresa procurará que la información publicada en el Sitio Web sea clara, actualizada y suficiente para que el usuario pueda conocer las características principales de los servicios y productos ofrecidos.',
          'La responsabilidad de la Empresa se encontrará circunscrita a aquellas actuaciones que sean directamente atribuibles a DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C., sin perjuicio de las obligaciones y responsabilidades que establezca la legislación peruana aplicable.',
        ],
      },
      {
        id: '8.2',
        title: '8.2. Responsabilidad del usuario',
        paragraphs: [
          'El usuario será responsable de:',
        ],
        list: [
          { label: 'a)', text: 'Proporcionar información verdadera, completa y actualizada cuando esta sea necesaria para utilizar los servicios del Sitio Web.' },
          { label: 'b)', text: 'Proporcionar información médica veraz y completa cuando resulte necesaria para su evaluación o atención.' },
          { label: 'c)', text: 'Utilizar el Sitio Web de manera lícita y conforme a los presentes Términos y Condiciones.' },
          { label: 'd)', text: 'Mantener la confidencialidad de cualquier información, credencial o mecanismo de acceso que eventualmente le sea proporcionado.' },
          { label: 'e)', text: 'No realizar actividades que puedan afectar el funcionamiento, seguridad o integridad del Sitio Web.' },
          { label: 'f)', text: 'No utilizar el Sitio Web para realizar actividades fraudulentas, ilícitas o contrarias a la legislación peruana.' },
          { label: 'g)', text: 'Revisar la información proporcionada por la Empresa antes de realizar una compra, solicitar una cita o contratar un servicio.' },
        ],
        afterListParagraphs: [
          'El usuario será responsable por los daños que pudiera ocasionar a la Empresa o a terceros como consecuencia de un uso indebido, fraudulento o ilícito del Sitio Web, cuando corresponda conforme a la legislación aplicable.',
        ],
      },
      {
        id: '8.3',
        title: '8.3. Disponibilidad y funcionamiento del Sitio Web',
        paragraphs: [
          'DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. realizará esfuerzos razonables para mantener el Sitio Web disponible y operativo. No obstante, el funcionamiento del Sitio Web podrá verse interrumpido temporalmente debido a:',
        ],
        list: [
          { label: 'a)', text: 'Trabajos de mantenimiento, actualización o mejora.' },
          { label: 'b)', text: 'Fallas de servidores, sistemas tecnológicos o proveedores de servicios.' },
          { label: 'c)', text: 'Interrupciones de los servicios de Internet o telecomunicaciones.' },
          { label: 'd)', text: 'Problemas o interrupciones de plataformas de terceros.' },
          { label: 'e)', text: 'Fallas en los sistemas de pago.' },
          { label: 'f)', text: 'Ataques informáticos, incidentes de seguridad u otros eventos tecnológicos.' },
          { label: 'g)', text: 'Caso fortuito o fuerza mayor.' },
          { label: 'h)', text: 'Otras circunstancias que se encuentren razonablemente fuera del control de la Empresa.' },
        ],
        afterListParagraphs: [
          'La Empresa podrá suspender temporalmente determinadas funcionalidades del Sitio Web cuando resulte necesario para realizar labores de mantenimiento, actualización, seguridad o mejora.',
          'La suspensión temporal del Sitio Web no afectará los derechos que correspondan al usuario respecto de operaciones que ya hayan sido válidamente realizadas.',
        ],
      },
      {
        id: '8.4',
        title: '8.4. Limitación de responsabilidad por servicios de terceros',
        paragraphs: [
          'DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. podrá utilizar o interactuar con servicios tecnológicos proporcionados por terceros, incluyendo plataformas de comunicación, sistemas de pago, servicios de Internet, redes sociales, herramientas tecnológicas y otros servicios necesarios para el funcionamiento de determinadas funcionalidades.',
          'La Empresa no será responsable por interrupciones, errores, fallas, modificaciones o indisponibilidad ocasionadas exclusivamente por dichos terceros, siempre que estas circunstancias no sean directamente atribuibles a una actuación u omisión de DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C.',
        ],
      },
      {
        id: '8.5',
        title: '8.5. Enlaces y plataformas externas',
        paragraphs: [
          'El Sitio Web podrá contener enlaces, accesos o referencias a plataformas, redes sociales o sitios web administrados por terceros.',
          'Dichos enlaces podrán facilitar el acceso del usuario a servicios externos, pero no implican necesariamente que DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. controle, administre o garantice el contenido, disponibilidad, seguridad o políticas de dichos sitios.',
          'El usuario que acceda a plataformas externas deberá sujetarse a los términos, condiciones y políticas de privacidad establecidos por los respectivos terceros.',
        ],
      },
      {
        id: '8.6',
        title: '8.6. Uso prohibido del Sitio Web',
        paragraphs: [
          'El usuario se compromete a no utilizar el Sitio Web para:',
        ],
        list: [
          { label: 'a)', text: 'Introducir virus, código malicioso, malware o cualquier otro elemento que pueda afectar su funcionamiento.' },
          { label: 'b)', text: 'Intentar obtener acceso no autorizado a sistemas, servidores, bases de datos o información de la Empresa.' },
          { label: 'c)', text: 'Alterar, modificar, dañar o interferir con el funcionamiento del Sitio Web.' },
          { label: 'd)', text: 'Realizar actividades de extracción masiva, automatizada o no autorizada de información del Sitio Web.' },
          { label: 'e)', text: 'Suplantar la identidad de otra persona.' },
          { label: 'f)', text: 'Utilizar información falsa con fines fraudulentos.' },
          { label: 'g)', text: 'Realizar transacciones fraudulentas o contrarias a la legislación aplicable.' },
          { label: 'h)', text: 'Utilizar el Sitio Web para actividades ilícitas.' },
          { label: 'i)', text: 'Realizar cualquier otra conducta que pueda afectar la seguridad, funcionamiento o integridad del Sitio Web, de la Empresa o de terceros.' },
        ],
        afterListParagraphs: [
          'La Empresa podrá adoptar las medidas técnicas y legales que correspondan frente a usos indebidos del Sitio Web, incluyendo la suspensión o restricción de determinados accesos o funcionalidades cuando resulte necesario y legalmente procedente.',
        ],
      },
      {
        id: '8.7',
        title: '8.7. Propiedad intelectual y contenido del Sitio Web',
        paragraphs: [
          'Todos los elementos que formen parte del Sitio Web y que sean de titularidad de DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C., incluyendo, entre otros, sus logos, marcas, nombres comerciales, diseños, fotografías, textos, gráficos, imágenes, videos, contenidos, elementos visuales y demás materiales, son propiedad de la Empresa o se encuentran utilizados legítimamente por esta.',
          'El usuario no podrá copiar, reproducir, modificar, distribuir, publicar, comercializar, explotar o utilizar dichos elementos con fines comerciales o distintos a la navegación y utilización legítima del Sitio Web, sin autorización previa de DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. o del titular correspondiente.',
          'El acceso al Sitio Web no implica la transferencia al usuario de ningún derecho de propiedad intelectual sobre los contenidos o elementos que lo conforman.',
        ],
      },
      {
        id: '8.8',
        title: '8.8. Reclamos y Libro de Reclamaciones',
        paragraphs: [
          'Los usuarios podrán presentar reclamos o quejas relacionados con los productos o servicios de DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. conforme al procedimiento establecido en los presentes Términos y Condiciones.',
          'La Empresa mantendrá a disposición de los consumidores el Libro de Reclamaciones conforme a las obligaciones establecidas por la normativa peruana aplicable. El Libro de Reclamaciones constituye un mecanismo para registrar reclamos y quejas relacionados con la adquisición de productos o contratación de servicios.',
          'El uso del Libro de Reclamaciones no impide que el consumidor pueda recurrir a los mecanismos administrativos, judiciales o de solución de controversias que correspondan conforme a la legislación vigente.',
        ],
      },
      {
        id: '8.9',
        title: '8.9. Modificación de los Términos y Condiciones',
        paragraphs: [
          'DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. podrá modificar, actualizar, ampliar, reducir o reemplazar total o parcialmente los presentes Términos y Condiciones cuando lo considere necesario, en función de las necesidades operativas, comerciales, tecnológicas, legales o regulatorias de la Empresa.',
          'Las modificaciones serán publicadas en el Sitio Web y entrarán en vigencia desde la fecha que se indique en la versión actualizada o, en ausencia de una fecha específica, desde su publicación.',
          'El usuario será responsable de revisar periódicamente los Términos y Condiciones disponibles en el Sitio Web.',
          'Las modificaciones realizadas no afectarán las compras, contrataciones o transacciones que hayan sido válidamente realizadas con anterioridad a su entrada en vigencia, las cuales se regirán por las condiciones aplicables al momento de su realización, sin perjuicio de las disposiciones legales que correspondan.',
          'Cuando una modificación sea necesaria para cumplir una obligación legal o regulatoria, la Empresa podrá implementarla con la oportunidad que resulte necesaria.',
        ],
      },
      {
        id: '8.10',
        title: '8.10. Legislación aplicable',
        paragraphs: [
          'Los presentes Términos y Condiciones se regirán e interpretarán de conformidad con las leyes de la República del Perú.',
          'En lo que resulte aplicable, la relación entre DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. y los usuarios se encontrará sujeta, entre otras, a las normas peruanas de protección al consumidor, protección de datos personales, propiedad intelectual, comercio electrónico, normativa sanitaria y demás disposiciones que resulten aplicables a las actividades desarrolladas por la Empresa.',
          'En materia de protección al consumidor resulta aplicable el Código de Protección y Defensa del Consumidor, Ley N.° 29571, en su versión vigente.',
          'En materia de protección de datos personales serán aplicables la Ley N.° 29733, Ley de Protección de Datos Personales, y su Reglamento aprobado mediante Decreto Supremo N.° 016-2024-JUS, además de las normas que las modifiquen, sustituyan o complementen.',
        ],
      },
      {
        id: '8.11',
        title: '8.11. Solución de controversias',
        paragraphs: [
          'En caso de que se presente una controversia, discrepancia o conflicto relacionado con los productos, servicios, compras, uso del Sitio Web o aplicación de los presentes Términos y Condiciones, las partes procurarán inicialmente resolver la situación mediante comunicación directa y negociación.',
          'Sin perjuicio de lo anterior, el usuario podrá utilizar los mecanismos administrativos, extrajudiciales o judiciales que le correspondan conforme a la legislación peruana.',
          'Nada de lo establecido en esta cláusula deberá interpretarse como una renuncia, restricción o limitación de los derechos que la legislación peruana reconoce a los consumidores.',
        ],
      },
      {
        id: '8.12',
        title: '8.12. Separabilidad',
        paragraphs: [
          'Si alguna disposición de los presentes Términos y Condiciones fuera declarada inválida, ilegal, nula o inaplicable por una autoridad competente, dicha circunstancia no afectará la validez y exigibilidad de las demás disposiciones.',
          'DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C. podrá sustituir o adaptar la disposición afectada por otra que resulte válida y que, en la medida legalmente permitida, conserve la finalidad económica y jurídica de la disposición original.',
        ],
      },
      {
        id: '8.13',
        title: '8.13. Vigencia',
        paragraphs: [
          'Los presentes Términos y Condiciones permanecerán vigentes mientras se encuentren publicados en el Sitio Web de DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C., sin perjuicio de las modificaciones que la Empresa pueda realizar conforme al numeral 8.9.',
          'La versión vigente será aquella que se encuentre publicada en el Sitio Web al momento de su consulta, sin perjuicio de las condiciones aplicables a operaciones realizadas con anterioridad a su entrada en vigencia.',
        ],
      },
    ],
  },
]

export default function TerminosYCondicionesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeChapter, setActiveChapter] = useState<string>('capitulo-1')

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const filteredChapters = CHAPTERS.map(chapter => {
    if (!normalizedQuery) return chapter
    const matchingSubsections = chapter.subsections.filter(sub => {
      const inTitle = sub.title.toLowerCase().includes(normalizedQuery)
      const inParagraphs = sub.paragraphs.some(p => p.toLowerCase().includes(normalizedQuery))
      const inList = sub.list?.some(
        item =>
          item.text.toLowerCase().includes(normalizedQuery) ||
          (item.label && item.label.toLowerCase().includes(normalizedQuery)),
      )
      const inAfter = sub.afterListParagraphs?.some(p => p.toLowerCase().includes(normalizedQuery))
      return inTitle || inParagraphs || inList || inAfter
    })
    return {
      ...chapter,
      subsections: matchingSubsections,
    }
  }).filter(chapter => chapter.subsections.length > 0)

  return (
    <main className="pt-28 pb-24 bg-[#F2F4F4] min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero / Header Card */}
        <div className="bg-white rounded-4xl p-8 md:p-12 shadow-sm border border-slate-100 mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-4">
                <span className="material-symbols-outlined text-sm">verified_user</span>
                Documento Legal Oficial
              </span>
              <h1 className="font-headline font-black text-3xl md:text-5xl tracking-tight text-[#1a1c1e] mb-3">
                Términos y Condiciones Generales
              </h1>
              <p className="text-on-surface-variant text-sm md:text-base max-w-3xl leading-relaxed">
                <strong>DERMATOLOGÍA CLÍNICA Y LÁSER S.A.C.</strong> · RUC N.° 20553756074 · Av. José Gálvez Barrenechea Nro. 127 Int. 604, San Isidro, Lima, Perú.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a
                href="/documentos/terminos-y-condiciones-dermq.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 rounded-2xl border-2 border-primary text-primary hover:bg-primary/5 font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">visibility</span>
                Ver PDF Original
              </a>
              <a
                href="/documentos/terminos-y-condiciones-dermq.pdf"
                download="Terminos_y_Condiciones_DERMQ.pdf"
                className="luminous-gradient text-white px-6 py-4 rounded-2xl font-bold text-sm glow-on-hover transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">download</span>
                Descargar PDF
              </a>
            </div>
          </div>

          {/* Search inside T&C */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar en los Términos y Condiciones (ej. citas, devoluciones, delivery, privacidad, RUC)..."
                className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-primary focus:bg-white focus:outline-none text-sm font-medium text-[#1a1c1e] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  aria-label="Limpiar búsqueda"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              )}
            </div>
            <a
              href="#privacidad"
              onClick={() => setActiveChapter('capitulo-7')}
              className="px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-[#1a1c1e] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <span className="material-symbols-outlined text-base text-primary">shield_lock</span>
              Ir a Protección de Datos (Cap. 7)
            </a>
          </div>
        </div>

        {/* Content Layout: Sticky Index Sidebar + Chapters */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Sidebar Index */}
          <aside className="lg:col-span-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm lg:sticky lg:top-28">
              <h2 className="font-headline font-black text-sm uppercase tracking-widest text-slate-400 mb-4 px-2">
                Índice General
              </h2>
              <nav className="space-y-1.5">
                {CHAPTERS.map(chapter => {
                  const isActive = activeChapter === chapter.id
                  return (
                    <a
                      key={chapter.id}
                      href={`#${chapter.anchor || chapter.id}`}
                      onClick={() => setActiveChapter(chapter.id)}
                      className={`flex items-start gap-3 p-3 rounded-2xl text-left transition-all ${
                        isActive
                          ? 'bg-primary/10 text-primary font-bold'
                          : 'hover:bg-slate-50 text-slate-600 font-medium'
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg shrink-0 mt-0.5">
                        {chapter.icon}
                      </span>
                      <span className="text-xs leading-snug">
                        <strong className="mr-1">{chapter.number}.</strong>
                        {chapter.title}
                      </span>
                    </a>
                  )
                })}
              </nav>

              <div className="mt-6 pt-6 border-t border-slate-100 px-2 space-y-2 text-xs text-slate-500">
                <p className="font-bold text-[#1a1c1e]">Canales Oficiales de Atención</p>
                <p className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-primary">call</span>
                  +51 996 235 890
                </p>
                <p className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-primary">mail</span>
                  dclaserconsultorio@gmail.com
                </p>
              </div>
            </div>
          </aside>

          {/* Main Legal Content */}
          <div className="lg:col-span-8 space-y-10">
            {filteredChapters.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
                <span className="material-symbols-outlined text-4xl text-slate-300 mb-3 block">
                  search_off
                </span>
                <h3 className="font-headline font-bold text-xl text-[#1a1c1e] mb-2">
                  No se encontraron coincidencias
                </h3>
                <p className="text-sm text-on-surface-variant mb-6">
                  No encontramos secciones que coincidan con “{searchQuery}”.
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-6 py-3 rounded-xl bg-primary text-white text-xs font-bold uppercase tracking-wider"
                >
                  Mostrar todo el documento
                </button>
              </div>
            ) : (
              filteredChapters.map(chapter => (
                <section
                  key={chapter.id}
                  id={chapter.anchor || chapter.id}
                  className="bg-white rounded-4xl p-8 md:p-10 border border-slate-100 shadow-sm scroll-mt-28"
                >
                  {chapter.anchor && <div id={chapter.id} className="scroll-mt-28" />}
                  <div className="flex items-start gap-4 pb-6 mb-8 border-b border-slate-100">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-2xl">{chapter.icon}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary block mb-1">
                        Capítulo {chapter.number}
                      </span>
                      <h2 className="font-headline font-black text-2xl md:text-3xl text-[#1a1c1e]">
                        {chapter.number}. {chapter.title}
                      </h2>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {chapter.subsections.map(sub => (
                      <article key={sub.id} id={`sec-${sub.id}`} className="space-y-3">
                        <h3 className="font-headline font-bold text-lg text-[#1a1c1e]">
                          {sub.title}
                        </h3>

                        {sub.paragraphs.map((p, idx) => (
                          <p
                            key={idx}
                            className="text-sm text-slate-600 leading-relaxed"
                          >
                            {p}
                          </p>
                        ))}

                        {sub.list && (
                          <ul className="space-y-2.5 pl-2 pt-1">
                            {sub.list.map((item, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2.5 text-sm text-slate-600 leading-relaxed bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100"
                              >
                                {item.label && (
                                  <span className="font-bold text-primary shrink-0">
                                    {item.label}
                                  </span>
                                )}
                                <span>{item.text}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {sub.hasDefectFlowchart && (
                          <div className="my-6 bg-slate-50 rounded-3xl p-6 md:p-8 border border-slate-200">
                            <p className="text-xs font-black uppercase tracking-widest text-primary text-center mb-6">
                              Flujograma — Proceso de Cambio por Producto Defectuoso
                            </p>
                            <div className="space-y-4 max-w-xl mx-auto">
                              {[
                                {
                                  step: '1',
                                  title: 'Usuario reporta el defecto',
                                  desc: 'El usuario comunica el defecto a través de los canales oficiales (WhatsApp, teléfono o presencial).',
                                },
                                {
                                  step: '2',
                                  title: 'El usuario presenta el producto en la clínica',
                                  desc: 'El usuario lleva el producto físico a la clínica para su revisión.',
                                },
                                {
                                  step: '3',
                                  title: 'La clínica recibe y revisa físicamente el producto',
                                  desc: 'El personal recibe el producto y realiza la revisión física para verificar el defecto.',
                                },
                                {
                                  step: '4',
                                  title: '¿Corresponde el cambio?',
                                  desc: 'Si SÍ corresponde: la clínica realiza el cambio del producto por uno nuevo de la misma presentación y cantidad. Si NO corresponde: se informa al usuario el motivo de la no procedencia del cambio y se devuelve el producto.',
                                },
                              ].map(node => (
                                <div
                                  key={node.step}
                                  className="flex items-start gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs"
                                >
                                  <div className="w-8 h-8 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                    {node.step}
                                  </div>
                                  <div>
                                    <p className="font-bold text-sm text-[#1a1c1e]">{node.title}</p>
                                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                                      {node.desc}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {sub.afterListParagraphs?.map((p, idx) => (
                          <p
                            key={idx}
                            className="text-sm text-slate-600 leading-relaxed pt-1"
                          >
                            {p}
                          </p>
                        ))}
                      </article>
                    ))}
                  </div>
                </section>
              ))
            )}

            {/* Bottom Callout */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="font-headline font-bold text-lg text-[#1a1c1e] mb-1">
                  ¿Tienes alguna consulta sobre estos Términos y Condiciones?
                </h3>
                <p className="text-xs text-slate-500">
                  Puedes escribirnos a nuestros canales oficiales o descargar la versión íntegra en PDF.
                </p>
              </div>
              <div className="flex gap-3 shrink-0">
                <Link
                  href="/contacto"
                  className="px-5 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-[#1a1c1e] transition-all"
                >
                  Contáctanos
                </Link>
                <a
                  href="/documentos/terminos-y-condiciones-dermq.pdf"
                  download="Terminos_y_Condiciones_DERMQ.pdf"
                  className="px-5 py-3 rounded-xl bg-primary text-white text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  Descargar PDF
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
