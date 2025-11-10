import { api } from './api'
import type { PollingUpdate } from '../types'

/**
 * Polling Service for Frontend
 * Polls the backend for real-time updates instead of using WebSockets
 * This is compatible with Vercel serverless deployment
 */

export class PollingService {
  private intervalId: number | null = null
  private lastTimestamp: string | null = null
  private callbacks: Map<string, (update: PollingUpdate) => void> = new Map()
  private pollingInterval: number = 3000 // Poll every 3 seconds

  /**
   * Start polling for updates
   */
  start() {
    if (this.intervalId) {
      console.warn('Polling already started')
      return
    }

    console.log('Starting polling service...')
    this.poll() // Initial poll
    this.intervalId = window.setInterval(() => this.poll(), this.pollingInterval)
  }

  /**
   * Stop polling
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
      this.lastTimestamp = null
      console.log('Polling service stopped')
    }
  }

  /**
   * Set polling interval
   */
  setInterval(ms: number) {
    this.pollingInterval = ms
    if (this.intervalId) {
      this.stop()
      this.start()
    }
  }

  /**
   * Subscribe to updates of a specific type
   */
  on(type: string, callback: (update: PollingUpdate) => void) {
    this.callbacks.set(type, callback)
  }

  /**
   * Unsubscribe from updates
   */
  off(type: string) {
    this.callbacks.delete(type)
  }

  /**
   * Poll for updates
   */
  private async poll() {
    try {
      const params = this.lastTimestamp ? { since: this.lastTimestamp } : {}
      const response = await api.get<{ updates: PollingUpdate[]; timestamp: string }>(
        '/api/polling/updates',
        params
      )

      if (response.success && response.data) {
        const { updates, timestamp } = response.data
        this.lastTimestamp = timestamp

        // Process updates
        updates.forEach((update) => {
          const callback = this.callbacks.get(update.type)
          if (callback) {
            callback(update)
          }
          // Also trigger a generic callback
          const genericCallback = this.callbacks.get('*')
          if (genericCallback) {
            genericCallback(update)
          }
        })
      }
    } catch (error) {
      console.error('Polling error:', error)
      // Don't stop polling on error, just log it
    }
  }

  /**
   * Clear all pending updates on the server
   */
  async clearUpdates() {
    try {
      await api.delete('/api/polling/updates')
    } catch (error) {
      console.error('Failed to clear updates:', error)
    }
  }
}

// Singleton instance
export const pollingService = new PollingService()
