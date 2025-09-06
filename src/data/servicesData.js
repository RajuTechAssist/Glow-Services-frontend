export const serviceCategories = [
  { id: 'all', name: 'All Services', icon: '✨' },
  { id: 'facial', name: 'Facial & Clean Up', icon: '🧴' },
  { id: 'waxing', name: 'Waxing & Hair Removal', icon: '🪒' },
  { id: 'nails', name: 'Nail Care', icon: '💅' },
  { id: 'body', name: 'Body Care', icon: '🧖‍♀️' },
  { id: 'makeup', name: 'Makeup & Bridal', icon: '💄' },
  { id: 'threading', name: 'Threading & Bleach', icon: '🎯' },
  { id: 'combo', name: 'Combo Offers', icon: '🎁' }
];

export const services = [
  // Facial & Clean Up
  {
    id: 1,
    name: 'Facial Treatment',
    slug: 'facial-treatment',
    category: 'facial',
    price: 800,
    originalPrice: 1000,
    duration: '60 mins',
    rating: 4.8,
    reviews: 245,
    description: 'Professional facial treatment for glowing, healthy skin with deep cleansing and nourishment.',
    longDescription: 'Our signature facial treatment includes deep cleansing, exfoliation, steaming, extraction, massage, and moisturizing. Perfect for all skin types, this treatment will leave your skin feeling refreshed, rejuvenated, and glowing.',
    features: [
      'Deep cleansing and exfoliation',
      'Professional steaming',
      'Gentle extraction',
      'Relaxing face massage',
      'Hydrating mask application',
      'Premium skincare products'
    ],
    image: '/images/services/facial.jpg',
    gallery: ['/images/services/facial-1.jpg', '/images/services/facial-2.jpg'],
    gradient: 'from-pink-500 to-rose-500',
    popular: true,
    benefits: ['Improved skin texture', 'Deep hydration', 'Reduced fine lines', 'Natural glow']
  },
  {
    id: 2,
    name: 'Face Clean Up',
    slug: 'face-clean-up',
    category: 'facial',
    price: 500,
    originalPrice: 650,
    duration: '45 mins',
    rating: 4.7,
    reviews: 189,
    description: 'Quick and effective face clean up for instant freshness and cleaner pores.',
    longDescription: 'A refreshing face clean up service that removes dirt, oil, and impurities from your skin. Includes cleansing, scrubbing, steaming, and moisturizing for an instant fresh look.',
    features: [
      'Deep pore cleansing',
      'Gentle scrubbing',
      'Steam treatment',
      'Blackhead removal',
      'Toning and moisturizing'
    ],
    image: '/images/services/cleanup.jpg',
    gradient: 'from-blue-500 to-cyan-500',
    popular: false,
    benefits: ['Cleaner pores', 'Fresh skin', 'Oil control', 'Smooth texture']
  },

  // Waxing & Hair Removal
  {
    id: 3,
    name: 'Full Body Waxing',
    slug: 'full-body-waxing',
    category: 'waxing',
    price: 2000,
    originalPrice: 2500,
    duration: '90 mins',
    rating: 4.9,
    reviews: 312,
    description: 'Complete body waxing service for smooth, hair-free skin that lasts weeks.',
    longDescription: 'Professional full body waxing using high-quality wax for long-lasting results. Includes arms, legs, underarms, and bikini line waxing with proper aftercare.',
    features: [
      'Full arms and legs waxing',
      'Underarms waxing',
      'Bikini line waxing',
      'Premium quality wax',
      'Aftercare treatment',
      'Long-lasting results'
    ],
    image: '/images/services/waxing.jpg',
    gradient: 'from-purple-500 to-pink-500',
    popular: true,
    benefits: ['Smooth skin for weeks', 'Professional technique', 'Reduced hair growth', 'Soft skin']
  },

  // Nail Care
  {
    id: 4,
    name: 'Professional Pedicure',
    slug: 'professional-pedicure',
    category: 'nails',
    price: 400,
    originalPrice: 500,
    duration: '45 mins',
    rating: 4.8,
    reviews: 198,
    description: 'Relaxing pedicure service for healthy, beautiful feet and nails.',
    longDescription: 'Complete pedicure treatment including soaking, scrubbing, nail trimming, cuticle care, massage, and polish application.',
    features: [
      'Foot soaking and cleaning',
      'Nail trimming and shaping',
      'Cuticle care',
      'Foot scrub and massage',
      'Nail polish application',
      'Moisturizing treatment'
    ],
    image: '/images/services/pedicure.jpg',
    gradient: 'from-emerald-500 to-teal-500',
    popular: false,
    benefits: ['Healthy nails', 'Soft feet', 'Relaxation', 'Beautiful appearance']
  },
  {
    id: 5,
    name: 'Professional Manicure',
    slug: 'professional-manicure',
    category: 'nails',
    price: 500,
    originalPrice: 600,
    duration: '40 mins',
    rating: 4.7,
    reviews: 156,
    description: 'Complete manicure service for perfectly groomed hands and nails.',
    longDescription: 'Professional manicure including nail care, cuticle treatment, hand massage, and premium polish application.',
    features: [
      'Hand cleansing and soaking',
      'Nail shaping and buffing',
      'Cuticle treatment',
      'Hand massage',
      'Base coat and polish',
      'Top coat application'
    ],
    image: '/images/services/manicure.jpg',
    gradient: 'from-rose-500 to-pink-500',
    popular: false,
    benefits: ['Well-groomed nails', 'Soft hands', 'Long-lasting polish', 'Professional look']
  },

  // Body Care
  {
    id: 6,
    name: 'Body Scrub Treatment',
    slug: 'body-scrub-treatment',
    category: 'body',
    price: 500,
    originalPrice: 700,
    duration: '50 mins',
    rating: 4.8,
    reviews: 134,
    description: 'Exfoliating body scrub for smooth, glowing skin all over.',
    longDescription: 'Full body exfoliation treatment using natural scrubs to remove dead skin cells and reveal soft, glowing skin.',
    features: [
      'Full body exfoliation',
      'Natural scrub ingredients',
      'Deep moisturizing',
      'Improved circulation',
      'Soft, smooth skin'
    ],
    image: '/images/services/body-scrub.jpg',
    gradient: 'from-amber-500 to-orange-500',
    popular: false,
    benefits: ['Smoother skin', 'Better circulation', 'Natural glow', 'Relaxation']
  },
  {
    id: 7,
    name: 'Body Polishing',
    slug: 'body-polishing',
    category: 'body',
    price: 2000,
    originalPrice: 2500,
    duration: '75 mins',
    rating: 4.9,
    reviews: 87,
    description: 'Luxury body polishing treatment for radiant, glowing skin.',
    longDescription: 'Premium body polishing service that combines exfoliation, nourishment, and hydration for beautifully glowing skin.',
    features: [
      'Luxury body exfoliation',
      'Premium products',
      'Deep nourishment',
      'Skin brightening',
      'Long-lasting glow'
    ],
    image: '/images/services/body-polishing.jpg',
    gradient: 'from-indigo-500 to-purple-500',
    popular: true,
    benefits: ['Radiant glow', 'Improved texture', 'Brighter skin', 'Luxury experience']
  },

  // Threading & Bleach
  {
    id: 8,
    name: 'Threading Work',
    slug: 'threading-work',
    category: 'threading',
    price: 100,
    originalPrice: 150,
    duration: '20 mins',
    rating: 4.6,
    reviews: 298,
    description: 'Precise eyebrow and facial hair threading for perfect shape.',
    longDescription: 'Professional threading service for eyebrows, upper lip, and facial hair removal using traditional threading technique.',
    features: [
      'Eyebrow shaping',
      'Upper lip threading',
      'Facial hair removal',
      'Precise technique',
      'Natural look'
    ],
    image: '/images/services/threading.jpg',
    gradient: 'from-teal-500 to-cyan-500',
    popular: false,
    benefits: ['Perfect eyebrow shape', 'Precise hair removal', 'Long-lasting results', 'Natural technique']
  },
  {
    id: 9,
    name: 'Face Bleach',
    slug: 'face-bleach',
    category: 'threading',
    price: 250,
    originalPrice: 300,
    duration: '30 mins',
    rating: 4.5,
    reviews: 167,
    description: 'Gentle face bleaching for brighter, even-toned skin.',
    longDescription: 'Professional face bleaching service to lighten facial hair and achieve brighter, more even skin tone.',
    features: [
      'Gentle bleaching formula',
      'Even skin tone',
      'Hair lightening',
      'Skin brightening',
      'Safe products'
    ],
    image: '/images/services/bleach.jpg',
    gradient: 'from-yellow-500 to-orange-500',
    popular: false,
    benefits: ['Brighter skin', 'Even tone', 'Lightened hair', 'Confident look']
  },

  // Makeup & Bridal
  {
    id: 10,
    name: 'Party Makeup',
    slug: 'party-makeup',
    category: 'makeup',
    price: 3000,
    originalPrice: 3500,
    duration: '60 mins',
    rating: 4.9,
    reviews: 145,
    description: 'Glamorous party makeup for special occasions and events.',
    longDescription: 'Professional party makeup service for special events, parties, and celebrations. Includes full face makeup with premium products.',
    features: [
      'Full face makeup',
      'Premium cosmetics',
      'Long-lasting formula',
      'Professional application',
      'Event-appropriate look'
    ],
    image: '/images/services/party-makeup.jpg',
    gradient: 'from-pink-500 to-purple-500',
    popular: true,
    benefits: ['Glamorous look', 'Long-lasting', 'Professional finish', 'Perfect for events']
  },
  {
    id: 11,
    name: 'Pre-Bridal Package',
    slug: 'pre-bridal-package',
    category: 'makeup',
    price: 8000,
    originalPrice: 10000,
    duration: '4 hours',
    rating: 5.0,
    reviews: 67,
    description: 'Comprehensive pre-bridal beauty package for the perfect bridal glow.',
    longDescription: 'Complete pre-bridal treatment including facial, body care, hair treatment, and makeup trial for the perfect bridal preparation.',
    features: [
      'Bridal facial treatment',
      'Body polishing',
      'Hair spa treatment',
      'Makeup trial',
      'Bridal consultation'
    ],
    image: '/images/services/pre-bridal.jpg',
    gradient: 'from-rose-500 to-pink-500',
    popular: true,
    benefits: ['Complete preparation', 'Bridal glow', 'Professional consultation', 'Perfect results']
  },
  {
    id: 12,
    name: 'Bridal Makeup',
    slug: 'bridal-makeup',
    category: 'makeup',
    price: 10000,
    originalPrice: 12000,
    duration: '3 hours',
    rating: 5.0,
    reviews: 89,
    description: 'Stunning bridal makeup for your special day with premium products.',
    longDescription: 'Complete bridal makeup service including full face makeup, hairstyling, and touch-ups for your wedding day.',
    features: [
      'Full bridal makeup',
      'Professional hairstyling',
      'Premium cosmetics',
      'Touch-up service',
      'Long-lasting formula',
      'Bridal accessories'
    ],
    image: '/images/services/bridal-makeup.jpg',
    gradient: 'from-gold-500 to-rose-500',
    popular: true,
    benefits: ['Perfect bridal look', 'Professional styling', 'Long-lasting', 'Memorable appearance']
  }
];

