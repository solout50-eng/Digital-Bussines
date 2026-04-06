import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos NegocioSmart...')

  // Clear existing data
  await prisma.campaign.deleteMany()
  await prisma.aiConversation.deleteMany()
  await prisma.invoice.deleteMany()
  await prisma.product.deleteMany()
  await prisma.client.deleteMany()
  await prisma.business.deleteMany()
  await prisma.user.deleteMany()

  // Create demo user
  const hashedPassword = await bcrypt.hash('Demo1234!', 12)

  const user = await prisma.user.create({
    data: {
      email: 'demo@negociosmart.com',
      password: hashedPassword,
      business: {
        create: {
          name: 'Boutique Zara México',
          country: 'MX',
          plan: 'pro',
          subscriptionStatus: 'active',
          chatbotPrompt: 'Eres el asistente de Boutique Zara México. Ayuda a los clientes con preguntas sobre ropa, tallas, precios y disponibilidad. Sé amable y profesional.',
        },
      },
    },
    include: { business: true },
  })

  const businessId = user.business!.id
  console.log(`✅ Usuario demo creado: demo@negociosmart.com (contraseña: Demo1234!)`)

  // Create clients
  const clientsData = [
    { name: 'Carlos Mendoza García', email: 'carlos.mendoza@gmail.com', phone: '+52 55 1234 5678', address: 'Av. Insurgentes Sur 1234, CDMX', totalSpent: 15400, tags: ['VIP', 'frecuente'] },
    { name: 'María Fernández López', email: 'mfernandez@hotmail.com', phone: '+52 33 8765 4321', address: 'Calle López Cotilla 567, Guadalajara', totalSpent: 8200, tags: ['frecuente'] },
    { name: 'Roberto Silva Morales', email: 'roberto.silva@empresa.com', phone: '+52 81 5555 1234', address: 'Av. Constitución 890, Monterrey', totalSpent: 23100, tags: ['VIP', 'mayorista'] },
    { name: 'Ana Patricia Ruiz', email: 'ana.ruiz@gmail.com', phone: '+52 55 9876 5432', address: 'Colonia Polanco, CDMX', totalSpent: 6750, tags: ['frecuente'] },
    { name: 'Diego Alejandro Torres', email: 'dtorres@outlook.com', phone: '+52 664 234 5678', address: 'Blvd. Agua Caliente 123, Tijuana', totalSpent: 3200, tags: [] },
    { name: 'Valentina Gómez Peña', email: 'vgomez@gmail.com', phone: '+52 55 4444 3333', address: 'Santa Fe, CDMX', totalSpent: 11800, tags: ['VIP'] },
    { name: 'Andrés Martínez Vega', email: 'andres.mvega@hotmail.com', phone: '+52 33 2222 1111', address: 'Zapopan, Jalisco', totalSpent: 4500, tags: [] },
    { name: 'Sofía Hernández Cruz', email: 'sofia.hcruz@gmail.com', phone: '+52 55 7777 8888', address: 'Coyoacán, CDMX', totalSpent: 9300, tags: ['frecuente'] },
    { name: 'Miguel Ángel Castillo', email: 'macastillo@empresa.mx', phone: '+52 999 123 4567', address: 'Mérida, Yucatán', totalSpent: 2800, tags: [] },
    { name: 'Lucía Ramírez Solís', email: 'lucia.ramirez@gmail.com', phone: '+52 222 987 6543', address: 'Puebla, Puebla', totalSpent: 7100, tags: ['frecuente'] },
    { name: 'Emilio Vargas Nuñez', email: 'evargas@gmail.com', phone: '+52 55 3333 2222', address: 'Naucalpan, EdoMex', totalSpent: 5600, tags: [] },
    { name: 'Isabella Moreno Díaz', email: 'isabella.moreno@hotmail.com', phone: '+52 33 6666 5555', address: 'Tlaquepaque, Jalisco', totalSpent: 18900, tags: ['VIP', 'frecuente'] },
    { name: 'Fernando Jiménez Alba', email: 'fjimenez@correo.com', phone: '+52 81 8888 9999', address: 'San Pedro, Monterrey', totalSpent: 1200, tags: [] },
    { name: 'Camila Soto Ríos', email: 'camila.soto@gmail.com', phone: '+52 55 1111 0000', address: 'Condesa, CDMX', totalSpent: 14300, tags: ['VIP'] },
    { name: 'Javier Delgado Leal', email: 'jdelgado@empresa.com', phone: '+52 614 345 6789', address: 'Chihuahua, Chihuahua', totalSpent: 3900, tags: [] },
  ]

  const clients = await Promise.all(
    clientsData.map((c) =>
      prisma.client.create({
        data: { ...c, businessId },
      })
    )
  )
  console.log(`✅ ${clients.length} clientes creados`)

  // Create products (fashion boutique)
  const productsData = [
    { name: 'Camiseta Premium Algodón', sku: 'CAM-001', category: 'Camisetas', price: 450, cost: 180, stock: 85, minStock: 20, description: 'Camiseta 100% algodón pima, varios colores' },
    { name: 'Pantalón Cargo Premium', sku: 'PAN-001', category: 'Pantalones', price: 890, cost: 320, stock: 42, minStock: 15, description: 'Pantalón cargo con múltiples bolsillos' },
    { name: 'Sudadera Logo Estampado', sku: 'SUD-001', category: 'Sudaderas', price: 750, cost: 280, stock: 63, minStock: 20, description: 'Sudadera con logo bordado, tela fleece' },
    { name: 'Vestido Floral Verano', sku: 'VES-001', category: 'Vestidos', price: 980, cost: 380, stock: 28, minStock: 10, description: 'Vestido floral midi, tela ligera' },
    { name: 'Shorts Deportivos', sku: 'SHO-001', category: 'Shorts', price: 350, cost: 130, stock: 7, minStock: 15, description: 'Shorts deportivos con bolsillos laterales' },
    { name: 'Blazer Casual Mujer', sku: 'BLA-001', category: 'Blazers', price: 1450, cost: 560, stock: 19, minStock: 8, description: 'Blazer slim fit para mujer, varios colores' },
    { name: 'Jeans Skinny Azul', sku: 'JEA-001', category: 'Jeans', price: 790, cost: 290, stock: 55, minStock: 20, description: 'Jeans skinny clásicos denim azul' },
    { name: 'Chamarra Bomber', sku: 'CHA-001', category: 'Chamarras', price: 1290, cost: 490, stock: 4, minStock: 10, description: 'Chamarra bomber con forro interior' },
    { name: 'Falda Plisada Mini', sku: 'FAL-001', category: 'Faldas', price: 520, cost: 195, stock: 33, minStock: 12, description: 'Falda plisada con cintura elástica' },
    { name: 'Camisola Seda', sku: 'CAM-002', category: 'Camisas', price: 680, cost: 255, stock: 24, minStock: 10, description: 'Camisola tipo seda, varios estampados' },
    { name: 'Traje de Baño Bikini', sku: 'TRA-001', category: 'Baño', price: 590, cost: 220, stock: 0, minStock: 15, description: 'Bikini con estampado tropical' },
    { name: 'Pijama Set Satín', sku: 'PIJ-001', category: 'Pijamas', price: 850, cost: 320, stock: 41, minStock: 12, description: 'Conjunto pijama satinado 2 piezas' },
  ]

  const products = await Promise.all(
    productsData.map((p) =>
      prisma.product.create({
        data: {
          ...p,
          stockValue: p.stock * p.cost,
          businessId,
        },
      })
    )
  )
  console.log(`✅ ${products.length} productos creados`)

  // Create invoices
  const invoicesData = [
    { clientIndex: 0, status: 'paid', total: 2250, tax: 360, subtotal: 1890, currency: 'MXN', daysAgo: 2, paidDaysAgo: 1 },
    { clientIndex: 1, status: 'paid', total: 1580, tax: 253, subtotal: 1327, currency: 'MXN', daysAgo: 5, paidDaysAgo: 4 },
    { clientIndex: 2, status: 'sent', total: 4200, tax: 672, subtotal: 3528, currency: 'MXN', daysAgo: 7, dueDaysFromNow: 8 },
    { clientIndex: 3, status: 'paid', total: 890, tax: 142, subtotal: 748, currency: 'MXN', daysAgo: 10, paidDaysAgo: 8 },
    { clientIndex: 4, status: 'overdue', total: 1750, tax: 280, subtotal: 1470, currency: 'MXN', daysAgo: 30, dueDaysFromNow: -15 },
    { clientIndex: 5, status: 'paid', total: 3100, tax: 496, subtotal: 2604, currency: 'MXN', daysAgo: 15, paidDaysAgo: 12 },
    { clientIndex: 6, status: 'draft', total: 650, tax: 104, subtotal: 546, currency: 'MXN', daysAgo: 1, dueDaysFromNow: 30 },
    { clientIndex: 7, status: 'sent', total: 2400, tax: 384, subtotal: 2016, currency: 'MXN', daysAgo: 3, dueDaysFromNow: 12 },
    { clientIndex: 8, status: 'paid', total: 780, tax: 125, subtotal: 655, currency: 'MXN', daysAgo: 20, paidDaysAgo: 18 },
    { clientIndex: 9, status: 'paid', total: 1900, tax: 304, subtotal: 1596, currency: 'MXN', daysAgo: 8, paidDaysAgo: 6 },
    { clientIndex: 10, status: 'overdue', total: 560, tax: 90, subtotal: 470, currency: 'MXN', daysAgo: 45, dueDaysFromNow: -20 },
    { clientIndex: 11, status: 'paid', total: 5400, tax: 864, subtotal: 4536, currency: 'MXN', daysAgo: 12, paidDaysAgo: 10 },
  ]

  let invoiceNum = 1001
  for (const inv of invoicesData) {
    const createdAt = new Date()
    createdAt.setDate(createdAt.getDate() - inv.daysAgo)

    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + (inv.dueDaysFromNow ?? 30))

    let paidAt = null
    if (inv.paidDaysAgo !== undefined) {
      paidAt = new Date()
      paidAt.setDate(paidAt.getDate() - inv.paidDaysAgo)
    }

    await prisma.invoice.create({
      data: {
        number: `F-2025-${invoiceNum++}`,
        status: inv.status,
        subtotal: inv.subtotal,
        tax: inv.tax,
        total: inv.total,
        currency: inv.currency,
        dueDate,
        paidAt,
        createdAt,
        items: [
          { description: 'Ropa y accesorios', quantity: 2, unitPrice: inv.subtotal / 2, total: inv.subtotal },
        ],
        businessId,
        clientId: clients[inv.clientIndex].id,
      },
    })
  }
  console.log(`✅ ${invoicesData.length} facturas creadas`)

  // Update client total spent
  await Promise.all(
    clients.slice(0, 5).map((c) =>
      prisma.client.update({
        where: { id: c.id },
        data: { totalSpent: clientsData[clients.indexOf(c)].totalSpent },
      })
    )
  )

  // Create AI conversations
  await prisma.aiConversation.createMany({
    data: [
      {
        businessId,
        channel: 'whatsapp',
        resolved: true,
        leadEmail: 'nuevo.cliente@gmail.com',
        messages: [
          { role: 'user', content: '¿Tienen tallas grandes?', timestamp: new Date().toISOString() },
          { role: 'assistant', content: '¡Hola! Sí, contamos con tallas del XS al 3XL en la mayoría de nuestros productos. ¿Le interesa algún artículo en particular?', timestamp: new Date().toISOString() },
          { role: 'user', content: 'Me interesa el vestido floral', timestamp: new Date().toISOString() },
          { role: 'assistant', content: 'El Vestido Floral Verano está disponible en todas las tallas y tiene un precio de $980 MXN. ¿Le gustaría que le enviara más fotos o proceder con la compra?', timestamp: new Date().toISOString() },
        ],
      },
      {
        businessId,
        channel: 'web',
        resolved: false,
        leadEmail: null,
        messages: [
          { role: 'user', content: '¿Cuáles son los métodos de pago?', timestamp: new Date().toISOString() },
          { role: 'assistant', content: 'Aceptamos tarjetas de crédito/débito (Visa, Mastercard, Amex), transferencia bancaria, PayPal y pago en efectivo en tienda. También ofrecemos MSI sin intereses a 6 y 12 meses. ¿Hay algo más en lo que pueda ayudarte?', timestamp: new Date().toISOString() },
        ],
      },
      {
        businessId,
        channel: 'instagram',
        resolved: true,
        leadEmail: 'compradora@gmail.com',
        messages: [
          { role: 'user', content: '¿Hacen envíos a Guadalajara?', timestamp: new Date().toISOString() },
          { role: 'assistant', content: '¡Claro que sí! Hacemos envíos a toda la República Mexicana. A Guadalajara el envío estándar es de 2-3 días hábiles y cuesta $99 MXN (gratis en compras mayores a $1,500). ¿Te puedo ayudar con algo más?', timestamp: new Date().toISOString() },
        ],
      },
    ],
  })
  console.log('✅ 3 conversaciones IA creadas')

  // Create campaigns
  await prisma.campaign.createMany({
    data: [
      {
        businessId,
        name: 'Descuentos de Primavera 2025',
        type: 'email',
        status: 'completed',
        subject: '🌸 Hasta 40% de descuento en nuestra colección Primavera',
        body: 'Estimada/o cliente, este mes celebramos la primavera con descuentos increíbles en toda nuestra colección...',
        recipients: 480,
        opened: 192,
        clicked: 67,
        sentAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      },
      {
        businessId,
        name: 'Nuevos Arrivals - WhatsApp',
        type: 'whatsapp',
        status: 'completed',
        body: '¡Hola! Llegaron nuevos arrivals a Boutique Zara México 🎉 Vestidos, blusas y más. ¡Pásate o compra en línea con 10% OFF usando el código NUEVO10!',
        recipients: 234,
        opened: 210,
        clicked: 89,
        sentAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        businessId,
        name: 'Reactivación clientes inactivos',
        type: 'email',
        status: 'scheduled',
        subject: '¡Te echamos de menos! Aquí tienes un regalo especial',
        body: 'Han pasado 3 meses desde tu última compra y queremos que vuelvas con un 20% de descuento exclusivo...',
        recipients: 0,
        opened: 0,
        clicked: 0,
        scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      },
      {
        businessId,
        name: 'Verano 2025 - Instagram',
        type: 'instagram',
        status: 'draft',
        body: '☀️ La colección verano 2025 ya está aquí. Descubre vestidos, bikinis y shorts perfectos para la temporada. Link en bio.',
        recipients: 0,
        opened: 0,
        clicked: 0,
      },
    ],
  })
  console.log('✅ 4 campañas de marketing creadas')

  console.log('\n🚀 Seed completado exitosamente!')
  console.log('📧 Usuario demo: demo@negociosmart.com')
  console.log('🔐 Contraseña: Demo1234!')
}

main()
  .catch((e) => {
    console.error('Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
