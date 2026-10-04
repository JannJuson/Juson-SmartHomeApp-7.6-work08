import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
    DrawerContentComponentProps,
    DrawerContentScrollView,
    DrawerItemList,
} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

import { useIoT } from '../context/IoTContext';
import { useTheme } from '../context/SettingsContext';

export default function CustomDrawerContent(props: DrawerContentComponentProps) {
    const { colors } = useTheme();
    const { gatewayStatus } = useIoT();

    const statusColor =
        gatewayStatus === 'connected' ? colors.success : gatewayStatus === 'connecting' ? colors.warning : colors.danger;
    const statusLabel =
        gatewayStatus === 'connected'
            ? 'Gateway connected'
            : gatewayStatus === 'connecting'
              ? 'Connecting to gateway…'
              : 'Gateway disconnected';

    return (
        <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <View style={[styles.logo, { backgroundColor: colors.accent }]}>
                    <Ionicons name="hardware-chip-outline" size={30} color={colors.onAccent} />
                </View>
                <Text style={[styles.title, { color: colors.text }]}>IoT Home</Text>
                <Text style={[styles.subtitle, { color: colors.textMuted }]}>Smart Environment</Text>
            </View>

            <View style={styles.menu}>
                <DrawerItemList {...props} />
            </View>

            <View style={styles.footer}>
                <View style={[styles.dot, { backgroundColor: statusColor }]} />
                <Text style={[styles.footerText, { color: colors.textMuted }]}>{statusLabel}</Text>
            </View>
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1 },
    header: { padding: 20, alignItems: 'center' },
    logo: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    title: { fontSize: 22, fontWeight: '800' },
    subtitle: { fontSize: 13, marginTop: 4 },
    menu: { marginTop: 10, flex: 1 },
    footer: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 20 },
    dot: { width: 8, height: 8, borderRadius: 4 },
    footerText: { fontSize: 13, fontWeight: '600' },
});
