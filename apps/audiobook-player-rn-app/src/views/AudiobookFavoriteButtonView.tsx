import {Audiobook} from "shared";
import {Pressable, StyleSheet, View} from "react-native";
import {ThemedText} from "@/src/views/ThemedText";
import {useAppDispatch} from "@/src/store";
import {useIsAudiobookFavorite} from "@/src/store/AudiobookFavoritesHooks";
import {addFavoriteAudiobook, removeFavoriteAudiobook} from "@/src/store/AudiobookFavorites";
import {Entypo} from "@expo/vector-icons";
import {useTranslation} from "react-i18next";

export interface AudiobookFavoriteButtonViewProps {
    audiobook: Audiobook
}

export default function AudiobookFavoriteButtonView(props: AudiobookFavoriteButtonViewProps) {
    const {t} = useTranslation()

    const dispatch = useAppDispatch();
    const isFavorite = useIsAudiobookFavorite(props.audiobook.id);

    return (
        <Pressable onPress={() => {
            if (isFavorite) {
                dispatch(removeFavoriteAudiobook(props.audiobook.id))
            } else {
                dispatch(addFavoriteAudiobook(props.audiobook))
            }
        }}>
            <View
                style={[
                    styles.base,
                    isFavorite ? styles.isFavorite : styles.isNotFavorite
                ]}
            >
                <Entypo name={isFavorite ? "star" : "star-outlined"} size={28} color="#0a7ea4" />
                <ThemedText type={"linkSemiBold"}>{t(isFavorite ? "RemoveFromFavorites" : "AddToFavorites")}</ThemedText>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    base: {
        flexDirection: "row",
        alignItems: "center",
    },
    isFavorite: {

    },
    isNotFavorite: {

    }
})
