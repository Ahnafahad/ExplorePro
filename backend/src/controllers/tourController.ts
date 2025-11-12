import { Request, Response } from 'express'
import { tourService } from '../services/tourService.js'
import { z } from 'zod'

const createTourSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  duration: z.number().min(30, 'Duration must be at least 30 minutes'),
  price: z.number().min(10, 'Price must be at least £10'),
})

const updateTourSchema = z.object({
  title: z.string().min(5).optional(),
  description: z.string().min(20).optional(),
  duration: z.number().min(30).optional(),
  price: z.number().min(10).optional(),
  isActive: z.boolean().optional(),
})

export class TourController {
  /**
   * Create a new tour
   */
  async createTour(req: Request, res: Response) {
    try {
      const userId = req.user!.userId
      const validatedData = createTourSchema.parse(req.body)

      // Get guide ID
      const { PrismaClient } = await import('@prisma/client')
      const prisma = new PrismaClient()
      const guide = await prisma.guide.findUnique({
        where: { userId },
      })

      if (!guide) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Guide profile not found',
          },
        })
      }

      const tour = await tourService.createTour({
        ...validatedData,
        guideId: guide.id,
      })

      res.status(201).json({
        success: true,
        data: tour,
        message: 'Tour created successfully',
      })
    } catch (error: any) {
      console.error('Create tour error:', error)

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.errors[0].message,
            details: error.errors,
          },
        })
      }

      res.status(400).json({
        success: false,
        error: {
          code: 'CREATE_TOUR_ERROR',
          message: error.message,
        },
      })
    }
  }

  /**
   * Get tour by ID
   */
  async getTour(req: Request, res: Response) {
    try {
      const { id } = req.params
      const tour = await tourService.getTourById(id)

      res.json({
        success: true,
        data: tour,
      })
    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: error.message,
        },
      })
    }
  }

  /**
   * Update tour
   */
  async updateTour(req: Request, res: Response) {
    try {
      const { id } = req.params
      const userId = req.user!.userId
      const validatedData = updateTourSchema.parse(req.body)

      // Verify tour belongs to user's guide profile
      const tour = await tourService.getTourById(id)
      if (tour.guide.userId !== userId) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'You can only update your own tours',
          },
        })
      }

      const updatedTour = await tourService.updateTour(id, validatedData)

      res.json({
        success: true,
        data: updatedTour,
        message: 'Tour updated successfully',
      })
    } catch (error: any) {
      console.error('Update tour error:', error)

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.errors[0].message,
            details: error.errors,
          },
        })
      }

      res.status(400).json({
        success: false,
        error: {
          code: 'UPDATE_TOUR_ERROR',
          message: error.message,
        },
      })
    }
  }

  /**
   * Delete tour (soft delete)
   */
  async deleteTour(req: Request, res: Response) {
    try {
      const { id } = req.params
      const userId = req.user!.userId

      // Verify tour belongs to user's guide profile
      const tour = await tourService.getTourById(id)
      if (tour.guide.userId !== userId) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'You can only delete your own tours',
          },
        })
      }

      await tourService.deleteTour(id)

      res.json({
        success: true,
        message: 'Tour deleted successfully',
      })
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: {
          code: 'DELETE_TOUR_ERROR',
          message: error.message,
        },
      })
    }
  }
}

export const tourController = new TourController()
