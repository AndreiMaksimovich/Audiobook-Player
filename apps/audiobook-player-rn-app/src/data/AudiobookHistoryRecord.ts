import {Audiobook} from "shared";
import {DateTimeUtils} from "@/src/utils/DateTimeUtils";

export interface AudiobookHistoryRecord {
    id: number;
    title: string;
    description: string | null;
    author: string | null;
    reader: string | null
    totalDuration: number;
    timePlayed: number;
    addTime: number;
}

export function audiobookToHistoryRecord(audiobook: Audiobook, timePlayed: number = 0): AudiobookHistoryRecord {
    const author = audiobook.authors?.map(author => author.name).join(", ") ?? null;
    const reader = audiobook.readers?.map(reader => reader.name).join(", ") ?? null;

    return {
        id: audiobook.id,
        addTime: DateTimeUtils.now(),
        author: author,
        reader: reader,
        description: audiobook.description,
        timePlayed: timePlayed,
        title: audiobook.title,
        totalDuration: audiobook.totalDuration,
    }
}
