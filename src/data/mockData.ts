// Mock data for GMHome energy dashboard

export const hourlyData = [
  { time: '00:00', kwh: 0.8, cost: 0.12 },
  { time: '01:00', kwh: 0.6, cost: 0.09 },
  { time: '02:00', kwh: 0.5, cost: 0.08 },
  { time: '03:00', kwh: 0.4, cost: 0.06 },
  { time: '04:00', kwh: 0.5, cost: 0.08 },
  { time: '05:00', kwh: 0.7, cost: 0.11 },
  { time: '06:00', kwh: 1.2, cost: 0.18 },
  { time: '07:00', kwh: 2.1, cost: 0.32 },
  { time: '08:00', kwh: 2.8, cost: 0.42 },
  { time: '09:00', kwh: 2.5, cost: 0.38 },
  { time: '10:00', kwh: 2.2, cost: 0.33 },
  { time: '11:00', kwh: 2.0, cost: 0.30 },
  { time: '12:00', kwh: 2.4, cost: 0.36 },
  { time: '13:00', kwh: 2.6, cost: 0.39 },
  { time: '14:00', kwh: 2.3, cost: 0.35 },
  { time: '15:00', kwh: 2.1, cost: 0.32 },
  { time: '16:00', kwh: 2.5, cost: 0.38 },
  { time: '17:00', kwh: 3.2, cost: 0.48 },
  { time: '18:00', kwh: 3.8, cost: 0.57 },
  { time: '19:00', kwh: 3.5, cost: 0.53 },
  { time: '20:00', kwh: 3.0, cost: 0.45 },
  { time: '21:00', kwh: 2.4, cost: 0.36 },
  { time: '22:00', kwh: 1.8, cost: 0.27 },
  { time: '23:00', kwh: 1.2, cost: 0.18 },
];

export const weeklyData = [
  { day: 'Pon', kwh: 42.5, cost: 6.38 },
  { day: 'Uto', kwh: 38.2, cost: 5.73 },
  { day: 'Sre', kwh: 45.1, cost: 6.77 },
  { day: 'Čet', kwh: 40.8, cost: 6.12 },
  { day: 'Pet', kwh: 48.3, cost: 7.25 },
  { day: 'Sub', kwh: 52.6, cost: 7.89 },
  { day: 'Ned', kwh: 49.1, cost: 7.37 },
];

export const monthlyData = [
  { month: 'Jan', kwh: 1250, cost: 187.5 },
  { month: 'Feb', kwh: 1100, cost: 165.0 },
  { month: 'Mar', kwh: 1050, cost: 157.5 },
  { month: 'Apr', kwh: 920, cost: 138.0 },
  { month: 'Maj', kwh: 850, cost: 127.5 },
  { month: 'Jun', kwh: 980, cost: 147.0 },
  { month: 'Jul', kwh: 1150, cost: 172.5 },
  { month: 'Avg', kwh: 1200, cost: 180.0 },
  { month: 'Sep', kwh: 1020, cost: 153.0 },
  { month: 'Okt', kwh: 1080, cost: 162.0 },
  { month: 'Nov', kwh: 1180, cost: 177.0 },
  { month: 'Dec', kwh: 1320, cost: 198.0 },
];

export interface Device {
  id: string;
  name: string;
  icon: string;
  room: string;
  currentWatts: number;
  dailyKwh: number;
  status: 'on' | 'off' | 'standby';
  percentage: number;
}

export const devices: Device[] = [
  { id: '1', name: 'Klima uređaj', icon: 'snowflake', room: 'Dnevna soba', currentWatts: 1200, dailyKwh: 8.4, status: 'on', percentage: 22 },
  { id: '2', name: 'Bojler', icon: 'flame', room: 'Kupatilo', currentWatts: 2000, dailyKwh: 6.0, status: 'on', percentage: 16 },
  { id: '3', name: 'Frižider', icon: 'refrigerator', room: 'Kuhinja', currentWatts: 150, dailyKwh: 3.6, status: 'on', percentage: 9 },
  { id: '4', name: 'Mašina za pranje', icon: 'washer', room: 'Kupatilo', currentWatts: 0, dailyKwh: 2.1, status: 'off', percentage: 5 },
  { id: '5', name: 'TV', icon: 'tv', room: 'Dnevna soba', currentWatts: 120, dailyKwh: 1.8, status: 'on', percentage: 5 },
  { id: '6', name: 'Računar', icon: 'monitor', room: 'Radna soba', currentWatts: 350, dailyKwh: 4.2, status: 'on', percentage: 11 },
  { id: '7', name: 'Rasvjeta', icon: 'lightbulb', room: 'Cijeli stan', currentWatts: 180, dailyKwh: 2.5, status: 'on', percentage: 7 },
  { id: '8', name: 'Mašina za suđe', icon: 'utensils', room: 'Kuhinja', currentWatts: 0, dailyKwh: 1.5, status: 'off', percentage: 4 },
  { id: '9', name: 'Rerna', icon: 'cookingPot', room: 'Kuhinja', currentWatts: 0, dailyKwh: 3.2, status: 'off', percentage: 8 },
  { id: '10', name: 'Ostalo', icon: 'plug', room: 'Razno', currentWatts: 280, dailyKwh: 5.0, status: 'on', percentage: 13 },
];

export const rooms = [
  { name: 'Dnevna soba', kwh: 10.2, percentage: 26, devices: 3 },
  { name: 'Kuhinja', kwh: 8.3, percentage: 21, devices: 3 },
  { name: 'Kupatilo', kwh: 8.1, percentage: 21, devices: 2 },
  { name: 'Radna soba', kwh: 4.2, percentage: 11, devices: 1 },
  { name: 'Spavaća soba', kwh: 3.2, percentage: 8, devices: 2 },
  { name: 'Razno', kwh: 5.0, percentage: 13, devices: 1 },
];

export const alerts = [
  { id: 1, type: 'warning' as const, message: 'Klima uređaj radi duže od 8h bez prekida', time: 'Prije 15 min' },
  { id: 2, type: 'info' as const, message: 'Potrošnja danas 12% veća od prosjeka', time: 'Prije 1h' },
  { id: 3, type: 'success' as const, message: 'Noćna tarifa aktivna - idealno za pranje veša', time: 'Prije 2h' },
  { id: 4, type: 'warning' as const, message: 'Bojler: visoka potrošnja detektovana', time: 'Prije 3h' },
  { id: 5, type: 'info' as const, message: 'Mjesečni budžet: iskorišteno 68%', time: 'Prije 5h' },
];

export const tariffs = {
  current: 'Dnevna tarifa (VT)',
  pricePerKwh: 0.15,
  currency: 'KM',
  nextChange: '22:00',
  nightPrice: 0.08,
};

export const deviceConsumptionPie = [
  { name: 'Klima', value: 22, color: '#6366f1' },
  { name: 'Bojler', value: 16, color: '#8b5cf6' },
  { name: 'Računar', value: 11, color: '#a78bfa' },
  { name: 'Frižider', value: 9, color: '#c4b5fd' },
  { name: 'Rerna', value: 8, color: '#e879f9' },
  { name: 'Rasvjeta', value: 7, color: '#f472b6' },
  { name: 'TV', value: 5, color: '#fb923c' },
  { name: 'Pranje', value: 5, color: '#fbbf24' },
  { name: 'Suđe', value: 4, color: '#34d399' },
  { name: 'Ostalo', value: 13, color: '#94a3b8' },
];
