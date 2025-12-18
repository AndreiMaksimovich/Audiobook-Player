import {RootState} from "@/src/store";
import {useSelector} from "react-redux";

export function useAreOfflineAudiobooksAvailable(): boolean {
    const state = useSelector((state: RootState) => state.global)
    return state.isPersistentStorageAvailable && state.areOfflineAudiobooksInitialized
}
