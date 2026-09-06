import React, { useState, useEffect, useRef } from 'react';
import { PageView, PortfolioPiece, ProductItem } from '../types';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion';
import { SERVICES_DATA, PORTFOLIO_DATA, PRODUCTS_DATA, TESTIMONIALS_DATA } from '../data/atelierData';
import { 
  Calendar, 
  ArrowRight, 
  Verified, 
  Star, 
  ShoppingBag, 
  MapPin, 
  ShieldAlert, 
  Skull, 
  FileText, 
  Syringe, 
  Layers, 
  ChevronDown
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageView) => void;
  onSelectPiece: (piece: PortfolioPiece) => void;
  onAddToCart: (product: ProductItem) => void;
  onOpenWhatsApp: () => void;
  onOpenVerify: () => void;
}

// Hero showcase slides
const HERO_SLIDES = [
  {
    num: '01',
    subtitle: 'Tattoo & Piercing Studio',
    title: 'Marvin Tattoos',
    pill: 'Master Crafted Body Art & Precision Piercings',
    desc: 'Dark realism, blackwork, and precision piercings — worked to your body and drawn by hand. Fully sterile and fully bespoke since 2014.',
    image: 'https://lh3.googleusercontent.com/aida/AEtjO1WxJneVTTiW5FtUrPA-UR2MCffuWJAbObh5_9W0vlQKxC_piV154sBLGppN0_wQIIb2QAx1s4TtQItttuHFTtoKW_9vpl7OcIRzDT0xXw5czitVp0NkmhS7cZ-MzVz0skE9_yEGcoDFgvZQdsHHM1rv32xYstg6XDqLe5pD0LijkVhE9CY4QoesFaarKdffwvL8_6aJVdyy4-7wR0JXMwckNFfjtX61dr9yRUqlYQSOHZ-DHbaO_bE-a2E',
    tag: 'Est. 2014 — New York',
    accentColor: 'text-primary'
  },
  {
    num: '02',
    subtitle: 'Dark Realism',
    title: 'About The Ink',
    pill: 'Renaissance Style & Heavy Blackwork',
    desc: 'High-contrast portraits and carved-stone shading engineered to flex naturally across muscle as your body moves.',
    image: 'https://lh3.googleusercontent.com/aida/AEtjO1W5qpd7K4UaUYPpmpSFlbAnuN6x4jf7s6OcAT5sniJGrkhQoEkB_QM2WDxL1jPzCJGM1rHClXCaLX5bsOGf3RInjCFE9fQKFK5smcbpwfdabvSaDRJX2o6f_GqfMsKNxuNuRO-NrOP4uorf8AeE1DNFH2WHsW-k2zqt0SdJvyPUD-LAgMJkg8SV8gRzSvUW7kvF-6arQ-AvQT5lJ3XvuW8ybTjQRblOpZIqa77N_U6knpis5X_c1js71sWe',
    tag: 'Portfolio — Dark Realism',
    accentColor: 'text-primary'
  },
  {
    num: '03',
    subtitle: 'Precision Piercing',
    title: 'Titanium & Gold',
    pill: 'Implant-Grade Materials, Placed To Fit You',
    desc: 'Curated ear projects in titanium and solid 14k gold — measured against your anatomy and sterilized every single time.',
    image: 'https://lh3.googleusercontent.com/aida/AEtjO1UKxCrKf8AiwCBwkQ0y1UMs_JKbByxBZorm3NnTNxcM3ZUiLIEHKRttY1oxTIY8tXi2TfHbHXWEaxX8iCKE7Y9FA5upzEFzSwWIrWxnqAp6eUBMp5xJerdVTc2IyoTZfxksnLUQ3B73pCPmD5mGa1RK-1m3yRqf9WF7mvUATlR7wt3huzzGTWReAc75DBvmAszA-6D1iZXVAevDKv4cizXRfWRXlo0W4XMBRecGsmQe8cPXL1fmD1xw0hhv',
    tag: 'Piercing — Implant Grade',
    accentColor: 'text-primary'
  }
];

