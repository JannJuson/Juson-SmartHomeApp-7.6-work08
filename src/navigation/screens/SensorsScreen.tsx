import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Button from '../../components/Button';
import ErrorBanner from '../../components/ErrorBanner';
import ScreenContainer from '../../components/ScreenContainer';
import StatusPill from '../../components/StatusPill';
import { useIoT } from '../../context/IoTContext';
import { useTheme } from '../../context/SettingsContext';
import { sensorMeta } from '../../models/sensorMeta';
import { Colors, radius } from '../../theme/tokens';
import { useThemedStyles } from '../../theme/useThemedStyles';
import { formatTime } from '../../utils/format';

export default function SensorsScreen() {
    const { sensors, sensorsUpdatedAt, sensorsLoading, sensorError, gatewayConnected, refreshSensors } = useIoT();
    const { colors } = useTheme();
    const styles = useThemedStyles(createStyles);

    return (
        <ScreenContainer
            title="Sensors"
            subtitle="Monitor your environment"
            refreshing={sensorsLoading && sensors !== null}
            onRefresh={() => refreshSensors()}
        >
            <Button
                label={sensorsLoading ? 'Refreshing sensors…' : 'Refresh sensors'}
                icon="refresh-outline"
                loading={sensorsLoading}
                disabled={!gatewayConnected}
                onPress={() => refreshSensors()}
            />
            <Text style={styles.updated}>
                {sensorsUpdatedAt ? `Updated ${formatTime(sensorsUpdatedAt)}` : 'No readings yet'}
            </Text>

            {sensorError && !sensorsLoading ? (
                <ErrorBanner message={sensorError} onRetry={() => refreshSensors()} retryDisabled={!gatewayConnected} />
            ) : null}

            {sensorMeta.map((meta) => {
                const value = sensors ? sensors[meta.key] : null;
                const status = value !== null ? meta.status(value) : null;

                return (
                    <View key={meta.key} style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Ionicons name={meta.icon} size={26} color={colors.primary} />
                            <Text style={styles.name}>{meta.label}</Text>
                            {status ? <StatusPill label={status.label} tone={status.tone} /> : null}
                        </View>
                        <Text style={styles.value}>
                            {value ?? '--'}
                            <Text style={styles.unit}> {meta.unit}</Text>
                        </Text>
                        <Text style={styles.description}>{meta.description}</Text>
                    </View>
                );
            })}
        </ScreenContainer>
    );
}

const createStyles = (c: Colors) =>
    StyleSheet.create({
        updated: { fontSize: 12, marginTop: 8, marginBottom: 16, textAlign: 'center', color: c.textMuted },
        card: {
            padding: 18,
            marginBottom: 12,
            borderRadius: radius.md,
            backgroundColor: c.surface,
            borderWidth: 1,
            borderColor: c.border,
        },
        cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
        name: { flex: 1, fontSize: 17, fontWeight: '700', color: c.text },
        value: { fontSize: 38, fontWeight: '800', marginTop: 16, color: c.text },
        unit: { fontSize: 18, fontWeight: '600', color: c.textMuted },
        description: { fontSize: 13, marginTop: 4, color: c.textMuted },
    });
