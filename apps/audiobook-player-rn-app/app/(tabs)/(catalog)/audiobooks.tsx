import {AudiobooksPerPage} from "@/src/config";
import AudiobookDynamicList from "@/src/components/app/AudiobookDynamicList";
import {useTranslation} from "react-i18next";
import AppScreen from "@/src/components/screens/AppScreen";

export default function ScreenAudiobooks() {
    const {t} = useTranslation();
    return (
        <AppScreen title={t("Audiobooks")}>
            <AudiobookDynamicList
                baseRequest={{
                    offset: 0,
                    limit: AudiobooksPerPage,
                }}
            />
        </AppScreen>
    )
}
