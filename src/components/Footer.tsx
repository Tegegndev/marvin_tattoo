import React from 'react';
import { PageView } from '../types';
import { LOGO_URL } from '../data/atelierData';
import { Camera, Video, PlayCircle, ShieldCheck, Clock, MapPin, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageView) => void;
  onOpenVerify: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenVerify }) => {
  return (
    <footer className="w-full bg-noir-950 border-t border-noir-700/40">
      <div className="w-full px-4 md:px-8 lg:px-12 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12">
          {/* Column 1: Brand & Certification */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                alt="Marvin Tattoos Wordmark Logo"
                className="h-6 w-auto object-contain"
                src={LOGO_URL}
              />
              <span className="font-title-editorial text-title-editorial uppercase text-bone">
                Marvin
              </span>
            </div>
            <div className="font-label-caps text-label-caps text-crimson-light uppercase tracking-wider">
              Tattoos &amp; Piercings
            </div>
            <p className="font-body-sm text-body-sm text-bone-dim leading-relaxed">
              Custom tattoos and piercing work done in a clean, professional studio with hospital-grade sterilization.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="w-2 h-2 rounded-full bg-gold shrink-0" />
              <span className="font-label-data text-label-data text-bone-muted uppercase">
                OSHA-Approved Sterilization
              </span>
            </div>
          </div>

          {/* Column 2: Atelier Coordinates */}
          <div className="space-y-4">
            <div className="font-label-caps text-label-caps uppercase tracking-widest text-bone flex items-center gap-2">
              <MapPin className="w-4 h-4 text-crimson-light" />
              <span>Studio Location</span>
            </div>
            <div className="font-body-sm text-body-sm text-bone-muted space-y-1">
              <p className="text-bone font-semibold">142 Mercer Street, Suite 3B</p>
              <p className="text-bone-dim">SoHo, New York, NY 10012</p>
              <p className="font-label-data text-label-data text-crimson-light pt-1">
                Call: +1 (800) 555-MARK
              </p>
            </div>
            <div className="pt-2">
              <div className="font-label-caps text-label-caps uppercase tracking-widest text-bone mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gold" />
                <span>Hours</span>
              </div>
              <p className="font-body-sm text-body-sm text-bone-muted">
                Tue – Sat: 11:00 — 21:00
              </p>
              <p className="font-body-sm text-body-sm text-bone-dim">
                Sun – Mon: By appointment
              </p>
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
            <div className="p-3 bg-noir-850 space-y-1 border border-noir-700">
              <button
                onClick={onOpenVerify}
                className="flex items-center gap-1.5 text-gold font-label-caps text-label-caps uppercase tracking-wider hover:underline"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify Official Accounts</span>
              </button>
              <p className="font-body-sm text-body-sm text-bone-dim leading-tight">
                Beware of imposters asking for wire transfers. We only accept confirmed bookings through this site.
              </p>
            </div>
          </div>

          {/* Column 4: Social & Quick Links */}
          <div className="space-y-4">
            <div className="font-label-caps text-label-caps uppercase tracking-widest text-bone">
              Follow Us
            </div>
            <ul className="space-y-2 font-label-data text-label-data uppercase">
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-bone-muted hover:text-bone group transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Camera className="w-4 h-4 group-hover:text-crimson-light transition-colors" />
                    <span>Instagram</span>
                  </span>
                  <span className="text-crimson-light font-label-caps text-[10px] group-hover:underline flex items-center gap-1">
                    @marvin_atelier
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-bone-muted hover:text-bone group transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Video className="w-4 h-4 group-hover:text-crimson-light transition-colors" />
                    <span>TikTok</span>
                  </span>
                  <span className="text-crimson-light font-label-caps text-[10px] group-hover:underline flex items-center gap-1">
                    @marvintattoos.official
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-bone-muted hover:text-bone group transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <PlayCircle className="w-4 h-4 group-hover:text-crimson-light transition-colors" />
                    <span>YouTube</span>
                  </span>
                  <span className="text-crimson-light font-label-caps text-[10px] group-hover:underline flex items-center gap-1">
                    /marvintattoostudio
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </a>
              </li>
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
                  onClick={() => onNavigate('equipment')}
                  className="text-left hover:text-bone transition-colors py-1"
                >
                  Shop
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
            <button onClick={onOpenVerify} className="hover:text-bone transition-colors">
              Scam Alert
            </button>
            <button onClick={() => onNavigate('about')} className="hover:text-bone transition-colors">
              Hygiene Standards
            </button>
            <button onClick={() => onNavigate('booking')} className="hover:text-bone transition-colors">
              Book Terms
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
