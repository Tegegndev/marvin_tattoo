import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageView, PortfolioPiece, ProductItem, ServiceItem, SiteSettingData, Testimonial } from '../types';
import { SERVICES_DATA, PORTFOLIO_DATA, PRODUCTS_DATA, TESTIMONIALS_DATA, HERO_IMAGE } from '../data/atelierData';
import { Icons8 } from '../components/Icons8';
import {
  fetchSiteSettings,
  fetchPortfolioPieces,
  fetchServices,
  fetchTestimonials,
  fetchProducts,
  DEFAULT_SITE_SETTINGS,
} from '../services/apiClient';

interface HomePageProps {
  onNavigate: (page: PageView) => void;
  onSelectPiece: (piece: PortfolioPiece) => void;
  onSelectService?: (serviceId: string) => void;
  onBookService?: (serviceId: string) => void;
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
              Marvin Tattoo Studio · Kampala, Uganda
            </span>
            <h3 className="font-headline-sm text-2xl sm:text-3xl text-bone uppercase font-bold tracking-tight">
              Marvin
            </h3>
            <p className="font-body-sm text-xs text-bone-muted leading-tight">
              Founder &amp; Master Tattoo Artist
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
  onSelectService,
  onBookService,
  onAddToCart,
  onOpenWhatsApp,
}) => {
  const [settings, setSettings] = useState<SiteSettingData>(DEFAULT_SITE_SETTINGS);
  const [portfolioList, setPortfolioList] = useState<PortfolioPiece[]>(PORTFOLIO_DATA);
  const [servicesList, setServicesList] = useState<ServiceItem[]>(SERVICES_DATA);
  const [testimonialsList, setTestimonialsList] = useState<Testimonial[]>(TESTIMONIALS_DATA);
  const [productsList, setProductsList] = useState<ProductItem[]>(PRODUCTS_DATA);
  const [selectedPortfolioCategory, setSelectedPortfolioCategory] = useState<string>('all');
  const [selectedServiceCategory, setSelectedServiceCategory] = useState<string>('ALL');
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchSiteSettings().then(setSettings).catch(() => {});
    fetchPortfolioPieces().then(setPortfolioList).catch(() => {});
    fetchServices().then(setServicesList).catch(() => {});
    fetchTestimonials().then(setTestimonialsList).catch(() => {});
    fetchProducts().then(setProductsList).catch(() => {});
  }, []);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  const getInitialAvatarStyle = (name: string) => {
    const code = name.charCodeAt(0) || 0;
    const styles = [
      'bg-crimson/20 border-crimson/60 text-crimson-light group-hover:bg-crimson group-hover:text-bone',
      'bg-gold/20 border-gold/60 text-gold group-hover:bg-gold group-hover:text-noir-950',
      'bg-rose-500/20 border-rose-500/60 text-rose-300 group-hover:bg-rose-500 group-hover:text-noir-950',
      'bg-rose-900/30 border-rose-600/60 text-rose-300 group-hover:bg-rose-700 group-hover:text-bone',
      'bg-noir-800 border-bone/40 text-bone group-hover:bg-bone group-hover:text-noir-950'
    ];
    return styles[code % styles.length];
  };

  const filteredPortfolio = selectedPortfolioCategory === 'all'
    ? portfolioList.slice(0, 6)
    : portfolioList.filter(item => {
        if (selectedPortfolioCategory === 'blackwork') return item.category === 'dark-realism';
        if (selectedPortfolioCategory === 'neo-traditional') return item.category === 'neo-traditional' || item.category === 'micro-detail';
        if (selectedPortfolioCategory === 'piercings') return item.category === 'piercing' || item.category === 'micro-detail';
        return true;
      });

  const serviceCategoryTabs = [
    { id: 'ALL', label: 'All Disciplines' },
    { id: 'TATTOO', label: 'Custom Tattoos' },
    { id: 'PIERCING', label: 'Body Piercing' },
    { id: 'PMU', label: 'Semi-Permanent PMU' },
    { id: 'REMOVAL', label: 'Laser & Clearance' },
  ];

  const filteredServices = servicesList.filter((service) => {
    if (selectedServiceCategory === 'ALL') return true;
    const cat = service.category?.toUpperCase();
    if (selectedServiceCategory === 'TATTOO') {
      return cat === 'TATTOO' || !cat;
    }
    return cat === selectedServiceCategory;
  });

  const getServiceCategoryCount = (catId: string) => {
    if (catId === 'ALL') return servicesList.length;
    if (catId === 'TATTOO') {
      return servicesList.filter(s => (s.category || '').toUpperCase() === 'TATTOO' || !s.category).length;
    }
    return servicesList.filter(s => (s.category || '').toUpperCase() === catId).length;
  };

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'skull':
        return <Icons8 name="skull" size={18} />;
      case 'edit_note':
        return <Icons8 name="pen-fancy" size={18} />;
      case 'colorize':
        return <Icons8 name="syringe" size={18} />;
      case 'layers':
      default:
        return <Icons8 name="layer-group" size={18} />;
    }
  };

  return (
    <div className="w-full flex flex-col bg-noir-950 relative">
      {/* 01. EDITORIAL HERO SECTION */}
      <section className="relative w-full min-h-[92vh] flex items-center overflow-hidden pt-28 pb-16 bg-noir-950 border-b border-noir-700/40">
        {/* Cinematic Studio Visual Backdrop */}
        <div
          className="absolute inset-0 w-full h-full bg-cover mix-blend-luminosity scale-105 pointer-events-none transition-transform duration-1000 ease-out"
          style={{
            backgroundImage: `url('${settings.heroBannerUrl || HERO_IMAGE}')`,
            backgroundPosition: 'center 30%',
            opacity: settings.heroOpacity ?? 0.45,
          }}
        />
        {/* Dark Vignettes for high contrast and readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-noir-950/90 via-noir-950/70 to-noir-950/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-noir-950 via-transparent to-noir-950/60 pointer-events-none" />

        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Studio Editorial Copy & CTAs (7 Cols) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Provenance Badge */}
              <div className="inline-flex items-center gap-3 px-3.5 py-1.5 bg-noir-850 border border-crimson/40">
                <span className="font-label-caps text-xs text-crimson-light tracking-[0.25em] uppercase font-bold">
                  MARVIN TATTOO STUDIO
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-crimson-light" />
                <span className="font-label-data text-xs text-bone-muted uppercase tracking-wider">
                  Custom tattoo studio in Kampala, Uganda · EST. 2014
                </span>
              </div>

              {/* Hero Title with Limelight */}
              <h1 className="font-limelight text-4xl sm:text-5xl md:text-6xl lg:text-[68px] text-bone leading-[1.1] tracking-normal font-normal">
                {settings.heroStatement || "Clean Lines. Heavy Blackwork. Made to Age Well."}
              </h1>

              {/* Real Studio Pitch */}
              <p className="font-body-md text-sm sm:text-base text-bone-muted max-w-2xl leading-relaxed">
                {settings.heroSubtext || "Specializing in dark realism, solid blackwork, and custom tattoo design in Kampala, Uganda. Every piece is drawn to fit your body and tattooed to heal solid for life."}
              </p>

              {/* Signature Services Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 bg-noir-900 border border-noir-700/80 space-y-1 hover:border-slate-500 transition-colors">
                  <span className="font-label-caps text-[11px] text-bone uppercase flex items-center gap-1.5 font-bold">
                    <Icons8 name="magic" size={14} className="text-crimson-light shrink-0" /> Realism &amp; Portraits
                  </span>
                  <p className="font-body-sm text-[11px] text-bone-muted leading-relaxed">
                    High-detail black-and-grey and photo-realistic face, animal, or object pieces.
                  </p>
                </div>

                <div className="p-3.5 bg-noir-900 border border-noir-700/80 space-y-1 hover:border-slate-500 transition-colors">
                  <span className="font-label-caps text-[11px] text-bone uppercase flex items-center gap-1.5 font-bold">
                    <Icons8 name="pen-fancy" size={14} className="text-crimson-light shrink-0" /> Minimalist &amp; Script
                  </span>
                  <p className="font-body-sm text-[11px] text-bone-muted leading-relaxed">
                    Fine-line micro-tattoos, geometric continuous line art, and custom calligraphy.
                  </p>
                </div>

                <div className="p-3.5 bg-noir-900 border border-noir-700/80 space-y-1 hover:border-slate-500 transition-colors">
                  <span className="font-label-caps text-[11px] text-bone uppercase flex items-center gap-1.5 font-bold">
                    <Icons8 name="shield-alt" size={14} className="text-crimson-light shrink-0" /> Cover-Ups &amp; Removal
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
                  <Icons8 name="calendar-check" size={16} />
                  <span>Book Consultation</span>
                </button>

                <button
                  onClick={() => onNavigate('portfolio')}
                  className="w-full sm:w-auto px-7 py-3.5 bg-noir-850 hover:bg-noir-800 text-bone font-label-caps text-xs uppercase tracking-wider transition-colors border border-noir-700 flex items-center justify-center gap-2 group"
                >
                  <Icons8 name="arrow-right" size={16} className="text-crimson-light transition-transform group-hover:translate-x-1" />
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
                  <div className="flex items-center text-rose-400">
                    <Icons8 name="star" size={14} className="text-rose-400" />
                  </div>
                  <span>
                    <strong className="text-bone font-bold">4.9/5.0</strong> on Google Reviews
                  </span>
                  <Icons8 name="external-link-alt" size={12} className="text-bone-dim group-hover:text-bone transition-colors" />
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
      <section id="services-section" className="w-full py-20 px-4 md:px-8 lg:px-12 bg-noir-900 border-b border-noir-700/40 relative">
        {/* Subtle Ambient Background Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-crimson/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-10 relative z-10">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-noir-700/40">
            <div className="space-y-2 max-w-xl">
              <span className="font-label-caps text-xs uppercase text-crimson-light tracking-[0.25em] flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-crimson animate-pulse" />
                STUDIO DISCIPLINES &amp; CRAFTSMANSHIP
              </span>
              <h2 className="font-headline-xl text-3xl sm:text-4xl md:text-5xl text-bone uppercase font-bold tracking-tight">
                Our Core Services
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <p className="font-body-md text-sm text-bone-muted max-w-md leading-relaxed">
                Every design is calibrated to how skin heals and moves over time. Transparent pricing, private consultation rooms, and hospital-grade sterile protocols.
              </p>
              <button
                onClick={() => onNavigate('services')}
                className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2.5 bg-noir-850 hover:bg-noir-800 border border-noir-700 hover:border-slate-500 text-xs font-label-caps uppercase tracking-wider text-bone shrink-0 transition-colors"
              >
                <span>Full Directory</span>
                <Icons8 name="arrow-right" size={14} className="text-crimson-light" />
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {serviceCategoryTabs.map((tab) => {
              const count = getServiceCategoryCount(tab.id);
              const isActive = selectedServiceCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedServiceCategory(tab.id)}
                  className={`px-4 py-2 text-xs font-label-caps uppercase tracking-wider transition-all duration-200 border flex items-center gap-2 ${
                    isActive
                      ? 'bg-crimson text-bone border-crimson shadow-md shadow-crimson/20 font-bold'
                      : 'bg-noir-850 hover:bg-noir-800 text-bone-muted hover:text-bone border-noir-700/80 hover:border-slate-500'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-label-data ${
                    isActive ? 'bg-noir-950/40 text-bone' : 'bg-noir-950 text-bone-dim'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 3-Column Luxury Service Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <article
                key={service.id}
                className="group flex flex-col bg-noir-850 border border-noir-700/80 hover:border-slate-400/80 transition-all duration-300 hover:shadow-2xl hover:shadow-noir-950/80 overflow-hidden"
              >
                {/* Card Hero Image with Badges */}
                <div
                  onClick={() => onSelectService ? onSelectService(service.id) : onNavigate('services')}
                  className="w-full h-64 overflow-hidden bg-noir-950 relative border-b border-noir-700/60 cursor-pointer"
                >
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover interactive-img-zoom filter grayscale group-hover:grayscale-0 contrast-110 brightness-95 group-hover:brightness-100 transition-all duration-700"
                  />
                  {/* Ambient Dark Gradient for Legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-noir-950 via-transparent to-noir-950/40 pointer-events-none" />

                  {/* Top Discipline Tag */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-noir-950/90 backdrop-blur-md text-[11px] font-label-data uppercase tracking-wider text-bone-dim border border-noir-700/80 shadow-sm">
                    Discipline // {service.disciplineNumber}
                  </div>

                  {/* Top Category Badge */}
                  {service.category && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 bg-crimson/90 backdrop-blur-md text-[10px] font-label-caps uppercase tracking-wider text-bone font-bold border border-crimson/40">
                      {service.category}
                    </div>
                  )}

                  {/* Bottom Image Subtitle */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-label-data text-bone-muted bg-noir-950/85 backdrop-blur-sm px-3 py-1.5 border border-noir-700/60">
                    <span className="truncate uppercase tracking-wider text-bone font-medium">{service.subtitle}</span>
                    <div className="text-gold flex-shrink-0 ml-2">
                      {getServiceIcon(service.iconName)}
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex flex-col justify-between flex-grow space-y-6">
                  <div>
                    <h3
                      onClick={() => onSelectService ? onSelectService(service.id) : onNavigate('services')}
                      className="font-headline-sm text-2xl text-bone uppercase tracking-tight group-hover:text-white font-bold transition-colors cursor-pointer"
                    >
                      {service.title}
                    </h3>
                  </div>

                  {/* Dual Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-noir-800">
                    <button
                      type="button"
                      onClick={() => onSelectService ? onSelectService(service.id) : onNavigate('services')}
                      className="w-full py-2.5 px-3 bg-noir-900 hover:bg-noir-850 text-bone-muted hover:text-bone font-label-caps text-xs uppercase tracking-wider border border-noir-700 hover:border-slate-500 transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Details</span>
                      <Icons8 name="arrow-right" size={12} className="text-crimson-light" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onBookService ? onBookService(service.id) : onNavigate('booking')}
                      className="w-full py-2.5 px-3 bg-crimson hover:bg-crimson-hover text-bone font-label-caps text-xs uppercase tracking-wider border border-crimson/40 transition-all flex items-center justify-center gap-1.5 font-bold shadow-sm shadow-crimson/20"
                    >
                      <Icons8 name="calendar-check" size={12} />
                      <span>Book</span>
                    </button>
                  </div>
                </div>
              </article>
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
                { id: 'blackwork', label: 'Realism & Portraits' },
                { id: 'neo-traditional', label: 'Lettering & Script' },
                { id: 'piercings', label: 'Piercings & PMU' }
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
              <Icons8 name="arrow-right" size={16} className="text-gold" />
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
                The exact gear, medical supplies, and soothing aftercare products we utilize on client sessions in Kampala. Available for studio pickup and shipping.
              </p>

              {/* Standards List */}
              <div className="p-5 bg-noir-850 space-y-4 border border-noir-700">
                <div className="flex items-start gap-3">
                  <Icons8 name="shield-alt" size={20} className="text-gold shrink-0 mt-0.5" />
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
                  <Icons8 name="magic" size={20} className="text-gold shrink-0 mt-0.5" />
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
                  <Icons8 name="shopping-bag" size={16} className="text-gold" />
                </button>
              </div>
            </div>

            {/* Equipment Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {productsList.slice(0, 2).map((prod) => {
                const isOutOfStock = !prod.inStock || (prod.stockCount !== undefined && prod.stockCount <= 0);
                return (
                  <div
                    key={prod.id}
                    className="bg-noir-850 p-5 flex flex-col justify-between border border-noir-700 hover:border-slate-500 transition-colors"
                  >
                    <div className="w-full h-44 mb-3 overflow-hidden bg-noir-950 relative border border-noir-700">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className={`w-full h-full object-cover ${isOutOfStock ? 'grayscale opacity-60' : 'interactive-img-zoom'}`}
                      />
                      {isOutOfStock && (
                        <span className="absolute top-2 right-2 px-2 py-0.5 bg-red-950/90 text-[10px] font-label-caps uppercase text-red-300 border border-red-700/50">
                          Sold Out
                        </span>
                      )}
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
                          {prod.price > 1000 ? `UGX ${prod.price.toLocaleString()}` : `$${prod.price.toFixed(2)}`}
                        </span>
                        <button
                          onClick={() => !isOutOfStock && onAddToCart(prod)}
                          disabled={isOutOfStock}
                          className={`px-3.5 py-1.5 font-label-caps text-xs uppercase transition-colors border ${
                            isOutOfStock
                              ? 'bg-noir-900 text-bone-dim border-noir-800 cursor-not-allowed opacity-60'
                              : 'bg-noir-800 hover:bg-noir-700 text-bone border-noir-700'
                          }`}
                        >
                          {isOutOfStock ? 'Sold Out' : 'Add to Bag'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 05. CLIENT REVIEWS INFINITE SLIDER */}
      <section 
        id="testimonials-section" 
        className="w-full py-20 px-4 md:px-8 lg:px-12 bg-noir-950 border-b border-noir-700/40 overflow-hidden"
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
                  Hover to pause
                </span>
              </div>
              <h2 className="font-headline-xl text-3xl sm:text-4xl md:text-5xl text-bone uppercase font-bold">
                Client Feedback &amp; Stories
              </h2>
              <p className="font-body-md text-sm text-bone-muted max-w-xl">
                Real experiences from clients in Kampala — healed custom tattoos, fine-line ink, cover-ups, and dark realism.
              </p>
            </div>

            {/* Slider Controls & Directional Nav */}
            <div className="flex items-center gap-3 self-start md:self-end">
              <button
                onClick={scrollLeft}
                aria-label="Scroll left"
                className="p-3 bg-noir-850 hover:bg-noir-750 text-bone border border-noir-700 hover:border-slate-500 transition-all rounded-sm shadow-md"
              >
                <Icons8 name="arrow-left" size={20} className="text-bone" />
              </button>
              <button
                onClick={scrollRight}
                aria-label="Scroll right"
                className="p-3 bg-noir-850 hover:bg-noir-750 text-bone border border-noir-700 hover:border-slate-500 transition-all rounded-sm shadow-md"
              >
                <Icons8 name="arrow-right" size={20} className="text-bone" />
              </button>
            </div>
          </div>

          {/* Testimonials Infinite Loop Slider with Pause on Hover */}
          <div 
            ref={sliderRef}
            className="relative w-full overflow-hidden pause-on-hover py-2"
          >
            {/* Left & Right Smooth Edge Fade Masks */}
            <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-noir-900 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-noir-900 to-transparent z-10 pointer-events-none" />

            {/* Infinite Looping Track */}
            <div className="animate-infinite-loop flex gap-8">
              {[...testimonialsList, ...testimonialsList].map((t, idx) => (
                <div
                  key={`${t.id}-${idx}`}
                  className="w-[340px] sm:w-[420px] md:w-[460px] lg:w-[480px] shrink-0 bg-noir-850 p-7 sm:p-8 flex flex-col justify-between border border-noir-700 hover:border-crimson/50 transition-all duration-300 gothic-card group rounded-sm shadow-xl cursor-default"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Icons8
                            key={i}
                            name="star"
                            size={16}
                            className={i < (t.stars || 5) ? "text-amber-400" : "text-noir-600"}
                          />
                        ))}
                      </div>
                      <span className="font-label-caps text-[10px] text-bone-dim uppercase tracking-wider">
                        Verified Review
                      </span>
                    </div>
                    <p className="font-body-md text-sm text-bone leading-relaxed mb-6 italic line-clamp-4">
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
            </div>
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
                <Icons8 name="star" size={16} className="text-amber-400" />
              </div>
              <span>
                Rated <strong className="text-bone font-bold">4.9 / 5.0</strong> on Google — Read All Verified Reviews
              </span>
              <Icons8 name="external-link-alt" size={16} className="text-bone-dim group-hover:text-bone transition-colors" />
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
                  title="Marvin Tattoo Studio Kampala Google Map"
                  src="https://maps.google.com/maps?q=New%20Pioneer%20Mall,%20Burton%20St,%20Kampala,%20Uganda&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                />
                <div className="absolute top-3 left-3 pointer-events-none z-10">
                  <span className="font-label-caps text-[11px] uppercase bg-noir-950/90 backdrop-blur-md px-3 py-1.5 text-bone border border-noir-700/80 flex items-center gap-1.5 shadow-lg font-bold">
                    <span className="w-2 h-2 rounded-full bg-crimson animate-pulse" />
                    Marvin Tattoo Studio · Kampala
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-noir-850 border-t border-noir-700">
                <div className="space-y-1">
                  <div className="font-title-editorial text-base uppercase text-bone font-bold">
                    New Pioneer Mall, Shop No. Pi55
                  </div>
                  <div className="font-body-sm text-xs text-bone-muted">
                    Level 5, Burton Street · Kampala, Uganda
                  </div>
                  <div className="pt-1">
                    <a
                      href="tel:+256705748774"
                      className="inline-flex items-center gap-1.5 font-label-data text-xs text-crimson-light hover:underline font-bold"
                    >
                      <Icons8 name="phone" size={14} />
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
                  <Icons8 name="location-arrow" size={16} className="text-gold group-hover:text-crimson-light transition-colors" />
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
                    Walk-Ins &amp; Custom Flash
                  </div>
                  <p className="font-body-sm text-xs text-bone-dim leading-relaxed">
                    Walk-in consultations and small custom flash tattoos accepted daily. Large blackwork sleeves, portraits, and cover-ups require a booked consultation.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-3">
                <button
                  onClick={() => onNavigate('booking')}
                  className="w-full py-3.5 bg-crimson hover:bg-crimson-hover text-bone font-label-caps text-xs uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2 border border-crimson/30 font-bold"
                >
                  <Icons8 name="calendar-check" size={16} />
                  <span>Book a Consultation</span>
                </button>
                <button
                  onClick={onOpenWhatsApp}
                  className="w-full py-3 bg-noir-800 hover:bg-noir-700 text-bone font-label-caps text-xs uppercase tracking-wider transition-colors border border-noir-700 flex items-center justify-center gap-2"
                >
                  <Icons8 name="whatsapp" size={16} className="text-emerald-400" />
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
