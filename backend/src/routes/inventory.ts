import { Router, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate, AuthenticatedRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

// GET /api/inventory/stats — must be before /:id
router.get('/stats', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const businessId = req.user!.businessId

    const [products, categories, lowStockCount] = await Promise.all([
      prisma.product.findMany({
        where: { businessId, isActive: true },
        select: { stockValue: true, category: true, stock: true, minStock: true },
      }),
      prisma.product.findMany({
        where: { businessId, isActive: true, category: { not: null } },
        select: { category: true },
        distinct: ['category'],
      }),
      prisma.product.count({
        where: {
          businessId,
          isActive: true,
          stock: { lte: prisma.product.fields.minStock },
        },
      }),
    ])

    const totalProducts = products.length
    const totalValue = products.reduce((sum, p) => sum + (p.stockValue || 0), 0)
    const lowStock = products.filter((p) => p.stock <= p.minStock).length
    const categoryList = categories.map((c) => c.category).filter(Boolean)

    res.json({
      totalProducts,
      totalValue,
      lowStockCount: lowStock,
      categories: categoryList,
    })
  } catch (error) {
    console.error('Error al obtener estadísticas de inventario:', error)
    res.status(500).json({ error: 'Error al obtener estadísticas de inventario' })
  }
})

// GET /api/inventory/low-stock — products where stock <= minStock
router.get('/low-stock', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const businessId = req.user!.businessId

    const products = await prisma.product.findMany({
      where: { businessId, isActive: true },
      orderBy: { stock: 'asc' },
    })

    const lowStock = products.filter((p) => p.stock <= p.minStock)

    res.json(lowStock)
  } catch (error) {
    console.error('Error al obtener productos con stock bajo:', error)
    res.status(500).json({ error: 'Error al obtener productos con stock bajo' })
  }
})

// GET /api/inventory — list products
router.get('/', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const businessId = req.user!.businessId
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const search = (req.query.search as string) || ''
    const category = req.query.category as string
    const lowStock = req.query.lowStock === 'true'

    const skip = (page - 1) * limit

    const where: any = {
      businessId,
      isActive: true,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(category && { category }),
    }

    const [allProducts, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      prisma.product.count({ where }),
    ])

    const products = lowStock ? allProducts.filter((p) => p.stock <= p.minStock) : allProducts

    res.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Error al listar inventario:', error)
    res.status(500).json({ error: 'Error al obtener el inventario' })
  }
})

// GET /api/inventory/:id — single product
router.get('/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params
    const businessId = req.user!.businessId

    const product = await prisma.product.findFirst({
      where: { id, businessId },
    })

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }

    res.json(product)
  } catch (error) {
    console.error('Error al obtener producto:', error)
    res.status(500).json({ error: 'Error al obtener el producto' })
  }
})

// POST /api/inventory — create product
router.post('/', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const businessId = req.user!.businessId
    const { name, sku, description, price, cost, stock, minStock, category, imageUrl } = req.body

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'El nombre del producto es requerido' })
    }

    if (price === undefined || Number(price) < 0) {
      return res.status(400).json({ error: 'El precio es requerido y debe ser mayor o igual a 0' })
    }

    // Check duplicate SKU within business
    if (sku) {
      const existing = await prisma.product.findFirst({
        where: { businessId, sku, isActive: true },
      })
      if (existing) {
        return res.status(409).json({ error: 'Ya existe un producto con ese SKU' })
      }
    }

    const parsedCost = Number(cost) || 0
    const parsedStock = Number(stock) || 0
    const stockValue = parsedStock * parsedCost

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        sku: sku || null,
        description: description || null,
        price: Number(price),
        cost: parsedCost,
        stock: parsedStock,
        minStock: Number(minStock) || 5,
        stockValue,
        category: category || null,
        imageUrl: imageUrl || null,
        isActive: true,
        businessId,
      },
    })

    res.status(201).json(product)
  } catch (error) {
    console.error('Error al crear producto:', error)
    res.status(500).json({ error: 'Error al crear el producto' })
  }
})

// PUT /api/inventory/:id — update product
router.put('/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params
    const businessId = req.user!.businessId
    const { name, sku, description, price, cost, stock, minStock, category, imageUrl } = req.body

    const existing = await prisma.product.findFirst({ where: { id, businessId } })
    if (!existing) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }

    if (name !== undefined && (!name || name.trim() === '')) {
      return res.status(400).json({ error: 'El nombre del producto no puede estar vacío' })
    }

    // Check duplicate SKU (exclude current product)
    if (sku && sku !== existing.sku) {
      const duplicate = await prisma.product.findFirst({
        where: { businessId, sku, isActive: true, NOT: { id } },
      })
      if (duplicate) {
        return res.status(409).json({ error: 'Ya existe un producto con ese SKU' })
      }
    }

    const newCost = cost !== undefined ? Number(cost) : existing.cost
    const newStock = stock !== undefined ? Number(stock) : existing.stock
    const stockValue = newStock * newCost

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(sku !== undefined && { sku: sku || null }),
        ...(description !== undefined && { description: description || null }),
        ...(price !== undefined && { price: Number(price) }),
        ...(cost !== undefined && { cost: Number(cost) }),
        ...(stock !== undefined && { stock: Number(stock) }),
        ...(minStock !== undefined && { minStock: Number(minStock) }),
        ...(category !== undefined && { category: category || null }),
        ...(imageUrl !== undefined && { imageUrl: imageUrl || null }),
        stockValue,
      },
    })

    res.json(product)
  } catch (error) {
    console.error('Error al actualizar producto:', error)
    res.status(500).json({ error: 'Error al actualizar el producto' })
  }
})

// DELETE /api/inventory/:id — soft delete
router.delete('/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params
    const businessId = req.user!.businessId

    const existing = await prisma.product.findFirst({ where: { id, businessId } })
    if (!existing) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }

    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    })

    res.json({ message: 'Producto desactivado correctamente' })
  } catch (error) {
    console.error('Error al eliminar producto:', error)
    res.status(500).json({ error: 'Error al eliminar el producto' })
  }
})

// PATCH /api/inventory/:id/stock — adjust stock
router.patch('/:id/stock', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params
    const businessId = req.user!.businessId
    const { adjustment, reason } = req.body

    if (adjustment === undefined || isNaN(Number(adjustment))) {
      return res.status(400).json({ error: 'El ajuste de stock es requerido y debe ser un número' })
    }

    const existing = await prisma.product.findFirst({ where: { id, businessId } })
    if (!existing) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }

    const newStock = existing.stock + Number(adjustment)
    if (newStock < 0) {
      return res.status(400).json({
        error: `Stock insuficiente. Stock actual: ${existing.stock}, ajuste solicitado: ${adjustment}`,
      })
    }

    const stockValue = newStock * existing.cost

    const product = await prisma.product.update({
      where: { id },
      data: { stock: newStock, stockValue },
    })

    res.json({
      product,
      adjustment: Number(adjustment),
      reason: reason || 'Ajuste manual',
      previousStock: existing.stock,
      newStock,
    })
  } catch (error) {
    console.error('Error al ajustar stock:', error)
    res.status(500).json({ error: 'Error al ajustar el stock' })
  }
})

export default router
