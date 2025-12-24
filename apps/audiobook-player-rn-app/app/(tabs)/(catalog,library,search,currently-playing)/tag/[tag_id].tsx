import {ThemedText} from "@/src/components/common/ThemedText";
import { useLocalSearchParams, useNavigation } from 'expo-router';
import {useEffect} from "react";
import {useGetTagQuery} from "@/src/store/AudiobookProviderApi";
import {ActivityIndicator, View} from "react-native"
import AudiobookDynamicList from "@/src/components/app/AudiobookDynamicList";
import {AudiobooksPerPage} from "@/src/config";
import AppScreen from "@/src/components/screens/AppScreen";

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
        <AppScreen>
            {isLoading && (<ActivityIndicator />)}

            {tag && (
                <View>
                    <ThemedText type={"title"}>{tag.name}</ThemedText>
                    <ThemedText type={"default"}>{tag.description}</ThemedText>
                </View>
            )}

            <AudiobookDynamicList baseRequest={{
                tagId: id,
                offset: 0,
                limit: AudiobooksPerPage,
            }} />
        </AppScreen>
    )
}
