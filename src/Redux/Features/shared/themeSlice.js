import { createSlice } from "@reduxjs/toolkit";

const initialTheme = localStorage.getItem('theme') || 'light';

const initialState = {
  mode: initialTheme,
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state) => {
      state.mode = state.mode === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', state.mode);
      document.documentElement.setAttribute('data-theme', state.mode); // DaisyUI works with this
    },
    setInitialTheme: (state, action) => {
      state.mode = action.payload;
      document.documentElement.setAttribute('data-theme', action.payload);
    }
  },
});

export const { setTheme, setInitialTheme } = themeSlice.actions;
export default themeSlice.reducer;
