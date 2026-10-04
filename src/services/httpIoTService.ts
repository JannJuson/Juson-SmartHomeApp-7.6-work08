import { request } from './http';
import { toDevice, toSensorData } from './mappers';
import { IoTApi } from './types';

/**
 * Real backend implementation. Endpoints are documented in README.md.
 *
 *   GET   /sensors        -> { temperature, humidity, lightLevel }
 *   GET   /devices        -> [{ id, name, type, status }]
 *   PATCH /devices/:id    -> body { status } -> updated device
 *   GET   /gateway        -> { connected }
 */
export const httpIoTService: IoTApi = {
    async getSensorData() {
        return toSensorData(await request<unknown>('/sensors'));
    },

    async getDevices() {
        const raw = await request<unknown>('/devices');
        if (!Array.isArray(raw)) {
            throw new Error('The server sent an invalid device list.');
        }
        return raw.map(toDevice);
    },

    async updateDeviceStatus(id, status) {
        const raw = await request<unknown>(
            `/devices/${encodeURIComponent(id)}`,
            { method: 'PATCH', body: { status } }
        );
        return toDevice(raw);
    },

    async checkGateway() {
        const raw = await request<{ connected?: unknown } | null>('/gateway');
        return raw?.connected !== false;
    },
};
