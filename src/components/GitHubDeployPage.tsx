import { useState } from 'react';
import {
  Github, Copy, Check, ExternalLink, Terminal, ChevronDown, ChevronRight,
  FolderGit2, Settings, Rocket, Globe, CheckCircle2,
  AlertTriangle, Info, Shield, RefreshCw,
  Package, FileCode, Zap, Upload, FolderTree, AlertCircle
} from 'lucide-react';
import { cn } from '@/utils/cn';

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
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

function CopyInline({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };
  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-mono text-xs px-2 py-0.5 rounded transition-colors"
    >
      <code>{text}</code>
      {copied ? <Check size={10} className="text-green-500" /> : <Copy size={10} />}
    </button>
  );
}

interface StepProps {
  number: number;
  title: string;
  isLast?: boolean;
  children: React.ReactNode;
}

function Step({ number, title, isLast, children }: StepProps) {
  return (
    <div className="relative pl-10">
      <div className="absolute left-0 top-0 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-bold shadow-md">
        {number}
      </div>
      {!isLast && (
        <div className="absolute left-[13px] top-8 w-0.5 h-[calc(100%-8px)] bg-gradient-to-b from-indigo-200 to-transparent" />
      )}
      <div className="pb-6">
        <h4 className="text-sm font-bold text-gray-900 mb-2">{title}</h4>
        <div className="space-y-3">{children}</div>
      </div>
    </div>
  );
}

type DeployMethod = 'manual' | 'actions' | 'gh-pages-pkg';

export function GitHubDeployPage() {
  const [repoName, setRepoName] = useState('gmhome-dashboard');
  const [username, setUsername] = useState('vaše-github-ime');
  const [method, setMethod] = useState<DeployMethod>('actions');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showFileStructure, setShowFileStructure] = useState(false);

  const repoUrl = `https://github.com/${username}/${repoName}`;
  const pagesUrl = `https://${username}.github.io/${repoName}/`;

  const workflowYaml = `name: Deploy GMHome to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4`;

  const gitignoreContent = `# Dependencies
node_modules/

# Build output
dist/

# Editor
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Environment
.env
.env.local`;

  const gitCommands = `# 1. Otvori terminal U FOLDERU PROJEKTA (gdje je package.json)
cd ${repoName}

# 2. Kreiraj .gitignore (VAŽNO - da ne pushujete node_modules!)
cat > .gitignore << 'EOF'
node_modules/
dist/
.DS_Store
.env
.env.local
EOF

# 3. Kreiraj workflow folder i fajl
mkdir -p .github/workflows

# 4. Inicijaliziraj git
git init

# 5. Dodaj SVE fajlove
git add .

# 6. Provjeri da je package.json uključen (OBAVEZNO!)
git status

# 7. Napravi commit
git commit -m "🏠 GMHome Dashboard - inicijalni commit"

# 8. Postavi main branch
git branch -M main

# 9. Dodaj remote origin
git remote add origin ${repoUrl}.git

# 10. Push na GitHub
git push -u origin main`;

  const ghPagesPkgCommands = `# 1. Instaliraj gh-pages paket
npm install --save-dev gh-pages

# 2. Build projekat
npm run build

# 3. Deploy na GitHub Pages
npx gh-pages -d dist`;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur border border-white/10">
              <Github size={30} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Deploy na GitHub Pages</h1>
              <p className="text-gray-400 text-sm mt-1">Besplatno hostovanje direktno iz GitHub repozitorija</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/15 text-green-400 text-xs font-medium border border-green-500/20">
              <CheckCircle2 size={14} /> 100% besplatno
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/15 text-blue-400 text-xs font-medium border border-blue-500/20">
              <RefreshCw size={14} /> Auto deploy pri push-u
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/15 text-purple-400 text-xs font-medium border border-purple-500/20">
              <Shield size={14} /> Besplatan SSL
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 text-amber-400 text-xs font-medium border border-amber-500/20">
              <Globe size={14} /> Custom domena
            </span>
          </div>
        </div>
      </div>

      {/* ⚠️ COMMON ERROR BOX */}
      <div className="rounded-2xl bg-red-50 border-2 border-red-200 p-5 space-y-3">
        <h3 className="font-bold text-red-800 flex items-center gap-2">
          <AlertCircle size={20} className="text-red-500" />
          ⚠️ Česta greška: "Could not read package.json" / "lock file not found"
        </h3>
        <p className="text-sm text-red-700">
          Ako dobijete ovu grešku u GitHub Actions, to znači da <strong>package.json nije pushovan</strong> u repozitorij.
        </p>
        <div className="bg-red-100 rounded-xl p-4 space-y-2">
          <p className="text-sm font-bold text-red-800">Rješenje — provjerite ovo:</p>
          <ul className="space-y-1.5 text-sm text-red-700">
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold mt-0.5">1.</span>
              <span>Terminal mora biti otvoren <strong>u folderu projekta</strong> (gdje je <code className="bg-red-200 px-1 rounded">package.json</code>)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold mt-0.5">2.</span>
              <span>Pokrenite <code className="bg-red-200 px-1 rounded">ls</code> (ili <code className="bg-red-200 px-1 rounded">dir</code> na Windows) — morate vidjeti <code className="bg-red-200 px-1 rounded">package.json</code> u listi</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold mt-0.5">3.</span>
              <span><code className="bg-red-200 px-1 rounded">.gitignore</code> <strong>NE SMIJE</strong> sadržavati <code className="bg-red-200 px-1 rounded">package.json</code></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold mt-0.5">4.</span>
              <span>Pokrenite <code className="bg-red-200 px-1 rounded">git status</code> — <code className="bg-red-200 px-1 rounded">package.json</code> mora biti na listi "Changes to be committed"</span>
            </li>
          </ul>
        </div>
        <div className="relative">
          <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 text-xs font-mono overflow-x-auto leading-relaxed">{`# Provjeri da si u pravom folderu:
