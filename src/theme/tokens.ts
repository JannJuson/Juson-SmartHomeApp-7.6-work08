export type Colors = {
    background: string;
    surface: string;
    surfaceAlt: string;
    border: string;
    text: string;
    textMuted: string;
    primary: string;
    onPrimary: string;
    /** The warm "light is on" colour. Used for active device icons. */
    accent: string;
    onAccent: string;
    success: string;
    warning: string;
    danger: string;
    onDanger: string;
    dangerBg: string;
};

export const lightColors: Colors = {
    background: '#F2F4F2',
    surface: '#FFFFFF',
    surfaceAlt: '#E8EDEB',
    border: '#DCE3E0',
    text: '#12201F',
    textMuted: '#5A6B6D',
    primary: '#1E7A72',
    onPrimary: '#FFFFFF',
    accent: '#F0B040',
    onAccent: '#3A2703',
    success: '#17734A',
    warning: '#8A5A00',
    danger: '#B3261E',
    onDanger: '#FFFFFF',
    dangerBg: '#FCE8E6',
};

export const darkColors: Colors = {
    background: '#0E1315',
    surface: '#161E21',
    surfaceAlt: '#1F2B2F',
    border: '#2A3A40',
    text: '#E9EFF0',
    textMuted: '#93A7AD',
    primary: '#4FB3A9',
    onPrimary: '#06201D',
    accent: '#F2B24C',
    onAccent: '#2A1E05',
    success: '#5CCB94',
    warning: '#F2B24C',
    danger: '#FF7A70',
    onDanger: '#2B0B09',
    dangerBg: '#3A1D1B',
};

export const radius = { sm: 8, md: 14, pill: 999 };
