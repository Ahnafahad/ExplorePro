import { PollingUpdate } from '../types/index.js'

/**
 * Polling Service
 * Manages real-time updates using HTTP long-polling instead of WebSockets
 * This is suitable for Vercel serverless functions
 */

class PollingService {
  private pendingUpdates: Map<string, PollingUpdate[]> = new Map()

  /**
   * Add an update for a specific user
   */
  addUpdate(userId: string, update: PollingUpdate) {
    const userUpdates = this.pendingUpdates.get(userId) || []
    userUpdates.push(update)
    this.pendingUpdates.set(userId, userUpdates)

    // Cleanup old updates (keep only last 50)
    if (userUpdates.length > 50) {
      this.pendingUpdates.set(userId, userUpdates.slice(-50))
    }
  }

  /**
   * Get all pending updates for a user since a timestamp
   */
  getUpdates(userId: string, since?: string): PollingUpdate[] {
    const userUpdates = this.pendingUpdates.get(userId) || []

    if (!since) {
      return userUpdates
    }

    const sinceDate = new Date(since)
    return userUpdates.filter((update) => new Date(update.timestamp) > sinceDate)
  }

  /**
   * Clear updates for a user
   */
  clearUpdates(userId: string) {
    this.pendingUpdates.delete(userId)
  }

  /**
   * Add booking status update
   */
  addBookingUpdate(userId: string, bookingId: string, status: string, data?: any) {
    this.addUpdate(userId, {
      type: 'booking',
      data: {
        bookingId,
        status,
        ...data,
      },
      timestamp: new Date().toISOString(),
    })
  }

  /**
   * Add new message update
   */
  addMessageUpdate(userId: string, message: any) {
    this.addUpdate(userId, {
      type: 'message',
      data: message,
      timestamp: new Date().toISOString(),
    })
  }

  /**
   * Add location update
   */
  addLocationUpdate(userId: string, bookingId: string, latitude: number, longitude: number) {
    this.addUpdate(userId, {
      type: 'location',
      data: {
        bookingId,
        latitude,
        longitude,
      },
      timestamp: new Date().toISOString(),
    })
  }
}

// Singleton instance
export const pollingService = new PollingService()
