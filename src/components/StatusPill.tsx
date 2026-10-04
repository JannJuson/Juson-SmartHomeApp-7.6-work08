import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../context/SettingsContext';
import { Tone } from '../models/sensorMeta';
import { radius } from '../theme/tokens';

export default function StatusPill({ label, tone }: { label: string; tone: Tone }) {
    const { colors } = useTheme();

    const color =
        tone === 'ok'
            ? colors.success
            : tone === 'warning'
              ? colors.warning
              : tone === 'alert'
                ? colors.danger
                : colors.textMuted;

    return (
        <View style={[styles.pill, { backgroundColor: `${color}24` }]}>
            <View style={[styles.dot, { backgroundColor: color }]} />
            <Text style={[styles.text, { color }]}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        alignSelf: 'flex-start',
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: radius.pill,
    },
    dot: { width: 6, height: 6, borderRadius: 3 },
    text: { fontSize: 11, fontWeight: '700' },
});
