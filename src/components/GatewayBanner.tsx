import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useIoT } from '../context/IoTContext';
import { useTheme } from '../context/SettingsContext';
import { radius } from '../theme/tokens';
import Button from './Button';

export default function GatewayBanner() {
    const { gatewayStatus, gatewayError, connectGateway } = useIoT();
    const { colors } = useTheme();

    if (gatewayStatus === 'connected') return null;

    if (gatewayStatus === 'connecting') {
        return (
            <View style={[styles.banner, { backgroundColor: colors.surfaceAlt }]}>
                <ActivityIndicator color={colors.primary} />
                <Text style={[styles.title, { color: colors.text }]}>Connecting to the gateway…</Text>
            </View>
        );
    }

    return (
        <View accessibilityRole="alert" style={[styles.banner, { backgroundColor: colors.dangerBg }]}>
            <Ionicons name="cloud-offline-outline" size={22} color={colors.danger} />
            <View style={styles.textColumn}>
                <Text style={[styles.title, { color: colors.danger }]}>IoT Gateway is disconnected</Text>
                <Text style={[styles.body, { color: colors.danger }]}>
                    {gatewayError ?? 'Live readings and device controls are paused.'}
                </Text>
            </View>
            <Button label="Connect" size="sm" variant="danger" onPress={connectGateway} />
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
        marginBottom: 16,
    },
    textColumn: { flex: 1 },
    title: { fontSize: 14, fontWeight: '700' },
    body: { fontSize: 12, marginTop: 2 },
});
