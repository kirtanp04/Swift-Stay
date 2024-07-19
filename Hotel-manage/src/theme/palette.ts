import { PaletteMode } from "@mui/material";
import { alpha } from "@mui/material/styles";

function createGradient(color1: string, color2: string) {
  return `linear-gradient(to bottom, ${color1}, ${color2})`;
}

export type ColorSchema =
  | "primary"
  | "secondary"
  | "info"
  | "success"
  | "warning"
  | "error";

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

declare module "@mui/material/styles/createPalette" {
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

declare module "@mui/material" {
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
  main: "hsl(188.7 94.5% 42.7%)",
  lighter: "hsl(187 92.4% 69%)",
  darker: "hsl(192.9 82.3% 31%)",
};

const SECONDARY = {
  main: "hsl(217.2 91.2% 59.8%)",

  lighter: "hsl(211.7 96.4% 78.4%)",
  darker: "hsl(224.3 76.3% 48%)",
};

const INFO = {
  main: "hsl(198.6 88.7% 48.4%)",

  lighter: "hsl(199.4 95.5% 73.9%)",
  darker: "hsl(200.4 98% 39.4%)",
};

const SUCCESS = {
  main: "hsl(142.1 70.6% 45.3%)",

  lighter: "hsl(141.7 76.6% 73.1%)",
  darker: "hsl(142.4 71.8% 29.2%)",
};

const WARNING = {
  main: "hsl(45.4 93.4% 47.5%)",

  lighter: "hsl(50.4 97.8% 63.5%)",
  darker: "hsl(40.6 96.1% 40.4%)",
};

const VIOLET = {
  main: "hsl(262.1 83.3% 57.8%)",
  lighter: "hsl(255.1 91.7% 76.3%)",
  darker: "hsl(263.4 69.3% 42.2%)",
};

const PURPLE = {
  main: "hsl(293.4 69.5% 48.8%)",
  lighter: "hsl(292 91.4% 72.5%)",
  darker: "hsl(295.4 70.2% 32.9%)",
};

const ROSE = {
  main: "hsl(346.8 77.2% 49.8%)",
  lighter: "hsl(351.3 94.5% 71.4%)",
  darker: "hsl(343.4 79.7% 34.7%)",
};

const PINK = {
  main: "hsl(328.6 85.5% 70.2%)",
  lighter: "hsl(351.3 94.5% 71.4%)",
  darker: "hsl(335.8 74.4% 35.3%)",
};

const ERROR = {
  main: "hsl(0 72.2% 50.6%)",

  lighter: "hsl(0 90.6% 70.8%)",
  darker: "hsl(0 73.7% 41.8%)",
};

const GREY = {
  0: "hsl(0, 0%, 100%)",
  100: "hsl(240, 5.9%, 90%)",
  200: "hsl(240, 5.9%, 90%)",
  300: "hsl(240, 5.9%, 90%)",
  400: "hsl(240, 5.9%, 90%)",
  500: "hsl(240, 5.9%, 90%)",
  600: "hsl(240, 5.9%, 90%)",
  700: "hsl(240, 5.9%, 90%)",
  800: "hsl(240, 5.9%, 90%)",
  900: "hsl(240, 5.9%, 90%)",
  500_8: alpha("hsl(240, 5.9%, 90%)", 0.08),
  500_12: alpha("hsl(240, 5.9%, 90%)", 0.12),
  500_16: alpha("hsl(240, 5.9%, 90%)", 0.16),
  500_24: alpha("hsl(240, 5.9%, 90%)", 0.24),
  500_32: alpha("hsl(240, 5.9%, 90%)", 0.32),
  500_48: alpha("hsl(240, 5.9%, 90%)", 0.48),
  500_56: alpha("hsl(240, 5.9%, 90%)", 0.56),
  500_80: alpha("hsl(240, 5.9%, 90%)", 0.8),
};

const GRADIENTS = {
  primary: createGradient("hsl(240, 5.9%, 10%)", "hsl(240, 5.9%, 10%)"),
  info: createGradient("hsl(240, 4.8%, 95.9%)", "hsl(240, 4.8%, 95.9%)"),
  success: createGradient("hsl(240, 4.8%, 95.9%)", "hsl(240, 4.8%, 95.9%)"),
  warning: createGradient("hsl(0, 84.2%, 60.2%)", "hsl(0, 84.2%, 60.2%)"),
  error: createGradient("hsl(0, 84.2%, 60.2%)", "hsl(0, 84.2%, 60.2%)"),
};

const CHART_COLORS = {
  violet: { ...VIOLET },
  blue: { ...INFO },
  green: { ...SUCCESS },
  yellow: { ...WARNING },
  red: { ...ERROR },
};

const COMMON = {
  common: { black: "hsl(0, 0%, 3.9%)", white: "hsl(0, 0%, 98%)" },
  color: {
    primary: { ...PRIMARY },
    secondary: { ...SECONDARY },
    info: { ...INFO },
    success: { ...SUCCESS },
    warning: { ...WARNING },
    error: { ...ERROR },
    violet: { ...VIOLET },
    purple: { ...PURPLE },
    rose: { ...ROSE },
    pink: { ...PINK },
  },
  grey: GREY,
  gradients: GRADIENTS,
  chart: CHART_COLORS,
  divider: 'hsl(30 6.3% 25.1%)',
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

const palette = {
  light: {
    ...COMMON,
    mode: "light" as PaletteMode,
    text: {
      primary: "hsl(240 10% 3.9%)",
      secondary: "hsl(0 0% 45.1%)",
      disabled: "hsl(240 5.3% 26.1%)",
    },
    background: {
      paper: "hsl(0, 0%, 98%)",
      default: "hsl(0, 0%, 98%)",
      neutral: "hsl(240, 5.9%, 90%)",
    },
    card: {
      paper: "hsl(0, 0%, 98%)",
      default: "hsl(0, 0%, 98%)",
      foreground: "hsl(240, 5.9%, 10%)",
    },
    popover: {
      paper: "hsl(0, 0%, 98%)",
      default: "hsl(0, 0%, 98%)",
      foreground: "hsl(240, 5.9%, 10%)",
    },
    primary: { ...PRIMARY },
    secondary: { ...SECONDARY },
    muted: { main: "hsl(0, 0%, 98%)", contrastText: "hsl(240, 3.7%, 15.9%)" },
    accent: { main: "hsl(0, 0%, 98%)", contrastText: "hsl(240, 5.9%, 10%)" },
    destructive: {
      main: "hsl(0, 84.2%, 60.2%)",
      contrastText: "hsl(0, 0%, 98%)",
    },
    border: "hsl(30 6.3% 25.1%)",
    input: "hsl(0, 0%, 98%)",
    ring: "hsl(240, 4.9%, 83.9%)",
    chart: {
      violet: ["#D1C4E9", "#B39DDB", "#9575CD", "#7E57C2"],
      blue: ["#BBDEFB", "#90CAF9", "#64B5F6", "#42A5F5"],
      green: ["#C8E6C9", "#A5D6A7", "#81C784", "#66BB6A"],
      yellow: ["#FFF9C4", "#FFF59D", "#FFF176", "#FFEE58"],
      red: ["#FFCDD2", "#EF9A9A", "#E57373", "#EF5350"],
    },
  },
  dark: {
    ...COMMON,
    mode: "dark" as PaletteMode,
    text: {
      primary: "hsl(210 40% 98%)",
      secondary: "hsl(0 0% 45.1%)",
      disabled: "hsl(240 5.3% 26.1%)",
    },
    background: {
      paper: "hsl(240, 10%, 3.9%)",
      default: "hsl(240, 10%, 3.9%)",
      neutral: "hsl(240, 3.7%, 15.9%)",
    },
    card: {
      paper: "hsl(240, 10%, 3.9%)",
      default: "hsl(240, 10%, 3.9%)",
      foreground: "hsl(0, 0%, 98%)",
    },
    popover: {
      paper: "hsl(240, 10%, 3.9%)",
      default: "hsl(240, 10%, 3.9%)",
      foreground: "hsl(0, 0%, 98%)",
    },
    primary: { ...PRIMARY },
    secondary: { ...SECONDARY },
    muted: {
      main: "hsl(240, 3.7%, 15.9%)",
      contrastText: "hsl(240, 5% 64.9%)",
    },
    accent: { main: "hsl(240, 3.7%, 15.9%)", contrastText: "hsl(0, 0%, 98%)" },
    destructive: {
      main: "hsl(0, 62.8%, 30.6%)",
      contrastText: "hsl(0, 0%, 98%)",
    },
    border: "hsl(30 6.3% 25.1%)",
    input: "hsl(240, 3.7%, 15.9%)",
    ring: "hsl(240, 4.9%, 83.9%)",
    chart: {
      violet: ["#D1C4E9", "#B39DDB", "#9575CD", "#7E57C2"],
      blue: ["#BBDEFB", "#90CAF9", "#64B5F6", "#42A5F5"],
      green: ["#C8E6C9", "#A5D6A7", "#81C784", "#66BB6A"],
      yellow: ["#FFF9C4", "#FFF59D", "#FFF176", "#FFEE58"],
      red: ["#FFCDD2", "#EF9A9A", "#E57373", "#EF5350"],
    },
  },
};

export default palette;
