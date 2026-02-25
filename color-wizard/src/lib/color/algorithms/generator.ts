import chroma from 'chroma-js';
import { type ColorHSL, ColorStrategy } from '../../../types';

export class ColorPaletteGenerator {
  
  static generate(baseColor: ColorHSL, strategy: ColorStrategy, count: number = 5): ColorHSL[] {
    switch (strategy) {
      case ColorStrategy.ANALOGOUS:
        return this.generateAnalogous(baseColor, count);
      case ColorStrategy.COMPLEMENTARY:
        return this.generateComplementary(baseColor, count);
      case ColorStrategy.TRIADIC:
        return this.generateTriadic(baseColor, count);
      case ColorStrategy.TETRADIC:
        return this.generateTetradic(baseColor, count);
      case ColorStrategy.MONOCHROMATIC:
        return this.generateMonochromatic(baseColor, count);
      case ColorStrategy.SPLIT_COMPLEMENTARY:
        return this.generateSplitComplementary(baseColor, count);
      default:
        return this.generateAnalogous(baseColor, count);
    }
  }

  // Helper to ensure values stay within valid ranges
  private static clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  // Helper to add random variation within constraints
  private static vary(value: number, amount: number, min: number, max: number): number {
    const variation = (Math.random() - 0.5) * 2 * amount;
    return this.clamp(value + variation, min, max);
  }

  static generateAnalogous(baseColor: ColorHSL, count: number = 5): ColorHSL[] {
    const colors: ColorHSL[] = [baseColor];
    // Reduce step size for smoother transitions
    const angleStep = 15 + Math.random() * 15; // 15-30 degrees
    
    // Generate colors on both sides of the base hue
    for (let i = 1; i < count; i++) {
      // Alternate sides: +1, -1, +2, -2...
      const direction = i % 2 === 0 ? -1 : 1;
      const step = Math.ceil(i / 2);
      const hue = (baseColor.h + direction * step * angleStep + 360) % 360;
      
      colors.push({
        h: hue,
        s: this.vary(baseColor.s, 10, 20, 95), // Keep saturation reasonable
        l: this.vary(baseColor.l, 10, 20, 90)  // Keep lightness visible
      });
    }
    
    // Sort by hue for visual harmony
    return colors.sort((a, b) => {
      // Simple sort doesn't handle the 360/0 wraparound well, but works for close ranges
      return a.h - b.h; 
    });
  }

  static generateComplementary(baseColor: ColorHSL, count: number = 5): ColorHSL[] {
    const colors: ColorHSL[] = [baseColor];
    const complementHue = (baseColor.h + 180) % 360;
    
    // Add the complement
    colors.push({ 
      h: complementHue,
      s: baseColor.s, 
      l: this.clamp(100 - baseColor.l, 20, 80) // Contrast lightness
    });
    
    // Fill the rest with variations
    // 1. A lighter/desaturated version of base
    colors.push({
      h: baseColor.h,
      s: this.clamp(baseColor.s - 20, 10, 90),
      l: this.clamp(baseColor.l + 30, 10, 95)
    });
    
    // 2. A darker/saturated version of complement
    colors.push({
      h: complementHue,
      s: this.clamp(baseColor.s + 10, 20, 100),
      l: this.clamp(100 - baseColor.l - 20, 10, 90)
    });

    // 3. A neutral/bridge color (between base and complement)
    if (count >= 5) {
        colors.push({
            h: baseColor.h,
            s: 10, // Very low saturation
            l: 90  // High lightness (neutral background)
        });
    }

    return colors.slice(0, count);
  }

  static generateTriadic(baseColor: ColorHSL, count: number = 5): ColorHSL[] {
    const colors: ColorHSL[] = [baseColor];
    const hue1 = (baseColor.h + 120) % 360;
    const hue2 = (baseColor.h + 240) % 360;
    
    colors.push({ ...baseColor, h: hue1 });
    colors.push({ ...baseColor, h: hue2 });
    
    // Add variations for the remaining slots
    // Lighter version of hue1
    colors.push({
        h: hue1,
        s: this.clamp(baseColor.s - 10, 20, 90),
        l: this.clamp(baseColor.l + 20, 20, 90)
    });
    // Darker version of hue2
    colors.push({
        h: hue2,
        s: this.clamp(baseColor.s + 10, 20, 100),
        l: this.clamp(baseColor.l - 20, 10, 80)
    });
    
    return colors.slice(0, count);
  }

