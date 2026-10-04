import React, { useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import { DarkTheme, DefaultTheme, NavigationContainer, Theme } from '@react-navigation/native';

import { IoTProvider } from './src/context/IoTContext';
import { SettingsProvider, useTheme } from './src/context/SettingsContext';
import DrawerNavigator from './src/navigation/DrawerNavigator';

function Root() {
    const { colors, isDark } = useTheme();

    const navigationTheme = useMemo<Theme>(
        () => ({
            ...(isDark ? DarkTheme : DefaultTheme),
            colors: {
                primary: colors.primary,
                background: colors.background,
                card: colors.surface,
                text: colors.text,
                border: colors.border,
                notification: colors.danger,
            },
        }),
        [colors, isDark]
    );

    return (
        <>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <NavigationContainer theme={navigationTheme}>
                <DrawerNavigator />
            </NavigationContainer>
        </>
    );
}

export default function App() {
    return (
        <SettingsProvider>
            <IoTProvider>
                <Root />
            </IoTProvider>
        </SettingsProvider>
    );
}
