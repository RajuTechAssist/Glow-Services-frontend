// utils/productCategories.js
export const productCategories = [
    { 
        id: 'all', 
        name: 'All Products', 
        icon: '✨', 
        color: 'from-pink-400 to-purple-500',
        description: 'Browse our complete beauty collection'
    },
    { 
        id: 'skincare', 
        name: 'Skincare', 
        icon: '🧴', 
        color: 'from-rose-400 to-pink-500',
        description: 'Cleansers, serums, moisturizers & treatments'
    },
    { 
        id: 'makeup', 
        name: 'Makeup', 
        icon: '💄', 
        color: 'from-fuchsia-400 to-pink-500',
        description: 'Foundation, lipstick, eyeshadow & more'
    },
    { 
        id: 'haircare', 
        name: 'Hair Care', 
        icon: '💇', 
        color: 'from-purple-400 to-fuchsia-500',
        description: 'Shampoo, conditioner, treatments & styling'
    },
    { 
        id: 'bath-body', 
        name: 'Bath & Body', 
        icon: '🛁', 
        color: 'from-violet-400 to-purple-500',
        description: 'Body wash, lotions, scrubs & oils'
    },
    { 
        id: 'fragrance', 
        name: 'Fragrance', 
        icon: '🌸', 
        color: 'from-pink-300 to-rose-400',
        description: 'Perfumes, body mists & scented products'
    },
    { 
        id: 'nail-care', 
        name: 'Nail Care', 
        icon: '💅', 
        color: 'from-rose-400 to-pink-500',
        description: 'Polish, treatments & nail tools'
    },
    { 
        id: 'tools', 
        name: 'Tools & Accessories', 
        icon: '🎀', 
        color: 'from-indigo-400 to-purple-500',
        description: 'Brushes, sponges & beauty tools'
    },
    { 
        id: 'mens', 
        name: 'Men\'s Grooming', 
        icon: '🧔', 
        color: 'from-gray-500 to-blue-500',
        description: 'Skincare, shaving & grooming for men'
    },
    { 
        id: 'sun-care', 
        name: 'Sun Care', 
        icon: '☀️', 
        color: 'from-yellow-400 to-orange-400',
        description: 'Sunscreens, after-sun & tanning products'
    },
    { 
        id: 'specialty', 
        name: 'Specialty Treatments', 
        icon: '💎', 
        color: 'from-purple-500 to-indigo-500',
        description: 'Professional treatments & serums'
    },
    { 
        id: 'natural', 
        name: 'Natural & Organic', 
        icon: '🌿', 
        color: 'from-green-400 to-emerald-500',
        description: 'Vegan, cruelty-free & organic beauty'
    }
];

export const sortOptions = [
    { id: 'popular', name: 'Most Popular', icon: '⭐', color: 'from-yellow-400 to-orange-400' },
    { id: 'newest', name: 'Newest First', icon: '🆕', color: 'from-teal-400 to-cyan-500' },
    { id: 'price-low', name: 'Price: Low to High', icon: '💰', color: 'from-green-400 to-emerald-500' },
    { id: 'price-high', name: 'Price: High to Low', icon: '💎', color: 'from-blue-400 to-indigo-500' },
    { id: 'rating', name: 'Highest Rated', icon: '🌟', color: 'from-amber-400 to-yellow-500' },
    { id: 'name', name: 'A to Z', icon: '🔤', color: 'from-gray-400 to-slate-500' }
];

// Get category by ID
export const getCategoryById = (categoryId) => {
    return productCategories.find(cat => cat.id === categoryId) || productCategories[0];
};

// Get sort option by ID  
export const getSortOptionById = (sortId) => {
    return sortOptions.find(sort => sort.id === sortId) || sortOptions[0];
};