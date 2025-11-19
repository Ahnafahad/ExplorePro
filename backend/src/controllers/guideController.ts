import { Request, Response } from 'express'
import { guideService } from '../services/guideService.js'
import { z } from 'zod'

const createGuideSchema = z.object({
  bio: z.string().min(50, 'Bio must be at least 50 characters'),
  languages: z.array(z.string()).min(1, 'At least one language is required'),
  specialties: z.array(z.string()).min(1, 'At least one specialty is required'),
  hourlyRate: z.number().min(10, 'Hourly rate must be at least £10'),
  verificationDoc: z.string().url().optional(),
})

const updateGuideSchema = z.object({
  bio: z.string().min(50).optional(),
  languages: z.array(z.string()).optional(),
  specialties: z.array(z.string()).optional(),
  hourlyRate: z.number().min(10).optional(),
  verificationDoc: z.string().url().optional(),
  isAvailable: z.boolean().optional(),
})

export class GuideController {
  /**
   * Create or update guide profile
   */
  async createGuideProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId
      const validatedData = createGuideSchema.parse(req.body)

      const guide = await guideService.createOrUpdateGuide(userId, {
        userId,
        ...validatedData,
      })

      res.status(201).json({
        success: true,
        data: guide,
        message: 'Guide profile created successfully',
      })
    } catch (error: any) {
      console.error('Create guide error:', error)

      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.errors[0].message,
            details: error.errors,
          },
        })
        return
      }

      res.status(400).json({
        success: false,
        error: {
          code: 'CREATE_GUIDE_ERROR',
          message: error.message,
        },
      })
    }
  }

  /**
   * Get guide by ID
   */
  async getGuide(req: Request, res: Response) {
    try {
      const { id } = req.params
      const guide = await guideService.getGuideById(id)

      res.json({
        success: true,
        data: guide,
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
   * List guides with filters
   */
  async listGuides(req: Request, res: Response) {
    try {
      const {
        userId,
        language,
        specialty,
        isAvailable,
        minRate,
        maxRate,
        page = '1',
        limit = '20',
      } = req.query

      // If userId is provided, get guide by userId
      if (userId) {
        try {
          const guide = await guideService.getGuideByUserId(userId as string)
          res.json({
            success: true,
            data: [guide],
          })
          return
        } catch (error: any) {
          res.status(404).json({
            success: false,
            error: {
              code: 'NOT_FOUND',
              message: error.message,
            },
          })
          return
        }
      }

      const filters = {
        language: language as string | undefined,
        specialty: specialty as string | undefined,
        isAvailable: isAvailable === 'true' ? true : isAvailable === 'false' ? false : undefined,
        minRate: minRate ? parseFloat(minRate as string) : undefined,
        maxRate: maxRate ? parseFloat(maxRate as string) : undefined,
      }

      const result = await guideService.listGuides(
        filters,
        parseInt(page as string),
        parseInt(limit as string)
      )

      res.json({
        success: true,
        data: result.guides,
        pagination: result.pagination,
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: error.message,
        },
      })
    }
  }

  /**
   * Update guide profile
   */
  async updateGuide(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const userId = req.user!.userId

      // Verify the guide belongs to the user
      const guide = await guideService.getGuideById(id)
      if (guide.userId !== userId) {
        res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'You can only update your own guide profile',
          },
        })
      }

      const validatedData = updateGuideSchema.parse(req.body)
      const updatedGuide = await guideService.updateGuide(id, validatedData)

      res.json({
        success: true,
        data: updatedGuide,
        message: 'Guide profile updated successfully',
      })
    } catch (error: any) {
      console.error('Update guide error:', error)

      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.errors[0].message,
            details: error.errors,
          },
        })
        return
      }

      res.status(400).json({
        success: false,
        error: {
          code: 'UPDATE_GUIDE_ERROR',
          message: error.message,
        },
      })
    }
  }

  /**
   * Toggle guide availability
   */
  async toggleAvailability(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const userId = req.user!.userId

      // Verify the guide belongs to the user
      const guide = await guideService.getGuideById(id)
      if (guide.userId !== userId) {
        res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'You can only update your own availability',
          },
        })
      }

      const updatedGuide = await guideService.toggleAvailability(id)

      res.json({
        success: true,
        data: updatedGuide,
        message: `Availability ${updatedGuide.isAvailable ? 'enabled' : 'disabled'}`,
      })
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: {
          code: 'TOGGLE_AVAILABILITY_ERROR',
          message: error.message,
        },
      })
    }
  }

  /**
   * Get guide's tours
   */
  async getGuideTours(req: Request, res: Response) {
    try {
      const { id } = req.params
      const guide = await guideService.getGuideById(id)

      res.json({
        success: true,
        data: guide.tours || [],
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
   * Get guide's reviews
   */
  async getGuideReviews(req: Request, res: Response) {
    try {
      const { id } = req.params
      const guide = await guideService.getGuideById(id)

      res.json({
        success: true,
        data: guide.reviews || [],
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
}

export const guideController = new GuideController()
