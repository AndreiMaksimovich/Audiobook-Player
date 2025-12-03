import {SerializedError} from "@reduxjs/toolkit";
import {FetchBaseQueryError} from "@reduxjs/toolkit/query";
import {Button, View} from "react-native";
import {ThemedText} from "@/src/views/ThemedText";
import {useTranslation} from "react-i18next";

export interface HumanReadableErrorViewProps {
    error: FetchBaseQueryError | SerializedError | undefined | Error
    showRetryButton: boolean,
    onRetryButtonClick?: () => void,
}

export function HumanReadableErrorView(props: HumanReadableErrorViewProps) {
    const {t} = useTranslation()
    return (
        <View>
            <ThemedText type={"error"}>{JSON.stringify(props.error)}</ThemedText>
            {(props.showRetryButton) && (<Button title={t("Retry")} onPress={props.onRetryButtonClick}/> )}
        </View>
    )
}
