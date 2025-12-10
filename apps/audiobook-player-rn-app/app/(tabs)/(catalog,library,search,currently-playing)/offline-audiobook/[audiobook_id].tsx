import {Link, useLocalSearchParams, useNavigation} from 'expo-router';
import AudiobookView from "@/src/views/AudiobookView";
import AppScreenView from "@/src/views/AppScreenView";
import {ThemedText} from "@/src/views/ThemedText";
import {useTranslation} from "react-i18next";
import {ActivityIndicator, Button} from "react-native";
import {useEffect, useState} from "react";
import {Audiobook} from "shared"
import {offlineAudiobooksManager} from "@/src/offline-audiobooks";
import {OfflineAudiobookState, useOfflineAudiobookState} from "@/src/store/OfflineAudiobooksHooks";

export default function ScreenAudiobook() {
    const navigation = useNavigation();
    const {t} = useTranslation()
    const { audiobook_id } = useLocalSearchParams();
    const audiobookId = parseInt(audiobook_id as string)
    const bookState = useOfflineAudiobookState(audiobookId)

    const [audiobook, setAudiobook] = useState<Audiobook | null>(null)
    const [error, setError] = useState<any>(null)

    useEffect(() => {
        (async () => {
            try {
                const audiobook = await offlineAudiobooksManager.getOfflineAudiobook(audiobookId)
                setAudiobook(audiobook)
            } catch (e) {
                setError(e)
            }
        })()
    }, []);

    useEffect(() => {
        if (audiobook) {
            navigation.setOptions({ title: audiobook.title });
        }
    }, [audiobook]);

    useEffect(() => {
        if (bookState === OfflineAudiobookState.Online) {
            navigation.goBack()
        }
    }, [bookState]);

    return (
        <AppScreenView>

            {/* Loading Indicator */}
            {!audiobook && !error && (<ActivityIndicator size={"large"}/>)}

            {/* Error - Offline Audiobook not found */}
            {error && (
                <>
                    <ThemedText type={"error"}>{t("OfflineAudiobookNotFound")}</ThemedText>
                    <Link href={"/"}>
                        <Button title={t("HomePage")}/>
                    </Link>
                </>
            )}

            {/* Audiobook */}
            {audiobook && (<AudiobookView mode={"offline"} audiobook={audiobook}/>)}

        </AppScreenView>
    )
}
