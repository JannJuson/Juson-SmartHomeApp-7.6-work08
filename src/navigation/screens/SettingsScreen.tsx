import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Button from '../../components/Button';
import ScreenContainer from '../../components/ScreenContainer';
import SectionHeader from '../../components/SectionHeader';
import ThemedSwitch from '../../components/ThemedSwitch';
import { API_BASE_URL, USE_MOCK } from '../../config';
import { useIoT } from '../../context/IoTContext';
import { useSettings, useTheme } from '../../context/SettingsContext';
import { IconName } from '../../models/IoTModels';
import { Colors, radius } from '../../theme/tokens';
import { useThemedStyles } from '../../theme/useThemedStyles';

function Row({ icon, title, description, children }: {
    icon: IconName;
    title: string;
    description: string;
    children?: React.ReactNode;
}) {
    const { colors } = useTheme();
    const styles = useThemedStyles(createStyles);

    return (
        <View style={styles.card}>
            <Ionicons name={icon} size={26} color={colors.primary} />
            <View style={styles.text}>
                <Text style={styles.name}>{title}</Text>
                <Text style={styles.description}>{description}</Text>
            </View>
            {children}
        </View>
    );
}

export default function SettingsScreen() {
    const { notifications, setNotifications, autoConnect, setAutoConnect, darkMode, setDarkMode } = useSettings();
    const { gatewayStatus, gatewayError, connectGateway, disconnectGateway } = useIoT();

    const connected = gatewayStatus === 'connected';
    const connecting = gatewayStatus === 'connecting';

    const gatewayDescription = connecting
        ? 'Connecting…'
        : connected
          ? 'Connected'
          : gatewayError
            ? `Disconnected. ${gatewayError}`
            : 'Disconnected';

    return (
        <ScreenContainer title="Settings" subtitle="Configure your IoT application" showGatewayBanner={false}>
            <SectionHeader title="General" />

            <Row icon="notifications-outline" title="Notifications" description="Receive alerts from your IoT devices">
                <ThemedSwitch value={notifications} onValueChange={setNotifications} accessibilityLabel="Notifications" />
            </Row>
            <Row icon="wifi-outline" title="Auto connect" description="Connect to the IoT gateway when the app opens">
                <ThemedSwitch value={autoConnect} onValueChange={setAutoConnect} accessibilityLabel="Auto connect" />
            </Row>
            <Row icon="moon-outline" title="Dark mode" description="Use a darker application appearance">
                <ThemedSwitch value={darkMode} onValueChange={setDarkMode} accessibilityLabel="Dark mode" />
            </Row>

            <SectionHeader title="Connection" />

            <Row
                icon={connected ? 'cloud-done-outline' : 'cloud-offline-outline'}
                title="IoT Gateway"
                description={gatewayDescription}
            >
                <Button
                    size="sm"
                    variant={connected ? 'outline' : 'primary'}
                    label={connected ? 'Disconnect' : 'Connect'}
                    loading={connecting}
                    onPress={connected ? disconnectGateway : connectGateway}
                />
            </Row>

            <Row
                icon="server-outline"
                title="Data source"
                description={USE_MOCK ? 'Demo data. Set EXPO_PUBLIC_API_URL to use your backend.' : API_BASE_URL}
            />
        </ScreenContainer>
    );
}

const createStyles = (c: Colors) =>
    StyleSheet.create({
        card: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            padding: 16,
            marginBottom: 12,
            borderRadius: radius.md,
            backgroundColor: c.surface,
            borderWidth: 1,
            borderColor: c.border,
        },
        text: { flex: 1 },
        name: { fontSize: 16, fontWeight: '700', color: c.text },
        description: { fontSize: 12, marginTop: 3, color: c.textMuted },
    });
