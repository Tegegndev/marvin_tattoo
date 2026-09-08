import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Marvin Tattoos Atelier Database Seeding...");

  // 1. Seed Marvin Admin Account
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: "admin@marvintattoos.com" },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("MarvinStudio2026!", 10);
    const admin = await prisma.admin.create({
      data: {
        email: "admin@marvintattoos.com",
        password: hashedPassword,
        name: "Master Marvin",
      },
    });
    console.log(`✅ Admin account created: ${admin.email} (Password: MarvinStudio2026!)`);
  } else {
    console.log("ℹ️ Admin account already exists, skipping creation.");
  }

  // 2. Seed Default Site Configuration (Singleton)
  const defaultHours = JSON.stringify([
    { day: "Monday - Saturday", hours: "10:00 AM - 8:00 PM" },
    { day: "Sunday", hours: "By Appointment Only" },
  ]);

  const defaultSocialLinks = JSON.stringify([
    {
      id: "soc-1",
      platform: "instagram",
      label: "Instagram",
      url: "https://instagram.com/marvin_tattoos",
      icon: "instagram",
      active: true,
    },
    {
      id: "soc-2",
      platform: "tiktok",
      label: "TikTok",
      url: "https://tiktok.com/@marvintattoos",
      icon: "tiktok",
      active: true,
    },
    {
      id: "soc-3",
      platform: "whatsapp",
      label: "WhatsApp",
      url: "https://wa.me/256705748774",
      icon: "whatsapp",
      active: true,
    },
    {
      id: "soc-4",
      platform: "facebook",
      label: "Facebook",
      url: "https://facebook.com/marvintattoosug",
      icon: "facebook",
      active: true,
    },
    {
      id: "soc-5",
      platform: "maps",
      label: "Google Maps",
      url: "https://maps.google.com/?q=New+Pioneer+Mall+Kampala",
      icon: "map-pin",
      active: true,
    },
  ]);

  await prisma.siteSetting.upsert({
    where: { id: "studio_config" },
    update: {
      studioName: "Marvin Tattoos & Piercing Atelier",
      heroStatement: "Clean Lines. Heavy Blackwork. Made to Age Well.",
      heroSubtext:
        "Kampala's premier sanctuary for bespoke dark realism, clinical titanium piercings, and aesthetic PMU. 14+ years of master craft.",
      heroBannerUrl: "/images/hero-banner.png",
      heroOpacity: 0.45,
      primaryPhone: "+256705748774",
      whatsappNumber: "+256705748774",
      contactEmail: "info@marvintattoos.com",
      physicalAddress: "Level 5, New Pioneer Mall, Burton St, Kampala, Uganda",
      googleMapsUrl: "https://maps.google.com/?q=New+Pioneer+Mall+Kampala",
      openingHours: defaultHours,
      socialLinks: defaultSocialLinks,
    },
    create: {
      id: "studio_config",
      studioName: "Marvin Tattoos & Piercing Atelier",
      heroStatement: "Clean Lines. Heavy Blackwork. Made to Age Well.",
      heroSubtext:
        "Kampala's premier sanctuary for bespoke dark realism, clinical titanium piercings, and aesthetic PMU. 14+ years of master craft.",
      heroBannerUrl: "/images/hero-banner.png",
      heroOpacity: 0.45,
      announcementActive: false,
      announcementText: null,
      primaryPhone: "+256705748774",
      whatsappNumber: "+256705748774",
      contactEmail: "info@marvintattoos.com",
      physicalAddress: "Level 5, New Pioneer Mall, Burton St, Kampala, Uganda",
      googleMapsUrl: "https://maps.google.com/?q=New+Pioneer+Mall+Kampala",
      openingHours: defaultHours,
      socialLinks: defaultSocialLinks,
    },
  });
  console.log("✅ Site settings singleton synchronized.");

  // 3. Seed Services Catalog
  const services = [
    {
      disciplineNumber: "01",
      title: "Realism & Portraits",
      subtitle: "Photo-Realistic Artistry",
      description:
        "High-detail black-and-grey and photo-realistic face, memorial, animal, or object pieces executed with smooth tonal transitions and deep contrast.",
      category: "TATTOO",
      imageUrl: "/images/portfolio/portrait-elder-woman.png",
      iconName: "skull",
      specs: JSON.stringify([
        { label: "Technique", value: "High-Detail Black & Grey" },
        { label: "Subject", value: "Portraits, Wildlife & Objects" },
        { label: "Session Type", value: "Half & Full Day Sessions" },
      ]),
      sortOrder: 1,
    },
    {
      disciplineNumber: "02",
      title: "Minimalist & Fine-Line",
      subtitle: "Delicate Precision Marking",
      description:
        "Delicate geometric shapes, continuous line art, micro-tattoos, and clean subtle markings tailored to anatomical curves.",
      category: "TATTOO",
      imageUrl: "/images/portfolio/script-abdul-collarbone.png",
      iconName: "edit_note",
      specs: JSON.stringify([
        { label: "Technique", value: "Single Needle & Micro-Line" },
        { label: "Style", value: "Geometric & Continuous Line" },
        { label: "Healing", value: "Fast & Clean" },
      ]),
      sortOrder: 2,
    },
    {
      disciplineNumber: "03",
      title: "Lettering & Script",
      subtitle: "Custom Typography & Calligraphy",
      description:
        "Custom typography, freehand calligraphy, names, meaningful quotes, and dates drawn to flow naturally across the skin.",
      category: "TATTOO",
      imageUrl: "/images/portfolio/script-abdul-collarbone.png",
      iconName: "edit_note",
      specs: JSON.stringify([
        { label: "Style", value: "Chicano, Gothic & Calligraphy" },
        { label: "Design", value: "100% Custom Lettering" },
        { label: "Longevity", value: "Spaced for Sharp Aging" },
      ]),
      sortOrder: 3,
    },
    {
      disciplineNumber: "04",
      title: "Traditional & Tribal",
      subtitle: "Bold Blackwork & Flash",
      description:
        "Bold blackwork, Polynesian and African tribal patterns, bold geometric armor, and classic timeless flash art.",
      category: "TATTOO",
      imageUrl: "/images/portfolio/back-portrait-man.png",
      iconName: "layers",
      specs: JSON.stringify([
        { label: "Style", value: "Polynesian, Tribal & Flash" },
        { label: "Pigment", value: "Opaque Triple Black" },
        { label: "Impact", value: "High Contrast & Heavy Lines" },
      ]),
      sortOrder: 4,
    },
    {
      disciplineNumber: "05",
      title: "Cover-Ups & Restorations",
      subtitle: "Reworking & Concealing Old Ink",
      description:
        "Reworking, blending, or fully concealing faded, poorly done, or unwanted old tattoos with strategic custom cover designs.",
      category: "TATTOO",
      imageUrl: "/images/portfolio/portrait-elder-woman.png",
      iconName: "layers",
      specs: JSON.stringify([
        { label: "Consult", value: "In-Person Evaluation" },
        { label: "Technique", value: "Strategic Contrast & Blending" },
        { label: "Outcome", value: "Complete Fresh Tattoo" },
      ]),
      sortOrder: 5,
    },
    {
      disciplineNumber: "06",
      title: "Semi-Permanent Makeup",
      subtitle: "Microblading, Lips & Camouflage",
      description:
        "Microblading & ombré powder brows, pink lip blush / neutralization, stretch marks camouflage, and permanent hair removal.",
      category: "PMU",
      imageUrl: "/images/portfolio/cosmetic-eyebrow-pmu.png",
      iconName: "edit_note",
      specs: JSON.stringify([
        { label: "Brows", value: "Microblading & Ombré" },
        { label: "Lips", value: "Pink Lips Blush & Neutralize" },
        { label: "Skin", value: "Stretch Marks Camouflage" },
      ]),
      sortOrder: 6,
    },
    {
      disciplineNumber: "07",
      title: "Precision Body Piercing",
      subtitle: "Ear, Facial, Dermals & Body",
      description:
        "Sterile ear piercings (lobe, helix, tragus, conch, industrial), facial/oral (septum, nose, smiley, lip), navel, back/surface dermals, nipple & Christina piercings in implant-grade titanium.",
      category: "PIERCING",
      imageUrl: "/images/portfolio/spider-navel-piercing.png",
      iconName: "colorize",
      specs: JSON.stringify([
        { label: "Jewelry", value: "ASTM F-136 Titanium Suite" },
        { label: "Dermals", value: "Back & Surface Anchor Mods" },
        { label: "Hygiene", value: "Aseptic Single-Use Blades" },
      ]),
      sortOrder: 7,
    },
    {
      disciplineNumber: "08",
      title: "Laser & Keloids Removal",
      subtitle: "Safe Fading & Skin Clearance",
      description:
        "Advanced laser tattoo removal to lighten ink for cover-ups or complete removal, alongside certified keloid removal treatments.",
      category: "REMOVAL",
      imageUrl: "/images/portfolio/back-portrait-man.png",
      iconName: "colorize",
      specs: JSON.stringify([
        { label: "Laser Tech", value: "Safe Pigment Lightening" },
        { label: "Keloids", value: "Safe Removal Protocol" },
        { label: "Recovery", value: "Comprehensive Aftercare" },
      ]),
      sortOrder: 8,
    },
  ];

  await prisma.service.deleteMany({});
  for (const service of services) {
    await prisma.service.create({ data: service });
  }
  console.log(`✅ Seeded/Refreshed ${services.length} studio service disciplines.`);

  // 4. Seed Portfolio Pieces
  const pieces = [
    {
      title: "Honor To Mothers: Matriarch Portrait",
      category: "dark-realism",
      categoryLabel: "Memorial Realism & Mother Tribute",
      zone: "Forearm",
      flashId: "MOM-701",
      imageUrl: "/images/portfolio/portrait-elder-woman.png",
      description:
        "A heartfelt tribute to motherhood — high-detail black-and-grey photo-realism with soft skin transitions, expressive warmth, and intricate patterned headwrap texturing crafted to hold its clarity and sentiment over a lifetime.",
      duration: "6 Hours Single Session",
      pigment: "Dynamic Carbon Deep & Greywash",
      featured: true,
      sortOrder: 1,
    },
    {
      title: 'Custom Script "Abdul S"',
      category: "neo-traditional",
      categoryLabel: "Lettering & Fine-Line Script",
      zone: "Collarbone",
      flashId: "#420-AS",
      imageUrl: "/images/portfolio/script-abdul-collarbone.png",
      description:
        "Clean single-needle cursive calligraphy script tattooed precisely along the collarbone contour.",
      duration: "1.5 Hours Single Needle",
      pigment: "Opaque Triple Black",
      featured: true,
      sortOrder: 2,
    },
    {
      title: "Spider Blackwork & Navel Piercing",
      category: "piercing",
      categoryLabel: "Piercing & Blackwork",
      zone: "Abdomen / Navel",
      flashId: "#515-SP",
      imageUrl: "/images/portfolio/spider-navel-piercing.png",
      description:
        "Solid black widow silhouette tattoo on lower hip paired with an implant-grade titanium crystal navel barbell.",
      duration: "2 Hours Session",
      pigment: "Carbon Black & F-136 Titanium",
      featured: true,
      sortOrder: 3,
    },
    {
      title: "Memorial Portrait Backpiece",
      category: "dark-realism",
      categoryLabel: "Dark Realism & Portraits",
      zone: "Backpiece",
      flashId: "#830-BP",
      imageUrl: "/images/portfolio/back-portrait-man.png",
      description:
        "Detailed black-and-grey memorial portrait positioned centered on the upper back between the scapulae.",
      duration: "7 Hours Session",
      pigment: "Silverback Greywash & Black",
      featured: false,
      sortOrder: 4,
    },
    {
      title: "Ombré Powder Brows & PMU",
      category: "micro-detail",
      categoryLabel: "Cosmetic Eyebrow PMU",
      zone: "Face & Brow",
      flashId: "#202-PMU",
      imageUrl: "/images/portfolio/cosmetic-eyebrow-pmu.png",
      description:
        "Semi-permanent cosmetic brow shading and ombré contouring done with sterile micro-pigment technique.",
      duration: "2 Hours PMU",
      pigment: "Medical-Grade Brow Pigment",
      featured: false,
      sortOrder: 5,
    },
    {
      title: "Corvus Nocturne Chest Piece",
      category: "dark-realism",
      categoryLabel: "Dark Realism & Heavy Shading",
      zone: "Chest",
      flashId: "#882-CR",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDw-LC5T3Qbuh7cVBwh64V7VAoe8Ji5bovK8uNUZ4_v3NsbJb85T29qes9hXL9_P8_1PBf4wfVbpQ_jhbL7XRLNg8w6HEDLrcJAX0s-fEqouRmmSgnmSX4qP-JFofp3EYwIAzGx2qwAD2dLADwjsqU0HiGAmtiB23NnoxvWdaDOCmJsCexXeKQls6PGxa9d3IKZH2vpMnHSv2iHvMuWAVnCpD0quFwqf3o3NX5hf9o8wD-qFGjCUh9oDQ",
      description:
        "Full sternum piece in deep black, worked over two sessions with shading that follows the chest line.",
      duration: "14 Hours (2 Sessions)",
      pigment: "Panthera Black Ink",
      featured: false,
      sortOrder: 6,
    },
  ];

  await prisma.portfolioPiece.deleteMany({});
  for (const piece of pieces) {
    await prisma.portfolioPiece.create({ data: piece });
  }
  console.log(`✅ Seeded/Refreshed ${pieces.length} portfolio pieces.`);

  // 5. Seed Shop Products
  const products = [
    {
      name: "Rotary Pen Machine",
      category: "Hard Goods",
      price: 2750000.0, // UGX (~$740 USD)
      currency: "UGX",
      description:
        "Wireless, cordless rotary pen with a 4.0mm stroke — reliable for dense blackwork and clean lining.",
      imageUrl:
        "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=600&q=80",
      inStock: true,
      stockCount: 5,
      specs: JSON.stringify([
        "Aircraft Aluminum",
        "4.0mm Stroke",
        "10hr Battery",
        "RCA Adapter Included",
      ]),
      sortOrder: 1,
    },
    {
      name: "Aftercare Balm",
      category: "Aftercare",
      price: 95000.0, // UGX (~$28 USD)
      currency: "UGX",
      description:
        "Cold-pressed calendula and shea butter. No petroleum — a sterile barrier that keeps new ink protected.",
      imageUrl:
        "https://images.unsplash.com/photo-1608248597359-24757c917fb2?auto=format&fit=crop&w=600&q=80",
      inStock: true,
      stockCount: 40,
      specs: JSON.stringify([
        "100ml Glass Bottle",
        "Organic Calendula",
        "No Mineral Oils",
        "Use From Day 1",
      ]),
      sortOrder: 2,
    },
    {
      name: "Cartridge Needles (Box of 20)",
      category: "Needles",
      price: 160000.0, // UGX (~$46 USD)
      currency: "UGX",
      description:
        "316L stainless steel, pre-sterilized with safety membrane to prevent backflow.",
      imageUrl:
        "https://images.unsplash.com/photo-1562962230-16e4623d36e6?auto=format&fit=crop&w=600&q=80",
      inStock: true,
      stockCount: 25,
      specs: JSON.stringify([
        "EO Gas Sterilized",
        "0.30mm Bugpin",
        "Safety Membrane",
        "Clear Tip",
      ]),
      sortOrder: 3,
    },
    {
      name: "Titanium Daith Clicker",
      category: "Titanium Jewelry",
      price: 310000.0, // UGX (~$85 USD)
      currency: "UGX",
      description:
        "Mirror-polished implant-grade titanium with black onyx accents and secure hinge closure.",
      imageUrl:
        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80",
      inStock: true,
      stockCount: 15,
      specs: JSON.stringify([
        "16G (1.2mm) x 8mm",
        "ASTM F-136 Titanium",
        "Black Onyx",
        "Autoclave Safe",
      ]),
      sortOrder: 4,
    },
  ];

  for (const prod of products) {
    const existing = await prisma.product.findFirst({
      where: {
        OR: [
          { name: prod.name },
          { name: prod.name === "Rotary Pen Machine" ? "Wireless Rotary Pen Machine" : prod.name },
          { name: prod.name === "Aftercare Balm" ? "Clinical Tattoo Aftercare Balm" : prod.name },
          { name: prod.name === "Cartridge Needles (Box of 20)" ? "Sterile Cartridge Needles (Box of 20)" : prod.name },
        ],
      },
    });

    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: prod,
      });
    } else {
      await prisma.product.create({ data: prod });
    }
  }
  console.log(`✅ Seeded/Synchronized ${products.length} shop items.`);

  // 6. Seed Testimonials
  const reviews = [
    {
      name: "Brian K.",
      role: "Dark Realism & Sleeve",
      stars: 5,
      quote:
        "Marvin is hands down the best tattoo artist in Kampala. His attention to detail on my portrait sleeve was unmatched. The hygiene standard at New Pioneer Mall is top tier!",
      isGoogleVerified: true,
      approved: true,
    },
    {
      name: "Patricia N.",
      role: "Fine-Line & Script",
      stars: 5,
      quote:
        "Got a delicate fine-line floral piece on my collarbone. The lines are super crisp and sharp, healed completely flat with zero blowouts. Highly recommend Marvin Tattoos!",
      isGoogleVerified: true,
      approved: true,
    },
    {
      name: "Denis M.",
      role: "Tattoo Cover-Up",
      stars: 5,
      quote:
        "I had an old faded tattoo that two other places said was impossible to fix. Marvin redesigned it into an incredible blackwork piece. You cannot even see the old ink underneath.",
      isGoogleVerified: true,
      approved: true,
    },
    {
      name: "Sandra A.",
      role: "Titanium Ear Piercing",
      stars: 5,
      quote:
        "Super sterile setup with single-use needles and high-grade titanium jewelry. No pain, quick healing, and the team explained the aftercare thoroughly.",
      isGoogleVerified: true,
      approved: true,
    },
    {
      name: "Joshua T.",
      role: "Custom Script & Lettering",
      stars: 5,
      quote:
        "Marvin drew the lettering freehand on my forearm first to make sure it aligned with my wrist bone. 100% custom craft and great hospitality at the studio.",
      isGoogleVerified: true,
      approved: true,
    },
    {
      name: "Ritah K.",
      role: "Minimalist Micro-Tattoo",
      stars: 5,
      quote:
        "Friendly vibes, clean equipment, and very professional. The studio on Level 5 of Pioneer Mall is welcoming and relaxed. 5 stars all the way!",
      isGoogleVerified: true,
      approved: true,
    },
  ];

  await prisma.testimonial.deleteMany({});
  for (const review of reviews) {
    await prisma.testimonial.create({ data: review });
  }
  console.log(`✅ Seeded/Refreshed ${reviews.length} client testimonials.`);

  console.log("✨ Database Seeding Completed Successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

