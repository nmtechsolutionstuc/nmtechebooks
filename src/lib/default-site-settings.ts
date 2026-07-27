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
