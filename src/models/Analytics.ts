export interface DailyMetric {
  label: string; // e.g. weekday short name or date
  value: number;
}

export interface AnalyticsSnapshot {
  batteryHistory: DailyMetric[];
  storageUsedGb: number;
  storageTotalGb: number;
  ramAverageUsedGb: number;
  ramTotalGb: number;
}

export const MOCK_ANALYTICS: AnalyticsSnapshot = {
  batteryHistory: [
    { label: 'Mon', value: 78 },
    { label: 'Tue', value: 65 },
    { label: 'Wed', value: 82 },
    { label: 'Thu', value: 54 },
    { label: 'Fri', value: 70 },
    { label: 'Sat', value: 88 },
    { label: 'Sun', value: 82 },
  ],
  storageUsedGb: 74,
  storageTotalGb: 128,
  ramAverageUsedGb: 3.4,
  ramTotalGb: 8,
};
