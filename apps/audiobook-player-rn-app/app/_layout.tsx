import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {Stack, usePathname, useRouter} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import {store, appDispatch} from "@/src/store";
import {Provider as ReduxProvider} from 'react-redux'
import {useColorScheme} from '@/src/hooks/use-color-scheme';
import AudiobookHistorySaveController from "@/src/data/AudiobookHistorySaveController";
import {useEffect, useState} from "react";
import AudiobookHistoryRecentlyPlayedController from "@/src/data/AudiobookHistoryRecentlyPlayedController";
import AudiobookCurrentlyPlayingController from "@/src/data/AudiobookCurrentlyPlayingController";
import AppSettingsSaveController from "@/src/data/AppSettingsSaveController";
import SplashScreenView from "@/src/views/SplashScreenView";
import {DateTimeUtils} from "@/src/utils/DateTimeUtils";
import {SplashScreenMinDisplayDuration} from "@/src/config";
import {delay} from "@/src/utils";
import {ToastController} from "@/src/toasts";
import AudioPlaybackProgressController from "@/src/audio-player/AudioPlaybackProgressController";
import ServiceWorkerController from "@/src/service-worker/ServiceWorkerController";
import {initializeApplicationDataAndServices} from '@/src/initialization'

export const unstable_settings = {
    anchor: '(tabs)',
};

// App Data & Services Initialization
initializeApplicationDataAndServices({
    dispatch: appDispatch,
    initializeOfflineAudiobooks: true
})
    .catch((error: Error) => {
        console.error('Initialization critical error', error)
        //TODO handle critical error
    })

export default function App() {
    const [isInitialized, setIsInitialized] = useState(false);
    const router = useRouter()
    const path = usePathname()

    // Initialization
    async function initialize() {

    }

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
            {isInitialized ?
                (
                    <>
                        <RootLayout/>
                        <FunctionalComponents/>
                    </>
                )
                :
                (
                    <SplashScreenView/>
                )}
            <ToastController/>
        </ReduxProvider>
    )
}

function FunctionalComponents() {
    return (
        <>
            <AppSettingsSaveController/>
            <AudiobookHistoryRecentlyPlayedController/>
            <AudiobookHistorySaveController/>
            <AudiobookCurrentlyPlayingController/>
            <AudioPlaybackProgressController />
            <ServiceWorkerController />
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
                <Stack.Screen name="test" options={{headerShown: false}}/>
            </Stack>
            <StatusBar style="auto"/>
        </ThemeProvider>
    );
}
