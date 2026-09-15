'use client';

import { useState } from 'react';
import merchantsData from '../data/merchants.json';
import platformsData from '../data/platforms.json';

type PlatformKey = keyof typeof platformsData;

export default function Home() {
  const [search, setSearch] = useState('');

  const filteredMerchants = merchantsData.filter((merchant) =>
    merchant.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans text-slate-800">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-extrabold text-slate-900 md:text-4xl">
            Maximise tes gains Cashback
          </h1>
          <p className="text-slate-600">
            Trouve la meilleure astuce (bon d'achat ou cashback) pour tes enseignes du quotidien.
          </p>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher une enseigne (ex: Carrefour, Fnac)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-4 pl-5 rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {filteredMerchants.map((item) => {
            const platformInfo = platformsData[item.platform as PlatformKey];
            const referralUrl = platformInfo?.url || '#';
            const promoCode = platformInfo?.code;

            return (
              <div key={item.id} className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-900">{item.name}</h2>
                    <span className="text-xs px-2.5 py-1 bg-slate-100 rounded-full font-medium text-slate-600">
                      {item.category}
                    </span>
                  </div>
                  <div className="text-sm space-y-1">
                    <p><span className="font-semibold text-slate-700">Meilleure offre :</span> {item.bestOption}</p>
                    <p><span className="font-semibold text-slate-700">Gain :</span> <span className="text-emerald-600 font-bold">{item.rate}</span> chez {item.platform}</p>
                    <p className="text-xs text-amber-600 font-medium">✨ {item.welcomeBonus}</p>
                    {promoCode && (
                      <p className="text-xs text-slate-500 pt-1">
                        Code parrain : <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-semibold">{promoCode}</span>
                      </p>
                    )}
                  </div>
                </div>

                <a
                  href={referralUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition mt-4"
                >
                  Activer l'offre chez {item.platform}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}