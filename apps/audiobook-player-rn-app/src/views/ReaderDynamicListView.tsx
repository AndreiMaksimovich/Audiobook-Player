import {
    GetReadersRequest,
    GetReadersResponse
} from "shared";
import {useLazyGetReadersQuery} from "@/src/store/AudiobookProviderApi";
import {useEffect, useState} from "react";
import {VStackView} from "@/src/views/VStackView";
import {HStackView} from "@/src/views/HStackView";
import {ActivityIndicator, Button} from "react-native";
import {HumanReadableErrorView} from "@/src/views/HumanReadableErrorView";
import {ReadersPerPage} from "@/src/config";
import {FetchBaseQueryError} from "@reduxjs/toolkit/query";
import {SerializedError} from "@reduxjs/toolkit";
import {ThemedText} from "@/src/views/ThemedText";
import ReaderListView from "@/src/views/ReaderListView";
import {useTranslation} from "react-i18next";
import SpacerView from "@/src/views/SpacerView";

export interface ReaderDynamicListProps {
    baseRequest: GetReadersRequest,
    hidePages?: boolean,
    hideError?: boolean,
    elementsPerPage?: number,
    hideNoAuthorsMessage?: boolean,
    onQueryStateChanged?: (response: GetReadersResponse | undefined, error:  FetchBaseQueryError | SerializedError | undefined, isLoading: boolean) => void
}

export default function ReaderDynamicListView(props: ReaderDynamicListProps) {
    const {t} = useTranslation()

    const [trigger, {data: response, error, isLoading}] = useLazyGetReadersQuery()
    const [request, setRequest] = useState(props.baseRequest)

    const elementsPerPage = props.elementsPerPage ?? ReadersPerPage;

    useEffect(() => {
        if (request !== props.baseRequest) {
            setRequest(props.baseRequest);
        }
    }, [props.baseRequest]);

    useEffect(() => {
        trigger(request)
    }, [request]);

    useEffect(() => {
        props.onQueryStateChanged?.(response, error, isLoading);
    }, [response, error, isLoading]);

    return (
        <VStackView>
            {/* Activity indicator */}
            {isLoading && (<ActivityIndicator />)}

            {/* Error */}
            {!props.hideError && error && (<HumanReadableErrorView error={error} showRetryButton={true} onRetryButtonClick={() => { trigger(request) }} />)}

            {/* No Authors */}
            {!props.hideNoAuthorsMessage && response && response.totalCount === 0 && (<ThemedText type={"subtitle"}>{t("NoReaders")}</ThemedText> )}

            {/* Authors */}
            {response && (
                <>
                    <ReaderListView readers={response.readers}/>
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