ls package.json
# Treba da kaže: package.json

# Provjeri da git vidi package.json:
git status
# package.json MORA biti na listi

# Ako package.json nije dodan, dodaj ga ručno:
git add package.json
git add vite.config.ts
git add tsconfig.json
git add tsconfig.app.json
git add index.html
git add src/
git add .github/
git commit -m "fix: add missing files"
git push`}</pre>
          <CopyButton text={`ls package.json\ngit status\ngit add package.json vite.config.ts tsconfig.json tsconfig.app.json index.html src/ .github/\ngit commit -m "fix: add missing files"\ngit push`} />
        </div>
      </div>

      {/* Prerequisites */}
      <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Package size={18} className="text-indigo-500" />
          Šta vam treba
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
            <Github size={20} className="text-gray-700 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-gray-800">GitHub Account</p>
              <p className="text-xs text-gray-500 mt-0.5">Besplatan nalog na github.com</p>
              <a href="https://github.com/signup" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 mt-1 font-medium">
                Registruj se <ExternalLink size={10} />
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
            <Terminal size={20} className="text-gray-700 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-gray-800">Git instaliran</p>
              <p className="text-xs text-gray-500 mt-0.5">Za upload koda na GitHub</p>
              <a href="https://git-scm.com/downloads" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 mt-1 font-medium">
                Preuzmi Git <ExternalLink size={10} />
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
            <FileCode size={20} className="text-gray-700 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-gray-800">Node.js & npm</p>
              <p className="text-xs text-gray-500 mt-0.5">Za build projekta</p>
              <a href="https://nodejs.org" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 mt-1 font-medium">
                Preuzmi Node.js <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Required files info */}
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
        <button
          onClick={() => setShowFileStructure(!showFileStructure)}
          className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <FolderTree size={18} className="text-indigo-500" />
            <span className="font-semibold text-gray-900">📁 Koji fajlovi MORAJU biti u repozitoriju</span>
            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold">VAŽNO</span>
          </div>
          {showFileStructure ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}
        </button>
        {showFileStructure && (
          <div className="px-5 pb-5 space-y-4 border-t border-gray-100 pt-4">
            <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-100">
              <AlertTriangle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-700">
                <strong>Svi ovi fajlovi moraju biti u ROOT-u repozitorija</strong> (ne u podfolderu!). 
                Ako ih nema, GitHub Actions neće moći buildati projekat.
              </p>
            </div>
            <div className="relative">
              <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 text-xs font-mono overflow-x-auto leading-relaxed">{`📁 ${repoName}/              ← ROOT repozitorija
