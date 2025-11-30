import {AudiobooksPerPage} from "@/src/config";
import AudiobookDynamicListView from "@/src/views/AudiobookDynamicListView";
import {useTranslation} from "react-i18next";
import AppScreenView from "@/src/views/AppScreenView";

export default function ScreenAudiobooks() {
    const {t} = useTranslation();
    return (
        <AppScreenView title={t("Audiobooks")}>
            <AudiobookDynamicListView
                baseRequest={{
                    offset: 0,
                    limit: AudiobooksPerPage,
                }}
            />
        </AppScreenView>
    )
}
