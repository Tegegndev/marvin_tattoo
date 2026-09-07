import React, { useState, useEffect } from 'react';
import { PageView, SiteSettingData } from '../types';
import { LOGO_URL } from '../data/atelierData';
import { Icons8 } from './Icons8';
import { fetchSiteSettings, DEFAULT_SITE_SETTINGS } from '../services/apiClient';

interface FooterProps {
  onNavigate: (page: PageView) => void;
  onOpenVerify: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [settings, setSettings] = useState<SiteSettingData>(DEFAULT_SITE_SETTINGS);

  useEffect(() => {
    fetchSiteSettings().then(setSettings).catch(() => {});
  }, []);

  const getSocialIcon = (icon: string) => {
    switch (icon) {
      case 'instagram':
        return <Icons8 name="instagram" size={16} className="group-hover:text-crimson-light transition-colors" />;
      case 'tiktok':
        return <Icons8 name="simple-icons:tiktok" size={14} className="group-hover:text-crimson-light transition-colors" />;
      case 'youtube':
        return <Icons8 name="youtube" size={16} className="group-hover:text-crimson-light transition-colors" />;
      case 'facebook':
        return <Icons8 name="facebook" size={16} className="group-hover:text-crimson-light transition-colors" />;
      case 'whatsapp':
        return <Icons8 name="phone" size={14} className="group-hover:text-crimson-light transition-colors" />;
      default:
        return <Icons8 name="globe" size={14} className="group-hover:text-crimson-light transition-colors" />;
    }
  };

  const activeSocials = (settings.socialLinks || []).filter((s) => s.active);

