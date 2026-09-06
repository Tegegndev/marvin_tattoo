import { ServiceItem, PortfolioPiece, ArtistProfile, Testimonial, ProductItem } from '../types';

export const HERO_IMAGE = "https://lh3.googleusercontent.com/aida/AEtjO1WxJneVTTiW5FtUrPA-UR2MCffuWJAbObh5_9W0vlQKxC_piV154sBLGppN0_wQIIb2QAx1s4TtQItttuHFTtoKW_9vpl7OcIRzDT0xXw5czitVp0NkmhS7cZ-MzVz0skE9_yEGcoDFgvZQdsHHM1rv32xYstg6XDqLe5pD0LijkVhE9CY4QoesFaarKdffwvL8_6aJVdyy4-7wR0JXMwckNFfjtX61dr9yRUqlYQSOHZ-DHbaO_bE-a2E";

export const LOGO_URL = "/logo.svg";

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'realism-portraits',
    disciplineNumber: '01',
    title: 'Realism & Portraits',
    subtitle: 'Photo-Realistic Artistry',
    description: 'High-detail black-and-grey and photo-realistic face, memorial, animal, or object pieces executed with smooth tonal transitions and deep contrast.',
    image: '/images/portfolio/portrait-elder-woman.png',
    iconName: 'skull',
    accentColor: 'primary',
    specs: [
      { label: 'Technique', value: 'High-Detail Black & Grey' },
      { label: 'Subject', value: 'Portraits, Wildlife & Objects' },
      { label: 'Session Type', value: 'Half & Full Day Sessions' },
    ]
  },
  {
    id: 'minimalist-fineline',
    disciplineNumber: '02',
    title: 'Minimalist & Fine-Line',
    subtitle: 'Delicate Precision Marking',
    description: 'Delicate geometric shapes, continuous line art, micro-tattoos, and clean subtle markings tailored to anatomical curves.',
    image: '/images/portfolio/script-abdul-collarbone.png',
    iconName: 'edit_note',
    accentColor: 'primary',
    specs: [
      { label: 'Technique', value: 'Single Needle & Micro-Line' },
      { label: 'Style', value: 'Geometric & Continuous Line' },
      { label: 'Healing', value: 'Fast & Clean' },
    ]
  },
  {
    id: 'lettering-script',
    disciplineNumber: '03',
    title: 'Lettering & Script',
    subtitle: 'Custom Typography & Calligraphy',
    description: 'Custom typography, freehand calligraphy, names, meaningful quotes, and dates drawn to flow naturally across the skin.',
    image: '/images/portfolio/script-abdul-collarbone.png',
    iconName: 'edit_note',
    accentColor: 'primary',
    specs: [
      { label: 'Style', value: 'Chicano, Gothic & Calligraphy' },
      { label: 'Design', value: '100% Custom Lettering' },
      { label: 'Longevity', value: 'Spaced for Sharp Aging' },
    ]
  },
  {
    id: 'traditional-tribal',
    disciplineNumber: '04',
    title: 'Traditional & Tribal',
    subtitle: 'Bold Blackwork & Flash',
    description: 'Bold blackwork, Polynesian and African tribal patterns, bold geometric armor, and classic timeless flash art.',
    image: '/images/portfolio/back-portrait-man.png',
    iconName: 'layers',
    accentColor: 'primary',
    specs: [
      { label: 'Style', value: 'Polynesian, Tribal & Flash' },
      { label: 'Pigment', value: 'Opaque Triple Black' },
      { label: 'Impact', value: 'High Contrast & Heavy Lines' },
    ]
  },
  {
    id: 'coverups-restorations',
    disciplineNumber: '05',
    title: 'Cover-Ups & Restorations',
    subtitle: 'Reworking & Concealing Old Ink',
    description: 'Reworking, blending, or fully concealing faded, poorly done, or unwanted old tattoos with strategic custom cover designs.',
    image: '/images/portfolio/portrait-elder-woman.png',
    iconName: 'layers',
    accentColor: 'primary',
    specs: [
      { label: 'Consult', value: 'In-Person Evaluation' },
      { label: 'Technique', value: 'Strategic Contrast & Blending' },
      { label: 'Outcome', value: 'Complete Fresh Tattoo' },
    ]
  },
  {
    id: 'laser-removal-piercing',
    disciplineNumber: '06',
    title: 'Laser Removal & Piercings',
    subtitle: 'Safe Fading & Titanium Piercing',
    description: 'Advanced laser tattoo removal to lighten ink for cover-ups or complete clearance, plus sterile body piercings in implant-grade titanium.',
    image: '/images/portfolio/spider-navel-piercing.png',
    iconName: 'colorize',
    accentColor: 'primary',
    specs: [
      { label: 'Laser Tech', value: 'Safe Pigment Lightening' },
      { label: 'Piercing', value: 'ASTM-F136 Titanium Suite' },
      { label: 'Hygiene', value: 'Hospital-Grade Sterile Protocol' },
    ]
  }
];

