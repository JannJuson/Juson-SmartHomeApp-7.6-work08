import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../context/SettingsContext';
import { radius } from '../theme/tokens';
import Button from './Button';

type Props = {
    message: string;
    onRetry?: () => void;
    retryDisabled?: boolean;
    style?: StyleProp<ViewStyle>;
};

export default function ErrorBanner({ message, onRetry, retryDisabled, style }: Props) {
    const { colors } = useTheme();

    return (
        <View
            accessibilityRole="alert"
            style={[styles.banner, { backgroundColor: colors.dangerBg }, style]}
        >
            <Ionicons name="alert-circle-outline" size={22} color={colors.danger} />
            <Text style={[styles.text, { color: colors.danger }]}>{message}</Text>
            {onRetry ? (
                <Button label="Retry" size="sm" variant="danger" onPress={onRetry} disabled={retryDisabled} />
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    banner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 12,
        borderRadius: radius.sm,
        marginBottom: 12,
    },
    text: { flex: 1, fontSize: 13, fontWeight: '600' },
});
