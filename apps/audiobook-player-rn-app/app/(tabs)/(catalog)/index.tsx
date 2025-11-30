import {StyleSheet} from 'react-native';
import '@/src/localization'
import {useTranslation} from 'react-i18next'
import {AudiobookLimit, AudiobooksOrderBy} from "shared";
import AudiobookDynamicListView from "@/src/views/AudiobookDynamicListView";
import {ThemedText} from "@/src/views/ThemedText";
import TagsDynamicView from "@/src/views/TagsDynamicView";
import CategoriesDynamicView from "@/src/views/CategoriesDynamicView";
import SearchPanelLinkView from "@/src/views/SearchPanelLinkView";
import {Link} from "expo-router";
import {HStackView} from "@/src/views/HStackView";
import AppScreenView from "@/src/views/AppScreenView";
import SpacerView from "@/src/views/SpacerView";

export default function CatalogMainScreen() {
    const { t } = useTranslation();

    return (
        <AppScreenView>

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

            {/* Recent Audiobooks */}
            <ThemedText type={"subtitle"}>{t("NewAudiobooks")}</ThemedText>
            <AudiobookDynamicListView
                baseRequest={{
                    offset: 0,
                    limit: AudiobookLimit._10,
                    orderBy: AudiobooksOrderBy.AddTime
                }}
                hidePages={true}
                hideError={false}/>

            <SpacerView size={10}/>

            {/* Tags */}
            <ThemedText type={"subtitle"}>{t("Tags")}</ThemedText>
            <TagsDynamicView />

            <SpacerView size={10}/>

            {/* Categories */}
            <ThemedText type={"subtitle"}>{t("Categories")}</ThemedText>
            <CategoriesDynamicView />

        </AppScreenView>
    );
}

const styles = StyleSheet.create({
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
    },
});
