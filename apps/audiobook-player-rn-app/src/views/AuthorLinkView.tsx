import {Author} from "shared";
import { Link } from 'expo-router';
import {ViewProps} from "react-native";
import {ThemedText} from "@/src/views/ThemedText";

export interface AuthorLinkViewProps extends ViewProps{
    author: Author
}

export default function AuthorLinkView(props: AuthorLinkViewProps) {
    return (
        <Link
            href={{
                pathname: `/author/[author_id]`,
                params: {author_id: props.author.id}
            }}
            withAnchor>
            {props.children ? props.children : (<ThemedText type={"navLink"}>{props.author.name}</ThemedText>)}
        </Link>
    )
}
