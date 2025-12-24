import {Tag} from "shared";
import { Link } from 'expo-router';
import {ThemedText} from "@/src/components/common/ThemedText";
import {ViewProps} from "react-native";

export interface TagLinkProps extends ViewProps{
    tag: Tag
}

export default function TagLink(props: TagLinkProps) {
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
