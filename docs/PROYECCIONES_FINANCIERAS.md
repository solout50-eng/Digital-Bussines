# NegocioSmart — Proyecciones Financieras

## Supuestos del Modelo

| Parámetro | Valor |
|-----------|-------|
| Distribución de planes (Básico/Pro/Empresa) | 50% / 40% / 10% |
| Precio Básico | $29 USD/mes |
| Precio Pro | $99 USD/mes |
| Precio Empresa | $299 USD/mes |
| Precio promedio ponderado (ARPU) | $89 USD/mes |
| Churn mensual Año 1 | 4.5% |
| Churn mensual Año 2 | 3.0% |
| Churn mensual Año 3 | 2.0% |
| CAC promedio | $120 USD |
| Costo de infraestructura por cliente | $4 USD/mes |
| Costo IA (OpenAI) por cliente | $3 USD/mes |

---

## Año 1 — Crecimiento Inicial

### Adquisición de Clientes (Mensual)

| Mes | Nuevos Clientes | Churn | Clientes Activos | MRR |
|-----|----------------|-------|-----------------|-----|
| 1 | 20 | 0 | 20 | $1,780 |
| 2 | 30 | 1 | 49 | $4,361 |
| 3 | 40 | 2 | 87 | $7,743 |
| 4 | 50 | 4 | 133 | $11,837 |
| 5 | 60 | 6 | 187 | $16,643 |
| 6 | 70 | 8 | 249 | $22,161 |
| 7 | 70 | 11 | 308 | $27,412 |
| 8 | 70 | 14 | 364 | $32,396 |
| 9 | 70 | 16 | 418 | $37,202 |
| 10 | 60 | 19 | 459 | $40,851 |
| 11 | 50 | 21 | 488 | $43,432 |
| 12 | 40 | 22 | 506 | $45,034 |
| **TOTAL** | **630** | **124** | **506** | **~$45K** |

**ARR Año 1: $180,000 USD**

### Estado de Resultados Año 1

| Concepto | Monto (USD) |
|---------|-------------|
| **Ingresos** | |
| Ingresos por suscripciones | $180,000 |
| Ingresos servicios adicionales | $8,000 |
| **Total Ingresos** | **$188,000** |
| | |
| **Costos Directos (COGS)** | |
| Infraestructura AWS | $24,000 |
| Costos IA (OpenAI) | $18,000 |
| Procesamiento pagos (Stripe ~2.9%) | $5,220 |
| **Total COGS** | **$47,220** |
| **Margen Bruto** | **$140,780 (74.9%)** |
| | |
| **Gastos Operativos** | |
| Salarios (4 personas) | $120,000 |
| Marketing y adquisición | $75,600 |
| Herramientas y SaaS | $12,000 |
| Legal y contabilidad | $8,000 |
| Oficina/coworking | $6,000 |
| **Total OpEx** | **$221,600** |
| | |
| **EBITDA** | **-$80,820** |
| **EBITDA Margin** | **-43%** |

> Nota: Año 1 es típicamente negativo en SaaS. Se invierte en adquisición de clientes y construcción del producto.

---

## Año 2 — Crecimiento Acelerado

### Métricas Clave

| Métrica | Valor |
|---------|-------|
| Clientes inicio del año | 506 |
| Nuevos clientes año 2 | 1,980 |
| Churn total año 2 | 486 |
| Clientes fin del año | **2,000** |
| MRR Diciembre | $178,000 |
| **ARR Año 2** | **$720,000** |

### Estado de Resultados Año 2

| Concepto | Monto (USD) |
|---------|-------------|
| **Ingresos totales** | **$750,000** |
| Total COGS | $150,000 |
| **Margen Bruto** | **$600,000 (80%)** |
| Salarios (8 personas) | $280,000 |
| Marketing | $180,000 |
| Otros OpEx | $60,000 |
| **Total OpEx** | **$520,000** |
| **EBITDA** | **$80,000** |
| **EBITDA Margin** | **10.7%** |

> Punto de equilibrio alcanzado en el mes 14 aproximadamente.

---

## Año 3 — Escala Rentable

### Métricas Clave

| Métrica | Valor |
|---------|-------|
| Clientes inicio del año | 2,000 |
| Nuevos clientes año 3 | 7,440 |
| Churn total año 3 | 1,440 |
| Clientes fin del año | **8,000** |
| MRR Diciembre | $712,000 |
| **ARR Año 3** | **$2,880,000** |

### Estado de Resultados Año 3

| Concepto | Monto (USD) |
|---------|-------------|
| **Ingresos totales** | **$3,000,000** |
| Total COGS | $480,000 |
| **Margen Bruto** | **$2,520,000 (84%)** |
| Salarios (20 personas) | $900,000 |
| Marketing | $450,000 |
| Otros OpEx | $200,000 |
| **Total OpEx** | **$1,550,000** |
| **EBITDA** | **$970,000** |
| **EBITDA Margin** | **32.3%** |

---

## Métricas SaaS — Resumen 3 Años

| Métrica | Año 1 | Año 2 | Año 3 |
|---------|-------|-------|-------|
| MRR (Dic) | $45,000 | $178,000 | $712,000 |
| ARR | $180,000 | $720,000 | $2,880,000 |
| Clientes activos | 506 | 2,000 | 8,000 |
| ARPU | $89 | $90 | $89 |
| Churn mensual | 4.5% | 3.0% | 2.0% |
| CAC | $120 | $91 | $61 |
| LTV (12 meses) | $665 | $892 | $1,336 |
| LTV/CAC | 5.5x | 9.8x | 21.9x |
| NPS | 45 | 58 | 68 |
| Margen bruto | 75% | 80% | 84% |
| EBITDA | -$80K | $80K | $970K |

---

## Flujo de Caja Proyectado

### Necesidades de Capital

| Período | Flujo de Caja | Acumulado |
|---------|--------------|-----------|
| Pre-lanzamiento | -$50,000 | -$50,000 |
| Año 1 (Q1) | -$35,000 | -$85,000 |
| Año 1 (Q2) | -$25,000 | -$110,000 |
| Año 1 (Q3) | -$15,000 | -$125,000 |
| Año 1 (Q4) | -$5,000 | -$130,000 |
| Año 2 (Q1) | +$5,000 | -$125,000 |
| Año 2 (Q2) | +$15,000 | -$110,000 |
| Año 2 (Q3) | +$30,000 | -$80,000 |
| Año 2 (Q4) | +$30,000 | -$50,000 |
| Año 3 | +$970,000 | +$920,000 |

**Capital mínimo necesario para llegar a rentabilidad: $150,000 USD**

---

## Escenarios

### Escenario Conservador (50% de las metas)
- Año 3: 4,000 clientes, $1,440,000 ARR, EBITDA +$200K

### Escenario Base (100% - metas presentadas)
- Año 3: 8,000 clientes, $2,880,000 ARR, EBITDA +$970K

### Escenario Optimista (150% de las metas)
- Año 3: 12,000 clientes, $4,320,000 ARR, EBITDA +$1,700K

---

## Estrategia de Expansión de Ingresos

### Upselling (aumentar plan)
- Tasa objetivo: 15% de clientes Básico → Pro cada año
- Impacto en ARPU: +$8/mes por cliente

### Add-ons (ingresos adicionales)
- Números de WhatsApp Business: $15/mes
- Créditos de SMS adicionales: $10/1,000 SMS
- Consultoría de onboarding: $299 único
- Integraciones premium: $20/mes

### Potencial de ingresos adicionales Año 3: +$400,000 USD
