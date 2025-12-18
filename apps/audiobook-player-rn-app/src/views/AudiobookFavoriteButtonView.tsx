import {Audiobook} from "shared";
import {Pressable, View} from "react-native";
import {useAppDispatch} from "@/src/store";
import {useIsAudiobookFavorite} from "@/src/store/AudiobookFavoritesHooks";
import {addFavoriteAudiobook, removeFavoriteAudiobook} from "@/src/store/AudiobookFavorites";
import {MaterialIcons} from "@expo/vector-icons";
import {themeStyles} from "@/src/theme"

export interface AudiobookFavoriteButtonViewProps {
    audiobook: Audiobook
}

export default function AudiobookFavoriteButtonView(props: AudiobookFavoriteButtonViewProps) {
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
                <MaterialIcons name={isFavorite ? "star" : "star-outline"} size={30} color="black" />
            </View>
        </Pressable>
    )
}
