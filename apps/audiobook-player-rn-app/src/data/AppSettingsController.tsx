import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/store";
import {setSettings, settingsInitialState} from "@/src/store/Settings";
import {getDefaultSupportedLanguageCode} from "@/src/localization/Localization";
import {appStorage} from "@/src/data/AppStorage";
import {delay} from "@/src/utils";
import i18next from "@/src/localization";

export interface AppSettingsControllerProps {}

export default function AppSettingsController(props: AppSettingsControllerProps) {
    const settings = useSelector((state: RootState) => state.settings)
    const dispatch = useDispatch();
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        (async() => {
            while (!i18next.isInitialized) {
                await delay(50)
            }

            const defaultSettings = {...settingsInitialState}
            defaultSettings.localizationLanguageCode = getDefaultSupportedLanguageCode()

            const settings = await appStorage.loadSettings(defaultSettings);

            dispatch(setSettings(settings));

            await delay(250);
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
