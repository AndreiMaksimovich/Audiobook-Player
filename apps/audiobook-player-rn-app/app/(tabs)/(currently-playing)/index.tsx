import '@/src/localization'
import {useTranslation} from 'react-i18next'
import {useSelector} from "react-redux";
import {RootState} from "@/src/store";
import AudiobookView from "@/src/views/AudiobookView";
import {ThemedText} from "@/src/views/ThemedText";
import AppScreenView from "@/src/views/AppScreenView";

export default function CurrentlyPlayingScreen() {
    const {t} = useTranslation();
    const currentlyPlaying = useSelector((state: RootState) => state.currentlyPlaying)

    return (
        <AppScreenView>
            {/* Audiobook */}
            {currentlyPlaying.audiobook && (<AudiobookView audiobook={currentlyPlaying.audiobook}/>)}

            {/* No audiobook */}
            {!currentlyPlaying.audiobook && (<ThemedText center={true} type={"subtitle"}>{t("NoAudiobookIsCurrentlyPlaying")}</ThemedText>)}
        </AppScreenView>
    );
}
