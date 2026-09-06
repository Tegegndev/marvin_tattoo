import { ServiceItem, PortfolioPiece, ArtistProfile, Testimonial, ProductItem } from '../types';

export const HERO_IMAGE = "https://lh3.googleusercontent.com/aida/AEtjO1WxJneVTTiW5FtUrPA-UR2MCffuWJAbObh5_9W0vlQKxC_piV154sBLGppN0_wQIIb2QAx1s4TtQItttuHFTtoKW_9vpl7OcIRzDT0xXw5czitVp0NkmhS7cZ-MzVz0skE9_yEGcoDFgvZQdsHHM1rv32xYstg6XDqLe5pD0LijkVhE9CY4QoesFaarKdffwvL8_6aJVdyy4-7wR0JXMwckNFfjtX61dr9yRUqlYQSOHZ-DHbaO_bE-a2E";

export const LOGO_URL = "/logo.svg";

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'dark-realism',
    disciplineNumber: '01',
    title: 'Dark Realism & Blackwork',
    subtitle: 'Heavy Contrast & Void',
    description: 'Gothic-realism portraits, architectural blackwork, and deep opaque shading packed tight for contrast that stays crisp for decades.',
    image: 'https://lh3.googleusercontent.com/aida/AEtjO1VRMTxwNcUrz_Rss-qZc3E5RnE38-tSlJ4efYJkYzOUKo2ZN9ys9JnjZeiDZXZbrF7HgG9OK9BGTtgBFnoyPt6ac9u4OtqM4qYPNumvWLiNzA5v5D3J0qQk8dLF3CjJI8kr150no4Xm0tS79r_Jj9ovdPDtAI1v6Xq6ld4EphFcsclWD5C6MossDCf5mgjAeRUbi48xxrS5Wa-8taGXyGBttf4agd_gLKd7RIEZNci961NDrm9-H_dE0IR_',
    iconName: 'skull',
    accentColor: 'primary',
    specs: [
      { label: 'Technique', value: 'Stippling & Solid Shading' },
      { label: 'Pigment', value: 'Carbon Deep Black' },
      { label: 'Session Type', value: 'Half & Full Day' },
    ]
  },
  {
    id: 'neo-traditional',
    disciplineNumber: '02',
    title: 'Neo-Traditional & Script',
    subtitle: 'Freehand Calligraphy',
    description: 'Heavy line work, hand-drawn calligraphy, and saturated color built to hold its shape and weight over time.',
    image: 'https://lh3.googleusercontent.com/aida/AEtjO1X6wlJFnSfwjjK1t1rory9O60Sg-Za-xZ0KtUNagkCf6JzyXTzndPK_r_Ik8FidX2Ol8Toz88COxQ6mtaMLKx62QfFFa7WGUT6TjXgP4d9A_pdzVJipjUm8tOpMEa2OJ8KukhUh0d1SoOC7AVfMu0-TBzsD325rDKe1PVYbuefOuDzvXCg4AXMWOglIwkCis3ynY6JYLQLDZWm-N60sWNjW7xs-RkLFGEeygAoVkeA870M_SMZ8ERwrvQ8f',
    iconName: 'edit_note',
    accentColor: 'primary',
    specs: [
      { label: 'Technique', value: 'Freehand Script' },
      { label: 'Needles', value: 'Round Liners 07-14RL' },
      { label: 'Session Type', value: 'Single & Multi-Session' },
    ]
  },
  {
    id: 'precision-piercings',
    disciplineNumber: '03',
    title: 'Precision Piercings',
    subtitle: 'Placed To Fit Your Anatomy',
    description: 'Implant-grade ASTM-F136 titanium and solid 14k gold, mapped to your cartilage so pieces sit well and heal clean.',
    image: 'https://lh3.googleusercontent.com/aida/AEtjO1UKxCrKf8AiwCBwkQ0y1UMs_JKbByxBZorm3NnTNxcM3ZUiLIEHKRttY1oxTIY8tXi2TfHbXHWEaxX8iCKE7Y9FA5upzEFzSwWIrWxnqAp6eUBMp5xJerdVTc2IyoTZfxksnLUQ3B73pCPmD5mGa1RK-1m3yRqf9WF7mvUATlR7wt3huzzGTWReAc75DBvmAszA-6D1iZXVAevDKv4cizXRfWRXlo0W4XMBRecGsmQe8cPXL1fmD1xw0hhv',
    iconName: 'colorize',
    accentColor: 'primary',
    specs: [
      { label: 'Material', value: 'Titanium / 14k Solid Gold' },
      { label: 'Sterility', value: 'Class-B Steam Autoclave' },
      { label: 'Curations', value: 'Daith, Tragus, Industrial, Helix' },
    ]
  },
  {
    id: 'coverups-reworks',
    disciplineNumber: '04',
    title: 'Cover-Ups & Reworks',
    subtitle: 'Fresh Start Over Old Ink',
    description: 'Heavy blast-overs and redesigns that work with what you already have. We assess on-site and plan the coverage honestly.',
    image: 'https://lh3.googleusercontent.com/aida/AEtjO1XNohxnOuUyiuRH81bDZ-UO8NfUNRWjsUcNf17CRapKv9vqwRHRvs3ImL_JXOm2FvDj6HykULWGcCWZgYx9hVcVCLxqzHuv1hF1ialW4869cGWPNTHer5TvmOtY_nxwDKw6nQDMXi3mq1XDnV16QhONJg9c1lC6tE19Ss8zvWLgg3iC8edIVpUsZahYztL6uWO1QlydX2_bGpDx5xF0AII2u44j6IKQa1Bcw-3gRSQPd0R3M512GxMVb3KS',
    iconName: 'layers',
    accentColor: 'primary',
    specs: [
      { label: 'Approach', value: 'Worked Into The Design' },
      { label: 'Density', value: 'Multi-layer Shading' },
      { label: 'Assessment', value: 'In-Person Consult Required' },
    ]
  }
];

