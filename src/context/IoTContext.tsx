import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';

import { SENSOR_POLL_INTERVAL_MS } from '../config';
import { Device, SensorData } from '../models/IoTModels';
import * as IoTService from '../services/IoTServices';
import { useSettings } from './SettingsContext';

export type GatewayStatus = 'connected' | 'connecting' | 'disconnected';

export type DeviceError = {
    message: string;
    value: boolean; // the state the user tried to set, used by Retry
};

type IoTContextType = {
    // Data
    devices: Device[];
    sensors: SensorData | null; // null until the first reading arrives
    sensorsUpdatedAt: Date | null;

    // Gateway
    gatewayStatus: GatewayStatus;
    gatewayConnected: boolean;
    gatewayError: string | null;
    connectGateway: () => Promise<void>;
    disconnectGateway: () => void;

    // Loading states
    devicesLoading: boolean;
    sensorsLoading: boolean;
    pendingDevices: Record<string, boolean>;

    // Error states
    devicesError: string | null;
    sensorError: string | null;
    deviceErrors: Record<string, DeviceError>;

    // Actions
    loadDevices: () => Promise<void>;
    refreshSensors: (options?: { silent?: boolean }) => Promise<void>;
    toggleDevice: (id: string, value: boolean) => Promise<void>;
    retryDevice: (id: string) => Promise<void>;
};

const IoTContext = createContext<IoTContextType | undefined>(undefined);

const messageOf = (error: unknown, fallback: string) =>
    error instanceof Error && error.message ? error.message : fallback;

export function IoTProvider({ children }: { children: React.ReactNode }) {
    const { autoConnect } = useSettings();

    const [devices, setDevices] = useState<Device[]>([]);
    const [sensors, setSensors] = useState<SensorData | null>(null);
    const [sensorsUpdatedAt, setSensorsUpdatedAt] = useState<Date | null>(null);

    const [gatewayStatus, setGatewayStatus] = useState<GatewayStatus>(
        autoConnect ? 'connecting' : 'disconnected'
    );
    const [gatewayError, setGatewayError] = useState<string | null>(null);

    const [devicesLoading, setDevicesLoading] = useState(false);
    const [sensorsLoading, setSensorsLoading] = useState(false);
    const [pendingDevices, setPendingDevices] = useState<Record<string, boolean>>({});

    const [devicesError, setDevicesError] = useState<string | null>(null);
    const [sensorError, setSensorError] = useState<string | null>(null);
    const [deviceErrors, setDeviceErrors] = useState<Record<string, DeviceError>>({});

    const gatewayConnected = gatewayStatus === 'connected';

    // Refs let stable callbacks see the latest values without re-creating.
    const gatewayRef = useRef(gatewayConnected);
    gatewayRef.current = gatewayConnected;
    const sensorsInFlight = useRef(false);

    const connectGateway = useCallback(async () => {
        setGatewayStatus('connecting');
        setGatewayError(null);

        try {
            const reachable = await IoTService.checkGateway();
            if (reachable) {
                setGatewayStatus('connected');
            } else {
                setGatewayStatus('disconnected');
                setGatewayError('The gateway is not responding.');
            }
        } catch (error) {
            setGatewayStatus('disconnected');
            setGatewayError(messageOf(error, 'Unable to reach the gateway.'));
        }
    }, []);

    const disconnectGateway = useCallback(() => {
        setGatewayStatus('disconnected');
        setGatewayError(null);
    }, []);

    const loadDevices = useCallback(async () => {
        setDevicesLoading(true);
        setDevicesError(null);

        try {
            setDevices(await IoTService.getDevices());
        } catch (error) {
            setDevicesError(messageOf(error, 'Unable to load devices.'));
        } finally {
            setDevicesLoading(false);
        }
    }, []);

    const refreshSensors = useCallback(
        async ({ silent = false }: { silent?: boolean } = {}) => {
            if (!gatewayRef.current || sensorsInFlight.current) return;
            sensorsInFlight.current = true;

            // Background polls stay quiet; only user-triggered refreshes
            // show a spinner or an error.
            if (!silent) {
                setSensorsLoading(true);
                setSensorError(null);
            }

            try {
                setSensors(await IoTService.getSensorData());
                setSensorsUpdatedAt(new Date());
                setSensorError(null);
            } catch (error) {
                if (!silent) {
                    setSensorError(
                        messageOf(error, 'Unable to retrieve sensor data.')
                    );
                }
            } finally {
                sensorsInFlight.current = false;
                if (!silent) setSensorsLoading(false);
            }
        },
        []
    );

    const setDeviceStatusLocal = useCallback((id: string, status: boolean) => {
        setDevices((current) =>
            current.map((device) =>
                device.id === id ? { ...device, status } : device
            )
        );
    }, []);

    const toggleDevice = useCallback(
        async (id: string, value: boolean) => {
            if (!gatewayRef.current) return;

            // Clear any old error for this device
            setDeviceErrors((current) => {
                const { [id]: _removed, ...rest } = current;
                return rest;
            });

            // Show the new state immediately (optimistic update)
            setDeviceStatusLocal(id, value);
            setPendingDevices((current) => ({ ...current, [id]: true }));

            try {
                const updated = await IoTService.updateDeviceStatus(id, value);
                setDeviceStatusLocal(id, updated.status);
            } catch (error) {
                // The command failed, so put the switch back
                setDeviceStatusLocal(id, !value);
                setDeviceErrors((current) => ({
                    ...current,
                    [id]: {
                        message: messageOf(error, 'Unable to update device.'),
                        value,
                    },
                }));
            } finally {
                setPendingDevices((current) => ({ ...current, [id]: false }));
            }
        },
        [setDeviceStatusLocal]
    );

    const retryDevice = useCallback(
        async (id: string) => {
            const failed = deviceErrors[id];
            if (failed) {
                await toggleDevice(id, failed.value);
            }
        },
        [deviceErrors, toggleDevice]
    );

    // On launch: load devices, and connect to the gateway if the user wants that.
    useEffect(() => {
        loadDevices();
        if (autoConnect) connectGateway();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetch readings as soon as the gateway connects...
    useEffect(() => {
        if (gatewayConnected) refreshSensors();
    }, [gatewayConnected, refreshSensors]);

    // ...and keep them fresh while it stays connected.
    useEffect(() => {
        if (!gatewayConnected) return;

        const timer = setInterval(
            () => refreshSensors({ silent: true }),
            SENSOR_POLL_INTERVAL_MS
        );

        return () => clearInterval(timer);
    }, [gatewayConnected, refreshSensors]);

    return (
        <IoTContext.Provider
            value={{
                devices,
                sensors,
                sensorsUpdatedAt,
                gatewayStatus,
                gatewayConnected,
                gatewayError,
                connectGateway,
                disconnectGateway,
                devicesLoading,
                sensorsLoading,
                pendingDevices,
                devicesError,
                sensorError,
                deviceErrors,
                loadDevices,
                refreshSensors,
                toggleDevice,
                retryDevice,
            }}
        >
            {children}
        </IoTContext.Provider>
    );
}

export function useIoT() {
    const context = useContext(IoTContext);

    if (!context) {
        throw new Error('useIoT must be used inside IoTProvider');
    }

    return context;
}
