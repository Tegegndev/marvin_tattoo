import React, { useState, useEffect } from 'react';
import { PageView } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ShoppingBag, Menu, X, MessageCircle } from 'lucide-react';
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
    { id: 'about', label: 'About' },
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
      <div className="h-20 max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
        {/* Brand Logo Only (No text) */}
        <button
          onClick={() => {
            onNavigate('home');
            setMobileMenuOpen(false);
          }}
          className="flex items-center shrink-0 focus:outline-none group py-2"
          aria-label="Marvin Tattoos Atelier Home"
        >
          <img
            alt="Marvin Tattoos"
            className="h-10 md:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105 brightness-110"
            src={LOGO_URL}
          />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-noir-900/80 p-1 rounded border border-noir-700/50">
          {navLinks.map((link) => {
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
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
              </button>
            );
          })}
        </nav>

        {/* Action CTAs */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* WhatsApp Direct Line */}
          <button
            onClick={onOpenWhatsApp}
            className="hidden sm:inline-flex items-center gap-2 px-3 py-2 bg-noir-900 hover:bg-noir-850 text-bone-dim hover:text-bone font-label-caps text-[11px] uppercase tracking-wider transition-all duration-200 border border-noir-700 rounded-sm"
            title="Chat on WhatsApp"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span>WhatsApp</span>
          </button>

          {/* Cart Icon */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 bg-noir-900 hover:bg-noir-850 text-bone transition-all duration-200 border border-noir-700 rounded-sm flex items-center justify-center"
            aria-label="Open Equipment Cart"
          >
            <ShoppingBag className="w-4 h-4 text-slate-300" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-slate-200 text-noir-950 text-[10px] font-bold rounded-full flex items-center justify-center shadow-md">
                {cartCount}
              </span>
            )}
          </button>

          {/* Book Appointment CTA */}
          <button
            onClick={() => {
              onNavigate('booking');
              setMobileMenuOpen(false);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-white text-noir-950 font-label-caps text-[11px] font-bold uppercase tracking-widest transition-all duration-200 shadow-sm rounded-sm"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Book Session</span>
            <span className="sm:hidden">Book</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-bone hover:text-white transition-colors focus:outline-none"
            aria-label="Toggle Navigation Menu"
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
            transition={{ duration: 0.25 }}
            className="md:hidden bg-noir-950/98 border-b border-noir-700 px-6 py-5 flex flex-col gap-3 shadow-2xl"
          >
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between py-2.5 text-left font-label-caps text-sm uppercase tracking-wider transition-colors ${
                  currentPage === link.id
                    ? 'text-white font-bold border-l-2 border-slate-300 pl-3 bg-noir-900/60'
                    : 'text-bone-muted hover:text-bone pl-3'
                }`}
              >
                <span>{link.label}</span>
                {currentPage === link.id && (
                  <span className="text-xs text-slate-300">●</span>
                )}
              </button>
            ))}

            <div className="pt-3 mt-2 border-t border-noir-700/80 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  onOpenWhatsApp();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-noir-900 hover:bg-noir-850 text-bone border border-noir-700 text-xs font-label-caps uppercase tracking-wider transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Studio Consult</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
