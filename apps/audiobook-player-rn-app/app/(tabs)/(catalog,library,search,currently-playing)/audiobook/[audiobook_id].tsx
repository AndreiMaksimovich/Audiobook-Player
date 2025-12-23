import {useLocalSearchParams, useNavigation} from 'expo-router';
import {useLazyGetAudiobookQuery} from "@/src/store/AudiobookProviderApi";
import {ActivityIndicator} from "react-native"
import AudiobookView from "@/src/components/app/AudiobookView";
import {HumanReadableError} from "@/src/components/common/HumanReadableError";
import {useEffect, useState} from "react";
import AppScreen from "@/src/components/screens/AppScreen";
import {OfflineAudiobookState, useOfflineAudiobook, useOfflineAudiobookState} from "@/src/store/OfflineAudiobooksHooks";
import {Audiobook} from "shared"
import {offlineAudiobooksManager} from "@/src/lib/offline-audiobooks";

export default function ScreenAudiobook() {
    const navigation = useNavigation();
    const { audiobook_id } = useLocalSearchParams();
    const audiobookId = parseInt(audiobook_id as string)

    const offlineState = useOfflineAudiobookState(audiobookId);
    const stateOfflineAudiobook = useOfflineAudiobook(audiobookId);

    const [onlineAudiobook, setOnlineAudiobook] = useState<Audiobook | null>(null);
    const [offlineAudiobook, setOfflineAudiobook] = useState<Audiobook | null>(null);
    const [isInitialized, setIsInitialized] = useState<boolean>(false);

    const [trigger, {data: audiobook, error, isLoading}] = useLazyGetAudiobookQuery();

    useEffect(() => {
        (async () => {
            if (offlineState === OfflineAudiobookState.Offline) {
                // Offline version is available
                setOfflineAudiobook(await offlineAudiobooksManager.getOfflineAudiobook(audiobookId))
            }
            trigger(audiobookId)
            setIsInitialized(true)
        })()
    }, []);

    useEffect(() => {
        if (!isInitialized) return;

        // Book just downloaded
        if (offlineState === OfflineAudiobookState.Offline) {
            console.log('Downloaded -> Offline mode')
            setOfflineAudiobook(stateOfflineAudiobook)
        }

        // Book just removed
        if (offlineState === OfflineAudiobookState.Online) {
            console.log('Removed -> Online mode')
            setOfflineAudiobook(null)
            if (!audiobook) {
                trigger(audiobookId)
            }
        }
    }, [offlineState]);

    useEffect(() => {
        if (audiobook) {
            navigation.setOptions({ title: audiobook.title });
            setOnlineAudiobook(audiobook)
            if (offlineAudiobook) {
                //TODO check audiobook version
            }
        }
    }, [audiobook]);

    return (
        <AppScreen  >

            {isLoading && (<ActivityIndicator />)}

            {!offlineAudiobook && error && (<HumanReadableError error={error} showRetryButton={true} onRetryButtonClick={() => { trigger(audiobookId) }}/> )}

            {(onlineAudiobook !== null || offlineAudiobook !== null) && (<AudiobookView audiobook={offlineAudiobook ?? onlineAudiobook!} mode={offlineAudiobook ? 'offline' : 'online'}/>)}

        </AppScreen>
    )
}