  return (
    <footer className="w-full bg-noir-950 border-t border-noir-700/40">
      <div className="w-full px-4 md:px-8 lg:px-12 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12">
          {/* Column 1: Brand & Certification */}
          <div className="space-y-5">
            <div className="space-y-3">
              <img
                alt="Marvin Tattoos Wordmark Logo"
                className="h-16 sm:h-20 md:h-24 w-auto object-contain filter drop-shadow-lg select-none"
                src={LOGO_URL}
              />
              <div className="font-label-caps text-xs text-crimson-light uppercase tracking-[0.25em] font-bold">
                Tattoo &amp; Piercing Studio · Kampala
              </div>
            </div>
            <p className="font-body-sm text-sm text-bone-muted leading-relaxed">
              Custom dark realism, heavy script, cover-ups, and titanium body piercing in Kampala, Uganda with hospital-grade sterilization.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="w-2 h-2 rounded-full bg-gold shrink-0 animate-pulse" />
              <span className="font-label-data text-xs text-bone font-semibold uppercase tracking-wider">
                Hospital-Grade Sterilization
              </span>
            </div>
          </div>

          {/* Column 2: Atelier Coordinates */}
          <div className="space-y-4">
            <div className="font-label-caps text-label-caps uppercase tracking-widest text-bone flex items-center gap-2">
              <Icons8 name="map-marker-alt" size={16} className="text-crimson-light" />
              <span>Studio Location</span>
            </div>
            <div className="font-body-sm text-body-sm text-bone-muted space-y-1">
              <a
                href={settings.googleMapsUrl || "https://maps.app.goo.gl/DoTQfUafRoKsqiQc8"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-bone font-semibold hover:text-crimson-light transition-colors block"
              >
                {settings.physicalAddress}
              </a>
              <div className="pt-2 flex flex-col gap-1.5">
                <a
                  href={`tel:${settings.primaryPhone.replace(/\s+/g, '')}`}
                  className="font-label-data text-xs text-crimson-light hover:underline flex items-center gap-1.5 font-bold"
                >
                  <Icons8 name="phone" size={14} />
                  <span>{settings.primaryPhone}</span>
                </a>
                <a
                  href={settings.googleMapsUrl || "https://maps.app.goo.gl/DoTQfUafRoKsqiQc8"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-label-caps text-[10px] text-gold hover:underline flex items-center gap-1 uppercase tracking-wider"
                >
                  <Icons8 name="location-arrow" size={12} />
                  <span>Open in Google Maps</span>
                </a>
              </div>
            </div>
            <div className="pt-2">
              <div className="font-label-caps text-label-caps uppercase tracking-widest text-bone mb-1 flex items-center gap-1.5">
                <Icons8 name="clock" size={14} className="text-gold" />
                <span>Operating Hours</span>
              </div>
              {(settings.openingHours || []).map((h, i) => (
                <p key={i} className="font-body-sm text-xs text-bone-muted">
                  {h.day}: {h.hours}
                </p>
              ))}
            </div>
          </div>

          {/* Column 3: Walk-Ins & Advisory */}
          <div className="space-y-4">
            <div className="font-label-caps text-label-caps uppercase tracking-widest text-bone">
              Walk-Ins
            </div>
            <p className="font-body-sm text-body-sm text-bone-muted leading-relaxed">
              Saturday walk-in flash spots open at 10:45 AM, first come first served. Custom sleeves and cover-ups require a booked consultation.
            </p>
            <div className="p-3.5 bg-noir-850 space-y-1.5 border border-noir-700">
              <div className="flex items-center gap-1.5 text-gold font-label-caps text-label-caps uppercase tracking-wider font-bold">
                <Icons8 name="shield-alt" size={16} />
                <span>Sterilization Guarantee</span>
              </div>
              <p className="font-body-sm text-body-sm text-bone-dim leading-relaxed">
                Hospital-grade autoclave sterilization, single-use needle cartridges, and medical-grade sanitation protocols for every session.
              </p>
            </div>
          </div>

          {/* Column 4: Social & Quick Links */}
          <div className="space-y-4">
            <div className="font-label-caps text-label-caps uppercase tracking-widest text-bone">
              Follow Us
            </div>
            <ul className="space-y-2 font-label-data text-label-data uppercase">
              {activeSocials.map((social) => (
                <li key={social.id}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between text-bone-muted hover:text-bone group transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      {getSocialIcon(social.icon || social.platform)}
                      <span>{social.label}</span>
                    </span>
                    <span className="text-crimson-light font-label-caps text-[10px] group-hover:underline flex items-center gap-1">
                      Visit
                      <Icons8 name="external-link-alt" size={12} />
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <div className="font-label-caps text-label-caps uppercase tracking-widest text-bone mb-2">
                Quick Navigation
              </div>
              <div className="grid grid-cols-2 gap-1 font-label-caps text-label-caps uppercase text-bone-dim">
                <button
                  onClick={() => onNavigate('about')}
                  className="text-left hover:text-bone transition-colors py-1"
                >
                  About
                </button>
                <button
                  onClick={() => onNavigate('portfolio')}
                  className="text-left hover:text-bone transition-colors py-1"
                >
                  Portfolio
                </button>
                <button
                  onClick={() => onNavigate('aftercare')}
                  className="text-left hover:text-bone transition-colors py-1 text-gold font-semibold"
                >
                  Aftercare
                </button>
                <button
                  onClick={() => onNavigate('equipment')}
                  className="text-left hover:text-bone transition-colors py-1"
                >
                  Shop
                </button>
                <button
                  onClick={() => onNavigate('location')}
                  className="text-left hover:text-bone transition-colors py-1"
                >
                  Location
                </button>
                <button
                  onClick={() => onNavigate('booking')}
                  className="text-left hover:text-bone transition-colors py-1"
                >
                  Book
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-noir-700/30">
          <div className="font-label-caps text-label-caps uppercase tracking-widest text-bone-dim text-center md:text-left">
            © 2026 MARVIN TATTOOS &amp; PIERCINGS. ALL RIGHTS RESERVED.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 font-label-caps text-label-caps uppercase text-bone-dim">
            <button onClick={() => onNavigate('aftercare')} className="hover:text-bone text-gold font-semibold transition-colors">
              Aftercare Guide
            </button>
            <button onClick={() => onNavigate('location')} className="hover:text-bone transition-colors">
              Studio Location
            </button>
            <button onClick={() => onNavigate('about')} className="hover:text-bone transition-colors">
              Hygiene Standards
            </button>
            <button onClick={() => onNavigate('booking')} className="hover:text-bone transition-colors">
              Book Terms
            </button>
            <button onClick={() => onNavigate('admin')} className="hover:text-crimson-light text-bone-dim transition-colors flex items-center gap-1 font-bold">
              <Icons8 name="lock" size={12} className="text-crimson-light" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
