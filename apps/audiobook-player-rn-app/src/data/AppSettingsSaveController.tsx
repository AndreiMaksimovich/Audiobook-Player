import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "@/src/store";
import {appStorage} from "@/src/data/AppStorage";
import {delay} from "@/src/utils";

export interface AppSettingsSaveControllerProps {}

export default function AppSettingsSaveController(props: AppSettingsSaveControllerProps) {
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
            appStorage.saveSettings({...settings}).catch(console.error);
        }
    }, [settings]);

    return (<></>)
}
