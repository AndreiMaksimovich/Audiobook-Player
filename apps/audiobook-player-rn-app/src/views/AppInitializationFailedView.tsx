import AppScreenView from "@/src/views/AppScreenView";
import {ThemedText} from "@/src/views/ThemedText";
import {useTranslation} from "react-i18next";

export interface AppInitializationFailedProps {}

export default function AppInitializationFailed(props: AppInitializationFailedProps) {
    const {t} = useTranslation();

    return (
        <AppScreenView>
            <ThemedText type={'error'} center={true}>{t('AppInitializationFailedMessage')}</ThemedText>
        </AppScreenView>
    )
}
