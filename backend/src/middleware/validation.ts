import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'

export function handleValidationErrors(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Datos inválidos',
      details: errors.array().map((e) => ({ field: (e as any).path, message: e.msg })),
    })
  }
  next()
}