export const PORTFOLIO_DATA: PortfolioPiece[] = [
  {
    id: 'piece-opus-01',
    title: 'The Luciferian Seraph',
    category: 'dark-realism',
    categoryLabel: 'Dark Realism & Heavy Shading',
    artist: 'Marvin',
    healingState: 'Healed 18 Months',
    cycle: 'healed',
    zone: 'Backpiece',
    flashId: 'BACK-884',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhf9WWboZm6VtIX0sgA6TR4C5Vb8FxzXviJyTJ5ijvIdnoAPCZnzby69tFz-XpzlPcIyf7CMYscKO5USLqqKCAZAhK4jS4fZ9vktrBKIjaOIzcLfr5QDkSLE8rlneloji3YYmNZl0eStHydIHTpqbf-ZEPIuPbTYqQHi6kZis67yjg_nNIZ4RrXR0AvDW_Y4yJacr5I0PpNeMWlB7uMoyzCv79KyPivEkNSDWBqYqSSpSKY1I9JpuQFg',
    description: 'A full backpiece worked over five sessions — baroque anatomical engraving blended into deep, consistent shading.',
    duration: '42 Hours (5 Sessions)',
    pigment: 'Dynamic Carbon Deep',
    morphology: 'Full Back to Iliac Crest',
    featured: true
  },
  {
    id: 'piece-01',
    title: 'Corvus Nocturne',
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
  },
  {
    id: 'piece-02',
    title: 'The Marble Seraph',
    category: 'dark-realism',
    categoryLabel: 'Dark Realism & Heavy Shading',
    artist: 'Elena Kostas',
    healingState: 'Healed 1 Year',
    cycle: 'healed',
    zone: 'Backpiece',
    flashId: '#401-SR',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdo0bmFlXnX1D3392Tsa9epf80ypykcTNyGVsl-WoyqvJcgmBe84RihyvVZ2Oh_bw9_WQL2aUI3cXniK6UxJzO8limg9nUwTyfltgEo5dv3tOjhK4u-dtK8tbaQmZoNJL2l1OA1397Ox7uPI_Pxd38c4lFA7aeN84kZTRUfQ9gi19aT1j3k2VUSZ4W8jSfYCG0NZHDo3pa3hhvZxQS7Ohzwkx-O6Bzm-C_OjRifSEYXrf8tjKLibeW4w',
    description: 'Grey-wash back piece that blends deep shadow into soft, skin-toned highlights for a carved-stone feel.',
    duration: '28 Hours (4 Sessions)',
    pigment: 'Silverback Greywash',
    morphology: 'Scapula & Spine'
  },
  {
    id: 'piece-03',
    title: 'Onyx Constellation',
    category: 'piercing',
    categoryLabel: 'Titanium & Gold Piercings',
    artist: 'S. Choi',
    healingState: 'Custom Titanium',
    cycle: 'healed',
    zone: 'Ear Stack',
    flashId: '#712-TI',
    image: 'https://lh3.googleusercontent.com/aida/AEtjO1UKxCrKf8AiwCBwkQ0y1UMs_JKbByxBZorm3NnTNxcM3ZUiLIEHKRttY1oxTIY8tXi2TfHbHXWEaxX8iCKE7Y9FA5upzEFzSwWIrWxnqAp6eUBMp5xJerdVTc2IyoTZfxksnLUQ3B73pCPmD5mGa1RK-1m3yRqf9WF7mvUATlR7wt3huzzGTWReAc75DBvmAszA-6D1iZXVAevDKv4cizXRfWRXlo0W4XMBRecGsmQe8cPXL1fmD1xw0hhv',
    description: 'Curated ear stack in ASTM-F136 titanium with black onyx accents, placed to match the natural contour of the ear.',
    duration: '45 Minutes',
    pigment: 'Titanium F-136',
    morphology: 'Double Daith & Upper Helix'
  },
  {
    id: 'piece-04',
    title: 'Baroque Crux Invictus',
    category: 'neo-traditional',
    categoryLabel: 'Neo-Traditional & Script',
    artist: 'Marvin',
    healingState: 'Healed 1 Year',
    cycle: 'healed',
    zone: 'Full Sleeve',
    flashId: '#904-CX',
    image: 'https://lh3.googleusercontent.com/aida/AEtjO1W5qpd7K4UaUYPpmpSFlbAnuN6x4jf7s6OcAT5sniJGrkhQoEkB_QM2WDxL1jPzCJGM1rHClXCaLX5bsOGf3RInjCFE9fQKFK5smcbpwfdabvSaDRJX2o6f_GqfMsKNxuNuRO-NrOP4uorf8AeE1DNFH2WHsW-k2zqt0SdJvyPUD-LAgMJkg8SV8gRzSvUW7kvF-6arQ-AvQT5lJ3XvuW8ybTjQRblOpZIqa77N_U6knpis5X_c1js71sWe',
    description: 'Ornate carved crucifix with vines and filigree flowing down the full outer arm in black and crimson wash.',
    duration: '22 Hours (3 Sessions)',
    pigment: 'Jet Black & Crimson Wash',
    morphology: 'Full Outer Arm Sleeve'
  },
  {
    id: 'piece-05',
    title: 'Memento Mori Reliquary',
    category: 'micro-detail',
    categoryLabel: 'Micro & Single-Needle',
    artist: 'Elena Kostas',
    healingState: 'Fresh Ink',
    cycle: 'fresh',
    zone: 'Hands',
    flashId: '#319-MM',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJ8XqYldeN2RLQHWF5mM1iUwFoIEFi163iGeRSQb40gZPzBn-3RUjkhfB51oBBTPjA3uahQRjcq02m0In3-lZV7LDyQ5vI2GPGUxkaqkkM_1PQWYOjBvd9kXWznG22_1kx20Ucqd12cbl19WH01AJeWux7AMskIdhTR1oEmpbLdcdQ57gPiWa3W8_zh50nd8lR2xLldytTG1xAelB0jp5Y8_YyU4OEJQ0UkzLdNZUX35mpVg-kAKvsKg',
    description: 'Fine single-needle work with a skull, dagger, and heart detail on the back of the hand.',
    duration: '8 Hours Single Needle',
    pigment: '03 Bugpin Carbon',
    morphology: 'Back of Hand & Wrist'
  },
  {
    id: 'piece-06',
    title: 'Gothic Blast-Over Armor',
    category: 'coverup',
    categoryLabel: 'Cover-Ups & Reworks',
    artist: 'Marvin',
    healingState: 'Healed 8 Months',
    cycle: 'healed',
    zone: 'Full Sleeve',
    flashId: '#641-BO',
    image: 'https://lh3.googleusercontent.com/aida/AEtjO1XNohxnOuUyiuRH81bDZ-UO8NfUNRWjsUcNf17CRapKv9vqwRHRvs3ImL_JXOm2FvDj6HykULWGcCWZgYx9hVcVCLxqzHuv1hF1ialW4869cGWPNTHer5TvmOtY_nxwDKw6nQDMXi3mq1XDnV16QhONJg9c1lC6tE19Ss8zvWLgg3iC8edIVpUsZahYztL6uWO1QlydX2_bGpDx5xF0AII2u44j6IKQa1Bcw-3gRSQPd0R3M512GxMVb3KS',
    description: 'Old faded tattoo restructured into a solid black armor plate with clean negative space.',
    duration: '18 Hours (2 Sessions)',
    pigment: 'Opaque Triple Black',
    morphology: 'Forearm to Bicep'
  }
];

