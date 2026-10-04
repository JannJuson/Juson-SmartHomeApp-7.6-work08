import { USE_MOCK } from '../config';
import { httpIoTService } from './httpIoTService';
import { mockIoTService } from './mockIoTService';
import { IoTApi } from './types';

// The only place that decides between demo data and the real backend.
const api: IoTApi = USE_MOCK ? mockIoTService : httpIoTService;

export const getSensorData = () => api.getSensorData();
export const getDevices = () => api.getDevices();
export const updateDeviceStatus = (id: string, status: boolean) =>
    api.updateDeviceStatus(id, status);
export const checkGateway = () => api.checkGateway();
