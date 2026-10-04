import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../context/SettingsContext';
import { Device, deviceIcon, deviceStateLabel } from '../models/IoTModels';
import { radius } from '../theme/tokens';
import { useThemedStyles } from '../theme/useThemedStyles';
import { Colors } from '../theme/tokens';
import ErrorBanner from './ErrorBanner';
import ThemedSwitch from './ThemedSwitch';

type Props = {
    device: Device;
    pending: boolean;
    error?: string;
    disabled: boolean;
    showType?: boolean;
    onToggle: (value: boolean) => void;
    onRetry: () => void;
};

export default function DeviceCard({ device, pending, error, disabled, showType = false, onToggle, onRetry }: Props) {
    const { colors } = useTheme();
    const styles = useThemedStyles(createStyles);
    const state = deviceStateLabel(device);

    return (
        <View style={styles.wrapper}>
            <View style={styles.card}>
                <View style={[styles.medallion, device.status && styles.medallionOn]}>
                    <Ionicons
                        name={deviceIcon(device)}
                        size={24}
                        color={device.status ? colors.onAccent : colors.textMuted}
                    />
                </View>

                <View style={styles.details}>
                    <Text style={styles.name} numberOfLines={1}>
                        {device.name}
                    </Text>
                    {showType ? <Text style={styles.type}>{device.type}</Text> : null}
                    <Text style={[styles.state, device.status && !pending && styles.stateOn]}>
                        {pending ? 'Updating…' : state}
                    </Text>
                </View>

                <ThemedSwitch
                    value={device.status}
                    disabled={disabled || pending}
                    onValueChange={onToggle}
                    accessibilityLabel={`${device.name}, ${state}`}
                />
            </View>

            {error ? (
                <ErrorBanner
                    message={error}
                    onRetry={onRetry}
                    retryDisabled={disabled}
                    style={{ marginTop: 8, marginBottom: 0 }}
                />
            ) : null}
        </View>
    );
}

const createStyles = (c: Colors) =>
    StyleSheet.create({
        wrapper: { marginBottom: 12 },
        card: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            padding: 14,
            borderRadius: radius.md,
            backgroundColor: c.surface,
            borderWidth: 1,
            borderColor: c.border,
        },
        medallion: {
            width: 46,
            height: 46,
            borderRadius: 23,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: c.surfaceAlt,
        },
        medallionOn: {
            backgroundColor: c.accent,
            shadowColor: c.accent,
            shadowOpacity: 0.55,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 0 },
        },
        details: { flex: 1 },
        name: { fontSize: 16, fontWeight: '700', color: c.text },
        type: { fontSize: 13, marginTop: 2, color: c.textMuted },
        state: { fontSize: 13, marginTop: 3, color: c.textMuted },
        stateOn: { color: c.text, fontWeight: '700' },
    });
