import bcrypt from 'bcrypt'
import prisma from './prisma.js'

/**
 * Seed Script for ExplorePro
 *
 * Creates initial data for development and testing:
 * - Admin user
 * - Sample tourists
 * - Sample guides (approved, pending, rejected)
 * - Sample tours
 * - Sample bookings and reviews
 *
 * Run with: npm run seed
 */

async function main() {
  console.log('🌱 Starting database seed...')

  // Hash password for all users
  const hashedPassword = await bcrypt.hash('Password123!', 10)

  // 1. Create Admin User
  console.log('\n📝 Creating admin user...')
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@explorepro.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
      phone: '+447700900000',
    },
  })
  console.log('✅ Admin created:', adminUser.email)

  // 2. Create Tourist Users
  console.log('\n📝 Creating tourist users...')
  const tourist1User = await prisma.user.create({
    data: {
      email: 'john.tourist@example.com',
      password: hashedPassword,
      name: 'John Smith',
      role: 'TOURIST',
      phone: '+447700900001',
      tourist: {
        create: {
          preferredLang: 'English',
        },
      },
    },
    include: { tourist: true },
  })

  const tourist2User = await prisma.user.create({
    data: {
      email: 'maria.tourist@example.com',
      password: hashedPassword,
      name: 'Maria Garcia',
      role: 'TOURIST',
      phone: '+447700900002',
      tourist: {
        create: {
          preferredLang: 'Spanish',
        },
      },
    },
    include: { tourist: true },
  })
  console.log('✅ Tourists created:', tourist1User.email, ',', tourist2User.email)

  // 3. Create Guide Users (Different Statuses)
  console.log('\n📝 Creating guide users...')

  // Approved Guide 1 - Oxford Specialist
  const guide1User = await prisma.user.create({
    data: {
      email: 'sarah.guide@example.com',
      password: hashedPassword,
      name: 'Sarah Johnson',
      role: 'GUIDE',
      phone: '+447700900003',
      photo: 'https://randomuser.me/api/portraits/women/44.jpg',
      guide: {
        create: {
          bio: 'Oxford native with 8 years of guiding experience. Specialized in historical tours of colleges and museums. Former Oxford student passionate about sharing the city\'s rich history.',
          languages: ['English', 'French'],
          specialties: ['History', 'Architecture', 'University Tours', 'Museums'],
          hourlyRate: 45.0,
          isAvailable: true,
          status: 'APPROVED',
          averageRating: 4.8,
          totalReviews: 127,
        },
      },
    },
    include: { guide: true },
  })

  // Approved Guide 2 - Cambridge Specialist
  const guide2User = await prisma.user.create({
    data: {
      email: 'david.guide@example.com',
      password: hashedPassword,
      name: 'David Chen',
      role: 'GUIDE',
      phone: '+447700900004',
      photo: 'https://randomuser.me/api/portraits/men/32.jpg',
      guide: {
        create: {
          bio: 'Cambridge Mathematics graduate offering unique insights into college life and scientific heritage. Expert in punting tours and walking tours of the historic city center.',
          languages: ['English', 'Mandarin', 'Spanish'],
          specialties: ['Cambridge Tours', 'Punting', 'Science History', 'Photography'],
          hourlyRate: 50.0,
          isAvailable: true,
          status: 'APPROVED',
          averageRating: 4.9,
          totalReviews: 89,
        },
      },
    },
    include: { guide: true },
  })

  // Approved Guide 3 - Literary Tours
  const guide3User = await prisma.user.create({
    data: {
      email: 'emma.guide@example.com',
      password: hashedPassword,
      name: 'Emma Thompson',
      role: 'GUIDE',
      phone: '+447700900005',
      photo: 'https://randomuser.me/api/portraits/women/68.jpg',
      guide: {
        create: {
          bio: 'Literature enthusiast offering tours inspired by famous authors. Walk in the footsteps of C.S. Lewis, J.R.R. Tolkien, and other literary giants who called Oxford home.',
          languages: ['English', 'German'],
          specialties: ['Literature', 'Walking Tours', 'Author History', 'Libraries'],
          hourlyRate: 40.0,
          isAvailable: false,
          status: 'APPROVED',
          averageRating: 4.7,
          totalReviews: 64,
        },
      },
    },
    include: { guide: true },
  })

  // Pending Guide
  const pendingGuideUser = await prisma.user.create({
    data: {
      email: 'alex.pending@example.com',
      password: hashedPassword,
      name: 'Alex Williams',
      role: 'GUIDE',
      phone: '+447700900006',
      guide: {
        create: {
          bio: 'New guide wanting to share my love for Oxford with tourists.',
          languages: ['English'],
          specialties: ['Walking Tours', 'Food Tours'],
          hourlyRate: 30.0,
          isAvailable: false,
          status: 'PENDING',
        },
      },
    },
    include: { guide: true },
  })

  console.log('✅ Guides created: 3 approved, 1 pending')

  // 4. Create Tours
  console.log('\n📝 Creating tours...')

  const tour1 = await prisma.tour.create({
    data: {
      guideId: guide1User.guide!.id,
      title: 'Historic Oxford Walking Tour',
      description: 'Explore the magnificent colleges of Oxford University, including Christ Church and Bodleian Library. Learn about centuries of academic excellence and see filming locations from Harry Potter.',
      duration: 120, // 2 hours
      price: 90.0,
      isActive: true,
    },
  })

  const tour2 = await prisma.tour.create({
    data: {
      guideId: guide1User.guide!.id,
      title: 'Oxford Museums Private Tour',
      description: 'Private guided tour of the Ashmolean Museum and Natural History Museum. Perfect for art and science enthusiasts.',
      duration: 180, // 3 hours
      price: 135.0,
      isActive: true,
    },
  })

  const tour3 = await prisma.tour.create({
    data: {
      guideId: guide2User.guide!.id,
      title: 'Cambridge Punting & City Tour',
      description: 'Experience the beauty of Cambridge from the River Cam. Includes punting lesson and walking tour of King\'s College and Trinity College.',
      duration: 150, // 2.5 hours
      price: 125.0,
      isActive: true,
    },
  })

  const tour4 = await prisma.tour.create({
    data: {
      guideId: guide3User.guide!.id,
      title: 'Literary Oxford: Authors & Inspiration',
      description: 'Discover the Oxford that inspired Tolkien, Lewis, and other literary legends. Visit their favorite pubs, colleges, and writing spots.',
      duration: 120, // 2 hours
      price: 80.0,
      isActive: true,
    },
  })

  console.log('✅ Tours created:', tour1.title, ',', tour2.title, ',', tour3.title, ',', tour4.title)

  // 5. Create Sample Bookings
  console.log('\n📝 Creating sample bookings...')

  const completedBooking = await prisma.booking.create({
    data: {
      touristId: tourist1User.tourist!.id,
      guideId: guide1User.guide!.id,
      tourId: tour1.id,
      type: 'SCHEDULED',
      status: 'COMPLETED',
      scheduledDate: new Date('2025-01-10T10:00:00Z'),
      startTime: new Date('2025-01-10T10:00:00Z'),
      endTime: new Date('2025-01-10T12:00:00Z'),
      duration: 120,
      meetingPoint: 'Radcliffe Square, Oxford',
      totalPrice: 90.0,
      commission: 13.5, // 15%
      guideEarnings: 76.5,
      stripePaymentId: 'pi_test_completed_booking',
    },
  })

  const upcomingBooking = await prisma.booking.create({
    data: {
      touristId: tourist2User.tourist!.id,
      guideId: guide2User.guide!.id,
      tourId: tour3.id,
      type: 'SCHEDULED',
      status: 'CONFIRMED',
      scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      duration: 150,
      meetingPoint: 'King\'s College, Cambridge',
      totalPrice: 125.0,
      commission: 18.75,
      guideEarnings: 106.25,
      stripePaymentId: 'pi_test_upcoming_booking',
    },
  })

  console.log('✅ Bookings created: 1 completed, 1 upcoming')

  // 6. Create Sample Review
  console.log('\n📝 Creating sample review...')

  const review = await prisma.review.create({
    data: {
      bookingId: completedBooking.id,
      touristId: tourist1User.tourist!.id,
      guideId: guide1User.guide!.id,
      rating: 5,
      comment: 'Sarah was an amazing guide! Her knowledge of Oxford history is incredible and she made the tour engaging and fun. Highly recommend!',
    },
  })

  console.log('✅ Review created for booking:', completedBooking.id)

  console.log('\n✨ Seed completed successfully!')
  console.log('\n📋 Summary:')
  console.log('   - 1 Admin user')
  console.log('   - 2 Tourist users')
  console.log('   - 4 Guide users (3 approved, 1 pending)')
  console.log('   - 4 Tours')
  console.log('   - 2 Bookings (1 completed, 1 upcoming)')
  console.log('   - 1 Review')
  console.log('\n🔐 Login Credentials (all users):')
  console.log('   Password: Password123!')
  console.log('\n   Admin:')
  console.log('     Email: admin@explorepro.com')
  console.log('\n   Tourists:')
  console.log('     Email: john.tourist@example.com')
  console.log('     Email: maria.tourist@example.com')
  console.log('\n   Guides (Approved):')
  console.log('     Email: sarah.guide@example.com')
  console.log('     Email: david.guide@example.com')
  console.log('     Email: emma.guide@example.com')
  console.log('\n   Guide (Pending Approval):')
  console.log('     Email: alex.pending@example.com')
}

main()
  .then(async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
