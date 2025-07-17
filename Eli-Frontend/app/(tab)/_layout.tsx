import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Settings, Bell } from 'lucide-react';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
        headerShown: false, // We don't need a header for the tab layout
            tabBarActiveTintColor: '#3b82f6', // Equivalent to Tailwind's blue-500
            tabBarInactiveTintColor: '#9ca3af', // Equivalent to Tailwind's gray-400
            tabBarStyle: {
            backgroundColor: 'white',
                borderTopWidth: 1,
                borderTopColor: '#e5e7eb', // Equivalent to Tailwind's gray-200
        },
        tabBarLabelStyle: {
            fontSize: 12,
                marginTop: -5, // Adjust positioning of the label
                marginBottom: 5,
        },
    }}>
    {/* Home Tab (Dashboard) */}
    <Tabs.Screen
        name="index" // This corresponds to app/(tab)/index.tsx
    options={{
        title: 'Home',
            tabBarIcon: ({ color }) => <Home color={color} className="w-6 h-6" />,
    }}
    />
    {/* Notifications Tab */}
    <Tabs.Screen
        name="notifications" // This corresponds to app/(tab)/notifications.tsx
    options={{
        title: 'Notifications',
            tabBarIcon: ({ color }) => <Bell color={color} className="w-6 h-6" />,
    }}
    />
    {/* Settings Tab */}
    <Tabs.Screen
        name="settings" // This corresponds to app/(tab)/settings.tsx
    options={{
        title: 'Settings',
            tabBarIcon: ({ color }) => <Settings color={color} className="w-6 h-6" />,
    }}
    />
    </Tabs>
);
}
