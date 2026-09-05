import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledMessage?: string;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  prefilledMessage
}) => {
  const [topic, setTopic] = useState<'consultation' | 'piercing' | 'aftercare' | 'walkin'>('consultation');
  const [message, setMessage] = useState(
    prefilledMessage || 'Greetings Master Marvin. I wish to inquire regarding an upcoming dark realism session...'
  );
  const [copied, setCopied] = useState(false);

  const phone = '+1 (800) 555-MARK';
  const cleanPhone = '18005556275';

  const handleLaunchWhatsApp = () => {
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-surface-container-low border border-surface-container-highest shadow-2xl p-6 sm:p-8 space-y-6 z-10"
          >
            <div className="flex items-center justify-between pb-3 border-b border-surface-container-highest">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-secondary/20 border border-secondary text-secondary flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-title-editorial text-title-editorial uppercase text-on-surface">
                    Direct WhatsApp Desk
                  </h3>
                  <span className="font-label-data text-xs text-secondary flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                    Verified Line: {phone}
                  </span>
                </div>
              </div>
              <button onClick={onClose} className="p-1 text-outline hover:text-on-surface">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Inquiry Vector */}
            <div className="space-y-2">
              <label className="font-label-caps text-[10px] text-outline uppercase tracking-wider block">
                Select Inquiry Vector
              </label>
              <div className="grid grid-cols-2 gap-2 font-label-data text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setTopic('consultation');
                    setMessage('Greetings. I would like to schedule a custom dark realism tattoo consultation with Master Marvin.');
                  }}
                  className={`p-2.5 text-left border transition-all ${
                    topic === 'consultation'
                      ? 'bg-surface-bright border-primary text-primary'
                      : 'bg-surface-container border-surface-container-highest text-outline hover:text-on-surface'
                  }`}
                >
                  Custom Tattoo Inquiry
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTopic('piercing');
                    setMessage('Hello, I would like to book an appointment for an ASTM F-136 titanium curated ear piercing.');
                  }}
                  className={`p-2.5 text-left border transition-all ${
                    topic === 'piercing'
                      ? 'bg-surface-bright border-secondary text-secondary'
                      : 'bg-surface-container border-surface-container-highest text-outline hover:text-on-surface'
                  }`}
                >
                  Titanium Piercing
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTopic('walkin');
                    setMessage('Hello! Are there any Saturday walk-in slots currently open for flash tattoos?');
                  }}
                  className={`p-2.5 text-left border transition-all ${
                    topic === 'walkin'
                      ? 'bg-surface-bright border-primary text-primary'
                      : 'bg-surface-container border-surface-container-highest text-outline hover:text-on-surface'
                  }`}
                >
                  Saturday Walk-In Check
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTopic('aftercare');
                    setMessage('Hello Marvin Atelier team. I have a question regarding my ongoing tattoo healing and aftercare protocol.');
                  }}
                  className={`p-2.5 text-left border transition-all ${
                    topic === 'aftercare'
                      ? 'bg-surface-bright border-secondary text-secondary'
                      : 'bg-surface-container border-surface-container-highest text-outline hover:text-on-surface'
                  }`}
                >
                  Aftercare Protocol Help
                </button>
              </div>
            </div>

            {/* Message Area */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-label-caps text-[10px] text-outline uppercase tracking-wider">
                  Prefilled Message
                </label>
                <button
                  onClick={handleCopy}
                  className="font-label-caps text-[10px] text-secondary uppercase hover:underline flex items-center gap-1"
                >
                  {copied ? <CheckCircle2 className="w-3 h-3 text-secondary" /> : null}
                  {copied ? 'Copied to Clipboard' : 'Copy Text'}
                </button>
              </div>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 bg-surface-container border border-surface-container-highest text-on-surface font-body-sm text-sm focus:outline-none focus:border-secondary transition-colors"
              />
            </div>

            <div className="p-3 bg-surface-container border border-surface-container-highest flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-secondary shrink-0" />
              <p className="font-body-sm text-[11px] text-outline">
                Marvin Tattoos never solicits deposits via personal cash apps or unverified phone numbers.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleLaunchWhatsApp}
                className="flex-1 py-3 bg-secondary text-on-secondary font-label-caps text-xs uppercase tracking-widest transition-all hover:bg-secondary-fixed flex items-center justify-center gap-2 font-bold shadow-lg"
              >
                <Send className="w-4 h-4" />
                <span>Launch Verified WhatsApp</span>
              </button>
              <button
                onClick={onClose}
                className="px-5 py-3 bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-caps text-xs uppercase tracking-wider transition-colors border border-surface-container-highest"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
