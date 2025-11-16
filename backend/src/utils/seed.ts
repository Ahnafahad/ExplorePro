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
  console.log('🌱 Starting minimal database seed...')

  // Hash password for all users
  const hashedPassword = await bcrypt.hash('test123', 10)

  // 1. Create Admin User
  console.log('\n📝 Creating admin user...')
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@test.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
      phone: '+447700900000',
    },
  })
  console.log('✅ Admin created:', adminUser.email)

  // 2. Create Tourist User
  console.log('\n📝 Creating tourist user...')
  const touristUser = await prisma.user.create({
    data: {
      email: 'tourist@test.com',
      password: hashedPassword,
      name: 'Test Tourist',
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
  console.log('✅ Tourist created:', touristUser.email)

  // 3. Create Guide User (Approved)
  console.log('\n📝 Creating guide user...')
  const guideUser = await prisma.user.create({
    data: {
      email: 'guide@test.com',
      password: hashedPassword,
      name: 'Test Guide',
      role: 'GUIDE',
      phone: '+447700900002',
      photo: 'https://randomuser.me/api/portraits/women/44.jpg',
      guide: {
        create: {
          bio: 'Experienced guide offering tours of Oxford and Cambridge.',
          languages: ['English', 'French'],
          specialties: ['History', 'Architecture', 'University Tours'],
          hourlyRate: 45.0,
          isAvailable: true,
          status: 'APPROVED',
          averageRating: 4.8,
          totalReviews: 25,
        },
      },
    },
    include: { guide: true },
  })
  console.log('✅ Guide created:', guideUser.email)

  // 4. Create Sample Tour
  console.log('\n📝 Creating sample tour...')
  const tour = await prisma.tour.create({
    data: {
      guideId: guideUser.guide!.id,
      title: 'Historic City Walking Tour',
      description: 'Explore the historic landmarks and learn about the rich history of the city.',
      duration: 120, // 2 hours
      price: 90.0,
      isActive: true,
    },
  })
  console.log('✅ Tour created:', tour.title)

  console.log('\n✨ Seed completed successfully!')
  console.log('\n📋 Summary:')
  console.log('   - 1 Admin user')
  console.log('   - 1 Tourist user')
  console.log('   - 1 Guide user (approved)')
  console.log('   - 1 Tour')
  console.log('\n🔐 Login Credentials (all users):')
  console.log('   Password: test123')
  console.log('\n   Admin:')
  console.log('     Email: admin@test.com')
  console.log('     Password: test123')
  console.log('\n   Tourist:')
  console.log('     Email: tourist@test.com')
  console.log('     Password: test123')
  console.log('\n   Guide:')
  console.log('     Email: guide@test.com')
  console.log('     Password: test123')
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
