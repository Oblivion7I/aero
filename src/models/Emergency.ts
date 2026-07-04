export interface MedicalInfo {
  bloodGroup: string;
  allergies: string;
  conditions: string;
  medications: string;
  notes: string;
}

export const DEFAULT_MEDICAL_INFO: MedicalInfo = {
  bloodGroup: '',
  allergies: '',
  conditions: '',
  medications: '',
  notes: '',
};
