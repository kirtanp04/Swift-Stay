import { alpha } from '@mui/material/styles';

function createGradient(color1: string, color2: string) {
  return `linear-gradient(to bottom, ${color1}, ${color2})`;
}

export type ColorSchema = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';

interface GradientsPaletteOptions {
  primary: string;
  info: string;
  success: string;
  warning: string;
  error: string;
}

interface ChartPaletteOptions {
  violet: string[];
  blue: string[];
  green: string[];
  yellow: string[];
  red: string[];
}

declare module '@mui/material/styles/createPalette' {
  interface TypeBackground {
    neutral: string;
  }
  interface SimplePaletteColorOptions {
    lighter: string;
    darker: string;
  }
  interface PaletteColor {
    lighter: string;
    darker: string;
  }
  interface Palette {
    gradients: GradientsPaletteOptions;
    chart: ChartPaletteOptions;
  }
  interface PaletteOptions {
    gradients: GradientsPaletteOptions;
    chart: ChartPaletteOptions;
  }
}

declare module '@mui/material' {
  interface Color {
    0: string;
    500_8: string;
    500_12: string;
    500_16: string;
    500_24: string;
    500_32: string;
    500_48: string;
    500_56: string;
    500_80: string;
  }
}

const PRIMARY = {
  main: 'hsl(240, 5.9%, 10%)',
  contrastText: 'hsl(0, 0%, 98%)',
};
const SECONDARY = {
  main: 'hsl(240, 4.8%, 95.9%)',
  contrastText: 'hsl(240, 5.9%, 10%)',
};
const INFO = {
  main: 'hsl(240, 4.8%, 95.9%)',
  contrastText: 'hsl(240, 5.9%, 10%)',
};
const SUCCESS = {
  main: 'hsl(240, 4.8%, 95.9%)',
  contrastText: 'hsl(240, 5.9%, 10%)',
};
const WARNING = {
  main: 'hsl(0, 84.2%, 60.2%)',
  contrastText: 'hsl(0, 0%, 98%)',
};
const ERROR = {
  main: 'hsl(0, 84.2%, 60.2%)',
  contrastText: 'hsl(0, 0%, 98%)',
};

const GREY = {
  0: 'hsl(0, 0%, 100%)',
  100: 'hsl(240, 5.9%, 90%)',
  200: 'hsl(240, 5.9%, 90%)',
  300: 'hsl(240, 5.9%, 90%)',
  400: 'hsl(240, 5.9%, 90%)',
  500: 'hsl(240, 5.9%, 90%)',
  600: 'hsl(240, 5.9%, 90%)',
  700: 'hsl(240, 5.9%, 90%)',
  800: 'hsl(240, 5.9%, 90%)',
  900: 'hsl(240, 5.9%, 90%)',
  500_8: alpha('hsl(240, 5.9%, 90%)', 0.08),
  500_12: alpha('hsl(240, 5.9%, 90%)', 0.12),
  500_16: alpha('hsl(240, 5.9%, 90%)', 0.16),
  500_24: alpha('hsl(240, 5.9%, 90%)', 0.24),
  500_32: alpha('hsl(240, 5.9%, 90%)', 0.32),
  500_48: alpha('hsl(240, 5.9%, 90%)', 0.48),
  500_56: alpha('hsl(240, 5.9%, 90%)', 0.56),
  500_80: alpha('hsl(240, 5.9%, 90%)', 0.8),
};

const GRADIENTS = {
  primary: createGradient('hsl(240, 5.9%, 10%)', 'hsl(240, 5.9%, 10%)'),
  info: createGradient('hsl(240, 4.8%, 95.9%)', 'hsl(240, 4.8%, 95.9%)'),
  success: createGradient('hsl(240, 4.8%, 95.9%)', 'hsl(240, 4.8%, 95.9%)'),
  warning: createGradient('hsl(0, 84.2%, 60.2%)', 'hsl(0, 84.2%, 60.2%)'),
  error: createGradient('hsl(0, 84.2%, 60.2%)', 'hsl(0, 84.2%, 60.2%)'),
};

