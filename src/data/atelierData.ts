import { ServiceItem, PortfolioPiece, ArtistProfile, Testimonial, ProductItem } from '../types';

export const HERO_IMAGE = "/images/hero-banner.png";

export const LOGO_URL = "/logo.svg";

export const MARVIN_DIRECT_PHONE = "+256705748774";
export const WHATSAPP_NUMBER = "256705748774";

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'realism-portraits',
    disciplineNumber: '01',
    title: 'Realism & Portraits',
    subtitle: 'Photo-Realistic Artistry',
    description: 'High-detail black-and-grey and photo-realistic memorial, face, wildlife, and classical sculpture pieces rendered with deep contrast and smooth tonal gradients.',
    longDescription: 'Photo-realism is our cornerstone discipline. We translate high-resolution photographs, classical statues, and lifelike portraits into lasting skin art. Utilizing microscopic needle grouping, multi-pass greywash shading, and anatomically conscious composition, every piece is calibrated to age with rich contrast and exceptional clarity.',
    category: 'TATTOO',
    image: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=1000&q=80',
    iconName: 'skull',
    accentColor: 'primary',
    specs: [
      { label: 'Technique', value: 'High-Detail Black & Grey' },
      { label: 'Subject', value: 'Portraits, Statues & Wildlife' },
      { label: 'Session Type', value: 'Half & Full Day Sessions' },
      { label: 'Pigment', value: 'Dynamic & Silverback Greywash' },
    ],
    processSteps: [
      { step: '01', title: 'Consultation & High-Res Curation', description: 'We evaluate reference photos for lighting contrast, skin tone compatibility, and anatomical placement.' },
      { step: '02', title: 'Digital Rendering & Stencil Mapping', description: 'Custom digital rendering and precision thermal stencil application to ensure distortion-free proportions.' },
      { step: '03', title: 'Needle Pass & Gradient Inking', description: 'Low-impact rotary inking with micro-bugpin needles to build smooth gradients without skin trauma.' },
      { step: '04', title: 'Medical Seal & Healed Checkup', description: 'Application of hypoallergenic polyurethane dermal film for optimal 7-day sterile healing.' },
    ],
    pricingTiers: [
      { tier: 'Single Subject / Small', price: 'UGX 250,000 - 450,000', description: 'Compact portrait or high-detail animal subject (3-4 hours).' },
      { tier: 'Half-Day Session', price: 'UGX 600,000 - 900,000', description: 'Forearm or calf portrait with soft background blending (5-6 hours).' },
      { tier: 'Full-Day Large Piece', price: 'UGX 1,200,000+', description: 'Full sleeve panel, chest, or backpiece composition (8+ hours).' },
    ],
    faqs: [
      { question: 'What photo references work best for realism portraits?', answer: 'High-resolution, well-lit photos with clear shadows and sharp facial features yield the highest quality tattoo results.' },
      { question: 'How many sessions does a realism portrait take?', answer: 'Most single portraits are completed in one 5 to 7 hour session. Multi-figure compositions or full sleeves are broken into multiple layered sessions.' },
      { question: 'Does black and grey realism fade easily?', answer: 'We saturate deep carbon blacks as structural anchors, preventing the piece from lightening or losing contrast over the years.' },
    ],
    prepGuidelines: [
      'Moisturize the target area twice daily for 5 days prior to your session.',
      'Get a full 8 hours of sleep and eat a high-protein meal 2 hours before arriving.',
      'Avoid alcohol, aspirin, and blood thinners 24 hours prior to appointment.',
    ],
    aftercareGuidelines: [
      'Keep the protective dermal film on for 3 to 5 days unless leaking occurs.',
      'Wash gently with warm water and fragrance-free antibacterial cleanser.',
      'Apply a thin layer of specialized tattoo balm 2-3 times daily for 3 weeks.',
      'Avoid swimming pools, saunas, and direct sunlight for at least 4 weeks.',
    ],
    galleryImages: [
      '/images/portfolio/portrait-elder-woman.png',
      '/images/portfolio/back-portrait-man.png',
      'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=800&q=80',
    ]
  },
  {
    id: 'minimalist-fineline',
    disciplineNumber: '02',
    title: 'Minimalist & Fine-Line',
    subtitle: 'Delicate Precision Marking',
    description: 'Delicate geometric shapes, botanical florals, micro-tattoos, continuous line art, and clean subtle markings tailored to anatomical curves.',
    longDescription: 'Fine-line tattooing requires surgical steady hand control and micro-needle physics. We specialize in 0.25mm single-needle botanical florals, sacred geometry, constellation maps, and micro-illustrations. Every stroke is deposited at precise epidermal depth to prevent blowout and preserve razor sharpness forever.',
    category: 'TATTOO',
    image: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=1000&q=80',
    iconName: 'edit_note',
    accentColor: 'primary',
    specs: [
      { label: 'Technique', value: 'Single Needle 0.25mm Bugpin' },
      { label: 'Style', value: 'Botanical & Continuous Line' },
      { label: 'Healing', value: 'Fast & Clean Zero Blowout' },
      { label: 'Longevity', value: 'Spaced for Sharp Aging' },
    ],
    processSteps: [
      { step: '01', title: 'Micro-Design & Curve Fitting', description: 'Drafting thin vector linework matched to the natural flex lines of wrists, ribs, or collarbones.' },
      { step: '02', title: 'Precision Needle Calibration', description: 'Using 01RL to 03RL bugpin cartridges on ultra-low voltage for effortless ink flow.' },
      { step: '03', title: 'Single-Pass Execution', description: 'Continuous single-pass line control with zero needle drag or subcutaneous blowout.' },
      { step: '04', title: 'Clean Shield Protection', description: 'Medical second-skin wrap to seal delicate lines from friction and environmental debris.' },
    ],
    pricingTiers: [
      { tier: 'Micro / Minimalist', price: 'UGX 150,000 - 250,000', description: 'Single symbol, micro floral, or 1-2 inch fine-line motif.' },
      { tier: 'Medium Fine-Line Floral', price: 'UGX 300,000 - 500,000', description: 'Detailed botanical branch, geometric mandala, or forearm wrap.' },
      { tier: 'Large Fine-Line Composition', price: 'UGX 600,000+', description: 'Multi-branch spine piece, ribcage botanical, or delicate sleeve.' },
    ],
    faqs: [
      { question: 'Do fine line tattoos blur over time?', answer: 'We account for natural skin expansion by spacing delicate lines properly and inking at the optimal dermal depth, preventing ink spread.' },
      { question: 'How long does a fine line tattoo take to heal?', answer: 'Because trauma to the skin is minimal, fine-line tattoos typically heal completely within 10 to 14 days.' },
    ],
    prepGuidelines: [
      'Keep the skin well moisturized and exfoliated.',
      'Wear loose-fitting clothing that allows easy access to the tattoo site.',
    ],
    aftercareGuidelines: [
      'Moisturize lightly with unscented aftercare lotion.',
      'Never scratch or pick at microscopic peeling flakes.',
    ],
    galleryImages: [
      'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=800&q=80',
      '/images/portfolio/script-abdul-collarbone.png',
      '/images/portfolio/spider-navel-piercing.png',
    ]
  },
  {
    id: 'lettering-script',
    disciplineNumber: '03',
    title: 'Lettering & Script',
    subtitle: 'Custom Typography & Calligraphy',
    description: 'Freehand custom typography, Chicano cursive, Gothic blackletter, names, and meaningful quotes drawn to flow naturally across the skin.',
    longDescription: 'Lettering is more than words — it is dynamic body calligraphy. Marvin crafts freehand Chicano cursive, sharp Gothic Old English, delicate serif scripts, and custom lettering directly mapped to the curves of the body. Every flourish is balanced for timeless legibility and rhythm.',
    category: 'TATTOO',
    image: 'https://images.unsplash.com/photo-1562962230-16e4623d36e6?auto=format&fit=crop&w=1000&q=80',
    iconName: 'edit_note',
    accentColor: 'primary',
    specs: [
      { label: 'Design', value: '100% Freehand & Custom Draft' },
      { label: 'Style', value: 'Chicano, Gothic & Calligraphy' },
      { label: 'Placement', value: 'Collarbone, Forearm & Ribs' },
      { label: 'Longevity', value: 'Spaced for Sharp Aging' },
    ],
    processSteps: [
      { step: '01', title: 'Typographic Consultation', description: 'Selecting font aesthetics, phrasing, letter kerning, and skin placement.' },
      { step: '02', title: 'Freehand Marker Mapping', description: 'Marvin hand-draws custom script directly on the skin with surgical skin markers.' },
      { step: '03', title: 'Solid Line & Whip Shading', description: 'Inking crisp contours and smooth gradient fills inside blackletter flourishes.' },
      { step: '04', title: 'Sanitary Wrap & Verification', description: 'Sterile seal and aftercare guidance for crisp letter retention.' },
    ],
    pricingTiers: [
      { tier: 'Short Phrase / Name', price: 'UGX 180,000 - 300,000', description: 'Single word, name, or short wrist / collarbone quote.' },
      { tier: 'Chicano / Gothic Chest or Forearm', price: 'UGX 350,000 - 600,000', description: 'Bold custom blackletter or cursive typography.' },
      { tier: 'Full Back / Torso Typography', price: 'UGX 750,000+', description: 'Large arched backpiece or stomach gothic script.' },
    ],
    faqs: [
      { question: 'Can Marvin write my script freehand on my skin?', answer: 'Yes! Marvin is renowned for freehand lettering, custom drafting letters to perfectly match your body muscle contours.' },
      { question: 'How do you keep small letters legible as they age?', answer: 'We maintain proper line spacing and open loops so letters remain clear and readable for decades.' },
    ],
    prepGuidelines: [
      'Double-check spelling, punctuation, and wording prior to session.',
      'Arrive well-rested and hydrated.',
    ],
    aftercareGuidelines: [
      'Gently wash with unscented soap twice daily.',
      'Apply thin coat of healing ointment for the first 2 weeks.',
    ],
    galleryImages: [
      '/images/portfolio/script-abdul-collarbone.png',
      'https://images.unsplash.com/photo-1562962230-16e4623d36e6?auto=format&fit=crop&w=800&q=80',
    ]
  },
  {
    id: 'traditional-tribal',
    disciplineNumber: '04',
    title: 'Traditional & Tribal',
    subtitle: 'Bold Blackwork & Flash',
    description: 'Deep saturated solid blackwork, Polynesian and African tribal patterns, bold geometric armor, and classic timeless flash art.',
    longDescription: 'Rooted in heritage and timeless bold impact. Our Traditional & Tribal craft covers authentic Polynesian motifs, Ugandan & African heritage patterns, heavy solid blackwork armor, and neo-traditional flash. Saturated with opaque triple-black ink for maximum permanence.',
    category: 'TATTOO',
    image: 'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?auto=format&fit=crop&w=1000&q=80',
    iconName: 'layers',
    accentColor: 'primary',
    specs: [
      { label: 'Style', value: 'Polynesian, Tribal & Flash' },
      { label: 'Pigment', value: 'Opaque Triple Black' },
      { label: 'Impact', value: 'High Contrast & Heavy Lines' },
      { label: 'Coverage', value: 'Full Sleeves, Armor & Backpieces' },
    ],
    processSteps: [
      { step: '01', title: 'Pattern & Symmetry Layout', description: 'Aligning traditional geometric patterns to flow naturally with muscular anatomy.' },
      { step: '02', title: 'Heavy Outline Pass', description: 'Pulling thick, solid, punchy outlines using heavy round shaders.' },
      { step: '03', title: 'Solid Jet-Black Packing', description: 'Even, saturation-packed black fills without skin chew or patchy spots.' },
      { step: '04', title: 'Sterile Shield Wrap', description: 'Protective dressing for heavy ink saturation recovery.' },
    ],
    pricingTiers: [
      { tier: 'Flash / Small Pattern', price: 'UGX 200,000 - 350,000', description: 'Traditional motif or 3-4 inch tribal symbol.' },
      { tier: 'Armband / Half-Sleeve Pattern', price: 'UGX 500,000 - 850,000', description: 'Geometric band or solid shoulder cap.' },
      { tier: 'Full Sleeve / Back Armor', price: 'UGX 1,200,000+', description: 'Full Polynesian, African, or heavy blackwork sleeve.' },
    ],
    faqs: [
      { question: 'Will solid black tribal tattoos stay dark black?', answer: 'Yes! We use premium Dynamic and Kuro Sumi Triple Black pigments known worldwide for staying rich jet black without turning blue or green.' },
    ],
    prepGuidelines: [
      'Eat well before the appointment; solid blackwork requires high energy.',
    ],
    aftercareGuidelines: [
      'Ensure the tattoo is kept clean and dry.',
      'Moisturize with quality tattoo butter 3 times a day once peeling starts.',
    ],
    galleryImages: [
      'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?auto=format&fit=crop&w=800&q=80',
      '/images/portfolio/spider-navel-piercing.png',
    ]
  },
  {
    id: 'coverups-restorations',
    disciplineNumber: '05',
    title: 'Cover-Ups & Restorations',
    subtitle: 'Reworking & Concealing Old Ink',
    description: 'Masterfully reworking, blending, or fully concealing faded, poorly done, or unwanted old tattoos with strategic custom cover designs.',
    longDescription: 'Turn regret into masterpiece. We specialize in complex tattoo cover-ups, faded ink restorations, and scar camouflage. Using advanced color theory, contrast redirection, and organic textures, we conceal unwanted tattoos without leaving dark muddy patches.',
    category: 'TATTOO',
    image: 'https://images.unsplash.com/photo-1590246814883-57833748b615?auto=format&fit=crop&w=1000&q=80',
    iconName: 'layers',
    accentColor: 'primary',
    specs: [
      { label: 'Consult', value: 'In-Person Skin Evaluation' },
      { label: 'Technique', value: 'Strategic Contrast & Blending' },
      { label: 'Outcome', value: 'Complete Fresh Tattoo' },
      { label: 'Sessions', value: 'Layered Multi-Pass Coverage' },
    ],
    processSteps: [
      { step: '01', title: 'Ink & Scar Evaluation', description: 'In-person inspection of pigment density, scar tissue, and surrounding skin tone.' },
      { step: '02', title: 'Custom Concealment Design', description: 'Drafting dark focal points directly over old lines with dynamic open flow.' },
      { step: '03', title: 'Layered Base Inking', description: 'First pass neutralization and structural shading over old ink.' },
      { step: '04', title: 'Detailing & Polish Pass', description: 'Refining highlights and textures after full healing for 100% concealment.' },
    ],
    pricingTiers: [
      { tier: 'Small Cover-Up / Touch-up', price: 'UGX 250,000 - 450,000', description: 'Covering small names, symbols, or faded linework.' },
      { tier: 'Medium Restoration', price: 'UGX 550,000 - 900,000', description: 'Concealing forearm or shoulder pieces with fresh art.' },
      { tier: 'Complex Large Cover', price: 'UGX 1,100,000+', description: 'Multi-session full coverage piece.' },
    ],
    faqs: [
      { question: 'Do I need laser removal before getting a cover-up?', answer: 'In 85% of cases, no. Marvin can design custom artwork that directly conceals old ink. For extremely dark solid black tattoos, 1-2 laser lightening passes may be advised.' },
      { question: 'Will the old tattoo show through after healing?', answer: 'No. Our layered contrast technique ensures the old ink is permanently disguised into the new composition.' },
    ],
    prepGuidelines: [
      'Take clear well-lit photos of the existing tattoo to send before consultation.',
    ],
    aftercareGuidelines: [
      'Follow standard aftercare strictly to allow proper ink layering.',
    ],
    galleryImages: [
      'https://images.unsplash.com/photo-1590246814883-57833748b615?auto=format&fit=crop&w=800&q=80',
      '/images/portfolio/portrait-elder-woman.png',
    ]
  },
  {
    id: 'semi-permanent-makeup',
    disciplineNumber: '06',
    title: 'Semi-Permanent Makeup',
    subtitle: 'Microblading, Lips & Camouflage',
    description: 'Microblading & ombré powder brows, pink lip blush / neutralization, stretch marks camouflage, and aesthetic permanent makeup.',
    longDescription: 'Enhance your natural beauty with bespoke aesthetic PMU. We offer hyper-realistic microblading, soft ombré powder shading, lip blush neutralization for dark lips, and specialized stretch mark & scar camouflage with skin-tone matching pigments.',
    category: 'PMU',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80',
    iconName: 'edit_note',
    accentColor: 'primary',
    specs: [
      { label: 'Brows', value: 'Microblading & Ombré Powder' },
      { label: 'Lips', value: 'Pink Lips Blush & Neutralize' },
      { label: 'Skin', value: 'Stretch Marks & Scar Camouflage' },
      { label: 'Longevity', value: '18 to 36 Months Retention' },
    ],
    processSteps: [
      { step: '01', title: 'Facial Symmetry & Color Mapping', description: 'Mapping brow/lip proportions with golden ratio calipers and skin tone pigment selection.' },
      { step: '02', title: 'Topical Numbing Comfort', description: 'Application of medical-grade topical lidocaine for a pain-free, relaxed experience.' },
      { step: '03', title: 'Micro-Pigment Implantation', description: 'Delicate hair-stroke or velvet powder mist implantation into the upper dermis.' },
      { step: '04', title: '6-Week Perfection Touch-Up', description: 'Complimentary follow-up session to ensure vibrant retention and flawless finish.' },
    ],
    pricingTiers: [
      { tier: 'Microblading / Ombré Brows', price: 'UGX 350,000 - 550,000', description: 'Complete brow shaping, initial session + aftercare pack.' },
      { tier: 'Lip Blush / Neutralization', price: 'UGX 400,000 - 650,000', description: 'Full pink lip tinting or dark lip neutralization.' },
      { tier: 'Stretch Mark Camouflage', price: 'UGX 500,000+', description: 'Skin-tone matched pigment camouflage per zone.' },
    ],
    faqs: [
      { question: 'Does PMU hurt?', answer: 'We apply effective topical numbing cream before and during the procedure, keeping discomfort to an absolute minimum.' },
      { question: 'How long does lip blush or microblading last?', answer: 'Results typically last 1.5 to 3 years depending on skin type and lifestyle.' },
    ],
    prepGuidelines: [
      'Do not wax or tint brows 3 days prior to appointment.',
      'Hydrate your lips with balm for 48 hours prior to lip blush sessions.',
    ],
    aftercareGuidelines: [
      'Keep area dry from direct shower streams for 7 days.',
      'Apply supplied healing cream thinly twice daily.',
    ],
    galleryImages: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
      '/images/portfolio/spider-navel-piercing.png',
    ]
  },
  {
    id: 'body-piercing',
    disciplineNumber: '07',
    title: 'Precision Body Piercing',
    subtitle: 'Ear, Facial, Dermals & Body',
    description: 'Sterile ear piercings (lobe, helix, tragus, conch, industrial), facial/oral (septum, nose, smiley, lip), navel, back/surface dermals, nipple & Christina piercings in implant-grade titanium.',
    longDescription: 'Hospital-grade body piercing with luxury implant-grade titanium (ASTM F-136) and solid 14k/18k gold jewelry. Marvin and our certified piercers use single-use aseptic needles (never guns) for instant, clean, precision piercings with minimal swelling and rapid healing.',
    category: 'PIERCING',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=80',
    iconName: 'colorize',
    accentColor: 'primary',
    specs: [
      { label: 'Jewelry', value: 'ASTM F-136 Titanium Suite' },
      { label: 'Dermals', value: 'Back & Surface Anchor Mods' },
      { label: 'Hygiene', value: 'Aseptic Single-Use Blades' },
      { label: 'Aftercare', value: 'Sterile Saline Recovery Kit' },
    ],
    processSteps: [
      { step: '01', title: 'Anatomy Check & Jewelry Selection', description: 'Evaluating cartilage/skin anatomy and selecting mirror-polished ASTM F-136 titanium studs.' },
      { step: '02', title: 'Surgical Sterilization & Dotting', description: 'Skin antiseptic prep and precise caliper dot placement for optimal balance.' },
      { step: '03', title: 'Single-Use Needle Insertion', description: 'Fast, smooth needle insertion and instant threadless jewelry installation.' },
      { step: '04', title: 'Saline Aftercare Pack', description: 'Sterile saline spray provided with step-by-step cleaning guidance.' },
    ],
    pricingTiers: [
      { tier: 'Standard Ear / Nose Piercing', price: 'UGX 50,000 - 100,000', description: 'Lobe, helix, tragus, nostril with basic titanium jewelry.' },
      { tier: 'Cartilage / Facial / Navel', price: 'UGX 100,000 - 180,000', description: 'Septum, conch, industrial, smiley, navel, or tongue.' },
      { tier: 'Surface Anchor / Microdermal', price: 'UGX 150,000 - 250,000', description: 'Back dimples, chest dermal, or intimate piercing.' },
    ],
    faqs: [
      { question: 'Do you use piercing guns?', answer: 'Never. We only use single-use tri-beveled surgical needles, which cause zero blunt tissue trauma and ensure clean, rapid healing.' },
      { question: 'Is the starter jewelry safe for sensitive skin?', answer: 'Yes, all our starter jewelry is made of implant-grade titanium (ASTM F-136), which is 100% hypoallergenic and nickel-free.' },
    ],
    prepGuidelines: [
      'Eat a healthy meal 1 hour before your appointment to keep blood sugar stable.',
      'Avoid caffeine and aspirin right before the session.',
    ],
    aftercareGuidelines: [
      'Spray with sterile saline solution twice daily.',
      'Do not twist, touch, or rotate the jewelry during healing.',
      'Sleep on a travel pillow to avoid pressure on fresh ear piercings.',
    ],
    galleryImages: [
      '/images/portfolio/spider-navel-piercing.png',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
    ]
  },
  {
    id: 'laser-keloids-removal',
    disciplineNumber: '08',
    title: 'Laser & Keloids Removal',
    subtitle: 'Safe Fading & Skin Clearance',
    description: 'Advanced laser tattoo removal to lighten ink for cover-ups or complete removal, alongside certified keloid removal treatments.',
    longDescription: 'Clinical skin clearance and ink fading powered by state-of-the-art Nd:YAG laser technology and dermatological protocols. We offer safe tattoo removal across all skin tones with minimal thermal trauma, alongside specialized treatments for ear and body keloid removal.',
    category: 'REMOVAL',
    image: 'https://images.unsplash.com/photo-1512290900672-1f02e1a3ef78?auto=format&fit=crop&w=1000&q=80',
    iconName: 'colorize',
    accentColor: 'primary',
    specs: [
      { label: 'Laser Tech', value: 'Safe Pigment Lightening' },
      { label: 'Keloids', value: 'Safe Removal Protocol' },
      { label: 'Recovery', value: 'Comprehensive Skin Aftercare' },
      { label: 'Outcome', value: 'Clean Canvas for New Tattoos' },
    ],
    processSteps: [
      { step: '01', title: 'Dermal & Pigment Assessment', description: 'Assessing ink depth, skin type (Fitzpatrick scale), and keloid tissue structure.' },
      { step: '02', title: 'Targeted Laser Pulse Pass', description: 'Q-switched laser pulses shattering pigment into microscopic particles.' },
      { step: '03', title: 'Cooling & Soothing Barrier', description: 'Immediate cryo-cooling and soothing antibacterial recovery gel application.' },
      { step: '04', title: 'Progressive Healing Schedule', description: 'Scheduling treatment passes 6-8 weeks apart for complete lymphatic clearance.' },
    ],
    pricingTiers: [
      { tier: 'Small Tattoo Laser Session', price: 'UGX 120,000 - 200,000', description: 'Per session for 1-2 inch tattoo fading.' },
      { tier: 'Medium Tattoo Laser Session', price: 'UGX 250,000 - 450,000', description: 'Per session for forearm or shoulder piece.' },
      { tier: 'Keloid Removal Treatment', price: 'UGX 200,000 - 500,000', description: 'Clinical keloid treatment protocol.' },
    ],
    faqs: [
      { question: 'How many sessions are needed to remove a tattoo?', answer: 'Fading for a cover-up typically takes 2 to 4 sessions. Complete removal takes 5 to 8 sessions depending on ink depth and colors.' },
      { question: 'Is laser removal safe on dark skin?', answer: 'Yes. We calibrate wavelength and pulse duration specifically to protect melanin and prevent hyperpigmentation.' },
    ],
    prepGuidelines: [
      'Avoid sun exposure and tanning beds for 4 weeks before treatment.',
    ],
    aftercareGuidelines: [
      'Keep the treated area clean and cool; apply cold compress if warm.',
      'Apply prescribed healing ointment and do not pick at any light scabbing.',
    ],
    galleryImages: [
      'https://images.unsplash.com/photo-1512290900672-1f02e1a3ef78?auto=format&fit=crop&w=800&q=80',
      '/images/portfolio/portrait-elder-woman.png',
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
