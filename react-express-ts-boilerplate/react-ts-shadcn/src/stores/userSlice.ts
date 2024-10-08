import { createSlice } from "@reduxjs/toolkit";

interface UserState {
  currentUser: any; // veya spesifik bir tip belirleyin
  token: string | null;
  authenticated: boolean;
  preference: Record<string, any>;
}

const initialState: UserState = {
  currentUser: null,
  token: localStorage.getItem(import.meta.env.VITE_APP_AUTH_LOCAL_STORAGE_KEY),
  authenticated: false,
  preference: {},
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },

    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
      state.authenticated = true;
    },

    logout: (state) => {
      state.currentUser = null;
      state.token = null;
      state.authenticated = false;
    },
  },
});

export const { setToken, setCurrentUser, logout } = userSlice.actions;

export default userSlice.reducer;
