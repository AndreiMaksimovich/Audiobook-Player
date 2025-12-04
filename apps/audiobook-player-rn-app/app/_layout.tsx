import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {Stack, usePathname, useRouter} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import 'react-native-reanimated';
import {store} from "@/src/store";
import {Provider as ReduxProvider} from 'react-redux'
import {useColorScheme} from '@/src/hooks/use-color-scheme';
import AudiobookHistoryController from "@/src/data/AudiobookHistoryController";
import {useEffect, useState} from "react";
import AudiobookHistoryRecentlyPlayedController from "@/src/data/AudiobookHistoryRecentlyPlayedController";
import AudiobookCurrentlyPlayingController from "@/src/data/AudiobookCurrentlyPlayingController";
import AppSettingsController from "@/src/data/AppSettingsController";
import SplashScreenView from "@/src/views/SplashScreenView";
import {DateTimeUtils} from "@/src/utils/DateTimeUtils";
import {SplashScreenMinDisplayDuration} from "@/src/config";
import {delay} from "@/src/utils";

export const unstable_settings = {
    anchor: '(tabs)',
};

async function initialize() {

}

export default function App() {
    const [isInitialized, setIsInitialized] = useState(false);
    const router = useRouter()
    const path = usePathname()

    // Handle click on Audio/Music player notification -> Route to currently playing screen
    useEffect(() => {
        if (path === '/notification.click') {
            router.navigate({pathname: "/(tabs)/(currently-playing)", params: {}})
        }
    }, [path]);

    // Initialization & Splashscreen
    useEffect(() => {
        (async () => {
            const startTime = DateTimeUtils.now()
            await initialize()
            const timeRemaining = SplashScreenMinDisplayDuration - DateTimeUtils.now() + startTime
            if (timeRemaining > 0) {
                await delay(timeRemaining)
            }
            setIsInitialized(true);
        })()
    }, []);

    return (
        <ReduxProvider store={store}>
            {isInitialized ? (<RootLayout/>) : (<SplashScreenView/>)}
            <FunctionalComponents/>
        </ReduxProvider>
    )
}

function FunctionalComponents() {
    return (
        <>
            <AppSettingsController/>
            <AudiobookHistoryRecentlyPlayedController/>
            <AudiobookHistoryController/>
            <AudiobookCurrentlyPlayingController/>
        </>
    )
}

function RootLayout() {
    const colorScheme = useColorScheme();

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
                <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                <Stack.Screen name="+not-found" options={{headerShown: false}}/>
            </Stack>
            <StatusBar style="auto"/>
        </ThemeProvider>
    );
}
