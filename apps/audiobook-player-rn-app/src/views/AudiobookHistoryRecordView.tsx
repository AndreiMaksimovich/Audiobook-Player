import {AudiobookHistoryRecord} from "@/src/data/AudiobookHistoryRecord";
import {AudiobookLinkView} from "@/src/views/AudiobookLinkView";
import {ThemedText} from "@/src/views/ThemedText";
import {VStackView} from "@/src/views/VStackView";
import HSplitterView from "@/src/views/HSplitterView";

export interface AudiobookHistoryRecordViewProps {
    record: AudiobookHistoryRecord
}

export default function AudiobookHistoryRecordView(props: AudiobookHistoryRecordViewProps) {

    return (
        <AudiobookLinkView audiobookId={props.record.id}>
            <VStackView style={{padding: 5, width: "100%"}}>
                <ThemedText type={"linkSemiBold"}>{props.record.title}</ThemedText>
                <ThemedText type={"default"}>{props.record.author} / {props.record.reader}</ThemedText>
                <HSplitterView />
            </VStackView>

        </AudiobookLinkView>
    )

}
