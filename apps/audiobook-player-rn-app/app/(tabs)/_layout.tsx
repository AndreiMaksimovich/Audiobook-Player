import {Tabs} from 'expo-router';
import React from 'react';
import {HapticTab} from '@/src/views/HapticTab';
import {Colors} from '@/src/theme/theme';
import {useColorScheme} from '@/src/hooks/use-color-scheme';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function TabLayout() {
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
                    tabBarIcon: ({color}) => <AntDesign name="product" size={26} color={color}/>,
                }}

            />

            <Tabs.Screen
                name="(library)"
                options={{
                    title: '',
                    tabBarIcon: ({color}) => <Ionicons name="library" size={26} color={color}/>,
                }}
            />

            <Tabs.Screen
                name="(currently-playing)"
                options={{
                    title: '',
                    tabBarIcon: ({color}) => <AntDesign name="play-circle" size={28} color={color}/>,
                }}
            />

            <Tabs.Screen
                name="(search)"
                options={{
                    title: '',
                    tabBarIcon: ({color}) => <FontAwesome name="search" size={26} color={color}/>,
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
