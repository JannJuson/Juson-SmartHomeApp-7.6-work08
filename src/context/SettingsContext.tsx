import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { useColorScheme } from 'react-native';

import { loadSettings, saveSettings } from '../services/settingsStorage';
import { Colors, darkColors, lightColors } from '../theme/tokens';

type SettingsContextType = {
    notifications: boolean;
    setNotifications: (value: boolean) => void;
    autoConnect: boolean;
    setAutoConnect: (value: boolean) => void;
    darkMode: boolean;
    setDarkMode: (value: boolean) => void;
    colors: Colors;
};

const SettingsContext = createContext<SettingsContextType | undefined>(
    undefined
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const systemScheme = useColorScheme();

    const [ready, setReady] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [autoConnect, setAutoConnect] = useState(true);
    // null = follow the phone until the user picks one
    const [darkOverride, setDarkOverride] = useState<boolean | null>(null);

    useEffect(() => {
        loadSettings().then((stored) => {
            if (typeof stored.notifications === 'boolean') {
                setNotifications(stored.notifications);
            }
            if (typeof stored.autoConnect === 'boolean') {
                setAutoConnect(stored.autoConnect);
            }
            if (typeof stored.darkMode === 'boolean') {
                setDarkOverride(stored.darkMode);
            }
            setReady(true);
        });
    }, []);

    useEffect(() => {
        if (!ready) return;
        saveSettings({ notifications, autoConnect, darkMode: darkOverride });
    }, [ready, notifications, autoConnect, darkOverride]);

    const darkMode = darkOverride ?? systemScheme === 'dark';

    const value = useMemo<SettingsContextType>(
        () => ({
            notifications,
            setNotifications,
            autoConnect,
            setAutoConnect,
            darkMode,
            setDarkMode: setDarkOverride,
            colors: darkMode ? darkColors : lightColors,
        }),
        [notifications, autoConnect, darkMode]
    );

    // Wait for stored settings so the first frame uses the right theme
    // and the gateway auto-connect decision is based on the saved value.
    if (!ready) return null;

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);

    if (!context) {
        throw new Error('useSettings must be used inside SettingsProvider');
    }

    return context;
}

export function useTheme() {
    const { colors, darkMode } = useSettings();
    return { colors, isDark: darkMode };
}