// Page sections for in-page navigation
const PAGE_SECTIONS = [
  { id: 'hero-sanctum', index: '01', label: 'Welcome' },
  { id: 'services-section', index: '02', label: 'Services' },
  { id: 'relics-section', index: '03', label: 'Portfolio' },
  { id: 'apothecary-section', index: '04', label: 'Shop' },
  { id: 'testimonials-section', index: '05', label: 'Reviews' },
  { id: 'location-section', index: '06', label: 'Location' }
];

// Animated numeric counter component for scroll-triggered stats
const AnimatedCounter: React.FC<{ value: number; suffix?: string; decimals?: number }> = ({
  value,
  suffix = '',
  decimals = 0
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1800;
    const startTime = performance.now();

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = start + (value - start) * ease;
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(update);
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {decimals > 0 ? displayValue.toFixed(decimals) : Math.floor(displayValue).toLocaleString()}
      {suffix}
    </span>
  );
};

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectPiece,
  onAddToCart,
  onOpenWhatsApp,
  onOpenVerify
}) => {
  const [currentHeroIndex, setCurrentHeroIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [selectedPortfolioCategory, setSelectedPortfolioCategory] = useState<string>('all');
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax scroll hooks
  const { scrollY, scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Hero parallax transformations
  const heroBgY = useTransform(scrollY, [0, 800], [0, 260]);
  const heroOpacity = useTransform(scrollY, [0, 650], [0.85, 0.1]);
  const heroScale = useTransform(scrollY, [0, 800], [1.05, 1.25]);
  const heroTextY = useTransform(scrollY, [0, 600], [0, 110]);

  // Auto-advance hero slides
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activeHero = HERO_SLIDES[currentHeroIndex];

  const filteredPortfolio = selectedPortfolioCategory === 'all'
    ? PORTFOLIO_DATA.slice(0, 3)
    : PORTFOLIO_DATA.filter(item => {
        if (selectedPortfolioCategory === 'blackwork') return item.category === 'dark-realism';
        if (selectedPortfolioCategory === 'portraits') return item.category === 'dark-realism' || item.category === 'neo-arcane';
        if (selectedPortfolioCategory === 'piercings') return item.category === 'piercing';
        return true;
      });

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'skull':
        return <Skull className="w-5 h-5" />;
      case 'edit_note':
        return <FileText className="w-5 h-5" />;
      case 'colorize':
        return <Syringe className="w-5 h-5" />;
      case 'layers':
      default:
        return <Layers className="w-5 h-5" />;
    }
  };

  return (
    <div ref={containerRef} className="w-full flex flex-col bg-surface-container-lowest relative">
      {/* Top Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-primary-container via-primary to-secondary z-50 origin-left"
        style={{ scaleX: smoothProgress }}
      />

      {/* HERO SECTION: Editorial Carousel */}
      <section
        id="hero-sanctum"
        className="relative w-full min-h-[96vh] flex items-center justify-center overflow-hidden pt-28 pb-20 bg-surface-container-lowest"
      >
        {/* Cinematic Visual Backdrop with Framer Motion Transition & Parallax */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeHero.num}
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ opacity: 0.75, scale: 1.05 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full bg-cover bg-center mix-blend-luminosity will-change-transform"
            style={{
              backgroundImage: `url('${activeHero.image}')`,
              backgroundPosition: 'center 30%',
              y: heroBgY,
              opacity: heroOpacity
            }}
          />
        </AnimatePresence>

        {/* Radial Dark Vignette & Crimson Mist Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/60 to-surface-container-lowest/80 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-surface-container-lowest via-transparent to-surface-container-lowest pointer-events-none" />
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-container/20 rounded-full blur-[120px] pointer-events-none"
        />

        {/* Hero Flank: Slide indicators */}
        <div className="hidden xl:flex flex-col items-center gap-3 absolute right-16 top-1/2 -translate-y-1/2 z-30 bg-surface-container-lowest/70 backdrop-blur-md p-4 border border-surface-container-highest/60 shadow-2xl">
          <div className="flex flex-col items-center gap-3">
            {HERO_SLIDES.map((slide, idx) => {
              const isHeroActive = currentHeroIndex === idx;
              return (
                <button
                  key={slide.num}
                  onClick={() => {
                    setCurrentHeroIndex(idx);
                    setIsAutoPlaying(false);
                  }}
                  className="group relative flex items-center gap-3 focus:outline-none py-1"
                  aria-label={`Show slide ${slide.title}`}
                >
                  <span
                    className={`font-label-data text-sm transition-all duration-300 ${
                      isHeroActive
                        ? 'text-primary font-bold'
                        : 'text-outline/50 hover:text-on-surface'
                    }`}
                  >
                    {slide.num}
                  </span>

                  <div className="relative w-6 h-[2px] bg-surface-container-highest flex items-center">
                    {isHeroActive && (
                      <motion.div
                        layoutId="activeHeroIndicator"
                        className="absolute inset-0 bg-primary"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Vertical Accent Label */}
        <div className="hidden xl:block absolute left-12 bottom-16 z-20 [writing-mode:vertical-rl] rotate-180">
          <span className="font-label-caps text-[10px] tracking-[0.3em] uppercase text-outline/70">
            {activeHero.tag}
          </span>
        </div>

        {/* Hero Content Container */}
        <motion.div
          style={{ y: heroTextY }}
          className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center"
        >
          {/* Atelier Provenance Pill */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeHero.num + '-pill'}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-surface-container/80 backdrop-blur-md rounded-full mb-4 shadow-xl border border-outline-variant/30"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />
              <span className="font-label-caps text-[10px] sm:text-xs text-on-surface-variant uppercase tracking-[0.25em]">
                {activeHero.pill}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Editorial Headline */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeHero.num + '-headline'}
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -12 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              <h1 className="font-display-hero font-title-editorial text-5xl sm:text-6xl md:text-7xl text-on-surface mb-4 leading-tight">
                {activeHero.title}
              </h1>

              <div className={`text-xl sm:text-2xl md:text-3xl ${activeHero.accentColor} mb-6 font-headline-md`}>
                {activeHero.subtitle}
              </div>

              <p className="font-body-lg text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto mb-8 leading-relaxed">
                {activeHero.desc}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mb-12"
          >
            <button
              onClick={() => onNavigate('booking')}
              className="group w-full sm:w-auto px-8 py-3.5 bg-primary-container text-on-surface font-label-caps text-xs uppercase tracking-[0.2em] shadow-xl btn-gothic-glow flex items-center justify-center gap-2 border border-primary/30 hover:shadow-[0_0_30px_rgba(138,11,20,0.8)]"
            >
              <Calendar className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
              <span>Book a Session</span>
            </button>
            <button
              onClick={onOpenWhatsApp}
              className="group w-full sm:w-auto px-8 py-3.5 bg-surface-container-high text-on-surface font-label-caps text-xs uppercase tracking-[0.2em] shadow-md btn-secondary-glow flex items-center justify-center gap-2 border border-outline-variant/30"
            >
              <span className="w-2 h-2 rounded-full bg-secondary" />
              <span>WhatsApp Direct</span>
            </button>
          </motion.div>

          {/* Quick Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45 }}
            className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4 bg-surface-container/80 backdrop-blur-xl p-5 shadow-2xl border border-outline-variant/40"
          >
            <div className="flex items-center gap-4 px-4 py-2">
              <span className="font-headline-md text-3xl sm:text-4xl text-on-surface font-title-editorial font-bold">
                <AnimatedCounter value={500} suffix="+" />
              </span>
              <div className="text-left flex flex-col">
                <span className="font-label-caps text-[10px] uppercase text-outline font-semibold">Pieces Done</span>
                <span className="font-body-sm text-xs text-on-surface-variant">Since 2014</span>
              </div>
            </div>

            <div className="flex items-center gap-4 px-4 py-2 bg-surface-container-low/50 border-y md:border-y-0 md:border-x border-surface-container-highest/60">
              <Verified className="w-8 h-8 text-primary shrink-0" />
              <div className="text-left flex flex-col">
                <span className="font-label-caps text-[10px] uppercase text-outline font-semibold">Fully Sterile</span>
                <span className="font-body-sm text-xs text-on-surface-variant">Class-B autoclave, every time</span>
              </div>
            </div>

            <div className="flex items-center gap-4 px-4 py-2">
              <div className="flex items-center gap-1.5 text-secondary">
                <span className="font-title-editorial text-3xl sm:text-4xl text-on-surface font-bold">
                  <AnimatedCounter value={4.9} decimals={1} />
                </span>
                <Star className="w-5 h-5 fill-secondary text-secondary" />
              </div>
              <div className="text-left flex flex-col">
                <span className="font-label-caps text-[10px] uppercase text-outline font-semibold">Average Rating</span>
                <span className="font-body-sm text-xs text-on-surface-variant">Across reviews</span>
              </div>
            </div>
          </motion.div>

          {/* Scroll Down Trigger */}
          <button
            onClick={() => scrollToSection('services-section')}
            className="mt-10 flex flex-col items-center gap-1 text-outline hover:text-primary transition-colors cursor-pointer group"
          >
            <span className="font-label-caps text-[9px] uppercase tracking-[0.25em] group-hover:text-on-surface transition-colors">
              Browse Services
            </span>
            <ChevronDown className="w-4 h-4 text-primary" />
          </button>
        </motion.div>
      </section>

      {/* SECTION 02: MASTER SERVICES & DISCIPLINES */}
      <section
        id="services-section"
        className="w-full py-24 px-4 md:px-8 lg:px-12 bg-surface relative"
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header with Scroll Reveal */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
          >
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="w-8 h-[2px] bg-primary" />
                <span className="font-label-caps text-xs uppercase text-primary tracking-[0.25em]">
                  WHAT WE DO
                </span>
              </div>
              <h2 className="font-headline-xl text-3xl sm:text-4xl md:text-5xl text-on-surface uppercase font-bold tracking-tight">
                Tattoos &amp; Piercings, Done Right
              </h2>
            </div>
            <p className="font-body-md text-sm text-on-surface-variant max-w-sm leading-relaxed">
              Designs are drawn to fit your body, not stamped on flat. Every appointment is fully sterile, from the work surface to the single-use cartridges.
            </p>
          </motion.div>

          {/* 4-Column Service Matrix with Staggered Scroll Animation */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES_DATA.map((service, idx) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="group flex flex-col bg-surface-container p-6 shadow-xl hover:bg-surface-container-high transition-all duration-400 gothic-card border border-surface-container-highest/60 hover:border-primary/40"
              >
                <div className="w-full h-48 mb-4 overflow-hidden bg-surface-container-lowest relative">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover interactive-img-zoom"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-surface-container-lowest/80 backdrop-blur-sm text-[10px] font-label-data uppercase text-outline border border-surface-container-highest">
                    {service.subtitle}
                  </div>
                </div>

                <div className="flex items-center justify-between text-outline mb-2">
                  <span className="font-label-data text-xs uppercase font-semibold">
                    Service // {service.disciplineNumber}
                  </span>
                  <div className="text-outline group-hover:text-primary transition-colors">
                    {getServiceIcon(service.iconName)}
                  </div>
                </div>

                <h3 className="font-headline-sm text-xl text-on-surface uppercase mb-2 transition-colors duration-300 group-hover:text-primary font-bold">
                  {service.title}
                </h3>

                <p className="font-body-sm text-xs text-on-surface-variant mb-6 flex-1 leading-relaxed">
                  {service.description}
                </p>

                {/* Service Specs */}
                <div className="space-y-1 mb-4 pt-3 border-t border-surface-container-highest/60">
                  {service.specs.map((spec, i) => (
                    <div key={i} className="flex justify-between text-[11px] font-label-data">
                      <span className="text-outline">{spec.label}:</span>
                      <span className="text-on-surface font-semibold">{spec.value}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => onNavigate('booking')}
                  className="inline-flex items-center justify-between w-full pt-3 border-t border-surface-container-highest/60 font-label-caps text-xs uppercase tracking-wider text-primary group-hover:text-on-surface transition-colors"
                >
                  <span>Book This Service</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 03: FEATURED PORTFOLIO MONOGRAPH SHOWCASE */}
      <section
        id="relics-section"
        className="w-full py-24 px-4 md:px-8 lg:px-12 bg-surface-container-lowest border-t border-surface-container-highest/40"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12"
          >
            <div>
              <div className="font-label-caps text-xs uppercase text-primary tracking-[0.25em] mb-1">
                PORTFOLIO
              </div>
              <h2 className="font-headline-xl text-3xl sm:text-4xl md:text-5xl text-on-surface uppercase font-bold">
                Recent Work
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: 'All Works' },
                { id: 'blackwork', label: 'Blackwork' },
                { id: 'portraits', label: 'Portraits' },
                { id: 'piercings', label: 'Titanium Piercings' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedPortfolioCategory(tab.id)}
                  className={`px-4 py-2 font-label-caps text-xs uppercase tracking-wider transition-all border ${
                    selectedPortfolioCategory === tab.id
                      ? 'bg-primary-container text-on-surface border-primary shadow-md'
                      : 'bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high border-surface-container-highest'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Mosaic Grid with Scroll Reveal */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPortfolio.map((piece, idx) => (
              <motion.div
                key={piece.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="group relative bg-surface-container overflow-hidden shadow-2xl flex flex-col gothic-card border border-surface-container-highest hover:border-primary/30"
              >
                <div
                  onClick={() => onSelectPiece(piece)}
                  className="relative w-full h-80 overflow-hidden cursor-pointer"
                >
                  <img
                    src={piece.image}
                    alt={piece.title}
                    className="w-full h-full object-cover interactive-img-zoom"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-surface-container-lowest/85 backdrop-blur-sm text-on-surface-variant font-label-caps text-[10px] uppercase tracking-widest border border-surface-container-highest">
                    {piece.healingState}
                  </div>
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 bg-surface-container-lowest/90 text-on-surface font-label-data text-[10px] uppercase">
                    View
                  </div>
                </div>

                <div className="p-5 flex flex-col justify-between bg-surface-container">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-title-editorial text-lg uppercase text-on-surface group-hover:text-primary transition-colors font-bold">
                      {piece.title}
                    </span>
                    <span className="font-label-data text-xs text-outline">
                      {piece.artist}
                    </span>
                  </div>
                  <p className="font-body-sm text-xs text-on-surface-variant mb-4 line-clamp-2 leading-relaxed">
                    {piece.description}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-surface-container-highest/60">
                    <span className="font-label-caps text-[10px] text-outline uppercase tracking-wider">
                      {piece.zone}
                    </span>
                    <button
                      onClick={() => onSelectPiece(piece)}
                      className="px-3.5 py-1.5 bg-surface-container-high hover:bg-primary-container text-on-surface font-label-caps text-xs uppercase tracking-wider transition-all duration-300"
                    >
                      View Piece
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <button
              onClick={() => onNavigate('portfolio')}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-caps text-xs uppercase tracking-widest border border-surface-container-highest transition-all"
            >
              <span>View Full Portfolio</span>
              <ArrowRight className="w-4 h-4 text-primary" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* SECTION 04: SHOP SPOTLIGHT */}
      <section
        id="apothecary-section"
        className="w-full py-24 px-4 md:px-8 lg:px-12 bg-surface-container-low border-t border-surface-container-highest/40"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-5 space-y-6"
            >
              <div className="inline-flex items-center gap-2">
                <span className="font-label-caps text-xs uppercase text-primary tracking-[0.25em]">
                  SHOP
                </span>
              </div>

              <h2 className="font-headline-xl text-3xl sm:text-4xl text-on-surface uppercase leading-tight font-bold">
                Supplies &amp; Aftercare
              </h2>

              <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                The same equipment and aftercare we use in the studio, available to take home — cartridges, machines, and balm made for proper healing.
              </p>

              {/* Studio standards */}
              <div className="p-5 bg-surface-container space-y-4 shadow-xl border border-outline-variant/30">
                <div className="flex items-start gap-3">
                  <Verified className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-label-caps text-xs uppercase text-on-surface block">
                      Full Sterility, Every Appointment
                    </span>
                    <span className="font-body-sm text-xs text-on-surface-variant">
                      Class-B autoclave, single-use cartridges, and fresh barriers on all surfaces.
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-label-caps text-xs uppercase text-on-surface block">
                      Implant-Grade Materials Only
                    </span>
                    <span className="font-body-sm text-xs text-on-surface-variant">
                      Titanium and solid gold for piercings — nothing less, nothing reactive.
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('equipment')}
                  className="group inline-flex items-center gap-2 px-6 py-3 bg-surface-container-highest text-on-surface font-label-caps text-xs uppercase tracking-widest hover:bg-primary-container transition-all duration-300 btn-gothic-glow border border-outline-variant/40"
                >
                  <span>Shop Equipment &amp; Aftercare</span>
                  <ShoppingBag className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                </button>
              </div>
            </motion.div>

            {/* Equipment Showcase */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {PRODUCTS_DATA.slice(0, 2).map((prod, idx) => (
                <motion.div
                  key={prod.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                  className="group bg-surface-container p-5 shadow-xl flex flex-col justify-between gothic-card border border-surface-container-highest/70 hover:border-primary/25"
                >
                  <div className="w-full h-44 mb-3 overflow-hidden bg-surface-container-lowest relative">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover interactive-img-zoom"
                    />
                  </div>
                  <div>
                    <span className="font-label-caps text-[10px] text-primary uppercase block">
                      {prod.category}
                    </span>
                    <h4 className="font-title-editorial text-base text-on-surface uppercase mb-1 group-hover:text-primary transition-colors truncate font-bold">
                      {prod.name}
                    </h4>
                    <p className="font-body-sm text-xs text-outline mb-4 line-clamp-2">
                      {prod.description}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-surface-container-highest/60">
                      <span className="font-label-data text-sm text-on-surface font-bold">
                        ${prod.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => onAddToCart(prod)}
                        className="px-3.5 py-1.5 bg-surface-container-high hover:bg-on-surface hover:text-surface font-label-caps text-xs uppercase transition-all duration-300 flex items-center gap-1"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Acquire</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 05: COLLECTOR TESTIMONIALS */}
      <section
        id="testimonials-section"
        className="w-full py-24 px-4 md:px-8 lg:px-12 bg-surface border-t border-surface-container-highest/40"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-2xl mx-auto mb-16 space-y-2"
          >
            <span className="font-label-caps text-xs uppercase text-primary tracking-[0.25em]">
              CLIENT REVIEWS
            </span>
            <h2 className="font-headline-xl text-3xl sm:text-4xl md:text-5xl text-on-surface uppercase font-bold">
              What Clients Say
            </h2>
            <p className="font-body-md text-sm text-on-surface-variant">
              Unedited feedback from people who've sat in our chair.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS_DATA.map((t, idx) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: idx * 0.12 }}
                className="bg-surface-container p-6 sm:p-8 flex flex-col justify-between shadow-xl gothic-card border border-surface-container-highest hover:border-primary/20"
              >
                <div>
                  <div className="flex items-center gap-1 text-secondary mb-4">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                    ))}
                  </div>
                  <p className="font-body-md text-sm text-on-surface leading-relaxed mb-6 italic">
                    "{t.quote}"
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-surface-container-highest/60">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover shrink-0 border border-outline-variant"
                  />
                  <div className="flex flex-col">
                    <span className="font-title-editorial text-sm text-on-surface font-bold">
                      {t.name}
                    </span>
                    <span className="font-label-caps text-[10px] text-outline uppercase">
                      {t.role}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 06: LOCATION, HOURS & SECURITY ADVISORY */}
      <section
        id="location-section"
        className="w-full py-24 px-4 md:px-8 lg:px-12 bg-surface-container-lowest border-t border-surface-container-highest/40"
      >
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Security Notice Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full p-5 sm:p-6 bg-error-container/20 text-on-surface flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl border border-error/30"
          >
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-error-container text-on-error-container shrink-0 mt-0.5">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <div className="font-label-caps text-xs uppercase text-error tracking-wider mb-1 font-bold">
                  Anti-Scam Notice — Please Read
                </div>
                <p className="font-body-sm text-xs text-on-surface-variant max-w-3xl leading-relaxed">
                  Scammers sometimes impersonate Marvin Tattoos on Instagram and try to collect deposits. We never request payment through direct messages. Bookings are made only through this site or our official WhatsApp.
                </p>
              </div>
            </div>
            <button
              onClick={onOpenVerify}
              className="shrink-0 px-4 py-2 bg-error-container text-on-error-container font-label-caps text-xs uppercase tracking-widest hover:bg-error hover:text-on-error transition-all"
            >
              Verify Channel
            </button>
          </motion.div>

          {/* Location & Operating Schedule */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Atelier Address View */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-7 flex flex-col bg-surface-container overflow-hidden shadow-2xl gothic-card border border-surface-container-highest hover:border-primary/20"
            >
              <div
                className="w-full h-80 sm:h-96 relative bg-cover bg-center"
                style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDREC5pLTdXJO9fp7vuWhpIAppPWmY4qSTJFCXzqlUcHi3fZn0gVE-noAZzaS8SEDDLh1lZ4oFoupXQ5NuT2OZdFMFRBi9bf1rXRgjL5JVQDM5eOljrx_syn6Z_sjQ5Q3bz0ZjyL8BL1VfcSpTQSddMSSp_sHB62jK0ST79vxxgbvglq3jteejwFoma9kAsCXzziKmSSyrh11T-SMQQ4TL_pVcDo1x_MBWIVx9omsFuPYnfkoalDF-y7g')` }}
              >
                <div className="absolute inset-0 bg-surface-container-lowest/40" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="p-3.5 bg-primary-container text-on-surface rounded-full shadow-2xl border border-primary/40">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <span className="font-label-caps text-xs uppercase bg-surface-container-lowest px-3 py-1 text-on-surface mt-2 shadow-xl border border-outline-variant/40">
                    Marvin Tattoos — New York
                  </span>
                </div>
              </div>
              <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface-container">
                <div>
                  <div className="font-title-editorial text-base uppercase text-on-surface font-bold">
                    Studio Address
                  </div>
                  <div className="font-body-sm text-xs text-on-surface-variant">
                    04 Obsidian Alley, Floor 03 — Cultural Quarter, New York
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('location')}
                  className="px-4 py-2 bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-caps text-xs uppercase tracking-wider transition-all flex items-center gap-2 border border-surface-container-highest"
                >
                  <MapPin className="w-4 h-4 text-secondary" />
                  <span>Directions</span>
                </button>
              </div>
            </motion.div>

            {/* Operating Hours Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-5 flex flex-col justify-between bg-surface-container p-6 sm:p-8 shadow-2xl gothic-card border border-surface-container-highest hover:border-primary/20"
            >
              <div className="space-y-6">
                <div className="space-y-1">
                  <span className="font-label-caps text-xs uppercase text-primary tracking-[0.25em]">
                    HOURS
                  </span>
                  <h3 className="font-headline-lg text-2xl text-on-surface uppercase font-bold">
                    Operating Hours
                  </h3>
                </div>

                <div className="space-y-2 font-label-data text-xs">
                  <div className="flex justify-between items-center py-2.5 bg-surface-container-low/50 px-3 border border-surface-container-highest/60">
                    <span className="text-on-surface">Tuesday — Friday</span>
                    <span className="text-on-surface-variant font-bold">11:00 — 21:00</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 bg-surface-container-high px-3 border border-surface-container-highest/60">
                    <div className="flex items-center gap-2">
                      <span className="text-secondary font-bold">Saturday</span>
                      <span className="px-1.5 py-0.5 bg-secondary text-on-secondary font-label-caps text-[9px] uppercase">
                        Walk-Ins
                      </span>
                    </div>
                    <span className="text-secondary font-bold">11:00 — 21:00</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 bg-surface-container-low px-3 border border-surface-container-highest/60">
                    <span className="text-on-surface">Sunday</span>
                    <span className="text-on-surface-variant">12:00 — 18:00 (Private)</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 bg-surface-container-lowest px-3 text-outline border border-surface-container-highest/40">
                    <span>Monday</span>
                    <span className="uppercase font-label-caps text-[10px]">Closed</span>
                  </div>
                </div>

                <div className="p-3.5 bg-surface-container-low space-y-1 border-l-2 border-secondary">
                  <div className="font-label-caps text-xs uppercase text-secondary font-bold">
                    Walk-In Policy
                  </div>
                  <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                    Walk-ins are welcome on Saturdays. Flash sheets go up at 10:45 AM and slots fill on a first-come basis.
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => onNavigate('booking')}
                  className="w-full py-3.5 bg-primary-container text-on-surface font-label-caps text-xs uppercase tracking-[0.2em] shadow-xl btn-gothic-glow flex items-center justify-center gap-2 border border-primary/30"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book a Consultation</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};
