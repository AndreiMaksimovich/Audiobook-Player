import {ViewProps} from "react-native";
import {Link} from "expo-router";

export interface AudiobookLinkViewProps extends ViewProps{
    audiobookId: number;
    mode?: 'online' | 'offline';
}

export function AudiobookLinkView(props: AudiobookLinkViewProps) {
    return (
        <Link
            href={{
                pathname: props.mode === 'offline' ? '/offline-audiobook/[audiobook_id]' : `/audiobook/[audiobook_id]`,
                params: {audiobook_id: props.audiobookId}
            }}
            withAnchor>
            {props.children}
        </Link>
    )
}
