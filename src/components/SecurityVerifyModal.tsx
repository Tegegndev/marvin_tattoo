import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldAlert, CheckCircle2, XCircle, Search, ExternalLink } from 'lucide-react';

interface SecurityVerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityVerifyModal: React.FC<SecurityVerifyModalProps> = ({
  isOpen,
  onClose
}) => {
  const [inputHandle, setInputHandle] = useState('');
  const [verifyResult, setVerifyResult] = useState<'verified' | 'imposter' | null>(null);

  const officialHandles = [
    '@marvin_atelier',
    'marvin_atelier',
    '@marvintattoos.official',
    'marvintattoos.official',
    '+18005556275',
    '18005556275',
    '+1 800 555-MARK',
    '8005556275',
    'marvintattoos.com',
    'marvin_tattoo'
  ];

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputHandle.trim().toLowerCase();
    if (officialHandles.some(h => h.toLowerCase() === clean)) {
      setVerifyResult('verified');
    } else {
      setVerifyResult('imposter');
    }
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
            className="relative w-full max-w-lg bg-surface-container-low border border-error/30 shadow-2xl p-6 sm:p-8 space-y-6 z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-surface-container-highest">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-error-container text-on-error-container border border-error/40">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-title-editorial text-title-editorial uppercase text-on-surface">
                    Sanctum Security &amp; Anti-Scam Protocol
                  </h3>
                  <span className="font-label-caps text-[10px] text-error uppercase tracking-wider">
                    Official Registry Verification
                  </span>
                </div>
              </div>
              <button onClick={onClose} className="p-1 text-outline hover:text-on-surface">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Advisory Info */}
            <div className="p-4 bg-error-container/20 border border-error/20 space-y-2">
              <p className="font-body-sm text-xs text-on-surface leading-relaxed">
                Fraudulent third parties periodically impersonate Master Marvin and resident artists to solicit illegitimate booking deposits. Use this tool to verify any handle or phone number contacting you.
              </p>
            </div>

            {/* Search Input Form */}
            <form onSubmit={handleVerify} className="space-y-3">
              <label className="block font-label-caps text-[10px] uppercase text-outline">
                Enter Instagram Handle, TikTok, or Phone Number to Verify
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputHandle}
                  onChange={(e) => {
                    setInputHandle(e.target.value);
                    setVerifyResult(null);
                  }}
                  placeholder="e.g. @marvin_atelier or +1 800 555-MARK"
                  className="flex-1 px-3 py-2 bg-surface-container border border-surface-container-highest text-on-surface font-body-sm text-sm focus:outline-none focus:border-error"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-caps text-xs uppercase tracking-wider flex items-center gap-1.5 border border-surface-container-highest"
                >
                  <Search className="w-4 h-4" />
                  <span>Verify</span>
                </button>
              </div>
            </form>

            {/* Verification Result Output */}
            {verifyResult === 'verified' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-emerald-950/40 border border-emerald-500/40 flex items-start gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-label-caps text-xs text-emerald-400 uppercase tracking-wider font-bold block">
                    100% Authentic Verified Channel
                  </span>
                  <p className="font-body-sm text-xs text-on-surface-variant">
                    This account or contact number is officially managed by Marvin Tattoos &amp; Piercing Atelier.
                  </p>
                </div>
              </motion.div>
            )}

            {verifyResult === 'imposter' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-error-container/40 border border-error/50 flex items-start gap-3"
              >
                <XCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-label-caps text-xs text-error uppercase tracking-wider font-bold block">
                    WARNING: Unverified / Imposter Channel
                  </span>
                  <p className="font-body-sm text-xs text-on-surface leading-snug">
                    This contact is NOT recognized in our official registry. Do NOT transfer funds or provide sensitive information. Report this account immediately.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Official Registry List */}
            <div className="space-y-2 pt-2 border-t border-surface-container-highest">
              <span className="font-label-caps text-[10px] text-outline uppercase tracking-wider block">
                Official Sanctum Channels
              </span>
              <div className="space-y-1 font-label-data text-xs">
                <div className="flex justify-between p-2 bg-surface-container">
                  <span className="text-on-surface">Instagram:</span>
                  <span className="text-primary font-bold">@marvin_atelier</span>
                </div>
                <div className="flex justify-between p-2 bg-surface-container">
                  <span className="text-on-surface">TikTok:</span>
                  <span className="text-primary font-bold">@marvintattoos.official</span>
                </div>
                <div className="flex justify-between p-2 bg-surface-container">
                  <span className="text-on-surface">WhatsApp / Phone:</span>
                  <span className="text-secondary font-bold">+1 (800) 555-MARK</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-caps text-xs uppercase tracking-wider border border-surface-container-highest transition-colors"
            >
              Dismiss Notice
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
