import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {setState as setOfflineAudiobooksState} from "@/src/store/OfflineAudiobooks";
import {offlineAudiobooksManager as offlineAudiobooksManager} from './index'
import {appFileStorage} from "@/src/app-file-storage";

export interface OfflineAudiobooksInitializationControllerProps {}

export default function OfflineAudiobooksInitializationController(props: OfflineAudiobooksInitializationControllerProps) {
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            await appFileStorage.init();

            await offlineAudiobooksManager.init({
                fileStorage: appFileStorage,
                audiobooksDir: "OfflineAudiobooks/Audiobooks",
                downloadTasksDir: "OfflineAudiobooks/DownloadTasks",
            });

            const offlineAudiobooks = await offlineAudiobooksManager.loadOfflineAudiobooks()
            const downloadTasks = await offlineAudiobooksManager.loadDownloadTasks()

            dispatch(setOfflineAudiobooksState({
                offlineAudiobooks: offlineAudiobooks,
                downloadTasks: downloadTasks,
                activeDownloadTask: null
            }))
        })()
    }, []);

    return (<></>)
}
