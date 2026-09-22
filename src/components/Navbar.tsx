import React, { useState, useEffect } from 'react';
import { PageView } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons8 } from './Icons8';
import { LOGO_URL } from '../data/atelierData';
import { useSettings } from '../context/SettingsContext';
import { formatImageUrl } from '../config/api';

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenWhatsApp: () => void;
  onOpenVerify: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  cartCount,
  onOpenCart,
  onOpenWhatsApp,
}) => {
  const { settings } = useSettings();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks: { id: PageView; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'about', label: 'About' },
    { id: 'aftercare', label: 'Aftercare' },
    { id: 'equipment', label: 'Shop' },
    { id: 'location', label: 'Location' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-noir-950/95 backdrop-blur-md shadow-2xl border-b border-noir-700/60'
          : 'bg-noir-950/80 backdrop-blur-sm border-b border-noir-800/40'
      }`}
    >
      {/* Announcement Banner if active */}
      {settings.announcementActive && settings.announcementText && (
        <div className="w-full bg-crimson text-bone py-1 px-4 text-center text-[11px] font-label-caps uppercase tracking-widest border-b border-crimson-light/40 flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          <span>{settings.announcementText}</span>
        </div>
      )}

      <div className="h-16 sm:h-20 max-w-7xl mx-auto px-3 sm:px-4 md:px-8 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('home');
            setMobileMenuOpen(false);
          }}
          className="flex items-center shrink-0 focus:outline-none group py-1 sm:py-2"
          aria-label={`${settings.studioName || 'Marvin Tattoo Studio'} Home`}
        >
          <img
            alt={settings.studioName || 'Marvin Tattoo Studio'}
            className="h-9 sm:h-11 md:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            src={formatImageUrl(settings.logoUrl || LOGO_URL)}
          />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-noir-900/80 p-1 rounded border border-noir-700/50">
          {navLinks.map((link) => {
            const isActive = currentPage === link.id || (link.id === 'services' && currentPage === 'service-detail');
            const hrefPath = link.id === 'home' ? '/' : `/${link.id}`;
            return (
              <a
                key={link.id}
                href={hrefPath}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(link.id);
                }}
                className={`relative px-4 py-2 font-label-caps text-xs uppercase tracking-widest transition-colors duration-200 ${
                  isActive
                    ? 'text-bone font-bold'
                    : 'text-bone-muted hover:text-bone'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 bg-noir-800 border border-slate-700/60 rounded-sm"
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
                <span className="relative z-10 flex items-center">
                  {link.label}
                </span>
              </a>
            );
          })}
        </nav>

        {/* Action CTAs */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 md:gap-3 shrink-0">
          {/* WhatsApp Direct Line */}
          <button
            onClick={onOpenWhatsApp}
            className="hidden sm:inline-flex items-center gap-2 px-3 py-2 bg-noir-900 hover:bg-noir-850 text-bone-dim hover:text-bone font-label-caps text-[11px] uppercase tracking-wider transition-all duration-200 border border-noir-700 rounded-sm shrink-0"
            title="Chat on WhatsApp"
          >
            <Icons8 name="whatsapp" size={14} className="text-emerald-400" />
            <span>WhatsApp</span>
          </button>

          {/* Cart Icon */}
          <button
            onClick={onOpenCart}
            className="relative p-2 sm:p-2.5 bg-noir-900 hover:bg-noir-850 text-bone transition-all duration-200 border border-noir-700 rounded-sm flex items-center justify-center shrink-0"
            aria-label="Open Equipment Cart"
          >
            <Icons8 name="shopping-bag" size={16} className="text-slate-300" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-slate-200 text-noir-950 text-[10px] font-bold rounded-full flex items-center justify-center shadow-md">
                {cartCount}
              </span>
            )}
          </button>

          {/* Book Appointment CTA (Responsive: icon-only on <360px, "Book" on 360-640px, "Book Session" on >=640px) */}
          <a
            href="/booking"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('booking');
              setMobileMenuOpen(false);
            }}
            className="inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-4 py-2 bg-crimson hover:bg-crimson-hover text-bone font-label-caps text-[11px] font-bold uppercase tracking-wider sm:tracking-widest transition-all duration-200 border border-crimson-light/30 shadow-sm rounded-sm shrink-0"
            aria-label="Book Session"
          >
            <Icons8 name="calendar-check" size={14} />
            <span className="hidden sm:inline">Book Session</span>
            <span className="hidden min-[360px]:inline sm:hidden">Book</span>
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 sm:p-2 text-bone hover:text-white transition-colors focus:outline-none shrink-0"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <Icons8 name="times" size={22} /> : <Icons8 name="bars" size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop for closing menu */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden fixed inset-0 top-16 sm:top-20 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Scrollable Drawer */}
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden relative z-50 bg-noir-950/98 border-b border-noir-700 px-4 sm:px-6 py-5 flex flex-col gap-3 shadow-2xl overflow-y-auto max-h-[calc(100vh-4rem)] sm:max-h-[calc(100vh-5rem)]"
            >
              {navLinks.map((link) => {
                const isActive = currentPage === link.id || (link.id === 'services' && currentPage === 'service-detail');
                const hrefPath = link.id === 'home' ? '/' : `/${link.id}`;
                return (
                  <a
                    key={link.id}
                    href={hrefPath}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(link.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-between py-2.5 text-left font-label-caps text-sm uppercase tracking-wider transition-colors ${
                      isActive
                        ? 'text-white font-bold border-l-2 border-slate-300 pl-3 bg-noir-900/60'
                        : 'text-bone-muted hover:text-bone pl-3'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="text-xs text-slate-300">●</span>
                    )}
                  </a>
                );
              })}

              <div className="pt-3 mt-2 border-t border-noir-700/80 flex flex-col gap-2.5">
                <button
                  onClick={() => {
                    onOpenWhatsApp();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-noir-900 hover:bg-noir-850 text-bone border border-noir-700 text-xs font-label-caps uppercase tracking-wider transition-colors"
                >
                  <Icons8 name="whatsapp" size={16} className="text-emerald-400" />
                  <span>WhatsApp Studio Consult</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
