import { Device, iconForType } from '../models/IoTModels';
import { IoTApi } from './types';

// Demo data used when no backend is configured.
// Set these to 0 while testing if you don't want random failures.
const SENSOR_FAILURE_RATE = 0.25;
const DEVICE_LOAD_FAILURE_RATE = 0.1;
const DEVICE_UPDATE_FAILURE_RATE = 0.25;

const delay = (ms: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, ms));

const shouldFail = (rate: number) => Math.random() < rate;

const randomBetween = (min: number, max: number) =>
    Math.round(min + Math.random() * (max - min));

const seed = [
    { id: '1', name: 'Living Room Light', type: 'Smart Light', status: true },
    { id: '2', name: 'Bedroom Fan', type: 'Smart Fan', status: false },
    { id: '3', name: 'Front Door Lock', type: 'Smart Lock', status: true },
    { id: '4', name: 'Office Air Conditioner', type: 'Smart Air Conditioner', status: false },
    { id: '5', name: 'Porch Camera', type: 'Smart Camera', status: true },
];

// Pretend this is the database on the IoT backend.
let deviceStore: Device[] = seed.map((device) => ({
    ...device,
    icon: iconForType(device.type),
}));

export const mockIoTService: IoTApi = {
    async getSensorData() {
        await delay(1500);

        if (shouldFail(SENSOR_FAILURE_RATE)) {
            throw new Error('Unable to retrieve sensor data.');
        }

        return {
            temperature: randomBetween(24, 34),
            humidity: randomBetween(40, 80),
            lightLevel: randomBetween(300, 900),
        };
    },

    async getDevices() {
        await delay(1000);

        if (shouldFail(DEVICE_LOAD_FAILURE_RATE)) {
            throw new Error('Unable to load devices.');
        }

        return deviceStore.map((device) => ({ ...device }));
    },

    async updateDeviceStatus(id, status) {
        await delay(1000);

        const device = deviceStore.find((item) => item.id === id);

        if (!device) {
            throw new Error('Device not found.');
        }

        if (shouldFail(DEVICE_UPDATE_FAILURE_RATE)) {
            throw new Error(`Unable to update ${device.name}.`);
        }

        deviceStore = deviceStore.map((item) =>
            item.id === id ? { ...item, status } : item
        );

        return { ...device, status };
    },

    async checkGateway() {
        await delay(800);
        return true;
    },
};
