import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "@/src/store";
import {appPersistentStorage} from "@/src/lib/app-persistent-storage";
import {delay} from "@/src/utils";

export interface AppSettingsSaverProps {}

export default function AppSettingsSaver(props: AppSettingsSaverProps) {
    const settings = useSelector((state: RootState) => state.settings)
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        (async() => {
            await delay(2000);
            setIsInitialized(true);
        })()
    }, []);

    useEffect(() => {
        if (isInitialized) {
            appPersistentStorage.saveSettings({...settings}).catch(console.error);
        }
    }, [settings]);

    return (<></>)
}