export const PORTFOLIO_DATA: PortfolioPiece[] = [
  {
    id: 'piece-01',
    title: 'Honor To Mothers: Matriarch Portrait',
    category: 'dark-realism',
    categoryLabel: 'Memorial Realism & Mother Tribute',
    artist: 'Marvin',
    healingState: 'Healed & Fresh Tribute',
    cycle: 'healed',
    zone: 'Forearm',
    flashId: 'MOM-701',
    image: '/images/portfolio/portrait-elder-woman.png',
    description: 'A heartfelt tribute to motherhood — high-detail black-and-grey photo-realism with soft skin transitions, expressive warmth, and intricate patterned headwrap texturing crafted to hold its clarity and sentiment over a lifetime.',
    duration: '6 Hours Single Session',
    pigment: 'Dynamic Carbon Deep & Greywash',
    morphology: 'Inner Forearm',
    featured: true
  },
  {
    id: 'piece-02',
    title: 'Custom Script "Abdul S"',
    category: 'neo-traditional',
    categoryLabel: 'Lettering & Fine-Line Script',
    artist: 'Marvin',
    healingState: 'Fresh Ink',
    cycle: 'fresh',
    zone: 'Collarbone',
    flashId: '#420-AS',
    image: '/images/portfolio/script-abdul-collarbone.png',
    description: 'Clean single-needle cursive calligraphy script tattooed precisely along the collarbone contour.',
    duration: '1.5 Hours Single Needle',
    pigment: 'Opaque Triple Black',
    morphology: 'Clavicle & Upper Chest'
  },
  {
    id: 'piece-03',
    title: 'Spider Blackwork & Navel Piercing',
    category: 'piercing',
    categoryLabel: 'Piercing & Blackwork',
    artist: 'Marvin',
    healingState: 'Healed Curation',
    cycle: 'healed',
    zone: 'Abdomen / Navel',
    flashId: '#515-SP',
    image: '/images/portfolio/spider-navel-piercing.png',
    description: 'Solid black widow silhouette tattoo on lower hip paired with an implant-grade titanium crystal navel barbell.',
    duration: '2 Hours Session',
    pigment: 'Carbon Black & F-136 Titanium',
    morphology: 'Lower Abdomen & Navel'
  },
  {
    id: 'piece-04',
    title: 'Memorial Portrait Backpiece',
    category: 'dark-realism',
    categoryLabel: 'Dark Realism & Portraits',
    artist: 'Marvin',
    healingState: 'Fresh Ink',
    cycle: 'fresh',
    zone: 'Backpiece',
    flashId: '#830-BP',
    image: '/images/portfolio/back-portrait-man.png',
    description: 'Detailed black-and-grey memorial portrait positioned centered on the upper back between the scapulae.',
    duration: '7 Hours Session',
    pigment: 'Silverback Greywash & Black',
    morphology: 'Upper Spine & Scapulae'
  },
  {
    id: 'piece-05',
    title: 'Ombré Powder Brows & PMU',
    category: 'micro-detail',
    categoryLabel: 'Cosmetic Eyebrow PMU',
    artist: 'Marvin',
    healingState: 'Fresh Treatment',
    cycle: 'fresh',
    zone: 'Face & Brow',
    flashId: '#202-PMU',
    image: '/images/portfolio/cosmetic-eyebrow-pmu.png',
    description: 'Semi-permanent cosmetic brow shading and ombré contouring done with sterile micro-pigment technique.',
    duration: '2 Hours PMU',
    pigment: 'Medical-Grade Brow Pigment',
    morphology: 'Supraorbital Brow Ridge'
  },
  {
    id: 'piece-06',
    title: 'Corvus Nocturne Chest Piece',
    category: 'dark-realism',
    categoryLabel: 'Dark Realism & Heavy Shading',
    artist: 'Marvin',
    healingState: 'Healed 8 Months',
    cycle: 'healed',
    zone: 'Chest',
    flashId: '#882-CR',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDw-LC5T3Qbuh7cVBwh64V7VAoe8Ji5bovK8uNUZ4_v3NsbJb85T29qes9hXL9_P8_1PBf4wfVbpQ_jhbL7XRLNg8w6HEDLrcJAX0s-fEqouRmmSgnmSX4qP-JFofp3EYwIAzGx2qwAD2dLADwjsqU0HiGAmtiB23NnoxvWdaDOCmJsCexXeKQls6PGxa9d3IKZH2vpMnHSv2iHvMuWAVnCpD0quFwqf3o3NX5hf9o8wD-qFGjCUh9oDQ',
    description: 'Full sternum piece in deep black, worked over two sessions with shading that follows the chest line.',
    duration: '14 Hours (2 Sessions)',
    pigment: 'Panthera Black Ink',
    morphology: 'Sternum to Ribcage'
  }
];

