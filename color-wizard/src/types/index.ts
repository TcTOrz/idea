export interface ColorHSL {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

export interface ColorRGB {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

export type ColorHex = string;

export const ColorStrategy = {
  ANALOGOUS: 'analogous',
  COMPLEMENTARY: 'complementary',
  TRIADIC: 'triadic',
  TETRADIC: 'tetradic',
  MONOCHROMATIC: 'monochromatic',
  SPLIT_COMPLEMENTARY: 'split-complementary',
  CUSTOM: 'custom'
} as const;

export type ColorStrategy = typeof ColorStrategy[keyof typeof ColorStrategy];

export interface Palette {
  id: string;
  name: string;
  colors: ColorHSL[];
  strategy: ColorStrategy;
  createdAt: number;
}
