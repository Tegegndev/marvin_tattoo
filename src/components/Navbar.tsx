import React, { useState, useEffect } from 'react';
import { PageView } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ShoppingBag, Menu, X, ShieldAlert, Sparkles } from 'lucide-react';
import { LOGO_URL } from '../data/atelierData';

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
  onOpenVerify,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { id: PageView; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'about', label: 'About Studio' },
    { id: 'equipment', label: 'Shop Equipment' },
    { id: 'location', label: 'Studio Location' },
    { id: 'booking', label: 'Booking' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-surface-container-lowest/95 backdrop-blur-md shadow-2xl border-b border-surface-container-highest/60'
          : 'bg-surface-container-lowest/80 backdrop-blur-sm'
      }`}
    >
      <div className="h-20 w-full px-4 md:px-8 lg:px-12 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <button
          onClick={() => {
            onNavigate('home');
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-3 shrink-0 text-left group focus:outline-none"
        >
          <img
            alt="Marvin Tattoos Wordmark Logo"
            className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            src={LOGO_URL}
          />
          <div className="flex flex-col">
            <span className="font-title-editorial text-title-editorial uppercase tracking-widest text-on-surface group-hover:text-primary transition-colors">
              Marvin
            </span>
            <span className="font-label-caps text-[10px] text-outline uppercase tracking-[0.25em]">
              Atelier &amp; Piercing
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-1 bg-surface-container-low/60 p-1 rounded border border-surface-container-highest/40">
          {navLinks.map((link) => {
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`relative px-3.5 py-1.5 font-label-caps text-label-caps uppercase transition-all duration-300 ${
                  isActive
                    ? 'text-on-surface'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 bg-surface-container-high border border-primary/30"
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1">
                  {link.label}
                  {link.id === 'booking' && (
                    <Sparkles className="w-2.5 h-2.5 text-secondary animate-pulse" />
                  )}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Action CTAs */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Official Verify Button */}
          <button
            onClick={onOpenVerify}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 bg-surface-container/60 hover:bg-error-container/30 text-outline-variant hover:text-error font-label-caps text-[10px] uppercase tracking-wider transition-colors border border-surface-container-highest/60"
            title="Verify Official Marvin Tattoos Channel"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Anti-Scam</span>
          </button>

          {/* WhatsApp Direct */}
          <button
            onClick={onOpenWhatsApp}
            className="inline-flex items-center gap-2 px-3 py-2 bg-surface-container text-on-surface font-label-caps text-[10px] uppercase tracking-wider transition-all duration-300 hover:bg-surface-container-high hover:-translate-y-0.5 border border-surface-container-highest"
          >
            <span className="w-2 h-2 rounded-full bg-secondary shrink-0 animate-pulse" />
            <span className="hidden sm:inline">WhatsApp Direct</span>
            <span className="sm:hidden">WhatsApp</span>
          </button>

          {/* Cart Icon */}
          <button
            onClick={onOpenCart}
            className="relative p-2 bg-surface-container-high hover:bg-surface-bright text-on-surface transition-all duration-300 border border-surface-container-highest flex items-center justify-center"
            aria-label="Open Equipment Cart"
          >
            <ShoppingBag className="w-4 h-4 text-primary" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary-container text-on-surface text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* Book Appointment CTA */}
          <button
            onClick={() => onNavigate('booking')}
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 bg-primary-container hover:bg-on-primary-fixed-variant text-on-surface font-label-caps text-[11px] uppercase tracking-widest transition-all duration-300 btn-gothic-glow border border-primary/30"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Book Appointment</span>
            <span className="sm:hidden">Book</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-on-surface hover:text-primary focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="xl:hidden bg-surface-container-lowest/98 border-b border-surface-container-highest px-6 py-5 flex flex-col gap-3 shadow-2xl"
          >
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between py-2 text-left font-label-caps text-sm uppercase tracking-wider transition-colors ${
                  currentPage === link.id
                    ? 'text-primary font-bold border-l-2 border-primary pl-3'
                    : 'text-on-surface-variant hover:text-on-surface pl-3'
                }`}
              >
                <span>{link.label}</span>
                {currentPage === link.id && (
                  <span className="text-xs text-primary">●</span>
                )}
              </button>
            ))}

            <div className="pt-3 mt-2 border-t border-surface-container-highest flex items-center justify-between">
              <button
                onClick={() => {
                  onOpenVerify();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-error text-xs font-label-caps uppercase"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Verify Official Channel</span>
              </button>
              <span className="text-[11px] font-label-data text-outline">Sanctum Est. 2014</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