export const ARTISTS_DATA: ArtistProfile[] = [
  {
    id: 'marvin',
    name: 'Marvin',
    title: 'Founder & Resident Artist',
    role: 'Former surgical tech, tattooist since 2014',
    avatar: '/images/marvin-founder.png',
    experience: '14+ Years',
    specialty: 'Dark Realism, Backpieces & Heavy Script',
    slotsRemaining: 4,
    bio: 'Trained as a surgical technician before tattooing. Marvin founded the studio in 2014 and still brings the same sterilization discipline to every appointment — clean, precise, and consistent.',
    badges: ['FOUNDER', 'SURGICAL TRAUMA CERTIFIED']
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
    name: 'Christian Moreau',
    role: 'Custom Sleeve',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_Ac-e7bEVS-36L39MbRDP7s7PJdpwFjaB0CEZkHJfjp55tfDpRNJIIKe3B7c35yrDKlJ8wbmNV33qNH4SvOA6dZDsUgftKuwzW0mMYIdWJoXEbRkV14nNJO7iIC8zbtVWh-xWotDxJI0BJJzWrMLCtObIvE-iLwnctOaKqLUZVN_t9Hvv_HAXFVywfjU9XpuWY9vnknmh3SoXTacvHfSjGmnUYOcD_rmPGw2VFiBGA29wF5d4LLKE-w',
    stars: 5,
    quote: 'Marvin spent almost two hours getting the placement right before a needle even touched skin. The healed result is clean and exactly what we planned.'
  },
  {
    id: 't-2',
    name: 'Valeria Danvers',
    role: 'Curated Piercings',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACl5TDYhkHxDnUNAqLaqOA72iCaB1_fj_vVRrzFcyMzZ-x6zNZ4Y_9pBBPgFer7xLnSePNYY5_6LUcEVQthy6ArgkCJhpMz9mcsluBLjEPt9SihUheS-XFAyio-kXj9KBGkCHmW0heMxUoB3cBoKU18eBU_YaKlL587Ejf0A3zjglTbM0t19euF1ekZx4OkbrAXT0yYNeNdOiGtFIP5d6E1ARTCtJMfzkVeWbZClRH0G25nT2kXmbFqQ',
    stars: 5,
    quote: 'They measured my ear properly and custom-fit the bars so nothing sits crooked. Two pieces healed with no issues.'
  },
  {
    id: 't-3',
    name: 'Marcus Thorne',
    role: 'Cover-Up',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcSTxYZcRELvyPhHyC0rXzHgFYO1bfzU4qCw5yr6tpwiYR75X8H48LGh-d-tucDipwwpOSCMS-lrt_lrkNU_c-v6W0W2ig3CivuYBnwg7hgoLm5eGw9Hztu0n0Om5gbsAihcJqCt5cDRluupnEovckw_UVx5OIrcEV7dlyz62L1mxTJlv_d66aqAvlWIEBOxkRq3JfWESpIcW01R3GBe9dyidVSWPxVG3eZUjhgZk4iZywF1-nX6ii1Q',
    stars: 5,
    quote: 'Two other shops turned me away for a cover-up. They planned it honestly and the result is a completely fresh piece.'
  }
];