// Combo Offers from the pamphlet
export const comboOffers = [
  {
    id: 'combo1',
    name: 'Basic Glow Combo',
    slug: 'basic-glow-combo',
    category: 'combo',
    price: 899,
    originalPrice: 1200,
    duration: '2 hours',
    rating: 4.8,
    reviews: 156,
    description: 'Perfect starter combo for a complete glow-up experience.',
    longDescription: 'Our most popular combo package includes face clean up, waxing services, bleach, and threading for a complete makeover.',
    services: [
      'Face Clean Up',
      'Full Arms Wax',
      'Underarms Wax',
      'Half Legs Wax',
      'Bleach',
      'Threading Upper Lip'
    ],
    features: [
      'Complete facial cleaning',
      'Smooth hair-free skin',
      'Professional threading',
      'Skin brightening',
      'Long-lasting results'
    ],
    image: '/images/services/combo-basic.jpg',
    gradient: 'from-green-500 to-emerald-500',
    popular: true,
    savings: 301,
    benefits: ['Complete makeover', 'Great value', 'Time-saving', 'Professional results']
  },
  {
    id: 'combo2',
    name: 'Premium Glow Combo',
    slug: 'premium-glow-combo',
    category: 'combo',
    price: 1199,
    originalPrice: 1600,
    duration: '2.5 hours',
    rating: 4.9,
    reviews: 123,
    description: 'Enhanced combo with facial treatment and relaxing back massage.',
    longDescription: 'Premium package combining facial treatment, complete waxing, and relaxing back massage for the ultimate pampering experience.',
    services: [
      'Lotus or Charcoal Facial',
      'Full Arms Wax',
      'Underarms Wax',
      'Full Legs Wax',
      'Bleach',
      'Threading Upper Lip',
      'Back Massage'
    ],
    features: [
      'Premium facial treatment',
      'Complete body waxing',
      'Relaxing back massage',
      'Skin brightening',
      'Professional threading'
    ],
    image: '/images/services/combo-premium.jpg',
    gradient: 'from-purple-500 to-indigo-500',
    popular: true,
    savings: 401,
    benefits: ['Luxury experience', 'Complete relaxation', 'Premium treatments', 'Best value']
  },
  {
    id: 'combo3',
    name: 'Korean Glow Combo',
    slug: 'korean-glow-combo',
    category: 'combo',
    price: 1499,
    originalPrice: 2000,
    duration: '3 hours',
    rating: 5.0,
    reviews: 98,
    description: 'Luxury Korean facial combo with complete body care and back scrub.',
    longDescription: 'Ultimate luxury package with Korean facial, complete waxing services, and rejuvenating back scrub for the perfect glow.',
    services: [
      'Korean Facial',
      'Full Arms Wax',
      'Underarms Wax',
      'Full Legs Wax',
      'Bleach',
      'Threading Upper Lip',
      'Back Scrub'
    ],
    features: [
      'Authentic Korean facial',
      'Complete hair removal',
      'Exfoliating back scrub',
      'Skin brightening',
      'Professional threading'
    ],
    image: '/images/services/combo-korean.jpg',
    gradient: 'from-rose-500 to-pink-500',
    popular: true,
    savings: 501,
    benefits: ['Korean skincare', 'Complete transformation', 'Luxury treatment', 'Maximum savings']
  }
];

// Combine all services for easy access
export const allServices = [...services, ...comboOffers];

// Helper functions
export const getServiceBySlug = (slug) => {
  return allServices.find(service => service.slug === slug);
};

export const getServicesByCategory = (categoryId) => {
  if (categoryId === 'all') return allServices;
  return allServices.filter(service => service.category === categoryId);
};

export const getFeaturedServices = () => {
  return allServices.filter(service => service.popular);
};

export const getRelatedServices = (currentService, limit = 3) => {
  return allServices
    .filter(service => 
      service.category === currentService.category && 
      service.id !== currentService.id
    )
    .slice(0, limit);
};
