import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../context/SettingsContext';
import { IconName } from '../models/IoTModels';

type Props = { icon: IconName; title: string; message?: string };

export default function EmptyState({ icon, title, message }: Props) {
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            <Ionicons name={icon} size={40} color={colors.textMuted} />
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            {message ? <Text style={[styles.message, { color: colors.textMuted }]}>{message}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { alignItems: 'center', paddingVertical: 36, paddingHorizontal: 24, gap: 8 },
    title: { fontSize: 16, fontWeight: '700', textAlign: 'center' },
    message: { fontSize: 13, textAlign: 'center', lineHeight: 19 },
});
