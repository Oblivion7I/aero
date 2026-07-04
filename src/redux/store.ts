import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@redux/slices/authSlice';
import deviceReducer from '@redux/slices/deviceSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    device: deviceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
