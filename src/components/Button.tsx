import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../context/SettingsContext';
import { IconName } from '../models/IoTModels';
import { radius } from '../theme/tokens';

type Props = {
    label: string;
    onPress: () => void;
    variant?: 'primary' | 'danger' | 'outline';
    size?: 'sm' | 'md';
    loading?: boolean;
    disabled?: boolean;
    icon?: IconName;
};

export default function Button({
    label,
    onPress,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    icon,
}: Props) {
    const { colors } = useTheme();
    const isDisabled = disabled || loading;

    const background =
        variant === 'primary' ? colors.primary : variant === 'danger' ? colors.danger : 'transparent';
    const foreground =
        variant === 'primary' ? colors.onPrimary : variant === 'danger' ? colors.onDanger : colors.text;
    const border = variant === 'outline' ? colors.border : background;

    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={label}
            accessibilityState={{ disabled: isDisabled, busy: loading }}
            disabled={isDisabled}
            onPress={onPress}
            style={({ pressed }) => [
                styles.base,
                size === 'sm' ? styles.small : styles.medium,
                {
                    backgroundColor: background,
                    borderColor: border,
                    opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1,
                },
            ]}
        >
            {loading ? (
                <ActivityIndicator size="small" color={foreground} />
            ) : icon ? (
                <Ionicons name={icon} size={18} color={foreground} />
            ) : null}
            <Text style={{ color: foreground, fontWeight: '700', fontSize: size === 'sm' ? 13 : 15 }}>
                {label}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 1,
        borderRadius: radius.sm,
    },
    small: { paddingVertical: 7, paddingHorizontal: 14 },
    medium: { paddingVertical: 13, paddingHorizontal: 18 },
});
