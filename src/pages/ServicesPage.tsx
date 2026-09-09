import React, { useState, useEffect } from 'react';
import { PageView, ServiceItem } from '../types';
import { SERVICES_DATA } from '../data/atelierData';
import { fetchServices } from '../services/apiClient';
import { Icons8 } from '../components/Icons8';

interface ServicesPageProps {
  onNavigate: (page: PageView) => void;
  onSelectService: (serviceId: string) => void;
  onBookService: (serviceId: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  onNavigate,
  onSelectService,
  onBookService,
}) => {
  const [servicesList, setServicesList] = useState<ServiceItem[]>(SERVICES_DATA);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  useEffect(() => {
    fetchServices().then(setServicesList).catch(() => {});
  }, []);

  const categories = [
    { id: 'ALL', label: 'All Disciplines' },
    { id: 'TATTOO', label: 'Custom Tattoos' },
    { id: 'PIERCING', label: 'Body Piercing' },
    { id: 'PMU', label: 'Semi-Permanent PMU' },
    { id: 'REMOVAL', label: 'Laser & Clearance' },
  ];

  const filteredServices = servicesList.filter((service) => {
    if (selectedCategory === 'ALL') return true;
    const cat = service.category?.toUpperCase();
    if (selectedCategory === 'TATTOO') {
      return cat === 'TATTOO' || !cat;
    }
    return cat === selectedCategory;
  });

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'skull':
        return <Icons8 name="skull" size={20} />;
      case 'edit_note':
        return <Icons8 name="pen-fancy" size={20} />;
      case 'colorize':
        return <Icons8 name="syringe" size={20} />;
      case 'layers':
      default:
        return <Icons8 name="layer-group" size={20} />;
    }
  };

  return (
    <div className="w-full flex flex-col bg-noir-950 text-bone pt-28 pb-20">
      {/* 01. EDITORIAL HEADER */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 w-full pb-12 border-b border-noir-700/60">
        <div className="space-y-4 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-label-caps uppercase tracking-[0.25em] text-crimson-light">
            <span className="w-2 h-2 rounded-full bg-crimson animate-pulse" />
            <span>Studio Disciplines Directory</span>
          </div>
          <h1 className="font-headline-xl text-3xl sm:text-5xl lg:text-6xl text-bone uppercase font-bold tracking-tight">
            Master Craftsmanship &amp; Body Art
          </h1>
          <p className="font-body-md text-sm sm:text-base text-bone-muted leading-relaxed">
            From surgical black-and-grey photo-realism and freehand Chicano script to implant-grade titanium body piercings and dermatological skin clearance. Every service is executed under strict hospital-grade sterilization with transparent pricing and private consultation rooms.
          </p>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-noir-800">
          <div className="p-4 bg-noir-900 border border-noir-700/60">
            <span className="font-label-caps text-[10px] text-bone-dim uppercase block">Sterilization</span>
            <strong className="font-label-data text-sm text-bone">Autoclave Class-B</strong>
          </div>
          <div className="p-4 bg-noir-900 border border-noir-700/60">
            <span className="font-label-caps text-[10px] text-bone-dim uppercase block">Jewelry Standard</span>
            <strong className="font-label-data text-sm text-gold">ASTM F-136 Titanium</strong>
          </div>
          <div className="p-4 bg-noir-900 border border-noir-700/60">
            <span className="font-label-caps text-[10px] text-bone-dim uppercase block">Pigment Suite</span>
            <strong className="font-label-data text-sm text-bone">Dynamic Triple Black</strong>
          </div>
          <div className="p-4 bg-noir-900 border border-noir-700/60">
            <span className="font-label-caps text-[10px] text-bone-dim uppercase block">Consultations</span>
            <strong className="font-label-data text-sm text-crimson-light">100% Free &amp; Private</strong>
          </div>
        </div>
      </section>

      {/* 02. CATEGORY FILTER TABS */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 w-full py-8">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => {
            const count = cat.id === 'ALL'
              ? servicesList.length
              : servicesList.filter(s => (cat.id === 'TATTOO' ? (s.category?.toUpperCase() === 'TATTOO' || !s.category) : s.category?.toUpperCase() === cat.id)).length;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 text-xs font-label-caps uppercase tracking-wider transition-all duration-200 border flex items-center gap-2 ${
                  isActive
                    ? 'bg-crimson text-bone border-crimson shadow-lg shadow-crimson/20 font-bold'
                    : 'bg-noir-900 hover:bg-noir-850 text-bone-muted hover:text-bone border-noir-700/80'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-label-data ${
                  isActive ? 'bg-noir-950/40 text-bone' : 'bg-noir-950 text-bone-dim'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 03. SERVICES GRID */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <article
              key={service.id}
              className="group flex flex-col bg-noir-900 border border-noir-700/80 hover:border-slate-400 transition-all duration-300 shadow-xl overflow-hidden justify-between"
            >
              <div>
                {/* Hero Photo with Badges */}
                <div
                  onClick={() => onSelectService(service.id)}
                  className="w-full h-64 overflow-hidden bg-noir-950 relative border-b border-noir-700/60 cursor-pointer"
                >
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover interactive-img-zoom filter grayscale group-hover:grayscale-0 contrast-110 brightness-95 group-hover:brightness-100 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-noir-950 via-transparent to-noir-950/40 pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-noir-950/90 backdrop-blur-md text-[11px] font-label-data uppercase tracking-wider text-bone-dim border border-noir-700/80">
                    Discipline // {service.disciplineNumber}
                  </div>

                  {service.category && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 bg-crimson/90 backdrop-blur-md text-[10px] font-label-caps uppercase tracking-wider text-bone font-bold border border-crimson/40">
                      {service.category}
                    </div>
                  )}

                  {/* Bottom Subtitle Bar */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-label-data text-bone-muted bg-noir-950/85 backdrop-blur-sm px-3 py-1.5 border border-noir-700/60">
                    <span className="truncate uppercase tracking-wider text-bone font-medium">{service.subtitle}</span>
                    <div className="text-gold flex-shrink-0 ml-2">
                      {getServiceIcon(service.iconName)}
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h2
                      onClick={() => onSelectService(service.id)}
                      className="font-headline-sm text-2xl text-bone uppercase tracking-tight group-hover:text-white font-bold transition-colors cursor-pointer"
                    >
                      {service.title}
                    </h2>
                    <p className="font-body-sm text-xs sm:text-sm text-bone-muted leading-relaxed mt-2 line-clamp-2">
                      {service.description}
                    </p>
                  </div>

                  {/* Quick Specs Pill Badges */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    {service.specs.slice(0, 2).map((spec, i) => (
                      <div key={i} className="p-2 bg-noir-950/80 border border-noir-800 rounded-sm">
                        <span className="text-[10px] font-label-caps text-bone-dim uppercase block">{spec.label}</span>
                        <strong className="text-[11px] font-label-data text-bone truncate block">{spec.value}</strong>
                      </div>
                    ))}
                  </div>

                  {/* Pricing Starting Tag if available */}
                  {service.pricingTiers && service.pricingTiers[0] && (
                    <div className="flex items-baseline justify-between text-xs font-label-data pt-2 border-t border-noir-800">
                      <span className="text-bone-dim uppercase text-[10px]">Starting Rate:</span>
                      <span className="text-gold font-bold">{service.pricingTiers[0].price}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-0 space-y-2">
                <button
                  type="button"
                  onClick={() => onSelectService(service.id)}
                  className="w-full py-2.5 px-4 bg-noir-850 hover:bg-noir-800 text-bone font-label-caps text-xs uppercase tracking-wider border border-noir-700 hover:border-slate-500 transition-all flex items-center justify-center gap-2"
                >
                  <span>Explore Discipline Guide</span>
                  <Icons8 name="arrow-right" size={14} className="text-crimson-light" />
                </button>

                <button
                  type="button"
                  onClick={() => onBookService(service.id)}
                  className="w-full py-3 px-4 bg-crimson hover:bg-crimson-hover text-bone font-label-caps text-xs uppercase tracking-[0.15em] border border-crimson/40 transition-all flex items-center justify-center gap-2 font-bold shadow-md shadow-crimson/20"
                >
                  <Icons8 name="calendar-check" size={14} />
                  <span>Book Consultation</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 04. STUDIO STANDARDS ACCORDION BANNER */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 w-full mt-20">
        <div className="p-8 sm:p-12 bg-noir-900 border border-noir-700 relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-crimson/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="font-label-caps text-xs uppercase text-crimson-light tracking-[0.25em]">
                Bespoke Consultations &amp; Custom Markings
              </span>
              <h2 className="font-headline-lg text-3xl sm:text-4xl text-bone uppercase font-bold">
                Ready to Bring Your Vision to Life?
              </h2>
              <p className="font-body-md text-sm text-bone-muted max-w-2xl leading-relaxed">
                Whether you have a fully rendered reference, a cover-up challenge, or a custom lettering concept, Marvin and our resident artists provide complimentary 1-on-1 consultations to map your ideas to your anatomy.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              <button
                onClick={() => onNavigate('booking')}
                className="w-full py-4 px-6 bg-crimson hover:bg-crimson-hover text-bone font-label-caps text-xs uppercase tracking-[0.2em] font-bold border border-crimson/40 transition-all text-center flex items-center justify-center gap-2 shadow-lg shadow-crimson/25"
              >
                <Icons8 name="calendar-check" size={16} />
                <span>Reserve Appointment</span>
              </button>
              <button
                onClick={() => onNavigate('portfolio')}
                className="w-full py-3.5 px-6 bg-noir-950 hover:bg-noir-850 text-bone font-label-caps text-xs uppercase tracking-wider border border-noir-700 transition-colors text-center"
              >
                Browse Healed Portfolio
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
