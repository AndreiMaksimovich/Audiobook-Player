import {VStack} from "@/src/components/common/VStack";
import {Author} from "shared";
import AuthorLink from "@/src/components/app/AuthorLink";

export interface AuthorListProps {
    authors: Author[]
}

export default function AuthorList(props: AuthorListProps) {
    return (
        <VStack>
            {props.authors.map(author => (
                <AuthorLink key={author.id} author={author}/>
            ))}
        </VStack>
    )
}
