import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../context/SettingsContext';

type Props = { title: string; actionLabel?: string; onActionPress?: () => void };

export default function SectionHeader({ title, actionLabel, onActionPress }: Props) {
    const { colors } = useTheme();

    return (
        <View style={styles.row}>
            <Text accessibilityRole="header" style={[styles.title, { color: colors.text }]}>
                {title}
            </Text>
            {actionLabel && onActionPress ? (
                <Pressable accessibilityRole="button" onPress={onActionPress} hitSlop={8}>
                    <Text style={[styles.action, { color: colors.primary }]}>{actionLabel}</Text>
                </Pressable>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        marginTop: 24,
        marginBottom: 12,
    },
    title: { fontSize: 20, fontWeight: '700' },
    action: { fontSize: 14, fontWeight: '700' },
});
