import {VStackView} from "@/src/views/VStackView";
import {Reader} from "shared";
import ReaderLinkView from "@/src/views/ReaderLinkView";

export interface ReaderListViewProps {
    readers: Reader[]
}

export default function ReaderListView(props: ReaderListViewProps) {
    return (
        <VStackView>
            {props.readers.map(reader => (<ReaderLinkView key={reader.id} reader={reader}/>))}
        </VStackView>
    )
}
