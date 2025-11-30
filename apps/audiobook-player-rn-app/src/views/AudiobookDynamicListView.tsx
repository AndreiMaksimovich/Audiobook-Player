import {GetAudiobooksRequest, GetAudiobooksResponse} from "shared";
import {
    useLazyGetAudiobooksQuery
} from "@/src/store/AudiobookProviderApi";
import {useEffect, useState} from "react";
import {VStackView} from "@/src/views/VStackView";
import {HStackView} from "@/src/views/HStackView";
import {ActivityIndicator, Button} from "react-native";
import {HumanReadableErrorView} from "@/src/views/HumanReadableErrorView";
import {ThemedText} from "@/src/views/ThemedText";
import {AudiobookListView} from "@/src/views/AudiobookListView";
import {AudiobooksPerPage} from "@/src/config";
import {FetchBaseQueryError} from "@reduxjs/toolkit/query";
import {SerializedError} from "@reduxjs/toolkit";
import {useTranslation} from "react-i18next";
import SpacerView from "@/src/views/SpacerView";

export interface AudiobookDynamicListViewProps {
    hidePages?: boolean,
    hideError?: boolean,
    hideNoAudiobooksMessage?: boolean,
    baseRequest: GetAudiobooksRequest,
    onQueryStateChanged?: (response: GetAudiobooksResponse | undefined, error:  FetchBaseQueryError | SerializedError | undefined, isLoading: boolean) => void
}

export default function AudiobookDynamicListView(props: AudiobookDynamicListViewProps) {
    const elementsPerPage = props.baseRequest.limit ?? AudiobooksPerPage;
    const [request, setRequest] = useState(props.baseRequest);
    const [trigger, {data: response, error, isLoading}] = useLazyGetAudiobooksQuery();
    const {t} = useTranslation()

    useEffect(() => {
        trigger(request)
    }, [request]);

    useEffect(() => {
        if (props.baseRequest !== request) {
            setRequest(props.baseRequest);
        }
    }, [props.baseRequest]);

    useEffect(() => {
        props.onQueryStateChanged?.(response, error, isLoading);
    }, [response, error, isLoading]);

    return (
        <VStackView>
            {/* Activity Indicator */}
            {isLoading && (<ActivityIndicator />)}

            {/* Error */}
            {!props.hideError && error && (<HumanReadableErrorView error={error} showRetryButton={true} onRetryButtonClick={() => { trigger(request) }} />)}

            {/* No Audiobooks */}
            {!props.hideNoAudiobooksMessage && response && response.totalCount === 0 && (<ThemedText type={"subtitle"}>{t("NoAudiobooks")}</ThemedText> )}

            {/* Audiobooks */}
            {response && response.totalCount>0 && (
                <>
                    <AudiobookListView audiobooks={response.audiobooks}/>
                    <SpacerView size={10}/>
                    {!props.hidePages && response.totalCount > elementsPerPage && (
                        <HStackView justifyContent={"space-between"}>
                            {request.offset > 0 && (<Button title={t("Previous")} onPress={() => setRequest({...request, offset: request.offset - elementsPerPage})}/>)}
                            <SpacerView size={10}/>
                            {request.offset + elementsPerPage < response.totalCount && (<Button title={t("Next")} onPress={() => setRequest({...request, offset: request.offset + elementsPerPage})}/>)}
                        </HStackView>
                    )}
                </>
            )}
        </VStackView>
    )
}
