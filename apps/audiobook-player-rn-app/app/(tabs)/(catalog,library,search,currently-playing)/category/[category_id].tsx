import {ThemedText} from "@/src/components/common/ThemedText";
import { useLocalSearchParams, useNavigation } from 'expo-router';
import {ActivityIndicator, View} from "react-native"
import {useLazyGetCategoryQuery} from "@/src/store/AudiobookProviderApi";
import {useEffect} from "react";
import AudiobookDynamicList from "@/src/components/app/AudiobookDynamicList";
import {AudiobooksPerPage} from "@/src/config";
import AppScreen from "@/src/components/screens/AppScreen";

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
        <AppScreen>
            {isCategoryLoading && (<ActivityIndicator />)}

            {category && (
                <View>
                    <ThemedText type={"title"}>{category.name}</ThemedText>
                    <ThemedText type={"default"}>{category.description}</ThemedText>
                </View>
            )}

            <AudiobookDynamicList baseRequest={{
                categoryId: id,
                offset: 0,
                limit: AudiobooksPerPage,
            }} />
        </AppScreen>
    )
}
