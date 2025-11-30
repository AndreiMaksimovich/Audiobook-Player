import {GetAudiobooksResponse, GetAuthorsRequest, GetAuthorsResponse} from "shared";
import {useLazyGetAuthorsQuery} from "@/src/store/AudiobookProviderApi";
import {useEffect, useState} from "react";
import {VStackView} from "@/src/views/VStackView";
import {HStackView} from "@/src/views/HStackView";
import {ActivityIndicator, Button} from "react-native";
import {HumanReadableErrorView} from "@/src/views/HumanReadableErrorView";
import AuthorListView from "@/src/views/AuthorListView";
import {AuthorsPerPage} from "@/src/config";
import {FetchBaseQueryError} from "@reduxjs/toolkit/query";
import {SerializedError} from "@reduxjs/toolkit";
import {ThemedText} from "@/src/views/ThemedText";
import {useTranslation} from "react-i18next";
import SpacerView from "@/src/views/SpacerView";

export interface AuthorDynamicListProps {
    baseRequest: GetAuthorsRequest,
    hidePages?: boolean,
    hideError?: boolean,
    elementsPerPage?: number,
    hideNoAuthorsMessage?: boolean,
    onQueryStateChanged?: (response: GetAuthorsResponse | undefined, error:  FetchBaseQueryError | SerializedError | undefined, isLoading: boolean) => void
}

export default function AuthorDynamicListView(props: AuthorDynamicListProps) {
    const {t} = useTranslation()

    const [trigger, {data: response, error, isLoading}] = useLazyGetAuthorsQuery()
    const [request, setRequest] = useState(props.baseRequest)

    const elementsPerPage = props.elementsPerPage ?? AuthorsPerPage;

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
            {!props.hideNoAuthorsMessage && response && response.totalCount === 0 && (<ThemedText type={"subtitle"}>{t("NoAuthors")}</ThemedText> )}

            {/* Authors */}
            {response && (
                <>
                    <AuthorListView authors={response.authors}/>
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
