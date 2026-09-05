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
    <footer className="w-full bg-surface-container-lowest border-t border-surface-container-highest/40">
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
              <span className="font-title-editorial text-title-editorial uppercase text-on-surface">
                Marvin
              </span>
            </div>
            <div className="font-label-caps text-label-caps text-primary uppercase tracking-wider">
              Sanctum of Avant-Garde Ink &amp; Steel
            </div>
            <p className="font-body-sm text-body-sm text-outline leading-relaxed">
              Monolithic artistry and ritualistic body modification operating under hospital-grade clinical surgical standards.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="w-2 h-2 rounded-full bg-secondary shrink-0 animate-ping" />
              <span className="font-label-data text-label-data text-on-surface-variant uppercase">
                Sterile Bay Certification #709-DX
              </span>
            </div>
          </div>

          {/* Column 2: Atelier Coordinates */}
          <div className="space-y-4">
            <div className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span>Atelier Coordinates</span>
            </div>
            <div className="font-body-sm text-body-sm text-on-surface-variant space-y-1">
              <p className="text-on-surface font-semibold">04 Obsidian Alley, Floor 03</p>
              <p className="text-outline">Cultural Quarter // Design Void</p>
              <p className="font-label-data text-label-data text-primary pt-1">
                Direct: +1 (800) 555-MARK
              </p>
            </div>
            <div className="pt-2">
              <div className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-secondary" />
                <span>Operating Hours</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Tue – Sat: 11:00 — 21:00
              </p>
              <p className="font-body-sm text-body-sm text-outline">
                Sun – Mon: Private Bookings &amp; Sterilization Bay
              </p>
            </div>
          </div>

          {/* Column 3: Walk-In Protocol & Advisory */}
          <div className="space-y-4">
            <div className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface">
              Walk-In Protocol
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Saturday consult spots open strictly at 10:45 AM on a first-arrived basis. Custom sleeve blueprints and complex cover-ups strictly mandate digital consultation booking.
            </p>
            <div className="p-3 bg-surface-container space-y-1 border border-error/20">
              <button
                onClick={onOpenVerify}
                className="flex items-center gap-1.5 text-error font-label-caps text-label-caps uppercase tracking-wider hover:underline"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Official Verification Notice</span>
              </button>
              <p className="font-body-sm text-body-sm text-outline leading-tight">
                Beware imposter accounts soliciting wire transfers. Only confirmed bookings through this portal are honored.
              </p>
            </div>
          </div>

          {/* Column 4: Social Registry & Quick Links */}
          <div className="space-y-4">
            <div className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface">
              Official Social Registry
            </div>
            <ul className="space-y-2 font-label-data text-label-data uppercase">
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-on-surface-variant hover:text-on-surface group transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Camera className="w-4 h-4 group-hover:text-primary transition-colors" />
                    <span>Instagram</span>
                  </span>
                  <span className="text-primary font-label-caps text-[10px] group-hover:underline flex items-center gap-1">
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
                  className="flex items-center justify-between text-on-surface-variant hover:text-on-surface group transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Video className="w-4 h-4 group-hover:text-primary transition-colors" />
                    <span>TikTok</span>
                  </span>
                  <span className="text-primary font-label-caps text-[10px] group-hover:underline flex items-center gap-1">
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
                  className="flex items-center justify-between text-on-surface-variant hover:text-on-surface group transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <PlayCircle className="w-4 h-4 group-hover:text-primary transition-colors" />
                    <span>YouTube</span>
                  </span>
                  <span className="text-primary font-label-caps text-[10px] group-hover:underline flex items-center gap-1">
                    /marvintattoostudio
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </a>
              </li>
            </ul>

            <div className="pt-2">
              <div className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface mb-2">
                Quick Navigation
              </div>
              <div className="grid grid-cols-2 gap-1 font-label-caps text-label-caps uppercase text-outline">
                <button
                  onClick={() => onNavigate('about')}
                  className="text-left hover:text-on-surface transition-colors py-1"
                >
                  Aseptic Codex
                </button>
                <button
                  onClick={() => onNavigate('portfolio')}
                  className="text-left hover:text-on-surface transition-colors py-1"
                >
                  Healed Relics
                </button>
                <button
                  onClick={() => onNavigate('equipment')}
                  className="text-left hover:text-on-surface transition-colors py-1"
                >
                  Pro Supplies
                </button>
                <button
                  onClick={() => onNavigate('booking')}
                  className="text-left hover:text-on-surface transition-colors py-1"
                >
                  Consultation
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-surface-container-highest/30">
          <div className="font-label-caps text-label-caps uppercase tracking-widest text-outline text-center md:text-left">
            © 2026 MARVIN TATTOOS &amp; PIERCINGS ATELIER. ALL RIGHTS RESERVED.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 font-label-caps text-label-caps uppercase text-outline">
            <button onClick={onOpenVerify} className="hover:text-on-surface transition-colors">
              Privacy Ordinance
            </button>
            <button onClick={() => onNavigate('about')} className="hover:text-on-surface transition-colors">
              Sterile Compliance
            </button>
            <button onClick={() => onNavigate('booking')} className="hover:text-on-surface transition-colors">
              Terms of Ritual
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
