export interface BackupRecord {
  id: string;
  label: string;
  createdAt: string;
  sizeMb: number;
  type: 'settings' | 'device' | 'full';
}

export const MOCK_BACKUPS: BackupRecord[] = [
  { id: 'b-1', label: 'Full backup', createdAt: new Date().toISOString(), sizeMb: 42, type: 'full' },
  {
    id: 'b-2',
    label: 'Settings backup',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    sizeMb: 2,
    type: 'settings',
  },
];
