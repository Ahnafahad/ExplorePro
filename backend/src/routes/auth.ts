import express from 'express'
import { authenticate } from '../middleware/auth.js'
import { authController } from '../controllers/authController.js'

const router = express.Router()

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', (req, res) => authController.register(req, res))

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', (req, res) => authController.login(req, res))

/**
 * POST /api/auth/logout
 * Logout user
 */
router.post('/logout', authenticate, (req, res) => authController.logout(req, res))

/**
 * GET /api/auth/me
 * Get current user
 */
router.get('/me', authenticate, (req, res) => authController.getCurrentUser(req, res))

export default router
