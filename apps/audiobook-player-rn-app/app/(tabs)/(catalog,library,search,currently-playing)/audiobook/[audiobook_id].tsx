import { useLocalSearchParams, useNavigation } from 'expo-router';
import {useLazyGetAudiobookQuery} from "@/src/store/AudiobookProviderApi";
import {ActivityIndicator} from "react-native"
import AudiobookView from "@/src/views/AudiobookView";
import {HumanReadableErrorView} from "@/src/views/HumanReadableErrorView";
import {useEffect, useState} from "react";
import AppScreenView from "@/src/views/AppScreenView";

export default function ScreenAudiobook() {
    const navigation = useNavigation();
    const { audiobook_id } = useLocalSearchParams();
    const [id, setId] = useState(parseInt(audiobook_id as string))

    const [trigger, {data: audiobook, error, isLoading}] = useLazyGetAudiobookQuery();

    useEffect(() => {
        trigger(id)
    }, []);

    useEffect(() => {
        if (audiobook) {
            navigation.setOptions({ title: audiobook.title });
        }
    }, [audiobook]);

    return (
        <AppScreenView  >

            {isLoading && (<ActivityIndicator />)}

            {error && (<HumanReadableErrorView error={error} showRetryButton={true} onRetryButtonClick={() => { trigger(id) }}/> )}

            {audiobook && (<AudiobookView audiobook={audiobook}/>)}

        </AppScreenView>
    )
}
