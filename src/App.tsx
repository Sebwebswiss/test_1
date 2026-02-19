import { useState } from 'react';
import {
  Zap, Home, BarChart3, Settings, Bell, Menu, X,
  Gauge, Wifi, WifiOff, Globe, Github
} from 'lucide-react';
import { HAProvider, useHA } from '@/context/HAContext';
import { LivePower } from '@/components/LivePower';
import { HAStatCards } from '@/components/HAStatCards';
import { EnergyChart } from '@/components/EnergyChart';
import { DeviceList } from '@/components/DeviceList';
import { HADeviceList } from '@/components/HADeviceList';
import { HAPowerSensors } from '@/components/HAPowerSensors';
import { ConsumptionPie } from '@/components/ConsumptionPie';
import { RoomBreakdown } from '@/components/RoomBreakdown';
import { AlertsFeed } from '@/components/AlertsFeed';
import { TariffInfo } from '@/components/TariffInfo';
import { SettingsPage } from '@/components/SettingsPage';
import { HostingPage } from '@/components/HostingPage';
import { GitHubDeployPage } from '@/components/GitHubDeployPage';
import { cn } from '@/utils/cn';

type NavPage = 'dashboard' | 'stats' | 'devices' | 'alerts' | 'hosting' | 'github' | 'settings';

