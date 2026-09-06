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
    <div className="w-full pt-20 bg-noir-950 min-h-screen">
      {/* Header */}
      <section className="w-full bg-noir-900 py-12 md:py-16 px-4 md:px-8 lg:px-12 border-b border-noir-700/40">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-crimson" />
            <span className="font-label-caps text-xs uppercase text-crimson-light tracking-[0.25em]">
              VISIT THE STUDIO
            </span>
          </div>
          <h1 className="font-headline-xl text-3xl sm:text-4xl md:text-5xl text-bone uppercase font-bold">
            142 Mercer Street, Suite 3B — SoHo, New York
          </h1>
          <p className="font-body-md text-sm text-bone-muted max-w-2xl leading-relaxed">
            Located in the heart of SoHo. Private consultation rooms, a dedicated sterile piercing suite, and medical-grade hygiene protocols throughout.
          </p>
        </div>
      </section>

      {/* Grid: Map & Transit */}
      <section className="w-full px-4 md:px-8 lg:px-12 py-16 bg-noir-950">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Map Visual (7 Cols) */}
            <div className="lg:col-span-7 bg-noir-850 overflow-hidden border border-noir-700 flex flex-col justify-between">
              <div className="w-full h-96 relative bg-cover bg-center" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDREC5pLTdXJO9fp7vuWhpIAppPWmY4qSTJFCXzqlUcHi3fZn0gVE-noAZzaS8SEDDLh1lZ4oFoupXQ5NuT2OZdFMFRBi9bf1rXRgjL5JVQDM5eOljrx_syn6Z_sjQ5Q3bz0ZjyL8BL1VfcSpTQSddMSSp_sHB62jK0ST79vxxgbvglq3jteejwFoma9kAsCXzziKmSSyrh11T-SMQQ4TL_pVcDo1x_MBWIVx9omsFuPYnfkoalDF-y7g')` }}>
                <div className="absolute inset-0 bg-noir-950/40" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="p-3.5 bg-crimson text-bone rounded-full border border-crimson/40">
                    <MapPin className="w-8 h-8 text-crimson-light" />
                  </div>
                  <span className="font-label-caps text-xs uppercase bg-noir-950 px-3.5 py-1.5 text-bone mt-2 border border-noir-700/40">
                    Marvin Tattoos · SoHo Atelier
                  </span>
                </div>
              </div>

              <div className="p-6 bg-noir-850 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-noir-700">
                  <div>
                    <h3 className="font-title-editorial text-base uppercase text-bone">
                      Find Us
                    </h3>
                    <p className="font-body-sm text-xs text-bone-dim">
                      142 Mercer Street, Suite 3B, SoHo, New York, NY 10012
                    </p>
                  </div>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-noir-800 hover:bg-noir-700 text-bone font-label-caps text-xs uppercase tracking-wider transition-colors flex items-center gap-2 shrink-0"
                  >
                    <Navigation className="w-3.5 h-3.5 text-crimson-light" />
                    <span>Open in Maps</span>
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-body-sm">
                  <div className="p-3 bg-noir-900 border border-noir-700 space-y-1">
                    <div className="flex items-center gap-1.5 font-label-caps text-xs text-gold uppercase">
                      <Train className="w-4 h-4" />
                      <span>Subway &amp; Transit</span>
                    </div>
                    <p className="text-bone-dim">
                      Prince St (Lines N, Q, R, W) or Spring St (Lines 6, C, E) — 3 minutes walking.
                    </p>
                  </div>

                  <div className="p-3 bg-noir-900 border border-noir-700 space-y-1">
                    <div className="flex items-center gap-1.5 font-label-caps text-xs text-crimson-light uppercase">
                      <Car className="w-4 h-4" />
                      <span>Garage Parking</span>
                    </div>
                    <p className="text-bone-dim">
                      Parking available at Mercer &amp; Howard Garage (Corner of Mercer &amp; Howard St).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Operating Schedule & Protocols (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-noir-850 p-6 sm:p-8 border border-noir-700 space-y-6">
              <div className="space-y-6">
                <div className="space-y-1">
                  <span className="font-label-caps text-xs uppercase text-crimson-light tracking-[0.25em]">
                    STUDIO HOURS
                  </span>
                  <h3 className="font-headline-lg text-2xl text-bone uppercase font-bold">
                    Visit Us
                  </h3>
                </div>

                <div className="space-y-2 font-label-data text-xs">
                  <div className="flex justify-between items-center py-2.5 bg-noir-900 px-3 border border-noir-700/60">
                    <span className="text-bone">Tuesday — Friday</span>
                    <span className="text-bone-muted font-bold">11:00 — 21:00</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 bg-noir-800 px-3 border border-gold/40">
                    <div className="flex items-center gap-2">
                      <span className="text-gold font-bold">Saturday</span>
                      <span className="px-1.5 py-0.5 bg-gold text-noir-950 font-label-caps text-[9px] uppercase">
                        Walk-Ins Open
                      </span>
                    </div>
                    <span className="text-gold font-bold">11:00 — 21:00</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 bg-noir-900 px-3 border border-noir-700/60">
                    <span className="text-bone">Sunday</span>
                    <span className="text-bone-muted">12:00 — 18:00 (Private Sessions)</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 bg-noir-950 px-3 text-bone-dim border border-noir-700/40">
                    <span>Monday</span>
                    <span className="uppercase font-label-caps text-[10px]">Closed</span>
                  </div>
                </div>

                <div className="p-4 bg-noir-900 border-l-2 border-gold space-y-1">
                  <div className="font-label-caps text-xs uppercase text-gold">
                    Saturday Walk-Ins
                  </div>
                  <p className="font-body-sm text-xs text-bone-dim leading-relaxed">
                    Walk-in flash designs are first-come, first-served every Saturday from 10:45 AM. Larger pieces — backpieces, sleeves, and cover-ups — require a consultation.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-3">
                <button
                  onClick={() => onNavigate('booking')}
                  className="w-full py-3.5 bg-crimson hover:bg-crimson-hover text-bone font-label-caps text-xs uppercase tracking-[0.2em] transition-all btn-gothic-glow flex items-center justify-center gap-2 border border-crimson/30"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book a Consultation</span>
                </button>
                <button
                  onClick={onOpenWhatsApp}
                  className="w-full py-3 bg-noir-800 hover:bg-noir-700 text-bone font-label-caps text-xs uppercase tracking-wider transition-colors border border-noir-700 flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-gold" />
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
