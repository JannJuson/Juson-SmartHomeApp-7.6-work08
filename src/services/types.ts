import { Device, SensorData } from '../models/IoTModels';

/**
 * The contract between the app and an IoT backend.
 * mockIoTService and httpIoTService both implement it, so screens and
 * context never care which one is running.
 */
export interface IoTApi {
    getSensorData(): Promise<SensorData>;
    getDevices(): Promise<Device[]>;
    updateDeviceStatus(id: string, status: boolean): Promise<Device>;
    /** Resolves true when the gateway is reachable. */
    checkGateway(): Promise<boolean>;
}
