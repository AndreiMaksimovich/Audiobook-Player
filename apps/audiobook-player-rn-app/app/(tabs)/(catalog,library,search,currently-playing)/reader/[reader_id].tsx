import {ThemedText} from "@/src/components/common/ThemedText";
import { useLocalSearchParams, useNavigation } from 'expo-router';
import {useEffect} from "react";
import {useGetReaderQuery} from "@/src/store/AudiobookProviderApi";
import {ActivityIndicator, View} from "react-native"
import AudiobookDynamicList from "@/src/components/app/AudiobookDynamicList";
import {AudiobooksPerPage} from "@/src/config";
import AppScreen from "@/src/components/screens/AppScreen";

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
        <AppScreen>
            {isLoading && (<ActivityIndicator />)}

            {reader && (
                <View>
                    <ThemedText type={"title"}>{reader.name}</ThemedText>
                    <ThemedText type={"default"}>{reader.description}</ThemedText>
                </View>
            )}

            <AudiobookDynamicList baseRequest={{
                readerId: id,
                offset: 0,
                limit: AudiobooksPerPage,
            }} />
        </AppScreen>
    )
}
