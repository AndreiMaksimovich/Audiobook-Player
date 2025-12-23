import {GetAudiobooksRequest, GetAudiobooksResponse} from "shared";
import {
    useLazyGetAudiobooksQuery
} from "@/src/store/AudiobookProviderApi";
import {useEffect, useState} from "react";
import {VStack} from "@/src/components/common/VStack";
import {HStack} from "@/src/components/common/HStack";
import {ActivityIndicator, Button} from "react-native";
import {HumanReadableError} from "@/src/components/common/HumanReadableError";
import {ThemedText} from "@/src/components/common/ThemedText";
import {AudiobookList} from "@/src/components/app/AudiobookList";
import {AudiobooksPerPage} from "@/src/config";
import {FetchBaseQueryError} from "@reduxjs/toolkit/query";
import {SerializedError} from "@reduxjs/toolkit";
import {useTranslation} from "react-i18next";
import Spacer from "@/src/components/common/Spacer";

export interface AudiobookDynamicListProps {
    hidePages?: boolean,
    hideError?: boolean,
    hideNoAudiobooksMessage?: boolean,
    baseRequest: GetAudiobooksRequest,
    onQueryStateChanged?: (response: GetAudiobooksResponse | undefined, error:  FetchBaseQueryError | SerializedError | undefined, isLoading: boolean) => void
}

export default function AudiobookDynamicList(props: AudiobookDynamicListProps) {
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
        <VStack>
            {/* Activity Indicator */}
            {isLoading && (<ActivityIndicator />)}

            {/* Error */}
            {!props.hideError && error && (<HumanReadableError error={error} showRetryButton={true} onRetryButtonClick={() => { trigger(request) }} />)}

            {/* No Audiobooks */}
            {!props.hideNoAudiobooksMessage && response && response.totalCount === 0 && (<ThemedText type={"subtitle"}>{t("NoAudiobooks")}</ThemedText> )}

            {/* Audiobooks */}
            {response && response.totalCount>0 && (
                <>
                    <AudiobookList audiobooks={response.audiobooks}/>
                    <Spacer size={10}/>
                    {!props.hidePages && response.totalCount > elementsPerPage && (
                        <HStack justifyContent={"space-between"}>
                            {request.offset > 0 && (<Button title={t("Previous")} onPress={() => setRequest({...request, offset: request.offset - elementsPerPage})}/>)}
                            <Spacer size={10}/>
                            {request.offset + elementsPerPage < response.totalCount && (<Button title={t("Next")} onPress={() => setRequest({...request, offset: request.offset + elementsPerPage})}/>)}
                        </HStack>
                    )}
                </>
            )}
        </VStack>
    )
}
