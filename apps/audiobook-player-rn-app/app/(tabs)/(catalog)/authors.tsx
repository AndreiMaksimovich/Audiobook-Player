import AuthorDynamicListView from "@/src/views/AuthorDynamicListView";
import {AuthorsPerPage} from "@/src/config";
import {useTranslation} from "react-i18next";
import AppScreenView from "@/src/views/AppScreenView";

export default function ScreenAuthors() {
    const {t} = useTranslation();

    return (
        <AppScreenView title={t("Authors")}>
            <AuthorDynamicListView
                baseRequest={{
                    offset: 0,
                    limit: AuthorsPerPage,
                    searchFor: null,
                    nameStartWith: null
                }}
            />
        </AppScreenView>
    )
}
