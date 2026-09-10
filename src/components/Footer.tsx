import React, { useState, useEffect } from 'react';
import { PageView, SiteSettingData } from '../types';
import { LOGO_URL } from '../data/atelierData';
import { Icons8 } from './Icons8';
import { fetchSiteSettings, DEFAULT_SITE_SETTINGS } from '../services/apiClient';

interface FooterProps {
  onNavigate: (page: PageView) => void;
  onOpenVerify: () => void;
  onTrackOrder?: (orderNumber: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onTrackOrder }) => {
  const [settings, setSettings] = useState<SiteSettingData>(DEFAULT_SITE_SETTINGS);
  const [trackingNumber, setTrackingNumber] = useState<string>('');

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
            {/* Senior-Dev Order Tracking Widget */}
            <div className="pt-2 space-y-2">
              <div className="font-label-caps text-label-caps uppercase tracking-widest text-bone flex items-center gap-1.5">
                <Icons8 name="search" size={13} className="text-crimson-light" />
                <span>Track Studio Order</span>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (trackingNumber.trim()) {
                    if (onTrackOrder) {
                      onTrackOrder(trackingNumber.trim());
                    } else {
                      onNavigate('track-order');
                    }
                  }
                }}
                className="flex items-center gap-1.5"
              >
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. ORD-2026-..."
                  className="w-full px-3 py-2 bg-noir-850 border border-noir-700 text-bone text-xs font-mono uppercase focus:outline-none focus:border-crimson placeholder:font-sans placeholder:text-bone-muted/40 rounded transition-colors"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-crimson hover:bg-crimson-hover text-bone font-label-caps text-[11px] uppercase tracking-wider rounded transition-colors flex items-center gap-1 cursor-pointer shrink-0 font-bold"
                  aria-label="Track order"
                >
                  <span>Track</span>
                  <Icons8 name="arrow-right" size={11} />
                </button>
              </form>
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
                  className="text-left hover:text-bone transition-colors py-1 cursor-pointer"
                >
                  About
                </button>
                <button
                  onClick={() => onNavigate('portfolio')}
                  className="text-left hover:text-bone transition-colors py-1 cursor-pointer"
                >
                  Portfolio
                </button>
                <button
                  onClick={() => onNavigate('aftercare')}
                  className="text-left hover:text-bone transition-colors py-1 text-gold font-semibold cursor-pointer"
                >
                  Aftercare
                </button>
                <button
                  onClick={() => onNavigate('equipment')}
                  className="text-left hover:text-bone transition-colors py-1 cursor-pointer"
                >
                  Shop
                </button>
                <button
                  onClick={() => onNavigate('location')}
                  className="text-left hover:text-bone transition-colors py-1 cursor-pointer"
                >
                  Location
                </button>
                <button
                  onClick={() => onNavigate('track-order')}
                  className="text-left hover:text-crimson-light transition-colors py-1 font-semibold cursor-pointer"
                >
                  Track Order
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
            <button onClick={() => onNavigate('track-order')} className="hover:text-crimson-light text-bone font-semibold transition-colors cursor-pointer">
              Track Order
            </button>
            <button onClick={() => onNavigate('aftercare')} className="hover:text-bone text-gold font-semibold transition-colors cursor-pointer">
              Aftercare Guide
            </button>
            <button onClick={() => onNavigate('location')} className="hover:text-bone transition-colors cursor-pointer">
              Studio Location
            </button>
            <button onClick={() => onNavigate('about')} className="hover:text-bone transition-colors cursor-pointer">
              Hygiene Standards
            </button>
            <button onClick={() => onNavigate('booking')} className="hover:text-bone transition-colors cursor-pointer">
              Book Terms
            </button>
          </div>
        </div>
      </div>
    </footer>

  );
};
