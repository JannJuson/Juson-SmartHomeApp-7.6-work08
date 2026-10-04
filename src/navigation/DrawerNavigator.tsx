import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../context/SettingsContext';
import { IconName } from '../models/IoTModels';
import CustomDrawerContent from './CustomDrawerContent';
import DashboardScreen from './screens/DashboardScreen';
import DevicesScreen from './screens/DevicesScreen';
import SensorsScreen from './screens/SensorsScreen';
import SettingsScreen from './screens/SettingsScreen';
import { DrawerParamList } from './types';

const Drawer = createDrawerNavigator<DrawerParamList>();

const icon =
    (name: IconName) =>
    ({ color, size }: { color: string; size: number }) => (
        <Ionicons name={name} size={size} color={color} />
    );

export default function DrawerNavigator() {
    const { colors } = useTheme();

    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerShadowVisible: false,
                headerTitleStyle: { fontWeight: '700' },
                drawerActiveTintColor: colors.primary,
                drawerInactiveTintColor: colors.textMuted,
                drawerActiveBackgroundColor: `${colors.primary}22`,
                drawerLabelStyle: { fontWeight: '600' },
            }}
        >
            <Drawer.Screen name="Dashboard" component={DashboardScreen} options={{ drawerIcon: icon('grid-outline') }} />
            <Drawer.Screen name="Sensors" component={SensorsScreen} options={{ drawerIcon: icon('analytics-outline') }} />
            <Drawer.Screen name="Devices" component={DevicesScreen} options={{ drawerIcon: icon('hardware-chip-outline') }} />
            <Drawer.Screen name="Settings" component={SettingsScreen} options={{ drawerIcon: icon('settings-outline') }} />
        </Drawer.Navigator>
    );
}
