import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text } from 'react-native';

import { useTheme } from '../context/SettingsContext';
import GatewayBanner from './GatewayBanner';

type Props = {
    title: string;
    subtitle?: string;
    onRefresh?: () => void;
    refreshing?: boolean;
    showGatewayBanner?: boolean;
    children: React.ReactNode;
};

export default function ScreenContainer({
    title,
    subtitle,
    onRefresh,
    refreshing = false,
    showGatewayBanner = true,
    children,
}: Props) {
    const { colors } = useTheme();

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: colors.background }}
            contentContainerStyle={styles.content}
            refreshControl={
                onRefresh ? (
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.primary}
                        colors={[colors.primary]}
                        progressBackgroundColor={colors.surface}
                    />
                ) : undefined
            }
        >
            <Text accessibilityRole="header" style={[styles.title, { color: colors.text }]}>
                {title}
            </Text>
            {subtitle ? <Text style={[styles.subtitle, { color: colors.textMuted }]}>{subtitle}</Text> : null}
            {showGatewayBanner ? <GatewayBanner /> : null}
            {children}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    content: { padding: 20, paddingBottom: 48 },
    title: { fontSize: 28, fontWeight: '800' },
    subtitle: { fontSize: 14, marginTop: 4, marginBottom: 20 },
});
