import {ReadersPerPage} from "@/src/config";
import ReaderDynamicListView from "@/src/views/ReaderDynamicListView";
import {useTranslation} from "react-i18next";
import AppScreenView from "@/src/views/AppScreenView";

export default function ScreenReaders() {
    const { t } = useTranslation();

    return (
        <AppScreenView title={t("Readers")}>
            <ReaderDynamicListView
                baseRequest={{
                    offset: 0,
                    limit: ReadersPerPage,
                    searchFor: null,
                    nameStartWith: null
                }}
            />
        </AppScreenView>
    )
}
