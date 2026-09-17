import React, { useState, useEffect } from 'react';
import { PageView, SiteSettingData } from '../types';
import { LOGO_URL, SERVICES_DATA, WHATSAPP_NUMBER } from '../data/atelierData';
import { Icons8 } from './Icons8';
import { fetchSiteSettings, DEFAULT_SITE_SETTINGS, getUserOrders } from '../services/apiClient';
import { getUserBookings } from '../services/bookingApi';
import { printReceipt, OrderReceiptData } from '../utils/receiptGenerator';
import { motion, AnimatePresence } from 'framer-motion';

interface FooterProps {
  onNavigate: (page: PageView) => void;
  onOpenVerify: () => void;
  onTrackOrder?: (orderNumber: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onTrackOrder }) => {
  const [settings, setSettings] = useState<SiteSettingData>(DEFAULT_SITE_SETTINGS);
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [userBookings, setUserBookings] = useState<any[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [activeHistoryTab, setActiveHistoryTab] = useState<'orders' | 'bookings'>('orders');

  const refreshHistory = () => {
    setUserOrders(getUserOrders());
    setUserBookings(getUserBookings());
  };

  useEffect(() => {
    fetchSiteSettings().then(setSettings).catch(() => {});
    refreshHistory();

    // Listen for storage updates across tabs/actions
    window.addEventListener('storage', refreshHistory);
    return () => window.removeEventListener('storage', refreshHistory);
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
      {/* 1. Senior-Dev My Orders & Activity History Bar */}
      <div className="border-b border-noir-800 bg-noir-900/90 backdrop-blur-md">
        <div className="w-full px-4 md:px-8 lg:px-12 py-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Left: Indicator & Counts */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/30 text-gold flex items-center justify-center shrink-0">
                <Icons8 name="receipt" size={16} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-label-caps text-xs text-bone uppercase tracking-wider font-bold">
                    My Atelier Activity
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="flex items-center gap-2 text-[11px] font-label-data text-bone-dim mt-0.5">
                  <span className="text-gold font-medium">
                    {userOrders.length} {userOrders.length === 1 ? 'Shop Order' : 'Shop Orders'}
                  </span>
                  <span className="text-noir-700">•</span>
                  <span className="text-crimson-light font-medium">
                    {userBookings.length} {userBookings.length === 1 ? 'Booking' : 'Bookings'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setIsHistoryOpen(!isHistoryOpen);
                  refreshHistory();
                }}
                className={`px-3.5 py-1.5 rounded-lg border text-xs font-label-caps uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                  isHistoryOpen
                    ? 'bg-gold text-noir-950 border-gold font-bold shadow-md'
                    : 'bg-noir-850 hover:bg-noir-800 border-noir-700 text-bone'
                }`}
              >
                <Icons8 name={isHistoryOpen ? 'chevron-up' : 'history'} size={13} />
                <span>{isHistoryOpen ? 'Hide History' : 'View My History'}</span>
                <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-noir-950/40 font-mono">
                  {userOrders.length + userBookings.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('track-order')}
                className="px-3 py-1.5 bg-noir-850 hover:bg-noir-800 border border-noir-700 text-bone-dim hover:text-bone text-xs font-label-caps uppercase rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Icons8 name="search" size={13} className="text-crimson-light" />
                <span>Track Ref</span>
              </button>
            </div>
          </div>

          {/* Collapsible History Drawer */}
          <AnimatePresence>
            {isHistoryOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="pt-4 mt-3 border-t border-noir-800"
              >
                {/* Tabs */}
                <div className="flex items-center justify-between gap-4 mb-4 pb-2 border-b border-noir-800/80">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveHistoryTab('orders')}
                      className={`px-3 py-1.5 rounded-md text-xs font-label-caps uppercase tracking-wider transition-colors cursor-pointer ${
                        activeHistoryTab === 'orders'
                          ? 'bg-crimson text-white font-bold'
                          : 'text-bone-muted hover:text-bone'
                      }`}
                    >
                      Shop Orders ({userOrders.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveHistoryTab('bookings')}
                      className={`px-3 py-1.5 rounded-md text-xs font-label-caps uppercase tracking-wider transition-colors cursor-pointer ${
                        activeHistoryTab === 'bookings'
                          ? 'bg-crimson text-white font-bold'
                          : 'text-bone-muted hover:text-bone'
                      }`}
                    >
                      Bookings ({userBookings.length})
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={refreshHistory}
                    className="text-[11px] font-label-caps uppercase text-bone-muted hover:text-gold flex items-center gap-1 cursor-pointer"
                  >
                    <Icons8 name="sync" size={11} />
                    <span>Refresh</span>
                  </button>
                </div>

                {/* Orders Content */}
                {activeHistoryTab === 'orders' && (
                  <div>
                    {userOrders.length === 0 ? (
                      <div className="py-6 text-center space-y-2 bg-noir-850/60 rounded-xl border border-noir-800">
                        <Icons8 name="shopping-bag" size={24} className="mx-auto text-bone-muted" />
                        <p className="font-body-sm text-xs text-bone-dim">
                          No shop orders placed on this device yet.
                        </p>
                        <button
                          type="button"
                          onClick={() => onNavigate('equipment')}
                          className="px-4 py-1.5 bg-crimson hover:bg-crimson-hover text-bone font-label-caps text-xs uppercase rounded transition-colors"
                        >
                          Browse Studio Shop
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-72 overflow-y-auto pr-1">
                        {userOrders.map((order, idx) => (
                          <div
                            key={order.orderNumber || order.id || idx}
                            className="p-3.5 bg-noir-850 border border-noir-750 hover:border-noir-600 rounded-xl space-y-2.5 transition-colors text-xs font-label-data"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-gold font-bold text-xs">
                                {order.orderNumber}
                              </span>
                              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                                {order.orderStatus || 'PROCESSING'}
                              </span>
                            </div>

                            <div className="space-y-0.5 text-bone-dim text-[11px]">
                              <p className="text-bone font-medium truncate">
                                {order.clientName} · {order.items?.length || 1} item(s)
                              </p>
                              <div className="flex justify-between text-bone-muted">
                                <span>
                                  {order.createdAt
                                    ? new Date(order.createdAt).toLocaleDateString('en-GB', {
                                        day: 'numeric',
                                        month: 'short',
                                      })
                                    : 'Recent'}
                                </span>
                                <span className="text-crimson-light font-bold font-mono">
                                  UGX {(order.totalAmount || order.total || 0).toLocaleString()}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 pt-1 border-t border-noir-800">
                              <button
                                type="button"
                                onClick={() => {
                                  if (onTrackOrder) {
                                    onTrackOrder(order.orderNumber);
                                  } else {
                                    onNavigate('track-order');
                                  }
                                }}
                                className="flex-1 py-1.5 bg-crimson hover:bg-crimson-hover text-bone text-[10px] font-label-caps uppercase tracking-wider rounded font-bold transition-colors text-center cursor-pointer"
                              >
                                Track Live
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const receiptData: OrderReceiptData = {
                                    orderNumber: order.orderNumber,
                                    clientName: order.clientName,
                                    clientPhone: order.clientPhone,
                                    clientEmail: order.clientEmail,
                                    deliveryMethod: order.deliveryMethod,
                                    deliveryAddress: order.deliveryAddress,
                                    deliveryNotes: order.deliveryNotes,
                                    paymentMethod: order.paymentMethod,
                                    items: (order.items || []).map((i: any) => ({
                                      product: {
                                        id: i.productId || 'item',
                                        name: i.product?.name || 'Studio Item',
                                        category: i.product?.category || 'Supplies',
                                        price: i.unitPrice || 0,
                                        description: '',
                                        image: i.product?.imageUrl || '',
                                      },
                                      quantity: i.quantity || 1,
                                    })),
                                    subtotal: order.subtotal || order.totalAmount,
                                    dispatchFee: order.dispatchFee || (order.deliveryMethod === 'KAMPALA_DISPATCH' ? 10000 : 0),
                                    total: order.totalAmount,
                                    createdAt: order.createdAt,
                                  };
                                  printReceipt(receiptData);
                                }}
                                className="px-2.5 py-1.5 bg-noir-800 hover:bg-noir-750 text-bone-dim hover:text-bone text-[10px] font-label-caps uppercase tracking-wider border border-noir-700 rounded transition-colors flex items-center gap-1 cursor-pointer"
                                title="Print or Download PDF Receipt"
                              >
                                <Icons8 name="file-invoice" size={11} className="text-gold" />
                                <span>PDF</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Bookings Content */}
                {activeHistoryTab === 'bookings' && (
                  <div>
                    {userBookings.length === 0 ? (
                      <div className="py-6 text-center space-y-2 bg-noir-850/60 rounded-xl border border-noir-800">
                        <Icons8 name="calendar-alt" size={24} className="mx-auto text-bone-muted" />
                        <p className="font-body-sm text-xs text-bone-dim">
                          No tattoo appointments booked on this device yet.
                        </p>
                        <button
                          type="button"
                          onClick={() => onNavigate('booking')}
                          className="px-4 py-1.5 bg-crimson hover:bg-crimson-hover text-bone font-label-caps text-xs uppercase rounded transition-colors"
                        >
                          Book Appointment
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-72 overflow-y-auto pr-1">
                        {userBookings.map((bkg, idx) => {
                          const matchedService = SERVICES_DATA.find(
                            (s) => s.id === bkg.serviceType || s.id.replace(/-/g, '_') === bkg.serviceType
                          );
                          const serviceTitle = matchedService ? matchedService.title : bkg.serviceType;

                          return (
                            <div
                              key={bkg.referenceCode || bkg.id || idx}
                              className="p-3.5 bg-noir-850 border border-noir-750 hover:border-noir-600 rounded-xl space-y-2.5 transition-colors text-xs font-label-data"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-gold font-bold text-xs">
                                  #{bkg.referenceCode}
                                </span>
                                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-amber-950/80 text-amber-400 border border-amber-800">
                                  {bkg.status ? bkg.status.replace('_', ' ') : 'PENDING REVIEW'}
                                </span>
                              </div>

                              <div className="space-y-0.5 text-bone-dim text-[11px]">
                                <p className="text-bone font-semibold truncate">
                                  {serviceTitle}
                                </p>
                                <p className="text-bone-muted">
                                  {bkg.preferredDate} ({bkg.preferredTimeSlot?.toUpperCase() || 'AFTERNOON'})
                                </p>
                              </div>

                              <div className="pt-1 border-t border-noir-800">
                                <a
                                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                                    `Hello Marvin Tattoos Studio! Inquiring about my booking appointment Ref #${bkg.referenceCode} (${serviceTitle}) on ${bkg.preferredDate}.`
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-full py-1.5 bg-emerald-700/80 hover:bg-emerald-600 text-white text-[10px] font-label-caps uppercase tracking-wider rounded font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                  <Icons8 name="whatsapp" size={12} />
                                  <span>WhatsApp Concierge</span>
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="w-full px-4 md:px-8 lg:px-12 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12">
          {/* Column 1: Brand & Certification */}
          <div className="space-y-5">
            <div className="space-y-3">
              <img
                alt="Marvin Tattoo Studio Logo"
                className="h-16 sm:h-20 md:h-24 w-auto object-contain filter drop-shadow-lg select-none"
                src={LOGO_URL}
              />
              <div className="font-label-caps text-xs text-crimson-light uppercase tracking-[0.25em] font-bold">
                Marvin Tattoo Studio · Kampala
              </div>
            </div>
            <p className="font-body-sm text-sm text-bone-muted leading-relaxed">
              Custom dark realism, heavy script, cover-ups, and bespoke tattoo artistry in Kampala, Uganda with hospital-grade sterilization.
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
            © 2026 MARVIN TATTOO STUDIO (@MARVINTATTOOS256). ALL RIGHTS RESERVED.
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
