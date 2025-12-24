import {AudiobookHistoryRecord} from "@/src/lib/app-persistent-storage";
import {AudiobookLink} from "@/src/components/app/AudiobookLink";
import {ThemedText} from "@/src/components/common/ThemedText";
import {VStack} from "@/src/components/common/VStack";
import HSplitter from "@/src/components/common/HSplitter";

export interface AudiobookHistoryRecordViewProps {
    record: AudiobookHistoryRecord
}

export default function AudiobookHistoryRecordView(props: AudiobookHistoryRecordViewProps) {

    return (
        <AudiobookLink audiobookId={props.record.id}>
            <VStack style={{padding: 5, width: "100%"}}>
                <ThemedText type={"linkSemiBold"}>{props.record.title}</ThemedText>
                <ThemedText type={"default"}>{props.record.author} / {props.record.reader}</ThemedText>
                <HSplitter />
            </VStack>

        </AudiobookLink>
    )

}
