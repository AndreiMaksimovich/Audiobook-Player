import {useGetAudiobookQuery} from "@/src/store/AudiobookProviderApi";
import {JSX} from "react";
import {ActivityIndicator, View} from "react-native"
import {ThemedText} from "@/src/views/ThemedText";
import AudiobookView from "@/src/views/AudiobookView";

export interface AudiobookDynamicViewProps {
    audiobookId: number;
}

export default function AudiobookDynamicView(props: AudiobookDynamicViewProps): JSX.Element {

    const {data: audiobook, error, isLoading} = useGetAudiobookQuery(props.audiobookId);

    return (
        <View>
            {isLoading && <ActivityIndicator/>}

            {error && <ThemedText type={"error"}>Error: {JSON.stringify(error)}</ThemedText>}

            {audiobook && (<AudiobookView audiobook={audiobook}/>)}
        </View>
    )
}
