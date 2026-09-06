import React from 'react';
import { PageView } from '../types';
import { ARTISTS_DATA } from '../data/atelierData';
import { motion } from 'framer-motion';
import { ShieldCheck, Award, HeartHandshake, Syringe, Sparkles, MessageCircle } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: PageView) => void;
  onOpenWhatsApp: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, onOpenWhatsApp }) => {
  const masterMarvin = ARTISTS_DATA[0];

  return (
    <div className="w-full pt-20 bg-surface-container-lowest min-h-screen">
      {/* Hero Codex Banner */}
      <section className="relative w-full overflow-hidden bg-surface-container-lowest py-16 md:py-24 border-b border-surface-container-highest/40">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-primary-container/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          {/* Section Tag */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-8 pb-4 border-b border-surface-container-highest/40"
          >
            <div className="flex items-center gap-3">
              <span className="font-label-caps text-xs text-primary tracking-[0.25em]">
                ABOUT THE STUDIO
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-outline-variant" />
              <span className="font-label-data text-xs text-outline">EST. 2014</span>
            </div>
          </motion.div>

          {/* Asymmetric Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Master Portrait Card (7 Cols) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 flex flex-col justify-between bg-surface-container-low rounded-xl overflow-hidden shadow-2xl relative group border border-surface-container-highest/80"
            >
              <div className="relative h-[480px] md:h-[580px] w-full overflow-hidden">
                <img
                  alt="Master Marvin in leather apron holding tattoo machine"
                  className="w-full h-full object-cover object-center filter grayscale contrast-125 brightness-90 group-hover:scale-105 transition-transform duration-700"
                  src={masterMarvin.avatar}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-surface-container-low/25 to-transparent" />

                {/* Floating Top Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-surface-container-lowest/80 backdrop-blur-md text-secondary font-label-caps text-xs flex items-center gap-1.5 shadow border border-secondary/30">
                    <Award className="w-3.5 h-3.5" /> FOUNDER &amp; MASTER TATTOOIST
                  </span>
                  <span className="px-3 py-1 bg-primary-container/90 text-on-primary font-label-caps text-xs shadow border border-primary/30">
                    STERILE PROTOCOL CERTIFIED
                  </span>
                </div>

                {/* Quote Overlay */}
                <div className="absolute bottom-6 left-6 right-6 p-5 bg-surface-container-lowest/90 backdrop-blur-md rounded-lg border border-surface-container-highest">
                  <p className="font-headline-sm text-lg sm:text-xl italic text-on-surface leading-snug">
                    "A tattoo has to work on your body — the placement, the flow, and the way it heals. That's what I focus on, every time."
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-label-caps text-xs text-primary tracking-widest font-bold">
                      — MARVIN
                    </span>
                    <span className="font-label-data text-xs text-on-surface-variant">
                      14+ YEARS
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Master Marvin Specs & Story (5 Cols) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5 flex flex-col justify-between gap-6"
            >
              <div className="bg-surface-container p-6 md:p-8 rounded-xl flex flex-col justify-between h-full shadow-lg border border-surface-container-highest">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Syringe className="w-4 h-4 text-primary" />
                    <span className="font-label-caps text-xs text-primary tracking-wider uppercase">
                      THE FOUNDER
                    </span>
                  </div>
                  <h1 className="font-headline-xl text-3xl sm:text-4xl font-bold text-on-surface mb-2 leading-tight">
                    The Hand Behind The Ink: Marvin
                  </h1>
                  <p className="font-title-editorial text-base italic text-secondary mb-5">
                    Tattooist &amp; former surgical technician
                  </p>
                  <div className="space-y-4 font-body-md text-sm text-on-surface-variant leading-relaxed">
                    <p>
                      Before tattooing, Marvin spent four years working as a surgical trauma technician. It taught him a standard of hygiene and precision that still shapes how the studio runs today — every surface, every cartridge, every piece of equipment.
                    </p>
                    <p>
                      He opened Marvin Tattoos in 2014 with one rule: permanent work deserves to be clean, well-planned, and made to fit the person wearing it. That's still how every appointment works.
                    </p>
                  </div>
                </div>

                {/* Metrics Bar */}
                <div className="grid grid-cols-3 gap-3 mt-8 pt-6 bg-surface-container-high/60 p-4 rounded-lg border border-surface-container-highest">
                  <div className="flex flex-col">
                    <span className="font-label-data text-2xl font-bold text-primary">14+</span>
                    <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">
                      Years
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-data text-2xl font-bold text-on-surface">500+</span>
                    <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">
                      Pieces Done
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-data text-2xl font-bold text-secondary">App</span>
                    <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">
                      Piercing Certified
                    </span>
                  </div>
                </div>
              </div>

              {/* WhatsApp Consultation Card */}
              <div className="bg-surface-container-high p-5 rounded-xl flex items-center justify-between gap-4 border border-surface-container-highest">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/20 border border-secondary flex items-center justify-center text-secondary shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-title-editorial text-sm uppercase text-on-surface font-bold">
                      Questions?
                    </span>
                    <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">
                      Message us on WhatsApp for a consult
                    </span>
                  </div>
                </div>
                <button
                  onClick={onOpenWhatsApp}
                  className="px-4 py-2 bg-secondary hover:bg-secondary-fixed text-on-secondary font-label-caps text-xs uppercase font-bold transition-colors"
                >
                  Inquire
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Studio Values */}
      <section className="w-full bg-surface-container-lowest py-20 px-4 md:px-8 lg:px-12 border-b border-surface-container-highest/40">
        <div className="max-w-7xl mx-auto space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col md:flex-row md:items-end justify-between"
          >
            <div>
              <span className="font-label-caps text-xs text-primary tracking-[0.2em] block mb-2">
                HOW WE WORK
              </span>
              <h2 className="font-headline-lg text-3xl sm:text-4xl text-on-surface uppercase font-bold">
                What To Expect
              </h2>
            </div>
            <p className="font-body-sm text-sm text-on-surface-variant max-w-md mt-4 md:mt-0 leading-relaxed">
              Three standards every appointment follows — no exceptions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                num: '01',
                icon: <ShieldCheck className="w-6 h-6 text-on-surface-variant" />,
                title: 'Clean, Every Time',
                desc: "Class B autoclave sterilization, single-use cartridges, and fresh barriers on every surface. The standard comes from Marvin's years as a surgical technician and it never slips.",
                tag: 'Sterile & Certified',
                accent: 'primary'
              },
              {
                num: '02',
                icon: <Sparkles className="w-6 h-6 text-on-surface-variant" />,
                title: 'Made For Your Body',
                desc: 'Designs are drawn freehand and placed to flow with your muscles and joints — never stamped flat. What looks good in a photo has to work in real life.',
                tag: 'Freehand & Anatomical',
                accent: 'primary'
              },
              {
                num: '03',
                icon: <HeartHandshake className="w-6 h-6 text-on-surface-variant" />,
                title: 'Right The First Time',
                desc: 'We plan carefully and go at the right pace for you. You get clear aftercare and we check in to make sure it heals the way it should.',
                tag: 'Proper Aftercare',
                accent: 'primary'
              }
            ].map((codex, idx) => (
              <motion.div
                key={codex.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="bg-surface-container p-8 rounded-xl flex flex-col justify-between shadow-lg relative overflow-hidden group border border-surface-container-highest hover:border-primary/30 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-label-data text-3xl font-bold text-primary">
                      {codex.num}
                    </span>
                    {codex.icon}
                  </div>
                  <h3 className="font-headline-sm text-xl text-on-surface mb-3 uppercase font-bold">
                    {codex.title}
                  </h3>
                  <p className="font-body-md text-sm text-on-surface-variant leading-relaxed mb-6">
                    {codex.desc}
                  </p>
                </div>
                <div className="pt-4 border-t border-surface-container-highest text-xs font-label-data text-outline uppercase">
                  {codex.tag}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Resident Master Artists Roster */}
      <section className="w-full bg-surface-container-lowest py-20 px-4 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-2xl mx-auto space-y-2"
          >
            <span className="font-label-caps text-xs uppercase text-primary tracking-[0.25em]">
              THE ARTISTS
            </span>
            <h2 className="font-headline-xl text-3xl sm:text-4xl text-on-surface uppercase font-bold">
              Our Tattoo &amp; Piercing Team
            </h2>
            <p className="font-body-md text-sm text-on-surface-variant">
              Each artist has their own style and specialties. Pick the one that fits your idea.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ARTISTS_DATA.map((art, idx) => (
              <motion.div
                key={art.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="bg-surface-container rounded-xl overflow-hidden shadow-xl border border-surface-container-highest flex flex-col justify-between gothic-card"
              >
                <div className="relative h-72 overflow-hidden bg-surface-dim">
                  <img
                    src={art.avatar}
                    alt={art.name}
                    className="w-full h-full object-cover interactive-img-zoom"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                    {art.badges.map((b, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-surface-container-lowest/90 backdrop-blur-sm text-primary font-label-caps text-[9px] uppercase tracking-wider border border-primary/30"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-headline-sm text-xl text-on-surface uppercase font-bold">
                        {art.name}
                      </h3>
                      <span className="font-label-data text-xs text-primary">{art.experience}</span>
                    </div>
                    <span className="font-label-caps text-xs text-secondary uppercase block mb-3">
                      {art.specialty}
                    </span>
                    <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                      {art.bio}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-surface-container-highest/60 flex items-center justify-between gap-3">
                    <button
                      onClick={() => onNavigate('booking')}
                      className="w-full py-2.5 bg-primary-container hover:bg-on-primary-fixed-variant text-on-surface font-label-caps text-xs uppercase tracking-wider transition-all btn-gothic-glow text-center border border-primary/30"
                    >
                      Book With {art.name.split(' ')[0]}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
