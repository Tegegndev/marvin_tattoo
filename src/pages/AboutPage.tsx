import React from 'react';
import { PageView } from '../types';
import { ARTISTS_DATA, HERO_IMAGE } from '../data/atelierData';
import { ShieldCheck, Award, HeartHandshake, Syringe, Sparkles, MessageCircle } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: PageView) => void;
  onOpenWhatsApp: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, onOpenWhatsApp }) => {
  const masterMarvin = ARTISTS_DATA[0];

  return (
    <div className="w-full pt-20 bg-noir-950 min-h-screen">
      {/* Hero Banner */}
      <section className="relative w-full overflow-hidden bg-noir-950 py-16 md:py-24 border-b border-noir-700/40">
        {/* Ambient Hero Background */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 filter grayscale contrast-125 scale-105 pointer-events-none"
          style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-noir-950/75 via-noir-950/50 to-noir-950 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          {/* Section Tag */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-noir-700/40">
            <div className="flex items-center gap-3">
              <span className="font-label-caps text-xs text-crimson-light tracking-[0.25em]">
                ABOUT THE STUDIO
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-noir-600" />
              <span className="font-label-data text-xs text-bone-dim">EST. 2014</span>
            </div>
          </div>

          {/* Asymmetric Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Master Portrait Card (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between bg-noir-900 rounded-xl overflow-hidden relative group border border-noir-700/80">
              <div className="relative h-[480px] md:h-[580px] w-full overflow-hidden">
                <img
                  alt="Marvin - Founder & Resident Tattooist"
                  className="w-full h-full object-cover object-[center_15%] scale-105 filter grayscale contrast-125 brightness-95 transition-all duration-700 ease-out group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100 group-hover:scale-110"
                  src={masterMarvin.avatar}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-noir-900 via-noir-900/25 to-transparent" />

                {/* Floating Top Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-noir-950/80 backdrop-blur-md text-gold font-label-caps text-xs flex items-center gap-1.5 border border-gold/30">
                    <Award className="w-3.5 h-3.5" /> FOUNDER &amp; RESIDENT ARTIST
                  </span>
                  <span className="px-3 py-1 bg-crimson/90 text-bone font-label-caps text-xs border border-crimson/30">
                    STERILE PROTOCOL CERTIFIED
                  </span>
                </div>

                {/* Quote Overlay */}
                <div className="absolute bottom-6 left-6 right-6 p-5 bg-noir-950/90 backdrop-blur-md rounded-lg border border-noir-700">
                  <p className="font-headline-sm text-lg sm:text-xl italic text-bone leading-snug">
                    "A tattoo has to work on your body — the placement, the flow, and the way it heals. That's what I focus on, every time."
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-label-caps text-xs text-crimson-light tracking-widest font-bold">
                      — MARVIN
                    </span>
                    <span className="font-label-data text-xs text-bone-muted">
                      14+ YEARS
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Marvin Specs & Story (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-6">
              <div className="bg-noir-850 p-6 md:p-8 rounded-xl flex flex-col justify-between h-full border border-noir-700">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Syringe className="w-4 h-4 text-crimson-light" />
                    <span className="font-label-caps text-xs text-crimson-light tracking-wider uppercase">
                      THE FOUNDER
                    </span>
                  </div>
                  <h1 className="font-headline-xl text-3xl sm:text-4xl font-bold text-bone mb-2 leading-tight">
                    The Hand Behind The Ink: Marvin
                  </h1>
                  <p className="font-title-editorial text-base italic text-gold mb-5">
                    Tattooist &amp; former surgical technician
                  </p>
                  <div className="space-y-4 font-body-md text-sm text-bone-muted leading-relaxed">
                    <p>
                      Before tattooing, Marvin spent four years working as a surgical trauma technician. It taught him a standard of hygiene and precision that still shapes how the studio runs today — every surface, every cartridge, every piece of equipment.
                    </p>
                    <p>
                      He opened Marvin Tattoos in 2014 with one rule: permanent work deserves to be clean, well-planned, and made to fit the person wearing it. That's still how every appointment works.
                    </p>
                  </div>
                </div>

                {/* Metrics Bar */}
                <div className="grid grid-cols-3 gap-3 mt-8 pt-6 bg-noir-800/60 p-4 rounded-lg border border-noir-700">
                  <div className="flex flex-col">
                    <span className="font-label-data text-2xl font-bold text-crimson-light">14+</span>
                    <span className="font-label-caps text-[10px] text-bone-muted uppercase">
                      Years
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-data text-2xl font-bold text-bone">500+</span>
                    <span className="font-label-caps text-[10px] text-bone-muted uppercase">
                      Pieces Done
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-data text-2xl font-bold text-gold">App</span>
                    <span className="font-label-caps text-[10px] text-bone-muted uppercase">
                      Piercing Certified
                    </span>
                  </div>
                </div>
              </div>

              {/* WhatsApp Consultation Card */}
              <div className="bg-noir-800 p-5 rounded-xl flex items-center justify-between gap-4 border border-noir-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold flex items-center justify-center text-gold shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-title-editorial text-sm uppercase text-bone font-bold">
                      Questions?
                    </span>
                    <span className="font-label-caps text-[10px] text-bone-muted uppercase">
                      Message us on WhatsApp for a consult
                    </span>
                  </div>
                </div>
                <button
                  onClick={onOpenWhatsApp}
                  className="px-4 py-2 bg-gold hover:bg-gold-light text-noir-950 font-label-caps text-xs uppercase font-bold transition-colors"
                >
                  Inquire
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Studio Values */}
      <section className="w-full bg-noir-950 py-20 px-4 md:px-8 lg:px-12 border-b border-noir-700/40">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between">
            <div>
              <span className="font-label-caps text-xs text-crimson-light tracking-[0.2em] block mb-2">
                HOW WE WORK
              </span>
              <h2 className="font-headline-lg text-3xl sm:text-4xl text-bone uppercase font-bold">
                What To Expect
              </h2>
            </div>
            <p className="font-body-sm text-sm text-bone-muted max-w-md mt-4 md:mt-0 leading-relaxed">
              Three standards every appointment follows — no exceptions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                num: '01',
                icon: <ShieldCheck className="w-6 h-6 text-bone-muted" />,
                title: 'Clean, Every Time',
                desc: "Class B autoclave sterilization, single-use cartridges, and fresh barriers on every surface. The standard comes from Marvin's years as a surgical technician and it never slips.",
                tag: 'Sterile & Certified',
                accent: 'primary'
              },
              {
                num: '02',
                icon: <Sparkles className="w-6 h-6 text-bone-muted" />,
                title: 'Made For Your Body',
                desc: 'Designs are drawn freehand and placed to flow with your muscles and joints — never stamped flat. What looks good in a photo has to work in real life.',
                tag: 'Freehand & Anatomical',
                accent: 'primary'
              },
              {
                num: '03',
                icon: <HeartHandshake className="w-6 h-6 text-bone-muted" />,
                title: 'Right The First Time',
                desc: 'We plan carefully and go at the right pace for you. You get clear aftercare and we check in to make sure it heals the way it should.',
                tag: 'Proper Aftercare',
                accent: 'primary'
              }
            ].map((codex) => (
              <div
                key={codex.num}
                className="bg-noir-850 p-8 rounded-xl flex flex-col justify-between relative overflow-hidden group border border-noir-700 hover:border-crimson/30 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-label-data text-3xl font-bold text-crimson-light">
                      {codex.num}
                    </span>
                    {codex.icon}
                  </div>
                  <h3 className="font-headline-sm text-xl text-bone mb-3 uppercase font-bold">
                    {codex.title}
                  </h3>
                  <p className="font-body-md text-sm text-bone-muted leading-relaxed mb-6">
                    {codex.desc}
                  </p>
                </div>
                <div className="pt-4 border-t border-noir-700 text-xs font-label-data text-bone-dim uppercase">
                  {codex.tag}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resident Master Artists Roster */}
      <section className="w-full bg-noir-950 py-20 px-4 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="font-label-caps text-xs uppercase text-crimson-light tracking-[0.25em]">
              THE ARTISTS
            </span>
            <h2 className="font-headline-xl text-3xl sm:text-4xl text-bone uppercase font-bold">
              Our Tattoo &amp; Piercing Team
            </h2>
            <p className="font-body-md text-sm text-bone-muted">
              Each artist has their own style and specialties. Pick the one that fits your idea.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ARTISTS_DATA.map((art) => (
              <div
                key={art.id}
                className="bg-noir-850 rounded-xl overflow-hidden border border-noir-700 flex flex-col justify-between gothic-card"
              >
                <div className="relative h-72 overflow-hidden bg-noir-950">
                  <img
                    src={art.avatar}
                    alt={art.name}
                    className="w-full h-full object-cover interactive-img-zoom"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                    {art.badges.map((b, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-noir-950/90 backdrop-blur-sm text-crimson-light font-label-caps text-[9px] uppercase tracking-wider border border-crimson/30"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-headline-sm text-xl text-bone uppercase font-bold">
                        {art.name}
                      </h3>
                      <span className="font-label-data text-xs text-crimson-light">{art.experience}</span>
                    </div>
                    <span className="font-label-caps text-xs text-gold uppercase block mb-3">
                      {art.specialty}
                    </span>
                    <p className="font-body-sm text-xs text-bone-muted leading-relaxed">
                      {art.bio}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-noir-700/60 flex items-center justify-between gap-3">
                    <button
                      onClick={() => onNavigate('booking')}
                      className="w-full py-2.5 bg-crimson hover:bg-crimson-hover text-bone font-label-caps text-xs uppercase tracking-wider transition-all btn-gothic-glow text-center border border-crimson/30"
                    >
                      Book With {art.name.split(' ')[0]}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
