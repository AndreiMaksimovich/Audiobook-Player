import {AudiobookListElementView, AudiobookListElementViewProps} from "@/src/views/AudiobookListElementView";
import {Audiobook} from "shared";
import {VStackView} from "@/src/views/VStackView";

export interface AudiobookListViewProps {
    audiobooks: Audiobook[] | null;
    mode?: 'online' | 'offline';
}

export function AudiobookListView(props: AudiobookListViewProps) {
    return (
        <VStackView>
            {props.audiobooks && props.audiobooks.map((audiobook: Audiobook) => (<AudiobookListElementView mode={props.mode} audiobook={audiobook} key={audiobook.id}/>))}
        </VStackView>
    )
}
