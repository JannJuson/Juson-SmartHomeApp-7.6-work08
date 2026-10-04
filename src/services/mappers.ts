import { Device, SensorData, iconForType } from '../models/IoTModels';

// Backend JSON is untrusted. These mappers validate it so a malformed
// response becomes a readable error instead of NaN or a crash in the UI.

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}

export function toDevice(raw: unknown): Device {
    if (
        !isRecord(raw) ||
        (typeof raw.id !== 'string' && typeof raw.id !== 'number') ||
        typeof raw.name !== 'string' ||
        typeof raw.status !== 'boolean'
    ) {
        throw new Error('The server sent an invalid device.');
    }

    const type = typeof raw.type === 'string' ? raw.type : 'Device';

    return {
        id: String(raw.id),
        name: raw.name,
        type,
        icon: iconForType(type),
        status: raw.status,
    };
}

export function toSensorData(raw: unknown): SensorData {
    if (
        !isRecord(raw) ||
        typeof raw.temperature !== 'number' ||
        typeof raw.humidity !== 'number' ||
        typeof raw.lightLevel !== 'number' ||
        !Number.isFinite(raw.temperature) ||
        !Number.isFinite(raw.humidity) ||
        !Number.isFinite(raw.lightLevel)
    ) {
        throw new Error('The server sent invalid sensor data.');
    }

    return {
        temperature: raw.temperature,
        humidity: raw.humidity,
        lightLevel: raw.lightLevel,
    };
}
