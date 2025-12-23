import {useLazyGetTagsQuery} from "@/src/store/AudiobookProviderApi";
import {ActivityIndicator} from "react-native";
import {useEffect} from "react";
import {HumanReadableError} from "@/src/components/common/HumanReadableError";
import Tags from "@/src/components/app/Tags";

export interface TagsDynamicProps {
    hideError?: boolean;
}

export default function TagsDynamic(props: TagsDynamicProps) {
    const [trigger, {data: tags, error, isLoading}] = useLazyGetTagsQuery()

    useEffect(() => {
        trigger()
    }, [])

    return (
        <>
            {/* Activity indicator */}
            {isLoading && (<ActivityIndicator/>)}

            {/* Error */}
            {!props.hideError && error && (<HumanReadableError error={error} showRetryButton={true} onRetryButtonClick={() => trigger()}/> )}

            {/* Tags */}
            {tags && (<Tags tags={tags}/> )}
        </>
    )
}
