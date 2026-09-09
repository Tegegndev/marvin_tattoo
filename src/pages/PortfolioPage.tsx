import React, { useState, useEffect, useMemo } from 'react';
import { PageView, PortfolioPiece, ServiceItem } from '../types';
import { PORTFOLIO_DATA, SERVICES_DATA } from '../data/atelierData';
import { fetchPortfolioPieces, fetchServices } from '../services/apiClient';
import { motion } from 'framer-motion';
import { Icons8 } from '../components/Icons8';

interface PortfolioPageProps {
  onNavigate: (page: PageView) => void;
  onSelectPiece: (piece: PortfolioPiece) => void;
  onBookSimilar: (piece: PortfolioPiece) => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({
  onSelectPiece,
  onBookSimilar
}) => {
  const [portfolioList, setPortfolioList] = useState<PortfolioPiece[]>(PORTFOLIO_DATA);
  const [servicesList, setServicesList] = useState<ServiceItem[]>(SERVICES_DATA);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCycle, setSelectedCycle] = useState<string>('all');
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [selectedArtist, setSelectedArtist] = useState<string>('all');

  useEffect(() => {
    fetchPortfolioPieces().then(setPortfolioList).catch(() => {});
    fetchServices().then(setServicesList).catch(() => {});
  }, []);

  // Construct dynamic category tabs directly from studio services catalog
  const categories = useMemo(() => {
    const allTab = { id: 'all', label: 'All Disciplines', count: portfolioList.length };
    const serviceTabs = servicesList.map((srv) => {
      const sId = srv.id.toLowerCase();
      const count = portfolioList.filter((p) => {
        if (p.serviceId && p.serviceId.toLowerCase() === sId) return true;
        const pCat = (p.category || '').toLowerCase();
        const pLabel = (p.categoryLabel || '').toLowerCase();
        if (sId.includes('realism') && (pCat === 'dark-realism' || pLabel.includes('realism'))) return true;
        if (sId.includes('fine-line') && (pCat === 'micro-detail' || pLabel.includes('fine-line') || pLabel.includes('botanical'))) return true;
        if (sId.includes('lettering') && (pLabel.includes('script') || pLabel.includes('lettering'))) return true;
        if (sId.includes('tribal') && (pLabel.includes('tribal') || pLabel.includes('traditional'))) return true;
        if (sId.includes('cover') && (pCat === 'coverup' || pLabel.includes('cover'))) return true;
        if (sId.includes('pmu') && (pCat === 'pmu' || pLabel.includes('pmu') || pLabel.includes('brow'))) return true;
        if (sId.includes('piercing') && (pCat === 'piercing' || pLabel.includes('piercing'))) return true;
        if (sId.includes('laser') && (pLabel.includes('laser') || pLabel.includes('clearance'))) return true;
        return false;
      }).length;

      return {
        id: srv.id,
        label: `${srv.disciplineNumber}. ${srv.title}`,
        shortLabel: srv.title,
        count,
      };
    });

    return [allTab, ...serviceTabs];
  }, [portfolioList, servicesList]);

  const zones = [
    'All Zones',
    'Forearm',
    'Backpiece',
    'Collarbone',
    'Chest',
    'Face & Brow',
    'Abdomen / Navel',
    'Hands',
    'Ear Stack'
  ];

  const artists = [
    { id: 'all', label: 'All Artists' },
    { id: 'Marvin', label: 'Marvin' },
    { id: 'Elena Kostas', label: 'Elena Kostas' },
    { id: 'S. Choi', label: 'S. Choi' }
  ];

