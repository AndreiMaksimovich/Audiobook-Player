import {Tabs} from 'expo-router';
import React from 'react';
import {HapticTab} from '@/src/views/HapticTab';
import {Colors} from '@/src/theme/theme';
import {useColorScheme} from '@/src/hooks/use-color-scheme';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function TabLayout() {
    console.log("render")
    const colorScheme = useColorScheme();

    return (
        <Tabs
            initialRouteName="(catalog)"
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerShown: false,
                tabBarButton: HapticTab,
            }}>

            <Tabs.Screen
                name="(catalog)"
                options={{
                    title: '',
                    tabBarIcon: ({color}) => <MaterialIcons name="library-books" size={26} color={color}/>,
                }}

            />

            <Tabs.Screen
                name="(library)"
                options={{
                    title: '',
                    tabBarIcon: ({color}) => <MaterialIcons name="local-library" size={26} color={color}/>,
                }}
            />

            <Tabs.Screen
                name="(currently-playing)"
                options={{
                    title: '',
                    tabBarIcon: ({color}) => <MaterialIcons name="play-circle-outline" size={26} color={color}/>,
                }}
            />

            <Tabs.Screen
                name="(search)"
                options={{
                    title: '',
                    tabBarIcon: ({color}) => <MaterialIcons name="search" size={26} color={color}/>,
                }}
            />

            <Tabs.Screen
                name="settings"
                options={{
                    title: '',
                    tabBarIcon: ({color}) => <MaterialIcons name="settings" size={26} color={color}/>,
                }}
            />

        </Tabs>
    );
}

