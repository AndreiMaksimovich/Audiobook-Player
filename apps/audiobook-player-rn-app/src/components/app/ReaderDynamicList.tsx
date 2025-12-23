import {
    GetReadersRequest,
    GetReadersResponse
} from "shared";
import {useLazyGetReadersQuery} from "@/src/store/AudiobookProviderApi";
import {useEffect, useState} from "react";
import {VStack} from "@/src/components/common/VStack";
import {HStack} from "@/src/components/common/HStack";
import {ActivityIndicator, Button} from "react-native";
import {HumanReadableError} from "@/src/components/common/HumanReadableError";
import {ReadersPerPage} from "@/src/config";
import {FetchBaseQueryError} from "@reduxjs/toolkit/query";
import {SerializedError} from "@reduxjs/toolkit";
import {ThemedText} from "@/src/components/common/ThemedText";
import ReaderList from "@/src/components/app/ReaderList";
import {useTranslation} from "react-i18next";
import Spacer from "@/src/components/common/Spacer";

export interface ReaderDynamicListProps {
    baseRequest: GetReadersRequest,
    hidePages?: boolean,
    hideError?: boolean,
    elementsPerPage?: number,
    hideNoAuthorsMessage?: boolean,
    onQueryStateChanged?: (response: GetReadersResponse | undefined, error:  FetchBaseQueryError | SerializedError | undefined, isLoading: boolean) => void
}

export default function ReaderDynamicList(props: ReaderDynamicListProps) {
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
        <VStack>
            {/* Activity indicator */}
            {isLoading && (<ActivityIndicator />)}

            {/* Error */}
            {!props.hideError && error && (<HumanReadableError error={error} showRetryButton={true} onRetryButtonClick={() => { trigger(request) }} />)}

            {/* No Authors */}
            {!props.hideNoAuthorsMessage && response && response.totalCount === 0 && (<ThemedText type={"subtitle"}>{t("NoReaders")}</ThemedText> )}

            {/* Authors */}
            {response && (
                <>
                    <ReaderList readers={response.readers}/>
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
