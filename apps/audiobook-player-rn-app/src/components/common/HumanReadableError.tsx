import {SerializedError} from "@reduxjs/toolkit";
import {FetchBaseQueryError} from "@reduxjs/toolkit/query";
import {Button, View} from "react-native";
import {ThemedText} from "@/src/components/common/ThemedText";
import {useTranslation} from "react-i18next";

export interface HumanReadableErrorProps {
    error: FetchBaseQueryError | SerializedError | undefined | Error
    showRetryButton: boolean,
    onRetryButtonClick?: () => void,
}

export function HumanReadableError(props: HumanReadableErrorProps) {
    const {t} = useTranslation()
    return (
        <View>
            <ThemedText type={"error"}>{JSON.stringify(props.error)}</ThemedText>
            {(props.showRetryButton) && (<Button title={t("Retry")} onPress={props.onRetryButtonClick}/> )}
        </View>
    )
}
