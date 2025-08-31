import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type ThemeMode = "light" | "dark";
type ThemeColor = "toolbox" | "red" | "green" | "blue" | "sage" | "orange" | "cosmic";

type ThemeState = {
  mode: ThemeMode;
  color: ThemeColor;
};

const initialState: ThemeState = {
  mode: "light",
  color: "cosmic",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
    },
    setThemeColor: (state, action: PayloadAction<ThemeColor>) => {
      state.color = action.payload;
    },
    toggleThemeMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
  },
});

export const { setThemeMode, setThemeColor, toggleThemeMode } = themeSlice.actions;
export default themeSlice.reducer;
