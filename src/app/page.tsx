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

  // Liste unique des catégories pour les filtres
  const categories = ['Tous', ...Array.from(new Set(merchants.map((m) => m.category)))];

  // Récupération des infos de la plateforme (liens + bonus)
  const getPlatformInfo = (platformName: string) => {
    const platforms = platformsData as Record<
      string,
      { refUrl?: string; directUrl?: string; url?: string; bonus?: string }
    >;
    const key = Object.keys(platforms).find(
      (k) => k.toLowerCase() === platformName.toLowerCase()
    );

    if (!key) {
      return { refUrl: '#', directUrl: '#', bonus: '' };
    }

    const p = platforms[key];
    return {
      refUrl: p.refUrl || p.url || '#',
      directUrl: p.directUrl || p.url || '#',
      bonus: p.bonus || ''
    };
  };

  // Filtrage combiné recherche + catégorie
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

      {/* Grille des enseignes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMerchants.map((merchant) => {
          const sortedOffers = [...(merchant.offers || [])].sort((a, b) => b.rate - a.rate);

          return (
            <div
              key={merchant.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                {/* En-tête de la carte */}
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-bold text-slate-800">{merchant.name}</h2>
                  <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-full font-medium">
                    {merchant.category}
                  </span>
                </div>

                {/* Encadré d'astuce de cumul */}
                {merchant.stackable && merchant.tip && (
                  <div className="mb-4 bg-amber-50 border-l-4 border-amber-400 p-2.5 text-xs text-amber-900 rounded-r-lg">
                    <strong>💡 Astuce :</strong> {merchant.tip}
                  </div>
                )}

                {/* Liste des offres avec double bouton d'action */}
                <div className="space-y-3 mb-2">
                  {sortedOffers.map((offer, idx) => {
                    const pInfo = getPlatformInfo(offer.platform);

                    return (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100 gap-2"
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-800">{offer.platform}</span>
                            <span className="text-slate-400">•</span>
                            <span className="text-slate-500 text-xs">{offer.label}</span>
                          </div>
                          <span className="font-extrabold text-blue-600 text-sm">
                            {offer.rate}{offer.unit}
                          </span>
                        </div>

                        {/* Choix utilisateur : Déjà membre VS Créer un compte */}
                        <div className="flex items-center gap-2 text-xs">
                          <a
                            href={pInfo.directUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-2.5 py-1.5 rounded-lg font-medium transition text-center flex-1 sm:flex-none"
                          >
                            J'ai un compte
                          </a>
                          <a
                            href={pInfo.refUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1.5 rounded-lg transition text-center flex-1 sm:flex-none whitespace-nowrap"
                          >
                            Créer compte {pInfo.bonus ? `(${pInfo.bonus})` : ''}
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}