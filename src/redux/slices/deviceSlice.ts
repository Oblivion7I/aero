import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface DeviceInfo {
  id: string;
  name: string;
  batteryLevel: number;
  isCharging: boolean;
  storageFreeGb: number;
  ramUsedGb: number;
  ramTotalGb: number;
  androidVersion: string;
  isOnline: boolean;
  securityScore: number;
}

export interface DeviceState {
  devices: DeviceInfo[];
  currentDeviceId: string | null;
}

const initialState: DeviceState = {
  devices: [],
  currentDeviceId: null,
};

const deviceSlice = createSlice({
  name: 'device',
  initialState,
  reducers: {
    setDevices: (state, action: PayloadAction<DeviceInfo[]>) => {
      state.devices = action.payload;
    },
    updateDevice: (state, action: PayloadAction<Partial<DeviceInfo> & { id: string }>) => {
      const target = state.devices.find(d => d.id === action.payload.id);
      if (target) {
        Object.assign(target, action.payload);
      }
    },
    setCurrentDevice: (state, action: PayloadAction<string>) => {
      state.currentDeviceId = action.payload;
    },
  },
});

export const { setDevices, updateDevice, setCurrentDevice } = deviceSlice.actions;
export default deviceSlice.reducer;
