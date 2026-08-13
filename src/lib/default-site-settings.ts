import type { SiteSettings } from "@/lib/types";

/** Usado si todavía no se corrió la migración de site_settings, o si falla la conexión a la base. */
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: 1,

  hero_kicker: "nmtech solutions",
  hero_heading: "Aprendé haciendo",
  hero_tagline:
    "software, datos e ia explicados por quienes los aplican todos los días — probá gratis el primer capítulo",
  hero_cta_label: "Ver Ebooks",
  hero_image_url: "",
  hero_image_style: "circle",

  marquee_visible: true,
  featured_ebook_visible: true,
  why_visible: true,
  also_interested_visible: true,
  about_visible: true,

  lead_topics: ["IA", "SQL", "Marketing", "Automatizaciones", "Desarrollo de software", "Otro"],

  free_chapter_email_subject: "Tu capítulo gratis de {ebook}",
  free_chapter_email_body:
    "Hola {nombre},\n\nGracias por tu interés en {ebook}. Acá tenés el primer capítulo, completo y gratis:\n\n{capitulo}\n\nCuando quieras seguir leyendo, en la página del ebook vas a encontrar las opciones para comprarlo completo.\n\nSaludos,\nnmtech solutions",

  why_heading: "Por qué nuestros ebooks",
  why_reasons: [
    {
      title: "Probalo antes de comprar",
      description:
        "El primer capítulo completo es gratis en cada ebook. Lo leés y recién después decidís.",
    },
    {
      title: "Escrito por quienes lo hacen",
      description:
        "Nada de teoría genérica: es lo que aplicamos día a día en proyectos reales de software, datos e IA.",
    },
    {
      title: "100% práctico",
      description: "Directo al grano, con ejemplos concretos para aplicar desde el primer capítulo.",
    },
    {
      title: "Precio justo",
      description:
        "Pagás una vez y es tuyo para siempre. Cuando hay oferta, la vas a ver clara en cada ebook.",
    },
  ],

  about_heading: "Quiénes somos",
  about_text:
    "Somos una ingeniera en sistemas y un ingeniero en sistemas orientado a datos, pareja y socios de trabajo. Estos ebooks son lo que sabemos, aplicado en proyectos reales.",

  custom_solution_enabled: true,
  custom_solution_text:
    "Si te interesa que te desarrollemos una solución tecnológica a medida, conocé nuestros servicios de desarrollo.",
  custom_solution_url: "https://nmtechsolutions.vercel.app/",

  footer_text: "nmtech solutions — Biblioteca de Ebooks",

  contact_heading: "Contacto",
  contact_text:
    "¿Tenés dudas sobre alguno de nuestros ebooks, o necesitás que te ayudemos con desarrollo de software o automatización a medida? Escribinos, te respondemos nosotros mismos.",
  contact_email: "hola@nmtechsolutions.com",
  contact_whatsapp: "",

  email_footer_note:
    "Si no encontrás este mail en tu bandeja de entrada, revisá la carpeta de spam o correo no deseado. Ante cualquier problema, escribinos a {contact_email}.",

  buy_heading: "Comprá el ebook completo",
  transfer_instructions:
    "Una vez que hagas la transferencia, mandanos el comprobante para confirmarte el pago y enviarte el ebook completo:",
  chapter_heading: "Primer capítulo gratis",
  chapter_missing_text: "El capítulo gratis todavía no fue cargado. Escribinos y te lo mandamos.",
  chapter_email_note: "También te lo mandamos por mail.",

  discount_field_label: "¿Tenés un código de descuento?",
  discount_field_hint: "(opcional, solo aplica si pagás por transferencia)",
  discount_field_placeholder: "Ej: BIENVENIDA10",
  transfer_amount_label: "Monto a transferir:",
  discount_applied_note: "con tu código",

  terms_notice_text: "Al comprar, aceptás nuestros Términos y Condiciones.",

  terms_heading: "Términos y Condiciones",
  terms_content:
    "Última actualización: 2026.\n\n" +
    "Estos Términos y Condiciones (\"Términos\") regulan el uso de este sitio y la compra de los ebooks ofrecidos por nmtech solutions (\"nosotros\"). Al enviar el formulario de este sitio, comprar un ebook, o descargar cualquier contenido, aceptás estos Términos en su totalidad. Si no estás de acuerdo, no debés usar el sitio ni comprar nuestros productos.\n\n" +
    "1. PRODUCTO. Los ebooks son productos digitales (PDF y/o texto) entregados exclusivamente por medios electrónicos. No se realiza ningún envío físico. La compra no incluye soporte técnico, consultoría personalizada ni actualizaciones futuras del contenido, salvo que se indique expresamente en la página del producto.\n\n" +
    "2. MEDIOS DE PAGO. 2.1. Hotmart: la compra se procesa íntegramente en la plataforma Hotmart, que actúa como intermediario de pago y aplica sus propios términos y política de reembolsos, ajenos a nosotros. No somos responsables por errores, demoras o fallas de la plataforma Hotmart. 2.2. Transferencia bancaria: es un medio de pago manual. El envío de un comprobante NO constituye ni implica la confirmación del pago. El acceso al ebook completo se habilita ÚNICAMENTE una vez que el dinero impacta de forma efectiva y verificada en la cuenta bancaria informada. Mientras el pago no esté confirmado de esta manera, no se entrega ningún contenido, cualquiera sea el motivo de la demora, error o inconveniente en la acreditación.\n\n" +
    "3. ENTREGA. 3.1. Una vez confirmado el pago (por Hotmart, o por transferencia verificada según el punto 2.2), el ebook se envía por mail a la dirección provista por el comprador. 3.2. El tiempo de entrega es orientativo y no constituye una obligación de plazo fijo. Podemos demorar la entrega sin que ello genere derecho a reembolso, reclamo ni compensación alguna, especialmente en situaciones de alto volumen de pedidos, mantenimiento, causas de fuerza mayor, o cualquier circunstancia ajena a nuestra voluntad. 3.3. Es responsabilidad del comprador proporcionar una dirección de mail válida y revisar la carpeta de spam/promociones. No nos responsabilizamos por la no recepción del mail debido a errores de tipeo, filtros de spam, o casillas llenas.\n\n" +
    "4. PRECIOS Y OFERTAS. Los precios pueden modificarse sin previo aviso. El precio válido es el vigente al momento de confirmarse el pago. Las ofertas y descuentos son por tiempo limitado y a nuestra entera discreción, pudiendo finalizar o modificarse en cualquier momento.\n\n" +
    "5. POLÍTICA DE REEMBOLSOS. 5.1. Por tratarse de un producto digital con acceso inmediato y completo al contenido, no se realizan reembolsos una vez entregado el ebook completo, salvo que la normativa vigente aplicable lo exija de forma imperativa. 5.2. Las compras hechas a través de Hotmart se rigen exclusivamente por la política de reembolsos de Hotmart; cualquier reclamo por reembolso debe gestionarse directamente con Hotmart. 5.3. En compras por transferencia, cualquier reclamo debe realizarse dentro de las 48 horas de recibido el ebook, por los canales de contacto oficiales. La evaluación del reclamo y su eventual resolución quedan a nuestro exclusivo criterio.\n\n" +
    "6. PROPIEDAD INTELECTUAL. 6.1. Todo el contenido de los ebooks (textos, estructura, diseño, marca) es propiedad exclusiva de nmtech solutions y está protegido por las leyes de propiedad intelectual vigentes. 6.2. La compra otorga una licencia de uso personal, individual e intransferible. Queda expresamente prohibido reproducir, distribuir, revender, compartir, publicar, subir a internet, prestar o poner a disposición de terceros el contenido, en forma total o parcial, por cualquier medio, sin autorización previa y por escrito de nmtech solutions. 6.3. El incumplimiento habilita a iniciar las acciones legales que correspondan y a reclamar los daños y perjuicios ocasionados, sin perjuicio de la suspensión inmediata de cualquier acceso otorgado al infractor.\n\n" +
    "7. AUSENCIA DE GARANTÍAS DE RESULTADO. El contenido de los ebooks tiene fines educativos e informativos. No garantizamos resultados específicos, económicos o de otra índole, derivados de la aplicación de la información contenida. La implementación de cualquier consejo, técnica o estrategia descripta es responsabilidad exclusiva del comprador.\n\n" +
    "8. LIMITACIÓN DE RESPONSABILIDAD. En la máxima medida permitida por la ley aplicable, no seremos responsables por daños indirectos, incidentales, especiales, consecuentes o punitivos, ni por lucro cesante, pérdida de datos o de oportunidades de negocio, derivados del uso o la imposibilidad de uso del sitio o de los ebooks. En ningún caso nuestra responsabilidad total frente al comprador superará el monto efectivamente abonado por el producto en cuestión.\n\n" +
    "9. DATOS PERSONALES. Los datos que nos proporcionás (nombre, mail, temática de interés y cualquier comentario opcional) se usan exclusivamente para gestionar la entrega del ebook, dar seguimiento a tu consulta o compra, y comunicarte novedades relacionadas. No vendemos ni cedemos tus datos a terceros, salvo lo estrictamente necesario para procesar el pago a través de Hotmart cuando corresponda. Podés solicitar la baja o eliminación de tus datos escribiéndonos por los canales de contacto.\n\n" +
    "10. MODIFICACIONES. Nos reservamos el derecho de modificar estos Términos, el contenido, los precios o la disponibilidad de los ebooks en cualquier momento y sin previo aviso. Las modificaciones no afectan a las compras ya confirmadas al momento del cambio.\n\n" +
    "11. FUERZA MAYOR. No seremos responsables por incumplimientos o demoras derivados de causas fuera de nuestro control razonable, incluyendo fallas de plataformas de terceros (Hotmart, proveedores de mail, bancos), cortes de servicio de internet o energía, o cualquier otro caso fortuito o de fuerza mayor.\n\n" +
    "12. LEY APLICABLE Y JURISDICCIÓN. Estos Términos se rigen por las leyes de la República Argentina. Para cualquier controversia derivada de estos Términos, las partes se someten a los tribunales ordinarios competentes, renunciando a cualquier otro fuero o jurisdicción que pudiera corresponder.\n\n" +
    "13. DIVISIBILIDAD. Si alguna cláusula de estos Términos fuera declarada inválida o inaplicable, las restantes cláusulas mantendrán plena vigencia.\n\n" +
    "14. ACEPTACIÓN. El uso del sitio, el envío del formulario de contacto/captura de datos, y/o la compra de un ebook implican la aceptación plena e incondicional de estos Términos y Condiciones.\n\n" +
    "15. CONTACTO. Ante cualquier duda sobre estos Términos, podés escribirnos por los medios indicados en la sección Contacto del sitio.",

  privacy_heading: "Política de Privacidad",
  privacy_content:
    "Última actualización: 2026.\n\n" +
    "Esta Política de Privacidad describe cómo nmtech solutions (\"nosotros\", \"el sitio\") recolecta, usa, conserva y protege los datos personales de quienes visitan este sitio, completan el formulario de captura de leads, o compran alguno de nuestros ebooks. Se aplica en conjunto con nuestros Términos y Condiciones, y se rige por la Ley N° 25.326 de Protección de Datos Personales de la República Argentina y su normativa complementaria.\n\n" +
    "1. RESPONSABLE DEL TRATAMIENTO. El responsable del tratamiento de los datos personales recolectados a través de este sitio es nmtech solutions. Podés contactarnos por cualquier consulta relacionada con tus datos personales a través de los medios indicados en la sección \"Contacto\" del sitio y en el punto 12 de esta Política.\n\n" +
    "2. QUÉ DATOS RECOLECTAMOS. 2.1. Datos que nos das directamente: cuando completás el formulario de un ebook, recolectamos tu nombre, dirección de mail, la temática de interés que elegís, y (si querés) un comentario adicional o un código de descuento. Si nos escribís por mail, WhatsApp o Telegram para enviarnos un comprobante de transferencia, recolectamos los datos que decidas compartirnos en esa comunicación (por ejemplo, tu número de teléfono si nos escribís por WhatsApp). 2.2. Datos que se recolectan automáticamente: cuando navegás el sitio, se registran automáticamente datos técnicos como tu dirección IP, tipo de dispositivo y navegador, páginas visitadas y, si aceptaste el banner de cookies, identificadores de seguimiento generados por el Píxel de Meta (ver punto 7). 2.3. No recolectamos datos sensibles (en el sentido del art. 2 de la Ley 25.326, como origen racial, opiniones políticas, salud, etc.) ni datos de tarjetas de crédito, cuentas bancarias de terceros o comprobantes de pago: esos datos, si los compartís para acreditar una transferencia, quedan en el canal de mensajería que uses (mail, WhatsApp o Telegram) y no se almacenan en la base de datos del sitio.\n\n" +
    "3. PARA QUÉ USAMOS TUS DATOS (FINALIDAD). Usamos los datos que recolectamos para: (a) entregarte el primer capítulo gratis del ebook que elegiste; (b) gestionar tu compra y confirmarte el pago (por Hotmart, Tienda Nube o transferencia); (c) enviarte el ebook completo por mail una vez confirmado el pago; (d) responder tus consultas y darte seguimiento comercial; (e) si aceptaste el banner de cookies, medir la efectividad de nuestras campañas de publicidad en Meta (Facebook/Instagram) y mostrarte anuncios relevantes de nuestros propios productos (remarketing); (f) cumplir obligaciones legales, contables o fiscales que puedan corresponder. No usamos tus datos para fines distintos a los aquí descriptos, ni los usamos para tomar decisiones automatizadas que produzcan efectos jurídicos sobre vos.\n\n" +
    "4. BASE LEGAL DEL TRATAMIENTO. El tratamiento de tus datos se basa en tu consentimiento libre, expreso e informado, que nos das: (a) al completar y enviar el formulario del sitio, para los datos de contacto y la gestión de tu solicitud/compra; y (b) al aceptar el banner de cookies, específicamente para la activación del Píxel de Meta y el tratamiento de datos con fines de marketing. Si no aceptás el banner de cookies, el Píxel de Meta no se activa y no se recolecta ningún dato con fines publicitarios; podés igualmente leer el capítulo gratis y comprar cualquier ebook con total normalidad.\n\n" +
    "5. PLAZO DE CONSERVACIÓN. Conservamos tus datos personales mientras sea necesario para las finalidades descriptas en el punto 3, y en todo caso mientras exista una relación comercial o de consulta activa con vos, más los plazos adicionales que puedan exigir normas legales, contables o fiscales aplicables (por ejemplo, comprobantes de venta). Podés solicitar la supresión de tus datos antes de ese plazo escribiéndonos por los medios de contacto indicados, salvo que exista una obligación legal que nos impida eliminarlos antes.\n\n" +
    "6. A QUIÉNES SE COMUNICAN TUS DATOS (DESTINATARIOS Y TRANSFERENCIA INTERNACIONAL). Para poder ofrecer este servicio, compartimos una parte de tus datos con los siguientes proveedores, que actúan como encargados del tratamiento o, en el caso de Hotmart y Tienda Nube, como responsables independientes de la etapa de pago:\n" +
    "  • Supabase Inc.: aloja la base de datos donde se guardan los leads y los ebooks (infraestructura en la nube, con sede fuera de la Argentina).\n" +
    "  • Google LLC (Gmail): se usa para enviar los mails automáticos del sitio (capítulo gratis, confirmación de compra).\n" +
    "  • Vercel Inc.: aloja y sirve el sitio web (hosting).\n" +
    "  • Meta Platforms, Inc. (Facebook/Instagram): si aceptaste el banner de cookies, recibe datos de navegación y, de forma encriptada/anonimizada (hasheada), tu mail, con el único fin de medir conversiones de nuestras campañas publicitarias y mostrarte anuncios relevantes. Meta actúa como responsable independiente respecto del uso que le da a esos datos dentro de su propia plataforma, conforme a su propia política de privacidad (https://www.facebook.com/privacy/policy/).\n" +
    "  • Hotmart y Tienda Nube: si elegís comprar por alguno de estos medios, el proceso de pago se realiza íntegramente en sus plataformas, que recolectan y procesan tus datos de pago bajo sus propias políticas de privacidad, ajenas a nosotros.\n" +
    "Estos proveedores pueden estar ubicados fuera de la República Argentina, por lo que tus datos pueden ser objeto de una transferencia internacional. En esos casos, procuramos utilizar proveedores que ofrezcan garantías adecuadas de protección de datos conforme a los estándares exigidos por el art. 12 de la Ley 25.326, y solo compartimos los datos estrictamente necesarios para cada finalidad. No vendemos tus datos personales a terceros bajo ninguna circunstancia.\n\n" +
    "7. COOKIES Y TECNOLOGÍAS DE SEGUIMIENTO. 7.1. ¿Qué es el Píxel de Meta? Es un fragmento de código de Facebook/Instagram (Meta) que, cuando está activo, permite registrar acciones que realizás en el sitio (como visitar una página o hacer clic en un botón de compra) para medir la efectividad de nuestras campañas publicitarias y mostrarte anuncios más relevantes en esas plataformas. 7.2. Consentimiento: al ingresar al sitio, te mostramos un banner donde podés Aceptar o Rechazar el uso de estas cookies/tecnologías de seguimiento no esenciales. Tu elección se guarda en tu propio navegador (localStorage) y el Píxel de Meta solo se activa si elegís \"Aceptar\". 7.3. Si rechazás: el sitio funciona exactamente igual, podés leer el capítulo gratis y comprar cualquier ebook por cualquiera de los tres medios disponibles; simplemente no se activa el seguimiento de Meta ni se comparte información con fines publicitarios. 7.4. Podés cambiar tu elección en cualquier momento borrando los datos de navegación (localStorage) de tu navegador para este sitio, lo que va a hacer que el banner vuelva a aparecer en tu próxima visita. 7.5. Este sitio no utiliza cookies propias de seguimiento para visitantes; la única cookie técnica que usamos es la sesión de inicio de sesión del panel administrativo interno, que no te afecta como visitante o comprador.\n\n" +
    "8. TUS DERECHOS SOBRE TUS DATOS PERSONALES. De acuerdo con los arts. 14, 16 y 20 de la Ley 25.326, tenés derecho a: (a) ACCESO: solicitar confirmación de si tratamos datos tuyos y acceder a ellos; (b) RECTIFICACIÓN/ACTUALIZACIÓN: pedir que corrijamos datos inexactos o desactualizados; (c) SUPRESIÓN/CANCELACIÓN: pedir que eliminemos tus datos cuando corresponda; (d) OPOSICIÓN: oponerte al tratamiento de tus datos con fines de marketing en cualquier momento. Estos derechos son gratuitos y podés ejercerlos escribiéndonos por los medios de contacto indicados en el punto 12, acreditando tu identidad. Vamos a responder tu solicitud dentro de los plazos que establece la normativa vigente. Además, si considerás que no dimos cumplimiento adecuado a tus derechos, tenés derecho a presentar una denuncia o reclamo ante la Agencia de Acceso a la Información Pública (AAIP), órgano de control de la Ley 25.326 en la República Argentina (www.argentina.gob.ar/aaip), que es la Autoridad de Aplicación de la Ley N° 25.326 y tiene la atribución de atender reclamos vinculados al incumplimiento de las normas sobre protección de datos personales.\n\n" +
    "9. SEGURIDAD DE LOS DATOS. Adoptamos medidas técnicas y organizativas razonables para proteger tus datos personales contra pérdida, uso indebido, acceso no autorizado, alteración o divulgación, entre ellas: acceso restringido y protegido por usuario/contraseña al panel administrativo, comunicación cifrada (HTTPS) en todo el sitio, y uso de proveedores de infraestructura reconocidos (Supabase, Vercel). Ningún sistema es 100% infalible, pero trabajamos para mantener estándares razonables de seguridad acordes al tamaño y naturaleza de este proyecto.\n\n" +
    "10. MENORES DE EDAD. Este sitio y sus productos están dirigidos a personas mayores de 18 años. No recolectamos deliberadamente datos personales de menores de edad. Si tomamos conocimiento de que se recolectaron datos de un menor sin el consentimiento correspondiente de sus padres o tutores, vamos a eliminarlos.\n\n" +
    "11. MODIFICACIONES A ESTA POLÍTICA. Podemos modificar esta Política de Privacidad en cualquier momento, por ejemplo ante cambios normativos o en las herramientas que usamos. La versión vigente es siempre la publicada en esta misma página, con su fecha de última actualización. Te recomendamos revisarla periódicamente.\n\n" +
    "12. CONTACTO. Para ejercer tus derechos o realizar cualquier consulta sobre esta Política de Privacidad o el tratamiento de tus datos, podés escribirnos por los medios de contacto indicados en la sección \"Contacto\" de este sitio.\n\n" +
    "NOTA: esta Política fue redactada con el mayor rigor posible para cubrir los requisitos de la Ley 25.326, pero no reemplaza el asesoramiento de un abogado especializado en protección de datos, especialmente si el negocio crece o cambia su forma de operar.",

  transfer_telegram_contact: "",

  affiliates_heading: "Afiliados",
  affiliates_intro:
    "¿Nunca vendiste como afiliado? Es más simple de lo que parece: te sumás a un programa, te dan un link, y ganás una comisión por cada venta que se haga con ese link. Así funciona con nuestros ebooks a través de Hotmart.",
  affiliates_steps: [
    {
      title: "Te sumás al programa",
      description:
        "Elegís el ebook que quieras promocionar y te sumás a su programa de afiliados en Hotmart, gratis.",
    },
    {
      title: "Compartís tu link único",
      description:
        "Hotmart te da un link personal para ese ebook. Lo compartís donde quieras: redes, mail, tu propia web.",
    },
    {
      title: "Cobrás tu comisión",
      description:
        "Cada venta hecha con tu link te deja una comisión que te paga Hotmart automáticamente. Nosotros no gestionamos nada de esto: es todo entre vos y Hotmart.",
    },
  ],

  updated_at: new Date(0).toISOString(),
};
