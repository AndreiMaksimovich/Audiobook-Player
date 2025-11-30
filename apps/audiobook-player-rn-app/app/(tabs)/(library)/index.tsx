import {Pressable, StyleSheet} from 'react-native';
import {ThemedText} from '@/src/views/ThemedText';
import {VStackView} from "@/src/views/VStackView";
import {HStackView} from "@/src/views/HStackView";
import {useSelector} from "react-redux";
import {RootState} from "@/src/store";
import AudiobookHistoryRecordView from "@/src/views/AudiobookHistoryRecordView";
import {useState} from "react";
import AppScreenView from "@/src/views/AppScreenView";
import {useTranslation} from "react-i18next";
import SpacerView from "@/src/views/SpacerView";

enum Mode {
    Favorites = 0,
    RecentlyPlayed = 1,
    RecentlyViewed = 2
}

export default function LibraryScreen() {
    const {t} = useTranslation()
    const favoriteAudiobooks = useSelector((state: RootState) => state.audiobookFavorites)
    const audiobookHistory = useSelector((state: RootState) => state.audiobookHistory)
    const [mode, setMode] = useState(Mode.Favorites)

    return (
        <AppScreenView title={t("Library")}>

            <SpacerView size={5}/>

            <HStackView justifyContent={'space-around'} style={styles.modeContainer}>
                {[t('Favorites'), t('RecentlyPlayed'), t('RecentlyViewed')].map((modeName, index) => (
                    <Pressable
                        key={index}
                        onPress={() => {
                            setMode(index)
                        }}
                    >
                        <ThemedText
                            type={index != mode ? "linkSemiBold" : "linkSemiBoldInactive"}>{modeName}</ThemedText>
                    </Pressable>
                ))}
            </HStackView>

            <SpacerView size={5}/>

            <VStackView>

                {mode === Mode.Favorites && (<>{favoriteAudiobooks.favorites.toReversed().map((record) => (
                    <AudiobookHistoryRecordView record={record} key={`favorite.${record.id}`}/>))}</>)}

                {mode === Mode.RecentlyPlayed && (<>{audiobookHistory.recentlyPlayed.toReversed().map((record) => (
                    <AudiobookHistoryRecordView record={record} key={`played.${record.id}`}/>))}</>)}

                {mode === Mode.RecentlyViewed && (<>{audiobookHistory.recentlyViewed.toReversed().map((record) => (
                    <AudiobookHistoryRecordView record={record} key={`viewed.${record.id}`}/>))}</>)}

            </VStackView>

        </AppScreenView>
    );
}

const styles = StyleSheet.create({
    modeContainer: {boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)", borderRadius: 5, borderColor: "gray", borderWidth: 1},
});
