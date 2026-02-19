import { useState } from 'react';
import {
  Globe, ExternalLink, Copy, Check, ChevronDown, ChevronRight,
  Github, Cloud, Zap, Shield, Server, Terminal, Upload,
  ArrowRight, Star, Clock, DollarSign, Rocket, Package,
  CheckCircle2, AlertTriangle, Info
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface HostOption {
  id: string;
  name: string;
  logo: React.ReactNode;
  tagline: string;
  difficulty: 'Lako' | 'Srednje' | 'Napredno';
  speed: string;
  free: string;
  recommended?: boolean;
  steps: Step[];
  pros: string[];
  cons: string[];
}

interface Step {
  title: string;
  description: string;
  code?: string;
  note?: string;
  link?: { text: string; url: string };
}

const hostOptions: HostOption[] = [
  {
    id: 'netlify',
    name: 'Netlify',
    logo: <Cloud size={28} className="text-teal-500" />,
    tagline: 'Najlakši način — samo prevuci fajlove',
    difficulty: 'Lako',
    speed: '< 2 min',
    free: '100 GB/mj, 300 build min/mj',
    recommended: true,
    pros: [
      'Drag & drop — bez komandne linije',
      'Besplatan SSL certifikat',
      'Automatski deploy iz GitHub-a',
      'Custom domena besplatno',
      'Instant rollback na prethodnu verziju',
    ],
    cons: [
      'Build minuti su ograničeni (300/mj)',
      'Serverless funkcije ograničene na 125k/mj',
    ],
    steps: [
      {
        title: '1. Napravite build projekta',
        description: 'U terminalu pokrenite build komandu da generišete produkcijske fajlove.',
        code: 'npm run build',
        note: 'Ovo generiše "dist/" folder sa svim fajlovima',
      },
      {
        title: '2. Otvorite Netlify',
        description: 'Idite na Netlify i kreirajte besplatan account.',
        link: { text: 'Otvori Netlify', url: 'https://app.netlify.com/drop' },
      },
      {
        title: '3. Prevucite "dist" folder',
        description: 'Na Netlify stranici vidjet ćete drag & drop zonu. Jednostavno prevucite cijeli "dist/" folder iz vašeg računara na tu zonu.',
        note: '🎉 To je to! Vaša stranica je online za ~30 sekundi!',
      },
      {
        title: '4. (Opciono) Custom domena',
        description: 'U Netlify podešavanjima možete dodati svoju domenu ili koristiti besplatnu .netlify.app subdomenu.',
      },
    ],
  },
  {
    id: 'github-pages',
    name: 'GitHub Pages',
    logo: <Github size={28} />,
    tagline: 'Besplatno hostovanje direktno iz GitHub repozitorija',
    difficulty: 'Srednje',
    speed: '~ 5 min',
    free: 'Potpuno besplatno, 1 GB skladište',
    pros: [
      'Potpuno besplatno, bez limita prometa',
      'Automatski deploy pri push-u',
      'Integracija sa GitHub repozitorijima',
      'Besplatan SSL certifikat',
    ],
    cons: [
      'Samo statični sajtovi',
      'Repo mora biti publican za besplatne Pages',
      'Potreban GitHub account',
    ],
    steps: [
      {
        title: '1. Kreirajte GitHub repozitorij',
        description: 'Napravite novi repozitorij na GitHub-u.',
        link: { text: 'Novi repo', url: 'https://github.com/new' },
      },
      {
        title: '2. Postavite projekat na GitHub',
        description: 'Inicijalizirajte git, dodajte fajlove i push-ujte na GitHub.',
        code: `git init
git add .
git commit -m "GMHome Dashboard"
git branch -M main
git remote add origin https://github.com/VAŠE_IME/gmhome.git
git push -u origin main`,
      },
      {
        title: '3. Instalirajte gh-pages paket',
        description: 'Ovaj paket automatizira deploy na GitHub Pages.',
        code: 'npm install --save-dev gh-pages',
      },
      {
        title: '4. Dodajte deploy skriptu u package.json',
        description: 'U "scripts" sekciju dodajte:',
        code: `"predeploy": "npm run build",
"deploy": "gh-pages -d dist"`,
      },
      {
        title: '5. Pokrenite deploy',
        description: 'Jedna komanda i stranica je online!',
        code: 'npm run deploy',
        note: 'Stranica: https://VAŠE_IME.github.io/gmhome/',
      },
    ],
  },
  {
    id: 'vercel',
    name: 'Vercel',
    logo: <Zap size={28} className="text-black" />,
    tagline: 'Automatski deploy — napravili su Next.js',
    difficulty: 'Lako',
    speed: '~ 3 min',
    free: '100 GB bandwidth/mj, unlimited deploys',
    pros: [
      'Automatski deploy iz GitHub-a',
      'Najbrži CDN na svijetu',
      'Preview za svaki branch',
      'Zero-config za Vite projekte',
      'Serverless funkcije besplatno',
    ],
    cons: [
      'Komercijalna upotreba zahtijeva Pro plan',
      'Ograničeno na 1 korisnika na Hobby planu',
    ],
    steps: [
      {
        title: '1. Push-ujte projekat na GitHub',
        description: 'Ako već nemate, kreirajte GitHub repo i push-ujte kod.',
        code: `git init && git add . && git commit -m "init"
git remote add origin https://github.com/VAŠE_IME/gmhome.git
git push -u origin main`,
      },
      {
        title: '2. Otvorite Vercel',
        description: 'Prijavite se sa GitHub accountom.',
        link: { text: 'Otvori Vercel', url: 'https://vercel.com/new' },
      },
      {
        title: '3. Importujte repozitorij',
        description: 'Kliknite "Import" pored vašeg gmhome repozitorija. Vercel automatski detektuje Vite konfiguraciju.',
      },
      {
        title: '4. Kliknite "Deploy"',
        description: 'Vercel automatski builduje i deploy-uje. Svaki put kad push-ujete na GitHub, stranica se automatski ažurira!',
        note: '🚀 Automatski deploy pri svakom git push!',
      },
    ],
  },
  {
    id: 'cloudflare',
    name: 'Cloudflare Pages',
    logo: <Shield size={28} className="text-orange-500" />,
    tagline: 'Najbrži CDN + besplatan unlimited bandwidth',
    difficulty: 'Srednje',
    speed: '~ 5 min',
    free: 'Unlimited bandwidth, 500 deploys/mj',
    pros: [
      'Unlimited bandwidth — besplatno!',
      'Globalni CDN (300+ lokacija)',
      'Besplatan SSL + DDoS zaštita',
      'Web Analytics besplatno',
      '500 deploys mjesečno',
    ],
    cons: [
      'Interfejs malo kompleksniji',
      'Build može biti sporiji od konkurencije',
    ],
    steps: [
      {
        title: '1. Kreirajte Cloudflare account',
        description: 'Besplatan account na Cloudflare.',
        link: { text: 'Cloudflare Dashboard', url: 'https://dash.cloudflare.com' },
      },
      {
        title: '2. Idite na Pages',
        description: 'U sidebaru kliknite "Workers & Pages" → "Create" → "Pages".',
      },
      {
        title: '3. Povežite GitHub repo',
        description: 'Kliknite "Connect to Git" i odaberite vaš gmhome repozitorij.',
      },
      {
        title: '4. Konfigurišite build',
        description: 'Postavite build komandu i output direktorij.',
        code: `Build command: npm run build
Build output: dist`,
      },
      {
        title: '5. Deploy!',
        description: 'Kliknite "Save and Deploy". Cloudflare builduje i postavlja stranicu na njihov CDN.',
        note: 'URL: gmhome.pages.dev (besplatna subdomena)',
      },
    ],
  },
  {
    id: 'surge',
    name: 'Surge.sh',
    logo: <Terminal size={28} className="text-red-500" />,
    tagline: 'Jedna komanda u terminalu — najbrži deploy',
    difficulty: 'Lako',
    speed: '< 1 min',
    free: 'Besplatno za osnovne potrebe',
    pros: [
      'Doslovno jedna komanda',
      'Ne treba GitHub account',
      'Instant deploy',
      'Custom domena podrška',
    ],
    cons: [
      'Nema automatski deploy iz Git-a',
      'Ograničene opcije na besplatnom planu',
      'Nema preview deploys',
    ],
    steps: [
      {
        title: '1. Instalirajte Surge',
        description: 'Globalna instalacija Surge CLI alata.',
        code: 'npm install -g surge',
      },
      {
        title: '2. Build-ujte projekat',
        description: 'Generirajte produkcijske fajlove.',
        code: 'npm run build',
      },
      {
        title: '3. Deploy jednom komandom!',
        description: 'Pokrenite surge i usmjerite ga na dist folder.',
        code: 'surge dist gmhome.surge.sh',
        note: '⚡ Stranica je online za ~10 sekundi!',
      },
    ],
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
      title="Kopiraj"
    >
      {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
    </button>
  );
}

function DifficultyBadge({ level }: { level: string }) {
  const config = {
    'Lako': 'bg-green-100 text-green-700 border-green-200',
    'Srednje': 'bg-amber-100 text-amber-700 border-amber-200',
    'Napredno': 'bg-red-100 text-red-700 border-red-200',
  };
  return (
    <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border', config[level as keyof typeof config] || config['Srednje'])}>
      {level}
    </span>
  );
}

function HostOptionCard({ option, isExpanded, onToggle }: { option: HostOption; isExpanded: boolean; onToggle: () => void }) {
  return (
    <div className={cn(
      'rounded-2xl border transition-all overflow-hidden',
      option.recommended ? 'border-indigo-200 shadow-md shadow-indigo-100' : 'border-gray-100 shadow-sm',
      isExpanded ? 'bg-white' : 'bg-white hover:shadow-md'
    )}>
      {/* Recommended badge */}
      {option.recommended && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold text-center py-1.5 flex items-center justify-center gap-1">
          <Star size={12} fill="currentColor" /> PREPORUČENO — Najlakši način
        </div>
      )}

      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-50 border border-gray-100">
            {option.logo}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-gray-900">{option.name}</h3>
              <DifficultyBadge level={option.difficulty} />
            </div>
            <p className="text-sm text-gray-500 mt-0.5">{option.tagline}</p>
            <div className="flex items-center gap-4 mt-1.5 flex-wrap">
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Clock size={12} /> {option.speed}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <DollarSign size={12} /> {option.free}
              </span>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 ml-4">
          {isExpanded ? <ChevronDown size={20} className="text-gray-400" /> : <ChevronRight size={20} className="text-gray-400" />}
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-5 pb-5 space-y-5">
          {/* Pros & Cons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl bg-green-50 border border-green-100 p-3">
              <h4 className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-2">✅ Prednosti</h4>
              <ul className="space-y-1.5">
                {option.pros.map((p, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-green-700">
                    <CheckCircle2 size={12} className="mt-0.5 flex-shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl bg-amber-50 border border-amber-100 p-3">
              <h4 className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-2">⚠️ Ograničenja</h4>
              <ul className="space-y-1.5">
                {option.cons.map((c, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-amber-700">
                    <AlertTriangle size={12} className="mt-0.5 flex-shrink-0" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Rocket size={16} className="text-indigo-500" />
              Koraci za deploy
            </h4>
            {option.steps.map((step, i) => (
              <div key={i} className="relative pl-8">
                {/* Step number */}
                <div className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold">
                  {i + 1}
                </div>
                {/* Connector line */}
                {i < option.steps.length - 1 && (
                  <div className="absolute left-[11px] top-7 w-0.5 h-[calc(100%+4px)] bg-indigo-100" />
                )}

                <div className="space-y-2">
                  <h5 className="text-sm font-semibold text-gray-800">{step.title}</h5>
                  <p className="text-sm text-gray-600">{step.description}</p>

                  {step.code && (
                    <div className="relative">
                      <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 text-xs font-mono overflow-x-auto leading-relaxed">
                        {step.code}
                      </pre>
                      <CopyButton text={step.code} />
                    </div>
                  )}

                  {step.link && (
                    <a
                      href={step.link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      {step.link.text} <ExternalLink size={14} />
                    </a>
                  )}

                  {step.note && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-indigo-50 border border-indigo-100">
                      <Info size={14} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-indigo-700">{step.note}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function HostingPage() {
  const [expanded, setExpanded] = useState<string>('netlify');

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-60 h-60 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <Globe size={26} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Besplatno hostovanje</h1>
              <p className="text-indigo-100 text-sm">Objavite GMHome dashboard na webu za 0 KM</p>
            </div>
          </div>
          <p className="text-indigo-100 text-sm leading-relaxed max-w-2xl mt-3">
            Vaš GMHome dashboard je statična web aplikacija — to znači da ga možete hostovati
            <strong className="text-white"> potpuno besplatno</strong> na više platformi.
            Odaberite jednu od opcija ispod i pratite korake.
          </p>
        </div>
      </div>

      {/* Quick comparison table */}
      <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm overflow-x-auto">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Package size={20} className="text-indigo-500" />
          Brza usporedba
        </h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-2 px-2 text-gray-500 font-medium">Platforma</th>
              <th className="text-left py-2 px-2 text-gray-500 font-medium">Težina</th>
              <th className="text-left py-2 px-2 text-gray-500 font-medium">Brzina</th>
              <th className="text-left py-2 px-2 text-gray-500 font-medium">Git potreban?</th>
              <th className="text-left py-2 px-2 text-gray-500 font-medium">Auto deploy?</th>
            </tr>
          </thead>
          <tbody>
            {hostOptions.map((opt) => (
              <tr
                key={opt.id}
                className={cn(
                  'border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors',
                  opt.recommended && 'bg-indigo-50/30'
                )}
                onClick={() => setExpanded(opt.id)}
              >
                <td className="py-2.5 px-2">
                  <div className="flex items-center gap-2">
                    <span className="flex-shrink-0 w-5">{opt.logo}</span>
                    <span className="font-medium text-gray-800">{opt.name}</span>
                    {opt.recommended && (
                      <Star size={12} className="text-amber-500" fill="currentColor" />
                    )}
                  </div>
                </td>
                <td className="py-2.5 px-2"><DifficultyBadge level={opt.difficulty} /></td>
                <td className="py-2.5 px-2 text-gray-600">{opt.speed}</td>
                <td className="py-2.5 px-2">
                  {opt.id === 'netlify' || opt.id === 'surge'
                    ? <span className="text-green-600 font-medium">Ne</span>
                    : <span className="text-gray-500">Da</span>
                  }
                </td>
                <td className="py-2.5 px-2">
                  {opt.id === 'surge'
                    ? <span className="text-gray-400">Ne</span>
                    : <span className="text-green-600 font-medium">Da</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detailed options */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <ArrowRight size={20} className="text-indigo-500" />
          Detaljna uputstva
        </h3>
        {hostOptions.map((option) => (
          <HostOptionCard
            key={option.id}
            option={option}
            isExpanded={expanded === option.id}
            onToggle={() => setExpanded(expanded === option.id ? '' : option.id)}
          />
        ))}
      </div>

      {/* Important notes */}
      <div className="rounded-2xl bg-amber-50 border border-amber-200 p-5 space-y-3">
        <h3 className="font-bold text-amber-800 flex items-center gap-2">
          <AlertTriangle size={18} />
          Važne napomene
        </h3>
        <ul className="space-y-2">
          <li className="flex items-start gap-2 text-sm text-amber-700">
            <span className="font-bold mt-0.5">•</span>
            <span><strong>Home Assistant konekcija:</strong> Vaš HA server mora biti dostupan sa interneta (DuckDNS, Nabu Casa, ili port forwarding) da bi dashboard mogao komunicirati s njim.</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-amber-700">
            <span className="font-bold mt-0.5">•</span>
            <span><strong>HTTPS preporuka:</strong> Koristite HTTPS za HA i za dashboard radi sigurnosti. Sve navedene platforme nude besplatan SSL.</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-amber-700">
            <span className="font-bold mt-0.5">•</span>
            <span><strong>CORS:</strong> Možda ćete trebati konfigurisati <code className="bg-amber-100 px-1 rounded">http.cors_allowed_origins</code> u Home Assistant <code className="bg-amber-100 px-1 rounded">configuration.yaml</code> da dozvolite pristup sa vaše domene.</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-amber-700">
            <span className="font-bold mt-0.5">•</span>
            <span><strong>Token sigurnost:</strong> Access token se čuva u browser localStorage-u. Ne dijelite URL sa token podacima.</span>
          </li>
        </ul>
      </div>

      {/* CORS config helper */}
      <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm space-y-3">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Server size={18} className="text-indigo-500" />
          Home Assistant CORS konfiguracija
        </h3>
        <p className="text-sm text-gray-600">
          Ako dobijete CORS grešku, dodajte ovo u vaš <code className="bg-gray-100 px-1.5 py-0.5 rounded text-indigo-600 font-mono text-xs">configuration.yaml</code>:
        </p>
        <div className="relative">
          <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 text-xs font-mono overflow-x-auto leading-relaxed">{`http:
  cors_allowed_origins:
    - "https://vaš-sajt.netlify.app"
    - "https://vaš-sajt.vercel.app"
    - "https://vaš-sajt.pages.dev"
    - "http://localhost:5173"`}</pre>
          <CopyButton text={`http:\n  cors_allowed_origins:\n    - "https://vaš-sajt.netlify.app"\n    - "https://vaš-sajt.vercel.app"\n    - "https://vaš-sajt.pages.dev"\n    - "http://localhost:5173"`} />
        </div>
        <p className="text-xs text-gray-400">
          Nakon izmjene, restartujte Home Assistant: <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">Settings → System → Restart</code>
        </p>
      </div>

      {/* Nabu Casa */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-5 space-y-3">
        <h3 className="font-bold text-blue-800 flex items-center gap-2">
          <Cloud size={18} />
          💡 Najlakši pristup — Nabu Casa
        </h3>
        <p className="text-sm text-blue-700">
          Ako ne želite konfigurirati port forwarding i DuckDNS, razmislite o <strong>Nabu Casa</strong> ($6.5/mj):
        </p>
        <ul className="space-y-1 text-sm text-blue-700">
          <li className="flex items-center gap-2"><CheckCircle2 size={14} /> Siguran pristup izvana bez port forwarding-a</li>
          <li className="flex items-center gap-2"><CheckCircle2 size={14} /> Automatski SSL certifikat</li>
          <li className="flex items-center gap-2"><CheckCircle2 size={14} /> Google Assistant & Alexa integracija</li>
          <li className="flex items-center gap-2"><CheckCircle2 size={14} /> Podržava razvoj Home Assistant-a</li>
        </ul>
        <a
          href="https://www.nabucasa.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-semibold"
        >
          Saznaj više o Nabu Casa <ExternalLink size={14} />
        </a>
      </div>

      {/* Quick start for absolute beginners */}
      <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 p-5 space-y-4">
        <h3 className="font-bold text-green-800 flex items-center gap-2">
          <Upload size={18} />
          🚀 Za početnike — Najbrži put (Netlify)
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-200 text-green-800 text-xs font-bold flex-shrink-0">1</div>
            <div>
              <p className="text-sm font-medium text-green-800">Otvorite terminal i pokrenite:</p>
              <div className="relative mt-1">
                <pre className="bg-gray-900 text-gray-100 rounded-lg p-3 text-xs font-mono">npm run build</pre>
                <CopyButton text="npm run build" />
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-200 text-green-800 text-xs font-bold flex-shrink-0">2</div>
            <div>
              <p className="text-sm font-medium text-green-800">
                Otvorite{' '}
                <a href="https://app.netlify.com/drop" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline font-semibold">
                  app.netlify.com/drop
                </a>
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-200 text-green-800 text-xs font-bold flex-shrink-0">3</div>
            <div>
              <p className="text-sm font-medium text-green-800">Prevucite <code className="bg-green-200 px-1.5 rounded">dist/</code> folder na stranicu</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-200 text-green-800 text-xs font-bold flex-shrink-0">✓</div>
            <p className="text-sm font-bold text-green-800">Gotovo! Vaša stranica je online! 🎉</p>
          </div>
        </div>
      </div>
    </div>
  );
}
