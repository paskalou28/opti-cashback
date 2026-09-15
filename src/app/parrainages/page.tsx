import platformsData from '../../data/platforms.json';

interface PlatformInfo {
  name?: string;
  refUrl?: string;
  directUrl?: string;
  url?: string;
  code?: string;
  bonus?: string;
}

export default function ParrainagesPage() {
  const platforms = Object.entries(
    platformsData as Record<string, PlatformInfo>
  );

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans text-slate-800">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-extrabold text-slate-900 md:text-4xl">
            Toutes les Primes & Parrainages
          </h1>
          <p className="text-slate-600">
            Inscris-toi sur les meilleures applications pour débloquer tes bonus de bienvenue.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {platforms.map(([name, data]) => {
            const targetUrl = data.refUrl || data.url || '#';

            return (
              <div
                key={name}
                className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">{name}</h2>
                    {data.bonus && (
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full">
                        {data.bonus}
                      </span>
                    )}
                  </div>

                  {data.code && (
                    <p className="text-sm text-slate-600">
                      Code parrainage :{' '}
                      <span className="font-mono bg-slate-100 px-2 py-1 rounded text-slate-900 font-semibold">
                        {data.code}
                      </span>
                    </p>
                  )}
                </div>

                <a
                  href={targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition mt-4"
                >
                  Inscription & Bonus {name}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}