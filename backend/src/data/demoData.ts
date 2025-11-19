// Demo Data for Backend Demo Mode
// This allows the backend to return demo data for demo users without database queries

export const demoGuides = [
  {
    id: 'demo-guide-profile-001',
    userId: 'demo-guide-001',
    user: {
      id: 'demo-guide-001',
      name: 'Demo Guide',
      email: 'demo.guide@explorepro.com',
      phone: '+44 7700 900002',
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demoguide&backgroundColor=c0aede',
      role: 'GUIDE' as const,
    },
    bio: 'Welcome to Oxford! I\'m an experienced local guide showcasing the best of this historic city. With over 10 years of experience, I love sharing the hidden gems and rich history of Oxford with visitors from around the world.',
    languages: ['English', 'Spanish', 'French'],
    specialties: ['History', 'Architecture', 'University Tours', 'Literature'],
    hourlyRate: 50,
    isAvailable: true,
    status: 'APPROVED' as const,
    averageRating: 4.85,
    totalReviews: 42,
    verificationDoc: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    tours: [
      {
        id: 'demo-tour-1',
        guideId: 'demo-guide-profile-001',
        title: 'Classic Oxford University Tour',
        description: 'Explore the historic colleges of Oxford including Christ Church, Bodleian Library, and Radcliffe Camera. Perfect introduction to Oxford!',
        duration: 120,
        price: 100,
        isActive: true,
        createdAt: new Date('2024-01-15'),
      },
      {
        id: 'demo-tour-2',
        guideId: 'demo-guide-profile-001',
        title: 'Literary Oxford Walking Tour',
        description: 'Follow in the footsteps of famous authors like Tolkien, Lewis, and Wilde. Visit their favorite haunts and inspiration spots.',
        duration: 90,
        price: 75,
        isActive: true,
        createdAt: new Date('2024-01-20'),
      },
    ],
    reviews: [
      {
        id: 'demo-review-1',
        bookingId: 'demo-booking-1',
        touristId: 'demo-tourist-profile-001',
        guideId: 'demo-guide-profile-001',
        rating: 5,
        comment: 'Absolutely fantastic tour! Very knowledgeable and friendly. Highly recommend!',
        createdAt: new Date('2024-02-01'),
        tourist: {
          id: 'demo-tourist-profile-001',
          userId: 'demo-tourist-001',
          preferredLang: 'English',
          user: {
            name: 'Demo Tourist',
            photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demotourist&backgroundColor=c0aede',
          },
        },
      },
      {
        id: 'demo-review-2',
        bookingId: 'demo-booking-2',
        touristId: 'demo-tourist-profile-002',
        guideId: 'demo-guide-profile-001',
        rating: 5,
        comment: 'Amazing experience! Learned so much about Oxford\'s history. Would book again!',
        createdAt: new Date('2024-02-15'),
        tourist: {
          id: 'demo-tourist-profile-002',
          userId: 'demo-tourist-002',
          preferredLang: 'English',
          user: {
            name: 'Sarah Johnson',
            photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah&backgroundColor=c0aede',
          },
        },
      },
      {
        id: 'demo-review-3',
        bookingId: 'demo-booking-3',
        touristId: 'demo-tourist-profile-003',
        guideId: 'demo-guide-profile-001',
        rating: 4,
        comment: 'Great tour with lots of interesting facts. Really enjoyed it!',
        createdAt: new Date('2024-03-01'),
        tourist: {
          id: 'demo-tourist-profile-003',
          userId: 'demo-tourist-003',
          preferredLang: 'English',
          user: {
            name: 'Michael Brown',
            photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael&backgroundColor=c0aede',
          },
        },
      },
    ],
  },
]

