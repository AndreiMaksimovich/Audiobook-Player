import {useLazyGetTagsQuery} from "@/src/store/AudiobookProviderApi";
import {ActivityIndicator} from "react-native";
import {useEffect} from "react";
import {HumanReadableErrorView} from "@/src/views/HumanReadableErrorView";
import TagsView from "@/src/views/TagsView";

export interface TagsDynamicViewProps {
    hideError?: boolean;
}

export default function TagsDynamicView(props: TagsDynamicViewProps) {
    const [trigger, {data: tags, error, isLoading}] = useLazyGetTagsQuery()

    useEffect(() => {
        trigger()
    }, [])

    return (
        <>
            {/* Activity indicator */}
            {isLoading && (<ActivityIndicator/>)}

            {/* Error */}
            {!props.hideError && error && (<HumanReadableErrorView error={error} showRetryButton={true} onRetryButtonClick={trigger}/> )}

            {/* Tags */}
            {tags && (<TagsView tags={tags}/> )}
        </>
    )
}
