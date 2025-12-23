import {Reader} from "shared";
import { Link } from 'expo-router';
import {ViewProps} from "react-native";
import {ThemedText} from "@/src/components/common/ThemedText";

export interface ReaderLinkProps extends ViewProps{
    reader: Reader
}

export default function ReaderLink(props: ReaderLinkProps) {
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
