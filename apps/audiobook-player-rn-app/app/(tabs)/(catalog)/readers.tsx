import {ReadersPerPage} from "@/src/config";
import ReaderDynamicList from "@/src/components/app/ReaderDynamicList";
import {useTranslation} from "react-i18next";
import AppScreen from "@/src/components/screens/AppScreen";

export default function ScreenReaders() {
    const { t } = useTranslation();

    return (
        <AppScreen title={t("Readers")}>
            <ReaderDynamicList
                baseRequest={{
                    offset: 0,
                    limit: ReadersPerPage,
                    searchFor: null,
                    nameStartWith: null
                }}
            />
        </AppScreen>
    )
}
