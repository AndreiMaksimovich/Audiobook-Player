import AppScreen from "@/src/components/screens/AppScreen";
import {ThemedText} from "@/src/components/common/ThemedText";
import {useTranslation} from "react-i18next";

export interface AppInitializationFailedProps {}

export default function AppInitializationFailed(props: AppInitializationFailedProps) {
    const {t} = useTranslation();

    return (
        <AppScreen testID={"Screen.AppInitializationFailed"}>
            <ThemedText type={'error'} center={true}>{t('AppInitializationFailedMessage')}</ThemedText>
        </AppScreen>
    )
}
