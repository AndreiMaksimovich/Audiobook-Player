import {Audiobook, Author} from "shared";
import { Link } from 'expo-router';
import {ViewProps} from "react-native";
import {ThemedText} from "@/src/views/ThemedText";

export interface OfflineAudiobookLinkViewProps extends ViewProps{
    audiobook: Audiobook
}

export default function OfflineAudiobookLinkView(props: OfflineAudiobookLinkViewProps) {
    return (
        <Link
            href={{
                pathname: `/offline-audiobook/[audiobook_id]`,
                params: {audiobook_id: props.audiobook.id}
            }}
            withAnchor>
            {props.children ? props.children : (<ThemedText type={"navLink"}>{props.audiobook.title}</ThemedText>)}
        </Link>
    )
}
