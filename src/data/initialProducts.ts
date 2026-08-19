import { Product, Order, BespokeRequest } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  // SAREES
  {
    id: 'saree-01',
    sku: 'AL-SAR-001',
    name: 'Kashi Vermillion Kanjeevaram Silk Saree',
    tagline: 'Pure mulberry silk woven with antique gold zari kadwa border',
    category: 'sarees',
    subcategory: 'Silk Sarees',
    price: 18500,
    originalPrice: 22000,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=85'
    ],
    fabric: 'Pure Mulberry Silk (Silk Mark Certified)',
    color: 'Vermillion & Antique Gold',
    colorHex: '#B23A2B',
    occasion: 'Weddings & Bridal Occasions',
    description: 'An ode to generational artistry, this handloom Kanjeevaram saree is drenched in rich vermillion and woven with 24k gold tested zari motifs featuring traditional peacock and chakra jaal.',
    craftDetails: [
      'Authentic handloom weave from Varanasi artisans',
      'Includes unstitched pure silk blouse piece (0.8m)',
      'Certified Silk Mark guaranteed',
      'Weight: 750 grams of pure drape luxury'
    ],
    careInstructions: 'Dry clean only. Store wrapped in pure muslin cloth away from moisture.',
    availableSizes: ['Free Size (6.3m with blouse)'],
    inStock: true,
    stockCount: 8,
    isBestSeller: true,
    isNewArrival: false,
    isCustomizable: true,
    customizationBasePrice: 1500,
    rating: 4.9,
    reviewCount: 48,
    reviews: [
      {
        id: 'rev-1',
        author: 'Ananya Sharma',
        location: 'Bengaluru',
        rating: 5,
        date: '12 May 2026',
        comment: 'The saree drape is like liquid gold. The fall and blouse stitching service from their bespoke team was done to perfection!',
        verified: true
      },
      {
        id: 'rev-2',
        author: 'Radhika Iyer',
        location: 'Chennai',
        rating: 5,
        date: '28 April 2026',
        comment: 'Pure elegance. Received so many compliments at my sister’s sangeet. The beige packaging and handwritten note were so thoughtful.',
        verified: true
      }
    ]
  },
  {
    id: 'saree-02',
    sku: 'AL-SAR-002',
    name: 'Oatmeal Whisper Hand-Painted Organza Saree',
    tagline: 'Translucent silk organza with pastel flora and hand-done scalloped zardozi edges',
    category: 'sarees',
    subcategory: 'Organza Sarees',
    price: 14200,
    originalPrice: 16500,
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85'
    ],
    fabric: 'Pure Silk Organza',
    color: 'Oatmeal Champagne',
    colorHex: '#E7DEC8',
    occasion: 'Day Soirées & Mehendi',
    description: 'Ethereal, featherlight pure silk organza draped in warm oatmeal beige hues, adorned with delicate botanical hand-paintings and finished with hand-cut cutwork scallop borders.',
    craftDetails: [
      'Hand-painted by master Kalamkari artists',
      'Micro-cutwork scalloped zari edging',
      'Ultra-lightweight 380 grams for effortless movement',
      'Comes with satin lining and raw silk unstitched blouse piece'
    ],
    careInstructions: 'Strictly dry clean. Gentle low iron on reverse side with protective layer.',
    availableSizes: ['Free Size (6.2m with blouse)'],
    inStock: true,
    stockCount: 5,
    isBestSeller: true,
    isNewArrival: true,
    isCustomizable: true,
    customizationBasePrice: 1800,
    rating: 4.8,
    reviewCount: 32,
    reviews: [
      {
        id: 'rev-3',
        author: 'Meera Deshmukh',
        location: 'Mumbai',
        rating: 5,
        date: '02 June 2026',
        comment: 'So airy and luxurious. The hand-painted flowers look like fine art. Super prompt WhatsApp support for drape advice.',
        verified: true
      }
    ]
  },
  {
    id: 'saree-03',
    sku: 'AL-SAR-003',
    name: 'Chanderi Sand Gold Tissue Saree',
    tagline: 'Metallic warp gossamer drape with delicate hand-block printed booties',
    category: 'sarees',
    subcategory: 'Tissue & Chanderi',
    price: 11900,
    originalPrice: 13900,
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85'
    ],
    fabric: 'Silk Tissue Chanderi',
    color: 'Sand Gold',
    colorHex: '#D4AF37',
    occasion: 'Cocktail & Evening Receptions',
    description: 'A luminous metallic tissue drape that catches natural amber light effortlessly. Featuring delicate golden gota patti accents on the pallu.',
    craftDetails: [
      'Woven on traditional pit looms in Madhya Pradesh',
      'Real zari gossamer thread interwoven with fine silk',
      'Includes matching running blouse piece'
    ],
    careInstructions: 'Dry clean only. Roll fold to protect tissue zari integrity.',
    availableSizes: ['Free Size (6.2m)'],
    inStock: true,
    stockCount: 12,
    isBestSeller: false,
    isNewArrival: true,
    isCustomizable: true,
    customizationBasePrice: 1200,
    rating: 4.7,
    reviewCount: 19,
    reviews: []
  },

  // ETHNIC WEAR
  {
    id: 'ethnic-01',
    sku: 'AL-ETH-101',
    name: 'Ivory Raw Silk Angrakha Anarkali Set',
    tagline: '3-piece ensemble with hand-done Marodi embroidery and tissue organza dupatta',
    category: 'ethnic',
    subcategory: 'Anarkali Sets',
    price: 24500,
    originalPrice: 28000,
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=85'
    ],
    fabric: 'Pure Raw Silk with Silk Mulmul lining',
    color: 'Warm Ivory & Sand',
    colorHex: '#FDFBF7',
    occasion: 'Weddings, Engagements & Festivals',
    description: 'Majestic 24-kali Angrakha silhouette accented with signature hand-carved mother-of-pearl latkans and intricately embroidered Marodi borders.',
    craftDetails: [
      '24 flared kalis creating a dramatic 6-meter flare',
      'Hand embroidery by heritage craftswomen of Rajasthan',
      'Churidar in stretch raw silk for comfort',
      'Organza dupatta with four-side scalloped border'
    ],
    careInstructions: 'Dry clean only.',
    availableSizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom Made-to-Measure'],
    inStock: true,
    stockCount: 6,
    isBestSeller: true,
    isNewArrival: false,
    isCustomizable: true,
    customizationBasePrice: 2500,
    rating: 5.0,
    reviewCount: 39,
    reviews: [
      {
        id: 'rev-4',
        author: 'Sneha Patel',
        location: 'Ahmedabad',
        rating: 5,
        date: '14 May 2026',
        comment: 'The fit using their custom measurement form was impeccable! I gave my custom waist and bust, and it felt like second skin.',
        verified: true
      }
    ]
  },
  {
    id: 'ethnic-02',
    sku: 'AL-ETH-102',
    name: 'Almond & Taupe Chanderi Kurta Co-ord Set',
    tagline: 'Relaxed flared kurta with cigarette trousers and sheer silk stole',
    category: 'ethnic',
    subcategory: 'Kurta Sets',
    price: 9800,
    originalPrice: 11500,
    images: [
      'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=85'
    ],
    fabric: 'Handspun Chanderi Cotton Silk',
    color: 'Almond Taupe',
    colorHex: '#C5B5A1',
    occasion: 'Festive Luncheons & Casual Festive',
    description: 'A breathable celebration of understated luxury. Tailored with inverted pleat accents, pin-tucked sleeves, and finished with thread-work button details.',
    craftDetails: [
      'Pre-washed pure handloom cotton silk',
      'Side pockets integrated seamlessly in trousers and kurta',
      'Breathable mulmul lining'
    ],
    careInstructions: 'Dry clean recommended or gentle hand wash in cold water with mild detergent.',
    availableSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom Made-to-Measure'],
    inStock: true,
    stockCount: 15,
    isBestSeller: false,
    isNewArrival: true,
    isCustomizable: true,
    customizationBasePrice: 800,
    rating: 4.8,
    reviewCount: 22,
    reviews: []
  },
  {
    id: 'ethnic-03',
    sku: 'AL-ETH-103',
    name: 'Dune Terracotta Embroidered Lehenga Set',
    tagline: 'Modern minimal bridal lehenga with tone-on-tone threadwork and micro pearls',
    category: 'ethnic',
    subcategory: 'Lehenga Ensembles',
    price: 36000,
    originalPrice: 42000,
    images: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=85'
    ],
    fabric: 'Raw Silk & Dupion Silk',
    color: 'Warm Terracotta Sand',
    colorHex: '#C37D60',
    occasion: 'Bride / Bridesmaid Festive Luxury',
    description: 'An earthy minimalist silhouette crafted for the modern woman who cherishes quiet luxury over loud motifs. Hand-beaded with fine river pearls and tonal copper sequins.',
    craftDetails: [
      'Includes padded blouse with sweetheart neckline',
      'Can-can layer built in with double satin lining',
      'Dual dupatta styling optional via custom studio'
    ],
    careInstructions: 'Professional dry clean only.',
    availableSizes: ['S', 'M', 'L', 'Custom Made-to-Measure'],
    inStock: true,
    stockCount: 4,
    isBestSeller: true,
    isNewArrival: false,
    isCustomizable: true,
    customizationBasePrice: 3000,
    rating: 4.9,
    reviewCount: 16,
    reviews: []
  },

  // WESTERN WEAR
  {
    id: 'west-01',
    sku: 'AL-WST-201',
    name: 'Riviera Sand Pure Linen Trench Dress',
    tagline: 'Double-breasted midi silhouette with horn buttons and removable waist tie',
    category: 'western',
    subcategory: 'Dresses & Outerwear',
    price: 8400,
    originalPrice: 9800,
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=85'
    ],
    fabric: '100% Belgian Flax Linen (220 GSM)',
    color: 'Warm Oatmeal',
    colorHex: '#E4DDD2',
    occasion: 'Resort Wear, Workwear & Gallery Evenings',
    description: 'Sculptural elegance meets high comfort. Tailored from European flax linen with a structured storm flap, wide notch lapels, and deep functional welt pockets.',
    craftDetails: [
      'Ethically sourced Belgian organic flax',
      'Custom natural tortoiseshell buttons',
      'French seams throughout for lifetime durability'
    ],
    careInstructions: 'Machine wash cold gentle cycle. Line dry in shade. Warm iron damp.',
    availableSizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom Made-to-Measure'],
    inStock: true,
    stockCount: 11,
    isBestSeller: true,
    isNewArrival: true,
    isCustomizable: true,
    customizationBasePrice: 750,
    rating: 4.8,
    reviewCount: 29,
    reviews: [
      {
        id: 'rev-5',
        author: 'Tara Roy',
        location: 'New Delhi',
        rating: 5,
        date: '10 May 2026',
        comment: 'The linen quality is divine. Heavyweight yet wonderfully breathable. Wore it both as a coat and a dress!',
        verified: true
      }
    ]
  },
  {
    id: 'west-02',
    sku: 'AL-WST-202',
    name: 'Sculpted Crepe Blazer & Trousers Co-ord',
    tagline: 'Tailored single-button blazer paired with high-waist pleated wide-leg trousers',
    category: 'western',
    subcategory: 'Co-ords & Suits',
    price: 12500,
    originalPrice: 14500,
    images: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85'
    ],
    fabric: 'Heavy Silk Crepe blend',
    color: 'Creamy Latte',
    colorHex: '#EFE8DE',
    occasion: 'Power Dressing & Evening Soirées',
    description: 'Clean architectural lines designed for the modern trailblazer. Sharp structured shoulders with relaxed fluid trousers that pool elegantly over footwear.',
    craftDetails: [
      'Satin cupro interior lining',
      'Concealed hook and bar trouser closure with inner anti-slip waistband',
      'Can be customized to bespoke inseam and shoulder width'
    ],
    careInstructions: 'Dry clean only.',
    availableSizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom Made-to-Measure'],
    inStock: true,
    stockCount: 8,
    isBestSeller: false,
    isNewArrival: true,
    isCustomizable: true,
    customizationBasePrice: 1200,
    rating: 4.9,
    reviewCount: 14,
    reviews: []
  },
  {
    id: 'west-03',
    sku: 'AL-WST-203',
    name: 'Sirocco Silk Tiered Maxi Dress',
    tagline: 'Fluid bias-cut halterneck dress in warm champagne tones',
    category: 'western',
    subcategory: 'Dresses',
    price: 9400,
    originalPrice: 11000,
    images: [
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85'
    ],
    fabric: 'Pure Mulberry Habotai Silk',
    color: 'Champagne Glow',
    colorHex: '#F6EEDB',
    occasion: 'Destination Weddings & Dinners',
    description: 'Effortless romance. A graceful drape cut on the bias to gently hug the body and flow into an airy floor-grazing hem.',
    craftDetails: [
      'Self-tie neck bow with custom metal toggles',
      'Includes optional belt sash',
      'Fully lined in sheer modal silk'
    ],
    careInstructions: 'Dry clean or gentle cold hand wash.',
    availableSizes: ['XS', 'S', 'M', 'L', 'Custom Made-to-Measure'],
    inStock: true,
    stockCount: 10,
    isBestSeller: false,
    isNewArrival: false,
    isCustomizable: true,
    customizationBasePrice: 900,
    rating: 4.7,
    reviewCount: 18,
    reviews: []
  },

  // ACCESSORIES
  {
    id: 'acc-01',
    sku: 'AL-ACC-301',
    name: 'Kundan & Freshwater Pearl Minaudière Potli',
    tagline: 'Hand-embroidered silk velvet potli bag with brass ring handle and silk tassels',
    category: 'accessories',
    subcategory: 'Bags & Potlis',
    price: 4600,
    originalPrice: 5500,
    images: [
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=85'
    ],
    fabric: 'Silk Velvet & Gold Thread',
    color: 'Antique Gold & Champagne',
    colorHex: '#D1C2A5',
    occasion: 'Weddings & Festive Parties',
    description: 'An artisanal treasure. Crafted with genuine seed pearls, hand-sewn kundan glass stones, and a gold-plated brass carved wristlet.',
    craftDetails: [
      'Spacious enough for iPhone Pro Max and makeup essentials',
      'Secure drawstring with weighted beaded latkans',
      'Handmade by fourth-generation zardozi masters'
    ],
    careInstructions: 'Store in provided cotton dust bag. Spot clean only.',
    availableSizes: ['One Size (8.5" x 7.5")'],
    inStock: true,
    stockCount: 14,
    isBestSeller: true,
    isNewArrival: false,
    isCustomizable: false,
    rating: 4.9,
    reviewCount: 41,
    reviews: [
      {
        id: 'rev-6',
        author: 'Pooja Hegde',
        location: 'Hyderabad',
        rating: 5,
        date: '18 May 2026',
        comment: 'Stunning craftsmanship! Holds my phone and lipstick easily. The pearl tassels look very regal.',
        verified: true
      }
    ]
  },
  {
    id: 'acc-02',
    sku: 'AL-ACC-302',
    name: 'BhuviSri Signature Hand-Woven Pashmina Stole',
    tagline: '100% Cashmere Pashmina with delicate Kashmiri Sozni needlepoint border',
    category: 'accessories',
    subcategory: 'Stoles & Dupattas',
    price: 13500,
    originalPrice: 15500,
    images: [
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=85'
    ],
    fabric: '100% Pure Changthangi Cashmere',
    color: 'Warm Taupe Beige',
    colorHex: '#D7C7B2',
    occasion: 'Winter Luxury & Evenings',
    description: 'Legendary warmth in a whisper-soft weave. Spun from hand-harvested Himalayan Changthangi goat fiber and finished with delicate hand-stitched sozni flora.',
    craftDetails: [
      'Passes through a ring effortlessly (The Ring Pashmina test)',
      'Certified GI Tag Kashmiri Craftsmanship',
      'Size: 200cm x 70cm'
    ],
    careInstructions: 'Dry clean only. Store with natural cedar balls.',
    availableSizes: ['One Size (200 x 70 cm)'],
    inStock: true,
    stockCount: 7,
    isBestSeller: true,
    isNewArrival: true,
    isCustomizable: false,
    rating: 5.0,
    reviewCount: 24,
    reviews: []
  },
  {
    id: 'acc-03',
    sku: 'AL-ACC-303',
    name: 'Temple Arch 18k Gold-Plated Choker & Earring Set',
    tagline: 'Artisanal brass jewelry featuring un-cut polki crystals and micro baroque pearls',
    category: 'accessories',
    subcategory: 'Jewelry',
    price: 6800,
    originalPrice: 8200,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=1000&q=85'
    ],
    fabric: '18k Micron Gold Plated Brass & Glass Polki',
    color: 'Antique Gold',
    colorHex: '#D4AF37',
    occasion: 'Wedding Soirées & Receptions',
    description: 'Inspired by the ancient stone archways of Hampi. Delicate temple architecture motifs layered with un-cut simulated polki crystals.',
    craftDetails: [
      'Adjustable silk thread dori closure',
      'Hypoallergenic lead and nickel free',
      'Includes matching jhumki earrings'
    ],
    careInstructions: 'Keep away from perfumes and moisture. Store in the velvet box provided.',
    availableSizes: ['Free Size (Adjustable)'],
    inStock: true,
    stockCount: 9,
    isBestSeller: false,
    isNewArrival: true,
    isCustomizable: false,
    rating: 4.8,
    reviewCount: 15,
    reviews: []
  },

  // CUSTOM PRODUCTS / BESPOKE SILHOUETTES
  {
    id: 'custom-01',
    sku: 'AL-BESP-401',
    name: 'The Bespoke Bridal Heirloom Ensemble',
    tagline: 'Fully custom designed saree or lehenga tailored to your exact measurements & motif preferences',
    category: 'custom',
    subcategory: 'Bespoke Atelier',
    price: 45000,
    originalPrice: 52000,
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=85'
    ],
    fabric: 'Choice of Pure Silk, Organza, Velvet or Brocade',
    color: 'Customized to your Wedding Palette',
    colorHex: '#E2D5C3',
    occasion: 'Bespoke Bridal, Sangeet & Reception',
    description: 'Work 1-on-1 with our Master Couturier. We weave and hand-tailor an exclusive heirloom piece tailored to your personal aesthetic, body dimensions, and wedding date.',
    craftDetails: [
      'Includes 2 virtual styling consultations via WhatsApp Video',
      'Fabric swatch box sent to your doorstep prior to weaving',
      'Custom name or wedding date embroidery on waistband/pallu included',
      '3-stage fitting confirmation with test muslin'
    ],
    careInstructions: 'Museum archival care instructions provided upon delivery.',
    availableSizes: ['Custom Made-to-Measure (Full Measurement Protocol)'],
    inStock: true,
    stockCount: 10,
    isBestSeller: true,
    isNewArrival: true,
    isCustomizable: true,
    customizationBasePrice: 0,
    rating: 5.0,
    reviewCount: 31,
    reviews: [
      {
        id: 'rev-7',
        author: 'Dr. Kriti Singhal',
        location: 'London / Mumbai',
        rating: 5,
        date: '20 May 2026',
        comment: 'Designing my bespoke lehenga with BhuviSri Enterprises was the smoothest experience. Their master artisan called me on WhatsApp to finalize the embroidery patterns!',
        verified: true
      }
    ]
  },
  {
    id: 'custom-02',
    sku: 'AL-BESP-402',
    name: 'Custom Blouse & Corset Tailoring Studio',
    tagline: 'Choose neckline, sleeve cut, back style, padding & hand embroidery',
    category: 'custom',
    subcategory: 'Custom Stitching',
    price: 3200,
    originalPrice: 4000,
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=85'
    ],
    fabric: 'Pure Raw Silk / Brocade / Tissue with Cotton Lining',
    color: 'Matched to your saree or chosen from our beige palette',
    colorHex: '#D9CEBE',
    occasion: 'Pairs with all sarees & ethnic skirts',
    description: 'Select your silhouette from Sweetheart, Deep-V, Jewel neck, Backless dori, or Corset-boned bodice. Enter your custom bust, waist, and armhole measurements.',
    craftDetails: [
      'Includes premium foam cups and inner cotton lining',
      'Double margin seams for easy future alteration (+2 inches)',
      'Hand-crafted latkans and antique hooks'
    ],
    careInstructions: 'Dry clean only.',
    availableSizes: ['Custom Made-to-Measure'],
    inStock: true,
    stockCount: 25,
    isBestSeller: true,
    isNewArrival: false,
    isCustomizable: true,
    customizationBasePrice: 0,
    rating: 4.9,
    reviewCount: 54,
    reviews: []
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-8492',
    orderNumber: 'AL-8492',
    date: '2026-08-16',
    customer: {
      name: 'Priya Sharma',
      email: 'priya@example.com',
      phone: '+91 98765 43210',
      address: '402, Magnolia Residency, Indiranagar 100ft Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
      country: 'India'
    },
    items: [
      {
        id: 'ci-1',
        productId: 'saree-01',
        product: INITIAL_PRODUCTS[0],
        selectedSize: 'Free Size (6.3m with blouse)',
        selectedColor: 'Vermillion & Antique Gold',
        quantity: 1,
        isCustomized: true,
        customization: {
          blouseStyle: 'Sweetheart Neck with Elbow Sleeves',
          sleeveLength: '10.5 inches',
          neckline: 'Sweetheart Cut',
          fallAndPico: true,
          petticoatAdded: true,
          monogramText: 'P & S',
          customMeasurements: {
            bust: 36,
            waist: 30,
            hips: 38,
            shoulder: 14.5,
            blouseLength: 14,
            sleeveLength: 10.5,
            unit: 'inches'
          },
          additionalNotes: 'Please add antique gold latkans on the back dori tie.'
        },
        customizationFee: 1500,
        itemTotal: 20000
      }
    ],
    subtotal: 20000,
    discount: 2000,
    couponCode: 'AURA10',
    shippingFee: 0,
    totalAmount: 18000,
    paymentMethod: 'upi',
    paymentStatus: 'Paid',
    orderStatus: 'Crafting & Stitching',
    trackingNumber: 'DTDC-BLR-984210',
    courierPartner: 'BlueDart Air Express',
    estimatedDelivery: '2026-08-22',
    whatsappUpdates: true,
    notes: 'Custom blouse in cutting room with Master tailor Ramesh.',
    timeline: [
      {
        status: 'Order Placed',
        timestamp: '16 Aug 2026, 11:30 AM',
        description: 'Order verified and payment of ₹18,000 confirmed via UPI.',
        completed: true
      },
      {
        status: 'Crafting & Stitching',
        timestamp: '17 Aug 2026, 02:15 PM',
        description: 'Silk saree inspected for quality. Custom blouse fabric cut according to provided measurements (Bust 36", Waist 30").',
        completed: true
      },
      {
        status: 'Quality Inspection',
        timestamp: 'Estimated 20 Aug 2026',
        description: 'Final measurement check, fall & pico stitching, and steam finish.',
        completed: false
      },
      {
        status: 'Dispatched',
        timestamp: 'Estimated 21 Aug 2026',
        description: 'Handed over to BlueDart Air Express with tracking #DTDC-BLR-984210.',
        completed: false
      },
      {
        status: 'Delivered',
        timestamp: 'Estimated 22 Aug 2026',
        description: 'Safely delivered to customer in signature beige gift box.',
        completed: false
      }
    ]
  },
  {
    id: 'ord-8491',
    orderNumber: 'AL-8491',
    date: '2026-08-14',
    customer: {
      name: 'Aditi Rao',
      email: 'aditi.rao@gmail.com',
      phone: '+91 91234 56789',
      address: 'Penthouse 12, Skyward Towers, Worli Sea Face',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400018',
      country: 'India'
    },
    items: [
      {
        id: 'ci-2',
        productId: 'west-01',
        product: INITIAL_PRODUCTS[3],
        selectedSize: 'M',
        selectedColor: 'Warm Oatmeal',
        quantity: 1,
        isCustomized: false,
        customizationFee: 0,
        itemTotal: 8400
      },
      {
        id: 'ci-3',
        productId: 'acc-01',
        product: INITIAL_PRODUCTS[6],
        selectedSize: 'One Size',
        selectedColor: 'Antique Gold',
        quantity: 1,
        isCustomized: false,
        customizationFee: 0,
        itemTotal: 4600
      }
    ],
    subtotal: 13000,
    discount: 0,
    shippingFee: 0,
    totalAmount: 13000,
    paymentMethod: 'card',
    paymentStatus: 'Paid',
    orderStatus: 'Dispatched',
    trackingNumber: 'BLUEDART-BOM-77312',
    courierPartner: 'BlueDart Express',
    estimatedDelivery: '2026-08-19',
    whatsappUpdates: true,
    notes: 'Out for transit from Surat hub to Mumbai.',
    timeline: [
      {
        status: 'Order Placed',
        timestamp: '14 Aug 2026, 04:45 PM',
        description: 'Order confirmed with Visa Card ending in 4242.',
        completed: true
      },
      {
        status: 'Quality Inspection',
        timestamp: '15 Aug 2026, 10:00 AM',
        description: 'Garments steamed, inspected and packed in luxury dust bags.',
        completed: true
      },
      {
        status: 'Dispatched',
        timestamp: '16 Aug 2026, 06:20 PM',
        description: 'Shipped via BlueDart (AWB: BLUEDART-BOM-77312).',
        completed: true
      },
      {
        status: 'Delivered',
        timestamp: 'Expected 19 Aug 2026',
        description: 'Delivery agent assigned for doorstep delivery.',
        completed: false
      }
    ]
  }
];

