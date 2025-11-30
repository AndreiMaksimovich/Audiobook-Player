import {useLazyGetCategoriesQuery} from "@/src/store/AudiobookProviderApi";
import {ActivityIndicator} from "react-native";
import {useEffect} from "react";
import {HumanReadableErrorView} from "@/src/views/HumanReadableErrorView";
import CategoriesView from "@/src/views/CategoriesView";

export interface CategoriesDynamicViewProps {
    hideError?: boolean;
}

export default function CategoriesDynamicView(props: CategoriesDynamicViewProps) {
    const [trigger, {data: categories, error, isLoading}] = useLazyGetCategoriesQuery()

    useEffect(() => {
        trigger()
    }, [])

    return (
        <>
            {/* Activity indicator */}
            {isLoading && (<ActivityIndicator/>)}

            {/* Error */}
            {!props.hideError && error && (<HumanReadableErrorView error={error} showRetryButton={true} onRetryButtonClick={trigger}/> )}

            {/* Categories */}
            {categories && (<CategoriesView categories={categories}/> )}
        </>
    )
}
