'use client';

import { useState } from 'react';
import merchantsData from '../data/merchants.json';
import platformsData from '../data/platforms.json';

interface Offer {
  platform: string;
  type: string;
  label: string;
  rate: number;
  unit: string;
}

interface Merchant {
  id: string;
  name: string;
  category: string;
  offers: Offer[];
  stackable?: boolean;
  tip?: string | null;
}

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  const merchants = merchantsData as Merchant[];

  // Liste unique des catégories
  const categories = ['Tous', ...Array.from(new Set(merchants.map((m) => m.category)))];

  // Lien de parrainage
  const getPlatformUrl = (platformName: string) => {
    const platforms = platformsData as Record<string, { url?: string; refUrl?: string }>;
    const key = Object.keys(platforms).find(
      (k) => k.toLowerCase() === platformName.toLowerCase()
    );
    return key ? (platforms[key].url || platforms[key].refUrl || '#') : '#';
  };

  // Code parrain
  const getPlatformCode = (platformName: string) => {
    const platforms = platformsData as Record<string, { code?: string }>;
    const key = Object.keys(platforms).find(
      (k) => k.toLowerCase() === platformName.toLowerCase()
    );
    return key ? platforms[key].code : null;
  };

  // Filtre recherche + catégorie
  const filteredMerchants = merchants.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'Tous' || m.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
          Maximise tes gains Cashback
        </h1>
        <p className="mt-2 text-slate-600">
          Trouve la meilleure astuce (bon d'achat ou cashback) pour tes enseignes du quotidien.
        </p>
      </div>

      {/* Barre de recherche */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Rechercher une enseigne (ex : Carrefour, Fnac)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3.5 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
        />
      </div>

      {/* Filtres par catégorie */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grille des marchands */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMerchants.map((merchant) => {
          const sortedOffers = [...(merchant.offers || [])].sort((a, b) => b.rate - a.rate);
          const topOffer = sortedOffers[0];
          const topCode = topOffer ? getPlatformCode(topOffer.platform) : null;

          return (
            <div
              key={merchant.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                {/* Nom et Categorie */}
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-bold text-slate-800">{merchant.name}</h2>
                  <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-full font-medium">
                    {merchant.category}
                  </span>
                </div>

                {/* Astuce Cumul */}
                {merchant.stackable && merchant.tip && (
                  <div className="mb-4 bg-amber-50 border-l-4 border-amber-400 p-2.5 text-xs text-amber-900 rounded-r-lg">
                    <strong>💡 Astuce :</strong> {merchant.tip}
                  </div>
                )}

                {/* Liste de toutes les offres */}
                <div className="space-y-2 mb-4">
                  {sortedOffers.map((offer, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-700">{offer.platform}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500">{offer.label}</span>
                      </div>
                      <span className="font-extrabold text-blue-600">
                        {offer.rate}{offer.unit}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Code parrain */}
                {topCode && (
                  <p className="text-xs text-slate-500 mb-4">
                    Code parrain :{' '}
                    <code className="bg-slate-100 font-mono px-1.5 py-0.5 rounded text-slate-800 font-bold">
                      {topCode}
                    </code>
                  </p>
                )}
              </div>

              {/* Bouton d'activation vers la meilleure plateforme */}
              {topOffer && (
                <a
                  href={getPlatformUrl(topOffer.platform)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-xs text-center block transition"
                >
                  Activer l'offre chez {topOffer.platform}
                </a>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}