export const ARTISTS_DATA: ArtistProfile[] = [
  {
    id: 'marvin',
    name: 'Marvin',
    title: 'Founder & Master Tattoo Artist',
    role: 'Master Tattoo Artist & Piercing Specialist since 2014',
    avatar: '/images/marvin-founder.png',
    experience: '14+ Years',
    specialty: 'Dark Realism, Memorial Portraits & Heavy Script',
    slotsRemaining: 4,
    bio: 'With over 14 years of professional tattooing and piercing mastery, Marvin founded the studio in 2014 with an unwavering standard of hospital-grade sterilization, clean single-needle execution, and bespoke custom artwork.',
    badges: ['FOUNDER', 'MASTER TATTOO ARTIST', 'STERILE PROTOCOL CERTIFIED']
  },
  {
    id: 'elena-kostas',
    name: 'Elena Kostas',
    title: 'Senior Tattoo Artist',
    role: 'Fine-line & portrait specialist',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnsDTCyCEfBelqzhnX6D13KQhOf5w6asxSYxPrjQ0C5LJfgIPMKgiyjyGQVPhF_q7oi1kOwbYmdvEZhAIm5Q1KgYu_iOvQ-zJm9UR25foludLRa5WMbKGbvjmQy47Lhaq4TTthAOAfTli61j3cQS3JXZdkyQgA9dSR_IXVeZjNQG2qitlKsMaAZBlBoeFXTdnFpUll0jQNTqrviGloEJXCMKHMMPFfDnDQP97d2M29XqVAan2TTOHlXg',
    experience: '9 Years',
    specialty: 'Grey-wash Portraits & Fine Detailing',
    slotsRemaining: 6,
    bio: 'Elena studied illustration before specializing in smooth grey-wash shading. Her portraits read like marble — soft transitions and clean, even value.',
    badges: ['SENIOR ARTIST']
  },
  {
    id: 's-choi',
    name: 'S. Choi',
    title: 'Piercing Specialist',
    role: 'Body piercing & jewelry curation',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlDpgCaHYdBQq2knmrwuSZ-c9MSq_YGXWya8wlDLaRjzmb7TBbGZ_d-VRf3KoXU9gMFkUXSn8Bs8YhVJCx4SNE4EspzFs_nbvHFAMb6OEmWGptM3cr4T5NNKW_dNtioaT8F8T3LNX0FoFhE3XZRTRoWDpvJAXHCmwIRTer5niJQ1sBf4ejaEIl_RXZ1qXZck-Bao0djb4vfXahL6uhxic5vVPZyQ6BzGH7ap98UovGgNk9ubF5u58Hog',
    experience: '8 Years',
    specialty: 'Titanium & Gold, Curated Ear Projects',
    slotsRemaining: 8,
    bio: 'APP-certified piercer. Placements are measured to your actual anatomy and sized in titanium or solid gold so they sit right and heal well.',
    badges: ['APP CERTIFIED']
  }
];

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: 't-1',
    name: 'Brian K.',
    role: 'Dark Realism & Sleeve',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    stars: 5,
    quote: 'Marvin is hands down the best tattoo artist in Kampala. His attention to detail on my portrait sleeve was unmatched. The hygiene standard at New Pioneer Mall is top tier!'
  },
  {
    id: 't-2',
    name: 'Patricia N.',
    role: 'Fine-Line & Script',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    stars: 5,
    quote: 'Got a delicate fine-line floral piece on my collarbone. The lines are super crisp and sharp, healed completely flat with zero blowouts. Highly recommend Marvin Tattoos!'
  },
  {
    id: 't-3',
    name: 'Denis M.',
    role: 'Tattoo Cover-Up',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    stars: 5,
    quote: 'I had an old faded tattoo that two other places said was impossible to fix. Marvin redesigned it into an incredible blackwork piece. You can not even see the old ink underneath.'
  },
  {
    id: 't-4',
    name: 'Sandra A.',
    role: 'Titanium Ear Piercing',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    stars: 5,
    quote: 'Super sterile setup with single-use needles and high-grade titanium jewelry. No pain, quick healing, and the team explained the aftercare thoroughly.'
  },
  {
    id: 't-5',
    name: 'Joshua T.',
    role: 'Custom Script & Lettering',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    stars: 5,
    quote: 'Marvin drew the lettering freehand on my forearm first to make sure it aligned with my wrist bone. 100% custom craft and great hospitality at the studio.'
  },
  {
    id: 't-6',
    name: 'Ritah K.',
    role: 'Minimalist Micro-Tattoo',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    stars: 5,
    quote: 'Friendly vibes, clean equipment, and very professional. The studio on Level 5 of Pioneer Mall is welcoming and relaxed. 5 stars all the way!'
  }
];

