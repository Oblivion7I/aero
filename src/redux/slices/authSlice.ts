import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  userId: string | null;
  email: string | null;
  isOwnerVerified: boolean;
}

const initialState: AuthState = {
  userId: null,
  email: null,
  isOwnerVerified: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ userId: string; email: string }>) => {
      state.userId = action.payload.userId;
      state.email = action.payload.email;
    },
    setOwnerVerified: (state, action: PayloadAction<boolean>) => {
      state.isOwnerVerified = action.payload;
    },
    signOut: state => {
      state.userId = null;
      state.email = null;
      state.isOwnerVerified = false;
    },
  },
});

export const { setUser, setOwnerVerified, signOut } = authSlice.actions;
export default authSlice.reducer;
