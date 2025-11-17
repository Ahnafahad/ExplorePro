import { Request, Response } from 'express'
import { adminService } from '../services/adminService.js'
import { GuideStatus } from '@prisma/client'

export class AdminController {
  /**
   * Get pending guide applications
   */
  async getPendingGuides(_req: Request, res: Response): Promise<void> {
    try {
      const guides = await adminService.getPendingGuides()

      res.json({
        success: true,
        data: guides,
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
   * Approve guide
   */
  async approveGuide(req: Request, res: Response) {
    try {
      const { id } = req.params
      const guide = await adminService.approveGuide(id)

      res.json({
        success: true,
        data: guide,
        message: 'Guide approved successfully',
      })
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: {
          code: 'APPROVE_GUIDE_ERROR',
          message: error.message,
        },
      })
    }
  }

  /**
   * Reject guide
   */
  async rejectGuide(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { reason } = req.body

      const guide = await adminService.rejectGuide(id, reason)

      res.json({
        success: true,
        data: guide,
        message: 'Guide rejected successfully',
      })
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: {
          code: 'REJECT_GUIDE_ERROR',
          message: error.message,
        },
      })
    }
  }

  /**
   * Suspend guide
   */
  async suspendGuide(req: Request, res: Response) {
    try {
      const { id } = req.params
      const guide = await adminService.suspendGuide(id)

      res.json({
        success: true,
        data: guide,
        message: 'Guide suspended successfully',
      })
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: {
          code: 'SUSPEND_GUIDE_ERROR',
          message: error.message,
        },
      })
    }
  }

  /**
   * Get platform statistics
   */
  async getStatistics(_req: Request, res: Response): Promise<void> {
    try {
      const stats = await adminService.getStatistics()

      res.json({
        success: true,
        data: stats,
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
   * Get all guides
   */
  async getAllGuides(req: Request, res: Response) {
    try {
      const status = req.query.status as GuideStatus | undefined
      const guides = await adminService.getAllGuides(status)

      res.json({
        success: true,
        data: guides,
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
   * Get all bookings
   */
  async getAllBookings(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 50

      const result = await adminService.getAllBookings(page, limit)

      res.json({
        success: true,
        data: result.bookings,
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
}

export const adminController = new AdminController()
