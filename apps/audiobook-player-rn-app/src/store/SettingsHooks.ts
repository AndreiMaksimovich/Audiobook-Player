import {useSelector} from "react-redux";
import {RootState} from "@/src/store/index";

export function useAreOfflineAudiobooksAvailable(): boolean {
    const settings = useSelector((state: RootState) => state.settings)
    return settings.isPersistentStorageAvailable && settings.areOfflineAudiobooksEnabled
}
