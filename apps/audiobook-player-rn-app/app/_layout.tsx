import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {Stack, usePathname, useRouter} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import {store, appDispatch} from "@/src/store";
import {Provider as ReduxProvider} from 'react-redux'
import {useColorScheme} from '@/src/hooks/use-color-scheme';
import AudiobookHistorySaver from "@/src/components/functional/AudiobookHistorySaver";
import {useEffect, useState} from "react";
import AudiobookHistoryRecentlyPlayedAudiobookSaver from "@/src/components/functional/AudiobookHistoryRecentlyPlayedAudiobookSaver";
import AudiobookCurrentlyPlayingAudiobookSaver from "@/src/components/functional/AudiobookCurrentlyPlayingAudiobookSaver";
import AppSettingsSaver from "@/src/components/functional/AppSettingsSaver";
import SplashScreen from "@/src/components/screens/SplashScreen";
import {DateTimeUtils} from "@/src/utils/DateTimeUtils";
import {SplashScreenMinDisplayDuration} from "@/src/config";
import {delay} from "@/src/utils";
import {Toasts} from "@/src/components/toasts/Toasts";
import TrackPlayerAudioPlaybackProgressUpdater from "@/src/components/functional/TrackPlayerAudioPlaybackProgressUpdater";
import ServiceWorkerRegistrator from "@/src/components/functional/ServiceWorkerRegistrator";
import {initializeApplicationDataAndServices} from '@/src/initialization'
import AppInitializationFailed from "@/src/components/screens/AppInitializationFailed";

export const unstable_settings = {
    anchor: '(tabs)',
};

type InitializationState = 'not-initialized' | 'in-progress' | 'failed' | 'initialized';

export default function RootLayout() {
    const [initializationState, setInitializationState] = useState<InitializationState>('not-initialized');
    const [showSplashScreen, setShowSplashScreen] = useState(true);

    const router = useRouter()
    const path = usePathname()

    // Initialization
    async function initialize() {
        setInitializationState('in-progress');
        try {
            await initializeApplicationDataAndServices({
                dispatch: appDispatch,
                initializeOfflineAudiobooks: true
            })
            setInitializationState('initialized');
        } catch (error) {
            console.log('Root Layout Initialization', error)
            setInitializationState('failed');
        }
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
            if (initializationState !== 'failed') {
                const timeRemaining = SplashScreenMinDisplayDuration - DateTimeUtils.now() + startTime
                if (timeRemaining > 0) {
                    await delay(timeRemaining)
                }
            }
            setShowSplashScreen(false)
        })()
    }, []);

    return (
        <ReduxProvider store={store}>
            {!showSplashScreen ?
                (
                    <>
                        {initializationState === 'initialized' ?
                            // App
                            (<>
                                <RootView/>
                                <FunctionalComponents/>
                            </>)
                            :
                            // Initialization failed
                            (
                                <AppInitializationFailed/>
                            )
                        }
                    </>
                )
                :
                (
                    <SplashScreen/>
                )}
            <Toasts/>
        </ReduxProvider>
    )
}

function FunctionalComponents() {
    return (
        <>
            <AppSettingsSaver/>
            <AudiobookHistoryRecentlyPlayedAudiobookSaver/>
            <AudiobookHistorySaver/>
            <AudiobookCurrentlyPlayingAudiobookSaver/>
            <TrackPlayerAudioPlaybackProgressUpdater />
            <ServiceWorkerRegistrator />
        </>
    )
}

function RootView() {
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
