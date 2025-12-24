import {ViewProps} from "react-native";
import {Link} from "expo-router";

export interface AudiobookLinkProps extends ViewProps{
    audiobookId: number;
    mode?: 'online' | 'offline';
}

export function AudiobookLink(props: AudiobookLinkProps) {
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
