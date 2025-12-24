import {AudiobookListElement, AudiobookListElementProps} from "@/src/components/app/AudiobookListElement";
import {Audiobook} from "shared";
import {VStack} from "@/src/components/common/VStack";

export interface AudiobookListProps {
    audiobooks: Audiobook[] | null;
    mode?: 'online' | 'offline';
}

export function AudiobookList(props: AudiobookListProps) {
    return (
        <VStack>
            {props.audiobooks && props.audiobooks.map((audiobook: Audiobook) => (<AudiobookListElement mode={props.mode} audiobook={audiobook} key={audiobook.id}/>))}
        </VStack>
    )
}
