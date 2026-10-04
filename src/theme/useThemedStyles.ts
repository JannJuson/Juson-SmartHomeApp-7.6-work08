import { useMemo } from 'react';

import { useTheme } from '../context/SettingsContext';
import { Colors } from './tokens';

/**
 * Builds a StyleSheet from the current colours. Pass a factory that is
 * defined at module level so it stays stable between renders.
 */
export function useThemedStyles<T>(factory: (colors: Colors) => T): T {
    const { colors } = useTheme();
    return useMemo(() => factory(colors), [factory, colors]);
}