const CHART_COLORS = {
  violet: ['hsl(12, 76%, 61%)', 'hsl(173, 58%, 39%)', 'hsl(197, 37%, 24%)', 'hsl(43, 74%, 66%)'],
  blue: ['hsl(240, 5.9%, 10%)', 'hsl(240, 5.9%, 10%)', 'hsl(240, 5.9%, 10%)', 'hsl(240, 5.9%, 10%)'],
  green: ['hsl(240, 5.9%, 10%)', 'hsl(240, 5.9%, 10%)', 'hsl(240, 5.9%, 10%)', 'hsl(240, 5.9%, 10%)'],
  yellow: ['hsl(43, 74%, 66%)', 'hsl(27, 87%, 67%)', 'hsl(197, 37%, 24%)', 'hsl(173, 58%, 39%)'],
  red: ['hsl(0, 84.2%, 60.2%)', 'hsl(0, 62.8%, 30.6%)', 'hsl(0, 84.2%, 60.2%)', 'hsl(0, 84.2%, 60.2%)'],
};

const COMMON = {
  common: { black: 'hsl(0, 0%, 3.9%)', white: 'hsl(0, 0%, 98%)' },
  primary: { ...PRIMARY, contrastText: 'hsl(0, 0%, 98%)' },
  secondary: { ...SECONDARY, contrastText: 'hsl(240, 5.9%, 10%)' },
  info: { ...INFO, contrastText: 'hsl(240, 5.9%, 10%)' },
  success: { ...SUCCESS, contrastText: 'hsl(240, 5.9%, 10%)' },
  warning: { ...WARNING, contrastText: 'hsl(0, 0%, 98%)' },
  error: { ...ERROR, contrastText: 'hsl(0, 0%, 98%)' },
  grey: GREY,
  gradients: GRADIENTS,
  chart: CHART_COLORS,
  divider: GREY[500_24],
  action: {
    hover: GREY[500_8],
    selected: GREY[500_16],
    disabled: GREY[500_80],
    disabledBackground: GREY[500_24],
    focus: GREY[500_24],
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
  },
};

export const palette = {
  light: {
    ...COMMON,
    mode: 'light',
    text: { primary: 'hsl(240, 10%, 3.9%)', secondary: 'hsl(240, 5.9%, 10%)', disabled: 'hsl(240, 4.8%, 95.9%)' },
    background: { paper: 'hsl(0, 0%, 100%)', default: 'hsl(0, 0%, 100%)', neutral: 'hsl(240, 5.9%, 90%)' },
    action: { active: 'hsl(240, 5.9%, 10%)', ...COMMON.action },
  },
  dark: {
    ...COMMON,
    mode: 'dark',
    text: { primary: 'hsl(0, 0%, 98%)', secondary: 'hsl(240, 5.9%, 90%)', disabled: 'hsl(240, 4.8%, 95.9%)' },
    background: { paper: 'hsl(240, 10%, 3.9%)', default: 'hsl(240, 10%, 3.9%)', neutral: 'hsl(240, 3.7%, 15.9%)' },
    card: { paper: 'hsl(240, 10%, 3.9%)', default: 'hsl(240, 10%, 3.9%)', foreground: 'hsl(0, 0%, 98%)' },
    popover: { paper: 'hsl(240, 10%, 3.9%)', default: 'hsl(240, 10%, 3.9%)', foreground: 'hsl(0, 0%, 98%)' },
    primary: { main: 'hsl(0, 0%, 98%)', contrastText: 'hsl(240, 5.9%, 10%)' },
    secondary: { main: 'hsl(240, 3.7%, 15.9%)', contrastText: 'hsl(0, 0%, 98%)' },
    muted: { main: 'hsl(240, 3.7%, 15.9%)', contrastText: 'hsl(240, 5% 64.9%)' },
    accent: { main: 'hsl(240, 3.7%, 15.9%)', contrastText: 'hsl(0, 0%, 98%)' },
    destructive: { main: 'hsl(0, 62.8%, 30.6%)', contrastText: 'hsl(0, 0%, 98%)' },
    border: 'hsl(240, 3.7%, 15.9%)',
    input: 'hsl(240, 3.7%, 15.9%)',
    ring: 'hsl(240, 4.9%, 83.9%)',
    chart: {
      violet: ['#D1C4E9', '#B39DDB', '#9575CD', '#7E57C2'],
      blue: ['#BBDEFB', '#90CAF9', '#64B5F6', '#42A5F5'],
      green: ['#C8E6C9', '#A5D6A7', '#81C784', '#66BB6A'],
      yellow: ['#FFF9C4', '#FFF59D', '#FFF176', '#FFEE58'],
      red: ['#FFCDD2', '#EF9A9A', '#E57373', '#EF5350']
    }
  },
};

