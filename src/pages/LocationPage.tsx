import React from 'react';
import { PageView } from '../types';
import { MapPin, Navigation, Train, Car, Calendar, MessageCircle } from 'lucide-react';

interface LocationPageProps {
  onNavigate: (page: PageView) => void;
  onOpenWhatsApp: () => void;
  onOpenVerify: () => void;
}

export const LocationPage: React.FC<LocationPageProps> = ({
  onNavigate,
  onOpenWhatsApp,
  onOpenVerify
}) => {
  return (
    <div className="w-full pt-20 bg-surface-container-lowest min-h-screen">
      {/* Header */}
      <section className="w-full bg-surface-container-low py-12 md:py-16 px-4 md:px-8 lg:px-12 border-b border-surface-container-highest/40">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="font-label-caps text-xs uppercase text-primary tracking-[0.25em]">
              VISIT THE STUDIO
            </span>
          </div>
          <h1 className="font-headline-xl text-3xl sm:text-4xl md:text-5xl text-on-surface uppercase font-bold">
            04 Obsidian Alley, Floor 03 — New York
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant max-w-2xl leading-relaxed">
            Tucked in the historic Cultural Quarter. Private consultation rooms, a clean piercing studio, and strict hygiene protocols throughout.
          </p>
        </div>
      </section>

      {/* Grid: Map & Transit */}
      <section className="w-full px-4 md:px-8 lg:px-12 py-16 bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Map Visual (7 Cols) */}
            <div className="lg:col-span-7 bg-surface-container overflow-hidden shadow-2xl border border-surface-container-highest flex flex-col justify-between">
              <div className="w-full h-96 relative bg-cover bg-center" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDREC5pLTdXJO9fp7vuWhpIAppPWmY4qSTJFCXzqlUcHi3fZn0gVE-noAZzaS8SEDDLh1lZ4oFoupXQ5NuT2OZdFMFRBi9bf1rXRgjL5JVQDM5eOljrx_syn6Z_sjQ5Q3bz0ZjyL8BL1VfcSpTQSddMSSp_sHB62jK0ST79vxxgbvglq3jteejwFoma9kAsCXzziKmSSyrh11T-SMQQ4TL_pVcDo1x_MBWIVx9omsFuPYnfkoalDF-y7g')` }}>
                <div className="absolute inset-0 bg-surface-container-lowest/40" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="p-3.5 bg-primary-container text-on-surface rounded-full shadow-2xl border border-primary/40">
                    <MapPin className="w-8 h-8 text-primary" />
                  </div>
                  <span className="font-label-caps text-xs uppercase bg-surface-container-lowest px-3.5 py-1.5 text-on-surface mt-2 shadow-xl border border-outline-variant/40">
                    Marvin Tattoos · Obsidian Alley
                  </span>
                </div>
              </div>

              <div className="p-6 bg-surface-container space-y-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-surface-container-highest">
                  <div>
                    <h3 className="font-title-editorial text-base uppercase text-on-surface">
                      Find Us
                    </h3>
                    <p className="font-body-sm text-xs text-outline">
                      04 Obsidian Alley, Floor 03, Cultural Quarter, New York, NY 10013
                    </p>
                  </div>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-caps text-xs uppercase tracking-wider transition-colors flex items-center gap-2 shrink-0"
                  >
                    <Navigation className="w-3.5 h-3.5 text-primary" />
                    <span>Open in Maps</span>
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-body-sm">
                  <div className="p-3 bg-surface-container-low border border-surface-container-highest space-y-1">
                    <div className="flex items-center gap-1.5 font-label-caps text-xs text-secondary uppercase">
                      <Train className="w-4 h-4" />
                      <span>Subway &amp; Transit</span>
                    </div>
                    <p className="text-outline">
                      Canal St / Broadway Subway Station (Lines N, Q, R, W, 6, J, Z) — 3 minutes walking.
                    </p>
                  </div>

                  <div className="p-3 bg-surface-container-low border border-surface-container-highest space-y-1">
                    <div className="flex items-center gap-1.5 font-label-caps text-xs text-primary uppercase">
                      <Car className="w-4 h-4" />
                      <span>Private Parking</span>
                    </div>
                    <p className="text-outline">
                      Secure valet parking available at Obsidian Garage (Corner of Mercer &amp; Howard).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Operating Schedule & Protocols (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-surface-container p-6 sm:p-8 shadow-2xl border border-surface-container-highest space-y-6">
              <div className="space-y-6">
                <div className="space-y-1">
                  <span className="font-label-caps text-xs uppercase text-primary tracking-[0.25em]">
                    STUDIO HOURS
                  </span>
                  <h3 className="font-headline-lg text-2xl text-on-surface uppercase font-bold">
                    Visit Us
                  </h3>
                </div>

                <div className="space-y-2 font-label-data text-xs">
                  <div className="flex justify-between items-center py-2.5 bg-surface-container-low px-3 border border-surface-container-highest/60">
                    <span className="text-on-surface">Tuesday — Friday</span>
                    <span className="text-on-surface-variant font-bold">11:00 — 21:00</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 bg-surface-container-high px-3 border border-secondary/40">
                    <div className="flex items-center gap-2">
                      <span className="text-secondary font-bold">Saturday</span>
                      <span className="px-1.5 py-0.5 bg-secondary text-on-secondary font-label-caps text-[9px] uppercase">
                        Walk-Ins Open
                      </span>
                    </div>
                    <span className="text-secondary font-bold">11:00 — 21:00</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 bg-surface-container-low px-3 border border-surface-container-highest/60">
                    <span className="text-on-surface">Sunday</span>
                    <span className="text-on-surface-variant">12:00 — 18:00 (Private Sessions)</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 bg-surface-container-lowest px-3 text-outline border border-surface-container-highest/40">
                    <span>Monday</span>
                    <span className="uppercase font-label-caps text-[10px]">Closed</span>
                  </div>
                </div>

                <div className="p-4 bg-surface-container-low border-l-2 border-secondary space-y-1">
                  <div className="font-label-caps text-xs uppercase text-secondary">
                    Saturday Walk-Ins
                  </div>
                  <p className="font-body-sm text-xs text-outline leading-relaxed">
                    Walk-in flash designs are first-come, first-served every Saturday from 10:45 AM. Larger pieces — backpieces, sleeves, and cover-ups — require a consultation.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-3">
                <button
                  onClick={() => onNavigate('booking')}
                  className="w-full py-3.5 bg-primary-container hover:bg-on-primary-fixed-variant text-on-surface font-label-caps text-xs uppercase tracking-[0.2em] transition-all btn-gothic-glow flex items-center justify-center gap-2 border border-primary/30"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book a Consultation</span>
                </button>
                <button
                  onClick={onOpenWhatsApp}
                  className="w-full py-3 bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-caps text-xs uppercase tracking-wider transition-colors border border-surface-container-highest flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-secondary" />
                  <span>Message Us on WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