├── 📄 package.json          ✅ OBAVEZNO - definicija projekta i zavisnosti
├── 📄 vite.config.ts        ✅ OBAVEZNO - Vite konfiguracija
├── 📄 tsconfig.json         ✅ OBAVEZNO - TypeScript config
├── 📄 tsconfig.app.json     ✅ OBAVEZNO - TypeScript app config
├── 📄 index.html            ✅ OBAVEZNO - ulazna HTML stranica
├── 📄 .gitignore            ✅ OBAVEZNO - ignorira node_modules i dist
├── 📁 .github/
│   └── 📁 workflows/
│       └── 📄 deploy.yml    ✅ OBAVEZNO - GitHub Actions workflow
├── 📁 src/                  ✅ OBAVEZNO - sav source kod
│   ├── 📄 App.tsx
│   ├── 📄 main.tsx
│   ├── 📄 index.css
│   ├── 📁 components/
│   ├── 📁 context/
│   ├── 📁 services/
│   └── 📁 utils/
│
├── 📁 node_modules/         ❌ NE PUSHOVATI (u .gitignore)
└── 📁 dist/                 ❌ NE PUSHOVATI (u .gitignore)`}</pre>
            </div>
            <p className="text-xs text-gray-500">
              💡 <strong>Provjera:</strong> Na GitHub-u kad otvorite repo, morate vidjeti <code className="bg-gray-100 px-1 rounded">package.json</code> direktno u root-u, NE u nekom podfolderu.
            </p>
          </div>
        )}
      </div>

      {/* Repository name config */}
      <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 p-5 space-y-4">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Settings size={18} className="text-indigo-500" />
          Konfigurirajte vaše podatke
        </h3>
        <p className="text-sm text-gray-600">Unesite vaše GitHub podatke da prilagodimo sve komande za vas:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">GitHub korisničko ime</label>
            <div className="relative">
              <Github size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="vaše-github-ime"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-indigo-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Naziv repozitorija</label>
            <div className="relative">
              <FolderGit2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={repoName}
                onChange={e => setRepoName(e.target.value)}
                placeholder="gmhome-dashboard"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-indigo-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-indigo-100 text-xs">
            <Globe size={12} className="text-indigo-500" />
            <span className="text-gray-500">URL:</span>
            <code className="text-indigo-600 font-semibold">{pagesUrl}</code>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-indigo-100 text-xs">
            <Github size={12} className="text-gray-500" />
            <span className="text-gray-500">Repo:</span>
            <code className="text-gray-700">{repoUrl}</code>
          </div>
        </div>
      </div>

      {/* Method selector */}
      <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Zap size={18} className="text-amber-500" />
          Odaberite metodu deploy-a
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {([
            {
              id: 'actions' as DeployMethod,
              icon: <RefreshCw size={20} className="text-indigo-600" />,
              title: 'GitHub Actions',
              subtitle: 'Automatski deploy',
              badge: '⭐ Preporučeno',
              desc: 'Automatski se deployuje kad push-ujete kod'
            },
            {
              id: 'gh-pages-pkg' as DeployMethod,
              icon: <Package size={20} className="text-purple-600" />,
              title: 'gh-pages paket',
              subtitle: 'Jedna komanda',
              badge: 'Brzo',
              desc: 'npm paket za jednostavan deploy'
            },
            {
              id: 'manual' as DeployMethod,
              icon: <Upload size={20} className="text-emerald-600" />,
              title: 'Ručni deploy',
              subtitle: 'Bez automatizacije',
              badge: 'Jednostavno',
              desc: 'Upload buildanih fajlova ručno'
            },
          ]).map(m => (
            <button
              key={m.id}
              onClick={() => setMethod(m.id)}
              className={cn(
                'flex flex-col items-start p-4 rounded-xl border-2 transition-all text-left',
                method === m.id
                  ? 'border-indigo-500 bg-indigo-50/50 shadow-md'
                  : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
              )}
            >
              <div className="flex items-center justify-between w-full mb-2">
                {m.icon}
                <span className={cn(
                  'text-[10px] font-semibold px-2 py-0.5 rounded-full',
                  method === m.id ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'
                )}>
                  {m.badge}
                </span>
              </div>
              <h4 className="text-sm font-bold text-gray-900">{m.title}</h4>
              <p className="text-xs text-gray-500 mt-0.5">{m.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ========== METHOD: GITHUB ACTIONS ========== */}
      {method === 'actions' && (
        <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <RefreshCw size={22} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">GitHub Actions (Automatski)</h3>
              <p className="text-sm text-gray-500">Svaki put kad push-ujete na main, stranica se automatski ažurira</p>
            </div>
          </div>

          <Step number={1} title="Kreirajte novi repozitorij na GitHub-u">
            <p className="text-sm text-gray-600">
              Idite na GitHub i napravite novi <strong>PRAZAN</strong> repozitorij:
            </p>
            <a
              href="https://github.com/new"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              <Github size={16} /> Kreiraj novi repozitorij <ExternalLink size={14} />
            </a>
            <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 border border-blue-100">
              <Info size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-700">
                <p>Naziv: <strong>{repoName}</strong></p>
                <p className="mt-0.5">Tip: <strong>Public</strong> (za besplatne GitHub Pages)</p>
                <p className="mt-0.5">⚠️ <strong>NE čekirajte</strong> "Add README", "Add .gitignore", ili "Add license" — trebamo prazan repo!</p>
              </div>
            </div>
          </Step>

          <Step number={2} title="Kreirajte .gitignore fajl u projektu">
            <p className="text-sm text-gray-600">
              U root folderu projekta (gdje je package.json), napravite fajl <CopyInline text=".gitignore" />:
            </p>
            <div className="relative">
              <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 text-xs font-mono overflow-x-auto leading-relaxed">
                {gitignoreContent}
              </pre>
              <CopyButton text={gitignoreContent} />
            </div>
            <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-100">
              <AlertTriangle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-700">
                <strong>VAŽNO:</strong> <code className="bg-amber-100 px-1 rounded">node_modules/</code> i <code className="bg-amber-100 px-1 rounded">dist/</code> moraju biti u .gitignore. 
                Ali <code className="bg-amber-100 px-1 rounded">package.json</code> <strong>NE SMIJE</strong> biti u .gitignore!
              </p>
            </div>
          </Step>

          <Step number={3} title="Kreirajte GitHub Actions workflow fajl">
            <p className="text-sm text-gray-600">
              Napravite folder <CopyInline text=".github/workflows/" /> i u njemu fajl <CopyInline text="deploy.yml" />:
            </p>
            <div className="relative">
              <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 text-xs font-mono overflow-x-auto leading-relaxed">
                {`mkdir -p .github/workflows`}
              </pre>
              <CopyButton text="mkdir -p .github/workflows" />
            </div>
            <p className="text-sm text-gray-600">
              Zatim kreirajte fajl <code className="bg-gray-100 px-1.5 py-0.5 rounded text-indigo-600 font-mono text-xs">.github/workflows/deploy.yml</code> sa ovim sadržajem:
            </p>
            <div className="relative">
              <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 text-xs font-mono overflow-x-auto leading-relaxed max-h-[500px] overflow-y-auto">
                {workflowYaml}
              </pre>
              <CopyButton text={workflowYaml} />
            </div>
          </Step>

          <Step number={4} title="⚡ Push-ujte projekat na GitHub">
            <p className="text-sm text-gray-600">
              Otvorite terminal <strong>u folderu projekta</strong> (gdje je package.json!) i pokrenite:
            </p>
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 mb-2">
              <AlertCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-red-700">
                <strong>KRITIČNO:</strong> Prije nego pokrenete git komande, provjerite da ste u <strong>pravom folderu</strong>!
                Pokrenite <code className="bg-red-100 px-1 rounded">ls package.json</code> — ako kaže "No such file", niste u pravom folderu!
              </p>
            </div>
            <div className="relative">
              <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 text-xs font-mono overflow-x-auto leading-relaxed">
                {gitCommands}
              </pre>
              <CopyButton text={gitCommands} />
            </div>
            <div className="flex items-start gap-2 p-3 rounded-lg bg-green-50 border border-green-100">
              <CheckCircle2 size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-green-700">
                <p><strong>Kako provjeriti da je sve OK:</strong></p>
                <p className="mt-1">1. Otvorite <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="text-green-800 underline font-bold">{repoUrl}</a></p>
                <p>2. Trebate vidjeti <code className="bg-green-100 px-1 rounded">package.json</code> u listi fajlova</p>
                <p>3. Kliknite na njega — trebate vidjeti dependencies i scripts</p>
              </div>
            </div>
          </Step>

          <Step number={5} title="Uključite GitHub Pages">
            <p className="text-sm text-gray-600">
              Idite na podešavanja repozitorija i omogućite Pages:
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex-shrink-0">a</div>
                <p className="text-sm text-gray-700">
                  Otvorite <a href={`${repoUrl}/settings/pages`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-medium">
                    Settings → Pages <ExternalLink size={12} className="inline" />
                  </a>
                </p>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex-shrink-0">b</div>
                <p className="text-sm text-gray-700">
                  Pod <strong>"Source"</strong> odaberite <strong>"GitHub Actions"</strong>
                </p>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex-shrink-0">c</div>
                <p className="text-sm text-gray-700">
                  Sačekajte da se workflow izvrši (1-2 minute) — vidjet ćete zelenu kvačicu ✅
                </p>
              </div>
            </div>
          </Step>

          <Step number={6} title="🎉 Vaša stranica je online!" isLast>
            <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
              <p className="text-sm font-medium text-green-800 flex items-center gap-2">
                <CheckCircle2 size={16} /> Dashboard je dostupan na:
              </p>
              <a
                href={pagesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors"
              >
                <Globe size={16} /> {pagesUrl} <ExternalLink size={14} />
              </a>
              <p className="text-xs text-green-600 mt-2">
                Od sada, svaki put kad push-ujete izmjene na <code className="bg-green-100 px-1 rounded">main</code> branch, stranica se automatski ažurira! 🚀
              </p>
            </div>
          </Step>
        </div>
      )}

      {/* ========== METHOD: GH-PAGES PACKAGE ========== */}
      {method === 'gh-pages-pkg' && (
        <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <Package size={22} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">gh-pages paket (Brzo)</h3>
              <p className="text-sm text-gray-500">Deploy jednom komandom iz terminala</p>
            </div>
          </div>

          <Step number={1} title="Kreirajte repozitorij i push-ujte kod">
            <p className="text-sm text-gray-600">Isti koraci kao gore — napravite repo i push-ujte:</p>
            <a href="https://github.com/new" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors">
              <Github size={16} /> Kreiraj repo <ExternalLink size={14} />
            </a>
            <div className="relative">
              <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 text-xs font-mono overflow-x-auto leading-relaxed">
                {gitCommands}
              </pre>
              <CopyButton text={gitCommands} />
            </div>
          </Step>

          <Step number={2} title="Instalirajte, build-ujte i deploy-ujte">
            <p className="text-sm text-gray-600">Tri komande i gotovo!</p>
            <div className="relative">
              <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 text-xs font-mono overflow-x-auto leading-relaxed">
                {ghPagesPkgCommands}
              </pre>
              <CopyButton text={ghPagesPkgCommands} />
            </div>
          </Step>

          <Step number={3} title="Uključite Pages u Settings" isLast>
            <p className="text-sm text-gray-600">
              U <a href={`${repoUrl}/settings/pages`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-medium">
                Settings → Pages
              </a>, pod "Source" odaberite <strong>"Deploy from a branch"</strong>, branch: <strong>gh-pages</strong>, folder: <strong>/ (root)</strong>.
            </p>
            <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
              <p className="text-sm font-medium text-green-800 flex items-center gap-2">
                <CheckCircle2 size={16} /> Dashboard je dostupan na:
              </p>
              <code className="text-sm font-bold text-green-700 mt-1 block">{pagesUrl}</code>
              <p className="text-xs text-green-600 mt-2">
                Za svaku novu verziju pokrenite: <code className="bg-green-100 px-1 rounded">npm run build && npx gh-pages -d dist</code>
              </p>
            </div>
          </Step>
        </div>
      )}

      {/* ========== METHOD: MANUAL ========== */}
      {method === 'manual' && (
        <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <Upload size={22} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Ručni Deploy</h3>
              <p className="text-sm text-gray-500">Upload buildanih fajlova direktno na GitHub</p>
            </div>
          </div>

          <Step number={1} title="Build-ujte projekat">
            <div className="relative">
              <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 text-xs font-mono">npm run build</pre>
              <CopyButton text="npm run build" />
            </div>
          </Step>

          <Step number={2} title="Kreirajte repozitorij">
            <a href="https://github.com/new" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors">
              <Github size={16} /> Kreiraj repo <ExternalLink size={14} />
            </a>
            <p className="text-sm text-gray-600">Ime: <strong>{repoName}</strong>, Public, čekirajte "Add README"</p>
          </Step>

          <Step number={3} title="Upload fajlova">
            <div className="space-y-2 text-sm text-gray-600">
              <p>1. Otvorite repozitorij na GitHub-u</p>
              <p>2. Kliknite <strong>"Add file" → "Upload files"</strong></p>
              <p>3. Prevucite <strong>sve fajlove iz dist/ foldera</strong> (ne sam folder, nego fajlove unutar njega!)</p>
              <p>4. Kliknite <strong>"Commit changes"</strong></p>
            </div>
          </Step>

          <Step number={4} title="Uključite Pages" isLast>
            <p className="text-sm text-gray-600">
              Settings → Pages → Source: <strong>"Deploy from a branch"</strong> → Branch: <strong>main</strong> → Folder: <strong>/ (root)</strong> → Save
            </p>
            <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
              <p className="text-sm font-medium text-green-800 flex items-center gap-2">
                <CheckCircle2 size={16} /> Stranica je online!
              </p>
              <code className="text-sm font-bold text-green-700 mt-1 block">{pagesUrl}</code>
            </div>
          </Step>
        </div>
      )}

      {/* Advanced: Vite base path config */}
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Settings size={18} className="text-gray-400" />
            <span className="font-semibold text-gray-900">⚙️ Vite konfiguracija za GitHub Pages</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">MOŽDA TREBATE</span>
          </div>
          {showAdvanced ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}
        </button>
        {showAdvanced && (
          <div className="px-5 pb-5 space-y-4 border-t border-gray-100 pt-4">
            <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-100">
              <AlertTriangle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-700">
                <strong>Važno!</strong> Ako se stranica učitava ali je bijela/prazna, trebate podesiti <code className="bg-amber-100 px-1 rounded">base</code> u Vite konfiguraciji.
              </p>
            </div>

            <p className="text-sm text-gray-600">
              Dodajte <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-xs text-indigo-600">base</code> u <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-xs">vite.config.ts</code>:
            </p>

            <div className="relative">
              <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 text-xs font-mono overflow-x-auto leading-relaxed">{`// vite.config.ts
