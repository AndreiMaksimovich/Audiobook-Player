import '@/src/localization'
import {useTranslation} from 'react-i18next'
import {useSelector} from "react-redux";
import {RootState} from "@/src/store";
import AudiobookView from "@/src/components/app/AudiobookView";
import {ThemedText} from "@/src/components/common/ThemedText";
import AppScreen from "@/src/components/screens/AppScreen";

export default function CurrentlyPlayingScreen() {
    const {t} = useTranslation();
    const currentlyPlaying = useSelector((state: RootState) => state.currentlyPlaying)

    return (
        <AppScreen>
            {/* Audiobook */}
            {currentlyPlaying.audiobook && (<AudiobookView mode={currentlyPlaying.isOffline ? 'offline' : 'online'} audiobook={currentlyPlaying.audiobook}/>)}

            {/* No audiobook */}
            {!currentlyPlaying.audiobook && (<ThemedText center={true} type={"subtitle"}>{t("NoAudiobookIsCurrentlyPlaying")}</ThemedText>)}
        </AppScreen>
    );
}
