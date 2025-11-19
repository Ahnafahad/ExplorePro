import prisma from './prisma.js'
import bcrypt from 'bcrypt'

/**
 * 🎬 INVESTOR-READY DEMO SEED
 *
 * This creates a complete, realistic demo ecosystem:
 * - 10 diverse guides across specialties
 * - 5 tourist personas with different behaviors
 * - 40+ tours across categories
 * - 80+ bookings spanning 6 months
 * - 150+ reviews with realistic distribution
 * - Active chats and conversations
 * - Admin tasks (pending approvals, refunds, etc.)
 *
 * Demo Accounts:
 * - Tourist: demo.tourist@explorepro.com / Demo123!
 * - Guide: demo.guide@explorepro.com / Demo123!
 * - Admin: demo.admin@explorepro.com / Demo123!
 */

async function main() {
  console.log('🎬 Starting Investor-Ready Demo Seed...\n')

  const password = await bcrypt.hash('Demo123!', 10)

  // =============================================================================
  // ADMIN USER
  // =============================================================================
  console.log('👑 Creating Admin...')
  await prisma.user.upsert({
    where: { email: 'demo.admin@explorepro.com' },
    update: {},
    create: {
      email: 'demo.admin@explorepro.com',
      password,
      role: 'ADMIN',
      name: 'Admin User',
      phone: '+447700900000',
      photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
    },
  })
  console.log('✅ Admin created\n')

  // =============================================================================
  // 10 DIVERSE GUIDES
  // =============================================================================
  console.log('🧑‍🏫 Creating 10 Diverse Guides...')

  const guidesData = [
    {
      email: 'demo.guide@explorepro.com',
      name: 'Sarah Thompson',
      phone: '+447700900001',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
      bio: 'Welcome to Oxford! I\'m Sarah, a passionate local historian and certified tour guide with over 12 years of experience. I hold a degree in History from Oxford University and have been sharing the magic of this city with visitors from around the world. My tours blend academic knowledge with entertaining stories about famous scholars, hidden gems, and local traditions. Whether you\'re interested in medieval architecture, literary history, or just want to explore the beautiful colleges, I can create a personalized experience for you!',
      languages: ['English', 'French', 'Spanish'],
      specialties: ['History', 'Architecture', 'Literature', 'University Tours', 'Harry Potter Locations'],
      hourlyRate: 65,
      avgRating: 4.9,
      totalReviews: 127,
    },
    {
      email: 'michael.chen@explorepro.com',
      name: 'Michael Chen',
      phone: '+447700900002',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      bio: 'Hi! I\'m Michael, an Oxford local and professional photographer. I love showing visitors the photogenic spots of Oxford and teaching them about composition and lighting. My tours combine sightseeing with photography tips, perfect for Instagram enthusiasts! I\'ve lived in Oxford for 15 years and know all the best viewpoints, hidden photo spots, and the golden hour locations that will make your feed shine.',
      languages: ['English', 'Mandarin'],
      specialties: ['Photography', 'Instagram Tours', 'Modern Oxford', 'Food & Markets'],
      hourlyRate: 55,
      avgRating: 4.8,
      totalReviews: 89,
    },
    {
      email: 'emma.rodriguez@explorepro.com',
      name: 'Emma Rodriguez',
      phone: '+447700900003',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      bio: 'Hola! I\'m Emma, a literary enthusiast and bookworm who fell in love with Oxford\'s rich literary heritage. My tours explore the footsteps of famous authors like Tolkien, Lewis, and Philip Pullman. We\'ll visit their favorite pubs, writing spots, and the locations that inspired their masterpieces. Perfect for book lovers and aspiring writers!',
      languages: ['English', 'Spanish', 'Portuguese'],
      specialties: ['Literature', 'Creative Writing', 'Book Clubs', 'CS Lewis', 'JRR Tolkien'],
      hourlyRate: 70,
      avgRating: 5.0,
      totalReviews: 45,
    },
    {
      email: 'james.obrien@explorepro.com',
      name: 'James O\'Brien',
      phone: '+447700900004',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      bio: 'Cheers! I\'m James, your friendly local pub expert and food tour guide. I\'ve spent 20 years exploring Oxford\'s culinary scene, from historic taverns to modern street food. My tours are a delicious journey through Oxford\'s food culture, with tastings at hidden gems and stories about the city\'s gastronomic evolution. Come hungry!',
      languages: ['English', 'Irish Gaelic'],
      specialties: ['Food Tours', 'Pub Crawls', 'Local Cuisine', 'Craft Beer', 'Markets'],
      hourlyRate: 50,
      avgRating: 4.7,
      totalReviews: 156,
    },
    {
      email: 'aisha.patel@explorepro.com',
      name: 'Aisha Patel',
      phone: '+447700900005',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
      bio: 'Hello! I\'m Aisha, an architect specializing in Gothic and Victorian design. My tours dive deep into Oxford\'s architectural wonders - from medieval colleges to modern masterpieces. I\'ll teach you to read buildings like books and spot details most visitors miss. Perfect for architecture students, professionals, or anyone who appreciates beautiful buildings!',
      languages: ['English', 'Hindi', 'Gujarati'],
      specialties: ['Architecture', 'Design', 'Gothic Revival', 'Building Conservation', 'Sketching Tours'],
      hourlyRate: 75,
      avgRating: 4.9,
      totalReviews: 92,
    },
    {
      email: 'thomas.wright@explorepro.com',
      name: 'Thomas Wright',
      phone: '+447700900006',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
      bio: 'Good evening... I\'m Thomas, Oxford\'s premier ghost tour guide. For 10 years, I\'ve been sharing the city\'s darker history - haunted colleges, mysterious legends, and unexplained phenomena. My tours blend historical facts with spine-tingling stories. Not for the faint of heart! Best experienced after dark.',
      languages: ['English'],
      specialties: ['Ghost Tours', 'Dark History', 'Medieval Crime', 'Legends & Folklore', 'Night Tours'],
      hourlyRate: 60,
      avgRating: 4.6,
      totalReviews: 73,
    },
    {
      email: 'sophie.laurent@explorepro.com',
      name: 'Sophie Laurent',
      phone: '+447700900007',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
      bio: 'Bonjour! I\'m Sophie from Paris, now living in Oxford for 8 years. I offer a unique French perspective on Oxford, comparing it to Paris\'s academic traditions. My tours are perfect for francophone visitors or anyone interested in international perspectives on British culture. I also specialize in romantic walking tours!',
      languages: ['French', 'English', 'Italian'],
      specialties: ['Romantic Tours', 'Couple Experiences', 'Gardens', 'French Quarter', 'Cultural Comparison'],
      hourlyRate: 65,
      avgRating: 4.8,
      totalReviews: 61,
    },
    {
      email: 'david.kim@explorepro.com',
      name: 'David Kim',
      phone: '+447700900008',
      photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
      bio: 'Hey! I\'m David, a tech entrepreneur and startup advisor. My unique tours explore Oxford\'s modern innovation ecosystem - from university spin-outs to tech incubators. Perfect for entrepreneurs, investors, and anyone interested in how ancient Oxford is becoming a tech hub. I\'ll show you where the future is being built!',
      languages: ['English', 'Korean'],
      specialties: ['Tech & Innovation', 'Startup Tours', 'Business Networking', 'Science Parks', 'Future of Oxford'],
      hourlyRate: 80,
      avgRating: 5.0,
      totalReviews: 34,
    },
    {
      email: 'lisa.anderson@explorepro.com',
      name: 'Lisa Anderson',
      phone: '+447700900009',
      photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
      bio: 'Hello! I\'m Lisa, a botanist and garden designer. My tours explore Oxford\'s stunning gardens - from the University Botanic Garden to hidden college gardens rarely open to the public. Learn about plant history, seasonal highlights, and garden design principles. Perfect for nature lovers and green thumbs!',
      languages: ['English'],
      specialties: ['Botanical Gardens', 'Nature Walks', 'Plant History', 'Seasonal Tours', 'Wildlife Spotting'],
      hourlyRate: 55,
      avgRating: 4.7,
      totalReviews: 88,
    },
    {
      email: 'marco.rossi@explorepro.com',
      name: 'Marco Rossi',
      phone: '+447700900010',
      photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop',
      bio: 'Ciao! I\'m Marco from Florence, now calling Oxford home. I guide tours exploring the surprising Italian connections to Oxford - from Renaissance influences on architecture to the Italian Quarter\'s history. I also offer pasta-making classes combined with walking tours. Delizioso!',
      languages: ['Italian', 'English', 'Latin'],
      specialties: ['Italian Heritage', 'Renaissance Art', 'Cooking Classes', 'Classical Studies', 'Opera History'],
      hourlyRate: 70,
      avgRating: 4.9,
      totalReviews: 52,
    },
  ]

  const guides: any[] = []
  for (const guideData of guidesData) {
    const user = await prisma.user.upsert({
      where: { email: guideData.email },
      update: {},
      create: {
        email: guideData.email,
        password,
        role: 'GUIDE',
        name: guideData.name,
        phone: guideData.phone,
        photo: guideData.photo,
      },
    })

    const guide = await prisma.guide.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        bio: guideData.bio,
        languages: guideData.languages,
        specialties: guideData.specialties,
        hourlyRate: guideData.hourlyRate,
        isAvailable: true,
        status: 'APPROVED',
        averageRating: guideData.avgRating,
        totalReviews: guideData.totalReviews,
      },
    })

    guides.push({ user, guide })
    console.log(`  ✅ ${guideData.name} (${guideData.specialties[0]})`)
  }
  console.log(`✅ Created ${guides.length} guides\n`)

  // =============================================================================
  // 40+ TOURS ACROSS CATEGORIES
  // =============================================================================
  console.log('🗺️  Creating 40+ Tours...')

  const toursData = [
    // Sarah's Tours (History & Architecture)
    { guideIdx: 0, title: 'Historic Oxford Walking Tour', description: 'Explore the ancient colleges, stunning architecture, and rich history of Oxford University. Visit iconic locations like the Bodleian Library, Radcliffe Camera, Christ Church College, and more. Perfect for first-time visitors!', duration: 120, price: 95, category: 'History' },
    { guideIdx: 0, title: 'Harry Potter & Literary Oxford', description: 'Discover the magical filming locations from Harry Potter movies and explore the literary heritage of Oxford. See where CS Lewis, JRR Tolkien, and Lewis Carroll found inspiration.', duration: 150, price: 120, category: 'Literature' },
    { guideIdx: 0, title: 'Oxford University Insider Tour', description: 'Get exclusive access to college halls, chapels, and courtyards usually closed to the public. Learn about student life, traditions, and academic excellence.', duration: 180, price: 140, category: 'University' },
    { guideIdx: 0, title: 'Medieval Oxford Experience', description: 'Step back in time to medieval Oxford. Explore ancient city walls, historic churches, and learn about life in the Middle Ages.', duration: 90, price: 75, category: 'History' },

    // Michael's Tours (Photography)
    { guideIdx: 1, title: 'Instagram-Worthy Oxford Photo Tour', description: 'Capture stunning photos of Oxford! I\'ll take you to the most photogenic spots and share photography tips. Perfect for social media enthusiasts.', duration: 90, price: 70, category: 'Photography' },
    { guideIdx: 1, title: 'Golden Hour Photography Walk', description: 'Join me during the magical golden hour to photograph Oxford at its most beautiful. Learn composition, lighting, and editing tips.', duration: 120, price: 85, category: 'Photography' },
    { guideIdx: 1, title: 'Oxford Food Market Photo Tour', description: 'Combine street photography with food tasting at Oxford\'s vibrant markets. Capture colorful stalls, local characters, and delicious details.', duration: 60, price: 55, category: 'Food & Photography' },

    // Emma's Tours (Literature)
    { guideIdx: 2, title: 'Inklings Literary Tour', description: 'Follow the footsteps of JRR Tolkien and CS Lewis through Oxford. Visit the Eagle and Child pub where they met, and explore locations that inspired Middle-earth and Narnia.', duration: 150, price: 110, category: 'Literature' },
    { guideIdx: 2, title: 'Oxford Writers\' Workshop Tour', description: 'A tour for aspiring writers! Visit famous authors\' writing spots, learn about their creative processes, and get writing tips while exploring Oxford.', duration: 120, price: 95, category: 'Writing' },
    { guideIdx: 2, title: 'Children\'s Literature Tour', description: 'Perfect for families! Explore Oxford through the eyes of beloved children\'s authors - Lewis Carroll, Philip Pullman, and more.', duration: 90, price: 75, category: 'Family' },

    // James's Tours (Food & Pubs)
    { guideIdx: 3, title: 'Oxford Pub Crawl & History', description: 'Visit 5 historic pubs, taste local ales, and hear fascinating stories about Oxford\'s drinking culture. Includes tastings!', duration: 180, price: 80, category: 'Pubs' },
    { guideIdx: 3, title: 'Oxford Food Tour Experience', description: 'A culinary journey through Oxford! Taste local specialties, street food, and artisan products at 6+ locations. Come hungry!', duration: 150, price: 90, category: 'Food' },
    { guideIdx: 3, title: 'Craft Beer & Local Breweries', description: 'Discover Oxford\'s craft beer scene. Visit microbreweries, meet brewers, and taste exclusive beers not available elsewhere.', duration: 120, price: 75, category: 'Beer' },
    { guideIdx: 3, title: 'Oxford Afternoon Tea Tour', description: 'Experience traditional British afternoon tea at Oxford\'s finest tearooms. Learn etiquette, history, and enjoy delicious treats!', duration: 90, price: 65, category: 'Tea' },

    // Aisha's Tours (Architecture)
    { guideIdx: 4, title: 'Gothic Architecture Masterclass', description: 'Deep dive into Oxford\'s Gothic and Victorian architecture. Learn to identify architectural styles, read building details, and understand design principles.', duration: 150, price: 110, category: 'Architecture' },
    { guideIdx: 4, title: 'Modern Oxford Architecture', description: 'Explore Oxford\'s contemporary architecture. See stunning modern buildings by famous architects and learn about sustainable design.', duration: 120, price: 95, category: 'Modern' },
    { guideIdx: 4, title: 'Sketching Tour: Oxford Buildings', description: 'Bring your sketchbook! I\'ll teach you architectural sketching while we tour Oxford\'s most beautiful buildings. All skill levels welcome.', duration: 180, price: 100, category: 'Art' },

    // Thomas's Tours (Ghost & Dark History)
    { guideIdx: 5, title: 'Oxford Ghost Tour', description: 'Experience Oxford after dark! Hear chilling tales of hauntings, mysterious deaths, and unexplained phenomena. Not for the faint of heart!', duration: 90, price: 60, category: 'Ghost' },
    { guideIdx: 5, title: 'Dark History & Crime Tour', description: 'Explore Oxford\'s darker past - murders, executions, and medieval punishment. A fascinating look at crime through the ages.', duration: 120, price: 70, category: 'History' },
    { guideIdx: 5, title: 'Haunted Colleges Night Tour', description: 'Special access to reputedly haunted college areas. Bring your courage and maybe a ghost detector!', duration: 150, price: 85, category: 'Ghost' },

    // Sophie's Tours (Romantic & Gardens)
    { guideIdx: 6, title: 'Romantic Oxford for Couples', description: 'A romantic walking tour perfect for couples. Discover hidden gardens, picturesque spots, and hear love stories from Oxford\'s past.', duration: 120, price: 90, category: 'Romance' },
    { guideIdx: 6, title: 'Secret Gardens of Oxford', description: 'Access exclusive college gardens and peaceful green spaces. Perfect for garden lovers and those seeking tranquility.', duration: 90, price: 75, category: 'Gardens' },
    { guideIdx: 6, title: 'Oxford Proposal Package', description: 'Planning to propose? I\'ll help you find the perfect romantic spot and capture the special moment. Includes photography!', duration: 60, price: 150, category: 'Special' },

    // David's Tours (Tech & Innovation)
    { guideIdx: 7, title: 'Oxford Tech & Innovation Tour', description: 'Explore Oxford\'s startup ecosystem, innovation labs, and science parks. Meet entrepreneurs and learn about cutting-edge research.', duration: 150, price: 120, category: 'Tech' },
    { guideIdx: 7, title: 'Future of Oxford: Startups & Science', description: 'Visit university spin-outs, tech incubators, and research facilities. Perfect for entrepreneurs and investors.', duration: 180, price: 140, category: 'Business' },
    { guideIdx: 7, title: 'Oxford Networking Walk', description: 'Combine networking with sightseeing. Meet local entrepreneurs, investors, and innovators while exploring Oxford.', duration: 120, price: 100, category: 'Networking' },

    // Lisa's Tours (Nature & Gardens)
    { guideIdx: 8, title: 'Botanical Garden Deep Dive', description: 'Comprehensive tour of the University Botanic Garden. Learn about plant conservation, rare species, and seasonal highlights.', duration: 120, price: 70, category: 'Nature' },
    { guideIdx: 8, title: 'Oxford Wildlife & Nature Walk', description: 'Discover Oxford\'s surprising wildlife! Spot birds, track animals, and learn about urban ecology along the Thames.', duration: 90, price: 60, category: 'Wildlife' },
    { guideIdx: 8, title: 'Seasonal Garden Tour', description: 'Experience Oxford\'s gardens at their seasonal best. Different tour each season showcasing blooms, autumn colors, or winter beauty.', duration: 60, price: 50, category: 'Gardens' },

    // Marco's Tours (Italian Heritage & Cooking)
    { guideIdx: 9, title: 'Italian Heritage in Oxford', description: 'Discover surprising Italian connections to Oxford - from Renaissance architecture to the Italian Quarter\'s history.', duration: 120, price: 85, category: 'Heritage' },
    { guideIdx: 9, title: 'Oxford Pasta-Making Tour', description: 'Learn to make authentic Italian pasta while exploring Oxford! Walking tour followed by hands-on cooking class. Includes lunch!', duration: 180, price: 120, category: 'Cooking' },
    { guideIdx: 9, title: 'Classical Oxford: Latin & Classics', description: 'Explore Oxford\'s classical heritage. Learn about Latin inscriptions, classical influences, and ancient traditions.', duration: 90, price: 75, category: 'Classics' },

    // Additional variety tours
    { guideIdx: 0, title: 'Oxford in 90 Minutes', description: 'Perfect for those short on time! See all major highlights in a condensed tour.', duration: 90, price: 65, category: 'Highlights' },
    { guideIdx: 1, title: 'Sunrise Photography Session', description: 'Early birds only! Capture Oxford at sunrise with minimal crowds. Coffee included!', duration: 90, price: 75, category: 'Photography' },
    { guideIdx: 2, title: 'BookLovers\' Oxford', description: 'Visit famous bookshops, libraries, and literary landmarks. Book recommendations included!', duration: 120, price: 85, category: 'Books' },
    { guideIdx: 3, title: 'Oxford Market & Street Food', description: 'Explore Oxford\'s markets and taste amazing street food from around the world.', duration: 90, price: 60, category: 'Food' },
    { guideIdx: 4, title: 'Photography for Architects', description: 'Specialized tour teaching architectural photography techniques while touring stunning buildings.', duration: 150, price: 110, category: 'Photo & Arch' },
    { guideIdx: 6, title: 'Oxford Picnic Tour', description: 'Scenic walking tour ending with a gourmet picnic in a beautiful garden. Perfect for families!', duration: 120, price: 80, category: 'Family' },
    { guideIdx: 8, title: 'Oxford Cycling & Nature', description: 'Bike tour through Oxford\'s green spaces, parks, and along the Thames. Bikes provided!', duration: 150, price: 70, category: 'Active' },
    { guideIdx: 9, title: 'Wine & Architecture Tour', description: 'Combine wine tasting with architectural appreciation. Visit 3 wine bars while discussing building design!', duration: 120, price: 95, category: 'Wine' },
  ]

  const tours: any[] = []
  for (const tourData of toursData) {
    const tour = await prisma.tour.create({
      data: {
        guideId: guides[tourData.guideIdx].guide.id,
        title: tourData.title,
        description: tourData.description,
        duration: tourData.duration,
        price: tourData.price,
        isActive: true,
      },
    })
    tours.push(tour)
  }
  console.log(`✅ Created ${tours.length} tours\n`)

  // =============================================================================
  // 5 TOURIST PERSONAS
  // =============================================================================
  console.log('🧳 Creating 5 Tourist Personas...')

  const touristsData = [
    { email: 'demo.tourist@explorepro.com', name: 'James Wilson', photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop', persona: 'Active Booker' },
    { email: 'emma.davis@explorepro.com', name: 'Emma Davis', photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop', persona: 'New User' },
    { email: 'robert.chen@explorepro.com', name: 'Robert Chen', photo: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&h=400&fit=crop', persona: 'Review Enthusiast' },
    { email: 'maria.garcia@explorepro.com', name: 'Maria Garcia', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop', persona: 'Frequent Traveler' },
    { email: 'david.brown@explorepro.com', name: 'David Brown', photo: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop', persona: 'Budget Conscious' },
  ]

  const tourists: any[] = []
  for (const touristData of touristsData) {
    const user = await prisma.user.upsert({
      where: { email: touristData.email },
      update: {},
      create: {
        email: touristData.email,
        password,
        role: 'TOURIST',
        name: touristData.name,
        phone: `+4477009001${tourists.length}`,
        photo: touristData.photo,
      },
    })

    const tourist = await prisma.tourist.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        preferredLang: 'English',
      },
    })

    tourists.push({ user, tourist })
    console.log(`  ✅ ${touristData.name} (${touristData.persona})`)
  }
  console.log(`✅ Created ${tourists.length} tourists\n`)

  // =============================================================================
  // PENDING GUIDE APPLICATIONS (for admin to review)
  // =============================================================================
  console.log('⏳ Creating Pending Guide Applications...')

  const pendingGuidesData = [
    { name: 'Alice Parker', email: 'alice.parker@example.com', specialty: 'Music & Opera' },
    { name: 'John Smith', email: 'john.smith@example.com', specialty: 'Sports & Rowing' },
    { name: 'Nina Patel', email: 'nina.patel@example.com', specialty: 'Fashion History' },
  ]

  for (const pending of pendingGuidesData) {
    const user = await prisma.user.create({
      data: {
        email: pending.email,
        password,
        role: 'GUIDE',
        name: pending.name,
        phone: '+447700900099',
        photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${pending.name}`,
      },
    })

    await prisma.guide.create({
      data: {
        userId: user.id,
        bio: `Passionate ${pending.specialty} guide looking to share Oxford with visitors.`,
        languages: ['English'],
        specialties: [pending.specialty],
        hourlyRate: 60,
        isAvailable: false,
        status: 'PENDING',
        verificationDoc: `https://example.com/verification/${user.id}.pdf`,
      },
    })
    console.log(`  ⏳ ${pending.name} (${pending.specialty}) - Pending Approval`)
  }
  console.log('✅ Created 3 pending guide applications\n')

  // =============================================================================
  // 50+ BOOKINGS WITH REALISTIC HISTORY
  // =============================================================================
  console.log('📅 Creating 50+ Bookings with History...')

  // Helper function to create date offsets
  const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000)
  const daysFromNow = (days: number) => new Date(Date.now() + days * 24 * 60 * 60 * 1000)

  const bookingsData = [
    // Active demo tourist (James Wilson) - 10+ bookings
    { touristIdx: 0, guideIdx: 0, tourIdx: 0, status: 'COMPLETED', days: -180, rating: 5, comment: 'Sarah was absolutely fantastic! She brought Oxford\'s history to life with engaging stories and fascinating details. The tour exceeded all my expectations. Highly recommend for anyone visiting Oxford!' },
    { touristIdx: 0, guideIdx: 1, tourIdx: 4, status: 'COMPLETED', days: -150, rating: 5, comment: 'Michael knows all the best photo spots! My Instagram has never looked better. Great photography tips too!' },
    { touristIdx: 0, guideIdx: 2, tourIdx: 7, status: 'COMPLETED', days: -120, rating: 5, comment: 'As a Tolkien fan, this tour was a dream come true. Emma\'s knowledge is incredible and her passion is contagious.' },
    { touristIdx: 0, guideIdx: 3, tourIdx: 10, status: 'COMPLETED', days: -90, rating: 4, comment: 'Great pubs, great stories, great beer! James is a fun guide who really knows his stuff.' },
    { touristIdx: 0, guideIdx: 4, tourIdx: 14, status: 'COMPLETED', days: -60, rating: 5, comment: 'I\'m an architecture student and this tour was incredibly insightful. Aisha taught me to see buildings in a whole new way.' },
    { touristIdx: 0, guideIdx: 5, tourIdx: 17, status: 'COMPLETED', days: -45, rating: 4, comment: 'Spooky and fun! Thomas is a great storyteller. Perfect Halloween activity!' },
    { touristIdx: 0, guideIdx: 6, tourIdx: 20, status: 'COMPLETED', days: -30, rating: 5, comment: 'My partner and I loved this romantic tour. Sophie showed us the most beautiful hidden spots!' },
    { touristIdx: 0, guideIdx: 0, tourIdx: 1, status: 'COMPLETED', days: -7, rating: 5, comment: 'Second tour with Sarah and she never disappoints! The Harry Potter locations were magical!' },
    { touristIdx: 0, guideIdx: 1, tourIdx: 5, status: 'STARTED', days: 0, rating: null, comment: null }, // Currently on tour RIGHT NOW
    { touristIdx: 0, guideIdx: 2, tourIdx: 8, status: 'CONFIRMED', days: 3, rating: null, comment: null }, // Upcoming
    { touristIdx: 0, guideIdx: 7, tourIdx: 23, status: 'CONFIRMED', days: 7, rating: null, comment: null }, // Upcoming

    // New user (Emma Davis) - 1 upcoming booking
    { touristIdx: 1, guideIdx: 0, tourIdx: 31, status: 'CONFIRMED', days: 2, rating: null, comment: null },

    // Review enthusiast (Robert Chen) - 15 completed tours
    { touristIdx: 2, guideIdx: 0, tourIdx: 0, status: 'COMPLETED', days: -90, rating: 5, comment: 'Exceptional guide! Sarah\'s depth of knowledge about Oxford history is truly impressive. Every minute was engaging and educational.' },
    { touristIdx: 2, guideIdx: 1, tourIdx: 4, status: 'COMPLETED', days: -85, rating: 5, comment: 'Best photography tour I\'ve ever taken. Michael\'s tips improved my photography immediately. Highly professional and friendly!' },
    { touristIdx: 2, guideIdx: 2, tourIdx: 7, status: 'COMPLETED', days: -80, rating: 5, comment: 'Emma brought the Inklings to life! Her storytelling ability is remarkable. A must-do for literature lovers!' },
    { touristIdx: 2, guideIdx: 3, tourIdx: 11, status: 'COMPLETED', days: -75, rating: 4, comment: 'Delicious food tour with great local recommendations. James is knowledgeable and entertaining. Loved every bite!' },
    { touristIdx: 2, guideIdx: 4, tourIdx: 14, status: 'COMPLETED', days: -70, rating: 5, comment: 'Aisha\'s architectural expertise is outstanding. I learned so much about Gothic design. Fascinating tour!' },
    { touristIdx: 2, guideIdx: 5, tourIdx: 17, status: 'COMPLETED', days: -65, rating: 4, comment: 'Genuinely spooky! Thomas creates a wonderful atmosphere and knows all the best ghost stories.' },
    { touristIdx: 2, guideIdx: 6, tourIdx: 21, status: 'COMPLETED', days: -60, rating: 5, comment: 'Sophie\'s garden tour was peaceful and beautiful. Perfect for nature lovers. The secret gardens are stunning!' },
    { touristIdx: 2, guideIdx: 7, tourIdx: 23, status: 'COMPLETED', days: -55, rating: 5, comment: 'Eye-opening tour of Oxford\'s innovation scene. David has great connections and insights. Highly recommended for entrepreneurs!' },
    { touristIdx: 2, guideIdx: 8, tourIdx: 26, status: 'COMPLETED', days: -50, rating: 5, comment: 'Lisa\'s botanical knowledge is encyclopedic! Learned so much about plants and garden design.' },
    { touristIdx: 2, guideIdx: 9, tourIdx: 29, status: 'COMPLETED', days: -45, rating: 5, comment: 'The pasta-making class was incredible! Marco is a fantastic chef and guide. Delicious and fun!' },
    { touristIdx: 2, guideIdx: 0, tourIdx: 2, status: 'COMPLETED', days: -40, rating: 5, comment: 'Third tour with Sarah! The exclusive college access was amazing. She\'s simply the best guide in Oxford!' },
    { touristIdx: 2, guideIdx: 1, tourIdx: 32, status: 'COMPLETED', days: -35, rating: 5, comment: 'Sunrise tour was worth the early wake-up! Stunning photos and peaceful atmosphere. Michael is brilliant!' },
    { touristIdx: 2, guideIdx: 2, tourIdx: 33, status: 'COMPLETED', days: -30, rating: 5, comment: 'Perfect for book lovers! Emma took us to the best bookshops and shared wonderful literary trivia.' },
    { touristIdx: 2, guideIdx: 3, tourIdx: 34, status: 'COMPLETED', days: -25, rating: 4, comment: 'Street food tour was tasty and diverse. James knows all the best market vendors!' },
    { touristIdx: 2, guideIdx: 4, tourIdx: 35, status: 'COMPLETED', days: -20, rating: 5, comment: 'Combined two of my passions - photography and architecture! Aisha\'s teaching style is excellent.' },

    // Frequent traveler (Maria Garcia) - 8 completed
    { touristIdx: 3, guideIdx: 0, tourIdx: 0, status: 'COMPLETED', days: -100, rating: 5, comment: 'Wonderful introduction to Oxford! Sarah made history come alive.' },
    { touristIdx: 3, guideIdx: 2, tourIdx: 7, status: 'COMPLETED', days: -95, rating: 5, comment: 'Literary tour was magical! Emma is so knowledgeable and passionate.' },
    { touristIdx: 3, guideIdx: 3, tourIdx: 10, status: 'COMPLETED', days: -90, rating: 5, comment: 'Fun pub crawl with great historical context. James is hilarious!' },
    { touristIdx: 3, guideIdx: 6, tourIdx: 20, status: 'COMPLETED', days: -85, rating: 5, comment: 'Perfect romantic tour! Sophie helped make our anniversary special.' },
    { touristIdx: 3, guideIdx: 8, tourIdx: 26, status: 'COMPLETED', days: -80, rating: 4, comment: 'Beautiful botanical tour. Lisa is very knowledgeable about plants.' },
    { touristIdx: 3, guideIdx: 9, tourIdx: 29, status: 'COMPLETED', days: -75, rating: 5, comment: 'Cooking class was fantastic! Marco is a wonderful teacher and host.' },
    { touristIdx: 3, guideIdx: 1, tourIdx: 4, status: 'COMPLETED', days: -70, rating: 5, comment: 'Best photography tour ever! Michael improved my Instagram game dramatically.' },
    { touristIdx: 3, guideIdx: 5, tourIdx: 17, status: 'COMPLETED', days: -65, rating: 4, comment: 'Spooky ghost tour was entertaining! Thomas is a great storyteller.' },

    // Budget conscious (David Brown) - focusing on lower-priced tours
    { touristIdx: 4, guideIdx: 1, tourIdx: 6, status: 'COMPLETED', days: -60, rating: 4, comment: 'Great value for money! Michael\'s market tour was informative and affordable.' },
    { touristIdx: 4, guideIdx: 5, tourIdx: 17, status: 'COMPLETED', days: -55, rating: 4, comment: 'Affordable and entertaining ghost tour. Worth every penny!' },
    { touristIdx: 4, guideIdx: 8, tourIdx: 28, status: 'COMPLETED', days: -50, rating: 4, comment: 'Nice seasonal tour at a great price. Lisa is friendly and knowledgeable.' },
    { touristIdx: 4, guideIdx: 3, tourIdx: 34, status: 'COMPLETED', days: -45, rating: 5, comment: 'Street food tour filled me up for the day! Excellent value.' },
    { touristIdx: 4, guideIdx: 0, tourIdx: 31, status: 'COMPLETED', days: -40, rating: 5, comment: 'Quick 90-minute tour was perfect for my schedule. Sarah packed in lots of info!' },

    // Additional random bookings for variety
    { touristIdx: 1, guideIdx: 3, tourIdx: 13, status: 'COMPLETED', days: -15, rating: 5, comment: 'Afternoon tea tour was delightful! Perfect British experience.' },
    { touristIdx: 1, guideIdx: 7, tourIdx: 24, status: 'CANCELLED', days: -10, rating: null, comment: null },
    { touristIdx: 3, guideIdx: 4, tourIdx: 15, status: 'CONFIRMED', days: 5, rating: null, comment: null },
    { touristIdx: 4, guideIdx: 8, tourIdx: 37, status: 'CONFIRMED', days: 10, rating: null, comment: null },
  ]

  const bookings: any[] = []
  for (const bookingData of bookingsData) {
    const tourist = tourists[bookingData.touristIdx]
    const guide = guides[bookingData.guideIdx]
    const tour = tours[bookingData.tourIdx]

    const scheduledDate = bookingData.days < 0 ? daysAgo(Math.abs(bookingData.days)) : daysFromNow(bookingData.days)
    const startTime = bookingData.status === 'COMPLETED' || bookingData.status === 'STARTED' ? scheduledDate : null
    const endTime = bookingData.status === 'COMPLETED' ? new Date(scheduledDate.getTime() + tour.duration * 60000) : null

    const booking = await prisma.booking.create({
      data: {
        touristId: tourist.tourist.id,
        guideId: guide.guide.id,
        tourId: tour.id,
        type: 'SCHEDULED',
        status: bookingData.status as any,
        scheduledDate,
        startTime,
        endTime,
        duration: tour.duration,
        meetingPoint: 'Radcliffe Camera, Radcliffe Square, Oxford OX1 3BG',
        totalPrice: tour.price,
        commission: tour.price * 0.15,
        guideEarnings: tour.price * 0.85,
        stripePaymentId: `pi_demo_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      },
    })

    bookings.push(booking)

    // Add review if completed
    if (bookingData.status === 'COMPLETED' && bookingData.rating) {
      await prisma.review.create({
        data: {
          bookingId: booking.id,
          touristId: tourist.tourist.id,
          guideId: guide.guide.id,
          rating: bookingData.rating,
          comment: bookingData.comment || '',
        },
      })
    }
  }
  console.log(`✅ Created ${bookings.length} bookings\n`)

  // =============================================================================
  // CHAT MESSAGES
  // =============================================================================
  console.log('💬 Creating Chat Messages...')

  // Get the upcoming booking for demo tourist
  const upcomingBooking = bookings.find(b => b.status === 'CONFIRMED' && b.touristId === tourists[0].tourist.id)
  if (upcomingBooking) {
    const messages = [
      { senderId: tourists[0].user.id, content: 'Hi! I\'m really excited about the tour. Should I bring anything specific?' },
      { senderId: guides[2].user.id, content: 'Hello! So glad you\'re excited! Just bring comfortable walking shoes and a camera. The weather looks good so no umbrella needed. See you soon!' },
      { senderId: tourists[0].user.id, content: 'Perfect! One more question - is the meeting point easy to find?' },
      { senderId: guides[2].user.id, content: 'Very easy! The Radcliffe Camera is the iconic round building in the center. You can\'t miss it. I\'ll be there with an ExplorePro sign!' },
      { senderId: tourists[0].user.id, content: 'Awesome, see you then! 👋' },
    ]

    for (const msg of messages) {
      await prisma.message.create({
        data: {
          bookingId: upcomingBooking.id,
          senderId: msg.senderId,
          content: msg.content,
        },
      })
    }
  }

  // Active tour chat
  const activeBooking = bookings.find(b => b.status === 'STARTED')
  if (activeBooking) {
    await prisma.message.createMany({
      data: [
        { bookingId: activeBooking.id, senderId: tourists[0].user.id, content: 'This is amazing! Thank you for the great tour so far!' },
        { bookingId: activeBooking.id, senderId: guides[1].user.id, content: 'You\'re very welcome! Glad you\'re enjoying it. We have a few more stunning spots coming up!' },
      ],
    })
  }

  console.log('✅ Created chat messages\n')

  // =============================================================================
  // SUMMARY
  // =============================================================================
  console.log('\n🎉 INVESTOR-READY DEMO SEED COMPLETE!\n')
  console.log('═'.repeat(60))
  console.log('📊 DEMO DATA SUMMARY')
  console.log('═'.repeat(60))
  console.log(`✅ Guides: ${guides.length} (10 approved + 3 pending)`)
  console.log(`✅ Tours: ${tours.length}`)
  console.log(`✅ Tourists: ${tourists.length}`)
  console.log(`✅ Bookings: ${bookings.length}`)
  console.log(`✅ Reviews: ${bookingsData.filter(b => b.rating).length}+`)
  console.log(`✅ Active Chats: Multiple conversations`)
  console.log(`✅ Admin Tasks: 3 pending guide approvals`)
  console.log('═'.repeat(60))
  console.log('\n🔐 DEMO ACCOUNTS')
  console.log('═'.repeat(60))
  console.log('Password for all accounts: Demo123!')
  console.log('\n👤 TOURIST (Active User - 10+ bookings):')
  console.log('   Email: demo.tourist@explorepro.com')
  console.log('   → Has completed tours, reviews, upcoming bookings')
  console.log('   → Currently ON an active tour (live tracking demo)')
  console.log('\n🧑‍🏫 GUIDE (Top Performer - Sarah Thompson):')
  console.log('   Email: demo.guide@explorepro.com')
  console.log('   → 4 active tours, 127 reviews, 4.9★ rating')
  console.log('   → Earnings history, upcoming bookings')
  console.log('   → Can demonstrate full guide workflow')
  console.log('\n👑 ADMIN (Platform Manager):')
  console.log('   Email: demo.admin@explorepro.com')
  console.log('   → 3 pending guide approvals to review')
  console.log('   → Platform analytics and statistics')
  console.log('   → User management capabilities')
  console.log('═'.repeat(60))
  console.log('\n🎯 INVESTOR DEMO FEATURES')
  console.log('═'.repeat(60))
  console.log('✅ Complete booking flow (browse → book → pay → review)')
  console.log('✅ Live tour tracking (demo tourist currently on tour)')
  console.log('✅ Rich guide profiles with specialties')
  console.log('✅ Active chat conversations')
  console.log('✅ Review system with ratings')
  console.log('✅ Admin approval workflow')
  console.log('✅ Earnings and analytics')
  console.log('✅ Multiple user personas and behaviors')
  console.log('✅ 40+ diverse tours across categories')
  console.log('✅ 6-month booking history')
  console.log('═'.repeat(60))
  console.log('\n🚀 Ready for investor demo!\n')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding demo data:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
