import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';

import DeviceCard from '../../components/DeviceCard';
import EmptyState from '../../components/EmptyState';
import ErrorBanner from '../../components/ErrorBanner';
import ScreenContainer from '../../components/ScreenContainer';
import SectionHeader from '../../components/SectionHeader';
import StatusPill from '../../components/StatusPill';
import { useIoT } from '../../context/IoTContext';
import { useTheme } from '../../context/SettingsContext';
import { sensorMeta } from '../../models/sensorMeta';
import { Colors, radius } from '../../theme/tokens';
import { useThemedStyles } from '../../theme/useThemedStyles';
import { formatTime, getGreeting } from '../../utils/format';
import { DrawerParamList } from '../types';

const MAX_DEVICES = 4;

export default function DashboardScreen() {
    const {
        devices, sensors, sensorsUpdatedAt, sensorsLoading, sensorError,
        devicesLoading, devicesError, gatewayConnected, pendingDevices, deviceErrors,
        loadDevices, refreshSensors, toggleDevice, retryDevice,
    } = useIoT();

    const { colors } = useTheme();
    const styles = useThemedStyles(createStyles);
    const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();

    const onCount = devices.filter((d) => d.status).length;
    const summary =
        devices.length > 0
            ? `${onCount} of ${devices.length} devices on`
            : devicesLoading
              ? 'Loading your devices…'
              : 'No devices yet';

    const refreshing = (devicesLoading && devices.length > 0) || (sensorsLoading && sensors !== null);

    return (
        <ScreenContainer
            title={getGreeting()}
            subtitle={summary}
            refreshing={refreshing}
            onRefresh={() => {
                loadDevices();
                refreshSensors();
            }}
        >
            <SectionHeader title="Environment" actionLabel="See all" onActionPress={() => navigation.navigate('Sensors')} />

            {sensorError && !sensorsLoading ? (
                <ErrorBanner message={sensorError} onRetry={() => refreshSensors()} retryDisabled={!gatewayConnected} />
            ) : null}

            <View style={styles.sensorRow}>
                {sensorMeta.map((meta) => {
                    const value = sensors ? sensors[meta.key] : null;
                    const status = value !== null ? meta.status(value) : null;

                    return (
                        <View key={meta.key} style={styles.sensorTile}>
                            <Ionicons name={meta.icon} size={22} color={colors.primary} />
                            <Text style={styles.sensorLabel} numberOfLines={1}>{meta.label}</Text>
                            <Text style={styles.sensorValue}>
                                {value ?? '--'}
                                <Text style={styles.sensorUnit}> {meta.unit}</Text>
                            </Text>
                            {status ? <StatusPill label={status.label} tone={status.tone} /> : null}
                        </View>
                    );
                })}
            </View>
            {sensorsUpdatedAt ? <Text style={styles.updated}>Updated {formatTime(sensorsUpdatedAt)}</Text> : null}

            <SectionHeader
                title="Devices"
                actionLabel={devices.length > MAX_DEVICES ? `See all ${devices.length}` : 'See all'}
                onActionPress={() => navigation.navigate('Devices')}
            />

            {devicesLoading && devices.length === 0 ? <ActivityIndicator color={colors.primary} style={styles.loader} /> : null}

            {devicesError && !devicesLoading ? <ErrorBanner message={devicesError} onRetry={loadDevices} /> : null}

            {!devicesLoading && !devicesError && devices.length === 0 ? (
                <EmptyState icon="hardware-chip-outline" title="No devices yet" message="Devices connected to your gateway will show up here." />
            ) : null}

            {devices.slice(0, MAX_DEVICES).map((device) => (
                <DeviceCard
                    key={device.id}
                    device={device}
                    pending={!!pendingDevices[device.id]}
                    error={deviceErrors[device.id]?.message}
                    disabled={!gatewayConnected}
                    onToggle={(value) => toggleDevice(device.id, value)}
                    onRetry={() => retryDevice(device.id)}
                />
            ))}
        </ScreenContainer>
    );
}

const createStyles = (c: Colors) =>
    StyleSheet.create({
        sensorRow: { flexDirection: 'row', gap: 10 },
        sensorTile: {
            flex: 1,
            gap: 6,
            padding: 12,
            borderRadius: radius.md,
            backgroundColor: c.surface,
            borderWidth: 1,
            borderColor: c.border,
        },
        sensorLabel: { fontSize: 12, color: c.textMuted },
        sensorValue: { fontSize: 24, fontWeight: '800', color: c.text },
        sensorUnit: { fontSize: 13, fontWeight: '600', color: c.textMuted },
        updated: { fontSize: 12, marginTop: 8, color: c.textMuted },
        loader: { marginVertical: 24 },
    });
