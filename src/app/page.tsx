import Link from 'next/link';
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
  stackable: boolean;
  tip: string | null;
}

export default function HomePage() {
  const merchants: Merchant[] = merchantsData as Merchant[];

  // Fonction pour obtenir le lien de parrainage d'une plateforme
  const getPlatformUrl = (platformName: string) => {
    const platform = (platformsData as any[]).find(
      (p) => p.name.toLowerCase() === platformName.toLowerCase()
    );
    return platform ? platform.refUrl : '#';
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'bon_achat':
        return <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-0.5 rounded">Bon d'achat</span>;
      case 'the_corner':
        return <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-0.5 rounded">Banque (The Corner)</span>;
      default:
        return <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded">Cashback</span>;
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
          Compare & Maximise ton Cashback
        </h1>
        <p className="mt-3 text-slate-600 text-lg">
          Trouve la meilleure combinaison (Bons d'achat + Cashback + Primes) pour chaque enseigne.
        </p>
      </div>

      <div className="space-y-6">
        {merchants.map((merchant) => {
          // Trouver l'offre la plus haute
          const sortedOffers = [...merchant.offers].sort((a, b) => b.rate - a.rate);
          const topOffer = sortedOffers[0];

          return (
            <div
              key={merchant.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                    {merchant.category}
                  </span>
                  <h2 className="text-2xl font-bold text-slate-800">{merchant.name}</h2>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Jusqu'à</span>
                  <span className="text-3xl font-black text-blue-600">
                    {topOffer.rate}{topOffer.unit}
                  </span>
                </div>
              </div>

              {/* Astuce de cumul si disponible */}
              {merchant.stackable && merchant.tip && (
                <div className="mt-4 bg-amber-50 border-l-4 border-amber-400 p-3 text-sm text-amber-900 rounded-r-lg">
                  <strong>💡 Astuce Cumul :</strong> {merchant.tip}
                </div>
              )}

              {/* Liste des offres par plateforme */}
              <div className="mt-4 space-y-3">
                <h3 className="text-xs font-bold uppercase text-slate-400">Toutes les offres disponibles :</h3>
                {merchant.offers.map((offer, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100 text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-slate-700">{offer.platform}</span>
                      {getTypeBadge(offer.type)}
                      <span className="text-slate-500 text-xs hidden md:inline">{offer.label}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-extrabold text-slate-900">
                        {offer.rate}{offer.unit}
                      </span>
                      <a
                        href={getPlatformUrl(offer.platform)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 py-1.5 rounded-lg text-xs transition"
                      >
                        Activer
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}