import {SerializedError} from "@reduxjs/toolkit";
import {FetchBaseQueryError} from "@reduxjs/toolkit/query";
import {Button, View} from "react-native";
import {ThemedText} from "@/src/views/ThemedText";

export interface HumanReadableErrorViewProps {
    error: FetchBaseQueryError | SerializedError | undefined | Error
    showRetryButton: boolean,
    onRetryButtonClick?: () => void,
}

export function HumanReadableErrorView(props: HumanReadableErrorViewProps) {
    return (
        <View>
            <ThemedText type={"error"}>{JSON.stringify(props.error)}</ThemedText>
            {(props.showRetryButton) && (<Button title={"Retry"} onPress={props.onRetryButtonClick}/> )}
        </View>
    )
}
