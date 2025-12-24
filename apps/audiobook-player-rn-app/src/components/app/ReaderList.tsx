import {VStack} from "@/src/components/common/VStack";
import {Reader} from "shared";
import ReaderLink from "@/src/components/app/ReaderLink";

export interface ReaderListProps {
    readers: Reader[]
}

export default function ReaderList(props: ReaderListProps) {
    return (
        <VStack>
            {props.readers.map(reader => (<ReaderLink key={reader.id} reader={reader}/>))}
        </VStack>
    )
}