export const demoBookings = [
  {
    id: 'demo-booking-upcoming-1',
    touristId: 'demo-tourist-profile-004',
    tourist: {
      id: 'demo-tourist-profile-004',
      userId: 'demo-tourist-004',
      preferredLang: 'English',
      user: {
        id: 'demo-tourist-004',
        name: 'Emily Davis',
        email: 'emily.davis@example.com',
        phone: '+44 7700 900100',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily&backgroundColor=c0aede',
      },
    },
    guideId: 'demo-guide-profile-001',
    guide: {
      id: 'demo-guide-profile-001',
      userId: 'demo-guide-001',
      user: {
        id: 'demo-guide-001',
        name: 'Demo Guide',
        email: 'demo.guide@explorepro.com',
        phone: '+44 7700 900002',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demoguide&backgroundColor=c0aede',
      },
    },
    tourId: 'demo-tour-1',
    tour: {
      id: 'demo-tour-1',
      guideId: 'demo-guide-profile-001',
      title: 'Classic Oxford University Tour',
      description: 'Explore the historic colleges of Oxford',
      duration: 120,
      price: 100,
      isActive: true,
    },
    type: 'SCHEDULED' as const,
    status: 'CONFIRMED' as const,
    scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60000), // In 2 days
    startTime: null,
    endTime: null,
    duration: 120,
    meetingPoint: 'Radcliffe Camera, Oxford',
    totalPrice: 100,
    commission: 15,
    guideEarnings: 85,
    stripePaymentId: 'demo_payment_1',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60000),
    messages: [],
  },
  {
    id: 'demo-booking-upcoming-2',
    touristId: 'demo-tourist-profile-005',
    tourist: {
      id: 'demo-tourist-profile-005',
      userId: 'demo-tourist-005',
      preferredLang: 'English',
      user: {
        id: 'demo-tourist-005',
        name: 'James Wilson',
        email: 'james.wilson@example.com',
        phone: '+44 7700 900101',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james&backgroundColor=c0aede',
      },
    },
    guideId: 'demo-guide-profile-001',
    guide: {
      id: 'demo-guide-profile-001',
      userId: 'demo-guide-001',
      user: {
        id: 'demo-guide-001',
        name: 'Demo Guide',
        email: 'demo.guide@explorepro.com',
        phone: '+44 7700 900002',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demoguide&backgroundColor=c0aede',
      },
    },
    tourId: 'demo-tour-2',
    tour: {
      id: 'demo-tour-2',
      guideId: 'demo-guide-profile-001',
      title: 'Literary Oxford Walking Tour',
      description: 'Follow in the footsteps of famous authors',
      duration: 90,
      price: 75,
      isActive: true,
    },
    type: 'SCHEDULED' as const,
    status: 'PENDING' as const,
    scheduledDate: new Date(Date.now() + 5 * 24 * 60 * 60000), // In 5 days
    startTime: null,
    endTime: null,
    duration: 90,
    meetingPoint: 'Eagle & Child Pub, Oxford',
    totalPrice: 75,
    commission: 11.25,
    guideEarnings: 63.75,
    stripePaymentId: 'demo_payment_2',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60000),
    messages: [],
  },
  {
    id: 'demo-booking-completed-1',
    touristId: 'demo-tourist-profile-001',
    tourist: {
      id: 'demo-tourist-profile-001',
      userId: 'demo-tourist-001',
      preferredLang: 'English',
      user: {
        id: 'demo-tourist-001',
        name: 'Demo Tourist',
        email: 'demo.tourist@explorepro.com',
        phone: '+44 7700 900001',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demotourist&backgroundColor=c0aede',
      },
    },
    guideId: 'demo-guide-profile-001',
    guide: {
      id: 'demo-guide-profile-001',
      userId: 'demo-guide-001',
      user: {
        id: 'demo-guide-001',
        name: 'Demo Guide',
        email: 'demo.guide@explorepro.com',
        phone: '+44 7700 900002',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demoguide&backgroundColor=c0aede',
      },
    },
    tourId: 'demo-tour-1',
    tour: {
      id: 'demo-tour-1',
      guideId: 'demo-guide-profile-001',
      title: 'Classic Oxford University Tour',
      description: 'Explore the historic colleges of Oxford',
      duration: 120,
      price: 100,
      isActive: true,
    },
    type: 'INSTANT' as const,
    status: 'COMPLETED' as const,
    scheduledDate: new Date(Date.now() - 7 * 24 * 60 * 60000),
    startTime: new Date(Date.now() - 7 * 24 * 60 * 60000),
    endTime: new Date(Date.now() - 7 * 24 * 60 * 60000 + 120 * 60000),
    duration: 120,
    meetingPoint: 'Christ Church College, Oxford',
    totalPrice: 100,
    commission: 15,
    guideEarnings: 85,
    stripePaymentId: 'demo_payment_completed_1',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60000),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60000),
    messages: [],
  },
  {
    id: 'demo-booking-completed-2',
    touristId: 'demo-tourist-profile-002',
    tourist: {
      id: 'demo-tourist-profile-002',
      userId: 'demo-tourist-002',
      preferredLang: 'English',
      user: {
        id: 'demo-tourist-002',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        phone: '+44 7700 900102',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah&backgroundColor=c0aede',
      },
    },
    guideId: 'demo-guide-profile-001',
    guide: {
      id: 'demo-guide-profile-001',
      userId: 'demo-guide-001',
      user: {
        id: 'demo-guide-001',
        name: 'Demo Guide',
        email: 'demo.guide@explorepro.com',
        phone: '+44 7700 900002',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demoguide&backgroundColor=c0aede',
      },
    },
    tourId: 'demo-tour-2',
    tour: {
      id: 'demo-tour-2',
      guideId: 'demo-guide-profile-001',
      title: 'Literary Oxford Walking Tour',
      description: 'Follow in the footsteps of famous authors',
      duration: 90,
      price: 75,
      isActive: true,
    },
    type: 'SCHEDULED' as const,
    status: 'COMPLETED' as const,
    scheduledDate: new Date(Date.now() - 14 * 24 * 60 * 60000),
    startTime: new Date(Date.now() - 14 * 24 * 60 * 60000),
    endTime: new Date(Date.now() - 14 * 24 * 60 * 60000 + 90 * 60000),
    duration: 90,
    meetingPoint: 'Bodleian Library, Oxford',
    totalPrice: 75,
    commission: 11.25,
    guideEarnings: 63.75,
    stripePaymentId: 'demo_payment_completed_2',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60000),
    updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60000),
    messages: [],
  },
]

// Helper to check if user is a demo user
export const isDemoUser = (userId: string): boolean => {
  return userId === 'demo-tourist-001' ||
         userId === 'demo-guide-001' ||
         userId === 'demo-admin-001'
}

// Get demo guide by userId
export const getDemoGuideByUserId = (userId: string) => {
  return demoGuides.find(guide => guide.userId === userId) || null
}

// Get demo guide by guide ID
export const getDemoGuideById = (guideId: string) => {
  return demoGuides.find(guide => guide.id === guideId) || null
}

// Get demo bookings for guide
export const getDemoBookingsForGuide = (guideId: string) => {
  return demoBookings.filter(booking => booking.guideId === guideId)
}

// Get demo bookings for tourist
export const getDemoBookingsForTourist = (touristId: string) => {
  return demoBookings.filter(booking => booking.touristId === touristId)
}

// Get demo booking by ID
export const getDemoBookingById = (bookingId: string) => {
  return demoBookings.find(booking => booking.id === bookingId) || null
}
