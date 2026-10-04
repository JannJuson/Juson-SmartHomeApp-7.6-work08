import React from 'react';
import { Switch, SwitchProps } from 'react-native';

import { useTheme } from '../context/SettingsContext';

export default function ThemedSwitch(props: SwitchProps) {
    const { colors } = useTheme();

    return (
        <Switch
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#FFFFFF"
            ios_backgroundColor={colors.border}
            {...props}
        />
    );
}
