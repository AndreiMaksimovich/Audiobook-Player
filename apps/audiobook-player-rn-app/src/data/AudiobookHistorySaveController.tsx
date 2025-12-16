import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "@/src/store";
import {appStorage} from "@/src/data/AppStorage";
import {delay} from "@/src/utils";

export default function AudiobookHistorySaveController() {
    const [isInitialized, setIsInitialized] = useState(false);

    const favoritesState = useSelector((state: RootState) => state.audiobookFavorites)
    const historyState = useSelector((state: RootState) => state.audiobookHistory)

    useEffect(() => {
        (async () => {
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
