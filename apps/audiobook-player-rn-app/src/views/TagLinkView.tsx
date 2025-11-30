import {Tag} from "shared";
import { Link } from 'expo-router';
import {ThemedText} from "@/src/views/ThemedText";
import {ViewProps} from "react-native";

export interface TagLinkViewProps extends ViewProps{
    tag: Tag
}

export default function TagLinkView(props: TagLinkViewProps) {
    return (
        <Link
            href={{
                pathname: `/tag/[tag_id]`,
                params: {tag_id: props.tag.id}
            }}
            withAnchor>
            {props.children ? props.children : (<ThemedText type={"navLink"}>{props.tag.name}</ThemedText>)}
        </Link>
    )
}
