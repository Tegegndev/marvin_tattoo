import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageView, ServiceItem, PortfolioPiece } from '../types';
import { SERVICES_DATA, PORTFOLIO_DATA, WHATSAPP_NUMBER } from '../data/atelierData';
import { fetchServices, fetchPortfolioPieces } from '../services/apiClient';
import { Icons8 } from '../components/Icons8';

interface ServiceDetailPageProps {
  serviceId: string | null;
  onNavigate: (page: PageView) => void;
  onSelectService: (serviceId: string) => void;
  onBookService: (serviceId: string, tierName?: string) => void;
  onSelectPiece?: (piece: PortfolioPiece) => void;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({
  serviceId,
  onNavigate,
  onSelectService,
  onBookService,
  onSelectPiece,
}) => {
  const [servicesList, setServicesList] = useState<ServiceItem[]>(SERVICES_DATA);
  const [portfolioList, setPortfolioList] = useState<PortfolioPiece[]>(PORTFOLIO_DATA);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeCareTab, setActiveCareTab] = useState<'prep' | 'aftercare'>('prep');

  useEffect(() => {
    fetchServices().then(setServicesList).catch(() => {});
    fetchPortfolioPieces().then(setPortfolioList).catch(() => {});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [serviceId]);

  // Find the active service or fallback to first
  const currentService = servicesList.find((s) => s.id === serviceId) || servicesList[0];

  if (!currentService) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center pt-28 text-center px-4">
        <h2 className="text-2xl font-bold uppercase font-headline-sm text-bone">Service Not Found</h2>
        <button
          onClick={() => onNavigate('services')}
          className="mt-4 px-6 py-2.5 bg-crimson text-bone font-label-caps text-xs uppercase"
        >
          Return to Services
        </button>
      </div>
    );
  }

  // Find other services for the switcher
  const otherServices = servicesList.filter((s) => s.id !== currentService.id).slice(0, 4);

  // Dynamic Portfolio Pieces matching this Service
  const sId = currentService.id.toLowerCase();
  const matchingPieces = portfolioList.filter((piece) => {
    if (piece.serviceId && piece.serviceId.toLowerCase() === sId) {
      return true;
    }
    const cat = (piece.category || '').toLowerCase();
    const label = (piece.categoryLabel || '').toLowerCase();
    const title = (piece.title || '').toLowerCase();
    const desc = (piece.description || '').toLowerCase();

    if (sId.includes('realism') || sId.includes('portrait')) {
      return cat === 'dark-realism' || label.includes('realism') || label.includes('portrait') || title.includes('portrait');
    }
    if (sId.includes('fine-line') || sId.includes('minimalist')) {
      return cat === 'micro-detail' || label.includes('fine-line') || label.includes('minimalist') || label.includes('botanical') || desc.includes('single needle');
    }
    if (sId.includes('lettering') || sId.includes('script')) {
      return label.includes('script') || label.includes('lettering') || title.includes('script') || desc.includes('script') || desc.includes('calligraphy');
    }
    if (sId.includes('tribal') || sId.includes('traditional')) {
      return label.includes('tribal') || label.includes('traditional') || label.includes('polynesian') || desc.includes('tribal') || title.includes('chest');
    }
    if (sId.includes('coverup') || sId.includes('restoration')) {
      return cat === 'coverup' || label.includes('cover') || desc.includes('cover') || title.includes('cover');
    }
    if (sId.includes('pmu') || sId.includes('makeup') || sId.includes('semi-permanent')) {
      return cat === 'pmu' || label.includes('pmu') || label.includes('powder brows') || title.includes('brows') || label.includes('cosmetic');
    }
    if (sId.includes('piercing')) {
      return cat === 'piercing' || label.includes('piercing') || title.includes('piercing');
    }
    if (sId.includes('laser') || sId.includes('keloid') || sId.includes('removal')) {
      return label.includes('laser') || label.includes('removal') || label.includes('clearance') || title.includes('laser');
    }
    return false;
  });

  const displayWorks = matchingPieces.length > 0 ? matchingPieces : portfolioList.slice(0, 3);

  // Derive starting price
  const startingPrice = currentService.pricingTiers && currentService.pricingTiers.length > 0
    ? currentService.pricingTiers[0].price
    : 'UGX 150,000+';

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hello Marvin, I'm interested in booking a ${currentService.title} appointment. Could we discuss availability and pricing?`
  )}`;

  return (
    <div className="w-full flex flex-col bg-noir-950 text-bone pt-24 pb-20 selection:bg-crimson selection:text-bone">
      {/* 01. NAVIGATION BREADCRUMB */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-4 border-b border-noir-800/80 flex items-center justify-between text-xs font-label-caps uppercase tracking-wider text-bone-dim">
        <div className="flex items-center gap-2">
          <button onClick={() => onNavigate('home')} className="hover:text-bone transition-colors">
            Home
          </button>
          <span className="text-noir-600">/</span>
          <button onClick={() => onNavigate('services')} className="hover:text-bone transition-colors">
            Services
          </button>
          <span className="text-noir-600">/</span>
          <span className="text-crimson-light font-bold truncate">
            {currentService.title}
          </span>
        </div>

        <button
          onClick={() => onNavigate('services')}
          className="inline-flex items-center gap-1.5 hover:text-bone text-bone-muted transition-colors text-[11px]"
        >
          <Icons8 name="arrow-left" size={12} />
          <span>All Services</span>
        </button>
      </div>

      {/* 02. CLEAN HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3">
              {currentService.category && (
                <span className="px-3 py-1 bg-crimson/15 border border-crimson/40 text-crimson-light text-[11px] font-label-caps uppercase tracking-widest font-bold">
                  {currentService.category}
                </span>
              )}
              <span className="text-xs font-label-data text-bone-dim uppercase">
                Studio Discipline #{currentService.disciplineNumber}
              </span>
            </div>

            <h1 className="font-headline-xl text-3xl sm:text-5xl lg:text-6xl text-bone uppercase font-bold tracking-tight leading-tight">
              {currentService.title}
            </h1>

            <p className="font-body-md text-base sm:text-lg text-bone-muted leading-relaxed max-w-2xl">
              {currentService.description || currentService.longDescription}
            </p>

            {/* Quick Key Facts Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 bg-noir-900 border border-noir-800">
                <span className="text-[10px] font-label-caps uppercase text-bone-dim block">Starting From</span>
                <strong className="text-xs sm:text-sm font-label-data text-gold block mt-0.5 truncate">
                  {startingPrice}
                </strong>
              </div>
              <div className="p-3 bg-noir-900 border border-noir-800">
                <span className="text-[10px] font-label-caps uppercase text-bone-dim block">Sterilization</span>
                <strong className="text-xs sm:text-sm font-label-data text-bone block mt-0.5">
                  100% Single-Use
                </strong>
              </div>
              <div className="p-3 bg-noir-900 border border-noir-800">
                <span className="text-[10px] font-label-caps uppercase text-bone-dim block">Consultation</span>
                <strong className="text-xs sm:text-sm font-label-data text-bone block mt-0.5">
                  Free / Included
                </strong>
              </div>
              <div className="p-3 bg-noir-900 border border-noir-800">
                <span className="text-[10px] font-label-caps uppercase text-bone-dim block">Artist Lead</span>
                <strong className="text-xs sm:text-sm font-label-data text-bone block mt-0.5">
                  Marvin &amp; Team
                </strong>
              </div>
            </div>

            {/* Direct Booking & WhatsApp Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={() => onBookService(currentService.id)}
                className="px-8 py-4 bg-crimson hover:bg-crimson-hover text-bone font-label-caps text-xs uppercase tracking-[0.2em] font-bold border border-crimson/60 shadow-xl shadow-crimson/20 transition-all flex items-center justify-center gap-2"
              >
                <Icons8 name="calendar-check" size={16} />
                <span>Book Appointment</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 bg-noir-900 hover:bg-noir-850 text-bone hover:text-emerald-400 font-label-caps text-xs uppercase tracking-wider border border-noir-700 hover:border-emerald-600 transition-colors flex items-center justify-center gap-2"
              >
                <Icons8 name="whatsapp" size={16} className="text-emerald-500" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Hero Visual */}
          <div className="lg:col-span-5">
            <div className="relative w-full h-[360px] sm:h-[440px] bg-noir-900 border border-noir-700/80 overflow-hidden shadow-2xl group">
              <img
                src={currentService.image}
                alt={currentService.title}
                className="w-full h-full object-cover filter grayscale contrast-105 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-noir-950 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 p-3 bg-noir-950/85 backdrop-blur-md border border-noir-800 flex items-center justify-between text-xs">
                <span className="font-label-caps uppercase text-bone-dim">Marvin Tattoos Atelier</span>
                <span className="font-label-data uppercase text-crimson-light font-bold">{currentService.title}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03. REAL SAMPLE WORKS GALLERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 border-t border-noir-800/80">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-label-caps text-crimson-light uppercase tracking-widest block mb-1">
                Portfolio Showcase
              </span>
              <h2 className="font-headline-lg text-2xl sm:text-3xl text-bone uppercase font-bold">
                Sample Works in {currentService.title}
              </h2>
            </div>

            <button
              onClick={() => onNavigate('portfolio')}
              className="text-xs font-label-caps text-bone-muted hover:text-bone uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              <span>View Full Gallery</span>
              <Icons8 name="arrow-right" size={12} className="text-crimson-light" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayWorks.map((piece) => (
              <article
                key={piece.id}
                onClick={() => (onSelectPiece ? onSelectPiece(piece) : onNavigate('portfolio'))}
                className="group bg-noir-900 border border-noir-800 hover:border-slate-500 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between"
              >
                <div className="w-full h-72 overflow-hidden bg-noir-950 relative">
                  <img
                    src={piece.image}
                    alt={piece.title}
                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-noir-950/80 via-transparent to-transparent pointer-events-none" />
                  
                  {piece.healingState && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-noir-950/90 text-[10px] font-label-data uppercase tracking-wider text-bone-dim border border-noir-700">
                      {piece.healingState}
                    </div>
                  )}
                  {piece.zone && (
                    <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-noir-950/90 text-[10px] font-label-data uppercase text-gold border border-noir-800">
                      {piece.zone}
                    </div>
                  )}
                </div>

                <div className="p-4 bg-noir-900 border-t border-noir-800 flex items-center justify-between">
                  <div>
                    <h3 className="font-headline-sm text-sm sm:text-base uppercase text-bone group-hover:text-white transition-colors truncate font-bold">
                      {piece.title}
                    </h3>
                    <span className="text-[11px] font-label-data text-bone-dim">
                      {piece.duration ? `Duration: ${piece.duration}` : 'Custom Studio Piece'}
                    </span>
                  </div>
                  <span className="text-xs font-label-caps text-crimson-light group-hover:underline">
                    Inspect &rarr;
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 04. TRANSPARENT PRICING & SESSION TIERS */}
      {currentService.pricingTiers && currentService.pricingTiers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 border-t border-noir-800/80">
          <div className="space-y-6">
            <div>
              <span className="text-xs font-label-caps text-crimson-light uppercase tracking-widest block mb-1">
                Rates &amp; Options
              </span>
              <h2 className="font-headline-lg text-2xl sm:text-3xl text-bone uppercase font-bold">
                Pricing &amp; Session Options
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {currentService.pricingTiers.map((tier, i) => (
                <div
                  key={i}
                  className={`p-6 border flex flex-col justify-between space-y-5 ${
                    i === 1
                      ? 'bg-noir-900 border-crimson/60 shadow-xl shadow-crimson/10 relative'
                      : 'bg-noir-900/60 border-noir-800'
                  }`}
                >
                  {i === 1 && (
                    <span className="absolute -top-3 right-4 px-2.5 py-0.5 bg-crimson text-[9px] font-label-caps uppercase tracking-widest text-bone font-bold">
                      Popular
                    </span>
                  )}
                  <div className="space-y-3">
                    <h3 className="font-headline-sm text-lg text-bone uppercase font-bold">
                      {tier.tier}
                    </h3>
                    <div className="font-headline-lg text-2xl text-gold font-bold">
                      {tier.price}
                    </div>
                    <p className="font-body-sm text-xs sm:text-sm text-bone-muted leading-relaxed">
                      {tier.description}
                    </p>
                  </div>

                  <button
                    onClick={() => onBookService(currentService.id, tier.tier)}
                    className="w-full py-3 bg-noir-850 hover:bg-crimson text-bone font-label-caps text-xs uppercase tracking-wider border border-noir-700 hover:border-crimson transition-all text-center font-bold cursor-pointer"
                  >
                    Select Option
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 05. PREPARATION & AFTERCARE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 border-t border-noir-800/80">
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-noir-800 pb-4">
            <div>
              <span className="text-xs font-label-caps text-crimson-light uppercase tracking-widest block mb-1">
                Studio Guidance
              </span>
              <h2 className="font-headline-lg text-2xl sm:text-3xl text-bone uppercase font-bold">
                Preparation &amp; Aftercare
              </h2>
            </div>

            {/* Mobile Tab Toggle */}
            <div className="flex sm:hidden border border-noir-700 p-0.5 bg-noir-900">
              <button
                onClick={() => setActiveCareTab('prep')}
                className={`px-3 py-1 text-xs font-label-caps uppercase ${
                  activeCareTab === 'prep' ? 'bg-crimson text-white' : 'text-bone-muted'
                }`}
              >
                Prep
              </button>
              <button
                onClick={() => setActiveCareTab('aftercare')}
                className={`px-3 py-1 text-xs font-label-caps uppercase ${
                  activeCareTab === 'aftercare' ? 'bg-crimson text-white' : 'text-bone-muted'
                }`}
              >
                Aftercare
              </button>
            </div>
          </div>

          {/* Desktop 2-Column / Mobile Tabbed Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Prep Card */}
            <div
              className={`p-6 bg-noir-900 border border-noir-800 space-y-4 ${
                activeCareTab !== 'prep' ? 'hidden sm:block' : 'block'
              }`}
            >
              <div className="flex items-center gap-2 text-gold">
                <Icons8 name="check-circle" size={18} />
                <h3 className="font-headline-sm text-base uppercase text-bone font-bold">
                  Before Your Appointment
                </h3>
              </div>
              <ul className="space-y-3 pt-2">
                {(currentService.prepGuidelines || [
                  'Get a full night of rest before your session.',
                  'Eat a solid meal 1-2 hours prior to arriving.',
                  'Stay hydrated and avoid alcohol 24 hours prior.',
                  'Wear comfortable, loose clothing for easy placement access.',
                ]).map((prep, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm font-body-sm text-bone-muted">
                    <span className="text-crimson-light font-bold mt-0.5">•</span>
                    <span>{prep}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Aftercare Card */}
            <div
              className={`p-6 bg-noir-900 border border-noir-800 space-y-4 ${
                activeCareTab !== 'aftercare' ? 'hidden sm:block' : 'block'
              }`}
            >
              <div className="flex items-center gap-2 text-crimson-light">
                <Icons8 name="shield-alt" size={18} />
                <h3 className="font-headline-sm text-base uppercase text-bone font-bold">
                  Aftercare Instructions
                </h3>
              </div>
              <ul className="space-y-3 pt-2">
                {(currentService.aftercareGuidelines || [
                  'Keep protective bandage/film on as directed by your artist.',
                  'Wash gently with warm water and fragrance-free soap.',
                  'Apply a thin layer of recommended aftercare balm.',
                  'Avoid swimming, saunas, and direct sunlight during healing.',
                ]).map((aftercare, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm font-body-sm text-bone-muted">
                    <span className="text-gold font-bold mt-0.5">•</span>
                    <span>{aftercare}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 06. FAQS */}
      {currentService.faqs && currentService.faqs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-10 border-t border-noir-800/80">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-1">
              <span className="text-xs font-label-caps text-crimson-light uppercase tracking-widest">
                Common Questions
              </span>
              <h2 className="font-headline-lg text-2xl sm:text-3xl text-bone uppercase font-bold">
                Frequently Asked
              </h2>
            </div>

            <div className="space-y-3 pt-2">
              {currentService.faqs.map((faq, i) => {
                const isOpen = openFaqIndex === i;
                return (
                  <div key={i} className="border border-noir-800 bg-noir-900">
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                      className="w-full p-4 flex items-center justify-between text-left font-headline-sm text-sm sm:text-base uppercase text-bone hover:text-white transition-colors"
                    >
                      <span className="pr-4">{faq.question}</span>
                      <Icons8
                        name="angle-down"
                        size={16}
                        className={`text-bone-dim transition-transform duration-300 shrink-0 ${
                          isOpen ? 'rotate-180 text-crimson-light' : ''
                        }`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="px-4 pb-4 text-xs sm:text-sm font-body-sm text-bone-muted leading-relaxed border-t border-noir-800/80 pt-3"
                        >
                          {faq.answer}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 07. DIRECT BOOKING BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">
        <div className="p-8 sm:p-10 bg-noir-900 border border-crimson/40 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="font-label-caps text-xs uppercase text-crimson-light tracking-widest block">
              Ready to create something unique?
            </span>
            <h2 className="font-headline-lg text-2xl sm:text-3xl text-bone uppercase font-bold">
              Book Your {currentService.title}
            </h2>
            <p className="font-body-sm text-xs sm:text-sm text-bone-muted max-w-xl">
              Free consultation in our studio or directly via WhatsApp.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto shrink-0">
            <button
              onClick={() => onBookService(currentService.id)}
              className="px-8 py-4 bg-crimson hover:bg-crimson-hover text-bone font-label-caps text-xs uppercase tracking-[0.2em] font-bold border border-crimson/60 shadow-xl shadow-crimson/30 transition-all flex items-center justify-center gap-2"
            >
              <Icons8 name="calendar-check" size={16} />
              <span>Book Appointment</span>
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 bg-noir-850 hover:bg-noir-800 text-bone hover:text-emerald-400 font-label-caps text-xs uppercase tracking-wider border border-noir-700 transition-colors flex items-center justify-center gap-2"
            >
              <Icons8 name="whatsapp" size={16} className="text-emerald-500" />
              <span>WhatsApp Marvin</span>
            </a>
          </div>
        </div>
      </section>

      {/* 08. OTHER SERVICES SWITCHER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-noir-800 pb-2">
            <span className="font-label-caps text-xs uppercase text-bone-dim tracking-wider">
              Other Studio Services
            </span>
            <button
              onClick={() => onNavigate('services')}
              className="text-xs font-label-caps text-crimson-light uppercase hover:underline"
            >
              View All &rarr;
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {otherServices.map((other) => (
              <div
                key={other.id}
                onClick={() => onSelectService(other.id)}
                className="p-3 bg-noir-900 hover:bg-noir-850 border border-noir-800 hover:border-slate-500 transition-all cursor-pointer flex items-center gap-3 group"
              >
                <img
                  src={other.image}
                  alt={other.title}
                  className="w-10 h-10 object-cover border border-noir-700 shrink-0 filter grayscale group-hover:grayscale-0 transition-all"
                />
                <div className="min-w-0">
                  <strong className="font-headline-sm text-xs text-bone uppercase truncate block group-hover:text-white">
                    {other.title}
                  </strong>
                  <span className="text-[10px] font-label-caps text-crimson-light uppercase truncate block">
                    {other.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
