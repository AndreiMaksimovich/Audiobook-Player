import {RootState} from "@/src/store/index";
import {useSelector} from "react-redux";

export const useIsAudiobookFavorite = (audiobookId: number) => {
    const state = useSelector((rootState: RootState) => rootState.audiobookFavorites)
    return state.favorites.some(favorite => favorite.id === audiobookId);
}
