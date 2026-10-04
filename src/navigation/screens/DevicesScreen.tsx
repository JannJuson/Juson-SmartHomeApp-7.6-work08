import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import DeviceCard from '../../components/DeviceCard';
import EmptyState from '../../components/EmptyState';
import ErrorBanner from '../../components/ErrorBanner';
import ScreenContainer from '../../components/ScreenContainer';
import { useIoT } from '../../context/IoTContext';
import { useTheme } from '../../context/SettingsContext';
import { Colors, radius } from '../../theme/tokens';
import { useThemedStyles } from '../../theme/useThemedStyles';

type Filter = 'all' | 'on' | 'off';

export default function DevicesScreen() {
    const {
        devices, gatewayConnected, devicesLoading, devicesError,
        pendingDevices, deviceErrors, loadDevices, toggleDevice, retryDevice,
    } = useIoT();

    const { colors } = useTheme();
    const styles = useThemedStyles(createStyles);
    const [filter, setFilter] = useState<Filter>('all');

    const onCount = devices.filter((d) => d.status).length;
    const counts: Record<Filter, number> = { all: devices.length, on: onCount, off: devices.length - onCount };
    const visible = devices.filter((d) => (filter === 'all' ? true : filter === 'on' ? d.status : !d.status));

    return (
        <ScreenContainer
            title="Devices"
            subtitle="Control your connected devices"
            refreshing={devicesLoading && devices.length > 0}
            onRefresh={loadDevices}
        >
            {devices.length > 0 ? (
                <View style={styles.filters} accessibilityRole="tablist">
                    {(['all', 'on', 'off'] as Filter[]).map((key) => {
                        const selected = filter === key;
                        return (
                            <Pressable
                                key={key}
                                accessibilityRole="tab"
                                accessibilityState={{ selected }}
                                onPress={() => setFilter(key)}
                                style={[styles.filter, selected && styles.filterSelected]}
                            >
                                <Text style={[styles.filterText, selected && styles.filterTextSelected]}>
                                    {key === 'all' ? 'All' : key === 'on' ? 'On' : 'Off'} {counts[key]}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>
            ) : null}

            {devicesLoading && devices.length === 0 ? <ActivityIndicator color={colors.primary} style={styles.loader} /> : null}

            {devicesError && !devicesLoading ? <ErrorBanner message={devicesError} onRetry={loadDevices} /> : null}

            {!devicesLoading && !devicesError && devices.length === 0 ? (
                <EmptyState icon="hardware-chip-outline" title="No devices yet" message="Devices connected to your gateway will show up here. Pull down to refresh." />
            ) : null}

            {devices.length > 0 && visible.length === 0 ? (
                <EmptyState icon="funnel-outline" title={filter === 'on' ? 'Nothing is on' : 'Nothing is off'} message="Switch the filter to see your other devices." />
            ) : null}

            {visible.map((device) => (
                <DeviceCard
                    key={device.id}
                    device={device}
                    showType
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
        filters: { flexDirection: 'row', gap: 8, marginBottom: 16 },
        filter: {
            paddingVertical: 7,
            paddingHorizontal: 14,
            borderRadius: radius.pill,
            borderWidth: 1,
            borderColor: c.border,
            backgroundColor: c.surface,
        },
        filterSelected: { backgroundColor: c.primary, borderColor: c.primary },
        filterText: { fontSize: 13, fontWeight: '700', color: c.textMuted },
        filterTextSelected: { color: c.onPrimary },
        loader: { marginVertical: 24 },
    });
