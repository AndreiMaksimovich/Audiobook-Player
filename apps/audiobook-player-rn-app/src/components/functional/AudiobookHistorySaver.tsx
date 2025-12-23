import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "@/src/store";
import {appPersistentStorage} from "@/src/lib/app-persistent-storage";
import {delay} from "@/src/utils";

export default function AudiobookHistorySaver() {
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
        appPersistentStorage.saveFavorites([...favoritesState.favorites]).catch(console.error);
    }, [favoritesState.favorites]);

    useEffect(() => {
        if (!isInitialized) return
        appPersistentStorage.saveRecentlyViewed([...historyState.recentlyViewed]).catch(console.error)
        appPersistentStorage.saveRecentlyPlayed([...historyState.recentlyPlayed]).catch(console.error)
    }, [historyState.recentlyViewed, historyState.recentlyPlayed]);

    return (<></>)
}
