import {ActivityIndicator, RefreshControl} from 'react-native';
import '@/src/localization'
import {useTranslation} from 'react-i18next'
import {AudiobookLimit, AudiobooksOrderBy, GetAudiobooksRequest} from "shared";
import {ThemedText} from "@/src/components/common/ThemedText";
import SearchPanelLink from "@/src/components/app/SearchPanelLink";
import {Link} from "expo-router";
import {HStack} from "@/src/components/common/HStack";
import AppScreen from "@/src/components/screens/AppScreen";
import Spacer from "@/src/components/common/Spacer";
import {useEffect} from "react";
import {
    useLazyGetAudiobooksQuery,
    useLazyGetCategoriesQuery,
    useLazyGetTagsQuery
} from "@/src/store/AudiobookProviderApi";
import {HumanReadableError} from "@/src/components/common/HumanReadableError";
import {AudiobookList} from "@/src/components/app/AudiobookList";
import Tags from "@/src/components/app/Tags";
import Categories from "@/src/components/app/Categories";

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
        <AppScreen
            testID={"Screen.Catalog"}
            refreshControl={<RefreshControl refreshing={isLoading} onRefresh={retry}/>}>

            {/* Search */}
            <ThemedText type={"subtitle"}>{t("Search")}</ThemedText>
            <Spacer size={5}/>
            <SearchPanelLink />
            <Spacer size={10}/>

            <HStack justifyContent={"space-around"}>
                <Link href={"/(tabs)/(catalog)/audiobooks"}>
                    <ThemedText type={"linkSemiBold"}>{t("Audiobooks")}</ThemedText>
                </Link>
                <Link href={"/(tabs)/(catalog)/authors"}>
                    <ThemedText type={"linkSemiBold"}>{t("Authors")}</ThemedText>
                </Link>
                <Link href={"/(tabs)/(catalog)/readers"}>
                    <ThemedText type={"linkSemiBold"}>{t("Readers")}</ThemedText>
                </Link>
            </HStack>

            <Spacer size={10}/>

            {/* Is Loading */}
            {isLoading && (<ActivityIndicator />)}

            {/* Error */}
            {error && (<HumanReadableError error={error} showRetryButton={true} onRetryButtonClick={retry} /> )}

            {/* Recent Audiobooks */}
            {loadNewBooksResponse && (<>
                <ThemedText type={"subtitle"}>{t("NewAudiobooks")}</ThemedText>
                <AudiobookList audiobooks={loadNewBooksResponse.audiobooks}/>
                <Spacer size={10}/>
            </>)}

            {/* Tags */}
            {loadTagsResponse && (<>
                <ThemedText type={"subtitle"}>{t("Tags")}</ThemedText>
                <Tags tags={loadTagsResponse}/>
                <Spacer size={10}/>
            </>)}

            {/* Categories */}
            {loadCategoriesResponse && (<>
                <ThemedText type={"subtitle"}>{t("Categories")}</ThemedText>
                <Categories categories={loadCategoriesResponse}/>
                <Spacer size={10}/>
            </>)}

        </AppScreen>
    );
}
