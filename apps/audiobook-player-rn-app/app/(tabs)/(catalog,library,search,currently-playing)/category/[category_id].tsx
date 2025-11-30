import {ThemedText} from "@/src/views/ThemedText";
import { useLocalSearchParams, useNavigation } from 'expo-router';
import {ActivityIndicator, View} from "react-native"
import {useLazyGetCategoryQuery} from "@/src/store/AudiobookProviderApi";
import {useEffect} from "react";
import AudiobookDynamicListView from "@/src/views/AudiobookDynamicListView";
import {AudiobooksPerPage} from "@/src/config";
import AppScreenView from "@/src/views/AppScreenView";

export default function ScreenCategory() {
    const navigation = useNavigation();
    const { category_id } = useLocalSearchParams();
    const id = parseInt(category_id as string)

    const [getCategoryTrigger, {data: category, error: getCategoryError, isLoading: isCategoryLoading}] = useLazyGetCategoryQuery();

    useEffect(() => {
        getCategoryTrigger(id)
    }, []);

    useEffect(() => {
        if (category) {
            navigation.setOptions({ title: category.name });
        }
    }, [category]);

    return (
        <AppScreenView>
            {isCategoryLoading && (<ActivityIndicator />)}

            {category && (
                <View>
                    <ThemedText type={"title"}>{category.name}</ThemedText>
                    <ThemedText type={"default"}>{category.description}</ThemedText>
                </View>
            )}

            <AudiobookDynamicListView baseRequest={{
                categoryId: id,
                offset: 0,
                limit: AudiobooksPerPage,
            }} />
        </AppScreenView>
    )
}
