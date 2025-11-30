import {ThemedText} from "@/src/views/ThemedText";
import { useLocalSearchParams, useNavigation } from 'expo-router';
import {useEffect} from "react";
import {useGetAuthorQuery} from "@/src/store/AudiobookProviderApi";
import {ActivityIndicator, View} from "react-native"
import AudiobookDynamicListView from "@/src/views/AudiobookDynamicListView";
import {AudiobooksPerPage} from "@/src/config";
import AppScreenView from "@/src/views/AppScreenView";

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
        <AppScreenView>
            {isAuthorLoading && (<ActivityIndicator />)}

            {author && (
                <View>
                    <ThemedText type={"title"}>{author.name}</ThemedText>
                    <ThemedText type={"default"}>{author.description}</ThemedText>
                </View>
            )}

            <AudiobookDynamicListView baseRequest={{
                authorId: id,
                offset: 0,
                limit: AudiobooksPerPage,
            }} />
        </AppScreenView>
    )
}
