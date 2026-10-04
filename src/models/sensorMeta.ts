import { IconName, SensorData } from './IoTModels';

export type Tone = 'ok' | 'warning' | 'alert' | 'neutral';

export type SensorMeta = {
    key: keyof SensorData;
    label: string;
    unit: string;
    icon: IconName;
    description: string;
    status: (value: number) => { label: string; tone: Tone };
};

export const sensorMeta: SensorMeta[] = [
    {
        key: 'temperature',
        label: 'Temperature',
        unit: '°C',
        icon: 'thermometer-outline',
        description: 'Current room temperature',
        status: (v) =>
            v < 18
                ? { label: 'Cool', tone: 'warning' }
                : v <= 27
                  ? { label: 'Comfortable', tone: 'ok' }
                  : v <= 32
                    ? { label: 'Warm', tone: 'warning' }
                    : { label: 'Hot', tone: 'alert' },
    },
    {
        key: 'humidity',
        label: 'Humidity',
        unit: '%',
        icon: 'water-outline',
        description: 'Current relative humidity',
        status: (v) =>
            v < 30
                ? { label: 'Dry', tone: 'warning' }
                : v <= 60
                  ? { label: 'Comfortable', tone: 'ok' }
                  : v <= 70
                    ? { label: 'Humid', tone: 'warning' }
                    : { label: 'Very humid', tone: 'alert' },
    },
    {
        key: 'lightLevel',
        label: 'Light level',
        unit: 'lux',
        icon: 'sunny-outline',
        description: 'Current ambient light',
        status: (v) =>
            v < 100
                ? { label: 'Dark', tone: 'neutral' }
                : v < 300
                  ? { label: 'Dim', tone: 'neutral' }
                  : v <= 700
                    ? { label: 'Bright', tone: 'neutral' }
                    : { label: 'Very bright', tone: 'neutral' },
    },
];