export const PRODUCTS_DATA: ProductItem[] = [
  {
    id: 'prod-01',
    name: 'Rotary Pen Machine',
    category: 'Hard Goods',
    price: 740.00,
    description: 'Wireless, cordless rotary pen with a 4.0mm stroke — reliable for dense blackwork and clean lining.',
    image: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=600&q=80',
    accentColor: 'primary',
    inStock: true,
    specs: ['Aircraft Aluminum', '4.0mm Stroke', '10hr Battery', 'RCA Adapter Included']
  },
  {
    id: 'prod-02',
    name: 'Aftercare Balm',
    category: 'Aftercare',
    price: 28.00,
    description: 'Cold-pressed calendula and shea butter. No petroleum — a simple barrier that keeps new ink protected.',
    image: 'https://images.unsplash.com/photo-1608248597359-24757c917fb2?auto=format&fit=crop&w=600&q=80',
    accentColor: 'primary',
    inStock: true,
    specs: ['100ml Glass Bottle', 'Organic Calendula', 'No Mineral Oils', 'Use From Day 1']
  },
  {
    id: 'prod-03',
    name: 'Cartridge Needles (Box of 20)',
    category: 'Needles',
    price: 46.00,
    description: '316L stainless steel, pre-sterilized with a safety membrane to prevent ink backflow.',
    image: 'https://images.unsplash.com/photo-1562962230-16e4623d36e6?auto=format&fit=crop&w=600&q=80',
    accentColor: 'primary',
    inStock: true,
    specs: ['EO Gas Sterilized', '0.30mm Bugpin', 'Safety Membrane', 'Clear Tip']
  },
  {
    id: 'prod-04',
    name: 'Titanium Daith Clicker',
    category: 'Titanium Jewelry',
    price: 85.00,
    description: 'Mirror-polished implant-grade titanium with black onyx accents and a secure hinge closure.',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
    accentColor: 'primary',
    inStock: true,
    specs: ['16G (1.2mm) x 8mm', 'ASTM F-136 Titanium', 'Black Onyx', 'Autoclave Safe']
  }
];
