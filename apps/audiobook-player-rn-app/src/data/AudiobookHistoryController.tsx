import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/store";
import {appStorage} from "@/src/data/AppStorage";
import {setFavoriteAudiobooks} from "@/src/store/AudiobookFavorites";
import {delay} from "@/src/utils";
import {setAudiobookHistory} from "@/src/store/AudiobookHistory";

export default function AudiobookHistoryController() {
    const [isInitialized, setIsInitialized] = useState(false);

    const favoritesState = useSelector((state: RootState) => state.audiobookFavorites)
    const historyState = useSelector((state: RootState) => state.audiobookHistory)

    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            const favorites = await appStorage.loadFavorites()

            const recentlyPlayed = await appStorage.loadRecentlyPlayed()
            const recentlyViewed = await appStorage.loadRecentlyViewed()

            dispatch(setFavoriteAudiobooks(favorites))
            dispatch(setAudiobookHistory({
                recentlyViewed: recentlyViewed,
                recentlyPlayed: recentlyPlayed
            }))

            await delay(250)
            setIsInitialized(true)
        })()
    }, []);

    useEffect(() => {
        if (!isInitialized) return
        appStorage.saveFavorites([...favoritesState.favorites]).catch(console.error);
    }, [favoritesState.favorites]);

    useEffect(() => {
        if (!isInitialized) return
        appStorage.saveRecentlyViewed([...historyState.recentlyViewed]).catch(console.error)
        appStorage.saveRecentlyPlayed([...historyState.recentlyPlayed]).catch(console.error)
    }, [historyState.recentlyViewed, historyState.recentlyPlayed]);

    return (<></>)
}