const navItems: { icon: React.ReactNode; label: string; page: NavPage }[] = [
  { icon: <Home size={20} />, label: 'Početna', page: 'dashboard' },
  { icon: <BarChart3 size={20} />, label: 'Statistika', page: 'stats' },
  { icon: <Gauge size={20} />, label: 'Uređaji', page: 'devices' },
  { icon: <Bell size={20} />, label: 'Obavještenja', page: 'alerts' },
  { icon: <Globe size={20} />, label: 'Hosting', page: 'hosting' },
  { icon: <Github size={20} />, label: 'GitHub Deploy', page: 'github' },
  { icon: <Settings size={20} />, label: 'Postavke', page: 'settings' },
];

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<NavPage>('dashboard');
  const { status, isDemo } = useHA();

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('sr-Latn', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleNavClick = (page: NavPage) => {
    setCurrentPage(page);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50/80">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-100 shadow-xl lg:shadow-none transition-transform duration-300 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-200">
              <Zap size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">GMHome</h1>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Asistent</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Connection status badge */}
        <div className="px-4 pt-3">
          <div className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium',
            status === 'connected' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
          )}>
            {status === 'connected' ? <Wifi size={14} /> : <WifiOff size={14} />}
            {status === 'connected' ? 'Home Assistant povezan' : 'Demo režim'}
          </div>
        </div>

        <nav className="p-3 space-y-1 mt-1">
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => handleNavClick(item.page)}
              className={cn(
                'flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                currentPage === item.page
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              )}
            >
              {item.icon}
              {item.label}
              {item.page === 'settings' && status !== 'connected' && (
                <span className="ml-auto h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              )}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          {status !== 'connected' ? (
            <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 p-4 border border-indigo-100">
              <p className="text-xs font-semibold text-indigo-800">Povezite Home Assistant</p>
              <p className="text-[11px] text-indigo-500 mt-1">Idite u Postavke da povežete HA za live podatke.</p>
              <button
                onClick={() => handleNavClick('settings')}
                className="mt-3 w-full rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 transition-colors"
              >
                Poveži se
              </button>
            </div>
          ) : (
            <div className="rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 p-4 border border-green-100">
              <p className="text-xs font-semibold text-green-800">✓ Povezano</p>
              <p className="text-[11px] text-green-600 mt-1">Live podaci se automatski ažuriraju preko WebSocket-a.</p>
              <button
                onClick={() => handleNavClick('github')}
                className="mt-2 w-full rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800 transition-colors flex items-center justify-center gap-1.5"
              >
                <Github size={14} /> Deploy na GitHub
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <Menu size={22} />
              </button>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  {currentPage === 'dashboard' && 'Dashboard'}
                  {currentPage === 'stats' && 'Statistika'}
                  {currentPage === 'devices' && 'Uređaji'}
                  {currentPage === 'alerts' && 'Obavještenja'}
                  {currentPage === 'hosting' && 'Besplatno hostovanje'}
                  {currentPage === 'github' && 'GitHub Deploy'}
                  {currentPage === 'settings' && 'Postavke'}
                </h2>
                <p className="text-xs text-gray-400 capitalize">{formattedDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={cn(
                'hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full',
                status === 'connected'
                  ? 'bg-green-50 text-green-700'
                  : 'bg-gray-100 text-gray-500'
              )}>
                <span className={cn(
                  'h-2 w-2 rounded-full',
                  status === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                )} />
                <span className="text-xs font-medium">
                  {status === 'connected' ? 'HA Connected' : 'Demo'}
                </span>
              </div>
              <button
                onClick={() => handleNavClick('settings')}
                className="relative p-2 rounded-xl bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <Settings size={18} />
                {status !== 'connected' && (
                  <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-amber-400 animate-pulse" />
                )}
              </button>
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-200">
                G
              </div>
            </div>
          </div>
        </header>

        {/* Connection banner for demo mode */}
        {isDemo && currentPage !== 'settings' && (
          <div className="mx-4 sm:mx-6 mt-4">
            <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-amber-50 border border-amber-200">
              <div className="flex items-center gap-2">
                <WifiOff size={16} className="text-amber-600 flex-shrink-0" />
                <p className="text-xs text-amber-700">
                  <span className="font-semibold">Demo režim</span> — Prikazani su primjerni podaci. Povežite Home Assistant za live podatke.
                </p>
              </div>
              <button
                onClick={() => handleNavClick('settings')}
                className="flex-shrink-0 px-3 py-1 text-xs font-medium bg-amber-200 text-amber-800 rounded-lg hover:bg-amber-300 transition-colors"
              >
                Poveži
              </button>
            </div>
          </div>
        )}

        {/* Page content */}
        <div className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto">
          {currentPage === 'dashboard' && <DashboardPage />}
          {currentPage === 'stats' && <StatsPage />}
          {currentPage === 'devices' && <DevicesPage />}
          {currentPage === 'alerts' && <AlertsPage />}
          {currentPage === 'hosting' && <HostingPage />}
          {currentPage === 'github' && <GitHubDeployPage />}
          {currentPage === 'settings' && <SettingsPage />}

          {/* Footer */}
          <footer className="text-center py-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              GMHome Asistent v3.0 • Home Assistant Integration • © 2024
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}

function DashboardPage() {
  const { isDemo } = useHA();

  return (
    <>
      <LivePower />
      <HAStatCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EnergyChart />
        </div>
        <div>
          <TariffInfo />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          {!isDemo ? <HADeviceList /> : <DeviceList />}
          {!isDemo && <div className="mt-6"><DeviceList /></div>}
        </div>
        <div className="lg:col-span-1 space-y-6">
          {!isDemo && <HAPowerSensors />}
          <ConsumptionPie />
          <RoomBreakdown />
        </div>
        <div className="lg:col-span-1">
          <AlertsFeed />
        </div>
      </div>
    </>
  );
}

function StatsPage() {
  const { isDemo } = useHA();
  return (
    <>
      <HAStatCards />
      <EnergyChart />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConsumptionPie />
        <RoomBreakdown />
      </div>
      {!isDemo && <HAPowerSensors />}
    </>
  );
}

function DevicesPage() {
  const { isDemo } = useHA();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {!isDemo && <HADeviceList />}
      <DeviceList />
      {!isDemo && <HAPowerSensors />}
    </div>
  );
}

function AlertsPage() {
  return (
    <div className="max-w-2xl">
      <AlertsFeed />
    </div>
  );
}

export function App() {
  return (
    <HAProvider>
      <AppContent />
    </HAProvider>
  );
}
