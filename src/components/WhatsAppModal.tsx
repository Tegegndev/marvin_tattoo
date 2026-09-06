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
    prefilledMessage || "Hi, I'd like to ask about booking a dark realism tattoo."
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
            className="relative w-full max-w-lg bg-noir-900 border border-noir-700 shadow-2xl p-6 sm:p-8 space-y-6 z-10"
          >
            <div className="flex items-center justify-between pb-3 border-b border-noir-700">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-gold/20 border border-gold text-gold flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-title-editorial text-title-editorial uppercase text-bone">
                    WhatsApp
                  </h3>
                  <span className="font-label-data text-xs text-gold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                    Line: {phone}
                  </span>
                </div>
              </div>
              <button onClick={onClose} className="p-1 text-bone-dim hover:text-bone">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Topic */}
            <div className="space-y-2">
              <label className="font-label-caps text-[10px] text-bone-dim uppercase tracking-wider block">
                What's your question?
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
                      ? 'bg-noir-700 border-crimson text-crimson-light'
                      : 'bg-noir-850 border-noir-700 text-bone-dim hover:text-bone'
                  }`}
                >
                  Custom Tattoo Inquiry
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTopic('piercing');
                    setMessage("Hi, I'd like to book an ear piercing appointment.");
                  }}
                  className={`p-2.5 text-left border transition-all ${
                    topic === 'piercing'
                      ? 'bg-noir-700 border-gold text-gold'
                      : 'bg-noir-850 border-noir-700 text-bone-dim hover:text-bone'
                  }`}
                >
                  Titanium Piercing
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTopic('walkin');
                    setMessage("Hi! Do you have Saturday walk-in spots open for flash tattoos?");
                  }}
                  className={`p-2.5 text-left border transition-all ${
                    topic === 'walkin'
                      ? 'bg-noir-700 border-crimson text-crimson-light'
                      : 'bg-noir-850 border-noir-700 text-bone-dim hover:text-bone'
                  }`}
                >
                  Saturday Walk-In Check
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTopic('aftercare');
                    setMessage("Hi, I have a question about healing and aftercare for my new tattoo.");
                  }}
                  className={`p-2.5 text-left border transition-all ${
                    topic === 'aftercare'
                      ? 'bg-noir-700 border-gold text-gold'
                      : 'bg-noir-850 border-noir-700 text-bone-dim hover:text-bone'
                  }`}
                >
                  Aftercare Protocol Help
                </button>
              </div>
            </div>

            {/* Message Area */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-label-caps text-[10px] text-bone-dim uppercase tracking-wider">
                  Message
                </label>
                <button
                  onClick={handleCopy}
                  className="font-label-caps text-[10px] text-gold uppercase hover:underline flex items-center gap-1"
                >
                  {copied ? <CheckCircle2 className="w-3 h-3 text-gold" /> : null}
                  {copied ? 'Copied to Clipboard' : 'Copy Text'}
                </button>
              </div>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 bg-noir-850 border border-noir-700 text-bone font-body-sm text-sm focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            <div className="p-3 bg-noir-850 border border-noir-700 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
              <p className="font-body-sm text-[11px] text-bone-dim">
                We never ask for deposits through personal cash apps or unverified phone numbers.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleLaunchWhatsApp}
                className="flex-1 py-3 bg-gold text-noir-950 font-label-caps text-xs uppercase tracking-widest transition-all hover:bg-gold-light flex items-center justify-center gap-2 font-bold shadow-lg"
              >
                <Send className="w-4 h-4" />
                <span>Open WhatsApp</span>
              </button>
              <button
                onClick={onClose}
                className="px-5 py-3 bg-noir-800 hover:bg-noir-700 text-bone font-label-caps text-xs uppercase tracking-wider transition-colors border border-noir-700"
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
