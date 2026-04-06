# NegocioSmart — Plataforma SaaS de IA para PYMEs Latinoamericanas

> La plataforma todo-en-uno para gestionar y hacer crecer tu negocio con Inteligencia Artificial.

## ¿Qué es NegocioSmart?

NegocioSmart es una plataforma SaaS (Software como Servicio) que integra en un solo lugar todas las herramientas que una PYME latinoamericana necesita:

| Módulo | Descripción |
|--------|-------------|
| **Asistente IA** | Chatbot con GPT-4o para atención al cliente 24/7 en WhatsApp, web e Instagram |
| **Facturación** | Facturas electrónicas válidas en México (CFDI), Colombia (RADIAN) y Argentina (AFIP) |
| **Inventario** | Control de stock en tiempo real con alertas y múltiples almacenes |
| **CRM** | Gestión de clientes, pipeline de ventas y seguimiento de leads |
| **Marketing** | Campañas automáticas de email, WhatsApp y redes sociales con IA |
| **Analytics** | Dashboard en tiempo real con predicciones de IA |

## Planes y Precios

| Plan | Precio | Para quién |
|------|--------|-----------|
| Básico | $29 USD/mes | Emprendedores y negocios pequeños |
| Pro | $99 USD/mes | Negocios en crecimiento |
| Empresa | $299 USD/mes | Empresas medianas con múltiples sucursales |

## Stack Tecnológico

```
Frontend:   Next.js 14 + TypeScript + Tailwind CSS
Backend:    Node.js + Express + TypeScript
Base datos: PostgreSQL (Prisma ORM)
IA:         OpenAI GPT-4o / GPT-4o-mini
Pagos:      Stripe
Auth:       JWT
Infra:      AWS + Cloudflare
```

## Estructura del Proyecto

```
negociosmart/
├── frontend/               # App Next.js 14
│   ├── src/
│   │   ├── app/           # Pages y layouts (App Router)
│   │   │   ├── page.tsx   # Landing page
│   │   │   └── dashboard/ # Dashboard de usuario
│   │   └── components/    # Componentes reutilizables
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                # API Express
│   ├── src/
│   │   ├── index.ts       # Servidor principal
│   │   ├── routes/        # Rutas de la API
│   │   │   ├── auth.ts    # Registro y login
│   │   │   ├── ai.ts      # IA y chatbot
│   │   │   ├── subscription.ts # Stripe y pagos
│   │   │   └── business.ts # Dashboard y perfil
│   │   └── middleware/    # Auth JWT, rate limiting
│   ├── prisma/
│   │   └── schema.prisma  # Esquema de base de datos
│   └── package.json
│
├── docs/                   # Documentación de negocio
│   ├── PLAN_DE_NEGOCIO.md
│   ├── PROYECCIONES_FINANCIERAS.md
│   └── ESTRATEGIA_MARKETING.md
│
├── docker-compose.yml      # Desarrollo local
├── .env.example            # Variables de entorno
└── package.json            # Workspace root
```

## Instalación y Desarrollo Local

### Requisitos
- Node.js 20+
- PostgreSQL 15+
- npm 10+

### 1. Clonar y configurar

```bash
git clone https://github.com/tu-usuario/negociosmart.git
cd negociosmart

# Copiar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales
```

### 2. Levantar base de datos con Docker

```bash
docker-compose up -d postgres redis
```

### 3. Instalar dependencias

```bash
npm install
npm install --workspace=frontend
npm install --workspace=backend
```

### 4. Configurar base de datos

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Iniciar desarrollo

```bash
# Desde la raíz, inicia frontend + backend
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- API Health: http://localhost:4000/health

## Variables de Entorno

Copia `.env.example` a `.env` y completa:

```env
# Base de datos
DATABASE_URL="postgresql://user:password@localhost:5432/negociosmart"

# JWT
JWT_SECRET="tu-secreto-seguro-aqui"

# OpenAI
OPENAI_API_KEY="sk-..."

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Frontend
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

## API Endpoints

### Autenticación
```
POST /api/auth/register     Crear cuenta
POST /api/auth/login        Iniciar sesión
POST /api/auth/forgot-password  Recuperar contraseña
```

### Suscripciones
```
GET  /api/subscriptions/plans       Ver planes disponibles
POST /api/subscriptions/checkout    Crear sesión de pago Stripe
POST /api/subscriptions/webhook     Webhook de Stripe
```

### Inteligencia Artificial
```
POST /api/ai/chat                   Chat con asistente IA
POST /api/ai/generate-marketing     Generar contenido de marketing (Pro+)
POST /api/ai/analyze-sales          Analizar ventas con IA (Pro+)
POST /api/ai/chatbot-response       Chatbot para clientes finales
```

### Negocio
```
GET  /api/business/dashboard        Métricas del dashboard
GET  /api/business/profile          Perfil del negocio
PUT  /api/business/profile          Actualizar perfil
```

## Despliegue en Producción

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

### Backend (Railway / AWS ECS)
```bash
cd backend
npm run build
# Configurar variables de entorno en el servicio
npm start
```

### Base de datos (Supabase / AWS RDS)
```bash
npx prisma migrate deploy
```

## Métricas del Negocio

| Métrica | Año 1 | Año 2 | Año 3 |
|---------|-------|-------|-------|
| Clientes | 500 | 2,000 | 8,000 |
| ARR | $180K | $720K | $2.88M |
| EBITDA | -$80K | +$80K | +$970K |

Ver análisis completo en [docs/PROYECCIONES_FINANCIERAS.md](docs/PROYECCIONES_FINANCIERAS.md)

## Documentación de Negocio

- [Plan de Negocio Completo](docs/PLAN_DE_NEGOCIO.md)
- [Proyecciones Financieras](docs/PROYECCIONES_FINANCIERAS.md)
- [Estrategia de Marketing](docs/ESTRATEGIA_MARKETING.md)

## Licencia

Propietario — NegocioSmart © 2025. Todos los derechos reservados.