  static generateTetradic(baseColor: ColorHSL, count: number = 5): ColorHSL[] {
    const colors: ColorHSL[] = [baseColor];
    
    // Standard tetradic (rectangle)
    colors.push({ ...baseColor, h: (baseColor.h + 90) % 360 });
    colors.push({ ...baseColor, h: (baseColor.h + 180) % 360 });
    colors.push({ ...baseColor, h: (baseColor.h + 270) % 360 });
    
    // Add a neutral or light variation for the 5th color
    if (count > 4) {
      colors.push({ 
          h: baseColor.h, 
          s: this.clamp(baseColor.s * 0.5, 0, 50),
          l: 96 
      });
    }
    return colors;
  }

  static generateMonochromatic(baseColor: ColorHSL, count: number = 5): ColorHSL[] {
    const colors: ColorHSL[] = [];
    
    // Generate a range of lightness values, keeping saturation relatively constant
    // We want a spread from dark to light, or centered around the base
    
    // Strategy: Create a gradient from very dark to very light, preserving hue
    const minL = 10;
    const maxL = 95;
    const range = maxL - minL;
    const step = range / (count - 1);

    for (let i = 0; i < count; i++) {
        // Find where the base color fits best? 
        // Or just generate a new set based on the base Hue.
        // Let's keep the base color exactly as is in the set, but sort the rest.
        
        // Actually, for a palette generator, it's often better to just generate a nice gradient
        // and ensure one of them is close to the base, OR just include the base.
        // Let's include the base and generate variations around it.
        
        if (i === 0) {
            colors.push(baseColor);
            continue;
        }

        // Distribute other colors across the lightness range
        // If base is light (l=80), we need darker colors. If base is dark (l=20), need lighter.
        // Simple approach: uniform distribution but skip the slot closest to base?
        // Let's try: generate fixed steps 10, 30, 50, 70, 90. Replace the closest one with base.
        
        const targetL = minL + i * step; // 10, 31, 52, 73, 95 (for count 5)
        
        colors.push({
            h: baseColor.h,
            s: this.vary(baseColor.s, 5, 10, 100), // Slight saturation variation adds realism
            l: targetL
        });
    }

    // Replace the generated color that is closest in lightness to the base color
    // with the actual base color, to ensure it's included?
    // Actually, we pushed baseColor first. So we have 6 colors effectively if we don't be careful.
    // Let's refine:
    
    const finalColors: ColorHSL[] = [];
    // Generate 5 target lightness values
    const targetLightnesses = [10, 30, 50, 70, 90]; // Fixed steps for stability
    
    // Find which target is closest to baseColor.l
    let closestIndex = 0;
    let minDiff = 100;
    
    targetLightnesses.forEach((l, idx) => {
        const diff = Math.abs(l - baseColor.l);
        if (diff < minDiff) {
            minDiff = diff;
            closestIndex = idx;
        }
    });

    for (let i = 0; i < count; i++) {
        if (i === closestIndex) {
            finalColors.push(baseColor);
        } else {
            finalColors.push({
                h: baseColor.h,
                s: this.vary(baseColor.s, 10, 20, 90),
                l: targetLightnesses[i]
            });
        }
    }
    
    return finalColors;
  }

  static generateSplitComplementary(baseColor: ColorHSL, count: number = 5): ColorHSL[] {
    const colors: ColorHSL[] = [baseColor];
    const h1 = (baseColor.h + 150) % 360;
    const h2 = (baseColor.h + 210) % 360;
    
    colors.push({ h: h1, s: baseColor.s, l: baseColor.l });
    colors.push({ h: h2, s: baseColor.s, l: baseColor.l });
    
    // Fill rest with variations
    // Lighter base
    colors.push({
        h: baseColor.h,
        s: this.clamp(baseColor.s - 10, 10, 90),
        l: this.clamp(baseColor.l + 30, 20, 95)
    });
    // Darker/Desaturated h1 or h2
    colors.push({
        h: h1,
        s: this.clamp(baseColor.s - 20, 10, 80),
        l: this.clamp(baseColor.l - 20, 10, 80)
    });

    return colors.slice(0, count);
  }
  
  static toCss(color: ColorHSL): string {
    return `hsl(${Math.round(color.h)}, ${Math.round(color.s)}%, ${Math.round(color.l)}%)`;
  }

  static toHex(color: ColorHSL): string {
    return chroma.hsl(color.h, color.s / 100, color.l / 100).hex();
  }
}
