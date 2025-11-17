/**
 * Demo Service - Handles all mock API responses for demo mode
 * This service intercepts API calls and returns mock data from JSON files
 */

import guidesData from '@/data/demo/guides.json';
import toursData from '@/data/demo/tours.json';
import bookingsData from '@/data/demo/bookings.json';
import reviewsData from '@/data/demo/reviews.json';
import messagesData from '@/data/demo/messages.json';
import notificationsData from '@/data/demo/notifications.json';
import analyticsData from '@/data/demo/analytics.json';
import pendingGuidesData from '@/data/demo/pendingGuides.json';
import achievementsData from '@/data/demo/achievements.json';
import gpsRoutesData from '@/data/demo/gpsRoutes.json';
import accountsData from '@/data/demo/accounts.json';

const DEMO_ACCOUNTS = {
  tourist: 'demo-tourist@explorepro.com',
  guide: 'demo-guide@explorepro.com',
  admin: 'demo-admin@explorepro.com',
};

const DEMO_PASSWORD = 'demo123';

/**
 * Type Transformers - Convert JSON data to match TypeScript interfaces
 */

// Transform flat guide JSON to proper Guide interface with nested user
const transformGuide = (guideData: any): any => {
  const { name, email, photo, rating, reviewCount, ...rest } = guideData;

  return {
    ...rest,
    user: {
      id: guideData.userId,
      email: email || '',
      role: 'GUIDE' as const,
      name: name || '',
      phone: '',
      photo: photo || '',
      createdAt: guideData.joinedDate || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    averageRating: rating,
    totalReviews: reviewCount || 0,
  };
};

// Transform booking JSON to include updatedAt
const transformBooking = (bookingData: any): any => {
  return {
    ...bookingData,
    updatedAt: bookingData.updatedAt || bookingData.createdAt || new Date().toISOString(),
  };
};

// Storage keys
const STORAGE_KEYS = {
  CURRENT_USER: 'demo_current_user',
  BOOKINGS: 'demo_bookings',
  MESSAGES: 'demo_messages',
  NOTIFICATIONS: 'demo_notifications',
  REVIEWS: 'demo_reviews',
  GUIDES: 'demo_guides',
  PENDING_GUIDES: 'demo_pending_guides',
};

/**
 * Check if user is in demo mode
 */
export const isDemoMode = (): boolean => {
  const user = getCurrentDemoUser();
  return user !== null && Object.values(DEMO_ACCOUNTS).includes(user.email);
};

/**
 * Check if email is a demo account
 */
export const isDemoAccount = (email: string): boolean => {
  return Object.values(DEMO_ACCOUNTS).includes(email);
};

/**
 * Get current demo user from localStorage
 */
export const getCurrentDemoUser = (): any => {
  const userStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Set current demo user
 */
export const setCurrentDemoUser = (user: any): void => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
};

/**
 * Clear demo user session
 */
export const clearDemoUser = (): void => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

/**
 * Reset all demo data to initial state
 */
export const resetDemoData = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  window.location.reload();
};

/**
 * Get data from localStorage or fallback to initial data
 */
const getStoredData = <T>(key: string, fallback: T): T => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : fallback;
};

/**
 * Save data to localStorage
 */
const saveStoredData = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

/**
 * Simulate network delay
 */
