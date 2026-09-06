import React, { useState } from 'react';
import { PageView, PortfolioPiece } from '../types';
import { PORTFOLIO_DATA } from '../data/atelierData';
import { motion } from 'framer-motion';
import { Filter, Eye } from 'lucide-react';

interface PortfolioPageProps {
  onNavigate: (page: PageView) => void;
  onSelectPiece: (piece: PortfolioPiece) => void;
  onBookSimilar: (piece: PortfolioPiece) => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({
  onNavigate,
  onSelectPiece,
  onBookSimilar
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCycle, setSelectedCycle] = useState<string>('all');
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [selectedArtist, setSelectedArtist] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'dark-realism', label: 'Dark Realism' },
    { id: 'neo-arcane', label: 'Neo-Traditional' },
    { id: 'micro-detail', label: 'Micro & Single-Needle' },
    { id: 'piercing', label: 'Piercings' },
    { id: 'coverup', label: 'Cover-Ups' },
  ];

  const zones = [
    'All Zones',
    'Full Sleeve',
    'Backpiece',
    'Chest',
    'Hands',
    'Ear Stack'
  ];

  const artists = [
    { id: 'all', label: 'All Artists' },
    { id: 'Master Marvin', label: 'Marvin' },
    { id: 'Elena Kostas', label: 'Elena Kostas' },
    { id: 'S. Choi', label: 'S. Choi' }
  ];

  const filteredPieces = PORTFOLIO_DATA.filter((piece) => {
    if (selectedCategory !== 'all' && piece.category !== selectedCategory) {
      return false;
    }
    if (selectedCycle !== 'all' && piece.cycle !== selectedCycle) {
      return false;
    }
    if (selectedZone !== 'all' && selectedZone !== 'All Zones' && piece.zone !== selectedZone) {
      return false;
    }
    if (selectedArtist !== 'all' && piece.artist !== selectedArtist) {
      return false;
    }
    return true;
  });

  const featuredPiece = PORTFOLIO_DATA.find((p) => p.featured) || PORTFOLIO_DATA[0];

  return (
    <div className="w-full pt-20 bg-surface-container-lowest min-h-screen">
      {/* Top Taxonomy & Refinement Header */}
      <section className="w-full bg-surface-container-low px-4 md:px-8 lg:px-12 py-6 border-b border-surface-container-highest/60 sticky top-20 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          {/* Primary Style Tabs */}
          <div className="flex items-center justify-between overflow-x-auto no-scrollbar gap-2 pb-1">
            <div className="flex items-center gap-2 shrink-0">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 font-label-caps text-xs uppercase tracking-wider transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-primary-container text-on-surface shadow-md'
                      : 'bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Healing State Toggle */}
            <div className="flex items-center bg-surface-container p-1 shrink-0 ml-4 border border-surface-container-highest">
              <button
                onClick={() => setSelectedCycle('all')}
                className={`px-3 py-1 font-label-caps text-[10px] uppercase transition-colors ${
                  selectedCycle === 'all' ? 'bg-surface-bright text-on-surface' : 'text-outline hover:text-on-surface'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedCycle('healed')}
                className={`px-3 py-1 font-label-caps text-[10px] uppercase transition-colors ${
                  selectedCycle === 'healed' ? 'bg-surface-bright text-on-surface' : 'text-outline hover:text-on-surface'
                }`}
              >
                Healed
              </button>
              <button
                onClick={() => setSelectedCycle('fresh')}
                className={`px-3 py-1 font-label-caps text-[10px] uppercase transition-colors ${
                  selectedCycle === 'fresh' ? 'bg-surface-bright text-on-surface' : 'text-outline hover:text-on-surface'
                }`}
              >
                Fresh
              </button>
            </div>
          </div>

          {/* Secondary Refinement Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-outline pt-2 border-t border-surface-container-highest/40 text-xs font-label-data">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-on-surface font-semibold uppercase flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-primary" />
                <span>Placement:</span>
              </span>
              {zones.map((z) => (
                <button
                  key={z}
                  onClick={() => setSelectedZone(z)}
                  className={`px-2 py-0.5 uppercase transition-colors ${
                    selectedZone === z || (selectedZone === 'all' && z === 'All Zones')
                      ? 'bg-surface-bright text-primary border border-primary/30'
                      : 'bg-surface-container text-outline hover:text-on-surface'
                  }`}
                >
                  {z}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 font-label-caps text-[11px] uppercase">
              <span className="text-outline">Artist:</span>
              {artists.map((art, i) => (
                <React.Fragment key={art.id}>
                  {i > 0 && <span className="text-surface-variant">/</span>}
                  <button
                    onClick={() => setSelectedArtist(art.id)}
                    className={`transition-colors ${
                      selectedArtist === art.id ? 'text-primary font-bold underline' : 'text-outline hover:text-on-surface'
                    }`}
                  >
                    {art.label}
                  </button>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Masterpiece Spotlight: The Luciferian Seraph */}
      <section className="w-full bg-surface-container-lowest px-4 md:px-8 lg:px-12 py-12 border-b border-surface-container-highest/40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="font-label-caps text-xs text-secondary uppercase tracking-[0.25em]">
              Featured Work
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 bg-surface-container-low border border-surface-container-highest shadow-2xl overflow-hidden">
            {/* Visual Column */}
            <div
              onClick={() => onSelectPiece(featuredPiece)}
              className="lg:col-span-7 relative min-h-[420px] lg:min-h-[520px] bg-surface-container-lowest cursor-pointer group"
            >
              <img
                src={featuredPiece.image}
                alt={featuredPiece.title}
                className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="bg-primary-container text-on-surface font-label-caps text-[10px] px-3 py-1 uppercase tracking-widest shadow-lg">
                  Featured
                </span>
                <span className="bg-surface-container-lowest/90 backdrop-blur-sm text-secondary font-label-caps text-[10px] px-3 py-1 uppercase border border-secondary/30">
                  {featuredPiece.healingState}
                </span>
              </div>
            </div>

            {/* Spec Sheet Column */}
            <div className="lg:col-span-5 p-6 lg:p-8 flex flex-col justify-between space-y-6 bg-surface-container-low">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="font-label-caps text-xs text-primary uppercase tracking-widest">
                    {featuredPiece.categoryLabel}
                  </span>
                  <h2 className="font-headline-lg text-2xl lg:text-3xl text-on-surface uppercase tracking-tight font-bold">
                    {featuredPiece.title}
                  </h2>
                </div>

                <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                  {featuredPiece.description}
                </p>

                {/* Spec List */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-surface-container border border-surface-container-highest/60 space-y-1">
                    <span className="font-label-caps text-[9px] text-outline uppercase block">
                      Artist
                    </span>
                    <span className="font-label-data text-xs text-on-surface uppercase font-bold">
                      {featuredPiece.artist}
                    </span>
                  </div>

                  <div className="p-3 bg-surface-container border border-surface-container-highest/60 space-y-1">
                    <span className="font-label-caps text-[9px] text-outline uppercase block">
                      Duration
                    </span>
                    <span className="font-label-data text-xs text-secondary uppercase font-bold">
                      {featuredPiece.duration}
                    </span>
                  </div>

                  <div className="p-3 bg-surface-container border border-surface-container-highest/60 space-y-1">
                    <span className="font-label-caps text-[9px] text-outline uppercase block">
                      Pigment
                    </span>
                    <span className="font-label-data text-xs text-on-surface uppercase font-bold">
                      {featuredPiece.pigment}
                    </span>
                  </div>

                  <div className="p-3 bg-surface-container border border-surface-container-highest/60 space-y-1">
                    <span className="font-label-caps text-[9px] text-outline uppercase block">
                      Placement
                    </span>
                    <span className="font-label-data text-xs text-on-surface uppercase font-bold">
                      {featuredPiece.morphology}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-surface-container-highest/60 flex items-center justify-between gap-4">
                <button
                  onClick={() => onSelectPiece(featuredPiece)}
                  className="px-4 py-2.5 bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-caps text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5"
                >
                  <Eye className="w-4 h-4 text-primary" />
                  <span>View Piece</span>
                </button>
                <button
                  onClick={() => onBookSimilar(featuredPiece)}
                  className="flex-1 py-2.5 bg-primary-container hover:bg-on-primary-fixed-variant text-on-surface font-label-caps text-xs uppercase tracking-widest transition-all btn-gothic-glow text-center border border-primary/30"
                >
                  Book Similar
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Portfolio Masonry Grid */}
      <section className="w-full px-4 md:px-8 lg:px-12 py-16 bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-md text-2xl uppercase text-on-surface font-bold">
              Portfolio ({filteredPieces.length})
            </h3>
            <span className="font-label-data text-xs text-outline">
              {filteredPieces.length} of {PORTFOLIO_DATA.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPieces.map((piece, idx) => (
              <motion.div
                key={piece.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="group relative bg-surface-container overflow-hidden shadow-xl flex flex-col gothic-card border border-surface-container-highest/60 hover:border-primary/30"
              >
                <div
                  onClick={() => onSelectPiece(piece)}
                  className="relative w-full h-80 overflow-hidden cursor-pointer"
                >
                  <img
                    src={piece.image}
                    alt={piece.title}
                    className="w-full h-full object-cover interactive-img-zoom"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-surface-container-lowest/85 backdrop-blur-sm text-secondary font-label-caps text-[10px] uppercase tracking-widest border border-secondary/30">
                    {piece.healingState}
                  </div>
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 bg-surface-container-lowest/90 text-on-surface font-label-data text-[10px] uppercase">
                    {piece.zone}
                  </div>
                </div>

                <div className="p-5 flex flex-col justify-between flex-1 bg-surface-container">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-title-editorial text-lg uppercase text-on-surface group-hover:text-primary transition-colors">
                        {piece.title}
                      </span>
                      <span className="font-label-data text-xs text-outline">
                        {piece.artist}
                      </span>
                    </div>

                    <p className="font-body-sm text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                      {piece.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-surface-container-highest/60">
                    <span className="font-label-caps text-[10px] text-outline uppercase tracking-wider">
                      {piece.flashId}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectPiece(piece)}
                        className="px-3 py-1.5 bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-caps text-xs uppercase tracking-wider transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => onBookSimilar(piece)}
                        className="px-3 py-1.5 bg-primary-container hover:bg-on-primary-fixed-variant text-on-surface font-label-caps text-xs uppercase tracking-wider transition-all duration-300"
                      >
                        Book
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredPieces.length === 0 && (
            <div className="text-center py-20 bg-surface-container p-8 space-y-4 border border-surface-container-highest">
              <p className="font-title-editorial text-lg text-on-surface">
                No pieces match your filters.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedCycle('all');
                  setSelectedZone('all');
                  setSelectedArtist('all');
                }}
                className="px-6 py-2 bg-primary-container text-on-surface font-label-caps text-xs uppercase tracking-widest"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
