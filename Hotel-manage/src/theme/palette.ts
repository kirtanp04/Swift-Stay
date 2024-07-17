// import { alpha } from '@mui/material/styles';

// // ----------------------------------------------------------------------

// function createGradient(color1: string, color2: string) {
//   return `linear-gradient(to bottom, ${color1}, ${color2})`;
// }

// export type ColorSchema = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';

// interface GradientsPaletteOptions {
//   primary: string;
//   info: string;
//   success: string;
//   warning: string;
//   error: string;
// }

// interface ChartPaletteOptions {
//   violet: string[];
//   blue: string[];
//   green: string[];
//   yellow: string[];
//   red: string[];
// }

// declare module '@mui/material/styles/createPalette' {
//   interface TypeBackground {
//     neutral: string;
//   }
//   interface SimplePaletteColorOptions {
//     lighter: string;
//     darker: string;
//   }
//   interface PaletteColor {
//     lighter: string;
//     darker: string;
//   }
//   interface Palette {
//     gradients: GradientsPaletteOptions;
//     chart: ChartPaletteOptions;
//   }
//   interface PaletteOptions {
//     gradients: GradientsPaletteOptions;
//     chart: ChartPaletteOptions;
//   }
// }

// declare module '@mui/material' {
//   interface Color {
//     0: string;
//     500_8: string;
//     500_12: string;
//     500_16: string;
//     500_24: string;
//     500_32: string;
//     500_48: string;
//     500_56: string;
//     500_80: string;
//   }
// }

// // SETUP COLORS
// const PRIMARY = {
//   lighter: '#C8FACD',
//   light: '#5BE584',
//   main: '#00AB55',
//   dark: '#007B55',
//   darker: '#005249',
// };
// const SECONDARY = {
//   lighter: '#D6E4FF',
//   light: '#84A9FF',
//   main: '#3366FF',
//   dark: '#1939B7',
//   darker: '#091A7A',
// };
// const INFO = {
//   lighter: '#D0F2FF',
//   light: '#74CAFF',
//   main: '#1890FF',
//   dark: '#0C53B7',
//   darker: '#04297A',
// };
// const SUCCESS = {
//   lighter: '#E9FCD4',
//   light: '#AAF27F',
//   main: '#54D62C',
//   dark: '#229A16',
//   darker: '#08660D',
// };
// const WARNING = {
//   lighter: '#FFF7CD',
//   light: '#FFE16A',
//   main: '#FFC107',
//   dark: '#B78103',
//   darker: '#7A4F01',
// };
// const ERROR = {
//   lighter: '#FFE7D9',
//   light: '#FFA48D',
//   main: '#FF4842',
//   dark: '#B72136',
//   darker: '#7A0C2E',
// };

// const GREY = {
//   0: '#FFFFFF',
//   100: '#F9FAFB',
//   200: '#F4F6F8',
//   300: '#DFE3E8',
//   400: '#C4CDD5',
//   500: '#919EAB',
//   600: '#637381',
//   700: '#454F5B',
//   800: '#212B36',
//   900: '#161C24',
//   500_8: alpha('#919EAB', 0.08),
//   500_12: alpha('#919EAB', 0.12),
//   500_16: alpha('#919EAB', 0.16),
//   500_24: alpha('#919EAB', 0.24),
//   500_32: alpha('#919EAB', 0.32),
//   500_48: alpha('#919EAB', 0.48),
//   500_56: alpha('#919EAB', 0.56),
//   500_80: alpha('#919EAB', 0.8),
// };

// const GRADIENTS = {
//   primary: createGradient(PRIMARY.light, PRIMARY.main),
//   info: createGradient(INFO.light, INFO.main),
//   success: createGradient(SUCCESS.light, SUCCESS.main),
//   warning: createGradient(WARNING.light, WARNING.main),
//   error: createGradient(ERROR.light, ERROR.main),
// };

// const CHART_COLORS = {
//   violet: ['#826AF9', '#9E86FF', '#D0AEFF', '#F7D2FF'],
//   blue: ['#2D99FF', '#83CFFF', '#A5F3FF', '#CCFAFF'],
//   green: ['#2CD9C5', '#60F1C8', '#A4F7CC', '#C0F2DC'],
//   yellow: ['#FFE700', '#FFEF5A', '#FFF7AE', '#FFF3D6'],
//   red: ['#FF6C40', '#FF8F6D', '#FFBD98', '#FFF2D4'],
// };

