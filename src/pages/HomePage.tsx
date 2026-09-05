import React, { useState, useEffect, useRef } from 'react';
import { PageView, PortfolioPiece, ProductItem } from '../types';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { EmberParticles } from '../components/EmberParticles';
import { SERVICES_DATA, PORTFOLIO_DATA, PRODUCTS_DATA, TESTIMONIALS_DATA, HERO_IMAGE } from '../data/atelierData';
import { 
  Sparkles, 
  Calendar, 
  ArrowRight, 
  Verified, 
  Star, 
  ShoppingBag, 
  MapPin, 
  Clock, 
  ShieldAlert, 
  Skull, 
  FileText, 
  Syringe, 
  Layers, 
  ChevronDown,
  Activity
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageView) => void;
  onSelectPiece: (piece: PortfolioPiece) => void;
  onAddToCart: (product: ProductItem) => void;
  onOpenWhatsApp: () => void;
  onOpenVerify: () => void;
}

// Section metadata for the interactive scroll spy & right flank
const SECTIONS = [
  { id: 'hero-sanctum', index: '01', label: 'Sanctum Hero' },
  { id: 'services-section', index: '02', label: 'Master Disciplines' },
  { id: 'relics-section', index: '03', label: 'Curated Relics' },
  { id: 'apothecary-section', index: '04', label: 'Pro Apothecary' },
  { id: 'testimonials-section', index: '05', label: 'Collector Lore' },
  { id: 'location-section', index: '06', label: 'Sanctum Coordinates' }
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
      // Ease out cubic
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
  const [activeSectionIndex, setActiveSectionIndex] = useState<string>('01');
  const [selectedPortfolioCategory, setSelectedPortfolioCategory] = useState<string>('all');
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax scroll hooks
  const { scrollY, scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Hero parallax transformations
  const heroBgY = useTransform(scrollY, [0, 800], [0, 240]);
  const heroOpacity = useTransform(scrollY, [0, 600], [0.75, 0.1]);
  const heroScale = useTransform(scrollY, [0, 800], [1.05, 1.2]);
  const heroTextY = useTransform(scrollY, [0, 600], [0, 100]);

  // ScrollSpy listener to update the active index number smoothly
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.35;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const sectionEl = document.getElementById(SECTIONS[i].id);
        if (sectionEl) {
          const top = sectionEl.offsetTop;
          if (scrollPosition >= top) {
            setActiveSectionIndex(SECTIONS[i].index);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

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

      {/* Floating Right Flank Dynamic Section Indicator (Scroll Spy) */}
      <aside aria-label="Page Section Index" className="hidden xl:flex flex-col items-center gap-4 fixed right-8 top-1/2 -translate-y-1/2 z-40 bg-surface-container-lowest/80 backdrop-blur-md p-3 border border-surface-container-highest/60 shadow-2xl">
        <div className="flex flex-col items-center gap-1 text-[10px] font-label-caps text-outline uppercase tracking-wider mb-1">
          <Activity className="w-3.5 h-3.5 text-secondary animate-pulse" />
          <span>INDEX</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          {SECTIONS.map((sec) => {
            const isActive = activeSectionIndex === sec.index;
            return (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className="group relative flex items-center justify-end w-full py-1 text-right focus:outline-none"
              >
                {/* Floating tooltip on hover */}
                <span className="absolute right-9 px-2 py-0.5 bg-surface-container-high text-on-surface font-label-caps text-[9px] uppercase tracking-wider whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-surface-container-highest pointer-events-none shadow-lg">
                  {sec.label}
                </span>

                <div className="flex items-center gap-2">
                  <span
                    className={`font-label-data text-xs transition-all duration-300 ${
                      isActive
                        ? 'text-primary font-bold text-sm scale-110 drop-shadow-[0_0_8px_rgba(255,179,173,0.8)]'
                        : 'text-outline/40 hover:text-on-surface'
                    }`}
                  >
                    {sec.index}
                  </span>
                  <div
                    className={`transition-all duration-300 ${
                      isActive
                        ? 'w-4 h-[2px] bg-primary'
                        : 'w-1.5 h-[1px] bg-outline/20 group-hover:bg-outline/60'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        <div className="w-[1px] h-8 bg-surface-container-highest mt-1" />
        <span className="font-label-caps text-[8px] uppercase tracking-[0.2em] text-outline [writing-mode:vertical-rl] rotate-180">
          SEC {activeSectionIndex}
        </span>
      </aside>

      {/* HERO SECTION: Dark Gothic Editorial Impact */}
      <section
        id="hero-sanctum"
        className="relative w-full min-h-[95vh] flex items-center justify-center overflow-hidden pt-28 pb-20 bg-surface-container-lowest"
      >
        {/* Floating Atmospheric Embers */}
        <EmberParticles />

        {/* Cinematic Visual Backdrop with Parallax */}
        <motion.div
          className="absolute inset-0 w-full h-full bg-cover bg-center mix-blend-luminosity will-change-transform"
          style={{
            backgroundImage: `url('${HERO_IMAGE}')`,
            backgroundPosition: 'center 30%',
            y: heroBgY,
            scale: heroScale,
            opacity: heroOpacity
          }}
        />

        {/* Radial Dark Vignette & Crimson Mist Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/60 to-surface-container-lowest/80 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-surface-container-lowest via-transparent to-surface-container-lowest pointer-events-none" />
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-container/20 rounded-full blur-[120px] pointer-events-none animate-pulse"
          style={{ animationDuration: '6s' }}
        />

        {/* Vertical Accent Label */}
        <div className="hidden xl:block absolute left-12 bottom-16 z-20 [writing-mode:vertical-rl] rotate-180">
          <span className="font-label-caps text-[10px] tracking-[0.3em] uppercase text-outline/70">
            Sanctum Sanctorum // Codex Est. 2014
          </span>
        </div>

        {/* Hero Content Container */}
        <motion.div
          style={{ y: heroTextY }}
          className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center"
        >
          {/* Atelier Provenance Pill */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-surface-container/80 backdrop-blur-md rounded-full mb-4 shadow-xl pulse-badge border border-outline-variant/30"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-ping" />
            <span className="font-label-caps text-[10px] sm:text-xs text-on-surface-variant uppercase tracking-[0.25em]">
              Master Crafted Body Art &amp; Precision Piercings
            </span>
          </motion.div>

          {/* Grand Gothic Headline Stack with Breathing Aura */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-on-surface mb-2 leading-none gothic-aura-title font-gothic tracking-wider"
          >
            Marvin Tattoos
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="text-2xl sm:text-3xl md:text-4xl text-primary mb-6 gothic-aura-sub font-gothic tracking-widest"
          >
            Piercing Atelier
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="font-body-lg text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            Where subterranean ritualistic discipline merges with surgical sterile precision. Curating permanent flesh narratives, hyper-realism relics, and bespoke titanium modifications.
          </motion.p>

          {/* Action Ritual CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
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
              <span className="w-2 h-2 rounded-full bg-secondary group-hover:animate-ping" />
              <span>WhatsApp Direct</span>
            </button>
          </motion.div>

          {/* Quick Stats Monolith Bar with Animated Numbers */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.55 }}
            className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4 bg-surface-container/80 backdrop-blur-xl p-5 shadow-2xl border border-outline-variant/40 transition-all duration-300 hover:border-primary/50"
          >
            <div className="flex items-center gap-4 px-4 py-2 transition-transform duration-300 hover:translate-x-1">
              <span className="font-headline-md text-3xl sm:text-4xl text-on-surface font-title-editorial font-bold">
                <AnimatedCounter value={12000} suffix="+" />
              </span>
              <div className="text-left flex flex-col">
                <span className="font-label-caps text-[10px] uppercase text-outline font-semibold">Artefacts Inked</span>
                <span className="font-body-sm text-xs text-on-surface-variant">Uncompromising needle craft</span>
              </div>
            </div>

            <div className="flex items-center gap-4 px-4 py-2 bg-surface-container-low/50 transition-transform duration-300 hover:translate-x-1 border-y md:border-y-0 md:border-x border-surface-container-highest/60">
              <Verified className="w-8 h-8 text-primary transition-transform duration-300 hover:scale-110 shrink-0" />
              <div className="text-left flex flex-col">
                <span className="font-label-caps text-[10px] uppercase text-outline font-semibold">Clinical Grade</span>
                <span className="font-body-sm text-xs text-on-surface-variant">100% Sterile &amp; Certified</span>
              </div>
            </div>

            <div className="flex items-center gap-4 px-4 py-2 transition-transform duration-300 hover:translate-x-1">
              <div className="flex items-center gap-1.5 text-secondary">
                <span className="font-title-editorial text-3xl sm:text-4xl text-on-surface font-bold">
                  <AnimatedCounter value={4.9} decimals={1} />
                </span>
                <Star className="w-5 h-5 fill-secondary text-secondary" />
              </div>
              <div className="text-left flex flex-col">
                <span className="font-label-caps text-[10px] uppercase text-outline font-semibold">Verified Lore</span>
                <span className="font-body-sm text-xs text-on-surface-variant">From 3,400+ collectors</span>
              </div>
            </div>
          </motion.div>

          {/* Scroll Down Trigger */}
          <button
            onClick={() => scrollToSection('services-section')}
            className="mt-10 flex flex-col items-center gap-1 scroll-indicator-bounce text-outline hover:text-primary transition-colors cursor-pointer group"
          >
            <span className="font-label-caps text-[9px] uppercase tracking-[0.25em] group-hover:text-on-surface transition-colors">
              Explore Codex
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
                  DISCIPLINE MATRIX // 02
                </span>
              </div>
              <h2 className="font-headline-xl text-3xl sm:text-4xl md:text-5xl text-on-surface uppercase font-bold tracking-tight">
                Surgical Discipline &amp; Avant-Garde Ink
              </h2>
            </div>
            <p className="font-body-md text-sm text-on-surface-variant max-w-sm leading-relaxed">
              Every incision and needle pass respects human anatomy. We formulate tailored pigments, anatomical flows, and autoclave-certified piercings.
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
                    Discipline // {service.disciplineNumber}
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
                  <span>Book This Discipline</span>
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
                CURATED ARCHIVE // 03
              </div>
              <h2 className="font-headline-xl text-3xl sm:text-4xl md:text-5xl text-on-surface uppercase font-bold">
                Healed Relics &amp; Flesh Works
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
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-surface-container-lowest/85 backdrop-blur-sm text-secondary font-label-caps text-[10px] uppercase tracking-widest border border-secondary/30">
                    {piece.healingState}
                  </div>
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 bg-surface-container-lowest/90 text-on-surface font-label-data text-[10px] uppercase">
                    Tap to Inspect
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
                      Flash ID: {piece.flashId}
                    </span>
                    <button
                      onClick={() => onSelectPiece(piece)}
                      className="px-3.5 py-1.5 bg-surface-container-high hover:bg-primary-container text-on-surface font-label-caps text-xs uppercase tracking-wider transition-all duration-300 hover:shadow-[0_0_15px_rgba(138,11,20,0.5)]"
                    >
                      Book Similar
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
              <span>Explore Complete 840+ Archive Codex</span>
              <ArrowRight className="w-4 h-4 text-primary" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* SECTION 04: EQUIPMENT & APOTHECARY SPOTLIGHT */}
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
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                <span className="font-label-caps text-xs uppercase text-secondary tracking-[0.25em]">
                  HARD GOODS &amp; APOTHECARY // 04
                </span>
              </div>

              <h2 className="font-headline-xl text-3xl sm:text-4xl text-on-surface uppercase leading-tight font-bold">
                Surgical Discipline In Every Needle &amp; Balm
              </h2>

              <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                Our private line of studio-engineered supplies, medical-grade membrane cartridges, and botanical healing salves developed for optimal pigment retention and cellular recovery.
              </p>

              {/* Metric Inline Gauge Bars */}
              <div className="p-5 bg-surface-container space-y-3 shadow-xl border border-outline-variant/30">
                <div className="flex justify-between items-center font-label-caps text-xs uppercase">
                  <span className="text-on-surface">Pigment Retention Rate</span>
                  <span className="text-primary font-label-data font-bold">
                    <AnimatedCounter value={98.4} suffix="%" decimals={1} />
                  </span>
                </div>
                <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '98.4%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="h-full bg-primary-container"
                  />
                </div>

                <div className="flex justify-between items-center font-label-caps text-xs uppercase pt-2">
                  <span className="text-on-surface">Autoclave Sterility Index</span>
                  <span className="text-secondary font-label-data font-bold">100% Class-B</span>
                </div>
                <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
                    className="h-full bg-secondary"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('equipment')}
                  className="group inline-flex items-center gap-2 px-6 py-3 bg-surface-container-highest text-on-surface font-label-caps text-xs uppercase tracking-widest hover:bg-primary-container transition-all duration-300 btn-gothic-glow border border-outline-variant/40"
                >
                  <span>Explore Supplies Store</span>
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
              VERIFIED CHRONICLES // 05
            </span>
            <h2 className="font-headline-xl text-3xl sm:text-4xl md:text-5xl text-on-surface uppercase font-bold">
              The Collector's Voice
            </h2>
            <p className="font-body-md text-sm text-on-surface-variant">
              Unvarnished feedback from patrons who have committed their skin to our sanctum.
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
              <div className="p-2.5 bg-error-container text-on-error-container shrink-0 mt-0.5 pulse-badge">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <div className="font-label-caps text-xs uppercase text-error tracking-wider mb-1 font-bold">
                  Official Verification Protocol &amp; Anti-Scam Notice
                </div>
                <p className="font-body-sm text-xs text-on-surface-variant max-w-3xl leading-relaxed">
                  Imposter accounts frequently impersonate Marvin Tattoos on Instagram soliciting deposit wire transfers. We NEVER request funds through unauthorized DMs. Only verified bookings and official WhatsApp desk are honored.
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
                  <div className="p-3.5 bg-primary-container text-on-surface rounded-full shadow-2xl animate-bounce border border-primary/40">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <span className="font-label-caps text-xs uppercase bg-surface-container-lowest px-3 py-1 text-on-surface mt-2 shadow-xl border border-outline-variant/40">
                    Marvin Sanctuary Bay // 06
                  </span>
                </div>
              </div>
              <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface-container">
                <div>
                  <div className="font-title-editorial text-base uppercase text-on-surface font-bold">
                    Sanctum Address
                  </div>
                  <div className="font-body-sm text-xs text-on-surface-variant">
                    04 Obsidian Alley, Floor 03 — Cultural Quarter // Design Void
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('location')}
                  className="px-4 py-2 bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-caps text-xs uppercase tracking-wider transition-all flex items-center gap-2 border border-surface-container-highest"
                >
                  <MapPin className="w-4 h-4 text-secondary" />
                  <span>Inspect Transit Guide</span>
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
                    ATELIER TIMETABLE
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
                  <div className="flex justify-between items-center py-2.5 bg-surface-container-high px-3 border border-secondary/30">
                    <div className="flex items-center gap-2">
                      <span className="text-secondary font-bold">Saturday</span>
                      <span className="px-1.5 py-0.5 bg-secondary text-on-secondary font-label-caps text-[9px] uppercase pulse-badge">
                        Walk-Ins Open
                      </span>
                    </div>
                    <span className="text-secondary font-bold">11:00 — 21:00</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 bg-surface-container-low/50 px-3 border border-surface-container-highest/60">
                    <span className="text-on-surface">Sunday</span>
                    <span className="text-on-surface-variant">12:00 — 18:00 (Private)</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 bg-surface-container-lowest px-3 text-outline border border-surface-container-highest/40">
                    <span>Monday</span>
                    <span className="uppercase font-label-caps text-[10px]">Aseptic Protocol / Closed</span>
                  </div>
                </div>

                <div className="p-3.5 bg-surface-container-low space-y-1 border-l-2 border-secondary">
                  <div className="font-label-caps text-xs uppercase text-secondary font-bold">
                    Walk-in Policy Notice
                  </div>
                  <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                    Walk-in appointments are dedicated exclusively to Saturdays on a first-arrived basis. Flash book opens at 10:45 AM sharp.
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => onNavigate('booking')}
                  className="w-full py-3.5 bg-primary-container text-on-surface font-label-caps text-xs uppercase tracking-[0.2em] shadow-xl btn-gothic-glow flex items-center justify-center gap-2 border border-primary/30"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Reserve Consultation Date</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};
