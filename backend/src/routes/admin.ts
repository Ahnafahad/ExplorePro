import express from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import { adminController } from '../controllers/adminController.js'

const router = express.Router()

// All admin routes require ADMIN role
router.use(authenticate)
router.use(authorize('ADMIN'))

/**
 * GET /api/admin/guides/pending
 * Get pending guide applications
 */
router.get('/guides/pending', (req, res) => adminController.getPendingGuides(req, res))

/**
 * GET /api/admin/guides
 * Get all guides (with optional status filter)
 */
router.get('/guides', (req, res) => adminController.getAllGuides(req, res))

/**
 * PUT /api/admin/guides/:id/approve
 * Approve guide
 */
router.put('/guides/:id/approve', (req, res) => adminController.approveGuide(req, res))

/**
 * PUT /api/admin/guides/:id/reject
 * Reject guide
 */
router.put('/guides/:id/reject', (req, res) => adminController.rejectGuide(req, res))

/**
 * PUT /api/admin/guides/:id/suspend
 * Suspend guide
 */
router.put('/guides/:id/suspend', (req, res) => adminController.suspendGuide(req, res))

/**
 * GET /api/admin/bookings
 * Get all bookings
 */
router.get('/bookings', (req, res) => adminController.getAllBookings(req, res))

/**
 * GET /api/admin/stats
 * Get platform statistics
 */
router.get('/stats', (req, res) => adminController.getStatistics(req, res))

export default router
