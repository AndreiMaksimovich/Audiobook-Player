import AuthorDynamicList from "@/src/components/app/AuthorDynamicList";
import {AuthorsPerPage} from "@/src/config";
import {useTranslation} from "react-i18next";
import AppScreen from "@/src/components/screens/AppScreen";

export default function ScreenAuthors() {
    const {t} = useTranslation();

    return (
        <AppScreen title={t("Authors")}>
            <AuthorDynamicList
                baseRequest={{
                    offset: 0,
                    limit: AuthorsPerPage,
                    searchFor: null,
                    nameStartWith: null
                }}
            />
        </AppScreen>
    )
}
