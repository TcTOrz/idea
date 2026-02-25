import { create } from 'zustand';
import { type ColorHSL, ColorStrategy } from '../types';
import { ColorPaletteGenerator } from '../lib/color/algorithms/generator';

interface ColorState {
  baseColor: ColorHSL;
  palette: ColorHSL[];
  strategy: ColorStrategy;
  
  setBaseColor: (color: ColorHSL) => void;
  setStrategy: (strategy: ColorStrategy) => void;
  generatePalette: () => void;
  randomize: () => void;
}

export const useColorStore = create<ColorState>((set, get) => ({
  baseColor: { h: 210, s: 80, l: 50 }, // Default blue
  strategy: ColorStrategy.ANALOGOUS,
  palette: [],

  setBaseColor: (color) => {
    set({ baseColor: color });
    get().generatePalette();
  },

  setStrategy: (strategy) => {
    set({ strategy });
    get().generatePalette();
  },

  generatePalette: () => {
    const { baseColor, strategy } = get();
    const colors = ColorPaletteGenerator.generate(baseColor, strategy);
    set({ palette: colors });
  },

  randomize: () => {
    // Keep current baseColor and strategy, only re-generate palette variations
    get().generatePalette();
  }
}));
