import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageView, PortfolioPiece, ProductItem } from '../types';
import { SERVICES_DATA, PORTFOLIO_DATA, PRODUCTS_DATA, TESTIMONIALS_DATA, HERO_IMAGE } from '../data/atelierData';
import { 
  Calendar, 
  ArrowRight, 
  ShieldCheck, 
  Star, 
  ShoppingBag, 
  MapPin, 
  Skull, 
  FileText, 
  Syringe, 
  Layers, 
  MessageCircle,
  Sparkles,
  CheckCircle2,
  Navigation,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Phone
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageView) => void;
  onSelectPiece: (piece: PortfolioPiece) => void;
  onAddToCart: (product: ProductItem) => void;
  onOpenWhatsApp: () => void;
  onOpenVerify: () => void;
}

// Founder Portrait: Black & White by default, Full Color Reveal on Hover
const MarvinPortraitLens: React.FC = () => {
  return (
    <div 
      className="relative w-full h-[480px] sm:h-[540px] lg:h-[600px] bg-noir-900 border border-noir-700 overflow-hidden group select-none cursor-pointer"
    >
      {/* Marvin's Portrait: High-Contrast Black & White by default, Full Vibrant Color on hover */}
      <img
        src="/images/marvin-founder.png"
        alt="Marvin - Founder & Resident Tattooist"
        className="absolute inset-0 w-full h-full object-cover object-[center_15%] scale-110 filter grayscale contrast-125 brightness-95 transition-all duration-700 ease-out group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100 group-hover:scale-[1.14]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-noir-950 via-transparent to-noir-950/20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none" />

      {/* Bottom Name & Story Overlay */}
      <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-noir-950 via-noir-950/85 to-transparent z-20 space-y-2 pointer-events-none">
        <div className="flex items-end justify-between">
          <div>
            <span className="font-label-caps text-[10px] text-crimson-light uppercase tracking-widest block">
              Tattoo &amp; Piercing Shop · Kampala, Uganda
            </span>
            <h3 className="font-headline-sm text-2xl sm:text-3xl text-bone uppercase font-bold tracking-tight">
              Marvin
            </h3>
            <p className="font-body-sm text-xs text-bone-muted leading-tight">
              Tattooist &amp; Former Surgical Trauma Technician
            </p>
          </div>
          <div className="text-right">
            <span className="font-label-data text-base font-bold text-bone block">
              14+ Yrs
            </span>
            <span className="font-label-caps text-[9px] text-bone-dim uppercase">
              Experience
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectPiece,
  onAddToCart,
  onOpenWhatsApp,
  onOpenVerify
}) => {
  const [selectedPortfolioCategory, setSelectedPortfolioCategory] = useState<string>('all');
  const [reviewIndex, setReviewIndex] = useState<number>(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState<boolean>(false);

  // Auto-animate reviews every 4.5 seconds (pauses on user hover)
  useEffect(() => {
    if (isCarouselPaused) return;
    const interval = setInterval(() => {
      setReviewIndex((prev) => (prev + 1) % TESTIMONIALS_DATA.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isCarouselPaused]);

  const nextReview = () => {
    setReviewIndex((prev) => (prev + 1) % TESTIMONIALS_DATA.length);
  };

  const prevReview = () => {
    setReviewIndex((prev) => (prev - 1 + TESTIMONIALS_DATA.length) % TESTIMONIALS_DATA.length);
  };

  // Get 3 consecutive reviews for carousel window
  const visibleTestimonials = [0, 1, 2].map(
    (offset) => TESTIMONIALS_DATA[(reviewIndex + offset) % TESTIMONIALS_DATA.length]
  );

  const getInitialAvatarStyle = (name: string) => {
    const code = name.charCodeAt(0) || 0;
    const styles = [
      'bg-crimson/20 border-crimson/60 text-crimson-light group-hover:bg-crimson group-hover:text-bone',
      'bg-gold/20 border-gold/60 text-gold group-hover:bg-gold group-hover:text-noir-950',
      'bg-amber-500/20 border-amber-500/60 text-amber-300 group-hover:bg-amber-500 group-hover:text-noir-950',
      'bg-rose-900/30 border-rose-600/60 text-rose-300 group-hover:bg-rose-700 group-hover:text-bone',
      'bg-noir-800 border-bone/40 text-bone group-hover:bg-bone group-hover:text-noir-950'
    ];
    return styles[code % styles.length];
  };

  const filteredPortfolio = selectedPortfolioCategory === 'all'
    ? PORTFOLIO_DATA.slice(0, 6)
    : PORTFOLIO_DATA.filter(item => {
        if (selectedPortfolioCategory === 'blackwork') return item.category === 'dark-realism';
        if (selectedPortfolioCategory === 'neo-traditional') return item.category === 'neo-traditional';
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
    <div className="w-full flex flex-col bg-noir-950 relative">
      {/* 01. EDITORIAL HERO SECTION */}
      <section className="relative w-full min-h-[92vh] flex items-center overflow-hidden pt-28 pb-16 bg-noir-950 border-b border-noir-700/40">
        {/* Ambient Hero Background */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 filter grayscale contrast-125 scale-105 pointer-events-none"
          style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-noir-950 via-noir-950/80 to-noir-950/65 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-noir-950/75 via-transparent to-noir-950 pointer-events-none" />

        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Studio Editorial Copy & CTAs (7 Cols) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Provenance Badge */}
              <div className="inline-flex items-center gap-3 px-3.5 py-1.5 bg-noir-850 border border-crimson/40">
                <span className="font-label-caps text-xs text-crimson-light tracking-[0.25em] uppercase font-bold">
                  MARVIN TATTOOS
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-crimson-light" />
                <span className="font-label-data text-xs text-bone-muted uppercase tracking-wider">
                  Tattoo and piercing shop in Kampala, Uganda · EST. 2014
                </span>
              </div>

              {/* Festive Script Title */}
              <h1 className="font-festive text-5xl sm:text-6xl md:text-7xl lg:text-[84px] text-bone leading-[1.05] tracking-wide font-normal">
                Clean Lines. Heavy Blackwork. Made to Age Well.
              </h1>

              {/* Real Studio Pitch */}
              <p className="font-body-md text-sm sm:text-base text-bone-muted max-w-2xl leading-relaxed">
                Specializing in dark realism, solid blackwork, and custom tattoo design in Kampala, Uganda. Every piece is drawn to fit your body and tattooed to heal solid for life.
              </p>

              {/* Signature Services Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 bg-noir-900 border border-noir-700/80 space-y-1 hover:border-slate-500 transition-colors">
                  <span className="font-label-caps text-[11px] text-bone uppercase flex items-center gap-1.5 font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-crimson-light shrink-0" /> Realism &amp; Portraits
                  </span>
                  <p className="font-body-sm text-[11px] text-bone-muted leading-relaxed">
                    High-detail black-and-grey and photo-realistic face, animal, or object pieces.
                  </p>
                </div>

                <div className="p-3.5 bg-noir-900 border border-noir-700/80 space-y-1 hover:border-slate-500 transition-colors">
                  <span className="font-label-caps text-[11px] text-bone uppercase flex items-center gap-1.5 font-bold">
                    <FileText className="w-3.5 h-3.5 text-crimson-light shrink-0" /> Minimalist &amp; Script
                  </span>
                  <p className="font-body-sm text-[11px] text-bone-muted leading-relaxed">
                    Fine-line micro-tattoos, geometric continuous line art, and custom calligraphy.
                  </p>
                </div>

                <div className="p-3.5 bg-noir-900 border border-noir-700/80 space-y-1 hover:border-slate-500 transition-colors">
                  <span className="font-label-caps text-[11px] text-bone uppercase flex items-center gap-1.5 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-crimson-light shrink-0" /> Cover-Ups &amp; Removal
                  </span>
                  <p className="font-body-sm text-[11px] text-bone-muted leading-relaxed">
                    Bold tribal patterns, full restorations, and safe laser tattoo removal.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <button
                  onClick={() => onNavigate('booking')}
                  className="w-full sm:w-auto px-8 py-3.5 bg-crimson hover:bg-crimson-hover text-bone font-label-caps text-xs uppercase tracking-[0.2em] transition-colors font-bold border border-crimson/30 flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Consultation</span>
                </button>

                <button
                  onClick={() => onNavigate('portfolio')}
                  className="w-full sm:w-auto px-7 py-3.5 bg-noir-850 hover:bg-noir-800 text-bone font-label-caps text-xs uppercase tracking-wider transition-colors border border-noir-700 flex items-center justify-center gap-2 group"
                >
                  <ArrowRight className="w-4 h-4 text-crimson-light transition-transform group-hover:translate-x-1" />
                  <span>See My Works</span>
                </button>
              </div>

              {/* Quick Metrics with Google Reviews Link */}
              <div className="pt-4 border-t border-noir-700/60 flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-label-data text-bone-dim">
                <div>
                  <strong className="text-bone text-sm">500+</strong> Pieces Inked
                </div>
                <div className="w-1 h-1 rounded-full bg-noir-700" />
                <a
                  href="https://share.google/bUeThSgYN2di6xy2G"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-noir-900 hover:bg-noir-850 border border-noir-700 hover:border-slate-500 rounded transition-all text-bone hover:text-white group"
                  title="View verified reviews on Google"
                >
                  <div className="flex items-center text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  </div>
                  <span>
                    <strong className="text-bone font-bold">4.9/5.0</strong> on Google Reviews
                  </span>
                  <ExternalLink className="w-3 h-3 text-bone-dim group-hover:text-bone transition-colors" />
                </a>
                <div className="w-1 h-1 rounded-full bg-noir-700" />
                <div>
                  <strong className="text-gold text-sm">Saturday</strong> Walk-Ins
                </div>
              </div>
            </div>

            {/* Right Column: Marvin's Portrait Interactive Lens (5 Cols) */}
            <div className="lg:col-span-5 flex justify-center">
              <MarvinPortraitLens />
            </div>
          </div>
        </div>
      </section>

      {/* 02. SERVICES & DISCIPLINES */}
      <section id="services-section" className="w-full py-20 px-4 md:px-8 lg:px-12 bg-noir-900 border-b border-noir-700/40">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-noir-700/40">
            <div className="space-y-2 max-w-xl">
              <span className="font-label-caps text-xs uppercase text-crimson-light tracking-[0.25em]">
                STUDIO DISCIPLINES
              </span>
              <h2 className="font-headline-xl text-3xl sm:text-4xl md:text-5xl text-bone uppercase font-bold tracking-tight">
                Our Core Services
              </h2>
            </div>
            <p className="font-body-md text-sm text-bone-muted max-w-md leading-relaxed">
              Every design is calibrated to how skin heals and moves over time. Transparent pricing, private consultation rooms, and strict sterile protocols.
            </p>
          </div>

          {/* 4-Column Service Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES_DATA.map((service) => (
              <div
                key={service.id}
                className="group flex flex-col bg-noir-850 p-6 transition-colors border border-noir-700 hover:border-slate-500 justify-between"
              >
                <div>
                  <div className="w-full h-48 mb-4 overflow-hidden bg-noir-950 relative border border-noir-700">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover interactive-img-zoom"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-noir-950/90 text-[10px] font-label-data uppercase text-bone-dim border border-noir-700">
                      {service.subtitle}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-bone-dim mb-2">
                    <span className="font-label-data text-xs uppercase font-semibold">
                      Discipline // {service.disciplineNumber}
                    </span>
                    <div className="text-gold">
                      {getServiceIcon(service.iconName)}
                    </div>
                  </div>

                  <h3 className="font-headline-sm text-xl text-bone uppercase mb-2 group-hover:text-white font-bold">
                    {service.title}
                  </h3>

                  <p className="font-body-sm text-xs text-bone-muted mb-6 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div>
                  {/* Service Specs */}
                  <div className="space-y-1 mb-4 pt-3 border-t border-noir-700">
                    {service.specs.map((spec, i) => (
                      <div key={i} className="flex justify-between text-[11px] font-label-data">
                        <span className="text-bone-dim">{spec.label}:</span>
                        <span className="text-bone font-semibold">{spec.value}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => onNavigate('booking')}
                    className="inline-flex items-center justify-between w-full pt-3 border-t border-noir-700 font-label-caps text-xs uppercase tracking-wider text-bone-muted hover:text-bone transition-colors"
                  >
                    <span>Schedule Session</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 03. PORTFOLIO SHOWCASE */}
      <section id="portfolio-section" className="w-full py-20 px-4 md:px-8 lg:px-12 bg-noir-950 border-b border-noir-700/40">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-noir-700">
            <div>
              <span className="font-label-caps text-xs uppercase text-crimson-light tracking-[0.25em] block mb-1">
                HEALED GALLERY
              </span>
              <h2 className="font-headline-xl text-3xl sm:text-4xl md:text-5xl text-bone uppercase font-bold">
                Featured Portfolio
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: 'All Works' },
                { id: 'blackwork', label: 'Dark Realism' },
                { id: 'neo-traditional', label: 'Neo-Traditional' },
                { id: 'piercings', label: 'Piercings' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedPortfolioCategory(tab.id)}
                  className={`px-4 py-2 font-label-caps text-xs uppercase tracking-wider transition-colors border ${
                    selectedPortfolioCategory === tab.id
                      ? 'bg-noir-800 text-bone border-slate-400 font-bold'
                      : 'bg-noir-850 text-bone-muted hover:text-bone border-noir-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPortfolio.map((piece) => (
              <div
                key={piece.id}
                className="group relative bg-noir-850 overflow-hidden flex flex-col border border-noir-700 hover:border-slate-500 transition-colors"
              >
                <div
                  onClick={() => onSelectPiece(piece)}
                  className="relative w-full h-80 overflow-hidden cursor-pointer bg-noir-950"
                >
                  <img
                    src={piece.image}
                    alt={piece.title}
                    className="w-full h-full object-cover interactive-img-zoom"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-noir-950/90 text-bone font-label-caps text-[10px] uppercase tracking-widest border border-noir-700">
                    {piece.healingState}
                  </div>
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 bg-noir-950/90 text-bone font-label-data text-[10px] uppercase border border-noir-700">
                    {piece.zone}
                  </div>
                </div>

                <div className="p-5 flex flex-col justify-between flex-1 bg-noir-850 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-title-editorial text-lg uppercase text-bone font-bold group-hover:text-white">
                        {piece.title}
                      </h4>
                      <span className="font-label-data text-xs text-bone-dim">
                        {piece.artist}
                      </span>
                    </div>
                    <p className="font-body-sm text-xs text-bone-muted line-clamp-2 leading-relaxed">
                      {piece.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-noir-700">
                    <span className="font-label-data text-[11px] text-gold uppercase">
                      {piece.categoryLabel.split('&')[0]}
                    </span>
                    <button
                      onClick={() => onSelectPiece(piece)}
                      className="px-3.5 py-1.5 bg-noir-800 hover:bg-noir-700 text-bone font-label-caps text-xs uppercase tracking-wider transition-colors border border-noir-700"
                    >
                      View Specs
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => onNavigate('portfolio')}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-noir-850 hover:bg-noir-800 text-bone font-label-caps text-xs uppercase tracking-widest border border-noir-700 transition-colors"
            >
              <span>Explore Complete Archives</span>
              <ArrowRight className="w-4 h-4 text-gold" />
            </button>
          </div>
        </div>
      </section>

      {/* 04. EQUIPMENT & AFTERCARE SUPPLIES */}
      <section id="shop-section" className="w-full py-20 px-4 md:px-8 lg:px-12 bg-noir-900 border-b border-noir-700/40">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="font-label-caps text-xs uppercase text-crimson-light tracking-[0.25em] block">
                STUDIO SUPPLIES
              </span>

              <h2 className="font-headline-xl text-3xl sm:text-4xl text-bone uppercase leading-tight font-bold">
                Equipment &amp; Aftercare
              </h2>

              <p className="font-body-md text-sm text-bone-muted leading-relaxed">
                The exact gear, medical supplies, and soothing aftercare products we utilize on client sessions in SoHo. Available for studio pickup and shipping.
              </p>

              {/* Standards List */}
              <div className="p-5 bg-noir-850 space-y-4 border border-noir-700">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="font-label-caps text-xs uppercase text-bone block font-bold">
                      Strict Sterilization Standards
                    </span>
                    <span className="font-body-sm text-xs text-bone-muted">
                      Every tool tested with biological spore tests and sealed before deployment.
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="font-label-caps text-xs uppercase text-bone block font-bold">
                      Implant-Grade Certified Jewelry
                    </span>
                    <span className="font-body-sm text-xs text-bone-muted">
                      Hypoallergenic ASTM-F136 titanium and solid 14k gold.
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('equipment')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-noir-800 text-bone font-label-caps text-xs uppercase tracking-widest hover:bg-noir-700 transition-colors border border-noir-700"
                >
                  <span>Browse Equipment Catalog</span>
                  <ShoppingBag className="w-4 h-4 text-gold" />
                </button>
              </div>
            </div>

            {/* Equipment Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {PRODUCTS_DATA.slice(0, 2).map((prod) => (
                <div
                  key={prod.id}
                  className="bg-noir-850 p-5 flex flex-col justify-between border border-noir-700 hover:border-slate-500 transition-colors"
                >
                  <div className="w-full h-44 mb-3 overflow-hidden bg-noir-950 relative border border-noir-700">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover interactive-img-zoom"
                    />
                  </div>
                  <div>
                    <span className="font-label-caps text-[10px] text-gold uppercase block">
                      {prod.category}
                    </span>
                    <h4 className="font-title-editorial text-base text-bone uppercase mb-1 font-bold truncate">
                      {prod.name}
                    </h4>
                    <p className="font-body-sm text-xs text-bone-dim mb-4 line-clamp-2">
                      {prod.description}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-noir-700">
                      <span className="font-label-data text-sm text-bone font-bold">
                        ${prod.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => onAddToCart(prod)}
                        className="px-3.5 py-1.5 bg-noir-800 hover:bg-noir-700 text-bone font-label-caps text-xs uppercase transition-colors border border-noir-700"
                      >
                        Add to Bag
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 05. CLIENT REVIEWS CAROUSEL */}
      <section 
        id="testimonials-section" 
        className="w-full py-20 px-4 md:px-8 lg:px-12 bg-noir-950 border-b border-noir-700/40"
        onMouseEnter={() => setIsCarouselPaused(true)}
        onMouseLeave={() => setIsCarouselPaused(false)}
      >
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-noir-700/40">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2">
                <span className="font-label-caps text-xs uppercase text-crimson-light tracking-[0.25em] font-bold">
                  VERIFIED GOOGLE REVIEWS
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-crimson animate-pulse" />
                <span className="font-label-caps text-[10px] text-bone-dim uppercase tracking-wider">
                  Auto-playing
                </span>
              </div>
              <h2 className="font-headline-xl text-3xl sm:text-4xl md:text-5xl text-bone uppercase font-bold">
                Client Feedback &amp; Stories
              </h2>
              <p className="font-body-md text-sm text-bone-muted max-w-xl">
                Real experiences from clients in Kampala — healed custom tattoos, fine-line ink, cover-ups, and sterile piercings.
              </p>
            </div>

            {/* Carousel Controls & Google Review CTA */}
            <div className="flex items-center gap-4 self-start md:self-end">
              <div className="flex items-center gap-2">
                <button
                  onClick={prevReview}
                  aria-label="Previous reviews"
                  className="p-3 bg-noir-850 hover:bg-noir-750 text-bone border border-noir-700 hover:border-slate-500 transition-all rounded-sm shadow-md"
                >
                  <ChevronLeft className="w-5 h-5 text-bone" />
                </button>
                <button
                  onClick={nextReview}
                  aria-label="Next reviews"
                  className="p-3 bg-noir-850 hover:bg-noir-750 text-bone border border-noir-700 hover:border-slate-500 transition-all rounded-sm shadow-md"
                >
                  <ChevronRight className="w-5 h-5 text-bone" />
                </button>
              </div>
            </div>
          </div>

          {/* Testimonial Cards Carousel View with Framer Motion Transition */}
          <div className="relative overflow-hidden min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={reviewIndex}
                initial={{ opacity: 0, x: 28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -28 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {visibleTestimonials.map((t, idx) => (
                  <div
                    key={`${t.id}-${reviewIndex}-${idx}`}
                    className="bg-noir-850 p-6 sm:p-8 flex flex-col justify-between border border-noir-700 hover:border-crimson/50 transition-all duration-300 gothic-card group rounded-sm shadow-xl"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1 text-amber-400">
                          {Array.from({ length: t.stars }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <span className="font-label-caps text-[10px] text-bone-dim uppercase tracking-wider">
                          Verified Review
                        </span>
                      </div>
                      <p className="font-body-md text-sm text-bone leading-relaxed mb-6 italic">
                        "{t.quote}"
                      </p>
                    </div>
                    <div className="flex items-center gap-3 pt-4 border-t border-noir-700/80">
                      {/* Initial Letter Avatar Profile */}
                      <div
                        className={`w-11 h-11 rounded-full border flex items-center justify-center shrink-0 font-headline-sm text-lg font-bold transition-all duration-300 shadow-inner select-none ${getInitialAvatarStyle(t.name)}`}
                      >
                        <span>{t.name.trim().charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-title-editorial text-sm text-bone font-bold truncate group-hover:text-gold transition-colors">
                          {t.name}
                        </span>
                        <span className="font-label-caps text-[10px] text-crimson-light uppercase tracking-wider truncate">
                          {t.role}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Carousel Pagination Dots */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {TESTIMONIALS_DATA.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setReviewIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 transition-all duration-300 rounded-full ${
                  reviewIndex === idx
                    ? 'w-8 bg-crimson shadow-sm shadow-crimson/50'
                    : 'w-2 bg-noir-700 hover:bg-noir-600'
                }`}
              />
            ))}
          </div>

          {/* Google Reviews Direct Link */}
          <div className="flex justify-center pt-2">
            <a
              href="https://share.google/bUeThSgYN2di6xy2G"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3.5 bg-noir-850 hover:bg-noir-800 text-bone border border-noir-700 hover:border-slate-500 transition-all font-label-caps text-xs uppercase tracking-wider group rounded-sm shadow-lg"
            >
              <div className="flex items-center text-amber-400">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </div>
              <span>
                Rated <strong className="text-bone font-bold">4.9 / 5.0</strong> on Google — Read All Verified Reviews
              </span>
              <ExternalLink className="w-4 h-4 text-bone-dim group-hover:text-bone transition-colors" />
            </a>
          </div>
        </div>
      </section>

      {/* 06. LOCATION & APPOINTMENT DESK */}
      <section id="location-section" className="w-full py-20 px-4 md:px-8 lg:px-12 bg-noir-900 border-b border-noir-700/40">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Location Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Atelier Address View with Real Kampala Google Map */}
            <div className="lg:col-span-7 flex flex-col bg-noir-850 overflow-hidden border border-noir-700">
              <div className="w-full h-80 sm:h-96 relative bg-noir-950 overflow-hidden">
                <iframe
                  title="Marvin Tattoos Kampala Google Map"
                  src="https://maps.google.com/maps?q=New%20Pioneer%20Mall,%20Burton%20St,%20Kampala,%20Uganda&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                />
                <div className="absolute top-3 left-3 pointer-events-none z-10">
                  <span className="font-label-caps text-[11px] uppercase bg-noir-950/90 backdrop-blur-md px-3 py-1.5 text-bone border border-noir-700/80 flex items-center gap-1.5 shadow-lg font-bold">
                    <span className="w-2 h-2 rounded-full bg-crimson animate-pulse" />
                    Marvin Tattoos · Kampala Studio
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-noir-850 border-t border-noir-700">
                <div className="space-y-1">
                  <div className="font-title-editorial text-base uppercase text-bone font-bold">
                    New Pioneer Mall, Burton St
                  </div>
                  <div className="font-body-sm text-xs text-bone-muted">
                    Level 5, Shop No. Pi55 · Kampala, Uganda
                  </div>
                  <div className="pt-1">
                    <a
                      href="tel:+256705748774"
                      className="inline-flex items-center gap-1.5 font-label-data text-xs text-crimson-light hover:underline font-bold"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Studio Line: +256 705 748774</span>
                    </a>
                  </div>
                </div>
                <a
                  href="https://maps.app.goo.gl/DoTQfUafRoKsqiQc8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-noir-800 hover:bg-noir-700 text-bone font-label-caps text-xs uppercase tracking-wider transition-colors flex items-center gap-2 border border-noir-700 shrink-0 group"
                >
                  <Navigation className="w-4 h-4 text-gold group-hover:text-crimson-light transition-colors" />
                  <span>Get Directions</span>
                </a>
              </div>
            </div>

            {/* Operating Schedule */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-noir-850 p-6 sm:p-8 border border-noir-700 space-y-6">
              <div className="space-y-6">
                <div className="space-y-1">
                  <span className="font-label-caps text-xs uppercase text-crimson-light tracking-[0.25em] font-bold">
                    STUDIO HOURS &amp; SESSIONS
                  </span>
                  <h3 className="font-headline-lg text-2xl text-bone uppercase font-bold">
                    Operating Schedule
                  </h3>
                </div>

                <div className="space-y-2 font-label-data text-xs">
                  <div className="flex justify-between items-center py-2.5 bg-noir-900 px-3 border border-noir-700">
                    <span className="text-bone">Monday — Saturday</span>
                    <span className="text-bone font-bold">8:00 AM — 11:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 bg-noir-900 px-3 border border-noir-700">
                    <span className="text-bone">Sunday</span>
                    <span className="text-bone-muted font-bold">8:00 AM — 10:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 bg-noir-800 px-3 border border-slate-500">
                    <div className="flex items-center gap-2">
                      <span className="text-bone font-bold">Direct Call Line</span>
                      <span className="px-1.5 py-0.5 bg-crimson text-bone font-label-caps text-[9px] uppercase font-bold">
                        Open Now
                      </span>
                    </div>
                    <a href="tel:+256705748774" className="text-crimson-light font-bold hover:underline">
                      +256 705 748774
                    </a>
                  </div>
                </div>

                <div className="p-3.5 bg-noir-900 border-l-2 border-gold space-y-1">
                  <div className="font-label-caps text-xs uppercase text-gold font-bold">
                    Walk-Ins &amp; Same-Day Piercings
                  </div>
                  <p className="font-body-sm text-xs text-bone-dim leading-relaxed">
                    Walk-in piercings and small custom flash tattoos accepted daily. Large blackwork sleeves, portraits, and cover-ups require a booked consultation.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-3">
                <button
                  onClick={() => onNavigate('booking')}
                  className="w-full py-3.5 bg-crimson hover:bg-crimson-hover text-bone font-label-caps text-xs uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2 border border-crimson/30 font-bold"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book a Consultation</span>
                </button>
                <button
                  onClick={onOpenWhatsApp}
                  className="w-full py-3 bg-noir-800 hover:bg-noir-700 text-bone font-label-caps text-xs uppercase tracking-wider transition-colors border border-noir-700 flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-gold" />
                  <span>Chat With Marvin on WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
