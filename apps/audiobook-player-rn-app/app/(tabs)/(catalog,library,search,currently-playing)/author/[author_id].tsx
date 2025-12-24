import {ThemedText} from "@/src/components/common/ThemedText";
import { useLocalSearchParams, useNavigation } from 'expo-router';
import {useEffect} from "react";
import {useGetAuthorQuery} from "@/src/store/AudiobookProviderApi";
import {ActivityIndicator, View} from "react-native"
import AudiobookDynamicList from "@/src/components/app/AudiobookDynamicList";
import {AudiobooksPerPage} from "@/src/config";
import AppScreen from "@/src/components/screens/AppScreen";

export default function ScreenAuthor() {
    const navigation = useNavigation();
    const { author_id } = useLocalSearchParams();
    const id = parseInt(author_id as string)

    const {data: author, error: getAuthorError, isLoading: isAuthorLoading} = useGetAuthorQuery(id);

    useEffect(() => {
        if (author) {
            navigation.setOptions({ title: author.name });
        }
    }, [author]);

    return (
        <AppScreen>
            {isAuthorLoading && (<ActivityIndicator />)}

            {author && (
                <View>
                    <ThemedText type={"title"}>{author.name}</ThemedText>
                    <ThemedText type={"default"}>{author.description}</ThemedText>
                </View>
            )}

            <AudiobookDynamicList baseRequest={{
                authorId: id,
                offset: 0,
                limit: AudiobooksPerPage,
            }} />
        </AppScreen>
    )
}
