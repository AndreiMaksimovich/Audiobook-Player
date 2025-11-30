import {Reader} from "shared";
import { Link } from 'expo-router';
import {ViewProps} from "react-native";
import {ThemedText} from "@/src/views/ThemedText";

export interface ReaderLinkViewProps extends ViewProps{
    reader: Reader
}

export default function ReaderLinkView(props: ReaderLinkViewProps) {
    return (
        <Link
            href={{
                pathname: `/reader/[reader_id]`,
                params: {reader_id: props.reader.id}
            }}
            withAnchor>
            {props.children ? props.children : (<ThemedText type={"navLink"}>{props.reader.name}</ThemedText>)}
        </Link>
    )
}
