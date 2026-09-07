import React, { useState, useEffect } from 'react';
import { PageView, SiteSettingData } from '../types';
import { Icons8 } from '../components/Icons8';
import { fetchSiteSettings, DEFAULT_SITE_SETTINGS } from '../services/apiClient';

interface LocationPageProps {
  onNavigate: (page: PageView) => void;
  onOpenWhatsApp: () => void;
  onOpenVerify: () => void;
}

export const LocationPage: React.FC<LocationPageProps> = ({
  onNavigate,
  onOpenWhatsApp,
}) => {
  const [settings, setSettings] = useState<SiteSettingData>(DEFAULT_SITE_SETTINGS);

  useEffect(() => {
    fetchSiteSettings().then(setSettings).catch(() => {});
  }, []);

  const phoneDisplay = settings.primaryPhone || '+256 705 748774';
  const phoneTel = phoneDisplay.replace(/\s+/g, '');
  const hours = settings.openingHours && settings.openingHours.length > 0
    ? settings.openingHours
    : DEFAULT_SITE_SETTINGS.openingHours;

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
            Tattoo and Piercing Shop in Kampala, Uganda
          </h1>
          <p className="font-body-md text-sm text-bone-muted max-w-2xl leading-relaxed">
            Private consultation rooms, dedicated sterile piercing suites, and medical-grade hygiene protocols throughout.
          </p>
        </div>
      </section>

      {/* Grid: Map & Transit */}
      <section className="w-full px-4 md:px-8 lg:px-12 py-16 bg-noir-950">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Map Visual with Real Kampala Google Map (7 Cols) */}
            <div className="lg:col-span-7 bg-noir-850 overflow-hidden border border-noir-700 flex flex-col justify-between">
              <div className="w-full h-80 sm:h-96 relative bg-noir-950 overflow-hidden">
                <iframe
                  title="Marvin Tattoos Kampala Google Map Embed"
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

              <div className="p-6 bg-noir-850 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-noir-700">
                  <div className="space-y-1">
                    <h3 className="font-title-editorial text-base uppercase text-bone font-bold">
                      {settings.physicalAddress}
                    </h3>
                    <p className="font-body-sm text-xs text-bone-muted">
                      Level 5, Shop No. Pi55 · Kampala, Uganda
                    </p>
                    <div className="pt-1">
                      <a
                        href={`tel:${phoneTel}`}
                        className="font-label-data text-xs text-crimson-light hover:underline font-bold"
                      >
                        Call Studio: {phoneDisplay}
                      </a>
                    </div>
                  </div>
                  <a
                    href={settings.googleMapsUrl || "https://maps.app.goo.gl/DoTQfUafRoKsqiQc8"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 bg-noir-800 hover:bg-noir-750 text-bone font-label-caps text-xs uppercase tracking-wider transition-colors flex items-center gap-2 shrink-0 border border-noir-700"
                  >
                    <Icons8 name="location-arrow" size={14} className="text-crimson-light" />
                    <span>View on Google Maps</span>
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-body-sm">
                  <div className="p-3.5 bg-noir-900 border border-noir-700 space-y-1">
                    <div className="flex items-center gap-1.5 font-label-caps text-xs text-gold uppercase font-bold">
                      <Icons8 name="map-marked-alt" size={16} />
                      <span>Burton St / Pioneer Mall</span>
                    </div>
                    <p className="text-bone-dim leading-relaxed">
                      Centrally located in downtown Kampala at New Pioneer Mall. Take elevator or stairs up to Level 5, Shop Pi55.
                    </p>
                  </div>

                  <div className="p-3.5 bg-noir-900 border border-noir-700 space-y-1">
                    <div className="flex items-center gap-1.5 font-label-caps text-xs text-crimson-light uppercase font-bold">
                      <Icons8 name="car" size={16} />
                      <span>Parking &amp; Access</span>
                    </div>
                    <p className="text-bone-dim leading-relaxed">
                      Convenient parking available on Burton St &amp; Kampala Road parking lots. Boda-boda &amp; taxi drop-off directly outside mall entrance.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Operating Schedule & Protocols (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-noir-850 p-6 sm:p-8 border border-noir-700 space-y-6">
              <div className="space-y-6">
                <div className="space-y-1">
                  <span className="font-label-caps text-xs uppercase text-crimson-light tracking-[0.25em] font-bold">
                    STUDIO HOURS &amp; SESSIONS
                  </span>
                  <h3 className="font-headline-lg text-2xl text-bone uppercase font-bold">
                    Operating Hours
                  </h3>
                </div>

                <div className="space-y-2 font-label-data text-xs">
                  {hours.map((h, i) => (
                    <div key={i} className="flex justify-between items-center py-2.5 bg-noir-900 px-3 border border-noir-700">
                      <span className="text-bone">{h.day}</span>
                      <span className="text-bone font-bold">{h.hours}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center py-2.5 bg-noir-800 px-3 border border-slate-500">
                    <div className="flex items-center gap-2">
                      <span className="text-bone font-bold">Direct Phone</span>
                      <span className="px-1.5 py-0.5 bg-crimson text-bone font-label-caps text-[9px] uppercase font-bold">
                        Studio Desk
                      </span>
                    </div>
                    <a href={`tel:${phoneTel}`} className="text-crimson-light font-bold hover:underline">
                      {phoneDisplay}
                    </a>
                  </div>
                </div>

                <div className="p-4 bg-noir-900 border-l-2 border-gold space-y-1">
                  <div className="font-label-caps text-xs uppercase text-gold font-bold">
                    Walk-Ins &amp; Custom Consultations
                  </div>
                  <p className="font-body-sm text-xs text-bone-dim leading-relaxed">
                    Walk-ins for small flash pieces and sterile ear/body piercings are welcome all week. Full backpieces, realism portraits, and cover-ups should be booked in advance.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-3">
                <button
                  onClick={() => onNavigate('booking')}
                  className="w-full py-3.5 bg-crimson hover:bg-crimson-hover text-bone font-label-caps text-xs uppercase tracking-[0.2em] transition-all btn-gothic-glow flex items-center justify-center gap-2 border border-crimson/30"
                >
                  <Icons8 name="calendar-check" size={16} />
                  <span>Book a Consultation</span>
                </button>
                <button
                  onClick={onOpenWhatsApp}
                  className="w-full py-3 bg-noir-800 hover:bg-noir-700 text-bone font-label-caps text-xs uppercase tracking-wider transition-colors border border-noir-700 flex items-center justify-center gap-2"
                >
                  <Icons8 name="whatsapp" size={16} className="text-emerald-400" />
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
