import {Pressable, StyleSheet, View} from 'react-native';
import {ThemedText} from '@/src/views/ThemedText';
import {VStackView} from "@/src/views/VStackView";
import {HStackView} from "@/src/views/HStackView";
import {useSelector} from "react-redux";
import {RootState} from "@/src/store";
import AudiobookHistoryRecordView from "@/src/views/AudiobookHistoryRecordView";
import {useMemo, useState} from "react";
import AppScreenView from "@/src/views/AppScreenView";
import {useTranslation} from "react-i18next";
import SpacerView from "@/src/views/SpacerView";
import {AudiobookListView} from "@/src/views/AudiobookListView";
import DownloadTaskListView from "@/src/views/DownloadTaskListView";
import ActiveDownloadTaskView from "@/src/views/ActiveDownloadTaskView";
import {useAreOfflineAudiobooksAvailable} from "@/src/store/SettingsHooks";

enum Mode {
    Favorites = 0,
    RecentlyPlayed = 1,
    RecentlyViewed = 2,
    OfflineAudiobooks = 3,
    DownloadTasks = 4
}

export default function LibraryScreen() {
    const {t} = useTranslation()
    const favoriteAudiobooks = useSelector((state: RootState) => state.audiobookFavorites)
    const audiobookHistory = useSelector((state: RootState) => state.audiobookHistory)
    const {offlineAudiobooks} = useSelector((state: RootState) => state.offlineAudiobooks)
    const [mode, setMode] = useState(Mode.Favorites)
    const areOfflineAudiobooksAvailable = useAreOfflineAudiobooksAvailable()

    const header = useMemo(() => {
        const result = [
            [
                {mode: Mode.Favorites, label: t('Favorites')},
                {mode: Mode.RecentlyPlayed, label: t('RecentlyPlayed')},
                {mode: Mode.RecentlyViewed, label: t('RecentlyViewed')}
            ]
        ];
        if (areOfflineAudiobooksAvailable) {
            result.push(
                [
                    {mode: Mode.OfflineAudiobooks, label: t('OfflineAudiobooks')},
                    {mode: Mode.DownloadTasks, label: t('DownloadTasks')},
                ]
            )
        }
        return result
    }, [areOfflineAudiobooksAvailable])

    return (
        <AppScreenView title={t("Library")}>

            <SpacerView size={5}/>

            <View style={styles.headerContainer}>
                {header.map((row, index) => (
                    <HStackView key={`header-${index}`} justifyContent={'space-around'} style={styles.headerRow}>
                        {row.map(item => (
                            <Pressable
                                key={item.mode}
                                onPress={() => {
                                    setMode(item.mode)
                                }}
                            >
                                <ThemedText
                                    type={item.mode != mode ? "linkSemiBold" : "linkSemiBoldInactive"}>{item.label}</ThemedText>
                            </Pressable>
                        ))}
                    </HStackView>
                ))}
            </View>

            <VStackView>

                {mode === Mode.Favorites && (<>{favoriteAudiobooks.favorites.toReversed().map((record) => (
                    <AudiobookHistoryRecordView record={record} key={`favorite.${record.id}`}/>))}</>)}

                {mode === Mode.RecentlyPlayed && (<>{audiobookHistory.recentlyPlayed.toReversed().map((record) => (
                    <AudiobookHistoryRecordView record={record} key={`played.${record.id}`}/>))}</>)}

                {mode === Mode.RecentlyViewed && (<>{audiobookHistory.recentlyViewed.toReversed().map((record) => (
                    <AudiobookHistoryRecordView record={record} key={`viewed.${record.id}`}/>))}</>)}

                {mode === Mode.OfflineAudiobooks && (
                    <AudiobookListView audiobooks={offlineAudiobooks} mode={'offline'}/>)}

                {mode === Mode.DownloadTasks && (
                    <>
                        <ActiveDownloadTaskView/>
                        <DownloadTaskListView/>
                    </>
                )}

            </VStackView>

        </AppScreenView>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
        borderRadius: 5,
        borderColor: "gray",
        borderWidth: 1
    },
    headerRow: {},
});