const delay = (ms: number = 500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Auth Service
 */
export const demoAuthService = {
  login: async (email: string, password: string) => {
    await delay(1000);

    if (!isDemoAccount(email)) {
      throw new Error('Invalid email or password');
    }

    if (password !== DEMO_PASSWORD) {
      throw new Error('Invalid email or password');
    }

    const account = accountsData.find(acc => acc.email === email);
    if (!account) {
      throw new Error('Account not found');
    }

    const { password: _, ...userWithoutPassword } = account;
    setCurrentDemoUser(userWithoutPassword);

    return {
      success: true,
      data: {
        user: userWithoutPassword,
        token: `demo_token_${Date.now()}`,
      },
    };
  },

  logout: async () => {
    await delay(300);
    clearDemoUser();
    return { success: true };
  },

  me: async () => {
    const user = getCurrentDemoUser();
    if (!user) {
      throw new Error('Not authenticated');
    }
    return { success: true, data: user };
  },
};

/**
 * Guides Service
 */
export const demoGuidesService = {
  getAll: async (filters?: any) => {
    await delay();
    let guides = getStoredData(STORAGE_KEYS.GUIDES, guidesData);

    // Apply filters
    if (filters) {
      if (filters.specialty) {
        guides = guides.filter(g => g.specialties.includes(filters.specialty));
      }
      if (filters.language) {
        guides = guides.filter(g => g.languages.includes(filters.language));
      }
      if (filters.isAvailable !== undefined) {
        guides = guides.filter(g => g.isAvailable === filters.isAvailable);
      }
      if (filters.minRating) {
        const rating = filters.minRating;
        guides = guides.filter(g => (g.rating || g.averageRating || 0) >= rating);
      }
    }

    // Transform guides to match TypeScript interface
    const transformedGuides = guides.map(transformGuide);
    return { success: true, data: transformedGuides };
  },

  getById: async (id: string) => {
    await delay();
    const guides = getStoredData(STORAGE_KEYS.GUIDES, guidesData);
    const guide = guides.find(g => g.id === id);

    if (!guide) {
      throw new Error('Guide not found');
    }

    // Transform guide to match TypeScript interface
    return { success: true, data: transformGuide(guide) };
  },

  update: async (id: string, data: any) => {
    await delay();
    const guides = getStoredData(STORAGE_KEYS.GUIDES, guidesData);
    const index = guides.findIndex(g => g.id === id);

    if (index === -1) {
      throw new Error('Guide not found');
    }

    guides[index] = { ...guides[index], ...data };
    saveStoredData(STORAGE_KEYS.GUIDES, guides);

    return { success: true, data: guides[index] };
  },

  toggleAvailability: async (id: string) => {
    await delay();
    const guides = getStoredData(STORAGE_KEYS.GUIDES, guidesData);
    const index = guides.findIndex(g => g.id === id);

    if (index === -1) {
      throw new Error('Guide not found');
    }

    guides[index].isAvailable = !guides[index].isAvailable;
    saveStoredData(STORAGE_KEYS.GUIDES, guides);

    return { success: true, data: guides[index] };
  },
};

/**
 * Tours Service
 */
export const demoToursService = {
  getAll: async (filters?: any) => {
    await delay();
    let tours = toursData;

    // Apply filters
    if (filters) {
      if (filters.guideId) {
        tours = tours.filter(t => t.guideId === filters.guideId);
      }
      if (filters.category) {
        tours = tours.filter(t => t.category === filters.category);
      }
      if (filters.isActive !== undefined) {
        tours = tours.filter(t => t.isActive === filters.isActive);
      }
    }

    return { success: true, data: tours };
  },

  getById: async (id: string) => {
    await delay();
    const tour = toursData.find(t => t.id === id);

    if (!tour) {
      throw new Error('Tour not found');
    }

    return { success: true, data: tour };
  },
};

/**
 * Bookings Service
 */
export const demoBookingsService = {
  getAll: async (filters?: any) => {
    await delay();
    let bookings = getStoredData(STORAGE_KEYS.BOOKINGS, bookingsData);
    const user = getCurrentDemoUser();

    // Filter by user role
    if (filters) {
      if (filters.touristId) {
        bookings = bookings.filter(b => b.touristId === filters.touristId);
      }
      if (filters.guideId) {
        bookings = bookings.filter(b => b.guideId === filters.guideId);
      }
      if (filters.status) {
        bookings = bookings.filter(b => b.status === filters.status);
      }
    } else if (user) {
      // Default: filter by current user
      if (user.role === 'TOURIST') {
        bookings = bookings.filter(b => b.touristId === user.id);
      } else if (user.role === 'GUIDE') {
        bookings = bookings.filter(b => b.guideId === user.id);
      }
    }

    // Transform bookings to match TypeScript interface
    const transformedBookings = bookings.map(transformBooking);
    return { success: true, data: transformedBookings };
  },

  getById: async (id: string) => {
    await delay();
    const bookings = getStoredData(STORAGE_KEYS.BOOKINGS, bookingsData);
    const booking = bookings.find(b => b.id === id);

    if (!booking) {
      throw new Error('Booking not found');
    }

    // Transform booking to match TypeScript interface
    return { success: true, data: transformBooking(booking) };
  },

  create: async (bookingData: any) => {
    await delay(1500); // Simulate payment processing
    const bookings = getStoredData(STORAGE_KEYS.BOOKINGS, bookingsData);
    const user = getCurrentDemoUser();

    const newBooking = {
      id: `booking-${Date.now()}`,
      touristId: user.id,
      touristName: user.name,
      ...bookingData,
      status: 'CONFIRMED',
      stripePaymentId: `pi_demo_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    bookings.push(newBooking);
    saveStoredData(STORAGE_KEYS.BOOKINGS, bookings);

    return { success: true, data: newBooking };
  },

  update: async (id: string, data: any) => {
    await delay();
    const bookings = getStoredData(STORAGE_KEYS.BOOKINGS, bookingsData);
    const index = bookings.findIndex(b => b.id === id);

    if (index === -1) {
      throw new Error('Booking not found');
    }

    bookings[index] = { ...bookings[index], ...data };
    saveStoredData(STORAGE_KEYS.BOOKINGS, bookings);

    return { success: true, data: bookings[index] };
  },

  start: async (id: string) => {
    return demoBookingsService.update(id, {
      status: 'STARTED',
      startTime: new Date().toISOString(),
    });
  },

  complete: async (id: string) => {
    return demoBookingsService.update(id, {
      status: 'COMPLETED',
      endTime: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    });
  },

  cancel: async (id: string, reason: string) => {
    const user = getCurrentDemoUser();
    return demoBookingsService.update(id, {
      status: 'CANCELLED',
      cancelledAt: new Date().toISOString(),
      cancelledBy: user.role,
      cancellationReason: reason,
    });
  },
};

/**
 * Reviews Service
 */
export const demoReviewsService = {
  getAll: async (filters?: any) => {
    await delay();
    let reviews = getStoredData(STORAGE_KEYS.REVIEWS, reviewsData);

    if (filters) {
      if (filters.guideId) {
        reviews = reviews.filter(r => r.guideId === filters.guideId);
      }
      if (filters.touristId) {
        reviews = reviews.filter(r => r.touristId === filters.touristId);
      }
    }

    return { success: true, data: reviews };
  },

  create: async (reviewData: any) => {
    await delay();
    const reviews = getStoredData(STORAGE_KEYS.REVIEWS, reviewsData);
    const user = getCurrentDemoUser();

    const newReview = {
      id: `review-${Date.now()}`,
      touristId: user.id,
      touristName: user.name,
      ...reviewData,
      createdAt: new Date().toISOString(),
    };

    reviews.push(newReview);
    saveStoredData(STORAGE_KEYS.REVIEWS, reviews);

    return { success: true, data: newReview };
  },
};

/**
 * Messages Service
 */
export const demoMessagesService = {
  getByBooking: async (bookingId: string) => {
    await delay();
    const messages = getStoredData(STORAGE_KEYS.MESSAGES, messagesData);
    const bookingMessages = messages.filter(m => m.bookingId === bookingId);

    return { success: true, data: bookingMessages };
  },

  send: async (bookingId: string, content: string) => {
    await delay();
    const messages = getStoredData(STORAGE_KEYS.MESSAGES, messagesData);
    const user = getCurrentDemoUser();

    const newMessage = {
      id: `msg-${Date.now()}`,
      bookingId,
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role,
      content,
      createdAt: new Date().toISOString(),
      read: false,
    };

    messages.push(newMessage);
    saveStoredData(STORAGE_KEYS.MESSAGES, messages);

    return { success: true, data: newMessage };
  },
};

/**
 * Notifications Service
 */
export const demoNotificationsService = {
  getAll: async () => {
    await delay();
    const notifications = getStoredData(STORAGE_KEYS.NOTIFICATIONS, notificationsData);
    const user = getCurrentDemoUser();

    // Filter by user
    const userNotifications = notifications.filter(n => n.userId === user.id);

    return { success: true, data: userNotifications };
  },

  markAsRead: async (id: string) => {
    await delay();
    const notifications = getStoredData(STORAGE_KEYS.NOTIFICATIONS, notificationsData);
    const index = notifications.findIndex(n => n.id === id);

    if (index !== -1) {
      notifications[index].read = true;
      saveStoredData(STORAGE_KEYS.NOTIFICATIONS, notifications);
    }

    return { success: true };
  },

  markAllAsRead: async () => {
    await delay();
    const notifications = getStoredData(STORAGE_KEYS.NOTIFICATIONS, notificationsData);
    const user = getCurrentDemoUser();

    notifications.forEach(n => {
      if (n.userId === user.id) {
        n.read = true;
      }
    });

    saveStoredData(STORAGE_KEYS.NOTIFICATIONS, notifications);
    return { success: true };
  },
};

/**
 * Analytics Service
 */
export const demoAnalyticsService = {
  getPlatformStats: async () => {
    await delay();
    return { success: true, data: analyticsData };
  },
};

/**
 * Admin Service
 */
export const demoAdminService = {
  getPendingGuides: async () => {
    await delay();
    const pendingGuides = getStoredData(STORAGE_KEYS.PENDING_GUIDES, pendingGuidesData);
    return { success: true, data: pendingGuides };
  },

  approveGuide: async (id: string) => {
    await delay();
    const pendingGuides = getStoredData(STORAGE_KEYS.PENDING_GUIDES, pendingGuidesData);
    const guides = getStoredData(STORAGE_KEYS.GUIDES, guidesData);

    const index = pendingGuides.findIndex(g => g.id === id);
    if (index === -1) {
      throw new Error('Guide application not found');
    }

    // Move from pending to approved - add missing fields for guide structure
    const pendingGuide = pendingGuides[index];
    const approvedGuide = {
      ...pendingGuide,
      status: 'APPROVED',
      isAvailable: false,
      rating: 0,
      reviewCount: 0,
      tourCount: 0,
      responseTime: 0,
      responseRate: 0,
      acceptanceRate: 0,
      yearsExperience: 0,
      badges: [],
      certifications: [],
      joinedDate: new Date().toISOString(),
      funFacts: [],
      askMeAbout: [],
    };

    guides.push(approvedGuide);
    pendingGuides.splice(index, 1);

    saveStoredData(STORAGE_KEYS.PENDING_GUIDES, pendingGuides);
    saveStoredData(STORAGE_KEYS.GUIDES, guides);

    return { success: true, data: approvedGuide };
  },

  rejectGuide: async (id: string, reason: string) => {
    await delay();
    const pendingGuides = getStoredData(STORAGE_KEYS.PENDING_GUIDES, pendingGuidesData);
    const index = pendingGuides.findIndex(g => g.id === id);

    if (index === -1) {
      throw new Error('Guide application not found');
    }

    pendingGuides.splice(index, 1);
    saveStoredData(STORAGE_KEYS.PENDING_GUIDES, pendingGuides);

    return { success: true, message: `Guide rejected: ${reason}` };
  },
};

/**
 * Achievements Service
 */
export const demoAchievementsService = {
  getAll: async (category?: string) => {
    await delay();
    let achievements = achievementsData;

    if (category) {
      achievements = achievements.filter(a => a.category === category);
    }

    return { success: true, data: achievements };
  },
};

/**
 * GPS Service
 */
export const demoGPSService = {
  getRoute: async (bookingId: string) => {
    await delay();
    const routes = gpsRoutesData as Record<string, any>;
    const route = routes[bookingId];

    if (!route) {
      throw new Error('Route not found');
    }

    return { success: true, data: route };
  },

  getCurrentLocation: async (bookingId: string) => {
    await delay();
    const routes = gpsRoutesData as Record<string, any>;
    const route = routes[bookingId];

    if (!route) {
      throw new Error('Route not found');
    }

    const currentWaypoint = route.waypoints[route.currentIndex];
    return { success: true, data: currentWaypoint };
  },

  simulateMovement: (bookingId: string, callback: (location: any) => void) => {
    const routes = gpsRoutesData as Record<string, any>;
    const route = routes[bookingId];

    if (!route) {
      return;
    }

    let index = route.currentIndex;

    const interval = setInterval(() => {
      if (index >= route.waypoints.length - 1) {
        clearInterval(interval);
        return;
      }

      index++;
      const location = route.waypoints[index];
      callback(location);
    }, 5000); // Update every 5 seconds

    return interval;
  },
};

export default {
  isDemoMode,
  isDemoAccount,
  getCurrentDemoUser,
  resetDemoData,
  auth: demoAuthService,
  guides: demoGuidesService,
  tours: demoToursService,
  bookings: demoBookingsService,
  reviews: demoReviewsService,
  messages: demoMessagesService,
  notifications: demoNotificationsService,
  analytics: demoAnalyticsService,
  admin: demoAdminService,
  achievements: demoAchievementsService,
  gps: demoGPSService,
};
