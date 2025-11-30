import {ThemedText} from "@/src/views/ThemedText";
import { useLocalSearchParams, useNavigation } from 'expo-router';
import {useEffect} from "react";
import {useGetReaderQuery} from "@/src/store/AudiobookProviderApi";
import {ActivityIndicator, View} from "react-native"
import AudiobookDynamicListView from "@/src/views/AudiobookDynamicListView";
import {AudiobooksPerPage} from "@/src/config";
import AppScreenView from "@/src/views/AppScreenView";

export default function ScreenReader() {
    const navigation = useNavigation();
    const { reader_id } = useLocalSearchParams();
    const id = parseInt(reader_id as string)

    const {data: reader, error, isLoading} = useGetReaderQuery(id);

    useEffect(() => {
        if (reader) {
            navigation.setOptions({ title: reader.name });
        }
    }, [reader]);

    return (
        <AppScreenView>
            {isLoading && (<ActivityIndicator />)}

            {reader && (
                <View>
                    <ThemedText type={"title"}>{reader.name}</ThemedText>
                    <ThemedText type={"default"}>{reader.description}</ThemedText>
                </View>
            )}

            <AudiobookDynamicListView baseRequest={{
                readerId: id,
                offset: 0,
                limit: AudiobooksPerPage,
            }} />
        </AppScreenView>
    )
}
