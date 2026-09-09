import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageView, ServiceItem, PortfolioPiece } from '../types';
import { SERVICES_DATA, PORTFOLIO_DATA } from '../data/atelierData';
import { fetchServices, fetchPortfolioPieces } from '../services/apiClient';
import { Icons8 } from '../components/Icons8';

interface ServiceDetailPageProps {
  serviceId: string | null;
  onNavigate: (page: PageView) => void;
  onSelectService: (serviceId: string) => void;
  onBookService: (serviceId: string) => void;
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

  useEffect(() => {
    fetchServices().then(setServicesList).catch(() => {});
    fetchPortfolioPieces().then(setPortfolioList).catch(() => {});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [serviceId]);

  // Find the active service or fallback to first
  const currentService = servicesList.find((s) => s.id === serviceId) || servicesList[0];

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'skull':
        return <Icons8 name="skull" size={24} />;
      case 'edit_note':
        return <Icons8 name="pen-fancy" size={24} />;
      case 'colorize':
        return <Icons8 name="syringe" size={24} />;
      case 'layers':
      default:
        return <Icons8 name="layer-group" size={24} />;
    }
  };

  if (!currentService) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center pt-28 text-center px-4">
        <h2 className="text-2xl font-bold uppercase font-headline-sm">Discipline Not Found</h2>
        <button
          onClick={() => onNavigate('services')}
          className="mt-4 px-6 py-2.5 bg-crimson text-bone font-label-caps text-xs uppercase"
        >
          Return to Services
        </button>
      </div>
    );
  }

  // Find other disciplines for the bottom switcher
  const otherServices = servicesList.filter((s) => s.id !== currentService.id).slice(0, 3);

  return (
    <div className="w-full flex flex-col bg-noir-950 text-bone pt-24 pb-20 selection:bg-crimson selection:text-bone">
      {/* 01. BREADCRUMBS & NAVIGATION */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 w-full py-4 border-b border-noir-800 flex items-center justify-between text-xs font-label-caps uppercase tracking-wider text-bone-dim">
        <div className="flex items-center gap-2">
          <button onClick={() => onNavigate('home')} className="hover:text-bone transition-colors">
            Home
          </button>
          <span>/</span>
          <button onClick={() => onNavigate('services')} className="hover:text-bone transition-colors">
            Services
          </button>
          <span>/</span>
          <span className="text-crimson-light font-bold truncate max-w-[200px] sm:max-w-none">
            {currentService.title}
          </span>
        </div>

        <button
          onClick={() => onNavigate('services')}
          className="inline-flex items-center gap-1.5 hover:text-bone text-bone-muted transition-colors text-[11px]"
        >
          <Icons8 name="arrow-left" size={12} />
          <span>All Disciplines</span>
        </button>
      </div>

      {/* 02. HERO BANNER */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 w-full py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Hero Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-noir-900 border border-noir-700 text-xs font-label-data uppercase tracking-widest text-bone-dim">
                Discipline // {currentService.disciplineNumber}
              </span>
              {currentService.category && (
                <span className="px-3 py-1 bg-crimson/20 border border-crimson/60 text-crimson-light text-xs font-label-caps uppercase tracking-wider font-bold">
                  {currentService.category}
                </span>
              )}
            </div>

            <h1 className="font-headline-xl text-3xl sm:text-5xl lg:text-6xl text-bone uppercase font-bold tracking-tight leading-tight">
              {currentService.title}
            </h1>

            <p className="font-label-caps text-sm text-gold tracking-widest uppercase">
              {currentService.subtitle}
            </p>

            <p className="font-body-md text-sm sm:text-base text-bone-muted leading-relaxed max-w-2xl">
              {currentService.longDescription || currentService.description}
            </p>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <button
                onClick={() => onBookService(currentService.id)}
                className="px-8 py-4 bg-crimson hover:bg-crimson-hover text-bone font-label-caps text-xs uppercase tracking-[0.2em] font-bold border border-crimson/40 transition-all flex items-center justify-center gap-2 shadow-xl shadow-crimson/20"
              >
                <Icons8 name="calendar-check" size={16} />
                <span>Book This Discipline</span>
              </button>

              <button
                onClick={() => onNavigate('portfolio')}
                className="px-6 py-4 bg-noir-900 hover:bg-noir-850 text-bone font-label-caps text-xs uppercase tracking-wider border border-noir-700 transition-colors flex items-center justify-center gap-2"
              >
                <span>View Healed Works</span>
                <Icons8 name="arrow-right" size={14} className="text-crimson-light" />
              </button>
            </div>
          </div>

          {/* Right Hero Image */}
          <div className="lg:col-span-5">
            <div className="relative w-full h-[380px] sm:h-[450px] bg-noir-900 border border-noir-700 overflow-hidden shadow-2xl group">
              <img
                src={currentService.image}
                alt={currentService.title}
                className="w-full h-full object-cover interactive-img-zoom filter grayscale group-hover:grayscale-0 contrast-110 brightness-95 group-hover:brightness-100 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-noir-950 via-transparent to-noir-950/20 pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 p-4 bg-noir-950/90 backdrop-blur-md border border-noir-700/80 flex items-center justify-between">
                <div>
                  <span className="font-label-caps text-[10px] text-bone-dim uppercase block">Marvin Tattoos Atelier</span>
                  <strong className="font-label-data text-xs text-bone uppercase">{currentService.title}</strong>
                </div>
                <div className="text-gold">
                  {getServiceIcon(currentService.iconName)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03. SPECIFICATIONS & PARAMETERS */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 w-full py-10">
        <div className="p-6 sm:p-10 bg-noir-900 border border-noir-700/80 shadow-2xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-crimson/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-noir-800 pb-6">
            <div className="space-y-1">
              <span className="font-label-caps text-xs text-crimson-light uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-crimson" />
                <span>Verified Studio Standards</span>
              </span>
              <h2 className="font-headline-sm text-2xl sm:text-3xl text-bone uppercase font-bold">
                Discipline Specifications &amp; Technical Parameters
              </h2>
            </div>
            <span className="text-[11px] font-label-data text-bone-dim uppercase">
              100% Sterile &bull; Autoclave Class-B Certified
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {currentService.specs.map((spec, i) => (
              <div key={i} className="p-5 bg-noir-950 border border-noir-800 hover:border-slate-600 transition-colors space-y-2 group">
                <div className="flex items-center justify-between text-[10px] font-label-caps uppercase tracking-wider text-bone-dim border-b border-noir-850 pb-2">
                  <span>Parameter 0{i + 1}</span>
                  <span className="text-gold group-hover:text-crimson-light transition-colors">Verified</span>
                </div>
                <div>
                  <span className="font-label-caps text-xs text-bone-muted uppercase block">
                    {spec.label}
                  </span>
                  <strong className="font-label-data text-sm sm:text-base text-bone block mt-1 leading-snug">
                    {spec.value}
                  </strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 04. STEP-BY-STEP PROCEDURE TIMELINE */}
      {currentService.processSteps && currentService.processSteps.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 w-full py-12 border-t border-noir-800/80">
          <div className="space-y-8">
            <div className="max-w-2xl space-y-2">
              <span className="font-label-caps text-xs text-crimson-light uppercase tracking-[0.2em]">
                Workflow &amp; Safety Protocol
              </span>
              <h2 className="font-headline-lg text-3xl sm:text-4xl text-bone uppercase font-bold">
                The Procedure Timeline
              </h2>
              <p className="font-body-sm text-sm text-bone-muted leading-relaxed">
                From pre-appointment consultation to sterilized application and healed inspection, every step is executed with precision.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentService.processSteps.map((stepItem, i) => (
                <div key={i} className="p-6 bg-noir-900 border border-noir-700/80 relative space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="font-headline-lg text-3xl font-bold text-crimson-light block">
                      {stepItem.step}
                    </span>
                    <h3 className="font-headline-sm text-lg text-bone uppercase font-bold">
                      {stepItem.title}
                    </h3>
                    <p className="font-body-sm text-xs text-bone-muted leading-relaxed">
                      {stepItem.description}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-noir-800 text-[10px] font-label-data text-bone-dim uppercase">
                    Stage {i + 1} of {currentService.processSteps?.length}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 05. PRICING GUIDANCE TIERS */}
      {currentService.pricingTiers && currentService.pricingTiers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 w-full py-12 border-t border-noir-800/80">
          <div className="space-y-8">
            <div className="max-w-2xl space-y-2">
              <span className="font-label-caps text-xs text-crimson-light uppercase tracking-[0.2em]">
                Transparent Atelier Rates
              </span>
              <h2 className="font-headline-lg text-3xl sm:text-4xl text-bone uppercase font-bold">
                Pricing &amp; Session Tiers
              </h2>
              <p className="font-body-sm text-sm text-bone-muted leading-relaxed">
                Exact rates are confirmed during free consultation based on dimensions, placement, detail density, and skin prep requirements.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {currentService.pricingTiers.map((tier, i) => (
                <div
                  key={i}
                  className={`p-6 border flex flex-col justify-between space-y-6 ${
                    i === 1
                      ? 'bg-noir-900 border-crimson/60 shadow-xl shadow-crimson/10 relative'
                      : 'bg-noir-900/60 border-noir-700/80'
                  }`}
                >
                  {i === 1 && (
                    <span className="absolute -top-3 right-4 px-2.5 py-0.5 bg-crimson text-[9px] font-label-caps uppercase tracking-widest text-bone font-bold">
                      Most Requested
                    </span>
                  )}
                  <div className="space-y-3">
                    <span className="font-label-caps text-xs text-bone-dim uppercase tracking-wider block">
                      Tier 0{i + 1}
                    </span>
                    <h3 className="font-headline-sm text-xl text-bone uppercase font-bold">
                      {tier.tier}
                    </h3>
                    <div className="font-headline-lg text-2xl text-gold font-bold">
                      {tier.price}
                    </div>
                    <p className="font-body-sm text-xs text-bone-muted leading-relaxed">
                      {tier.description}
                    </p>
                  </div>

                  <button
                    onClick={() => onBookService(currentService.id)}
                    className="w-full py-3 bg-noir-850 hover:bg-crimson text-bone font-label-caps text-xs uppercase tracking-wider border border-noir-700 hover:border-crimson transition-all text-center"
                  >
                    Select This Tier
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 06. CURATED SAMPLE GALLERY */}
      {currentService.galleryImages && currentService.galleryImages.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 w-full py-12 border-t border-noir-800/80">
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2">
                <span className="font-label-caps text-xs text-crimson-light uppercase tracking-[0.2em]">
                  Visual Craft Archive
                </span>
                <h2 className="font-headline-lg text-3xl sm:text-4xl text-bone uppercase font-bold">
                  Sample Works in this Discipline
                </h2>
              </div>
              <button
                onClick={() => onNavigate('portfolio')}
                className="text-xs font-label-caps text-bone-dim hover:text-bone uppercase tracking-wider flex items-center gap-1.5"
              >
                <span>View Full 500+ Piece Gallery</span>
                <Icons8 name="arrow-right" size={12} className="text-crimson-light" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentService.galleryImages.map((imgUrl, i) => (
                <div
                  key={i}
                  className="group relative h-72 bg-noir-900 border border-noir-700/80 overflow-hidden cursor-pointer"
                >
                  <img
                    src={imgUrl}
                    alt={`${currentService.title} sample ${i + 1}`}
                    className="w-full h-full object-cover interactive-img-zoom filter grayscale group-hover:grayscale-0 contrast-110 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-noir-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <div className="space-y-1">
                      <span className="font-label-caps text-[10px] text-crimson-light uppercase tracking-wider block">
                        {currentService.title}
                      </span>
                      <strong className="font-label-data text-xs text-bone block uppercase">
                        Sample Archive #{i + 1}
                      </strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 07. PREPARATION & AFTERCARE GUIDELINES */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 w-full py-12 border-t border-noir-800/80">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Prep Guidelines */}
          <div className="p-6 sm:p-8 bg-noir-900 border border-noir-700 space-y-4">
            <div className="flex items-center gap-2 text-gold">
              <Icons8 name="check-circle" size={20} />
              <h3 className="font-headline-sm text-xl text-bone uppercase font-bold">
                Pre-Appointment Preparation
              </h3>
            </div>
            <ul className="space-y-3 pt-2">
              {(currentService.prepGuidelines || [
                'Get a full night of restful sleep prior to your session.',
                'Eat a carbohydrate and protein-rich meal 1-2 hours before arriving.',
                'Stay well hydrated with plenty of water.',
                'Avoid alcohol, energy drinks, and blood thinners 24h prior.',
              ]).map((prep, i) => (
                <li key={i} className="flex items-start gap-3 text-xs sm:text-sm font-body-sm text-bone-muted">
                  <span className="text-crimson-light font-bold">•</span>
                  <span>{prep}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Aftercare Guidelines */}
          <div className="p-6 sm:p-8 bg-noir-900 border border-noir-700 space-y-4">
            <div className="flex items-center gap-2 text-crimson-light">
              <Icons8 name="shield-alt" size={20} />
              <h3 className="font-headline-sm text-xl text-bone uppercase font-bold">
                Sterile Aftercare Protocol
              </h3>
            </div>
            <ul className="space-y-3 pt-2">
              {(currentService.aftercareGuidelines || [
                'Leave protective medical film in place for 3 to 5 days.',
                'Wash gently with lukewarm water and antibacterial unscented cleanser.',
                'Apply specialized healing balm thinly twice daily.',
                'Strictly avoid swimming, saunas, tanning, and direct sun for 4 weeks.',
              ]).map((aftercare, i) => (
                <li key={i} className="flex items-start gap-3 text-xs sm:text-sm font-body-sm text-bone-muted">
                  <span className="text-gold font-bold">•</span>
                  <span>{aftercare}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 08. DISCIPLINE SPECIFIC FAQS */}
      {currentService.faqs && currentService.faqs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 w-full py-12 border-t border-noir-800/80">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <span className="font-label-caps text-xs text-crimson-light uppercase tracking-[0.2em]">
                Client Inquiries
              </span>
              <h2 className="font-headline-lg text-3xl text-bone uppercase font-bold">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3 pt-4">
              {currentService.faqs.map((faq, i) => {
                const isOpen = openFaqIndex === i;
                return (
                  <div key={i} className="border border-noir-700 bg-noir-900 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                      className="w-full p-4 sm:p-5 flex items-center justify-between text-left font-headline-sm text-base uppercase text-bone hover:text-white transition-colors"
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
                          transition={{ duration: 0.25 }}
                          className="px-4 sm:px-5 pb-5 text-xs sm:text-sm font-body-sm text-bone-muted leading-relaxed border-t border-noir-800 pt-3"
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

      {/* 09. EXPLORE OTHER DISCIPLINES SWITCHER */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 w-full py-12 border-t border-noir-800/80">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-xs uppercase text-bone-dim tracking-wider">
              Explore Other Disciplines
            </span>
            <button
              onClick={() => onNavigate('services')}
              className="text-xs font-label-caps text-crimson-light uppercase hover:underline"
            >
              View All Disciplines →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {otherServices.map((other) => (
              <div
                key={other.id}
                onClick={() => onSelectService(other.id)}
                className="p-4 bg-noir-900 hover:bg-noir-850 border border-noir-700/80 hover:border-slate-500 transition-all cursor-pointer flex items-center gap-4 group"
              >
                <img
                  src={other.image}
                  alt={other.title}
                  className="w-14 h-14 object-cover border border-noir-700 shrink-0 filter grayscale group-hover:grayscale-0 transition-all"
                />
                <div className="min-w-0">
                  <span className="font-label-data text-[10px] text-bone-dim uppercase block">
                    Discipline // {other.disciplineNumber}
                  </span>
                  <strong className="font-headline-sm text-sm text-bone uppercase truncate block group-hover:text-white">
                    {other.title}
                  </strong>
                  <span className="text-[10px] font-label-caps text-crimson-light uppercase">
                    {other.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. FIXED / PROMINENT BOOKING CTA */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 w-full mt-8">
        <div className="p-8 sm:p-12 bg-gradient-to-r from-noir-900 via-noir-900 to-noir-850 border border-crimson/40 shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="font-label-caps text-xs uppercase text-crimson-light tracking-[0.2em] block">
              Consultation &amp; Booking
            </span>
            <h2 className="font-headline-lg text-2xl sm:text-3xl text-bone uppercase font-bold">
              Reserve Your {currentService.title} Session
            </h2>
            <p className="font-body-sm text-xs text-bone-muted max-w-xl">
              Complimentary design consultation with Marvin and our resident specialists. Walk-ins welcome on Saturdays.
            </p>
          </div>

          <button
            onClick={() => onBookService(currentService.id)}
            className="w-full sm:w-auto px-8 py-4 bg-crimson hover:bg-crimson-hover text-bone font-label-caps text-xs uppercase tracking-[0.2em] font-bold border border-crimson/60 shadow-xl shadow-crimson/30 transition-all shrink-0 flex items-center justify-center gap-2"
          >
            <Icons8 name="calendar-check" size={16} />
            <span>Book Consultation Now</span>
          </button>
        </div>
      </section>
    </div>
  );
};
