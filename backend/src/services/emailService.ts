import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

const brandColor = '#6C63FF'
const brandName = 'NegocioSmart'

function baseTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${brandName}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f4f6f9; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
    .wrapper { max-width: 620px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, ${brandColor} 0%, #8B5CF6 100%); padding: 36px 40px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px; }
    .header p { color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px; }
    .body { padding: 40px; color: #374151; line-height: 1.7; }
    .body h2 { color: #111827; font-size: 22px; margin: 0 0 16px; }
    .body p { margin: 0 0 16px; font-size: 15px; }
    .highlight-box { background: #F3F4F6; border-left: 4px solid ${brandColor}; border-radius: 6px; padding: 20px 24px; margin: 24px 0; }
    .highlight-box p { margin: 0; color: #374151; font-size: 15px; }
    .btn { display: inline-block; background: ${brandColor}; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px; margin: 8px 0; }
    .table { width: 100%; border-collapse: collapse; margin: 24px 0; }
    .table th { background: #F9FAFB; color: #6B7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; padding: 10px 14px; text-align: left; border-bottom: 2px solid #E5E7EB; }
    .table td { padding: 12px 14px; border-bottom: 1px solid #F3F4F6; font-size: 14px; color: #374151; }
    .table tr:last-child td { border-bottom: none; }
    .total-row td { font-weight: 700; font-size: 16px; color: #111827; background: #F9FAFB; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .badge-success { background: #D1FAE5; color: #065F46; }
    .badge-warning { background: #FEF3C7; color: #92400E; }
    .badge-danger { background: #FEE2E2; color: #991B1B; }
    .footer { background: #F9FAFB; padding: 24px 40px; text-align: center; border-top: 1px solid #E5E7EB; }
    .footer p { color: #9CA3AF; font-size: 12px; margin: 0 0 6px; }
    .footer a { color: ${brandColor}; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>📊 ${brandName}</h1>
      <p>Tu plataforma inteligente de negocios</p>
    </div>
    <div class="body">
      ${content}
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} ${brandName}. Todos los derechos reservados.</p>
      <p><a href="https://negociosmart.com">negociosmart.com</a> · <a href="https://negociosmart.com/privacidad">Privacidad</a> · <a href="https://negociosmart.com/desuscribirse">Cancelar suscripción</a></p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

// Send invoice by email
export async function sendInvoiceEmail(
  to: string,
  invoiceNumber: string,
  businessName: string,
  total: number,
  currency: string
): Promise<void> {
  const formattedTotal = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: currency || 'MXN',
  }).format(total)

  const content = `
    <h2>Tu factura está lista 📄</h2>
    <p>Hola,</p>
    <p>Te informamos que <strong>${businessName}</strong> ha generado una nueva factura para ti. A continuación encontrarás los detalles:</p>

    <div class="highlight-box">
      <p><strong>Número de factura:</strong> ${invoiceNumber}</p>
      <p><strong>Negocio:</strong> ${businessName}</p>
      <p><strong>Total a pagar:</strong> <span style="font-size:20px; color:${brandColor}; font-weight:700;">${formattedTotal}</span></p>
    </div>

    <p>Si tienes alguna duda sobre esta factura, no dudes en contactarnos directamente.</p>
    <p>Gracias por tu confianza.</p>

    <p style="margin-top: 32px;">Atentamente,<br /><strong>${businessName}</strong></p>
  `

  await transporter.sendMail({
    from: `"${businessName} via ${brandName}" <${process.env.SMTP_USER}>`,
    to,
    subject: `Factura ${invoiceNumber} de ${businessName} — ${formattedTotal}`,
    html: baseTemplate(content),
  })
}

// Welcome email when a user registers
export async function sendWelcomeEmail(
  to: string,
  businessName: string,
  plan: string
): Promise<void> {
  const planLabels: Record<string, string> = {
    basic: 'Básico',
    pro: 'Pro',
    enterprise: 'Enterprise',
  }
  const planLabel = planLabels[plan] || plan

  const content = `
    <h2>¡Bienvenido a ${brandName}! 🎉</h2>
    <p>Hola,</p>
    <p>Es un placer tenerte con nosotros. Tu negocio <strong>${businessName}</strong> ya está registrado en ${brandName} con el plan <span class="badge badge-success">${planLabel}</span>.</p>

    <div class="highlight-box">
      <p>✅ Gestión de clientes y facturas</p>
      <p>✅ Control de inventario en tiempo real</p>
      <p>✅ Campañas de marketing integradas</p>
      <p>✅ Inteligencia artificial para tu negocio</p>
      <p>✅ Analíticas y reportes detallados</p>
    </div>

    <p>Comienza ahora explorando tu panel de control:</p>
    <p style="text-align:center; margin: 28px 0;">
      <a href="${process.env.FRONTEND_URL || 'https://app.negociosmart.com'}/dashboard" class="btn">
        Ir a mi panel →
      </a>
    </p>

    <p>Si necesitas ayuda para comenzar, nuestro equipo está disponible para ti. También puedes consultar nuestra <a href="${process.env.FRONTEND_URL || 'https://app.negociosmart.com'}/ayuda" style="color:${brandColor}">guía de inicio rápido</a>.</p>

    <p style="margin-top: 32px;">Con gusto,<br /><strong>El equipo de ${brandName}</strong></p>
  `

  await transporter.sendMail({
    from: `"${brandName}" <${process.env.SMTP_USER}>`,
    to,
    subject: `¡Bienvenido a ${brandName}, ${businessName}! 🚀`,
    html: baseTemplate(content),
  })
}

// Low stock alert email
export async function sendLowStockAlert(
  to: string,
  products: Array<{ name: string; stock: number; minStock: number }>
): Promise<void> {
  const rows = products
    .map((p) => {
      const urgency =
        p.stock === 0
          ? `<span class="badge badge-danger">Sin stock</span>`
          : `<span class="badge badge-warning">Stock bajo</span>`
      return `
        <tr>
          <td>${p.name}</td>
          <td style="text-align:center;">${p.stock}</td>
          <td style="text-align:center;">${p.minStock}</td>
          <td style="text-align:center;">${urgency}</td>
        </tr>
      `
    })
    .join('')

  const content = `
    <h2>⚠️ Alerta de stock bajo</h2>
    <p>Hola,</p>
    <p>Los siguientes productos en tu inventario han alcanzado o están por debajo del nivel mínimo de stock. Te recomendamos realizar un pedido a tus proveedores a la brevedad.</p>

    <table class="table">
      <thead>
        <tr>
          <th>Producto</th>
          <th style="text-align:center;">Stock actual</th>
          <th style="text-align:center;">Stock mínimo</th>
          <th style="text-align:center;">Estado</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>

    <p style="text-align:center; margin: 28px 0;">
      <a href="${process.env.FRONTEND_URL || 'https://app.negociosmart.com'}/inventario" class="btn">
        Ver inventario →
      </a>
    </p>

    <p style="margin-top: 32px;">Saludos,<br /><strong>El equipo de ${brandName}</strong></p>
  `

  await transporter.sendMail({
    from: `"${brandName} Alertas" <${process.env.SMTP_USER}>`,
    to,
    subject: `⚠️ Alerta: ${products.length} producto(s) con stock bajo`,
    html: baseTemplate(content),
  })
}

// Campaign bulk email
export async function sendCampaignEmail(
  to: string[],
  subject: string,
  body: string,
  fromName: string
): Promise<void> {
  const content = `
    <div style="font-size: 15px; line-height: 1.8; color: #374151;">
      ${body
        .split('\n')
        .map((line) => `<p>${line || '&nbsp;'}</p>`)
        .join('')}
    </div>
    <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 32px 0;" />
    <p style="font-size: 12px; color: #9CA3AF; text-align: center;">
      Este mensaje fue enviado por <strong>${fromName}</strong> a través de ${brandName}.<br />
      Si no deseas recibir más mensajes, puedes <a href="${process.env.FRONTEND_URL || 'https://app.negociosmart.com'}/desuscribirse" style="color:${brandColor}">cancelar tu suscripción aquí</a>.
    </p>
  `

  // Send in batches to avoid SMTP limits (50 per batch)
  const batchSize = 50
  for (let i = 0; i < to.length; i += batchSize) {
    const batch = to.slice(i, i + batchSize)
    await transporter.sendMail({
      from: `"${fromName}" <${process.env.SMTP_USER}>`,
      bcc: batch,
      subject,
      html: baseTemplate(content),
    })
  }
}
