import {ActivityIndicator, RefreshControl} from 'react-native';
import '@/src/localization'
import {useTranslation} from 'react-i18next'
import {AudiobookLimit, AudiobooksOrderBy, GetAudiobooksRequest} from "shared";
import {ThemedText} from "@/src/views/ThemedText";
import SearchPanelLinkView from "@/src/views/SearchPanelLinkView";
import {Link} from "expo-router";
import {HStackView} from "@/src/views/HStackView";
import AppScreenView from "@/src/views/AppScreenView";
import SpacerView from "@/src/views/SpacerView";
import {useEffect} from "react";
import {
    useLazyGetAudiobooksQuery,
    useLazyGetCategoriesQuery,
    useLazyGetTagsQuery
} from "@/src/store/AudiobookProviderApi";
import {HumanReadableErrorView} from "@/src/views/HumanReadableErrorView";
import {AudiobookListView} from "@/src/views/AudiobookListView";
import TagsView from "@/src/views/TagsView";
import CategoriesView from "@/src/views/CategoriesView";

const getNewBooksRequest: GetAudiobooksRequest = {
    offset: 0,
    limit: AudiobookLimit._10,
    orderBy: AudiobooksOrderBy.AddTime
}

export default function CatalogMainScreen() {
    const { t } = useTranslation();

    const [loadNewBooksTrigger, {data: loadNewBooksResponse, error: loadNewBooksError, isLoading: loadNewBooksIsLoading}] = useLazyGetAudiobooksQuery();
    const [loadTagsTrigger, {data: loadTagsResponse, error: loadTagsError, isLoading: loadTagsIsLoading}] = useLazyGetTagsQuery();
    const [loadCategoriesTrigger, {data: loadCategoriesResponse, error: loadCategoriesError, isLoading: loadCategoriesIsLoadings}] = useLazyGetCategoriesQuery()

    function retry() {
        if (loadNewBooksError && !loadNewBooksIsLoading) {
            loadNewBooksTrigger(getNewBooksRequest)
        }
        if (loadTagsError && !loadTagsIsLoading) {
            loadTagsTrigger()
        }
        if (loadCategoriesError && !loadCategoriesIsLoadings) {
            loadCategoriesTrigger()
        }
    }

    const isLoading = loadNewBooksIsLoading || loadTagsIsLoading || loadCategoriesIsLoadings
    const error = loadNewBooksError ?? loadTagsError ?? loadCategoriesError ?? undefined

    // initial load
    useEffect(() => {
        loadNewBooksTrigger(getNewBooksRequest)
        loadTagsTrigger()
        loadCategoriesTrigger()
    }, []);

    return (
        <AppScreenView
            refreshControl={<RefreshControl refreshing={isLoading} onRefresh={retry}/>}>

            {/* Search */}
            <ThemedText type={"subtitle"}>{t("Search")}</ThemedText>
            <SpacerView size={5}/>
            <SearchPanelLinkView />
            <SpacerView size={10}/>

            <HStackView justifyContent={"space-around"}>
                <Link href={"/(tabs)/(catalog)/audiobooks"}>
                    <ThemedText type={"linkSemiBold"}>{t("Audiobooks")}</ThemedText>
                </Link>
                <Link href={"/(tabs)/(catalog)/authors"}>
                    <ThemedText type={"linkSemiBold"}>{t("Authors")}</ThemedText>
                </Link>
                <Link href={"/(tabs)/(catalog)/readers"}>
                    <ThemedText type={"linkSemiBold"}>{t("Readers")}</ThemedText>
                </Link>
            </HStackView>

            <SpacerView size={10}/>

            {/* Is Loading */}
            {isLoading && (<ActivityIndicator />)}

            {/* Error */}
            {error && (<HumanReadableErrorView error={error} showRetryButton={true} onRetryButtonClick={retry} /> )}

            {/* Recent Audiobooks */}
            {loadNewBooksResponse && (<>
                <ThemedText type={"subtitle"}>{t("NewAudiobooks")}</ThemedText>
                <AudiobookListView audiobooks={loadNewBooksResponse.audiobooks}/>
                <SpacerView size={10}/>
            </>)}

            {/* Tags */}
            {loadTagsResponse && (<>
                <ThemedText type={"subtitle"}>{t("Tags")}</ThemedText>
                <TagsView tags={loadTagsResponse}/>
                <SpacerView size={10}/>
            </>)}

            {/* Categories */}
            {loadCategoriesResponse && (<>
                <ThemedText type={"subtitle"}>{t("Categories")}</ThemedText>
                <CategoriesView categories={loadCategoriesResponse}/>
                <SpacerView size={10}/>
            </>)}

        </AppScreenView>
    );
}
