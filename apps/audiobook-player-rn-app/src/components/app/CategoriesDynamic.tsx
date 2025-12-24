import {useLazyGetCategoriesQuery} from "@/src/store/AudiobookProviderApi";
import {ActivityIndicator} from "react-native";
import {useEffect} from "react";
import {HumanReadableError} from "@/src/components/common/HumanReadableError";
import Categories from "@/src/components/app/Categories";

export interface CategoriesDynamicProps {
    hideError?: boolean;
}

export default function CategoriesDynamic(props: CategoriesDynamicProps) {
    const [trigger, {data: categories, error, isLoading}] = useLazyGetCategoriesQuery()

    useEffect(() => {
        trigger()
    }, [])

    return (
        <>
            {/* Activity indicator */}
            {isLoading && (<ActivityIndicator/>)}

            {/* Error */}
            {!props.hideError && error && (<HumanReadableError error={error} showRetryButton={true} onRetryButtonClick={() => trigger()}/> )}

            {/* Categories */}
            {categories && (<Categories categories={categories}/> )}
        </>
    )
}
