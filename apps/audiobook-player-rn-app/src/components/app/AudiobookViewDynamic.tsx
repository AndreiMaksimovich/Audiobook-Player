import {useGetAudiobookQuery} from "@/src/store/AudiobookProviderApi";
import {JSX} from "react";
import {ActivityIndicator, View} from "react-native"
import {ThemedText} from "@/src/components/common/ThemedText";
import AudiobookView from "@/src/components/app/AudiobookView";

export interface AudiobookViewDynamicProps {
    audiobookId: number;
}

export default function AudiobookViewDynamic(props: AudiobookViewDynamicProps): JSX.Element {

    const {data: audiobook, error, isLoading} = useGetAudiobookQuery(props.audiobookId);

    return (
        <View>
            {isLoading && <ActivityIndicator/>}

            {error && <ThemedText type={"error"}>Error: {JSON.stringify(error)}</ThemedText>}

            {audiobook && (<AudiobookView audiobook={audiobook}/>)}
        </View>
    )
}