export const PRODUCTS_DATA: ProductItem[] = [
  {
    id: 'prod-01',
    name: 'Rotary Pen Machine',
    category: 'Hard Goods',
    price: 740.00,
    description: 'Wireless, cordless rotary pen with a 4.0mm stroke — reliable for dense blackwork and clean lining.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEH8HyVGDUmyNIYB_ozfjZC3d_Snybt1fw4elc5WrsWjCK7ruPDVXY1033SzVeC5ziQox58N5K7_pawWks4y0GlyDEqTNRg2LCEWlAZwn6falcTEsjGTeJwL8D3VPvHWd1KTejeG-ypst5FsqwTaE9DQKDkuCm2onFL80aaXOUt_Z1476nCjQbyTTnmbS0ZagPdyRh2KLpI9AvMxL2ts4Mj7-jm5NNPN_1dAg9y9R5wnR5pU17SvXehw',
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJ3BR6lxY9HGmiiaJwYhonKL0kFpQ-pr6OIFA1ddhzlKNAEYKkS_laFJLgVPyMFqNoKIpMZjb7lp4yILotsaCwiZOTqHWAPq0t1Xd6LSOHamN2KjSOxqssgImwqUdSocVTb78LSGQQMXfUmKuGK5vKYZYBYt-XrCbCjVWAfXA8Z_qveN_-hXXdMRMihRUXc5CwLH4IknwB3MYUEsApWB42-YGWEKFvm7ZdZijYUBy0ZmQ_jqgnV7PTkQ',
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
    image: 'https://lh3.googleusercontent.com/aida/AEtjO1VRMTxwNcUrz_Rss-qZc3E5RnE38-tSlJ4efJYkYzOUKo2ZN9ys9JnjZeiDZXZbrF7HgG9OK9BGTtgBFnoyPt6ac9u4OtqM4qYPNumvWLiNzA5v5D3J0qQk8dLF3CjJI8kr150no4Xm0tS79r_Jj9ovdPDtAI1v6Xq6ld4EphFcsclWD5C6MossDCf5mgjAeRUbi48xxrS5Wa-8taGXyGBttf4agd_gLKd7RIEZNci961NDrm9-H_dE0IR_',
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
    image: 'https://lh3.googleusercontent.com/aida/AEtjO1UKxCrKf8AiwCBwkQ0y1UMs_JKbByxBZorm3NnTNxcM3ZUiLIEHKRttY1oxTIY8tXi2TfHbHXWEaxX8iCKE7Y9FA5upzEFzSwWIrWxnqAp6eUBMp5xJerdVTc2IyoTZfxksnLUQ3B73pCPmD5mGa1RK-1m3yRqf9WF7mvUATlR7wt3huzzGTWReAc75DBvmAszA-6D1iZXVAevDKv4cizXRfWRXlo0W4XMBRecGsmQe8cPXL1fmD1xw0hhv',
    accentColor: 'primary',
    inStock: true,
    specs: ['16G (1.2mm) x 8mm', 'ASTM F-136 Titanium', 'Black Onyx', 'Autoclave Safe']
  }
];
