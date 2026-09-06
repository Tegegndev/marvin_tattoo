import React, { useState } from 'react';
import { PageView, PortfolioPiece, ProductItem } from '../types';
import { SERVICES_DATA, PORTFOLIO_DATA, PRODUCTS_DATA, TESTIMONIALS_DATA } from '../data/atelierData';
import { 
  Calendar, 
  ArrowRight, 
  ShieldCheck, 
  Star, 
  ShoppingBag, 
  MapPin, 
  ShieldAlert, 
  Skull, 
  FileText, 
  Syringe, 
  Layers, 
  MessageCircle,
  Sparkles,
  CheckCircle2,
  Navigation
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageView) => void;
  onSelectPiece: (piece: PortfolioPiece) => void;
  onAddToCart: (product: ProductItem) => void;
  onOpenWhatsApp: () => void;
  onOpenVerify: () => void;
}

// Founder Portrait with Black & White to Full Color on Hover
const MarvinPortraitLens: React.FC = () => {
  return (
    <div 
      className="relative w-full h-[480px] sm:h-[540px] lg:h-[600px] bg-noir-900 border border-noir-700 overflow-hidden group select-none"
    >
      {/* Marvin's Portrait: High-Contrast Black & White by default, Full Original Color on hover */}
      <img
        src="/images/marvin-founder.png"
        alt="Marvin - Founder & Resident Tattooist"
        className="absolute inset-0 w-full h-full object-cover object-[center_15%] scale-110 filter grayscale contrast-125 brightness-95 transition-all duration-700 ease-out group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100 group-hover:scale-[1.14]"
      />
      <div className="absolute inset-0 bg-noir-950/20 group-hover:bg-transparent transition-colors duration-700 pointer-events-none" />

      {/* Bottom Name & Story Overlay */}
      <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-noir-950 via-noir-950/85 to-transparent z-20 space-y-2 pointer-events-none">
        <div className="flex items-end justify-between">
          <div>
            <span className="font-label-caps text-[10px] text-crimson-light uppercase tracking-widest block">
              142 Mercer St · SoHo NYC
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
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Studio Editorial Copy & CTAs (7 Cols) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Provenance Badge */}
              <div className="inline-flex items-center gap-3 px-3.5 py-1.5 bg-noir-850 border border-noir-700">
                <span className="font-label-caps text-xs text-bone tracking-[0.25em] uppercase">
                  MARVIN TATTOOS
                </span>
                <span className="w-1 h-1 rounded-full bg-noir-600" />
                <span className="font-label-data text-xs text-gold uppercase tracking-wider">
                  SOHO, NEW YORK · EST. 2014
                </span>
              </div>

              {/* Bold Title */}
              <h1 className="font-headline-xl text-4xl sm:text-5xl md:text-6xl text-bone leading-[1.05] tracking-tight font-bold uppercase">
                Anatomy-First Body Art &amp; Sterile Piercing
              </h1>

              {/* Pitch */}
              <p className="font-body-md text-sm sm:text-base text-bone-muted max-w-2xl leading-relaxed">
                Dark realism, heavy blackwork, and precision jewelry curation. Drawn freehand to align with your body’s natural musculature and executed with hospital-grade sterility protocols.
              </p>

              {/* Core Features List */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-noir-900 border border-noir-700/70 space-y-1">
                  <span className="font-label-caps text-[10px] text-bone uppercase flex items-center gap-1.5 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-gold" /> Sterile Protocol
                  </span>
                  <p className="font-body-sm text-[11px] text-bone-dim">
                    Class-B steam autoclave &amp; 100% single-use cartridges.
                  </p>
                </div>

                <div className="p-3 bg-noir-900 border border-noir-700/70 space-y-1">
                  <span className="font-label-caps text-[10px] text-bone uppercase flex items-center gap-1.5 font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-gold" /> Anatomical Flow
                  </span>
                  <p className="font-body-sm text-[11px] text-bone-dim">
                    Freehand placement mapped to your muscles and joints.
                  </p>
                </div>

                <div className="p-3 bg-noir-900 border border-noir-700/70 space-y-1">
                  <span className="font-label-caps text-[10px] text-bone uppercase flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-gold" /> Implant Grade
                  </span>
                  <p className="font-body-sm text-[11px] text-bone-dim">
                    ASTM-F136 titanium and solid 14k gold piercing suites.
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
                  onClick={onOpenWhatsApp}
                  className="w-full sm:w-auto px-7 py-3.5 bg-noir-850 hover:bg-noir-800 text-bone font-label-caps text-xs uppercase tracking-wider transition-colors border border-noir-700 flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-gold" />
                  <span>WhatsApp Inquiries</span>
                </button>
              </div>

              {/* Quick Metrics */}
              <div className="pt-4 border-t border-noir-700/60 flex items-center gap-6 text-xs font-label-data text-bone-dim">
                <div>
                  <strong className="text-bone text-sm">500+</strong> Pieces Inked
                </div>
                <div className="w-1 h-1 rounded-full bg-noir-700" />
                <div>
                  <strong className="text-bone text-sm">4.9/5.0</strong> Client Satisfaction
                </div>
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

      {/* 05. CLIENT REVIEWS */}
      <section id="testimonials-section" className="w-full py-20 px-4 md:px-8 lg:px-12 bg-noir-950 border-b border-noir-700/40">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="font-label-caps text-xs uppercase text-crimson-light tracking-[0.25em]">
              VERIFIED EXPERIENCES
            </span>
            <h2 className="font-headline-xl text-3xl sm:text-4xl md:text-5xl text-bone uppercase font-bold">
              Client Feedback
            </h2>
            <p className="font-body-md text-sm text-bone-muted">
              Direct reviews from healed tattoo appointments and piercing curations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS_DATA.map((t) => (
              <div
                key={t.id}
                className="bg-noir-850 p-6 sm:p-8 flex flex-col justify-between border border-noir-700 hover:border-slate-500 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-1 text-gold mb-4">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-secondary text-gold" />
                    ))}
                  </div>
                  <p className="font-body-md text-sm text-bone leading-relaxed mb-6 italic">
                    "{t.quote}"
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-noir-700">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover shrink-0 border border-noir-700"
                  />
                  <div className="flex flex-col">
                    <span className="font-title-editorial text-sm text-bone font-bold">
                      {t.name}
                    </span>
                    <span className="font-label-caps text-[10px] text-bone-dim uppercase">
                      {t.role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 06. LOCATION & APPOINTMENT DESK */}
      <section id="location-section" className="w-full py-20 px-4 md:px-8 lg:px-12 bg-noir-900">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Security Advisory */}
          <div className="w-full p-5 sm:p-6 bg-noir-850 text-bone flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-noir-700">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-noir-800 text-gold shrink-0 mt-0.5 border border-noir-700">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <div className="font-label-caps text-xs uppercase text-bone tracking-wider mb-1 font-bold">
                  Anti-Scam Notice — Official Channels Only
                </div>
                <p className="font-body-sm text-xs text-bone-muted max-w-3xl leading-relaxed">
                  We never request payments through direct social media messages. Deposits are processed only through this website or our verified WhatsApp desk.
                </p>
              </div>
            </div>
            <button
              onClick={onOpenVerify}
              className="shrink-0 px-4 py-2 bg-noir-800 text-bone font-label-caps text-xs uppercase tracking-widest hover:bg-noir-750 transition-colors border border-noir-700"
            >
              Verify Channels
            </button>
          </div>

          {/* Location Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Atelier Address View */}
            <div className="lg:col-span-7 flex flex-col bg-noir-850 overflow-hidden border border-noir-700">
              <div
                className="w-full h-80 sm:h-96 relative bg-cover bg-center"
                style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDREC5pLTdXJO9fp7vuWhpIAppPWmY4qSTJFCXzqlUcHi3fZn0gVE-noAZzaS8SEDDLh1lZ4oFoupXQ5NuT2OZdFMFRBi9bf1rXRgjL5JVQDM5eOljrx_syn6Z_sjQ5Q3bz0ZjyL8BL1VfcSpTQSddMSSp_sHB62jK0ST79vxxgbvglq3jteejwFoma9kAsCXzziKmSSyrh11T-SMQQ4TL_pVcDo1x_MBWIVx9omsFuPYnfkoalDF-y7g')` }}
              >
                <div className="absolute inset-0 bg-noir-950/40" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="p-3.5 bg-noir-900 text-gold rounded-full border border-noir-700">
                    <MapPin className="w-7 h-7" />
                  </div>
                  <span className="font-label-caps text-xs uppercase bg-noir-950 px-3.5 py-1.5 text-bone mt-2 border border-noir-700">
                    Marvin Tattoos · SoHo Atelier
                  </span>
                </div>
              </div>
              <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-noir-850">
                <div>
                  <div className="font-title-editorial text-base uppercase text-bone font-bold">
                    142 Mercer Street, Suite 3B
                  </div>
                  <div className="font-body-sm text-xs text-bone-muted">
                    SoHo, New York, NY 10012 · 3 min from Prince St &amp; Spring St
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('location')}
                  className="px-4 py-2 bg-noir-800 hover:bg-noir-700 text-bone font-label-caps text-xs uppercase tracking-wider transition-colors flex items-center gap-2 border border-noir-700"
                >
                  <Navigation className="w-4 h-4 text-gold" />
                  <span>Get Directions</span>
                </button>
              </div>
            </div>

            {/* Operating Schedule */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-noir-850 p-6 sm:p-8 border border-noir-700 space-y-6">
              <div className="space-y-6">
                <div className="space-y-1">
                  <span className="font-label-caps text-xs uppercase text-crimson-light tracking-[0.25em]">
                    APPOINTMENTS &amp; WALK-INS
                  </span>
                  <h3 className="font-headline-lg text-2xl text-bone uppercase font-bold">
                    Studio Schedule
                  </h3>
                </div>

                <div className="space-y-2 font-label-data text-xs">
                  <div className="flex justify-between items-center py-2.5 bg-noir-900 px-3 border border-noir-700">
                    <span className="text-bone">Tuesday — Friday</span>
                    <span className="text-bone-muted font-bold">11:00 — 21:00</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 bg-noir-800 px-3 border border-slate-500">
                    <div className="flex items-center gap-2">
                      <span className="text-bone font-bold">Saturday</span>
                      <span className="px-1.5 py-0.5 bg-gold text-noir-950 font-label-caps text-[9px] uppercase font-bold">
                        Walk-Ins Open
                      </span>
                    </div>
                    <span className="text-gold font-bold">11:00 — 21:00</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 bg-noir-900 px-3 border border-noir-700">
                    <span className="text-bone">Sunday</span>
                    <span className="text-bone-muted">12:00 — 18:00 (Private Sessions)</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 bg-noir-950 px-3 text-bone-dim border border-noir-700">
                    <span>Monday</span>
                    <span className="uppercase font-label-caps text-[10px]">Closed for Sterilization</span>
                  </div>
                </div>

                <div className="p-3 bg-noir-900 border-l-2 border-gold space-y-1">
                  <div className="font-label-caps text-xs uppercase text-gold font-bold">
                    Saturday Walk-In Protocol
                  </div>
                  <p className="font-body-sm text-xs text-bone-dim leading-relaxed">
                    Flash designs available on first-come basis every Saturday from 10:45 AM. Larger custom pieces require booked consultation.
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
