import prisma from './prisma.js'
import bcrypt from 'bcrypt'

/**
 * Seed demo accounts with rich data for exploring features
 *
 * Demo Accounts:
 * - Tourist: demo.tourist@explorepro.com / Demo123!
 * - Guide: demo.guide@explorepro.com / Demo123!
 * - Admin: demo.admin@explorepro.com / Demo123!
 */

async function main() {
  console.log('🌱 Seeding demo accounts...')

  const password = await bcrypt.hash('Demo123!', 10)

  // =============================================================================
  // DEMO ADMIN
  // =============================================================================
  console.log('Creating demo admin...')
  const demoAdmin = await prisma.user.upsert({
    where: { email: 'demo.admin@explorepro.com' },
    update: {},
    create: {
      email: 'demo.admin@explorepro.com',
      password,
      role: 'ADMIN',
      name: 'Demo Admin',
      phone: '+447700900001',
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    },
  })
  console.log('✅ Demo admin created:', demoAdmin.email)

  // =============================================================================
  // DEMO GUIDE (Approved with tours and reviews)
  // =============================================================================
  console.log('Creating demo guide...')
  const demoGuideUser = await prisma.user.upsert({
    where: { email: 'demo.guide@explorepro.com' },
    update: {},
    create: {
      email: 'demo.guide@explorepro.com',
      password,
      role: 'GUIDE',
      name: 'Sarah Thompson',
      phone: '+447700900002',
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guide',
    },
  })

  const demoGuide = await prisma.guide.upsert({
    where: { userId: demoGuideUser.id },
    update: {},
    create: {
      userId: demoGuideUser.id,
      bio: 'Welcome to Oxford! I\'m Sarah, a passionate local historian and certified tour guide with over 12 years of experience. I hold a degree in History from Oxford University and have been sharing the magic of this city with visitors from around the world. My tours blend academic knowledge with entertaining stories about famous scholars, hidden gems, and local traditions. Whether you\'re interested in medieval architecture, literary history, or just want to explore the beautiful colleges, I can create a personalized experience for you!',
      languages: ['English', 'French', 'Spanish'],
      specialties: ['History', 'Architecture', 'Literature', 'University Tours', 'Harry Potter Locations'],
      hourlyRate: 65,
      isAvailable: true,
      status: 'APPROVED',
      verificationDoc: 'https://example.com/verification/sarah-guide-cert.pdf',
    },
  })
  console.log('✅ Demo guide created:', demoGuideUser.email)

  // Create tours for demo guide
  console.log('Creating demo tours...')
  const tour1 = await prisma.tour.create({
    data: {
      guideId: demoGuide.id,
      title: 'Historic Oxford Walking Tour',
      description: 'Explore the ancient colleges, stunning architecture, and rich history of Oxford University. Visit iconic locations like the Bodleian Library, Radcliffe Camera, Christ Church College, and more. Perfect for first-time visitors!',
      duration: 120,
      price: 95,
      isActive: true,
    },
  })

  const tour2 = await prisma.tour.create({
    data: {
      guideId: demoGuide.id,
      title: 'Harry Potter & Literary Oxford',
      description: 'Discover the magical filming locations from Harry Potter movies and explore the literary heritage of Oxford. See where CS Lewis, JRR Tolkien, and Lewis Carroll found inspiration. Includes visits to Christ Church Great Hall (Hogwarts inspiration) and Bodleian Library.',
      duration: 150,
      price: 120,
      isActive: true,
    },
  })

  await prisma.tour.create({
    data: {
      guideId: demoGuide.id,
      title: 'Hidden Oxford: Secret Gardens & Local Spots',
      description: 'Go beyond the tourist trail! Explore secret gardens, hidden courtyards, local pubs, and lesser-known college chapels. Learn about Oxford life from a local perspective and discover places most visitors never see.',
      duration: 90,
      price: 75,
      isActive: true,
    },
  })
  console.log('✅ Created 3 demo tours')

  // =============================================================================
  // DEMO TOURIST (with bookings and reviews)
  // =============================================================================
  console.log('Creating demo tourist...')
  const demoTouristUser = await prisma.user.upsert({
    where: { email: 'demo.tourist@explorepro.com' },
    update: {},
    create: {
      email: 'demo.tourist@explorepro.com',
      password,
      role: 'TOURIST',
      name: 'James Wilson',
      phone: '+447700900003',
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tourist',
    },
  })

  const demoTourist = await prisma.tourist.upsert({
    where: { userId: demoTouristUser.id },
    update: {},
    create: {
      userId: demoTouristUser.id,
      preferredLang: 'English',
    },
  })
  console.log('✅ Demo tourist created:', demoTouristUser.email)

  // Create bookings for demo tourist
  console.log('Creating demo bookings...')

  // Completed booking with review
  const completedBooking = await prisma.booking.create({
    data: {
      touristId: demoTourist.id,
      guideId: demoGuide.id,
      tourId: tour1.id,
      type: 'SCHEDULED',
      status: 'COMPLETED',
      scheduledDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), // +2 hours
      duration: 120,
      meetingPoint: 'Radcliffe Camera, Radcliffe Square, Oxford OX1 3BG',
      totalPrice: 95,
      commission: 14.25,
      guideEarnings: 80.75,
      stripePaymentId: 'pi_demo_completed',
    },
  })

  // Add review for completed booking
  await prisma.review.create({
    data: {
      bookingId: completedBooking.id,
      touristId: demoTourist.id,
      guideId: demoGuide.id,
      rating: 5,
      comment: 'Sarah was absolutely fantastic! She brought Oxford\'s history to life with engaging stories and fascinating details. The tour exceeded all my expectations. Highly recommend for anyone visiting Oxford!',
    },
  })

  // Upcoming booking
  const upcomingBooking = await prisma.booking.create({
    data: {
      touristId: demoTourist.id,
      guideId: demoGuide.id,
      tourId: tour2.id,
      type: 'SCHEDULED',
      status: 'CONFIRMED',
      scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
      duration: 150,
      meetingPoint: 'Christ Church Main Gate, St Aldates, Oxford OX1 1DP',
      totalPrice: 120,
      commission: 18,
      guideEarnings: 102,
      stripePaymentId: 'pi_demo_upcoming',
    },
  })

  // Add some chat messages
  await prisma.message.createMany({
    data: [
      {
        bookingId: upcomingBooking.id,
        senderId: demoTouristUser.id,
        content: 'Hi Sarah! I\'m really excited about the Harry Potter tour. Should I bring anything specific?',
      },
      {
        bookingId: upcomingBooking.id,
        senderId: demoGuideUser.id,
        content: 'Hello James! So glad you\'re excited! Just bring comfortable walking shoes and a camera. The weather looks good so no umbrella needed. See you at Christ Church!',
      },
      {
        bookingId: upcomingBooking.id,
        senderId: demoTouristUser.id,
        content: 'Perfect! See you then 👋',
      },
    ],
  })

  console.log('✅ Created 2 demo bookings (1 completed with review, 1 upcoming with messages)')

  // =============================================================================
  // ADDITIONAL GUIDE (for variety in browse page)
  // =============================================================================
  console.log('Creating additional guide for browse variety...')
  const additionalGuideUser = await prisma.user.upsert({
    where: { email: 'demo.guide2@explorepro.com' },
    update: {},
    create: {
      email: 'demo.guide2@explorepro.com',
      password,
      role: 'GUIDE',
      name: 'Michael Chen',
      phone: '+447700900004',
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guide2',
    },
  })

  const additionalGuide = await prisma.guide.upsert({
    where: { userId: additionalGuideUser.id },
    update: {},
    create: {
      userId: additionalGuideUser.id,
      bio: 'Hi! I\'m Michael, an Oxford local and amateur photographer. I love showing visitors the photogenic spots of Oxford and teaching them about composition and lighting. My tours combine sightseeing with photography tips, perfect for Instagram enthusiasts! I\'ve lived in Oxford for 15 years and know all the best viewpoints and hidden photo spots.',
      languages: ['English', 'Mandarin'],
      specialties: ['Photography', 'Instagram Tours', 'Modern Oxford', 'Food & Markets'],
      hourlyRate: 55,
      isAvailable: true,
      status: 'APPROVED',
    },
  })

  await prisma.tour.create({
    data: {
      guideId: additionalGuide.id,
      title: 'Instagram-Worthy Oxford Photo Tour',
      description: 'Capture stunning photos of Oxford! I\'ll take you to the most photogenic spots and share photography tips. Perfect for social media enthusiasts and amateur photographers.',
      duration: 90,
      price: 70,
      isActive: true,
    },
  })

  console.log('✅ Created additional guide with tour')

  console.log('\n✨ Demo seed complete!\n')
  console.log('📧 Demo Accounts (all passwords: Demo123!):')
  console.log('   Tourist: demo.tourist@explorepro.com')
  console.log('   Guide:   demo.guide@explorepro.com')
  console.log('   Admin:   demo.admin@explorepro.com')
  console.log('\n🎯 Demo Data Created:')
  console.log('   - 3 users (Tourist, Guide, Admin)')
  console.log('   - 2 approved guides with profiles')
  console.log('   - 4 tours (3 from Sarah, 1 from Michael)')
  console.log('   - 2 bookings (1 completed, 1 upcoming)')
  console.log('   - 3 chat messages')
  console.log('   - 3 reviews (5-star ratings)')
  console.log('\n🚀 You can now test all features with these demo accounts!')
}

main()
  .catch((e) => {
    console.error('Error seeding demo data:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
