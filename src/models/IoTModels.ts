import { Ionicons } from '@expo/vector-icons';

export type IconName = keyof typeof Ionicons.glyphMap;

export type Device = {
    id: string;
    name: string;
    type: string;
    icon: IconName;
    status: boolean;
};

export type SensorData = {
    temperature: number;
    humidity: number;
    lightLevel: number;
};

// The backend only sends a device `type`; the app decides which icon to show.
const ICONS_BY_TYPE: [keyword: string, icon: IconName][] = [
    ['light', 'bulb-outline'],
    ['fan', 'sync-outline'],
    ['lock', 'lock-closed-outline'],
    ['air', 'snow-outline'],
    ['tv', 'tv-outline'],
    ['camera', 'videocam-outline'],
    ['plug', 'flash-outline'],
    ['outlet', 'flash-outline'],
];

export function iconForType(type: string): IconName {
    const value = type.toLowerCase();
    const match = ICONS_BY_TYPE.find(([keyword]) => value.includes(keyword));
    return match ? match[1] : 'hardware-chip-outline';
}

const isLock = (device: Device) => /lock/i.test(device.type);

/** Locks read "Locked / Unlocked"; everything else reads "On / Off". */
export function deviceStateLabel(device: Device): string {
    if (isLock(device)) return device.status ? 'Locked' : 'Unlocked';
    return device.status ? 'On' : 'Off';
}

export function deviceIcon(device: Device): IconName {
    if (isLock(device) && !device.status) return 'lock-open-outline';
    return device.icon;
}
