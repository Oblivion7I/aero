export interface TrustedContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  isEmergencyContact: boolean;
  canViewLocation: boolean;
}

export const MOCK_TRUSTED_CONTACTS: TrustedContact[] = [
  {
    id: 'tc-1',
    name: 'Nusrat Jahan',
    relationship: 'Sister',
    phone: '+8801700000001',
    email: 'nusrat@example.com',
    isEmergencyContact: true,
    canViewLocation: true,
  },
  {
    id: 'tc-2',
    name: 'Kamal Hossen',
    relationship: 'Father',
    phone: '+8801700000002',
    isEmergencyContact: true,
    canViewLocation: false,
  },
];