  const filteredPieces = portfolioList.filter((piece) => {
    if (selectedCategory !== 'all') {
      const sel = selectedCategory.toLowerCase();
      const pServId = (piece.serviceId || '').toLowerCase();
      const pCat = (piece.category || '').toLowerCase();
      const pLabel = (piece.categoryLabel || '').toLowerCase();

      const matchesService = pServId === sel;
      const matchesLegacy = 
        (sel.includes('realism') && (pCat === 'dark-realism' || pLabel.includes('realism'))) ||
        (sel.includes('fine-line') && (pCat === 'micro-detail' || pLabel.includes('fine-line') || pLabel.includes('botanical'))) ||
        (sel.includes('lettering') && (pLabel.includes('script') || pLabel.includes('lettering'))) ||
        (sel.includes('tribal') && (pLabel.includes('tribal') || pLabel.includes('traditional'))) ||
        (sel.includes('cover') && (pCat === 'coverup' || pLabel.includes('cover'))) ||
        (sel.includes('pmu') && (pCat === 'pmu' || pLabel.includes('pmu') || pLabel.includes('brow'))) ||
        (sel.includes('piercing') && (pCat === 'piercing' || pLabel.includes('piercing'))) ||
        (sel.includes('laser') && (pLabel.includes('laser') || pLabel.includes('clearance')));

      if (!matchesService && !matchesLegacy) {
        return false;
      }
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

  const featuredPiece = portfolioList.find((p) => p.featured) || portfolioList[0];

  return (
    <div className="w-full pt-20 bg-noir-950 min-h-screen">
      {/* Top Taxonomy & Refinement Header */}
      <section className="w-full bg-noir-900 px-4 md:px-8 lg:px-12 py-6 border-b border-noir-700/60 sticky top-20 z-30 shadow-md">
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
                      ? 'bg-crimson text-bone shadow-md'
                      : 'bg-noir-850 text-bone-muted hover:text-bone hover:bg-noir-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Healing State Toggle */}
            <div className="flex items-center bg-noir-850 p-1 shrink-0 ml-4 border border-noir-700">
              <button
                onClick={() => setSelectedCycle('all')}
                className={`px-3 py-1 font-label-caps text-[10px] uppercase transition-colors ${
                  selectedCycle === 'all' ? 'bg-noir-700 text-bone' : 'text-bone-dim hover:text-bone'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedCycle('healed')}
                className={`px-3 py-1 font-label-caps text-[10px] uppercase transition-colors ${
                  selectedCycle === 'healed' ? 'bg-noir-700 text-bone' : 'text-bone-dim hover:text-bone'
                }`}
              >
                Healed
              </button>
              <button
                onClick={() => setSelectedCycle('fresh')}
                className={`px-3 py-1 font-label-caps text-[10px] uppercase transition-colors ${
                  selectedCycle === 'fresh' ? 'bg-noir-700 text-bone' : 'text-bone-dim hover:text-bone'
                }`}
              >
                Fresh
              </button>
            </div>
          </div>

          {/* Secondary Refinement Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-bone-dim pt-2 border-t border-noir-700/40 text-xs font-label-data">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-bone font-semibold uppercase flex items-center gap-1">
                <Icons8 name="filter" size={14} className="text-crimson-light" />
                <span>Placement:</span>
              </span>
              {zones.map((z) => (
                <button
                  key={z}
                  onClick={() => setSelectedZone(z)}
                  className={`px-2 py-0.5 uppercase transition-colors ${
                    selectedZone === z || (selectedZone === 'all' && z === 'All Zones')
                      ? 'bg-noir-700 text-crimson-light border border-crimson/30'
                      : 'bg-noir-850 text-bone-dim hover:text-bone'
                  }`}
                >
                  {z}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 font-label-caps text-[11px] uppercase">
              <span className="text-bone-dim">Artist:</span>
              {artists.map((art, i) => (
                <React.Fragment key={art.id}>
                  {i > 0 && <span className="text-bone-muted">/</span>}
                  <button
                    onClick={() => setSelectedArtist(art.id)}
                    className={`transition-colors ${
                      selectedArtist === art.id ? 'text-crimson-light font-bold underline' : 'text-bone-dim hover:text-bone'
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

      {/* Featured Masterpiece Spotlight */}
      <section className="w-full bg-noir-950 px-4 md:px-8 lg:px-12 py-12 border-b border-noir-700/40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="font-label-caps text-xs text-gold uppercase tracking-[0.25em]">
              Featured Work
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 bg-noir-900 border border-noir-700 overflow-hidden">
            {/* Visual Column */}
            <div
              onClick={() => onSelectPiece(featuredPiece)}
              className="lg:col-span-7 relative min-h-[460px] lg:min-h-[560px] max-h-[620px] bg-noir-950 cursor-pointer group flex items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-noir-700"
            >
              <img
                src={featuredPiece.image}
                alt={featuredPiece.title}
                className="w-full h-full object-cover object-[center_20%] filter grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-noir-950/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                <span className="bg-crimson text-bone font-label-caps text-[10px] px-3 py-1 uppercase tracking-widest border border-crimson/30 shadow-md">
                  Featured Masterpiece
                </span>
                <span className="bg-noir-950/90 backdrop-blur-sm text-gold font-label-caps text-[10px] px-3 py-1 uppercase border border-gold/30">
                  {featuredPiece.healingState}
                </span>
              </div>
            </div>

            {/* Spec Sheet Column */}
            <div className="lg:col-span-5 p-6 lg:p-8 flex flex-col justify-between space-y-6 bg-noir-900">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="font-label-caps text-xs text-crimson-light uppercase tracking-widest">
                    {featuredPiece.categoryLabel}
                  </span>
                  <h2 className="font-headline-lg text-2xl lg:text-3xl text-bone uppercase tracking-tight font-bold">
                    {featuredPiece.title}
                  </h2>
                </div>

                <p className="font-body-md text-sm text-bone-muted leading-relaxed">
                  {featuredPiece.description}
                </p>

                {/* Spec List */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-noir-850 border border-noir-700/60 space-y-1">
                    <span className="font-label-caps text-[9px] text-bone-dim uppercase block">
                      Artist
                    </span>
                    <span className="font-label-data text-xs text-bone uppercase font-bold">
                      {featuredPiece.artist}
                    </span>
                  </div>

                  <div className="p-3 bg-noir-850 border border-noir-700/60 space-y-1">
                    <span className="font-label-caps text-[9px] text-bone-dim uppercase block">
                      Duration
                    </span>
                    <span className="font-label-data text-xs text-gold uppercase font-bold">
                      {featuredPiece.duration}
                    </span>
                  </div>

                  <div className="p-3 bg-noir-850 border border-noir-700/60 space-y-1">
                    <span className="font-label-caps text-[9px] text-bone-dim uppercase block">
                      Pigment
                    </span>
                    <span className="font-label-data text-xs text-bone uppercase font-bold">
                      {featuredPiece.pigment}
                    </span>
                  </div>

                  <div className="p-3 bg-noir-850 border border-noir-700/60 space-y-1">
                    <span className="font-label-caps text-[9px] text-bone-dim uppercase block">
                      Placement
                    </span>
                    <span className="font-label-data text-xs text-bone uppercase font-bold">
                      {featuredPiece.morphology}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-noir-700/60 flex items-center justify-between gap-4">
                <button
                  onClick={() => onSelectPiece(featuredPiece)}
                  className="px-4 py-2.5 bg-noir-800 hover:bg-noir-700 text-bone font-label-caps text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5"
                >
                  <Icons8 name="eye" size={16} className="text-crimson-light" />
                  <span>View Piece</span>
                </button>
                <button
                  onClick={() => onBookSimilar(featuredPiece)}
                  className="flex-1 py-2.5 bg-crimson hover:bg-crimson-hover text-bone font-label-caps text-xs uppercase tracking-widest transition-all btn-gothic-glow text-center border border-crimson/30"
                >
                  Book Similar
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Portfolio Masonry Grid */}
      <section className="w-full px-4 md:px-8 lg:px-12 py-16 bg-noir-950">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-md text-2xl uppercase text-bone font-bold">
              Portfolio ({filteredPieces.length})
            </h3>
            <span className="font-label-data text-xs text-bone-dim">
              {filteredPieces.length} of {portfolioList.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPieces.map((piece) => (
              <motion.div
                key={piece.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative bg-noir-850 overflow-hidden flex flex-col gothic-card border border-noir-700/60 hover:border-crimson/30"
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
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-noir-950/85 backdrop-blur-sm text-gold font-label-caps text-[10px] uppercase tracking-widest border border-gold/30">
                    {piece.healingState}
                  </div>
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 bg-noir-950/90 text-bone font-label-data text-[10px] uppercase">
                    {piece.zone}
                  </div>
                </div>

                <div className="p-5 flex flex-col justify-between flex-1 bg-noir-850">
                  <div className="space-y-2">
                    <div className="text-[10px] font-label-caps text-crimson-light uppercase tracking-widest font-semibold">
                      {piece.service?.title || piece.categoryLabel || piece.category.replace(/-/g, ' ')}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-title-editorial text-lg uppercase text-bone group-hover:text-crimson-light transition-colors">
                        {piece.title}
                      </span>
                      <span className="font-label-data text-xs text-bone-dim">
                        {piece.artist}
                      </span>
                    </div>

                    <p className="font-body-sm text-xs text-bone-muted line-clamp-2 leading-relaxed">
                      {piece.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-noir-700/60">
                    <span className="font-label-caps text-[10px] text-bone-dim uppercase tracking-wider">
                      {piece.flashId}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectPiece(piece)}
                        className="px-3 py-1.5 bg-noir-800 hover:bg-noir-700 text-bone font-label-caps text-xs uppercase tracking-wider transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => onBookSimilar(piece)}
                        className="px-3 py-1.5 bg-crimson hover:bg-crimson-hover text-bone font-label-caps text-xs uppercase tracking-wider transition-all duration-300"
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
            <div className="text-center py-20 bg-noir-850 p-8 space-y-4 border border-noir-700">
              <p className="font-title-editorial text-lg text-bone">
                No pieces match your filters.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedCycle('all');
                  setSelectedZone('all');
                  setSelectedArtist('all');
                }}
                className="px-6 py-2 bg-crimson text-bone font-label-caps text-xs uppercase tracking-widest"
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