export default defineConfig({
  base: '/${repoName}/',  // ← Dodajte ovo
  plugins: [react(), tailwindcss()],
  // ... ostalo
})`}</pre>
              <CopyButton text={`base: '/${repoName}/',`} />
            </div>

            <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 border border-blue-100">
              <Info size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-700">
                <strong>Napomena:</strong> Ako koristite custom domenu (npr. gmhome.com), postavite <code className="bg-blue-100 px-1 rounded">base: '/'</code> umjesto toga.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* CORS config reminder */}
      <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm space-y-3">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Shield size={18} className="text-indigo-500" />
          Home Assistant CORS konfiguracija
        </h3>
        <p className="text-sm text-gray-600">
          Da bi dashboard mogao komunicirati sa Home Assistant, dodajte vašu GitHub Pages domenu u <code className="bg-gray-100 px-1.5 py-0.5 rounded text-indigo-600 font-mono text-xs">configuration.yaml</code>:
        </p>
        <div className="relative">
          <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 text-xs font-mono overflow-x-auto leading-relaxed">{`# configuration.yaml
http:
  cors_allowed_origins:
    - "${pagesUrl.slice(0, -1)}"
    - "http://localhost:5173"`}</pre>
          <CopyButton text={`http:\n  cors_allowed_origins:\n    - "${pagesUrl.slice(0, -1)}"\n    - "http://localhost:5173"`} />
        </div>
        <p className="text-xs text-gray-400">
          Nakon izmjene: Settings → System → Restart Home Assistant
        </p>
      </div>

      {/* Checklist */}
      <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 p-5 space-y-3">
        <h3 className="font-bold text-green-800 flex items-center gap-2">
          <CheckCircle2 size={18} />
          ✅ Checklist — jeste li sve uradili?
        </h3>
        <div className="space-y-2">
          {[
            'Kreiran GitHub repozitorij (PRAZAN, bez README)',
            'Terminal otvoren u pravom folderu (gdje je package.json)',
            '.gitignore kreiran (sadrži node_modules/ i dist/)',
            method === 'actions' ? '.github/workflows/deploy.yml kreiran' : 'Build i deploy izvršen',
            'Svi fajlovi commitani i pushani (git add . && git commit && git push)',
            'Na GitHub-u vidim package.json u root-u repozitorija',
            'GitHub Pages uključen (Settings → Pages → Source: GitHub Actions)',
            'Workflow prošao bez grešaka (zelena kvačica ✅ u Actions tab)',
            'Stranica se ispravno učitava na ' + pagesUrl,
            'CORS konfigurisan u Home Assistant (ako koristite HA)',
          ].map((item, i) => (
            <label key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-green-100/50 transition-colors cursor-pointer">
              <input type="checkbox" className="h-4 w-4 rounded border-green-300 text-green-600 focus:ring-green-500" />
              <span className="text-sm text-green-800">{item}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Quick summary */}
      <div className="rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 p-5 text-white space-y-3">
        <h3 className="font-bold flex items-center gap-2">
          <Rocket size={18} />
          TL;DR — Brzi rezime
        </h3>
        <div className="space-y-2 text-sm text-gray-300">
          <div className="flex items-start gap-2">
            <span className="text-indigo-400 font-bold">1.</span>
            <span>Napravite PRAZAN repo na <a href="https://github.com/new" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">github.com/new</a></span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-indigo-400 font-bold">2.</span>
            <span>Kreirajte <code className="bg-gray-700 px-1.5 py-0.5 rounded text-gray-200">.gitignore</code> i <code className="bg-gray-700 px-1.5 py-0.5 rounded text-gray-200">.github/workflows/deploy.yml</code></span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-indigo-400 font-bold">3.</span>
            <span><code className="bg-gray-700 px-1.5 py-0.5 rounded text-gray-200">git init && git add . && git commit -m "init" && git push</code></span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-indigo-400 font-bold">4.</span>
            <span>Settings → Pages → Source: <strong>GitHub Actions</strong></span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-indigo-400 font-bold">5.</span>
            <span>Provjerite na GitHub-u da <code className="bg-gray-700 px-1.5 py-0.5 rounded text-gray-200">package.json</code> postoji u root-u!</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-400 font-bold">✓</span>
            <span className="text-green-400 font-semibold">Online na {pagesUrl}</span>
          </div>
        </div>
      </div>

      {/* Troubleshooting */}
      <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <AlertTriangle size={18} className="text-amber-500" />
          Česti problemi i rješenja
        </h3>
        <div className="space-y-3">
          {[
            {
              q: '❌ "Could not read package.json: ENOENT" — VAŠ PROBLEM',
              a: 'package.json NIJE u repozitoriju! Provjerite: 1) Da ste u pravom folderu (ls package.json mora raditi), 2) Da .gitignore NE sadrži package.json, 3) Pokrenite: git add package.json && git commit -m "fix" && git push',
              highlight: true
            },
            {
              q: '❌ "Dependencies lock file is not found"',
              a: 'Workflow koristi cache: npm ili npm ci koji traže package-lock.json. Koristite naš ažurirani workflow koji koristi npm install BEZ cache opcije.',
              highlight: true
            },
            {
              q: 'Stranica prikazuje 404',
              a: 'Provjerite da je GitHub Pages uključen i da je source postavljen na "GitHub Actions". Sačekajte 1-2 minute nakon deploy-a.'
            },
            {
              q: 'Bijela stranica / CSS se ne učitava',
              a: `Dodajte base: '/${repoName}/' u vite.config.ts (pogledajte sekciju "Vite konfiguracija" iznad).`
            },
            {
              q: 'Home Assistant se ne povezuje (CORS greška)',
              a: 'Dodajte vašu GitHub Pages URL u http.cors_allowed_origins u configuration.yaml i restartujte HA.'
            },
            {
              q: 'GitHub Actions workflow ne radi',
              a: 'Provjerite da je fajl na tačnoj putanji: .github/workflows/deploy.yml. YAML mora biti pravilno indentiran (koristite spaces, ne tabs!).'
            },
          ].map((item, i) => (
            <div key={i} className={cn(
              "p-3 rounded-xl border",
              item.highlight ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-100"
            )}>
              <p className={cn("text-sm font-semibold flex items-center gap-2", item.highlight ? "text-red-800" : "text-gray-800")}>
                <span className="text-red-500">Q:</span> {item.q}
              </p>
              <p className={cn("text-sm mt-1 flex items-start gap-2", item.highlight ? "text-red-700" : "text-gray-600")}>
                <span className="text-green-600 font-bold flex-shrink-0">A:</span> {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
