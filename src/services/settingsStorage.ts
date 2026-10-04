import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'iot-home:settings:v1';

export type StoredSettings = {
    notifications: boolean;
    autoConnect: boolean;
    /** null means "follow the phone's appearance". */
    darkMode: boolean | null;
};

export async function loadSettings(): Promise<Partial<StoredSettings>> {
    try {
        const raw = await AsyncStorage.getItem(KEY);
        return raw ? (JSON.parse(raw) as Partial<StoredSettings>) : {};
    } catch {
        return {};
    }
}

export async function saveSettings(settings: StoredSettings): Promise<void> {
    try {
        await AsyncStorage.setItem(KEY, JSON.stringify(settings));
    } catch {
        // Losing a preference is not worth interrupting the user.
    }
}