export const INITIAL_BESPOKE_REQUESTS: BespokeRequest[] = [
  {
    id: 'besp-101',
    requestNumber: 'REQ-2026-091',
    customerName: 'Meenakshi Sundaram',
    email: 'meenakshi.s@outlook.com',
    phone: '+91 97112 34567',
    category: 'Bridal Kanjeevaram Saree & Custom Blouse',
    fabricPreference: 'Pure Kanchipuram Korvai Silk in Ivory & Rose Gold',
    budgetRange: '₹40,000 - ₹60,000',
    targetDate: '2026-11-15',
    description: 'Looking for a temple border traditional Kanjeevaram with custom embroidered lord ganesha and peacock motifs on the blouse back. Need bridal styling consultation via WhatsApp.',
    referenceImages: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
    ],
    measurements: {
      bust: '38 in',
      waist: '32 in',
      shoulder: '15 in',
      blouseLength: '14.5 in'
    },
    status: 'Consultation Scheduled',
    createdAt: '2026-08-15',
    notes: 'Virtual WhatsApp consultation booked for Saturday 3:00 PM with master designer.'
  },
  {
    id: 'besp-102',
    requestNumber: 'REQ-2026-092',
    customerName: 'Natasha Verma',
    email: 'natasha.verma@fashionlaw.com',
    phone: '+91 98990 12345',
    category: 'Indo-Western Silk Blazer Gown',
    fabricPreference: 'Sand Washed Raw Silk in Latte Beige',
    budgetRange: '₹25,000 - ₹35,000',
    targetDate: '2026-09-28',
    description: 'Need a structured floor-length blazer gown for an international design awards ceremony in Dubai.',
    referenceImages: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'New Request',
    createdAt: '2026-08-17',
    notes: 'Pending swatch confirmation.'
  }
];