// const COMMON = {
//   common: { black: '#000', white: '#fff' },
//   primary: { ...PRIMARY, contrastText: '#fff' },
//   secondary: { ...SECONDARY, contrastText: '#fff' },
//   info: { ...INFO, contrastText: '#fff' },
//   success: { ...SUCCESS, contrastText: GREY[800] },
//   warning: { ...WARNING, contrastText: GREY[800] },
//   error: { ...ERROR, contrastText: '#fff' },
//   grey: GREY,
//   gradients: GRADIENTS,
//   chart: CHART_COLORS,
//   divider: GREY[500_24],
//   action: {
//     hover: GREY[500_8],
//     selected: GREY[500_16],
//     disabled: GREY[500_80],
//     disabledBackground: GREY[500_24],
//     focus: GREY[500_24],
//     hoverOpacity: 0.08,
//     disabledOpacity: 0.48,
//   },
// };

// const palette = {
//   light: {
//     ...COMMON,
//     mode: 'light',
//     text: { primary: GREY[800], secondary: GREY[600], disabled: GREY[500] },
//     background: { paper: '#fff', default: '#fafbfb', neutral: GREY[200] },
//     action: { active: GREY[600], ...COMMON.action },
//   },
//   dark: {
//     ...COMMON,
//     mode: 'dark',
//     text: { primary: '#fff', secondary: GREY[500], disabled: GREY[600] },
//     background: { paper: GREY[800], default: GREY[900], neutral: GREY[500_16] },
//     action: { active: GREY[500], ...COMMON.action },
//   },
// } as const;

// export default palette;


import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

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

// SETUP COLORS
const PRIMARY = {
  lighter: '#D1EFFF',
  light: '#85C1FF',
  main: '#1A73E8',
  dark: '#0047BA',
  darker: '#002F7C',
};
const SECONDARY = {
  lighter: '#EDE7F6',
  light: '#D1C4E9',
  main: '#673AB7',
  dark: '#4527A0',
  darker: '#311B92',
};
const INFO = {
  lighter: '#E0F7FA',
  light: '#80DEEA',
  main: '#00ACC1',
  dark: '#00838F',
  darker: '#006064',
};
const SUCCESS = {
  lighter: '#E8F5E9',
  light: '#A5D6A7',
  main: '#4CAF50',
  dark: '#388E3C',
  darker: '#2E7D32',
};
const WARNING = {
  lighter: '#FFF3E0',
  light: '#FFCC80',
  main: '#FF9800',
  dark: '#F57C00',
  darker: '#E65100',
};
const ERROR = {
  lighter: '#FFEBEE',
  light: '#FFCDD2',
  main: '#E57373',
  dark: '#D32F2F',
  darker: '#B71C1C',
};

const GREY = {
  0: '#FFFFFF',
  100: '#F9FAFB',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#212B36',
  900: '#161C24',
  500_8: alpha('#919EAB', 0.08),
  500_12: alpha('#919EAB', 0.12),
  500_16: alpha('#919EAB', 0.16),
  500_24: alpha('#919EAB', 0.24),
  500_32: alpha('#919EAB', 0.32),
  500_48: alpha('#919EAB', 0.48),
  500_56: alpha('#919EAB', 0.56),
  500_80: alpha('#919EAB', 0.8),
};

const GRADIENTS = {
  primary: createGradient(PRIMARY.light, PRIMARY.main),
  info: createGradient(INFO.light, INFO.main),
  success: createGradient(SUCCESS.light, SUCCESS.main),
  warning: createGradient(WARNING.light, WARNING.main),
  error: createGradient(ERROR.light, ERROR.main),
};

const CHART_COLORS = {
  violet: ['#D1C4E9', '#B39DDB', '#9575CD', '#7E57C2'],
  blue: ['#BBDEFB', '#90CAF9', '#64B5F6', '#42A5F5'],
  green: ['#C8E6C9', '#A5D6A7', '#81C784', '#66BB6A'],
  yellow: ['#FFF9C4', '#FFF59D', '#FFF176', '#FFEE58'],
  red: ['#FFCDD2', '#EF9A9A', '#E57373', '#EF5350'],
};

const COMMON = {
  common: { black: '#000', white: '#fff' },
  primary: { ...PRIMARY, contrastText: '#fff' },
  secondary: { ...SECONDARY, contrastText: '#fff' },
  info: { ...INFO, contrastText: '#fff' },
  success: { ...SUCCESS, contrastText: GREY[800] },
  warning: { ...WARNING, contrastText: GREY[800] },
  error: { ...ERROR, contrastText: '#fff' },
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

const palette = {
  light: {
    ...COMMON,
    mode: 'light',
    text: { primary: GREY[800], secondary: GREY[600], disabled: GREY[500] },
    background: { paper: '#d4d4d8', default: '#f4f4f5', neutral: '#71717a' },
    action: { active: GREY[600], ...COMMON.action },
  },
  dark: {
    ...COMMON,
    mode: 'dark',
    text: { primary: '#fff', secondary: GREY[500], disabled: GREY[600] },
    background: { paper: '#3f3f46', default: '#09090b', neutral: '#18181b' },
    action: { active: GREY[500], ...COMMON.action },
  },
} as const;

export default palette;