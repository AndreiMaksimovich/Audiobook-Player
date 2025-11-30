import {ViewProps} from "react-native";
import {Link} from "expo-router";

export interface AudiobookLinkViewProps extends ViewProps{
    audiobookId: number;
}

export function AudiobookLinkView(props: AudiobookLinkViewProps) {
    return (
        <Link
            href={{
                pathname: `/audiobook/[audiobook_id]`,
                params: {audiobook_id: props.audiobookId}
            }}
            withAnchor>
            {props.children}
        </Link>
    )
}
