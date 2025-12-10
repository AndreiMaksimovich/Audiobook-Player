import {Audiobook} from "shared";
import {Pressable, StyleSheet, View} from "react-native";
import {ThemedText} from "@/src/views/ThemedText";
import {useAppDispatch} from "@/src/store";
import {useIsAudiobookFavorite} from "@/src/store/AudiobookFavoritesHooks";
import {addFavoriteAudiobook, removeFavoriteAudiobook} from "@/src/store/AudiobookFavorites";
import {Entypo, MaterialCommunityIcons} from "@expo/vector-icons";
import {useTranslation} from "react-i18next";
import {themeStyles} from "@/src/theme"

export interface AudiobookFavoriteButtonViewProps {
    audiobook: Audiobook
}

export default function AudiobookFavoriteButtonView(props: AudiobookFavoriteButtonViewProps) {
    const {t} = useTranslation()

    const dispatch = useAppDispatch();
    const isFavorite = useIsAudiobookFavorite(props.audiobook.id);

    function handleOnPress() {
        if (isFavorite) {
            dispatch(removeFavoriteAudiobook(props.audiobook.id))
        } else {
            dispatch(addFavoriteAudiobook(props.audiobook))
        }
    }

    return (
        <Pressable onPress={handleOnPress}>
            <View style={themeStyles.circleActionButton}>
                <MaterialCommunityIcons name={isFavorite ? "star" : "star-plus-outline"} size={30} color="black" />
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
