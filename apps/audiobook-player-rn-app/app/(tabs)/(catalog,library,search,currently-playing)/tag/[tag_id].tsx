import {ThemedText} from "@/src/views/ThemedText";
import { useLocalSearchParams, useNavigation } from 'expo-router';
import {useEffect} from "react";
import {useGetTagQuery} from "@/src/store/AudiobookProviderApi";
import {ActivityIndicator, View} from "react-native"
import AudiobookDynamicListView from "@/src/views/AudiobookDynamicListView";
import {AudiobooksPerPage} from "@/src/config";
import AppScreenView from "@/src/views/AppScreenView";

export default function ScreenTag() {
    const navigation = useNavigation();
    const { tag_id } = useLocalSearchParams();
    const id = parseInt(tag_id as string)

    const {data: tag, error, isLoading} = useGetTagQuery(id);

    useEffect(() => {
        if (tag) {
            navigation.setOptions({ title: tag.name });
        }
    }, [tag]);

    return (
        <AppScreenView>
            {isLoading && (<ActivityIndicator />)}

            {tag && (
                <View>
                    <ThemedText type={"title"}>{tag.name}</ThemedText>
                    <ThemedText type={"default"}>{tag.description}</ThemedText>
                </View>
            )}

            <AudiobookDynamicListView baseRequest={{
                tagId: id,
                offset: 0,
                limit: AudiobooksPerPage,
            }} />
        </AppScreenView>
    )
}
